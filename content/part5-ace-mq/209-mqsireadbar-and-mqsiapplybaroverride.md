---
id: topic-209
slug: mqsireadbar-and-mqsiapplybaroverride
topicNumber: 209
title: "Inspect & Override BARs (mqsireadbar & Override)"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Read every configurable property inside a .bar file with mqsireadbar and swap values per environment using mqsiapplybaroverride."
object: "BAR File Inspection"
action: "Inspect & Override"
commandName: "mqsireadbar & mqsiapplybaroverride"
synonyms:
  - "mqsireadbar"
  - "mqsiapplybaroverride"
  - "bar editor manage configure"
  - "override queue name bar file"
---

# Inspect & Override BARs (mqsireadbar & Override)

Never open `.bar` binaries in Notepad! Use **`mqsireadbar`** to list every configurable queue name, URL, or instance count inside a `.bar`, and **`mqsiapplybaroverride`** to swap values between DEV and PROD.

![BAR Editor Manage & Configure tab showing configurable node properties inside a BAR file](/images/ace/bar-editor-manage-mq.png)

---

## Step 1: See Every Configurable Key Inside the BAR

```bash
mqsireadbar -b C:\builds\OrderApp.bar -r
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1052I: Reading Broker Archive using runtime integration node or server.
OrderApp.appzip:
  ProcessOrderFlow.msgflow:
    MQInput#queueName = IN.Q
    MQOutput#queueName = OUT.Q
BIP8071I: Successful command completion.
```

</details>

---

## Step 2: Override Values for UAT/PROD

Create `uat.properties`:
```properties
ProcessOrderFlow#MQInput.queueName=UAT.IN.Q
ProcessOrderFlow#MQOutput.queueName=UAT.OUT.Q
```

Then stamp a UAT-ready copy of the BAR:
```bash
mqsiapplybaroverride -b OrderApp.bar -p uat.properties -o OrderApp-UAT.bar
```

> [!TIP]
> Notice for **MQ connection endpoints**, using an **`MQEndpoint` Policy Project** is cleaner than per-node BAR overrides — use `mqsiapplybaroverride` primarily for queue names, additional thread instances, or HTTP URL paths.

---

**Next:** [mqsideploy: Deploy, List & Clean Flows →](#topic-210)
