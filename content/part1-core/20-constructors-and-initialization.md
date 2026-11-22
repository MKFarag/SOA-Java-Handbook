---
id: topic-20
slug: constructors-and-initialization
topicNumber: 20
title: Constructors & Object Initialization
part: 'Part 1: Java Core'
sectionNumber: 6
sectionTitle: Object-Oriented Programming (OOP) Essentials
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Object instantiation lifecycle, default vs parameterized constructors, this() constructor chaining, static and instance initialization blocks, and strict JVM execution order.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
---

## Overview
A constructor is a specialized sub-routine invoked during object instantiation via `new` to establish class invariants and initialize fields. If a class declares zero constructors, the compiler supplies a default parameterless constructor; declaring any explicit constructor immediately suppresses this default.

---

## JVM 5-Step Initialization Sequence

When a class is instantiated for the first time, the JVM follows a strict deterministic initialization pipeline:

```
 [ Step 1: Class Loading ] ──► Static fields initialized & static blocks execute (once per ClassLoader)
                                     │
                                     ▼
 [ Step 2: Memory Zeroing ] ──► Heap space allocated; all instance fields set to type defaults (0, null, false)
                                     │
                                     ▼
 [ Step 3: Chain Delegation ] ─► Superclass constructor invoked via super() or overloaded via this()
                                     │
                                     ▼
 [ Step 4: Instance Init ] ───► Instance field initializers and instance initializer blocks execute top-to-bottom
                                     │
                                     ▼
 [ Step 5: Constructor Body ] ─► Remaining statements in constructor body execute
```

---

## Constructor Chaining with `this()`

Constructors can delegate to overloaded peer constructors within the same class using `this(arguments)`.

### Syntax Rules
- **First Statement Invariant:** `this(...)` or `super(...)` must be the **very first statement** in a constructor body.
- **Mutual Exclusivity:** A single constructor cannot call both `this(...)` and `super(...)`.
- **Prohibition of Recursion:** Circular chaining (`Constructor A` calls `B`, `B` calls `A`) triggers compile-time error `recursive constructor invocation`.

### Initialization Construct Comparison

| Construct | Execution Trigger | Frequency | Can Access `this`? | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Static Initializer (`static { }`)** | Class loading by JVM | Once per ClassLoader | No (static context only) | Loading native libraries, static registry lookup |
| **Instance Initializer (`{ }`)** | Object allocation | Every instantiation | Yes | Shared init code across anonymous classes |
| **Constructor (`ClassName()`)** | Explicit `new` invocation | Every instantiation | Yes | Parameterized state validation and initialization |

---

## Implementation Example

```java
public class DatabasePoolConfig {
    private final String url;
    private final int maxConnections;
    private final int timeoutSeconds;

    // Master (canonical) constructor
    public DatabasePoolConfig(String url, int maxConnections, int timeoutSeconds) {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("Database URL cannot be null or blank");
        }
        this.url = url;
        this.maxConnections = maxConnections;
        this.timeoutSeconds = timeoutSeconds;
    }

    // Delegating constructor with default timeout
    public DatabasePoolConfig(String url, int maxConnections) {
        this(url, maxConnections, 30); // Chains to master constructor
    }

    // Delegating constructor with default connection settings
    public DatabasePoolConfig(String url) {
        this(url, 10, 30); // Chains to master constructor
    }

    @Override
    public String toString() {
        return String.format("Pool[url=%s, maxConn=%d, timeout=%ds]", url, maxConnections, timeoutSeconds);
    }

    public static void main(String[] args) {
        DatabasePoolConfig defaultPool = new DatabasePoolConfig("jdbc:postgresql://localhost:5432/orders");
        DatabasePoolConfig highLoadPool = new DatabasePoolConfig("jdbc:postgresql://localhost:5432/analytics", 50, 60);

        System.out.println(defaultPool);
        System.out.println(highLoadPool);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Pool[url=jdbc:postgresql://localhost:5432/orders, maxConn=10, timeout=30s]
Pool[url=jdbc:postgresql://localhost:5432/analytics, maxConn=50, timeout=60s]
```
</details>

---

## Pitfalls

- **Compiler Withdrawing the Default Constructor:** Adding a parameterized constructor `public User(String name)` removes the compiler-generated `public User()`. Any callers invoking `new User()` will immediately fail compilation unless the no-arg constructor is explicitly declared.
- **Invoking Overridable Methods in Constructors:** If a constructor calls a non-final method overridden by a subclass, that subclass method executes *before* the subclass fields are initialized, reading uninitialized default zeros/nulls.
- **Escaping `this` in Constructors:** Publishing `this` to another thread or event listener before the constructor finishes exposes partially initialized objects, causing concurrency race conditions.
- **Confusing Instance Initializer Blocks with Static Blocks:** Instance blocks `{ ... }` execute on every object instantiation immediately before the constructor body, whereas `static { ... }` blocks execute only once when the class is initially linked.

---

## Practice

### Question
Given the class below, what is the output when executing `new Child();`?
```java
class Parent {
    Parent() { System.out.print("P "); }
}
class Child extends Parent {
    Child() {
        this("A ");
        System.out.print("B ");
    }
    Child(String s) {
        System.out.print(s);
    }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `new Child()` delegates to `this("A ")`.
2. `Child(String s)` does not contain an explicit `this()` or `super()`, so the compiler automatically injects `super()` as its first statement.
3. `super()` invokes `Parent()` $\rightarrow$ prints `"P "`.
4. `Child(String s)` resumes $\rightarrow$ prints `"A "`.
5. Control returns to `Child()` $\rightarrow$ prints `"B "`.
6. Output: `P A B `.

</details>
