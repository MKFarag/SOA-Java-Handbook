---
id: topic-28
slug: pattern-matching-for-switch-and-records
topicNumber: 28
title: Pattern Matching for Switch & Records
part: 'Part 1: Java Core'
sectionNumber: 8
sectionTitle: Modern Java Data Modeling
versionBadge: Java 21 LTS
difficulty: Intermediate
readingTime: 11 min read
shortDescription: >-
  Elevate expressiveness with modern pattern matching: type patterns, record
  deconstruction patterns, guarded patterns with when clauses, and exhaustive
  switch dispatch.
prerequisites:
  - 'Topic 09: Switch Statements & Switch Expressions'
  - 'Topic 26: Records'
  - 'Topic 27: Sealed Classes & Interfaces'
relevanceLevel: ADVANCED / DEEP-DIVE
---
> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

## 1. What It Is and Why It Exists

**Pattern Matching for `switch`** (finalized in **Java 21 LTS via JEP 441**) and **Record Patterns** (finalized in **Java 21 LTS via JEP 440**) fundamentally modernize Java's control flow.

Instead of testing only numbers and strings in switch statements, modern Java allows:
1. **Type Patterns:** Matching arbitrary object types (`case String s`).
2. **Record Deconstruction Patterns:** Deconstructing a record into its constituent components directly inside the pattern (`case Point(int x, int y)`).
3. **Guarded Patterns (`when` clauses):** Attaching boolean conditions to patterns to refine matches (`case Integer i when i > 0`).
4. **Explicit `null` Handling:** Directly matching null references (`case null -> ...`).

### The Real-World Analogy
Think of an automated airport baggage inspection line:
- A generic scanner conveyor inspects luggage containers (**Arbitrary Objects**).
- **Type Pattern:** "If this is a Golf Bag, send to Oversized Luggage."
- **Record Pattern (Deconstruction):** "If this is a HardSuitcase containing `[Clothing, Electronics, Liquids]`, inspect the liquids volume directly without unpacking the entire suitcase."
- **Guarded Pattern (`when`):** "If this is a PassengerBag `when weight > 23kg`, apply the overweight surcharge tag."

### Why Does This Exist?
Prior to Java 21, extracting data from polymorphic objects required chains of `instanceof`, explicit downcasting, followed by repetitive getter calls. This boilerplate made complex data transformation logic hard to read and prone to `ClassCastException` and `NullPointerException`. Pattern matching combines type testing, extraction, and conditional filtering into a single declarative construct.

---

## 2. Prerequisites
- **Topic 09: Switch Statements & Switch Expressions**
- **Topic 26: Records**
- **Topic 27: Sealed Classes & Interfaces**

---

## 3. Syntax Breakdown & Guarded Patterns

### Anatomy of Pattern Matching in Switch
```java
return switch (obj) {
    case null -> "Handled null gracefully";
    case Integer i when i < 0 -> "Negative int: " + i;
    case Point(int x, int y) -> "Coordinates: (" + x + ", " + y + ")";
    case String s -> "String of length: " + s.length();
    default -> "Fallback";
};
```

| Pattern Component | Example Syntax | Role |
| :--- | :--- | :--- |
| **Type Pattern** | `case String s` | Tests if `obj instanceof String` and binds variable `s`. |
| **Record Pattern** | `case Point(int x, int y)` | Deconstructs record components directly into local variables `x` and `y`. |
| **Guarded Pattern** | `case Type t when predicate` | Matches only if type matches AND the `when` boolean condition evaluates to `true`. |
| **Null Case** | `case null` | Explicitly handles null values without throwing `NullPointerException`. |

---

## 4. Runnable Code Examples

### Example 1: Type Patterns, Guarded `when` Clauses & Record Deconstruction
```java
// File: examples/core/PatternMatchingMechanics.java
public class PatternMatchingMechanics {

    public record Point(int x, int y) {}
    public record Transaction(String id, double amount) {}

    public static String inspectValue(Object obj) {
        return switch (obj) {
            case null -> "Received NULL reference";
            case Integer i when i < 0 -> "Negative integer: " + i;
            case Integer i -> "Positive integer or zero: " + i;
            case String s when s.isBlank() -> "Blank string";
            case String s -> "String of length " + s.length() + ": '" + s + "'";
            case Point(int x, int y) -> String.format("Point coordinates: (x=%d, y=%d)", x, y);
            case Transaction(String id, double amt) when amt > 10_000.0 ->
                String.format("HIGH VALUE Transaction %s for $%.2f", id, amt);
            case Transaction(String id, double amt) ->
                String.format("Standard Transaction %s for $%.2f", id, amt);
            default -> "Unhandled object type: " + obj.getClass().getSimpleName();
        };
    }

    public static void main(String[] args) {
        System.out.println("=== Java 21+ Pattern Matching for Switch & Records ===");

        System.out.println(inspectValue(null));
        System.out.println(inspectValue(-42));
        System.out.println(inspectValue(100));
        System.out.println(inspectValue("   "));
        System.out.println(inspectValue("Modern Java"));
        System.out.println(inspectValue(new Point(10, 25)));
        System.out.println(inspectValue(new Transaction("TXN-001", 500.0)));
        System.out.println(inspectValue(new Transaction("TXN-002", 50_000.0)));
    }
}
```

