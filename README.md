# NTI Java & SOA Master Interactive Handbook (Offline-First)

> **A comprehensive, offline-first reference and learning platform covering Java 21 LTS (Java 25 Ready), Jakarta EE 10, Spring Boot 3.x, and Database Systems (MySQL & MongoDB).**  
> Designed as a junior-friendly, practical technical reference for software engineers.
>
> **Architect & Author:** **Mohamed Khaled Farag**  
> 🔗 **LinkedIn:** [linkedin.com/in/mk-farag](https://www.linkedin.com/in/mk-farag/)  
> ✉️ **Email:** [mohammedkhaled.fa@gmail.com](mailto:mohammedkhaled.fa@gmail.com)  
> 🐙 **GitHub:** [github.com/MKFarag/SOA-Java-Handbook](https://github.com/MKFarag/SOA-Java-Handbook)  
> 🐳 **Docker Hub:** [hub.docker.com/r/mkfarag/mkf-soa-java-handbook](https://hub.docker.com/r/mkfarag/mkf-soa-java-handbook)

---

## 🌟 Key Features

- **100% Offline-First:** Zero runtime CDN dependencies, zero external font fetches. Everything runs directly on your local machine or container.
- **Cross-Device Cloud Progress Sync:** Seamlessly save and resume your progress across PC, laptop, and mobile using a lightweight unique student code without passwords or emails (Firebase Firestore).
- **Official Completion Certificate & Security Gate:** Interactive, print-ready, and exportable verified Certificate of Technical Mastery issued exclusively upon completing the complete 127-module curriculum or instructor verification.
- **Confidential Instructor & Admin Portal:** Secret command center (`Ctrl + Shift + A` or `#admin`) protected by master authentication, featuring real-time student roster, progress metrics, CSV export, and security audit logs.
- **Live Broadcasts & Shared Resources:** Instructor broadcast system for pushing Google Drive folders, project assignments, tasks, and notices to all learners with interactive notification badges.
- **VS Code Dark+ & Light Paper Themes:** Built to match developer ergonomics with a deep `#18181b` slate theme, calm neutral reference tables, and crisp light paper mode.
- **Offline Full-Text Search:** Sub-millisecond client-side indexing powered by MiniSearch with instant keyword matching, fuzzy tolerance, and `Ctrl + K` shortcut.
- **Dual-Tab Code Blocks:** Switch between Java source code and exact terminal/console output with one-click copy buttons.
- **Interactive Exercises & Capstones:** Multi-tiered Capstone projects and milestone challenges per topic with click-to-reveal solution panels.
- **Local JDK & Apache Tomcat Verification:** Every code snippet is compiled against Java 21 LTS / 25 LTS and Apache Tomcat 10.1.x with 197 automated test suites passed (100% pass rate: 0 failed, 0 skipped).

---

## 🚀 Quick Start (Two Ways to Run the Project)

### 1. Instant Run via Docker (Zero Configuration & No Node.js Required)
If you have Docker installed, run the following command directly in your terminal:
```bash
docker run -d -p 3000:80 --name mkf_soa_java_handbook mkfarag/mkf-soa-java-handbook:latest
```
Then open your browser at: **[http://localhost:3000](http://localhost:3000)**.

---

### 2. Run from Source Code (Git Clone)
To run and develop locally from source:
```bash
# 1. Clone the repository
git clone https://github.com/MKFarag/SOA-Java-Handbook.git
cd SOA-Java-Handbook

# 2. Install dependencies and start development server
npm install
npm run dev
# Run production smoke test regression guard:
npm run test:smoke
```
Then open your browser at: **[http://localhost:5173](http://localhost:5173)**.

> **Note:** You can also download the project as a **ZIP** archive directly by clicking **Code** > **Download ZIP** on GitHub, extracting the archive, and running `npm install && npm run dev`.

---

## 📚 Syllabus & Four-Domain Architecture (131 Topics)

The handbook is structured as a **Junior-Friendly, Practical Technical Reference Handbook** across exactly four core domains:

- **Part 1: Java SE Core (Sections 1–16, Topics 01–62):**
  - Foundations, Compilation, JDK vs JRE vs JVM
  - Primitives, Operators, Type Casting, Strings, Text Blocks, Output & Formatting (`printf`, `String.format`)
  - Console Input (`Scanner`) & Math Utilities (`Math`, `BigDecimal`)
  - Control Flow, Modern Switch Expressions, Loops
  - Methods, Overloading, Scope, `var`
  - Arrays, Object-Oriented Programming (OOP) Essentials
  - Inheritance, Polymorphism, Abstract Classes, Interfaces
  - Modern Java: Records, Sealed Classes, Pattern Matching (Java 21 LTS baseline)
  - Exception Handling, Try-With-Resources
  - Generics, Wildcards (PECS), Collections Framework (List, Set, Map, Deque)
  - Lambdas, Functional Interfaces, Stream API, Optional
  - File I/O, NIO.2, Date/Time API (`java.time`)
  - Concurrency, Locks, Thread Pools, CompletableFuture, Virtual Threads, Structured Concurrency
  - JVM Internals: Memory Model (JMM), Garbage Collection (G1, ZGC), JIT, ClassLoaders
  - Reflection, Annotations, Java Platform Module System (JPMS)
  - JDBC Fundamentals and Build Automation (Maven / Gradle)

- **Part 2: Jakarta EE (Sections 17–23, Topics 63–87):**
  - The Great Transition: `javax.*` to `jakarta.*` namespace migration
  - Web Architecture & HTTP protocol fundamentals
  - Apache Tomcat container architecture and WAR packaging
  - Servlets Deep Dive: Lifecycle (`init`, `service`, `destroy`), Request/Response processing API reference tables, Annotations vs `web.xml`, Dispatching (Forward vs Redirect)
  - State Management: Sessions, Cookies, Filters, Listeners, Web Security (CSRF, XSS)
  - JavaServer Pages (JSP) & Templating: Translation lifecycle, Directives, Scriptlets, EL, JSTL `[OPTIONAL / LEGACY]`
  - The Web MVC Pattern, Form Handling, Multipart Uploads, Error Pages, JNDI Connection Pooling
  - Jakarta EE Enterprise Stack: JPA, CDI, JAX-RS, Bean Validation, JSF, EJB `[OPTIONAL / LEGACY]`

- **Part 3: Spring Boot Backend Stack (Sections 24–34, Topics 88–119):**
  - Spring Framework Core: Inversion of Control, `BeanFactory` vs `ApplicationContext`
  - Component Scanning, Injection Strategies, Bean Lifecycle Callbacks (`@PostConstruct`, `@PreDestroy`)
  - Spring Boot Architecture: Auto-Configuration mechanics, Starters, Embedded Runtimes (Tomcat/Netty)
  - Externalized Configuration: YAML hierarchies, Multi-Profile deployment (`@ConfigurationProperties`)
  - Production REST Controller Architecture: Spring Web MVC, DTO patterns, HTTP status ergonomics
  - Declarative Request Validation: Jakarta Bean Validation constraints, Custom validators
  - Centralized Global Exception Handling: `@RestControllerAdvice` and RFC 7807 Problem Details
  - Spring Data JPA: Repository hierarchies (`JpaRepository`), Derived queries, Dynamic projections, JPQL `@Query`
  - Declarative `@Transactional` Boundaries, Pagination, Sorting, and N+1 prevention (`@EntityGraph`, JOIN FETCH)
  - Enterprise Security with Spring Security 6: `SecurityFilterChain`, BCrypt password encryption
  - Stateless REST Security: HMAC-SHA256 JWT authentication and method-level authorization (`@PreAuthorize`)
  - Definitive Master Annotations Reference Dictionary across Java SE, Jakarta EE, and Spring Boot
  - Production Boilerplate Elimination: Project Lombok and MapStruct compile-time mappers
  - Versioned Database Migrations: Flyway evolutionary schema management
  - Modern Automated Testing: JUnit 5, Mockito mocking framework, and Testcontainers Docker integration
  - Production Observability: Spring Boot Actuator health endpoints, Micrometer metrics, and Prometheus scraping
  - Automated Interactive API Documentation: OpenAPI 3 and Swagger UI specification generation
  - High-Performance Multi-Tier Caching: Local Caffeine L1 cache and Distributed Redis L2 cache
  - Resilience & Fault Tolerance: Resilience4j Circuit Breakers, Rate Limiters, Retry, and Fallback handlers
  - Event-Driven Enterprise Messaging: Apache Kafka producers, consumers, partition keys, consumer groups
  - Asynchronous Execution: Thread pools, Scheduled Tasks, Spring Batch, WebSockets & Server-Sent Events (SSE)

- **Part 4: Database Systems & Persistence (Sections 35–36, Topics 120–131):**
  - Relational Database Fundamentals: Tables, Columns, Rows, Primary Keys & Foreign Keys (Topic 120)
  - MySQL Setup & Environments: Local XAMPP, phpMyAdmin & Docker (Topic 121)
  - SQL DDL & Schema Management: CREATE, ALTER, DROP, Constraints & Data Types (Topic 122)
  - SQL DML & Basic Querying: INSERT, UPDATE, DELETE, SELECT, WHERE & ORDER BY (Topic 123)
  - SQL Visual JOINs Reference: INNER, LEFT, RIGHT, FULL OUTER & Multi-Table Queries (Topic 124)
  - SQL Aggregations & Grouping: COUNT, SUM, AVG, GROUP BY & HAVING (Topic 125)
  - SQL Subqueries & Set Operations: Scalar, Multi-row, Correlated, EXISTS & UNION (Topic 126)
  - Database Transactions & ACID: COMMIT, ROLLBACK & Concurrency Isolation Levels (Topic 127)
  - Database Indexes & Query Optimization: B-Trees, Clustered/Secondary, Leftmost Prefix & EXPLAIN (Topic 128)
  - SQL vs NoSQL Architectural Trade-offs: Tabular vs Document, ACID vs BASE, CAP Theorem (Topic 129)
  - MongoDB Fundamentals & Compass: BSON, Document Collections, CRUD & Aggregation Pipelines (Topic 130)
  - Java Persistence Integration: Spring Data JPA (MySQL) vs Spring Data MongoDB (Topic 131)

---

## 🎯 Educational Philosophy: A Practical Reference Handbook

This handbook is designed so developers can find what they need immediately, understand it, see a practical runnable example, and return to their work:

1. **Practical Reference, Not a Sequential Course:** Jump straight to any method, annotation, or concept via `Ctrl + K` search or hash links (e.g. `/#topic-07` or `/#strings-and-text-blocks`).
2. **Explain Only What Is Necessary:** Concise descriptions, quick tables, and clear syntax breakdowns. Unnecessary theoretical trivia and internal C++ VM implementation details are omitted.
3. **Small, Runnable Examples:** Clean, realistic, and runnable code examples demonstrating the exact concept explained.
4. **Purposeful Exercises:** Meaningful knowledge checks, bug-spotting challenges, and real-world implementation exercises with click-to-reveal solutions.
