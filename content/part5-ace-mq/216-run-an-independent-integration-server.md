---
id: topic-216
slug: run-an-independent-integration-server
topicNumber: 216
title: "Run an Independent Integration Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Create a work directory and launch a standalone independent integration server using mqsicreateworkdir and IntegrationServer."
object: "Independent Server"
action: "Run"
commandName: "IntegrationServer"
synonyms:
  - "independent integration server"
  - "standalone integration server"
  - "mqsicreateworkdir"
  - "IntegrationServer --work-dir"
  - "run server without node"
  - "container integration server"
  - "cloud native server"
---

Creates a working directory and launches a standalone, independent integration server directly without creating an integration node.
Use this cloud-native pattern in ACE 12 for rapid local development, containerized deployments (Docker/Podman), and CI/CD pipelines.

```cmd
mqsicreateworkdir <WorkDirPath>
IntegrationServer --name <ServerName> --work-dir <WorkDirPath>
```

| Command / Flag | Required? | Meaning | Example |
| :--- | :--- | :--- | :--- |
| **`mqsicreateworkdir`** | Required (1st time)| Initializes work directory tree and default `server.conf.yaml`. | `mqsicreateworkdir C:\ACE\workdir\server1` |
| **`--name`** | Required | Logical name of the standalone server instance. | `--name dev_server` |
| **`--work-dir`** | Required | Absolute path to the initialized work directory. | `--work-dir C:\ACE\workdir\server1` |
| **`--http-port-number`** | Optional | Sets the HTTP listener port for deployed REST flows. | `--http-port-number 7800` |
| **`--admin-rest-api`** | Optional | Sets the Web UI and administrative REST API port. | `--admin-rest-api 7600` |

### Minimal Example (Windows Command Console)
Initialize directory and launch standalone server `DEV_SRV`:

```cmd
mqsicreateworkdir C:\ACE\workdir\DEV_SRV
IntegrationServer --name DEV_SRV --work-dir C:\ACE\workdir\DEV_SRV
```

```text
2026-11-24 12:00:00.123   12344   IBM App Connect Enterprise runtime version '12.0.3.0'
2026-11-24 12:00:01.456   12344   The HTTP listener for HTTP nodes has been started on port '7800'.
2026-11-24 12:00:02.789   12344   The integration server 'DEV_SRV' is running.
```

* **No Node Required:** Independent servers run directly as standalone OS processes; you do not need `mqsicreatebroker` or IBM MQ installed to run HTTP/REST flows.
* **Stop Server:** Press `Ctrl + C` in the Command Console window to gracefully terminate the standalone server process.
* **Deploy BAR Offline:** You can copy `.bar` files directly into `<WorkDirPath>\run\` before starting the server, and ACE will extract and deploy them automatically.

* [Configure Integration Server (server.conf.yaml)](#topic-217)
* [Create a BAR File (mqsipackagebar)](#topic-198)
* [Deploy a BAR File (mqsideploy)](#topic-199)
