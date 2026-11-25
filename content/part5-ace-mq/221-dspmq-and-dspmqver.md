---
id: topic-221
slug: dspmq-and-dspmqver
topicNumber: 221
title: "dspmq & dspmqver: Check Queue Managers & Version"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Check which Queue Managers exist and whether they are Running or Ended using dspmq, and check installed MQ version with dspmqver."
object: "MQ Status"
action: "Check Status"
commandName: "dspmq & dspmqver"
synonyms:
  - "dspmq"
  - "dspmqver"
  - "check queue manager status"
  - "mq version command"
---

# dspmq & dspmqver: Check Queue Managers & Version

Whenever you open a terminal to check if MQ is alive, start with **`dspmq`**.

---

## Commands & Sample Output

```bash
# List every Queue Manager and its live status
dspmq

# Check installed IBM MQ version and OS platform
dspmqver
```

<details data-type="output">
<summary>Expected Output</summary>

```text
QMNAME(SCBQM)                                             STATUS(Running)
QMNAME(TESTQM)                                            STATUS(Ended normally)

Name:        IBM MQ
Version:     9.4.0.0
Level:       p940-L240606
Platform:    IBM MQ for Windows (x64 platform)
```

</details>

---

## Status Values to Know

| Status | Meaning | Action |
| :--- | :--- | :--- |
| **`Running`** | Healthy and ready for `runmqsc` & ACE | Proceed normally |
| **`Ended normally`** / **`Ended immediately`** | Stopped | Run `strmqm SCBQM` |
| **`Ending immediately`** / **`Quiescing`** | Shutting down right now | Wait 5 seconds and run `dspmq` again |

---

**Next:** [DEFINE QLOCAL: Create a Local Queue →](#topic-222)
