package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@WebServlet(name = "ProductCatalogServlet", urlPatterns = {"/products"})
public class ProductCatalogServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 1. Controller calls business/service layer to retrieve Model data
        List<Product> products = Arrays.asList(
            new Product(101L, "Mechanical Keyboard", 129.99, 15),
            new Product(102L, "USB-C Dual Dock", 89.50, 42),
            new Product(103L, "Ergonomic Vertical Mouse", 59.00, 8),
            new Product(104L, "4K Ultra-Wide Monitor", 449.99, 5)
        );

        // 2. Controller binds Model into request scope
        req.setAttribute("productList", products);
        req.setAttribute("pageTitle", "Hardware Inventory Catalog");

        // 3. Controller forwards execution to the JSP View located in protected /WEB-INF/
        req.getRequestDispatcher("/WEB-INF/views/product-catalog.jsp").forward(req, resp);
    }
}
