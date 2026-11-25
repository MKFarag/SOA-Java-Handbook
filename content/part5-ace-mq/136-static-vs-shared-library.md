---
id: topic-136
slug: static-vs-shared-library
topicNumber: 136
title: "Static Library vs Shared Library"
part: 'Part 5: ACE & MQ'
sectionNumber: 37
sectionTitle: 'ACE Toolkit & Packaging'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Know exactly when to use a Static Library (copied into each app) versus a Shared Library (deployed once, shared at runtime)."
object: "Library"
action: "Compare & Choose"
commandName: "Static vs Shared Library"
synonyms:
  - "static library vs shared library"
  - "ace library types"
  - "shared library deployment"
  - "reuse esql schema"
---
# Static Library vs Shared Library

A **Library** holds reusable assets — XML/JSON schemas, ESQL modules, subflows, or maps — that more than one Application needs. ACE gives you two very different types.

![Diagram comparing how Static Libraries copy into each App BAR vs how Shared Libraries deploy once to the server](/images/ace/diagram-static-vs-shared-library.svg)

---

## Side-by-Side Comparison

| Feature | Static Library | Shared Library |
| :--- | :--- | :--- |
| **Where it lives at runtime** | Copied inside **each** App's BAR file | Deployed **once** directly to the Integration Server |
| **When you change 1 file** | Must rebuild and redeploy **every** App that uses it | Redeploy **only** the Shared Library; all Apps use it immediately |
| **App version independence** | App A can keep v1 while App B upgrades to v2 | All referencing Apps always see the single deployed version |
| **Can hold a `.msgflow`?** | No (only subflows, schemas, maps, ESQL, Java) | **No** (only subflows, schemas, maps, ESQL, Java) |
| **Can reference the other?** | Static cannot reference Shared | Shared cannot reference Static |

---

## Toolkit & Runtime View

When you create a library, the Toolkit asks you to pick **Shared library** or **Static library**:

![New Library wizard showing Shared library and Static library radio options](/images/ace/toolkit-new-library-static-vs-shared.png)

Notice what appears on the Integration Server after deployment: **Shared libraries** sit directly beside Applications on the server tree, while **Static libraries** stay hidden inside each Application folder.

![Integration Explorer runtime view showing Shared libraries deployed alongside Applications](/images/ace/runtime-static-vs-shared-libraries.png)

---

## Simple Rule: Which One Should I Pick?

- Choose a **Shared Library** when 2+ apps share company schemas (like a `CommonErrorSubflow` or enterprise XSD) and everyone should get fixes immediately in one deploy.
- Choose a **Static Library** when an app needs its own locked snapshot of helper files and must **not** change when another team updates the library.

> [!WARNING]
> If you put a **subflow** inside a **Shared Library**, it **must** be inside a named Broker Schema (`<SchemaName>`), not the `(default)` schema. Otherwise referencing apps cannot call it.

---

**Next:** [Create and Reference Libraries →](#topic-137)
