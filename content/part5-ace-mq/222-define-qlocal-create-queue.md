---
id: topic-222
slug: define-qlocal-create-queue
topicNumber: 222
title: "DEFINE QLOCAL: Create a Local Queue"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create durable local queues (like IN.Q and OUT.Q) in IBM MQ using runmqsc DEFINE QLOCAL or MQ Explorer."
object: "Local Queue"
action: "Create Queue"
commandName: "DEFINE QLOCAL"
synonyms:
  - "define qlocal"
  - "create local queue mq"
  - "mq explorer create queue"
  - "defpsist bothresh"
---

# DEFINE QLOCAL: Create a Local Queue

Every queue your ACE `MQInput` or `MQOutput` node names **must exist on the Queue Manager** first. You can create queues either in **MQ Explorer** or with one command in **`runmqsc`**.

![IBM MQ Explorer wizard creating a New Local Queue](/images/ace/mq-explorer-create-local-queue.png)

---

## Create Queues via CLI (`runmqsc`)

```bash
runmqsc SCBQM
```

Inside `runmqsc`:

```text
DEFINE QLOCAL('IN.Q')  DESCR('Orders inbound queue')  DEFPSIST(YES) MAXDEPTH(50000) REPLACE
DEFINE QLOCAL('OUT.Q') DESCR('Orders outbound queue') DEFPSIST(YES) MAXDEPTH(50000) REPLACE
END
```

<details data-type="output">
<summary>Expected Output</summary>

```text
AMQ8006I: IBM MQ queue created.
AMQ8006I: IBM MQ queue created.
```

</details>

---

## Key Queue Options Explained

| Attribute | Recommended Setting | Why |
| :--- | :--- | :--- |
| **`DEFPSIST(YES)`** | Persistent by default | Messages survive an MQ restart if sender uses default persistence |
| **`MAXDEPTH(50000)`** | Max queued messages (default `5000`) | Prevents fast producers filling a small `5000` dev queue (`MQRC 2053`) |
| **`REPLACE`** | Updates properties safely if already exists | Makes scripts idempotent (`run` cleanly twice!) |

> [!TIP]
> Queue names are **case-sensitive**: `'IN.Q'` and `'in.q'` are completely different queues in IBM MQ! Stick to uppercase letters and dots (`APP.IN.Q`) cleanly across MQ and ACE.

---

**Next:** [DISPLAY QUEUE & ALTER QLOCAL: Inspect & Edit →](#topic-223)
