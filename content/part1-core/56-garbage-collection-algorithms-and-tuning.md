---
id: topic-56
slug: garbage-collection-algorithms-and-tuning
topicNumber: 56
title: Garbage Collection Algorithms & Tuning
part: 'Part 1: Java Core'
sectionNumber: 14
sectionTitle: JVM Internals & Memory Architecture
versionBadge: Java 1.0+ / ZGC in Java 21 LTS
difficulty: Intermediate
readingTime: 13 min read
shortDescription: >-
  Master modern garbage collection algorithms: Generational hypothesis, G1 GC,
  ultra-low-latency ZGC, and GC logging.
prerequisites:
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 55: Java Memory Model & Runtime Data Areas'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Garbage Collection Algorithms and Tuning

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
In languages like C and C++, developers must manually manage memory by calling `malloc()` and `free()`. Manual memory management is notorious for catastrophic bugs:
- **Dangling Pointers**: Accessing memory that has already been deallocated, corrupting data.
- **Double Free**: Freeing the same memory twice, causing immediate crashes or security vulnerabilities.
- **Memory Leaks**: Forgetting to free allocated memory, gradually consuming all available RAM until the OS terminates the process.

Java eliminates manual deallocation using **Automatic Garbage Collection (GC)**. An internal JVM subsystem periodically identifies objects that are no longer reachable from any live execution root (local variables on active stacks, static fields, active threads) and reclaims their memory automatically.

GC relies on the empirical **Weak Generational Hypothesis**:
1. Most allocated objects die very young (e.g., local variables inside a method loop).
2. Objects that survive multiple garbage collection cycles tend to remain alive for a very long time (e.g., caches, singleton services).

**Real-World Analogy:**
Think of municipal waste management. In a household, disposable paper napkins and coffee cups are thrown into the kitchen trash bin every few minutes (**Eden Space / Young Generation**). The kitchen trash is emptied into the curbside bin daily (**Minor GC**). Sturdy furniture, appliances, and heirlooms stay in the house for decades (**Tenured / Old Generation**) and are only evaluated or cleared out during major home renovations (**Major / Full GC**).

---

### 2. Prerequisites
- **Classes and Objects (Topic 16)**: Understanding how references and heap memory work.
- **Java Memory Model & Runtime Areas (Topic 55)**: Understanding the Heap, Stack, and Metaspace layout.

---

### 3. Syntax Breakdown

#### 3.1 Generations in Modern HotSpot GC
The Java Heap is split logically (or dynamically partitioned in G1/ZGC) into:
- **Young Generation**:
  - **Eden Space**: Where new objects are initially allocated via `new`.
  - **Survivor Spaces (S0 / From, S1 / To)**: Objects that survive an Eden collection are copied here. Their tenure age increments.
- **Old (Tenured) Generation**: Holds long-lived objects that reached the tenure threshold (default `MaxTenuringThreshold = 15`).

#### 3.2 Reference Strengths (`java.lang.ref`)
Java provides four levels of reference reachability:
1. **Strong Reference**: `Object obj = new Object();` — Never collected as long as reference chain exists.
2. **Soft Reference (`SoftReference<T>`)**: Collected only when memory is critically low (ideal for memory-sensitive caches).
3. **Weak Reference (`WeakReference<T>`)**: Collected eagerly during the very next GC cycle once strong references disappear (ideal for canonical mappings like `WeakHashMap`).
4. **Phantom Reference (`PhantomReference<T>`)**: Enqueued when object is finalized, used with `Cleaner` for low-level resource tracking.

#### 3.3 Modern Garbage Collectors
- **Serial GC (`-XX:+UseSerialGC`)**: Single-threaded collector designed for small heaps (< 100 MB) or single-core CLI tools.
- **Parallel GC (`-XX:+UseParallelGC`)**: Multi-threaded young and old generation collector optimized for maximum batch throughput, accepting longer Stop-The-World (STW) pauses.
- **G1 GC (`-XX:+UseG1GC`)**: Default since Java 9. Divides the heap into thousands of equal-sized regions. Predictable pause times configured via `-XX:MaxGCPauseMillis=200`.
- **ZGC (`-XX:+UseZGC`)**: Ultra-low latency, concurrent generational collector (Java 21 LTS). Performs almost all marking, relocation, and reference processing concurrently with sub-millisecond maximum pause times regardless of heap size (from megabytes to 16 terabytes!).
- **Shenandoah GC (`-XX:+UseShenandoahGC`)**: Ultra-low latency collector developed by Red Hat, performing concurrent compaction.

