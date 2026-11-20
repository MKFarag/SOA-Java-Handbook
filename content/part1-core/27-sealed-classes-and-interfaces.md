---
id: topic-27
slug: sealed-classes-and-interfaces
topicNumber: 27
title: Sealed Classes & Interfaces
part: 'Part 1: Java Core'
sectionNumber: 8
sectionTitle: Modern Java Data Modeling
versionBadge: Java 17+
difficulty: Intermediate
readingTime: 11 min read
shortDescription: >-
  Restrict class extension to known, authorized subclasses using sealed and
  permits. Master final, sealed, and non-sealed subclass modifiers, and unlock
  exhaustive pattern matching.
prerequisites:
  - 'Topic 20: Inheritance & Method Overriding'
  - 'Topic 23: Interfaces & Modern Interface Evolution'
relevanceLevel: ADVANCED / DEEP-DIVE
---
> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

## 1. What It Is and Why It Exists

A **Sealed Class or Interface** (introduced in Java 15 preview and finalized in **Java 17 LTS via JEP 409**) restricts which other classes or interfaces may extend or implement it.

Prior to Java 17, inheritance was binary:
- A class was either **open to everyone** (`public class`), allowing any arbitrary third-party library to subclass it.
- Or it was **completely closed to everyone** (`final class`), forbidding any subclassing whatsoever.

Sealed types introduce a controlled middle ground: an author can explicitly declare: *"This class can be extended, but ONLY by these three specific classes that I have authorized."*

```java
public sealed interface ServiceResult permits SuccessResult, FailureResult, PendingResult {}
```

### The Real-World Analogy
Think of a corporate security access list:
- A bank's server room is not open to the general public (**Unrestricted Inheritance**).
- Nor is it permanently sealed with concrete blocks so nobody on earth can ever enter (**`final` Class**).
- Instead, the door is secured with a biometric scanner configured with an authorized badge whitelist (**`sealed ... permits`**). Only Alice, Bob, and Charlie can badge through the door.

### Why Does This Exist?
In domain-driven design, algebraic data types (sum types) model systems where a concept can only take on a finite set of variations (e.g., a JSON value is either a string, number, boolean, object, array, or null). Sealed hierarchies give developers compile-time exhaustiveness: the compiler knows every possible subclass, allowing `switch` expressions to evaluate all cases without requiring an unreachable `default:` clause.

---

## 2. Prerequisites
- **Topic 20: Inheritance & Method Overriding**
- **Topic 23: Interfaces & Modern Interface Evolution**

---

## 3. Syntax Breakdown & Subclass Modifiers

### Declaring a Sealed Type
```java
public sealed class Shape permits Circle, Rectangle, Polygon {}
```

### Mandatory Subclass Modifiers
Every class permitted to extend a sealed class **MUST explicitly specify one of three modifiers**:
1. **`final`:** Prevents this specific subclass from being extended any further.
2. **`sealed`:** Continues the sealed hierarchy, declaring its own `permits` whitelist of allowed grandchildren.
3. **`non-sealed`:** Deliberately breaks the seal, opening this subclass for unrestricted extension by anyone.

### The Package Rule
All permitted subclasses must reside in the **same package** (or same named module) as the sealed parent class. If permitted classes are defined in the same source file, the `permits` clause can be omitted because the compiler discovers them automatically.

---

## 4. Runnable Code Examples

### Example 1: Sealed Hierarchy with `final`, `sealed`, and `non-sealed`
```java
// File: examples/core/SealedClassMechanics.java
public class SealedClassMechanics {

    public sealed interface ServiceResult permits SuccessResult, FailureResult, PendingResult {
        String getMessage();
    }

    // 1. Final subclass: locks hierarchy
    public static final class SuccessResult implements ServiceResult {
        private final String data;
        public SuccessResult(String data) { this.data = data; }
        public String getData() { return data; }
        @Override public String getMessage() { return "SUCCESS: " + data; }
    }

    // 2. Sealed subclass: extends sealed hierarchy with its own permits
    public static sealed class FailureResult implements ServiceResult permits TimeoutFailure, AuthFailure {
        private final String error;
        public FailureResult(String error) { this.error = error; }
        @Override public String getMessage() { return "FAILED: " + error; }
    }

    public static final class TimeoutFailure extends FailureResult {
        public TimeoutFailure() { super("Network read timed out."); }
    }

    public static final class AuthFailure extends FailureResult {
        public AuthFailure() { super("JWT token expired."); }
    }

    // 3. Non-sealed subclass: reopens hierarchy
    public static non-sealed class PendingResult implements ServiceResult {
        @Override public String getMessage() { return "PENDING: Awaiting worker node."; }
    }

    public static void main(String[] args) {
        System.out.println("=== Java 17+ Sealed Hierarchy Evaluation ===");

        ServiceResult s1 = new SuccessResult("Payload 0xFA31");
        ServiceResult s2 = new TimeoutFailure();
        ServiceResult s3 = new PendingResult();

        for (ServiceResult res : new ServiceResult[]{ s1, s2, s3 }) {
            String status = switch (res) {
                case SuccessResult s -> "Handled Success with data: " + s.getData();
                case TimeoutFailure t -> "Retrying after timeout: " + t.getMessage();
                case AuthFailure a -> "Redirecting to login: " + a.getMessage();
                case FailureResult f -> "Generic failure: " + f.getMessage();
                case PendingResult p -> "Enqueued in memory: " + p.getMessage();
            };
            System.out.println(status);
        }
    }
}
```

