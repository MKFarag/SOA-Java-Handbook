---
id: topic-164
slug: routetolabel-and-label-nodes
topicNumber: 164
title: "RouteToLabel & Label: Dynamic Branching"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 2 min read
shortDescription: "Jump cleanly to different Label branches using a destination list name set in Compute or SOAPInput."
object: "RouteToLabel & Label"
action: "Jump by Name"
commandName: "RouteToLabel & Label"
synonyms:
  - "routetolabel"
  - "label node ace"
  - "destination routerlist labelname"
  - "dynamic jump ace"
---
# RouteToLabel & Label: Dynamic Branching

When you have **10+ possible message types** (for example SOAP operations or country handlers), wiring 10 spaghetti lines out of one node gets messy. **`RouteToLabel`** jumps by name directly to matching **`Label`** nodes — with **no wires required** between `RouteToLabel` and `Label`.

---

## How It Works

```text
  [MQInput] ──▶ [Compute (sets labelName = 'CREATE')] ──▶ [RouteToLabel]

  [Label: 'CREATE'] ──▶ [CreateOrderSubflow] ──▶ [MQOutput]
  [Label: 'CANCEL'] ──▶ [CancelOrderSubflow] ──▶ [MQOutput]
```

---

## Step 1: Set the Target Label Name in ESQL

Inside the `Compute` node before `RouteToLabel` (`Compute mode = LocalEnvironment And Message`):

```esql
SET OutputLocalEnvironment.Destination.RouterList.DestinationData[1].labelName = InputRoot.JSON.Data.action;
```

## Step 2: Drop Matching `Label` Nodes

- Place **Label** nodes on the same flow canvas and set **Properties -> Basic -> Label name** to exact values like `CREATE` or `CANCEL`.
- `RouteToLabel` jumps straight to whichever `Label` matches `labelName`!

> [!WARNING]
> If `labelName` has no matching `Label` node on the canvas, `RouteToLabel` throws `BIP2670E`. Either validate allowed actions first or handle it on `Failure`.

---

**Next:** [TryCatch, Throw & Trace: Handle Errors & Debug →](#topic-165)
