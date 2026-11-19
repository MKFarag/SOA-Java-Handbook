---
id: topic-81
slug: error-pages-and-exception-handling
topicNumber: 81
title: Declarative Error Pages & Exception Handling
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Production Web Development
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Configure production-ready error boundaries using web.xml declarative
  error-page mappings, HTTP status codes, and exception type hierarchies.
prerequisites:
  - 'Topic 29: The Java Exception Hierarchy'
  - 'Topic 68: Servlet Configuration: Annotations vs web.xml'
  - 'Topic 76: JSP Implicit Objects & Standard Actions'
---
# Topic 81: Declarative Error Pages & Exception Handling

## 1. What It Is and Why It Exists
In production web environments, unhandled exceptions (e.g. `NullPointerException`, `SQLException`, or missing routes `404`) must never expose raw stack traces to end users. Default container stack traces reveal internal package structures, database schemas, and server versions to potential attackers.

The Jakarta Servlet specification provides **declarative error page mapping** via `web.xml`. Web containers intercept HTTP status codes and uncaught `Throwable` exceptions, routing the user to dedicated branded error templates without leaking technical internals.

### Real-World Analogy
An automated bank ATM:
If an internal gear fails or communication drops while counting cash, the machine does not display a screen full of raw C++ memory pointers or operating system registers. Instead, it displays a polite, polished screen: *"We apologize; this machine is temporarily undergoing service. Your account was not charged."* The technical fault log is written to a secure internal auditor file.

### Why It Exists
Declarative error handling centralizes failure management at the container level. Individual Servlets do not need repetitive `try-catch` blocks returning custom HTML error markup. The container manages error forwarding automatically, populating the JSP `ErrorData` object with status codes, request URIs, and root causes.

---

## 2. Prerequisites
- **Topic 29: The Java Exception Hierarchy:** Understanding `Throwable`, `Exception`, and `RuntimeException`.
- **Topic 68: Servlet Configuration:** Configuring deployment descriptors (`web.xml`).
- **Topic 76: JSP Implicit Objects:** Utilizing the `pageContext.errorData` implicit model.

---

## 3. Syntax Breakdown
```xml
<!-- web.xml Declarative Error Page Configuration -->
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" version="6.0">

    <!-- 1. HTTP Status Code Mapping -->
    <error-page>
        <error-code>404</error-code>
        <location>/error-404.jsp</location>
    </error-page>

    <!-- 2. Specific Java Exception Mapping -->
    <error-page>
        <exception-type>java.lang.IllegalArgumentException</exception-type>
        <location>/error-bad-request.jsp</location>
    </error-page>

    <!-- 3. Global Fallback for Uncaught Throwables -->
    <error-page>
        <exception-type>java.lang.Throwable</exception-type>
        <location>/error-500.jsp</location>
    </error-page>

</web-app>
```

### Key Elements Explained
- `<error-code>`: Matches standard 3-digit HTTP status codes (e.g., 400 Bad Request, 403 Forbidden, 404 Not Found, 500 Internal Error).
- `<exception-type>`: The fully qualified class name of an exception. If an uncaught exception matches or inherits from this class, the container invokes the corresponding error page.
- `<location>`: The application context-relative URL path of the error-rendering JSP or Servlet.

---

## 4. Runnable Examples

### Example 1: Basic Fault Trigger Servlet and Error JSP
```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "FaultTriggerServlet", urlPatterns = {"/fault"})
public class FaultTriggerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String type = req.getParameter("type");
        if ("404".equals(type)) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Requested entity does not exist.");
            return;
        }
        if ("runtime".equals(type)) {
            throw new RuntimeException("Simulated NullPointerException inside business workflow.");
        }
        resp.setContentType("text/plain");
        resp.getWriter().println("Normal execution: No faults triggered.");
    }
}
```

#### Corresponding Error View (`/error-500.jsp`)
```jsp
<%@ page isErrorPage="true" contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head><title>500 - Server Application Error</title></head>
<body>
    <h1>500: Internal Server Error</h1>
    <p>URI: <code>${pageContext.errorData.requestURI}</code></p>
    <p>Message: <strong>${pageContext.errorData.throwable.message}</strong></p>
    <p>Status: <strong>${pageContext.errorData.statusCode}</strong></p>
</body>
</html>
```

