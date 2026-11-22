---
id: topic-78
slug: expression-language-el-and-jstl
topicNumber: 78
title: Expression Language (EL) & JSTL Core Tags
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 21
sectionTitle: Server-Side Rendering with JSP & JSTL
versionBadge: Jakarta Tags 3.0 / EL 5.0
difficulty: Intermediate
readingTime: 9 min read
shortDescription: >-
  Reference: Expression Language syntax (${expr}), scope resolution hierarchy
  (page -> request -> session -> application), and JSTL core tags (c:if,
  c:forEach, c:choose, c:out).
prerequisites:
  - 'Topic 77: JSP Architecture, Syntax & Implicit Objects'
---

## Overview
Expression Language (EL) and Jakarta Standard Tag Library (JSTL) eliminate Java scriptlet code from server-side templates. EL provides concise navigation of JavaBeans properties and collections using `${expression}` syntax with automatic null-safe evaluation and scope traversal, while JSTL provides structured conditional branching and iteration tags.

---

## EL Automatic Scope Resolution Hierarchy

When evaluating `${user}`, EL searches scopes in order until the first non-null match is encountered:

```
1. pageScope.get("user")         (Current JSP page only)
       │ (if null)
       ▼
2. requestScope.get("user")      (Current HTTP request dispatch)
       │ (if null)
       ▼
3. sessionScope.get("user")      (Current client HttpSession)
       │ (if null)
       ▼
4. applicationScope.get("user")  (Global ServletContext)
       │ (if null)
       ▼
Returns null (renders empty string "" without NullPointerException)
```

---

## JSTL Core Tags Reference

| Tag | Primary Attributes | Description |
| :--- | :--- | :--- |
| **`<c:out>`** | `value`, `default`, `escapeXml` | Prints expression with **automatic XML/HTML escaping** (XSS defense) |
| **`<c:if>`** | `test`, `var`, `scope` | Evaluates boolean expression; renders body if `true` |
| **`<c:choose>`** | *(Container)* | Multi-branch conditional parent (similar to Java switch) |
| **`<c:when>`** | `test` | Evaluated branch inside `<c:choose>` |
| **`<c:otherwise>`**| *(None)* | Default fallback branch inside `<c:choose>` |
| **`<c:forEach>`**| `items`, `var`, `varStatus` | Iterates over arrays, `Collection`, `Iterator`, `Map` |
| **`<c:set>`** | `var`, `value`, `scope` | Binds an evaluated value into a designated scope |

---

## Production Implementation: JSTL Core Processing

```html
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<!DOCTYPE html>
<html>
<head><title>User Directory</title></head>
<body>

    <!-- Secure text printing with HTML escaping -->
    <h2>Welcome, <c:out value="${currentUser.name}" default="Guest"/></h2>

    <!-- Multi-way conditional rendering -->
    <c:choose>
        <c:when test="${empty userList}">
            <p>No active users found.</p>
        </c:when>
        <c:otherwise>
            <table>
                <tr><th>#</th><th>Name</th><th>Role</th><th>Status</th></tr>
                <c:forEach var="u" items="${userList}" varStatus="status">
                    <tr class="${status.count % 2 == 0 ? 'even' : 'odd'}">
                        <td>${status.count}</td>
                        <td><c:out value="${u.name}"/></td>
                        <td>${u.role}</td>
                        <td>
                            <c:if test="${u.active}">
                                <span class="badge-active">ACTIVE</span>
                            </c:if>
                        </td>
                    </tr>
                </c:forEach>
            </table>
        </c:otherwise>
    </c:choose>

</body>
</html>
```

---

## Common Pitfalls & Security Traps

- **Cross-Site Scripting (XSS) via Raw EL Output:**
  Using bare `${userInput}` outputs unescaped HTML. If `userInput` contains `<script>alert(1)</script>`, the script executes in the user's browser. Always wrap user-supplied input in `<c:out value="${userInput}"/>` or configure global EL escaping.
- **The Empty Keyword Semantics:**
  The EL `empty` operator returns `true` for: `null`, empty string `""`, empty `Collection` (`isEmpty() == true`), empty `Map`, and zero-length array. It does **not** evaluate numbers; `${empty 0}` evaluates to `false`.
- **Mixing Up URI Namespaces in Jakarta EE:**
  Using the legacy Java EE URI `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>` in Jakarta EE 10+ results in `Cannot find the tag library descriptor`. Use the modern Jakarta URI: `uri="jakarta.tags.core"`.

---

## Verification & Practice

**Question:** If both `request.setAttribute("tier", "GOLD");` and `session.setAttribute("tier", "PLATINUM");` are set, what value does `${tier}` evaluate to in the JSP?

**Explanation:** It evaluates to `"GOLD"`. Following the EL scope resolution order (`page` -> `request` -> `session` -> `application`), the request scope is evaluated before the session scope. To explicitly target the session attribute, use `${sessionScope.tier}`.

---

## Practice

### Q: How does Jakarta Expression Language (EL) handle `null` properties compared to raw Java code?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** In raw Java, calling a method or property on a null reference throws a `NullPointerException`. In Jakarta EL (`${user.address.street}`), EL gracefully coerces `null` references into empty output (`""`) rather than crashing the page rendering, allowing clean view logic without defensive null-checking boilerplate.
</details>
