---
id: topic-26
slug: records
topicNumber: 26
title: Records
part: 'Part 1: Java Core'
sectionNumber: 8
sectionTitle: Modern Java Data Modeling
versionBadge: Java 16+
difficulty: Beginner
readingTime: 11 min read
shortDescription: >-
  Eliminate boilerplate for immutable data carrier classes. Master records,
  component accessors, synthesized equals/hashCode, compact constructors, and
  invariant validation.
prerequisites:
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 19: Encapsulation & Data Integrity'
relevanceLevel: ADVANCED / DEEP-DIVE
---
> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

## 1. What It Is and Why It Exists

A **Record** (introduced in Java 14 and finalized in **Java 16 via JEP 395**) is a specialized class declaration designed to act as a transparent, immutable carrier for shallowly immutable data.

When you declare a record:
```java
public record UserProfile(String username, String email, int score) {}
```
The Java compiler automatically synthesizes:
1. `private final` fields for each component.
2. A public canonical constructor initializing all components.
3. Public accessor methods matching component names (e.g., `username()`, `email()`, `score()`; note the absence of the JavaBean `get` prefix).
4. Deterministic `equals()` and `hashCode()` based on all components.
5. A readable `toString()` printing `UserProfile[username=..., email=..., score=...]`.

### The Real-World Analogy
Think of a physical passport or driver's license card:
- Once printed and laminated at the government office, the photo, name, and birthdate are permanently fixed in plastic (**Immutable Components**).
- You don't need a complex legal contract explaining how to read the card; any security guard can glance at the transparent fields and verify the data (**Transparent Carrier**).
- Two physical passports with the exact same name, serial, and birthdate represent the identical legal identity (**Value-based Equality**).

### Why Does This Exist?
Prior to Java 16, creating a simple 3-field data transfer object (DTO) required writing or generating 60+ lines of repetitive ceremony: private fields, constructors, getters, `equals()`, `hashCode()`, and `toString()`. Developers frequently introduced subtle bugs when adding a new field by forgetting to update `equals()` or `hashCode()`. Records eliminate 100% of this boilerplate with zero runtime performance cost.

---

## 2. Prerequisites
- **Topic 16: Classes, Objects & Memory Layout**
- **Topic 19: Encapsulation & Data Integrity**

---

## 3. Syntax Breakdown & Compact Constructors

### Compact Constructor Syntax
A **Compact Constructor** allows you to validate or normalize arguments *without repeating the parameter list or field assignments*:
```java
public record UserProfile(String username, String email, int score) {
    // Compact Constructor: no parameter list!
    public UserProfile {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username required.");
        }
        if (score < 0) {
            score = 0; // Directly reassign parameter before fields are initialized!
        }
    }
}
```

### Record Constraints
1. **Implicitly Final:** A record is implicitly `final` and cannot be extended.
2. **Cannot Extend Other Classes:** All records implicitly extend `java.lang.Record`. Because Java is single-inheritance, records cannot extend another class.
3. **Can Implement Interfaces:** A record can implement one or more interfaces (`public record Point(int x, int y) implements Serializable, Comparable<Point>`).
4. **No Extra Instance Fields:** A record cannot declare instance fields outside its component header list. Only `static` fields are allowed.

---

## 4. Runnable Code Examples

### Example 1: Record Mechanics, Accessors & Compact Validation
```java
// File: examples/core/RecordMechanics.java
public class RecordMechanics {

    public record UserProfile(String username, String email, int reputationScore) {

        public UserProfile {
            if (username == null || username.isBlank()) {
                throw new IllegalArgumentException("Username cannot be blank.");
            }
            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("Valid email required.");
            }
            if (reputationScore < 0) {
                reputationScore = 0;
            }
        }

        public boolean isTopContributor() {
            return reputationScore >= 1000;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Java 16+ Record Instantiation & Components ===");
        UserProfile user1 = new UserProfile("alex_dev", "alex@enterprise.com", 1450);
        UserProfile user2 = new UserProfile("alex_dev", "alex@enterprise.com", 1450);

        System.out.println("Username: " + user1.username());
        System.out.println("Email:    " + user1.email());
        System.out.println("Score:    " + user1.reputationScore());
        System.out.println("Top Star: " + user1.isTopContributor());

        System.out.println("\n=== 2. Auto-generated equals, hashCode & toString ===");
        System.out.println("user1.toString(): " + user1);
        System.out.println("user1.equals(user2): " + user1.equals(user2));
        System.out.println("user1.hashCode() == user2.hashCode(): " + (user1.hashCode() == user2.hashCode()));

        System.out.println("\n=== 3. Compact Constructor Invariant Enforcement ===");
        UserProfile negativeScoreUser = new UserProfile("newbie", "new@test.com", -50);
        System.out.println("Clamped score: " + negativeScoreUser.reputationScore());
    }
}
```

