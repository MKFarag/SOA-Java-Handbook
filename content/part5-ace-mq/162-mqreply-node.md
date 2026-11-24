---
id: topic-162
slug: mqreply-node
topicNumber: 162
title: "MQReply Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Route response messages automatically to the queue and queue manager specified in MQMD.ReplyToQ."
object: "MQReply Node"
action: "Configure"
commandName: "MQReply"
synonyms:
  - "mqreply"
  - "mqreply node"
  - "replytoq"
  - "request reply"
  - "response node"
---

The MQReply node sends an outbound response back to the requester queue designated in `MQMD.ReplyToQ`.
Use this node at the completion of a request-reply pattern flow without hardcoding the response queue name.

```
[ Input: MQInput ] ──► [ Transform ] ──► [ MQReply Node ] ──► [ Client ReplyToQ ]
```

| Property Tab | Property Name | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **Basic** | Destination | Extracted from MQMD | Uses `MQMD.ReplyToQ` and `MQMD.ReplyToQMgr` automatically. |
| **Advanced** | `Transaction Mode` | `Automatic` | Participates in the flow transaction. |

```
Node: MQReply (Named: Send_Client_Reply)
  └── Advanced -> Transaction Mode: Automatic
```

* **ReplyToQ Requirement:** The original input message **must** contain a valid `MQMD.ReplyToQ`; if blank, the MQReply node raises error `BIP2638E`.
* **CorrelId Copying:** Best practice is to set `SET OutputRoot.MQMD.CorrelId = InputRoot.MQMD.MsgId;` so client applications can match the response.
* **Zero Target Hardcoding:** You never configure a queue name property on an MQReply node; it always resolves dynamically from the message header.

* [Which MQ Node Do I Use?](#topic-158)
* [MQInput Node](#topic-159)
* [MQOutput Node](#topic-160)
