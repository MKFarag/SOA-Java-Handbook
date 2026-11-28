---
id: topic-246
slug: amqsbcg-browse-without-removing
topicNumber: 246
title: "amqsbcg: Peek at Messages Without Deleting"
part: 'Part 5: ACE & MQ'
sectionNumber: 44
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Inspect MQMD headers (MsgId, CorrelId, ReplyToQ) and payload bytes non-destructively using amqsbcg."
object: "MQ Sample Browser"
action: "Browse Non-Destructively"
commandName: "amqsbcg"
synonyms:
  - "amqsbcg"
  - "browse mq queue cli"
  - "inspect mqmd headers"
  - "peek mq message"
---

# amqsbcg: Peek at Messages Without Deleting

Need to check what landed on `<BackoutQueueName>` or `<OutputQueueName>` **without removing it** (and inspect full `MQMD` headers like `ReplyToQ` and `CorrelId`)? Run **`amqsbcg`**.

![IBM MQ Explorer Queues view showing depth without draining messages](/images/ace/mq-explorer-queues-depth.png)

---

## Syntax & Example

```bash
amqsbcg <OutputQueueName> <QueueManagerName>
```

<details data-type="output">
<summary>Expected Browse Output</summary>

```text
AMQSBCG0 - starts here
**********************
 MQGET of message number 1, CompCode:0 Reason:0
****Message descriptor****
  MsgId   : X'414D5120534342514D...'
  CorrelId: X'0000000000000000...'
  ReplyToQ: '                                                '
  Format  : 'MQSTR   '
****   Message      ****
 length - 32 bytes
00000000:  7B22 6F72 6465 7249 6422 3A31 3031 2C22 '{"orderId":101,"'
00000010:  7374 6174 7573 223A 2250 524F 4345 5353 'status":"PROCESS'
```

</details>

---

## 3 Sample Tools Compared

| Tool | Removes Message? | Shows `MQMD` Headers? | Remote Client Variant |
| :--- | :--- | :--- | :--- |
| **`amqsput`** | Adds new message | Uses defaults | `amqsputc` |
| **`amqsget`** | **Yes (Destructive)** | No (body only) | `amqsgetc` |
| **`amqsbcg`** | **No (Safe Browse!)** | **Yes (Full hex + ASCII)** | `amqsbcgc` |

---

**Next:** [MQ Error Logs (AMQERR01.LOG) & Troubleshooting →](#topic-247)
