---
id: topic-54
slug: structured-concurrency-and-scoped-values
topicNumber: 54
title: Structured Concurrency & Scoped Values
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 21 LTS Preview / Java 25 LTS (JEP 480 & 481)
difficulty: Advanced
readingTime: 13 min read
shortDescription: >-
  Tame concurrent subtasks using StructuredTaskScope, automatic cancellation,
  and lightweight immutable ScopedValue.
prerequisites:
  - 'Topic 51: Executor Framework and Thread Pools'
  - 'Topic 53: Virtual Threads (Project Loom)'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Structured Concurrency and Scoped Values

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
In traditional multithreaded programming, concurrency is largely **unstructured**. When a method spawns subtasks across an `ExecutorService`, those threads have independent lifecycles:
- **Thread Leaks**: If the parent method throws an exception or times out, its spawned subtasks keep running in the background indefinitely ("orphan threads").
- **No Automatic Cancellation**: If one subtask fails in a way that makes all other subtasks useless, the other subtasks continue executing and wasting CPU/network bandwidth.
- **Lost Observability**: Thread dumps provide flat lists of threads with no visual parent-child relationship.

To bring structural discipline to concurrent code, Java introduced **Structured Concurrency** (`StructuredTaskScope`) and **Scoped Values** (`ScopedValue`):
- **Structured Concurrency**: Treats concurrent subtasks running in different threads as a single unit of work. The syntactic structure of the code (a `try-with-resources` block) strictly matches the runtime hierarchy of the threads: child tasks start within the scope, and the scope cannot exit until all child tasks finish or are cancelled.
- **Scoped Values**: A lightweight, immutable, safely inheritable alternative to `ThreadLocal`. They allow sharing contextual data (such as user credentials, distributed trace IDs, or transaction contexts) safely down a call tree across millions of virtual threads without memory leaks.

**Real-World Analogy:**
Think of structured programming control flow (`if`, `for`, `while`, method calls). When you invoke a method, execution branches, does work, and *always returns to the caller* before the calling line finishes. Unstructured concurrency was like the old `goto` statement: jumping into arbitrary background threads that could outlive their caller. Structured Concurrency restores the structured block discipline: subtasks fork inside a block and are guaranteed to join or cancel before the block closes.

---

### 2. Prerequisites
- **Executor Framework (Topic 51)**: Understanding task submission and completion.
- **Virtual Threads (Topic 53)**: Understanding lightweight thread lifecycles.

---

### 3. Syntax Breakdown

#### 3.1 `StructuredTaskScope` (Preview API)
```java
// Idiomatic Structured Concurrency Pattern:
try (var scope = StructuredTaskScope.open(StructuredTaskScope.Joiner.allSuccessfulOrThrow())) {
    StructuredTaskScope.Subtask<String> task1 = scope.fork(() -> fetchServiceA());
    StructuredTaskScope.Subtask<Integer> task2 = scope.fork(() -> fetchServiceB());

    scope.join(); // Blocks until all subtasks finish or fail

    // Results are guaranteed ready
    String a = task1.get();
    int b = task2.get();
} // Scope closes; any dangling tasks are automatically cancelled
```
- `StructuredTaskScope.open()`: Opens a new structured scope. Overloads accept policies such as `Joiner.allSuccessfulOrThrow()` or `Joiner.anySuccessfulOrThrow()`.
- `scope.fork(Callable)`: Spawns a concurrent subtask (typically running on a virtual thread). Returns a `Subtask<T>`.
- `scope.join()`: Awaits the subtasks according to the joiner policy.
- `subtask.get()`: Retrieves the completed result. Throws `IllegalStateException` if called before `scope.join()`.
- `subtask.state()`: Returns `Subtask.State` (`SUCCESS`, `FAILED`, `UNAVAILABLE`).

#### 3.2 `ScopedValue<T>`
```java
private static final ScopedValue<String> USER_ID = ScopedValue.newInstance();

// Binding a scoped value for a specific lexical execution block:
ScopedValue.where(USER_ID, "USR-8821").run(() -> {
    // Inside this block, USER_ID.get() returns "USR-8821"
    processOrder();
});
// Outside the block, USER_ID is unbound
```
- Unlike `ThreadLocal`, a `ScopedValue` is **immutable**, has a strictly bounded lifetime, and is safe and efficient to share with child virtual threads.

---

### 4. Code Examples

#### Example 1: Basic Structured Workflow with Scoped Values
The following example demonstrates setting a distributed trace ID via `ScopedValue` and executing parallel subtasks inside a `StructuredTaskScope`:

```java
import java.util.concurrent.StructuredTaskScope;

public class StructuredConcurrencyDemo {
    private static final ScopedValue<String> TRACE_ID = ScopedValue.newInstance();

    public static void main(String[] args) throws Exception {
        ScopedValue.where(TRACE_ID, "TXN-88219").run(() -> {
            try {
                executeWorkflow();
            } catch (Exception e) {
                System.err.println("Workflow failed: " + e.getMessage());
            }
        });
    }

    private static void executeWorkflow() throws Exception {
        System.out.println("Initiating structured concurrency workflow. Trace ID: " + TRACE_ID.get());

        try (var scope = StructuredTaskScope.open()) {
            StructuredTaskScope.Subtask<String> userTask = scope.fork(() -> {
                Thread.sleep(50);
                return "User Profile: Alice Vance (ID: 409)";
            });

            StructuredTaskScope.Subtask<String> ordersTask = scope.fork(() -> {
                Thread.sleep(70);
                return "Active Orders: 3 Pending Shipments";
            });

            scope.join();

            System.out.println("Subtask 1 State: " + userTask.state());
            System.out.println("Subtask 1 Result: " + userTask.get());
            System.out.println("Subtask 2 State: " + ordersTask.state());
            System.out.println("Subtask 2 Result: " + ordersTask.get());
            System.out.println("Structured workflow completed successfully.");
        }
    }
}
```

**Expected Output:**
```text
Initiating structured concurrency workflow. Trace ID: TXN-88219
Subtask 1 State: SUCCESS
Subtask 1 Result: User Profile: Alice Vance (ID: 409)
Subtask 2 State: SUCCESS
Subtask 2 Result: Active Orders: 3 Pending Shipments
Structured workflow completed successfully.
```

#### Example 2: Realistic Application — Travel Booking Aggregator with Short-Circuiting
In real-world booking engines, an itinerary requires both flight and hotel quotes. If either service fails, the entire transaction is cancelled immediately without waiting for the slow service to complete:

```java
import java.util.concurrent.StructuredTaskScope;

public class TravelBookingAggregatorApp {
    record FlightQuote(String flightNumber, double priceUsd) {}
    record HotelBooking(String hotelName, double ratePerNight) {}
    record TravelPackage(FlightQuote flight, HotelBooking hotel, double totalEstimatedCost) {}

    public static void main(String[] args) {
        System.out.println("Starting Travel Booking Aggregator...");
        try {
            TravelPackage packageResult = assembleTravelPackage("JFK", "LHR");
            System.out.println("Booking Assembled Successfully:");
            System.out.println("  Flight: " + packageResult.flight().flightNumber() + " ($" + packageResult.flight().priceUsd() + ")");
            System.out.println("  Hotel: " + packageResult.hotel().hotelName() + " ($" + packageResult.hotel().ratePerNight() + "/night)");
            System.out.println("  Total Estimated: $" + packageResult.totalEstimatedCost());
        } catch (Exception e) {
            System.err.println("Travel package assembly failed: " + e.getMessage());
        }
    }

    public static TravelPackage assembleTravelPackage(String origin, String destination) throws InterruptedException {
        try (var scope = StructuredTaskScope.open(StructuredTaskScope.Joiner.allSuccessfulOrThrow())) {
            StructuredTaskScope.Subtask<FlightQuote> flightTask = scope.fork(() -> fetchFlightQuote(origin, destination));
            StructuredTaskScope.Subtask<HotelBooking> hotelTask = scope.fork(() -> fetchHotelReservation(destination));

            scope.join(); // Awaits all subtasks; cancels siblings if any throws

            FlightQuote flight = flightTask.get();
            HotelBooking hotel = hotelTask.get();
            double total = flight.priceUsd() + (hotel.ratePerNight() * 3); // 3 nights estimate

            return new TravelPackage(flight, hotel, total);
        }
    }

    private static FlightQuote fetchFlightQuote(String origin, String destination) throws InterruptedException {
        Thread.sleep(60);
        return new FlightQuote("BA-178 (" + origin + "->" + destination + ")", 680.50);
    }

    private static HotelBooking fetchHotelReservation(String city) throws InterruptedException {
        Thread.sleep(40);
        return new HotelBooking("The Kensington Garden Hotel (" + city + ")", 215.00);
    }
}
```

**Expected Output:**
```text
Starting Travel Booking Aggregator...
Booking Assembled Successfully:
  Flight: BA-178 (JFK->LHR) ($680.5)
  Hotel: The Kensington Garden Hotel (LHR) ($215.0/night)
  Total Estimated: $1325.5
```

---

### 5. Step-by-Step Execution Trace
1. When entering `assembleTravelPackage`, `StructuredTaskScope.open(allSuccessfulOrThrow())` creates a new structured lexical scope.
2. `scope.fork()` starts two child virtual threads running `fetchFlightQuote` and `fetchHotelReservation` in parallel.
3. The parent thread reaches `scope.join()` and blocks until both subtasks finish.
4. If either subtask throws an exception, `allSuccessfulOrThrow()` immediately cancels all other uncompleted subtasks by interrupting them.
5. When the `try-with-resources` block exits, `scope.close()` ensures that no child threads survive outside the method boundary, preventing thread leaks.
6. `flightTask.get()` retrieves the safely published result without extra synchronization.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Calling `subtask.get()` Before `scope.join()`
```java
var task = scope.fork(() -> calculate());
var result = task.get(); // BUG: Throws IllegalStateException!
scope.join();
```
- **Consequence**: Throws `java.lang.IllegalStateException: Subtask not completed or fork not called`.
- **Fix**: Always call `scope.join()` prior to inspecting subtask results.

