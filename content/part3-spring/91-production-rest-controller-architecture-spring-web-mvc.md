---
id: topic-91
slug: production-rest-controller-architecture-spring-web-mvc
topicNumber: 91
title: Production REST Controller Architecture with Spring Web MVC
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 26
sectionTitle: RESTful Web Services & Global Error Handling
versionBadge: Spring Boot 4.1 / Java 21+
difficulty: Intermediate
readingTime: 16 min read
shortDescription: >-
  Architect resilient, production-grade REST APIs using Spring Web MVC: HTTP
  method mappings (@GetMapping to @DeleteMapping), URI template variables
  (@PathVariable), query parameters (@RequestParam), payload deserialization
  (@RequestBody), and explicit HTTP status code semantics via ResponseEntity<T>.
prerequisites:
  - 'Topic 64: Web Architecture Fundamentals (HTTP Protocol)'
  - >-
    Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle
    Callbacks
  - 'Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes'
---
## Overview
Spring Web MVC provides declarative REST controllers combining @Controller and @ResponseBody to handle HTTP request routing, parameter extraction (@PathVariable, @RequestParam), and payload deserialization via Jackson into ResponseEntity wrappers.

---

---

## Architecture & Core Mechanics

### Mapping Annotations & HTTP Verbs

| Annotation | HTTP Verb | Idempotent | RFC 9110 Primary Semantic | Typical Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `@GetMapping` | `GET` | **Yes** | Read / retrieve resource representation | `200 OK` |
| `@PostMapping` | `POST` | **No** | Create subordinate resource / trigger action | `201 Created` / `200 OK` |
| `@PutMapping` | `PUT` | **Yes** | Full replacement of target resource | `200 OK` / `204 No Content` |
| `@PatchMapping` | `PATCH` | **No** | Partial update of specific resource fields | `200 OK` |
| `@DeleteMapping`| `DELETE` | **Yes** | Remove resource from server storage | `204 No Content` / `200 OK` |

### Master Spring Web MVC & REST Annotations Reference Directory

Spring Web MVC provides declarative routing, parameter parsing, content negotiation, and exception interception annotations. Below is the full directory categorized across routing and parameter handling.

#### 1. Controller Stereotypes & HTTP Mapping Annotations

