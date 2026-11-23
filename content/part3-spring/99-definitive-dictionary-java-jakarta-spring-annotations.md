---
id: topic-99
slug: definitive-dictionary-java-jakarta-spring-annotations
topicNumber: 99
title: 'The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations'
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 29
sectionTitle: Master Annotations Reference Dictionary
versionBadge: Spring Boot 3.x / Jakarta EE 10 / Java 21+
difficulty: Intermediate
readingTime: 20 min read
shortDescription: >-
  The definitive, cross-referenced architectural dictionary categorizing and
  comparing core annotations across Java SE Core, Jakarta EE enterprise
  specifications, and the Spring Boot production ecosystem.
prerequisites:
  - 'Topic 58: Annotations & Metadata'
  - 'Topic 84: Jakarta Contexts and Dependency Injection (CDI)'
  - >-
    Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle
    Callbacks
---
## Overview
This architectural dictionary catalogs and compares the core declarative annotations across Java SE, Jakarta EE, and Spring Boot, detailing their lifecycle targets, retention policies, and runtime processing mechanisms.

---

---

## Architecture & Core Mechanics

### Meta-Annotations Foundation
Meta-annotations are annotations applied to other annotation declarations:

| Meta-Annotation | Target Element | Purpose |
| :--- | :--- | :--- |
| `@Retention` | `ANNOTATION_TYPE` | Specifies retention: `SOURCE` (discarded), `CLASS` (kept in `.class`), `RUNTIME` (retained in heap for reflection). |
| `@Target` | `ANNOTATION_TYPE` | Specifies Java language elements: `TYPE`, `METHOD`, `FIELD`, `PARAMETER`, `RECORD_COMPONENT`. |
| `@Inherited` | `ANNOTATION_TYPE` | Child subclasses inherit the annotation automatically from parent classes. |
| `@Repeatable` | `ANNOTATION_TYPE` | Allows declaring the same annotation multiple times on a single target element. |

---

### The Master Tri-Domain Architectural Classification Directory

The enterprise Java ecosystem relies on three foundational annotation domains: **Java SE Core**, **Jakarta EE Standards**, and the **Spring Framework Ecosystem**. The matrices below provide an authoritative, cross-referenced catalog detailing specification packages, retention policies, runtime targets, and production code usage.

#### 1. Domain 1: Java SE Core Annotations (`java.lang.*` & `java.lang.annotation.*`)

| Annotation | Package | Target Element | Retention | Core Purpose & Production Behavior | Production Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`@Override`** | `java.lang` | `METHOD` | `SOURCE` | Enforces compiler check that method matches a superclass/interface signature. | `@Override public String toString()` |
| **`@Deprecated`** | `java.lang` | All Elements | `RUNTIME` | Warns callers against using obsolete or scheduled-for-removal APIs. | `@Deprecated(since = "3.1", forRemoval = true)` |
| **`@SuppressWarnings`** | `java.lang` | All Elements | `SOURCE` | Suppresses specified compiler warnings (`"unchecked"`, `"rawtypes"`). | `@SuppressWarnings("unchecked")` |
| **`@FunctionalInterface`** | `java.lang` | `TYPE` | `RUNTIME` | Validates interface has exactly one abstract method for lambda compatibility. | `@FunctionalInterface public interface Processor<T>` |
| **`@SafeVarargs`** | `java.lang` | `CONSTRUCTOR`, `METHOD` | `RUNTIME` | Suppresses compiler warnings when manipulating generic varargs array elements. | `@SafeVarargs public static <T> List<T> of(T... items)` |
| **`@Retention`** | `java.lang.annotation` | `ANNOTATION_TYPE` | `RUNTIME` | Defines bytecode retention: `SOURCE`, `CLASS`, or reflection-accessible `RUNTIME`. | `@Retention(RetentionPolicy.RUNTIME)` |
| **`@Target`** | `java.lang.annotation` | `ANNOTATION_TYPE` | `RUNTIME` | Restricts language target elements (`TYPE`, `METHOD`, `FIELD`, `PARAMETER`). | `@Target({ElementType.METHOD, ElementType.TYPE})` |
| **`@Inherited`** | `java.lang.annotation` | `ANNOTATION_TYPE` | `RUNTIME` | Subclasses automatically inherit the annotation from annotated superclasses. | `@Inherited public @interface Auditable {}` |
| **`@Repeatable`** | `java.lang.annotation` | `ANNOTATION_TYPE` | `RUNTIME` | Enables multiple declarations of the same annotation on a single element. | `@Repeatable(Schedules.class)` |

