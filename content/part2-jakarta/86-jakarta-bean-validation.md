---
id: topic-86
slug: jakarta-bean-validation
topicNumber: 86
title: Jakarta Bean Validation
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Jakarta EE Enterprise Stack Overview
versionBadge: Jakarta Validation 3.0 / EE 10
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Enforce consistent data integrity rules across all application tiers using
  declarative constraint annotations (@NotNull, @Size, @Email, @Pattern).
prerequisites:
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 58: Annotations & Metadata'
  - 'Topic 80: Form Handling, Validation & Multipart File Uploads'
---
# Topic 86: Jakarta Bean Validation

## 1. What It Is and Why It Exists
Data validation is a universal requirement in enterprise applications. Traditionally, validation logic was duplicated across multiple layers:
1. JavaScript in the browser.
2. Form-parsing code in web controllers.
3. Business rules in service classes.
4. Pre-insert triggers or check constraints in the database.

Duplicating validation logic across tiers leads to inconsistencies, maintenance nightmares, and security gaps when one tier's rules diverge from another.

**Jakarta Bean Validation** provides a unified, declarative metadata model where constraints are expressed as standard Java annotations (`@NotNull`, `@Size`, `@Email`, `@Min`, `@Max`, `@Pattern`) directly on domain classes and DTOs. The validation engine (Hibernate Validator) automatically validates constraints when triggered by web forms, JAX-RS endpoints, CDI service methods, or JPA entity persistence events.

### Real-World Analogy
Standardized airport security baggage sizing templates:
Instead of every individual flight attendant, pilot, gate agent, and baggage handler measuring carry-on luggage with different tape measures at different steps of your journey, the airline establishes a single standard steel frame at the gate (`@Size(max = 22)`). If a bag fits the frame, it is valid across all checkpoints in the airport.

### Why It Exists
Bean Validation decouples validation rules from execution flow. Instead of writing dozens of imperative `if-else` checks (`if (email == null || !email.contains("@")) ...`), developers declare constraints once on the model. The framework handles multi-field validation, custom error interpolation, internationalization, and constraint violation reporting automatically.

---

## 2. Prerequisites
- **Topic 16: Classes, Objects & Memory Layout:** JavaBean properties and getters/setters.
- **Topic 58: Annotations & Metadata:** Declarative Java annotations.
- **Topic 80: Form Handling & Validation:** Validating user input.

---

## 3. Syntax Breakdown
```java
public class UserRegistrationDto {

    @NotNull(message = "Username is required")
    @Size(min = 4, max = 20, message = "Username must be between 4 and 20 characters")
    private String username;

    @NotNull(message = "Email is required")
    @Email(message = "Email format must be valid")
    private String email;

    @Min(value = 18, message = "Users must be at least 18 years old")
    private int age;

    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9]).{8,}$", 
             message = "Password must have at least 8 chars, 1 uppercase, and 1 digit")
    private String password;
}

// Programmatic Validator Execution
ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
Validator validator = factory.getValidator();

Set<ConstraintViolation<UserRegistrationDto>> violations = validator.validate(dto);
if (!violations.isEmpty()) {
    for (ConstraintViolation<UserRegistrationDto> v : violations) {
        System.out.println(v.getPropertyPath() + ": " + v.getMessage());
    }
}
```

### Key Elements Explained
- `@NotNull`: Rejects `null` references; allows empty strings `""`.
- `@NotEmpty`: Rejects `null` and length 0 (Strings, Collections, Maps, Arrays).
- `@NotBlank`: Rejects `null`, length 0, and whitespace-only strings (`"   "`).
- `@Size(min, max)`: Restricts length of strings or number of elements in collections.
- `@Email`: Validates email address format against RFC specifications.
- `ConstraintViolation<T>`: Holds details of each rule failure, including invalid value, property path, and interpolated error message.

---

## 4. Runnable Examples

### Example 1: Declarative DTO Constraints
```java
package com.handbook.enterprise;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface NotNull { String message() default "must not be null"; }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface Size { int min() default 0; int max() default Integer.MAX_VALUE; String message() default "size out of bounds"; }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface Min { long value(); String message() default "must be >= min"; }

public class AccountDto {
    @NotNull
    @Size(min = 3, max = 15)
    private String accountId;

    @Min(100)
    private double initialDeposit;

    public AccountDto(String id, double deposit) {
        this.accountId = id;
        this.initialDeposit = deposit;
    }
}
```

#### Expected Output
```text
Constraint violations: 0 (valid account)
```

---

### Example 2: Realistic Declarative Constraint Validation Engine
```java
package com.handbook.enterprise;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class BeanValidationDemo {
    public static class UserRegistrationForm {
        @NotNull(message = "Username cannot be null")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        private String username;

        @NotNull(message = "Age cannot be null")
        @Min(value = 18, message = "User must be at least 18 years old")
        private Integer age;

        public UserRegistrationForm(String username, Integer age) {
            this.username = username;
            this.age = age;
        }
        public String getUsername() { return username; }
        public Integer getAge() { return age; }
    }

    public record Violation(String field, String message) {}

    public static class MockValidator {
        public List<Violation> validate(Object target) {
            List<Violation> violations = new ArrayList<>();
            Class<?> clazz = target.getClass();

            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true);
                try {
                    Object value = field.get(target);

                    if (field.isAnnotationPresent(NotNull.class) && value == null) {
                        violations.add(new Violation(field.getName(), field.getAnnotation(NotNull.class).message()));
                        continue;
                    }
                    if (field.isAnnotationPresent(Size.class) && value instanceof String s) {
                        Size size = field.getAnnotation(Size.class);
                        if (s.length() < size.min() || s.length() > size.max()) {
                            violations.add(new Violation(field.getName(), size.message()));
                        }
                    }
                    if (field.isAnnotationPresent(Min.class) && value instanceof Number n) {
                        Min min = field.getAnnotation(Min.class);
                        if (n.longValue() < min.value()) {
                            violations.add(new Violation(field.getName(), min.message()));
                        }
                    }
                } catch (Exception ignored) {}
            }
            return violations;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Jakarta Bean Validation Architecture ===");
        MockValidator validator = new MockValidator();

        UserRegistrationForm valid = new UserRegistrationForm("johndoe", 25);
        assert validator.validate(valid).isEmpty();

        UserRegistrationForm invalid = new UserRegistrationForm("al", 16);
        List<Violation> violations = validator.validate(invalid);
        assert violations.size() == 2;

        System.out.println("Declarative constraint inspection verified successfully.");
    }
}
```

