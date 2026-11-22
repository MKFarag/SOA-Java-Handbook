---
id: topic-73
slug: state-management-sessions-and-cookies
topicNumber: 73
title: 'State Management: Sessions & Secure Cookies'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 20
sectionTitle: 'State Management, Filtering & Security'
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 9 min read
shortDescription: >-
  Reference: HTTP statelessness mitigation, HttpSession lifecycle, JSESSIONID
  tracking mechanics, secure cookie flags (HttpOnly, Secure, SameSite), and
  session concurrency.
prerequisites:
  - 'Topic 67: Web Architecture Fundamentals: The HTTP Protocol'
  - 'Topic 70: HttpServletRequest & HttpServletResponse Processing'
---

## Overview
HTTP is inherently stateless. Web containers maintain conversational client state using `HttpSession` instances stored in server memory, tracking individual clients via a unique session token (`JSESSIONID`) exchanged through HTTP cookies or URL rewriting. Secure cookie attributes protect session tokens against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).

---

## State Management Architecture

```
Browser                                   Web Container (Tomcat)
   │                                                │
   │─── 1. HTTP GET /login (No Cookie) ────────────>│
   │                                                │ Creates HttpSession ID: "AF72..."
   │<── 2. Set-Cookie: JSESSIONID=AF72; HttpOnly ───│ Stores attributes in Heap
   │                                                │
   │─── 3. HTTP GET /cart (Cookie: JSESSIONID=AF72)─>│
   │                                                │ Resolves existing HttpSession
   │<── 4. HTTP 200 OK (Cart contents) ─────────────│
```

---

## Security Cookie Attributes Matrix

| Attribute | Syntax | Protection Purpose | Recommended Value |
| :--- | :--- | :--- | :--- |
| **`HttpOnly`** | `HttpOnly` | Prevents JavaScript (`document.cookie`) from reading the cookie | **Always `true`** for session tokens |
| **`Secure`** | `Secure` | Enforces transmission exclusively over encrypted HTTPS connections | **Always `true`** in production |
| **`SameSite`** | `SameSite=Strict/Lax/None`| Mitigates Cross-Site Request Forgery (CSRF) across origins | **`Lax`** (browsers) or **`Strict`** |
| **`Max-Age`** | `Max-Age=3600` | Sets expiration in seconds (negative deletes on browser close) | Session lifetime |
| **`Path`** | `Path=/app` | Restricts cookie transmission to specific URL paths | Root or app context path |

---

## Production Implementation: Session Management & Security Cookies

```java
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/auth/session")
public class SecureSessionServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Invalidate old session to prevent Session Fixation attacks
        HttpSession oldSession = req.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }

        // Create new clean session
        HttpSession newSession = req.getSession(true);
        newSession.setMaxInactiveInterval(1800); // 30 minutes timeout
        newSession.setAttribute("authenticatedUser", "engineer_01");

        // Manually set an application tracking cookie with modern security attributes
        Cookie userPref = new Cookie("theme", "dark");
        userPref.setHttpOnly(true);
        userPref.setSecure(true);
        userPref.setPath(req.getContextPath() + "/");
        userPref.setMaxAge(86400 * 30); // 30 days
        userPref.setAttribute("SameSite", "Lax");

        resp.addCookie(userPref);
        resp.getWriter().println("Session created and secured.");
    }
}
```

---

## Common Pitfalls & Security Traps

- **Session Fixation Vulnerability:**
  Keeping an existing session active across authentication boundaries allows an attacker who pre-planted a `JSESSIONID` to hijack the session. Always invoke `session.invalidate()` and create a new session upon successful login.
- **Storing Non-Serializable Objects in Distributed Environments:**
  In clustered environments with Tomcat session replication or Redis persistence, any object stored in `HttpSession` via `setAttribute()` must implement `java.io.Serializable`, otherwise serialization fails with `NotSerializableException`.
- **Calling `req.getSession()` Unnecessarily:**
  Invoking `req.getSession()` or `req.getSession(true)` on unauthenticated public endpoints (e.g., search, health check) forces the container to allocate a session and issue `Set-Cookie` for every bot/crawler, causing massive memory consumption. Use `req.getSession(false)` for read-only checks.

---

## Verification & Practice

**Question:** What is the critical behavioral difference between `request.getSession(true)` and `request.getSession(false)`?

**Explanation:** `request.getSession(true)` looks up the existing session associated with the request's `JSESSIONID`; if none exists, it creates and returns a brand-new `HttpSession`. `request.getSession(false)` returns the existing session if one is active, or returns `null` without creating a new session.

---

## Practice

### Q: Why should production web applications always enforce `HttpOnly` and `Secure` flags on the `JSESSIONID` cookie?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** The `HttpOnly` flag prevents client-side scripts (such as JavaScript accessed via XSS) from reading the session cookie via `document.cookie`, mitigating session hijacking. The `Secure` flag ensures the browser will only transmit the cookie over encrypted HTTPS connections, preventing network eavesdroppers from intercepting the session identifier on unencrypted networks.
</details>
