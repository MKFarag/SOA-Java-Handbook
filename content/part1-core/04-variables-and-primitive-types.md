---
id: topic-04
slug: variables-identifiers-and-primitive-types
topicNumber: 4
title: 'Variables, Identifiers & Primitive Data Types'
part: 'Part 1: Java Core'
sectionNumber: 2
sectionTitle: Language Basics & Data Types
versionBadge: Java 8+ / Java 10+ (var)
difficulty: Beginner
readingTime: 5 min read
shortDescription: >-
  Reference for the 8 Java primitives, memory sizes, value ranges, identifier rules, and type inference with var.
prerequisites:
  - 'Topic 01: What is Programming & How Code Runs'
  - 'Topic 03: Your First Java Program'
---

## Overview
Java is a statically typed language with 8 built-in primitive data types stored directly on the stack for maximum execution performance, complemented by local variable type inference (`var`).

---

## Primitive Types Specification

| Type | Size | Default | Range / Format | Literal Suffix | Wrapper Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`byte`** | 1 byte (8 bits) | `0` | `-128` to `127` | None (explicit cast) | `Byte` |
| **`short`** | 2 bytes (16 bits) | `0` | `-32,768` to `32,767` | None | `Short` |
| **`int`** | 4 bytes (32 bits) | `0` | `-2,147,483,648` to `2,147,483,647` | None (integer default) | `Integer` |
| **`long`** | 8 bytes (64 bits) | `0L` | `~ -9.22 × 10^18` to `~ 9.22 × 10^18` | `L` or `l` (e.g. `1000L`) | `Long` |
| **`float`** | 4 bytes (32 bits) | `0.0f` | IEEE 754 32-bit (~ 7 decimal digits) | `F` or `f` (e.g. `3.14F`) | `Float` |
| **`double`** | 8 bytes (64 bits) | `0.0d` | IEEE 754 64-bit (~ 15-17 decimal digits) | `D` or `d` (decimal default) | `Double` |
| **`char`** | 2 bytes (16 bits) | `'\u0000'` | `0` to `65,535` (Unicode UTF-16) | Single quotes `'A'` | `Character` |
| **`boolean`** | 1 bit logical | `false` | `true` or `false` | None | `Boolean` |

---

## Declaration and Type Inference

```java
int count = 10;                         // Explicit primitive typing
var username = "Alice";                 // Local type inference (Java 10+)
long transactionId = 9_876_543_210L;    // Numeric readability underscores (Java 7+)
```

### Identifier Rules
1. Must begin with a letter (`a-z`, `A-Z`), underscore (`_`), or dollar sign (`$`).
2. Subsequent characters may include digits (`0-9`). Cannot use reserved keywords (`class`, `int`, etc.).
3. Standard conventions use `lowerCamelCase` for variable names.

---

## Memory Allocation: Stack vs Heap

- **Primitives:** Stored directly inside thread stack frames. Access is instantaneous with zero garbage collector overhead.
- **Reference Types:** Variables hold memory references (pointers) located on the stack that point to object data allocated on the garbage-collected heap.

---

## Pitfalls

- **Missing `L` on Large Integers:** `long n = 3000000000;` fails to compile (`integer number too large`) because literals default to 32-bit `int`. Append `L`: `3000000000L`.
- **Missing `F` on Float Literals:** `float f = 3.14;` fails to compile (`lossy conversion from double to float`) because decimals default to 64-bit `double`. Append `F`: `3.14F`.
- **Silent Integer Overflow:** Primitives wrap around silently on overflow in two's-complement arithmetic: `(byte)(127 + 1)` evaluates to `-128` without throwing an exception. Use `Math.addExact()` when bounds validation is required.

---

## Example

```java
public class PrimitivesDemo {
    public static void main(String[] args) {
        int maxInt = Integer.MAX_VALUE;
        long maxLong = Long.MAX_VALUE;
        double pi = 3.141592653589793;
        boolean isActive = true;

        System.out.printf("int range: [%d to %d]%n", Integer.MIN_VALUE, maxInt);
        System.out.printf("long max : %d%n", maxLong);
        System.out.printf("double   : %.5f | boolean: %b%n", pi, isActive);

        // Silent overflow demonstration
        byte counter = 127;
        counter++;
        System.out.println("byte overflow (127 + 1): " + counter);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
int range: [-2147483648 to 2147483647]
long max : 9223372036854775807
double   : 3.14159 | boolean: true
byte overflow (127 + 1): -128
```
</details>

---

## Practice

### Q: Why does `float price = 19.99;` fail to compile?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Decimal number literals default to 64-bit `double` in Java. Assigning a 64-bit `double` to a 32-bit `float` causes a compile-time "possible lossy conversion" error. The fix is to append `F` (`19.99F`) or cast: `(float) 19.99`.
</details>
