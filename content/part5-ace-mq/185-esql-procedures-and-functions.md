---
id: topic-185
slug: esql-procedures-and-functions
topicNumber: 185
title: "Procedures & Functions in ESQL"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Keep ESQL modular with reusable CREATE FUNCTION (returns a value) and CREATE PROCEDURE (mutates trees or runs steps)."
object: "Functions & Procedures"
action: "Modularize Code"
commandName: "CREATE FUNCTION PROCEDURE"
synonyms:
  - "create function esql"
  - "create procedure esql"
  - "shared library esql function"
  - "in out inout esql"
---

# Procedures & Functions in ESQL

Just like Java methods, reusable ESQL logic belongs in a **Function** (computes & returns one value) or a **Procedure** (executes actions like mutating an `OutputRoot` subtree).

---

## Function vs. Procedure

| Feature | **`CREATE FUNCTION`** | **`CREATE PROCEDURE`** |
| :--- | :--- | :--- |
| **Returns a value?** | Yes (`RETURNS DECIMAL`) | Usually no (`CALL MyProc(...)`) |
| **Used inside expressions?** | Yes (`SET x = CalcTax(amt);`) | No — called as a statement |
| **Parameters** | `IN` values (`REFERENCE` allowed) | `IN`, `OUT`, `INOUT` |

---

## Fast Example (Module-Level Helpers)

Put reusable helpers at the bottom of your `.esql` file (or in a Shared Library schema!):

```esql
CREATE FUNCTION AddTax(IN amount DECIMAL) RETURNS DECIMAL
BEGIN
    RETURN ROUND(amount * 1.15, 2);
END;

CREATE PROCEDURE StampAudit(IN outRef REFERENCE, IN appName CHARACTER)
BEGIN
    SET outRef.audit.app       = appName;
    SET outRef.audit.timestamp = CURRENT_GMTTIMESTAMP;
END;
```

Called inside `Main()`:

```esql
SET OutputRoot.JSON.Data.totalWithTax = AddTax(100.00);
CALL StampAudit(OutputRoot.JSON.Data, ApplicationLabel);
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "totalWithTax": 115.00,
  "audit": {
    "app": "OrderApp",
    "timestamp": "2026-11-25T09:30:00Z"
  }
}
```

</details>

> [!TIP]
> ACE includes built-in ESQL system variables like **`ApplicationLabel`**, **`MessageFlowLabel`**, **`NodeLabel`**, and **`BrokerName`** for instant audit logging!

---

**Next:** [Environment vs LocalEnvironment →](#topic-186)
