---
id: topic-06
slug: type-casting-and-numeric-conversions
topicNumber: 6
title: Type Casting & Numeric Conversions
part: 'Part 1: Java Core'
sectionNumber: 2
sectionTitle: Language Basics & Data Types
versionBadge: Java 8+
difficulty: Beginner
readingTime: 6 min read
shortDescription: >-
  Widening vs narrowing conversions, binary numeric promotion rules, and String parsing methods.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
  - 'Topic 05: Operators & Expressions'
---

## Overview
Type casting converts values across data types: widening conversions execute automatically without precision loss, whereas narrowing conversions require explicit cast operators `(type)` to acknowledge potential truncation or overflow.

---

## Conversion Types

### Widening Casting (Implicit / Automatic)
Safely promotes a smaller type to a larger type with zero data loss:
```
byte ──► short ──► int ──► long ──► float ──► double
char ──► int
```

```java
int count = 100;
double price = count; // Automatic widening: int -> double (100.0)
```

### Narrowing Casting (Explicit / Manual)
Converts a larger type into a smaller type. Fractional digits are discarded (truncated towards zero) and values exceeding target limits wrap around:

```java
double exact = 9.99;
int truncated = (int) exact; // Explicit narrowing: yields 9
```

---

## Binary Numeric Promotion Rules

When evaluating binary arithmetic expressions (`a + b`, `a * b`):

1. If either operand is `double`, the other is promoted to `double`.
2. Otherwise, if either operand is `float`, the other is promoted to `float`.
3. Otherwise, if either operand is `long`, the other is promoted to `long`.
4. **Otherwise, both operands are promoted to `int`.**

> Note: Because of rule 4, adding two `byte` values returns an `int`. `byte c = a + b;` fails to compile without `(byte)(a + b)`.

---

## String Parsing Reference

| Primitive | Parsing Method | Fallback on Invalid Format |
| :--- | :--- | :--- |
| **`int`** | `Integer.parseInt(str)` | Throws `NumberFormatException` |
| **`long`** | `Long.parseLong(str)` | Throws `NumberFormatException` |
| **`double`** | `Double.parseDouble(str)` | Throws `NumberFormatException` |
| **`boolean`** | `Boolean.parseBoolean(str)` | Returns `false` (case-insensitive "true" returns `true`) |
| **To String** | `String.valueOf(val)` | Safe conversion for all primitives and objects |

---

## Pitfalls

- **Byte and Short Arithmetic Promotion:** Writing `byte a = 10; byte b = 20; byte c = a + b;` fails compilation (`possible lossy conversion from int to byte`). Cast the evaluated expression: `byte c = (byte)(a + b);`.
- **Narrowing Overflow:** Casting integers outside a type's range wraps around in two's-complement without warning: `(byte) 130` evaluates to `-126`.
- **Truncation vs Rounding:** Explicit casting `(int) 4.9` truncates down to `4`. If mathematical rounding is desired, use `Math.round(4.9)` before casting.

---

## Example

```java
public class CastingDemo {
    public static void main(String[] args) {
        // Automatic widening
        int rawScore = 95;
        double weightedScore = rawScore;
        System.out.println("Widened double : " + weightedScore);

        // Explicit narrowing with truncation
        double transactionAmount = 149.85;
        int dollarsOnly = (int) transactionAmount;
        System.out.println("Truncated int  : " + dollarsOnly);

        // String parsing
        String portString = "8080";
        int portNumber = Integer.parseInt(portString);
        System.out.println("Parsed port    : " + portNumber);

        // Binary promotion in bytes
        byte b1 = 50;
        byte b2 = 50;
        byte result = (byte)(b1 + b2);
        System.out.println("Byte sum       : " + result);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Widened double : 95.0
Truncated int  : 149
Parsed port    : 8080
Byte sum       : 100
```
</details>

---

## Practice

### Q: Why does `byte b = 10; b = b + 1;` fail to compile, but `b += 1;` succeeds?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** In `b + 1`, the literal `1` is an `int`, causing `b` to be promoted to `int` and yielding an `int` result that cannot be assigned to `byte` without a cast. Compound assignment operators (`+=`, `-=`, etc.) automatically insert an implicit narrowing cast equivalent to `b = (byte)(b + 1);`.
</details>
