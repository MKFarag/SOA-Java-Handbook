---
id: topic-70
slug: state-management-sessions-and-cookies
topicNumber: 70
title: 'State Management: Sessions & Cookies'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 20
sectionTitle: 'State Management, Filters & Security'
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Bridge stateless HTTP with stateful web interactions: master server-side
  HttpSession memory, JSESSIONID tracking, secure Cookie flags, and session
  invalidation.
prerequisites:
  - 'Topic 64: Web Architecture Fundamentals (HTTP Protocol)'
  - 'Topic 67: Request and Response Processing in Servlets'
---
# State Management: Sessions and Cookies

### 1. What It Is and Why It Exists
HTTP is by definition a **stateless protocol**. When a client makes a request to a server, the server processes it, returns a response, and completely forgets who the client was. Every subsequent request arrives as an isolated transaction.

Real-world web applications, however, are inherently **stateful**: users log into dashboards, maintain e-commerce shopping carts across multiple page clicks, and customize persistent interface preferences. To bridge this gap, the Jakarta Servlet platform provides two complementary state management mechanisms:
1. **Cookies (`jakarta.servlet.http.Cookie`)**: Small key-value text tokens sent by the server via `Set-Cookie` response headers and stored on the user's browser, which the browser automatically re-transmits on every subsequent HTTP request to that domain.
2. **HTTP Sessions (`jakarta.servlet.http.HttpSession`)**: Server-side conversational memory. The server allocates a memory session table indexed by a unique random token (typically named `JSESSIONID`). The container writes this ID to a browser cookie; on future requests, the container reads `JSESSIONID` and automatically reconnects the incoming thread to the user's private server-side session object.

**Real-World Analogy:**
Imagine visiting a waterpark resort. At check-in, the hotel keeps your luggage and room reservations in their central computer database (**`HttpSession`**). Instead of forcing you to carry your luggage everywhere, the front desk gives you a waterproof wristband encoded with a unique barcode number (**`JSESSIONID Cookie`**). Every time you buy food or enter a ride, staff scan the wristband to look up your central account.

---

### 2. Prerequisites
- **Web Architecture Fundamentals (Topic 64)**: Understanding HTTP headers (`Cookie`, `Set-Cookie`), statelessness, and security flags.
- **Request and Response Processing (Topic 67)**: Working with `HttpServletRequest` and `HttpServletResponse`.

---

### 3. Syntax Breakdown

#### 3.1 Managing Server-Side Sessions (`HttpSession`)
```java
// 1. Retrieve session (true = create if absent; false = return null if absent)
HttpSession session = request.getSession(true);

// 2. Store and retrieve conversational state
session.setAttribute("shoppingCart", cartObject);
List<Item> cart = (List<Item>) session.getAttribute("shoppingCart");

// 3. Configure session timeout (in seconds)
session.setMaxInactiveInterval(1800); // 30 minutes of inactivity

// 4. Invalidate session (logout)
session.invalidate();
```

#### 3.2 Managing Client-Side Cookies (`Cookie`)
```java
// 1. Create a cookie
Cookie authCookie = new Cookie("authToken", "xyz-789");

// 2. Configure lifecycle and security flags
authCookie.setMaxAge(60 * 60 * 24 * 7); // 7 days in seconds
authCookie.setPath("/");                 // Available across entire domain
authCookie.setHttpOnly(true);            // BLOCKS JavaScript access (Prevents XSS theft)
authCookie.setSecure(true);              // Sent ONLY over HTTPS connections
authCookie.setAttribute("SameSite", "Lax"); // Mitigates Cross-Site Request Forgery (CSRF)

// 3. Attach to outgoing response
response.addCookie(authCookie);

// 4. Read incoming cookies
Cookie[] cookies = request.getCookies();
if (cookies != null) {
    for (Cookie c : cookies) {
        if ("authToken".equals(c.getName())) {
            String token = c.getValue();
        }
    }
}
```

---

### 4. Runnable Code Examples

#### Example 1: Stateful Shopping Cart with Session Invalidation (Basic)
Demonstrates session creation, storing and querying cart items, inspecting session IDs, and invalidating on checkout.

