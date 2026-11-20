---
id: topic-67
slug: request-and-response-processing
topicNumber: 67
title: Request and Response Processing in Servlets
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 19
sectionTitle: Servlets Deep Dive
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master parameter parsing, request and response headers, status codes,
  character encoding, and input/output payload streams in Jakarta Servlets.
prerequisites:
  - 'Topic 64: Web Architecture Fundamentals (HTTP Protocol)'
  - 'Topic 66: Servlet Lifecycle & Architecture'
relevanceLevel: MUST-KNOW / CORE
---
# Request and Response Processing in Servlets

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

### 1. What It Is and Why It Exists
Every dynamic web interaction consists of a **Request** arriving from an HTTP client (browser, mobile app, API caller) and a **Response** returned by the server. In the Jakarta Servlet specification, the container abstracts these wire protocols into two primary object contracts:
1. **`jakarta.servlet.http.HttpServletRequest`**: An object encapsulating everything sent by the client—HTTP method, URL path, query string parameters, form payloads, headers, cookies, and binary/character input streams.
2. **`jakarta.servlet.http.HttpServletResponse`**: An object through which the developer configures outgoing HTTP headers, character encoding, HTTP status codes, and writes the response payload (HTML, JSON, XML, or binary files).

Without these high-level abstractions, developers would be forced to manually open raw TCP sockets, parse line-by-line ASCII byte streams, decode percent-encoded URLs, and manually construct byte buffers conforming to RFC 9110.

**Real-World Analogy:**
Imagine arriving at a border customs checkpoint. The customs officer hands you a standardized incoming declaration form (**`HttpServletRequest`**) that records your name, passport country, destination, and baggage contents. After reviewing your documents, the officer issues a formal entry permit stamped with an approval code, validity dates, and official seals (**`HttpServletResponse`**). You cannot alter the officer's stamp once issued, just as a servlet cannot rewrite response headers after sending bytes to the client.

---

### 2. Prerequisites
- **Web Architecture Fundamentals (Topic 64)**: Understanding HTTP methods (GET, POST), headers, status codes, and query strings.
- **Servlet Lifecycle & Architecture (Topic 66)**: Understanding how the container dispatches requests across worker threads to `doGet()` and `doPost()`.
- **Classic I/O Streams (Topic 45)**: Understanding character streams (`Reader`, `Writer`) vs byte streams (`InputStream`, `OutputStream`).

---

### 3. Syntax Breakdown

#### 3.1 Extracting Parameters and Headers
```java
// Extracting query string or application/x-www-form-urlencoded form values:
String user = request.getParameter("username");

// Extracting multi-value form inputs (e.g., checkboxes, multi-select):
String[] interests = request.getParameterValues("interest");

// Extracting request headers:
String authHeader = request.getHeader("Authorization");
String userAgent  = request.getHeader("User-Agent");
```

#### 3.2 Reading Payloads via Streams
```java
// For character-based payloads (JSON, XML):
BufferedReader reader = request.getReader();

// For binary payloads (file uploads, image bytes):
ServletInputStream in = request.getInputStream();
```
> [!IMPORTANT]
> A servlet may call either `getReader()` OR `getInputStream()`, but **never both** during the same request. Attempting to call both throws `java.lang.IllegalStateException`.

#### 3.3 Configuring and Writing Responses
```java
// 1. Set character encoding and content type BEFORE acquiring the writer
response.setCharacterEncoding("UTF-8");
response.setContentType("application/json");

// 2. Set status codes (e.g., 200 OK, 201 Created, 400 Bad Request)
response.setStatus(HttpServletResponse.SC_CREATED);

// 3. Set custom or protocol headers
response.setHeader("Location", "/api/orders/9821");

// 4. Write payload
try (PrintWriter out = response.getWriter()) {
    out.println("{\"status\":\"success\"}");
}
```

---

### 4. Runnable Code Examples

#### Example 1: Comprehensive Request Inspector (Basic)
This servlet reads query parameters, multiple select values, and client headers, outputting structured JSON metadata.

