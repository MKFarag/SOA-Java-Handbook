---
id: topic-189
slug: esql-headers-mqmd-mqrfh2-http
topicNumber: 189
title: "MQMD, MQRFH2 & HTTP Headers in ESQL"
part: 'Part 5: ACE & MQ'
sectionNumber: 41
sectionTitle: 'ESQL Reference'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Read and modify MQMD correlation IDs, MQRFH2 custom properties, and HTTP request/response headers in ESQL."
object: "Protocol Headers"
action: "Read & Set Headers"
commandName: "MQMD MQRFH2 HTTPHeader"
synonyms:
  - "mqmd esql"
  - "mqrfh2 usr esql"
  - "httpinputheader httpresponseheader esql"
  - "set correlation id correlid mqmd"
---

# `MQMD`, `MQRFH2` & `HTTP` Headers in ESQL

In ACE, transport headers sit directly under `InputRoot` / `OutputRoot` **above** the body domain (`JSON` / `XMLNSC`). You read and set them with standard `SET` paths.

---

## 1. Reading & Setting `MQMD` Header Fields

```esql
CALL CopyMessageHeaders();

-- Copy MsgId into CorrelId when replying to a request
SET OutputRoot.MQMD.CorrelId = InputRoot.MQMD.MsgId;

-- Set message expiry (in tenths of a second: 600 = 60 seconds)
SET OutputRoot.MQMD.Expiry   = 600;

-- Read ReplyToQ from incoming message
DECLARE replyQueue CHARACTER COALESCE(InputRoot.MQMD.ReplyToQ, '');
```

---

## 2. Custom Metadata in `MQRFH2.usr` (MQ User Properties)

`MQRFH2.usr` carries custom key-value tags alongside an MQ message without touching the payload body:

```esql
CALL CopyMessageHeaders();
CREATE FIELD OutputRoot.MQRFH2.usr;
SET OutputRoot.MQRFH2.usr.SourceSystem = ApplicationLabel;
SET OutputRoot.MQMD.Format             = 'MQHRF2  ';
```

*(Putting headers **above** body means putting `MQRFH2` before setting `OutputRoot.JSON` or `OutputRoot.XMLNSC` — or using `CREATE PREVIOUSSIBLING` if building before an existing body!)*

---

## 3. HTTP Request & Reply Headers (`HTTPInputHeader` / `HTTPResponseHeader`)

```esql
-- Read incoming HTTP header & query parameter (?currency=USD)
DECLARE authToken CHARACTER InputRoot.HTTPInputHeader."Authorization";
DECLARE currency  CHARACTER InputLocalEnvironment.HTTP.Input.QueryString.currency;

-- Set custom response header & status code on HTTPReply
SET OutputRoot.HTTPResponseHeader."Content-Type" = 'application/json';
SET OutputRoot.HTTPResponseHeader."X-Trace-Id"   = 'tr-101';
SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 201;
```

> [!TIP]
> Notice HTTP header names containing hyphens (like `"Content-Type"` or `"X-Trace-Id"`) MUST be wrapped in **double quotes** (`"Content-Type"`) in ESQL — single quotes mean text literal, double quotes mean special identifier/field name!

---

**Next:** [Procedures & Functions in ESQL →](#topic-190)
