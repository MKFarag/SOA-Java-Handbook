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
readingTime: 11 min read
shortDescription: >-
  Master arithmetic, relational, logical, bitwise, and ternary operators.
  Understand prefix vs postfix increment, short-circuit evaluation, and operator
  precedence.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
relevanceLevel: MUST-KNOW / CORE
---
> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

An **operator** is a special character or symbol that performs specific mathematical, relational, or logical transformations on one, two, or three **operands** (variables or values) and produces a new result. An **expression** is any valid combination of variables, literals, method calls, and operators that evaluates to a single value.

Java provides a rich set of operators categorized by their function:
1. **Arithmetic:** Addition, subtraction, multiplication, division, and remainder (`+`, `-`, `*`, `/`, `%`).
2. **Unary:** Modifying a single value, including prefix/postfix increment and decrement (`++`, `--`, `+`, `-`, `!`, `~`).
3. **Relational:** Comparing two values to yield a boolean (`==`, `!=`, `<`, `>`, `<=`, `>=`).
4. **Logical:** Boolean logic combinations with short-circuiting (`&&`, `||`, `!`).
5. **Ternary:** Compact conditional decision operator (`? :`).
6. **Bitwise & Shift:** Operating directly on individual bits (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`).
7. **Assignment:** Assigning and mutating variables (`=`, `+=`, `-=`, `*=`, `/=`, `%=`).

### The Real-World Analogy
Think of operators as tools on an assembly workbench:
- An arithmetic operator is a measuring scale or saw that cuts and measures physical material.
- A relational operator is a quality inspection caliper: it checks whether a bolt is wider than 5mm and stamps a `true` or `false` inspection ticket.
- A logical operator is a safety system with multiple interlocks: the conveyor belt only moves if the guard rail is down **AND** the emergency stop button is **NOT** pressed.

### Why Does This Exist?
Software fundamentally processes data: computing bank interest, calculating game physics, validating user credentials, and toggling security permission bits. Operators provide the core vocabulary for instructing the CPU's Arithmetic Logic Unit (ALU).

---

## 2. Prerequisites
- **Topic 04: Variables, Identifiers & Primitive Data Types** (Understanding `int`, `double`, `boolean`).

---

## 3. Syntax Breakdown & Operator Precedence

### 1. Integer Division vs Floating-Point Division
In Java, if both operands are integers, the division operator `/` performs **integer truncation**, throwing away any fractional remainder:
- `7 / 2` evaluates to `3` (not `3.5`).
- `7.0 / 2` or `7 / 2.0` evaluates to `3.5`.

### 2. Prefix vs Postfix (`++i` vs `i++`)
- **Prefix (`++i`):** Increments `i` by 1 **before** the variable's value is used in the enclosing expression.
- **Postfix (`i++`):** Uses the current value of `i` in the enclosing expression **first**, and increments `i` by 1 immediately afterward.

### 3. Logical Short-Circuiting (`&&` and `||`)
- **`&&` (Short-Circuit AND):** If the left operand evaluates to `false`, the right operand is **never executed** (because the entire expression cannot possibly be true).
- **`||` (Short-Circuit OR):** If the left operand evaluates to `true`, the right operand is **never executed** (because the entire expression is already guaranteed true).
- **`&` and `|` (Eager Logical / Bitwise):** Always evaluates both sides, even if the result is already determined.

### 4. Operator Precedence Table (High to Low)

| Precedence Level | Operators | Description | Associativity |
| :--- | :--- | :--- | :--- |
| **1 (Highest)** | `()`, `[]`, `.` | Grouping, array indexing, member access | Left to Right |
| **2** | `++`, `--`, `+`, `-`, `!`, `~` | Unary pre-increment, sign, logical NOT | Right to Left |
| **3** | `*`, `/`, `%` | Multiplicative (arithmetic) | Left to Right |
| **4** | `+`, `-` | Additive (arithmetic & string concatenation) | Left to Right |
| **5** | `<<`, `>>`, `>>>` | Bitwise shift (signed and unsigned) | Left to Right |
| **6** | `<`, `<=`, `>`, `>=`, `instanceof` | Relational comparisons | Left to Right |
| **7** | `==`, `!=` | Equality comparisons | Left to Right |
| **8** | `&` | Bitwise / boolean eager AND | Left to Right |
| **9** | `^` | Bitwise / boolean exclusive OR (XOR) | Left to Right |
| **10** | `|` | Bitwise / boolean eager OR | Left to Right |
| **11** | `&&` | Logical short-circuit AND | Left to Right |
| **12** | `||` | Logical short-circuit OR | Left to Right |
| **13** | `? :` | Ternary conditional | Right to Left |
| **14 (Lowest)** | `=`, `+=`, `-=`, `*=`, `/=`, `%=` | Assignment operators | Right to Left |

### Math Utilities Reference: `java.lang.Math`

When basic operators (`+`, `-`, `*`, `/`, `%`) are insufficient for algorithmic and scientific calculations, Java provides `java.lang.Math` containing static, thread-safe utility methods and mathematical constants (`Math.PI`, `Math.E`):

| Method | Parameter Types | Returns | Mathematical Operation | Example Invocation | Result | Notes & Edge Cases |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **`Math.abs(x)`** | `int`, `long`, `float`, `double` | Same type | Absolute value $\|x\|$ | `Math.abs(-42)` | `42` | **Warning:** `Math.abs(Integer.MIN_VALUE)` overflows and returns `Integer.MIN_VALUE`! |
| **`Math.max(a, b)`** | `int`, `long`, `float`, `double` | Same type | Greater of two numbers | `Math.max(10, 25)` | `25` | Returns `NaN` if either operand is `Float.NaN` / `Double.NaN`. |
| **`Math.min(a, b)`** | `int`, `long`, `float`, `double` | Same type | Lesser of two numbers | `Math.min(10, 25)` | `10` | Follows IEEE 754 floating-point specifications. |
| **`Math.pow(a, b)`** | `double a, double b` | `double` | Base $a$ raised to exponent $b$ ($a^b$) | `Math.pow(2.0, 8.0)` | `256.0` | Both arguments are converted to `double`. |
| **`Math.sqrt(x)`** | `double x` | `double` | Principal square root $\sqrt{x}$ | `Math.sqrt(49.0)` | `7.0` | Returns `Double.NaN` if $x < 0.0$. |
| **`Math.round(x)`** | `float` $\rightarrow$ `int`<br>`double` $\rightarrow$ `long` | `int` / `long` | Rounds to nearest whole integer | `Math.round(4.6)`<br>`Math.round(4.4)` | `5`<br>`4` | Adds $0.5$ and executes `floor()`. Ties round towards positive infinity. |
| **`Math.floor(x)`** | `double x` | `double` | Largest integer $\le x$ | `Math.floor(4.9)`<br>`Math.floor(-4.1)` | `4.0`<br>`-5.0` | Rounds downwards towards negative infinity. |
| **`Math.ceil(x)`** | `double x` | `double` | Smallest integer $\ge x$ | `Math.ceil(4.1)`<br>`Math.ceil(-4.9)` | `5.0`<br>`-4.0` | Rounds upwards towards positive infinity. |
| **`Math.random()`** | None | `double` | Pseudorandom value $\in [0.0, 1.0)$ | `(int)(Math.random() * 100)` | `0 to 99` | Backed by internal `Random` instance. Inclusive of 0.0, exclusive of 1.0. |
| **`Math.clamp(v, min, max)`** *(Java 21+)* | `int`, `long`, `float`, `double` | Same type | Clamps value within `[min, max]` range | `Math.clamp(120, 0, 100)` | `100` | Eliminates verbose nested `Math.min(Math.max(...))` boilerplate. |
| **`Math.addExact(x, y)`** | `int`, `long` | Same type | Adds with integer overflow detection | `Math.addExact(2000000000, 1000000000)` | Throws `ArithmeticException` | Prevents silent two's-complement overflow wrap-arounds. |

---

### Financial & High-Precision Arithmetic with `BigDecimal`

In enterprise banking, e-commerce checkouts, and accounting systems, using primitive `float` or `double` is **strictly prohibited**.

#### Why `double` Loses Precision: The IEEE 754 Binary Floating-Point Flaw

Computers represent numbers using binary bits (base-2). Just as the fraction $\frac{1}{3}$ cannot be represented finitely in decimal notation ($0.333333\dots$), simple decimal fractions like $0.1 = \frac{1}{10}$ and $0.2 = \frac{1}{5}$ have **no finite representation in binary**:
$$0.1_{10} = 0.000110011001100110011\dots_2$$

Because IEEE 754 64-bit floating-point numbers must truncate after 53 mantissa bits, small rounding errors accumulate:
```java
// THE FLOATING POINT PRECISION DISASTER:
System.out.println(0.1 + 0.2); 
// Prints: 0.30000000000000004  (NOT 0.3!)

double price = 1.00;
double item = 0.90;
System.out.println(price - item);
// Prints: 0.09999999999999998  (A penny vanishes into thin air!)
```
In high-volume payment processing, accumulating fractional cents leads to reconciliation failures and regulatory accounting audit penalties.

#### Constructing `BigDecimal`: The Golden Rule

`java.math.BigDecimal` provides arbitrary-precision signed decimal numbers. However, **how you construct a `BigDecimal` makes the difference between exact math and corrupt data**:

| Constructor / Factory | Safe? | Code Example | Internal Stored Value | Verdict |
| :--- | :---: | :--- | :--- | :--- |
| **`new BigDecimal(String)`** | **YES** | `new BigDecimal("0.1")` | `0.1` | **Recommended.** Exact decimal string representation. |
| **`BigDecimal.valueOf(double)`** | **YES** | `BigDecimal.valueOf(0.1)` | `0.1` | **Recommended.** Converts double to canonical string before creation. |
| **`new BigDecimal(double)`** | ❌ **NO** | `new BigDecimal(0.1)` | `0.1000000000000000055511151231257827021181583404541015625` | ❌ **FORBIDDEN.** Directly embeds the imprecise IEEE 754 double value into `BigDecimal`! |

#### Comprehensive `BigDecimal` Core Methods Reference Table

`BigDecimal` instances are **immutable**. Every arithmetic method returns an entirely new `BigDecimal` instance:

| Method | Parameters | Returns | Description & Real-World Use Case |
| :--- | :--- | :---: | :--- |
| **`.add(augend)`** | `BigDecimal` | `BigDecimal` | Sum: this + augend. |
| **`.subtract(subtrahend)`** | `BigDecimal` | `BigDecimal` | Difference: this - subtrahend. |
| **`.multiply(multiplicand)`** | `BigDecimal` | `BigDecimal` | Product: this $\times$ multiplicand. Scale of result = `this.scale() + multiplicand.scale()`. |
| **`.divide(divisor, scale, roundingMode)`** | `BigDecimal, int, RoundingMode` | `BigDecimal` | Quotient: this $\div$ divisor, rounded to `scale` decimal places using specified `RoundingMode`. |
| **`.setScale(newScale, roundingMode)`** | `int, RoundingMode` | `BigDecimal` | Adjusts decimal places, applying rounding rules for currency display (e.g. 2 decimal places for USD/EUR). |
| **`.compareTo(val)`** | `BigDecimal` | `int` | **Numerical comparison.** Returns `-1` if `< val`, `0` if numerical values equal, `1` if `> val`. Ignores scale differences. |
| **`.equals(obj)`** | `Object` | `boolean` | **Warning:** Compares both numerical value **and scale**. `new BigDecimal("2.0").equals(new BigDecimal("2.00"))` is `false`! Always use `.compareTo()` for equality. |

> [!WARNING] The Fatal Non-Terminating Division Exception
> Calling `a.divide(b)` without specifying a scale and rounding mode throws `java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.` whenever the division results in a repeating decimal (such as dividing $10$ by $3$):
> ```java
> BigDecimal a = new BigDecimal("10.00");
> BigDecimal b = new BigDecimal("3.00");
> 
> // CRASHES: ArithmeticException: Non-terminating decimal expansion!
> // BigDecimal broken = a.divide(b); 
> 
> // ROBUST FIX: Always supply scale and RoundingMode:
> BigDecimal safeResult = a.divide(b, 2, RoundingMode.HALF_UP); // Yields 3.33
> ```

#### Rounding Modes Cheat-Sheet (`java.math.RoundingMode`)

| Mode | Behavior | Example ($2.45 \rightarrow 1$ decimal) | Example ($2.44 \rightarrow 1$ decimal) | Best For |
| :--- | :--- | :---: | :---: | :--- |
| **`RoundingMode.HALF_UP`** | Standard commercial rounding. Rounds towards nearest neighbor, or away from zero if equidistant ($\ge 0.5$). | `2.5` | `2.4` | **Standard financial accounting, invoice calculations, and consumer checkouts.** |
| **`RoundingMode.HALF_EVEN`** | **Banker's Rounding.** Rounds towards nearest neighbor, or towards nearest even neighbor if equidistant. | `2.4` (even) | `2.4` | Minimizes statistical cumulative bias over millions of financial transactions (IEEE 754 default). |
| **`RoundingMode.DOWN`** | Truncation. Rounds towards zero (discards all trailing fractional digits). | `2.4` | `2.4` | Tax calculation floors, reward point thresholds. |
| **`RoundingMode.UP`** | Rounds away from zero. | `2.5` | `2.5` | Penalty fees, conservative liability estimates. |

#### Complete Production Financial Calculation Example

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class FinancialInvoiceCalculator {
    public static void main(String[] args) {
        BigDecimal unitPrice = BigDecimal.valueOf(19.99);
        BigDecimal quantity = BigDecimal.valueOf(3);
        BigDecimal discountRate = new BigDecimal("0.10"); // 10% discount
        BigDecimal salesTaxRate = new BigDecimal("0.0825"); // 8.25% state tax

        // 1. Subtotal = unitPrice * quantity
        BigDecimal subtotal = unitPrice.multiply(quantity);

        // 2. Discount amount = subtotal * discountRate (Round to 2 decimal places)
        BigDecimal discount = subtotal.multiply(discountRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal discountedSubtotal = subtotal.subtract(discount);

        // 3. Tax amount = discountedSubtotal * salesTaxRate
        BigDecimal tax = discountedSubtotal.multiply(salesTaxRate).setScale(2, RoundingMode.HALF_UP);

        // 4. Final Total = discountedSubtotal + tax
        BigDecimal total = discountedSubtotal.add(tax);

        // 5. Split bill among 3 payment cards (divide with scale and rounding)
        BigDecimal perPerson = total.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);

        System.out.printf("Subtotal           : $%s%n", subtotal);
        System.out.printf("Discount (10%%)     : -$%s%n", discount);
        System.out.printf("Discounted Subtotal: $%s%n", discountedSubtotal);
        System.out.printf("Tax (8.25%%)        : +$%s%n", tax);
        System.out.printf("Final Total        : $%s%n", total);
        System.out.printf("Split (3 persons)  : $%s each%n", perPerson);
    }
}
```

---

## 4. Fully Runnable Code Examples

### Example 1: Demonstrating Short-Circuiting, Prefix/Postfix, and Math Nuances
Demonstrates how operators behave in real expressions, including guarded null checks.

```java
// OperatorMechanics.java
public class OperatorMechanics {
    public static void main(String[] args) {
        // 1. Prefix vs Postfix
        int a = 5;
        int prefixResult = ++a; // a increments to 6, then prefixResult receives 6
        
        int b = 5;
        int postfixResult = b++; // postfixResult receives 5, then b increments to 6

        System.out.println("=== 1. Prefix vs Postfix ===");
        System.out.printf("Prefix  : a=%d, result=%d%n", a, prefixResult);
        System.out.printf("Postfix : b=%d, result=%d%n", b, postfixResult);

        // 2. Integer Division Truncation vs Double
        System.out.println("\n=== 2. Division Behavior ===");
        int intDiv = 7 / 2;
        double floatDiv = 7.0 / 2;
        int remainder = 7 % 2;
        System.out.println("7 / 2 (Integer)   = " + intDiv);
        System.out.println("7.0 / 2 (Floating)= " + floatDiv);
        System.out.println("7 % 2 (Remainder) = " + remainder);

        // 3. Short-Circuit Safety
        System.out.println("\n=== 3. Short-Circuit Evaluation ===");
        String username = null;
        // The right side is NOT executed because username != null is false.
        // If it used single '&', it would crash with NullPointerException!
        boolean isValid = (username != null) && (username.length() > 3);
        System.out.println("Safely checked null string without crash: " + isValid);
    }
}
```

<details data-type="output">
<summary>⚡ View Terminal Output</summary>

```text
=== 1. Prefix vs Postfix ===
Prefix  : a=6, result=6
Postfix : b=6, result=5

=== 2. Division Behavior ===
7 / 2 (Integer)   = 3
7.0 / 2 (Floating)= 3.5
7 % 2 (Remainder) = 1

=== 3. Short-Circuit Evaluation ===
Safely checked null string without crash: false
```
</details>

---

### Example 2: Practical Bitmask Security Permission System
A production-style bitwise permission manager utilizing bit-shifts (`<<`), bitwise OR (`|`), bitwise AND (`&`), and XOR (`^`).

```java
// SecurityPermissions.java
public class SecurityPermissions {
    // Permission bitmasks using bit-shift
    public static final int PERM_READ    = 1 << 0; // 0001 (1)
    public static final int PERM_WRITE   = 1 << 1; // 0010 (2)
    public static final int PERM_EXECUTE = 1 << 2; // 0100 (4)
    public static final int PERM_DELETE  = 1 << 3; // 1000 (8)

    public static void main(String[] args) {
        // Assign READ and WRITE permissions using bitwise OR (|)
        int userRole = PERM_READ | PERM_WRITE;

        System.out.println("==============================================");
        System.out.println("          BITMASK ACCESS CONTROL              ");
        System.out.println("==============================================");
        System.out.println("User Role Mask Binary: " + Integer.toBinaryString(userRole));

        // Check permissions using bitwise AND (&)
        boolean canRead = (userRole & PERM_READ) != 0;
        boolean canDelete = (userRole & PERM_DELETE) != 0;

        System.out.println("Has READ Access   : " + canRead);
        System.out.println("Has DELETE Access : " + canDelete);

        // Grant EXECUTE permission using bitwise OR (|=)
        userRole |= PERM_EXECUTE;
        boolean canExecute = (userRole & PERM_EXECUTE) != 0;
        System.out.println("After Grant -> Has EXECUTE Access: " + canExecute);

        // Revoke WRITE permission using bitwise AND with NOT (~PERM_WRITE)
        userRole &= ~PERM_WRITE;
        boolean canWriteAfterRevoke = (userRole & PERM_WRITE) != 0;
        System.out.println("After Revoke -> Has WRITE Access : " + canWriteAfterRevoke);
        System.out.println("==============================================");
    }
}
```

<details data-type="output">
<summary>⚡ View Terminal Output</summary>

```text
==============================================
          BITMASK ACCESS CONTROL              
==============================================
User Role Mask Binary: 11
Has READ Access   : true
Has DELETE Access : false
After Grant -> Has EXECUTE Access: true
After Revoke -> Has WRITE Access : false
==============================================
```
</details>

<details data-type="trace">
<summary>🔍 Step-by-Step Execution Analysis</summary>

1. **Prefix Evaluation (`++a`):**
   - The variable `a` is fetched from stack slot 1.
   - The CPU executes an `iadd` instruction, incrementing the value in place.
   - The updated value (`6`) is pushed onto the operand stack and assigned to `prefixResult`.
2. **Postfix Evaluation (`b++`):**
   - The initial value of `b` (`5`) is duplicated onto the operand stack.
   - The local variable `b` in stack slot 2 is incremented to `6`.
   - The older duplicated value (`5`) is assigned to `postfixResult`.
3. **Short-Circuit Evaluation (`&&`):**
   - The expression `(username != null)` evaluates to `false`.
   - The bytecode contains a conditional jump instruction (`ifeq`). Because the condition is already false, the CPU branches immediately past the second operand, skipping `username.length()` completely.
   - This prevents a fatal `NullPointerException`.
</details>

---

## 6. Common Mistakes & Compiler / Runtime Errors

### Mistake 1: Accidental Integer Truncation in Math Expressions
```java
// WRONG:
int score = 85;
int total = 100;
double percentage = (score / total) * 100; // Evaluates to 0.0!
```
- **Cause:** `score / total` evaluates to `85 / 100`, which integer-truncates to `0`. `0 * 100` is `0`.
- **Fix:** Cast at least one operand to `double`: `double percentage = ((double) score / total) * 100;`.

### Mistake 2: Single `&` vs Double `&&` Guarding Null References
```java
// DANGEROUS BUG:
if (str != null & str.length() > 0) { ... } // CRASHES with NullPointerException!
```
- **Cause:** Single `&` is an eager logical operator. It evaluates **both** sides even when `str` is `null`.
- **Fix:** Always use double `&&` for boolean conditions: `if (str != null && str.length() > 0)`.

### Mistake 3: Equality Comparison with Strings (`==` vs `.equals()`)
```java
// WRONG:
String input = new String("admin");
if (input == "admin") { ... } // Evaluates to FALSE!
```
- **Cause:** `==` compares object memory references (addresses), NOT the textual content.
- **Fix:** Always use `.equals()` for comparing strings or objects: `if ("admin".equals(input))`.

---

## 7. Best Practices & Anti-Patterns

### Best Practices (DO):
- **Use parentheses for clarity:** Even if you memorized operator precedence, write `(a * b) + c` instead of `a * b + c` to make your code instantly readable to other engineers.
- **Always use `&&` and `||` for conditionals:** Rely on short-circuiting to guard against null checks and expensive method calls.
- **Use the ternary operator only for simple expressions:** `int max = (a > b) ? a : b;` is clean; nested ternaries (`a ? b : c ? d : e`) are an anti-pattern.

### Anti-Patterns (DON'T):
- **Never embed mutating side-effects inside logical conditions:** `if (isValid && count++ > 5)` is dangerous because `count++` might never run if `isValid` is false, leading to subtle bugs.
- **Never rely on the order of multiple increment operations:** Expressions like `x = x++ + ++x;` produce confusing bytecode and are forbidden in clean code guidelines.

---

## 8. Version Notes & Compatibility Matrix

- **Java 1.0:** Defined standard arithmetic, unary, bitwise, relational, and ternary operators.
- **Java 14:** Enhanced the `switch` statement with arrow `->` expressions and the `yield` statement.
- **Java 16:** Introduced Pattern Matching for `instanceof`, combining type checking and casting into a single operator expression.

---

## 9. Summary Cheat Sheet

| Operator | Type | Behavior | Example | Result |
| :--- | :--- | :--- | :--- | :--- |
| `+`, `-`, `*` | Arithmetic | Standard math operations | `10 * 3` | `30` |
| `/` | Arithmetic | Integer truncation if both ints | `9 / 2` | `4` |
| `%` | Arithmetic | Remainder after division | `9 % 2` | `1` |
| `++` | Unary | Increments value by 1 | `x++` or `++x` | Mutates `x` |
| `==`, `!=` | Relational | Equality / Inequality | `5 == 5` | `true` |
| `&&` | Logical | Short-circuit AND (stops on false) | `false && x()` | `false` (x not called) |
| `||` | Logical | Short-circuit OR (stops on true) | `true || x()` | `true` (x not called) |
| `? :` | Ternary | Conditional inline expression | `(5 > 3) ? 1 : 2` | `1` |
| `&`, `|`, `^` | Bitwise | Bit-level AND, OR, XOR | `5 & 1` | `1` |
| `<<`, `>>` | Shift | Left shift (x2), Right shift (/2) | `1 << 3` | `8` |

---

## 10. Graded Interactive Practice Exercises

### Exercise 1: Spot the Logic Trap
**Prompt:** What does this code print?
```java
int x = 10;
if (x > 5 || ++x > 10) {
    System.out.println("x is " + x);
}
```

<details data-type="solution">
<summary>👁 Reveal Solution & Explanation</summary>

> **Output:** `x is 10`  
> **Explanation:** Because of short-circuit evaluation, the left side `(x > 5)` evaluates to `true`. Because the operator is `||` (OR), the entire condition is already satisfied. The right side `(++x > 10)` is **never executed**, so `x` remains `10`.
</details>

---

### Exercise 2: Hands-on Implementation Challenge
**Prompt:** Write a program named `EvenOddChecker` that uses the ternary operator `? :` and modulus `%` to check if a number `int n = 47;` is even or odd, printing `"47 is Odd"`.

#### Starter Code
```java
public class EvenOddChecker {
    public static void main(String[] args) {
        int n = 47;
        // Use ternary operator to determine even or odd
    }
}
```

<details data-type="solution">
<summary>👁 Reveal Solution & Explanation</summary>

```java
public class EvenOddChecker {
    public static void main(String[] args) {
        int n = 47;
        String status = (n % 2 == 0) ? "Even" : "Odd";
        System.out.println(n + " is " + status);
    }
}
```

> **Explanation:** The modulus operator `n % 2` returns `0` for even numbers and `1` (or `-1` for negative numbers) for odd numbers. The ternary operator evaluates the condition and returns the corresponding string.
</details>

---

### Exercise 3: Real-World Architecture Challenge: Unsigned Right Shift (`>>>`)
**Prompt:** What is the difference between the arithmetic right shift (`>>`) and the unsigned right shift (`>>>`) in Java? Why does this matter for network protocol parsers?

<details data-type="solution">
<summary>👁 Reveal Solution & Explanation</summary>

> **Explanation:**  
> - **Arithmetic Right Shift (`>>`):** Preserves the sign bit. If the number is negative, it fills the newly opened left bits with `1`s.  
> - **Unsigned Right Shift (`>>>`):** Always fills the left bits with `0`s, regardless of whether the number is positive or negative.  
> **Why it matters:** In network protocols and cryptography (e.g. parsing raw IPv4 packet headers or SHA-256 hashes), bytes represent unsigned raw binary values. If an engineer uses `>>` on an unsigned byte with the top bit set, sign extension corrupts the packet data. Using `>>>` guarantees clean zero-filled bit shifting.
</details>

---

## 11. Verified Official Sources
- [Oracle Java SE Documentation: Operators](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html)
- [dev.java: Expressions and Operators](https://dev.java/learn/language-basics/operators/)
- [Java Language Specification: Chapter 15 Expressions](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html)
