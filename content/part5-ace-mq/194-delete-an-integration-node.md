---
id: topic-194
slug: delete-an-integration-node
topicNumber: 194
title: "Delete an Integration Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Unregister and permanently delete an integration node Windows service and its configuration registry using mqsideletebroker."
object: "Integration Node"
action: "delete"
commandName: "mqsideletebroker"
synonyms:
  - "delete node"
  - "delete integration node"
  - "mqsideletebroker"
  - "remove node"
  - "drop node"
  - "destroy broker"
---

Permanently unregisters an integration node Windows service and removes its working directory hierarchy.
Use `mqsideletebroker` when decommissioning obsolete brokers or recreating a node with new parameters.

```cmd
mqsideletebroker <NodeName> [-q]
```

| Parameter | Type | Description | Real Example |
| :--- | :--- | :--- | :--- |
| **`<NodeName>`** | Positional | The exact name of the integration node to delete. | `SCB` |
| **`-q`** | Flag | Cleans up internal system queue subscriptions from queue manager. | `-q` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsideletebroker SCB
BIP8096I: Successful command completion.
```

* **DESTRUCTIVE:** Deleting a node removes all integration servers and deployed applications configured under it.
* **Must Be Stopped First:** Attempting to delete a running node raises an error; stop with `mqsistop <node> -i` first.
* **Queue Manager Remains:** Does NOT delete the queue manager; the queue manager continues to exist and operate independently.

* [Stop an Integration Node (mqsistop)](#topic-193)
* [Create an Integration Node (mqsicreatebroker)](#topic-191)
* [List Nodes and Status (mqsilist)](#topic-190)
