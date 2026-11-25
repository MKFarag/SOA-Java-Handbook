---
id: topic-144
slug: message-domains-parsers
topicNumber: 144
title: "Message Domains (JSON, XMLNSC, DFDL, BLOB, MIME)"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Choose the right Input Message Domain parser so ACE can read JSON, XML, CSV, fixed-width files, or raw binary."
object: "Message Domain"
action: "Select Parser"
commandName: "Input Message Parsing"
synonyms:
  - "message domains ace"
  - "xmlnsc vs json vs blob"
  - "dfdl parser"
  - "blob vs xmlnsc"
---
# Message Domains (JSON, XMLNSC, DFDL, BLOB, MIME)

A **Message Domain** tells ACE *which language* the incoming bytes are written in so it knows how to parse fields into a tree.

---

## Pick the Right Domain on Your Input Node

| Incoming Payload | Choose Domain | Typical Use Case |
| :--- | :--- | :--- |
| JSON (`{"id": 1}`) | **JSON** | REST APIs, mobile/web integrations (`InputRoot.JSON.Data`) |
| XML (`<Order>...</Order>`) | **XMLNSC** | Compact, fast XML parsing for SOAP or enterprise XML (`InputRoot.XMLNSC`) |
| CSV, TXT, COBOL Copybook | **DFDL** | Structured non-XML text or binary records modeled with a DFDL schema |
| PDF, ZIP, Image, Raw Bytes | **BLOB** | Pass-through routing where you don't need to read fields inside |
| Multipart Email / Attachments | **MIME** | Email or HTTP multipart payloads |
| SOAP Web Services (`<soapenv:Envelope>`) | **SOAP** | Standard SOAP 1.1 / 1.2 services |

---

## Where You Set It

1. Select your Input node (`MQInput`, `HTTPInput`, or `FileInput`).
2. Open **Properties -> Input Message Parsing**.
3. Set **Message domain** from the dropdown.

```esql
-- Because Input node domain = JSON:
DECLARE id INTEGER InputRoot.JSON.Data.orderId;

-- Because Input node domain = XMLNSC:
DECLARE id CHARACTER InputRoot.XMLNSC.Order.OrderId;
```

> [!WARNING]
> Setting `XMLNSC` on an `MQInput` node that receives plain JSON causes an immediate **parser exception** (`BIP5025E`). If a single node receives JSON one time and raw text another, use `BLOB` and switch mid-flow with **ResetContentDescriptor**!

---

**Next:** [Test Your Flow with Flow Exerciser →](#topic-145)
