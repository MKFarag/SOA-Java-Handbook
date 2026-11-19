package com.handbook.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter(filterName = "AuthGuardFilter", urlPatterns = {"/admin/*", "/protected/*"})
public class AuthGuardFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        HttpSession session = req.getSession(false);
        boolean isAuthenticated = session != null && session.getAttribute("authenticatedUser") != null;

        if (!isAuthenticated) {
            // Block unauthenticated access immediately
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("401 Unauthorized: Access to protected resource requires login.");
            return;
        }

        // Proceed to protected resource
        chain.doFilter(request, response);
    }
}
