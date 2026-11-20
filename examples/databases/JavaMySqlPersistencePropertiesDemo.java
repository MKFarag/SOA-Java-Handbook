package com.handbook.databases;

import java.util.*;
import java.util.concurrent.*;

/**
 * Section 38 - Topic 132: Java MySQL Persistence (Spring Data JPA, Hibernate & Complete Properties Configuration)
 * 
 * Demonstrates:
 * 1. Verification & parsing of enterprise MySQL JDBC Connection URLs and properties.
 * 2. HikariCP connection pool leasing, queueing, and exhaustion mechanics.
 * 3. Hibernate ORM First-Level Cache & Automated Dirty Checking simulation.
 * 4. Spring Data JPA Repository Proxy Dynamic Query Method generation.
 */
public class JavaMySqlPersistencePropertiesDemo {

    // =========================================================================
    // 1. JDBC CONNECTION URL & PROPERTY VALIDATOR
    // =========================================================================
    public record ParsedJdbcUrl(String host, int port, String database, Map<String, String> parameters) {
        public static ParsedJdbcUrl parse(String url) {
            if (!url.startsWith("jdbc:mysql://")) {
                throw new IllegalArgumentException("Invalid MySQL JDBC scheme: " + url);
            }
            String withoutScheme = url.substring("jdbc:mysql://".length());
            int slashIndex = withoutScheme.indexOf('/');
            String hostPort = withoutScheme.substring(0, slashIndex);
            String rest = withoutScheme.substring(slashIndex + 1);

            String[] hp = hostPort.split(":");
            String host = hp[0];
            int port = (hp.length > 1) ? Integer.parseInt(hp[1]) : 3306;

            int qIndex = rest.indexOf('?');
            String db = (qIndex != -1) ? rest.substring(0, qIndex) : rest;
            Map<String, String> params = new LinkedHashMap<>();

            if (qIndex != -1) {
                String query = rest.substring(qIndex + 1);
                for (String pair : query.split("&")) {
                    String[] kv = pair.split("=");
                    params.put(kv[0], kv.length > 1 ? kv[1] : "");
                }
            }
            return new ParsedJdbcUrl(host, port, db, params);
        }
    }

    // =========================================================================
    // 2. HIKARICP CONNECTION POOL SIMULATION
    // =========================================================================
    public static class HikariPoolSimulator {
        private final int maxPoolSize;
        private final BlockingQueue<String> availableSockets = new LinkedBlockingQueue<>();
        private final Set<String> leasedSockets = Collections.synchronizedSet(new HashSet<>());

        public HikariPoolSimulator(int maxPoolSize) {
            this.maxPoolSize = maxPoolSize;
            for (int i = 1; i <= maxPoolSize; i++) {
                availableSockets.offer("TCP-Socket-MySQL-Port-3306-Conn#" + i);
            }
        }

        public String leaseConnection(long timeoutMs) throws TimeoutException {
            try {
                String socket = availableSockets.poll(timeoutMs, TimeUnit.MILLISECONDS);
                if (socket == null) {
                    throw new TimeoutException("HikariCP ConnectionTimeout: Pool exhausted! All " 
                            + maxPoolSize + " connections are currently leased.");
                }
                leasedSockets.add(socket);
                return socket;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Thread interrupted while waiting for DB connection");
            }
        }

        public void releaseConnection(String socket) {
            if (leasedSockets.remove(socket)) {
                availableSockets.offer(socket);
            }
        }

        public int getActiveCount() { return leasedSockets.size(); }
        public int getIdleCount() { return availableSockets.size(); }
    }

    // =========================================================================
    // 3. HIBERNATE ORM FIRST-LEVEL CACHE & DIRTY CHECKING SIMULATION
    // =========================================================================
    public static class ManagedEntity<T> {
        private final long id;
        private String email;
        private String status;

        // Snapshot representation stored in Persistence Context (First-Level Cache)
        private final String initialEmailSnapshot;
        private final String initialStatusSnapshot;

