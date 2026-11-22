---
id: topic-74
slug: servlet-filters-and-filter-chains
topicNumber: 74
title: Servlet Filters & FilterChain Architecture
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 20
sectionTitle: 'State Management, Filtering & Security'
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 9 min read
shortDescription: >-
  Reference: jakarta.servlet.Filter interface, Intercepting Filter pattern,
  FilterChain pipeline execution, request/response wrapping, and filter ordering
  mechanics.
prerequisites:
  - 'Topic 69: Servlet Lifecycle & Threading Model'
  - 'Topic 70: HttpServletRequest & HttpServletResponse Processing'
---

## Overview
Servlet Filters implement the Intercepting Filter pattern, inspecting, transforming, or blocking HTTP requests and responses before and after they reach target servlets or static resources. Configured in a chain via `FilterChain.doFilter()`, filters encapsulate cross-cutting concerns including authentication, compression, logging, and security headers.

---

## Filter Chain Execution Pipeline

```
Client Request
      │
      ▼
┌───────────────┐
│ Filter 1 (In) │  (e.g., Logging & Correlation ID)
└───────┬───────┘
        ▼
┌───────────────┐
│ Filter 2 (In) │  (e.g., Security & Authentication)
└───────┬───────┘
        ▼
┌───────────────┐
│ TargetServlet │  (Executes business logic: doGet / doPost)
└───────┬───────┘
        ▼
┌───────────────┐
│ Filter 2 (Out)│  (Response headers, timing calculation)
└───────┬───────┘
        ▼
┌───────────────┐
│ Filter 1 (Out)│  (Response logging, compression)
└───────┬───────┘
      │
      ▼
Client Response
```

---

## Filter Interface Contract

| Method | Invocation | Typical Responsibility |
| :--- | :--- | :--- |
| **`init(FilterConfig config)`** | Exactly once during container startup | Initialize resources, read init parameters (default method in Servlet 4.0+) |
| **`doFilter(req, res, chain)`** | On every intercepted request matching pattern | Inspect/modify request, call `chain.doFilter()`, modify response |
| **`destroy()`** | Exactly once during container shutdown | Release native resources, close loggers (default method) |

---

## Production Implementation: Request Timing & Security Headers Filter

```java
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(urlPatterns = "/*")
public class SecurityHeadersFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        long startTime = System.currentTimeMillis();

        // Enforce baseline HTTP security headers
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("Content-Security-Policy", "default-src 'self'");

        try {
            // Pass execution to next filter in the chain or target servlet
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            System.out.printf("[AUDIT] %s %s - %d ms%n", request.getMethod(), request.getRequestURI(), duration);
        }
    }
}
```

---

## Common Pitfalls & Runtime Traps

- **Omitting `chain.doFilter()`:**
  Failing to invoke `chain.doFilter(request, response)` halts request processing entirely. The client receives an empty 200 OK response or hangs without reaching the target servlet. Only omit `chain.doFilter()` when deliberately rejecting unauthorized requests (e.g., returning `401 Unauthorized`).
- **Ordering Ambiguity with `@WebFilter`:**
  The `@WebFilter` annotation does not provide an ordering attribute. When multiple filters intercept the same URL, the container's execution order is non-deterministic. To enforce strict deterministic ordering (e.g., AuthFilter before LoggingFilter), declare the filters in `web.xml` using `<filter-mapping>` tags.
- **Reading the Request Body Multiple Times:**
  Calling `request.getReader()` inside a filter consumes the input stream. Subsequent filters or the target servlet will read an empty stream. To inspect request payloads in filters, wrap the request using `HttpServletRequestWrapper` with a cached byte buffer.

---

## Verification & Practice

**Question:** An engineer wants to log the exact request payload (JSON) in an audit filter before the servlet processes it. Why does reading `request.getReader()` in the filter break the downstream servlet?

**Explanation:** The `ServletInputStream` is a forward-only, one-time readable stream. Once consumed by the filter's `getReader()`, the stream reaches EOF. When the servlet later calls `req.getReader()`, it finds an empty stream. The solution is to extend `HttpServletRequestWrapper`, read the stream into a byte array once, and return a fresh stream on each subsequent `getInputStream()` / `getReader()` call.

---

## Practice

### Q: What happens if a developer forgets to invoke `chain.doFilter(request, response)` inside a custom `HttpFilter`?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Omitting `chain.doFilter(request, response)` halts the execution chain immediately. Downstream filters and the target destination servlet will never be invoked, resulting in an incomplete request lifecycle and a blank HTTP response.
</details>
