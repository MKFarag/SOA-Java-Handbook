---
id: topic-195
slug: fix-mqsi-command-not-recognized
topicNumber: 195
title: "Fix: 'mqsi' Is Not Recognized as a Command"
part: 'Part 5: ACE & MQ'
sectionNumber: 42
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Solve 'mqsilist is not recognized' or 'command not found' when running ACE commands outside the IBM Console."
object: "CLI Error"
action: "Fix PATH"
commandName: "mqsi not recognized"
synonyms:
  - "mqsilist is not recognized"
  - "mqsistart command not found"
  - "powershell mqsiprofile"
  - "path fix ace"
---

# Fix: 'mqsi' Is Not Recognized as a Command

If typing `mqsilist` gives `'mqsilist' is not recognized as an internal or external command` (Windows) or `command not found` (Linux), nothing is broken — **`mqsiprofile` just isn't loaded in that terminal tab yet**.

---

## 30-Second Fix

| Your Shell | Fix Command |
| :--- | :--- |
| **Windows Start Menu** | Close regular CMD and open **IBM App Connect Enterprise Console** |
| **Regular Windows CMD** | `"C:\Program Files\IBM\ACE\12.0.x.x\server\bin\mqsiprofile.cmd"` |
| **PowerShell** | PowerShell cannot source `.cmd` directly — launch CMD first: `cmd /k "C:\Program Files\IBM\ACE\12.0.x.x\server\bin\mqsiprofile.cmd"` |
| **Linux / Docker / WSL** | `. /opt/ibm/ace-12/server/bin/mqsiprofile` |

---

## Test That It Worked

```bash
mqsilist -v
```

<details data-type="output">
<summary>Expected Output Once Fixed</summary>

```text
BIP8071I: Successful command completion.
```

</details>

> [!WARNING]
> Do **not** manually hack Windows global System `PATH` to mix two different ACE versions (like v11 and v12). Using the Start Menu Console or `mqsiprofile` keeps every terminal clean.

---

**Next:** [Real Session Startup Walkthrough (MQ + ACE) →](#topic-196)