#### Expected Output
```text
=== Java 17+ Sealed Hierarchy Evaluation ===
Handled Success with data: Payload 0xFA31
Retrying after timeout: FAILED: Network read timed out.
Enqueued in memory: PENDING: Awaiting worker node.
```

---

### Example 2: Realistic Application (Sealed Multi-Channel Payment System)
```java
// File: examples/core/PaymentMethodHierarchyApp.java
public class PaymentMethodHierarchyApp {

    public sealed interface PaymentMethod permits CreditCard, BankTransfer, CryptoWallet {
        double processPayment(double amount);
    }

    public record CreditCard(String cardNumber, String cvv, double feeRate) implements PaymentMethod {
        @Override
        public double processPayment(double amount) {
            double total = amount + (amount * (feeRate / 100.0));
            System.out.printf("[Credit Card: **** %s] Charged $%.2f (Fee: $%.2f)%n",
                    cardNumber.substring(cardNumber.length() - 4), total, amount * (feeRate / 100.0));
            return total;
        }
    }

    public record BankTransfer(String iban, String swiftCode) implements PaymentMethod {
        @Override
        public double processPayment(double amount) {
            System.out.printf("[ACH / Wire: %s] Settling $%.2f with zero transaction fee%n", iban, amount);
            return amount;
        }
    }

    public record CryptoWallet(String walletAddress, String tokenSymbol) implements PaymentMethod {
        @Override
        public double processPayment(double amount) {
            System.out.printf("[Crypto: %s on %s] Broadcasted transaction for $%.2f%n",
                    walletAddress, tokenSymbol, amount);
            return amount;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Exhaustive Sealed Payment Processing ===");

        PaymentMethod p1 = new CreditCard("4111222233339088", "123", 2.5);
        PaymentMethod p2 = new BankTransfer("US89000123456789", "CHASUS33");
        PaymentMethod p3 = new CryptoWallet("0x71C...4f9", "USDC");

        PaymentMethod[] batch = { p1, p2, p3 };

        for (PaymentMethod method : batch) {
            String summary = switch (method) {
                case CreditCard cc -> "Card transaction executed with " + cc.feeRate() + "% fee";
                case BankTransfer bt -> "Wire initiated to IBAN " + bt.iban();
                case CryptoWallet cw -> "Crypto transaction submitted on " + cw.tokenSymbol();
            };
            method.processPayment(100.0);
            System.out.println("Summary: " + summary + "\n");
        }
    }
}
```

#### Expected Output
```text
=== Exhaustive Sealed Payment Processing ===
[Credit Card: **** 9088] Charged $102.50 (Fee: $2.50)
Summary: Card transaction executed with 2.5% fee

[ACH / Wire: US89000123456789] Settling $100.00 with zero transaction fee
Summary: Wire initiated to IBAN US89000123456789

[Crypto: 0x71C...4f9 on USDC] Broadcasted transaction for $100.00
Summary: Crypto transaction submitted on USDC
```

---

## 5. Step-by-Step Execution Trace

When the compiler evaluates `switch (method)` in `PaymentMethodHierarchyApp`:

```text
1. Exhaustiveness Verification:
   - Evaluated expression type: PaymentMethod.
   - Compiler notes PaymentMethod is 'sealed'.
   - Permitted subtypes: [CreditCard, BankTransfer, CryptoWallet].

2. Case Coverage Check:
   - Case 1 covers CreditCard: YES.
   - Case 2 covers BankTransfer: YES.
   - Case 3 covers CryptoWallet: YES.
   - Total permitted set is 100% covered!

3. Absence of 'default:' Branch:
   - Because the hierarchy is closed and fully covered, no 'default:' branch is required.
   - If a developer later adds 'record ApplePay(...) implements PaymentMethod', this switch expression will fail compilation instantly, reminding the engineer to handle ApplePay!
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Permitted Subclass Missing Mandatory Modifier
```java
public sealed class Animal permits Dog {}
public class Dog extends Animal {} // COMPILE ERROR: sealed, once-sealed, or final expected
```
**Why it fails:** Java requires every permitted subclass to explicitly declare its downstream inheritance posture using `final`, `sealed`, or `non-sealed`.
**How to fix:** Add `final`, `sealed`, or `non-sealed` to `Dog`.

### Mistake 2: Permitting Classes in Other Packages
```java
// In package com.core:
public sealed class Engine permits com.outside.CustomEngine {} // COMPILE ERROR
```
**Why it fails:** Permitted subclasses must reside in the exact same package or the same named module as the sealed parent class.
**How to fix:** Move permitted subclasses into the same package or module.

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Combine Sealed Hierarchies with Records:** Sealed interfaces with record implementations are the modern standard for Algebraic Data Types in Java.
2. **Leverage Exhaustive Switches:** Avoid `default:` branches in switches over sealed types so the compiler catches missing cases when new subtypes are added.
3. **Use `non-sealed` Deliberately:** Only mark a subclass `non-sealed` if you explicitly intend for third-party consumers to extend that specific branch.

### When NOT to Use
- **Do not use sealed classes for open plugin architectures:** If you are designing a public SPI (Service Provider Interface) where third-party developers write their own plugins, keep the interface open and unsealed.

---

## 8. Version Notes
- **Java 15 (JEP 360):** Sealed Classes introduced as a preview feature.
- **Java 16 (JEP 397):** Second preview.
- **Java 17 (JEP 409):** Sealed Classes and Interfaces finalized as permanent features.
- **Java 21 (JEP 441):** Pattern matching in `switch` leverages sealed exhaustiveness checking.

---

## 9. Summary Cheat Sheet

| Keyword | Placement | Meaning |
| :--- | :--- | :--- |
| **`sealed`** | Class / Interface declaration | Restricts inheritance to whitelisted `permits` classes. |
| **`permits`** | After class/interface name | Lists authorized direct subclasses. |
| **`final`** | Permitted Subclass | Completely prohibits further subclassing. |
| **`sealed`** | Permitted Subclass | Continues sealing with its own new `permits` list. |
| **`non-sealed`** | Permitted Subclass | Breaks the seal; allows open extension. |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
Why does this switch fail compilation?
```java
public sealed interface State permits On, Off {}
public final class On implements State {}
public final class Off implements State {}

public void handle(State s) {
    switch (s) {
        case On on -> System.out.println("ON");
        // COMPILE ERROR: 'switch' expression does not cover all possible input values
    }
}
```
<details>
<summary>View Solution</summary>

**Compiler Error:** The `switch` statement does not cover all possible values; case `Off` is missing.
**Explanation:** Because `State` is sealed, the compiler enforces exhaustive coverage. You must either add `case Off off -> ...` or add a `default:` branch.
</details>

---

### Exercise 2: Hands-on Implementation
Declare a sealed interface `Expression` permitted for records `Constant(int value)` and `Add(Expression left, Expression right)`.
<details>
<summary>View Solution</summary>

```java
public sealed interface Expression permits Constant, Add {}

public record Constant(int value) implements Expression {}

public record Add(Expression left, Expression right) implements Expression {}
```
*Note: Records are implicitly final, so they don't need an explicit final modifier!*
</details>

---

### Exercise 3: Real-World Edge Case
Can a class omit the `permits` clause if all subclasses are in the same file?
<details>
<summary>View Solution</summary>

**Answer:** Yes!
**Explanation:** JLS allows omitting the `permits` keyword if all permitted subclasses are declared in the same compilation unit (`.java` file). The compiler automatically synthesizes the `permits` list from all subclasses found in that file.
</details>

---

## 11. Official Sources & Specifications
- [OpenJDK JEP 409: Sealed Classes](https://openjdk.org/jeps/409)
- [Oracle Java Documentation: Sealed Classes](https://docs.oracle.com/en/java/javase/21/language/sealed-classes-and-interfaces.html)
- [Java Language Specification §8.1.6: Permitted Subclasses](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.1.6)
