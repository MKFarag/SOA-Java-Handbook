---
id: topic-176
slug: define-a-queue
topicNumber: 176
title: "Define a Queue"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create a local message storage queue inside an IBM MQ queue manager using MQSC DEFINE QLOCAL."
object: "Queues"
action: "define"
commandName: "DEFINE QLOCAL"
synonyms:
  - "define queue"
  - "define qlocal"
  - "create queue"
  - "new queue"
  - "make queue"
  - "mqsc queue"
---

Creates a local physical storage queue (`QLOCAL`) inside the connected queue manager.
Use `DEFINE QLOCAL` to create input, output, or error queues for your ACE message flows.

```text
DEFINE QLOCAL('<QueueName>') [MAXDEPTH(<MaxMsgs>)] [REPLACE]
```

| Property | Default Value | Description |
| :--- | :--- | :--- |
| **`<QueueName>`** | Required | Target queue identifier (up to 48 uppercase characters). |
| **`MAXDEPTH`** | `5000` | Maximum number of unread messages permitted in the queue. |
| **`REPLACE`** | None | Replaces an existing queue definition with this configuration. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
DEFINE QLOCAL('IN.Q') REPLACE
     1 : DEFINE QLOCAL('IN.Q') REPLACE
AMQ8006I: IBM MQ queue created.
END
```

* **Uppercase Standard:** Always create queues using uppercase letters (e.g. `'IN.Q'`); lowercase queues require quotes in every command.
* **REPLACE Option:** Use `REPLACE` during development to update parameters without manually deleting the queue first.
* **Persistence Default:** Local queues store persistent messages safely on disk across queue manager restarts.

* [Display Queues](#topic-177)
* [Check Queue Depth and Status](#topic-178)
* [Delete a Queue](#topic-181)
