---
id: topic-189
slug: esql-exception-handling
topicNumber: 189
title: "ESQL Error Handling (THROW & SQLSTATE)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Raise custom business errors with THROW USER EXCEPTION, catch SQL errors, and extract BIP details from InputExceptionList."
object: "Exception Handling"
action: "Throw & Inspect"
commandName: "THROW USER EXCEPTION"
synonyms:
  - "throw user exception esql"
  - "inputexceptionlist esql"
  - "sqlstate esql"
  - "extract bip error esql"
---

# ESQL Error Handling (THROW & SQLSTATE)

When validation fails inside ESQL, raise a controlled error using **`THROW USER EXCEPTION`**, or walk **`InputExceptionList`** inside an error subflow to log the root BIP number.

---

## 1. Reject Invalid Input with `THROW USER EXCEPTION`

```esql
IF InputRoot.JSON.Data.amount IS NULL OR InputRoot.JSON.Data.amount <= 0 THEN
    THROW USER EXCEPTION VALUES('E400', 'Order amount must be greater than zero');
END IF;
```

This jumps straight to your flow's **`Catch`** terminal (or rolls back if uncaught)!

---

## 2. Extract the Last (Root Cause) Error in a Catch Subflow

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
errText = 'Division by zero or invalid user exception E400'
```

</details>

> [!TIP]
> Keep `GetLastError()` inside a Shared Library so every error handler across your company prints clean `errNum` + `errText` JSON logs instead of dumping 200 lines of raw XML `ExceptionList`.

---

**Next:** [ESQL Speed Tips (Avoid Slow Field Lookups) →](#topic-190)
