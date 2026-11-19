---
id: topic-60
slug: java-platform-module-system-jpms
topicNumber: 60
title: Java Platform Module System (JPMS)
part: 'Part 1: Java Core'
sectionNumber: 15
sectionTitle: 'Reflection, Annotations & JPMS'
versionBadge: Java 9+ Standard / Strong Encapsulation Java 17 LTS
difficulty: Advanced
readingTime: 13 min read
shortDescription: >-
  Master the Java Module System: module-info.java, exports, requires, opens,
  strong encapsulation, and custom runtime images with jlink.
prerequisites:
  - 'Topic 18: Packages and Access Modifiers'
  - 'Topic 57: ClassLoaders & JIT Compilation'
  - 'Topic 59: Reflection API & MethodHandles'
---
# Java Platform Module System (JPMS)

### 1. What It Is and Why It Exists
Before Java 9, the Java runtime suffered from architectural vulnerabilities collectively known as **"JAR Hell"** and **"Classpath Hell"**:
- **Monolithic Runtime**: The entire `rt.jar` runtime weighed over 60 MB. Even a tiny IoT program printing `"Hello World"` required deploying the entire monolithic runtime including GUI classes (AWT, Swing) and CORBA.
- **Fragile Classpath**: If a required class was missing or duplicate JARs contained conflicting versions of the same class, errors were only discovered at runtime when the classloader threw `NoClassDefFoundError`.
- **Zero Package Encapsulation**: Any `public` class in a package was visible to any other code on the classpath. Internal library implementation details (such as `sun.misc.Unsafe`) could not be hidden from external callers.

Java 9 introduced the **Java Platform Module System (JPMS)** (Project Jigsaw / JSR 376). JPMS modularized the JDK into distinct, self-describing modules (`java.base`, `java.sql`, `java.desktop`) and introduced a higher level of abstraction above packages: the **Java Module**.
- **Reliable Configuration**: Modules explicitly declare their dependencies via `requires`. The JVM verifies the entire dependency graph at startup before executing a single line of bytecode.
- **Strong Encapsulation**: A module explicitly controls which packages are public using `exports`. Non-exported packages are completely hidden—even `public` classes inside them cannot be accessed by external modules, neither at compile time nor via reflection!

**Real-World Analogy:**
Imagine shipping cargo. Prior to JPMS, shipping was like dumping thousands of loose tools into one giant cargo hold (the classpath). Anyone could reach in and grab any tool, and missing tools were only noticed in mid-voyage. JPMS introduced standard ISO shipping containers (**Modules**). Each container has a customs manifest (**`module-info.java`**) taped to its door stating: "This container requires 200V electric power (dependencies), and only the front window is open for transactions (exports); the interior engine room is locked and inaccessible (strong encapsulation)."

---

### 2. Prerequisites
- **Packages and Access Modifiers (Topic 18)**: Understanding `public`, `protected`, `default`, and `private`.
- **ClassLoaders (Topic 57)**: Understanding how the JVM discovers and loads classes.
- **Reflection (Topic 59)**: Understanding reflective access and `setAccessible`.

---

### 3. Syntax Breakdown

#### 3.1 The Module Declaration: `module-info.java`
Every module contains a `module-info.java` file placed in the root of its source directory:
```java
module com.example.billing {
    // 1. Module Dependencies
    requires com.example.core;
    requires transitive java.sql;   // Transitive: dependents also read java.sql

    // 2. Exported API Packages (Visible to outside world)
    exports com.example.billing.api;
    exports com.example.billing.dto to com.example.frontend; // Qualified export

    // 3. Reflective Open Access (For ORMs, frameworks, and reflection)
    opens com.example.billing.entity to org.hibernate.orm.core;

    // 4. Service Discovery (SPI)
    uses com.example.spi.PaymentGateway;
    provides com.example.spi.PaymentGateway with com.example.billing.StripeGateway;
}
```

#### 3.2 Key Directives Explained
- `requires <module>`: Declares that this module depends on another module.
- `requires transitive <module>`: Any module that requires this module automatically acquires a dependency on the transitive module.
- `requires static <module>`: Compile-time only dependency (optional at runtime).
- `exports <package>`: Exports all public classes and interfaces in the specified package to outside modules.
- `opens <package>`: Grants deep reflective access (`setAccessible(true)`) to runtime frameworks without exposing compile-time types.
- `open module <name>`: Shorthand opening all packages in the module to reflection.
- `uses <service-interface>`: Declares that the module consumes a service via `ServiceLoader`.
- `provides <interface> with <implementation>`: Declares a concrete service provider implementation.

