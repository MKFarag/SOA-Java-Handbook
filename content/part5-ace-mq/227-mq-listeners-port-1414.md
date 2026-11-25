---
id: topic-227
slug: mq-listeners-port-1414
topicNumber: 227
title: "MQ Listeners: Define & Start Port 1414"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Open a TCP/IP listening port (default 1414) on your Queue Manager so remote ACE servers or MQ Explorer can connect."
object: "MQ Listener"
action: "Open Port 1414"
commandName: "DEFINE LISTENER & START LISTENER"
synonyms:
  - "mq listener 1414"
  - "define listener trptype tcp"
  - "start listener runmqsc"
  - "display lsstatus"
---

# MQ Listeners: Define & Start Port 1414

By default, a newly created Queue Manager **has no running TCP listener**, causing `MQRC 2538 (HOST_NOT_AVAILABLE)` when remote ACE flows or MQ Explorer try connecting over TCP/IP.

---

## Define, Auto-Start & Verify Listener (`runmqsc <QueueManagerName>`)

```text
DEFINE LISTENER('<ListenerName>') TRPTYPE(TCP) PORT(1414) CONTROL(QMGR) REPLACE
START LISTENER('<ListenerName>')
DISPLAY LSSTATUS('<ListenerName>')
```

<details data-type="output">
<summary>Expected Output</summary>

```text
AMQ8626I: IBM MQ listener created.
AMQ8021I: Request to start IBM MQ Listener accepted.
AMQ8631I: Display listener status details.
   LISTENER(<ListenerName>)                  STATUS(RUNNING)
   PORT(1414)
```

</details>

---

> [!TIP]
> Always include **`CONTROL(QMGR)`**! That tells IBM MQ to automatically start and stop `<ListenerName>` every time `strmqm <QueueManagerName>` / `endmqm <QueueManagerName>` runs in the future.

---

**Next:** [MQ Channels: Server-Connection Channel (SVRCONN) →](#topic-228)
