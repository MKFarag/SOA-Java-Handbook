---
id: topic-187
slug: esql-propagate-multiple-outputs
topicNumber: 187
title: "PROPAGATE: Send to Different Out Terminals"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Emit 2+ separate messages from one input (for example splitting an array) using PROPAGATE."
object: "PROPAGATE Statement"
action: "Emit Multiple Messages"
commandName: "PROPAGATE"
synonyms:
  - "propagate esql"
  - "propagate to terminal out1"
  - "split array compute node"
  - "delete none propagate"
---

# PROPAGATE: Send to Different Out Terminals

Normally `Main()` returns **once** (`RETURN TRUE;`), sending **one** message to `Out`. Use **`PROPAGATE`** whenever one input needs to produce **multiple** outgoing messages — such as splitting an array or writing an audit copy to `Out1`.

---

## Pattern 1: Split a 3-Item Array into 3 Separate Messages

```esql
CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        FOR item AS InputRoot.JSON.Data.orders.Item[] DO
            CALL CopyMessageHeaders();
            SET OutputRoot.JSON.Data = item;
            PROPAGATE; -- Sends this item immediately down the Out wire
        END FOR;

        RETURN FALSE; -- IMPORTANT: We already propagated manually!
    END;
END MODULE;
```

<details data-type="output">
<summary>Runtime Behavior (3 Input Array Items)</summary>

```text
MQOutput receives 3 separate MQ messages (1 per order item) instead of 1 batch JSON.
```

</details>

---

## Pattern 2: Send to a Specific Terminal (`out` vs `out1`)

```esql
-- Send audit copy to 'out1' WITHOUT clearing OutputRoot afterward
SET OutputRoot.JSON.Data = InputRoot.JSON.Data;
PROPAGATE TO TERMINAL 'out1' DELETE NONE;

-- Modify and send main result out of default 'out'
SET OutputRoot.JSON.Data.audited = TRUE;
RETURN TRUE;
```

> [!WARNING]
> Always return **`RETURN FALSE;`** at the end of `Main()` when `PROPAGATE` inside a loop already sent all messages — otherwise `RETURN TRUE;` emits an extra empty or duplicate message!

---

**Next:** [Database Queries: SELECT, PASSTHRU & INSERT →](#topic-188)
