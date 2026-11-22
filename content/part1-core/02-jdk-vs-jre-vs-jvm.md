---
id: topic-02
slug: jdk-vs-jre-vs-jvm-and-setup
topicNumber: 2
title: JDK vs JRE vs JVM & Setup
part: 'Part 1: Java Core'
sectionNumber: 1
sectionTitle: Foundations & Architecture
versionBadge: Java 21 LTS (Baseline) / Java 25 LTS
difficulty: Beginner
readingTime: 5 min read
shortDescription: >-
  Architectural layers: the Java Virtual Machine (JVM), Runtime Environment (JRE), and Development Kit (JDK) with environment configuration.
prerequisites:
  - 'Topic 01: What is Programming & How Code Runs'
---

## Overview
The Java platform is organized into three concentric tiers: the JVM executes bytecode, the JRE packages the JVM with core class libraries, and the JDK provides the complete development toolset including compilers, debuggers, and packaging utilities.

---

## Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ JDK (Development Kit)                                       │
│ javac, jar, jshell, jdb, javap, jlink                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ JRE (Runtime Environment)                               │ │
│ │ Standard Libraries (java.base, Collections, I/O, Net)   │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ JVM (Virtual Machine)                               │ │ │
│ │ │ ClassLoader, JIT Compiler, Garbage Collector, Stack │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- **JVM (Java Virtual Machine):** The low-level execution engine. It allocates memory, manages the thread call stack and garbage-collected heap, and translates bytecode into host CPU instructions. It cannot compile source code.
- **JRE (Java Runtime Environment):** Bundles the JVM with compiled standard class libraries (`java.lang`, `java.util`, `java.io`). Required strictly for running existing applications. Since Java 9, custom lightweight runtimes are created via `jlink` rather than standalone JRE installers.
- **JDK (Java Development Kit):** The full developer suite containing the JRE, JVM, and CLI tools: `javac` (compiler), `jar` (packager), `jshell` (REPL), `javap` (disassembler), and `jdb` (debugger).

---

## Environment

Two environment variables configure the development toolchain:

- **`JAVA_HOME`:** Points to the JDK installation root directory (e.g., `C:\Program Files\Java\jdk-21` on Windows or `/usr/lib/jvm/java-21` on Linux).
- **`PATH`:** Must append `%JAVA_HOME%\bin` (Windows) or `$JAVA_HOME/bin` (Linux/macOS) so the operating system locates `javac` and `java` globally.

---

## Pitfalls

- **`JAVA_HOME` Path Ending in `/bin`:** `JAVA_HOME` must point to the JDK root directory, not its `bin` folder. Build tools like Maven and Gradle append `/bin` internally and fail if it is duplicated.
- **Toolchain Version Mismatch:** Having multiple Java installations where `PATH` resolves a different version than `JAVA_HOME`. Verify consistency by running `javac -version` and `java -version`.

---

## Example

```java
public class RuntimeEnvironmentProbe {
    public static void main(String[] args) {
        System.out.println("Java Home    : " + System.getProperty("java.home"));
        System.out.println("Java Version : " + System.getProperty("java.version"));
        System.out.println("JVM Vendor   : " + System.getProperty("java.vm.vendor"));
        System.out.println("JVM Name     : " + System.getProperty("java.vm.name"));
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Java Home    : C:\Program Files\Java\jdk-21
Java Version : 21.0.2
JVM Vendor   : Oracle Corporation
JVM Name     : Java HotSpot(TM) 64-Bit Server VM
```
</details>

---

## Practice

### Q: Why do production Docker containers for Java microservices rarely include a full JDK?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Production containers only need to execute pre-compiled `.class` or `.jar` files, not compile source code. Omitting the JDK (compiler, debuggers) minimizes image size (reducing attack surface and cold-start transfer time), often utilizing a trimmed JRE or a custom image built with `jlink`.
</details>
