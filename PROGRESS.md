# Java & Jakarta EE Handbook — Progress Tracker

> **Status Legend:**
> - `[ ]` Todo: Not yet authored
> - `[w]` Written: Fully authored following the 11-step rule
> - `[c]` Code-Verified: Compiled and executed locally on JDK 26.0.1 / Tomcat 10.1.61
> - `[s]` Sources-Checked: Verified against official Oracle / OpenJDK / Jakarta EE / Tomcat documentation
> - `[x]` Complete: Written, verified, sources checked, and indexed

---

## Part 1: Java Core (Zero to Production)

### Section 1: Foundations & Architecture
- [x] Topic 01: What is Programming & How Code Runs (Verified: HardwareProbe.java, PerformanceTracker.java on JDK 26.0.1)
- [x] Topic 02: JDK vs JRE vs JVM & Setup (Verified: RuntimeInspector.java, EnvironmentValidator.java on JDK 26.0.1)
- [x] Topic 03: Your First Java Program (Verified: HelloWorld.java, GreetingApp.java on JDK 26.0.1)

### Section 2: Language Basics & Data Types
- [x] Topic 04: Variables, Identifiers & Primitive Data Types (Verified: PrimitivesDemo.java, SensorLedger.java on JDK 26.0.1)
- [x] Topic 05: Operators & Expressions (Verified: OperatorMechanics.java, SecurityPermissions.java on JDK 26.0.1)
- [x] Topic 06: Type Casting & Numeric Conversions (Verified: CastingMechanics.java, OverflowGuardApp.java on JDK 26.0.1)
- [x] Topic 07: Strings & Text Blocks (Verified: StringPoolDemo.java, TextBlockService.java on JDK 26.0.1)

### Section 3: Control Flow & Logic
- [x] Topic 08: Conditional Statements (Verified: DiscountCalculator.java, AccessGatekeeper.java on JDK 26.0.1)
- [x] Topic 09: Switch Statements & Switch Expressions (Verified: SwitchEvolutionDemo.java, HttpStatusRouter.java on JDK 26.0.1)
- [x] Topic 10: Loops & Iteration (Verified: LoopMechanicsDemo.java, MatrixScannerApp.java on JDK 26.0.1)

### Section 4: Methods & Modular Code
- [x] Topic 11: Methods, Parameters & Return Values (Verified: MethodMechanics.java, AccountService.java on JDK 26.0.1)
- [x] Topic 12: Method Overloading & Varargs (Verified: OverloadingMechanics.java, QueryBuilderApp.java on JDK 26.0.1)
- [x] Topic 13: Variable Scope & Local Variable Type Inference (`var`) (Verified: ScopeMechanics.java, TypeInferenceEngine.java on JDK 26.0.1)

### Section 5: Arrays & Memory Structure
- [x] Topic 14: One-Dimensional Arrays (Verified: ArrayMechanics.java, SensorBufferApp.java on JDK 26.0.1)
- [x] Topic 15: Multi-Dimensional Arrays & Arrays Utility (Verified: JaggedArrayDemo.java, FleetInventoryManager.java on JDK 26.0.1)

### Section 6: Object-Oriented Programming (OOP) Essentials
- [x] Topic 16: Classes, Objects & Memory Layout (Verified: ClassMemoryLayout.java, VehicleTelemetryApp.java on JDK 26.0.1)
- [x] Topic 17: Constructors & Object Initialization (Verified: ConstructorChainingDemo.java, ServerConfigurationApp.java on JDK 26.0.1)
- [x] Topic 18: Packages & Access Modifiers (Verified: AccessModifierDemo.java, SecurePaymentGateway.java on JDK 26.0.1)
- [x] Topic 19: Encapsulation & Data Integrity (Verified: EncapsulationMechanics.java, FinancialLedgerEntry.java on JDK 26.0.1)

