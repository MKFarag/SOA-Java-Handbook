---
id: topic-198
slug: mqsicreatebroker-and-mqsideletebroker
topicNumber: 198
title: "mqsicreatebroker & mqsideletebroker"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create a brand-new Integration Node (optionally linked to an MQ Queue Manager) or delete a stopped node."
object: "Integration Node"
action: "Create & Delete"
commandName: "mqsicreatebroker"
synonyms:
  - "mqsicreatebroker"
  - "mqsideletebroker"
  - "create integration node"
  - "delete integration node"
---

# mqsicreatebroker & mqsideletebroker

Use **`mqsicreatebroker`** to create an Integration Node on your machine, and **`mqsideletebroker`** to remove it cleanly when no longer needed.

---

## Create an Integration Node

```bash
# Without MQ link (HTTP / File flows only)
mqsicreatebroker <IntegrationNodeName>

# Linked to local IBM MQ Queue Manager <QueueManagerName> (recommended for MQ flows)
mqsicreatebroker <IntegrationNodeName> -q <QueueManagerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP8071I: Successful command completion.
```

</details>

---

## Delete an Integration Node (Must Be Stopped First!)

```bash
mqsistop <IntegrationNodeName>
mqsideletebroker <IntegrationNodeName>
```

- Notice deleting an Integration Node deletes its managed servers and deployed flows inside it — add **`-w`** (`mqsideletebroker <IntegrationNodeName> -w`) if you also want to clean its workpath/registry files cleanly.

> [!NOTE]
> Remember IBM MQ Queue Manager `<QueueManagerName>` must **already exist** before linking it with `-q <QueueManagerName>`, or creation succeeds with a warning and startup later fails until `<QueueManagerName>` is created.

---

**Next:** [mqsistart & mqsistop (Integration Nodes) →](#topic-199)
