---
id: topic-188
slug: esql-database-passthru-select
topicNumber: 188
title: "Database Queries: SELECT, PASSTHRU & INSERT"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Run SQL queries directly from a Compute or Database node using PASSTHRU, THE(SELECT...), and parameterized queries."
object: "Database ESQL"
action: "Query Database"
commandName: "PASSTHRU SELECT INSERT"
synonyms:
  - "esql database passthru"
  - "esql select query"
  - "odbc dsn compute node"
  - "the select item esql"
---

# Database Queries: SELECT, PASSTHRU & INSERT

ACE connects to Oracle, PostgreSQL, DB2, or SQL Server via an **ODBC Data Source (DSN)**. Set the DSN name in your Compute node's **Data source** property, then query using **`PASSTHRU`** or **`SELECT`**.

---

## 1. Parameterized `PASSTHRU` Lookup (Safe & Clean)

Always pass inputs using **`?`** placeholders to prevent SQL injection and enable DB plan caching:

```esql
DECLARE custId CHARACTER InputRoot.JSON.Data.customerId;
SET Environment.DbResult.Row[] = PASSTHRU(
    'SELECT FULL_NAME, TIER FROM <TableName> WHERE ID = ?'
    VALUES(custId)
);

SET OutputRoot.JSON.Data.name = COALESCE(Environment.DbResult.Row[1].FULL_NAME, 'Not Found');
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "name": "<CustomerName>"
}
```

</details>

---

## 2. Parameterized `INSERT` via `PASSTHRU`

```esql
PASSTHRU(
    'INSERT INTO <AuditTableName> (ORDER_ID, STATUS) VALUES (?, ?)'
    VALUES(InputRoot.JSON.Data.orderId, 'CREATED')
);
```

---

## Don't Forget Credentials on the Node!

1. Configure your OS ODBC DSN (`<DSN_Name>`) — see the full **[SQL Server Windows (64-bit) guide](#topic-236)** or **[Linux `odbc.ini` guide](#topic-237)**.
2. Register DB user/password with ACE: `mqsisetdbparms <IntegrationNodeName> -n odbc::<DSN_Name> -u <UserName> -p <Password>` and verify with **[`mqsicvp`](#topic-238)**.
3. Set **Data source = `<DSN_Name>`** on the Compute node.

> [!WARNING]
> Check **Transaction** property on your Compute node (`Automatic` commits/rolls back DB + MQ together, whereas `Commit` commits DB changes immediately even if the flow fails downstream!).

---

**Next:** [ESQL Error Handling (THROW & SQLSTATE) →](#topic-189)
