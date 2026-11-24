---
id: topic-165
slug: name-or-policy-decision
topicNumber: 165
title: "Name or Policy? (Decision Table)"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Decision table: when to set queue manager connection directly by name versus attaching an MQEndpoint policy."
object: "Connection Strategy"
action: "Decision"
commandName: "Name vs Policy"
synonyms:
  - "name or policy"
  - "name vs policy"
  - "when to use policy"
  - "policy decision"
  - "connection strategy"
---

Compares direct node connection by name versus externalized connection via an MQEndpoint policy.
Use this decision table to choose the appropriate connection pattern for your current delivery phase.

| Situation | Recommended Strategy | Why |
| :--- | :--- | :--- |
| **Local developer testing in Toolkit** | **Connect by Name** | Fastest setup; zero extra projects to maintain. |
| **Remote queue manager (different machine/cloud)** | **Connect by Policy** | Local bindings cannot reach remote machines; requires client channel. |
| **Multi-environment pipeline (Dev → QA → Prod)**| **Connect by Policy** | Deploy the exact same BAR file; only the policy project changes. |
| **Standalone headless container / Docker** | **Connect by Policy** | Container has no local QMGR; must connect via client mode TCP/IP. |
| **Quick proof of concept** | **Connect by Name** | Minimal overhead for single-developer prototypes. |

* **Maintenance Cost:** Hardcoding names creates technical debt when promoting BAR files across QA and Production environments.
* **Binding Speed:** Local bindings (by name) is faster than client TCP/IP sockets because it uses internal OS shared memory.
* **Security Credentials:** Policies support `securityIdentity` to attach encrypted service account credentials configured via `mqsisetdbparms`.

* [Connect by Queue Manager Name](#topic-163)
* [Connect by Policy](#topic-164)
* [Local vs. Remote Queue Manager](#topic-166)
