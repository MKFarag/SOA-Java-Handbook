---
id: topic-242
slug: esql-headers-mqmd-mqrfh2-http
topicNumber: 242
title: "Transport Headers: MQMD, MQRFH2 & HTTP"
part: 'Part 6: ESQL'
sectionNumber: 46
sectionTitle: 'Advanced'
versionBadge: 'ESQL'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Read and modify MQMD correlation IDs/expiry, custom MQRFH2.usr properties, and HTTPInputHeader/HTTPResponseHeader fields in ESQL."
object: "Transport Headers"
action: "Read & Set Headers"
commandName: "MQMD MQRFH2 HTTPInputHeader HTTPResponseHeader"
synonyms:
  - "mqmd esql"
  - "mqrfh2 usr esql"
  - "httpinputheader httpresponseheader esql"
  - "correlid msgid replytoq esql"
  - "double quotes header name esql"
---

# Transport Headers: `MQMD`, `MQRFH2` & `HTTP`

In ACE's logical tree, transport headers sit directly under `InputRoot` / `OutputRoot` **above** the body domain (`JSON`, `XMLNSC`, `DFDL`). Reading and modifying them uses standard ESQL paths — with one crucial rule for hyphenated HTTP header names.

---

## 1. `MQMD` & `MQRFH2.usr` Headers (IBM MQ)

```esql
BROKER SCHEMA <SchemaName>

CREATE COMPUTE MODULE <ComputeModuleName>
    CREATE FUNCTION Main() RETURNS BOOLEAN
    BEGIN
        -- Copy Properties + existing headers BEFORE creating the output body
        CALL CopyMessageHeaders();

        -- 1. Copy MsgId to CorrelId for Request-Reply correlation
        SET OutputRoot.MQMD.CorrelId = InputRoot.MQMD.MsgId;

        -- 2. Set message Expiry (tenths of a second: 600 = 60 seconds)
        SET OutputRoot.MQMD.Expiry = 600;

        -- 3. Add custom MQRFH2 user properties above the body
        CREATE FIELD OutputRoot.MQRFH2.usr;
        SET OutputRoot.MQRFH2.usr.SourceApp = ApplicationLabel;
        SET OutputRoot.MQMD.Format          = 'MQHRF2  ';

        -- 4. Now attach the JSON body at the bottom
        CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');
        SET OutputRoot.JSON.Data.replyTo = COALESCE(InputRoot.MQMD.ReplyToQ, '');

        RETURN TRUE;
    END;
END MODULE;
```

<details data-type="output">
<summary>Expected Output Tree Order</summary>

```text
OutputRoot
 ├─ Properties
 ├─ MQMD        (CorrelId = Input MsgId, Expiry = 600, Format = 'MQHRF2  ')
 ├─ MQRFH2      (usr.SourceApp = ApplicationLabel)
 └─ JSON.Data   (replyTo = ReplyToQ)
```

</details>

### Line-by-Line Breakdown (MQ Headers)

- **`CALL CopyMessageHeaders();`**: Copies `Properties` and any existing `MQMD` from `InputRoot` to `OutputRoot`.
- **`SET OutputRoot.MQMD.CorrelId = InputRoot.MQMD.MsgId;`**: Standard IBM MQ Request-Reply pattern — copies the incoming 24-byte `MsgId` (`BLOB`) into the reply's `CorrelId` so the waiting caller can match the response.
- **`SET OutputRoot.MQMD.Expiry = 600;`**: Tells IBM MQ to expire the message after **60 seconds** (`Expiry` is measured in tenths of a second).
- **`CREATE FIELD OutputRoot.MQRFH2.usr;`**: Initializes the `MQRFH2` folder and its standard `usr` (user properties) subfolder before adding the JSON body so `MQRFH2` stays **above** the body.
- **`SET OutputRoot.MQMD.Format = 'MQHRF2  ';`**: Sets the 8-character MQ format code (`MQHRF2` padded with two trailing spaces) telling MQ that an `MQRFH2` header follows `MQMD`.
- **`CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');`**: Appends the JSON body *after* `MQMD` and `MQRFH2`.

---

## 2. HTTP Request & Reply Headers (`HTTPInputHeader` / `HTTPResponseHeader`)

```esql
-- Read incoming HTTP header and query string (?currency=EGP)
DECLARE authHeader CHARACTER COALESCE(InputRoot.HTTPInputHeader."Authorization", '');
DECLARE currency   CHARACTER COALESCE(InputLocalEnvironment.HTTP.Input.QueryString.currency, 'USD');

-- Set outgoing HTTP headers and status code for HTTPReply
SET OutputRoot.HTTPResponseHeader."Content-Type" = 'application/json';
SET OutputRoot.HTTPResponseHeader."X-Trace-Id"   = UUIDASCHAR;
SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 200;

SET OutputRoot.JSON.Data.hasAuth  = (authHeader <> '');
SET OutputRoot.JSON.Data.currency = currency;
```

<details data-type="output">
<summary>Expected HTTP Output &amp; Response Headers</summary>

```text
HTTP 200 OK
Content-Type: application/json
X-Trace-Id: <generated-uuid>
Body: {"hasAuth": true, "currency": "EGP"}
```

</details>

### Line-by-Line Breakdown (HTTP Headers)

- **`InputRoot.HTTPInputHeader."Authorization"`**: Reads an incoming HTTP header from an `HTTPInput` node. Notice **`"..."` double quotes** around `"Content-Type"`, `"X-Trace-Id"`, and `"Authorization"`. In ESQL, single quotes (`'...'`) mean a text value, while **double quotes (`"..."`) mean a field identifier containing special characters like hyphens (`-`)**!
- **`InputLocalEnvironment.HTTP.Input.QueryString.currency`**: Reads the URL query parameter `?currency=...` (case-sensitive!).
- **`OutputRoot.HTTPResponseHeader."Content-Type"`**: Sets an outgoing HTTP response header read by `HTTPReply` (when replying to an HTTP client; for an outbound `HTTPRequest` node, use `OutputRoot.HTTPRequestHeader."..."` instead).
- **`OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 200;`**: Sets the HTTP status code (remember to enable **`Compute mode = LocalEnvironment And Message`**!).

> [!WARNING]
> **Remember Child Order!** If `InputRoot` already had a body (`CopyEntireMessage()`), running `CREATE FIELD OutputRoot.MQRFH2.usr;` puts `MQRFH2` at the **end** (below the body), causing serialization failure! In that case, use `CREATE PREVIOUSSIBLING OF OutputRoot.JSON NAME 'MQRFH2';` (or `CREATE LASTCHILD` after `CopyMessageHeaders()`).

---

**Next:** [ASBITSTREAM & PARSE: Tree ↔ BLOB & Text →](#topic-243)
