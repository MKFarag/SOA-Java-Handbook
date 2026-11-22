---
id: topic-130
slug: java-database-persistence-spring-data
topicNumber: 130
title: 'Java Persistence Integration: Spring Data JPA vs Spring Data MongoDB'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 36
sectionTitle: Polyglot Persistence & NoSQL Systems
versionBadge: Spring Boot 3.x / Java 21+
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Connect Java and Spring Boot applications to databases: compare Spring Data
  JPA (MySQL/relational) with Spring Data MongoDB (document store) side-by-side.
prerequisites:
  - 'Topic 95: Spring Data JPA Architecture: Repository Hierarchy & JpaRepository'
  - 'Topic 121: MySQL Setup & Environments: Local XAMPP, phpMyAdmin & Docker'
  - 'Topic 130: MongoDB Fundamentals & Visual Querying with MongoDB Compass'
---
## Overview
Java applications integrate persistence through Spring Data abstractions, providing cohesive repository interfaces and configuration templates for both relational JPA and NoSQL MongoDB document stores.

---

## Side-by-Side Architectural Comparison

| Dimension | Relational: Spring Data JPA (MySQL) | Document: Spring Data MongoDB |
| :--- | :--- | :--- |
| **Underlying Engine** | MySQL, PostgreSQL, MariaDB via JDBC | MongoDB via Reactive / Blocking Mongo Driver |
| **Class Annotation** | **`@Entity`** + **`@Table(name = "products")`** | **`@Document(collection = "products")`** |
| **Primary Key** | `@Id @GeneratedValue(strategy = IDENTITY)` | `@Id` (String / BSON `ObjectId`) |
| **Repository Interface** | `extends JpaRepository<Product, Long>` | `extends MongoRepository<Product, String>` |
| **Relationship Model** | `@OneToMany`, `@ManyToOne`, `@JoinColumn` | `@DocumentReference` or Embedded Objects/Lists |
| **Transactions** | `@Transactional` (JDBC / JTA transaction) | `@Transactional` (requires Mongo Replica Set) |

---

## Implementation A: Spring Data JPA (Relational MySQL)

### 1. Maven Dependencies (`pom.xml`)
```xml
<dependencies>
    <!-- Spring Data JPA & Hibernate -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <!-- MySQL JDBC Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

### 2. Configuration (`application.properties`)
```properties
# MySQL Connection Settings
spring.datasource.url=jdbc:mysql://localhost:3306/enterprise_shop?serverTimezone=UTC&useSSL=false
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# Hibernate Settings
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
```

### 3. JPA Domain Entity
```java
package com.handbook.shop.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String sku;

    @Column(nullable = false, length = 150)
    private String productName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private int stockQuantity;

    // Constructors, Getters, and Setters...
    public Product() {}

    public Product(String sku, String productName, BigDecimal unitPrice, int stockQuantity) {
        this.sku = sku;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.stockQuantity = stockQuantity;
    }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public BigDecimal getUnitPrice() { return unitPrice; }
}
```

### 4. JPA Repository
```java
package com.handbook.shop.repository;

import com.handbook.shop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductJpaRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
}
```

---

## Implementation B: Spring Data MongoDB (Document Store)

### 1. Maven Dependency (`pom.xml`)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

### 2. Configuration (`application.properties`)
```properties
# MongoDB Connection URI
spring.data.mongodb.uri=mongodb://localhost:27017/enterprise_shop
```

### 3. MongoDB Document Entity
```java
package com.handbook.shop.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.util.List;

@Document(collection = "products")
public class ProductDocument {

    @Id
    private String id; // Automatically mapped to MongoDB _id (ObjectId hex string)

    @Indexed(unique = true)
    private String sku;

    private String productName;
    private BigDecimal unitPrice;
    private int stockQuantity;
    private List<String> tags;

    public ProductDocument() {}

    public ProductDocument(String sku, String productName, BigDecimal unitPrice, List<String> tags) {
        this.sku = sku;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.tags = tags;
    }

    public String getId() { return id; }
    public String getSku() { return sku; }
    public List<String> getTags() { return tags; }
}
```

### 4. MongoDB Repository
```java
package com.handbook.shop.repository;

import com.handbook.shop.document.ProductDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductMongoRepository extends MongoRepository<ProductDocument, String> {
    Optional<ProductDocument> findBySku(String sku);
    List<ProductDocument> findByTagsContaining(String tag);
}
```

---

## Persistence Best Practices Guide

| Goal | Relational JPA (MySQL) | Document (MongoDB) |
| :--- | :--- | :--- |
| **Schema Evolution** | Use automated migration scripts (**Flyway** / **Liquibase** - Topic 102). | Keep document models backward-compatible or write aggregation migration scripts. |
| **Avoid N+1 Queries** | Use `@EntityGraph` or `JOIN FETCH` queries. | Not applicable if related data is embedded inside the document. |
| **Connection Pooling** | Use HikariCP with `maximum-pool-size = 10`. | Mongo driver maintains an internal connection pool automatically. |
| **Currency Handling** | Always use `BigDecimal` mapped to `DECIMAL(12, 2)`. | Store as `Decimal128` or integer cents to prevent floating-point drift. |

---

## Pitfalls

- **Mixing JPA and Mongo Repositories in the Same Package:** In polyglot architectures containing both `@Entity` and `@Document` classes, placing both in the same package can confuse Spring Boot auto-configuration. Explicitly separate packages and annotate configurations with `@EnableJpaRepositories` and `@EnableMongoRepositories`.
- **Deploying `ddl-auto=update` to Production:** Relying on Hibernate to auto-update production relational schemas can lock tables or alter columns destructively during rolling deploys. Always set `spring.jpa.hibernate.ddl-auto=validate` and execute versioned Flyway migrations.
- **Storing Floating-Point Values for Money:** Using `double` primitives for prices in MongoDB documents introduces binary floating-point round-off errors. Always store currency as `Decimal128` or integer cents.

---

## Practice

### Q: In a hybrid enterprise service using both Spring Data JPA and Spring Data MongoDB, how do you prevent repository proxy collisions?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** You must physically isolate relational and document repositories into separate sub-packages (e.g. `com.example.repository.jpa` and `com.example.repository.mongo`) and specify explicit package boundaries in configuration classes using `@EnableJpaRepositories(basePackages = "com.example.repository.jpa")` and `@EnableMongoRepositories(basePackages = "com.example.repository.mongo")`. This guarantees Spring initializes the appropriate proxy generator for each interface.
</details>
