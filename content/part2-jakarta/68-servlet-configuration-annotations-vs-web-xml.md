---
id: topic-68
slug: servlet-configuration-annotations-vs-web-xml
topicNumber: 68
title: 'Servlet Configuration: @WebServlet vs web.xml'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 19
sectionTitle: Servlets Deep Dive
versionBadge: Jakarta EE 10+ / Servlet 6.0
difficulty: Intermediate
readingTime: 11 min read
shortDescription: >-
  Master servlet declaration and routing: compare modern @WebServlet annotations
  against the authoritative web.xml deployment descriptor, URL pattern
  algorithms, and eager startup.
prerequisites:
  - 'Topic 58: Annotations & Metadata'
  - 'Topic 65: Apache Tomcat & The WAR Structure'
  - 'Topic 66: Servlet Lifecycle & Architecture'
---
# Servlet Configuration: @WebServlet vs web.xml

### 1. What It Is and Why It Exists
Before a Servlet container can route an incoming HTTP request (e.g., `GET /catalog/electronics`) to a Java class, it requires a **configuration mapping** that defines:
1. The servlet's logical name.
2. The URL pattern(s) it binds to.
3. Initialization parameters passed to `init(ServletConfig)`.
4. Startup loading priority (`load-on-startup`).

In early Java EE versions (Servlet 1.0 to 2.5), configuration was exclusively managed via the centralized XML deployment descriptor file: `WEB-INF/web.xml`. Starting in Servlet 3.0 (and continued in Jakarta EE 10/11), developers can declare servlets directly in Java source code using the **`@WebServlet`** annotation.

**Real-World Analogy:**
Imagine assigning offices in a corporate tower. In the traditional approach (**`web.xml`**), a central building directory in the lobby lists which department is located in Suite 402. In the modern approach (**`@WebServlet`**), the department mounts an official nameplate directly on their office door. If the central directory and the office door nameplate ever conflict, the central directory (`web.xml`) takes precedence.

---

### 2. Prerequisites
- **Annotations & Metadata (Topic 58)**: Understanding how Java runtime annotations configure frameworks.
- **Apache Tomcat & The WAR Structure (Topic 65)**: Understanding `WEB-INF/web.xml` and the container classpath.
- **Servlet Lifecycle (Topic 66)**: Understanding how `ServletConfig` supplies initialization parameters.

---

### 3. Syntax Breakdown

#### 3.1 Modern Annotation Configuration: `@WebServlet`
```java
@WebServlet(
    name = "ProductCatalogServlet",
    urlPatterns = {"/products", "/catalog/*"},
    loadOnStartup = 1,
    initParams = {
        @WebInitParam(name = "itemsPerPage", value = "20"),
        @WebInitParam(name = "cacheTimeoutSeconds", value = "300")
    }
)
public class ProductCatalogServlet extends HttpServlet {
    // ...
}
```
- **`name`**: The unique logical identifier of the servlet within the web application.
- **`urlPatterns`** (or `value`): Array of URL matching strings routed to this servlet.
- **`loadOnStartup`**: Integer specifying startup order. If $\ge 0$, the container initializes the servlet when Tomcat boots rather than waiting for the first client request. Lower positive numbers initialize first (e.g., `1` before `2`).
- **`initParams`**: Key-value pairs accessible inside `init(ServletConfig)` via `config.getInitParameter("key")`.

#### 3.2 Canonical XML Configuration: `web.xml`
```xml
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                             https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">

    <servlet>
        <servlet-name>ProductCatalogServlet</servlet-name>
        <servlet-class>com.handbook.web.ProductCatalogServlet</servlet-class>
        <init-param>
            <param-name>itemsPerPage</param-name>
            <param-value>25</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>ProductCatalogServlet</servlet-name>
        <url-pattern>/products</url-pattern>
        <url-pattern>/catalog/*</url-pattern>
    </servlet-mapping>
</web-app>
```

#### 3.3 The Four URL Pattern Matching Rules
The Servlet specification defines a strict hierarchy for resolving incoming URIs against registered `urlPatterns`:
1. **Exact Match**: `/login`, `/cart` (Highest Priority)
2. **Prefix Path Match**: `/api/*`, `/catalog/*` (Matches any URI starting with `/catalog/`)
3. **Extension Match**: `*.action`, `*.do`, `*.json` (Matches file extensions anywhere)
4. **Default Servlet**: `/` (Catches all unmatched requests; typically serves static files)