#### 2. Domain 2: Jakarta EE Standards Annotations (`jakarta.*`)

| Annotation | Specification Package | Applicable Target | Architectural Semantic & Container Role | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Entity`** | `jakarta.persistence` | `TYPE` | Declares a JPA managed entity class mapped to a relational database table. | `@Entity @Table(name = "users") public class User` |
| **`@Id`** | `jakarta.persistence` | `FIELD`, `METHOD` | Marks the primary key attribute of the relational entity. | `@Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;` |
| **`@Column`** | `jakarta.persistence` | `FIELD`, `METHOD` | Maps property to database column with constraints (`name`, `nullable`, `unique`, `length`). | `@Column(name = "email_address", nullable = false, unique = true)` |
| **`@OneToMany`** | `jakarta.persistence` | `FIELD`, `METHOD` | Configures 1-to-N relational association with `mappedBy`, cascade, and fetch rules. | `@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)` |
| **`@ManyToOne`** | `jakarta.persistence` | `FIELD`, `METHOD` | Configures N-to-1 association with foreign key column (always defaults to `FetchType.LAZY` in production!). | `@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "customer_id")` |
| **`@Version`** | `jakarta.persistence` | `FIELD`, `METHOD` | Enables optimistic concurrency control via integer/timestamp column. | `@Version private Long version;` |
| **`@NotNull`** | `jakarta.validation.constraints` | `FIELD`, `PARAM` | Enforces non-null data integrity validation across layers. | `@NotNull(message = "ID required") Long id;` |
| **`@NotBlank`** | `jakarta.validation.constraints` | `FIELD`, `PARAM` | Value must be non-null and contain at least one non-whitespace character. | `@NotBlank(message = "Username cannot be empty") String username;` |
| **`@Size`** | `jakarta.validation.constraints` | `FIELD`, `PARAM` | Validates string length or collection element bounds within inclusive min/max. | `@Size(min = 8, max = 32) String password;` |
| **`@Valid`** | `jakarta.validation` | `FIELD`, `PARAM` | Triggers recursive cascading validation on nested objects or collections. | `@Valid @NotNull Address billingAddress;` |
| **`@Inject`** | `jakarta.inject` | `CONSTRUCTOR`, `METHOD`, `FIELD` | Identifies injectable dependencies for type-safe CDI / Spring injection. | `@Inject public OrderService(PaymentGateway gw)` |
| **`@WebServlet`** | `jakarta.servlet.annotation` | `TYPE` | Declares an `HttpServlet` component with URL mapping and loadOnStartup ordering. | `@WebServlet(urlPatterns = {"/api/*"}, loadOnStartup = 1)` |
| **`@Path`** | `jakarta.ws.rs` | `TYPE`, `METHOD` | Declares URI template routing in JAX-RS REST endpoints. | `@Path("/orders/{id}") public class OrderResource` |

#### 3. Domain 3: Spring Framework & Spring Boot Ecosystem (`org.springframework.*`)

| Annotation | Module / Package | Applicable Target | Container Mechanics & Best Practices | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@SpringBootApplication`** | `org.springframework.boot` | `TYPE` | Composed meta-annotation combining `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. | `@SpringBootApplication public class Application { public static void main(String[] a) { SpringApplication.run(Application.class, a); } }` |
| **`@Component`** | `org.springframework.stereotype` | `TYPE` | Base stereotype marking class as candidate for automatic component scanning. | `@Component public class OrderValidator {}` |
| **`@Service`** | `org.springframework.stereotype` | `TYPE` | Business service stereotype orchestrating transactions and workflows. | `@Service public class OrderServiceImpl implements OrderService {}` |
| **`@Repository`** | `org.springframework.stereotype` | `TYPE` | Persistence layer stereotype with automatic `DataAccessException` translation. | `@Repository public class UserDaoImpl implements UserDao {}` |
| **`@RestController`** | `org.springframework.web.bind.annotation` | `TYPE` | Meta-annotation combining `@Controller` + `@ResponseBody` for REST APIs. | `@RestController @RequestMapping("/api/orders")` |
| **`@Configuration`** | `org.springframework.context.annotation` | `TYPE` | Declares Java-based bean factory class with CGLIB proxying. | `@Configuration public class AppConfig {}` |
| **`@Bean`** | `org.springframework.context.annotation` | `METHOD` | Declares factory method returning a container-managed bean singleton. | `@Bean public ObjectMapper mapper() { return new ObjectMapper(); }` |
| **`@Autowired`** | `org.springframework.beans.factory.annotation` | `CONSTRUCTOR`, `FIELD` | Injects dependency by type. Optional in single-constructor classes. | `@Autowired public OrderService(PaymentGateway gw)` |
| **`@Qualifier`** | `org.springframework.beans.factory.annotation` | `FIELD`, `PARAM` | Resolves autowiring ambiguity by matching candidate bean name. | `@Qualifier("stripeGateway") PaymentGateway gw` |
| **`@Value`** | `org.springframework.beans.factory.annotation` | `FIELD`, `PARAM` | Injects property value from externalized YAML/properties or SpEL. | `@Value("${server.port:8080}") int port;` |
| **`@GetMapping`** | `org.springframework.web.bind.annotation` | `METHOD` | Maps HTTP `GET` requests with optional path and produces rules. | `@GetMapping("/{id}") public OrderDto getOrder(@PathVariable Long id)` |
| **`@PostMapping`** | `org.springframework.web.bind.annotation` | `METHOD` | Maps HTTP `POST` requests for resource creation. | `@PostMapping public ResponseEntity<OrderDto> create(@RequestBody OrderDto dto)` |
| **`@PathVariable`** | `org.springframework.web.bind.annotation` | `PARAMETER` | Extracts URI template variable tokens from matching URL patterns. | `public OrderDto get(@PathVariable("id") Long id)` |
| **`@RequestParam`** | `org.springframework.web.bind.annotation` | `PARAMETER` | Extracts query parameters (`?page=0&size=20`) with optional defaults. | `public Page<Order> list(@RequestParam(defaultValue = "0") int page)` |
| **`@RequestBody`** | `org.springframework.web.bind.annotation` | `PARAMETER` | Deserializes HTTP request JSON payload into Java record / POJO. | `public Order create(@Valid @RequestBody OrderRequest req)` |
| **`@RestControllerAdvice`** | `org.springframework.web.bind.annotation` | `TYPE` | Centralized global exception handler combining advice and response body. | `@RestControllerAdvice public class GlobalExceptionHandler` |
| **`@ExceptionHandler`** | `org.springframework.web.bind.annotation` | `METHOD` | Handles declared exception types thrown across all REST controllers. | `@ExceptionHandler(OrderNotFoundException.class) public ProblemDetail handle()`

---

## Production Implementation

### Basic Example: Meta-Annotation Composition
```java
package com.handbook.spring;

