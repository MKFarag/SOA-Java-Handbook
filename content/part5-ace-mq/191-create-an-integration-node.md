---
id: topic-191
slug: create-an-integration-node
topicNumber: 191
title: "Create an Integration Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create a new ACE integration node Windows service associated with an optional default queue manager using mqsicreatebroker."
object: "Integration Node"
action: "create"
commandName: "mqsicreatebroker"
synonyms:
  - "create node"
  - "create integration node"
  - "mqsicreatebroker"
  - "make broker"
  - "new integration node"
---

Creates and registers a new ACE integration node (formerly broker) as an operating system service on Windows.
Use `mqsicreatebroker` when provisioning a new integration instance on a developer workstation or production host.

```cmd
mqsicreatebroker <NodeName> [-q <QueueManagerName>]
```

| Option | Type | Description | Real Example |
| :--- | :--- | :--- | :--- |
| **`<NodeName>`** | Positional | Unique name of the integration node to register. | `SCB` |
| **`-q <QMGR>`** | Optional | Associated default queue manager for local binding connections. | `-q SCBQM` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsicreatebroker SCB -q SCBQM
BIP8096I: Successful command completion.
```

* **Windows Service Creation:** Creates a background Windows service named `ibmbk_SCB` configured under `LocalSystem`.
* **Created in Stopped State:** Newly created nodes are stopped; you must explicitly run `mqsistart <node>` to start it.
* **Headless Node:** Omitting `-q` creates a headless integration node suitable for HTTP/REST and Kafka workloads.

* [Start an Integration Node (mqsistart)](#topic-192)
* [Delete an Integration Node (mqsideletebroker)](#topic-194)
* [Link a Node to a Queue Manager](#topic-157)
