---
id: topic-63
slug: the-great-transition-java-ee-to-jakarta-ee
topicNumber: 63
title: 'The Great Transition: Java EE to Jakarta EE'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 17
sectionTitle: Web Architecture & The Jakarta EE Evolution
versionBadge: Jakarta EE 9/10/11
difficulty: Beginner
readingTime: 10 min read
shortDescription: >-
  Understand the historic evolution from Sun J2EE and Oracle Java EE to Eclipse
  Jakarta EE, package namespace migration from javax.* to jakarta.*, and server
  compatibility matrices.
prerequisites:
  - 'Topic 18: Packages & Access Modifiers'
  - 'Topic 60: Java Platform Module System (JPMS)'
---
# The Great Transition: Java EE to Jakarta EE

### 1. What It Is and Why It Exists
For nearly two decades, the standard enterprise server-side platform for Java was **Java 2 Platform, Enterprise Edition (J2EE)** and later **Java Platform, Enterprise Edition (Java EE)**, stewarded originally by Sun Microsystems and subsequently Oracle. Enterprise Java specifications—such as Servlets, JavaServer Pages (JSP), Enterprise JavaBeans (EJB), Java Persistence API (JPA), and JAX-RS—governed billions of dollars in global commerce, banking, and government infrastructure. All of these APIs lived within the venerable `javax.*` package namespace (e.g., `javax.servlet.http.HttpServlet`, `javax.persistence.Entity`).

In 2017, Oracle made the historic decision to open-source the entirety of Java EE to the vendor-neutral **Eclipse Foundation**, where the community rebranded the platform as **Jakarta EE**.
However, while Oracle donated the source code and Technology Compatibility Kits (TCKs), Oracle retained the proprietary commercial trademark on the name **"Java"**. Under the legal agreement between Oracle and the Eclipse Foundation:
1. The Eclipse Foundation could not evolve any APIs under the `javax.*` namespace.
2. The `javax.*` package namespace was permanently frozen at the Java EE 8 feature level.
3. To innovate and release newer versions, the community had to execute the **"Big Bang" namespace migration**: changing every enterprise package name from `javax.*` to `jakarta.*` (e.g., `javax.servlet.*` became `jakarta.servlet.*`).

This shift caused the biggest backward-compatibility break in Java history, requiring modern servlet containers (Apache Tomcat 10+, Eclipse Jetty 11+, WildFly 27+) to adopt the new `jakarta.*` namespace.

**Real-World Analogy:**
Imagine an international telecom provider that operated country codes under the brand name `"JavaPhone"` using dialed prefix `+99` (`javax.*`). When the company was donated to a public global foundation, the original owner retained the trademark `"JavaPhone"`. The foundation renamed the network to `"JakartaPhone"` and updated the international calling prefix to `+77` (`jakarta.*`). Cell towers built before the handover (Tomcat 9) only accept `+99` calls. Modern towers (Tomcat 10+) only accept `+77` calls.

---

### 2. Prerequisites
- **Packages and Namespaces (Topic 18)**: Understanding how package names uniquely define types.
- **JPMS and Modules (Topic 60)**: Understanding modular boundaries and namespace isolation.

---

### 3. Syntax Breakdown

#### 3.1 The Import Statement Transformation
The most immediate syntactic consequence of the transition is in import statements across every enterprise web application:
```java
// LEGACY (Java EE 8 / Tomcat 9 and older):
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

// MODERN (Jakarta EE 10 / Tomcat 10.1+ / Tomcat 11):
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
```

#### 3.2 XML Schema Namespace Changes in `web.xml`
In addition to Java source imports, deployment descriptors updated their XML schemas:
- **Legacy Java EE 8 (`web.xml`)**:
  `xmlns="http://xmlns.jcp.org/xml/ns/javaee"`
- **Modern Jakarta EE 10 (`web.xml`)**:
  `xmlns="https://jakarta.ee/xml/ns/jakartaee"` (version `"6.0"`)

