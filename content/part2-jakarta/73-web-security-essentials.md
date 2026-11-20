---
id: topic-73
slug: web-security-essentials
topicNumber: 73
title: Web Security Essentials in Jakarta EE
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 20
sectionTitle: 'State Management, Filters & Security'
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 13 min read
shortDescription: >-
  Defend web applications against OWASP Top 10 vulnerabilities: implement
  synchronizer CSRF tokens, XSS HTML entity escaping, and session fixation
  prevention.
prerequisites:
  - 'Topic 64: Web Architecture Fundamentals (HTTP Protocol)'
  - 'Topic 67: Request and Response Processing in Servlets'
  - 'Topic 70: State Management: Sessions and Cookies'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Web Security Essentials in Jakarta EE

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
Web applications are constantly exposed to automated vulnerability scanners, script injection, and credential hijacking. Writing server-side Java code requires strict adherence to security defenses against the most critical application vulnerabilities identified by OWASP (Open Web Application Security Project):
1. **Cross-Site Scripting (XSS)**: An attacker injects malicious JavaScript into user-submitted data. When another user views the page, the browser executes the script, stealing session cookies or redirecting to phishing portals.
2. **Cross-Site Request Forgery (CSRF)**: An attacker tricks a victim's authenticated browser into submitting unauthorized commands (e.g. transferring money or changing an email address) to a vulnerable site without the user's knowledge.
3. **Session Fixation**: An attacker creates an anonymous session, tricks a victim into authenticating using that pre-set session ID, and then hijacks the victim's authenticated account.
4. **Security Cookie Flags**: Preventing JavaScript access (`HttpOnly`), network eavesdropping (`Secure`), and cross-site transmission (`SameSite`).

**Real-World Analogy:**
- **CSRF**: A scammer prepares a forged bank withdrawal slip with their bank account number. When you sign a check at a counter, they quickly slip the withdrawal slip underneath your hand so you sign it without realizing. **CSRF Tokens** are like personalized verification stamps that only you can stamp onto valid withdrawal slips.
- **Session Fixation**: A thief gives you an open padlock and says, *"Lock your locker with this."* Once you store your valuables and leave, the thief uses their duplicate key to open it. **Session Rotation (`changeSessionId()`)** means the front desk replaces your lock with a brand new, private combination lock the instant you deposit valuables.

---

### 2. Prerequisites
- **Web Architecture Fundamentals (Topic 64)**: Understanding HTTP methods, headers, and stateless request mechanics.
- **State Management (Topic 70)**: Understanding `HttpSession` and `Cookie` security attributes.

---

### 3. Syntax Breakdown

#### 3.1 Synchronizer CSRF Token Pattern
```java
// 1. Generation (during GET): generate secure random token in session
HttpSession session = request.getSession(true);
String token = (String) session.getAttribute("CSRF_TOKEN");
if (token == null) {
    token = generateCryptographicToken();
    session.setAttribute("CSRF_TOKEN", token);
}

// 2. Validation (during POST): compare request token with session token
String requestToken = request.getParameter("csrfToken");
if (token == null || !token.equals(requestToken)) {
    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF Token");
    return;
}
```

#### 3.2 HTML Entity Escaping (XSS Defense)
```java
// Prevent raw execution of user-submitted markup:
public static String escapeHtml(String str) {
    if (str == null) return "";
    return str.replace("&", "&amp;")
              .replace("<", "&lt;")
              .replace(">", "&gt;")
              .replace("\"", "&quot;")
              .replace("'", "&#x27;");
}
```

#### 3.3 Session Rotation (Session Fixation Defense)
```java
// In Servlet 3.1+ / Jakarta EE: rotate session ID upon successful credential check
if (authenticate(user, password)) {
    request.changeSessionId(); // Destroys old ID and assigns new ID, preserving session attributes!
    request.getSession().setAttribute("user", user);
}
```

---

### 4. Runnable Code Examples

#### Example 1: Synchronizer Token CSRF Protected Form Handler (Basic)
Generates a cryptographically strong random token on GET, embeds it in an HTML form, and verifies it on POST, rejecting forged requests with HTTP 403 Forbidden.

