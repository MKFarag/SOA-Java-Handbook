---
id: topic-66
slug: servlet-lifecycle-and-architecture
topicNumber: 66
title: Servlet Lifecycle & Architecture
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 19
sectionTitle: Servlets Deep Dive
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 11 min read
shortDescription: >-
  Deep dive into how Jakarta Servlets work: the container lifecycle (init,
  service, destroy), multithreaded request dispatching, and thread-safety
  fundamentals.
prerequisites:
  - 'Topic 63: The Great Transition: Java EE to Jakarta EE'
  - 'Topic 64: Web Architecture Fundamentals (HTTP Protocol)'
  - 'Topic 65: Apache Tomcat & The WAR Structure'
relevanceLevel: MUST-KNOW / CORE
---
> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

A **Servlet** is a server-side Java component managed by a web container (such as Apache Tomcat) that receives HTTP client requests, executes business logic, and dynamically generates HTTP responses.

### The Real-World Analogy
Imagine a busy restaurant kitchen:
- The **web container (Tomcat)** is the restaurant general manager.
- The **Servlet** is a specialized head chef.
- When the restaurant opens in the morning, the manager hires and prepares the chef once (**`init()`**).
- During the lunch rush when 300 customers place orders simultaneously, the manager does not hire 300 chefs. Instead, 300 fast waiters (worker threads) bring order slips to that single head chef (**`service()`** $\rightarrow$ **`doGet()`** / **`doPost()`**).
- When the restaurant closes at night, the manager dismisses the chef to clean down the kitchen (**`destroy()`**).

### Why Does This Model Exist?
Static web servers (like pure Nginx or Apache HTTPD) can only send static files (HTML, images, CSS) from a disk drive to a browser. Modern software requires dynamic responses: querying databases, authenticating user passwords, calculating invoices, and generating personalized JSON or HTML. Servlets provide the robust, high-performance Java standard for writing server-side web logic.

---

## 2. Prerequisites
- **Topic 63: The Great Transition: Java EE to Jakarta EE** (Understanding `javax.*` vs `jakarta.*` packages)
- **Topic 64: Web Architecture Fundamentals** (HTTP methods GET, POST, status codes)
- **Topic 65: Apache Tomcat & The WAR Structure** (`WEB-INF`, `classes`, `lib`)

---

## 3. Syntax Breakdown & Container Architecture

Every method and annotation in a modern Jakarta `HttpServlet` connects directly to the container lifecycle and HTTP protocol mappings.

```java
@WebServlet(name = "LifecycleServlet", urlPatterns = {"/lifecycle"})
public class LifecycleServlet extends HttpServlet {
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("text/html;charset=UTF-8");
    }

    @Override
    public void destroy() {
        super.destroy();
    }
}
```

### Breakdown of Keywords, Annotations, and Tokens
- `@WebServlet`: Jakarta EE annotation that registers the servlet with the web container and binds it to URL patterns without requiring XML configuration.
- `extends HttpServlet`: Inherits HTTP protocol handling capabilities from `jakarta.servlet.http.HttpServlet` (which extends `GenericServlet` and implements `jakarta.servlet.Servlet`).
- `init(ServletConfig config)`: Lifecycle initialization hook invoked exactly once by the container when the servlet instance is first created.
- `super.init(config)`: Crucial call that preserves the `ServletConfig` reference inside the parent `GenericServlet`.
- `doGet(...)`: Specialized request handler called by the default `service()` implementation whenever an HTTP GET request arrives.
- `HttpServletRequest`: Object containing incoming HTTP request data: URL parameters, headers, cookies, session, and input streams.
- `HttpServletResponse`: Object used to configure outgoing HTTP response data: status codes, content-type, headers, and output writers.
- `destroy()`: Lifecycle termination hook invoked exactly once when the servlet is taken out of service before container shutdown.

---

## 4. Fully Runnable Code Examples

