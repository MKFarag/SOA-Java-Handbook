---
id: topic-139
slug: policy-projects-and-packaging-rules
topicNumber: 139
title: "Policy Projects & Packaging Decisions"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Keep environment settings (DEV/UAT/PROD hosts, queues, URLs) out of your flow using Policy Projects."
object: "Policy Project"
action: "Externalize Config"
commandName: "New Policy Project"
synonyms:
  - "policy project ace"
  - "mqendpoint policy project"
  - "new menu application subflow policy"
  - "dev uat prod config"
---
# Policy Projects & Packaging Decisions

Never hardcode production queue managers, database hosts, or external URLs inside a flow. Put environment settings inside a **Policy Project** so the exact same BAR code works in DEV, UAT, and PROD.

![New menu inside an Application showing Message Flow, Mapping, Subflow, and Policy options](/images/ace/toolkit-app-new-menu.png)

---

## What Goes Where? (Quick Packaging Guide)

| What You Are Creating | Put It In... | Why |
| :--- | :--- | :--- |
| Main business pipeline (`.msgflow`) | **Application** | Isolated deployable runtime unit |
| Shared schemas / subflows / common ESQL | **Shared Library** | Deploy once, update without rebuilding apps |
| App-specific helper files | **Static Library** (or inside the App) | Version-locked with that one App |
| Queue Manager host, port, DB credentials, URLs | **Policy Project** | Change per environment without touching flows |

---

## How a Policy Works at Runtime

1. In the Toolkit: **New -> Policy Project** (for example `ProdPolicies`), then create a Policy (such as `MQEndpoint` or `HTTPRequest`).
2. Reference it on your flow node using `{PolicyProjectName}:PolicyName` (e.g., `{ProdPolicies}:OrderMQ`).
3. Deploy the Policy Project to the Integration Server. To switch environments later, update only the Policy XML and redeploy the Policy Project.

> [!TIP]
> If you don't set a Policy Project explicitly on a server, ACE looks in the server's **Default Policy Project** set in `server.conf.yaml`.

---

**Next Section — Message Flows:** [What Is a Message Flow (.msgflow)? →](#topic-140)
