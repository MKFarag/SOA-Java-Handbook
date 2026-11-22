---
id: topic-36
slug: generics-fundamentals
topicNumber: 36
title: Generics Fundamentals
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: Java 5+ / Java 7+
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Compile-time type parameterization (<T>), diamond operator (<>), bounded type parameters (T extends Number), and JVM type erasure mechanics.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 26: Interfaces & Modern Interface Evolution'
---

## Overview
Generics (introduced in Java 5) provides compile-time type parameterization for classes, interfaces, and methods. It enforces type correctness at compile time, eliminating manual type casting and shifting runtime `ClassCastException` failures to immediate compilation errors.

---

## Syntax & Bounded Type Parameters

```java
// Generic Class with dual parameters
public class KeyValuePair<K, V> { ... }

// Generic Method with bounded type parameter
public static <T extends Comparable<T>> T findMax(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

### Standard Type Parameter Conventions

| Identifier | Convention | Common Context |
| :--- | :--- | :--- |
| `T` | Type | General classes and algorithms |
| `E` | Element | Java Collections Framework (`List<E>`, `Set<E>`) |
| `K`, `V` | Key, Value | Associative maps (`Map<K, V>`) |
| `N` | Number | Numeric calculations (`<N extends Number>`) |

- **Diamond Operator `<>` (Java 7+):** Enables the compiler to infer constructor generic parameters: `List<String> list = new ArrayList<>();`.
- **Bounded Parameters (`T extends Bound`):** Restricts `T` to a specific type or its subtypes, granting access to `Bound`'s methods within the generic body.

---

## JVM Type Erasure Mechanics

Java implements generics via **Type Erasure** for backward compatibility with pre-Java 5 bytecodes:

```
  Source Code (.java)                               Compiled Bytecode (.class)
 ┌──────────────────────────────────────┐          ┌──────────────────────────────────────┐
 │ List<String> list = new ArrayList<>();│          │ List list = new ArrayList();         │
 │ list.add("Alpha");                   │  ──────► │ list.add((Object) "Alpha");          │
 │ String s = list.get(0);              │          │ String s = (String) list.get(0);     │
 └──────────────────────────────────────┘          └──────────────────────────────────────┘
  * Type arguments (<String>) are erased. T is replaced by its upper bound (or Object).
  * The compiler automatically inserts synthetic checkcast bytecode instructions.
```

### Consequences of Type Erasure
1. **No Runtime Instance Checks:** `if (obj instanceof List<String>)` is illegal because generic type arguments do not exist at runtime (use unbounded wildcard `instanceof List<?>`).
2. **Cannot Instantiate Type Parameters:** `new T()` is illegal because `T`'s actual constructor is erased.
3. **Cannot Allocate Generic Arrays:** `new T[10]` is illegal because array types require reified runtime element types.
4. **Primitives Prohibited as Type Arguments:** `List<int>` is illegal; primitives cannot be erased to `Object`. Use boxed wrappers (`List<Integer>`).

---

## Implementation Example

```java
import java.util.Optional;

public class GenericCacheStore<K, V> {
    private final K key;
    private final V value;
    private final long timestampMs;

    public GenericCacheStore(K key, V value) {
        this.key = key;
        this.value = value;
        this.timestampMs = System.currentTimeMillis();
    }

    public K getKey() { return key; }
    public V getValue() { return value; }
    public long getTimestampMs() { return timestampMs; }

    // Generic method: bounded to Numbers for threshold evaluation
    public static <N extends Number & Comparable<N>> boolean exceedsThreshold(N val, N threshold) {
        return val.compareTo(threshold) > 0;
    }

    public static void main(String[] args) {
        GenericCacheStore<String, Integer> cache = new GenericCacheStore<>("metrics_port", 8080);
        System.out.printf("Cached [%s] -> %d%n", cache.getKey(), cache.getValue());

        boolean alert = GenericCacheStore.exceedsThreshold(95.5, 90.0);
        System.out.printf("Threshold breached: %b%n", alert);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Cached [metrics_port] -> 8080
Threshold breached: true
```
</details>

---

## Pitfalls

- **Using Raw Types:** Writing `List list = new ArrayList();` bypasses generic type safety, re-introducing unchecked runtime `ClassCastException` bugs.
- **Overloading Methods with Same Erasure:** Declaring `void process(List<String> l)` and `void process(List<Integer> l)` in the same class fails compilation because both methods erase to `void process(List l)`.
- **Static Context Type Parameter Access:** Static fields or methods cannot reference type parameters declared on the enclosing class (`private static T instance;` is illegal) because the class is shared across all generic instances.
- **Generic Array Creation Workaround:** When implementing generic array-backed structures (like `ArrayList`), allocate an `Object[]` and cast internally: `(T[]) new Object[capacity];`.

---

## Practice

### Question
Why does the following method fail compilation?
```java
public class Factory<T> {
    public T createInstance() {
        return new T();
    }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. Under JVM Type Erasure, `T` is erased to `Object` at compile time.
2. The runtime has no knowledge of what class `T` represents, what constructors it possesses, or what memory space to allocate.
3. Compiling `new T()` triggers compiler error: `unexpected type, found: type parameter: T`.
4. Solution: Pass a class token: `Class<T> clazz` and invoke `clazz.getDeclaredConstructor().newInstance()`.

</details>
