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
            if (conn != null) {
                pool.offer(conn);
            }
        }

        public int availableCount() {
            return pool.size();
        }

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
        // Using shared in-memory URI so multiple connections share the schema
        String dbUri = "jdbc:sqlite:file:pooltest?mode=memory&cache=shared";
        BoundedConnectionPool pool = new BoundedConnectionPool(dbUri, 3);

        // Populate table
        try (Connection setupConn = pool.acquire(1000)) {
            try (Statement st = setupConn.createStatement()) {
                st.execute("CREATE TABLE accounts (id INT PRIMARY KEY, balance REAL)");
                st.execute("INSERT INTO accounts VALUES (1, 1000.0), (2, 2500.0), (3, 750.0)");
            }
            pool.release(setupConn);
        }

        System.out.println("Initialized pool with 3 connections. Simulating 10 concurrent HTTP worker threads...");
        ExecutorService executor = Executors.newFixedThreadPool(10);
        AtomicInteger successCounter = new AtomicInteger(0);
        AtomicInteger timeoutCounter = new AtomicInteger(0);
        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            final int requestId = i + 1;
            futures.add(executor.submit(() -> {
                try {
                    Connection conn = pool.acquire(500); // 500ms max wait
                    if (conn != null) {
                        try (Statement stmt = conn.createStatement();
                             ResultSet rs = stmt.executeQuery("SELECT count(*) AS total FROM accounts")) {
                            if (rs.next()) {
                                int total = rs.getInt("total");
                                successCounter.incrementAndGet();
                            }
                        } finally {
                            pool.release(conn);
                        }
                    } else {
                        timeoutCounter.incrementAndGet();
                    }
                } catch (Exception e) {
                    System.err.println("Request #" + requestId + " error: " + e.getMessage());
                }
            }));
        }

        for (Future<?> f : futures) {
            f.get();
        }
        executor.shutdown();

        System.out.println("Total requests processed: 10");
        System.out.println("  - Completed queries: " + successCounter.get());
        System.out.println("  - Timed out requests: " + timeoutCounter.get());
        System.out.println("  - Final available connections: " + pool.availableCount());

        assert pool.availableCount() == 3 : "Connection pool leak detected! All connections must be returned.";
        assert successCounter.get() + timeoutCounter.get() == 10;

        pool.closeAll();
        System.out.println("Connection pool simulation verified successfully: Zero leaks.");
    }
}
