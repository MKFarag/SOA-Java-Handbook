---
id: topic-154
slug: mq-nodes-overview
topicNumber: 154
title: "MQ Nodes Overview (Input, Output, Get, Reply)"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Tell the 4 core IBM MQ nodes apart at a glance: MQInput starts a flow, MQOutput sends, MQGet reads mid-flow, MQReply answers."
object: "IBM MQ Nodes"
action: "Compare 4 Nodes"
commandName: "MQInput MQOutput MQGet MQReply"
synonyms:
  - "mqinput vs mqget"
  - "mqoutput vs mqreply"
  - "ace mq nodes difference"
  - "ibm mq palette"
---
# MQ Nodes Overview (Input, Output, Get, Reply)

ACE gives you **4 main IBM MQ nodes**. Beginners often mix up `MQInput` vs. `MQGet`, or `MQOutput` vs. `MQReply`. Look at where each node sits in a flow:

![Diagram comparing MQInput (start), MQGet (middle), MQOutput (send to fixed queue), and MQReply (send to ReplyToQ)](/images/ace/diagram-mq-nodes.svg)

---

## Pick the Right MQ Node in 5 Seconds

| Node | Position in Flow | What Queue Does It Use? | Simple Mental Model |
| :--- | :--- | :--- | :--- |
| **`MQInput`** | **Start** (Trigger) | Fixed queue you configure | *"Wake up whenever a message arrives on `IN.Q`"* |
| **`MQGet`** | **Middle** | Queue you configure (or CorrelId lookup) | *"Pause this flow right now, go fetch one message from `LOOKUP.Q`, and come back"* |
| **`MQOutput`** | **End / Anywhere** | Fixed queue (or `LocalEnvironment` override) | *"Put this message into `OUT.Q`"* |
| **`MQReply`** | **End** | Automatically reads `MQMD.ReplyToQ` & `ReplyToQMgr` | *"Return an answer to whoever sent the request"* |

---

> [!TIP]
> If your flow is triggered by `HTTPInput` and needs to pull an item from MQ in the middle, **you cannot use `MQInput` in the middle** (it has no `In` terminal!) — always use **`MQGet`** instead.

---

**Next:** [MQInput Node: Start a Flow from a Queue →](#topic-155)
