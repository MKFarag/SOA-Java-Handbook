---
id: topic-181
slug: delete-a-queue
topicNumber: 181
title: "Delete a Queue"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Permanently remove a local queue definition and any remaining stored messages using MQSC DELETE QLOCAL."
object: "Queues"
action: "delete"
commandName: "DELETE QLOCAL"
synonyms:
  - "delete queue"
  - "delete qlocal"
  - "remove queue"
  - "drop queue"
  - "destroy queue"
---

Permanently removes a local queue definition from the queue manager.
Use `DELETE QLOCAL` when decommissioning unneeded queues or cleaning up test environments.

```text
DELETE QLOCAL('<QueueName>') [PURGE]
```

| Option | Behavior |
| :--- | :--- |
| *(None)* | Deletes queue only if it is completely empty (`CURDEPTH = 0`). |
| **`PURGE`** | Deletes the queue and automatically destroys any remaining messages inside. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
DELETE QLOCAL('IN.Q') PURGE
     1 : DELETE QLOCAL('IN.Q') PURGE
AMQ8007I: IBM MQ queue details.
END
```

* **DESTRUCTIVE:** Deleting a queue cannot be undone; flows trying to access it will raise `MQRC 2085 (UNKNOWN_OBJECT_NAME)`.
* **In Use Error:** If an application (e.g. ACE flow) is currently reading the queue, MQSC raises error `AMQ8009E: Object in use`.
* **Clear First:** Recommended best practice is to stop the consumer flow, clear the queue, and then delete.

* [Define a Queue](#topic-176)
* [Clear a Queue](#topic-180)
* [Display Queues](#topic-177)
