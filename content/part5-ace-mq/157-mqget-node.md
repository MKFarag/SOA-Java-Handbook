---
id: topic-157
slug: mqget-node
topicNumber: 157
title: "MQGet Node: Read a Queue Mid-Flow"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Use MQGet in the middle of a flow to fetch a queued message on demand, often matching by Correlation ID."
object: "MQGet Node"
action: "Fetch Mid-Flow"
commandName: "MQGet"
synonyms:
  - "mqget node ace"
  - "get by correlation id"
  - "mqinput vs mqget"
  - "no message terminal"
---
# MQGet Node: Read a Queue Mid-Flow

**`MQGet`** acts like a synchronous *"read from MQ right now"* step inside an already-running flow (such as an HTTP flow that needs to collect a backend MQ reply).

---

## Why `MQGet` Exists

`MQInput` can **only** sit at the start of a flow. Whenever a message flow is already running (from `HTTPInput` or another `MQInput`) and needs to read a queue in the middle, use **`MQGet`**.

---

## Important Terminals on `MQGet`

| Terminal | Fires When... | What To Wire |
| :--- | :--- | :--- |
| **Out** | A matching message was found and read | Continue processing with the retrieved payload |
| **No Message** | Queue was empty (or Correlation ID wait timed out) | Return "Not ready / 202 Accepted" instead of treating it as a crash |
| **Warning** | Message truncated (buffer too small) | Increase buffer or inspect warning |
| **Failure** | Queue doesn't exist / MQ connection down | Error handler |

---

## Tip: Match Request to Reply by `CorrelId`

In **Properties -> Request**, check **Get by correlation ID**. ACE then only pulls the message whose `MQMD.CorrelId` matches your current message's `MsgId` or `CorrelId`, leaving everyone else's messages safely on the queue!

> [!WARNING]
> Keep **Wait interval (ms)** short (e.g., `5000` ms) if calling `MQGet` inside an `HTTPInput -> HTTPReply` flow so HTTP clients don't time out waiting on an empty queue.

---

**Next:** [MQReply Node: Reply to ReplyToQ Automatically →](#topic-158)
