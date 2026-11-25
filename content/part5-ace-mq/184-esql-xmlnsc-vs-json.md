---
id: topic-184
slug: esql-xmlnsc-vs-json
topicNumber: 184
title: "XMLNSC vs JSON Paths & Arrays in ESQL"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "See the exact path differences between XMLNSC trees and JSON trees (Data root, XML attributes, and Item arrays)."
object: "XMLNSC vs JSON"
action: "Compare Trees"
commandName: "InputRoot.XMLNSC vs JSON.Data"
synonyms:
  - "xmlnsc vs json esql"
  - "xml attributes esql"
  - "json.data item"
  - "xmlnsc attribute syntax"
---

# XMLNSC vs JSON Paths & Arrays in ESQL

Both parsers produce logical trees, but their root names, attributes, and array wrappers work differently.

---

## Side-by-Side Comparison

| Concept | **XML (`XMLNSC`)** | **JSON (`JSON`)** |
| :--- | :--- | :--- |
| **Root wrapper** | `InputRoot.XMLNSC.<RootTag>` | `InputRoot.JSON.Data` *(for objects)* |
| **Sample path** | `InputRoot.XMLNSC.Order.Id` | `InputRoot.JSON.Data.id` |
| **Array element** | Repeated `<Item>` tags: `.Item[1]` | Wrapped under `.Item[1]` inside a `JSON.Array` node |
| **XML Attribute** | `<Order id="5">` -> `.Order.(XMLNSC.Attribute)id` | Not applicable in JSON |

---

## Fast Example: Reading an XML Attribute into JSON

Suppose incoming XML is `<Order currency="USD"><Amount>250</Amount></Order>`:

```esql
SET OutputRoot.JSON.Data.currency = InputRoot.XMLNSC.Order.(XMLNSC.Attribute)currency;
SET OutputRoot.JSON.Data.amount   = InputRoot.XMLNSC.Order.Amount;
```

<details data-type="output">
<summary>Expected JSON Output</summary>

```json
{
  "currency": "USD",
  "amount": 250
}
```

</details>

> [!TIP]
> To **create** an XML attribute in `OutputRoot`, use the exact same field-type tag:
> `SET OutputRoot.XMLNSC.Order.(XMLNSC.Attribute)currency = 'USD';`

---

**Next:** [Procedures & Functions in ESQL →](#topic-185)