#### Expected Output (When requesting `/fault?type=runtime`)
```html
<!DOCTYPE html>
<html>
<head><title>500 - Server Application Error</title></head>
<body>
    <h1>500: Internal Server Error</h1>
    <p>URI: <code>/fault</code></p>
    <p>Message: <strong>Simulated NullPointerException inside business workflow.</strong></p>
    <p>Status: <strong>500</strong></p>
</body>
</html>
```

---

### Example 2: Realistic Container Exception Hierarchy Dispatcher
```java
package com.handbook.web;

import java.util.HashMap;
import java.util.Map;

public class ErrorHandlingDispatcherDemo {
    public static class ErrorPageRegistry {
        private final Map<Integer, String> codeMap = new HashMap<>();
        private final Map<Class<? extends Throwable>, String> exceptionMap = new HashMap<>();

        public void registerErrorCode(int code, String location) {
            codeMap.put(code, location);
        }

        public void registerException(Class<? extends Throwable> type, String location) {
            exceptionMap.put(type, location);
        }

        public String resolveErrorPage(int statusCode, Throwable throwable) {
            if (throwable != null) {
                Class<?> curr = throwable.getClass();
                while (curr != null && Throwable.class.isAssignableFrom(curr)) {
                    if (exceptionMap.containsKey(curr)) {
                        return exceptionMap.get(curr);
                    }
                    curr = curr.getSuperclass();
                }
            }
            if (codeMap.containsKey(statusCode)) {
                return codeMap.get(statusCode);
            }
            return "/default-error.jsp";
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Error Page & Exception Handling Dispatcher Demo ===");
        ErrorPageRegistry registry = new ErrorPageRegistry();
        registry.registerErrorCode(404, "/error-404.jsp");
        registry.registerErrorCode(403, "/error-403.jsp");
        registry.registerException(IllegalArgumentException.class, "/error-bad-request.jsp");
        registry.registerException(Throwable.class, "/error-500.jsp");

        String notFoundPage = registry.resolveErrorPage(404, null);
        System.out.println("Status 404 resolved page: " + notFoundPage);
        assert "/error-404.jsp".equals(notFoundPage);

        String specificExPage = registry.resolveErrorPage(500, new IllegalArgumentException("Invalid ID"));
        System.out.println("IllegalArgumentException resolved page: " + specificExPage);
        assert "/error-bad-request.jsp".equals(specificExPage);

        String fallbackExPage = registry.resolveErrorPage(500, new NullPointerException("Null reference"));
        System.out.println("NullPointerException hierarchy resolved page: " + fallbackExPage);
        assert "/error-500.jsp".equals(fallbackExPage);

        System.out.println("Error page resolution verified: Declarative container exception dispatch successful.");
    }
}
```

#### Expected Output
```text
=== Error Page & Exception Handling Dispatcher Demo ===
Status 404 resolved page: /error-404.jsp
IllegalArgumentException resolved page: /error-bad-request.jsp
NullPointerException hierarchy resolved page: /error-500.jsp
Error page resolution verified: Declarative container exception dispatch successful.
```

---

## 5. Step-by-Step "What Happens When This Runs"
1. **Exception Occurs:** A servlet or filter throws an uncaught exception during request processing.
2. **Container Catches Fault:** The web container (Tomcat) intercepts the exception before sending bytes to the socket.
3. **Response Reset:** If headers have not been committed, the container clears the output buffer.
4. **Hierarchy Inspection:** The container looks up the exception class in the `web.xml` registry. If an exact match is missing, it climbs the superclass tree until matching `Throwable`.
5. **Request Attributes Injected:** Container populates special request attributes under `jakarta.servlet.error.*` (`status_code`, `exception`, `request_uri`, `servlet_name`).
6. **Internal Dispatch:** The container forwards execution to `<location>` (e.g. `/error-500.jsp`).
7. **JSP Renders:** The error page reads `pageContext.errorData` and formats user-friendly HTML.

