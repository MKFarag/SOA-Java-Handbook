---
id: topic-175
slug: show-mq-version
topicNumber: 175
title: "Show MQ Version"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Commands'
versionBadge: IBM MQ 9.4
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Display exact IBM MQ build, version, release, and maintenance patch level using dspmqver."
object: "Queue Manager"
action: "version"
commandName: "dspmqver"
synonyms:
  - "show mq version"
  - "dspmqver"
  - "mq version"
  - "check mq version"
  - "mq patch level"
---

Displays the installed IBM MQ product version, release, maintenance level, and installation path.
Use `dspmqver` to verify patch levels when reporting issues or confirming compatibility with ACE 12.0.3.0.

```cmd
dspmqver [-i]
```

| Flag | Description |
| :--- | :--- |
| *(None)* | Displays primary installation version, build date, and license type. |
| **`-i`** | Displays all installations if multiple MQ side-by-side versions exist. |

```cmd
C:\Program Files\IBM\ACE\12.0.3.0> dspmqver
Name:        IBM MQ
Version:     9.4.0.0
Level:       p940-L240528
BuildType:   IKAP - SLSV
Platform:    IBM MQ for Windows (x64 platform)
Mode:        64-bit
O/S:         Windows Server 2022
```

* **Version Verification:** Confirm your version shows 9.4.x or 9.3.x LTS to ensure full command compatibility.
* **64-bit Compatibility:** ACE 12 requires 64-bit IBM MQ installations.
* **Troubleshooting:** Include the exact `Level:` output when opening IBM support cases.

* [List Queue Managers and Status (dspmq)](#topic-174)
* [Open runmqsc](#topic-169)
* [Open ACE Command Console (mqsiprofile)](#topic-187)
