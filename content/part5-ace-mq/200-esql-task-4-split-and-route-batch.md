---
id: topic-200
slug: esql-task-4-split-and-route-batch
topicNumber: 200
title: "Task 4: Split a Batch & Route Each Record"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'ESQL Solved Tasks & Practice'
versionBadge: 'ACE 12 / 13'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Solved ACE task: split a batch JSON array into individual messages and route VIP records to 'out1' and all others to 'out' using PROPAGATE TO TERMINAL."
object: "Task 4: Split & Route"
action: "Split Batch Array"
commandName: "PROPAGATE TO TERMINAL RETURN FALSE"
synonyms:
  - "split batch route record esql"
  - "task 4 split and route esql"
  - "propagate to terminal out1 out"
  - "for rec as records.item[]"
---

# Task 4: Split a Batch & Route Each Record

**Technique:** Batch debatching + content-based terminal routing inside a single Compute node using **`FOR ... AS ...[]`**, **`PROPAGATE TO TERMINAL`**, and **`RETURN FALSE;`**.

---

## Problem, Flow Setup & Sample Input

One incoming message holds many customer records. Split it and send each record on its own: **`VIP`** records to Compute terminal **`out1`**, and all other records to **`out`**.

- **Flow Setup:** Wire two output terminals on your Compute node — **`Out`** (e.g., to `STANDARD.QUEUE`) and **`Out1`** (e.g., to `VIP.QUEUE`).

```json
{
  "records": [
    { "id": "C1", "name": "Mona", "segment": "VIP" },
    { "id": "C2", "name": "Omar", "segment": "RETAIL" },
    { "id": "C3", "name": "Sara", "segment": "VIP" }
  ]
}
```

---

## Complete Compute Module Solution

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        FOR rec AS InputRoot.JSON.Data.records.Item[] DO
            SET OutputRoot.Properties = InputRoot.Properties;
            CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');
            SET OutputRoot.JSON.Data = rec;

            IF rec.segment = 'VIP' THEN
                PROPAGATE TO TERMINAL 'out1';
            ELSE
                PROPAGATE TO TERMINAL 'out';
            END IF;
        END FOR;

        RETURN FALSE; -- already sent everything
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Messages Emitted per Terminal</summary>

```text
Terminal 'out1' receives 2 separate messages:
  Message 1: {"id":"C1","name":"Mona","segment":"VIP"}
  Message 2: {"id":"C3","name":"Sara","segment":"VIP"}

Terminal 'out' receives 1 separate message:
  Message 1: {"id":"C2","name":"Omar","segment":"RETAIL"}
```

</details>

### Line-by-Line Breakdown

- **`FOR rec AS InputRoot.JSON.Data.records.Item[] DO`**: Iterates over every element inside the `records` array. On each pass, `rec` is an automatic `REFERENCE` pointing directly to that record object.
- **`SET OutputRoot.Properties = InputRoot.Properties;` + `CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');`**: Built **inside** the `FOR` loop on purpose! Because `PROPAGATE` uses `DELETE DEFAULT`, ACE clears `OutputRoot` immediately after each propagated message finishes downstream. Rebuilding `Properties` and `DOMAIN('JSON')` on every pass guarantees the 2nd and 3rd records also have valid headers and a JSON body domain. *(If downstream nodes are MQ nodes that also need `MQMD`, call `CALL CopyMessageHeaders();` inside the loop instead of only copying `Properties`.)*
- **`SET OutputRoot.JSON.Data = rec;`**: Copies all child fields of the current `rec` object (`id`, `name`, `segment`) directly as the root object of the new JSON message.
- **`IF rec.segment = 'VIP' THEN PROPAGATE TO TERMINAL 'out1';`**: Checks `rec.segment`. If `'VIP'`, sends `OutputRoot` immediately out of terminal **`out1`** (note lowercase `'out1'` / `'out'` in ESQL).
- **`ELSE PROPAGATE TO TERMINAL 'out'; END IF;`**: Routes all non-VIP records (including missing/`NULL` segments, since `NULL = 'VIP'` is `UNKNOWN` and falls into `ELSE`) out of the main **`out`** terminal.
- **`RETURN FALSE;`**: **Mandatory here!** Since the `FOR` loop already called `PROPAGATE` for every record, returning `FALSE` ends `Main()` without emitting an extra empty message at the end.

> [!TIP]
> What if `records` is empty (`[]`)? The `FOR` loop runs 0 times and `RETURN FALSE;` exits cleanly without sending any broken message downstream!

---

**Next:** [Task 5: Enrich a Request from a Database (HTTP 404) →](#topic-201)
