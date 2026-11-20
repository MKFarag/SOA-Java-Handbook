package com.handbook.spring;

import java.util.*;

public class KafkaResilienceDltDemo {

    public record MessagePayload(String orderId, String status, int retryCount) {}

    public static class ResilientKafkaConsumerSimulator {
        private final List<MessagePayload> dltQuarantine = new ArrayList<>();

        public void processMessage(String orderId, boolean simulateFatalError) {
            System.out.printf("  -> Consuming message for order: %s%n", orderId);
            if (simulateFatalError) {
                System.out.printf("  -> [Non-Blocking Retry Exhausted] Poison-pill detected. Routing %s to DLT.%n", orderId);
                dltQuarantine.add(new MessagePayload(orderId, "FAILED_ROUTED_TO_DLT", 3));
            } else {
                System.out.printf("  -> [Processed Successfully]: %s cleared.%n", orderId);
            }
        }

        public int getDltCount() { return dltQuarantine.size(); }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 125: Kafka Production Resilience & Dead Letter Topics ===");

        ResilientKafkaConsumerSimulator consumer = new ResilientKafkaConsumerSimulator();
        consumer.processMessage("ORD-101", false);
        consumer.processMessage("ORD-CORRUPT-999", true); // Simulates poison pill
        consumer.processMessage("ORD-102", false);

        System.out.println("Total poison-pill messages quarantined in DLT: " + consumer.getDltCount());

        if (consumer.getDltCount() != 1) {
            throw new AssertionError("Kafka DLT quarantine count mismatch!");
        }

        System.out.println("Topic 125 Kafka Resilience and DLT verified successfully.");
    }
}
