---
id: topic-164
slug: connect-by-policy
topicNumber: 164
title: "Connect by Policy (MQEndpoint Policy)"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Decouple message flow nodes from connection details using an MQEndpoint Policy project and BAR overrides."
object: "MQ Policy"
action: "Connect by Policy"
commandName: "MQEndpoint Policy"
synonyms:
  - "policy"
  - "connect by policy"
  - "mqendpoint"
  - "mq endpoint policy"
  - "policy project"
  - "decouple connection"
  - "how to link policy to queue"
  - "specify queue in policy"
  - "project references policy"
---

Connects MQ nodes via an MQEndpoint Policy to separate queue connection details from message flow code.
Use policies in enterprise production pipelines to retarget development BAR files to test or production without editing flows.

```
Message Flow (MQInput) ──► References Policy: {MyPolicyProject}:SCB_Endpoint
                                       │
                      Overridden in BAR for TEST / PROD
```

| Property | Property Value | Description |
| :--- | :--- | :--- |
| **`policyType`** | `MQEndpoint` | Identifies this policy document as an MQ connection definition. |
| **`queueManagerName`** | e.g. `SCBQM` | Target IBM MQ Queue Manager name. |
| **`connection`** | `localhost:1414` (or blank)| Host and listener port for client TCP/IP connections. |
| **`channelName`** | `DEV.APP.SVRCONN` | SVRCONN channel name (for remote client connections). |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<policy:policy xmlns:policy="http://www.ibm.com/xmlns/prod/websphere/messagebroker/6.0/rules" 
               policyType="MQEndpoint" policyName="SCB_Endpoint">
  <queueManagerName>SCBQM</queueManagerName>
  <connection>localhost(1414)</connection>
  <channelName>SYSTEM.DEF.SVRCONN</channelName>
</policy:policy>
```

### Queue vs Policy: Where Each Is Configured
| Setting | Where Configured | Exact Tab in Toolkit | Example Value |
| :--- | :--- | :--- | :--- |
| **Queue Name** (`IN.Q` / `OUT.Q`) | In the **Node** itself | Node Properties ➔ **Basic** ➔ `Queue name` | `ORDER.IN.Q` |
| **Connection & Host Details** | In the **Policy** | Policy Editor ➔ `connection` & `channelName` | `localhost(1414)`, `DEV.SVRCONN` |
| **Link Node to Policy** | In the **Node** itself | Node Properties ➔ **Connection** ➔ `Policy` | `{MyPolicyProject}:SCB_Endpoint` |
| **Link Application to Policy** | In the **Application** | Right-click App ➔ **Manage Project References** | Check `[✔] MyPolicyProject` |

* **BAR Inclusion:** Policy projects must be packaged inside the BAR file alongside the applications: `ibmint package --input-path <dir> --output-bar-file app.bar`.
* **Zero Flow Recompilation:** Production operations can change the target host or port by updating the policy without reopening the message flow in Toolkit.
* **Policy Attachment:** In the MQ node's Connection tab, enter the policy URI: `{PolicyProjectName}:PolicyName`.

* [Connect by Queue Manager Name](#topic-163)
* [Name or Policy? (Decision Table)](#topic-165)
* [Deploy a BAR File (mqsideploy)](#topic-199)