#### Pitfall 2: Leaking `ThreadLocal` in High-Throughput Virtual Threads
Using `ThreadLocal` with millions of virtual threads can cause massive memory consumption because each virtual thread retains a map of references.
- **Fix**: Use `ScopedValue` instead. Scoped values are immutable and shared down the thread hierarchy without individual map allocations.

---

### 7. Best Practices & When NOT to Use
- **Do**: Always use `try-with-resources` with `StructuredTaskScope` to guarantee that subtasks are cleaned up even if unexpected exceptions occur.
- **Do**: Use `Joiner.anySuccessfulOrThrow()` for hedging patterns (querying multiple mirrors concurrently and keeping the fastest response).
- **Don't**: Do not use Structured Concurrency for background daemon fire-and-forget tasks meant to run for the entire duration of the application.

---

### 8. Version Notes
- **Java 19 / 20**: Structured Concurrency introduced as an incubator feature (JEP 428 & JEP 437).
- **Java 21 LTS (JEP 453 / 446)**: Previewed in Java 21 LTS using subclass policies (`StructuredTaskScope.ShutdownOnFailure` and `ShutdownOnSuccess`).
- **Java 22 / 23 (JEP 462 / 480)**: Refined as second and third previews.
- **Java 24 / 25 LTS (JEP 480 & JEP 481)**: Streamlined the `StructuredTaskScope` API using the modern `Joiner` factory design (`StructuredTaskScope.open(Joiner)`), with `ScopedValue` finalized under JEP 481. Enabled using `--enable-preview`.

---

### 9. Summary Cheat Sheet

| Feature | `ExecutorService` (Classic) | `StructuredTaskScope` (Modern) |
| :--- | :--- | :--- |
| **Task Relationship** | Unrelated, independent | Parent-child tree hierarchy |
| **Error Propagation** | Sibling tasks continue running | Siblings cancelled automatically |
| **Thread Leaks** | High risk on exception | Zero risk (scope closure cleans up) |
| **Thread Dumps** | Flat list of threads | Clear hierarchical call tree |
| **Context Propagation**| `ThreadLocal` (mutable, heavy)| `ScopedValue` (immutable, zero-cost) |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Scoped Security Principal
Define a `ScopedValue<String> PRINCIPAL` and execute a method `auditUserAction(String action)` within a bounded scope where `PRINCIPAL` is bound to `"admin@company.com"`. Print the principal from inside the action.

<details>
<summary>View Solution</summary>

```java
public class ExerciseScopedPrincipal {
    private static final ScopedValue<String> PRINCIPAL = ScopedValue.newInstance();

    public static void auditUserAction(String action) {
        System.out.println("User [" + PRINCIPAL.get() + "] performed: " + action);
    }

    public static void main(String[] args) {
        ScopedValue.where(PRINCIPAL, "admin@company.com").run(() -> {
            auditUserAction("MODIFIED_SECURITY_RULE");
        });
    }
}
```
</details>

#### Exercise 2: Fastest Mirror Query (Hedging)
Simulate querying two server mirrors (`Mirror-A` sleeping 70ms, `Mirror-B` sleeping 30ms). Use `StructuredTaskScope.open(StructuredTaskScope.Joiner.anySuccessfulOrThrow())` to retrieve the result from whichever mirror responds first.

<details>
<summary>View Solution</summary>

```java
import java.util.concurrent.StructuredTaskScope;

public class ExerciseHedgingQuery {
    public static void main(String[] args) throws Exception {
        try (var scope = StructuredTaskScope.open(StructuredTaskScope.Joiner.anySuccessfulOrThrow())) {
            scope.fork(() -> {
                Thread.sleep(70);
                return "Response from Mirror-A";
            });
            scope.fork(() -> {
                Thread.sleep(30);
                return "Response from Mirror-B";
            });

            // Joiner.anySuccessfulOrThrow returns result directly via scope.join()
            String fastestResult = (String) scope.join();
            System.out.println("Fastest Mirror: " + fastestResult);
        }
    }
}
```
</details>

---

### 11. Sources & Official References
- [OpenJDK JEP 480: Structured Concurrency (Java Preview)](https://openjdk.org/jeps/480)
- [OpenJDK JEP 481: Scoped Values (Java Preview)](https://openjdk.org/jeps/481)
- [Inside Java — Structured Concurrency Tutorial](https://inside.java/tag/loom/)
