---
id: topic-121
slug: sql-ddl-schema-management
topicNumber: 121
title: 'SQL DDL: Schema Design, Table Creation & Constraints'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 35
sectionTitle: Relational Database Essentials & SQL
versionBadge: SQL Standard / MySQL 8+
difficulty: Beginner
readingTime: 12 min read
shortDescription: >-
  Define and manage database schemas with DDL: CREATE, ALTER, DROP, and
  TRUNCATE. Master data types and constraints (PRIMARY KEY, FOREIGN KEY, CHECK,
  UNIQUE).
prerequisites:
  - 'Topic 120: Relational Database Fundamentals: Tables, Columns, Rows & Keys'
  - 'Topic 121: MySQL Setup & Environments: Local XAMPP, phpMyAdmin & Docker'
---
## Overview
Data Definition Language (DDL) encompasses SQL statements (CREATE, ALTER, DROP, TRUNCATE) that manage database schemas, tables, indexes, and column integrity constraints.

---

## SQL Data Types Quick Reference

| SQL Type | Java Equivalent | Recommended Use Case |
| :--- | :--- | :--- |
| **`INT`** | `int` / `Integer` | General counters, item quantities, status codes. |
| **`BIGINT`** | `long` / `Long` | Primary keys, foreign keys, large numeric IDs, epoch timestamps. |
| **`VARCHAR(n)`** | `String` | Variable-length text up to $n$ characters (e.g. `VARCHAR(255)` for names, emails). |
| **`TEXT`** | `String` | Unbounded multi-kilobyte text (blog posts, JSON payloads, descriptions). |
| **`DECIMAL(p, s)`** | `java.math.BigDecimal` | **Financial and currency values** ($p$ total digits, $s$ decimal places, e.g. `DECIMAL(10, 2)`). |
| **`BOOLEAN`** | `boolean` | Flags (`TRUE` / `FALSE`, stored internally as `TINYINT(1)` in MySQL). |
| **`DATETIME`** | `java.time.LocalDateTime` | Absolute date and time (`YYYY-MM-DD HH:MM:SS`) independent of timezone. |
| **`TIMESTAMP`** | `java.time.Instant` | UTC epoch timestamp automatically updated on row creation/modification. |
| **`ENUM('A','B')`**| `Enum` | Closed set of string choices (e.g. `status ENUM('PENDING', 'PAID', 'CANCELLED')`). |

> [!CAUTION] Never Use `FLOAT` or `DOUBLE` for Money
> Binary floating-point data types (`FLOAT`, `DOUBLE`) suffer from binary representation rounding errors (e.g. `0.1 + 0.2 = 0.30000000000000004`). Always use `DECIMAL(12, 2)` for currency calculations.

---

## Constraints Reference

Constraints enforce business rules and data integrity directly at the database engine level:

| Constraint | Syntax Example | Rule Enforced |
| :--- | :--- | :--- |
| **`PRIMARY KEY`** | `id BIGINT AUTO_INCREMENT PRIMARY KEY` | Must be unique and non-null; creates a clustered B-Tree index. |
| **`NOT NULL`** | `first_name VARCHAR(50) NOT NULL` | Rejects row insertion if column value is missing or null. |
| **`UNIQUE`** | `email VARCHAR(191) NOT NULL UNIQUE` | Rejects duplicate values across the table; creates an index. |
| **`DEFAULT`** | `status VARCHAR(20) DEFAULT 'ACTIVE'` | Automatically fills this value if omitted in an `INSERT` statement. |
| **`CHECK`** | `CHECK (unit_price >= 0.00)` | Rejects row if the boolean predicate evaluates to `FALSE`. |
| **`FOREIGN KEY`** | `FOREIGN KEY (customer_id) REFERENCES customers(id)` | Enforces that value must match an existing row in parent table. |

### Foreign Key Referential Actions (`ON DELETE`)

When a parent row is deleted, what happens to child rows?
- **`ON DELETE RESTRICT` (Default / Safest):** Rejects parent deletion if child rows exist (e.g., cannot delete a customer who has existing orders).
- **`ON DELETE CASCADE`:** Automatically deletes all child rows when the parent row is deleted (e.g., deleting an order automatically deletes its order items).
- **`ON DELETE SET NULL`:** Sets child foreign key column to `NULL` (requires column to be nullable).

---

## Complete Runnable Schema Script

Here is a clean, realistic e-commerce schema you can execute directly in phpMyAdmin or the MySQL CLI:

```sql
-- 1. Customers Table (Independent Entity)
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    status ENUM('ACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Products Table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(64) NOT NULL UNIQUE,
    product_name VARCHAR(150) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0.00),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Orders Table (Child of Customers)
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(32) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Order Items Table (Junction Table between Orders and Products)
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_order_product UNIQUE (order_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Altering Existing Tables (`ALTER TABLE`)

In production, you often need to adjust existing schemas without losing data:

```sql
-- Add a new column:
ALTER TABLE customers ADD COLUMN phone VARCHAR(30) NULL AFTER email;

-- Modify a column's data type:
ALTER TABLE customers MODIFY COLUMN phone VARCHAR(50) NULL;

-- Rename a column:
ALTER TABLE products RENAME COLUMN stock TO stock_quantity;

-- Drop an obsolete column:
ALTER TABLE customers DROP COLUMN phone;
```
