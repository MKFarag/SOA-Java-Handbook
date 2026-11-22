---
id: topic-11
slug: conditional-statements
topicNumber: 11
title: Conditional Statements
part: 'Part 1: Java Core'
sectionNumber: 3
sectionTitle: Control Flow & Logic
versionBadge: Java 8+
difficulty: Beginner
readingTime: 6 min read
shortDescription: >-
  Reference: Dynamic runtime branching with if, else if, else, ternary expressions, short-circuit evaluation, and control flow guarantees.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
  - 'Topic 05: Operators & Expressions'
---

## Overview
Conditional statements in Java divert execution flow at runtime based on the evaluation of boolean expressions. Unlike dynamically typed languages, Java strictly requires condition expressions to resolve to a primitive `boolean` or `Boolean` wrapper; numbers and objects cannot serve as truthy or falsy values.

---

## Syntax & Branching Architecture

```
                       [ Evaluate Condition ]
                                 │
                 ┌───────────────┴───────────────┐
             ( true )                        ( false )
                 │                               │
                 ▼                               ▼
         [ Execute Branch ]              [ Next Condition / else ]
                 │                               │
                 └───────────────┬───────────────┘
                                 ▼
                     [ Continue Execution ]
```

### Statement Formats

```java
// 1. Single Branch
if (condition) {
    // Executes only if condition is true
}

// 2. Dual Branch
if (condition) {
    // Primary path
} else {
    // Alternative path
}

// 3. Multi-Branch Ladder (Mutually Exclusive)
if (conditionA) {
    // Branch A
} else if (conditionB) {
    // Branch B (checked only if conditionA is false)
} else {
    // Fallback branch
}

// 4. Ternary Conditional Expression
variable = (condition) ? valueIfTrue : valueIfFalse;
```

---

## Key Characteristics & Evaluation Rules

| Feature | Rule / Behavior | Code Example |
| :--- | :--- | :--- |
| **Type Constraint** | Expression must strictly evaluate to `boolean` | `if (status == 1)` valid; `if (status)` invalid |
| **Short-Circuit Logic** | Left-to-right evaluation terminates as soon as outcome is certain | `if (user != null && user.isActive())` prevents NPE |
| **Block Scope** | Variables declared inside braces `{}` exist only within that branch | `{ int temp = 10; } // temp unreachable outside` |
| **Ternary Typing** | Both branches of `? :` must conform to a common target type | `Number n = flag ? 1 : 2.5; // Autoboxed to Double` |

---

## Implementation Example

```java
public class TieredFeeCalculator {
    public static void main(String[] args) {
        double transactionAmount = 1450.00;
        boolean isEnterpriseClient = true;
        double processingFeeRate;

        // Mutually exclusive boundary evaluation
        if (transactionAmount >= 5000.0) {
            processingFeeRate = 0.010; // 1.0%
        } else if (transactionAmount >= 1000.0) {
            processingFeeRate = isEnterpriseClient ? 0.012 : 0.018; // 1.2% vs 1.8%
        } else {
            processingFeeRate = 0.025; // 2.5%
        }

        double fee = transactionAmount * processingFeeRate;
        double netSettlement = transactionAmount - fee;

        System.out.printf("Gross Amount  : $%,10.2f%n", transactionAmount);
        System.out.printf("Fee Rate      : %10.2f%%%n", processingFeeRate * 100.0);
        System.out.printf("Processing Fee: $%,10.2f%n", fee);
        System.out.printf("Net Settlement: $%,10.2f%n", netSettlement);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Gross Amount  : $  1,450.00
Fee Rate      :       1.20%
Processing Fee: $     17.40
Net Settlement: $  1,432.60
```
</details>

---

## Pitfalls

- **Assignment Instead of Comparison:** Writing `if (isValid = true)` accidentally assigns `true` to `isValid` and evaluates to `true`. With booleans, compare using `if (isValid)` directly rather than `if (isValid == true)`.
- **Dangling Else Trap:** Omitting curly braces binds an `else` to the closest preceding `if`, producing silent logic divergence:
  ```java
  // BUG: The else attaches to innerIf, not outerIf!
  if (outer)
      if (inner) doA();
  else doB();

  // FIX: Always use explicit curly braces
  if (outer) {
      if (inner) { doA(); }
  } else {
      doB();
  }
  ```
- **Null Reference Before Field Access:** Reversing operands in logical AND without null guarding throws `NullPointerException`:
  ```java
  // DANGEROUS: Throws NPE if customer is null
  if (customer.isVerified() && customer != null)
  // SAFE: Relies on short-circuit evaluation
  if (customer != null && customer.isVerified())
  ```
- **Overusing Nested Ternaries:** Chaining more than one ternary operator impairs maintainability and complicates code coverage analysis.

---

## Practice

### Question
Given the following method, what does `checkStatus(false, true)` print?
```java
public static void checkStatus(boolean flagA, boolean flagB) {
    if (flagA)
        if (flagB)
            System.out.print("1");
    else
        System.out.print("2");
    System.out.print("3");
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. Because braces `{}` are omitted, the `else` binds to the immediately preceding `if (flagB)`, not `if (flagA)`.
2. When `flagA` is `false`, the outer `if` condition fails entirely, skipping the inner `if-else` construct.
3. Execution proceeds immediately to the statement following the block: `System.out.print("3");`.
4. Output: `3`.

</details>
