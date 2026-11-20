---
id: topic-131
slug: mysql-fundamentals-queries-xampp
topicNumber: 131
title: >-
  Relational Databases & MySQL Mastery (XAMPP Setup, DDL, DML, Joins & Query
  Tuning)
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 38
sectionTitle: Database Fundamentals & Relational Systems (MySQL & SQL)
versionBadge: MySQL 8.x / MariaDB / XAMPP
difficulty: Intermediate
readingTime: 25 min read
shortDescription: >-
  Set up local MySQL environments using XAMPP and phpMyAdmin or Docker, master
  DDL, DML, and DQL query operations, design relational schemas with foreign
  keys, execute multi-table JOINs, and optimize execution plans with indexes.
prerequisites:
  - >-
    Topic 130: SQL vs NoSQL: Paradigms, ACID vs BASE, and Architectural
    Trade-Offs
relevanceLevel: MUST-KNOW / CORE
---
# Topic 131: Relational Databases & MySQL Mastery (XAMPP Setup, DDL, DML, Joins & Query Tuning)

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

**MySQL** is the most widely deployed open-source relational database management system in the world. From high-throughput web applications like WordPress, GitHub, and Shopify to enterprise banking architectures, MySQL delivers robust ACID-compliant transactions, structured storage, and proven reliability. To build production-grade Java applications, every software engineer must master physical database setup, schema design, relational query authoring, and index-driven execution optimization.

---

## 1. What It Is and Why It Exists

A Relational Database Management System (RDBMS) is a software engine designed to store, manage, and query data organized in tables conforming to relational algebra. MySQL implements:
1. **The Pluggable Storage Engine Architecture:** Separating SQL parsing and query optimization from physical disk storage. The default production engine is **InnoDB**, which provides full ACID compliance, row-level locking, foreign key constraints, and crash recovery.
2. **Structured Query Language (SQL):** An ANSI/ISO standard declarative language allowing developers to instruct the engine *what* data to retrieve or mutate, leaving the database query planner to determine *how* to execute it physically.

### Real-World Analogy
Think of MySQL as an **International Maritime Shipping Port**:
- The **SQL Query Optimizer** is the harbor master: when a ship arrives asking for specific cargo, the harbor master determines the fastest route through the docks.
- The **InnoDB Storage Engine** is the automated crane and container yard: it guarantees that every shipping container (data row) is locked into an exact numbered slot, logged in the master manifest (Write-Ahead Log), and protected against crane failures or power outages.
- **XAMPP / phpMyAdmin** is the visual control tower touchscreen: giving operators an immediate overview of all docks, ships, and manifests without forcing them to manually wire physical control cables.

---

