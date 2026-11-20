---
id: topic-65
slug: apache-tomcat-and-the-war-structure
topicNumber: 65
title: Apache Tomcat & The WAR Structure
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 18
sectionTitle: Web Containers & Packaging
versionBadge: Tomcat 10.1+ / Servlet 6.0
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Explore the Web Archive (WAR) anatomy, the protected WEB-INF boundary, web.xml
  vs annotations, Catalina container hierarchy, and Tomcat deployment pipelines.
prerequisites:
  - 'Topic 62: Build Automation: Maven & Gradle'
  - 'Topic 63: The Great Transition: Java EE to Jakarta EE'
relevanceLevel: MUST-KNOW / CORE
---
# Apache Tomcat & The WAR Structure

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

### 1. What It Is and Why It Exists
Java desktop applications are packaged as Java Archives (`.jar`) and executed by invoking `public static void main(String[] args)`. However, enterprise web applications do not contain a `main` method. Instead, they are packaged as **Web Archives (`.war`)** and deployed inside a **Web Container** (or **Servlet Container**) such as **Apache Tomcat**.

The Web Container manages the entire application lifecycle:
- **Network Listening**: Listens on TCP port 8080 or 8443, accepting incoming HTTP client socket connections.
- **Protocol Decoding**: Parses raw HTTP request bytes into strongly typed `HttpServletRequest` objects.
- **Thread Management**: Dispatches worker threads from an internal thread pool to process concurrent requests.
- **Servlet Lifecycle**: Instantiates servlets, invokes `init()`, calls `service()` for every request, and calls `destroy()` on shutdown.
- **Security & Sandboxing**: Enforces web security constraints and isolates applications from one another.

To run inside a container, an application must adhere strictly to the standardized **WAR Directory Structure**.

**Real-World Analogy:**
Think of a major international airport terminal. The terminal building, air traffic control towers, runways, baggage conveyors, and jet bridges represent **Apache Tomcat**. The airlines and their airplanes represent individual **WAR Web Applications**. An airline does not build its own private runways or radar towers; it parks its plane at a designated gate (**Context Path**, e.g., `/handbook-demo`), plugs into the airport's pre-existing jet bridges and power lines (**Connectors**), and lets the terminal manage passenger boarding.

---

### 2. Prerequisites
- **Build Tools and Packaging (Topic 62)**: Understanding how Maven packages JAR/WAR files.
- **Jakarta EE Transition (Topic 63)**: Knowing that Tomcat 10.1+ requires `jakarta.servlet.*`.
- **HTTP Fundamentals (Topic 64)**: Understanding HTTP requests, responses, and headers.

---

### 3. Syntax Breakdown

#### 3.1 The Canonical WAR Directory Layout
A `.war` file is a standard ZIP archive with a mandatory internal hierarchy defined by the Servlet Specification:
```text
my-web-app.war
├── index.html                   <- Public: Directly accessible by web clients
├── favicon.ico
├── css/
│   └── styles.css               <- Public static asset: http://host/app/css/styles.css
├── js/
│   └── bundle.js
└── WEB-INF/                     <- PRIVATE & SECURE: Container strictly blocks client access!
    ├── web.xml                  <- Deployment Descriptor (configuration, servlet mappings)
    ├── classes/                 <- Compiled application .class files
    │   └── com/example/web/
    │       └── MyServlet.class
    └── lib/                     <- Third-party library JARs (e.g., sqlite-jdbc.jar)
        └── my-library.jar
```
- **Public Root**: Any file outside `WEB-INF` is directly addressable by client browsers (e.g., `GET /css/styles.css`).
- **`WEB-INF/`**: **Strictly private**. The web container's HTTP connector is legally required to reject any direct client request to `http://host/app/WEB-INF/...` with HTTP `404 Not Found`.
- **`WEB-INF/classes/`**: Target directory where `javac` or Maven outputs compiled `.class` files.
- **`WEB-INF/lib/`**: Contains `.jar` libraries bundled specifically with this application.

#### 3.2 Apache Tomcat Catalina Internal Architecture
Tomcat organizes its processing engine as a nested hierarchy in `conf/server.xml`:
1. `Server`: Represents the entire running Tomcat JVM process.
2. `Service`: Groups one or more network connectors with an execution engine.
3. `Connector`: Listens on network ports (e.g., HTTP/1.1 on port `8080`, AJP on port `8009`).
4. `Engine`: Coordinates request routing across virtual hosts.
5. `Host`: Represents a virtual host or domain name (default: `localhost` with `appBase="webapps"`).
6. `Context`: Represents an individual web application deployed at a specific URI context path (e.g., `/handbook-demo`).

---

### 4. Code Examples

#### Example 1: Programmatic WAR Structure & Security Boundary Validator
The following example simulates inspecting a deployment archive, verifying the presence of required deployment boundaries and public vs private asset separation:

```java
import java.util.ArrayList;
import java.util.List;

public class WarStructureValidatorDemo {
    record WarEntry(String path, boolean isDirectory, long size) {}

    public static void main(String[] args) {
        System.out.println("=== Java Web Archive (WAR) Structure Validator ===");

        List<WarEntry> warManifest = List.of(
                new WarEntry("index.html", false, 1024),
                new WarEntry("css/styles.css", false, 2048),
                new WarEntry("WEB-INF/", true, 0),
                new WarEntry("WEB-INF/web.xml", false, 512),
                new WarEntry("WEB-INF/classes/", true, 0),
                new WarEntry("WEB-INF/classes/com/handbook/web/LifecycleServlet.class", false, 4096),
                new WarEntry("WEB-INF/lib/", true, 0),
                new WarEntry("WEB-INF/lib/sqlite-jdbc-3.49.1.0.jar", false, 14000000)
        );

        boolean hasWebInf = false;
        boolean hasWebXml = false;
        boolean hasClasses = false;
        List<String> publicAssets = new ArrayList<>();

        for (WarEntry entry : warManifest) {
            String p = entry.path();
            if (p.startsWith("WEB-INF/")) {
                hasWebInf = true;
                if (p.equals("WEB-INF/web.xml")) hasWebXml = true;
                if (p.startsWith("WEB-INF/classes/")) hasClasses = true;
            } else {
                publicAssets.add(p);
            }
        }

        System.out.println("1. Security Boundary Check:");
        System.out.println("   WEB-INF Root Present:    " + hasWebInf);
        System.out.println("   web.xml Deployment Desk: " + hasWebXml);
        System.out.println("   Compiled Bytecode Area:  " + hasClasses);

        System.out.println("\n2. Direct Client-Accessible Assets (" + publicAssets.size() + "):");
        for (String asset : publicAssets) {
            System.out.println("   - /" + asset);
        }

        System.out.println("\n3. Protected Internal Assets (Clients cannot request directly):");
        System.out.println("   - /WEB-INF/* is strictly blocked by Web Container HTTP connectors.");
        System.out.println("WAR structure validation completed successfully.");
    }
}
```

**Expected Output:**
```text
=== Java Web Archive (WAR) Structure Validator ===
1. Security Boundary Check:
   WEB-INF Root Present:    true
   web.xml Deployment Desk: true
   Compiled Bytecode Area:  true

2. Direct Client-Accessible Assets (2):
   - /index.html
   - /css/styles.css

3. Protected Internal Assets (Clients cannot request directly):
   - /WEB-INF/* is strictly blocked by Web Container HTTP connectors.
WAR structure validation completed successfully.
```

#### Example 2: Realistic Application — Tomcat Catalina Deployment Packager
In build pipelines, packaging tools construct valid deployment descriptor XML metadata and map context routing paths:

```java
import java.util.List;

public class TomcatDeploymentPackagerApp {
    record CatalinaContainer(String level, String name, String purpose) {}

    public static void main(String[] args) {
        System.out.println("Starting Apache Tomcat Deployment Packager Simulator...\n");

        List<CatalinaContainer> catalinaHierarchy = List.of(
                new CatalinaContainer("Server", "StandardServer", "Top-level JVM process container (conf/server.xml)"),
                new CatalinaContainer("Service", "Catalina", "Groups connectors with an execution engine"),
                new CatalinaContainer("Connector", "HTTP/1.1 (Port 8080)", "Handles TCP socket connections and HTTP protocol parsing"),
                new CatalinaContainer("Engine", "Catalina", "Entry point for request processing pipeline"),
                new CatalinaContainer("Host", "localhost (appBase=webapps)", "Virtual host domain configuration"),
                new CatalinaContainer("Context", "/handbook-demo", "Individual web application represented by a WAR")
        );

        System.out.println("Tomcat Catalina Container Architecture:");
        for (CatalinaContainer c : catalinaHierarchy) {
            System.out.printf("  [%-10s] %-25s -> %s%n", c.level(), c.name(), c.purpose());
        }

        String webXml = generateWebXml("com.handbook.web.LifecycleServlet", "/status");
        System.out.println("\nGenerated Canonical WEB-INF/web.xml:");
        System.out.println(webXml);

        System.out.println("Tomcat deployment package verification completed successfully.");
    }

    private static String generateWebXml(String servletClass, String urlPattern) {
        return """
            <?xml version="1.0" encoding="UTF-8"?>
            <web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                                         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
                     version="6.0">
                <servlet>
                    <servlet-name>AppServlet</servlet-name>
                    <servlet-class>%s</servlet-class>
                </servlet>
                <servlet-mapping>
                    <servlet-name>AppServlet</servlet-name>
                    <url-pattern>%s</url-pattern>
                </servlet-mapping>
            </web-app>
            """.formatted(servletClass, urlPattern).trim();
    }
}
```

