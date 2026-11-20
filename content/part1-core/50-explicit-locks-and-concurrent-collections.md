---
id: topic-50
slug: explicit-locks-and-concurrent-collections
topicNumber: 50
title: Explicit Locks & Concurrent Collections
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 5+
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Explore ReentrantLock, ReadWriteLock, Atomic primitives, and high-performance
  concurrent collections like ConcurrentHashMap.
prerequisites:
  - 'Topic 37: The Map Hierarchy'
  - 'Topic 49: Synchronization and Memory Visibility'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Explicit Locks and Concurrent Collections

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
While the `synchronized` keyword provides basic mutual exclusion, it suffers from several practical limitations in high-concurrency environments:
- **No Timed Acquisition**: A thread attempting to enter a `synchronized` block cannot specify a timeout; it must wait indefinitely.
- **No Non-Blocking Polling**: A thread cannot attempt to acquire a lock and back off to do other work if the lock is currently held.
- **Rigid Block Scoping**: Locks must be acquired and released strictly within the same lexical scope (opening and closing braces `{}`).
- **No Read/Write Separation**: Multiple concurrent readers block one another even though read-only operations never mutate state.

To solve these limitations, Java 5 introduced the `java.util.concurrent.locks` package (providing explicit locks such as `ReentrantLock` and `ReentrantReadWriteLock`), atomic variables in `java.util.concurrent.atomic` (leveraging hardware CPU Compare-And-Swap instructions), and specialized concurrent data structures in `java.util.concurrent` (such as `ConcurrentHashMap` and `CopyOnWriteArrayList`).

**Real-World Analogy:**
Imagine a public library. Under intrinsic synchronization (`synchronized`), whenever anyone enters the library, the front door locks for everyone else, even if 50 people simply want to read books silently. Under an explicit `ReadWriteLock`, hundreds of readers can browse and read concurrently (`readLock`), but when a librarian needs to reorganize or replace shelves (`writeLock`), all access is briefly paused until the reorganization is complete.

---

### 2. Prerequisites
- **Synchronization (Topic 49)**: Understanding race conditions, mutual exclusion, and visibility.
- **Collections Framework (Topics 35–37)**: Understanding `List`, `Set`, and `Map` interfaces and hash bucket fundamentals.

---

### 3. Syntax Breakdown

#### 3.1 `ReentrantLock`
```java
Lock lock = new ReentrantLock();
// Idiomatic acquire and release pattern:
lock.lock();
try {
    // Critical section
} finally {
    lock.unlock(); // ALWAYS unlock in finally block!
}
```
- `tryLock()`: Non-blocking attempt to acquire the lock immediately. Returns `true` if acquired, `false` otherwise.
- `tryLock(long timeout, TimeUnit unit)`: Attempts acquisition, waiting up to the specified timeout before returning `false`. Throws `InterruptedException` if interrupted while waiting.

#### 3.2 Atomic Variables (`AtomicInteger`, `AtomicLong`, `AtomicReference`)
```java
AtomicInteger atomicCount = new AtomicInteger(0);
int next = atomicCount.incrementAndGet(); // Atomic read-modify-write without locks
boolean swapped = atomicCount.compareAndSet(expected, newValue); // Hardware CAS
```
- Atomic classes use hardware-level CPU instructions (like `CMPXCHG` on x86) to perform lock-free, thread-safe updates with minimal overhead compared to heavy mutex locking.

#### 3.3 `ConcurrentHashMap`
Unlike legacy `Hashtable` or `Collections.synchronizedMap()` which lock the entire map for every operation, `ConcurrentHashMap` allows high-concurrency reads without locking and uses lock-free Compare-And-Swap (CAS) combined with fine-grained per-bucket node synchronization for writes.

---

### 4. Code Examples

#### Example 1: Explicit Locks and Atomic CAS Operations
The following example demonstrates timed lock acquisition with fallback logic and lock-free atomic Compare-And-Swap mechanics:

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.ReentrantLock;

