---
id: topic-220
slug: esql-introduction-and-nodes
topicNumber: 220
title: "Introduction: Compute, Filter & Database Nodes"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Understand what ESQL is, where .esql files run, and how Compute, Filter, and Database nodes differ."
object: "Overview"
action: "Choose Node"
commandName: "Compute Filter Database ESQL"
synonyms:
  - "what is esql"
  - "compute filter database node esql"
  - "create filter module"
  - "create database module"
  - "esql extended sql"
---

# Introduction: Compute, Filter & Database Nodes

**ESQL** (Extended Structured Query Language) is IBM App Connect Enterprise's built-in language for reading, building, filtering, and transforming the logical message tree that ACE parses from every message. You write ESQL inside **`.esql`** files, and three flow nodes execute it.

---

## The 3 Nodes That Run ESQL

| Node | Module Type | Root Tree Name | Can Change Message? | Return Value Controls |
| :--- | :--- | :--- | :--- | :--- |
| **`Compute`** | `CREATE COMPUTE MODULE` | `InputRoot` (read) & `OutputRoot` (write) | **Yes** (builds a new output message) | `TRUE` sends to `Out`; `FALSE` stops automatic propagation |
| **`Filter`** | `CREATE FILTER MODULE` | `Root` (read-only) | **No** (evaluates condition only) | `TRUE` -> `True` terminal; `FALSE` -> `False`; `UNKNOWN` -> `Unknown` |
| **`Database`** | `CREATE DATABASE MODULE` | `Root` (read-only) | **No** (runs SQL against an ODBC DSN) | `TRUE` forwards message to `Out`; `FALSE` stops flow |

---

## Example 1: `Filter` Node Module (`CREATE FILTER MODULE`)

A `Filter` node routes a message without editing it:

```esql
BROKER SCHEMA <SchemaName>

CREATE FILTER MODULE <FilterModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        IF Root.JSON.Data.amount > 50000 THEN
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Routing Behavior</summary>

```text
Input {"amount": 75000} -> returns TRUE    -> routed to 'True' terminal
Input {"amount": 1200}  -> returns FALSE   -> routed to 'False' terminal
Input {}                -> returns FALSE   -> (comparison with NULL gives UNKNOWN; ELSE runs)
```

</details>

### Line-by-Line Breakdown (Filter Module)

- **`BROKER SCHEMA <SchemaName>`**: Declares the logical namespace (matching the folder path inside your ACE Application/Library) that organizes your `.esql` modules and avoids name collisions.
- **`CREATE FILTER MODULE <FilterModuleName>` ... `END MODULE;`**: Defines the module linked to the Filter node's **Filter expression** property.
- **`CREATE FUNCTION Main() RETURNS BOOLEAN`**: The mandatory entry-point function ACE calls when a message arrives at the node's `In` terminal.
- **`BEGIN` ... `END;`**: Wraps the statements executed inside `Main()`. Every `BEGIN` requires a matching `END;` with a semicolon.
- **`Root.JSON.Data.amount`**: Inside **`Filter`** and **`Database`** nodes, the incoming message tree is named **`Root`** (NOT `InputRoot`) because these nodes do not build an `OutputRoot`.
- **`IF ... > 50000 THEN ... ELSE ... END IF;`**: Evaluates the numeric comparison. If `amount` is `NULL` (missing), `NULL > 50000` evaluates to `UNKNOWN`, which fails `IF` and falls into `ELSE`.
- **`RETURN TRUE;` / `RETURN FALSE;`**: Tells the `Filter` node which output terminal receives the unchanged message (`True`, `False`, or `Unknown` if `Main()` returns `UNKNOWN` directly, e.g., `RETURN Root.JSON.Data.amount > 50000;`).

---

## Example 2: `Database` Node Module (`CREATE DATABASE MODULE`)

A `Database` node executes SQL against a configured ODBC **Data source** (`<DSN_Name>`) without modifying the message payload:

```esql
BROKER SCHEMA <SchemaName>

CREATE DATABASE MODULE <DatabaseModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        INSERT INTO Database.<DSN_Name>.<TableName> (ORDER_ID, CREATED_AT)
        VALUES (Root.JSON.Data.orderId, CURRENT_TIMESTAMP);

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Runtime Behavior</summary>

```text
Inserts a row into <TableName> using DSN <DSN_Name>, then forwards the original message unchanged to 'Out'.
```

</details>

### Line-by-Line Breakdown (Database Module)

- **`CREATE DATABASE MODULE <DatabaseModuleName>`**: Links this ESQL block to the Database node's **Statement** property.
- **`INSERT INTO Database.<DSN_Name>.<TableName> (...)`**: ESQL's native SQL `INSERT` syntax targeting an ODBC Data Source configured in the node's **Data source** property (you can also use `PASSTHRU` here).
- **`VALUES (Root.JSON.Data.orderId, CURRENT_TIMESTAMP)`**: Pulls `orderId` straight from `Root` (read-only in Database nodes) and passes ACE's built-in `CURRENT_TIMESTAMP` value as the second column.
- **`RETURN TRUE;`**: Instructs ACE to pass the original message onward through the `Out` terminal after the SQL executes.

---

## 5 Core ESQL Rules to Know on Day 1

| Rule | Correct ESQL | Common Trap |
| :--- | :--- | :--- |
| **Array indexes are 1-based** | `Item[1]` | `Item[0]` throws `BIP2531E` |
| **Text strings use single quotes** | `'PAID'` | `"PAID"` means a field identifier! |
| **Keywords are case-insensitive** | `SET` or `set` | Field names (`orderId` vs `OrderId`) ARE **case-sensitive** |
| **Comments** | `-- single line` or `/* multi-line */` | `//` is NOT valid in ESQL |
| **Statements end with `;`** | `RETURN TRUE;` | Missing `;` causes a syntax error in the Toolkit Problems view |

> [!TIP]
> Most of your integration logic lives in **Compute** nodes (which can transform messages, query databases, and route via `PROPAGATE`). Use **Filter** when you only need a `True`/`False`/`Unknown` branch without altering the message, and **Database** when you only need a pure SQL side effect without building an `OutputRoot`.

---

**Next:** [The 4 Message Trees (Root, Env, LocalEnv, ExceptionList) →](#topic-221)
