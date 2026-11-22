---
id: topic-34
slug: try-with-resources-and-autocloseable
topicNumber: 34
title: Try-With-Resources & AutoCloseable
part: 'Part 1: Java Core'
sectionNumber: 9
sectionTitle: Exception Handling
versionBadge: Java 7+ / Java 9+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Automatic Resource Management (ARM), java.lang.AutoCloseable contract, reverse closing sequence, suppressed exceptions (getSuppressed), and Java 9 effectively final resource references.
prerequisites:
  - 'Topic 26: Interfaces & Modern Interface Evolution'
  - 'Topic 32: The Java Exception Hierarchy'
---

## Overview
The `try-with-resources` construct (Automatic Resource Management / ARM, introduced in Java 7) guarantees that opened resources are deterministically closed upon leaving the `try` block, whether execution finishes normally or abruptly via an exception. Any class implementing `java.lang.AutoCloseable` or `java.io.Closeable` is compatible with this syntax.

---

## ARM Execution Mechanics & Reverse Close Order

```
 [ Open Resource 1: Connection ]
               │
               ▼
 [ Open Resource 2: Statement  ]
               │
               ▼
 [ Execute try Block Body      ]
               │
               ▼ (On normal completion OR on thrown exception)
 [ Close Resource 2: Statement.close()  ]  ──► Closed FIRST (LIFO)
               │
               ▼
 [ Close Resource 1: Connection.close() ] ──► Closed SECOND
               │
               ▼
 [ Execute catch / finally Blocks       ]
```

- **Reverse Closing Order (LIFO):** Resources declared inside `try (R1; R2)` are closed in reverse order of their declaration: `R2.close()` executes before `R1.close()`.
- **Pre-Catch Execution:** Resource closing executes **before** any matching `catch` or `finally` blocks are entered.

---

## `AutoCloseable` vs `Closeable`

| Dimension | `java.lang.AutoCloseable` (Java 7+) | `java.io.Closeable` (Java 5+) |
| :--- | :--- | :--- |
| **Package** | `java.lang` | `java.io` |
| **`close()` Signature** | `void close() throws Exception;` | `void close() throws IOException;` |
| **Idempotence** | Recommended, not strictly mandated | Strongly mandated (closing twice has no effect) |
| **Target Scope** | Any managed resource (JDBC, Sockets, Locks) | I/O byte/character streams |

---

## Suppressed Exceptions (`getSuppressed()`)

If an exception occurs within the `try` block, and a subsequent exception is thrown during `close()`, the `try` block's exception is preserved as the **primary exception**. The secondary exception from `close()` is attached to the primary exception as a **suppressed exception** and can be retrieved via `e.getSuppressed()`:

```java
try (MyResource r = new MyResource()) {
    throw new RuntimeException("Primary Error in Body");
} catch (Exception e) {
    // e.getMessage() -> "Primary Error in Body"
    // e.getSuppressed()[0].getMessage() -> "Error in close()"
}
```

---

## Implementation Example

```java
public class TryWithResourcesDemo {
    public static class ManagedSession implements AutoCloseable {
        private final String sessionId;

        public ManagedSession(String id) {
            this.sessionId = id;
            System.out.printf("[Session %s] Acquired connection.%n", sessionId);
        }

        public void runQuery() throws Exception {
            System.out.printf("[Session %s] Executing SQL batch...%n", sessionId);
            throw new Exception("Network socket reset during query execution");
        }

        @Override
        public void close() throws Exception {
            System.out.printf("[Session %s] Closing socket and releasing pool lock.%n", sessionId);
        }
    }

    public static void main(String[] args) {
        try (ManagedSession session = new ManagedSession("SESSION-001")) {
            session.runQuery();
        } catch (Exception ex) {
            System.err.println("Caught Primary Exception: " + ex.getMessage());
            for (Throwable suppressed : ex.getSuppressed()) {
                System.err.println("  Attached Suppressed Exception: " + suppressed.getMessage());
            }
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
[Session SESSION-001] Acquired connection.
[Session SESSION-001] Executing SQL batch...
[Session SESSION-001] Closing socket and releasing pool lock.
Caught Primary Exception: Network socket reset during query execution
```
</details>

---

## Pitfalls

- **Java 9 Effectively Final References:** In Java 7/8, resources had to be declared inside `try (Resource r = ...)`. Java 9 allows referencing an existing variable `try (r)`, provided `r` is `final` or effectively final.
- **Closing Null Resources Safely:** The JVM checks for `null` before calling `close()`. If a resource initialization evaluates to `null`, `close()` is safely skipped without throwing `NullPointerException`.
- **Catching Before Close:** Code in a `catch` block executes *after* resources have closed. Trying to log transaction state or query the closed resource in `catch` triggers `SQLException: Connection closed`.
- **Non-Idempotent Custom `close()` Implementations:** Failing to make custom `close()` methods idempotent (safe to call multiple times without side effects) can create unexpected bugs when frameworks wrap streams.

---

## Practice

### Question
Given the two resources declared below, in what exact order are `close()` methods called?
```java
try (ResourceA a = new ResourceA();
     ResourceB b = new ResourceB()) {
    System.out.println("Work");
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `ResourceA` is initialized first, followed by `ResourceB`.
2. The `try-with-resources` specification mandates that resources are closed in reverse order of their declaration (LIFO stack).
3. Upon exit from the block, `b.close()` executes first, followed by `a.close()`.
4. Output order of closures: `b.close()` then `a.close()`.

</details>
