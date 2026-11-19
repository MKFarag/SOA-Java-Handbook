package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;

@WebServlet(name = "OrderProcessingServlet", urlPatterns = {"/api/orders"})
public class OrderProcessingServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        // 1. Validate request content type
        String contentType = req.getContentType();
        if (contentType == null || !contentType.contains("application/json")) {
            resp.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, "Expected application/json");
            return;
        }

        // 2. Read request body stream via getReader()
        StringBuilder jsonBody = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line.trim());
            }
        }

        if (jsonBody.isEmpty()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Payload cannot be empty");
            return;
        }

        // 3. Process business logic (Simulate order creation)
        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        // 4. Configure 201 Created response with Location header
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("Location", req.getContextPath() + "/api/orders/" + orderId);

        try (PrintWriter out = resp.getWriter()) {
            out.printf("{\"orderId\":\"%s\",\"status\":\"CONFIRMED\",\"receivedLength\":%d}%n", 
                orderId, jsonBody.length());
        }
    }
}
