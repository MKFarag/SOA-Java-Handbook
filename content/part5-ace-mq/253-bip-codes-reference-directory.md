---
id: topic-253
slug: bip-codes-reference-directory
topicNumber: 253
title: "BIP Codes Reference Directory (By Symptom)"
part: 'Part 5: ACE & MQ'
sectionNumber: 46
sectionTitle: 'BIP Codes Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Instant plain-English guide to every common IBM ACE BIP info and error code grouped by what you were doing when you saw it."
object: "BIP Codes"
action: "Lookup & Fix"
commandName: "BIP Codes Directory"
synonyms:
  - "bip codes reference"
  - "bip8018e"
  - "bip8071i bip8096i"
  - "bip2521e bip5025e bip2677e"
  - "bip8290i bip8299i"
---

# BIP Codes Reference Directory (By Symptom)

IBM ACE prints a **`BIPxxxx`** message code in the console, Web UI, and logs (`I` = Info/Good, `W` = Warning, `E` = Error). Find your code below grouped by where it happens.

---

## 1. CLI Startup, Command, ODBC & Queue Manager Codes

| Code | Level | Meaning | Exact Action |
| :--- | :--- | :--- | :--- |
| **`BIP8071I`** | Info | *Successful command completion* | Good! Your command worked |
| **`BIP8096I`** | Info | Node start command accepted *(check status after a few seconds)* | Run `mqsilist <Node>` to confirm servers report `running` |
| **`BIP8290I` / `BIP8299I`** | Info | `mqsicvp` verified ODBC environment & matched `mqsisetdbparms` login | Database ODBC connectivity is healthy |
| **`BIP8018E`** | Error | Node's associated Queue Manager doesn't exist or failed to start | Run `dspmq` & `strmqm <QMGR>`, or verify `-q` name |
| **`BIP8019E`** | Error | Command flag syntax error or missing parameter | Check required `-e`, `-k`, `-m`, `-a` flags |
| **`BIP1990I` / `BIP1991I`** | Info | Independent Integration Server starting / initialized cleanly | Server is ready on its REST/HTTP ports! |
| **`BIP2866I`** | Info | Admin security inactive (normal on default dev servers) | Enable auth in `server.conf.yaml` for shared/prod |

---

## 2. Deployment, BAR & Server Status Codes

| Code | Level | Meaning | Exact Action |
| :--- | :--- | :--- | :--- |
| **`BIP1284I` / `BIP1285I`** | Info | Integration Server `<IntegrationServerName>` is running / stopped | Expected status report from `mqsilist` / `mqsistop` |
| **`BIP1275I` / `BIP1276I`** | Info | Application / Flow is running / stopped | Resume with `mqsistartmsgflow` if stopped |
| **`BIP1039I` / `BIP1092I`** | Info | BAR deployment started / completed cleanly | Run `mqsilist <Node> -e <Server>` to confirm active flows |
| **`BIP9332I`** | Info | Application created or updated cleanly | Normal `mqsideploy` confirmation |
| **`BIP15201I`** | Info | `ibmint package` built BAR file cleanly | Deploy the generated `.bar` with `mqsideploy` |
| **`BIP4395E`** | Error | Unresolved **Shared Library** dependency during deploy | Deploy the missing Shared Library to the server first! |

---

## 3. Flow Runtime, ESQL, Mapping & Parser Errors

| Code | Level | Meaning | Exact Action |
| :--- | :--- | :--- | :--- |
| **`BIP5025E`** | Error | **XML/JSON Parser failure** — payload doesn't match node's Message Domain | Verify Input payload matches node domain (`JSON` vs `XMLNSC` vs `BLOB`) |
| **`BIP2521E`** | Error | Runtime ESQL failure (`InputRoot` write attempted or null math/conversion) | Never assign to `InputRoot`; wrap nullable values with `COALESCE()` |
| **`BIP2531E`** | Error | Array index out of range or `0`-based index in ESQL | Check ESQL loops start at `[1]`, not `[0]`! |
| **`BIP2670E`** | Error | `RouteToLabel` couldn't find matching `Label` node | Verify `labelName` spelling matches a `Label` node on canvas |
| **`BIP2677E`** | Error | `MQReply` received a message with empty `MQMD.ReplyToQ` | Ensure requests stamp `ReplyToQ` or use `MQOutput` instead |
| **`BIP2666E` / `BIP2667E`** | Error | MQ node failed connecting or putting/getting queue (`MQRC` embedded!) | Read the `MQRC` 4-digit code inside the text (e.g., `2059`, `2085`, `2035`) |

---

> [!TIP]
> You can inspect **any** BIP error message's full explanation right in your ACE Console by running: `mqsiexplain <BIPNumber>` (for example `mqsiexplain BIP5025`).

---

**Back to Start of Part 5:** [First Time Opening ACE Toolkit →](#topic-131)
