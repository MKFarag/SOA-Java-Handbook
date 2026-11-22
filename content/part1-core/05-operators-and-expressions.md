---
id: topic-05
slug: operators-and-expressions
topicNumber: 5
title: Operators & Expressions
part: 'Part 1: Java Core'
sectionNumber: 2
sectionTitle: Language Basics & Data Types
versionBadge: Java 8+
difficulty: Beginner
readingTime: 6 min read
shortDescription: >-
  Reference: arithmetic, relational, logical, bitwise, shift, ternary operators, and the complete precedence hierarchy.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
---

## Overview
Operators evaluate expressions across variables and literals, governed by operand type rules, associativity, and a 14-level precedence hierarchy.

---

## Operator Categories

| Category | Operators | Description | Example | Result |
| :--- | :--- | :--- | :--- | :--- |
| **Arithmetic** | `+`, `-`, `*`, `/`, `%` | Basic mathematical operations and remainder | `7 % 3` | `1` |
| **Unary** | `++`, `--`, `+`, `-`, `!`, `~` | Increment/decrement, sign negation, logical NOT, bitwise NOT | `!false`, `~0` | `true`, `-1` |
| **Relational** | `==`, `!=`, `<`, `>`, `<=`, `>=` | Binary comparisons; returns `boolean` | `10 >= 5` | `true` |
| **Logical** | `&&`, `||`, `!` | Short-circuit boolean combinations | `true && false` | `false` |
| **Ternary** | `? :` | Compact inline conditional expression | `(x > 0) ? 1 : -1` | `1` |
| **Bitwise / Shift** | `&`, `|`, `^`, `<<`, `>>`, `>>>` | Bit-level operations and signed/unsigned shifts | `1 << 3` | `8` |
| **Assignment** | `=`, `+=`, `-=`, `*=`, `/=`, `%=` | Evaluate and assign in-place | `x += 5` | `x = x + 5` |

---

## Precedence Hierarchy (High to Low)

| Level | Operators | Description | Associativity |
| :---: | :--- | :--- | :---: |
| **1 (Highest)** | `()`, `[]`, `.` | Grouping parentheses, array indexing, member access | Left to Right |
| **2** | `++`, `--`, `+`, `-`, `!`, `~` | Unary pre-increment/decrement, sign, logical/bitwise NOT | Right to Left |
| **3** | `*`, `/`, `%` | Multiplication, division, modulo | Left to Right |
| **4** | `+`, `-` | Addition, subtraction, string concatenation | Left to Right |
| **5** | `<<`, `>>`, `>>>` | Signed left shift, signed right shift, unsigned right shift | Left to Right |
| **6** | `<`, `<=`, `>`, `>=`, `instanceof` | Relational comparisons and type inspection | Left to Right |
| **7** | `==`, `!=` | Equality and inequality | Left to Right |
| **8** | `&` | Bitwise AND / Eager boolean AND | Left to Right |
| **9** | `^` | Bitwise XOR / Eager boolean XOR | Left to Right |
| **10** | `|` | Bitwise OR / Eager boolean OR | Left to Right |
| **11** | `&&` | Logical short-circuit AND | Left to Right |
| **12** | `||` | Logical short-circuit OR | Left to Right |
| **13** | `? :` | Ternary conditional | Right to Left |
| **14 (Lowest)** | `=`, `+=`, `-=`, `*=`, `/=`, `%=` | Assignment operators | Right to Left |

---

## Core Mechanics

### Integer Truncation vs Floating-Point Division
```java
int a = 7 / 2;       // 3   (fractional part discarded)
double b = 7.0 / 2;  // 3.5 (promoted to double)
int rem = 7 % 2;     // 1   (remainder)
```

### Prefix vs Postfix
- **Prefix (`++i`):** Increments variable first, then yields the incremented value to the enclosing expression.
- **Postfix (`i++`):** Yields the current value to the enclosing expression first, then increments variable in memory.

### Short-Circuit Evaluation
- `&&` halts evaluation immediately if the left operand is `false` (right side is never executed).
- `||` halts evaluation immediately if the left operand is `true` (right side is never executed).
- `&` and `|` always evaluate both sides unconditionally.

---

## Pitfalls

- **Accidental Integer Division:** `double pct = (score / total) * 100;` yields `0.0` if both are integers. Cast at least one operand: `((double) score / total) * 100`.
- **Eager `&` in Guard Conditions:** Writing `str != null & str.length() > 0` causes a `NullPointerException` when `str` is null because single `&` evaluates the right side. Always use `&&`.
- **Using `==` on Objects:** `==` verifies reference memory addresses. For object and string equality, use `.equals()`.

---

## Example

```java
public class OperatorsDemo {
    public static final int PERM_READ  = 1 << 0; // 0001 (1)
    public static final int PERM_WRITE = 1 << 1; // 0010 (2)

    public static void main(String[] args) {
        // Safe short-circuit null guard
        String token = null;
        boolean isValid = (token != null) && (token.length() > 3);
        System.out.println("Null guard passed safely: " + isValid);

        // Bitmask permission flags
        int userPerms = PERM_READ | PERM_WRITE;
        boolean canRead = (userPerms & PERM_READ) != 0;
        userPerms &= ~PERM_WRITE; // Revoke WRITE

        System.out.printf("Has READ: %b | Has WRITE: %b%n",
                canRead, (userPerms & PERM_WRITE) != 0);

        // Ternary conditional
        int score = 75;
        String status = (score >= 60) ? "PASS" : "FAIL";
        System.out.println("Result: " + status);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Null guard passed safely: false
Has READ: true | Has WRITE: false
Result: PASS
```
</details>

---

## Practice

### Q: What is the output of the following code and why?
```java
int x = 10;
if (x > 5 || ++x > 10) {
    System.out.println("x = " + x);
}
```
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Output:** `x = 10`  
> **Explanation:** Because `(x > 5)` evaluates to `true`, the short-circuit `||` operator skips the second condition (`++x > 10`). The variable `x` is never incremented.
</details>