## 2. Prerequisites
Before exploring MySQL queries, ensure you understand:
- [Topic 130: SQL vs NoSQL Architecture](file:///c:/Users/modym\OneDrive\Desktop\Java-Doc\content\part4-databases\130-sql-vs-nosql-architecture-tradeoffs.md) — Relational models, normalization, and ACID guarantees.
- [Topic 61: JDBC Fundamentals](file:///c:/Users/modym\OneDrive\Desktop\Java-Doc\content\part1-core\61-jdbc-fundamentals.md) — The role of database drivers and connection strings.

---

## 3. Environment Setup: Local MySQL with XAMPP & phpMyAdmin

For development and learning, setting up a relational database must be seamless, visual, and fast. **XAMPP** is the premier local development package, bundling Apache, MySQL (MariaDB), and the web-based **phpMyAdmin** database management console.

### 3.1 Step-by-Step XAMPP Setup (Windows & macOS)

```
+-----------------------------------------------------------------------------------------+
|                               XAMPP CONTROL PANEL WORKFLOW                              |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|    1. Download & Install XAMPP from apachefriends.org                                   |
|    2. Launch "XAMPP Control Panel" (Run as Administrator)                               |
|    3. Click [Start] next to "Apache"  -> Port 80, 443                                   |
|    4. Click [Start] next to "MySQL"   -> Port 3306                                      |
|    5. Open Browser: Navigate to  http://localhost/phpmyadmin                            |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

1. **Download & Install:**
   - Download XAMPP for Windows/macOS from the official Apache Friends website.
   - Run the installer. In the component selection window, ensure **MySQL** and **phpMyAdmin** are checked.
2. **Start Database Services:**
   - Open the **XAMPP Control Panel**.
   - Click the **Start** button next to **MySQL** (and **Apache**, which serves phpMyAdmin).
   - Once both labels turn green, MySQL is listening on TCP port `3306`.
3. **Accessing phpMyAdmin:**
   - Open any web browser and navigate to `http://localhost/phpmyadmin` (or click the **Admin** button next to MySQL in the control panel).
   - You will see the visual phpMyAdmin dashboard showing available databases, user accounts, and server status.

> [!NOTE]
> **Default XAMPP Credentials for Java Development:**
> - **Host:** `localhost` (or `127.0.0.1`)
> - **Port:** `3306`
> - **Default Username:** `root`
> - **Default Password:** `""` (Empty string, no password)
> - **Default Administrative Database:** `mysql` / `information_schema`

### 3.2 Creating a Database in phpMyAdmin
1. Click **New** in the left sidebar navigation.
2. Enter Database name: `enterprise_shop`.
3. Select Collation: `utf8mb4_unicode_ci` (supports full Unicode, international alphabets, and emojis).
4. Click **Create**.
5. Alternatively, click the **SQL** tab at the top and execute:
   ```sql
   CREATE DATABASE IF NOT EXISTS enterprise_shop 
   CHARACTER SET utf8mb4 
   COLLATE utf8mb4_unicode_ci;
   ```

### 3.3 Modern Production Alternative: Docker Container
For developers who prefer isolated container runtimes without installing desktop software:

```bash
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=enterprise_shop \
  -p 3306:3306 \
  -d mysql:8.4
```

---

## 4. SQL Mastery: DDL (Data Definition Language)

DDL commands define and modify the physical structure of database tables, constraints, and relationships.

### 4.1 Production Table Design & Constraints

```sql
USE enterprise_shop;

-- Drop existing tables to ensure idempotent script execution
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- 1. Customers Table (Independent Entity)
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    phone VARCHAR(30) NULL,
    status ENUM('ACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0.00),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Orders Table (Dependent on Customers)
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(32) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    order_status ENUM('PLACED', 'PAID', 'SHIPPED', 'CANCELLED') DEFAULT 'PLACED',
    CONSTRAINT fk_orders_customer 
        FOREIGN KEY (customer_id) REFERENCES customers(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Order Items Table (Junction Entity linking Orders and Products)
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    CONSTRAINT fk_items_order 
        FOREIGN KEY (order_id) REFERENCES orders(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_items_product 
        FOREIGN KEY (product_id) REFERENCES products(id) 
        ON DELETE RESTRICT,
    CONSTRAINT uq_order_product UNIQUE (order_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 4.2 Key Constraint Mechanics
- **`PRIMARY KEY`:** Uniquely identifies each record. Automatically creates a clustered B-Tree index in InnoDB.
- **`FOREIGN KEY ... ON DELETE CASCADE`:** If an `order` is deleted, all child `order_items` are automatically deleted by the database engine.
- **`FOREIGN KEY ... ON DELETE RESTRICT`:** Prevents deleting a `customer` if that customer has existing records in `orders`.
- **`DECIMAL(10, 2)` vs `FLOAT`:** Always use `DECIMAL` for currency or monetary values. `FLOAT` and `DOUBLE` use binary floating-point representation (IEEE 754), resulting in rounding inaccuracies (e.g., `0.1 + 0.2 = 0.30000000000000004`).

---

## 5. SQL Mastery: DML (Data Manipulation Language)

DML commands manipulate the data within the tables (`INSERT`, `UPDATE`, `DELETE`).

### 5.1 Inserting Data (Single & Bulk Batch)
```sql
-- Batch insert customers
INSERT INTO customers (first_name, last_name, email, phone, status) VALUES
('Elena', 'Vance', 'elena.vance@enterprise.com', '+1-555-0199', 'ACTIVE'),
('Marcus', 'Brody', 'marcus.brody@museum.org', '+1-555-0244', 'ACTIVE'),
('Sophia', 'Al-Mansoor', 'sophia.m@fintech.ae', NULL, 'ACTIVE'),
('David', 'Kim', 'david.kim@seoul.kr', '+82-10-5555', 'SUSPENDED');

-- Batch insert products
INSERT INTO products (sku, product_name, category, unit_price, stock_quantity) VALUES
('LAPTOP-X1', 'ThinkPad Carbon X1 Gen 12', 'Electronics', 1899.99, 25),
('MONITOR-4K', 'Dell UltraSharp 32 4K USB-C', 'Electronics', 649.50, 40),
('CHAIR-ERG', 'Herman Miller Aeron Ergonomic', 'Furniture', 1295.00, 15),
('CABLE-TB4', 'Thunderbolt 4 Cable 2m Pro', 'Accessories', 39.99, 120),
('KB-MECH', 'Keychron Q1 Pro Wireless Mechanical', 'Accessories', 199.00, 50);

-- Insert an Order and its line items
INSERT INTO orders (order_number, customer_id, order_date, total_amount, order_status)
VALUES ('ORD-2026-1001', 1, '2026-11-20 14:30:00', 2549.49, 'PAID');

-- Insert line items for order #1 (ThinkPad + Dell Monitor)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1899.99),
(1, 2, 1, 649.50);
```

### 5.2 Updating Data Safely
```sql
-- Increase prices by 5% for all Electronics products
UPDATE products 
SET unit_price = ROUND(unit_price * 1.05, 2)
WHERE category = 'Electronics';

-- Deduct stock safely with bounds check
UPDATE products 
SET stock_quantity = stock_quantity - 1 
WHERE id = 1 AND stock_quantity >= 1;
```

> [!WARNING]
> **The Unconditional Update/Delete Hazard:**  
> Never execute an `UPDATE` or `DELETE` statement without a `WHERE` clause unless you intend to modify or wipe every single row in the table:
> ```sql
> -- DISASTROUS: Sets every customer's status to SUSPENDED!
> UPDATE customers SET status = 'SUSPENDED';
> ```
> In MySQL Workbench and phpMyAdmin, enable **Safe Updates Mode** (`SQL_SAFE_UPDATES = 1`), which rejects any update or delete missing a key-indexed filter.

---

## 6. SQL Mastery: DQL (Data Query Language) & Filtering

DQL (`SELECT`) extracts information from tables using filters, projections, and sorting.

### 6.1 Advanced Filtering (`WHERE`, `LIKE`, `IN`, `BETWEEN`)
```sql
-- Find active accessories costing between $20.00 and $200.00
SELECT id, sku, product_name, unit_price 
FROM products 
WHERE category = 'Accessories' 
  AND unit_price BETWEEN 20.00 AND 200.00 
  AND is_active = TRUE;

-- Case-insensitive pattern matching with LIKE wildcards (% = multiple chars, _ = single char)
SELECT first_name, last_name, email 
FROM customers 
WHERE email LIKE '%@enterprise.com';

-- Filter by list of values
SELECT order_number, total_amount, order_status 
FROM orders 
WHERE order_status IN ('PLACED', 'PAID');
```

### 6.2 Sorting and Paging (`ORDER BY`, `LIMIT`, `OFFSET`)
In production web APIs, queries must never return millions of records at once. Paging partitions result sets into manageable chunks:

```sql
-- Retrieve Page 2 of products (assuming page size of 2 items)
-- Formula: LIMIT <page_size> OFFSET <(page_number - 1) * page_size>
SELECT id, product_name, unit_price 
FROM products 
ORDER BY unit_price DESC 
LIMIT 2 OFFSET 2;
```

### 6.3 Aggregations and Grouping (`GROUP BY`, `HAVING`)
Aggregation functions calculate summary statistics across rows:

```sql
-- Calculate inventory metrics grouped by category
SELECT 
    category,
    COUNT(*) AS total_skus,
    SUM(stock_quantity) AS total_inventory_units,
    AVG(unit_price) AS average_price,
    MAX(unit_price) AS most_expensive_item
FROM products
WHERE is_active = TRUE
GROUP BY category
HAVING total_skus >= 2
ORDER BY total_inventory_units DESC;
```

> [!IMPORTANT]
> **The Difference Between `WHERE` and `HAVING`:**
> - `WHERE` filters individual rows **before** any aggregation calculations occur.
> - `HAVING` filters group-level metrics **after** the aggregation has completed.

---

## 7. Relational JOINs Deep Dive

The superpower of relational databases is the ability to reconstruct complex domain graphs through mathematical set joins.

```
       INNER JOIN                   LEFT JOIN                  RIGHT JOIN
     +-----+-----+                +-----+-----+               +-----+-----+
    /       \     \              /       \     \             /       \     \
   |   A     | B   |            |   A     | B   |           |   A     | B   |
   |      (###)    |            | (###) (###)   |           |    (###) (###)|
    \       /     /              \       /     /             \       /     /
     +-----+-----+                +-----+-----+               +-----+-----+
    Only matching rows         All Left + matching Right   All Right + matching Left
```

### 7.1 INNER JOIN (The Intersection)
Returns only rows where a matching key exists in **both** tables.

```sql
-- Get all orders along with the customer's full name and email
SELECT 
    o.order_number,
    o.order_date,
    o.total_amount,
    c.first_name,
    c.last_name,
    c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;
```

### 7.2 LEFT JOIN (Left Outer Join)
Returns **all** rows from the left table, plus matched rows from the right table. If no match exists, columns from the right table contain `NULL`.

```sql
-- Find ALL customers, including those who have NEVER placed an order
SELECT 
    c.id,
    c.email,
    c.first_name,
    o.order_number,
    o.total_amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- Anti-Join Pattern: Find only customers who have placed ZERO orders
SELECT c.id, c.email, c.first_name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
```

### 7.3 Multi-Table Relational JOIN (Assembling the Full Invoice)
```sql
SELECT 
    o.order_number,
    c.email AS customer_email,
    p.product_name,
    oi.quantity,
    oi.unit_price,
    oi.subtotal
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.order_number = 'ORD-2026-1001';
```

---

## 8. Query Performance Tuning & B-Tree Indexes

Without indexes, MySQL must inspect every single row stored on physical disk to satisfy a query—a disastrous bottleneck known as a **Full Table Scan (`ALL`)**.

```
                           B-Tree Root Node
                             [ 50 | 100 ]
                            /     |      \
              +------------+      |       +------------+
              |                   |                    |
       [ 10 | 30 ]           [ 60 | 80 ]         [ 120 | 150 ]
       /    |    \           /    |    \         /     |     \
     Leaf Nodes (Contain primary keys or direct pointers to disk rows)
```

### 8.1 Creating Secondary Indexes
```sql
-- Create an index on product category to accelerate filtering
CREATE INDEX idx_products_category ON products(category);

-- Create a composite (multi-column) index for customer name lookups
CREATE INDEX idx_customers_name ON customers(last_name, first_name);
```

### 8.2 The Leftmost Prefix Rule for Composite Indexes
An index on `(last_name, first_name)` can accelerate:
- Searches by `last_name` AND `first_name`.
- Searches by `last_name` alone.
- **IT CANNOT** accelerate searches by `first_name` alone, because the B-Tree is ordered primarily by `last_name`.

### 8.3 Analyzing Execution Plans with `EXPLAIN`
Prepend `EXPLAIN` to any `SELECT` query to inspect MySQL's internal execution strategy:

```sql
EXPLAIN SELECT * FROM products WHERE category = 'Electronics';
```

**Interpretation of Key `EXPLAIN` Columns:**
| Column | Value | Interpretation |
| :--- | :--- | :--- |
| `type` | `const` / `eq_ref` | **Best:** Single row lookup via primary key or unique index. |
| `type` | `ref` / `range` | **Good:** B-Tree index range scan or non-unique index match. |
| `type` | `ALL` | **Danger:** Full Table Scan! Disk reads through every row in the table. |
| `possible_keys` | `idx_products_category` | Indexes available to the optimizer. |
| `key` | `idx_products_category` | Index actually selected by the optimizer. |
| `rows` | `3` | Estimated number of rows inspected. |
| `Extra` | `Using where; Using index` | **Covering Index:** Satisfied entirely from RAM index tree without touching table rows. |

---

## 9. Common Pitfalls & Anti-Patterns

### 1. Wrapping Indexed Columns in Functions in `WHERE` Clauses
**Anti-Pattern:**
```sql
-- MySQL CANNOT use the index on created_at!
SELECT * FROM orders WHERE YEAR(order_date) = 2026;
```
**Optimized Correction:**
```sql
-- Enables index range scan (type: range)
SELECT * FROM orders 
WHERE order_date >= '2026-01-01 00:00:00' 
  AND order_date < '2027-01-01 00:00:00';
```

### 2. Using `SELECT *` in Production Microservices
**Anti-Pattern:** `SELECT * FROM orders o JOIN order_items oi ...`  
**Impact:** Fetches unused columns (e.g., text descriptions, audit logs), increases JVM memory consumption, and prevents MySQL from using efficient covering indexes.

### 3. Missing Foreign Key Indexes
While InnoDB automatically generates indexes for foreign key columns, composite or junction tables without explicit foreign key indexing can result in full table locking during child row updates or deletes.

---

## 10. Hands-on Practice Exercises

### Exercise 1: Spot the Bug (Index Invalidation via Function Wrapper)
An engineer creates an index:
```sql
CREATE INDEX idx_orders_date ON orders(order_date);
```
However, running `EXPLAIN SELECT * FROM orders WHERE DATE(order_date) = '2026-11-20';` reports `type: ALL` (Full Table Scan). Why?

<details>
<summary>View Solution</summary>

Wrapping the indexed column in a function (`DATE(order_date)`) prevents MySQL from navigating the B-Tree index, forcing an expensive full table scan.

**The Fix:**
Rewrite the query into an index range scan:
```sql
WHERE order_date >= '2026-11-20 00:00:00' AND order_date <= '2026-11-20 23:59:59';
```
</details>

### Exercise 2: Hands-on Implementation (Anti-Join Customer Query)
Write a SQL query using a `LEFT JOIN` to find all customers who have NEVER placed an order.

<details>
<summary>View Solution</summary>

```sql
SELECT c.id, c.first_name, c.last_name, c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
```
</details>

### Exercise 3: Real-World Edge Case (Safe Updates and Implicit Commits)
Why can't DDL statements like `ALTER TABLE` or `TRUNCATE TABLE` be rolled back in MySQL transactions?

<details>
<summary>View Solution</summary>

In MySQL, executing any DDL statement causes an implicit `COMMIT` of the active transaction. InnoDB automatically flushes transaction logs and updates metadata catalogs immediately, preventing rollback.
</details>

---

## 11. Verified Sources & Further Reading
- [MySQL 8.4 Reference Manual: The InnoDB Storage Engine](https://dev.mysql.com/doc/refman/8.4/en/innodb-storage-engine.html)
- [MySQL Optimization: Understanding the EXPLAIN Plan](https://dev.mysql.com/doc/refman/8.4/en/execution-plan-information.html)
- [Apache Friends XAMPP Official Documentation & phpMyAdmin](https://www.apachefriends.org/)
- Baron Schwartz, Peter Zaitsev — *High Performance MySQL (4th Edition)*.
