---
id: topic-69
slug: servlet-lifecycle-and-architecture
topicNumber: 69
title: Servlet Lifecycle & Threading Model
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 19
sectionTitle: Servlet API Architecture & Request Handling
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 9 min read
shortDescription: >-
  Reference: jakarta.servlet.Servlet interface lifecycle phases (init, service,
  destroy), container thread-pooling model, and instance-variable concurrency
  hazards.
prerequisites:
  - 'Topic 51: Threads & Thread Lifecycle'
  - 'Topic 68: Apache Tomcat & The WAR Packaging Structure'
---

## Overview
A Servlet is a server-side Java component managed by a servlet container that receives requests and generates dynamic responses. The container initializes a single servlet instance per definition, invoking its `service()` method concurrently across worker threads from an internal thread pool for each incoming HTTP request.

---

## Servlet Lifecycle State Transitions

```
                     Servlet Lifecycle
┌────────────────────────────────────────────────────────┐
│ 1. Loading & Instantiation: ClassLoader loads .class   │
│    Container calls no-arg constructor via reflection   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. Initialization: Container invokes init(config)      │
│    Executes once before handling any requests          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. Servicing: Container dispatches client requests     │
│    Invokes service(req, res) on worker threads         │
│    (Dispatches to doGet, doPost, doPut, doDelete...)   │
└──────────────────────────┬─────────────────────────────┘
                           │ Container shutdown or undeploy
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. Destruction: Container invokes destroy()            │
│    Releases external resources (pools, sockets, files) │
└────────────────────────────────────────────────────────┘
```

---

## Core Lifecycle Methods Contract

| Method | Invocation Frequency | Thread Execution | Typical Responsibility |
| :--- | :--- | :--- | :--- |
| **`init(ServletConfig config)`** | Exactly **once** upon servlet startup | Single Container Thread | Load configs, connect to database pools, allocate caches |
| **`service(ServletRequest req, ServletResponse res)`** | **Once per request** | Concurrent Worker Threads | Inspect HTTP method, route to `doGet()`, `doPost()`, etc. |
| **`doGet() / doPost()`** | Once per matched HTTP verb | Concurrent Worker Threads | Process request parameters, execute business logic, write response |
| **`destroy()`** | Exactly **once** upon servlet shutdown | Single Container Thread | Close database connections, flush buffers, stop background threads |

---

## Production Implementation: Thread-Safe Servlet Architecture

```java
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicLong;

@WebServlet(urlPatterns = "/api/metrics", loadOnStartup = 1)
public class MetricsServlet extends HttpServlet {

    // Thread-safe state: AtomicLong handles concurrent increments safely across threads
    private final AtomicLong requestCounter = new AtomicLong(0);

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        System.out.println("[LIFECYCLE] MetricsServlet initialized on startup.");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        long currentTotal = requestCounter.incrementAndGet();

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        try (PrintWriter out = resp.getWriter()) {
            out.printf("{\"status\":\"HEALTHY\",\"totalRequests\":%d}%n", currentTotal);
        }
    }

    @Override
    public void destroy() {
        System.out.println("[LIFECYCLE] MetricsServlet destroyed. Final count: " + requestCounter.get());
        super.destroy();
    }
}
```

```
[LIFECYCLE] MetricsServlet initialized on startup.
```

---

## Common Pitfalls & Concurrency Traps

- **Storing Request-Specific State in Instance Variables:**
  The container creates only **one instance** of each servlet. Declaring mutable instance variables (e.g., `private String currentUserName;`) creates race conditions when multiple concurrent requests overwrite the variable. All request state must remain in local method variables.
- **Overriding `service()` in `HttpServlet` Subclasses:**
  Overriding `service()` without calling `super.service(req, resp)` disables automatic HTTP method routing to `doGet()`, `doPost()`, `doPut()`, and `doDelete()`.
- **Forgetting `super.init(config)`:**
  If overriding `init(ServletConfig config)`, failing to call `super.init(config)` leaves the internal `ServletConfig` reference null, causing subsequent calls to `getServletContext()` or `getInitParameter()` to throw `NullPointerException`.

---

## Verification & Practice

**Question:** If 500 concurrent HTTP requests arrive simultaneously at `MetricsServlet`, how many instances of `MetricsServlet` are instantiated by the container, and how many threads execute `doGet()`?

**Explanation:** The container instantiates exactly **one** instance of `MetricsServlet`. Up to 500 threads from the container's HTTP connector thread pool invoke `doGet()` simultaneously on that single instance. This is why non-thread-safe instance fields cause catastrophic concurrency failures in servlets.

---

## Practice

### Q: Why is declaring mutable instance variables inside an `HttpServlet` class considered a dangerous concurrency anti-pattern?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** A servlet container instantiates only a single instance of each `HttpServlet` per mapped URL path during application lifecycle. Incoming HTTP requests are processed concurrently by worker threads from the container thread pool executing the `service()`, `doGet()`, or `doPost()` methods on that same instance. Storing request-specific state in instance fields creates cross-user data races and security vulnerabilities.
</details>
