# NTI Java & SOA Master Handbook — Progress Tracker

> **Project Identity:** **NTI Java & SOA Master Handbook**  
> **Official Scope:** Curriculum tracker and architectural study companion for the **NTI Program** (Java & Service-Oriented Architecture - SOA).  
>
> **Status Legend:**
> - `[ ]` Planned: In queue for implementation
> - `[w]` Written: Fully authored following standard pedagogical structure
> - `[c]` Code-Verified: Compiled and executed locally on JDK 26.0.1 / Tomcat 10.1.61
> - `[s]` Sources-Checked: Verified against official Oracle / OpenJDK / Jakarta EE / Tomcat documentation
> - `[x]` Complete: Written, code-verified, sources checked, and indexed
>
> ⚠️ **Strict Local Policy:** All changes verified locally; zero unauthorized `git push` operations.

---

## 1. Core Curriculum Content

### Part 1: Java Core & Advanced JVM (Zero to Production)
- [x] Topic 01: What is Programming & How Code Runs (HardwareProbe.java, PerformanceTracker.java on JDK 26)
- [x] Topic 02: JDK vs JRE vs JVM & Setup (RuntimeInspector.java, EnvironmentValidator.java on JDK 26)
- [x] Topic 03: Your First Java Program (HelloWorld.java, GreetingApp.java on JDK 26)
- [x] Topic 04: Variables, Identifiers & Primitive Data Types (PrimitivesDemo.java, SensorLedger.java on JDK 26)
- [x] Topic 05: Operators & Expressions (OperatorMechanics.java, SecurityPermissions.java on JDK 26)
- [x] Topic 06: Type Casting & Numeric Conversions (CastingMechanics.java, OverflowGuardApp.java on JDK 26)
- [x] Topic 07: Strings & Text Blocks (StringPoolDemo.java, TextBlockService.java on JDK 26)
- [x] Topic 08: Conditional Statements (DiscountCalculator.java, AccessGatekeeper.java on JDK 26)
- [x] Topic 09: Switch Statements & Modern Switch Expressions (SwitchEvolutionDemo.java, HttpStatusRouter.java on JDK 26)
- [x] Topic 10: Loops & Iteration (LoopMechanicsDemo.java, MatrixScannerApp.java on JDK 26)
- [x] Topic 11: Methods, Parameters & Return Values (MethodMechanics.java, AccountService.java on JDK 26)
- [x] Topic 12: Method Overloading & Varargs (OverloadingMechanics.java, QueryBuilderApp.java on JDK 26)
- [x] Topic 13: Variable Scope & Local Variable Type Inference (`var`) (ScopeMechanics.java, TypeInferenceEngine.java on JDK 26)
- [x] Topic 14: One-Dimensional Arrays (ArrayMechanics.java, SensorBufferApp.java on JDK 26)
- [x] Topic 15: Multi-Dimensional Arrays & Arrays Utility (JaggedArrayDemo.java, FleetInventoryManager.java on JDK 26)
- [x] Topic 16: Classes, Objects & Memory Layout (ClassMemoryLayout.java, VehicleTelemetryApp.java on JDK 26)
- [x] Topic 17: Constructors & Object Initialization (ConstructorChainingDemo.java, ServerConfigurationApp.java on JDK 26)
- [x] Topic 18: Packages & Access Modifiers (AccessModifierDemo.java, SecurePaymentGateway.java on JDK 26)
- [x] Topic 19: Encapsulation & Data Integrity (EncapsulationMechanics.java, FinancialLedgerEntry.java on JDK 26)
- [x] Topic 20: Inheritance & Method Overriding (InheritanceMechanics.java, EmployeePayrollApp.java on JDK 26)
- [x] Topic 21: Polymorphism & Dynamic Method Dispatch (PolymorphismMechanics.java, NotificationDispatcherApp.java on JDK 26)
- [x] Topic 22: Abstract Classes & Methods (AbstractShapeDemo.java, ETLPipelineApp.java on JDK 26)
- [x] Topic 23: Interfaces & Modern Interface Evolution (InterfaceEvolutionDemo.java, CloudStorageService.java on JDK 26)
- [x] Topic 24: Nested, Inner, Local & Anonymous Classes (NestedClassMechanics.java, EventBrokerApp.java on JDK 26)
- [x] Topic 25: Enumerations (`enum`) (EnumMechanics.java, OrderStateMachineApp.java on JDK 26)
- [x] Topic 26: Records (Java 16+) (RecordMechanics.java, GeoLocationRecordApp.java on JDK 26)
- [x] Topic 27: Sealed Classes & Interfaces (Java 17+) (SealedClassMechanics.java, PaymentMethodHierarchyApp.java on JDK 26)
- [x] Topic 28: Pattern Matching (Java 16/21+) (PatternMatchingMechanics.java, FinancialEventMatcherApp.java on JDK 26)
- [x] Topic 29: The Java Exception Hierarchy (ExceptionHierarchyDemo.java, ResilientServiceApp.java on JDK 26)
- [x] Topic 30: Checked vs Unchecked Exceptions (CheckedVsUncheckedDemo.java, FileOrderImporterApp.java on JDK 26)
- [x] Topic 31: Try-With-Resources & AutoCloseable (TryWithResourcesMechanics.java, DatabaseStreamExporterApp.java on JDK 26)
- [x] Topic 32: Custom Exceptions & Exception Chaining (CustomExceptionChainingDemo.java, BankingTransactionValidatorApp.java on JDK 26)
- [x] Topic 33: Generics Fundamentals (GenericsFundamentalsDemo.java, TypeSafeRepositoryApp.java on JDK 26)
- [x] Topic 34: Generic Wildcards & PECS Principle (WildcardsPECSDemo.java, PipelineDataBufferApp.java on JDK 26)
- [x] Topic 35: The List Hierarchy (ListHierarchyDemo.java, OrderBatchProcessorApp.java on JDK 26)
- [x] Topic 36: The Set Hierarchy (SetHierarchyDemo.java, UniqueVisitorTrackerApp.java on JDK 26)
- [x] Topic 37: The Map Hierarchy (MapHierarchyDemo.java, InMemoryCacheServiceApp.java on JDK 26)
- [x] Topic 38: The Queue & Deque Hierarchy (QueueDequeDemo.java, JobSchedulerApp.java on JDK 26)
- [x] Topic 39: Comparable & Comparator (ComparableComparatorDemo.java, ProductCatalogRankingApp.java on JDK 26)
- [x] Topic 40: Lambdas & Functional Interfaces (LambdaFunctionalInterfacesDemo.java, EventNotificationFilterApp.java on JDK 26)
- [x] Topic 41: Method References (MethodReferencesDemo.java, CustomerDataTransformerApp.java on JDK 26)
- [x] Topic 42: Stream API: Pipeline Fundamentals (StreamPipelineFundamentalsDemo.java, ServerLogAnalyticsApp.java on JDK 26)
- [x] Topic 43: Stream API: Terminal Operations & Collectors (StreamCollectorsDemo.java, FinancialTransactionAnalyticsApp.java on JDK 26)
- [x] Topic 44: Optional Type Handling (OptionalMechanicsDemo.java, UserProfileLookupServiceApp.java on JDK 26)
- [x] Topic 45: Classic I/O Streams (ClassicIoStreamsDemo.java, AuditLogRotatorApp.java on JDK 26)
- [x] Topic 46: Modern NIO.2 File Operations (ModernNioOperationsDemo.java, DirectoryTreeScannerApp.java on JDK 26)
- [x] Topic 47: Date and Time API (`java.time`) (DateTimeApiDemo.java, GlobalSlaDeadlineCalculatorApp.java on JDK 26)
- [x] Topic 48: Threads & Thread Lifecycle (ThreadLifecycleDemo.java, BatchWorkerSupervisorApp.java on JDK 26)
- [x] Topic 49: Synchronization & Memory Visibility (SynchronizationVisibilityDemo.java, DoubleCheckedLockingSingletonApp.java on JDK 26)
- [x] Topic 50: Explicit Locks & Concurrent Collections (ExplicitLocksAtomicsDemo.java, RateLimiterTokenBucketApp.java on JDK 26)
- [x] Topic 51: Executor Framework & Thread Pools (ThreadPoolExecutorDemo.java, ParallelImageBatchProcessorApp.java on JDK 26)
- [x] Topic 52: Asynchronous Pipelines with CompletableFuture (CompletableFuturePipelineDemo.java, MicroserviceAggregatorApp.java on JDK 26)
- [x] Topic 53: Virtual Threads (Project Loom - Java 21+) (VirtualThreadsDemo.java, HighThroughputHttpSimulatorApp.java on JDK 26)
- [x] Topic 54: Structured Concurrency & Scoped Values (StructuredConcurrencyDemo.java, TravelBookingAggregatorApp.java on JDK 26)
- [x] Topic 55: Java Memory Model (JMM) (MemoryLayoutRuntimeDemo.java, ObjectAllocationProfilerApp.java on JDK 26)
- [x] Topic 56: Garbage Collection Algorithms & Tuning (GarbageCollectionDemo.java, HeapPressureAnalyzerApp.java on JDK 26)
- [x] Topic 57: ClassLoaders & JIT Compilation (ClassLoaderHierarchyDemo.java, HotReloadPluginClassLoaderApp.java on JDK 26)
- [x] Topic 58: Annotations & Metadata (AnnotationProcessingDemo.java, OrmEntityValidatorApp.java on JDK 26)
- [x] Topic 59: Reflection API (ReflectionMethodHandlesDemo.java, DynamicProxyLoggingApp.java on JDK 26)
- [x] Topic 60: Java Platform Module System (JPMS) (ModuleDescriptorDemo.java, ModularServicePluginApp.java on JDK 26)
- [x] Topic 61: JDBC Fundamentals (JdbcFundamentalsDemo.java, BankingTransactionRepositoryApp.java on JDK 26)
- [x] Topic 62: Build Automation: Maven & Gradle (BuildToolLifecycleDemo.java, DependencyResolverSimulatorApp.java on JDK 26)

