---
id: topic-24
slug: polymorphism-and-dynamic-dispatch
topicNumber: 24
title: Polymorphism & Dynamic Method Dispatch
part: 'Part 1: Java Core'
sectionNumber: 7
sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction'
versionBadge: Java 8+ / Java 16+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Subtype polymorphism, compile-time reference type vs runtime instance type, JVM vtable dispatch (invokevirtual), and Java 16+ pattern matching for instanceof.
prerequisites:
  - 'Topic 23: Inheritance & Method Overriding'
---

## Overview
Polymorphism allows objects of disparate concrete types to be referenced and operated upon through unified superclass or interface types. The Java Virtual Machine resolves which overridden instance method to invoke at runtime based on the actual heap object type using **Dynamic Method Dispatch** (`invokevirtual`).

---

## Static Reference Type vs Dynamic Object Type

```java
PaymentGateway gateway = new StripeGateway();
```

- **Compile-Time Reference Type (`PaymentGateway`):** Determines the API visibility boundary. The compiler verifies that invoked methods exist on `PaymentGateway`.
- **Runtime Object Type (`StripeGateway`):** Resides in heap memory. The JVM's `invokevirtual` instruction resolves method calls to this target at runtime.

### JVM vtable (Virtual Method Table) Mechanics

```
  Reference Variable: gateway
         │ (points to heap object)
         ▼
  ┌────────────────────────────────────────────────────────┐
  │ Heap Object: StripeGateway Instance                    │
  │   - Mark Word: [Metadata, HashCode, Lock Flags]        │
  │   - Klass Pointer ──► Klass Metadata: StripeGateway    │
  │                         │                              │
  │                         ▼                              │
  │                   vtable (Method Pointers)             │
  │                     [0: Object.toString]               │
  │                     [1: Gateway.initialize]            │
  │                     [2: StripeGateway.processCharge]   │
  └────────────────────────────────────────────────────────┘
```
Each class loaded into memory maintains a **vtable** of function pointers. When an instance method is called, the JVM performs an indexed array lookup into the runtime object's vtable in $O(1)$ constant time.

---

## Type Casting & Pattern Matching (`instanceof`)

### Upcasting vs Downcasting
- **Upcasting:** Assigning a subclass instance to a superclass reference (`PaymentGateway g = new StripeGateway();`). Implicit and 100% type-safe.
- **Downcasting:** Casting a superclass reference to a concrete subtype (`StripeGateway s = (StripeGateway) g;`). Requires runtime validation; throws `ClassCastException` if the instance is not an instance of the target type.

### Modern Pattern Matching (Java 16+)
Replaces redundant type checks and explicit casting with scoped pattern variables:

```java
// Pre-Java 16: Verbose casting
if (gateway instanceof StripeGateway) {
    StripeGateway stripe = (StripeGateway) gateway;
    stripe.captureWebhook();
}

// Java 16+: Pattern Matching for instanceof
if (gateway instanceof StripeGateway stripe) {
    stripe.captureWebhook(); // Scoped and cast automatically
}
```

---

## Implementation Example

```java
import java.util.List;

public class PolymorphicPipeline {
    public interface NotificationChannel {
        void send(String recipient, String message);
    }

    public static class EmailChannel implements NotificationChannel {
        @Override
        public void send(String recipient, String message) {
            System.out.printf("[EMAIL] Sending to %s: %s%n", recipient, message);
        }
    }

    public static class SmsChannel implements NotificationChannel {
        @Override
        public void send(String recipient, String message) {
            System.out.printf("[SMS] Sending to %s: %s%n", recipient, message);
        }
    }

    public static void broadcast(List<NotificationChannel> channels, String recipient, String alert) {
        for (NotificationChannel channel : channels) {
            // Dynamic dispatch: resolves concrete send() implementation at runtime
            channel.send(recipient, alert);
        }
    }

    public static void main(String[] args) {
        List<NotificationChannel> dispatchers = List.of(
            new EmailChannel(),
            new SmsChannel()
        );

        broadcast(dispatchers, "dev-ops@internal.net", "Service latency breached 250ms threshold");
    }
}
```

### Execution Output:
```text
[EMAIL] Sending to dev-ops@internal.net: Service latency breached 250ms threshold
[SMS] Sending to dev-ops@internal.net: Service latency breached 250ms threshold
```

---

## Pitfalls

- **Fields Are NOT Polymorphic:** Instance variables do NOT participate in dynamic dispatch. If a subclass declares a field with the same name as a superclass field, the field is **hidden**, not overridden. Accessing the field via a superclass reference reads the superclass field value.
- **Static Methods Are NOT Polymorphic:** Static methods are resolved at compile time via the reference type (`invokestatic`), not via dynamic heap vtables.
- **Unchecked Downcasting:** Casting without an `instanceof` guard throws `ClassCastException` at runtime whenever reference types diverge.
- **Calling Subclass-Specific Methods via Superclass Reference:** Declaring `Object obj = new String("text"); obj.length();` fails compilation because `length()` does not exist on `Object`.

---

## Practice

### Question
What is printed by the following code?
```java
class SuperClass {
    int value = 10;
    void print() { System.out.print("Super-" + value + " "); }
}
class SubClass extends SuperClass {
    int value = 20;
    @Override
    void print() { System.out.print("Sub-" + value + " "); }
}
public class DispatchTest {
    public static void main(String[] args) {
        SuperClass ref = new SubClass();
        System.out.print(ref.value + " ");
        ref.print();
    }
}
```

### Explanation
1. `ref.value` accesses a field. Fields do not participate in dynamic dispatch and are resolved statically by the reference type (`SuperClass`). Thus `ref.value` evaluates to `10`.
2. `ref.print()` invokes an overridden instance method. The JVM dispatches to the actual heap object type (`SubClass`). Inside `SubClass.print()`, `value` accesses `SubClass`'s field (`20`).
3. Output: `10 Sub-20 `.
