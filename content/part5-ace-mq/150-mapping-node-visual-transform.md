---
id: topic-150
slug: mapping-node-visual-transform
topicNumber: 150
title: "Mapping Node (.map): Drag-and-Drop Mapping"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Create a Graphical Data Map (.map) to drag fields from input schema to output schema without writing ESQL."
object: "Mapping Node"
action: "Transform Visually"
commandName: "Graphical Data Map (.map)"
synonyms:
  - "mapping node ace"
  - ".map file"
  - "graphical data mapping"
  - "gdm json schema mapping"
---
# Mapping Node (.map): Drag-and-Drop Mapping

The **Mapping** node transforms messages visually using a **Graphical Data Map (`.map`)** file — drag a wire from an input field to an output field and let ACE generate the runtime transform for you.

![New Message Map wizard Step 1 creating `<MapName>`.map](/images/ace/mapping-wizard-step1.png)

---

## When to Use the Mapping Node

- **Use it** when transforming structured XML (XSD), JSON (JSON Schema / Swagger 2.0 / OpenAPI), or CSV/binary (DFDL) visually.
- **Use it** when business analysts need to review field mappings in pictures instead of code.
- **Skip it** when your payload is completely schemaless JSON with changing keys — use **Compute** instead.

---

## Create a Map in 4 Steps

1. Drag a **Mapping** node onto your flow canvas and double-click it to launch the **New Message Map** wizard.
2. Give the map a clear name (`<MapName>`) and click **Next**.
3. Pick your **Map inputs** (source schema) and **Map outputs** (target schema), then click **Finish**.

![Select map inputs and outputs dialog in the Mapping wizard](/images/ace/mapping-wizard-io-schemas.png)

4. Drag wires between source fields on the left and target fields on the right, choosing transforms like **Move**, **Assign**, **Concat**, **If**, or **For each**:

![Graphical Data Mapping Editor canvas showing Move, Assign, and For each transforms](/images/ace/mapping-editor-canvas.png)

---

## Mapping JSON Fields Too

You don't always need an XSD file — in ACE 12, the **JSON** editor lets you model JSON Schema objects visually or use `Add User-Defined` elements inside `.map`:

![Mapping JSON schema tree inside the Graphical Data Mapping editor](/images/ace/mapping-json-tree.png)

---

## Common Built-in Transforms

| Transform | What It Does | Example |
| :--- | :--- | :--- |
| **Move** | Copies value directly | `input.orderId -> output.id` |
| **Assign** | Sets a constant hardcoded value | `output.source = 'ACE'` |
| **Concat** | Joins two+ strings with a separator | `firstName + ' ' + lastName` |
| **If / Else** | Conditional mapping via XPath 2.0 | `$amount > 1000 -> 'VIP'` |
| **For each** | Loops over an array to build output array | `items[*] -> lineItems[*]` |
| **Select / DB Routine** | Queries or calls a database mid-map | Lookup customer tier by ID |

> [!TIP]
> Watch the **Properties -> Transform** panel on the right inside the Map Editor: every green line shows the exact XPath 2.0 condition or custom expression running on that field.

---

**Next:** [Compute Node: Transform Messages with ESQL →](#topic-151)
