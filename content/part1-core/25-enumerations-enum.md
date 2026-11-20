---
id: topic-25
slug: enumerations-enum
topicNumber: 25
title: Enumerations (enum)
part: 'Part 1: Java Core'
sectionNumber: 7
sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction'
versionBadge: Java 8+
difficulty: Beginner
readingTime: 11 min read
shortDescription: >-
  Master type-safe fixed sets of constants with the enum keyword. Add custom
  state, constructors, methods, constant-specific behavior, and explore
  EnumSet/EnumMap.
prerequisites:
  - 'Topic 09: Switch Statements & Switch Expressions'
  - 'Topic 16: Classes, Objects & Memory Layout'
relevanceLevel: ADVANCED / DEEP-DIVE
---
> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

## 1. What It Is and Why It Exists

An **enumeration** (declared using the `enum` keyword, introduced in Java 5) is a specialized class type representing a fixed, type-safe set of named constant values. Unlike languages like C/C++ where enums are simply integer aliases, in Java **an enum is a full-fledged Object-Oriented class** extending `java.lang.Enum`.

Each declared constant inside an enum is a `public static final` singleton instance of that enum class created when the class loads. Enums can have:
- Instance fields and custom constructors (always `private`).
- Methods and business logic.
- **Constant-specific class bodies** where individual enum values override methods polymorphically.

### The Real-World Analogy
Think of a physical traffic signal light:
- The light has exactly three mutually exclusive states: `RED`, `YELLOW`, and `GREEN` (**Enum Constants**).
- A traffic controller cannot invent a "PURPLE" state on a whim (**Type Safety**).
- Each color has specific properties: `RED` has wavelength 700nm and action `STOP`; `GREEN` has wavelength 530nm and action `GO` (**Custom Fields and Behavior**).
- The transition from `RED` to `GREEN` is strictly managed by city traffic rules (**State Machine Transitions**).

### Why Does This Exist?
Prior to Java 5, programmers used the "int Constant Anti-Pattern" (`public static final int STATE_ACTIVE = 1;`). This approach was hazardous: developers could accidentally pass `42` where a state code was expected, and integer constants had no readable string names during logging. Java enums provide absolute compile-time type safety, readable `name()` output, and eliminate invalid states.

---

## 2. Prerequisites
- **Topic 09: Switch Statements & Switch Expressions**
- **Topic 16: Classes, Objects & Memory Layout**

---

## 3. Syntax Breakdown & Core Methods

### Enum Anatomy with State & Methods
```java
public enum Priority {
    LOW(1, "Low priority"),
    MEDIUM(2, "Standard priority"),
    HIGH(3, "Urgent - process immediately");

    // Instance fields
    private final int level;
    private final String description;

    // Enum constructors are implicitly private!
    Priority(int level, String desc) {
        this.level = level;
        this.description = desc;
    }

    public int getLevel() { return level; }
}
```

### Built-in Methods in `java.lang.Enum`
- **`values()`:** Returns an array containing all constants in their declared order (`Priority[] all = Priority.values();`).
- **`valueOf(String name)`:** Parses a string into its matching enum constant; throws `IllegalArgumentException` if not found.
- **`name()`:** Returns the exact string identifier as declared in source code.
- **`ordinal()`:** Returns the zero-based declaration position (e.g., `LOW.ordinal() == 0`).

> [!CAUTION]
> Never use `.ordinal()` for database persistence or network wire protocols. If someone reorders or inserts an enum constant in source code, all stored ordinal numbers will shift, corrupting persisted data. Always serialize enums by `.name()` or a dedicated integer code field.

---

## 4. Runnable Code Examples

### Example 1: Custom Fields, Methods & Modern Switch
```java
// File: examples/core/EnumMechanics.java
public class EnumMechanics {

    public enum Priority {
        LOW(1, "Low priority - batch later"),
        MEDIUM(2, "Standard priority"),
        HIGH(3, "Urgent - process immediately"),
        CRITICAL(4, "Emergency - wake up on-call engineer");

        private final int level;
        private final String description;

        Priority(int level, String description) {
            this.level = level;
            this.description = description;
        }

        public int getLevel() { return level; }
        public String getDescription() { return description; }

        public boolean isUrgent() {
            return this.level >= 3;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Enum Iteration via values() ===");
        for (Priority p : Priority.values()) {
            System.out.printf("Name: %-8s | Ordinal: %d | Level: %d | Urgent: %b%n",
                    p.name(), p.ordinal(), p.getLevel(), p.isUrgent());
        }

        System.out.println("\n=== 2. Enum in Switch Expression ===");
        Priority current = Priority.valueOf("HIGH");
        String action = switch (current) {
            case LOW, MEDIUM -> "Enqueue to background worker";
            case HIGH -> "Process in dedicated VIP thread";
            case CRITICAL -> "Broadcast incident alert to pager";
        };
        System.out.println("Dispatch action: " + action);
    }
}
```

