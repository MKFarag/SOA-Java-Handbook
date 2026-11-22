---
id: topic-86
slug: jakarta-faces-jsf-and-enterprise-beans-ejb
topicNumber: 86
title: Jakarta Faces (JSF) & Enterprise JavaBeans (EJB)
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Modern Jakarta EE Specifications
versionBadge: Jakarta Faces 4.0 / EJB 4.0
difficulty: Advanced
readingTime: 8 min read
shortDescription: >-
  Reference: Jakarta Faces component-based UI lifecycle, Facelets .xhtml
  templates, Enterprise JavaBeans architecture (@Stateless vs @Stateful), and
  container-managed transactions.
prerequisites:
  - 'Topic 82: Jakarta Persistence (JPA) & Hibernate ORM'
  - 'Topic 83: Jakarta Contexts & Dependency Injection (CDI)'
---

## Overview
Jakarta Faces (formerly JSF) is a server-side component-oriented user interface framework, and Enterprise JavaBeans (EJB) provides container-managed transaction, concurrency, and security services. While modern greenfield systems often favor stateless RESTful APIs and React/Vue frontends, JSF and EJB remain widely deployed across global enterprise banking and government infrastructure.

---

## Jakarta Faces 6-Phase Lifecycle

```
1. Restore View (Reconstructs component tree from session/request)
       │
       ▼
2. Apply Request Values (Decodes incoming HTTP parameters into component values)
       │
       ▼
3. Process Validations (Executes converters and Bean Validation on input)
       │
       ▼
4. Update Model Values (Pushes validated input into backing CDI bean properties)
       │
       ▼
5. Invoke Application (Executes action listener methods, e.g. bean.submit())
       │
       ▼
6. Render Response (Encodes updated component tree into HTML for browser)
```

---

## Enterprise JavaBeans (EJB) Classification

| EJB Type | Annotation | State Retention | Concurrency Model | Typical Enterprise Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Stateless Session Bean** | `@Stateless` | No client state retained between calls | Pooled instances; thread-safe by isolation | High-throughput business calculations, transactional CRUD |
| **Stateful Session Bean** | `@Stateful` | Retains conversational state for one client | 1:1 client instance; serialized access | Multi-step wizard checkout, financial trading sessions |
| **Singleton Session Bean** | `@Singleton` | Single shared instance across application | Thread-safe with `@Lock(READ/WRITE)` | Global counters, in-memory caches, configuration caches |
| **Message-Driven Bean** | `@MessageDriven`| Stateless | Consumer thread per JMS message | Asynchronous JMS message consumption |

---

## Production Implementation: EJB Container-Managed Transaction

```java
package com.example.ejb;

import jakarta.ejb.Stateless;
import jakarta.ejb.TransactionAttribute;
import jakarta.ejb.TransactionAttributeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Stateless // Container pools instances and manages transactions automatically
public class BankingServiceBean {

    @PersistenceContext
    private EntityManager em;

    // TransactionAttributeType.REQUIRED: starts new transaction or joins existing
    @TransactionAttribute(TransactionAttributeType.REQUIRED)
    public void transferFunds(Long sourceId, Long targetId, double amount) {
        Account source = em.find(Account.class, sourceId);
        Account target = em.find(Account.class, targetId);

        if (source.getBalance() < amount) {
            // Throwing RuntimeException automatically rolls back the container transaction
            throw new IllegalStateException("Insufficient funds for transfer.");
        }

        source.debit(amount);
        target.credit(amount);
        // Container automatically commits on method exit
    }
}
```

---

## Common Pitfalls & Architectural Antipatterns

- **Checked Exceptions Do Not Roll Back EJB Transactions:**
  By default in EJB, throwing a **checked exception** (subclass of `java.lang.Exception`) does **NOT** trigger an automatic transaction rollback; the container commits the transaction! Only unchecked exceptions (`RuntimeException` or `Error`) trigger rollback. To roll back on checked exceptions, annotate with `@ApplicationException(rollback = true)`.
- **Heavy Stateful Bean Memory Leaks:**
  `@Stateful` beans remain allocated in server memory until explicitly terminated with `@Remove` or timed out. If clients abandon sessions without calling the remove method, the server exhausts heap memory.
- **Mixing Faces Component Lifecycle with Stateless REST:**
  Faces requires maintaining a server-side state tree of UI components. Trying to use JSF as a lightweight JSON REST endpoint adds massive overhead compared to JAX-RS or Spring MVC.

---

## Verification & Practice

**Question:** If a method in a `@Stateless` EJB annotated with `@TransactionAttribute(TransactionAttributeType.REQUIRED)` throws an `IllegalArgumentException`, what happens to the database transaction?

**Explanation:** The container automatically rolls back the transaction. Because `IllegalArgumentException` is an unchecked exception (`RuntimeException`), the EJB specification requires the container interceptor to catch it, mark the transaction for rollback, and rethrow the exception to the caller.

---

## Practice

### Q: Why have modern cloud architectures shifted away from stateful JSF component trees toward stateless RESTful services with decoupled client single-page apps?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** JSF maintains a stateful server-side UI component tree in `HttpSession` memory for every active browser session. Under horizontal cloud auto-scaling, stateful sessions require sticky sessions or expensive session replication across cluster nodes. Stateless REST APIs decouple presentation entirely, allow client caching, and enable stateless container instances to scale out linearly behind simple round-robin load balancers.
</details>
