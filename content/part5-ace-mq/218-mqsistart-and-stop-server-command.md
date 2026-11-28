---
id: topic-218
slug: mqsistart-and-stop-server-command
topicNumber: 218
title: "Start & Stop a Managed Integration Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Start or stop one specific Integration Server without restarting the entire Integration Node."
object: "Managed Server"
action: "Start & Stop Server"
commandName: "mqsistart -e / mqsistop -e"
synonyms:
  - "start integration server"
  - "stop integration server"
  - "mqsistart -e"
  - "mqsistop -e"
---

# Start & Stop a Managed Integration Server

You don't have to reboot the entire Integration Node just to restart one server — pass **`-e <ServerName>`** to `mqsistop` and `mqsistart`.

---

## Syntax & Example

```bash
# Stop ONLY server <IntegrationServerName> inside node <IntegrationNodeName> (other servers keep running!)
mqsistop <IntegrationNodeName> -e <IntegrationServerName>

# Start ONLY server <IntegrationServerName> back up
mqsistart <IntegrationNodeName> -e <IntegrationServerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1285I: Integration server '<IntegrationServerName>' on integration node '<IntegrationNodeName>' has been stopped.
BIP1284I: Integration server '<IntegrationServerName>' on integration node '<IntegrationNodeName>' is running.
BIP8071I: Successful command completion.
```

</details>

---

> [!TIP]
> Verify right away with `mqsilist <IntegrationNodeName>` — if a server fails to come back up, check `mqsicvp` or Windows Event Viewer / syslog for port conflicts (`HTTPConnector` port already bound).

---

**Next:** [mqsideleteexecutiongroup: Remove a Server →](#topic-219)
