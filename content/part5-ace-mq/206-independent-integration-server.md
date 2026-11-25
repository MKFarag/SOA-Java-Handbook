---
id: topic-206
slug: independent-integration-server
topicNumber: 206
title: "Independent Integration Server (mqsicreateworkdir)"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Create and launch a lightweight, standalone ACE Integration Server in seconds with zero Integration Node required."
object: "Independent Server"
action: "Create & Run"
commandName: "mqsicreateworkdir & IntegrationServer"
synonyms:
  - "independent integration server"
  - "mqsicreateworkdir"
  - "integrationserver command"
  - "docker standalone ace server"
---

# Independent Integration Server (mqsicreateworkdir)

In ACE 12, you don't even have to create an Integration Node for local testing or Docker containers! You can create a folder with **`mqsicreateworkdir`** and launch **`IntegrationServer`** directly.

---

## Step 1: Create the Server Work Directory

```bash
mqsicreateworkdir C:\ace-work\order-srv
```

<details data-type="output">
<summary>What Gets Created Inside C:\ace-work\order-srv</summary>

```text
mqsicreateworkdir: Copying sample server.conf.yaml to C:\ace-work\order-srv
  config/
  overrides/
  run/          <-- Drop .bar files or deployed apps here!
  server.conf.yaml
```

</details>

---

## Step 2: Start the Independent Server

```bash
IntegrationServer --name OrderServer --work-dir C:\ace-work\order-srv
```

<details data-type="output">
<summary>Expected Console Startup Log</summary>

```text
BIP1990I: Integration server 'OrderServer' starting initialization; version '12.0.11.0'
BIP2866I: IBM App Connect Enterprise administration security is inactive.
BIP1991I: Integration server has finished initialization.
```

</details>

---

## When to Pick Independent vs. Node-Managed

| Feature | Independent Server | Node-Managed Server |
| :--- | :--- | :--- |
| Needs `mqsicreatebroker`? | **No!** | Yes |
| Docker / Kubernetes ready? | **Yes — standard pattern** | Rarely used in containers |
| Connect in Toolkit | **Integration Explorer -> Right-click Integration Servers -> Connect** (`localhost:7600`) | Connects automatically under Integration Node |

> [!TIP]
> Notice the process stays attached in your terminal — press **Ctrl+C** to shut it down cleanly when you're done developing!

---

**Next:** [Configure Servers with server.conf.yaml →](#topic-207)
