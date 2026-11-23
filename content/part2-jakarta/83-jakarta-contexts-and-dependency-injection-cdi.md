---
id: topic-83
slug: jakarta-contexts-and-dependency-injection-cdi
topicNumber: 83
title: Jakarta Contexts & Dependency Injection (CDI)
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Modern Jakarta EE Specifications
versionBadge: Jakarta CDI 4.0
difficulty: Advanced
readingTime: 8 min read
shortDescription: >-
  Reference: Contexts and Dependency Injection architecture (@Inject),
  contextual scopes (@RequestScoped, @ApplicationScoped), qualifiers, and
  producer methods.
prerequisites:
  - 'Topic 26: Interfaces & Modern Default Methods'
  - 'Topic 69: Servlet Lifecycle & Threading Model'
---

## Overview
Jakarta Contexts and Dependency Injection (CDI) is the standard dependency injection and component lifecycle architecture across the Jakarta EE platform. CDI binds the lifecycles of stateful components to well-defined contexts, resolving dependencies type-safely via `@Inject`, qualifiers, and interceptors.

---

## Master Jakarta CDI Annotations Reference Directory

Jakarta Contexts and Dependency Injection (CDI 4.0) provides a standard, type-safe dependency injection and component lifecycle architecture across the Jakarta EE stack.

| Annotation | Target Element | Category | Architectural Purpose & Container Behavior | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Inject`** | `CONSTRUCTOR`, `METHOD`, `FIELD` | Injection | Identifies injectable constructors, methods, and fields for type-safe contextual dependency resolution. | `@Inject private PaymentGateway paymentGateway;` |
| **`@Named`** | `TYPE`, `METHOD`, `FIELD`, `PARAM` | Resolution | Assigns EL-accessible string identifier to a CDI bean for Jakarta Expression Language / JSF / MVC binding. | `@Named("userManager") @RequestScoped public class UserManager {}` |
| **`@Produces`** | `METHOD`, `FIELD` | Producer | Declares a producer method or field turning non-CDI third-party objects or dynamic instances into injectable CDI beans. | `@Produces @ApplicationScoped public DataSource createDataSource() { ... }` |
| **`@Disposes`** | `PARAMETER` | Producer | Declares a cleanup destructor method automatically invoked when a produced bean is destroyed. | `public void close(@Disposes Connection conn) { conn.close(); }` |
| **`@Observes`** | `PARAMETER` | Events | Marks parameter as synchronous event observer method receiving dispatched events via `Event<T>.fire()`. | `public void onOrderCreated(@Observes OrderEvent event) { ... }` |
| **`@ObservesAsync`** | `PARAMETER` | Events | Marks parameter as asynchronous event observer receiving events fired via `Event<T>.fireAsync()`. | `public void onOrderCreated(@ObservesAsync OrderEvent event) { ... }` |
| **`@Alternative`** | `TYPE` | Selection | Declares a bean as a pluggable alternative disabled by default unless explicitly activated via `beans.xml` or `@Priority`. | `@Alternative @Priority(1) @ApplicationScoped public class MockPaymentGateway {}` |
| **`@Priority`** | `TYPE` | Selection | Assigns integer priority to alternatives or interceptors (higher integer = higher precedence). | `@Priority(Interceptor.Priority.APPLICATION + 10)` |
| **`@Qualifier`** | `ANNOTATION_TYPE` | Resolution | Meta-annotation defining custom typesafe qualifiers to distinguish multiple implementations of the same interface. | `@Qualifier @Retention(RUNTIME) public @interface Stripe {}` |
| **`@Stereotype`** | `ANNOTATION_TYPE` | Meta | Composes multiple CDI annotations (scope, interceptor bindings, qualifiers) into a single reusable meta-annotation. | `@Stereotype @ApplicationScoped @Transactional public @interface ServiceBean {}` |
| **`@AroundInvoke`** | `METHOD` | Interception | Declares an AOP interceptor method intercepting business invocations with `InvocationContext.proceed()`. | `@AroundInvoke public Object log(InvocationContext ctx) throws Exception { ... }` |

---

## CDI Contextual Scopes Hierarchy

| Scope Annotation | Lifecycle Duration | Concurrency & Threading | Best Used For |
| :--- | :--- | :--- | :--- |
| **`@RequestScoped`** | Single HTTP request | Bound to current thread | Request-specific forms, audit loggers |
| **`@SessionScoped`** | Duration of an `HttpSession` | Serialized across user requests | Shopping carts, user preferences |
| **`@ApplicationScoped`** | Entire application deployment | Shared singleton across all threads | Stateless services, caches, client factories |
| **`@Dependent`** (Default)| Inherits client bean's lifecycle | Bound to injection target | Helper formatters, lightweight utilities |

---

## Production Implementation: CDI Injection with Qualifiers

```java
package com.example.cdi;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;
import jakarta.inject.Qualifier;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

// 1. Define Qualifier Annotation
@Qualifier
@Retention(RetentionPolicy.RUNTIME)
@interface FastDelivery {}

// 2. Service Interface
interface ShippingService {
    double calculateCost(double weight);
}

// 3. Qualified Implementation
@ApplicationScoped
@FastDelivery
class ExpressShippingService implements ShippingService {
    @Override
    public double calculateCost(double weight) {
        return 15.00 + (weight * 2.5);
    }
}

// 4. Client Injection Target
@RequestScoped
public class OrderCheckoutBean {

    // CDI injects specific implementation based on Qualifier
    @Inject
    @FastDelivery
    private ShippingService shippingService;

    public double computeTotal(double weight) {
        return shippingService.calculateCost(weight);
    }
}
```

---

## Common Pitfalls & CDI Traps

- **Missing `beans.xml` in CDI 3.0 / 4.0:**
  CDI requires a `META-INF/beans.xml` marker file in the JAR or `WEB-INF/beans.xml` in the WAR. If `bean-discovery-mode="annotated"` is omitted or missing, the container may skip classpath scanning, causing `@Inject` injection points to throw `UnsatisfiedResolutionException`.
- **Ambiguous Dependency Resolution:**
  If two implementations of an interface are eligible for injection without `@Qualifier` or `@Alternative` differentiation, CDI fails at deployment with `AmbiguousResolutionException`.
- **Calling Constructors Directly Instead of Injecting:**
  Using `new OrderCheckoutBean()` instantiates a raw Java object outside the CDI container. In this unmanaged instance, all `@Inject` fields remain `null`.

---

## Verification & Practice

**Question:** What is the critical architectural difference between `@ApplicationScoped` and `@Dependent` in CDI?

**Explanation:** An `@ApplicationScoped` bean is instantiated once per application; all injection targets receive a reference to the same shared contextual client proxy. An `@Dependent` bean has no independent lifecycle: a brand new instance is created specifically for the injection target and is destroyed alongside the bean that holds it.

---

## Practice

### Q: What is the difference between `@RequestScoped` and `@ApplicationScoped` beans in Jakarta CDI?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** A `@RequestScoped` bean is instantiated when an HTTP request begins and destroyed when the response terminates, isolating state to that single client interaction. An `@ApplicationScoped` bean is an application-wide singleton created once across all web sessions and shared concurrently across all threads and users.
</details>
