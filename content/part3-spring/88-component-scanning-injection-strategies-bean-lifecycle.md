---
id: topic-88
slug: component-scanning-injection-strategies-bean-lifecycle
topicNumber: 88
title: 'Component Scanning, Injection Strategies & Bean Lifecycle Callbacks'
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 24
sectionTitle: Spring Core & Inversion of Control
versionBadge: Spring Framework 6.x / Boot 3.x
difficulty: Intermediate
readingTime: 16 min read
shortDescription: >-
  Master Spring stereotype annotations, component scanning mechanics, the
  critical trade-offs between Constructor, Setter, and Field injection,
  ambiguity resolution with @Qualifier and @Primary, and the complete 8-phase
  Bean Lifecycle pipeline.
prerequisites:
  - 'Topic 18: Packages & Access Modifiers'
  - 'Topic 20: Inheritance & Method Overriding'
  - 'Topic 58: Annotations & Metadata Processing'
  - 'Topic 88: Spring Framework Core: BeanFactory vs ApplicationContext'
---
## Overview
Classpath component scanning discovers and registers Spring-managed beans automatically using stereotype annotations (@Component, @Service, @Repository, @Controller). Constructor injection provides immutable, testable dependency injection, while bean lifecycle callbacks (@PostConstruct, @PreDestroy) manage resource initialization and cleanup.

---

---

## Architecture & Core Mechanics

### The Three Injection Strategies Side-by-Side

#### 1. Constructor Injection (The Mandatory Enterprise Standard)
```java
@Service
public class OrderService {
    // 1. Dependencies declared final -> Guarantees immutability and thread safety
    private final PaymentGateway paymentGateway;
    private final InventoryClient inventoryClient;

    // 2. In Spring 4.3+, @Autowired is optional if there is only one constructor
    @Autowired
    public OrderService(PaymentGateway paymentGateway, InventoryClient inventoryClient) {
        this.paymentGateway = Objects.requireNonNull(paymentGateway, "PaymentGateway required");
        this.inventoryClient = Objects.requireNonNull(inventoryClient, "InventoryClient required");
    }
}
```

#### 2. Setter Injection (For Purely Optional Dependencies)
```java
@Service
public class ReportGenerator {
    private NotificationService notifier; // Optional

    @Autowired(required = false)
    public void setNotificationService(NotificationService notifier) {
        this.notifier = notifier;
    }
}
```

#### 3. Field Injection (Architectural Anti-Pattern — Avoid in Production!)
```java
@Service
public class BadOrderService {
    // AVOID: Prevents instantiation outside Spring; cannot be tested without reflection
    @Autowired
    private PaymentGateway paymentGateway;
}
```

---

### Resolving Injection Ambiguity: `@Primary` vs `@Qualifier`

When multiple beans implement the same interface, Spring throws `NoUniqueBeanDefinitionException` unless instructed which candidate to choose:

```java
public interface CurrencyConverter {
    double convert(double amount, String from, String to);
}

// Candidate 1: Default fallback for any unannotated injection point
@Component("ecbConverter")
@Primary
public class EuropeanCentralBankConverter implements CurrencyConverter { ... }

// Candidate 2: Explicitly named candidate
@Component("cryptoConverter")
public class BinanceCryptoConverter implements CurrencyConverter { ... }

@Service
public class CheckoutService {
    private final CurrencyConverter fiatConverter;
    private final CurrencyConverter cryptoConverter;

    @Autowired
    public CheckoutService(
            CurrencyConverter fiatConverter, // Automatically resolves to @Primary (ecbConverter)
            @Qualifier("cryptoConverter") CurrencyConverter cryptoConverter // Explicit selection
    ) {
        this.fiatConverter = fiatConverter;
        this.cryptoConverter = cryptoConverter;
    }
}
```

---

### The Complete 8-Phase Spring Bean Lifecycle

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Bean Lifecycle Stages                           │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Instantiation: JVM executes class constructor                       │
│ 2. Populate Properties: Injects collaborators into fields / setters    │
│ 3. Aware Interfaces: BeanNameAware, ApplicationContextAware invoked    │
│ 4. BeanPostProcessor (Before): postProcessBeforeInitialization()       │
│ 5. Initialization Callbacks: @PostConstruct -> afterPropertiesSet()    │
│ 6. BeanPostProcessor (After): AOP Proxy wrapping occurs here           │
│ 7. Ready for Service: Bean executes business requests                  │
│ 8. Destruction Callbacks: @PreDestroy -> DisposableBean.destroy()      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Production Implementation

