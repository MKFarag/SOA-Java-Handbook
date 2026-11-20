package com.handbook.spring;

import java.util.*;

public class DeclarativeRestClientFeignDemo {

    public record CustomerProfile(Long id, String name, String email, String tier) {}

    public static class DeclarativeServiceClientSimulator {
        private final Map<Long, CustomerProfile> mockDirectory = new HashMap<>();

        public DeclarativeServiceClientSimulator() {
            mockDirectory.put(42L, new CustomerProfile(42L, "Sarah Connor", "sarah@cyberdyne.corp", "VIP"));
            mockDirectory.put(99L, new CustomerProfile(99L, "John Connor", "john@resistance.org", "STANDARD"));
        }

        public CustomerProfile getCustomerById(Long id) {
            System.out.printf("  -> [Declarative Client Proxy]: Executed HTTP GET /api/v1/customers/%d%n", id);
            CustomerProfile profile = mockDirectory.get(id);
            if (profile == null) {
                throw new NoSuchElementException("HTTP 404: Customer not found: " + id);
            }
            return profile;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 123: Declarative Inter-Service Clients (OpenFeign & RestClient) ===");

        DeclarativeServiceClientSimulator client = new DeclarativeServiceClientSimulator();
        CustomerProfile profile = client.getCustomerById(42L);

        System.out.printf("Received Profile: [%d] %s (%s) - Tier: %s%n",
            profile.id(), profile.name(), profile.email(), profile.tier());

        if (!"VIP".equals(profile.tier()) || !profile.name().equals("Sarah Connor")) {
            throw new AssertionError("Declarative client payload mapping failed!");
        }

        System.out.println("Topic 123 Declarative REST Clients verified successfully.");
    }
}
