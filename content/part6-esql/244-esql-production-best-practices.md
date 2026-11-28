---
id: topic-244
slug: esql-production-best-practices
topicNumber: 244
title: "Production Best Practices & Performance"
part: 'Part 6: ESQL'
sectionNumber: 46
sectionTitle: 'Advanced'
versionBadge: 'ESQL'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Six production habits that keep ACE integrations fast, thread-safe, and secure: REFERENCE loops, COALESCE, Compute mode, BEGIN ATOMIC, secret hygiene, and Shared Library reuse."
object: "Production Best Practices"
action: "Optimize & Secure"
commandName: "Best Practices"
synonyms:
  - "esql best practices production"
  - "esql performance optimization"
  - "avoid cardinality in loop"
  - "begin atomic shared row"
  - "keep secrets out environment"
---

# Production Best Practices & Performance

ESQL compiles to native execution inside the ACE runtime, so clean ESQL processes thousands of messages per second. Follow these **six production habits** (plus extra speed rules) to avoid outages, slow loops, and security leaks.

---

## 6 Habits That Save You in Production

| Habit | Do This in Production | Why It Matters |
| :--- | :--- | :--- |
| **1. Loop with `REFERENCE`** | `DECLARE r REFERENCE TO ...Item[1]; WHILE LASTMOVE(r) ... MOVE r NEXTSIBLING REPEAT TYPE NAME;` (or `FOR`) | `Item[i]` and `CARDINALITY(...)` inside a loop walk from index `1` on every iteration ($O(N^2)$ slowdown on large lists!) |
| **2. Default with `COALESCE`** | `COALESCE(InputRoot.JSON.Data.qty, 1)` | Missing fields return `NULL` quietly — deciding what `NULL` means avoids `NULL` math and broken `\|\|` strings |
| **3. Set `Compute mode`** | Pick **`LocalEnvironment And Message`** when editing `OutputLocalEnvironment` | Default `Message` mode silently throws away your HTTP `ReplyStatusCode`, URL, or dynamic MQ destination! |
| **4. Protect `SHARED` data** | Wrap writes to `SHARED` variables inside **`BEGIN ATOMIC ... END;`** | Multiple flow threads share the same `SHARED` memory — unprotected writes corrupt counters and lookup caches |
| **5. Keep secrets out** | Never place passwords, PINs, or full card numbers in `Environment`, logs, or `Trace` | `Environment` travels with the message and can appear in exception dumps, user traces, or monitoring tools |
| **6. Reuse code** | Put shared helpers (`GetLastError`, `MaskCard`) in a **Shared Library** schema (`BROKER SCHEMA <SharedSchemaName>`) | Avoids copy-paste drift; one fix updates every flow cleanly |

---

## Extra Performance Traps to Avoid

| Slow Habit | Fast Replacement | Why |
| :--- | :--- | :--- |
| Repeating `InputRoot.XMLNSC.A.B.C.Field1` 10 times | `DECLARE cRef REFERENCE TO InputRoot.XMLNSC.A.B.C;` then `cRef.Field1` | Navigates the deep path **once** instead of 10 times |
| Calling `CopyEntireMessage()` then replacing the entire body | Call **`CopyMessageHeaders()`** instead | Skips cloning huge input trees you immediately overwrite |
| Building huge strings with `s = s \|\| line` inside a 1,000-step loop | Build message tree elements or use `SELECT` / `FOR` | Repeated string reallocation burns heap memory and CPU |
| Parsing massive XML sections you pass through untouched | Configure **Parser Options -> Opaque Elements** on `MQInput`/`HTTPInput` | ACE keeps opaque subtrees as unparsed text blobs until needed |

---

## Fast Before / After Example (`REFERENCE` Cursor + `COALESCE`)

```esql
-- SLOW: repeated full tree lookup and unguarded nullable field
-- SET OutputRoot.JSON.Data.id   = InputRoot.XMLNSC.Payload.Header.Meta.Id;
-- SET OutputRoot.JSON.Data.note = 'Note: ' || InputRoot.XMLNSC.Payload.Header.Meta.Note;

-- FAST: single REFERENCE cursor + COALESCE guard
DECLARE metaRef REFERENCE TO InputRoot.XMLNSC.Payload.Header.Meta;

CALL CopyMessageHeaders();
CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

SET OutputRoot.JSON.Data.id   = COALESCE(metaRef.Id, 'MISSING');
SET OutputRoot.JSON.Data.note = 'Note: ' || COALESCE(metaRef.Note, 'None');
RETURN TRUE;
```

<details data-type="output">
<summary>Expected Output (When Meta.Note Is Omitted)</summary>

```json
{
  "id": "M-404",
  "note": "Note: None"
}
```

</details>

### Line-by-Line Breakdown

- **`DECLARE metaRef REFERENCE TO InputRoot.XMLNSC.Payload.Header.Meta;`**: Traverses the 4-level XML path **once** and saves the location in `metaRef`.
- **`CALL CopyMessageHeaders();`**: Copies headers cleanly without cloning the incoming `XMLNSC` payload into `OutputRoot`.
- **`COALESCE(metaRef.Id, 'MISSING')` / `COALESCE(metaRef.Note, 'None')`**: Ensures neither `id` nor `'Note: ' || ...` quietly turns into `NULL`.

---

## Recap: Know the Tree, Then Shape It

1. **Read:** Navigate `InputRoot`, `Environment`, and `LocalEnvironment` with exact case-sensitive names and `COALESCE` defaults.
2. **Build:** Create the target output domain (`JSON` / `XMLNSC`), loop with `REFERENCE` + `MOVE` (or `FOR`), and `CAST` / `FORMAT` numbers and dates explicitly.
3. **Control:** Route with `PROPAGATE` (remember `RETURN FALSE;`), look up data safely with parameterized `PASSTHRU`, and fail cleanly with `THROW` + `InputExceptionList`.

---

**Next:** [Quick Reference Cheat Sheet →](#topic-245)
