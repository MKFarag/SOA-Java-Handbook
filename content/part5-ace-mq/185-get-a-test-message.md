---
id: topic-185
slug: get-a-test-message
topicNumber: 185
title: "Get a Test Message"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Read and remove a message destructively from an IBM MQ queue using the built-in amqsget utility."
object: "Test Messages"
action: "get"
commandName: "amqsget"
synonyms:
  - "get message"
  - "amqsget"
  - "read test message"
  - "consume message"
  - "drain test message"
---

Destructively consumes and prints messages from an IBM MQ queue to the console using `amqsget`.
Use `amqsget` to inspect output queue results emitted by an ACE message flow.

```cmd
amqsget <QueueName> <QueueManagerName>
```

| Parameter | Type | Example |
| :--- | :--- | :--- |
| **`<QueueName>`** | Positional | The queue to consume from (e.g. `OUT.Q`). |
| **`<QMGR>`** | Positional | Target queue manager (e.g. `SCBQM`). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> amqsget OUT.Q SCBQM
Sample AMQSGET0 start
message <{"id": 1, "city": "Cairo", "topItemCode": "A1"}>
no more messages
Sample AMQSGET0 end
```

* **Destructive Read:** `amqsget` removes the message from the queue; it will no longer be available for other consumers.
* **15-Second Timeout:** `amqsget` waits up to 15 seconds for a message before printing `no more messages` and exiting.
* **Non-Destructive Alternative:** To view messages without deleting them from the queue, use `amqsbcg`.

* [Put a Test Message (amqsput)](#topic-184)
* [Browse Queue Messages (amqsbcg)](#topic-186)
* [Check Queue Depth and Status](#topic-178)