#### Expected Output
```text
=== 1. Java 16+ Record Instantiation & Components ===
Username: alex_dev
Email:    alex@enterprise.com
Score:    1450
Top Star: true

=== 2. Auto-generated equals, hashCode & toString ===
user1.toString(): UserProfile[username=alex_dev, email=alex@enterprise.com, reputationScore=1450]
user1.equals(user2): true
user1.hashCode() == user2.hashCode(): true

=== 3. Compact Constructor Invariant Enforcement ===
Clamped score: 0
```

---

### Example 2: Realistic Application (Geospatial Waypoint Navigation)
```java
// File: examples/core/GeoLocationRecordApp.java
public class GeoLocationRecordApp {

    public record GeoCoordinate(double latitude, double longitude) {
        public GeoCoordinate {
            if (latitude < -90.0 || latitude > 90.0) {
                throw new IllegalArgumentException("Latitude out of range: " + latitude);
            }
            if (longitude < -180.0 || longitude > 180.0) {
                throw new IllegalArgumentException("Longitude out of range: " + longitude);
            }
        }

        public double distanceToKilometers(GeoCoordinate other) {
            final double EARTH_RADIUS_KM = 6371.0;
            double dLat = Math.toRadians(other.latitude - this.latitude);
            double dLon = Math.toRadians(other.longitude - this.longitude);
            double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                    + Math.cos(Math.toRadians(this.latitude)) * Math.cos(Math.toRadians(other.latitude))
                    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return EARTH_RADIUS_KM * c;
        }
    }

    public record DeliveryWaypoint(String locationName, GeoCoordinate coordinate, boolean isPriority) {}

    public static void main(String[] args) {
        System.out.println("=== Geospatial Tracking with Immutable Records ===");

        DeliveryWaypoint warehouse = new DeliveryWaypoint(
                "Central Hub (Chicago)",
                new GeoCoordinate(41.8781, -87.6298),
                false
        );

        DeliveryWaypoint destination = new DeliveryWaypoint(
                "Client Site (New York)",
                new GeoCoordinate(40.7128, -74.0060),
                true
        );

        double distance = warehouse.coordinate().distanceToKilometers(destination.coordinate());
        System.out.printf("Route: %s -> %s%n", warehouse.locationName(), destination.locationName());
        System.out.printf("Direct Flight Distance: %.2f km (Priority: %b)%n", distance, destination.isPriority());
    }
}
```

#### Expected Output
```text
=== Geospatial Tracking with Immutable Records ===
Route: Central Hub (Chicago) -> Client Site (New York)
Direct Flight Distance: 1144.29 km (Priority: true)
```

---

## 5. Step-by-Step Execution Trace

When executing `new UserProfile("alex_dev", "alex@enterprise.com", -50)`:

```text
1. Memory Allocation:
   - JVM allocates object on Heap with slots for String username, String email, int reputationScore.

2. Compact Constructor Entry:
   - Parameters: username="alex_dev", email="alex@enterprise.com", reputationScore=-50.
   - Validates username is non-blank.
   - Validates email contains '@'.
   - Evaluates: reputationScore < 0 -> mutates parameter: reputationScore = 0.

3. Implicit Field Assignment:
   - At the end of the compact constructor, JVM executes synthetic assignments:
     this.username = username;
     this.email = email;
     this.reputationScore = reputationScore; // stores 0

4. Construction Completes:
   - Returns immutable UserProfile instance with clamped score 0.
```

---

## 6. Common Mistakes & Compiler Errors

