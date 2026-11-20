---
id: topic-69
slug: request-dispatching-forward-include-redirect
topicNumber: 69
title: 'Request Dispatching: Forward vs Include vs Redirect'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 19
sectionTitle: Servlets Deep Dive
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master request routing: compare internal server forwards
  (RequestDispatcher.forward), modular includes, and client-side redirects
  (sendRedirect), with the Post/Redirect/Get pattern.
prerequisites:
  - 'Topic 64: Web Architecture Fundamentals (HTTP Protocol)'
  - 'Topic 66: Servlet Lifecycle & Architecture'
  - 'Topic 67: Request and Response Processing in Servlets'
relevanceLevel: MUST-KNOW / CORE
---
# Request Dispatching: Forward vs Include vs Redirect

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

### 1. What It Is and Why It Exists
In production web development, a single incoming request rarely finishes its entire lifecycle inside a single monolithic class. Modern architectures (such as Model-View-Controller) separate concerns: a **Servlet Controller** receives input, validates parameters, and interacts with a database, while a presentation view (**JSP or HTML template**) renders the final visual output.

To coordinate between resources, the Jakarta Servlet platform provides three distinct dispatching mechanisms:
1. **Server-Side Forward (`RequestDispatcher.forward()`)**: Passes control internally on the server to another servlet, JSP, or static resource. The client is completely unaware of the handoff; the browser URL does not change.
2. **Server-Side Include (`RequestDispatcher.include()`)**: Temporarily calls another resource to generate content (like a common header, navigation bar, or footer) and embeds the generated output into the current response before continuing.
3. **Client-Side Redirect (`HttpServletResponse.sendRedirect()`)**: Sends an HTTP 302/303 redirect response back across the network to the browser, directing the client to make a completely new `GET` request to a target URL.

**Real-World Analogy:**
- **Forward**: You walk up to a bank teller asking for loan approval. The teller walks into the manager's back office, hands over your paperwork, and the manager completes the approval and hands you the cash directly. You never left your spot.
- **Include**: A book author is writing a chapter and quotes an excerpt from an encyclopedia. The quoted text is embedded directly into the chapter.
- **Redirect**: You walk up to a pharmacy counter asking to buy airline tickets. The pharmacist says, *"We do not sell tickets here; please go across the street to the airport terminal."* You leave the building and walk to the new destination yourself.

---

### 2. Prerequisites
- **Web Architecture Fundamentals (Topic 64)**: Understanding HTTP 302 redirects, request headers, and client-server round-trips.
- **Request and Response Processing (Topic 67)**: Understanding request attributes (`req.setAttribute()`) and response buffers.

---

### 3. Syntax Breakdown

#### 3.1 Server-Side Forward
```java
// 1. Attach data to the request scope
request.setAttribute("userList", users);

// 2. Obtain a RequestDispatcher from request or ServletContext
RequestDispatcher dispatcher = request.getRequestDispatcher("/WEB-INF/views/users.jsp");

// 3. Forward execution (terminates current servlet handling)
dispatcher.forward(request, response);
```
> [!WARNING]
> You cannot call `forward()` if the response buffer has already committed (i.e. bytes already sent to the network). Doing so throws `IllegalStateException`.

#### 3.2 Server-Side Include
```java
// Include shared header markup
RequestDispatcher headerDispatcher = request.getRequestDispatcher("/WEB-INF/views/header.html");
headerDispatcher.include(request, response);

// Continue writing current servlet body content
response.getWriter().println("<main>Current Page Body</main>");

// Include shared footer markup
RequestDispatcher footerDispatcher = request.getRequestDispatcher("/WEB-INF/views/footer.html");
footerDispatcher.include(request, response);
```

#### 3.3 Client-Side Redirect
```java
// Redirect to internal path within web application:
response.sendRedirect(request.getContextPath() + "/dashboard");

// Redirect to external website:
response.sendRedirect("https://www.oracle.com/java/");
```

---

### 4. Runnable Code Examples

#### Example 1: Dispatcher Controller Servlet (Basic)
Demonstrates forwarding to an internal view, including site headers/footers, and redirecting clients based on query parameters.

