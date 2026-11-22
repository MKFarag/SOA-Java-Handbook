---
id: topic-19
slug: classes-objects-and-memory-layout
topicNumber: 19
title: Classes, Objects & Memory Layout
part: 'Part 1: Java Core'
sectionNumber: 6
sectionTitle: Object-Oriented Programming (OOP) Essentials
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Class definitions, heap object allocation, stack reference pointers, Compressed OOPs, static vs instance fields, and GC eligibility.
prerequisites:
  - 'Topic 14: Methods, Parameters & Return Values'
  - 'Topic 16: Variable Scope & Local Variable Type Inference (var)'
---

## Overview
A class is a compile-time blueprint defining instance state (fields) and behavior (methods). An object is an instantiated heap structure referenced via pointers on the Call Stack or within other objects. Java manages object lifecycles automatically; objects unreferenced by any live GC root become eligible for Garbage Collection.

---

## JVM Object Memory Layout (HotSpot 64-bit)

```
                       Object Memory Anatomy (Heap)
 ┌────────────────────────────────────────────────────────────────────┐
 │ Mark Word (8 bytes): HashCode, GC Age, Locking & Bias Flags       │
 ├────────────────────────────────────────────────────────────────────┤
 │ Klass Word (4 bytes compressed / 8 bytes native): Pointer to Meta  │
 ├────────────────────────────────────────────────────────────────────┤
 │ Instance Fields: Primitive values (1-8 bytes) + Reference pointers │
 ├────────────────────────────────────────────────────────────────────┤
 │ Alignment Padding (0-7 bytes): Rounds object size to 8-byte multiple│
 └────────────────────────────────────────────────────────────────────┘
```

- **Stack Reference Pointer:** Stored as an Ordinary Object Pointer (OOP). Under 64-bit JVMs with `< 32GB` heap, **Compressed OOPs** (`-XX:+UseCompressedOops`) compress 64-bit addresses to 32 bits using 8-byte alignment shifts.
- **Garbage Collection Eligibility:** An object becomes eligible for GC when it is unreachable from any active thread stack frame, static reference, or JNI pointer.

---

## Static vs Instance Members

| Dimension | Static Member (`static`) | Instance Member |
| :--- | :--- | :--- |
| **Storage Location** | Class metadata / Heap (`Class<T>` instance) | Enclosed inside each heap object instance |
| **Copies in Memory** | Exactly 1 per `ClassLoader` | 1 per `new` instantiation |
| **Invocation Context** | `ClassName.member` (no instance required) | `instanceRef.member` (requires active instance) |
| **Access to `this`** | Illegal (no contextual instance exists) | Valid (points to executing heap instance) |

---

## Implementation Example

```java
public class ServerNode {
    // Static field: single counter shared across all server instances
    private static int activeClusterNodes = 0;

    // Instance fields: unique per server instance
    private final String nodeId;
    private final String ipAddress;
    private boolean online;

    public ServerNode(String nodeId, String ipAddress) {
        this.nodeId = nodeId;
        this.ipAddress = ipAddress;
        this.online = true;
        activeClusterNodes++;
    }

    public void decommission() {
        if (this.online) {
            this.online = false;
            activeClusterNodes--;
        }
    }

    public static int getActiveClusterCount() {
        return activeClusterNodes;
    }

    @Override
    public String toString() {
        return String.format("Node[id=%s, ip=%s, online=%b]", nodeId, ipAddress, online);
    }

    public static void main(String[] args) {
        ServerNode node1 = new ServerNode("node-01", "10.0.0.1");
        ServerNode node2 = new ServerNode("node-02", "10.0.0.2");

        System.out.printf("Cluster active nodes: %d%n", ServerNode.getActiveClusterCount());
        System.out.println(node1);
        System.out.println(node2);

        node1.decommission();
        System.out.printf("After decommissioning node1, active count: %d%n", ServerNode.getActiveClusterCount());

        // Dereference node1: becomes eligible for GC
        node1 = null;
    }
}
```

### Execution Output:
```text
Cluster active nodes: 2
Node[id=node-01, ip=10.0.0.1, online=true]
Node[id=node-02, ip=10.0.0.2, online=true]
After decommissioning node1, active count: 1
```

---

## Pitfalls

- **`NullPointerException` on Member Access:** Attempting to invoke an instance method or read a field from a reference variable containing `null` throws `NullPointerException`.
- **Modifying Static Fields via Instance References:** Writing `node1.activeClusterNodes = 5;` compiles but misleadingly suggests modifying `node1` alone. Static fields must always be accessed via the class identifier: `ServerNode.activeClusterNodes`.
- **Static Field Memory Leaks:** Accumulating objects in a `static Collection` prevents Garbage Collection indefinitely because static references remain live for the JVM process duration.
- **Reference Equality (`==`) vs State Equality (`.equals()`):** Comparing two object instances with `==` checks whether both pointers reference the identical heap memory address, not whether their field values match.

---

## Practice

### Question
Given the class below, what is printed when executing `main`?
```java
class Counter {
    static int globalCount = 0;
    int instanceCount = 0;
    void increment() {
        globalCount++;
        instanceCount++;
    }
}
public class TestOOP {
    public static void main(String[] args) {
        Counter c1 = new Counter();
        Counter c2 = new Counter();
        c1.increment();
        c2.increment();
        System.out.println(c1.globalCount + " " + c1.instanceCount + " " + c2.instanceCount);
    }
}
```

### Explanation
1. `globalCount` is `static`: a single memory slot shared by all instances. Both `c1.increment()` and `c2.increment()` increment this shared counter $\rightarrow$ `globalCount` becomes `2`.
2. `instanceCount` is an instance field: each object maintains its own independent copy. `c1` was incremented once (`1`), and `c2` was incremented once (`1`).
3. Output: `2 1 1`.
