---
id: topic-13
slug: loops-and-iteration
topicNumber: 13
title: Loops & Iteration
part: 'Part 1: Java Core'
sectionNumber: 3
sectionTitle: Control Flow & Logic
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Loop mechanics across standard for, enhanced for-each, while, do-while, flow interruption via break and continue, and labeled jumps.
prerequisites:
  - 'Topic 11: Conditional Statements'
---

## Overview
Loops control repetitive code execution based on evaluation conditions. Java provides four loop structures: counter-controlled `for`, pre-conditioned `while`, post-conditioned `do-while` (guaranteed at least one execution), and enhanced `for-each` which relies on `java.lang.Iterable` or array length.

---

## Loop Comparison & Execution Lifecycle

```
    Standard for / while (Pre-Test)                 do-while (Post-Test)
 ┌──────────────────────────────────┐        ┌──────────────────────────────────┐
 │  [ Evaluate Condition ]          │        │  [ Execute Loop Body ]           │
 │       │                          │        │       │                          │
 │  (true) ──► [ Execute Body ]     │        │       ▼                          │
 │       │            │             │        │  [ Evaluate Condition ]          │
 │       │     [ Step Update ]      │        │       │                          │
 │       │            │             │        │  (true) ──► (Repeat Body)        │
 │       └────────────┘             │        │  (false) ─► [ Exit Loop ]        │
 │  (false) ─► [ Exit Loop ]        │        └──────────────────────────────────┘
 └──────────────────────────────────┘
```

| Loop Construct | Condition Check Point | Minimum Runs | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **`for (init; cond; update)`** | Pre-test | 0 | Known number of iterations, array index manipulation |
| **`for (T item : iterable)`** | Pre-test (via Iterator/Index) | 0 | Read-only sequence traversal without index counters |
| **`while (condition)`** | Pre-test | 0 | Indeterminate iterations dependent on dynamic state |
| **`do { ... } while (cond);`** | Post-test | 1 | Input polling, handshake retries, token renewal |

---

## Interruption & Labeled Jump Control

- **`break`:** Terminates the innermost enclosing loop or switch immediately.
- **`continue`:** Discards the rest of the current iteration, triggering the loop update/condition evaluation.
- **Labeled Loops (`labelName:`):** Provides a jump target for `break` or `continue` to escape multiple nested loop levels without flag variables:

```java
matrixSearch:
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] == target) {
            foundRow = i;
            foundCol = j;
            break matrixSearch; // Exits BOTH nested loops directly
        }
    }
}
```

---

## Implementation Example

```java
public class RetryAndSearchPipeline {
    public static void main(String[] args) {
        int[] sensorReadings = {42, -1, 105, -999, 88, 12};
        int errorSentinel = -999;
        int validSum = 0;
        int validCount = 0;

        // 1. Array traversal with continue and break
        for (int reading : sensorReadings) {
            if (reading == errorSentinel) {
                System.out.println("Encountered fatal sentinel value. Aborting analysis.");
                break;
            }
            if (reading < 0) {
                // Skip negative/invalid transient noise
                continue;
            }
            validSum += reading;
            validCount++;
        }

        double average = (validCount > 0) ? (double) validSum / validCount : 0.0;
        System.out.printf("Processed %d valid readings. Average: %.2f%n", validCount, average);

        // 2. Exponential backoff simulation via do-while
        int retryCount = 0;
        int maxRetries = 3;
        boolean connectionEstablished = false;

        do {
            retryCount++;
            System.out.printf("Attempting connection: attempt %d/%d...%n", retryCount, maxRetries);
            if (retryCount == 2) {
                connectionEstablished = true;
            }
        } while (!connectionEstablished && retryCount < maxRetries);

        System.out.printf("Connection status: %s (after %d attempts)%n",
                connectionEstablished ? "CONNECTED" : "FAILED", retryCount);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Processed 2 valid readings. Average: 73.50
Encountered fatal sentinel value. Aborting analysis.
Attempting connection: attempt 1/3...
Attempting connection: attempt 2/3...
Connection status: CONNECTED (after 2 attempts)
```
</details>

---

## Pitfalls

- **Off-By-One Indexing:** Using `<=` instead of `<` when indexing arrays (e.g., `for (int i = 0; i <= arr.length; i++)`) triggers `ArrayIndexOutOfBoundsException` on the terminal iteration.
- **Accidental Semicolon Placement:** Placing a semicolon immediately after a loop header (e.g., `while (condition); { body; }`) creates an empty statement body, resulting in an immediate infinite loop or unexpected single execution.
- **Modifying Collections During Enhanced `for`:** Adding or removing elements from a `Collection` inside a `for-each` loop invalidates its internal cursor and throws `ConcurrentModificationException`. Use `Iterator.remove()` or `Collection.removeIf()`.
- **Floating-Point Counters:** Using `float` or `double` as counter variables (e.g., `for (double d = 0.1; d <= 1.0; d += 0.1)`) creates rounding accumulation errors that prevent exact termination matches. Always use integer step counters.

---

## Practice

### Question
What is the final value of `count` after the following nested loop terminates?
```java
int count = 0;
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) {
            continue outer;
        }
        count++;
    }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. When `i = 0`: inner loop runs for `j = 0, 1, 2` $\rightarrow$ `count` increments 3 times (total: 3).
2. When `i = 1`:
   - `j = 0`: `count` increments to 4.
   - `j = 1`: `continue outer;` triggers, skipping the rest of the inner loop (`j = 2` never executes) and advancing directly to `i = 2`.
3. When `i = 2`: inner loop runs for `j = 0, 1, 2` $\rightarrow$ `count` increments 3 times (total: 7).
4. Final value of `count`: `7`.

</details>
