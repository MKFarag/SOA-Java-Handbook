---
id: topic-217
slug: mqsicreateexecutiongroup
topicNumber: 217
title: "mqsicreateexecutiongroup: Add a Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Add a new managed Integration Server inside a running Integration Node."
object: "Integration Server"
action: "Create Server"
commandName: "mqsicreateexecutiongroup"
synonyms:
  - "mqsicreateexecutiongroup"
  - "create integration server"
  - "add server to node"
  - "create execution group"
---

# mqsicreateexecutiongroup: Add a Server

Use **`mqsicreateexecutiongroup`** to add a new Integration Server inside an already-running Integration Node (such as `<IntegrationNodeName>`).

---

## Syntax & Example

```bash
# Make sure node <IntegrationNodeName> is running first!
mqsistart <IntegrationNodeName>

# Create server <IntegrationServerName> inside <IntegrationNodeName>
mqsicreateexecutiongroup <IntegrationNodeName> -e <IntegrationServerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP8071I: Successful command completion.
```

</details>

---

## Good to Know

- Notice the Integration Node **must be running** before calling `mqsicreateexecutiongroup`.
- Verify immediately with `mqsilist <IntegrationNodeName>` — `<IntegrationServerName>` automatically starts as part of creation!
- Need to point directly to a remote Node? Pass host/port or a `.broker` file with `-i` and `-p`.

---

**Next:** [Start & Stop a Managed Integration Server →](#topic-218)
