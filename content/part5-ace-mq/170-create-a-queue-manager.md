---
id: topic-170
slug: create-a-queue-manager
topicNumber: 170
title: "Create a Queue Manager"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Initialize and create a new IBM MQ queue manager with default logging and queue definitions using crtmqm."
object: "Queue Manager"
action: "create"
commandName: "crtmqm"
synonyms:
  - "create queue manager"
  - "crtmqm"
  - "new queue manager"
  - "make queue manager"
  - "create qmgr"
---

Initializes a new IBM MQ queue manager on the local host and creates its internal system directory structures.
Use `crtmqm` when setting up a new integration broker environment or local development message repository.

```cmd
crtmqm [-q] [-d <DeadLetterQueue>] <QueueManagerName>
```

| Flag | Parameter | Description |
| :--- | :--- | :--- |
| **`-q`** | Flag | Sets this queue manager as the system default queue manager. |
| **`-d <DLQ>`** | Queue Name | Designates the default Dead Letter Queue (e.g. `SYSTEM.DEAD.LETTER.QUEUE`). |
| **`<QMGR>`** | Positional | Name of the queue manager (up to 48 uppercase characters). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> crtmqm -q -d SYSTEM.DEAD.LETTER.QUEUE SCBQM
IBM MQ queue manager created.
Directory 'C:\ProgramData\IBM\MQ\qmgrs\SCBQM' created.
The default queue manager is 'SCBQM'.
```

* **Uppercase Naming:** Always use uppercase names (e.g. `SCBQM`) to avoid typing quotes in command consoles.
* **Created in Stopped State:** Newly created queue managers are stopped; you must explicitly run `strmqm SCBQM` to start it.
* **Administrator Privileges:** Command prompt must be running as Windows Administrator belonging to the `mqm` local group.

* [Start a Queue Manager (strmqm)](#topic-171)
* [Delete a Queue Manager (dltmqm)](#topic-173)
* [List Queue Managers and Status (dspmq)](#topic-174)
