# NTI Java & SOA Master Architecture Roadmap & Specification

> **Senior System Persona & Agent Prompt Context:**  
> *"You are a Senior Java Educator, Technical Writer, and Lead Enterprise Systems Architect. You are continuing development of the **NTI Java & SOA Master Handbook**. Your responsibility is to strictly follow this roadmap and PROGRESS.md, maintain strict domain separation between Java SE (Part 1), Jakarta EE (Part 2), and Spring Boot (Part 3), verify all code locally on JDK 26 and Tomcat 10.1 with zero compilation errors, write all curriculum markdown strictly in English, and NEVER execute `git push` without direct explicit user authorization."*

> **Project Identity:** **NTI Java & SOA Master Handbook**  
> **Target Audience:** Intensive Software Engineering Students & Enterprise Backend Engineers (NTI Scholarship Program — Java & Service-Oriented Architecture Track).  
> **Document Role:** The definitive architectural blueprint, curriculum roadmap, and engineering specification across all development sessions.  
> **Language & Governance:** 100% English. Strictly local verification; zero unauthorized `git push` operations.

---

## 1. System Philosophy & Strict Domain Separation

To eliminate confusion between vanilla Java standards and higher-level frameworks, the curriculum enforces strict, non-overlapping architectural tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NTI Java & SOA Platform                         │
├────────────────────────────────────────────────────────────────────────┤
│ Part 1: Java SE Core & JVM Architecture                                │
│ (Language syntax, OOP, Modern Data Modeling, Exceptions, Concurrency)  │
├────────────────────────────────────────────────────────────────────────┤
│ Part 2: Jakarta EE Standards & Enterprise Web Stack                    │
│ (HTTP internals, Servlets, JSP, MVC, JDBC, Jakarta JPA, JAX-RS)       │
├────────────────────────────────────────────────────────────────────────┤
│ Part 3: Spring Boot & The Modern Production Ecosystem                  │
│ (Spring Core, Auto-Config, REST MVC, Spring Data, Security 6, Kafka)   │
├────────────────────────────────────────────────────────────────────────┤
│ Part 4: Database Systems & Persistence (SQL & NoSQL)                   │
│ (SQL vs NoSQL, MySQL & XAMPP, Spring Data JPA, MongoDB, MQL Pipelines) │
└────────────────────────────────────────────────────────────────────────┘
```

### Domain Separation Rules:
1. **Part 1 - Java SE (Core Foundations):**
   Covers standard language APIs, memory management, and JVM concurrency without web or framework coupling.
2. **Part 2 - Jakarta EE (Specification Standards):**
   Covers standard enterprise specifications running on vanilla servlet containers (Tomcat 10.1). Shows how the web protocol works natively using `HttpServlet`, standard `HttpSession`, and specification JPA (`EntityManager`).
3. **Part 3 - Spring Boot (Enterprise Framework & Production):**
   Covers Spring's inversion-of-control abstractions (`JpaRepository`, `@RestControllerAdvice`, `@Autowired`, Spring Security 6) and the modern production ecosystem.
4. **Part 4 - Database Systems & Persistence (SQL & NoSQL):**
   Covers relational vs non-relational persistence architectures, local environment setups (XAMPP / phpMyAdmin / MongoDB Compass), SQL/MQL queries, connection pooling properties, and Spring Data integration.

---

## 2. Interactive Navigation UI Architecture

To prevent navigation fatigue and provide rapid access across 100+ topics, the left sidebar is structured with multi-level collapsible grouping:

```
Sidebar Navigation Hierarchy
├── 🔍 Instant Search & Quick Filter
│
├── 📂 [Part 1] Java Core (Zero to Production)  [▼ / ▶ Toggle All Sections]
│   ├── 📁 Section 1: Foundations & Architecture (Topics 01-03)
│   ├── 📁 Section 2: Language Basics & Data Types (Topics 04-07)
│   └── ...
│
├── 📂 [Part 2] Jakarta EE & Web Architecture  [▼ / ▶ Toggle All Sections]
│   ├── 📁 Section 19: Servlets Deep Dive (Topics 66-69)
│   ├── 📁 Section 20: State Management & Security (Topics 70-73)
│   └── ...
│
├── 📂 [Part 3] Spring Boot & Production Stack  [▼ / ▶ Toggle All Sections]
│   ├── 📁 Section 24: Spring Core & IoC Container (Topics 88-89)
│   └── ...
│
├── 📂 [Part 4] Database Systems & Persistence   [▼ / ▶ Toggle All Sections]
│   ├── 📁 Section 35: Relational Foundations & SQL Mastery (Topics 120-128)
│   └── 📁 Section 36: NoSQL Document Stores & Persistence Integration (Topics 129-131)
│
└── 📊 Global Quick Actions: [Progress Matrix] | [Saved Bookmarks] | [Certificate]
```

### Navigation Behavior:
- **Part-Level Accordion:** Clicking a Part header smoothly collapses or expands all sections within that part.
- **Section-Level Accordion:** Expanding a Section displays its discrete topic links and the culminating Section Milestone Challenge.
- **Persistent State:** User's expansion/collapse preferences persist in local storage.

---

## 3. Section Milestone Challenge & Self-Assessment System

Each Section concludes with a **Milestone Challenge (Capstone Lab)** designed to evaluate comprehension through independent compilation and execution.

```
                  ┌─────────────────────────────────────────┐
                  │       Section Milestone Challenge       │
                  │  - Complex Problem Statement            │
                  │  - Architectural Constraints            │
                  │  - Expected Output (Terminal / HTTP)    │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │   Learner Implements Locally & Runs     │
                  └────────────────────┬────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        [✅ I Solved It Successfully]          [🤔 I'm Stuck / Need Assistance]
                    │                                     │
                    ▼                                     ▼
     - Unlocks Reference Solution Code      - Unlocks Step-by-Step Diagnostic Hints
     - Deep Architectural Breakdown        - Shows Common Pitfalls & Explanations
     - Performance Best Practices           - Tags Topic for "Review Required"
     - Marks Milestone as MASTERED          - Unlocks Solution & Direct Topic Links
```

### Dual-State Self-Check Workflow:
1. **Challenge Presentation:**
   - A real-world scenario (e.g., *Build a thread-safe rate limiter* or *Implement session-based authentication with an HttpFilter guard*).
   - Expected stdout, terminal logs, or JSON response payload.
2. **Action 1 — "I Solved It" (Mastery Path):**
   - Displays the production-grade clean code solution.
   - Explains architectural design decisions.
   - Marks the section challenge as `Mastered` in the progress dashboard.
3. **Action 2 — "I Need Assistance" (Remediation Path):**
   - Displays guided debugging hints and architectural clues.
   - Shows the reference solution for immediate learning.
   - Automatically tags weak areas and surfaces them in a dedicated **"Targeted Review / Knowledge Gaps"** section so the student can revisit prerequisite topics before moving forward.

---

## 4. Syntax Highlighting Palette Specification

Derived from the verified `VSCode_Dark_Brighter.icls` IntelliJ / VS Code theme, guaranteeing high contrast and readability for learners:

| Token Type | Hex Color | Description & Examples |
| :--- | :--- | :--- |
| **Control Keywords** | `#c586c0` / `#cc85c6` | Flow control: `if`, `else`, `return`, `switch`, `yield`, `throws` |
| **Standard Keywords** | `#569cd6` | Language keywords: `public`, `class`, `void`, `extends`, `implements` |
| **Annotations** | `#8cd7ff` | Metadata: `@WebServlet`, `@Override`, `@RestControllerAdvice`, `@Entity` |
| **Types & Classes** | `#4ec9b0` / `#47ccb1` | Class names, interfaces, records: `String`, `User`, `HttpServletRequest` |
| **Methods & Functions** | `#dcdcaa` / `#e6e6aa` | Invocation & declarations: `doGet()`, `save()`, `filter()` |
| **Strings** | `#ce9178` | String literals: `"Hello NTI"`, `"admin@example.com"` |
| **Numbers & Booleans** | `#b5cea8` | Literals: `200`, `3.14f`, `true`, `false` |
| **Comments** | `#6a9955` | Documentation and inline comments: `// ...`, `/* ... */` |
| **Variables & Fields** | `#9cdcfe` | Identifiers, parameters, and local variables |
| **Editor Background** | `#171616` / `#1e1e1e` | Deep neutral background with `#2e2e32` border contrast |

---

## 5. Comprehensive Master Curriculum Breakdown

### 🟢 Part 1: Java Core & Advanced JVM (Topics 01–62) [100% Complete & Verified]
- **Section 01: Foundations & Architecture** (Topics 01–03) + *Challenge 01: System Environment Inspector*
- **Section 02: Language Basics & Data Types** (Topics 04–07) + *Challenge 02: High-Precision Currency Engine*
- **Section 03: Control Flow & Logic** (Topics 08–10) + *Challenge 03: Traffic Routing State Engine*
- **Section 04: Methods & Modular Code** (Topics 11–13) + *Challenge 04: Dynamic Calculator with Varargs*
- **Section 05: Arrays & Memory Structure** (Topics 14–15) + *Challenge 05: Matrix Transformation Engine*
- **Section 06: OOP Essentials** (Topics 16–19) + *Challenge 06: Secure Banking Account System*
- **Section 07: OOP Inheritance, Polymorphism & Abstraction** (Topics 20–25) + *Challenge 07: Cloud Storage Provider Hierarchy*
- **Section 08: Modern Java Data Modeling** (Topics 26–28) + *Challenge 08: Financial Event Pattern Matcher*
- **Section 09: Exception Handling** (Topics 29–32) + *Challenge 09: Resilient File Parsing with Custom Exceptions*
- **Section 10: Generics & Collections** (Topics 33–39) + *Challenge 10: High-Throughput Type-Safe Buffer*
- **Section 11: Functional Programming & Streams** (Topics 40–44) + *Challenge 11: Financial Analytics Aggregator Pipeline*
- **Section 12: File I/O, NIO.2 & Date/Time** (Topics 45–47) + *Challenge 12: Automated Audit Log Rotator*
- **Section 13: Concurrency & Multithreading** (Topics 48–54) + *Challenge 13: Asynchronous Web Crawler with Virtual Threads*
- **Section 14: JVM Internals & Memory Architecture** (Topics 55–57) + *Challenge 14: Dynamic Plugin ClassLoader with Memory Monitoring*
- **Section 15: Reflection, Annotations & JPMS** (Topics 58–60) + *Challenge 15: Custom DI Framework with Annotations*
- **Section 16: Data Access & Build Tools** (Topics 61–62) + *Challenge 16: Automated JDBC Transaction Repository*

### 🔵 Part 2: Jakarta EE & Enterprise Web Stack (Topics 63–87) [100% Complete & Verified]
- **Section 17: Web Architecture & Evolution** (Topics 63–64) + *Challenge 17: Raw HTTP Protocol Parser & Mock Dispatcher*
- **Section 18: Containers & WAR Packaging** (Topic 65) + *Challenge 18: Standalone WAR Deployment Packager*
- **Section 19: Servlets Deep Dive** (Topics 66–69) + *Challenge 19: Multi-Action Front Controller with Dispatching*
- **Section 20: State Management, Filters & Security** (Topics 70–73) + *Challenge 20: Enterprise Session Guard with Cookie Defense*
- **Section 21: JavaServer Pages (JSP) & Templating** (Topics 74–78) + *Challenge 21: Dynamic E-Commerce Catalog with Custom Taglibs*
- **Section 22: Production Web Development** (Topics 79–82) + *Challenge 22: Full MVC Application with Connection Pooling*
- **Section 23: Jakarta EE Enterprise Stack** (Topics 83–87) + *Challenge 23: Multi-Layer Enterprise Backend (JPA, CDI, JAX-RS)*

### 🟣 Part 3: Spring Boot & The Modern Production Ecosystem (Topics 88–129) [100% Complete & Verified]
- **Section 24: Spring Core & Inversion of Control (Topics 88–89)**
  - *Topic 88: Spring Framework Core, BeanFactory vs ApplicationContext*
  - *Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks*
  - *Challenge 24: Lightweight Spring IoC Container Simulation*
- **Section 25: Spring Boot Architecture & Configuration (Topics 90–91)**
  - *Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes*
  - *Topic 91: Externalized Configuration, YAML Hierarchies & Multi-Profile Deployment*
  - *Challenge 25: Multi-Tenant Configurable Microservice Bootstrap*
- **Section 26: RESTful Web Services & Global Error Handling (Topics 92–94)**
  - *Topic 92: Production REST Controller Architecture with Spring Web MVC*
  - *Topic 93: Request Validation with Bean Validation & Custom Constraint Validators*
  - *Topic 94: Centralized Global Exception Handling via `@RestControllerAdvice` (RFC 7807)*
  - *Challenge 26: Resilient Customer Management REST API with Unified Error Schemas*
- **Section 27: Persistence with Spring Data JPA & Databases (Topics 95–97)**
  - *Topic 95: Spring Data JPA Architecture, Repository Hierarchy & `JpaRepository`*
  - *Topic 96: Automated Derived Query Methods, Dynamic Projections & JPQL `@Query`*
  - *Topic 97: Declarative `@Transactional` Boundaries, Pagination, Sorting & N+1 Prevention*
  - *Challenge 27: High-Volume Banking Transaction Ledger with Audit Tracking*
- **Section 28: Enterprise Security with Spring Security 6 (Topics 98–99)**
  - *Topic 98: Modern `SecurityFilterChain` Architecture & Password Encryption*
  - *Topic 99: Stateless REST Security with JWT & Method-Level Role Authorization*
  - *Challenge 28: Complete JWT Authentication & RBAC Access Control Guard*
- **Section 29: Master Annotations Reference Dictionary (Topic 100)**
  - *Topic 100: The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations*
  - *Challenge 29: Annotation-Driven Metadata Inspector & Validator*
- **Section 30: Production Libraries & Distributed Systems (Topics 101–108)**
  - *Topic 101: Boilerplate Elimination: Project Lombok & MapStruct*
  - *Topic 102: Versioned Database Migrations with Flyway*
  - *Topic 103: Modern Automated Testing: JUnit 5, Mockito & Testcontainers*
  - *Topic 104: Production Observability: Spring Boot Actuator, Micrometer & Prometheus*
  - *Topic 105: Automated Interactive API Documentation with OpenAPI 3 & Swagger UI*
  - *Topic 106: High-Performance Distributed Caching with Caffeine & Redis*
  - *Topic 107: Resilience & Fault Tolerance with Resilience4j (Circuit Breaker, RateLimiter)*
  - *Topic 108: Event-Driven Enterprise Messaging with Apache Kafka*
  - *Challenge 30: End-to-End Enterprise Microservice with Caching, Resiliency & Event Streaming*
- **Section 31: Advanced Persistence, Dynamic Queries & Auditing (Topics 109–111)**
  - *Topic 109: Dynamic Queries via JPA Criteria API & Spring Data Specifications*
  - *Topic 110: Automated Entity Auditing & Temporal History with Hibernate Envers*
  - *Topic 111: Multi-Tenancy Architecture & Dynamic RoutingDataSource*
  - *Challenge 31: Dynamic Multi-Tenant Search Filter Engine with Audit History Ledger*
- **Section 32: Enterprise Identity & OAuth2 / OIDC Architecture (Topics 112–114)**
  - *Topic 112: Spring Security OAuth2 Resource Server & JWT Verification*
  - *Topic 113: OpenID Connect (OIDC) & Keycloak Identity Provider Integration*
  - *Topic 114: Production CORS, CSRF Defense & Security Response Headers*
  - *Challenge 32: Zero-Trust OAuth2 Resource Server with Multi-Role Keycloak Guard*
- **Section 33: Asynchronous, Distributed Scheduling & Batch Processing (Topics 115–117)**
  - *Topic 115: Asynchronous Task Execution & Custom ThreadPoolTaskExecutors*
  - *Topic 116: Distributed Scheduling & Cluster Synchronization with ShedLock*
  - *Topic 117: Spring Batch Architecture & Chunk-Oriented Processing*
  - *Challenge 33: High-Throughput Async Batch Pipeline & Distributed Scheduled Job*
- **Section 34: Real-Time Web & Asynchronous Streaming (Topics 118–119)**
  - *Topic 118: Real-Time WebSockets & STOMP Protocol Messaging*
  - *Topic 119: Server-Sent Events (SSE) & Reactive HTTP Streaming*
  - *Challenge 34: Real-Time Financial Ticker & Live Notification Hub*
- **Section 35: Spring Cloud & Microservices Ecosystem - SOA Core (Topics 120–124)**
  - *Topic 120: Service Discovery & Dynamic Registration with Netflix Eureka*
  - *Topic 121: Enterprise API Gateway Architecture & Spring Cloud Gateway*
  - *Topic 122: Centralized Configuration Management with Spring Cloud Config & `@RefreshScope`*
  - *Topic 123: Declarative Inter-Service HTTP Clients with OpenFeign & Spring 6 RestClient*
  - *Topic 124: Distributed Tracing & Correlation IDs with Micrometer Tracing & Zipkin*
  - *Challenge 35: Distributed Microservices Cluster with API Gateway, Eureka & Tracing*
- **Section 36: Resilient Messaging & Distributed Transaction Patterns (Topics 125–127)**
  - *Topic 125: Kafka Production Resilience: Non-Blocking Retries & Dead Letter Topics (DLT)*
  - *Topic 126: Transactional Outbox Pattern & CDC for Zero-Loss Event Publishing*
  - *Topic 127: Distributed Transactions & Saga Pattern in Microservices*
  - *Challenge 36: Resilient Order Checkout Engine with Outbox & Kafka DLQ*
- **Section 37: Cloud-Native Packaging & GraalVM AOT Compilation (Topics 128–129)**
  - *Topic 128: Production Dockerization, Layered JARs & Container Optimization*
  - *Topic 129: GraalVM Native Image & Ahead-of-Time (AOT) Compilation*
  - *Challenge 37: Sub-Second Startup Containerized Microservice via GraalVM Native Image*

---

## 6. Multi-Session Continuity Protocol

When continuing work in a fresh session:
1. Read **[ROADMAP.md](ROADMAP.md)** to acquire the master architecture guidelines and system specifications.
2. Read **[PROGRESS.md](PROGRESS.md)** to identify the exact next checklist item in the pipeline.
3. Validate local changes against test suites and compiler outputs before updating the tracker.
4. Strictly maintain 100% English documentation and adhere to the zero unauthorized `git push` policy.
