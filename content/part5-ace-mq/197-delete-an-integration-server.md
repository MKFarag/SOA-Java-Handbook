---
id: topic-197
slug: delete-an-integration-server
topicNumber: 197
title: "Delete an Integration Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Permanently remove an integration server process and delete all deployed applications inside it."
object: "Integration Server"
action: "delete"
commandName: "mqsideleteexecutiongroup"
synonyms:
  - "delete server"
  - "delete integration server"
  - "mqsideleteexecutiongroup"
  - "delete execution group"
  - "remove server"
---

Permanently deletes an integration server from an integration node, terminating its `DataFlowEngine.exe` process.
Use `mqsideleteexecutiongroup` to remove unneeded execution groups or reclaim server memory.

```cmd
mqsideleteexecutiongroup <NodeName> -e <ServerName>
```

| Parameter | Flag | Description | Real Example |
| :--- | :--- | :--- | :--- |
| **Node Name** | Positional | The parent integration node. | `SCB` |
| **Server Name** | **`-e`** | Name of the server to destroy. | `-e orders_server` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsideleteexecutiongroup SCB -e orders_server
BIP8096I: Successful command completion.
```

* **DESTRUCTIVE:** Deleting a server immediately terminates the process and erases all applications deployed inside it.
* **Sibling Servers Untouched:** Other integration servers under the same node continue running with zero interruption.
* **Verify Deletion:** Run `mqsilist <NodeName> -d 1` to confirm the server has been removed.

* [Create an Integration Server (mqsicreateexecutiongroup)](#topic-196)
* [List Nodes and Status (mqsilist)](#topic-190)
* [Deploy a BAR File (mqsideploy)](#topic-199)
