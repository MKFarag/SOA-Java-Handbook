---
id: topic-195
slug: change-node-settings
topicNumber: 195
title: "Change Node Settings"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Modify integration node configuration parameters using mqsichangeproperties and node.conf.yaml."
object: "Node Settings"
action: "change settings"
commandName: "mqsichangeproperties node.conf.yaml"
synonyms:
  - "change node settings"
  - "mqsichangeproperties"
  - "node.conf.yaml"
  - "http listener port"
  - "configure node"
---

Modifies integration node runtime configuration (such as HTTP connector ports or JVM heap limits).
Use `mqsichangeproperties` or edit `node.conf.yaml` to change system properties without recreating the node.

```cmd
mqsichangeproperties <NodeName> -b <Component> -o <Object> -n <Property> -v <Value>
```

| Component / Property | Typical Value | Purpose |
| :--- | :--- | :--- |
| **`httplistener`** / `port` | `7080`, `7081` | Port number for the node-wide HTTP listener. |
| **`node.conf.yaml`** | File in workpath | Modern ACE 12 YAML configuration file located under `%MQSI_WORKPATH%\components\<NodeName>`. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsichangeproperties SCB -b httplistener -o HTTPConnector -n port -v 7080
BIP8096I: Successful command completion.
```

* **Restart Required:** Configuration changes made via `mqsichangeproperties` or YAML require an integration node restart to take effect.
* **node.conf.yaml in ACE 12:** In modern ACE 12, editing `node.conf.yaml` directly is the preferred declarative method.
* **Inspect Values:** Run `mqsireportproperties <node> -b httplistener -o HTTPConnector -r` to view active settings.

* [Start an Integration Node (mqsistart)](#topic-192)
* [Stop an Integration Node (mqsistop)](#topic-193)
* [Create an Integration Node (mqsicreatebroker)](#topic-191)