### Example 1: Servlet Lifecycle & Thread Observation Demo
Demonstrates `init()`, `doGet()`, and `destroy()` with thread tracking and an atomic request counter proving single-instance multithreading on Tomcat.

```java
// LifecycleServlet.java
package com.handbook.web;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicInteger;

@WebServlet(name = "LifecycleServlet", urlPatterns = {"/lifecycle"})
public class LifecycleServlet extends HttpServlet {
    private final AtomicInteger requestCounter = new AtomicInteger(0);

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        System.out.println("[Servlet Lifecycle] init() executed once: Servlet instance initialized in container.");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        int currentCount = requestCounter.incrementAndGet();
        response.setContentType("text/html;charset=UTF-8");
        
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html><html><head><title>Servlet Lifecycle</title></head><body>");
            out.println("<h1>Jakarta Servlet 6.0 Lifecycle Demo</h1>");
            out.println("<p>HTTP Method: GET</p>");
            out.println("<p>Total Requests Handled by Single Instance: <strong>" + currentCount + "</strong></p>");
            out.println("<p>Thread handling request: " + Thread.currentThread().getName() + "</p>");
            out.println("</body></html>");
        }
    }

    @Override
    public void destroy() {
        System.out.println("[Servlet Lifecycle] destroy() executed: Cleaning up resources before shutdown.");
        super.destroy();
    }
}
```

#### Expected HTTP Response
```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html><html><head><title>Servlet Lifecycle</title></head><body>
<h1>Jakarta Servlet 6.0 Lifecycle Demo</h1>
<p>HTTP Method: GET</p>
<p>Total Requests Handled by Single Instance: <strong>1</strong></p>
<p>Thread handling request: http-nio-8080-exec-1</p>
</body></html>
```

#### Step-by-Step Execution
1. On the first request to `/lifecycle`, Tomcat discovers that no instance exists in memory.
2. Tomcat instantiates `LifecycleServlet` via reflection and calls `init(ServletConfig)`.
3. Tomcat pulls a worker thread (e.g. `http-nio-8080-exec-1`) from its executor thread pool.
4. The thread invokes `service()`, which inspects the HTTP method (`"GET"`) and dispatches to `doGet()`.
5. The atomic counter increments safely across threads, and HTML bytes stream to the client response.
6. On container stop (`catalina.bat stop`), Tomcat calls `destroy()` to release persistent resources.

---

### Example 2: Production User Registry Servlet with Dual GET/POST Handling
A realistic servlet handling form submissions via POST and user data retrieval via GET, with status codes and character encoding.

```java
// UserRegistryServlet.java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.ConcurrentHashMap;

@WebServlet(name = "UserRegistryServlet", urlPatterns = {"/users"})
public class UserRegistryServlet extends HttpServlet {
    // Thread-safe in-memory store simulating repository
    private final ConcurrentHashMap<String, String> userStore = new ConcurrentHashMap<>();

    @Override
    public void init() {
        userStore.put("admin", "System Administrator");
        userStore.put("sarah", "Lead Architect");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.println("<h2>Registered Users</h2><ul>");
            userStore.forEach((username, role) -> {
                out.printf("<li><strong>%s</strong>: %s</li>%n", username, role);
            });
            out.println("</ul>");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        String username = req.getParameter("username");
        String role = req.getParameter("role");

        if (username == null || username.isBlank() || role == null || role.isBlank()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Both username and role are mandatory fields.");
            return;
        }

        userStore.put(username.trim(), role.trim());
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().printf("User '%s' registered successfully as '%s'.", username, role);
    }
}
```

#### Expected HTTP Request & Response
```http
POST /users HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

username=david&role=SecuritySpecialist

--- Response ---
HTTP/1.1 201 Created
Content-Type: text/plain;charset=UTF-8

User 'david' registered successfully as 'SecuritySpecialist'.
```

