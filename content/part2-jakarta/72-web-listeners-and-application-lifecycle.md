---
id: topic-72
slug: web-listeners-and-application-lifecycle
topicNumber: 72
title: Web Listeners & Application Lifecycle
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 20
sectionTitle: 'State Management, Filters & Security'
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 11 min read
shortDescription: >-
  Leverage the Observer pattern in web applications: intercept application
  startup/shutdown (ServletContextListener), session tracking, and request
  lifecycle events.
prerequisites:
  - 'Topic 65: Apache Tomcat & The WAR Structure'
  - 'Topic 66: Servlet Lifecycle & Architecture'
  - 'Topic 70: State Management: Sessions and Cookies'
---
# Web Listeners and Application Lifecycle

### 1. What It Is and Why It Exists
In a web application, critical events occur continuously:
- The entire web application boots up or shuts down.
- A user logs in and creates an HTTP session, or their session times out after inactivity.
- Attributes are added, removed, or replaced in application, session, or request memory scopes.

Rather than scattering event-handling logic across individual servlets, the Jakarta Servlet platform provides the **Observer Pattern** via **Web Listeners (`jakarta.servlet.*Listener`)**. A listener is a class that registers with the container to receive automatic callback notifications whenever specific lifecycle milestones occur.

**Real-World Analogy:**
Imagine a stadium hosting a championship match:
- The stadium operations manager (**`ServletContextListener`**) unlocks the stadium gates, turns on the floodlights, and checks the scoreboard hours before the match begins; when the match concludes, the manager turns off the lights and locks the stadium down.
- The turnstile security scanner (**`HttpSessionListener`**) increments the active attendee counter every time a spectator enters, and decrements it when they depart.

---

### 2. Prerequisites
- **Apache Tomcat & WAR Structure (Topic 65)**: Understanding `ServletContext` as the global application scope.
- **State Management (Topic 70)**: Understanding `HttpSession` lifecycle, creation, and invalidation.

---

### 3. Syntax Breakdown

#### 3.1 The Three Core Listener Categories
The Servlet specification defines listeners across three distinct architectural scopes:

| Scope | Listener Interface | Primary Events Intercepted |
| :--- | :--- | :--- |
| **Application (`ServletContext`)** | `ServletContextListener`<br>`ServletContextAttributeListener` | Web application deployment, boot, shutdown, and global attribute mutations |
| **Session (`HttpSession`)** | `HttpSessionListener`<br>`HttpSessionAttributeListener`<br>`HttpSessionIdListener` | Session creation, timeout destruction, session ID rotation |
| **Request (`ServletRequest`)** | `ServletRequestListener`<br>`ServletRequestAttributeListener` | Request initialization, thread-local binding, request teardown |

#### 3.2 Declaring a Listener
```java
// Modern annotation: auto-discovered by Tomcat at deployment
@WebListener
public class ApplicationStartupListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // Runs at server boot
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Runs at server shutdown
    }
}
```

---

### 4. Runnable Code Examples

#### Example 1: Web Application Bootstrap and Teardown Listener (Basic)
Initializes global application resources (database pool status, startup timestamps) during container boot, and safely releases them on container stop.

```java
package com.handbook.web;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class AppBootstrapListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        System.out.println("[AppBootstrapListener] Web application starting: " + ctx.getContextPath());
        
        // Initialize global application-scope configuration
        ctx.setAttribute("appName", "Definitive Java Handbook Web App");
        ctx.setAttribute("appStartTime", System.currentTimeMillis());
        ctx.setAttribute("dbPoolStatus", "READY");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        System.out.println("[AppBootstrapListener] Web application shutting down: " + ctx.getContextPath());
        ctx.removeAttribute("dbPoolStatus");
    }
}
```

---

#### Example 2: Concurrent Active Session Tracker (Realistic)
Tracks real-time concurrent active user sessions using thread-safe `AtomicInteger` counters.

```java
package com.handbook.web;

import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import java.util.concurrent.atomic.AtomicInteger;

@WebListener
public class ActiveSessionTrackerListener implements HttpSessionListener {

    private static final AtomicInteger activeSessions = new AtomicInteger(0);

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        int total = activeSessions.incrementAndGet();
        System.out.println("[SessionTracker] Session created: " + se.getSession().getId() + " | Active: " + total);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        int total = activeSessions.decrementAndGet();
        System.out.println("[SessionTracker] Session destroyed: " + se.getSession().getId() + " | Active: " + total);
    }

    public static int getActiveSessionCount() {
        return activeSessions.get();
    }
}
```

**Expected Tomcat Catalina Log Output (Session Lifecycle):**
```
[AppBootstrapListener] Web application starting: /handbook
[SessionTracker] Session created: 8F2A01C90B44 | Active: 1
[SessionTracker] Session created: 31DC99A2E101 | Active: 2
[SessionTracker] Session destroyed: 8F2A01C90B44 | Active: 1
[AppBootstrapListener] Web application shutting down: /handbook
```

---