#### Expected Output
```text
=== Java 21+ Pattern Matching for Switch & Records ===
Received NULL reference
Negative integer: -42
Positive integer or zero: 100
Blank string
String of length 11: 'Modern Java'
Point coordinates: (x=10, y=25)
Standard Transaction TXN-001 for $500.00
HIGH VALUE Transaction TXN-002 for $50000.00
```

---

### Example 2: Realistic Application (Financial Event Deconstruction Router)
```java
// File: examples/core/FinancialEventMatcherApp.java
public class FinancialEventMatcherApp {

    public sealed interface FinancialEvent permits DepositEvent, TradeExecutionEvent, FraudAlertEvent {}

    public record DepositEvent(String accountId, double amount, String currency) implements FinancialEvent {}
    public record TradeExecutionEvent(String ticker, int quantity, double pricePerShare) implements FinancialEvent {}
    public record FraudAlertEvent(String accountId, String severityLevel, String reason) implements FinancialEvent {}

    public static String routeFinancialEvent(FinancialEvent event) {
        return switch (event) {
            case DepositEvent(String acc, double amt, String curr) when amt >= 100_000.0 ->
                String.format("[AML AUDIT REQUIRED] Large deposit of %s %.2f to %s", curr, amt, acc);

            case DepositEvent(String acc, double amt, String curr) ->
                String.format("[DEPOSIT CONFIRMED] Credited %s %.2f to account %s", curr, amt, acc);

            case TradeExecutionEvent(String ticker, int qty, double price) when (qty * price) >= 500_000.0 ->
                String.format("[BLOCK TRADE] %d shares of %s executed at $%.2f (Notional: $%.2f)",
                        qty, ticker, price, qty * price);

            case TradeExecutionEvent(String ticker, int qty, double price) ->
                String.format("[RETAIL TRADE] %d shares of %s at $%.2f", qty, ticker, price);

            case FraudAlertEvent(String acc, String sev, String reason) when sev.equalsIgnoreCase("CRITICAL") ->
                String.format("[SECURITY LOCKDOWN] Freezing account %s immediately! Reason: %s", acc, reason);

            case FraudAlertEvent(String acc, String sev, String reason) ->
                String.format("[WARNING] Flagging account %s (%s): %s", acc, sev, reason);
        };
    }

    public static void main(String[] args) {
        System.out.println("=== Financial Event Router with Record Patterns ===");

        FinancialEvent e1 = new DepositEvent("ACC-901", 150_000.0, "USD");
        FinancialEvent e2 = new DepositEvent("ACC-902", 500.0, "EUR");
        FinancialEvent e3 = new TradeExecutionEvent("NVDA", 5_000, 130.0);
        FinancialEvent e4 = new FraudAlertEvent("ACC-774", "CRITICAL", "Concurrent logins from Nigeria and Japan");

        System.out.println(routeFinancialEvent(e1));
        System.out.println(routeFinancialEvent(e2));
        System.out.println(routeFinancialEvent(e3));
        System.out.println(routeFinancialEvent(e4));
    }
}
```

#### Expected Output
```text
=== Financial Event Router with Record Patterns ===
[AML AUDIT REQUIRED] Large deposit of USD 150000.00 to ACC-901
[DEPOSIT CONFIRMED] Credited EUR 500.00 to account ACC-902
[BLOCK TRADE] 5000 shares of NVDA executed at $130.00 (Notional: $650000.00)
[SECURITY LOCKDOWN] Freezing account ACC-774 immediately! Reason: Concurrent logins from Nigeria and Japan
```

---

## 5. Step-by-Step Execution Trace

When evaluating `routeFinancialEvent(e1)`:

