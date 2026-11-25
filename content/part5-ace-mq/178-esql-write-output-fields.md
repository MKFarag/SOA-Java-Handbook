---
id: topic-178
slug: esql-write-output-fields
topicNumber: 178
title: "Build Output Messages & Copy Headers"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Set JSON and XMLNSC fields, assign parser domains, and copy headers properly so downstream MQ/HTTP nodes succeed."
object: "Output Message Tree"
action: "Build Payload"
commandName: "SET OutputRoot"
synonyms:
  - "set outputroot json data"
  - "create lastchild outputroot"
  - "copyheaders esql"
  - "outputroot domain"
---

# Build Output Messages & Copy Headers

Whenever you construct an outgoing message in ESQL, put headers first and then specify the target **Parser Domain** (`JSON.Data` or `XMLNSC`).

---

## Copy Headers vs. Full Message

```esql
-- Pattern A: Fresh output body, keep MQ/HTTP transport headers
CALL CopyMessageHeaders();
SET OutputRoot.Properties.ContentType = 'application/json';
SET OutputRoot.JSON.Data.id     = InputRoot.XMLNSC.Order.Id;
SET OutputRoot.JSON.Data.status = 'PROCESSED';

-- Pattern B: Keep original message intact and just add/edit 1 field
CALL CopyEntireMessage();
SET OutputRoot.JSON.Data.processedAt = CURRENT_TIMESTAMP;
```

---

## Creating Repeated Elements with `CREATE LASTCHILD`

When adding multiple siblings dynamically (e.g., XML or JSON arrays), `CREATE LASTCHILD` appends each item cleanly:

```esql
CREATE LASTCHILD OF OutputRoot.XMLNSC.Orders NAME 'Order';
SET OutputRoot.XMLNSC.Orders.Order[1].Id = 'ORD-101';

CREATE LASTCHILD OF OutputRoot.XMLNSC.Orders NAME 'Order';
SET OutputRoot.XMLNSC.Orders.Order[2].Id = 'ORD-102';
```

<details data-type="output">
<summary>Generated XML Output</summary>

```xml
<Orders>
  <Order><Id>ORD-101</Id></Order>
  <Order><Id>ORD-102</Id></Order>
</Orders>
```

</details>

> [!WARNING]
> **Headers MUST stay above Body in `OutputRoot`!** Never delete or overwrite `OutputRoot.Properties` or move `MQMD` below `XMLNSC`/`JSON` — ACE serializes headers in top-to-bottom child order!

---

**Next:** [CREATE FIELD, CREATE LASTCHILD, DELETE FIELD & DETACH →](#topic-179)
