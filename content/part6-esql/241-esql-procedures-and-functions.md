---
id: topic-241
slug: esql-procedures-and-functions
topicNumber: 241
title: "Procedures, Functions & Shared Library Reuse"
part: 'Part 6: ESQL'
sectionNumber: 46
sectionTitle: 'Advanced'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Modularize ESQL with CREATE FUNCTION and CREATE PROCEDURE, IN/OUT/INOUT parameters, Shared Library schemas (PATH), and built-in flow variables."
object: "Functions & Procedures"
action: "Modularize & Reuse"
commandName: "CREATE FUNCTION PROCEDURE BROKER SCHEMA PATH"
synonyms:
  - "create function esql"
  - "create procedure esql"
  - "in out inout esql"
  - "shared library schema esql reuse"
  - "applicationlabel uuidaschar esql"
---

# Procedures, Functions & Shared Library Reuse

Avoid copy-pasting business rules across flows. Extract reusable calculations into **`CREATE FUNCTION`**, tree-mutating steps into **`CREATE PROCEDURE`**, and place organization-wide utilities in a **Shared Library schema** so any Application can call them by name.

---

## `CREATE FUNCTION` vs `CREATE PROCEDURE`

| Feature | **`CREATE FUNCTION`** | **`CREATE PROCEDURE`** |
| :--- | :--- | :--- |
| **Returns a value?** | **Yes** (`RETURNS DECIMAL`, `RETURNS BOOLEAN`) | Usually no (`RETURNS` optional) |
| **How you invoke it** | Inside expressions (`SET x = AddTax(100);`) | Standalone statement (`CALL StampAudit(...);`) |
| **Parameter directions** | `IN` (supports `REFERENCE` too) | `IN`, `OUT`, `INOUT` |
| **Where it can live** | Inside a Module (`CREATE COMPUTE MODULE`) OR at **Schema level** (reusable across modules!) | Inside a Module OR at **Schema level** |

---

## Example: Shared Library Function + Module Procedure

Put common functions in a **Shared Library** `.esql` file under `<SharedSchemaName>` (outside any `CREATE ... MODULE` block):

```esql
BROKER SCHEMA <SharedSchemaName>

CREATE FUNCTION AddTax(IN amount DECIMAL) RETURNS DECIMAL
BEGIN
    RETURN ROUND(COALESCE(amount, 0) * 1.14, 2);
END;

CREATE PROCEDURE StampAudit(IN outRef REFERENCE, IN appName CHARACTER)
BEGIN
    SET outRef.audit.app       = appName;
    SET outRef.audit.txId      = UUIDASCHAR;
    SET outRef.audit.timestamp = CURRENT_GMTTIMESTAMP;
END;
```

Reference that Shared Library in your Application, import the schema with **`PATH`** (or call by qualified name `<SharedSchemaName>.AddTax(...)`), and invoke both helpers inside `Main()`:

```esql
BROKER SCHEMA <SchemaName>
PATH <SharedSchemaName>;

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        SET OutputRoot.JSON.Data.totalWithTax = AddTax(InputRoot.JSON.Data.amount);
        CALL StampAudit(OutputRoot.JSON.Data, ApplicationLabel);

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (Input: {"amount": 100.00})</summary>

```json
{
  "totalWithTax": 114.00,
  "audit": {
    "app": "OrdersApp",
    "txId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "timestamp": "2026-11-28T11:30:00Z"
  }
}
```

</details>

### Line-by-Line Breakdown

- **`BROKER SCHEMA <SharedSchemaName>`**: Declares the shared library's schema so functions/procedures written at top level (outside any module) are exported across the library.
- **`CREATE FUNCTION AddTax(IN amount DECIMAL) RETURNS DECIMAL`**: Declares a pure function accepting an `IN` `DECIMAL` parameter and returning a `DECIMAL` result via `RETURN ...;`.
- **`CREATE PROCEDURE StampAudit(IN outRef REFERENCE, IN appName CHARACTER)`**: Declares a procedure that receives a `REFERENCE` (`outRef`) to `OutputRoot.JSON.Data` so it can write `.audit.*` fields directly into the caller's tree. (Use **`OUT`** or **`INOUT`** when a procedure needs to return scalar variables back to the caller, e.g., `OUT errNum INTEGER`.)
- **`UUIDASCHAR`**: Built-in ACE function generating a fresh 36-character UUID string — ideal for correlation and audit IDs.
- **`PATH <SharedSchemaName>;`**: Placed right after `BROKER SCHEMA <SchemaName>` in the calling `.esql` file so you can call `AddTax(...)` and `StampAudit(...)` by short name (alternatively, call `<SharedSchemaName>.AddTax(...)` without `PATH`).
- **`ApplicationLabel`**: Built-in ESQL system constant containing the running ACE Application name. Other handy built-in constants include **`MessageFlowLabel`**, **`NodeLabel`**, **`BrokerName`**, **`ExecutionGroupLabel`**, and **`QueueManagerName`**.

> [!TIP]
> **Shared Library Packaging Rule:** When an Application calls ESQL from a Shared Library, make sure your Application explicitly **references** that Shared Library in the Toolkit, and deploy the Shared Library to the Integration Server!

---

**Next:** [Transport Headers: MQMD, MQRFH2 & HTTP →](#topic-242)
