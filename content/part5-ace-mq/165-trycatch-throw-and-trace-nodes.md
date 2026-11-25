---
id: topic-165
slug: trycatch-throw-and-trace-nodes
topicNumber: 165
title: "TryCatch, Throw & Trace: Handle Errors & Debug"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Catch local errors with TryCatch, fail explicitly with Throw, and write quick debug logs using Trace."
object: "TryCatch, Throw, Trace"
action: "Catch & Debug"
commandName: "TryCatch Throw Trace"
synonyms:
  - "trace node ace"
  - "throw node"
  - "trycatch node"
  - "debug file trace pattern"
---
# TryCatch, Throw & Trace: Handle Errors & Debug

These three nodes (in the **Construction** and **Error Handling** drawers) give you fine-grained error control and easy visibility into message contents.

![Construction palette drawer showing Trace, TryCatch, Throw, and FlowOrder nodes](/images/ace/construction-palette-trace.png)

---

## Quick Role Summary

| Node | Purpose | Key Setting |
| :--- | :--- | :--- |
| **`TryCatch`** | Wrap a risky chain (`Try` terminal) and handle errors (`Catch` terminal) | Wire `Try` -> Risky call, `Catch` -> Fallback |
| **`Throw`** | Deliberately raise a custom exception to trigger rollback or `Catch` | Set **Message number** (e.g., `3001`) & **Message text** |
| **`Trace`** | Print message trees or custom debug text to a file or user log | Set **Destination** (`File`) & **Pattern** |

---

## Print Your Whole Message with `Trace`

![Trace node Basic properties showing Destination, File path, and Pattern](/images/ace/trace-node-properties.png)

In **Properties -> Basic**, set:
- **Destination:** `File`
- **File path:** `C:\ace-logs\debug.txt`
- **Pattern:**

```text
Time: ${CURRENT_TIMESTAMP}
Payload: ${Root.JSON.Data}
Exception: ${ExceptionList}
```

> [!TIP]
> Put a `Trace` node on your **`Catch`** branch during development so you immediately see the exact `ExceptionList` and payload that broke! Turn off or remove verbose file traces in high-traffic production flows.

---

**Next:** [AggregateControl, Request & Reply: Fan-Out / Fan-In →](#topic-166)
