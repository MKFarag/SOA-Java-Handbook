---
id: topic-127
slug: database-indexes-and-query-tuning
topicNumber: 127
title: 'Database Indexes & Query Optimization: B-Trees, Composite Indexes & EXPLAIN'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 35
sectionTitle: Relational Database Essentials & SQL
versionBadge: MySQL 8+ / InnoDB
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Accelerate SQL query performance: understand B-Tree indexes, clustered vs
  secondary indexes, composite indexes (leftmost prefix rule), and EXPLAIN
  plans.
prerequisites:
  - 'Topic 122: SQL DDL: Schema Design, Table Creation & Constraints'
  - 'Topic 123: SQL DML & Basic Querying: INSERT, UPDATE, DELETE & SELECT'
---
## Overview
Database indexes optimize query execution using B-Tree and Hash data structures, analyzed and tuned using the EXPLAIN execution plan to eliminate costly full-table scans.

---

## Clustered vs Secondary Indexes (InnoDB)

In MySQL's InnoDB engine, there are two distinct types of indexes:

```text
               CLUSTERED INDEX                           SECONDARY INDEX
         (Organized by Primary Key)                   (e.g., Index on 'email')

                 [ Root Node ]                             [ Root Node ]
                /             \                           /             \
          [ Branch ]       [ Branch ]               [ Branch ]       [ Branch ]
          /        \       /        \               /        \       /        \
       [Leaf]    [Leaf] [Leaf]    [Leaf]         [Leaf]    [Leaf] [Leaf]    [Leaf]
         |         |      |         |              |         |      |         |
      +--------------------------------+        +--------------------------------+
      | Physical Table Rows Stored     |        | Stores Indexed Column + PK ID  |
      | Directly in Clustered Leaves!  |        | ("alice@..." -> PK: 1)         |
      +--------------------------------+        +--------------------------------+
                                                                 |
                                              (Secondary lookup jumps to Clustered Index!)
```

| Dimension | Clustered Index | Secondary Index |
| :--- | :--- | :--- |
| **How many per table?** | **Exactly 1** (The Primary Key). | **Multiple** (as many as needed). |
| **Leaf Node Content** | Holds the **entire row data** (all columns). | Holds only the indexed column + the **Primary Key value**. |
| **Lookup Cost** | 1 traversal ($O(\log N)$). | 2 traversals (finds PK, then visits clustered index unless covering). |

---

## Creating & Managing Indexes

```sql
-- 1. Create a single-column secondary index:
CREATE INDEX idx_customers_email ON customers(email);

-- 2. Create a Composite Index (Multi-column):
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- 3. View all indexes on a table:
SHOW INDEX FROM orders;

-- 4. Remove an unneeded index:
DROP INDEX idx_customers_email ON customers;
```

---

## Composite Indexes & The Leftmost Prefix Rule

A **Composite Index** indexes multiple columns together (e.g. `INDEX (tenant_id, status, created_at)`).

### The Leftmost Prefix Rule
The database query optimizer can use a composite index **only if your query filters by columns starting from the leftmost column in the index definition**:

| Query `WHERE` Clause | Can Use Index `(A, B, C)`? | Reason |
| :--- | :---: | :--- |
| `WHERE A = 1` | **Yes** | Uses leftmost column `A`. |
| `WHERE A = 1 AND B = 2` | **Yes** | Uses leftmost prefix `(A, B)`. |
| `WHERE A = 1 AND B = 2 AND C = 3` | **Yes** | Uses full composite index. |
| `WHERE B = 2` | **NO!** | Missed leftmost column `A`; triggers full table scan! |
| `WHERE C = 3` | **NO!** | Missed leftmost column `A`. |
| `WHERE A = 1 AND C = 3` | **Partially** | Uses index for `A`, then filters `C` in memory. |

---

## Analyzing Queries with `EXPLAIN`

To see whether MySQL uses your index or performs a slow table scan, prefix your query with **`EXPLAIN`**:

```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
```

