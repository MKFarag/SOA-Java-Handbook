---
id: topic-57
slug: structured-concurrency-and-scoped-values
topicNumber: 57
title: Structured Concurrency & Scoped Values
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 21+ Preview / Finalized Java 25
difficulty: Advanced
readingTime: 7 min read
shortDescription: >-
  Reference: StructuredTaskScope concurrency containment (ShutdownOnFailure / ShutdownOnSuccess), subtask lifecycle management, and ScopedValue immutable context sharing over ThreadLocal.
prerequisites:
  - 'Topic 54: Executor Framework & Thread Pools'
  - 'Topic 56: Virtual Threads (Project Loom)'
---

## Overview
Structured Concurrency (`StructuredTaskScope`) treats multiple concurrent subtasks executing in separate threads as a single atomic unit of work. Paired with `ScopedValue` (an immutable, lightweight alternative to `ThreadLocal`), it eliminates thread leaks, automates cascading cancellation, and shares contextual data safely across millions of virtual threads.

---

## Unstructured vs Structured Concurrency

```
 Unstructured (ExecutorService)              Structured (StructuredTaskScope)
 ┌───────────────────────────────┐          ┌───────────────────────────────────┐
 │ Task A forks Subtasks B and C │          │ try (var scope = openScope()) {   │
 │   │                           │          │     Subtask B = scope.fork(...);  │
 │   ├── Task A throws exception │          │     Subtask C = scope.fork(...);  │
 │   │                           │          │     scope.join();                 │
 │   ▼                           │          │ } // Scope close guarantees       │
 │ Subtask B & C leak and run    │          │   // all subtasks completed or    │
 │ forever in background!        │          │   // cancelled before exiting!    │
 └───────────────────────────────┘          └───────────────────────────────────┘
```

---

## `StructuredTaskScope` Core Policies

| Policy Model | Cancellation Behavior | Primary Enterprise Use Case |
| :--- | :--- | :--- |
| **`ShutdownOnFailure`** | Cancels all remaining subtasks if **any single subtask fails** | Aggregating required services (all or nothing) |
| **`ShutdownOnSuccess`** | Cancels all remaining subtasks as soon as **one subtask succeeds** | Redundant mirrors, hedged queries, racing replicas |

### Subtask Invariant
Calling `subtask.get()` before `scope.join()` completes throws `IllegalStateException`. Results are only accessible once the scope has joined.

---

## `ScopedValue` vs `ThreadLocal`

| Dimension | `java.lang.ThreadLocal` | `java.lang.ScopedValue` |
| :--- | :--- | :--- |
| **Mutability** | Mutable (`set()` can be called anywhere) | **Strictly Immutable** (bound for specific scope) |
| **Memory Footprint**| Large map per thread (leaks across VT pools) | Negligible; shared along call stack frames |
| **Lifetime Scope** | Indefinite until manual `remove()` | Lexical (bound to `where(KEY, val).run(...)`) |
| **Virtual Thread Fit**| Poor (multiplies memory by millions of threads)| **Optimized for millions of virtual threads** |

---

## Implementation Example: Structured Service Aggregation

```java
import java.util.concurrent.StructuredTaskScope;
import java.util.concurrent.StructuredTaskScope.Subtask;

public class StructuredConcurrencyDemo {
    public static final ScopedValue<String> CALLER_PRINCIPAL = ScopedValue.newInstance();

    public record AccountOverview(String user, double balance, int rewardPoints) {}

    public static AccountOverview fetchAccountData(String userId) throws Exception {
        // Enforce structured containment: all child tasks join or cancel before block exits
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            Subtask<Double> balanceSubtask = scope.fork(() -> {
                System.out.printf("Fetching balance for principal: %s%n", CALLER_PRINCIPAL.get());
                Thread.sleep(100);
                return 8250.50;
            });

            Subtask<Integer> pointsSubtask = scope.fork(() -> {
                Thread.sleep(80);
                return 1450;
            });

            // Await subtask completion or propagate first failure
            scope.join();
            scope.throwIfFailed();

            // Guaranteed safe: subtasks completed successfully
            return new AccountOverview(userId, balanceSubtask.get(), pointsSubtask.get());
        }
    }

    public static void main(String[] args) {
        // Binding immutable contextual principal down the call stack
        ScopedValue.where(CALLER_PRINCIPAL, "admin-service-account").run(() -> {
            try {
                AccountOverview overview = fetchAccountData("USER-104");
                System.out.printf("Fetched: User=%s, Bal=$%.2f, Points=%d%n",
                        overview.user(), overview.balance(), overview.rewardPoints());
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Fetching balance for principal: admin-service-account
Fetched: User=USER-104, Bal=$8250.50, Points=1450
```
</details>

---

## Pitfalls

- **Reading Subtask Value Before `join()`:** Calling `subtask.get()` or `subtask.exception()` prior to invoking `scope.join()` throws runtime `IllegalStateException`.
- **Using `ThreadLocal` in Million-Thread Virtual Architectures:** Assigning large request contexts to `ThreadLocal` on millions of virtual threads leads to heap memory leaks. Use `ScopedValue`.
- **Failing to Wrap in `try-with-resources`:** Creating `StructuredTaskScope` outside of ARM allows scope references to escape, violating structural containment invariants.

---

## Practice

### Question
Under `StructuredTaskScope.ShutdownOnSuccess<T>`, what happens to other concurrently running subtasks when the first subtask succeeds?

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `ShutdownOnSuccess` models a race between concurrent subtasks (e.g. querying two redundant database replicas).
2. The instant the first subtask finishes successfully, the scope transitions to the shutdown state.
3. The scope automatically issues cancellation interrupts to all other currently executing sibling subtasks.
4. Calling `scope.result()` retrieves the winning result, ignoring the cancelled siblings.

</details>
