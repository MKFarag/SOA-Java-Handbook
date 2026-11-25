---
id: topic-161
slug: fileinput-node
topicNumber: 161
title: "FileInput Node: Pick Up Files Automatically"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Poll a folder for CSV, XML, or text files and split records one-by-one into your message flow."
object: "FileInput Node"
action: "Watch Directory"
commandName: "FileInput"
synonyms:
  - "fileinput node ace"
  - "record detection"
  - "input directory"
  - "archive folder ace"
---
# FileInput Node: Pick Up Files Automatically

**`FileInput`** watches a local or mounted directory and starts your flow whenever a new file matching your pattern drops into the folder.

---

## Essential Properties

| Tab | Property | Example | Why It Matters |
| :--- | :--- | :--- | :--- |
| **Basic** | **Input directory \*** | `<InputDirectory>` | Folder ACE scans for incoming files |
| **Basic** | **File name or pattern** | `*.csv` or `orders_*.xml` | Picks which files to read |
| **Basic** | **Action on successful processing** | `Move to Archive Subdirectory` | Prevents re-reading the same file forever! |
| **Records and Elements** | **Record detection** | `Whole File` / `Delimited (Line)` / `Parsed Record` | Lets you split a 10,000-line CSV into 10,000 tiny flow runs |

---

## What Happens to Each Processed File

By default, ACE manages subdirectories automatically inside your **Input directory**:

- `mqsitransitin/` — file currently being read (locked while running)
- `mqsiarchive/` — finished files moved here safely (with optional timestamp)
- `mqsibackout/` — files that threw an unhandled error and couldn't finish

> [!WARNING]
> Always set **Action on successful processing** to **Move to Archive** or **Delete** — and avoid pointing two separate servers at the same `Input directory` unless you configure **File -> Locking / FTP** carefully.

---

**Next:** [FileOutput & FileRead: Write or Read Files →](#topic-162)
