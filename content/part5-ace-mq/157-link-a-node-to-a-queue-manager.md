---
id: topic-157
slug: link-a-node-to-a-queue-manager
topicNumber: 157
title: "Link a Node to a Queue Manager"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Configure an integration node default queue manager using mqsicreatebroker -q, startup dependencies, and headless mode."
object: "Integration Node"
action: "Link Queue Manager"
commandName: "mqsicreatebroker -q"
synonyms:
  - "connect node to queue manager"
  - "link node to queue manager"
  - "default queue manager"
  - "mqsicreatebroker -q"
  - "node queue manager relationship"
---

Links an ACE integration node to a default IBM MQ queue manager for local binding connections.
Use this association when message flows use local MQInput/MQOutput nodes without specifying remote client channels.

```cmd
mqsicreatebroker <NodeName> -q <QueueManagerName>
```

| Option / Element | Description | Real Example |
| :--- | :--- | :--- |
| **`<NodeName>`** | Name of the integration node to create. | `SCB` |
| **`-q <QMGR>`** | Specifies the default queue manager for the node. | `-q SCBQM` |
| **No `-q` Flag** | Creates node in "headless" mode without a default QMGR. | Used for pure HTTP/REST or Kafka flows. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsicreatebroker SCB -q SCBQM
BIP8096I: Successful command completion.
```

* **Startup Dependency:** If a node is linked to a default queue manager, that queue manager **must be running first** before issuing `mqsistart <node>`.
* **Missing QMGR Error:** Starting a node whose linked queue manager is stopped causes error `BIP8018E: Cannot connect to queue manager SCBQM`.
* **Headless Capability:** In ACE 12, an integration node does not require an MQ queue manager unless message flows contain MQ nodes.

* [Start a Queue Manager (strmqm)](#topic-171)
* [Start an Integration Node (mqsistart)](#topic-192)
* [Common MQ Connection Errors](#topic-167)
