---
id: topic-56
slug: virtual-threads
topicNumber: 56
title: Virtual Threads (Project Loom)
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 21 LTS Standard Feature (JEP 444)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Lightweight user-mode threads (JEP 444), Carrier Threads (ForkJoinPool), unmounting and remounting on blocking I/O, thread pinning hazards, and Executors.newVirtualThreadPerTaskExecutor().
prerequisites:
  - 'Topic 51: Threads and Thread Lifecycle'
  - 'Topic 54: Executor Framework & Thread Pools'
---

## Overview
Virtual Threads (finalized in Java 21 LTS via JEP 444) are lightweight user-mode threads managed by the Java Virtual Machine rather than the operating system. By decoupling Java threads from 1:1 kernel threads, a single JVM can host millions of concurrent virtual threads, restoring the synchronous, readable "thread-per-request" programming model to high-throughput servers.

---

## Platform Threads vs Virtual Threads

```
 Traditional Platform Thread Model (1:1 Kernel Mapping)
  [ Java Thread ] ──────────► [ OS Kernel Thread (1 MB Stack) ]

 Virtual Thread Model (M:N User-Mode Mapping)
  [ Virtual Thread 1 ] ──┐
  [ Virtual Thread 2 ] ──┼──► [ Carrier Thread ] ──► [ OS Kernel Thread ]
  [ Virtual Thread N ] ──┘   (ForkJoinPool worker)
```

| Dimension | Platform Threads | Virtual Threads (Java 21) |
| :--- | :--- | :--- |
| **Mapping Model** | 1:1 with OS Kernel Thread | $M:N$ (Millions of VTs on few Carrier Threads) |
| **Stack Memory** | ~1 MB reserved per thread | Starts at ~hundreds of bytes on the Heap |
| **Creation Cost** | Expensive (OS kernel syscall) | Cheap (plain Java heap object allocation) |
| **Concurrency Ceiling** | Thousands (bounded by RAM) | **Millions** concurrently |
| **Blocking Behavior** | Blocks underlying OS kernel thread | **Unmounts** from carrier thread; carrier runs other tasks |
| **Pooling Policy** | **Must be pooled** (`ThreadPoolExecutor`)| **NEVER pool**; instantiate per task and discard |

---

## Unmounting & Continuation Mechanics

When a virtual thread encounters a blocking operation (e.g. `InputStream.read()`, `Socket.connect()`, `LockSupport.park()`, `Thread.sleep()`):
1. The JVM captures the virtual thread's stack frames as a heap object (**Continuation**).
2. The virtual thread is **unmounted** from its underlying OS **carrier thread** (a FIFO `ForkJoinPool` worker).
3. The carrier thread immediately executes other runnable virtual threads.
4. When the OS signals that the I/O operation has completed, the JVM **remounts** the continuation onto any available carrier thread to resume execution.

---

## Thread Pinning Hazard

A virtual thread is **pinned** to its carrier thread if it encounters a blocking operation inside:
1. A **`synchronized` block or method** (locks monitor in object header).
2. A **native method call** (JNI or Foreign Function & Memory API).

When pinned, the virtual thread CANNOT unmount, freezing the underlying OS carrier thread during the blocking call.
- **Remedy:** Replace `synchronized` with `java.util.concurrent.locks.ReentrantLock` in high-throughput blocking code paths.
- **Detection Flag:** Run with `-Djdk.tracePinnedThreads=full` to print stack traces of pinned threads.

---

## Implementation Example: 10,000 Concurrent Virtual Tasks

```java
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.Executors;
import java.util.stream.IntStream;

public class VirtualThreadScaleDemo {
    public static void main(String[] args) {
        Instant start = Instant.now();

        // New virtual-thread-per-task executor (Java 21)
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            IntStream.range(0, 10_000).forEach(i -> {
                executor.submit(() -> {
                    // Blocking I/O simulation: unmounts from carrier thread
                    Thread.sleep(Duration.ofMillis(200));
                    return i;
                });
            });
        } // try-with-resources triggers executor.close(), awaiting completion of all tasks

        Duration elapsed = Duration.between(start, Instant.now());
        System.out.printf("Successfully executed 10,000 concurrent tasks in %d ms!%n", elapsed.toMillis());
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Successfully executed 10,000 concurrent tasks in 380 ms!
```
</details>

---

## Pitfalls

- **Pooling Virtual Threads:** Attempting to put virtual threads into a fixed thread pool (`newFixedThreadPool`) is an anti-pattern. Virtual threads are designed to be short-lived, transient, and created anew for every task via `Executors.newVirtualThreadPerTaskExecutor()`.
- **Pinning Carrier Threads with `synchronized`:** Executing blocking I/O (e.g. JDBC queries) inside `synchronized (lock)` blocks pins the carrier thread, neutralizing virtual thread throughput gains. Use `ReentrantLock`.
- **Excessive ThreadLocal Memory:** Retaining large objects in `ThreadLocal` variables across millions of virtual threads consumes massive heap memory. Use Java 21+ **Scoped Values** instead.

---

## Practice

### Question
Why does executing 10,000 tasks that each sleep for 200ms complete in ~380ms with virtual threads, whereas platform threads in a pool of 10 threads would require ~200 seconds?

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. With platform threads in a pool of 10 workers, only 10 threads can sleep concurrently. 10,000 tasks / 10 = 1,000 batches $\times$ 200ms = 200 seconds.
2. With virtual threads, all 10,000 tasks are launched concurrently.
3. When each virtual thread hits `Thread.sleep(200)`, it immediately **unmounts** from its carrier thread.
4. The handful of CPU carrier threads easily schedule and unmount all 10,000 tasks within milliseconds.
5. After 200ms, all 10,000 timers expire, and carrier threads remount and complete them almost simultaneously in parallel.

</details>
