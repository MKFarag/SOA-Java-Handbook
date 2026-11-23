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

## Master JPA & Hibernate Annotations Reference Directory

Below is the definitive, categorized reference guide for Jakarta Persistence (JPA) and Hibernate ORM annotations, their attributes, and production usage semantics.

### 1. Entity & Table Mapping Annotations

| Annotation | Target | Key Attributes | Purpose & Architectural Notes | Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Entity`** | Class | `name` | Designates a POJO as a persistent JPA domain entity managed by `EntityManager`. Must have a no-arg constructor and not be `final`. | `@Entity(name = "Customer")` |
| **`@Table`** | Class | `name`, `schema`, `catalog`, `uniqueConstraints`, `indexes` | Specifies the primary database table name, schema, and composite unique keys or index definitions. | `@Table(name = "customers", indexes = {@Index(columnList = "email")})` |
| **`@SecondaryTable`** | Class | `name`, `pkJoinColumns` | Maps a single entity across multiple relational database tables using a shared primary key join. | `@SecondaryTable(name = "customer_profiles")` |
| **`@MappedSuperclass`** | Class | N/A | Designates a base class whose persistent properties are inherited by concrete child entity tables (does not generate a separate table). | `@MappedSuperclass public abstract class BaseEntity` |

### 2. Primary Keys & Identity Generation

| Annotation | Target | Key Attributes | Purpose & Architectural Notes | Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Id`** | Field / Method | N/A | Declares the primary key attribute of the entity. | `@Id private Long id;` |
| **`@GeneratedValue`** | Field / Method | `strategy`, `generator` | Configures automated ID generation: `IDENTITY` (DB auto-increment), `SEQUENCE` (DB sequence), `TABLE`, or `AUTO`. | `@GeneratedValue(strategy = GenerationType.IDENTITY)` |
| **`@SequenceGenerator`** | Class / Field | `name`, `sequenceName`, `initialValue`, `allocationSize` | Defines a custom database sequence for batched ID allocations (set `allocationSize = 50` for high-throughput batching). | `@SequenceGenerator(name = "order_seq", sequenceName = "seq_orders", allocationSize = 50)` |
| **`@EmbeddedId`** | Field / Method | N/A | Maps a composite primary key encapsulated inside a dedicated `@Embeddable` class implementing `Serializable`. | `@EmbeddedId private OrderItemId id;` |
| **`@IdClass`** | Class | `value` | Designates a separate composite key class whose property names match multiple `@Id` fields in the entity. | `@IdClass(OrderItemPk.class)` |

### 3. Property & Column Mapping Annotations

| Annotation | Target | Key Attributes | Purpose & Architectural Notes | Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Column`** | Field / Method | `name`, `nullable`, `unique`, `length`, `precision`, `scale`, `updatable`, `insertable` | Customizes column name, nullability constraints, string length (default 255), and numeric precision. | `@Column(name = "tax_rate", nullable = false, precision = 5, scale = 2)` |
| **`@Basic`** | Field / Method | `optional`, `fetch` | Explicitly maps standard primitive/wrapper property (defaults to `FetchType.EAGER`). Set `fetch = FetchType.LAZY` for heavy fields. | `@Basic(optional = false)` |
| **`@Transient`** | Field / Method | N/A | Instructs JPA and Hibernate to ignore the field during persistence (not mapped to any DB column). | `@Transient private BigDecimal calculatedTotal;` |
| **`@Enumerated`** | Field / Method | `value` (`EnumType.STRING`, `EnumType.ORDINAL`) | Maps Java enums. **Always prefer `EnumType.STRING`** in enterprise code to prevent database corruption when enum order changes. | `@Enumerated(EnumType.STRING) private OrderStatus status;` |
| **`@Temporal`** | Field / Method | `value` (`DATE`, `TIME`, `TIMESTAMP`) | Specifies date/time precision for legacy `java.util.Date` and `Calendar` (modern `java.time.*` handles this automatically). | `@Temporal(TemporalType.TIMESTAMP) private Date creationDate;` |
| **`@Lob`** | Field / Method | N/A | Maps Large Objects: String/char[] to `CLOB`/`TEXT`; byte[] to `BLOB`/`BYTEA`. | `@Lob private String largeXmlPayload;` |
| **`@Formula`** *(Hibernate)* | Field / Method | `value` (Native SQL) | Read-only derived property calculated on the fly by the database engine via a subquery or expression. | `@Formula("(SELECT count(*) FROM items i WHERE i.order_id = id)") private int itemCount;` |

### 4. Entity Relationships & Association Mappings

| Annotation | Target | Key Attributes | Purpose & Architectural Notes | Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@ManyToOne`** | Field / Method | `fetch`, `cascade`, `optional` | Maps a Many-to-One association. **Always explicitly set `fetch = FetchType.LAZY`** (defaults to `EAGER`, which causes N+1 queries). | `@ManyToOne(fetch = FetchType.LAZY, optional = false)` |
| **`@OneToMany`** | Field / Method | `mappedBy`, `fetch`, `cascade`, `orphanRemoval` | Maps a One-to-Many collection. `mappedBy` designates the inverse owning side. Defaults to `LAZY`. | `@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)` |
| **`@OneToOne`** | Field / Method | `mappedBy`, `fetch`, `cascade`, `optional` | Maps a One-to-One relationship. Remember: non-owning bidirectional `@OneToOne` cannot be lazy-loaded in default JPA proxies. | `@OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "profile_id")` |
| **`@ManyToMany`** | Field / Method | `mappedBy`, `fetch`, `cascade` | Maps Many-to-Many associations via a bridge join table. Avoid bidirectional cascade delete on `@ManyToMany`. | `@ManyToMany @JoinTable(...) private Set<Role> roles;` |
| **`@JoinColumn`** | Field / Method | `name`, `referencedColumnName`, `nullable`, `foreignKey` | Specifies the physical foreign key column on the owning entity table. | `@JoinColumn(name = "customer_id", referencedColumnName = "id")` |
| **`@JoinTable`** | Field / Method | `name`, `joinColumns`, `inverseJoinColumns` | Customizes the join table name and foreign keys for `@ManyToMany` or unidirectional `@OneToMany` relationships. | `@JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))` |
| **`@OrderBy`** | Field / Method | `value` | Orders elements of a collection relationship using SQL `ORDER BY` syntax when fetched. | `@OrderBy("createdDate DESC") private List<Comment> comments;` |

