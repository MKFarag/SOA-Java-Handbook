---
id: topic-197
slug: mqsilist-inspect-nodes-servers
topicNumber: 197
title: "mqsilist: Inspect Nodes, Servers & Flows"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
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
| `mqsilist SCB` | All Integration Servers (e.g., `EG1`) running inside node `SCB` |
| `mqsilist SCB -e EG1` | All Applications, Libraries, and Policies deployed on server `EG1` |
| `mqsilist SCB -e EG1 -k OrderApp -d 2` | Deep view (`-d 2`) of every flow, status, and endpoints inside `OrderApp` |

---

## Fast Example

```bash
mqsilist SCB -e EG1
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1275I: Application 'OrderApp' on integration server 'EG1' is running.
BIP1284I: Integration server 'EG1' on integration node 'SCB' is running.
BIP8071I: Successful command completion.
```

</details>

---

> [!TIP]
> Running an **Independent Integration Server**? Point `mqsilist` directly at its HTTP admin port: `mqsilist -i localhost -p 7600 -d 2`!

---

**Next:** [mqsicreatebroker & mqsideletebroker →](#topic-198)
