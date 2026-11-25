---
id: topic-229
slug: clear-and-delete-qlocal
topicNumber: 229
title: "CLEAR QLOCAL & DELETE QLOCAL: Empty or Remove"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Empty stuck test messages from a queue with CLEAR QLOCAL, or permanently remove an obsolete queue with DELETE QLOCAL."
object: "Queue Cleanup"
action: "Empty or Delete"
commandName: "CLEAR QLOCAL & DELETE QLOCAL"
synonyms:
  - "clear qlocal"
  - "delete qlocal"
  - "queue in use amq8148"
  - "purge mq queue"
---

# CLEAR QLOCAL & DELETE QLOCAL: Empty or Remove

Need to wipe 500 bad test messages out of `<InputQueueName>` during dev? Use **`CLEAR QLOCAL`** inside `runmqsc`. Want to remove the queue definition altogether? Use **`DELETE QLOCAL`**.

---

## Commands (Inside `runmqsc <QueueManagerName>`)

```text
* Empty all messages inside <InputQueueName> (queue definition stays!)
CLEAR QLOCAL('<InputQueueName>')

* Permanently remove queue <QueueName> (must be empty first!)
DELETE QLOCAL('<QueueName>')

* Delete queue EVEN if messages still sit inside (USE CAREFULLY!)
DELETE QLOCAL('<QueueName>') PURGE
```

<details data-type="output">
<summary>Expected Output</summary>

```text
AMQ8022I: IBM MQ queue cleared.
```

</details>

---

> [!WARNING]
> Getting **`AMQ8148S: IBM MQ object in use`** when running `CLEAR QLOCAL('<InputQueueName>')`? That means an active app (usually your **ACE `MQInput` flow!**) has the queue open for reading (`IPPROCS > 0`). Stop the flow first (`mqsistopmsgflow ...`) or read messages cleanly with `amqsget`, then clear!

---

**Next:** [DISPLAY QSTATUS: Who Is Connected & Queue Depth →](#topic-230)
