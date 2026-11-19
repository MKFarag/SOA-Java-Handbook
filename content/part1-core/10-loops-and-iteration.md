---
id: topic-10
slug: loops-and-iteration
topicNumber: 10
title: Loops & Iteration
part: 'Part 1: Java Core'
sectionNumber: 3
sectionTitle: Control Flow & Logic
versionBadge: Java 8+
difficulty: Beginner
readingTime: 11 min read
shortDescription: >-
  Master repetitive execution using standard for, enhanced for-each, while, and
  do-while loops. Control execution flows with break, continue, and labeled
  jumps.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
  - 'Topic 08: Conditional Statements'
---
## 1. What It Is and Why It Exists

A **loop** is a control flow structure that repeatedly executes a block of code as long as a specified boolean condition remains `true`. Each repetition of the loop block is termed an **iteration**.

Without loops, performing a task on 1,000 database records would require copy-pasting the exact same code 1,000 times. Loops allow a compact piece of code to scale to millions of operations effortlessly.

Java provides **four distinct loop constructs**:
1. **Standard `for` loop:** Counter-controlled loop ideal when the exact number of iterations is known in advance.
2. **Enhanced `for-each` loop (Java 5+):** Specialized iterator loop for cleanly traversing arrays and collections without managing index counters.
3. **`while` loop:** Pre-condition loop that checks its condition *before* executing the body (may execute zero times).
4. **`do-while` loop:** Post-condition loop that checks its condition *after* executing the body (guaranteed to execute at least once).

### The Real-World Analogy
Think of everyday physical routines:
- **`for` loop:** Doing 20 pushups in the gym. You count: 1, 2, 3... until 20 is reached.
- **`while` loop:** Pumping gas into your car. As long as the tank is not full (`while (!isFull)`), continue pumping. If the tank is already full when you arrive, you pump zero gallons.
- **`do-while` loop:** Trying on a pair of shoes. You must put the shoe on your foot at least once (`do`), and then decide whether to take it off or keep wearing it based on comfort (`while (!comfortable)`).
- **`for-each` loop:** Reading through a stack of mail envelopes one-by-one until the pile is empty.

---

## 2. Prerequisites
- **Topic 04: Variables, Identifiers & Primitive Data Types**
- **Topic 08: Conditional Statements** (Understanding boolean expressions)

---

## 3. Syntax Breakdown & Loop Control

### 1. The Four Loop Syntaxes
```java
// 1. Standard for Loop (Init; Condition; Update)
for (int i = 0; i < 5; i++) {
    // Body executes 5 times: i = 0, 1, 2, 3, 4
}

// 2. Enhanced for-each Loop
for (String name : nameList) {
    // Sequentially accesses each element
}

// 3. while Loop (Pre-test)
while (hasMoreData) {
    // Executes as long as hasMoreData is true
}

// 4. do-while Loop (Post-test)
do {
    // Guaranteed to execute at least once
} while (keepRetrying);
```

### 2. Loop Control Keywords
- **`break`:** Immediately terminates the enclosing loop and jumps to the first statement following the loop.
- **`continue`:** Immediately skips the remainder of the *current* iteration and jumps directly to the loop update/condition.
- **Labeled Loops (`label:`):** Allows breaking or continuing an outer enclosing loop from within a nested inner loop:
```java
searchLoop:
for (int row = 0; row < 10; row++) {
    for (int col = 0; col < 10; col++) {
        if (grid[row][col] == TARGET) {
            break searchLoop; // Exits BOTH loops simultaneously!
        }
    }
}
```

---

## 4. Fully Runnable Code Examples

### Example 1: Demonstrating the 4 Loops, Break, and Continue
This program exercises counter loops, post-condition loops, enhanced iterations, and conditional skips.

```java
// LoopMechanicsDemo.java
public class LoopMechanicsDemo {
    public static void main(String[] args) {
        // 1. Standard for loop with continue (skip even numbers)
        System.out.println("=== 1. Standard for Loop (Odd numbers only) ===");
        for (int i = 1; i <= 6; i++) {
            if (i % 2 == 0) {
                continue; // Skip rest of iteration for even numbers
            }
            System.out.print(i + " ");
        }
        System.out.println();

        // 2. Enhanced for-each Loop
        System.out.println("\n=== 2. Enhanced for-each Loop ===");
        String[] servers = {"auth-01", "api-01", "db-primary"};
        for (String server : servers) {
            System.out.println("Checking node: " + server);
        }

        // 3. while Loop (Simulating exponential backoff)
        System.out.println("\n=== 3. while Loop (Retry Backoff) ===");
        int attempts = 1;
        int delayMs = 100;
        while (attempts <= 3) {
            System.out.printf("Attempt #%d: waiting %d ms...%n", attempts, delayMs);
            delayMs *= 2; // Exponential increase
            attempts++;
        }

        // 4. do-while Loop (Guaranteed First Execution)
        System.out.println("\n=== 4. do-while Loop ===");
        int token = 0;
        do {
            System.out.println("Generated handshake token: " + (++token));
        } while (token < 1); // Condition is false, but body executed once!
    }
}
```