### 5. Step-by-Step Execution Trace
1. **Container Bootstrap**: Tomcat deploys `handbook.war` and detects the `@WebListener` annotations.
2. **Context Initialization**: Before any Servlet or Filter is initialized, Tomcat calls `AppBootstrapListener.contextInitialized()`. Database pools and caches are safely established.
3. **Incoming User**: When a new user hits the application and triggers `req.getSession()`, Tomcat fires `sessionCreated()`. `ActiveSessionTrackerListener` increments the thread-safe counter.
4. **Session Timeout**: When the user's session remains inactive beyond 30 minutes, Tomcat's background worker thread invalidates the session and fires `sessionDestroyed()`.
5. **Container Shutdown**: When Tomcat stops (`catalina stop`), Tomcat executes `AppBootstrapListener.contextDestroyed()`, ensuring connection pools and thread pools are gracefully terminated before JVM exit.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Performing blocking work or holding thread locks inside listeners
*Why it fails*: `contextInitialized()` runs during the critical server startup phase. If a listener hangs (e.g., trying to connect to a down database without a timeout), Tomcat will hang during startup or crash with a deployment timeout.
*The Fix*: Always configure strict network connection timeouts when connecting to external resources inside listeners.

#### Mistake 2: Storing state in non-thread-safe instance fields
*Why it fails*: A single listener instance handles events across hundreds of concurrent threads.
*The Fix*: Use `java.util.concurrent.atomic` classes or synchronized collections for any mutable shared counters.

---

### 7. Best Practices
- **Initialize Relational Connection Pools in `ServletContextListener`**: This guarantees that database connectivity is verified before any servlets receive customer traffic.
- **Use `ServletRequestListener` for Thread-Local Management**: If using `ThreadLocal` variables (e.g. logging correlation IDs), initialize them in `requestInitialized()` and **always** call `.remove()` in `requestDestroyed()` to prevent thread pool memory leaks.

---

### 8. Version Notes
- **Servlet 2.3**: Introduced `ServletContextListener` and `HttpSessionListener`.
- **Servlet 3.0**: Introduced `@WebListener` annotation and programmatic listener registration via `ServletContext.addListener()`.
- **Servlet 6.0**: Formalized async request listener support.

---

### 9. Summary Cheat Sheet: Web Listener Interfaces

| Listener Interface | Target Object | Method Hooks | Typical Purpose |
| :--- | :--- | :--- | :--- |
| **`ServletContextListener`** | Web Application | `contextInitialized()`<br>`contextDestroyed()` | Database connection pooling, global cache boot, cleanup |
| **`HttpSessionListener`** | User Session | `sessionCreated()`<br>`sessionDestroyed()` | Active user counts, session audit logging |
| **`ServletRequestListener`** | HTTP Request | `requestInitialized()`<br>`requestDestroyed()` | ThreadLocal cleanup, MDC logging, request timing |
| **`HttpSessionIdListener`** | Session ID | `sessionIdChanged()` | Session fixation audit logging |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (ThreadLocal Memory Leak)
What catastrophic bug exists in this request listener?
```java
@WebListener
public class UserContextListener implements ServletRequestListener {
    private static final ThreadLocal<String> userContext = new ThreadLocal<>();
    
    @Override
    public void requestInitialized(ServletRequestEvent sre) {
        userContext.set(sre.getServletRequest().getParameter("user"));
    }
}
```
<details>
<summary>View Solution</summary>

```java
// Cause: ThreadLocal is never cleared! Because Tomcat reuses worker threads from a pool,
// subsequent requests handled by the same worker thread will inherit the previous user's identity,
// creating severe security bypasses and permanent JVM ClassLoader memory leaks.
// Fix: Always clear ThreadLocal in requestDestroyed():
@Override
public void requestDestroyed(ServletRequestEvent sre) {
    userContext.remove();
}
```
</details>

#### Exercise 2: Hands-on Implementation (Programmatic Listener Registration)
How can a framework register a `ServletContextListener` programmatically without using `@WebListener` or `web.xml`?

<details>
<summary>View Solution</summary>

```java
// Use ServletContainerInitializer or ServletContext.addListener() during startup:
public class CustomInitializer implements ServletContainerInitializer {
    @Override
    public void onStartup(Set<Class<?>> c, ServletContext ctx) {
        ctx.addListener(new AppBootstrapListener());
    }
}
```
</details>

#### Exercise 3: Real-World Architecture (Startup Sequencing)
In what exact order does Apache Tomcat initialize web components upon application startup?

<details>
<summary>View Solution</summary>

```
The Servlet specification mandates this exact initialization sequence:
1. ServletContextListeners (contextInitialized)
2. Filters (init) in order of configuration
3. Servlets with loadOnStartup >= 0 (init) ordered by positive priority value
```
</details>

---

### 11. Official Sources
- [Jakarta Servlet Specification 6.0: Chapter 10 Lifecycle Events](https://jakarta.ee/specifications/servlet/6.0/) — Jakarta EE
- [Apache Tomcat 10.1 Documentation: Listeners Component](https://tomcat.apache.org/tomcat-10.1-doc/config/listeners.html) — Apache Tomcat