---

## 6. Common Mistakes and Solutions

### Mistake 1: Omitting `<%@ page isErrorPage="true" %>` on error JSP
**Symptom:** Expression Language `${exception}` or `pageContext.errorData` evaluates to empty or throws compiler error.
**Cause:** Without `isErrorPage="true"`, the JSP translation engine does not instantiate the implicit `exception` variable in the generated `_jspService` method.
**Solution:** Always place `<%@ page isErrorPage="true" %>` at the top of error page JSP files.

### Mistake 2: Throwing exceptions after response commitment
**Symptom:** Browser shows a broken, half-rendered HTML page with an appended partial stack trace; custom error page never appears.
**Cause:** Once headers and initial bytes are flushed to the client socket (`response.flushBuffer()`), the container cannot reset the HTTP response to status 500 or redirect to an error page.
**Solution:** Avoid manual buffer flushes before all business calculations finish. Keep container output buffers adequately sized.

---

## 7. Best Practices and When NOT to Use It

### Best Practices
- Never display raw stack traces, SQL queries, or server version strings on production error pages.
- Always log the full stack trace server-side (`logger.error("Request failed: " + req.getRequestURI(), throwable)`) before forwarding.
- Provide a clean correlation ID (e.g., UUID) on the user-facing error page so users can report it to support desks.

### When NOT to Use It
- Do not use HTML error pages for JSON REST APIs: REST endpoints should return JSON error envelopes (`{"error": "Resource not found", "code": 404}`) via `@ExceptionHandler` or JAX-RS `ExceptionMapper`.

---

## 8. Version Notes
- **Servlet 2.3+:** Introduced `<error-page>` with `<error-code>` and `<exception-type>`.
- **Jakarta EE 9 / 10:** Updated error attribute names to `jakarta.servlet.error.status_code`, `jakarta.servlet.error.exception`, etc.
- **Status:** Stable production requirement.

---

## 9. Summary Cheat Sheet
| Attribute Key | Description | EL Shortcut |
|---|---|---|
| `jakarta.servlet.error.status_code` | HTTP Integer code (e.g., 404, 500) | `${pageContext.errorData.statusCode}` |
| `jakarta.servlet.error.request_uri` | Requested URL path that failed | `${pageContext.errorData.requestURI}` |
| `jakarta.servlet.error.exception` | Thrown `Throwable` object | `${pageContext.errorData.throwable}` |
| `jakarta.servlet.error.servlet_name` | Name of the failing Servlet | `${pageContext.errorData.servletName}` |

---

## 10. Exercises with Solutions

### Exercise 1: Spot the Bug
<details>
<summary>View Solution</summary>
**Question:** A developer writes in `web.xml`:
```xml
<error-page>
    <error-code>500</error-code>
    <exception-type>java.lang.NullPointerException</exception-type>
    <location>/error.jsp</location>
</error-page>
```
Why does Tomcat reject this file upon startup?

**Solution:** In `web.xml`, `<error-page>` must contain **either** `<error-code>` **or** `<exception-type>`, but never both within the same `<error-page>` element. They must be split into two separate `<error-page>` declarations.
</details>

### Exercise 2: Hands-on Implementation
<details>
<summary>View Solution</summary>
**Question:** Write the `web.xml` fragment to route HTTP 403 Forbidden to `/error-403.jsp` and all database `java.sql.SQLException` faults to `/db-error.jsp`.

**Solution:**
```xml
<error-page>
    <error-code>403</error-code>
    <location>/error-403.jsp</location>
</error-page>
<error-page>
    <exception-type>java.sql.SQLException</exception-type>
    <location>/db-error.jsp</location>
</error-page>
```
</details>

---

## 11. Sources
- [Jakarta Servlet Specification 6.0 - Error Handling](https://jakarta.ee/specifications/servlet/6.0/)
- [Tomcat Error Report Valve Configuration](https://tomcat.apache.org/tomcat-10.1-doc/config/valve.html#Error_Report_Valve)
