---
id: topic-84
slug: jakarta-contexts-and-dependency-injection-cdi
topicNumber: 84
title: Contexts & Dependency Injection (CDI)
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Jakarta EE Enterprise Stack Overview
versionBadge: Jakarta CDI 4.0 / EE 10
difficulty: Advanced
readingTime: 13 min read
shortDescription: >-
  Decouple enterprise architectures through type-safe dependency injection,
  lifecycle contexts (@ApplicationScoped, @RequestScoped), and qualifiers.
prerequisites:
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 23: Interfaces & Default Methods'
  - 'Topic 58: Annotations & Metadata'
---
# Topic 84: Contexts & Dependency Injection (CDI)

## 1. What It Is and Why It Exists
In complex software systems, hardcoding object instantiations via `new ServiceImpl()` tightly couples callers to concrete implementations. Tightly coupled code is notoriously difficult to unit-test, impossible to swap dynamically across environments (test vs production), and forces classes to manage their dependencies' lifecycles manually.

**Jakarta Contexts and Dependency Injection (CDI)** is the foundational glue of the modern Jakarta EE platform. CDI manages the instantiation, lifecycle, and injection of Java objects (beans) into client classes using standard annotations (`@Inject`, `@ApplicationScoped`, `@RequestScoped`).

### Real-World Analogy
Wall power outlets in modern buildings:
Your laptop, desk lamp, and phone charger do not hardwire their copper cables directly into the municipal electrical power grid at the power substation. Instead, both the wall and your appliances adhere to a standardized plug specification (interface). You plug in whatever device you need (`@Inject`), and the building's electrical system (CDI container) provides voltage seamlessly without you worrying about generator mechanics.

### Why It Exists
Before CDI, enterprise Java relied on disparate component models (EJB, JSF Managed Beans, Spring). CDI provides a unified, type-safe dependency injection standard with contextual lifecycles (tying bean instances directly to HTTP requests, user sessions, or global applications) and interceptors.

---

## 2. Prerequisites
- **Topic 16: Classes, Objects & Memory Layout:** Reference allocation and instantiation.
- **Topic 23: Interfaces:** Programming to abstractions rather than concrete types.
- **Topic 58: Annotations & Metadata:** Runtime annotation reflection.

---

## 3. Syntax Breakdown
```java
// 1. Define Service Interface & Implementation
public interface NotificationService {
    void notifyUser(String message);
}

@ApplicationScoped // Context: Exactly one instance per application lifecycle
public class EmailNotificationService implements NotificationService {
    @Override
    public void notifyUser(String message) {
        System.out.println("Emailing: " + message);
    }
}

// 2. Client Bean requesting dependency
@RequestScoped // Context: Bound to the lifecycle of a single HTTP request
public class OrderCheckoutController {

    @Inject // Container automatically injects matching NotificationService bean
    private NotificationService notifier;

    public void completeCheckout(Order order) {
        notifier.notifyUser("Order placed: #" + order.getId());
    }
}
```

### Key Elements Explained
- `@Inject`: Tells the CDI container to satisfy this field, constructor, or method parameter with a managed bean instance.
- `@ApplicationScoped`: Contextual scope where a single bean instance is shared across all threads and users for the lifetime of the application.
- `@RequestScoped`: Contextual scope where a fresh bean instance is created at the start of an HTTP request and destroyed when the request ends.
- `@Produces`: Method-level annotation allowing developers to turn third-party library classes into injectable CDI beans.

---

## 4. Runnable Examples

### Example 1: Basic Service Injection & Bean Scoping
```java
package com.handbook.enterprise;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.CONSTRUCTOR})
@interface Inject {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface ApplicationScoped {}

public class PaymentService {
    public interface PaymentProcessor {
        String pay(double amount);
    }

    @ApplicationScoped
    public static class CreditCardProcessor implements PaymentProcessor {
        @Override
        public String pay(double amount) {
            return "SUCCESS: Charged $" + amount + " to Credit Card";
        }
    }

    public static class OrderManager {
        @Inject
        private PaymentProcessor processor;

        public String processOrder(double amount) {
            return processor.pay(amount);
        }
        public void setProcessor(PaymentProcessor p) { this.processor = p; }
    }
}
```

