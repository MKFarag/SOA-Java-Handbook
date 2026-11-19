package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "SessionShoppingCartServlet", urlPatterns = {"/cart"})
public class SessionShoppingCartServlet extends HttpServlet {

    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        // 1. Retrieve or create session
        HttpSession session = req.getSession(true);
        session.setMaxInactiveInterval(1800); // 30 minutes timeout

        // 2. Retrieve or initialize session-scoped cart
        List<String> cart = (List<String>) session.getAttribute("shoppingCart");
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute("shoppingCart", cart);
        }

        // 3. Process actions
        String action = req.getParameter("action");
        String item = req.getParameter("item");

        if ("add".equalsIgnoreCase(action) && item != null && !item.isBlank()) {
            cart.add(item.trim());
        } else if ("clear".equalsIgnoreCase(action)) {
            session.invalidate(); // Destroys session
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("Session invalidated. Cart cleared.");
            return;
        }

        // 4. Output session state
        resp.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.println("{");
            out.printf("  \"sessionId\": \"%s\",%n", session.getId());
            out.printf("  \"isNew\": %b,%n", session.isNew());
            out.printf("  \"creationTime\": %d,%n", session.getCreationTime());
            out.printf("  \"itemCount\": %d,%n", cart.size());
            out.printf("  \"items\": %s%n", cart);
            out.println("}");
        }
    }
}
