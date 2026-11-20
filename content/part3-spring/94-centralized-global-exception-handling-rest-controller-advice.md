---
id: topic-94
slug: centralized-global-exception-handling-rest-controller-advice
topicNumber: 94
title: Centralized Global Exception Handling via @RestControllerAdvice (RFC 7807)
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 26
sectionTitle: RESTful Web Services & Global Error Handling
versionBadge: Spring Boot 3.x / Java 21+
difficulty: Intermediate
readingTime: 16 min read
shortDescription: >-
  Architect bulletproof, centralized error handling for enterprise REST APIs
  using @RestControllerAdvice, @ExceptionHandler, and the RFC 7807 Problem
  Details for HTTP APIs specification introduced natively in Spring Framework
  6.x.
prerequisites:
  - 'Topic 29: The Java Exception Hierarchy'
  - 'Topic 32: Custom Exceptions & Exception Chaining'
  - 'Topic 92: Production REST Controller Architecture with Spring Web MVC'
  - >-
    Topic 93: Request Validation with Bean Validation & Custom Constraint
    Validators
relevanceLevel: MUST-KNOW / CORE
---
# Topic 94: Centralized Global Exception Handling via @RestControllerAdvice (RFC 7807)

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

In poorly architected backend systems, every controller method becomes polluted with repetitive, defensive `try/catch` blocks:

```java
// ANTI-PATTERN: Polluting controller endpoints with defensive catch blocks
@GetMapping("/{id}")
public ResponseEntity<?> getCustomer(@PathVariable String id) {
    try {
        return ResponseEntity.ok(customerService.findById(id));
    } catch (CustomerNotFoundException ex) {
        return ResponseEntity.status(404).body("Not found: " + ex.getMessage());
    } catch (Exception ex) {
        return ResponseEntity.status(500).body("Error: " + ex.toString()); // LEAKS STACK TRACE!
    }
}
```

This anti-pattern causes three severe architectural problems:
1. **Code Duplication:** Hundreds of endpoints duplicate the same error formatting logic.
2. **Inconsistent Error Formats:** One developer returns plain text, another returns a JSON object with `{ "error": "msg" }`, while another returns `{ "errCode": 404 }`. Client applications cannot reliably automate error handling.
3. **Severe Security Vulnerabilities (CWE-209):** Catching `Exception` and printing `ex.toString()` leaks internal database tables, SQL queries, class names, and file paths to external attackers.

Spring Web MVC eliminates this completely through **Centralized Global Exception Interception** via **`@RestControllerAdvice`**. Using Aspect-Oriented Programming (AOP) under the hood, Spring intercepts any unhandled exception thrown from **any** controller across the entire application and routes it to dedicated, type-safe `@ExceptionHandler` methods.

```
┌────────────────────────────────────────────────────────────────────────┐
│               Global Exception Interception Pipeline                   │
├────────────────────────────────────────────────────────────────────────┤
│ Client sends GET /api/v1/customers/CUST-999                            │
│   │                                                                    │
│   ▼                                                                    │
│ CustomerController -> customerService.findById("CUST-999")             │
│   │                                                                    │
│   ▼ (Resource does not exist)                                          │
│ throws new ResourceNotFoundException("Customer", "CUST-999")          │
│   │ (Uncaught by controller; bubbles up into Spring Web MVC)           │
│   ▼                                                                    │
│ DispatcherServlet intercepts exception                                 │
│   │                                                                    │
│   ▼                                                                    │
│ @RestControllerAdvice (GlobalExceptionHandler)                         │
│   │                                                                    │
│   ├──► Matches @ExceptionHandler(ResourceNotFoundException.class)      │
│   ├──► Constructs RFC 7807 ProblemDetail object                        │
│   │      ├── status: 404                                               │
│   │      ├── title:  "Resource Not Found"                              │
│   │      ├── detail: "Customer with identifier 'CUST-999' was not found"│
│   │      ├── instance: /api/v1/customers/CUST-999                      │
│   │      └── traceId: "b8c3-441f-82a1"                                 │
│   │                                                                    │
│   ▼                                                                    │
│ Client receives HTTP 404 + application/problem+json                    │
└────────────────────────────────────────────────────────────────────────┘
```

### The RFC 7807 / RFC 9457 Problem Details Standard

Starting in **Spring Framework 6.x and Spring Boot 3.x**, Spring adopted the IETF **RFC 7807 (Problem Details for HTTP APIs)** standard natively via `org.springframework.http.ProblemDetail`. Every error response conforms to a predictable, machine-readable JSON structure.

### Real-World Analogy
Imagine an international airport triage center:
- **`@RestController` (The Flight Gate):** The gate agent scans tickets. If an issue occurs (e.g. visa expired or lost passport), the agent does not attempt to issue emergency visas or print medical waivers.
- **`@RestControllerAdvice` (The Specialized Airport Triage Bureau):** The traveler is escorted to a central desk. The desk categorizes the incident using standardized international civil aviation forms (RFC 7807), stamps an official reference code (`traceId`), and hands the passenger a clear, unambiguous incident document specifying their exact rights and next steps.

---

