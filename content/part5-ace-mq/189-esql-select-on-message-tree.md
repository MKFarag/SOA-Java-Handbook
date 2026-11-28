---
id: topic-189
slug: esql-select-on-message-tree
topicNumber: 189
title: "ESQL SELECT on Message Trees (SELECT ITEM, THE & COUNT)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Filter, reshape, search, and aggregate repeating XML or JSON fields in memory using SELECT, FROM ...[], SELECT ITEM, THE(), and COUNT(*)."
object: "Tree SELECT"
action: "Query Message Tree"
commandName: "SELECT FROM WHERE THE ITEM COUNT"
synonyms:
  - "select works on trees esql"
  - "the select item esql"
  - "select count(*) esql"
  - "filter json array select esql"
  - "from item[] as i esql"
---

# ESQL `SELECT` on Message Trees (`SELECT ITEM`, `THE` & `COUNT`)

ESQL's **`SELECT`** does not only query databases — it also queries **in-memory message trees** (`InputRoot.JSON.Data` or `InputRoot.XMLNSC`), letting you filter arrays, pick a single matching value, or count items without writing explicit loops.

---

## Key Clauses in Tree `SELECT`

| Keyword | What It Does |
| :--- | :--- |
| **`FROM ... [] AS I`** | Loops over every repeating element (like rows in a SQL table) under alias `I` |
| **`THE(...)`** | Unwraps the **first matching result** from a list into a single scalar/row value (`NULL` if no match) |
| **`ITEM`** | Returns the **bare scalar value** itself (`'Mona'`), instead of wrapping it inside a named field (`{"name":"Mona"}`) |

---

## Example: Filtering Arrays, Extracting One Value & Aggregating with `COUNT(*)`

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        -- 1. Copy only PAID items into a new JSON array of objects
        CREATE FIELD OutputRoot.JSON.Data.paid IDENTITY (JSON.Array)paid;
        SET OutputRoot.JSON.Data.paid.Item[] =
            SELECT I.id, I.amount
            FROM InputRoot.JSON.Data.items.Item[] AS I
            WHERE I.status = 'PAID';

        -- 2. Return a flat array of scalar IDs using SELECT ITEM
        CREATE FIELD OutputRoot.JSON.Data.paidIds IDENTITY (JSON.Array)paidIds;
        SET OutputRoot.JSON.Data.paidIds.Item[] =
            SELECT ITEM I.id
            FROM InputRoot.JSON.Data.items.Item[] AS I
            WHERE I.status = 'PAID';

        -- 3. Pick ONE single value: THE + SELECT ITEM
        DECLARE custName CHARACTER THE(
            SELECT ITEM C.name
            FROM InputRoot.JSON.Data.customers.Item[] AS C
            WHERE C.id = '1001'
        );

        -- 4. Aggregate with COUNT(*) wrapped in THE(SELECT ITEM ...) for a scalar INTEGER
        DECLARE cnt INTEGER THE(
            SELECT ITEM COUNT(*)
            FROM InputRoot.JSON.Data.items.Item[] AS I
        );

        SET OutputRoot.JSON.Data.customerName = COALESCE(custName, 'Unknown');
        SET OutputRoot.JSON.Data.itemCount    = cnt;
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (Given 2 Items — 1 PAID id="TX1" amount=150, 1 NEW — and Customer 1001 "Mona")</summary>

```json
{
  "paid": [
    { "id": "TX1", "amount": 150 }
  ],
  "paidIds": ["TX1"],
  "customerName": "Mona",
  "itemCount": 2
}
```

</details>

### Line-by-Line Breakdown

- **`CREATE FIELD OutputRoot.JSON.Data.paid IDENTITY (JSON.Array)paid;`**: Initializes `paid` as a proper `JSON.Array` so assigning `.paid.Item[]` serializes as `[...]` rather than `{"Item": ...}`.
- **`SET OutputRoot.JSON.Data.paid.Item[] = SELECT I.id, I.amount FROM InputRoot.JSON.Data.items.Item[] AS I WHERE I.status = 'PAID';`**:
  - **`FROM ...Item[] AS I`**: Iterates over every repeating `Item` element, binding alias `I` to each one.
  - **`WHERE I.status = 'PAID'`**: Keeps only items whose `status` equals `'PAID'`.
  - **`SELECT I.id, I.amount`**: Builds a list of objects containing only `id` and `amount` and assigns the resulting list directly to `.paid.Item[]`.
- **`SELECT ITEM I.id`**: Without `ITEM`, `SELECT I.id` returns objects `{"id": "TX1"}`. Adding **`ITEM`** strips the field wrapper and emits plain scalar values (`"TX1"`), building `["TX1"]`.
- **`THE(SELECT ITEM C.name FROM ... AS C WHERE C.id = '1001')`**: A `SELECT` always returns a list (`ROW`), even when only one row matches. Wrapping it in **`THE(...)`** extracts the first element as a single scalar value that fits directly into a `CHARACTER` variable (or returns `NULL` if no customer has `id = '1001'`).
- **`THE(SELECT ITEM COUNT(*) FROM ... AS I)`**: Note the subtle difference between **`SET rowVar = SELECT COUNT(*) ...;`** (which returns a 1-element list row unless unwrapped) and **`THE(SELECT ITEM COUNT(*) ...)`** (which unwraps `COUNT(*)` straight into an `INTEGER` scalar `2`!). You can also use `SUM(I.amount)`, `MAX(I.amount)`, and `MIN(I.amount)` the exact same way.

> [!TIP]
> You can rename columns in `SELECT` with `AS`, e.g., `SELECT I.id AS txId, I.amount AS total FROM ...`. And when assigning into `OutputRoot.JSON.Data.<array>.Item[]`, always create the parent with `IDENTITY (JSON.Array)<array>` first!

---

**Next:** [ESQL Environment vs LocalEnvironment →](#topic-190)
