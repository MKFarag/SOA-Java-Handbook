---
id: topic-17
slug: one-dimensional-arrays
topicNumber: 17
title: One-Dimensional Arrays
part: 'Part 1: Java Core'
sectionNumber: 5
sectionTitle: Arrays & Memory Structure
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Fixed-size indexed contiguous heap buffers, memory layout (header, length, elements), default initialization, bounds checking, and O(1) random access.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
  - 'Topic 13: Loops & Iteration'
---

## Overview
An array in Java is a fixed-length container object allocated on the heap that stores elements of a single type in contiguous memory. Array instances possess an immutable `length` field and provide $O(1)$ constant-time random access by computing memory offsets from the base address.

---

## JVM Heap Layout & Memory Mechanics

```
               Call Stack                    JVM Heap Memory
  ┌─────────────────────────────────┐   ┌─────────────────────────────────────────┐
  │ int[] data = new int[4];        │   │ [JVM Object Header: 12 bytes]           │
  │                                 │   │ [Array Length: 4 bytes (value: 4)]      │
  │ Reference Pointer 0x7A4F ───────┼──►│ [Index 0: 4 bytes int (0)]              │
  └─────────────────────────────────┘   │ [Index 1: 4 bytes int (0)]              │
                                        │ [Index 2: 4 bytes int (0)]              │
                                        │ [Index 3: 4 bytes int (0)]              │
                                        └─────────────────────────────────────────┘
```

### Default Zero-Initialization

When instantiated via `new Type[length]`, array elements are automatically initialized to type-specific default values:

| Element Type | Default Initialized Value |
| :--- | :--- |
| `byte`, `short`, `int`, `long` | `0` |
| `float`, `double` | `0.0` |
| `boolean` | `false` |
| `char` | `'\u0000'` (null character) |
| Reference Types (`String`, Objects) | `null` |

---

## Syntax & Traversal

```java
// 1. Declaration and explicit sizing (elements initialized to 0)
int[] buffer = new int[1024];

// 2. Anonymous array literal initialization
String[] endpoints = new String[] { "/api/v1/auth", "/api/v1/users" };

// 3. Compact inline array initializer (declaration only)
int[] primes = { 2, 3, 5, 7, 11 };

// Traversal: Standard Indexed (permits mutation by index)
for (int i = 0; i < primes.length; i++) {
    primes[i] *= 2;
}

// Traversal: Enhanced for-each (read-only element access)
for (int prime : primes) {
    System.out.println(prime);
}
```

---

## Implementation Example

```java
import java.util.Arrays;

public class MemoryArrayPipeline {
    public static void main(String[] args) {
        int[] metrics = { 84, 92, 78, 95, 88 };

        // Calculate aggregate statistics
        int sum = 0;
        int max = metrics[0];
        int min = metrics[0];

        for (int val : metrics) {
            sum += val;
            if (val > max) max = val;
            if (val < min) min = val;
        }

        double average = (double) sum / metrics.length;

        System.out.printf("Array Length : %d%n", metrics.length);
        System.out.printf("Min / Max    : %d / %d%n", min, max);
        System.out.printf("Mean Average : %.2f%n", average);
        System.out.printf("String Rep   : %s%n", Arrays.toString(metrics));

        // Resizing simulation: creating a new array and copying memory
        int[] expanded = new int[metrics.length + 2];
        System.arraycopy(metrics, 0, expanded, 0, metrics.length);
        expanded[5] = 99;
        expanded[6] = 100;

        System.out.printf("Expanded Array: %s%n", Arrays.toString(expanded));
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Array Length : 5
Min / Max    : 78 / 95
Mean Average : 87.40
String Rep   : [84, 92, 78, 95, 88]
Expanded Array: [84, 92, 78, 95, 88, 99, 100]
```
</details>

---

## Pitfalls

- **`ArrayIndexOutOfBoundsException`:** Accessing indices outside `0` to `array.length - 1` (such as `array[array.length]`) causes an immediate runtime exception. Array bounds are checked at runtime by the JVM.
- **Printing Arrays with `toString()`:** Directly printing an array (e.g., `System.out.println(arr)`) outputs the internal type signature and hashcode (e.g. `[I@7a4f32`). Use `java.util.Arrays.toString(arr)` for human-readable content.
- **Fixed Size Immutability:** An array cannot dynamically grow or shrink. To alter capacity, allocate a new array and copy existing elements via `System.arraycopy()` or `Arrays.copyOf()`.
- **Shallow Copy via `.clone()`:** Calling `arr.clone()` creates a new array container, but if elements are object references, both arrays still point to the same shared heap objects.

---

## Practice

### Question
Given the following declaration, what is printed?
```java
int[] items = new int[3];
items[0] = 5;
modify(items);
System.out.println(items[0] + " " + items[1]);

static void modify(int[] arr) {
    arr[0] = 10;
    arr = new int[3];
    arr[1] = 20;
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `items` holds a heap reference pointer to an array of size 3.
2. `modify` receives a copy of this reference pointer.
3. `arr[0] = 10;` mutates index 0 of the caller's array on the heap.
4. `arr = new int[3];` rebinds the local parameter `arr` to a brand-new array. The caller's `items` variable remains bound to the original array.
5. `arr[1] = 20;` affects only the newly instantiated array.
6. The caller reads index 0 (modified to `10`) and index 1 (unmodified, retaining default `0`).
7. Output: `10 0`.

</details>
