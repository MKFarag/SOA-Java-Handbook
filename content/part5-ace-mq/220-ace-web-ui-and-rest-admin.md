---
id: topic-220
slug: ace-web-ui-and-rest-admin
topicNumber: 220
title: "ACE Web User Interface & REST Admin Port"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Monitor flows, deploy BARs, and toggle User Trace directly from your web browser using the built-in ACE Web UI."
object: "ACE Web UI"
action: "Monitor in Browser"
commandName: "ACE Web UI"
synonyms:
  - "ace web user interface"
  - "port 4414 7600 ace"
  - "browser dashboard ace"
  - "data flow statistics web ui"
---

# ACE Web User Interface & REST Admin Port

Every ACE Node and Independent Integration Server ships with a clean **browser Web UI** where you can deploy BAR files, start/stop flows, and view message throughput charts — without installing the Toolkit on that server.

![IBM App Connect Enterprise Web User Interface showing deployed flows, statistics, and controls](/images/ace/ace-web-user-interface.png)

---

## Default Browser URLs

| Setup | Default Port | Open in Browser |
| :--- | :--- | :--- |
| **Integration Node** (`<IntegrationNodeName>`) | **`4414`** | `http://localhost:4414` |
| **Independent Integration Server** | **`7600`** | `http://localhost:7600` |

*(Confirm exact port anytime in `server.conf.yaml` -> `restAdminListener.port` or `mqsireportproperties <Node> -b webadmin -o HTTPConnector -a`.)*

---

## 3 Handy Things in the Web UI

1. **Test User Trace visually:** Turn **User Trace** ON -> run test -> download formatted trace right from the browser (no `mqsireadlog` CLI needed!).
2. **Flow Statistics:** Click the **Statistics** tab on any server to see exact CPU time, average message latency, and errors per flow in real time!
3. **Drag-and-drop BAR Deploy:** Upload `.bar` packages directly into the server through the browser.

---

**Next:** [ACE Commands Quick Cheat Sheet →](#topic-221)
