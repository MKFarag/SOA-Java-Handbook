---
id: topic-71
slug: servlet-filters-and-filter-chains
topicNumber: 71
title: Servlet Filters & Filter Chains
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 20
sectionTitle: 'State Management, Filters & Security'
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master cross-cutting request interception: chain filters for logging,
  authentication guards, character encoding enforcement, and request/response
  wrapping.
prerequisites:
  - 'Topic 66: Servlet Lifecycle & Architecture'
  - 'Topic 67: Request and Response Processing in Servlets'
relevanceLevel: MUST-KNOW / CORE
---
# Servlet Filters and Filter Chains

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

### 1. What It Is and Why It Exists
In any enterprise web application, many tasks are **cross-cutting concerns**: they do not belong to one specific business servlet, but must run for every incoming request or a subset of paths. Examples include:
- Auditing and performance logging (measuring response time).
- Authentication and authorization checks (verifying logged-in status).
- Character encoding enforcement (forcing UTF-8).
- Response data compression (GZIP).
- CORS headers management.

Instead of duplicating this boilerplate code across every servlet, the Jakarta Servlet platform provides **Filters (`jakarta.servlet.Filter`)**. A filter is an interceptor positioned between the network client and the target servlet. Multiple filters can be combined into a sequential pipeline called a **Filter Chain (`FilterChain`)**.

**Real-World Analogy:**
Imagine passing through airport security to board a flight. Your ticket is the HTTP request and the airplane seat is the target Servlet. Before boarding, you must pass through multiple checkpoints in order:
1. ID / Ticket verification checkpoint (**Auth Filter**).
2. Carry-on luggage X-ray scanner (**Security / Sanitization Filter**).
3. Boarding gate barcode scanner (**Logging / Audit Filter**).
If any checkpoint detects a violation (e.g. invalid passport), you are stopped immediately and never reach the plane.

---

### 2. Prerequisites
- **Servlet Lifecycle & Architecture (Topic 66)**: Understanding container lifecycle and web application packaging.
- **Request and Response Processing (Topic 67)**: Working with request inspection and response status codes.

---

### 3. Syntax Breakdown

#### 3.1 The Filter Interface Contract
```java
package jakarta.servlet;

public interface Filter {
    default void init(FilterConfig filterConfig) throws ServletException {}

    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException;

    default void destroy() {}
}
```
- **`init(FilterConfig)`**: Executed once during container startup when the filter is instantiated.
- **`doFilter(...)`**: Executed on every matched incoming HTTP request. Must explicitly call `chain.doFilter(request, response)` to pass control to the next filter or target servlet.
- **`destroy()`**: Executed once during container shutdown for releasing resources.

#### 3.2 Anatomy of `doFilter()`: Intercepting Before and After
```java
@WebFilter(filterName = "TimingFilter", urlPatterns = {"/*"})
public class TimingFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)
            throws IOException, ServletException {
        
        // 1. PRE-PROCESSING: Runs before the servlet is called
        long start = System.currentTimeMillis();

        try {
            // 2. PASS TO NEXT COMPONENT: Next filter or target servlet
            chain.doFilter(req, resp);
        } finally {
            // 3. POST-PROCESSING: Runs after servlet finishes writing response
            long duration = System.currentTimeMillis() - start;
            System.out.println("Execution took: " + duration + " ms");
        }
    }
}
```

---

### 4. Runnable Code Examples

#### Example 1: Global Request Performance and Audit Logger (Basic)
Measures execution time of every HTTP transaction and logs HTTP method, target URI, response status code, and latency in milliseconds.

```java
package com.handbook.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "RequestLoggingFilter", urlPatterns = {"/*"})
public class RequestLoggingFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("[RequestLoggingFilter] Initialized globally for: /*");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        long startTime = System.currentTimeMillis();
        String uri = req.getRequestURI();
        String method = req.getMethod();

        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = resp.getStatus();
            System.out.printf("[Audit Filter] %s %s -> HTTP %d (%d ms)%n", 
                method, uri, status, duration);
        }
    }

    @Override
    public void destroy() {
        System.out.println("[RequestLoggingFilter] Destroyed.");
    }
}
```

**Expected Container Log Output (`GET /inspect`):**
```
[Audit Filter] GET /handbook/inspect -> HTTP 200 (4 ms)
```

---

#### Example 2: Authentication and Authorization Guard Filter (Realistic)
Intercepts requests to `/admin/*` and `/protected/*`, verifies whether an active session contains an authenticated user, and halts unauthenticated requests with HTTP 401 Unauthorized.

```java
package com.handbook.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter(filterName = "AuthGuardFilter", urlPatterns = {"/admin/*", "/protected/*"})
public class AuthGuardFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        HttpSession session = req.getSession(false); // Do not create if absent
        boolean isAuthenticated = session != null && session.getAttribute("authenticatedUser") != null;

        if (!isAuthenticated) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("401 Unauthorized: Access to protected resource requires login.");
            return; // HALT: chain.doFilter is NOT called!
        }

        chain.doFilter(request, response);
    }
}
```

**Expected HTTP Response Output (Unauthenticated `GET /admin/dashboard`):**
```http
HTTP/1.1 401 Unauthorized
Content-Type: text/plain;charset=UTF-8

401 Unauthorized: Access to protected resource requires login.
```

---