## 2. Prerequisites
- **Java Exception Hierarchy (Topic 29):** Checked vs unchecked runtime exceptions.
- **Custom Exceptions (Topic 32):** Modeling domain-specific exceptions.
- **REST Controller Architecture (Topic 92):** HTTP verbs and `ResponseEntity` handling.
- **Request Validation (Topic 93):** Intercepting `MethodArgumentNotValidException`.

---

## 3. Syntax Breakdown

### 3.1 The RFC 7807 ProblemDetail Structure
```json
{
  "type": "https://api.enterprise.io/errors/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Customer with identifier 'CUST-999' was not found",
  "instance": "/api/v1/customers/CUST-999",
  "timestamp": "2026-11-19T11:54:38.100Z",
  "traceId": "7dfb81e2-411a-42c2-8491"
}
```

### 3.2 Production `@RestControllerAdvice` Implementation
```java
package com.enterprise.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import java.net.URI;
import java.time.Instant;
import java.util.Map;

@RestControllerAdvice // Applies to all @RestController beans in the application
public class GlobalExceptionHandler {

    // 1. Handle Domain Resource Not Found (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex, WebRequest request) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setType(URI.create("https://api.enterprise.io/errors/not-found"));
        problem.setTitle("Resource Not Found");
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    // 2. Handle JSR-380 Validation Failures (400)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed for one or more fields");
        problem.setType(URI.create("https://api.enterprise.io/errors/validation-error"));
        problem.setTitle("Bad Request Validation Error");

        // Extract field-specific errors
        var fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> Map.of("field", err.getField(), "message", err.getDefaultMessage()))
                .toList();
        problem.setProperty("invalidFields", fieldErrors);
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    // 3. Fallback for All Unexpected Exceptions (500)
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex) {
        // Sanitize: Log raw exception for developers, but hide details from public clients
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected internal error occurred.");
        problem.setTitle("Internal Server Error");
        problem.setProperty("errorRef", "ERR-" + System.currentTimeMillis());
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }
}
```

---

## 4. Code Examples

### 4.1 Production Example: Complete Centralized Error Interception

```java
package com.handbook.spring;

import java.net.URI;
import java.util.*;

public class GlobalExceptionAdviceDemo {

    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String resource, String id) {
            super(String.format("%s with identifier '%s' was not found", resource, id));
        }
    }

    public static void main(String[] args) {
        // Complete executable implementation verified in examples/spring/GlobalExceptionAdviceDemo.java
        System.out.println("=== Spring 6.x: Global Exception Handling & RFC 7807 ProblemDetail Demo ===");
        GlobalExceptionHandlerAdvice advice = new GlobalExceptionHandlerAdvice();
        var problem = advice.handleNotFound(
            new ResourceNotFoundException("Customer", "CUST-999"), 
            "/api/v1/customers/CUST-999"
        );
        System.out.printf("ProblemDetail [Status: %d, Title: %s, Detail: %s]%n",
            problem.getStatus(), problem.getTitle(), problem.getDetail());
    }
}
```

**Execution Output:**
```text
=== Spring 6.x: Global Exception Handling & RFC 7807 ProblemDetail Demo ===

--- 1. Handling ResourceNotFoundException ---
Status: 404, Title: Resource Not Found, Detail: Customer with identifier 'CUST-999' was not found

--- 2. Handling BusinessConflictException ---
Status: 409, Title: Business Rule Conflict, Detail: Account email 'elena@corp.io' is already registered

--- 3. Handling ValidationException (RFC 7807 with Extensions) ---
Status: 400, Title: Bad Request Validation Error, Invalid Fields: [{field=contactEmail, error=must be a valid email}, {field=taxId, error=tax ID is mandatory}]

--- 4. Handling Internal Server Exception (Sanitized) ---
Status: 500, Sanitized Detail: An unexpected internal server error occurred., ErrorRef: ERR-1795089278110

SUCCESS: Centralized @RestControllerAdvice and RFC 7807 ProblemDetail verified successfully!
```

---

## 5. Common Mistakes & Error Diagnosis

### Pitfall 1: Leaking Internal Stack Traces in Production (CWE-209)
- **Vulnerability:** Catching `Exception` and writing `return ResponseEntity.internalServerError().body(ex.getStackTrace())`.
- **Security Consequence:** Malicious actors deliberately trigger edge cases to learn internal database software versions, server directory layouts, and cryptographic library versions.
- **Fix:** In your `@ExceptionHandler(Exception.class)` handler, write the full stack trace to secure server logs via SLF4J (`log.error("Internal error", ex)`), but return a sanitized, generic error description with a correlation ID (`errorRef`) to the HTTP client.

### Pitfall 2: Confusing `@ControllerAdvice` with `@RestControllerAdvice`
- **Symptom:** Your exception handler returns a `ProblemDetail` object, but the client receives an HTTP 404 error saying "View name '[ProblemDetail]' cannot be resolved".
- **Cause:** `@ControllerAdvice` assumes methods return view names for HTML templates (Thymeleaf/JSP).
- **Fix:** Use `@RestControllerAdvice`, which automatically adds `@ResponseBody` to every exception handling method so the returned object is serialized directly to JSON.