| Annotation | Target | Key Attributes | RFC 9110 Semantics & Purpose | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@RestController`** | `TYPE` | `value` | Meta-annotation combining `@Controller` and `@ResponseBody`. Every handler method serializes return values directly to HTTP response payload. | `@RestController @RequestMapping("/api/v1/orders")` |
| **`@Controller`** | `TYPE` | `value` | Spring MVC stereotype for traditional MVC view-resolving controllers returning template names. | `@Controller public class WebViewController` |
| **`@ResponseBody`** | `TYPE`, `METHOD` | None | Signals Spring to serialize method return value via registered `HttpMessageConverter` (e.g. Jackson). | `public @ResponseBody UserDto getUser()` |
| **`@RequestMapping`** | `TYPE`, `METHOD` | `path`, `method`, `consumes`, `produces`, `params`, `headers` | General-purpose URL mapping declaring base URL paths, media types, and HTTP verb constraints. | `@RequestMapping(path = "/orders", consumes = "application/json")` |
| **`@GetMapping`** | `METHOD` | `path`, `produces` | Specialization for HTTP `GET` (Read). Idempotent & safe. | `@GetMapping("/{id}") public OrderDto getOrder(@PathVariable Long id)` |
| **`@PostMapping`** | `METHOD` | `path`, `consumes` | Specialization for HTTP `POST` (Create / action). Non-idempotent. Returns `201 Created` or `200 OK`. | `@PostMapping public ResponseEntity<OrderDto> create(@RequestBody OrderDto dto)` |
| **`@PutMapping`** | `METHOD` | `path`, `consumes` | Specialization for HTTP `PUT` (Full Replacement). Idempotent. Returns `200 OK` or `204 No Content`. | `@PutMapping("/{id}") public OrderDto replace(@PathVariable Long id, @RequestBody OrderDto d)` |
| **`@PatchMapping`** | `METHOD` | `path`, `consumes` | Specialization for HTTP `PATCH` (Partial Update). Non-idempotent. | `@PatchMapping("/{id}") public OrderDto patch(@PathVariable Long id, @RequestBody JsonMergePatch p)` |
| **`@DeleteMapping`** | `METHOD` | `path` | Specialization for HTTP `DELETE` (Remove). Idempotent. Returns `204 No Content`. | `@DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id)` |

#### 2. Request Parameter Resolution, Binding & Interception

| Annotation | Target | Key Attributes | Operational Mechanics | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@PathVariable`** | `PARAMETER` | `name` / `value`, `required = true` | Extracts URI template variable tokens from matching URL patterns (e.g. `/users/{userId}`). | `@GetMapping("/{id}") public UserDto get(@PathVariable("id") UUID id)` |
| **`@RequestParam`** | `PARAMETER` | `name`, `required = true`, `defaultValue` | Extracts query string parameters (`?page=0&size=20`) or multipart form fields. | `@GetMapping public Page<User> list(@RequestParam(defaultValue = "0") int page)` |
| **`@RequestBody`** | `PARAMETER` | `required = true` | Deserializes incoming HTTP request body directly into Java POJO / record via `HttpMessageConverter`. | `@PostMapping public User create(@Valid @RequestBody CreateUserDto dto)` |
| **`@RequestHeader`** | `PARAMETER` | `name`, `required = true`, `defaultValue` | Extracts specific HTTP header values from the request context. | `public User authenticate(@RequestHeader("Authorization") String token)` |
| **`@CookieValue`** | `PARAMETER` | `name`, `required = true`, `defaultValue` | Extracts HTTP cookie values by cookie name. | `public User profile(@CookieValue("SESSION_ID") String sessionId)` |
| **`@ModelAttribute`** | `PARAMETER`, `METHOD` | `name`, `binding = true` | Binds query parameters or form fields directly to bean properties / record components. | `@GetMapping("/search") public Result search(@ModelAttribute FilterDto filter)` |
| **`@ResponseStatus`** | `TYPE`, `METHOD` | `code` (`HttpStatus`), `reason` | Sets explicit HTTP response status code without needing a `ResponseEntity` wrapper. | `@ResponseStatus(HttpStatus.NO_CONTENT) @DeleteMapping("/{id}")` |
| **`@CrossOrigin`** | `TYPE`, `METHOD` | `origins`, `methods`, `maxAge` | Configures Cross-Origin Resource Sharing (CORS) headers for browsers. | `@CrossOrigin(origins = "https://app.enterprise.com")` |
| **`@RestControllerAdvice`** | `TYPE` | `basePackages`, `assignableTypes` | Global interceptor combining `@ControllerAdvice` + `@ResponseBody` for centralized error handling. | `@RestControllerAdvice public class GlobalExceptionHandler` |
| **`@ExceptionHandler`** | `METHOD` | `value = Class<? extends Throwable>[]` | Intercepts declared exceptions thrown across controllers and builds structured error responses. | `@ExceptionHandler(EntityNotFoundException.class) public ProblemDetail handle()`

```java
@RestController
@RequestMapping("/api/v1/orders")
public class OrderRestController {

    // 1. @PathVariable: extracts URI path tokens (/api/v1/orders/ORD-8812)
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable("orderId") String orderId) { ... }

    // 2. @RequestParam: extracts query string key-values (?status=PAID&page=0&size=20)
    @GetMapping
    public ResponseEntity<List<OrderDto>> listOrders(
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "page", defaultValue = "0") int page
    ) { ... }

    // 3. @RequestBody: deserializes JSON payload into a typed Java record
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody CreateOrderRequest request) { ... }

    // 4. @RequestHeader: extracts HTTP headers (e.g., Authorization or Idempotency-Key)
    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(
            @RequestHeader("X-Idempotency-Key") String idempotencyKey,
            @RequestBody CheckoutRequest request
    ) { ... }
}
```

