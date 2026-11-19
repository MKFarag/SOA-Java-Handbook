---
id: topic-82
slug: jdbc-connection-pooling-in-web-apps
topicNumber: 82
title: JDBC Connection Pooling in Web Applications
part: 'Part 2: Java EE & Jakarta EE'
sectionNumber: 22
sectionTitle: Production Web Development
versionBadge: Jakarta EE 10+ / JDBC 4.3
difficulty: Advanced
readingTime: 15 min read
shortDescription: >-
  Eliminate expensive TCP socket churn and optimize web throughput using managed
  JDBC connection pools, JNDI DataSources, and lifecycle listeners.
prerequisites:
  - 'Topic 61: JDBC Fundamentals'
  - 'Topic 72: Web Listeners & Application Lifecycle'
---
# Topic 82: JDBC Connection Pooling in Web Applications

## 1. What It Is and Why It Exists
Every standard JDBC `DriverManager.getConnection()` call incurs severe performance penalties:
1. Three-way TCP handshake over the network.
2. TLS cryptographic negotiation and certificate exchange.
3. Database server authentication, credential checks, and memory session allocation.

In high-concurrency web applications processing thousands of requests per second, establishing and tearing down a database connection per HTTP request overwhelms both the network and the database server, causing latency spikes and connection exhaustion.

A **Connection Pool** pre-allocates a fixed pool of active, authenticated database connections at application startup. When a Servlet needs database access, it checks out a live connection in microseconds, executes its queries, and returns it to the pool upon completion via `conn.close()`.

### Real-World Analogy
A city taxi depot:
Instead of buying a brand-new car from the factory every time a passenger steps onto the sidewalk and crushing it into scrap metal when the trip ends, a fleet of 20 taxis waits at the depot. When a passenger arrives, a driver departs immediately. When the ride finishes, the car returns to the depot ready for the next passenger.

### Why It Exists
Without pooling, opening 500 connections concurrently can take 10+ seconds and crash a database like PostgreSQL or Oracle. With connection pooling (Tomcat JDBC Pool, HikariCP), 500 requests reuse a tuned pool of 10-20 persistent connections with near-zero latency overhead.

---

## 2. Prerequisites
- **Topic 61: JDBC Fundamentals:** Working with `Connection`, `PreparedStatement`, and `ResultSet`.
- **Topic 72: Web Listeners:** Managing application startup and shutdown lifecycle via `ServletContextListener`.

---

## 3. Syntax Breakdown
```java
// Method 1: JNDI Managed DataSource (Tomcat context.xml)
Context initCtx = new InitialContext();
Context envCtx = (Context) initCtx.lookup("java:comp/env");
DataSource ds = (DataSource) envCtx.lookup("jdbc/AppDB");

try (Connection conn = ds.getConnection()) {
    // conn.close() DOES NOT terminate socket; it returns connection to pool!
    try (PreparedStatement ps = conn.prepareStatement("SELECT 1")) {
        ResultSet rs = ps.executeQuery();
    }
}
```

```xml
<!-- Tomcat context.xml Resource Definition -->
<Resource name="jdbc/AppDB"
          auth="Container"
          type="javax.sql.DataSource"
          factory="org.apache.tomcat.jdbc.pool.DataSourceFactory"
          initialSize="5"
          maxTotal="20"
          maxIdle="10"
          minIdle="5"
          maxWaitMillis="5000"
          url="jdbc:postgresql://localhost:5432/handbook"
          username="dbuser"
          password="secretpassword" />
```

### Key Elements Explained
- `javax.sql.DataSource`: The standard Java interface representing a factory for database connections. Unlike `DriverManager`, DataSources support pooling and distributed transactions.
- `initialSize`: The number of connections created immediately upon container startup.
- `maxTotal` (or `maximumPoolSize`): Upper bound of connections the pool will ever allocate.
- `maxWaitMillis` (or `connectionTimeout`): Maximum time a thread blocks waiting for an available connection before throwing an `SQLException`.
- `conn.close()`: Wrapped by a pool proxy so calling `.close()` returns the socket connection to the pool idle queue rather than terminating the TCP connection.

