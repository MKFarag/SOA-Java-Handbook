---
id: topic-16
slug: variable-scope-and-type-inference
topicNumber: 16
title: Variable Scope & Local Variable Type Inference (var)
part: 'Part 1: Java Core'
sectionNumber: 4
sectionTitle: Methods & Modular Code
versionBadge: Java 10+
difficulty: Beginner
readingTime: 6 min read
shortDescription: >-
  Reference: Scope boundaries (block, method, instance, static), shadowing mechanics, and compile-time local variable type inference (var) rules and constraints.
prerequisites:
  - 'Topic 14: Methods, Parameters & Return Values'
---

## Overview
Variable scope defines the boundaries within which an identifier is visible and resolvable by the compiler. Local Variable Type Inference (`var`), introduced in Java 10 (JEP 286), allows the compiler to infer static types from initializers, preserving compile-time type safety without manual repetition.

---

## Scope Levels & Memory Lifetime

```
 ┌──────────────────────────────────────────────────────────────┐
 │ Class Scope (static fields)  ── Lifetime: ClassLoader unload │
 │  ┌──────────────────────────────────────────────────────────┐ │
 │  │ Instance Scope (fields)   ── Lifetime: Object Garbage Col│ │
 │  │  ┌─────────────────────────────────────────────────────┐ │ │
 │  │  │ Method Scope (locals)  ── Lifetime: Stack Frame Pop │ │ │
 │  │  │  ┌────────────────────────────────────────────────┐ │ │ │
 │  │  │  │ Block Scope ({ })   ── Lifetime: Block Exit    │ │ │ │
 │  │  │  └────────────────────────────────────────────────┘ │ │ │
 │  │  └─────────────────────────────────────────────────────┘ │ │
 │  └──────────────────────────────────────────────────────────┘ │
 └──────────────────────────────────────────────────────────────┘
```

| Scope Level | Declaration Site | Memory Allocation | Lifetime Duration |
| :--- | :--- | :--- | :--- |
| **Static / Class** | `static` field inside class | Metaspace / Heap | Duration of application until ClassLoader is unloaded |
| **Instance / Field** | Non-static field inside class | Heap (inside enclosing object) | From `new` instantiation until GC reclamation |
| **Method Local** | Parameter or variable in method | Thread Call Stack frame | Pushed on call, destroyed on frame return |
| **Block** | Inside `{ ... }` (if, for, while) | Thread Call Stack | Created on block entry, destroyed on block exit |

---

## Type Inference with `var`

`var` is a reserved type name (not a keyword). It is resolved entirely at compile time; bytecodes generated with `var` are byte-for-byte identical to explicit type declarations.

### Where `var` Is Permitted vs Prohibited

| Context | Code Pattern | Permitted? | Compiler Rule |
| :--- | :--- | :--- | :--- |
| **Local variable with initializer** | `var count = 10;` | **Yes** | Inferred as `int` |
| **Enhanced `for` loop variable** | `for (var item : list)` | **Yes** | Inferred from generic element type |
| **Classic `for` loop counter** | `for (var i = 0; i < 5; i++)` | **Yes** | Inferred as `int` |
| **Try-with-resources resource** | `try (var in = openStream())` | **Yes** | Inferred from return type |
| **Uninitialized local variable** | `var count;` | **No** | Cannot infer from missing initializer |
| **Assigned to `null`** | `var data = null;` | **No** | `null` has no inferable type |
| **Class instance or static field** | `private var name = "A";` | **No** | Only permitted on local variables |
| **Method parameter or return** | `void test(var x)` | **No** | Signatures require explicit public contracts |
| **Lambda expressions directly** | `var f = () -> {};` | **No** | Target type cannot be resolved |
| **Array literal initializers** | `var arr = {1, 2, 3};` | **No** | Must write `var arr = new int[]{1, 2, 3};` |

---

## Implementation Example

```java
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ScopeAndInferenceDemo {
    // Instance variable: accessible across all instance methods
    private final String serviceName = "TelemetryPipeline";

    public void processBatches(List<String> rawLogs) {
        // Local variable with var: eliminates repetitive generic boilerplate
        var eventFrequencyMap = new HashMap<String, Integer>();

        for (var log : rawLogs) {
            // Block scope: 'normalized' exists only inside this iteration
            var normalized = log.strip().toLowerCase();
            eventFrequencyMap.merge(normalized, 1, Integer::sum);
        }

        // Display results
        System.out.printf("[%s] Event counts:%n", serviceName);
        for (var entry : eventFrequencyMap.entrySet()) {
            System.out.printf("  - %s: %d%n", entry.getKey(), entry.getValue());
        }
    }

    public static void main(String[] args) {
        var demo = new ScopeAndInferenceDemo();
        var logs = List.of("ERROR", "INFO", "WARN", "ERROR", "error ");
        demo.processBatches(logs);
    }
}
```

### Execution Output:
```text
[TelemetryPipeline] Event counts:
  - warn: 1
  - error: 3
  - info: 1
```

---

## Pitfalls

- **Reassigning `var` to Incompatible Types:** `var` is NOT dynamic. Once inferred as `int`, assigning `val = "text";` causes compilation error `incompatible types: String cannot be converted to int`.
- **Variable Shadowing Confusion:** Declaring a local variable with the exact same name as an instance field shadows the field. Accessing the field requires explicit `this.fieldName`.
- **Loss of Code Readability:** Writing `var result = service.execute();` hides the underlying type from reviewers when method return types are not immediately obvious. Use `var` only when the type is obvious from the right-hand side (e.g. constructors or factory methods).
- **Diamond Operator with `var`:** Writing `var list = new ArrayList<>();` infers `ArrayList<Object>`, losing compile-time generic type safety. Always specify type arguments: `var list = new ArrayList<String>();`.

---

## Practice

### Question
Which of the following variable declarations will cause a compile-time error?
```java
var a = 10;                     // Line 1
var b = new int[]{1, 2};        // Line 2
var c = {1, 2};                 // Line 3
var d = (String) null;          // Line 4
```

### Explanation
1. Line 1 infers `int`. Valid.
2. Line 2 explicitly allocates `int[]`. Valid.
3. Line 3 uses an array literal initializer without a type. Java requires an explicit target type for `{1, 2}`. Line 3 **fails compilation**.
4. Line 4 explicitly casts `null` to `String`, allowing the compiler to infer `String`. Valid.
5. Error is on **Line 3**.
