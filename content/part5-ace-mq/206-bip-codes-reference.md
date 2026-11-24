---
id: topic-206
slug: bip-codes-reference
topicNumber: 206
title: "BIP Codes Quick Reference Directory"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'BIP Codes Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Searchable matrix of IBM ACE BIP diagnostic codes: understand severity suffixes (I, W, E), causes, and fixes."
object: "BIP Reference"
action: "Search Codes"
commandName: "BIP8018E BIP Codes"
synonyms:
  - "bip codes"
  - "bip8018e"
  - "bip8096i"
  - "bip1325i"
  - "bip error codes"
  - "diagnostic matrix"
  - "error reference"
---

Searchable lookup matrix of common IBM App Connect Enterprise (BIP) diagnostic codes.
Use this table to translate numeric console errors into human causes and exact recovery steps.

### Severity Suffix Convention
* **`I` (Information):** Normal operational state (e.g. `BIP8096I`). Command was accepted.
* **`W` (Warning):** Operational anomaly that did not halt execution (e.g. `BIP2112W`).
* **`E` (Error):** Operation failed, transaction rolled back, or process stopped (e.g. `BIP8018E`).

| BIP Code | Type | Meaning in One Line | What To Do |
| :--- | :--- | :--- | :--- |
| **`BIP8096I`** | Info | Command was accepted by the OS service controller. | Normal output. Verify operational status with `mqsilist`. |
| **`BIP8018E`** | Error | Cannot connect to queue manager (QMGR is stopped or down). | Run `strmqm <QMGR>` before starting the integration node. |
| **`BIP1325I`** | Info | Integration node is running with active OS PID. | Healthy state. Inspect child servers with `-d 1`. |
| **`BIP1284I`** | Info | Integration node is actively running on associated QMGR. | Healthy running state. |
| **`BIP1285I`** | Info | Integration node is stopped. | Run `mqsistart <NodeName>` to bring online. |
| **`BIP1286I`** | Info | Integration server is actively running. | Normal running state. |
| **`BIP2087E`** | Error | Integration node was not found or not registered. | Verify node name via `mqsilist` or recreate with `mqsicreatebroker`. |
| **`BIP2112W`** | Warning| Deployment succeeded with warnings (missing optional resources). | Review warnings in Toolkit deploy log. |
| **`BIP2230E`** | Error | Error detected during message flow execution. | Check nested child exceptions in `ExceptionList` for root cause. |
| **`BIP2421E`** | Error | Illegal write attempt to read-only `InputRoot` tree. | Write to `OutputRoot` instead of modifying `InputRoot`. |
| **`BIP2456E`** | Error | Invalid character string during `CAST` to integer or date. | Sanitize input string before casting or verify format mask. |
| **`BIP2628E`** | Error | Queue does not exist on target queue manager (`MQRC 2085`). | Create missing queue via `DEFINE QLOCAL('<Q>')` in `runmqsc`. |
| **`BIP2638E`** | Error | MQReply node failed: `MQMD.ReplyToQ` is empty or missing. | Ensure client request populates `ReplyToQ` header. |
| **`BIP2950E`** | Error | User-generated exception thrown via `THROW USER EXCEPTION`. | Inspect message payload against application validation rules. |
| **`BIP2951E`** | Error | Event broker exception thrown during flow processing. | Check `InputExceptionList` tree for underlying fault. |
| **`BIP3132E`** | Error | JSON parser error: syntax error in JSON text. | Validate incoming payload with JSON linter; check for missing quotes. |
| **`BIP4040E`** | Error | Integration server failed to start or crashed. | Check Windows Event Viewer and `server.conf.yaml` logs. |
| **`BIP7001E`** | Error | BAR file deployment failed. | Verify required Policy Projects and dependencies are in BAR. |
| **`BIP8071I`** | Info | Command completed successfully. | Normal terminal completion confirmation. |

* **Nested BIP Traversal:** When handling errors in ESQL, loop through `InputExceptionList.*[1]` to locate the deepest child `Number`.
* **Windows Event Viewer:** All BIP errors are recorded in Windows Event Viewer under *Applications and Services Logs -> IBM App Connect Enterprise*.
* **IBM Documentation:** Always verify the full text of rare BIP codes using IBM Documentation online.

* [Common MQ Connection Errors](#topic-167)
* [Throw and Handle Errors (ExceptionList)](#topic-153)
* [Real Session Walkthrough](#topic-189)
