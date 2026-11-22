---
id: topic-66
slug: the-great-transition-java-ee-to-jakarta-ee
topicNumber: 66
title: 'The Great Transition: Java EE to Jakarta EE'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 17
sectionTitle: Web Architecture & The Jakarta EE Evolution
versionBadge: Jakarta EE 9/10/11
difficulty: Beginner
readingTime: 8 min read
shortDescription: >-
  Reference: Historic evolution from J2EE/Java EE to Eclipse Jakarta EE, package namespace migration from javax.* to jakarta.*, and application server runtime compatibility matrices.
prerequisites:
  - 'Topic 21: Packages & Access Modifiers'
  - 'Topic 63: Java Platform Module System (JPMS)'
---

## Overview
In 2017, Oracle transferred Java EE to the Eclipse Foundation to establish Jakarta EE. Because Oracle retained the "Java" commercial trademark, the legacy `javax.*` package namespace was permanently frozen at Java EE 8, and all enterprise specifications migrated to the `jakarta.*` namespace starting in Jakarta EE 9. This architectural boundary dictates runtime compatibility between application servers, frameworks, and dependency ecosystems.

---

## The Namespace Migration Architecture

```
                      Java Enterprise Evolution
┌──────────────────────┬──────────────────────┬────────────────────────┐
│ Sun J2EE (1999-2006) │ Oracle Java EE (2006-│ Eclipse Jakarta EE     │
│ J2EE 1.2 – 1.4       │ 2017) Java EE 5 – 8  │ (2018+) Jakarta EE 9+  │
├──────────────────────┼──────────────────────┼────────────────────────┤
│ javax.* namespace    │ javax.* namespace    │ jakarta.* namespace    │
│ Proprietary Sun spec │ Oracle trademarked   │ Vendor-neutral OSS     │
│ EJB 1.x/2.x heavy    │ Annotations & CDI    │ Cloud-native & modern  │
└──────────────────────┴──────────────────────┴────────────────────────┘
```

| Specification | Legacy Namespace (`<= Java EE 8`) | Modern Namespace (`>= Jakarta EE 9`) | Modern Maven Coordinates (`>= Jakarta EE 10`) |
| :--- | :--- | :--- | :--- |
| **Servlet API** | `javax.servlet.*` | `jakarta.servlet.*` | `jakarta.servlet:jakarta.servlet-api:6.0.0` |
| **Persistence (JPA)** | `javax.persistence.*` | `jakarta.persistence.*` | `jakarta.persistence:jakarta.persistence-api:3.1.0` |
| **RESTful Web Services** | `javax.ws.rs.*` | `jakarta.ws.rs.*` | `jakarta.ws.rs:jakarta.ws.rs-api:3.1.0` |
| **Contexts & DI (CDI)** | `javax.enterprise.context.*` | `jakarta.enterprise.context.*` | `jakarta.enterprise:jakarta.enterprise.cdi-api:4.0.1` |
| **Bean Validation** | `javax.validation.*` | `jakarta.validation.*` | `jakarta.validation:jakarta.validation-api:3.0.2` |
| **JSON Processing** | `javax.json.*` | `jakarta.json.*` | `jakarta.json:jakarta.json-api:2.1.3` |

---

## Application Server & Framework Compatibility Matrix

| Runtime / Framework | Legacy Namespace (`javax.*`) | Modern Namespace (`jakarta.*`) | Minimum Java Version |
| :--- | :--- | :--- | :--- |
| **Apache Tomcat** | Tomcat 8.5 / 9.0 | Tomcat 10.1 / 11.0 | Tomcat 10.1: Java 11+, Tomcat 11: Java 17+ |
| **Eclipse Jetty** | Jetty 9 / 10 | Jetty 11 / 12 (Core) | Jetty 11: Java 11+, Jetty 12: Java 17+ |
| **WildFly** | WildFly <= 26.1 | WildFly 27+ | Java 11+ / Java 17+ |
| **Spring Framework** | Spring 5.x | Spring 6.x | Spring 6: Java 17+ |
| **Spring Boot** | Spring Boot 2.x | Spring Boot 3.x | Spring Boot 3: Java 17+ |
| **Hibernate ORM** | Hibernate 5.x | Hibernate 6.x | Hibernate 6: Java 17+ |

---

## Production Implementation: Namespace Verification

```java
import jakarta.servlet.ServletContainerInitializer;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import java.util.Set;

public class NamespaceValidatorInitializer implements ServletContainerInitializer {

    @Override
    public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
        String serverInfo = ctx.getServerInfo();
        int majorVersion = ctx.getEffectiveMajorVersion();
        int minorVersion = ctx.getEffectiveMinorVersion();

        // Enforce modern Jakarta EE 10 (Servlet 6.0+) compliance
        if (majorVersion < 6) {
            ctx.log("[WARNING] Server is running Servlet specification < 6.0: " + majorVersion + "." + minorVersion);
        } else {
            ctx.log("[INFO] Jakarta EE 10+ compliant servlet container verified: " + serverInfo);
        }
    }
}
```

```
[INFO] Jakarta EE 10+ compliant servlet container verified: Apache Tomcat/10.1.24
```

---

## Common Pitfalls & Migration Traps

- **Deploying `javax.*` WAR to Tomcat 10+ / Jetty 11+:**
  Results in silent failures or `ClassNotFoundException: javax.servlet.Filter`. Tomcat 10+ completely ignores `javax.*` annotations (`@WebServlet`) and filters. Use Tomcat 9.0 for `javax.*` or migrate imports to `jakarta.*`.
- **Mixing Namespaces Across Dependencies:**
  Using Spring Boot 3 with a legacy third-party library importing `javax.persistence.Entity` causes entities to be ignored by Hibernate 6. Every transitive dependency touching enterprise specs must use `jakarta.*`.
- **Maven Dependency Scope Trap:**
  Declaring `jakarta.servlet-api` as `compile` scope packages the API inside `WEB-INF/lib`, causing classloader conflicts with the servlet container's built-in servlet engine classes. Always declare container-provided APIs with `<scope>provided</scope>`.

---

## Verification & Practice

**Question:** A legacy Spring Boot 2.7 service running Java 8 is upgraded directly to Spring Boot 3.2 on Java 21. What happens during compilation if the source code contains `import javax.servlet.http.HttpServletRequest;`?

**Explanation:** The build fails with a compilation error (`package javax.servlet.http does not exist`). Spring Boot 3.x is built on Spring Framework 6.x and Jakarta EE 10 (`jakarta.servlet.*`). The legacy `javax.*` APIs are completely omitted from the classpath. All imports must be refactored to `import jakarta.servlet.http.HttpServletRequest;`.

---

## Practice

### Q: Why did the enterprise namespace transition from `javax.*` to `jakarta.*` break backward binary compatibility, and how does Apache Tomcat 10.1+ handle older WAR files?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Oracle retained trademark ownership over the `javax` package namespace when donating Java EE to the Eclipse Foundation. Consequently, Jakarta EE 9+ migrated all APIs to the `jakarta.*` package namespace (`javax.servlet` -> `jakarta.servlet`). Containers like Tomcat 10+ adhere strictly to Jakarta EE specifications and reject `javax.*` servlets unless bytecode migration tools rewrite class references prior to deployment.
</details>
