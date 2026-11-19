---
id: 103
title: "Modern Automated Testing: JUnit 5, Mockito & Testcontainers"
sectionId: 30
part: "Part 3: Spring Boot & The Modern Production Ecosystem"
order: 103
summary: "Build resilient test automation suites across the testing pyramid: JUnit 5 Jupiter assertions and lifecycle, Mockito test doubles, Spring Boot test slices (@WebMvcTest, @DataJpaTest), and real database integration with Testcontainers."
keyTakeaways:
  - "The Testing Pyramid balances fast, isolated Unit Tests (JUnit 5 + Mockito), focused architectural Slice Tests (`@WebMvcTest`, `@DataJpaTest`), and real-environment Integration Tests (Testcontainers)."
  - "JUnit 5 (Jupiter engine) modernizes test architecture with `@Test`, `@BeforeEach`, `@Nested`, `@ParameterizedTest`, and functional `assertThrows()` assertions."
  - "Mockito isolates units by stubbing collaborator interactions (`when().thenReturn()`) and asserting call behavior (`verify(mock, times(1))`."
  - "Testcontainers replaces in-memory mock databases (like H2) with ephemeral, production-identical Docker containers (PostgreSQL, Kafka, Redis), eliminating false positives from SQL dialect discrepancies."
---

# Modern Automated Testing: JUnit 5, Mockito & Testcontainers

High-velocity engineering teams rely on automated test suites as their primary defense against regressions. In modern Spring Boot applications, testing spans three distinct architectural tiers: fast unit tests, focused layer slices, and real-environment containerized integration tests.

---

## 1. The Modern Enterprise Testing Pyramid

```
                       / \
                      /   \
                     / E2E \       <-- Full System / Cypress / Playwright
                    /-------\
                   / Integr. \     <-- Testcontainers (PostgreSQL, Kafka)
                  /-----------\
                 / Slice Tests \   <-- @WebMvcTest, @DataJpaTest
                /---------------\
               /   Unit Tests    \ <-- JUnit 5 + Mockito (Fast, In-Memory)
              /-------------------\
```

---

## 2. Unit Testing with JUnit 5 & Mockito

Unit tests execute without loading the Spring container, providing sub-millisecond feedback:

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private PaymentGateway paymentGateway;

    @InjectMocks
    private OrderService orderService;

    @Test
    @DisplayName("Should successfully charge account when balance is sufficient")
    void testSuccessfulCheckout() {
        // Arrange (Stubbing)
        when(paymentGateway.processCharge("ACC-101", 250.0)).thenReturn(true);

        // Act
        boolean result = orderService.checkout("ACC-101", 250.0);

        // Assert
        assertTrue(result);
        verify(paymentGateway, times(1)).processCharge("ACC-101", 250.0);
    }
}
```

---

## 3. Spring Boot Test Slices

Instead of `@SpringBootTest` (which loads the entire application context and slows down test suites), Spring Boot provides targeted **Test Slices**:

| Slice Annotation | Layer Tested | Mocked Automatically |
| :--- | :--- | :--- |
| `@WebMvcTest(OrderController.class)` | Controller, JSON serialization, Security | Services and Repositories (`@MockBean`) |
| `@DataJpaTest` | Repository queries, JPA entity mapping | Web controllers, business services |
| `@JsonTest` | Jackson DTO serialization / deserialization | Everything else |

---

## 4. Real Integration Testing with Testcontainers

Using in-memory databases like H2 for testing often introduces subtle production failures: H2 does not support PostgreSQL JSONB queries, native window functions, or precise concurrency isolation levels. **Testcontainers** spins up real Docker containers during test bootstrap:

```java
@SpringBootTest
@Testcontainers
class OrderRepositoryIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void testNativePostgresJsonQuery() {
        assertNotNull(orderRepository.findAll());
    }
}
```
*Note: With Spring Boot 3.1+, `@ServiceConnection` automatically wires database connection properties (`spring.datasource.url`) directly from the running container without manual `@DynamicPropertySource` declarations.*

---

## 5. Verification & Architecture Demo

The executable architecture demo `examples/spring/ModernTestingDemo.java` implements:
- `MockitoSimulator` providing dynamic proxy mocks, `when().thenReturn()` stubs, and `verify()` invocations.
- `OrderService` checkout business logic and `assertThrows` validation.
- `PostgreSQLContainerSimulator` demonstrating automated container startup, readiness probing, and resource teardown.

Compile and run the verified test:
```bash
javac -d examples/web/classes examples/spring/ModernTestingDemo.java
java -ea -cp examples/web/classes com.handbook.spring.ModernTestingDemo
```
