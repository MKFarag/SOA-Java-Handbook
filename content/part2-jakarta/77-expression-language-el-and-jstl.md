---
id: topic-77
slug: expression-language-el-and-jstl
topicNumber: 77
title: Expression Language (EL) & JSTL Core Tags
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 21
sectionTitle: JavaServer Pages (JSP) & Templating
versionBadge: Jakarta EL 5.0 / JSTL 3.0
difficulty: Intermediate
readingTime: 13 min read
shortDescription: >-
  Write scriptlet-free web views: master Expression Language (${...}) property
  resolution, null-safety, and JSTL core tags (<c:forEach>, <c:if>, <c:choose>,
  <c:out>).
prerequisites:
  - 'Topic 75: JSP Syntax Elements: Directives, Scriptlets & Expressions'
  - 'Topic 76: JSP Implicit Objects & Standard Actions'
---
# Expression Language (EL) & JSTL Core Tags

### 1. What It Is and Why It Exists
Early versions of JSP were plagued by Java scriptlets (`<% ... %>`). Mixing Java control flow (`for`, `if`, `try/catch`) with HTML produced unreadable, fragile markup that was difficult for frontend web designers to edit and prone to `NullPointerException` crashes.

To modernize web presentation, the Jakarta EE community introduced two complementary standards:
1. **Jakarta Expression Language (EL) (`${...}`)**: A concise expression syntax designed to access JavaBeans, collections, maps, and scoped attributes with **automatic null-safety** (expressions evaluating to `null` render as empty strings rather than throwing `NullPointerException`).
2. **Jakarta Standard Tag Library (JSTL Core `<c:...>`)**: Standard XML-style tags that replace raw Java loops (`<c:forEach>`), conditional checks (`<c:if>`, `<c:choose>`), variable declarations (`<c:set>`), and XSS-safe output (`<c:out>`).

Together, EL and JSTL allow building dynamic web templates with **zero raw Java scriptlets**.

**Real-World Analogy:**
Imagine reading a magazine template. Instead of an editor printing raw complex database formulas on the page, the template uses clean placeholders like `{{Subscriber.Name}}` and `{{Issue.Date}}`. The printing machine automatically fills in the blanks and gracefully prints nothing if a subscriber has no middle name, rather than stopping the printing press with a fatal error.

---

### 2. Prerequisites
- **JSP Implicit Objects & Scopes (Topic 76)**: Understanding the 4 attribute scopes (page, request, session, application).
- **OOP Encapsulation & JavaBeans (Topic 19)**: Understanding getter naming conventions (`getName()` $\rightarrow$ `${bean.name}`).

---

### 3. Syntax Breakdown

#### 3.1 Expression Language (EL) Fundamentals
```jsp
<%-- Accessing JavaBean property (Calls user.getUsername()) --%>
${user.username}

<%-- Accessing Map entry (${map['key'] or ${map.key}) --%>
${sessionScope.cart['itemCount']}

<%-- Accessing List / Array index --%>
${products[0].price}

<%-- Safe Navigation & Empty Check --%>
${empty cart ? 'Your cart is empty' : 'Items ready for checkout'}

<%-- Ternary Conditional Operator --%>
${user.active ? 'Active Member' : 'Suspended'}
```

#### 3.2 Key EL Implicit Objects
- **`${pageScope}`**, **`${requestScope}`**, **`${sessionScope}`**, **`${applicationScope}`**: Maps to specific attribute scopes.
- **`${param}`** and **`${paramValues}`**: Maps to HTTP query parameters (`${param.id}`).
- **`${header}`** and **`${headerValues}`**: Maps to HTTP request headers (`${header['User-Agent']}`).
- **`${cookie}`**: Maps to HTTP cookies (`${cookie.theme.value}`).
- **`${initParam}`**: Maps to context initialization parameters in `web.xml`.

#### 3.3 Core JSTL Tag Library (`<%@ taglib prefix="c" uri="jakarta.tags.core" %>`)
- **`<c:out value="${expr}" />`**: Outputs value with **automatic HTML entity escaping** (defends against XSS).
- **`<c:set var="tax" value="${subtotal * 0.08}" scope="request" />`**: Binds a variable into a scope.
- **`<c:if test="${user != null}">`**: Conditional rendering.
- **`<c:choose><c:when test="...">...</c:when><c:otherwise>...</c:otherwise></c:choose>`**: `switch / if-else` equivalent.
- **`<c:forEach items="${list}" var="item" varStatus="status">`**: Loops over collections and arrays.

