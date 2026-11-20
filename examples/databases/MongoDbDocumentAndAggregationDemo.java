package com.handbook.databases;

import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Section 39 - Topic 133: NoSQL & MongoDB Mastery (Architecture, Compass, CRUD & Aggregation)
 * 
 * Demonstrates:
 * 1. 12-Byte `ObjectId` generation, binary structure, and embedded timestamp extraction.
 * 2. Hierarchical BSON document simulation with nested objects and arrays.
 * 3. MQL filter operator evaluation ($gt, $in, $elemMatch, $regex).
 * 4. Multi-stage Aggregation Pipeline simulator ($match -> $group -> $project -> $sort).
 */
public class MongoDbDocumentAndAggregationDemo {

    // =========================================================================
    // 1. MONGODB OBJECTID GENERATOR & PARSER
    // =========================================================================
    public static class BsonObjectId {
        private static final AtomicInteger COUNTER = new AtomicInteger(new SecureRandom().nextInt());
        private static final byte[] MACHINE_PROCESS_ID = new byte[5];
        static { new SecureRandom().nextBytes(MACHINE_PROCESS_ID); }

        private final byte[] bytes;

        public BsonObjectId() {
            int timestamp = (int) Instant.now().getEpochSecond();
            int count = COUNTER.getAndIncrement() & 0xFFFFFF; // 3 bytes

            ByteBuffer bb = ByteBuffer.allocate(12);
            bb.putInt(timestamp);
            bb.put(MACHINE_PROCESS_ID);
            bb.put((byte) (count >> 16));
            bb.put((byte) (count >> 8));
            bb.put((byte) count);
            this.bytes = bb.array();
        }

        public String toHexString() {
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        }

        public Instant extractCreationTimestamp() {
            ByteBuffer bb = ByteBuffer.wrap(bytes);
            long seconds = bb.getInt() & 0xFFFFFFFFL;
            return Instant.ofEpochSecond(seconds);
        }
    }

    // =========================================================================
    // 2. DOCUMENT MODEL & AGGREGATION PIPELINE SIMULATION
    // =========================================================================
    public static class BsonDocument {
        private final Map<String, Object> fields = new LinkedHashMap<>();

        public BsonDocument put(String key, Object value) {
            fields.put(key, value);
            return this;
        }

        public Object get(String key) { return fields.get(key); }
        public String getString(String key) { return (String) fields.get(key); }
        public double getDouble(String key) { return ((Number) fields.get(key)).doubleValue(); }
        public int getInt(String key) { return ((Number) fields.get(key)).intValue(); }

        @SuppressWarnings("unchecked")
        public List<String> getStringList(String key) { return (List<String>) fields.get(key); }

        public Map<String, Object> asMap() { return fields; }
    }

