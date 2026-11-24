---
id: topic-192
slug: start-an-integration-node
topicNumber: 192
title: "Start an Integration Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Start an integration node service and its child integration server processes using mqsistart."
object: "Integration Node"
action: "start"
commandName: "mqsistart"
synonyms:
  - "start node"
  - "start integration node"
  - "mqsistart"
  - "run node"
  - "up node"
  - "start broker"
---

Starts an integration node Windows service and launches all child integration servers configured under it.
Use `mqsistart` to bring integration flows online after server boot or maintenance.

```cmd
mqsistart <NodeName>
```

| Parameter | Type | Real Example |
| :--- | :--- | :--- |
| **`<NodeName>`** | Positional | The exact name of the integration node to start (e.g. `SCB`). |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsistart SCB
BIP8096I: Successful command completion.

C:\Program Files\IBM\ACE\12.0.3.0> mqsilist SCB
BIP1284I: Integration node 'SCB' on queue manager 'SCBQM' is running.
```

* **Queue Manager Prerequisite:** If the node has an associated queue manager (`-q SCBQM`), the queue manager **must** be running first.
* **Child Processes:** Starting a node launches one `DataFlowEngine.exe` OS process for each integration server defined inside it.
* **Verify with mqsilist:** Always run `mqsilist <node>` following `mqsistart` to confirm the service transitioned to running state.

* [Stop an Integration Node (mqsistop)](#topic-193)
* [List Nodes and Status (mqsilist)](#topic-190)
* [Real Session Walkthrough](#topic-189)
