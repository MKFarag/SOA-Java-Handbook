---
id: topic-234
slug: mq-commands-cheat-sheet
topicNumber: 234
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

Replace `SCBQM` with your Queue Manager name and `IN.Q` / `OUT.Q` with your queue names.

---

## OS Shell Commands (CMD / Bash)

| Task | Command |
| :--- | :--- |
| Check Queue Managers & statuses | `dspmq` |
| Check MQ version | `dspmqver` |
| Create QMGR & set default | `crtmqm -q SCBQM` |
| Start / Stop QMGR | `strmqm SCBQM` / `endmqm -w SCBQM` |
| Delete QMGR | `dltmqm SCBQM` |
| Open MQSC admin prompt | `runmqsc SCBQM` |
| Send / Get / Browse test msg | `amqsput IN.Q SCBQM` / `amqsget OUT.Q SCBQM` / `amqsbcg IN.Q SCBQM` |
| Translate MQRC code | `mqrc 2035` |

---

## Inside `runmqsc SCBQM`

| Task | MQSC Command |
| :--- | :--- |
| Create local queue | `DEFINE QLOCAL('IN.Q') DEFPSIST(YES) MAXDEPTH(50000) REPLACE` |
| List user queues + depth | `DISPLAY QLOCAL(*) WHERE(NAME NS 'SYSTEM.') CURDEPTH` |
| Who has queue open (`PID`)? | `DISPLAY QSTATUS('IN.Q') TYPE(HANDLE) APPLTAG PID` |
| Empty all messages in queue | `CLEAR QLOCAL('IN.Q')` |
| Create & start port 1414 listener | `DEFINE LISTENER('L.TCP') TRPTYPE(TCP) PORT(1414) CONTROL(QMGR) REPLACE` + `START LISTENER('L.TCP')` |
| Create remote client channel | `DEFINE CHANNEL('APP.SVRCONN') CHLTYPE(SVRCONN) TRPTYPE(TCP) REPLACE` |
| Exit `runmqsc` | `END` |

---

**Next Section — SQL Server & Database Setup:** [ODBC vs JDBC in ACE: Which Database Setup Do You Need? →](#topic-235)
