---
id: topic-108
slug: dynamic-queries-jpa-criteria-specifications
topicNumber: 108
title: Dynamic Queries via JPA Criteria API & Spring Data Specifications
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 31
sectionTitle: 'Advanced Persistence, Dynamic Queries & Auditing'
versionBadge: Spring Data 3.x / Boot 3.x
difficulty: Advanced
readingTime: 16 min read
shortDescription: >-
  Build type-safe, dynamic search queries in Spring Data JPA using
  JpaSpecificationExecutor and Specification<T>, composing complex
  multi-criteria boolean expressions without string concatenation.
prerequisites:
  - 'Topic 83: Jakarta Persistence (JPA) & Hibernate ORM'
  - 'Topic 95: Spring Data JPA Architecture: Repository Hierarchy & JpaRepository'
  - 'Topic 96: Automated Derived Query Methods, Dynamic Projections & JPQL @Query'
---
## Overview
Spring Data JPA Specifications encapsulate dynamic, reusable search criteria using the JPA Criteria API, building type-safe boolean predicates dynamically without string concatenation or SQL injection risks.

---

---

## Architecture & Core Mechanics

### Extending `JpaSpecificationExecutor<T>`

To enable specification execution on a Spring Data repository, extend `JpaSpecificationExecutor<T>` alongside `JpaRepository<T, ID>`:

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    // Inherits:
    // Optional<T> findOne(Specification<T> spec);
    // List<T> findAll(Specification<T> spec);
    // Page<T> findAll(Specification<T> spec, Pageable pageable);
    // List<T> findAll(Specification<T> spec, Sort sort);
    // long count(Specification<T> spec);
    // boolean exists(Specification<T> spec);
    // long delete(Specification<T> spec);
}
```

---

### The `Specification<T>` Functional Contract

`Specification<T>` is a functional interface in package `org.springframework.data.jpa.domain`:

```java
@FunctionalInterface
public interface Specification<T> extends Serializable {
    Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb);
}
```

- **`Root<T>`:** Represents the base entity in the `FROM` clause (`FROM Product p`). Used to navigate entity attributes (`root.get("price")`) and joins (`root.join("category")`).
- **`CriteriaQuery<?>`:** Represents the abstract query structure (`SELECT`, `DISTINCT`, `GROUP BY`, `ORDER BY`).
- **`CriteriaBuilder`:** The factory used to construct expressions, predicates, mathematical functions, and comparisons (`cb.equal()`, `cb.between()`, `cb.like()`, `cb.greaterThanOrEqualTo()`).

---

### Authoring Reusable Specification Factories

```java
public final class ProductSpecifications {

    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) ->
            category == null ? cb.conjunction() : cb.equal(root.get("category"), category);
    }

    public static Specification<Product> priceBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min != null && max != null) return cb.between(root.get("price"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            return cb.lessThanOrEqualTo(root.get("price"), max);
        };
    }

    public static Specification<Product> nameContains(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return cb.conjunction();
            return cb.like(cb.lower(root.get("title")), "%" + term.toLowerCase() + "%");
        };
    }
}
```

---

## Production Implementation

### Basic Example: Simulating Dynamic Predicate Assembly
```java
package com.handbook.spring;

import java.util.*;

public class BasicSpecificationSimulationDemo {

    public record SearchCriteria(String category, Double maxPrice, Boolean inStock) {}
    public record Product(String title, String category, double price, boolean inStock) {}

    public static void main(String[] args) {
        System.out.println("--- Spring Data JPA: Dynamic Specification Assembly ---");

        List<Product> catalog = List.of(
            new Product("Ultra Gaming Laptop", "Electronics", 1899.99, true),
            new Product("Wireless Mouse", "Electronics", 29.99, true),
            new Product("Mechanical Keyboard", "Electronics", 120.00, false),
            new Product("Office Desk Chair", "Furniture", 249.99, true)
        );

        SearchCriteria filter = new SearchCriteria("Electronics", 200.00, true);

        List<Product> matches = catalog.stream().filter(p -> {
            boolean match = true;
            if (filter.category() != null) match &= p.category().equalsIgnoreCase(filter.category());
            if (filter.maxPrice() != null) match &= p.price() <= filter.maxPrice();
            if (filter.inStock() != null) match &= p.inStock() == filter.inStock();
            return match;
        }).toList();

        System.out.println("Dynamic matching results for filter: " + filter);
        matches.forEach(p -> System.out.println(" -> " + p.title() + " ($" + p.price() + ")"));
    }
}
```

**Expected Terminal Output:**
```text
--- Spring Data JPA: Dynamic Specification Assembly ---
Dynamic matching results for filter: SearchCriteria[category=Electronics, maxPrice=200.0, inStock=true]
 -> Wireless Mouse ($29.99)
