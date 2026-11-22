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

### The Master Tri-Part Classification Matrix

#### A. Domain 1: Java SE Core Annotations (`java.lang.*`)
- **`@Override`:** Instructs the compiler that the annotated method must override a declaration in a superclass or interface.
- **`@Deprecated`:** Marks program elements as obsolete, emitting compiler warnings during compilation.
- **`@SuppressWarnings`:** Suppresses specific compiler warnings (e.g. `unchecked`, `rawtypes`, `deprecation`).
- **`@FunctionalInterface`:** Enforces that an interface contains exactly one abstract method, ensuring lambda compatibility.
- **`@SafeVarargs`:** Asserts that a method body does not perform unsafe operations on its varargs parameter array.

#### B. Domain 2: Jakarta EE Standards Annotations (`jakarta.*`)
- **Persistence (`jakarta.persistence.*`):**
  - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`: Declares relational mapping and primary key strategies.
  - `@Column`, `@Enumerated`, `@Lob`, `@Temporal`: Attribute-level database mappings.
  - `@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@JoinColumn`: Relational associations and foreign keys.
- **Validation (`jakarta.validation.constraints.*`):**
  - `@NotNull`, `@NotBlank`, `@NotEmpty`: Null and empty checks on fields.
  - `@Size`, `@Min`, `@Max`, `@Pattern`, `@Email`: Boundary and format validations.
  - `@Valid`: Cascades recursive validation on nested objects.
- **Dependency Injection (`jakarta.inject.*`):**
  - `@Inject`: Identifies injectable constructors, methods, and fields.
  - `@Named`: Qualifies injection candidates by string identifier.

#### C. Domain 3: Spring Framework & Spring Boot Annotations (`org.springframework.*`)
- **Stereotypes & IoC:**
  - `@SpringBootApplication`: Composed meta-annotation (`@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`).
  - `@Component`, `@Service`, `@Repository`, `@Controller`, `@RestController`: Bean stereotypes.
  - `@Configuration`, `@Bean`, `@Scope`, `@Lazy`, `@Primary`, `@Qualifier`: Factory methods and bean wiring.
- **Web MVC & HTTP Semantics:**
  - `@RequestMapping`, `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: HTTP routing.
  - `@PathVariable`, `@RequestParam`, `@RequestBody`, `@RequestHeader`: Parameter binding.
  - `@RestControllerAdvice`, `@ExceptionHandler`, `@ResponseStatus`: Global exception interception.
- **Data & Transactions:**
  - `@Transactional`: Declarative ACID boundaries with propagation and rollback rules.
  - `@Query`, `@Modifying`, `@EntityGraph`: Custom repository queries and fetch optimizations.
- **Security:**
  - `@EnableWebSecurity`, `@EnableMethodSecurity`: Security engine activation.
  - `@PreAuthorize`, `@PostAuthorize`, `@Secured`: Method-level authorization rules.

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
