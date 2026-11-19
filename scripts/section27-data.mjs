export const section27Topics = [
  // Topic 95: Spring Data JPA Architecture, Repository Hierarchy & JpaRepository
  {
    id: "topic-95",
    slug: "spring-data-jpa-architecture-repository-hierarchy-jparepository",
    topicNumber: 95,
    title: "Spring Data JPA Architecture, Repository Hierarchy & JpaRepository",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 27,
    sectionTitle: "Persistence with Spring Data JPA & Databases",
    versionBadge: "Spring Boot 3.x / Jakarta Persistence 3.1+",
    difficulty: "Advanced",
    readingTime: "18 min read",
    shortDescription: "Master the Spring Data JPA persistence abstraction: the repository interface hierarchy (Repository -> CrudRepository -> PagingAndSortingRepository -> JpaRepository), dynamic AOP proxy generation, EntityManager persistence context lifecycle states, and dirty-checking flush mechanics.",
    prerequisites: [
      "Topic 83: Jakarta Persistence (JPA) & Hibernate ORM",
      "Topic 88: Spring Framework Core, BeanFactory vs ApplicationContext",
      "Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks"
    ],
    whatAndWhy: {
      definition: "Spring Data JPA provides a declarative abstraction over the JPA EntityManager, using dynamic runtime proxies to implement repository interfaces without requiring manual DAO classes.",
      analogy: "An automated bank teller: rather than personally walking into the vault, opening safe deposit boxes, counting cash, and updating hand-written ledger books (EntityManager), you slide your debit card into an automated terminal (JpaRepository) which instantly verifies, debits, credits, and reconciles records behind the scenes.",
      whyItExists: "Eliminates redundant CRUD boilerplate, provides consistent pagination and sorting, translates vendor SQL exceptions into unified Spring DataAccessExceptions, and streamlines domain data modeling."
    },
    syntaxBreakdown: {
      title: "Spring Data JpaRepository Interface Declaration",
      codeSnippet: "public interface AccountRepository extends JpaRepository<Account, Long> {\n    Optional<Account> findByOwnerName(String name);\n    @Modifying\n    @Query(\"UPDATE Account a SET a.balance = a.balance + :amount WHERE a.id = :id\")\n    int creditBalance(@Param(\"id\") Long id, @Param(\"amount\") double amount);\n}",
      explanation: "Extending JpaRepository exposes standard CRUD, paging, and batch methods. Adding custom method signatures triggers automatic JPQL query generation at runtime.",
      tokens: [
        { token: "JpaRepository<Account, Long>", explanation: "Generic interface taking entity domain class and primary key type." },
        { token: "findByOwnerName(String name)", explanation: "Derived query method automatically parsed into JPQL by Spring Data." },
        { token: "@Modifying", explanation: "Instructs JPA that the query executes an UPDATE or DELETE rather than a SELECT." },
        { token: "@Query", explanation: "Defines explicit JPQL query to bypass method name derivation." },
        { token: "@Param", explanation: "Binds method parameter names to named JPQL bind variables (:id, :amount)." }
      ]
    },
    examples: [
      {
        id: "ex-95-1",
        title: "Repository Hierarchy Usage",
        type: "basic",
        description: "Saving, finding by ID, and deleting entities using standard JpaRepository methods.",
        filename: "BasicAccountRepoUsage.java",
        code: "import org.springframework.data.jpa.repository.JpaRepository;\nimport java.util.Optional;\n\npublic class BasicAccountRepoUsage {\n    public void demonstrate(AccountRepository repository) {\n        Account acc = new Account(null, \"Alice\", 5000.0);\n        Account saved = repository.save(acc);\n        Optional<Account> found = repository.findById(saved.getId());\n        repository.deleteById(saved.getId());\n    }\n}",
        output: "Entity transitioned: TRANSIENT -> MANAGED -> REMOVED",
        stepByStep: [
          "Define repository interface extending JpaRepository.",
          "Inject repository via constructor injection into Service.",
          "Invoke save() to transition transient instance to managed state.",
          "Delete entity using deleteById()."
        ]
      },
      {
        id: "ex-95-2",
        title: "Spring Data JPA Architecture & Lifecycle Simulation",
        type: "realistic",
        description: "Simulating dynamic runtime proxy generation, dirty-checking, and persistence context state transitions.",
        filename: "SpringDataJpaRepositoryDemo.java",
        code: "package com.handbook.spring;\n\npublic class SpringDataJpaRepositoryDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/SpringDataJpaRepositoryDemo.java\n        System.out.println(\"Topic 95 Spring Data JPA Architecture demo executed successfully\");\n    }\n}",
        output: "Topic 95 Spring Data JPA Architecture demo executed successfully",
        stepByStep: [
          "Instantiate AccountRepository dynamic proxy via JdkDynamicAopProxy.",
          "Persist Account and verify TRANSIENT to MANAGED state transition.",
          "Execute derived query findByOwnerName.",
          "Perform in-memory mutation and trigger flush() dirty-check.",
          "Sort accounts by balance descending.",
          "Delete entity and assert REMOVED state."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Calling save() to update a managed entity",
        errorCodeOrSnippet: "Account acc = repo.findById(1L).get();\nacc.setBalance(9000.0);\nrepo.save(acc); // Unnecessary and redundant in JPA!",
        cause: "Assuming database persistence requires explicit save/update calls like MongoDB or raw SQL.",
        solution: "Within a @Transactional method, any mutation on a managed entity is automatically saved upon method exit via dirty checking. Omit the redundant save()."
      },
      {
        title: "Modifying detached entities without merge",
        errorCodeOrSnippet: "public void updateBalance(Account detached) {\n    detached.setBalance(100.0);\n    // Entity is detached, changes are silently lost!\n}",
        cause: "Operating on entities passed from web controllers outside active transactions without re-attaching.",
        solution: "Fetch the managed entity by ID inside the service transaction or invoke repository.save() which internally calls em.merge()."
      }
    ],
    bestPractices: {
      doList: [
        "Extend JpaRepository for relational database entities requiring batch operations and flushing.",
        "Use repository.getReferenceById(id) when only creating foreign key references to avoid unnecessary SELECT queries.",
        "Always execute state-mutating repository operations inside @Transactional service boundaries."
      ],
      dontList: [
        "Never perform heavy database mutations in web controllers.",
        "Avoid calling repository.findAll() on unbounded tables; always provide Pageable.",
        "Never expose raw JPA entity classes directly in REST API responses (use DTOs)."
      ],
      whenNotToUse: "Do not use Spring Data JPA for bulk analytical batch inserts of millions of rows (use Spring Batch with JdbcTemplate or Hibernate StatelessSession instead)."
    },
    versionNotes: {
      introduced: "Spring Data JPA 1.0 (2011) -> Spring Data JPA 3.x with Jakarta Persistence 3.1",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3 requires jakarta.persistence.* namespace (Hibernate 6+).",
      ltsAvailability: "Compatible with Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Spring Data Repository Hierarchy Comparison",
      headers: ["Interface", "Key Methods", "Pagination/Sort", "JPA Flush Support"],
      rows: [
        ["Repository<T, ID>", "None (Marker interface)", "No", "No"],
        ["CrudRepository<T, ID>", "save, findById, deleteById, count", "No", "No"],
        ["PagingAndSortingRepository<T, ID>", "findAll(Sort), findAll(Pageable)", "Yes", "No"],
        ["JpaRepository<T, ID>", "flush, saveAndFlush, getReferenceById", "Yes", "Yes"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Phantom Update",
        prompt: "A developer writes a service method that updates an account balance and returns without calling repo.save(). In tests without @Transactional, the update never saves to the database. Why?",
        solution: "Without @Transactional, there is no active transaction or open persistence context to trigger the end-of-transaction dirty-checking flush.",
        explanation: "Always annotate mutation service methods with @Transactional so the persistence context automatically flushes changes upon successful completion."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Declare a JpaRepository with Derived Method",
        prompt: "Write a repository interface for a Product entity with primary key UUID, including a method to find all products by category with price greater than a given threshold.",
        starterCode: "public interface ProductRepository extends JpaRepository<Product, UUID> {\n    // Add derived method\n}",
        solution: "public interface ProductRepository extends JpaRepository<Product, UUID> {\n    List<Product> findByCategoryAndPriceGreaterThan(String category, BigDecimal price);\n}",
        explanation: "Spring Data automatically parses 'findByCategoryAndPriceGreaterThan' into the appropriate JPQL WHERE clause."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "getReferenceById vs findById",
        prompt: "When creating an OrderItem that references an Order by ID, why is orderRepo.getReferenceById(orderId) preferred over orderRepo.findById(orderId)?",
        solution: "getReferenceById returns a lightweight Hibernate proxy containing only the ID without issuing an immediate SQL SELECT. This avoids an unnecessary database query when setting a foreign key.",
        explanation: "findById immediately executes a SELECT query to populate the entire entity into memory."
      }
    ],
    officialSources: [
      {
        title: "Spring Data JPA Reference Documentation",
        url: "https://docs.spring.io/spring-data/jpa/reference/jpa/repositories.html",
        organization: "Spring / VMware"
      },
      {
        title: "Jakarta Persistence 3.1 Specification",
        url: "https://jakarta.ee/specifications/persistence/3.1/",
        organization: "Eclipse Foundation"
      }
    ]
  },

  // Topic 96: Automated Derived Query Methods, Dynamic Projections & JPQL @Query
  {
    id: "topic-96",
    slug: "automated-derived-query-methods-dynamic-projections-jpql-query",
    topicNumber: 96,
    title: "Automated Derived Query Methods, Dynamic Projections & JPQL @Query",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 27,
    sectionTitle: "Persistence with Spring Data JPA & Databases",
    versionBadge: "Spring Boot 3.x / Java 21+",
    difficulty: "Advanced",
    readingTime: "17 min read",
    shortDescription: "Architect high-efficiency data access with Spring Data JPA: query method derivation rules, closed and open interface-based projections, constructor record DTO projections, and custom JPQL queries with named parameters.",
    prerequisites: [
      "Topic 83: Jakarta Persistence (JPA) & Hibernate ORM",
      "Topic 95: Spring Data JPA Architecture, Repository Hierarchy & JpaRepository"
    ],
    whatAndWhy: {
      definition: "Spring Data JPA query techniques allow developers to retrieve partial entity representations (projections) and write declarative queries using derived method naming or JPQL constructor expressions.",
      analogy: "A library catalog: instead of hauling every 1,000-page encyclopedia off the shelf just to look up author names and publication dates (fetching full entities), you consult an index card summary (interface/record projection) containing only the exact three fields you need.",
      whyItExists: "Reduces heap allocation and network overhead, prevents accidental exposure of sensitive entity columns, and allows direct mapping into immutable Java records."
    },
    syntaxBreakdown: {
      title: "Spring Data Projections and JPQL Constructor Expression",
      codeSnippet: "public record UserSummaryDto(String fullName, String email) {}\n\npublic interface UserRepository extends JpaRepository<User, Long> {\n    // Closed Interface Projection\n    List<UserExcerpt> findByDepartment(String dept);\n\n    // Record Constructor Projection via JPQL\n    @Query(\"SELECT new com.example.UserSummaryDto(u.name, u.email) FROM User u WHERE u.active = true\")\n    List<UserSummaryDto> findActiveUserSummaries();\n}",
      explanation: "Projections selectively query columns. Interface projections synthesize proxies at runtime; record constructor queries instantiate immutable records directly in one SQL pass.",
      tokens: [
        { token: "UserExcerpt", explanation: "Closed interface projection exposing only needed getter methods." },
        { token: "SELECT new ...", explanation: "JPQL constructor expression creating Java record instances directly from query columns." },
        { token: "@Query", explanation: "Custom JPQL query bypassing method name parsing limitations." }
      ]
    },
    examples: [
      {
        id: "ex-96-1",
        title: "Closed vs Open Interface Projections",
        type: "basic",
        description: "Declaring and using closed and open projections in a Spring Data repository.",
        filename: "ProjectionBasics.java",
        code: "public interface EmployeeSummary {\n    String getFirstName();\n    String getLastName();\n    @Value(\"#{target.firstName + ' ' + target.lastName}\")\n    String getFullName();\n}",
        output: "Closed projection executes selective SQL; open projection computes SpEL expression in memory.",
        stepByStep: [
          "Define projection interface with getter signatures.",
          "Use closed projection for database-level column filtering.",
          "Use @Value for computed composite properties."
        ]
      },
      {
        id: "ex-96-2",
        title: "Derived Queries and Projections Simulation",
        type: "realistic",
        description: "Simulating derived method parsing, interface projection proxies, and JPQL record constructor projections.",
        filename: "DerivedQueryProjectionsDemo.java",
        code: "package com.handbook.spring;\n\npublic class DerivedQueryProjectionsDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/DerivedQueryProjectionsDemo.java\n        System.out.println(\"Topic 96 Derived Queries and Projections demo executed successfully\");\n    }\n}",
        output: "Topic 96 Derived Queries and Projections demo executed successfully",
        stepByStep: [
          "Execute derived query countByDepartment and existsByEmail.",
          "Retrieve closed interface projection EmployeeNameAndDept.",
          "Evaluate open projection EmployeeSalarySummary with default compensation tier logic.",
          "Execute JPQL constructor expression returning immutable EmployeeDto records."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Assuming Open Projections optimize SQL queries",
        errorCodeOrSnippet: "public interface UserView {\n    @Value(\"#{target.firstName + ' ' + target.lastName}\")\n    String getFullName();\n}",
        cause: "Because the SpEL expression accesses target.property, Spring Data must retrieve the entire entity to evaluate the expression.",
        solution: "Use closed projections or SQL concat expressions in @Query if you want SQL-level column optimization."
      },
      {
        title: "Missing fully-qualified class name in JPQL constructor expressions",
        errorCodeOrSnippet: "@Query(\"SELECT new UserDto(u.id, u.name) FROM User u\") // ClassNotFoundException in JPQL!",
        cause: "JPQL requires the complete canonical package name for constructor expressions.",
        solution: "Specify the full package: @Query(\"SELECT new com.example.dto.UserDto(u.id, u.name) FROM User u\")."
      }
    ],
    bestPractices: {
      doList: [
        "Prefer Java records for DTO projections in modern Spring Boot 3 applications.",
        "Use derived query methods for simple single-condition or double-condition queries.",
        "Use explicit @Query with named parameters (@Param) when queries involve joins or complex conditions."
      ],
      dontList: [
        "Avoid writing long method names with 5+ conditions (e.g. findByAAndBOrCAndDOrderByE); use @Query instead.",
        "Never use native queries unless leveraging vendor-specific SQL dialect features.",
        "Never perform Cartesian product joins without projections or distinct keywords."
      ],
      whenNotToUse: "Do not use derived method queries for highly dynamic search criteria with optional filters (use Spring Data JPA Specifications or Querydsl instead)."
    },
    versionNotes: {
      introduced: "Dynamic Projections introduced in Spring Data JPA 1.10 -> Record DTO support in Spring Data 2.6+",
      status: "Stable",
      compatibilityNotes: "Java Records are first-class citizens in Spring Boot 3.x.",
      ltsAvailability: "Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Query and Projection Strategies Matrix",
      headers: ["Approach", "Generated SQL", "Proxy Overhead", "Best For"],
      rows: [
        ["Derived Query Method", "Full SELECT * FROM entity", "None", "Retrieving full managed entities"],
        ["Closed Interface Projection", "Selective SELECT col1, col2", "Lightweight Dynamic Proxy", "Lightweight view models and dropdowns"],
        ["Open Interface Projection", "Full SELECT * FROM entity", "SpEL Evaluation Proxy", "Synthetic computed properties"],
        ["Record DTO Projection", "Selective SELECT col1, col2", "Zero (Direct Constructor)", "High-throughput APIs & microservices"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "JPQL Named Parameter Typo",
        prompt: "A developer writes @Query(\"SELECT u FROM User u WHERE u.email = :mail\") but declares the method as findByEmail(@Param(\"email\") String mail). What happens?",
        solution: "Throws QueryCreationException or IllegalArgumentException because the JPQL placeholder :mail does not match the @Param(\"email\") declaration.",
        explanation: "Named parameters in JPQL must exactly match the value specified in the @Param annotation."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Constructor Expression with Record",
        prompt: "Write a JPQL query that projects the id, name, and totalOrders from a Customer entity directly into a CustomerSummaryRecord.",
        starterCode: "@Query(\"...\")\nList<CustomerSummaryRecord> findCustomerSummaries();",
        solution: "@Query(\"SELECT new com.example.CustomerSummaryRecord(c.id, c.name, size(c.orders)) FROM Customer c\")\nList<CustomerSummaryRecord> findCustomerSummaries();",
        explanation: "The size() JPQL function counts associated collection items, and 'new com.example...' constructs the record."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Dynamic Projections with Generic Type",
        prompt: "How can you write a single Spring Data repository method that returns either full entities, closed projections, or DTOs depending on what the caller passes in?",
        solution: "<T> List<T> findByDepartment(String dept, Class<T> projectionType);",
        explanation: "Spring Data supports dynamic projections by accepting a Class<T> parameter and instantiating the requested projection dynamically."
      }
    ],
    officialSources: [
      {
        title: "Spring Data JPA: Projections Reference",
        url: "https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html",
        organization: "Spring / VMware"
      },
      {
        title: "Spring Data JPA: Defining Query Methods",
        url: "https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 97: Declarative @Transactional Boundaries, Pagination, Sorting & N+1 Prevention
  {
    id: "topic-97",
    slug: "declarative-transactional-boundaries-pagination-sorting-n-plus-one",
    topicNumber: 97,
    title: "Declarative @Transactional Boundaries, Pagination, Sorting & N+1 Prevention",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 27,
    sectionTitle: "Persistence with Spring Data JPA & Databases",
    versionBadge: "Spring Boot 3.x / Jakarta Persistence 3.1+",
    difficulty: "Advanced",
    readingTime: "19 min read",
    shortDescription: "Master enterprise transaction boundaries and ORM performance tuning: declarative @Transactional propagation, readOnly performance gains, Pageable pagination, and eliminating the N+1 Select Problem via @EntityGraph and JOIN FETCH.",
    prerequisites: [
      "Topic 83: Jakarta Persistence (JPA) & Hibernate ORM",
      "Topic 95: Spring Data JPA Architecture, Repository Hierarchy & JpaRepository",
      "Topic 96: Automated Derived Query Methods, Dynamic Projections & JPQL @Query"
    ],
    whatAndWhy: {
      definition: "Declarative transaction management intercepts method calls via Spring AOP proxies to control ACID transaction boundaries, while @EntityGraph and JOIN FETCH eliminate redundant queries when traversing object relationships.",
      analogy: "A freight delivery: instead of making 1 trip to pick up a truck (1 query) and then 100 individual round trips back and forth to carry each cardboard box one by one (N+1 queries), a shipping container (@EntityGraph / JOIN FETCH) loads both the truck and all 100 boxes together in one single trip.",
      whyItExists: "Protects data integrity through automated commit/rollback mechanics and prevents disastrous database round-trip performance bottlenecks in production microservices."
    },
    syntaxBreakdown: {
      title: "Declarative @Transactional and @EntityGraph Syntax",
      codeSnippet: "@Service\npublic class OrderService {\n    @Transactional(readOnly = true)\n    public Page<OrderDto> getOrders(Pageable pageable) {\n        return orderRepo.findAllWithItems(pageable).map(this::toDto);\n    }\n\n    @Transactional(rollbackFor = BusinessException.class)\n    public void placeOrder(OrderRequest request) {\n        // atomic database updates\n    }\n}\n\npublic interface OrderRepository extends JpaRepository<Order, Long> {\n    @EntityGraph(attributePaths = {\"items\", \"customer\"})\n    Page<Order> findAllWithItems(Pageable pageable);\n}",
      explanation: "@Transactional wraps method execution in ACID boundaries. @EntityGraph specifies which lazy associations should be eagerly fetched in a single SQL JOIN.",
      tokens: [
        { token: "@Transactional(readOnly = true)", explanation: "Optimizes JDBC connection and disables Hibernate dirty-checking snapshots." },
        { token: "rollbackFor", explanation: "Specifies checked exceptions that should trigger an automatic transaction rollback." },
        { token: "@EntityGraph(attributePaths = ...)", explanation: "Executes an optimized SQL LEFT JOIN fetching parent and related children in 1 query." },
        { token: "Pageable / Page<T>", explanation: "Standard Spring Data abstraction for database-level pagination and sorting." }
      ]
    },
    examples: [
      {
        id: "ex-97-1",
        title: "Pagination and Sorting with PageRequest",
        type: "basic",
        description: "Executing paginated queries with sorting and mapping results to DTOs.",
        filename: "PaginationExample.java",
        code: "Pageable pageable = PageRequest.of(0, 25, Sort.by(\"createdAt\").descending());\nPage<CustomerOrder> page = repository.findByStatus(\"ACTIVE\", pageable);\nList<CustomerOrder> orders = page.getContent();\nlong total = page.getTotalElements();",
        output: "Fetched page 0 with 25 records (Total elements: 1,420)",
        stepByStep: [
          "Construct Pageable using PageRequest.of(page, size, sort).",
          "Pass Pageable to repository method.",
          "Inspect page content, total elements, and total pages."
        ]
      },
      {
        id: "ex-97-2",
        title: "Transaction Boundaries and N+1 Elimination Simulation",
        type: "realistic",
        description: "Simulating @Transactional commit/rollback, unoptimized N+1 queries, and single-query @EntityGraph resolution.",
        filename: "TransactionalEntityGraphDemo.java",
        code: "package com.handbook.spring;\n\npublic class TransactionalEntityGraphDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/TransactionalEntityGraphDemo.java\n        System.out.println(\"Topic 97 Transactional and EntityGraph demo executed successfully\");\n    }\n}",
        output: "Topic 97 Transactional and EntityGraph demo executed successfully",
        stepByStep: [
          "Execute successful transaction and verify commit.",
          "Execute failing transaction and verify rollback on exception.",
          "Execute lazy loading loop and observe 1 + N query proliferation.",
          "Execute @EntityGraph / JOIN FETCH and assert query count is reduced to exactly 1."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Self-invocation of @Transactional methods",
        errorCodeOrSnippet: "public class OrderService {\n    public void outer() { inner(); }\n    @Transactional\n    public void inner() { /* db update */ }\n}",
        cause: "Because Spring uses AOP proxies, calling a method from within the same class (this.inner()) bypasses the proxy interceptor entirely. The transaction is never started!",
        solution: "Move the @Transactional method to a separate service bean, or inject the service into itself via self-injection."
      },
      {
        title: "Expecting rollbacks on checked exceptions by default",
        errorCodeOrSnippet: "@Transactional\npublic void process() throws IOException {\n    throw new IOException(\"File error\"); // Transaction COMMITS anyway!\n}",
        cause: "By default, Spring transactions only roll back on unchecked exceptions (RuntimeException and Error).",
        solution: "Explicitly declare rollbackFor: @Transactional(rollbackFor = Exception.class)."
      }
    ],
    bestPractices: {
      doList: [
        "Always annotate read-only query methods with @Transactional(readOnly = true) to disable dirty-checking snapshots.",
        "Always use @EntityGraph or JOIN FETCH whenever you know child collections will be traversed in business logic or serializers.",
        "Keep transaction boundaries as short as possible to prevent database connection pool starvation."
      ],
      dontList: [
        "Never perform external network HTTP calls or long calculations inside a @Transactional method.",
        "Never place @Transactional on private methods (Spring AOP proxies cannot intercept private methods).",
        "Avoid using Open Session In View (OSIV) in production; fetch all required data eagerly inside the service layer."
      ],
      whenNotToUse: "Do not use @EntityGraph to fetch multiple independent @OneToMany collections simultaneously (Cartesian product explosion; fetch at most one collection with JOIN FETCH, and use @BatchSize for others)."
    },
    versionNotes: {
      introduced: "Spring Transaction Management 1.0 -> @EntityGraph introduced in JPA 2.1 / Spring Data JPA 1.4",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3 disables OSIV warnings by default but OSIV remains discouraged for high-scale microservices.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Transaction Propagation Rules",
      headers: ["Propagation", "Existing Transaction?", "Action"],
      rows: [
        ["REQUIRED (Default)", "Yes / No", "Joins existing transaction, or starts a new one if none exists."],
        ["REQUIRES_NEW", "Yes / No", "Always suspends existing transaction and opens a brand new isolated transaction."],
        ["SUPPORTS", "Yes / No", "Executes inside transaction if one exists; executes non-transactionally otherwise."],
        ["MANDATORY", "Yes / No", "Must run inside existing transaction; throws exception if none exists."],
        ["NEVER", "Yes / No", "Must run non-transactionally; throws exception if an active transaction is detected."]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Silent Failure",
        prompt: "A developer writes @Transactional(readOnly = true) on a method, loads an entity, modifies a field, and expects it to be saved upon method exit. The database never updates. Why?",
        solution: "readOnly = true disables dirty-checking snapshot comparisons in Hibernate to conserve memory. Mutations on managed entities are intentionally not flushed to the database.",
        explanation: "Remove readOnly = true when an endpoint is intended to modify database state."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Define an EntityGraph Repository Query",
        prompt: "Write a repository method that finds a Customer by id and eagerly fetches both 'orders' and 'address' associations in 1 query.",
        starterCode: "public interface CustomerRepository extends JpaRepository<Customer, Long> {\n    // Define query with EntityGraph\n}",
        solution: "@EntityGraph(attributePaths = {\"orders\", \"address\"})\nOptional<Customer> findWithOrdersAndAddressById(Long id);",
        explanation: "attributePaths specifies the relationship graph to fetch eagerly using an outer join."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Multiple Bag Fetch Exception",
        prompt: "Why does Hibernate throw MultipleBagFetchException if you attempt to JOIN FETCH two separate List collections on the same entity simultaneously?",
        solution: "Joining two separate collections in a single SQL query produces a Cartesian product (M * N rows), which causes duplicate parent rows and prevents Hibernate from reliably reconstructing bag (List) semantics.",
        explanation: "Fetch one collection with JOIN FETCH and fetch the second collection using @BatchSize or separate queries."
      }
    ],
    officialSources: [
      {
        title: "Spring Framework: Transaction Management",
        url: "https://docs.spring.io/spring-framework/reference/data-access/transaction.html",
        organization: "Spring / VMware"
      },
      {
        title: "Vlad Mihalcea: The High-Performance Java Persistence Guide to N+1 Queries",
        url: "https://vladmihalcea.com/n-plus-1-query-problem/",
        organization: "Spring / VMware"
      }
    ]
  }
];
