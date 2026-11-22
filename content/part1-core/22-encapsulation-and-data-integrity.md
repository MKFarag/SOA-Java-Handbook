---
id: topic-22
slug: encapsulation-and-data-integrity
topicNumber: 22
title: Encapsulation & Data Integrity
part: 'Part 1: Java Core'
sectionNumber: 6
sectionTitle: Object-Oriented Programming (OOP) Essentials
versionBadge: Java 8+
difficulty: Beginner
readingTime: 7 min read
shortDescription: >-
  Reference: Information hiding, invariant preservation via private fields, mutator validation, defensive copying of mutable references, and immutable object design.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 21: Packages & Access Modifiers'
---

## Overview
Encapsulation binds state and operations within a class while restricting direct external access to internal representations. By isolating instance fields behind `private` modifiers, classes guarantee that all state transitions satisfy strict domain invariants and shield internal data from unintended external mutation.

---

## Encapsulation Architecture & Defensive Copying

```
                     Encapsulation Boundary
 ┌─────────────────────────────────────────────────────────────┐
 │ Client Invocation                                           │
 │   deposit(500.0) ──► [ Public Method: Validation Guard ]    │
 │                            │                                │
 │                      ( valid > 0 )                          │
 │                            │                                │
 │                            ▼                                │
 │                  [ Private Field: balance ]                 │
 └─────────────────────────────────────────────────────────────┘
```

### The Defensive Copying Requirement

Marking a field `private final` does NOT prevent external mutation if the field references a mutable object (e.g., `Date`, arrays, or `ArrayList`). Callers who retain a reference to the parameter can modify internal state directly unless defensive copies are made:

```java
// VULNERABLE: Caller retains reference to passed list
public Account(List<String> roles) {
    this.roles = roles; // Exposes internal state!
}

// SAFE: Creates an unmodifiable defensive snapshot
public Account(List<String> roles) {
    this.roles = List.copyOf(roles); // Defensive copy & immutable view
}
```

---

## Immutable Class Design Rules

To construct a fully immutable class that is thread-safe without synchronization:
1. Declare the class `final` (prevents subclasses from overriding methods to introduce mutable state).
2. Declare all fields `private` and `final`.
3. Provide zero setter/mutator methods.
4. Defensively copy mutable arguments in constructors before assignment.
5. Defensively copy mutable return values in accessors (or return unmodifiable wrappers).

### Encapsulation Strategies Comparison

| Strategy | Mutability | Thread-Safety | Performance Overhead | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **Public Fields** | Unrestricted | None (Data race prone) | Zero | Internal low-level C-style structs (anti-pattern in domain code) |
| **Getters / Setters** | Controlled by guards | Requires external sync | Minimal (JIT inlined) | Stateful domain entities (JPA entities) |
| **Defensive Copying** | Controlled | Thread-safe snapshots | Minor (allocation cost) | Exposing mutable collections/arrays from classes |
| **Immutable Class / Record** | Zero (Read-only) | Guaranteed thread-safe | Zero ongoing sync | DTOs, Value Objects, Config models, Security principals |

---

## Implementation Example

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class SecurityProfile {
    private final String username;
    private final List<String> permissions;

    public SecurityProfile(String username, List<String> initialPermissions) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        this.username = username;

        // Defensive copy on constructor input
        this.permissions = new ArrayList<>(
            (initialPermissions != null) ? initialPermissions : List.of()
        );
    }

    public String getUsername() {
        return username;
    }

    // Defensive copy on getter output (or Collections.unmodifiableList)
    public List<String> getPermissions() {
        return Collections.unmodifiableList(permissions);
    }

    public static void main(String[] args) {
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_USER");

        SecurityProfile profile = new SecurityProfile("alex", roles);

        // Attempting external tampering on original input list
        roles.add("ROLE_ADMIN"); // Does NOT alter profile.permissions!

        System.out.println("Profile Permissions: " + profile.getPermissions());

        // Attempting mutation via getter
        try {
            profile.getPermissions().add("ROLE_SUPERUSER");
        } catch (UnsupportedOperationException e) {
            System.out.println("Blocked unauthorized mutation via unmodifiable view.");
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
Profile Permissions: [ROLE_USER]
Blocked unauthorized mutation via unmodifiable view.
```
</details>

---

## Pitfalls

- **Leaking References via Getters:** Returning an internal array reference directly (e.g. `public byte[] getPayload() { return payload; }`) gives the caller direct write access to the internal heap buffer. Always return `payload.clone()` or an immutable view.
- **Auto-Generating Blind Getters and Setters:** Adding generic IDE-generated getters and setters to all fields turns an object into an anemic data holder, destroying encapsulation. Expose operations that represent business use cases (e.g., `debit()`, `activate()`) rather than raw property mutators.
- **Validating After Assignment:** Performing validation checks after assigning arguments to instance fields can leave an object in a corrupted state if an exception is thrown mid-constructor. Validate all preconditions before mutating state.
- **Failing to Clone in Copy Constructors:** Passing another instance to a copy constructor without deep cloning mutable sub-objects creates shared internal references.

---

## Practice

### Question
Why is the following class NOT truly immutable?
```java
public final class ExperimentRun {
    private final String id;
    private final int[] sampleScores;

    public ExperimentRun(String id, int[] scores) {
        this.id = id;
        this.sampleScores = scores.clone();
    }
    public String getId() { return id; }
    public int[] getSampleScores() { return sampleScores; }
}
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. In the constructor, `sampleScores` is properly cloned defensively.
2. However, the getter `getSampleScores()` returns the internal `sampleScores` reference directly.
3. A caller can execute `run.getSampleScores()[0] = 999;`, mutating the internal state of `ExperimentRun` after instantiation.
4. Fix: The getter must return `sampleScores.clone()`.

</details>
