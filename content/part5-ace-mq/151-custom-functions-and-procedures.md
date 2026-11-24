---
id: topic-151
slug: custom-functions-and-procedures
topicNumber: 151
title: "Custom Functions and Procedures"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Modularize code using CREATE FUNCTION (returns scalar value) and CREATE PROCEDURE (supports IN, OUT, INOUT parameters)."
object: "Modular Code"
action: "Define Routine"
commandName: "CREATE FUNCTION PROCEDURE"
synonyms:
  - "functions"
  - "procedures"
  - "create function"
  - "create procedure"
  - "parameters"
  - "in out inout"
---

Modularizes repetitive transformation logic into reusable `FUNCTION` (value returning) and `PROCEDURE` (action) routines.
Use functions for pure calculations and procedures for modifying message trees across parameters.

```esql
CREATE FUNCTION <Name>(IN <Param> <Type>) RETURNS <Type>
BEGIN
    RETURN <Value>;
END;

CREATE PROCEDURE <Name>(IN <Param> <Type>, OUT <Result> <Type>)
BEGIN
    SET <Result> = <Value>;
END;
```

| Construct | Returns Value? | Parameter Modes | Best For |
| :--- | :--- | :--- | :--- |
| **`CREATE FUNCTION`** | **Yes** (via `RETURNS`) | `IN` | Calculations, formatting, lookups. |
| **`CREATE PROCEDURE`** | No (or optional integer)| `IN`, `OUT`, `INOUT` | Modifying trees, multi-value outputs, database calls. |

```esql
-- Reusable tax calculation function
CREATE FUNCTION CalculateTax(IN price DECIMAL, IN rate DECIMAL) RETURNS DECIMAL
BEGIN
    RETURN ROUND(price * rate, 2);
END;

-- Invocation inside Main()
CREATE FUNCTION Main() RETURNS BOOLEAN
BEGIN
    SET OutputRoot.Properties = InputRoot.Properties;
    SET OutputRoot.JSON.Data.tax = CalculateTax(InputRoot.JSON.Data.items.Item[1].price, 0.14);
    RETURN TRUE;
END;
```

```json
{ "tax": 1.40 }
```

* **Procedure Invocation:** Procedures are called using the `CALL` keyword; functions are invoked inline inside expressions.
* **INOUT Parameters:** Use `INOUT` reference parameters to allow a procedure to mutate a caller's tree node in-place.
* **Scope:** Routines defined inside a module are private; routines defined outside a module in the `.esql` file are accessible across the application.

* [What is ESQL and Where Does It Run](#topic-137)
* [Variables, Data Types, and Constants](#topic-142)
* [Built-in Functions](#topic-148)