---

### 4. Code Examples

#### Example 1: Programmatic Module Descriptor Inspection
The following example inspects module descriptors, exports, and opens status programmatically using the JPMS reflection API (`java.lang.Module` and `java.lang.module.ModuleDescriptor`):

```java
import java.lang.module.ModuleDescriptor;
import java.util.Set;

public class ModuleDescriptorDemo {
    public static void main(String[] args) {
        System.out.println("=== JPMS Module Descriptor Inspection ===");

        // 1. Inspect java.base core module
        Module baseModule = String.class.getModule();
        System.out.println("Current Module Name: " + baseModule.getName());
        System.out.println("Is Named Module:     " + baseModule.isNamed());

        ModuleDescriptor descriptor = baseModule.getDescriptor();
        if (descriptor != null) {
            System.out.println("Descriptor Version:  " + descriptor.version().orElse(null));
            System.out.println("Total Exports:       " + descriptor.exports().size() + " packages");
            System.out.println("IsOpen (Deep Refl):  " + descriptor.isOpen());

            boolean exportsJavaUtil = baseModule.isExported("java.util");
            System.out.println("Exports 'java.util': " + exportsJavaUtil);
        }

        // 2. Inspect Unnamed Module for application classpath classes
        Module appModule = ModuleDescriptorDemo.class.getModule();
        System.out.println("\nApplication Class Module Name: '" + appModule.getName() + "' (null = Unnamed Module)");
        System.out.println("Is Named Module: " + appModule.isNamed());
    }
}
```

**Expected Output:**
```text
=== JPMS Module Descriptor Inspection ===
Current Module Name: java.base
Is Named Module:     true
Descriptor Version:  26.0.1
Total Exports:       116 packages
IsOpen (Deep Refl):  false
Exports 'java.util': true

Application Class Module Name: 'null' (null = Unnamed Module)
Is Named Module: false
```

#### Example 2: Realistic Application — Modular Service Provider Discovery (`ServiceLoader`)
In modular architectures, applications decouple API interfaces from implementations using the Service Provider Interface (SPI) pattern:

```java
import java.util.ArrayList;
import java.util.List;
import java.util.ServiceLoader;

public class ModularServicePluginApp {
    public interface PaymentCodec {
        String format();
        String encode(String payload);
    }

    public static class JsonPaymentCodec implements PaymentCodec {
        @Override
        public String format() { return "JSON"; }
        @Override
        public String encode(String payload) { return "{\"data\": \"" + payload + "\"}"; }
    }

    public static class XmlPaymentCodec implements PaymentCodec {
        @Override
        public String format() { return "XML"; }
        @Override
        public String encode(String payload) { return "<data>" + payload + "</data>"; }
    }

    public static void main(String[] args) {
        System.out.println("Starting Modular Service Discovery App...");

        List<PaymentCodec> registeredCodecs = List.of(
                new JsonPaymentCodec(),
                new XmlPaymentCodec()
        );

        System.out.println("Discovered Codec Plugins: " + registeredCodecs.size());
        for (PaymentCodec codec : registeredCodecs) {
            String encoded = codec.encode("TXN-3001");
            System.out.printf("  Codec [%s] output: %s%n", codec.format(), encoded);
        }

        ServiceLoader<PaymentCodec> loader = ServiceLoader.load(PaymentCodec.class);
        System.out.println("ServiceLoader instantiated: " + loader.getClass().getSimpleName());
        System.out.println("Modular Service Plugin App completed successfully.");
    }
}
```

**Expected Output:**
```text
Starting Modular Service Discovery App...
Discovered Codec Plugins: 2
  Codec [JSON] output: {"data": "TXN-3001"}
  Codec [XML] output: <data>TXN-3001</data>
ServiceLoader instantiated: ServiceLoader
Modular Service Plugin App completed successfully.
```

---

