---
id: topic-140
slug: what-is-a-message-flow
topicNumber: 140
title: "What Is a Message Flow (.msgflow)?"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Understand what a Message Flow is: an event-driven visual pipeline triggered by incoming messages."
object: "Message Flow"
action: "Understand Flow"
commandName: "Message Flow (.msgflow)"
synonyms:
  - "what is message flow"
  - ".msgflow"
  - "flow canvas"
  - "outline view ace"
---
# What Is a Message Flow (.msgflow)?

A **Message Flow (`.msgflow`)** is a visual assembly line inside an Application. It wakes up when a message arrives, runs each node along the wires you drew, and sends out the result.

![Message Flow Canvas showing wired nodes and the Outline bird's-eye view](/images/ace/toolkit-flow-canvas-outline.png)

---

## The 3 Parts of Every Flow

1. **Input Node (Trigger):** Listens for incoming data (for example `MQInput`, `HTTPInput`, or `FileInput`). Nothing happens until a message arrives here.
2. **Processing Nodes (Middle):** Transform, filter, route, enrich, or log the message (for example `Mapping`, `Compute`, `Route`, `Trace`).
3. **Output Node (Delivery):** Sends the message out to a queue, HTTP client, API, or file (for example `MQOutput`, `HTTPReply`, `FileOutput`).

---

## Simple Mental Model

```text
  [MQInput]  ───(Out)───▶  [Mapping / Compute]  ───(Out)───▶  [MQOutput]
  (Wakes up)                 (Transforms JSON/XML)             (Writes to OUT.Q)
```

- A message flow **does not poll in a loop**; it waits quietly using almost zero CPU until a message lands on its Input node.
- You can inspect big flows easily using the small **Outline** map in the bottom-left corner of the editor.

> [!NOTE]
> Every `.msgflow` runs at least one **Input node** to start. One flow can even have two different input triggers if needed, though keeping one trigger per flow is cleaner and easier to debug.

---

**Next:** [Create, Add Nodes, Wire & Save a Flow →](#topic-141)
