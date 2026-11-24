---
id: topic-189
slug: real-session-startup-walkthrough
topicNumber: 189
title: "Real Session Walkthrough"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Line-by-line breakdown of a real developer startup session decoding SCBQM, BIP8096I, BIP8018E, and mqsilist output."
object: "Real Session"
action: "Walkthrough"
commandName: "Real Session Walkthrough"
synonyms:
  - "real session"
  - "startup walkthrough"
  - "scbqm session"
  - "bip8096i"
  - "bip8018e"
  - "bip1325i"
  - "bip1284i"
---

Walks through an actual developer command console session starting queue manager `SCBQM` and integration nodes `SCB`, `SCB_Q`, and `NTI`.
Use this breakdown to understand the exact BIP messages printed by ACE during startup and error recovery.

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsistart SCB
BIP8096I: Successful command completion.
BIP8018E: Cannot connect to queue manager 'SCBQM'.

C:\Program Files\IBM\ACE\12.0.3.0> strmqm SCBQM
IBM MQ queue manager 'SCBQM' started using V9.4.0.0.

C:\Program Files\IBM\ACE\12.0.3.0> mqsistart SCB
BIP8096I: Successful command completion.

C:\Program Files\IBM\ACE\12.0.3.0> mqsilist
BIP1325I: Integration node 'SCB' with active PID 4280 on queue manager 'SCBQM' is running.
BIP1285I: Integration node 'SCB_Q' on queue manager '' is stopped.
BIP1285I: Integration node 'NTI' on queue manager '' is stopped.
BIP8071I: Successful command completion.
```

| BIP Code / Line | Exact Meaning |
| :--- | :--- |
| **`BIP8096I`** | The command was accepted by the OS service controller (does **not** guarantee the node successfully connected). |
| **`BIP8018E`** | The integration node failed to initialize because its linked queue manager (`SCBQM`) was stopped. |
| **`BIP1325I`** | Integration node is actively running with an assigned operating system Process ID (`PID 4280`). |
| **`BIP1285I`** | Integration node is stopped (`queue manager ''` indicates headless mode without linked default QMGR). |

* **BIP8096I Caution:** Never assume a node is running just because `BIP8096I` appears; verify with `mqsilist`.
* **Empty Quotes (`''`):** `queue manager ''` means the node was created without `-q` and runs headless.
* **Order of Execution:** Always run `strmqm SCBQM` before `mqsistart SCB`.

* [Start a Queue Manager (strmqm)](#topic-171)
* [Start an Integration Node (mqsistart)](#topic-192)
* [List Nodes and Status (mqsilist)](#topic-190)
