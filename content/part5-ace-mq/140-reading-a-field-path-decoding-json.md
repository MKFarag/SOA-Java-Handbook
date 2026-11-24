---
id: topic-140
slug: reading-a-field-path-decoding-json
topicNumber: 140
title: "Read a JSON Field"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Decode OutputRoot.JSON.Data.var step-by-step: domain parsers, the Data root container, and 1-based arrays."
object: "JSON Field"
action: "Read"
commandName: "OutputRoot.JSON.Data"
synonyms:
  - "json field"
  - "read json"
  - "outputroot"
  - "inputroot.json.data"
  - "json path"
  - "decode path"
---

Decodes every segment of `OutputRoot.JSON.Data.var` to understand how JSON trees map to ESQL paths.
Use this syntax to read properties, nested objects, and array items from incoming JSON payloads.

```esql
SET <Target> = InputRoot.JSON.Data.<PropertyName>;
SET OutputRoot.JSON.Data.<PropertyName> = <Source>;
```

| Path Segment | Meaning | Why It Is Named This Way |
| :--- | :--- | :--- |
| **`OutputRoot`** | Outgoing root tree | Outgoing message buffer leaving the node. |
| **`JSON`** | Domain parser | Instructs ACE to serialize this body using the JSON parser. |
| **`Data`** | Outermost JSON object | In ACE's JSON parser, the outermost `{}` always resides under `Data`. |
| **`var`** | Property identifier | Becomes the JSON key `"var": ...` on the wire. |

```json
{
  "id": 1,
  "name": "Ali",
  "city": "Cairo",
  "items": [
    { "code": "A1", "price": 10 },
    { "code": "B2", "price": 25 }
  ]
}
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
-- Flat field
SET OutputRoot.JSON.Data.customer = InputRoot.JSON.Data.name;
-- Array element using 1-based indexing
SET OutputRoot.JSON.Data.firstItemCode = InputRoot.JSON.Data.items.Item[1].code;
```

```json
{
  "customer": "Ali",
  "firstItemCode": "A1"
}
```

* **1-Based Array Indexing:** ACE arrays use **1-based** indexing. `Item[1]` is the first element; `Item[0]` returns `NULL`.
* **Missing vs Empty Field:** Reading a missing field evaluates to `NULL` without throwing an error (`field IS NULL` is `TRUE`).
* **Never Omit `Data`:** Writing `OutputRoot.JSON.name = 'Ali'` causes serialization failures; JSON properties must sit under `Data`.

* [The Message Tree Architecture](#topic-139)
* [Add Fields to the Output](#topic-141)
* [Loop Over a JSON Array](#topic-144)
