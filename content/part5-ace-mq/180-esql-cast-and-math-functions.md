---
id: topic-180
slug: esql-cast-and-math-functions
topicNumber: 180
title: "CAST Type Conversions & Math Functions (ROUND, MOD, ABS)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Convert strings, numbers, booleans, and BLOBs cleanly with CAST(), and calculate totals using ROUND, MOD, ABS, CEIL, and FLOOR."
object: "CAST & Math"
action: "Convert & Compute"
commandName: "CAST ROUND MOD ABS"
synonyms:
  - "cast esql"
  - "cast string to integer esql"
  - "round mod abs ceil floor esql"
  - "bip2456e cast error"
---

# CAST Type Conversions & Math Functions (`ROUND`, `MOD`, `ABS`)

ESQL is **strongly typed** — adding a string `'10'` to integer `5` doesn't work automatically like JavaScript. Use **`CAST(<Expr> AS <Type>)`** to convert values safely, and built-in math functions for financial rounding.

---

## Common `CAST` Conversions

```esql
CAST(<Expression> AS <TargetType> [CCSID <CodePage>] [FORMAT <Pattern>])
```

| Need | ESQL Example | Result |
| :--- | :--- | :--- |
| String -> Integer | `CAST('42' AS INTEGER)` | `42` |
| String -> Decimal | `CAST('19.95' AS DECIMAL)` | `19.95` |
| Number -> String | `CAST(42 AS CHARACTER)` | `'42'` |
| String -> Boolean | `CAST('true' AS BOOLEAN)` | `TRUE` |
| Text -> UTF-8 BLOB | `CAST('hello' AS BLOB CCSID 1208)` | `BLOB` bytes |
| BLOB -> UTF-8 Text | `CAST(InputRoot.BLOB.BLOB AS CHARACTER CCSID 1208)` | `'hello'` |
| Format Decimal | `CAST(19.5 AS CHARACTER FORMAT '0.00')` | `'19.50'` |

---

## Essential Math Functions

| Function | Description | Example | Result |
| :--- | :--- | :--- | :--- |
| **`ROUND(x, n)`** | Round to `n` decimals *(uses exact `ROUND_HALF_UP` option too)* | `ROUND(10.556, 2)` | `10.56` |
| **`ABS(x)`** | Absolute positive value | `ABS(-45)` | `45` |
| **`MOD(a, b)`** | Remainder after integer division | `MOD(10, 3)` | `1` |
| **`CEIL(x)` / `FLOOR(x)`** | Round up / down to whole integer | `CEIL(4.2)` | `5` |

---

## Fast Example (Sanitize String Price & Round Tax)

```esql
DECLARE unitPrice DECIMAL CAST(COALESCE(InputRoot.JSON.Data.price, '0') AS DECIMAL);
DECLARE qty       INTEGER CAST(COALESCE(InputRoot.JSON.Data.qty, '1') AS INTEGER);

SET OutputRoot.JSON.Data.subtotal = ROUND(unitPrice * qty, 2);
SET OutputRoot.JSON.Data.tax      = ROUND(unitPrice * qty * 0.14, 2);
```

<details data-type="output">
<summary>Expected Output (Input: price="19.95", qty="3")</summary>

```json
{
  "subtotal": 59.85,
  "tax": 8.38
}
```

</details>

> [!WARNING]
> **Prevent `BIP2456E` crashes on dirty data:** `CAST('abc' AS INTEGER)` throws runtime error `BIP2456E`. Always wrap uncertain input strings in **`CAST(... AS INTEGER DEFAULT 0)`**! Using `DEFAULT <fallback>` returns the safe default instead of throwing an exception!

---

**Next:** [String Functions (TRIM, SUBSTRING, REPLACE) →](#topic-181)
