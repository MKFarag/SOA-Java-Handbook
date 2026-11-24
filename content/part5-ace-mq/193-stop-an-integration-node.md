---
id: topic-193
slug: stop-an-integration-node
topicNumber: 193
title: "Stop an Integration Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Halt a running integration node service and gracefully terminate all child integration server processes using mqsistop."
object: "Integration Node"
action: "stop"
commandName: "mqsistop"
synonyms:
  - "stop node"
  - "stop integration node"
  - "mqsistop"
  - "halt node"
  - "kill node"
  - "stop broker"
---

Stops an integration node service and terminates all child integration server (`DataFlowEngine.exe`) processes.
Use `mqsistop` prior to host reboots, node deletion, or offline configuration file editing.

```cmd
mqsistop <NodeName> [-i]
```

| Flag | Mode | Behavior |
| :--- | :--- | :--- |
| *(None)* | Graceful | Waits for active in-flight messages to complete before terminating threads. |
| **`-i`** | **Immediate** | **Standard.** Immediately terminates server processes without waiting for in-flight requests. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsistop SCB -i
BIP8096I: Successful command completion.

C:\Program Files\IBM\ACE\12.0.3.0> mqsilist SCB
BIP1285I: Integration node 'SCB' on queue manager 'SCBQM' is stopped.
```

* **Shutdown Child Processes:** Automatically shuts down all integration servers running under this node.
* **Safe Immediate Mode:** Use `-i` if flows contain long polling loops or hang waiting on backend web services.
* **Verify Stopped:** Confirm the node status shows `BIP1285I ... is stopped` with `mqsilist`.

* [Start an Integration Node (mqsistart)](#topic-192)
* [Delete an Integration Node (mqsideletebroker)](#topic-194)
* [List Nodes and Status (mqsilist)](#topic-190)
