---
id: topic-44
slug: method-references
topicNumber: 44
title: Method References
part: 'Part 1: Java Core'
sectionNumber: 11
sectionTitle: Functional Programming & Streams
versionBadge: Java 8+
difficulty: Intermediate
readingTime: 6 min read
shortDescription: >-
  Reference: The double-colon operator (::), four classifications of method references (static, bound, unbound, constructor/array), and disambiguation rules.
prerequisites:
  - 'Topic 43: Lambdas & Functional Interfaces'
---

## Overview
A method reference (using the `::` delimiter, introduced in Java 8) is a concise syntactic shorthand for referencing an existing method or constructor without evaluating it immediately. It replaces boilerplate lambdas that merely forward arguments to pre-existing methods.

---

## The Four Method Reference Classifications

```
                         Method Reference Kinds
 ┌──────────────────────────────────────────────────────────────────┐
 │ 1. Static:               Math::max        ──► (a, b) -> Math.max(a, b)
 ├──────────────────────────────────────────────────────────────────┤
 │ 2. Bound Instance:       out::println     ──► (x) -> out.println(x)
 ├──────────────────────────────────────────────────────────────────┤
 │ 3. Unbound Instance:     String::length   ──► (str) -> str.length()
 ├──────────────────────────────────────────────────────────────────┤
 │ 4. Constructor / Array:  ArrayList::new   ──► () -> new ArrayList<>()
 │                          String[]::new    ──► (n) -> new String[n]
 └──────────────────────────────────────────────────────────────────┘
```

| Classification | Syntax Pattern | Equivalent Lambda Expression | Semantic Mechanism |
| :--- | :--- | :--- | :--- |
| **Static** | `ClassName::staticMethod` | `(a, b) -> ClassName.staticMethod(a, b)` | Forwards all arguments to static method |
| **Bound Instance** | `existingInstance::method` | `(a) -> existingInstance.method(a)` | Receiver instance is captured at definition time |
| **Unbound Instance**| `ClassName::instanceMethod` | `(target, a) -> target.instanceMethod(a)` | First argument becomes the invocation receiver |
| **Constructor** | `ClassName::new` | `(a) -> new ClassName(a)` | Invokes matching constructor |
| **Array Constructor**| `Type[]::new` | `(size) -> new Type[size]` | Allocates array of specified capacity |

---

## Bound vs Unbound Instance Resolution

The key distinction lies in **how the receiver instance is identified**:

- **Bound:** The receiver object is already instantiated:
  ```java
  PrintStream ps = System.out;
  Consumer<String> printer = ps::println; // Bound to existing ps instance
  ```
- **Unbound:** The receiver object is supplied dynamically as the **first parameter** of the functional interface:
  ```java
  Function<String, Integer> lenFunc = String::length; // (s) -> s.length()
  BiPredicate<String, String> startsWith = String::startsWith; // (s1, s2) -> s1.startsWith(s2)
  ```

---

## Implementation Example

```java
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.function.Supplier;

public class MethodReferenceDemo {
    public static class Transaction {
        private final String id;
        private final double amount;

        public Transaction(String id, double amount) {
            this.id = id;
            this.amount = amount;
        }

        public String getId() { return id; }
        public double getAmount() { return amount; }

        public static boolean isHighValue(Transaction t) {
            return t.getAmount() >= 1000.0;
        }
    }

    public static void main(String[] args) {
        // 1. Constructor reference: Supplier
        Supplier<List<Transaction>> listFactory = ArrayList::new;
        List<Transaction> ledger = listFactory.get();
        ledger.add(new Transaction("TX-101", 450.0));
        ledger.add(new Transaction("TX-102", 2400.0));
        ledger.add(new Transaction("TX-103", 1150.0));

        // 2. Static method reference: Predicate
        ledger.removeIf(Transaction::isHighValue);

        // 3. Unbound instance method reference: Function (Transaction -> String)
        Function<Transaction, String> idExtractor = Transaction::getId;
        for (Transaction tx : ledger) {
            // 4. Bound instance method reference: Consumer (System.out::println)
            System.out.println("Remaining Low-Value ID: " + idExtractor.apply(tx));
        }

        // 5. Array constructor reference
        String[] ids = ledger.stream()
                .map(Transaction::getId)
                .toArray(String[]::new);
        System.out.println("Array allocated with length: " + ids.length);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Remaining Low-Value ID: TX-101
Array allocated with length: 1
```
</details>

---

## Pitfalls

- **Null Pointer at Binding Time in Bound References:** Writing `target.method` in a bound reference evaluates `target` immediately. If `target` is `null` at the point of assignment (`Consumer<String> c = myNullObj::action`), a `NullPointerException` is thrown immediately at declaration, not when `c.accept()` is invoked.
- **Overloaded Method Ambiguity:** If a class has `print(String)` and `print(Integer)`, writing `Consumer<Object> c = System.out::println;` triggers a compiler error because the compiler cannot resolve which overloaded method to bind.
- **Unbound vs Static Syntax Collision:** Both static and unbound references use `ClassName::method`. If a class declares a static method and an instance method with overlapping parameter shapes, compilation fails with `ambiguous method reference`.

---

## Practice

### Question
To which lambda expression is `BiFunction<String, Integer, String> func = String::substring;` equivalent?

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `String::substring` is an **unbound instance method reference**.
2. In unbound instance references, the first parameter of the functional interface becomes the receiver object on which the instance method is invoked.
3. The remaining parameters are forwarded as arguments to the method.
4. With `BiFunction<String, Integer, String>`, parameter 1 is `String` (the receiver target) and parameter 2 is `Integer` (the start index).
5. Equivalent lambda: `(str, index) -> str.substring(index)`.

</details>
