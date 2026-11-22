---
id: topic-27
slug: nested-inner-and-anonymous-classes
topicNumber: 27
title: Nested, Inner & Anonymous Classes
part: 'Part 1: Java Core'
sectionNumber: 7
sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction'
versionBadge: Java 8+
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Four nested class classifications (static nested, non-static inner, local, anonymous), the implicit Outer.this pointer, memory leaks, and effectively final local capture.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 26: Interfaces & Modern Interface Evolution'
---

## Overview
Java permits classes to be declared inside other classes. Nested classes fall into four distinct categories based on their static modifier, enclosing scope, and presence of an implicit synthetic reference to the enclosing outer instance (`Outer.this`).

---

## The Four Nested Class Classifications

```
                             Nested Classes
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
        Static Nested Classes               Inner Classes (Non-Static)
       (No outer this reference)          (Retains hidden this$0 pointer)
                                                     │
                                   ┌─────────────────┼─────────────────┐
                                   ▼                 ▼                 ▼
                             Member Inner      Local Classes      Anonymous Inner
                             (Class scope)     (Method scope)     (Inline one-off)
```

| Category | Enclosing Scope | Outer Instance Required? | Hidden `this$0` Reference? | Primary Use Case |
| :--- | :--- | :---: | :---: | :--- |
| **Static Nested** | Enclosing class body (`static class`) | **No** | No | Builders, DTOs, namespaced static helpers |
| **Member Inner** | Enclosing class body (`class`) | **Yes** | **Yes** (`Outer.this`) | Iterators, adapters tightly coupled to outer state |
| **Local Class** | Method or block body | **Yes** (if method non-static) | Yes (if method non-static) | Complex algorithm encapsulation inside method |
| **Anonymous Inner** | Inline expression (`new Interface() {}`) | **Yes** (if non-static context) | Yes (if non-static context) | One-off callbacks and handlers |

---

## Memory Architecture & The Hidden `this$0` Pointer

When the compiler compiles a non-static member inner class, it generates a synthetic final field `final Outer this$0;`:

```
   Heap Memory: Outer Instance                 Heap Memory: Inner Instance
  ┌─────────────────────────────┐             ┌─────────────────────────────┐
  │ [Outer Object Header]       │             │ [Inner Object Header]       │
  │ private String secret;      │             │ private int innerState;     │
  │                             │◄────────────┼── final Outer this$0;       │
  └─────────────────────────────┘             └─────────────────────────────┘
```

- **Instantiation Syntax:** An inner class must be instantiated via an outer instance: `Outer.Inner inner = outerInstance.new Inner();`.
- **Memory Leak Hazard:** If an inner class instance is retained in a long-lived cache or thread, its hidden `this$0` pointer prevents the outer instance from being collected by the Garbage Collector.

---

## Local Variable Capture (Effectively Final Rule)

Local classes and anonymous inner classes accessing local variables declared in their enclosing method can only access variables that are **`final` or effectively final** (variables whose value is never assigned again after initialization).

---

## Implementation Example

```java
import java.util.Iterator;
import java.util.NoSuchElementException;

public class CustomContainer implements Iterable<String> {
    private final String[] elements;

    public CustomContainer(String... items) {
        this.elements = items.clone();
    }

    // 1. Static Nested Class: Builder Pattern (no outer reference required)
    public static class Builder {
        private String[] buffer = new String[0];

        public Builder setElements(String... items) {
            this.buffer = items.clone();
            return this;
        }

        public CustomContainer build() {
            return new CustomContainer(buffer);
        }
    }

    // 2. Non-Static Member Inner Class: Iterator (accesses enclosing elements via this$0)
    @Override
    public Iterator<String> iterator() {
        return new ContainerIterator();
    }

    private class ContainerIterator implements Iterator<String> {
        private int cursor = 0;

        @Override
        public boolean hasNext() {
            return cursor < elements.length; // Accesses outer private field directly
        }

        @Override
        public String next() {
            if (!hasNext()) throw new NoSuchElementException();
            return elements[cursor++];
        }
    }

    public static void main(String[] args) {
        // Instantiating static nested class without outer instance
        CustomContainer container = new CustomContainer.Builder()
                .setElements("Cluster-A", "Cluster-B", "Cluster-C")
                .build();

        for (String node : container) {
            System.out.println("Node: " + node);
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Node: Cluster-A
Node: Cluster-B
Node: Cluster-C
```
</details>

---

## Pitfalls

- **Memory Leaks in Background Threads:** Spawning an anonymous `Runnable` or event listener from an activity or service silently holds an implicit reference to the outer enclosing class, preventing GC reclamation. Use `static class` with `WeakReference` to eliminate this leak.
- **Attempting `new Outer.Inner()` for Non-Static Classes:** Calling `new Outer.Inner()` for a non-static inner class causes compiler error `an enclosing instance that contains Outer.Inner is required`. Must use `outerInstance.new Inner()`.
- **Modifying Captured Method Variables:** Attempting to increment a local counter inside an anonymous inner class (`count++;`) triggers compile-time error `local variables referenced from an inner class must be final or effectively final`.

---

## Practice

### Question
Given the following code, why does the compilation fail?
```java
public class Processor {
    public void start() {
        int attempt = 0;
        Runnable task = new Runnable() {
            @Override
            public void run() {
                System.out.println("Attempt: " + attempt);
            }
        };
        attempt++;
        task.run();
    }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `attempt` is declared as a local variable inside `start()`.
2. The anonymous `Runnable` captures `attempt`.
3. The statement `attempt++;` modifies `attempt` after initialization, meaning `attempt` is no longer **effectively final**.
4. The Java compiler rejects local variable captures that are not effectively final.
5. Result: **Compile-time error**.

</details>
