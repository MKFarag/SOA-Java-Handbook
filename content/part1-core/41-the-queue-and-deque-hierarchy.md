---
id: topic-41
slug: the-queue-and-deque-hierarchy
topicNumber: 41
title: The Queue & Deque Hierarchy
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: Java 5+ / Java 6+ (Deque)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: FIFO queues, LIFO stacks, double-ended queues (Deque), circular buffer ArrayDeque mechanics, and PriorityQueue binary min-heap.
prerequisites:
  - 'Topic 36: Generics Fundamentals'
  - 'Topic 38: The List Hierarchy'
---

## Overview
The `java.util.Queue<E>` and `java.util.Deque<E>` (Double-Ended Queue) interfaces model ordered collection processing pipelines. `Queue` enforces FIFO (First-In, First-Out) dispatch, `Deque` supports both FIFO queues and LIFO (Last-In, First-Out) stacks in $O(1)$ constant time, and `PriorityQueue` implements a binary min-heap for priority-ordered extraction.

---

## The Queue Method Matrix

The `Queue` interface defines two distinct error-handling conventions for operations:

| Operation | Throws Exception (on full/empty) | Returns Special Sentinel (`false` or `null`) |
| :--- | :--- | :--- |
| **Insert** | `add(e)` | `offer(e)` |
| **Remove** | `remove()` | `poll()` |
| **Examine** | `element()` | `peek()` |

---

## Implementation Comparison & Memory Architecture

```
 ArrayDeque (Circular Buffer Array)               PriorityQueue (Binary Min-Heap)
 ┌──────────────────────────────────────┐        ┌───────────────────────────────┐
 │ [Tail] ──► [E3] [E4] ... [E1] [E2]   │        │           [Root: 10]          │
 │              ▲            │          │        │          /          \         │
 │              └─ head ─────┘          │        │     [Node: 25]   [Node: 30]   │
 └──────────────────────────────────────┘        └───────────────────────────────┘
  * Head & tail wrap via bitwise masking:         * Array-backed binary min-heap:
    head = (head - 1) & (elements.length - 1)      parent(i) = (i - 1) / 2
```

| Dimension | `ArrayDeque<E>` | `PriorityQueue<E>` | `LinkedList<E>` |
| :--- | :--- | :--- | :--- |
| **Ordering Model** | FIFO Queue or LIFO Stack | Natural / Custom Priority | FIFO Queue or LIFO Stack |
| **Insert Complexity** | **Amortized $O(1)$** | **$O(\log N)$** | $O(1)$ |
| **Extract Complexity** | **$O(1)$** | **$O(\log N)$** | $O(1)$ |
| **Internal Structure** | Circular dynamic array | Array-backed binary heap | Doubly linked node pointers |
| **Null Elements** | **Forbidden** | **Forbidden** | Allowed (discouraged) |
| **Modern Stack Usage**| **Recommended** (`push`/`pop`) | N/A | Discouraged |

> [!NOTE]
> The legacy class `java.util.Stack` extends `Vector` and synchronizes every operation. In modern Java, always use `ArrayDeque` for stack (LIFO) implementations:
> `Deque<String> stack = new ArrayDeque<>(); stack.push("A"); stack.pop();`

---

## Implementation Example

```java
import java.util.ArrayDeque;
import java.util.Comparator;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

public class QueueArchitectureDemo {
    public record WorkTask(String taskId, int priorityRank) {}

    public static void main(String[] args) {
        // 1. High-Performance FIFO Queue via ArrayDeque
        Queue<String> eventPipeline = new ArrayDeque<>();
        eventPipeline.offer("EVENT-01");
        eventPipeline.offer("EVENT-02");
        eventPipeline.offer("EVENT-03");

        System.out.println("Processing FIFO Event: " + eventPipeline.poll()); // EVENT-01
        System.out.println("Next up without removing: " + eventPipeline.peek()); // EVENT-02

        // 2. Binary Min-Heap PriorityQueue (lowest rank number = highest priority)
        Queue<WorkTask> scheduler = new PriorityQueue<>(Comparator.comparingInt(WorkTask::priorityRank));
        scheduler.offer(new WorkTask("Batch-Report", 5));
        scheduler.offer(new WorkTask("Security-Alert", 1));
        scheduler.offer(new WorkTask("User-Signup", 3));

        System.out.println("--- Draining Priority Scheduler ---");
        while (!scheduler.isEmpty()) {
            WorkTask task = scheduler.poll();
            System.out.printf("Dispatched [%s] with priority %d%n", task.taskId(), task.priorityRank());
        }
    }
}
```

### Execution Output:
```text
Processing FIFO Event: EVENT-01
Next up without removing: EVENT-02
--- Draining Priority Scheduler ---
Dispatched [Security-Alert] with priority 1
Dispatched [User-Signup] with priority 3
Dispatched [Batch-Report] with priority 5
```

---

## Pitfalls

- **Iterating over `PriorityQueue` Expecting Sorted Order:** The `iterator()` of `PriorityQueue` traverses the internal array representation directly, which is a binary heap, NOT a sorted list. To extract elements in priority order, you must repeatedly invoke `poll()`.
- **Inserting `null` into `ArrayDeque` or `PriorityQueue`:** Both collections prohibit `null` elements because methods like `poll()` and `peek()` return `null` as a sentinel to indicate that the queue is empty.
- **Using `java.util.Stack`:** `Stack` inherits synchronization locks on every method from `Vector`, causing unnecessary thread lock contention. Always use `ArrayDeque` for LIFO operations.

---

## Practice

### Question
What happens when you execute `new PriorityQueue<>().offer(new Object());`?

### Explanation
1. `new PriorityQueue<>()` utilizes the natural ordering of elements by default.
2. In natural ordering, elements must implement `java.lang.Comparable`.
3. `Object` does not implement `Comparable`.
4. When `offer()` attempts to cast the object to `Comparable` during heap sift-up, it throws `java.lang.ClassCastException`.
