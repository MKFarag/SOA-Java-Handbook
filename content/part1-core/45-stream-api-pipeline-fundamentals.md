---
id: topic-45
slug: stream-api-pipeline-fundamentals
topicNumber: 45
title: 'Stream API: Pipeline Fundamentals'
part: 'Part 1: Java Core'
sectionNumber: 11
sectionTitle: Functional Programming & Streams
versionBadge: Java 8+ / Java 16+ (.toList())
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Declarative Stream pipelines, lazy evaluation mechanics, intermediate operations (filter, map, flatMap, distinct, sorted, peek), short-circuiting, and primitive streams.
prerequisites:
  - 'Topic 43: Lambdas & Functional Interfaces'
  - 'Topic 44: Method References'
---

## Overview
The Java Stream API (`java.util.stream.Stream<T>`, introduced in Java 8) enables declarative, functional transformations over sequences of elements. Streams do not store data; they convey elements from a source through a pipeline of lazy intermediate operations, executing only when a terminal operation triggers processing.

---

## Stream Pipeline Architecture & Lazy Evaluation

```
               Three-Phase Stream Execution Lifecycle
 ┌──────────────────────────────────────────────────────────────────┐
 │ 1. Source:              collection.stream(), Stream.of(...)      │
 │                                │                                 │
 │                                ▼                                 │
 │ 2. Intermediate (Lazy): filter(...) ──► map(...) ──► limit(5)    │
 │    - Operations return Stream<T>; execute ZERO code on declaration
 │                                │                                 │
 │                                ▼                                 │
 │ 3. Terminal (Eager):    collect(...), findFirst(), forEach(...)  │
 │    - Triggers pipeline execution; consumes and closes the stream │
 └──────────────────────────────────────────────────────────────────┘
```

- **Loop Fusion:** The JVM fuses multiple operations (`filter` + `map`) into a single pass over the elements rather than creating intermediate collection buffers.
- **Short-Circuiting:** Operations like `limit(n)` or `findFirst()` terminate traversal as soon as conditions are met, avoiding processing the remainder of the dataset.

---

## Intermediate Operations Reference

| Operation | Parameter | Output | Statefulness | Description |
| :--- | :--- | :--- | :---: | :--- |
| `filter(p)` | `Predicate<T>` | `Stream<T>` | Stateless | Retains elements evaluating to `true` |
| `map(f)` | `Function<T, R>` | `Stream<R>` | Stateless | 1-to-1 transformation of elements |
| `flatMap(f)` | `Function<T, Stream<R>>`| `Stream<R>` | Stateless | 1-to-N transformation; flattens nested streams |
| `distinct()` | None | `Stream<T>` | **Stateful** | Eliminates duplicates using `equals()` |
| `sorted()` | `Comparator<T>` | `Stream<T>` | **Stateful** | Buffers all elements to sort |
| `limit(max)` | `long` | `Stream<T>` | Short-circuit | Truncates stream to at most `max` elements |
| `skip(n)` | `long` | `Stream<T>` | Stateless | Discards the first `n` elements |
| `peek(c)` | `Consumer<T>` | `Stream<T>` | Stateless | Debug side-effect tap (does not alter elements) |

---

## Specialized Primitive Streams

Using `Stream<Integer>` introduces autoboxing overhead for numerical data. Use primitive specializations:
- `IntStream`, `LongStream`, `DoubleStream`
- Methods: `.mapToInt()`, `.summaryStatistics()`, `.range(start, end)`, `.average()`, `.sum()`

---

## Implementation Example

```java
import java.util.List;
import java.util.stream.IntStream;

public class StreamPipelineDemo {
    public record Developer(String name, String department, List<String> skills) {}

    public static void main(String[] args) {
        List<Developer> team = List.of(
            new Developer("Alex", "Platform", List.of("Java", "Go", "Docker")),
            new Developer("Beth", "Data", List.of("Python", "SQL", "Java")),
            new Developer("Carl", "Platform", List.of("Rust", "Kubernetes")),
            new Developer("Dana", "Platform", List.of("Java", "TypeScript"))
        );

        // Extract distinct skills from Platform department sorted alphabetically
        List<String> platformSkills = team.stream()
            .filter(dev -> "Platform".equals(dev.department())) // Filter
            .flatMap(dev -> dev.skills().stream())              // Flatten List<String> to Stream<String>
            .distinct()                                         // Deduplicate
            .sorted()                                           // Sort natural
            .toList();                                          // Terminal (Java 16+)

        System.out.println("Distinct Platform Skills: " + platformSkills);

        // Primitive stream aggregation without boxing overhead
        int totalSkillCount = team.stream()
            .mapToInt(dev -> dev.skills().size())
            .sum();

        System.out.println("Total combined skill assignments: " + totalSkillCount);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Distinct Platform Skills: [Docker, Go, Java, Kubernetes, Rust, TypeScript]
Total combined skill assignments: 11
```
</details>

---

## Pitfalls

- **Streams are Single-Use Only:** Invoking a second terminal operation on an already consumed stream throws `IllegalStateException: stream has already been operated upon or closed`. You must create a new stream from the source.
- **Side-Effects in `peek()` / `map()`:** Stream pipelines assume pure functions. Performing mutations or modifying external state within intermediate operations causes nondeterministic bugs when run in parallel.
- **Unbounded Memory in `sorted()` or `distinct()`:** Applying `sorted()` on an infinite stream (`Stream.generate()`) causes an immediate `OutOfMemoryError` because stateful operations must buffer all elements before yielding.

---

## Practice

### Question
Given the code below, how many times is `"Filtering: "` printed?
```java
List<String> items = List.of("one", "two", "three");
Stream<String> stream = items.stream().filter(s -> {
    System.out.println("Filtering: " + s);
    return s.length() > 3;
});
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `filter()` is an **intermediate operation**.
2. Stream intermediate operations are **lazy**: they execute zero code until a terminal operation is invoked.
3. Because no terminal operation (such as `toList()`, `findFirst()`, or `count()`) is attached to `stream`, the pipeline is never executed.
4. Output: `"Filtering: "` is printed **zero times**.

</details>