### Part 2: Jakarta EE & Enterprise Web Stack
- [x] Topic 63: The Great Transition: Java EE to Jakarta EE (NamespaceTransitionInspectorDemo.java on Tomcat 10.1)
- [x] Topic 64: Web Architecture Fundamentals (HTTP Protocol, Client-Server, URL Anatomy) (HttpProtocolParserDemo.java on JDK 26)
- [x] Topic 65: Apache Tomcat & The WAR Structure (WarStructureValidatorDemo.java on Tomcat 10.1)
- [x] Topic 66: Servlet Lifecycle & Architecture (LifecycleServlet.java on Tomcat 10.1)
- [x] Topic 67: Request & Response Processing (RequestInspectorServlet.java, OrderProcessingServlet.java on Tomcat 10.1)
- [x] Topic 68: Configuration: `@WebServlet` vs `web.xml` (ConfigDemoServlet.java, MultiMappingServlet.java on Tomcat 10.1)
- [x] Topic 69: Request Dispatching: Forward vs Include vs Redirect (DispatcherControllerServlet.java on Tomcat 10.1)
- [x] Topic 70: State Management: Sessions & Cookies (`HttpSession`, `Cookie`, `JSESSIONID`) (SessionShoppingCartServlet.java on Tomcat 10.1)
- [x] Topic 71: Servlet Filters & Filter Chains (`HttpFilter`, Authentication Guard) (RequestLoggingFilter.java, AuthGuardFilter.java on Tomcat 10.1)
- [x] Topic 72: Web Listeners (`@WebListener`, `HttpSessionListener`, `ServletContextListener`) (AppBootstrapListener.java on Tomcat 10.1)
- [x] Topic 73: Web Security Essentials (XSS, CSRF Sanitization) (CsrfProtectionServlet.java on Tomcat 10.1)
- [x] Topic 74: JSP Architecture & Translation (JspTranslationInspectorDemo.java on Tomcat 10.1)
- [x] Topic 75: JSP Syntax Elements (Directives, Scriptlets, Declarations) (syntax-elements.jsp on Tomcat 10.1)
- [x] Topic 76: JSP Implicit Objects & Standard Actions (`request`, `session`, `useBean`) (UserProfileBean.java on Tomcat 10.1)
- [x] Topic 77: Expression Language (EL) & JSTL (ExpressionLanguageEvaluatorDemo.java on Tomcat 10.1)
- [x] Topic 78: Custom JSP Tag Libraries (FormatCurrencyTag.java on Tomcat 10.1)
- [x] Topic 79: The Web MVC Pattern (Controller, Model, View Separation) (ProductCatalogServlet.java on Tomcat 10.1)
- [x] Topic 80: Form Handling, Validation & Encoding (FileUploadServlet.java on Tomcat 10.1)
- [x] Topic 81: Error Pages & Exception Handling (`<error-page>` in `web.xml`) (FaultTriggerServlet.java on Tomcat 10.1)
- [x] Topic 82: JDBC Connection Pooling in Web Apps (HikariCP / Tomcat Pool) (ConnectionPoolSimulatorDemo.java on Tomcat 10.1)
- [x] Topic 83: Jakarta Persistence (JPA) & Hibernate ORM (JpaEntityDemo.java on JDK 26)
- [x] Topic 84: Jakarta Contexts and Dependency Injection (CDI) (CdiDependencyInjectionDemo.java on JDK 26)
- [x] Topic 85: Jakarta RESTful Web Services (JAX-RS) (JaxRsEndpointDemo.java on JDK 26)
- [x] Topic 86: Jakarta Bean Validation (BeanValidationDemo.java on JDK 26)
- [x] Topic 87: Jakarta Faces (JSF) & Enterprise Beans (EJB) (JsfEjbArchitectureDemo.java on JDK 26)

