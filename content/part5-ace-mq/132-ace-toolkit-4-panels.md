---
id: topic-132
slug: ace-toolkit-4-panels
topicNumber: 132
title: "The 4 Toolkit Panels You Actually Use"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Learn the 4 main panes in the ACE Toolkit screen so you never feel lost when editing flows."
object: "Toolkit Perspective"
action: "Navigate UI"
commandName: "Integration Development"
synonyms:
  - "application development pane"
  - "properties view"
  - "integration explorer"
  - "toolkit layout"
---
# The 4 Toolkit Panels You Actually Use

The ACE Toolkit looks busy at first because it is built on Eclipse, but you spend **95% of your time** in just 4 panels.

![ACE Toolkit Integration Development perspective showing the 4 main panels](/images/ace/toolkit-integration-development.png)

---

## What Each Panel Does

| Panel | Location | What You Do Here |
| :--- | :--- | :--- |
| **1. Application Development** | Top-Left | Browse your Applications, Libraries, Flows (`.msgflow`), Maps (`.map`), and ESQL files |
| **2. Editor / Flow Canvas** | Center | Drag nodes, connect wires between terminals, and edit ESQL or JSON schemas |
| **3. Properties** | Bottom | Configure the selected node (queue name, HTTP URL path, domain parser, ESQL module) |
| **4. Integration Explorer** | Bottom-Left | Connect to local or remote Integration Nodes and Integration Servers to deploy and watch status |

---

## When Things Disappear

Accidentally closed a panel or moved everything around? Reset the layout in two clicks:

1. Click **Window** in the top menu.
2. Click **Perspective -> Reset Perspective... -> Yes**.

And watch the **Problems** tab next to **Properties** at the bottom:

- **Red X icon:** A required field (marked with `*`) is missing, or ESQL has a syntax error. You must fix red errors before deploying.
- **Yellow triangle:** A warning. Your flow can still deploy, though it is worth checking.

> [!TIP]
> Single-click a node on the canvas to edit its settings in **Properties** at the bottom. Double-click a **Compute** or **Mapping** node to open its code or visual map in the center editor.

---

**Next:** [How ACE Fits Together (Node, Server, App, Flow) →](#topic-133)