```java
package com.handbook.web;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "DispatcherControllerServlet", urlPatterns = {"/controller"})
public class DispatcherControllerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String action = req.getParameter("action");
        if (action == null) action = "forward";

        switch (action) {
            case "forward" -> {
                // Server-side forward: client URL stays /controller, request attributes preserved
                req.setAttribute("flashMessage", "Forwarded from DispatcherControllerServlet");
                req.setAttribute("processedTimestamp", System.currentTimeMillis());
                RequestDispatcher dispatcher = req.getRequestDispatcher("/view-handler");
                dispatcher.forward(req, resp);
            }
            case "include" -> {
                // Server-side include: includes output from target without terminating original response
                resp.setContentType("text/html;charset=UTF-8");
                resp.getWriter().println("<div class='header'>-- Global Site Header --</div>");
                RequestDispatcher dispatcher = req.getRequestDispatcher("/view-handler");
                dispatcher.include(req, resp);
                resp.getWriter().println("<div class='footer'>-- Global Site Footer --</div>");
            }
            case "redirect" -> {
                // Client-side redirect: sends 302 Found, browser makes a new GET request
                String redirectUrl = req.getContextPath() + "/inspect?client=RedirectedUser";
                resp.sendRedirect(redirectUrl);
            }
            default -> resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unknown action: " + action);
        }
    }
}
```

---

#### Example 2: View Handler Target Servlet (Realistic)
Consumes forwarded request attributes and generates HTML view markup.

```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "ViewHandlerServlet", urlPatterns = {"/view-handler"})
public class ViewHandlerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String flashMessage = (String) req.getAttribute("flashMessage");
        Long timestamp = (Long) req.getAttribute("processedTimestamp");

        resp.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.println("<div class='view-content'>");
            out.println("<h2>View Handler Render Target</h2>");
            out.printf("<p>Flash Message: <strong>%s</strong></p>%n", 
                flashMessage != null ? flashMessage : "(no attribute found)");
            out.printf("<p>Timestamp: <em>%s</em></p>%n", 
                timestamp != null ? timestamp.toString() : "(none)");
            out.println("</div>");
        }
    }
}
```

**Expected HTTP Response Output (`GET /controller?action=forward`):**
```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<div class='view-content'>
<h2>View Handler Render Target</h2>
<p>Flash Message: <strong>Forwarded from DispatcherControllerServlet</strong></p>
<p>Timestamp: <em>1731885000000</em></p>
</div>
```

**Expected HTTP Response Output (`GET /controller?action=redirect`):**
```http
HTTP/1.1 302 Found
Location: /handbook/inspect?client=RedirectedUser
Content-Length: 0
```

---

### 5. Step-by-Step Execution Trace

#### The Forward Flow:
1. Browser requests `GET /controller?action=forward`.
2. Tomcat creates `request` and `response` objects and invokes `DispatcherControllerServlet.doGet()`.
3. `req.setAttribute("flashMessage", ...)` stores an object in request memory.
4. `dispatcher.forward(req, resp)` transfers execution inside the same JVM thread to `ViewHandlerServlet`.
5. `ViewHandlerServlet` reads the attribute and writes HTML to the response stream.
6. The HTML response is returned to the client. The browser address bar still displays `/controller`.

#### The Redirect Flow:
1. Browser requests `GET /controller?action=redirect`.
2. The servlet calls `resp.sendRedirect("/handbook/inspect")`.
3. Tomcat writes HTTP `302 Found` with a `Location: /handbook/inspect` header and sends it immediately to the browser.
4. The browser reads the 302 status code and automatically issues a brand new `GET /handbook/inspect` request.
5. Any request attributes set during the first request are gone because the second request is a completely separate HTTP interaction.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Attempting to share data across `sendRedirect()` using `req.setAttribute()`
```java
// WRONG:
req.setAttribute("userId", 42);
resp.sendRedirect("/profile"); // The new request will find userId == null!
```
*Why it fails*: A redirect forces the browser to make a brand new HTTP request. The original `HttpServletRequest` object is destroyed when the 302 response completes.
*The Fix*: Pass identifiers in URL query parameters (`/profile?id=42`) or store state across requests in `HttpSession`.