---

### 4. Runnable Code Examples

#### Example 1: Init Parameters and Early Container Boot (Basic)
Demonstrates `@WebInitParam`, `loadOnStartup = 1`, and reading parameters via `ServletConfig`.

```java
package com.handbook.web;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(
    name = "ConfigDemoServlet",
    urlPatterns = {"/config-demo"},
    loadOnStartup = 1,
    initParams = {
        @WebInitParam(name = "defaultPageSize", value = "25"),
        @WebInitParam(name = "environment", value = "Production")
    }
)
public class ConfigDemoServlet extends HttpServlet {

    private int defaultPageSize;
    private String environment;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        String sizeParam = config.getInitParameter("defaultPageSize");
        this.defaultPageSize = sizeParam != null ? Integer.parseInt(sizeParam) : 10;
        this.environment = config.getInitParameter("environment");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.printf("Servlet Name: %s%n", getServletName());
            out.printf("Environment:  %s%n", environment);
            out.printf("Page Size:    %d%n", defaultPageSize);
            out.printf("Context Path: %s%n", getServletContext().getContextPath());
        }
    }
}
```

**Expected HTTP Response Output (`GET /config-demo`):**
```http
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8

Servlet Name: ConfigDemoServlet
Environment:  Production
Page Size:    25
Context Path: /handbook
```

---

#### Example 2: Multi-Mapping and Dynamic Path Decoding (Realistic)
Demonstrates routing multiple distinct URL patterns and decoding path parameters via `getPathInfo()`.

```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(
    name = "MultiMappingServlet",
    urlPatterns = {"/catalog/*", "/product-lookup"}
)
public class MultiMappingServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("text/plain;charset=UTF-8");
        String servletPath = req.getServletPath();
        String pathInfo = req.getPathInfo();
        String queryString = req.getQueryString();

        try (PrintWriter out = resp.getWriter()) {
            out.printf("Servlet Path: %s%n", servletPath);
            out.printf("Path Info:    %s%n", pathInfo != null ? pathInfo : "(none)");
            out.printf("Query String: %s%n", queryString != null ? queryString : "(none)");
            
            if (pathInfo != null && pathInfo.startsWith("/")) {
                String requestedItem = pathInfo.substring(1);
                out.printf("Extracted Item Slug: %s%n", requestedItem);
            }
        }
    }
}
```

**Expected HTTP Response Output (`GET /catalog/electronics/laptops?sort=price`):**
```http
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8

Servlet Path: /catalog
Path Info:    /electronics/laptops
Query String: sort=price
Extracted Item Slug: electronics/laptops
```

---

### 5. Step-by-Step Execution Trace
1. **Container Startup**: Tomcat scans `WEB-INF/classes` for classes annotated with `@WebServlet`.
2. **Descriptor Override**: Tomcat parses `WEB-INF/web.xml`. If `web.xml` declares a servlet with the same name, the XML settings **override** the annotation attributes.
3. **Eager Instantiation**: Because `loadOnStartup = 1` is $\ge 0$, Tomcat immediately creates an instance and invokes `init(ServletConfig)` before accepting any HTTP requests.
4. **URL Routing**: An incoming request for `/catalog/phone` arrives. Tomcat tests URL patterns:
   - Matches prefix pattern `/catalog/*`.
   - Strips the prefix to assign `servletPath = "/catalog"` and `pathInfo = "/phone"`.
5. **Execution**: The container dispatches execution to `doGet()`, where `getPathInfo()` extracts dynamic slug data.

---

### 6. Common Mistakes & Gotchas

#### Mistake 1: Missing leading slash in `urlPatterns`
```java
// WRONG: Throws IllegalArgumentException on startup!
@WebServlet(urlPatterns = {"catalog/*"})

// CORRECT:
@WebServlet(urlPatterns = {"/catalog/*"})
```
*Why it fails*: The Servlet specification requires all path-based URL patterns to start with a leading slash (`/`). Only extension patterns (`*.ext`) do not start with a slash.