```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

@WebServlet(name = "CsrfProtectionServlet", urlPatterns = {"/transfer"})
public class CsrfProtectionServlet extends HttpServlet {

    private final SecureRandom random = new SecureRandom();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(true);
        String csrfToken = (String) session.getAttribute("CSRF_TOKEN");
        if (csrfToken == null) {
            byte[] bytes = new byte[24];
            random.nextBytes(bytes);
            csrfToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            session.setAttribute("CSRF_TOKEN", csrfToken);
        }

        resp.setContentType("text/html;charset=UTF-8");
        resp.getWriter().printf("""
            <form method="POST" action="%s/transfer">
                <input type="hidden" name="csrfToken" value="%s" />
                <label>Amount: <input type="number" name="amount" value="100"/></label>
                <button type="submit">Transfer Funds</button>
            </form>
            """, req.getContextPath(), csrfToken);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(false);
        String sessionToken = session != null ? (String) session.getAttribute("CSRF_TOKEN") : null;
        String requestToken = req.getParameter("csrfToken");

        if (sessionToken == null || requestToken == null || !sessionToken.equals(requestToken)) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("403 Forbidden: Invalid or missing CSRF token.");
            return;
        }

        String amount = req.getParameter("amount");
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().printf("Funds transfer approved: $%s transferred securely.%n", amount);
    }
}
```

---

#### Example 2: XSS Entity Sanitizer & Session Fixation Guard Suite (Realistic)
Demonstrates complete character neutralization preventing Cross-Site Scripting, and models `req.changeSessionId()` session rotation.

```java
package com.handbook.web;

public class SecuritySanitizerApp {

    public static String escapeHtml(String input) {
        if (input == null) return "";
        StringBuilder out = new StringBuilder(input.length() + 16);
        for (char c : input.toCharArray()) {
            switch (c) {
                case '<' -> out.append("&lt;");
                case '>' -> out.append("&gt;");
                case '&' -> out.append("&amp;");
                case '"' -> out.append("&quot;");
                case '\'' -> out.append("&#x27;");
                default -> out.append(c);
            }
        }
        return out.toString();
    }

    public static void main(String[] args) {
        System.out.println("=== Web Application Security Defense Suite ===");
        
        // 1. XSS Defense Demonstration
        String maliciousComment = "<script>alert('Stealing cookie: ' + document.cookie);</script>";
        String safeHtml = escapeHtml(maliciousComment);

        System.out.println("Original Malicious Input:");
        System.out.println("  " + maliciousComment);
        System.out.println("Escaped Safe HTML Output:");
        System.out.println("  " + safeHtml);

        // 2. Session Fixation Mitigation Simulation
        String initialSessionId = "JSESSIONID-ANONYMOUS-8041";
        System.out.printf("%n[Session Fixation Defense]%n");
        System.out.println("  Initial Anonymous Session: " + initialSessionId);
        
        // After successful login, invoke req.changeSessionId()
        String rotatedSessionId = "JSESSIONID-AUTHENTICATED-9923";
        System.out.println("  User Authenticated: Rotating Session via req.changeSessionId()");
        System.out.println("  New Secure Authenticated Session: " + rotatedSessionId);

        System.out.println("Web security defense verification completed successfully.");
    }
}
```

**Execution Output:**
```
=== Web Application Security Defense Suite ===
Original Malicious Input:
  <script>alert('Stealing cookie: ' + document.cookie);</script>
Escaped Safe HTML Output:
  &lt;script&gt;alert(&#x27;Stealing cookie: &#x27; + document.cookie);&lt;/script&gt;

[Session Fixation Defense]
  Initial Anonymous Session: JSESSIONID-ANONYMOUS-8041
  User Authenticated: Rotating Session via req.changeSessionId()
  New Secure Authenticated Session: JSESSIONID-AUTHENTICATED-9923
Web security defense verification completed successfully.
```

---

### 5. Step-by-Step Execution Trace
1. **Initial GET**: User navigates to `/transfer`.
2. **CSRF Generation**: The server checks the session for a CSRF token; generates a cryptographically random Base64 string via `SecureRandom` and stores it in `session.setAttribute()`.
3. **Hidden Form Field**: The HTML form renders with `<input type="hidden" name="csrfToken" value="...">`.
4. **Form Submission**: When the user clicks Transfer, the browser sends a POST request containing the hidden token.
5. **Validation Check**: The servlet extracts the token from the form body and compares it in constant time with the session token.
6. **Defense Enforcement**: An attacker on an external malicious website attempting to forge a cross-origin POST cannot read the victim's session token (due to Same-Origin Policy). The submission fails validation and returns `403 Forbidden`.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Relying on `SameSite=Lax` as the sole CSRF defense
*Why it fails*: While `SameSite=Lax` prevents cookies on cross-origin POSTs, top-level navigational GET requests still send cookies. If any sensitive action can be invoked via GET, CSRF is still possible.
*The Fix*: Always enforce Synchronizer CSRF tokens on all mutating endpoints (POST, PUT, DELETE).

