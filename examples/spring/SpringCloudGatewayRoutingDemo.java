package com.handbook.spring;

import java.util.*;

public class SpringCloudGatewayRoutingDemo {

    public record GatewayRoute(String routeId, String pattern, String targetService, int rateLimitTokens) {}

    public static class EnterpriseGatewaySimulator {
        private final List<GatewayRoute> routeTable = new ArrayList<>();

        public void addRoute(GatewayRoute route) {
            routeTable.add(route);
            System.out.printf("  -> [Gateway Route Registered]: ID=%-15s | Pattern=%-20s | Target=%s%n",
                route.routeId(), route.pattern(), route.targetService());
        }

        public Optional<GatewayRoute> matchRoute(String path) {
            return routeTable.stream().filter(r -> path.startsWith(r.pattern())).findFirst();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 121: Enterprise API Gateway Architecture & Routing ===");

        EnterpriseGatewaySimulator gateway = new EnterpriseGatewaySimulator();
        gateway.addRoute(new GatewayRoute("orders-v1", "/api/v1/orders", "lb://ORDER-SERVICE", 20));
        gateway.addRoute(new GatewayRoute("payments-v1", "/api/v1/payments", "lb://PAYMENT-SERVICE", 10));

        Optional<GatewayRoute> matched = gateway.matchRoute("/api/v1/payments/process");
        System.out.println("Route matching test: " + matched.map(GatewayRoute::targetService).orElse("NONE"));

        if (matched.isEmpty() || !matched.get().targetService().equals("lb://PAYMENT-SERVICE")) {
            throw new AssertionError("Gateway route matching verification failed!");
        }

        System.out.println("Topic 121 Spring Cloud Gateway routing verified successfully.");
    }
}
