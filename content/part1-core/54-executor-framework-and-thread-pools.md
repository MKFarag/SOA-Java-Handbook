---
id: topic-54
slug: executor-framework-and-thread-pools
topicNumber: 54
title: Executor Framework & Thread Pools
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 5+ / Java 19+ (AutoCloseable ExecutorService)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Decoupling task submission from execution via ExecutorService, ThreadPoolExecutor 7-parameter constructor, work queues, rejection policies, and Future results.
prerequisites:
  - 'Topic 41: The Queue & Deque Hierarchy'
  - 'Topic 51: Threads and Thread Lifecycle'
---

## Overview
The Executor Framework (`java.util.concurrent.ExecutorService`) decouples asynchronous task submission from operating system thread management. By recycling a pre-allocated pool of worker threads, thread pools eliminate thread creation overhead, bound memory consumption, and govern task scheduling through thread-safe blocking work queues.

---

## `ThreadPoolExecutor` Architecture

```
                          ThreadPoolExecutor Task Flow
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. Task Submitted via submit(task)                                     │
 │       │                                                                │
 │       ├── activeThreads < corePoolSize? ──► Spawn new Core Worker Thread
 │       │                                                                │
 │       ├── workQueue.offer(task)?        ──► Queue in BlockingQueue     │
 │       │                                                                │
 │       ├── activeThreads < maxPoolSize?  ──► Spawn Extra Worker Thread  │
 │       │                                                                │
 │       └── Queue Full & Max Threads Active ──► Trigger Rejection Handler│
 └────────────────────────────────────────────────────────────────────────┘
```

### The 7 Core Configuration Parameters

| Parameter | Type | Architectural Purpose |
| :--- | :--- | :--- |
| `corePoolSize` | `int` | Number of core worker threads kept alive even when idle |
| `maximumPoolSize`| `int` | Upper bound of concurrent worker threads |
| `keepAliveTime` | `long` | Maximum time non-core idle threads wait before termination |
| `unit` | `TimeUnit` | Time unit for `keepAliveTime` |
| `workQueue` | `BlockingQueue<Runnable>` | Buffer holding tasks awaiting execution |
| `threadFactory` | `ThreadFactory` | Factory customizing thread naming, priority, daemon state |
| `handler` | `RejectedExecutionHandler` | Strategy triggered when queue is full and max threads reached |

---

## Rejection Policies (`RejectedExecutionHandler`)

| Policy | Behavior when Saturated | Recommended Production Use |
| :--- | :--- | :--- |
| **`AbortPolicy`** (Default) | Throws runtime `RejectedExecutionException` | Fail-fast alerting under overload |
| **`CallerRunsPolicy`** | Executes task directly on the **caller thread** | Natural backpressure; slows down submission rate |
| **`DiscardPolicy`** | Silently drops the rejected task | Non-critical metric samples |
| **`DiscardOldestPolicy`**| Evicts the head of the work queue and retries | Real-time sensor telemetry where newest data matters |

---

## `Runnable` vs `Callable<V>` and `Future<V>`

| Interface | Method Signature | Return Value | Exception Handling |
| :--- | :--- | :---: | :--- |
| `Runnable` | `void run()` | None | Unchecked exceptions only |
| `Callable<V>`| `V call() throws Exception` | Typed `V` | Declares checked `Exception` |
| `Future<V>` | `V get() throws ...` | Typed `V` | Blocks calling thread until task completes |

---

## Implementation Example: Production Thread Pool

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class ExecutorArchitectureDemo {
    public static void main(String[] args) throws Exception {
        // Bounded ThreadPoolExecutor with CallerRunsPolicy for backpressure
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
            2,                                     // corePoolSize
            4,                                     // maximumPoolSize
            60L, TimeUnit.SECONDS,                 // keepAliveTime
            new ArrayBlockingQueue<>(10),          // bounded queue: prevents OutOfMemoryError
            new ThreadPoolExecutor.CallerRunsPolicy() // Backpressure handler
        );

        // Submitting a Callable task returning a typed result
        Callable<String> databaseQuery = () -> {
            Thread.sleep(200);
            return "SUCCESS: Record ID 4920 fetched";
        };

        Future<String> queryFuture = executor.submit(databaseQuery);

        // Check completion status without blocking
        System.out.printf("Is task done before wait: %b%n", queryFuture.isDone());

        // Blocking get() with timeout
        String result = queryFuture.get(1, TimeUnit.SECONDS);
        System.out.println("Result from worker: " + result);

        // Graceful shutdown lifecycle
        executor.shutdown();
        if (!executor.awaitTermination(2, TimeUnit.SECONDS)) {
            executor.shutdownNow(); // Force cancel if timeout exceeded
        }
        System.out.println("Executor pool terminated cleanly.");
    }
}
```

### Execution Output:
```text
Is task done before wait: false
Result from worker: SUCCESS: Record ID 4920 fetched
Executor pool terminated cleanly.
```

---

## Pitfalls

- **Using `Executors.newFixedThreadPool(n)` Blindly:** Standard factory methods configure an unbounded `LinkedBlockingQueue`. Under high traffic, tasks queue indefinitely, consuming heap memory until crashing with `OutOfMemoryError`. Always configure an explicit bounded `ArrayBlockingQueue`.
- **Using `Executors.newCachedThreadPool()` Blindly:** Creates an unbounded pool (`maxPoolSize = Integer.MAX_VALUE`). High submission bursts spawn thousands of kernel threads, crashing with `unable to create native thread`.
- **Forgetting to Call `shutdown()`:** Active non-daemon worker threads keep the JVM process running indefinitely even after the `main` method exits. Always call `shutdown()` or use Java 19+ `try (ExecutorService ex = ...)` ARM construct.

---

## Practice

### Question
Under `CallerRunsPolicy`, what occurs when both the thread pool's maximum threads are busy and the bounded task queue is full?

### Explanation
1. When saturation is reached, the executor delegates task execution to its `RejectedExecutionHandler`.
2. Under `CallerRunsPolicy`, the task is executed synchronously by the **caller thread** that invoked `executor.submit()`.
3. This pauses the calling thread from submitting further tasks, automatically applying **backpressure** and allowing the pool workers to catch up on queued work.
