---
id: topic-239
slug: mq-commands-cheat-sheet
topicNumber: 239
title: "IBM MQ Commands Cheat Sheet"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "One-page copy-paste reference for all IBM MQ OS commands, runmqsc object commands, and amqs sample testing tools."
object: "MQ CLI Cheat Sheet"
action: "Quick Lookup"
commandName: "MQ Cheat Sheet"
synonyms:
  - "mq commands cheat sheet"
  - "runmqsc commands list"
  - "amqsput amqsget amqsbcg"
---

# IBM MQ Commands Cheat Sheet

Replace `<QueueManagerName>` with your Queue Manager name and `<InputQueueName>` / `<OutputQueueName>` with your queue names.

---

## OS Shell Commands (CMD / Bash)

| Task | Command |
| :--- | :--- |
| Check Queue Managers & statuses | `dspmq` |
| Check MQ version | `dspmqver` |
| Create QMGR & set default | `crtmqm -q <QueueManagerName>` |
| Start / Stop QMGR | `strmqm <QueueManagerName>` / `endmqm -w <QueueManagerName>` |
| Delete QMGR | `dltmqm <QueueManagerName>` |
| Open MQSC admin prompt | `runmqsc <QueueManagerName>` |
| Send / Get / Browse test msg | `amqsput <InputQueueName> <QueueManagerName>` / `amqsget <OutputQueueName> <QueueManagerName>` / `amqsbcg <InputQueueName> <QueueManagerName>` |
| Translate MQRC code | `mqrc 2035` |

---

## Inside `runmqsc <QueueManagerName>`

| Task | MQSC Command |
| :--- | :--- |
| Create local queue | `DEFINE QLOCAL('<InputQueueName>') DEFPSIST(YES) MAXDEPTH(50000) REPLACE` |
| List user queues + depth | `DISPLAY QLOCAL(*) WHERE(NAME NS 'SYSTEM.') CURDEPTH` |
| Who has queue open (`PID`)? | `DISPLAY QSTATUS('<InputQueueName>') TYPE(HANDLE) APPLTAG PID` |
| Empty all messages in queue | `CLEAR QLOCAL('<InputQueueName>')` |
| Create & start port 1414 listener | `DEFINE LISTENER('<ListenerName>') TRPTYPE(TCP) PORT(1414) CONTROL(QMGR) REPLACE` + `START LISTENER('<ListenerName>')` |
| Create remote client channel | `DEFINE CHANNEL('<ChannelName>') CHLTYPE(SVRCONN) TRPTYPE(TCP) REPLACE` |
| Exit `runmqsc` | `END` |

---

**Next Section — SQL Server & Database Setup:** [ODBC vs JDBC in ACE: Which Database Setup Do You Need? →](#topic-240)
