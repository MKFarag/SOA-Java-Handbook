---
id: topic-240
slug: esql-exception-handling
topicNumber: 240
title: "Error Handling: THROW, Handlers & ExceptionList"
part: 'Part 6: ESQL'
sectionNumber: 46
sectionTitle: 'Advanced'
versionBadge: 'ESQL'
difficulty: Intermediate
readingTime: 4 min read
shortDescription: "Raise controlled exceptions with THROW USER EXCEPTION, catch local runtime/SQL errors via CONTINUE or EXIT HANDLER, and walk InputExceptionList for the deepest root cause."
object: "Error Handling"
action: "Throw, Catch & Inspect"
commandName: "THROW CONTINUE HANDLER EXIT HANDLER InputExceptionList"
synonyms:
  - "throw user exception esql"
  - "declare continue handler sqlstate"
  - "declare exit handler esql"
  - "inputexceptionlist deepest error"
  - "e.insert[1].text bip number esql"
---

# Error Handling: `THROW`, Handlers & `ExceptionList`

ACE gives you three complementary tools for handling errors in ESQL: **`THROW`** to reject invalid data cleanly, **`DECLARE ... HANDLER`** to catch errors inside a `BEGIN ... END` block, and **`InputExceptionList`** to inspect the real cause on a **Catch** or **Failure** path.

---

## 1. Raising an Error (`THROW USER EXCEPTION`)

```esql
IF COALESCE(InputRoot.JSON.Data.email, '') = '' THEN
    THROW USER EXCEPTION
        MESSAGE 2951
        VALUES('email is required');
END IF;
```

<details data-type="output">
<summary>Expected Runtime Behavior</summary>

```text
Stops execution of the Compute node immediately and routes the message (plus ExceptionList) to the flow's Catch or Failure path.
```

</details>

### Line-by-Line Breakdown (`THROW`)

