---
id: topic-235
slug: odbc-vs-jdbc-in-ace
topicNumber: 235
title: "ODBC vs JDBC in ACE: Which Database Setup Do You Need?"
part: 'Part 5: ACE & MQ'
sectionNumber: 44
sectionTitle: 'SQL Server & Database Setup'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Know when ACE needs an ODBC Data Source (Compute, Database, Filter) versus a JDBC Providers Policy (Mapping, JavaCompute)."
object: "ODBC vs JDBC"
action: "Choose Connection"
commandName: "ODBC vs JDBC"
synonyms:
  - "odbc vs jdbc ace"
  - "sql server ace setup"
  - "database connection ace"
  - "which nodes use odbc"
---

# ODBC vs JDBC in ACE: Which Database Setup Do You Need?

In IBM App Connect Enterprise (ACE), **the node you put on your flow decides whether you set up ODBC or JDBC** to talk to Microsoft SQL Server.

![Diagram showing Compute/Database using OS ODBC DSN vs Mapping/JavaCompute using JDBCProviders Policy to reach SQL Server](/images/ace/diagram-sql-server-odbc-jdbc.svg)

---

## Side-by-Side Comparison

| Node You Use | Connection Type Required | Where You Configure Connection | Driver Needed |
| :--- | :--- | :--- | :--- |
| **`Compute` / `Database` / `Filter`** | **ODBC (System DSN)** | OS ODBC (`odbcad32.exe` on Windows, `odbc.ini` on Linux) + node **Data source** property | 64-bit SQL Server ODBC driver (or ACE DataDirect `UKsqls95.so` on Linux) |
| **`Mapping` / `JavaCompute`** | **JDBC (`JDBCProviders` Policy)** | Policy Project (`type=JDBCProviders`) + server `jarsURL` | Microsoft `mssql-jdbc-*.jar` |

---

## Quick Checklist Before Connecting to SQL Server

Make sure **SQL Server itself** allows TCP connections first (especially on a local dev PC where TCP/IP is often **disabled** after install!):

1. Open **SQL Server Configuration Manager** -> **SQL Server Network Configuration -> Protocols for `<INSTANCE>`**.
2. Right-click **TCP/IP** -> **Enable**.
3. Double-click **TCP/IP** -> **IP Addresses** tab -> scroll to **IPAll** -> set **TCP Port = `1433`** (and clear TCP Dynamic Ports).
4. **Restart** the `SQL Server` Windows service.

> [!TIP]
> If your flow uses **ESQL inside a `Compute` node** (the most common pattern in ACE), follow the **ODBC** path in the next topic! You only need `JDBCProviders` if you query tables inside a **Mapping (`.map`)** or **JavaCompute** node.

---

**Next:** [Connect ACE to SQL Server on Windows (64-bit ODBC) →](#topic-236)
