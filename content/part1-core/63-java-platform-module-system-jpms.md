---
id: topic-63
slug: java-platform-module-system-jpms
topicNumber: 63
title: Java Platform Module System (JPMS)
part: 'Part 1: Java Core'
sectionNumber: 15
sectionTitle: 'Reflection, Annotations & JPMS'
versionBadge: Java 9+ Standard / Strong Encapsulation Java 17 LTS
difficulty: Advanced
readingTime: 7 min read
shortDescription: >-
  Reference: Modular Java architecture via module-info.java (requires, exports, opens, provides, uses), Strong Encapsulation, and jlink lightweight runtime packaging.
prerequisites:
  - 'Topic 21: Packages & Access Modifiers'
  - 'Topic 60: ClassLoaders & JIT Compilation'
  - 'Topic 62: Reflection API & MethodHandles'
---

## Overview
The Java Platform Module System (JPMS / Project Jigsaw, introduced in Java 9 via JSR 376) introduces modular boundaries above packages. It enforces **Reliable Configuration** (validating dependency graphs at startup) and **Strong Encapsulation** (forbidding compile-time and reflective access to unexported packages, even for `public` classes).

---

## `module-info.java` Directives Reference

```java
module com.enterprise.billing {
    // 1. Dependency Requirements
    requires java.base;             // Implicitly required by all modules
    requires transitive java.sql;   // Transitive: downstream consumers also read java.sql

    // 2. Public API Exposure
    exports com.enterprise.billing.api;
    exports com.enterprise.billing.dto to com.enterprise.portal; // Qualified export

    // 3. Reflective Access for Frameworks (Spring, Hibernate, Jackson)
    opens com.enterprise.billing.model to com.fasterxml.jackson.databind;

    // 4. Service Provider Interface (SPI)
    uses com.enterprise.billing.spi.PaymentGateway;
    provides com.enterprise.billing.spi.PaymentGateway with com.enterprise.billing.internal.StripeGateway;
}
```

| Directive | Architectural Purpose | Scope of Exposure |
| :--- | :--- | :--- |
| **`requires <mod>`** | Declares dependency on another module | Compile-time and runtime linkage |
| **`requires transitive <mod>`**| Transitive dependency ("implied readability") | Dependents reading this module also read `<mod>` |
| **`exports <pkg>`** | Exposes `public` types to outside callers | Compile-time API and runtime invocation |
| **`exports <pkg> to <mod>`** | Qualified export: limits access to whitelisted modules | Restricted to named partner modules |
| **`opens <pkg>`** | Permits deep reflection (`setAccessible(true)`) | Runtime reflection only (hidden at compile-time) |
| **`opens <pkg> to <mod>`** | Qualified open: limits deep reflection to framework | Restricted to specified reflection consumers |
| **`uses <serviceInterface>`**| Declares consumption of a Service Provider | Discovered via `java.util.ServiceLoader` |
| **`provides <intf> with <impl>`**| Publishes concrete service provider implementation | Registered in module descriptor |

---

## Strong Encapsulation & The Modular Wall

```
              Module: com.enterprise.core
 ┌─────────────────────────────────────────────────────────────┐
 │ Exports: com.enterprise.core.api                            │
 │   - Public interface OrderService (Accessible to all)       │
 ├─────────────────────────────────────────────────────────────┤
 │ Non-Exported: com.enterprise.core.internal                  │
 │   - Public class FastMemoryCipher                           │
 │   - ACCESSIBLE ONLY within com.enterprise.core              │
 │   - OUTSIDE ACCESS BLOCKED:                                 │
 │       * Compile-time imports fail                           │
 │       * Reflection setAccessible(true) throws               │
 │         InaccessibleObjectException                         │
 └─────────────────────────────────────────────────────────────┘
```

---

## Custom Lightweight Runtimes: `jlink`

JPMS enables `jlink` to bundle only the necessary JDK modules into a stripped-down native runtime image, eliminating the monolithic JDK:

```bash
# Creates a minimal custom JRE (~35 MB instead of standard 400 MB JDK)
jlink --module-path $JAVA_HOME/jmods:out \
      --add-modules com.enterprise.billing \
      --strip-debug \
      --compress=2 \
      --no-header-files \
      --no-man-pages \
      --output dist/custom-jre
```

---

## Implementation Example: SPI ServiceLoader Discovery

```java
package com.enterprise.billing;

import java.util.ServiceLoader;

public class ModuleBootstrapDemo {
    public interface TelemetrySink {
        void record(String metric);
    }

    public static void main(String[] args) {
        // Discovers all providers registered via 'provides ... with' in module-info
        ServiceLoader<TelemetrySink> sinks = ServiceLoader.load(TelemetrySink.class);

        int discoveredCount = 0;
        for (TelemetrySink sink : sinks) {
            sink.record("system.startup=true");
            discoveredCount++;
        }

        System.out.println("Discovered and notified SPI providers: " + discoveredCount);
    }
}
```

### Execution Output:
```text
Discovered and notified SPI providers: 0
```

---

## Pitfalls

- **Cyclic Dependencies Forbidden:** Unlike the legacy classpath which allowed circular JAR dependencies, JPMS forbids module cycles (`Module A` requires `B`, `B` requires `A`) and triggers a compile-time error.
- **Split Packages Prohibited:** Two modules cannot export the exact same package name (`package com.app.util` declared in both Module 1 and Module 2). This causes an immediate compilation and startup failure.
- **`InaccessibleObjectException` Under Java 17+:** In Java 17, strong encapsulation is enforced by default (`--illegal-access=permit` was permanently removed). Calling `setAccessible(true)` on non-opened packages throws `InaccessibleObjectException`. Add `opens <pkg>` or `--add-opens` JVM flags.

---

## Practice

### Question
What is the difference between `exports com.app.model;` and `opens com.app.model;` in `module-info.java`?

### Explanation
1. `exports com.app.model;` exposes public types in that package for normal compile-time compilation and standard runtime invocation by other modules. However, it does NOT allow other modules to inspect private members via deep reflection.
2. `opens com.app.model;` permits runtime deep reflection (`setAccessible(true)` on private fields/methods) by frameworks (such as Jackson or Hibernate), while hiding the package from compile-time imports.