#### Mistake 2: Missing `return` after `forward()` or `sendRedirect()`
```java
// DANGEROUS:
if (user == null) {
    resp.sendRedirect("/login");
    // Missing return! Following code continues running!
}
doSecretAdminWork();
```
*Why it fails*: Calling `sendRedirect()` or `forward()` does not exit the current method. If code continues executing, it causes security bypasses or `IllegalStateException`.
*The Fix*: Always `return;` immediately after forwarding or redirecting.

---

### 7. Best Practices
- **Post/Redirect/Get (PRG) Pattern**: Always redirect after handling form POST submissions to prevent duplicate form submissions if the user clicks browser Refresh.
- **Hide Private Views in `WEB-INF/`**: Forward to JSPs placed inside `WEB-INF/` so clients cannot access views directly by URL.
- **Relative vs Absolute Redirects**: Always prefix internal redirects with `req.getContextPath()` to ensure correct pathing regardless of deployment context.

---

### 8. Version Notes
- **Servlet 2.1**: Introduced `RequestDispatcher.forward()` and `include()`.
- **Servlet 6.0**: Enhanced support for relative redirect URLs according to RFC 7231 / 9110.

---

### 9. Summary Cheat Sheet: Forward vs Redirect

| Feature | `RequestDispatcher.forward()` | `HttpServletResponse.sendRedirect()` |
| :--- | :--- | :--- |
| **Location of Handoff** | **Server-side (inside JVM)** | **Client-side (across network)** |
| **Network Round Trips** | Exactly 1 HTTP request | **2 distinct HTTP requests** |
| **Browser URL Bar** | **Does not change** | **Updates to target URL** |
| **Request Attributes (`req.setAttribute`)** | **Preserved and accessible** | **Lost (New request created)** |
| **Target Scope** | Same web application only | Any URL on Internet |
| **Access `WEB-INF/`?** | **Yes (Internal server access)** | **No (Client browser blocked)** |
| **Typical Use Case** | Servlet Controller to JSP View | Post/Redirect/Get after form submit |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (Post-Redirect State Leak)
Explain why the welcome message never displays on the target page:
```java
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String username = req.getParameter("user");
    req.setAttribute("welcome", "Welcome back, " + username);
    resp.sendRedirect(req.getContextPath() + "/dashboard");
}
```
<details>
<summary>View Solution</summary>

```java
// Cause: sendRedirect() triggers a brand new HTTP request from the client browser.
// Request attributes set on the POST request are destroyed when the 302 response finishes.
// Fix Option 1 (Session):
req.getSession().setAttribute("welcome", "Welcome back, " + username);
resp.sendRedirect(req.getContextPath() + "/dashboard");

// Fix Option 2 (Forward):
req.getRequestDispatcher("/dashboard").forward(req, resp);
```
</details>

#### Exercise 2: Hands-on Implementation (Safe Post/Redirect/Get Guard)
Implement a servlet handler method that validates a submission: if invalid, forwards back to the form with an error attribute; if valid, saves data and redirects to success page.

<details>
<summary>View Solution</summary>

```java
protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
        throws ServletException, IOException {
    String email = req.getParameter("email");
    if (email == null || !email.contains("@")) {
        req.setAttribute("errorMessage", "Invalid email address format.");
        req.getRequestDispatcher("/WEB-INF/views/register.jsp").forward(req, resp);
        return;
    }
    // Save user...
    resp.sendRedirect(req.getContextPath() + "/registration-success");
}
```
</details>

#### Exercise 3: Real-World Architecture (Path Hiding)
Why is `RequestDispatcher.forward("/WEB-INF/views/admin.jsp")` considered an industry standard security best practice?

<details>
<summary>View Solution</summary>

```
1. Resources inside WEB-INF are protected by the Servlet specification from direct HTTP access by clients.
2. Direct browser requests to /WEB-INF/views/admin.jsp yield HTTP 404 Not Found.
3. Only the server-side controller can forward to this path after enforcing authentication and authorization checks, preventing users from bypassing business logic.
```
</details>

---

### 11. Official Sources
- [Jakarta Servlet Specification 6.0: Chapter 9 Dispatching Requests](https://jakarta.ee/specifications/servlet/6.0/) — Jakarta EE
- [Apache Tomcat 10.1 Documentation: RequestDispatcher API](https://tomcat.apache.org/tomcat-10.1-doc/servletapi/jakarta/servlet/RequestDispatcher.html) — Apache Tomcat
