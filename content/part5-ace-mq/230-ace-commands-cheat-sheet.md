---
id: topic-230
slug: ace-commands-cheat-sheet
topicNumber: 230
title: "ACE Commands Quick Cheat Sheet"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
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

All essential ACE 12 commands on one page — replace `<IntegrationNodeName>` with your Node name, `<IntegrationServerName>` with your Server name, or swap `<IntegrationNodeName> -e <IntegrationServerName>` for `-i localhost -p 7600` on an Independent Server.

---

## Daily Commands Table

| Task | Command |
| :--- | :--- |
| **Load CLI environment (Linux)** | `. /opt/ibm/ace-12/server/bin/mqsiprofile` |
| **List all Nodes** | `mqsilist` |
| **List Servers & Apps on Node** | `mqsilist <IntegrationNodeName> -e <IntegrationServerName>` |
| **Create Node + link MQ** | `mqsicreatebroker <IntegrationNodeName> -q <QueueManagerName>` |
| **Start / Stop Node** | `mqsistart <IntegrationNodeName>` / `mqsistop <IntegrationNodeName>` |
| **Create / Start / Stop Server** | `mqsicreateexecutiongroup <IntegrationNodeName> -e <IntegrationServerName>` / `mqsistart <IntegrationNodeName> -e <IntegrationServerName>` |
| **Create Independent Server** | `mqsicreateworkdir <WorkDirPath>` |
| **Run Independent Server** | `IntegrationServer --name <IntegrationServerName> --work-dir <WorkDirPath>` |
| **Package BAR from source** | `ibmint package --input-path <WorkspacePath> --output-bar-file <BarFileName>.bar --project <ApplicationName>` |
| **Inspect BAR contents** | `mqsireadbar -b <BarFileName>.bar -r` |
| **Deploy BAR to Server** | `mqsideploy <IntegrationNodeName> -e <IntegrationServerName> -a <BarFileName>.bar` |
| **Stop / Start 1 Flow** | `mqsistopmsgflow <IntegrationNodeName> -e <IntegrationServerName> -k <ApplicationName> -m <MessageFlowName>` / `mqsistartmsgflow ...` |
| **Set DB / MQ credentials** | `mqsisetdbparms <IntegrationNodeName> -n odbc::<DSN_Name> -u <UserName> -p <Password>` |
| **Turn User Trace ON / OFF** | `mqsichangetrace <IntegrationNodeName> -u -e <IntegrationServerName> -l debug -r` / `-l none` |
| **Read & Format Trace** | `mqsireadlog <IntegrationNodeName> -u -e <IntegrationServerName> -o <TraceXmlFile> && mqsiformatlog -i <TraceXmlFile> -o <TraceTxtFile>` |

---

**Next Section — IBM MQ Commands:** [runmqsc: The Interactive MQ Admin Shell →](#topic-231)