### Production Example: Complete Lifecycle Execution & Disambiguation

```java
package com.handbook.spring;

import java.lang.annotation.*;
import java.util.Objects;

public class LifecycleDemonstration {

    public interface AlertGateway {
        void sendAlert(String message);
    }

    public static class PagerDutyGateway implements AlertGateway {
        @Override
        public void sendAlert(String message) {
            System.out.println("[PAGERDUTY HIGH-SEVERITY]: " + message);
        }
    }

    public static class SlackGateway implements AlertGateway {
        @Override
        public void sendAlert(String message) {
            System.out.println("[SLACK #ops-alerts]: " + message);
        }
    }

    public static class IncidentManagementService {
        private final AlertGateway primaryAlert;
        private final AlertGateway secondaryAlert;
        private boolean isOperational = false;

        // Constructor Injection with explicit immutability
        public IncidentManagementService(AlertGateway primary, AlertGateway secondary) {
            this.primaryAlert = Objects.requireNonNull(primary);
            this.secondaryAlert = Objects.requireNonNull(secondary);
            System.out.println("  [Phase 1: Instantiation] Constructor executed.");
        }

        public void initLifecycle() {
            this.isOperational = true;
            System.out.println("  [Phase 5: @PostConstruct] Sockets bound. System OPERATIONAL.");
        }

        public void handleOutage(String serviceName) {
            if (!isOperational) throw new IllegalStateException("Service not initialized!");
            primaryAlert.sendAlert("CRITICAL: Outage detected on " + serviceName);
            secondaryAlert.sendAlert("Notice: On-call engineer paged for " + serviceName);
        }

        public void shutdownLifecycle() {
            this.isOperational = false;
            System.out.println("  [Phase 8: @PreDestroy] Sockets gracefully closed.");
        }
    }

    public static void main(String[] args) {
        // Verified executable simulation in examples/spring/BeanLifecycleInjectionDemo.java
        System.out.println("=== Spring Bean Lifecycle Architecture ===");
        IncidentManagementService service = new IncidentManagementService(
            new PagerDutyGateway(),
            new SlackGateway()
        );
        service.initLifecycle();
        service.handleOutage("PAYMENT-AUTH-MICROSERVICE");
        service.shutdownLifecycle();
    }
}
```

**Execution Output:**
```text
=== Spring Bean Lifecycle Architecture ===
  [Phase 1: Instantiation] Constructor executed.
  [Phase 5: @PostConstruct] Sockets bound. System OPERATIONAL.
[PAGERDUTY HIGH-SEVERITY]: CRITICAL: Outage detected on PAYMENT-AUTH-MICROSERVICE
[SLACK #ops-alerts]: Notice: On-call engineer paged for PAYMENT-AUTH-MICROSERVICE
  [Phase 8: @PreDestroy] Sockets gracefully closed.
```

---

## Common Pitfalls & Traps

### Pitfall 1: Field Injection Causing `NullPointerException` in Unit Tests
- **Wrong Code:**
  ```java
  @Service
  public class AccountService {
      @Autowired
      private AccountRepository repository; // Injected reflectively by Spring

      public Account getAccount(String id) {
          return repository.findById(id); // Throws NPE when tested via 'new AccountService()'
      }
  }
  ```
- **Why It Fails:** When writing a plain JUnit 5 test without booting the heavy Spring context (`new AccountService()`), `repository` is `null`. The test author must resort to complex reflection hacks or mock frameworks to set private fields.
- **Fixed Code (Constructor Injection):**
  ```java
  @Service
  public class AccountService {
      private final AccountRepository repository;

      public AccountService(AccountRepository repository) {
          this.repository = Objects.requireNonNull(repository);
      }
  }
  // Now trivially unit testable: new AccountService(mockRepository);
  ```

### Pitfall 2: `NoUniqueBeanDefinitionException`
- **Symptom:** Startup crashes with:
  `org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'com.service.NotificationService' available: expected single matching bean but found 2: emailNotificationService,smsNotificationService`
