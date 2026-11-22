---
id: topic-40
slug: the-map-hierarchy
topicNumber: 40
title: The Map Hierarchy
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: Java 1.2+ / Java 8+ (Treeification)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Key-value associative mapping, HashMap bucket hashing & treeification mechanics (TREEIFY_THRESHOLD = 8), LinkedHashMap LRU caching, and TreeMap navigation.
prerequisites:
  - 'Topic 36: Generics Fundamentals'
  - 'Topic 39: The Set Hierarchy'
---

## Overview
The `java.util.Map<K, V>` interface defines an associative key-value mapping where keys must be unique. `HashMap` provides $O(1)$ average lookups through bucket arrays and treeification, `LinkedHashMap` provides insertion or access-order iteration (LRU caches), and `TreeMap` provides sorted key ranges in $O(\log N)$ time.

---

## `HashMap` Bucket Internals & Treeification

```
                      HashMap Internal Bucket Array
 ┌──────────────────────────────────────────────────────────────────┐
 │ Index 0: null                                                    │
 │ Index 1: Node(K1, V1) ──► Node(K2, V2)  [Linked List: Collisions]│
 │ Index 2: null                                                    │
 │ Index 3: TreeNode(Root)                 [Red-Black Tree: Collisions > 8]
 │          /          \                                            │
 │    TreeNode        TreeNode                                      │
 └──────────────────────────────────────────────────────────────────┘
```

- **Hashing:** `index = (n - 1) & (h ^ (h >>> 16))` distributes hash bits across capacity `n`.
- **`TREEIFY_THRESHOLD` (8):** When collisions within a single bucket exceed 8 and table capacity is $\ge 64$, the bucket linked list converts into a balanced Red-Black tree, improving worst-case lookup from $O(N)$ to $O(\log N)$.
- **`UNTREEIFY_THRESHOLD` (6):** When deletions or resizing reduce bucket size to 6, the tree converts back into a singly linked list.
- **`DEFAULT_LOAD_FACTOR` (0.75):** The hash table doubles capacity when `size >= capacity * loadFactor`.

---

## Modern Functional Methods (Java 8+)

| Method | Signature / Behavior | Primary Production Use Case |
| :--- | :--- | :--- |
| `computeIfAbsent(k, func)` | Computes value if key absent; stores and returns it | Dynamic cache initialization, grouping into lists |
| `computeIfPresent(k, biFunc)` | Recomputes value if key present; removes if result is `null` | Atomic counter increments, conditional updates |
| `merge(k, v, biFunc)` | Inserts `v` if absent; otherwise combines existing with `v` | Frequency maps, metric aggregation |
| `getOrDefault(k, defaultVal)` | Returns mapped value or fallback default | Safe configuration resolution without null checks |
| `putIfAbsent(k, v)` | Sets value only if currently absent or mapped to `null` | Lock reservation, idempotent initialization |

---

## Implementation Example: LRU Cache via `LinkedHashMap`

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapArchitectureDemo {
    // Fixed-size Least Recently Used (LRU) Cache
    public static class LruCache<K, V> extends LinkedHashMap<K, V> {
        private final int maxEntries;

        public LruCache(int maxEntries) {
            // initialCapacity, loadFactor, accessOrder (true: order by last accessed)
            super(maxEntries, 0.75f, true);
            this.maxEntries = maxEntries;
        }

        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > maxEntries; // Automatically evicts oldest when capacity breached
        }
    }

    public static void main(String[] args) {
        LruCache<String, String> sessionCache = new LruCache<>(3);
        sessionCache.put("sess-1", "user-alice");
        sessionCache.put("sess-2", "user-bob");
        sessionCache.put("sess-3", "user-charlie");

        // Access sess-1: moves it to the most-recently-used position
        sessionCache.get("sess-1");

        // Inserting 4th element evicts eldest entry ("sess-2")
        sessionCache.put("sess-4", "user-david");

        System.out.println("Surviving cache entries: " + sessionCache.keySet());

        // Functional Map Methods (Java 8+)
        Map<String, Integer> wordFrequencies = new java.util.HashMap<>();
        for (String word : new String[]{"apple", "banana", "apple", "orange", "apple"}) {
            wordFrequencies.merge(word, 1, Integer::sum);
        }
        System.out.println("Word Frequencies: " + wordFrequencies);
    }
}
```

### Execution Output:
```text
Surviving cache entries: [sess-3, sess-1, sess-4]
Word Frequencies: {orange=1, banana=1, apple=3}
```

---

## Pitfalls

- **Mutating Map Keys:** If a key's fields mutate after insertion into a `HashMap`, its `hashCode()` changes. Calling `map.get(key)` will search the wrong hash bucket and return `null`, leaking memory.
- **Thread-Unsafe HashMap in Concurrent Contexts:** Using standard `HashMap` in multi-threaded environments can corrupt bucket linked lists or produce infinite loops during table resizing. Use `ConcurrentHashMap` for thread-safe operations.
- **ConcurrentModificationException via `keySet()` Traversal:** Modifying a map directly while iterating over its `keySet()` or `entrySet()` throws `ConcurrentModificationException`. Use `Iterator.remove()` or `map.remove(k, v)`.

---

## Practice

### Question
Given the code below, what is the output?
```java
Map<String, List<String>> index = new HashMap<>();
index.computeIfAbsent("errors", k -> new ArrayList<>()).add("404");
index.computeIfAbsent("errors", k -> new ArrayList<>()).add("500");
System.out.println(index.get("errors"));
```

### Explanation
1. On the first call, the key `"errors"` is absent. The lambda `k -> new ArrayList<>()` initializes a new empty list, inserts it into the map, and returns it. `.add("404")` appends to this list.
2. On the second call, the key `"errors"` is present. `computeIfAbsent` does NOT invoke the lambda; it directly returns the existing list. `.add("500")` appends to that same list.
3. Output: `[404, 500]`.
