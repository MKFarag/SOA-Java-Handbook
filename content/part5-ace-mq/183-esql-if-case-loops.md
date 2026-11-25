---
id: topic-183
slug: esql-if-case-loops
topicNumber: 183
title: "IF, CASE & Loops (FOR, WHILE, REPEAT, LEAVE)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Branch logic with IF/CASE and loop cleanly using FOR, WHILE, REPEAT...UNTIL, plus LEAVE (break) and ITERATE (continue)."
object: "Control Flow"
action: "Branch & Loop"
commandName: "IF CASE FOR WHILE REPEAT LEAVE"
synonyms:
  - "esql if else"
  - "esql case when"
  - "esql for loop"
  - "esql while loop"
  - "esql repeat until leave iterate"
---

# IF, CASE & Loops (`FOR`, `WHILE`, `REPEAT`, `LEAVE`)

ESQL control statements look like SQL procedural blocks — always close them explicitly with `END IF;`, `END CASE;`, `END FOR;`, `END WHILE;`, or `END REPEAT;`.

---

## 1. `IF ... ELSEIF ... ELSE` & Searched `CASE`

```esql
DECLARE amt DECIMAL COALESCE(InputRoot.JSON.Data.amount, 0);

IF amt >= 10000 THEN
    SET OutputRoot.JSON.Data.tier = 'VIP';
ELSEIF amt >= 1000 THEN
    SET OutputRoot.JSON.Data.tier = 'GOLD';
ELSE
    SET OutputRoot.JSON.Data.tier = 'STANDARD';
END IF;

SET OutputRoot.JSON.Data.label = CASE InputRoot.JSON.Data.code
    WHEN 'A' THEN 'ACTIVE'
    WHEN 'C' THEN 'CLOSED'
    ELSE 'UNKNOWN'
END;
```

---

## 2. Picking the Right Loop (`FOR` vs `WHILE` vs `REPEAT`)

| Loop | Best When... | Notes |
| :--- | :--- | :--- |
| **`FOR item AS <List>[] DO`** | Iterating XML tags or JSON array items | **Fastest & cleanest** — no manual counter needed |
| **`WHILE <Cond> DO`** | Counter loop or walking `LASTMOVE(ref)` pointers | Checks condition *before* first run |
| **`REPEAT ... UNTIL <Cond> END REPEAT;`** | Retrying or looping when the body **must run at least once** | Checks condition *after* body |

---

## 3. Stopping or Skipping Early (`LEAVE` & `ITERATE`)

Like `break` and `continue` in Java, give your loop a label (`ITEM_LOOP:`) so **`LEAVE`** exits early and **`ITERATE`** skips to the next item:

```esql
DECLARE total DECIMAL 0;

ITEM_LOOP: FOR item AS InputRoot.JSON.Data.items.Item[] DO
    IF item.cancelled = TRUE THEN
        ITERATE ITEM_LOOP; -- Skip cancelled item
    END IF;
    SET total = total + COALESCE(item.price, 0);
    IF total > 10000 THEN
        LEAVE ITEM_LOOP;   -- Stop early once cap reached
    END IF;
END FOR ITEM_LOOP;

SET OutputRoot.JSON.Data.grandTotal = total;
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "tier": "STANDARD",
  "label": "ACTIVE",
  "grandTotal": 149.50
}
```

</details>

---

**Next:** [REFERENCE Pointers, MOVE & Field Functions →](#topic-184)