#### Expected Output
```text
SUCCESS: Charged $99.50 to Credit Card
```

---

### Example 2: Realistic CDI Container Injection Simulator
```java
package com.handbook.enterprise;

import java.lang.annotation.*;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class CdiDependencyInjectionDemo {
    public interface PaymentGateway {
        String process(double amount);
    }

    public static class StripePaymentGateway implements PaymentGateway {
        @Override
        public String process(double amount) {
            return "SUCCESS [Stripe]: Charged $" + amount;
        }
    }

    public static class CheckoutService {
        private PaymentGateway gateway;

        public String executeCheckout(double orderTotal) {
            if (gateway == null) throw new IllegalStateException("CDI Injection Failed: Gateway is null!");
            return gateway.process(orderTotal);
        }
        public PaymentGateway getGateway() { return gateway; }
        public void setGateway(PaymentGateway gateway) { this.gateway = gateway; }
    }

    public static class SimpleCdiContainer {
        private final Map<Class<?>, Object> singletons = new HashMap<>();

        public <T> void registerSingleton(Class<T> type, T instance) {
            singletons.put(type, instance);
        }

        public <T> T createBean(Class<T> beanClass) throws Exception {
            T bean = beanClass.getDeclaredConstructor().newInstance();
            for (Field field : beanClass.getDeclaredFields()) {
                field.setAccessible(true);
                Class<?> targetType = field.getType();
                Object dependency = singletons.get(targetType);
                if (dependency != null) {
                    field.set(bean, dependency);
                    System.out.println("[CDI Container] Injected " + dependency.getClass().getSimpleName() 
                        + " into field: " + field.getName());
                }
            }
            return bean;
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Jakarta Contexts and Dependency Injection (CDI) ===");
        SimpleCdiContainer container = new SimpleCdiContainer();

        StripePaymentGateway stripeGateway = new StripePaymentGateway();
        container.registerSingleton(PaymentGateway.class, stripeGateway);

        CheckoutService checkout = container.createBean(CheckoutService.class);

        assert checkout.getGateway() != null : "Dependency should have been automatically injected";
        String receipt = checkout.executeCheckout(249.99);
        System.out.println("Checkout Result: " + receipt);
        assert receipt.contains("SUCCESS [Stripe]: Charged $249.99");

        System.out.println("CDI container dependency injection verified successfully.");
    }
}
```

#### Expected Output
```text
=== Jakarta Contexts and Dependency Injection (CDI) ===
[CDI Container] Injected StripePaymentGateway into field: gateway
Checkout Result: SUCCESS [Stripe]: Charged $249.99
CDI container dependency injection verified successfully.
```

---

## 5. Step-by-Step "What Happens When This Runs"
1. **Container Bootstrap:** Upon application startup, CDI scans the classpath for `beans.xml` or classes annotated with bean-defining annotations.
2. **Bean Discovery:** The container indexes all available bean implementations and registers them in the internal bean registry.
3. **Client Bean Requested:** A class annotated with `@RequestScoped` or `@Named` is requested by a Servlet or JSF page.
4. **Dependency Resolution:** The container inspects fields annotated with `@Inject`, matching the requested interface type to an active registered provider.
5. **Contextual Proxy Creation:** For scoped beans, the container injects a client proxy that dynamically delegates calls to the active instance of the current HTTP request or session.
6. **Destruction & Cleanup:** When the HTTP request terminates, the container destroys all `@RequestScoped` beans, calling `@PreDestroy` lifecycle hooks cleanly.

---

## 6. Common Mistakes and Solutions

