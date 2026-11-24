---
id: topic-179
slug: alter-a-queue
topicNumber: 179
title: "Alter a Queue"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Modify properties of an existing local queue without deleting messages using MQSC ALTER QLOCAL."
object: "Queues"
action: "alter"
commandName: "ALTER QLOCAL"
synonyms:
  - "alter queue"
  - "alter qlocal"
  - "change queue"
  - "increase queue depth"
  - "inhibit get put"
---

Modifies the settings of an existing local queue (e.g. increasing capacity or temporarily pausing message ingestion).
Use `ALTER QLOCAL` to increase `MAXDEPTH` or inhibit message gets/puts during maintenance without losing messages.

```text
ALTER QLOCAL('<QueueName>') [MAXDEPTH(<NewDepth>)] [GET(ENABLED | DISABLED)]
```

| Parameter | Allowed Values | Purpose |
| :--- | :--- | :--- |
| **`MAXDEPTH`** | Number (e.g. `50000`) | Increases maximum allowed message capacity. |
| **`GET`** | `ENABLED`, `DISABLED` | Enables or temporarily pauses consumer message consumption. |
| **`PUT`** | `ENABLED`, `DISABLED` | Enables or temporarily rejects new incoming messages. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
ALTER QLOCAL('IN.Q') MAXDEPTH(100000) GET(ENABLED)
     1 : ALTER QLOCAL('IN.Q') MAXDEPTH(100000) GET(ENABLED)
AMQ8007I: IBM MQ queue details.
END
```

* **Safe In-Place Edit:** `ALTER QLOCAL` preserves all existing messages currently stored inside the queue.
* **Immediate Effect:** Changes take effect immediately without needing to restart the queue manager.
* **Inhibit Ingestion:** Setting `PUT(DISABLED)` allows flows to drain remaining messages while preventing new arrivals.

* [Define a Queue](#topic-176)
* [Display Queues](#topic-177)
* [Check Queue Depth and Status](#topic-178)