---

## Production Implementation

### Production Example: Full CRUD REST Controller with `ResponseEntity`

```java
package com.enterprise.customers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerRestController {
    private final CustomerService customerService;

    public CustomerRestController(CustomerService customerService) {
        this.customerService = Objects.requireNonNull(customerService);
    }

    // 1. Query with filtering
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> listCustomers(
            @RequestParam(name = "tier", required = false) String tier
    ) {
        return ResponseEntity.ok(customerService.findByTier(tier));
    }

    // 2. Read single resource
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomer(@PathVariable String id) {
        return customerService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3. Create resource with 201 Created and Location Header
    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@RequestBody CreateCustomerRequest request) {
        CustomerResponse created = customerService.create(request);
        URI location = URI.create("/api/v1/customers/" + created.id());
        return ResponseEntity.created(location).body(created);
    }

    // 4. Delete with 204 No Content
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Common Pitfalls & Traps

### Pitfall 1: Returning Plain Entities Instead of DTOs (Data Leakage & N+1)
- **Symptom:** API responses leak sensitive fields (`hashedPassword`, `internalAuditNotes`) or fail serialization with `LazyInitializationException` / `JsonMappingException` circular recursion.
- **Cause:** Returning JPA `@Entity` classes directly from `@RestController` methods.
- **Fix:** Always map database entities to distinct, immutable Java **DTOs** or **Records** before writing to the HTTP response.

### Pitfall 2: Misusing HTTP Status Codes (The "Always 200 OK" Anti-Pattern)
- **Symptom:** Client receives `HTTP 200 OK` with JSON `{ "status": "ERROR", "message": "User not found" }`.
- **Cause:** Returning success status codes when operations fail breaks HTTP client retry mechanisms, browser caching, and API gateway routing.
- **Fix:** Honor RFC 9110 status codes:
  - `404 Not Found` when a resource identifier does not exist.
  - `400 Bad Request` for invalid input parameters.
  - `409 Conflict` for duplicate unique constraints.
  - `201 Created` with a `Location` header upon successful resource creation.

### Pitfall 3: Missing `@RequestBody` on Payload Parameter
- **Symptom:** All fields inside the request parameter DTO are `null` even though the client transmitted a valid JSON POST body.
- **Cause:** Without `@RequestBody`, Spring treats method arguments as query string / form-encoded parameters rather than parsing the HTTP request body stream.
- **Fix:** Ensure `@RequestBody` decorates incoming JSON DTO arguments.

---

## Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **API Versioning** | Use URI prefix (e.g. `/api/v1/...`) | Clear, human-readable, enables backwards compatibility across client versions. |
| **Response Container** | Always return `ResponseEntity<T>` | Allows explicit control over HTTP status codes, caching headers, and `Location` links. |
| **Resource Creation** | Return `201 Created` with `Location` header | Informs HTTP clients and proxies where the newly minted resource can be retrieved. |
| **Payload Immutability** | Use Java Records for Request/Response DTOs | Prevents accidental modification of incoming request data during pipeline execution. |
| **Controller Layering** | Keep controllers razor-thin | Controllers handle only HTTP mapping and status codes; business logic belongs in `@Service`. |

---

## Version Notes & Compatibility

- **Spring 2.5:** Introduced `@Controller` and `@RequestMapping`.
- **Spring 4.0:** Introduced `@RestController` (combining `@Controller` + `@ResponseBody`).
- **Spring 4.3:** Introduced verb-specific shortcuts: `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, and `@PatchMapping`.
- **Spring 6.0 / Boot 3.0+:** Full support for Java Records as request/response bodies, RFC 7807 problem details, and native AOT compilation for fast cloud serverless boot.

---