import java.lang.annotation.*;

public class BasicAnnotationCompositionDemo {

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface EnterpriseService {
        String serviceName();
    }

    @EnterpriseService(serviceName = "OrderProcessingService")
    public static class OrderService {
        public void execute() {
            System.out.println("[Service] Order processed successfully.");
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Spring Annotation Architecture: Metadata Reflection ---");
        Class<?> clazz = OrderService.class;
        if (clazz.isAnnotationPresent(EnterpriseService.class)) {
            EnterpriseService meta = clazz.getAnnotation(EnterpriseService.class);
            System.out.println("Discovered Enterprise Service metadata: " + meta.serviceName());
        }
    }
}
```

**Expected Terminal Output:**
```text
--- Spring Annotation Architecture: Metadata Reflection ---
Discovered Enterprise Service metadata: OrderProcessingService
```

---

### Realistic Enterprise Example: Verified Annotations Dictionary Demo
```java
package com.handbook.spring;

import java.lang.annotation.*;
import java.lang.reflect.Method;

public class AnnotationMetadataDictionaryDemo {

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    public @interface TriPartCategory {
        String domain();
        String standard();
    }

    @TriPartCategory(domain = "Spring Boot", standard = "Spring Framework 6.x")
    public static class SampleDomainService {
        public void process() {
            System.out.println("Processing business logic inside verified domain service.");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 100: Definitive Annotations Dictionary ===");

        Class<?> target = SampleDomainService.class;
        TriPartCategory category = target.getAnnotation(TriPartCategory.class);

        System.out.printf("Inspected Class: %s%n", target.getSimpleName());
        System.out.printf("  Domain: %s | Standard: %s%n", category.domain(), category.standard());

        System.out.println("Topic 100 Definitive Annotations Dictionary verified successfully.");
    }
}
```

---

## Common Pitfalls & Traps

### Pitfall 1: Importing `jakarta.transaction.Transactional` Instead of Spring's `@Transactional`
- **Symptom:** Attribute options like `readOnly = true` or `rollbackFor = Exception.class` fail to compile.
- **Cause:** Accidentally importing `jakarta.transaction.Transactional` from the Jakarta EE spec instead of `org.springframework.transaction.annotation.Transactional`. The Jakarta annotation lacks Spring's rich rollback rules and `readOnly` optimizations.
- **Diagnosis & Fix:** Verify your imports in Spring Boot services:
  ```java
  // INCORRECT:
  import jakarta.transaction.Transactional;

