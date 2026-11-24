---
id: topic-211
slug: error-handling-in-flows
topicNumber: 211
title: "Error Handling: TryCatch Node vs Terminals"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Catch and recover from errors: choose between TryCatch node, node Failure terminals, and Input node Catch terminals."
object: "Error Handling"
action: "Handle Exception"
commandName: "TryCatch vs Catch vs Failure"
synonyms:
  - "trycatch node"
  - "flow error handling"
  - "failure terminal"
  - "catch terminal"
  - "exception handling in flows"
  - "dead letter queue"
  - "exceptionlist handling"
---

Compares the 3 exception handling mechanisms in ACE message flows: TryCatch node, node Failure terminals, and Input node Catch terminals.
Use this guide to isolate fragile operations (e.g. backend HTTP calls) and route errors to error queues without rolling back the entire flow transaction.

```
Error Handling Hierarchy in Message Flows:
1. Local Node Failure  ──► [ Node Failure Terminal ]  (Fires if node itself fails)
2. Enclosed Sub-Flow   ──► [ TryCatch Node: catch ]   (Traps exceptions in 'try' branch)
3. Entire Transaction  ──► [ Input Node: catch ]      (Last resort before rollback / DLQ)
```

| Error Handling Mechanism | Where Configured | When It Fires | Transaction Scope | ExceptionList Attached? |
| :--- | :--- | :--- | :--- | :--- |
| **`Failure Terminal`** | On individual nodes (Compute, MQOutput, etc.) | When the specific node cannot complete its action (e.g. parser syntax error). | Node local | Yes (under `InputExceptionList`) |
| **`TryCatch Node`** | Mid-flow wrapper node (`try` vs `catch` terminals) | When any downstream node in the `try` branch throws an exception. | Flow sub-branch (Prevents full rollback) | Yes (propagates down `catch` terminal) |
| **`Input Catch Terminal`**| On Input nodes (`MQInput`, `HTTPInput`) | When an unhandled exception bubbles up to the root input node. | Flow transaction level | Yes (contains root cause exception) |

### Minimal Error-Isolation Pattern (TryCatch)
```
[ MQInput ] ──► [ TryCatch ] ──┬─► (try)   ──► [ HTTPRequest: Backend API ] ──► [ MQOutput: Orders ]
                               └─► (catch) ──► [ Compute: Format Fault ]    ──► [ MQOutput: DLQ ]
```

Formatting error message on `catch` branch:
```sql
CREATE COMPUTE MODULE FormatError_Compute
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        SET OutputRoot.Properties = InputProperties;
        SET OutputRoot.JSON.Data.status = 'FAILED';
        SET OutputRoot.JSON.Data.orderId = InputRoot.JSON.Data.id;
        SET OutputRoot.JSON.Data.errorMessage = InputExceptionList.*[1].Insert[1].Text;
        RETURN TRUE;
    END;
END MODULE;
```

* **Unwired Failure Terminals Bubble Up:** If a node's `failure` terminal is unwired, any error on that node immediately re-throws as an exception to the enclosing `TryCatch` or `Input` catch terminal.
* **TryCatch Commits Work on Catch:** If execution enters a `TryCatch` node's `catch` branch and finishes cleanly at an output node, the overall transaction commits (it does NOT back out to the input queue).
* **Catch Terminal on Input Nodes:** Always wire the `catch` terminal of `MQInput` or `HTTPInput` to format an error response or log to a dead-letter queue (DLQ); unwired catch terminals cause message backouts.

* [Throw and Handle Errors (ExceptionList)](#topic-153)
* [BIP Codes Reference](#topic-206)
* [Sequence Control: FlowOrder Node](#topic-210)
