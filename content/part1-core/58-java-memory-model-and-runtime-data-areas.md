---
id: topic-58
slug: java-memory-model-and-runtime-data-areas
topicNumber: 58
title: Java Memory Model & Runtime Data Areas
part: 'Part 1: Java Core'
sectionNumber: 14
sectionTitle: JVM Internals & Memory Architecture
versionBadge: Java 21 LTS Baseline (JSR-133)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: JVM memory architecture (Heap, Metaspace, Stack Frames, PC Register, Native Stack), Stack vs Heap mechanics, and JSR-133 Happens-Before formal invariants.
prerequisites:
  - 'Topic 02: JDK vs JRE vs JVM & Setup'
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 52: Synchronization & Memory Visibility'
---

## Overview
The JVM Specification divides runtime memory into **Thread-Shared** areas (Heap and Metaspace) and **Thread-Private** areas (JVM Stacks, Program Counter Registers, and Native Method Stacks). The Java Memory Model (JMM / JSR-133) provides the formal specification determining when writes to memory by one thread become visible to reads by another via **Happens-Before** invariants.

---

## JVM Runtime Data Areas

```
                     HotSpot JVM Memory Architecture
 ┌──────────────────────────────────────────────────────────────────┐
 │ Thread-Shared Memory (All Threads)                               │
 │  ┌─────────────────────────────────────┐  ┌────────────────────┐ │
 │  │ Java Heap                           │  │ Metaspace (Native) │ │
 │  │  - Young Gen (Eden, S0, S1)         │  │  - Class Metadata  │ │
 │  │  - Old Gen (Tenured)                │  │  - Constant Pool   │ │
 │  │  - String Constant Pool             │  │  - Method Bytecodes│ │
 │  └─────────────────────────────────────┘  └────────────────────┘ │
 ├──────────────────────────────────────────────────────────────────┤
 │ Thread-Private Memory (Per Active Thread)                        │
 │  ┌─────────────────────────┐  ┌──────────────┐  ┌──────────────┐ │
 │  │ JVM Call Stack          │  │ PC Register  │  │ Native Stack │ │
 │  │  - Stack Frames         │  │  (Bytecode   │  │  (C/C++ JNI  │ │
 │  │    - Local Variables    │  │   pointer)   │  │   frames)    │ │
 │  │    - Operand Stack      │  └──────────────┘  └──────────────┘ │
 │  │    - Frame Data / Return│                                     │
 │  └─────────────────────────┘                                     │
 └──────────────────────────────────────────────────────────────────┘
```

| Memory Region | Lifecycle Scope | Thread Safety | Primary Out-of-Memory Exception |
| :--- | :--- | :---: | :--- |
| **Java Heap** | JVM process start to shutdown | Shared (Requires coordination) | `OutOfMemoryError: Java heap space` |
| **Metaspace** | Class loading until ClassLoader GC | Shared | `OutOfMemoryError: Metaspace` |
| **JVM Stack** | Created on thread start; destroyed on exit | Thread-private (Safe by default) | `StackOverflowError` / `OOM: unable to create thread` |
| **PC Register**| Per-thread execution tracking | Thread-private | None |

---

## JMM Happens-Before Formal Axioms

A write action $A$ is guaranteed to be visible to a read action $B$ if and only if $A$ **happens-before** $B$ ($A \prec B$). The core axioms are:

1. **Program Order Rule:** Each action in a thread happens-before every subsequent action in that same thread.
2. **Monitor Lock Rule:** An unlock action on a monitor lock happens-before every subsequent lock acquisition on the same monitor.
3. **Volatile Variable Rule:** A write to a `volatile` field happens-before every subsequent read of that same `volatile` field.
4. **Thread Start Rule:** Calling `thread.start()` happens-before any action in the started thread.
5. **Thread Termination Rule:** Any action in a thread happens-before any other thread successfully returns from `thread.join()`.
6. **Transitivity:** If $A \prec B$ and $B \prec C$, then $A \prec C$.

---

## Implementation Example: Inspecting JVM Memory Metrics

```java
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

public class JvmMemoryMetricsDemo {
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long maxHeapBytes = runtime.maxMemory();
        long totalHeapBytes = runtime.totalMemory();
        long freeHeapBytes = runtime.freeMemory();
        long usedHeapBytes = totalHeapBytes - freeHeapBytes;

        System.out.println("--- JVM Heap Status ---");
        System.out.printf("Max Heap (-Xmx)   : %,10d MB%n", maxHeapBytes / (1024 * 1024));
        System.out.printf("Current Allocated : %,10d MB%n", totalHeapBytes / (1024 * 1024));
        System.out.printf("Used Memory       : %,10d MB%n", usedHeapBytes / (1024 * 1024));
        System.out.printf("Free In Allocation: %,10d MB%n", freeHeapBytes / (1024 * 1024));

        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage nonHeapUsage = memoryBean.getNonHeapMemoryUsage();
        System.out.println("--- Non-Heap (Metaspace / CodeCache) ---");
        System.out.printf("Non-Heap Used     : %,10d MB%n", nonHeapUsage.getUsed() / (1024 * 1024));
        System.out.printf("Non-Heap Committed: %,10d MB%n", nonHeapUsage.getCommitted() / (1024 * 1024));
    }
}
```

### Execution Output:
```text
--- JVM Heap Status ---
Max Heap (-Xmx)   :      4,096 MB
Current Allocated :        256 MB
Used Memory       :         12 MB
Free In Allocation:        244 MB
--- Non-Heap (Metaspace / CodeCache) ---
Non-Heap Used     :          8 MB
Non-Heap Committed:         15 MB
```

---

## Pitfalls

- **Confusing `StackOverflowError` with `OutOfMemoryError`:** Deep or un-terminated recursion exhausts thread call stack memory, triggering `StackOverflowError`. Heap exhaustion from accumulating uncollected objects throws `OutOfMemoryError: Java heap space`.
- **Metaspace Leaks via Dynamic Proxies / ClassLoaders:** Applications repeatedly generating classes via runtime bytecode enhancement (CGLIB, ByteBuddy) without unloading their ClassLoaders leak native memory, eventually throwing `OutOfMemoryError: Metaspace`.
- **Assuming Reordering Does Not Occur:** Without synchronization or `volatile`, compilers and CPUs freely reorder independent instructions. A thread checking `if (initialized)` can read `true` while the object fields are still being initialized by another thread.

---

## Practice

### Question
Where are local primitive variables (`int x = 5;`) stored inside the JVM, and where are object instance variables stored?

### Explanation
1. Local primitive variables declared inside a method are stored directly inside the **Local Variable Table of the active Thread Stack Frame** on the thread call stack.
2. Object instance variables (even primitives declared as fields inside a class) are stored on the **Java Heap**, embedded directly inside the memory layout of the enclosing heap object instance.
