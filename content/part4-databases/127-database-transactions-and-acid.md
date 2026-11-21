---
id: topic-127
slug: database-transactions-and-acid
topicNumber: 127
title: 'Database Transactions, ACID Properties & Isolation Levels'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 38
sectionTitle: Relational Database Essentials & SQL
versionBadge: SQL Standard / InnoDB Engine
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master transaction control (COMMIT, ROLLBACK), understand ACID guarantees, and
  compare transaction isolation levels to prevent concurrency anomalies.
prerequisites:
  - 'Topic 122: SQL DDL: Schema Design, Table Creation & Constraints'
  - 'Topic 123: SQL DML & Basic Querying: INSERT, UPDATE, DELETE & SELECT'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 127: Database Transactions, ACID Properties & Isolation Levels

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

A **database transaction** is a logical unit of work consisting of one or more SQL statements executed as an indivisible unit. In enterprise systems—particularly banking, e-commerce checkouts, and inventory booking—a business operation cannot simply execute partially. If step 1 succeeds but step 2 fails, the database must roll back cleanly to its original pristine state.

---

## 2. The ACID Principles in Plain English

| Property | Plain English Definition | How the Database Implements It |
| :--- | :--- | :--- |
| **Atomicity** | **"All or Nothing."** Either every SQL statement in the transaction commits successfully, or every change is rolled back. No partial writes exist. | **Undo Log:** Records original pre-mutation values to revert changes if `ROLLBACK` is triggered. |
| **Consistency** | **"Valid State Transitions."** A transaction can only transition the database from one valid state to another, strictly satisfying all constraints (FK, PK, CHECK). | Engine constraint checks reject invalid inserts or updates before committing. |
| **Isolation** | **"Hidden Intermediate Work."** Concurrent transactions executing simultaneously cannot view or interfere with each other's uncommitted intermediate modifications. | Row-level locks, table locks, and **MVCC (Multi-Version Concurrency Control)**. |
| **Durability** | **"Survives Power Outages."** Once a transaction is committed, its modifications are permanently recorded on non-volatile disk, surviving crashes and power loss. | **Write-Ahead Log (WAL / Redo Log):** Flushes committed transactions to disk sequentially before disk page writes. |

---

## 3. Transaction Control Commands in SQL

```sql
-- 1. Begin explicit transaction boundary:
START TRANSACTION;

-- 2. Execute business modifications:
UPDATE accounts SET balance = balance - 100.00 WHERE account_id = 'ACC-01';
UPDATE accounts SET balance = balance + 100.00 WHERE account_id = 'ACC-02';

-- 3. Confirm modifications permanently:
COMMIT;

-- Or if an error occurs (e.g. insufficient balance), revert changes:
-- ROLLBACK;
```

---

## 4. Concurrency Anomalies & Isolation Levels

When thousands of users execute transactions simultaneously against the same tables, concurrency race conditions can occur:

### The Three Classic Concurrency Anomalies
1. **Dirty Read:** Transaction A reads data modified by Transaction B that has **not yet been committed**. If Transaction B subsequently rolls back, Transaction A acted on ghost data that never legally existed!
2. **Non-Repeatable Read:** Transaction A reads a row. Transaction B mutates that row and commits. Transaction A re-reads the row and finds the values have changed mid-transaction.
3. **Phantom Read:** Transaction A queries a range of rows (`WHERE price > 50`). Transaction B inserts a new row matching that range and commits. Transaction A re-executes the range query and discovers a new "phantom" row.

---

### The 4 Standard SQL Isolation Levels

| Isolation Level | Dirty Read Prevented? | Non-Repeatable Read Prevented? | Phantom Read Prevented? | Performance Overhead |
| :--- | :---: | :---: | :---: | :--- |
| **`READ UNCOMMITTED`** | No | No | No | Lowest (Almost never used) |
| **`READ COMMITTED`** *(Default in PostgreSQL/Oracle)* | **Yes** | No | No | Low (High concurrency) |
| **`REPEATABLE READ`** *(Default in MySQL InnoDB)* | **Yes** | **Yes** | **Yes** *(via InnoDB MVCC & Next-Key Locks)* | Medium (Safe enterprise default) |
| **`SERIALIZABLE`** | **Yes** | **Yes** | **Yes** | Highest (Strict sequential ordering) |

### Setting Isolation Levels in MySQL
```sql
-- View current transaction isolation level:
SELECT @@transaction_isolation;

-- Set isolation level for the current session:
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

> [!TIP]
> In 99% of production backend services, **`READ COMMITTED`** or **`REPEATABLE READ`** provides the ideal balance between absolute data consistency and high-throughput concurrency. `SERIALIZABLE` introduces severe lock contention and deadlocks under heavy load.
