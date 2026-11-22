---
id: topic-77
slug: jsp-architecture-syntax-and-implicit-objects
topicNumber: 77
title: 'JSP Architecture, Syntax & Implicit Objects'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 20
sectionTitle: Server-Side Rendering with JSP & JSTL
versionBadge: Jakarta Pages 3.1
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: JavaServer Pages translation lifecycle into HttpJspPage servlets, directive syntax, scriptlet elimination, and the 9 implicit runtime objects.
prerequisites:
  - 'Topic 69: Servlet Lifecycle & Threading Model'
  - 'Topic 70: HttpServletRequest & HttpServletResponse Processing'
---

## Overview
Jakarta Pages (formerly JSP) is a server-side templating technology that combines static markup (HTML/XML) with dynamic Java components. The container's Jasper compiler translates `.jsp` files into standard `HttpServlet` source files (`_jsp.java`) and compiles them to bytecode on first access, exposing 9 implicit runtime objects.

---

## JSP Compilation Lifecycle

```
Browser Request: /index.jsp
          │
          ▼
    Container Checks
    Is _index_jsp.class compiled & up-to-date?
     ├── NO ──> [Translation Phase]: Jasper converts .jsp -> _index_jsp.java
     │          [Compilation Phase]: javac compiles .java -> _index_jsp.class
     └── YES ─> [Execution Phase]: Container invokes _jspService(req, res)
```

---

## The 9 Implicit Runtime Objects

| Object | Underlying Type | Scope | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **`request`** | `jakarta.servlet.http.HttpServletRequest` | Request | Parameters, headers, cookies, request attributes |
| **`response`** | `jakarta.servlet.http.HttpServletResponse`| Page | Response headers, status codes, cookies |
| **`pageContext`**| `jakarta.servlet.jsp.PageContext` | Page | Context aggregator; provides access to all scopes |
| **`session`** | `jakarta.servlet.http.HttpSession` | Session | User conversational state across multiple requests |
| **`application`**| `jakarta.servlet.ServletContext` | Application | Context parameters, app-wide shared state |
| **`out`** | `jakarta.servlet.jsp.JspWriter` | Page | Buffered character output stream to client |
| **`config`** | `jakarta.servlet.ServletConfig` | Page | Servlet initialization parameters for the JSP |
| **`page`** | `java.lang.Object` (this) | Page | Self-reference to current translated servlet instance |
| **`exception`** | `java.lang.Throwable` | Page | Available only if `<%@ page isErrorPage="true" %>` |

---

## JSP Syntax Elements Reference

| Syntax Element | Markup Syntax | Translated Equivalent in `_jsp.java` | Production Status |
| :--- | :--- | :--- | :--- |
| **Directive** | `<%@ page import="java.util.List" %>` | Java package imports / page settings | **Standard** |
| **Include Directive**| `<%@ include file="nav.jsp" %>` | Static copy-paste of code at translation time | **Standard** |
| **Expression** | `<%= user.getName() %>` | `out.print(user.getName());` | Discouraged (use EL `${user.name}`) |
| **Scriptlet** | `<% int x = 10; %>` | Placed directly inside `_jspService()` body | **Forbidden Anti-Pattern** |
| **Declaration** | `<%! private int counter = 0; %>` | Placed as **instance variable** in servlet class | **Dangerous** (Thread safety bug) |

---

## Production Implementation: JSP View Template

```html
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" session="false" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Order Summary</title>
</head>
<body>
    <h1>Order #${order.id}</h1>
    <p>Customer: ${order.customerName}</p>

    <table>
        <thead>
            <tr><th>Item</th><th>Price</th></tr>
        </thead>
        <tbody>
            <c:forEach var="item" items="${order.items}">
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
</body>
</html>
```

---

## Common Pitfalls & Antipatterns

- **Using Scriptlet Declarations (`<%! %>`) for Business State:**
  Variables declared inside `<%! %>` become instance variables of the generated servlet class. Because Tomcat serves multiple concurrent requests using one servlet instance, state declared here is shared across all concurrent users, causing severe data leakage bugs.
- **Unchecked Scriptlet Code in Views:**
  Embedding raw Java logic inside `<% ... %>` scriptlets violates MVC separation of concerns, makes code untestable via JUnit, and frequently exposes applications to Cross-Site Scripting (XSS). Always use Expression Language (EL) and JSTL.
- **Default Session Allocation in JSP:**
  By default, JSPs allocate an `HttpSession` automatically (`session="true"`). For public landing pages or read-only REST views, declare `<%@ page session="false" %>` to prevent memory exhaustion from search engine crawler sessions.

---

## Verification & Practice

**Question:** An engineer changes a JSP file on a production server, but users continue seeing the old page content. What causes this in Tomcat's Jasper engine?

**Explanation:** In production configurations, Tomcat's Jasper servlet parameter `development` is set to `false`, disabling automatic modification checks on every request for performance. The compiled `_jsp.class` in Tomcat's `work/` directory is cached. To apply changes, either trigger a redeploy, touch the WAR file, or delete the cached `.class` file inside the `work/` folder.
