---
id: topic-123
slug: sql-dml-and-querying
topicNumber: 123
title: 'SQL DML & Basic Querying: INSERT, UPDATE, DELETE & SELECT'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 38
sectionTitle: Relational Database Essentials & SQL
versionBadge: SQL Standard / MySQL 8+
difficulty: Beginner
readingTime: 12 min read
shortDescription: >-
  Master core data manipulation: INSERT, UPDATE, DELETE, and author precise
  SELECT queries with WHERE filters, logical operators, LIKE, and LIMIT.
prerequisites:
  - 'Topic 122: SQL DDL: Schema Design, Table Creation & Constraints'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 123: SQL DML & Basic Querying: INSERT, UPDATE, DELETE & SELECT

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

**Data Manipulation Language (DML)** represents the operations developers perform daily to populate, read, modify, and delete rows in database tables.

```text
CRUD Operation | SQL Statement  | Role
---------------+----------------+----------------------------------------
Create         | INSERT INTO    | Adds new rows into a table
Read           | SELECT         | Queries and retrieves existing rows
Update         | UPDATE         | Modifies existing column values in rows
Delete         | DELETE FROM    | Removes specific rows from a table
```

---

## 2. Inserting Data (`INSERT INTO`)

### Single Row Insertion
```sql
INSERT INTO customers (first_name, last_name, email, status)
VALUES ('Sarah', 'Connor', 'sarah@resistance.org', 'ACTIVE');
```

### Multi-Row Batch Insertion
Inserting multiple rows in a single SQL statement is substantially faster than executing multiple single-row `INSERT` statements because it reduces network round-trips and transaction commits:

```sql
INSERT INTO products (sku, product_name, unit_price, stock, is_active) VALUES
    ('KEY-01', 'Mechanical Keyboard', 89.99, 50, TRUE),
    ('MOU-02', 'Wireless Mouse', 29.50, 120, TRUE),
    ('MON-03', '4K Gaming Monitor', 349.00, 15, TRUE),
    ('DES-04', 'Standing Desk Frame', 220.00, 0, FALSE);
```

---

## 3. Querying Data (`SELECT`)

The `SELECT` statement retrieves rows matching your criteria.

### Basic Syntax
```sql
SELECT product_name, unit_price FROM products;

-- Select all columns (Useful for ad-hoc inspection, avoid in production backend code):
SELECT * FROM customers;

-- Using column aliases (AS):
SELECT product_name AS item, unit_price AS price_usd FROM products;
```

---

## 4. Filtering Rows (`WHERE` Clause)

The `WHERE` clause filters rows before they are returned:

```sql
SELECT * FROM products WHERE unit_price > 50.00;
```

### Filtering Operators Quick Reference Table

| Operator | Syntax Example | Meaning |
| :--- | :--- | :--- |
| **`=`** / **`!=`** (or `<>`) | `WHERE status = 'ACTIVE'` | Exact match / Not equal |
| **`<`**, **`>`**, **`<=`**, **`>=`** | `WHERE unit_price >= 29.50` | Numerical and date comparisons |
| **`AND`** | `WHERE is_active = TRUE AND stock > 0` | Both conditions must be `TRUE` |
| **`OR`** | `WHERE status = 'PENDING' OR status = 'SUSPENDED'` | Either condition can be `TRUE` |
| **`BETWEEN`** | `WHERE unit_price BETWEEN 20.00 AND 100.00` | Inclusive range check |
| **`IN (...)`** | `WHERE sku IN ('KEY-01', 'MOU-02')` | Matches any value in the provided list |
| **`NOT IN (...)`** | `WHERE status NOT IN ('SUSPENDED', 'DELETED')` | Excludes values in the list |
| **`LIKE`** | `WHERE email LIKE '%@gmail.com'` | Pattern match (`%` = wildcard, `_` = single char) |
| **`IS NULL`** | `WHERE phone IS NULL` | Checks for database `NULL` value |
| **`IS NOT NULL`** | `WHERE phone IS NOT NULL` | Checks that value is present |

> [!WARNING] The `NULL` Comparison Trap
> In SQL, `NULL` represents an unknown value. Expressions like `WHERE phone = NULL` or `WHERE phone != NULL` will **never return any rows** because any equality comparison with `NULL` yields `UNKNOWN`. **Always use `IS NULL` or `IS NOT NULL`**.

---

## 5. Sorting and Pagination (`ORDER BY` & `LIMIT`)

### Sorting Results (`ORDER BY`)
Sort results using `ASC` (Ascending, default) or `DESC` (Descending):

```sql
-- Sort products by price from highest to lowest:
SELECT product_name, unit_price 
FROM products 
ORDER BY unit_price DESC;

-- Sort by status ascending, then by created date descending:
SELECT * FROM customers 
ORDER BY status ASC, created_at DESC;
```

### Paginating Results (`LIMIT` & `OFFSET`)
Web applications use `LIMIT` and `OFFSET` to display data in pages:

```sql
-- Retrieve the top 5 most expensive products:
SELECT product_name, unit_price 
FROM products 
ORDER BY unit_price DESC 
LIMIT 5;

-- Page 2: Skip the first 10 rows and take the next 10 rows:
SELECT * FROM customers 
ORDER BY id ASC 
LIMIT 10 OFFSET 10;
```

---

## 6. Updating Data (`UPDATE`)

Modifies existing column values for rows matching the `WHERE` condition:

```sql
UPDATE products 
SET stock = stock + 25, unit_price = 79.99 
WHERE sku = 'KEY-01';
```

> [!CAUTION] The Danger of Unrestricted `UPDATE`
> Omitting the `WHERE` clause in an `UPDATE` statement modifies **every single row across the entire table**! Always verify your `WHERE` condition with a `SELECT` statement before executing an `UPDATE`.

---

## 7. Deleting Data (`DELETE FROM`)

Removes rows matching the `WHERE` filter:

```sql
DELETE FROM products 
WHERE is_active = FALSE AND stock = 0;
```

> [!CAUTION] The Danger of Unrestricted `DELETE`
> Running `DELETE FROM products;` without a `WHERE` clause wipes every record from the table! In production applications, many teams prefer **Soft Deletes** (e.g. `UPDATE products SET is_deleted = TRUE WHERE id = 5;`) to preserve historical audit trails.