### Section 7: OOP Inheritance, Polymorphism & Abstraction
- [x] Topic 20: Inheritance & Method Overriding (Verified: InheritanceMechanics.java, EmployeePayrollApp.java on JDK 26.0.1)
- [x] Topic 21: Polymorphism & Dynamic Method Dispatch (Verified: PolymorphismMechanics.java, NotificationDispatcherApp.java on JDK 26.0.1)
- [x] Topic 22: Abstract Classes & Methods (Verified: AbstractShapeDemo.java, ETLPipelineApp.java on JDK 26.0.1)
- [x] Topic 23: Interfaces & Modern Interface Evolution (Verified: InterfaceEvolutionDemo.java, CloudStorageService.java on JDK 26.0.1)
- [x] Topic 24: Nested, Inner, Local & Anonymous Classes (Verified: NestedClassMechanics.java, EventBrokerApp.java on JDK 26.0.1)
- [x] Topic 25: Enumerations (`enum`) (Verified: EnumMechanics.java, OrderStateMachineApp.java on JDK 26.0.1)

### Section 8: Modern Java Data Modeling
- [x] Topic 26: Records (Java 16+) (Verified: RecordMechanics.java, GeoLocationRecordApp.java on JDK 26.0.1)
- [x] Topic 27: Sealed Classes & Interfaces (Java 17+) (Verified: SealedClassMechanics.java, PaymentMethodHierarchyApp.java on JDK 26.0.1)
- [x] Topic 28: Pattern Matching (Java 16/21+) (Verified: PatternMatchingMechanics.java, FinancialEventMatcherApp.java on JDK 26.0.1)

### Section 9: Exception Handling
- [x] Topic 29: The Java Exception Hierarchy (Verified: ExceptionHierarchyDemo.java, ResilientServiceApp.java on JDK 26.0.1)
- [x] Topic 30: Checked vs Unchecked Exceptions (Verified: CheckedVsUncheckedDemo.java, FileOrderImporterApp.java on JDK 26.0.1)
- [x] Topic 31: Try-With-Resources & AutoCloseable (Verified: TryWithResourcesMechanics.java, DatabaseStreamExporterApp.java on JDK 26.0.1)
- [x] Topic 32: Custom Exceptions & Exception Chaining (Verified: CustomExceptionChainingDemo.java, BankingTransactionValidatorApp.java on JDK 26.0.1)

### Section 10: Generics & Collections Framework
- [x] Topic 33: Generics Fundamentals (Verified: GenericsFundamentalsDemo.java, TypeSafeRepositoryApp.java on JDK 26.0.1)
- [x] Topic 34: Generic Wildcards & PECS Principle (Verified: WildcardsPECSDemo.java, PipelineDataBufferApp.java on JDK 26.0.1)
- [x] Topic 35: The List Hierarchy (Verified: ListHierarchyDemo.java, OrderBatchProcessorApp.java on JDK 26.0.1)
- [x] Topic 36: The Set Hierarchy (Verified: SetHierarchyDemo.java, UniqueVisitorTrackerApp.java on JDK 26.0.1)
- [x] Topic 37: The Map Hierarchy (Verified: MapHierarchyDemo.java, InMemoryCacheServiceApp.java on JDK 26.0.1)
- [x] Topic 38: The Queue & Deque Hierarchy (Verified: QueueDequeDemo.java, JobSchedulerApp.java on JDK 26.0.1)
- [x] Topic 39: Comparable & Comparator (Verified: ComparableComparatorDemo.java, ProductCatalogRankingApp.java on JDK 26.0.1)

### Section 11: Functional Programming & Streams
- [x] Topic 40: Lambdas & Functional Interfaces (Verified: LambdaFunctionalInterfacesDemo.java, EventNotificationFilterApp.java on JDK 26.0.1)
- [x] Topic 41: Method References (Verified: MethodReferencesDemo.java, CustomerDataTransformerApp.java on JDK 26.0.1)
- [x] Topic 42: Stream API: Pipeline Fundamentals (Verified: StreamPipelineFundamentalsDemo.java, ServerLogAnalyticsApp.java on JDK 26.0.1)
- [x] Topic 43: Stream API: Terminal Operations & Collectors (Verified: StreamCollectorsDemo.java, FinancialTransactionAnalyticsApp.java on JDK 26.0.1)
- [x] Topic 44: Optional Type Handling (Verified: OptionalMechanicsDemo.java, UserProfileLookupServiceApp.java on JDK 26.0.1)

