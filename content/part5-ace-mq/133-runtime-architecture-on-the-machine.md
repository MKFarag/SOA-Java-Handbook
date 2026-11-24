---
id: topic-133
slug: runtime-architecture-on-the-machine
topicNumber: 133
title: "Runtime Architecture on the Machine"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE & MQ Basics'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "See how Queue Managers, Integration Nodes, Servers, Applications, and Message Flows nest on Windows."
object: "Architecture"
action: "Hierarchy"
commandName: "SCBQM Architecture"
synonyms:
  - "architecture"
  - "hierarchy"
  - "scbqm"
  - "scb"
  - "nti"
  - "integration node"
  - "runtime layout"
---

Illustrates how IBM MQ and ACE processes sit on a Windows host and link together.
Use this mental model to understand what process you are querying when running commands like `mqsilist` or `dspmq`.

```
Host Machine (Windows Server)
│
├── IBM MQ Queue Manager: SCBQM  (Port 1414)
│    ├── Local Queue: IN.Q
│    └── Local Queue: OUT.Q
│
└── ACE Integration Node: SCB  (Default QM: SCBQM)
     ├── Integration Server: default  (OS Process: DataFlowEngine.exe)
     │    └── Application: CustomerServiceApp
     │         └── Message Flow: TransformCustomer.msgflow
     │              ├── MQInput (Reads IN.Q)
     │              ├── Compute (PathDemo_Compute)
     │              └── MQOutput (Writes OUT.Q)
     └── Integration Server: orders_server
```

| Architectural Level | Process Name / Artifact | Role | Real Example From Session |
| :--- | :--- | :--- | :--- |
| **1. Queue Manager** | `amqzxma0.exe` | Manages MQ memory buffers and disk queues. | `SCBQM` |
| **2. Integration Node** | `bipbroker.exe` | Windows service controlling execution servers. | `SCB`, `SCB_Q`, `NTI` |
| **3. Integration Server**| `DataFlowEngine.exe` | Operating system process executing flows in isolated JVM/memory. | `default`, `orders_server` |
| **4. Application** | Container inside Server | Logical packaging boundary for flows and ESQL. | `CustomerServiceApp` |
| **5. Message Flow** | Compiled thread inside App | Execution path from Input node to Output node. | `TransformCustomer.msgflow` |

* **Process Isolation:** If an integration server crashes due to an unhandled native fault, sibling integration servers under the same node remain running.
* **Association Rule:** An integration node can specify a default queue manager (via `-q SCBQM`), but can also run independently in headless mode.
* **Windows Services:** Integration nodes run as background Windows services configured under `LocalSystem` or a dedicated domain service account.

* [Key Words & Architecture Glossary](#topic-132)
* [List Nodes and Status (mqsilist)](#topic-190)
* [Link a Node to a Queue Manager](#topic-157)
