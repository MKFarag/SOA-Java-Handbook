---
id: topic-128
slug: sql-vs-nosql-architecture-tradeoffs
topicNumber: 128
title: 'SQL vs NoSQL: Architectural Trade-offs, ACID vs BASE & CAP Theorem'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 36
sectionTitle: Polyglot Persistence & NoSQL Systems
versionBadge: SQL / NoSQL Ecosystem
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Compare relational and non-relational database architectures: tabular models
  vs document stores, ACID vs BASE, and CAP theorem trade-offs in distributed
  systems.
prerequisites:
  - 'Topic 120: Relational Database Fundamentals: Tables, Columns, Rows & Keys'
  - 'Topic 127: Database Transactions, ACID Properties & Isolation Levels'
---
## Overview
Relational (SQL) and Non-Relational (NoSQL) databases represent fundamentally different architectural trade-offs between rigid schema ACID consistency and horizontally partitioned, document-oriented scalability.

---

## Paradigms: Tabular vs Document Model

```text
RELATIONAL (SQL) MODEL                                DOCUMENT (NoSQL) MODEL
Normalized across 3 Tables                            Self-Contained JSON Document

CUSTOMERS TABLE                                       ORDER DOCUMENT:
+----+--------------+                                 {
| id | name         |                                   "_id": "ORD-101",
+----+--------------+                                   "customer": { "name": "Alice", "email": "alice@..." },
|  1 | Alice        |                                   "order_date": "2026-11-21T10:00:00Z",
+----+--------------+                                   "items": [
        |                                                 { "sku": "KEY-01", "name": "Keyboard", "qty": 1, "price": 89.99 },
ORDERS TABLE                                              { "sku": "MOU-02", "name": "Mouse",    "qty": 2, "price": 29.50 }
+----+-------------+--------+                            ],
| id | customer_id | total  |                            "total": 148.99,
+----+-------------+--------+                            "status": "PAID"
| 10 | 1           | 148.99 |                          }
+----+-------------+--------+
        |
ORDER_ITEMS TABLE
+----+----------+--------+-----+
| id | order_id | sku    | qty |
+----+----------+--------+-----+
| 91 | 10       | KEY-01 | 1   |
| 92 | 10       | MOU-02 | 2   |
+----+----------+--------+-----+
```

| Dimension | Relational (SQL) | Document Store (NoSQL) |
| :--- | :--- | :--- |
| **Data Organization** | Normalized tables with rigid rows & columns. | Hierarchical, nested BSON/JSON documents. |
| **Schema** | **Strict Schema:** Schema defined upfront via DDL; columns are validated on write. | **Dynamic / Flexible Schema:** Documents within the same collection can contain different fields. |
| **Relationships** | Enforced via Foreign Keys and reconstructed with `JOIN`s. | Modeled via **Embedded Documents** or document references (no server-side joins). |
| **Scaling Strategy** | Traditionally **Vertical Scaling** (larger CPU, RAM, fast SSD arrays). | Native **Horizontal Scaling** (sharding across clusters of commodity servers). |

---

## ACID vs BASE Consistency Guarantees

Enterprise transactional systems historically demanded absolute immediate consistency (**ACID**), while globally distributed web platforms often adopted **BASE**:

### ACID (Strict Immediate Consistency)
- **Atomicity:** All statements succeed or none do.
- **Consistency:** Transactions transition the database from one valid state to another.
- **Isolation:** Concurrent transactions are isolated from each other.
- **Durability:** Committed transactions permanently survive crashes.

### BASE (Eventual Consistency)
- **Basically Available:** The distributed system guarantees availability by answering requests even in degraded states.
- **Soft State:** The state of the system may change over time without user interaction due to background replica synchronization.
- **Eventual Consistency:** Given enough time without new updates, all replica nodes will eventually converge to identical data.

