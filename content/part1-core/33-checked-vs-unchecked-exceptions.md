---
id: topic-33
slug: checked-vs-unchecked-exceptions
topicNumber: 33
title: Checked vs Unchecked Exceptions
part: 'Part 1: Java Core'
sectionNumber: 9
sectionTitle: Exception Handling
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: The Catch or Specify requirement for checked exceptions vs unchecked RuntimeExceptions, method signature contracts, throws clauses, and modern API design tradeoffs.
prerequisites:
  - 'Topic 32: The Java Exception Hierarchy'
---

## Overview
Java categorizes subclasses of `java.lang.Exception` into **checked** and **unchecked** exceptions. Checked exceptions enforce the compiler's **Catch or Specify Requirement**, compelling callers to catch the condition or declare it via `throws`. Unchecked exceptions (`RuntimeException` subtypes) represent programming defects and API misuse, imposing no compiler signature obligations.

---

## Architectural Comparison Matrix

| Dimension | Checked Exceptions | Unchecked Exceptions (`RuntimeException`) |
| :--- | :--- | :--- |
| **Inheritance** | Directly extends `Exception` (not `RuntimeException`) | Subclasses `java.lang.RuntimeException` |
| **Compiler Enforcement** | **Mandatory:** Must catch or declare via `throws` | **Optional:** Compiler ignores unhandled occurrences |
| **Primary Domain** | External environmental failures (I/O, SQL, Network) | Programming bugs, preconditions, contract violations |
| **Standard Examples** | `IOException`, `SQLException`, `ParseException` | `NullPointerException`, `IllegalArgumentException` |
| **Recovery Strategy** | Meaningful fallback or graceful degradation | Fix source code bug; fail-fast at boundary |
| **Modern API Usage** | Discouraged in modern frameworks (Spring, Quarkus) | Favored to avoid signature pollution and boilerplate |

---

## The "Catch or Specify" Contract

A method executing code that may throw a checked exception must satisfy one of two choices:

```java
// Choice 1: Catch and handle within method body
public void loadConfig() {
    try {
        readDiskFile();
    } catch (IOException e) {
        log.warn("Falling back to default memory config");
    }
}

// Choice 2: Specify and propagate to caller via method signature
public void loadConfig() throws IOException {
    readDiskFile(); // Propagates up the Call Stack
}
```

### Multi-Catch Syntax (Java 7+)

When handling multiple distinct exception types identically, group them with the pipe `|` operator. The caught parameter `ex` is **implicitly final**:

```java
try {
    executeRemoteService();
} catch (IOException | SQLException ex) {
    // ex cannot be reassigned (implicitly final)
    log.error("Storage / transport fault: " + ex.getMessage());
}
```

---

## Implementation Example

```java
import java.io.IOException;

public class ExceptionBoundaryDemo {
    // Checked Exception: Represents external transport failure
    public static class TransportException extends Exception {
        public TransportException(String msg, Throwable cause) {
            super(msg, cause);
        }
    }

    // Method enforcing Catch-or-Specify for checked exception
    public static void transmitPacket(byte[] payload) throws TransportException {
        if (payload == null) {
            // Unchecked: Precondition defect (developer error)
            throw new IllegalArgumentException("Payload cannot be null");
        }
        if (payload.length > 1024) {
            // Checked: External constraint failure
            throw new TransportException("Packet size exceeds buffer limit", null);
        }
        System.out.printf("Successfully dispatched %d bytes.%n", payload.length);
    }

    public static void main(String[] args) {
        // Handling checked exception boundary
        try {
            transmitPacket(new byte[512]);
            transmitPacket(new byte[2048]);
        } catch (TransportException e) {
            System.err.println("Handled checked boundary condition: " + e.getMessage());
        }

        // Triggering unchecked precondition guard
        try {
            transmitPacket(null);
        } catch (IllegalArgumentException e) {
            System.err.println("Handled programming defect: " + e.getMessage());
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Successfully dispatched 512 bytes.
Handled checked boundary condition: Packet size exceeds buffer limit
Handled programming defect: Payload cannot be null
```
</details>

---

## Pitfalls

- **Blindly Declaring `throws Exception`:** Marking public API methods with `throws Exception` defeats static type checking and forces every upstream caller to handle or re-throw raw `Exception`.
- **Catching Checked Exceptions and Doing Nothing:** Swallowing a checked exception without logging or re-throwing hides serious runtime outages.
- **Redundant Exceptions in Multi-Catch:** Combining related exceptions in a multi-catch (e.g. `catch (FileNotFoundException | IOException e)`) causes a compilation error because `FileNotFoundException` is already a subclass of `IOException`.
- **Checked Exceptions in Functional Streams:** Java lambda expressions cannot throw checked exceptions unless the target functional interface declares them, forcing developers to write cumbersome unchecked wrappers.

---

## Practice

### Question
Will the following code compile?
```java
public class MultiCatchQuiz {
    public static void main(String[] args) {
        try {
            if (args.length == 0) throw new java.io.FileNotFoundException("Missing");
            else throw new java.io.IOException("Disk error");
        } catch (java.io.FileNotFoundException | java.io.IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `java.io.FileNotFoundException` is a direct subclass of `java.io.IOException`.
2. Java language specification forbids listing alternatives in a multi-catch block where one alternative is a subclass of another.
3. The compiler flags this with error: `Types in multi-catch must be disjoint: FileNotFoundException is a subclass of IOException`.
4. Result: **Compile-time error**.

</details>
