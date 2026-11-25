---
id: topic-159
slug: httpinput-and-httpreply-nodes
topicNumber: 159
title: "HTTPInput & HTTPReply: Expose a REST Endpoint"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 3 min read
shortDescription: "Build an HTTP/REST API endpoint in minutes by pairing HTTPInput at the start with HTTPReply at the end."
object: "HTTP Nodes"
action: "Expose Endpoint"
commandName: "HTTPInput & HTTPReply"
synonyms:
  - "httpinput node"
  - "httpreply node"
  - "rest endpoint ace"
  - "url suffix httpinput"
  - "port 7800"
---
# HTTPInput & HTTPReply: Expose a REST Endpoint

Pair **`HTTPInput`** and **`HTTPReply`** whenever an external app needs to call your ACE flow over `http://` or `https://` and receive an immediate response.

![Palette HTTP drawer showing HTTPInput, HTTPReply, HTTPRequest, and HTTPHeader nodes](/images/ace/palette-http-drawer.png)

---

## Always Use Them as a Pair

```text
  [HTTPInput]  ──▶  [Mapping / Compute]  ──▶  [HTTPReply]
  (GET /POST)         (Build JSON reply)     (Sends HTTP 200)
```

If an HTTP request enters `HTTPInput` and finishes **without hitting an `HTTPReply`**, the caller hangs until the HTTP timeout expires!

---

## Key `HTTPInput` Properties

![HTTPInput Basic properties showing Path suffix for URL](/images/ace/httpinput-node-properties.png)

| Tab | Property | Example Value | Meaning |
| :--- | :--- | :--- | :--- |
| **Basic** | **Path suffix for URL \*** | `/orders/*` or `/v1/hello` | URL path appended after server host & port (default embedded port `7800`) |
| **Input Message Parsing** | **Message domain** | `JSON` or `BLOB` | Parses incoming `POST` body (GET requests typically have empty body — `JSON` handles GET fine too) |
| **Advanced** | **Use HTTPS** | Unchecked (dev) / Checked (prod) | Toggles TLS listener |

---

## Fast Example: Return HTTP 201 JSON in Compute

```esql
SET OutputRoot.HTTPResponseHeader."Content-Type" = 'application/json';
SET OutputLocalEnvironment.Destination.HTTP.ReplyStatusCode = 201;
SET OutputRoot.JSON.Data.message = 'Order created';
```

<details data-type="output">
<summary>curl Response from http://localhost:7800/v1/hello</summary>

```http
HTTP/1.1 201 Created
Content-Type: application/json

{"message":"Order created"}
```

</details>

> [!TIP]
> Wire `HTTPInput.Catch` (or a `TryCatch`) to build a JSON error + `ReplyStatusCode = 500` and send it to a second `HTTPReply` node so callers never get ugly stack traces or timeouts!

---

**Next:** [HTTPRequest Node: Call an External REST API →](#topic-160)
