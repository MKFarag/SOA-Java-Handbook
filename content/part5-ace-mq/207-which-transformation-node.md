---
id: topic-207
slug: which-transformation-node
topicNumber: 207
title: "Which Transformation Node: Compute vs Java vs Mapping"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Decision guide: choose between Compute (ESQL), JavaCompute (Java), and Mapping Node (Graphical Data Map) in ACE."
object: "Transformation Node"
action: "Select Node"
commandName: "Compute vs JavaCompute vs Mapping"
synonyms:
  - "transformation node"
  - "compute vs javacompute"
  - "mapping node vs compute"
  - "when to use esql or java"
  - "which transformation node"
  - "graphical data map"
  - "transform node selection"
---

Compares the 3 primary transformation nodes in IBM App Connect Enterprise: Compute (ESQL), JavaCompute (Java), and Mapping Node (Graphical Data Map).
Use this decision guide to select the right engine based on performance, existing team skills, and logic complexity.

```
Message Transformation Decision:
├── Graphical schema-to-schema mapping without coding? ──► [ Mapping Node ]
├── Heavy business logic, regex, external SDKs/JARs?    ──► [ JavaCompute Node ]
└── High-performance tree navigation, JSON/XML, ESQL?  ──► [ Compute Node ]
```

| Node | Language / Engine | Best Used For | Performance | Memory Overhead |
| :--- | :--- | :--- | :--- | :--- |
| **`Compute`** | **ESQL** | High-throughput JSON/XML transformations, native message tree manipulation, routing decisions. | Highest (Native C++ runtime) | Minimal |
| **`JavaCompute`** | **Java (JDK 17 in ACE 12)** | Complex math, regex validation, calling external Java JARs/REST clients, database pooling. | High (JVM garbage collection) | Moderate (JVM heap) |
| **`Mapping`** | **Graphical Data Map (.map)** | Visual drag-and-drop mapping between known schemas (XSD/JSON Schema), non-coders, compliance. | Moderate | Low |
| **`XSLTransform`**| **XSLT 2.0** | Legacy XML transformations where existing `.xslt` stylesheets already exist. | Moderate | Moderate |

### Minimal Transformation Comparison
Given incoming JSON: `{"id": 1, "name": "Ali", "city": "Cairo", "items": [{"code": "A1", "price": 10}, {"code": "B2", "price": 25}]}`

**ESQL (Compute Node):**
```sql
SET OutputRoot.JSON.Data.customer = InputRoot.JSON.Data.name;
SET OutputRoot.JSON.Data.total = InputRoot.JSON.Data.items[1].price + InputRoot.JSON.Data.items[2].price;
```

**Java (JavaCompute Node):**
```java
MbElement inData = inMessage.getRootElement().getLastChild().getFirstElementByPath("Data");
MbElement outRoot = outMessage.getRootElement().createElementAsLastChild("JSON");
MbElement outData = outRoot.createElementAsLastChild(MbElement.TYPE_NAME, "Data", null);
outData.createElementAsLastChild(MbElement.TYPE_NAME_VALUE, "customer", inData.getFirstElementByPath("name").getValue());
```

* **Compute Node Is Default:** For 80% of enterprise flows handling JSON and XML transformations, the `Compute` node with ESQL provides the lowest latency and least memory overhead.
* **JavaCompute For External Libraries:** Use `JavaCompute` when you must use external dependencies like Apache Commons, JWT token validation, or complex encryption algorithms.
* **Mapping Node For Strict Schemas:** The `Mapping` node requires complete JSON Schemas or XSDs; do not use it for dynamic, unpredictable payload structures.

* [The Compute Node Overview](#topic-136)
* [Reading a Field Path (Decoding JSON)](#topic-140)
* [Writing to OutputRoot: Four Ways](#topic-141)
