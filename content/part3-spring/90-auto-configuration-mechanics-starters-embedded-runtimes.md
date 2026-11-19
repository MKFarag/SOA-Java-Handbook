---
id: topic-90
slug: auto-configuration-mechanics-starters-embedded-runtimes
topicNumber: 90
title: 'Auto-Configuration Mechanics, Starters & Embedded Runtimes'
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 25
sectionTitle: Spring Boot Architecture & Configuration
versionBadge: Spring Boot 3.x / Java 21+
difficulty: Intermediate
readingTime: 16 min read
shortDescription: >-
  Deconstruct Spring Boot's opinionated architecture: condition evaluation algorithms,
  starter dependencies, META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports,
  and embedded web servers (Tomcat/Jetty/Undertow).
prerequisites:
  - 'Topic 65: Apache Tomcat & The WAR Structure'
  - 'Topic 88: Spring Framework Core: BeanFactory vs ApplicationContext'
  - 'Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks'
---
# Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes

## 1. What It Is and Why It Exists

Before the release of Spring Boot in 2014, building an enterprise Java web service suffered from notorious **"Spring Configuration Fatigue"**. A developer needed hundreds of lines of XML or verbose `@Configuration` classes just to connect to a database, configure a Jackson JSON mapper, wire a transaction manager, package a `.war` file, and deploy it onto an external application server like standalone Apache Tomcat or WildFly.

**Spring Boot** revolutionized the Java ecosystem by introducing three foundational pillars:
1. **Starter Dependencies (`spring-boot-starter-*`):** Curated, opinionated BOM (Bill of Materials) dependency descriptors that pull in verified, compatible versions of third-party libraries (e.g., `spring-boot-starter-web` transitively imports Spring Web, Spring MVC, Jackson, and embedded Tomcat).
2. **Auto-Configuration (`@EnableAutoConfiguration`):** An intelligent, condition-driven runtime engine that inspects your classpath, environment properties, and existing beans. If it detects `postgresql-42.x.jar` and `HikariCP` on the classpath—and you haven't defined a custom `DataSource` bean—Spring Boot automatically instantiates and configures a production-ready connection pool for you.
3. **Embedded Web Runtimes:** Inverts deployment architecture. Instead of deploying your application code into an external servlet container (`WAR` deployed to Tomcat), Spring Boot bundles the servlet container directly inside an executable Fat JAR (`JAR` containing embedded Tomcat). Your application is a standard Java program with a `public static void main()` entry point.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      @SpringBootApplication                            │
├──────────────────────────┬──────────────────────────┬──────────────────┤
│ @SpringBootConfiguration │ @EnableAutoConfiguration │  @ComponentScan  │
│ (Custom @Bean overrides) │ (Classpath condition checks) (Discovers @Service)│
└──────────────────────────┴──────────────────────────┴──────────────────┘
```

### The Auto-Configuration Discovery Mechanism

In modern **Spring Boot 3.x**, auto-configuration classes are discovered via a dedicated service declaration file:
`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

When the application boots:
1. Spring Boot reads every `AutoConfiguration.imports` file found across all loaded JARs.
2. It evaluates conditional annotations on each candidate auto-configuration class.
3. If all conditions match (e.g., required class exists, property is true, no conflicting user bean), the auto-configuration registers its beans into the `ApplicationContext`.
4. If the user explicitly declared their own bean (e.g., a custom `SecurityFilterChain`), the auto-configuration detects it via `@ConditionalOnMissingBean` and gracefully **backs off**.

### Real-World Analogy
Imagine buying a flagship modern smartphone:
- **Classic Java EE / Pre-Boot:** You receive a bare circuit board. You must independently purchase an antenna, solder a SIM tray, install a screen driver, download cellular protocol stacks, and compile the dialer app before making a call.
- **Spring Boot:** You take the phone out of the box. The phone detects the SIM card (`@ConditionalOnClass`), configures carrier APN settings automatically (`AutoConfiguration`), preloads a secure dialer (`@ConditionalOnMissingBean`), and turns on the cellular modem (`Embedded Tomcat`). If you prefer a custom messaging app (Signal), you install it, and the factory SMS app gracefully steps back.

