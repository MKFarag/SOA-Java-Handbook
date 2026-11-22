---
id: topic-14
slug: methods-parameters-and-return-values
topicNumber: 14
title: Methods, Parameters & Return Values
part: 'Part 1: Java Core'
sectionNumber: 4
sectionTitle: Methods & Modular Code
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Method declaration anatomy, Call Stack frames, return semantics, and Java strict Pass-By-Value evaluation model.
prerequisites:
  - 'Topic 11: Conditional Statements'
---

## Overview
A method is a discrete, callable subroutine within a class that encapsulates business operations, receives arguments, and yields a typed result or `void`. Java enforces a strict **Pass-by-Value** evaluation strategy across all method invocations without exception.

---

## Anatomy & Call Stack Mechanics

```java
// Method Signature: calculateYield(double, int)
public static double calculateYield(double principal, int termMonths) {
    if (principal <= 0.0) return 0.0;
    return principal * Math.pow(1.0 + (0.05 / 12), termMonths);
}
```

```
                          JVM Call Stack Frame
 ┌────────────────────────────────────────────────────────┐
 │ [Frame 2: calculateYield]                              │
 │   - Local Variables: principal=1000.0, termMonths=12   │
 │   - Operand Stack: intermediate math calculations      │
 │   - Return Address: caller in main()                   │
 ├────────────────────────────────────────────────────────┤
 │ [Frame 1: main]                                        │
 │   - Local Variables: args, initialBalance, finalYield  │
 │   - Current Execution Pointer                          │
 └────────────────────────────────────────────────────────┘
  * Invocations push new stack frames; returning pops and reclaims frame memory.
```

---

## The Pass-by-Value Invariant

Java never passes variables by reference. It evaluates arguments and copies their literal values into the receiving method's parameter slots:

| Argument Category | Value Copied into Parameter | Effect of Reassignment Inside Method | Effect of State Mutation Inside Method |
| :--- | :--- | :--- | :--- |
| **Primitives** (`int`, `double`, etc.) | Literal binary bit-pattern | Zero effect on original caller variable | N/A (primitives have no internal state) |
| **Object References** | Literal memory pointer address | Zero effect on original caller reference | Mutates the single shared object in heap! |

```java
// Modifying internal state vs Reassigning pointer
void modify(int primitiveVal, List<String> listRef) {
    primitiveVal = 50;                  // Caller's int unchanged
    listRef.add("Added");               // Caller sees modified heap object
    listRef = new ArrayList<>();       // Reassignment: local parameter points elsewhere; caller unchanged!
}
```

---

## Implementation Example

```java
import java.util.ArrayList;
import java.util.List;

public class ParameterPassingDemonstration {
    public static void compute(int scalar, List<String> buffer) {
        scalar += 100;                 // Modifies local frame copy only
        buffer.add("Event-Recorded");  // Mutates shared heap object
        buffer = new ArrayList<>();    // Rebinds local variable to new object
        buffer.add("Orphaned-Event");  // Does not affect caller
    }

    public static void main(String[] args) {
        int originalScalar = 25;
        List<String> originalBuffer = new ArrayList<>();
        originalBuffer.add("Initial-State");

        compute(originalScalar, originalBuffer);

        System.out.printf("Scalar value after call: %d%n", originalScalar);
        System.out.printf("Buffer size after call : %d%n", originalBuffer.size());
        System.out.printf("Buffer contents         : %s%n", originalBuffer);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Scalar value after call: 25
Buffer size after call : 2
Buffer contents         : [Initial-State, Event-Recorded]
```
</details>

---

## Pitfalls

- **The "Pass-by-Reference" Myth:** Thinking that passing an object passes the variable itself. If you assign `param = new OtherObject();` inside a method, the caller's variable still points to the original object.
- **Missing Return Path in Conditional Branches:** Every code branch in a non-void method must explicitly execute a `return` statement or throw an exception. Omitting a return in an `else` branch triggers compiler error `missing return statement`.
- **Unbounded Recursion:** Methods calling themselves without an attainable base condition exhaust the thread call stack, throwing `java.lang.StackOverflowError`.
- **Primitive Autoboxing Overhead in Signatures:** Declaring return types as wrapper objects (e.g. `Double` instead of `double`) introduces unnecessary heap allocation and risks unexpected `NullPointerException` during implicit unboxing.

---

## Practice

### Question
Given the following snippet, what does `main` print?
```java
public class PassTest {
    static void swap(StringBuilder x, StringBuilder y) {
        x.append("-A");
        y = x;
        y.append("-B");
    }
    public static void main(String[] args) {
        StringBuilder s1 = new StringBuilder("1");
        StringBuilder s2 = new StringBuilder("2");
        swap(s1, s2);
        System.out.println(s1 + " " + s2);
    }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `swap` receives copies of the references `s1` and `s2`.
2. `x.append("-A")` mutates the heap object referenced by `s1` (`"1-A"`).
3. `y = x` reassigns the local parameter `y` to point to the same object as `x` (`s1`). The caller's `s2` reference remains completely untouched.
4. `y.append("-B")` mutates that same heap object, making `s1` `"1-A-B"`.
5. `s2` remained pointing to `"2"`.
6. Output: `1-A-B 2`.

</details>