```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

@WebServlet(name = "RequestInspectorServlet", urlPatterns = {"/inspect"})
public class RequestInspectorServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        // 1. Configure outgoing response headers and content type
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("X-Handled-By", "Jakarta-Servlet-6.0");
        resp.setStatus(HttpServletResponse.SC_OK);

        // 2. Read query parameters
        String clientName = req.getParameter("client");
        if (clientName == null || clientName.isBlank()) {
            clientName = "Anonymous";
        }
        String[] tags = req.getParameterValues("tag");

        // 3. Inspect request metadata
        String method = req.getMethod();
        String requestUri = req.getRequestURI();
        String protocol = req.getProtocol();
        String userAgent = req.getHeader("User-Agent");

        // 4. Generate JSON output
        try (PrintWriter out = resp.getWriter()) {
            out.println("{");
            out.printf("  \"method\": \"%s\",%n", method);
            out.printf("  \"uri\": \"%s\",%n", requestUri);
            out.printf("  \"protocol\": \"%s\",%n", protocol);
            out.printf("  \"client\": \"%s\",%n", clientName);
            out.printf("  \"tags\": %s,%n", tags != null ? Arrays.toString(tags) : "[]");
            out.printf("  \"userAgent\": \"%s\"%n", userAgent != null ? userAgent : "Unknown");
            out.println("}");
        }
    }
}
```

**Expected HTTP Response Output (`GET /inspect?client=Alice&tag=java&tag=jakarta`):**
```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
X-Handled-By: Jakarta-Servlet-6.0

{
  "method": "GET",
  "uri": "/inspect",
  "protocol": "HTTP/1.1",
  "client": "Alice",
  "tags": [java, jakarta],
  "userAgent": "Mozilla/5.0"
}
```

---

#### Example 2: RESTful Order Creation Servlet with JSON Stream (Realistic)
This servlet handles POST requests containing a raw JSON payload, validates the input, writes HTTP 201 Created with a Location header, and handles client error cases.

```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;

@WebServlet(name = "OrderProcessingServlet", urlPatterns = {"/api/orders"})
public class OrderProcessingServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        // 1. Validate request content type
        String contentType = req.getContentType();
        if (contentType == null || !contentType.contains("application/json")) {
            resp.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, "Expected application/json");
            return;
        }

        // 2. Read request body stream via getReader()
        StringBuilder jsonBody = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line.trim());
            }
        }

        if (jsonBody.isEmpty()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Payload cannot be empty");
            return;
        }

        // 3. Process business logic (Simulate order creation)
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // 4. Configure 201 Created response with Location header
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("Location", req.getContextPath() + "/api/orders/" + orderId);

        try (PrintWriter out = resp.getWriter()) {
            out.printf("{\"orderId\":\"%s\",\"status\":\"CONFIRMED\",\"receivedLength\":%d}%n", 
                orderId, jsonBody.length());
        }
    }
}
```

**Expected HTTP Response Output (`POST /api/orders` with body `{"item":"Laptop","qty":1}`):**
```http
HTTP/1.1 201 Created
Content-Type: application/json;charset=UTF-8
Location: /handbook/api/orders/ORD-A3F1B842

{"orderId":"ORD-A3F1B842","status":"CONFIRMED","receivedLength":26}
```

---

### 5. Step-by-Step Execution Trace
1. **TCP Connection & Parsing**: Apache Tomcat receives the TCP packet on port 8080 and parses the raw HTTP request line and headers.
2. **Object Instantiation**: Tomcat creates an implementation of `HttpServletRequest` (e.g., `org.apache.catalina.connector.RequestFacade`) and `HttpServletResponse` (`ResponseFacade`).
3. **Dispatch**: Tomcat delegates execution to `OrderProcessingServlet.service()`, which examines `req.getMethod()` ("POST") and dispatches to `doPost()`.
4. **Header Validation**: `req.getContentType()` is checked. If it is not `application/json`, `resp.sendError(415)` immediately formats an error response and halts processing.
5. **Stream Consumption**: `req.getReader()` buffers the incoming character stream until end-of-file.
6. **Response Stamping**: `resp.setStatus(201)` and `resp.setHeader("Location", ...)` mutate the HTTP header buffer.
7. **Buffer Flushing & TCP Close**: The `PrintWriter` writes bytes to Tomcat's internal socket buffer. Once closed or full, the response commits and streams over the network.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Setting headers or content type AFTER writing to the response
```java
// WRONG:
PrintWriter out = resp.getWriter();
out.println("<h1>Hello</h1>");
resp.setContentType("text/html"); // SILENTLY IGNORED OR ILLEGAL!
```
*Why it fails*: Once bytes are written and the internal response buffer is committed to the network socket, HTTP headers cannot be altered.
*The Fix*: Always configure `setStatus()`, `setContentType()`, and `setHeader()` **before** calling `getWriter()` or writing bytes.

