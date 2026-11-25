---
id: topic-131
slug: ace-first-time-launch
topicNumber: 131
title: "First Time Opening ACE Toolkit"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Open IBM App Connect Enterprise Toolkit for the first time, pick a workspace folder, and reach the main workbench."
object: "ACE Toolkit"
action: "Launch & Setup"
commandName: "Workspace Launcher"
synonyms:
  - "ace toolkit first time"
  - "workspace launcher"
  - "welcome screen"
  - "ibm app connect toolkit"
---
# First Time Opening ACE Toolkit

IBM App Connect Enterprise (ACE) Toolkit is the desktop IDE where you draw message flows, map fields, and package apps to deploy.

When you open it for the very first time, you only need two clicks to start building.

![ACE Toolkit Workspace Launcher asking you to pick a workspace folder](/images/ace/toolkit-workspace-launcher.png)

---

## Step 1: Pick Your Workspace Folder

1. Open **IBM App Connect Enterprise Toolkit** from the Windows Start Menu.
2. When the **Workspace Launcher** pops up, accept the default folder or click **Browse...** to choose a clean folder (`<WorkspacePath>`).
3. Click **Launch**.

> [!TIP]
> A **workspace** is just the folder on your PC where the Toolkit saves your Application, Library, and Message Flow files. You can create a new workspace later from **File -> Switch Workspace**.

---

## Step 2: Leave the Welcome Tab

On a brand-new workspace, the Toolkit shows the **Welcome** screen first.

![ACE Toolkit Welcome screen with Go to IBM App Connect Enterprise Toolkit button](/images/ace/toolkit-welcome-page.png)

Click **Go to IBM App Connect Enterprise Toolkit** (or simply close the **Welcome** tab at the top left) to enter your working screen.

---

## Quick Checklist Before You Build

| Check | What You Want to See | Why It Matters |
| :--- | :--- | :--- |
| Perspective | **Integration Development** (top-right icon) | Shows Application view and Flow Canvas |
| Workspace path | Short path without spaces if possible | Avoids Windows long-path warnings |
| Toolkit vs Runtime | Toolkit is where you *build*; Integration Server is where flows *run* | You deploy a BAR file from Toolkit to a Server |

> [!NOTE]
> Even without a running server yet, you can still create applications, draw message flows, and write ESQL in the Toolkit right away.

---

**Next:** [The 4 Toolkit Panels You Actually Use →](#topic-132)