### Section 12: File I/O, NIO.2 & Date/Time
- [x] Topic 45: Classic I/O Streams (Verified: ClassicIoStreamsDemo.java, AuditLogRotatorApp.java on JDK 26.0.1)
- [x] Topic 46: Modern NIO.2 File Operations (Verified: ModernNioOperationsDemo.java, DirectoryTreeScannerApp.java on JDK 26.0.1)
- [x] Topic 47: Date and Time API (`java.time`) (Verified: DateTimeApiDemo.java, GlobalSlaDeadlineCalculatorApp.java on JDK 26.0.1)

### Section 13: Concurrency & Multithreading
- [x] Topic 48: Threads & Thread Lifecycle (Verified: ThreadLifecycleDemo.java, BatchWorkerSupervisorApp.java on JDK 26.0.1)
- [x] Topic 49: Synchronization & Memory Visibility (Verified: SynchronizationVisibilityDemo.java, DoubleCheckedLockingSingletonApp.java on JDK 26.0.1)
- [x] Topic 50: Explicit Locks & Concurrent Collections (Verified: ExplicitLocksAtomicsDemo.java, RateLimiterTokenBucketApp.java on JDK 26.0.1)
- [x] Topic 51: Executor Framework & Thread Pools (Verified: ThreadPoolExecutorDemo.java, ParallelImageBatchProcessorApp.java on JDK 26.0.1)
- [x] Topic 52: Asynchronous Pipelines with CompletableFuture (Verified: CompletableFuturePipelineDemo.java, MicroserviceAggregatorApp.java on JDK 26.0.1)
- [x] Topic 53: Virtual Threads (Java 21 Project Loom) (Verified: VirtualThreadsDemo.java, HighThroughputHttpSimulatorApp.java on JDK 26.0.1)
- [x] Topic 54: Structured Concurrency & Scoped Values (Verified: StructuredConcurrencyDemo.java, TravelBookingAggregatorApp.java on JDK 26.0.1)

### Section 14: JVM Internals & Memory Architecture
- [x] Topic 55: Java Memory Model (JMM) (Verified: MemoryLayoutRuntimeDemo.java, ObjectAllocationProfilerApp.java on JDK 26.0.1)
- [x] Topic 56: Garbage Collection Algorithms & Tuning (Verified: GarbageCollectionDemo.java, HeapPressureAnalyzerApp.java on JDK 26.0.1)
- [x] Topic 57: ClassLoaders & JIT Compilation (Verified: ClassLoaderHierarchyDemo.java, HotReloadPluginClassLoaderApp.java on JDK 26.0.1)

### Section 15: Reflection, Annotations & JPMS
- [x] Topic 58: Annotations & Metadata (Verified: AnnotationProcessingDemo.java, OrmEntityValidatorApp.java on JDK 26.0.1)
- [x] Topic 59: Reflection API (Verified: ReflectionMethodHandlesDemo.java, DynamicProxyLoggingApp.java on JDK 26.0.1)
- [x] Topic 60: Java Platform Module System (JPMS) (Verified: ModuleDescriptorDemo.java, ModularServicePluginApp.java on JDK 26.0.1)

### Section 16: Data Access & Build Tools
- [x] Topic 61: JDBC Fundamentals (Verified: JdbcFundamentalsDemo.java, BankingTransactionRepositoryApp.java on JDK 26.0.1)
- [x] Topic 62: Build Automation: Maven & Gradle (Verified: BuildToolLifecycleDemo.java, DependencyResolverSimulatorApp.java on JDK 26.0.1)

---

## Part 2: Java EE & Jakarta EE (Web Architecture & Enterprise Stack)

### Section 17: Web Architecture & The Jakarta EE Evolution
- [x] Topic 63: The Great Transition: Java EE to Jakarta EE (Verified: NamespaceTransitionInspectorDemo.java, ServerCompatibilityMatrixApp.java on Tomcat 10.1.61)
- [x] Topic 64: Web Architecture Fundamentals (HTTP Protocol) (Verified: HttpProtocolParserDemo.java, MockHttpServerDispatcherApp.java on JDK 26.0.1)