- **Cause:** Two beans implement `NotificationService`, and the injection point did not specify `@Qualifier` or designate one candidate with `@Primary`.
- **Fix:** Mark the dominant production implementation with `@Primary`, or specify `@Qualifier("emailNotificationService")` at the injection point.

### Pitfall 3: Invoking `@Transactional` or AOP-Proxied Methods inside `@PostConstruct`
- **Symptom:** Transactions do not commit or rollback during initialization.
- **Cause:** Notice the lifecycle order: `@PostConstruct` executes in **Phase 5**, but AOP dynamic proxies (`TransactionInterceptor`, security guards) are generated by `BeanPostProcessor` in **Phase 6**. Inside `@PostConstruct`, `this` references the raw target object, not the transactional proxy!
- **Fix:** Use an `ApplicationListener<ContextRefreshedEvent>` or `@EventListener(ApplicationReadyEvent.class)` to run transactional logic after the container has fully initialized all proxies.

---

## Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **Primary Injection Pattern** | **Constructor Injection** | Enforces mandatory dependencies at compile-time, enables `final` immutability, and supports lightning-fast POJO unit tests. |
| **Boilerplate Reduction** | Use Lombok `@RequiredArgsConstructor` | Automatically generates constructor for all `final` fields, eliminating manual constructor maintenance. |
| **Initialization Method** | Use Standard `@PostConstruct` (`jakarta.annotation`) | Standardized annotation, clean decoupling from Spring's proprietary `InitializingBean` interface. |
| **Cleanup Method** | Use Standard `@PreDestroy` (`jakarta.annotation`) | Executes deterministically on graceful container shutdown (SIGTERM / JVM shutdown hook). |
| **Avoid Field Injection** | Prohibit `@Autowired` on private fields | Disables immutability, hides dependencies, and creates hidden coupling to Spring's reflection engine. |

---

## Version Notes & Compatibility

- **Spring 2.5 (2007):** Introduced annotation-driven injection: `@Autowired`, `@Component`, `@Qualifier`.
- **Spring 4.3 (2016):** Removed the requirement for explicit `@Autowired` on classes with a single constructor.
- **Spring 6.0 / Boot 3.0 (2022+):**
  - Requires **Java 17 LTS+**.
  - Migrated lifecycle annotations from legacy `javax.annotation.*` to modern **`jakarta.annotation.*`** (`@PostConstruct`, `@PreDestroy`).
  - Strict circular dependency prohibition: cycles between constructor-injected beans cause immediate boot-time termination rather than fallback to field-injection tricks.

---

## Summary & Cheat Sheet

### Injection Strategies Comparison
| Dimension | Constructor Injection | Setter Injection | Field Injection |
| :--- | :--- | :--- | :--- |
| **Immutability (`final`)** | **Yes (`final` supported)** | No (must be mutable) | No |
| **Mandatory Dependencies** | **Guaranteed** | Optional (can be null) | Guaranteed only by container |
| **POJO Unit Testability** | **Trivial (`new Service(...)`)** | Requires calling setters | **Hard (Requires reflection)** |
| **Circular Dependencies** | Caught at boot time | Permitted (can mask flaws) | Permitted (masks architectural flaws) |
| **Industry Recommendation** | **Standard (100% Preferred)** | Rare (Optional values only)| **Strictly Deprecated / Anti-Pattern** |

---

### The 8-Phase Bean Lifecycle Table
| Phase | Action | Component Responsible | Purpose |
| :---: | :--- | :--- | :--- |
| **1** | Instantiation | JVM Constructor | Allocates heap memory for bean |
| **2** | Populate Properties | Container DI | Injects collaborators into constructor/fields |
| **3** | Aware Callbacks | `BeanNameAware`, etc. | Gives bean knowledge of container metadata |
| **4** | BPP Before | `BeanPostProcessor` | Pre-initialization validation / inspection |
| **5** | Custom Init | `@PostConstruct` | Resource allocation, socket warmup |
| **6** | BPP After | `BeanPostProcessor` | **Wraps target bean in AOP dynamic proxies** |
| **7** | Production Ready | Consumer Services | Processes application business transactions |
| **8** | Custom Destroy | `@PreDestroy` | Closes network sockets, drains queues, flushes logs |

