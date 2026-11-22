---
id: topic-15
slug: method-overloading-and-varargs
topicNumber: 15
title: Method Overloading & Varargs
part: 'Part 1: Java Core'
sectionNumber: 4
sectionTitle: Methods & Modular Code
versionBadge: Java 5+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Static polymorphism via method overloading, the 4-phase compiler resolution hierarchy (exact match, widening, autoboxing, varargs), and ellipsis (...) syntax mechanics.
prerequisites:
  - 'Topic 14: Methods, Parameters & Return Values'
---

## Overview
Method overloading is compile-time (static) polymorphism where multiple methods share the same identifier with distinct parameter lists (count, types, or order). Variable-length arguments (varargs, `Type...`) enable methods to accept zero or more arguments, which the compiler compiles into an array parameter.

---

## Method Signature & Resolution Hierarchy

A method signature comprises solely the **Method Name** and **Parameter Type List**. Return type, access modifiers, and `throws` clauses are NOT part of the signature. Overloading by changing only the return type causes a compilation error (`method already defined`).

### The 4-Phase Resolution Sequence

When matching an invocation to overloaded candidates, the compiler resolves in strict four-phase order:

```
 Invocation ──► [ Phase 1: Exact Match / Widening without Boxing ]
                       │ (if no match)
                       ▼
                [ Phase 2: Widening to Larger Primitive Type ]
                       │ (if no match)
                       ▼
                [ Phase 3: Autoboxing / Unboxing ]
                       │ (if no match)
                       ▼
                [ Phase 4: Varargs Array Packing (...) ]
```

| Resolution Step | Candidate Signature | Invocation `test(5)` Matches? | Reason |
| :--- | :--- | :--- | :--- |
| **1. Exact Match** | `test(int x)` | **Selected** (Phase 1) | Direct primitive match |
| **2. Widening** | `test(long x)` | Selected if `int` absent | Primitive promotion (`int` $\rightarrow$ `long`) |
| **3. Boxing** | `test(Integer x)` | Selected if 1 & 2 absent | Autoboxing (`int` $\rightarrow$ `Integer`) |
| **4. Varargs** | `test(int... x)` | Selected only as last resort | Lowest precedence in resolution |

---

## Varargs Syntax Rules

1. **Terminal Parameter Only:** A method can declare at most one varargs parameter, and it **must** be the final parameter in the signature.
   ```java
   void log(String tag, int level, String... messages) // VALID
   void bad(String... messages, int level)            // COMPILER ERROR
   ```
2. **Implicit Array Allocation:** Calling `process("a", "b")` causes the compiler to generate `process(new String[]{"a", "b"})`. Inside the method body, the parameter behaves strictly as `String[]`.

---

## Implementation Example

```java
public class QueryBuilderUtility {
    // 1. Single-argument base method
    public static String select(String table) {
        return "SELECT * FROM " + table;
    }

    // 2. Overloaded method with explicit single column
    public static String select(String table, String column) {
        return String.format("SELECT %s FROM %s", column, table);
    }

    // 3. Overloaded method with varargs for multi-column projection
    public static String select(String table, String firstCol, String... additionalCols) {
        StringBuilder sql = new StringBuilder("SELECT ").append(firstCol);
        for (String col : additionalCols) {
            sql.append(", ").append(col);
        }
        sql.append(" FROM ").append(table);
        return sql.toString();
    }

    public static void main(String[] args) {
        System.out.println(select("users"));
        System.out.println(select("users", "id"));
        System.out.println(select("users", "id", "email", "created_at"));
    }
}
```

### Execution Output:
```text
SELECT * FROM users
SELECT id FROM users
SELECT id, email, created_at FROM users
```

---

## Pitfalls

- **Ambiguous Overload Calls with Varargs:** Declaring `void print(int x, int... rest)` alongside `void print(int... rest)` compiles cleanly, but invoking `print(1)` triggers a compile-time error: `reference to print is ambiguous`.
- **Heap Allocation in Tight Loops:** Because varargs creates a new array object on the heap for every call, calling a varargs method millions of times inside performance-critical loops introduces GC pressure. Provide specialized overloads for 1, 2, or 3 arguments to bypass array allocation.
- **Passing `null` to Varargs:** Calling `process((String[]) null)` sets the array parameter to `null`. Iterating over it with `for (String s : args)` without a null check throws `NullPointerException`.
- **Widening Then Boxing:** Java does NOT permit widening followed by autoboxing (e.g. an `int` cannot be widened to `long` and then boxed to `Long`). Calling `process(5)` will NOT match `process(Long val)`.

---

## Practice

### Question
Which method is executed when calling `process(10, 20)` in the following class?
```java
public class OverloadQuiz {
    static void process(long a, int b) { System.out.print("A"); }
    static void process(int a, long b) { System.out.print("B"); }
    public static void main(String[] args) {
        process(10, 20);
    }
}
```

### Explanation
1. The arguments `(10, 20)` are both `int`.
2. Matching `process(long, int)` requires widening argument 1 (`int` $\rightarrow$ `long`).
3. Matching `process(int, long)` requires widening argument 2 (`int` $\rightarrow$ `long`).
4. Both methods require exactly one primitive widening conversion, making neither more specific than the other.
5. Result: The code **fails compilation** with `reference to process is ambiguous`.
