---
id: topic-155
slug: mqinput-node
topicNumber: 155
title: "MQInput Node: Start a Flow from a Queue"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Configure MQInput to trigger a message flow whenever a message lands on an IBM MQ queue."
object: "MQInput Node"
action: "Read Queue"
commandName: "MQInput"
synonyms:
  - "mqinput node ace"
  - "queue name property"
  - "transaction mode mqinput"
  - "start flow from queue"
---
# MQInput Node: Start a Flow from a Queue

**`MQInput`** sits at the beginning of a flow and waits for messages on a specified IBM MQ queue.

![Flow Exerciser testing an MQ flow with MQInput and MQOutput connected](/images/ace/mq-flow-exerciser-test.png)

---

## Essential Properties

| Tab | Property | Recommended Setting | Why |
| :--- | :--- | :--- | :--- |
| **Basic** | **Queue name \*** | `<InputQueueName>` | Must already exist in MQ (`DEFINE QLOCAL`) |
| **MQ Connection** | **Connection** / **Policy** | Default *(Node QMGR)* or `MQEndpoint` policy | Tells ACE which Queue Manager hosts `<InputQueueName>` |
| **Input Message Parsing** | **Message domain** | `JSON` / `XMLNSC` / `BLOB` | Sets parser for incoming body bytes |
| **Advanced** | **Transaction mode** | `Automatic` *(default)* | Rolls back message to queue if flow throws an unhandled error |

---

## Quick Test Example

1. Put `{"orderId": 101}` onto `<InputQueueName>` (via **Flow Exerciser**, **MQ Explorer**, or `amqsput <InputQueueName> <QueueManagerName>`).
2. `MQInput` picks it up immediately, parses `InputRoot.JSON.Data.orderId`, and passes it out of the `Out` terminal.

> [!WARNING]
> If `MQInput` reports `MQRC 2085 (MQRC_UNKNOWN_OBJECT_NAME)`, the queue name in **Basic -> Queue name** doesn't match any queue defined on that Queue Manager (queue names are case-sensitive on MQ!).

---

**Next:** [MQOutput Node: Put a Message on a Queue →](#topic-156)
