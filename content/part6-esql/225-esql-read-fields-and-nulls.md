---
id: topic-225
slug: esql-read-fields-and-nulls
topicNumber: 225
title: "NULL Handling, COALESCE & Three-Valued Logic"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Prevent silent NULL propagation in ESQL strings, math, and IF checks using COALESCE, EXISTS, IS NULL, and three-valued logic."
object: "NULL Safety"
action: "Handle NULLs"
commandName: "COALESCE IS NULL EXISTS"
synonyms:
  - "esql null handling"
  - "coalesce esql"
  - "three valued logic unknown esql"
  - "null concatenation esql"
  - "is not null esql"
---

# `NULL` Handling, `COALESCE` & Three-Valued Logic

In ESQL, missing fields and uninitialized variables evaluate to **`NULL`** instead of throwing an exception — and **any string concatenation or arithmetic with `NULL` turns the entire result into `NULL`**!

---

## Why `NULL` Causes Silent Bugs

```esql
-- If middleName is missing from JSON, it evaluates to NULL:
DECLARE fullName CHARACTER 'Mona' || ' ' || InputRoot.JSON.Data.middleName;
-- fullName becomes NULL!
```

Even worse, `IF` conditions follow **three-valued logic** (`TRUE`, `FALSE`, `UNKNOWN`):
- `x = NULL` is **always `UNKNOWN`** (never `TRUE`!).
- `NULL <> 'PAID'` is also **`UNKNOWN`**!
- Whenever an `IF` condition evaluates to `UNKNOWN`, ESQL silently skips the `IF` block and jumps to `ELSE`.

---

## Safe `NULL` Handling Patterns (`COALESCE`, `EXISTS`, `IS NULL`)

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();

        -- 1. Supply fallback defaults with COALESCE
        DECLARE custName CHARACTER COALESCE(InputRoot.JSON.Data.name, 'Guest');
        DECLARE qty      INTEGER   COALESCE(InputRoot.JSON.Data.qty, 1);

        -- 2. Treat BOTH missing (NULL) and empty string ('') as missing
        IF COALESCE(InputRoot.JSON.Data.email, '') = '' THEN
            SET OutputRoot.JSON.Data.emailWarning = 'No email provided';
        END IF;

        -- 3. Check field presence and non-null value explicitly
        IF EXISTS(InputRoot.JSON.Data.coupon[])
           AND InputRoot.JSON.Data.coupon IS NOT NULL THEN
            SET OutputRoot.JSON.Data.couponApplied = TRUE;
        ELSE
            SET OutputRoot.JSON.Data.couponApplied = FALSE;
        END IF;

        SET OutputRoot.JSON.Data.greeting = 'Hello, ' || custName;
        SET OutputRoot.JSON.Data.qty      = qty;
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (When Input JSON Is {"coupon": null})</summary>

```json
{
  "emailWarning": "No email provided",
  "couponApplied": false,
  "greeting": "Hello, Guest",
  "qty": 1
}
```

</details>

### Line-by-Line Breakdown

- **`COALESCE(InputRoot.JSON.Data.name, 'Guest')`**: Scans arguments from left to right and returns the **first non-`NULL` value**. If `name` is missing or JSON `null`, `custName` receives `'Guest'`. You can pass more than two arguments (`COALESCE(a, b, 'default')`).
- **`COALESCE(InputRoot.JSON.Data.qty, 1)`**: Ensures `qty` defaults to integer `1` so downstream math never multiplies by `NULL`.
- **`IF COALESCE(InputRoot.JSON.Data.email, '') = '' THEN`**: Classic production validation idiom — converts a `NULL` field into `''` so a single `= ''` check catches **both** missing fields (`NULL`) and blank strings (`""`).
- **`EXISTS(InputRoot.JSON.Data.coupon[])`**: Checks whether a `coupon` node exists in the tree (notice the `[]` list suffix). In JSON, `"coupon": null` **does** create a node whose value is `NULL`, so `EXISTS(...)` alone returns `TRUE`!
- **`AND InputRoot.JSON.Data.coupon IS NOT NULL`**: Always use **`IS NULL`** or **`IS NOT NULL`** (never `= NULL` or `<> NULL`) when testing for `NULL` values. Combining `EXISTS` with `IS NOT NULL` rejects both absent keys and explicit JSON `null` values.
- **`'Hello, ' || custName`**: Safe to concatenate with `||` because `COALESCE` guaranteed `custName` is never `NULL`.

---

## Quick Decision Guide

| What You Want to Check | Correct ESQL Expression |
| :--- | :--- |
| Default value if missing or `NULL` | `COALESCE(field, 'fallback')` |
| Missing **OR** empty string `""` | `COALESCE(TRIM(field), '') = ''` |
| Node is absent **OR** has value `NULL` | `field IS NULL` |
| Node is present even if empty/null | `EXISTS(field[])` |
| Assigning `NULL` to an `OutputRoot` field | **Deletes** that field from the output tree! |

> [!TIP]
> Assigning `SET OutputRoot.JSON.Data.temp = NULL;` does **not** write `"temp": null` — in ESQL, setting a tree element to `NULL` **removes** it from the tree! (To output a literal JSON `null`, use `SET OutputRoot.JSON.Data.temp TYPE = JSON.Null; SET OutputRoot.JSON.Data.temp = NULL;` or `CREATE LASTCHILD OF ... TYPE JSON.Null NAME 'temp' VALUE NULL;`.)

---

**Next:** [XMLNSC vs JSON Trees, Attributes & Arrays →](#topic-226)
