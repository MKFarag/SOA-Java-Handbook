---
id: topic-79
slug: the-web-mvc-pattern
topicNumber: 79
title: The Web Model-View-Controller (MVC) Pattern
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Enterprise Web Applications & Data Flow
versionBadge: Jakarta EE 10
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: Model-View-Controller architectural separation in server-side Java,
  Front Controller dispatching, and request-scoped model binding.
prerequisites:
  - 'Topic 70: HttpServletRequest & HttpServletResponse Processing'
  - 'Topic 72: Request Dispatching: Forward, Include & Redirect'
  - 'Topic 78: Expression Language (EL) & JSTL Core Tags'
---

## Overview
The Model-View-Controller (MVC) pattern separates an enterprise web application into three distinct architectural tiers: the Controller (`HttpServlet`) handles HTTP input and flow control, the Model (domain entities and service DAOs) encapsulates business logic and data persistence, and the View (JSP templates with EL/JSTL) renders output representation.

---

## Architectural Flow: Jakarta EE MVC

```
Browser                 Controller (Servlet)        Model (Service/DAO)       View (JSP)
   │                             │                           │                     │
   │─── 1. HTTP Request ────────>│                           │                     │
   │    (/products?cat=books)    │── 2. Invoke Business Logic│                     │
   │                             │      getProducts("books")>│                     │
   │                             │<── 3. Return Model Data ──│                     │
   │                             │       List<Product>       │                     │
   │                             │                                                 │
   │                             │── 4. Bind to Request Scope: req.setAttribute()  │
   │                             │── 5. RequestDispatcher.forward() ──────────────>│
   │                             │                                                 │ Evaluates EL
   │<── 6. Rendered HTML Response──────────────────────────────────────────────────│
```

---

## Tier Responsibilities Matrix

| Component | Technology | Allowed Operations | Strictly Forbidden |
| :--- | :--- | :--- | :--- |
| **Model** | Plain Java Classes, POJOs, Records, DAOs | Database access, validation logic, entity persistence | Direct HTTP imports (`HttpServletRequest`, HTML generation) |
| **View** | JSP with EL & JSTL Core tags | Reading attributes, formatting dates/currencies, loops | Java code scriptlets (`<% %>`), JDBC queries, business logic |
| **Controller**| `HttpServlet` / Filter | Parse input params, call services, select view, forward/redirect | Generating raw HTML strings via `PrintWriter`, business logic |

---

## Production Implementation: Controller & Model Binding

```java
package com.example.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

// Model Record
record AccountSummary(String accountId, String holderName, double balance) {}

@WebServlet("/account/details")
public class AccountController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String accountId = req.getParameter("id");

        if (accountId == null || accountId.isBlank()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing account identifier.");
            return;
        }

        // Delegate to Service/Model tier
        AccountSummary account = new AccountSummary(accountId, "Enterprise Corp", 45892.50);

        // Bind model to request scope
        req.setAttribute("account", account);

        // Forward to View located behind protected WEB-INF boundary
        req.getRequestDispatcher("/WEB-INF/views/account-details.jsp").forward(req, resp);
    }
}
```

---

## Common Pitfalls & Architectural Antipatterns

- **Model-in-View Leakage:**
  Executing database queries directly inside JSP files via scriptlets violates MVC. It bypasses transaction boundaries, prevents connection pool cleanup on exceptions, and makes automated testing impossible.
- **Bypassing the Controller:**
  Placing JSP views in the public web root allows clients to access them directly via URL (`/views/account.jsp`), bypassing the Controller. The view loads without required request attributes, resulting in broken pages or `NullPointerException`. Always store views under `WEB-INF/views/`.
- **Overloading Controllers with Business Logic:**
  Placing SQL queries and calculation algorithms directly inside `doGet()` or `doPost()` couples web transport with business logic. Controllers should only extract input, delegate to services, and select views.

---

## Verification & Practice

**Question:** Why must JSP views in an MVC application be stored under the `/WEB-INF/` directory rather than the public root of the WAR file?

**Explanation:** The servlet specification dictates that containers must reject all direct client HTTP requests to `/WEB-INF/` with a 404 or 403 status. This guarantees that views can only be rendered via internal server-side dispatching (`RequestDispatcher.forward()`) originating from a Controller servlet, ensuring business validation and model population always occur first.

---

## Practice

### Q: In the server-side Java MVC architecture, what are the distinct responsibilities of the Controller, Model, and View?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** The Controller (Servlet) receives the incoming HTTP request, validates input, calls business services, and places resulting domain data into request scope. The Model represents business entities and services containing data and logic. The View (JSP or template) reads data from request attributes and renders the presentation HTML for the client without performing business calculations.
</details>
