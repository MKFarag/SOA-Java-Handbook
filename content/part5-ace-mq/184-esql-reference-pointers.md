---
id: topic-184
slug: esql-reference-pointers
topicNumber: 184
title: "REFERENCE Pointers, MOVE & Field Functions"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Navigate dynamic message trees quickly using MOVE (FIRSTCHILD, LASTCHILD, NEXTSIBLING, PARENT) and inspect node names/values with FIELDNAME and FIELDTYPE."
object: "REFERENCE & MOVE"
action: "Traverse & Inspect"
commandName: "MOVE FIRSTCHILD NEXTSIBLING FIELDNAME"
synonyms:
  - "esql reference pointer"
  - "lastmove esql"
  - "move firstchild lastchild parent nextsibling"
  - "fieldname fieldtype fieldvalue esql"
---

# `REFERENCE` Pointers, `MOVE` & Field Functions

Indexing `[i]` inside a 5,000-item `WHILE` loop forces ESQL to walk from element 1 every time (slow $O(N^2)$ behavior!). A **`REFERENCE`** pointer combined with **`MOVE`** walks the tree in one hop per element.

---

## All `MOVE` Directions

| Direction Keyword | Where Pointer Moves | If Target Missing |
| :--- | :--- | :--- |
| **`FIRSTCHILD`** | Down to the very first child element | `LASTMOVE(ref)` becomes `FALSE` |
| **`LASTCHILD`** | Down to the very last child element | `LASTMOVE(ref)` becomes `FALSE` |
| **`NEXTSIBLING`** | Sideways to next sibling *(add `REPEAT NAME` to match tag name)* | `LASTMOVE(ref)` becomes `FALSE` |
| **`PREVIOUSSIBLING`** | Sideways backward to previous sibling | `LASTMOVE(ref)` becomes `FALSE` |
| **`PARENT`** | Up one level to parent node | Stays put if already at root |

---

## Fast Cursor Example + Dynamic Key Inspection

Walk every child field of an arbitrary JSON object and inspect keys dynamically using **`FIELDNAME()`**, **`FIELDVALUE()`**, and **`FIELDTYPE()`**:

```esql
DECLARE ptr    REFERENCE TO InputRoot.JSON.Data;
DECLARE outRef REFERENCE TO OutputRoot;

CREATE FIELD OutputRoot.JSON.Data.summary AS outRef;
MOVE ptr FIRSTCHILD;

WHILE LASTMOVE(ptr) DO
    SET outRef.{FIELDNAME(ptr)} = FIELDVALUE(ptr);
    MOVE ptr NEXTSIBLING;
END WHILE;
```

- **`FIELDNAME(ptr)`:** Returns tag/key name as text (great inside dynamic braces `{...}`!).
- **`FIELDVALUE(ptr)`:** Returns scalar value cleanly.
- **`FIELDTYPE(ptr)`:** Checks field type (e.g., `XMLNSC.Attribute`, `JSON.Array`).
- **`SAMEFIELD(ref1, ref2)`:** Returns `TRUE` if two pointers point to the exact same node in memory.

<details data-type="output">
<summary>What Happens at Runtime</summary>

```text
Copies every dynamic key/value child from InputRoot.JSON.Data into OutputRoot.JSON.Data.summary in a single linear pass.
```

</details>

> [!TIP]
> Never reuse a `REFERENCE` variable after **`LASTMOVE(ref)` becomes `FALSE`** without re-pointing it with `MOVE ref TO ...` — check `WHILE LASTMOVE(ptr) DO` before every read!

---

**Next:** [Arrays & CARDINALITY (Process Lists) →](#topic-185)
