---
id: topic-219
slug: reparse-with-resetcontentdescriptor
topicNumber: 219
title: "Re-Parse Message: ResetContentDescriptor Node"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Re-parse raw payloads or change message domains (e.g. BLOB to JSON or XMLNSC) mid-flow using the ResetContentDescriptor node."
object: "ResetContentDescriptor"
action: "Re-Parse Message"
commandName: "ResetContentDescriptor"
synonyms:
  - "resetcontentdescriptor"
  - "reparse message"
  - "parse blob to json"
  - "change message domain"
  - "reset content descriptor node"
  - "force parse"
  - "change parser mid flow"
---

Re-interprets a message payload using a new Message Domain, Message Set, or Format in the middle of a message flow.
Use this node when messages enter the flow as generic `BLOB` bytes and downstream nodes (Compute or Route) must parse them as `JSON`, `XMLNSC`, or `DFDL`.

```
[ MQInput (Domain: BLOB) ] ──► [ ResetContentDescriptor (Reset to JSON) ] ──► [ Compute (Reads Root.JSON.Data) ]
```

| Node Property | Checkbox to Tick | Meaning | Typical Setting |
| :--- | :--- | :--- | :--- |
| **`Message domain`** | `Reset message domain` | New parser domain to apply to the body bitstream. | `JSON` or `XMLNSC` |
| **`Message set`** | `Reset message set` | Target schema project or shared library (for DFDL). | Name of DFDL Library |
| **`Message type`** | `Reset message type` | Top-level root element name in the schema. | `CustomerRecord` |
| **`Message format`**| `Reset message format` | Physical format representation. | Empty for JSON/XMLNSC |

### Minimal Example: Converting MQ BLOB to JSON
1. Configure `MQInput` node with Message Domain: `BLOB`.
2. Connect output terminal to a `ResetContentDescriptor` node.
3. In `ResetContentDescriptor` Properties ➔ *Basic*:
   * Check **Reset message domain**.
   * Set **Message domain**: `JSON`.
4. Downstream `Compute` node can now immediately access JSON fields:

```sql
CREATE COMPUTE MODULE ReadConvertedJSON_Compute
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        SET OutputRoot.Properties = InputProperties;
        -- Successfully reads parsed JSON from the previous BLOB
        SET OutputRoot.JSON.Data.customerName = InputRoot.JSON.Data.name;
        RETURN TRUE;
    END;
END MODULE;
```

* **Must Check "Reset" Box:** Simply typing `JSON` in the Message Domain field does nothing unless you explicitly check the **Reset message domain** checkbox.
* **Alternative to ESQL PARSE:** This node replaces having to write verbose `CREATE LASTCHILD OF OutputRoot DOMAIN('JSON') PARSE(...)` statements in ESQL.
* **Invalid Syntax Throws Exception:** If the bitstream does not conform to the selected domain (e.g. corrupted JSON), the node throws a parsing error (e.g. `BIP3132E`) down its `failure` terminal.

* [Message Domains & On-Demand Parsing](#topic-218)
* [The Compute Node Overview](#topic-136)
* [BIP Codes Reference](#topic-206)
