---
id: topic-245
slug: esql-cheat-sheet
topicNumber: 245
title: "Quick Reference Cheat Sheet"
part: 'Part 6: ESQL'
sectionNumber: 46
sectionTitle: 'Advanced'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "One-page ESQL cheat sheet organized by Read, Build, Control, Errors & Best Practices — covering navigation, tree mutation, SELECT, dates, PASSTHRU, PROPAGATE, and handlers."
object: "Cheat Sheet"
action: "Quick Lookup"
commandName: "Cheat Sheet"
synonyms:
  - "esql cheat sheet"
  - "esql quick reference"
  - "esql syntax summary"
---

# Quick Reference Cheat Sheet

Keep this one-page reference open while writing **Compute**, **Filter**, and **Database** modules in ACE 12 / 13.

---

## 1. Read (Navigate Trees & Safe Defaults)

| Need | Exact ESQL Snippet |
| :--- | :--- |
| **Root trees in Compute vs Filter/DB** | `InputRoot` / `OutputRoot` (`Compute`) · `Root` (`Filter` / `Database`) |
| **First / Last element (1-based!)** | `InputRoot.XMLNSC.Order.Item[1]` / `InputRoot.XMLNSC.Order.Item[<]` |
| **Count / Presence check** | `CARDINALITY(InputRoot.XMLNSC.Order.Item[])` / `EXISTS(InputRoot.JSON.Data.email[])` |
| **XML Attribute / Root Tag / Namespace** | `Order.(XMLNSC.Attribute)id` · `FIELDNAME(InputBody.*[1])` · `DECLARE ns NAMESPACE '<NamespaceUri>';` |
| **Safe `NULL` fallback / blank check** | `COALESCE(field, 'default')` · `COALESCE(field, '') = ''` · `field IS NOT NULL` |
| **Declare variables & modifiers** | `DECLARE amt DECIMAL 10.50;` · `CONSTANT` · `EXTERNAL` · `SHARED ROW` (write in `BEGIN ATOMIC`) |
| **Fast tree cursor (`REFERENCE` + `MOVE`)** | `DECLARE r REFERENCE TO ...Item[1]; WHILE LASTMOVE(r) DO ... MOVE r NEXTSIBLING REPEAT TYPE NAME; END WHILE;` |

---

## 2. Build (Construct Domains, Arrays, Strings, Casts & Dates)

| Need | Exact ESQL Snippet |
| :--- | :--- |
| **Copy headers vs full message** | `CALL CopyMessageHeaders();` / `CALL CopyEntireMessage();` |
| **Create body domain** | `CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');` (or `'XMLNSC'`) |
| **Create JSON array** | `CREATE FIELD OutputRoot.JSON.Data.tags IDENTITY (JSON.Array)tags;` |
| **Create / Append / Prepend / Delete** | `CREATE FIELD` · `CREATE LASTCHILD OF p AS r NAME 'Item';` · `CREATE FIRSTCHILD` · `DELETE FIELD` |
| **Move subtree without copying** | `DETACH ref; ATTACH ref TO targetRef AS LASTCHILD;` |
| **In-memory `SELECT`, `ITEM`, `THE`** | `THE(SELECT ITEM C.name FROM InputRoot.JSON.Data.customers.Item[] AS C WHERE C.id = '1001')` |
| **String slicing & masking** | `SUBSTRING('ORD-2026' FROM 5 FOR 4)` · `UPPER(TRIM(' egp '))` · `LEFT(c,6) \|\| REPLICATE('*', n-10) \|\| RIGHT(c,4)` |
| **Safe type cast & rounding** | `CAST(val AS INTEGER DEFAULT 0)` · `ROUND(amt, 2)` · `CAST(blobVar AS CHARACTER CCSID 1208)` |
| **Parse & format dates (`''T''`)** | `CAST(d AS CHARACTER FORMAT 'yyyy-MM-dd')` · `CAST(CURRENT_TIMESTAMP AS CHARACTER FORMAT 'yyyy-MM-dd''T''HH:mm:ss')` |
| **Tree <-> `BLOB` (`ASBITSTREAM`/`PARSE`)** | `ASBITSTREAM(InputRoot.XMLNSC OPTIONS FolderBitStream ENCODING 546 CCSID 1208)` |

---

## 3. Control, Errors & Best Practices

| Need | Exact ESQL Snippet |
| :--- | :--- |
| **`IF` / `CASE` / `FOR` / `LOOP`** | `IF ... ELSEIF ... ELSE END IF;` · `FOR x AS ...[] DO ... END FOR;` · `L1: LOOP ... LEAVE L1; END LOOP L1;` |
| **`Environment` vs `LocalEnvironment`** | `Environment.Variables.x` (flow-wide) · `OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 404;` *(set Compute mode!)* |
| **Split / route multiple outputs** | `PROPAGATE TO TERMINAL 'out1';` *(end `Main()` with `RETURN FALSE;`!)* · `DELETE NONE` keeps `OutputRoot` |
| **Set MQ / HTTP headers** | `SET OutputRoot.MQMD.CorrelId = InputRoot.MQMD.MsgId;` · `OutputRoot.HTTPResponseHeader."Content-Type"` |
| **Database lookup (`PASSTHRU`)** | `SET Environment.Variables.cust[] = PASSTHRU('SELECT NAME FROM <TableName> WHERE CUST_ID = ?', id);` |
| **Raise error (`THROW`)** | `THROW USER EXCEPTION MESSAGE 2951 VALUES('email is required');` |
| **Inline error handler** | `DECLARE CONTINUE HANDLER FOR SQLSTATE LIKE '%' BEGIN SET err = SQLSTATE; END;` *(top of `BEGIN`!)* |
| **Walk `InputExceptionList` (Catch)** | `DECLARE e REFERENCE TO InputExceptionList.*[1]; WHILE LASTMOVE(e) DO ... MOVE e LASTCHILD; END WHILE;` |
| **Reuse functions across flows** | Put `CREATE FUNCTION` / `CREATE PROCEDURE` in Shared Library schema + import with `PATH <SharedSchemaName>;` |

---

**Next Section — Tasks:** [Task 1: Convert an XML Order to JSON →](#topic-246)
