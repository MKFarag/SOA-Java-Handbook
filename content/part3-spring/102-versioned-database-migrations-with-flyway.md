---
id: 102
title: "Versioned Database Migrations with Flyway"
sectionId: 30
part: "Part 3: Spring Boot & The Modern Production Ecosystem"
order: 102
summary: "Master automated database schema evolution in Spring Boot using Flyway: versioned migration naming rules, flyway_schema_history checksum verification, repeatable migrations, and zero-downtime blue/green deployment strategies."
keyTakeaways:
  - "Flyway enforces version-controlled, reproducible database migrations, eliminating fragile manual SQL script execution across staging and production environments."
  - "Versioned migrations (`V{version}__{description}.sql`) execute exactly once in strict chronological order and are permanently tracked in `flyway_schema_history`."
  - "Flyway calculates a cryptographic checksum (CRC32/SHA-256) for every applied migration; modifying a previously applied migration script causes startup failure to prevent schema drift."
  - "Repeatable migrations (`R__{description}.sql`) execute whenever their script checksum changes, making them ideal for database views, stored procedures, and triggers."
---

# Versioned Database Migrations with Flyway

In production software engineering, application source code is versioned with Git, but databases possess mutable state. Relying on Hibernate's `spring.jpa.hibernate.ddl-auto=update` in production is an anti-pattern that causes data corruption and schema divergence. **Flyway** provides reliable, automated database schema versioning that runs seamlessly during application bootstrap.

---

## 1. Migration Script Naming Conventions

Flyway scans `src/main/resources/db/migration` for scripts adhering to standard prefix conventions:

```
V1_0__create_users_table.sql
[-] [---] [-----------------] [--]
pre ver       description     ext
```

1. **Prefix**:
   - `V`: Versioned migration (executes exactly once in version order).
   - `U`: Undo migration (reverts corresponding versioned migration).
   - `R`: Repeatable migration (re-runs whenever its contents change).
2. **Version**: Dots or underscores separate version numbers (`1`, `1.1`, `2.0.1`).
3. **Separator**: Two underscores (`__`).
4. **Description**: Human-readable label separated by single underscores or spaces.
5. **Suffix**: `.sql`.

---

## 2. The `flyway_schema_history` Table

On the first migration run, Flyway creates an internal tracking table in the database:

| installed_rank | version | description | type | script | checksum | success |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `1.0` | `create_users_table` | `SQL` | `V1_0__create_users_table.sql` | `10101` | `true` |
| `2` | `1.1` | `create_orders_table` | `SQL` | `V1_1__create_orders_table.sql` | `20202` | `true` |

When a new application instance starts up:
1. Flyway queries `flyway_schema_history`.
2. It re-computes the checksum of all local migration files and compares them against applied records.
3. If an applied script was modified, Flyway **aborts application startup immediately** to prevent silent schema drift.
4. Unapplied scripts are executed sequentially inside isolated database transactions.

---

## 3. Zero-Downtime Migration Pattern (Expand / Contract)

In continuous deployment (CI/CD) environments, database migrations must never break currently running older instances during rolling deployments:

```mermaid
flowchart TD
    subgraph Step 1: Expand
        A["Deploy V1.1: Add new nullable column 'full_name'"]
        B["Application writes to both 'name' and 'full_name'"]
    end

    subgraph Step 2: Backfill
        C["Run background migration script backfilling existing rows"]
    end

    subgraph Step 3: Switch
        D["Deploy V1.2: Application reads exclusively from 'full_name'"]
    end

    subgraph Step 4: Contract
        E["Deploy V1.3: Drop old legacy column 'name'"]
    end

    Step 1 --> Step 2 --> Step 3 --> Step 4
```

---

## 4. Verification & Architecture Demo

The executable architecture demo `examples/spring/FlywayMigrationDemo.java` implements:
- `FlywayEngine` maintaining versioned scripts and schema history rank.
- Checksum verification preventing tampering with already applied past migrations.
- Sequential application of new migrations (`V1.0` -> `V1.1` -> `V1.2`).

Compile and run the verified test:
```bash
javac -d examples/web/classes examples/spring/FlywayMigrationDemo.java
java -ea -cp examples/web/classes com.handbook.spring.FlywayMigrationDemo
```
