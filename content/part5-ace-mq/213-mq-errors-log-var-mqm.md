---
id: topic-213
slug: mq-errors-log-var-mqm
topicNumber: 213
title: "MQ Error Logs (AMQERR01.LOG) & Troubleshooting"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Find AMQERR01.LOG on Windows or Linux to diagnose MQ startup failures, 2035 permission errors, and channel drops fast."
object: "MQ Error Logs"
action: "Inspect Logs"
commandName: "AMQERR01.LOG & mqrc"
synonyms:
  - "amqerr01.log"
  - "var mqm qmgrs errors"
  - "mq error log location"
  - "mqrc lookup"
---

# MQ Error Logs (AMQERR01.LOG) & Troubleshooting

Whenever IBM MQ throws an unclear failure (`2035`, channel won't start, Queue Manager fails to boot), open **`AMQERR01.LOG`** — always read the **bottom** (newest messages first!).

---

## Where to Find `AMQERR01.LOG`

| OS | Queue Manager Error Log | System-Wide Error Log |
| :--- | :--- | :--- |
| **Windows** | `C:\ProgramData\IBM\MQ\qmgrs\<QMGR>\errors\AMQERR01.LOG` | `C:\ProgramData\IBM\MQ\errors\AMQERR01.LOG` |
| **Linux / Container** | `/var/mqm/qmgrs/<QMGR>/errors/AMQERR01.LOG` | `/var/mqm/errors/AMQERR01.LOG` |

*(IBM MQ rotates logs cleanly: `AMQERR01.LOG` is active, `02` and `03` are older rollovers.)*

---

## Quick Tail on Linux / PowerShell

```bash
# Linux: watch the last 30 lines live
tail -n 30 /var/mqm/qmgrs/<QueueManagerName>/errors/AMQERR01.LOG

# Lookup ANY AMQ or 4-digit MQRC error code meaning
mqrc 2059
```

<details data-type="output">
<summary>Sample Log Entry Inside AMQERR01.LOG</summary>

```text
----- amqzfema.c : 1492 -------------------------------------------------------
AMQ9777E: Channel was blocked
EXPLANATION: The inbound connection to channel '<ChannelName>' from host '<ClientIpAddress>' was blocked by CHLAUTH rule...
```

</details>

---

**Next:** [IBM MQ Commands Cheat Sheet →](#topic-214)
