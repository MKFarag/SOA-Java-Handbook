---
id: topic-82
slug: jakarta-persistence-jpa-and-hibernate
topicNumber: 82
title: Jakarta Persistence (JPA) & Hibernate ORM
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 23
sectionTitle: Modern Jakarta EE Specifications
versionBadge: Jakarta Persistence 3.1 / Hibernate 6.4
difficulty: Advanced
readingTime: 9 min read
shortDescription: >-
  Reference: Object-Relational Mapping (ORM) fundamentals, EntityManager
  lifecycle states (Transient, Managed, Detached, Removed), dirty checking, and
  1st-level cache.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 81: JDBC Connection Pooling & JNDI in Web Containers'
---

## Overview
Jakarta Persistence (JPA) is the standard specification for Object-Relational Mapping (ORM) in Java, implemented by engines such as Hibernate. JPA bridges object-oriented domain models with relational database tables, managing entity state transitions, automated dirty checking, identity mapping, and transactional persistence via the `EntityManager` interface.

---

## Entity Lifecycle State Transitions

```
                 Entity Lifecycle States
    new Product()
          │
          ▼
    ┌───────────┐    em.persist(e)     ┌───────────┐
    │ Transient ├─────────────────────>│  Managed  │<──┐
    └───────────┘                      └─────┬─────┘   │ em.merge(e)
                                 em.remove() │         │
                                             ▼         │
                                       ┌───────────┐   │
                                       │  Removed  │   │
                                       └───────────┘   │
                                             ▲         │
                               em.detach() / │         │
                               em.close()    ▼         │
                                       ┌───────────┐   │
                                       │ Detached  ├───┘
                                       └───────────┘
```

---

## Entity States Specification Matrix

| State | Database Record Exists? | Tracked by Persistence Context? | Can Trigger Automated Dirty Checking? |
| :--- | :--- | :--- | :--- |
| **Transient** | No (new in memory) | No | No |
| **Managed** | Yes (or queued on flush) | **Yes (1st Level Cache)** | **Yes** (modifications synced to DB on commit) |
| **Detached** | Yes | No (context closed or detached)| No (must call `em.merge()`) |
| **Removed** | Scheduled for deletion | Yes | Yes (triggers SQL `DELETE` on commit) |

---

## Production Implementation: Standard JPA Entity & Persistence Logic

```java
package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Version
    private Long version; // Optimistic locking protection

    public Product() {} // Required no-arg constructor

    public Product(String name, BigDecimal price) {
        this.name = name;
        this.price = price;
    }

    public void setPrice(BigDecimal price) { this.price = price; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
}
```

```java
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import java.math.BigDecimal;

public class ProductDao {
    private static final EntityManagerFactory emf =
            Persistence.createEntityManagerFactory("production-pu");

    public void updatePrice(Long productId, BigDecimal newPrice) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();

            // Product enters MANAGED state
            Product product = em.find(Product.class, productId);
            if (product != null) {
                // Automated Dirty Checking: modifying setter triggers SQL UPDATE on commit
                product.setPrice(newPrice);
            }

            em.getTransaction().commit(); // Flushes changes to DB
        } catch (Exception e) {
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        } finally {
            em.close(); // Product transitions to DETACHED state
        }
    }
}
```

---

## Common Pitfalls & ORM Traps

- **Missing Default No-Arg Constructor:**
  JPA providers instantiate entities via reflection using `Class.getDeclaredConstructor().newInstance()`. If an entity defines only parameterized constructors without an explicit no-arg constructor, JPA throws `InstantiationException`.
- **Calling `em.merge()` Unnecessarily on Managed Entities:**
  When an entity is already in the `MANAGED` state (e.g., returned by `em.find()`), modifying its fields automatically triggers an `UPDATE` SQL statement upon transaction commit via dirty checking. Calling `em.merge()` is redundant.
- **The N+1 Query Problem:**
  Fetching a list of entities with lazy-loaded relationships (e.g., `@OneToMany`) in a loop executes 1 query for the parent entities and $N$ additional queries for each child collection. Mitigate using `JOIN FETCH` in JPQL or Entity Graphs.

---

## Verification & Practice

**Question:** An entity is fetched inside an open transaction via `em.find()`, its setter is invoked to modify a field, and then `em.getTransaction().commit()` is executed without calling `em.persist()` or `em.update()`. Does the database get updated?

**Explanation:** Yes. Because the entity was retrieved via `em.find()`, it resides in the `MANAGED` state inside the 1st-level cache. During transaction commit, the `EntityManager` runs dirty checking by comparing the entity's current state with its initial snapshot taken when loaded. If any property changed, Hibernate generates and executes the appropriate SQL `UPDATE` statement automatically.

---

## Practice

### Q: What is the difference between a JPA entity in the "Managed" state versus the "Detached" state?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** A Managed entity is associated with an active `EntityManager` persistence context; any mutations to its getters/setters are tracked by snapshot dirty-checking and automatically synchronized to the database upon transaction commit. A Detached entity was once managed but its `EntityManager` session has closed; mutations to detached objects are ignored by the database unless explicitly reattached via `em.merge()`.
</details>
