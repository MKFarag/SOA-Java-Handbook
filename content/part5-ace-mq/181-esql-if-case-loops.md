---
id: topic-181
slug: esql-if-case-loops
topicNumber: 181
title: "IF, CASE & Loops (WHILE, FOR)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Branch logic with IF/CASE and loop over repeating message elements using FOR and WHILE."
object: "Control Flow"
action: "Branch & Loop"
commandName: "IF CASE WHILE FOR"
synonyms:
  - "esql if else"
  - "esql case when"
  - "esql for loop"
  - "esql while loop"
---

# IF, CASE & Loops (WHILE, FOR)

ESQL control statements look just like SQL procedural blocks — always close them explicitly with `END IF;`, `END CASE;`, `END WHILE;`, or `END FOR;`.

---

## 1. `IF ... ELSEIF ... ELSE`

```esql
DECLARE amt DECIMAL COALESCE(InputRoot.JSON.Data.amount, 0);

IF amt >= 10000 THEN
    SET OutputRoot.JSON.Data.tier = 'VIP';
ELSEIF amt >= 1000 THEN
    SET OutputRoot.JSON.Data.tier = 'GOLD';
ELSE
    SET OutputRoot.JSON.Data.tier = 'STANDARD';
END IF;
```

---

## 2. `CASE` Statement

```esql
DECLARE status CHARACTER CASE InputRoot.JSON.Data.code
    WHEN 'A' THEN 'ACTIVE'
    WHEN 'C' THEN 'CLOSED'
    ELSE 'UNKNOWN'
END;
```

---

## 3. Cleanest Way to Loop Over Elements: `FOR`

`FOR` iterates through every matching sibling element without maintaining manual counters:

```esql
DECLARE total DECIMAL 0;
FOR item AS InputRoot.JSON.Data.items.Item[] DO
    SET total = total + COALESCE(item.price, 0);
END FOR;
SET OutputRoot.JSON.Data.grandTotal = total;
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "grandTotal": 149.50
}
```

</details>

> [!TIP]
> Use `FOR item AS ...[] DO` whenever iterating read-only over input arrays — it is automatically fast under the hood (just like a `REFERENCE` pointer) and much cleaner than `WHILE i <= CARDINALITY(...)`.

---

**Next:** [REFERENCE Pointers (Fast Tree Loops) →](#topic-182)