#### Expected Output
```text
=== 1. Enum Iteration via values() ===
Name: LOW      | Ordinal: 0 | Level: 1 | Urgent: false
Name: MEDIUM   | Ordinal: 1 | Level: 2 | Urgent: false
Name: HIGH     | Ordinal: 2 | Level: 3 | Urgent: true
Name: CRITICAL | Ordinal: 3 | Level: 4 | Urgent: true

=== 2. Enum in Switch Expression ===
Dispatch action: Process in dedicated VIP thread
```

---

### Example 2: Realistic Application (Finite State Machine with Enum Behaviors)
```java
// File: examples/core/OrderStateMachineApp.java
import java.util.EnumSet;
import java.util.Set;

public class OrderStateMachineApp {

    public enum OrderState {
        CREATED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.of(PAID, CANCELLED);
            }
        },
        PAID {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.of(SHIPPED, REFUNDED);
            }
        },
        SHIPPED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.of(DELIVERED);
            }
        },
        DELIVERED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.noneOf(OrderState.class);
            }
        },
        CANCELLED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.noneOf(OrderState.class);
            }
        },
        REFUNDED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.noneOf(OrderState.class);
            }
        };

        public abstract Set<OrderState> nextValidStates();

        public boolean canTransitionTo(OrderState target) {
            return nextValidStates().contains(target);
        }
    }

    public static class Order {
        private final String orderId;
        private OrderState state;

        public Order(String orderId) {
            this.orderId = orderId;
            this.state = OrderState.CREATED;
        }

        public boolean transition(OrderState nextState) {
            if (state.canTransitionTo(nextState)) {
                System.out.printf("[Order %s] Valid Transition: %s -> %s%n", orderId, state, nextState);
                this.state = nextState;
                return true;
            } else {
                System.out.printf("[Order %s] ILLEGAL Transition Attempt: %s -> %s (Rejected)%n",
                        orderId, state, nextState);
                return false;
            }
        }

        public OrderState getState() { return state; }
    }

    public static void main(String[] args) {
        System.out.println("=== Order State Machine Simulation ===");
        Order order = new Order("ORD-9901");

        order.transition(OrderState.PAID);
        order.transition(OrderState.DELIVERED); // Rejected
        order.transition(OrderState.SHIPPED);
        order.transition(OrderState.DELIVERED);
        order.transition(OrderState.CANCELLED); // Rejected (terminal state)
    }
}
```

#### Expected Output
```text
=== Order State Machine Simulation ===
[Order ORD-9901] Valid Transition: CREATED -> PAID
[Order ORD-9901] ILLEGAL Transition Attempt: PAID -> DELIVERED (Rejected)
[Order ORD-9901] Valid Transition: PAID -> SHIPPED
[Order ORD-9901] Valid Transition: SHIPPED -> DELIVERED
[Order ORD-9901] ILLEGAL Transition Attempt: DELIVERED -> CANCELLED (Rejected)
```

---

## 5. Step-by-Step Execution Trace

When the class `OrderStateMachineApp` loads:

