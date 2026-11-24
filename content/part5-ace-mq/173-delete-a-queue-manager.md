---
id: topic-173
slug: delete-a-queue-manager
topicNumber: 173
title: "Delete a Queue Manager"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Permanently remove an IBM MQ queue manager and delete its configuration, queues, and disk logs using dltmqm."
object: "Queue Manager"
action: "delete"
commandName: "dltmqm"
synonyms:
  - "delete queue manager"
  - "dltmqm"
  - "remove queue manager"
  - "drop queue manager"
  - "destroy queue manager"
---

Permanently deletes a stopped queue manager, erasing all message data, queue definitions, and log files.
Use `dltmqm` when decommissioning a test environment or recreating a corrupted queue manager from scratch.

```cmd
dltmqm <QueueManagerName>
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **`<QMGR>`** | Positional | Name of the queue manager to delete (e.g. `SCBQM`). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> dltmqm SCBQM
IBM MQ queue manager 'SCBQM' deleted.
```

* **DESTRUCTIVE:** This command permanently destroys all message data on all queues; it cannot be undone.
* **Must Be Stopped First:** Attempting to delete a running queue manager raises error `AMQ7017E: Queue manager not available for deletion`.
* **Clean Up Nodes:** If an integration node is associated with this queue manager, delete or reconfigure the node first.

* [Stop a Queue Manager (endmqm)](#topic-172)
* [Create a Queue Manager (crtmqm)](#topic-170)
* [List Queue Managers and Status (dspmq)](#topic-174)
