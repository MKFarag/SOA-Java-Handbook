---
id: topic-169
slug: connect-by-queue-manager-name
topicNumber: 169
title: "Method 1: Connect MQ Nodes by Queue Manager Name"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Messaging'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Configure MQInput or MQOutput to connect directly via default local Queue Manager or local QMGR name."
object: "MQConnection Property"
action: "Connect Local QMGR"
commandName: "Local queue manager"
synonyms:
  - "mq connection properties"
  - "local queue manager"
  - "mqinput queue manager name"
  - "connect by queue manager name"
---
# Method 1: Connect MQ Nodes by Queue Manager Name

The fastest way to wire an `MQInput` or `MQOutput` node on your local dev machine is directly in its **MQ Connection** tab.

---

## Two Local Options on the Node

1. Click `MQInput` or `MQOutput` -> **Properties -> MQ Connection**.
2. Set **Connection** dropdown to **Local queue manager**:
   - **Leave Queue manager name empty:** Uses the Integration Node's default linked QMGR (`-q <QueueManagerName>`) or `server.conf.yaml`'s `defaultQueueManager`.
   - **Or type `<QueueManagerName>` explicitly:** Connects locally in bindings mode to `<QueueManagerName>` on the same server.

---

## Remote Direct Option (Client Properties)

You can also pick **MQ client connection properties** directly on the node and type:
- **Queue manager host name:** e.g. `<HostName>`
- **Listener port number:** e.g. `1414`
- **Channel name:** e.g. `<ChannelName>`

> [!WARNING]
> Hardcoding host IP, port, and channel directly inside `.msgflow` nodes means **rebuilding the BAR file** for UAT and PROD! For team or multi-environment flows, use **[Method 2: MQEndpoint Policy](#topic-170)** instead.

---

**Next:** [Method 2: Connect MQ Nodes by MQEndpoint Policy →](#topic-170)