#### Expected Terminal Output
```
=== 1. Standard for Loop (Odd numbers only) ===
1 3 5 

=== 2. Enhanced for-each Loop ===
Checking node: auth-01
Checking node: api-01
Checking node: db-primary

=== 3. while Loop (Retry Backoff) ===
Attempt #1: waiting 100 ms...
Attempt #2: waiting 200 ms...
Attempt #3: waiting 400 ms...

=== 4. do-while Loop ===
Generated handshake token: 1
```

---

### Example 2: Realistic 2D Grid Scanner with Labeled Break
A production-style spatial coordinate scanner locating an anomaly target in a multi-row memory grid and terminating nested loops cleanly using a label.

```java
// MatrixScannerApp.java
public class MatrixScannerApp {
    public static void main(String[] args) {
        // 3x4 grid representing satellite telemetry sensor cells
        int[][] sensorGrid = {
            { 10,  12,  14,  15 },
            { 18,  99,  22,  24 }, // 99 is anomaly target
            { 30,  32,  34,  36 }
        };

        int anomalyTarget = 99;
        boolean anomalyFound = false;
        int targetRow = -1;
        int targetCol = -1;

        System.out.println("==============================================");
        System.out.println("        SATELLITE SENSOR GRID AUDIT           ");
        System.out.println("==============================================");

        // Labeled outer loop allows breaking from deep within nested loops
        gridScanner:
        for (int r = 0; r < sensorGrid.length; r++) {
            for (int c = 0; c < sensorGrid[r].length; c++) {
                int reading = sensorGrid[r][c];
                System.out.printf("Scanning cell [%d][%d] -> Value: %d%n", r, c, reading);

                if (reading == anomalyTarget) {
                    anomalyFound = true;
                    targetRow = r;
                    targetCol = c;
                    System.out.println(">> ANOMALY IDENTIFIED! Terminating full grid scan.");
                    break gridScanner; // Immediately breaks out of BOTH r and c loops!
                }
            }
        }

        System.out.println("----------------------------------------------");
        if (anomalyFound) {
            System.out.printf("Scan Complete: Anomaly locked at Row %d, Column %d%n", targetRow, targetCol);
        } else {
            System.out.println("Scan Complete: All sensors within normal nominal range.");
        }
        System.out.println("==============================================");
    }
}
```

#### Expected Terminal Output
```
=============================================="
        SATELLITE SENSOR GRID AUDIT           
=============================================="
Scanning cell [0][0] -> Value: 10
Scanning cell [0][1] -> Value: 12
Scanning cell [0][2] -> Value: 14
Scanning cell [0][3] -> Value: 15
Scanning cell [1][0] -> Value: 18
Scanning cell [1][1] -> Value: 99
>> ANOMALY IDENTIFIED! Terminating full grid scan.
----------------------------------------------
Scan Complete: Anomaly locked at Row 1, Column 1
==============================================
```

---

## 5. Step-by-Step: What Happens When This Runs

1. **Standard `for` Lifecycle:**
   - **Initialization:** `int i = 1` executes once when the loop begins.
   - **Condition Evaluation:** The JVM checks `i <= 6`. If true, body executes.
   - **Body & Continue:** When `i == 2`, `continue` branches immediately to the update step without printing.
   - **Update Step:** `i++` increments the counter, and the cycle repeats.
2. **Enhanced `for-each` Bytecode:**
   - For an array, the compiler automatically generates an internal hidden integer index variable and checks `index < array.length`.
   - For a `Collection` (like `List`), the compiler generates `Iterator<T>` calls (`hasNext()` and `next()`).
3. **Labeled Break Mechanics:**
   - In `MatrixScannerApp`, when `sensorGrid[1][1] == 99`, the `break gridScanner;` instruction executes an unconditional jump (`goto`) to the bytecode offset immediately after the outer `for` loop, safely short-circuiting the remaining rows and columns.

---

## 6. Common Mistakes & Compiler / Runtime Errors

### Mistake 1: Off-By-One Index Overflow (`<=` vs `<`)
```java
// CRITICAL BUG:
int[] numbers = {10, 20, 30};
for (int i = 0; i <= numbers.length; i++) { // NOTICE '<='
    System.out.println(numbers[i]);
}
// Throws java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3!
```
- **Cause:** Arrays in Java are zero-indexed (`0, 1, 2` for length 3). Accessing `numbers[3]` exceeds array bounds.
- **Fix:** Always use `< numbers.length` (strict inequality).

### Mistake 2: Accidental Semicolon Empty Loop Body
```java
// SILENT DEADLOCK:
int count = 0;
while (count < 5); // NOTICE SEMICOLON!
{
    count++;
}
```
- **Cause:** The trailing semicolon makes the `while` body an empty statement. The loop spins infinitely checking `0 < 5` without ever executing `count++`!
- **Fix:** Remove the semicolon after the `while (...)` condition.