#### 3.3 Server & Container Compatibility Rules
- **Tomcat 9.0.x**: Supports Servlet 4.0 / Java EE 8 (`javax.*` namespace). Runs on Java 8+.
- **Tomcat 10.1.x** (Current Stable): Supports Servlet 6.0 / Jakarta EE 10 (`jakarta.*` namespace). Requires Java 11+.
- **Tomcat 11.0.x** (Cutting Edge): Supports Servlet 6.1 / Jakarta EE 11 (`jakarta.*` namespace). Requires Java 17+.

---

### 4. Code Examples

#### Example 1: Programmatic Detection of the Active Container Namespace
The following example inspects the active runtime classpath, verifying the presence of the modern `jakarta.*` servlet API:

```java
public class NamespaceTransitionInspectorDemo {
    public static void main(String[] args) {
        System.out.println("=== The Great Transition: Java EE to Jakarta EE ===");

        System.out.println("1. 1999 - 2017: Java EE (Sun Microsystems -> Oracle Corporation)");
        System.out.println("   Package Namespace: javax.* (e.g. javax.servlet.http.HttpServlet)");

        System.out.println("2. 2017: Oracle donates Java EE to Eclipse Foundation.");
        System.out.println("   Oracle retains 'Java' trademark; requires namespace migration.");

        System.out.println("3. 2019: Jakarta EE 8 released (fully identical to Java EE 8, still javax.*).");

        System.out.println("4. 2020: Jakarta EE 9 'Big Bang' migration (namespace permanently switched to jakarta.*).");

        System.out.println("5. Modern Production: Jakarta EE 10 / 11 (Servlet 6.0/6.1, Tomcat 10.1/11).");

        try {
            Class<?> servletClass = Class.forName("jakarta.servlet.http.HttpServlet");
            System.out.println("\nActive Servlet API Detected: " + servletClass.getName());
            System.out.println("Namespace: 'jakarta.*' (Modern Jakarta EE Container verified)");
        } catch (ClassNotFoundException e) {
            System.out.println("\nServlet API not on standalone boot classpath (Standard in Java SE runtime)");
        }

        System.out.println("Namespace transition inspection completed successfully.");
    }
}
```

**Expected Output:**
```text
=== The Great Transition: Java EE to Jakarta EE ===
1. 1999 - 2017: Java EE (Sun Microsystems -> Oracle Corporation)
   Package Namespace: javax.* (e.g. javax.servlet.http.HttpServlet)
2. 2017: Oracle donates Java EE to Eclipse Foundation.
   Oracle retains 'Java' trademark; requires namespace migration.
3. 2019: Jakarta EE 8 released (fully identical to Java EE 8, still javax.*).
4. 2020: Jakarta EE 9 'Big Bang' migration (namespace permanently switched to jakarta.*).
5. Modern Production: Jakarta EE 10 / 11 (Servlet 6.0/6.1, Tomcat 10.1/11).

Active Servlet API Detected: jakarta.servlet.http.HttpServlet
Namespace: 'jakarta.*' (Modern Jakarta EE Container verified)
Namespace transition inspection completed successfully.
```

#### Example 2: Realistic Application — Server Compatibility Matrix Evaluator
In enterprise migration audits, software architects evaluate which servlet container versions and Java versions can host target enterprise workloads:

```java
import java.util.List;

public class ServerCompatibilityMatrixApp {
    record CompatibilityEntry(
            String serverName,
            String serverVersion,
            String jakartaVersion,
            String servletSpec,
            String namespace,
            int minimumJavaVersion
    ) {}

    public static void main(String[] args) {
        System.out.println("Starting Server Compatibility Matrix Evaluator...\n");

        List<CompatibilityEntry> matrix = List.of(
                new CompatibilityEntry("Apache Tomcat", "9.0.x", "Java EE 8", "Servlet 4.0", "javax.*", 8),
                new CompatibilityEntry("Apache Tomcat", "10.1.x", "Jakarta EE 10", "Servlet 6.0", "jakarta.*", 11),
                new CompatibilityEntry("Apache Tomcat", "11.0.x", "Jakarta EE 11", "Servlet 6.1", "jakarta.*", 17),
                new CompatibilityEntry("Eclipse Jetty", "11.x", "Jakarta EE 9", "Servlet 5.0", "jakarta.*", 11),
                new CompatibilityEntry("Eclipse Jetty", "12.x", "Jakarta EE 10/11", "Servlet 6.0", "jakarta.*", 17),
                new CompatibilityEntry("WildFly", "30.x+", "Jakarta EE 10", "Full Profile", "jakarta.*", 17),
                new CompatibilityEntry("Eclipse GlassFish", "7.0.x", "Jakarta EE 10", "Full Profile", "jakarta.*", 17)
        );

        System.out.printf("%-18s | %-10s | %-15s | %-12s | %-10s | Min Java%n",
                "Server", "Version", "EE Level", "Servlet Spec", "Namespace");
        System.out.println("-".repeat(82));

        for (CompatibilityEntry entry : matrix) {
            System.out.printf("%-18s | %-10s | %-15s | %-12s | %-10s | Java %d+%n",
                    entry.serverName(), entry.serverVersion(), entry.jakartaVersion(),
                    entry.servletSpec(), entry.namespace(), entry.minimumJavaVersion());
        }

        System.out.println("\nRule: Any application compiled against 'jakarta.*' WILL NOT run on Tomcat 9.");
        System.out.println("Rule: Any application compiled against 'javax.*' WILL NOT run on Tomcat 10+ (without byte-code migration).");
        System.out.println("Server compatibility evaluation completed successfully.");
    }
}
```

**Expected Output:**
```text
Starting Server Compatibility Matrix Evaluator...

Server             | Version    | EE Level        | Servlet Spec | Namespace  | Min Java
----------------------------------------------------------------------------------
Apache Tomcat      | 9.0.x      | Java EE 8       | Servlet 4.0  | javax.*    | Java 8+
Apache Tomcat      | 10.1.x     | Jakarta EE 10   | Servlet 6.0  | jakarta.*  | Java 11+
Apache Tomcat      | 11.0.x     | Jakarta EE 11   | Servlet 6.1  | jakarta.*  | Java 17+
Eclipse Jetty      | 11.x       | Jakarta EE 9    | Servlet 5.0  | jakarta.*  | Java 11+
Eclipse Jetty      | 12.x       | Jakarta EE 10/11 | Servlet 6.0  | jakarta.*  | Java 17+
WildFly            | 30.x+      | Jakarta EE 10   | Full Profile | jakarta.*  | Java 17+
Eclipse GlassFish  | 7.0.x      | Jakarta EE 10   | Full Profile | jakarta.*  | Java 17+

Rule: Any application compiled against 'jakarta.*' WILL NOT run on Tomcat 9.
Rule: Any application compiled against 'javax.*' WILL NOT run on Tomcat 10+ (without byte-code migration).
Server compatibility evaluation completed successfully.
```

---

### 5. Step-by-Step Execution Trace
1. When a developer compiles a modern servlet class, `javac` checks dependencies against `tools/apache-tomcat-10.1.61/lib/servlet-api.jar`.
2. The compiler resolves symbol `jakarta.servlet.http.HttpServlet`.
3. The resulting bytecode encodes method signatures pointing directly to the `Ljakarta/servlet/http/HttpServlet;` descriptor.
4. When deployed to Tomcat 10.1, the Catalina classloader matches the `jakarta.*` bytecode types with its own container libraries without classloading mismatches.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Deploying a `javax.*` WAR to Tomcat 10+
Deploying an old Java EE 8 application compiled with `import javax.servlet.*` onto Apache Tomcat 10 or 11:
- **Consequence**: The container starts, but throws `java.lang.NoClassDefFoundError: javax/servlet/http/HttpServlet` or completely ignores `@WebServlet` annotations.
- **Fix**: Either update source code imports to `jakarta.*` and recompile, or run the Apache Tomcat Migration Tool for Jakarta EE (`jakartaee-migration-*.jar`) to rewrite class bytecode inside the WAR archive.