---

## 4. Runnable Examples

### Example 1: WebListener Pool Lifecycle & Health Check Servlet
```java
package com.handbook.web;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

@WebListener
public class ConnectionPoolLifecycleListener implements ServletContextListener {
    public static final String POOL_ATTR = "HANDBOOK_DB_POOL";
    private SimpleDataSourcePool pool;

    public static class SimpleDataSourcePool implements AutoCloseable {
        private final BlockingQueue<Connection> pool;
        public SimpleDataSourcePool(String jdbcUrl, int poolSize) throws SQLException {
            this.pool = new ArrayBlockingQueue<>(poolSize);
            for (int i = 0; i < poolSize; i++) {
                pool.offer(DriverManager.getConnection(jdbcUrl));
            }
        }
        public Connection getConnection(long timeoutMs) throws InterruptedException {
            return pool.poll(timeoutMs, TimeUnit.MILLISECONDS);
        }
        public void releaseConnection(Connection conn) {
            if (conn != null) pool.offer(conn);
        }
        public int getAvailableConnections() { return pool.size(); }
        @Override
        public void close() {
            for (Connection conn : pool) {
                try { if (conn != null && !conn.isClosed()) conn.close(); } catch (SQLException ignored) {}
            }
            pool.clear();
        }
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        try {
            Class.forName("org.sqlite.JDBC");
            pool = new SimpleDataSourcePool("jdbc:sqlite:file:pooltest?mode=memory&cache=shared", 5);
            ctx.setAttribute(POOL_ATTR, pool);
            System.out.println("[ConnectionPoolLifecycleListener] Initialized SQLite connection pool of size 5.");
        } catch (Exception e) {
            ctx.log("FATAL: Failed to initialize application DataSource pool", e);
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if (pool != null) {
            pool.close();
            System.out.println("[ConnectionPoolLifecycleListener] Closed all connections in pool.");
        }
    }
}
```

#### Health Check Servlet Consuming the Pool
```java
package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

@WebServlet(name = "DatabaseHealthCheckServlet", urlPatterns = {"/db-health"})
public class DatabaseHealthCheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        var pool = (ConnectionPoolLifecycleListener.SimpleDataSourcePool) 
            getServletContext().getAttribute(ConnectionPoolLifecycleListener.POOL_ATTR);

        if (pool == null) {
            resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            resp.getWriter().println("{\"status\": \"DOWN\"}");
            return;
        }

        Connection conn = null;
        try {
            conn = pool.getConnection(2000);
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT 1 AS probe")) {
                if (rs.next()) {
                    resp.setStatus(HttpServletResponse.SC_OK);
                    resp.getWriter().printf("{\"status\": \"UP\", \"probe\": %d, \"available\": %d}%n",
                        rs.getInt("probe"), pool.getAvailableConnections());
                }
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().printf("{\"status\": \"ERROR\", \"message\": \"%s\"}%n", e.getMessage());
        } finally {
            if (conn != null) pool.releaseConnection(conn);
        }
    }
}
```

#### Expected Output (HTTP GET /db-health)
```json
{"status": "UP", "probe": 1, "available": 4}
```

---

