---
id: topic-224
slug: esql-navigating-message-tree
topicNumber: 224
title: "Tree Navigation: Paths, Attributes & Namespaces"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Navigate fields, indexes ([1], [<]), CARDINALITY, EXISTS, XML attributes, root element names, and XML namespaces in ESQL."
object: "Tree Navigation"
action: "Read Paths"
commandName: "FIELDNAME EXISTS CARDINALITY NAMESPACE"
synonyms:
  - "navigate message tree esql"
  - "xmlnsc attribute esql"
  - "declare namespace esql"
  - "fieldname inputbody"
  - "last item [<] esql"
---

# Tree Navigation: Paths, Attributes & Namespaces

Every message field in ACE sits at a path starting from **`InputRoot`** (or `Root` in Filter/Database nodes). Mastering index notation, field inspection functions, attributes, and namespaces lets you read any XML, JSON, or DFDL message accurately.

---

## Essential Path Expressions Cheat Table

| Expression | Meaning |
| :--- | :--- |
| **`InputRoot.XMLNSC.Order.Item[1]`** | **First** `<Item>` element (ESQL indexes start at `1`) |
| **`InputRoot.XMLNSC.Order.Item[<]`** | **Last** `<Item>` element (`[<2]` means second-to-last) |
| **`CARDINALITY(InputRoot.XMLNSC.Order.Item[])`** | **Total count** of `<Item>` elements (`0` if none exist) |
| **`EXISTS(InputRoot.JSON.Data.email[])`** | **`TRUE`** if `email` exists in the tree, **`FALSE`** otherwise |
| **`InputRoot.XMLNSC.Order.(XMLNSC.Attribute)id`** | Value of the XML attribute **`id`** on `<Order id="A1">` |
| **`FIELDNAME(InputBody.*[1])`** | Name of the **root body element** (e.g., `'Order'` or `'Data'`) |
| **`InputRoot.XMLNSC.ns:Order`** | `<Order>` inside an XML namespace (`DECLARE ns NAMESPACE '<NamespaceUri>';`) |

---

## Example: Reading Attributes, Root Name & XML Namespaces

Suppose this namespaced XML arrives on `MQInput`:

```xml
<ord:Order xmlns:ord="https://example.com/orders" id="A1">
  <ord:Item><ord:Sku>X1</ord:Sku></ord:Item>
  <ord:Item><ord:Sku>X2</ord:Sku></ord:Item>
</ord:Order>
```

Read its root tag name, namespace elements, XML attribute, and first/last items in ESQL:

```esql
BROKER SCHEMA <SchemaName>

DECLARE ns NAMESPACE '<NamespaceUri>';

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();

        DECLARE orderRef REFERENCE TO InputRoot.XMLNSC.ns:Order;

        SET OutputRoot.JSON.Data.rootTag  = FIELDNAME(InputBody.*[1]);
        SET OutputRoot.JSON.Data.orderId  = orderRef.(XMLNSC.Attribute)id;
        SET OutputRoot.JSON.Data.count    = CARDINALITY(orderRef.ns:Item[]);
        SET OutputRoot.JSON.Data.firstSku = orderRef.ns:Item[1].ns:Sku;
        SET OutputRoot.JSON.Data.lastSku  = orderRef.ns:Item[<].ns:Sku;
        SET OutputRoot.JSON.Data.hasEmail = EXISTS(orderRef.ns:Email[]);

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (When &lt;NamespaceUri&gt; Matches the Incoming XML Namespace)</summary>

```json
{
  "rootTag": "Order",
  "orderId": "A1",
  "count": 2,
  "firstSku": "X1",
  "lastSku": "X2",
  "hasEmail": false
}
```

</details>

### Line-by-Line Breakdown

- **`DECLARE ns NAMESPACE '<NamespaceUri>';`**: Binds prefix `ns` to the target XML namespace URI (for example `'https://example.com/orders'`). Note that your ESQL prefix (`ns`) does **not** have to match the sender's prefix (`ord`) — ACE matches the underlying namespace URI!
- **`DECLARE orderRef REFERENCE TO InputRoot.XMLNSC.ns:Order;`**: Points `orderRef` directly to the namespaced `<Order>` element inside the `XMLNSC` domain.
- **`FIELDNAME(InputBody.*[1])`**: `InputBody` is shorthand for the last child of `InputRoot` (here `InputRoot.XMLNSC`), `*` matches any element name regardless of tag or namespace, `[1]` picks the first child (`Order`), and `FIELDNAME(...)` returns `'Order'`.
- **`orderRef.(XMLNSC.Attribute)id`**: The field-type qualifier **`(XMLNSC.Attribute)`** tells ESQL to read an XML attribute (`id="A1"`) instead of a child tag `<id>`. (Usually XML attributes themselves have no namespace prefix unless declared `ns:id`.)
- **`CARDINALITY(orderRef.ns:Item[])`**: The trailing **`[]`** turns the path into a list of all matching `ns:Item` siblings so `CARDINALITY(...)` can count them (`2`).
- **`orderRef.ns:Item[1].ns:Sku` / `orderRef.ns:Item[<].ns:Sku`**: `[1]` reads the first item (`'X1'`), and **`[<]`** is ESQL's reverse-index shorthand for the very last element (`'X2'`).
- **`EXISTS(orderRef.ns:Email[])`**: Checks whether any `<Email>` node is present (`FALSE` here). Always pass a list path ending in `[]` inside `EXISTS(...)` and `CARDINALITY(...)`.

> [!WARNING]
> **Field names are strictly case-sensitive!** Writing `orderRef.ns:sku` instead of `orderRef.ns:Sku` does **not** throw a compile or runtime error — ESQL silently returns **`NULL`**. If a field unexpectedly turns up `NULL`, verify exact casing, namespace prefix, and `(XMLNSC.Attribute)` first.

---

**Next:** [NULL Handling, COALESCE & Three-Valued Logic →](#topic-225)
