---
id: topic-142
slug: variables-data-types-and-constants
topicNumber: 142
title: "Variables, Data Types, and Constants"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Declare and initialize ESQL variables, constants, and shared memory using standard data types."
object: "Variables"
action: "Declare"
commandName: "DECLARE"
synonyms:
  - "variables"
  - "data types"
  - "declare"
  - "constants"
  - "shared variables"
  - "integer"
  - "character"
---

Declares typed memory variables, read-only constants, and execution-group shared memory in ESQL.
Use variables for local counters, string manipulations, and temporary calculation state within a module.

```esql
DECLARE <VarName> <DataType> [DEFAULT <InitialValue>];
DECLARE <ConstName> CONSTANT <DataType> <Value>;
DECLARE <SharedVar> SHARED <DataType>;
```

| Data Type | Description | Example Literal |
| :--- | :--- | :--- |
| **`CHARACTER`** | Unicode text string | `'Ali'`, `'Cairo'` |
| **`INTEGER`** | 64-bit signed whole number | `1`, `100`, `-5` |
| **`DECIMAL`** | High-precision floating point number | `10.50`, `0.001` |
| **`BOOLEAN`** | Truth value | `TRUE`, `FALSE`, `UNKNOWN` |
| **`TIMESTAMP`** | Full date and time | `CURRENT_TIMESTAMP` |

```esql
DECLARE customerName CHARACTER;
DECLARE itemCount INTEGER 2;
DECLARE taxRate CONSTANT DECIMAL 0.14;

SET customerName = InputRoot.JSON.Data.name;
SET OutputRoot.Properties = InputRoot.Properties;
SET OutputRoot.JSON.Data.user = customerName;
SET OutputRoot.JSON.Data.totalTax = InputRoot.JSON.Data.items.Item[1].price * taxRate;
```

```json
{ "user": "Ali", "totalTax": 1.4 }
```

* **Quotes Rule:** In ESQL, string literals **must** use single quotes (`'Cairo'`); double quotes (`"Cairo"`) represent column/field names.
* **Shared Scope:** `DECLARE ... SHARED` variables persist across multiple messages in the same Integration Server process.
* **Initial NULL:** Uninitialized variables default to `NULL`, not zero or empty string.

* [Operators and Conditions](#topic-143)
* [CAST and Type Conversion](#topic-149)
* [Built-in Functions](#topic-148)
