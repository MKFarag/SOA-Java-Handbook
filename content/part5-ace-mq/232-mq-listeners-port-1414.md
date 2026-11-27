---
id: topic-232
slug: mq-listeners-port-1414
topicNumber: 232
title: "MQ Listeners: Define & Start Port 1414"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'IBM MQ Commands'
versionBadge: 'IBM MQ 9.4'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Open a TCP/IP listening port (default 1414) on your Queue Manager, discover active or custom listener ports, and alter ports safely."
object: "MQ Listener"
action: "Open & Inspect Port"
commandName: "DEFINE LISTENER & DISPLAY LSSTATUS"
synonyms:
  - "mq listener 1414"
  - "define listener trptype tcp"
  - "start listener runmqsc"
  - "display lsstatus"
  - "display listener port"
  - "find mq listener port"
  - "alter listener port"
---

# MQ Listeners: Define & Start Port 1414

By default, a newly created Queue Manager **has no running TCP listener**, causing `MQRC 2538 (HOST_NOT_AVAILABLE)` when remote ACE flows or MQ Explorer try connecting over TCP/IP. **`1414`** is IBM MQ's standard default TCP port, though you can assign any free port (e.g. `1415`, `1420`) when running multiple Queue Managers on the same host.

---

## Define, Auto-Start & Verify Listener (`runmqsc <QueueManagerName>`)

```text
DEFINE LISTENER('<ListenerName>') TRPTYPE(TCP) PORT(1414) CONTROL(QMGR) REPLACE
START LISTENER('<ListenerName>')
DISPLAY LSSTATUS('<ListenerName>')
```

<details data-type="output">
<summary>Expected Output</summary>

```text
AMQ8626I: IBM MQ listener created.
AMQ8021I: Request to start IBM MQ Listener accepted.
AMQ8631I: Display listener status details.
   LISTENER(<ListenerName>)                  STATUS(RUNNING)
   PORT(1414)
```

</details>

---

> [!TIP]
> Always include **`CONTROL(QMGR)`**! That tells IBM MQ to automatically start and stop `<ListenerName>` every time `strmqm <QueueManagerName>` / `endmqm <QueueManagerName>` runs in the future.

---

## Forgot Your Port or Listener Name? Check What Is Running

If someone changed the port earlier or you don't know `<ListenerName>`, use the **`*` wildcard** inside `runmqsc <QueueManagerName>`:

```text
* 1. Check all CURRENTLY RUNNING listeners and their ports
DISPLAY LSSTATUS(*) PORT STATUS

* 2. Check ALL defined listeners (even if currently STOPPED)
DISPLAY LISTENER(*) PORT CONTROL TRPTYPE
```

<details data-type="output">
<summary>Expected Output</summary>

```text
AMQ8631I: Display listener status details.
   LISTENER(<ListenerName>)                STATUS(RUNNING)
   PORT(1415)
AMQ8630I: Display listener details.
   LISTENER(<ListenerName>)                CONTROL(QMGR)
   TRPTYPE(TCP)                            PORT(1415)
```

</details>

**Quick alternatives outside `runmqsc`:**
- **One-liner from CMD / Bash:** `echo DISPLAY LSSTATUS(*) PORT STATUS | runmqsc <QueueManagerName>`
- **Windows PowerShell (running process):** `Get-CimInstance Win32_Process -Filter "Name='runmqlsr.exe'" | Select-Object ProcessId, CommandLine` *(then run `netstat -ano | findstr <ProcessId>` if `-p` isn't shown in the command line)*
- **Linux:** `ps -ef | grep runmqlsr`
- **IBM MQ Explorer (GUI):** Expand **Queue Managers -> `<QueueManagerName>` -> Listeners** to see every listener's **Port** and **Status** columns directly.

---

## Change an Existing Listener's Port

Stop the running listener first, update the port with `ALTER LISTENER`, then start it again:

```text
STOP LISTENER('<ListenerName>')
ALTER LISTENER('<ListenerName>') TRPTYPE(TCP) PORT(1414)
START LISTENER('<ListenerName>')
DISPLAY LSSTATUS(*) PORT STATUS
```

---

**Next:** [MQ Channels: Server-Connection Channel (SVRCONN) →](#topic-233)
