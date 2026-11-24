---
id: topic-199
slug: deploy-a-bar-file
topicNumber: 199
title: "Deploy a BAR File"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Deploy a compiled BAR archive to an active integration server using mqsideploy or ibmint deploy."
object: "BAR Archive"
action: "deploy bar"
commandName: "mqsideploy ibmint deploy"
synonyms:
  - "deploy bar"
  - "deploy a bar file"
  - "mqsideploy"
  - "ibmint deploy"
  - "deploy application"
  - "deploy flow"
---

Deploys a compiled BAR file onto a running integration server process, updating active message flows and ESQL code.
Use `mqsideploy` in production deployments or deployment scripts to publish application updates dynamically.

```cmd
mqsideploy <NodeName> -e <ServerName> -a <BarFilePath> [-m]
```

| Parameter / Flag | Description | Real Example |
| :--- | :--- | :--- |
| **`<NodeName>`** | Target integration node. | `SCB` |
| **`-e <Server>`** | Target integration server. | `-e default` |
| **`-a <BarPath>`** | Path to the BAR file to deploy. | `-a C:\bars\CustomerApp.bar` |
| **`-m`** | Complete deployment: replaces all existing apps on the server. | Optional full overwrite mode. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsideploy SCB -e default -a C:\bars\CustomerApp.bar
BIP8096I: Successful command completion.
The deployment was completed successfully.
```

* **Dynamic In-Place Reload:** Active flows on the server finish in-flight transactions and immediately load the newly deployed code.
* **Incremental vs Complete:** Default deployment is incremental (adds/updates application); passing `-m` deletes unreferenced applications.
* **Verify Deploy:** Immediately run `mqsilist SCB -e default -d 2` to confirm your application appears under the server.

* [Create a BAR File (ibmint package)](#topic-198)
* [Read a BAR File (mqsireadbar)](#topic-200)
* [List Nodes and Status (mqsilist)](#topic-190)
