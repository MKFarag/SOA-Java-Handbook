---
id: topic-137
slug: create-and-reference-libraries
topicNumber: 137
title: "Create and Reference Libraries"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Create a Shared or Static Library and link your Application to it in the Toolkit."
object: "Library Reference"
action: "Link Library"
commandName: "Manage Library References"
synonyms:
  - "manage library references"
  - "reference shared library"
  - "included libraries"
  - "new library ace"
---
# Create and Reference Libraries

Creating a library takes two steps: **create the library**, then tell your **Application** to reference it.

![Toolkit Quick Start options to create an Application or Shared Library](/images/ace/toolkit-quickstart-app-shared-lib.png)

---

## Step 1: Create the Library

1. Right-click empty space in **Application Development** -> **New -> Library...**
2. Enter a name like `CommonSchemasLib`.
3. Select **Shared library** *(recommended for enterprise schemas/subflows)* or **Static library**.
4. Click **Finish**.

---

## Step 2: Reference It from Your Application

1. Right-click your Application (for example `OrderApp`) in **Application Development**.
2. Click **Manage Library References...**
3. Check the box next to `CommonSchemasLib`.
4. Click **OK**.

Your library now appears under the **Included Libraries** folder inside your Application:

![Application tree showing a linked library under Included Libraries](/images/ace/toolkit-included-libraries.png)

---

## Deploying Order Matters (Shared Libraries)

- **Shared Library:** Deploy the **Shared Library first** to your Integration Server, then deploy the Application (or select both together in the BAR file). If the Shared Library is missing on the server, the Application deploy fails with an unresolved dependency error.
- **Static Library:** No separate deploy step — ACE automatically bundles a copy inside your Application's BAR file.

> [!TIP]
> To break a link later, right-click the App -> **Manage Library References...** and uncheck the library.

---

**Next:** [Subflows (.subflow): Reusable Flow Blocks →](#topic-138)