**Expected Output:**
```text
Starting Apache Tomcat Deployment Packager Simulator...

Tomcat Catalina Container Architecture:
  [Server    ] StandardServer            -> Top-level JVM process container (conf/server.xml)
  [Service   ] Catalina                  -> Groups connectors with an execution engine
  [Connector ] HTTP/1.1 (Port 8080)      -> Handles TCP socket connections and HTTP protocol parsing
  [Engine    ] Catalina                  -> Entry point for request processing pipeline
  [Host      ] localhost (appBase=webapps) -> Virtual host domain configuration
  [Context   ] /handbook-demo            -> Individual web application represented by a WAR

Generated Canonical WEB-INF/web.xml:
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                             https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">
    <servlet>
        <servlet-name>AppServlet</servlet-name>
        <servlet-class>com.handbook.web.LifecycleServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>AppServlet</servlet-name>
        <url-pattern>/status</url-pattern>
    </servlet-mapping>
</web-app>
Tomcat deployment package verification completed successfully.
```

---

### 5. Step-by-Step Execution Trace
1. When a `.war` file is dropped into Tomcat's `webapps/` folder (or deployed via Maven), Tomcat's Host monitor detects the file.
2. Tomcat creates an expanded directory in `webapps/handbook-demo/`.
3. Tomcat creates a dedicated child `WebappClassLoader` for the application, ensuring that classes in `WEB-INF/classes` and JARs in `WEB-INF/lib` take precedence over common server libraries (child-first classloading).
4. Tomcat parses `WEB-INF/web.xml` and scans for `@WebServlet` annotations.
5. The application context path is registered at `/handbook-demo`.
6. Client requests to `http://localhost:8080/handbook-demo/status` are routed by the Catalina Connector through Engine $\to$ Host $\to$ Context $\to$ Servlet.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Placing JSP or Private Files in the Public Root
Placing sensitive business logic templates or database connection configurations outside `WEB-INF`:
- **Consequence**: Any user can type `http://localhost:8080/handbook-demo/config.properties` in their browser and download sensitive configuration files directly!
- **Fix**: Always place internal configuration, templates, and view JSPs inside `WEB-INF/` (e.g., `WEB-INF/views/`).

#### Pitfall 2: Bundling `servlet-api.jar` in `WEB-INF/lib`
Including the servlet API inside the application's `WEB-INF/lib/` directory:
- **Consequence**: Violates the Servlet Specification. Tomcat refuses to load the duplicate API or throws `ClassCastException`.
- **Fix**: In Maven `pom.xml`, mark the servlet API dependency as `<scope>provided</scope>`.

---

### 7. Best Practices & When NOT to Use
- **Do**: Follow the standard Maven webapp layout (`src/main/webapp/WEB-INF/web.xml`).
- **Do**: Name your WAR archive carefully: `ROOT.war` maps to the root context path (`/`), while `myapp.war` maps to `/myapp`.
- **Don't**: Do not edit files inside Tomcat's `work/` or `temp/` directories; these are ephemeral cache directories managed exclusively by the container.

---

### 8. Version Notes
- **Java Servlet 2.2**: Introduced the standardized WAR structure.
- **Servlet 3.0**: Made `web.xml` optional via annotation scanning (`@WebServlet`).
- **Servlet 6.0 (Jakarta EE 10 / Tomcat 10.1+)**: XML schema updated to `https://jakarta.ee/xml/ns/jakartaee`.

---

### 9. Summary Cheat Sheet

| WAR Directory | Visibility | Contents |
| :--- | :--- | :--- |
| `/` (Root) | **Public** | Static HTML, CSS, JS, images |
| `/WEB-INF/` | **Private** | Protected from direct client HTTP requests |
| `/WEB-INF/web.xml` | Server Only | Deployment descriptor configuration |
| `/WEB-INF/classes/`| Server Only | Compiled `.class` files |
| `/WEB-INF/lib/` | Server Only | Third-party dependency `.jar` files |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Identify Public vs Private
If an application has files `index.html` in the root and `secret.jsp` inside `WEB-INF/views/secret.jsp`, can a browser request `http://localhost:8080/app/WEB-INF/views/secret.jsp`?

<details>
<summary>View Solution</summary>

```text
Solution:
NO. The web container strictly blocks any HTTP request matching /WEB-INF/* with HTTP 404 Not Found. To render secret.jsp, an internal Java Servlet must forward the request on the server side using RequestDispatcher.forward().
```
</details>

#### Exercise 2: Map to Root Context
How do you deploy a WAR file in Apache Tomcat so that it responds directly to `http://localhost:8080/` without any path prefix?

<details>
<summary>View Solution</summary>

```text
Solution:
Name the WAR archive 'ROOT.war' and place it in the 'webapps/' directory (or configure a Context with path="" in conf/server.xml).
```
</details>

---

### 11. Sources & Official References
- [Apache Tomcat 10.1 Documentation: Class Loader HOW-TO](https://tomcat.apache.org/tomcat-10.1-doc/class-loader-howto.html)
- [Jakarta Servlet 6.0 Specification — Web Application Archive](https://jakarta.ee/specifications/servlet/6.0/)
- [Apache Tomcat Configuration Reference](https://tomcat.apache.org/tomcat-10.1-doc/config/)
