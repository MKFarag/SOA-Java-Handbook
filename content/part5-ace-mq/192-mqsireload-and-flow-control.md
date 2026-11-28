---
id: topic-192
slug: mqsireload-and-flow-control
topicNumber: 192
title: "mqsireload: Restart Execution Groups & Reload Policies"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Use mqsireload to bounce managed servers after updating security/DB credentials (mqsisetdbparms) or shared classes."
object: "Server Reload"
action: "Reload Server"
commandName: "mqsireload"
synonyms:
  - "mqsireload"
  - "mqsisetdbparms"
  - "reload execution group"
---

# mqsireload: Restart Execution Groups & Reload Policies

After running **`mqsisetdbparms`** (setting database or MQ credentials) or updating security profiles, an Integration Server only picks up the new credentials once reloaded with **`mqsireload`**.

---

## Syntax & Fast Example

```bash
# 1. Set or update ODBC database credentials on node <IntegrationNodeName>
mqsisetdbparms <IntegrationNodeName> -n odbc::<DSN_Name> -u <UserName> -p <Password>

# 2. Reload server <IntegrationServerName> immediately so it picks up new credentials
mqsireload <IntegrationNodeName> -e <IntegrationServerName>

# Or reload ALL managed servers on node <IntegrationNodeName>
mqsireload <IntegrationNodeName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP8071I: Successful command completion.
```

</details>

---

> [!NOTE]
> `mqsireload` briefly stops and starts the Integration Server process (similar to `mqsistop -e` + `mqsistart -e` in a single atomic command). Use `-i` for immediate restart if an active flow is stuck.
> Need full SQL Server ODBC credential & `mqsicvp` setup? See **[SQL Server Credentials & mqsicvp Test →](#topic-218)**.

---

**Next:** [mqsichangetrace: Turn User & Service Trace On/Off →](#topic-193)
