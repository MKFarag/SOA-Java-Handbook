---
id: topic-160
slug: mqoutput-node
topicNumber: 160
title: "MQOutput Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Serialize and deliver outgoing messages to an IBM MQ queue with transactional commit support."
object: "MQOutput Node"
action: "Configure"
commandName: "MQOutput"
synonyms:
  - "mqoutput"
  - "mqoutput node"
  - "send to queue"
  - "write queue"
  - "put message node"
---

The MQOutput node serializes the in-memory `OutputRoot` tree and delivers messages to an IBM MQ destination queue.
Use this node to put completed transformation results onto an outbound queue for downstream consumers.

```
[ Compute Node ] ──► ( in ) [ MQOutput Node ] ( out ) ──► [ MQ Queue: OUT.Q ]
```

| Property Tab | Property Name | Default Value | Recommended Value for Junior |
| :--- | :--- | :--- | :--- |
| **Basic** | `Queue Name` | Blank | Target queue name (e.g. `OUT.Q`). |
| **Basic** | `Queue Manager Name`| Blank | Leave blank to use node's default queue manager. |
| **Advanced** | `Destination Mode` | `Queue Name` | Use `Destination List` for dynamic routing via LocalEnvironment. |
| **Advanced** | `Transaction Mode` | `Automatic` | `Automatic` (participates in flow transaction). |

```
Node: MQOutput (Named: Write_Outbound_Queue)
  ├── Basic -> Queue Name: OUT.Q
  ├── Connection -> Connection: Local queue manager
  └── Advanced -> Transaction Mode: Automatic
```

* **Dynamic Destination:** To override the target queue dynamically in ESQL, set Destination Mode to `Destination List` and write to `OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName`.
* **Corrupted MQMD:** If input message was also MQ, assign `SET OutputRoot.MQMD.MsgId = NULL;` in Compute node to generate a fresh `MsgId`.
* **Queue Full Error:** If the target queue is full, the MQOutput node raises error `MQRC 2053 (MQRC_Q_FULL)` and routes to its `failure` terminal.

* [Which MQ Node Do I Use?](#topic-158)
* [MQInput Node](#topic-159)
* [Environment vs. LocalEnvironment](#topic-152)
