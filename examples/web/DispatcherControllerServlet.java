package com.handbook.web;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "DispatcherControllerServlet", urlPatterns = {"/controller"})
public class DispatcherControllerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String action = req.getParameter("action");
        if (action == null) action = "forward";

        switch (action) {
            case "forward" -> {
                // Server-side forward: client URL stays /controller, request attributes preserved
                req.setAttribute("flashMessage", "Forwarded from DispatcherControllerServlet");
                req.setAttribute("processedTimestamp", System.currentTimeMillis());
                RequestDispatcher dispatcher = req.getRequestDispatcher("/view-handler");
                dispatcher.forward(req, resp);
            }
            case "include" -> {
                // Server-side include: includes output from target without terminating original response
                resp.setContentType("text/html;charset=UTF-8");
                resp.getWriter().println("<div class='header'>-- Global Site Header --</div>");
                RequestDispatcher dispatcher = req.getRequestDispatcher("/view-handler");
                dispatcher.include(req, resp);
                resp.getWriter().println("<div class='footer'>-- Global Site Footer --</div>");
            }
            case "redirect" -> {
                // Client-side redirect: sends 302 Found, browser makes a new GET request
                String redirectUrl = req.getContextPath() + "/inspect?client=RedirectedUser";
                resp.sendRedirect(redirectUrl);
            }
            default -> resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unknown action: " + action);
        }
    }
}