```text
1. Enum Class Loading:
   - JVM loads OrderState class into Metaspace.
   - For each constant (CREATED, PAID, etc.), JVM instantiates a singleton instance.
   - Sets static fields:
     public static final OrderState CREATED = new OrderState$1("CREATED", 0);
     public static final OrderState PAID    = new OrderState$2("PAID", 1);
     ...

2. State Transition Check:
   - order.transition(OrderState.DELIVERED) is called while in PAID.
   - Calls state.canTransitionTo(DELIVERED).
   - Dynamic dispatch calls PAID.nextValidStates(), which returns [SHIPPED, REFUNDED].
   - .contains(DELIVERED) evaluates to false.
   - Transition is rejected!
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Attempting to Instantiate an Enum with `new`
```java
Priority p = new Priority(1, "Custom"); // COMPILE ERROR: enum types may not be instantiated
```
**Why it fails:** Enums represent fixed, closed sets of singletons. Allowing callers to create new enum values with `new` would destroy type safety.
**How to fix:** Access the existing singleton constants directly: `Priority.HIGH`.

### Mistake 2: Storing Ordinals in Databases
```java
int storedState = order.getState().ordinal(); // FRAGILE CODE!
```
**Why it is dangerous:** If a developer inserts a new constant `PREPARING` before `PAID`, all existing ordinal numbers shift by 1, corrupting every historical record in production!
**How to fix:** Store `.name()` or an explicit immutable code ID field.

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Use `EnumSet` and `EnumMap`:** High-performance specialized collections implemented internally via bit vectors (`long` bitmask). They are blazing fast and consume virtually zero memory.
2. **Exhaustive Modern Switch:** In Java 14+ switch expressions, if you cover all enum constants, you do NOT need a `default:` branch. If a constant is added later, the compiler immediately warns you.
3. **Use Constant-Specific Methods:** Instead of writing switch statements inside an enum, have constants override abstract methods.

### When NOT to Use
- **Do not use enums for dynamic, unbounded data:** If new values are frequently created by users at runtime (such as blog tags or product categories), store them in a database table, not in an enum.

---

## 8. Version Notes
- **Java 5 (J2SE 5.0):** `enum` keyword, `EnumSet`, and `EnumMap` introduced.
- **Java 14:** Modern switch expressions with exhaustive enum checking finalized.
- **Java 21:** Pattern matching in switch with enum constants finalized.

---

## 9. Summary Cheat Sheet

| Feature | Syntax / Method | Behavior |
| :--- | :--- | :--- |
| **Declaration** | `public enum Name { CONST_A, CONST_B }` | Creates closed set of type-safe object singletons. |
| **All Constants** | `Name.values()` | Returns array of all constants in order of declaration. |
| **String Lookup** | `Name.valueOf("CONST_A")` | Parses matching constant; throws `IllegalArgumentException` on failure. |
| **Position** | `constant.ordinal()` | Zero-based index; avoid for serialization. |
| **High-Perf Set** | `EnumSet.of(A, B)` | Bitmask collection with $O(1)$ operations. |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
Why does this enum fail compilation?
```java
public enum Currency {
    USD, EUR, JPY;
    public Currency() {} // COMPILE ERROR: modifier public not allowed here
}
```
<details>
<summary>View Solution</summary>

**Compiler Error:** `modifier public not allowed here`.
**Explanation:** Enum constructors are strictly `private`. Java forbids `public` or `protected` constructors on enums because enums cannot be instantiated outside their own declared constant list.
</details>

---

### Exercise 2: Hands-on Implementation
Write an enum `Operation` with constants `PLUS`, `MINUS`, `MULTIPLY`, `DIVIDE`. Each constant must implement an abstract method `double apply(double x, double y)`.
<details>
<summary>View Solution</summary>

```java
public enum Operation {
    PLUS {
        @Override public double apply(double x, double y) { return x + y; }
    },
    MINUS {
        @Override public double apply(double x, double y) { return x - y; }
    },
    MULTIPLY {
        @Override public double apply(double x, double y) { return x * y; }
    },
    DIVIDE {
        @Override public double apply(double x, double y) {
            if (y == 0.0) throw new ArithmeticException("Divide by zero");
            return x / y;
        }
    };

    public abstract double apply(double x, double y);
}
```
</details>

---

### Exercise 3: Real-World Edge Case
Is an enum singleton in Java completely immune to reflection and serialization attacks?
<details>
<summary>View Solution</summary>

**Answer:** Yes!
**Explanation:** In *Effective Java*, Joshua Bloch recommends single-element enums as the absolute gold standard for implementing the **Singleton Pattern**. The JVM explicitly prohibits `Constructor.newInstance()` from instantiating enums (throws `IllegalArgumentException: Cannot reflectively create enum objects`), and JVM serialization guarantees that deserialized enums resolve to the exact identical singleton instance without special `readResolve()` methods.
</details>

---

## 11. Official Sources & Specifications
- [Oracle Java Documentation: Enum Types](https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html)
- [dev.java: Enums in Java](https://dev.java/learn/classes-objects/enums/)
- [Java Language Specification §8.9: Enum Types](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.9)
