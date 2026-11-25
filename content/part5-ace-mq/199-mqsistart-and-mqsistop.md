---
id: topic-199
slug: mqsistart-and-mqsistop
topicNumber: 199
title: "mqsistart & mqsistop (Integration Nodes)"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Start and cleanly stop an Integration Node (and discover why -i force stop is only for emergencies)."
object: "Integration Node"
action: "Start & Stop"
commandName: "mqsistart mqsistop"
synonyms:
  - "mqsistart"
  - "mqsistop"
  - "mqsistop -i immediate"
  - "start stop integration node"
---

# mqsistart & mqsistop (Integration Nodes)

Use **`mqsistart`** and **`mqsistop`** to bring an entire Integration Node (and all its configured Integration Servers) online or offline.

---

## Syntax & Example

```bash
# Start node SCB (also starts linked QMGR if needed)
mqsistart SCB

# Stop gracefully (waits for active flows to finish)
mqsistop SCB

# Emergency force stop (ONLY if normal stop hangs!)
mqsistop SCB -i
```

<details data-type="output">
<summary>Expected Start Output</summary>

```text
BIP8096I: Successful command initiation, check the system log to ensure that the component started without problem and that it continues to run without problem.
```

</details>

---

## Good to Know

| Flag / Behavior | What Happens |
| :--- | :--- |
| Normal **`mqsistop SCB`** | Lets in-flight messages commit cleanly before shutting down servers |
| Immediate **`mqsistop SCB -i`** | Kills server processes immediately without waiting — use only if a flow is deadlocked |
| **Toolkit shortcut** | You can also right-click your Node in **Integration Explorer -> Start / Stop** |

---

**Next:** [Read Node & Flow Properties (mqsireportproperties) →](#topic-200)
