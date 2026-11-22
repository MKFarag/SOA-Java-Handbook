---
id: topic-65
slug: build-tools-maven-and-gradle
topicNumber: 65
title: 'Build Automation: Maven & Gradle'
part: 'Part 1: Java Core'
sectionNumber: 16
sectionTitle: Data Access & Build Tools
versionBadge: Maven 3.9+ / Gradle 8.x+
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Build automation, Maven GAV coordinates and standard lifecycles (clean, default, site), Gradle DAG incremental tasks, and transitive dependency conflict resolution.
prerequisites:
  - 'Topic 02: JDK vs JRE vs JVM & Setup'
  - 'Topic 21: Packages & Access Modifiers'
---

## Overview
Modern Java development relies on build automation systems—primarily **Apache Maven** and **Gradle**—to manage dependency resolution from central repositories, compile bytecodes according to standard directory structures, execute automated test suites, and package executable archives (JAR/WAR/Docker).

---

## Maven vs Gradle Comparison

| Dimension | Apache Maven (`pom.xml`) | Gradle (`build.gradle.kts`) |
| :--- | :--- | :--- |
| **Philosophy** | Convention-over-configuration; declarative XML | Task-oriented; programmatic Kotlin/Groovy DSL |
| **Execution Model** | Linear sequence of immutable phases | Directed Acyclic Graph (DAG) of discrete tasks |
| **Build Caching** | File-timestamp based (re-runs phases) | **Incremental build cache** (skips up-to-date tasks) |
| **Transitive Conflicts**| Resolves by **Nearest Definition** in tree | Resolves by **Highest Version** by default |
| **Performance** | Predictable baseline | Significantly faster on large multi-module projects |

---

## Standard Directory Layout (Convention over Configuration)

Both Maven and Gradle enforce the canonical Java directory layout:

```
 project-root/
 ├── pom.xml (or build.gradle.kts)
 ├── src/
 │   ├── main/
 │   │   ├── java/        ──► Production Java source code (.java)
 │   │   └── resources/   ──► Application properties, XML, static configs
 │   └── test/
 │       ├── java/        ──► Unit and integration test sources
 │       └── resources/   ──► Test-only mock fixtures
 └── target/ (or build/)  ──► Output compiled .class files and packaged .jar
```

---

## Maven Core Lifecycle & Dependency Scopes

### Standard Default Lifecycle Phases
`validate` $\rightarrow$ `compile` $\rightarrow$ `test` $\rightarrow$ `package` $\rightarrow$ `verify` $\rightarrow$ `install` $\rightarrow$ `deploy`

Executing a phase automatically triggers all preceding phases in sequence.

### Dependency Scopes

| Scope | Classpath: Compile | Classpath: Test | Classpath: Runtime | Packaged in Final JAR? |
| :--- | :---: | :---: | :---: | :---: |
| **`compile`** (Default) | **Yes** | **Yes** | **Yes** | **Yes** |
| **`provided`** | **Yes** | **Yes** | No (Supplied by JDK/Container) | No (e.g. Servlet API, Lombok) |
| **`runtime`** | No | **Yes** | **Yes** | **Yes** (e.g. JDBC Drivers) |
| **`test`** | No | **Yes** | No | No (e.g. JUnit, Mockito) |

---

## Transitive Conflict Resolution

When Library A depends on `Lib C:1.0` and Library B depends on `Lib C:2.0`:
- **Maven Rule (Nearest Definition):** The version closest to the root `pom.xml` in the dependency tree wins. If tree depths match, the first declared dependency wins. Override explicitly via `<dependencyManagement>`.
- **Gradle Rule (Newest Version):** Gradle automatically selects the highest version (`2.0`) unless locked or constrained.

---

## Minimal Production `pom.xml` Specification

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.enterprise.app</groupId>
    <artifactId>telemetry-service</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Compile Scope Dependency -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.17.0</version>
        </dependency>

        <!-- Test Scope Dependency -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

---

## Pitfalls

- **Bypassing the Wrapper (`./mvnw` or `./gradlew`):** Running locally installed system CLIs (`mvn` or `gradle`) leads to mismatched version bugs across developer environments and CI/CD pipelines. Always commit and execute via the repository wrapper script.
- **Leaking Test Dependencies into Compile Scope:** Omitting `<scope>test</scope>` bundles test libraries (e.g. JUnit, Mockito) into production distribution JARs, increasing deployment size and attack surface.
- **Dynamic Version Dependencies:** Using floating version ranges (e.g. `1.+` or `LATEST`) produces non-reproducible builds where upstream updates break CI/CD pipelines unexpectedly. Pin exact version coordinates.

---

## Practice

### Question
Why is the `provided` dependency scope used for `servlet-api` in traditional web applications?

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. During compilation, the application code requires `servlet-api` classes (`HttpServletRequest`, `HttpServletResponse`) to compile cleanly.
2. At runtime, the hosting servlet container (such as Apache Tomcat) already provides its own copy of the servlet API in its shared library folder.
3. If the application bundled its own `servlet-api.jar` inside `WEB-INF/lib`, a ClassLoader conflict would occur, throwing `LinkageError` or `ClassCastException`.
4. Marking it `provided` includes it on the compile and test classpaths, but excludes it from the final WAR package.

</details>
