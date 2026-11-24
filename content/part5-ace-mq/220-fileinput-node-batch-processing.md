---
id: topic-220
slug: fileinput-node-batch-processing
topicNumber: 220
title: "FileInput Node: Directory Polling & Records"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Ingest batch files from local directories, parse delimited records, and handle archive and backout directories with FileInput."
object: "FileInput Node"
action: "Ingest Files"
commandName: "FileInput"
synonyms:
  - "fileinput node"
  - "file polling"
  - "process files"
  - "record by record"
  - "csv file processing"
  - "file archive backout"
  - "batch file input"
---

Polls a file system directory for incoming files, reads records, and propagates messages through an ACE message flow.
Use the `FileInput` node to process end-of-day batch files, CSV feeds, or flat files from SFTP mount points.

```
FileInput Directory Polling Lifecycle:
[ Input Directory: C:\inbound ] ──► Read & Split Records ──► [ Archive Directory: C:\inbound\mqsiarchive ]
             │                                                               ▲
             └────────────────── (On Processing Error) ─────────────────────► [ Backout: C:\inbound\mqsibackout ]
```

| Property Tab | Property Name | Meaning | Recommended Value |
| :--- | :--- | :--- | :--- |
| **Basic** | `Input directory` | Absolute folder path polled for incoming files. | `C:\ACE\orders\in` |
| **Basic** | `File name or pattern` | Wildcard pattern to match target files. | `*.csv` or `order_*.txt` |
| **Records** | `Record detection` | How the file is split into messages. | `Delimited` (line by line) or `Whole File` |
| **Records** | `Delimiter` | Record boundary separator. | `DOS or UNIX Line End` (`\r\n`) |
| **Action** | `Action on successful processing`| What happens to the file after all records finish. | `Move to Archive Subdirectory` |
| **Action** | `Action on error` | What happens if a record throws an unhandled error. | `Move to Backout Subdirectory` |

### Key Terminals on FileInput Node
* **`out`:** Fires once for **each record** extracted from the file (or once for the entire file if `Whole File` is chosen).
* **`End of File`:** Fires **once** after all records in the file have been processed completely. Ideal for committing database batches or sending completion emails.
* **`failure`:** Fires if the input file cannot be accessed or locks fail.

### Minimal Example Flow: Processing CSV Orders
```
[ FileInput (*.csv) ] ──┬──► (out)         ──► [ Compute: Map Record to JSON ] ──► [ MQOutput: ORDERS.Q ]
                        └──► (End of File) ──► [ Compute: Send Summary Email ]
```

* **Atomic File Ingestion:** ACE locks the file during processing by renaming it with an internal extension (e.g. `.mqa...`) so concurrent processes cannot read partial files.
* **Archive Subdirectory:** By default, processed files are automatically moved to a subfolder named `mqsiarchive` inside the input directory.
* **LocalEnvironment File Metadata:** The node populates metadata under `InputLocalEnvironment.File` (including `Name`, `Directory`, `TimeStamp`, and `RecordNumber`).

* [FileOutput & FileRead: Writing & Lookup](#topic-221)
* [Which Transport Protocol: HTTP vs MQ vs File](#topic-208)
* [Environment and LocalEnvironment Trees](#topic-152)
