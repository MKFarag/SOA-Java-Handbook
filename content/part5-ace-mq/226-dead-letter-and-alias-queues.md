---
id: topic-226
slug: dead-letter-and-alias-queues
topicNumber: 226
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

In production, never leave poison messages stuck looping infinitely on `IN.Q`. Configure a **Backout Queue** (`BOQNAME` + `BOTHRESH`) and a Queue Manager **Dead-Letter Queue (`DEADQ`)**.

---

## 1. Set Up Dead-Letter + Backout Queues (`runmqsc`)

```text
* 1. Create DLQ & register it on the Queue Manager
DEFINE QLOCAL('DEAD.LETTER.Q') DEFPSIST(YES) REPLACE
ALTER QMGR DEADQ('DEAD.LETTER.Q')

* 2. Create Backout Queue for IN.Q poison messages (move after 3 failed retries!)
DEFINE QLOCAL('IN.BO.Q') DEFPSIST(YES) REPLACE
ALTER QLOCAL('IN.Q') BOQNAME('IN.BO.Q') BOTHRESH(3)
```

Now if an ACE flow crashes 3 times on a malformed message, MQ automatically moves that message to `IN.BO.Q` so healthy orders keep flowing!

---

## 2. Create a Queue Alias (`DEFINE QALIAS`)

An alias lets an app send to a friendly virtual name without changing code when the target queue changes:

```text
DEFINE QALIAS('ORDERS.ALIAS') TARGET('OUT.Q') REPLACE
```

---

**Next:** [MQ Listeners: Define & Start Port 1414 →](#topic-227)
