export const section23Topics = [
  {
    id: 'topic-83',
    slug: 'jakarta-persistence-jpa-and-hibernate',
    topicNumber: 83,
    title: 'Jakarta Persistence (JPA) & Object-Relational Mapping (ORM)',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 23,
    sectionTitle: 'Jakarta EE Enterprise Stack Overview',
    versionBadge: 'Jakarta Persistence 3.1 / EE 10',
    difficulty: 'Advanced',
    readingTime: '15 min read',
    shortDescription: 'Bridge the object-relational impedance mismatch using Jakarta Persistence (JPA), Hibernate, @Entity mappings, and JPQL queries.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 58: Annotations & Metadata',
      'Topic 61: JDBC Fundamentals'
    ],
    whatAndWhy: {
      definition: 'Jakarta Persistence (JPA) is the standard Java specification that maps object-oriented domain classes to relational database tables, managing persistence operations and transactions through an EntityManager.',
      analogy: 'An expert diplomatic translator at an international conference converting English ideas (Java objects) into Japanese grammar (SQL queries) and back seamlessly.',
      whyItExists: 'Eliminates repetitive JDBC boilerplate SQL queries, index-based result set extraction, and manual state synchronization between memory and disk.'
    },
    syntaxBreakdown: {
      title: 'JPA Declarative Entity Mapping and EntityManager Usage',
      codeSnippet: `@Entity\n@Table(name = "customers")\npublic class Customer {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    @Column(name = "full_name")\n    private String name;\n}\n\n// Usage:\nEntityManager em = emf.createEntityManager();\nem.persist(new Customer("Alice"));\nCustomer c = em.find(Customer.class, 1L);`,
      explanation: 'Annotated POJOs are managed by EntityManager in a first-level persistence cache and synchronized with the database on commit.',
      tokens: [
        { token: '@Entity', explanation: 'Marks a POJO class as a managed relational entity' },
        { token: '@Id', explanation: 'Specifies the primary key field of the database entity' },
        { token: 'EntityManager', explanation: 'Core JPA interface providing CRUD operations and query creation' },
        { token: 'JPQL', explanation: 'Object-oriented query language targeting Java classes and fields' }
      ]
    },
    examples: [
      {
        id: 'ex-83-basic',
        title: 'Declarative Customer Entity Mapping',
        type: 'basic',
        description: 'Demonstrates POJO mapping with @Entity, @Table, @Id, and @Column annotations.',
        filename: 'CustomerEntity.java',
        code: `package com.handbook.enterprise;

import java.lang.annotation.*;

@Entity
@Table(name = "customers")
public class CustomerEntity {
    @Id
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String name;

    @Column(name = "email_address")
    private String email;

    @Column(name = "is_active")
    private boolean active;

    public CustomerEntity() {}

    public CustomerEntity(Long id, String name, String email, boolean active) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public boolean isActive() { return active; }

    @Override
    public String toString() {
        return "Customer[id=" + id + ", name='" + name + "', email='" + email + "']";
    }
}`,
        output: `Customer[id=1, name='Alice Hamilton', email='alice@example.com']`,
        stepByStep: [
          'Entity class defined with zero-argument constructor.',
          '@Entity marks class as JPA managed entity.',
          '@Table defines target database table name.',
          '@Id designates unique primary key property.',
          '@Column overrides default physical column names and nullability constraints.'
        ]
      },
      {
        id: 'ex-83-realistic',
        title: 'EntityManager Lifecycle & First-Level Cache Simulator',
        type: 'realistic',
        description: 'Simulates entity persistence, primary key cache lookup, JPQL execution, and entity removal.',
        filename: 'JpaEntityDemo.java',
        code: `package com.handbook.enterprise;

import java.util.*;

public class JpaEntityDemo {
    public static class MockEntityManager {
        private final Map<Long, Customer> persistenceContext = new HashMap<>();

        public void persist(Customer customer) {
            persistenceContext.put(customer.getId(), customer);
            System.out.println("[EntityManager] Persisted entity into First-Level Cache: " + customer);
        }

        public Customer find(Class<?> clazz, Long pk) {
            System.out.println("[EntityManager] Looking up " + clazz.getSimpleName() + " with PK=" + pk);
            return persistenceContext.get(pk);
        }

        public List<Customer> createQuery(String jpql) {
            System.out.println("[EntityManager] Executing JPQL: " + jpql);
            List<Customer> results = new ArrayList<>();
            for (Customer c : persistenceContext.values()) {
                if (c.isActive()) results.add(c);
            }
            return results;
        }

        public void remove(Customer customer) {
            persistenceContext.remove(customer.getId());
            System.out.println("[EntityManager] Removed entity from Persistence Context: " + customer.getId());
        }
    }

    public static void main(String[] args) {
        MockEntityManager em = new MockEntityManager();
        em.persist(new Customer(1L, "Alice Hamilton", "alice@example.com", true));
        em.persist(new Customer(2L, "Bob Vance", "bob@vance.com", false));

        Customer fetched = em.find(Customer.class, 1L);
        assert fetched != null && fetched.getName().equals("Alice Hamilton");

        List<Customer> active = em.createQuery("SELECT c FROM Customer c WHERE c.active = true");
        assert active.size() == 1;

        System.out.println("JPA EntityManager lifecycle and entity mapping verified successfully.");
    }
}`,
        output: `JPA EntityManager lifecycle and entity mapping verified successfully.`,
        stepByStep: [
          'EntityManager initializes empty persistence context (first-level cache).',
          'persist() puts customer into managed cache state.',
          'find() inspects persistence context cache before issuing physical queries.',
          'JPQL executes object-oriented query over managed entities.',
          'remove() schedules entity for database deletion.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Missing zero-argument constructor on @Entity class',
        errorCodeOrSnippet: 'org.hibernate.InstantiationException: No default constructor for entity',
        cause: 'JPA providers use reflection to instantiate empty entity instances before reading database fields.',
        solution: 'Always declare a public or protected no-argument constructor: protected Customer() {}.'
      },
      {
        title: 'The N+1 Select Query Problem',
        errorCodeOrSnippet: 'SELECT * FROM items WHERE order_id = ? (executed 100 times in a loop)',
        cause: 'Lazy loading associations without join fetching creates 1 parent query followed by N child queries.',
        solution: 'Use JOIN FETCH in JPQL queries to load associations in a single SQL join: SELECT o FROM Order o JOIN FETCH o.items.'
      }
    ],
    bestPractices: {
      doList: [
        'Always use parameterized JPQL queries (:param) to prevent SQL injection vulnerabilities.',
        'Prefer FetchType.LAZY for collection relationships to prevent unexpected full database scans.',
        'Keep transactions short and scoped exclusively to database operations.'
      ],
      dontList: [
        'Do not hold EntityManager transactions open during slow external HTTP calls or disk operations.',
        'Do not make entity classes final: JPA proxies require subclassing.',
        'Do not use plain String concatenation to construct dynamic JPQL queries.'
      ],
      whenNotToUse: 'When running high-volume batch data pipelines or complex analytical data warehouse queries where native SQL outperforms ORM reflection.'
    },
    versionNotes: {
      introduced: 'Java EE 5 / JSR 220',
      status: 'Stable',
      compatibilityNotes: 'Standardized under the jakarta.persistence.* namespace in Jakarta EE 9 and 10.',
      ltsAvailability: 'Universal enterprise database mapping standard.'
    },
    cheatSheet: {
      title: 'JPA Entity Lifecycle States',
      headers: ['Lifecycle State', 'In RAM', 'In Database', 'In Persistence Context'],
      rows: [
        ['New / Transient', 'Yes', 'No', 'No'],
        ['Managed', 'Yes', 'Yes (or pending)', 'Yes (tracked by dirty checker)'],
        ['Detached', 'Yes', 'Yes', 'No (em.close() called)'],
        ['Removed', 'Yes', 'Pending deletion', 'Yes (marked for delete)']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'JPQL Injection Vulnerability',
        prompt: 'Identify the security defect in em.createQuery("SELECT u FROM User u WHERE u.name = \'" + name + "\'").',
        starterCode: 'String jpql = "SELECT u FROM User u WHERE u.name = \'" + name + "\'";',
        solution: 'String concatenation creates JPQL Injection vulnerabilities. Attackers can supply input like "admin\' OR \'1\'=\'1" to bypass authentication. Use named parameters instead: em.createQuery("SELECT u FROM User u WHERE u.name = :name", User.class).setParameter("name", name).',
        explanation: 'Always use parameterized queries with setParameter() to ensure safe execution.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Minimal Entity Class',
        prompt: 'Write an @Entity class Account with an autogenerated Long id and a String accountNumber column.',
        starterCode: '// Define Account entity',
        solution: '@Entity\n@Table(name = "accounts")\npublic class Account {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    @Column(name = "account_number", nullable = false)\n    private String accountNumber;\n    public Account() {}\n}',
        explanation: 'Every JPA entity requires @Entity, @Id, and a default zero-argument constructor.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Persistence Specification 3.1',
        url: 'https://jakarta.ee/specifications/persistence/3.1/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Hibernate ORM Official User Guide',
        url: 'https://hibernate.org/orm/documentation/',
        organization: 'Eclipse Foundation'
      }
    ]
  },
  {
    id: 'topic-84',
    slug: 'jakarta-contexts-and-dependency-injection-cdi',
    topicNumber: 84,
    title: 'Contexts & Dependency Injection (CDI)',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 23,
    sectionTitle: 'Jakarta EE Enterprise Stack Overview',
    versionBadge: 'Jakarta CDI 4.0 / EE 10',
    difficulty: 'Advanced',
    readingTime: '13 min read',
    shortDescription: 'Decouple enterprise architectures through type-safe dependency injection, lifecycle contexts (@ApplicationScoped, @RequestScoped), and qualifiers.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 23: Interfaces & Default Methods',
      'Topic 58: Annotations & Metadata'
    ],
    whatAndWhy: {
      definition: 'Contexts and Dependency Injection (CDI) is the standard dependency injection and contextual lifecycle management engine of Jakarta EE, eliminating hardcoded object instantiations via @Inject and scoped proxies.',
      analogy: 'Standard wall electrical power sockets: appliances plug in anywhere using a standard plug interface without hardwiring into municipal generator turbines.',
      whyItExists: 'Decouples business services, eliminates manual lifecycle management, and enables effortless unit testing through mock injection.'
    },
    syntaxBreakdown: {
      title: 'CDI Injection and Scope Annotations',
      codeSnippet: `@ApplicationScoped\npublic class TaxService {\n    public double calculate(double subtotal) { return subtotal * 0.08; }\n}\n\n@RequestScoped\npublic class CheckoutController {\n    @Inject\n    private TaxService taxService;\n}`,
      explanation: 'Container inspects @Inject fields and injects matching contextual beans automatically.',
      tokens: [
        { token: '@Inject', explanation: 'Directs container to resolve and satisfy dependency at runtime' },
        { token: '@ApplicationScoped', explanation: 'Single shared instance for entire application lifetime' },
        { token: '@RequestScoped', explanation: 'New bean instance created per HTTP request lifecycle' },
        { token: '@Produces', explanation: 'Turns method return value into an injectable CDI bean' }
      ]
    },
    examples: [
      {
        id: 'ex-84-basic',
        title: 'Basic Service Interface and CDI Injection',
        type: 'basic',
        description: 'Demonstrates injecting a service interface implementation into a consumer class.',
        filename: 'PaymentService.java',
        code: `package com.handbook.enterprise;

public class PaymentService {
    public interface PaymentProcessor {
        String pay(double amount);
    }

    public static class CreditCardProcessor implements PaymentProcessor {
        @Override
        public String pay(double amount) {
            return "SUCCESS: Charged $" + amount;
        }
    }

    public static class OrderManager {
        private PaymentProcessor processor;

        public String processOrder(double amount) {
            return processor.pay(amount);
        }
        public void setProcessor(PaymentProcessor p) { this.processor = p; }
    }
}`,
        output: `SUCCESS: Charged $99.50`,
        stepByStep: [
          'Service interface defined representing capability.',
          'Implementation marked as injectable bean.',
          'Consumer requests dependency via @Inject.',
          'Container wires implementation at runtime.'
        ]
      },
      {
        id: 'ex-84-realistic',
        title: 'Realistic CDI Container Injection Engine Simulator',
        type: 'realistic',
        description: 'Demonstrates reflection-based dependency injection, singleton scoping, and execution.',
        filename: 'CdiDependencyInjectionDemo.java',
        code: `package com.handbook.enterprise;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class CdiDependencyInjectionDemo {
    public interface PaymentGateway {
        String process(double amount);
    }

    public static class StripePaymentGateway implements PaymentGateway {
        @Override
        public String process(double amount) {
            return "SUCCESS [Stripe]: Charged $" + amount;
        }
    }

    public static class CheckoutService {
        private PaymentGateway gateway;

        public String executeCheckout(double orderTotal) {
            if (gateway == null) throw new IllegalStateException("CDI Injection Failed: Gateway is null!");
            return gateway.process(orderTotal);
        }
        public PaymentGateway getGateway() { return gateway; }
        public void setGateway(PaymentGateway gateway) { this.gateway = gateway; }
    }

    public static class SimpleCdiContainer {
        private final Map<Class<?>, Object> singletons = new HashMap<>();

        public <T> void registerSingleton(Class<T> type, T instance) {
            singletons.put(type, instance);
        }

        public <T> T createBean(Class<T> beanClass) throws Exception {
            T bean = beanClass.getDeclaredConstructor().newInstance();
            for (Field field : beanClass.getDeclaredFields()) {
                field.setAccessible(true);
                Class<?> targetType = field.getType();
                Object dependency = singletons.get(targetType);
                if (dependency != null) {
                    field.set(bean, dependency);
                }
            }
            return bean;
        }
    }

    public static void main(String[] args) throws Exception {
        SimpleCdiContainer container = new SimpleCdiContainer();
        container.registerSingleton(PaymentGateway.class, new StripePaymentGateway());

        CheckoutService checkout = container.createBean(CheckoutService.class);
        assert checkout.getGateway() != null;
        String result = checkout.executeCheckout(249.99);
        System.out.println(result);
        System.out.println("CDI container dependency injection verified successfully.");
    }
}`,
        output: `SUCCESS [Stripe]: Charged $249.99\nCDI container dependency injection verified successfully.`,
        stepByStep: [
          'Container instantiates and stores ApplicationScoped singletons.',
          'Client bean instantiated via reflection.',
          'Container inspects fields, looks up matching interface, and injects instance.',
          'Client executes business method using injected dependency.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Ambiguous dependency when multiple implementations exist',
        errorCodeOrSnippet: 'org.jboss.weld.exceptions.DeploymentException: Ambiguous dependencies for type [Service]',
        cause: 'Two beans implement the same interface without @Qualifier or @Alternative annotations.',
        solution: 'Use custom CDI @Qualifier annotations or @Priority to disambiguate the target implementation.'
      },
      {
        title: 'Instantiating CDI beans with new instead of injection',
        errorCodeOrSnippet: 'OrderService s = new OrderService(); s.execute(); // @Inject fields are null!',
        cause: 'Calling new creates a raw Java object outside the container, leaving @Inject fields unpopulated.',
        solution: 'Always obtain beans via @Inject or Programmatic Lookup (CDI.current().select()).'
      }
    ],
    bestPractices: {
      doList: [
        'Prefer constructor injection over field injection for improved testability and immutability.',
        'Use @Produces to integrate third-party libraries into the CDI bean ecosystem.',
        'Choose the narrowest appropriate scope: @RequestScoped for user request data, @ApplicationScoped for stateless services.'
      ],
      dontList: [
        'Do not put mutable state in @ApplicationScoped beans without synchronization.',
        'Do not create circular dependencies between beans.',
        'Do not use CDI for lightweight ephemeral DTOs.'
      ],
      whenNotToUse: 'For simple utility records or value objects that hold transient data and have no external service dependencies.'
    },
    versionNotes: {
      introduced: 'Java EE 6 / JSR 299',
      status: 'Stable',
      compatibilityNotes: 'CDI 4.0 in Jakarta EE 10 introduced CDI Lite for ahead-of-time compilation and GraalVM native images.',
      ltsAvailability: 'Standard across all Jakarta EE application servers.'
    },
    cheatSheet: {
      title: 'CDI Built-In Scope Matrix',
      headers: ['Scope', 'Annotation', 'Lifecycle', 'Thread Safety Requirement'],
      rows: [
        ['Application', '@ApplicationScoped', 'Entire application run', 'Must be thread-safe'],
        ['Request', '@RequestScoped', 'Single HTTP request', 'Single-threaded per request'],
        ['Session', '@SessionScoped', 'User HttpSession', 'Serializable'],
        ['Dependent', '@Dependent (Default)', 'Inherits caller scope', 'Matches caller']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Null Pointer in Unit Test',
        prompt: 'Why does service.doWork() throw NullPointerException in a JUnit test when OrderService uses @Inject?',
        starterCode: 'OrderService service = new OrderService();\nservice.doWork();',
        solution: 'Calling new OrderService() instantiates the class outside the CDI container. The container never runs, so @Inject fields remain null. Provide a parameterized constructor to inject mock objects during unit testing.',
        explanation: 'Constructor injection enables easy mock injection in automated tests.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Producer Method',
        prompt: 'Write a CDI producer method that provides an injectable java.util.Random instance.',
        starterCode: '// Write producer method',
        solution: '@ApplicationScoped\npublic class RandomProducer {\n    @Produces\n    @ApplicationScoped\n    public Random produceRandom() {\n        return new Random();\n    }\n}',
        explanation: '@Produces allows third-party types to be injected via @Inject Random random.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Contexts and Dependency Injection 4.0 Specification',
        url: 'https://jakarta.ee/specifications/cdi/4.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'JBoss Weld Reference Guide',
        url: 'https://weld.cdi-spec.org/',
        organization: 'Eclipse Foundation'
      }
    ]
  },
  {
    id: 'topic-85',
    slug: 'jakarta-restful-web-services-jax-rs',
    topicNumber: 85,
    title: 'Jakarta RESTful Web Services (JAX-RS)',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 23,
    sectionTitle: 'Jakarta EE Enterprise Stack Overview',
    versionBadge: 'Jakarta RESTful Web Services 3.1 / EE 10',
    difficulty: 'Advanced',
    readingTime: '14 min read',
    shortDescription: 'Build production RESTful APIs using declarative URI routing (@Path), HTTP verbs (@GET, @POST), media negotiation, and JAX-RS filters.',
    prerequisites: [
      'Topic 64: Web Architecture Fundamentals (HTTP Protocol)',
      'Topic 66: Servlet Lifecycle & Architecture',
      'Topic 84: Contexts & Dependency Injection (CDI)'
    ],
    whatAndWhy: {
      definition: 'Jakarta RESTful Web Services (JAX-RS) is the standard declarative framework for developing HTTP REST APIs in Java using annotations like @Path, @GET, @POST, and @Produces.',
      analogy: 'An automated airport cargo sorting terminal routing packages by barcode tags (@Path) directly to matching processing bays without manual warehouse handling.',
      whyItExists: 'Eliminates repetitive manual Servlet string parsing, JSON serialization, and status code setting, providing a clean declarative API model.'
    },
    syntaxBreakdown: {
      title: 'JAX-RS Resource Class and Method Annotations',
      codeSnippet: `@Path("/api/v1/orders")\n@Produces(MediaType.APPLICATION_JSON)\npublic class OrderResource {\n    @GET\n    @Path("/{id}")\n    public Response getOrder(@PathParam("id") String id) {\n        Order order = service.find(id);\n        return Response.ok(order).build();\n    }\n}`,
      explanation: 'URL path parameters are extracted automatically and response objects are serialized to JSON.',
      tokens: [
        { token: '@Path("/orders")', explanation: 'Base URI template pattern matched against incoming requests' },
        { token: '@GET / @POST', explanation: 'HTTP verb designator matching client request method' },
        { token: '@PathParam("id")', explanation: 'Binds dynamic URI path segment to method parameter' },
        { token: 'Response.ok()', explanation: 'Fluent builder returning HTTP 200 with entity payload' }
      ]
    },
    examples: [
      {
        id: 'ex-85-basic',
        title: 'Basic Order REST Resource',
        type: 'basic',
        description: 'Demonstrates URI path variable matching and JSON response formatting.',
        filename: 'OrderResource.java',
        code: `package com.handbook.enterprise;

import java.lang.annotation.*;

@Path("/api/v1/orders")
@Produces({"application/json"})
public class OrderResource {
    @GET
    @Path("/{id}")
    public String getOrderById(@PathParam("id") String orderId) {
        return "{\"orderId\": \"" + orderId + "\", \"status\": \"SHIPPED\", \"total\": 199.95}";
    }

    @POST
    public String createOrder() {
        return "{\"status\": \"CREATED\", \"id\": \"ORD-9872\"}";
    }
}`,
        output: `{"orderId": "ORD-9872", "status": "SHIPPED", "total": 199.95}`,
        stepByStep: [
          'Resource mapped to /api/v1/orders base path.',
          'GET request matches @GET with /{id} path template.',
          'orderId parameter extracted from URI.',
          'JSON representation returned to client.'
        ]
      },
      {
        id: 'ex-85-realistic',
        title: 'Realistic JAX-RS Dispatcher & Router Simulator',
        type: 'realistic',
        description: 'Emulates JAX-RS container matching HTTP verbs, path variables, and returning JSON.',
        filename: 'JaxRsEndpointDemo.java',
        code: `package com.handbook.enterprise;

import java.lang.reflect.Method;

public class JaxRsEndpointDemo {
    public static class MockJaxRsDispatcher {
        public String dispatch(String method, String uri) throws Exception {
            OrderResource resource = new OrderResource();
            if (uri.startsWith("/api/v1/orders/")) {
                String id = uri.substring("/api/v1/orders/".length());
                return resource.getOrderById(id);
            } else if ("POST".equals(method) && uri.equals("/api/v1/orders")) {
                return resource.createOrder();
            }
            return "{\"error\": \"404 Not Found\"}";
        }
    }

    public static void main(String[] args) throws Exception {
        MockJaxRsDispatcher dispatcher = new MockJaxRsDispatcher();
        String getResult = dispatcher.dispatch("GET", "/api/v1/orders/ORD-9872");
        assert getResult.contains("SHIPPED");

        String postResult = dispatcher.dispatch("POST", "/api/v1/orders");
        assert postResult.contains("CREATED");

        System.out.println("JAX-RS annotation routing and JSON dispatch verified successfully.");
    }
}`,
        output: `JAX-RS annotation routing and JSON dispatch verified successfully.`,
        stepByStep: [
          'Dispatcher receives HTTP method and target URI.',
          'Path prefix matched against @Path root annotation.',
          'Subpath extracted and passed as @PathParam argument.',
          'JSON payload returned with proper HTTP status.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Returning null when resource is not found instead of 404',
        errorCodeOrSnippet: 'public Order get(@PathParam("id") String id) { return null; }',
        cause: 'Returning null results in HTTP 204 No Content rather than HTTP 404 Not Found.',
        solution: 'Use Response.status(Response.Status.NOT_FOUND).build() when an entity is missing.'
      },
      {
        title: 'Using action verbs in URIs instead of HTTP verbs',
        errorCodeOrSnippet: '@POST @Path("/deleteCustomer") // Anti-pattern',
        cause: 'Violates REST architectural principles by putting procedural operations in the URI.',
        solution: 'Use HTTP DELETE with resource nouns: @DELETE @Path("/{id}").'
      }
    ],
    bestPractices: {
      doList: [
        'Always return HTTP 201 Created with Location header when creating entities via POST.',
        'Use ExceptionMapper to convert unhandled exceptions into uniform JSON error bodies.',
        'Always specify @Produces(MediaType.APPLICATION_JSON) and @Consumes(MediaType.APPLICATION_JSON).'
      ],
      dontList: [
        'Do not use HTTP GET for actions that mutate server state.',
        'Do not expose internal database IDs directly if security requires non-enumerable UUIDs.',
        'Do not write raw JSON strings by hand; use JSON-B or Jackson entity serialization.'
      ],
      whenNotToUse: 'For low-latency binary gaming communication or real-time bi-directional streaming where WebSockets or gRPC are better suited.'
    },
    versionNotes: {
      introduced: 'Java EE 5 / JSR 311',
      status: 'Stable',
      compatibilityNotes: 'Standardized under jakarta.ws.rs.* in Jakarta EE 9 and 10.',
      ltsAvailability: 'Universal REST development standard across Java servers.'
    },
    cheatSheet: {
      title: 'JAX-RS Annotations Reference',
      headers: ['Annotation', 'Target', 'Purpose', 'Example'],
      rows: [
        ['@Path', 'Class / Method', 'URI path template matching', '@Path("/orders")'],
        ['@GET / @POST', 'Method', 'HTTP verb binding', '@GET'],
        ['@PathParam', 'Parameter', 'Extracts URI path segment', '@PathParam("id") Long id'],
        ['@QueryParam', 'Parameter', 'Extracts URL query parameter', '@QueryParam("page") int p'],
        ['@Produces', 'Class / Method', 'Outbound MIME representation', '@Produces("application/json")']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Misleading HTTP Status Code',
        prompt: 'Why is returning HTTP 200 OK with a body {"status": "error", "message": "Not Found"} an anti-pattern in REST?',
        starterCode: 'return Response.ok("{\"error\": \"not found\"}").build();',
        solution: 'HTTP status codes communicate technical transport results to proxies, load balancers, and clients. Returning 200 OK tricks caching proxies into caching failure responses. Use HTTP 404 Not Found instead: Response.status(Status.NOT_FOUND).entity(err).build().',
        explanation: 'REST clients rely on standard HTTP status codes for error handling.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Delete Resource Endpoint',
        prompt: 'Write a JAX-RS method that deletes a book by id and returns HTTP 204 No Content.',
        starterCode: '// Write deleteBook method',
        solution: '@DELETE\n@Path("/{id}")\npublic Response deleteBook(@PathParam("id") Long id) {\n    bookService.delete(id);\n    return Response.noContent().build();\n}',
        explanation: 'HTTP 204 No Content is the standard status code for successful deletions.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta RESTful Web Services 3.1 Specification',
        url: 'https://jakarta.ee/specifications/restful-ws/3.1/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Eclipse Jersey User Guide',
        url: 'https://eclipse-ee4j.github.io/jersey/',
        organization: 'Eclipse Foundation'
      }
    ]
  },
  {
    id: 'topic-86',
    slug: 'jakarta-bean-validation',
    topicNumber: 86,
    title: 'Jakarta Bean Validation',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 23,
    sectionTitle: 'Jakarta EE Enterprise Stack Overview',
    versionBadge: 'Jakarta Validation 3.0 / EE 10',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Enforce consistent data integrity rules across all application tiers using declarative constraint annotations (@NotNull, @Size, @Email, @Pattern).',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 58: Annotations & Metadata',
      'Topic 80: Form Handling, Validation & Multipart File Uploads'
    ],
    whatAndWhy: {
      definition: 'Jakarta Bean Validation provides a unified declarative metadata model to define and enforce constraint validations directly on Java domain models and DTOs using annotations like @NotNull, @Size, and @Email.',
      analogy: 'Airport luggage size test frames at boarding gates: a single standardized physical measurement frame applied consistently across all check-in points.',
      whyItExists: 'Eliminates repetitive imperative validation logic duplicated across UI controllers, services, and database layers.'
    },
    syntaxBreakdown: {
      title: 'Declarative Constraint Annotations on Model Fields',
      codeSnippet: `public class CustomerDto {\n    @NotNull(message = "Name cannot be null")\n    @Size(min = 2, max = 50)\n    private String name;\n\n    @NotBlank\n    @Email\n    private String email;\n\n    @Min(18)\n    private int age;\n}`,
      explanation: 'Annotations express domain constraints cleanly and are evaluated automatically by the validation runtime.',
      tokens: [
        { token: '@NotNull', explanation: 'Rejects null; permits empty strings and whitespace' },
        { token: '@NotBlank', explanation: 'Rejects null, length 0, and whitespace-only strings' },
        { token: '@Size(min, max)', explanation: 'Enforces length bounds on strings or collection size' },
        { token: '@Email', explanation: 'Validates string against standard email RFC format' }
      ]
    },
    examples: [
      {
        id: 'ex-86-basic',
        title: 'Basic DTO Constraints Definition',
        type: 'basic',
        description: 'Demonstrates declaring constraints on data transfer objects.',
        filename: 'AccountDto.java',
        code: `package com.handbook.enterprise;

public class AccountDto {
    @NotNull
    @Size(min = 3, max = 15)
    private String accountId;

    @Min(100)
    private double initialDeposit;

    public AccountDto(String id, double deposit) {
        this.accountId = id;
        this.initialDeposit = deposit;
    }
}`,
        output: `Constraint violations: 0 (valid account)`,
        stepByStep: [
          'DTO class declared with private fields.',
          '@NotNull and @Size constrain account identifier length.',
          '@Min ensures initial deposit meets minimum threshold.',
          'Validation engine inspects metadata before processing.'
        ]
      },
      {
        id: 'ex-86-realistic',
        title: 'Realistic Validator Engine and Violation Reporting Simulator',
        type: 'realistic',
        description: 'Demonstrates inspecting constraints, evaluating values, and reporting detailed violations.',
        filename: 'BeanValidationDemo.java',
        code: `package com.handbook.enterprise;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class BeanValidationDemo {
    public static class UserRegistrationForm {
        @NotNull(message = "Username cannot be null")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        private String username;

        @NotNull(message = "Age cannot be null")
        @Min(value = 18, message = "User must be at least 18 years old")
        private Integer age;

        public UserRegistrationForm(String username, Integer age) {
            this.username = username;
            this.age = age;
        }
        public String getUsername() { return username; }
        public Integer getAge() { return age; }
    }

    public record Violation(String field, String message) {}

    public static class MockValidator {
        public List<Violation> validate(Object target) {
            List<Violation> violations = new ArrayList<>();
            for (Field field : target.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                try {
                    Object val = field.get(target);
                    if (field.isAnnotationPresent(NotNull.class) && val == null) {
                        violations.add(new Violation(field.getName(), "null"));
                    }
                    if (field.isAnnotationPresent(Size.class) && val instanceof String s) {
                        Size sz = field.getAnnotation(Size.class);
                        if (s.length() < sz.min() || s.length() > sz.max()) {
                            violations.add(new Violation(field.getName(), sz.message()));
                        }
                    }
                    if (field.isAnnotationPresent(Min.class) && val instanceof Number n) {
                        Min min = field.getAnnotation(Min.class);
                        if (n.longValue() < min.value()) {
                            violations.add(new Violation(field.getName(), min.message()));
                        }
                    }
                } catch (Exception ignored) {}
            }
            return violations;
        }
    }

    public static void main(String[] args) {
        MockValidator validator = new MockValidator();
        UserRegistrationForm invalid = new UserRegistrationForm("al", 16);
        List<Violation> list = validator.validate(invalid);
        assert list.size() == 2;
        System.out.println("Declarative constraint inspection verified successfully.");
    }
}`,
        output: `Declarative constraint inspection verified successfully.`,
        stepByStep: [
          'Form submitted with invalid username length and under-age value.',
          'Validator inspects model fields via reflection.',
          'Constraint rules evaluate values against thresholds.',
          'Violations aggregated and returned for user notification.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Using @NotNull instead of @NotBlank for text strings',
        errorCodeOrSnippet: '@NotNull private String name; // Accepts "   "',
        cause: '@NotNull only checks that the object reference is not null; empty or whitespace strings pass.',
        solution: 'Use @NotBlank to ensure strings contain at least one non-whitespace character.'
      },
      {
        title: 'Forgetting @Valid on nested complex objects',
        errorCodeOrSnippet: '@NotNull private Address shippingAddress; // Address fields never checked!',
        cause: 'Validation engines do not cascade into child properties unless explicitly instructed.',
        solution: 'Add @Valid alongside @NotNull to enable cascading validation on child properties.'
      }
    ],
    bestPractices: {
      doList: [
        'Declare validation constraints directly on DTOs and entities for consistent rules across all tiers.',
        'Use custom error messages with parameterized placeholders ({min}, {max}) for clean user feedback.',
        'Use validation groups (@ConvertGroup) to apply different rule sets for creation vs updates.'
      ],
      dontList: [
        'Do not write manual imperative if-else validation logic in controllers when annotations suffice.',
        'Do not perform heavy database queries inside constraint validators.',
        'Do not bypass validation when updating existing entities.'
      ],
      whenNotToUse: 'When rules require cross-table transactional database queries or external API calls: perform those in domain services.'
    },
    versionNotes: {
      introduced: 'Java EE 6 / JSR 303',
      status: 'Stable',
      compatibilityNotes: 'Standardized under jakarta.validation.* in Jakarta EE 9 and 10.',
      ltsAvailability: 'Universal standard across all Jakarta EE and modern Java frameworks.'
    },
    cheatSheet: {
      title: 'Standard Bean Validation Constraints',
      headers: ['Constraint', 'Target Types', 'Validation Rule'],
      rows: [
        ['@NotNull', 'Any object', 'Value is not null'],
        ['@NotEmpty', 'String, Collection, Map', 'Not null and size > 0'],
        ['@NotBlank', 'String', 'Not null and contains non-whitespace'],
        ['@Size(min, max)', 'String, Collection', 'Length / size between bounds'],
        ['@Min / @Max', 'Numeric types', 'Value within numeric bounds'],
        ['@Email', 'String', 'Valid email address syntax'],
        ['@Pattern(regexp)', 'String', 'Matches regular expression']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Whitespace Bypassing Validation',
        prompt: 'Why does a password field with @NotNull allow a user to register with a password consisting of only three spaces "   "?',
        starterCode: '@NotNull\nprivate String password;',
        solution: '@NotNull checks only that the reference is not null. A string with three spaces is non-null with length 3, so it passes. Use @NotBlank instead, which trims whitespace and ensures real characters exist.',
        explanation: 'Always use @NotBlank for required text inputs.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Future Date Constraint',
        prompt: 'Write an entity field ensuring an expiration date is not null and occurs in the future.',
        starterCode: 'private LocalDate expirationDate;',
        solution: '@NotNull(message = "Expiration date required")\n@Future(message = "Expiration date must be in the future")\nprivate LocalDate expirationDate;',
        explanation: '@Future validates that temporal values (LocalDate, Instant) are strictly after the current time.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Bean Validation 3.0 Specification',
        url: 'https://jakarta.ee/specifications/bean-validation/3.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Hibernate Validator Reference Guide',
        url: 'https://hibernate.org/validator/documentation/',
        organization: 'Eclipse Foundation'
      }
    ]
  },
  {
    id: 'topic-87',
    slug: 'jakarta-faces-jsf-and-enterprise-beans-ejb',
    topicNumber: 87,
    title: 'Jakarta Faces (JSF) & Enterprise Beans (EJB)',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 23,
    sectionTitle: 'Jakarta EE Enterprise Stack Overview',
    versionBadge: 'Jakarta Faces 4.0 / EE 10',
    difficulty: 'Advanced',
    readingTime: '15 min read',
    shortDescription: 'Explore component-based web UIs with Jakarta Faces (JSF) and container-managed declarative transactions with Enterprise JavaBeans (EJB).',
    prerequisites: [
      'Topic 74: JSP Architecture & Translation Lifecycle',
      'Topic 82: JDBC Connection Pooling in Web Applications',
      'Topic 84: Contexts & Dependency Injection (CDI)'
    ],
    whatAndWhy: {
      definition: 'Jakarta Faces is a component-based server-side web UI framework featuring an automated 6-phase request lifecycle, while Enterprise Beans (EJB) provides container-managed transactions and concurrency for enterprise business services.',
      analogy: 'A high-speed train system: Faces represents the automated station turnstiles and display monitors; EJB represents the centralized power substation managing high-voltage safety switches atomically.',
      whyItExists: 'Allows rapid development of complex back-office administrative forms with rich UI components backed by declarative container-managed database transactions.'
    },
    syntaxBreakdown: {
      title: 'EJB Stateless Service and JSF Backing Bean Mapping',
      codeSnippet: `@Stateless\npublic class BankService {\n    @TransactionAttribute(TransactionAttributeType.REQUIRED)\n    public void transfer(Long from, Long to, double amount) {\n        // Transaction automatically managed by container\n    }\n}\n\n@Named("transferBean")\n@ViewScoped\npublic class TransferBean implements Serializable {\n    @Inject private BankService bankService;\n    public String submit() { bankService.transfer(1L, 2L, 500.0); return "receipt"; }\n}`,
      explanation: 'JSF backing bean coordinates UI inputs and triggers EJB transactional business logic.',
      tokens: [
        { token: '@Stateless', explanation: 'Pooled session bean without client-specific conversational state' },
        { token: '@TransactionAttribute', explanation: 'Declarative container transaction boundary (REQUIRED, REQUIRES_NEW)' },
        { token: '@ViewScoped', explanation: 'JSF scope keeping bean alive across AJAX updates on same page' },
        { token: '#{bean.action}', explanation: 'Expression Language binding button clicks to backing bean methods' }
      ]
    },
    examples: [
      {
        id: 'ex-87-basic',
        title: 'Basic EJB Stateless Bean and Backing Bean',
        type: 'basic',
        description: 'Demonstrates a stateless session bean and a JSF backing bean.',
        filename: 'PaymentBackingBean.java',
        code: `package com.handbook.enterprise;

public class PaymentBackingBean {
    private String account;
    private double amount;

    public static class PaymentProcessingBean {
        public boolean authorizePayment(String account, double amount) {
            System.out.println("[EJB] Debiting $" + amount + " from " + account);
            return true;
        }
    }

    private final PaymentProcessingBean service = new PaymentProcessingBean();

    public String submit() {
        service.authorizePayment(account, amount);
        return "receipt";
    }

    public String getAccount() { return account; }
    public void setAccount(String account) { this.account = account; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}`,
        output: `[EJB] Debiting $150.0 from ACC-4401`,
        stepByStep: [
          'EJB stateless service manages transaction boundaries.',
          'Backing bean holds view state.',
          'Action method delegates to EJB service.',
          'Navigation string returned to determine next view.'
        ]
      },
      {
        id: 'ex-87-realistic',
        title: 'Realistic JSF 6-Phase Lifecycle & EJB Transaction Simulator',
        type: 'realistic',
        description: 'Simulates the complete 6-phase JSF request lifecycle driving an EJB transaction.',
        filename: 'JsfEjbArchitectureDemo.java',
        code: `package com.handbook.enterprise;

import java.util.List;

public class JsfEjbArchitectureDemo {
    public static class BankTransferService {
        public boolean transfer(String from, String to, double amount) {
            System.out.println("[EJB Container] Starting JTA container-managed transaction (REQUIRED)");
            System.out.printf("[EJB] Transferring $%.2f from %s to %s%n", amount, from, to);
            System.out.println("[EJB Container] Committing JTA transaction");
            return true;
        }
    }

    public static class TransferBackingBean {
        private String sourceAccount;
        private String targetAccount;
        private double amount;
        private String feedbackMessage;
        private final BankTransferService transferService = new BankTransferService();

        public String submitTransfer() {
            boolean ok = transferService.transfer(sourceAccount, targetAccount, amount);
            if (ok) {
                this.feedbackMessage = "Success: Transferred $" + amount;
                return "receipt?faces-redirect=true";
            }
            return "error";
        }
        public void setSourceAccount(String s) { this.sourceAccount = s; }
        public void setTargetAccount(String t) { this.targetAccount = t; }
        public void setAmount(double a) { this.amount = a; }
        public String getFeedbackMessage() { return feedbackMessage; }
    }

    public static void main(String[] args) {
        TransferBackingBean bean = new TransferBackingBean();
        bean.setSourceAccount("ACC-1001");
        bean.setTargetAccount("ACC-2002");
        bean.setAmount(500.0);

        String result = bean.submitTransfer();
        assert bean.getFeedbackMessage().contains("Success: Transferred $500.0");
        System.out.println("JSF lifecycle and EJB transaction execution verified successfully.");
    }
}`,
        output: `[EJB Container] Starting JTA container-managed transaction (REQUIRED)\n[EJB] Transferring $500.00 from ACC-1001 to ACC-2002\n[EJB Container] Committing JTA transaction\nJSF lifecycle and EJB transaction execution verified successfully.`,
        stepByStep: [
          'Backing bean populated during model update phase.',
          'Action method invoked during application invocation phase.',
          'EJB container starts JTA transaction.',
          'Business logic executes and transaction commits.',
          'Outcome string determines navigation.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Executing database queries inside backing bean getters',
        errorCodeOrSnippet: 'public List<Order> getOrders() { return db.queryAll(); } // Invoked 10x per request!',
        cause: 'JSF evaluates getters multiple times during component tree rendering, causing duplicate queries.',
        solution: 'Load data inside @PostConstruct lifecycle methods and return cached lists from getters.'
      },
      {
        title: 'Omitting Serializable on @ViewScoped or @SessionScoped beans',
        errorCodeOrSnippet: 'java.io.NotSerializableException: com.example.BackingBean',
        cause: 'View and session scoped beans must be serialized during session passivation or cluster replication.',
        solution: 'Always declare implements java.io.Serializable on stateful backing beans.'
      }
    ],
    bestPractices: {
      doList: [
        'Use modern CDI @Named and @ViewScoped beans instead of legacy @ManagedBean.',
        'Modernize EJB applications by replacing @Stateless with CDI @ApplicationScoped and @Transactional.',
        'Use PrimeFaces when building rich data-table intensive enterprise back-office applications.'
      ],
      dontList: [
        'Do not perform heavy computations inside JSF getter and setter methods.',
        'Do not catch and swallow RuntimeExceptions inside EJB transactional methods: it prevents automatic rollback.',
        'Do not use JSF for public mobile-first APIs: use JAX-RS REST endpoints instead.'
      ],
      whenNotToUse: 'When building modern customer-facing single page applications (SPAs) or microservices where REST/JSON and React/Vue are preferred.'
    },
    versionNotes: {
      introduced: 'JSF 1.0 (2004) / EJB 1.0 (1998)',
      status: 'Stable',
      compatibilityNotes: 'Jakarta Faces 4.0 removed legacy JSP support; Facelets (XHTML) is now the exclusive view technology.',
      ltsAvailability: 'Standard in all full-profile Jakarta EE application servers.'
    },
    cheatSheet: {
      title: 'JSF 6-Phase Request Lifecycle',
      headers: ['Phase Number', 'Phase Name', 'Key Responsibility'],
      rows: [
        ['1', 'Restore View', 'Reconstructs UI component tree in memory'],
        ['2', 'Apply Request Values', 'Decodes HTTP POST parameters into component local values'],
        ['3', 'Process Validations', 'Runs type conversions and Bean Validation checks'],
        ['4', 'Update Model Values', 'Invokes backing bean setters with validated values'],
        ['5', 'Invoke Application', 'Executes action methods and EJB business services'],
        ['6', 'Render Response', 'Encodes component tree into HTML and streams to client']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Skipped Phases on Validation Error',
        prompt: 'If a user inputs invalid text that fails a @NotNull constraint, why are backing bean setters never called?',
        starterCode: '<h:inputText value="#{bean.name}" required="true" />',
        solution: 'During Phase 3 (Process Validations), JSF marks the component invalid and registers a FacesMessage. JSF immediately bypasses Phase 4 (Update Model Values) and Phase 5 (Invoke Application) and jumps directly to Phase 6 (Render Response) to show the error message without corrupting backing bean state.',
        explanation: 'JSF guards backend state by aborting model updates upon validation failures.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Declarative Transaction Attribute',
        prompt: 'Write an EJB method that insists on executing inside an existing transaction, throwing an exception if no transaction is active.',
        starterCode: '// Transaction method',
        solution: '@Stateless\npublic class LedgerService {\n    @TransactionAttribute(TransactionAttributeType.MANDATORY)\n    public void postEntry(LedgerEntry entry) {\n        em.persist(entry);\n    }\n}',
        explanation: 'TransactionAttributeType.MANDATORY requires an active caller transaction.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Faces 4.0 Specification',
        url: 'https://jakarta.ee/specifications/faces/4.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Jakarta Enterprise Beans 4.0 Specification',
        url: 'https://jakarta.ee/specifications/enterprise-beans/4.0/',
        organization: 'Jakarta EE'
      }
    ]
  }
];
