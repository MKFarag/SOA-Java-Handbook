---
id: topic-103
slug: modern-automated-testing-junit5-mockito-testcontainers
topicNumber: 103
title: 'Modern Automated Testing: JUnit 5, Mockito & Testcontainers'
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 30
sectionTitle: Production Libraries & Distributed Systems
versionBadge: Spring Boot 3.x / JUnit 5 / Testcontainers 1.19+
difficulty: Advanced
readingTime: 18 min read
shortDescription: >-
  Build robust enterprise test suites using the Testing Pyramid: unit tests with
  JUnit 5 and Mockito, slice tests with @WebMvcTest and @DataJpaTest, and real
  containerized integration tests with Testcontainers.
prerequisites:
  - 'Topic 88: Spring Framework Core: BeanFactory vs ApplicationContext'
  - 'Topic 92: Production REST Controller Architecture with Spring Web MVC'
  - 'Topic 95: Spring Data JPA Architecture: Repository Hierarchy & JpaRepository'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 103: Modern Automated Testing: JUnit 5, Mockito & Testcontainers

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

High-velocity engineering teams rely on automated test suites as their primary defense against regressions. In modern Spring Boot applications, testing spans three distinct architectural tiers: fast unit tests, focused layer slices, and real-environment containerized integration tests.

---

## 1. What It Is and Why It Exists

In software engineering, testing code against production bugs requires balancing **speed**, **isolation**, and **fidelity**:
1. If you only write slow End-to-End (E2E) tests that boot up complete microservice clusters, your test suite takes 45 minutes to run, stalling developer productivity.
2. If you only write Unit Tests with mocked dependencies, your business logic might pass, but your real SQL queries or JSON HTTP serialization will fail when deployed to production.

The modern testing paradigm combines three targeted tools:
- **JUnit 5 (Jupiter):** The foundational test runner and assertion framework for the JVM.
- **Mockito:** A dynamic mock framework that isolates units of code by stubbing external collaborators.
- **Testcontainers:** A Java library that programmatically provisions lightweight, ephemeral Docker containers for real databases, brokers, and caches during testing.

### Real-World Analogy
Think of vehicle manufacturing:
- **Unit Tests (JUnit 5 + Mockito):** Inspecting a standalone brake caliper on a workbench using simulated hydraulic pressure gauges. It takes 2 milliseconds to verify that the caliper clamps shut.
- **Slice Tests (`@WebMvcTest`, `@DataJpaTest`):** Connecting the brake pedal, master cylinder, and dashboard warning light on an electrical test rig to verify signal transmission.
- **Integration Tests (Testcontainers):** Installing the brake system into an actual prototype car and test-driving it on an asphalt track under wet conditions. If the car slips on the actual road surface, you catch the flaw before shipping the car to consumers.

---

