---
id: topic-181
slug: mqsichangeproperties-guide
topicNumber: 181
title: "Change Properties Live (mqsichangeproperties)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Modify HTTP ports, JVM memory, or embedded cache settings on a running Integration Node or Server."
object: "Runtime Properties"
action: "Modify Config"
commandName: "mqsichangeproperties"
synonyms:
  - "mqsichangeproperties"
  - "change http port ace"
  - "jvmMaxHeapSize mqsichangeproperties"
  - "edit node config cli"
---

# Change Properties Live (mqsichangeproperties)

Use **`mqsichangeproperties`** to update server or node settings from the command line — notice you always pass the Node (`<IntegrationNodeName>`), optional Server (`-e <IntegrationServerName>`), component (`-o`), property name (`-n`), and new value (`-v`).

---

## Syntax & Fast Examples

```bash
# Change server <IntegrationServerName> embedded HTTP port to 7808
mqsichangeproperties <IntegrationNodeName> -e <IntegrationServerName> -o HTTPConnector -n port -v 7808

# Increase JVM max heap to 1 GB on server <IntegrationServerName>
mqsichangeproperties <IntegrationNodeName> -e <IntegrationServerName> -o ComIbmJVMManager -n jvmMaxHeapSize -v 1073741824

# Restart server so changes take effect cleanly
mqsistop <IntegrationNodeName> -e <IntegrationServerName> && mqsistart <IntegrationNodeName> -e <IntegrationServerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP8071I: Successful command completion.
```

</details>

---

## Key Flags Cheat Table

| Flag | Meaning | Example |
| :--- | :--- | :--- |
| **`-e <IntegrationServerName>`** | Target Integration Server (omit for Node-wide) | `-e <IntegrationServerName>` |
| **`-o`** | Object/component name | `-o HTTPConnector`, `-o ComIbmJVMManager` |
| **`-n`** | Property name | `-n port` |
| **`-v`** | New value | `-v 7808` |

> [!NOTE]
> Many property updates (especially `ComIbmJVMManager` and listener ports) require restarting the Integration Server (or Node) before taking effect.

---

**Next:** [Managed Integration Servers (Overview) →](#topic-182)
