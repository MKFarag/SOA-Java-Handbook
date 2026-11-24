---
id: topic-134
slug: life-of-a-message-through-a-flow
topicNumber: 134
title: "The Life of One Message Through a Flow"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE & MQ Basics'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Trace the end-to-end journey of a message: byte arrival, parsing into tree, ESQL modification, serialization, and egress."
object: "Message Flow"
action: "Lifecycle"
commandName: "Message Lifecycle"
synonyms:
  - "lifecycle"
  - "message journey"
  - "parsing"
  - "serialization"
  - "tree"
  - "flow steps"
---

Traces the chronological journey of a single message from network byte arrival to outbound dispatch.
Use this sequence to understand where parsers run and when memory trees are created or destroyed.

```
1. Byte Ingestion ──► 2. Parser In Memory ──► 3. Compute Node ──► 4. Serialization ──► 5. Byte Egress
   (Raw Hex)           (InputRoot Tree)       (OutputRoot Tree)     (Target Format)      (Wire Out)
```

| Step | Location | What Happens | State of Data |
| :--- | :--- | :--- | :--- |
| **1. Ingestion** | Input Node (`MQInput`) | Reads raw byte payload from transport wire. | Raw binary bytes (Hex). |
| **2. Parsing** | In-Memory Engine | Selected parser (e.g. `JSON`) parses bytes into logical tree. | `InputRoot` logical tree. |
| **3. Transformation**| Compute Node | ESQL code executes in `Main()`, reading input and writing output. | `OutputRoot` logical tree built. |
| **4. Serialization**| Output Node (`MQOutput`)| Parser serializes `OutputRoot` tree back into a flat byte stream. | Outbound binary stream. |
| **5. Egress** | Output Node Transport | Bytes are committed to transport queue or HTTP socket. | Transferred across network. |

* **On-Demand Parsing:** ACE uses partial parsing; body elements are only parsed into memory when your ESQL code references them.
* **Tree Destruction:** The moment a message flow thread returns `TRUE` from `Main()` and finishes the output node, the in-memory tree is discarded by garbage collection.
* **Exception Trigger:** If step 4 (Serialization) fails due to invalid characters, control routes to the `catch` or `failure` terminal.

* [The Message Tree Architecture](#topic-139)
* [Terminals and Message Routing](#topic-135)
* [The Compute Node Overview](#topic-136)
