---
id: topic-146
slug: working-with-arrays-and-lists
topicNumber: 146
title: "Working with Arrays and Lists"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Add, append, count, and index JSON array elements using CARDINALITY and Item[] syntax."
object: "Arrays"
action: "Manipulate"
commandName: "Item[] CARDINALITY"
synonyms:
  - "arrays"
  - "lists"
  - "cardinality"
  - "item[]"
  - "append array"
  - "last element"
---

Manipulates repeating elements in JSON payloads using ACE array notation and 1-based indexing.
Use these operations to count elements, access specific slots, or append new entries to array lists.

```esql
-- Count items
DECLARE len INTEGER CARDINALITY(InputRoot.JSON.Data.items.Item[]);
-- Append new item
CREATE LASTCHILD OF OutputRoot.JSON.Data.items NAME 'Item';
```

| Operation | ESQL Syntax | Result |
| :--- | :--- | :--- |
| **Item Count** | `CARDINALITY(InputRoot.JSON.Data.items.Item[])` | Returns integer count of elements. |
| **First Item** | `InputRoot.JSON.Data.items.Item[1]` | Points to element 1. |
| **Last Item** | `InputRoot.JSON.Data.items.Item[<]` | `[<]` represents the last item. |
| **Next Item** | `InputRoot.JSON.Data.items.Item[>]` | Represents next relative item. |
| **Append Array** | `SET OutputRoot.JSON.Data.items.Item[] = InputRoot.JSON.Data.items.Item[];` | Copies entire array in one statement. |

```json
{
  "items": [
    { "code": "A1", "price": 10 },
    { "code": "B2", "price": 25 }
  ]
}
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
-- Copy entire input array directly
SET OutputRoot.JSON.Data.items.Item[] = InputRoot.JSON.Data.items.Item[];
-- Access last item directly using [<]
SET OutputRoot.JSON.Data.lastItemCode = InputRoot.JSON.Data.items.Item[<].code;
```

```json
{
  "items": [
    { "code": "A1", "price": 10 },
    { "code": "B2", "price": 25 }
  ],
  "lastItemCode": "B2"
}
```

* **Bulk Copy:** You can copy an entire array in a single line using `Target.Item[] = Source.Item[];`.
* **The Item Keyword:** Always specify `items.Item[1]`; omitting `Item` causes parser errors because ACE wraps JSON arrays in `Item` nodes.
* **Negative Indices:** Negative indices are invalid and produce runtime evaluation errors.

* [Loop Over a JSON Array](#topic-144)
* [SELECT on the Message Tree](#topic-150)
* [Read a JSON Field](#topic-140)