### Mistake 3: Concurrent Modification in Enhanced for-each
```java
List<String> list = new ArrayList<>(List.of("A", "B"));
for (String item : list) {
    list.remove(item); // CRASHES!
}
// Throws java.lang.ConcurrentModificationException
```
- **Cause:** Modifying a collection's structure while iterating over it via enhanced for-each corrupts the internal iterator.
- **Fix:** Use an explicit `Iterator` with `iterator.remove()` or modern `list.removeIf(...)`.

---

## 7. Best Practices & Anti-Patterns

### Best Practices (DO):
- **Prefer enhanced for-each:** Whenever you do not need the numeric index, for-each is safer, cleaner, and impossible to produce an off-by-one bug.
- **Use labeled breaks sparingly for multidimensional algorithms:** Labeled breaks eliminate clumsy boolean flags like `boolean shouldStop = false;` across nested loops.
- **Ensure loop termination conditions are guaranteed to occur:** Always verify that state variables advance towards the termination condition.

### Anti-Patterns (DON'T):
- **Never modify loop counter variables inside the body of a `for` loop:** `for (int i = 0; i < 10; i++) { if (...) i += 2; }` makes loop bounds unreadable and unpredictable.
- **Avoid infinite loops without explicit sleep or exit conditions:** A raw `while (true)` spinning on the CPU without blocking will peg a CPU core at 100% utilization.

---

## 8. Version Notes & Compatibility Matrix

- **Java 1.0:** Canonical `for`, `while`, and `do-while` loops established.
- **Java 5:** Introduced the **Enhanced `for-each` loop (JEP / Java 5 Language Enhancements)** for arrays and `java.lang.Iterable`.
- **Java 8:** Introduced the **Stream API** (`stream().forEach()`), providing a functional, declarative alternative to traditional imperative loops.

---

## 9. Summary Cheat Sheet

| Loop Construct | Minimum Iterations | Best Suited For | Can Traverse Collections? |
| :--- | :--- | :--- | :--- |
| **`for (int i=0; i<N; i++)`** | `0` | Known iteration count, index access | Yes (via index) |
| **`for (Type item : array)`** | `0` | Sequential read-only traversal | Yes (direct) |
| **`while (condition)`** | `0` | Event-driven or state-driven loops | Yes (via iterator) |
| **`do-while (condition)`** | **`1`** | Prompts, retries, handshake handoffs | Yes |
| **`break`** | N/A | Immediate loop exit | Supported |
| **`continue`** | N/A | Skip to next iteration | Supported |
| **`label: break label;`** | N/A | Exit nested outer loops | Supported |

---

## 10. Graded Interactive Practice Exercises

### Exercise 1: Spot the Off-by-One Bug
**Prompt:** Why does this code crash, and how do you fix it?
```java
String[] codes = {"US", "CA", "MX"};
for (int i = 0; i <= codes.length; i++) {
    System.out.println(codes[i]);
}
```

#### Hidden Solution & Explanation
```java
// Fix: Change '<=' to '<'
for (int i = 0; i < codes.length; i++) {
    System.out.println(codes[i]);
}
// Or better, use enhanced for-each:
for (String code : codes) {
    System.out.println(code);
}
```
> **Explanation:** `codes.length` is `3`. Valid indices are `0, 1, 2`. Testing `i <= codes.length` causes an iteration with `i = 3`, throwing `ArrayIndexOutOfBoundsException`.

---

### Exercise 2: Hands-on Implementation Challenge
**Prompt:** Write a Java program named `SumCalculator` that computes the sum of all integers from 1 to 100 using a `while` loop and prints `"Total Sum: 5050"`.

#### Starter Code
```java
public class SumCalculator {
    public static void main(String[] args) {
        // Calculate sum from 1 to 100
    }
}
```

#### Hidden Solution & Explanation
```java
public class SumCalculator {
    public static void main(String[] args) {
        int sum = 0;
        int i = 1;
        while (i <= 100) {
            sum += i;
            i++;
        }
        System.out.println("Total Sum: " + sum);
    }
}
```
> **Explanation:** The accumulator `sum` accumulates `i` on each step, while `i++` advances the counter until `i <= 100` becomes false.

---

### Exercise 3: Real-World Architecture Challenge: Breaking Nested Loops
**Prompt:** In a 2D matrix search, what is the cleanest way to stop searching the moment a match is found, without using external boolean flags?

#### Hidden Solution & Explanation
```java
// Solution: Use a Labeled Break
outer:
for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
        if (matrix[r][c] == target) {
            found = true;
            break outer; // Jumps cleanly out of BOTH loops
        }
    }
}
```
> **Explanation:** Without a labeled break, a regular `break` only terminates the inner loop, requiring awkward boolean flags (`if (found) break;`) in the outer loop. Labeled breaks compile to a single efficient unconditional jump instruction.

---

## 11. Verified Official Sources
- [Oracle Java SE Documentation: Control Flow Statements (for, while, do-while)](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html)
- [dev.java: Loops in Java](https://dev.java/learn/language-basics/loops/)
- [The Java Language Specification: Chapter 14 Iteration Statements](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.14)