---

### 4. Runnable Code Examples

#### Example 1: Jakarta Expression Language Evaluator Demo (Basic)
Demonstrates programmatic EL resolution against JavaBeans, Scoped Maps, and empty checks.

```java
package com.handbook.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExpressionLanguageEvaluatorDemo {

    public static Object resolveElProperty(Object target, String property) throws Exception {
        if (target instanceof Map<?, ?> map) {
            return map.get(property);
        }
        String getterName = "get" + Character.toUpperCase(property.charAt(0)) + property.substring(1);
        return target.getClass().getMethod(getterName).invoke(target);
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Jakarta Expression Language (EL) Evaluator ===");
        
        UserProfileBean user = new UserProfileBean("jduke", "duke@oracle.com", 1500, true);
        System.out.println("Resolving EL expressions against JavaBean:");
        System.out.println("  ${user.username}      -> " + resolveElProperty(user, "username"));
        System.out.println("  ${user.email}         -> " + resolveElProperty(user, "email"));
        System.out.println("  ${user.loyaltyPoints} -> " + resolveElProperty(user, "loyaltyPoints"));

        Map<String, Object> sessionScope = new HashMap<>();
        sessionScope.put("theme", "VS Code Dark+");
        sessionScope.put("cartItems", List.of("Spring Boot Book", "Java Concurrency In Practice"));

        System.out.println("\nResolving EL expressions against Scoped Maps:");
        System.out.println("  ${sessionScope.theme} -> " + resolveElProperty(sessionScope, "theme"));
        
        List<?> items = (List<?>) resolveElProperty(sessionScope, "cartItems");
        System.out.println("  ${empty sessionScope.cartItems} -> " + (items == null || items.isEmpty()));
        System.out.println("  ${sessionScope.cartItems[0]}    -> " + items.get(0));

        System.out.println("\nExpression Language evaluation completed successfully.");
    }
}
```

**Execution Output:**
```
=== Jakarta Expression Language (EL) Evaluator ===
Resolving EL expressions against JavaBean:
  ${user.username}      -> jduke
  ${user.email}         -> duke@oracle.com
  ${user.loyaltyPoints} -> 1500

Resolving EL expressions against Scoped Maps:
  ${sessionScope.theme} -> VS Code Dark+
  ${empty sessionScope.cartItems} -> false
  ${sessionScope.cartItems[0]}    -> Spring Boot Book

Expression Language evaluation completed successfully.
```

---

#### Example 2: Clean JSTL Product Catalog View (Realistic)
```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head><title>Product Catalog</title></head>
<body>
    <h1>Store Products</h1>
    
    <%-- Safe text output with XSS escaping --%>
    <p>Logged in as: <c:out value="${user.username}" default="Guest" /></p>

    <c:choose>
        <c:when test="${empty products}">
            <div class="empty-alert">No products available in this category.</div>
        </c:when>
        <c:otherwise>
            <table>
                <thead>
                    <tr><th>#</th><th>Product</th><th>Price</th><th>Status</th></tr>
                </thead>
                <tbody>
                    <c:forEach items="${products}" var="p" varStatus="loop">
                        <tr>
                            <td>${loop.count}</td>
                            <td><c:out value="${p.title}" /></td>
                            <td>$${p.price}</td>
                            <td>
                                <c:if test="${p.inStock}"><span class="badge in-stock">In Stock</span></c:if>
                                <c:if test="${not p.inStock}"><span class="badge out-of-stock">Sold Out</span></c:if>
                            </td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </c:otherwise>
    </c:choose>
</body>
</html>
```

---

### 5. Step-by-Step Execution Trace
1. **EL Evaluation**: The EL resolver encounters `${user.username}`.
2. **Scope Traversal**: Searches `pageScope` $\rightarrow$ `requestScope` $\rightarrow$ `sessionScope` $\rightarrow$ `applicationScope`. Finds the `user` attribute in `requestScope`.
3. **Property Extraction**: Discovers JavaBean getter method `getUsername()` via reflection and invokes it.
4. **Null Safety**: If `user` or `username` is `null`, the expression evaluates to empty text `""` without throwing a `NullPointerException`.
5. **JSTL Loop Iteration**: `<c:forEach>` evaluates `${products}`, wraps it in a standard iterator, and loops once for each element, binding the current item to page-scoped variable `p`.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Using legacy JCP URI for JSTL in Jakarta EE 10
```jsp
<%-- WRONG IN JAKARTA EE 10 / TOMCAT 10.1: --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- CORRECT IN JAKARTA EE 10: --%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
```
*Why it fails*: Jakarta EE 10 updated the standard taglib URI from `http://java.sun.com/jsp/jstl/core` to `jakarta.tags.core`. Using the old URI causes Jasper to fail with "Tag library not found".

