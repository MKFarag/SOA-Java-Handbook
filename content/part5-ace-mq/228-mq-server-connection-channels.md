---
id: topic-228
slug: mq-server-connection-channels
topicNumber: 228
title: "MQ Channels: Server-Connection Channel (SVRCONN)"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create a SVRCONN channel for remote ACE MQEndpoint policies, Java apps, and MQ Explorer clients."
object: "SVRCONN Channel"
action: "Define Client Channel"
commandName: "DEFINE CHANNEL(SVRCONN)"
synonyms:
  - "svrconn channel"
  - "define channel chlname svrconn"
  - "display chstatus"
  - "client connection channel mq"
---

# MQ Channels: Server-Connection Channel (SVRCONN)

Once port `1414` is open, remote ACE client flows and apps enter the Queue Manager through a **Server-Connection (`SVRCONN`) channel**.

---

## Define & Monitor a Channel (`runmqsc <QueueManagerName>`)

```text
* Create a client channel for ACE & external apps
DEFINE CHANNEL('<ChannelName>') CHLTYPE(SVRCONN) TRPTYPE(TCP) DESCR('ACE client channel') REPLACE

* Check live active client connections
DISPLAY CHSTATUS('<ChannelName>')
```

<details data-type="output">
<summary>Expected Output</summary>

```text
AMQ8014I: IBM MQ channel created.
```

</details>

---

## How ACE Uses This Channel

In your ACE `MQEndpoint` policy (or client properties), enter **exact matching values**:
- **Queue manager name:** `<QueueManagerName>`
- **Host:** `<HostName>`
- **Port:** `1414` *(from `<ListenerName>`)*
- **Channel name:** `<ChannelName>` *(case-sensitive!)*

---

**Next:** [Channel Security & CHLAUTH Basics →](#topic-229)
