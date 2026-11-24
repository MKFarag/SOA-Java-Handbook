---
id: topic-205
slug: commands-summary-cheat-sheet
topicNumber: 205
title: "Commands Summary Cheat Sheet"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ACE Administration Commands'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Master 1-page CLI matrix comparing IBM MQ commands, MQSC console syntax, and ACE integration node commands."
object: "Cheat Sheet"
action: "Reference"
commandName: "Commands Cheat Sheet"
synonyms:
  - "commands cheat sheet"
  - "cli reference"
  - "commands summary"
  - "ace commands table"
  - "mq commands table"
---

Master reference table summarizing the most frequent commands across IBM MQ and ACE administration.
Use this cheat sheet as a fast lookup for exact command names and common flag patterns.

| Object | Action | Exact Command Syntax |
| :--- | :--- | :--- |
| **Queue Manager** | Create | `crtmqm -q -d SYSTEM.DEAD.LETTER.QUEUE <QMGR>` |
| **Queue Manager** | Start | `strmqm <QMGR>` |
| **Queue Manager** | Stop (Immediate) | `endmqm -i <QMGR>` |
| **Queue Manager** | List Status | `dspmq` |
| **MQSC Shell** | Open | `runmqsc <QMGR>` |
| **Local Queue** | Define | `DEFINE QLOCAL('IN.Q') REPLACE` *(Inside runmqsc)* |
| **Local Queue** | Check Depth | `DISPLAY QSTATUS('IN.Q') CURDEPTH` *(Inside runmqsc)* |
| **Test Messages** | Put | `amqsput <QueueName> <QMGR>` |
| **Test Messages** | Get | `amqsget <QueueName> <QMGR>` |
| **Integration Node** | Create | `mqsicreatebroker <Node> -q <QMGR>` |
| **Integration Node** | Start | `mqsistart <Node>` |
| **Integration Node** | Stop | `mqsistop <Node> -i` |
| **Integration Node** | List | `mqsilist <Node> -d 2` |
| **Integration Server**| Create | `mqsicreateexecutiongroup <Node> -e <Server>` |
| **BAR Archive** | Package | `ibmint package --input-path <Dir> --output-bar-file <Bar>` |
| **BAR Archive** | Deploy | `mqsideploy <Node> -e <Server> -a <Bar>` |
| **Message Flow** | Start / Stop | `mqsistartmsgflow <Node> -e <Server> -m <Flow>` |
| **User Trace** | Enable / Disable | `mqsichangetrace <Node> -u -e <Server> -l debug` / `-l none` |

* [Open ACE Command Console (mqsiprofile)](#topic-187)
* [List Nodes and Status (mqsilist)](#topic-190)
* [BIP Codes Quick Reference Directory](#topic-206)
