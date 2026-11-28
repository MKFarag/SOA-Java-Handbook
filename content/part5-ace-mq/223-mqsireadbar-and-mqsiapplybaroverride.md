---
id: topic-223
slug: mqsireadbar-and-mqsiapplybaroverride
topicNumber: 223
title: "Inspect & Override BARs (mqsireadbar & Override)"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
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
mqsireadbar -b <BarFilePath> -r
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1052I: Reading Broker Archive using runtime integration node or server.
<ApplicationName>.appzip:
  <MessageFlowName>.msgflow:
    MQInput#queueName = <InputQueueName>
    MQOutput#queueName = <OutputQueueName>
BIP8071I: Successful command completion.
```

</details>

---

## Step 2: Override Values for UAT/PROD

Create `<OverridePropertiesFile>.properties`:
```properties
<MessageFlowName>#MQInput.queueName=UAT.<InputQueueName>
<MessageFlowName>#MQOutput.queueName=UAT.<OutputQueueName>
```

Then stamp a UAT-ready copy of the BAR:
```bash
mqsiapplybaroverride -b <BarFileName>.bar -p <OverridePropertiesFile>.properties -o <TargetEnvBarFile>.bar
```

> [!TIP]
> Notice for **MQ connection endpoints**, using an **`MQEndpoint` Policy Project** is cleaner than per-node BAR overrides — use `mqsiapplybaroverride` primarily for queue names, additional thread instances, or HTTP URL paths.

---

**Next:** [mqsideploy: Deploy, List & Clean Flows →](#topic-224)
