---
id: topic-79
slug: the-web-mvc-pattern
topicNumber: 79
title: The Web MVC Pattern (Model-View-Controller)
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Production Web Development
versionBadge: Jakarta EE 10+ / Architecture
difficulty: Intermediate
readingTime: 13 min read
shortDescription: >-
  Architect production web applications by separating concerns into Model
  (POJOs), View (JSP templates in WEB-INF), and Controller (Jakarta Servlets).
prerequisites:
  - 'Topic 66: Servlet Lifecycle & Architecture'
  - 'Topic 69: Request Dispatching: Forward, Include & Redirect'
  - 'Topic 77: Expression Language (EL) & JSTL'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 79: The Web MVC Pattern (Model-View-Controller)

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists
The Model-View-Controller (MVC) pattern is an architectural design paradigm that decouples user interface presentation from core business data and routing logic. In Jakarta EE web applications, MVC Model 2 divides responsibility across three discrete components:
- **Model:** Java objects (POJOs, Records, or Entities) representing business state and business domain rules.
- **View:** Server-rendered markup templates (JSP pages, Facelets) that format data into HTML without executing SQL queries or routing decisions.
- **Controller:** Jakarta Servlets (`HttpServlet`) intercepting HTTP requests, parsing parameters, delegating to business services, populating the Model in request scope, and forwarding execution to the View.

### Real-World Analogy
A fine-dining restaurant operates as an MVC system:
- **Controller (The Waiter):** Receives the customer's order (HTTP request), verifies menu availability, passes tickets to the kitchen, and carries finished dishes to the dining table.
- **Model (The Kitchen & Food Ingredients):** Chefs prepare steaks and pasta according to precise recipes, maintaining inventory and temperature standards.
- **View (The Plate & Table Presentation):** The ceramic dish, garnishes, and silver presentation that make the meal visually appealing to the guest. A waiter never cooks raw meat at your table, and a raw steak never serves itself to a customer.

### Why It Exists
In early web architectures (often referred to as MVC Model 1), JSP pages contained raw SQL queries, database connections, and business logic directly inside `<% ... %>` scriptlets. When database schemas changed or UI layouts were redesigned, developers had to rewrite complex, intermingled files. The MVC pattern guarantees clean separation of concerns, enables independent testing, and allows frontend designers and backend engineers to work concurrently without merge conflicts.

---

## 2. Prerequisites
- **Topic 66: Servlet Lifecycle & Architecture:** Understanding how HTTP requests map to `doGet()` and `doPost()`.
- **Topic 69: Request Dispatching:** Understanding `req.getRequestDispatcher().forward(req, resp)`.
- **Topic 77: Expression Language (EL) & JSTL:** Rendering scoped attributes via `${model.property}`.

---

## 3. Syntax Breakdown
```java
// Controller Workflow (Servlet)
@WebServlet("/catalog")
public class CatalogController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        // Step 1: Model retrieval
        List<Product> items = productService.findAll();
        
        // Step 2: Bind Model to Request Scope
        req.setAttribute("products", items);
        
        // Step 3: Forward to View in protected /WEB-INF/
        req.getRequestDispatcher("/WEB-INF/views/catalog.jsp").forward(req, resp);
    }
}
```

### Key Elements Explained
- `@WebServlet("/catalog")`: Registers the Servlet as the front-facing entry point for user requests.
- `req.setAttribute("products", items)`: Attaches the Model collection to the current HTTP request lifecycle.
- `req.getRequestDispatcher("/WEB-INF/views/catalog.jsp")`: Locates the View template safely hidden inside `/WEB-INF/` so clients cannot access it directly via browser URL.
- `.forward(req, resp)`: Server-side dispatch passing the prepared request attributes to the rendering engine.

---

## 4. Runnable Examples

### Example 1: Basic MVC Model POJO and Controller Forward
```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ProductCatalogServlet", urlPatterns = {"/products"})
public class ProductCatalogServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Product> products = List.of(
            new Product(101L, "Mechanical Keyboard", 129.99, 15),
            new Product(102L, "USB-C Dual Dock", 89.50, 42),
            new Product(103L, "Ergonomic Vertical Mouse", 59.00, 8)
        );

        req.setAttribute("productList", products);
        req.setAttribute("pageTitle", "Hardware Inventory Catalog");
        req.getRequestDispatcher("/WEB-INF/views/product-catalog.jsp").forward(req, resp);
    }
}
```

#### Corresponding View (`/WEB-INF/views/product-catalog.jsp`)
```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head><title>${pageTitle}</title></head>
<body>
    <h1>${pageTitle}</h1>
    <table>
        <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th></tr>
        <c:forEach var="item" items="${productList}">
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>$${item.price}</td>
                <td>${item.stockQuantity}</td>
            </tr>
        </c:forEach>
    </table>
</body>
</html>
```

