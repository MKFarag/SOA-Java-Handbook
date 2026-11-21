---
id: topic-126
slug: sql-subqueries-and-set-operations
topicNumber: 126
title: 'SQL Subqueries, Correlated Queries & Set Operations (UNION)'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 38
sectionTitle: Relational Database Essentials & SQL
versionBadge: SQL Standard / MySQL 8+
difficulty: Intermediate
readingTime: 11 min read
shortDescription: >-
  Author nested subqueries (scalar, multi-row, correlated with EXISTS), derived
  tables, and combine result sets using UNION and UNION ALL.
prerequisites:
  - 'Topic 123: SQL DML & Basic Querying: INSERT, UPDATE, DELETE & SELECT'
  - 'Topic 125: SQL Aggregation & Grouping: COUNT, SUM, AVG, GROUP BY & HAVING'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 126: SQL Subqueries, Correlated Queries & Set Operations (UNION)

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

A **subquery** (or *nested query*) is a `SELECT` statement enclosed inside parentheses within another SQL statement. Subqueries allow you to express multi-step data retrieval in a single query—for instance, *"find all products priced above the overall catalog average"* or *"find all customers who ordered in the last 7 days"*.

**Set operations** (`UNION`, `UNION ALL`) combine rows from two or more independent `SELECT` queries into a single unified result table.

---

## 2. The Three Types of Subqueries

### 1. Scalar Subquery (Returns Exactly 1 Row, 1 Column)
Evaluates to a single primitive value. Can be used anywhere a literal constant is valid (such as in `WHERE`, `SELECT`, or `HAVING`):

```sql
-- Find all products priced higher than the average product price:
SELECT product_name, unit_price
FROM products
WHERE unit_price > (SELECT AVG(unit_price) FROM products);
```

---

### 2. Multi-Row Subquery (Returns 1 Column, Multiple Rows)
Evaluates to a list of values. Evaluated using list operators like `IN`, `NOT IN`, `ANY`, or `ALL`:

```sql
-- Find all customers who have placed an order exceeding $500:
SELECT first_name, email 
FROM customers 
WHERE id IN (
    SELECT customer_id 
    FROM orders 
    WHERE total_amount > 500.00
);
```

---

### 3. Correlated Subquery (Evaluated Row-by-Row)
A correlated subquery references columns from the **outer query**. The database engine executes the subquery once for every candidate row evaluated in the outer query:

```sql
-- Find products that are more expensive than the average product in THEIR SAME category:
SELECT p.product_name, p.category, p.unit_price
FROM products p
WHERE p.unit_price > (
    SELECT AVG(inner_p.unit_price)
    FROM products inner_p
    WHERE inner_p.category = p.category -- References outer query row!
);
```

### The `EXISTS` and `NOT EXISTS` Operators
`EXISTS` checks whether the inner subquery returns at least one row. As soon as a single match is found, evaluation short-circuits immediately without scanning the rest of the table:

```sql
-- Find customers who have at least one completed order:
SELECT c.first_name, c.email
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customer_id = c.id AND o.order_status = 'PAID'
);
```

> [!TIP] `EXISTS` vs `IN` Performance
> When checking existence against large tables, `EXISTS` is frequently faster than `IN` because the query optimizer can terminate table scans as soon as the first match is encountered. Additionally, `NOT EXISTS` handles `NULL` values safely, whereas `NOT IN` returns zero rows if the subquery returns even a single `NULL`.

---

## 3. Subqueries in the `FROM` Clause (Derived Tables)

You can treat the result of a subquery as a temporary virtual table in the `FROM` clause. *(In SQL, derived tables **must** be given an alias name):*

```sql
-- Calculate the average number of orders per customer:
SELECT AVG(order_counts.num_orders) AS avg_orders_per_user
FROM (
    SELECT customer_id, COUNT(*) AS num_orders
    FROM orders
    GROUP BY customer_id
) AS order_counts;
```

---

## 4. Set Operations: `UNION` vs `UNION ALL`

`UNION` vertically combines rows from two separate `SELECT` queries into a single output:

```sql
-- Combine domestic and international customer contact lists:
SELECT first_name, email, 'DOMESTIC' AS type FROM domestic_customers
UNION
SELECT first_name, email, 'INTERNATIONAL' AS type FROM international_customers;
```

### `UNION` vs `UNION ALL` Comparison

| Operation | Deduplication | Performance | When to Use |
| :--- | :--- | :--- | :--- |
| **`UNION`** | **Deduplicates** matching rows (executes hidden sort / hash filter). | Slower (incurs sorting overhead). | When duplicate rows across queries must be eliminated. |
| **`UNION ALL`** | **Preserves all rows**, including identical duplicates. | **Fast** (pure concatenation with zero sorting). | **Default choice** unless deduplication is explicitly required. |

### Strict Rules for Set Operations
1. Both `SELECT` queries must return the **exact same number of columns**.
2. Corresponding columns must have **compatible data types**.
3. Column names in the final output are determined by the **first `SELECT` query**.