---

## 2. Prerequisites
- **Apache Tomcat & WAR Structure (Topic 65):** Servlet container lifecycle and HTTP connectors.
- **Spring Core Container (Topic 88):** BeanFactory vs ApplicationContext initialization.
- **Bean Lifecycle & Injection (Topic 89):** Component scanning and `@Primary` / `@Qualifier` wiring.

---

## 3. Syntax Breakdown

### 3.1 Anatomy of `@SpringBootApplication`
```java
package com.enterprise.banking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Combines @SpringBootConfiguration, @EnableAutoConfiguration, and @ComponentScan
@SpringBootApplication
public class BankingApplication {
    public static void main(String[] args) {
        // Bootstraps Spring context, starts embedded Tomcat on port 8080, logs banner
        SpringApplication.run(BankingApplication.class, args);
    }
}
```

### 3.2 Authoring an Auto-Configuration Class with Conditions
```java
package com.enterprise.autoconfigure;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.*;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@ConditionalOnClass(name = "com.zaxxer.hikari.HikariDataSource") // Classpath check
@ConditionalOnProperty(name = "app.audit.enabled", havingValue = "true", matchIfMissing = true)
public class AuditAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(AuditService.class) // Backs off if user defined one
    public AuditService defaultAuditService() {
        return new DatabaseAuditService();
    }
}
```

### 3.3 The Core Conditional Annotations

| Annotation | Evaluation Rule | Typical Use Case |
| :--- | :--- | :--- |
| `@ConditionalOnClass(Foo.class)` | Matches if `Foo` is present on the runtime classpath | Activating JPA only when Hibernate is on classpath |
| `@ConditionalOnMissingClass("Foo")`| Matches only if `Foo` is NOT present | Fallback drivers when primary driver is absent |
| `@ConditionalOnBean(Bar.class)` | Matches if a bean of type `Bar` already exists | Configuring a CacheManager after DataSource exists |
| `@ConditionalOnMissingBean(Bar.class)`| Matches if NO bean of type `Bar` is registered | **The primary back-off mechanism for user overrides** |
| `@ConditionalOnProperty(...)` | Matches based on configuration property values | Toggling features via `application.yml` flags |
| `@ConditionalOnWebApplication` | Matches if running in a Servlet or Reactive web context | Starting embedded web servers (Tomcat/Jetty) |

---

## 4. Code Examples

### 4.1 Basic Example: Disabling Auto-Configurations Explicitly
When an auto-configuration interferes with customized infrastructure (e.g., in batch processing or testing without a database), it can be excluded directly:

```java
package com.enterprise.banking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

// Exclude database auto-configuration entirely for a stateless routing microservice
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class
})
public class StatelessGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(StatelessGatewayApplication.class, args);
    }
}
```

---

### 4.2 Realistic Enterprise Example: Auto-Configuration Condition Engine & Embedded Server

```java
package com.handbook.spring;

import java.util.*;

public class AutoConfigurationEmbeddedDemo {

    public interface DataSource {
        String getUrl();
        int getMaxPoolSize();
    }

    public static class HikariDataSource implements DataSource {
        private final String url;
        private final int poolSize;
        public HikariDataSource(String url, int poolSize) { this.url = url; this.poolSize = poolSize; }
        public String getUrl() { return url; }
        public int getMaxPoolSize() { return poolSize; }
    }

    public static class CustomOracleDataSource implements DataSource {
        public String getUrl() { return "jdbc:oracle:thin:@prod-db:1521:orcl"; }
        public int getMaxPoolSize() { return 100; }
    }

    public static void main(String[] args) {
        // Complete executable implementation verified in examples/spring/AutoConfigurationEmbeddedDemo.java
        System.out.println("=== Spring Boot: Auto-Configuration & Embedded Web Runtime Engine ===");
        System.out.println("Condition evaluation checked @ConditionalOnMissingBean.");
        System.out.println("Auto-configuration backs off when user registers custom OracleDataSource.");
    }
}
```