### 5. Step-by-Step Execution Trace
1. **Request Ingress**: Client issues `GET /admin/reports`.
2. **Filter Chain Construction**: Tomcat matches registered filters against `/admin/reports`:
   - `RequestLoggingFilter` matches `/*` (Position 1).
   - `AuthGuardFilter` matches `/admin/*` (Position 2).
3. **Execution of Filter 1**: `RequestLoggingFilter.doFilter()` captures `startTime`, then calls `chain.doFilter()`.
4. **Execution of Filter 2**: `AuthGuardFilter.doFilter()` inspects `req.getSession(false)`:
   - If user is missing, it sets HTTP `401 Unauthorized`, writes error text, and **returns immediately**.
5. **Short-Circuit**: Because `AuthGuardFilter` did not call `chain.doFilter()`, the downstream servlet is **never invoked**.
6. **Post-Processing (Unwinding)**: Control unwinds back to `RequestLoggingFilter`'s `finally` block, which computes elapsed time and logs the 401 status.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Forgetting to call `chain.doFilter()`
```java
// DANGEROUS:
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) {
    System.out.println("Request intercepted!");
    // Missing chain.doFilter(req, resp);
}
```
*Why it fails*: If `chain.doFilter()` is omitted, the request pipeline permanently halts; the client receives a blank response and the target servlet never runs.
*The Fix*: Ensure `chain.doFilter()` is invoked unless you deliberately intend to block the request (e.g. unauthorized).

#### Mistake 2: Assuming Filter execution order with `@WebFilter`
*Why it fails*: The Servlet specification does **not** define an ordering rule for annotations. If you have 5 filters with `@WebFilter`, their execution order across different containers is non-deterministic.
*The Fix*: When strict filter sequence is required (e.g. Logging -> Security -> Compression), declare the `<filter-mapping>` elements in `web.xml`, where order of declaration dictates exact execution order.

---

### 7. Best Practices
- **Cast to HTTP Types Safely**: Filter interface methods receive generic `ServletRequest` and `ServletResponse`; cast to `HttpServletRequest` and `HttpServletResponse` when handling HTTP-specific APIs.
- **Wrap Requests/Responses for Modification**: To modify incoming parameters or buffer outgoing response output, use `HttpServletRequestWrapper` or `HttpServletResponseWrapper`.
- **Always Use `try / finally` for Metrics**: When measuring latency or acquiring thread-local resources, always wrap `chain.doFilter()` in `try ... finally` to guarantee cleanup even if the servlet throws an exception.

---

### 8. Version Notes
- **Servlet 2.3**: Introduced the Filter API.
- **Servlet 3.0**: Introduced `@WebFilter` and asynchronous dispatch filtering (`asyncSupported = true`).
- **Servlet 6.0**: Refined interface defaults for `init()` and `destroy()`.

---

### 9. Summary Cheat Sheet: Filter Lifecycle & Components

| Component | Class / Interface | Responsibility |
| :--- | :--- | :--- |
| **`Filter`** | `jakarta.servlet.Filter` | Core interceptor contract implemented by developers |
| **`FilterChain`** | `jakarta.servlet.FilterChain` | Container-managed pipeline object invoking the next filter or servlet |
| **`FilterConfig`** | `jakarta.servlet.FilterConfig` | Supplies filter name and initialization parameters |
| **`@WebFilter`** | Annotation | Registers a filter and binds it to URL patterns or servlet names |
| **`<filter-mapping>`** | XML Tag in `web.xml` | **Authoritative declaration that guarantees sequential execution order** |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (Double Invocation)
What bug exists in this filter implementation?
```java
public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) 
        throws IOException, ServletException {
    if (isValid(req)) {
        chain.doFilter(req, resp);
    }
    chain.doFilter(req, resp);
}
```
<details>
<summary>View Solution</summary>

```java
// Cause: If isValid(req) is true, chain.doFilter() is called TWICE during the same request.
// This causes downstream servlets to execute twice, throwing IllegalStateException on commit.
// Fix: Add return; or an else branch:
if (isValid(req)) {
    chain.doFilter(req, resp);
} else {
    ((HttpServletResponse) resp).sendError(400, "Invalid Request");
}
```
</details>

#### Exercise 2: Hands-on Implementation (UTF-8 Encoding Filter)
Write an annotated filter that automatically sets the request character encoding to UTF-8 on all incoming requests before downstream processing.

<details>
<summary>View Solution</summary>

```java
package com.handbook.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter(filterName = "CharacterEncodingFilter", urlPatterns = {"/*"})
public class CharacterEncodingFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        chain.doFilter(request, response);
    }
}
```
</details>

#### Exercise 3: Real-World Architecture (Request Wrapping)
When should a developer create a subclass of `HttpServletRequestWrapper` inside a Filter?

<details>
<summary>View Solution</summary>

```
Use HttpServletRequestWrapper when you need to:
1. Modify incoming request parameters (e.g. trim whitespace, decrypt tokens, sanitize inputs).
2. Override request headers (e.g. inject an Authorization header or correlation ID).
3. Cache the request body stream so it can be read multiple times by different downstream consumers.
```
</details>

---

### 11. Official Sources
- [Jakarta Servlet Specification 6.0: Chapter 6 Filtering](https://jakarta.ee/specifications/servlet/6.0/) — Jakarta EE
- [Apache Tomcat 10.1 Documentation: Filter Architecture](https://tomcat.apache.org/tomcat-10.1-doc/appdev/deployment.html) — Apache Tomcat
