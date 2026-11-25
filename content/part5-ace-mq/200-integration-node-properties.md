---
id: topic-200
slug: integration-node-properties
topicNumber: 200
title: "Read Node & Flow Properties (mqsireportproperties)"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Inspect runtime properties of an Integration Node, HTTP listener ports, or server JVM heap using mqsireportproperties."
object: "Runtime Properties"
action: "Inspect Config"
commandName: "mqsireportproperties"
synonyms:
  - "mqsireportproperties"
  - "check http port ace"
  - "jvmheapsize mqsireportproperties"
  - "read node properties"
---

# Read Node & Flow Properties (mqsireportproperties)

**`mqsireportproperties`** lets you inspect live ACE configuration settings such as embedded HTTP ports, JVM heap limits, or broker registry parameters.

---

## Common Inspection Commands

```bash
# Check Node-wide HTTP listener & HTTPS settings
mqsireportproperties SCB -b httplistener -o HTTPConnector -a

# Check JVM heap size on server EG1
mqsireportproperties SCB -e EG1 -o ComIbmJVMManager -a

# Check Node general info (including WebAdmin port & linked QMGR)
mqsireportproperties SCB -o BrokerRegistry -a
```

<details data-type="output">
<summary>Expected Output (JVM Manager)</summary>

```text
ComIbmJVMManager
  uuid='ComIbmJVMManager'
  jvmMaxHeapSize='268435456'
  jvmMinHeapSize='33554432'
BIP8071I: Successful command completion.
```

</details>

---

> [!TIP]
> Always run `mqsireportproperties ... -a` right **before** and **after** running `mqsichangeproperties` so you copy the exact property key name and verify your update stuck!

---

**Next:** [Change Properties Live (mqsichangeproperties) →](#topic-201)
