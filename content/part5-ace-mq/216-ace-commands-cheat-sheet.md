---
id: topic-216
slug: ace-commands-cheat-sheet
topicNumber: 216
title: "ACE Commands Quick Cheat Sheet"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "One-page copy-paste reference for every daily ACE CLI command covering Nodes, Servers, BARs, Flows, and Trace."
object: "ACE CLI Cheat Sheet"
action: "Quick Lookup"
commandName: "ACE CLI Cheat Sheet"
synonyms:
  - "ace commands cheat sheet"
  - "mqsi commands list"
  - "ibmint commands"
---

# ACE Commands Quick Cheat Sheet

All essential ACE 12 commands on one page — replace `SCB` with your Node name, `EG1` with your Server name, or swap `SCB -e EG1` for `-i localhost -p 7600` on an Independent Server.

---

## Daily Commands Table

| Task | Command |
| :--- | :--- |
| **Load CLI environment (Linux)** | `. /opt/ibm/ace-12/server/bin/mqsiprofile` |
| **List all Nodes** | `mqsilist` |
| **List Servers & Apps on Node** | `mqsilist SCB -e EG1` |
| **Create Node + link MQ** | `mqsicreatebroker SCB -q SCBQM` |
| **Start / Stop Node** | `mqsistart SCB` / `mqsistop SCB` |
| **Create / Start / Stop Server** | `mqsicreateexecutiongroup SCB -e EG1` / `mqsistart SCB -e EG1` |
| **Create Independent Server** | `mqsicreateworkdir C:\ace-work\srv1` |
| **Run Independent Server** | `IntegrationServer --name srv1 --work-dir C:\ace-work\srv1` |
| **Package BAR from source** | `ibmint package --input-path C:\ws --output-bar-file App.bar --project App` |
| **Inspect BAR contents** | `mqsireadbar -b App.bar -r` |
| **Deploy BAR to Server** | `mqsideploy SCB -e EG1 -a App.bar` |
| **Stop / Start 1 Flow** | `mqsistopmsgflow SCB -e EG1 -k App -m Flow` / `mqsistartmsgflow ...` |
| **Set DB / MQ credentials** | `mqsisetdbparms SCB -n odbc::DSN -u user -p pass` |
| **Turn User Trace ON / OFF** | `mqsichangetrace SCB -u -e EG1 -l debug -r` / `-l none` |
| **Read & Format Trace** | `mqsireadlog SCB -u -e EG1 -o t.xml && mqsiformatlog -i t.xml -o t.txt` |

---

**Next Section — IBM MQ Commands:** [runmqsc: The Interactive MQ Admin Shell →](#topic-217)
