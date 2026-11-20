---
id: topic-49
slug: synchronization-and-memory-visibility
topicNumber: 49
title: Synchronization & Memory Visibility
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 1.0+ / Enhanced JSR-133 (Java 5)
difficulty: Intermediate
readingTime: 13 min read
shortDescription: >-
  Master intrinsic monitor locks, the synchronized keyword, volatile memory
  visibility, and deadlocks.
prerequisites:
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 48: Threads and Thread Lifecycle'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Synchronization and Memory Visibility

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
When multiple threads execute concurrently and access shared, mutable data, two major classes of concurrency problems arise:
1. **Thread Interference / Race Conditions**: When two threads read and write the same memory location simultaneously without coordination, intermediate updates overwrite one another. An operation like `count++` is not atomic; it consists of three separate CPU instructions: read `count`, increment value, write value back. If two threads interleave these instructions, one increment is permanently lost.
2. **Memory Visibility**: Modern multi-core CPUs use hardware caches (L1, L2, L3) and speculative instruction reordering to maximize performance. A thread updating a variable in its CPU register or L1 cache might not flush that write to main RAM immediately. Another thread executing on a different core may read a stale cached value indefinitely.

Java provides two core primitives to solve these challenges:
- **`synchronized`**: Provides mutual exclusion (only one thread can execute a guarded block at a time) and memory barriers (flushes changes to main memory on release and refreshes caches on acquisition).
- **`volatile`**: Guarantees memory visibility without mutual exclusion. Any write to a `volatile` variable establishes a "happens-before" relationship with subsequent reads of that variable.

**Real-World Analogy:**
Imagine a shared whiteboard in an office where coworkers calculate a running inventory total. If two people walk up to the whiteboard at the same time, look at the number `10`, erase it together, and write `11`, one item addition disappears. The `synchronized` keyword acts as a physical key to the whiteboard room: only the person holding the key can enter, read, update, and leave. The `volatile` keyword acts as a high-definition webcam pointed at the whiteboard: the moment anyone makes an approved change, everyone's mobile screen reflects the update instantly.

---

### 2. Prerequisites
- **Thread Lifecycle (Topic 48)**: Knowing how threads run concurrently and sleep.
- **Classes and Objects (Topic 16)**: Understanding that object instances reside in heap memory shared by all threads.

---

### 3. Syntax Breakdown

#### 3.1 Intrinsic Locks and `synchronized`
Every Java object has an **intrinsic lock** (also known as a **monitor lock**).
```java
// Method-level synchronization (locks on 'this')
public synchronized void increment() {
    count++;
}

// Block-level synchronization (locks on explicit monitor object)
private final Object lock = new Object();
public void process() {
    synchronized (lock) {
        // Critical section: only one thread executes here
    }
}

// Static method synchronization (locks on Class object: MyClass.class)
public static synchronized void logGlobal() {
    // Critical section guarded by MyClass.class monitor
}
```
- `synchronized (monitor)`: Acquires the monitor lock of the target object. If another thread holds the lock, the calling thread blocks (`BLOCKED` state) until the lock is released.
- **Reentrancy**: Java intrinsic locks are **reentrant**. If a thread already holds a lock, it can acquire the same lock again without deadlocking itself (e.g., calling another `synchronized` method on the same instance).

#### 3.2 The `volatile` Keyword
```java
private volatile boolean running = true;
```
- `volatile` informs the JVM and CPU compiler never to cache this variable in a register or L1/L2 cache and forbids instruction reordering across the read/write barrier.
- **Limitation**: `volatile` does NOT guarantee atomicity for compound operations (e.g., `count++` on a volatile variable is still vulnerable to race conditions).

---

### 4. Code Examples

#### Example 1: Synchronization and Volatile Visibility Mechanics
The following example demonstrates mutual exclusion resolving a counter race condition and `volatile` ensuring immediate termination across CPU cores:

```java
public class SynchronizationVisibilityDemo {
    private static int counter = 0;
    private static volatile boolean keepRunning = true;

    public static synchronized void incrementCounter() {
        counter++;
    }

    public static void main(String[] args) throws InterruptedException {
        // Part 1: Synchronized Mutual Exclusion
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) incrementCounter();
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) incrementCounter();
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("Synchronized Counter Total: " + counter);

        // Part 2: Volatile Visibility Guarantee
        Thread worker = new Thread(() -> {
            long iterations = 0;
            while (keepRunning) {
                iterations++;
            }
            System.out.println("Worker recognized stop flag. Iterations: " + iterations);
        });

        worker.start();
        Thread.sleep(50);
        keepRunning = false; // Write flushed immediately to main memory
        worker.join();
        System.out.println("Volatile Worker Terminated Gracefully.");
    }
}
```

**Expected Output:**
```text
Synchronized Counter Total: 2000
Worker recognized stop flag. Iterations: 39843093
Volatile Worker Terminated Gracefully.
```

#### Example 2: Realistic Application — Double-Checked Locking Singleton & Thread-Safe Account Transfer
In real-world applications, thread synchronization safeguards financial balances and optimizes lazy initialization:

```java
public class DoubleCheckedLockingSingletonApp {
    // Thread-Safe Lazy Singleton using Double-Checked Locking
    static class DatabaseConnectionPool {
        private static volatile DatabaseConnectionPool instance;

        private DatabaseConnectionPool() {
            // Private constructor prevents external instantiation
        }

        public static DatabaseConnectionPool getInstance() {
            if (instance == null) { // 1st Check (no locking overhead once initialized)
                synchronized (DatabaseConnectionPool.class) {
                    if (instance == null) { // 2nd Check (under lock)
                        instance = new DatabaseConnectionPool();
                    }
                }
            }
            return instance;
        }
    }

    static class BankAccount {
        private final String id;
        private double balance;

        BankAccount(String id, double balance) {
            this.id = id;
            this.balance = balance;
        }

        public String getId() { return id; }
        public synchronized double getBalance() { return balance; }

        // Deadlock-free ordered locking
        public static boolean transfer(BankAccount from, BankAccount to, double amount) {
            // Enforce consistent global lock ordering to eliminate deadlocks
            BankAccount firstLock = from.id.compareTo(to.id) < 0 ? from : to;
            BankAccount secondLock = from.id.compareTo(to.id) < 0 ? to : from;

            synchronized (firstLock) {
                synchronized (secondLock) {
                    if (from.balance >= amount) {
                        from.balance -= amount;
                        to.balance += amount;
                        return true;
                    }
                    return false;
                }
            }
        }
    }

    public static void main(String[] args) {
        DatabaseConnectionPool pool1 = DatabaseConnectionPool.getInstance();
        DatabaseConnectionPool pool2 = DatabaseConnectionPool.getInstance();
        System.out.println("Singleton Pool Same Instance: " + (pool1 == pool2));

        BankAccount acc1 = new BankAccount("ACC-01", 1000.0);
        BankAccount acc2 = new BankAccount("ACC-02", 500.0);

        boolean success = BankAccount.transfer(acc1, acc2, 250.0);
        System.out.println("Transfer Success: " + success);
        System.out.printf("Final Balances: %s=$%.2f, %s=$%.2f%n",
                acc1.getId(), acc1.getBalance(), acc2.getId(), acc2.getBalance());
    }
}
```

**Expected Output:**
```text
Singleton Pool Same Instance: true
Transfer Success: true
Final Balances: ACC-01=$750.00, ACC-02=$750.00
```

---

### 5. Step-by-Step Execution Trace
1. In `DatabaseConnectionPool.getInstance()`, the first thread finds `instance == null` and enters the `synchronized` block on `DatabaseConnectionPool.class`.
2. It re-checks `instance == null`, allocates heap memory, runs constructor initialization, and writes the reference to `instance`.
3. Because `instance` is declared `volatile`, the JVM compiler is strictly forbidden from reordering the reference assignment before constructor completion. Without `volatile`, another thread could read a partially initialized object reference during the first check!
4. In `BankAccount.transfer()`, lock ordering based on lexicographical account ID (`from.id.compareTo(to.id) < 0`) prevents the deadly embrace: if Thread A transfers from ACC-01 to ACC-02 while Thread B transfers from ACC-02 to ACC-01, both threads acquire the locks in identical sequence (ACC-01 first, then ACC-02), completely eliminating circular wait deadlock conditions.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Assuming `volatile` Makes `count++` Thread-Safe
```java
private volatile int count = 0;
public void add() {
    count++; // BUG: Race condition still occurs!
}
```
- **Consequence**: `count++` is read-modify-write. Two threads can read the same value and both write back `value + 1`, losing updates.
- **Fix**: Use `synchronized` or `java.util.concurrent.atomic.AtomicInteger`.

