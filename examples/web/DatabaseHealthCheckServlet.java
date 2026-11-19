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

        ConnectionPoolLifecycleListener.SimpleDataSourcePool pool = 
            (ConnectionPoolLifecycleListener.SimpleDataSourcePool) getServletContext().getAttribute(ConnectionPoolLifecycleListener.POOL_ATTR);

        if (pool == null) {
            resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            resp.getWriter().println("{\"status\": \"DOWN\", \"error\": \"Connection pool not initialized\"}");
            return;
        }

        Connection conn = null;
        try {
            conn = pool.getConnection(2000);
            if (conn == null) {
                resp.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
                resp.getWriter().println("{\"status\": \"DEGRADED\", \"error\": \"Connection pool exhausted (timeout)\"}");
                return;
            }

            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT 1 AS probe")) {
                if (rs.next()) {
                    int val = rs.getInt("probe");
                    resp.setStatus(HttpServletResponse.SC_OK);
                    resp.getWriter().printf("{\"status\": \"UP\", \"probe\": %d, \"available\": %d}%n",
                        val, pool.getAvailableConnections());
                }
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().printf("{\"status\": \"ERROR\", \"message\": \"%s\"}%n", e.getMessage());
        } finally {
            if (conn != null) {
                pool.releaseConnection(conn);
            }
        }
    }
}