### Mistake 1: Expecting JavaBean `get` Prefixes
```java
UserProfile user = new UserProfile("bob", "bob@test.com", 100);
System.out.println(user.getUsername()); // COMPILE ERROR: cannot find symbol method getUsername()
```
**Why it fails:** Records deliberately break from the legacy JavaBean naming convention. Record accessors share the exact name of the component.
**How to fix:** Call `user.username()`.

### Mistake 2: Attempting to Declare Instance Fields in Records
```java
public record Account(String id) {
    private double balance; // COMPILE ERROR: record components cannot declare instance fields
}
```
**Why it fails:** The state of a record is defined exclusively by its header components.
**How to fix:** Add the field into the record header: `record Account(String id, double balance) {}`.

---

## 7. Best Practices & When NOT to Use

### Best Practices (Do's)
1. **Use Records for DTOs and Value Objects:** Use records for database projections, HTTP JSON responses, messaging payloads, and compound map keys.
2. **Use Local Records:** Declare local records inside methods to hold intermediate tuple groupings in complex stream pipelines.
3. **Validate Invariants in Compact Constructors:** Keep compact constructors clean and focused on bounds validation.

### When NOT to Use
- **Do not use records for mutable entity objects:** JPA / Hibernate entity beans with mutable getters and setters or proxying requirements should remain regular classes.
- **Do not use records if component references are mutable without defensive copying:** If a record contains an array (`record Data(byte[] b)`), callers can mutate the array elements. Use a compact constructor with `.clone()` or prefer immutable collections.

---

## 8. Version Notes
- **Java 14 (JEP 359):** Records introduced as a Preview Feature.
- **Java 15 (JEP 384):** Second preview; added local records.
- **Java 16 (JEP 395):** Records officially finalized as a permanent core language feature.
- **Java 21 (JEP 440):** Record Patterns finalized, enabling direct record deconstruction in pattern matching.

---

## 9. Summary Cheat Sheet

| Feature | Regular Class | Java 16+ Record |
| :--- | :--- | :--- |
| **Boilerplate** | 60+ lines for getters, equals, hashCode | 1 line |
| **Mutability** | Mutable by default | Shallowly immutable (`final` fields) |
| **Accessor Naming** | `getName()` | `name()` |
| **Extends Classes** | Any non-final class | Prohibited (extends `java.lang.Record`) |
| **Implements Interfaces** | Permitted | Permitted |

---

## 10. Exercises with Hidden Solutions

### Exercise 1: Spot the Bug
Why does this record fail compilation?
```java
public record Range(int low, int high) {
    public Range {
        if (low > high) {
            throw new IllegalArgumentException();
        }
        this.low = low; // COMPILE ERROR
    }
}
```
<details>
<summary>View Solution</summary>

**Compiler Error:** `cannot assign instance fields inside a compact constructor`.
**Explanation:** In a compact constructor, the compiler automatically performs assignments (`this.low = low;`) at the closing brace. Manual assignment statements are forbidden inside compact constructors.
**Fix:** Remove `this.low = low;`.
</details>

---

### Exercise 2: Hands-on Implementation
Write an immutable `Money` record with `BigDecimal amount` and `Currency currency`. Disallow null amounts and negative amounts in the compact constructor.
<details>
<summary>View Solution</summary>

```java
import java.math.BigDecimal;
import java.util.Currency;

public record Money(BigDecimal amount, Currency currency) {
    public Money {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount must be non-null and non-negative.");
        }
        if (currency == null) {
            throw new IllegalArgumentException("Currency required.");
        }
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case
Can records be serialized and deserialized using standard Java serialization?
<details>
<summary>View Solution</summary>

**Answer:** Yes, and records are **vastly safer** to serialize than regular classes!
**Explanation:** The Java serialization mechanism handles records specially: deserialization **always invokes the canonical constructor**. This guarantees that all validation checks inside compact constructors are enforced even during deserialization, completely preventing malicious byte-stream deserialization attacks.
</details>

---

## 11. Official Sources & Specifications
- [OpenJDK JEP 395: Records](https://openjdk.org/jeps/395)
- [Oracle Java Documentation: Record Classes](https://docs.oracle.com/en/java/javase/21/language/records.html)
- [Java Language Specification §8.10: Record Types](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10)