public class ExplicitLocksAtomicsDemo {
    public static void main(String[] args) throws InterruptedException {
        ReentrantLock lock = new ReentrantLock();

        // 1. Timed Lock Acquisition
        Thread holder = new Thread(() -> {
            lock.lock();
            try {
                System.out.println("Holder acquired lock, holding for 150ms...");
                Thread.sleep(150);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                lock.unlock();
                System.out.println("Holder released lock.");
            }
        });

        Thread contender = new Thread(() -> {
            try {
                Thread.sleep(20);
                System.out.println("Contender attempting tryLock(50ms)...");
                boolean acquired = lock.tryLock(50, TimeUnit.MILLISECONDS);
                System.out.println("Contender acquired lock? " + acquired);

                System.out.println("Contender attempting tryLock(200ms)...");
                boolean acquiredLater = lock.tryLock(200, TimeUnit.MILLISECONDS);
                System.out.println("Contender acquired lock after wait? " + acquiredLater);
                if (acquiredLater) {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        holder.start();
        contender.start();
        holder.join();
        contender.join();

        // 2. Lock-free Atomic Operations (Compare-And-Swap)
        System.out.println();
        AtomicInteger atomicCounter = new AtomicInteger(100);
        boolean casSuccess = atomicCounter.compareAndSet(100, 150);
        System.out.println("Atomic CAS from 100 to 150 successful? " + casSuccess);
        System.out.println("Atomic Counter after incrementAndGet: " + atomicCounter.incrementAndGet());

        AtomicReference<String> stateRef = new AtomicReference<>("INITIAL");
        stateRef.compareAndSet("INITIAL", "ACTIVE");
        System.out.println("Atomic Reference Current State: " + stateRef.get());
    }
}
```

**Expected Output:**
```text
Holder acquired lock, holding for 150ms...
Contender attempting tryLock(50ms)...
Contender acquired lock? false
Contender attempting tryLock(200ms)...
Holder released lock.
Contender acquired lock after wait? true

Atomic CAS from 100 to 150 successful? true
Atomic Counter after incrementAndGet: 151
Atomic Reference Current State: ACTIVE
```

#### Example 2: Realistic Application — Token Bucket Rate Limiter with ReadWriteLock
In API gateways and cloud microservices, rate limiters protect backends against traffic surges. Here, a `ReentrantReadWriteLock` allows hundreds of parallel request validations while synchronizing configuration updates:

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class RateLimiterTokenBucketApp {
    private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
    private final ReentrantReadWriteLock.ReadLock readLock = rwl.readLock();
    private final ReentrantReadWriteLock.WriteLock writeLock = rwl.writeLock();

    private int capacity;
    private int currentTokens;

    public RateLimiterTokenBucketApp(int initialCapacity) {
        this.capacity = initialCapacity;
        this.currentTokens = initialCapacity;
    }

    public boolean tryConsume() {
        writeLock.lock(); // Mutating token count requires write lock
        try {
            if (currentTokens > 0) {
                currentTokens--;
                return true;
            }
            return false;
        } finally {
            writeLock.unlock();
        }
    }

    public int getAvailableTokens() {
        readLock.lock(); // Read-only view allows high concurrency
        try {
            return currentTokens;
        } finally {
            readLock.unlock();
        }
    }

    public void updateCapacity(int newCapacity) {
        writeLock.lock(); // Reconfiguring capacity requires write exclusivity
        try {
            this.capacity = newCapacity;
            this.currentTokens = newCapacity;
            System.out.println("\nCapacity reconfigured to " + newCapacity + ".");
        } finally {
            writeLock.unlock();
        }
    }

    public static void main(String[] args) {
        RateLimiterTokenBucketApp limiter = new RateLimiterTokenBucketApp(3);

        System.out.println("Attempt 1 allowed: " + limiter.tryConsume());
        System.out.println("Attempt 2 allowed: " + limiter.tryConsume());
        System.out.println("Attempt 3 allowed: " + limiter.tryConsume());
        System.out.println("Attempt 4 allowed: " + limiter.tryConsume());
        System.out.println("Tokens remaining: " + limiter.getAvailableTokens());

        limiter.updateCapacity(5);
        System.out.println("Attempt 5 allowed: " + limiter.tryConsume());
        System.out.println("Final tokens remaining: " + limiter.getAvailableTokens());
    }
}
```

**Expected Output:**
```text
Attempt 1 allowed: true
Attempt 2 allowed: true
Attempt 3 allowed: true
Attempt 4 allowed: false
Tokens remaining: 0

Capacity reconfigured to 5.
Attempt 5 allowed: true
Final tokens remaining: 4
```

---

### 5. Step-by-Step Execution Trace
1. In `ExplicitLocksAtomicsDemo`, `holder` acquires `lock` via `lock.lock()`.
2. When `contender` runs `lock.tryLock(50, TimeUnit.MILLISECONDS)`, the lock is still held by `holder` (which sleeps 150ms). After 50ms, `tryLock` times out and gracefully returns `false` without blocking forever.
3. The next attempt `lock.tryLock(200, TimeUnit.MILLISECONDS)` waits. At 150ms, `holder` reaches its `finally` block and executes `lock.unlock()`.
4. The OS unparks the `contender` thread, which acquires the lock, logs `true`, and releases it in its own `finally` block.
5. In `atomicCounter.compareAndSet(100, 150)`, the CPU compares the current value in memory with the expected value `100`. Because they match, it replaces the value with `150` atomically in a single hardware bus cycle, guaranteeing thread safety without thread descheduling.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Forgetting to Unlock in a `finally` Block
```java
lock.lock();
doSomethingRisky(); // Throws RuntimeException!
lock.unlock(); // BUG: Never reached! The lock is permanently leaked!
```
- **Consequence**: Other threads waiting for this lock will hang forever.
- **Fix**: Always structure explicit lock code as:
```java
lock.lock();
try {
    doSomethingRisky();
} finally {
    lock.unlock();
}
```

#### Pitfall 2: Mutating Collections inside `CopyOnWriteArrayList` Loops
`CopyOnWriteArrayList` creates a fresh shallow clone of its backing array on every write (`add()`, `set()`, `remove()`).
- **Consequence**: Excellent for 99.9% read-heavy workloads (e.g., event listeners), but performs catastrophically slow when subjected to frequent writes.
- **Fix**: For write-heavy concurrent collections, use `ConcurrentLinkedQueue` or `ConcurrentHashMap.newKeySet()`.

---

### 7. Best Practices & When NOT to Use
- **Do**: Use `ConcurrentHashMap` whenever you need a thread-safe map. Avoid wrapping `HashMap` with `Collections.synchronizedMap()` unless you require exclusive whole-map locking for composite multi-step transactions.
- **Do**: Prefer `AtomicLong` or `LongAdder` for metrics counters. `LongAdder` scales significantly better than `AtomicLong` under heavy write contention across many CPU cores by striping cells.
- **Don't**: Do not use `ReentrantLock` when a simple `synchronized` block suffices. Modern JVM HotSpot JIT optimizes uncontended `synchronized` blocks aggressively. Use `ReentrantLock` only when you need timed polling (`tryLock`), fairness policies, or multiple `Condition` queues.

---

### 8. Version Notes
- **Java 5 (JSR 166)**: `java.util.concurrent` introduced, authored by Doug Lea, including `ReentrantLock`, `ConcurrentHashMap`, and `Atomic*` classes.
- **Java 8**: `LongAdder`, `LongAccumulator`, and `StampedLock` introduced. `ConcurrentHashMap` internal storage rewritten using red-black trees for high-collision buckets (identical to `HashMap`).
- **Java 9+**: VarHandles introduced via JEP 193, offering low-level memory fence primitives and atomic operations on plain fields.

---

### 9. Summary Cheat Sheet

| Mechanism | Package | Locking Strategy | Best Use Case |
| :--- | :--- | :--- | :--- |
| `ReentrantLock` | `j.u.c.locks` | Explicit Mutex | Need timed tryLock or interruptible acquisition |
| `ReentrantReadWriteLock` | `j.u.c.locks` | Shared Read / Exclusive Write | High read-to-write ratio scenarios |
| `AtomicInteger` / `AtomicLong` | `j.u.c.atomic` | Lock-free Hardware CAS | Single numeric or reference state updates |
| `LongAdder` | `j.u.c.atomic` | Striped Cell CAS | Ultra-high throughput distributed counters |
| `ConcurrentHashMap` | `j.u.c` | CAS + Bucket-level Locks | Concurrent key-value mappings |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Safe Concurrent ID Generator
Implement an `IdGenerator` using `AtomicLong` that starts at `1000` and generates unique, strictly monotonically increasing sequence IDs via `long nextId()`.

<details>
<summary>View Solution</summary>

```java
import java.util.concurrent.atomic.AtomicLong;

public class IdGenerator {
    private final AtomicLong sequence = new AtomicLong(1000);

    public long nextId() {
        return sequence.incrementAndGet();
    }
}
```
</details>

#### Exercise 2: Timed Resource Acquisition
Create a `SharedPrinter` class protected by a `ReentrantLock`. Implement a method `boolean printJob(String document, long maxWaitMs)` that attempts to acquire the lock within `maxWaitMs`. If acquired, simulate printing for 50ms and return `true`; if timeout expires, return `false`.

<details>
<summary>View Solution</summary>

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class SharedPrinter {
    private final ReentrantLock printerLock = new ReentrantLock();

    public boolean printJob(String document, long maxWaitMs) {
        try {
            if (printerLock.tryLock(maxWaitMs, TimeUnit.MILLISECONDS)) {
                try {
                    System.out.println("Printing: " + document);
                    Thread.sleep(50);
                    return true;
                } finally {
                    printerLock.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return false;
    }
}
```
</details>

---

### 11. Sources & Official References
- [Oracle Java Documentation — Lock Objects](https://docs.oracle.com/javase/tutorial/essential/concurrency/newlocks.html)
- [Java SE 21 Specification — java.util.concurrent.locks.ReentrantLock](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Java SE 21 Specification — java.util.concurrent.ConcurrentHashMap](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html)