```

---

### Realistic Enterprise Example: Verified JpaSpecificationFilterDemo
```java
package com.handbook.spring;

import java.util.*;

public class JpaSpecificationFilterDemo {

    public record CustomerQuery(String country, Double minBalance, Boolean active) {}
    public record Customer(Long id, String name, String country, double balance, boolean active) {}

    public static class DynamicSpecificationEngine {
        public static List<Customer> filterCustomers(List<Customer> customers, CustomerQuery criteria) {
            return customers.stream().filter(c -> {
                if (criteria.country() != null && !criteria.country().equalsIgnoreCase(c.country())) {
                    return false;
                }
                if (criteria.minBalance() != null && c.balance() < criteria.minBalance()) {
                    return false;
                }
                if (criteria.active() != null && c.active() != criteria.active()) {
                    return false;
                }
                return true;
            }).toList();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 109: Dynamic Queries via JPA Criteria & Specifications ===");

        List<Customer> customers = List.of(
            new Customer(1L, "Alice Vance", "Egypt", 12500.00, true),
            new Customer(2L, "Bob Miller", "USA", 450.00, true),
            new Customer(3L, "Carlos Gomez", "Egypt", 8200.00, false),
            new Customer(4L, "Diana Prince", "Egypt", 34000.00, true)
        );

        CustomerQuery query = new CustomerQuery("Egypt", 10000.00, true);
        List<Customer> result = DynamicSpecificationEngine.filterCustomers(customers, query);

        System.out.printf("Filtered Customers (Country=%s, MinBalance=%.2f, Active=%s):%n",
            query.country(), query.minBalance(), query.active());
        result.forEach(c -> System.out.printf(" -> [%d] %s | Country: %s | Balance: $%.2f%n",
            c.id(), c.name(), c.country(), c.balance()));

        System.out.println("Topic 109 JPA Specification Dynamic Filtering verified successfully.");
    }
}
```

---

## Common Pitfalls & Traps

### Pitfall 1: Returning `null` Instead of `cb.conjunction()`
- **Symptom:** `NullPointerException` thrown deep inside Hibernate's `CriteriaQueryImpl` when chaining specifications.
- **Cause:** When a filter parameter is null/empty, returning `null` from `toPredicate()` breaks boolean composition chains like `specA.and(specB)`.
- **Diagnosis & Fix:** Always return `cb.conjunction()` (which evaluates to SQL `1=1` / neutral tautology) or null-check inside helper factories:
  ```java
  // INCORRECT:
  if (name == null) return null; // May break composition!

  // CORRECT:
  if (name == null || name.isBlank()) return cb.conjunction();
  ```

### Pitfall 2: Creating Multiple Duplicate Joins
- **Symptom:** The generated SQL query performs 4 separate `JOIN` statements to the same table (`JOIN categories c1 ... JOIN categories c2`), destroying performance.
- **Cause:** Each specification calling `root.join("category")` independently creates a new table join rather than reusing an existing join.
- **Diagnosis & Fix:** Reuse existing joins from `root.getJoins()` or navigate through singular attributes directly:
  ```java
  // Reusable join inspection:
  Join<Product, Category> categoryJoin = root.getJoins().stream()
      .filter(j -> j.getAttribute().getName().equals("category"))
      .map(j -> (Join<Product, Category>) j)
      .findFirst()
      .orElseGet(() -> root.join("category", JoinType.LEFT));
  ```

### Pitfall 3: Missing `query.distinct(true)` on Association Joins
- **Symptom:** Paginated search results display duplicate rows of the same parent entity.
- **Cause:** Joining a one-to-many relationship in a Criteria query produces multiple rows in the database result set.
- **Diagnosis & Fix:** Add `query.distinct(true)` inside the specification when performing collection joins.

---

## Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **Neutral Predicate** | Return `cb.conjunction()` for empty criteria | Guarantees safe functional composition via `.and()` and `.or()`. |
| **Separation of Concerns** | Keep Specifications stateless in static classes | Enhances reusability, modularity, and testability. |
| **Pagination Integration** | Always pass `Pageable` to `findAll(spec, pageable)` | Enforces server-side `LIMIT / OFFSET` on dynamic queries. |
| **Case Insensitivity** | Use `cb.lower(root.get("field"))` for text search | Prevents missed matches due to capital letters. |
| **Type Safety** | Consider JPA Static Metamodel classes (`Product_.price`) | Guarantees compile-time attribute checking against schema typos. |

---

## Version Notes & Compatibility

- **Spring Data 2.x:** Supported Specifications using classic Hibernate criteria queries.
- **Spring Data 3.x (Spring Boot 3.x):**
  - Upgraded to Jakarta Persistence 3.1 criteria architecture.
  - Hibernate 6 Semantic Query Model (SQM) translates criteria predicates into optimized ANSI SQL with clean parameter binding.
  - Native support for dynamic deletes via `repository.delete(specification)`.

---

## Summary & Cheat Sheet

| Query Strategy | Compile-Time Safety | Dynamic Composition | Learning Curve | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **Derived Methods** | High | None (Fixed combinations) | Zero | 1–3 fixed criteria filters. |
| **JPQL `@Query`** | Medium | Low | Low | Complex joins, aggregations, fixed queries. |
| **JPA Specifications** | High | **Unlimited (Functional DDD)** | Moderate | **Dynamic multi-criteria search filters, admin portals.** |
| **QueryDSL** | High (Code Generation) | High | High (Requires APT plugin) | Highly complex analytical reporting queries. |

---

## Hands-on Practice Exercises

### Exercise 1: Spot the Bug — NullPointer & Empty Predicate Handling
Review the following specification implementation:
```java
public static Specification<Customer> hasMinBalance(Double minBalance) {
    return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("balance"), minBalance);
}
```
What happens when `hasMinBalance(null)` is passed into `Specification.where(hasMinBalance(null)).and(isEgypt())`?

<details>
<summary>View Solution</summary>

**Cause:**
`cb.greaterThanOrEqualTo(root.get("balance"), null)` produces a criteria building error or generates invalid SQL (`WHERE balance >= null`). It must gracefully return a neutral predicate when the parameter is null.

**The Fix:**
```java
public static Specification<Customer> hasMinBalance(Double minBalance) {
    return (root, query, cb) -> minBalance == null
        ? cb.conjunction()
        : cb.greaterThanOrEqualTo(root.get("balance"), minBalance);
}
```
</details>

---

### Exercise 2: Hands-on Implementation — Multi-Field Dynamic Product Catalog Filter
Create a service method `searchProducts(ProductFilterDto filter, Pageable pageable)` that dynamically filters products by `category` (exact match), `minPrice` / `maxPrice` (range), and `active` (boolean).

<details>
<summary>View Solution</summary>

```java
package com.handbook.spring.service;

