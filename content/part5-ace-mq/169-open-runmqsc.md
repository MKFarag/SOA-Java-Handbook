---
id: topic-169
slug: open-runmqsc
topicNumber: 169
title: "Open runmqsc"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Launch the interactive IBM MQ Script Command (MQSC) console to manage queues, channels, and listeners."
object: "MQSC Console"
action: "Open Console"
commandName: "runmqsc"
synonyms:
  - "runmqsc"
  - "open runmqsc"
  - "mqsc console"
  - "mqsc commands"
  - "interactive mq"
---

Launches the interactive MQSC command-line shell connected to a specific queue manager.
Use `runmqsc` to create, inspect, modify, or delete queues, channels, and listeners.

```cmd
runmqsc <QueueManagerName>
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **`<QMGR>`** | Positional | The exact name of the running queue manager to administer (e.g. `SCBQM`). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
5724-H72 (C) Copyright IBM Corp. 1994, 2024.
Starting MQSC for queue manager SCBQM.

END
```

| Line | Meaning |
| :--- | :--- |
| **`Starting MQSC for queue manager SCBQM`** | Terminal shell is now active and executing commands against `SCBQM`. |
| **`END`** | Type `END` (or press `Ctrl + C`) to exit the MQSC shell back to Windows cmd. |

* **Running QMGR Required:** The target queue manager must be active; running `runmqsc` on a stopped QMGR raises error `AMQ8146E`.
* **Case-Insensitive Input:** MQSC keywords and standard names are uppercase by default unless wrapped in single quotes.
* **Exit Command:** Always type `END` to exit cleanly; pressing `Ctrl+Z` on Windows can leave hung lock files.

* [Start a Queue Manager (strmqm)](#topic-171)
* [Define a Queue](#topic-176)
* [Display Queues](#topic-177)
