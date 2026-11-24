---
id: topic-183
slug: check-a-channel
topicNumber: 183
title: "Check a Channel"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Inspect real-time connection state of SVRCONN client channels and verify definition using MQSC."
object: "Channel"
action: "check"
commandName: "DISPLAY CHSTATUS"
synonyms:
  - "check channel"
  - "display chstatus"
  - "svrconn"
  - "channel status"
  - "client channel"
  - "running channel"
---

Inspects the operational status and connected remote client IP addresses on an MQ channel.
Use `DISPLAY CHSTATUS` to verify that client connections from external applications or ACE nodes are healthy.

```text
DISPLAY CHSTATUS('<ChannelName>')
DEFINE CHANNEL('<ChannelName>') CHLTYPE(SVRCONN) [TRPTYPE(TCP)]
```

| Status Value | Meaning | Action Needed |
| :--- | :--- | :--- |
| **`RUNNING`** | Actively transmitting data between client and queue manager. | Healthy state. |
| **`INACTIVE`** | Channel is defined and waiting for a client to connect. | Normal when idle. |
| **`STOPPED`** | Channel disabled manually or after security authentication failure. | Run `START CHANNEL(<Name>)`. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
DISPLAY CHSTATUS('DEV.APP.SVRCONN')
     1 : DISPLAY CHSTATUS('DEV.APP.SVRCONN')
AMQ8417I: Display Channel Status details.
   CHANNEL(DEV.APP.SVRCONN)                CHLTYPE(SVRCONN)
   CONNAME(127.0.0.1)                      STATUS(RUNNING)
END
```

* **Channel Authentication (CHLAUTH):** By default, modern MQ blocks administrative users on client channels; check `DISPLAY CHLAUTH(*)`.
* **SVRCONN Type:** Always use channel type `SVRCONN` (Server-Connection) for client applications connecting to a queue manager.
* **Define Channel Command:** Create a client channel with: `DEFINE CHANNEL('DEV.APP.SVRCONN') CHLTYPE(SVRCONN) REPLACE`.

* [Define and Start a Listener](#topic-182)
* [Connect by Policy](#topic-164)
* [Common MQ Connection Errors](#topic-167)