```text
+----+-------------+--------+-------+--------------------------+--------------------------+---------+-------+------+-------------+
| id | select_type | table  | type  | possible_keys            | key                      | key_len | ref   | rows | Extra       |
+----+-------------+--------+-------+--------------------------+--------------------------+---------+-------+------+-------------+
|  1 | SIMPLE      | orders | ref   | idx_orders_customer_date | idx_orders_customer_date | 8       | const |    4 | Using index |
+----+-------------+--------+-------+--------------------------+--------------------------+---------+-------+------+-------------+
```

### Critical Fields to Inspect in `EXPLAIN`:

1. **`type` (Access Method — From Best to Worst):**
   - **`const` / `eq_ref` (Fastest):** Direct Primary Key or Unique Index lookup.
   - **`ref`:** Non-unique index lookup (matches a few rows).
   - **`range`:** Index range scan (`BETWEEN`, `<`, `>`, `IN`).
   - **`index`:** Scans the entire index tree from start to finish.
   - **`ALL` (WORST - Full Table Scan):** Scans every physical data block on disk! **Avoid on tables with > 1,000 rows.**

2. **`key`:** Shows the exact index MySQL chose to use (or `NULL` if none).
3. **`rows`:** An estimate of how many rows MySQL must inspect to fulfill the query.

---

## Indexing Best Practices & Anti-Patterns

### Best Practices (DO):
- **Index Foreign Key Columns:** MySQL does not automatically index foreign keys; always index FK columns to accelerate `JOIN`s and prevent parent-table locking.
- **Index Columns in `WHERE`, `ORDER BY`, and `GROUP BY`:** Especially for high-cardinality columns (many unique values, like emails or UUIDs).
- **Use Covering Indexes:** If an index contains all columns requested in the `SELECT` list (`SELECT customer_id, order_date ...`), InnoDB retrieves results entirely from the index tree without touching the table data pages (**Using index**).

### Anti-Patterns (DON'T):
- **Don't Over-Index:** Every index consumes disk space and **slows down write operations** (`INSERT`, `UPDATE`, `DELETE`) because every index tree must be updated and rebalanced on each write!
- **Don't Index Low-Cardinality Columns:** Creating an index on a boolean column (`is_active: TRUE / FALSE`) is useless; the optimizer will choose a full table scan anyway because half the table matches.
- **Avoid Wrapping Indexed Columns in Functions in `WHERE` Clauses:**
  ```sql
  -- PREVENTS INDEX USAGE (Full Table Scan!):
  WHERE YEAR(order_date) = 2026;

  -- USES INDEX RANGE SCAN (FAST!):
  WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01';
  ```

---

## Pitfalls

- **Wrapping Indexed Columns in Functions in `WHERE` Clauses:** Writing `WHERE YEAR(created_at) = 2026` or `WHERE UPPER(email) = 'ALICE@EXAMPLE.COM'` prevents B-Tree index traversal, triggering a slow full table scan. Filter raw ranges instead: `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`.
- **Violating the Leftmost Prefix Rule:** A composite index on `(tenant_id, status, created_at)` is completely ignored if the query only filters `WHERE status = 'ACTIVE'`. The query predicate must include the leading column (`tenant_id`).
- **Leading Wildcards in `LIKE` (`LIKE '%keyword'`):** Standard B-Tree indexes sort strings lexicographically from left to right. Placing a `%` wildcard at the beginning prevents index seeks and causes full table scans. Use specialized Full-Text indexes for arbitrary substring searching.

---

## Practice

### Q: Why does querying `SELECT * FROM orders WHERE DATE(order_date) = '2026-11-22';` perform a full table scan even though `order_date` is indexed?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** When a function like `DATE()` wraps an indexed column in a `WHERE` clause, the database cannot calculate the index tree lookup key directly; it must compute the function for every row in the table, resulting in a full table scan (`ALL`). To utilize the index with an index range scan (`range`), write an unmanipulated range filter: `WHERE order_date >= '2026-11-22 00:00:00' AND order_date < '2026-11-23 00:00:00'`.
</details>
