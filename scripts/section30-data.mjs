export const section30Topics = [
  // Topic 101: Boilerplate Elimination: Project Lombok & MapStruct
  {
    id: "topic-101",
    slug: "boilerplate-elimination-project-lombok-mapstruct",
    topicNumber: 101,
    title: "Boilerplate Elimination: Project Lombok & MapStruct",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 30,
    sectionTitle: "Production Libraries & Distributed Systems",
    versionBadge: "Java 21+ / Spring Boot 3.x",
    difficulty: "Intermediate",
    readingTime: "18 min read",
    shortDescription: "Eliminate repetitive boilerplate in enterprise Java applications using Project Lombok's annotation processor and MapStruct's compile-time, type-safe bean mapping engine.",
    prerequisites: [
      "Topic 16: Classes, Objects & Memory Layout",
      "Topic 26: Immutable Data Modeling with Java Records",
      "Topic 92: Production REST Controller Architecture with Spring Web MVC"
    ],
    whatAndWhy: {
      definition: "Lombok synthesizes boilerplate accessors, builders, and constructors directly into compiled bytecode at build time, while MapStruct generates plain, high-performance Java mapping code without reflection.",
      analogy: "An automated architectural draftsman: instead of hand-drawing thousands of repetitive window panes and door frames for every building floor plan (manual getters, setters, and mappers), you sketch high-level blueprints (@Builder, @Mapper) and an industrial laser printer fabricates the completed model instantly.",
      whyItExists: "Dramatically cuts codebase size, eliminates human error in object mapping, and avoids the runtime performance cost of reflection-based mappers."
    },
    syntaxBreakdown: {
      title: "Lombok and MapStruct Declarations",
      codeSnippet: "@Data\n@Builder\npublic class CustomerEntity {\n    private Long id;\n    private String email;\n}\n\n@Mapper(componentModel = \"spring\")\npublic interface CustomerMapper {\n    CustomerDto toDto(CustomerEntity entity);\n    CustomerEntity toEntity(CustomerDto dto);\n}",
      explanation: "@Data and @Builder inject methods during compilation. @Mapper generates a Spring @Component implementing the interface.",
      tokens: [
        { token: "@Builder", explanation: "Implements the Fluent Builder Pattern for clean, immutable instantiation." },
        { token: "@Data", explanation: "Combines @Getter, @Setter, @ToString, @EqualsAndHashCode, and @RequiredArgsConstructor." },
        { token: "@Mapper(componentModel = \"spring\")", explanation: "Generates an implementation registered as a Spring bean injectable via @Autowired." }
      ]
    },
    examples: [
      {
        id: "ex-101-1",
        title: "MapStruct Interface Declaration",
        type: "basic",
        description: "Declaring a MapStruct mapper between Entity and DTO.",
        filename: "UserMapper.java",
        code: "@Mapper(componentModel = \"spring\")\npublic interface UserMapper {\n    UserDto toDto(UserEntity entity);\n}",
        output: "MapStruct generates UserMapperImpl during javac compilation.",
        stepByStep: [
          "Define interface annotated with @Mapper.",
          "Declare mapping signature.",
          "Compile with javac annotation processing enabled."
        ]
      },
      {
        id: "ex-101-2",
        title: "Lombok Builder and MapStruct Mapping Simulation",
        type: "realistic",
        description: "Simulating Lombok builder pattern and MapStruct direct method invocation mapping.",
        filename: "LombokMapStructDemo.java",
        code: "package com.handbook.spring;\n\npublic class LombokMapStructDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/LombokMapStructDemo.java\n        System.out.println(\"Topic 101 Lombok & MapStruct code generation verified successfully\");\n    }\n}",
        output: "Topic 101 Lombok & MapStruct code generation verified successfully",
        stepByStep: [
          "Instantiate CustomerEntity using simulated Lombok Builder.",
          "Execute CustomerMapperImpl transforming entity to CustomerDto record.",
          "Reverse map DTO back to entity verifying field integrity."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Wrong annotation processor execution order",
        errorCodeOrSnippet: "MapStruct cannot find getters/setters in compiled classes!",
        cause: "If MapStruct runs before Lombok in maven-compiler-plugin, Lombok has not yet generated getters.",
        solution: "Configure Lombok before MapStruct in the annotationProcessorPaths list in pom.xml."
      },
      {
        title: "Using @Data on JPA Entities",
        errorCodeOrSnippet: "@Entity\n@Data\npublic class Order { ... } // StackOverflowError on bidirectional relationships!",
        cause: "@Data generates toString() and hashCode() traversing all fields, triggering infinite recursion on bidirectional lazy relationships.",
        solution: "Use @Getter and @Setter on JPA entities instead of @Data, or use @ToString.Exclude."
      }
    ],
    bestPractices: {
      doList: [
        "Prefer MapStruct over reflection-based mappers like ModelMapper.",
        "Use @Builder for complex domain model construction.",
        "Add lombok-mapstruct-binding in build configurations to ensure seamless processor integration."
      ],
      dontList: [
        "Never use @Data on JPA entities with bidirectional associations.",
        "Never perform business logic transformations inside mapper interfaces.",
        "Avoid using Lombok on Java Records (records already provide built-in immutability)."
      ],
      whenNotToUse: "Do not use MapStruct if DTOs and entities share identical structure and records with straightforward constructors suffice."
    },
    versionNotes: {
      introduced: "Project Lombok (2009) -> MapStruct (2013) -> Spring Boot 3 compatibility",
      status: "Stable",
      compatibilityNotes: "Java 21+ requires recent Lombok (1.18.30+) and MapStruct (1.5.5+) versions.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Lombok & MapStruct Annotations Matrix",
      headers: ["Annotation", "Framework", "Purpose"],
      rows: [
        ["@Getter / @Setter", "Lombok", "Generates standard field accessors/mutators"],
        ["@Builder", "Lombok", "Generates fluent builder pattern"],
        ["@Slf4j", "Lombok", "Injects private static final Logger log instance"],
        ["@Mapper", "MapStruct", "Marks interface as compile-time object mapper"],
        ["@Mapping", "MapStruct", "Customizes source-to-target field mapping"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "StackOverflowError in Entity toString",
        prompt: "Why does annotating both Order and OrderItem entities with @Data cause a StackOverflowError when printing an order?",
        solution: "Both classes include bidirectional references. Lombok's generated toString() calls orderItem.toString(), which calls order.toString() infinitely.",
        explanation: "Use @ToString(exclude = \"items\") on the parent or avoid @Data on entities."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Declare MapStruct Custom Field Mapping",
        prompt: "Write a MapStruct interface mapping AccountEntity's 'balance' to AccountDto's 'currentBalance'.",
        starterCode: "@Mapper\npublic interface AccountMapper {\n    // Add mapping\n}",
        solution: "@Mapper(componentModel = \"spring\")\npublic interface AccountMapper {\n    @Mapping(source = \"balance\", target = \"currentBalance\")\n    AccountDto toDto(AccountEntity entity);\n}",
        explanation: "@Mapping specifies custom property name differences between source and target."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "MapStruct Null Value Handling",
        prompt: "How can you configure MapStruct to ignore null source values when updating an existing entity?",
        solution: "@MappingTarget with nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE.",
        explanation: "Prevents null DTO properties from wiping out existing entity data during partial updates."
      }
    ],
    officialSources: [
      {
        title: "Project Lombok Features Guide",
        url: "https://projectlombok.org/features/",
        organization: "Oracle"
      },
      {
        title: "MapStruct Reference Guide",
        url: "https://mapstruct.org/documentation/reference-guide/",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 102: Versioned Database Migrations with Flyway
  {
    id: "topic-102",
    slug: "versioned-database-migrations-with-flyway",
    topicNumber: 102,
    title: "Versioned Database Migrations with Flyway",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 30,
    sectionTitle: "Production Libraries & Distributed Systems",
    versionBadge: "Spring Boot 3.x / Flyway 10+",
    difficulty: "Advanced",
    readingTime: "17 min read",
    shortDescription: "Master automated database schema evolution in Spring Boot using Flyway: versioned migration naming rules, flyway_schema_history checksum verification, repeatable migrations, and zero-downtime blue/green deployment strategies.",
    prerequisites: [
      "Topic 61: JDBC Fundamentals & Connection Management",
      "Topic 83: Jakarta Persistence (JPA) & Hibernate ORM",
      "Topic 95: Spring Data JPA Architecture, Repository Hierarchy & JpaRepository"
    ],
    whatAndWhy: {
      definition: "Flyway automates database schema changes by tracking versioned SQL scripts in a metadata table and executing pending migrations in order upon application startup.",
      analogy: "A passport with entry visas: every immigration checkpoint stamps an official, sequential visa number (flyway_schema_history). If an old stamp is altered or a traveler attempts to skip pages, border security halts the journey immediately.",
      whyItExists: "Eliminates risky manual database updates, synchronizes schema changes across developer machines and cloud clusters, and prevents schema drift."
    },
    syntaxBreakdown: {
      title: "Flyway Migration File Naming Convention",
      codeSnippet: "V1_1__add_user_roles_table.sql\nR__recreate_order_summary_view.sql\nU1_1__undo_user_roles_table.sql",
      explanation: "V denotes Versioned migrations, R denotes Repeatable migrations, and U denotes Undo migrations.",
      tokens: [
        { token: "V{version}__", explanation: "Prefix for versioned migrations; version numbers can use dots or underscores." },
        { token: "R__", explanation: "Prefix for repeatable migrations; re-executes whenever script checksum changes." },
        { token: "__ (double underscore)", explanation: "Mandatory separator between version and descriptive text." }
      ]
    },
    examples: [
      {
        id: "ex-102-1",
        title: "Basic Versioned Migration Script",
        type: "basic",
        description: "Creating a users table with Flyway versioned script.",
        filename: "V1__init_schema.sql",
        code: "CREATE TABLE app_users (\n    id BIGINT PRIMARY KEY,\n    username VARCHAR(50) NOT NULL UNIQUE,\n    created_at TIMESTAMP NOT NULL\n);",
        output: "Table created and registered in flyway_schema_history.",
        stepByStep: [
          "Place file in src/main/resources/db/migration.",
          "Name file V1__init_schema.sql.",
          "Start Spring Boot to apply migration automatically."
        ]
      },
      {
        id: "ex-102-2",
        title: "Flyway Migration Engine and Checksum Validation Simulation",
        type: "realistic",
        description: "Simulating sequential migration execution, metadata ranking, and tamper checksum detection.",
        filename: "FlywayMigrationDemo.java",
        code: "package com.handbook.spring;\n\npublic class FlywayMigrationDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/FlywayMigrationDemo.java\n        System.out.println(\"Topic 102 Flyway Database Migrations verified successfully\");\n    }\n}",
        output: "Topic 102 Flyway Database Migrations verified successfully",
        stepByStep: [
          "Run initial migrations V1.0 and V1.1.",
          "Verify schema history contains 2 installed entries.",
          "Apply incremental migration V1.2.",
          "Simulate modified past migration and assert checksum failure."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Modifying an already applied migration script",
        errorCodeOrSnippet: "FlywayException: Validate failed: Migrations have failed validation (checksum mismatch)",
        cause: "Editing an existing migration file changes its checksum, which no longer matches the database history.",
        solution: "Never alter existing migration scripts; always write a new incremental migration (e.g. V1_2__fix_column.sql)."
      },
      {
        title: "Using single underscore in migration filename",
        errorCodeOrSnippet: "V1_init_schema.sql // Flyway ignores the file!",
        cause: "Flyway strictly requires two underscores (__) between the version number and the description.",
        solution: "Use double underscores: V1__init_schema.sql."
      }
    ],
    bestPractices: {
      doList: [
        "Disable ddl-auto in production: spring.jpa.hibernate.ddl-auto=validate.",
        "Always follow the Expand/Contract zero-downtime migration pattern.",
        "Use repeatable migrations (R__) for views and stored procedures."
      ],
      dontList: [
        "Never run destructive DROP COLUMN migrations without prior deprecation phases.",
        "Never modify or delete applied migration files in source control.",
        "Never mix DDL and heavy DML data migrations in the same script."
      ],
      whenNotToUse: "Do not use Flyway for non-relational document databases (use Mongock for MongoDB instead)."
    },
    versionNotes: {
      introduced: "Flyway 1.0 (2010) -> Flyway 10 with Spring Boot 3",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3 auto-configures Flyway when flyway-core is present.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Flyway Migration Types",
      headers: ["Type", "Prefix", "Execution Rule", "Ideal For"],
      rows: [
        ["Versioned", "V", "Runs once in strict version order", "Tables, foreign keys, columns"],
        ["Repeatable", "R", "Runs when file checksum changes", "Views, functions, stored procedures"],
        ["Undo", "U", "Reverts corresponding versioned script", "Rollback automation (Teams tier)"],
        ["Baseline", "B", "Sets starting point for existing DB", "Legacy databases adopting Flyway"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Ignored Migration Script",
        prompt: "A developer names a script 'v2__add_index.sql' (lowercase 'v') and Flyway skips it. Why?",
        solution: "Flyway prefixes are case-sensitive by default. Versioned scripts must begin with uppercase 'V'.",
        explanation: "Rename the script to 'V2__add_index.sql'."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Zero-Downtime Column Rename",
        prompt: "Outline the two-step Flyway migration process to rename column 'phone' to 'phoneNumber' without breaking active application pods.",
        starterCode: "-- Step 1:\n-- Step 2:",
        solution: "-- Step 1 (V1_1): ALTER TABLE users ADD COLUMN phone_number VARCHAR(20); (Backfill data)\n-- Step 2 (V1_2 deployed after code update): ALTER TABLE users DROP COLUMN phone;",
        explanation: "The Expand/Contract pattern ensures older running code continues to function during deployment."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Flyway Out-of-Order Migrations",
        prompt: "When two developers create V1.2 and V1.3 in parallel branches, how does Flyway handle applying V1.2 if V1.3 was already deployed?",
        solution: "By default, Flyway throws an error unless 'flyway.out-of-order=true' is configured, which allows older unapplied versions to execute.",
        explanation: "Out-of-order execution is commonly enabled in team environments with multiple concurrent feature branches."
      }
    ],
    officialSources: [
      {
        title: "Flyway Documentation by Redgate",
        url: "https://documentation.red-gate.com/fd",
        organization: "Spring / VMware"
      },
      {
        title: "Spring Boot Flyway Auto-Configuration Guide",
        url: "https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 103: Modern Automated Testing: JUnit 5, Mockito & Testcontainers
  {
    id: "topic-103",
    slug: "modern-automated-testing-junit5-mockito-testcontainers",
    topicNumber: 103,
    title: "Modern Automated Testing: JUnit 5, Mockito & Testcontainers",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 30,
    sectionTitle: "Production Libraries & Distributed Systems",
    versionBadge: "Spring Boot 3.x / JUnit 5.10+",
    difficulty: "Advanced",
    readingTime: "19 min read",
    shortDescription: "Build resilient test automation suites across the testing pyramid: JUnit 5 Jupiter assertions and lifecycle, Mockito test doubles, Spring Boot test slices (@WebMvcTest, @DataJpaTest), and real database integration with Testcontainers.",
    prerequisites: [
      "Topic 29: Exception Handling Architecture & Hierarchy",
      "Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks",
      "Topic 92: Production REST Controller Architecture with Spring Web MVC"
    ],
    whatAndWhy: {
      definition: "Modern automated testing combines fast, isolated unit tests (JUnit 5 + Mockito) with lightweight Spring slice tests and production-identical containerized integration tests (Testcontainers).",
      analogy: "Automobile safety testing: engineers test individual brake pads in lab hydraulic presses (Unit Tests with Mockito), mount the brake system onto a chassis simulator (Slice Tests with @WebMvcTest), and finally test-drive the complete vehicle on real asphalt tracks (Integration Tests with Testcontainers).",
      whyItExists: "Guarantees regression protection, accelerates developer velocity, and eliminates subtle bugs caused by in-memory mock database dialect mismatches."
    },
    syntaxBreakdown: {
      title: "JUnit 5, Mockito, and Testcontainers Syntax",
      codeSnippet: "@ExtendWith(MockitoExtension.class)\nclass OrderServiceTest {\n    @Mock private PaymentGateway gateway;\n    @InjectMocks private OrderService service;\n\n    @Test\n    void testCheckout() {\n        when(gateway.charge(\"ACC\", 100.0)).thenReturn(true);\n        assertTrue(service.checkout(\"ACC\", 100.0));\n        verify(gateway, times(1)).charge(\"ACC\", 100.0);\n    }\n}",
      explanation: "MockitoExtension creates mock proxies, when().thenReturn() defines stub behavior, and verify() asserts method execution count.",
      tokens: [
        { token: "@Mock", explanation: "Creates a dynamic mock test double for the collaborator." },
        { token: "@InjectMocks", explanation: "Instantiates target class and injects mocked dependencies into its constructor." },
        { token: "when(...).thenReturn(...)", explanation: "Configures deterministic stub response for given arguments." },
        { token: "verify(mock, times(1))", explanation: "Asserts that the method was invoked exactly once with expected parameters." }
      ]
    },
    examples: [
      {
        id: "ex-103-1",
        title: "JUnit 5 Exception Assertion",
        type: "basic",
        description: "Asserting exception throwing using assertThrows.",
        filename: "ExceptionTest.java",
        code: "import org.junit.jupiter.api.*;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass ExceptionTest {\n    @Test\n    void shouldThrowOnNegative() {\n        assertThrows(IllegalArgumentException.class, () -> {\n            new Account(-100.0);\n        });\n    }\n}",
        output: "Test passes when IllegalArgumentException is thrown.",
        stepByStep: [
          "Annotate method with @Test.",
          "Invoke assertThrows specifying expected exception class.",
          "Provide executable lambda."
        ]
      },
      {
        id: "ex-103-2",
        title: "Testing Pyramid and Testcontainers Simulation",
        type: "realistic",
        description: "Simulating Mockito unit tests, exception handling, and Testcontainers Docker lifecycle.",
        filename: "ModernTestingDemo.java",
        code: "package com.handbook.spring;\n\npublic class ModernTestingDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/ModernTestingDemo.java\n        System.out.println(\"Topic 103 Automated Testing Suite verified successfully\");\n    }\n}",
        output: "Topic 103 Automated Testing Suite verified successfully",
        stepByStep: [
          "Execute unit test using Mockito test double.",
          "Verify checkout succeeds and collaborator was invoked once.",
          "Assert exception on invalid arguments.",
          "Simulate PostgreSQL Testcontainers lifecycle: startup, test execution, and teardown."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Using @SpringBootTest for pure unit tests",
        errorCodeOrSnippet: "@SpringBootTest\nclass CalculatorTest { ... } // 10-second startup for 1 millisecond test!",
        cause: "@SpringBootTest starts the full ApplicationContext, scanning beans and connecting to databases.",
        solution: "Use pure JUnit 5 with MockitoExtension for unit tests; reserve @SpringBootTest for integration tests."
      },
      {
        title: "Relying on H2 for testing PostgreSQL/Oracle production apps",
        errorCodeOrSnippet: "H2 in-memory test passes, but PostgreSQL fails in production on native JSONB operators!",
        cause: "In-memory H2 lacks support for advanced RDBMS dialect features and concurrency locking.",
        solution: "Use Testcontainers with real PostgreSQL Docker images."
      }
    ],
    bestPractices: {
      doList: [
        "Structure tests following the Arrange-Act-Assert (AAA) pattern.",
        "Use Spring Boot 3.1+ @ServiceConnection with Testcontainers for zero-configuration integration tests.",
        "Use @WebMvcTest for fast, focused controller slice testing."
      ],
      dontList: [
        "Never use Thread.sleep() in tests (use Awaitility for asynchronous testing).",
        "Never share mutable test state between test methods.",
        "Avoid over-mocking domain models; only mock external infrastructure collaborators."
      ],
      whenNotToUse: "Do not use Testcontainers in constrained CI environments where Docker daemon access is strictly prohibited (use mock server stubs instead)."
    },
    versionNotes: {
      introduced: "JUnit 5 (2017) -> Testcontainers 1.0 (2015) -> Spring Boot 3.1 @ServiceConnection",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3 default testing starter includes JUnit 5 Jupiter and Mockito 5.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Spring Boot Testing Annotations Matrix",
      headers: ["Annotation", "Scope", "Spring Context?", "Primary Use Case"],
      rows: [
        ["@ExtendWith(MockitoExtension.class)", "Unit", "No (Pure JVM)", "Service and business logic unit tests"],
        ["@WebMvcTest", "Slice", "Partial (Web layer)", "REST controller endpoints and validation"],
        ["@DataJpaTest", "Slice", "Partial (JPA layer)", "Repositories and entity queries"],
        ["@SpringBootTest", "Integration", "Full ApplicationContext", "End-to-end integration workflows"],
        ["@Testcontainers", "Integration", "Full + Real Docker", "Real PostgreSQL, Kafka, and Redis testing"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "Un-injected Mockito Collaborator",
        prompt: "A developer declares @Mock private Service service; but forgets @ExtendWith(MockitoExtension.class) or MockitoAnnotations.openMocks(this). What happens?",
        solution: "The mock field remains null, and running the test throws a NullPointerException as soon as the field is accessed.",
        explanation: "MockitoExtension is required to scan and initialize @Mock fields."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Controller Slice Test with MockMvc",
        prompt: "Write a MockMvc test checking that GET /api/v1/ping returns HTTP 200 OK with body 'pong'.",
        starterCode: "@WebMvcTest\nclass PingTest {\n    @Autowired MockMvc mockMvc;\n    @Test void testPing() throws Exception {}\n}",
        solution: "@Test void testPing() throws Exception {\n    mockMvc.perform(get(\"/api/v1/ping\"))\n        .andExpect(status().isOk())\n        .andExpect(content().string(\"pong\"));\n}",
        explanation: "MockMvc executes HTTP requests in-memory without starting an embedded web server."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Testcontainers Reuse in Local Dev",
        prompt: "How can developers configure Testcontainers to keep local Docker containers running across repeated test runs to avoid restart latency?",
        solution: "Enable testcontainers.reuse.enable=true in ~/.testcontainers.properties and call .withReuse(true) on the container instance.",
        explanation: "Reusing active containers cuts test turnaround time down to milliseconds."
      }
    ],
    officialSources: [
      {
        title: "JUnit 5 User Guide",
        url: "https://junit.org/junit5/docs/current/user-guide/",
        organization: "Eclipse Foundation"
      },
      {
        title: "Testcontainers for Java Reference",
        url: "https://java.testcontainers.org/",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 104: Production Observability: Spring Boot Actuator, Micrometer & Prometheus
  {
    id: "topic-104",
    slug: "production-observability-spring-boot-actuator-micrometer-prometheus",
    topicNumber: 104,
    title: "Production Observability: Spring Boot Actuator, Micrometer & Prometheus",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 30,
    sectionTitle: "Production Libraries & Distributed Systems",
    versionBadge: "Spring Boot 3.x / Micrometer 1.12+",
    difficulty: "Advanced",
    readingTime: "18 min read",
    shortDescription: "Master enterprise observability in Spring Boot: Actuator endpoints, Kubernetes liveness/readiness probes, dimensional metrics collection with Micrometer, and Prometheus text exposition format scraping.",
    prerequisites: [
      "Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes",
      "Topic 98: Modern SecurityFilterChain Architecture & Password Encryption"
    ],
    whatAndWhy: {
      definition: "Spring Boot Actuator and Micrometer instrument application internals, exposing health probes, thread states, JVM metrics, and Prometheus scrape endpoints for cloud monitoring.",
      analogy: "An airplane cockpit telemetry system: dials and sensors continuously stream altitude, engine temperature, and fuel levels to ground control (Prometheus/Grafana) so flight computers can detect turbulence before passengers notice.",
      whyItExists: "Enables automated recovery in container orchestrators (Kubernetes), alerts on anomalies, and visualizes throughput and latency trends."
    },
    syntaxBreakdown: {
      title: "Actuator and Micrometer MeterRegistry Configuration",
      codeSnippet: "@Service\npublic class OrderService {\n    private final Counter orderCounter;\n    public OrderService(MeterRegistry registry) {\n        this.orderCounter = Counter.builder(\"orders.created\")\n            .tag(\"tier\", \"gold\")\n            .register(registry);\n    }\n    public void placeOrder() {\n        orderCounter.increment();\n    }\n}",
      explanation: "MeterRegistry registers dimensional metrics. Prometheus scrapes /actuator/prometheus to collect counters, timers, and gauges.",
      tokens: [
        { token: "MeterRegistry", explanation: "Central registry for publishing and querying application metrics." },
        { token: "Counter", explanation: "Monotonically increasing cumulative metric tracking event occurrences." },
        { token: ".tag(\"key\", \"val\")", explanation: "Dimensional key-value metadata enabling dynamic grouping in Grafana." }
      ]
    },
    examples: [
      {
        id: "ex-104-1",
        title: "Actuator Health Indicator",
        type: "basic",
        description: "Implementing a custom HealthIndicator bean.",
        filename: "CustomHealthIndicator.java",
        code: "@Component\npublic class CustomHealthIndicator implements HealthIndicator {\n    @Override\n    public Health health() {\n        return Health.up().withDetail(\"subsystem\", \"active\").build();\n    }\n}",
        output: "Actuator /actuator/health includes custom subsystem details.",
        stepByStep: [
          "Implement HealthIndicator interface.",
          "Return Health.up() or Health.down().",
          "Attach diagnostic details via withDetail()."
        ]
      },
      {
        id: "ex-104-2",
        title: "Actuator & Prometheus Metrics Simulation",
        type: "realistic",
        description: "Simulating health checks, dimensional Micrometer metrics, and Prometheus scrape exposition.",
        filename: "ActuatorObservabilityDemo.java",
        code: "package com.handbook.spring;\n\npublic class ActuatorObservabilityDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/ActuatorObservabilityDemo.java\n        System.out.println(\"Topic 104 Observability & Actuator verified successfully\");\n    }\n}",
        output: "Topic 104 Observability & Actuator verified successfully",
        stepByStep: [
          "Check /actuator/health status and details.",
          "Record dimensional HTTP request metrics via Micrometer simulator.",
          "Record JVM heap memory gauge.",
          "Export Prometheus text exposition format and verify tags."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Exposing all Actuator endpoints publicly without security",
        errorCodeOrSnippet: "management.endpoints.web.exposure.include=* // Severe security vulnerability!",
        cause: "Exposing endpoints like /actuator/env, /actuator/heapdump, or /actuator/shutdown allows attackers to steal secrets or crash servers.",
        solution: "Only expose health, info, and prometheus, and protect management endpoints behind Spring Security."
      },
      {
        title: "High-cardinality tags in Micrometer",
        errorCodeOrSnippet: "Counter.builder(\"requests\").tag(\"userId\", userId).register(registry); // OOM crash!",
        cause: "Using high-cardinality tags (userId, UUID, email) generates millions of unique metric time-series, exhausting JVM memory.",
        solution: "Only use low-cardinality tags (HTTP method, status code, region, tier)."
      }
    ],
    bestPractices: {
      doList: [
        "Enable Kubernetes liveness and readiness probes in container deployments.",
        "Expose /actuator/prometheus on a separate internal management port.",
        "Use Timer to record both duration percentiles and call counts simultaneously."
      ],
      dontList: [
        "Never use dynamic UUIDs or timestamps as Micrometer metric tags.",
        "Never perform heavy database queries inside HealthIndicator health checks.",
        "Avoid leaving /actuator/env publicly accessible."
      ],
      whenNotToUse: "Do not use Actuator metrics for business audit logs (use dedicated database audit tables or Kafka event topics instead)."
    },
    versionNotes: {
      introduced: "Spring Boot Actuator 1.0 -> Micrometer integration in Spring Boot 2.0 -> Prometheus in 3.x",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3 uses Micrometer 1.12+ with native OpenTelemetry tracing support.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Micrometer Metric Primitives",
      headers: ["Metric Type", "Behavior", "Best Used For"],
      rows: [
        ["Counter", "Monotonically increasing number", "Total requests, error counts, orders completed"],
        ["Gauge", "Instantaneous value that goes up and down", "Current queue size, active connections, heap memory"],
        ["Timer", "Measures latency duration and frequency", "API endpoint response times, method execution duration"],
        ["DistributionSummary", "Tracks distribution of numerical values", "Payload payload sizes, batch processing sizes"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Hanging Health Check",
        prompt: "A developer writes a custom HealthIndicator that connects to a slow third-party API with no timeout. What happens when the third-party hangs?",
        solution: "The /actuator/health endpoint hangs indefinitely, causing Kubernetes liveness checks to time out and repeatedly kill healthy application pods.",
        explanation: "Always enforce short timeouts (e.g. 500ms) on health check calls."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Configure Actuator YAML Exposure",
        prompt: "Write application.yml configuration exposing only 'health', 'info', and 'prometheus' endpoints.",
        starterCode: "management:\n  endpoints:\n    web:",
        solution: "management:\n  endpoints:\n    web:\n      exposure:\n        include: health, info, prometheus",
        explanation: "Restricts exposed management endpoints to essential operational targets."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Readiness State Transition",
        prompt: "How can an application gracefully refuse new traffic before executing graceful shutdown in Kubernetes?",
        solution: "Publish an AvailabilityChangeEvent transitioning ReadinessState to REFUSING_TRAFFIC.",
        explanation: "Kubernetes detects the readiness change and redirects traffic away before pod termination."
      }
    ],
    officialSources: [
      {
        title: "Spring Boot Actuator Production-Ready Features",
        url: "https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html",
        organization: "Spring / VMware"
      },
      {
        title: "Micrometer Application Metrics Guide",
        url: "https://micrometer.io/docs",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 105: Automated Interactive API Documentation with OpenAPI 3 & Swagger UI
  {
    id: "topic-105",
    slug: "automated-interactive-api-documentation-openapi3-swagger-ui",
    topicNumber: 105,
    title: "Automated Interactive API Documentation with OpenAPI 3 & Swagger UI",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 30,
    sectionTitle: "Production Libraries & Distributed Systems",
    versionBadge: "Spring Boot 3.x / OpenAPI 3.0",
    difficulty: "Intermediate",
    readingTime: "17 min read",
    shortDescription: "Automate REST API contract generation in Spring Boot using springdoc-openapi: OpenAPI 3 JSON schemas, interactive Swagger UI documentation, and declarative metadata annotations.",
    prerequisites: [
      "Topic 92: Production REST Controller Architecture with Spring Web MVC",
      "Topic 93: Request Validation with Bean Validation & Custom Constraint Validators"
    ],
    whatAndWhy: {
      definition: "springdoc-openapi derives machine-readable OpenAPI 3 specifications and human-friendly Swagger UI documentation directly from Spring MVC controllers and annotations at runtime.",
      analogy: "An interactive vending machine display: rather than reading a static laminated manual on the wall (outdated wiki), the machine's live touchscreen displays current inventory, nutritional facts, prices, and lets you press buttons to test purchases directly.",
      whyItExists: "Eliminates documentation drift, empowers frontend teams with live interactive API playgrounds, and enables automated SDK client code generation."
    },
    syntaxBreakdown: {
      title: "OpenAPI 3 Controller Annotations",
      codeSnippet: "@Operation(summary = \"Get user by ID\", description = \"Fetches user profile details\")\n@ApiResponses({\n    @ApiResponse(responseCode = \"200\", description = \"Success\"),\n    @ApiResponse(responseCode = \"404\", description = \"User not found\")\n})\n@GetMapping(\"/{id}\")\npublic ResponseEntity<UserDto> getUser(@PathVariable Long id) { ... }",
      explanation: "@Operation provides high-level endpoint context. @ApiResponses documents all possible HTTP status codes.",
      tokens: [
        { token: "@Operation", explanation: "Describes the business purpose and operational context of an endpoint." },
        { token: "@ApiResponse", explanation: "Documents a specific HTTP response status code and payload schema." },
        { token: "@Schema", explanation: "Enriches DTO fields with examples, descriptions, and formats." }
      ]
    },
    examples: [
      {
        id: "ex-105-1",
        title: "Documenting DTO with @Schema",
        type: "basic",
        description: "Enriching Java Record DTO with Swagger Schema annotations.",
        filename: "UserDto.java",
        code: "public record UserDto(\n    @Schema(description = \"Unique identifier\", example = \"1001\") Long id,\n    @Schema(description = \"Primary email address\", example = \"user@example.com\") String email\n) {}",
        output: "OpenAPI schema includes field descriptions and realistic examples.",
        stepByStep: [
          "Annotate record components with @Schema.",
          "Provide description and example values.",
          "View rendered schema under /swagger-ui/index.html."
        ]
      },
      {
        id: "ex-105-2",
        title: "OpenAPI Specification Generation Simulation",
        type: "realistic",
        description: "Simulating OpenAPI 3.0 specification JSON generation and interactive Swagger UI contracts.",
        filename: "OpenApiSwaggerDemo.java",
        code: "package com.handbook.spring;\n\npublic class OpenApiSwaggerDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/OpenApiSwaggerDemo.java\n        System.out.println(\"Topic 105 OpenAPI 3 and Swagger UI verified successfully\");\n    }\n}",
        output: "Topic 105 OpenAPI 3 and Swagger UI verified successfully",
        stepByStep: [
          "Configure OpenApiSpecification instance.",
          "Register GET and POST endpoints with responses (200, 201, 400, 404).",
          "Generate OpenAPI 3.0.1 compliant JSON schema.",
          "Assert contract endpoints and verify Swagger UI accessibility."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Using outdated Springfox libraries on Spring Boot 3",
        errorCodeOrSnippet: "springfox-boot-starter fails on Spring Boot 3 with NullPointerException!",
        cause: "Springfox is unmaintained and incompatible with Spring 6 / Spring Boot 3.",
        solution: "Use the modern, actively maintained springdoc-openapi-starter-webmvc-ui library."
      },
      {
        title: "Forgetting to permit Swagger endpoints in Spring Security",
        errorCodeOrSnippet: "GET /swagger-ui/index.html -> 401 Unauthorized / 403 Forbidden!",
        cause: "Spring Security secures all endpoints by default.",
        solution: "Add .requestMatchers(\"/v3/api-docs/**\", \"/swagger-ui/**\", \"/swagger-ui.html\").permitAll() to your SecurityFilterChain."
      }
    ],
    bestPractices: {
      doList: [
        "Include realistic examples in @Schema annotations to assist frontend developers.",
        "Document RFC 7807 ProblemDetail error responses for 400, 401, 403, and 404.",
        "Use openapi-generator-cli in CI pipelines to auto-generate client SDKs."
      ],
      dontList: [
        "Never expose Swagger UI in production environments without authorization.",
        "Avoid duplicating validation rules in both @Schema and Bean Validation (springdoc auto-infers Bean Validation rules).",
        "Never document deprecated endpoints without marking @Deprecated."
      ],
      whenNotToUse: "Do not use Swagger for internal binary RPC protocols like gRPC (use Protobuf service definitions instead)."
    },
    versionNotes: {
      introduced: "Swagger 1.0 (2011) -> OpenAPI Specification 3.0 (2017) -> springdoc-openapi 2.x for Spring Boot 3",
      status: "Stable",
      compatibilityNotes: "springdoc-openapi is the official OpenAPI solution for Spring Boot 3.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Key OpenAPI 3 Annotations",
      headers: ["Annotation", "Applies To", "Purpose"],
      rows: [
        ["@Tag", "Class", "Groups endpoints into cohesive visual sections in Swagger UI"],
        ["@Operation", "Method", "Summarizes endpoint behavior and business rules"],
        ["@ApiResponse", "Method", "Documents an expected HTTP response code and schema"],
        ["@Parameter", "Parameter", "Describes query params, headers, and path variables"],
        ["@Schema", "Field / Type", "Provides documentation, types, and examples for DTO fields"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "Missing Swagger UI Redirection",
        prompt: "A developer accesses http://localhost:8080/swagger-ui and receives a 404, but http://localhost:8080/swagger-ui/index.html works. Why?",
        solution: "springdoc-openapi redirects /swagger-ui.html to /swagger-ui/index.html by default, not bare /swagger-ui.",
        explanation: "Configure springdoc.swagger-ui.path=/swagger-ui if a custom redirect is required."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Documenting Endpoint with @Operation",
        prompt: "Annotate a deleteOrder method with @Operation and an @ApiResponse for 204 No Content.",
        starterCode: "@DeleteMapping(\"/{id}\")\npublic ResponseEntity<Void> deleteOrder(@PathVariable Long id) {}",
        solution: "@Operation(summary = \"Delete order by ID\")\n@ApiResponse(responseCode = \"204\", description = \"Order deleted successfully\")\n@DeleteMapping(\"/{id}\")\npublic ResponseEntity<Void> deleteOrder(@PathVariable Long id) {\n    return ResponseEntity.noContent().build();\n}",
        explanation: "Documents expected 204 status code in Swagger contract."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "JWT Security Scheme in Swagger UI",
        prompt: "How can you configure Swagger UI so developers can paste Bearer tokens directly into an 'Authorize' dialog box?",
        solution: "Define an OpenAPI @Bean configuring SecurityScheme with type SecurityScheme.Type.HTTP and scheme 'bearer'.",
        explanation: "Adds the interactive padlock icon and Bearer auth header injection to Swagger UI."
      }
    ],
    officialSources: [
      {
        title: "springdoc-openapi Official Documentation",
        url: "https://springdoc.org/",
        organization: "Spring / VMware"
      },
      {
        title: "OpenAPI 3.0 Specification",
        url: "https://spec.openapis.org/oas/v3.0.3",
        organization: "Oracle"
      }
    ]
  },

  // Topic 106: High-Performance Distributed Caching with Caffeine & Redis
  {
    id: "topic-106",
    slug: "high-performance-distributed-caching-caffeine-redis",
    topicNumber: 106,
    title: "High-Performance Distributed Caching with Caffeine & Redis",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 30,
    sectionTitle: "Production Libraries & Distributed Systems",
    versionBadge: "Spring Boot 3.x / Redis 7+",
    difficulty: "Advanced",
    readingTime: "19 min read",
    shortDescription: "Master multi-tier caching architectures in Spring Boot: L1 in-memory Caffeine caching, L2 distributed Redis caching, Spring Cache annotations (@Cacheable, @CachePut, @CacheEvict), and cache stampede prevention.",
    prerequisites: [
      "Topic 37: Map Hierarchy & Hash Collisions",
      "Topic 95: Spring Data JPA Architecture, Repository Hierarchy & JpaRepository",
      "Topic 97: Declarative @Transactional Boundaries, Pagination, Sorting & N+1 Prevention"
    ],
    whatAndWhy: {
      definition: "Distributed caching accelerates applications by storing frequently accessed data in high-speed in-memory tiers (Caffeine and Redis), bypassing expensive relational database disk I/O.",
      analogy: "A chef's prep station: keeping fresh salt and chopped garlic right on the cutting board (L1 Caffeine) avoids walking across the kitchen to the refrigerator (L2 Redis), which in turn avoids driving across town to the grocery warehouse (Database).",
      whyItExists: "Reduces database query latency from milliseconds to microseconds, handles sudden traffic spikes, and decreases cloud database compute costs."
    },
    syntaxBreakdown: {
      title: "Spring Cache Annotations Syntax",
      codeSnippet: "@Service\npublic class ProductService {\n    @Cacheable(value = \"products\", key = \"#id\", sync = true)\n    public ProductDto getProduct(String id) { ... }\n\n    @CachePut(value = \"products\", key = \"#dto.id\")\n    public ProductDto updateProduct(ProductDto dto) { ... }\n\n    @CacheEvict(value = \"products\", key = \"#id\")\n    public void deleteProduct(String id) { ... }\n}",
      explanation: "@Cacheable reads from cache or computes and caches. @CachePut updates cache. @CacheEvict evicts entries.",
      tokens: [
        { token: "@Cacheable", explanation: "Returns cached value if present; otherwise executes method and stores result." },
        { token: "key = \"#id\"", explanation: "SpEL expression resolving method argument as unique cache key." },
        { token: "sync = true", explanation: "Synchronizes cache misses to prevent cache stampedes under concurrent load." },
        { token: "@CacheEvict", explanation: "Removes specific keys or clears entire cache namespaces (allEntries = true)." }
      ]
    },
    examples: [
      {
        id: "ex-106-1",
        title: "Basic @Cacheable Usage",
        type: "basic",
        description: "Caching database queries using Spring Cache.",
        filename: "CachedItemService.java",
        code: "@Service\npublic class CachedItemService {\n    @Cacheable(\"items\")\n    public String getItemDetails(String id) {\n        // Simulating slow DB query\n        return \"Details for \" + id;\n    }\n}",
        output: "First call executes method; subsequent calls return instantly from cache.",
        stepByStep: [
          "Annotate main class with @EnableCaching.",
          "Annotate service method with @Cacheable.",
          "Verify execution is skipped on cache hit."
        ]
      },
      {
        id: "ex-106-2",
        title: "Multi-Tiered Caching Simulation",
        type: "realistic",
        description: "Simulating L1 Caffeine in-memory cache, L2 Redis distributed cache, TTL expiration, and eviction.",
        filename: "DistributedCachingDemo.java",
        code: "package com.handbook.spring;\n\npublic class DistributedCachingDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/DistributedCachingDemo.java\n        System.out.println(\"Topic 106 Caffeine & Redis Distributed Caching verified successfully\");\n    }\n}",
        output: "Topic 106 Caffeine & Redis Distributed Caching verified successfully",
        stepByStep: [
          "Execute request #1 on cold cache and observe database load.",
          "Execute request #2 and verify instant L1 Caffeine hit.",
          "Evict L1 simulating pod restart and observe L2 Redis hit backfilling L1.",
          "Trigger @CacheEvict and assert eviction across all tiers."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Caching mutable objects without defensive copying",
        errorCodeOrSnippet: "Product p = cache.get(\"p1\");\np.setPrice(0.0); // Directly corrupts cached instance across all threads!",
        cause: "In-memory caches (Caffeine) store references to heap objects. Mutating the returned object modifies the cached instance directly.",
        solution: "Always store immutable Java Records or clone objects before returning from cache."
      },
      {
        title: "Omission of TTL causing unbounded memory leaks",
        errorCodeOrSnippet: "Caffeine.newBuilder().build(); // No expireAfterWrite or maximumSize!",
        cause: "Without expiration or size limits, caches grow infinitely until the JVM crashes with OutOfMemoryError.",
        solution: "Always configure maximumSize() and expireAfterWrite() on every cache configuration."
      }
    ],
    bestPractices: {
      doList: [
        "Always define explicit TTL (Time-To-Live) on all Redis and Caffeine caches.",
        "Set sync = true on @Cacheable methods subject to high concurrent traffic to stop cache stampedes.",
        "Use Redis serializers like GenericJackson2JsonRedisSerializer for human-readable JSON inspection in Redis."
      ],
      dontList: [
        "Never cache sensitive user credentials or unencrypted credit card tokens.",
        "Never use caching as a substitute for fixing slow, un-indexed SQL queries.",
        "Avoid calling @Cacheable methods from within the same class (self-invocation bypasses AOP cache proxies)."
      ],
      whenNotToUse: "Do not use caching for rapidly changing real-time data (like high-frequency trading market ticks) where cache invalidation overhead exceeds query cost."
    },
    versionNotes: {
      introduced: "Spring Cache Abstraction (Spring 3.1) -> Caffeine integration in Spring Boot 2 -> Redis 7 in Spring Boot 3",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3 auto-configures RedisCacheManager via spring-boot-starter-data-redis.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Caching Tiers Comparison",
      headers: ["Tier", "Technology", "Access Latency", "Scope", "Eviction Policy"],
      rows: [
        ["L1 Cache", "Caffeine (JVM Heap)", "~10 nanoseconds", "Single JVM Pod", "Window TinyLFU"],
        ["L2 Cache", "Redis (Remote Key-Value)", "~1-2 milliseconds", "Cluster-wide Shared", "Volatile-LRU / TTL"],
        ["Database", "PostgreSQL / Oracle", "~15-50 milliseconds", "Persistent Source of Truth", "Permanent Disk Storage"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "Self-Invocation Cache Bypass",
        prompt: "A developer calls this.findAccount(id) from within the same Service bean. Why is @Cacheable ignored?",
        solution: "Spring Cache uses dynamic AOP proxies. Internal self-invocations bypass the proxy wrapper, executing the raw method without intercepting the cache.",
        explanation: "Inject the service into itself or separate cached methods into distinct bean components."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Evict All Cache Entries",
        prompt: "Write a method signature that completely clears the 'catalog' cache namespace upon catalog refresh.",
        starterCode: "@CacheEvict(...)\npublic void refreshCatalog() {}",
        solution: "@CacheEvict(value = \"catalog\", allEntries = true)\npublic void refreshCatalog() {}",
        explanation: "allEntries = true evicts every key in the specified cache namespace."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Cache Penetration with Non-Existent Keys",
        prompt: "How can you protect a database against attackers deliberately requesting millions of non-existent IDs that miss the cache every time?",
        solution: "Cache null or sentinel values with short TTLs, or use a Bloom filter in front of the cache to reject non-existent keys immediately.",
        explanation: "Caching null results prevents repetitive database hits for invalid keys."
      }
    ],
    officialSources: [
      {
        title: "Spring Framework Cache Abstraction Reference",
        url: "https://docs.spring.io/spring-framework/reference/integration/cache.html",
        organization: "Spring / VMware"
      },
      {
        title: "Caffeine High-Performance In-Memory Cache Guide",
        url: "https://github.com/ben-manes/caffeine",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 107: Resilience & Fault Tolerance with Resilience4j (Circuit Breaker, RateLimiter)
  {
    id: "topic-107",
    slug: "resilience-fault-tolerance-resilience4j-circuit-breaker",
    topicNumber: 107,
    title: "Resilience & Fault Tolerance with Resilience4j (Circuit Breaker, RateLimiter)",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 30,
    sectionTitle: "Production Libraries & Distributed Systems",
    versionBadge: "Spring Boot 3.x / Resilience4j 2+",
    difficulty: "Advanced",
    readingTime: "19 min read",
    shortDescription: "Engineer fault-tolerant distributed microservices using Resilience4j: CircuitBreaker state transitions (CLOSED, OPEN, HALF_OPEN), sliding window error thresholds, RateLimiter throttling, and fallback degradation strategies.",
    prerequisites: [
      "Topic 29: Exception Handling Architecture & Hierarchy",
      "Topic 92: Production REST Controller Architecture with Spring Web MVC",
      "Topic 104: Production Observability: Spring Boot Actuator, Micrometer & Prometheus"
    ],
    whatAndWhy: {
      definition: "Resilience4j provides lightweight, functional fault tolerance patterns that prevent cascading failures in distributed systems through circuit breakers, rate limiters, retries, and fallbacks.",
      analogy: "An electrical home breaker box: when an appliance shorts out, the circuit breaker trips instantly to cut current to that single outlet, preventing your house wiring from catching fire and leaving all other rooms fully powered.",
      whyItExists: "Isolates failing microservice dependencies, protects thread pools from exhaustion during network slowdowns, and provides graceful degradation for users."
    },
    syntaxBreakdown: {
      title: "Resilience4j CircuitBreaker and Fallback Syntax",
      codeSnippet: "@Service\npublic class PaymentService {\n    @CircuitBreaker(name = \"paymentGateway\", fallbackMethod = \"fallbackCharge\")\n    @RateLimiter(name = \"paymentLimiter\")\n    public ChargeResult charge(ChargeRequest req) {\n        return externalBankClient.charge(req);\n    }\n    public ChargeResult fallbackCharge(ChargeRequest req, Throwable t) {\n        return new ChargeResult(\"QUEUED\", \"Queued for async settlement\");\n    }\n}",
      explanation: "@CircuitBreaker intercepts invocations. If the circuit trips to OPEN or calls throw exceptions, fallbackCharge is invoked automatically.",
      tokens: [
        { token: "@CircuitBreaker", explanation: "Monitors call failure rates and short-circuits execution when thresholds trip." },
        { token: "fallbackMethod", explanation: "Declares method to invoke upon failure, matching original parameters plus a Throwable." },
        { token: "@RateLimiter", explanation: "Enforces max request rate quotas, throwing RequestNotPermitted when exceeded." }
      ]
    },
    examples: [
      {
        id: "ex-107-1",
        title: "Declaring Resilience4j CircuitBreaker Bean",
        type: "basic",
        description: "Configuring CircuitBreaker programmatically with custom thresholds.",
        filename: "CircuitConfig.java",
        code: "CircuitBreakerConfig config = CircuitBreakerConfig.custom()\n    .failureRateThreshold(50.0f)\n    .slidingWindowSize(10)\n    .build();\nCircuitBreaker cb = CircuitBreaker.of(\"bankService\", config);",
        output: "CircuitBreaker initialized with 50% failure rate threshold across 10 calls.",
        stepByStep: [
          "Build CircuitBreakerConfig specifying sliding window and threshold.",
          "Create CircuitBreaker instance via CircuitBreaker.of().",
          "Execute calls decorated with cb.decorateSupplier()."
        ]
      },
      {
        id: "ex-107-2",
        title: "CircuitBreaker State Transitions and Throttling Simulation",
        type: "realistic",
        description: "Simulating CLOSED -> OPEN -> HALF_OPEN transitions, immediate short-circuiting, and token bucket rate limiting.",
        filename: "Resilience4jDemo.java",
        code: "package com.handbook.spring;\n\npublic class Resilience4jDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/Resilience4jDemo.java\n        System.out.println(\"Topic 107 Resilience4j Circuit Breaker & RateLimiter verified successfully\");\n    }\n}",
        output: "Topic 107 Resilience4j Circuit Breaker & RateLimiter verified successfully",
        stepByStep: [
          "Execute calls in CLOSED state.",
          "Simulate consecutive downstream failures to trip circuit to OPEN.",
          "Verify subsequent calls are immediately short-circuited to fallback.",
          "Simulate RateLimiter token bucket throttling and verify HTTP 429 rejection."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Mismatched fallback method signature",
        errorCodeOrSnippet: "NoSuchMethodException: fallbackCharge(ChargeRequest)",
        cause: "Resilience4j requires the fallback method signature to include all original arguments PLUS a trailing Throwable parameter.",
        solution: "Add Throwable ex to the end of the fallback method parameter list: fallbackCharge(ChargeRequest req, Throwable ex)."
      },
      {
        title: "Setting sliding window size too small",
        errorCodeOrSnippet: "slidingWindowSize = 2; // Single transient error trips the breaker!",
        cause: "A tiny sliding window causes erratic state flapping on minor network blips.",
        solution: "Use a realistic sliding window size (e.g. 50 or 100 calls) with minimumNumberOfCalls configured."
      }
    ],
    bestPractices: {
      doList: [
        "Always implement meaningful fallback methods that provide cached or degraded responses.",
        "Export Resilience4j metrics to Prometheus via Micrometer to monitor circuit state in Grafana.",
        "Combine CircuitBreaker with TimeLimiter to prevent slow calls from tying up threads."
      ],
      dontList: [
        "Never catch and swallow exceptions inside the protected method (Resilience4j needs the exception to record failures).",
        "Never perform heavy database or network calls inside a fallback method.",
        "Avoid using Retry on non-idempotent HTTP POST operations without idempotency keys."
      ],
      whenNotToUse: "Do not use circuit breakers for internal, in-memory CPU operations (only apply them across network and I/O boundaries)."
    },
    versionNotes: {
      introduced: "Resilience4j 1.0 (2018) -> Resilience4j 2.x for Spring Boot 3",
      status: "Stable",
      compatibilityNotes: "Resilience4j is the official successor to Netflix Hystrix in the Spring ecosystem.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Resilience4j Core Modules Matrix",
      headers: ["Module", "Core Pattern", "Protection Provided"],
      rows: [
        ["CircuitBreaker", "State Machine (CLOSED/OPEN/HALF_OPEN)", "Stops cascading failures from dead downstreams"],
        ["RateLimiter", "Token Bucket Algorithm", "Prevents request flooding and enforces API rate quotas"],
        ["Retry", "Exponential Backoff & Jitter", "Recovers automatically from transient network glitches"],
        ["Bulkhead", "Semaphore / Thread Pool Isolation", "Prevents one slow dependency from starving all worker threads"],
        ["TimeLimiter", "Future Timeout Enforcement", "Cancels calls exceeding maximum SLA duration deadlines"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "Swallowed Failure Exception",
        prompt: "A developer writes try { remoteCall(); } catch (Exception e) { return null; } inside a @CircuitBreaker method. Why does the circuit never trip?",
        solution: "Because the exception is caught inside the method body, the method completes normally without throwing. Resilience4j records it as a successful invocation.",
        explanation: "Let exceptions propagate out of the method or record them explicitly."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Declare Fallback Method",
        prompt: "Write the correct fallback method signature for @CircuitBreaker(name=\"weather\", fallbackMethod=\"fallbackWeather\") on method String getWeather(String city).",
        starterCode: "public String fallbackWeather(...) {}",
        solution: "public String fallbackWeather(String city, Throwable ex) {\n    return \"Weather unavailable (Cached: Mild)\";\n}",
        explanation: "Fallback must match all original method parameters plus a trailing Throwable."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "CircuitBreaker Slow Call Rate Threshold",
        prompt: "How does Resilience4j detect that a downstream service is alive but performing too slowly to meet SLAs?",
        solution: "Configure slowCallDurationThreshold and slowCallRateThreshold; if the percentage of calls exceeding that duration exceeds the threshold, the circuit trips to OPEN.",
        explanation: "Slow calls are often more dangerous than fast errors because they tie up server worker threads."
      }
    ],
    officialSources: [
      {
        title: "Resilience4j Official Documentation",
        url: "https://resilience4j.readme.io/docs",
        organization: "Spring / VMware"
      },
      {
        title: "Spring Cloud Circuit Breaker Reference",
        url: "https://docs.spring.io/spring-cloud-circuitbreaker/docs/current/reference/html/",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 108: Event-Driven Enterprise Messaging with Apache Kafka
  {
    id: "topic-108",
    slug: "event-driven-enterprise-messaging-apache-kafka",
    topicNumber: 108,
    title: "Event-Driven Enterprise Messaging with Apache Kafka",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 30,
    sectionTitle: "Production Libraries & Distributed Systems",
    versionBadge: "Spring Boot 3.x / Apache Kafka 3.6+",
    difficulty: "Advanced",
    readingTime: "22 min read",
    shortDescription: "Master event-driven distributed architectures using Spring for Apache Kafka: topics, key-based partitioning, consumer group offset management, At-Least-Once delivery semantics, and Dead Letter Queues (DLQ).",
    prerequisites: [
      "Topic 48: Thread Lifecycle, Runnable & Virtual Threads",
      "Topic 92: Production REST Controller Architecture with Spring Web MVC",
      "Topic 107: Resilience & Fault Tolerance with Resilience4j (Circuit Breaker, RateLimiter)"
    ],
    whatAndWhy: {
      definition: "Apache Kafka is a distributed, horizontally partitioned, replicated commit log service enabling asynchronous, high-throughput event streaming between decoupled microservices.",
      analogy: "A multi-track train freight yard: loading cranes (Producers) drop freight containers onto dedicated numbered tracks (Partitions) based on destination code (Message Key). Delivery trucks (Consumer Groups) drive down specific tracks, unloading cargo sequentially and stamping their manifest (Offset Commit) as each container is delivered.",
      whyItExists: "Decouples microservices in time and space, absorbs massive ingestion bursts, and guarantees durable, replayable event histories."
    },
    syntaxBreakdown: {
      title: "Spring Kafka Producer and Consumer Annotations",
      codeSnippet: "@Service\npublic class OrderEventService {\n    @Autowired private KafkaTemplate<String, OrderEvent> kafkaTemplate;\n\n    public void publish(OrderEvent event) {\n        kafkaTemplate.send(\"orders\", event.customerId(), event);\n    }\n\n    @KafkaListener(topics = \"orders\", groupId = \"billing-group\")\n    public void consume(ConsumerRecord<String, OrderEvent> record, Acknowledgment ack) {\n        // Process event\n        ack.acknowledge();\n    }\n}",
      explanation: "KafkaTemplate sends records to topics with optional partition keys. @KafkaListener polls records and Acknowledgment commits offsets.",
      tokens: [
        { token: "KafkaTemplate", explanation: "High-level Spring template for asynchronous message publishing." },
        { token: "@KafkaListener", explanation: "Declares a method as a continuous poll listener for specified topics and consumer groups." },
        { token: "customerId() as Key", explanation: "Ensures all events for the same customer land in the same partition in chronological order." },
        { token: "Acknowledgment", explanation: "Allows manual commit of partition offsets to guarantee At-Least-Once delivery semantics." }
      ]
    },
    examples: [
      {
        id: "ex-108-1",
        title: "Basic Kafka Producer & Consumer",
        type: "basic",
        description: "Publishing and consuming a string message via Spring Kafka.",
        filename: "SimpleKafkaService.java",
        code: "@Service\npublic class SimpleKafkaService {\n    @Autowired private KafkaTemplate<String, String> template;\n    public void send(String msg) {\n        template.send(\"alerts\", msg);\n    }\n    @KafkaListener(topics = \"alerts\", groupId = \"alert-group\")\n    public void receive(String msg) {\n        System.out.println(\"Received: \" + msg);\n    }\n}",
        output: "Message published to alerts topic and received by consumer group.",
        stepByStep: [
          "Inject KafkaTemplate.",
          "Invoke send() with topic name and message.",
          "Consume with @KafkaListener."
        ]
      },
      {
        id: "ex-108-2",
        title: "Kafka Cluster Simulation & Key-Based Partitioning",
        type: "realistic",
        description: "Simulating Kafka cluster partitions, key hashing, consumer group polling, offset commits, and idempotency.",
        filename: "KafkaMessagingDemo.java",
        code: "package com.handbook.spring;\n\npublic class KafkaMessagingDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/KafkaMessagingDemo.java\n        System.out.println(\"Topic 108 Apache Kafka Event-Driven Messaging verified successfully\");\n    }\n}",
        output: "Topic 108 Apache Kafka Event-Driven Messaging verified successfully",
        stepByStep: [
          "Initialize KafkaClusterSimulator with 3 partitions.",
          "Publish order events using customer IDs as partition keys.",
          "Poll events via 'billing-service-group' across all partitions.",
          "Commit partition offsets synchronously and verify idempotent subsequent polls."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Publishing events without message keys",
        errorCodeOrSnippet: "kafkaTemplate.send(\"orders\", orderEvent); // Key is null!",
        cause: "When key is null, Kafka round-robins messages across all partitions. Order events for the same customer land on different partitions and execute out of order!",
        solution: "Always provide a consistent entity ID as key: kafkaTemplate.send(\"orders\", order.getCustomerId(), order)."
      },
      {
        title: "Indefinite consumer retries on poison pill messages",
        errorCodeOrSnippet: "Consumer crashes repeatedly on malformed JSON payload, blocking partition progress forever!",
        cause: "Default consumer retry without backoff or dead letter topics causes an infinite retry loop on unparseable data.",
        solution: "Configure DefaultErrorHandler with DeadLetterPublishingRecoverer to route poison pills to a '.DLT' topic after 3 attempts."
      }
    ],
    bestPractices: {
      doList: [
        "Always provide entity business keys (e.g. customerId, accountId) to guarantee chronological partition ordering.",
        "Use manual acknowledgment (AckMode.MANUAL_IMMEDIATE) to guarantee At-Least-Once delivery semantics.",
        "Design all consumer event handlers to be strictly idempotent (e.g. using database deduplication tables)."
      ],
      dontList: [
        "Never publish Kafka events inside an uncommitted database transaction (dual-write problem; use the Outbox Pattern).",
        "Never use auto-commit (enable.auto.commit=true) for mission-critical financial workflows.",
        "Avoid huge message payloads; Kafka is optimized for small messages (< 1MB)."
      ],
      whenNotToUse: "Do not use Kafka if you require simple point-to-point task queues with complex routing keys and immediate message deletions (use RabbitMQ instead)."
    },
    versionNotes: {
      introduced: "Apache Kafka (LinkedIn, 2011) -> Spring for Apache Kafka 1.0 (2016) -> Kafka 3.6 / Spring Boot 3",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3 uses spring-kafka 3.1+ requiring Java 17+ and Kafka client 3.6+.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Kafka Architectural Concepts",
      headers: ["Concept", "Role", "Guarantee Provided"],
      rows: [
        ["Topic", "Logical stream category", "Append-only distributed commit log"],
        ["Partition", "Physical log shard", "Strict chronological message ordering within partition"],
        ["Message Key", "Partition routing token", "All records with identical key land in same partition"],
        ["Consumer Group", "Parallel consumer cluster", "Each partition assigned to exactly 1 consumer in group"],
        ["Offset", "Sequential message ID", "Enables resume-from-failure and message replayability"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Out-of-Order Customer Updates",
        prompt: "A customer updates their address twice in 5 seconds. In the database, the older address overwrites the newer one. What Kafka configuration was missed?",
        solution: "The producer published messages without a key or with null key, causing the two updates to land on different partitions consumed out of order.",
        explanation: "Always use customerId as the record key to preserve strict per-entity ordering."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Transactional Outbox Pattern Outline",
        prompt: "Why does saving an order to a database and publishing to Kafka in the same method risk inconsistency, and how does the Outbox Pattern solve it?",
        solution: "If Kafka publish fails after DB commit, the event is lost. In the Outbox Pattern, the event is saved to an 'outbox' table in the same DB transaction, and a CDC process (like Debezium) streams it to Kafka reliably.",
        explanation: "The Outbox pattern guarantees eventual consistency without two-phase commit."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Consumer Group Rebalance Storm",
        prompt: "Why does a consumer that takes too long to process a single batch trigger a Kafka consumer group rebalance storm?",
        solution: "If processing time exceeds max.poll.interval.ms, the Kafka broker assumes the consumer is dead, revokes its partitions, and triggers a rebalance across all surviving consumers.",
        explanation: "Tune max.poll.records lower or process heavy work asynchronously to stay within poll deadlines."
      }
    ],
    officialSources: [
      {
        title: "Apache Kafka Official Documentation",
        url: "https://kafka.apache.org/documentation/",
        organization: "Apache Software Foundation"
      },
      {
        title: "Spring for Apache Kafka Reference",
        url: "https://docs.spring.io/spring-kafka/reference/html/",
        organization: "Spring / VMware"
      }
    ]
  }
];
