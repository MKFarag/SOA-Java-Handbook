---
id: topic-174
slug: list-queue-managers-and-status
topicNumber: 174
title: "List Queue Managers and Status"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Display all installed IBM MQ queue managers on the host and their current running state using dspmq."
object: "Queue Manager"
action: "list"
commandName: "dspmq"
synonyms:
  - "list queue managers"
  - "dspmq"
  - "check queue manager status"
  - "show queue managers"
  - "qmgr status"
---

Lists all IBM MQ queue managers installed on the current host along with their operational running status.
Use `dspmq` as your first diagnostic command to verify if a queue manager is running, ending, or stopped.

```cmd
dspmq [-m <QueueManagerName>]
```

| Status Value | Meaning | Action Needed |
| :--- | :--- | :--- |
| **`Running`** | Queue manager is active and accepting connections. | None. Healthy state. |
| **`Ended immediately`** | Stopped cleanly via `endmqm -i`. | Start with `strmqm` when needed. |
| **`Ended unexpectedly`** | Process crashed or killed abruptly. | Inspect error logs and start with `strmqm`. |
| **`Starting`** | Currently in log replay phase. | Wait a few seconds for initialization. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> dspmq
QMNAME(SCBQM)                                             STATUS(Running)
QMNAME(SCB_BACKUP)                                        STATUS(Ended immediately)
```

* **Fast and Safe:** `dspmq` is a read-only command that can be safely run at any time in production.
* **Filter by Name:** To check only one queue manager, pass the filter: `dspmq -m SCBQM`.
* **Default Indicator:** Queue managers marked with `DEFAULT` are the machine's primary queue manager.

* [Start a Queue Manager (strmqm)](#topic-171)
* [Stop a Queue Manager (endmqm)](#topic-172)
* [Show MQ Version (dspmqver)](#topic-175)
