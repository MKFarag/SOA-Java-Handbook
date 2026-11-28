---
id: topic-250
slug: esql-task-5-database-lookup-enrich
topicNumber: 250
title: "Task 5: Enrich a Request from a Database (HTTP 404)"
part: 'Part 6: ESQL'
sectionNumber: 47
sectionTitle: 'Tasks'
versionBadge: 'ESQL'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Solved ACE task: look up a customer by ID using parameterized PASSTHRU, return enriched JSON on hit, or set HTTP 404 via OutputLocalEnvironment on miss."
object: "Task 5: Database Lookup"
action: "Enrich & Return 404"
commandName: "PASSTHRU EXISTS ReplyStatusCode"
synonyms:
  - "database lookup passthru 404 esql"
  - "task 5 database lookup esql"
  - "enrich request from database ace"
  - "replystatuscode 404 compute mode"
---

# Task 5: Enrich a Request from a Database (HTTP 404)

**Technique:** Parameterized SQL lookup via **`PASSTHRU`**, storing result rows in **`Environment.Variables`**, checking existence with **`EXISTS(...[])`**, and returning HTTP `404` via **`OutputLocalEnvironment`**.

---

## Problem, Node Setup & Sample Input

Look up a customer's `name` and `status` in the database by `customerId`. Return HTTP `404` with a JSON error payload if the customer does not exist.

- **Node Setup Required:**
  1. Set the Compute node's **Data source** property to `<DSN_Name>` (see **[SQL Server Windows ODBC](#topic-216)** and **[`mqsicvp` verification](#topic-218)**).
  2. Register DSN credentials with **`mqsisetdbparms`** or the ACE **vault** (`mqsivault` / `mqsicredentials`).
  3. Set the Compute node's **Compute mode** property to **`LocalEnvironment And Message`** (otherwise `ReplyStatusCode = 404` is ignored!).

```json
{
  "customerId": "1001"
}
```

---

## Complete Compute Module Solution

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE id CHARACTER InputRoot.JSON.Data.customerId;

        SET Environment.Variables.cust[] = PASSTHRU(
            'SELECT NAME, STATUS FROM <TableName> WHERE CUST_ID = ?',
            id
        );

        IF EXISTS(Environment.Variables.cust[]) THEN
            SET OutputRoot.JSON.Data.name   = Environment.Variables.cust.NAME;
            SET OutputRoot.JSON.Data.status = Environment.Variables.cust.STATUS;
        ELSE
            SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 404;
            SET OutputRoot.JSON.Data.error = 'Customer not found';
        END IF;

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected JSON Output (Hit vs 404 Miss)</summary>

```json
// When CUST_ID = '1001' exists (HTTP 200):
{
  "name": "Mona",
  "status": "ACTIVE"
}

// When CUST_ID = '9999' does not exist (HTTP 404):
{
  "error": "Customer not found"
}
```

</details>

### Line-by-Line Breakdown

- **`DECLARE id CHARACTER InputRoot.JSON.Data.customerId;`**: Reads the incoming `customerId` into a typed `CHARACTER` variable.
- **`SET Environment.Variables.cust[] = PASSTHRU('SELECT NAME, STATUS FROM <TableName> WHERE CUST_ID = ?', id);`**:
  - Runs the parameterized SQL query against the Compute node's configured **`Data source`** DSN.
  - The `?` placeholder binds `id` safely (preventing SQL injection and allowing DB statement caching).
  - Storing into `Environment.Variables.cust[]` (with **`[]`**) creates a list of matching rows inside `Environment` (and keeps the lookup available to later nodes if needed!).
- **`IF EXISTS(Environment.Variables.cust[]) THEN`**: Checks whether at least one row came back (`TRUE` on hit, `FALSE` on 0 rows).
- **`Environment.Variables.cust.NAME` / `.STATUS`**: Accesses the `NAME` and `STATUS` columns of the first matched row (equivalent to `cust[1].NAME`).
- **`ELSE SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 404;`**: Runs when 0 rows matched; instructs the downstream `HTTPReply` node to send status **`404 Not Found`**.
- **`SET OutputRoot.JSON.Data.error = 'Customer not found';`**: Sets a clean JSON error body for the 404 response.
- **`RETURN TRUE;`**: Propagates both `OutputRoot` and `OutputLocalEnvironment` (requires **Compute mode = `LocalEnvironment And Message`**!).

> [!WARNING]
> **Two common traps in DB + HTTP flows:**
> 1. If `Compute mode` is left as `Message`, ACE discards `OutputLocalEnvironment` and returns **`200 OK`** even when `error` is `'Customer not found'`!
> 2. If `id` is `NULL` (missing in request), SQL `WHERE CUST_ID = NULL` matches 0 rows, cleanly hitting the `404` branch without crashing.

---

**Next:** [Task 6: Validate Input & Return a Clean HTTP 400 Error →](#topic-251)
