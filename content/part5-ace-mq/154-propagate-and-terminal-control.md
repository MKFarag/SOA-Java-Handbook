---
id: topic-154
slug: propagate-and-terminal-control
topicNumber: 154
title: "PROPAGATE and Terminal Control"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Emit multiple messages from a single input, control terminal dispatch dynamically, and reset tree state."
object: "Terminal Control"
action: "Dispatch"
commandName: "PROPAGATE"
synonyms:
  - "propagate"
  - "split message"
  - "multiple outputs"
  - "propagate to terminal"
  - "fan out"
---

Overrides standard node egress by explicitly firing messages out of designated terminals on demand via `PROPAGATE`.
Use `PROPAGATE` to split an incoming batch message into individual messages or send parallel copies.

```esql
PROPAGATE TO TERMINAL 'out' [FINALIZE NONE | DELETE NONE];
```

| Option | Behavior | Use Case |
| :--- | :--- | :--- |
| **Default** | Propagates current `OutputRoot` and releases tree state. | Single explicit propagation. |
| **`DELETE NONE`** | Preserves `OutputRoot` content in memory after dispatch. | Emitting the identical payload to multiple destinations. |
| **`FINALIZE NONE`** | Bypasses header finalization calculations. | High-performance batch emissions. |

```json
{
  "items": [
    { "code": "A1", "price": 10 },
    { "code": "B2", "price": 25 }
  ]
}
```

```esql
CREATE FUNCTION Main() RETURNS BOOLEAN
BEGIN
    DECLARE I INTEGER 1;
    DECLARE count INTEGER CARDINALITY(InputRoot.JSON.Data.items.Item[]);
    SET OutputRoot.Properties = InputRoot.Properties;
    
    WHILE I <= count DO
        -- Construct individual message payload
        SET OutputRoot.JSON.Data.item = InputRoot.JSON.Data.items.Item[I];
        -- Emit individual message downstream through 'out' terminal
        PROPAGATE TO TERMINAL 'out';
        SET I = I + 1;
    END WHILE;
    
    -- Return FALSE to prevent emitting an extra unwanted message upon exit
    RETURN FALSE;
END;
```

* **Always RETURN FALSE:** If your code calls `PROPAGATE` manually, finish `Main()` with `RETURN FALSE` to prevent the node from emitting an extra copy.
* **Synchronous Execution:** `PROPAGATE` is synchronous; downstream processing completes before ESQL continues to the next statement.
* **Downstream Errors:** If a downstream node throws an exception during `PROPAGATE`, the exception bubbles immediately back into the `PROPAGATE` statement.

* [Terminals and Message Routing](#topic-135)
* [Loop Over a JSON Array](#topic-144)
* [The Compute Node Overview](#topic-136)
