---
id: topic-227
slug: mqsichangetrace-troubleshooting
topicNumber: 227
title: "mqsichangetrace: Turn User & Service Trace On/Off"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Capture step-by-step execution trace logs when Flow Exerciser isn't available (or in headless test/UAT servers)."
object: "Diagnostic Trace"
action: "Enable & Disable Trace"
commandName: "mqsichangetrace"
synonyms:
  - "mqsichangetrace"
  - "user trace vs service trace"
  - "debug trace ace"
  - "turn off trace ace"
---

# mqsichangetrace: Turn User & Service Trace On/Off

When a flow fails silently or behaves unexpectedly on a remote server, turn on **User Trace (`-u`)** temporarily, reproduce the bug **once**, and then **turn trace OFF (`-l none`)** immediately.

---

## User Trace vs. Service Trace

| Trace Type | Flag | What It Records | Use When... |
| :--- | :--- | :--- | :--- |
| **User Trace** | `-u` | Every node entry/exit, ESQL statement, route match, and error | **95% of flow & ESQL debugging** |
| **Service Trace** | `-t` | Deep internal C++/IBM Support engine logs | Requested by IBM Support (huge logs, slow!) |

---

## Fast Copy-Paste Debug Workflow

```bash
# 1. Turn User Trace ON (debug level, 20MB buffer) for server <IntegrationServerName>
mqsichangetrace <IntegrationNodeName> -u -e <IntegrationServerName> -l debug -c 20480 -r

# 2. >>> Send 1 test message now! <<<

# 3. Turn User Trace OFF right away!
mqsichangetrace <IntegrationNodeName> -u -e <IntegrationServerName> -l none
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP8071I: Successful command completion.
```

</details>

> [!WARNING]
> **NEVER forget step 3 (`-l none`)!** Leaving `-l debug` trace running in production slashes throughput by 50–80% and fills trace buffers rapidly. On an Independent Server, use `-w <WorkDirPath>` instead of `<IntegrationNodeName> -e <IntegrationServerName>`.

---

**Next:** [mqsireadlog & mqsiformatlog: Read Trace Logs →](#topic-228)