#### Mistake 2: Forgetting `super.init(config)`
```java
// DANGEROUS:
@Override
public void init(ServletConfig config) throws ServletException {
    // Forgot super.init(config);
    this.param = config.getInitParameter("key");
}
```
*Why it fails*: If `super.init(config)` is omitted, subsequent calls to `getServletConfig()` or `getServletContext()` return `null` and throw `NullPointerException`.

---

### 7. Best Practices
- **Use `@WebServlet` for Modern Applications**: Keeps routing configuration cohesive with source code.
- **Use `web.xml` for Environment Overrides**: Use `web.xml` when deploying precompiled third-party WARs or when URL mappings change per deployment environment without recompiling Java bytecode.
- **Reserve `loadOnStartup = 1` for Critical Services**: Use eager startup for database connection warm-up or cache preloading.

---

### 8. Version Notes
- **Servlet 2.5 (Java EE 5)**: Centralized `web.xml` was mandatory.
- **Servlet 3.0 (Java EE 6)**: Introduced `@WebServlet`, `@WebInitParam`, and `metadata-complete="false"`.
- **Servlet 6.0 (Jakarta EE 10)**: Schema updated to `https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd`.

---

### 9. Summary Cheat Sheet: Annotation vs web.xml

| Feature | `@WebServlet` Annotation | `WEB-INF/web.xml` Descriptor |
| :--- | :--- | :--- |
| **Location** | Java source class header | XML file in `WEB-INF/` |
| **Recompile Needed?** | Yes, recompile required | No, edit XML without recompilation |
| **Precedence** | Lower (Overridden by XML) | **Authoritative (Overrides annotations)** |
| **URL Mapping** | `urlPatterns = {"/api/*"}` | `<url-pattern>/api/*</url-pattern>` |
| **Eager Boot** | `loadOnStartup = 1` | `<load-on-startup>1</load-on-startup>` |
| **Init Parameters** | `initParams = {@WebInitParam(...)}` | `<init-param><param-name>...` |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Spot the Bug (Illegal URL Pattern)
Which of the following URL patterns will cause Tomcat to fail web application startup with a deployment exception?
1. `/admin/*`
2. `*.do`
3. `/api/v1/status`
4. `/store/*.html`

<details>
<summary>View Solution</summary>

```
Pattern 4: "/store/*.html" is ILLEGAL.
Reason: The Servlet specification forbids combining path prefixes with extension mappings in a single pattern. A pattern must be either path-based ("/store/*") OR extension-based ("*.html"), but never both.
```
</details>

#### Exercise 2: Hands-on Implementation (Dynamic URL Pattern Router)
Write an annotated servlet `ReportServlet` that initializes at container startup (`loadOnStartup = 2`) and handles all requests ending with `.pdf` or `.csv`.

<details>
<summary>View Solution</summary>

```java
package com.handbook.web;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(
    name = "ReportServlet",
    urlPatterns = {"*.pdf", "*.csv"},
    loadOnStartup = 2
)
public class ReportServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String uri = req.getRequestURI();
        if (uri.endsWith(".pdf")) {
            resp.setContentType("application/pdf");
        } else {
            resp.setContentType("text/csv");
        }
        resp.getWriter().println("Generated Report Data for: " + uri);
    }
}
```
</details>

#### Exercise 3: Real-World Edge Case (metadata-complete)
What does `<web-app metadata-complete="true">` do in `web.xml`?

<details>
<summary>View Solution</summary>

```
When metadata-complete="true" is set in web.xml:
1. The Servlet container completely disables scanning of bytecode annotations (@WebServlet, @WebFilter, @WebListener).
2. Tomcat only registers components explicitly listed in web.xml.
3. This significantly speeds up server startup times in large enterprise applications by skipping class scanner reflection.
```
</details>

---

### 11. Official Sources
- [Jakarta Servlet Specification 6.0: Chapter 8 Annotations](https://jakarta.ee/specifications/servlet/6.0/) — Jakarta EE
- [Apache Tomcat 10.1 Documentation: Deployment Descriptor](https://tomcat.apache.org/tomcat-10.1-doc/appdev/deployment.html) — Apache Tomcat