### Example 2: Realistic Concurrency and Leak Prevention Simulator
```java
package com.handbook.web;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class ConnectionPoolSimulatorDemo {
    public static class BoundedConnectionPool {
        private final BlockingQueue<Connection> pool;
        private final int capacity;

        public BoundedConnectionPool(String jdbcUrl, int capacity) throws Exception {
            this.capacity = capacity;
            this.pool = new ArrayBlockingQueue<>(capacity);
            for (int i = 0; i < capacity; i++) {
                pool.offer(DriverManager.getConnection(jdbcUrl));
            }
        }
        public Connection acquire(long timeoutMs) throws InterruptedException {
            return pool.poll(timeoutMs, TimeUnit.MILLISECONDS);
        }
        public void release(Connection conn) {
            if (conn != null) pool.offer(conn);
        }
        public int availableCount() { return pool.size(); }
        public void closeAll() throws Exception {
            for (Connection c : pool) {
                if (c != null && !c.isClosed()) c.close();
            }
            pool.clear();
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Web App Connection Pool Concurrency Simulator ===");
        Class.forName("org.sqlite.JDBC");
        String dbUri = "jdbc:sqlite:file:pooltest?mode=memory&cache=shared";
        BoundedConnectionPool pool = new BoundedConnectionPool(dbUri, 3);

        try (Connection setupConn = pool.acquire(1000)) {
            try (Statement st = setupConn.createStatement()) {
                st.execute("CREATE TABLE IF NOT EXISTS accounts (id INT PRIMARY KEY, balance REAL)");
                st.execute("INSERT OR REPLACE INTO accounts VALUES (1, 1000.0), (2, 2500.0), (3, 750.0)");
            }
            pool.release(setupConn);
        }

        System.out.println("Simulating 10 concurrent HTTP worker threads across 3 pool connections...");
        ExecutorService executor = Executors.newFixedThreadPool(10);
        AtomicInteger successCounter = new AtomicInteger(0);
        AtomicInteger timeoutCounter = new AtomicInteger(0);
        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            futures.add(executor.submit(() -> {
                try {
                    Connection conn = pool.acquire(500);
                    if (conn != null) {
                        try (Statement stmt = conn.createStatement();
                             ResultSet rs = stmt.executeQuery("SELECT count(*) AS total FROM accounts")) {
                            if (rs.next()) successCounter.incrementAndGet();
                        } finally {
                            pool.release(conn);
                        }
                    } else {
                        timeoutCounter.incrementAndGet();
                    }
                } catch (Exception ignored) {}
            }));
        }

        for (Future<?> f : futures) f.get();
        executor.shutdown();

        System.out.println("Completed queries: " + successCounter.get());
        System.out.println("Final available connections: " + pool.availableCount());

        assert pool.availableCount() == 3 : "Connection pool leak! Not all connections returned.";
        pool.closeAll();
        System.out.println("Connection pool simulation verified successfully: Zero leaks.");
    }
}
```

#### Expected Output
```text
=== Web App Connection Pool Concurrency Simulator ===
Simulating 10 concurrent HTTP worker threads across 3 pool connections...
Completed queries: 10
Final available connections: 3
Connection pool simulation verified successfully: Zero leaks.
```

---

## 5. Step-by-Step "What Happens When This Runs"
1. **Container Bootstrap:** During `contextInitialized()`, the pool instantiates `initialSize` active TCP connections to the database.
2. **HTTP Worker Request:** An incoming web request invokes a Servlet needing database operations.
3. **Lease Acquisition:** The Servlet calls `dataSource.getConnection()`. If an idle connection exists, it is marked active and returned in < 1 ms.
4. **Queue Blocking:** If all connections are active, the calling thread blocks waiting on a condition variable up to `connectionTimeout` (e.g. 5000 ms).
5. **Query Execution:** Business SQL statements execute across the acquired connection.
6. **Proxy Close / Release:** The Servlet exits its `try-with-resources` block, invoking `conn.close()`. The pool's wrapper proxy intercepts the close call, resets transaction auto-commit flags, and pushes the connection back onto the idle queue.
7. **Graceful Shutdown:** When the application undeploys, `contextDestroyed()` shuts down the pool, closing physical sockets cleanly.

---

## 6. Common Mistakes and Solutions