---

## Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Un-mockable Service
Analyze this code written by a junior backend engineer:
```java
@Service
public class TaxCalculatorService {
    @Autowired
    private HashingAlgorithm algorithm;

    public String computeTaxHash(double amount) {
        return algorithm.digest(String.valueOf(amount));
    }
}
```
A unit test attempts:
```java
@Test
void testTax() {
    TaxCalculatorService service = new TaxCalculatorService();
    String hash = service.computeTaxHash(100.0);
    assertNotNull(hash);
}
```
What happens when running the test, and how do you re-architect it?

<details>
<summary>View Solution</summary>

```text
Problem:
Running 'new TaxCalculatorService()' outside Spring leaves 'algorithm' as null.
Invoking 'computeTaxHash' throws a NullPointerException on 'algorithm.digest()'.

Architectural Refactoring:
Replace field injection with Constructor Injection:

@Service
public class TaxCalculatorService {
    private final HashingAlgorithm algorithm;

    public TaxCalculatorService(HashingAlgorithm algorithm) {
        this.algorithm = Objects.requireNonNull(algorithm);
    }

    public String computeTaxHash(double amount) {
        return algorithm.digest(String.valueOf(amount));
    }
}

The unit test now executes cleanly with zero Spring context overhead:
@Test
void testTax() {
    HashingAlgorithm mockAlgorithm = amount -> "HASH-12345";
    TaxCalculatorService service = new TaxCalculatorService(mockAlgorithm);
    assertEquals("HASH-12345", service.computeTaxHash(100.0));
}
```
</details>

---

### Exercise 2: Hands-on Implementation — Custom BeanPostProcessor for Telemetry
Implement a custom `BeanPostProcessor` that measures the instantiation-to-initialization time of all beans in milliseconds and logs a warning if initialization exceeds 100ms.

<details>
<summary>View Solution</summary>

```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class PerformanceMonitoringPostProcessor implements BeanPostProcessor {
    private final Map<String, Long> startTimes = new ConcurrentHashMap<>();

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        startTimes.put(beanName, System.currentTimeMillis());
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        Long start = startTimes.remove(beanName);
        if (start != null) {
            long duration = System.currentTimeMillis() - start;
            if (duration > 100) {
                System.err.printf("[PERF WARNING] Bean '%s' took %d ms to initialize! Optimize initialization!%n",
                    beanName, duration);
            }
        }
        return bean;
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Circular Dependencies
Service A depends on Service B. Service B depends on Service A.
```java
@Service
public class OrderService {
    public OrderService(BillingService billing) { ... }
}

@Service
public class BillingService {
    public BillingService(OrderService orders) { ... }
}
```
What happens at startup in Spring Boot 3.x, and what is the proper architectural solution?

<details>
<summary>View Solution</summary>

```text
Diagnosis:
Spring Boot 3.x throws 'BeanCurrentlyInCreationException: Requested bean is currently in creation: Is there an unresolvable circular reference?'.
By default, circular references are disabled in modern Spring Boot.

Root Architectural Cause:
Circular dependencies indicate a violation of the Single Responsibility Principle (SRP).
OrderService and BillingService have intertwined responsibilities.

Proper Solution:
Extract the shared coordinating logic into a third mediator service, or publish decoupled domain events:

            ┌────────────────────────┐
            │   CheckoutMediator     │
            └───────┬────────┬───────┘
                    │        │
                    ▼        ▼
             OrderService  BillingService

Now neither OrderService nor BillingService depends on the other. Both are injected into CheckoutMediator.
```
</details>

---

## Verified Official Sources
- [Spring Framework Reference: Dependencies & Dependency Injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies.html)
- [Spring Framework Reference: Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Jakarta Annotations 2.1 Specification (`@PostConstruct`, `@PreDestroy`)](https://jakarta.ee/specifications/annotations/2.1/)

---

## Practice

### Q: Why is Constructor Injection strongly favored over Field Injection (`@Autowired` on private fields) in modern Spring development?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Field injection relies on reflection to mutate private fields, hides class dependencies, and prevents classes from being instantiated in pure unit tests without Spring test runners. Constructor injection guarantees immutability (`final` fields), ensures required dependencies cannot be null, and permits straightforward unit testing with plain mock constructors.
</details>
