---
id: topic-155
slug: database-access-from-esql
topicNumber: 155
title: "Database Access from ESQL"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Query, insert, and update relational database tables using PASSTHRU and the Database qualifier."
object: "Database Access"
action: "Query & Update"
commandName: "PASSTHRU Database"
synonyms:
  - "database"
  - "passthru"
  - "odbc"
  - "sql query"
  - "database.table"
  - "mqsisetdbparms"
---

Connects to external SQL relational databases (PostgreSQL, Oracle, Db2) to enrich or persist message data.
Use ESQL database statements to look up customer data, validate accounts, or record transactional ledgers.

```esql
-- Native dynamic SQL via ODBC
SET <Result>[] = PASSTHRU('SELECT name, city FROM customers WHERE id = ?' TO Database.<DataSource> VALUES(<Id>));

-- Direct ESQL table syntax
SET OutputRoot.JSON.Data.customer = THE(SELECT ITEM C.NAME FROM Database.CUSTOMERS AS C WHERE C.ID = 1);
```

| Property / Command | Requirement | Description |
| :--- | :--- | :--- |
| **Compute Node Data Source** | Required | Name of the system ODBC datasource (DSN) configured in Windows ODBC. |
| **`mqsisetdbparms`** | Security Store | CLI command used to store encrypted user and password credentials for the DSN. |
| **`PASSTHRU`** | Statement | Passes parameterized native SQL statements directly to the target database engine. |

```esql
SET OutputRoot.Properties = InputRoot.Properties;
DECLARE custId INTEGER InputRoot.JSON.Data.id;

-- Query customer database using PASSTHRU and parameter substitution (?)
DECLARE dbResult ROW;
SET dbResult.Row[] = PASSTHRU('SELECT full_name, credit_limit FROM clients WHERE client_id = ?' 
                              TO Database.CUSTOMER_DSN 
                              VALUES(custId));

SET OutputRoot.JSON.Data.id = custId;
SET OutputRoot.JSON.Data.clientName = dbResult.Row[1].full_name;
SET OutputRoot.JSON.Data.creditLimit = dbResult.Row[1].credit_limit;
```

* **Parameter Binding:** Always use parameterized SQL (`?` placeholders with `VALUES()`) to prevent SQL injection vulnerabilities.
* **Credentials Store:** Never hardcode passwords in ESQL; store credentials using `mqsisetdbparms <node> -n odbc::<DSN> -u <user> -p <pass>`.
* **Transaction Coordination:** Database updates within a message flow can participate in 2-phase commit coordinated by the queue manager.

* [Variables, Data Types, and Constants](#topic-142)
* [CAST and Type Conversion](#topic-149)
* [ESQL Quick Reference & Cheat Sheet](#topic-156)
