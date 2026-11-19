package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(
    name = "MultiMappingServlet",
    urlPatterns = {"/catalog/*", "/product-lookup"}
)
public class MultiMappingServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("text/plain;charset=UTF-8");
        String servletPath = req.getServletPath();
        String pathInfo = req.getPathInfo();
        String queryString = req.getQueryString();

        try (PrintWriter out = resp.getWriter()) {
            out.printf("Servlet Path: %s%n", servletPath);
            out.printf("Path Info:    %s%n", pathInfo != null ? pathInfo : "(none)");
            out.printf("Query String: %s%n", queryString != null ? queryString : "(none)");
            
            if (pathInfo != null && pathInfo.startsWith("/")) {
                String requestedItem = pathInfo.substring(1);
                out.printf("Extracted Item Slug: %s%n", requestedItem);
            }
        }
    }
}
