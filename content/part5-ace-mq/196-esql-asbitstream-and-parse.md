---
id: topic-196
slug: esql-asbitstream-and-parse
topicNumber: 196
title: "ESQL ASBITSTREAM & PARSE: Tree ↔ BLOB & Text"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Fundamentals & Reference'
versionBadge: 'ACE 12 / 13'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Serialize a logical message tree into raw BLOB/string bytes with ASBITSTREAM(), and parse embedded XML or JSON strings back into a tree using PARSE()."
object: "Bitstream & Parse"
action: "Serialize & Parse"
commandName: "ASBITSTREAM PARSE FolderBitStream"
synonyms:
  - "asbitstream esql"
  - "create lastchild parse esql"
  - "parse embedded xml json string esql"
  - "folderbitstream ccsid 1208 esql"
  - "tree to blob string esql"
---

# ESQL `ASBITSTREAM` & `PARSE`: Tree ↔ `BLOB` & Text

Sometimes you need to serialize a logical tree into raw bytes or text (for audit logging or signing), or take an escaped **XML/JSON string embedded inside another field** and parse it back into a navigable ESQL tree. ACE provides **`ASBITSTREAM()`** and **`CREATE ... PARSE()`** for both directions.

---

## 1. Tree → `BLOB` / String (`ASBITSTREAM`)

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        DECLARE enc   INTEGER COALESCE(InputRoot.Properties.Encoding, 546);
        DECLARE ccsid INTEGER COALESCE(InputRoot.Properties.CodedCharSetId, 1208);

        DECLARE rawBlob BLOB ASBITSTREAM(
            InputRoot.XMLNSC
            OPTIONS FolderBitStream
            ENCODING enc
            CCSID ccsid
        );

        -- Convert UTF-8 BLOB into readable CHARACTER text
        SET OutputRoot.JSON.Data.rawXmlText = CAST(rawBlob AS CHARACTER CCSID ccsid);
        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output (Input XML: &lt;Order&gt;&lt;Id&gt;ORD-501&lt;/Id&gt;&lt;/Order&gt;)</summary>

```json
{
  "rawXmlText": "<Order><Id>ORD-501</Id></Order>"
}
```

</details>

### Line-by-Line Breakdown (`ASBITSTREAM`)

- **`COALESCE(InputRoot.Properties.Encoding, 546)`**: Reads the numeric encoding from `Properties`, defaulting to **`546`** (standard little-endian Intel x86 encoding used on Windows/Linux).
- **`COALESCE(InputRoot.Properties.CodedCharSetId, 1208)`**: Reads the character set ID, defaulting to **`1208`** (UTF-8).
- **`ASBITSTREAM(InputRoot.XMLNSC OPTIONS FolderBitStream ENCODING enc CCSID ccsid)`**:
  - Serializes the **`InputRoot.XMLNSC`** subtree back into raw `BLOB` bytes using the XMLNSC parser.
  - **`OPTIONS FolderBitStream`**: Essential when passing a domain folder or child element (like `InputRoot.XMLNSC` or `InputRoot.XMLNSC.Order`) rather than the entire `InputRoot`. (For `RootBitStream`, omit `FolderBitStream` or pass `RootBitStream` when serializing a full domain root.)
- **`CAST(rawBlob AS CHARACTER CCSID ccsid)`**: Decodes the serialized `BLOB` bytes into a readable ESQL `CHARACTER` string using the exact same `CCSID` (`1208`).

---

## 2. Raw Text / `BLOB` → Tree (`CREATE ... DOMAIN ... PARSE`)

Suppose an incoming JSON field `embeddedXml` contains `'<Order><Id>ORD-501</Id></Order>'`. Parse it into a temporary `XMLNSC` tree in `Environment` and read `<Id>`:

```esql
DECLARE xmlText CHARACTER COALESCE(InputRoot.JSON.Data.embeddedXml, '');
DECLARE xmlBlob BLOB      CAST(xmlText AS BLOB CCSID 1208);

CREATE LASTCHILD OF Environment.Temp DOMAIN('XMLNSC')
    PARSE(xmlBlob, 546, 1208);

SET OutputRoot.JSON.Data.parsedOrderId = Environment.Temp.XMLNSC.Order.Id;
```

<details data-type="output">
<summary>Expected Output</summary>

```json
{
  "parsedOrderId": "ORD-501"
}
```

</details>

### Line-by-Line Breakdown (`PARSE`)

- **`CAST(xmlText AS BLOB CCSID 1208)`**: Converts the embedded XML string into UTF-8 `BLOB` bytes (`PARSE()` expects a `BLOB` as its first argument).
- **`CREATE LASTCHILD OF Environment.Temp DOMAIN('XMLNSC') PARSE(xmlBlob, 546, 1208);`**:
  - Creates a temporary `XMLNSC` parser root inside `Environment.Temp` (remember `InputRoot` is read-only, so parse into `Environment` or `OutputRoot`!).
  - **`PARSE(xmlBlob, 546, 1208)`**: Parses `xmlBlob` using encoding **`546`** (x86 little-endian) and **`1208`** (UTF-8), matching the `CCSID 1208` used in `CAST` above! (Change `'XMLNSC'` to `'JSON'` if parsing an embedded JSON string.)
- **`Environment.Temp.XMLNSC.Order.Id`**: Navigates the newly parsed XML tree normally and copies `'ORD-501'` into `OutputRoot.JSON.Data.parsedOrderId`.

> [!WARNING]
> **Always match `CCSID` in `CAST` and `PARSE`!** Passing a `BLOB` created with `CCSID 1208` into `PARSE(..., 819)` (ISO-8859-1) corrupts non-ASCII characters or triggers parser errors. Also delete temporary trees (`DELETE FIELD Environment.Temp;`) afterward if the payload is huge!

---

**Next Section — ESQL Solved Tasks & Practice:** [Task 1: Convert an XML Order to JSON →](#topic-197)
