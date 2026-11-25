---
id: topic-177
slug: esql-read-fields-and-nulls
topicNumber: 177
title: "Read Fields Safely & Handle NULL (COALESCE)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Avoid silent NULL bugs in string concatenation and IF checks using COALESCE and EXISTS."
object: "Null Safety"
action: "Handle NULLs"
commandName: "COALESCE EXISTS IS NULL"
synonyms:
  - "esql null handling"
  - "coalesce esql"
  - "exists esql"
  - "three valued logic null esql"
---

# Read Fields Safely & Handle NULL (COALESCE)

If a field is missing from an incoming JSON or XML message, reading it in ESQL returns **`NULL`**. And in ESQL, **anything combined with `NULL` becomes `NULL`**!

```esql
-- Watch out: if middleName is NULL, the ENTIRE string becomes NULL!
DECLARE badName CHARACTER firstName || ' ' || middleName;
```

---

## Fix #1: Always Wrap Optional Fields with `COALESCE()`

`COALESCE(val1, fallback)` returns the first non-NULL value:

```esql
DECLARE custName CHARACTER COALESCE(InputRoot.JSON.Data.customer.name, 'Guest');
DECLARE amount   DECIMAL   COALESCE(InputRoot.JSON.Data.amount, 0.00);

SET OutputRoot.JSON.Data.greeting = 'Hello, ' || custName;
SET OutputRoot.JSON.Data.total    = amount;
```

<details data-type="output">
<summary>Expected Output (When JSON Is {})</summary>

```json
{
  "greeting": "Hello, Guest",
  "total": 0.00
}
```

</details>

---

## Fix #2: Check Presence Before Acting (`EXISTS` / `IS NOT NULL`)

```esql
IF EXISTS(InputRoot.JSON.Data.discountCode[]) AND InputRoot.JSON.Data.discountCode IS NOT NULL THEN
    SET OutputRoot.JSON.Data.discountApplied = TRUE;
END IF;
```

- Use **`IS NULL`** / **`IS NOT NULL`** (never `= NULL`, because `x = NULL` evaluates to `UNKNOWN`, which fails `IF` checks!).
- Use **`FIELDNAME(...)`** or **`CARDINALITY(...[]) > 0`** to verify an optional block exists.

> [!TIP]
> **Three-Valued Logic Rule:** `TRUE`, `FALSE`, and `UNKNOWN`. If an `IF` expression compares against a missing field without `COALESCE`, it becomes `UNKNOWN` and quietly jumps to `ELSE`.

---

**Next:** [Build Output Messages & Copy Headers →](#topic-178)
