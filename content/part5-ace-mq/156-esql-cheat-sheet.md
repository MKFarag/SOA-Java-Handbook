---
id: topic-156
slug: esql-cheat-sheet
topicNumber: 156
title: "ESQL Quick Reference & Cheat Sheet"
part: 'Part 5: ACE & MQ'
sectionNumber: 38
sectionTitle: 'ESQL Reference'
versionBadge: ACE 12.0
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Master 1-page summary of essential ESQL syntax, tree navigation patterns, loops, and common error fixes."
object: "Cheat Sheet"
action: "Reference"
commandName: "ESQL Cheat Sheet"
synonyms:
  - "cheat sheet"
  - "quick reference"
  - "esql summary"
  - "syntax patterns"
  - "common esql"
---

A single master reference sheet compiling the most common ESQL syntax patterns, paths, and expressions.
Use this cheat sheet as a rapid lookup guide when authoring or debugging ESQL modules.

| Task | Syntax Template |
| :--- | :--- |
| **Copy Headers** | `SET OutputRoot.Properties = InputRoot.Properties;` |
| **Clone Message** | `SET OutputRoot = InputRoot;` |
| **Read JSON Field** | `SET var = InputRoot.JSON.Data.fieldName;` |
| **Write JSON Field** | `SET OutputRoot.JSON.Data.fieldName = 'value';` |
| **Delete Field** | `SET OutputRoot.JSON.Data.fieldName = NULL;` |
| **Read Array Item** | `SET firstCode = InputRoot.JSON.Data.items.Item[1].code;` |
| **Array Length** | `DECLARE len INTEGER CARDINALITY(InputRoot.JSON.Data.items.Item[]);` |
| **Concatenate Strings**| `SET fullName = firstName || ' ' || lastName;` |
| **Cast Type** | `SET num = CAST('123' AS INTEGER);` |
| **Dynamic Routing** | `SET OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName = 'Q1';` |
| **Raise Exception** | `THROW USER EXCEPTION VALUES('Error message');` |
| **Loop Counter** | `WHILE I <= count DO ... SET I = I + 1; END WHILE;` |

| Mistake | Cause | Instant Fix |
| :--- | :--- | :--- |
| **`InputRoot.JSON.name`** | Omitted `Data` root container | Change to `InputRoot.JSON.Data.name`. |
| **`Item[0]`** | Used 0-based indexing | ESQL is 1-based; change to `Item[1]`. |
| **Double quotes for text** | `SET city = "Cairo";` treats Cairo as field name | Use single quotes: `SET city = 'Cairo';`. |
| **Infinite loop** | Forgot to increment counter in `WHILE` loop | Add `SET I = I + 1;` before `END WHILE`. |
| **LE changes lost** | Compute Mode set to `Message` | Change node's Compute Mode to `All`. |

* [What is ESQL and Where Does It Run](#topic-137)
* [Read a JSON Field](#topic-140)
* [Add Fields to the Output](#topic-141)