### Part 3: Spring Boot & The Modern Production Ecosystem
- [x] Topic 88: Spring Framework Core, BeanFactory vs ApplicationContext (BeanFactoryVsApplicationContextDemo.java on JDK 26)
- [x] Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks (BeanLifecycleInjectionDemo.java on JDK 26)
- [x] Topic 90: Spring Boot Architecture, Starters & Embedded Runtimes (AutoConfigurationEmbeddedDemo.java on JDK 26)
- [x] Topic 91: Externalized Configuration, YAML Hierarchies & Multi-Profile Deployment (ExternalizedConfigurationProfilesDemo.java on JDK 26)
- [x] Topic 92: Production REST Controller Architecture with Spring Web MVC (RestControllerArchitectureDemo.java on JDK 26)
- [x] Topic 93: Request Validation with Bean Validation & Custom Constraint Validators (RequestValidationEngineDemo.java on JDK 26)
- [x] Topic 94: Centralized Global Exception Handling via `@RestControllerAdvice` (RFC 7807) (GlobalExceptionAdviceDemo.java on JDK 26)
- [x] Topic 95: Spring Data JPA Architecture, Repository Hierarchy & `JpaRepository` (SpringDataJpaRepositoryDemo.java on JDK 26)
- [x] Topic 96: Automated Derived Query Methods, Dynamic Projections & JPQL `@Query` (DerivedQueryProjectionsDemo.java on JDK 26)
- [x] Topic 97: Declarative `@Transactional` Boundaries, Pagination, Sorting & N+1 Prevention (TransactionalEntityGraphDemo.java on JDK 26)
- [x] Topic 98: Modern `SecurityFilterChain` Architecture & Password Encryption (SecurityFilterChainDemo.java on JDK 26)
- [x] Topic 99: Stateless REST Security with JWT & Method-Level Role Authorization (JwtRbacSecurityDemo.java on JDK 26)
- [x] Topic 100: The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations (AnnotationMetadataDictionaryDemo.java on JDK 26)
- [x] Topic 101: Boilerplate Elimination: Project Lombok & MapStruct (LombokMapStructDemo.java on JDK 26)
- [x] Topic 102: Versioned Database Migrations with Flyway (FlywayMigrationDemo.java on JDK 26)
- [x] Topic 103: Modern Automated Testing: JUnit 5, Mockito & Testcontainers (ModernTestingDemo.java on JDK 26)
- [x] Topic 104: Production Observability: Spring Boot Actuator, Micrometer & Prometheus (ActuatorObservabilityDemo.java on JDK 26)
- [x] Topic 105: Automated Interactive API Documentation with OpenAPI 3 & Swagger UI (OpenApiSwaggerDemo.java on JDK 26)
- [x] Topic 106: High-Performance Distributed Caching with Caffeine & Redis (DistributedCachingDemo.java on JDK 26)
- [x] Topic 107: Resilience & Fault Tolerance with Resilience4j (Circuit Breaker, RateLimiter) (Resilience4jDemo.java on JDK 26)
- [x] Topic 108: Event-Driven Enterprise Messaging with Apache Kafka (KafkaMessagingDemo.java on JDK 26)
- [x] Topic 109: Dynamic Queries via JPA Criteria API & Spring Data Specifications (JpaSpecificationFilterDemo.java on JDK 26)
- [x] Topic 110: Automated Entity Auditing & Temporal History with Hibernate Envers (EntityAuditingEnversDemo.java on JDK 26)
- [x] Topic 111: Multi-Tenancy Architecture & Dynamic RoutingDataSource (MultiTenantRoutingDemo.java on JDK 26)
- [x] Topic 112: Spring Security OAuth2 Resource Server & JWT Verification (OAuth2ResourceServerDemo.java on JDK 26)
- [x] Topic 113: OpenID Connect (OIDC) & Keycloak Identity Provider Integration (OidcKeycloakIntegrationDemo.java on JDK 26)
- [x] Topic 114: Production CORS, CSRF Defense & Security Response Headers (ProductionCorsCsrfSecurityDemo.java on JDK 26)
- [x] Topic 115: Asynchronous Task Execution & Custom ThreadPoolTaskExecutors (AsyncExecutionThreadPoolDemo.java on JDK 26)
- [x] Topic 116: Distributed Scheduling & Cluster Synchronization with ShedLock (DistributedShedLockSchedulerDemo.java on JDK 26)
- [x] Topic 117: Spring Batch Architecture & Chunk-Oriented Processing (SpringBatchChunkProcessingDemo.java on JDK 26)
- [x] Topic 118: Real-Time WebSockets & STOMP Protocol Messaging (WebSocketStompBrokerDemo.java on JDK 26)
- [x] Topic 119: Server-Sent Events (SSE) & Reactive HTTP Streaming (ServerSentEventsStreamingDemo.java on JDK 26)
- [x] Topic 120: Service Discovery & Dynamic Registration with Netflix Eureka (ServiceDiscoveryEurekaDemo.java on JDK 26)
- [x] Topic 121: Enterprise API Gateway Architecture & Spring Cloud Gateway (SpringCloudGatewayRoutingDemo.java on JDK 26)
- [x] Topic 122: Centralized Configuration Management with Spring Cloud Config & `@RefreshScope` (CentralizedConfigRefreshDemo.java on JDK 26)
- [x] Topic 123: Declarative Inter-Service HTTP Clients with OpenFeign & Spring 6 RestClient (DeclarativeRestClientFeignDemo.java on JDK 26)
- [x] Topic 124: Distributed Tracing & Correlation IDs with Micrometer Tracing & Zipkin (DistributedTracingMdcDemo.java on JDK 26)
- [x] Topic 125: Kafka Production Resilience: Non-Blocking Retries & Dead Letter Topics (DLT) (KafkaResilienceDltDemo.java on JDK 26)
- [x] Topic 126: Transactional Outbox Pattern & CDC for Zero-Loss Event Publishing (TransactionalOutboxPatternDemo.java on JDK 26)
- [x] Topic 127: Distributed Transactions & Saga Pattern in Microservices (SagaPatternOrchestrationDemo.java on JDK 26)
- [x] Topic 128: Production Dockerization, Layered JARs & Container Optimization (ProductionDockerLayeringDemo.java on JDK 26)
- [x] Topic 129: GraalVM Native Image & Ahead-of-Time (AOT) Compilation (GraalVmNativeAotDemo.java on JDK 26)

