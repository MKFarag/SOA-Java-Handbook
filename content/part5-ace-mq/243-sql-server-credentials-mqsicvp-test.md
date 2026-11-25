---
id: topic-243
slug: sql-server-credentials-mqsicvp-test
topicNumber: 243
title: "SQL Server Credentials, mqsicvp Test, JDBC & Flow Query"
part: 'Part 5: ACE & MQ'
sectionNumber: 44
sectionTitle: 'SQL Server & Database Setup'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Bind SQL Server login credentials with mqsisetdbparms, test live with mqsicvp, query SQL Server from ESQL, or configure JDBCProviders."
object: "SQL Server Verification"
action: "Authenticate & Test"
commandName: "mqsisetdbparms & mqsicvp"
synonyms:
  - "mqsicvp sql server"
  - "mqsisetdbparms odbc"
  - "jdbcproviders sql server"
  - "test odbc ace"
  - "sql server compute node"
---

# SQL Server Credentials, `mqsicvp` Test, JDBC & Flow Query

Once your Windows System DSN (or Linux `odbc.ini`) works, finish the setup in **4 simple steps**: save credentials -> test with `mqsicvp` -> reload server -> query in your flow.

---

## Step 1: Save SQL Server Credentials in ACE (`mqsisetdbparms`)

### Option A: Using an Integration Node (`<IntegrationNodeName>`)
```bash
mqsisetdbparms <IntegrationNodeName> -n odbc::<DSN_Name> -u <UserName> -p <Password>
mqsireload <IntegrationNodeName>
```

### Option B: Using an Independent Integration Server (`-w`)
```bash
mqsisetdbparms -w <WorkDirPath> -n odbc::<DSN_Name> -u <UserName> -p <Password>
```
*(Restart `IntegrationServer` afterward so it loads the updated credentials!)*

---

## Step 2: Verify the Connection with `mqsicvp`

Never guess inside a running flow — run **`mqsicvp`** in your ACE Console first:

```bash
# Test against Integration Node <IntegrationNodeName>
mqsicvp <IntegrationNodeName> -n <DSN_Name>

# Or test against an Independent Server / explicit DSN + login
mqsicvp -w <WorkDirPath> -n <DSN_Name>
```

<details data-type="output">
<summary>Expected Output When Connected</summary>

```text
BIP8299I: User '<UserName>' from security resource name 'odbc::<DSN_Name>' will be used for connection to datasource '<DSN_Name>'.
BIP8290I: Verification passed for the ODBC environment.
BIP8071I: Successful command completion.
```

</details>

---

## Step 3: Query SQL Server Inside a `Compute` Node

1. Select your **`Compute`** node -> **Properties -> Basic**.
2. Set **Data source = `<DSN_Name>`**.
3. Query using parameterized ESQL **`PASSTHRU`**:

```esql
SET Environment.Db.Row[] = PASSTHRU(
    'SELECT TOP 1 CUSTOMER_NAME, STATUS FROM dbo.<TableName> WHERE ORDER_ID = ?'
    VALUES(InputRoot.JSON.Data.orderId)
);

SET OutputRoot.JSON.Data.customer = COALESCE(Environment.Db.Row[1].CUSTOMER_NAME, 'Not Found');
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "customer": "<CustomerName>"
}
```

</details>

---

## Bonus: Connecting via `Mapping` or `JavaCompute` (`JDBCProviders` Policy)

If you use a **`Mapping`** node or **`JavaCompute`** (`getJDBCType4Connection`), create a Policy (`Type = JDBCProviders`, e.g. `{<PolicyProjectName>}:<JdbcPolicyName>`) instead of ODBC:

```xml
<policies>
  <policy policyType="JDBCProviders" policyName="<JdbcPolicyName>">
    <databaseName><DatabaseName></databaseName>
    <databaseType>Microsoft_SQL_Server</databaseType>
    <type4DriverClassName>com.microsoft.sqlserver.jdbc.SQLServerDriver</type4DriverClassName>
    <type4DatasourceClassName>com.microsoft.sqlserver.jdbc.SQLServerDataSource</type4DatasourceClassName>
    <connectionUrlFormat>jdbc:sqlserver://[serverName]:[portNumber];databaseName=[databaseName];encrypt=true;trustServerCertificate=true</connectionUrlFormat>
    <serverName>localhost</serverName>
    <portNumber>1433</portNumber>
    <jarsURL><PathToJdbcDriversFolder></jarsURL>
    <securityIdentity><SecurityIdentityName></securityIdentity>
  </policy>
</policies>
```

Then register the matching JDBC login:
```bash
mqsisetdbparms <IntegrationNodeName> -n jdbc::<SecurityIdentityName> -u <UserName> -p <Password>
mqsireload <IntegrationNodeName>
```

---

## Top 5 SQL Server Setup Errors & Fixes

| Symptom / Error | Exact Cause | Fix |
| :--- | :--- | :--- |
| `Data source name not found` | Created **32-bit** DSN instead of **64-bit** System DSN on Windows | Recreate inside `C:\Windows\System32\odbcad32.exe` -> **System DSN** |
| Works in terminal, fails in flow | Used **User DSN** instead of **System DSN** (or forgot `ODBCINI` on Linux) | Always use **System DSN** on Windows / export `ODBCINI` before `mqsistart` |
| Connection refused / timeout | SQL Server **TCP/IP** protocol disabled, port `1433` blocked, or Browser service off | Check **`netstat -ano \| findstr :1433`** (`LISTENING`) & `Test-NetConnection -Port 1433`; enable TCP/IP `1433` (and **SQL Server Browser** UDP `1434` for named instances) |
| `Login failed for user` / old password | Ran `mqsisetdbparms` while server was running without reloading | Run `mqsireload <IntegrationNodeName>` (or restart Independent `IntegrationServer`) |
| `PKIX` / SSL verify error (ODBC 18 / JDBC) | Self-signed SQL Server cert rejected | Set `TrustServerCertificate=Yes` (ODBC) or `trustServerCertificate=true` (JDBC URL) |

---

**Next Section — BIP Codes Reference:** [BIP Codes Reference Directory (By Symptom) →](#topic-244)