#### Expected Output (Rendered HTML response received by client)
```html
<!DOCTYPE html>
<html>
<head><title>Hardware Inventory Catalog</title></head>
<body>
    <h1>Hardware Inventory Catalog</h1>
    <table>
        <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th></tr>
        <tr><td>101</td><td>Mechanical Keyboard</td><td>$129.99</td><td>15</td></tr>
        <tr><td>102</td><td>USB-C Dual Dock</td><td>$89.50</td><td>42</td></tr>
        <tr><td>103</td><td>Ergonomic Vertical Mouse</td><td>$59.0</td><td>8</td></tr>
    </table>
</body>
</html>
```

---

### Example 2: Realistic MVC Dispatcher and Template Pipeline
```java
package com.handbook.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MvcArchitectureDemo {
    public record CustomerOrder(String orderId, String customer, double total, String status) {}

    public static class OrderController {
        public String handleOrderSummary(String customerFilter, Map<String, Object> requestScope) {
            System.out.println("[Controller] Processing HTTP GET request for orders of: " + customerFilter);
            List<CustomerOrder> databaseOrders = List.of(
                new CustomerOrder("ORD-901", "Alice Smith", 249.50, "SHIPPED"),
                new CustomerOrder("ORD-902", "Bob Jones", 89.00, "PROCESSING"),
                new CustomerOrder("ORD-903", "Alice Smith", 1120.00, "DELIVERED")
            );

            List<CustomerOrder> filtered = new ArrayList<>();
            for (CustomerOrder o : databaseOrders) {
                if (customerFilter == null || o.customer().equalsIgnoreCase(customerFilter)) {
                    filtered.add(o);
                }
            }

            requestScope.put("orders", filtered);
            requestScope.put("totalCount", filtered.size());
            return "/WEB-INF/views/order-summary.jsp";
        }
    }

    public static class JspViewRenderer {
        @SuppressWarnings("unchecked")
        public static String render(String viewPath, Map<String, Object> requestScope) {
            System.out.println("[View] Rendering template from protected path: " + viewPath);
            StringBuilder html = new StringBuilder();
            html.append("<!-- Rendered by Jakarta Pages from ").append(viewPath).append(" -->\n");
            html.append("<div class='order-container'>\n");
            html.append("  <h3>Found ").append(requestScope.get("totalCount")).append(" orders</h3>\n");
            html.append("  <ul>\n");

            List<CustomerOrder> orders = (List<CustomerOrder>) requestScope.get("orders");
            for (CustomerOrder o : orders) {
                html.append("    <li>Order #").append(o.orderId())
                    .append(" - ").append(o.customer())
                    .append(": $").append(o.total())
                    .append(" [").append(o.status()).append("]</li>\n");
            }
            html.append("  </ul>\n</div>");
            return html.toString();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Web MVC Pattern Architecture Demo ===");
        OrderController controller = new OrderController();
        Map<String, Object> requestScope = new HashMap<>();

        String targetView = controller.handleOrderSummary("Alice Smith", requestScope);

        assert targetView.startsWith("/WEB-INF/views/") : "Views must be protected in /WEB-INF/";
        assert requestScope.containsKey("orders") : "Controller must provide Model attributes";

        String htmlOutput = JspViewRenderer.render(targetView, requestScope);
        System.out.println("[Response HTML]:\n" + htmlOutput);
        System.out.println("MVC flow verified: Separation of Model, Controller, and View successful.");
    }
}
```

#### Expected Output
```text
=== Web MVC Pattern Architecture Demo ===
[Controller] Processing HTTP GET request for orders of: Alice Smith
[View] Rendering template from protected path: /WEB-INF/views/order-summary.jsp
[Response HTML]:
<!-- Rendered by Jakarta Pages from /WEB-INF/views/order-summary.jsp -->
<div class='order-container'>
  <h3>Found 2 orders</h3>
  <ul>
    <li>Order #ORD-901 - Alice Smith: $249.5 [SHIPPED]</li>
    <li>Order #ORD-903 - Alice Smith: $1120.0 [DELIVERED]</li>
  </ul>
</div>
MVC flow verified: Separation of Model, Controller, and View successful.
```

---

## 5. Step-by-Step "What Happens When This Runs"
1. **Client Dispatches Request:** Browser issues `GET /products` to the web container (Tomcat).
2. **Container Matches Servlet:** The container checks `@WebServlet` mapping and routes the request thread to `ProductCatalogServlet.doGet()`.
3. **Controller Executes Business Workflow:** The controller invokes business services or database repositories to build Model instances.
4. **Model Placed in Request Scope:** `req.setAttribute("productList", products)` stores reference in the `HttpServletRequest` attribute map.
5. **Forward Handshake:** The controller requests `/WEB-INF/views/product-catalog.jsp` via `RequestDispatcher`.
6. **View Translation & Execution:** The JSP engine executes `_jspService()`, evaluating EL expressions `${item.name}` against request scope.
7. **HTML Delivered:** Rendered markup streams directly into `resp.getOutputStream()`, returning HTTP 200 OK to the client.

---

## 6. Common Mistakes and Solutions