#### Step-by-Step Execution
1. The browser sends an HTTP POST request containing URL-encoded form parameters.
2. Tomcat parses the payload and exposes parameters via `req.getParameter("username")`.
3. Validation checks guard against empty strings, returning HTTP 400 Bad Request if invalid.
4. The `ConcurrentHashMap` stores the new user entry safely across concurrent threads.
5. The servlet responds with HTTP 201 Created status and confirmation body.

---

## 5. Common Mistakes & Compiler / Runtime Errors

### Mistake 1: Non-Thread-Safe Instance Variables (Race Conditions)
```java
// WRONG:
public class BadServlet extends HttpServlet {
    private int userCount = 0; // BUG: Not thread-safe!
    protected void doGet(...) {
        userCount++; // RACE CONDITION across concurrent users!
    }
}

// FIXED:
public class SafeServlet extends HttpServlet {
    private final AtomicInteger userCount = new AtomicInteger(0);
    protected void doGet(...) {
        userCount.incrementAndGet(); // Thread-safe
    }
}
```
- **Cause:** Web containers maintain only **ONE** instance of each servlet. Every incoming request runs in a separate thread on that same instance!
- **Fix:** Never store mutable per-request data in servlet instance variables. Use method-local variables, request attributes, or thread-safe atomic data structures.

### Mistake 2: Modifying Response After Commitment
```
java.lang.IllegalStateException: Cannot call sendRedirect() after the response has been committed
```
- **Cause:** Once headers and initial buffer bytes are sent (committed) to the TCP network socket, you cannot change headers or trigger redirects.
- **Fix:** Perform all redirects and header configurations before writing or flushing any response body bytes, and always return immediately.

### Mistake 3: Legacy `javax.*` Import on Modern Tomcat 10.1+
```
java.lang.ClassNotFoundException: javax.servlet.http.HttpServlet
```
- **Cause:** Tomcat 10 and 11 strictly implement Jakarta EE specifications and exclusively provide the `jakarta.*` namespace.
- **Fix:** Update all imports from `javax.servlet.*` to `jakarta.servlet.*`.

---

## 6. Best Practices & Anti-Patterns

### Best Practices (DO):
- **Stateless Servlets:** Always design servlets to be completely stateless regarding per-request data.
- **Use Annotations:** Use the `@WebServlet` annotation instead of bulky XML mappings for standard routes.
- **Set Content-Type First:** Always call `resp.setContentType(...)` before obtaining `resp.getWriter()` or `resp.getOutputStream()`.
- **Resource Management:** Employ try-with-resources or container resource closing to prevent response buffer memory leaks.

### Anti-Patterns (DON'T):
- **Never store user-specific state in servlet fields;** store them in `HttpSession` or request attributes.
- **Never call both `resp.getWriter()` and `resp.getOutputStream()` in the same request** (`IllegalStateException`).
- **Do not swallow `ServletException` or `IOException` silently;** let Tomcat handle error routing.

### When NOT to Use:
- Do not use raw Servlets to render large complex HTML interfaces; combine Servlets with JSP / MVC templating or RESTful endpoints to keep business logic separate from HTML markup.

---

## 7. Version Notes & Compatibility Matrix

- **Java Servlet 1.0 (1997):** First standard for Java web servers.
- **Java Servlet 4.0 (Java EE 8):** Supported on Apache Tomcat 9 using `javax.servlet`.
- **Jakarta Servlet 5.0 (Jakarta EE 9):** Namespace transition from `javax.*` to `jakarta.*`. Supported on Tomcat 10.0 (now EOL).
- **Jakarta Servlet 6.0 (Jakarta EE 10):** Current enterprise standard, supported on **Apache Tomcat 10.1.x** (requires Java 11+).
- **Jakarta Servlet 6.1 (Jakarta EE 11):** Released June 2025, supported on **Apache Tomcat 11.0.x** (requires Java 17+).

