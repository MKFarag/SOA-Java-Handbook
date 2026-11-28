---
id: topic-151
slug: compute-node-esql-transform
topicNumber: 151
title: "Compute Node: Transform Messages with ESQL"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Write clean ESQL code in a Compute node to build messages, edit headers, query databases, and split outputs."
object: "Compute Node"
action: "Transform with ESQL"
commandName: "Compute"
synonyms:
  - "compute node ace"
  - "esql module"
  - "compute mode message localenvironment"
  - "compute node properties"
---
# Compute Node: Transform Messages with ESQL

The **Compute** node lets you transform, build, or filter messages using **ESQL** — IBM's fast, SQL-style language built directly into ACE.

![Compute node Properties panel showing Data source, ESQL module, and Compute mode](/images/ace/compute-node-properties.png)

---

## When to Use Compute

- **Fastest coded option** for working with `JSON`, `XMLNSC`, `MQMD`, or `HTTPInputHeader`.
- Ideal when you need loops, conditional branches, database `PASSTHRU` queries, or **`PROPAGATE`** to emit multiple messages from one input.

---

## Key Properties to Know

| Property | Default | What You Set |
| :--- | :--- | :--- |
| **ESQL module** | Auto-generated | Links this node to a `CREATE COMPUTE MODULE ...` block in your `.esql` file |
| **Compute mode** | `Message` | Controls whether `LocalEnvironment` and `Exception` trees are copied or freshly rebuilt (`Message`, `LocalEnvironment`, `LocalEnvironment And Message`, etc.) |
| **Data source** | *(empty)* | [ODBC DSN name](#topic-216) if this Compute node queries SQL Server or another DB |

---

## Fast Mini-Example (JSON Enrichment)

Double-click the **Compute** node to open its `.esql` file and edit `Main()`:

```esql
CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        SET OutputRoot.JSON.Data.orderId = InputRoot.JSON.Data.id;
        SET OutputRoot.JSON.Data.status  = 'RECEIVED';
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "orderId": 42,
  "status": "RECEIVED"
}
```

</details>

> [!WARNING]
> Look closely at **Compute mode**: if you change `OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName` in your code, you **must** set Compute mode to **`LocalEnvironment`** or **`LocalEnvironment And Message`** — otherwise ACE ignores your change!

---

**Next:** [JavaCompute Node: Use Java Libraries & Custom Logic →](#topic-152)
