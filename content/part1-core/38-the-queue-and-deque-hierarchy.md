---
id: topic-38
slug: the-queue-and-deque-hierarchy
topicNumber: 38
title: The Queue & Deque Hierarchy
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: 'Java 5+ (Deque: Java 6)'
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master FIFO queues, LIFO stacks, PriorityQueue min-heaps, and high-performance
  circular ArrayDeque.
prerequisites:
  - 'Topic 33: Generics Fundamentals'
  - 'Topic 35: The List Hierarchy'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# The Queue & Deque Hierarchy

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
Programs frequently process tasks in a specific operational sequence:
- **FIFO (First-In, First-Out)**: Tasks are processed in the exact order they arrive (like a print queue or customer support tickets).
- **LIFO (Last-In, First-Out / Stack)**: The most recent task is handled first (like undo/redo operations or call-stack execution).
- **Priority-Driven**: Urgent tasks take precedence over older, low-priority tasks (like emergency hospital triage or critical system alarms).

Using an `ArrayList` for FIFO queuing requires removing elements from index 0 (`list.remove(0)`), which forces the CPU to shift every remaining element one position to the left—a costly $O(n)$ operation. The `java.util.Queue<E>` and `java.util.Deque<E>` (Double-Ended Queue) interfaces provide specialized data structures where insertion, inspection, and extraction at both ends operate in $O(1)$ constant time.

**Real-World Analogy:**
Think of a bank teller drive-through lane (FIFO Queue). The car that enters first gets served first. A cafeteria tray dispenser is a LIFO Stack: the clean tray placed on top last is the first one picked up by a customer. A hospital emergency room is a `PriorityQueue`: a patient with a severe heart attack gets treated immediately, bypassing patients with minor finger sprains regardless of arrival time.

---

