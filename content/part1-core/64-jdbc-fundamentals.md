---
id: topic-64
slug: jdbc-fundamentals
topicNumber: 64
title: JDBC Fundamentals & Transactions
part: 'Part 1: Java Core'
sectionNumber: 16
sectionTitle: Data Access & Build Tools
versionBadge: Java 1.1+ / Standard java.sql
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: java.sql architecture (Connection, PreparedStatement, ResultSet), SQL injection mitigation via parameterized placeholders, transaction boundaries (setAutoCommit), and batch execution.
prerequisites:
  - 'Topic 19: Classes, Objects & Memory Layout'
  - 'Topic 34: Try-With-Resources & AutoCloseable'
---

## Overview
Java Database Connectivity (JDBC, `java.sql`) is Java's vendor-neutral API for communicating with relational databases (RDBMS). Through database drivers implementing standard interfaces (`Connection`, `PreparedStatement`, `ResultSet`), JDBC translates standard SQL queries and manages ACID transaction boundaries across network wire protocols.

---

## Core JDBC Architecture

```
                    JDBC Driver Architecture
 ┌─────────────────────────────────────────────────────────────┐
 │ Java Application Code (java.sql API interfaces)            │
 ├─────────────────────────────────────────────────────────────┤
 │ DriverManager / DataSource                                  │
 ├─────────────────────────────────────────────────────────────┤
 │ JDBC Driver (PostgreSQL / MySQL / Oracle JAR Driver)        │
 ├─────────────────────────────────────────────────────────────┤
 │ Database Engine (PostgreSQL / MySQL / SQLite Server)        │
 └─────────────────────────────────────────────────────────────┘
```

| Interface | Resource Type | Primary Responsibility |
| :--- | :--- | :--- |
| **`Connection`** | Socket / Session | Physical database session; manages transaction commit/rollback |
| **`PreparedStatement`**| Precompiled Query | Binds parameters (`?`), defends against SQL injection, executes queries |
| **`ResultSet`** | Forward Cursor | Reads tabular query results row-by-row via `.next()` |
| **`Statement`** | Raw Query (Avoid) | Executes uncompiled static SQL (vulnerable to SQL injection) |

---

## SQL Injection Defense: `PreparedStatement`

- **The Threat:** String concatenation (`"WHERE user = '" + input + "'"` ) allows attackers to inject malicious SQL fragments (e.g., `' OR '1'='1`).
- **The Defense:** `PreparedStatement` sends the SQL template to the database engine first for query plan compilation. Arguments are subsequently bound into positional placeholders (`?`) as pure binary literals, rendering code injection mathematically impossible:

```java
// SECURE: Database treats parameter strictly as literal data
String sql = "SELECT * FROM accounts WHERE owner = ? AND status = ?";
try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setString(1, ownerInput); // 1-based indexing!
    pstmt.setString(2, "ACTIVE");
    try (ResultSet rs = pstmt.executeQuery()) {
        while (rs.next()) {
            double balance = rs.getDouble("balance");
        }
    }
}
```

---

## Transaction Boundary Management

By default, JDBC operates in **auto-commit mode**, committing each individual SQL statement upon execution. To enforce multi-statement atomic transactions:

```java
try {
    conn.setAutoCommit(false); // Begin Transaction Boundary

    deductAccount(conn, fromId, 500.0);
    creditAccount(conn, toId, 500.0);

    conn.commit(); // Commit all operations atomically
} catch (SQLException e) {
    conn.rollback(); // Rollback all operations to original state
    throw e;
} finally {
    conn.setAutoCommit(true); // Restore default
}
```

---

## Implementation Example: Atomic Balance Transfer

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class JdbcTransactionDemo {
    public static void main(String[] args) throws SQLException {
        String dbUrl = "jdbc:sqlite::memory:"; // In-memory database

        try (Connection conn = DriverManager.getConnection(dbUrl)) {
            // Setup schema
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("CREATE TABLE ledger (id INT PRIMARY KEY, balance DOUBLE)");
                stmt.execute("INSERT INTO ledger VALUES (1, 1000.0), (2, 250.0)");
            }

            // Atomic transfer of 200.0 from Account 1 to Account 2
            conn.setAutoCommit(false);
            try (PreparedStatement deduct = conn.prepareStatement("UPDATE ledger SET balance = balance - ? WHERE id = ?");
                 PreparedStatement credit = conn.prepareStatement("UPDATE ledger SET balance = balance + ? WHERE id = ?")) {

                deduct.setDouble(1, 200.0);
                deduct.setInt(2, 1);
                deduct.executeUpdate();

                credit.setDouble(1, 200.0);
                credit.setInt(2, 2);
                credit.executeUpdate();

                conn.commit(); // Complete atomic transaction
                System.out.println("Transaction committed successfully.");
            } catch (SQLException e) {
                conn.rollback();
                System.err.println("Transaction aborted and rolled back: " + e.getMessage());
            } finally {
                conn.setAutoCommit(true);
            }

            // Verify final balances
            try (Statement query = conn.createStatement();
                 ResultSet rs = query.executeQuery("SELECT * FROM ledger ORDER BY id")) {
                while (rs.next()) {
                    System.out.printf("Account ID %d -> Balance: $%.2f%n", rs.getInt("id"), rs.getDouble("balance"));
                }
            }
        }
    }
}
```

### Execution Output:
```text
Transaction committed successfully.
Account ID 1 -> Balance: $800.00
Account ID 2 -> Balance: $450.00
```

---

## Pitfalls

- **1-Based Indexing Trap:** Unlike Java arrays and lists which are 0-indexed, JDBC parameters (`pstmt.setString(1, ...)`) and ResultSet columns (`rs.getString(1)`) are **1-indexed**. Passing index `0` triggers `SQLException: Parameter index out of range`.
- **Connection and Cursor Leaks:** Failing to close `ResultSet`, `PreparedStatement`, and `Connection` exhaust database connection pools. Always nest within `try-with-resources`.
- **Forgetting `rollback()` on Failure:** If `conn.setAutoCommit(false)` is active and an exception is caught without executing `conn.rollback()`, uncommitted row locks linger in the database, blocking other concurrent transactions.

---

## Practice

### Question
Why must `pstmt.setString(1, userInput)` be used instead of string concatenation `stmt.execute("... " + userInput)`?

### Explanation
1. String concatenation embeds user input directly into the SQL command text. If an attacker inputs `' OR '1'='1`, the database parser interprets the input as executable syntax, leading to SQL Injection.
2. `PreparedStatement` pre-compiles the query template with placeholders (`?`). The database engine treats parameter values strictly as literal values, never interpreting them as executable SQL commands.
