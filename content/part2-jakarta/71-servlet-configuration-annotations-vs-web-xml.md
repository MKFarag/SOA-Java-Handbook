---
id: topic-71
slug: servlet-configuration-annotations-vs-web-xml
topicNumber: 71
title: 'Servlet Configuration: @WebServlet vs web.xml'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 18
sectionTitle: Servlet API Architecture & Request Handling
versionBadge: Jakarta Servlet 6.0
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: Modern declarative @WebServlet metadata vs deployment descriptor web.xml configurations, init-param injection, loadOnStartup ordering, and precedence mechanics.
prerequisites:
  - 'Topic 61: Annotations & Metadata'
  - 'Topic 69: Servlet Lifecycle & Threading Model'
---

## Overview
Servlets can be declared and configured either declaratively using the `@WebServlet` annotation (introduced in Servlet 3.0) or centrally through the XML deployment descriptor (`WEB-INF/web.xml`). The deployment descriptor takes precedence over annotations and enables dynamic deployment modifications without recompiling application bytecode.

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
