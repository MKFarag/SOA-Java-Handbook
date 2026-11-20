---
id: topic-14
slug: one-dimensional-arrays
topicNumber: 14
title: One-Dimensional Arrays
part: 'Part 1: Java Core'
sectionNumber: 5
sectionTitle: Arrays & Memory Structure
versionBadge: Java 8+
difficulty: Beginner
readingTime: 10 min read
shortDescription: >-
  Understand fixed-size indexed memory buffers on the JVM Heap. Master default
  values, bounds checking, cache locality, and enhanced for-each traversal.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
  - 'Topic 10: Loops & Iteration'
relevanceLevel: MUST-KNOW / CORE
---
> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

An **array** is a fixed-size, indexed container object that holds a sequence of elements of a single data type. In Java, **arrays are true objects allocated on the Heap**, regardless of whether they store primitive numbers or object references.

Every element within an array is accessed using an integer **index** ranging from `0` to `array.length - 1`. Once instantiated, an array's length is immutable and cannot be grown or shrunk.

### The Real-World Analogy
Think of a row of postal mailboxes in an apartment lobby:
- The building installs a row of exactly 50 mailboxes bolted into the wall.
- Each mailbox is assigned a fixed index number: Box 0, Box 1, Box 2, up to Box 49.
- You can instantly access Box 12 in $O(1)$ constant time by walking directly to it.
- If a 51st tenant moves in, you cannot stretch the wall. You must construct a brand new row of 60 mailboxes elsewhere and transfer the contents over.

### Why Does This Exist?
If you needed to store 1,000 temperature readings without arrays, you would have to declare 1,000 individual variables (`temp1`, `temp2`, ... `temp1000`), making automated looping, searching, and sorting impossible. Arrays provide:
1. **$O(1)$ Constant-Time Random Access:** Any element can be read or updated instantly via pointer arithmetic (`baseAddress + index * elementSize`).
2. **Hardware Cache Locality:** Elements are stored contiguously in memory, maximizing CPU L1/L2 cache hit rates during sequential iteration.
3. **Foundation for Data Structures:** ArrayLists, HashMaps, Ring Buffers, and Queues are internally built on top of Java primitive arrays.

---

## 2. Prerequisites
- **Topic 04: Variables, Identifiers & Primitive Data Types**
- **Topic 10: Loops & Iteration**

---

## 3. Syntax Breakdown & Heap Memory Structure

### Declaration and Allocation
```java
// 1. Declaration and heap allocation with default values
int[] numbers = new int[4];

// 2. Declaration with inline array literal initialization
String[] currencies = { "USD", "EUR", "JPY" };
```

| Token / Syntax | Meaning | Rule in Java |
| :--- | :--- | :--- |
| `int[]` | Array Type Indicator | Preferred Java syntax. `[]` follows the type, not the variable name. |
| `new int[4]` | Heap Allocation | Allocates contiguous memory for 4 integers. Defaults to `0`. |
| `.length` | Public Final Property | A read-only field (NOT a method) returning the total capacity of the array. |
| `numbers[i]` | Index Access Operator | Reads or writes the slot at zero-based position `i`. |

### Default Heap Initialization Values
When `new Type[N]` executes, JVM memory is zero-initialized before control returns to your code:
- `byte, short, int, long` default to `0`
- `float, double` default to `0.0`
- `boolean` defaults to `false`
- `char` defaults to `'\u0000'` (null character)
- Any reference type (`String[]`, `Object[]`) defaults to `null`

---

## 4. Runnable Code Examples

### Example 1: Allocation, Memory Defaults & Bounds Checking
```java
// File: examples/core/ArrayMechanics.java
public class ArrayMechanics {

    public static void main(String[] args) {
        System.out.println("=== 1. Array Allocation & Default Heap Values ===");
        // Allocated on Heap: primitives receive default values (0 for int)
        int[] numbers = new int[4];
        System.out.printf("Defaults: [%d, %d, %d, %d]%n",
                numbers[0], numbers[1], numbers[2], numbers[3]);

        // String array: elements default to null references
        String[] labels = new String[2];
        System.out.printf("String defaults: [%s, %s]%n", labels[0], labels[1]);

        System.out.println("\n=== 2. Array Population & Fixed Length ===");
        numbers[0] = 10;
        numbers[1] = 20;
        numbers[2] = 30;
        numbers[3] = 40;
        System.out.println("Array length: " + numbers.length);

        System.out.println("\n=== 3. Enhanced for-each vs Indexed Traversal ===");
        int sum = 0;
        for (int value : numbers) {
            sum += value;
        }
        System.out.println("Sum computed via enhanced for-loop: " + sum);

        System.out.println("\n=== 4. Boundary Protection ===");
        try {
            int outOfBounds = numbers[numbers.length]; // Index 4 is invalid (valid: 0..3)
            System.out.println("Value: " + outOfBounds);
        } catch (ArrayIndexOutOfBoundsException ex) {
            System.out.println("Caught Expected Exception: " + ex.getClass().getSimpleName() + " for index " + numbers.length);
        }
    }
}
```

