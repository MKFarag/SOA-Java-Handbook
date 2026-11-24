---
id: topic-202
slug: stop-a-message-flow
topicNumber: 202
title: "Stop a Message Flow"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Pause an individual message flow and stop input node polling without halting the integration server."
object: "Message Flow"
action: "stop flow"
commandName: "mqsistopmsgflow"
synonyms:
  - "stop message flow"
  - "stop a message flow"
  - "mqsistopmsgflow"
  - "stop flow"
  - "pause flow"
  - "halt flow"
---

Pauses a running message flow, closing input node listeners while allowing the integration server process to remain active.
Use `mqsistopmsgflow` during backend maintenance to prevent a flow from consuming messages when a database or MQ queue is unavailable.

```cmd
mqsistopmsgflow <NodeName> -e <ServerName> -k <AppName> -m <FlowName>
```

| Flag | Description | Real Example |
| :--- | :--- | :--- |
| **`<NodeName>`** | Target integration node. | `SCB` |
| **`-e <Server>`** | Target integration server. | `-e default` |
| **`-k <App>`** | Application container owning the flow. | `-k CustomerServiceApp` |
| **`-m <Flow>`** | Message flow name to stop. | `-m TransformCustomer` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsistopmsgflow SCB -e default -k CustomerServiceApp -m TransformCustomer
BIP8096I: Successful command completion.
```

* **Graceful Thread Drain:** The flow finishes processing any message currently mid-flight before entering stopped state.
* **Input Queue Buffering:** While a flow is stopped, new messages arriving on the MQ queue remain safely buffered on disk.
* **Zero Host Downtime:** Other flows running inside the same integration server continue processing traffic without interruption.

* [Start a Message Flow (mqsistartmsgflow)](#topic-201)
* [Stop an Integration Node (mqsistop)](#topic-193)
* [List Nodes and Status (mqsilist)](#topic-190)
