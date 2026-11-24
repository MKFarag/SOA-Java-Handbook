---
id: topic-166
slug: local-vs-remote-queue-manager
topicNumber: 166
title: "Local vs. Remote Queue Manager"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Compare high-speed local bindings (shared memory) with remote client connections over TCP/IP channels."
object: "Queue Manager Connection"
action: "Compare"
commandName: "Local vs Remote"
synonyms:
  - "local vs remote"
  - "bindings vs client"
  - "local queue manager"
  - "remote queue manager"
  - "client mode"
  - "bindings mode"
---

Compares local bindings mode (same physical machine) against remote client mode (network TCP/IP connection).
Use local bindings for maximum performance; use client mode when ACE and MQ run in separate VMs or containers.

```
Local Mode:   [ ACE Node ] ══( IPC Shared Memory )══► [ Local QMGR: SCBQM ]
Remote Mode:  [ ACE Node ] ──( TCP/IP Port 1414 )───► [ Remote QMGR on Host B ]
```

| Feature | Local Bindings Connection | Remote Client Connection |
| :--- | :--- | :--- |
| **Topology** | Node and QMGR on **same** machine. | QMGR on another server, VM, or container. |
| **Transport** | Inter-process shared memory (IPC). | TCP/IP network socket. |
| **Required MQ Software** | Full IBM MQ Server installation. | IBM MQ Client library or full server. |
| **Performance** | **Fastest** (Zero network latency). | Network dependent (Socket latency). |
| **Listener Needed?** | **No.** Local IPC does not use listeners. | **Yes.** Port 1414 listener must be running. |
| **SVRCONN Channel?** | **No.** Not required for local bindings. | **Yes.** (e.g. `DEV.APP.SVRCONN`). |

* **Single Machine Rule:** If `dspmq` shows the queue manager on your Windows command prompt, you can use local bindings.
* **Port 1414 Requirement:** For remote connections, ensure Windows Firewall permits inbound traffic on TCP port 1414.
* **Transaction Coordination:** Local bindings support full 1-phase and 2-phase transactional commit coordinated by the local QMGR.

* [Define and Start a Listener](#topic-182)
* [Check a Channel](#topic-183)
* [Common MQ Connection Errors](#topic-167)