#### Pitfall 2: Synchronizing on Mutable or String Objects
```java
// BUG: String literals reside in the intern pool; external code might lock on the same String!
synchronized ("LOCK_KEY") { ... }
```
- **Fix**: Always synchronize on private, final object instances:
```java
private final Object lock = new Object();
```

#### Pitfall 3: Deadlock via Inconsistent Lock Acquisition Order
```java
// Thread 1:
synchronized (lockA) { synchronized (lockB) { ... } }
// Thread 2:
synchronized (lockB) { synchronized (lockA) { ... } }
```
- **Consequence**: If Thread 1 acquires `lockA` and Thread 2 acquires `lockB`, both threads wait indefinitely for each other, freezing the application.
- **Fix**: Enforce a strict global hierarchy or lock ordering across all execution paths.

---

### 7. Best Practices & When NOT to Use
- **Do**: Keep synchronized blocks as small as possible. Only guard critical state mutations; do not include I/O, network calls, or heavy computation inside a synchronized block.
- **Do**: Use `volatile` for one-way status flags (`boolean shutdownRequested`) written by one thread and read by many threads.
- **Don't**: Do not over-synchronize. Unnecessary synchronization incurs cache invalidation and context switching overhead. For complex data sharing, prefer high-level concurrency utilities in `java.util.concurrent`.

---

### 8. Version Notes
- **Java 1.0**: `synchronized` and `volatile` keywords introduced.
- **Java 5 (JSR 133)**: Overhauled the Java Memory Model (JMM), formalizing the happens-before relationship for `volatile` writes and fixing the double-checked locking idiom.
- **Java 6+**: HotSpot JVM introduced intrinsic lock optimizations: biased locking (later deprecated in Java 15), lock coarsening, and lock elision via escape analysis.

---

### 9. Summary Cheat Sheet

| Feature | Mutex (Mutual Exclusion) | Memory Visibility | Prevents Race Condition on `++` |
| :--- | :--- | :--- | :--- |
| `synchronized` | Yes | Yes (at entry & exit) | Yes |
| `volatile` | No | Yes (always direct RAM) | No |
| `AtomicInteger` | Lock-free CAS | Yes | Yes |
| `final` fields | N/A | Yes (safe publication) | N/A |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Thread-Safe Accumulator
Implement a class `SafeAccumulator` with a private `long total` field. Provide `void add(long val)` and `long get()` methods that are completely thread-safe against concurrent modifications.

<details>
<summary>View Solution</summary>

```java
public class SafeAccumulator {
    private long total = 0;

    public synchronized void add(long val) {
        total += val;
    }

    public synchronized long get() {
        return total;
    }
}
```
</details>

#### Exercise 2: Stop Flag Diagnostic
Write a program where a worker thread spins on a non-volatile boolean flag `boolean stop = false`. Explain what happens in optimized JIT compilation and fix it by declaring the flag `volatile`.

<details>
<summary>View Solution</summary>

```java
public class VolatileFixDemo {
    // Declared volatile to ensure JIT compiler does not hoist the read into a register
    private static volatile boolean stop = false;

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            while (!stop) {
                // Without volatile, C2 JIT can optimize this loop to: if (!stop) while(true);
            }
            System.out.println("Worker stopped safely.");
        });

        worker.start();
        Thread.sleep(100);
        stop = true;
        worker.join();
    }
}
```
</details>

---

### 11. Sources & Official References
- [Oracle Java Documentation — Synchronization](https://docs.oracle.com/javase/tutorial/essential/concurrency/sync.html)
- [JSR 133: Java Memory Model and Thread Specification](https://jcp.org/en/jsr/detail?id=133)
- [Java Language Specification — §17.4 Memory Model](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html)
