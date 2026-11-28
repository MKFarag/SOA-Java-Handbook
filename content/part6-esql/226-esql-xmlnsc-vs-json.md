---
id: topic-226
slug: esql-xmlnsc-vs-json
topicNumber: 226
title: "XMLNSC vs JSON Trees, Attributes & Arrays"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Compare XMLNSC and JSON message trees in ESQL: root wrappers, attributes, namespaces, data types, and array representation."
object: "XMLNSC vs JSON"
action: "Compare Trees"
commandName: "InputRoot.XMLNSC vs JSON.Data"
synonyms:
  - "xmlnsc vs json esql"
  - "xml attribute vs json esql"
  - "json.data item"
  - "xmlnsc string type cast"
---

# `XMLNSC` vs `JSON` Trees, Attributes & Arrays

Both parsers produce logical ESQL trees, so you read and write them with dot-separated paths — but their **root element, attributes, data types, and arrays** differ in important ways.

---

## Side-by-Side Comparison

| Concept | **XML (`XMLNSC`)** | **JSON (`JSON`)** |
| :--- | :--- | :--- |
| **Root wrapper** | `InputRoot.XMLNSC.<RootTag>` (e.g., `Order`) | `InputRoot.JSON.Data` *(for JSON objects/arrays)* |
| **Field path** | `InputRoot.XMLNSC.Order.Amount` | `InputRoot.JSON.Data.amount` |
| **Repeating arrays** | Repeated sibling `<Item>` tags (`Order.Item[1]`) | Parent tagged `JSON.Array` containing `.Item[1]`, `.Item[2]` |
| **Attributes** | `<Order id="A1">` -> `Order.(XMLNSC.Attribute)id` | Not applicable in JSON (use normal keys) |
| **Namespaces** | Requires `DECLARE ns NAMESPACE '...'` + `ns:Order` | Not applicable in JSON |
| **Scalar data types** | Parsed as **`CHARACTER`** unless schema-validated | Preserves native JSON **`INTEGER`**, **`DECIMAL`**, **`BOOLEAN`**, **`CHARACTER`** |

---

## Example: Reading XML Attributes & Casting XML Text to JSON Numbers

Suppose this XML arrives:

```xml
<Order currency="USD" priority="1">
  <Amount>250.50</Amount>
  <Express>true</Express>
</Order>
```

Transform it to typed JSON in ESQL:

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE o REFERENCE TO InputRoot.XMLNSC.Order;

        SET OutputRoot.JSON.Data.currency = o.(XMLNSC.Attribute)currency;
        SET OutputRoot.JSON.Data.priority = CAST(o.(XMLNSC.Attribute)priority AS INTEGER);
        SET OutputRoot.JSON.Data.amount   = CAST(o.Amount AS DECIMAL);
        SET OutputRoot.JSON.Data.express  = CAST(o.Express AS BOOLEAN);

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected JSON Output</summary>

```json
{
  "currency": "USD",
  "priority": 1,
  "amount": 250.50,
  "express": true
}
```

</details>

### Line-by-Line Breakdown

- **`CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');`**: Explicitly creates the **`JSON`** parser domain as the last child of `OutputRoot` (after `Properties` and any headers copied by `CopyMessageHeaders()`).
- **`DECLARE o REFERENCE TO InputRoot.XMLNSC.Order;`**: Binds pointer `o` to `<Order>`, the XML root tag directly under `XMLNSC`. Notice XML does **not** have a `.Data` wrapper!
- **`o.(XMLNSC.Attribute)currency`**: Uses the **`(XMLNSC.Attribute)`** field-type qualifier to read the attribute `currency="USD"` instead of looking for a `<currency>` child tag.
- **`CAST(o.(XMLNSC.Attribute)priority AS INTEGER)`**: Without `CAST`, XML attributes and tags are `CHARACTER`, so JSON output would serialize `"priority": "1"` in quotes. Casting to `INTEGER` produces the numeric JSON value `1`.
- **`CAST(o.Amount AS DECIMAL)`**: Converts XML text `'250.50'` to an exact JSON number (`250.50`). Always use `DECIMAL` rather than `FLOAT` for currency values.
- **`CAST(o.Express AS BOOLEAN)`**: Converts XML text `'true'` into a native JSON boolean (`true` without quotes).

> [!TIP]
> To **create** an XML attribute when outputting XML, use the exact same qualifier on `OutputRoot`:
> `SET OutputRoot.XMLNSC.Order.(XMLNSC.Attribute)currency = 'USD';`

---

**Next:** [Building Output Messages & Parser Domains →](#topic-227)