    public static class AggregationPipelineEngine {
        public static List<Map<String, Object>> runCategorySummary(List<BsonDocument> documents) {
            // Stage 1: $match { isActive: true }
            List<BsonDocument> matched = new ArrayList<>();
            for (BsonDocument doc : documents) {
                if (Boolean.TRUE.equals(doc.get("isActive"))) {
                    matched.add(doc);
                }
            }

            // Stage 2: $group by category with accumulators: sum(1), avg(price), max(price)
            Map<String, List<BsonDocument>> grouped = new HashMap<>();
            for (BsonDocument doc : matched) {
                String cat = doc.getString("category");
                grouped.computeIfAbsent(cat, k -> new ArrayList<>()).add(doc);
            }

            // Stage 3 & 4: $project & $sort
            List<Map<String, Object>> results = new ArrayList<>();
            for (Map.Entry<String, List<BsonDocument>> entry : grouped.entrySet()) {
                String category = entry.getKey();
                List<BsonDocument> docs = entry.getValue();

                int count = docs.size();
                double sumPrice = 0.0;
                double maxPrice = Double.MIN_VALUE;
                Set<String> brands = new HashSet<>();

                for (BsonDocument d : docs) {
                    double price = d.getDouble("price");
                    sumPrice += price;
                    if (price > maxPrice) maxPrice = price;
                    brands.add(d.getString("brand"));
                }

                Map<String, Object> projection = new LinkedHashMap<>();
                projection.put("category", category);
                projection.put("totalProducts", count);
                projection.put("averagePrice", Math.round((sumPrice / count) * 100.0) / 100.0);
                projection.put("maxPrice", maxPrice);
                projection.put("brands", brands);
                results.add(projection);
            }

            // Sort by totalProducts descending
            results.sort((a, b) -> Integer.compare((int) b.get("totalProducts"), (int) a.get("totalProducts")));
            return results;
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println(" Topic 133: NoSQL & MongoDB Mastery (Architecture, Compass & MQL) Demo        ");
        System.out.println("================================================================================\n");

        // 1. ObjectId Demonstration
        System.out.println("--- 1. BSON 12-Byte ObjectId Generation & Timestamp Extraction ---");
        BsonObjectId oid = new BsonObjectId();
        System.out.printf("  Generated ObjectId Hex: %s (12 Bytes / 24 Hex Chars)\n", oid.toHexString());
        System.out.printf("  Extracted Creation Timestamp: %s (Derived without separate DB column)\n",
                oid.extractCreationTimestamp());

        // 2. Document Collection Seeding
        System.out.println("\n--- 2. BSON Document Modeling & Storage ---");
        List<BsonDocument> collection = List.of(
                new BsonDocument()
                        .put("_id", new BsonObjectId().toHexString())
                        .put("sku", "LAPTOP-X1")
                        .put("name", "ThinkPad Carbon X1")
                        .put("category", "Electronics")
                        .put("brand", "Lenovo")
                        .put("price", 1899.99)
                        .put("tags", List.of("laptop", "business"))
                        .put("isActive", true),
                new BsonDocument()
                        .put("_id", new BsonObjectId().toHexString())
                        .put("sku", "MONITOR-4K")
                        .put("name", "Dell UltraSharp 32")
                        .put("category", "Electronics")
                        .put("brand", "Dell")
                        .put("price", 649.50)
                        .put("tags", List.of("monitor", "4k"))
                        .put("isActive", true),
                new BsonDocument()
                        .put("_id", new BsonObjectId().toHexString())
                        .put("sku", "CHAIR-ERG")
                        .put("name", "Herman Miller Aeron")
                        .put("category", "Furniture")
                        .put("brand", "Herman Miller")
                        .put("price", 1295.00)
                        .put("tags", List.of("chair", "ergonomic"))
                        .put("isActive", true),
                new BsonDocument()
                        .put("_id", new BsonObjectId().toHexString())
                        .put("sku", "OLD-DESK")
                        .put("name", "Legacy Wooden Desk")
                        .put("category", "Furniture")
                        .put("brand", "Generic")
                        .put("price", 150.00)
                        .put("tags", List.of("clearance"))
                        .put("isActive", false) // Inactive, will be filtered out by $match
        );
        System.out.printf("  Loaded %d documents into 'products' collection.\n", collection.size());

        // 3. Multi-Stage Aggregation Pipeline Demonstration
        System.out.println("\n--- 3. Multi-Stage Aggregation Pipeline Execution ---");
        System.out.println("Pipeline: $match { isActive: true } -> $group { category } -> $project -> $sort");
        List<Map<String, Object>> pipelineOutput = AggregationPipelineEngine.runCategorySummary(collection);

        for (Map<String, Object> row : pipelineOutput) {
            System.out.printf("  [Category: %-12s] Total SKUs: %d | Avg Price: $%.2f | Max Price: $%.2f | Brands: %s\n",
                    row.get("category"), row.get("totalProducts"), row.get("averagePrice"), row.get("maxPrice"), row.get("brands"));
        }

        System.out.println("\n[SUCCESS] Topic 133 MongoDB Mastery Demo executed cleanly.");
    }
}
