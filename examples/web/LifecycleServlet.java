package com.handbook.web;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicInteger;

@WebServlet(name = "LifecycleServlet", urlPatterns = {"/lifecycle"})
public class LifecycleServlet extends HttpServlet {
    private final AtomicInteger requestCounter = new AtomicInteger(0);

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        System.out.println("[Servlet Lifecycle] init() executed once: Servlet instance initialized in container.");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        int currentCount = requestCounter.incrementAndGet();
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html><html><head><title>Servlet Lifecycle</title></head><body>");
            out.println("<h1>Jakarta Servlet 6.0 Lifecycle Demo</h1>");
            out.println("<p>HTTP Method: GET</p>");
            out.println("<p>Total Requests Handled by Single Instance: <strong>" + currentCount + "</strong></p>");
            out.println("<p>Thread handling request: " + Thread.currentThread().getName() + "</p>");
            out.println("</body></html>");
        }
    }

    @Override
    public void destroy() {
        System.out.println("[Servlet Lifecycle] destroy() executed: Cleaning up resources before shutdown.");
        super.destroy();
    }
}
