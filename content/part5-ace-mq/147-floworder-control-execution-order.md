---
id: topic-147
slug: floworder-control-execution-order
topicNumber: 147
title: "FlowOrder: Control Which Path Runs First"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Guarantee whether Branch 1 finishes completely before Branch 2 starts when splitting one wire."
object: "FlowOrder Node"
action: "Guarantee Order"
commandName: "FlowOrder"
synonyms:
  - "floworder node"
  - "wire order execution"
  - "first terminal second terminal"
  - "multiple wires from one terminal"
---
# FlowOrder: Control Which Path Runs First

If you draw **two wires directly** out of one `Out` terminal, ACE decides on its own which wire runs first. Drop in a **FlowOrder** node whenever execution order matters.

---

## How FlowOrder Works

```text
                ┌───(First)───▶ [Audit DB / Log]   (Finishes 100% first)
  [Input] ──▶ [FlowOrder]
                └───(Second)──▶ [Call Partner API] (Runs only if First succeeded)
```

- **First terminal:** Always executes completely from start to finish first.
- **Second terminal:** Runs only **after** the entire `First` branch finishes without an uncaught error.

---

## When to Use vs. Skip It

| Scenario | Use `FlowOrder`? | Reason |
| :--- | :--- | :--- |
| Write to audit queue, **then** update DB, **then** reply HTTP | **Yes** | Guarantees audit happens before reply (and stops if audit fails) |
| Draw two wires directly from `Compute.Out` | **No** *(if order matters)* | Direct multi-wire order is not guaranteed by design |

> [!TIP]
> Notice that both branches receive the **exact same input message** that arrived at `FlowOrder.In`, unless you mutate `Environment` in Branch 1 — `Environment` changes stay visible in Branch 2!

---

**Next:** [5 Flow Patterns & HTTP vs MQ vs File →](#topic-148)
