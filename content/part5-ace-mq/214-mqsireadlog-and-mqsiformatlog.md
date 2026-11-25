---
id: topic-214
slug: mqsireadlog-and-mqsiformatlog
topicNumber: 214
title: "mqsireadlog & mqsiformatlog: Read Trace Logs"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Export binary trace buffers into raw XML with mqsireadlog and convert them into human-readable text with mqsiformatlog."
object: "Trace Log Reader"
action: "Extract & Format"
commandName: "mqsireadlog & mqsiformatlog"
synonyms:
  - "mqsireadlog"
  - "mqsiformatlog"
  - "format trace xml ace"
  - "read user trace ace"
---

# mqsireadlog & mqsiformatlog: Read Trace Logs

ACE stores trace logs internally in compact binary/XML format. To actually read them like plain English, run **two quick commands back-to-back**: `mqsireadlog` -> `mqsiformatlog`.

---

## Two-Step Read Workflow

```bash
# 1. Export internal User Trace (-u) buffer to XML file
mqsireadlog SCB -u -e EG1 -o C:\temp\trace.xml

# 2. Format that XML into readable plain text
mqsiformatlog -i C:\temp\trace.xml -o C:\temp\trace.txt
```

<details data-type="output">
<summary>Sample Lines Inside C:\temp\trace.txt</summary>

```text
2026-11-25 10:15:02.410  BIP2537I: Node 'ProcessOrderFlow.Compute': Executing statement ''SET OutputRoot.JSON.Data.status = 'OK';''
2026-11-25 10:15:02.415  BIP2602I: Sending message from 'ProcessOrderFlow.MQOutput' to queue 'OUT.Q'.
```

</details>

---

> [!TIP]
> Search your formatted `trace.txt` for **`BIP`** or **`Exception`** from bottom to top — the failing ESQL line or parser error will appear right above the stack unwind!

---

**Next:** [ACE Web User Interface & REST Admin Port →](#topic-215)
