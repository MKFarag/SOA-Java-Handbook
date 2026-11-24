---
id: topic-136
slug: the-compute-node-overview
topicNumber: 136
title: "The Compute Node Overview"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE & MQ Basics'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Discover the Compute node: the primary ESQL engine used for transforming, building, and routing messages."
object: "Compute Node"
action: "Overview"
commandName: "Compute Node"
synonyms:
  - "compute node"
  - "esql node"
  - "mapping vs compute"
  - "transformation node"
---

The Compute node is the primary programmatic transformation node in ACE, executing user-written ESQL modules.
Use the Compute node whenever you need to transform messages, construct new output payloads, or interact with databases.

```
[ Upstream Node ] ──► ( in ) [ Compute Node ] ( out ) ──► [ Downstream Node ]
                                  │
                          ( Executes ESQL )
```

| Property | Default Value | Description |
| :--- | :--- | :--- |
| **ESQL Module** | `<FlowName>_Compute` | The name of the ESQL module in the `.esql` file to execute for each message. |
| **Compute Mode** | `Message` | Controls which trees (`OutputRoot`, `LocalEnvironment`, `ExceptionList`) propagate downstream. |
| **Data Source** | Blank | Optional ODBC datasource name if the node executes SQL queries against a database. |

* **Compute vs. Mapping Node:** Use Compute (ESQL) for high performance and complex procedural logic; use Mapping node for visual drag-and-drop schema-based mappings.
* **OutputRoot starts empty:** Inside a Compute node, `OutputRoot` starts completely blank; you must explicitly populate headers and payload.
* **Validation:** The Compute node can enforce validation against schemas by toggling the *Validation* property tab.

* [What is ESQL and Where Does It Run](#topic-137)
* [The Compute Node: Anatomy and Properties](#topic-138)
* [The Message Tree Architecture](#topic-139)
