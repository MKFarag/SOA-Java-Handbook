package com.handbook.web;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class AppBootstrapListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        System.out.println("[AppBootstrapListener] Web application starting: " + ctx.getContextPath());
        
        // Initialize global application-scope configuration
        ctx.setAttribute("appName", "Definitive Java Handbook Web App");
        ctx.setAttribute("appStartTime", System.currentTimeMillis());
        ctx.setAttribute("dbPoolStatus", "READY");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        System.out.println("[AppBootstrapListener] Web application shutting down: " + ctx.getContextPath());
        // Clean up connection pools, background threads, and caches
        ctx.removeAttribute("dbPoolStatus");
    }
}
