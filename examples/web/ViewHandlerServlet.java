package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "ViewHandlerServlet", urlPatterns = {"/view-handler"})
public class ViewHandlerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String flashMessage = (String) req.getAttribute("flashMessage");
        Long timestamp = (Long) req.getAttribute("processedTimestamp");

        resp.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.println("<div class='view-content'>");
            out.println("<h2>View Handler Render Target</h2>");
            out.printf("<p>Flash Message: <strong>%s</strong></p>%n", 
                flashMessage != null ? flashMessage : "(no attribute found)");
            out.printf("<p>Timestamp: <em>%s</em></p>%n", 
                timestamp != null ? timestamp.toString() : "(none)");
            out.println("</div>");
        }
    }
}
