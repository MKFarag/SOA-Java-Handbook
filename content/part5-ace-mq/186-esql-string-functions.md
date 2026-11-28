---
id: topic-186
slug: esql-string-functions
topicNumber: 186
title: "ESQL String Functions (SUBSTRING, TRIM, LEFT, RIGHT, REPLICATE)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Slice, trim, search, replace, repeat, pad, and concatenate strings in ESQL with 1-based string functions."
object: "String Functions"
action: "Manipulate Text"
commandName: "SUBSTRING TRIM POSITION REPLACE LEFT RIGHT REPLICATE"
synonyms:
  - "esql string functions"
  - "substring from for esql"
  - "left right replicate esql"
  - "position in esql"
  - "string concatenation || esql"
---

# ESQL String Functions (`SUBSTRING`, `TRIM`, `LEFT`, `RIGHT`, `REPLICATE`)

ESQL includes a rich set of built-in string functions. Remember two golden rules: **string positions start at `1`** (not `0`), and joining strings uses **`||`** where a `NULL` on either side turns the entire result into `NULL`.

---

## Everyday ESQL String Functions

| Function | Example | Result |
| :--- | :--- | :--- |
| **`\|\|`** *(Concat)* | `'ORD-' \|\| '2026'` | `'ORD-2026'` *(returns `NULL` if either side is `NULL`)* |
| **`SUBSTRING`** | `SUBSTRING('ORD-2026' FROM 5 FOR 4)` | `'2026'` *(1-based start; `FOR` is optional)* |
| **`TRIM` / `UPPER`** | `UPPER(TRIM(' egp '))` | `'EGP'` *(removes leading/trailing spaces, then uppercases)* |
| **`LOWER`** | `LOWER('ABC')` | `'abc'` |
| **`POSITION`** | `POSITION('@' IN 'a@b.com')` | `2` *(`0` if substring is not found)* |
| **`REPLACE`** | `REPLACE('01-02-03', '-', '')` | `'010203'` |
| **`LENGTH`** | `LENGTH('ACE')` | `3` |
| **`LEFT` / `RIGHT`** | `LEFT('5123451234', 6)` / `RIGHT('5123451234', 4)` | `'512345'` / `'1234'` |
| **`REPLICATE`** | `REPLICATE('*', 6)` | `'******'` |
| **`TRANSLATE`** | `TRANSLATE('010abc', '0123456789', '')` | `'abc'` *(strips/maps characters in position order)* |

---

## Fast Example: Clean Email, Extract Domain & Mask Card Prefix

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE rawEmail   CHARACTER COALESCE(InputRoot.JSON.Data.email, '');
        DECLARE cleanEmail CHARACTER LOWER(TRIM(rawEmail));
        DECLARE atPos      INTEGER   POSITION('@' IN cleanEmail);
        DECLARE rawCard    CHARACTER TRIM(COALESCE(InputRoot.JSON.Data.card, ''));
        DECLARE cardLen    INTEGER   LENGTH(rawCard);

        SET OutputRoot.JSON.Data.email    = cleanEmail;
        SET OutputRoot.JSON.Data.currency = UPPER(TRIM(' egp '));
        SET OutputRoot.JSON.Data.year     = SUBSTRING('ORD-2026' FROM 5 FOR 4);

        IF atPos > 0 THEN
            SET OutputRoot.JSON.Data.domain = SUBSTRING(cleanEmail FROM atPos + 1);
        ELSE
            SET OutputRoot.JSON.Data.domain = '';
        END IF;

        IF cardLen > 10 THEN
            SET OutputRoot.JSON.Data.maskedCard =
                LEFT(rawCard, 6) || REPLICATE('*', cardLen - 10) || RIGHT(rawCard, 4);
        END IF;

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (Input: {"email":"  Mona@Example.COM  ","card":"5123451234561234"})</summary>

```json
{
  "email": "mona@example.com",
  "currency": "EGP",
  "year": "2026",
  "domain": "example.com",
  "maskedCard": "512345******1234"
}
```

</details>

### Line-by-Line Breakdown

- **`LOWER(TRIM(rawEmail))`**: `TRIM(...)` strips leading and trailing spaces (`'  Mona@Example.COM  '` -> `'Mona@Example.COM'`), and `LOWER(...)` converts all letters to lowercase (`'mona@example.com'`).
- **`POSITION('@' IN cleanEmail)`**: Searches for `'@'` inside `cleanEmail` and returns its **1-based** character position (`5` here). If not found, `POSITION` returns `0`.
- **`SUBSTRING('ORD-2026' FROM 5 FOR 4)`**: Uses SQL keywords **`FROM`** and **`FOR`** (not commas!) to start at character `5` (`'2'`) and take `4` characters -> `'2026'`.
- **`SUBSTRING(cleanEmail FROM atPos + 1)`**: When `FOR` is omitted, `SUBSTRING` returns everything from `atPos + 1` through the end of the string (`'example.com'`). Guarding with `IF atPos > 0` prevents accidentally returning the entire string when `'@'` is missing (`0 + 1 = 1`).
- **`LENGTH(rawCard)`**: Counts the total number of characters (`16` for a standard card number).
- **`LEFT(rawCard, 6) || REPLICATE('*', cardLen - 10) || RIGHT(rawCard, 4)`**: Takes the first 6 characters (`'512345'`), generates `16 - 10 = 6` asterisks (`'******'`) using `REPLICATE`, takes the last 4 characters (`'1234'`), and joins all three pieces with `||`. Guarding with `IF cardLen > 10` avoids passing a negative repeat count to `REPLICATE`!

> [!TIP]
> Notice **`SUBSTRING(str FROM start FOR len)`** and **`POSITION(needle IN haystack)`** use SQL keyword syntax (`FROM`/`FOR` and `IN`) rather than comma-separated arguments. And **`TRANSLATE(str, fromChars, toChars)`** is super handy for checking whether a string contains digits only (`TRANSLATE(s, '0123456789', '') = ''`).

---

**Next:** [ESQL CAST Type Conversions & Math Functions →](#topic-187)