```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "SessionShoppingCartServlet", urlPatterns = {"/cart"})
public class SessionShoppingCartServlet extends HttpServlet {

    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(true);
        session.setMaxInactiveInterval(1800); // 30 minutes timeout

        List<String> cart = (List<String>) session.getAttribute("shoppingCart");
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute("shoppingCart", cart);
        }

        String action = req.getParameter("action");
        String item = req.getParameter("item");

        if ("add".equalsIgnoreCase(action) && item != null && !item.isBlank()) {
            cart.add(item.trim());
        } else if ("clear".equalsIgnoreCase(action)) {
            session.invalidate();
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("Session invalidated. Cart cleared.");
            return;
        }

        resp.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.println("{");
            out.printf("  \"sessionId\": \"%s\",%n", session.getId());
            out.printf("  \"isNew\": %b,%n", session.isNew());
            out.printf("  \"creationTime\": %d,%n", session.getCreationTime());
            out.printf("  \"itemCount\": %d,%n", cart.size());
            out.printf("  \"items\": %s%n", cart);
            out.println("}");
        }
    }
}
```

**Expected HTTP Response Output (`GET /cart?action=add&item=Keyboard`):**
```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Set-Cookie: JSESSIONID=E5B942FA104BC8A0; Path=/handbook; HttpOnly

{
  "sessionId": "E5B942FA104BC8A0",
  "isNew": true,
  "creationTime": 1731885500000,
  "itemCount": 1,
  "items": [Keyboard]
}
```

---

#### Example 2: Secure Cookie Consent Manager (Realistic)
Demonstrates setting cookies with `HttpOnly`, `Secure`, and `SameSite` flags, inspecting incoming request cookies, and deleting cookies via `setMaxAge(0)`.

```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "CookieConsentServlet", urlPatterns = {"/cookies"})
public class CookieConsentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String action = req.getParameter("action");
        resp.setContentType("text/plain;charset=UTF-8");

        if ("set".equalsIgnoreCase(action)) {
            Cookie cookie = new Cookie("user_consent", "accepted");
            cookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
            cookie.setPath("/");
            cookie.setHttpOnly(true); // Prevent JavaScript access (XSS defense)
            cookie.setSecure(true);   // Transmit only over HTTPS
            cookie.setAttribute("SameSite", "Lax"); // CSRF mitigation
            
            resp.addCookie(cookie);
            resp.getWriter().println("Cookie 'user_consent=accepted' attached to response.");
            return;
        } else if ("delete".equalsIgnoreCase(action)) {
            Cookie cookie = new Cookie("user_consent", "");
            cookie.setMaxAge(0); // Deletes cookie on client
            cookie.setPath("/");
            resp.addCookie(cookie);
            resp.getWriter().println("Cookie 'user_consent' deleted.");
            return;
        }

        Cookie[] cookies = req.getCookies();
        try (PrintWriter out = resp.getWriter()) {
            out.println("=== Incoming Request Cookies ===");
            if (cookies != null && cookies.length > 0) {
                for (Cookie c : cookies) {
                    out.printf("  %s = %s (Path: %s, MaxAge: %d)%n", 
                        c.getName(), c.getValue(), c.getPath(), c.getMaxAge());
                }
            } else {
                out.println("  (No cookies found in request)");
            }
        }
    }
}
```

**Expected HTTP Response Output (`GET /cookies?action=set`):**
```http
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8
Set-Cookie: user_consent=accepted; Max-Age=2592000; Expires=Wed, 17-Dec-2026 21:00:00 GMT; Path=/; Secure; HttpOnly; SameSite=Lax

Cookie 'user_consent=accepted' attached to response.
```

---

### 5. Step-by-Step Execution Trace
1. **Initial Visit**: Client sends `GET /cart` without cookies.
2. **Session Allocation**: `req.getSession(true)` detects no incoming `JSESSIONID`. Tomcat generates a cryptographically secure 128-bit session ID and allocates an internal session record in memory.
3. **Cookie Attachment**: Tomcat automatically adds a `Set-Cookie: JSESSIONID=...; Path=/; HttpOnly` header to the HTTP response.
4. **Browser Storage**: The browser receives the header and stores `JSESSIONID` in its secure cookie jar.
5. **Subsequent Request**: Client sends `GET /cart?action=add&item=Mouse` with `Cookie: JSESSIONID=...`.
6. **Session Reconnection**: Tomcat reads the cookie, matches the ID in its active session map, and returns the existing `HttpSession` instance with previous items intact.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Storing massive object graphs in `HttpSession`
*Why it fails*: Every session consumes server heap memory. In high-traffic applications with 50,000 concurrent users, placing 10 MB datasets in session will trigger `OutOfMemoryError` or severe Garbage Collection pauses.
*The Fix*: Store only lightweight identifiers (e.g. `userId`, `cartId`) in session and query actual records from an in-memory cache (Redis) or relational database.

