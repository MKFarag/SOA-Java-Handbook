---
id: topic-167
slug: what-is-ibm-mq-vs-ace
topicNumber: 167
title: "What Is IBM MQ vs ACE?"
part: 'Part 5: ACE & MQ'
sectionNumber: 40
sectionTitle: 'IBM MQ Messaging'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Understand the clear split between IBM MQ (reliable mailboxes & queues) and ACE (logic, mapping & routing)."
object: "IBM MQ vs ACE"
action: "Compare Roles"
commandName: "MQ vs ACE"
synonyms:
  - "ibm mq vs ace"
  - "what is queue manager"
  - "mq explorer"
  - "difference between mq and ace"
---
# What Is IBM MQ vs ACE?

**IBM MQ** and **IBM App Connect Enterprise (ACE)** are two separate products designed to work together like a **post office** and a **processing office**.

![IBM MQ Explorer showing local queues IN.Q and OUT.Q inside SCBQM with current queue depth](/images/ace/mq-explorer-queues-depth.png)

---

## Simple Analogy

| Product | Analogy | Actual Job | Never Does |
| :--- | :--- | :--- | :--- |
| **IBM MQ** | Secure Mailbox / Post Office | Stores messages safely on disk in queues; guarantees **"once-and-only-once"** delivery even if servers reboot | Does **not** transform JSON to XML or call REST APIs |
| **IBM ACE** | Sorting & Processing Worker | Reads messages from queues/HTTP/files, transforms schemas, queries DBs, routes, and delivers results | Does **not** act as a long-term durable message broker itself |

---

## Can You Run ACE Without IBM MQ?

**Yes!** If your ACE flows only handle `HTTPInput -> Mapping -> HTTPReply` or `FileInput -> FileOutput`, IBM MQ does not even need to be installed.

However, as soon as you use **`MQInput`**, **`MQOutput`**, **`MQGet`**, **`MQReply`**, or **Aggregation/Collector** nodes, ACE must connect to an **IBM MQ Queue Manager** (like `SCBQM`).

---

**Next:** [Link an Integration Node to a Queue Manager (-q) →](#topic-168)
