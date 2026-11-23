---
id: topic-85
slug: jakarta-bean-validation
topicNumber: 85
title: Jakarta Bean Validation Specification
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Modern Jakarta EE Specifications
versionBadge: Jakarta Validation 3.0 / Hibernate Validator 8.0
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: Declarative data integrity constraints (@NotNull, @Size, @Email,
  @Pattern), Validator API execution, and custom constraint validators.
prerequisites:
  - 'Topic 61: Annotations & Metadata'
  - 'Topic 82: Jakarta Persistence (JPA) & Hibernate ORM'
---

## Overview
Jakarta Bean Validation provides a unified, declarative metadata model for validating data across all tiers of Java enterprise applications. By annotating JavaBean properties or record fields with standardized constraint annotations, validation rules are executed consistently across presentation controllers, service boundaries, and database persistence layers.

---

## Master Jakarta Bean Validation & Hibernate Validator Constraints Directory

Jakarta Bean Validation (JSR-380 / Jakarta Validation 3.0) and its reference implementation **Hibernate Validator 8.0** provide an extensive ecosystem of declarative constraints. The following categorized matrices provide an exhaustive reference of standard constraints, their applicable targets, configurable attributes, and real-world usage patterns.

### 1. Nullability, String Content & Format Constraints

| Annotation | Applicable Types | Key Attributes | Validation Semantic | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@NotNull`** | Any Object | `message`, `groups` | Value must not be `null`. Empty strings or empty collections **pass**. | `@NotNull(message = "ID is mandatory") Long id;` |
| **`@Null`** | Any Object | `message`, `groups` | Value must be strictly `null` (useful for read-only / server-assigned fields on creation). | `@Null(groups = OnCreate.class) Long id;` |
| **`@NotEmpty`** | `CharSequence`, `Collection`, `Map`, Arrays | `message`, `groups` | Value must not be `null` and `size() > 0` or `length > 0`. Whitespace-only strings **pass**. | `@NotEmpty List<String> tags;` |
| **`@NotBlank`** | `CharSequence` (`String`) | `message`, `groups` | Value must not be `null` and must contain at least one non-whitespace character after trimming. | `@NotBlank(message = "Username required") String username;` |
| **`@Size`** | `CharSequence`, `Collection`, `Map`, Arrays | `min = 0`, `max = Integer.MAX_VALUE` | Element count or string character length must be within inclusive bounds. | `@Size(min = 8, max = 64) String password;` |
| **`@Length`** *(Hibernate)* | `CharSequence` | `min = 0`, `max = Integer.MAX_VALUE` | Specific string length validation (Hibernate Validator extension). | `@Length(min = 5, max = 50) String skuCode;` |
| **`@Email`** | `CharSequence` | `regexp`, `flags` | String must conform to valid RFC 5322 email syntax specifications. | `@Email(message = "Malformed email") String email;` |
| **`@Pattern`** | `CharSequence` | `regexp` (required), `flags` | String must match the specified Java regular expression pattern. | `@Pattern(regexp = "^[A-Z]{3}-\\d{4}$") String licensePlate;` |
| **`@URL`** *(Hibernate)* | `CharSequence` | `protocol`, `host`, `port` | Validates that the string conforms to valid URL syntax. | `@URL(protocol = "https") String webhookUrl;` |
| **`@UUID`** *(Hibernate)* | `CharSequence` | `version`, `letterCase` | Verifies string is a formatted UUID (RFC 4122). | `@UUID(version = 4) String correlationId;` |

### 2. Numeric Boundaries, Ranges & Precision Constraints

| Annotation | Applicable Types | Key Attributes | Validation Semantic | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Min`** | `BigDecimal`, `BigInteger`, `byte`, `short`, `int`, `long` | `value` (long, required) | Numerical value must be greater than or equal to the specified minimum. | `@Min(value = 18, message = "Must be 18+") int age;` |
| **`@Max`** | Integral numeric types | `value` (long, required) | Numerical value must be less than or equal to the specified maximum. | `@Max(value = 100) int percentage;` |
| **`@DecimalMin`** | `BigDecimal`, `BigInteger`, `CharSequence`, numeric | `value` (String), `inclusive = true` | Numerical value must be >= (or > if inclusive=false) specified decimal string value. | `@DecimalMin(value = "0.01", inclusive = true) BigDecimal price;` |
| **`@DecimalMax`** | `BigDecimal`, `BigInteger`, `CharSequence`, numeric | `value` (String), `inclusive = true` | Numerical value must be <= (or < if inclusive=false) specified decimal string value. | `@DecimalMax(value = "9999.99") BigDecimal discount;` |
| **`@Positive`** | Numeric primitives & wrappers, `BigDecimal` | `message`, `groups` | Numerical value must be strictly greater than zero (`> 0`). | `@Positive BigDecimal accountBalance;` |
| **`@PositiveOrZero`** | Numeric primitives & wrappers, `BigDecimal` | `message`, `groups` | Numerical value must be greater than or equal to zero (`>= 0`). | `@PositiveOrZero int failedAttempts;` |
| **`@Negative`** | Numeric primitives & wrappers, `BigDecimal` | `message`, `groups` | Numerical value must be strictly less than zero (`< 0`). | `@Negative double debtOffset;` |
| **`@NegativeOrZero`** | Numeric primitives & wrappers, `BigDecimal` | `message`, `groups` | Numerical value must be less than or equal to zero (`<= 0`). | `@NegativeOrZero double refundAdjustment;` |
| **`@Digits`** | Numeric primitives & wrappers, `BigDecimal` | `integer` (int), `fraction` (int) | Enforces maximum number of integral and decimal fractional digits. | `@Digits(integer = 8, fraction = 2) BigDecimal amount;` |
| **`@Range`** *(Hibernate)* | Numeric primitives, wrappers, `String` | `min = 0`, `max = Long.MAX_VALUE` | Verifies value falls within inclusive min/max numerical range. | `@Range(min = 1, max = 5) int ratingScore;` |