- **`IF COALESCE(InputRoot.JSON.Data.email, '') = '' THEN`**: Checks whether `email` is missing (`NULL`) or blank (`''`).
- **`THROW USER EXCEPTION`**: Immediately aborts the current node and generates an ACE user exception (`BIP2951` by default when `MESSAGE 2951` is specified, or `CATALOG 'BIPmsgs' NUMBER 2951` if referencing a catalog explicitly).
- **`MESSAGE 2951`**: Assigns numeric error code `2951` (`BIP2951`, ACE's standard user-exception template that accepts custom message inserts).
- **`VALUES('email is required');`**: Places `'email is required'` into `Insert[1].Text` inside the generated `ExceptionList`, which your Catch handler can extract cleanly.

---

## 2. Catching Errors Inline (`CONTINUE` vs `EXIT` Handler)

| Handler Type | What Happens After the Handler Block Finishes? | Best Used When... |
| :--- | :--- | :--- |
| **`DECLARE CONTINUE HANDLER`** | Execution **resumes at the very next statement** after the line that failed | You want to record `SQLSTATE` / `err` and keep executing remaining steps in the block |
| **`DECLARE EXIT HANDLER`** | Execution **exits the current `BEGIN ... END` block** immediately after handling | You want to abort the sub-block on error and return a fallback value |

```esql
BEGIN
    DECLARE err CHARACTER '';

    -- HANDLER must be declared right after local DECLARE variables (before executable lines!)
    DECLARE CONTINUE HANDLER FOR SQLSTATE LIKE '%'
    BEGIN
        SET err = SQLSTATE;
    END;

    SET Environment.Variables.cust[] = PASSTHRU(
        'SELECT NAME FROM <TableName> WHERE CUST_ID = ?',
        InputRoot.JSON.Data.customerId
    );

    IF err <> '' THEN
        SET OutputRoot.JSON.Data.dbWarning = 'Lookup skipped (' || err || ')';
    END IF;
END;
```

<details data-type="output">
<summary>Expected Behavior When Database Throws an SQL Error</summary>

```json
{
  "dbWarning": "Lookup skipped (S22000)"
}
```

</details>

### Line-by-Line Breakdown (Handler)

- **`BEGIN ... END;`**: Creates a scoped block so the handler only catches errors occurring inside this block (keeping failures elsewhere normal).
- **`DECLARE CONTINUE HANDLER FOR SQLSTATE LIKE '%' BEGIN SET err = SQLSTATE; END;`**:
  - **`DECLARE CONTINUE HANDLER`**: Declares an inline error handler that catches matching errors and resumes execution on the statement right after `PASSTHRU(...)`. (Swap `CONTINUE` for `EXIT` if you want to jump straight to the end of `BEGIN ... END` instead.)
  - **`FOR SQLSTATE LIKE '%'`**: Wildcard `'%'` catches **any** ESQL/SQL exception (`SQLSTATE` is a 5-character standard state code such as `'23000'` or `'S22000'`). You can also inspect `SQLCODE` and `SQLERRORTEXT` inside the handler!
  - **Placement rule:** Every `DECLARE ... HANDLER` **must sit at the top of its `BEGIN ... END` block** (after any `DECLARE` variables and **before** any `SET`, `IF`, or `CALL` statement).

---

## 3. Walking `InputExceptionList` to Find the Real Root Cause

In a **Catch** branch, `InputExceptionList` holds a nested tree of exceptions: outer flow wrapper -> node wrapper -> **deepest real cause** at the bottom. Walk down to the deepest node to extract its **`Number`**, **`Text`**, and **`Insert[1].Text`**:

```esql
DECLARE errNum  INTEGER   0;
DECLARE errText CHARACTER 'Unexpected error';
DECLARE e       REFERENCE TO InputExceptionList.*[1];

WHILE LASTMOVE(e) DO
    IF e.Number IS NOT NULL THEN
        SET errNum = e.Number;
    END IF;
    IF e.Insert[1].Text IS NOT NULL THEN
        SET errText = e.Insert[1].Text;
    ELSEIF e.Text IS NOT NULL THEN
        SET errText = e.Text;
    END IF;
    MOVE e LASTCHILD;
END WHILE;

SET OutputRoot.JSON.Data.errorCode = errNum;
SET OutputRoot.JSON.Data.error     = errText;
```

<details data-type="output">
<summary>Expected JSON Output (After THROW USER EXCEPTION MESSAGE 2951 VALUES('email is required'))</summary>

```json
{
  "errorCode": 2951,
  "error": "email is required"
}
```

</details>

### Line-by-Line Breakdown (`ExceptionList` Walker)

- **`DECLARE e REFERENCE TO InputExceptionList.*[1];`**: Points `e` to the top-level exception child (such as `RecoverableException`) inside `InputExceptionList`.
- **`WHILE LASTMOVE(e) DO`**: Walks deeper level by level while nested child exceptions exist.
- **`IF e.Number IS NOT NULL THEN SET errNum = e.Number; END IF;`**: Updates `errNum` with the current level's BIP error number (the deepest level overwrites earlier wrapper numbers with the true cause!).
- **`IF e.Insert[1].Text IS NOT NULL ... ELSEIF e.Text IS NOT NULL ...`**: Prefers the specific **`Insert[1].Text`** (for example `'email is required'` from `THROW USER EXCEPTION ... VALUES(...)` or the exact failing value/SQL error) and falls back to the general `e.Text` message if no `Insert` exists.
- **`MOVE e LASTCHILD;`**: Steps one level deeper down the exception chain. Notice `LASTCHILD` is key in ACE because wrapper nodes often store diagnostic attributes (`File`, `Line`, `Function`, `Text`, `Insert`) as earlier children and nest the inner `Exception` as their **last child**!

> [!TIP]
> Put this `InputExceptionList` helper procedure in a **Shared Library** so every REST/MQ flow in your organization returns clean, consistent error JSON instead of raw stack traces.

---

**Next:** [Procedures, Functions & Shared Library Reuse →](#topic-241)