### Part 4: Database Systems & Persistence (SQL & NoSQL)
- [x] Topic 130: SQL vs NoSQL: Paradigms, ACID vs BASE & Architectural Trade-Offs (SqlVsNoSqlParadigmsDemo.java on JDK 26)
- [x] Topic 131: Relational Databases & MySQL Mastery (XAMPP Setup, DDL, DML, Joins & Query Tuning) (MySqlQueriesAndOptimizationDemo.java on JDK 26)
- [x] Topic 132: Java MySQL Persistence (Spring Data JPA, Hibernate & Complete Properties Configuration) (JavaMySqlPersistencePropertiesDemo.java on JDK 26)
- [x] Topic 133: NoSQL & MongoDB Mastery (Architecture, Compass, CRUD & Aggregation) (MongoDbDocumentAndAggregationDemo.java on JDK 26)
- [x] Topic 134: Java MongoDB Persistence (Spring Data MongoDB & Complete Connection Properties) (JavaMongoDbPersistencePropertiesDemo.java on JDK 26)

---

## 2. Interactive Platform Enhancements Pipeline

### A. Navigation & UI Hierarchy (Collapsible Sidebar)
- [x] **UI-01:** Implement Part-level collapsible accordion in `src/components/Sidebar.tsx` to group/collapse Sections by Part.
- [x] **UI-02:** Add Section-level collapsible accordions to manage topic density and enhance focus.
- [x] **UI-03:** Integrate `VSCode_Dark_Brighter.icls` theme palette into syntax highlighting engine (`src/index.css` & `src/components/CodeBlock.tsx`).

