---
id: topic-134
slug: ace-quick-glossary
topicNumber: 134
title: "ACE & MQ Quick Glossary"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Plain-English translation of every IBM ACE and IBM MQ term you will see in tutorials, commands, and errors."
object: "Terminology"
action: "Translate Terms"
commandName: "ACE Glossary"
synonyms:
  - "broker vs integration node"
  - "execution group"
  - "bar file meaning"
  - "ace glossary"
  - "mq terminology"
---
# ACE & MQ Quick Glossary

IBM documentation mixes new ACE names with older WebSphere Message Broker names. Keep this cheat table handy whenever a term looks unfamiliar.

---

## Core ACE Terms

| Term | Plain-English Meaning | Old Name You Might See |
| :--- | :--- | :--- |
| **Integration Node** | Manager that owns one or more runtime servers | Broker |
| **Integration Server** | The process that runs your deployed flows | Execution Group (EG) |
| **Application** | Isolated project container for flows, schemas, and maps | *(Application)* |
| **Message Flow** | Visual pipeline (`.msgflow`) made of wired nodes | Message Flow |
| **Node (on canvas)** | One processing step inside a flow (e.g., `MQInput`, `Mapping`, `Compute`) | Message Flow Node |
| **BAR File** | A `.bar` zip archive built for deployment to a server | Broker Archive |
| **Subflow** | Reusable mini-flow (`.subflow`) dropped inside parent flows | Subflow |
| **Policy Project** | Runtime settings (MQ host, DB user, URLs) separated from code | Configurable Service |

---

## Core IBM MQ Terms

| Term | Plain-English Meaning | Example |
| :--- | :--- | :--- |
| **Queue Manager (QMGR)** | The MQ server instance that hosts queues and delivers messages | `SCBQM` |
| **Local Queue (`QLOCAL`)** | A mailbox stored inside a Queue Manager where messages wait | `IN.Q`, `OUT.Q` |
| **Message Flow vs. Queue** | **MQ** stores messages safely on disk; **ACE** reads, transforms, and routes them | MQ = Mailbox, ACE = Worker |

> [!TIP]
> Watch out for the word **"Node"**: in CLI commands (`mqsilist`, **Integration Node**), it means the ACE runtime manager; on the **Flow Canvas**, it means a single building block like `HTTPInput` or `Compute`.

---

**Next:** [Create Your First Application →](#topic-135)
