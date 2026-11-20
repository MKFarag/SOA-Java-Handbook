---
id: topic-48
slug: threads-and-thread-lifecycle
topicNumber: 48
title: Threads and Thread Lifecycle
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 1.0+ / Enhanced Java 21
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master the operating system thread abstraction, the six thread states, daemon
  threads, joining, and interruption mechanics.
prerequisites:
  - 'Topic 11: Methods, Parameters & Return Values'
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 23: Interfaces & Modern Interface Evolution'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Threads and Thread Lifecycle

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
In computer systems, a **process** is an executing program with its own dedicated memory space, while a **thread** is the smallest unit of execution dispatched by the operating system kernel within a process. A single Java application can launch multiple threads that run concurrently on modern multi-core processors, sharing the process's heap memory while maintaining their own private execution stacks and program counters.

Without multithreading, programs execute sequentially: a long-running calculation, network download, or database query blocks everything else. Multithreading enables:
- **Responsiveness**: Keeping user interfaces or API request handlers responsive while background computation executes.
- **Throughput & Parallelism**: Utilizing all CPU cores simultaneously to finish large workloads in a fraction of sequential time.
- **Asynchronous Execution**: Decoupling trigger events from time-consuming processing tasks.

**Real-World Analogy:**
Imagine a restaurant kitchen. In a single-threaded kitchen, one chef prepares a salad, then waits for the soup to simmer, then fries a steak, then delivers the plate to the table. In a multi-threaded kitchen, multiple chefs work simultaneously at distinct prep stations. One chef bakes bread, another grills meat, and an expediter coordinates finished plates. All chefs share the kitchen pantry (shared heap memory) but carry their own knife sets and order tickets (private thread stacks).

---

### 2. Prerequisites
- **Methods and Stack Frames (Topic 11)**: Understanding how method invocation allocates local variables on thread-private call stacks.
- **Classes and Memory Layout (Topic 16)**: Understanding that heap objects are shared across all threads.
- **Interfaces (Topic 23)**: Understanding functional interfaces, specifically `java.lang.Runnable`.

---

### 3. Syntax Breakdown

#### 3.1 Defining Execution Units: `Runnable` vs Subclassing `Thread`
Java provides two primary idioms for thread creation:
```java
// Idiom 1: Subclassing Thread (Couples task logic with thread management)
public class WorkerThread extends Thread {
    @Override
    public void run() {
        // Work executed on separate thread
    }
}

// Idiom 2 (Recommended): Implementing Runnable (Separates task from thread execution)
Runnable task = () -> {
    // Work executed on separate thread
};
Thread worker = new Thread(task, "Worker-Name");
worker.start(); // Spawns OS thread and invokes run()
```
- `Thread`: The Java class representing a platform thread managed by the underlying operating system.
- `Runnable`: A functional interface with a single parameterless method `public void run()`.
- `start()`: Transitions the thread from `NEW` to `RUNNABLE`, signaling the JVM and OS scheduler to allocate an execution stack. Calling `run()` directly merely executes the method synchronously on the calling thread without spawning a new thread.
- `join()`: Blocks the calling thread until the targeted thread finishes execution and enters `TERMINATED`.
- `interrupt()`: Sets an internal boolean interrupt flag on the target thread. If the target thread is blocked in `Thread.sleep()` or `wait()`, an `InterruptedException` is thrown and the flag is cleared.
- `setDaemon(boolean on)`: Marks the thread as a background daemon thread. When all non-daemon user threads terminate, the JVM shuts down immediately without waiting for daemon threads to finish.

#### 3.2 The Six Thread States (`Thread.State`)
A Java thread occupies exactly one of six states defined in `java.lang.Thread.State`:
1. `NEW`: Created via `new Thread(...)` but `start()` has not yet been invoked.
2. `RUNNABLE`: Executing in the JVM or ready and waiting for OS CPU scheduling.
3. `BLOCKED`: Waiting to acquire a monitor lock (`synchronized` block).
4. `WAITING`: Waiting indefinitely for another thread to perform a specific action (`wait()`, `join()`, `LockSupport.park()`).
5. `TIMED_WAITING`: Waiting for a specified time period (`Thread.sleep(millis)`, `join(millis)`).
6. `TERMINATED`: The thread has completed execution of `run()` or exited due to an unhandled exception.

---

### 4. Code Examples

#### Example 1: Basic Thread Lifecycle & Interruption Mechanics
The following example demonstrates creating a worker thread, monitoring state transitions, interrupting a sleeping thread, and verifying daemon behavior:

```java
public class ThreadLifecycleDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            System.out.println("Worker thread running: " + Thread.currentThread().getName());
            int counter = 0;
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    counter++;
                    Thread.sleep(100);
                }
            } catch (InterruptedException e) {
                System.out.println("Worker interrupted during sleep. Exiting cleanly.");
            }
            System.out.println("Worker completed. Final counter: " + counter);
        }, "Background-Worker-1");

        System.out.println("Worker State before start: " + worker.getState());
        worker.start();
        System.out.println("Worker State after start:  " + worker.getState());

        Thread.sleep(350);
        System.out.println("Main thread sending interrupt signal...");
        worker.interrupt();

        worker.join();
        System.out.println("Worker State after join:   " + worker.getState());

        Thread daemon = new Thread(() -> {
            while (true) { /* Idle daemon */ }
        });
        daemon.setDaemon(true);
        daemon.start();
        System.out.println("Daemon Thread isDaemon:    " + daemon.isDaemon());
    }
}
```

**Expected Output:**
```text
Worker State before start: NEW
Worker State after start:  RUNNABLE
Worker thread running: Background-Worker-1
Main thread sending interrupt signal...
Worker interrupted during sleep. Exiting cleanly.
Worker completed. Final counter: 3
Worker State after join:   TERMINATED
Daemon Thread isDaemon:    true
```

#### Example 2: Realistic Application — Batch Worker Supervisor
In real-world enterprise backends, supervisor threads spawn multiple concurrent worker threads, coordinate parallel task execution, and await their termination using `join()`:

```java
import java.util.ArrayList;
import java.util.List;

public class BatchWorkerSupervisorApp {
    static class TaskResult {
        final int workerId;
        final boolean success;

        TaskResult(int workerId, boolean success) {
            this.workerId = workerId;
            this.success = success;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        int workerCount = 3;
        List<Thread> workers = new ArrayList<>();
        List<TaskResult> results = new ArrayList<>();

        for (int i = 1; i <= workerCount; i++) {
            final int id = i;
            Thread worker = new Thread(() -> {
                System.out.println("  [Worker-" + id + "] Processing task payload...");
                try {
                    Thread.sleep(50 * id); // Simulate distinct processing duration
                    synchronized (results) {
                        results.add(new TaskResult(id, true));
                    }
                    System.out.println("  [Worker-" + id + "] Task payload processed successfully.");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }, "Worker-" + id);
            workers.add(worker);
            worker.start();
        }

        System.out.println("Supervisor waiting for batch completion (joining workers)...");
        for (Thread worker : workers) {
            worker.join(); // Block until worker terminates
        }

        System.out.println("Supervisor Audit: " + results.size() + " of " + workerCount + " workers completed successfully.");
    }
}
```

**Expected Output:**
```text
Supervisor waiting for batch completion (joining workers)...
  [Worker-1] Processing task payload...
  [Worker-2] Processing task payload...
  [Worker-3] Processing task payload...
  [Worker-1] Task payload processed successfully.
  [Worker-2] Task payload processed successfully.
  [Worker-3] Task payload processed successfully.
Supervisor Audit: 3 of 3 workers completed successfully.
```

---

### 5. Step-by-Step Execution Trace
1. When `main()` begins, the JVM creates the initial user thread named `"main"`.
2. `new Thread(runnable)` allocates a Java `Thread` object in heap memory. Its state is `NEW`. No OS thread exists yet.
3. Invoking `worker.start()` invokes a native JNI call to the operating system kernel (`pthread_create` on Linux/macOS or `CreateThread` on Windows). The OS allocates a platform thread and private stack (typically 1 MB). The state switches to `RUNNABLE`.
4. The OS thread scheduler allocates a CPU time slice to `"Worker-1"`. The JVM executes `run()`.
5. While `"Worker-1"` executes `Thread.sleep(50)`, the OS places it in a sleep queue, transitioning its state to `TIMED_WAITING`. The CPU core is freed for other threads.
6. When `main` calls `worker.join()`, the main thread yields CPU execution and enters `WAITING` until `worker` terminates.
7. Upon termination of `run()`, the OS thread is reclaimed, and the thread state becomes `TERMINATED`. The main thread unblocks and resumes.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Calling `run()` instead of `start()`
```java
Thread t = new Thread(() -> System.out.println(Thread.currentThread().getName()));
t.run(); // BUG: Runs synchronously on the calling thread ("main")!
```
- **Consequence**: No new thread is spawned; execution remains single-threaded, defeating concurrency.
- **Fix**: Always call `t.start()`.

