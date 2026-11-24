---
id: topic-152
slug: environment-and-localenvironment
topicNumber: 152
title: "Environment vs. LocalEnvironment"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Store global flow scratchpad data in Environment, and dynamically override routing destinations in LocalEnvironment."
object: "Environment Trees"
action: "Compare & Route"
commandName: "Environment LocalEnvironment"
synonyms:
  - "environment"
  - "localenvironment"
  - "dynamic routing"
  - "destination queue"
  - "scratchpad"
  - "writtenstatus"
---

Compares the two secondary tree roots: `Environment` (global scratchpad) and `LocalEnvironment` (routing overrides).
Use Environment to share data across non-adjacent nodes; use LocalEnvironment to dynamically change target MQ queues.

```esql
-- Global flow scratchpad (Environment)
SET Environment.Variables.userId = 1;

-- Dynamic queue routing override (LocalEnvironment)
SET OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName = 'DYNAMIC.OUT.Q';
```

| Feature | `Environment` | `LocalEnvironment` |
| :--- | :--- | :--- |
| **Scope** | Global throughout the entire flow invocation. | Node-level; propagated based on Compute Mode. |
| **Primary Purpose** | User scratchpad (`Environment.Variables`). | Transport routing instructions & execution feedback. |
| **Exception Persistence** | **Retained** even when exceptions bubble back. | Reverted back to the state at the Catch node. |
| **Dynamic Routing** | Not used by runtime transport nodes. | **Directly drives** MQOutput and HTTP Request destinations. |

```json
{ "id": 1, "routeTo": "SPECIAL.Q" }
```

```esql
SET OutputRoot = InputRoot;
-- Dynamically override the destination queue of downstream MQOutput node
SET OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName = InputRoot.JSON.Data.routeTo;
```

* **Compute Mode Requirement:** To pass `OutputLocalEnvironment` downstream, the Compute node's **Compute Mode** must be set to `All` or `LocalEnvironment`.
* **Standard Variable Root:** Always place custom variables under `Environment.Variables.*` to prevent collisions with internal ACE reserved words.
* **WrittenDestination Data:** After an MQOutput or HTTP node finishes, it writes execution metadata (such as `MsgId` or response headers) into `LocalEnvironment.WrittenDestination`.

* [The Compute Node: Anatomy and Properties](#topic-138)
* [The Message Tree Architecture](#topic-139)
* [MQOutput Node](#topic-160)
