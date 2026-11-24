---
id: topic-214
slug: start-an-integration-server
topicNumber: 214
title: "Start an Integration Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Start a specific integration server under an integration node using mqsistartmsgflow -e without restarting the entire broker."
object: "Integration Server"
action: "Start"
commandName: "mqsistartmsgflow -e"
synonyms:
  - "start an integration server"
  - "start integration server"
  - "start server"
  - "mqsistartmsgflow -e"
  - "start execution group"
  - "bring server online"
---

Starts an individual integration server (execution group) managed by an integration node.
Use this command to bring a stopped server and its deployed message flows online without restarting the parent node.

```cmd
mqsistartmsgflow <IntegrationNodeName> -e <IntegrationServerName>
```

| Parameter | Required? | Meaning | Example |
| :--- | :--- | :--- | :--- |
| **`IntegrationNodeName`** | Required | Name of the managing integration node. | `ACE_NODE` |
| **`-e`** | Required | Name of the integration server to start. | `-e default` |
| **`-w`** | Optional | Wait timeout in seconds for server startup confirmation. | `-w 60` |

### Minimal Example (Windows Command Console)
Start integration server `SERVER1` managed by node `ACE_NODE`:

```cmd
mqsistartmsgflow ACE_NODE -e SERVER1
```

```text
BIP8071I: Successful command completion.
BIP2241I: Integration server 'SERVER1' on integration node 'ACE_NODE' has been started.
```

* **Whole Server Starts:** When `-m` (flow name) is omitted, starting the server brings all deployed applications and message flows inside that server online.
* **Inspect Status:** Run `mqsilist ACE_NODE` to verify that `SERVER1` shows state `running` with an active OS PID.
* **Toolkit Alternative:** You can also right-click the server in the ACE Toolkit Integration Explorer and select **Start**.

* [List Nodes and Status (mqsilist)](#topic-190)
* [Stop an Integration Server (mqsistopmsgflow -e)](#topic-215)
* [Create an Integration Server (mqsicreateexecutiongroup)](#topic-196)
