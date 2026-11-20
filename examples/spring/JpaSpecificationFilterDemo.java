package com.handbook.spring;

import java.util.*;

public class JpaSpecificationFilterDemo {

    public record CustomerQuery(String country, Double minBalance, Boolean active) {}
    public record Customer(Long id, String name, String country, double balance, boolean active) {}

    public static class DynamicSpecificationEngine {
        public static List<Customer> filterCustomers(List<Customer> customers, CustomerQuery criteria) {
            return customers.stream().filter(c -> {
                if (criteria.country() != null && !criteria.country().equalsIgnoreCase(c.country())) {
                    return false;
                }
                if (criteria.minBalance() != null && c.balance() < criteria.minBalance()) {
                    return false;
                }
                if (criteria.active() != null && c.active() != criteria.active()) {
                    return false;
                }
                return true;
            }).toList();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 109: Dynamic Queries via JPA Criteria & Specifications ===");

        List<Customer> customers = List.of(
            new Customer(1L, "Alice Vance", "Egypt", 12500.00, true),
            new Customer(2L, "Bob Miller", "USA", 450.00, true),
            new Customer(3L, "Carlos Gomez", "Egypt", 8200.00, false),
            new Customer(4L, "Diana Prince", "Egypt", 34000.00, true)
        );

        CustomerQuery query = new CustomerQuery("Egypt", 10000.00, true);
        List<Customer> result = DynamicSpecificationEngine.filterCustomers(customers, query);

        System.out.printf("Filtered Customers (Country=%s, MinBalance=%.2f, Active=%s):%n", 
            query.country(), query.minBalance(), query.active());
        result.forEach(c -> System.out.printf(" -> [%d] %s | Country: %s | Balance: $%.2f%n", 
            c.id(), c.name(), c.country(), c.balance()));

        if (result.size() != 2) {
            throw new AssertionError("Expected 2 filtered customers, got: " + result.size());
        }

        System.out.println("Topic 109 JPA Specification Dynamic Filtering verified successfully.");
    }
}
