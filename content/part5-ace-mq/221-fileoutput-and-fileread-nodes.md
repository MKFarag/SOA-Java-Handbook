---
id: topic-221
slug: fileoutput-and-fileread-nodes
topicNumber: 221
title: "FileOutput & FileRead: Writing & Lookup"
part: 'Part 5: ACE & MQ'
sectionNumber: 43
sectionTitle: 'Message Flow Patterns & Node Selection'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Write and append records to disk with FileOutput (atomic rename) and perform mid-flow reference file lookups with FileRead."
object: "FileOutput & FileRead"
action: "Write & Read Files"
commandName: "FileOutput / FileRead"
synonyms:
  - "fileoutput node"
  - "fileread node"
  - "write file ace"
  - "append to file"
  - "mid flow file read"
  - "atomic file rename"
  - "output file patterns"
---

Emits processed message records to destination files on disk (`FileOutput`) and looks up reference file data mid-flow (`FileRead`).
Use `FileOutput` to generate batched outbound reports, and `FileRead` to enrich in-flight messages with lookup tables without calling databases.

```
1. Outbound File Generation:
[ Compute Node ] ──► [ FileOutput Node ] ──► (Writes to C:\ACE\outbound\report_2026.csv)

2. Mid-Flow Reference Lookup:
[ MQInput Node ] ──► [ FileRead Node ] ──► [ Compute Node ]
                       (Fetches rates.xml)    (Combines rate with order)
```

| Node | Position in Flow | Primary Function | Atomic Delivery Guarantee |
| :--- | :--- | :--- | :--- |
| **`FileOutput`** | End of flow | Writes payload bytes/records to a local directory or remote FTP/SFTP server. | Atomic Rename (Writes to temporary file, renames on transaction commit). |
| **`FileRead`** | Middle of flow | Reads a specific file on disk based on a key and merges it into the message tree. | Read-only lock during message read. |

### Dynamic Output File Naming via ESQL
To set dynamic file names (e.g. based on customer ID and timestamp), set `LocalEnvironment` before the `FileOutput` node:

```sql
CREATE COMPUTE MODULE SetDynamicFileName_Compute
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        SET OutputRoot = InputRoot;
        -- Override destination folder and filename dynamically
        SET OutputLocalEnvironment.Destination.File.Directory = 'C:\ACE\outbound';
        SET OutputLocalEnvironment.Destination.File.Name = 
            'Order_' || CAST(InputRoot.JSON.Data.id AS CHARACTER) || '.json';
        RETURN TRUE;
    END;
END MODULE;
```

* **Atomic File Renaming:** `FileOutput` writes bytes to a staging directory first; only when the flow transaction commits successfully does ACE rename the file to its final name, ensuring external applications never read partial files.
* **Appending Records:** To aggregate multiple messages into one file (e.g. CSV lines), configure `Record definition` ➔ `Record is Delimited Data` and check `Append to existing file`.
* **FileRead Node Placement:** `FileRead` behaves similarly to `MQGet`: it executes in the middle of a flow to enrich messages with static files without querying a database.

* [FileInput Node: Directory Polling & Records](#topic-220)
* [Which Transport Protocol: HTTP vs MQ vs File](#topic-208)
* [Environment and LocalEnvironment Trees](#topic-152)
