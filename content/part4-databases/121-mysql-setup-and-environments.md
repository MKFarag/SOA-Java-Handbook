---
id: topic-121
slug: mysql-setup-and-environments
topicNumber: 121
title: 'MySQL Setup & Environments: Local XAMPP, phpMyAdmin & Docker'
part: 'Part 4: Database Systems & Persistence'
sectionNumber: 38
sectionTitle: Relational Database Essentials & SQL
versionBadge: MySQL 8.x / MariaDB
difficulty: Beginner
readingTime: 8 min read
shortDescription: >-
  Quickly set up local MySQL environments using XAMPP and phpMyAdmin or Docker,
  configure default credentials, ports, and character encoding.
prerequisites:
  - 'Topic 120: Relational Database Fundamentals: Tables, Columns, Rows & Keys'
relevanceLevel: MUST-KNOW / CORE
---
# Topic 121: MySQL Setup & Environments: Local XAMPP, phpMyAdmin & Docker

> 🎯 **Roadmap Seal:** **`[MUST-KNOW / CORE]`** — *Essential modern foundation required for backend roles. Master this thoroughly.*

## 1. What It Is and Why It Exists

**MySQL** is the most widely deployed open-source relational database in the world, powering backend systems from startups to global platforms (such as GitHub, Shopify, and Uber). To develop Java applications locally, you need a running MySQL server and an interface to run queries and manage tables visually.

You have two primary setup options for local development:
1. **XAMPP with phpMyAdmin (Fastest visual setup for beginners):** All-in-one GUI installer bundling Apache, MySQL/MariaDB, and a browser-based database manager.
2. **Docker Container (Cleanest modern setup):** Runs MySQL inside an isolated lightweight container without modifying your local operating system.

---

## 2. Option A: Setup via XAMPP & phpMyAdmin

### Step 1: Install & Launch
1. Download **XAMPP** for Windows or macOS from [apachefriends.org](https://www.apachefriends.org/).
2. Run the installer and ensure **MySQL** and **phpMyAdmin** components are checked.
3. Open the **XAMPP Control Panel**.
4. Click **Start** next to **Apache** (serves phpMyAdmin) and **MySQL** (database engine). Both turn green when active.

```text
+-------------------------------------------------------------+
| XAMPP Control Panel                                         |
+-------------------------------------------------------------+
| Module    | PID(s) | Port(s)   | Actions                    |
| Apache    |  4280  | 80, 443   | [Stop] [Admin] [Config]    |
| MySQL     |  8192  | 3306      | [Stop] [Admin] [Config]    |
+-------------------------------------------------------------+
```

### Step 2: Access phpMyAdmin
1. Open your web browser and navigate to:
   ```text
   http://localhost/phpmyadmin
   ```
2. You will see the visual dashboard where you can create databases, view tables, and execute SQL statements in the **SQL** tab.

### Default Local XAMPP Credentials for Java Development
- **Host:** `localhost` (or `127.0.0.1`)
- **Port:** `3306`
- **Username:** `root`
- **Password:** `""` (Empty string by default)
- **JDBC URL Example:** `jdbc:mysql://localhost:3306/my_database?serverTimezone=UTC`

---

## 3. Option B: Setup via Docker Container

If you have Docker Desktop installed, running MySQL requires a single command:

```bash
docker run --name mysql-dev \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=app_db \
  -p 3306:3306 \
  -d mysql:8.4
```

### Explanation of Docker Flags:
- `--name mysql-dev`: Assigns an easy name to reference the container.
- `-e MYSQL_ROOT_PASSWORD=secret`: Sets the `root` administrative password.
- `-e MYSQL_DATABASE=app_db`: Automatically creates a starter database named `app_db`.
- `-p 3306:3306`: Forwards host port `3306` into container port `3306`.
- `-d mysql:8.4`: Runs the official MySQL 8.4 LTS image in the background (detached mode).

To verify the container is running:
```bash
docker ps
```

---

## 4. Creating Your First Database

In phpMyAdmin or your SQL client (e.g., MySQL Workbench, DBeaver, IntelliJ Database Tool), execute:

```sql
CREATE DATABASE IF NOT EXISTS enterprise_shop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE enterprise_shop;
```

> [!TIP] Always Use `utf8mb4` Encoding
> Standard `utf8` in MySQL only allocates up to 3 bytes per character, failing on emojis, rare Unicode glyphs, and supplementary characters. **Always use `utf8mb4`** for complete UTF-8 compliance.
