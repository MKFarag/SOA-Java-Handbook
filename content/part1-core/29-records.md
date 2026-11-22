---
id: topic-29
slug: records
topicNumber: 29
title: Records
part: 'Part 1: Java Core'
sectionNumber: 8
sectionTitle: Modern Java Language Features
versionBadge: Java 16+
difficulty: Beginner
readingTime: 6 min read
shortDescription: >-
  Reference: Transparent immutable data carriers (JEP 395), synthesized bytecode artifacts (accessors, equals/hashCode, toString), compact constructors, and shallow immutability.
prerequisites:
  - 'Topic 22: Encapsulation & Data Integrity'
---

## Overview
A `record` (finalized in Java 16 via JEP 395) is a specialized class declaration that functions as a transparent, immutable data carrier. The Java compiler automatically synthesizes `private final` fields, component accessors, a canonical constructor, `equals()`, `hashCode()`, and `toString()` directly from the record header.

---

## Compiler Bytecode Synthesis

For a declaration `public record OrderEvent(String orderId, double amount) {}`, the compiler generates:

| Synthesized Element | Generated Signature / Behavior |
| :--- | :--- |
| **Superclass** | Implicitly extends `java.lang.Record` |
| **Modifiers** | Declared `final` (cannot be extended) |
| **Instance Fields** | `private final String orderId; private final double amount;` |
| **Canonical Constructor** | `public OrderEvent(String orderId, double amount) { ... }` |
| **Component Accessors** | `public String orderId()` and `public double amount()` (no `get` prefix) |
| **Value Equality** | `equals(Object)` and `hashCode()` comparing all components by value |
| **Formatting** | `toString()` returning `OrderEvent[orderId=..., amount=...]` |

---

## Compact Constructors

A compact constructor enables parameter validation and data normalization without repeating the parameter list or explicit `this.field = field;` assignments:

```java
public record OrderEvent(String orderId, double amount) {
    // Compact constructor: parameter list and assignments are implicit
    public OrderEvent {
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("orderId cannot be blank");
        }
        if (amount < 0.0) {
            throw new IllegalArgumentException("amount cannot be negative");
        }
        orderId = orderId.strip().toUpperCase(); // Normalization applied before assignment
    }
}
```

---

## Structural Constraints & Immutability

| Constraint | Rule | Reason |
| :--- | :--- | :--- |
| **Inheritance** | Cannot extend any class | Records already extend `java.lang.Record` |
| **Subclassing** | Cannot be extended | Records are implicitly `final` |
| **Interfaces** | Can implement arbitrary interfaces | Permitted: `record Dto(...) implements Serializable` |
| **Instance Fields** | Prohibited from declaring additional instance fields | All state must reside in the record header |
| **Static Fields** | Permitted (`public static final int MAX = 100;`) | Static members are independent of instance state |
| **Shallow Immutability** | Components referencing mutable objects remain mutable | A `record Bag(List<String> items)` allows mutating `items`! |

---

## Implementation Example

```java
import java.util.List;

public class RecordDataCarrierDemo {
    public record GeoCoordinate(double latitude, double longitude) {
        public GeoCoordinate {
            if (latitude < -90.0 || latitude > 90.0) {
                throw new IllegalArgumentException("Latitude out of range [-90, 90]");
            }
            if (longitude < -180.0 || longitude > 180.0) {
                throw new IllegalArgumentException("Longitude out of range [-180, 180]");
            }
        }

        // Custom instance method
        public boolean isEquator() {
            return Math.abs(latitude) < 0.0001;
        }
    }

    public static void main(String[] args) {
        GeoCoordinate pos1 = new GeoCoordinate(37.7749, -122.4194);
        GeoCoordinate pos2 = new GeoCoordinate(37.7749, -122.4194);

        System.out.printf("Latitude accessor : %.4f%n", pos1.latitude());
        System.out.printf("Value Equality    : %b%n", pos1.equals(pos2));
        System.out.printf("String Format     : %s%n", pos1);

        try {
            new GeoCoordinate(105.0, 50.0);
        } catch (IllegalArgumentException e) {
            System.out.println("Validation Guard: " + e.getMessage());
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Latitude accessor : 37.7749
Value Equality    : true
String Format     : GeoCoordinate[latitude=37.7749, longitude=-122.4194]
Validation Guard: Latitude out of range [-90, 90]
```
</details>

---

## Pitfalls

- **Shallow Immutability with Mutable Components:** If a record component is an `ArrayList` or array, callers can mutate the elements within that container. Enforce defensive copying in the compact constructor: `items = List.copyOf(items);`.
- **JavaBean Accessor Mismatch:** Record accessors do NOT follow the `getFieldName()` JavaBean convention; they use `fieldName()`. Frameworks requiring strict JavaBeans (older reflection mappers) require explicit configuration.
- **Attempting Additional Instance Fields:** Declaring `private int extra;` inside a record body triggers compile-time error `user-declared instance variables are not allowed in records`.
- **Overriding Accessors Carelessly:** Overriding a component accessor to compute or alter return values violates the transparency contract of records and can produce inconsistency with `equals()` and `hashCode()`.

---

## Practice

### Question
Given the record below, does `p1.equals(p2)` evaluate to `true` or `false`?
```java
record Container(int[] data) {}

Container p1 = new Container(new int[]{1, 2});
Container p2 = new Container(new int[]{1, 2});
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. By default, the synthesized `equals()` method on a record uses `Objects.equals(componentA, componentB)`.
2. For array references, `Objects.equals()` compares pointer identities (`==`), NOT array elements (it does NOT use `Arrays.equals()`).
3. Because `p1.data` and `p2.data` are distinct heap arrays, the equality comparison evaluates to `false`.
4. Fix: Override `equals()` and `hashCode()` to use `Arrays.equals(data, other.data)` if array components are required.

</details>
