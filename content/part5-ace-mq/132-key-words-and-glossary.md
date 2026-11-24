---
id: topic-132
slug: key-words-and-glossary
topicNumber: 132
title: "Key Words & Architecture Glossary"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE & MQ Basics'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "One-line definitions and where you encounter each core IBM MQ and ACE term."
object: "Glossary"
action: "Reference"
commandName: "Glossary"
synonyms:
  - "glossary"
  - "terms"
  - "queue manager"
  - "integration node"
  - "broker"
  - "bar file"
  - "execution group"
---

A single-reference dictionary defining the essential nouns of IBM MQ and ACE environments.
Use this glossary whenever you encounter an unfamiliar term in commands, error logs, or Toolkit flow palettes.

| Term | One-Line Definition | Where You See It |
| :--- | :--- | :--- |
| **Queue Manager (QMGR)** | Host process owning and managing queues, channels, and logs. | `strmqm SCBQM`, `runmqsc` |
| **Local Queue (QLOCAL)** | Physical memory/disk storage queue residing on the local QMGR. | `DEFINE QLOCAL(IN.Q)` |
| **Integration Node** | Top-level ACE operating system service managing server processes. (Formerly *Broker*). | `mqsistart SCB`, `mqsilist` |
| **Integration Server** | Independent OS process (DataFlowEngine) running deployed message flows. (Formerly *Execution Group*). | `mqsilist SCB -d 2` |
| **Application** | Container grouping message flows, ESQL modules, and schemas into one unit. | ACE Toolkit Project Explorer |
| **Message Flow** | Directed processing sequence of connected nodes starting with an input node. | `.msgflow` editor in Toolkit |
| **Node** | Single functional building block inside a flow (e.g. MQInput, Compute). | Flow Canvas palette |
| **Terminal** | Input or output connection port on a flow node (`in`, `out`, `failure`, `catch`). | Node wire connection points |
| **BAR File** | Broker Archive ZIP file containing compiled flows, maps, and policies for deployment. | `ibmint package`, `mqsideploy` |
| **Policy** | Shared configuration document overriding node properties (e.g. MQ connection details) without redeploying code. | Policy Project in Toolkit |
| **ACE Toolkit** | Eclipse-based IDE used to develop message flows and ESQL modules. | Desktop GUI development tool |

* **Broker = Integration Node:** "Broker" is the legacy term from Message Broker 8 and IIB 10; ACE 12 uses "Integration Node".
* **Execution Group = Integration Server:** The command flag `-e` stands for Execution Group but controls Integration Servers.
* **BAR = Broker Archive:** Standard compressed archive format with `.bar` extension.

* [What is IBM MQ and ACE & How They Relate](#topic-131)
* [Runtime Architecture on the Machine](#topic-133)
* [Which MQ Node Do I Use?](#topic-158)
