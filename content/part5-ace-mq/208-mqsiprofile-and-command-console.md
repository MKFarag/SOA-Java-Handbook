---
id: topic-208
slug: mqsiprofile-and-command-console
topicNumber: 208
title: "mqsiprofile & the ACE Command Console"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Integration Node & Server Commands'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Load the IBM App Connect Enterprise environment with mqsiprofile (or open the ACE Console) before running any mqsi command."
object: "ACE Environment"
action: "Initialize CLI"
commandName: "mqsiprofile"
synonyms:
  - "mqsiprofile"
  - "ace command console"
  - "ibm app connect enterprise console"
  - "initialize ace environment"
---

# mqsiprofile & the ACE Command Console

Every ACE CLI command (`mqsilist`, `mqsistart`, `mqsideploy`, `ibmint`) only works **after** your shell loads IBM's `mqsiprofile` paths and environment variables.

---

## Easiest Way on Windows

Open the Start Menu -> **IBM App Connect Enterprise 12.x -> IBM App Connect Enterprise Console**.
It opens a shell with `mqsiprofile` **already loaded automatically**.

---

## Using Your Own Terminal (CMD / Bash / Git Bash)

```bat
REM Windows CMD (runs once per open window)
"C:\Program Files\IBM\ACE\12.0.x.x\server\bin\mqsiprofile.cmd"
```

```bash
# Linux / Mac / Container shell (notice the dot + space at the start!)
. /opt/ibm/ace-12/server/bin/mqsiprofile
```

<details data-type="output">
<summary>Verify Environment Loaded</summary>

```text
MQSI_VERSION 12.0.11.0
BIP8071I: Successful command completion.
```

</details>

---

> [!TIP]
> Notice the leading `. ` *(dot space)* on Linux! Running `/opt/ibm/.../mqsiprofile` without `. ` runs inside a child shell and disappears right after — `. ` loads variables into **your current terminal**.

---

**Next:** [Fix: 'mqsi' Is Not Recognized as a Command →](#topic-209)
