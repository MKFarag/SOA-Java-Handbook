---
id: topic-218
slug: message-domains-and-parsing
topicNumber: 218
title: "Message Domains & On-Demand Parsing"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Understand ACE message domains (JSON, XMLNSC, DFDL, BLOB, MIME) and how on-demand lazy parsing saves memory and CPU."
object: "Message Parsing"
action: "Understand Domain"
commandName: "Message Domains"
synonyms:
  - "message domains"
  - "on demand parsing"
  - "lazy parsing"
  - "json parser vs xmlnsc"
  - "dfdl parser"
  - "blob domain"
  - "how parsing works ace"
  - "partial parsing"
---

Explains how IBM App Connect Enterprise parses incoming bitstreams into logical message trees using specialized Message Domains.
Use this guide to understand why ACE parses data on demand (lazy parsing) and how to select the right domain for your payload format.

```
Message Domains in ACE:
├── JSON   ──► REST payloads, JSON arrays, key-value data      (Root.JSON.Data.*)
├── XMLNSC ──► High-performance XML, namespaces, validation     (Root.XMLNSC.*)
├── DFDL   ──► Delimited text, CSV, fixed-width, Cobol copybooks (Root.DFDL.*)
├── BLOB   ──► Raw unparsed binary bytes, images, pass-through (Root.BLOB.BLOB)
└── MIME   ──► Multi-part HTTP attachments, multipart/form-data (Root.MIME.*)
```

| Message Domain | Parser Engine | Best Used For | Schema Required? | Tree Root Path |
| :--- | :--- | :--- | :--- | :--- |
| **`JSON`** | JSON Parser | Modern REST APIs, web apps, JSON arrays. | No | `InputRoot.JSON.Data` |
| **`XMLNSC`** | XML Compact Parser | SOAP, enterprise XML, high volume XML documents. | Optional (for validation) | `InputRoot.XMLNSC` |
| **`DFDL`** | Data Format Description Language | CSV, fixed-length files, SWIFT, Cobol records. | Yes (`.xsd` DFDL schema) | `InputRoot.DFDL` |
| **`BLOB`** | Raw Byte Stream | Pass-through flows without inspecting payload, zip files. | No | `InputRoot.BLOB.BLOB` |
| **`MIME`** | MIME Parser | Email messages, HTTP file uploads with attachments. | No | `InputRoot.MIME` |

### On-Demand (Lazy) Parsing Mechanism
* **Partial Parsing:** When a message enters an Input node, ACE does NOT build the entire tree in memory immediately.
* **On-Demand Resolution:** The parser scans bytes sequentially and builds tree branches only as your ESQL code references them (e.g. evaluating `InputRoot.JSON.Data.id`).
* **Pass-Through Optimization:** If a flow merely routes a message based on MQ headers or copies `OutputRoot = InputRoot;`, the payload bytes remain unparsed, saving substantial CPU and RAM.

* **BLOB for Pure Forwarding:** If your flow moves messages between queues without modifying or inspecting the payload, configure `BLOB` domain to avoid parsing costs.
* **XMLNSC vs Legacy XMLNS:** Always use `XMLNSC` for XML in ACE 12; legacy `XML` and `XMLNS` parsers consume 3x more heap memory and lack validation.
* **DFDL Requires Schema:** Unlike JSON and XMLNSC which can self-describe, `DFDL` requires a compiled schema model in the application to define CSV column boundaries.

* [The Message Tree Architecture](#topic-139)
* [Reading a Field Path (Decoding JSON)](#topic-140)
* [Re-Parse Message: ResetContentDescriptor Node](#topic-219)