  // CORRECT:
  import org.springframework.transaction.annotation.Transactional;
  ```

### Pitfall 2: Using `@Retention(RetentionPolicy.SOURCE)` on Custom Annotations Intended for Reflection
- **Symptom:** `clazz.isAnnotationPresent(MyAnnotation.class)` returns `false` at runtime.
- **Cause:** By default, if `@Retention` is omitted or set to `SOURCE` / `CLASS`, the JVM discards the annotation when loading the class into heap memory.
- **Diagnosis & Fix:** Always specify `@Retention(RetentionPolicy.RUNTIME)` for annotations inspected by Spring IoC, reflection, or AOP interceptors.

### Pitfall 3: Annotation Conflict: `@Controller` with Missing `@ResponseBody`
- **Symptom:** API returns `404 Not Found` or `Circular view path` errors when returning a Java DTO.
- **Cause:** Using `@Controller` instead of `@RestController`. `@Controller` expects to resolve an HTML template name (e.g. Thymeleaf/JSP).
- **Diagnosis & Fix:** Use composed `@RestController`, which combines `@Controller` and `@ResponseBody` to serialize return values to JSON.

---

## Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **Transaction Annotation** | Use Spring's `@Transactional` | Supports `readOnly = true`, timeout parameters, and explicit `rollbackFor` arrays. |
| **Validation Annotation** | Use Jakarta Bean Validation | Standardized across JPA entities and REST DTOs (`@NotNull`, `@Size`). |
| **Dependency Injection** | Prefer constructor injection without `@Autowired` | Clean, immutable, test-friendly, and container-independent. |
| **Stereotype Selection** | Use `@Service` and `@Repository` | Enables automated persistence exception translation and distinct logging aspects. |

---

## Version Notes & Compatibility

- **Java EE to Jakarta EE (Spring Boot 3.0+):** All enterprise specifications moved from `javax.*` to `jakarta.*`.
- **Spring Framework 6.0+:**
  - Deprecated `@EnableGlobalMethodSecurity` in favor of `@EnableMethodSecurity`.
  - Full support for Java 21+ record annotations on record components (`@Target(ElementType.RECORD_COMPONENT)`).

---

## Summary & Cheat Sheet

| Capability | Jakarta EE Standard | Spring Boot Equivalent | Architectural Recommendation |
| :--- | :--- | :--- | :--- |
| **Dependency Injection** | `@Inject` | `@Autowired` | Use constructor injection; annotations are optional in modern Spring. |
| **Component Marker** | `@Named` | `@Component` | Use `@Component` in Spring applications. |
| **Transaction Boundary** | `jakarta.transaction.@Transactional` | `org.springframework...Transactional` | Use Spring's `@Transactional` for rich rollback controls. |
| **REST Controller** | `@Path` (JAX-RS) | `@RestController` (Spring MVC) | Use `@RestController` in Spring Boot microservices. |
| **Bean Validation** | `jakarta.validation.@Valid` | `jakarta.validation.@Valid` | Both standards leverage the same Jakarta Bean Validation engine. |

---

## Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Incompatible Transactional Annotation Import
Review the following service class:
```java
package com.handbook.spring.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Transactional(readOnly = true)
    public Order findOrder(Long id) {
        return orderRepo.findById(id).orElseThrow();
    }
}
```
Why does this class fail to compile, and how is it fixed?

<details>
<summary>View Solution</summary>

**Cause:**
`jakarta.transaction.Transactional` is the Jakarta EE standard annotation, which does not have a `readOnly` attribute.

**The Fix:**
Import Spring's transactional annotation:
```java
import org.springframework.transaction.annotation.Transactional;
```
</details>

---

### Exercise 2: Hands-on Implementation — Authoring a Composed Meta-Annotation (`@SecuredRestService`)
Create a custom meta-annotation `@SecuredRestService` that combines `@RestController`, `@Validated`, and `@CrossOrigin(origins = "*")` into a single reusable annotation.

<details>
<summary>View Solution</summary>

```java
package com.handbook.spring.annotation;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RestController
@Validated
@CrossOrigin(origins = "*")
public @interface SecuredRestService {
    String value() default "";
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Detecting Transitive Annotations on CGLIB Proxies
<details>
<summary>View Solution</summary>
**Question:** In Spring Boot, when a service is wrapped in a transactional or security CGLIB proxy (`OrderService$$SpringCGLIB$$0`), why does standard Java reflection `targetClass.getAnnotation(MyAnnotation.class)` sometimes return `null`, and what Spring utility class resolves this?

**Solution:**
1. **The CGLIB Subclass Problem:** CGLIB generates a dynamic subclass extending the original class. If the custom annotation is not annotated with `@Inherited`, the subclass does not inherit the annotation from its superclass.
2. **The Solution:** Always use Spring's **`AnnotatedElementUtils`** or **`AnnotationUtils`**:
   ```java
   MyAnnotation ann = AnnotatedElementUtils.findMergedAnnotation(targetClass, MyAnnotation.class);
   ```
   Spring's utility traverses the entire inheritance hierarchy, unrolls CGLIB proxy wrappers, and detects composed meta-annotations recursively.
</details>

---

## Verified Official Sources
- [Spring Framework Reference: Annotation Programming Model](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config.html)
- [Jakarta Annotations Specification 2.1](https://jakarta.ee/specifications/annotations/2.1/)
- [Java SE 21 Language Specification: Annotations](https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html#jls-9.6)

---

## Practice

### Q: What is the architectural difference between `@Component` and `@Bean` in Spring?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** `@Component` is a class-level annotation indicating auto-detection through classpath scanning. `@Bean` is a method-level annotation used within `@Configuration` classes, providing explicit programmatic bean instantiation—essential when configuring third-party library classes whose source code cannot be annotated with `@Component`.
</details>
