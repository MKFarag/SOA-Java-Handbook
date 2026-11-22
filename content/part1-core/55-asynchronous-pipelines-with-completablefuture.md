---
id: topic-55
slug: asynchronous-pipelines-with-completablefuture
topicNumber: 55
title: Asynchronous Pipelines with CompletableFuture
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 8+ / Enhanced Java 9 & 12
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Non-blocking asynchronous programming via CompletableFuture, pipeline chaining (thenApply, thenCompose), parallel fan-out (thenCombine, allOf), and exceptionally recovery.
prerequisites:
  - 'Topic 43: Lambdas & Functional Interfaces'
  - 'Topic 54: Executor Framework & Thread Pools'
---

## Overview
`java.util.concurrent.CompletableFuture<T>` (introduced in Java 8) implements `Future<T>` and `CompletionStage<T>` to provide declarative, non-blocking asynchronous programming. It enables chaining dependent tasks, fan-out parallel composition, and error recovery callbacks without blocking operating system threads with `.get()`.

---

## Asynchronous Pipeline Operations

```
                   CompletableFuture Execution Lifecycle
 ┌──────────────────────────────────────────────────────────────────┐
 │ supplyAsync(() -> fetchUser())          [Asynchronous Task A]    │
 │       │                                                          │
 │       ├── thenApply(User::getCardId)    [Transform 1-to-1]       │
 │       │                                                          │
 │       ├── thenCompose(id -> fetchBal()) [Flatten dependent async]│
 │       │                                                          │
 │       ├── thenCombine(creditScoreFuture)[Fan-in parallel join]   │
 │       │                                                          │
 │       └── exceptionally(ex -> fallback) [Non-blocking recovery]  │
 └──────────────────────────────────────────────────────────────────┘
```

| Operation Category | Method Signature | Functionality |
| :--- | :--- | :--- |
| **Factory / Trigger** | `supplyAsync(supplier, [executor])` | Runs task asynchronously returning `CompletableFuture<T>` |
| **Transform (1-to-1)** | `thenApply(Function<T, R>)` | Synchronously transforms result on completing thread |
| **Flatten (1-to-Async)**| `thenCompose(Function<T, CF<R>>)` | Chains dependent async task without nesting (`flatMap`) |
| **Join (Fan-In)** | `thenCombine(CF<U>, BiFunction)` | Merges results when both concurrent futures complete |
| **Multi-Join** | `CompletableFuture.allOf(CF...)` | Completes when all supplied futures complete |
| **First-Completed** | `CompletableFuture.anyOf(CF...)` | Completes as soon as any single supplied future completes |
| **Recovery** | `exceptionally(Function<Throwable, T>)`| Fallback value executed only if preceding stage throws |
| **Universal Catch** | `handle(BiFunction<T, Throwable, R>)`| Processes result or exception unconditionally |

---

## Thread Execution: Sync vs `*Async` Suffix

- **Without `Async` (`thenApply`):** Executes on the thread that completed the previous stage (may be caller thread if already completed, or the worker thread).
- **With `Async` (`thenApplyAsync`):** Submits the next stage to an `Executor` (defaults to `ForkJoinPool.commonPool()` if no executor is specified).

> [!WARNING]
> Never use `ForkJoinPool.commonPool()` for blocking I/O (database queries, network requests). `commonPool()` is sized strictly to `Runtime.getRuntime().availableProcessors() - 1`. Blocking operations on it will starve CPU-intensive background tasks across the entire JVM. Always supply an explicit custom `ExecutorService`.

---

## Implementation Example: Parallel Fan-Out / Fan-In

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CompletableFuturePipelineDemo {
    public record OrderSummary(String user, double balance, int creditScore) {}

    public static void main(String[] args) {
        ExecutorService customIoPool = Executors.newFixedThreadPool(4);

        try {
            // Asynchronous Task 1: Fetch Balance
            CompletableFuture<Double> balanceFuture = CompletableFuture.supplyAsync(() -> {
                sleep(100);
                return 4500.00;
            }, customIoPool);

            // Asynchronous Task 2: Fetch Credit Score (parallel)
            CompletableFuture<Integer> creditScoreFuture = CompletableFuture.supplyAsync(() -> {
                sleep(150);
                return 780;
            }, customIoPool);

            // Fan-In: Combine both results concurrently with error recovery
            CompletableFuture<OrderSummary> summaryFuture = balanceFuture
                .thenCombine(creditScoreFuture, (bal, score) -> new OrderSummary("USER-99", bal, score))
                .exceptionally(ex -> new OrderSummary("USER-99", 0.0, 0)); // Fallback on failure

            // Await non-blocking join in main
            OrderSummary summary = summaryFuture.join();
            System.out.printf("Assembled Summary: User=%s, Bal=$%.2f, Score=%d%n",
                    summary.user(), summary.balance(), summary.creditScore());

        } finally {
            customIoPool.shutdown();
        }
    }

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
```

### Execution Output:
```text
Assembled Summary: User=USER-99, Bal=$4500.00, Score=780
```

---

## Pitfalls

- **Blocking Inside Completion Callbacks:** Calling blocking operations (`Thread.sleep()`, socket reads) inside standard `thenApply` stalls the completing thread, degrading pipeline throughput.
- **Unchecked Exceptions in `supplyAsync`:** If a supplier throws an unchecked exception, the future enters the exceptionally completed state silently. If callers do not attach `exceptionally()`, `handle()`, or invoke `join()`, the exception is swallowed without warning.
- **Cascading Nested Futures without `thenCompose`:** Using `thenApply` with a method returning another `CompletableFuture` produces `CompletableFuture<CompletableFuture<T>>`. Always use `thenCompose` for flattening.

---

## Practice

### Question
What is the difference between `future.thenApply(fn)` and `future.thenCompose(fn)`?

### Explanation
1. `thenApply(Function<T, R>)` expects a function that returns a raw value `R`, wrapping the result inside a new `CompletableFuture<R>`.
2. `thenCompose(Function<T, CompletableFuture<R>>)` expects a function that itself returns a `CompletableFuture<R>`, flattening the resulting structure so it does not become `CompletableFuture<CompletableFuture<R>>`.
3. `thenApply` is analogous to `Stream.map()`, whereas `thenCompose` is analogous to `Stream.flatMap()`.
