package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "CookieConsentServlet", urlPatterns = {"/cookies"})
public class CookieConsentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String action = req.getParameter("action");
        resp.setContentType("text/plain;charset=UTF-8");

        if ("set".equalsIgnoreCase(action)) {
            // Create cookie with security flags
            Cookie cookie = new Cookie("user_consent", "accepted");
            cookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
            cookie.setPath("/");
            cookie.setHttpOnly(true); // Prevent JavaScript access (XSS defense)
            cookie.setSecure(true);   // Transmit only over HTTPS
            cookie.setAttribute("SameSite", "Lax"); // CSRF mitigation
            
            resp.addCookie(cookie);
            resp.getWriter().println("Cookie 'user_consent=accepted' attached to response.");
            return;
        } else if ("delete".equalsIgnoreCase(action)) {
            // Delete cookie by setting MaxAge to 0
            Cookie cookie = new Cookie("user_consent", "");
            cookie.setMaxAge(0);
            cookie.setPath("/");
            resp.addCookie(cookie);
            resp.getWriter().println("Cookie 'user_consent' deleted.");
            return;
        }

        // Read incoming cookies
        Cookie[] cookies = req.getCookies();
        try (PrintWriter out = resp.getWriter()) {
            out.println("=== Incoming Request Cookies ===");
            if (cookies != null && cookies.length > 0) {
                for (Cookie c : cookies) {
                    out.printf("  %s = %s (Path: %s, MaxAge: %d)%n", 
                        c.getName(), c.getValue(), c.getPath(), c.getMaxAge());
                }
            } else {
                out.println("  (No cookies found in request)");
            }
        }
    }
}
