---
id: topic-184
slug: esql-if-case-loops
topicNumber: 184
title: "ESQL Control Flow: IF, CASE & Loops (WHILE, FOR, LOOP, REPEAT)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Beginner
readingTime: 4 min read
shortDescription: "Branch logic with IF/ELSEIF/ELSE and CASE, and iterate using WHILE, FOR ... AS ...[], labelled LOOP, REPEAT...UNTIL, LEAVE, and ITERATE."
object: "Control Flow"
action: "Branch & Loop"
commandName: "IF CASE WHILE FOR LOOP REPEAT LEAVE"
synonyms:
  - "esql if elseif"
  - "esql case when"
  - "esql while for loop"
  - "esql labelled loop leave"
  - "esql repeat until iterate"
---

# ESQL Control Flow: `IF`, `CASE` & Loops (`WHILE`, `FOR`, `LOOP`, `REPEAT`)

ESQL provides procedural branching (`IF`, `CASE`) and four loop constructs (`WHILE`, `FOR`, `LOOP`, `REPEAT`). Every block must close explicitly with its matching `END ...;` keyword.

---

## Example 1: Branching with `IF / ELSEIF / ELSE` and `CASE`

```esql
DECLARE amt  DECIMAL   COALESCE(InputRoot.JSON.Data.amount, 0);
DECLARE code CHARACTER COALESCE(InputRoot.JSON.Data.code, '');
DECLARE level CHARACTER;
DECLARE txt   CHARACTER;
DECLARE tag   CHARACTER;

-- 1. IF / ELSEIF / ELSE
IF amt > 10000 THEN
    SET level = 'HIGH';
ELSEIF amt > 1000 THEN
    SET level = 'MEDIUM';
ELSE
    SET level = 'LOW';
END IF;

-- 2. Simple CASE expression (matches one expression against values)
SET txt = CASE code
    WHEN 'A' THEN 'Active'
    WHEN 'C' THEN 'Closed'
    ELSE 'Unknown'
END;

-- 3. Searched CASE expression (evaluates arbitrary boolean conditions)
SET tag = CASE
    WHEN amt >= 50000 THEN 'APPROVAL_REQUIRED'
    WHEN amt > 0      THEN 'STANDARD'
    ELSE 'INVALID'
END;

SET OutputRoot.JSON.Data.level = level;
SET OutputRoot.JSON.Data.txt   = txt;
SET OutputRoot.JSON.Data.tag   = tag;
```

<details data-type="output">
<summary>Expected Output (Input: {"amount": 2500, "code": "A"})</summary>

```json
{
  "level": "MEDIUM",
  "txt": "Active",
  "tag": "STANDARD"
}
```

</details>

### Line-by-Line Breakdown (`IF` & `CASE`)

- **`IF amt > 10000 THEN ... ELSEIF ... ELSE ... END IF;`**: Notice **`ELSEIF`** is one single word in ESQL (not `ELSE IF`!), and the block closes with **`END IF;`** plus a semicolon.
- **`SET txt = CASE code WHEN 'A' THEN 'Active' ... END;`**: **Simple `CASE` expression** compares `code` for equality against each `WHEN` branch and returns a single expression value (`'Active'`, `'Closed'`, or `'Unknown'`). An inline `CASE` expression closes with **`END`**, whereas a standalone statement-form `CASE ... END CASE;` can execute multi-line statements.
- **`SET tag = CASE WHEN amt >= 50000 THEN ... END;`**: **Searched `CASE` expression** omits the selector after `CASE` and checks full boolean conditions (`>=`, `>`, `AND`, `IS NULL`) in each `WHEN` clause.

---

## Choosing the Right Loop in ESQL

| Loop Construct | Condition Checked | Best For |
| :--- | :--- | :--- |
| **`FOR item AS <List>[] DO ... END FOR;`** | Once per matching child | Iterating repeating XML/JSON array elements cleanly with no counter |
| **`WHILE <Cond> DO ... END WHILE;`** | **Before** each pass | Counting (`i <= 3`) or walking `REFERENCE` pointers (`WHILE LASTMOVE(r)`) |
| **`L1: LOOP ... END LOOP L1;`** | Manual (`LEAVE L1;`) | Mid-loop exit checks or state loops exited explicitly with `LEAVE` |
| **`REPEAT ... UNTIL <Cond> END REPEAT;`** | **After** each pass | Logic that **must execute at least once** before checking exit condition |

