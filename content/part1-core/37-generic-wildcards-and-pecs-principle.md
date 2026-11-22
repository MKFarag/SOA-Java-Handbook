---
id: topic-37
slug: generic-wildcards-and-pecs-principle
topicNumber: 37
title: Generic Wildcards & PECS Principle
part: 'Part 1: Java Core'
sectionNumber: 10
sectionTitle: Generics & Collections Framework
versionBadge: Java 5+ / Java 7+
difficulty: Advanced
readingTime: 7 min read
shortDescription: >-
  Reference: Invariance of generics, covariance (? extends T), contravariance (? super T), the PECS design rule, wildcard capture helper idioms, and @SafeVarargs.
prerequisites:
  - 'Topic 36: Generics Fundamentals'
---

## Overview
Java generics are strictly **invariant**: `List<Integer>` does NOT inherit from `List<Number>`, even though `Integer` is a subtype of `Number`. To permit flexible polymorphism across collections, Java provides wildcard arguments (`?`) governed by the **PECS** rule: **Producer Extends, Consumer Super**.

---

## Wildcard Subtyping & The PECS Rule

```
                   Generic Subtyping Relationships
 ┌─────────────────────────────────────────────────────────────┐
 │                    List<?> (Unbounded)                      │
 │                             │                               │
 │            ┌────────────────┴────────────────┐              │
 │            ▼                                 ▼              │
 │   List<? extends Number>            List<? super Integer>   │
 │   (Covariant / Producer)            (Contravariant/Consumer)│
 │            ▲                                 ▲              │
 │            │                                 │              │
 │      List<Integer>                     List<Number>         │
 └─────────────────────────────────────────────────────────────┘
```

| Wildcard Pattern | Formal Classification | Permitted Read Type | Permitted Write Elements | Architectural Role |
| :--- | :--- | :--- | :--- | :--- |
| **`? extends T`** | **Covariant** (Upper Bounded) | Safe to read as `T` | **None** (only `null`) | **Producer:** Data source to read from |
| **`? super T`** | **Contravariant** (Lower Bounded) | Read as raw `Object` | Safe to write `T` or subtypes | **Consumer:** Data sink/buffer to write into |
| **`?`** | **Bivariant** (Unbounded) | Read as raw `Object` | **None** (only `null`) | Generic algorithms independent of type |

---

## The Canonical Copy Pattern

The classic demonstration of PECS is `java.util.Collections.copy(dest, src)`:

```java
// src PRODUCES elements of type T (or subtype)
// dest CONSUMES elements of type T (or supertype)
public static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (int i = 0; i < src.size(); i++) {
        dest.set(i, src.get(i)); // Reading from Producer, writing to Consumer
    }
}
```

---

## Wildcard Capture Idiom

When a method accepts a wildcard `List<?>`, attempting to re-insert an extracted element directly fails because the compiler cannot match the anonymous wildcard capture variable. Resolve this using a private generic helper:

```java
public void reverse(List<?> list) {
    reverseHelper(list); // Wildcard capture delegated to concrete type parameter T
}

private <T> void reverseHelper(List<T> list) {
    List<T> tmp = new ArrayList<>(list);
    for (int i = 0; i < list.size(); i++) {
        list.set(i, tmp.get(list.size() - 1 - i));
    }
}
```

---

## Implementation Example

```java
import java.util.ArrayList;
import java.util.List;

public class PecsPipelineDemo {
    // Producer: accepts List<Integer>, List<Double>, etc., to compute total
    public static double sumOfList(List<? extends Number> producer) {
        double total = 0.0;
        for (Number n : producer) {
            total += n.doubleValue(); // Safe read as Number
        }
        return total;
    }

    // Consumer: accepts List<Number>, List<Object>, etc., to append integers
    public static void appendIntegers(List<? super Integer> consumer, int count) {
        for (int i = 1; i <= count; i++) {
            consumer.add(i); // Safe write of Integer
        }
    }

    public static void main(String[] args) {
        // 1. Covariant Producer
        List<Double> doubleList = List.of(1.5, 2.5, 4.0);
        System.out.printf("Sum of doubles: %.2f%n", sumOfList(doubleList));

        // 2. Contravariant Consumer
        List<Number> numberSink = new ArrayList<>();
        appendIntegers(numberSink, 4);
        System.out.println("Populated Number Sink: " + numberSink);
        System.out.printf("Sum of sink elements: %.2f%n", sumOfList(numberSink));
    }
}
```

### Execution Output:
```text
Sum of doubles: 8.00
Populated Number Sink: [1, 2, 3, 4]
Sum of sink elements: 10.00
```

---

## Pitfalls

- **Attempting to Write to `? extends T`:** Calling `list.add(new Integer(5))` on a `List<? extends Number>` fails compilation with `capture of ? extends Number cannot be applied`. The compiler cannot prove the runtime collection is not a `List<Double>`.
- **Using Wildcards in Return Types:** Never return wildcards from public methods (e.g. `public List<? extends Number> getItems()`). This forces calling code to deal with wildcards in its own variable declarations. Follow the rule: *Be conservative in what you return, liberal in what you accept*.
- **Heap Pollution with Generic Varargs:** Passing parameterized types to varargs (`List<String>... args`) triggers heap pollution warnings because arrays are reified and generics are erased. Annotate methods with `@SafeVarargs` if elements are never stored into the array.

---

## Practice

### Question
Which of the following lines will fail compilation?
```java
List<? extends Number> listA = new ArrayList<Integer>(); // Line 1
listA.add(10);                                           // Line 2
Number n = listA.get(0);                                 // Line 3
```

### Explanation
1. Line 1: `ArrayList<Integer>` is compatible with `List<? extends Number>` (Covariance). Valid.
2. Line 2: `listA` is a Producer (`? extends`). The compiler cannot determine whether the underlying list is `Integer`, `Double`, etc., so it rejects all writes except `null`. Line 2 **fails compilation**.
3. Line 3: Reading an element as `Number` from `? extends Number` is guaranteed type-safe. Valid.
4. Error is on **Line 2**.
