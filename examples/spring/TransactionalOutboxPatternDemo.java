package com.handbook.spring;

import java.time.Instant;
import java.util.*;

public class TransactionalOutboxPatternDemo {

    public record OutboxRecord(UUID id, String aggregateId, String eventType, String payload, boolean processed) {}

    public static class OutboxRelayEngine {
        private final List<OutboxRecord> outboxStore = new ArrayList<>();
        private final List<String> kafkaTopic = new ArrayList<>();

        public void saveOrderWithOutbox(String orderId, String payload) {
            // Atomic insertion
            OutboxRecord record = new OutboxRecord(UUID.randomUUID(), orderId, "OrderPlaced", payload, false);
            outboxStore.add(record);
            System.out.printf("  -> [Atomic Commit]: Order %s & Outbox Record %s stored in DB.%n", orderId, record.id());
        }

        public void relayPendingEventsToKafka() {
            for (int i = 0; i < outboxStore.size(); i++) {
                OutboxRecord rec = outboxStore.get(i);
                if (!rec.processed()) {
                    kafkaTopic.add(rec.payload());
                    outboxStore.set(i, new OutboxRecord(rec.id(), rec.aggregateId(), rec.eventType(), rec.payload(), true));
                    System.out.printf("  -> [Relay Success]: Event %s streamed to Kafka topic.%n", rec.aggregateId());
                }
            }
        }

        public int getPublishedEventCount() { return kafkaTopic.size(); }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 126: Transactional Outbox Pattern & CDC ===");

        OutboxRelayEngine engine = new OutboxRelayEngine();
        engine.saveOrderWithOutbox("ORD-7701", "{\"total\":199.99,\"currency\":\"USD\"}");
        engine.saveOrderWithOutbox("ORD-7702", "{\"total\":54.50,\"currency\":\"USD\"}");

        engine.relayPendingEventsToKafka();
        System.out.println("Total events published to Kafka via Outbox: " + engine.getPublishedEventCount());

        if (engine.getPublishedEventCount() != 2) {
            throw new AssertionError("Transactional outbox event relay count mismatch!");
        }

        System.out.println("Topic 126 Transactional Outbox Pattern verified successfully.");
    }
}
