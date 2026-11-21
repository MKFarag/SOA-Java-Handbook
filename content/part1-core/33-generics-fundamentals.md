---
id: topic-33
slug: generics-fundamentals
topicNumber: 33
title: Generics Fundamentals
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: 'Java 5+ (Diamond: Java 7)'
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master compile-time type safety with generic classes, methods, bounded type
  parameters, and type erasure mechanics.
prerequisites:
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 23: Interfaces & Modern Interface Evolution'
relevanceLevel: MUST-KNOW / CORE
---
# Generics Fundamentals

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

### 1. What It Is and Why It Exists
Before Java 5, collections stored raw `Object` references. When you placed an integer or string into a list, Java treated it as a generic `Object`. When extracting that element, you had to manually cast it back to its specific type. If an unexpected type entered the collection, your code crashed at runtime with a `ClassCastException`.

**Generics** introduces compile-time type parameterization. It allows classes, interfaces, and methods to operate on specified types while retaining full type safety. The compiler verifies that only values of the designated type enter your structures, eliminating manual casting and shifting type errors from unpredictable runtime crashes to immediate compile-time errors.

**Real-World Analogy:**
Imagine shipping containers. Without labeling or compartmentalization, workers throw liquid chemicals, fragile electronics, and raw fruits into the same unlabeled metal container. When unloading, a worker blindly reaches in and assumes they grabbed an apple, only to pull out hazardous acid. Generics is like stamping a shipping container as `Container<Apples>`. The loading dock inspector (the Java compiler) refuses to allow anything other than apples inside, guaranteeing that anyone opening the container retrieves an apple with complete safety.

---

