---
id: topic-31
slug: pattern-matching-for-switch-and-records
topicNumber: 31
title: Pattern Matching for Switch & Records
part: 'Part 1: Java Core'
sectionNumber: 8
sectionTitle: Modern Java Language Features
versionBadge: Java 21 LTS
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Type patterns, record deconstruction patterns (JEP 440), guarded patterns via when clauses (JEP 441), null handling, and dominance ordering.
prerequisites:
  - 'Topic 12: Switch Statements & Switch Expressions'
  - 'Topic 29: Records'
  - 'Topic 30: Sealed Classes & Interfaces'
---

## Overview
Pattern matching for `switch` (finalized in Java 21 LTS via JEP 441) and record deconstruction patterns (JEP 440) eliminate manual casting and component extraction. They enable type testing, component unpacking, conditional refinement with `when`, and explicit `null` branch handling in declarative control flow.

---

## Pattern Taxonomy & Syntax

```
                   Pattern Matching in Switch (Java 21)
 ┌──────────────────────────────────────────────────────────────────┐
 │ 1. Type Pattern:       case String s -> s.toLowerCase();         │
 ├──────────────────────────────────────────────────────────────────┤
 │ 2. Record Pattern:     case Point(int x, int y) -> x + y;        │
 ├──────────────────────────────────────────────────────────────────┤
 │ 3. Guarded Pattern:    case Integer i when i > 0 -> "Positive";  │
 ├──────────────────────────────────────────────────────────────────┤
 │ 4. Null Pattern:       case null -> "Value is null";             │
 ├──────────────────────────────────────────────────────────────────┤
 │ 5. Combined Null/Case: case null, default -> "Fallback";         │
 └──────────────────────────────────────────────────────────────────┘
```

### Pattern Matching Feature Reference (Java 16 - 21 LTS)

| Pattern Type | Syntax Form | Java Version | Core Behavior |
| :--- | :--- | :--- | :--- |
| **`instanceof` Pattern** | `if (obj instanceof String s)` | Java 16 LTS | Replaces cast; safely binds `s` in scope |
| **Switch Type Pattern** | `case String s -> ...` | Java 21 LTS | Dispatches cleanly by runtime subtype |
| **Guarded Pattern** | `case Integer i when i > 0 -> ...` | Java 21 LTS | Appends boolean predicate via `when` |
| **Record Pattern** | `case Point(int x, int y) -> ...` | Java 21 LTS | Deconstructs record attributes inline |
| **Null Handling** | `case null -> ...` | Java 21 LTS | Handles `null` directly without throwing NPE |

### Pattern Dominance & Ordering Invariant

The compiler enforces strict **dominance checking**: a broader or more general pattern must NEVER precede a narrower or guarded subtype pattern. Placing a dominating pattern earlier triggers a compile-time error (`this case label is dominated by a preceding case label`):

```java
// COMPILATION ERROR: Dominance violation
switch (obj) {
    case CharSequence cs -> ... // Dominates String!
    case String s        -> ... // ERROR: Unreachable case label
}

// CORRECT ORDER: Specific to General
switch (obj) {
    case String s        -> ... // Narrower type first
    case CharSequence cs -> ... // Broader type second
}
```

---

## Record Deconstruction & Nested Patterns

Record patterns deconstruct records into their components directly in the match target, supporting arbitrary nesting:

```java
public record Coordinate(int x, int y) {}
public record Node(String id, Coordinate position) {}

// Nested Record Pattern Matching
if (obj instanceof Node(String id, Coordinate(int x, int y))) {
    System.out.printf("Node %s is at (%d, %d)%n", id, x, y);
}
```

---

## Implementation Example

```java
public class PatternMatchingDemo {
    public sealed interface Payload permits TextPayload, MetricPayload, EmptyPayload {}
    public static final record TextPayload(String body, int charCount) implements Payload {}
    public static final record MetricPayload(String metricName, double value, boolean alert) implements Payload {}
    public static final record EmptyPayload() implements Payload {}

    public static String inspectMessage(Object message) {
        return switch (message) {
            case null -> "Received NULL reference";
            case TextPayload(String body, int count) when count > 100 ->
                String.format("Large Text Payload (%d chars): %s...", count, body.substring(0, 20));
            case TextPayload(String body, int count) ->
                String.format("Standard Text Payload (%d chars): %s", count, body);
            case MetricPayload(String name, double val, boolean isAlert) when isAlert ->
                String.format("ALERT: Metric [%s] breached threshold at value: %.2f", name, val);
            case MetricPayload(String name, double val, boolean isAlert) ->
                String.format("Normal Metric [%s] at %.2f", name, val);
            case EmptyPayload() -> "Empty message packet";
            default -> "Unrecognized object type: " + message.getClass().getSimpleName();
        };
    }

    public static void main(String[] args) {
        Payload p1 = new TextPayload("System connection established successfully on cluster node A.", 61);
        Payload p2 = new MetricPayload("cpu_load", 98.6, true);

        System.out.println(inspectMessage(p1));
        System.out.println(inspectMessage(p2));
        System.out.println(inspectMessage(null));
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Standard Text Payload (61 chars): System connection established successfully on cluster node A.
ALERT: Metric [cpu_load] breached threshold at value: 98.60
Received NULL reference
```
</details>

---

## Pitfalls

- **Dominance Violations:** Placing an unguarded pattern before a guarded pattern of the same type (`case Integer i` before `case Integer i when i > 0`) causes compilation failure because the guarded case can never be reached.
- **Null Safety Assumptions:** Passing `null` to a pattern-matching `switch` that lacks an explicit `case null` or `case null, default` throws `NullPointerException` immediately.
- **Ignoring Record Component Arity:** A record deconstruction pattern must match the exact number and order of components declared in the record header (`Point(int x, int y)` cannot be written as `Point(int x)`).

---

## Practice

### Question
Given the method below, what occurs when compiling the class?
```java
public static void process(Object o) {
    switch (o) {
        case String s -> System.out.print("1");
        case String s when s.length() > 5 -> System.out.print("2");
        default -> System.out.print("3");
    }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `case String s` matches any non-null `String` object unconditionally.
2. The subsequent label `case String s when s.length() > 5` matches a subset of `String`.
3. Because the unguarded `String s` label appears first, it **dominates** the guarded label.
4. Java compiler flags this with an error: `this case label is dominated by a preceding case label`.
5. Result: **Compile-time error**.

</details>