### B. Section Milestone Challenge & Assessment System
- [x] **CAP-01:** Define Section Milestone Challenges (Challenges 01–37) with clear problem statements and expected outputs (`src/data/challenges.ts`).
- [x] **CAP-02:** Build the Dual-State Self-Check UI component (`src/components/MilestoneChallengeCard.tsx`):
  - Button 1: `[✅ I Solved It]`: Reveals reference solution, architectural notes, and marks milestone as Mastered.
  - Button 2: `[🤔 Need Assistance]`: Reveals guided diagnostic hints, unlocks solution, and tags prerequisite topics for the "Targeted Review" dashboard.
- [x] **CAP-03:** Build the "Targeted Review / Knowledge Gaps" section in `src/components/ProgressView.tsx` to highlight areas requiring reinforcement.

### C. Cloud Sync, Security Gates & Admin Command Center
- [x] **SYNC-01:** Integrate Firebase Firestore SDK with zero-cost serverless architecture (`src/lib/firebase.ts`, `src/services/firebaseService.ts`).
- [x] **SYNC-02:** Build `StudentSyncModal` for cross-device progress synchronization using unique student codes without email/passwords.
- [x] **CERT-01:** Implement `CertificateGateModal` to lock official technical certificates until 100% curriculum completion or authorized instructor passkey.
- [x] **ADMIN-01:** Build Confidential Admin Command Center (`Ctrl+Shift+A` or `#admin`) with live student roster, progress metrics, and CSV export.
- [x] **ADMIN-02:** Implement Admin Security Audit Suite with customizable complex master passwords and last-login timestamp/device tracking.
- [x] **BCAST-01:** Build Instructor Broadcast & Resource Sharing system with in-app notification badges and homepage banner.

