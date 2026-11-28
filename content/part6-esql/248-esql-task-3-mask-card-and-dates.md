---
id: topic-248
slug: esql-task-3-mask-card-and-dates
topicNumber: 248
title: "Task 3: Mask a Card Number & Reformat Dates"
part: 'Part 6: ESQL'
sectionNumber: 47
sectionTitle: 'Tasks'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Solved ACE task: mask a PAN keeping first 6 and last 4 digits (LEFT/REPLICATE/RIGHT), convert dd/MM/yyyy to ISO yyyy-MM-dd, and format CURRENT_TIMESTAMP."
object: "Task 3: Strings & Dates"
action: "Mask & Format"
commandName: "LEFT REPLICATE RIGHT CAST FORMAT"
synonyms:
  - "mask card number esql"
  - "task 3 strings and dates esql"
  - "replicate asterisk card pan esql"
  - "reformat date dd/MM/yyyy to yyyy-MM-dd esql"
---

# Task 3: Mask a Card Number & Reformat Dates

**Technique:** PCI-safe string masking (**`TRIM`**, **`LENGTH`**, **`LEFT`**, **`REPLICATE`**, **`RIGHT`**) and two-step date parsing + formatting (**`CAST ... AS DATE FORMAT`** -> **`CAST ... AS CHARACTER FORMAT`**).

---

## Problem & Sample Input

Never log or expose a full payment card number: keep only the **first 6** and **last 4** digits, masking the middle digits with `*`. Also convert `26/11/2026` (`dd/MM/yyyy`) into ISO `2026-11-26` and attach a processing timestamp:

```json
{
  "cardNumber": " 5123451234561234 ",
  "txnDate": "26/11/2026"
}
```

---

## Complete Compute Module Solution

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        -- 1. Mask card number (keep first 6 and last 4 digits)
        DECLARE card CHARACTER TRIM(COALESCE(InputRoot.JSON.Data.cardNumber, ''));
        DECLARE n    INTEGER   LENGTH(card);

        IF n > 10 THEN
            SET OutputRoot.JSON.Data.maskedCard =
                LEFT(card, 6) || REPLICATE('*', n - 10) || RIGHT(card, 4);
        ELSE
            SET OutputRoot.JSON.Data.maskedCard = REPLICATE('*', n);
        END IF;

        -- 2. Parse dd/MM/yyyy into DATE, then format as ISO yyyy-MM-dd
        DECLARE d DATE CAST(InputRoot.JSON.Data.txnDate AS DATE FORMAT 'dd/MM/yyyy');
        SET OutputRoot.JSON.Data.txnDate =
            CAST(d AS CHARACTER FORMAT 'yyyy-MM-dd');

        -- 3. Add ISO timestamp (''T'' escapes literal 'T' inside ESQL string)
        SET OutputRoot.JSON.Data.processedAt =
            CAST(CURRENT_TIMESTAMP AS CHARACTER FORMAT 'yyyy-MM-dd''T''HH:mm:ss');

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected JSON Output</summary>

```json
{
  "maskedCard": "512345******1234",
  "txnDate": "2026-11-26",
  "processedAt": "2026-11-26T21:30:00"
}
```

</details>

### Line-by-Line Breakdown

- **`DECLARE card CHARACTER TRIM(COALESCE(InputRoot.JSON.Data.cardNumber, ''));`**: Replaces a missing card field with `''` via `COALESCE` and strips accidental leading/trailing spaces via `TRIM`.
- **`DECLARE n INTEGER LENGTH(card);`**: Measures the exact string length (`16` for a standard Visa/Mastercard, or `15` for Amex).
- **`IF n > 10 THEN`**: Defensive production guard! Since we reveal `6 + 4 = 10` characters, `n - 10` could be negative if a short or malformed string arrives (`REPLICATE('*', -2)` throws a runtime error).
- **`LEFT(card, 6)`**: Extracts the first 6 digits (the BIN/issuer prefix: `'512345'`).
- **`REPLICATE('*', n - 10)`**: Repeats `'*'` for the remaining middle digits (`16 - 10 = 6` -> `'******'`).
- **`RIGHT(card, 4)`**: Extracts the last 4 digits (`'1234'`).
- **`||`**: Joins the three segments into `'512345******1234'`.
- **`DECLARE d DATE CAST(InputRoot.JSON.Data.txnDate AS DATE FORMAT 'dd/MM/yyyy');`**: Parses `'26/11/2026'` according to day/month/year order into an ESQL `DATE` object.
- **`CAST(d AS CHARACTER FORMAT 'yyyy-MM-dd')`**: Formats that `DATE` into ISO-8601 date text (`'2026-11-26'`). Notice `MM` is uppercase (month), not lowercase `mm` (minutes)!
- **`CAST(CURRENT_TIMESTAMP AS CHARACTER FORMAT 'yyyy-MM-dd''T''HH:mm:ss')`**: Formats the broker's current timestamp. Writing **`''T''`** (two single quotes on each side of `T`) puts literal `'T'` inside the format string so it appears cleanly between the date and `HH:mm:ss` (`2026-11-26T21:30:00`).

> [!WARNING]
> **Security Habit:** Mask sensitive card numbers **immediately** before writing anything to `Environment`, audit queues, or `Trace` logs — never leave raw PANs or CVVs in `Environment.Variables`!

---

**Next:** [Task 4: Split a Batch & Route Each Record →](#topic-249)
