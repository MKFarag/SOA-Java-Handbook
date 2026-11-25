---
id: topic-162
slug: fileoutput-and-fileread-nodes
topicNumber: 162
title: "FileOutput & FileRead: Write or Read Files"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Write flow messages to disk with FileOutput (plus Finish File) or read a file mid-flow with FileRead."
object: "FileOutput & FileRead"
action: "Write & Read Files"
commandName: "FileOutput & FileRead"
synonyms:
  - "fileoutput node ace"
  - "fileread node"
  - "finish file terminal"
  - "write file in ace"
---
# FileOutput & FileRead: Write or Read Files

Just like `MQOutput` and `MQGet` for queues, ACE gives you **`FileOutput`** to write files out and **`FileRead`** to read a lookup file mid-flow.

![FileOutput Basic properties showing Directory and File name or pattern](/images/ace/fileoutput-node-properties.png)

---

## `FileOutput` Basics

| Property | Example | Effect |
| :--- | :--- | :--- |
| **Directory \*** | `C:\ace-data\out` | Folder where output file is created |
| **File name or pattern \*** | `report_%u.json` | Output filename (`%u` adds a unique ID if desired) |
| **Mode for writing to file** | `Write directly` or `Stage in mqsitransit and move on Finish File` | Use staging when appending multiple records into one file! |

---

## Important Rule: Staging + `Finish File`

If a `FileInput` splits 500 records and sends all 500 to **`FileOutput`**:
1. Each record enters `FileOutput.In` and appends to a staged file in `mqsitransit/`.
2. Wire **`FileInput.End of Data`** -> **`FileOutput.Finish File`** so ACE finalizes and moves the completed file into `C:\ace-data\out`!

---

## When to Use `FileRead`

Need to read a static JSON config file or customer file **in the middle of an HTTP or MQ flow**? Use **`FileRead`**:
- Wire `In` -> Read configured path -> payload lands at `Out`.
- Wire `No Match` if the requested file might not exist.

> [!TIP]
> You can override the output directory or filename per message using `OutputLocalEnvironment.Destination.File.Directory` and `OutputLocalEnvironment.Destination.File.Name`.

---

**Next:** [Route vs Filter: Split Messages by Content →](#topic-163)
