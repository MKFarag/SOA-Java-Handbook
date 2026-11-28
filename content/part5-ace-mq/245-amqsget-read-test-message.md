---
id: topic-245
slug: amqsget-read-test-message
topicNumber: 245
title: "amqsget: Read Messages & Empty a Queue"
part: 'Part 5: ACE & MQ'
sectionNumber: 44
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Read and remove messages from an output queue cleanly using IBM's amqsget CLI tool."
object: "MQ Sample Consumer"
action: "Get Message"
commandName: "amqsget"
synonyms:
  - "amqsget"
  - "amqsgetc"
  - "read message from queue cli"
  - "destructive get mq"
---

# amqsget: Read Messages & Empty a Queue

**`amqsget`** pulls every message off a queue, prints it to your screen, and **removes it permanently** (destructive GET).

---

## Syntax & Example

```bash
amqsget <OutputQueueName> <QueueManagerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
Sample AMQSGET0 start
message <{"orderId":101,"status":"PROCESSED"}>
no more messages
Sample AMQSGET0 end
```

</details>

---

> [!WARNING]
> Notice **`amqsget` DESTROYS/CONSUMES the message** from the queue! If you only want to **peek** at a queue without removing messages, use **[amqsbcg](#topic-246)** instead. Also expect a brief ~15-second wait after the last message before it prints `no more messages` and exits.

---

**Next:** [amqsbcg: Peek at Messages Without Deleting →](#topic-246)
