---
id: topic-207
slug: server-conf-yaml-configuration
topicNumber: 207
title: "Configure Servers with server.conf.yaml"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Edit server.conf.yaml to set REST admin ports, HTTP listener ports, default Queue Manager, and JVM heap cleanly."
object: "server.conf.yaml"
action: "Configure YAML"
commandName: "server.conf.yaml"
synonyms:
  - "server.conf.yaml"
  - "restAdminListener port 7600"
  - "defaultQueueManager ace yaml"
  - "overrides server.conf.yaml"
---

# Configure Servers with server.conf.yaml

Every ACE 12 Integration Server is configured through a clean, readable YAML file called **`server.conf.yaml`** (or `overrides/server.conf.yaml`).

---

## Essential Settings Beginners Change Most

```yaml
# Located in <work-dir>/server.conf.yaml
restAdminListener:
  port: 7600                  # Web UI & mqsideploy / Toolkit admin port

defaultQueueManager: '<QueueManagerName>'  # Default local MQ Queue Manager if node doesn't specify one

ResourceManagers:
  HTTPConnector:
    ListenerPort: 7800        # Default port for HTTPInput nodes
  JVM:
    jvmMaxHeapSize: 536870912 # 512 MB max JVM heap
```

---

## 2 Strict YAML Rules (Don't Break Startup!)

1. **Always use SPACES (2 spaces), NEVER TAB characters!** A single Tab in YAML crashes server startup with a YAML parser error.
2. Put custom overrides inside **`overrides/server.conf.yaml`** (only the 3–4 lines you change) — IBM preserves `overrides/` across fixpack upgrades and overrides base settings cleanly!

> [!TIP]
> Remember to restart your `IntegrationServer` after editing `server.conf.yaml` for changes to take effect.

---

**Next:** [BAR Packaging (Toolkit & ibmint package) →](#topic-208)
