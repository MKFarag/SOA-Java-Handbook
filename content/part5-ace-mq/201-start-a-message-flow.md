---
id: topic-201
slug: start-a-message-flow
topicNumber: 201
title: "Start a Message Flow"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Resume execution of a stopped message flow inside an application without restarting the integration server."
object: "Message Flow"
action: "start flow"
commandName: "mqsistartmsgflow"
synonyms:
  - "start message flow"
  - "start a message flow"
  - "mqsistartmsgflow"
  - "start flow"
  - "resume flow"
---

Resumes execution of a specific message flow inside a running integration server process.
Use `mqsistartmsgflow` to bring an individual flow back online after maintenance without restarting sibling flows.

```cmd
mqsistartmsgflow <NodeName> -e <ServerName> -k <AppName> -m <FlowName>
```

| Flag | Description | Real Example |
| :--- | :--- | :--- |
| **`<NodeName>`** | Target integration node. | `SCB` |
| **`-e <Server>`** | Target integration server. | `-e default` |
| **`-k <App>`** | Application container owning the flow. | `-k CustomerServiceApp` |
| **`-m <Flow>`** | Specific message flow name to start. | `-m TransformCustomer` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsistartmsgflow SCB -e default -k CustomerServiceApp -m TransformCustomer
BIP8096I: Successful command completion.
```

* **Granular Control:** Starts only the targeted flow; sibling flows in the same application remain completely unaffected.
* **Starts Listening:** Once started, the flow's input node (e.g. `MQInput`) resumes reading from its source queue.
* **Verify State:** Run `mqsilist SCB -e default -d 2` to confirm flow status transitions to `running`.

* [Stop a Message Flow (mqsistopmsgflow)](#topic-202)
* [Deploy a BAR File (mqsideploy)](#topic-199)
* [List Nodes and Status (mqsilist)](#topic-190)
