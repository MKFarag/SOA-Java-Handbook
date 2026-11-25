---
id: topic-138
slug: subflows-reusable-blocks
topicNumber: 138
title: "Subflows (.subflow): Reusable Flow Blocks"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Bundle repeated nodes like audit logging or error handling into a reusable .subflow block."
object: "Subflow"
action: "Reuse Logic"
commandName: "Subflow (.subflow)"
synonyms:
  - "subflow ace"
  - ".subflow"
  - "input terminal subflow"
  - "reusable error handler flow"
---
# Subflows (.subflow): Reusable Flow Blocks

A **Subflow (`.subflow`)** is a mini message flow stored inside its own file so you can drop it into any main flow just like a single node.

![Error handler subflow showing Input terminal, Compute node, and MQOutput node in Flow Exerciser](/images/ace/subflow-error-handler-exerciser.png)

---

## When to Use a Subflow

- Every flow needs the **same error-logging steps** (`Compute` + `Trace` + `MQOutput` to an error queue).
- Every flow runs the **same header enrichment or security check** before doing business work.
- One huge flow has 25+ nodes and is hard to read — split logical chunks into subflows.

---

## How to Build One in 4 Steps

1. Right-click your Application or Library -> **New -> Subflow**.
2. Notice the Palette gives you two special terminals: **Input** (entry point) and **Output** (exit point). Drag at least an **Input** terminal onto the canvas.
3. Add your reusable nodes (for example `Compute` -> `MQOutput`) and wire `Input -> Compute -> MQOutput`.
4. Save the `.subflow`, open your main `.msgflow`, and drag the subflow from **Application Development** directly onto the main canvas.

---

## Important Rule for Shared Libraries

| Where You Put the `.subflow` | Broker Schema Rule |
| :--- | :--- |
| Inside an **Application** | Can stay in default schema |
| Inside a **Shared Library** | **Must** live inside a named Broker Schema (e.g., `com.myorg.errors`) |

> [!TIP]
> Think of a Subflow like a **function** in Java: write error logging once, fix bugs in one place, and reuse it in 20 flows.

---

**Next:** [Policy Projects & Packaging Decisions →](#topic-139)
