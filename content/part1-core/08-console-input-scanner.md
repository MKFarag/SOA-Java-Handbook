---
id: topic-08
slug: console-input-scanner
topicNumber: 8
title: Interactive Console Input with Scanner
part: 'Part 1: Java Core'
sectionNumber: 2
sectionTitle: Language Basics & Data Types
versionBadge: Java 8+
difficulty: Beginner
readingTime: 6 min read
shortDescription: >-
  Interactive terminal input with java.util.Scanner, input tokenization, the trailing newline buffer trap, and defensive validation.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
---

## Overview
`java.util.Scanner` provides interactive console input by parsing primitive types and strings from `System.in` using regular expression delimiters.

---

## Initialization & Syntax

```java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
```

---

## Key Methods Reference

| Method | Return Type | Delimiter | Consumes Trailing Newline (`\n`)? | Thrown Exception on Invalid Input |
| :--- | :--- | :--- | :---: | :--- |
| **`scanner.nextLine()`** | `String` | Line break (`\n`) | **Yes** | `NoSuchElementException` |
| **`scanner.next()`** | `String` | Whitespace | No | `NoSuchElementException` |
| **`scanner.nextInt()`** | `int` | Whitespace | No | `InputMismatchException` |
| **`scanner.nextDouble()`**| `double` | Whitespace | No | `InputMismatchException` |
| **`scanner.nextBoolean()`**| `boolean`| Whitespace | No | `InputMismatchException` |
| **`scanner.hasNextInt()`** | `boolean` | Lookahead token | — | None (safe guard) |

---

## The Trailing Newline Buffer Trap

Calling `scanner.nextInt()` reads only numeric characters and leaves the trailing newline character (`\n`) in the input buffer. When a subsequent `scanner.nextLine()` runs, it immediately encounters that leftover `\n`, consumes it, and returns an empty string without waiting for user input.

### Problem Code
```java
int age = scanner.nextInt();      // Leaves '\n' in buffer
String name = scanner.nextLine(); // Immediately consumes '\n', returning ""!
```

### Production Best Practice Fix
Never mix token-based reading (`nextInt`) with line-based reading (`nextLine`). Always read entire lines with `nextLine()` and parse explicitly:

```java
System.out.print("Enter age: ");
int age = Integer.parseInt(scanner.nextLine().trim());

System.out.print("Enter name: ");
String name = scanner.nextLine(); // Buffer is clean and safe
```

---

## Safe Input Validation Guard

To prevent `InputMismatchException` from crashing the application when users type invalid input:

```java
int validPort = -1;
while (validPort < 0) {
    System.out.print("Enter port (1024-65535): ");
    if (scanner.hasNextInt()) {
        int input = scanner.nextInt();
        scanner.nextLine(); // Flush newline
        if (input >= 1024 && input <= 65535) {
            validPort = input;
        } else {
            System.out.println("Error: Port out of range.");
        }
    } else {
        System.out.println("Error: Numeric digits required.");
        scanner.nextLine(); // Discard invalid token
    }
}
```

---

## Pitfalls

- **Closing `Scanner(System.in)` in Helper Methods:** Calling `scanner.close()` permanently closes the underlying JVM `System.in` stream. Close the scanner only once upon application shutdown.
- **Unhandled Exceptions:** Direct calls like `scanner.nextInt()` throw unchecked `InputMismatchException` if non-numeric characters are entered.
- **Locale-Dependent Decimals:** `scanner.nextDouble()` expects either a comma `,` or period `.` depending on the host OS default locale (`Locale.getDefault()`).

---

## Example

```java
import java.util.Scanner;

public class ConsoleInputDemo {
    public static void main(String[] args) {
        // Simulating user input stream for verification
        String mockInput = "8080\nAuthService\n";
        Scanner scanner = new Scanner(mockInput);

        System.out.println("Reading configuration...");
        int port = Integer.parseInt(scanner.nextLine().trim());
        String serviceName = scanner.nextLine().trim();

        System.out.printf("Service '%s' configured on port %d.%n", serviceName, port);
        scanner.close();
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Reading configuration...
Service 'AuthService' configured on port 8080.
```
</details>

---

## Practice

### Q: Why does calling `scanner.close()` inside a method prevent any subsequent `Scanner` on `System.in` from working?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** `Scanner.close()` closes the underlying `Readable` or `InputStream` source it wraps. Closing `System.in` closes standard input at the OS/JVM process level; it cannot be reopened during the application lifecycle.
</details>
