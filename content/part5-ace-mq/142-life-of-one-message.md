---
id: topic-142
slug: life-of-one-message
topicNumber: 142
title: "Life of One Message Through a Flow"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Trace what ACE does internally from the millisecond a message arrives to commit or rollback."
object: "Message Execution"
action: "Trace Lifecycle"
commandName: "Message Tree & Commit"
synonyms:
  - "message lifecycle ace"
  - "message tree read only"
  - "transaction commit rollback"
  - "parser serializer"
---
# Life of One Message Through a Flow

Understanding what ACE does inside a single flow run explains almost every beginner error around parsers, read-only trees, and lost messages.

![5-step lifecycle diagram: Raw Bytes -> Input Parser -> Logical Tree -> Transform/Route -> Output Serializer](/images/ace/diagram-message-lifecycle.svg)

---

## What Happens Step by Step

1. **Arrival:** Raw bytes land on `MQInput` or `HTTPInput` (for example a JSON string or MQ message).
2. **Parsing (Lazy):** ACE builds the logical **InputRoot** tree using the **Message Domain** you chose on the Input node (such as `JSON` or `XMLNSC`).
3. **Propagation:** Your `OutputRoot` or unchanged `InputRoot` travels node-by-node down each wire as a **Message Assembly** (Data + Properties + Headers + LocalEnvironment + Environment + ExceptionList).
4. **Serialization:** When it reaches `MQOutput` or `HTTPReply`, ACE turns the logical tree back into raw bytes on the wire.
5. **Commit or Rollback:** If the whole flow finishes cleanly, ACE commits the transaction (MQ message disappears from input queue and stays on output queue). If an uncaught error happens, ACE rolls back and restores the input message.

---

## 3 Golden Rules Every Beginner Should Know

- **InputRoot is Read-Only:** You cannot modify `InputRoot` directly in ESQL. You copy or build into `OutputRoot` instead.
- **Synchronous Thread:** A single thread carries one message all the way to the end of its wired path before returning to the input node.
- **No Unhandled Error = Commit:** Wiring `Failure` or `Catch` turns a crash into a handled branch — remember to decide whether that branch logs and commits or rethrows!

---

**Next:** [Terminals: In, Out, Failure & Catch →](#topic-143)
