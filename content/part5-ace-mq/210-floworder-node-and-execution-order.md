---
id: topic-210
slug: floworder-node-and-execution-order
topicNumber: 210
title: "Sequence Control: FlowOrder Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Enforce strict execution order in message flows: execute terminal first to completion before executing terminal second."
object: "FlowOrder Node"
action: "Control Sequence"
commandName: "FlowOrder"
synonyms:
  - "floworder node"
  - "execution order"
  - "first second terminal"
  - "sequential processing"
  - "flow sequence"
  - "order of execution"
---

Forces sequential execution of flow branches: finishes the entire downstream pipeline wired to terminal `first` before initiating processing down terminal `second`.
Use the `FlowOrder` node to record audit logs, validate database prerequisites, or write tracking records before emitting a final message.

```
[ FlowOrder Node ]
      │
      ├───► [first]  ──► (1. Insert Audit Record to DB / Log to file)  [Completes First]
      │
      └───► [second] ──► (2. Forward Message to MQ / HTTP Output)      [Executes Second]
```

| Terminal | Execution Order | Behavior on Completion | Behavior on Downstream Error |
| :--- | :--- | :--- | :--- |
| **`first`** | Always executed **1st** | When entire branch finishes successfully, execution returns to `FlowOrder` to trigger `second`. | Unhandled exception halts flow; terminal `second` is **never executed**. |
| **`second`** | Always executed **2nd** | Receives the message after branch `first` completes. | Flow transaction rolls back according to flow configuration. |
| **`failure`** | Fallback | Fires only if internal runtime error occurs inside `FlowOrder` itself. | Normal failure propagation. |

### Minimal Audit-Before-Dispatch Flow Pattern
```
[ MQInput ] ──► [ FlowOrder ] ──┬─► (first)  ──► [ Compute: Insert Audit DB ]
                                └─► (second) ──► [ MQOutput: Target Queue ]
```

Audit insert on `first` terminal branch:
```sql
CREATE COMPUTE MODULE AuditLog_Compute
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        INSERT INTO Database.AUDIT_LOG (ORDER_ID, CUSTOMER, LOG_TIMESTAMP)
        VALUES (InputRoot.JSON.Data.id, InputRoot.JSON.Data.name, CURRENT_TIMESTAMP);
        RETURN TRUE;
    END;
END MODULE;
```

* **Terminal First Runs Synchronously:** The `first` branch is executed synchronously on the same thread; `second` will not receive the message until every node on `first` finishes.
* **Exceptions Abort Second:** If any node in the `first` branch throws an unhandled exception, execution aborts immediately; the `second` branch will never run.
* **Environment Tree Persistence:** Modifications made to the `Environment` tree inside the `first` branch remain accessible and visible to nodes downstream on the `second` branch.

* [Terminals and Message Routing](#topic-135)
* [Environment and LocalEnvironment Trees](#topic-152)
* [Error Handling: TryCatch Node vs Terminals](#topic-211)
