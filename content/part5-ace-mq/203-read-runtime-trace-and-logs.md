---
id: topic-203
slug: read-runtime-trace-and-logs
topicNumber: 203
title: "Read Runtime Trace and Logs"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Retrieve and format binary integration node trace logs into readable text using mqsireadlog and mqsiformatlog."
object: "Diagnostics"
action: "read log"
commandName: "mqsireadlog mqsiformatlog"
synonyms:
  - "read log"
  - "read runtime trace"
  - "mqsireadlog"
  - "mqsiformatlog"
  - "view trace log"
  - "trace text"
---

Extracts binary user or service trace logs from memory buffers and formats them into readable XML/text files.
Use `mqsireadlog` and `mqsiformatlog` after capturing diagnostic traces to analyze ESQL evaluation statements line-by-line.

```cmd
mqsireadlog <NodeName> -u -e <ServerName> -f -o <BinaryLogFile>
mqsiformatlog -i <BinaryLogFile> -o <TextLogFile>
```

| Command | Option | Purpose |
| :--- | :--- | :--- |
| **`mqsireadlog`** | `-u -e <Server>` | Dumps binary user trace buffer for the specified integration server. |
| **`mqsiformatlog`**| `-i <Bin> -o <Txt>`| Formats raw binary trace into human-readable text. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsireadlog SCB -u -e default -f -o C:\trace\trace.bin
BIP8071I: Successful command completion.

C:\Program Files\IBM\ACE\12.0.3.0> mqsiformatlog -i C:\trace\trace.bin -o C:\trace\trace.txt
BIP8071I: Successful command completion.
```

* **Two-Step Operation:** ACE traces are stored in high-speed binary memory buffers; you must read them to disk, then format to text.
* **Turn Off First:** Always turn trace off before formatting to prevent log buffer overwrites.
* **Text Search:** Open `trace.txt` and search for `BIP` or your ESQL module name to find the exact line causing a failure.

* [Turn Trace On and Off (mqsichangetrace)](#topic-204)
* [BIP Codes Quick Reference Directory](#topic-206)
* [Real Session Walkthrough](#topic-189)