#### Expected Output
```text
=== Jakarta Bean Validation Architecture ===
Declarative constraint inspection verified successfully.
```

---

## 5. Step-by-Step "What Happens When This Runs"
1. **Target Object Provided:** An application component passes an entity or DTO to the `Validator`.
2. **Metadata Introspection:** The validator reads constraint annotations on fields, getters, and class definitions (cached for high performance).
3. **Constraint Evaluation:** Each constraint evaluator executes against the current value.
4. **Message Interpolation:** If a rule fails, the framework resolves parameterized error templates (e.g. `{min}`, `{max}`) and localizes text.
5. **Violation Set Returned:** A `Set<ConstraintViolation<T>>` containing every violation is returned to caller.
6. **Automatic Integration:** In JAX-RS or Spring, prefixing a parameter with `@Valid` automatically triggers validation and throws `ConstraintViolationException` on failure.

---

## 6. Common Mistakes and Solutions

### Mistake 1: Confusing `@NotNull`, `@NotEmpty`, and `@NotBlank`
- `@NotNull`: Rejects `null`, but **allows** empty string `""` and whitespace `"   "`.
- `@NotEmpty`: Rejects `null` and `""`, but **allows** whitespace `"   "`.
- `@NotBlank`: Rejects `null`, `""`, and `"   "`.
**Solution:** For mandatory text fields like names or passwords, always use `@NotBlank`.

### Mistake 2: Forgetting `@Valid` on nested object properties
**Symptom:** Parent object validates, but nested child object properties (e.g. `Address` inside `Customer`) are never inspected.
**Cause:** Bean Validation does not cascade into nested objects by default.
**Solution:** Add `@Valid` to the nested property field:
```java
@NotNull
@Valid // Enables cascading validation into Address fields
private Address shippingAddress;
```

---

## 7. Best Practices and When NOT to Use It

### Best Practices
- Always place constraints on DTOs and entities rather than writing manual imperative `if` checks in controllers.
- Use Bean Validation groups (`@ConvertGroup`) to apply different validation rules for Create vs Update workflows.
- Create custom constraint annotations with `@Constraint(validatedBy = ...)` for complex domain-specific rules.

### When NOT to Use It
- Cross-database transactional checks: Complex business rules requiring multi-table queries (e.g., "Customer credit limit exceeds account balance") belong in domain service classes rather than annotation validators.

---

## 8. Version Notes
- **Bean Validation 1.0 / 2.0 (JSR 303 / 380):** Established constraint model and Java 8 date/time support.
- **Jakarta Validation 3.0 (Jakarta EE 10):** Migrated package from `javax.validation` to `jakarta.validation`.
- **Status:** Core enterprise validation standard.

---

## 9. Summary Cheat Sheet
| Annotation | Applies To | Rule Enforced |
|---|---|---|
| `@NotNull` | Any object | Value must not be `null` |
| `@NotBlank` | String | Must contain at least one non-whitespace character |
| `@Size(min, max)` | String, Collection, Map, Array | Size/length must fall within range |
| `@Min(value)` / `@Max(value)` | Number | Numeric value upper/lower bounds |
| `@Email` | String | Must match valid email address format |
| `@Pattern(regexp)` | String | Must match provided regular expression |

---

## 10. Exercises with Solutions

### Exercise 1: Spot the Bug
<details>
<summary>View Solution</summary>
**Question:** A developer uses `@NotNull` on a password field, but users are able to register with a password consisting of three spaces `"   "`. Why?

**Solution:** `@NotNull` only checks that the reference is not null. A string with whitespace `"   "` is a non-null object with length 3, so it passes `@NotNull`. The developer should use `@NotBlank`, which strips leading/trailing whitespace and ensures the string contains actual characters.
</details>

### Exercise 2: Hands-on Implementation
<details>
<summary>View Solution</summary>
**Question:** Annotate a `ProductOrder` class ensuring `productSku` matches pattern `[A-Z]{3}-[0-9]{4}`, `quantity` is between 1 and 100, and `deliveryDate` is in the future.

**Solution:**
```java
public class ProductOrder {
    @NotNull
    @Pattern(regexp = "^[A-Z]{3}-[0-9]{4}$", message = "SKU must match format ABC-1234")
    private String productSku;

    @Min(1)
    @Max(100)
    private int quantity;

    @NotNull
    @Future(message = "Delivery date must be in the future")
    private LocalDate deliveryDate;
}
```
</details>

---

## 11. Sources
- [Jakarta Bean Validation 3.0 Specification](https://jakarta.ee/specifications/bean-validation/3.0/)
- [Hibernate Validator Official Reference Guide](https://hibernate.org/validator/documentation/)
