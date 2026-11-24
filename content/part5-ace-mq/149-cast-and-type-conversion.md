---
id: topic-149
slug: cast-and-type-conversion
topicNumber: 149
title: "CAST and Type Conversion"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Convert between characters, numbers, and dates using CAST with custom format masks."
object: "Type Conversion"
action: "CAST"
commandName: "CAST"
synonyms:
  - "cast"
  - "type conversion"
  - "convert string to integer"
  - "format date"
  - "format timestamp"
---

Converts data between incompatible ESQL types (e.g. converting numeric strings to integers or dates to text).
Use `CAST` to parse incoming string numbers into arithmetic values or format dates for external web services.

```esql
CAST(<Expression> AS <TargetType> [FORMAT <FormatPattern>])
```

| Conversion | ESQL Statement | Result |
| :--- | :--- | :--- |
| **String to Integer** | `CAST('125' AS INTEGER)` | `125` |
| **Number to String** | `CAST(125 AS CHARACTER)` | `'125'` |
| **Date to String** | `CAST(CURRENT_DATE AS CHARACTER FORMAT 'yyyyMMdd')` | `'20261124'` |
| **String to Timestamp** | `CAST('2026-11-24' AS TIMESTAMP FORMAT 'yyyy-MM-dd')` | Timestamp value |

```json
{ "id": "100", "price": "25.50" }
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
-- Cast string representations into true JSON numbers
SET OutputRoot.JSON.Data.id = CAST(InputRoot.JSON.Data.id AS INTEGER);
SET OutputRoot.JSON.Data.price = CAST(InputRoot.JSON.Data.price AS DECIMAL);
```

```json
{
  "id": 100,
  "price": 25.50
}
```

* **CAST Exceptions:** If a string contains invalid characters (e.g. `CAST('ABC' AS INTEGER)`), ACE throws error `BIP2456E`.
* **DateFormat Tokens:** ESQL date format tokens: `yyyy` = 4-digit year, `MM` = 2-digit month, `dd` = 2-digit day, `HH` = 24-hr, `mm` = minute, `ss` = second.
* **NULL Safety:** Casting `NULL` returns `NULL` without throwing an error.

* [Built-in Functions](#topic-148)
* [Variables, Data Types, and Constants](#topic-142)
* [Throw and Handle Errors (ExceptionList)](#topic-153)
