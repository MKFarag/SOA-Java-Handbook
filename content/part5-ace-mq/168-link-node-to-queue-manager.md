---
id: topic-168
slug: link-node-to-queue-manager
topicNumber: 168
title: "Link an Integration Node to a Queue Manager (-q)"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Messaging'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Associate an ACE Integration Node with a default local Queue Manager using mqsicreatebroker -q."
object: "Node QMGR Link"
action: "Link Queue Manager"
commandName: "mqsicreatebroker -q"
synonyms:
  - "mqsicreatebroker -q"
  - "default queue manager ace"
  - "associated queue manager"
  - "bip8018e"
---
# Link an Integration Node to a Queue Manager (-q)

When you create an ACE Integration Node, you can link it to one local IBM MQ Queue Manager with **`-q`**. Then every MQ node without a policy automatically uses that Queue Manager!

---

## Syntax

```bash
mqsicreatebroker <NodeName> -q <QueueManagerName>
```

---

## Fast Example

First ensure `<QueueManagerName>` exists in IBM MQ, then create node `<IntegrationNodeName>` linked to `<QueueManagerName>`:

```bash
mqsicreatebroker <IntegrationNodeName> -q <QueueManagerName>
mqsistart <IntegrationNodeName>
```

<details data-type="output">
<summary>Expected Output</summary>

```text
BIP8071I: Successful command completion.
BIP8096I: Successful command initiation, check the system log to ensure that the component started without problem...
```

</details>

---

## What Happens When You Start `<IntegrationNodeName>`

1. ACE checks that `<QueueManagerName>` is running on the same PC (local bindings).
2. If `<QueueManagerName>` is **stopped**, `mqsistart <IntegrationNodeName>` **auto-starts `<QueueManagerName>`** or fails if `<QueueManagerName>` does not exist (`BIP8018E`).
3. You can verify the link anytime with `mqsilist` — look for `with queue manager '<QueueManagerName>'`.

> [!WARNING]
> **Using an Independent Integration Server?** An Independent Server has **no Integration Node**, so `-q` does not apply — instead use an **`MQEndpoint` policy** or set **`defaultQueueManager`** in `server.conf.yaml`!

---

**Next:** [Method 1: Connect MQ Nodes by Queue Manager Name →](#topic-169)
