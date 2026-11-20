# NTI Java & SOA Master Interactive Handbook (Offline-First)

> **A comprehensive, offline-first reference and learning platform covering Java 8 through Java 26, Jakarta EE 10/11, and Service-Oriented Architecture (SOA) with Spring Boot.**  
> Designed from absolute zero for beginners and modern enterprise software engineers.
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
- **Official Completion Certificate & Security Gate:** Interactive, print-ready, and exportable verified Certificate of Technical Mastery issued exclusively upon completing all 134 modules or instructor verification.
- **Confidential Instructor & Admin Portal:** Secret command center (`Ctrl + Shift + A` or `#admin`) protected by complex master authentication, featuring real-time student roster, progress metrics, CSV export, and security audit logs.
- **Live Broadcasts & Shared Resources:** Instructor broadcast system for pushing Google Drive folders, project assignments, tasks, and notices to all learners with interactive notification badges.
- **VS Code Dark+ & Light Paper Themes:** Built to match developer ergonomics with a deep `#18181b` slate theme, warm Java amber/orange accents, and crisp light paper mode.
- **Offline Full-Text Search:** Sub-millisecond client-side indexing powered by MiniSearch with instant keyword matching, fuzzy tolerance, and `Ctrl + K` shortcut.
- **Dual-Tab Code Blocks:** Switch between Java source code and exact terminal/console output with one-click copy buttons.
- **Interactive Exercises & Capstones:** Multi-tiered Capstone projects and milestone challenges per topic with click-to-reveal solution panels.
- **Local JDK & Apache Tomcat Verification:** Every code snippet is compiled against JDK 26.0.1 and Apache Tomcat 10.1.61 with 160 automated test suites passed (0 failed).

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
```
Then open your browser at: **[http://localhost:5173](http://localhost:5173)**.

> **Note:** You can also download the project as a **ZIP** archive directly by clicking **Code** > **Download ZIP** on GitHub, extracting the archive, and running `npm install && npm run dev`.

---

## 📚 Syllabus Overview

- **Part 1: Java Core (Sections 1–16, Topics 01–62):**
  - Foundations, Compilation, JDK vs JRE vs JVM
  - Primitives, Operators, Type Casting, Strings, Text Blocks
  - Control Flow, Modern Switch Expressions, Loops
  - Methods, Overloading, Scope, `var`
  - Arrays, Object-Oriented Programming (OOP) Essentials
  - Inheritance, Polymorphism, Abstract Classes, Interfaces
  - Modern Java: Records, Sealed Classes, Pattern Matching
  - Exception Handling, Try-With-Resources
  - Generics, Wildcards (PECS), Collections Framework (List, Set, Map, Deque)
  - Lambdas, Functional Interfaces, Stream API, Optional
  - File I/O, NIO.2, Date/Time API (`java.time`)
  - Concurrency, Locks, Thread Pools, CompletableFuture, Virtual Threads, Structured Concurrency
  - JVM Internals: Memory Model (JMM), Garbage Collection (G1, ZGC), JIT, ClassLoaders
  - Reflection, Annotations, Java Platform Module System (JPMS)
  - JDBC Fundamentals and Build Automation (Maven / Gradle)

- **Part 2: Java EE & Jakarta EE (Sections 17–23, Topics 63–87):**
  - The Great Transition: `javax.*` to `jakarta.*` namespace migration
  - Web Architecture & HTTP protocol fundamentals
  - Apache Tomcat container architecture and WAR packaging
  - Servlets Deep Dive: Lifecycle (`init`, `service`, `destroy`), Request/Response processing, Annotations vs `web.xml`, Dispatching (Forward vs Redirect)
  - State Management: Sessions, Cookies, Filters, Listeners, Web Security (CSRF, XSS)
  - JavaServer Pages (JSP): Translation lifecycle, Directives, Scriptlets, EL, JSTL, Custom Tags
  - The Web MVC Pattern, Form Handling, Multipart Uploads, Error Pages, JNDI Connection Pooling
  - Jakarta EE Enterprise Stack: JPA, CDI, JAX-RS, Bean Validation, JSF, EJB

- **Part 3: Spring Boot & The Modern Production Ecosystem (Sections 24–37, Topics 88–129):**
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
  - Event-Driven Enterprise Messaging: Apache Kafka producers, consumers, partition keys, consumer groups, retryable topics, and DLT
  - Distributed Systems Patterns: Transactional Outbox Pattern, CDC with Debezium, Saga Distributed Transactions (Choreography vs Orchestration)
  - Production Deployment & Native Images: Layered Docker JAR packaging, CDS archive optimization, GraalVM AOT Compilation

- **Part 4: Database Systems & Persistence (Sections 38–39, Topics 130–134):**
  - SQL vs NoSQL: Relational vs Document paradigms, ACID vs BASE, CAP Theorem
  - MySQL Relational Mastery: XAMPP environment, DDL, DML, DQL, Relational JOINs, B-Tree Indexes & Query Tuning
  - Java MySQL Persistence: Spring Data JPA integration, HikariCP pool tuning, Complete `application.properties`
  - Document Databases & MongoDB: Architecture, BSON encoding, 12-byte `ObjectId` mechanics, Compass GUI, MQL CRUD & Aggregation Pipelines
  - Java MongoDB Persistence: Spring Data MongoDB, `MongoTemplate`, derived queries, and Connection URI tuning

---

## 🔬 Strict 11-Step Depth Standard per Topic

1. **What It Is and Why It Exists** (Plain language definition + intuitive real-world analogy)
2. **Prerequisites**
3. **Syntax Breakdown** (Annotated keyword and symbol breakdown)
4. **Runnable Code Examples** (Basic minimal + realistic production scenario with expected terminal output)
5. **Step-by-Step Execution** (Trace of what happens when the code runs)
6. **Common Mistakes & Compiler / Runtime Errors** (Real error message, cause, and exact fix)
7. **Best Practices & Anti-Patterns** (Do's, Don'ts, and when NOT to use)
8. **Version Notes & Compatibility Matrix** (Introduced version, preview history, LTS status)
9. **Summary Cheat Sheet** (Comparison table)
10. **Graded Interactive Exercises** (Spot the bug, hands-on, edge case with hidden solutions)
11. **Verified Official Sources** (Direct links to Oracle, OpenJDK, Jakarta EE, and Tomcat docs)
