package com.handbook.databases;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

/**
 * Section 39 - Topic 134: Java MongoDB Persistence (Spring Data MongoDB & Complete Connection Properties)
 * 
 * Demonstrates:
 * 1. MongoDB Connection URI parser and verification of cluster replica/pool properties.
 * 2. Spring Data Object-Document Mapping (ODM) engine simulation (@Document, @Field, @Transient).
 * 3. Spring Data `MongoRepository` derived query method evaluator.
 * 4. `MongoTemplate` Dynamic Criteria Query and In-Place Atomic Updates simulation.
 */
public class JavaMongoDbPersistencePropertiesDemo {

    // =========================================================================
    // 1. MONGODB CONNECTION URI & CLUSTER CONFIG PARSER
    // =========================================================================
    public record ParsedMongoUri(
            String scheme,
            String credentials,
            List<String> hosts,
            String database,
            Map<String, String> options
    ) {
        public static ParsedMongoUri parse(String uri) {
            String scheme = uri.startsWith("mongodb+srv://") ? "mongodb+srv://" : "mongodb://";
            String remainder = uri.substring(scheme.length());

            String credentials = null;
            int atIndex = remainder.indexOf('@');
            if (atIndex != -1) {
                credentials = remainder.substring(0, atIndex);
                remainder = remainder.substring(atIndex + 1);
            }

            int slashIndex = remainder.indexOf('/');
            String hostPart = (slashIndex != -1) ? remainder.substring(0, slashIndex) : remainder;
            List<String> hosts = Arrays.asList(hostPart.split(","));

            String dbPart = (slashIndex != -1) ? remainder.substring(slashIndex + 1) : "";
            int qIndex = dbPart.indexOf('?');
            String database = (qIndex != -1) ? dbPart.substring(0, qIndex) : dbPart;

            Map<String, String> options = new LinkedHashMap<>();
            if (qIndex != -1) {
                String queryString = dbPart.substring(qIndex + 1);
                for (String param : queryString.split("&")) {
                    String[] kv = param.split("=");
                    options.put(kv[0], kv.length > 1 ? kv[1] : "");
                }
            }
            return new ParsedMongoUri(scheme, credentials, hosts, database, options);
        }
    }

    // =========================================================================
    // 2. DOMAIN MODEL & ODM (OBJECT-DOCUMENT MAPPING) SIMULATION
    // =========================================================================
    public static class ProductDocument {
        private String id;
        private String sku;
        private String name;
        private String category;
        private BigDecimal price;
        private int stock;
        private List<String> tags;
        private boolean active;
        private Instant createdAt;
        // Transient field that should NEVER be converted to BSON
        private String volatileSessionToken;

        public ProductDocument(String id, String sku, String name, String category, BigDecimal price, int stock, List<String> tags) {
            this.id = id;
            this.sku = sku;
            this.name = name;
            this.category = category;
            this.price = price;
            this.stock = stock;
            this.tags = tags;
            this.active = true;
            this.createdAt = Instant.now();
            this.volatileSessionToken = "TEMP_TOKEN_XYZ";
        }

        // Simulates Spring Data MappingMongoConverter: POJO -> BSON Map
        public Map<String, Object> toBsonMap() {
            Map<String, Object> bson = new LinkedHashMap<>();
            bson.put("_id", this.id);
            bson.put("sku", this.sku);
            bson.put("name", this.name);
            bson.put("category", this.category);
            bson.put("price", this.price.doubleValue());
            bson.put("stock", this.stock);
            bson.put("tags", this.tags);
            bson.put("is_active", this.active);
            bson.put("created_at", this.createdAt.toString());
            // Notice: volatileSessionToken is excluded because of @Transient
            return bson;
        }

        public String getSku() { return sku; }
        public String getCategory() { return category; }
        public BigDecimal getPrice() { return price; }
        public int getStock() { return stock; }
        public void setStock(int s) { this.stock = s; }
    }

    // =========================================================================
    // 3. SPRING DATA MONGOREPOSITORY PROXY SIMULATOR
    // =========================================================================
    public static class SimpleMongoRepositorySimulator {
        private final Map<String, ProductDocument> storage = new HashMap<>();

        public void save(ProductDocument doc) { storage.put(doc.getSku(), doc); }

