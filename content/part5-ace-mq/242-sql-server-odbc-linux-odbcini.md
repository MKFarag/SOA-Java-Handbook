---
id: topic-242
slug: sql-server-odbc-linux-odbcini
topicNumber: 242
title: "Connect ACE to SQL Server on Linux (odbc.ini & ODBCINI)"
part: 'Part 5: ACE & MQ'
sectionNumber: 44
sectionTitle: 'SQL Server & Database Setup'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Configure odbc.ini, ACE's bundled DataDirect SQL Server driver (UKsqls95.so), and ODBCINI on Linux or containers."
object: "Linux ODBC Config"
action: "Configure odbc.ini"
commandName: "odbc.ini & ODBCINI"
synonyms:
  - "odbc.ini sql server ace"
  - "uksqls95.so"
  - "odbcini linux ace"
  - "datadirect sql server wire protocol"
---

# Connect ACE to SQL Server on Linux (`odbc.ini` & `ODBCINI`)

On **Linux and Docker containers**, ACE 12 ships with built-in **DataDirect** drivers inside `<ace-install>/server/ODBC/drivers/lib/`. For Microsoft SQL Server, copy a sample `odbc.ini` and point it to **`UKsqls95.so`**.

---

## Step 1: Create Your `odbc.ini` File

Create `<OdbcIniPath>` (matching your ACE installation folder, e.g., `/opt/ibm/ace-12`):

```ini
[ODBC Data Sources]
<DSN_Name>=DataDirect SQL Server Wire Protocol

[<DSN_Name>]
Driver=/opt/ibm/ace-12/server/ODBC/drivers/lib/UKsqls95.so
Description=DataDirect SQL Server Wire Protocol
Database=<DatabaseName>
HostName=<HostName>
PortNumber=1433
AnsiNPW=1
LoginTimeout=0
QueryTimeout=0
InstallDir=/opt/ibm/ace-12/server/ODBC/drivers
UseCursorLib=0
IANAAppCodePage=4
UNICODE=UTF-8
```

*(Connecting to a SQL Server **named instance** instead of port `1433`? Replace `HostName` and omit `PortNumber`: `HostName=<HostName>\<InstanceName>`.)*

---

## Step 2: Export `ODBCINI` & `ODBCSYSINI`

Before running `mqsicvp`, `mqsistart`, or `IntegrationServer`, tell Linux where your `odbc.ini` lives (add this to your shell profile or container entrypoint after sourcing `mqsiprofile`):

```bash
export ODBCINI=<OdbcIniPath>
export ODBCSYSINI=/opt/ibm/ace-12/server/ODBC/drivers/etc
```

---

## Step 3: Check Permissions on `odbc.ini`

```bash
chmod 644 <OdbcIniPath>
```

> [!TIP]
> IBM provides ready-made template files under `<ace-install>/server/ODBC/unixodbc/` (`odbc.ini` and `odbcinst.ini`). Copy IBM's sample instead of typing driver paths from scratch so you match your exact fixpack directory!

---

**Next:** [SQL Server Credentials, mqsicvp Test, JDBC & Flow Query →](#topic-243)
