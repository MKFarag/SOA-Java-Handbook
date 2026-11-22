---
id: topic-53
slug: explicit-locks-and-concurrent-collections
topicNumber: 53
title: Explicit Locks & Concurrent Collections
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 5+
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: java.util.concurrent.locks (ReentrantLock, ReadWriteLock, StampedLock), lock-free atomic primitives (CAS), and thread-safe collections (ConcurrentHashMap, BlockingQueue).
prerequisites:
  - 'Topic 40: The Map Hierarchy'
  - 'Topic 52: Synchronization & Memory Visibility'
---

## Overview
Java 5 (`java.util.concurrent`) introduced explicit locking primitives (`Lock`, `ReadWriteLock`), lock-free atomic variables leveraging CPU Compare-And-Swap (CAS) hardware instructions, and high-performance concurrent collections. These overcome the rigid lexical scoping, lack of timeouts, and unsegmented contention of the `synchronized` keyword.

---

## `synchronized` vs Explicit `ReentrantLock`

| Capability | Intrinsic Monitor (`synchronized`) | Explicit `ReentrantLock` |
| :--- | :--- | :--- |
| **Acquisition Timeout** | None (blocks indefinitely) | `tryLock(timeout, unit)` supported |
| **Non-Blocking Polling** | None | `tryLock()` returns boolean immediately |
| **Fairness Policy** | Unfair (thread scheduling arbitrary) | Configurable (`new ReentrantLock(true)`) |
| **Scoping Freedom** | Rigid block braces `{}` | Can acquire in one method and release in another |
| **Condition Variables** | Single wait-set (`wait()` / `notify()`) | Multiple distinct `Condition` instances |
| **Interruption Handling** | Uninterruptible while waiting for lock | `lockInterruptibly()` responds to interrupts |

---

## Lock-Free Hardware Concurrency: Compare-And-Swap (CAS)

`java.util.concurrent.atomic` classes (`AtomicInteger`, `AtomicReference`, `LongAdder`) bypass operating system thread context switches by executing hardware CPU CAS instructions (`LOCK CMPXCHG` on x86):

```
                     Hardware CAS Execution Loop
 ┌─────────────────────────────────────────────────────────────┐
 │ 1. Read current memory value V                              │
 │ 2. Compute expected updated value V + 1                     │
 │ 3. CPU executes atomic CAS(V, expected, update)             │
 │      ├── SUCCESS: memory matches expected ──► Value written │
 │      └── FAILURE: memory was modified     ──► Loop and retry│
 └─────────────────────────────────────────────────────────────┘
```

---

## High-Performance Concurrent Collections

- **`ConcurrentHashMap<K, V>`:** Uses node-level CAS for bin insertions and synchronizes only on the head node of a collided bucket. Read operations (`get()`) are completely lock-free. Iterators are weakly consistent and never throw `ConcurrentModificationException`.
- **`BlockingQueue<E>`:** Coordinates producer-consumer thread pipelines using internal condition variables (`take()` blocks until items arrive; `put()` blocks if capacity is full). Standard implementations: `ArrayBlockingQueue` (bounded array) and `LinkedBlockingQueue` (optionally bounded nodes).

---

## Implementation Example

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

public class ExplicitLocksAndAtomicDemo {
    private final ReentrantLock explicitLock = new ReentrantLock();
    private final AtomicInteger processedCount = new AtomicInteger(0);
    private final ConcurrentHashMap<String, Long> activeSessions = new ConcurrentHashMap<>();

    public boolean attemptSessionLock(String sessionId) {
        try {
            // Attempt timed lock acquisition (waiting up to 100ms)
            if (explicitLock.tryLock(100, TimeUnit.MILLISECONDS)) {
                try {
                    // Critical Section
                    activeSessions.put(sessionId, System.currentTimeMillis());
                    processedCount.incrementAndGet(); // Lock-free atomic increment
                    return true;
                } finally {
                    // MUST always release explicit lock in finally block
                    explicitLock.unlock();
                }
            } else {
                System.err.println("Lock contention: timed out waiting for session lock.");
                return false;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    public static void main(String[] args) {
        ExplicitLocksAndAtomicDemo demo = new ExplicitLocksAndAtomicDemo();
        boolean success1 = demo.attemptSessionLock("session-abc");
        boolean success2 = demo.attemptSessionLock("session-xyz");

        System.out.printf("Processed sessions count: %d%n", demo.processedCount.get());
        System.out.printf("Active sessions map      : %s%n", demo.activeSessions);
    }
}
```

### Execution Output:
```text
Processed sessions count: 2
Active sessions map      : {session-xyz=1763812300000, session-abc=1763812300000}
```

---

## Pitfalls

- **Forgetting `unlock()` in `finally`:** If an unhandled exception occurs inside a critical section and `unlock()` is not inside a `finally` block, the lock is never released, permanently freezing other waiting threads.
- **Compound Check-Then-Act on Concurrent Collections:** Writing `if (!map.containsKey(k)) map.put(k, v);` is NOT atomic even on `ConcurrentHashMap` because another thread can insert the key between the check and the put. Always use atomic compound methods: `map.putIfAbsent(k, v)`.
- **StampedLock Reentrancy Hazard:** Unlike `ReentrantLock`, `StampedLock` is **non-reentrant**. A thread holding a write lock that attempts to acquire the lock again will immediately deadlock itself.

---

## Practice

### Question
Why is `new ReentrantLock(true)` (fair lock) generally discouraged in high-throughput production services?

### Explanation
1. A fair lock enforces strict FIFO order: threads acquire the lock in the order they requested it.
2. Under unfair locking, a thread currently running on the CPU can immediately acquire a newly released lock, avoiding an expensive operating system thread sleep and context switch.
3. Enforcing strict fairness forces the JVM to suspend active threads and wake up sleeping threads from the OS kernel queue, slashing throughput by up to 10x-50x.
4. Unfair locks (the default) deliver dramatically higher throughput in almost all enterprise workloads.
