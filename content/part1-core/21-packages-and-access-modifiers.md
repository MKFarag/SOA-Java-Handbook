---
id: topic-21
slug: packages-and-access-modifiers
topicNumber: 21
title: Packages & Access Modifiers
part: 'Part 1: Java Core'
sectionNumber: 6
sectionTitle: Object-Oriented Programming (OOP) Essentials
versionBadge: Java 8+
difficulty: Beginner
readingTime: 6 min read
shortDescription: >-
  Reference: Namespacing via packages, reverse domain convention, directory mapping, and the four-tier access matrix (public, protected, package-private, private).
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
---

## Overview
Packages group related classes into hierarchical namespaces corresponding to file system directories, avoiding name collisions across dependencies. Access modifiers determine the compile-time visibility boundary of classes, methods, constructors, and fields across four progressive tiers.

---

## The Four-Tier Access Matrix

| Modifier | Enclosing Class | Enclosing Package | Subclasses (Different Package) | Universal (World) |
| :--- | :---: | :---: | :---: | :---: |
| **`public`** | Yes | Yes | Yes | **Yes** |
| **`protected`** | Yes | Yes | **Yes** (via inheritance) | No |
| *(default / package-private)* | Yes | **Yes** | No | No |
| **`private`** | **Yes** | No | No | No |

### Top-Level Class Constraints
A top-level (non-nested) class can declare **only two** access levels:
1. `public`: Accessible to any package importing the class. Exactly one public class per `.java` file, matching the file basename.
2. *package-private* (no modifier): Accessible only within the declaring package.

---

## Directory Mapping & Import Mechanics

```
 src/
 └── com/handbook/security/
     ├── TokenValidator.java      ── package com.handbook.security;
     └── CipherKey.java           ── package com.handbook.security; (package-private helper)
```

- **Package Declaration:** Must be the first non-comment statement in a `.java` file: `package com.handbook.security;`.
- **Single-Type Import:** `import java.util.List;` imports a specific type.
- **On-Demand (Wildcard) Import:** `import java.util.*;` imports types within that package on demand without runtime performance or bytecode size overhead (compiler resolves matching types during compilation).
- **Static Import:** `import static java.lang.Math.PI;` exposes static members directly without class qualification.

---

## Implementation Example

```java
package com.handbook.security;

public class TokenService {
    // 1. Private: encapsulated key data inaccessible to any outside class
    private final String privateSigningSecret;

    // 2. Package-private: accessible to internal package helpers (e.g. TokenValidator)
    int tokenTtlSeconds = 3600;

    // 3. Protected: accessible to subclass extensions in any package
    protected String hashAlgorithm = "SHA-256";

    // 4. Public API: exposed universally
    public TokenService(String secret) {
        this.privateSigningSecret = secret;
    }

    public boolean validateTokenSignature(String token) {
        return token != null && !token.isBlank() && verifyDigest(token);
    }

    private boolean verifyDigest(String token) {
        // Internal cryptographic validation logic
        return token.startsWith("jwt-valid-");
    }
}
```

---

## Pitfalls

- **`protected` Access Boundary from Subclasses:** A subclass in another package can access a `protected` member of its superclass **only through inheritance on its own instance**, NOT by dereferencing an arbitrary instance of the superclass:
  ```java
  // In package com.handbook.consumer (Child extends TokenService):
  this.hashAlgorithm;        // VALID (inherited member)
  new TokenService().hashAlgorithm; // COMPILER ERROR: hashAlgorithm has protected access
  ```
- **Confusing Package-Private with `protected`:** Without an explicit modifier, members are package-private, meaning they are NOT accessible to subclasses in other packages.
- **Type Collisions with Wildcard Imports:** Importing `import java.util.*;` and `import java.sql.*;` creates an ambiguity compiler error when referencing `Date`, because both packages contain a `Date` class. Resolve via explicit single-type import: `import java.util.Date;`.
- **Directory Path Mismatch:** If the directory structure does not match the package statement (e.g., `package com.handbook;` placed in `src/org/handbook/`), compilation fails with `package does not exist or class is in the wrong directory`.

---

## Practice

### Question
Given two classes in different packages:
```java
package pkgA;
public class Alpha {
    protected int count = 5;
}

package pkgB;
import pkgA.Alpha;
public class Beta extends Alpha {
    public void test() {
        Alpha a = new Alpha();
        System.out.println(this.count); // Line 1
        System.out.println(a.count);    // Line 2
    }
}
```
Does this code compile?

### Explanation
1. Line 1 accesses `this.count`. Because `Beta` inherits from `Alpha`, it accesses `count` through inheritance. Line 1 is valid.
2. Line 2 accesses `a.count` on an explicit instance reference of `Alpha`. Because `Beta` is in a different package (`pkgB`) than `Alpha` (`pkgA`), Java forbids accessing protected members across arbitrary object instances. Line 2 **fails compilation**.
3. Result: Compilation error on Line 2.
