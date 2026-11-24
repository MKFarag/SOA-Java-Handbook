---
id: topic-139
slug: the-message-tree-architecture
topicNumber: 139
title: "The Message Tree Architecture"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Understand the in-memory logical message tree structure: InputRoot, OutputRoot, Environment, and LocalEnvironment."
object: "Message Tree"
action: "Architecture"
commandName: "Message Tree"
synonyms:
  - "message tree"
  - "inputroot"
  - "outputroot"
  - "environment"
  - "localenvironment"
  - "root trees"
---

ACE parses every message into a hierarchical logical tree of elements in memory for ESQL reading and writing.
Use this structure to navigate transport headers, environment variables, and payload elements with dot notation.

```
Root
├── Properties        (Message metadata: Encoding, CodedCharSetId)
├── MQMD / HTTPInput  (Transport headers)
└── JSON              (Domain parser)
     └── Data         (Root object container)
          ├── id: 1
          └── name: "Ali"
```

| Root Tree | Access | Scope | Purpose |
| :--- | :--- | :--- | :--- |
| **`InputRoot`** | **Read-Only** | Node | The message that entered this node via the `in` terminal. |
| **`OutputRoot`** | **Read-Write** | Node | Starts empty. The message leaving through the `out` terminal. |
| **`Environment`** | **Read-Write** | Flow | Global scratchpad spanning all nodes throughout flow execution. |
| **`LocalEnvironment`**| **Read-Write** | Node / Flow | Flow control data (destination queues, URL overrides). |

```json
{ "id": 1, "name": "Ali", "city": "Cairo" }
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
SET OutputRoot.JSON.Data.id = InputRoot.JSON.Data.id;
SET OutputRoot.JSON.Data.user = InputRoot.JSON.Data.name;
```

```json
{ "id": 1, "user": "Ali" }
```

* **InputRoot is Immutable:** Attempting to write `SET InputRoot.JSON.Data.id = 2;` causes runtime error `BIP2421E`.
* **OutputRoot Starts Empty:** If you do not copy or assign fields to `OutputRoot`, an empty message with no payload is sent.
* **Environment Persistence:** Changes to `Environment` persist even across flow rollbacks and exceptions, making it ideal for audit logging.

* [Read a JSON Field](#topic-140)
* [Add Fields to the Output](#topic-141)
* [Environment vs. LocalEnvironment](#topic-152)
