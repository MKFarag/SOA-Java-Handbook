---
id: topic-223
slug: display-queue-and-alter-qlocal
topicNumber: 223
title: "DISPLAY QUEUE & ALTER QLOCAL: Inspect & Edit"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "List user queues, check current queue depth (CURDEPTH), enable/disable PUT/GET, and raise MAXDEPTH with ALTER QLOCAL."
object: "Queue Inspection"
action: "Inspect & Alter"
commandName: "DISPLAY QUEUE & ALTER QLOCAL"
synonyms:
  - "display qlocal"
  - "alter qlocal"
  - "curdepth maxdepth"
  - "put disabled get enabled mq"
---

# DISPLAY QUEUE & ALTER QLOCAL: Inspect & Edit

Use **`DISPLAY QLOCAL`** to list queues or read settings (including how many messages are currently sitting inside with **`CURDEPTH`**), and **`ALTER QLOCAL`** to change properties on the fly.

---

## Common Inspect & Edit Commands (Inside `runmqsc`)

```text
* List all non-system user queues cleanly (skip SYSTEM.* clutter)
DISPLAY QLOCAL(*) WHERE(NAME NS 'SYSTEM.') CURDEPTH MAXDEPTH

* Check every setting on <InputQueueName>
DISPLAY QLOCAL('<InputQueueName>') ALL

* Increase MAXDEPTH to 100,000 without losing messages
ALTER QLOCAL('<InputQueueName>') MAXDEPTH(100000)

* Temporarily block producers from putting new messages (GET still allowed!)
ALTER QLOCAL('<InputQueueName>') PUT(DISABLED)
```

<details data-type="output">
<summary>Expected Output</summary>

```text
AMQ8409I: Display Queue details.
   QUEUE(<InputQueueName>)                             TYPE(QLOCAL)
   CURDEPTH(3)                             MAXDEPTH(50000)
AMQ8409I: Display Queue details.
   QUEUE(<OutputQueueName>)                            TYPE(QLOCAL)
   CURDEPTH(0)                             MAXDEPTH(50000)
```

</details>

---

> [!TIP]
> `PUT(DISABLED)` is super handy during maintenance: callers stop putting new messages on `<InputQueueName>`, while your ACE flow finishes draining the remaining `CURDEPTH` safely! Set `PUT(ENABLED)` when done.

---

**Next:** [CLEAR QLOCAL & DELETE QLOCAL: Empty or Remove →](#topic-224)
