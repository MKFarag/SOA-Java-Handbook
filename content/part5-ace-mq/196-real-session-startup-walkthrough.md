---
id: topic-196
slug: real-session-startup-walkthrough
topicNumber: 196
title: "Real Session Startup Walkthrough (MQ + ACE)"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Copy-paste startup sequence from zero to running Queue Manager SCBQM, Integration Node SCB, server EG1, and queue test."
object: "Startup Sequence"
action: "Start Full Stack"
commandName: "strmqm & mqsistart"
synonyms:
  - "start ace and mq from scratch"
  - "real session startup walkthrough"
  - "scb scbqm eg1"
  - "startup sequence mq ace"
---

# Real Session Startup Walkthrough (MQ + ACE)

Opening your laptop after a reboot? Here is the exact **order of commands** to verify IBM MQ and ACE are healthy and start your Integration Node.

---

## Always Start in This Order: **MQ First -> ACE Second**

```bash
# 1. Check existing Queue Managers
dspmq

# 2. Start your Queue Manager (e.g., SCBQM)
strmqm SCBQM

# 3. Check ACE Integration Nodes
mqsilist

# 4. Start your Integration Node (starts managed servers inside it too!)
mqsistart SCB

# 5. Confirm everything reports 'running'
mqsilist SCB
```

<details data-type="output">
<summary>Expected Clean Startup Output</summary>

```text
QMNAME(SCBQM)                                             STATUS(Running)
BIP8096I: Successful command initiation, check the system log to ensure that the component started without problem and that it continues to run without problem.
BIP1284I: Integration server 'EG1' on integration node 'SCB' is running.
BIP8071I: Successful command completion.
```

</details>

---

## Quick Verification After Starting

1. Run `mqsilist SCB` -> look for `is running`.
2. Open ACE Toolkit -> **Integration Explorer** -> right-click **Integration Nodes** -> **Refresh**.
3. Drop a test message with `amqsput IN.Q SCBQM` or **Flow Exerciser**.

> [!TIP]
> Shutting down at the end of the day? Reverse the order: **`mqsistop SCB` first**, then **`endmqm SCBQM`** so ACE finishes inflight queue transactions cleanly!

---

**Next:** [mqsilist: Inspect Nodes, Servers & Flows →](#topic-197)
