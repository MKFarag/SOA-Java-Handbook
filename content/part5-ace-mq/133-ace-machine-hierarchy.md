---
id: topic-133
slug: ace-machine-hierarchy
topicNumber: 133
title: "How ACE Fits Together (Node, Server, App, Flow)"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "See the exact container hierarchy from your PC down to Integration Nodes, Integration Servers, Applications, and Message Flows."
object: "ACE Architecture"
action: "Understand Hierarchy"
commandName: "Integration Node & Server"
synonyms:
  - "integration node vs integration server"
  - "broker vs execution group"
  - "ace hierarchy"
  - "architecture diagram"
---
# How ACE Fits Together (Node, Server, App, Flow)

Every command and screen in ACE follows one simple nesting order from the operating system down to your code.

![Diagram showing Windows/Linux host containing Integration Node, Integration Server, Applications, Message Flows, and IBM MQ](/images/ace/diagram-ace-mq-architecture.svg)

---

## From Outside In

1. **Host Machine (Windows / Linux):** Runs IBM MQ and IBM ACE processes.
2. **Integration Node** *(formerly Broker)*: An optional manager on your machine (`<IntegrationNodeName>`). It can manage one or more Integration Servers and link to an IBM MQ Queue Manager.
3. **Integration Server** *(formerly Execution Group)*: The isolated runtime process that actually executes your flows. You can run it **inside** an Integration Node, or run an **Independent Integration Server** standalone without any Node.
4. **Application:** Your deployable unit (`<ApplicationName>`). It packages flows, maps, schemas, and any static libraries together.
5. **Message Flow (`.msgflow`):** The pipeline of connected nodes inside an application that receives, transforms, and sends messages.

---

## Node-Managed vs. Independent Server

| Setup | Command to Start | Best For |
| :--- | :--- | :--- |
| **Integration Node + Server** | `mqsistart <IntegrationNodeName>` | Traditional VMs running several servers managed together or via MQ link |
| **Independent Integration Server** | `IntegrationServer --work-dir ...` | Fast local dev, Docker containers, microservices (no Node required) |

> [!NOTE]
> Even though ACE v12 calls them **Integration Node** and **Integration Server**, older CLI commands still carry IBM's legacy names: `mqsicreatebroker` (Node) and `mqsicreateexecutiongroup` (Server).

---

**Next:** [ACE & MQ Quick Glossary →](#topic-134)
