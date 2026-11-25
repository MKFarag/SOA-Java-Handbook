---
id: topic-193
slug: esql-cheat-sheet
topicNumber: 193
title: "ESQL Quick Reference Cheat Sheet"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "One-page W3Schools cheat sheet for ESQL trees, functions, loops, nulls, and JSON/XML syntax."
object: "ESQL Cheat Sheet"
action: "Quick Lookup"
commandName: "ESQL Cheat Sheet"
synonyms:
  - "esql cheat sheet"
  - "esql quick reference"
  - "esql summary table"
---

# ESQL Quick Reference Cheat Sheet

Keep this 1-page reference open while writing Compute modules.

---

## Essential Syntax at a Glance

| Need | Exact ESQL Snippet |
| :--- | :--- |
| **Declare variable** | `DECLARE x INTEGER 0;` |
| **Safe null fallback** | `COALESCE(InputRoot.JSON.Data.x, 'default')` |
| **Read JSON field** | `InputRoot.JSON.Data.customer.id` |
| **Write JSON field** | `SET OutputRoot.JSON.Data.status = 'OK';` |
| **Create JSON array** | `CREATE FIELD OutputRoot.JSON.Data.tags IDENTITY (JSON.Array)tags;` |
| **Read XML tag & attribute** | `InputRoot.XMLNSC.Order.Id` / `...(XMLNSC.Attribute)id` |
| **Join strings** | `'A' || '-' || 'B'` |
| **Format timestamp** | `CAST(CURRENT_GMTTIMESTAMP AS CHARACTER FORMAT 'IU')` |
| **Loop cleanly** | `FOR item AS InputRoot.JSON.Data.items.Item[] DO ... END FOR;` |
| **Count elements** | `CARDINALITY(InputRoot.JSON.Data.items.Item[])` |
| **Override MQ target queue** | `SET OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName = 'Q2';` |
| **Set HTTP reply code** | `SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 201;` |
| **SQL lookup** | `PASSTHRU('SELECT NAME FROM CUST WHERE ID=?' VALUES(id))` |
| **Emit multiple messages** | `PROPAGATE;` *(finish `Main()` with `RETURN FALSE;`)* |
| **Raise custom error** | `THROW USER EXCEPTION VALUES('E400', 'Invalid');` |

---

**Next Section — Integration Node & Server Commands:** [mqsiprofile & the ACE Command Console →](#topic-194)
