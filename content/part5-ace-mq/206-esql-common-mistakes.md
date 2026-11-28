---
id: topic-206
slug: esql-common-mistakes
topicNumber: 206
title: "ESQL Common Mistakes & Quick Fixes"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'ESQL Solved Tasks & Practice'
versionBadge: 'ACE 12 / 13'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Spot and fix the top 10 mistakes ACE developers make in ESQL — quotes, 0-based indexes, Filter Root vs InputRoot, Compute mode, JSON.Array, and PROPAGATE."
object: "ESQL Debugging"
action: "Fix Common Bugs"
commandName: "Common ESQL Bugs"
synonyms:
  - "common esql mistakes"
  - "double quotes vs single quotes esql"
  - "bip2521e bip2531e bip2456e esql"
  - "filter node inputroot vs root"
  - "missing identity json.array"
---

# ESQL Common Mistakes & Quick Fixes

Check this diagnostic table whenever a Compute or Filter node produces empty payloads, emits `"Item"` wrappers in JSON, drops HTTP status codes, or fails with `BIP2521E` / `BIP2531E`.

---

## Top 10 ESQL Mistakes & Instant Fixes

| # | Mistake | Symptom / Error | Exact Fix |
| :--- | :--- | :--- | :--- |
| **1** | Double quotes for text (`"OK"`) | `"OK"` means a **field name**, so it evaluates to **`NULL`** | Always use **single quotes** for strings (`'OK'`); reserve `"..."` only for special field names like `"Content-Type"` |
| **2** | 0-based array index (`Item[0]`) | Runtime error **`BIP2531E`** | ESQL arrays and `SUBSTRING` positions are **1-based**: `Item[1]` |
| **3** | Writing to `InputRoot` (`SET InputRoot.JSON.Data.a = 1;`) | Runtime error **`BIP2521E`** (*Cannot alter read-only tree*) | Call `CopyEntireMessage()` and modify **`OutputRoot`** instead |
| **4** | Using `InputRoot` in a **`Filter`** or **`Database`** node | Compile error (`InputRoot` undeclared) | **`Filter`** and **`Database`** modules read **`Root`**, NOT `InputRoot`! |
| **5** | Editing `LocalEnvironment` under default `Message` mode | HTTP `ReplyStatusCode` or dynamic target queue is silently ignored | Set node **Properties -> Compute mode** to **`LocalEnvironment And Message`** |
| **6** | Concatenating nullable fields (`a \|\| b`) or comparing `x = NULL` | Output field becomes `NULL` silently; `IF` silently enters `ELSE` (`UNKNOWN`) | Wrap fields in **`COALESCE(field, '')`** and check **`IS NULL`** / **`IS NOT NULL`** |
| **7** | Building JSON arrays without `IDENTITY (JSON.Array)` | JSON comes out as `{"tags": {"Item": "vip"}}` instead of `["vip"]` | Run **`CREATE FIELD OutputRoot.JSON.Data.tags IDENTITY (JSON.Array)tags;`** first |
| **8** | Returning `RETURN TRUE;` after `PROPAGATE` in a loop | Emits an **extra** empty or duplicate message after the batch finishes | Always end with **`RETURN FALSE;`** when `PROPAGATE` already sent all messages |
| **9** | Putting `DECLARE` or `HANDLER` after `SET` / `IF` | Toolkit syntax error in Problems view | Put all `DECLARE` variables first, followed immediately by `DECLARE ... HANDLER`, before any `SET`/`IF`/`CALL` |
| **10** | Wrong field casing (`orderid` vs `orderId`) or `mm` vs `MM` in dates | Field silently evaluates to `NULL`; month prints as minutes | Verify exact case-sensitive JSON/XML field names and use uppercase **`MM`** for month |

---

## Quick Fix Demo: 3 Bugs Fixed in One Snippet

```esql
-- BUGGY VERSION:
-- SET OutputRoot.JSON.Data.tag = "VIP";                       -- double quotes -> NULL!
-- SET OutputRoot.JSON.Data.first = InputRoot.JSON.Data.x[0];  -- index 0 -> BIP2531E!
-- SET OutputRoot.JSON.Data.msg = 'Hi ' || InputRoot.JSON.Data.name; -- NULL if name missing!

-- FIXED VERSION:
CALL CopyMessageHeaders();
CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

SET OutputRoot.JSON.Data.tag   = 'VIP';
SET OutputRoot.JSON.Data.first = COALESCE(InputRoot.JSON.Data.x.Item[1], 'N/A');
SET OutputRoot.JSON.Data.msg   = 'Hi ' || COALESCE(InputRoot.JSON.Data.name, 'Guest');
RETURN TRUE;
```

<details data-type="output">
<summary>Expected Output (When Input Is {})</summary>

```json
{
  "tag": "VIP",
  "first": "N/A",
  "msg": "Hi Guest"
}
```

</details>

### Line-by-Line Breakdown

- **`'VIP'`**: Single quotes produce the string literal `'VIP'` instead of looking up a field named `VIP`.
- **`InputRoot.JSON.Data.x.Item[1]`**: Starts at 1-based index `[1]` (and follows ACE's `.Item[1]` structure for JSON arrays), guarded with `COALESCE(..., 'N/A')` in case `x` is empty.
- **`'Hi ' || COALESCE(InputRoot.JSON.Data.name, 'Guest')`**: Guarantees `'Hi '` is never wiped out by a `NULL` right-hand operand.

> [!TIP]
> When an ESQL file has a compile error, check the **Problems** tab at the bottom of the ACE Toolkit (or click the red markers on the `.esql` editor scrollbar) to jump straight to the exact offending line.

---

**Next:** [ESQL Quick Reference Cheat Sheet →](#topic-207)
