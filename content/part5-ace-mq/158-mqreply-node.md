---
id: topic-158
slug: mqreply-node
topicNumber: 158
title: "MQReply Node: Reply to ReplyToQ Automatically"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0 / MQ 9.4'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Automatically send an MQ response back to the queue and queue manager listed in the incoming message header."
object: "MQReply Node"
action: "Send Reply"
commandName: "MQReply"
synonyms:
  - "mqreply node"
  - "replytoq"
  - "replytoqmgr"
  - "request reply pattern mq"
---
# MQReply Node: Reply to ReplyToQ Automatically

**`MQReply`** is a specialized `MQOutput` node that requires **no hardcoded queue name** — it automatically reads `ReplyToQ` and `ReplyToQMgr` straight from the incoming `MQMD` header.

---

## When to Use `MQReply` vs. `MQOutput`

| Situation | Use `MQReply`? | Reason |
| :--- | :--- | :--- |
| Caller set `MQMD.ReplyToQ = 'APP1.REPLY.Q'` and expects dynamic reply | **Yes** | Automatically routes back to whoever called you |
| Flow always pushes to one fixed queue `OUT.Q` | **No** (use `MQOutput`) | Request messages might not have `ReplyToQ` populated |

---

## How Request-Reply Correlation Works

1. Caller sends request on `REQ.Q` with `MQMD.MsgId = 0x1234` and `MQMD.ReplyToQ = 'CLIENT.REPLY.Q'`.
2. Your flow processes the request and reaches **`MQReply`**.
3. Check **`MQMD.CorrelId = MsgId`** (automatic when your `Compute` node copies `MQMD` headers or uses default `MQReply` behavior) so the waiting caller picks up **its exact reply**.

> [!WARNING]
> If the incoming message has an **empty `ReplyToQ`**, `MQReply` throws an error (`BIP2677E`). Make sure calling systems set `ReplyToQ` or validate it first!

---

**Next:** [HTTPInput & HTTPReply: Expose a REST Endpoint →](#topic-159)
