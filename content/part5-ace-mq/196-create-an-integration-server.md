---
id: topic-196
slug: create-an-integration-server
topicNumber: 196
title: "Create an Integration Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create a new independent integration server process (execution group) under an integration node."
object: "Integration Server"
action: "create"
commandName: "mqsicreateexecutiongroup"
synonyms:
  - "create server"
  - "create integration server"
  - "mqsicreateexecutiongroup"
  - "create execution group"
  - "new server"
---

Creates a new integration server (formerly execution group) under an integration node.
Use `mqsicreateexecutiongroup` to isolate separate applications into independent OS processes.

```cmd
mqsicreateexecutiongroup <NodeName> -e <ServerName>
```

| Option | Flag | Description | Real Example |
| :--- | :--- | :--- | :--- |
| **Node Name** | Positional | The integration node owning the server. | `SCB` |
| **Server Name** | **`-e`** | Name of the integration server process to create. | `-e orders_server` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsicreateexecutiongroup SCB -e orders_server
BIP8096I: Successful command completion.
```

* **Process Spawn:** Creating and starting a server launches a dedicated `DataFlowEngine.exe` process with its own JVM and memory space.
* **The `-e` Flag:** The flag `-e` historically stands for "Execution Group"; in ACE 12 it controls Integration Servers.
* **Auto-Start:** By default, newly created servers start automatically if the parent node is currently running.

* [Delete an Integration Server (mqsideleteexecutiongroup)](#topic-197)
* [List Nodes and Status (mqsilist)](#topic-190)
* [Deploy a BAR File (mqsideploy)](#topic-199)
