---
id: topic-183
slug: esql-arrays-and-cardinality
topicNumber: 183
title: "Arrays & CARDINALITY (Process Lists)"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Count elements with CARDINALITY(), access 1st and last items ([1] / [<]), and build JSON arrays."
object: "Arrays & Lists"
action: "Count & Index"
commandName: "CARDINALITY JSON.Array"
synonyms:
  - "cardinality esql"
  - "esql json array"
  - "last element [<]"
  - "json.array identity"
---

# Arrays & CARDINALITY (Process Lists)

In ESQL, lists of repeating elements end with **`[]`** when counting or looping, and **`[1]`** (1-based!) when picking one element.

---

## Essential Array Syntax

```esql
-- Count how many items exist (0 if missing)
DECLARE itemCount INTEGER CARDINALITY(InputRoot.JSON.Data.items.Item[]);

-- Read first and last elements
DECLARE firstSku CHARACTER InputRoot.JSON.Data.items.Item[1].sku;
DECLARE lastSku  CHARACTER InputRoot.JSON.Data.items.Item[<].sku;
```

---

## Building a Real JSON Array Output (`JSON.Array`)

In ACE, JSON arrays are stored under a parent marked with **`JSON.Array`**, and each element is named **`Item`**:

```esql
CREATE FIELD OutputRoot.JSON.Data.tags IDENTITY (JSON.Array)tags;
SET OutputRoot.JSON.Data.tags.Item[1] = 'urgent';
SET OutputRoot.JSON.Data.tags.Item[2] = 'vip';
```

<details data-type="output">
<summary>Expected JSON Output</summary>

```json
{
  "tags": ["urgent", "vip"]
}
```

</details>

> [!WARNING]
> If you omit `IDENTITY (JSON.Array)tags` and write only `SET OutputRoot.JSON.Data.tags.Item[1] = 'urgent'`, ACE serializes `{"tags": {"Item": "urgent"}}` instead of `["urgent"]`!

---

**Next:** [XMLNSC vs JSON Paths & Arrays in ESQL →](#topic-184)