### 2. Prerequisites
Before studying Generics Fundamentals, you should understand:
- [Topic 16: Classes, Objects & Memory Layout](#topic-16) — How classes define reference types and object blueprints.
- [Topic 23: Interfaces & Modern Interface Evolution](#topic-23) — How interface contracts define polymorphic capabilities.

---

### 3. Syntax Breakdown
Generics relies on angle brackets (`< >`) containing formal type parameters:

```
public class ClassName<T> { ... }
public class Pair<K, V> { ... }
public <T extends Comparable<T>> T methodName(T arg) { ... }
```

- `<T>`: Type parameter declaration. By convention, standard single-letter identifiers are used:
  - `T`: Type
  - `E`: Element (used heavily by the Java Collections Framework)
  - `K`: Key
  - `V`: Value
  - `N`: Number
- `<>` (Diamond Operator, introduced in Java 7): Allows the compiler to infer the type arguments during instantiation (`new ArrayList<>()`) instead of repeating the type (`new ArrayList<String>()`).
- `<T extends Bound>`: A bounded type parameter. Restricts `T` to be either `Bound` or a subtype/implementer of `Bound`.
- **Type Erasure**: The JVM itself does not retain generic type parameters at runtime. The compiler checks types during compilation and replaces `T` with its upper bound (or `Object` if unbounded) and inserts synthetic type casts.

---

### 4. Runnable Examples

#### Example 1: Basic Generic Class and Bounded Method
This example illustrates a custom generic pair and a bounded generic comparison method.

```java
/**
 * Topic 33: Generics Fundamentals - Basic Example
 * Demonstrates generic classes, bounded type parameters, and generic methods.
 */
public class GenericsFundamentalsDemo {

    // Generic class with type parameter T
    public static class KeyValuePair<K, V> {
        private final K key;
        private final V value;

        public KeyValuePair(K key, V value) {
            this.key = key;
            this.value = value;
        }

        public K getKey() {
            return key;
        }

        public V getValue() {
            return value;
        }

        @Override
        public String toString() {
            return "[" + key + " => " + value + "]";
        }
    }

    // Generic method with bounded type parameter <T extends Comparable<T>>
    public static <T extends Comparable<T>> T findMax(T first, T second) {
        return first.compareTo(second) >= 0 ? first : second;
    }

    public static void main(String[] args) {
        // Type inference in generic instantiation (diamond operator <>)
        KeyValuePair<String, Integer> portMapping = new KeyValuePair<>("http-port", 8080);
        KeyValuePair<Long, String> userSession = new KeyValuePair<>(1001L, "ACTIVE_TOKEN_99");

        System.out.println("Pair 1: " + portMapping);
        System.out.println("Pair 2: " + userSession);

        // Bounded generic method calls
        Integer maxInt = findMax(45, 92);
        String maxStr = findMax("Database", "Application");

        System.out.println("Max Integer: " + maxInt);
        System.out.println("Max String: " + maxStr);
    }
}
```

**Expected Output:**
```
Pair 1: [http-port => 8080]
Pair 2: [1001 => ACTIVE_TOKEN_99]
Max Integer: 92
Max String: Database
```

---

#### Example 2: Realistic Application — Generic Data Repository
In real-world software, developers use generic repositories to enforce type safety across diverse domain entities without duplicating CRUD methods.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Topic 33: Generics Fundamentals - Realistic Application
 * Demonstrates a generic repository architecture enforcing compile-time type safety.
 */
public class TypeSafeRepositoryApp {

    public interface Identifiable<ID> {
        ID getId();
    }

    public static class Repository<T extends Identifiable<ID>, ID> {
        private final List<T> storage = new ArrayList<>();

        public void save(T entity) {
            storage.removeIf(item -> item.getId().equals(entity.getId()));
            storage.add(entity);
        }

        public Optional<T> findById(ID id) {
            for (T item : storage) {
                if (item.getId().equals(id)) {
                    return Optional.of(item);
                }
            }
            return Optional.empty();
        }

        public List<T> findAll() {
            return new ArrayList<>(storage);
        }

        public int count() {
            return storage.size();
        }
    }

    public static class CustomerAccount implements Identifiable<Long> {
        private final Long accountId;
        private final String customerName;
        private final double balance;

        public CustomerAccount(Long accountId, String customerName, double balance) {
            this.accountId = accountId;
            this.customerName = customerName;
            this.balance = balance;
        }

        @Override
        public Long getId() {
            return accountId;
        }

        public String getCustomerName() {
            return customerName;
        }

        public double getBalance() {
            return balance;
        }

        @Override
        public String toString() {
            return "Customer[id=" + accountId + ", name=" + customerName + ", balance=$" + String.format("%.2f", balance) + "]";
        }
    }

    public static void main(String[] args) {
        Repository<CustomerAccount, Long> accountRepo = new Repository<>();

        accountRepo.save(new CustomerAccount(101L, "Alice Morgan", 1450.50));
        accountRepo.save(new CustomerAccount(102L, "David Chen", 3200.75));

        System.out.println("Repository Count: " + accountRepo.count());

        Optional<CustomerAccount> found = accountRepo.findById(101L);
        found.ifPresent(account -> System.out.println("Retrieved Account: " + account));

        Optional<CustomerAccount> missing = accountRepo.findById(999L);
        System.out.println("Missing Account Found: " + missing.isPresent());
    }
}
```

**Expected Output:**
```
Repository Count: 2
Retrieved Account: Customer[id=101, name=Alice Morgan, balance=$1450.50]
Missing Account Found: false
```

---

### 5. Step-by-Step Execution Trace
1. **Instantiation**: `new Repository<CustomerAccount, Long>()` binds `T` to `CustomerAccount` and `ID` to `Long`.
2. **Compile-Time Checking**: When calling `accountRepo.save(...)`, the compiler inspects the argument. If an incompatible type (such as a `String` or `Integer`) is passed, compilation fails immediately.
3. **Type Erasure in Bytecode**: In the compiled class file, `Repository` stores `Identifiable` elements. The JVM executes identical bytecode regardless of whether the repository holds `CustomerAccount` or another entity.
4. **Synthetic Cast Generation**: When `accountRepo.findById(101L)` returns `Optional<CustomerAccount>`, the compiler transparently inserts a cast `(CustomerAccount)` upon extraction.

---

### 6. Common Mistakes and Compiler Errors
- **Attempting to Instantiate Generic Arrays**:
  ```java
  // COMPILER ERROR: generic array creation
  T[] array = new T[10];
  ```
  *Solution*: Due to type erasure, the JVM does not know the exact runtime component type of `T`. Use `List<T>` or pass `Class<T>` to `Array.newInstance(clazz, size)`.
- **Using Primitive Types as Generic Arguments**:
  ```java
  // COMPILER ERROR: unexpected type, found int, required reference
  List<int> numbers = new ArrayList<>();
  ```
  *Solution*: Generics require reference types. Use the boxed wrapper `List<Integer>`.
- **Using `instanceof` with Parameterized Types**:
  ```java
  // COMPILER ERROR: illegal generic type for instanceof
  if (obj instanceof List<String>) { ... }
  ```
  *Solution*: Because of type erasure, test against the unbounded wildcard `obj instanceof List<?>`.

---

### 7. Best Practices and When NOT to Use
- **Do use the Diamond Operator (`<>`)**: Let the compiler infer type arguments rather than repeating lengthy generic declarations.
- **Do use bounded type parameters (`<T extends Comparable<T>>`)**: When your generic logic depends on specific methods defined by an interface or base class.
- **Do NOT use raw types**: Never declare raw collections like `List list = new ArrayList()`. Raw types disable compile-time type safety and trigger unchecked warnings.
- **Do NOT over-parameterize simple classes**: If a class only ever works with one concrete type, adding generic parameters adds needless cognitive complexity.

---

### 8. Version Notes
- **Java 5 (JSR 14)**: Generics introduced to the language, including type parameters, bounded parameters, and type erasure.
- **Java 7 (Project Coin / JSR 334)**: Introduced the diamond operator (`<>`) for type inference in generic instance creation.
- **Java 10 (JEP 286)**: Local variable type inference (`var`) works seamlessly with generic types (`var list = new ArrayList<String>()`).

---

### 9. Summary Cheat Sheet
| Syntax / Concept | Meaning | Example |
| :--- | :--- | :--- |
| `class Box<T>` | Generic class with type parameter `T` | `Box<String> box = new Box<>();` |
| `<T extends Number>` | Bounded type parameter (must inherit from Number) | `class Metric<T extends Number>` |
| `<>` | Diamond operator (compiler infers argument) | `Map<String, Integer> m = new HashMap<>();` |
| Type Erasure | Generic info discarded at bytecode level | `T` replaced with upper bound or `Object` |
| Raw Type | Generic class used without type argument (avoid) | `List raw = new ArrayList();` |

---

### 10. Exercises and Solutions

<details>
<summary>Exercise 1: Create a generic <code>SingleSlotBuffer&lt;T&gt;</code></summary>

Write a generic class `SingleSlotBuffer<T>` with methods `void put(T item)`, `T get()`, and `boolean isEmpty()`.

**Solution:**
```java
public class SingleSlotBuffer<T> {
    private T item;

    public void put(T item) {
        this.item = item;
    }

    public T get() {
        T temp = this.item;
        this.item = null;
        return temp;
    }

    public boolean isEmpty() {
        return this.item == null;
    }
}
```
</details>

<details>
<summary>Exercise 2: Write a bounded generic method finding the minimum element in an array</summary>

Write a static method `<T extends Comparable<T>> T findMin(T[] array)` that scans the array and returns the smallest element.

**Solution:**
```java
public static <T extends Comparable<T>> T findMin(T[] array) {
    if (array == null || array.length == 0) return null;
    T min = array[0];
    for (int i = 1; i < array.length; i++) {
        if (array[i].compareTo(min) < 0) {
            min = array[i];
        }
    }
    return min;
}
```
</details>

<details>
<summary>Exercise 3: Explain why <code>new T()</code> fails to compile inside a generic class</summary>

**Solution:**
Because of **type erasure**, the Java compiler replaces `T` with its upper bound (`Object`) at compile time. At runtime, the JVM has no record of what concrete class `T` was instantiated with, making direct constructor invocation impossible. To construct an instance of `T`, you must provide a `Class<T>` token or a `Supplier<T>` factory.
</details>

---

### 11. Official Sources and References
- [Oracle Java Documentation — Generics Tutorial](https://docs.oracle.com/javase/tutorial/extra/generics/index.html)
- [JSR 14: Add Generic Types To The Java Programming Language](https://jcp.org/en/jsr/detail?id=14)
- [The Java Language Specification — Chapter 4: Types, Values, and Variables](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.4)
