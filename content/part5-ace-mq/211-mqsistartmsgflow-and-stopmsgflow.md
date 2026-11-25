---
id: topic-211
slug: mqsistartmsgflow-and-stopmsgflow
topicNumber: 211
title: "mqsistartmsgflow & mqsistopmsgflow"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
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
# Stop ONE specific message flow inside Application OrderApp
mqsistopmsgflow SCB -e EG1 -k OrderApp -m ProcessOrderFlow

# Stop the ENTIRE Application OrderApp (all flows inside it)
mqsistopmsgflow SCB -e EG1 -k OrderApp

# Start it back up cleanly
mqsistartmsgflow SCB -e EG1 -k OrderApp -m ProcessOrderFlow
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1276I: Message flow 'ProcessOrderFlow' on integration server 'EG1' has been stopped.
BIP8071I: Successful command completion.
```

</details>

---

## Same Action on an Independent Server

Replace `SCB -e EG1` with `-i localhost -p 7600`:
```bash
mqsistopmsgflow -i localhost -p 7600 -k OrderApp -m ProcessOrderFlow
```

> [!TIP]
> Notice stopping `OrderApp` pauses its triggers (`MQInput` stops reading `IN.Q`, `HTTPInput` returns `503`), letting messages build safely in IBM MQ until you call `mqsistartmsgflow`.

---

**Next:** [mqsireload: Restart Execution Groups & Reload Policies →](#topic-212)
