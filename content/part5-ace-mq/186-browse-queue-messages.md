---
id: topic-186
slug: browse-queue-messages
topicNumber: 186
title: "Browse Queue Messages"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Inspect message headers and body non-destructively without removing messages using amqsbcg."
object: "Test Messages"
action: "browse"
commandName: "amqsbcg"
synonyms:
  - "browse messages"
  - "amqsbcg"
  - "read without delete"
  - "peek queue"
  - "inspect mqmd"
---

Non-destructively browses messages in a queue, printing full MQMD header descriptors and hexadecimal payload bodies.
Use `amqsbcg` to inspect message content and MsgId headers without consuming or modifying the queue.

```cmd
amqsbcg <QueueName> <QueueManagerName>
```

| Parameter | Type | Example |
| :--- | :--- | :--- |
| **`<QueueName>`** | Positional | Queue to browse (e.g. `IN.Q`). |
| **`<QMGR>`** | Positional | Target queue manager (e.g. `SCBQM`). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> amqsbcg IN.Q SCBQM
AMQSBCG0 - starts here
 MQMD.MsgId: X'414D5120534342514D2020202020202010A2E46602350020'
 MQMD.Format: 'MQSTR   '
 Message characters :
 {"id": 1, "name": "Ali", "city": "Cairo"}
```

* **Preserves Messages:** The message remains intact inside the queue at its current position; `CURDEPTH` is unaffected.
* **Header Inspection:** Displays internal MQMD fields including `Format`, `CorrelId`, `Expiry`, and `CodedCharSetId`.
* **Standard Sample Program:** Ships with IBM MQ Server and Client installations in the `bin` directory.

* [Put a Test Message (amqsput)](#topic-184)
* [Get a Test Message (amqsget)](#topic-185)
* [Check Queue Depth and Status](#topic-178)
