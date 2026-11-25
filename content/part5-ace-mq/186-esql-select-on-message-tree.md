---
id: topic-186
slug: esql-select-on-message-tree
topicNumber: 186
title: "SELECT on the Message Tree (SELECT ITEM, THE, WHERE)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Filter, reshape, and search in-memory JSON or XML arrays in one SQL-style statement using SELECT, SELECT ITEM, and THE()."
object: "Tree SELECT"
action: "Query Message Array"
commandName: "SELECT FROM WHERE THE()"
synonyms:
  - "select on message tree esql"
  - "the select item esql"
  - "filter json array select esql"
  - "esql select from inputroot"
---

# `SELECT` on the Message Tree (`SELECT ITEM`, `THE`, `WHERE`)

ESQL's **`SELECT`** does not only query SQL databases — it works directly **in memory** on `InputRoot.XMLNSC` or `InputRoot.JSON.Data` arrays, filtering and transforming lists in one clean statement without loops!

---

## Syntax Patterns

```esql
-- 1. Return a filtered & reshaped array of objects
SET OutputRoot.JSON.Data.filtered.Item[] =
    SELECT item.sku AS code, item.price AS unitPrice
    FROM InputRoot.JSON.Data.items.Item[] AS item
    WHERE item.price >= 50;

-- 2. Return a flat scalar array (using SELECT ITEM)
CREATE FIELD OutputRoot.JSON.Data.skus IDENTITY (JSON.Array)skus;
SET OutputRoot.JSON.Data.skus.Item[] =
    SELECT ITEM item.sku
    FROM InputRoot.JSON.Data.items.Item[] AS item
    WHERE item.inStock = TRUE;

-- 3. Extract 1 SINGLE matching value cleanly (using THE(...))
DECLARE vipEmail CHARACTER THE(
    SELECT ITEM c.email
    FROM InputRoot.JSON.Data.contacts.Item[] AS c
    WHERE c.primary = TRUE
);
```

<details data-type="output">
<summary>Expected Output (Given Matching Array Items)</summary>

```json
{
  "filtered": [
    { "code": "PRO-9", "unitPrice": 120 }
  ],
  "skus": ["PRO-9"]
}
```

</details>

---

## 3 Things Beginners Love About `SELECT`

- **`SELECT` vs `SELECT ITEM`:** Normal `SELECT col1 AS a, col2 AS b` builds **objects with keys** (`{ "a": ..., "b": ... }`); **`SELECT ITEM expr`** returns **plain scalar values** (`"PRO-9"` instead of `{"sku": "PRO-9"}`)!
- **`THE(...)`:** Unwraps a 1-row result straight into a single scalar variable (instead of a row list `[]`). If nothing matches, `THE(...)` safely evaluates to **`NULL`**.
- Notice for JSON output arrays like `filtered`: remember **`CREATE FIELD ... IDENTITY (JSON.Array)<name>;`** before assigning `.Item[]` so ACE serializes `[...]` instead of `{"Item": [...]}`!

---

**Next:** [XMLNSC vs JSON Paths & Arrays in ESQL →](#topic-187)
