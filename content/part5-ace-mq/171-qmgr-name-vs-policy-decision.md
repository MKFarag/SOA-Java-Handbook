---
id: topic-171
slug: qmgr-name-vs-policy-decision
topicNumber: 171
title: "Queue Manager Name vs MQEndpoint Policy"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Messaging'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Quick decision matrix comparing direct QMGR connection on the node against an MQEndpoint policy."
object: "Connection Strategy"
action: "Choose Method"
commandName: "QMGR Name vs Policy"
synonyms:
  - "queue manager name vs mqendpoint policy"
  - "when to use mqendpoint"
  - "defaultqueuemanager"
---
# Queue Manager Name vs MQEndpoint Policy

Confused whether to type the Queue Manager name directly on the node or set up a Policy Project? Pick using this table.

---

## Side-by-Side Comparison

| Criteria | Direct Queue Manager Name (on Node / `-q`) | **`MQEndpoint` Policy** |
| :--- | :--- | :--- |
| **Setup speed** | 10 seconds | 2 minutes |
| **Remote MQ server (another IP/container)** | Clunky (hardcoded IP in flow) | **Best** (host/port/channel live in policy) |
| **Multi-env (DEV / UAT / PROD)** | Must edit BAR overrides or rebuild | **Best** (1 code BAR + 1 policy per env) |
| **Works with Independent Server?** | Needs `server.conf.yaml` `defaultQueueManager` | **Yes, natively** |

---

## Simple Rule

- Learning locally on your laptop with `MQ` and `ACE` on the same Windows PC? **Direct local QMGR** (via `-q` or leaving it empty) is totally fine.
- Building for containers, remote MQ, or real company environments? **Always use `MQEndpoint` Policy**.

---

**Next:** [Local Bindings vs Remote MQ Client Mode →](#topic-172)
