---
id: topic-174
slug: esql-essentials-create-module
topicNumber: 174
title: "ESQL Basics: Modules & Main()"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Understand the basic structure of every ESQL file: MODULE blocks, the Main() function, and RETURN TRUE."
object: "ESQL Module"
action: "Write Basics"
commandName: "CREATE COMPUTE MODULE"
synonyms:
  - "esql basics"
  - "create compute module"
  - "main returns boolean"
  - "esql hello world"
---

# ESQL Basics: Modules & Main()

**ESQL** (Extended Structured Query Language) is ACE's built-in language for reading, building, and changing messages inside a **Compute**, **Database**, or **Filter** node.

---

## Anatomy of an ESQL File

When you double-click a `Compute` node, ACE generates a module linked to that node:

```esql
BROKER SCHEMA com.company.orders

CREATE COMPUTE MODULE Order_Compute
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        SET OutputRoot.JSON.Data.greeting = 'Hello from ACE';
        RETURN TRUE;
    END;

    CREATE PROCEDURE CopyMessageHeaders() BEGIN
        DECLARE I INTEGER 1;
        DECLARE J INTEGER CARDINALITY(InputRoot.*[]);
        WHILE I < J DO
            SET OutputRoot.*[I] = InputRoot.*[I];
            SET I = I + 1;
        END WHILE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "greeting": "Hello from ACE"
}
```

</details>

---

## 3 Rules to Remember

1. **Always end `Main()` with `RETURN TRUE;`** so ACE propagates `OutputRoot` out the `Out` terminal. Returning `FALSE` stops the message cleanly without error.
2. **`CopyMessageHeaders()`** copies `Properties`, `MQMD`, and `HTTPInputHeader` while letting you build a fresh body.
3. **`CopyEntireMessage()`** copies headers **and** the body — great when you only want to add or tweak 1–2 fields.

> [!TIP]
> ESQL array indexes are **1-based** (`Item[1]`, not `Item[0]`) and string literals always use **single quotes** (`'USD'`), never double quotes (`"USD"` means a field name with special characters!).

---

**Next:** [The 4 Message Trees (InputRoot, OutputRoot, Env, LocalEnv) →](#topic-175)