#### Mistake 2: Mixing `getWriter()` and `getOutputStream()`
```java
// WRONG:
PrintWriter writer = resp.getWriter();
ServletOutputStream stream = resp.getOutputStream(); // Throws IllegalStateException!
```
*Why it fails*: The Servlet specification strictly requires choosing character streams OR binary streams per request.
*The Fix*: Use `getWriter()` for text/HTML/JSON, or `getOutputStream()` for files/images.

---

### 7. Best Practices
- **Explicit Character Encoding**: Always specify UTF-8: `resp.setContentType("text/html;charset=UTF-8")`.
- **Use `sendError()` for Client Failures**: Use `resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Item not found")` rather than manually writing HTML error text.
- **Defensive Parameter Parsing**: Always check for `null` when retrieving parameters with `req.getParameter()`.

#### When NOT to Use Raw Servlet Request/Response
Do not manually parse complex multipart binary files or nested JSON hierarchies by string concatenation in production. Use Jakarta Bean Validation, Jackson/JSON-P, or Jakarta RESTful Web Services (JAX-RS) which build on top of Servlets.

---

### 8. Version Notes
- **Servlet 1.0**: Introduced basic request and response interfaces.
- **Servlet 3.0**: Introduced asynchronous request processing (`request.startAsync()`).
- **Servlet 6.0 (Jakarta EE 10)**: Deprecated legacy session tracking and removed outdated methods (`getId()`, `isRequestedSessionIdFromUrl()`).

---

### 9. Summary Cheat Sheet

| Operation | Method Call | Return Type | Description |
| :--- | :--- | :--- | :--- |
| **Get Query/Form Param** | `req.getParameter("key")` | `String` | First value associated with parameter |
| **Get Multi-value Params** | `req.getParameterValues("key")` | `String[]` | All values associated with parameter |
| **Get Request Header** | `req.getHeader("Header-Name")` | `String` | Raw header value as string |
| **Read JSON Body** | `req.getReader()` | `BufferedReader` | Character stream of incoming request payload |
| **Read Binary Body** | `req.getInputStream()` | `ServletInputStream` | Byte stream of incoming request payload |
| **Set Status Code** | `resp.setStatus(int sc)` | `void` | Sets standard HTTP status code |
| **Set Header** | `resp.setHeader("Key", "Val")` | `void` | Overwrites outgoing header |
| **Trigger Error** | `resp.sendError(int sc, String msg)` | `void` | Halts request and renders container error page |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (Writer Conflict)
Explain why the following code throws a runtime exception and fix it:
```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.getOutputStream().write("OK".getBytes());
    resp.getWriter().println("Done");
}
```
<details>
<summary>View Solution</summary>

```java
// Root Cause: Calling both resp.getOutputStream() and resp.getWriter() throws IllegalStateException.
// Fix: Use one stream type exclusively:
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    resp.setContentType("text/plain;charset=UTF-8");
    try (PrintWriter out = resp.getWriter()) {
        out.println("OK");
        out.println("Done");
    }
}
```
</details>

#### Exercise 2: Hands-on Implementation (Safe Integer Parameter Reader)
Write a helper method `getIntParameter(HttpServletRequest req, String name, int defaultValue)` that safely parses an integer parameter without throwing `NumberFormatException`.

<details>
<summary>View Solution</summary>

```java
public static int getIntParameter(HttpServletRequest req, String name, int defaultValue) {
    String val = req.getParameter(name);
    if (val == null || val.isBlank()) {
        return defaultValue;
    }
    try {
        return Integer.parseInt(val.trim());
    } catch (NumberFormatException e) {
        return defaultValue;
    }
}
```
</details>

#### Exercise 3: Real-World Architecture (Response Buffer Commitment)
What does `resp.isCommitted()` indicate, and what happens if you call `resp.sendRedirect("/home")` after the response has already committed?

<details>
<summary>View Solution</summary>

```java
// Explanation:
// resp.isCommitted() returns true if the HTTP response status code and headers have already been sent to the network client.
// If you attempt to call resp.sendRedirect() or resp.setHeader() after commitment, Tomcat throws:
// java.lang.IllegalStateException: Cannot call sendRedirect() after the response has been committed.
```
</details>

---

### 11. Official Sources
- [Jakarta Servlet Specification 6.0: Request & Response](https://jakarta.ee/specifications/servlet/6.0/) — Jakarta EE
- [Apache Tomcat 10.1 Documentation: HttpServletRequest API](https://tomcat.apache.org/tomcat-10.1-doc/servletapi/jakarta/servlet/http/HttpServletRequest.html) — Apache Tomcat
