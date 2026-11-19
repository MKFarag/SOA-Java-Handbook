package com.handbook.spring;

import java.util.*;

/**
 * Section 30 - Topic 102: Versioned Database Migrations with Flyway
 * 
 * Demonstrates:
 * 1. Flyway migration naming conventions (V1__init.sql, V2__add_index.sql, R__views.sql).
 * 2. Flyway metadata table simulation (`flyway_schema_history`).
 * 3. Checksum generation and tamper detection (preventing modified past migrations).
 * 4. Deterministic sequential migration execution and baseline state tracking.
 */
public class FlywayMigrationDemo {

    public record MigrationScript(String version, String description, String sql, int checksum) {}

    public record SchemaHistoryEntry(int installedRank, String version, String description, String type, String script, int checksum, boolean success) {}

    public static class FlywayEngine {
        private final List<SchemaHistoryEntry> schemaHistory = new ArrayList<>();
        private final Set<String> appliedTables = new HashSet<>();

        public void migrate(List<MigrationScript> scripts) {
            // Sort scripts by version
            List<MigrationScript> sorted = new ArrayList<>(scripts);
            sorted.sort(Comparator.comparing(MigrationScript::version));

            for (MigrationScript script : sorted) {
                // Check if already applied
                Optional<SchemaHistoryEntry> existing = schemaHistory.stream()
                        .filter(h -> h.version().equals(script.version()))
                        .findFirst();

                if (existing.isPresent()) {
                    // Checksum verification
                    if (existing.get().checksum() != script.checksum()) {
                        throw new IllegalStateException(String.format(
                                "Flyway Validation Failed: Migration %s checksum mismatch! Applied: %d, New: %d",
                                script.version(), existing.get().checksum(), script.checksum()));
                    }
                    System.out.printf("  [Flyway] Migration %s (%s) is up to date (Skipping).\n", script.version(), script.description());
                    continue;
                }

                // Apply migration
                System.out.printf("  [Flyway] Applying migration %s: %s\n", script.version(), script.description());
                applySql(script.sql());

                int rank = schemaHistory.size() + 1;
                schemaHistory.add(new SchemaHistoryEntry(
                        rank,
                        script.version(),
                        script.description(),
                        "SQL",
                        "V" + script.version() + "__" + script.description().replace(" ", "_") + ".sql",
                        script.checksum(),
                        true
                ));
            }
        }

        private void applySql(String sql) {
            if (sql.contains("CREATE TABLE")) {
                String table = sql.split("CREATE TABLE")[1].trim().split(" ")[0];
                appliedTables.add(table);
            }
        }

        public List<SchemaHistoryEntry> getSchemaHistory() { return schemaHistory; }
        public Set<String> getAppliedTables() { return appliedTables; }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 102: Versioned Database Migrations with Flyway");
        System.out.println("================================================================================");

        FlywayEngine flyway = new FlywayEngine();

        // 1. Initial Migration Pipeline
        List<MigrationScript> initialScripts = List.of(
                new MigrationScript("1.0", "create_users_table", "CREATE TABLE users (id BIGINT PRIMARY KEY, name VARCHAR(100));", 10101),
                new MigrationScript("1.1", "create_orders_table", "CREATE TABLE orders (id BIGINT PRIMARY KEY, user_id BIGINT);", 20202)
        );

        System.out.println("1. Running Initial Flyway Database Migration:");
        flyway.migrate(initialScripts);
        assert flyway.getSchemaHistory().size() == 2;
        assert flyway.getAppliedTables().containsAll(Set.of("users", "orders"));

        // 2. Subsequent Migration with New Script
        List<MigrationScript> updatedScripts = List.of(
                new MigrationScript("1.0", "create_users_table", "CREATE TABLE users (id BIGINT PRIMARY KEY, name VARCHAR(100));", 10101),
                new MigrationScript("1.1", "create_orders_table", "CREATE TABLE orders (id BIGINT PRIMARY KEY, user_id BIGINT);", 20202),
                new MigrationScript("1.2", "create_payments_table", "CREATE TABLE payments (id BIGINT PRIMARY KEY, amount NUMERIC);", 30303)
        );

        System.out.println("\n2. Running Flyway Migration with Incremental Script V1.2:");
        flyway.migrate(updatedScripts);
        assert flyway.getSchemaHistory().size() == 3;
        assert flyway.getAppliedTables().contains("payments");

        // 3. Tamper Detection Checksum Mismatch
        System.out.println("\n3. Testing Checksum Validation on Modified Past Migration:");
        List<MigrationScript> tamperedScripts = List.of(
                new MigrationScript("1.0", "create_users_table", "CREATE TABLE users (id BIGINT PRIMARY KEY, name VARCHAR(100));", 99999) // Altered checksum!
        );

        try {
            flyway.migrate(tamperedScripts);
            assert false : "Flyway should have rejected tampered migration checksum";
        } catch (IllegalStateException ex) {
            System.out.println("   Caught expected Flyway Validation Error: " + ex.getMessage());
        }

        System.out.println("\n[SUCCESS] Topic 102 Flyway Database Migrations verified successfully!");
        System.out.println("================================================================================");
    }
}
