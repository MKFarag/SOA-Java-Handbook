---
id: topic-148
slug: flow-patterns-cheat-sheet
topicNumber: 148
title: "5 Flow Patterns & HTTP vs MQ vs File"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Learn the 5 real-world ACE flow patterns and pick between HTTP, IBM MQ, and File transport."
object: "Flow Patterns"
action: "Choose Pattern"
commandName: "HTTP vs MQ vs File"
synonyms:
  - "http vs mq vs file"
  - "ace design patterns"
  - "5 flow patterns"
  - "sync vs async flow"
---
# 5 Flow Patterns & HTTP vs MQ vs File

Almost every production ACE integration is a variation of one of these **5 simple patterns**.

---

## The 5 Core Patterns

| Pattern | Typical Nodes | Use When... |
| :--- | :--- | :--- |
| **1. Pass-Through / Transform** | `MQInput -> Mapping/Compute -> MQOutput` | Convert XML to JSON or enrich fields between queues |
| **2. Sync REST API** | `HTTPInput -> Mapping/Compute -> HTTPReply` | Mobile/web app needs an immediate JSON response |
| **3. API Gateway / Orchestration** | `HTTPInput -> HTTPRequest -> Mapping -> HTTPReply` | Wrap a legacy backend or combine two REST calls into one |
| **4. Content-Based Router** | `MQInput -> Route -> Out1/Out2 -> MQOutput` | Send high-value orders to VIP queue and normal orders to standard queue |
| **5. Batch File Splitter** | `FileInput -> Compute -> MQOutput` | Drop a CSV/XML batch file in a folder and send 1 queue message per record |

---

## HTTP vs. IBM MQ vs. File: Quick Decision

| Question | Choose **HTTP** | Choose **IBM MQ** | Choose **File** |
| :--- | :--- | :--- | :--- |
| Caller waits right now for reply? | **Yes** (seconds) | Usually async (fire & forget) | No (batch) |
| Zero message loss if target is down? | Needs caller retry | **Yes** (persistent queues + rollback) | Stored on disk |
| Huge nightly batch dump? | No | Only record-by-record | **Yes** |

> [!TIP]
> Start small: pick **Pattern 1** (`MQInput -> Compute -> MQOutput`) or **Pattern 2** (`HTTPInput -> Mapping -> HTTPReply`) when testing ACE for the first time.

---

**Next Section — App Connect Nodes:** [Mapping vs Compute vs JavaCompute: Which Node? →](#topic-149)
