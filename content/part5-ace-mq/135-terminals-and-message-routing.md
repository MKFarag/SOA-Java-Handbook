---
id: topic-135
slug: terminals-and-message-routing
topicNumber: 135
title: "Terminals and Message Routing"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE & MQ Basics'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Understand in, out, failure, and catch terminals and how messages navigate through flow paths."
object: "Terminals"
action: "Routing"
commandName: "Terminal Routing"
synonyms:
  - "terminals"
  - "routing"
  - "failure terminal"
  - "catch terminal"
  - "out terminal"
  - "propagation"
---

Terminals are the connection points on nodes through which messages enter, exit, or handle errors.
Use terminals to direct successful processing down the happy path while safely capturing runtime failures.

```
                ┌───────────────┐
                │ Compute Node  │──► [ out ]     ──► Happy Path (MQOutput)
──► [ in ]  ───►│               │──► [ failure ] ──► Error Logging
                │ (ESQL Engine) │──► [ catch ]   ──► Recovery Flow
                └───────────────┘
```

| Terminal | Purpose | When Message Travels Here |
| :--- | :--- | :--- |
| **`in`** | Input port | Message enters the node from an upstream node. |
| **`out`** | Primary output port | Default exit path when node processing succeeds (e.g. `RETURN TRUE`). |
| **`failure`** | Internal fault port | Node encounters internal failure (e.g. parser failure, schema violation) before node logic finishes. |
| **`catch`** | Downstream exception catch | Downstream node connected to `out` threw an unhandled exception that bubbled backward. |

* **Unconnected Failure Terminal:** If a node experiences an error and its `failure` terminal is unwired, ACE raises an unhandled exception and rolls back the transaction.
* **Catch vs. Failure:** `failure` catches errors *inside* this node; `catch` catches errors *downstream* from this node.
* **Explicit Propagation:** In ESQL, `PROPAGATE TO TERMINAL 'out'` routes messages out of specific terminals on demand.

* [The Life of One Message Through a Flow](#topic-134)
* [Throw and Handle Errors (ExceptionList)](#topic-153)
* [PROPAGATE and Terminal Control](#topic-154)
