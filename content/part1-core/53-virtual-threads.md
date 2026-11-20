---
id: topic-53
slug: virtual-threads
topicNumber: 53
title: Virtual Threads (Project Loom)
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 21 LTS Standard Feature
difficulty: Intermediate
readingTime: 13 min read
shortDescription: >-
  Master lightweight user-mode virtual threads, carrier threads, unmounting
  mechanics, and high-throughput server concurrency.
prerequisites:
  - 'Topic 48: Threads and Thread Lifecycle'
  - 'Topic 51: Executor Framework and Thread Pools'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Virtual Threads (Project Loom)

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
Historically, every `java.lang.Thread` instance was a **platform thread**—a thin Java wrapper around an underlying operating system (OS) kernel thread. While platform threads provide true hardware parallelism, they carry substantial overhead:
- **High Memory Footprint**: Each platform thread reserves ~1 MB of native stack memory. Spawning 10,000 platform threads consumes ~10 GB of RAM.
- **Costly Context Switching**: Switching between OS threads requires kernel interrupts, saving CPU registers, and invalidating CPU caches.
- **Thread Exhaustion in Web Servers**: High-throughput web applications had to adopt complex asynchronous, reactive programming models (e.g., reactive callbacks, WebFlux) just to prevent OS thread starvation when waiting for blocking network or database I/O.

Java 21 revolutionized Java concurrency by introducing **Virtual Threads** (JEP 444, developed under Project Loom). Virtual threads are lightweight user-mode threads managed entirely by the Java Virtual Machine rather than the OS kernel.
- **Near-Zero Memory Overhead**: A virtual thread starts with only a few hundred bytes of heap memory, expanding dynamically.
- **Massive Scalability**: A single JVM can comfortably run **millions** of concurrent virtual threads simultaneously.
- **Preserved Thread-per-Request Simplicity**: Developers can write simple, synchronous, blocking code (like `socket.read()` or `Thread.sleep()`) without blocking the underlying OS thread! When a virtual thread blocks on I/O, the JVM automatically **unmounts** it from its underlying OS "carrier" thread, allowing the carrier thread to execute other virtual threads. When the I/O completes, the JVM remounts the virtual thread on an available carrier thread.

**Real-World Analogy:**
Imagine a large call center. Under the old platform thread model, every incoming caller is assigned a dedicated employee who sits at a desk. If the caller says, "Please hold while I find my paperwork," that employee must sit completely idle for 10 minutes, unable to help anyone else. Under the virtual thread model, the caller is put on a smart automated hold queue. The employee immediately answers the next caller. The second the first caller returns with their paperwork, any available employee picks up where they left off without skipping a beat.

---

### 2. Prerequisites
- **Threads and Lifecycle (Topic 48)**: Understanding `Thread`, `Runnable`, and thread states.
- **Executor Framework (Topic 51)**: Understanding `ExecutorService` and task dispatching.

---

### 3. Syntax Breakdown

#### 3.1 Creating Virtual Threads
Java provides fluent builder APIs and factory methods:
```java
// 1. Thread.ofVirtual() builder
Thread vt = Thread.ofVirtual()
                  .name("worker-vt")
                  .start(() -> {
                      // Work executed on virtual thread
                  });

// 2. Thread.startVirtualThread(Runnable)
Thread unstarted = Thread.ofVirtual().unstarted(task);

// 3. ExecutorService with Virtual Threads (Recommended for servers)
try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> {
        // Runs on a fresh virtual thread for every task
    });
} // Auto-closes and awaits task completion
```
- `Thread.isVirtual()`: Returns `true` if the thread is a virtual thread.
- `Executors.newVirtualThreadPerTaskExecutor()`: Creates an executor that spawns a new virtual thread for every submitted task. **Never pool virtual threads!** Creating them is so cheap that pooling them is an anti-pattern.

#### 3.2 Carrier Threads & Pinning
- **Carrier Thread**: An underlying OS platform thread (managed by a default HotSpot `ForkJoinPool`) that runs the virtual thread's bytecode.
- **Pinning**: In rare situations, a virtual thread cannot be unmounted when blocking on I/O:
  1. When executing inside a `synchronized` block or method (fixed in upcoming Java releases / Java 24+ via JEP 491).
  2. When executing a native method (JNI) or foreign function.
  - *Best Practice*: For lock synchronization that guards blocking I/O, replace `synchronized` with `ReentrantLock` (Topic 50) to allow unmounting.

---

### 4. Code Examples

