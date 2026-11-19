export const section24Topics = [
  // Topic 88: Spring Framework Core, BeanFactory vs ApplicationContext
  {
    id: "topic-88",
    slug: "spring-framework-core-beanfactory-vs-applicationcontext",
    topicNumber: 88,
    title: "Spring Framework Core: BeanFactory vs ApplicationContext",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 24,
    sectionTitle: "Spring Core & Inversion of Control",
    versionBadge: "Spring 6.x / Boot 3.x",
    difficulty: "Intermediate",
    readingTime: "14 min read",
    shortDescription: "Explore the architectural foundation of the Spring Inversion of Control (IoC) container, comparing BeanFactory with ApplicationContext, lazy vs eager instantiation, and contextual infrastructure.",
    prerequisites: [
      "Topic 16: Classes, Objects & Memory Layout",
      "Topic 23: Interfaces & Modern Interface Evolution",
      "Topic 59: Reflection API & Dynamic Invocation",
      "Topic 84: Contexts and Dependency Injection (CDI)"
    ],
    whatAndWhy: {
      definition: "Inversion of Control (IoC) delegates object creation, dependency resolution, and lifecycle management to an automated container, implemented via BeanFactory and ApplicationContext.",
      analogy: "A general contractor building a turnkey luxury home: rather than you pouring concrete and installing pipes, the contractor validates all architectural blueprints and delivers a fully inspected house ready for immediate occupancy.",
      whyItExists: "Eliminates tight coupling, allows effortless mock testing with test doubles, externalizes configuration, and provides enterprise services (transactions, security, caching, telemetry) transparently."
    },
    syntaxBreakdown: {
      title: "Spring IoC Container Bootstrapping Syntax",
      codeSnippet: "@Configuration\npublic class AppConfig {\n    @Bean\n    public PaymentGateway paymentGateway() {\n        return new StripePaymentGateway();\n    }\n}\n\n// Bootstrap container\nvar context = new AnnotationConfigApplicationContext(AppConfig.class);\nPaymentGateway gateway = context.getBean(PaymentGateway.class);",
      explanation: "Declaring @Configuration and @Bean provides type-safe container recipes. AnnotationConfigApplicationContext initializes the container eagerly.",
      tokens: [
        { token: "@Configuration", explanation: "Indicates that a class declares one or more @Bean methods and may be processed by the Spring container." },
        { token: "@Bean", explanation: "Marks a factory method that produces a bean to be managed by the Spring ApplicationContext." },
        { token: "AnnotationConfigApplicationContext", explanation: "Standalone application context accepting annotated classes as input for bootstrapping." },
        { token: "getBean()", explanation: "Retrieves a type-safe singleton bean instance from the container registry." }
      ]
    },
    examples: [
      {
        id: "ex-88-1",
        title: "Basic Container Comparison: Lazy vs Eager",
        type: "basic",
        description: "Demonstrates the behavioral difference between lazy on-demand instantiation and eager pre-instantiation.",
        filename: "ContainerBootstrapComparison.java",
        code: "import java.util.*;\n\npublic class ContainerBootstrapComparison {\n    static class AuditService {\n        public AuditService() { System.out.println(\"[AuditService] Initialized\"); }\n        public void log() { System.out.println(\"[AuditService] Audit record stored\"); }\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Lazy instantiation creates instances only when queried:\");\n        var service = new AuditService();\n        service.log();\n    }\n}",
        output: "Lazy instantiation creates instances only when queried:\n[AuditService] Initialized\n[AuditService] Audit record stored",
        stepByStep: [
          "Define managed domain service.",
          "Instantiate and record lifecycle timestamp.",
          "Invoke business method on retrieved bean."
        ]
      },
      {
        id: "ex-88-2",
        title: "Production ApplicationContext Architecture",
        type: "realistic",
        description: "Full enterprise demonstration with event publishing, environment profile resolution, and container singletons.",
        filename: "BeanFactoryVsApplicationContextDemo.java",
        code: "package com.handbook.spring;\n\npublic class BeanFactoryVsApplicationContextDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/BeanFactoryVsApplicationContextDemo.java\n        System.out.println(\"BeanFactory vs ApplicationContext architectural mechanics verified successfully\");\n    }\n}",
        output: "BeanFactory vs ApplicationContext architectural mechanics verified successfully",
        stepByStep: [
          "Configure environment properties and profiles.",
          "Instantiate and eager register singletons into ApplicationContext.",
          "Publish enterprise domain events via ApplicationEventPublisher.",
          "Verify singleton caching and dependency integrity."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Premature getBean() Call in Constructor (Service Locator Anti-Pattern)",
        errorCodeOrSnippet: "public OrderService() { this.gateway = ctx.getBean(PaymentGateway.class); }",
        wrongCode: "public class OrderService {\n    private final PaymentGateway gateway;\n    public OrderService() {\n        ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);\n        this.gateway = ctx.getBean(PaymentGateway.class);\n    }\n}",
        fixedCode: "@Service\npublic class OrderService {\n    private final PaymentGateway gateway;\n    @Autowired\n    public OrderService(PaymentGateway gateway) {\n        this.gateway = gateway;\n    }\n}",
        cause: "Manual container instantiation inside domain classes leaks framework coupling and reboots the context repeatedly.",
        solution: "Use pure Constructor Injection and let Spring supply dependencies automatically."
      },
      {
        title: "Missing @ComponentScan Causing NoSuchBeanDefinitionException",
        errorCodeOrSnippet: "NoSuchBeanDefinitionException: No qualifying bean of type 'com.service.BillingService'",
        wrongCode: "@Configuration\npublic class AppConfig { /* Missing @ComponentScan */ }",
        fixedCode: "@Configuration\n@ComponentScan(basePackages = \"com.enterprise\")\npublic class AppConfig {}",
        cause: "Spring cannot find annotated components outside the designated base package scan paths.",
        solution: "Specify explicit basePackages in @ComponentScan or place configuration at the root package."
      }
    ],
    bestPractices: {
      doList: [
        "Always use ApplicationContext in server-side production systems to catch configuration errors at startup.",
        "Favor modern Java configuration classes with @Configuration and @Bean over legacy XML.",
        "Close application contexts using try-with-resources or Spring Boot run methods to trigger graceful shutdown."
      ],
      dontList: [
        "Do not use BeanFactory in production microservices unless severely memory-constrained (IoT).",
        "Do not call context.getBean() manually inside service or controller business methods.",
        "Do not swallow BeanCreationException during container bootstrap."
      ],
      whenNotToUse: "Do not use manual IoC containers for simple standalone algorithms or purely functional mathematical libraries with no external I/O collaborators."
    },
    versionNotes: {
      introduced: "Spring Framework 1.0 (2004)",
      status: "Stable",
      compatibilityNotes: "Spring 6.0+ requires Java 17 LTS baseline and supports Ahead-of-Time (AOT) GraalVM native compilation.",
      ltsAvailability: "Full production support across Spring Framework 6.x and Spring Boot 3.x"
    },
    cheatSheet: {
      title: "BeanFactory vs ApplicationContext Comparison",
      headers: ["Dimension", "BeanFactory", "ApplicationContext"],
      rows: [
        ["Package", "org.springframework.beans.factory", "org.springframework.context"],
        ["Instantiation", "Lazy (on-demand when getBean called)", "Eager (pre-instantiates all singletons)"],
        ["AOP Auto-Proxy", "Requires manual BeanPostProcessor setup", "Automatic discovery of BeanPostProcessors"],
        ["Event Publishing", "Not supported", "Supported via ApplicationEventPublisher"],
        ["i18n Messages", "Not supported", "Supported via MessageSource"],
        ["Primary Use Case", "Ultra-constrained IoT memory", "Enterprise Backends & Microservices"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Service Locator Blunder",
        prompt: "Identify the critical architectural error in instantiating new AnnotationConfigApplicationContext inside a domain service constructor.",
        solution: "Instantiating the container manually inside the constructor creates a new Spring context on every object creation, causing memory leaks, thread pool exhaustion, and destroying testability. Replace with Constructor Injection.",
        explanation: "Spring manages components from the outside. A service should declare what it requires via constructor parameters without any knowledge of who creates it."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Event-Driven Order Completion",
        prompt: "Write an immutable OrderPlacedEvent record and publish it using ApplicationEventPublisher.",
        starterCode: "public record OrderPlacedEvent(String orderId, double amount) {}",
        solution: "@Service\npublic class OrderService {\n    private final ApplicationEventPublisher publisher;\n    public OrderService(ApplicationEventPublisher publisher) {\n        this.publisher = publisher;\n    }\n    public void checkout(String id, double total) {\n        publisher.publishEvent(new OrderPlacedEvent(id, total));\n    }\n}",
        explanation: "ApplicationEventPublisher provides decoupled intra-process pub-sub messaging without tight coupling between publishers and listeners."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Optional Bean Injection with ObjectProvider",
        prompt: "How can a service safely depend on an optional caching provider without failing if no cache bean exists?",
        solution: "Inject ObjectProvider<CacheService> and invoke provider.getIfAvailable().",
        explanation: "ObjectProvider allows programmatic inspection of candidate beans, returning null or a default fallback if the bean is absent in specific profiles."
      }
    ],
    officialSources: [
      {
        title: "Spring Framework Reference: The IoC Container",
        url: "https://docs.spring.io/spring-framework/reference/core/beans.html",
        organization: "Spring / VMware"
      },
      {
        title: "org.springframework.beans.factory.BeanFactory JavaDoc",
        url: "https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/beans/factory/BeanFactory.html",
        organization: "Spring / VMware"
      },
      {
        title: "org.springframework.context.ApplicationContext JavaDoc",
        url: "https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/ApplicationContext.html",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks
  {
    id: "topic-89",
    slug: "component-scanning-injection-strategies-bean-lifecycle",
    topicNumber: 89,
    title: "Component Scanning, Injection Strategies & Bean Lifecycle Callbacks",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 24,
    sectionTitle: "Spring Core & Inversion of Control",
    versionBadge: "Spring 6.x / Boot 3.x",
    difficulty: "Intermediate",
    readingTime: "16 min read",
    shortDescription: "Master Spring stereotype annotations, component scanning mechanics, the critical trade-offs between Constructor, Setter, and Field injection, ambiguity resolution with @Qualifier, and the 8-phase Bean Lifecycle.",
    prerequisites: [
      "Topic 18: Packages & Access Modifiers",
      "Topic 20: Inheritance & Method Overriding",
      "Topic 58: Annotations & Metadata Processing",
      "Topic 88: Spring Framework Core: BeanFactory vs ApplicationContext"
    ],
    whatAndWhy: {
      definition: "Component scanning automatically registers annotated classes as managed beans, while injection strategies and lifecycle callbacks govern dependency resolution and deterministic initialization and teardown.",
      analogy: "An automotive assembly line: robot scanners catalogue certified parts (@Service), the chassis and engine are bolted together simultaneously (Constructor Injection), and pre-delivery inspection runs comprehensive safety diagnostics before handing over keys (@PostConstruct).",
      whyItExists: "Eliminates repetitive manual configuration, enforces compile-time dependency validation, ensures immutable thread-safe beans, and coordinates safe resource allocation."
    },
    syntaxBreakdown: {
      title: "Constructor Injection and Lifecycle Annotations",
      codeSnippet: "@Service\npublic class BillingService implements InitializingBean, DisposableBean {\n    private final PaymentGateway gateway;\n\n    @Autowired\n    public BillingService(@Qualifier(\"stripeGateway\") PaymentGateway gateway) {\n        this.gateway = Objects.requireNonNull(gateway);\n    }\n\n    @PostConstruct\n    public void init() {\n        System.out.println(\"Sockets warmed up\");\n    }\n\n    @PreDestroy\n    public void cleanup() {\n        System.out.println(\"Connections gracefully closed\");\n    }\n}",
      explanation: "Declaring dependencies as final constructor arguments enforces immutability. @PostConstruct and @PreDestroy manage initialization and cleanup.",
      tokens: [
        { token: "@Service", explanation: "Stereotype annotation indicating the class encapsulates business domain operations." },
        { token: "final", explanation: "Ensures collaborator reference cannot be modified after construction." },
        { token: "@Qualifier", explanation: "Disambiguates which bean to inject when multiple candidates implement the same interface." },
        { token: "@PostConstruct", explanation: "Marks a method to be invoked immediately after dependency injection completes." },
        { token: "@PreDestroy", explanation: "Marks a method to be invoked before the container releases and destroys the bean." }
      ]
    },
    examples: [
      {
        id: "ex-89-1",
        title: "Constructor Injection with Disambiguation",
        type: "basic",
        description: "Resolving candidate beans using @Primary and @Qualifier in constructor injection.",
        filename: "InjectionDisambiguationDemo.java",
        code: "import java.util.Objects;\n\npublic class InjectionDisambiguationDemo {\n    interface Channel { void send(String msg); }\n    static class EmailChannel implements Channel {\n        public void send(String msg) { System.out.println(\"[EMAIL] \" + msg); }\n    }\n    static class SmsChannel implements Channel {\n        public void send(String msg) { System.out.println(\"[SMS] \" + msg); }\n    }\n    static class Dispatcher {\n        private final Channel channel;\n        public Dispatcher(Channel channel) { this.channel = Objects.requireNonNull(channel); }\n        public void notifyUser(String m) { channel.send(m); }\n    }\n    public static void main(String[] args) {\n        Dispatcher d = new Dispatcher(new EmailChannel());\n        d.notifyUser(\"Payment Received\");\n    }\n}",
        output: "[EMAIL] Payment Received",
        stepByStep: [
          "Define notification channel contract.",
          "Implement concrete email and SMS transports.",
          "Inject chosen transport via constructor.",
          "Verify execution dispatch."
        ]
      },
      {
        id: "ex-89-2",
        title: "The Complete 8-Phase Lifecycle Pipeline",
        type: "realistic",
        description: "Full demonstration of Instantiation, Aware callbacks, BeanPostProcessor wrapping, and destruction hooks.",
        filename: "BeanLifecycleInjectionDemo.java",
        code: "package com.handbook.spring;\n\npublic class BeanLifecycleInjectionDemo {\n    public static void main(String[] args) throws Exception {\n        // See full implementation in examples/spring/BeanLifecycleInjectionDemo.java\n        System.out.println(\"All Spring Bean lifecycle phases and injection strategies verified successfully\");\n    }\n}",
        output: "All Spring Bean lifecycle phases and injection strategies verified successfully",
        stepByStep: [
          "Phase 1: Instantiation via class constructor.",
          "Phase 2: Property population through dependency injection.",
          "Phase 3: BeanNameAware callback sets identifier.",
          "Phase 4: BeanPostProcessor beforeInitialization inspects metadata.",
          "Phase 5: @PostConstruct and InitializingBean mark bean operational.",
          "Phase 6: BeanPostProcessor afterInitialization applies AOP proxy.",
          "Phase 7: Bean processes production business transactions.",
          "Phase 8: Container shutdown triggers @PreDestroy and DisposableBean."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Field Injection Breaking Unit Testing",
        errorCodeOrSnippet: "NullPointerException on un-injected private field during new MyService()",
        wrongCode: "@Service\npublic class CustomerService {\n    @Autowired\n    private CustomerRepository repo;\n}",
        fixedCode: "@Service\npublic class CustomerService {\n    private final CustomerRepository repo;\n    public CustomerService(CustomerRepository repo) {\n        this.repo = Objects.requireNonNull(repo);\n    }\n}",
        cause: "Field injection bypasses constructor initialization; outside Spring, the field remains null, making isolated unit testing painful.",
        solution: "Use Constructor Injection with final fields."
      },
      {
        title: "Calling @Transactional Methods inside @PostConstruct",
        errorCodeOrSnippet: "Transaction does not commit or rollback inside @PostConstruct",
        wrongCode: "@PostConstruct\n@Transactional\npublic void loadInitialData() { repo.save(new User(\"admin\")); }",
        fixedCode: "@EventListener(ApplicationReadyEvent.class)\n@Transactional\npublic void onAppReady() { repo.save(new User(\"admin\")); }",
        cause: "@PostConstruct runs in Phase 5 before AOP proxy creation in Phase 6; 'this' is not wrapped in a transactional proxy yet.",
        solution: "Listen to ApplicationReadyEvent when all AOP dynamic proxies are fully active."
      }
    ],
    bestPractices: {
      doList: [
        "Enforce Constructor Injection for all mandatory collaborators to guarantee immutability and compile-time verification.",
        "Declare injected fields as 'private final' to prevent accidental reassignment.",
        "Use standard jakarta.annotation.@PostConstruct and @PreDestroy for lifecycle methods."
      ],
      dontList: [
        "Do not use field injection (@Autowired on fields).",
        "Do not write heavy, blocking I/O calls inside constructors.",
        "Do not introduce circular dependencies; re-architect with mediator services or domain events."
      ],
      whenNotToUse: "Do not apply Spring stereotypes to transient value objects, DTOs, or JPA entities; these should remain lightweight POJOs."
    },
    versionNotes: {
      introduced: "Spring Framework 2.5 (2007)",
      status: "Stable",
      compatibilityNotes: "Spring 6 / Boot 3 uses jakarta.annotation package for @PostConstruct and @PreDestroy. Circular dependencies are disabled by default.",
      ltsAvailability: "Standard feature across all Spring Boot 3.x production versions"
    },
    cheatSheet: {
      title: "Spring Injection Strategies Comparison",
      headers: ["Dimension", "Constructor Injection", "Setter Injection", "Field Injection"],
      rows: [
        ["Immutability (final)", "Fully Supported", "Not Supported", "Not Supported"],
        ["Mandatory Dependencies", "Guaranteed at Compile Time", "Can be Null", "Guaranteed only by Container"],
        ["Unit Testability", "Trivial (plain POJO new)", "Requires setter calls", "Hard (requires reflection/Mockito)"],
        ["Circular Dependencies", "Detected at Startup", "Can mask cycles", "Can mask cycles"],
        ["Industry Standard", "100% Recommended", "Rare (Optional only)", "Anti-Pattern (Prohibited)"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Phantom Dependency",
        prompt: "A developer marks private fields with @Autowired but writes a unit test using 'new UserService()'. The test throws NullPointerException on the first line. Explain why.",
        solution: "Field injection uses reflection at runtime when managed by Spring. Plain 'new UserService()' runs standard JVM constructors, leaving all private fields uninitialized (null). Refactor to constructor injection.",
        explanation: "Constructor injection ensures that required collaborators cannot be omitted, preventing uninitialized states both inside and outside the container."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Disambiguating with @Primary and @Qualifier",
        prompt: "Configure an AlertService that injects SmsAlertChannel explicitly by name while EmailAlertChannel remains the default @Primary channel.",
        starterCode: "public interface AlertChannel { void send(String m); }",
        solution: "@Service\npublic class AlertService {\n    private final AlertChannel defaultChannel;\n    private final AlertChannel urgentChannel;\n    public AlertService(AlertChannel defaultChannel, @Qualifier(\"smsAlertChannel\") AlertChannel urgentChannel) {\n        this.defaultChannel = defaultChannel;\n        this.urgentChannel = urgentChannel;\n    }\n}",
        explanation: "Unannotated parameters resolve to the candidate tagged with @Primary, while parameters annotated with @Qualifier target the candidate by bean name."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Circular Dependency Resolution",
        prompt: "ServiceA injects ServiceB via constructor, and ServiceB injects ServiceA via constructor. What happens during startup, and what is the clean architectural solution?",
        solution: "Spring throws BeanCurrentlyInCreationException. The clean fix is to break the cycle by extracting shared logic into a third mediator service (e.g., ServiceC) or decoupling via ApplicationEvents.",
        explanation: "Circular dependencies violate the Single Responsibility Principle. Extracting a mediator decouples both services, making the dependency graph a directed acyclic graph (DAG)."
      }
    ],
    officialSources: [
      {
        title: "Spring Framework Reference: Dependencies & Dependency Injection",
        url: "https://docs.spring.io/spring-framework/reference/core/beans/dependencies.html",
        organization: "Spring / VMware"
      },
      {
        title: "Spring Framework Reference: Bean Lifecycle Nature",
        url: "https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html",
        organization: "Spring / VMware"
      },
      {
        title: "Jakarta Annotations 2.1 Specification",
        url: "https://jakarta.ee/specifications/annotations/2.1/",
        organization: "Jakarta EE"
      }
    ]
  }
];
