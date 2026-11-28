---
id: topic-182
slug: esql-create-field-lastchild-delete
topicNumber: 182
title: "ESQL Tree Mutation: CREATE FIELD, LASTCHILD, DELETE & DETACH"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Create, append, prepend, delete, and move message tree nodes cleanly using CREATE FIELD, CREATE LASTCHILD/FIRSTCHILD, DELETE FIELD, and DETACH/ATTACH."
object: "Tree Mutation"
action: "Create, Delete & Move"
commandName: "CREATE FIELD LASTCHILD DELETE DETACH"
synonyms:
  - "create field esql"
  - "create lastchild esql"
  - "create firstchild nextsibling"
  - "delete field esql"
  - "detach attach esql"
---

# ESQL Tree Mutation: `CREATE FIELD`, `LASTCHILD`, `DELETE` & `DETACH`

While `SET` assigns values, ESQL's **`CREATE`**, **`DELETE FIELD`**, **`DETACH`**, and **`ATTACH`** statements give you exact control over **node creation, sibling order, and removal** in `OutputRoot`, `Environment`, or `OutputLocalEnvironment`.

---

## Tree Mutation Statements at a Glance

| Statement | Behavior | Best Use Case |
| :--- | :--- | :--- |
| **`CREATE FIELD <Path>`** | Creates the path **only if missing** (never duplicates existing nodes) | Safely initializing a container folder or `JSON.Array` |
| **`CREATE LASTCHILD OF <Parent>`** | **Always appends** a brand-new child at the end (even if same tag name exists!) | Adding repeating XML `<Item>` elements in a loop |
| **`CREATE FIRSTCHILD OF <Parent>`** | Inserts a new child at **position 1** | Placing `<Priority>` first or inserting a header before the body |
| **`CREATE NEXTSIBLING` / `PREVIOUSSIBLING`** | Inserts a sibling immediately **after** or **before** a reference pointer | Inserting an element at an exact XML sequence position |
| **`DELETE FIELD <Path>`** | Removes a node and all of its descendants | Stripping sensitive fields (`Pin`, `Cvv`) or temp data |
| **`DETACH <Ref>` + `ATTACH <Ref> TO`** | Moves an entire subtree without copying | Reordering elements or moving a subtree between parents |

---

## 1. `CREATE FIELD`, `CREATE LASTCHILD` & `CREATE FIRSTCHILD`

Using **`AS <RefName>`** creates the element and immediately binds a `REFERENCE` pointer to it:

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('XMLNSC');

        DECLARE orderRef REFERENCE TO OutputRoot;
        DECLARE itemRef  REFERENCE TO OutputRoot;

        -- 1. Ensure <Order> exists once and bind orderRef to it
        CREATE FIELD OutputRoot.XMLNSC.Order AS orderRef;
        SET orderRef.Id = InputRoot.JSON.Data.id;

        -- 2. Append one <Item> per JSON array element
        FOR srcItem AS InputRoot.JSON.Data.items.Item[] DO
            CREATE LASTCHILD OF orderRef AS itemRef NAME 'Item';
            SET itemRef.Sku   = srcItem.sku;
            SET itemRef.Price = srcItem.price;
        END FOR;

        -- 3. Insert <Priority> at position 1 inside <Order>
        CREATE FIRSTCHILD OF orderRef NAME 'Priority' VALUE 'HIGH';

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected XML Output (Input: {"id":101,"items":[{"sku":"A1","price":25},{"sku":"B2","price":40}]})</summary>

```xml
<Order>
  <Priority>HIGH</Priority>
  <Id>101</Id>
  <Item>
    <Sku>A1</Sku>
    <Price>25</Price>
  </Item>
  <Item>
    <Sku>B2</Sku>
    <Price>40</Price>
  </Item>
</Order>
```

</details>

### Line-by-Line Breakdown (Creation & Ordering)

- **`DECLARE orderRef REFERENCE TO OutputRoot;` / `DECLARE itemRef REFERENCE TO OutputRoot;`**: Initializes placeholder `REFERENCE` variables at the top of `Main()`. In ESQL, a `REFERENCE` must be initialized to an existing node at declaration time before `CREATE ... AS` rebinds it.
- **`CREATE FIELD OutputRoot.XMLNSC.Order AS orderRef;`**: Creates `<Order>` under `XMLNSC` if missing (if `<Order>` already existed, it reuses it without duplicating) and points `orderRef` directly to `<Order>`.
- **`FOR srcItem AS InputRoot.JSON.Data.items.Item[] DO`**: Loops cleanly over every input JSON array element; `srcItem` acts as an automatic `REFERENCE` to the current item.
- **`CREATE LASTCHILD OF orderRef AS itemRef NAME 'Item';`**: Unconditionally appends a new `<Item>` child at the end of `orderRef` and points `itemRef` to that brand-new `<Item>`. Using `CREATE LASTCHILD` is crucial here because `CREATE FIELD orderRef.Item` would overwrite the first `<Item>` instead of adding a second one!
- **`CREATE FIRSTCHILD OF orderRef NAME 'Priority' VALUE 'HIGH';`**: Prepends `<Priority>HIGH</Priority>` as the **very first child** of `<Order>`, right before `<Id>`, and sets its text value inline using the **`VALUE`** clause.

---

## 2. Removing & Moving Nodes (`DELETE FIELD`, `DETACH` + `ATTACH`)

```esql
CALL CopyEntireMessage();

-- Remove a sensitive field and its entire subtree
DELETE FIELD OutputRoot.XMLNSC.Customer.SecretPin;

-- Move the first Draft item to the end of Approved without copying
DECLARE moveRef REFERENCE TO OutputRoot.XMLNSC.Draft.Item[1];
IF LASTMOVE(moveRef) THEN
    DETACH moveRef;
    ATTACH moveRef TO OutputRoot.XMLNSC.Approved AS LASTCHILD;
END IF;
```

<details data-type="output">
<summary>What Happens at Runtime</summary>

```text
1. <SecretPin> is completely removed from OutputRoot.XMLNSC.Customer.
2. The first <Item> is detached from <Draft> and reattached at the end of <Approved>.
```

</details>

### Line-by-Line Breakdown (`DELETE`, `DETACH`, `ATTACH`)

- **`DELETE FIELD OutputRoot.XMLNSC.Customer.SecretPin;`**: Deletes `SecretPin` (and any children it owns). Unlike `SET ... = NULL;`, `DELETE FIELD` also works directly on a `REFERENCE` pointer (`DELETE FIELD itemRef;`) without clearing the pointer variable's type.
- **`IF LASTMOVE(moveRef) THEN`**: Checks that `Draft.Item[1]` actually existed before trying to detach it.
- **`DETACH moveRef;`**: Disconnects the subtree from `<Draft>` while keeping `moveRef` pointing to it in memory.
- **`ATTACH moveRef TO OutputRoot.XMLNSC.Approved AS LASTCHILD;`**: Re-attaches that exact subtree as the last child of `<Approved>` with zero deep-copy overhead (valid positions: `AS FIRSTCHILD`, `AS LASTCHILD`, `AS PREVIOUSSIBLING`, `AS NEXTSIBLING`).

> [!WARNING]
> **Only mutate writable trees!** `CREATE`, `DELETE FIELD`, `DETACH`, and `ATTACH` work on `OutputRoot`, `Environment`, and `OutputLocalEnvironment` — running them on `InputRoot` fails with a read-only tree error.

---

**Next:** [ESQL Arrays, CARDINALITY & JSON.Array →](#topic-183)
