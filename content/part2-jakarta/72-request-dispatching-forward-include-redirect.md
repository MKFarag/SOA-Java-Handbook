---
id: topic-72
slug: request-dispatching-forward-include-redirect
topicNumber: 72
title: 'Request Dispatching: Forward, Include & Redirect'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 18
sectionTitle: Servlet API Architecture & Request Handling
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: Server-side dispatching (RequestDispatcher.forward vs include) preserving request context vs client-side HTTP redirection (sendRedirect), and the PRG pattern.
prerequisites:
  - 'Topic 67: Web Architecture Fundamentals: The HTTP Protocol'
  - 'Topic 70: HttpServletRequest & HttpServletResponse Processing'
---

## Overview
Web applications route control between components using either server-side dispatching (`RequestDispatcher.forward()` / `include()`) or client-side HTTP redirection (`HttpServletResponse.sendRedirect()`). Dispatching executes entirely within container memory preserving request-scope attributes, whereas redirection issues an HTTP 302/303 response instructing the browser to execute a fresh request round-trip.

---

## Comparison Matrix: Dispatch vs Redirect

| Metric | `RequestDispatcher.forward()` | `RequestDispatcher.include()` | `HttpServletResponse.sendRedirect()` |
| :--- | :--- | :--- | :--- |
| **Execution Location** | Server-side (internal) | Server-side (internal) | Client-side (browser round-trip) |
| **Browser URL Bar** | Unchanged (original request URL) | Unchanged | Updates to target redirect URL |
| **Network Round-Trips** | **1** single HTTP request | **1** single HTTP request | **2** separate HTTP requests |
| **Request Attributes** | Preserved across invocation | Preserved across invocation | **Lost** (creates brand new request) |
| **HTTP Method** | Retained (POST remains POST) | Retained | Usually transitions to **GET** (302/303) |
| **Target Scope** | Same container context only | Same container context only | Any URL (internal or external domain) |

---

## The Post-Redirect-Get (PRG) Pattern Architecture

```
Browser                             Server (Controller)
   │                                        │
   │─── 1. HTTP POST /submitOrder ─────────>│ (Persists Order to Database)
   │                                        │
   │<── 2. HTTP 303 Redirect /orderSuccess ─│ (Prevents Double Submit)
   │                                        │
   │─── 3. HTTP GET /orderSuccess ─────────>│ (Renders Confirmation View)
   │                                        │
   │<── 4. HTTP 200 OK (Rendered HTML) ─────│
```

---

## Production Implementation: Dispatcher vs Redirection Controller

```java
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/order/process")
public class OrderDispatchServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String itemId = req.getParameter("itemId");

        if (itemId == null || itemId.isBlank()) {
            // Forward internally to error page with request attribute
            req.setAttribute("errorMessage", "Item ID must not be blank.");
            RequestDispatcher dispatcher = req.getRequestDispatcher("/WEB-INF/views/error.jsp");
            dispatcher.forward(req, resp);
            return;
        }

        // Processing success -> Apply Post-Redirect-Get (PRG)
        resp.sendRedirect(req.getContextPath() + "/order/confirmation?id=" + itemId);
    }
}
```

---

## Common Pitfalls & Runtime Traps

- **Forwarding After Response Commitment:**
  Calling `dispatcher.forward(req, resp)` after writing data to `PrintWriter` or calling `resp.flushBuffer()` throws `IllegalStateException: Cannot forward after response has been committed`.
- **Forgetting `return` After `forward` or `sendRedirect`:**
  Neither `forward()` nor `sendRedirect()` stops execution of the remaining Java method statements. Omitting `return` causes code below the redirect to execute, often leading to unexpected database updates or `IllegalStateException`.
- **Relative Path Errors with `sendRedirect`:**
  Passing `resp.sendRedirect("login.jsp")` resolves relative to the current URL path. If the current request is `/admin/users/edit`, the browser redirects to `/admin/users/login.jsp`. Always prefix with `req.getContextPath()` for absolute paths:
  `resp.sendRedirect(req.getContextPath() + "/login.jsp");`.

---

## Verification & Practice

**Question:** Why does submitting a form via `POST` and forwarding directly to `confirmation.jsp` cause a duplicate form submission warning when the user presses F5 (browser refresh)?

**Explanation:** In a forward, the browser's address bar remains at the original `POST /order/process` URL. Refreshing the browser causes the user-agent to re-send the original HTTP `POST` request with the form payload. Using the Post-Redirect-Get (PRG) pattern replaces the POST URL with a `GET /order/confirmation` URL in the browser, making F5 refreshes completely safe.
