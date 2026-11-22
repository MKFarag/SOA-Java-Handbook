---
id: topic-25
slug: abstract-classes-and-methods
topicNumber: 25
title: Abstract Classes & Methods
part: 'Part 1: Java Core'
sectionNumber: 7
sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction'
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Incomplete class templates via abstract, non-instantiability, abstract method contracts, state encapsulation, and the Template Method pattern.
prerequisites:
  - 'Topic 23: Inheritance & Method Overriding'
  - 'Topic 24: Polymorphism & Dynamic Method Dispatch'
---

## Overview
An abstract class (`abstract class`) is an incomplete class template that cannot be instantiated directly via `new`. It combines state fields, concrete methods, constructors, and unimplemented abstract methods (`abstract void run();`), which concrete subclasses are compelled by the compiler to implement.

---

## Architectural Role: The Template Method Pattern

Abstract classes provide partial algorithmic skeletons where common invariant steps are defined once in the base class, and specialized variant steps are deferred to concrete subclass overrides:

```
               AbstractBaseClass (Template Method Pattern)
 ┌─────────────────────────────────────────────────────────────┐
 │ + executePipeline(): void [final template method]           │
 │     1. initialize();          (concrete invariant)          │
 │     2. parseData();           (abstract variant - subclass) │
 │     3. validate();            (abstract variant - subclass) │
 │     4. commit();              (concrete invariant)          │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
       ConcreteCsvProcessor          ConcreteJsonProcessor
```

---

## Abstract Class vs Interface Comparison

| Feature | Abstract Class | Interface |
| :--- | :--- | :--- |
| **Instantiation** | Cannot be instantiated directly | Cannot be instantiated directly |
| **Inheritance Model** | Single inheritance (`extends SingleClass`) | Multiple inheritance (`implements A, B, C`) |
| **Instance Fields** | Any visibility (`private`, `protected`, mutable) | `public static final` constants only |
| **Constructors** | Yes (invoked via `super()` in subclasses) | None |
| **Method Implementation** | Concrete, abstract, protected, final, static | `default`, `static`, `private`, abstract |

---

## Implementation Example

```java
public class AbstractTemplateMethodDemo {
    public abstract static class DataReportGenerator {
        private final String reportName;

        public DataReportGenerator(String reportName) {
            this.reportName = reportName;
        }

        // Template Method defining the execution invariant
        public final void generateReport() {
            System.out.printf("--- Starting Report: %s ---%n", reportName);
            byte[] rawData = fetchData();
            String formatted = formatData(rawData);
            transmit(formatted);
            System.out.println("--- Report Dispatch Complete ---");
        }

        // Subclass responsibility (Abstract contracts)
        protected abstract byte[] fetchData();
        protected abstract String formatData(byte[] data);

        // Concrete invariant helper
        private void transmit(String payload) {
            System.out.printf("Transmitting payload (%d bytes): %s%n", payload.length(), payload);
        }
    }

    public static class JsonReportGenerator extends DataReportGenerator {
        public JsonReportGenerator(String name) {
            super(name);
        }

        @Override
        protected byte[] fetchData() {
            return new byte[]{ 0x7B, 0x7D }; // mock bytes
        }

        @Override
        protected String formatData(byte[] data) {
            return "{\"status\": \"ACTIVE\", \"count\": 42}";
        }
    }

    public static void main(String[] args) {
        DataReportGenerator generator = new JsonReportGenerator("Daily-Metrics");
        generator.generateReport();
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
--- Starting Report: Daily-Metrics ---
Transmitting payload (31 bytes): {"status": "ACTIVE", "count": 42}
--- Report Dispatch Complete ---
```
</details>

---

## Pitfalls

- **Attempting Direct Instantiation:** Invoking `new AbstractClass()` fails compilation with `AbstractClass is abstract; cannot be instantiated`.
- **Illegal Modifier Combinations:** An abstract method cannot be marked:
  - `private`: Subclasses cannot see private methods to implement them.
  - `static`: Static methods belong to classes and cannot be overridden dynamically.
  - `final`: Final methods prohibit overriding, contradicting the purpose of abstract methods.
- **Forgetting Super Constructor Call:** If an abstract class declares only a parameterized constructor, concrete subclasses that fail to invoke `super(args)` fail compilation.
- **Class Without Abstract Methods:** A class can be declared `abstract` even if it contains zero abstract methods, purely to prevent direct instantiation.

---

## Practice

### Question
Will the following class definition compile cleanly?
```java
public abstract class Worker {
    private abstract void execute();
    public static abstract void compute();
    public final abstract void terminate();
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `private abstract void execute();` fails because private methods cannot be accessed or overridden by subclasses.
2. `public static abstract void compute();` fails because static methods cannot be overridden via dynamic dispatch.
3. `public final abstract void terminate();` fails because final methods forbid overriding, while abstract requires it.
4. Result: All three methods trigger **compile-time errors**.

</details>