## 2. Prerequisites
Before studying automated testing, you should understand:
- [Topic 11: Methods & Modular Code](file:///c:/Users/modym\OneDrive\Desktop\Java-Doc\content\part1-core\11-methods-parameters-and-return-values.md) — Method boundaries and parameter passing.
- [Topic 29: The Java Exception Hierarchy](file:///c:/Users/modym\OneDrive\Desktop\Java-Doc\content\part1-core\29-the-java-exception-hierarchy.md) — Asserting runtime exceptions.
- [Topic 89: Component Scanning & Injection Strategies](file:///c:/Users/modym\OneDrive\Desktop\Java-Doc\content\part3-spring\89-component-scanning-injection-strategies-bean-lifecycle.md) — Spring dependency injection and IoC container lifecycles.

---

## 3. Syntax Breakdown & Core Mechanics

### 3.1 The Enterprise Testing Pyramid

```
                       / \
                      /   \
                     / E2E \       <-- Full System / Cypress / Playwright (Slow, High Fidelity)
                    /-------\
                   / Integr. \     <-- Testcontainers (PostgreSQL, Kafka, Redis)
                  /-----------\
                 / Slice Tests \   <-- @WebMvcTest, @DataJpaTest, @JsonTest (Fast Spring Slices)
                /---------------\
               /   Unit Tests    \ <-- JUnit 5 + Mockito (Sub-millisecond, In-Memory)
              /-------------------\
```

### 3.2 JUnit 5 (Jupiter Engine) Syntax
JUnit 5 decomposes tests into distinct lifecycle phases:
- `@Test`: Marks a method as a test case.
- `@BeforeEach` / `@AfterEach`: Setup and teardown hooks executed before and after every test method.
- `@Nested`: Groups tests hierarchically by feature, enabling readable Behavior-Driven Development (BDD).
- `@ParameterizedTest` + `@ValueSource` / `@CsvSource`: Runs the same test logic across multiple input data sets.
- `assertAll(...)`: Executes multiple assertions simultaneously, reporting all failures rather than aborting on the first failure.
- `assertThrows(ExpectedException.class, () -> executable)`: Verifies that a code block throws the expected exception type.

### 3.3 Mockito Test Double Syntax
- `@Mock`: Generates a dynamic proxy mock instance of a class or interface with zero real implementation logic.
- `@InjectMocks`: Instantiates the real class under test and injects declared `@Mock` fields into its constructor.
- `when(mock.method(arg)).thenReturn(val)`: Configures canned behavior (stubbing).
- `verify(mock, times(1)).method(arg)`: Asserts that a method was invoked with exact parameter arguments.
- `ArgumentCaptor<T>`: Captures method arguments passed into mocks for detailed field assertion.

### 3.4 Spring Boot Test Slices
Instead of loading the entire heavy `@SpringBootTest` context, Spring Boot provides isolated layer slices:

| Slice Annotation | Layer Loaded | Mocks Required | Typical Execution Speed |
| :--- | :--- | :--- | :---: |
| `@WebMvcTest(OrderController.class)` | Controller, Filters, JSON serialization, Security | `@MockBean` for Services | $\sim 500\text{ ms}$ |
| `@DataJpaTest` | Repositories, EntityManager, Flyway schema | Mocks web controllers | $\sim 1\text{ s}$ |
| `@JsonTest` | Jackson ObjectMapper serializers/deserializers | Standalone | $\sim 200\text{ ms}$ |
| `@SpringBootTest` | Full Application Context, All Beans | None (or integration mocks) | $\sim 5\text{--}15\text{ s}$ |

---

## 4. Production Code Examples

### 4.1 Isolated Unit Test with JUnit 5 & Mockito
```java
package com.handbook.spring.service;

import com.handbook.spring.exception.InsufficientBalanceException;
import com.handbook.spring.model.Account;
import com.handbook.spring.repository.AccountRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Account Service Unit Tests")
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private AccountService accountService;

    @Nested
    @DisplayName("Transfer Funds Operation")
    class TransferFundsTests {

        @Test
        @DisplayName("Should transfer money and send notification when balance is sufficient")
        void shouldTransferSuccessfully() {
            // Arrange
            Account sender = new Account("ACC-1", new BigDecimal("500.00"));
            Account receiver = new Account("ACC-2", new BigDecimal("100.00"));

            when(accountRepository.findById("ACC-1")).thenReturn(Optional.of(sender));
            when(accountRepository.findById("ACC-2")).thenReturn(Optional.of(receiver));

            // Act
            accountService.transfer("ACC-1", "ACC-2", new BigDecimal("200.00"));

            // Assert
            assertAll(
                () -> assertEquals(new BigDecimal("300.00"), sender.getBalance()),
                () -> assertEquals(new BigDecimal("300.00"), receiver.getBalance()),
                () -> verify(accountRepository, times(1)).save(sender),
                () -> verify(accountRepository, times(1)).save(receiver),
                () -> verify(notificationService).sendAlert(eq("ACC-1"), contains("Transfer successful"))
            );
        }

        @Test
        @DisplayName("Should throw InsufficientBalanceException when sender lacks funds")
        void shouldFailWhenInsufficientFunds() {
            Account sender = new Account("ACC-1", new BigDecimal("50.00"));
            when(accountRepository.findById("ACC-1")).thenReturn(Optional.of(sender));

            assertThrows(InsufficientBalanceException.class, () ->
                accountService.transfer("ACC-1", "ACC-2", new BigDecimal("200.00"))
            );

            verify(accountRepository, never()).save(any());
        }
    }
}
```

### 4.2 Web Slice Test with `@WebMvcTest` & `MockMvc`
```java
package com.handbook.spring.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.handbook.spring.dto.CreateCustomerRequest;
import com.handbook.spring.dto.CustomerResponse;
import com.handbook.spring.service.CustomerService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CustomerService customerService;

    @Test
    @DisplayName("POST /api/customers should return 201 Created on valid request")
    void shouldCreateCustomer() throws Exception {
        CreateCustomerRequest request = new CreateCustomerRequest("Elena Vance", "elena@example.com");
        CustomerResponse response = new CustomerResponse(101L, "Elena Vance", "elena@example.com");

        when(customerService.createCustomer(any())).thenReturn(response);

        mockMvc.perform(post("/api/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(101))
            .andExpect(jsonPath("$.email").value("elena@example.com"));
    }

    @Test
    @DisplayName("POST /api/customers should return 400 Bad Request when email is invalid")
    void shouldRejectInvalidEmail() throws Exception {
        CreateCustomerRequest invalidRequest = new CreateCustomerRequest("Elena", "not-a-valid-email");

        mockMvc.perform(post("/api/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400));
    }
}
```

### 4.3 Containerized Integration Test with Testcontainers & Spring Boot 3.1+
```java
package com.handbook.spring.integration;

import com.handbook.spring.model.Product;
import com.handbook.spring.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Testcontainers
class ProductRepositoryIntegrationTest {

    // Automatically wires spring.datasource.url/username/password into Spring context
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldPersistAndQueryUsingRealPostgresDatabase() {
        Product product = new Product("Mechanical Keyboard", new BigDecimal("129.99"), true);
        Product saved = productRepository.save(product);

        assertNotNull(saved.getId());

        List<Product> results = productRepository.findByPriceGreaterThanAndActiveTrue(new BigDecimal("100.00"));
        assertEquals(1, results.size());
        assertEquals("Mechanical Keyboard", results.get(0).getTitle());
    }
}
```

---

## 5. Common Mistakes & Error Diagnosis

### Pitfall 1: Over-Mocking Anti-Pattern (Testing the Mocks Instead of Code)
**The Hazard:** Developers mock every single internal data structure, list, and simple POJO:
```java
List<String> mockList = mock(List.class);
when(mockList.get(0)).thenReturn("Mocked");
// Pointless test verifying Mockito's internal library behavior!
```
**The Architectural Rule:** Never mock data objects, Java Records, Collections, or DTOs. Only mock **collaborating service boundaries, network boundaries, and external I/O** (e.g. HTTP clients, payment gateways, repositories).

### Pitfall 2: Context Cache Pollution with `@MockBean`
**The Hazard:** Placing different `@MockBean` declarations across 30 separate test classes.
**Why it fails:** Spring caches the `ApplicationContext` across test classes to keep test runs fast. When Spring encounters a new `@MockBean` variation, it considers the context modified ("dirty"), shuts down the running context, and spins up a brand-new application context. A test suite that should take 20 seconds ends up taking 12 minutes!
**The Fix:** Group `@MockBean` declarations in a shared abstract base test configuration class, or use pure unit tests with `@ExtendWith(MockitoExtension.class)` without Spring.

### Pitfall 3: False Confidence from In-Memory Databases (H2)
**The Hazard:** Running integration tests against an in-memory H2 database while production uses PostgreSQL.
**Why it fails:** H2 does not evaluate PostgreSQL-specific syntax: JSONB queries (`data->>'key'`), case-sensitive collations, distinct lock semantics (`SELECT ... FOR UPDATE SKIP LOCKED`), or PostgreSQL sequences. Tests pass 100% on H2 but crash immediately upon deployment.
**The Fix:** Use **Testcontainers** with the official `postgres:16-alpine` image to ensure test runs match production byte-for-byte.

---

## 6. Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **Testing Pyramid Ratio** | 70% Unit, 20% Slice, 10% Integration | Delivers rapid build feedback while guaranteeing production reliability. |
| **BDD Hierarchies** | Structure tests with `@Nested` & `@DisplayName` | Produces readable test reports that serve as live executable documentation. |
| **Spring Boot 3.1+ Wiring** | Use `@ServiceConnection` with Testcontainers | Eliminates manual boilerplate `@DynamicPropertySource` declarations. |
| **Assertion Completeness** | Use `assertAll()` for multi-property verification | Prevents cascading hidden bugs by evaluating all asserts even if the first fails. |
| **Teardown Safety** | Prefer `@ServiceConnection` and ephemeral containers | Guarantees test isolation without lingering database state between test classes. |

---

## 7. Version Notes & Compatibility
- **JUnit 5.10+ (Jupiter):** Replaces JUnit 4 `@Rule` and `@ClassRule` with a unified `@ExtendWith` extension model.
- **Spring Boot 3.1+ Testcontainers:** Introduced `@ServiceConnection`, dynamically binding JDBC, R2DBC, Kafka, and Redis properties directly from Docker containers.
- **Mockito 5.x:** Mockito now uses the inline mock maker by default, supporting mocking of final classes and methods on modern JDK 21 runtimes.

---

## 8. Summary Cheat Sheet

| Test Tier | Primary Framework | Spring Context Loaded? | Execution Speed | Verification Scope |
| :--- | :--- | :---: | :---: | :--- |
| **Unit Test** | JUnit 5 + Mockito | No | $\sim 1\text{ ms}$ | Isolated method algorithms & edge cases |
| **Web Slice** | `@WebMvcTest` + MockMvc | Sliced (Web only) | $\sim 500\text{ ms}$ | HTTP routing, Status codes, JSON validation |
| **JPA Slice** | `@DataJpaTest` | Sliced (JPA only) | $\sim 1\text{ s}$ | SQL queries, Projections, Entity mappings |
| **Integration** | Testcontainers | Full Context | $\sim 3\text{--}8\text{ s}$ | Real DB queries, Transactions, Container I/O |

---

## 9. Verification & Architecture Demo

The executable architecture demo `examples/spring/ModernTestingDemo.java` implements:
- `MockitoSimulator` providing dynamic proxy mocks, `when().thenReturn()` stubs, and `verify()` invocations.
- `OrderService` checkout business logic and `assertThrows` validation.
- `PostgreSQLContainerSimulator` demonstrating automated container startup, readiness probing, and resource teardown.

Compile and run the verified test:
```bash
javac -d examples/web/classes examples/spring/ModernTestingDemo.java
java -ea -cp examples/web/classes com.handbook.spring.ModernTestingDemo
```

---

## 10. Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Shared Mock State Mutation
A developer writes a unit test class with Mockito:
```java
@ExtendWith(MockitoExtension.class)
class DiscountCalculatorTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private DiscountService discountService;

    private Coupon globalCoupon = new Coupon("SUMMER20", 20);

    @Test
    void testStandardDiscount() {
        when(couponRepository.findByCode("SUMMER20")).thenReturn(Optional.of(globalCoupon));
        double price = discountService.applyDiscount("SUMMER20", 100.0);
        globalCoupon.setDiscountPercent(50); // Mutates shared state!
        assertEquals(80.0, price);
    }

    @Test
    void testSecondDiscount() {
        when(couponRepository.findByCode("SUMMER20")).thenReturn(Optional.of(globalCoupon));
        double price = discountService.applyDiscount("SUMMER20", 100.0);
        assertEquals(80.0, price); // Intermittent test failure!
    }
}
```
Why does `testSecondDiscount()` intermittently fail when tests run in parallel or different execution orders, and how is this fixed?

<details>
<summary>View Solution</summary>

**Cause:**
`globalCoupon` is declared as an instance variable of the test class and mutated directly inside `testStandardDiscount()`. If test methods run in different sequences or across concurrent threads, `globalCoupon.getDiscountPercent()` contains `50` instead of `20`, causing `testSecondDiscount()` to calculate `50.0` instead of `80.0`.

**The Fix:**
Never share mutable fixture objects across test methods. Re-instantiate test data cleanly inside `@BeforeEach` or locally within each individual test method:
```java
@BeforeEach
void setUp() {
    // Fresh independent object for every single test execution
    coupon = new Coupon("SUMMER20", 20);
}
```
</details>

---

### Exercise 2: Hands-on Implementation — Testing Bean Validation Rejection with MockMvc
Write a complete Spring Boot slice test using `@WebMvcTest(OrderController.class)` that submits an invalid `OrderRequest` payload (where `quantity` is negative `-5` violating `@Min(1)`). Assert that:
1. HTTP status is `400 Bad Request`.
2. The response content type is `application/problem+json` (RFC 7807) or JSON.
3. The underlying service method `orderService.placeOrder(any())` is **never** invoked.

<details>
<summary>View Solution</summary>

```java
package com.handbook.spring.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.handbook.spring.dto.OrderRequest;
import com.handbook.spring.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
class OrderControllerValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @Test
    @DisplayName("Should reject order with negative quantity and prevent service execution")
    void shouldRejectInvalidOrderQuantity() throws Exception {
        // Arrange: Invalid quantity violating @Min(1)
        OrderRequest invalidOrder = new OrderRequest("SKU-99", -5);

        // Act & Assert HTTP boundary
        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidOrder)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400));

        // Assert that controller aborted before calling the business service
        verify(orderService, never()).placeOrder(any());
    }
}
```

**Runtime Behavior & Verification:**
- Spring's `MethodArgumentNotValidException` is triggered during parameter resolution before the controller method is entered.
- `verify(orderService, never()).placeOrder(any())` passes, proving that invalid payloads never contaminate the business logic layer.
</details>

---

### Exercise 3: Real-World Edge Case — Singleton Reusable Testcontainers Pattern
<details>
<summary>View Solution</summary>
**Question:** If an application has 40 `@SpringBootTest` integration test classes and each declares `@Container static PostgreSQLContainer<?> postgres = ...`, the test runner starts and stops 40 separate Docker containers. This slows the CI build by over 5 minutes and frequently exhausts Docker daemon socket ports. How do you implement the **Singleton Container Pattern** in Testcontainers so a single Docker container is shared across all test classes throughout the entire build lifecycle?

**Solution:**
Create an abstract base integration test class that starts the container manually inside a static initializer block, **omitting the `@Testcontainers` and `@Container` annotations** (which manage per-class lifecycle):

```java
public abstract class AbstractIntegrationTest {

    static final PostgreSQLContainer<?> POSTGRES;

    static {
        POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("testdb")
            .withReuse(true); // Enables Testcontainers daemon reuse
        POSTGRES.start(); // Starts once for the entire JVM test process
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }
}
```
All 40 integration test classes extend `AbstractIntegrationTest`. The container starts exactly once at the beginning of the Maven build, remains alive across all test classes, and is cleaned up automatically by the Ryuk sidecar container when the JVM exits.
</details>

---

## 11. Verified Official Sources & References
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Official Documentation](https://site.mockito.org/)
- [Testcontainers for Java Guide](https://java.testcontainers.org/)
- [Spring Boot Testing Reference](https://docs.spring.io/spring-boot/reference/testing/index.html)
