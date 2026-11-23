---
id: topic-71
slug: servlet-configuration-annotations-vs-web-xml
topicNumber: 71
title: 'Servlet Configuration: @WebServlet vs web.xml'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 19
sectionTitle: Servlet API Architecture & Request Handling
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: Modern declarative @WebServlet metadata vs deployment descriptor
  web.xml configurations, init-param injection, loadOnStartup ordering, and
  precedence mechanics.
prerequisites:
  - 'Topic 61: Annotations & Metadata'
  - 'Topic 69: Servlet Lifecycle & Threading Model'
---

## Overview
Servlets can be declared and configured either declaratively using the `@WebServlet` annotation (introduced in Servlet 3.0) or centrally through the XML deployment descriptor (`WEB-INF/web.xml`). The deployment descriptor takes precedence over annotations and enables dynamic deployment modifications without recompiling application bytecode.

---

## Master Jakarta Servlet Component Annotations Directory

Modern Jakarta Servlet 6.0 allows declarative configuration of all web components via annotations in package `jakarta.servlet.annotation`. Below is the complete reference matrix of all servlet component annotations.

| Annotation | Applicable Target | Key Attributes | Specification Purpose & Lifecycle Role | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@WebServlet`** | `TYPE` | `name`, `urlPatterns`, `loadOnStartup`, `initParams`, `asyncSupported` | Declares an `HttpServlet` component and binds it to URL patterns with optional initialization parameters. | `@WebServlet(name = "UserServlet", urlPatterns = {"/users/*"}, loadOnStartup = 1)` |
| **`@WebFilter`** | `TYPE` | `filterName`, `urlPatterns`, `servletNames`, `dispatcherTypes`, `asyncSupported` | Declares a `Filter` component intercepting incoming requests or responses before/after servlet execution. | `@WebFilter(urlPatterns = {"/api/*"}, dispatcherTypes = {DispatcherType.REQUEST})` |
| **`@WebListener`** | `TYPE` | `value` | Declares an application lifecycle event listener (e.g. `ServletContextListener`, `HttpSessionListener`). | `@WebListener public class AppBootstrapListener implements ServletContextListener {}` |
| **`@WebInitParam`** | *(Nested in annotations)* | `name`, `value`, `description` | Declares initialization name-value pairs inside `@WebServlet` or `@WebFilter`. | `initParams = {@WebInitParam(name = "timeout", value = "30")}` |
| **`@MultipartConfig`** | `TYPE` | `location`, `maxFileSize`, `maxRequestSize`, `fileSizeThreshold` | Enables multipart/form-data payload parsing on the annotated servlet via `request.getPart(...)`. | `@MultipartConfig(maxFileSize = 10485760L, maxRequestSize = 20971520L)` |
| **`@ServletSecurity`** | `TYPE` | `value` (`@HttpConstraint`), `httpMethodConstraints` | Enforces declarative security constraints, roles, and transport guarantees (SSL/TLS) on servlet paths. | `@ServletSecurity(@HttpConstraint(rolesAllowed = {"ADMIN"}))` |
| **`@HttpConstraint`** | *(Nested in security)* | `value`, `rolesAllowed`, `transportGuarantee` | Defines security constraint applied to all HTTP methods not explicitly overridden. | `@HttpConstraint(transportGuarantee = TransportGuarantee.CONFIDENTIAL)` |
| **`@HttpMethodConstraint`** | *(Nested in security)* | `value` (HTTP verb), `rolesAllowed`, `emptyRoleSemantic` | Enforces distinct role constraints per specific HTTP method (e.g. restrict `POST` to `MANAGER`). | `@HttpMethodConstraint(value = "POST", rolesAllowed = {"MANAGER"})` |

---

## Configuration Comparison Matrix

| Property | `@WebServlet` Annotation | `web.xml` Deployment Descriptor | Precedence Rule |
| :--- | :--- | :--- | :--- |
| **URL Mapping** | `urlPatterns = {"/api/*"}` | `<url-pattern>/api/*</url-pattern>` | `web.xml` overrides annotation |
| **Servlet Name** | `name = "UserServlet"` | `<servlet-name>UserServlet</servlet-name>` | Required in XML, defaults to FQCN in annotation |
| **Load on Startup** | `loadOnStartup = 1` | `<load-on-startup>1</load-on-startup>` | Lower positive integers load earlier |
| **Init Parameters** | `@WebInitParam(name="k", value="v")` | `<init-param><param-name>k</param-name>...` | XML overrides duplicate parameter names |
| **Asynchronous Support**| `asyncSupported = true` | `<async-supported>true</async-supported>` | Defaults to `false` |
| **Recompilation** | Requires recompiling `.class` | No recompile needed; restart / redeploy WAR | N/A |

---

## Production Implementation: Configured Servlet with Init Parameters

```java
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(
    name = "PaymentGatewayServlet",
    urlPatterns = {"/checkout/pay", "/checkout/process"},
    loadOnStartup = 2,
    initParams = {
        @WebInitParam(name = "timeoutSeconds", value = "15"),
        @WebInitParam(name = "retryAttempts", value = "3")
    }
)
public class PaymentGatewayServlet extends HttpServlet {

    private int timeout;
    private int maxRetries;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        this.timeout = Integer.parseInt(config.getInitParameter("timeoutSeconds"));
        this.maxRetries = Integer.parseInt(config.getInitParameter("retryAttempts"));
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("text/plain");
        resp.getWriter().printf("Gateway Ready: timeout=%ds, maxRetries=%d%n", timeout, maxRetries);
    }
}
```

---

## Equivalent Deployment Descriptor: web.xml

```xml
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee" version="6.0">
    <servlet>
        <servlet-name>PaymentGatewayServlet</servlet-name>
        <servlet-class>PaymentGatewayServlet</servlet-class>
        <init-param>
            <param-name>timeoutSeconds</param-name>
            <param-value>30</param-value> <!-- Overrides annotation's 15 -->
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>PaymentGatewayServlet</servlet-name>
        <url-pattern>/checkout/pay</url-pattern>
    </servlet-mapping>
</web-app>
```

---

## Common Pitfalls & Configuration Traps

- **Missing `metadata-complete="false"` with `web.xml`:**
  If `web.xml` defines `metadata-complete="true"`, Tomcat skips classpath scanning for annotations entirely. All `@WebServlet` annotated classes that are not declared in `web.xml` will fail to register with 404 Not Found.
- **Ambiguous URL Patterns:**
  Mapping two different servlets to the exact same URL pattern (e.g., `/catalog`) causes deployment failure with `IllegalArgumentException: The servlets named [A] and [B] are both mapped to the url-pattern [/catalog]`.
- **Negative `loadOnStartup` Values:**
  Setting `loadOnStartup` to a negative number (or omitting it) tells the container to initialize the servlet lazily on the first request rather than during server startup.

---

## Verification & Practice

**Question:** An annotation specifies `timeoutSeconds = 15`, but `web.xml` defines the same parameter with value `30`. What value does `config.getInitParameter("timeoutSeconds")` return at runtime?

**Explanation:** It returns `"30"`. The deployment descriptor (`web.xml`) always takes precedence over annotations, allowing operational engineers to override application parameters in production without modifying source code.

---

## Practice

### Q: If a servlet is declared with both `@WebServlet(urlPatterns = "/orders")` and defined in `web.xml` with `<url-pattern>/api/orders</url-pattern>`, which configuration takes precedence?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** The `web.xml` deployment descriptor strictly overrides bytecode annotations. The Servlet specification dictates that explicit XML configuration takes precedence over annotations, allowing administrators and DevOps teams to reconfigure URL mappings and parameters at deployment time without recompiling Java source code.
</details>
