package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

@WebServlet(name = "CsrfProtectionServlet", urlPatterns = {"/transfer"})
public class CsrfProtectionServlet extends HttpServlet {

    private final SecureRandom random = new SecureRandom();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(true);
        String csrfToken = (String) session.getAttribute("CSRF_TOKEN");
        if (csrfToken == null) {
            byte[] bytes = new byte[24];
            random.nextBytes(bytes);
            csrfToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            session.setAttribute("CSRF_TOKEN", csrfToken);
        }

        resp.setContentType("text/html;charset=UTF-8");
        resp.getWriter().printf("""
            <form method="POST" action="%s/transfer">
                <input type="hidden" name="csrfToken" value="%s" />
                <label>Amount: <input type="number" name="amount" value="100"/></label>
                <button type="submit">Transfer Funds</button>
            </form>
            """, req.getContextPath(), csrfToken);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(false);
        String sessionToken = session != null ? (String) session.getAttribute("CSRF_TOKEN") : null;
        String requestToken = req.getParameter("csrfToken");

        if (sessionToken == null || requestToken == null || !sessionToken.equals(requestToken)) {
            // CSRF Attack detected or token expired
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("403 Forbidden: Invalid or missing CSRF token.");
            return;
        }

        // Token validated successfully: execute fund transfer
        String amount = req.getParameter("amount");
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().printf("Funds transfer approved: $%s transferred securely.%n", amount);
    }
}
