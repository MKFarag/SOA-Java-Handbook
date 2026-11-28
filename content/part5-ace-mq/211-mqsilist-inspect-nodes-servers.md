---
id: topic-211
slug: mqsilist-inspect-nodes-servers
topicNumber: 211
title: "mqsilist: Inspect Nodes, Servers & Flows"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "List all Integration Nodes, managed Integration Servers, deployed Applications, and live Message Flow statuses."
object: "mqsilist"
action: "Inspect Runtime"
commandName: "mqsilist"
synonyms:
  - "mqsilist"
  - "list integration nodes"
  - "list deployed flows"
  - "bip1284i bip1325i"
---

# mqsilist: Inspect Nodes, Servers & Flows

**`mqsilist`** is your status camera for ACE — run it with no flags for nodes, add a node name for servers, or drill all the way down to running flows.

![Integration Explorer panel matching the node, server, and deployed resource tree shown by mqsilist](/images/ace/integration-explorer-nodes.png)

---

## Syntax Levels (Zoom In Deeper)

| Command | What It Shows |
| :--- | :--- |
| `mqsilist` | Every Integration Node on this PC + linked Queue Manager + status |
| `mqsilist <IntegrationNodeName>` | All Integration Servers (`<IntegrationServerName>`) running inside node `<IntegrationNodeName>` |
| `mqsilist <IntegrationNodeName> -e <IntegrationServerName>` | All Applications, Libraries, and Policies deployed on server `<IntegrationServerName>` |
| `mqsilist <IntegrationNodeName> -e <IntegrationServerName> -k <ApplicationName> -d 2` | Deep view (`-d 2`) of every flow, status, and endpoints inside `<ApplicationName>` |

---

## Fast Example

```bash
mqsilist <IntegrationNodeName> -e <IntegrationServerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1275I: Application '<ApplicationName>' on integration server '<IntegrationServerName>' is running.
BIP1284I: Integration server '<IntegrationServerName>' on integration node '<IntegrationNodeName>' is running.
BIP8071I: Successful command completion.
```

</details>

---

> [!TIP]
> Running an **Independent Integration Server**? Point `mqsilist` directly at its HTTP admin port: `mqsilist -i localhost -p 7600 -d 2`!

---

**Next:** [mqsicreatebroker & mqsideletebroker →](#topic-212)
