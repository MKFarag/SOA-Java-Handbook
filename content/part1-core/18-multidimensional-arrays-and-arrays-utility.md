---
id: topic-18
slug: multidimensional-arrays-and-arrays-utility
topicNumber: 18
title: Multi-Dimensional Arrays & Arrays Utility
part: 'Part 1: Java Core'
sectionNumber: 5
sectionTitle: Arrays & Memory Structure
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Jagged matrices as arrays-of-arrays on the heap, nested indexing, and java.util.Arrays utilities (sort, binarySearch, deepToString, equals).
prerequisites:
  - 'Topic 17: One-Dimensional Arrays'
---

## Overview
Multi-dimensional arrays in Java are represented as arrays of array references rather than contiguous single-block matrices. Because every row is an independent heap object, Java natively supports jagged (ragged) arrays where individual rows have differing lengths. The utility class `java.util.Arrays` provides static algorithms for sorting, searching, comparing, and formatting array structures.

---

## Heap Architecture & Jagged Arrays

```
                     JVM Heap Memory Architecture (int[3][])
 ┌──────────────────────────────────────────────────────────────────┐
 │  Outer Reference Array (int[][])                                  │
 │   [Index 0] ───────────► [Row 0: int[2]] -> [ 10, 20 ]           │
 │   [Index 1] ───────────► [Row 1: int[4]] -> [ 30, 40, 50, 60 ]   │
 │   [Index 2] ───────────► [Row 2: int[1]] -> [ 70 ]               │
 └──────────────────────────────────────────────────────────────────┘
  * Rows can have varying lengths and reside at non-contiguous memory addresses.
```

### Allocation Syntax

```java
// 1. Uniform Rectangular Matrix (3 rows x 4 columns)
int[][] matrix = new int[3][4];

// 2. Explicit Jagged Array (defining outer dimension first)
int[][] jagged = new int[3][];
jagged[0] = new int[2];
jagged[1] = new int[5];
jagged[2] = new int[1];

// 3. Inline Array Literal
int[][] coordinates = {
    {1, 2},
    {3, 4, 5},
    {6}
};
```

---

## `java.util.Arrays` Method Reference

| Method | Return | Description | Time Complexity |
| :--- | :--- | :--- | :--- |
| `sort(arr)` | `void` | Dual-Pivot Quicksort (primitives) / TimSort (objects) | $O(N \log N)$ |
| `binarySearch(arr, key)` | `int` | Binary search on sorted array; returns index or `-(insertionPoint) - 1` | $O(\log N)$ |
| `equals(a, b)` | `boolean` | Shallow equality comparison between 1D arrays | $O(N)$ |
| `deepEquals(a, b)` | `boolean` | Deep recursive equality comparison across nested arrays | $O(N \times M)$ |
| `toString(arr)` | `String` | Formats 1D array as `"[e1, e2, ...]"` | $O(N)$ |
| `deepToString(arr)` | `String` | Recursively formats multi-dimensional arrays | $O(N \times M)$ |
| `copyOf(arr, newLen)` | `T[]` | Copies and truncates or pads with default values | $O(N)$ |
| `fill(arr, val)` | `void` | Assigns specified value to every element | $O(N)$ |

---

## Implementation Example

```java
import java.util.Arrays;

public class MatrixAndArraysDemo {
    public static void main(String[] args) {
        // 1. Processing a jagged matrix
        int[][] departmentalShifts = {
            { 8, 8, 8 },          // Dept 0: 3 shifts
            { 12, 12 },           // Dept 1: 2 shifts
            { 8, 4, 8, 4 }        // Dept 2: 4 shifts
        };

        int totalHours = 0;
        for (int r = 0; r < departmentalShifts.length; r++) {
            for (int c = 0; c < departmentalShifts[r].length; c++) {
                totalHours += departmentalShifts[r][c];
            }
        }
        System.out.printf("Total logged hours across all shifts: %d%n", totalHours);
        System.out.printf("Matrix Representation: %s%n", Arrays.deepToString(departmentalShifts));

        // 2. Sorting and Binary Search via java.util.Arrays
        int[] sensorPings = { 450, 120, 890, 230, 600 };
        Arrays.sort(sensorPings); // Must be sorted before binary search
        System.out.printf("Sorted pings: %s%n", Arrays.toString(sensorPings));

        int targetPing = 230;
        int foundIndex = Arrays.binarySearch(sensorPings, targetPing);
        System.out.printf("Ping %d found at sorted index: %d%n", targetPing, foundIndex);

        int missingPing = 300;
        int searchResult = Arrays.binarySearch(sensorPings, missingPing);
        System.out.printf("Ping %d missing; search result: %d (insertion point: %d)%n",
                missingPing, searchResult, -(searchResult + 1));
    }
}
```

### Execution Output:
```text
Total logged hours across all shifts: 64
Matrix Representation: [[8, 8, 8], [12, 12], [8, 4, 8, 4]]
Sorted pings: [120, 230, 450, 600, 890]
Ping 230 found at sorted index: 1
Ping 300 missing; search result: -3 (insertion point: 2)
```

---

## Pitfalls

- **`binarySearch` on Unsorted Arrays:** Invoking `Arrays.binarySearch()` on an unsorted array returns unpredictable, undefined results without throwing an error. Always sort the array first.
- **Using `Arrays.toString()` on Multi-Dimensional Arrays:** Calling `Arrays.toString(matrix)` prints the memory hash codes of the inner row arrays (e.g., `[[I@7a4f32, [I@2b8c91]`). Use `Arrays.deepToString(matrix)` to inspect nested values.
- **Uninitialized Jagged Rows:** When declaring `int[][] arr = new int[3][];`, the inner array references are initialized to `null`. Attempting `arr[0][0] = 5;` before executing `arr[0] = new int[2];` throws `NullPointerException`.
- **Shallow Comparison with `.equals()`:** Comparing two distinct array objects via `arr1.equals(arr2)` checks pointer reference equality, not element values. Always use `Arrays.equals()` or `Arrays.deepEquals()`.

---

## Practice

### Question
What is the return value of `Arrays.binarySearch(new int[]{10, 20, 30, 40}, 25)`?

### Explanation
1. The target value `25` is not present in the sorted array.
2. If `25` were inserted, it would be positioned at index 2 (between `20` at index 1 and `30` at index 2).
3. The binary search contract defines the return value for an absent key as `-(insertionPoint) - 1`.
4. With `insertionPoint = 2`, the calculation is `-(2) - 1 = -3`.
5. Return value: `-3`.
