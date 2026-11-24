---
id: topic-217
slug: configure-integration-server-yaml
topicNumber: 217
title: "Configure Integration Server (server.conf.yaml)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Configure HTTP ports, JVM heap size, resource statistics, and security in the server.conf.yaml configuration file."
object: "Integration Server"
action: "Configure"
commandName: "server.conf.yaml"
synonyms:
  - "server.conf.yaml"
  - "configure integration server"
  - "server config yaml"
  - "integration server port"
  - "jvm heap size ace"
  - "server properties"
---

Controls runtime configuration parameters for an integration server using the standard `server.conf.yaml` file.
Use this file to customize HTTP listener ports, Web UI admin ports, JVM heap sizes, and telemetry without running CLI commands.

```yaml
# server.conf.yaml
HTTPConnector:
  port: 7800
RestAdminListener:
  port: 7600
ResourceManagers:
  JVM:
    jvmMinHeapSize: 256M
    jvmMaxHeapSize: 512M
```

| Section & Key | Default | Meaning | Typical Production Value |
| :--- | :--- | :--- | :--- |
| **`HTTPConnector.port`** | `7800` | Port for message flow HTTPInput nodes. | `7800` (or `7843` for HTTPS) |
| **`RestAdminListener.port`**| `7600` | Port for the Web Admin UI and REST API. | `7600` |
| **`JVM.jvmMinHeapSize`** | `32M` | Minimum initial JVM heap memory allocated. | `256M` |
| **`JVM.jvmMaxHeapSize`** | `256M` | Maximum JVM memory limit before OutOfMemory. | `512M` or `1024M` |
| **`Statistics.NodeData.publicationOn`**| `inactive` | Emits flow accounting and performance stats. | `active` |

### File Locations on Disk
* **Independent Server:** `<WorkDirPath>\server.conf.yaml`
* **Node-Managed Server:** `C:\ProgramData\IBM\MQSI\components\<NodeName>\<ServerName>\server.conf.yaml`

### Minimal Example: Changing the HTTP Port
Open `<WorkDirPath>\server.conf.yaml` in a text editor and update:

```yaml
Connector:
  HTTPConnector:
    port: 7805
```

Restart the server:
```cmd
IntegrationServer --name DEV_SRV --work-dir C:\ACE\workdir\DEV_SRV
```

* **Restart Required:** Changes made to `server.conf.yaml` take effect only after restarting the integration server process.
* **Strict YAML Formatting:** Use 2 spaces for indentation; tabs are illegal in YAML and cause startup parse errors (`BIP4040E`).
* **Environment Overrides:** You can override any YAML property dynamically at startup using environment variables, e.g. `MQSI_SERVER_HTTPCONNECTOR_PORT=7805`.

* [Run an Independent Integration Server (IntegrationServer)](#topic-216)
* [Start an Integration Server (mqsistartmsgflow -e)](#topic-214)
* [BIP Codes Reference](#topic-206)
