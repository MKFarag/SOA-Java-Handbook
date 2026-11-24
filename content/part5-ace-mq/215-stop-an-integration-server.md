---
id: topic-215
slug: stop-an-integration-server
topicNumber: 215
title: "Stop an Integration Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Stop a specific integration server under an integration node using mqsistopmsgflow -e without stopping other servers."
object: "Integration Server"
action: "Stop"
commandName: "mqsistopmsgflow -e"
synonyms:
  - "stop an integration server"
  - "stop integration server"
  - "stop server"
  - "mqsistopmsgflow -e"
  - "stop execution group"
  - "halt server"
---

Stops an individual integration server (execution group) managed by an integration node.
Use this command to halt execution threads and unload flows on one server for maintenance without affecting other servers on the same node.

```cmd
mqsistopmsgflow <IntegrationNodeName> -e <IntegrationServerName>
```

| Parameter | Required? | Meaning | Example |
| :--- | :--- | :--- | :--- |
| **`IntegrationNodeName`** | Required | Name of the managing integration node. | `ACE_NODE` |
| **`-e`** | Required | Name of the integration server to stop. | `-e default` |
| **`-w`** | Optional | Wait timeout in seconds before command times out. | `-w 60` |

### Minimal Example (Windows Command Console)
Stop integration server `SERVER1` running under node `ACE_NODE`:

```cmd
mqsistopmsgflow ACE_NODE -e SERVER1
```

```text
BIP8071I: Successful command completion.
BIP2242I: Integration server 'SERVER1' on integration node 'ACE_NODE' has been stopped.
```

* **Graceful Thread Shutdown:** Active in-flight messages are allowed to finish their current flow transaction before the server stops.
* **Frees Operating System Memory:** Stopping an idle integration server terminates its dedicated `DataFlowEngine.exe` process, releasing JVM heap and RAM.
* **Other Servers Unaffected:** Other integration servers running on the same node (e.g. `SERVER2`) continue processing messages without interruption.

* [Start an Integration Server (mqsistartmsgflow -e)](#topic-214)
* [List Nodes and Status (mqsilist)](#topic-190)
* [Delete an Integration Server (mqsideleteexecutiongroup)](#topic-197)
