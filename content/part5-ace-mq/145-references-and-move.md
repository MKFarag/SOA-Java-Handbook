---
id: topic-145
slug: references-and-move
topicNumber: 145
title: "References and the MOVE Statement"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Navigate large message trees efficiently using dynamic pointer references and the MOVE statement."
object: "References"
action: "Navigate"
commandName: "MOVE REFERENCE"
synonyms:
  - "reference"
  - "move statement"
  - "pointer"
  - "tree navigation"
  - "lastmove"
  - "fast loop"
---

Declares memory pointers to tree nodes and navigates hierarchies using `MOVE` without re-parsing paths.
Use references to dramatically accelerate loops across large message trees (1,000+ elements).

```esql
DECLARE <RefName> REFERENCE TO <TargetTree>;
MOVE <RefName> [PARENT | FIRSTCHILD | NEXTSIBLING];
```

| Navigation Direction | Description | Result If Target Missing |
| :--- | :--- | :--- |
| **`FIRSTCHILD`** | Descends into the first child node of the current element. | `LASTMOVE(ref)` becomes `FALSE`. |
| **`NEXTSIBLING`** | Advances to the next adjacent sibling node at the same depth. | `LASTMOVE(ref)` becomes `FALSE`. |
| **`PARENT`** | Ascends to the parent container node. | Points to root or parent. |

```json
{
  "items": [
    { "code": "A1", "price": 10 },
    { "code": "B2", "price": 25 }
  ]
}
```

```esql
SET OutputRoot.Properties = InputRoot.Properties;
DECLARE inRef REFERENCE TO InputRoot.JSON.Data.items.Item[1];
DECLARE totalPrice INTEGER 0;

WHILE LASTMOVE(inRef) DO
    SET totalPrice = totalPrice + inRef.price;
    MOVE inRef NEXTSIBLING;
END WHILE;

SET OutputRoot.JSON.Data.totalPrice = totalPrice;
```

```json
{ "totalPrice": 35 }
```

* **Performance Boost:** Direct path addressing in loops (`items.Item[I]`) has $O(N^2)$ complexity; `MOVE inRef NEXTSIBLING` operates in $O(N)$ linear time.
* **Always Check LASTMOVE:** If you move past the final sibling, the reference pointer becomes invalid; verify with `LASTMOVE(ref)`.
* **Detached References:** If the tree element a reference points to is deleted (`SET ref = NULL`), the reference becomes unattached.

* [Loop Over a JSON Array](#topic-144)
* [Working with Arrays and Lists](#topic-146)
* [The Message Tree Architecture](#topic-139)
