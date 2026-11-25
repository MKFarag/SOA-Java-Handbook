---
id: topic-179
slug: esql-string-functions
topicNumber: 179
title: "String Functions (TRIM, SUBSTRING, REPLACE)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Clean whitespace, slice text, replace substrings, change case, and concatenate strings in ESQL."
object: "String Functions"
action: "Manipulate Text"
commandName: "TRIM SUBSTRING REPLACE UPPER"
synonyms:
  - "esql string functions"
  - "trim esql"
  - "substring esql"
  - "replace position esql"
---

# String Functions (TRIM, SUBSTRING, REPLACE)

ESQL gives you built-in string functions — remember string positions are **1-based** and joining strings uses **`||`** (not `+`).

---

## Most Used String Functions

| Function | Purpose | Example | Result |
| :--- | :--- | :--- | :--- |
| **`||`** | Join strings | `'SCB-' || '101'` | `'SCB-101'` |
| **`TRIM(...)`** | Remove spaces (both ends) | `TRIM('  hi  ')` | `'hi'` |
| **`UPPER / LOWER`** | Change case | `UPPER('scb')` | `'SCB'` |
| **`LENGTH(...)`** | Character count | `LENGTH('ACE')` | `3` |
| **`SUBSTRING(...)`** | Extract slice (1-based!) | `SUBSTRING('ORD-995' FROM 5 FOR 3)` | `'995'` |
| **`REPLACE(...)`** | Swap text | `REPLACE('A-B-C', '-', '_')` | `'A_B_C'` |
| **`POSITION(...)`** | Find index (0 if missing) | `POSITION('@' IN 'a@b.com')` | `2` |

---

## Fast Example

```esql
DECLARE rawEmail CHARACTER COALESCE(InputRoot.JSON.Data.email, '');
DECLARE cleanEmail CHARACTER LOWER(TRIM(rawEmail));
DECLARE atPos INTEGER POSITION('@' IN cleanEmail);

SET OutputRoot.JSON.Data.email  = cleanEmail;
SET OutputRoot.JSON.Data.domain = SUBSTRING(cleanEmail FROM atPos + 1);
```

<details data-type="output">
<summary>Expected Output (Input: "  Ali@Bank.COM  ")</summary>

```json
{
  "email": "ali@bank.com",
  "domain": "bank.com"
}
```

</details>

> [!TIP]
> Notice `SUBSTRING(str FROM start FOR length)` uses SQL keywords **`FROM`** and **`FOR`**, not commas!

---

**Next:** [Date & Time Functions (CURRENT_DATE, CAST) →](#topic-180)
