---
id: topic-204
slug: turn-trace-on-and-off
topicNumber: 204
title: "Turn Trace On and Off"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Enable and disable user debug tracing on an integration server using mqsichangetrace."
object: "Diagnostics"
action: "toggle trace"
commandName: "mqsichangetrace"
synonyms:
  - "turn trace on"
  - "turn trace off"
  - "mqsichangetrace"
  - "user trace"
  - "debug trace"
  - "trace on off"
---

Enables or disables detailed user diagnostic tracing on a specific integration server to record every ESQL statement.
Use `mqsichangetrace` during troubleshooting to diagnose elusive bugs, and turn it off immediately after to restore performance.

```cmd
-- Turn Trace ON
mqsichangetrace <NodeName> -u -e <ServerName> -l debug -m fast -c 100000

-- Turn Trace OFF
mqsichangetrace <NodeName> -u -e <ServerName> -l none
```

| Option | Value | Meaning |
| :--- | :--- | :--- |
| **`-u`** | Flag | User trace (records user flow and ESQL activity). |
| **`-l`** | `debug` / `none` | Log level: `debug` captures all statements; `none` disables tracing. |
| **`-m`** | `fast` | Uses non-blocking high-speed in-memory circular buffer. |
| **`-c`** | `100000` | Buffer size in kilobytes. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> mqsichangetrace SCB -u -e default -l debug -m fast -c 100000
BIP8096I: Successful command completion.

-- Send test message, then immediately turn trace off:
C:\Program Files\IBM\ACE\12.0.3.0> mqsichangetrace SCB -u -e default -l none
BIP8096I: Successful command completion.
```

* **Performance Impact:** Active debug trace slows down flow throughput by 30-50%; **never leave trace enabled permanently**.
* **Single Server Target:** Always target the specific server (`-e default`) rather than tracing the entire integration node.
* **Next Step:** Once trace is turned off, dump the log using `mqsireadlog` and `mqsiformatlog`.

* [Read Runtime Trace and Logs (mqsireadlog)](#topic-203)
* [Real Session Walkthrough](#topic-189)
* [Commands Summary Cheat Sheet](#topic-205)
