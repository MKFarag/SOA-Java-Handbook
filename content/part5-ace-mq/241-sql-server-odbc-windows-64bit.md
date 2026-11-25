---
id: topic-241
slug: sql-server-odbc-windows-64bit
topicNumber: 241
title: "Connect ACE to SQL Server on Windows (64-bit ODBC)"
part: 'Part 5: ACE & MQ'
sectionNumber: 44
sectionTitle: 'SQL Server & Database Setup'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Complete step-by-step guide to creating a 64-bit System DSN in Windows so IBM ACE can connect to Microsoft SQL Server."
object: "Windows ODBC DSN"
action: "Configure 64-bit DSN"
commandName: "odbcad32.exe (64-bit)"
synonyms:
  - "sql server odbc windows ace"
  - "odbc data source administrator 64-bit"
  - "system dsn sql server"
  - "odbcad32.exe"
---

# Connect ACE to SQL Server on Windows (64-bit ODBC)

On **Windows**, IBM ACE does **not** use text `.ini` files — it reads **System DSNs** directly from the **64-bit** Windows ODBC Data Source Administrator.

---

## Step 1: Make Sure You Have a 64-bit SQL Server ODBC Driver

Check that **ODBC Driver 17 for SQL Server** or **ODBC Driver 18 for SQL Server** (x64) is installed on Windows. *(If missing, install Microsoft's free "Microsoft ODBC Driver for SQL Server x64".)*

---

## Step 2: Open the **64-bit** ODBC Administrator (Very Important!)

1. Press **Win + R**, type the exact full 64-bit path, and press **Enter**:

```text
C:\Windows\System32\odbcad32.exe
```

*(Never open the 32-bit one inside `SysWOW64` — ACE is a 64-bit process and cannot see 32-bit DSNs!)*

2. Click the **`System DSN`** tab at the top *(do **not** use User DSN — User DSNs fail when ACE runs under a service account or different user!)*.
3. Click **`Add...`**.
4. Select **`ODBC Driver 17 for SQL Server`** (or `18`) -> click **`Finish`**.

---

## Step 3: Fill the SQL Server Wizard

| Screen Field | What to Enter | Example |
| :--- | :--- | :--- |
| **Name** | Exact DSN name you will put in ACE `Data source` | `<DSN_Name>` |
| **Description** | Short label (optional) | `SQL Server Orders DB` |
| **Server** | Host + port or named instance | `localhost,1433` or `<HostName>\<InstanceName>` |
| **Authentication** | Pick **With SQL Server authentication...** *(recommended for ACE `mqsisetdbparms`)* | Login ID: `<UserName>`, Password: `<Password>` |
| **Change the default database to** | Check this box and select your DB! | `<DatabaseName>` |

---

## Step 4: Test the Data Source Before Clicking OK!

1. Keep clicking **Next** until **Finish**.
2. Click **`Test Data Source...`**.
3. Make sure you see **`TESTS COMPLETED SUCCESSFULLY!`** before clicking **OK** -> **OK**.

> [!WARNING]
> **Using ODBC Driver 18 for SQL Server?** Driver 18 enables TLS encryption (`Encrypt=Yes`) by default. For local dev servers without a trusted CA certificate, pick **Optional** under **Connection Encryption** or check **Trust Server Certificate** in the wizard, otherwise `Test Data Source` fails with an SSL certificate error!

---

**Next:** [Connect ACE to SQL Server on Linux (odbc.ini & ODBCINI) →](#topic-242)
