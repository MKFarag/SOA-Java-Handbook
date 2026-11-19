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
        private final String jdbcUrl;
        private final int poolSize;

        public SimpleDataSourcePool(String jdbcUrl, int poolSize) throws SQLException {
            this.jdbcUrl = jdbcUrl;
            this.poolSize = poolSize;
            this.pool = new ArrayBlockingQueue<>(poolSize);
            for (int i = 0; i < poolSize; i++) {
                pool.offer(DriverManager.getConnection(jdbcUrl));
            }
        }

        public Connection getConnection(long timeoutMs) throws InterruptedException {
            return pool.poll(timeoutMs, TimeUnit.MILLISECONDS);
        }

        public void releaseConnection(Connection conn) {
            if (conn != null) {
                pool.offer(conn);
            }
        }

        public int getAvailableConnections() {
            return pool.size();
        }

        @Override
        public void close() {
            for (Connection conn : pool) {
                try {
                    if (conn != null && !conn.isClosed()) conn.close();
                } catch (SQLException ignored) {}
            }
            pool.clear();
        }
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        try {
            Class.forName("org.sqlite.JDBC");
            pool = new SimpleDataSourcePool("jdbc:sqlite::memory:", 5);
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
