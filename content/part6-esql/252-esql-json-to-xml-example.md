---
id: topic-252
slug: esql-json-to-xml-example
topicNumber: 252
title: "Bonus Task: Transform a JSON Order to XMLNSC"
part: 'Part 6: ESQL'
sectionNumber: 47
sectionTitle: 'Tasks'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "End-to-end solved Compute node example converting an incoming JSON order (with array items) into XMLNSC with an id attribute, Lines wrapper, and rounded total."
object: "Bonus Task: JSON to XMLNSC"
action: "Transform JSON to XML"
commandName: "JSON to XML ESQL"
synonyms:
  - "json to xml esql example"
  - "convert json array to xmlnsc"
  - "create lastchild xmlnsc esql"
  - "xml attribute output esql"
---

# Bonus Task: Transform a JSON Order to `XMLNSC`

The reverse of **[Task 1](#topic-246)**: transform an incoming **JSON order** (containing line items) into a clean **`XMLNSC`** message with an XML attribute `id`, nested `<Lines><Line>` tags, and a rounded `<Total>`.

---

## Problem & Sample Input

Convert this incoming JSON order into XML and calculate `<Total>` across all line items:

```json
{
  "orderId": "ORD-9",
  "customer": "Mona",
  "items": [
    { "sku": "A1", "qty": 2, "price": 15.50 },
    { "sku": "B2", "qty": 1, "price": 9.95 }
  ]
}
```

---

## Complete Compute Module Solution

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        SET OutputRoot.Properties.ContentType = 'application/xml';

        DECLARE outOrder REFERENCE TO OutputRoot;
        DECLARE linesRef REFERENCE TO OutputRoot;
        DECLARE lineRef  REFERENCE TO OutputRoot;
        DECLARE inOrder  REFERENCE TO InputRoot.JSON.Data;
        DECLARE total    DECIMAL 0;

        CREATE LASTCHILD OF OutputRoot DOMAIN('XMLNSC');
        CREATE LASTCHILD OF OutputRoot.XMLNSC AS outOrder NAME 'Order';

        SET outOrder.(XMLNSC.Attribute)id = COALESCE(inOrder.orderId, 'UNKNOWN');
        SET outOrder.Customer             = COALESCE(inOrder.customer, 'Guest');

        CREATE LASTCHILD OF outOrder AS linesRef NAME 'Lines';

        FOR item AS inOrder.items.Item[] DO
            CREATE LASTCHILD OF linesRef AS lineRef NAME 'Line';
            SET lineRef.Sku   = item.sku;
            SET lineRef.Qty   = item.qty;
            SET lineRef.Price = item.price;

            SET total = total + (
                CAST(COALESCE(item.qty, 0)   AS DECIMAL DEFAULT 0) *
                CAST(COALESCE(item.price, 0) AS DECIMAL DEFAULT 0)
            );
        END FOR;

        SET outOrder.Total = ROUND(total, 2);
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected XMLNSC Output</summary>

```xml
<Order id="ORD-9">
  <Customer>Mona</Customer>
  <Lines>
    <Line>
      <Sku>A1</Sku>
      <Qty>2</Qty>
      <Price>15.5</Price>
    </Line>
    <Line>
      <Sku>B2</Sku>
      <Qty>1</Qty>
      <Price>9.95</Price>
    </Line>
  </Lines>
  <Total>40.95</Total>
</Order>
```

</details>

### Line-by-Line Breakdown

- **`CALL CopyMessageHeaders();`**: Preserves `Properties` and any incoming transport headers (`MQMD` / `HTTPInputHeader`) while discarding the incoming JSON body.
- **`SET OutputRoot.Properties.ContentType = 'application/xml';`**: Updates the outgoing MIME type from JSON to XML.
- **`DECLARE outOrder / linesRef / lineRef REFERENCE TO OutputRoot;`**: Initializes reusable `REFERENCE` placeholders at the top of `Main()` (required by ESQL's top-of-block `DECLARE` rule) so `CREATE LASTCHILD ... AS` can rebind them later.
- **`DECLARE inOrder REFERENCE TO InputRoot.JSON.Data;`**: Creates a short cursor to the incoming JSON body object.
- **`CREATE LASTCHILD OF OutputRoot DOMAIN('XMLNSC');`**: Attaches the `XMLNSC` parser domain at the end of `OutputRoot` (below `Properties` and headers).
- **`CREATE LASTCHILD OF OutputRoot.XMLNSC AS outOrder NAME 'Order';`**: Creates the root `<Order>` XML tag and binds `outOrder` to it.
- **`SET outOrder.(XMLNSC.Attribute)id = COALESCE(inOrder.orderId, 'UNKNOWN');`**: Attaches `id="ORD-9"` as an **XML attribute** on `<Order>` rather than a nested `<id>` element, defaulting to `'UNKNOWN'` if missing.
- **`SET outOrder.Customer = COALESCE(inOrder.customer, 'Guest');`**: Creates `<Customer>Mona</Customer>` as the first child tag of `<Order>`.
- **`CREATE LASTCHILD OF outOrder AS linesRef NAME 'Lines';`**: Creates the `<Lines>` wrapper tag after `<Customer>` and binds `linesRef` directly to it.
- **`FOR item AS inOrder.items.Item[] DO`**: Loops over every element in the JSON `items` array.
- **`CREATE LASTCHILD OF linesRef AS lineRef NAME 'Line';`**: Appends a fresh `<Line>` child inside `<Lines>` on every iteration and binds `lineRef` to it so `.Sku`, `.Qty`, and `.Price` nest inside that new `<Line>`.
- **`CAST(COALESCE(item.qty, 0) AS DECIMAL DEFAULT 0) * ...`**: Converts `qty` and `price` safely to `DECIMAL` before multiplying so missing or string values never produce `NULL` or `BIP2456E`.
- **`SET outOrder.Total = ROUND(total, 2);`**: Writes `<Total>40.95</Total>` rounded to 2 decimal places after the `<Lines>` element, and `RETURN TRUE;` emits the XML message.

> [!TIP]
> Notice why attribute `id` appears on `<Order id="ORD-9">` even though `<Lines>` is created afterward: in ACE's `XMLNSC` tree, nodes marked `(XMLNSC.Attribute)` automatically serialize inside the parent element's opening tag! Still, setting attributes right after creating the element keeps your ESQL tidy and predictable.

---

**Next:** [Practice Exercises (6 Hands-On Challenges) →](#topic-253)
