---
id: topic-227
slug: esql-write-output-fields
topicNumber: 227
title: "Building Output Messages & Parser Domains"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Build OutputRoot cleanly by preserving Properties and transport headers, selecting the target Domain (JSON/XMLNSC), and keeping child order valid."
object: "Output Message Tree"
action: "Build Payload"
commandName: "OutputRoot DOMAIN CopyMessageHeaders"
synonyms:
  - "build outputroot esql"
  - "create lastchild outputroot domain"
  - "outputroot.properties"
  - "headers above body esql"
---

# Building Output Messages & Parser Domains

When a **Compute** node creates a new outgoing message in `OutputRoot`, you first set **`Properties`** and transport headers, then create the target **body Domain** (`JSON`, `XMLNSC`, `DFDL`, or `BLOB`), and finally populate your output fields.

---

## Two Main Output Patterns

| Pattern | When to Use | Header Handling |
| :--- | :--- | :--- |
| **Fresh Output Body** | Converting XML -> JSON, or building a completely new reply structure | `CALL CopyMessageHeaders();` (or `SET OutputRoot.Properties = InputRoot.Properties;`) + `CREATE LASTCHILD OF OutputRoot DOMAIN(...)` |
| **Modify Existing Message** | Keeping the same payload and adding/changing 1–2 fields | `CALL CopyEntireMessage();` (`SET OutputRoot = InputRoot;`) then `SET OutputRoot...` |

---

## Example: Building a Fresh JSON Output with Explicit Domain

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        -- Option A: Keep MQ/HTTP headers + Properties
        CALL CopyMessageHeaders();

        -- Set response Content-Type and explicitly attach the JSON parser domain
        SET OutputRoot.Properties.ContentType = 'application/json';
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        SET OutputRoot.JSON.Data.orderId = InputRoot.XMLNSC.Order.Id;
        SET OutputRoot.JSON.Data.status  = 'PROCESSED';

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (Given XML &lt;Order&gt;&lt;Id&gt;ORD-101&lt;/Id&gt;&lt;/Order&gt;)</summary>

```json
{
  "orderId": "ORD-101",
  "status": "PROCESSED"
}
```

</details>

### Line-by-Line Breakdown

- **`CALL CopyMessageHeaders();`**: Copies `Properties` and every header folder (`MQMD`, `MQRFH2`, `HTTPInputHeader`) while leaving out the old `XMLNSC` body. If you only want `Properties` (for example dropping `HTTPInputHeader` before putting onto MQ), write `SET OutputRoot.Properties = InputRoot.Properties;` instead.
- **`SET OutputRoot.Properties.ContentType = 'application/json';`**: Updates the MIME content type inside `Properties` so downstream HTTP/MQ serialization and consumers know the payload is JSON.
- **`CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');`**: Attaches a fresh **`JSON`** parser root at the bottom of `OutputRoot` (below `Properties` and headers). Even though writing `SET OutputRoot.JSON.Data.orderId = ...` can auto-create the domain, using `CREATE LASTCHILD OF OutputRoot DOMAIN('JSON')` explicitly guarantees the right parser and clean empty body (especially important when building JSON arrays or empty objects).
- **`SET OutputRoot.JSON.Data.orderId = ...;`**: Reads `<Id>` from `InputRoot.XMLNSC.Order` and creates `orderId` inside `OutputRoot.JSON.Data`.
- **`RETURN TRUE;`**: Sends the newly constructed `OutputRoot` down the `out` terminal.

---

## Pattern B: Tweaking an Incoming Message in Place

When the input and output share the same format and you only want to add an audit field:

```esql
CALL CopyEntireMessage();
SET OutputRoot.JSON.Data.processedAt =
    CAST(CURRENT_GMTTIMESTAMP AS CHARACTER FORMAT 'IU');
RETURN TRUE;
```

- **`CALL CopyEntireMessage();`**: Copies `Properties`, all headers, and the entire parsed body into `OutputRoot` in one statement (`SET OutputRoot = InputRoot;`).
- **`SET OutputRoot.JSON.Data.processedAt = ...;`**: Adds `processedAt` (or overwrites it if it already existed) in ISO-8601 UTC format (`'IU'`).

> [!WARNING]
> **Headers MUST stay above the Body in `OutputRoot`!** ACE serializes `OutputRoot` children strictly from top (`[1]`) to bottom (`[<]`). Never overwrite `OutputRoot.Properties` after creating the body, and never place `MQMD` or `MQRFH2` after `XMLNSC`/`JSON` — otherwise serialization fails or headers are lost!

---

**Next:** [Arrays, CARDINALITY & JSON.Array →](#topic-228)
