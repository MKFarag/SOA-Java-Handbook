---
id: topic-125
slug: sql-aggregation-and-grouping
topicNumber: 125
title: 'SQL Aggregation & Grouping: COUNT, SUM, AVG, GROUP BY & HAVING'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 38
sectionTitle: Relational Database Essentials & SQL
versionBadge: SQL Standard / MySQL 8+
difficulty: Intermediate
readingTime: 10 min read
shortDescription: >-
  Compute metrics across datasets using aggregate functions (COUNT, SUM, AVG,
  MIN, MAX) and segment data using GROUP BY and HAVING filters.
prerequisites:
  - 'Topic 123: SQL DML & Basic Querying: INSERT, UPDATE, DELETE & SELECT'
  - 'Topic 124: SQL Visual JOINs Reference: INNER, LEFT, RIGHT & FULL OUTER'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 125: SQL Aggregation & Grouping: COUNT, SUM, AVG, GROUP BY & HAVING

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

In backend reporting, dashboard analytics, and business calculations, you frequently need to calculate summary metrics across thousands of rows: total revenue, active user counts, average order values, and inventory levels. **Aggregate functions** collapse multiple rows into a single numerical metric, and **`GROUP BY`** partitions rows into categorical subsets before calculating those metrics.

---

## 2. Core SQL Aggregate Functions

| Function | Description | `NULL` Handling Behavior | Example Syntax |
| :--- | :--- | :--- | :--- |
| **`COUNT(*)`** | Total number of rows matching the query. | Includes rows even if all columns are `NULL`. | `SELECT COUNT(*) FROM orders;` |
| **`COUNT(col)`** | Number of rows where `col` is not null. | **Ignores `NULL` values**. | `SELECT COUNT(phone) FROM customers;` |
| **`COUNT(DISTINCT col)`** | Number of unique non-null values. | Deduplicates and ignores `NULL`. | `SELECT COUNT(DISTINCT status) FROM orders;` |
| **`SUM(col)`** | Arithmetic sum of numeric values. | Ignores `NULL`; returns `NULL` if 0 rows. | `SELECT SUM(total_amount) FROM orders;` |
| **`AVG(col)`** | Arithmetic average of numeric values. | Divides sum by count of non-null rows. | `SELECT AVG(unit_price) FROM products;` |
| **`MIN(col)`** | Minimum numeric, date, or text value. | Ignores `NULL`. | `SELECT MIN(order_date) FROM orders;` |
| **`MAX(col)`** | Maximum numeric, date, or text value. | Ignores `NULL`. | `SELECT MAX(total_amount) FROM orders;` |

---

## 3. Segmenting Data with `GROUP BY`

The `GROUP BY` clause groups rows sharing common values into summary rows:

```sql
-- Count total products and average price per category:
SELECT 
    category,
    COUNT(*) AS total_items,
    AVG(unit_price) AS avg_price,
    SUM(stock) AS total_inventory
FROM products
GROUP BY category;
```

```text
Result:
+-------------+-------------+-----------+-----------------+
| category    | total_items | avg_price | total_inventory |
+-------------+-------------+-----------+-----------------+
| Accessories |           2 |     59.74 |             170 |
| Furniture   |           1 |    220.00 |               0 |
| Monitors    |           1 |    349.00 |              15 |
+-------------+-------------+-----------+-----------------+
```

> [!IMPORTANT] The `GROUP BY` Golden Rule
> Any column present in the `SELECT` list that is **not wrapped inside an aggregate function** (`COUNT`, `SUM`, etc.) **MUST be included in the `GROUP BY` clause**.

---

## 4. Filtering Groups with `HAVING` (vs `WHERE`)

The most common point of confusion for beginners is the difference between `WHERE` and `HAVING`:

```text
Raw Rows from Table  ---> [WHERE Filter] ---> [GROUP BY Aggregation] ---> [HAVING Filter] ---> Final Result
```

### The Difference in Plain English

| Dimension | `WHERE` Clause | `HAVING` Clause |
| :--- | :--- | :--- |
| **When Applied** | **Before** grouping and aggregation occurs. | **After** grouping and aggregation occurs. |
| **Can filter aggregates?** | **No!** (`WHERE SUM(price) > 100` is illegal SQL). | **Yes!** (`HAVING SUM(price) > 100`). |
| **Filters What?** | Individual table rows. | Summary groups produced by `GROUP BY`. |

### Practical Example Combining Both
*"Find categories where the average price of active products exceeds $50.00":*

```sql
SELECT 
    category, 
    COUNT(*) AS product_count, 
    AVG(unit_price) AS average_price
FROM products
WHERE is_active = TRUE         -- 1. Filters individual raw rows first
GROUP BY category              -- 2. Groups remaining rows by category
HAVING AVG(unit_price) > 50.00 -- 3. Filters aggregated groups
ORDER BY average_price DESC;
```

---

## 5. Joining and Aggregating Together

A classic enterprise query calculating each customer's lifetime spending:

```sql
SELECT 
    c.id,
    c.first_name,
    c.last_name,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0.00) AS lifetime_spend
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name
HAVING lifetime_spend >= 100.00
ORDER BY lifetime_spend DESC;
```
*(Notice the use of `COALESCE(..., 0.00)` to convert `NULL` sums into `$0.00` for customers with zero orders.)*
