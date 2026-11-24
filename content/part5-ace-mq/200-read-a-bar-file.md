---
id: topic-200
slug: read-a-bar-file
topicNumber: 200
title: "Read a BAR File"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Inspect compiled message flows, policies, deployment descriptors, and build timestamps inside a BAR using mqsireadbar."
object: "BAR Archive"
action: "read bar"
commandName: "mqsireadbar"
synonyms:
  - "read bar"
  - "read a bar file"
  - "mqsireadbar"
  - "inspect bar"
  - "show bar contents"
  - "view bar"
---

Inspects the compiled artifacts, message flow names, and version metadata stored inside a BAR file without deploying it.
Use `mqsireadbar` to verify which flows, policies, and schemas are packed inside a build archive before deployment.

```cmd
mqsireadbar -b <BarFilePath> [-r]
```

| Flag | Description | Real Example |
| :--- | :--- | :--- |
| **`-b <BarPath>`** | Target BAR file path to inspect. | `-b C:\bars\CustomerApp.bar` |
| **`-r`** | Recursive inspection: displays internal subflow elements and properties. | `-r` |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsireadbar -b C:\bars\CustomerApp.bar
BIP2863I: The BAR file contains the following items:
  Application: CustomerServiceApp
    Message Flow: TransformCustomer.msgflow
    Policy Project: SCB_Policies
      Policy: SCB_Endpoint.policyxml
BIP8071I: Successful command completion.
```

* **ZIP Compatibility:** You can also rename `CustomerApp.bar` to `CustomerApp.zip` and inspect the contents with File Explorer.
* **Verify Policies:** Use this command to confirm that required MQEndpoint policies were compiled into the archive.
* **Timestamp Audit:** Displays compilation build date and user account that generated the archive.

* [Create a BAR File (ibmint package)](#topic-198)
* [Deploy a BAR File (mqsideploy)](#topic-199)
* [Commands Summary Cheat Sheet](#topic-205)