### Mistake 1: Ambiguous Dependency Exception
**Symptom:** Application deployment fails with `org.jboss.weld.exceptions.DeploymentException: WELD-001409: Ambiguous dependencies for type [PaymentService] with qualifiers [@Default]`.
**Cause:** Two distinct classes implement the same interface (`StripeService` and `PayPalService`), and both are in the CDI discovery path. The container does not know which one to choose.
**Solution:** Use CDI Qualifiers (`@Qualifier`) or `@Alternative` with `@Priority` to tell the container which implementation to inject in each scenario.

### Mistake 2: Missing empty `beans.xml` in legacy environments
**Symptom:** `@Inject` fields remain `null` at runtime.
**Cause:** In CDI 1.x/2.x, the container required a `WEB-INF/beans.xml` or `META-INF/beans.xml` file to activate bean scanning within an archive.
**Solution:** Ensure `WEB-INF/beans.xml` exists with `bean-discovery-mode="annotated"`.

---

## 7. Best Practices and When NOT to Use It

### Best Practices
- Prefer constructor injection over field injection: Constructor injection makes dependencies explicit and enables unit testing without requiring CDI container reflection.
- Use `@Produces` factory methods when configuring third-party objects that cannot have source annotations added.
- Choose appropriate scopes: Keep stateful beans in `@RequestScoped` or `@SessionScoped`, and stateless services in `@ApplicationScoped`.

### When NOT to Use It
- Do not use CDI for tiny ephemeral data transfer objects (DTOs, Records): Instantiate DTOs directly with `new` or builders.

---

## 8. Version Notes
- **CDI 1.0 (Java EE 6 / JSR 299):** Introduced standard Java EE dependency injection.
- **CDI 4.0 (Jakarta EE 10):** Split into CDI Lite (build-time reflection-free compilation for GraalVM native images) and CDI Full.
- **Status:** Core foundational standard of Jakarta EE.

---

## 9. Summary Cheat Sheet
| Scope Annotation | Lifecycle Duration | Typical Usage |
|---|---|---|
| `@ApplicationScoped` | Lifetime of the entire application (JVM) | Stateless services, caches, thread pools |
| `@RequestScoped` | Single HTTP request thread | Form processors, controllers, request audit |
| `@SessionScoped` | Lifetime of the user's `HttpSession` | Shopping carts, authenticated user profiles |
| `@Dependent` | Default scope; inherits caller lifecycle | Helper utilities, logger producers |

---

## 10. Exercises with Solutions

### Exercise 1: Spot the Bug
<details>
<summary>View Solution</summary>
**Question:** Why does this code fail to compile or throw NullPointerException in a unit test?
```java
public class OrderService {
    @Inject
    private PaymentGateway gateway;

    public void checkout(double amt) {
        gateway.charge(amt);
    }
}
// Unit test:
OrderService service = new OrderService();
service.checkout(100.0);
```
**Solution:** In a plain JUnit test outside a CDI container, calling `new OrderService()` does not invoke the CDI injection engine. `gateway` remains `null`, throwing `NullPointerException`. To fix, provide a constructor `public OrderService(PaymentGateway gateway) { this.gateway = gateway; }` allowing easy mocking in unit tests.
</details>

### Exercise 2: Hands-on Implementation
<details>
<summary>View Solution</summary>
**Question:** Write a CDI producer method that turns `java.time.Clock.systemUTC()` into an injectable `java.time.Clock` bean.

**Solution:**
```java
@ApplicationScoped
public class ClockProducer {
    @Produces
    @ApplicationScoped
    public Clock produceUtcClock() {
        return Clock.systemUTC();
    }
}
```
</details>

---

## 11. Sources
- [Jakarta Contexts and Dependency Injection 4.0 Specification](https://jakarta.ee/specifications/cdi/4.0/)
- [JBoss Weld (CDI Reference Implementation) Guide](https://weld.cdi-spec.org/)
