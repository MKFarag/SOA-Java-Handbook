---
id: topic-75
slug: jsp-syntax-elements
topicNumber: 75
title: 'JSP Syntax Elements: Directives, Scriptlets & Expressions'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 21
sectionTitle: JavaServer Pages (JSP) & Templating
versionBadge: Jakarta Pages 3.1 / EE 10
difficulty: Intermediate
readingTime: 11 min read
shortDescription: >-
  Master the core syntax tags: configure page directives (<%@ page %>),
  understand the thread-safety risks of declarations (<%! %>), and scriptlets vs
  expressions (<%= %>).
prerequisites:
  - 'Topic 74: JSP Architecture & Translation Lifecycle'
relevanceLevel: OPTIONAL / LEGACY
---
# JSP Syntax Elements: Directives, Scriptlets & Expressions

> 🏛️ **Roadmap Seal:** **`[OPTIONAL / LEGACY]`** — *Historical / legacy enterprise tech. Safely skip unless maintaining legacy enterprise systems.*

### 1. What It Is and Why It Exists
To provide dynamic functionality, Jakarta Pages defines a concise set of syntax delimiters that tell the Jasper compiler how to handle different segments of a `.jsp` file. Each element instructs Jasper where to place the code in the generated servlet:
1. **Directives (`<%@ ... %>`)**: Messages to the JSP container that apply globally to the page (page encoding, imported Java packages, tag libraries, static file inclusion).
2. **Declarations (`<%! ... %>`)**: Class-level variables and methods placed **outside** the `_jspService()` method directly into the generated servlet class body.
3. **Scriptlets (`<% ... %>`)**: Java statements executed sequentially **inside** the `_jspService()` method on every request.
4. **Expressions (`<%= ... %>`)**: Java expressions evaluated and automatically converted to text passed to `out.print()`. No trailing semicolon is permitted.
5. **JSP Comments (`<%-- ... --%>`)**: Server-side comments ignored during compilation.

**Real-World Analogy:**
Imagine filling out a government tax form:
- Directives (`<%@ %>`) are the fine-print instructions at the top: language rules and which currency is used.
- Declarations (`<%! %>`) are the permanent account numbers printed on the stationery.
- Scriptlets (`<% %>`) are the calculations you perform on scrap paper.
- Expressions (`<%= %>`) are the final calculated numbers written into the official answer boxes.

---

### 2. Prerequisites
- **JSP Architecture & Translation (Topic 74)**: Understanding how Jasper transforms syntax tags into `_jspService()`.

---

### 3. Syntax Breakdown

| Syntax Element | Delimiter | Where Placed in Generated Servlet | Typical Usage |
| :--- | :--- | :--- | :--- |
| **Page Directive** | `<%@ page ... %>` | Class imports and container headers | `<%@ page import="java.util.List" %>` |
| **Include Directive** | `<%@ include file="..." %>` | Translation-time text merger | Merges static header/footer before compile |
| **Declaration** | `<%! ... %>` | Class level (outside `_jspService`) | `<%! private int counter = 0; %>` |
| **Scriptlet** | `<% ... %>` | Local statements inside `_jspService` | `<% String id = request.getParameter("id"); %>` |
| **Expression** | `<%= ... %>` | Wrapped in `out.print(...)` | `<%= Math.round(price) %>` (No semicolon!) |
| **JSP Comment** | `<%-- ... --%>` | Stripped entirely | Developer notes hidden from client |

---

### 4. Runnable Code Examples

#### Example 1: Syntax Elements Live Demonstration (Basic)
Demonstrates class declarations, local scriptlets, expressions, and directives.

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" import="java.time.LocalTime" %>
<%! 
    // Declaration: Becomes a field in the servlet class (Shared across threads!)
    private int globalPageViews = 0;
    private synchronized int incrementViews() {
        return ++globalPageViews;
    }
%>
<!DOCTYPE html>
<html>
<head><title>JSP Syntax Breakdown</title></head>
<body>
    <h1>Jakarta Pages Syntax Demonstration</h1>
    <%-- JSP Server-Side Comment --%>
    <%
        // Scriptlet: Local variable inside _jspService() (Thread-safe)
        String clientIp = request.getRemoteAddr();
        LocalTime now = LocalTime.now();
        int views = incrementViews();
    %>
    <p>Client IP Address: <strong><%= clientIp %></strong></p>
    <p>Current Time: <em><%= now %></em></p>
    <p>Total Page Hits (All Users): <strong><%= views %></strong></p>
</body>
</html>
```

**Expected HTTP Response Output:**
```http
HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
<head><title>JSP Syntax Breakdown</title></head>
<body>
    <h1>Jakarta Pages Syntax Demonstration</h1>
    <p>Client IP Address: <strong>127.0.0.1</strong></p>
    <p>Current Time: <em>21:05:30.142</em></p>
    <p>Total Page Hits (All Users): <strong>1</strong></p>
</body>
</html>
```

---

#### Example 2: Static Include Directive vs Dynamic Include (Realistic)
Demonstrates translation-time inclusion (`<%@ include %>`) for static components vs request-time inclusion (`<jsp:include>`).

```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head><title>Modular Layout Demo</title></head>
<body>
    <%-- Static Translation-time include: Inlines file BEFORE compilation --%>
    <%@ include file="/WEB-INF/fragments/header.html" %>

    <main>
        <h2>Main Product Catalog Content</h2>
        <% 
            String[] categories = {"Hardware", "Software", "Cloud"};
            for (String cat : categories) {
        %>
            <div class="category-card"><%= cat %></div>
        <% } %>
    </main>

    <%-- Dynamic Request-time include: Dispatches at runtime --%>
    <jsp:include page="/WEB-INF/fragments/footer.jsp" />
