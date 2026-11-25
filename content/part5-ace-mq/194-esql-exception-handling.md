---
id: topic-194
slug: esql-exception-handling
topicNumber: 194
title: "ESQL Error Handling (THROW, InputExceptionList & Handlers)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Raise custom business errors with THROW USER EXCEPTION, catch SQL/runtime failures via DECLARE EXIT HANDLER, and walk InputExceptionList."
object: "Exception Handling"
action: "Throw & Inspect"
commandName: "THROW & EXIT HANDLER"
synonyms:
  - "throw user exception esql"
  - "inputexceptionlist esql"
  - "declare exit handler sqlstate"
  - "extract bip error esql"
---

# ESQL Error Handling (`THROW`, `InputExceptionList` & Handlers)

When validation fails inside ESQL, raise a controlled error using **`THROW USER EXCEPTION`**, catch local SQL/runtime errors inline with **`DECLARE ... HANDLER`**, or walk **`InputExceptionList`** inside a `Catch` branch.

---

## 1. Reject Invalid Input with `THROW USER EXCEPTION`

```esql
IF InputRoot.JSON.Data.amount IS NULL OR InputRoot.JSON.Data.amount <= 0 THEN
    THROW USER EXCEPTION CATALOG 'BIPmsgs' NUMBER 2951 VALUES('Amount must be > 0');
END IF;
```

This jumps straight to your flow's **`Catch`** terminal (or rolls back if uncaught)!

---

## 2. Catch an Error Inside ESQL (`DECLARE EXIT HANDLER`)

Prevent a non-critical SQL lookup failure from crashing the entire message flow:

```esql
BEGIN
    DECLARE EXIT HANDLER FOR SQLSTATE LIKE '%'
    BEGIN
        -- Fallback gracefully if DB query fails
        SET OutputRoot.JSON.Data.dbWarning = SQLERRORTEXT;
    END;

    SET Environment.Db.Row[] = PASSTHRU('SELECT TOP 1 NAME FROM dbo.<TableName> WHERE ID=?' VALUES(id));
END;
```

---

## 3. Extract the Root Cause in a `Catch` Subflow (`InputExceptionList`)

In ACE, `InputExceptionList` nests exceptions from outermost flow wrapper down to the exact root cause at the deepest level:

```esql
CREATE PROCEDURE GetLastError(IN exList REFERENCE, OUT errNum INTEGER, OUT errText CHARACTER)
BEGIN
    DECLARE ptr REFERENCE TO exList.*[1];
    WHILE LASTMOVE(ptr) DO
        IF ptr.Number IS NOT NULL THEN
            SET errNum  = ptr.Number;
            SET errText = ptr.Text;
        END IF;
        MOVE ptr LASTCHILD;
    END WHILE;
END;
```

<details data-type="output">
<summary>Sample Extracted Values</summary>

```text
errNum  = 2951
errText = 'User exception: Amount must be > 0'
```

</details>

> [!TIP]
> Keep `GetLastError()` inside a Shared Library so every error handler across your apps logs concise `errNum` + `errText` details instead of dumping 200 lines of nested XML exception trees.

---

**Next:** [ESQL Speed Tips (Avoid Slow Field Lookups) →](#topic-195)
