---
id: topic-191
slug: esql-propagate-multiple-outputs
topicNumber: 191
title: "ESQL PROPAGATE: Splitting Batches & Routing Terminals"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Emit multiple messages from a single input and route to specific Compute terminals ('out', 'out1') using PROPAGATE, DELETE DEFAULT/NONE, and RETURN FALSE."
object: "PROPAGATE Statement"
action: "Emit & Route Messages"
commandName: "PROPAGATE TO TERMINAL DELETE NONE"
synonyms:
  - "propagate esql"
  - "propagate to terminal out1"
  - "split batch compute node"
  - "delete none propagate esql"
  - "return false after propagate"
---

# ESQL `PROPAGATE`: Splitting Batches & Routing Terminals

By default, a Compute node runs `Main()` once and emits **one** message when `Main()` hits `RETURN TRUE;`. Use **`PROPAGATE`** whenever one incoming message must emit **multiple** outgoing messages (splitting a batch array) or route messages to different Compute terminals (`out`, `out1`, `out2`).

---

## Example 1: Split a Batch & Route by Condition (`PROPAGATE TO TERMINAL`)

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

        RETURN FALSE; -- already sent everything manually
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Flow Behavior (Input Batch with 1 VIP and 2 Standard Records)</summary>

```text
1st VIP record      -> propagated immediately to terminal 'out1'
2nd Standard record -> propagated immediately to terminal 'out'
3rd Standard record -> propagated immediately to terminal 'out'
End of Main()       -> RETURN FALSE stops Compute from sending an extra empty message
```

</details>

### Line-by-Line Breakdown (Batch Split & Route)

- **`FOR rec AS InputRoot.JSON.Data.records.Item[] DO`**: Iterates over every element inside the `records` array, binding `rec` to each record subtree in turn.
- **`SET OutputRoot.Properties = InputRoot.Properties;` + `CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');`**: Notice BOTH lines sit **inside** the `FOR` loop! Why? Because by default **`PROPAGATE` uses `DELETE DEFAULT`**, which **clears `OutputRoot` (and `OutputLocalEnvironment`) immediately after sending** so the next record starts with a clean slate. Rebuilding `Properties` and `DOMAIN('JSON')` inside the loop ensures record #2 and record #3 still have valid headers and a JSON parser!
- **`SET OutputRoot.JSON.Data = rec;`**: Copies the current record's fields directly into the outgoing JSON body.
- **`PROPAGATE TO TERMINAL 'out1';` / `'out';`**: Synchronously pushes the built `OutputRoot` down the named Compute output terminal (`out1` or `out`), runs the entire downstream sub-branch for that record, and then returns here to continue the loop! (Writing bare `PROPAGATE;` sends to the default `'out'` terminal.)
- **`RETURN FALSE;`**: **Crucial!** Because `PROPAGATE` already sent every individual record, returning `FALSE` prevents the Compute node from emitting one more trailing empty message at the end of `Main()`.

---

## Example 2: Keeping `OutputRoot` After `PROPAGATE` (`DELETE NONE`)

When you want to send an audit copy to `'out1'` and then keep modifying the **same** `OutputRoot` to send out `'out'`:

```esql
CALL CopyEntireMessage();
PROPAGATE TO TERMINAL 'out1' DELETE NONE;

SET OutputRoot.JSON.Data.audited = TRUE;
RETURN TRUE;
```

- **`DELETE NONE`**: Tells ACE **NOT** to clear `OutputRoot` (or `OutputLocalEnvironment`) after propagating to `'out1'`, so the next line can still add `audited = TRUE` and emit it via `RETURN TRUE;` to `'out'`.

> [!WARNING]
> Make sure the terminals you name (`'out1'`, `'out2'`, etc.) are actually wired on the Compute node in your `.msgflow` (in ACE Toolkit, Compute has `Out`, `Out1`, `Out2`, `Out3`, `Out4`). Propagating to a terminal name that does not exist throws a runtime error!

---

**Next:** [ESQL Database Access: PASSTHRU, Parameters & Setup →](#topic-192)