### 2. Prerequisites
Before studying the Queue & Deque Hierarchy, you should understand:
- [Topic 33: Generics Fundamentals](file:///c:/Users/modym/OneDrive/Desktop/Java-Doc/content/part1-core/33-generics-fundamentals.md) — How type parameters `<E>` provide element safety.
- [Topic 35: The List Hierarchy](file:///c:/Users/modym/OneDrive/Desktop/Java-Doc/content/part1-core/35-the-list-hierarchy.md) — Array resizing mechanics and linked nodes.

---

### 3. Syntax Breakdown
The Queue hierarchy provides dual method conventions for handling failures:

| Operation | Throws Exception on Failure | Returns Special Value (`false` / `null`) |
| :--- | :--- | :--- |
| **Insert** | `add(e)` | `offer(e)` |
| **Remove** | `remove()` | `poll()` |
| **Examine** | `element()` | `peek()` |

Key implementations:
- `ArrayDeque<E>`: Backed by a dynamically resizing circular array.
  - Implements `Deque<E>`.
  - Serves as the recommended implementation for both **FIFO queues** and **LIFO stacks**.
  - Significantly faster and more memory-efficient than `LinkedList` or legacy `java.util.Stack`.
- `PriorityQueue<E>`: Backed by an array-based binary min-heap.
  - Elements are ordered by their natural ordering (`Comparable`) or by an explicit `Comparator`.
  - Extraction (`poll()`) always yields the minimum (highest priority) element in $O(\log n)$ time.
  - Does not preserve insertion order among elements of equal priority.
- `BlockingQueue<E>` (from `java.util.concurrent`):
  - Extends `Queue` with blocking operations: `put()` waits if the queue is full, and `take()` waits if the queue is empty.
  - Essential foundation for producer-consumer multi-threaded systems.

---

### 4. Runnable Examples

#### Example 1: Basic Queue, Deque, and PriorityQueue Mechanics
This example demonstrates FIFO queuing, LIFO stack mechanics using `ArrayDeque`, and min-heap ordering using `PriorityQueue`.

```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * Topic 38: The Queue & Deque Hierarchy - Basic Example
 * Demonstrates Queue FIFO mechanics, PriorityQueue min-heap behavior, and ArrayDeque.
 */
public class QueueDequeDemo {

    public static void main(String[] args) {
        // 1. ArrayDeque as FIFO Queue (offer, poll, peek)
        Queue<String> taskQueue = new ArrayDeque<>();
        taskQueue.offer("Job-Alpha");
        taskQueue.offer("Job-Beta");
        taskQueue.offer("Job-Gamma");

        System.out.println("FIFO Peek: " + taskQueue.peek());
        System.out.println("FIFO Poll 1: " + taskQueue.poll());
        System.out.println("FIFO Poll 2: " + taskQueue.poll());

        // 2. ArrayDeque as LIFO Stack (push, pop) - replaces legacy java.util.Stack
        Deque<String> undoStack = new ArrayDeque<>();
        undoStack.push("Action-Edit");
        undoStack.push("Action-Format");
        undoStack.push("Action-Delete");

        System.out.println("LIFO Pop 1: " + undoStack.pop());
        System.out.println("LIFO Pop 2: " + undoStack.pop());

        // 3. PriorityQueue: orders elements by natural ordering (min-heap)
        Queue<Integer> priorityQueue = new PriorityQueue<>();
        priorityQueue.offer(45);
        priorityQueue.offer(12);
        priorityQueue.offer(89);
        priorityQueue.offer(5);

        System.out.println("Min-heap extraction order:");
        while (!priorityQueue.isEmpty()) {
            System.out.print(priorityQueue.poll() + " ");
        }
        System.out.println();
    }
}
```

**Expected Output:**
```
FIFO Peek: Job-Alpha
FIFO Poll 1: Job-Alpha
FIFO Poll 2: Job-Beta
LIFO Pop 1: Action-Delete
LIFO Pop 2: Action-Format
Min-heap extraction order:
5 12 45 89 
```

---

#### Example 2: Realistic Application — Task Scheduler with Priority & Sliding-Window Audit
In mission-critical background workers, jobs are processed by priority level, and recent task completions are recorded in a fixed-size sliding window.

```java
import java.util.ArrayDeque;
import java.util.Comparator;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * Topic 38: The Queue & Deque Hierarchy - Realistic Application
 * Demonstrates an execution engine combining a priority queue for scheduled tasks
 * and an ArrayDeque for sliding-window execution history audit.
 */
public class JobSchedulerApp {

    public record ScheduledJob(String jobId, int priorityLevel, String taskName) {}

    public static class TaskEngine {
        // Higher priority numbers execute first (max-priority ordering)
        private final Queue<ScheduledJob> executionQueue = new PriorityQueue<>(
                Comparator.comparingInt(ScheduledJob::priorityLevel).reversed()
        );

        // Fixed-size recent execution history (sliding window using Deque)
        private final Deque<String> recentHistory = new ArrayDeque<>();
        private final int historyLimit;

        public TaskEngine(int historyLimit) {
            this.historyLimit = historyLimit;
        }

        public void submit(ScheduledJob job) {
            executionQueue.offer(job);
        }

        public void processNext() {
            ScheduledJob nextJob = executionQueue.poll();
            if (nextJob != null) {
                System.out.println("Processing: " + nextJob.taskName());
                if (recentHistory.size() >= historyLimit) {
                    recentHistory.removeLast(); // Evict oldest history entry
                }
                recentHistory.addFirst(nextJob.jobId() + ":" + nextJob.taskName());
            }
        }

        public Deque<String> getHistory() {
            return new ArrayDeque<>(recentHistory);
        }

        public int getPendingCount() {
            return executionQueue.size();
        }
    }

    public static void main(String[] args) {
        TaskEngine engine = new TaskEngine(3);

        engine.submit(new ScheduledJob("J-1", 1, "LowPriority-Cleanup"));
        engine.submit(new ScheduledJob("J-2", 10, "Critical-Database-Failover"));
        engine.submit(new ScheduledJob("J-3", 5, "Normal-Report-Gen"));
        engine.submit(new ScheduledJob("J-4", 8, "High-Security-Patch"));

        System.out.println("Pending jobs before processing: " + engine.getPendingCount());

        engine.processNext(); // Processes J-2 (Priority 10)
        engine.processNext(); // Processes J-4 (Priority 8)
        engine.processNext(); // Processes J-3 (Priority 5)
        engine.processNext(); // Processes J-1 (Priority 1)

        System.out.println("Pending jobs remaining: " + engine.getPendingCount());
        System.out.println("Execution History (Most recent first, limit 3): " + engine.getHistory());
    }
}
```

**Expected Output:**
```
Pending jobs before processing: 4
Processing: Critical-Database-Failover
Processing: High-Security-Patch
Processing: Normal-Report-Gen
Processing: LowPriority-Cleanup
Pending jobs remaining: 0
Execution History (Most recent first, limit 3): [J-1:LowPriority-Cleanup, J-3:Normal-Report-Gen, J-4:High-Security-Patch]
```

---

### 5. Step-by-Step Execution Trace
1. **Min/Max-Heap Placement**: In `JobSchedulerApp`, `executionQueue` sorts by `priorityLevel().reversed()`. When `submit()` is called, `PriorityQueue` executes a sift-up algorithm: it places the new element at the bottom of the binary tree and swaps it with parent nodes until the max-heap invariant is satisfied in $O(\log n)$ time.
2. **Priority Extraction**: When `processNext()` calls `poll()`, the root node (`J-2`, priority 10) is extracted in $O(1)$ time, and the tree executes a sift-down operation to re-establish the heap property in $O(\log n)$.
3. **Circular Array Deque**: `recentHistory.addFirst()` wraps indices around the internal circular buffer without shifting memory. When `recentHistory.size() >= historyLimit`, `removeLast()` evicts the oldest tail element in $O(1)$ time.

---

### 6. Common Mistakes and Compiler Errors
- **Using `java.util.Stack` Instead of `Deque`**:
  `java.util.Stack` is a legacy class extending `Vector`. It synchronizes every method, incurring unnecessary performance overhead, and inherits non-stack operations like arbitrary index insertion (`stack.insertElementAt(e, 5)`).
  *Solution*: Always use `Deque<T> stack = new ArrayDeque<>()`.
- **Assuming `PriorityQueue` Iteration is Sorted**:
  ```java
  for (Integer n : priorityQueue) { System.out.println(n); } // NOT SORTED
  ```
  *Solution*: The internal array of a binary heap is only partially ordered. Iterating with a `for` loop visits array slots directly. To retrieve items in sorted priority order, you must consume the queue via `poll()`.
- **Inserting `null` into `ArrayDeque` or `PriorityQueue`**:
  Both implementations throw `NullPointerException` on `null` additions because `null` is used as a sentinel return value by `poll()` and `peek()`.

---

### 7. Best Practices and When NOT to Use
- **Default to `ArrayDeque`**: For both stack (LIFO) and queue (FIFO) patterns, `ArrayDeque` is the fastest, lowest-memory choice in the JDK.
- **Prefer `offer()` / `poll()` over `add()` / `remove()`**: The special-value methods avoid throwing exceptions on empty queues or bounded capacity limits.
- **Do NOT use `LinkedList` as a Queue**: `LinkedList` incurs heavy node-allocation overhead and cache misses compared to `ArrayDeque`.
- **Do NOT use `PriorityQueue` for concurrent multi-threading**: `PriorityQueue` is not thread-safe. Use `java.util.concurrent.PriorityBlockingQueue` instead.

---

### 8. Version Notes
- **Java 1.5 (JSR 166)**: Introduced `Queue`, `PriorityQueue`, and `BlockingQueue`.
- **Java 1.6**: Introduced `Deque` and `ArrayDeque`.

---

### 9. Summary Cheat Sheet
| Interface / Class | Type | Insertion | Removal | Thread Safe | Recommended For |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ArrayDeque` | Circular Array Deque | $O(1)$ amortized | $O(1)$ | No | Modern stacks and FIFO queues |
| `LinkedList` | Doubly-Linked Nodes | $O(1)$ | $O(1)$ | No | Legacy usage only (avoid) |
| `PriorityQueue` | Binary Min/Max Heap | $O(\log n)$ | $O(\log n)$ | No | Priority task scheduling |
| `ArrayBlockingQueue` | Bounded Circular Array | $O(1)$ blocking | $O(1)$ blocking | Yes | Producer-Consumer pipelines |

---

### 10. Exercises and Solutions

<details>
<summary>Exercise 1: Check for balanced parentheses using <code>Deque</code></summary>

Write a method `boolean isBalanced(String expression)` that uses `ArrayDeque` to verify whether brackets `()`, `{}`, and `[]` are properly matched and closed.

**Solution:**
```java
public static boolean isBalanced(String expression) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char ch : expression.toCharArray()) {
        if (ch == '(' || ch == '{' || ch == '[') {
            stack.push(ch);
        } else if (ch == ')' || ch == '}' || ch == ']') {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (ch == ')' && top != '(') return false;
            if (ch == '}' && top != '{') return false;
            if (ch == ']' && top != '[') return false;
        }
    }
    return stack.isEmpty();
}
```
</details>

<details>
<summary>Exercise 2: Implement a sliding-window maximum using <code>Deque</code></summary>

Explain why `ArrayDeque` is the optimal data structure for the classic "Sliding Window Maximum" algorithmic problem.

**Solution:**
A monotonic deque can maintain indices of potential maximum elements in descending order. As the window slides forward, stale indices are removed from the front in $O(1)$, smaller candidate elements are evicted from the back in $O(1)$, and the window's current maximum is always inspected at the head (`peekFirst()`) in $O(1)$ time.
</details>

<details>
<summary>Exercise 3: Contrast <code>poll()</code> vs <code>remove()</code></summary>

**Solution:**
Both methods retrieve and remove the element at the head of the queue. However, when called on an empty queue:
- `remove()` throws `NoSuchElementException`.
- `poll()` returns `null`.
Using `poll()` is generally safer and more idiomatic when queues can be empty.
</details>

---

### 11. Official Sources and References
- [Oracle Java Documentation — The Queue Interface](https://docs.oracle.com/javase/tutorial/collections/interfaces/queue.html)
- [Oracle Java Documentation — The Deque Interface](https://docs.oracle.com/javase/tutorial/collections/interfaces/deque.html)
- [Java SE 21 API Specification — java.util.ArrayDeque](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html)
