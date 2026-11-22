---
id: topic-23
slug: inheritance-and-method-overriding
topicNumber: 23
title: Inheritance & Method Overriding
part: 'Part 1: Java Core'
sectionNumber: 7
sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction'
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: IS-A inheritance hierarchies via extends, super() chaining, method overriding rules, covariant return types, and final modifiers.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 20: Constructors & Object Initialization'
---

## Overview
Inheritance models an **IS-A** relationship using the `extends` keyword, enabling a subclass to derive state and methods from a single superclass. Method overriding permits a subclass to provide a specialized implementation of an inherited non-final instance method with identical signature semantics.

---

## Overriding Invariants & Rules

```
                      Method Overriding Constraints
 ┌──────────────────────────────────────────────────────────────────┐
 │ 1. Signature Identical: Name and parameter types must match.     │
 │ 2. Visibility: Subclass CANNOT reduce visibility (can expand).   │
 │ 3. Return Type: Exact match or Covariant (Subtype of parent).    │
 │ 4. Exceptions: Cannot declare new or broader checked exceptions. │
 │ 5. Modifiers: Cannot override final, static, or private methods. │
 └──────────────────────────────────────────────────────────────────┘
```

| Dimension | Superclass Constraint | Subclass Overriding Rule |
| :--- | :--- | :--- |
| **Access Visibility** | `protected void process()` | Must be `protected` or `public` (never package-private or private) |
| **Return Type** | `Number calculate()` | Can return `Number`, `Integer`, or `Double` (Covariant Return) |
| **Checked Exceptions** | `throws IOException` | Can throw `IOException`, `FileNotFoundException` (subtype), or none |
| **`static` Methods** | `static void run()` | Hidden, NOT overridden (resolved via static binding) |
| **`final` Methods** | `final void lock()` | Cannot be overridden (compilation error) |

---

## Constructor Chaining with `super()`

A subclass constructor must delegate to a superclass constructor as its first statement. If omitted, the compiler automatically injects `super()`. If the superclass lacks a parameterless constructor, the subclass must explicitly invoke `super(args)` with matching parameters.

---

## Implementation Example

```java
public class InheritanceHierarchyDemo {
    public static class Worker {
        protected final String id;
        protected final double baseRate;

        public Worker(String id, double baseRate) {
            this.id = id;
            this.baseRate = baseRate;
        }

        public double calculateCompensation(int hours) {
            return baseRate * hours;
        }

        public Worker createCopy() {
            return new Worker(this.id, this.baseRate);
        }
    }

    public static class Contractor extends Worker {
        private final double overtimeMultiplier;

        public Contractor(String id, double baseRate, double overtimeMultiplier) {
            super(id, baseRate); // Explicit superclass constructor invocation
            this.overtimeMultiplier = overtimeMultiplier;
        }

        // Overriding with specialized calculation
        @Override
        public double calculateCompensation(int hours) {
            int regularHours = Math.min(hours, 40);
            int overtimeHours = Math.max(0, hours - 40);
            return (regularHours * baseRate) + (overtimeHours * baseRate * overtimeMultiplier);
        }

        // Overriding with Covariant Return Type (returns Contractor, a subtype of Worker)
        @Override
        public Contractor createCopy() {
            return new Contractor(this.id, this.baseRate, this.overtimeMultiplier);
        }
    }

    public static void main(String[] args) {
        Worker standard = new Worker("W-100", 25.0);
        Worker contractor = new Contractor("C-200", 25.0, 1.5);

        System.out.printf("Standard Worker 50h  : $%,.2f%n", standard.calculateCompensation(50));
        System.out.printf("Contractor Worker 50h: $%,.2f%n", contractor.calculateCompensation(50));
    }
}
```

### Execution Output:
```text
Standard Worker 50h  : $1,250.00
Contractor Worker 50h: $1,375.00
```

---

## Pitfalls

- **Reducing Method Visibility:** Overriding a `public` superclass method with `protected` or package-private visibility triggers compile-time error `attempting to assign weaker access privileges`.
- **Declaring Broader Checked Exceptions:** If a parent method throws `IOException`, an overriding method cannot declare `throws Exception` (violates Liskov Substitution Principle).
- **Static Method Hiding vs Overriding:** Marking an overriding method `static` does not participate in dynamic polymorphism; the invoked method depends solely on the reference type at compile time.
- **Single Class Inheritance Limit:** Java classes can extend at most **one** direct superclass (`class A extends B, C` is illegal). Use interfaces for multiple type contracts.

---

## Practice

### Question
Will the following code compile?
```java
class Base {
    public Number compute() throws java.io.IOException { return 1; }
}
class Derived extends Base {
    @Override
    protected Integer compute() throws Exception { return 2; }
}
```

### Explanation
1. Visibility: `Derived.compute()` reduces access to `protected` while `Base.compute()` is `public`. This violates visibility rules.
2. Exceptions: `Derived.compute()` declares `throws Exception`, which is broader than `Base`'s `IOException`. This violates exception bounds.
3. Both violations trigger **compile-time errors**.
