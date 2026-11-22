---
id: topic-28
slug: enumerations-enum
topicNumber: 28
title: Enumerations (enum)
part: 'Part 1: Java Core'
sectionNumber: 8
sectionTitle: Modern Java Language Features
versionBadge: Java 5+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Type-safe constant singletons, java.lang.Enum class hierarchy, constant-specific method bodies, and high-performance EnumSet/EnumMap bit vectors.
prerequisites:
  - 'Topic 12: Switch Statements & Switch Expressions'
  - 'Topic 19: Classes, Objects & Memory Layout'
---

## Overview
An `enum` is a specialized reference type extending `java.lang.Enum<E>` that defines a fixed, compile-time type-safe set of singleton constant instances. In Java, enums are full-featured classes that can encapsulate state fields, constructors, custom methods, and constant-specific polymorphic behavior.

---

## Memory Architecture & Singleton Guarantee

```
                    HotSpot JVM Heap (Enum Allocation)
 ┌──────────────────────────────────────────────────────────────────┐
 │ Class: Operation (final class Operation extends Enum<Operation>) │
 │                                                                  │
 │   public static final Operation PLUS  ──► [Singleton Instance 0] │
 │   public static final Operation MINUS ──► [Singleton Instance 1] │
 │                                                                  │
 │   - Constructors are strictly private.                           │
 │   - JVM guarantees exactly one instance per constant.            │
 │   - Serialization and reflection cannot create duplicates.       │
 └──────────────────────────────────────────────────────────────────┘
```

### Core Built-In Methods

| Method | Return | Description |
| :--- | :--- | :--- |
| `values()` | `E[]` | Returns an array containing all enum constants in declared order |
| `valueOf(String name)` | `E` | Resolves constant by exact case-sensitive string name |
| `name()` | `String` | Returns exact declared name of constant (immutable) |
| `ordinal()` | `int` | Returns zero-based position in declaration order |

---

## Specialized Collections: `EnumSet` and `EnumMap`

- **`EnumSet`:** High-performance set implementation represented internally as a single 64-bit integer bit vector (`long`). All basic set operations (`contains`, `add`) execute in $O(1)$ constant time with zero heap allocation per element.
- **`EnumMap`:** High-performance map implementation keyed by an enum, represented internally as a plain Java array indexed by `ordinal()`. Outperforms `HashMap` by eliminating hashing overhead and hash collisions.

---

## Implementation Example: Constant-Specific Methods

```java
import java.util.EnumMap;
import java.util.EnumSet;

public class EnumArchitectureDemo {
    public enum TransactionStatus {
        PENDING {
            @Override
            public boolean canTransitionTo(TransactionStatus next) {
                return next == APPROVED || next == REJECTED;
            }
        },
        APPROVED {
            @Override
            public boolean canTransitionTo(TransactionStatus next) {
                return next == SETTLED;
            }
        },
        REJECTED {
            @Override
            public boolean canTransitionTo(TransactionStatus next) {
                return false; // Terminal state
            }
        },
        SETTLED {
            @Override
            public boolean canTransitionTo(TransactionStatus next) {
                return false; // Terminal state
            }
        };

        // Abstract method forced on every constant
        public abstract boolean canTransitionTo(TransactionStatus next);
    }

    public static void main(String[] args) {
        TransactionStatus current = TransactionStatus.PENDING;

        System.out.printf("Can PENDING -> APPROVED : %b%n", current.canTransitionTo(TransactionStatus.APPROVED));
        System.out.printf("Can PENDING -> SETTLED  : %b%n", current.canTransitionTo(TransactionStatus.SETTLED));

        // High-performance bit-vector set
        EnumSet<TransactionStatus> terminalStates = EnumSet.of(TransactionStatus.REJECTED, TransactionStatus.SETTLED);
        System.out.printf("Is PENDING terminal: %b%n", terminalStates.contains(current));

        // High-performance array-backed map
        EnumMap<TransactionStatus, Integer> counts = new EnumMap<>(TransactionStatus.class);
        counts.put(TransactionStatus.PENDING, 14);
        counts.put(TransactionStatus.APPROVED, 120);
        System.out.printf("Approved count: %d%n", counts.get(TransactionStatus.APPROVED));
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Can PENDING -> APPROVED : true
Can PENDING -> SETTLED  : false
Is PENDING terminal: false
Approved count: 120
```
</details>

---

## Pitfalls

- **Persisting with `ordinal()`:** Storing `ordinal()` integers in database tables corrupts data if constants are reordered or new constants are inserted in the enum source code. Always persist `name()` strings or an explicit code field.
- **Mutable Instance Fields in Enums:** Because enum constants are globally shared static singletons, adding non-final mutable fields introduces critical multithreading race conditions. Enums must always be immutable.
- **Overriding `equals()` is Prohibited:** `java.lang.Enum` declares `equals()` and `hashCode()` as `final`. Enums use reference identity (`==`) for equality checks.
- **Reflection Construction Forbidden:** Calling `Constructor.newInstance()` on an enum class throws `IllegalArgumentException: Cannot reflectively create enum objects`.

---

## Practice

### Question
Given the enum below, why does `Status.valueOf("pending")` fail at runtime?
```java
public enum Status { PENDING, ACTIVE, INACTIVE }
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `Enum.valueOf(Class, String)` requires an **exact, case-sensitive match** against the declared constant identifier.
2. Passing `"pending"` instead of `"PENDING"` fails the match.
3. The method throws `java.lang.IllegalArgumentException: No enum constant Status.pending`.

</details>