### Mistake 1: Placing JSP files in public document roots
**Wrong Code:**
```java
// Controller
req.getRequestDispatcher("/views/products.jsp").forward(req, resp);
```
**Cause:** If JSP templates reside outside `/WEB-INF/`, clients can bypass the controller by directly requesting `http://localhost:8080/app/views/products.jsp`. In that case, `req.getAttribute("productList")` is null, causing blank screens or `NullPointerException`.
**Solution:** Always place JSP view templates under `/WEB-INF/views/` or `/WEB-INF/jsp/`. Web containers strictly forbid public HTTP requests from addressing resources inside `/WEB-INF/`.

### Mistake 2: Using sendRedirect instead of forward for Views
**Wrong Code:**
```java
req.setAttribute("user", userProfile);
resp.sendRedirect("/profile.jsp"); // Bug: Request scope lost!
```
**Cause:** `sendRedirect()` instructs the browser to issue a completely new HTTP GET request. The previous request and its attributes are discarded.
**Solution:** Use `RequestDispatcher.forward(req, resp)` to preserve request-scoped models across server components.

---

## 7. Best Practices and When NOT to Use It

### Best Practices
- Keep Controllers thin: Servlets should only parse input parameters, trigger validation, delegate to service classes, and route.
- Keep Views pure: Do not write Java scriptlets (`<% %>`) in JSP views; use Expression Language (`${}`) and standard tag libraries.
- Store sensitive view templates inside `/WEB-INF/views/`.

### When NOT to Use It
- Single Page Applications (SPAs) or mobile APIs: When clients (React, Flutter) only consume JSON or Protocol Buffers, use JAX-RS or Spring REST controllers without JSP server-side rendering.

---

## 8. Version Notes
- **Java EE 1.2+ / Servlet 2.2:** MVC Model 2 pattern first established.
- **Jakarta EE 8 / 9 / 10:** Modernized under the `jakarta.servlet` namespace with full annotation support (`@WebServlet`, `@WebFilter`).
- **Status:** Stable enterprise architectural standard.

---

## 9. Summary Cheat Sheet
| Component | Primary Responsibility | Jakarta EE Artifact | Scoping Mechanism |
|---|---|---|---|
| **Model** | Holds data and domain logic | POJO, Record, JPA Entity | Request or Session Scope |
| **View** | Formats and presents HTML | JSP (`/WEB-INF/views/*.jsp`) | Reads EL `${attribute}` |
| **Controller** | Intercepts HTTP, routes, delegates | `HttpServlet` (`@WebServlet`) | Manages RequestDispatcher |

---

## 10. Exercises with Solutions

### Exercise 1: Spot the Architecture Violation
<details>
<summary>View Solution</summary>
**Question:** A developer writes:
```jsp
<%
    Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/db");
    Statement st = conn.createStatement();
    ResultSet rs = st.executeQuery("SELECT * FROM users");
%>
```
inside `users.jsp`. What MVC rule is violated?

**Solution:** This violates the separation of concerns. The View layer should never manage database connections, drivers, or execute SQL queries. Database access belongs in the Model/Repository layer, with the Controller passing clean POJOs to the View via `request.setAttribute()`.
</details>

### Exercise 2: Hands-on Implementation
<details>
<summary>View Solution</summary>
**Question:** Write a Servlet snippet that verifies if a `userId` parameter exists: if null, forward to `/WEB-INF/views/error.jsp`, otherwise fetch `User` and forward to `/WEB-INF/views/profile.jsp`.

**Solution:**
```java
String idParam = req.getParameter("userId");
if (idParam == null || idParam.isBlank()) {
    req.setAttribute("errorMessage", "Missing userId parameter");
    req.getRequestDispatcher("/WEB-INF/views/error.jsp").forward(req, resp);
    return;
}
User user = userService.findById(Long.parseLong(idParam));
req.setAttribute("user", user);
req.getRequestDispatcher("/WEB-INF/views/profile.jsp").forward(req, resp);
```
</details>

### Exercise 3: Real-World Edge Case (Security & View Encapsulation)
<details>
<summary>View Solution</summary>
**Question:** Why do production Jakarta web applications place all JSP view files inside the `/WEB-INF/views/` directory rather than under the public `/webapp` root directory? What security risk occurs if views are placed in the public root?

**Solution:**
Any file placed directly in the web application root (outside `/WEB-INF/`) is directly accessible via a browser URL (e.g., `https://example.com/profile.jsp`).

1. **Bypassing the Controller:** If a user requests `profile.jsp` directly, the Servlet controller never executes. Consequently, authentication checks, validation, and model attribute binding (`req.setAttribute("user", ...)`) never happen, resulting in broken EL expressions or unauthenticated page rendering.
2. **Exposing Sensitive Code:** According to the Jakarta Servlet Specification, the container strictly prohibits client browsers from requesting anything inside `/WEB-INF/` directly (returns HTTP 404). However, server-side dispatching via `req.getRequestDispatcher("/WEB-INF/views/profile.jsp").forward(req, resp)` is fully permitted. This guarantees that views can **only** be rendered through a designated Controller servlet.
</details>

---

## 11. Sources
- [Jakarta Servlet Specification 6.0](https://jakarta.ee/specifications/servlet/6.0/)
- [Jakarta Pages Specification 3.1](https://jakarta.ee/specifications/pages/3.1/)
- [Apache Tomcat Documentation](https://tomcat.apache.org/)