```text
1. Input Evaluation:
   - Object e1 is of runtime type DepositEvent("ACC-901", 150_000.0, "USD").

2. Pattern Matching Clause 1:
   - Matches record pattern 'DepositEvent(String acc, double amt, String curr)'? YES.
   - Binds: acc = "ACC-901", amt = 150000.0, curr = "USD".
   - Evaluates guard: 'when amt >= 100_000.0' -> (150000.0 >= 100000.0) is TRUE.
   - Clause 1 matches completely!

3. Formatted Result Emitted:
   - "[AML AUDIT REQUIRED] Large deposit of USD 150000.00 to ACC-901"
   - Switch statement terminates without testing remaining clauses.
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Dominance Ordering Errors
```java
switch (obj) {
    case CharSequence cs -> ... // Broad type
    case String s -> ...        // COMPILE ERROR: this case label is dominated by a preceding case label
}
```
**Why it fails:** `String` is a subtype of `CharSequence`. Any string will always match the first clause, making the second clause unreachable dead code.
**How to fix:** Place more specific types and guarded patterns *before* general unguarded types:
```java
switch (obj) {
    case String s -> ...
    case CharSequence cs -> ...
}
```

### Mistake 2: Missing `case null` in Total Switch Statements
If a switch does not declare `case null` and receives a `null` argument, it immediately throws `NullPointerException` before matching `default:`.
**How to fix:** Explicitly handle null: `case null -> "Nothing";` or `case null, default -> ...`.

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Combine Sealed Hierarchies with Record Patterns:** Provides total exhaustiveness checking by the compiler without requiring defensive `default:` blocks.
2. **Use Guarded `when` Clauses for Business Logic:** Filter business thresholds (`when amt > 10_000.0`) cleanly within the case label.
3. **Deconstruct Nested Records Directly:** Java 21 allows deep nesting: `case Order(Customer(String name, _), double total) -> ...`.

### When NOT to Use
- **Do not write deep 10-level nested patterns:** If a pattern becomes wider than 80 characters, deconstruct the outer layer first and handle inner fields in the body.

---

## 8. Version Notes
- **Java 17/18 (JEP 406 & 420):** Pattern matching for switch previewed using early `&&` guard syntax (e.g. `case Triangle t && t.base() > 0`), which was later abandoned.
- **Java 19/20 (JEP 427 & 433):** Guard syntax transitioned to `when` clauses (`case Type t when condition`).
- **Java 21 LTS (JEP 440 & JEP 441):** Record Patterns (JEP 440) and Pattern Matching for `switch` (JEP 441) officially finalized as core stable language features with `when` guard clauses.
- **Java 22 (JEP 456):** Unnamed variables and patterns (`_`) finalized.

---

## 9. Summary Cheat Sheet

| Pattern | Syntax | Matching Rule |
| :--- | :--- | :--- |
| **Type Pattern** | `case String s` | Matches if `obj instanceof String` |
| **Record Pattern** | `case Point(int x, int y)` | Matches type and deconstructs fields |
| **Guarded Pattern** | `case Integer i when i > 0` | Matches type AND satisfies boolean condition |
| **Null Handling** | `case null` | Explicitly intercepts null before exception is thrown |
| **Dominance Rule** | Subtypes before Supertypes | Specific clauses must precede general clauses |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
Why does this switch statement fail compilation?
```java
Object o = "Test";
switch (o) {
    case Integer i -> System.out.println("Int");
    case Integer i when i > 100 -> System.out.println("Large Int"); // COMPILE ERROR
    default -> {}
}
```
<details>
<summary>View Solution</summary>

**Compiler Error:** `this case label is dominated by a preceding case label`.
**Explanation:** The unguarded `case Integer i` catches all integers, so the guarded `when i > 100` clause can never be reached.
**Fix:** Reverse the order: put `case Integer i when i > 100` first!
</details>

---

### Exercise 2: Hands-on Implementation
Write a method `String classify(Object obj)` that returns:
- `"Empty string"` for empty strings
- `"Text: <s"` for non-empty strings
- `"Negative: <i>"` for negative integers
- `"Zero or Positive: <i>"` for non-negative integers
- `"Null"` for null
- `"Other"` for all other types
<details>
<summary>View Solution</summary>

```java
public static String classify(Object obj) {
    return switch (obj) {
        case null -> "Null";
        case String s when s.isEmpty() -> "Empty string";
        case String s -> "Text: " + s;
        case Integer i when i < 0 -> "Negative: " + i;
        case Integer i -> "Zero or Positive: " + i;
        default -> "Other";
    };
}
```
</details>

---

### Exercise 3: Real-World Edge Case
Can pattern matching deconstruct a regular class, or only a Java `record`?
<details>
<summary>View Solution</summary>

**Answer:** Currently in Java 21+, deconstruction patterns (`case Point(int x, int y)`) work **strictly on Java Records**.
**Explanation:** Records have a compiler-guaranteed 1-to-1 correspondence between their constructor components and accessor methods, making transparent deconstruction safe. Arbitrary classes cannot be deconstructed with `(...)` patterns.
</details>

---

## 11. Official Sources & Specifications
- [OpenJDK JEP 440: Record Patterns](https://openjdk.org/jeps/440)
- [OpenJDK JEP 441: Pattern Matching for switch](https://openjdk.org/jeps/441)
- [Oracle Java Documentation: Pattern Matching for switch Expressions](https://docs.oracle.com/en/java/javase/21/language/pattern-matching-switch-expressions-and-statements.html)
