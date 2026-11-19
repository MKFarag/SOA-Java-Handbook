package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Enumeration;

@WebServlet(name = "RequestInspectorServlet", urlPatterns = {"/inspect"})
public class RequestInspectorServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        // 1. Configure outgoing response headers and content type
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("X-Handled-By", "Jakarta-Servlet-6.0");
        resp.setStatus(HttpServletResponse.SC_OK);

        // 2. Read query parameters
        String clientName = req.getParameter("client");
        if (clientName == null || clientName.isBlank()) {
            clientName = "Anonymous";
        }
        String[] tags = req.getParameterValues("tag");

        // 3. Inspect request metadata
        String method = req.getMethod();
        String requestUri = req.getRequestURI();
        String protocol = req.getProtocol();
        String userAgent = req.getHeader("User-Agent");

        // 4. Generate JSON output
        try (PrintWriter out = resp.getWriter()) {
            out.println("{");
            out.printf("  \"method\": \"%s\",%n", method);
            out.printf("  \"uri\": \"%s\",%n", requestUri);
            out.printf("  \"protocol\": \"%s\",%n", protocol);
            out.printf("  \"client\": \"%s\",%n", clientName);
            out.printf("  \"tags\": %s,%n", tags != null ? Arrays.toString(tags) : "[]");
            out.printf("  \"userAgent\": \"%s\"%n", userAgent != null ? userAgent : "Unknown");
            out.println("}");
        }
    }
}
