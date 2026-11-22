---
id: topic-61
slug: annotations-and-metadata
topicNumber: 61
title: Annotations & Metadata
part: 'Part 1: Java Core'
sectionNumber: 15
sectionTitle: 'Reflection, Annotations & JPMS'
versionBadge: Java 5+ / Enhanced Java 8 & 9
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Declarative metadata via @interface, meta-annotations (@Retention, @Target, @Inherited, @Repeatable), permitted element types, and reflection parsing.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 26: Interfaces & Modern Interface Evolution'
---

## Overview
Annotations (`@interface`, introduced in Java 5) attach declarative metadata to program elements (classes, methods, fields, parameters). While annotations do not directly modify runtime bytecode instructions on their own, they are parsed at compile time by annotation processors (APT) or at runtime via reflection by frameworks (Spring, Hibernate, JUnit).

---

## Meta-Annotations Taxonomy

```
                       Meta-Annotation Architecture
 ┌──────────────────────────────────────────────────────────────────┐
 │ @Retention(RetentionPolicy.RUNTIME) ──► Retained in Heap Metaspace│
 ├──────────────────────────────────────────────────────────────────┤
 │ @Target(ElementType.METHOD)         ──► Restricts target element │
 ├──────────────────────────────────────────────────────────────────┤
 │ @Inherited                          ──► Inherited by subclasses  │
 ├──────────────────────────────────────────────────────────────────┤
 │ @Repeatable(Tags.class)             ──► Allows multiple tags     │
 └──────────────────────────────────────────────────────────────────┘
```

### Retention Policies (`java.lang.annotation.RetentionPolicy`)

| Policy | Discarded When? | Present in `.class` File? | Accessible via Reflection? | Example Standard Use |
| :--- | :--- | :---: | :---: | :--- |
| **`SOURCE`** | During compilation | No | No | `@Override`, `@SuppressWarnings`, Lombok |
| **`CLASS`** (Default)| During class loading | **Yes** | No | Bytecode analysis, ProGuard, bytecode tools |
| **`RUNTIME`** | Never (Retained in VM) | **Yes** | **Yes** | Spring `@Autowired`, JUnit `@Test`, JPA `@Entity`|

---

## Annotation Attribute Rules

Attributes are declared like parameterless interface methods:

```java
public @interface RateLimit {
    int requestsPerMinute() default 60; // Optional attribute with default
    String role() default "USER";
    String[] tags() default {};          // 1D Array permitted
}
```

- **Permitted Return Types:** Primitive types (`int`, `boolean`, etc.), `String`, `Class<?>`, `enum` types, other annotation types, and single-dimensional arrays of these types.
- **Prohibited Types:** Nested collections (`List<String>`), multidimensional arrays, or general class instances.
- **The `value()` Attribute Shortcut:** If an annotation defines an attribute named `value()`, callers can omit the attribute name: `@Service("payment")` is equivalent to `@Service(value = "payment")`.

---

## Implementation Example: Runtime Annotation Parsing

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

public class AnnotationProcessingDemo {
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    public @interface RequiresRole {
        String value(); // Shortcut value attribute
        int minimumSecurityTier() default 1;
    }

    public static class AdminEndpoint {
        @RequiresRole(value = "SUPER_ADMIN", minimumSecurityTier = 3)
        public void purgeDatabase() {
            System.out.println("Executing destructive database purge...");
        }

        public void publicPing() {
            System.out.println("PONG");
        }
    }

    public static void main(String[] args) throws Exception {
        Class<?> clazz = AdminEndpoint.class;

        for (Method method : clazz.getDeclaredMethods()) {
            // Check if annotation is present
            if (method.isAnnotationPresent(RequiresRole.class)) {
                RequiresRole guard = method.getAnnotation(RequiresRole.class);
                System.out.printf("Guarded Method: [%s] -> Required Role: %s (Tier %d)%n",
                        method.getName(), guard.value(), guard.minimumSecurityTier());
            } else {
                System.out.printf("Public Method : [%s] (Unguarded)%n", method.getName());
            }
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Guarded Method: [purgeDatabase] -> Required Role: SUPER_ADMIN (Tier 3)
Public Method : [publicPing] (Unguarded)
```
</details>

---

## Pitfalls

- **Forgetting `@Retention(RetentionPolicy.RUNTIME)`:** Without an explicit retention meta-annotation, custom annotations default to `RetentionPolicy.CLASS`. Invoking `method.getAnnotation()` at runtime returns `null` silently without error.
- **Non-Constant Expression in Values:** Attribute arguments must be compile-time constants (literals or `static final` primitives). Passing runtime variables (`@Tag(UUID.randomUUID().toString())`) causes a compilation error.
- **Null Return Prohibited in Annotation Methods:** Annotation attributes can never return or default to `null`. Use sentinels like `""` or `void.class` to represent absence.

---

## Practice

### Question
Why does `method.getAnnotation(MyTag.class)` return `null` in the snippet below?
```java
@Target(ElementType.METHOD)
public @interface MyTag {
    String value();
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `MyTag` declares `@Target(ElementType.METHOD)` but does NOT declare `@Retention`.
2. When `@Retention` is omitted, the Java compiler applies the default retention policy: `RetentionPolicy.CLASS`.
3. Under `RetentionPolicy.CLASS`, the annotation is recorded in the `.class` bytecode file, but is discarded by the JVM during class loading.
4. It is not loaded into Metaspace and is therefore invisible to the reflection API.
5. Fix: Add `@Retention(RetentionPolicy.RUNTIME)`.

</details>
