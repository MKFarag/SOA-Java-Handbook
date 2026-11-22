---
id: topic-30
slug: sealed-classes-and-interfaces
topicNumber: 30
title: Sealed Classes & Interfaces
part: 'Part 1: Java Core'
sectionNumber: 8
sectionTitle: Modern Java Language Features
versionBadge: Java 17 LTS
difficulty: Intermediate
readingTime: 6 min read
shortDescription: >-
  Reference: Restricted inheritance hierarchies via sealed and permits (JEP 409), permitted subclass modifier rules (final, sealed, non-sealed), and compiler exhaustiveness.
prerequisites:
  - 'Topic 23: Inheritance & Method Overriding'
  - 'Topic 26: Interfaces & Modern Interface Evolution'
---

## Overview
A sealed class or interface (`sealed ... permits`, finalized in Java 17 via JEP 409) restricts inheritance to an explicitly authorized whitelist of subclasses. Sealed types enable Algebraic Data Types (sum types) by providing closed hierarchies that the compiler can analyze for complete exhaustiveness in `switch` expressions without requiring a `default:` fallback.

---

## Syntax & Subclass Modifiers

```
               Sealed Supertype Hierarchy
 ┌────────────────────────────────────────────────────────┐
 │ public sealed interface DomainEvent                    │
 │        permits OrderPlaced, OrderShipped, OrderRefunded│
 └───────────────────────────┬────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
 [ final Subclass ]   [ sealed Subclass ]   [ non-sealed Subclass ]
 Cannot be extended   Restricts its own     Re-opens inheritance
                      subclasses further    to any subclass
```

### The Three Permitted Subclass Modifiers

Every class explicitly permitted by a sealed type **must declare exactly one** of the following modifiers:

| Subclass Modifier | Architectural Effect on Hierarchy | Code Example |
| :--- | :--- | :--- |
| **`final`** | Closes the branch entirely; cannot be extended further | `public final class OrderPlaced implements DomainEvent {}` |
| **`sealed`** | Continues the restriction; specifies its own `permits` list | `public sealed class OrderRefunded permits Partial, Full {}` |
| **`non-sealed`** | Re-opens the hierarchy; any class can extend it | `public non-sealed class OrderShipped implements DomainEvent {}` |

---

## Compiler Exhaustiveness Guarantees

Because the compiler possesses compile-time knowledge of all permitted subtypes, `switch` expressions covering all permitted variants do not require a `default:` branch:

```java
// Compiler validates exhaustiveness: no default needed!
String description = switch (event) {
    case OrderPlaced p   -> "Order created: " + p.orderId();
    case OrderShipped s  -> "Tracking: " + s.trackingCode();
    case OrderRefunded r -> "Refunded amount: " + r.amount();
};
```
If a new permitted subclass is added to `DomainEvent` later, the compiler immediately flags all switch expressions that do not handle the new variant.

---

## Packaging Constraints

Permitted subclasses must reside in the **same package** as the sealed superclass (if declared in an unnamed module) or in the **same named module** (if utilizing the Java Platform Module System).

If permitted subclasses are declared in the exact same `.java` source file as the sealed class, the `permits` clause can be omitted; the compiler infers the permitted list automatically.

---

## Implementation Example

```java
public class SealedHierarchyDemo {
    public sealed interface OperationResult permits OperationResult.Success, OperationResult.Failure {}

    public static final record Success(String payload, long durationMs) implements OperationResult {}
    public static final record Failure(String errorCode, String reason) implements OperationResult {}

    public static String handleResult(OperationResult result) {
        // Exhaustive switch expression: covers Success and Failure completely
        return switch (result) {
            case Success s -> String.format("HTTP 200 OK: %s (took %d ms)", s.payload(), s.durationMs());
            case Failure f -> String.format("HTTP 500 FAIL [%s]: %s", f.errorCode(), f.reason());
        };
    }

    public static void main(String[] args) {
        OperationResult res1 = new Success("{\"status\":\"active\"}", 45);
        OperationResult res2 = new Failure("ERR_AUTH", "Token signature expired");

        System.out.println(handleResult(res1));
        System.out.println(handleResult(res2));
    }
}
```

### Execution Output:
```text
HTTP 200 OK: {"status":"active"} (took 45 ms)
HTTP 500 FAIL [ERR_AUTH]: Token signature expired
```

---

## Pitfalls

- **Forgetting Subclass Modifiers:** A permitted subclass that declares neither `final`, `sealed`, nor `non-sealed` triggers compilation error `sealed, non-sealed or final modifiers expected`.
- **Cross-Package Subclassing:** Placing a permitted subclass in a different package without module encapsulation triggers compilation error `class is not allowed to extend sealed class from another package`.
- **Arbitrary Classes Claiming Implementation:** If class `Malicious` declares `implements DomainEvent` without being listed in `permits`, compilation fails with `class is not allowed to extend sealed class`.

---

## Practice

### Question
Given the sealed interface declaration below:
```java
public sealed interface State permits InitialState, ActiveState {}
public class InitialState implements State {}
```
Why does this fail compilation?

### Explanation
1. `InitialState` is a permitted subclass of sealed interface `State`.
2. By Java language specification, every permitted subclass must explicitly declare either `final`, `sealed`, or `non-sealed`.
3. `InitialState` lacks any of these three mandatory modifiers.
4. Result: **Compile-time error**.
