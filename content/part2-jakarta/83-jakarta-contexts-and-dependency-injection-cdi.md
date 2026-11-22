---
id: topic-83
slug: jakarta-contexts-and-dependency-injection-cdi
topicNumber: 83
title: 'Jakarta Contexts & Dependency Injection (CDI)'
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Modern Jakarta EE Specifications
versionBadge: Jakarta CDI 4.0
difficulty: Advanced
readingTime: 8 min read
shortDescription: >-
  Reference: Contexts and Dependency Injection architecture (@Inject), contextual scopes (@RequestScoped, @ApplicationScoped), qualifiers, and producer methods.
prerequisites:
  - 'Topic 26: Interfaces & Modern Default Methods'
  - 'Topic 69: Servlet Lifecycle & Threading Model'
---

## Overview
Jakarta Contexts and Dependency Injection (CDI) is the standard dependency injection and component lifecycle architecture across the Jakarta EE platform. CDI binds the lifecycles of stateful components to well-defined contexts, resolving dependencies type-safely via `@Inject`, qualifiers, and interceptors.

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
