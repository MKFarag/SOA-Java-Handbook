---
id: topic-177
slug: esql-variables-and-data-types
topicNumber: 177
title: "ESQL Variables (DECLARE), Data Types & Modifiers"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Declare variables with ESQL data types (CHARACTER, DECIMAL, FLOAT, DATE, BLOB, ROW, REFERENCE) and modifiers (CONSTANT, EXTERNAL, SHARED + BEGIN ATOMIC)."
object: "ESQL Variables"
action: "Declare Types"
commandName: "DECLARE CONSTANT EXTERNAL SHARED ATOMIC"
synonyms:
  - "esql data types"
  - "declare esql variable"
  - "float vs decimal esql"
  - "shared row begin atomic"
  - "external udp esql"
---

# ESQL Variables (`DECLARE`), Data Types & Modifiers

In ESQL, you create variables using **`DECLARE`**. If you omit an initial value, the variable defaults to **`NULL`**.

---

## Core ESQL Data Types

| Data Type | Example Declaration | Notes |
| :--- | :--- | :--- |
| **`CHARACTER`** | `DECLARE name CHARACTER 'Mona';` | Variable-length text strings; always use **single quotes** |
| **`INTEGER`** | `DECLARE count INTEGER 10;` | 64-bit signed whole numbers |
| **`DECIMAL`** | `DECLARE amt DECIMAL 10.50;` | Exact fixed-point decimal — **always use `DECIMAL` for money** |
| **`FLOAT`** | `DECLARE ratio FLOAT 0.75;` | 64-bit IEEE floating point for scientific/approximate math |
| **`BOOLEAN`** | `DECLARE ok BOOLEAN TRUE;` | Three-valued logic: `TRUE`, `FALSE`, or `UNKNOWN` |
| **`DATE` / `TIMESTAMP`** | `DECLARE d DATE CURRENT_DATE;` | Calendar date or date + time (`CURRENT_TIMESTAMP`); format with `CAST ... FORMAT` |
| **`BLOB`** | `DECLARE b BLOB X'48656C6C6F';` | Raw binary bytes (`X'...'` hex literal `'48656C6C6F'` = `'Hello'`) |
| **`ROW`** | `DECLARE r ROW;` | Mini in-memory tree/struct that can hold child fields (`r.id`, `r.Item[]`) |
| **`REFERENCE`** | `DECLARE ptr REFERENCE TO InputRoot.JSON.Data;` | Pointer alias to an existing tree node (no data copied!) |

---

## Variable Modifiers (`CONSTANT`, `EXTERNAL`, `SHARED`)

| Modifier | Where Declared | Behavior | Use Case |
| :--- | :--- | :--- | :--- |
| **`CONSTANT`** | Module or `BEGIN...END` | Immutable value (cannot be reassigned with `SET`) | Fixed limits, tax rates, error numbers |
| **`EXTERNAL`** | Module or Schema level | **User-Defined Property (UDP)** editable in Flow Properties / BAR overrides / `server.conf.yaml` without changing code | Environment URLs, timeouts, feature flags |
| **`SHARED`** | Module or Schema level | Stored once in memory and **kept across messages and threads** in that flow | In-memory lookup caches, counters |

---

## Complete Example: Data Types, UDP & Thread-Safe `SHARED` Counter

```esql
BROKER SCHEMA <SchemaName>

-- Module-level declarations (outside Main)
DECLARE MAX_LIMIT CONSTANT INTEGER 10000;
DECLARE ENV_TAG   EXTERNAL CHARACTER 'DEV';
DECLARE MSG_COUNT SHARED INTEGER 0;

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        DECLARE customer CHARACTER 'Mona';
        DECLARE amt      DECIMAL 10.50;
        DECLARE today    DATE CURRENT_DATE;
        DECLARE rawBytes BLOB X'48656C6C6F';
        DECLARE ok       BOOLEAN TRUE;
        DECLARE inRef    REFERENCE TO InputRoot.JSON.Data;
        DECLARE seq      INTEGER 0;

        -- Protect writes to SHARED variables across concurrent threads
        BEGIN ATOMIC
            SET MSG_COUNT = MSG_COUNT + 1;
            SET seq = MSG_COUNT;
        END;

        CALL CopyMessageHeaders();
        SET OutputRoot.JSON.Data.customer = customer;
        SET OutputRoot.JSON.Data.env      = ENV_TAG;
        SET OutputRoot.JSON.Data.amount   = amt;
        SET OutputRoot.JSON.Data.date     = CAST(today AS CHARACTER FORMAT 'yyyy-MM-dd');
        SET OutputRoot.JSON.Data.decoded  = CAST(rawBytes AS CHARACTER CCSID 1208);
        SET OutputRoot.JSON.Data.valid    = ok AND (amt <= MAX_LIMIT);
        SET OutputRoot.JSON.Data.seq      = seq;
        SET OutputRoot.JSON.Data.inputId  = inRef.id;
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (First Message with Input {"id": "A1"})</summary>

```json
{
  "customer": "Mona",
  "env": "DEV",
  "amount": 10.50,
  "date": "2026-11-28",
  "decoded": "Hello",
  "valid": true,
  "seq": 1,
  "inputId": "A1"
}
```

</details>

### Line-by-Line Breakdown

- **`DECLARE MAX_LIMIT CONSTANT INTEGER 10000;`**: Creates a read-only constant integer at module level. Trying to run `SET MAX_LIMIT = 20;` fails compilation.
- **`DECLARE ENV_TAG EXTERNAL CHARACTER 'DEV';`**: Exposes `ENV_TAG` as a **User-Defined Property (UDP)** with default `'DEV'`. Operations can override it per environment in the BAR file (`mqsiapplybaroverride`) without touching ESQL code.
- **`DECLARE MSG_COUNT SHARED INTEGER 0;`**: Allocates one shared integer that persists across messages instead of resetting on each call.
- **`DECLARE rawBytes BLOB X'48656C6C6F';`**: Initializes a `BLOB` using ESQL hexadecimal literal syntax **`X'...'`** (`48` = `'H'`, `65` = `'e'`, `6C` = `'l'`, `6C` = `'l'`, `6F` = `'o'`).
- **`DECLARE inRef REFERENCE TO InputRoot.JSON.Data;`**: Creates a direct pointer (`inRef`) into the input JSON body so reading `inRef.id` avoids walking from `InputRoot` repeatedly.
- **`BEGIN ATOMIC ... END;`**: Acquires an exclusive lock around the block so two concurrent message-flow threads cannot read the same `MSG_COUNT` value at once and cause a race condition. Always snapshot shared values into a local variable (`SET seq = MSG_COUNT;`) inside the atomic block!
- **`CAST(today AS CHARACTER FORMAT 'yyyy-MM-dd')`**: Converts `DATE` to a formatted text string.
- **`CAST(rawBytes AS CHARACTER CCSID 1208)`**: Decodes UTF-8 (`CCSID 1208`) raw `BLOB` bytes back into `'Hello'`.
- **`ok AND (amt <= MAX_LIMIT)`**: Combines two `BOOLEAN` expressions; evaluates to `TRUE`.

> [!TIP]
> **Declaration Order Rule:** Place all local `DECLARE` statements at the **very top** of a `BEGIN ... END` block before any `SET`, `IF`, `CALL`, or `RETURN` statement — ESQL rejects `DECLARE` statements placed after executable lines!

---

**Next:** [ESQL Tree Navigation: Paths, Wildcards, Attributes & Namespaces →](#topic-178)
