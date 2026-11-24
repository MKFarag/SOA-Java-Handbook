---
id: topic-167
slug: common-mq-connection-errors
topicNumber: 167
title: "Common MQ Connection Errors"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'Connecting Nodes to MQ'
versionBadge: ACE 12.0 / MQ 9.4
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Diagnose and resolve BIP8018E, MQRC 2059 (QMGR not available), 2058 (wrong name), and 2085 (unknown queue)."
object: "Connection Errors"
action: "Diagnose"
commandName: "BIP8018E MQRC 2059"
synonyms:
  - "connection errors"
  - "bip8018e"
  - "2059"
  - "2058"
  - "2085"
  - "mqrc_q_mgr_not_available"
  - "cannot connect to queue manager"
---

Troubleshoots the 4 most frequent connection errors encountered between ACE integration nodes and IBM MQ.
Use this matrix to rapidly identify the root cause from console logs and execute the recovery command.

| BIP Code / Reason | Exact Cause | Recovery Action |
| :--- | :--- | :--- |
| **`BIP8018E` / `MQRC 2059`**<br>(`MQRC_Q_MGR_NOT_AVAILABLE`) | The queue manager is stopped or not initialized. | Run `strmqm SCBQM` to start the queue manager before starting the node. |
| **`MQRC 2058`**<br>(`MQRC_Q_MGR_NAME_ERROR`) | The specified queue manager name does not exist or has a typo. | Run `dspmq` to verify the exact case-sensitive queue manager name. |
| **`MQRC 2085`**<br>(`MQRC_UNKNOWN_OBJECT_NAME`) | The queue specified on MQInput/MQOutput does not exist on QMGR. | Run `runmqsc SCBQM` and verify queue exists via `DISPLAY QLOCAL(<Q>)`. |
| **`MQRC 2538`**<br>(`MQRC_HOST_NOT_AVAILABLE`) | Remote client connection failed: listener is stopped or firewall block. | Start listener (`START LISTENER`) and verify TCP port 1414 reachability. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsistart SCB
BIP8018E: Cannot connect to queue manager 'SCBQM'.
```

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> strmqm SCBQM
IBM MQ queue manager 'SCBQM' started.

C:\Program Files\IBM\ACE\12.0.3.0> mqsistart SCB
BIP8096I: Successful command completion.
```

* **Check Event Viewer:** On Windows, detailed connection crash reasons are logged in the Windows Event Viewer under *Applications and Services Logs -> IBM App Connect Enterprise*.
* **Case-Sensitivity:** Queue manager names and queue names in IBM MQSC are case-sensitive if created in lowercase; default is UPPERCASE.
* **Channel Security:** If getting `MQRC 2035 (MQRC_NOT_AUTHORIZED)`, check channel authentication rules (`CHLAUTH`) on the queue manager.

* [Start a Queue Manager (strmqm)](#topic-171)
* [BIP Codes Quick Reference Directory](#topic-206)
* [Throw and Handle Errors (ExceptionList)](#topic-153)
