---
id: topic-153
slug: resetcontentdescriptor-switch-parser
topicNumber: 153
title: "ResetContentDescriptor: Switch Parser Without Rewriting"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Change the Message Domain (for example BLOB to JSON or XMLNSC) mid-flow with zero ESQL."
object: "ResetContentDescriptor Node"
action: "Switch Parser"
commandName: "ResetContentDescriptor"
synonyms:
  - "resetcontentdescriptor node"
  - "change domain mid flow"
  - "blob to xmlnsc"
  - "reparse message ace"
---
# ResetContentDescriptor: Switch Parser Without Rewriting

Sometimes a flow starts with **BLOB** (raw bytes) so it can inspect a header or check routing rules first, and *later* needs to parse those bytes as **JSON** or **XMLNSC**. Drop in **ResetContentDescriptor** to switch parsers cleanly.

![ResetContentDescriptor Basic properties showing Message domain and Reset check box](/images/ace/reset-content-descriptor-properties.png)

---

## When to Use It

- **One input queue receives multiple formats:** Start `MQInput` as `BLOB`, inspect the first characters or an MQRFH2 header, route JSON messages through `ResetContentDescriptor (JSON)` and XML messages through `ResetContentDescriptor (XMLNSC)`.
- **Save CPU on pass-through audit:** Keep payload as `BLOB` until after logging/archiving, then parse only on the branch that needs fields.

---

## Key Setting: Check `Reset message domain`!

1. Select **ResetContentDescriptor** -> **Properties -> Basic**.
2. Choose your target **Message domain** (e.g., `JSON` or `XMLNSC`).
3. **Check the `Reset message domain` checkbox** — if left unchecked, ACE ignores the dropdown!

> [!TIP]
> `ResetContentDescriptor` does not copy or alter any payload bytes — it simply tells ACE's parser how to interpret the bitstream for all downstream nodes.

---

**Next:** [MQ Nodes Overview (Input, Output, Get, Reply) →](#topic-154)