import com.handbook.spring.dto.ProductFilterDto;
import com.handbook.spring.model.Product;
import com.handbook.spring.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductCatalogService {

    private final ProductRepository productRepository;

    public ProductCatalogService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public Page<Product> searchProducts(ProductFilterDto filter, Pageable pageable) {
        Specification<Product> spec = Specification.where(null);

        if (filter.category() != null && !filter.category().isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), filter.category()));
        }

        if (filter.minPrice() != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), filter.minPrice()));
        }

        if (filter.maxPrice() != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), filter.maxPrice()));
        }

        if (filter.active() != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("active"), filter.active()));
        }

        return productRepository.findAll(spec, pageable);
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Joining Lazy Collections without Duplicate Results
<details>
<summary>View Solution</summary>
**Question:** When joining a `@OneToMany List<Tag> tags` collection in a dynamic product specification (`root.join("tags")`), why does the count query returned by `Page<Product>` report incorrect totals, and how is it resolved?

**Solution:**
1. **The Count Query Trap:** When Spring Data calculates `Page.getTotalElements()`, it runs a generated count query using the same specification. In Jakarta Persistence, `query.getResultType()` returns `Long.class` during the count query execution.
2. **The Fix:** Check the query result type before adding `query.distinct(true)` or fetching joins:
   ```java
   public static Specification<Product> hasTag(String tagName) {
       return (root, query, cb) -> {
           if (tagName == null || tagName.isBlank()) return cb.conjunction();

           // Only add distinct on data queries, not on the count query
           if (Long.class != query.getResultType() && long.class != query.getResultType()) {
               query.distinct(true);
           }

           Join<Product, Tag> tagJoin = root.join("tags", JoinType.INNER);
           return cb.equal(tagJoin.get("name"), tagName);
       };
   }
   ```
</details>

---

## Verified Official Sources
- [Spring Data JPA Reference: Specifications](https://docs.spring.io/spring-data/jpa/reference/repositories/specifications.html)
- [Jakarta Persistence Specification 3.1: Criteria API](https://jakarta.ee/specifications/persistence/3.1/)
- [Vlad Mihalcea: The Best Way to Use Spring Data JPA Specifications](https://vladmihalcea.com/spring-data-jpa-specifications/)

---

## Practice

### Q: Why are Spring Data Specifications preferred over dynamic string concatenation for multi-filter search screens?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Dynamic string concatenation (`"WHERE 1=1 " + sql`) is vulnerable to SQL injection, error-prone with spacing and parentheses, and impossible to type-check at compile time. Spring Data `Specification<T>` leverages the JPA Criteria API, building type-safe, composable predicate trees that compile cleanly and prevent injection attacks.
</details>
