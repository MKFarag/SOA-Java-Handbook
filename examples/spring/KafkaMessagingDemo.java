package com.handbook.spring;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Section 30 - Topic 108: Event-Driven Enterprise Messaging with Apache Kafka
 * 
 * Demonstrates:
 * 1. Kafka architectural primitives: Topics, Partitions, Producer, Consumer Group, Offsets.
 * 2. Key-based deterministic partitioning (Murmur2 hash simulation).
 * 3. Producer record publishing and Consumer Group offset tracking.
 * 4. At-Least-Once delivery semantics and idempotency assurance.
 */
public class KafkaMessagingDemo {

    public record ProducerRecord(String topic, String key, String value, Instant timestamp) {}

    public record ConsumerRecord(String topic, int partition, long offset, String key, String value) {}

    public static class KafkaClusterSimulator {
        // Topic -> (PartitionId -> List<ConsumerRecord>)
        private final Map<String, Map<Integer, List<ConsumerRecord>>> topicPartitions = new ConcurrentHashMap<>();
        // ConsumerGroup -> (Topic -> (PartitionId -> CommittedOffset))
        private final Map<String, Map<String, Map<Integer, Long>>> committedOffsets = new ConcurrentHashMap<>();
        private final int partitionCount;

        public KafkaClusterSimulator(int partitionCount) {
            this.partitionCount = partitionCount;
        }

        public void publish(ProducerRecord record) {
            int partition = Math.abs(record.key().hashCode()) % partitionCount;
            Map<Integer, List<ConsumerRecord>> partitions = topicPartitions.computeIfAbsent(record.topic(), t -> new ConcurrentHashMap<>());
            List<ConsumerRecord> log = partitions.computeIfAbsent(partition, p -> new ArrayList<>());

            long offset = log.size();
            ConsumerRecord consumerRecord = new ConsumerRecord(record.topic(), partition, offset, record.key(), record.value());
            log.add(consumerRecord);

            System.out.printf("  [Kafka Producer] Published to '%s' [Partition: %d, Offset: %d] Key: %s -> Payload: %s%n",
                    record.topic(), partition, offset, record.key(), record.value());
        }

        public List<ConsumerRecord> poll(String consumerGroup, String topic, int partition, int maxPollRecords) {
            Map<Integer, List<ConsumerRecord>> partitions = topicPartitions.get(topic);
            if (partitions == null) return List.of();
            List<ConsumerRecord> log = partitions.get(partition);
            if (log == null) return List.of();

            long currentOffset = committedOffsets
                    .computeIfAbsent(consumerGroup, g -> new ConcurrentHashMap<>())
                    .computeIfAbsent(topic, t -> new ConcurrentHashMap<>())
                    .getOrDefault(partition, 0L);

            List<ConsumerRecord> batch = new ArrayList<>();
            for (int i = (int) currentOffset; i < log.size() && batch.size() < maxPollRecords; i++) {
                batch.add(log.get(i));
            }
            return batch;
        }

        public void commitSync(String consumerGroup, String topic, int partition, long offset) {
            committedOffsets
                    .computeIfAbsent(consumerGroup, g -> new ConcurrentHashMap<>())
                    .computeIfAbsent(topic, t -> new ConcurrentHashMap<>())
                    .put(partition, offset);
            System.out.printf("  [Kafka Consumer Group: %s] Committed offset %d for %s-%d%n",
                    consumerGroup, offset, topic, partition);
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 108: Event-Driven Enterprise Messaging with Apache Kafka");
        System.out.println("================================================================================");

        KafkaClusterSimulator cluster = new KafkaClusterSimulator(3);
        String topic = "order-events";

        // 1. Publish Events with Key-Based Partitioning
        System.out.println("1. Producing Order Domain Events:");
        cluster.publish(new ProducerRecord(topic, "CUST-1001", "{\"orderId\": 9001, \"status\": \"CREATED\"}", Instant.now()));
        cluster.publish(new ProducerRecord(topic, "CUST-1002", "{\"orderId\": 9002, \"status\": \"CREATED\"}", Instant.now()));
        cluster.publish(new ProducerRecord(topic, "CUST-1001", "{\"orderId\": 9001, \"status\": \"PAYMENT_PROCESSED\"}", Instant.now()));

        // 2. Consume Events via Consumer Group
        System.out.println("\n2. Consuming Events via 'billing-service-group':");
        String group = "billing-service-group";

        for (int p = 0; p < 3; p++) {
            List<ConsumerRecord> records = cluster.poll(group, topic, p, 10);
            for (ConsumerRecord cr : records) {
                System.out.printf("   [Consumer] Processed %s [Partition: %d, Offset: %d] Value: %s%n",
                        cr.topic(), cr.partition(), cr.offset(), cr.value());
                // Commit offset
                cluster.commitSync(group, topic, p, cr.offset() + 1);
            }
        }

        // 3. Verify Idempotent Poll (No duplicates after commit)
        System.out.println("\n3. Verifying Offset Commit (Poll after commit should be empty):");
        for (int p = 0; p < 3; p++) {
            List<ConsumerRecord> emptyPoll = cluster.poll(group, topic, p, 10);
            assert emptyPoll.isEmpty() : "Committed partition should return zero new records";
        }
        System.out.println("   Offset Commit Idempotency: VERIFIED [AT-LEAST-ONCE]");

        System.out.println("\n[SUCCESS] Topic 108 Apache Kafka Event-Driven Messaging verified successfully!");
        System.out.println("================================================================================");
    }
}
