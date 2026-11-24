---
id: topic-163
slug: connect-by-queue-manager-name
topicNumber: 163
title: "Connect by Queue Manager Name"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Connect message flow nodes directly by setting the queue manager name property for local bindings."
object: "MQ Connection"
action: "Connect by Name"
commandName: "Connect by Name"
synonyms:
  - "connect by name"
  - "connect by queue manager name"
  - "local bindings"
  - "direct queue manager connection"
  - "node property connection"
---

Connects MQInput or MQOutput nodes to a specific queue manager by typing the queue manager name directly on the node.
Use connection by name in simple standalone environments where the queue manager runs on the same machine.

```
Node Properties -> Connection Tab
├── Connection: "Local queue manager"
└── Destination Queue Manager Name: "SCBQM"
```

| Node Property | Value | Description |
| :--- | :--- | :--- |
| **`Connection`** | `Local queue manager` | Connects via high-speed IPC (shared memory bindings). |
| **`Destination Queue Manager Name`** | e.g. `SCBQM` | The exact name of the local queue manager owning the queue. |

```
In ACE Toolkit:
1. Click MQInput or MQOutput node.
2. Open Properties view -> Connection tab.
3. Set Connection = "Local queue manager".
4. Set Queue Manager Name = "SCBQM".
```

* **Local Bindings Only:** Connecting by name uses local bindings (IPC shared memory); the queue manager **must** reside on the same Windows host as the node.
* **Environment Coupling:** Hardcoding `SCBQM` on node properties means changing to `TESTQM` or `PRODQM` requires modifying the flow and rebuilding the BAR.
* **Use for Quick Tests:** Connection by name is recommended for initial local testing; production environments should use policies.

* [Connect by Policy](#topic-164)
* [Name or Policy? (Decision Table)](#topic-165)
* [Link a Node to a Queue Manager](#topic-157)
