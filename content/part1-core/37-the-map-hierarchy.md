---
id: topic-37
slug: the-map-hierarchy
topicNumber: 37
title: The Map Hierarchy
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: 'Java 1.2+ (Treeification: Java 8)'
difficulty: Intermediate
readingTime: 13 min read
shortDescription: >-
  Master key-value storage: HashMap buckets & treeification threshold,
  LinkedHashMap LRU caching, TreeMap sorting, and Java 8 functional map methods.
prerequisites:
  - 'Topic 33: Generics Fundamentals'
  - 'Topic 36: The Set Hierarchy'
relevanceLevel: MUST-KNOW / CORE
---
# The Map Hierarchy

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

### 1. What It Is and Why It Exists
In software design, data is rarely isolated. Most information exists as associative pairs: an employee ID maps to an employee record, a product SKU maps to inventory count, or a configuration key maps to a system setting. If you stored these in parallel lists, finding a value by its key would require searching the keys array sequentially ($O(n)$) and reading the corresponding value index.

The `java.util.Map<K, V>` interface defines a mapping between unique **keys** and **values**. A map cannot contain duplicate keys; each key maps to at most one value. The Map hierarchy provides data structures that retrieve values in $O(1)$ constant time or maintain keys in strictly sorted order.

**Real-World Analogy:**
Think of a post office with private mailboxes. Each mailbox has a unique brass key number (the Key), and inside is the mail (the Value). When a resident arrives with their key number, the postal clerk does not inspect all 10,000 mailboxes in the building; the clerk uses an index card formula (`hashCode`) to walk directly to the exact mailbox in five seconds flat ($O(1)$).

---

