---
id: topic-198
slug: esql-task-2-aggregate-transactions
topicNumber: 198
title: "Task 2: Total & Aggregate Paid Transactions"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'ESQL Solved Tasks & Practice'
versionBadge: 'ACE 12 / 13'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Solved ACE task: iterate a JSON transaction array with REFERENCE/MOVE and compute total count, PAID sum, and largest amount."
object: "Task 2: Aggregation"
action: "Aggregate Array"
commandName: "Aggregate Transactions ESQL"
synonyms:
  - "total paid transactions esql"
  - "task 2 aggregation esql"
  - "sum count max json array esql"
  - "move nextsibling json array"
---

# Task 2: Total & Aggregate Paid Transactions

**Technique:** Single-pass array aggregation (`count`, conditional `sum`, and `max`) using **`DECIMAL`** for money and **`REFERENCE` + `MOVE`**.

---

## Problem & Sample Input

From a JSON list of transactions, return the total `count`, the sum of **`PAID`** transactions (`paidTotal`), and the largest amount (`maxAmount`):

```json
{
  "items": [
    { "status": "PAID",    "amount": 150.75 },
    { "status": "PAID",    "amount": 200.00 },
    { "status": "PENDING", "amount": 90.00 }
  ]
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

        DECLARE total  DECIMAL 0;
        DECLARE maxAmt DECIMAL 0;
        DECLARE cnt    INTEGER 0;
        DECLARE amt    DECIMAL 0;
        DECLARE t      REFERENCE TO InputRoot.JSON.Data.items.Item[1];

        WHILE LASTMOVE(t) DO
            SET cnt = cnt + 1;
            SET amt = CAST(COALESCE(t.amount, 0) AS DECIMAL DEFAULT 0);

            IF t.status = 'PAID' THEN
                SET total = total + amt;
            END IF;

            IF amt > maxAmt THEN
                SET maxAmt = amt;
            END IF;

            MOVE t NEXTSIBLING;
        END WHILE;

        SET OutputRoot.JSON.Data.count     = cnt;
        SET OutputRoot.JSON.Data.paidTotal = ROUND(total, 2);
        SET OutputRoot.JSON.Data.maxAmount = ROUND(maxAmt, 2);

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected JSON Output</summary>

```json
{
  "count": 3,
  "paidTotal": 350.75,
  "maxAmount": 200.00
}
```

</details>

### Line-by-Line Breakdown

- **`DECLARE total DECIMAL 0;` / `DECLARE maxAmt DECIMAL 0;`**: Always choose **`DECIMAL`** (never `FLOAT`) for financial totals so binary floating-point rounding drift (`0.1 + 0.2 = 0.30000000000000004`) never happens.
- **`DECLARE cnt INTEGER 0;`**: Counts every transaction (`3` total, including non-`PAID` items).
- **`DECLARE t REFERENCE TO InputRoot.JSON.Data.items.Item[1];`**: Points cursor `t` to the first entry of `items`. If `items` is empty or missing, `LASTMOVE(t)` starts as `FALSE`, so the flow safely returns `{"count": 0, "paidTotal": 0, "maxAmount": 0}`.
- **`WHILE LASTMOVE(t) DO ... END WHILE;`**: Loops through all items in one linear $O(N)$ pass.
- **`SET cnt = cnt + 1;`**: Increments total transaction count for every element visited.
- **`SET amt = CAST(COALESCE(t.amount, 0) AS DECIMAL DEFAULT 0);`**: Normalizes `t.amount` once per loop pass into `DECIMAL` (handling numbers, quoted numeric strings like `"150.75"`, or missing values cleanly).
- **`IF t.status = 'PAID' THEN SET total = total + amt; END IF;`**: Adds `amt` to `paidTotal` **only** when `status` equals `'PAID'` (so the `PENDING` `90.00` is counted in `count` but excluded from `paidTotal`).
- **`IF amt > maxAmt THEN SET maxAmt = amt; END IF;`**: Tracks the largest transaction amount across all items (`200.00`).
- **`MOVE t NEXTSIBLING;`**: Moves `t` to the next `Item` inside the `JSON.Array` container. Because every child of a `JSON.Array` has the same name `Item`, bare `NEXTSIBLING` (or `NEXTSIBLING REPEAT TYPE NAME`) advances straight to the next array entry.
- **`SET OutputRoot.JSON.Data.count = cnt;` ...**: Writes all three summary properties (`count`, `paidTotal`, `maxAmount`) to the JSON response object.

> [!TIP]
> Notice why we saved `amt` into a local `DECIMAL` variable once per iteration instead of writing `CAST(t.amount AS DECIMAL)` three times: it keeps ESQL shorter, avoids repeated casting, and protects against `NULL` with `COALESCE(..., 0)` + `DEFAULT 0`.

---

**Next:** [Task 3: Mask a Card Number & Reformat Dates →](#topic-199)
