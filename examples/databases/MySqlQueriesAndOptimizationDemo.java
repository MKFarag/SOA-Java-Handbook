package com.handbook.databases;

import java.util.*;

/**
 * Section 38 - Topic 131: Relational Databases & MySQL Mastery (XAMPP Setup, DDL, DML, Joins & Query Tuning)
 * 
 * Demonstrates:
 * 1. Relational schema representation with Primary and Foreign Key constraints.
 * 2. SQL DQL Relational Joins: INNER JOIN, LEFT JOIN, and Anti-Join (Unmatched rows).
 * 3. B-Tree Index Simulation and Search Cost Comparison.
 * 4. MySQL `EXPLAIN` Query Plan Inspector output generator.
 */
public class MySqlQueriesAndOptimizationDemo {

    // Domain models simulating MySQL tables
    public record CustomerRow(long id, String firstName, String lastName, String email) {}
    public record OrderRow(long id, String orderNumber, long customerId, double totalAmount) {}
    public record ProductRow(long id, String sku, String category, double price, int stock) {}

    // =========================================================================
    // 1. RELATIONAL JOIN ENGINE SIMULATOR
    // =========================================================================
    public static class JoinEngine {
        public static List<String> innerJoin(List<CustomerRow> customers, List<OrderRow> orders) {
            List<String> results = new ArrayList<>();
            for (OrderRow o : orders) {
                for (CustomerRow c : customers) {
                    if (c.id() == o.customerId()) {
                        results.add(String.format("INNER JOIN Match: Order %s ($%.2f) -> Customer: %s %s (%s)",
                                o.orderNumber(), o.totalAmount(), c.firstName(), c.lastName(), c.email()));
                        break;
                    }
                }
            }
            return results;
        }

        public static List<String> leftJoin(List<CustomerRow> customers, List<OrderRow> orders) {
            List<String> results = new ArrayList<>();
            for (CustomerRow c : customers) {
                boolean matched = false;
                for (OrderRow o : orders) {
                    if (c.id() == o.customerId()) {
                        results.add(String.format("LEFT JOIN Match: Customer %s %s -> Order %s ($%.2f)",
                                c.firstName(), c.lastName(), o.orderNumber(), o.totalAmount()));
                        matched = true;
                    }
                }
                if (!matched) {
                    results.add(String.format("LEFT JOIN Unmatched: Customer %s %s -> Order [NULL]",
                            c.firstName(), c.lastName()));
                }
            }
            return results;
        }

        public static List<String> antiJoin(List<CustomerRow> customers, List<OrderRow> orders) {
            List<String> results = new ArrayList<>();
            for (CustomerRow c : customers) {
                boolean hasOrder = orders.stream().anyMatch(o -> o.customerId() == c.id());
                if (!hasOrder) {
                    results.add(String.format("ANTI-JOIN (Zero Orders): Customer #%d: %s %s (%s)",
                            c.id(), c.firstName(), c.lastName(), c.email()));
                }
            }
            return results;
        }
    }

    // =========================================================================
    // 2. B-TREE INDEX VS FULL TABLE SCAN SIMULATOR
    // =========================================================================
    public static class IndexPerformanceSimulator {
        private final List<ProductRow> tableRows = new ArrayList<>();
        // NavigableMap represents the B-Tree balanced binary/multi-way tree index
        private final NavigableMap<String, List<ProductRow>> categoryBTreeIndex = new TreeMap<>();

        public void addProduct(ProductRow p) {
            tableRows.add(p);
            // Maintain B-Tree Index
            categoryBTreeIndex.computeIfAbsent(p.category(), k -> new ArrayList<>()).add(p);
        }

        // Full Table Scan (type: ALL)
        public int executeFullTableScan(String targetCategory) {
            int scannedRows = 0;
            List<ProductRow> matches = new ArrayList<>();
            for (ProductRow p : tableRows) {
                scannedRows++;
                if (p.category().equals(targetCategory)) {
                    matches.add(p);
                }
            }
            System.out.printf("  [EXPLAIN type=ALL (Full Table Scan)] Scanned %d physical rows to find %d matches.\n",
                    scannedRows, matches.size());
            return scannedRows;
        }

        // B-Tree Index Range/Ref Lookup (type: ref)
        public int executeIndexLookup(String targetCategory) {
            // O(log N) lookup in B-Tree index
            List<ProductRow> matches = categoryBTreeIndex.getOrDefault(targetCategory, Collections.emptyList());
            int indexHops = (int) Math.ceil(Math.log(Math.max(2, categoryBTreeIndex.size())) / Math.log(2));
            System.out.printf("  [EXPLAIN type=ref (Index Scan idx_products_category)] B-Tree traversal took %d hops; returned %d matches instantly.\n",
                    indexHops, matches.size());
            return indexHops;
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println(" Topic 131: MySQL Mastery: DDL, DML, Joins & Query Tuning Demo                 ");
        System.out.println("================================================================================\n");

        // Seed data
        List<CustomerRow> customers = List.of(
                new CustomerRow(1, "Elena", "Vance", "elena.vance@enterprise.com"),
                new CustomerRow(2, "Marcus", "Brody", "marcus.brody@museum.org"),
                new CustomerRow(3, "Sophia", "Al-Mansoor", "sophia.m@fintech.ae")
        );

        List<OrderRow> orders = List.of(
                new OrderRow(101, "ORD-2026-01", 1, 1899.99),
                new OrderRow(102, "ORD-2026-02", 1, 649.50),
                new OrderRow(103, "ORD-2026-03", 2, 1295.00)
        );

        // 1. Relational Joins Demonstration
        System.out.println("--- 1. Relational Joins (INNER, LEFT, ANTI-JOIN) ---");
        System.out.println("[INNER JOIN Results]");
        JoinEngine.innerJoin(customers, orders).forEach(r -> System.out.println("  " + r));

        System.out.println("\n[LEFT JOIN Results (Preserving All Customers)]");
        JoinEngine.leftJoin(customers, orders).forEach(r -> System.out.println("  " + r));

        System.out.println("\n[ANTI-JOIN Results (Customers with Zero Orders)]");
        JoinEngine.antiJoin(customers, orders).forEach(r -> System.out.println("  " + r));

        // 2. Index Optimization Simulation
        System.out.println("\n--- 2. B-Tree Index vs Full Table Scan Performance Simulation ---");
        IndexPerformanceSimulator sim = new IndexPerformanceSimulator();
        // Insert 10,000 simulated rows
        for (int i = 1; i <= 10000; i++) {
            String cat = (i % 20 == 0) ? "Electronics" : (i % 5 == 0) ? "Furniture" : "Accessories";
            sim.addProduct(new ProductRow(i, "SKU-" + i, cat, 49.99 + (i % 100), 50));
        }

        System.out.println("Query: SELECT * FROM products WHERE category = 'Electronics'");
        sim.executeFullTableScan("Electronics");
        sim.executeIndexLookup("Electronics");

        System.out.println("\n[SUCCESS] Topic 131 MySQL Mastery Demo executed cleanly.");
    }
}
