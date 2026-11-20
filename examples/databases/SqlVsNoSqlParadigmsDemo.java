package com.handbook.databases;

import java.time.Instant;
import java.util.*;

/**
 * Section 38 - Topic 130: SQL vs NoSQL: Paradigms, ACID vs BASE, and Architectural Trade-Offs
 * 
 * Demonstrates:
 * 1. Normalized Relational Data Model (Tables, Foreign Keys, Inner Joins).
 * 2. Denormalized Document Data Model (Self-contained JSON/BSON Document).
 * 3. ACID Transactional Guarantees (Atomic multi-row rollback on constraint failure).
 * 4. BASE Eventual Consistency Gossip Simulation (Replica state convergence).
 */
public class SqlVsNoSqlParadigmsDemo {

    // =========================================================================
    // 1. RELATIONAL (SQL) NORMALIZED MODEL
    // =========================================================================
    public record SqlCustomer(long id, String email, String fullName) {}
    public record SqlOrder(long id, long customerId, Instant orderDate, double totalAmount) {}
    public record SqlOrderItem(long id, long orderId, String sku, int quantity, double unitPrice) {}

    public static class RelationalDatabaseSimulator {
        private final Map<Long, SqlCustomer> customers = new HashMap<>();
        private final Map<Long, SqlOrder> orders = new HashMap<>();
        private final Map<Long, SqlOrderItem> orderItems = new HashMap<>();

        public void insertCustomer(SqlCustomer c) { customers.put(c.id(), c); }
        public void insertOrder(SqlOrder o) { orders.put(o.id(), o); }
        public void insertOrderItem(SqlOrderItem i) { orderItems.put(i.id(), i); }

        // Simulates: SELECT c.fullName, o.id, i.sku, i.quantity, i.unitPrice FROM orders o JOIN ...
        public List<String> executeRelationalJoin(long orderId) {
            List<String> results = new ArrayList<>();
            SqlOrder order = orders.get(orderId);
            if (order == null) return results;

            SqlCustomer customer = customers.get(order.customerId());
            if (customer == null) return results;

            for (SqlOrderItem item : orderItems.values()) {
                if (item.orderId() == orderId) {
                    results.add(String.format("Customer: %s | Order: #%d | SKU: %s | Qty: %d | Price: $%.2f",
                            customer.fullName(), order.id(), item.sku(), item.quantity(), item.unitPrice()));
                }
            }
            return results;
        }

        // Simulates ACID Atomic Transaction: Transfer funds with rollback on failure
        public boolean executeAcidFundsTransfer(long accountFrom, long accountTo, double amount, Map<Long, Double> balances) {
            double balFrom = balances.getOrDefault(accountFrom, 0.0);
            double balTo = balances.getOrDefault(accountTo, 0.0);

            // Constraint validation: Atomicity check
            if (balFrom < amount) {
                System.out.printf("  [ACID ROLLBACK] Insufficient funds in Account %d ($%.2f < $%.2f). Aborting.\n",
                        accountFrom, balFrom, amount);
                return false; // Transaction rolled back, zero state modified
            }

            // Atomic commit
            balances.put(accountFrom, balFrom - amount);
            balances.put(accountTo, balTo + amount);
            System.out.printf("  [ACID COMMIT] Successfully transferred $%.2f from Acct %d to Acct %d.\n",
                    amount, accountFrom, accountTo);
            return true;
        }
    }

    // =========================================================================
    // 2. DOCUMENT (NoSQL) SELF-CONTAINED MODEL
    // =========================================================================
    public record DocumentItem(String sku, String name, int quantity, double unitPrice) {}
    public record DocumentCustomer(long id, String fullName, String email) {}
    public record OrderDocument(
            String id,
            String orderNumber,
            DocumentCustomer customer,
            List<DocumentItem> items,
            double totalAmount,
            Instant createdAt
    ) {
        public String toFormattedJson() {
            StringBuilder sb = new StringBuilder();
            sb.append("{\n");
            sb.append(String.format("  \"_id\": \"%s\",\n", id));
            sb.append(String.format("  \"orderNumber\": \"%s\",\n", orderNumber));
            sb.append(String.format("  \"customer\": { \"id\": %d, \"name\": \"%s\", \"email\": \"%s\" },\n",
                    customer.id(), customer.fullName(), customer.email()));
            sb.append("  \"items\": [\n");
            for (int i = 0; i < items.size(); i++) {
                DocumentItem it = items.get(i);
                String comma = (i < items.size() - 1) ? "," : "";
                sb.append("    { \"sku\": \"").append(it.sku())
                  .append("\", \"qty\": ").append(it.quantity())
                  .append(", \"price\": ").append(it.unitPrice())
                  .append(" }").append(comma).append("\n");
            }
            sb.append("  ],\n");
            sb.append(String.format("  \"totalAmount\": %.2f\n", totalAmount));
            sb.append("}");
            return sb.toString();
        }
    }

