---
id: topic-188
slug: fix-command-not-recognized
topicNumber: 188
title: "Fix \"'mqsi' is not recognized\""
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Resolve the common \"is not recognized as an internal or external command\" error by executing mqsiprofile."
object: "Environment"
action: "troubleshoot path"
commandName: "command is not recognized"
synonyms:
  - "command is not recognized"
  - "mqsi is not recognized"
  - "fix path"
  - "mqsiprofile missing"
  - "unknown command"
---

Troubleshoots the standard Windows shell error when running `mqsilist`, `mqsistart`, or `ibmint` in an uninitialized cmd prompt.
Use this fix immediately when a command prompt reports that an ACE or MQ tool cannot be found.

```cmd
'mqsilist' is not recognized as an internal or external command, operable program or batch file.
```

| Cause | Diagnostic Check | Resolution Command |
| :--- | :--- | :--- |
| **Shell not initialized** | Type `echo %MQSI_WORKPATH%`. If empty, profile was not run. | Run `"C:\Program Files\IBM\ACE\12.0.3.0\server\bin\mqsiprofile.cmd"`. |
| **Wrong ACE path** | Check directory exists in File Explorer. | Verify correct version path (e.g. `12.0.3.0`). |

```cmd
C:\> mqsilist
'mqsilist' is not recognized as an internal or external command, operable program or batch file.

C:\> "C:\Program Files\IBM\ACE\12.0.3.0\server\bin\mqsiprofile.cmd"
MQSI 12.0.3.0

C:\Program Files\IBM\ACE\12.0.3.0> mqsilist
BIP1284I: Integration node 'SCB' on queue manager 'SCBQM' is running.
```

* **Start Menu Shortcut:** The fastest prevention is launching *IBM App Connect Enterprise Console* from Windows Start menu.
* **PowerShell Tip:** If using PowerShell, invoke the script via `cmd /c "call mqsiprofile.cmd && mqsilist"`.
* **Permanent PATH Hazard:** Never add the full ACE bin folder permanently to Windows System PATH; use `mqsiprofile` to prevent DLL version conflicts.

* [Open ACE Command Console (mqsiprofile)](#topic-187)
* [List Nodes and Status (mqsilist)](#topic-190)
* [Real Session Walkthrough](#topic-189)
