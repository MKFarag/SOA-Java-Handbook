---
id: topic-01
slug: what-is-programming-and-how-code-runs
topicNumber: 1
title: What is Programming & How Code Runs
part: 'Part 1: Java Core'
sectionNumber: 1
sectionTitle: Foundations & Architecture
versionBadge: Java 8+
difficulty: Beginner
readingTime: 4 min read
shortDescription: >-
  Execution pipeline: compilation, bytecode (.class), JVM runtime mechanics, and the JIT compiler.
prerequisites: []
---

## Overview
Java source code (`.java`) compiles into platform-independent bytecode (`.class`), which the Java Virtual Machine (JVM) loads, verifies, and optimizes into native machine code at runtime using the Just-In-Time (JIT) compiler.

---

## Architecture

```
[ Source (.java) ] ──(javac)──► [ Bytecode (.class) ] ──(JVM)──► [ Native CPU Code ]
```

### Execution Stages

1. **Compilation (`javac`):** The Java compiler parses source code, validates syntax and static types, and emits bytecode instructions (`.class` file, prefixed with magic bytes `0xCAFEBABE`).
2. **Class Loading & Verification:** The JVM ClassLoader loads bytecode into memory. The Bytecode Verifier checks structural constraints, stack bounds, and type safety before execution.
3. **Execution & JIT Optimization:** The JVM interpreter starts executing bytecode immediately. The JIT (Just-In-Time) compiler identifies frequently executed methods ("hot code") and compiles them directly into native host CPU instructions (x86, ARM) at runtime.

### Execution Model Comparison

| Model | Source to Execution | Examples | Portability | Startup Speed | Peak Performance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Purely Compiled** | Source -> Machine Binary | C, C++, Rust, Go | Platform-dependent binary | Instant | Maximum |
| **Purely Interpreted** | Source parsed & evaluated line-by-line | Python, Ruby, PHP | Portable scripts | Instant | Lower |
| **JVM Hybrid** | Source -> Bytecode (`javac`) -> JIT Native | Java, Kotlin, Scala | Write Once, Run Anywhere | Moderate | Near-native |

---

## Pitfalls

- **Filename Mismatch:** A `public` class must match its filename exactly (`public class OrderService` must reside in `OrderService.java`). Java is strictly case-sensitive.
- **Passing File Extension to Runtime:** Executing `java App.class` fails with `ClassNotFoundException`. Pass the class name only: `java App`.

---

## Example

```java
public class HardwareProbe {
    public static void main(String[] args) {
        int cpuCores = Runtime.getRuntime().availableProcessors();
        long maxMemoryMB = Runtime.getRuntime().maxMemory() / (1024 * 1024);
        String javaVersion = System.getProperty("java.specification.version");

        System.out.printf("Java %s | CPU Cores: %d | Max Heap: %d MB%n",
                javaVersion, cpuCores, maxMemoryMB);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Java 21 | CPU Cores: 16 | Max Heap: 4096 MB
```
</details>

---

## Practice

### Q: Why does the same `.class` file run on Windows x86 and macOS ARM without recompilation?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Bytecode is CPU-agnostic. The OS-specific JVM running on Windows or macOS translates those identical bytecode instructions into the host CPU's native instruction set at runtime.
</details>
