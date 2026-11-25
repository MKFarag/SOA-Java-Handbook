---
id: topic-192
slug: esql-json-to-xml-example
topicNumber: 192
title: "Full Example: Transform JSON to XMLNSC"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Complete end-to-end Compute node example converting an incoming JSON order (with array items) into clean XMLNSC."
object: "JSON to XMLNSC"
action: "Transform Full Payload"
commandName: "JSON to XML ESQL"
synonyms:
  - "json to xml esql example"
  - "full esql example"
  - "convert json array to xmlnsc"
---

# Full Example: Transform JSON to XMLNSC

Here is a complete, real-world Compute node transforming an incoming **JSON order** (containing line items) into an **XMLNSC** message with attributes and computed total.

---

## Complete Compute Module

```esql
CREATE COMPUTE MODULE JsonOrderToXml_Compute
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        SET OutputRoot.Properties.ContentType = 'application/xml';

        DECLARE outOrder REFERENCE TO OutputRoot;
        DECLARE lineRef  REFERENCE TO OutputRoot;
        DECLARE inOrder  REFERENCE TO InputRoot.JSON.Data;
        CREATE LASTCHILD OF OutputRoot DOMAIN 'XMLNSC';
        CREATE LASTCHILD OF OutputRoot.XMLNSC AS outOrder NAME 'Order';

        SET outOrder.(XMLNSC.Attribute)id = COALESCE(inOrder.orderId, 'UNKNOWN');
        SET outOrder.Customer             = COALESCE(inOrder.customer, 'Guest');

        DECLARE total DECIMAL 0;
        CREATE LASTCHILD OF outOrder NAME 'Lines';
        DECLARE linesRef REFERENCE TO outOrder.Lines;

        FOR item AS inOrder.items.Item[] DO
            CREATE LASTCHILD OF linesRef AS lineRef NAME 'Line';
            SET lineRef.Sku   = item.sku;
            SET lineRef.Qty   = item.qty;
            SET lineRef.Price = item.price;
            SET total = total + (COALESCE(item.qty, 0) * COALESCE(item.price, 0));
        END FOR;

        SET outOrder.Total = ROUND(total, 2);
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Input JSON & Transformed XML Output</summary>

```xml
<!-- Input JSON: {"orderId":"ORD-9","customer":"SCB","items":[{"sku":"A1","qty":2,"price":15.5}]} -->
<Order id="ORD-9">
  <Customer>SCB</Customer>
  <Lines>
    <Line>
      <Sku>A1</Sku>
      <Qty>2</Qty>
      <Price>15.5</Price>
    </Line>
  </Lines>
  <Total>31.0</Total>
</Order>
```

</details>

> [!NOTE]
> Remember to declare `DECLARE outOrder REFERENCE TO OutputRoot;` and `DECLARE lineRef REFERENCE TO OutputRoot;` right after `CREATE LASTCHILD` or declare helper references at the top of `BEGIN ... END` before using `AS outOrder`! (Or declare `DECLARE lineRef REFERENCE TO outOrder;` before the loop — ESQL binds `AS` references cleanly when already declared or dynamically scoped.)

---

**Next:** [ESQL Quick Reference Cheat Sheet →](#topic-193)
