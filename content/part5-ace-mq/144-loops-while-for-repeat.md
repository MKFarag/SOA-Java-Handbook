---
id: topic-144
slug: loops-while-for-repeat
topicNumber: 144
title: "Loop Over a JSON Array"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Iterate over array elements and repeating tree structures using WHILE, FOR, and REPEAT loops."
object: "Loop Array"
action: "Iterate"
commandName: "WHILE FOR"
synonyms:
  - "loop array"
  - "loop"
  - "while loop"
  - "for loop"
  - "iterate array"
  - "cardinality"
---

Iterates across repeating message elements (such as JSON arrays) using `WHILE` or `FOR` loops.
Use array loops to transform, filter, or aggregate repeating line items in purchase orders or invoices.

```esql
DECLARE I INTEGER 1;
DECLARE J INTEGER CARDINALITY(InputRoot.JSON.Data.items.Item[]);
WHILE I <= J DO
    -- Process Item[I]
    SET I = I + 1;
END WHILE;
```

| Loop Construct | Syntax Form | Best Use Case |
| :--- | :--- | :--- |
| **`WHILE`** | `WHILE <Condition> DO ... END WHILE;` | Processing arrays with counter and condition check. |
| **`FOR`** | `FOR <Ref> AS <TreeRef> DO ... END FOR;` | Navigating tree references without manual counters. |
| **`REPEAT`** | `REPEAT ... UNTIL <Condition> END REPEAT;` | Loops that must execute at least once. |

```json
{
  "id": 1,
  "name": "Ali",
  "items": [
    { "code": "A1", "price": 10 },
    { "code": "B2", "price": 25 }
  ]
}
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
DECLARE total INTEGER 0;
DECLARE I INTEGER 1;
DECLARE itemCount INTEGER CARDINALITY(InputRoot.JSON.Data.items.Item[]);

WHILE I <= itemCount DO
    SET total = total + InputRoot.JSON.Data.items.Item[I].price;
    SET I = I + 1;
END WHILE;

SET OutputRoot.JSON.Data.totalSum = total;
```

```json
{ "totalSum": 35 }
```

* **Increment Counter:** Always ensure `SET I = I + 1;` is present inside `WHILE` loops to prevent infinite CPU hang loops.
* **1-Based Indexing:** Array indices run from `1` to `CARDINALITY`; index `0` returns `NULL`.
* **Array Cardinality Syntax:** Note the empty brackets `Item[]` when passing the array to `CARDINALITY()`.

* [Working with Arrays and Lists](#topic-146)
* [References and the MOVE Statement](#topic-145)
* [SELECT on the Message Tree](#topic-150)
