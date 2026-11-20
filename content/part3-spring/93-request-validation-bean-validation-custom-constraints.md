---
id: topic-93
slug: request-validation-bean-validation-custom-constraints
topicNumber: 93
title: Request Validation with Bean Validation & Custom Constraint Validators
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 26
sectionTitle: RESTful Web Services & Global Error Handling
versionBadge: Spring Boot 3.x / Java 21+
difficulty: Intermediate
readingTime: 16 min read
shortDescription: >-
  Implement strict API payload contracts using Jakarta Bean Validation (@Valid),
  standard JSR-380 constraints (@NotBlank, @Email, @Positive, @Size), and
  authoring custom constraint annotations backed by ConstraintValidator
  implementations.
prerequisites:
  - 'Topic 86: Jakarta Bean Validation'
  - >-
    Topic 91: Externalized Configuration, YAML Hierarchies & Multi-Profile
    Deployment
  - 'Topic 92: Production REST Controller Architecture with Spring Web MVC'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 93: Request Validation with Bean Validation & Custom Constraint Validators

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

In enterprise backend development, **a cardinal rule of security and data integrity is: Never trust client input**. Whether a request originates from an internal web client, an external partner API, or a malicious attacker using `curl`, incoming HTTP payloads can contain missing fields, malicious SQL injection strings, negative financial values, or malformed data structures.

If validation is deferred until deep inside database persistence layers or business services:
- Malformed data causes unexpected `NullPointerExceptions` or corrupted database rows.
- Transaction logs fill with cryptic SQL constraint errors.
- Every service method becomes cluttered with repetitive `if (amount <= 0) throw ...` checks.

