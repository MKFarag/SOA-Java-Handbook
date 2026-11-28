---
id: topic-239
slug: esql-database-passthru-select
topicNumber: 239
title: "Database Access: PASSTHRU, Parameters & Setup"
part: 'Part 6: ESQL'
sectionNumber: 46
sectionTitle: 'Advanced'
versionBadge: 'ESQL'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Query and update SQL Server, DB2, Oracle, or PostgreSQL from ESQL using parameterized PASSTHRU, DSN configuration, credentials/vault, and Transaction modes."
object: "Database ESQL"
action: "Query Database"
commandName: "PASSTHRU VALUES EXISTS"
synonyms:
  - "esql passthru select"
  - "esql database lookup"
  - "odbc dsn compute node"
  - "passthru values vs positional"
  - "compute node transaction automatic commit"
---

# Database Access: `PASSTHRU`, Parameters & Setup

**`Compute`**, **`Database`**, and **`Filter`** nodes talk to relational databases (SQL Server, DB2, Oracle, PostgreSQL) through an **ODBC Data Source (DSN)**. Configure the DSN name in the node's **Data source** property, then run SQL using **`PASSTHRU`**.

---

## 1. Parameterized `PASSTHRU` Lookup & `INSERT`

Always bind user inputs via **`?`** placeholders — never concatenate strings into SQL (`'WHERE ID = ' || id`), which opens SQL injection vulnerabilities and breaks database query plan caching.

ESQL accepts **two equivalent ways** to pass parameters to `PASSTHRU`: positional arguments (`PASSTHRU(sql, p1, p2)`) or the explicit `VALUES(...)` clause (`PASSTHRU(sql VALUES(p1, p2))`):

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE id CHARACTER InputRoot.JSON.Data.customerId;

        -- 1. Positional parameter style (clean for short lookups)
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

        -- 2. Explicit VALUES(...) style for INSERT / UPDATE statements
        PASSTHRU(
            'INSERT INTO <AuditTableName> (CUST_ID, RESULT) VALUES (?, ?)'
            VALUES(id, COALESCE(Environment.Variables.cust.STATUS, 'NOT_FOUND'))
        );

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (When Customer Exists vs Missing)</summary>

```json
// Found in DB:
{
  "name": "Mona",
  "status": "ACTIVE"
}

// Not found in DB (HTTP 404 when Compute mode = LocalEnvironment And Message):
{
  "error": "Customer not found"
}
```

</details>

### Line-by-Line Breakdown

- **`SET Environment.Variables.cust[] = PASSTHRU('SELECT ... WHERE CUST_ID = ?', id);`**:
  - Executes the SQL `SELECT` against the Compute node's **Data source** (`<DSN_Name>`) and stores all returned rows under `Environment.Variables.cust[]` (notice the `[]` list suffix on the left-hand side so ACE can store 0, 1, or many rows!).
  - Passes `id` to replace the `?` parameter safely as a bound SQL parameter.
- **`IF EXISTS(Environment.Variables.cust[]) THEN`**: Returns `TRUE` if at least 1 row came back from the database, or `FALSE` if the result set was empty (`0` rows).
- **`Environment.Variables.cust.NAME`**: Reads the `NAME` column from the first matched row (equivalent to `Environment.Variables.cust[1].NAME`). Be aware that some databases return column names in uppercase (`NAME`) unless aliased!
- **`SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 404;`**: Sets HTTP `404` when no row matched (requires **Compute mode = `LocalEnvironment And Message`**).
- **`PASSTHRU('INSERT INTO <AuditTableName> ... VALUES (?, ?)' VALUES(id, ...));`**: Executes a parameterized `INSERT` statement without returning rows (`PASSTHRU` can be called as a standalone statement for `INSERT`/`UPDATE`/`DELETE`). Notice `VALUES(...)` is an alternative to comma-separated parameters after the SQL string.

---

## 2. Required Node & Server Setup (3 Steps)

1. **OS ODBC DSN (`<DSN_Name>`):** Configure your 64-bit System DSN on Windows (**[SQL Server Windows guide](#topic-216)**) or `odbc.ini` on Linux (**[Linux `odbc.ini` guide](#topic-217)**).
2. **Database Credentials (`mqsisetdbparms` or ACE Vault):**
   - Classic credentials: `mqsisetdbparms <IntegrationNodeName> -n odbc::<DSN_Name> -u <UserName> -p <Password>` (verify with **[`mqsicvp`](#topic-218)**).
   - Modern encrypted vault (ACE 12/13): store credentials with `mqsivault` / `mqsicredentials --vault-key ... --create --credential-type odbc --credential-name <DSN_Name> ...`.
3. **Node Properties (`Compute` / `Database` / `Filter`):**
   - Set **Data source** = `<DSN_Name>`.
   - Check **Transaction** property: **`Automatic`** commits or rolls back DB work together with the rest of the flow (e.g., if a later node throws an exception, the `INSERT` rolls back); **`Commit`** commits the SQL immediately inside that node even if the flow fails downstream.

> [!WARNING]
> **Avoid `PASSTHRU` string concatenation!** Never build dynamic SQL by gluing user input with `||` (`'WHERE ID = ''' || id || ''''`). Always use `?` parameter placeholders so both security and database statement caching stay intact.

---

**Next:** [Error Handling: THROW, Handlers & ExceptionList →](#topic-240)