### 3. Date, Time & Temporal Constraints

| Annotation | Applicable Types | Key Attributes | Validation Semantic | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Past`** | `LocalDate`, `Instant`, `ZonedDateTime`, `Date` | `message`, `groups` | Date/time must be strictly before the current virtual clock instant. | `@Past(message = "Birth date must be past") LocalDate birthDate;` |
| **`@PastOrPresent`** | Temporal types | `message`, `groups` | Date/time must be in the past or equal to the present instant. | `@PastOrPresent Instant loginTimestamp;` |
| **`@Future`** | Temporal types | `message`, `groups` | Date/time must be strictly after the current virtual clock instant. | `@Future(message = "Card expired") YearMonth cardExpiry;` |
| **`@FutureOrPresent`** | Temporal types | `message`, `groups` | Date/time must be in the future or equal to the present instant. | `@FutureOrPresent LocalDate subscriptionEnd;` |

### 4. Boolean & Financial Verification Constraints

| Annotation | Applicable Types | Key Attributes | Validation Semantic | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@AssertTrue`** | `Boolean`, `boolean` | `message`, `groups` | Field or getter return must evaluate strictly to `true`. | `@AssertTrue(message = "Must accept terms") boolean termsAccepted;` |
| **`@AssertFalse`** | `Boolean`, `boolean` | `message`, `groups` | Field or getter return must evaluate strictly to `false`. | `@AssertFalse boolean isBlacklisted;` |
| **`@CreditCardNumber`** *(Hibernate)* | `CharSequence` | `ignoreNonDigitCharacters = false` | Validates card numbers against the Luhn algorithm checksum. | `@CreditCardNumber String rawCardNumber;` |
| **`@LuhnCheck`** *(Hibernate)* | `CharSequence` | `startIndex`, `endIndex` | Generic Luhn algorithm check on arbitrary numerical IDs. | `@LuhnCheck String nationalInsuranceId;` |

### 5. Cascading, Container Elements & Validation Groups

| Annotation | Applicable Target | Purpose & Behavioral Mechanics | Production Example |
| :--- | :--- | :--- | :--- |
| **`@Valid`** | Field, Parameter, Getter, Type Argument | **Recursive validation cascade**. Instructs the validation engine to traverse inside child objects, collections, and records. Without `@Valid`, constraints inside nested objects are completely ignored! | `@Valid @NotNull Address billingAddress;` |
| **`@Validated`** *(Spring)* | Class, Method | Spring MVC/Service boundary trigger enabling method-level validation and declaring active **validation groups**. | `@Validated(OnCreate.class) public class CustomerService` |
| **`@GroupSequence`** | Class (Interface) | Defines explicit execution ordering of validation groups, aborting immediately upon first failure. | `@GroupSequence({BasicChecks.class, HeavyChecks.class}) public interface CompleteValidation` |
| **`@ConvertGroup`** | Field, Parameter | Converts active group from one type to another when cascading into a nested object. | `@ConvertGroup(from = Default.class, to = StrictGroup.class) @Valid Address address;`

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

---

## Practice

### Q: Why should validation annotations (like `@NotNull`, `@Size`, `@Min`) be declared on DTOs and entities rather than writing manual `if-else` validation checks inside controllers?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Declarative Bean Validation centralizes business constraint invariants directly on domain types, automatically integrates with serialization frameworks, standardizes internationalized error messages, and triggers uniform validation across all application layers (REST controllers, services, and persistence entities) without repetitive manual boilerplate.
</details>