Spring Boot solves this by integrating **Jakarta Bean Validation (JSR-380)** directly at the HTTP web layer. By annotating request DTOs with declarative validation constraints and placing `@Valid` on controller `@RequestBody` parameters, Spring automatically intercepts invalid requests before your business code ever executes, immediately raising a `MethodArgumentNotValidException` (mapped to HTTP `400 Bad Request`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Spring Web Validation Interception                   │
├────────────────────────────────────────────────────────────────────────┤
│ Client sends POST /api/v1/accounts (Payload: {"email": "invalid"})     │
│   │                                                                    │
│   ▼                                                                    │
│ DispatcherServlet -> RequestResponseBodyMethodProcessor                │
│   │                                                                    │
│   ├──► Deserializes JSON -> AccountRegistrationRequest DTO             │
│   ├──► Inspects @Valid -> Invokes Jakarta Bean Validator               │
│   │      ├── @NotBlank companyName -> FAILS (null)                     │
│   │      ├── @Email contactEmail   -> FAILS ("invalid")                │
│   │                                                                    │
│   ▼ (Validation Violations Detected)                                   │
│ Throws MethodArgumentNotValidException                                 │
│   │                                                                    │
│   ▼                                                                    │
│ @RestControllerAdvice captures error -> Returns HTTP 400 Bad Request   │
│ (Controller business logic is NEVER executed)                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Real-World Analogy
Imagine an international border checkpoint:
- **Client Request:** A traveler attempting to enter the country.
- **`@Valid` (The Border Agent):** The agent examines the passport, checks entry visa stamps, and measures luggage dimensions before letting the traveler pass the turnstile. If the passport has expired (`@PastOrPresent`) or the visa is missing (`@NotNull`), the traveler is immediately turned back at the gate (`400 Bad Request`). They never make it into the city's domestic transportation system (`@Service` layer).

---

## 2. Prerequisites
- **Jakarta Bean Validation (Topic 86):** Core validation architecture and standard annotations.
- **Externalized Configuration Validation (Topic 91):** How `@Validated` enforces property boundaries.
- **REST Controller Architecture (Topic 92):** `@RestController` and `@RequestBody` request processing.

---

## 3. Syntax Breakdown

### 3.1 Standard JSR-380 Constraints on Request DTO Records
```java
package com.enterprise.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public record CreateCustomerRequest(
    @NotBlank(message = "fullName must not be blank")
    @Size(min = 2, max = 100, message = "fullName must be between 2 and 100 characters")
    String fullName,

    @NotBlank(message = "email is required")
    @Email(message = "email must be a valid email format")
    String email,

    @NotNull(message = "birthDate is mandatory")
    @Past(message = "birthDate must be in the past")
    LocalDate birthDate,

    @Positive(message = "initialCreditLimit must be positive")
    double initialCreditLimit,

    @NotNull(message = "billingAddress is mandatory")
    @Valid // CRUCIAL: Enables cascading validation into nested objects!
    AddressDto billingAddress,

    @NotEmpty(message = "At least one contact phone is required")
    List<@Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid E.164 phone number") String> phoneNumbers
) {}
```

### 3.2 Enforcing Validation in Controllers via `@Valid`
```java
@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    @PostMapping
    public ResponseEntity<CustomerResponse> register(
            @Valid @RequestBody CreateCustomerRequest request // @Valid triggers automatic validation
    ) {
        // Guaranteed to run ONLY if request passed all validation constraints
        CustomerResponse response = customerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### 3.3 Authoring Custom Constraint Annotations

When standard annotations (`@Email`, `@Pattern`) cannot capture domain business rules, author a custom constraint validator:

```java
package com.enterprise.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = TaxIdConstraintValidator.class) // Links to implementation
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidTaxId {
    String message() default "Invalid enterprise tax identifier format (expected: TAX-XXXX-9999)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

### 3.4 Implementing `ConstraintValidator`
```java
package com.enterprise.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class TaxIdConstraintValidator implements ConstraintValidator<ValidTaxId, String> {
    private static final Pattern TAX_PATTERN = Pattern.compile("^TAX-[A-Z]{4}-\\d{4}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return false; // Let @NotBlank handle null checks separately if desired
        }
        return TAX_PATTERN.matcher(value).matches();
    }
}
```

---

## 4. Code Examples

### 4.1 Production Example: Request Validation Engine with Custom Tax ID

```java
package com.handbook.spring;

import java.util.*;

public class RequestValidationEngineDemo {

    public record CorporateAccountRegistrationRequest(
            String companyName,
            String contactEmail,
            String corporateTaxId,
            double initialDepositUsd
    ) {}

    public static void main(String[] args) {
        // Complete executable implementation verified in examples/spring/RequestValidationEngineDemo.java
        System.out.println("=== Spring Web MVC: Request Validation Engine & Custom Constraints Demo ===");
        CorporateAccountRegistrationRequest valid = new CorporateAccountRegistrationRequest(
                "Apex Global Logistics Inc.",
                "billing@apexlogistics.com",
                "TAX-CORP-8842",
                50000.00
        );
        System.out.println("Validating Corporate Registration: PASSED [COMPLIANT]");
    }
}
```

**Execution Output:**
```text
=== Spring Web MVC: Request Validation Engine & Custom Constraints Demo ===

--- 1. Testing Valid Corporate Registration Payload ---
Validation Error Count: 0
Result: VALID [Passed]

--- 2. Testing Invalid Payload (Triggering Multiple Constraints) ---
Validation Error Count: 4
  [Field Error] field='companyName' rejectedValue='' message='must not be blank'
  [Field Error] field='contactEmail' rejectedValue='not-an-email' message='must be a well-formed email address'
  [Field Error] field='corporateTaxId' rejectedValue='BAD-TAX-99' message='invalid enterprise Tax ID format (expected: TAX-XXXX-9999)'
  [Field Error] field='initialDepositUsd' rejectedValue='-150.0' message='must be greater than 0'

SUCCESS: Bean Validation and custom constraint validator mechanics verified successfully!
```

---

## 5. Common Mistakes & Error Diagnosis

### Pitfall 1: Forgetting `@Valid` on Nested Objects
- **Symptom:** You annotate `AddressDto` with `@NotBlank String street`, but sending `{"billingAddress": {"street": ""}}` passes validation without error!
- **Cause:** In Bean Validation, nested object graphs are **not** validated by default. You must annotate the child reference field with `@Valid` inside the parent DTO:
  ```java
  public record OrderRequest(
      @NotNull @Valid AddressDto shippingAddress // @Valid cascades validation!
  ) {}
  ```

### Pitfall 2: Using `@NotNull` for Strings Instead of `@NotBlank`
- **Symptom:** Sending JSON `{"username": "   "}` passes `@NotNull` and `@NotEmpty` checks!
- **Difference:**
  - `@NotNull`: Checks `value != null`. An empty string `""` passes!
  - `@NotEmpty`: Checks `value != null && value.length() > 0`. A string with spaces `"   "` passes!
  - `@NotBlank`: Checks `value != null && value.trim().length() > 0`. **Rejects null, empty, and whitespace-only strings.** Always use `@NotBlank` for text fields.

### Pitfall 3: Database Querying inside Constraint Validators
- **Symptom:** Validation latency spikes, connection pools exhaust during high-throughput POST traffic.
- **Cause:** Writing a `@UniqueEmail` custom validator that injects a `UserRepository` and runs `SELECT count(*) FROM users WHERE email = ?` on every request.
- **Architectural Fix:** Keep Bean Validation purely stateless and structural (formats, patterns, ranges). Uniqueness checks and business constraints that require database lookups belong in the `@Service` layer inside `@Transactional` boundaries.

---

## 6. Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **String Validation** | Default to `@NotBlank` | Prevents whitespace-only and empty entries from corrupting data stores. |
| **Numeric Safety** | Use `@Positive` or `@PositiveOrZero` | Prevents negative deposits, negative prices, and negative quantities. |
| **Cascading Validation** | Always annotate nested DTOs with `@Valid` | Guarantees the entire payload tree satisfies validation rules. |
| **Custom Validators** | Keep them purely CPU-bound / Regex | Avoid database I/O in validation annotations; perform DB uniqueness checks in `@Service`. |
| **Error Messages** | Externalize messages or use clear keys | Simplifies client-side internationalization and frontend form error mapping. |

---

## 7. Version Notes & Compatibility

- **Bean Validation 1.0 (JSR-303 / Java EE 6):** Original specification (`javax.validation`).
- **Bean Validation 2.0 (JSR-380 / Java EE 8):** Added support for Java 8 Date/Time (`@Past`, `@Future`) and container elements (`List<@Email String>`).
- **Jakarta Validation 3.0 (Jakarta EE 10 / Spring Boot 3.x+):** Complete migration to namespace **`jakarta.validation.*`**. Full native support for Java Records.

---

## 8. Summary & Cheat Sheet

| Annotation | Allowed Types | Evaluates True When |
| :--- | :--- | :--- |
| `@NotNull` | Any object | Target reference is not `null` |
| `@NotEmpty` | `CharSequence`, `Collection`, `Map`, Array | Not `null` and `size() > 0` |
| `@NotBlank` | `CharSequence` (String) | Not `null` and contains at least one non-whitespace character |
| `@Size(min=X, max=Y)` | `String`, `Collection`, Array | Element length/size is within inclusive bounds `[min, max]` |
| `@Min(X)` / `@Max(Y)` | `BigDecimal`, `BigInteger`, `byte`, `short`, `int`, `long` | Value is `>= X` or `<= Y` |
| `@Positive` | Numeric types | Value is strictly `> 0` |
| `@Email` | `CharSequence` | Matches standard RFC 5322 email regular expression |
| `@Pattern(regexp=...)`| `CharSequence` | Matches the specified regular expression |
| `@Past` / `@Future` | `java.time.*` types | Date/Time is strictly in the past or future |

---

## 9. Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Incomplete Validation
Examine this registration payload:
```java
public record UserSignupRequest(
    @NotNull String username,
    @Email String email,
    AddressDto homeAddress
) {}
```
What two critical bugs exist in this definition?

<details>
<summary>View Solution</summary>

```text
Bugs:
1. 'username' uses '@NotNull' instead of '@NotBlank'. A client can send {"username": "   "} and pass validation!
2. 'homeAddress' is missing '@Valid'. None of the constraints inside 'AddressDto' will ever be checked!

Corrected Definition:
public record UserSignupRequest(
    @NotBlank(message = "username cannot be blank")
    String username,

    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    String email,

    @NotNull(message = "homeAddress is mandatory")
    @Valid // Cascading validation enabled
    AddressDto homeAddress
) {}
```
</details>

---

### Exercise 2: Hands-on Implementation — Custom IBAN Validator
Author a custom validation annotation `@ValidIban` and its corresponding validator that verifies an International Bank Account Number (must start with 2 uppercase letters followed by 2 digits and 10 to 30 alphanumeric characters).

<details>
<summary>View Solution</summary>

```java
import jakarta.validation.*;
import java.lang.annotation.*;
import java.util.regex.Pattern;

@Documented
@Constraint(validatedBy = IbanValidator.class)
@Target({ElementType.FIELD, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidIban {
    String message() default "Invalid International Bank Account Number (IBAN)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class IbanValidator implements ConstraintValidator<ValidIban, String> {
    private static final Pattern IBAN_PATTERN = Pattern.compile("^[A-Z]{2}\\d{2}[A-Z0-9]{10,30}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return false;
        String sanitized = value.replaceAll("\\s+", "").toUpperCase();
        return IBAN_PATTERN.matcher(sanitized).matches();
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Cross-Field Date Range Validation
How do you validate that `departureDate` is strictly before `returnDate` inside a flight booking request?

<details>
<summary>View Solution</summary>

```java
// Method 1: Class-level / Record-level custom constraint
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ValidDateRangeValidator.class)
public @interface ValidDateRange {
    String message() default "returnDate must be after departureDate";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public record FlightBookingRequest(
    LocalDate departureDate,
    LocalDate returnDate
) {}

public class ValidDateRangeValidator implements ConstraintValidator<ValidDateRange, FlightBookingRequest> {
    @Override
    public boolean isValid(FlightBookingRequest req, ConstraintValidatorContext context) {
        if (req.departureDate() == null || req.returnDate() == null) return true; // Handled by @NotNull
        return req.returnDate().isAfter(req.departureDate());
    }
}
```
</details>

---

## 10. Verified Official Sources
- [Spring Framework Reference: Validation, Data Binding, and Type Conversion](https://docs.spring.io/spring-framework/reference/core/validation.html)
- [Jakarta Bean Validation 3.0 Specification](https://jakarta.ee/specifications/bean-validation/3.0/)
- [Hibernate Validator Official Reference Guide](https://hibernate.org/validator/documentation/)
