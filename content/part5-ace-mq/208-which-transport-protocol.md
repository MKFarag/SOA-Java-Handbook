---
id: topic-208
slug: which-transport-protocol
topicNumber: 208
title: "Which Transport Protocol: HTTP vs MQ vs File"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Decision guide: choose between HTTP/REST, IBM MQ, and File transport protocols in ACE message flows."
object: "Transport Protocol"
action: "Select Protocol"
commandName: "HTTP vs MQ vs File"
synonyms:
  - "which transport node"
  - "http vs mq"
  - "file vs mq"
  - "sync vs async protocol"
  - "transport protocol selection"
  - "rest vs mq"
  - "transport decisions"
---

Compares the 3 primary transport protocols supported in ACE message flows: HTTP (REST/SOAP), IBM MQ, and Local/Remote Files.
Use this guide to select the right ingress and egress nodes based on synchronous vs asynchronous delivery, reliability, and throughput.

```
Transport Protocol Decision:
├── Synchronous client requires immediate response (ms)? ──► [ HTTP Nodes (REST) ]
├── Asynchronous, guaranteed once-only, decoupled queue?  ──► [ IBM MQ Nodes ]
└── Batch processing, large end-of-day CSV / flat files? ──► [ File Nodes ]
```

| Protocol | Input Node | Output Node | Communication Pattern | Delivery Guarantee | Typical Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HTTP / REST** | `HTTPInput` | `HTTPReply` / `HTTPRequest` | Synchronous Request-Reply | Best-effort (requires client retry) | Mobile/web frontends, microservices APIs. |
| **IBM MQ** | `MQInput` | `MQOutput` / `MQReply` | Asynchronous Fire-and-Forget / Queue | Guaranteed (Transactional, persistent) | Core banking transactions, order queues. |
| **File** | `FileInput` | `FileOutput` / `FileRead` | Batch Polling / Ingestion | At-least-once (atomic file moves) | End-of-day settlement, CSV reports, EDI. |
| **SOAP** | `SOAPInput` | `SOAPReply` / `SOAPRequest` | Synchronous WSDL / XML | Best-effort with WS-Security | Legacy enterprise services, WSDL contracts. |

### Architecture Trade-Offs

| Decision Factor | HTTP (REST) | IBM MQ | File Processing |
| :--- | :--- | :--- | :--- |
| **Client Coupling** | Tight (Client waits for response) | Loose (Client puts and forgets) | Decoupled (Asynchronous polling) |
| **Buffer During Spike** | Poor (Returns `503 Service Unavailable`) | Excellent (Queue absorbs million msgs) | High (Disk storage buffer) |
| **Transaction Rollback** | Client must retry manually | Automatic message backout to queue | File moved to backout/error folder |

* **HTTP for Client APIs:** Use `HTTPInput` and `HTTPReply` when exposing REST endpoints to frontend apps or third-party webhooks.
* **MQ for Enterprise Resilience:** Use `MQInput` and `MQOutput` when system reliability is critical and you cannot afford lost messages during backend outages.
* **File for High Volume Batches:** Use `FileInput` for scheduled batch files; do not process millions of records row-by-row via synchronous HTTP.

* [Which MQ Node Do I Use?](#topic-158)
* [MQInput Node](#topic-159)
* [MQOutput Node](#topic-160)
