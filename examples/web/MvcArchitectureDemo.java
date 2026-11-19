package com.handbook.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MvcArchitectureDemo {

    // 1. Model: Domain entity
    public record CustomerOrder(String orderId, String customer, double total, String status) {}

    // 2. Controller: Handles request, queries data, populates Model, selects View
    public static class OrderController {
        public String handleOrderSummary(String customerFilter, Map<String, Object> requestScope) {
            System.out.println("[Controller] Processing HTTP GET request for orders of: " + customerFilter);
            List<CustomerOrder> databaseOrders = List.of(
                new CustomerOrder("ORD-901", "Alice Smith", 249.50, "SHIPPED"),
                new CustomerOrder("ORD-902", "Bob Jones", 89.00, "PROCESSING"),
                new CustomerOrder("ORD-903", "Alice Smith", 1120.00, "DELIVERED")
            );

            List<CustomerOrder> filtered = new ArrayList<>();
            for (CustomerOrder o : databaseOrders) {
                if (customerFilter == null || o.customer().equalsIgnoreCase(customerFilter)) {
                    filtered.add(o);
                }
            }

            // Bind Model into request scope for View
            requestScope.put("orders", filtered);
            requestScope.put("totalCount", filtered.size());

            // Return target view template path
            return "/WEB-INF/views/order-summary.jsp";
        }
    }

    // 3. View Renderer: Simulates JSP container rendering HTML from request attributes
    public static class JspViewRenderer {
        @SuppressWarnings("unchecked")
        public static String render(String viewPath, Map<String, Object> requestScope) {
            System.out.println("[View] Rendering template from protected path: " + viewPath);
            StringBuilder html = new StringBuilder();
            html.append("<!-- Rendered by Jakarta Pages from ").append(viewPath).append(" -->\n");
            html.append("<div class='order-container'>\n");
            html.append("  <h3>Found ").append(requestScope.get("totalCount")).append(" orders</h3>\n");
            html.append("  <ul>\n");

            List<CustomerOrder> orders = (List<CustomerOrder>) requestScope.get("orders");
            for (CustomerOrder o : orders) {
                html.append("    <li>Order #").append(o.orderId())
                    .append(" - ").append(o.customer())
                    .append(": $").append(o.total())
                    .append(" [").append(o.status()).append("]</li>\n");
            }
            html.append("  </ul>\n</div>");
            return html.toString();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Web MVC Pattern Architecture Demo ===");

        OrderController controller = new OrderController();
        Map<String, Object> requestScope = new HashMap<>();

        // Controller invocation
        String targetView = controller.handleOrderSummary("Alice Smith", requestScope);

        // Verification of separation of concerns
        assert targetView.startsWith("/WEB-INF/views/") : "Views must be protected in /WEB-INF/";
        assert requestScope.containsKey("orders") : "Controller must provide Model attributes";

        // View rendering
        String htmlOutput = JspViewRenderer.render(targetView, requestScope);
        System.out.println("[Response HTML]:\n" + htmlOutput);
        System.out.println("MVC flow verified: Separation of Model, Controller, and View successful.");
    }
}
