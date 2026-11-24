---
id: topic-161
slug: mqget-node
topicNumber: 161
title: "MQGet Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Read or browse messages on-demand from a secondary MQ queue inside a running message flow."
object: "MQGet Node"
action: "Configure"
commandName: "MQGet"
synonyms:
  - "mqget"
  - "mqget node"
  - "fetch message mid-flow"
  - "browse message"
  - "correlid lookup"
---

The MQGet node retrieves or browses a message from an MQ queue synchronously during flow execution.
Use this node inside a flow to look up reference data or correlate an incoming request with a stored reply message.

```
[ Compute Node ] ──► ( in ) [ MQGet Node ] ( out ) ──► [ Next Node ]
                                  │
                       [ Fetch from LOOKUP.Q ]
```

| Property Tab | Property Name | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **Basic** | `Queue Name` | Blank (Required) | The queue from which to retrieve or browse messages. |
| **Basic** | `Get Mode` | `Get` | `Get` (destructive read) or `Browse` (leaves message on queue). |
| **Advanced** | `Generate CorrelId` | `No` | Match against `MQMD.CorrelId` or `MQMD.MsgId`. |

```
Node: MQGet (Named: Fetch_Account_Info)
  ├── Basic -> Queue Name: ACCOUNT.LOOKUP.Q
  ├── Basic -> Get Mode: Get
  └── Request -> Message Domain: JSON
```

* **Synchronous Wait:** The flow thread pauses at the `MQGet` node until a matching message is found or timeout expires.
* **No Message Available:** If the queue is empty or no message matches the CorrelId, the node exits through its `warning` or `noMessage` terminal.
* **Correlating Responses:** To match a specific message, assign `SET OutputRoot.MQMD.CorrelId = InputRoot.MQMD.MsgId;` before the MQGet node.

* [Which MQ Node Do I Use?](#topic-158)
* [MQInput Node](#topic-159)
* [MQOutput Node](#topic-160)
