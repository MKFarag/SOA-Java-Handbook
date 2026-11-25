---
id: topic-195
slug: esql-performance-best-practices
topicNumber: 195
title: "ESQL Speed Tips (Avoid Slow Field Lookups)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Keep Compute nodes blazing fast by caching deep tree lookups, using REFERENCE loops, and avoiding needless full-message copies."
object: "ESQL Performance"
action: "Optimize Speed"
commandName: "ESQL Best Practices"
synonyms:
  - "esql performance tips"
  - "esql optimization"
  - "avoid cardinality in loop"
  - "opaque parsing xmlnsc"
---

# ESQL Speed Tips (Avoid Slow Field Lookups)

ESQL executes natively in C++, so well-written ESQL processes thousands of messages per second. Avoid these **4 common slowdowns** to stay fast.

---

## The 4 Biggest ESQL Performance Traps

| Slow Habit | Fast Replacement | Why |
| :--- | :--- | :--- |
| Repeating `InputRoot.XMLNSC.A.B.C.Field1` 10 times | `DECLARE cRef REFERENCE TO InputRoot.XMLNSC.A.B.C;` then `cRef.Field1` | Walks the path tree **once** instead of 10 times |
| Indexing `[i]` inside `WHILE i <= CARDINALITY(...)` | Use **`FOR x AS list[] DO`** or **`REFERENCE` + `MOVE NEXTSIBLING`** | Turns $O(N^2)$ scans into $O(N)$ linear streaming |
| Calling `CopyEntireMessage()` when replacing 100% of body | Call **`CopyMessageHeaders()`** only | Skips cloning huge input bodies you immediately throw away |
| Concatenating a giant string in a 1,000-step loop | Build elements as tree siblings or use `FOR` + `SELECT` | Repeated string reallocation burns heap memory |

---

## Fast Before/After Example

```esql
-- SLOW: re-walks InputRoot path and uses index [i]
-- FAST: single REFERENCE cursor
DECLARE dataRef REFERENCE TO InputRoot.JSON.Data;
SET OutputRoot.JSON.Data.id     = dataRef.orderId;
SET OutputRoot.JSON.Data.status = 'OK';
```

> [!TIP]
> On `XMLNSC` input nodes receiving huge XML payloads where you only inspect 2 header tags and pass through `<DocumentBody>` untouched, add `<DocumentBody>` to **Parser Options -> Opaque Elements** so ACE doesn't waste CPU parsing 50,000 nested tags!

---

**Next:** [Common ESQL Mistakes & Quick Fixes →](#topic-196)
