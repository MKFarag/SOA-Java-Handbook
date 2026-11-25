---
id: topic-172
slug: local-bindings-vs-remote-client
topicNumber: 172
title: "Local Bindings vs Remote MQ Client Mode"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Messaging'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Know the difference between fast shared-memory Local Bindings mode and TCP/IP Client mode to a remote MQ server."
object: "MQ Transport Mode"
action: "Compare Modes"
commandName: "LOCAL vs CLIENT Mode"
synonyms:
  - "bindings mode vs client mode mq"
  - "local bindings mq"
  - "remote client mode mq"
  - "svrconn channel port 1414"
---
# Local Bindings vs Remote MQ Client Mode

ACE talks to IBM MQ in one of **two transport modes**. Knowing which one you are using solves 90% of connection failures.

---

## How They Differ

| Feature | **Local Bindings Mode (`LOCAL`)** | **Client Mode (`CLIENT`)** |
| :--- | :--- | :--- |
| **Where MQ runs** | **Same OS machine** as ACE | **Anywhere** (same box or another server/container) |
| **How it connects** | Direct inter-process shared memory (IPC) | Network TCP/IP socket (`host:1414` + `SVRCONN` channel) |
| **Speed** | Fastest | Fast (tiny TCP hop) |
| **Needs MQ Listener & Channel?** | **No** | **Yes** (Listener on port e.g. `1414` + `SVRCONN` channel running) |
| **Needs Local MQ Server Installed?** | Yes (Full MQ server on same PC) | Only client libraries *(already built into ACE!)* |

---

## Common Gotcha on Windows / Docker

If ACE runs inside a **Docker container** and IBM MQ runs in a **separate container** (or on your Windows host), they do **not** share OS memory — you **must** use **`CLIENT`** mode with a hostname, port `1414`, and `SVRCONN` channel!

> [!TIP]
> Notice ACE already bundles IBM MQ client capabilities inside itself, so you **never** have to install a separate MQ Server just to connect remotely in `CLIENT` mode.

---

**Next:** [Common MQ Connection Errors (2059, 2058, 2085, 2035) →](#topic-173)