    // =========================================================================
    // 3. BASE (EVENTUAL CONSISTENCY) REPLICA CONVERGENCE
    // =========================================================================
    public static class BaseReplicaClusterSimulator {
        public static class Node {
            String nodeId;
            Map<String, String> data = new HashMap<>();
            long version = 0;

            Node(String id) { this.nodeId = id; }
        }

        public static void demonstrateEventualConsistency() {
            Node leader = new Node("us-east-primary");
            Node replica1 = new Node("us-west-read-replica");
            Node replica2 = new Node("eu-central-read-replica");

            // Write arrives at Leader
            String key = "product:LAPTOP-X1:price";
            String newValue = "1799.99";
            leader.data.put(key, newValue);
            leader.version = 2;

            System.out.println("  [BASE - Step 1: Write to Primary]");
            System.out.printf("    Leader (%s) value: %s (v%d)\n", leader.nodeId, leader.data.get(key), leader.version);
            System.out.printf("    Replica 1 (%s) value: %s (v%d) -> Stale read window!\n",
                    replica1.nodeId, replica1.data.get(key), replica1.version);

            // Background Async Gossip Replication
            System.out.println("  [BASE - Step 2: Asynchronous Gossip Synchronization]");
            replica1.data.put(key, leader.data.get(key));
            replica1.version = leader.version;
            replica2.data.put(key, leader.data.get(key));
            replica2.version = leader.version;

            System.out.println("  [BASE - Step 3: Eventual Convergence Achieved]");
            System.out.printf("    Replica 1 (%s) converged value: %s (v%d)\n", replica1.nodeId, replica1.data.get(key), replica1.version);
            System.out.printf("    Replica 2 (%s) converged value: %s (v%d)\n", replica2.nodeId, replica2.data.get(key), replica2.version);
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println(" Topic 130: SQL vs NoSQL: Paradigms, ACID vs BASE & Trade-Offs Demo            ");
        System.out.println("================================================================================\n");

        // 1. Relational SQL Simulation
        System.out.println("--- 1. Relational SQL Normalized Model & Relational Join ---");
        RelationalDatabaseSimulator sqlDb = new RelationalDatabaseSimulator();
        sqlDb.insertCustomer(new SqlCustomer(1, "elena.vance@enterprise.com", "Elena Vance"));
        sqlDb.insertOrder(new SqlOrder(101, 1, Instant.now(), 2549.49));
        sqlDb.insertOrderItem(new SqlOrderItem(1, 101, "LAPTOP-X1", 1, 1899.99));
        sqlDb.insertOrderItem(new SqlOrderItem(2, 101, "MONITOR-4K", 1, 649.50));

        List<String> joinedRows = sqlDb.executeRelationalJoin(101);
        for (String row : joinedRows) {
            System.out.println("  [SQL JOIN Result] " + row);
        }

        // 2. ACID Transaction Demonstration
        System.out.println("\n--- 2. ACID Transactional Integrity Demonstration ---");
        Map<Long, Double> accounts = new HashMap<>();
        accounts.put(1001L, 300.00); // Account A has $300
        accounts.put(1002L, 50.00);  // Account B has $50

        // Test failed transaction (insufficient funds)
        sqlDb.executeAcidFundsTransfer(1001L, 1002L, 500.00, accounts);
        // Test successful transaction
        sqlDb.executeAcidFundsTransfer(1001L, 1002L, 100.00, accounts);
        System.out.printf("  Final Balance Acct 1001: $%.2f | Acct 1002: $%.2f\n", accounts.get(1001L), accounts.get(1002L));

        // 3. Document NoSQL Demonstration
        System.out.println("\n--- 3. Document NoSQL Self-Contained Document Model ---");
        OrderDocument doc = new OrderDocument(
                "664e10f92b498a3b8417c801",
                "ORD-2026-1001",
                new DocumentCustomer(1, "Elena Vance", "elena.vance@enterprise.com"),
                List.of(
                        new DocumentItem("LAPTOP-X1", "ThinkPad Carbon X1", 1, 1899.99),
                        new DocumentItem("MONITOR-4K", "Dell UltraSharp 32", 1, 649.50)
                ),
                2549.49,
                Instant.now()
        );
        System.out.println("Single Document Lookup (Zero Cross-Table Joins Required):");
        System.out.println(doc.toFormattedJson());

        // 4. BASE Consistency Demonstration
        System.out.println("\n--- 4. BASE Distributed Eventual Consistency Simulation ---");
        BaseReplicaClusterSimulator.demonstrateEventualConsistency();

        System.out.println("\n[SUCCESS] Topic 130 SQL vs NoSQL Paradigms Demo executed cleanly.");
    }
}
