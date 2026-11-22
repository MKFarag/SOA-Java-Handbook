---
id: topic-52
slug: synchronization-and-memory-visibility
topicNumber: 52
title: Synchronization & Memory Visibility
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 1.0+ / JSR-133 (Java 5)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Mutual exclusion via synchronized monitor locks, happens-before memory visibility, the volatile keyword, CPU cache coherence, and deadlock prevention.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 51: Threads and Thread Lifecycle'
---

## Overview
Multithreading introduces two fundamental hazards: **Race Conditions** (uncoordinated read-modify-write sequences) and **Memory Invisibility** (stale values caused by CPU L1/L2 caches and compiler instruction reordering). Java resolves these using the `synchronized` monitor lock (guaranteeing mutual exclusion and memory barriers) and the `volatile` modifier (guaranteeing memory visibility and reordering suppression).

---

## Memory Visibility & Monitor Locks

```
 CPU Core 1 (Thread A)                      CPU Core 2 (Thread B)
 ┌───────────────────────────┐             ┌───────────────────────────┐
 │ L1 Cache: flag = true     │             │ L1 Cache: flag = false    │
 └─────────────┬─────────────┘             └─────────────┬─────────────┘
               │ (Flushed via volatile / monitor unlock) │ (Invalidated on read)
               ▼                                         ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                     Main Memory (RAM): flag = true                  │
 └─────────────────────────────────────────────────────────────────────┘
```

### The `synchronized` Invariant
Every Java object contains an intrinsic monitor lock stored in its Mark Word header. A thread acquiring `synchronized (monitor)`:
1. **Invalidates local CPU caches**, forcing subsequent reads to fetch fresh data from main memory.
2. Guarantees **mutual exclusion**: all other threads attempting to acquire the same monitor enter the `BLOCKED` state.
3. **Flushes all dirty CPU writes** out to main memory immediately before releasing the monitor lock.

---

## `volatile` vs `synchronized`

| Dimension | `volatile` Variable | `synchronized` Block |
| :--- | :--- | :--- |
| **Mutual Exclusion** | **No** (threads execute concurrently) | **Yes** (strictly serialized single-thread access) |
| **Atomicity** | Atomic read/write of reference or 32/64-bit primitives | Atomic multi-step operations (`count++`) |
| **Memory Visibility** | **Yes** (happens-before relationship) | **Yes** (memory barriers on lock/unlock) |
| **Reordering Suppression** | Prevents compiler/CPU reordering across read/write | Prevents operations from floating outside critical section |
| **Locking Overhead** | Zero thread context switches or blocking | Operating system monitor lock contention |

> [!WARNING]
> `volatile` does NOT make composite operations like `count++` thread-safe. `count++` involves three separate operations: `getfield`, `iadd`, and `putfield`. Two threads reading concurrently will still overwrite each other's increments.

---

## Deadlock Prevention: Lock Ordering

Deadlocks occur when two or more threads wait indefinitely for locks held by each other. To eliminate deadlocks:
- **Enforce Global Lock Acquisition Ordering:** Always acquire nested locks in an invariant, deterministic sequence across the entire application (e.g. by comparing account IDs).
- **Avoid Nested Synchronized Blocks:** Minimize holding multiple locks simultaneously.

---

## Implementation Example

```java
public class ConcurrencyCoordinationDemo {
    // 1. volatile flag for shutdown signaling across threads
    private volatile boolean running = true;

    // 2. Thread-safe counter using private final monitor lock
    private int counter = 0;
    private final Object counterLock = new Object();

    public void increment() {
        synchronized (counterLock) { // Guarantees atomicity and visibility
            counter++;
        }
    }

    public int getCounter() {
        synchronized (counterLock) {
            return counter;
        }
    }

    public void stopWorker() {
        this.running = false; // volatile write flushed immediately to RAM
    }

    public static void main(String[] args) throws InterruptedException {
        ConcurrencyCoordinationDemo coordinator = new ConcurrencyCoordinationDemo();

        // Worker thread monitoring volatile flag
        Thread worker = new Thread(() -> {
            while (coordinator.running) {
                coordinator.increment();
            }
            System.out.println("Worker stopped. Final count: " + coordinator.getCounter());
        });

        worker.start();
        Thread.sleep(100);

        // Signal stop from main thread
        coordinator.stopWorker();
        worker.join();
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Worker stopped. Final count: 1845209
```
</details>

---

## Pitfalls

- **Using `volatile` for Compound State:** Assuming `volatile int count; count++;` is atomic. For lock-free atomic compound operations, use `java.util.concurrent.atomic.AtomicInteger`.
- **Synchronizing on Non-Final Objects:** If the lock variable is reassigned (`lock = new Object()`), threads synchronize on different instances, destroying mutual exclusion. Always declare lock monitors `private final Object lock = new Object();`.
- **Synchronizing on Boxed Primitives or String Literals:** Writing `synchronized ("LOCK")` synchronizes on the JVM String Constant Pool, causing unrelated subsystems in other libraries to contend on the same lock.

---

## Practice

### Question
Why can the following code run into an infinite loop on a multi-core machine?
```java
public class PollingTask implements Runnable {
    private boolean active = true;
    public void run() {
        while (active) {
            // tight loop without I/O or sleep
        }
    }
    public void stop() { active = false; }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `active` is not declared `volatile`, and the `while` loop body contains no synchronization or memory barriers.
2. The JIT compiler optimizes the loop by hoisting the read: `if (active) while (true) {}`.
3. The core running the thread caches `active = true` in an L1/L2 register and never re-reads the updated value from main RAM.
4. Calling `stop()` from another thread modifies RAM, but the worker core never observes the update.
5. Fix: Declare `private volatile boolean active = true;`.

</details>