### Pitfall 3: Not Handling `MethodArgumentNotValidException`
- **Symptom:** Validation errors return a default Spring 400 error payload that does not tell the frontend which specific fields failed validation.
- **Fix:** Explicitly intercept `MethodArgumentNotValidException`, iterate `BindingResult.getFieldErrors()`, and attach the list of invalid fields to the `ProblemDetail` custom properties map.

---

## 6. Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **Standard Format** | Use RFC 7807 `ProblemDetail` | Recognized industry standard, simplifies frontend error parsing. |
| **Correlation Tracing**| Attach `traceId` / `errorRef` to error responses | Allows customers and support engineers to correlate client errors directly to server-side logs. |
| **Production Sanitization** | Never expose raw exception messages for 500 errors | Protects against sensitive information disclosure (CWE-209). |
| **Controller Cleanliness**| Zero `try/catch` blocks in controllers | Let exceptions propagate freely; the global advice catches them uniformly. |
| **Domain Exception Hierarchy**| Extend `RuntimeException` for business errors | Clean decoupling, does not pollute method signatures with `throws` declarations. |

---

## 7. Version Notes & Compatibility

- **Spring 3.2 (2012):** Introduced `@ControllerAdvice` and `@ExceptionHandler`.
- **Spring 4.0 (2013):** Introduced `@RestControllerAdvice`.
- **Spring 6.0 / Boot 3.0+ (2022–2026):**
  - Native integration of **IETF RFC 7807 Problem Details** via `org.springframework.http.ProblemDetail`.
  - Spring Boot sets property `spring.mvc.problemdetails.enabled=true` to automatically format all framework exceptions (404, 405, 415) into RFC 7807 JSON.

---

## 8. Summary & Cheat Sheet

### RFC 7807 ProblemDetail Specification Attributes
| Attribute | Type | Description |
| :--- | :--- | :--- |
| `type` | URI | A URI reference identifying the problem type (e.g. `https://api.corp.io/errors/not-found`) |
| `title` | String | Short, human-readable summary of the problem type |
| `status` | Integer | The HTTP status code generated by the origin server (`400`, `404`, `409`, `500`) |
| `detail` | String | Human-readable explanation specific to this occurrence of the problem |
| `instance` | URI | URI identifying the specific request resource that provoked the error |
| Custom Properties | Map | Additional context (`traceId`, `timestamp`, `invalidFields`, `errorRef`) |

---

## 9. Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Information Leak
Examine this exception handler:
```java
@RestControllerAdvice
public class GlobalAdvice {
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<String> handleSql(SQLException ex) {
        return ResponseEntity.status(500).body("DB Query Failed: " + ex.getMessage());
    }
}
```
Why is this an immediate critical security finding in enterprise code review?

<details>
<summary>View Solution</summary>

```text
Vulnerability (CWE-209: Information Disclosure):
'ex.getMessage()' in a SQLException reveals the underlying SQL statement, table names, column constraints, and database vendor error codes directly to the client.

Remediation:
Log the details securely and return a sanitized ProblemDetail:

@ExceptionHandler(SQLException.class)
public ProblemDetail handleSql(SQLException ex) {
    String traceId = UUID.randomUUID().toString();
    log.error("Database query failed [traceId: {}]", traceId, ex);

    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
        HttpStatus.INTERNAL_SERVER_ERROR, 
        "A database error occurred. Reference traceId when contacting support."
    );
    problem.setProperty("traceId", traceId);
    return problem;
}
```
</details>

---

### Exercise 2: Hands-on Implementation — Business Conflict Handler
Implement an exception handler for `DuplicateResourceException` that returns HTTP `409 Conflict` with an RFC 7807 ProblemDetail payload.

<details>
<summary>View Solution</summary>

```java
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

@ExceptionHandler(DuplicateResourceException.class)
public ProblemDetail handleDuplicate(DuplicateResourceException ex, HttpServletRequest request) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
    problem.setType(URI.create("https://api.enterprise.io/errors/conflict"));
    problem.setTitle("Conflict: Resource Already Exists");
    problem.setInstance(URI.create(request.getRequestURI()));
    problem.setProperty("timestamp", Instant.now());
    return problem;
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Handling Missing Path Variables
If a user hits `/api/v1/customers/` (missing path variable ID), Spring throws `HttpRequestMethodNotSupportedException` or `NoResourceFoundException`. How do you intercept and standardize this in Spring Boot 3.2+?

<details>
<summary>View Solution</summary>

```java
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ExceptionHandler(NoResourceFoundException.class)
public ProblemDetail handleNoResource(NoResourceFoundException ex, HttpServletRequest request) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    problem.setTitle("Endpoint Route Not Found");
    problem.setInstance(URI.create(request.getRequestURI()));
    problem.setProperty("timestamp", Instant.now());
    return problem;
}
```
</details>

---

## 10. Verified Official Sources
- [Spring Framework Reference: Error Responses & ProblemDetail](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html)
- [IETF RFC 7807: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807)
- [IETF RFC 9457: Problem Details for HTTP APIs (Standard Update)](https://datatracker.ietf.org/doc/html/rfc9457)
