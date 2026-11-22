---
id: topic-70
slug: request-and-response-processing
topicNumber: 70
title: 'HttpServletRequest & HttpServletResponse Processing'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 18
sectionTitle: Servlet API Architecture & Request Handling
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 9 min read
shortDescription: >-
  Reference: Reading query parameters, headers, cookies, request bodies (getReader vs getInputStream), configuring response headers, status codes, and output streams.
prerequisites:
  - 'Topic 67: Web Architecture Fundamentals: The HTTP Protocol'
  - 'Topic 69: Servlet Lifecycle & Threading Model'
---

## Overview
`HttpServletRequest` and `HttpServletResponse` represent the container-managed abstractions for incoming HTTP requests and outgoing HTTP responses. They provide typed interfaces for extracting parameters, inspection of headers, stream reading of payloads, and formatting HTTP response headers, cookies, status codes, and body output.

---

## Request & Response API Reference

| Method | Return Type | Category | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| **`getParameter(name)`** | `String` | Request | Returns first value of query parameter or POST form field |
| **`getParameterValues(name)`** | `String[]` | Request | Returns all values for multivalued parameters (e.g., checkboxes) |
| **`getHeader(name)`** | `String` | Request | Retrieves value of specified request header (case-insensitive) |
| **`getInputStream()`** | `ServletInputStream` | Request | Reads raw binary request payload (mutually exclusive with `getReader`) |
| **`getReader()`** | `BufferedReader` | Request | Reads character-based request payload (JSON, XML) |
| **`setStatus(sc)`** | `void` | Response | Sets HTTP response status code (e.g., `HttpServletResponse.SC_OK`) |
| **`setHeader(name, value)`**| `void` | Response | Sets response header, overwriting existing value |
| **`setContentType(type)`** | `void` | Response | Sets `Content-Type` header and response character encoding |
| **`getWriter()`** | `PrintWriter` | Response | Opens character output stream (mutually exclusive with `getOutputStream`) |
| **`getOutputStream()`** | `ServletOutputStream`| Response | Opens raw binary output stream (images, files, PDFs) |

---

## Production Implementation: RESTful Order Dispatcher

```java
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/api/orders")
public class OrderProcessingServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Enforce UTF-8 request encoding
        req.setCharacterEncoding("UTF-8");

        // Validate Content-Type
        String contentType = req.getContentType();
        if (contentType == null || !contentType.contains("application/json")) {
            resp.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, "Expected application/json");
            return;
        }

        // Read request payload via getReader()
        StringBuilder jsonBuffer = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuffer.append(line);
            }
        }

        // Configure response headers and status
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.setHeader("Location", req.getContextPath() + "/api/orders/98421");

        try (PrintWriter writer = resp.getWriter()) {
            writer.print("{\"orderId\":98421,\"status\":\"CREATED\"}");
            writer.flush();
        }
    }
}
```

---

## Common Pitfalls & Runtime Traps

- **IllegalStateException: Stream / Writer Conflict:**
  Calling both `getOutputStream()` and `getWriter()` on the same `HttpServletResponse` throws:
  ```
  java.lang.IllegalStateException: getOutputStream() has already been called for this response
  ```
  Choose exactly one output mechanism per request lifecycle.
- **Setting Headers After Writing to Output:**
  HTTP responses transmit headers before the body. If the response buffer is flushed (e.g., calling `writer.flush()`), the response is **committed**. Any subsequent call to `setStatus()`, `setHeader()`, or `sendRedirect()` is ignored or throws `IllegalStateException`.
- **Character Encoding Omission:**
  Writing response text before calling `resp.setContentType("text/html; charset=UTF-8")` defaults to ISO-8859-1 in legacy setups, corrupting non-ASCII characters (Arabic, Japanese, accented characters).

---

## Verification & Practice

**Question:** What happens if a servlet calls `resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid input");` followed immediately by `resp.getWriter().println("Detailed diagnostics");`?

**Explanation:** Once `sendError()` is invoked, the container considers the response committed and begins processing the error page mechanism. Writing further data to the response writer will trigger an `IllegalStateException` because the output stream is closed or cleared by the error dispatcher.