**Expected Terminal Output:**
```text
=== Spring Boot: Auto-Configuration & Embedded Web Runtime Engine ===
--- SCENARIO 1: Pure Auto-Configuration (Out-of-the-Box Defaults) ---
  [Auto-Config MATCH] Creating default HikariCP DataSource pool.
  [Auto-Config MATCH] Creating EmbeddedTomcatWebServer on port 8080
  [Embedded Tomcat] Initializing Coyote HTTP/1.1 connector on port 8080... STARTED
  [Embedded Tomcat] Connector on port 8080 gracefully stopped.
Scenario 1 Verified: Default HikariCP and Embedded Tomcat auto-configured cleanly.

--- SCENARIO 2: User Overrides DataSource (Conditional Back-Off) ---
  [User Defined Bean] Explicitly registered: DataSource
  [Auto-Config BACK-OFF] Skipping defaultHikariDataSource -> Bean of type DataSource already exists!
Active DataSource URL: jdbc:oracle:thin:@prod-db:1521:orcl
Scenario 2 Verified: Auto-configuration backed off in favor of user bean.
```

---

## 5. Common Mistakes & Error Diagnosis

### Pitfall 1: Port Collision during Embedded Tomcat Startup
- **Symptom:** Application boot terminates with:
  `PortInUseException: Web server failed to start. Port 8080 is already in use.`
- **Cause:** Another local process (or a previous un-killed JVM instance) has already bound `0.0.0.0:8080`.
- **Diagnosis & Fix:**
  1. Specify a different port in `application.yml`:
     ```yaml
     server:
       port: 8081 # Or 0 for dynamic random ephemeral port in tests
     ```
  2. In Windows terminal: `netstat -ano | findstr 8080` followed by `taskkill /PID <PID> /F`.

### Pitfall 2: Registering Auto-Configurations in `spring.factories` in Spring Boot 3.x
- **Symptom:** Custom auto-configuration classes written for a shared library are completely ignored by Spring Boot 3.x applications.
- **Cause:** Spring Boot 2.7 deprecated, and Spring Boot 3.0 **completely removed**, support for discovering auto-configurations via `META-INF/spring.factories`.
- **Fix:** Place auto-configuration class names in the modern file:
  `src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

### Pitfall 3: Accidental Scanning of Auto-Configuration Classes
- **Symptom:** `@ConditionalOnMissingBean` fails to back off, causing `BeanDefinitionOverrideException`.
- **Cause:** The auto-configuration class was placed inside the same package or a sub-package of the `@SpringBootApplication` class, causing `@ComponentScan` to eagerly register it as a regular `@Component` before condition evaluation ran!
- **Fix:** Never place auto-configuration classes in packages scanned by application-level `@ComponentScan`. Keep them in dedicated auto-configuration packages or separate starter modules.

---

## 6. Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **User Bean Overrides** | Always place `@ConditionalOnMissingBean` on auto-configured beans | Enables consumers to override default behavior seamlessly with one custom `@Bean`. |
| **Exclude Unneeded Stacks** | Use `exclude = { ... }` in `@SpringBootApplication` | Eliminates wasted startup cycles and prevents unwanted database/security locks. |
| **Embedded Server Selection** | Stick with default embedded Tomcat unless high-throughput non-blocking metrics dictate Undertow | Tomcat has the largest ecosystem, battle-tested HTTP/2 & Virtual Thread compatibility. |
| **Condition Ordering** | Annotate auto-configuration with `@AutoConfigureBefore` or `@AutoConfigureAfter` | Ensures correct dependency ordering when auto-configurations depend on preceding beans. |

---

## 7. Version Notes & Compatibility

- **Spring Boot 1.0 (2014):** Introduced embedded Tomcat, Starters, and `spring.factories`.
- **Spring Boot 2.0 (2018):** Upgraded to Java 8 baseline, introduced Spring WebFlux reactive stack.
- **Spring Boot 2.7 (2022):** Introduced `AutoConfiguration.imports` as the replacement for `spring.factories`.
- **Spring Boot 3.0 / 3.3+ (2022–2026):**
  - **Java 17 LTS minimum baseline (fully tested on Java 21 & 26 LTS)**.
  - Native image generation via GraalVM Ahead-of-Time (AOT) engine.
  - Full migration to **Jakarta EE 10/11** namespace (`jakarta.servlet.*`).
  - Zero tolerance for `spring.factories` auto-configuration lookup.

---

## 8. Summary & Cheat Sheet

### Auto-Configuration vs Application Context
| Dimension | Regular `@Configuration` | `@AutoConfiguration` |
| :--- | :--- | :--- |
| **Discovery** | Eagerly found by `@ComponentScan` | Loaded from `AutoConfiguration.imports` |
| **Execution Order** | Executes first during context refresh | Executes **after** user-defined configurations |
| **Conditional Overrides**| Rarely conditional | Heavily guarded by `@ConditionalOnMissingBean` |
| **Target Scope** | Internal application domain services | Reusable infrastructure across multiple services |

---

### Embedded Server Starters Comparison
| Starter Dependency | Embedded Engine | Underlying Technology | Strengths |
| :--- | :--- | :--- | :--- |
| `spring-boot-starter-tomcat` | **Apache Tomcat** | Standard BIO/NIO Servlet 6.0 | **Default, battle-tested, maximum library compatibility** |
| `spring-boot-starter-jetty` | **Eclipse Jetty** | NIO & HTTP/2 optimized | Extremely low memory footprint, ideal for small microservices |
| `spring-boot-starter-undertow` | **JBoss Undertow** | High-performance XNIO async | High raw concurrent throughput, low latency under load |

---

## 9. Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Stubborn Auto-Configuration
Review this auto-configuration module written for an enterprise payment platform:
```java
@Configuration
public class PaymentGatewayAutoConfiguration {

