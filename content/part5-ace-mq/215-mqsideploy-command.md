---
id: topic-215
slug: mqsideploy-command
topicNumber: 215
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
# Deploy to a Managed Server (Node <IntegrationNodeName>, server <IntegrationServerName>)
mqsideploy <IntegrationNodeName> -e <IntegrationServerName> -a <BarFilePath>

# Full clean deploy (-m deletes old apps not in this BAR!)
mqsideploy <IntegrationNodeName> -e <IntegrationServerName> -a <BarFilePath> -m

# Deploy to an Independent Integration Server (via REST port 7600)
mqsideploy -i localhost -p 7600 -a <BarFilePath>

# Remove an application by name (-d)
mqsideploy <IntegrationNodeName> -e <IntegrationServerName> -d <ApplicationName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP1039I: Deploying BAR file '<BarFilePath>' to integration server '<IntegrationServerName>' ...
BIP9332I: Application '<ApplicationName>' has been created or updated successfully.
BIP1092I: The integration node successfully processed the deployment request.
```

</details>

---

> [!WARNING]
> **Careful with `-m` (`complete deployment`)!** Adding `-m` deletes **everything else** already deployed on that Integration Server (`<IntegrationServerName>`) that is not inside your `.bar` file. Omit `-m` for normal incremental app deploys.

---

**Next:** [mqsistartmsgflow & mqsistopmsgflow →](#topic-216)
