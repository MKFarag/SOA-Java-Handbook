---
id: topic-135
slug: create-first-application
topicNumber: 135
title: "Create Your First Application"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create an Application container in the ACE Toolkit to isolate and organize your message flows."
object: "Application"
action: "Create Project"
commandName: "New Application"
synonyms:
  - "create application ace"
  - "new application wizard"
  - "independent resources"
  - "application project"
---
# Create Your First Application

In ACE, every flow you build should live inside an **Application**. An Application acts like a sealed box so your flows, schemas, and maps never collide with another app on the same server.

![New Application wizard where you type your application name](/images/ace/toolkit-new-application.png)

---

## How to Create an Application

1. In the **Application Development** pane (top-left), click **New -> Application** (or right-click empty white space -> **New -> Application...**).
2. Type a clear name, such as `OrderApp`.
3. Leave the working set default or click **Next** if you want to include an existing library right now.
4. Click **Finish**.

Your new folder tree immediately appears in **Application Development**:

![Application tree showing Flows, Resources, and Subflows folders](/images/ace/toolkit-application-tree.png)

---

## Always Use an Application (Not Independent Resources)

| Approach | Isolation | Easy BAR Deploy | Recommended? |
| :--- | :--- | :--- | :--- |
| **Inside an Application** | Private scope; won't clash with other apps | Yes (drag & drop onto Server) | **Yes — always use this** |
| **Independent Resources** | Shares global server namespace | Legacy style | No (only for very old migrations) |

> [!TIP]
> Double-click **Application Descriptor** inside your app if you ever need to link or unlink a Library later.

---

**Next:** [Static Library vs Shared Library →](#topic-136)
