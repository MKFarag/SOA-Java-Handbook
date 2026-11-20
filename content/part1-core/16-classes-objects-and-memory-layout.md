---
id: topic-16
slug: classes-objects-and-memory-layout
topicNumber: 16
title: 'Classes, Objects & Memory Layout'
part: 'Part 1: Java Core'
sectionNumber: 6
sectionTitle: Object-Oriented Programming (OOP) Essentials
versionBadge: Java 8+
difficulty: Beginner
readingTime: 11 min read
shortDescription: >-
  Master the foundation of Object-Oriented Programming: classes as architectural
  blueprints, objects as heap instances, reference variables on the stack, and
  Garbage Collection eligibility.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
  - 'Topic 11: Methods, Parameters & Return Values'
relevanceLevel: MUST-KNOW / CORE
---
> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

A **class** is a blueprint, template, or schema that defines the state (fields) and behaviors (methods) that objects created from it will possess. An **object** is a concrete runtime instance of a class, allocated in dynamically managed memory on the JVM Heap.

When you declare an object variable (`FleetVehicle truck = new FleetVehicle(...)`), the variable `truck` does not contain the actual vehicle data. It contains a 64-bit (or 32-bit with compressed OOPs) **reference pointer** stored on the Call Stack that points to the object residing on the Heap.

### The Real-World Analogy
Think of architectural blueprints and houses:
- An architect creates a single set of blueprints for a two-story home (**The Class**).
- Construction crews use that single blueprint to build 50 physical houses in a neighborhood (**Objects / Instances**).
- Each physical house has its own interior paint color, furniture, and family living inside (**Instance State**), while they all share the same structural layout and electrical wiring rules (**Class Definition**).
- A slip of paper with a house's street address written on it is a **Reference Variable**: tearing up the paper doesn't destroy the physical house, but if no one in the world has the address anymore, the house becomes abandoned (**Garbage Collection**).

### Why Does This Exist?
Procedural programming separates data from the algorithms that operate on that data. This leads to brittle code where any function can arbitrarily mutate global data structures. Object-Oriented Programming binds state and behavior together, making code modular, maintainable, and reflective of real-world domain models.

---

## 2. Prerequisites
- **Topic 04: Variables, Identifiers & Primitive Data Types**
- **Topic 11: Methods, Parameters & Return Values**

---

## 3. Syntax Breakdown & JVM Memory Anatomy

### Declaration and Instantiation
```java
public class FleetVehicle {
    // 1. Static Field: Shared across all instances in Metaspace/Heap
    private static int totalFleetCount = 0;

    // 2. Instance Fields: Unique to each heap object
    private final String vin;
    private double fuelPercent;

    // 3. Constructor
    public FleetVehicle(String vin, double fuel) {
        this.vin = vin;
        this.fuelPercent = fuel;
        totalFleetCount++;
    }
}
```

| Component | Storage Location | Lifetime |
| :--- | :--- | :--- |
| **Reference Variable** (`truck`) | Thread Call Stack | Destroyed immediately when enclosing method stack frame pops. |
| **Object Instance** | JVM Heap | Persists until unreachable by any living GC root. |
| **Instance Fields** (`vin`, `fuelPercent`) | Embedded inside Heap Object | Created and destroyed with the enclosing object. |
| **Static Fields** (`totalFleetCount`) | Class Metadata / Metaspace | Created when class is loaded by ClassLoader; lives until unloaded. |

### Object Identity vs State Equality
- `==` operator: Compares **memory address references**. `a == b` is `true` if and only if both variables point to the exact same physical byte address on the Heap.
- `.equals(Object obj)`: Compares **logical state values**. Classes override this method to determine whether two distinct objects hold equivalent data.

---

## 4. Runnable Code Examples

### Example 1: Stack vs Heap Memory Layout & Reference Aliasing
```java
// File: examples/core/ClassMemoryLayout.java
public class ClassMemoryLayout {

    private static int totalInstancesCreated = 0;

    private final int id;
    private String label;

    public ClassMemoryLayout(String label) {
        this.id = ++totalInstancesCreated;
        this.label = label;
    }

    public static int getTotalInstancesCreated() {
        return totalInstancesCreated;
    }

    public int getId() { return id; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public static void main(String[] args) {
        System.out.println("=== 1. Stack References vs Heap Objects ===");
        ClassMemoryLayout obj1 = new ClassMemoryLayout("Alpha");
        ClassMemoryLayout obj2 = new ClassMemoryLayout("Beta");

        System.out.printf("obj1 -> id: %d, label: '%s'%n", obj1.getId(), obj1.getLabel());
        System.out.printf("obj2 -> id: %d, label: '%s'%n", obj2.getId(), obj2.getLabel());
        System.out.println("Total Instances (Static): " + ClassMemoryLayout.getTotalInstancesCreated());

        System.out.println("\n=== 2. Reference Assignment & Aliasing ===");
        ClassMemoryLayout alias = obj1; // Both pointers reference identical heap address
        System.out.println("obj1 == alias: " + (obj1 == alias) + " (Identical heap memory address)");
        System.out.println("obj1 == obj2: " + (obj1 == obj2) + " (Distinct heap objects)");

        alias.setLabel("Alpha-Modified");
        System.out.println("After mutating via alias -> obj1 label is: " + obj1.getLabel());

        System.out.println("\n=== 3. Dereferencing & GC Eligibility ===");
        obj2 = null; // Beta object now has 0 incoming references; eligible for GC!
        System.out.println("obj2 reference cleared to null. Object eligible for JVM GC.");
    }
}
```

