package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "FaultTriggerServlet", urlPatterns = {"/fault"})
public class FaultTriggerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String type = req.getParameter("type");
        if ("404".equals(type)) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Requested entity does not exist.");
            return;
        }
        if ("runtime".equals(type)) {
            throw new RuntimeException("Simulated NullPointerException inside business workflow.");
        }
        if ("illegal-arg".equals(type)) {
            throw new IllegalArgumentException("Invalid state transition triggered by client request.");
        }

        resp.setContentType("text/plain");
        resp.getWriter().println("Normal execution: No faults triggered.");
    }
}
