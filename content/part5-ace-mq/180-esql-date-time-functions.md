---
id: topic-180
slug: esql-date-time-functions
topicNumber: 180
title: "Date & Time Functions (CURRENT_DATE, CAST)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Get current timestamps, add intervals, and format or parse date strings with CAST and FORMAT patterns."
object: "Date & Time"
action: "Format Dates"
commandName: "CURRENT_TIMESTAMP CAST FORMAT"
synonyms:
  - "esql date format"
  - "current_timestamp esql"
  - "cast timestamp format"
  - "parse iso date esql"
---

# Date & Time Functions (CURRENT_DATE, CAST)

Use **`CURRENT_TIMESTAMP`** (or `CURRENT_GMTTIMESTAMP` for UTC) and **`CAST(... AS ... FORMAT '...')`** to format or parse dates cleanly in ESQL.

---

## Format Today's Date / Time to String

```esql
DECLARE nowTs TIMESTAMP CURRENT_TIMESTAMP;

SET OutputRoot.JSON.Data.isoUtc     = CAST(CURRENT_GMTTIMESTAMP AS CHARACTER FORMAT 'IU');
SET OutputRoot.JSON.Data.simpleDate = CAST(CURRENT_DATE AS CHARACTER FORMAT 'yyyy-MM-dd');
SET OutputRoot.JSON.Data.stamp      = CAST(nowTs AS CHARACTER FORMAT 'yyyyMMdd_HHmmss');
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "isoUtc": "2026-11-25T09:30:00Z",
  "simpleDate": "2026-11-25",
  "stamp": "20261125_093000"
}
```

</details>

---

## Parse String -> DATE + Add Days

```esql
DECLARE orderDate DATE CAST('2026-11-25' AS DATE FORMAT 'yyyy-MM-dd');
DECLARE dueDate   DATE orderDate + INTERVAL '7' DAY;
SET OutputRoot.JSON.Data.due = CAST(dueDate AS CHARACTER FORMAT 'yyyy-MM-dd');
```

> [!TIP]
> In date patterns: **`MM`** = month (`01-12`), lowercase **`mm`** = minutes (`00-59`), uppercase **`HH`** = 24-hour clock! Mixing up `MM` and `mm` is the most common date formatting bug.

---

**Next:** [IF, CASE & Loops (WHILE, FOR) →](#topic-181)