#### Mistake 2: Forgetting `setHttpOnly(true)` on sensitive cookies
*Why it fails*: Without `HttpOnly`, any malicious JavaScript executed via an XSS flaw can access `document.cookie` and steal session tokens.
*The Fix*: Always mark sensitive tokens and session cookies as `HttpOnly` and `Secure`.

---

### 7. Best Practices
- **Configure Global Session Timeout in `web.xml`**:
  ```xml
  <session-config>
      <session-timeout>30</session-timeout> <!-- minutes -->
      <cookie-config>
          <http-only>true</http-only>
          <secure>true</secure>
      </cookie-config>
  </session-config>
  ```
- **Explicit Invalidation on Logout**: Always invoke `session.invalidate()` when a user clicks Log Out to prevent Session Replay attacks.
- **Session ID Rotation upon Login**: When authenticating, call `req.changeSessionId()` to prevent Session Fixation.

---

### 8. Version Notes
- **Servlet 2.0**: Introduced `HttpSession` and `Cookie`.
- **Servlet 3.0**: Introduced programmatic `<cookie-config>` in `web.xml`.
- **Servlet 6.0 (Jakarta EE 10)**: Formalized `SameSite` cookie attribute support directly in the API.

---

### 9. Summary Cheat Sheet: Session vs Cookie

| Dimension | `HttpSession` | `Cookie` |
| :--- | :--- | :--- |
| **Storage Location** | Server RAM / Heap | Client Browser Disk / RAM |
| **Data Capacity** | Unlimited (bound by server memory) | Limited to **4 KB** per cookie |
| **Data Types** | Any Java Object (`Serializable`) | Text Strings only (`String`) |
| **Security Risk** | Low client visibility; high memory overhead | High client visibility; risk of tampering & theft |
| **Transmission** | Only `JSESSIONID` token sent over network | Entire cookie value sent on **every** HTTP request |
| **Typical Data** | Shopping cart, Auth principal, user rights | UI theme preference, tracking consent, auth tokens |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (Cookie Deletion)
Why does the following code fail to delete a cookie on the client browser?
```java
Cookie c = new Cookie("user_token", "");
resp.addCookie(c);
```
<details>
<summary>View Solution</summary>

```java
// Cause: Without setting maxAge to 0 and matching the exact cookie Path, the browser treats it as an update.
// Fix:
Cookie c = new Cookie("user_token", "");
c.setMaxAge(0);   // Instructs browser to delete cookie immediately
c.setPath("/");   // Path MUST match original cookie path
resp.addCookie(c);
```
</details>

#### Exercise 2: Hands-on Implementation (Session Counter Guard)
Write a servlet snippet that limits a user to 5 requests per session, rejecting request #6 with HTTP 429 Too Many Requests.

<details>
<summary>View Solution</summary>

```java
HttpSession session = req.getSession(true);
Integer count = (Integer) session.getAttribute("reqCount");
if (count == null) count = 0;
count++;
if (count > 5) {
    resp.sendError(429, "Rate limit exceeded for this session.");
    return;
}
session.setAttribute("reqCount", count);
resp.getWriter().println("Request count: " + count);
```
</details>

#### Exercise 3: Real-World Architecture (Clustered Sessions)
What must every Java class stored in `HttpSession` implement if the web application is deployed to a high-availability cluster with session replication?

<details>
<summary>View Solution</summary>

```java
// Every object placed in an HttpSession must implement java.io.Serializable.
// Reason: Clustered containers (like Apache Tomcat with DeltaManager) serialize session attributes
// to binary byte arrays across the network to mirror session state on backup server nodes.
```
</details>

---

### 11. Official Sources
- [Jakarta Servlet Specification 6.0: Chapter 7 Sessions](https://jakarta.ee/specifications/servlet/6.0/) — Jakarta EE
- [Apache Tomcat 10.1 Documentation: Manager Component (Session Replication)](https://tomcat.apache.org/tomcat-10.1-doc/config/manager.html) — Apache Tomcat