| Server Version | Minimum Java Version | Servlet Spec | Namespace |
| :--- | :--- | :--- | :--- |
| **Tomcat 9.0** | Java 8 | Servlet 4.0 | `javax.servlet` |
| **Tomcat 10.1** | Java 11 | Servlet 6.0 | `jakarta.servlet` |
| **Tomcat 11.0** | Java 17 | Servlet 6.1 | `jakarta.servlet` |

---

## 8. Summary Cheat Sheet

| Method | Invoked By | Frequency | Thread Context |
| :--- | :--- | :--- | :--- |
| **`init(ServletConfig)`** | Web Container | Exactly once when instantiated | Single thread during initialization |
| **`service(req, resp)`** | Web Container | Once per incoming client request | Dedicated worker thread from pool |
| **`doGet(req, resp)`** | Default `service()` | On every HTTP GET request | Dedicated worker thread from pool |
| **`doPost(req, resp)`** | Default `service()` | On every HTTP POST request | Dedicated worker thread from pool |
| **`doPut / doDelete`** | Default `service()` | On respective HTTP verbs | Dedicated worker thread from pool |
| **`destroy()`** | Web Container | Exactly once before decommissioning | Single thread during shutdown |

---

## 9. Graded Interactive Practice Exercises

### Exercise 1: Spot the Concurrency Flaw
**Prompt:** Identify the critical multithreading flaw in this servlet:
```java
public class CounterServlet extends HttpServlet {
    private int hits = 0;

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        hits++;
        resp.getWriter().println("Hits: " + hits);
    }
}
```

#### Hidden Solution & Explanation
```java
public class CounterServlet extends HttpServlet {
    // Fix: Use AtomicInteger or synchronized block
    private final AtomicInteger hits = new AtomicInteger(0);

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int currentHits = hits.incrementAndGet();
        resp.getWriter().println("Hits: " + currentHits);
    }
}
```
> **Explanation:** Because Tomcat uses a single servlet instance for all requests across concurrent threads, the non-atomic operation `hits++` causes read-update-write race conditions under concurrent load.

---

### Exercise 2: Hands-on Implementation Challenge
**Prompt:** Write a `doGet` method that reads the `"User-Agent"` header from the request and writes it back formatted in an HTML block.

#### Starter Code
```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
        throws ServletException, IOException {
    // Read header and write output
}
```

#### Hidden Solution & Explanation
```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
        throws ServletException, IOException {
    String userAgent = req.getHeader("User-Agent");
    resp.setContentType("text/html;charset=UTF-8");
    try (PrintWriter out = resp.getWriter()) {
        out.println("<p>Your Browser Agent: <code>" + 
            (userAgent != null ? userAgent : "Unknown") + "</code></p>");
    }
}
```
> **Explanation:** `req.getHeader()` retrieves raw HTTP request header values. Always handle `null` in case client tools omit the requested header.

---

### Exercise 3: Real-World Edge Case: Dual Stream Access Conflict
**Prompt:** What happens if a servlet method calls both `resp.getWriter()` and `resp.getOutputStream()` during the same request lifecycle?

#### Hidden Solution & Explanation
> **Result:** Throws `java.lang.IllegalStateException: getOutputStream() has already been called for this response` (or vice-versa).  
> **Fix:** Always use exclusively either `getWriter()` for character text OR `getOutputStream()` for binary data.  
> **Explanation:** The Servlet specification explicitly forbids mixing character and binary response streams on the same `HttpServletResponse`.

---

## 10. Verified Official Sources
- [Jakarta Servlet Specification 6.0](https://jakarta.ee/specifications/servlet/6.0/)
- [Apache Tomcat 10.1 Documentation: Servlet API](https://tomcat.apache.org/tomcat-10.1-doc/servletapi/index.html)
- [Eclipse Foundation: Transition to Jakarta EE Namespace](https://eclipse-ee4j.github.io/jakartaee-platform/)
