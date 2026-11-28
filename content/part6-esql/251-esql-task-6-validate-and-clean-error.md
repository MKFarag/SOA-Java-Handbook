---
id: topic-251
slug: esql-task-6-validate-and-clean-error
topicNumber: 251
title: "Task 6: Validate Input & Return a Clean HTTP 400 Error"
part: 'Part 6: ESQL'
sectionNumber: 47
sectionTitle: 'Tasks'
versionBadge: 'ESQL'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Solved ACE task: validate missing email with THROW USER EXCEPTION MESSAGE 2951 and walk InputExceptionList in the Catch path to return HTTP 400 JSON."
object: "Task 6: Validation & Errors"
action: "Throw & Format Error"
commandName: "THROW USER EXCEPTION InputExceptionList"
synonyms:
  - "validate input throw user exception esql"
  - "task 6 validation errors esql"
  - "catch path inputexceptionlist 400"
  - "e.insert[1].text esql"
---

# Task 6: Validate Input & Return a Clean HTTP 400 Error

**Technique:** Input validation using **`COALESCE` + `THROW USER EXCEPTION`** in the main flow, paired with an **`InputExceptionList`** walker in the **Catch** path to return a clean HTTP `400` JSON response instead of a raw ACE stack dump.

---

## Problem, Flow Wiring & Sample Input

Reject any request missing an `email` field with **HTTP `400`** and the clean validation reason (`"email is required"`), never exposing raw ACE BIP trace dumps.

- **Flow Setup:**
  1. Wire `HTTPInput` -> **Main Compute Node** -> ... -> `HTTPReply`.
  2. Wire `HTTPInput`'s **`Catch`** terminal (or a `TryCatch` node's `Catch` terminal) -> **Catch Compute Node** (**Compute mode = `LocalEnvironment And Message`**) -> `HTTPReply`.

```json
{
  "name": "Mona"
}
```

---

## Part 1: Main Compute Node (Validate & `THROW`)

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        IF COALESCE(InputRoot.JSON.Data.email, '') = '' THEN
            THROW USER EXCEPTION
                MESSAGE 2951
                VALUES('email is required');
        END IF;

        CALL CopyEntireMessage();
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>What Happens When email Is Missing or Empty</summary>

```text
Main Compute node aborts immediately and jumps to the Catch path carrying InputExceptionList with BIP2951 and Insert[1].Text = 'email is required'.
```

</details>

### Line-by-Line Breakdown (Main Compute Node)

- **`IF COALESCE(InputRoot.JSON.Data.email, '') = '' THEN`**: Checks both cases in one expression — if `email` is missing/`NULL` (`COALESCE` turns it into `''`), OR if the caller sent `"email": ""`. (You can wrap `TRIM(...)` around `email` too if spaces-only should also fail.)
- **`THROW USER EXCEPTION MESSAGE 2951 VALUES('email is required');`**:
  - Stops the Main Compute node immediately so downstream nodes never process invalid input.
  - Raises an ACE user exception (`BIP2951`) storing `'email is required'` inside **`Insert[1].Text`**.
  - Hands control straight to the wired **`Catch`** terminal (or `TryCatch` Catch branch).

---

## Part 2: Catch Compute Node (Walk `InputExceptionList` & Return HTTP `400`)

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <CatchComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        SET OutputRoot.Properties = InputRoot.Properties;
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE msg CHARACTER 'Unexpected error';
        DECLARE e   REFERENCE TO InputExceptionList.*[1];

        WHILE LASTMOVE(e) DO
            IF e.Insert[1].Text IS NOT NULL THEN
                SET msg = e.Insert[1].Text;
            END IF;
            MOVE e LASTCHILD;
        END WHILE;

        SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 400;
        SET OutputRoot.JSON.Data.error = msg;

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected HTTP 400 Response Body</summary>

```json
{
  "error": "email is required"
}
```

</details>

### Line-by-Line Breakdown (Catch Compute Node)

- **`SET OutputRoot.Properties = InputRoot.Properties;` + `CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');`**: Builds a clean JSON response tree (because on a `Catch` branch, `InputRoot` still holds the original failed request payload).
- **`DECLARE msg CHARACTER 'Unexpected error';`**: Safe default fallback text in case an error occurs that has no `Insert[1].Text`.
- **`DECLARE e REFERENCE TO InputExceptionList.*[1];`**: Points cursor `e` to the outermost wrapper entry in `InputExceptionList` (for example `RecoverableException`).
- **`WHILE LASTMOVE(e) DO ... MOVE e LASTCHILD; END WHILE;`**: Walks down the exception hierarchy from outermost flow wrapper to the **deepest** exception entry, which holds the real root cause.
- **`IF e.Insert[1].Text IS NOT NULL THEN SET msg = e.Insert[1].Text; END IF;`**: Captures `'email is required'` from the `VALUES(...)` insert (if an outer node also had an `Insert`, deeper iterations overwrite `msg` so the deepest, truest reason wins!).
- **`SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 400;`**: Instructs `HTTPReply` to send **HTTP `400 Bad Request`**. Remember to set **Compute mode = `LocalEnvironment And Message`** on the Catch Compute node!
- **`SET OutputRoot.JSON.Data.error = msg;`**: Writes `{"error": "email is required"}` and `RETURN TRUE;` delivers it to `HTTPReply`.

> [!TIP]
> Notice why **`HTTPInput.Catch`** (or **`TryCatch`**) is wired separately from the Compute node: a Compute node's own `Failure` terminal only fires if `Failure` is wired and an unhandled exception escapes; wiring **`HTTPInput` -> `Catch`** catches exceptions thrown anywhere in the flow!

---

**Next:** [Bonus Task: Transform a JSON Order to XMLNSC →](#topic-252)
