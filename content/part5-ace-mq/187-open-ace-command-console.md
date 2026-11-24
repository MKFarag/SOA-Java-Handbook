---
id: topic-187
slug: open-ace-command-console
topicNumber: 187
title: "Open ACE Command Console"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Initialize environment variables and system PATH using mqsiprofile.cmd to run mqsi commands in standard shells."
object: "Environment"
action: "setup profile"
commandName: "mqsiprofile"
synonyms:
  - "mqsiprofile"
  - "open ace command console"
  - "command console"
  - "ace environment"
  - "initialize mqsi path"
---

Initializes the active command shell with required Java, MQ, and ACE runtime paths and environment variables.
Use `mqsiprofile` whenever opening a standard Windows cmd window before executing any `mqsi*` or `ibmint` commands.

```cmd
"C:\Program Files\IBM\ACE\12.0.3.0\server\bin\mqsiprofile.cmd"
```

| Variable Set | Purpose |
| :--- | :--- |
| **`MQSI_WORKPATH`** | Base directory where node and server configuration files and logs live (`C:\ProgramData\IBM\MQSI`). |
| **`PATH`** | Prepends ACE binary directories (`server\bin`) and Java runtime (`common\jdk\bin`). |

```cmd
C:\> "C:\Program Files\IBM\ACE\12.0.3.0\server\bin\mqsiprofile.cmd"
MQSI 12.0.3.0
C:\Program Files\IBM\ACE\12.0.3.0\server

C:\Program Files\IBM\ACE\12.0.3.0>
```

* **Session Scope:** `mqsiprofile` modifies environment variables only for the current command prompt window; closing the shell resets them.
* **Shortcut Alternative:** Open *IBM App Connect Enterprise Console* from the Windows Start menu to launch a pre-configured console.
* **Do Not Double Run:** Running `mqsiprofile` multiple times in the same shell simply appends paths repeatedly.

* [Fix "'mqsi' is not recognized"](#topic-188)
* [List Nodes and Status (mqsilist)](#topic-190)
* [Commands Summary Cheat Sheet](#topic-205)
