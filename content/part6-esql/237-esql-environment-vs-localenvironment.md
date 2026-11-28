---
id: topic-237
slug: esql-environment-vs-localenvironment
topicNumber: 237
title: "Environment vs LocalEnvironment"
part: 'Part 6: ESQL'
sectionNumber: 46
sectionTitle: 'Advanced'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Separate Environment (flow-wide user scratchpad under Environment.Variables) from LocalEnvironment (steering ACE nodes like HTTP, REST, MQ, and Compute mode)."
object: "Environment & LocalEnv"
action: "Store & Steer Nodes"
commandName: "Environment.Variables OutputLocalEnvironment.Destination"
synonyms:
  - "environment vs localenvironment esql"
  - "environment.variables"
  - "outputlocalenvironment destination"
  - "replystatuscode requesturl localenvironment"
  - "rest.input.parameters esql"
---

# `Environment` vs `LocalEnvironment`

Both `Environment` and `LocalEnvironment` carry flow metadata outside the message payload, so new ACE developers often mix them up. Keep one rule in mind: **you own `Environment`**, while **ACE nodes read `LocalEnvironment`**.

---

## Side-by-Side Comparison

| Tree | Who Reads & Writes It? | Lifetime | Typical Contents | Compute Mode Needed? |
| :--- | :--- | :--- | :--- | :--- |
| **`Environment`** | **Your ESQL / Java / Map code** | Kept for the **entire flow run** (across nodes and `Catch` paths) | Custom values under **`Environment.Variables`** (correlation IDs, cached lookups, flags) | Works under default **`Message`** mode! |
| **`LocalEnvironment`** (`InputLocalEnvironment` / `OutputLocalEnvironment`) | **Built-in ACE nodes** (`HTTPRequest`, `HTTPReply`, `MQOutput`, `FileOutput`, `RouteToLabel`, REST APIs) | Per-node; replaced on each node | Incoming REST/HTTP query params (`InputLocalEnvironment`) and outgoing dynamic destinations/HTTP status (`OutputLocalEnvironment`) | **Must** set **Compute mode** to **`LocalEnvironment`** or **`LocalEnvironment And Message`**! |

---

## Fast Example: Saving State in `Environment` & Steering Nodes via `LocalEnvironment`

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();

        -- 1. Read REST path / HTTP query parameter from InputLocalEnvironment
        DECLARE custId CHARACTER COALESCE(
            InputLocalEnvironment.REST.Input.Parameters.id,
            InputLocalEnvironment.HTTP.Input.QueryString.id
        );

        -- 2. Save original data in Environment so downstream nodes can still access it
        SET Environment.Variables.traceId = InputRoot.JSON.Data.traceId;
        SET Environment.Variables.custId  = custId;

        -- 3. Steer downstream HTTPRequest node dynamically
        SET OutputLocalEnvironment.Destination.HTTP.RequestURL =
            'https://<ApiHostName>/<ResourcePath>/' || COALESCE(custId, '0');

        -- 4. Or steer downstream MQOutput node dynamically
        -- SET OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName = '<TargetQueueName>';

        -- 5. Or set HTTP status code for HTTPReply
        SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 200;

        SET OutputRoot.JSON.Data.custId = custId;
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output &amp; LocalEnvironment Steering</summary>

```text
Environment.Variables.custId                           = "1001"
OutputLocalEnvironment.Destination.HTTP.RequestURL     = "https://<ApiHostName>/<ResourcePath>/1001"
OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode= 200
OutputRoot.JSON.Data                                   = {"custId": "1001"}
```

</details>

### Line-by-Line Breakdown

- **`InputLocalEnvironment.REST.Input.Parameters.id`**: Reads a REST API path/query parameter populated by ACE's REST input handler (e.g., `/customers/{id}`). Notice input parameters are read from **`InputLocalEnvironment`** (read-only).
- **`InputLocalEnvironment.HTTP.Input.QueryString.id`**: Reads `?id=...` when using a standard `HTTPInput` node. Wrapping both in `COALESCE(...)` handles either transport cleanly.
- **`SET Environment.Variables.traceId = ...;`**: By convention, store your custom scratch values under **`Environment.Variables`** so you keep the `Environment` root tidy and separate from ACE's own internal folders.
- **`SET OutputLocalEnvironment.Destination.HTTP.RequestURL = ...;`**: Overrides the URL configured on the downstream `HTTPRequest` node.
- **`OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName`**: *(shown commented as the MQ alternative)* Overrides the target queue on an `MQOutput` node when **Destination mode** is set to `Destination List`. Notice `[1]` is required because `DestinationData` is a list!
- **`OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 200;`**: Instructs a downstream `HTTPReply` node which HTTP status code (`200`, `400`, `404`, etc.) to return.

> [!WARNING]
> **Critical Gotcha — Check `Compute mode` AND Keep Secrets Out!**
> 1. If **Compute mode** on your Compute node is still the default `Message`, **all edits to `OutputLocalEnvironment` are silently discarded**! Always switch **Compute mode** to **`LocalEnvironment And Message`** (or `LocalEnvironment`) whenever writing to `OutputLocalEnvironment`.
> 2. Never store passwords, PINs, or full credit card numbers in `Environment` — it travels across the whole flow and can leak into trace files or error dumps.

---

**Next:** [PROPAGATE: Splitting Batches & Routing Terminals →](#topic-238)
