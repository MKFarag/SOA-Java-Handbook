---
id: topic-131
slug: what-is-ibm-mq-and-ace
topicNumber: 131
title: "What is IBM MQ and ACE & How They Relate"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE & MQ Basics'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Understand the distinct roles of IBM MQ as message transport and ACE as integration broker and data transformer."
object: "Architecture"
action: "Overview"
commandName: "MQ & ACE"
synonyms:
  - "ibm mq"
  - "ace"
  - "app connect enterprise"
  - "message broker"
  - "esb"
  - "middleware"
  - "mq vs ace"
---

IBM MQ transports messages safely across queues, while IBM App Connect Enterprise (ACE) parses, transforms, routes, and enriches those messages.
Use MQ when applications need asynchronous decoupled delivery; use ACE when those applications speak different formats or protocols.

```
Client App  ──► [ MQ Queue ] ──► ( ACE Message Flow ) ──► [ MQ Queue / HTTP ] ──► Target Service
(Producer)       (Transport)      (Transform & Route)       (Transport)             (Consumer)
```

| System | Primary Role | Does It Change Message Data? | Analogy |
| :--- | :--- | :--- | :--- |
| **IBM MQ** | Reliable queue transport (guaranteed once-only delivery) | **No.** Delivers payload as raw bytes. | Postal truck carrying a sealed package. |
| **ACE** | Integration broker (protocol bridging & message transformation) | **Yes.** Reads trees, transforms JSON/XML, writes output. | Office clerk opening package, translating letter, repacking. |

```
MQInput Node (Reads from MQ Queue)
      │
      ▼
Compute Node (Transforms JSON / XML via ESQL)
      │
      ▼
MQOutput Node (Puts to Target MQ Queue)
```

* **Decoupled execution:** MQ ensures zero message loss if ACE is stopped or restarting; messages wait safely in queue storage.
* **Separation of concerns:** Never write transformation logic inside MQ queue definitions; all transformation belongs inside ACE message flows.
* **Version pairing:** ACE 12.0.3.0 pairs with IBM MQ 9.4.x via local bindings or TCP/IP client channels.

* [Key Words & Architecture Glossary](#topic-132)
* [Runtime Architecture on the Machine](#topic-133)
* [The Life of One Message Through a Flow](#topic-134)
