---
id: topic-188
slug: esql-asbitstream-and-parse
topicNumber: 188
title: "ASBITSTREAM & PARSE: Convert Tree ↔ BLOB & Text"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Intermediate
readingTime: 3 min read
shortDescription: "Convert a logical message tree into raw BLOB/string bytes using ASBITSTREAM(), or parse XML/JSON strings back into a tree using PARSE()."
object: "Bitstream & Parse"
action: "Serialize & Parse"
commandName: "ASBITSTREAM & CREATE PARSE"
synonyms:
  - "asbitstream esql"
  - "create lastchild parse esql"
  - "parse xml string inside json esql"
  - "message tree to string blob esql"
---

# `ASBITSTREAM` & `PARSE`: Convert Tree ↔ `BLOB` & Text

Sometimes an incoming JSON field actually holds an escaped **XML string** inside it, or you want to save the full raw payload into an audit database column as text/`BLOB`. ACE solves both with **`ASBITSTREAM()`** and **`CREATE ... PARSE()`**.

---

## 1. Tree -> `BLOB` / String (`ASBITSTREAM`)

Serialize any branch (`Root`, `XMLNSC`, `JSON.Data`) into bytes, then cast to UTF-8 text (`CCSID 1208`) if needed:

```esql
DECLARE enc   INTEGER COALESCE(InputRoot.Properties.Encoding, 546);
DECLARE ccsid INTEGER COALESCE(InputRoot.Properties.CodedCharSetId, 1208);

DECLARE rawBlob BLOB ASBITSTREAM(
    InputRoot.XMLNSC
    OPTIONS FolderBitStream
    ENCODING enc
    CCSID ccsid
);

-- Optional: convert to readable UTF-8 CHARACTER string for logging/audit
SET OutputRoot.JSON.Data.rawXmlText = CAST(rawBlob AS CHARACTER CCSID 1208);
```

---

## 2. Raw Bytes / String -> Tree (`CREATE ... DOMAIN ... PARSE`)

Take an incoming string or `BLOB` and parse it directly into a live `XMLNSC` or `JSON` tree you can read fields from:

```esql
DECLARE xmlText CHARACTER InputRoot.JSON.Data.embeddedXml;
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

---

> [!WARNING]
> Always match the `CCSID` when passing a `BLOB` created with `CAST(... AS BLOB CCSID 1208)` into `PARSE(..., 1208)` — mismatched CCSIDs produce garbled characters or parser errors! Also check **`OPTIONS FolderBitStream`** inside `ASBITSTREAM` when serializing a single element/folder rather than `InputRoot` itself.

---

**Next:** [MQMD, MQRFH2 & HTTP Headers in ESQL →](#topic-189)
