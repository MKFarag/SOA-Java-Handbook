---
id: topic-68
slug: apache-tomcat-and-the-war-structure
topicNumber: 68
title: 'Apache Tomcat & The WAR Packaging Structure'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 17
sectionTitle: Web Architecture & The Jakarta EE Evolution
versionBadge: Tomcat 10.1+ / Servlet 6.0
difficulty: Beginner
readingTime: 8 min read
shortDescription: >-
  Reference: Web Application Archive (WAR) anatomy, the protected WEB-INF boundary, web.xml vs annotations, Catalina container hierarchy, and Tomcat deployment pipelines.
prerequisites:
  - 'Topic 65: Build Tools: Maven & Gradle'
  - 'Topic 67: Web Architecture Fundamentals: The HTTP Protocol'
---

## Overview
A Web Application Archive (WAR) is a standardized packaged zip artifact containing web assets, compiled bytecode, libraries, and configuration descriptors deployed to a servlet container such as Apache Tomcat. Tomcat executes the Catalina servlet engine, managing application lifecycles, classloader isolation, and HTTP request routing to deployed web applications.

---

## Canonical WAR Directory Layout

```
myapp.war
├── index.html                   <-- Public static asset (directly accessible)
├── css/
│   └── styles.css               <-- Public stylesheet
├── WEB-INF/                     <-- Protected Container Boundary (Forbidden to direct HTTP)
│   ├── web.xml                  <-- Deployment Descriptor (Optional in Servlet 3.0+)
│   ├── classes/                 <-- Application compiled bytecode (.class files)
│   │   ├── com/example/UserServlet.class
│   │   └── application.properties
│   └── lib/                     <-- Application-scoped third-party JARs (.jar files)
│       └── gson-2.10.1.jar
└── META-INF/                    <-- Archive metadata & manifest
    └── MANIFEST.MF
```

| Path | Public Access | Content Description | Container Classloader Loading |
| :--- | :--- | :--- | :--- |
| **`/` (Root)** | Yes | HTML, CSS, client JS, images | N/A (served by DefaultServlet) |
| **`WEB-INF/`** | **Strictly Blocked** | Configuration, templates, internal views | Container enforces 404/403 for direct client URLs |
| **`WEB-INF/classes/`** | **Strictly Blocked** | Application compiled `.class` files and resources | WebappClassLoader (highest application priority) |
| **`WEB-INF/lib/`** | **Strictly Blocked** | Bundled dependency `.jar` archives | WebappClassLoader |
| **`META-INF/`** | **Strictly Blocked** | Package manifests, service providers, CDI beans | Standard Java archive metadata |

---

## Tomcat Architectural Hierarchy

```
┌────────────────────────────────────────────────────────┐
│ Server (<Server> port="8005" shutdown="SHUTDOWN")      │
│  └── Service (<Service name="Catalina">)               │
│       ├── Connector (Coyote HTTP/1.1 on port 8080)     │
│       ├── Connector (Coyote AJP/1.3 on port 8009)      │
│       └── Engine (<Engine name="Catalina">)            │
│            └── Host (<Host name="localhost" appBase="webapps">)
│                 ├── Context (path="/app1" docBase="app1.war")
│                 └── Context (path="/ROOT" docBase="ROOT.war")
└────────────────────────────────────────────────────────┘
```

---

## Production Deployment Descriptor: web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                             https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0"
         metadata-complete="false">

    <display-name>Production Web Application</display-name>

    <context-param>
        <param-name>environment</param-name>
        <param-value>PRODUCTION</param-value>
    </context-param>

    <session-config>
        <session-timeout>30</session-timeout>
        <cookie-config>
            <http-only>true</http-only>
            <secure>true</secure>
        </cookie-config>
    </session-config>

</web-app>
```

---

## Common Pitfalls & Deployment Traps

- **Exposing Internal JSPs or Templates in WAR Root:**
  Placing JSP or HTML template files directly under the root folder makes them publicly navigable via browser URLs, bypassing servlet controllers and security filters. Always place internal views inside `WEB-INF/views/`.
- **Packaging Container-Provided Libraries inside `WEB-INF/lib`:**
  Bundling `jakarta.servlet-api.jar` inside `WEB-INF/lib` creates classloader conflicts with Tomcat's `lib/servlet-api.jar`, causing `ClassCastException` or linking errors. Use `<scope>provided</scope>` in Maven.
- **The `metadata-complete="true"` Trap:**
  Setting `metadata-complete="true"` in `web.xml` instructs Tomcat to disable classpath annotation scanning (`@WebServlet`, `@WebFilter`, `@WebListener`). All components must then be explicitly declared in `web.xml` or they will not be registered.

---

## Verification & Practice

**Question:** An engineer uploads a sensitive configuration file `db.properties` into the root directory of a deployed WAR instead of `WEB-INF/classes/`. What security vulnerability is created?

**Explanation:** Files placed in the root of a WAR are served directly as static files by Tomcat's `DefaultServlet`. Anyone navigating to `https://example.com/db.properties` can download the database credentials in plaintext. Moving the file to `WEB-INF/classes/` makes it accessible to the classloader via `getResourceAsStream()` while strictly preventing direct HTTP access.
