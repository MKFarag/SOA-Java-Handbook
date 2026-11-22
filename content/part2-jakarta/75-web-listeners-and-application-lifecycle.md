---
id: topic-75
slug: web-listeners-and-application-lifecycle
topicNumber: 75
title: 'Web Listeners & Application Lifecycle Events'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 19
sectionTitle: State Management, Filtering & Security
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: Observer pattern implementation in servlet containers, ServletContextListener, HttpSessionListener, ServletRequestListener, and lifecycle event orchestration.
prerequisites:
  - 'Topic 69: Servlet Lifecycle & Threading Model'
  - 'Topic 73: State Management: Sessions & Secure Cookies'
---

## Overview
Web Listeners implement the Observer pattern to receive container notifications when key lifecycle events occur across an application's lifecycle. Listeners monitor the creation, destruction, and attribute modifications of the `ServletContext` (application scope), `HttpSession` (session scope), and `ServletRequest` (request scope).

---

## Listener Classification Hierarchy

| Interface | Scope Monitored | Triggering Event | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **`ServletContextListener`** | Application | Container startup & shutdown | Initialize connection pools, load global caches |
| **`ServletContextAttributeListener`** | Application | `setAttribute()`, `removeAttribute()` | Audit global configuration changes |
| **`HttpSessionListener`** | User Session | Session created & destroyed/timed out | Track active concurrent user sessions |
| **`HttpSessionAttributeListener`** | User Session | Session attribute added, replaced, removed| Track login events, replicate state |
| **`ServletRequestListener`** | Single Request | Request enters & leaves container | Attach correlation IDs, track request latency |
| **`ServletRequestAttributeListener`**| Single Request | Request attribute modifications | Request pipeline debugging |

---

## Production Implementation: Application Lifecycle & Active Session Monitor

```java
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import java.util.concurrent.atomic.AtomicInteger;

@WebListener
public class AppMonitoringListener implements ServletContextListener, HttpSessionListener {

    private final AtomicInteger activeSessions = new AtomicInteger(0);

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        sce.getServletContext().log("[INIT] Application context initialized. Pre-warming connection pools...");
        sce.getServletContext().setAttribute("activeSessionCounter", activeSessions);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        sce.getServletContext().log("[SHUTDOWN] Application context shutting down. Flushing pools...");
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        int current = activeSessions.incrementAndGet();
        System.out.printf("[SESSION CREATED] ID: %s | Active Users: %d%n", se.getSession().getId(), current);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        int current = activeSessions.decrementAndGet();
        System.out.printf("[SESSION EXPIRED] ID: %s | Active Users: %d%n", se.getSession().getId(), current);
    }
}
```

---

## Common Pitfalls & Lifecycle Traps

- **Throwing Exceptions in `contextInitialized`:**
  If `ServletContextListener.contextInitialized()` throws an unhandled runtime exception, the container immediately aborts the deployment and marks the web application as failed. Ensure external resource failures are handled or explicitly logged.
- **Accessing Session Attributes During `sessionDestroyed`:**
  Inside `sessionDestroyed()`, the session is being invalidated. Attempting to call `session.setAttribute()` throws `IllegalStateException`. You may only read existing attributes for logging purposes.
- **Memory Leaks via ThreadLocals in `ServletRequestListener`:**
  Attaching objects to `ThreadLocal` variables in `requestInitialized()` without calling `ThreadLocal.remove()` in `requestDestroyed()` leaks memory because container worker threads are pooled and reused across requests.

---

## Verification & Practice

**Question:** Which web listener is the appropriate place to initialize a shared HikariCP database connection pool for a Jakarta EE application, and why?

**Explanation:** `ServletContextListener` is the correct choice. Its `contextInitialized()` method runs exactly once when the web application is loaded by the container before any servlets or filters service incoming requests. Its `contextDestroyed()` method provides the guarantee to cleanly shut down the pool when the application is undeployed.
