---
id: topic-231
slug: esql-cast-and-math-functions
topicNumber: 231
title: "CAST Type Conversions & Math Functions"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Convert types safely using CAST(... AS ... DEFAULT ...), encode/decode BLOBs with CCSID, and calculate values with ROUND, ABS, MOD, CEIL, and FLOOR."
object: "CAST & Math"
action: "Convert & Compute"
commandName: "CAST DEFAULT ROUND ABS MOD"
synonyms:
  - "cast esql"
  - "cast default fallback esql"
  - "round mod abs ceil floor esql"
  - "bip2456e cast error"
  - "cast blob ccsid 1208"
---

# `CAST` Type Conversions & Math Functions

ESQL is **strongly typed** — you cannot silently add `'10'` (a `CHARACTER` from XML) to integer `5`. Use **`CAST`** to convert data types explicitly (with **`DEFAULT`** to guard against dirty input) and built-in math functions for financial rounding and calculations.

---

## `CAST` Syntax & Common Conversions

```esql
CAST(<Expression> AS <TargetType> [CCSID <CodePage>] [FORMAT <Pattern>] [DEFAULT <Fallback>])
```

| Conversion | ESQL Example | Result |
| :--- | :--- | :--- |
| String -> Integer | `CAST('42' AS INTEGER)` | `42` |
| String -> Decimal | `CAST('19.95' AS DECIMAL)` | `19.95` |
| Number -> String | `CAST(42 AS CHARACTER)` | `'42'` |
| String -> Boolean | `CAST('true' AS BOOLEAN)` | `TRUE` |
| Text -> UTF-8 BLOB | `CAST('hello' AS BLOB CCSID 1208)` | `BLOB` bytes (`X'68656C6C6F'`) |
| BLOB -> UTF-8 Text | `CAST(InputRoot.BLOB.BLOB AS CHARACTER CCSID 1208)` | `'hello'` |
| Format Decimal | `CAST(19.5 AS CHARACTER FORMAT '0.00')` | `'19.50'` |
| Safe dirty-input cast | `CAST('bad' AS INTEGER DEFAULT 0)` | `0` *(prevents `BIP2456E`)* |

---

## Essential Math Functions

| Function | Purpose | Example | Result |
| :--- | :--- | :--- | :--- |
| **`ROUND(x, n)`** | Round `x` to `n` decimal places | `ROUND(10.556, 2)` | `10.56` |
| **`ABS(x)`** | Absolute (non-negative) value | `ABS(-45)` | `45` |
| **`MOD(a, b)`** | Remainder after integer division | `MOD(10, 3)` | `1` |
| **`CEIL(x)` / `FLOOR(x)`** | Round up / down to nearest whole number | `CEIL(4.2)` / `FLOOR(4.8)` | `5` / `4` |

---

## Example: Safe Casting, Rounding & Tax Calculation

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE unitPrice DECIMAL CAST(COALESCE(InputRoot.JSON.Data.price, '0') AS DECIMAL DEFAULT 0.00);
        DECLARE qty       INTEGER CAST(COALESCE(InputRoot.JSON.Data.qty, '1')   AS INTEGER DEFAULT 0);
        DECLARE subtotal  DECIMAL ROUND(unitPrice * qty, 2);
        DECLARE tax       DECIMAL ROUND(subtotal * 0.14, 2);

        SET OutputRoot.JSON.Data.subtotal  = subtotal;
        SET OutputRoot.JSON.Data.tax       = tax;
        SET OutputRoot.JSON.Data.remainder = MOD(qty, 2);
        SET OutputRoot.JSON.Data.label     = CAST(subtotal AS CHARACTER FORMAT '0.00');

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (Input: {"price": "19.95", "qty": "3"})</summary>

```json
{
  "subtotal": 59.85,
  "tax": 8.38,
  "remainder": 1,
  "label": "59.85"
}
```

</details>

### Line-by-Line Breakdown

- **`CAST(COALESCE(InputRoot.JSON.Data.price, '0') AS DECIMAL DEFAULT 0.00)`**:
  1. `COALESCE(..., '0')` handles missing or `NULL` input.
  2. `AS DECIMAL` converts `'19.95'` into an exact fixed-point `DECIMAL` (`19.95`).
  3. **`DEFAULT 0.00`** acts as a safety net: if the caller sent `"price": "N/A"`, `CAST` returns `0.00` instead of crashing the Compute node with **`BIP2456E`** (*Invalid cast*).
- **`CAST(COALESCE(InputRoot.JSON.Data.qty, '1') AS INTEGER DEFAULT 0)`**: Parses quantity as an `INTEGER`, falling back to `0` if non-numeric.
- **`ROUND(unitPrice * qty, 2)`**: Multiplies `19.95 * 3 = 59.85` and rounds to `2` decimal places.
- **`ROUND(subtotal * 0.14, 2)`**: Calculates 14% VAT (`8.379`) and rounds cleanly to `8.38`.
- **`MOD(qty, 2)`**: Returns the integer remainder (`3 mod 2 = 1`) — useful for batching or odd/even checks.
- **`CAST(subtotal AS CHARACTER FORMAT '0.00')`**: Converts `DECIMAL` to a fixed two-decimal string `'59.85'` (useful when XML or fixed-width DFDL outputs require trailing zeros like `'19.50'`).

> [!WARNING]
> **Watch out for dirty input data!** Never write bare `CAST(InputRoot.JSON.Data.qty AS INTEGER)` on unvalidated external requests — any typo like `"qty": "abc"` throws **`BIP2456E`**. Always add **`DEFAULT <fallback>`** or validate explicitly first.

---

**Next:** [Date & Time Functions (CURRENT_DATE, TIMESTAMP & FORMAT) →](#topic-232)
