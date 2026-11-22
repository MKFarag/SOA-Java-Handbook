---
id: topic-39
slug: the-set-hierarchy
topicNumber: 39
title: The Set Hierarchy
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: Java 1.2+ / Java 6+ (NavigableSet)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Mathematical set uniqueness (no duplicates), HashSet hash bucket internals, LinkedHashSet doubly-linked iteration, and TreeSet Red-Black tree range navigation.
prerequisites:
  - 'Topic 36: Generics Fundamentals'
  - 'Topic 38: The List Hierarchy'
---

## Overview
The `java.util.Set<E>` interface represents a collection enforcing mathematical set uniqueness: duplicate elements are forbidden. In Java, standard sets are backed by their corresponding Map architectures, relying on `hashCode()` and `equals()` for hash-based sets, or `Comparable`/`Comparator` for tree-based ordered sets.

---

## Set Implementation Comparison Matrix

```
       HashSet Internals (Backed by HashMap)          TreeSet Internals (Red-Black Tree)
 ┌──────────────────────────────────────────────┐    ┌──────────────────────────────────┐
 │ Hash Table Array: [Bucket 0] -> Node(E, PRESENT) │    │           [Root: 50]             │
 │                   [Bucket 1] -> null         │    │          /          \            │
 │                   [Bucket 2] -> Node(E, PRESENT) │    │     [Node: 20]   [Node: 80]      │
 └──────────────────────────────────────────────┘    └──────────────────────────────────┘
  * PRESENT is a shared static dummy Object.          * Self-balancing Binary Search Tree
```

| Dimension | `HashSet<E>` | `LinkedHashSet<E>` | `TreeSet<E>` |
| :--- | :--- | :--- | :--- |
| **Ordering** | None (unordered, shifts on rehash) | Deterministic **Insertion Order** | Sorted (**Natural** or `Comparator`) |
| **Time Complexity** | $O(1)$ average | $O(1)$ average | **$O(\log N)$** guaranteed |
| **Underlying Structure** | Hash Table array | Hash Table + Doubly Linked List | Red-Black Balanced Binary Tree |
| **Null Elements** | Allows at most 1 `null` | Allows at most 1 `null` | **Forbidden** (throws `NullPointerException`) |
| **Uniqueness Check** | `hashCode()` then `equals()` | `hashCode()` then `equals()` | **`compareTo()` or `compare() == 0`** |

---

## `NavigableSet` Range Operations (`TreeSet`)

`TreeSet` implements `NavigableSet<E>`, enabling proximity and boundary queries:

| Method | Return | Description |
| :--- | :--- | :--- |
| `floor(e)` | `E` | Greatest element $\le e$, or `null` if none |
| `ceiling(e)` | `E` | Least element $\ge e$, or `null` if none |
| `lower(e)` / `higher(e)` | `E` | Strict inequalities ($< e$ / $> e$) |
| `subSet(from, to)` | `NavigableSet<E>` | Sub-range view between boundaries |
| `descendingSet()` | `NavigableSet<E>` | Reverse-order view of elements |

---

## Implementation Example

```java
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.NavigableSet;
import java.util.Set;
import java.util.TreeSet;

public class SetHierarchyDemo {
    public static void main(String[] args) {
        // 1. LinkedHashSet: Deduplication preserving insertion order
        Set<String> ipRegistry = new LinkedHashSet<>();
        ipRegistry.add("192.168.1.50");
        ipRegistry.add("10.0.0.1");
        ipRegistry.add("192.168.1.50"); // Duplicate: rejected
        ipRegistry.add("172.16.0.4");
        System.out.println("Insertion-Ordered IPs: " + ipRegistry);

        // 2. TreeSet: Navigable boundary lookups
        NavigableSet<Integer> latencyThresholds = new TreeSet<>(Set.of(50, 100, 250, 500, 1000));
        int observedLatency = 185;

        System.out.printf("Ceiling for %dms: %dms%n", observedLatency, latencyThresholds.ceiling(observedLatency));
        System.out.printf("Floor for %dms  : %dms%n", observedLatency, latencyThresholds.floor(observedLatency));
        System.out.printf("Range [100, 500]: %s%n", latencyThresholds.subSet(100, true, 500, true));
    }
}
```

### Execution Output:
```text
Insertion-Ordered IPs: [192.168.1.50, 10.0.0.1, 172.16.0.4]
Ceiling for 185ms: 250ms
Floor for 185ms  : 100ms
Range [100, 500]: [100, 250, 500]
```

---

## Pitfalls

- **Mutating Hash-Code Fields After Insertion:** Mutating an object after inserting it into a `HashSet` alters its `hashCode()`. When `contains()` is subsequently called, the set searches the wrong hash bucket, reporting the element as missing and leaking memory. Set elements must be immutable.
- **TreeSet Ignoring `.equals()`:** `TreeSet` determines duplicate equivalence strictly using `compareTo()` (or `compare()`). If `a.compareTo(b) == 0`, `b` will NOT be added to the `TreeSet`, even if `!a.equals(b)`.
- **Failing `Comparable` Implementation:** Adding objects that do not implement `Comparable` to a `TreeSet` (without supplying an explicit `Comparator`) throws runtime `ClassCastException`.
- **Missing `hashCode()` When Overriding `equals()`:** If two objects evaluate to equal via `equals()` but produce different `hashCode()` values, a `HashSet` will place them into different buckets, storing duplicates.

---

## Practice

### Question
Given the class below, how many elements are present in `set` after the code executes?
```java
class Node implements Comparable<Node> {
    int id;
    String name;
    Node(int id, String name) { this.id = id; this.name = name; }
    public int compareTo(Node o) { return Integer.compare(this.id, o.id); }
}

Set<Node> set = new TreeSet<>();
set.add(new Node(1, "Alpha"));
set.add(new Node(1, "Beta"));
```

### Explanation
1. `TreeSet` determines element equality using `compareTo()`, NOT `equals()`.
2. When adding the second `Node(1, "Beta")`, `compareTo` compares `id = 1` with the existing `id = 1`, yielding `0`.
3. Because `compareTo` returns `0`, `TreeSet` considers the second node a duplicate of the first and discards it.
4. Total elements in `set`: **1**.
