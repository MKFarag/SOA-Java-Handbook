---
id: topic-182
slug: define-and-start-a-listener
topicNumber: 182
title: "Define and Start a Listener"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Configure and start a TCP/IP listener on port 1414 to receive remote client connections using MQSC."
object: "Listener"
action: "define and start"
commandName: "DEFINE LISTENER START LISTENER"
synonyms:
  - "define listener"
  - "start listener"
  - "listener"
  - "port 1414"
  - "tcp listener"
  - "remote mq connection"
---

Creates and starts an IBM MQ TCP/IP listener process to accept network connections on port 1414.
Use listeners when remote client applications, external ACE nodes, or Docker containers connect over TCP/IP.

```text
DEFINE LISTENER('<ListenerName>') TRPTYPE(TCP) PORT(<PortNumber>) [CONTROL(QMGR)]
START LISTENER('<ListenerName>')
```

| Parameter | Recommended Value | Description |
| :--- | :--- | :--- |
| **`LISTENER`** | `TCP.LISTENER.1414` | Unique name for the listener object. |
| **`PORT`** | `1414` | Standard IBM MQ TCP port. |
| **`CONTROL(QMGR)`** | `QMGR` | Automatically starts this listener whenever the queue manager starts. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> runmqsc SCBQM
DEFINE LISTENER('TCP.LISTENER.1414') TRPTYPE(TCP) PORT(1414) CONTROL(QMGR) REPLACE
     1 : DEFINE LISTENER('TCP.LISTENER.1414') TRPTYPE(TCP) PORT(1414) CONTROL(QMGR) REPLACE
AMQ8621I: IBM MQ listener created.

START LISTENER('TCP.LISTENER.1414')
     2 : START LISTENER('TCP.LISTENER.1414')
AMQ8021I: IBM MQ listener started.
END
```

* **Port Conflict:** If port 1414 is already in use by another queue manager or service, the listener fails to bind.
* **Firewall Rule:** On Windows, create an inbound firewall allow rule for TCP port 1414.
* **Auto-Start:** Always specify `CONTROL(QMGR)` so you do not have to manually run `START LISTENER` after server reboots.

* [Check a Channel](#topic-183)
* [Open runmqsc](#topic-169)
* [Local vs. Remote Queue Manager](#topic-166)