### Section 18: Web Containers & Packaging
- [x] Topic 65: Apache Tomcat & The WAR Structure (Verified: WarStructureValidatorDemo.java, TomcatDeploymentPackagerApp.java on Tomcat 10.1.61)

### Section 19: Servlets Deep Dive
- [x] Topic 66: Servlet Lifecycle & Architecture (Verified: LifecycleServlet.java on Tomcat 10.1.61)
- [x] Topic 67: Request & Response Processing (Verified: RequestInspectorServlet.java, OrderProcessingServlet.java on Tomcat 10.1.61)
- [x] Topic 68: Configuration: `@WebServlet` vs `web.xml` (Verified: ConfigDemoServlet.java, MultiMappingServlet.java on Tomcat 10.1.61)
- [x] Topic 69: Request Dispatching: Forward vs Include vs Redirect (Verified: DispatcherControllerServlet.java, ViewHandlerServlet.java on Tomcat 10.1.61)

### Section 20: State Management, Filters & Security
- [x] Topic 70: State Management: Sessions & Cookies (Verified: SessionShoppingCartServlet.java, CookieConsentServlet.java on Tomcat 10.1.61)
- [x] Topic 71: Servlet Filters & Filter Chains (Verified: RequestLoggingFilter.java, AuthGuardFilter.java on Tomcat 10.1.61)
- [x] Topic 72: Web Listeners (Verified: AppBootstrapListener.java, ActiveSessionTrackerListener.java on Tomcat 10.1.61)
- [x] Topic 73: Web Security Essentials (Verified: CsrfProtectionServlet.java, SecuritySanitizerApp.java on Tomcat 10.1.61 / JDK 26)

### Section 21: JavaServer Pages (JSP) & Templating
- [x] Topic 74: JSP Architecture & Translation (Verified: JspTranslationInspectorDemo.java on Tomcat 10.1.61)
- [x] Topic 75: JSP Syntax Elements (Verified: syntax-elements.jsp on Tomcat 10.1.61)
- [x] Topic 76: JSP Implicit Objects & Standard Actions (Verified: UserProfileBean.java, implicit-objects.jsp on Tomcat 10.1.61)
- [x] Topic 77: Expression Language (EL) & JSTL (Verified: ExpressionLanguageEvaluatorDemo.java on JDK 26.0.1 / Tomcat 10.1.61)
- [x] Topic 78: Custom JSP Tag Libraries (Verified: FormatCurrencyTag.java, handbook-tags.tld on Tomcat 10.1.61)

### Section 22: Production Web Development
- [x] Topic 79: The Web MVC Pattern (Verified: Product.java, ProductCatalogServlet.java, MvcArchitectureDemo.java on Tomcat 10.1.61)
- [x] Topic 80: Form Handling, Validation & File Uploads (Verified: FileUploadServlet.java, FormValidationServiceDemo.java on Tomcat 10.1.61)
- [x] Topic 81: Error Pages & Exception Handling (Verified: error-404.jsp, error-500.jsp, FaultTriggerServlet.java, ErrorHandlingDispatcherDemo.java on Tomcat 10.1.61)
- [x] Topic 82: JDBC Connection Pooling in Web Apps (Verified: ConnectionPoolLifecycleListener.java, DatabaseHealthCheckServlet.java, ConnectionPoolSimulatorDemo.java on Tomcat 10.1.61 / SQLite JDBC)

### Section 23: Jakarta EE Enterprise Stack Overview
- [x] Topic 83: Jakarta Persistence (JPA) & Hibernate (Verified: JpaEntityDemo.java on JDK 26.0.1)
- [x] Topic 84: Jakarta Contexts and Dependency Injection (CDI) (Verified: CdiDependencyInjectionDemo.java on JDK 26.0.1)
- [x] Topic 85: Jakarta RESTful Web Services (JAX-RS) (Verified: JaxRsEndpointDemo.java on JDK 26.0.1)
- [x] Topic 86: Jakarta Bean Validation (Verified: BeanValidationDemo.java on JDK 26.0.1)
- [x] Topic 87: Jakarta Faces (JSF) & Enterprise Beans (EJB) (Verified: JsfEjbArchitectureDemo.java on JDK 26.0.1)
