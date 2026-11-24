---
id: topic-190
slug: list-nodes-and-status
topicNumber: 190
title: "List Nodes and Status"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Inspect all integration nodes, servers, and deployed applications using mqsilist with -d 1 and -d 2 depth flags."
object: "Integration Node"
action: "list"
commandName: "mqsilist"
synonyms:
  - "list nodes"
  - "mqsilist"
  - "check node status"
  - "inspect servers"
  - "mqsilist -d 1"
  - "mqsilist -d 2"
---

Lists all integration nodes on the local machine and inspects their child servers, applications, and flows.
Use `mqsilist` to verify whether integration nodes and execution groups are running, stopped, or have deployed applications.

```cmd
mqsilist [<NodeName>] [-d <DepthLevel>]
```

| Depth Flag | Information Returned | Real Example |
| :--- | :--- | :--- |
| *(None)* | Top-level summary: list of integration nodes and running/stopped state. | `mqsilist` |
| **`-d 1`** | Integration nodes + child Integration Servers (Execution Groups). | `mqsilist SCB -d 1` |
| **`-d 2`** | Nodes + Servers + deployed Applications, Message Flows, and libraries. | `mqsilist SCB -d 2` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsilist SCB -d 1
BIP1284I: Integration node 'SCB' on queue manager 'SCBQM' is running.
BIP1286I: Integration server 'default' on integration node 'SCB' is running.
BIP1286I: Integration server 'orders_server' on integration node 'SCB' is running.
BIP8071I: Successful command completion.
```

* **Safe Production Command:** `mqsilist` is a read-only query that has zero operational impact on running traffic.
* **Inspect Specific Node:** Run `mqsilist SCB` to inspect only node `SCB` rather than scanning every broker on the machine.
* **Deploy Verification:** Run `mqsilist <node> -d 2` immediately after deploying a BAR file to verify the application is listed.

* [Start an Integration Node (mqsistart)](#topic-192)
* [Stop an Integration Node (mqsistop)](#topic-193)
* [Real Session Walkthrough](#topic-189)