### Mistake 1: Connection Leaks from Missing `try-with-resources`
**Wrong Code:**
```java
Connection conn = dataSource.getConnection();
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM items");
// If an exception occurs above, conn.close() is never reached!
conn.close();
```
**Consequence:** In production, after 20-50 failed queries, the pool becomes 100% exhausted. All subsequent HTTP requests time out and crash the server.
**Solution:** Always wrap connections in `try-with-resources`:
```java
try (Connection conn = dataSource.getConnection();
     Statement stmt = conn.createStatement();
     ResultSet rs = stmt.executeQuery("SELECT * FROM items")) {
    // Process results
} // conn.close() guaranteed even on fatal exceptions
```

### Mistake 2: Sizing Pool Equal to Maximum HTTP Threads
**Cause:** Setting a pool size of 200 connections because Tomcat has 200 HTTP worker threads.
**Consequence:** Causes severe database CPU thrashing and disk I/O lock contention.
**Solution:** Follow the empirical rule: `pool_size = (core_count * 2) + effective_spindle_count`. For most web apps, a pool of 10 to 20 connections easily serves thousands of concurrent users.

---

## 7. Best Practices and When NOT to Use It

### Best Practices
- Use HikariCP or Tomcat JDBC Pool: Both offer high performance, lock-free concurrency, and leak detection.
- Enable `leakDetectionThreshold`: Detects and logs any connection held open longer than a set duration (e.g. 2000 ms).
- Set sensible `connectionTimeout` (e.g. 3000 ms): Failing fast with an error message is far better than hanging client browser requests indefinitely.

### When NOT to Use It
- Short-lived CLI scripts or unit tests that execute a single query and exit immediately.

---

## 8. Version Notes
- **JDBC 2.0 / 3.0:** Introduced standard `javax.sql.DataSource` and `ConnectionPoolDataSource`.
- **Jakarta EE 10 / Tomcat 10.1+:** Optimized virtual-thread friendly connection locking; supports HikariCP 5.x.
- **Status:** Mandatory production architecture pattern.

---

## 9. Summary Cheat Sheet
| Setting / Method | Meaning | Recommended Value |
|---|---|---|
| `maximumPoolSize` | Maximum physical database connections | 10–20 for typical workloads |
| `connectionTimeout` | Maximum wait time before `SQLException` | 3000 ms |
| `idleTimeout` | Max time an unused connection stays open | 600,000 ms (10 min) |
| `maxLifetime` | Max age of a physical TCP socket connection | 1,800,000 ms (30 min) |
| `conn.close()` | Returns connection to pool | Always use in `try-with-resources` |

---

## 10. Exercises with Solutions

### Exercise 1: Spot the Pool Leak
<details>
<summary>View Solution</summary>
**Question:** Explain what will happen to this servlet after 20 requests:
```java
@WebServlet("/users")
public class UserServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            Connection c = ds.getConnection();
            c.prepareStatement("SELECT * FROM users WHERE id = " + req.getParameter("id")).executeQuery();
        } catch (Exception e) {
            resp.getWriter().println("Error");
        }
    }
}
```
**Solution:** `Connection c` is never closed in a `finally` block or `try-with-resources`. Each request leaks one connection. If the pool size is 20, the 21st request and all subsequent requests will block until `connectionTimeout` expires and fail with a pool exhaustion error.
</details>

### Exercise 2: Hands-on Implementation
<details>
<summary>View Solution</summary>
**Question:** Write the safe idiom to obtain a connection from `DataSource ds`, execute an update, and ensure zero connection leaks.

**Solution:**
```java
try (Connection conn = ds.getConnection();
     PreparedStatement ps = conn.prepareStatement("UPDATE accounts SET balance = ? WHERE id = ?")) {
    ps.setDouble(1, newBalance);
    ps.setLong(2, accountId);
    ps.executeUpdate();
}
```
</details>

---

## 11. Sources
- [Jakarta EE DataSource Specification](https://jakarta.ee/specifications/data/)
- [Tomcat JDBC Connection Pool Documentation](https://tomcat.apache.org/tomcat-10.1-doc/jdbc-pool.html)
- [HikariCP Official Documentation & Pool Sizing Guide](https://github.com/brettwooldridge/HikariCP)
