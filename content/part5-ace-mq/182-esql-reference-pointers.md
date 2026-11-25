---
id: topic-182
slug: esql-reference-pointers
topicNumber: 182
title: "REFERENCE Pointers (Fast Tree Loops)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Use REFERENCE pointers with MOVE ... NEXTSIBLING and LASTMOVE to iterate large trees without slow array indexing."
object: "REFERENCE Pointer"
action: "Traverse Efficiently"
commandName: "REFERENCE TO LASTMOVE"
synonyms:
  - "esql reference pointer"
  - "lastmove esql"
  - "move nextsibling"
  - "fast loop esql"
---

# REFERENCE Pointers (Fast Tree Loops)

Indexing an array like `InputRoot.XMLNSC.Orders.Order[i]` inside a 5,000-item `WHILE` loop forces ESQL to walk from item 1 every time (slow $O(N^2)$ behavior!). A **`REFERENCE`** acts like a live cursor that steps forward in one jump.

---

## Standard Cursor Loop Pattern

```esql
DECLARE inRef REFERENCE TO InputRoot.XMLNSC.Orders.Order[1];

WHILE LASTMOVE(inRef) DO
    CREATE LASTCHILD OF OutputRoot.JSON.Data.orders.Item NAME 'Item';
    DECLARE outRef REFERENCE TO OutputRoot.JSON.Data.orders.Item[<];
    SET outRef.id    = inRef.Id;
    SET outRef.total = inRef.Amount;

    MOVE inRef NEXTSIBLING REPEAT NAME;
END WHILE;
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "orders": [
    {"id": "O-1", "total": 50},
    {"id": "O-2", "total": 120}
  ]
}
```

</details>

---

## How `LASTMOVE` + `[<]` Work

- **`LASTMOVE(inRef)`:** Returns `TRUE` if the `REFERENCE TO` or `MOVE` succeeded, `FALSE` after passing the last sibling.
- **`NEXTSIBLING REPEAT NAME`:** Jumps straight to the next sibling with the same tag name (`Order`).
- **`[<]`:** Shorthand index pointing at the **last** element (the item we just created!).

> [!TIP]
> Notice we moved `outRef` using `[<]` or **`DECLARE outRef REFERENCE TO ...`**: you can also write `CREATE LASTCHILD OF parent AS outRef NAME 'Item';` in one line!

---

**Next:** [Arrays & CARDINALITY (Process Lists) →](#topic-183)