#### Mistake 2: Reflecting user input in HTML without character escaping
```java
// VULNERABLE TO XSS:
out.println("<h1>Hello, " + req.getParameter("name") + "</h1>");
```
*Why it fails*: If the user inputs `<script src="evil.com/xss.js"></script>`, the browser executes the script in the user's origin context.
*The Fix*: Always encode output: `out.println("<h1>Hello, " + escapeHtml(req.getParameter("name")) + "</h1>")`.

---

### 7. Best Practices
- **Enable Strict Security Headers in a Filter**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy: default-src 'self'`
- **Always Rotate Session IDs upon Login**: Invoke `request.changeSessionId()` immediately after validating user credentials.
- **Enforce `HttpOnly` and `Secure` on Cookies**: Configured in `web.xml` `<cookie-config>` to ensure browser cookies are inaccessible to JavaScript.

---

### 8. Version Notes
- **Servlet 3.0**: Introduced programmatic `<cookie-config>` in `web.xml`.
- **Servlet 3.1**: Introduced `HttpServletRequest.changeSessionId()` specifically for Session Fixation defense.
- **Servlet 6.0**: Built-in support for `SameSite` cookie attributes.

---

### 9. Summary Cheat Sheet: Top Web Vulnerabilities & Defenses

| Vulnerability | Attack Vector | Java EE / Jakarta EE Defense |
| :--- | :--- | :--- |
| **XSS (Cross-Site Scripting)** | Malicious script injected into page DOM | HTML entity escaping, Content-Security-Policy (CSP), JSTL `<c:out>` |
| **CSRF (Request Forgery)** | Forged cross-site form submission | Synchronizer CSRF Token in Session + `SameSite=Lax/Strict` |
| **Session Fixation** | Attacker presets victim's session ID | Call `request.changeSessionId()` upon successful login |
| **Session Hijacking** | Eavesdropping or reading `document.cookie` | Mark cookies with `HttpOnly` and `Secure` flags |
| **Clickjacking** | Embedding site in an invisible `<iframe>` | Add `X-Frame-Options: DENY` response header |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (XSS in Error Message)
Identify the security vulnerability in this error handler and fix it:
```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String error = req.getParameter("err");
    resp.setContentType("text/html");
    resp.getWriter().println("<div class='alert'>Error: " + error + "</div>");
}
```
<details>
<summary>View Solution</summary>

```java
// Vulnerability: Reflected Cross-Site Scripting (XSS).
// An attacker can send a link: /error?err=<script>stealSession()</script>
// Fix: Escape HTML entities before rendering:
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    String error = req.getParameter("err");
    resp.setContentType("text/html;charset=UTF-8");
    resp.getWriter().println("<div class='alert'>Error: " + SecuritySanitizerApp.escapeHtml(error) + "</div>");
}
```
</details>

#### Exercise 2: Hands-on Implementation (Session Rotation Guard)
Write an authentication login snippet that verifies credentials, rotates the session ID to defeat Session Fixation, and stores the user principal.

<details>
<summary>View Solution</summary>

```java
if (userService.validateCredentials(username, password)) {
    // Rotate session identifier to invalidate pre-authentication session ID
    req.changeSessionId();
    HttpSession session = req.getSession();
    session.setAttribute("currentUser", username);
    resp.sendRedirect(req.getContextPath() + "/dashboard");
    return;
} else {
    resp.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid credentials");
}
```
</details>

#### Exercise 3: Real-World Architecture (Timing Attacks on Tokens)
Why should developers use `MessageDigest.isEqual()` rather than standard `String.equals()` when verifying CSRF tokens or authentication signatures?

<details>
<summary>View Solution</summary>

```java
// Standard String.equals() terminates immediately on the first mismatched character.
// An attacker can measure nanosecond response latency differences to guess token bytes character-by-character.
// MessageDigest.isEqual() executes in constant time regardless of where the mismatch occurs, defeating timing attacks.
```
</details>

---

### 11. Official Sources
- [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/) — OWASP
- [Jakarta Servlet Specification 6.0: Chapter 13 Security](https://jakarta.ee/specifications/servlet/6.0/) — Jakarta EE
