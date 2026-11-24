---
id: topic-198
slug: create-a-bar-file
topicNumber: 198
title: "Create a BAR File"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Compile and package message flows, ESQL modules, and policies into a deployable BAR archive using ibmint package."
object: "BAR Archive"
action: "create bar"
commandName: "ibmint package"
synonyms:
  - "create bar"
  - "create a bar file"
  - "ibmint package"
  - "build bar"
  - "package bar"
  - "broker archive"
---

Compiles applications, message flows, and policy projects into a deployable Broker Archive (`.bar`) file using `ibmint package`.
Use `ibmint package` in continuous integration (CI/CD) pipelines to generate build artifacts without launching the Toolkit GUI.

```cmd
ibmint package --input-path <WorkspaceDir> --output-bar-file <BarFilePath> [--project <AppName>]
```

| Option | Description | Real Example |
| :--- | :--- | :--- |
| **`--input-path`** | Path to the directory containing projects or applications. | `--input-path C:\workspace` |
| **`--output-bar-file`** | Destination filename for the created archive. | `--output-bar-file CustomerApp.bar` |
| **`--project`** | Specific application project to package. | `--project CustomerServiceApp` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> ibmint package --input-path C:\workspace --project CustomerServiceApp --output-bar-file C:\bars\CustomerApp.bar
BIP15055I: Packaging project 'CustomerServiceApp' into BAR file 'C:\bars\CustomerApp.bar'.
BIP8071I: Successful command completion.
```

* **Modern Tooling:** `ibmint package` replaces the legacy `mqsipackagebar` tool in ACE 12.
* **Include Policies:** Always ensure dependent Policy Projects are included in the `--input-path` so endpoint overrides package properly.
* **Standard ZIP Archive:** A BAR file is internally a standard ZIP archive containing compiled `.cmf` and `.esql` files.

* [Deploy a BAR File (mqsideploy)](#topic-199)
* [Read a BAR File (mqsireadbar)](#topic-200)
* [Connect by Policy](#topic-164)