---

### 4. Code Examples

#### Example 1: Weak References and Modern `java.lang.ref.Cleaner`
The following example demonstrates how `WeakReference` loses reachability during GC and how Java 9+ `Cleaner` replaces dangerous legacy `finalize()`:

```java
import java.lang.ref.Cleaner;
import java.lang.ref.WeakReference;

public class GarbageCollectionDemo {
    private static final Cleaner CLEANER = Cleaner.create();

    static class NativeResourceWrapper implements Runnable {
        private final String resourceId;

        NativeResourceWrapper(String resourceId) {
            this.resourceId = resourceId;
        }

        @Override
        public void run() {
            System.out.println("  [Cleaner Callback] Reclaiming native handle for: " + resourceId);
        }
    }

    static class ManagedResource {
        private final Cleaner.Cleanable cleanable;

        ManagedResource(String id) {
            this.cleanable = CLEANER.register(this, new NativeResourceWrapper(id));
        }
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== 1. WeakReference Mechanics ===");
        Object strongObject = new String("Transient Cache Payload");
        WeakReference<Object> weakRef = new WeakReference<>(strongObject);

        System.out.println("WeakRef holds value: " + (weakRef.get() != null));
        strongObject = null; // Clear strong reference

        System.gc(); // Request GC pass
        Thread.sleep(50);
        System.out.println("WeakRef cleared after GC: " + (weakRef.get() == null));

        System.out.println("\n=== 2. java.lang.ref.Cleaner (Modern Finalization) ===");
        allocateAndDiscard();
        System.gc();
        Thread.sleep(100);
        System.out.println("Cleaner execution completed.");
    }

    private static void allocateAndDiscard() {
        new ManagedResource("SOCKET-FD-4091");
    }
}
```

**Expected Output:**
```text
=== 1. WeakReference Mechanics ===
WeakRef holds value: true
WeakRef cleared after GC: true

=== 2. java.lang.ref.Cleaner (Modern Finalization) ===
  [Cleaner Callback] Reclaiming native handle for: SOCKET-FD-4091
Cleaner execution completed.
```

#### Example 2: Realistic Application — Heap Pressure & GC Metric Analyzer
In enterprise microservices, tracking garbage collector statistics through JMX `GarbageCollectorMXBean` provides real-time health telemetry:

```java
import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ManagementFactory;
import java.util.List;

public class HeapPressureAnalyzerApp {
    public static void main(String[] args) {
        System.out.println("Starting Heap Pressure & GC Metric Analyzer...");

        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        for (GarbageCollectorMXBean gc : gcBeans) {
            System.out.printf("  Collector: %-25s | Collections: %d | Time: %dms%n",
                    gc.getName(), gc.getCollectionCount(), gc.getCollectionTime());
        }

        long totalAllocated = 0;
        for (int batch = 0; batch < 1000; batch++) {
            byte[] transientBuffer = new byte[1024]; // 1 KB transient chunk
            transientBuffer[0] = (byte) (batch % 127);
            totalAllocated += transientBuffer.length;
        }

        System.out.println("Allocated & Discarded: " + (totalAllocated / 1024) + " KB transient chunks");
        System.out.println("Garbage Collection Metrics Polled Successfully.");
    }
}
```

**Expected Output:**
```text
Starting Heap Pressure & GC Metric Analyzer...
  Collector: G1 Young Generation       | Collections: 0 | Time: 0ms
  Collector: G1 Concurrent GC          | Collections: 0 | Time: 0ms
  Collector: G1 Old Generation         | Collections: 0 | Time: 0ms
Allocated & Discarded: 1000 KB transient chunks
Garbage Collection Metrics Polled Successfully.
```

---

