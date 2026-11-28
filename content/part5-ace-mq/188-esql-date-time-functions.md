---
id: topic-188
slug: esql-date-time-functions
topicNumber: 188
title: "ESQL Date & Time Functions (CURRENT_DATE, TIMESTAMP & FORMAT)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Read system dates/timestamps, parse custom date strings like dd/MM/yyyy, reformat to ISO strings with CAST ... FORMAT, and add INTERVAL values."
object: "Date & Time"
action: "Parse & Format Dates"
commandName: "CURRENT_DATE CURRENT_TIMESTAMP CAST FORMAT INTERVAL"
synonyms:
  - "esql date format"
  - "current_date current_timestamp esql"
  - "cast timestamp format dd/MM/yyyy"
  - "esql escaped single quote ''T''"
  - "interval day esql"
---

# ESQL Date & Time Functions (`CURRENT_DATE`, `TIMESTAMP` & `FORMAT`)

ESQL provides built-in clock values (**`CURRENT_DATE`**, **`CURRENT_TIMESTAMP`**, **`CURRENT_GMTTIMESTAMP`**) and uses **`CAST(... AS ... FORMAT '...')`** both to **parse** incoming date text into a `DATE`/`TIMESTAMP` and to **format** dates into outgoing strings.

---

## Common Date & Time Format Tokens

| Pattern Token | Meaning | Example Value |
| :--- | :--- | :--- |
| **`yyyy`** | 4-digit year | `2026` |
| **`MM`** *(uppercase!)* | 2-digit month (`01`–`12`) | `11` |
| **`dd`** | 2-digit day of month (`01`–`31`) | `26` |
| **`HH`** *(uppercase!)* | 24-hour clock (`00`–`23`) | `21` |
| **`mm`** *(lowercase!)* | Minutes (`00`–`59`) | `30` |
| **`ss`** | Seconds (`00`–`59`) | `00` |
| **`'IU'`** *(shorthand)* | Built-in ISO-8601 UTC format | `2026-11-26T19:30:00Z` |

---

## Example: Parsing, Reformatting, Timestamps & Date Arithmetic

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        -- 1. Format today's date as dd/MM/yyyy
        SET OutputRoot.JSON.Data.todayUk =
            CAST(CURRENT_DATE AS CHARACTER FORMAT 'dd/MM/yyyy');

        -- 2. Parse an incoming 'dd/MM/yyyy' string into DATE, then reformat to ISO
        DECLARE d DATE CAST(InputRoot.JSON.Data.txnDate AS DATE FORMAT 'dd/MM/yyyy');
        SET OutputRoot.JSON.Data.isoDate =
            CAST(d AS CHARACTER FORMAT 'yyyy-MM-dd');

        -- 3. Add 7 days using INTERVAL
        DECLARE dueDate DATE d + INTERVAL '7' DAY;
        SET OutputRoot.JSON.Data.dueDate =
            CAST(dueDate AS CHARACTER FORMAT 'yyyy-MM-dd');

        -- 4. Format local timestamp with literal 'T' (note double single-quotes ''T'')
        SET OutputRoot.JSON.Data.processedAt =
            CAST(CURRENT_TIMESTAMP AS CHARACTER FORMAT 'yyyy-MM-dd''T''HH:mm:ss');

        -- 5. Format UTC timestamp using built-in 'IU' shorthand
        SET OutputRoot.JSON.Data.utcIso =
            CAST(CURRENT_GMTTIMESTAMP AS CHARACTER FORMAT 'IU');

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (Input: {"txnDate": "26/11/2026"})</summary>

```json
{
  "todayUk": "26/11/2026",
  "isoDate": "2026-11-26",
  "dueDate": "2026-12-03",
  "processedAt": "2026-11-26T21:30:00",
  "utcIso": "2026-11-26T19:30:00Z"
}
```

</details>

### Line-by-Line Breakdown

- **`CAST(CURRENT_DATE AS CHARACTER FORMAT 'dd/MM/yyyy')`**: Reads the broker's current date (`DATE`) and formats it as `'26/11/2026'`.
- **`DECLARE d DATE CAST(InputRoot.JSON.Data.txnDate AS DATE FORMAT 'dd/MM/yyyy');`**: **Step 1 of reformatting a date string** — parses `'26/11/2026'` into a real ESQL `DATE` object using the input pattern `'dd/MM/yyyy'`. You cannot go straight from `'dd/MM/yyyy'` string to `'yyyy-MM-dd'` string in a single `CAST`; parse to `DATE` first, then format back to `CHARACTER`.
- **`CAST(d AS CHARACTER FORMAT 'yyyy-MM-dd')`**: **Step 2** — converts the `DATE` value into ISO-8601 date text `'2026-11-26'`.
- **`d + INTERVAL '7' DAY`**: Adds an ESQL `INTERVAL` (`DAY`, `MONTH`, `YEAR`, `HOUR`, `MINUTE`, `SECOND`) directly to a `DATE` or `TIMESTAMP` (`2026-11-26` + 7 days = `2026-12-03`).
- **`'yyyy-MM-dd''T''HH:mm:ss'`**: In ESQL string literals, two consecutive single quotes **`''`** escape a literal single quote inside the pattern. ACE's formatter requires literal characters like `T` to be quoted inside the format pattern (`'T'`), so inside an ESQL string literal you write **`''T''`**.
- **`CAST(CURRENT_GMTTIMESTAMP AS CHARACTER FORMAT 'IU')`**: Uses ACE's built-in `'IU'` (ISO-8601 UTC) format specifier to emit a UTC timestamp ending in `Z`.

> [!WARNING]
> **`MM` vs `mm` is the #1 date formatting bug!** Uppercase **`MM`** is the month (`01`–`12`), while lowercase **`mm`** is minutes (`00`–`59`). Writing `'yyyy-mm-dd'` puts minutes where the month belongs!

---

**Next:** [ESQL SELECT on Message Trees (SELECT ITEM, THE & COUNT) →](#topic-189)
