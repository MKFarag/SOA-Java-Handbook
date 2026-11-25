---
id: topic-198
slug: esql-cheat-sheet
topicNumber: 198
title: "ESQL Quick Reference Cheat Sheet"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "One-page W3Schools cheat sheet covering tree creation (CREATE FIELD / LASTCHILD / DELETE FIELD), SELECT, CAST, ASBITSTREAM, loops, headers, and DB access."
object: "ESQL Cheat Sheet"
action: "Quick Lookup"
commandName: "ESQL Cheat Sheet"
synonyms:
  - "esql cheat sheet"
  - "esql quick reference"
  - "esql create field lastchild select"
---

# ESQL Quick Reference Cheat Sheet

Keep this 1-page reference open while writing Compute modules.

---

## Complete Syntax at a Glance

| Need | Exact ESQL Snippet |
| :--- | :--- |
| **Declare variable & type** | `DECLARE x INTEGER 0;` / `DECLARE p DECIMAL 19.50;` |
| **Cast safely (`DEFAULT` fallback)** | `CAST('42' AS INTEGER DEFAULT 0)` |
| **Safe null fallback** | `COALESCE(InputRoot.JSON.Data.x, 'default')` |
| **Create field only if missing** | `CREATE FIELD OutputRoot.XMLNSC.Header;` |
| **Append repeated child element** | `CREATE LASTCHILD OF outRef AS itemRef NAME 'Item';` |
| **Insert at top / next sibling** | `CREATE FIRSTCHILD OF outRef NAME 'Tag' VALUE '1';` / `CREATE NEXTSIBLING OF ref ...` |
| **Delete field / node** | `DELETE FIELD OutputRoot.JSON.Data.temp;` |
| **Move subtree without copying** | `DETACH itemRef; ATTACH itemRef TO targetRef AS LASTCHILD;` |
| **Walk tree cursor (`MOVE`)** | `MOVE ptr FIRSTCHILD;` / `MOVE ptr NEXTSIBLING REPEAT NAME;` |
| **Create JSON array** | `CREATE FIELD OutputRoot.JSON.Data.tags IDENTITY (JSON.Array)tags;` |
| **Query array in-memory (`SELECT`)** | `SELECT ITEM i.sku FROM InputRoot.JSON.Data.items.Item[] AS i WHERE i.qty > 0` |
| **Pick 1 single item (`THE`)** | `THE(SELECT ITEM c.email FROM ... AS c WHERE c.primary = TRUE)` |
| **Tree <-> `BLOB` (`ASBITSTREAM` / `PARSE`)** | `ASBITSTREAM(InputRoot.XMLNSC OPTIONS FolderBitStream ENCODING 546 CCSID 1208)` |
| **Loops + stop/skip** | `FOR item AS ...[] DO ... LEAVE ...; ITERATE ...; END FOR;` |
| **Set MQ / HTTP header** | `SET OutputRoot.MQMD.CorrelId = InputRoot.MQMD.MsgId;` / `."Content-Type"` |
| **Override target queue / HTTP code** | `SET OutputLocalEnvironment.Destination.MQ.DestinationData[1].queueName = '<TargetQueueName>';` |
| **SQL lookup** | `PASSTHRU('SELECT NAME FROM dbo.<TableName> WHERE ID=?' VALUES(id))` |
| **Emit multiple messages** | `PROPAGATE;` *(finish `Main()` with `RETURN FALSE;`)* |
| **Raise / catch error** | `THROW USER EXCEPTION VALUES('Invalid');` / `DECLARE EXIT HANDLER FOR SQLSTATE LIKE '%'` |

---

**Next Section — Integration Node & Server Commands:** [mqsiprofile & the ACE Command Console →](#topic-199)
