---
id: topic-171
slug: start-a-queue-manager
topicNumber: 171
title: "Start a Queue Manager"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Start an IBM MQ queue manager process and initialize memory buffers and queue storage using strmqm."
object: "Queue Manager"
action: "start"
commandName: "strmqm"
synonyms:
  - "start queue manager"
  - "strmqm"
  - "start qmgr"
  - "run queue manager"
  - "up queue manager"
---

Starts a local IBM MQ queue manager process and initializes its logging, memory buffers, and disk queues.
Use `strmqm` during host startup before starting any integration nodes or running MQSC scripts.

```cmd
strmqm <QueueManagerName>
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **`<QMGR>`** | Positional | The exact name of the queue manager to start (e.g. `SCBQM`). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> strmqm SCBQM
IBM MQ queue manager 'SCBQM' starting.
The queue manager is associated with installation 'Installation1'.
5 log records accessed on queue manager 'SCBQM' during the log replay phase.
Log replay for queue manager 'SCBQM' complete.
Transaction manager state recovered for queue manager 'SCBQM'.
IBM MQ queue manager 'SCBQM' started using V9.4.0.0.
```

| Output Line | Meaning |
| :--- | :--- |
| **`Log replay ... complete`** | Recovery logs successfully read from disk; uncommitted transactions rolled back. |
| **`queue manager 'SCBQM' started`** | Queue manager is active, accepts connections on shared memory, and ready for work. |

* **Already Running:** If already started, the command outputs `AMQ7018E: The queue manager is already running`.
* **Sequence Rule:** Always start the queue manager **before** starting integration nodes that depend on it.
* **Check Status:** Run `dspmq` to confirm running status across all installed queue managers.

* [Stop a Queue Manager (endmqm)](#topic-172)
* [List Queue Managers and Status (dspmq)](#topic-174)
* [Start an Integration Node (mqsistart)](#topic-192)
