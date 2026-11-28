---
id: topic-185
slug: esql-reference-pointers
topicNumber: 185
title: "ESQL REFERENCE Pointers, MOVE & LASTMOVE (Fast Loops)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Loop fast over repeating elements with REFERENCE, LASTMOVE, and MOVE NEXTSIBLING REPEAT TYPE NAME, plus inspect dynamic fields with FIELDNAME and FIELDVALUE."
object: "REFERENCE & MOVE"
action: "Traverse Efficiently"
commandName: "REFERENCE MOVE LASTMOVE FIELDNAME"
synonyms:
  - "reference and move esql"
  - "lastmove esql"
  - "repeat type name esql"
  - "move nextsibling firstchild lastchild parent"
  - "fieldname fieldvalue fieldtype samefield"
---

# ESQL `REFERENCE` Pointers, `MOVE` & `LASTMOVE` (Fast Loops)

Why should you loop with **`REFERENCE`** and **`MOVE`** instead of **`Item[i]`**? Every time ESQL evaluates `Order.Item[i]`, it starts at element `1` and walks `i` steps forward — turning a 5,000-item list into slow $O(N^2)$ traversal. A **`REFERENCE`** pointer steps directly from one sibling to the next in $O(1)$ per hop!

---

## The Classic Fast Loop Pattern

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE total INTEGER 0;
        DECLARE r REFERENCE TO InputRoot.XMLNSC.Order.Item[1];

        WHILE LASTMOVE(r) DO
            SET total = total + CAST(r.Qty AS INTEGER DEFAULT 0);
            MOVE r NEXTSIBLING REPEAT TYPE NAME;
        END WHILE;

        SET OutputRoot.JSON.Data.totalQty = total;
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (Given 3 &lt;Item&gt; Tags with Qty 2, 5, 3)</summary>

```json
{
  "totalQty": 10
}
```

</details>

### Line-by-Line Breakdown (`REFERENCE` Loop)

- **`DECLARE r REFERENCE TO InputRoot.XMLNSC.Order.Item[1];`**: Points cursor `r` directly to the first `<Item>` element inside `<Order>`. If `<Item>` does not exist, `r` points to `<Order>` (or the nearest valid ancestor) and ACE marks the initial move status as **`FALSE`**.
- **`WHILE LASTMOVE(r) DO`**: Returns **`TRUE`** if the initialization or most recent **`MOVE`** succeeded. If `Item[1]` did not exist at all, `LASTMOVE(r)` is immediately `FALSE` and the loop safely executes **0 times** (no null crash!).
- **`CAST(r.Qty AS INTEGER DEFAULT 0)`**: Reads `<Qty>` relative to pointer `r` (fast direct child lookup) and safely parses it as an `INTEGER`, falling back to `0` if non-numeric or missing.
- **`MOVE r NEXTSIBLING REPEAT TYPE NAME;`**: Steps `r` forward to the next sibling that has the **same field type AND same field name** (`Item`), automatically skipping any unrelated sibling tags (such as `<Note>` or `<Discount>` mixed between `<Item>` tags!).
  - **`REPEAT NAME`**: Matches same tag name regardless of type.
  - **`REPEAT TYPE NAME`**: Matches both same node type and same tag name (recommended when XML attributes, comments, or mixed elements could exist).
  - Bare **`MOVE r NEXTSIBLING`**: Moves to the very next sibling regardless of name (safe only when all children are homogeneous, like JSON `Item`s).
- When `r` passes the final `<Item>`, `MOVE` finds no more matches, `r` stays on the last element, and **`LASTMOVE(r)` becomes `FALSE`**, ending the `WHILE` loop cleanly.

---

## All `MOVE` Directions & Field Inspection Functions

| `MOVE` Direction | Where Pointer Goes |
| :--- | :--- |
| **`FIRSTCHILD`** | Down to the very first child element |
| **`LASTCHILD`** | Down to the very last child element |
| **`NEXTSIBLING`** | Forward to the next sibling element |
| **`PREVIOUSSIBLING`** | Backward to the previous sibling element |
| **`PARENT`** | Up one level to the parent element |

Dynamic tree traversal using **`FIELDNAME()`**, **`FIELDVALUE()`**, **`FIELDTYPE()`**, and **`SAMEFIELD()`**:

```esql
DECLARE ptr    REFERENCE TO InputRoot.JSON.Data;
DECLARE outRef REFERENCE TO OutputRoot;
CREATE FIELD OutputRoot.JSON.Data.copied AS outRef;

MOVE ptr FIRSTCHILD;
WHILE LASTMOVE(ptr) DO
    SET outRef.{FIELDNAME(ptr)} = FIELDVALUE(ptr);
    MOVE ptr NEXTSIBLING;
END WHILE;
```

- **`{FIELDNAME(ptr)}`**: Dynamic field-name evaluation braces `{...}` create a target property whose key is computed at runtime from `FIELDNAME(ptr)`.
- **`FIELDVALUE(ptr)`**: Extracts the scalar value of the node pointed to by `ptr`.
- **`FIELDTYPE(ptr)`**: Returns the parser field-type constant (e.g., `XMLNSC.Attribute` or `JSON.Array`).
- **`SAMEFIELD(ref1, ref2)`**: Returns `TRUE` if two `REFERENCE` cursors point to the exact same node in the tree.

> [!WARNING]
> **Never read `r` as the "new element" after `LASTMOVE(r)` returns `FALSE`!** When a `MOVE` fails, the pointer does **not** become `NULL` — it stays parked on its previous node. Always guard reads with `IF LASTMOVE(r)` or `WHILE LASTMOVE(r)`.

---

**Next:** [ESQL String Functions (SUBSTRING, TRIM, LEFT, RIGHT, REPLICATE) →](#topic-186)
