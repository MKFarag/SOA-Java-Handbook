---
id: topic-03
slug: your-first-java-program
topicNumber: 3
title: Your First Java Program
part: 'Part 1: Java Core'
sectionNumber: 1
sectionTitle: Foundations & Architecture
versionBadge: Java 8+
difficulty: Beginner
readingTime: 4 min read
shortDescription: >-
  Class declaration structure, main method anatomy, bytecode execution, and basic terminal output with println.
prerequisites:
  - 'Topic 01: What is Programming & How Code Runs'
  - 'Topic 02: JDK vs JRE vs JVM & Setup'
---

## Overview
Every standalone Java application executes starting from the `main` method entry point declared inside a class, producing basic terminal output via `System.out.println`.

---

## Program Structure

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### Keyword Specifications

- **`public` (class):** Grants the JVM runtime access to load and inspect the class definition.
- **`class HelloWorld`:** Defines the type container. The source file on disk must strictly match: `HelloWorld.java`.
- **`public` (method):** Allows the JVM launcher to invoke the entry point from outside the class boundary.
- **`static`:** Binds the method to the class itself, allowing invocation without allocating an object instance in heap memory.
- **`void`:** Declares that the method returns no value to the runtime caller upon termination.
- **`main`:** The exact identifier the JVM runtime searches for when bootstrapping execution.
- **`String[] args`:** Receives command-line arguments passed to the program at launch.

---

## Basic Console Output

Java provides `System.out` (`java.io.PrintStream`) for writing text to the standard output stream:

- **`System.out.println("text")`:** Emits text and appends a platform-specific line separator (`\r\n` on Windows, `\n` on Unix).
- **`System.out.print("text")`:** Emits text inline without terminating the current line.

---

## Pitfalls

- **Incorrect `main` Signature:** Declaring `public void main(String[] args)` (omitting `static`) compiles cleanly but crashes at runtime with `Main method is not static in class`.
- **Class and File Name Mismatch:** If the class is `public class App`, the file MUST be named `App.java`. Case mismatch will cause a compilation error.

---

## Example

```java
public class ProgramLifecycleDemo {
    public static void main(String[] args) {
        System.out.print("Initializing program... ");
        System.out.println("DONE");
        System.out.println("Hello, Java Platform!");
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Initializing program... DONE
Hello, Java Platform!
```
</details>

---

## Practice

### Q: Why must the `main` method in a standard Java application be declared `static`?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Declaring `main` as `static` allows the JVM runtime to invoke it directly on the class (`HelloWorld.main(...)`) without needing to construct an instance of the class via `new HelloWorld()` beforehand.
</details>