#### Expected Output
```text
=== 1. Stack References vs Heap Objects ===
obj1 -> id: 1, label: 'Alpha'
obj2 -> id: 2, label: 'Beta'
Total Instances (Static): 2

=== 2. Reference Assignment & Aliasing ===
obj1 == alias: true (Identical heap memory address)
obj1 == obj2: false (Distinct heap objects)
After mutating via alias -> obj1 label is: Alpha-Modified

=== 3. Dereferencing & GC Eligibility ===
obj2 reference cleared to null. Object eligible for JVM GC.
```

---

### Example 2: Realistic Application (Fleet Vehicle Telemetry Manager)
```java
// File: examples/core/VehicleTelemetryApp.java
public class VehicleTelemetryApp {

    public static class FleetVehicle {
        private final String vin;
        private String driverName;
        private double latitude;
        private double longitude;
        private double fuelLevelPercent;

        public FleetVehicle(String vin, String driverName, double lat, double lon, double fuel) {
            this.vin = vin;
            this.driverName = driverName;
            this.latitude = lat;
            this.longitude = lon;
            this.fuelLevelPercent = fuel;
        }

        public void updateTelemetry(double newLat, double newLon, double fuelConsumed) {
            this.latitude = newLat;
            this.longitude = newLon;
            this.fuelLevelPercent = Math.max(0.0, this.fuelLevelPercent - fuelConsumed);
        }

        public String getTelemetrySnapshot() {
            return String.format("VIN: %s | Driver: %-12s | GPS: (%.4f, %.4f) | Fuel: %5.1f%%",
                    vin, driverName, latitude, longitude, fuelLevelPercent);
        }

        public String getVin() { return vin; }
        public double getFuelLevelPercent() { return fuelLevelPercent; }
    }

    public static void main(String[] args) {
        System.out.println("=== Fleet Telemetry Management System ===");
        FleetVehicle truck1 = new FleetVehicle("1HGCR2F83HA001", "Marcus Vance", 37.7749, -122.4194, 95.0);
        FleetVehicle truck2 = new FleetVehicle("2C3CDXBG8HH002", "Elena Rostova", 34.0522, -118.2437, 88.5);

        System.out.println("Initial State:");
        System.out.println(truck1.getTelemetrySnapshot());
        System.out.println(truck2.getTelemetrySnapshot());

        System.out.println("\nDispatching Telemetry Updates:");
        truck1.updateTelemetry(37.8044, -122.2712, 12.3);
        truck2.updateTelemetry(34.1012, -118.3245, 8.2);

        System.out.println(truck1.getTelemetrySnapshot());
        System.out.println(truck2.getTelemetrySnapshot());
    }
}
```

#### Expected Output
```text
=== Fleet Telemetry Management System ===
Initial State:
VIN: 1HGCR2F83HA001 | Driver: Marcus Vance | GPS: (37.7749, -122.4194) | Fuel:  95.0%
VIN: 2C3CDXBG8HH002 | Driver: Elena Rostova | GPS: (34.0522, -118.2437) | Fuel:  88.5%

Dispatching Telemetry Updates:
VIN: 1HGCR2F83HA001 | Driver: Marcus Vance | GPS: (37.8044, -122.2712) | Fuel:  82.7%
VIN: 2C3CDXBG8HH002 | Driver: Elena Rostova | GPS: (34.1012, -118.3245) | Fuel:  80.3%
```

---

## 5. Step-by-Step Execution Trace

When executing `FleetVehicle truck1 = new FleetVehicle("1HGCR2F83HA001", ...);`:

```text
1. JVM Class Loading & Memory Calculation:
   - If FleetVehicle is not loaded, JVM loads its bytecode into Metaspace.
   - Computes total object size on Heap:
     - 12/16-byte object header
     - String reference (vin): 4/8 bytes
     - String reference (driverName): 4/8 bytes
     - double latitude: 8 bytes
     - double longitude: 8 bytes
     - double fuelLevelPercent: 8 bytes
     - Padding to 8-byte alignment.

2. Heap Allocation:
   - JVM zero-initializes allocated heap bytes at address @0x4B20.

3. Constructor Invocation:
   - Initializes fields with supplied parameters.

4. Reference Assignment:
   - Variable 'truck1' on the main() stack frame receives memory address @0x4B20.
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Invoking Instance Methods on `null`
```java
FleetVehicle vehicle = null;
vehicle.updateTelemetry(10.0, 20.0, 5.0); // RUNTIME ERROR
```
**Why it fails:** `vehicle` points to memory address `0x00`. Dereferencing `null` throws `NullPointerException`.
**How to fix:** Always instantiate the object or perform defensive null checks (`if (vehicle != null)`).

### Mistake 2: Accessing Static Members via Object References
```java
ClassMemoryLayout obj = new ClassMemoryLayout("Test");
int count = obj.getTotalInstancesCreated(); // WARNING: static method accessed via instance
```
**Why it is discouraged:** `totalInstancesCreated` belongs to the class, not to `obj`. Accessing it via `obj` misleadingly implies it is an instance property.
**How to fix:** Access static members directly via the class name: `ClassMemoryLayout.getTotalInstancesCreated()`.

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Model Real-World Invariants:** Keep instance variables private and expose methods that model real domain behaviors (e.g. `refuel()`, `applyBrakes()`) rather than raw dumb setters.
2. **Access Static Members via Class Name:** Always write `ClassName.staticMethod()`.
3. **Nullify Long-Lived References:** If an object is kept in a long-lived static collection, clear it when no longer needed to prevent memory leaks.

### When NOT to Use
- **Do not create classes for purely stateless mathematical operations:** If a class has zero fields and only helper functions, mark the constructor `private` and declare all methods `static` (like `java.lang.Math`).

---

## 8. Version Notes
- **Java 1.0:** Classes, objects, heap memory model, and garbage collection established.
- **Java 7:** Added compressed ordinary object pointers (Compressed OOPs) enabled by default for 64-bit JVMs under 32GB heap.
- **Java 16:** Introduced Java Records (`record`) as transparent carrier classes for immutable data.

---

## 9. Summary Cheat Sheet

| Concept | Location | Behavior |
| :--- | :--- | :--- |
| **Class** | Metaspace | Blueprint defining state and behavior; loaded once per classloader. |
| **Object** | Heap | Concrete runtime instance created with `new`. |
| **Reference** | Stack | Pointer variable holding the 64-bit address of an object on the heap. |
| **Static Field** | Metaspace / Heap | Single shared value shared across all instances of the class. |
| **Instance Field** | Inside Heap Object | Distinct value for every instantiated object. |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
What prints when running this code?
```java
public class EqualityTrap {
    public static void main(String[] args) {
        Point p1 = new Point(5, 10);
        Point p2 = new Point(5, 10);
        System.out.println(p1 == p2);
    }
}
```
<details>
<summary>View Solution</summary>

**Output:** `false`.
**Explanation:** `==` compares object references (memory addresses). `p1` and `p2` were allocated separately using `new`, giving them distinct heap addresses. To compare coordinate values, `Point` must override `.equals()`, and callers must write `p1.equals(p2)`.
</details>

---

### Exercise 2: Hands-on Implementation
Write a class `BankAccount` with private fields `accountNumber` and `balance`. Include a static variable `totalBankReserves` that automatically updates whenever any account deposits or withdraws funds.
<details>
<summary>View Solution</summary>

```java
public class BankAccount {
    private static double totalBankReserves = 0.0;
    private final String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        totalBankReserves += initialBalance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            totalBankReserves += amount;
        }
    }

    public static double getTotalBankReserves() {
        return totalBankReserves;
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case
When does an object on the JVM Heap actually become eligible for Garbage Collection?
<details>
<summary>View Solution</summary>

**Answer:** An object becomes eligible for Garbage Collection when it is no longer reachable through any active chain of references originating from a **GC Root**.
**Explanation:** GC Roots include living thread stack frames (local variables), active native method references, static variables of loaded classes, and JNI handles. Even if objects reference each other in a circular loop, if the entire group is disconnected from all GC roots, the whole cluster is collected.
</details>

---

## 11. Official Sources & Specifications
- [Oracle Java Documentation: Classes and Objects](https://docs.oracle.com/javase/tutorial/java/javaOO/index.html)
- [dev.java: Objects and Classes](https://dev.java/learn/classes-objects/)
- [Java Language Specification §8: Classes](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html)
