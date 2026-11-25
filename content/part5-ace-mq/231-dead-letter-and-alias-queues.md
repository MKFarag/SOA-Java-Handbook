---
id: topic-231
slug: dead-letter-and-alias-queues
topicNumber: 231
title: "Dead-Letter Queue (DLQ) & Alias Queues"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Set up a Dead-Letter Queue + Backout Queue to capture poison messages, and create QALIAS shortcuts."
object: "DLQ & Alias Queues"
action: "Configure Safety Queues"
commandName: "DEADQ BOQNAME QALIAS"
synonyms:
  - "dead letter queue mq"
  - "boqname bothresh"
  - "define qalias"
  - "poison message backout mq"
---

# Dead-Letter Queue (DLQ) & Alias Queues

In production, never leave poison messages stuck looping infinitely on `<InputQueueName>`. Configure a **Backout Queue** (`BOQNAME` + `BOTHRESH`) and a Queue Manager **Dead-Letter Queue (`DEADQ`)**.

---

## 1. Set Up Dead-Letter + Backout Queues (`runmqsc`)

```text
* 1. Create DLQ & register it on the Queue Manager
DEFINE QLOCAL('<DeadLetterQueueName>') DEFPSIST(YES) REPLACE
ALTER QMGR DEADQ('<DeadLetterQueueName>')

* 2. Create Backout Queue for <InputQueueName> poison messages (move after 3 failed retries!)
DEFINE QLOCAL('<BackoutQueueName>') DEFPSIST(YES) REPLACE
ALTER QLOCAL('<InputQueueName>') BOQNAME('<BackoutQueueName>') BOTHRESH(3)
```

Now if an ACE flow crashes 3 times on a malformed message, MQ automatically moves that message to `<BackoutQueueName>` so healthy orders keep flowing!

---

## 2. Create a Queue Alias (`DEFINE QALIAS`)

An alias lets an app send to a friendly virtual name without changing code when the target queue changes:

```text
DEFINE QALIAS('<AliasQueueName>') TARGET('<OutputQueueName>') REPLACE
```

---

**Next:** [MQ Listeners: Define & Start Port 1414 →](#topic-232)
