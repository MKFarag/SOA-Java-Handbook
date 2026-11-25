---
id: topic-204
slug: mqsistart-and-stop-server-command
topicNumber: 204
title: "Start & Stop a Managed Integration Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Start or stop one specific Integration Server (like EG1) without restarting the entire Integration Node."
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
# Stop ONLY server EG1 inside node SCB (other servers keep running!)
mqsistop SCB -e EG1

# Start ONLY server EG1 back up
mqsistart SCB -e EG1
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1285I: Integration server 'EG1' on integration node 'SCB' has been stopped.
BIP1284I: Integration server 'EG1' on integration node 'SCB' is running.
BIP8071I: Successful command completion.
```

</details>

---

> [!TIP]
> Verify right away with `mqsilist SCB` — if a server fails to come back up, check `mqsicvp` or Windows Event Viewer / syslog for port conflicts (`HTTPConnector` port already bound).

---

**Next:** [mqsideleteexecutiongroup: Remove a Server →](#topic-205)