### 2. Prerequisites
Before studying the Map Hierarchy, you should understand:
- [Topic 33: Generics Fundamentals](file:///c:/Users/modym/OneDrive/Desktop/Java-Doc/content/part1-core/33-generics-fundamentals.md) — How type parameters `<K, V>` enforce key-value type safety.
- [Topic 36: The Set Hierarchy](file:///c:/Users/modym/OneDrive/Desktop/Java-Doc/content/part1-core/36-the-set-hierarchy.md) — How hashing and bucket indexing operate.

---

### 3. Syntax Breakdown
The primary Map implementations in Java include:

```
Map<String, Integer> hashMap = new HashMap<>();
Map<String, String> linkedHashMap = new LinkedHashMap<>();
NavigableMap<Integer, String> treeMap = new TreeMap<>();
```

- `HashMap<K, V>`:
  - Uses an array of buckets (`Node<K, V>[] table`).
  - Keys are hashed via `key.hashCode()`. In Java 8+, if a single bucket suffers excessive collisions (greater than 8 nodes), that bucket transforms into a balanced Red-Black tree (`TreeNode`), preventing worst-case $O(n)$ degradation into $O(\log n)$ (treeification threshold).
  - Average time complexity: $O(1)$ for `get()`, `put()`, and `remove()`.
- `LinkedHashMap<K, V>`:
  - Maintains a doubly-linked list through all its entries.
  - Can order entries by **insertion order** (default) or **access order** (used to build LRU caches via `removeEldestEntry`).
- `TreeMap<K, V>`:
  - Implements `NavigableMap<K, V>`, backed by a Red-Black tree.
  - Keys are sorted according to natural ordering (`Comparable`) or an explicit `Comparator`.
  - Operations take guaranteed $O(\log n)$ time.
- Modern Map Methods (Java 8+):
  - `getOrDefault(key, defaultValue)`: Returns default if key is not mapped.
  - `putIfAbsent(key, value)`: Inserts value only if key is unmapped.
  - `computeIfAbsent(key, k -> initValue)`: Lazy initialization pattern.
  - `computeIfPresent(key, (k, v) -> newValue)`: Atomically updates mapped value.

---

### 4. Runnable Examples

#### Example 1: Comparing Map Implementations & Modern Methods
This example demonstrates `HashMap`, `LinkedHashMap`, `TreeMap`, and Java 8 functional map methods.

```java
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

/**
 * Topic 37: The Map Hierarchy - Basic Example
 * Demonstrates HashMap, LinkedHashMap, and TreeMap features and modern Map methods.
 */
public class MapHierarchyDemo {

    public static void main(String[] args) {
        // 1. HashMap: O(1) average lookup, key hash-bucket storage
        Map<String, Integer> inventory = new HashMap<>();
        inventory.put("Laptops", 15);
        inventory.put("Monitors", 28);

        // Modern Map methods (Java 8+)
        inventory.putIfAbsent("Keyboards", 50);
        inventory.computeIfPresent("Laptops", (k, v) -> v + 5);
        int miceCount = inventory.getOrDefault("Mice", 0);

        System.out.println("HashMap Laptops: " + inventory.get("Laptops"));
        System.out.println("HashMap Mice (default): " + miceCount);

        // 2. LinkedHashMap: preserves insertion order
        Map<String, String> orderedConfig = new LinkedHashMap<>();
        orderedConfig.put("env", "production");
        orderedConfig.put("port", "8443");
        orderedConfig.put("ssl", "true");
        System.out.println("LinkedHashMap Keys: " + orderedConfig.keySet());

        // 3. TreeMap: NavigableMap sorted by key natural order
        NavigableMap<Integer, String> errorCodeMap = new TreeMap<>();
        errorCodeMap.put(500, "Internal Server Error");
        errorCodeMap.put(404, "Not Found");
        errorCodeMap.put(400, "Bad Request");
        errorCodeMap.put(403, "Forbidden");

        System.out.println("TreeMap Lowest Code: " + errorCodeMap.firstKey());
        System.out.println("TreeMap Client Errors (< 500): " + errorCodeMap.headMap(500).keySet());
    }
}
```

**Expected Output:**
```
HashMap Laptops: 20
HashMap Mice (default): 0
LinkedHashMap Keys: [env, port, ssl]
TreeMap Lowest Code: 400
TreeMap Client Errors (< 500): [400, 403, 404]
```

---

#### Example 2: Realistic Application — Production-Grade LRU Cache
In server-side caching systems, an in-memory Least Recently Used (LRU) cache maintains a bounded size by evicting items that have not been read or written recently.

```java
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Topic 37: The Map Hierarchy - Realistic Application
 * Demonstrates a production-style Least Recently Used (LRU) Cache using LinkedHashMap.
 */
public class InMemoryCacheServiceApp {

    public static class LruCache<K, V> extends LinkedHashMap<K, V> {
        private final int maxCapacity;

        public LruCache(int maxCapacity) {
            // initialCapacity, loadFactor, accessOrder = true (LRU behavior)
            super(maxCapacity, 0.75f, true);
            this.maxCapacity = maxCapacity;
        }

        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > maxCapacity;
        }
    }

    public static void main(String[] args) {
        // Cache with max capacity of 3 items
        LruCache<String, String> sessionCache = new LruCache<>(3);

        sessionCache.put("session_1", "User_Alice");
        sessionCache.put("session_2", "User_Bob");
        sessionCache.put("session_3", "User_Charlie");

        System.out.println("Initial Cache Keys: " + sessionCache.keySet());

        // Access session_1 to mark it as recently used
        sessionCache.get("session_1");

        // Inserting session_4 causes eviction of the least recently used element (session_2)
        sessionCache.put("session_4", "User_Diana");

        System.out.println("Cache Keys after Eviction: " + sessionCache.keySet());
        System.out.println("Is session_2 retained? " + sessionCache.containsKey("session_2"));
        System.out.println("Is session_1 retained? " + sessionCache.containsKey("session_1"));
    }
}
```

**Expected Output:**
```
Initial Cache Keys: [session_1, session_2, session_3]
Cache Keys after Eviction: [session_3, session_1, session_4]
Is session_2 retained? false
Is session_1 retained? true
```

---

### 5. Step-by-Step Execution Trace
1. **Hashing & Table Indexing**: In `HashMap`, `put("Laptops", 15)` calls `hash = key.hashCode() ^ (hash >>> 16)`. The index in `table[]` is computed as `(n - 1) & hash`.
2. **Dynamic Treeification**: If multiple distinct keys hash to the same bucket index, they form a linked list. Once the chain reaches length 8 and capacity reaches 64, Java converts that chain into a Red-Black tree, guaranteeing worst-case performance does not degrade to $O(n)$ during HashDoS security attacks.
3. **LRU Access Tracking**: In `LruCache`, `accessOrder = true` alters `get("session_1")` so that after returning the value, it moves the accessed node to the tail of the internal doubly-linked list.
4. **Automatic Eviction**: During `put("session_4", ...)`, `LinkedHashMap` invokes `removeEldestEntry()`. Because the size is now 4 (exceeding the limit 3), it removes the head node (`session_2`).

---

### 6. Common Mistakes and Compiler Errors
- **Using Mutable Objects as Map Keys**:
  If you use a custom object as a Map key and then modify a field that affects its `hashCode()`, the Map will search the wrong bucket on subsequent lookups, making the value permanently unreachable (`get()` returns `null`).
- **Iterating and Mutating Simultaneously**:
  Mutating a `HashMap` while iterating over `keySet()` or `entrySet()` throws `ConcurrentModificationException`. Use `Iterator.remove()` or `Map.removeIf()`.
- **Assuming `HashMap` preserves insertion order**:
  `HashMap` makes zero guarantees about order. If insertion order is required, use `LinkedHashMap`.

---

### 7. Best Practices and When NOT to Use
- **Always make keys immutable**: Use `String`, boxed primitives (`Integer`, `Long`), or Java 16 `record` classes as map keys.
- **Set initial capacity when sizing is known**: If you plan to store 10,000 items, initialize with `new HashMap<>((int) (10000 / 0.75f) + 1)` to prevent repeated table resizing and rehashing.
- **Use `computeIfAbsent()` for grouping**: When grouping items into a `Map<String, List<Item>>`, replace verbose null checks with `map.computeIfAbsent(key, k -> new ArrayList<>()).add(item)`.
- **Do NOT use `Hashtable`**: `java.util.Hashtable` is an obsolete legacy class with heavy synchronization bottlenecks. For thread-safe concurrency, use `java.util.concurrent.ConcurrentHashMap`.

---

### 8. Version Notes
- **Java 1.2**: JCF introduced `Map`, `HashMap`, and `TreeMap`.
- **Java 1.4**: Introduced `LinkedHashMap`.
- **Java 8 (JEP 180)**: Treeification of `HashMap` buckets (converting linked lists to Red-Black trees when collision count exceeds 8). Added functional methods `compute`, `merge`, `putIfAbsent`.
- **Java 9 (JEP 269)**: Introduced immutable factory methods `Map.of(...)` and `Map.ofEntries(...)`.

---

### 9. Summary Cheat Sheet
| Map Implementation | Key Data Structure | Search Complexity | Key Ordering | Null Keys Allowed |
| :--- | :--- | :--- | :--- | :--- |
| `HashMap` | Hash table (array + treeified bins) | $O(1)$ average | None | Yes (1 null key) |
| `LinkedHashMap` | Hash table + Doubly-linked list | $O(1)$ average | Insertion or Access order | Yes (1 null key) |
| `TreeMap` | Red-Black Tree | $O(\log n)$ | Natural or Custom sort | No |
| `ConcurrentHashMap` | Striped bin CAS + synchronized | $O(1)$ average | None | No (null forbidden) |

---

### 10. Exercises and Solutions

<details>
<summary>Exercise 1: Word frequency counter</summary>

Write a method `Map<String, Integer> countWordFrequencies(List<String> words)` that returns a map containing the frequency of each word using modern Java 8+ Map methods.

**Solution:**
```java
public static Map<String, Integer> countWordFrequencies(List<String> words) {
    Map<String, Integer> counts = new HashMap<>();
    for (String word : words) {
        counts.merge(word, 1, Integer::sum);
    }
    return counts;
}
```
</details>

<details>
<summary>Exercise 2: Group employees by department</summary>

Write a method that groups a list of `Employee` objects by their department name into a `Map<String, List<Employee>>`.

**Solution:**
```java
public record Employee(String name, String department) {}

public static Map<String, List<Employee>> groupByDepartment(List<Employee> employees) {
    Map<String, List<Employee>> grouped = new HashMap<>();
    for (Employee emp : employees) {
        grouped.computeIfAbsent(emp.department(), k -> new ArrayList<>()).add(emp);
    }
    return grouped;
}
```
</details>

<details>
<summary>Exercise 3: Explain why <code>ConcurrentHashMap</code> forbids <code>null</code> keys and values</summary>

**Solution:**
In a single-threaded `HashMap`, `map.get(key) == null` can mean either "the key was not found" or "the key was found and maps to `null`". You can disambiguate using `map.containsKey(key)`. However, in a multithreaded concurrent environment, calling `get()` followed by `containsKey()` is not atomic: another thread could delete or insert the key between the two calls. To eliminate this concurrency ambiguity, `ConcurrentHashMap` strictly prohibits `null` keys and values.
</details>

---

### 11. Official Sources and References
- [Oracle Java Documentation — The Map Interface](https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html)
- [Java SE 21 API Specification — java.util.Map](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html)
- [JEP 180: Handle Frequent HashMap Collisions with Balanced Trees](https://openjdk.org/jeps/180)
