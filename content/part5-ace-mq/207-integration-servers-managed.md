---
id: topic-207
slug: integration-servers-managed
topicNumber: 207
title: "Managed Integration Servers (Overview)"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Understand Integration Servers inside an Integration Node: isolated OS processes with their own JVM, HTTP ports, and apps."
object: "Managed Server"
action: "Understand Isolation"
commandName: "Integration Server (Managed)"
synonyms:
  - "managed integration server"
  - "execution group vs integration server"
  - "dataflowengine process"
  - "server isolation ace"
---

# Managed Integration Servers (Overview)

An **Integration Server** *(called Execution Group in older versions)* is an isolated OS worker process (`DataFlowEngine`) managed by an Integration Node.

![Integration Explorer showing Integration Servers running under an Integration Node](/images/ace/integration-explorer-nodes.png)

---

## Why Use Multiple Servers on One Node?

| Benefit | Real Example |
| :--- | :--- |
| **Crash Isolation** | If `<Server1Name>` runs out of memory, `<Server2Name>` stays completely unaffected |
| **Independent Restarts** | Restart or deploy to `<IntegrationServerName>` without dropping HTTP traffic on `<Server2Name>` |
| **Separate JVM & HTTP Ports** | Give `<IntegrationServerName>` port `7800` + 512MB RAM and `<Server2Name>` port `7801` + 2GB RAM |

---

## Managed vs. Independent Server

- **Managed Server** *(created inside a Node)*: Controlled via `mqsicreateexecutiongroup`, `mqsideploy NODE -e <IntegrationServerName>`, etc.
- **Independent Server** *(no Integration Node)*: Created in a folder via `mqsicreateworkdir` and started directly via `IntegrationServer`.

---

**Next:** [mqsicreateexecutiongroup: Add a Server →](#topic-208)
