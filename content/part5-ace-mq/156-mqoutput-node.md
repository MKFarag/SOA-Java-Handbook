---
id: topic-156
slug: mqoutput-node
topicNumber: 156
title: "MQOutput Node: Put a Message on a Queue"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Configure MQOutput to write messages to a static queue or dynamically route them using LocalEnvironment."
object: "MQOutput Node"
action: "Write Queue"
commandName: "MQOutput"
synonyms:
  - "mqoutput node"
  - "destination mode destination list"
  - "localenvironment mq destinationdata"
  - "dynamic queue routing"
---
# MQOutput Node: Put a Message on a Queue

**`MQOutput`** serializes your message tree and delivers it to an IBM MQ queue.

---

## Essential Properties

| Tab | Property | Common Setting | What It Does |
| :--- | :--- | :--- | :--- |
| **Basic** | **Queue name** | `<OutputQueueName>` | Target queue name |
| **Basic** | **Queue manager name** | Empty *(local)* or remote QMGR | Optional remote QMGR name |
| **Request** | **New message ID** / **Reply-to queue** | Optional | Stamps `MQMD.ReplyToQ` when sending a request expecting a reply |
| **Advanced** | **Destination mode** | `Queue Name` *(fixed)* or `Destination List` *(dynamic)* | Pick `Destination List` when ESQL chooses the target queue dynamically |

---

## Dynamic Queue Routing in ESQL

Set **Destination mode** to **Destination List** on `MQOutput`, then set the target queue inside a **Compute** node (with `Compute mode = LocalEnvironment And Message`):

```esql
SET OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName = '<TargetQueueName>';
```

<details data-type="output">
<summary>Result in IBM MQ Explorer</summary>

```text
Message lands on <TargetQueueName> instead of the static queue name typed on MQOutput.
```

</details>

> [!TIP]
> Wire `MQOutput.Out` to an audit or reply step if your flow isn't finished yet! Note that `MQOutput` is **not** forced to be the last node in a flow.

---

**Next:** [MQGet Node: Read a Queue Mid-Flow →](#topic-157)
