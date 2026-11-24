---
id: topic-141
slug: writing-to-outputroot-four-ways
topicNumber: 141
title: "Add Fields to the Output"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "The 4 patterns to construct OutputRoot: copy headers only, copy entire message, build from scratch, or pass empty payload."
object: "OutputRoot"
action: "Write"
commandName: "SET OutputRoot"
synonyms:
  - "add field"
  - "write outputroot"
  - "build output"
  - "outputroot patterns"
  - "create output json"
---

Demonstrates the 4 standard architectural patterns for building `OutputRoot` in a Compute node.
Use pattern 1 for transformations, pattern 2 for small mutations, and pattern 3 for new responses.

```esql
-- Pattern 1: Header Copy + New Payload
SET OutputRoot.Properties = InputRoot.Properties;
SET OutputRoot.JSON.Data.field = 'value';

-- Pattern 2: Full Copy + Field Mutation
SET OutputRoot = InputRoot;
SET OutputRoot.JSON.Data.city = 'Alexandria';
```

| Pattern | Code Template | When To Use |
| :--- | :--- | :--- |
| **1. Header Copy + New Body** | `SET OutputRoot.Properties = InputRoot.Properties;` | **Standard.** Replacing input with a newly structured output. |
| **2. Full Clone + Tweak** | `SET OutputRoot = InputRoot;` | Pass-through flows modifying only 1 or 2 fields. |
| **3. Fresh Wire Message** | Create `OutputRoot.Properties` from scratch | When creating a brand-new response (e.g. error reply). |
| **4. Delete Payload** | `SET OutputRoot.JSON = NULL;` | Acknowledgment or 204 No Content flows with zero body. |

```json
{ "id": 1, "name": "Ali", "city": "Cairo" }
```

```esql
-- Pattern 1 Example
SET OutputRoot.Properties = InputRoot.Properties;
SET OutputRoot.JSON.Data.id = InputRoot.JSON.Data.id;
SET OutputRoot.JSON.Data.status = 'PROCESSED';
```

```json
{ "id": 1, "status": "PROCESSED" }
```

* **Properties Retention:** Always copy `Properties` (`SET OutputRoot.Properties = InputRoot.Properties;`) to retain Encoding and CodedCharSetId.
* **Corrupting MQMD:** If your transport is MQ, copying `InputRoot` retains the original `MsgId`; assign `SET OutputRoot.MQMD.MsgId = NULL;` to let MQ generate a new unique ID.
* **Overwriting Trees:** Assigning `SET OutputRoot.JSON.Data = ...` clears all existing child elements of `Data`.

* [The Message Tree Architecture](#topic-139)
* [Read a JSON Field](#topic-140)
* [Create, Change, and Delete Fields](#topic-147)
