---
id: topic-147
slug: creating-changing-and-deleting-fields
topicNumber: 147
title: "Create, Change, and Delete Fields"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Add new tree fields with CREATE FIELD, update values, and safely prune fields by assigning NULL."
object: "Fields"
action: "Mutate"
commandName: "SET NULL CREATE FIELD"
synonyms:
  - "create field"
  - "delete field"
  - "remove field"
  - "change field"
  - "set null"
  - "prune tree"
---

Modifies message trees by creating new elements, changing existing values, or deleting unneeded nodes.
Use field operations to prune sensitive data before egress or dynamically construct custom JSON payloads.

```esql
-- Create field
CREATE FIELD OutputRoot.JSON.Data.order;
-- Change value
SET OutputRoot.JSON.Data.order.id = 101;
-- Delete field
SET OutputRoot.JSON.Data.order = NULL;
```

| Operation | Statement | Effect on Tree |
| :--- | :--- | :--- |
| **Create Simple** | `SET OutputRoot.JSON.Data.city = 'Cairo';` | Creates leaf property automatically. |
| **Create Explicit** | `CREATE FIELD OutputRoot.JSON.Data.customer;` | Creates parent object container without value. |
| **Update Value** | `SET OutputRoot.JSON.Data.id = 2;` | Overwrites existing value. |
| **Delete Field** | `SET OutputRoot.JSON.Data.tempField = NULL;` | Completely deletes node from in-memory tree. |

```json
{
  "id": 1,
  "name": "Ali",
  "city": "Cairo",
  "items": [{ "code": "A1", "price": 10 }]
}
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
SET OutputRoot.JSON.Data = InputRoot.JSON.Data;
-- Delete the city property
SET OutputRoot.JSON.Data.city = NULL;
-- Add new status property
SET OutputRoot.JSON.Data.active = TRUE;
```

```json
{
  "id": 1,
  "name": "Ali",
  "items": [{ "code": "A1", "price": 10 }],
  "active": true
}
```

* **Deletion via NULL:** Assigning `NULL` to a field does not emit `"field": null` in JSON; it completely deletes the property from the JSON payload.
* **To Emit Explicit Null:** To produce JSON literal `"field": null`, use the special value parser type or ESQL `JSON.Type = JSON.Null`.
* **Automatic Container Creation:** Writing `OutputRoot.JSON.Data.a.b.c = 1;` automatically creates containers `a` and `b` if they do not exist.

* [Add Fields to the Output](#topic-141)
* [Read a JSON Field](#topic-140)
* [Working with Arrays and Lists](#topic-146)
