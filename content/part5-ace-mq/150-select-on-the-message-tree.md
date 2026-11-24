---
id: topic-150
slug: select-on-the-message-tree
topicNumber: 150
title: "SELECT on the Message Tree"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Query, filter, and transform in-memory message trees using SQL-like SELECT ... FROM ... WHERE statements."
object: "Tree Query"
action: "SELECT"
commandName: "SELECT FROM WHERE"
synonyms:
  - "select"
  - "select on tree"
  - "filter array"
  - "sql in esql"
  - "select from where"
---

Applies SQL-style declarative queries to filter, sort, or transform in-memory array elements directly.
Use tree `SELECT` statements to extract matching records from an array in a single statement without manual `WHILE` loops.

```esql
SET <Target>[] = SELECT <Columns> FROM <SourceTree>[] WHERE <Condition>;
```

| Clause | Description | Example |
| :--- | :--- | :--- |
| **`SELECT`** | Fields or subtrees to extract | `SELECT I.code, I.price` |
| **`FROM`** | Array source container | `FROM InputRoot.JSON.Data.items.Item[] AS I` |
| **`WHERE`** | Filter condition | `WHERE I.price > 15` |

```json
{
  "items": [
    { "code": "A1", "price": 10 },
    { "code": "B2", "price": 25 },
    { "code": "C3", "price": 40 }
  ]
}
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
-- Extract only items with price > 15 into output array
SET OutputRoot.JSON.Data.expensiveItems.Item[] =
    SELECT I.code, I.price
    FROM InputRoot.JSON.Data.items.Item[] AS I
    WHERE I.price > 15;
```

```json
{
  "expensiveItems": [
    { "code": "B2", "price": 25 },
    { "code": "C3", "price": 40 }
  ]
}
```

* **Array Brackets:** Note the empty array brackets `[]` on both the source `Item[]` and target `Item[]`.
* **THE Function:** To select exactly one scalar result, wrap the query in `THE()`: `SET var = THE(SELECT ITEM I.code FROM ...);`.
* **In-Memory Only:** This is executed on the in-memory parsed tree; it does NOT communicate with any external database.

* [Working with Arrays and Lists](#topic-146)
* [Loop Over a JSON Array](#topic-144)
* [Database Access from ESQL](#topic-155)