#### Pitfall 2: Swallowing `InterruptedException`
```java
try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    // BUG: Swallowing without restoring interrupt status or terminating
}
```
- **Consequence**: The thread ignores shutdown signals from container frameworks or supervisors.
- **Fix**: Either re-throw the exception or restore the interrupt flag:
```java
Thread.currentThread().interrupt(); // Restore flag
```

#### Pitfall 3: Re-starting a Terminated Thread
```java
Thread t = new Thread(() -> {});
t.start();
t.join();
t.start(); // FAILS!
```
- **Consequence**: Throws `java.lang.IllegalThreadStateException`. A thread cannot be restarted once `start()` has been called.

---

### 7. Best Practices & When NOT to Use
- **Do**: Prefer implementing `Runnable` or `Callable` rather than extending `Thread` to keep task logic decoupled from threading mechanisms.
- **Do**: Always provide meaningful thread names (e.g., `new Thread(task, "PaymentProcessor-1")`) to simplify log analysis and thread dump inspection (`jcmd <pid> Thread.dump_to_file`).
- **Don't**: Do not manually spawn unmanaged platform threads in loops. Spawning 10,000 platform threads will exhaust OS memory and throw `java.lang.OutOfMemoryError: unable to create native thread`. Use `ExecutorService` (Topic 51) or Virtual Threads (Topic 53).

---

### 8. Version Notes
- **Java 1.0**: `Thread`, `Runnable`, `synchronized`, and `wait()`/`notify()` introduced.
- **Java 5**: `java.lang.Thread.State` enum introduced; deprecated unsafe methods `stop()`, `suspend()`, and `resume()`.
- **Java 19 / 21**: Virtual Threads (`Thread.ofVirtual()`) introduced via JEP 444, revolutionizing high-throughput concurrent I/O.
- **Java 24+**: `Thread.suspend()` and `Thread.resume()` permanently removed or throw `UnsupportedOperationException`.

---

### 9. Summary Cheat Sheet

| Method / State | Purpose | Typical Behavior |
| :--- | :--- | :--- |
| `start()` | Spawns OS thread and invokes `run()` | Changes state from `NEW` to `RUNNABLE` |
| `join()` | Awaits target thread completion | Blocks calling thread (`WAITING`) |
| `interrupt()` | Sets interrupt flag or wakes sleeping thread | Causes `InterruptedException` if sleeping |
| `isInterrupted()` | Checks if flag is set | Non-destructive check (does not reset flag) |
| `Thread.interrupted()` | Checks and clears flag | Static method, destructive to current thread flag |
| `setDaemon(true)` | Marks thread as background daemon | Must be set before `start()`; does not prevent JVM exit |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Periodic Heartbeat
Create a thread named `"Heartbeat"` that prints `"Pulse"` every 200 milliseconds. Have the main thread wait 650 milliseconds, interrupt the heartbeat thread, and verify clean termination.

<details>
<summary>View Solution</summary>

```java
public class ExerciseHeartbeat {
    public static void main(String[] args) throws InterruptedException {
        Thread heartbeat = new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    System.out.println("Pulse");
                    Thread.sleep(200);
                }
            } catch (InterruptedException e) {
                System.out.println("Heartbeat stopped cleanly.");
            }
        }, "Heartbeat");

        heartbeat.start();
        Thread.sleep(650);
        heartbeat.interrupt();
        heartbeat.join();
    }
}
```
</details>

#### Exercise 2: Parallel Array Sum
Compute the sum of a 4-element array by dividing the array across two worker threads (first half and second half), accumulating their respective sums into a thread-safe container or array, and printing the total.

<details>
<summary>View Solution</summary>

```java
public class ExerciseParallelSum {
    public static void main(String[] args) throws InterruptedException {
        int[] data = { 10, 20, 30, 40 };
        long[] partials = new long[2];

        Thread t1 = new Thread(() -> partials[0] = data[0] + data[1]);
        Thread t2 = new Thread(() -> partials[1] = data[2] + data[3]);

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        long grandTotal = partials[0] + partials[1];
        System.out.println("Grand Total: " + grandTotal);
    }
}
```
</details>

---

### 11. Sources & Official References
- [Oracle Java Documentation — Defining and Starting a Thread](https://docs.oracle.com/javase/tutorial/essential/concurrency/runthread.html)
- [Java SE 21 Specification — Class java.lang.Thread](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html)
- [Java SE 21 Specification — Thread.State Enum](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.State.html)
