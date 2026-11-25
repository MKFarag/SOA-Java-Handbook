---
id: topic-160
slug: httprequest-node
topicNumber: 160
title: "HTTPRequest Node: Call an External REST API"
part: 'Part 5: ACE & MQ'
sectionNumber: 39
sectionTitle: 'App Connect Nodes'
versionBadge: 'ACE 12.0'
difficulty: Beginner
readingTime: 2 min read
shortDescription: "Make outbound GET/POST/PUT REST API calls mid-flow with HTTPRequest and handle API error status codes."
object: "HTTPRequest Node"
action: "Call External API"
commandName: "HTTPRequest"
synonyms:
  - "httprequest node ace"
  - "call rest api ace"
  - "error terminal 4xx 5xx"
  - "override web service url"
---
# HTTPRequest Node: Call an External REST API

**`HTTPRequest`** pauses your flow mid-flight, sends an outbound `GET`, `POST`, `PUT`, or `DELETE` request to an external API, and puts the API's response into `InputRoot` (for downstream nodes).

---

## Essential Properties

| Tab | Property | Example | Purpose |
| :--- | :--- | :--- | :--- |
| **Basic** | **Web service URL \*** | `https://api.example.com/rates` | Default endpoint URL |
| **HTTP Settings** | **HTTP method** | `GET` / `POST` | Defaults to `POST` if you forget to switch it for a `GET`! |
| **Response Message Parsing** | **Message domain** | `JSON` | Tells ACE how to parse the API's response body |
| **Request** | **Request timeout (sec)** | `30` (default `120`) | How long ACE waits before failing |

---

## Watch the `Error` Terminal (4xx / 5xx)!

- **`Out` terminal:** API returned HTTP `2xx` (e.g., `200 OK`, `201 Created`).
- **`Error` terminal:** API returned HTTP `4xx` or `5xx` (e.g., `404 Not Found`, `503 Service Unavailable`).
- **`Failure` terminal:** Network error (DNS fail, connection refused, TLS certificate error).

---

## Dynamic URL Override in ESQL

Set the target URL dynamically per request (needs `Compute mode = LocalEnvironment And Message` before `HTTPRequest`):

```esql
SET OutputLocalEnvironment.Destination.HTTP.RequestURL = 'https://api.example.com/orders/' || orderId;
SET OutputLocalEnvironment.Destination.HTTP.RequestLine.Method = 'GET';
```

> [!TIP]
> **Careful with `HTTPRequest` overwriting your message:** By default, `HTTPRequest` replaces your flow's payload with the API response. If you still need your *original* order data afterward, save needed fields in **`Environment.Variables`** first, or configure **Result -> Result data location**!

---

**Next:** [FileInput Node: Pick Up Files Automatically →](#topic-161)
