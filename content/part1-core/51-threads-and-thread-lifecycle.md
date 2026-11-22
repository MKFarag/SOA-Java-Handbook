---
id: topic-51
slug: threads-and-thread-lifecycle
topicNumber: 51
title: Threads and Thread Lifecycle
part: 'Part 1: Java Core'
sectionNumber: 13
sectionTitle: Concurrency & Multithreading
versionBadge: Java 1.0+ / Enhanced Java 21
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Operating system platform threads (1:1 kernel mapping), the six Thread.State lifecycle stages, daemon threads, joining, and cooperative interruption.
prerequisites:
  - 'Topic 14: Methods, Parameters & Return Values'
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 43: Lambdas & Functional Interfaces'
---

## Overview
A thread in Java represents an independent path of execution. Prior to virtual threads, standard Java platform threads maintained a strict **1:1 mapping with operating system kernel threads**, each allocating an operating-system-managed call stack (typically 1 MB). The JVM schedules threads cooperatively and preemptively across available CPU cores.

---

## The Six `Thread.State` Lifecycle Stages

```
                         Thread State Machine
               ┌─────────────────────────────────────┐
               │                NEW                  │
               └──────────────────┬──────────────────┘
                                  │ start()
                                  ▼
               ┌─────────────────────────────────────┐
         ┌────►│              RUNNABLE               │◄────┐
         │     │     (Running or Ready for CPU)      │     │
         │     └──────┬───────────┬───────────┬──────┘     │
         │            │           │           │            │
         │ Lock acquired   Object.wait()   sleep(ms)       │
         │            │           │           │            │
         │            ▼           ▼           ▼            │
         │      ┌───────────┐ ┌─────────┐ ┌─────────────┐  │
         └──────┤  BLOCKED  │ │ WAITING │ │TIMED_WAITING│──┘
                └───────────┘ └─────────┘ └─────────────┘
                                  │
                                  │ run() terminates
                                  ▼
               ┌─────────────────────────────────────┐
               │             TERMINATED              │
               └─────────────────────────────────────┘
```

| Thread State | Cause / Trigger | Exit Condition |
| :--- | :--- | :--- |
| **`NEW`** | Instantiated via `new Thread(task)` | `start()` invoked |
| **`RUNNABLE`** | Executing on CPU or waiting in OS scheduler run queue | Yield, preempt, or blocked on resource |
| **`BLOCKED`** | Waiting to acquire a Java monitor lock (`synchronized`) | Monitor lock becomes available |
| **`WAITING`** | Waiting indefinitely via `wait()`, `join()`, `LockSupport.park()` | `notify()`, `notifyAll()`, or thread unpark |
| **`TIMED_WAITING`** | Waiting for specified duration via `sleep(ms)`, `wait(ms)` | Specified timeout expires or interrupted |
| **`TERMINATED`** | `run()` method finishes normally or aborts with exception | Terminal state (cannot restart) |

---

## Daemon Threads & Thread Joining

- **User Threads vs Daemon Threads:** The JVM continues running as long as at least **one non-daemon (user) thread** remains alive. Daemon threads (`thread.setDaemon(true)`) are background workers (like GC or telemetry loggers) that are abruptly terminated by the JVM when all user threads finish.
- **`thread.join()`:** Pauses the calling thread until the target thread enters the `TERMINATED` state.

---

## Cooperative Interruption Protocol

Java does not support safe forcible thread killing (`Thread.stop()` is deprecated and dangerous). Thread cancellation is strictly **cooperative**:
1. Calling `worker.interrupt()` sets the thread's internal boolean interruption flag.
2. If the thread is blocked in `sleep()`, `wait()`, or `join()`, it wakes immediately and throws `InterruptedException`, which clears the flag.
3. If the thread is running CPU logic, it must periodically check `Thread.currentThread().isInterrupted()`.

---

## Implementation Example

```java
public class ThreadLifecycleDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            System.out.printf("[%s] Worker thread launched.%n", Thread.currentThread().getName());
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    // Simulating periodic background processing
                    System.out.println("Processing telemetry packet...");
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    System.out.println("Worker received interrupt during sleep. Cleaning up...");
                    // Restore interrupt flag or break cleanly
                    Thread.currentThread().interrupt();
                    break;
                }
            }
            System.out.println("Worker thread terminated cleanly.");
        }, "Worker-Pool-1");

        System.out.printf("Initial Thread State: %s%n", worker.getState());
        worker.start();
        System.out.printf("State after start(): %s%n", worker.getState());

        // Allow worker to execute two iterations
        Thread.sleep(1200);

        // Signal cooperative cancellation
        System.out.println("Main signaling worker interrupt...");
        worker.interrupt();

        // Await thread completion
        worker.join();
        System.out.printf("State after join(): %s%n", worker.getState());
    }
}
```

### Execution Output:
```text
Initial Thread State: NEW
State after start(): RUNNABLE
[Worker-Pool-1] Worker thread launched.
Processing telemetry packet...
Processing telemetry packet...
Processing telemetry packet...
Main signaling worker interrupt...
Worker received interrupt during sleep. Cleaning up...
Worker thread terminated cleanly.
State after join(): TERMINATED
```

---

## Pitfalls

- **Calling `.run()` Instead of `.start()`:** Invoking `thread.run()` executes the task synchronously on the **current caller thread** without spawning a new OS thread. Spawning a concurrent execution context requires `thread.start()`.
- **Swallowing `InterruptedException`:** Catching `InterruptedException` and doing nothing clears the interrupt status flag, preventing higher-level orchestrators (executors, cancellation frameworks) from detecting that the task was cancelled. Always re-interrupt: `Thread.currentThread().interrupt();`.
- **Starting a Thread in a Constructor:** Starting a thread inside a class constructor publishes `this` before the object is fully initialized, allowing concurrent threads to access uninitialized fields.

---

## Practice

### Question
What is the consequence of catching `InterruptedException` in a loop without restoring the interrupted status?
```java
while (!Thread.currentThread().isInterrupted()) {
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        // Empty catch block
    }
}
```

### Explanation
1. When `Thread.sleep()` is interrupted, it throws `InterruptedException`.
2. By Java language specification, throwing `InterruptedException` **clears the interruption flag** (resets it to `false`).
3. If the catch block does not re-assert interruption (`Thread.currentThread().interrupt()`) or `break`, the loop condition `!Thread.currentThread().isInterrupted()` evaluates to `true` on the next iteration.
4. Result: The thread fails to cancel and resumes running indefinitely.
