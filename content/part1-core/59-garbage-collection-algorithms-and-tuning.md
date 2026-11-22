---
id: topic-59
slug: garbage-collection-algorithms-and-tuning
topicNumber: 59
title: Garbage Collection Algorithms & Tuning
part: 'Part 1: Java Core'
sectionNumber: 14
sectionTitle: JVM Internals & Memory Architecture
versionBadge: Java 21 LTS / Java 25 Baseline
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Weak Generational Hypothesis, GC root tracing, HotSpot collectors (Serial, Parallel, G1 GC, Generational ZGC), reference strengths, and GC logging (-Xlog:gc*).
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 58: Java Memory Model & Runtime Data Areas'
---

## Overview
Java utilizes automated Garbage Collection (GC) to reclaim memory occupied by unreferenced heap objects. Governed by the **Weak Generational Hypothesis** (most objects die shortly after allocation), HotSpot segments memory into generational partitions to minimize Stop-The-World (STW) pause times while maximizing throughput.

---

## GC Roots Tracing & Generational Memory

```
                       GC Root Reachability Tracing
 ┌─────────────────────────────────────────────────────────────┐
 │ GC Roots: Active Stack Frames, Static Fields, JNI Handles   │
 └──────────────────────────────┬──────────────────────────────┘
                                │ (Pointer traversal)
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Live Object Graph ──► Retained in Heap (Eden / Survivor / S1)│
 ├─────────────────────────────────────────────────────────────┤
 │ Unreachable Islands ─► Reclaimed during Minor / Major GC    │
 └─────────────────────────────────────────────────────────────┘
```

- **Minor GC:** Reclaims short-lived objects from Eden and Survivor spaces ($O(\text{live objects})$).
- **Tenuring:** Objects surviving successive cycles increment their age until promoted to the Old (Tenured) Generation (`-XX:MaxTenuringThreshold=15`).

---

## Modern HotSpot Collector Comparison

| Collector | JVM Flag | Target Workload | STW Pause Target | Heap Sizing |
| :--- | :--- | :--- | :--- | :--- |
| **Serial GC** | `-XX:+UseSerialGC` | Single-core, embedded, CLI tools | Significant (Single-threaded) | $< 100$ MB |
| **Parallel GC** | `-XX:+UseParallelGC` | High-throughput batch processing | High throughput, longer pauses | Up to tens of GB |
| **G1 GC** (Default) | `-XX:+UseG1GC` | Multi-core enterprise servers | Predictable ($100-200$ ms) | 4 GB - 64 GB |
| **Generational ZGC** | `-XX:+UseZGC -XX:+ZGenerational` | Ultra-low latency microservices | **Sub-millisecond ($< 1$ ms)** | 8 GB to 16 TB |

---

## Reference Strengths (`java.lang.ref`)

| Reference Type | Class | Reclaimed Under What Conditions? | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **Strong** | `Object obj = new Object()` | Never, while GC root chain persists | Standard application business state |
| **Soft** | `SoftReference<T>` | Only when memory is **critically low** | In-memory sensitive caches |
| **Weak** | `WeakReference<T>` | **Immediately** on next GC cycle | Metadata mappings (`WeakHashMap`) |
| **Phantom** | `PhantomReference<T>` | After finalization; pre-memory reclaim | Off-heap direct memory cleanup (`Cleaner`) |

---

## Key Production Flags

```bash
# Sizing Heap
-Xms4g -Xmx4g -XX:+AlwaysPreTouch

# Collector Selection: Generational ZGC (Java 21+)
-XX:+UseZGC -XX:+ZGenerational

# Production Unified GC Logging
-Xlog:gc*,gc+phases=debug:file=/var/log/jvm/gc.log:time,uptime,pid:filecount=5,filesize=100M
```

---

## Implementation Example: Inspecting GC Metrics via JMX

```java
import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ManagementFactory;
import java.util.List;

public class GcDiagnosticsDemo {
    public static void main(String[] args) {
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();

        System.out.println("--- Active JVM Garbage Collectors ---");
        for (GarbageCollectorMXBean gc : gcBeans) {
            System.out.printf("Collector Name : %s%n", gc.getName());
            System.out.printf("  Collection Count : %,d%n", gc.getCollectionCount());
            System.out.printf("  Accumulated Time : %,d ms%n", gc.getCollectionTime());
            System.out.println("  Memory Pools     : " + String.join(", ", gc.getMemoryPoolNames()));
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
--- Active JVM Garbage Collectors ---
Collector Name : G1 Young Generation
  Collection Count : 4
  Accumulated Time : 18 ms
  Memory Pools     : G1 Eden Space, G1 Survivor Space
Collector Name : G1 Old Generation
  Collection Count : 0
  Accumulated Time : 0 ms
  Memory Pools     : G1 Eden Space, G1 Survivor Space, G1 Old Gen
```
</details>

---

## Pitfalls

- **Explicit `System.gc()` Calls:** Invoking `System.gc()` forces an immediate, un-optimized Stop-The-World Full GC pause across the entire heap. Disable this behavior in production with `-XX:+DisableExplicitGC`.
- **Humongous Objects in G1 GC:** In G1, an object occupying $> 50\%$ of a region is categorized as a "Humongous Object", allocated directly into contiguous Old Generation regions, bypassing Eden and accelerating Full GC fragmentation.
- **Relying on Finalizers:** `Object.finalize()` is deprecated and fundamentally flawed (can resurrect objects, stalls GC queues). Use `java.lang.ref.Cleaner` or `AutoCloseable` for resource reclamation.

---

## Practice

### Question
Why is `WeakHashMap` unable to automatically collect keys that are `String` literals (e.g. `map.put("AUTH_TOKEN", data)`)?

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `WeakHashMap` uses `WeakReference` for its keys: when a key is no longer strongly referenced, its entry is purged on the next GC.
2. However, string literals like `"AUTH_TOKEN"` are automatically stored and interned in the JVM **String Constant Pool**.
3. The String Constant Pool maintains a permanent **strong reference** to the literal string object for the entire lifetime of the JVM.
4. Because the key is never weakly reachable, the entry is never collected, defeating the purpose of `WeakHashMap`.

</details>