### 5. Step-by-Step Execution Trace
1. When `strongObject = null` is set, the underlying heap `String` has zero strong references remaining.
2. When `System.gc()` runs, the Garbage Collector performs root tracing starting from GC roots (the main thread stack frame). Finding no strong path to the string, it marks the object dead and clears the `WeakReference` pointer.
3. In `allocateAndDiscard()`, `new ManagedResource("SOCKET-FD-4091")` is instantiated. When the method returns, the object reference goes out of scope and becomes phantom reachable.
4. The JVM GC notifies the `Cleaner` thread via a reference queue, which triggers `NativeResourceWrapper.run()` asynchronously, closing the native file descriptor cleanly.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Overriding `finalize()` in Modern Java
```java
// DANGEROUS ANTI-PATTERN:
@Override
protected void finalize() throws Throwable {
    closeFile(); // Deprecated, slow, unpredictable, and can resurrect objects!
}
```
- **Consequence**: `finalize()` delays GC reclamation across multiple collection passes, causes performance bottlenecks, and can resurrect dead objects.
- **Fix**: Implement `AutoCloseable` with `try-with-resources` (Topic 31), or use `java.lang.ref.Cleaner`.

#### Pitfall 2: Explicitly Calling `System.gc()` in Production Code
```java
public void processBatch() {
    // BUG: Forces a full Stop-The-World GC pass across all CPU cores!
    System.gc();
}
```
- **Consequence**: Disrupts HotSpot adaptive heuristics, inducing unneeded latency spikes across all threads.
- **Fix**: Remove explicit `System.gc()` calls. JVMs can disable explicit GC with `-XX:+DisableExplicitGC`.

---

### 7. Best Practices & When NOT to Use
- **Do**: Enable unified GC logging in production to diagnose latency and pauses:
  `-Xlog:gc*,gc+phases=debug:file=/var/log/gc.log:time,uptime,pid:filecount=5,filesize=100M`
- **Do**: Choose ZGC (`-XX:+UseZGC`) when consistent sub-millisecond response latency is critical (e.g., financial trading, interactive web games).
- **Don't**: Do not blindly increase heap size without understanding GC pauses. A huge heap under Parallel GC means proportionally longer Stop-The-World collection pauses.

---

### 8. Version Notes
- **Java 1.0**: Serial GC and `finalize()` introduced.
- **Java 9**: G1 GC became the default collector (replacing Parallel GC); `finalize()` marked deprecated.
- **Java 11**: ZGC and Shenandoah introduced as experimental features.
- **Java 15**: ZGC and Shenandoah graduated to production status.
- **Java 21 (LTS)**: Generational ZGC introduced via JEP 439, separating young and old generation concurrent collection.
- **Java 18+**: `finalize()` deprecated for removal via JEP 421.

---

### 9. Summary Cheat Sheet

| Collector | Flag | Best For | Typical Pause Time |
| :--- | :--- | :--- | :--- |
| **G1 GC** (Default) | `-XX:+UseG1GC` | General-purpose web apps | 100 – 200 ms (configurable) |
| **ZGC (Generational)**| `-XX:+UseZGC` | Latency-critical systems | **< 1 ms** |
| **Parallel GC** | `-XX:+UseParallelGC` | Offline batch processing / ETL | Seconds (STW) |
| **Serial GC** | `-XX:+UseSerialGC` | Microservices / small memory (<100MB) | Tens of milliseconds |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Clean Native Handle with `AutoCloseable`
Implement a `NativeBuffer` class that implements `AutoCloseable` to safely manage an integer memory pointer `int nativeHandle`. Demonstrate using it with `try-with-resources`.

<details>
<summary>View Solution</summary>

```java
public class NativeBuffer implements AutoCloseable {
    private int nativeHandle;

    public NativeBuffer(int handle) {
        this.nativeHandle = handle;
    }

    @Override
    public void close() {
        if (nativeHandle != 0) {
            System.out.println("Released native handle: " + nativeHandle);
            nativeHandle = 0;
        }
    }

    public static void main(String[] args) {
        try (NativeBuffer buffer = new NativeBuffer(994)) {
            System.out.println("Buffer in use.");
        }
    }
}
```
</details>

#### Exercise 2: Identify Reachability State
If an object is only reachable via a `WeakReference`, what will happen during the next minor GC pass?

<details>
<summary>View Solution</summary>

```text
Solution:
During the next GC pass, the garbage collector determines that the object has no strong or soft references. The object is marked for collection, its WeakReference is cleared (weakRef.get() returns null), and the object memory is reclaimed.
```
</details>

---

### 11. Sources & Official References
- [Oracle Java Documentation — HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/21/gctuning/)
- [OpenJDK JEP 439: Generational ZGC](https://openjdk.org/jeps/439)
- [OpenJDK JEP 421: Deprecate Finalization for Removal](https://openjdk.org/jeps/421)