### 5. Value Objects & Embeddables

| Annotation | Target | Key Attributes | Purpose & Architectural Notes | Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Embeddable`** | Class | N/A | Declares a value object whose fields are flattened and stored directly in the owning entity's database table. | `@Embeddable public class Address { ... }` |
| **`@Embedded`** | Field / Method | N/A | Injects an `@Embeddable` value object into an entity. | `@Embedded private Address shippingAddress;` |
| **`@AttributeOverride`** | Class / Field | `name`, `column` | Overrides the column name or properties of an embedded attribute (enables embedding the same value object multiple times). | `@AttributeOverride(name = "zipCode", column = @Column(name = "billing_zip"))` |

### 6. Inheritance Mapping Strategies

| Annotation | Target | Key Attributes | Purpose & Architectural Notes | Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Inheritance`** | Base Class | `strategy` | Defines polymorphic mapping: `SINGLE_TABLE` (default, fast joins), `JOINED` (normalized tables), or `TABLE_PER_CLASS`. | `@Inheritance(strategy = InheritanceType.JOINED)` |
| **`@DiscriminatorColumn`**| Base Class | `name`, `discriminatorType`, `length` | Identifies the column storing type information in `SINGLE_TABLE` or `JOINED` inheritance. | `@DiscriminatorColumn(name = "account_type", length = 20)` |
| **`@DiscriminatorValue`** | Subclass | `value` | Specifies the concrete discriminator string or value representing this subclass in the database. | `@DiscriminatorValue("SAVINGS")` |

### 7. Auditing, Versioning & Lifecycle Callbacks

| Annotation | Target | Key Attributes | Purpose & Architectural Notes | Example |
| :--- | :--- | :--- | :--- | :--- |
| **`@Version`** | Field / Method | N/A | Enables **Optimistic Concurrency Control**. Incremented automatically on every update; throws `OptimisticLockException` on concurrent collision. | `@Version private Long version;` |
| **`@CreationTimestamp`** *(Hibernate)* | Field | N/A | Automatically populates timestamp upon initial `INSERT` in database. | `@CreationTimestamp private Instant createdAt;` |
| **`@UpdateTimestamp`** *(Hibernate)* | Field | N/A | Automatically updates timestamp on every SQL `UPDATE`. | `@UpdateTimestamp private Instant updatedAt;` |
| **`@PrePersist` / `@PostPersist`** | Method | N/A | Entity lifecycle callback triggered right before / after initial database insertion. | `@PrePersist void onPrePersist() { ... }` |
| **`@PreUpdate` / `@PostUpdate`** | Method | N/A | Lifecycle callback triggered right before / after database update execution. | `@PreUpdate void onPreUpdate() { ... }` |
| **`@PreRemove` / `@PostRemove`** | Method | N/A | Lifecycle callback executed before / after deletion of entity from database. | `@PreRemove void onPreRemove() { ... }` |
| **`@PostLoad`** | Method | N/A | Lifecycle callback executed immediately after entity data has been read and loaded from database. | `@PostLoad void onPostLoad() { ... }` |

### 8. Cascade & Fetching Rules Matrix

| Property | Options | Default Semantics | Enterprise Production Recommendation |
| :--- | :--- | :--- | :--- |
| **`FetchType`** | `LAZY`, `EAGER` | `@ManyToOne`, `@OneToOne` = `EAGER`<br>`@OneToMany`, `@ManyToMany` = `LAZY` | **Always use `FetchType.LAZY` everywhere**. Fetch associations explicitly using `JOIN FETCH` or `@EntityGraph` to eliminate N+1 queries. |
| **`CascadeType`** | `ALL`, `PERSIST`, `MERGE`, `REMOVE`, `REFRESH`, `DETACH` | None | Use `CascadeType.ALL` or `CascadeType.PERSIST, CascadeType.MERGE` for strict Parent-Child aggregate roots (e.g. `Order` -> `OrderItem`). Never cascade delete on shared lookup tables (`User` -> `Role`). |
| **`orphanRemoval`** | `true`, `false` | `false` | When `true`, removing a child entity from the parent's collection automatically deletes the child row from the database table. |

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
