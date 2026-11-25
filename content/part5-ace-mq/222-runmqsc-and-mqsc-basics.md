---
id: topic-222
slug: runmqsc-and-mqsc-basics
topicNumber: 222
title: "runmqsc: The Interactive MQ Admin Shell"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Open runmqsc to create queues, check queue depth, start listeners, and configure channels inside an IBM MQ Queue Manager."
object: "runmqsc"
action: "Run MQSC Commands"
commandName: "runmqsc"
synonyms:
  - "runmqsc"
  - "mqsc shell"
  - "pipe runmqsc command"
  - "exit runmqsc end"
---

# runmqsc: The Interactive MQ Admin Shell

IBM MQ divides commands in two: **OS shell commands** (like `crtmqm`, `strmqm`, `dspmq`) and **MQSC commands** typed **inside `runmqsc`** (like `DEFINE QLOCAL`, `DISPLAY QSTATUS`).

---

## Mode 1: Interactive Shell

```bash
runmqsc <QueueManagerName>
```

Once inside `Starting MQSC for queue manager <QueueManagerName>.`, type MQSC commands directly, and type **`END`** to exit back to CMD/Bash:

```text
DEFINE QLOCAL('<InputQueueName>') REPLACE
DISPLAY QLOCAL('<InputQueueName>')
END
```

<details data-type="output">
<summary>Expected Output</summary>

```text
5724-H72 (C) Copyright IBM Corp. 1994, 2024.
Starting MQSC for queue manager <QueueManagerName>.

     1 : DEFINE QLOCAL('<InputQueueName>') REPLACE
AMQ8006I: IBM MQ queue created.
     2 : END
One MQSC command read.
No commands have a syntax error.
```

</details>

---

## Mode 2: Quick Script / Pipe One-Liner

Skip typing `END` manually by piping commands into `runmqsc`:

```bash
echo DISPLAY QLOCAL(*) | runmqsc <QueueManagerName>
```

> [!TIP]
> Notice **MQSC converts unquoted names to UPPERCASE automatically!** Always wrap queue names in **single quotes (`'<InputQueueName>'`)** if your queue or channel uses lowercase or dots!

---

**Next:** [MQ Object Types (QMGR, Queue, Channel, Listener) →](#topic-223)
