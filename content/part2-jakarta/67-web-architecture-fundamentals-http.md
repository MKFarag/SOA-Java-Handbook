---
id: topic-67
slug: web-architecture-fundamentals-http
topicNumber: 67
title: 'Web Architecture Fundamentals: The HTTP Protocol'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 17
sectionTitle: Web Architecture & The Jakarta EE Evolution
versionBadge: HTTP/1.1 / HTTP/2 / HTTP/3
difficulty: Beginner
readingTime: 9 min read
shortDescription: >-
  Reference: HTTP request-response wire anatomy, idempotent vs safe methods (GET, POST, PUT, DELETE, PATCH), status code classifications (2xx-5xx), headers, and stateless request handling.
prerequisites:
  - 'Topic 66: The Great Transition: Java EE to Jakarta EE'
---

## Overview
Hypertext Transfer Protocol (HTTP) is the foundational stateless application-layer protocol powering modern web communication over TCP/IP or QUIC. Servlets, RESTful controllers, and web browsers communicate through structured request and response messages composed of start lines, key-value headers, and optional payload bodies.

---

## HTTP Message Wire Protocol Anatomy

```
                  HTTP Request Message
Method Request-URI HTTP-Version (CRLF)
Header-Name: Header-Value (CRLF)
...
Header-Name: Header-Value (CRLF)
(CRLF)
[Optional Message Body (Payload)]

                  HTTP Response Message
HTTP-Version Status-Code Reason-Phrase (CRLF)
Header-Name: Header-Value (CRLF)
...
Header-Name: Header-Value (CRLF)
(CRLF)
[Optional Response Body (Payload)]
```

---

## HTTP Methods: Idempotence & Safety Matrix

| Method | Safe | Idempotent | Request Body | Primary RFC Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Yes | Yes | No | Retrieve representation of a resource without side effects |
| **HEAD** | Yes | Yes | No | Retrieve identical headers as GET without response body |
| **POST** | No | No | Yes | Create subordinate resource or process non-idempotent operations |
| **PUT** | No | Yes | Yes | Complete replacement of target resource with request payload |
| **PATCH** | No | No | Yes | Partial modification / delta update to existing resource |
| **DELETE**| No | Yes | Optional | Remove target resource |
| **OPTIONS**| Yes | Yes | No | Query allowed communication methods and CORS capabilities |

---

## Status Code Classification

| Range | Category | Common Codes & Standard Semantics |
| :--- | :--- | :--- |
| **1xx** | Informational | `101 Switching Protocols` (WebSocket upgrade) |
| **2xx** | Success | `200 OK`, `201 Created` (returns Location header), `204 No Content` (DELETE/PUT success) |
| **3xx** | Redirection | `301 Moved Permanently`, `302 Found` (temporary redirect), `304 Not Modified` (cached etag) |
| **4xx** | Client Error | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable` |
| **5xx** | Server Error | `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, `504 Gateway Timeout` |

---

## Production Implementation: Raw HTTP Header & Body Parsing

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class MinimalHttpServer {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(8080)) {
            System.out.println("[INFO] Listening on port 8080...");
            while (true) {
                try (Socket client = server.accept();
                     BufferedReader reader = new BufferedReader(new InputStreamReader(client.getInputStream()));
                     OutputStream out = client.getOutputStream()) {

                    String requestLine = reader.readLine();
                    if (requestLine == null) continue;
                    System.out.println("[REQUEST] " + requestLine);

                    // Skip headers until empty line (CRLF)
                    String line;
                    while ((line = reader.readLine()) != null && !line.isEmpty()) {
                        // Headers parsed here
                    }

                    // Construct compliant HTTP/1.1 response
                    String body = "{"status":"UP","protocol":"HTTP/1.1"}";
                    byte[] bodyBytes = body.getBytes(StandardCharsets.UTF_8);

                    String response = "HTTP/1.1 200 OK\r\n" +
                            "Content-Type: application/json; charset=UTF-8\r\n" +
                            "Content-Length: " + bodyBytes.length + "\r\n" +
                            "Connection: close\r\n" +
                            "\r\n";

                    out.write(response.getBytes(StandardCharsets.UTF_8));
                    out.write(bodyBytes);
                    out.flush();
                    break; // Demonstration ends after 1 connection
                }
            }
        }
    }
}
```

```
[INFO] Listening on port 8080...
[REQUEST] GET /health HTTP/1.1
```

---

## Common Pitfalls & Edge Cases

- **Confusing Idempotence with Safety:**
  Safety means the method produces no resource state mutations (e.g., `GET`). Idempotence means executing the operation $N$ times yields the exact same server resource state as executing it once (e.g., `PUT`, `DELETE`). `DELETE` is idempotent because subsequent deletions of an already-deleted resource leave the resource nonexistent.
- **Missing Content-Length with Keep-Alive:**
  In HTTP/1.1 persistent connections, failing to provide either a `Content-Length` header or `Transfer-Encoding: chunked` causes the client socket to hang indefinitely waiting for the stream to close.
- **Incorrect Status Code Selection:**
  Returning `200 OK` with an error body payload like `{"error": "user not found"}` violates REST protocol contracts. Clients, caches, and API gateways rely on genuine status codes (`404`, `400`, `500`).

---

## Verification & Practice

**Question:** An API developer updates a user's email address by issuing a `POST` request. Another developer recommends using `PUT` or `PATCH`. Which HTTP method is semantically appropriate for changing only the email field, and why?

**Explanation:** `PATCH` is the RFC-compliant method for partial modifications of a resource. `PUT` requires sending the entire resource representation (replacing all fields). `POST` is non-idempotent and typically reserved for creating new subordinate entities or non-standard actions.