> [!NOTE] The Modern Reality: NoSQL with ACID
> A common myth is that *"NoSQL databases can never do ACID transactions"*. In modern versions (such as MongoDB 4.0+), document stores support multi-document ACID transactions across replica sets and sharded clusters. The primary trade-off is architectural access modeling and horizontal data topology rather than the absence of transactional capability.

---

## The CAP Theorem in Practice

Formulated by Eric Brewer, the **CAP Theorem** states that any distributed data store can guarantee at most **two out of three properties** simultaneously:

```text
                              Consistency (C)
                                  /\
                                 /  \
                                /    \
                               /      \
               (CA: Traditional)       (CP: MongoDB, HBase)
                             /          \
                            /            \
                           /              \
              Availability (A)------------Partition Tolerance (P)
                              (AP: Cassandra, DynamoDB)
```

1. **Consistency (C):** Every client receives the most recent write or an error.
2. **Availability (A):** Every non-failing node returns a non-error response for every request (even if stale).
3. **Partition Tolerance (P):** The system continues to operate despite arbitrary network dropped messages or network partitions between nodes.

### The Realistic Engineering Dilemma:
In distributed networks, network latency drops, router faults, and physical cable breaks are unavoidable physical realities—meaning **Partition Tolerance (P) is a mandatory requirement**.

Therefore, when a network partition occurs, architects must choose:
- **CP (Consistency over Availability):** Reject requests or wait until network heals rather than returning stale data (e.g. MongoDB, Google Cloud Spanner).
- **AP (Availability over Consistency):** Accept writes and reads on all accessible partitions, resolving synchronization conflicts eventually (e.g. Cassandra, AWS DynamoDB).

---

## Architectural Decision Matrix: When to Choose Which

| Business Requirement | Recommended Paradigm | Technology Choices |
| :--- | :---: | :--- |
| Core Financial Ledgers, Accounting, Banking | **SQL** | PostgreSQL, MySQL, MariaDB |
| Complex relational data requiring rich multi-table `JOIN`s | **SQL** | PostgreSQL, MySQL |
| E-commerce product catalogs with polymorphic product attributes | **NoSQL (Document)** | MongoDB, Amazon DocumentDB |
| High-velocity IoT telemetry, sensor logs, user clickstreams | **NoSQL (Time-Series / Wide-Column)** | Cassandra, InfluxDB, MongoDB |
| Fast in-memory caching, user sessions, distributed rate-limiters | **NoSQL (Key-Value / Cache)** | Redis, Memcached |
| Social networks, fraud detection, recommendation knowledge graphs | **NoSQL (Graph)** | Neo4j, AWS Neptune |

---

## Pitfalls

- **Assuming Document Stores Never Support ACID Transactions:** Modern document engines (such as MongoDB 4.0+) provide distributed multi-document ACID transactions across replica sets and sharded clusters. Do not avoid document stores under the outdated assumption that they lack transactional integrity.
- **"Schemaless" Chaos in Production:** While NoSQL permits flexible fields, abandoning document schema governance leads to divergent field names (`phone` vs `phoneNumber`), missing attributes, and indexing nightmares. Always enforce schema validation rules at the application or database level.
- **The Entity-Attribute-Value (EAV) Anti-Pattern in SQL:** Attempting to force polymorphic dynamic attributes into relational tables with `(entity_id, attribute_name, attribute_value)` creates dozens of costly self-joins. Use modern SQL `JSON` data types or a dedicated document store.

---

## Practice

### Q: Under the CAP Theorem, why must an architect choose between Consistency (CP) and Availability (AP) whenever a network partition occurs?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** When network partitions physically sever communication between distributed nodes, updates written to one partition cannot be synchronized to nodes on the other partition. If the system continues accepting requests on both sides to remain Available (AP), reads on the isolated partition will serve stale, inconsistent data. If the system enforces strict Consistency (CP), it must reject requests on the isolated nodes until synchronization restores, sacrificing Availability.
</details>
