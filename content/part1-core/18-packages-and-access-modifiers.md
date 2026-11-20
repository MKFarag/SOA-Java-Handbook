---
id: topic-18
slug: packages-and-access-modifiers
topicNumber: 18
title: Packages & Access Modifiers
part: 'Part 1: Java Core'
sectionNumber: 6
sectionTitle: Object-Oriented Programming (OOP) Essentials
versionBadge: Java 8+
difficulty: Beginner
readingTime: 11 min read
shortDescription: >-
  Structure code with packages and reverse domain naming. Master the four access
  levels (public, protected, package-private, private) to establish impenetrable
  encapsulation boundaries.
prerequisites:
  - 'Topic 03: Your First Java Program'
  - 'Topic 16: Classes, Objects & Memory Layout'
relevanceLevel: MUST-KNOW / CORE
---
> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

A **package** is a namespace mechanism that organizes related classes, interfaces, records, and enums into directory structures, preventing class naming collisions across large projects. By convention, packages follow reverse Internet domain name notation (e.g., `com.company.project.module`).

**Access Modifiers** are Java keywords that set the visibility boundary for classes, constructors, methods, and fields. Java defines four distinct visibility tiers: `public`, `protected`, **package-private** (the default when no modifier is specified), and `private`.

### The Real-World Analogy
Think of a commercial bank branch:
- **Public:** The ATM lobby and front teller counters. Anyone walking in from the street can interact with them.
- **Protected:** The loan advisor's office and employee breakroom. Accessible to bank employees (same package) and authorized contractors/partner branches under the corporate family tree (subclasses).
- **Package-Private (Default):** The internal teller cash-drawers. Accessible only to employees working inside that specific local branch building (same package).
- **Private:** The digital master vault combination lock. Accessible only to the vault mechanism itself; even branch employees cannot view the raw cipher keys.

### Why Does This Exist?
In software engineering, if all classes and fields were public, any developer across a million-line codebase could mutate internal internal states, bypass validation logic, and tightly couple disparate subsystems. Access modifiers enforce the **Principle of Least Privilege**: expose only what callers genuinely require, and aggressively hide implementation details.

---

## 2. Prerequisites
- **Topic 03: Your First Java Program** (Compilation units and directories)
- **Topic 16: Classes, Objects & Memory Layout**

---

## 3. The Access Visibility Matrix

| Modifier | Inside Same Class | Inside Same Package | Subclasses (Other Packages) | Everywhere (World) |
| :--- | :---: | :---: | :---: | :---: |
| **`public`** | Yes | Yes | Yes | **Yes** |
| **`protected`** | Yes | Yes | **Yes** | No |
| *(default / package-private)* | Yes | **Yes** | No | No |
| **`private`** | **Yes** | No | No | No |

### Package Statements & Imports
```java
package com.handbook.security; // Must be the very first non-comment line

import java.util.List;          // Single-type import
import java.util.*;             // On-demand package import
import static java.lang.Math.*; // Static import for methods and constants
```

---

## 4. Runnable Code Examples

### Example 1: Access Boundaries Demonstration
```java
// File: examples/core/AccessModifierDemo.java
public class AccessModifierDemo {

    public static class SecurityBoundary {
        public String publicName = "PUBLIC: Accessible everywhere";
        protected String protectedRole = "PROTECTED: Accessible in same package or subclasses";
        String packageDefaultToken = "DEFAULT: Accessible only in same package";
        private String privateSecret = "PRIVATE: Accessible only inside SecurityBoundary class";

        public String readPrivateSecretFromInside() {
            return "Inside Class Access -> " + privateSecret;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Java Access Modifier Boundaries ===");
        SecurityBoundary boundary = new SecurityBoundary();

        // 1. Public: Direct access
        System.out.println(boundary.publicName);

        // 2. Protected: Accessible because AccessModifierDemo is in the same package
        System.out.println(boundary.protectedRole);

        // 3. Package-private / default: Accessible in same package
        System.out.println(boundary.packageDefaultToken);

        // 4. Private: Inaccessible directly (boundary.privateSecret would cause compile error)
        System.out.println(boundary.readPrivateSecretFromInside());
    }
}
```

#### Expected Output
```text
=== Java Access Modifier Boundaries ===
PUBLIC: Accessible everywhere
PROTECTED: Accessible in same package or subclasses
DEFAULT: Accessible only in same package
Inside Class Access -> PRIVATE: Accessible only inside SecurityBoundary class
```

---

### Example 2: Realistic Application (Secure Payment Gateway Architecture)
```java
// File: examples/core/SecurePaymentGateway.java
public class SecurePaymentGateway {

    public static abstract class PaymentProvider {
        private final String merchantApiSecret; // Completely hidden
        protected final String gatewayEndpoint;   // Accessible to subclasses

        protected PaymentProvider(String endpoint, String secret) {
            this.gatewayEndpoint = endpoint;
            this.merchantApiSecret = secret;
        }

        // Public API contract
        public final boolean processCharge(String cardToken, double amount) {
            if (validateToken(cardToken) && amount > 0.0) {
                return executeNetworkCall(cardToken, amount, merchantApiSecret);
            }
            return false;
        }

        // Package-private helper: accessible to auditors within same package
        boolean validateToken(String token) {
            return token != null && token.startsWith("tok_");
        }

        // Protected hook for concrete vendor subclasses to implement
        protected abstract boolean executeNetworkCall(String token, double amount, String apiSecret);
    }

    public static class StripeProvider extends PaymentProvider {
        public StripeProvider(String secret) {
            super("https://api.stripe.com/v1/charges", secret);
        }

        @Override
        protected boolean executeNetworkCall(String token, double amount, String apiSecret) {
            System.out.printf("Dispatching HTTPS POST to %s with Secret Hash %d for $%.2f%n",
                    gatewayEndpoint, apiSecret.hashCode(), amount);
            return true;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Secure Payment Gateway Access Boundaries ===");
        PaymentProvider stripe = new StripeProvider("sk_live_9837429871409");

        boolean success = stripe.processCharge("tok_visa_4242", 149.99);
        System.out.println("Charge Status: " + (success ? "APPROVED" : "DECLINED"));
    }
}
```

