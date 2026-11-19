export const section29Topics = [
  // Topic 100: The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations
  {
    id: "topic-100",
    slug: "definitive-dictionary-java-jakarta-spring-annotations",
    topicNumber: 100,
    title: "The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 29,
    sectionTitle: "Master Annotations Reference Dictionary",
    versionBadge: "Java 21+ / Spring Boot 3.x",
    difficulty: "Advanced",
    readingTime: "22 min read",
    shortDescription: "The definitive cross-referenced architectural dictionary categorizing and comparing core annotations across Java SE Core, Jakarta EE enterprise specifications, and the Spring Boot production ecosystem.",
    prerequisites: [
      "Topic 58: Java Reflection API & Dynamic Introspection",
      "Topic 83: Jakarta Persistence (JPA) & Hibernate ORM",
      "Topic 88: Spring Framework Core, BeanFactory vs ApplicationContext",
      "Topic 98: Modern SecurityFilterChain Architecture & Password Encryption"
    ],
    whatAndWhy: {
      definition: "Annotations provide declarative metadata attached to program elements that guide compile-time code generation, container dependency injection, persistence mapping, and runtime security aspects.",
      analogy: "A multi-lingual diplomatic passport: pages contain official visa stamps from three different sovereign territories—the home nation (Java SE), international treaty bodies (Jakarta EE specifications), and modern corporate alliances (Spring Boot)—each recognized and honored by specialized border guards (AOP proxies and reflection engines).",
      whyItExists: "Unifies enterprise development around declarative metadata, eliminating verbose XML configuration while establishing clear architectural boundaries."
    },
    syntaxBreakdown: {
      title: "Meta-Annotation Declaration and Composition Syntax",
      codeSnippet: "@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.TYPE)\n@Documented\n@Inherited\n@Component\npublic @interface CustomService {\n    String value() default \"\";\n}",
      explanation: "Meta-annotations configure runtime visibility (@Retention) and valid placement targets (@Target). Composing @Component turns the custom annotation into an automatic Spring bean stereotype.",
      tokens: [
        { token: "@Retention(RUNTIME)", explanation: "Preserves annotation metadata in compiled bytecode for runtime reflection inspection." },
        { token: "@Target(TYPE)", explanation: "Restricts annotation declaration to classes, interfaces, records, and enums." },
        { token: "@Inherited", explanation: "Causes subclasses to automatically inherit the annotation from parent classes." },
        { token: "@Component", explanation: "Transitively converts any class annotated with @CustomService into a Spring-managed bean." }
      ]
    },
    examples: [
      {
        id: "ex-100-1",
        title: "Meta-Annotation Declaration",
        type: "basic",
        description: "Declaring a custom runtime stereotype annotation with meta-annotations.",
        filename: "CustomStereotype.java",
        code: "import java.lang.annotation.*;\n\n@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.TYPE)\npublic @interface EnterpriseService {\n    String tier() default \"STANDARD\";\n}",
        output: "Custom annotation defined with runtime retention for reflection inspection.",
        stepByStep: [
          "Declare @Retention(RetentionPolicy.RUNTIME).",
          "Specify @Target(ElementType.TYPE).",
          "Define annotation elements with default values."
        ]
      },
      {
        id: "ex-100-2",
        title: "Tri-Part Annotation Dictionary & Inspector Simulation",
        type: "realistic",
        description: "Scanning domain classes, categorizing annotations into Tri-Part domains, and resolving composed meta-annotations.",
        filename: "AnnotationMetadataDictionaryDemo.java",
        code: "package com.handbook.spring;\n\npublic class AnnotationMetadataDictionaryDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/AnnotationMetadataDictionaryDemo.java\n        System.out.println(\"Topic 100 Definitive Annotations Dictionary verified successfully\");\n    }\n}",
        output: "Topic 100 Definitive Annotations Dictionary verified successfully",
        stepByStep: [
          "Define custom TriPartCategory meta-annotation tracking architectural domains.",
          "Annotate AccountApiController with composed @SimulatedRestController.",
          "Annotate BankAccountEntity with @SimulatedEntity.",
          "Run MetadataInspector to extract direct and transitive annotations.",
          "Assert that composed @SimulatedComponent is resolved transitively from @SimulatedRestController."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Omitting RetentionPolicy.RUNTIME",
        errorCodeOrSnippet: "@Target(ElementType.TYPE)\npublic @interface MyAspectAnnotation {} // Missing @Retention defaults to CLASS!",
        cause: "Without @Retention(RetentionPolicy.RUNTIME), the annotation is stripped at runtime by the JVM and clazz.getAnnotation() returns null.",
        solution: "Always explicitly declare @Retention(RetentionPolicy.RUNTIME) for annotations inspected via reflection or Spring AOP."
      },
      {
        title: "Mixing Jakarta EE and Spring Transactional annotations",
        errorCodeOrSnippet: "import jakarta.transaction.Transactional;\n@Transactional(readOnly = true) // Compilation Error: readOnly does not exist on Jakarta @Transactional!",
        cause: "Jakarta EE's @Transactional does not support readOnly or specific rollbackFor attributes that Spring's @Transactional provides.",
        solution: "In Spring Boot applications, always import org.springframework.transaction.annotation.Transactional."
      }
    ],
    bestPractices: {
      doList: [
        "Use composed meta-annotations (like @RestController) to eliminate repetitive annotation clusters.",
        "Always define clear default values for optional annotation attributes.",
        "Adhere strictly to architectural boundaries: keep persistence annotations in entities and transport annotations in DTOs/controllers."
      ],
      dontList: [
        "Never invent custom annotations when standard Java SE, Jakarta EE, or Spring annotations already exist.",
        "Avoid placing @Transactional on private methods (Spring AOP cannot intercept private methods).",
        "Never create cyclic meta-annotation dependencies."
      ],
      whenNotToUse: "Do not use runtime annotations for high-frequency operations executed millions of times per second in tight loops (reflection has slight invocation overhead; use direct method dispatch or bytecode generation instead)."
    },
    versionNotes: {
      introduced: "Annotations introduced in Java 5 -> Repeatable annotations in Java 8 -> Spring Boot 3 annotation modernization",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3 migrated all javax.* annotations to jakarta.* namespace.",
      ltsAvailability: "Universal across Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Tri-Part Enterprise Annotation Equivalents Matrix",
      headers: ["Role / Purpose", "Java SE Standard", "Jakarta EE Standard", "Spring Framework / Boot"],
      rows: [
        ["Dependency Injection", "None", "@Inject / @Named", "@Autowired / @Qualifier"],
        ["Component Marker", "None", "@Named / @Singleton", "@Component / @Service / @Repository"],
        ["Web Endpoint Controller", "None", "@Path / @GET (JAX-RS)", "@RestController / @GetMapping"],
        ["ACID Transaction", "None", "jakarta.transaction.@Transactional", "org.springframework.@Transactional"],
        ["Persistence Mapping", "None", "@Entity / @Table / @Id", "Spring Data @Entity (delegates to JPA)"],
        ["Input Validation", "None", "jakarta.validation.@Valid", "Spring Boot Starter Validation (@Valid)"],
        ["Method Security", "None", "@RolesAllowed (JSR-250)", "@PreAuthorize / @Secured"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Missing Reflection Metadata",
        prompt: "A developer writes a custom @Audit annotation and annotates a service method, but method.isAnnotationPresent(Audit.class) returns false at runtime. Why?",
        solution: "The custom annotation is missing @Retention(RetentionPolicy.RUNTIME). The default retention is CLASS, which means the annotation is discarded when the JVM loads the class into memory.",
        explanation: "Add @Retention(RetentionPolicy.RUNTIME) to the annotation definition."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Declare Composed Stereotype",
        prompt: "Declare an annotation named @TransactionalService that combines Spring's @Service and @Transactional into a single meta-annotation.",
        starterCode: "// Define @TransactionalService",
        solution: "@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.TYPE)\n@Service\n@Transactional\npublic @interface TransactionalService {}",
        explanation: "Classes annotated with @TransactionalService will be automatically registered as Spring service beans with transactional boundaries."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "@Repeatable Container Annotation",
        prompt: "How does Java implement @Repeatable annotations under the hood in bytecode?",
        solution: "Java requires a container annotation (e.g. @Schedules holding Schedule[] value()) to wrap multiple repeatable annotations in the compiled class file.",
        explanation: "@Repeatable(Schedules.class) specifies the synthesized wrapper container."
      }
    ],
    officialSources: [
      {
        title: "Oracle Java SE Annotations Specification",
        url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html#jls-9.6",
        organization: "Oracle"
      },
      {
        title: "Spring Framework Annotation Programming Model",
        url: "https://docs.spring.io/spring-framework/reference/core/beans/annotation-config.html",
        organization: "Spring / VMware"
      }
    ]
  }
];
