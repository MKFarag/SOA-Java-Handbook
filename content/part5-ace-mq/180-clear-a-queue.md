---
id: topic-180
slug: clear-a-queue
topicNumber: 180
title: "Clear a Queue"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Empty all unconsumed messages from a local queue immediately using MQSC CLEAR QLOCAL."
object: "Queues"
action: "clear"
commandName: "CLEAR QLOCAL"
synonyms:
  - "clear queue"
  - "clear qlocal"
  - "empty queue"
  - "purge queue"
  - "drain queue"
---

Purges all messages from a local queue immediately, resetting its `CURDEPTH` back to zero.
Use `CLEAR QLOCAL` in testing environments to purge stale messages between test runs.

```text
CLEAR QLOCAL('<QueueName>')
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **`<QueueName>`** | Positional | The local queue to empty (e.g. `IN.Q`). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
CLEAR QLOCAL('IN.Q')
     1 : CLEAR QLOCAL('IN.Q')
AMQ8022I: IBM MQ queue cleared.
END
```

* **DESTRUCTIVE:** Deletes all messages in the queue immediately; purged messages cannot be recovered.
* **Open Handle Constraint:** You cannot clear a queue if another application currently holds an exclusive open handle to it.
* **Safe Architecture:** Keeps the queue definition intact while emptying its contents.

* [Check Queue Depth and Status](#topic-178)
* [Delete a Queue](#topic-181)
* [Define a Queue](#topic-176)
