---
id: topic-203
slug: mqsicreateexecutiongroup
topicNumber: 203
title: "mqsicreateexecutiongroup: Add a Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Add a new managed Integration Server (e.g., EG1) inside a running Integration Node."
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

Use **`mqsicreateexecutiongroup`** to add a new Integration Server inside an already-running Integration Node (such as `SCB`).

---

## Syntax & Example

```bash
# Make sure node SCB is running first!
mqsistart SCB

# Create server EG1 inside SCB
mqsicreateexecutiongroup SCB -e EG1
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
- Verify immediately with `mqsilist SCB` — `EG1` automatically starts as part of creation!
- Need to point directly to a remote Node? Pass host/port or a `.broker` file with `-i` and `-p`.

---

**Next:** [Start & Stop a Managed Integration Server →](#topic-204)
