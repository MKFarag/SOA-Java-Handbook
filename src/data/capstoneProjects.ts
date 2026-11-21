import type { CapstoneProject, PartType } from '../types';

export const CAPSTONE_PROJECTS: CapstoneProject[] = [
  // =========================================================================
  // CAPSTONE 1: JAVA CORE (TOPICS 01 - 62)
  // =========================================================================
  {
    id: 'capstone-part1',
    part: 'Part 1: Java Core',
    title: 'Part 1 Capstone: High-Throughput Multi-Tenant Financial Transaction Engine',
    subtitle: 'Concurrent Virtual Threads, Sealed Domain Models, Lock-Free Memory Buffers & NIO.2 Audit Logging',
    difficulty: 'Senior Systems Architect (Master)',
    prerequisitesCount: 62,
    prerequisiteTopicIds: ['topic-25', 'topic-32', 'topic-41', 'topic-48', 'topic-56', 'topic-58', 'topic-61'],
    estimatedDuration: '8 - 12 Hours',
    scenario: `You are tasked with building the high-frequency transaction ledger core for an international multi-tenant payment processor. 
The engine must process thousands of financial credit and debit transactions concurrently across multiple corporate tenant accounts. 
It must enforce strict ACID isolation in memory, protect against balance overdrafts with atomic compare-and-swap primitives, maintain a tamper-evident cryptographic SHA-256 hash-chained audit ledger, support dynamic polymorphic fee-calculation strategies via modern pattern matching over sealed types, and rotate append-only binary/text audit logs to disk asynchronously using Java NIO.2 and Virtual Threads.`,
    technicalStack: [
      'Java SE 21+ / OpenJDK 26',
      'Virtual Threads & Structured Concurrency (Executors.newVirtualThreadPerTaskExecutor)',
      'Lock-Free Data Structures (ConcurrentHashMap, AtomicReference)',
      'Immutable Java Records & Sealed Interfaces',
      'Pattern Matching for Switch (JSR 440/441)',
      'Asynchronous NIO.2 File Channels & Path Buffers',
      'Custom Exception Hierarchy with Chained Root Causes',
      'Runtime Reflection & Custom Annotation Metadata Inspection'
    ],
    architecturalRequirements: [
      'Model all financial entities (Account, TransactionRequest, AuditBlock) using immutable Java Records with compact validation constructors.',
      'Implement sealed payment fee router: DomesticTransfer, CrossBorderSwift, and CryptoSettlement with pattern-matched fee rules.',
      'Guarantee thread-safe, lock-free balance mutations: concurrent debit operations must never overdraw accounts or corrupt balance state.',
      'Maintain an in-memory tamper-evident blockchain-style hash chain: each audit entry contains the SHA-256 hash of the preceding entry.',
      'Dispatch concurrent transaction batches across 100+ Java Virtual Threads without thread starvation or race conditions.',
      'Asynchronously persist audit logs via NIO.2 Path/FileChannel, automatically rolling over to a new log file when exceeding size limits.',
      'Enforce custom domain exceptions (LedgerTransactionException) chained to root causes (InsufficientFundsException, TenantNotFoundException).'
    ],
    deliverables: [
      'Complete Ledger Engine source code adhering to clean enterprise architecture.',
      'Automated stress test verifying 100 concurrent virtual threads executing debits/credits without discrepancy.',
      'Tamper-evident audit chain validator certifying hash integrity across all transactions.',
      'Clean terminal execution output with zero uncaught exceptions and verified zero-balance-drift.'
    ],
    expectedTerminalOutput: `[LEDGER INIT] Multi-Tenant Engine Initialized on Java 26 (Virtual Threads Active)
[ACCOUNTS] Created 3 Corporate Accounts: TENANT-ALPHA ($100,000.00), TENANT-BETA ($50,000.00), TENANT-GAMMA ($75,000.00)
[DISPATCHER] Launching 100 Concurrent Transaction Tasks via Virtual Threads...
 - Task #01: Debit $250.00 [Domestic] from TENANT-ALPHA -> SUCCESS [Fee: $1.25]
 - Task #14: Debit $1,500.00 [Swift] from TENANT-BETA -> SUCCESS [Fee: $22.50]
 - Task #42: Debit $120,000.00 from TENANT-ALPHA -> REJECTED [InsufficientFundsException]
 - Task #99: Credit $5,000.00 to TENANT-GAMMA -> SUCCESS [Fee: $0.00]
[NIO.2 ROTATOR] Audit Log exceeded threshold -> Rotated to /logs/audit-ledger-2026-01.log
[AUDIT VERIFIER] Validating Cryptographic Hash Chain (100 Entries)...
 - Block 01 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
 - Block 100 Hash: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
 - Chain Integrity Status: 100% VALID [ZERO TAMPERING DETECTED]
[RECONCILIATION] Total Transactions: 100 | Approved: 98 | Rejected: 2 | System Balance Drift: $0.00
[CAPSTONE 1 SUCCESS] Part 1 Java Core Capstone Project: VERIFIED ARCHITECT COMPLIANT`,
    evaluationCriteria: [
      {
        category: 'Concurrency & Thread Safety',
        weight: '30%',
        description: 'Zero race conditions under concurrent virtual threads; atomic balance checks prevent overdrafts.'
      },
      {
        category: 'Modern Language Idioms',
        weight: '25%',
        description: 'Idiomatic use of records, sealed types, pattern matching switch, and Optional without anti-patterns.'
      },
      {
        category: 'Audit & Data Integrity',
        weight: '25%',
        description: 'Tamper-evident SHA-256 hash chaining and resilient asynchronous NIO.2 log rotation.'
      },
      {
        category: 'Error Architecture',
        weight: '20%',
        description: 'Structured custom exception hierarchy with root-cause chaining and clean caller recovery.'
      }
    ],
    referenceArchitectureCode: `package com.handbook.capstone;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

public class JavaCoreCapstoneLedger {

    // 1. Sealed Payment Strategy Hierarchy
    public sealed interface PaymentMethod permits DomesticTransfer, CrossBorderSwift, CryptoSettlement {}
    public record DomesticTransfer(String bankRouting) implements PaymentMethod {}
    public record CrossBorderSwift(String swiftBic, String country) implements PaymentMethod {}
    public record CryptoSettlement(String walletAddress, String network) implements PaymentMethod {}

    // 2. Immutable Domain Models
    public record Account(String tenantId, AtomicReference<Double> balance) {
        public Account(String tenantId, double initialBalance) {
            this(tenantId, new AtomicReference<>(initialBalance));
        }
    }

    public record AuditBlock(long index, String prevHash, String txId, String tenantId, double amount, String hash) {}

    // 3. Custom Exception Hierarchy
    public static class LedgerException extends RuntimeException {
        public LedgerException(String message, Throwable cause) { super(message, cause); }
    }
    public static class InsufficientFundsException extends Exception {
        public InsufficientFundsException(String msg) { super(msg); }
    }

    // 4. Ledger Core Engine
    public static class LedgerEngine {
        private final Map<String, Account> accounts = new ConcurrentHashMap<>();
        private final List<AuditBlock> auditChain = new CopyOnWriteArrayList<>();
        private final AtomicLong txSequence = new AtomicLong(1);
        private String lastHash = "0000000000000000000000000000000000000000000000000000000000000000";

        public void createAccount(String tenantId, double initialBalance) {
            accounts.put(tenantId, new Account(tenantId, initialBalance));
        }

        public double calculateFee(PaymentMethod method, double amount) {
            return switch (method) {
                case DomesticTransfer d -> amount * 0.005; // 0.5%
                case CrossBorderSwift s -> Math.max(15.0, amount * 0.015); // 1.5% min $15
                case CryptoSettlement c -> 2.50; // flat fee
            };
        }

        public boolean executeTransaction(String tenantId, double amount, PaymentMethod method) {
            Account acc = accounts.get(tenantId);
            if (acc == null) throw new LedgerException("Unknown tenant: " + tenantId, null);

            double fee = calculateFee(method, amount);
            double totalDeduction = amount + fee;

            // Lock-free atomic balance mutation loop
            while (true) {
                Double current = acc.balance().get();
                if (current < totalDeduction) {
                    return false; // Insufficient funds
                }
                if (acc.balance().compareAndSet(current, current - totalDeduction)) {
                    appendAuditBlock(tenantId, -totalDeduction);
                    return true;
                }
            }
        }

        private synchronized void appendAuditBlock(String tenantId, double delta) {
            long idx = txSequence.getAndIncrement();
            String txId = "TX-" + idx;
            String rawData = idx + ":" + lastHash + ":" + txId + ":" + tenantId + ":" + delta;
            String hash = sha256(rawData);
            AuditBlock block = new AuditBlock(idx, lastHash, txId, tenantId, delta, hash);
            auditChain.add(block);
            this.lastHash = hash;
        }

        public boolean verifyAuditIntegrity() {
            String expectedPrev = "0000000000000000000000000000000000000000000000000000000000000000";
            for (AuditBlock b : auditChain) {
                if (!b.prevHash().equals(expectedPrev)) return false;
                String expectedCurrent = sha256(b.index() + ":" + b.prevHash() + ":" + b.txId() + ":" + b.tenantId() + ":" + b.amount());
                if (!b.hash().equals(expectedCurrent)) return false;
                expectedPrev = b.hash();
            }
            return true;
        }

        private String sha256(String data) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] bytes = md.digest(data.getBytes(StandardCharsets.UTF_8));
                return HexFormat.of().formatHex(bytes);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        public double getBalance(String tenantId) {
            return accounts.get(tenantId).balance().get();
        }

        public int getAuditCount() { return auditChain.size(); }
    }

    public static void main(String[] args) throws InterruptedException {
        LedgerEngine ledger = new LedgerEngine();
        ledger.createAccount("TENANT-ALPHA", 100_000.0);
        ledger.createAccount("TENANT-BETA", 50_000.0);

        System.out.println("[LEDGER INIT] Multi-Tenant Engine Initialized on Java 26 (Virtual Threads Active)");
        
        // Concurrent Virtual Threads Dispatcher
        int threadCount = 100;
        CountDownLatch latch = new CountDownLatch(threadCount);

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < threadCount; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    try {
                        PaymentMethod method = (taskId % 2 == 0) 
                                ? new DomesticTransfer("ROUTING-9901") 
                                : new CrossBorderSwift("SWIFT-CH-88", "CH");
                        ledger.executeTransaction("TENANT-ALPHA", 250.0, method);
                    } finally {
                        latch.countDown();
                    }
                });
            }
        }

        latch.await(5, TimeUnit.SECONDS);

        System.out.printf("[RECONCILIATION] Completed %d Transactions. ALPHA Balance: $%.2f%n",
                ledger.getAuditCount(), ledger.getBalance("TENANT-ALPHA"));
        
        boolean validChain = ledger.verifyAuditIntegrity();
        System.out.println("[AUDIT VERIFIER] Tamper-evident Hash Chain Status: " + (validChain ? "100% VALID [ZERO TAMPERING]" : "CORRUPT"));
        assert validChain : "Cryptographic hash chain failed integrity check!";
        assert ledger.getBalance("TENANT-ALPHA") < 100_000.0 : "Balance was not decremented";

        System.out.println("[CAPSTONE 1 SUCCESS] Part 1 Java Core Capstone Project: VERIFIED ARCHITECT COMPLIANT");
    }
}`,
    verificationSuiteCode: `// Run with JDK 26:
// javac -d examples/web/classes src/data/capstone/JavaCoreCapstoneLedger.java
// java -ea -cp examples/web/classes com.handbook.capstone.JavaCoreCapstoneLedger`
  },

  // =========================================================================
  // CAPSTONE 2: JAKARTA EE & ENTERPRISE WEB (TOPICS 63 - 87)
  // =========================================================================
  {
    id: 'capstone-part2',
    part: 'Part 2: Java EE & Jakarta EE',
    title: 'Part 2 Capstone: Enterprise Multi-Tier E-Commerce Core & Banking Gateway',
    subtitle: 'Front Controller Dispatching, Security Filters, Connection Pools, JPA ORM & JAX-RS Services',
    difficulty: 'Enterprise Solutions Engineer (Advanced)',
    prerequisitesCount: 21,
    prerequisiteTopicIds: ['topic-63', 'topic-66', 'topic-68', 'topic-70', 'topic-84'],
    estimatedDuration: '10 - 14 Hours',
    scenario: `You are tasked with engineering a production-grade enterprise web portal from scratch using pure Jakarta EE 10 standards deployed on Apache Tomcat 10.1. 
The portal serves as a multi-tier e-commerce checkout and merchant settlement engine. It requires implementing a robust Front Controller Servlet dispatching to modular action handlers, an enterprise Security Filter chain defending against CSRF double-submit tokens and session hijacking, JNDI database connection pooling with health monitoring and leak detection, Jakarta Persistence (JPA) object-relational mapping with optimistic locking and Criteria queries, and JAX-RS REST endpoints delivering JSON payloads with custom exception mappers.`,
    technicalStack: [
      'Jakarta EE 10 Platform Standards',
      'Apache Tomcat 10.1.x Container',
      'Jakarta Servlet 6.0 & Front Controller Architecture',
      'Jakarta Filter 6.0 (AuthGuard, CsrfDoubleSubmitFilter, AuditLoggingFilter)',
      'Jakarta Persistence (JPA 3.1) & Hibernate 6.x ORM',
      'HikariCP / Tomcat JDBC Connection Pool Lifecycle Listeners',
      'Jakarta RESTful Web Services (JAX-RS 3.1)',
      'Jakarta Bean Validation 3.0 & Custom Constraint Validators'
    ],
    architecturalRequirements: [
      'Implement Front Controller Servlet pattern mapping actions (/orders/create, /orders/view, /settlement) to dedicated RequestHandler beans.',
      'Construct a 3-stage Security Filter Chain: RequestTraceFilter -> CsrfTokenValidationFilter -> AuthenticationGuardFilter.',
      'Prevent session hijacking: automatically regenerate session ID upon authentication using HttpServletRequest.changeSessionId().',
      'Configure connection pooling lifecycle in ServletContextListener with active/idle connection saturation alerts.',
      'Map relational entities (Merchant, CustomerOrder, PaymentTransaction) using JPA annotations, optimistic locking (@Version), and composite keys.',
      'Expose JAX-RS REST endpoints with Content Negotiation producing application/json and consuming application/json.',
      'Package as a standard WAR archive with web.xml deployment descriptors verified on Apache Tomcat 10.1.'
    ],
    deliverables: [
      'Complete Jakarta EE Web Application source tree under examples/web/.',
      'Functional Front Controller with dynamic dispatching and action mapping.',
      'Security Filter chain with CSRF verification and session regeneration.',
      'Valid WAR file (handbook-demo.war) deployed and responding with HTTP 200 on Tomcat 10.1.'
    ],
    expectedTerminalOutput: `[TOMCAT BOOTSTRAP] Initializing Jakarta EE 10 Enterprise Application on Tomcat 10.1.61...
[LIFECYCLE LISTENER] Initializing HikariCP Database Connection Pool (Max: 20, Idle: 5)...
[FILTER CHAIN CONFIG]
 - Filter 1: RequestCorrelationLoggingFilter [ORDER: 1] -> Initialized
 - Filter 2: CsrfProtectionCookieFilter       [ORDER: 2] -> Initialized
 - Filter 3: MerchantAuthenticationFilter     [ORDER: 3] -> Initialized
[FRONT CONTROLLER] Mapped Actions: [/checkout, /orders, /merchants/settle, /api/v1/status]
[HTTP POST /checkout] Request intercepted by Filter Chain:
 - Injected X-Correlation-ID: 4f9e12b7-88ab
 - Validated CSRF Token: VALID [Double-Submit Cookie Match]
 - Authenticated Merchant: MCH-9921 (Acme Global)
 - Front Controller dispatched to: CheckoutActionHandler
[JPA ORM] Persisting CustomerOrder #5501 with 2 LineItems:
 - Executed SQL: INSERT INTO customer_orders (id, merchant_id, total, version) VALUES (?, ?, ?, 0);
 - Optimistic Lock Version: 0 -> MANAGED
[JAX-RS REST] GET /api/v1/merchants/MCH-9921/summary -> 200 OK (application/json)
[TOMCAT WAR DEPLOYMENT] Verified handbook-demo.war structure: WEB-INF/web.xml [VALID]
[CAPSTONE 2 SUCCESS] Part 2 Jakarta EE Capstone Project: VERIFIED ENTERPRISE COMPLIANT`,
    evaluationCriteria: [
      {
        category: 'Web Container Architecture',
        weight: '30%',
        description: 'Clean separation of concerns: Servlets, Filters, Listeners, and JNDI pooling without leaky abstractions.'
      },
      {
        category: 'Web Security & Session Guard',
        weight: '25%',
        description: 'Robust defense against CSRF, session fixation, and unauthenticated action dispatching.'
      },
      {
        category: 'JPA Persistence & Transactions',
        weight: '25%',
        description: 'Proper entity state management, transaction isolation, and optimistic locking.'
      },
      {
        category: 'Specification Compliance',
        weight: '20%',
        description: 'Strict adherence to Jakarta EE 10 namespace and WAR packaging guidelines.'
      }
    ],
    referenceArchitectureCode: `package com.handbook.capstone;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class JakartaEeCapstonePortal {

    // 1. Simulated Front Controller & Action Mapping
    public interface ActionHandler {
        String handle(Map<String, String> params, Map<String, Object> session);
    }

    public static class FrontController {
        private final Map<String, ActionHandler> routes = new HashMap<>();

        public void register(String path, ActionHandler handler) {
            routes.put(path, handler);
        }

        public String dispatch(String path, Map<String, String> params, Map<String, Object> session) {
            ActionHandler handler = routes.get(path);
            if (handler == null) {
                return "HTTP 404: Action not found for path: " + path;
            }
            return handler.handle(params, session);
        }
    }

    // 2. Simulated Security Filter Chain
    public static class SecurityFilterChain {
        public boolean process(String path, Map<String, String> headers, Map<String, Object> session) {
            // Stage 1: Trace ID
            if (!headers.containsKey("X-Correlation-ID")) return false;
            // Stage 2: CSRF Check on POST
            if (path.equals("/checkout")) {
                String cookieToken = headers.get("Cookie-CSRF");
                String headerToken = headers.get("X-CSRF-Token");
                if (cookieToken == null || !cookieToken.equals(headerToken)) {
                    System.out.println("  [CSRF FILTER] REJECTED: CSRF token mismatch!");
                    return false;
                }
            }
            // Stage 3: Auth check
            if (!session.containsKey("MERCHANT_USER")) {
                System.out.println("  [AUTH FILTER] REJECTED: Unauthenticated session!");
                return false;
            }
            return true;
        }
    }

    // 3. Simulated Connection Pool with Leak Detection
    public static class ConnectionPoolSimulator {
        private final AtomicInteger activeConnections = new AtomicInteger(0);
        private final int maxPoolSize = 20;

        public boolean acquireConnection() {
            if (activeConnections.get() >= maxPoolSize) return false;
            activeConnections.incrementAndGet();
            return true;
        }

        public void releaseConnection() {
            activeConnections.decrementAndGet();
        }

        public int getActiveCount() { return activeConnections.get(); }
    }

    public static void main(String[] args) {
        System.out.println("[TOMCAT BOOTSTRAP] Initializing Jakarta EE 10 Enterprise Application on Tomcat 10.1.61...");
        
        ConnectionPoolSimulator pool = new ConnectionPoolSimulator();
        SecurityFilterChain security = new SecurityFilterChain();
        FrontController dispatcher = new FrontController();

        // Register Action
        dispatcher.register("/checkout", (params, session) -> {
            pool.acquireConnection();
            try {
                return "200 OK: Processed checkout for " + params.get("amount") + " by " + session.get("MERCHANT_USER");
            } finally {
                pool.releaseConnection();
            }
        });

        // Test Filter Pipeline & Dispatch
        Map<String, String> headers = new HashMap<>();
        headers.put("X-Correlation-ID", "4f9e12b7-88ab");
        headers.put("Cookie-CSRF", "CSRF-TOKEN-XYZ");
        headers.put("X-CSRF-Token", "CSRF-TOKEN-XYZ");

        Map<String, Object> session = new HashMap<>();
        session.put("MERCHANT_USER", "AcmeCorp");

        boolean filterPass = security.process("/checkout", headers, session);
        assert filterPass : "Security filter chain should pass for valid tokens";

        String response = dispatcher.dispatch("/checkout", Map.of("amount", "$1,450.00"), session);
        System.out.println("[DISPATCH RESULT] " + response);
        assert response.contains("200 OK");
        assert pool.getActiveCount() == 0 : "Connection leak detected!";

        System.out.println("[CAPSTONE 2 SUCCESS] Part 2 Jakarta EE Capstone Project: VERIFIED ENTERPRISE COMPLIANT");
    }
}`,
    verificationSuiteCode: `// Run with JDK 26:
// javac -d examples/web/classes src/data/capstone/JakartaEeCapstonePortal.java
// java -ea -cp examples/web/classes com.handbook.capstone.JakartaEeCapstonePortal`
  },

  // =========================================================================
  // CAPSTONE 3: SPRING BOOT & PRODUCTION CLOUD (TOPICS 88 - 108)
  // =========================================================================
  {
    id: 'capstone-part3',
    part: 'Part 3: Spring Boot & Production Stack',
    title: 'Part 3 Capstone: Cloud-Native Distributed Fintech Payment Gateway Microservice',
    subtitle: 'Spring Boot 3, JWT Security, Spring Data JPA @EntityGraph, Multi-Tier Caching, Resilience4j & Kafka',
    difficulty: 'Lead Cloud Architect (Production)',
    prerequisitesCount: 21,
    prerequisiteTopicIds: ['topic-88', 'topic-90', 'topic-92', 'topic-95', 'topic-98', 'topic-101', 'topic-104'],
    estimatedDuration: '12 - 16 Hours',
    scenario: `You are the Lead Solutions Architect designing the mission-critical payment orchestration microservice for an international fintech platform. 
The service must ingest high-volume REST requests, validate incoming payloads with custom Bean Validation constraints, verify stateless HMAC-SHA256 JWT tokens with role-based access control (@PreAuthorize), interact with relational databases using Spring Data JPA while strictly eliminating the N+1 select problem via @EntityGraph, implement multi-tier caching (L1 Caffeine in-memory + L2 Redis distributed) with cache stampede protection (sync = true), protect third-party banking integration via Resilience4j Circuit Breakers and Rate Limiters, record dimensional metrics with Micrometer for Prometheus scraping, and stream asynchronous payment confirmation events to Apache Kafka partitioned deterministically by customer ID.`,
    technicalStack: [
      'Spring Boot 3.3+ & Java 21 / 26 LTS',
      'Spring Web MVC & RFC 7807 ProblemDetail Global Error Advice',
      'Jakarta Bean Validation 3.0 & Custom Constraint Validators',
      'Spring Security 6 (Stateless JWT FilterChain & @PreAuthorize RBAC)',
      'Spring Data JPA with @EntityGraph (N+1 Select Prevention)',
      'Multi-Tier Caching (L1 Caffeine + L2 Redis Cluster with TTL)',
      'Resilience4j 2.x (Circuit Breaker, Sliding Window & RateLimiter)',
      'Spring for Apache Kafka (Key-Based Partitioning & Consumer Groups)',
      'Spring Boot Actuator, Micrometer & Prometheus Metrics Exposition'
    ],
    architecturalRequirements: [
      'Externalized Multi-Profile Configuration: Implement YAML profile hierarchies for dev, staging, and prod with strict property validation.',
      'Production REST Controller Architecture: Return explicit ResponseEntity status codes with RFC 7807 ProblemDetail error payloads for 400, 401, 403, 404, 429, and 500.',
      'Stateless SecurityFilterChain: Disable CSRF, configure OncePerRequestFilter parsing Bearer JWT tokens, and enforce method security (@PreAuthorize("hasRole(\'MERCHANT_ADMIN\')")).',
      'High-Performance Spring Data JPA: Eliminate N+1 query degradation using @EntityGraph / JOIN FETCH, combined with @Transactional(readOnly = true) optimizations.',
      'Multi-Tier Caching with Stampede Defense: Configure L1 Caffeine (heap) and L2 Redis (remote) with sync = true and deterministic TTL eviction.',
      'Resilient Circuit Breaker & Fallback: Wrap third-party bank gateway calls with Resilience4j: trip from CLOSED to OPEN upon 50% failures, short-circuiting to fallback queues.',
      'Event-Driven Kafka Event Streaming: Publish PaymentCompletedEvent to Kafka using customerId as partition key, guaranteeing chronological order per customer.'
    ],
    deliverables: [
      'Production Microservice Orchestrator source code.',
      'End-to-end integration test demonstrating concurrent checkout, JWT verification, and cache lookaside.',
      'Circuit breaker tripping and recovery verification test.',
      'Kafka partition distribution test proving customer events land in identical partitions.'
    ],
    expectedTerminalOutput: `[BOOTSTRAP] Launching Cloud-Native Payment Microservice (Profile: 'production')...
[SECURITY] SecurityFilterChain active: CSRF Disabled, Stateless JWT Filter initialized.
[CACHE MGR] Multi-Tier Cache Active: L1 Caffeine (Max: 50,000, TTL: 60s) + L2 Redis (TTL: 1h).
[RESILIENCE] CircuitBreaker 'bankGateway' initialized (Window: 10, Failure Threshold: 50%).
[HTTP POST /api/v1/payments] Authenticated: 'merchant.lead' with roles [ROLE_MERCHANT_ADMIN]
 - Validated Request Payload: Order #9901 for Customer 'CUST-8812' ($2,450.00) -> VALID [RFC 7807 Clean]
 - Cache Lookaside: L1 MISS -> L2 MISS -> Proceeding to Database
 - JPA Repository: Fetched Customer & Merchant with @EntityGraph in 1 SQL Query (0 N+1 drift)
 - Bank Gateway Call: Success (Latency: 42ms) -> CircuitBreaker: CLOSED
 - Kafka Producer: Published PaymentConfirmedEvent to 'payment-events' [Partition: 2, Offset: 1402]
 - Cache Backfill: Populated L1 Caffeine and L2 Redis for key 'payment:9901'
[HTTP POST /api/v1/payments (Duplicate Request)]:
 - Cache Lookaside: L1 HIT (Latency: 0.08ms) -> Returned cached PaymentResponse instantly [ZERO DB QUERIES]
[FAULT INJECTION TEST] Third-Party Bank Gateway Timed Out:
 - Call failed -> CircuitBreaker recorded failure (Failure rate: 50%) -> State: CLOSED -> OPEN
 - Subsequent request: Short-circuited immediately to fallback async settlement queue (429/503 prevented)
[ACTUATOR METRICS] Prometheus scrape output:
 - http_server_requests_total{method="POST",status="200",uri="/api/v1/payments"} 2
 - circuit_breaker_state{name="bankGateway",state="open"} 1
[CAPSTONE 3 SUCCESS] Part 3 Spring Boot Capstone Project: VERIFIED CLOUD ARCHITECT COMPLIANT`,
    evaluationCriteria: [
      {
        category: 'Distributed Resiliency & Circuit Breaker',
        weight: '30%',
        description: 'Graceful degradation under downstream failures; sliding window threshold calculations operate correctly.'
      },
      {
        category: 'Stateless Security & RBAC',
        weight: '25%',
        description: 'Strict HMAC-SHA256 JWT validation and granular @PreAuthorize role enforcement.'
      },
      {
        category: 'High-Performance Persistence & Caching',
        weight: '25%',
        description: 'Complete elimination of N+1 queries via @EntityGraph and multi-tier cache synchronization.'
      },
      {
        category: 'Event Streaming & Observability',
        weight: '20%',
        description: 'Key-based Kafka message ordering and dimensional Micrometer metric instrumentation.'
      }
    ],
    referenceArchitectureCode: `package com.handbook.capstone;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class SpringBootCapstoneFintech {

    public record PaymentRequest(String paymentId, String customerId, double amount) {}
    public record PaymentResponse(String paymentId, String status, double amount, String source) {}

    public static class FintechMicroserviceOrchestrator {
        // Multi-tier cache simulation
        private final Map<String, PaymentResponse> l1Cache = new ConcurrentHashMap<>();
        // Kafka topic simulation
        private final List<String> kafkaLog = new ArrayList<>();
        // Circuit breaker state
        private boolean circuitOpen = false;
        private final AtomicInteger queryCounter = new AtomicInteger(0);

        public PaymentResponse processPayment(PaymentRequest req, String userRole) {
            // 1. RBAC Guard (@PreAuthorize("hasRole('ROLE_MERCHANT_ADMIN')"))
            if (!userRole.contains("ROLE_MERCHANT_ADMIN")) {
                throw new SecurityException("403 Forbidden: Requires ROLE_MERCHANT_ADMIN");
            }

            // 2. Cache Lookaside (L1 Caffeine / L2 Redis)
            if (l1Cache.containsKey(req.paymentId())) {
                PaymentResponse cached = l1Cache.get(req.paymentId());
                return new PaymentResponse(cached.paymentId(), cached.status(), cached.amount(), "CACHE_L1_HIT");
            }

            // 3. Database query simulation with @EntityGraph (Single Query)
            queryCounter.incrementAndGet();

            // 4. Resilience4j Circuit Breaker
            if (circuitOpen) {
                return new PaymentResponse(req.paymentId(), "QUEUED_OFFLINE", req.amount(), "CIRCUIT_OPEN_FALLBACK");
            }

            // 5. Asynchronous Kafka Event Streaming
            int partition = Math.abs(req.customerId().hashCode()) % 3;
            String kafkaMsg = String.format("PaymentEvent[id=%s, customer=%s, partition=%d]", req.paymentId(), req.customerId(), partition);
            kafkaLog.add(kafkaMsg);

            // 6. Cache Backfill
            PaymentResponse response = new PaymentResponse(req.paymentId(), "COMPLETED", req.amount(), "DATABASE_PERSISTED");
            l1Cache.put(req.paymentId(), response);

            return response;
        }

        public void tripCircuitBreaker() { this.circuitOpen = true; }
        public int getDatabaseQueryCount() { return queryCounter.get(); }
        public List<String> getKafkaLog() { return kafkaLog; }
    }

    public static void main(String[] args) {
        System.out.println("[BOOTSTRAP] Launching Cloud-Native Payment Microservice (Profile: 'production')...");
        FintechMicroserviceOrchestrator orchestrator = new FintechMicroserviceOrchestrator();

        PaymentRequest req = new PaymentRequest("PAY-9901", "CUST-8812", 2450.0);

        // 1. Initial request (Database query + Cache populate)
        PaymentResponse r1 = orchestrator.processPayment(req, "ROLE_MERCHANT_ADMIN");
        System.out.println("1. Initial Request: " + r1);
        assert r1.source().equals("DATABASE_PERSISTED");
        assert orchestrator.getDatabaseQueryCount() == 1;
        assert orchestrator.getKafkaLog().size() == 1;

        // 2. Duplicate request (Must hit Cache with ZERO DB queries)
        PaymentResponse r2 = orchestrator.processPayment(req, "ROLE_MERCHANT_ADMIN");
        System.out.println("2. Duplicate Request: " + r2);
        assert r2.source().equals("CACHE_L1_HIT");
        assert orchestrator.getDatabaseQueryCount() == 1 : "Database query count must remain 1!";

        // 3. Unauthorized request rejection
        try {
            orchestrator.processPayment(new PaymentRequest("PAY-9902", "CUST-8812", 100.0), "ROLE_GUEST");
            assert false : "Unauthorized user must be rejected";
        } catch (SecurityException ex) {
            System.out.println("3. RBAC Rejection: " + ex.getMessage());
        }

        // 4. Downstream failure & Circuit Breaker fallback
        orchestrator.tripCircuitBreaker();
        PaymentResponse r3 = orchestrator.processPayment(new PaymentRequest("PAY-9903", "CUST-9900", 500.0), "ROLE_MERCHANT_ADMIN");
        System.out.println("4. Circuit Tripped Fallback: " + r3);
        assert r3.source().equals("CIRCUIT_OPEN_FALLBACK");

        System.out.println("[CAPSTONE 3 SUCCESS] Part 3 Spring Boot Capstone Project: VERIFIED CLOUD ARCHITECT COMPLIANT");
    }
}`,
    verificationSuiteCode: `// Run with JDK 26:
// javac -d examples/web/classes src/data/capstone/SpringBootCapstoneFintech.java
// java -ea -cp examples/web/classes com.handbook.capstone.SpringBootCapstoneFintech`
  }
];

export function getCapstoneByPart(part: PartType): CapstoneProject | undefined {
  return CAPSTONE_PROJECTS.find(c => c.part === part);
}

export function getCapstoneById(id: string): CapstoneProject | undefined {
  return CAPSTONE_PROJECTS.find(c => c.id === id);
}
