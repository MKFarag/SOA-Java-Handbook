---
id: topic-225
slug: mqsistartmsgflow-and-stopmsgflow
topicNumber: 225
title: "mqsistartmsgflow & mqsistopmsgflow"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Pause or resume individual Message Flows or entire Applications without stopping the Integration Server."
object: "Flow Control"
action: "Start & Stop Flows"
commandName: "mqsistartmsgflow mqsistopmsgflow"
synonyms:
  - "mqsistartmsgflow"
  - "mqsistopmsgflow"
  - "stop application ace"
  - "pause message flow"
---

# mqsistartmsgflow & mqsistopmsgflow

Need to pause one buggy flow during maintenance while keeping other flows on the same server running? Use **`mqsistopmsgflow`** and **`mqsistartmsgflow`**.

---

## Syntax & Examples

```bash
# Stop ONE specific message flow inside Application <ApplicationName>
mqsistopmsgflow <IntegrationNodeName> -e <IntegrationServerName> -k <ApplicationName> -m <MessageFlowName>

# Stop the ENTIRE Application <ApplicationName> (all flows inside it)
mqsistopmsgflow <IntegrationNodeName> -e <IntegrationServerName> -k <ApplicationName>

# Start it back up cleanly
mqsistartmsgflow <IntegrationNodeName> -e <IntegrationServerName> -k <ApplicationName> -m <MessageFlowName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1276I: Message flow '<MessageFlowName>' on integration server '<IntegrationServerName>' has been stopped.
BIP8071I: Successful command completion.
```

</details>

---

## Same Action on an Independent Server

Replace `<IntegrationNodeName> -e <IntegrationServerName>` with `-i localhost -p 7600`:
```bash
mqsistopmsgflow -i localhost -p 7600 -k <ApplicationName> -m <MessageFlowName>
```

> [!TIP]
> Notice stopping `<ApplicationName>` pauses its triggers (`MQInput` stops reading `<InputQueueName>`, `HTTPInput` returns `503`), letting messages build safely in IBM MQ until you call `mqsistartmsgflow`.

---

**Next:** [mqsireload: Restart Execution Groups & Reload Policies →](#topic-226)