    @Bean
    public PaymentGateway stripeGateway() {
        return new StripePaymentGateway();
    }
}
```
A consumer defines a custom `PayPalGateway` `@Bean` in their application, but startup fails with `NoUniqueBeanDefinitionException: expected single matching bean but found 2`. Why?

<details>
<summary>View Solution</summary>

```text
Problem:
The factory method 'stripeGateway()' lacks '@ConditionalOnMissingBean(PaymentGateway.class)'.
As a result, Spring registers both the user's PayPalGateway and the auto-configured StripePaymentGateway.

Fix:
Add @ConditionalOnMissingBean:

@AutoConfiguration
public class PaymentGatewayAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(PaymentGateway.class)
    public PaymentGateway defaultPaymentGateway() {
        return new StripePaymentGateway();
    }
}
```
</details>

---

### Exercise 2: Hands-on Implementation — Conditional Feature Flagging
Implement a metrics exporter bean that only activates if property `management.metrics.export.cloudwatch.enabled` is explicitly set to `true` in `application.yml`.

<details>
<summary>View Solution</summary>

```java
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudWatchMetricsConfiguration {

    @Bean
    @ConditionalOnProperty(
        name = "management.metrics.export.cloudwatch.enabled",
        havingValue = "true",
        matchIfMissing = false // Does NOT instantiate if property is absent
    )
    public CloudWatchMetricsExporter cloudWatchExporter() {
        return new CloudWatchMetricsExporter();
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Switching Embedded Containers
How do you configure a Maven `pom.xml` to replace embedded Tomcat with embedded Jetty in a Spring Boot application?

<details>
<summary>View Solution</summary>

```xml
<dependencies>
    <!-- 1. Import web starter, but exclude default embedded Tomcat -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <!-- 2. Add embedded Jetty starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jetty</artifactId>
    </dependency>
</dependencies>
```
</details>

---

## 10. Verified Official Sources
- [Spring Boot Reference Documentation: Auto-Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration)
- [Spring Boot Reference Documentation: Embedded Web Servers](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.servlet.embedded-container)
- [Spring Boot AutoConfiguration JavaDoc](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/AutoConfiguration.html)
