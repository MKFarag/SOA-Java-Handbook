---
id: topic-143
slug: terminals-in-out-failure-catch
topicNumber: 143
title: "Terminals: In, Out, Failure & Catch"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Learn what every pin (In, Out, Failure, Catch, Alternate) on a node does when messages succeed or fail."
object: "Node Terminals"
action: "Wire Terminals"
commandName: "In Out Failure Catch"
synonyms:
  - "ace terminals"
  - "catch terminal vs failure terminal"
  - "alternate terminal"
  - "out terminal"
---
# Terminals: In, Out, Failure & Catch

Every node has small colored connection pins called **terminals**. Wiring the right terminal decides what happens on success versus an error.

![Diagram of Input, Processing, and Output node terminals including Out, Failure, Catch, and Alternate](/images/ace/diagram-terminals-wiring.svg)

---

## What Each Terminal Means

| Terminal | Found On | Fires When... |
| :--- | :--- | :--- |
| **In** | Processing & Output nodes | A message arrives from the previous node |
| **Out** | Input & Processing nodes | The node finishes normally (or `MQOutput` succeeds) |
| **Failure** | Almost every node | **This specific node** throws an error inside itself (e.g., bad XML parse or missing queue) |
| **Catch** | **Input nodes** & **TryCatch** | An **unhandled error** happened **downstream** and bubbled back to this node |
| **Out1 / Match / Default** | `Compute`, `Route`, `Filter` | You branch explicitly in ESQL (`PROPAGATE TO TERMINAL 'out1'`) or XPath match |

---

## The #1 Beginner Question: Failure vs. Catch on `MQInput`

- Wire **`MQInput.Catch`** to catch errors thrown anywhere **later in the flow** (like `Compute` or `MQOutput`).
- Wire **`MQInput.Failure`** to catch errors inside **`MQInput` itself** (like corrupt MQ header or parser crash before leaving `MQInput`).

> [!TIP]
> If neither `Catch` nor `Failure` is wired on `MQInput`, ACE automatically **rolls back** the message to the input queue (and eventually moves it to the Backout / Dead-Letter queue after retries).

---

**Next:** [Message Domains (JSON, XMLNSC, DFDL, BLOB, MIME) →](#topic-144)
