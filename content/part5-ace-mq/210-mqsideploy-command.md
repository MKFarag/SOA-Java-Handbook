---
id: topic-210
slug: mqsideploy-command
topicNumber: 210
title: "mqsideploy: Deploy, List & Clean Flows"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Deploy a .bar file from the CLI onto a managed server or an Independent Integration Server (or delete deployed apps)."
object: "Deployment"
action: "Deploy BAR"
commandName: "mqsideploy"
synonyms:
  - "mqsideploy"
  - "deploy bar file"
  - "delete deployed app ace"
  - "mqsideploy independent server"
---

# mqsideploy: Deploy, List & Clean Flows

**`mqsideploy`** pushes a `.bar` archive onto a running Integration Server (or removes existing apps cleanly).

![Deploy BAR wizard in the Toolkit showing target Integration Server selection](/images/ace/deploy-select-integration-server.png)

---

## Common Deployment Commands

```bash
# Deploy to a Managed Server (Node SCB, server EG1)
mqsideploy SCB -e EG1 -a C:\builds\OrderApp.bar

# Full clean deploy (-m deletes old apps not in this BAR!)
mqsideploy SCB -e EG1 -a C:\builds\OrderApp.bar -m

# Deploy to an Independent Integration Server (via REST port 7600)
mqsideploy -i localhost -p 7600 -a C:\builds\OrderApp.bar

# Remove an application by name (-d)
mqsideploy SCB -e EG1 -d OrderApp
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1039I: Deploying BAR file 'C:\builds\OrderApp.bar' to integration server 'EG1' ...
BIP9332I: Application 'OrderApp' has been created or updated successfully.
BIP1092I: The integration node successfully processed the deployment request.
```

</details>

---

> [!WARNING]
> **Careful with `-m` (`complete deployment`)!** Adding `-m` deletes **everything else** already deployed on that Integration Server (`EG1`) that is not inside your `.bar` file. Omit `-m` for normal incremental app deploys.

---

**Next:** [mqsistartmsgflow & mqsistopmsgflow →](#topic-211)
