---
id: topic-143
slug: operators-and-conditions
topicNumber: 143
title: "Operators and Conditions"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Conditional routing with IF/ELSEIF/ELSE, CASE statements, string concatenation (||), and three-valued logic with NULL."
object: "Conditions"
action: "Control Flow"
commandName: "IF ELSE"
synonyms:
  - "if else"
  - "case when"
  - "operators"
  - "concatenation"
  - "null comparison"
  - "three valued logic"
---

Controls execution branching using `IF`, `ELSEIF`, `CASE`, and Boolean comparison operators.
Use conditional branching to route messages, sanitize values, and handle missing payload fields.

```esql
IF <Condition> THEN
    -- Statements
ELSEIF <Condition> THEN
    -- Statements
ELSE
    -- Default statements
END IF;
```

| Operator | Function | Example |
| :--- | :--- | :--- |
| **`=`**, **`<>`** | Equal, Not Equal | `IF city = 'Cairo' THEN` |
| **`||`** | String concatenation | `'Hello ' || name` |
| **`IS NULL`**, **`IS NOT NULL`** | Check for absence of value | `IF var IS NULL THEN` |
| **`AND`**, **`OR`**, **`NOT`** | Logical combinations | `IF price > 10 AND city = 'Cairo' THEN` |

```json
{ "id": 1, "name": "Ali", "city": "Cairo" }
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
IF InputRoot.JSON.Data.city = 'Cairo' THEN
    SET OutputRoot.JSON.Data.shippingFee = 10;
ELSE
    SET OutputRoot.JSON.Data.shippingFee = 30;
END IF;
```

```json
{ "shippingFee": 10 }
```

* **Three-Valued Logic:** If a field is `NULL`, `city = 'Cairo'` evaluates to `UNKNOWN`, which evaluates as `FALSE` in an `IF` check.
* **Use IS NULL:** Never test `IF field = NULL`; always write `IF field IS NULL`.
* **String Concatenation with NULL:** Any concatenation with `NULL` yields `NULL` (e.g. `'Hello ' || NULL` becomes `NULL`).

* [Variables, Data Types, and Constants](#topic-142)
* [Loop Over a JSON Array](#topic-144)
* [Built-in Functions](#topic-148)