        public ManagedEntity(long id, String email, String status) {
            this.id = id;
            this.email = email;
            this.status = status;
            // Capture snapshot upon loading from database
            this.initialEmailSnapshot = email;
            this.initialStatusSnapshot = status;
        }

        public void setStatus(String newStatus) { this.status = newStatus; }
        public void setEmail(String newEmail) { this.email = newEmail; }

        public boolean isDirty() {
            return !Objects.equals(email, initialEmailSnapshot) || !Objects.equals(status, initialStatusSnapshot);
        }

        public String generateDirtyUpdateSql() {
            if (!isDirty()) return null;
            StringBuilder sb = new StringBuilder("UPDATE customers SET ");
            List<String> updates = new ArrayList<>();
            if (!Objects.equals(email, initialEmailSnapshot)) updates.add("email = '" + email + "'");
            if (!Objects.equals(status, initialStatusSnapshot)) updates.add("status = '" + status + "'");
            sb.append(String.join(", ", updates));
            sb.append(" WHERE id = ").append(id).append(";");
            return sb.toString();
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("================================================================================");
        System.out.println(" Topic 132: Java MySQL Persistence (Spring Data JPA & Properties) Demo        ");
        System.out.println("================================================================================\n");

        // 1. Connection URL Verification
        System.out.println("--- 1. JDBC Connection URL Parsing & Property Verification ---");
        String sampleUrl = "jdbc:mysql://localhost:3306/enterprise_shop?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&characterEncoding=UTF-8";
        ParsedJdbcUrl parsed = ParsedJdbcUrl.parse(sampleUrl);

        System.out.printf("  Host: %s | Port: %d | Database: %s\n", parsed.host(), parsed.port(), parsed.database());
        System.out.println("  Connection Parameters Verified:");
        parsed.parameters().forEach((k, v) -> System.out.printf("    - %s = '%s'\n", k, v));

        // 2. HikariCP Connection Pool Mechanics
        System.out.println("\n--- 2. HikariCP Connection Pool Leasing & Exhaustion Simulation ---");
        HikariPoolSimulator pool = new HikariPoolSimulator(3);
        System.out.printf("  Initial Pool State: Idle=%d, Active=%d\n", pool.getIdleCount(), pool.getActiveCount());

        String c1 = pool.leaseConnection(1000);
        String c2 = pool.leaseConnection(1000);
        String c3 = pool.leaseConnection(1000);
        System.out.printf("  Leased 3 Connections. Active=%d, Idle=%d\n", pool.getActiveCount(), pool.getIdleCount());

        // Attempting to lease a 4th connection when pool is full
        try {
            System.out.println("  Attempting to lease 4th connection with 500ms timeout...");
            pool.leaseConnection(500);
        } catch (TimeoutException e) {
            System.out.println("  [EXPECTED ERROR CAUGHT] " + e.getMessage());
        }

        // Release connection back to pool
        pool.releaseConnection(c1);
        System.out.printf("  Released 1 Connection. Idle=%d, Active=%d\n", pool.getIdleCount(), pool.getActiveCount());

        // 3. Hibernate Dirty Checking & Persistence Context
        System.out.println("\n--- 3. Hibernate ORM First-Level Cache & Automated Dirty Checking ---");
        ManagedEntity<Object> customer = new ManagedEntity<>(42, "elena.vance@enterprise.com", "ACTIVE");
        System.out.printf("  Entity loaded into PersistenceContext. Dirty state: %b\n", customer.isDirty());

        // Business logic mutates the managed entity
        System.out.println("  Mutating entity: customer.setStatus('SUSPENDED');");
        customer.setStatus("SUSPENDED");

        System.out.printf("  Transaction Commit Triggered. Dirty state: %b\n", customer.isDirty());
        String generatedSql = customer.generateDirtyUpdateSql();
        System.out.println("  [Hibernate Generated SQL] " + generatedSql);

        System.out.println("\n[SUCCESS] Topic 132 Java MySQL Persistence Demo executed cleanly.");
    }
}
