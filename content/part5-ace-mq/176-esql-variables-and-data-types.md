---
id: topic-176
slug: esql-variables-and-data-types
topicNumber: 176
title: "Variables (DECLARE) & Data Types"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Declare local variables, constants, and module-level external/shared variables using clean ESQL data types."
object: "ESQL Variables"
action: "Declare Types"
commandName: "DECLARE CONSTANT SHARED EXTERNAL"
synonyms:
  - "esql declare variable"
  - "esql data types"
  - "external variable udp esql"
  - "shared variable esql"
---

# Variables (DECLARE) & Data Types

In ESQL, you declare variables inside a `BEGIN ... END` block using **`DECLARE`**. Variables default to `NULL` unless you give an initial value.

---

## Common ESQL Data Types

| Data Type | Stores | Example Declaration |
| :--- | :--- | :--- |
| **`CHARACTER`** | Text strings | `DECLARE currency CHARACTER 'USD';` |
| **`INTEGER`** | 64-bit whole numbers | `DECLARE count INTEGER 0;` |
| **`DECIMAL`** | Exact money / fixed decimals | `DECLARE price DECIMAL 19.95;` |
| **`BOOLEAN`** | `TRUE`, `FALSE`, or `UNKNOWN` | `DECLARE isValid BOOLEAN TRUE;` |
| **`TIMESTAMP`** | Date + time | `DECLARE now TIMESTAMP CURRENT_TIMESTAMP;` |
| **`BLOB`** | Raw byte array | `DECLARE raw BLOB;` |
| **`REFERENCE`** | Pointer to a tree node | `DECLARE itemRef REFERENCE TO InputRoot.JSON.Data;` |

---

## Constants, Shared & External Variables

```esql
-- Local constant (cannot be reassigned)
DECLARE MAX_RETRIES CONSTANT INTEGER 3;

-- User-Defined Property (UDP): configurable per deployment in BAR / server.conf.yaml
DECLARE envName EXTERNAL CHARACTER 'DEV';

-- Shared cache across threads in the same flow instance
DECLARE CACHE SHARED ROW;
```

> [!TIP]
> Put all `DECLARE` statements at the **top of your `BEGIN ... END` block** (or module level) before executable `SET`/`IF` statements — ESQL is strict about declarations coming first!

---

**Next:** [Read Fields Safely & Handle NULL (COALESCE) →](#topic-177)
