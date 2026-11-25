---
id: topic-220
slug: strmqm-endmqm-dltmqm
topicNumber: 220
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
# 1. Start Queue Manager SCBQM
strmqm SCBQM

# 2. Controlled stop (waits for active apps to disconnect)
endmqm SCBQM

# 3. Wait until stop completes (-w) OR immediate stop (-i) if an app stays connected
endmqm -w -i SCBQM

# 4. Permanently delete a STOPPED Queue Manager (and all its queues/messages!)
dltmqm SCBQM
```

<details data-type="output">
<summary>Expected Output</summary>

```text
IBM MQ queue manager 'SCBQM' starting.
IBM MQ queue manager 'SCBQM' started using V9.4.0.0.
```

</details>

---

> [!WARNING]
> Running `endmqm SCBQM` without `-i` can hang for minutes if **ACE** still holds an open connection! Always run **`mqsistop <Node>` first**, then **`endmqm -w SCBQM`** (or `endmqm -i SCBQM` in dev).

---

**Next:** [dspmq & dspmqver: Check Queue Managers & Version →](#topic-221)
