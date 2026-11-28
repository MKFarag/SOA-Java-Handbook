---
id: topic-228
slug: esql-arrays-and-cardinality
topicNumber: 228
title: "Arrays, CARDINALITY & JSON.Array"
part: 'Part 6: ESQL'
sectionNumber: 45
sectionTitle: 'Fundamentals'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Work with repeating XML tags and JSON arrays using 1-based indexing ([1], [<]), CARDINALITY(), and IDENTITY (JSON.Array)."
object: "Arrays & Lists"
action: "Read & Build Arrays"
commandName: "CARDINALITY JSON.Array Item[]"
synonyms:
  - "esql arrays"
  - "cardinality esql"
  - "json.array identity esql"
  - "item[1] item[<]"
  - "build json array esql"
---

# Arrays, `CARDINALITY` & `JSON.Array`

ESQL does not use `0`-based brackets like Java. Repeating elements in XML or JSON are addressed with **1-based indexes (`[1]`)**, reverse last-element indexing (**`[<]`**), and a trailing **`[]`** when referring to the entire list.

---

## Essential Array Expressions

| Syntax | Meaning |
| :--- | :--- |
| **`InputRoot.JSON.Data.items.Item[]`** | All elements in the `items` JSON array (used with `CARDINALITY`, `EXISTS`, `FOR`, `SELECT`) |
| **`InputRoot.JSON.Data.items.Item[1]`** | **First** element in the array (`[0]` is illegal!) |
| **`InputRoot.JSON.Data.items.Item[<]`** | **Last** element in the array (`[<2]` is second-to-last) |
| **`CARDINALITY(InputRoot.JSON.Data.items.Item[])`** | Number of elements (`0` if empty or missing) |

---

## Example: Reading an Array & Building Both Scalar and Object JSON Arrays

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        CALL CopyMessageHeaders();
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

        -- 1. Inspect an incoming array
        DECLARE cnt      INTEGER   CARDINALITY(InputRoot.JSON.Data.items.Item[]);
        DECLARE firstSku CHARACTER COALESCE(InputRoot.JSON.Data.items.Item[1].sku, 'NONE');
        DECLARE lastSku  CHARACTER COALESCE(InputRoot.JSON.Data.items.Item[<].sku, 'NONE');

        SET OutputRoot.JSON.Data.count    = cnt;
        SET OutputRoot.JSON.Data.firstSku = firstSku;
        SET OutputRoot.JSON.Data.lastSku  = lastSku;

        -- 2. Create a JSON array of scalar strings using IDENTITY (JSON.Array)
        CREATE FIELD OutputRoot.JSON.Data.tags IDENTITY (JSON.Array)tags;
        SET OutputRoot.JSON.Data.tags.Item[1] = 'urgent';
        SET OutputRoot.JSON.Data.tags.Item[2] = 'vip';

        -- 3. Create a JSON array of objects
        CREATE FIELD OutputRoot.JSON.Data.summary IDENTITY (JSON.Array)summary;
        SET OutputRoot.JSON.Data.summary.Item[1].code = firstSku;
        SET OutputRoot.JSON.Data.summary.Item[1].role = 'first';

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected JSON Output (Input: {"items":[{"sku":"A1"},{"sku":"B2"}]})</summary>

```json
{
  "count": 2,
  "firstSku": "A1",
  "lastSku": "B2",
  "tags": ["urgent", "vip"],
  "summary": [
    { "code": "A1", "role": "first" }
  ]
}
```

</details>

### Line-by-Line Breakdown

- **`CARDINALITY(InputRoot.JSON.Data.items.Item[])`**: Counts how many `Item` elements exist inside the `items` JSON array. Notice how ACE's JSON parser always stores array entries as repeating children named **`Item`** under the array container (`items`).
- **`InputRoot.JSON.Data.items.Item[1].sku` / `.Item[<].sku`**: Reads the `sku` field from the first (`[1]`) and last (`[<]`) array items, wrapped in `COALESCE(..., 'NONE')` in case the array is empty.
- **`CREATE FIELD OutputRoot.JSON.Data.tags IDENTITY (JSON.Array)tags;`**: Creates the `tags` field and tags its node type as **`JSON.Array`**. This **`IDENTITY (JSON.Array)<name>`** clause tells ACE's JSON serializer to emit JSON brackets **`["urgent", "vip"]`**.
- **`SET OutputRoot.JSON.Data.tags.Item[1] = 'urgent';`**: Populates array slot `1`. Inside a `JSON.Array` parent, every child **must** be named **`Item`** (any other name is ignored or breaks array formatting).
- **`SET OutputRoot.JSON.Data.summary.Item[1].code = firstSku;`**: When `Item[1]` has child properties (`.code`, `.role`), ACE serializes it as a JSON object inside the array (`[{ "code": "A1", "role": "first" }]`).

> [!WARNING]
> **Never skip `IDENTITY (JSON.Array)`!** If you write `SET OutputRoot.JSON.Data.tags.Item[1] = 'urgent';` without `CREATE FIELD ... IDENTITY (JSON.Array)tags;`, ACE treats `tags` as a normal JSON object and outputs `{"tags": {"Item": "urgent"}}` instead of `{"tags": ["urgent"]}`! Also remember: never call `CARDINALITY(...)` inside a loop condition over a large list — iterate with **`FOR`** or **`REFERENCE` + `MOVE`** instead.

---

**Next:** [Control Flow: IF, CASE & Loops (WHILE, FOR, LOOP, REPEAT) →](#topic-229)