---

## Example 2: `WHILE`, `FOR`, Labelled `LOOP`, `LEAVE` & `ITERATE`

```esql
DECLARE i     INTEGER 1;
DECLARE sumI  INTEGER 0;
DECLARE total DECIMAL 0;
DECLARE step  INTEGER 0;
DECLARE done  BOOLEAN FALSE;

-- 1. Counter WHILE loop
WHILE i <= 3 DO
    SET sumI = sumI + i;
    SET i = i + 1;
END WHILE;

-- 2. FOR loop over repeating JSON array items (with ITERATE & LEAVE)
ITEM_LOOP: FOR item AS InputRoot.JSON.Data.items.Item[] DO
    IF COALESCE(item.skip, FALSE) = TRUE THEN
        ITERATE ITEM_LOOP; -- skip this item (like 'continue')
    END IF;
    SET total = total + COALESCE(item.amount, 0);
    IF total > 10000 THEN
        LEAVE ITEM_LOOP;   -- stop loop early (like 'break')
    END IF;
END FOR ITEM_LOOP;

-- 3. Labelled LOOP exited with LEAVE
L1: LOOP
    SET step = step + 1;
    IF step >= 2 THEN
        SET done = TRUE;
    END IF;
    IF done THEN LEAVE L1; END IF;
END LOOP L1;

-- 4. REPEAT ... UNTIL (runs at least once)
DECLARE tries INTEGER 0;
REPEAT
    SET tries = tries + 1;
UNTIL tries >= 2
END REPEAT;

SET OutputRoot.JSON.Data.sumI  = sumI;
SET OutputRoot.JSON.Data.total = total;
SET OutputRoot.JSON.Data.step  = step;
SET OutputRoot.JSON.Data.tries = tries;
```

<details data-type="output">
<summary>Expected Output (Input: {"items":[{"amount":120},{"amount":999,"skip":true},{"amount":80}]})</summary>

```json
{
  "sumI": 6,
  "total": 200,
  "step": 2,
  "tries": 2
}
```

</details>

### Line-by-Line Breakdown (Loops)

- **`WHILE i <= 3 DO ... SET i = i + 1; END WHILE;`**: Repeats while `i <= 3` is `TRUE` (runs for `i = 1, 2, 3`, producing `sumI = 6`).
- **`ITEM_LOOP: FOR item AS InputRoot.JSON.Data.items.Item[] DO`**: Attaches optional label **`ITEM_LOOP:`** to the `FOR` loop. On each iteration, ESQL automatically declares **`item`** as a `REFERENCE` pointing to the current `Item` element (you do **not** declare `item` at the top!).
- **`ITERATE ITEM_LOOP;`**: Skips the rest of the current iteration and jumps straight to the next array item (equivalent to `continue` in Java).
- **`LEAVE ITEM_LOOP;`**: Exits the labelled loop immediately (equivalent to `break` in Java).
- **`END FOR ITEM_LOOP;`**: Closes the labelled `FOR` loop; when a label is present at the start, repeat it after `END FOR` / `END LOOP`.
- **`L1: LOOP ... IF done THEN LEAVE L1; END IF; END LOOP L1;`**: Infinite loop construct until **`LEAVE L1;`** is hit — useful when exit logic sits in the middle or end of the loop body.
- **`REPEAT ... UNTIL tries >= 2 END REPEAT;`**: Executes the body first, then stops when the `UNTIL` condition evaluates to **`TRUE`** (opposite of `WHILE`, which continues while `TRUE`). Notice there is NO semicolon on the `UNTIL` line itself — the semicolon goes on `END REPEAT;`.

> [!TIP]
> Avoid `WHILE i <= CARDINALITY(list[])` with `list.Item[i]` on large arrays! Use `FOR item AS list.Item[] DO` or `REFERENCE` + `MOVE ... NEXTSIBLING` so ESQL never re-walks from `[1]` on every pass.

---

**Next:** [ESQL REFERENCE Pointers, MOVE & LASTMOVE (Fast Loops) →](#topic-185)
