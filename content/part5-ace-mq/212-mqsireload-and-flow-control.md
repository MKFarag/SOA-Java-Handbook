---
id: topic-212
slug: mqsireload-and-flow-control
topicNumber: 212
title: "mqsireload: Restart Execution Groups & Reload Policies"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
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
# 1. Set or update ODBC database credentials on node SCB
mqsisetdbparms SCB -n odbc::ORDERS_DB -u appuser -p MyPass123

# 2. Reload server EG1 immediately so it picks up new credentials
mqsireload SCB -e EG1

# Or reload ALL managed servers on node SCB
mqsireload SCB
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
> Need full SQL Server ODBC credential & `mqsicvp` setup? See **[SQL Server Credentials & mqsicvp Test →](#topic-238)**.

---

**Next:** [mqsichangetrace: Turn User & Service Trace On/Off →](#topic-213)
