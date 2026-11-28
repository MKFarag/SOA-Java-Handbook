---
id: topic-246
slug: esql-task-1-xml-to-json
topicNumber: 246
title: "Task 1: Convert an XML Order to JSON"
part: 'Part 6: ESQL'
sectionNumber: 47
sectionTitle: 'Tasks'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Solved ACE task: convert an incoming MQ XML order (with attribute id and repeating Item elements) into a typed JSON object with an items array."
object: "Task 1: Transformation"
action: "XML to JSON"
commandName: "XML to JSON ESQL Task"
synonyms:
  - "convert xml order to json esql"
  - "task 1 transformation xml to json"
  - "xml attribute to json array esql"
  - "repeat type name xml to json"
---

# Task 1: Convert an XML Order to JSON

**Technique:** Tree transformation across parser domains (`XMLNSC` -> `JSON`), reading XML attributes, building a `JSON.Array`, and looping fast with `REFERENCE` + `MOVE`.

---

## Problem & Sample Input

An XML order arrives over MQ. Return JSON with the order `id` (stored as an XML attribute), the `customer`, and an `items` array with numeric quantities:

```xml
<Order id="A1">
  <Customer>Mona</Customer>
  <Item><Sku>X1</Sku><Qty>2</Qty></Item>
  <Item><Sku>Y2</Sku><Qty>5</Qty></Item>
</Order>
```

---

## Complete Compute Module Solution

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        SET OutputRoot.Properties = InputRoot.Properties;
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE o REFERENCE TO InputRoot.XMLNSC.Order;
        SET OutputRoot.JSON.Data.orderId  = o.(XMLNSC.Attribute)id;
        SET OutputRoot.JSON.Data.customer = o.Customer;

        CREATE FIELD OutputRoot.JSON.Data.items
            IDENTITY (JSON.Array)items;

        DECLARE i INTEGER 1;
        DECLARE r REFERENCE TO o.Item[1];

        WHILE LASTMOVE(r) DO
            SET OutputRoot.JSON.Data.items.Item[i].sku = r.Sku;
            SET OutputRoot.JSON.Data.items.Item[i].qty = CAST(r.Qty AS INTEGER);
            SET i = i + 1;
            MOVE r NEXTSIBLING REPEAT TYPE NAME;
        END WHILE;

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected JSON Output</summary>

```json
{
  "orderId": "A1",
  "customer": "Mona",
  "items": [
    { "sku": "X1", "qty": 2 },
    { "sku": "Y2", "qty": 5 }
  ]
}
```

</details>

### Line-by-Line Breakdown

- **`SET OutputRoot.Properties = InputRoot.Properties;`**: Copies `Properties` cleanly into `OutputRoot` without copying XML-specific headers (if you also need `MQMD`, call `CALL CopyMessageHeaders();` instead, and optionally set `OutputRoot.Properties.ContentType = 'application/json';`).
- **`CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');`**: Attaches the **`JSON`** parser domain as the body root under `OutputRoot`.
- **`DECLARE o REFERENCE TO InputRoot.XMLNSC.Order;`**: Binds a reusable cursor `o` to `<Order>` so you don't repeatedly spell out `InputRoot.XMLNSC.Order`.
- **`o.(XMLNSC.Attribute)id`**: Uses the `(XMLNSC.Attribute)` field-type qualifier to read `id="A1"` from `<Order id="A1">` instead of looking for an `<id>` child tag.
- **`SET OutputRoot.JSON.Data.customer = o.Customer;`**: Reads `<Customer>Mona</Customer>` and assigns `'Mona'` to JSON key `customer`.
- **`CREATE FIELD OutputRoot.JSON.Data.items IDENTITY (JSON.Array)items;`**: Creates the `items` container marked as a **`JSON.Array`**, ensuring ACE outputs `"items": [...]` even if there are 0, 1, or many items.
- **`DECLARE i INTEGER 1;`**: Output JSON array index starting at **`1`** (remember ESQL arrays are 1-based!).
- **`DECLARE r REFERENCE TO o.Item[1];`**: Points cursor `r` to the first `<Item>` inside `<Order>`.
- **`WHILE LASTMOVE(r) DO`**: Runs as long as `r` points to a valid `<Item>` (executes 0 times cleanly if an order has zero `<Item>` tags!).
- **`SET OutputRoot.JSON.Data.items.Item[i].sku = r.Sku;`**: Writes the current item's `<Sku>` into `items[i].sku`.
- **`CAST(r.Qty AS INTEGER)`**: Crucial! XMLNSC parses `<Qty>2</Qty>` as text `'2'`. Casting to `INTEGER` ensures the JSON output has `"qty": 2` (a number) instead of `"qty": "2"` (a string).
- **`SET i = i + 1;`**: Advances the target JSON array slot for the next item.
- **`MOVE r NEXTSIBLING REPEAT TYPE NAME;`**: Steps `r` in $O(1)$ time to the next sibling `<Item>` with the same type and name, automatically skipping non-`Item` tags like `<Customer>` or comments.
- **`RETURN TRUE;`**: Sends the finished JSON message down the Compute node's `out` terminal.

> [!TIP]
> For large output arrays, you can even avoid indexing `.Item[i]` on the write side too by appending with `CREATE LASTCHILD OF itemsRef AS outItem NAME 'Item';`!

---

**Next:** [Task 2: Total & Aggregate Paid Transactions →](#topic-247)
