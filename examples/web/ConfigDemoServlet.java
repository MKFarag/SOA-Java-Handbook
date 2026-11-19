package com.handbook.web;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(
    name = "ConfigDemoServlet",
    urlPatterns = {"/config-demo"},
    loadOnStartup = 1,
    initParams = {
        @WebInitParam(name = "defaultPageSize", value = "25"),
        @WebInitParam(name = "environment", value = "Production")
    }
)
public class ConfigDemoServlet extends HttpServlet {

    private int defaultPageSize;
    private String environment;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        String sizeParam = config.getInitParameter("defaultPageSize");
        this.defaultPageSize = sizeParam != null ? Integer.parseInt(sizeParam) : 10;
        this.environment = config.getInitParameter("environment");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.printf("Servlet Name: %s%n", getServletName());
            out.printf("Environment:  %s%n", environment);
            out.printf("Page Size:    %d%n", defaultPageSize);
            out.printf("Context Path: %s%n", getServletContext().getContextPath());
        }
    }
}
