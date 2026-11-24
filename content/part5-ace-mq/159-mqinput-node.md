---
id: topic-159
slug: mqinput-node
topicNumber: 159
title: "MQInput Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Read messages from an IBM MQ queue, configure transactionality, parser domains, and thread concurrency."
object: "MQInput Node"
action: "Configure"
commandName: "MQInput"
synonyms:
  - "mqinput"
  - "mqinput node"
  - "read queue"
  - "message input"
  - "queue listener node"
---

The MQInput node retrieves messages from an IBM MQ queue and launches flow execution.
Use this node as the starting element of asynchronous message-driven integration flows.

```
[ MQ Queue: IN.Q ] ──► ( in ) [ MQInput Node ] ( out ) ──► [ Compute Node ]
```

| Property Tab | Property Name | Default Value | Recommended Value for Junior |
| :--- | :--- | :--- | :--- |
| **Basic** | `Queue Name` | Blank (Required) | Target queue name (e.g. `IN.Q`). |
| **Input Message Parsing** | `Message Domain` | Blank | Set explicitly to `JSON` (or `XMLNSC`). |
| **Connection** | `Connection` | Local queue manager | Local queue manager or MQEndpoint policy. |
| **Advanced** | `Transaction Mode` | `Automatic` | `Automatic` (commits if flow succeeds, rolls back on error). |

```
Node: MQInput (Named: Read_Customer_Queue)
  ├── Basic -> Queue Name: IN.Q
  ├── Input Message Parsing -> Message Domain: JSON
  └── Connection -> Connection: Local queue manager
```

* **Domain Parser Selection:** Always set the **Message Domain** property (e.g. `JSON`); leaving it blank defaults to raw `BLOB` bytes.
* **Serialization Failures:** If message content does not match the chosen domain (e.g. corrupt JSON text), the node routes to the `failure` terminal.
* **Poison Messages:** Configure Backout Queue settings on the MQ queue to prevent poison messages from looping indefinitely.

* [Which MQ Node Do I Use?](#topic-158)
* [MQOutput Node](#topic-160)
* [Terminals and Message Routing](#topic-135)
