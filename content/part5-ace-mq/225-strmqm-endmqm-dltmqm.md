---
id: topic-225
slug: strmqm-endmqm-dltmqm
topicNumber: 225
title: "strmqm, endmqm & dltmqm: Start, Stop & Delete"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Start a Queue Manager with strmqm, shut it down cleanly or immediately with endmqm, and remove old QMGRs with dltmqm."
object: "QMGR Lifecycle"
action: "Start, Stop, Delete"
commandName: "strmqm endmqm dltmqm"
synonyms:
  - "strmqm"
  - "endmqm"
  - "dltmqm"
  - "stop queue manager immediate"
---

# strmqm, endmqm & dltmqm: Start, Stop & Delete

Manage the full lifecycle of an IBM MQ Queue Manager from your OS shell (`CMD` or `Bash`, not inside `runmqsc`).

---

## Start, Stop & Delete Commands

```bash
# 1. Start Queue Manager <QueueManagerName>
strmqm <QueueManagerName>

# 2. Controlled stop (waits for active apps to disconnect)
endmqm <QueueManagerName>

# 3. Wait until stop completes (-w) OR immediate stop (-i) if an app stays connected
endmqm -w -i <QueueManagerName>

# 4. Permanently delete a STOPPED Queue Manager (and all its queues/messages!)
dltmqm <QueueManagerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
IBM MQ queue manager '<QueueManagerName>' starting.
IBM MQ queue manager '<QueueManagerName>' started using V9.4.0.0.
```

</details>

---

> [!WARNING]
> Running `endmqm <QueueManagerName>` without `-i` can hang for minutes if **ACE** still holds an open connection! Always run **`mqsistop <Node>` first**, then **`endmqm -w <QueueManagerName>`** (or `endmqm -i <QueueManagerName>` in dev).

---

**Next:** [dspmq & dspmqver: Check Queue Managers & Version →](#topic-226)
