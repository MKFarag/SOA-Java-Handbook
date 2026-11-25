---
id: topic-141
slug: create-wire-save-message-flow
topicNumber: 141
title: "Create, Add Nodes, Wire & Save a Flow"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ACE Message Flows'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Step-by-step guide to creating a .msgflow, dragging nodes from the Palette, wiring terminals, and saving."
object: "Message Flow Editor"
action: "Build Flow"
commandName: "New Message Flow"
synonyms:
  - "create message flow"
  - "palette drawers"
  - "create connection dialog"
  - "wire nodes ace"
---
# Create, Add Nodes, Wire & Save a Flow

Building your first flow takes 4 quick actions in the Toolkit.

![New Message Flow dialog inside an Application](/images/ace/toolkit-new-message-flow.png)

---

## Step 1: Create the Flow File

1. Right-click your Application (for example `OrderApp`) -> **New -> Message Flow**.
2. Type a flow name like `ProcessOrderFlow`.
3. Click **Finish**. The blank grid **Flow Canvas** opens in the center.

---

## Step 2: Drag Nodes from the Palette

On the left side of the Flow Canvas is the **Palette**, grouped into drawers:

![ACE Flow Palette showing IBM MQ, Transformation, HTTP, Routing, and File drawers](/images/ace/toolkit-palette-drawers.png)

- Expand **IBM MQ** and drag `MQInput` onto the left side of the canvas.
- Expand **Transformation** and drag `Mapping` (or `Compute`) into the middle.
- Drag `MQOutput` onto the right side.

---

## Step 3: Wire the Nodes Together

Either **click the small `Out` pin** on `MQInput` and click `In` on the next node, **or** right-click `MQInput` -> **Create Connection...** and select the matching source and target terminals:

![Create Connection dialog linking Output terminal to Input terminal](/images/ace/toolkit-add-connection-dialog.png)

---

## Step 4: Fill Required Settings & Save

1. Click `MQInput` -> in **Properties** at the bottom, enter **Queue name** (every field with a red `*` is required).
2. Press **Ctrl + S** to save.
3. Check the **Problems** tab at the bottom — make sure zero red X errors remain.

> [!TIP]
> Notice the **Selection** and **Connection** icons at the very top of the Palette: stay on **Selection** (arrow icon) when moving nodes, and use right-click -> **Create Connection** to avoid missing tiny pins.

---

**Next:** [Life of One Message Through a Flow →](#topic-142)
