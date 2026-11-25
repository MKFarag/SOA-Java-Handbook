---
id: topic-175
slug: esql-four-message-trees
topicNumber: 175
title: "The 4 Message Trees (InputRoot, OutputRoot, Env, LocalEnv)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Know which ESQL root tree to read from, which one to write to, and where to store temporary variables."
object: "Logical Message Tree"
action: "Navigate Trees"
commandName: "InputRoot OutputRoot LocalEnvironment Environment"
synonyms:
  - "inputroot vs outputroot"
  - "localenvironment vs environment"
  - "four message trees esql"
  - "read only inputroot"
---

# The 4 Message Trees (InputRoot, OutputRoot, Env, LocalEnv)

Inside every Compute node, ACE hands you **4 main trees** (plus `InputExceptionList` on error branches).

---

## Quick Comparison Table

| Tree Name | Read / Write | Purpose | Persists Across Nodes? |
| :--- | :--- | :--- | :--- |
| **`InputRoot`** | **Read-Only** | Incoming headers + payload (`MQMD`, `JSON`, `XMLNSC`) | Replaced at next node |
| **`OutputRoot`** | **Read & Write** | The outgoing message you build and send to `Out` | Becomes next node's `InputRoot` |
| **`LocalEnvironment`** (`OutputLocalEnvironment`) | **Read & Write** | Dynamic routing (target queue name, REST URL path, HTTP status code) | Only passes forward if **Compute mode** includes `LocalEnvironment` |
| **`Environment`** | **Read & Write** | Shared scratchpad variables for the entire flow run (even across `FlowOrder` branches!) | **Yes** — stays alive even across error branches |

---

## Fast Example

```esql
-- 1. Save an ID in shared Environment scratchpad
SET Environment.Variables.traceId = InputRoot.JSON.Data.id;

-- 2. Set dynamic HTTP 201 status in OutputLocalEnvironment
SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 201;

-- 3. Build outgoing JSON body in OutputRoot
SET OutputRoot.JSON.Data.status = 'OK';
```

> [!WARNING]
> Writing `SET InputRoot.JSON.Data.a = 1;` throws a runtime error because **`InputRoot` is strictly read-only**! Always copy into and mutate `OutputRoot`.

---

**Next:** [Variables (DECLARE) & Data Types →](#topic-176)
