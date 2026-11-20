---
id: topic-20
slug: inheritance-and-method-overriding
topicNumber: 20
title: Inheritance & Method Overriding
part: 'Part 1: Java Core'
sectionNumber: 7
sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction'
versionBadge: Java 8+
difficulty: Beginner
readingTime: 11 min read
shortDescription: >-
  Establish IS-A hierarchies with the extends keyword. Master super()
  constructor chaining, method overriding rules, covariant returns, and final
  class/method locks.
prerequisites:
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 17: Constructors & Object Initialization'
relevanceLevel: MUST-KNOW / CORE
---
> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

**Inheritance** is an Object-Oriented mechanism allowing a new class (the **subclass** or derived class) to inherit the state (fields) and behaviors (methods) of an existing class (the **superclass** or base class) using the `extends` keyword. Inheritance models an **"IS-A"** relationship (e.g., a `Manager` IS-A `Employee`).

**Method Overriding** occurs when a subclass defines a method with the exact same name, return type (or covariant subtype), and parameter list as a method in its superclass, replacing the superclass's behavior with specialized logic.

### The Real-World Analogy
Think of vehicle engineering:
- An automotive manufacturer designs a foundational base chassis with wheels, engine mounts, steering, and brakes (**Base Class: `Vehicle`**).
- When designing an ambulance (**Subclass: `Ambulance`**), engineers do not invent the steering wheel from scratch. They inherit the vehicle base, and add specialized equipment like sirens, defibrillators, and flashing emergency lights.
- When an ambulance operator presses the horn button (**Method Overriding**), instead of producing a standard polite beep, it triggers a 120-decibel piercing emergency siren.

### Why Does This Exist?
Without inheritance, software systems would duplicate thousands of lines of identical code across related types. If a base formula changed (such as tax compliance deduction rules), every single duplicate class would require manual changes. Inheritance promotes reuse and polymorphism, enabling generic frameworks to interact with base types without caring which concrete subclass is executing.

---

## 2. Prerequisites
- **Topic 16: Classes, Objects & Memory Layout**
- **Topic 17: Constructors & Object Initialization**

---

## 3. Syntax Breakdown & Overriding Rules

### The Strict Rules of Method Overriding
1. **Method Signature Match:** Method name and parameter list must be identical.
2. **Access Visibility Rule:** The overriding method **cannot reduce visibility** (e.g., if superclass is `protected`, subclass can be `protected` or `public`, but NEVER package-private or `private`).
3. **Checked Exception Rule:** The overriding method **cannot declare broader checked exceptions** than the superclass method.
4. **Covariant Return Type:** The overriding method can return a subtype of the return type declared in the superclass.
5. **The `@Override` Annotation:** Always annotate overridden methods. The compiler validates that the method actually exists in the superclass, catching spelling typos at compile time.

```java
public class Manager extends Employee {
    public Manager(String id, String name, double salary) {
        super(id, name, salary); // Explicit invocation of superclass constructor
    }

    @Override
    public double calculateMonthlyPay() {
        return super.calculateMonthlyPay() + getBonusShare();
    }
}
```

### The `final` Keyword in Inheritance
- **`final class`:** Prevents the class from being extended by any subclass (e.g., `java.lang.String` is `public final class String`).
- **`final method`:** Prevents the method from being overridden by child subclasses.

---

## 4. Runnable Code Examples

### Example 1: Constructor Chaining, Overriding & `final` Locks
```java
// File: examples/core/InheritanceMechanics.java
public class InheritanceMechanics {

    public static class Device {
        protected final String brand;
        protected boolean powerStatus;

        public Device(String brand) {
            this.brand = brand;
            this.powerStatus = false;
        }

        public void powerOn() {
            this.powerStatus = true;
            System.out.println(brand + " device powering on (Generic BIOS)");
        }

        public final String getBrand() {
            return brand;
        }
    }

    public static class SmartPhone extends Device {
        private int batteryPercent;

        public SmartPhone(String brand, int batteryPercent) {
            super(brand); // Super constructor chaining
            this.batteryPercent = batteryPercent;
        }

        @Override
        public void powerOn() {
            super.powerOn(); // Call superclass implementation
            System.out.printf("SmartPhone UI initialized. Battery at %d%%%n", batteryPercent);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Super Constructor Chaining & Method Overriding ===");
        SmartPhone phone = new SmartPhone("Nexus", 88);
        phone.powerOn();

        System.out.println("\n=== 2. Final Method Invariant ===");
        System.out.println("Brand query (final method): " + phone.getBrand());
    }
}
```

