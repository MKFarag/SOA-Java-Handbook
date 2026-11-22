---
id: topic-126
slug: database-transactions-and-acid
topicNumber: 126
title: 'Database Transactions, ACID Properties & Isolation Levels'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 35
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
---
## Overview
Database transactions group multiple SQL operations into an atomic unit of work satisfying ACID properties (Atomicity, Consistency, Isolation, Durability) across four standardized isolation levels.

---

## The ACID Principles in Plain English

| Property | Plain English Definition | How the Database Implements It |
| :--- | :--- | :--- |
| **Atomicity** | **"All or Nothing."** Either every SQL statement in the transaction commits successfully, or every change is rolled back. No partial writes exist. | **Undo Log:** Records original pre-mutation values to revert changes if `ROLLBACK` is triggered. |
| **Consistency** | **"Valid State Transitions."** A transaction can only transition the database from one valid state to another, strictly satisfying all constraints (FK, PK, CHECK). | Engine constraint checks reject invalid inserts or updates before committing. |
| **Isolation** | **"Hidden Intermediate Work."** Concurrent transactions executing simultaneously cannot view or interfere with each other's uncommitted intermediate modifications. | Row-level locks, table locks, and **MVCC (Multi-Version Concurrency Control)**. |
| **Durability** | **"Survives Power Outages."** Once a transaction is committed, its modifications are permanently recorded on non-volatile disk, surviving crashes and power loss. | **Write-Ahead Log (WAL / Redo Log):** Flushes committed transactions to disk sequentially before disk page writes. |

---

## Transaction Control Commands in SQL

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

## Concurrency Anomalies & Isolation Levels

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
-- View current transaction isolation level (defaults to REPEATABLE READ in MySQL InnoDB):
SELECT @@transaction_isolation;

-- Set isolation level for the current session:
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

> [!NOTE] MySQL Default vs Other Engines
> Unlike PostgreSQL, Oracle, and SQL Server (which default to `READ COMMITTED`), **MySQL InnoDB defaults to `REPEATABLE READ`**. It prevents phantom reads in standard consistent non-locking reads via MVCC read views, and in locking reads via next-key locks.

> [!TIP]
> In 99% of production backend services, **`READ COMMITTED`** or **`REPEATABLE READ`** provides the ideal balance between absolute data consistency and high-throughput concurrency. `SERIALIZABLE` introduces severe lock contention and deadlocks under heavy load.

---

## Pitfalls

- **Holding Transactions Open Across Remote Network Calls:** Keeping a transaction active while awaiting responses from external HTTP services (e.g. payment gateways) holds database locks and ties up connection pool slots for seconds, rapidly causing connection pool exhaustion. Always perform network calls outside transactional boundaries.
- **Uncoordinated Lock Acquisition Ordering (Deadlocks):** If Transaction 1 updates Account A then Account B, while Transaction 2 updates Account B then Account A simultaneously, the two transactions lock each other out, triggering a database deadlock. Always update resources in consistent, sorted order (e.g. `ORDER BY id`).
- **Missing `ROLLBACK` in Error Handlers:** Failing to call `ROLLBACK` inside `catch` blocks when an error occurs leaves transactions dangling in uncommitted states, holding table and row locks indefinitely.

---

## Practice

### Q: Why should third-party REST API calls never be executed inside a database `@Transactional` boundary?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Active database transactions hold exclusive row locks and occupy physical connections from the connection pool (such as HikariCP). Remote HTTP calls are vulnerable to latency spikes, network timeouts, and downstream throttling (taking seconds instead of milliseconds). Keeping database connections locked during network I/O starves the connection pool and halts all other concurrent database transactions.
</details>
