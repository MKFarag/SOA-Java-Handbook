---
id: topic-85
slug: jakarta-bean-validation
topicNumber: 85
title: 'Jakarta Bean Validation Specification'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Modern Jakarta EE Specifications
versionBadge: Jakarta Validation 3.0 / Hibernate Validator 8.0
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: Declarative data integrity constraints (@NotNull, @Size, @Email, @Pattern), Validator API execution, and custom constraint validators.
prerequisites:
  - 'Topic 61: Annotations & Metadata'
  - 'Topic 82: Jakarta Persistence (JPA) & Hibernate ORM'
---

## Overview
Jakarta Bean Validation provides a unified, declarative metadata model for validating data across all tiers of Java enterprise applications. By annotating JavaBean properties or record fields with standardized constraint annotations, validation rules are executed consistently across presentation controllers, service boundaries, and database persistence layers.

---

## Standard Constraint Annotations Reference

| Annotation | Applicable Types | Validation Semantics |
| :--- | :--- | :--- |
| **`@NotNull`** | Any Object | Must not be `null` (empty string or collections are permitted) |
| **`@NotEmpty`** | CharSequence, Collection, Map, Array | Must not be `null` and `size() > 0` |
| **`@NotBlank`** | CharSequence (String) | Must not be `null` and must contain at least one non-whitespace character |
| **`@Size(min, max)`** | String, Collection, Map, Array | Length or element count must be within inclusive bounds |
| **`@Min(val) / @Max(val)`** | Numeric primitives & wrappers | Numerical value must be greater than or equal to minimum |
| **`@Email`** | CharSequence | Must conform to valid RFC email address syntax |
| **`@Pattern(regexp)`** | CharSequence | Must match the provided regular expression |
| **`@Positive / @Negative`** | Numeric types | Strictly greater than or less than zero |

---

## Production Implementation: Validated Record & Validator Execution

```java
package com.example.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class ValidationDemo {

    public record UserRegistration(
        @NotBlank(message = "Username cannot be blank")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Positive(message = "Age must be positive")
        int age
    ) {}

    public static void main(String[] args) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        // Create invalid record
        UserRegistration invalidUser = new UserRegistration(" ", "invalid-email", -5);

        Set<ConstraintViolation<UserRegistration>> violations = validator.validate(invalidUser);

        for (ConstraintViolation<UserRegistration> v : violations) {
            System.out.printf("[VIOLATION] Property: %s | Message: %s%n",
                    v.getPropertyPath(), v.getMessage());
        }
    }
}
```

```
[VIOLATION] Property: age | Message: Age must be positive
[VIOLATION] Property: email | Message: Invalid email format
[VIOLATION] Property: username | Message: Username cannot be blank
```

---

## Common Pitfalls & Validation Traps

- **Confusing `@NotNull`, `@NotEmpty`, and `@NotBlank`:**
  - `@NotNull`: Checks only `obj != null`. An empty string `""` passes.
  - `@NotEmpty`: Checks `obj != null && obj.length() > 0`. A string containing only spaces `"   "` passes.
  - `@NotBlank`: Checks `obj != null && obj.trim().length() > 0`. Only strings with non-whitespace characters pass. Always use `@NotBlank` for text inputs.
- **Premature ValidatorFactory Creation:**
  `Validation.buildDefaultValidatorFactory()` is computationally expensive because it scans classloaders and compiles constraint metadata. Build the `ValidatorFactory` once upon application startup and reuse the singleton `Validator` across threads (it is fully thread-safe).
- **Missing Cascaded Validation (`@Valid`):**
  When validating an object that contains nested complex objects or lists of children, omitting `@Valid` on the field causes Bean Validation to skip inspecting child fields.

---

## Verification & Practice

**Question:** An engineer annotates a String field with `@NotNull` and `@Size(min = 5)`. A client sends a payload where the field is omitted entirely (`null`). How many constraint violations are generated?

**Explanation:** Exactly one constraint violation is generated (for `@NotNull`). By design in Jakarta Bean Validation, almost all constraint annotations (such as `@Size`, `@Pattern`, `@Min`) consider `null` values to be **valid**. This allows fields to remain optional unless explicitly paired with `@NotNull` or `@NotBlank`.
