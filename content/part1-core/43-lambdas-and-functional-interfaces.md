---
id: topic-43
slug: lambdas-and-functional-interfaces
topicNumber: 43
title: Lambdas & Functional Interfaces
part: 'Part 1: Java Core'
sectionNumber: 11
sectionTitle: Functional Programming & Streams
versionBadge: Java 8+ / Java 11+ (var in lambdas)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Anonymous function syntax (->), Single Abstract Method (SAM) contracts, @FunctionalInterface, invokedynamic bytecode execution, and java.util.function taxonomy.
prerequisites:
  - 'Topic 26: Interfaces & Modern Interface Evolution'
  - 'Topic 27: Nested, Inner & Anonymous Classes'
---

## Overview
A lambda expression is an anonymous function that implements a Single Abstract Method (SAM) interface without generating a separate `.class` file or instantiating an anonymous inner class. The JVM resolves lambdas dynamically at runtime via the `invokedynamic` instruction and `java.lang.invoke.LambdaMetafactory`.

---

## Syntax & Target Typing

```
 (param1, param2) -> expression
 (param1, param2) -> { statements; return result; }
  param           -> expression  (parentheses optional for single untyped parameter)
```

The compiler determines parameter and return types through **target typing**: the lambda expression must conform to the single abstract method of the receiving interface annotated with `@FunctionalInterface`.

### JVM Bytecode Mechanics: `invokedynamic`

Unlike anonymous classes which generate a new synthetic class (`Outer$1.class`) and allocate a new object on every invocation, the compiler generates a private synthetic method for the lambda body and links it at runtime using `invokedynamic`. If the lambda does not capture local variables (non-capturing lambda), the runtime caches and reuses a single singleton instance.

---

## The Core `java.util.function` Taxonomy

| Interface Family | Method Signature | Architectural Role | Common Variants |
| :--- | :--- | :--- | :--- |
| **`Predicate<T>`** | `boolean test(T t)` | Filtering, conditional evaluation | `BiPredicate<T, U>`, `IntPredicate` |
| **`Function<T, R>`**| `R apply(T t)` | Data transformation and mapping | `BiFunction<T, U, R>`, `UnaryOperator<T>` |
| **`Consumer<T>`** | `void accept(T t)` | Side effects (logging, printing, sinks) | `BiConsumer<T, U>`, `DoubleConsumer` |
| **`Supplier<T>`** | `T get()` | Lazy instantiation, factory production | `BooleanSupplier`, `LongSupplier` |

---

## Lexical Scoping & Variable Capture

Unlike anonymous inner classes (which introduce a new scope where `this` refers to the anonymous class instance), lambdas are **lexically scoped**:
- `this` inside a lambda refers to the enclosing class instance.
- Captured local variables must be **`final` or effectively final**.

---

## Implementation Example

```java
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public class LambdaTaxonomyDemo {
    public static <T, R> List<R> processPipeline(
            List<T> items,
            Predicate<T> filterCondition,
            Function<T, R> mapper,
            Consumer<R> sideEffectSink) {

        List<R> results = new ArrayList<>();
        for (T item : items) {
            if (filterCondition.test(item)) {
                R transformed = mapper.apply(item);
                sideEffectSink.accept(transformed);
                results.add(transformed);
            }
        }
        return results;
    }

    public static void main(String[] args) {
        List<String> rawLogLines = List.of(
            "INFO: User logged in",
            "WARN: Memory pressure detected",
            "ERROR: DB connection timeout",
            "INFO: Cache flushed"
        );

        // Composing predicates and functions
        Predicate<String> isHighSeverity = line -> line.startsWith("WARN") || line.startsWith("ERROR");
        Function<String, String> formatAlert = line -> "[ALERT " + System.currentTimeMillis() + "] " + line;
        Consumer<String> consoleSink = alert -> System.out.println("DISPATCH -> " + alert);

        List<String> dispatchedAlerts = processPipeline(rawLogLines, isHighSeverity, formatAlert, consoleSink);
        System.out.printf("Total alerts processed: %d%n", dispatchedAlerts.size());
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
DISPATCH -> [ALERT 1763812300000] WARN: Memory pressure detected
DISPATCH -> [ALERT 1763812300000] ERROR: DB connection timeout
Total alerts processed: 2
```
</details>

---

## Pitfalls

- **Checked Exceptions in Lambdas:** Standard functional interfaces (`Function`, `Consumer`) do not declare checked exceptions. Attempting `items.forEach(file -> Files.readString(file))` triggers compilation error `unhandled exception: IOException`. You must handle the checked exception inside a try-catch block within the lambda.
- **Mutating Captured Variables:** Modifying a local variable inside a lambda (`int count = 0; list.forEach(x -> count++);`) fails compilation because `count` is not effectively final.
- **Premature Boxed Primitives:** Using `Function<Integer, Integer>` instead of `IntUnaryOperator` creates needless autoboxing and unboxing overhead in tight numerical loops.

---

## Practice

### Question
Given the method below, why does this fail to compile?
```java
public void execute() {
    int factor = 2;
    Consumer<Integer> multiplier = n -> System.out.println(n * factor);
    factor = 3;
    multiplier.accept(5);
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. The lambda expression captures the local variable `factor`.
2. Java language specification requires that any local variable captured by a lambda must be `final` or effectively final.
3. The statement `factor = 3;` reassigns `factor`, violating the effectively final requirement.
4. Result: **Compile-time error**: `local variables referenced from a lambda expression must be final or effectively final`.

</details>
