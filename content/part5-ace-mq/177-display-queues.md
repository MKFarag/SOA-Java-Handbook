---
id: topic-177
slug: display-queues
topicNumber: 177
title: "Display Queues"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "List local queues and inspect their configured properties using MQSC DISPLAY QLOCAL."
object: "Queues"
action: "display"
commandName: "DISPLAY QLOCAL"
synonyms:
  - "display queues"
  - "display qlocal"
  - "list queues"
  - "show queues"
  - "find queue"
---

Lists defined queues matching a filter name and shows their configured properties.
Use `DISPLAY QLOCAL` to confirm a queue exists and verify its maximum depth or persistence settings.

```text
DISPLAY QLOCAL('<Filter>') [ALL | MAXDEPTH CURDEPTH]
```

| Parameter / Option | Example | Description |
| :--- | :--- | :--- |
| **`<Filter>`** | `IN.*` | Wildcard name pattern matching queues. |
| **`CURDEPTH`** | `CURDEPTH` | Displays current count of unconsumed messages in the queue. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
DISPLAY QLOCAL('IN.Q') CURDEPTH MAXDEPTH
     1 : DISPLAY QLOCAL('IN.Q') CURDEPTH MAXDEPTH
AMQ8007I: IBM MQ queue details.
   QUEUE(IN.Q)                             TYPE(QLOCAL)
   CURDEPTH(0)                             MAXDEPTH(50000)
END
```

* **Wildcards:** Use `DISPLAY QLOCAL(*)` to see all queues, or `DISPLAY QLOCAL(SCB.*)` to list project-specific queues.
* **System Queues:** Default installations include internal queues starting with `SYSTEM.*`.
* **Zero Output:** If the queue does not exist, MQSC returns error `AMQ8147E: IBM MQ object not found`.

* [Define a Queue](#topic-176)
* [Check Queue Depth and Status](#topic-178)
* [Clear a Queue](#topic-180)
