---
id: topic-179
slug: esql-create-field-lastchild-delete
topicNumber: 179
title: "CREATE FIELD, CREATE LASTCHILD, DELETE FIELD & DETACH"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Build, insert, delete, and move message tree nodes cleanly using CREATE FIELD, CREATE LASTCHILD/FIRSTCHILD, DELETE FIELD, and DETACH."
object: "Tree Mutation"
action: "Create, Delete & Move Fields"
commandName: "CREATE FIELD & CREATE LASTCHILD"
synonyms:
  - "create field esql"
  - "create lastchild esql"
  - "create firstchild esql"
  - "create nextsibling previoussibling"
  - "delete field esql"
  - "detach attach esql"
---

# CREATE FIELD, CREATE LASTCHILD, DELETE FIELD & DETACH

While `SET` modifies values, ESQL's **`CREATE`**, **`DELETE FIELD`**, **`DETACH`**, and **`ATTACH`** statements control the **exact structure and order** of elements inside `OutputRoot`, `Environment`, or `LocalEnvironment`.

---

## When to Use Each Statement

| Statement | What It Does | Best Use Case |
| :--- | :--- | :--- |
| **`CREATE FIELD <Path>`** | Creates the path **only if missing** (never duplicates if it already exists) | Safely initialize a parent block or JSON array container |
| **`CREATE LASTCHILD OF <Parent>`** | **Always appends** a brand-new child at the end (even if same tag name exists!) | Adding repeating XML `<Item>` tags or array items inside loops |
| **`CREATE FIRSTCHILD OF <Parent>`** | Inserts a new child at the **very top** (position 1) | Prepending headers before body or putting a tag first in XML |
| **`CREATE NEXTSIBLING / PREVIOUSSIBLING`** | Inserts a sibling **after** or **before** a reference pointer | Inserting an element at a specific spot inside an existing XML block |
| **`DELETE FIELD <Path>`** | Deletes a node and all its children from the tree | Stripping sensitive fields (like PIN/CVV) or removing temp XML before output |
| **`DETACH <Ref>` + `ATTACH <Ref> TO`** | Picks up an entire subtree and moves it without copying | Reordering elements or moving a subtree to another parent |

---

## 1. `CREATE FIELD` vs `CREATE LASTCHILD` (With `AS` Reference)

Using **`AS <RefName>`** lets you create an element **and** immediately grab a pointer to fill its children cleanly:

```esql
DECLARE orderRef REFERENCE TO OutputRoot;
DECLARE itemRef  REFERENCE TO OutputRoot;

-- 1. Ensure parent XMLNSC structure exists safely
CREATE FIELD OutputRoot.XMLNSC.Order AS orderRef;
SET orderRef.Id = InputRoot.JSON.Data.id;

-- 2. Append multiple <Item> elements in a loop using CREATE LASTCHILD
FOR srcItem AS InputRoot.JSON.Data.items.Item[] DO
    CREATE LASTCHILD OF orderRef AS itemRef NAME 'Item';
    SET itemRef.Sku   = srcItem.sku;
    SET itemRef.Price = srcItem.price;
END FOR;

-- 3. Insert <Priority> at the VERY TOP inside <Order>
CREATE FIRSTCHILD OF orderRef NAME 'Priority' VALUE 'HIGH';
```

<details data-type="output">
<summary>Expected XML Output</summary>

```xml
<Order>
  <Priority>HIGH</Priority>
  <Id>101</Id>
  <Item><Sku>A1</Sku><Price>25</Price></Item>
  <Item><Sku>B2</Sku><Price>40</Price></Item>
</Order>
```

</details>

---

## 2. `DELETE FIELD` vs `SET ... = NULL`

```esql
CALL CopyEntireMessage();

-- Removes internal <SecretPin> completely (also clears empty XML tags)
DELETE FIELD OutputRoot.XMLNSC.Customer.SecretPin;
```

- Note: Setting `SET OutputRoot.XMLNSC.Tag = NULL;` also deletes `Tag`, whereas **`DELETE FIELD`** works cleanly even when targeting a `REFERENCE` pointer variable (`DELETE FIELD itemRef;`) without resetting the variable!

---

## 3. Move a Subtree Without Copying (`DETACH` + `ATTACH`)

```esql
DECLARE moveRef REFERENCE TO OutputRoot.XMLNSC.Draft.Item[1];
DETACH moveRef;
ATTACH moveRef TO OutputRoot.XMLNSC.Approved AS LASTCHILD;
```

> [!WARNING]
> **Only modify writable trees!** `CREATE`, `DELETE FIELD`, `DETACH`, and `ATTACH` work on `OutputRoot`, `Environment`, and `OutputLocalEnvironment` — running them against `InputRoot` fails because input trees are strictly read-only.

---

**Next:** [CAST Type Conversions & Math Functions (ROUND, MOD, ABS) →](#topic-180)
