---
id: topic-158
slug: which-mq-node-do-i-use
topicNumber: 158
title: "Which MQ Node Do I Use?"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Decision table comparing MQInput, MQOutput, MQGet, and MQReply nodes based on message flow requirements."
object: "MQ Nodes"
action: "Decision"
commandName: "MQ Nodes Decision"
synonyms:
  - "mq node"
  - "which mq node do i use"
  - "mqinput vs mqget"
  - "mqoutput vs mqreply"
  - "choose mq node"
---

Compares the 4 core IBM MQ nodes in the ACE Toolkit palette to choose the correct node for your flow.
Use this decision guide before creating a flow to match your integration pattern with the appropriate MQ node.

```
1. Ingress Trigger  ──► [ MQInput ]  (Starts flow when message lands on queue)
2. Mid-flow Fetch   ──► [ MQGet ]    (Reads reference message on demand inside flow)
3. Egress Dispatch  ──► [ MQOutput ] (Emits message to target queue)
4. Requester Return ──► [ MQReply ]  (Sends response to queue specified in MQMD.ReplyToQ)
```

| Integration Goal | Recommended Node | Position in Flow | Typical Properties Set |
| :--- | :--- | :--- | :--- |
| **Receive message & trigger flow** | **`MQInput`** | Start of flow | Queue name, Connection mode. |
| **Send message to a destination queue** | **`MQOutput`** | End or middle of flow | Queue name, Destination mode. |
| **Read a specific message on-demand** | **`MQGet`** | Middle of flow | Queue name, CorrelId match. |
| **Return response to dynamic requester** | **`MQReply`** | End of request-reply flow| ReplyToQ extracted automatically. |

* **MQInput Starts Threads:** An `MQInput` node listens continuously and spawns a thread execution whenever a message arrives on the input queue.
* **MQGet vs MQInput:** `MQInput` triggers the entire flow; `MQGet` fetches additional data synchronously in the middle of an already running flow.
* **MQReply Uses Headers:** `MQReply` requires the original message to have populated `MQMD.ReplyToQ` and `MQMD.ReplyToQMgr`.

* [MQInput Node](#topic-159)
* [MQOutput Node](#topic-160)
* [MQGet Node](#topic-161)
* [MQReply Node](#topic-162)