#### Expected Output
```text
=== 1. Array Allocation & Default Heap Values ===
Defaults: [0, 0, 0, 0]
String defaults: [null, null]

=== 2. Array Population & Fixed Length ===
Array length: 4

=== 3. Enhanced for-each vs Indexed Traversal ===
Sum computed via enhanced for-loop: 100

=== 4. Boundary Protection ===
Caught Expected Exception: ArrayIndexOutOfBoundsException for index 4
```

---

### Example 2: Realistic Application (IoT Circular Telemetry Ring Buffer)
```java
// File: examples/core/SensorBufferApp.java
public class SensorBufferApp {

    public static class TelemetryRingBuffer {
        private final double[] buffer;
        private int head = 0;
        private int size = 0;

        public TelemetryRingBuffer(int capacity) {
            if (capacity <= 0) throw new IllegalArgumentException("Capacity must be positive.");
            this.buffer = new double[capacity];
        }

        public void push(double sample) {
            buffer[head] = sample;
            head = (head + 1) % buffer.length;
            if (size < buffer.length) {
                size++;
            }
        }

        public double calculateAverage() {
            if (size == 0) return 0.0;
            double sum = 0.0;
            for (int i = 0; i < size; i++) {
                sum += buffer[i];
            }
            return sum / size;
        }

        public double findMax() {
            if (size == 0) return 0.0;
            double max = buffer[0];
            for (int i = 1; i < size; i++) {
                if (buffer[i] > max) {
                    max = buffer[i];
                }
            }
            return max;
        }

        public int getSize() { return size; }
    }

    public static void main(String[] args) {
        System.out.println("=== Industrial IoT Telemetry Ring Buffer ===");
        TelemetryRingBuffer ring = new TelemetryRingBuffer(5);

        double[] incomingStream = { 22.4, 23.1, 22.8, 24.5, 25.0, 26.2, 27.1 };

        for (double sample : incomingStream) {
            ring.push(sample);
            System.out.printf("Streamed %4.1f C -> Current Avg: %5.2f C | Peak: %4.1f C | Samples in window: %d%n",
                    sample, ring.calculateAverage(), ring.findMax(), ring.getSize());
        }
    }
}
```

#### Expected Output
```text
=== Industrial IoT Telemetry Ring Buffer ===
Streamed 22.4 C -> Current Avg: 22.40 C | Peak: 22.4 C | Samples in window: 1
Streamed 23.1 C -> Current Avg: 22.75 C | Peak: 23.1 C | Samples in window: 2
Streamed 22.8 C -> Current Avg: 22.77 C | Peak: 23.1 C | Samples in window: 3
Streamed 24.5 C -> Current Avg: 23.20 C | Peak: 24.5 C | Samples in window: 4
Streamed 25.0 C -> Current Avg: 23.56 C | Peak: 25.0 C | Samples in window: 5
Streamed 26.2 C -> Current Avg: 24.32 C | Peak: 26.2 C | Samples in window: 5
Streamed 27.1 C -> Current Avg: 25.12 C | Peak: 27.1 C | Samples in window: 5
```

---

## 5. Step-by-Step Execution Trace

When allocating and accessing `int[] numbers = new int[4];`:

```text
[Stack Frame: main()]
  └── numbers (Local Variable 1)
        │
        └── Points to Heap Reference Address @0x7FA3
              │
              ▼
[JVM Heap Memory @0x7FA3: Array Object]
  ├── Object Header (Mark Word + Klass Pointer): 12-16 bytes
  ├── length field: 4 (32-bit int)
  └── Contiguous Primitive Slots:
        ├── Slot [0]: 00000000 (int 0)
        ├── Slot [1]: 00000000 (int 0)
        ├── Slot [2]: 00000000 (int 0)
        └── Slot [3]: 00000000 (int 0)

When numbers[2] = 30 executes:
  1. JVM checks bounds: index 2 < length 4? YES.
  2. Memory address computed: baseAddress + (2 * 4 bytes)
  3. Writes int 30 into Slot [2].
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Off-by-One Loop Error
```java
int[] items = new int[5];
for (int i = 0; i <= items.length; i++) { // BUG: <= instead of <
    System.out.println(items[i]);
}
```
**Why it fails:** An array of length 5 has valid indices `0, 1, 2, 3, 4`. On iteration `i = 5`, the JVM throws `ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5`.
**How to fix:** Always use `< items.length` or use the enhanced `for (int item : items)` loop.

### Mistake 2: Calling `.length()` instead of `.length`
```java
int size = items.length(); // COMPILE ERROR: cannot find symbol method length()
```
**Why it fails:** `String` has a method `.length()`, but arrays have a built-in public final property `.length`.
**How to fix:** Omit the parentheses: `int size = items.length;`.

### Mistake 3: Attempting to Print Array Directly via `toString()`
```java
int[] vals = { 1, 2, 3 };
System.out.println(vals); // Prints: [I@6acbcfc0
```
**Why it happens:** Array objects do not override `Object.toString()`. It prints the internal type descriptor (`[I` means `int[]`) followed by the identity hashcode.
**How to fix:** Use `java.util.Arrays.toString(vals);`.

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Prefer `int[] a` over `int a[]`:** Placing brackets next to the type cleanly specifies the type across the declaration.
2. **Use Enhanced For-Loops:** When you only need to read elements sequentially without modifying the array or needing the index counter, prefer `for (Type x : array)`.
3. **Check Array Bounds Defensively:** Validate incoming indices before accessing array slots in public library APIs.

### When NOT to Use
- **Do not use primitive arrays when dynamic resizing is required:** If elements are frequently added or removed at runtime, use `java.util.ArrayList<T>`.
- **Do not use arrays for sparse data:** If you only need to store 5 items at indices 10, 50,000, and 9,000,000, allocating a 9-million-element array wastes gigabytes of heap memory. Use a `Map<Integer, T>` instead.

---

## 8. Version Notes
- **Java 1.0:** Array syntax, zero-indexing, heap allocation, and bounds checking introduced.
- **Java 5:** Added enhanced for-each loop (`for (Type x : array)`).
- **Java 8:** Added `Arrays.stream(array)` for functional stream processing.

---

## 9. Summary Cheat Sheet

| Feature | Syntax | Behavior |
| :--- | :--- | :--- |
| **Heap Allocation** | `new int[N]` | Creates array with $N$ elements initialized to $0$. |
| **Literal Syntax** | `{ 1, 2, 3 }` | Compact allocation and inline initialization. |
| **Length Query** | `array.length` | Read-only field (no parentheses). |
| **Access / Update** | `array[index]` | $O(1)$ constant-time random access. |
| **Out-of-Bounds** | Index $< 0$ or $\ge length$ | Throws `ArrayIndexOutOfBoundsException`. |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
Why does this program fail at runtime?
```java
public class ArrayTrap {
    public static void main(String[] args) {
        String[] words = new String[3];
        System.out.println(words[0].toUpperCase());
    }
}
```
<details>
<summary>View Solution</summary>

**Runtime Exception:** `NullPointerException`.
**Explanation:** Allocating `new String[3]` creates an array containing three `null` references (`[null, null, null]`). Calling `.toUpperCase()` on `words[0]` attempts to dereference `null`. Elements must be populated before invoking methods on them.
</details>

---

### Exercise 2: Hands-on Implementation
Write a static method `int findSecondLargest(int[] numbers)` that returns the second largest value in an unsorted array of integers without modifying the original array. If the array has fewer than 2 elements, throw an `IllegalArgumentException`.
<details>
<summary>View Solution</summary>

```java
public static int findSecondLargest(int[] numbers) {
    if (numbers == null || numbers.length < 2) {
        throw new IllegalArgumentException("Array must contain at least 2 elements.");
    }
    int first = Integer.MIN_VALUE;
    int second = Integer.MIN_VALUE;
    for (int n : numbers) {
        if (n > first) {
            second = first;
            first = n;
        } else if (n > second && n != first) {
            second = n;
        }
    }
    if (second == Integer.MIN_VALUE) {
        throw new IllegalArgumentException("No distinct second largest element exists.");
    }
    return second;
}
```
</details>

---

### Exercise 3: Real-World Edge Case
Can an array in Java have a length of 0? Can it have a negative length?
<details>
<summary>View Solution</summary>

**Answer:**
1. **Length 0 is completely valid:** `int[] empty = new int[0];` creates a valid, non-null empty array object with `empty.length == 0`. It is the standard idiom for returning empty collections to avoid returning `null`.
2. **Negative length throws exception:** `int[] bad = new int[-5];` immediately throws `NegativeArraySizeException` at runtime.
</details>

---

## 11. Official Sources & Specifications
- [Oracle Java Documentation: Arrays](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html)
- [dev.java: Working with Arrays in Java](https://dev.java/learn/language-basics/arrays/)
- [Java Language Specification §10: Arrays](https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html)