#### Mistake 2: Missing getter method for EL properties
```jsp
<p>Total: ${order.totalPrice}</p> <%-- PropertyNotFoundException! --%>
```
*Why it fails*: EL requires strict JavaBean getter conventions. If the class declares `double totalPrice;` but forgot `public double getTotalPrice()`, EL throws `PropertyNotFoundException`.
*The Fix*: Always declare public getters matching JavaBean specifications.

---

### 7. Best Practices
- **Strictly Disallow Scriptlets**: You can enforce a scriptlet-free policy in `web.xml`:
  ```xml
  <jsp-config>
      <jsp-property-group>
          <url-pattern>*.jsp</url-pattern>
          <scripting-invalid>true</scripting-invalid>
      </jsp-property-group>
  </jsp-config>
  ```
- **Always Output User Input via `<c:out>`**: Prevents Reflected XSS attacks by automatically converting `<`, `>`, and `&` to HTML entity equivalents.

---

### 8. Version Notes
- **EL 1.0**: Introduced in JSP 2.0.
- **Jakarta EL 5.0 (Jakarta EE 10)**: Standalone specification; added lambda expressions in EL, method invocations with arguments `${calc.multiply(a, b)}`, and stream operations.
- **Jakarta Standard Tag Library 3.0**: Migrated taglib URI to `jakarta.tags.core`.

---

### 9. Summary Cheat Sheet: Core JSTL Tags

| JSTL Tag | Attribute | Purpose |
| :--- | :--- | :--- |
| `<c:out>` | `value="${expr}"` | Escapes HTML entities and renders output |
| `<c:set>` | `var="x" value="..." scope="..."` | Binds variable to specified scope |
| `<c:remove>` | `var="x" scope="..."` | Removes variable from scope |
| `<c:if>` | `test="${condition}"` | Simple conditional execution |
| `<c:choose>` | Parent container | `switch / if-else` structure |
| `<c:when>` | `test="${condition}"` | `case / if` branch inside `<c:choose>` |
| `<c:otherwise>` | Default branch | `default / else` branch inside `<c:choose>` |
| `<c:forEach>` | `items="${coll}" var="x"` | Iterates over arrays, lists, maps, collections |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (EL Null Check)
Why is `test="${cart != null && cart.size() > 0}"` worse than `test="${not empty cart}"` in Expression Language?
<details>
<summary>View Solution</summary>

```
The "empty" operator in EL is specifically designed for collections:
1. It automatically checks if cart is null.
2. If non-null, it checks if the collection, array, or string is empty (size == 0 or length == 0).
3. Using ${not empty cart} is concise, idiomatic, and completely immune to NullPointerException.
```
</details>

#### Exercise 2: Hands-on Implementation (Safe User Welcome Banner)
Write a JSP snippet using JSTL that displays `<p>Welcome, [Username]!</p>` if logged in, or `<a href="/login">Please Sign In</a>` if anonymous, with complete XSS escaping.

<details>
<summary>View Solution</summary>

```jsp
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:choose>
    <c:when test="${not empty sessionScope.currentUser}">
        <p>Welcome, <c:out value="${sessionScope.currentUser.username}" />!</p>
    </c:when>
    <c:otherwise>
        <a href="<c:url value='/login'/>">Please Sign In</a>
    </c:otherwise>
</c:choose>
```
</details>

#### Exercise 3: Real-World Architecture (Bracket vs Dot Operator)
When is `${user['first-name']}` required instead of `${user.first-name}`?

<details>
<summary>View Solution</summary>

```
1. When property names contain hyphens or special characters: ${user.first-name} is evaluated as subtraction (${user.first minus name})!
   Bracket notation ${user['first-name']} treats the property name as an exact literal string key.
2. When property names are dynamic: ${user[propertyName]}.
```
</details>

---

### 11. Official Sources
- [Jakarta Expression Language Specification 5.0](https://jakarta.ee/specifications/expression-language/5.0/) — Jakarta EE
- [Jakarta Standard Tag Library Specification 3.0](https://jakarta.ee/specifications/tags/3.0/) — Jakarta EE