#### Expected Output
```text
=== 1. Super Constructor Chaining & Method Overriding ===
Nexus device powering on (Generic BIOS)
SmartPhone UI initialized. Battery at 88%

=== 2. Final Method Invariant ===
Brand query (final method): Nexus
```

---

### Example 2: Realistic Application (Corporate Employee Payroll System)
```java
// File: examples/core/EmployeePayrollApp.java
public class EmployeePayrollApp {

    public static class Employee {
        private final String employeeId;
        private final String name;
        protected final double baseSalary;

        public Employee(String employeeId, String name, double baseSalary) {
            this.employeeId = employeeId;
            this.name = name;
            this.baseSalary = baseSalary;
        }

        public double calculateMonthlyPay() {
            return baseSalary / 12.0;
        }

        public String getPaystub() {
            return String.format("[%s] %-14s | Monthly Pay: $%.2f",
                    employeeId, name, calculateMonthlyPay());
        }
    }

    public static class Manager extends Employee {
        private final double annualBonus;

        public Manager(String id, String name, double baseSalary, double annualBonus) {
            super(id, name, baseSalary);
            this.annualBonus = annualBonus;
        }

        @Override
        public double calculateMonthlyPay() {
            return (baseSalary + annualBonus) / 12.0;
        }
    }

    public static class CommissionedSales extends Employee {
        private double monthlySalesVolume;
        private final double commissionRatePercent;

        public CommissionedSales(String id, String name, double baseSalary, double commissionRatePercent) {
            super(id, name, baseSalary);
            this.commissionRatePercent = commissionRatePercent;
        }

        public void recordSale(double saleAmount) {
            this.monthlySalesVolume += saleAmount;
        }

        @Override
        public double calculateMonthlyPay() {
            double commission = monthlySalesVolume * (commissionRatePercent / 100.0);
            return (baseSalary / 12.0) + commission;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Corporate Payroll Processing System ===");

        Employee regular = new Employee("EMP-101", "David Miller", 60_000.0);
        Manager mgr = new Manager("MGR-201", "Sarah Connor", 120_000.0, 30_000.0);
        CommissionedSales sales = new CommissionedSales("SLS-301", "Alex Mercer", 48_000.0, 5.0);
        sales.recordSale(80_000.0);

        System.out.println(regular.getPaystub());
        System.out.println(mgr.getPaystub());
        System.out.println(sales.getPaystub());
    }
}
```

#### Expected Output
```text
=== Corporate Payroll Processing System ===
[EMP-101] David Miller   | Monthly Pay: $5000.00
[MGR-201] Sarah Connor   | Monthly Pay: $12500.00
[SLS-301] Alex Mercer    | Monthly Pay: $8000.00
```

---

## 5. Step-by-Step Execution Trace

When running `sales.getPaystub()` on `CommissionedSales`:

```text
1. Invocation of sales.getPaystub():
   - 'getPaystub()' is declared in base class Employee.
   - It executes: String.format("[...] %s | Monthly Pay: $%.2f", ..., calculateMonthlyPay()).

2. Virtual Method Invocation (vtable dispatch):
   - The method calculateMonthlyPay() is called on 'this'.
   - Even though code is running inside Employee.getPaystub(), runtime object type is CommissionedSales!
   - JVM executes CommissionedSales.calculateMonthlyPay():
     - baseSalary / 12.0 = $4000.00
     - commission = 80000.0 * 0.05 = $4000.00
     - Returns $8000.00.

3. String output emitted:
   - "[SLS-301] Alex Mercer    | Monthly Pay: $8000.00"
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Accidentally Overloading Instead of Overriding
```java
public class Base { public void configure(int timeout) {} }
public class Child extends Base {
    public void configure(double timeout) {} // OVERLOAD, NOT OVERRIDE!
}
```
**Why it fails:** By changing parameter type from `int` to `double`, the method is overloaded rather than overridden. If a caller calls `configure(10)`, the base class method executes!
**How to fix:** Always add `@Override`. The compiler will flag `method does not override or implement a method from a supertype`.

### Mistake 2: Reducing Visibility in Overriding Method
```java
public class Super { protected void run() {} }
public class Sub extends Super {
    @Override
    void run() {} // COMPILE ERROR: attempting to assign weaker access privileges; was protected
}
```
**Why it fails:** The Liskov Substitution Principle mandates that any client expecting a `Super` instance must be able to call `run()`. If a subclass weakened access to package-private, outside callers would fail at runtime.
**How to fix:** Ensure visibility is equal or broader (`protected` or `public`).

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Prefer Composition Over Inheritance:** Apply the "IS-A" test rigorously. If the relationship is "HAS-A", use object composition (holding an instance) rather than `extends`.
2. **Always Use `@Override`:** Protects against typos and silent signature mismatches when libraries update.
3. **Keep Inheritance Trees Shallow:** Limit inheritance depth to 2–3 levels. Deep hierarchies become brittle and difficult to reason about.

### When NOT to Use
- **Do not inherit purely for code reuse:** If class `B` merely needs a helper method from class `A` but is not genuinely a specialized subtype of `A`, inject `A` as a dependency instead of extending it.

---

## 8. Version Notes
- **Java 1.0:** Inheritance (`extends`), `super`, and method overriding established.
- **Java 5:** Added covariant return types and the `@Override` annotation.
- **Java 17:** Introduced Sealed Classes (`sealed ... permits`), allowing authors to strictly control which classes can extend a superclass.

---

## 9. Summary Cheat Sheet

| Keyword / Concept | Rule | Behavior |
| :--- | :--- | :--- |
| **`extends`** | Single inheritance only | A Java class can only extend one direct superclass. |
| **`super(...)`** | First line of subclass constructor | Invokes superclass constructor to initialize inherited fields. |
| **`@Override`** | Compiler safety annotation | Guarantees exact method signature match in superclass. |
| **`final class`** | Class cannot be extended | Prohibits subclassing entirely. |
| **`final method`** | Method cannot be overridden | Locks implementation across all subclasses. |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
Why does `SubClass` fail compilation?
```java
class SuperClass {
    public SuperClass(int x) {}
}
class SubClass extends SuperClass {
    public SubClass() {} // COMPILE ERROR
}
```
<details>
<summary>View Solution</summary>

**Compiler Error:** `constructor SuperClass in class SuperClass cannot be applied to given types; required: int; found: no arguments`.
**Explanation:** If a subclass constructor does not explicitly call `super(...)`, Java automatically inserts `super()`. Because `SuperClass` declared an explicit 1-arg constructor, no default constructor exists.
**Fix:** Subclass must call `super(0);` explicitly.
</details>

---

### Exercise 2: Hands-on Implementation
Implement covariant return types: create a class `Document` with method `Document clone()`. Create a subclass `Spreadsheet` overriding it to return `Spreadsheet` directly without requiring callers to cast.
<details>
<summary>View Solution</summary>

```java
public class Document {
    public Document copy() {
        return new Document();
    }
}

public class Spreadsheet extends Document {
    @Override
    public Spreadsheet copy() { // Covariant return type (Spreadsheet is a Document)
        return new Spreadsheet();
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case
Can you override a `static` method in Java?
<details>
<summary>View Solution</summary>

**Answer:** No!
**Explanation:** Static methods are bound at compile time based on the reference type (static binding), not dynamically at runtime via the vtable. If a subclass declares a static method with the same signature, it **hides** the parent method rather than overriding it. `@Override` on a static method causes a compile error.
</details>

---

## 11. Official Sources & Specifications
- [Oracle Java Documentation: Inheritance](https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html)
- [dev.java: Inheritance in Java](https://dev.java/learn/classes-objects/inheritance/)
- [Java Language Specification §8.4.8: Inheritance, Overriding, and Hiding](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.8)