        // Derived Query: findByCategoryAndPriceLessThanEqual(String category, BigDecimal maxPrice)
        public List<ProductDocument> findByCategoryAndPriceLessThanEqual(String category, BigDecimal maxPrice) {
            List<ProductDocument> matches = new ArrayList<>();
            for (ProductDocument p : storage.values()) {
                if (p.getCategory().equalsIgnoreCase(category) && p.getPrice().compareTo(maxPrice) <= 0) {
                    matches.add(p);
                }
            }
            return matches;
        }

        // MongoTemplate Atomic Update: query by SKU, deduct stock if >= quantity
        public boolean atomicDeductStock(String sku, int quantity) {
            ProductDocument doc = storage.get(sku);
            if (doc != null && doc.getStock() >= quantity) {
                doc.setStock(doc.getStock() - quantity);
                System.out.printf("  [MongoTemplate] In-place atomic update: Deducted %d units from SKU '%s'. New Stock: %d\n",
                        quantity, sku, doc.getStock());
                return true;
            }
            System.out.printf("  [MongoTemplate] Update rejected: Insufficient stock for SKU '%s' (Req: %d, Available: %d)\n",
                    sku, quantity, (doc != null ? doc.getStock() : 0));
            return false;
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println(" Topic 134: Java MongoDB Persistence (Spring Data & Properties) Demo          ");
        System.out.println("================================================================================\n");

        // 1. Production MongoDB Connection URI Parsing
        System.out.println("--- 1. MongoDB Connection URI & Cluster Replica Options ---");
        String uri = "mongodb://app_user:SecretP%40ss@node1:27017,node2:27017/enterprise_shop?authSource=admin&replicaSet=rs0&readPreference=secondaryPreferred&w=majority&maxPoolSize=50";
        ParsedMongoUri parsed = ParsedMongoUri.parse(uri);

        System.out.printf("  Scheme: %s | Database: %s | Hosts: %s\n", parsed.scheme(), parsed.database(), parsed.hosts());
        System.out.println("  Decoded Connection Options:");
        parsed.options().forEach((k, v) -> System.out.printf("    - %-22s = %s\n", k, v));

        // 2. Spring Data Object-Document Mapping (ODM) Conversion
        System.out.println("\n--- 2. Spring Data ODM Conversion (POJO -> BSON Document) ---");
        ProductDocument laptop = new ProductDocument(
                "664e10f92b498a3b8417c801",
                "LAPTOP-X1",
                "ThinkPad Carbon X1",
                "Electronics",
                new BigDecimal("1899.99"),
                25,
                List.of("laptop", "ultrabook", "business")
        );

        Map<String, Object> bsonPayload = laptop.toBsonMap();
        System.out.println("  Serialized BSON Map (Notice volatileSessionToken omitted via @Transient):");
        bsonPayload.forEach((k, v) -> System.out.printf("    %-12s : %s\n", k, v));

        // 3. MongoRepository Query & Dynamic Update Simulation
        System.out.println("\n--- 3. Spring Data MongoRepository & MongoTemplate Operations ---");
        SimpleMongoRepositorySimulator repo = new SimpleMongoRepositorySimulator();
        repo.save(laptop);
        repo.save(new ProductDocument("664e10f92b498a3b8417c802", "MONITOR-4K", "Dell 4K Monitor", "Electronics", new BigDecimal("649.50"), 40, List.of("monitor")));
        repo.save(new ProductDocument("664e10f92b498a3b8417c803", "KB-MECH", "Mechanical Keyboard", "Accessories", new BigDecimal("199.00"), 15, List.of("keyboard")));

        System.out.println("  Executing Derived Query: findByCategoryAndPriceLessThanEqual('Electronics', $1000.00):");
        List<ProductDocument> matches = repo.findByCategoryAndPriceLessThanEqual("Electronics", new BigDecimal("1000.00"));
        for (ProductDocument match : matches) {
            System.out.printf("    Match: %s ($%s) - Category: %s\n", match.getSku(), match.getPrice(), match.getCategory());
        }

        // Test in-place atomic update
        System.out.println("\n  Executing Atomic Stock Deduction:");
        repo.atomicDeductStock("LAPTOP-X1", 5);
        repo.atomicDeductStock("LAPTOP-X1", 100); // Exceeds stock

        System.out.println("\n[SUCCESS] Topic 134 Java MongoDB Persistence Demo executed cleanly.");
    }
}
