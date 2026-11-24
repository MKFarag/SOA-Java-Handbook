---
id: topic-213
slug: common-flow-patterns-cheat-sheet
topicNumber: 213
title: "Production Message Flow Patterns Cheat Sheet"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Architectural cheat sheet: the 5 essential message flow patterns in ACE (REST API, Queue Worker, Aggregation, Routing)."
object: "Flow Pattern"
action: "Select Architecture"
commandName: "Flow Patterns Cheat Sheet"
synonyms:
  - "message flow patterns"
  - "flow patterns cheat sheet"
  - "ace design patterns"
  - "flow architecture"
  - "rest to mq pattern"
  - "aggregation pattern"
  - "when to use which flow"
---

Quick architectural reference of the 5 most common enterprise message flow design patterns in IBM App Connect Enterprise 12.0.
Use this cheat sheet to select the right node topology, transaction boundaries, and error routing for your integration requirements.

### 1. REST API Gateway (Synchronous Request-Reply)
```
[ HTTPInput ] ──► [ Compute: Map Request ] ──► [ HTTPRequest: Backend ] ──► [ Compute: Format Response ] ──► [ HTTPReply ]
      │                                                                                                              ▲
      └────────────────────────── (Catch Terminal) ────────────────► [ Compute: 500 JSON Error ] ───────────────────┘
```
* **Nodes Used:** `HTTPInput`, `Compute`, `HTTPRequest`, `HTTPReply`.
* **When to Use:** Exposing microservices or mobile REST APIs that query a backend system and return an immediate synchronous JSON response.

### 2. Reliable Queue Consumer (Asynchronous Worker with DLQ)
```
[ MQInput ] ──► [ Compute: Process Order ] ──► [ MQOutput: Target Queue ]
     │
     ├─► (catch)   ──► [ Compute: Audit Error ] ──► [ MQOutput: ORDER.BACKOUT.Q ]
     └─► (failure) ──► [ MQOutput: SYSTEM.DEAD.LETTER.QUEUE ]
```
* **Nodes Used:** `MQInput`, `Compute`, `MQOutput`.
* **When to Use:** High-volume event processing, decoupling orders from billing, background jobs where no caller is waiting.

### 3. Content-Based Router (Dynamic Branching)
```
                  ┌──► (Cairo)   ──► [ Compute: Cairo Discount ] ──► [ MQOutput: ORDERS.CAIRO.Q ]
[ MQInput ] ──► [ Route ] ──┼──► (Alex)    ──► [ Compute: Alex Shipping ]  ──► [ MQOutput: ORDERS.ALEX.Q ]
                  └──► (default) ──► [ MQOutput: ORDERS.GENERAL.Q ]
```
* **Nodes Used:** `MQInput` / `HTTPInput`, `Route`, `Compute`, `MQOutput`.
* **When to Use:** Inspecting order properties (e.g. region, VIP status) to dispatch messages to specialized processing queues.

### 4. MQ Request-Response (CorrelId Matching)
```
[ MQInput ] ──► [ Compute: Process & Set CorrelId ] ──► [ MQReply ]
```
* **Nodes Used:** `MQInput`, `Compute`, `MQReply`.
* **When to Use:** Client puts a message with `MQMD.ReplyToQ` and unique `MsgId`. Flow processes and `MQReply` automatically sends response with `CorrelId = MsgId`.

### 5. Fan-Out / Fan-In (Parallel Aggregation)
```
                   ┌──► [ HTTPRequest: Check Inventory ] ──┐
[ AggregateControl ] ──┼──► [ HTTPRequest: Check Credit ]    ──┼──► [ AggregateReply ] ──► [ Compute: Combine ]
                   └──► [ HTTPRequest: Calculate Tax ]   ──┘
```
* **Nodes Used:** `AggregateControl`, `AggregateRequest`, `HTTPRequest` / `MQOutput`, `AggregateReply`, `Compute`.
* **When to Use:** Calling 3+ slow independent backend services simultaneously in parallel and combining all results before responding.

### Pattern Selection Matrix
| Business Requirement | Recommended Pattern | Ingress Node | Egress Node |
| :--- | :--- | :--- | :--- |
| **REST API to Backend Web Service** | Pattern 1: REST Gateway | `HTTPInput` | `HTTPReply` |
| **Guaranteed Financial Order Processing** | Pattern 2: Queue Consumer | `MQInput` | `MQOutput` (with DLQ) |
| **Regional Message Segregation** | Pattern 3: Content Router | `MQInput` / `HTTPInput` | `Route` ➔ Multiple `MQOutput` |
| **Legacy Two-Way Messaging** | Pattern 4: MQ Request-Response | `MQInput` | `MQReply` |
| **Multi-Service Parallel Fetch** | Pattern 5: Fan-Out / Fan-In | `AggregateControl` | `AggregateReply` |

* **Always Wire Error Terminals:** In every production pattern, wire the `catch` terminal of the ingress node to prevent messages from being dropped silently.
* **Avoid Nested Aggregations:** Aggregation nodes store correlation state in internal storage; avoid nesting aggregate flows within each other.
* **Keep Flows Simple:** If a message flow exceeds 15 nodes, modularize sub-sections into reusable `.subflow` components.

* [Which Transformation Node: Compute vs Java vs Mapping](#topic-207)
* [Which Transport Protocol: HTTP vs MQ vs File](#topic-208)
* [Message Routing: Route Node vs Filter Node](#topic-209)
* [Error Handling: TryCatch Node vs Terminals](#topic-211)
* [Modularization: Subflows and Static Libraries](#topic-212)
