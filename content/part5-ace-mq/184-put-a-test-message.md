---
id: topic-184
slug: put-a-test-message
topicNumber: 184
title: "Put a Test Message"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Send a quick text or JSON test message onto an IBM MQ queue using the built-in amqsput utility."
object: "Test Messages"
action: "put"
commandName: "amqsput"
synonyms:
  - "put message"
  - "amqsput"
  - "send test message"
  - "inject message"
  - "put to queue"
---

Sends test text or JSON messages onto a target queue directly from the command prompt using IBM MQ's `amqsput`.
Use `amqsput` to trigger an ACE message flow during manual verification without building custom client code.

```cmd
amqsput <QueueName> <QueueManagerName>
```

| Parameter | Type | Example |
| :--- | :--- | :--- |
| **`<QueueName>`** | Positional | Target queue to inject message into (e.g. `IN.Q`). |
| **`<QMGR>`** | Positional | Target queue manager (e.g. `SCBQM`). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> amqsput IN.Q SCBQM
Sample AMQSPUT0 start
target queue is IN.Q
{"id": 1, "name": "Ali", "city": "Cairo"}

Sample AMQSPUT0 end
```

| Step | Action to Take |
| :--- | :--- |
| **1. Type payload** | Type or paste JSON text: `{"id": 1, "name": "Ali", "city": "Cairo"}`. |
| **2. Send message** | Press `Enter` to submit line into queue buffer. |
| **3. Exit utility** | Press `Enter` a second time on an empty blank line to exit the utility. |

* **Press Enter Twice:** `amqsput` exits only when you press `Enter` on an empty line.
* **Persistent Message:** Messages sent by `amqsput` are marked as persistent by default and survive restarts.
* **64-bit Binary:** On Windows, the binary is located at `C:\Program Files\IBM\MQ\bin64\amqsput.exe`.

* [Get a Test Message (amqsget)](#topic-185)
* [Browse Queue Messages (amqsbcg)](#topic-186)
* [Check Queue Depth and Status](#topic-178)
