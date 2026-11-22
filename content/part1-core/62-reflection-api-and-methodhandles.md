---
id: topic-62
slug: reflection-api-and-methodhandles
topicNumber: 62
title: Reflection API & MethodHandles
part: 'Part 1: Java Core'
sectionNumber: 15
sectionTitle: 'Reflection, Annotations & JPMS'
versionBadge: Java 1.1+ / Java 7+ (MethodHandles)
difficulty: Advanced
readingTime: 7 min read
shortDescription: >-
  Reference: Dynamic introspection with java.lang.reflect (Class, Method, Field, Constructor), dynamic JDK proxies (Proxy.newProxyInstance), and low-overhead java.lang.invoke.MethodHandles.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 26: Interfaces & Modern Interface Evolution'
  - 'Topic 61: Annotations & Metadata'
---

## Overview
Java provides two runtime introspection facilities: the classic **Reflection API** (`java.lang.reflect`) for discovering and mutating classes, fields, methods, and constructors dynamically, and **Method Handles** (`java.lang.invoke`), a strongly typed, low-overhead direct bytecode invocation pipeline that HotSpot's JIT compiler can inline.

---

## Reflection vs MethodHandles

```
                         Introspection Pipelines
 ┌──────────────────────────────────────────────────────────────────┐
 │ Core Reflection: Method.invoke(instance, args)                   │
 │   - Type check performed on EVERY invocation                     │
 │   - Arguments boxed into Object[] array (GC pressure)            │
 │   - JIT compiler struggles to inline dynamically                 │
 ├──────────────────────────────────────────────────────────────────┤
 │ MethodHandles: MethodHandle.invokeExact(instance, args)          │
 │   - Access checks performed ONCE at lookup time                  │
 │   - Zero argument boxing (strongly typed bytecode pointer)       │
 │   - JIT treats handle invocation as direct machine call          │
 └──────────────────────────────────────────────────────────────────┘
```

| Dimension | Core Reflection (`java.lang.reflect`) | Method Handles (`java.lang.invoke`) |
| :--- | :--- | :--- |
| **Introduced** | Java 1.1 | Java 7 (JSR 292 / `invokedynamic`) |
| **Access Checks** | Evaluated on **every** call to `.invoke()` | Evaluated **once** during `MethodHandles.lookup()` |
| **Argument Passing** | `Object[]` array (forces primitive boxing) | Direct primitive unboxed parameters |
| **JIT Inlining** | Difficult / Rarely inlined in deep chains | **Inlined directly** by JIT (C2 compiler) |
| **Primary Use Case** | Serialization (Jackson), Dependency Injection | Framework bytecode engines, Lambdas, Dynamic Languages |

---

## Dynamic Proxies (`java.lang.reflect.Proxy`)

Java provides runtime generation of classes implementing arbitrary interfaces:

```java
InvocationHandler handler = (proxy, method, args) -> {
    System.out.println("Intercepted invocation: " + method.getName());
    return method.invoke(targetInstance, args);
};

MyInterface proxy = (MyInterface) Proxy.newProxyInstance(
    MyInterface.class.getClassLoader(),
    new Class<?>[] { MyInterface.class },
    handler
);
```

---

## Implementation Example: MethodHandle Direct Invocation

```java
import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;

public class MethodHandleInspectionDemo {
    public static class ComputeEngine {
        private int internalMultiplier = 3;

        public int calculate(int factor) {
            return factor * internalMultiplier;
        }
    }

    public static void main(String[] args) throws Throwable {
        ComputeEngine engine = new ComputeEngine();

        // 1. Establish Lookup context
        MethodHandles.Lookup lookup = MethodHandles.lookup();

        // 2. Define expected signature: Return type int, Parameter type int
        MethodType methodType = MethodType.methodType(int.class, int.class);

        // 3. Obtain strongly typed MethodHandle
        MethodHandle handle = lookup.findVirtual(ComputeEngine.class, "calculate", methodType);

        // 4. Invoke handle directly (receiver instance is passed as first argument)
        int result = (int) handle.invokeExact(engine, 10);
        System.out.printf("MethodHandle calculated output: %d%n", result);
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
MethodHandle calculated output: 30
```
</details>

---

## Pitfalls

- **`getDeclaredMethods()` vs `getMethods()`:**
  - `getMethods()`: Returns all `public` methods, including those inherited from superclasses and interfaces.
  - `getDeclaredMethods()`: Returns all methods (public, protected, package, private) declared **directly by the class**, excluding inherited methods.
- **JPMS Strong Encapsulation Failures:** Starting in Java 9+, calling `field.setAccessible(true)` on non-exported or non-opened packages in a module throws `InaccessibleObjectException`. Modules must explicitly declare `opens com.pkg to framework;`.
- **`invokeExact` Type Strictness:** `MethodHandle.invokeExact()` does NOT perform autoboxing or widening. Passing an `int` where a `long` is expected throws `WrongMethodTypeException` at runtime.

---

## Practice

### Question
Why does `handle.invokeExact(engine, 5)` throw `WrongMethodTypeException` if `calculate` accepts `long`?

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `invokeExact()` requires an **exact type signature match** at the bytecode call site.
2. Passing the literal `5` is typed as an `int`.
3. Because the method expects `long`, and `invokeExact()` forbids automatic widening promotions, the types diverge.
4. Fix: Pass literal `5L`: `handle.invokeExact(engine, 5L)`.

</details>