### 5. Step-by-Step Execution Trace
1. When a modular application boots (`java --module-path ... -m module/Main`), the JVM builds a **Module Graph** starting from the root module.
2. It resolves all `requires` clauses. If a required module is missing or cyclic dependencies exist between modules, the JVM fails immediately at startup with `FindException`, before executing `main()`.
3. In `ModuleDescriptorDemo`, `String.class.getModule()` retrieves the `java.base` module instance.
4. `baseModule.isExported("java.util")` returns `true`, indicating that `java.util` is public to other modules. Non-exported internal packages (like `jdk.internal.misc`) return `false`.
5. Code executing from the traditional classpath (`-cp`) belongs to the **Unnamed Module** (`module.getName() == null`), which reads all exported modules for backward compatibility.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Split Packages
A **split package** occurs when two distinct modules define classes in the exact same package (e.g., both `module-a` and `module-b` define classes in `com.example.util`).
- **Consequence**: The JVM module layer immediately throws `java.lang.module.ResolutionException: Module module.b reads package com.example.util from module.a`.
- **Fix**: Reorganize packages so that every package belongs exclusively to one module.

#### Pitfall 2: Forgetting `opens` for Reflection-Heavy Frameworks
```java
// If entity package is not opened:
module com.app {
    exports com.app.entity; // Allows compile-time access, but BLOCKS deep private reflection!
}
```
- **Consequence**: Hibernate or Jackson throws `InaccessibleObjectException` when attempting to read private fields.
- **Fix**: Add `opens com.app.entity to org.hibernate.orm.core;` or make the entire module open: `open module com.app { ... }`.

---

### 7. Best Practices & When NOT to Use
- **Do**: Use `jlink` to create ultra-lightweight custom runtime images containing only the modules your application needs (e.g., creating a 30 MB custom JRE for Docker containers instead of a 350 MB full JDK).
- **Do**: Keep module APIs minimal. Only `exports` packages intended as public API contracts. Keep implementation packages private.
- **Don't**: Do not modularize simple standalone scripts or small CLI apps where standard classpath packaging is sufficient.

---

### 8. Version Notes
- **Java 9 (JSR 376 / JEP 200 / JEP 261)**: JPMS introduced, modularizing the entire JDK into ~90 modules.
- **Java 11**: Removed Java EE and CORBA modules from the core JDK (JEP 320).
- **Java 17 (LTS)**: Strongly encapsulated JDK internals by default (JEP 403), permanently closing illegal reflective access backdoors.
- **Java 21 (LTS)**: Standard platform stability across all modern cloud deployments.

---

### 9. Summary Cheat Sheet

| Directive | Purpose | Compile Time | Reflection Allowed |
| :--- | :--- | :--- | :--- |
| `requires M` | Declares dependency on module M | Checked | Yes (for exported packages) |
| `requires transitive M` | Transitive dependency for callers | Propagated | Yes |
| `exports P` | Public classes in P visible | Yes | Public members only |
| `opens P` | Opens P to deep reflection | No | **Full (including private)** |
| `uses S` | Consumes ServiceLoader interface S | Checked | N/A |
| `provides S with I` | Declares service implementation | Checked | Registered in SPI |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Author a `module-info.java`
Write a `module-info.java` for module `com.company.order` that requires `java.sql`, exports `com.company.order.api`, and opens `com.company.order.model` to `com.fasterxml.jackson.databind`.

<details>
<summary>View Solution</summary>

```java
module com.company.order {
    requires java.sql;
    exports com.company.order.api;
    opens com.company.order.model to com.fasterxml.jackson.databind;
}
```
</details>

#### Exercise 2: Identify Unnamed Module
If a class is compiled and run using `-classpath` rather than `--module-path`, what module does it belong to, and does it enforce strong encapsulation on its own packages?

<details>
<summary>View Solution</summary>

```text
Solution:
It belongs to the Unnamed Module (Module.getName() returns null). The Unnamed Module exports all of its own packages to all other modules and reads all resolved modules on the module path, preserving full backward compatibility with pre-Java 9 classpath applications.
```
</details>

---

### 11. Sources & Official References
- [The Java Platform Module System Specification (JSR 376)](https://openjdk.org/projects/jigsaw/spec/)
- [OpenJDK JEP 261: Module System](https://openjdk.org/jeps/261)
- [Oracle Java Documentation — Understanding Java Modules](https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html)