## Summary & Cheat Sheet

| HTTP Verb | Mapping Annotation | Idempotent | Safe | Success Status | Failed / Absent Status |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **GET** | `@GetMapping` | **Yes** | **Yes** | `200 OK` | `404 Not Found` |
| **POST** | `@PostMapping` | **No** | **No** | `201 Created` | `400 Bad Request` / `409 Conflict` |
| **PUT** | `@PutMapping` | **Yes** | **No** | `200 OK` / `204 No Content` | `404 Not Found` / `400 Bad Request` |
| **PATCH** | `@PatchMapping` | **No** | **No** | `200 OK` | `404 Not Found` / `400 Bad Request` |
| **DELETE** | `@DeleteMapping` | **Yes** | **No** | `204 No Content` | `404 Not Found` |

---

## Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Infinite JSON Loop
A developer defines:
```java
@Entity
public class Order {
    @OneToMany(mappedBy = "order")
    private List<OrderItem> items;
}

@Entity
public class OrderItem {
    @ManyToOne
    private Order order;
}

@GetMapping("/{id}")
public Order getOrder(@PathVariable Long id) {
    return orderRepository.findById(id).orElseThrow();
}
```
Invoking `GET /api/orders/1` crashes the server with `StackOverflowError: Infinite recursion (StackOverflowError) through reference chain`. Why?

<details>
<summary>View Solution</summary>

```text
Cause:
Jackson inspects 'Order', serializes 'items', then inside each 'OrderItem' inspects 'order', creating an infinite bidirectional reference loop.

Fix:
Never return JPA entities directly. Map to a clean, decoupled Record DTO:

public record OrderItemResponse(Long id, String sku, double price) {}
public record OrderResponse(Long id, List<OrderItemResponse> items) {}

@GetMapping("/{id}")
public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
    Order order = orderService.findById(id);
    var itemDtos = order.getItems().stream()
        .map(i -> new OrderItemResponse(i.getId(), i.getSku(), i.getPrice()))
        .toList();
    return ResponseEntity.ok(new OrderResponse(order.getId(), itemDtos));
}
```
</details>

---

### Exercise 2: Hands-on Implementation — Idempotent Customer Deletion
Implement a REST endpoint for deleting customers that returns `204 No Content` if deleted successfully, and `404 Not Found` if the customer does not exist.

<details>
<summary>View Solution</summary>

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
    boolean removed = customerService.deleteIfExists(id);
    if (!removed) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Handling Optional Query Filter Combinations
How do you structure a search endpoint accepting optional query parameters: `category`, `minPrice`, `maxPrice`, and `page` without generating 16 overloaded methods?

<details>
<summary>View Solution</summary>

```java
// Encapsulate search criteria into an immutable criteria record
public record ProductSearchCriteria(
    String category,
    Double minPrice,
    Double maxPrice,
    int page,
    int size
) {}

// Spring Web automatically binds query parameters to object fields matching their names!
@GetMapping("/search")
public ResponseEntity<PageResponse<ProductDto>> searchProducts(ProductSearchCriteria criteria) {
    // URL: /api/v1/products/search?category=ELECTRONICS&minPrice=100.0&page=0&size=20
    return ResponseEntity.ok(productService.search(criteria));
}
```
</details>

---

## Verified Official Sources
- [Spring Framework Reference: REST Controllers](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html)
- [Spring Framework Reference: Mapping Requests](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html)
- [RFC 9110: HTTP Semantics & Status Codes](https://www.rfc-editor.org/rfc/rfc9110.html)

---

## Practice

### Q: Why should production REST endpoints return explicit `ResponseEntity<T>` return types rather than raw entity instances?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** `ResponseEntity<T>` provides complete programmatic control over the HTTP response: setting accurate status codes (`201 Created`, `204 No Content`, `404 Not Found`), appending custom security or cache headers (`ETag`, `Cache-Control`), and wrapping response bodies in standard DTO envelopes.
</details>