#### Pitfall 2: Mixing `javax.*` and `jakarta.*` Dependencies
A project imports `jakarta.servlet-api` version 6.0, but transitively brings in an old library depending on `javax.servlet:servlet-api:2.5`:
- **Consequence**: Compilation succeeds, but passing request or response objects between libraries throws `ClassCastException` because `javax.servlet.ServletRequest` and `jakarta.servlet.ServletRequest` are distinct types.
- **Fix**: Exclude legacy `javax.*` transitive dependencies in `pom.xml` or `build.gradle`.

---

### 7. Best Practices & When NOT to Use
- **Do**: Build all new enterprise and web projects targeting **Jakarta EE 10 or 11** with Apache Tomcat 10.1+ or 11+.
- **Do**: Update Maven dependencies to the official coordinates:
  `jakarta.servlet:jakarta.servlet-api:6.0.0` (scope: `provided`).
- **Don't**: Do not initiate new production projects on Java EE 8 / Tomcat 9 unless supporting legacy un-upgradable legacy vendor infrastructure.

---

### 8. Version Notes
- **Java EE 8 (2017)**: Last Oracle release under `javax.*`.
- **Jakarta EE 8 (2019)**: First Eclipse Foundation release; identical to Java EE 8, still using `javax.*`.
- **Jakarta EE 9 (2020)**: Milestone release switching namespace to `jakarta.*` (Servlet 5.0).
- **Jakarta EE 10 (2022)**: Modern baseline release (Servlet 6.0, Java 11+ required).
- **Jakarta EE 11 (2024+)**: Latest release (Servlet 6.1, Java 17/21 LTS baseline).

---

### 9. Summary Cheat Sheet

| Platform | Namespace | Servlet Version | Primary Tomcat Version | Minimum Java |
| :--- | :--- | :--- | :--- | :--- |
| **Java EE 8** | `javax.*` | Servlet 4.0 | Apache Tomcat 9.0.x | Java 8 |
| **Jakarta EE 9** | `jakarta.*` | Servlet 5.0 | Apache Tomcat 10.0.x (EOL) | Java 8 |
| **Jakarta EE 10** | `jakarta.*` | Servlet 6.0 | **Apache Tomcat 10.1.x (Stable)** | **Java 11+** |
| **Jakarta EE 11** | `jakarta.*` | Servlet 6.1 | Apache Tomcat 11.0.x | Java 17+ |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Identify Missing Dependency
A developer writes `@WebServlet("/test")` and imports `jakarta.servlet.annotation.WebServlet`, but Maven throws `package jakarta.servlet.annotation does not exist`. What dependency is missing from `pom.xml`?

<details>
<summary>View Solution</summary>

```xml
<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>6.0.0</version>
    <scope>provided</scope>
</dependency>
```
</details>

#### Exercise 2: Why Scope Provided?
Why should `jakarta.servlet-api` be given scope `<scope>provided</scope>` in web application projects?

<details>
<summary>View Solution</summary>

```text
Solution:
The Servlet API interfaces are provided at runtime by the web container (such as Apache Tomcat in 'lib/servlet-api.jar'). If the application bundles its own servlet-api.jar inside 'WEB-INF/lib', classloader conflicts and ClassCastExceptions will occur when Tomcat attempts to load its own container implementation.
```
</details>

---

### 11. Sources & Official References
- [Eclipse Foundation: Jakarta EE Specification Releases](https://jakarta.ee/specifications/)
- [Apache Tomcat Official Versions and Spec Support](https://tomcat.apache.org/whichversion.html)
- [Jakarta Servlet 6.0 Specification](https://jakarta.ee/specifications/servlet/6.0/)
