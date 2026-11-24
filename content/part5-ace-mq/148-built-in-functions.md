---
id: topic-148
slug: built-in-functions
topicNumber: 148
title: "Built-in Functions (String, Math, Date)"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Core built-in functions reference: SUBSTRING, LENGTH, TRIM, UPPER, ROUND, and CURRENT_TIMESTAMP."
object: "Functions"
action: "Reference"
commandName: "Built-in Functions"
synonyms:
  - "functions"
  - "substring"
  - "length"
  - "trim"
  - "upper"
  - "lower"
  - "round"
  - "current_timestamp"
---

Quick reference of essential built-in ESQL functions for string manipulation, numeric rounding, and timestamps.
Use these functions to sanitize user inputs, format dates, and calculate numerical totals.

```esql
SET <Target> = UPPER(<StringExpr>);
SET <Target> = ROUND(<NumericExpr>, <Decimals>);
```

| Category | Function | Syntax & Example | Output |
| :--- | :--- | :--- | :--- |
| **String** | `UPPER` / `LOWER` | `UPPER('cairo')` | `'CAIRO'` |
| **String** | `LENGTH` | `LENGTH('Ali')` | `3` |
| **String** | `SUBSTRING` | `SUBSTRING('Hello World' FROM 1 FOR 5)` | `'Hello'` |
| **String** | `TRIM` | `TRIM('  test  ')` | `'test'` |
| **Numeric** | `ROUND` | `ROUND(10.556, 2)` | `10.56` |
| **Numeric** | `MOD` | `MOD(10, 3)` | `1` |
| **Date/Time** | `CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` | Current local date and time |

```json
{ "id": 1, "name": "Ali", "city": "cairo" }
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
SET OutputRoot.JSON.Data.id = InputRoot.JSON.Data.id;
SET OutputRoot.JSON.Data.cityUpper = UPPER(InputRoot.JSON.Data.city);
SET OutputRoot.JSON.Data.timestamp = CURRENT_TIMESTAMP;
```

```json
{
  "id": 1,
  "cityUpper": "CAIRO",
  "timestamp": "2026-11-24 06:30:00"
}
```

* **1-Based Substring:** `SUBSTRING` indices start at **1**, not 0.
* **NULL Propagation:** If any argument passed to a built-in function is `NULL`, the function returns `NULL` without error.
* **Timestamp Casting:** To format a timestamp into a standard string, cast it using a format pattern: `CAST(CURRENT_TIMESTAMP AS CHARACTER FORMAT 'yyyy-MM-dd')`.

* [CAST and Type Conversion](#topic-149)
* [Operators and Conditions](#topic-143)
* [Custom Functions and Procedures](#topic-151)
