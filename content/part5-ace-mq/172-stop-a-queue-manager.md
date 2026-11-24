---
id: topic-172
slug: stop-a-queue-manager
topicNumber: 172
title: "Stop a Queue Manager"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Stop an IBM MQ queue manager safely with controlled shutdown or immediate termination using endmqm."
object: "Queue Manager"
action: "stop"
commandName: "endmqm"
synonyms:
  - "stop queue manager"
  - "endmqm"
  - "stop qmgr"
  - "shutdown queue manager"
  - "kill queue manager"
---

Shuts down a running IBM MQ queue manager process and flushes data to recovery logs.
Use `endmqm` during host maintenance, before deleting a queue manager, or prior to backup operations.

```cmd
endmqm [-c | -w | -i | -p] <QueueManagerName>
```

| Flag | Mode | Behavior |
| :--- | :--- | :--- |
| **`-c`** (Default) | Controlled | Waits for all connected applications to disconnect gracefully before shutting down. |
| **`-i`** | **Immediate** | **Standard.** Disconnects active apps immediately, rolls back in-flight transactions, and halts. |
| **`-w`** | Wait | Pauses command shell until the queue manager has completely terminated. |
| **`-p`** | Preempt | Emergency force-kill of queue manager processes (use only if `-i` hangs). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> endmqm -i SCBQM
IBM MQ queue manager 'SCBQM' ending.
IBM MQ queue manager 'SCBQM' ended.
```

* **Controlled vs Immediate:** Standard maintenance should use `endmqm -i SCBQM`; default controlled mode can hang waiting for idle client apps.
* **Impact on Integration Nodes:** Stopping a queue manager linked to an integration node causes connected flows to log `BIP8018E`.
* **Confirm Stop:** Always verify termination with `dspmq` before rebooting the server.

* [Start a Queue Manager (strmqm)](#topic-171)
* [List Queue Managers and Status (dspmq)](#topic-174)
* [Delete a Queue Manager (dltmqm)](#topic-173)