#### Expected Output
```text
=== Secure Payment Gateway Access Boundaries ===
Dispatching HTTPS POST to https://api.stripe.com/v1/charges with Secret Hash 2046830501 for $149.99
Charge Status: APPROVED
```

---

## 5. Step-by-Step Execution Trace

When `stripe.processCharge("tok_visa_4242", 149.99)` executes:

```text
1. Client Call to Public API:
   - External caller invokes public method processCharge(). Access permitted.

2. Package-Private Validation:
   - validateToken("tok_visa_4242") executes within the same package. Returns true.

3. Protected Template Method Dispatch:
   - Invokes abstract executeNetworkCall().
   - Virtual method dispatch resolves to StripeProvider.executeNetworkCall().

4. Subclass Access to Protected State:
   - StripeProvider accesses protected field 'gatewayEndpoint'. Access permitted!
   - MerchantApiSecret was passed securely into the method argument, but remains private to PaymentProvider.
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Attempting to Declare Top-Level Class as `private` or `protected`
```java
private class BadClass { } // COMPILE ERROR: modifier private not allowed here
```
**Why it fails:** Top-level classes in a Java file can only be declared `public` or package-private (no modifier). Only nested/inner classes can be `private` or `protected`.
**How to fix:** Declare top-level classes `public` or omit the modifier for package-private.

### Mistake 2: Missing Package Directory Alignment
```text
File header: package com.myapp.services;
Actual disk location: src/com/myapp/BadPath/User.java
```
**Why it fails:** The Java compiler (`javac`) and JVM mandate that a class's declared package must match its physical directory path on disk.
**How to fix:** Ensure `com.myapp.services` lives in `src/com/myapp/services/User.java`.

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Default to `private`:** Start with fields and helper methods marked `private`. Escalate to package-private or `protected` only when genuine architectural reasons arise.
2. **Use Package-Private for Unit Testing:** Avoid exposing internal methods as `public` just for unit tests; place your unit test classes in the same package within `src/test/java` to test package-private methods cleanly.
3. **Avoid Wildcard Imports in Production:** Prefer explicit imports (`import java.util.List;`) over wildcards (`import java.util.*;`) to prevent namespace collisions.

### When NOT to Use
- **Do not use `public` fields for mutable state:** Except for `public static final` constants, instance fields should never be public.

---

## 8. Version Notes
- **Java 1.0:** Packages and four access modifiers established.
- **Java 1.2:** Strict directory path enforcement finalized across compilers.
- **Java 9 (JPMS - Java Platform Module System):** Introduced strong encapsulation via `module-info.java`. Even `public` classes in a package are hidden from outside modules unless the package is explicitly `exports`-ed!

---

## 9. Summary Cheat Sheet

| Modifier | Keyword | Accessibility Scope |
| :--- | :--- | :--- |
| **Public** | `public` | Accessible from all packages and modules. |
| **Protected** | `protected` | Accessible in same package + subclasses in any package. |
| **Package-Private** | *(no keyword)* | Accessible ONLY within the same package. |
| **Private** | `private` | Accessible ONLY within the defining class. |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
Why can't Class B access `secretCode` in this setup?
```java
// File: com/alpha/ClassA.java
package com.alpha;
public class ClassA {
    int secretCode = 42;
}

// File: com/beta/ClassB.java
package com.beta;
import com.alpha.ClassA;
public class ClassB {
    public void test() {
        ClassA a = new ClassA();
        System.out.println(a.secretCode); // COMPILE ERROR
    }
}
```
<details>
<summary>View Solution</summary>

**Compiler Error:** `secretCode is not public in com.alpha.ClassA; cannot be accessed from outside package`.
**Explanation:** `secretCode` has no access modifier, which defaults to **package-private**. It is only accessible to classes inside `com.alpha`. Because `ClassB` is in `com.beta`, access is denied. To fix it, declare `secretCode` as `public`.
</details>

---

### Exercise 2: Hands-on Implementation
Design a package architecture for a plugin system where a base abstract class `Plugin` allows plugins in external packages to read `pluginId` (protected), while only classes within the engine package can invoke `lifecycleStart()` (package-private).
<details>
<summary>View Solution</summary>

```java
package com.engine.core;

public abstract class Plugin {
    protected final String pluginId; // Accessible to plugin implementations

    protected Plugin(String id) {
        this.pluginId = id;
    }

    // Package-private: only the engine core can start the plugin!
    void lifecycleStart() {
        System.out.println("Starting: " + pluginId);
        execute();
    }

    protected abstract void execute();
}
```
</details>

---

### Exercise 3: Real-World Edge Case
Can a subclass in another package access a `protected` field through a reference to its superclass? e.g. `superRef.protectedField`?
<details>
<summary>View Solution</summary>

**Answer:** No! A subclass in a different package can only access `protected` members through **inheritance on its own instance** (or instances of its own subclass type), NOT through an arbitrary external reference to the superclass or sibling subclasses.
**Explanation:** JLS §6.6.2 enforces this to prevent subclasses from prying into the protected state of unrelated objects.
</details>

---

## 11. Official Sources & Specifications
- [Oracle Java Documentation: Controlling Access to Members of a Class](https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html)
- [dev.java: Packages in Java](https://dev.java/learn/classes-objects/packages/)
- [Java Language Specification §6.6: Access Control](https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.6)
