---
id: topic-137
slug: what-is-esql-and-where-does-it-run
topicNumber: 137
title: "What is ESQL and Where Does It Run"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Overview of Extended Structured Query Language (ESQL), its runtime lifecycle, and the entry-point Main() function."
object: "ESQL"
action: "Overview"
commandName: "CREATE COMPUTE MODULE"
synonyms:
  - "esql"
  - "what is esql"
  - "main function"
  - "compute module"
  - "esql syntax"
---

ESQL (Extended Structured Query Language) is the native procedural scripting language compiled and executed inside ACE nodes.
Use ESQL inside Compute, Database, and Filter nodes to inspect incoming message trees and construct outgoing payloads.

```esql
CREATE COMPUTE MODULE <ModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        -- Transform logic here
        RETURN TRUE;
    END;
END MODULE;
```

| Construct | Purpose | Typical Value |
| :--- | :--- | :--- |
| **`CREATE COMPUTE MODULE`** | Defines the code boundary linked to a specific Compute node. | Must match node's ESQL Module property. |
| **`Main()`** | Entry point invoked once for every incoming message. | Always returns `BOOLEAN`. |
| **`RETURN TRUE`** | Emits message through `out` terminal. | Use `RETURN FALSE` to prevent default egress. |

```json
{ "id": 1, "name": "Ali", "city": "Cairo" }
```

```esql
CREATE COMPUTE MODULE Demo_Compute
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        SET OutputRoot.Properties = InputRoot.Properties;
        SET OutputRoot.JSON.Data.id = InputRoot.JSON.Data.id;
        SET OutputRoot.JSON.Data.greeting = 'Hello ' || InputRoot.JSON.Data.name;
        RETURN TRUE;
    END;
END MODULE;
```

```json
{ "id": 1, "greeting": "Hello Ali" }
```

* **Case-Insensitive Keywords:** ESQL keywords and identifiers are case-insensitive (`SET` = `set`), but field literals inside quotes are case-sensitive.
* **Return False:** Returning `FALSE` from `Main()` does not cause an error; it simply suppresses propagation to the `out` terminal.
* **Single Thread per Flow Instance:** `Main()` runs on a single thread per message instance, ensuring thread safety for local variables.

* [The Compute Node: Anatomy and Properties](#topic-138)
* [The Message Tree Architecture](#topic-139)
* [Read a JSON Field](#topic-140)
