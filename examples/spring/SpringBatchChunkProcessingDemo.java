package com.handbook.spring;

import java.util.*;

public class SpringBatchChunkProcessingDemo {

    public record RawOrder(String orderId, double price, boolean valid) {}
    public record SettledOrder(String orderId, double finalAmount, String status) {}

    public static class BatchPipelineEngine {
        public static List<SettledOrder> executeChunkPipeline(List<RawOrder> rawOrders, int chunkSize) {
            List<SettledOrder> settled = new ArrayList<>();
            List<SettledOrder> chunk = new ArrayList<>();

            for (RawOrder raw : rawOrders) {
                // ItemProcessor step: filter invalid and calculate fee
                if (!raw.valid()) {
                    System.out.println("  -> [Skipped Invalid Order]: " + raw.orderId());
                    continue;
                }
                SettledOrder processed = new SettledOrder(raw.orderId(), raw.price() * 1.05, "SETTLED");
                chunk.add(processed);

                // ItemWriter step: commit when chunk is full
                if (chunk.size() == chunkSize) {
                    System.out.printf("  -> [Chunk Commit] Writing %d orders to ledger.%n", chunk.size());
                    settled.addAll(chunk);
                    chunk.clear();
                }
            }

            if (!chunk.isEmpty()) {
                System.out.printf("  -> [Final Chunk Commit] Writing %d orders to ledger.%n", chunk.size());
                settled.addAll(chunk);
                chunk.clear();
            }

            return settled;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 117: High-Volume Batch Processing with Spring Batch ===");

        List<RawOrder> feed = List.of(
            new RawOrder("ORD-001", 100.00, true),
            new RawOrder("ORD-002", 250.00, true),
            new RawOrder("ORD-003", 0.00, false), // Corrupt record
            new RawOrder("ORD-004", 450.00, true),
            new RawOrder("ORD-005", 90.00, true)
        );

        List<SettledOrder> results = BatchPipelineEngine.executeChunkPipeline(feed, 2);
        System.out.println("Total settled orders committed: " + results.size());

        if (results.size() != 4) {
            throw new AssertionError("Batch pipeline chunk processing count mismatch!");
        }

        System.out.println("Topic 117 Spring Batch Chunk Processing verified successfully.");
    }
}
