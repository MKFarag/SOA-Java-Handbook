---
id: topic-81
slug: jdbc-connection-pooling-in-web-apps
topicNumber: 81
title: JDBC Connection Pooling & JNDI in Web Containers
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Enterprise Web Applications & Data Flow
versionBadge: JDBC 4.3 / HikariCP 5.1
difficulty: Intermediate
readingTime: 8 min read
shortDescription: >-
  Reference: Database connection pooling architecture (HikariCP, Tomcat JDBC
  Pool), JNDI DataSource resource registration, and connection leak mitigation.
prerequisites:
  - 'Topic 64: JDBC Fundamentals & Transactions'
  - 'Topic 75: Web Listeners & Application Lifecycle Events'
---

## Overview
Opening physical database connections involves costly TCP handshakes, TLS negotiation, and authentication exchanges. Connection pooling maintains a pool of pre-allocated, reusable `java.sql.Connection` instances. In Jakarta EE, pools are configured either as container resources looked up via Java Naming and Directory Interface (JNDI) or programmatically initialized using high-performance connection poolers like HikariCP.

---

## Connection Pooling Architecture

```
Web App Worker Threads                    HikariCP Connection Pool             Database Server
        │                                            │                                │
        │── 1. dataSource.getConnection() ──────────>│                                │
        │                                            │ Allocates idle physical conn   │
        │<── 2. Returns Connection Proxy (Wrapped) ──│ (Pre-authenticated socket)     │
        │                                            │                                │
        │── 3. Executes SQL queries ─────────────────────────────────────────────────>│
        │                                            │                                │
        │── 4. conn.close() (Invoked on Proxy) ─────>│                                │
        │                                            │ Resets connection state &      │
        │                                            │ returns to idle pool           │
```

---

## Critical Connection Pool Configuration Parameters

| Parameter (HikariCP) | Default | Recommended Value | Engineering Rationale |
| :--- | :--- | :--- | :--- |
| **`maximumPoolSize`** | 10 | $2 \times \text{CPU cores} + \text{disk spindles}$ | Prevents context-switching contention on database server |
| **`minimumIdle`** | Same as max | Same as `maximumPoolSize` | Fixed-size pool avoids connection creation latency spikes |
| **`connectionTimeout`**| 30,000 ms | 10,000 – 15,000 ms | Time thread waits for connection before throwing `SQLException` |
| **`idleTimeout`** | 600,000 ms| 300,000 ms | Time an idle connection can sit before being retired |
| **`maxLifetime`** | 1,800,000 ms| 1,200,000 ms (20 min) | Shorter than database-side wait_timeout to prevent broken sockets |

---

## Production Implementation: HikariCP DataSource Factory

```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;

public class DatabaseManager {

    private static final HikariDataSource dataSource;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost:5432/appdb");
        config.setUsername("db_user");
        config.setPassword("secure_password");
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(20);
        config.setConnectionTimeout(10000);
        config.setMaxLifetime(1200000);
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");

        dataSource = new HikariDataSource(config);
    }

    public static DataSource getDataSource() {
        return dataSource;
    }

    public static void executeQuery() throws SQLException {
        String sql = "SELECT id, username FROM users WHERE active = ?";

        // Try-with-resources closes connection proxy, returning it to pool
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setBoolean(1, true);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    System.out.println("User: " + rs.getString("username"));
                }
            }
        }
    }
}
```

---

## Common Pitfalls & Production Traps

- **Connection Leaks (Failure to Close):**
  Failing to close a connection in a `finally` block or `try-with-resources` prevents the connection from returning to the pool. When all connections in `maximumPoolSize` are leaked, every subsequent request blocks until `connectionTimeout` expires, bringing down the entire application.
- **Setting `maximumPoolSize` Too High:**
  Setting pool sizes to 200+ under high concurrency overloads the database engine's CPU and disk I/O, degrading query throughput. A pool size of 20–30 connections frequently outperforms a pool size of 200 due to reduced CPU context switching.
- **`maxLifetime` Exceeding Database Timeout:**
  If the database engine (e.g., MySQL `wait_timeout`) terminates idle sockets before Hikari's `maxLifetime`, the pool hands dead sockets to application threads, throwing `CommunicationsException: Communications link failure`. Always configure `maxLifetime` a few minutes shorter than the DB timeout.

---

## Verification & Practice

**Question:** When an application calls `connection.close()` on a connection obtained from a `HikariDataSource`, does it terminate the physical TCP socket connection to the database?

**Explanation:** No. `HikariDataSource.getConnection()` returns a wrapper proxy (`HikariProxyConnection`). Calling `.close()` on the proxy intercepts the call, rolls back any uncommitted transactions, resets connection flags, and returns the underlying physical connection to the idle pool ready for the next thread.

---

## Practice

### Q: Why is creating a new database connection via `DriverManager.getConnection()` on every HTTP request disastrous for production web applications?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** Establishing a physical database connection requires TCP handshakes, TLS negotiation, authentication verification, and server process memory allocation, taking 50 to 300 milliseconds. Under concurrent traffic, thousands of concurrent requests creating raw connections overwhelm database socket limits and crash the server. Connection pools (like HikariCP) pre-allocate a fixed pool of persistent connections that are borrowed and returned in microseconds ($O(1)$).
</details>
