---
id: topic-173
slug: common-mq-connection-errors
topicNumber: 173
title: "Common MQ Connection Errors (2059, 2058, 2085, 2035)"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Messaging'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Decode and fix the 5 most frequent IBM MQ connection errors when wiring ACE to queues."
object: "MQRC Error Codes"
action: "Troubleshoot Connection"
commandName: "MQRC 2059 2058 2085 2035"
synonyms:
  - "mqrc 2059"
  - "mqrc 2058"
  - "mqrc 2085"
  - "mqrc 2035"
  - "mqrc 2538"
  - "bip8018e"
---
# Common MQ Connection Errors (2059, 2058, 2085, 2035)

Whenever ACE cannot talk to IBM MQ, MQ hands back a 4-digit **`MQRC` (Reason Code)**. Here are the 5 you will see 99% of the time — and the exact fix for each.

---

## Quick Fix Lookup Table

| Code | Official Name | Plain-English Cause | Exact Fix |
| :--- | :--- | :--- | :--- |
| **`2059`** | `MQRC_Q_MGR_NOT_AVAILABLE` | Queue Manager is **stopped**, or wrong host/port in `CLIENT` mode | Start QMGR (`strmqm SCBQM`) or verify Listener port `1414` is running |
| **`2058`** | `MQRC_Q_MGR_NAME_ERROR` | Typo in Queue Manager name (`SCBQM` vs `scbqm`) or Node isn't linked | Check exact case via `dspmq`; verify `MQEndpoint` / `-q` spelling |
| **`2085`** | `MQRC_UNKNOWN_OBJECT_NAME` | Queue doesn't exist on that Queue Manager | Run `runmqsc SCBQM` -> `DISPLAY QLOCAL(*)` and `DEFINE QLOCAL('IN.Q')` |
| **`2035`** | `MQRC_NOT_AUTHORIZED` | MQ Channel Auth (`CHLAUTH`) or OAM permissions blocked your user | Check `AMQERR01.LOG` for blocked user/rule; update `CHLAUTH` or `CONNAUTH` for dev |
| **`2538`** | `MQRC_HOST_NOT_AVAILABLE` | Firewall blocked port `1414`, wrong IP, or MQ Listener stopped | Start listener in `runmqsc`: `START LISTENER(LISTENER.TCP)` |

---

## Still Stuck? Check `mqrc` Right in Terminal!

IBM MQ includes a tiny translator command for **any** 4-digit code:

```bash
mqrc 2035
```

<details data-type="output">
<summary>Expected Output</summary>

```text
      2035  0x000007f3  MQRC_NOT_AUTHORIZED
```

</details>

> [!TIP]
> If you get **`BIP8018E`** during `mqsistart`, it means the Integration Node's linked Queue Manager does not exist or cannot start locally — check `dspmq` first!

---

**Next Section — ESQL Reference:** [ESQL Basics: Modules & Main() →](#topic-174)
