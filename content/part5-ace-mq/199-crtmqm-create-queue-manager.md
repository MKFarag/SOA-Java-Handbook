---
id: topic-199
slug: crtmqm-create-queue-manager
topicNumber: 199
title: "crtmqm: Create a Queue Manager"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create a new IBM MQ Queue Manager from the command line using crtmqm (and make it the default with -q)."
object: "Queue Manager"
action: "Create QMGR"
commandName: "crtmqm"
synonyms:
  - "crtmqm"
  - "create queue manager mq"
  - "crtmqm -q"
  - "circular vs linear logging mq"
---

# crtmqm: Create a Queue Manager

**`crtmqm`** creates a brand-new Queue Manager directory, recovery logs, and system queues (`SYSTEM.*`).

---

## Syntax & Example

```bash
# Create Queue Manager <QueueManagerName> and mark it as this PC's default (-q)
crtmqm -q <QueueManagerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
IBM MQ queue manager created.
Directory 'C:\ProgramData\IBM\MQ\qmgrs\<QueueManagerName>' created.
The queue manager is associated with installation 'Installation1'.
Creating or replacing default objects for queue manager '<QueueManagerName>'.
Default objects statistics : 84 created. 0 replaced. 0 failed.
Completing setup.
Setup completed.
```

</details>

---

## Useful Flags

| Flag | Meaning | Best For |
| :--- | :--- | :--- |
| **`-q`** | Sets this as the default QMGR (`strmqm`, `runmqsc` work without typing a name) | Single-QMGR dev laptops |
| **`-lc`** | Circular logging *(default)* — automatically reuses log files so disk stays fixed | Local dev & standard messaging |
| **`-ll`** | Linear logging — keeps archival logs for point-in-time media recovery | High-compliance production |

> [!TIP]
> Notice `crtmqm` **only creates** the Queue Manager — it starts in `Ended immediately` state until you run **`strmqm <QueueManagerName>`**!

---

**Next:** [strmqm, endmqm & dltmqm: Start, Stop & Delete →](#topic-200)