#### Example 1: Virtual Thread Instantiation and Carrier Inspection
The following example demonstrates spawning a virtual thread, inspecting its carrier thread in the `ForkJoinPool`, and running 1,000 concurrent virtual threads in milliseconds:

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class VirtualThreadsDemo {
    public static void main(String[] args) throws InterruptedException {
        // 1. Spawning a named Virtual Thread
        Thread vt = Thread.ofVirtual().name("vt-worker").start(() -> {
            System.out.println("Running Virtual Thread: " + Thread.currentThread());
            System.out.println("Is Virtual Thread?      " + Thread.currentThread().isVirtual());
        });
        vt.join();

        // 2. Massive Scalability: 1,000 concurrent Virtual Threads
        int taskCount = 1000;
        long start = System.currentTimeMillis();

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < taskCount; i++) {
                executor.submit(() -> {
                    try {
                        // Unmounts from carrier thread during sleep
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                });
            }
        } // Executor auto-close blocks until all 1,000 virtual threads complete

        long elapsed = System.currentTimeMillis() - start;
        System.out.println("\nVirtual Threads Completed: " + taskCount + " / " + taskCount);
        System.out.println("Execution Duration:        " + elapsed + "ms");
    }
}
```

**Expected Output:**
```text
Running Virtual Thread: VirtualThread[#28,vt-worker]/runnable@ForkJoinPool-1-worker-1
Is Virtual Thread?      true

Virtual Threads Completed: 1000 / 1000
Execution Duration:        38ms
```

#### Example 2: Realistic Application — High-Throughput HTTP Simulator
In real-world web servers, thousands of concurrent HTTP clients send requests that block on external microservices or databases:

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class HighThroughputHttpSimulatorApp {
    record HttpResponse(int statusCode, String body) {}

    public static void main(String[] args) {
        int simulatedRequests = 2000;
        AtomicInteger successCounter = new AtomicInteger(0);

        System.out.println("Dispatching " + simulatedRequests + " concurrent requests using Virtual Threads...");
        long start = System.currentTimeMillis();

        try (ExecutorService server = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < simulatedRequests; i++) {
                final int reqId = i;
                server.submit(() -> {
                    HttpResponse response = handleClientRequest(reqId);
                    if (response.statusCode() == 200) {
                        successCounter.incrementAndGet();
                    }
                });
            }
        } // Awaits all 2000 requests

        long duration = Math.max(1, System.currentTimeMillis() - start);
        double throughput = (simulatedRequests * 1000.0) / duration;

        System.out.println("=== Simulation Results ===");
        System.out.println("Successful Responses: " + successCounter.get() + " / " + simulatedRequests);
        System.out.println("Total Wall-Clock Time: " + duration + "ms");
        System.out.printf("Throughput:            %.0f req/sec%n", throughput);
    }

    private static HttpResponse handleClientRequest(int id) {
        try {
            // Simulate 30ms blocking network round-trip to database
            Thread.sleep(30);
            return new HttpResponse(200, "{\"id\": " + id + ", \"status\": \"ACTIVE\"}");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new HttpResponse(500, "{\"error\": \"interrupted\"}");
        }
    }
}
```

**Expected Output:**
```text
Dispatching 2000 concurrent requests using Virtual Threads...
=== Simulation Results ===
Successful Responses: 2000 / 2000
Total Wall-Clock Time: 84ms
Throughput:            23809 req/sec
```

---

### 5. Step-by-Step Execution Trace
1. When `Executors.newVirtualThreadPerTaskExecutor()` submits a task, the JVM allocates a lightweight `VirtualThread` object on the Java heap.
2. The JVM mounts the virtual thread onto an available OS carrier thread from the internal `ForkJoinPool`.
3. When the task calls `Thread.sleep(30)` or blocks on a socket read, the JVM captures the virtual thread's stack frames (as a `Continuation` object) and preserves them on the heap.
4. The virtual thread is **unmounted**. The underlying OS carrier thread is immediately freed to execute other waiting virtual threads.
5. When the timer or OS epoll/kqueue/IOCP signal fires, the JVM schedules the virtual thread for resumption. An available carrier thread remounts the continuation stack and execution continues from the exact point of the sleep.
6. The entire 2,000-request simulation finishes in ~84 milliseconds using only a handful of physical OS carrier threads!

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Pooling Virtual Threads
```java
// ANTI-PATTERN: DO NOT DO THIS!
ExecutorService pool = Executors.newFixedThreadPool(100, Thread.ofVirtual().factory());
```
- **Consequence**: Virtual threads are ephemeral and cheap; pooling them limits concurrency and wastes memory.
- **Fix**: Never pool virtual threads. Always use `Executors.newVirtualThreadPerTaskExecutor()`.

#### Pitfall 2: Pinning Carrier Threads with `synchronized` on Blocking I/O (Prior to Java 24)
```java
// Pinning hazard when holding synchronized over blocking I/O:
synchronized (lock) {
    socket.getInputStream().read(); // Pins carrier thread to OS thread!
}
```
- **Consequence**: The carrier thread cannot be unmounted, reducing the thread pool capacity.
- **Fix**: Use `ReentrantLock` (Topic 50) around blocking I/O calls:
```java
reentrantLock.lock();
try {
    socket.getInputStream().read();
} finally {
    reentrantLock.unlock();
}
```

---

### 7. Best Practices & When NOT to Use
- **Do**: Use virtual threads for **I/O-bound** workloads (HTTP servers, database queries, file streaming, microservice aggregation).
- **Don't**: Do NOT use virtual threads for **CPU-bound** workloads (video transcoding, cryptography, machine learning math). Virtual threads do not make CPU instructions run faster; for CPU-heavy tasks, use standard platform thread pools sized to the number of CPU cores.
- **Do**: Leverage `try-with-resources` on `Executors.newVirtualThreadPerTaskExecutor()` for clear structured lifecycle boundaries.

---

### 8. Version Notes
- **Java 19 / 20**: Virtual Threads introduced as a preview feature (JEP 425 & JEP 436).
- **Java 21**: Virtual Threads became **Final & Permanent Standard Feature** via JEP 444 (LTS).
- **Java 24+**: JEP 491 (Synchronize Virtual Threads without Pinning) eliminates pinning for `synchronized` blocks.

---

### 9. Summary Cheat Sheet

| Characteristic | Platform Thread | Virtual Thread |
| :--- | :--- | :--- |
| **Creation Cost** | Heavy (native OS syscall) | Ultra-lightweight (Java heap object) |
| **Default Stack Size**| ~1 MB (fixed) | Starts at ~few hundred bytes (dynamic) |
| **Max Practical Count**| Few thousands (OS limited) | Millions (JVM heap limited) |
| **Blocking I/O Impact**| Blocks OS thread | Unmounts; carrier thread runs other work |
| **Pooling Policy** | Always pool (`FixedThreadPool`) | **Never pool** (`newVirtualThreadPerTaskExecutor`) |
| **Ideal Workload** | Heavy CPU computation | High-concurrency I/O and network requests |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Millions of Virtual Threads
Write a program that uses `Executors.newVirtualThreadPerTaskExecutor()` to run 10,000 tasks concurrently, where each task increments an `AtomicInteger` and sleeps for 5ms. Print the final counter and duration.

<details>
<summary>View Solution</summary>

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

public class ExerciseTenThousandThreads {
    public static void main(String[] args) {
        AtomicInteger counter = new AtomicInteger(0);
        long start = System.currentTimeMillis();

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10000; i++) {
                executor.submit(() -> {
                    try {
                        Thread.sleep(5);
                        counter.incrementAndGet();
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                });
            }
        }

        System.out.println("Finished: " + counter.get() + " tasks in " + (System.currentTimeMillis() - start) + "ms");
    }
}
```
</details>

#### Exercise 2: Detecting Virtual Thread Execution
Write a method `boolean isRunningOnVirtualThread()` that inspects `Thread.currentThread()` and returns `true` if invoked on a virtual thread and `false` otherwise. Demonstrate by calling it from both the `main` thread and a virtual thread.

<details>
<summary>View Solution</summary>

```java
public class ExerciseDetectVirtual {
    public static boolean isRunningOnVirtualThread() {
        return Thread.currentThread().isVirtual();
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("Main thread is virtual? " + isRunningOnVirtualThread());

        Thread vt = Thread.ofVirtual().start(() -> {
            System.out.println("VT is virtual? " + isRunningOnVirtualThread());
        });
        vt.join();
    }
}
```
</details>

---

### 11. Sources & Official References
- [OpenJDK JEP 444: Virtual Threads (Java 21 LTS)](https://openjdk.org/jeps/444)
- [Oracle Java Documentation — Virtual Threads Guide](https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html)
- [Inside Java — Project Loom and Virtual Threads Deep Dive](https://inside.java/tag/loom/)
