---
id: topic-219
slug: mqsideleteexecutiongroup
topicNumber: 219
title: "mqsideleteexecutiongroup: Remove a Server"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Permanently delete a managed Integration Server and all apps deployed inside it from an Integration Node."
object: "Managed Server"
action: "Delete Server"
commandName: "mqsideleteexecutiongroup"
synonyms:
  - "mqsideleteexecutiongroup"
  - "delete integration server"
  - "remove execution group"
---

# mqsideleteexecutiongroup: Remove a Server

Use **`mqsideleteexecutiongroup`** to remove an unused Integration Server from an Integration Node.

---

## Syntax & Example

```bash
# Integration Node <IntegrationNodeName> must be running!
mqsideleteexecutiongroup <IntegrationNodeName> -e <IntegrationServerName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP8071I: Successful command completion.
```

</details>

---

> [!WARNING]
> Deleting a server **removes all Applications, Libraries, and Policies deployed inside it** cleanly without confirmation prompts — double check the `-e` name first! Add **`-w 60000`** (milliseconds) if a busy server needs extra time to stop gracefully before deletion.

---

**Next:** [Independent Integration Server (mqsicreateworkdir) →](#topic-220)
