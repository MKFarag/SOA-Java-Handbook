---
id: topic-221
slug: esql-four-message-trees
topicNumber: 221
title: "The 4 Message Trees (Root, Env, LocalEnv, ExceptionList)"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Understand the four logical trees that travel with every ACE message, which ones are read-only, and when to use each."
object: "Logical Message Tree"
action: "Navigate Trees"
commandName: "InputRoot Environment LocalEnvironment ExceptionList"
synonyms:
  - "four message trees esql"
  - "inputroot vs outputroot"
  - "environment vs localenvironment"
  - "inputexceptionlist"
  - "inputbody esql"
---

# The 4 Message Trees (`Root`, `Environment`, `LocalEnvironment`, `ExceptionList`)

When ACE receives a message, it does not hand your ESQL raw bytes — it parses the message into a **logical message assembly** made of **four trees** that travel together from node to node through the flow.

---

## Anatomy of the Four Trees

```text
InputRoot                        -- Read-only message tree
 ├─ Properties                   -- Format, Encoding, CCSID, ContentType
 ├─ MQMD / HTTPInputHeader       -- Transport headers (above the body)
 └─ XMLNSC | JSON | DFDL         -- Parsed body domain
      └─ Data ... your fields    -- (JSON puts fields under .Data)

Environment                      -- Mutable scratchpad (persists flow-wide)
LocalEnvironment                 -- Per-node routing & transport metadata
ExceptionList                    -- Nested chain of error details
```

---

## Comparing the 4 Trees in a `Compute` Node

| Tree | Read-Only Input Name | Writable Output Name | Purpose | Persists Across Nodes? |
| :--- | :--- | :--- | :--- | :--- |
| **Message (`Root`)** | `InputRoot` | `OutputRoot` | Transport headers (`Properties`, `MQMD`, `HTTPInputHeader`) plus the body (`XMLNSC`, `JSON`, `DFDL`, `BLOB`) | Replaced by `OutputRoot` at each node |
| **`Environment`** | `Environment` *(same tree)* | `Environment` *(read & write)* | Your own scratch area (for example `Environment.Variables`) shared across all nodes and branches | **Yes** — kept for the entire flow run |
| **`LocalEnvironment`** | `InputLocalEnvironment` | `OutputLocalEnvironment` | Steers ACE nodes (for example `Destination.HTTP.RequestURL`, `Destination.MQ`, or REST parameters) | Passed on only if **Compute mode** includes `LocalEnvironment` |
| **`ExceptionList`** | `InputExceptionList` | `OutputExceptionList` | Chain of `BIP` error numbers, descriptions, and `Insert` details when an exception occurs | Populated on **Catch** and **Failure** paths |

---

## Fast Example: Using All Writable Trees Together

```esql
-- 1. Save a trace value across the whole flow
SET Environment.Variables.orderId = InputRoot.JSON.Data.id;

-- 2. Steer an outgoing HTTP/REST node dynamically
SET OutputLocalEnvironment.Destination.HTTP.RequestURL =
    'https://<ApiHostName>/<ResourcePath>/' || InputRoot.JSON.Data.customerId;
SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 200;

-- 3. Build the new output payload in OutputRoot
CALL CopyMessageHeaders();
SET OutputRoot.JSON.Data.status = 'ACCEPTED';
SET OutputRoot.JSON.Data.id     = Environment.Variables.orderId;
```

<details data-type="output">
<summary>Expected Output Payload & Routing</summary>

```json
{
  "status": "ACCEPTED",
  "id": "ORD-101"
}
```

</details>

### Line-by-Line Breakdown

- **`-- ...`**: Single-line ESQL comment; ignored at runtime.
- **`SET Environment.Variables.orderId = InputRoot.JSON.Data.id;`**: Creates `Variables` and `orderId` inside the single shared **`Environment`** tree and stores the incoming JSON `id` field. Because `Environment` has no separate `Input`/`Output` split, every downstream node (even after `HTTPRequest` overwrites `OutputRoot`, or inside a `Catch` branch) can still read `Environment.Variables.orderId`.
- **`SET OutputLocalEnvironment.Destination.HTTP.RequestURL = ...;`**: Writes a dynamic target URL into `OutputLocalEnvironment` for a downstream `HTTPRequest` or `RESTRequest` node. Notice **`||`** joins the base URL string literal `'https://<ApiHostName>/<ResourcePath>/'` with `InputRoot.JSON.Data.customerId`.
- **`SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 200;`**: Sets the HTTP status code that an `HTTPReply` node will send back to the caller.
- **`CALL CopyMessageHeaders();`**: Copies `Properties` and transport headers (like `MQMD` or `HTTPInputHeader`) from `InputRoot` into `OutputRoot` without copying the old body.
- **`SET OutputRoot.JSON.Data.status = 'ACCEPTED';`**: Automatically creates the `JSON` domain and `Data` folder under `OutputRoot` and sets `status` to `'ACCEPTED'`.
- **`SET OutputRoot.JSON.Data.id = Environment.Variables.orderId;`**: Reads back the value saved earlier in `Environment` and writes it to the outgoing JSON payload.

---

## What Is `InputBody`?

`InputBody` is a convenient ESQL shortcut that points directly to the **last child of `InputRoot`** (your body domain such as `InputRoot.XMLNSC` or `InputRoot.JSON`), so you can inspect the body without hardcoding the domain name:

```esql
DECLARE rootTag CHARACTER FIELDNAME(InputBody.*[1]);
```

Here `InputBody.*[1]` resolves to the first child inside the message body (for example `Order` in `XMLNSC`, or `Data` in `JSON`), and `FIELDNAME(...)` returns its name as text.

> [!WARNING]
> **`InputRoot`, `InputLocalEnvironment`, and `InputExceptionList` are strictly read-only!** Writing `SET InputRoot.JSON.Data.x = 1;` throws runtime error **`BIP2521E`** (*Cannot alter read-only tree*). Always read from `Input...` and write to `Output...` or `Environment`. Also remember: changes to `OutputLocalEnvironment` are **discarded** unless the Compute node's **Compute mode** includes `LocalEnvironment`!

---

**Next:** [Compute Module, Main() & Compute Mode →](#topic-222)
