---
id: topic-178
slug: check-queue-depth-and-status
topicNumber: 178
title: "Check Queue Depth and Status"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Inspect real-time message depth, open input handles, and open output count using DISPLAY QSTATUS."
object: "Queues"
action: "check depth"
commandName: "DISPLAY QSTATUS"
synonyms:
  - "queue depth"
  - "check queue depth"
  - "display qstatus"
  - "curdepth"
  - "open handles"
  - "unprocessed messages"
---

Inspects the live runtime status of a queue: current message count (`CURDEPTH`) and active connected applications.
Use `DISPLAY QSTATUS` to detect message backlog build-ups and verify whether an ACE flow is actively listening.

```text
DISPLAY QSTATUS('<QueueName>') [CURDEPTH IPPROCS OPPROCS]
```

| Status Field | Meaning | Ideal Value |
| :--- | :--- | :--- |
| **`CURDEPTH`** | Number of unconsumed messages currently sitting in the queue. | `0` (or small during peak traffic). |
| **`IPPROCS`** | Number of open **Input** processes (applications actively reading). | `1+` (confirms flow is listening). |
| **`OPPROCS`** | Number of open **Output** processes (applications writing). | `0+` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
DISPLAY QSTATUS('IN.Q')
     1 : DISPLAY QSTATUS('IN.Q')
AMQ8450I: Display Queue Status details.
   QUEUE(IN.Q)                             TYPE(QUEUE)
   CURDEPTH(12)                            IPPROCS(1)
   OPPROCS(0)                              LGETDATE(2026-11-24)
END
```

| Field in Output | Diagnostic Interpretation |
| :--- | :--- |
| **`CURDEPTH(12)`** | 12 messages are waiting in queue storage to be processed. |
| **`IPPROCS(1)`** | 1 consumer thread is connected (e.g. ACE MQInput node). |

* **Backlog Detection:** If `CURDEPTH` keeps climbing and `IPPROCS` is 0, the consumer flow is stopped or crashed.
* **DISPLAY QLOCAL vs QSTATUS:** `QLOCAL` shows configuration settings; `QSTATUS` shows live real-time connection state.
* **Locked Messages:** Messages locked inside uncommitted transactions still count toward `CURDEPTH`.

* [Define a Queue](#topic-176)
* [Clear a Queue](#topic-180)
* [Put a Test Message (amqsput)](#topic-184)