</body>
</html>
```

---

### 5. Step-by-Step Execution Trace
1. **Compilation**: Jasper inspects `<%! ... %>` declarations and places `globalPageViews` as an instance field of `syntax_elements_jsp`.
2. **Page Directive Processing**: Jasper imports `java.time.LocalTime` and configures `response.setContentType("text/html;charset=UTF-8")`.
3. **Service Execution**: When `_jspService()` executes:
   - Evaluates `<% ... %>` scriptlets, creating local method variables `clientIp` and `now` on the thread stack.
   - Evaluates `<%= ... %>` expressions, converting the returned object to a String and calling `out.print()`.
4. **HTML Output**: The generated markup streams across the TCP connection to the user's browser.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Placing a semicolon inside an Expression (`<%= ... %>`)
```jsp
<%-- WRONG: Throws compilation error! --%>
<p>User: <%= user.getName(); %></p>

<%-- CORRECT: Expressions must NOT have trailing semicolons! --%>
<p>User: <%= user.getName() %></p>
```
*Why it fails*: Jasper wraps expressions directly inside `out.print(...)`. If you add a semicolon, it translates to `out.print(user.getName(););`, which is invalid Java syntax.

#### Mistake 2: Storing user-specific state in Declarations (`<%! ... %>`)
```jsp
<%-- CATASTROPHIC RACE CONDITION! --%>
<%! private String currentUser; %>
<%
    currentUser = request.getParameter("user");
%>
```
*Why it fails*: Declarations create class instance fields. Remember that the container creates **only ONE instance** of the translated servlet shared across all concurrent users. Modifying declaration fields causes thread cross-contamination.
*The Fix*: Always declare variables in scriptlets (`<% ... %>`) so they remain thread-safe local stack variables.

---

### 7. Best Practices
- **Prefer Expression Language (EL) over Scriptlets**: Modern Jakarta EE development discourages raw `<% ... %>` scriptlets in favor of `${...}` and JSTL tags.
- **Always Declare Page Encoding**: Always place `<%@ page contentType="text/html;charset=UTF-8" %>` at line 1 of every JSP.

---

### 8. Version Notes
- **JSP 1.2**: Scriptlets, declarations, and expressions established.
- **JSP 2.0**: Discouraged scriptlets in favor of Expression Language (EL).
- **Jakarta Pages 3.1**: Scriptlet support retained for backward compatibility; pure EL recommended.

---

### 9. Summary Cheat Sheet: JSP Elements Syntax

| Tag Syntax | Name | Semicolon Allowed? | Scope |
| :--- | :--- | :--- | :--- |
| `<%@ page ... %>` | Directive | No | Page-wide translation settings |
| `<%! ... %>` | Declaration | **Yes** | Class instance scope (Shared across all threads) |
| `<% ... %>` | Scriptlet | **Yes** | Method local scope (`_jspService`) |
| `<%= ... %>` | Expression | **NO** | Evaluated parameter to `out.print()` |
| `<%-- ... --%>` | JSP Comment | No | Completely stripped by compiler |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (Semicolon in Expression)
Why does this JSP fail to compile with Jasper error "Syntax error on token ';', invalid Expression"?
```jsp
<h1>Hello <%= request.getParameter("name"); %></h1>
```
<details>
<summary>View Solution</summary>

```jsp
// Cause: Semicolons are forbidden in expressions (<%= %>).
// Translated code becomes: out.print(request.getParameter("name"););
// Fix: Remove the semicolon:
<h1>Hello <%= request.getParameter("name") %></h1>
```
</details>

#### Exercise 2: Hands-on Implementation (Safe Declaration Helper)
Write a declaration element defining a helper method `formatPrice(double val)` that formats a number to two decimal places.

<details>
<summary>View Solution</summary>

```jsp
<%! 
    public String formatPrice(double price) {
        return String.format("$%.2f", price);
    }
%>
<p>Discounted Total: <%= formatPrice(49.956) %></p>
```
</details>

#### Exercise 3: Real-World Architecture (Static vs Dynamic Include)
When should you use `<%@ include file="..." %>` vs `<jsp:include page="..." />`?

<details>
<summary>View Solution</summary>

```
1. <%@ include file="..." %> (Static / Translation-time):
   - Merges file contents verbatim BEFORE compilation.
   - Ideal for static HTML snippets, shared variable declarations, or taglib directives.
   - Faster execution because it compiles into a single unified servlet class.

2. <jsp:include page="..." /> (Dynamic / Request-time):
   - Invocations are dispatched via RequestDispatcher.include() at runtime.
   - Target page is compiled as an independent servlet.
   - Ideal for dynamic pages that change frequently or take runtime request parameters.
```
</details>

---

### 11. Official Sources
- [Jakarta Pages Specification 3.1: Chapter 1 Core Syntax](https://jakarta.ee/specifications/pages/3.1/) — Jakarta EE
- [Apache Tomcat Documentation: JSP Syntax Reference](https://tomcat.apache.org/tomcat-10.1-doc/index.html) — Apache Tomcat
