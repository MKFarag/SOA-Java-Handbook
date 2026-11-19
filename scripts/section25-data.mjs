export const section25Topics = [
  // Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes
  {
    id: "topic-90",
    slug: "auto-configuration-mechanics-starters-embedded-runtimes",
    topicNumber: 90,
    title: "Auto-Configuration Mechanics, Starters & Embedded Runtimes",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 25,
    sectionTitle: "Spring Boot Architecture & Configuration",
    versionBadge: "Spring Boot 3.x / Java 21+",
    difficulty: "Intermediate",
    readingTime: "16 min read",
    shortDescription: "Deconstruct Spring Boot's opinionated architecture: condition evaluation algorithms, starter dependencies, AutoConfiguration.imports, and embedded web runtimes.",
    prerequisites: [
      "Topic 65: Apache Tomcat & The WAR Structure",
      "Topic 88: Spring Framework Core: BeanFactory vs ApplicationContext",
      "Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks"
    ],
    whatAndWhy: {
      definition: "Spring Boot introduces opinionated defaults via curated starters, condition-driven auto-configuration that activates based on classpath and properties, and embedded servlet containers packaged inside executable JARs.",
      analogy: "A modern smartphone: out of the box, it detects your SIM card (@ConditionalOnClass), configures cellular APN settings automatically (Auto-Configuration), preloads a dialer (@ConditionalOnMissingBean), and turns on the cellular antenna (Embedded Tomcat).",
      whyItExists: "Eliminates hundreds of lines of boilerplate XML/Java configuration, prevents dependency version mismatch bugs, and standardizes containerized microservice deployments."
    },
    syntaxBreakdown: {
      title: "Auto-Configuration Class and Conditional Annotations",
      codeSnippet: "@AutoConfiguration\n@ConditionalOnClass(name = \"com.zaxxer.hikari.HikariDataSource\")\n@ConditionalOnProperty(name = \"spring.datasource.enabled\", havingValue = \"true\", matchIfMissing = true)\npublic class DataSourceAutoConfiguration {\n\n    @Bean\n    @ConditionalOnMissingBean(DataSource.class)\n    public DataSource defaultDataSource() {\n        return new HikariDataSource();\n    }\n}",
      explanation: "@AutoConfiguration marks a class discovered via AutoConfiguration.imports. Conditions verify classpath presence, property values, and ensure user beans take precedence.",
      tokens: [
        { token: "@AutoConfiguration", explanation: "Designates a top-level auto-configuration candidate executed after user configuration classes." },
        { token: "@ConditionalOnClass", explanation: "Condition that checks if specified class types exist on the current JVM classpath." },
        { token: "@ConditionalOnProperty", explanation: "Condition that tests environment property keys and expected string values." },
        { token: "@ConditionalOnMissingBean", explanation: "The core back-off annotation ensuring auto-configuration yields when a user declares a custom bean." }
      ]
    },
    examples: [
      {
        id: "ex-90-1",
        title: "Disabling Unneeded Auto-Configurations",
        type: "basic",
        description: "Excluding database auto-configuration for a stateless proxy or microservice gateway.",
        filename: "StatelessGatewayApp.java",
        code: "import org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;\n\n@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})\npublic class StatelessGatewayApp {\n    public static void main(String[] args) {\n        System.out.println(\"Booting stateless gateway without database overhead\");\n    }\n}",
        output: "Booting stateless gateway without database overhead",
        stepByStep: [
          "Annotate application with @SpringBootApplication.",
          "Pass unwanted auto-configuration classes to the exclude attribute.",
          "Verify the context starts without database driver dependencies."
        ]
      },
      {
        id: "ex-90-2",
        title: "Auto-Configuration Condition Engine & Embedded Server",
        type: "realistic",
        description: "Full demonstration of condition evaluation, automatic back-off, and embedded Tomcat server lifecycle.",
        filename: "AutoConfigurationEmbeddedDemo.java",
        code: "package com.handbook.spring;\n\npublic class AutoConfigurationEmbeddedDemo {\n    public static void main(String[] args) throws Exception {\n        // See full implementation in examples/spring/AutoConfigurationEmbeddedDemo.java\n        System.out.println(\"Spring Boot Auto-Configuration & Embedded Runtime mechanics verified successfully\");\n    }\n}",
        output: "Spring Boot Auto-Configuration & Embedded Runtime mechanics verified successfully",
        stepByStep: [
          "Define candidate auto-configuration with @ConditionalOnMissingBean.",
          "Simulate default auto-configuration without user beans: default HikariCP and Tomcat created.",
          "Simulate user overriding DataSource: auto-configuration gracefully backs off.",
          "Verify embedded server start and stop transitions."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Using Legacy spring.factories in Spring Boot 3.x",
        errorCodeOrSnippet: "Custom auto-configuration classes in META-INF/spring.factories are completely ignored",
        wrongCode: "# META-INF/spring.factories\norg.springframework.boot.autoconfigure.EnableAutoConfiguration=com.my.AutoConfig",
        fixedCode: "# META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports\ncom.my.AutoConfig",
        cause: "Spring Boot 3.0 permanently removed support for finding auto-configurations via spring.factories.",
        solution: "Declare auto-configuration classes in the new AutoConfiguration.imports file."
      },
      {
        title: "Placing Auto-Configuration in @ComponentScan Target Packages",
        errorCodeOrSnippet: "BeanDefinitionOverrideException: Invalid bean definition with name 'myBean'",
        wrongCode: "package com.app;\n@Component // Auto-configuration placed in main application scan path\npublic class MyAutoConfig {}",
        fixedCode: "package com.app.autoconfigure;\n// Excluded from application @ComponentScan; loaded via imports file\n@AutoConfiguration\npublic class MyAutoConfig {}",
        cause: "Application @ComponentScan eagerly registers the class as a standard component before condition evaluation runs.",
        solution: "Keep auto-configuration classes in dedicated packages outside the application base package."
      }
    ],
    bestPractices: {
      doList: [
        "Always guard auto-configured @Bean methods with @ConditionalOnMissingBean so consumers can override them.",
        "Use spring-boot-starter dependencies rather than specifying individual transitive library versions.",
        "Use @AutoConfiguration instead of @Configuration for all auto-configuration classes in Spring Boot 3.x."
      ],
      dontList: [
        "Do not place auto-configuration classes in packages scanned by user @ComponentScan.",
        "Do not write custom auto-configurations when a simple @Configuration in user code suffices.",
        "Do not hardcode port numbers inside application code; use externalized server.port configuration."
      ],
      whenNotToUse: "Do not use auto-configuration for internal domain logic specific to one application; auto-configuration is designed for cross-cutting, reusable platform libraries."
    },
    versionNotes: {
      introduced: "Spring Boot 1.0 (2014)",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3.x requires Java 17/21/26 LTS, enforces Jakarta EE 10/11, and uses AutoConfiguration.imports exclusively.",
      ltsAvailability: "Supported across all Spring Boot 3.x production releases"
    },
    cheatSheet: {
      title: "Spring Boot Conditional Annotations Reference",
      headers: ["Annotation", "Condition Checked", "Default Behavior"],
      rows: [
        ["@ConditionalOnClass", "Presence of class on JVM classpath", "Fails if class is absent"],
        ["@ConditionalOnMissingBean", "Absence of bean in ApplicationContext", "Backs off if bean exists"],
        ["@ConditionalOnProperty", "Property value match in environment", "Checks name and havingValue"],
        ["@ConditionalOnWebApplication", "Servlet or Reactive web environment", "Matches only in web applications"],
        ["@ConditionalOnExpression", "SpEL expression evaluates to true", "Dynamic programmatic condition"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Un-overridable Default Bean",
        prompt: "An internal library defines a default Jackson ObjectMapper bean using @Bean inside @AutoConfiguration, but applications cannot override it. Why?",
        solution: "The @Bean method is missing @ConditionalOnMissingBean(ObjectMapper.class). Adding this annotation instructs Spring Boot to skip the default bean if the application defines one.",
        explanation: "@ConditionalOnMissingBean is the essential contract for auto-configuration back-off."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Conditional Metrics Exporter",
        prompt: "Create an auto-configuration that registers CloudWatchExporter only if property 'management.cloudwatch.enabled' is 'true'.",
        starterCode: "@AutoConfiguration\npublic class CloudWatchAutoConfig {}",
        solution: "@AutoConfiguration\n@ConditionalOnProperty(name = \"management.cloudwatch.enabled\", havingValue = \"true\")\npublic class CloudWatchAutoConfig {\n    @Bean\n    @ConditionalOnMissingBean\n    public CloudWatchExporter cloudWatchExporter() {\n        return new CloudWatchExporter();\n    }\n}",
        explanation: "Combining @ConditionalOnProperty with @ConditionalOnMissingBean ensures the bean activates only when requested and allows user overrides."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Switching from Embedded Tomcat to Undertow",
        prompt: "How do you switch a Spring Boot Web MVC application from embedded Tomcat to embedded Undertow in Maven?",
        solution: "Exclude spring-boot-starter-tomcat from spring-boot-starter-web, and add spring-boot-starter-undertow.",
        explanation: "Spring Boot's auto-configuration checks for Tomcat on the classpath; when absent and Undertow is detected, it auto-configures UndertowServletWebServerFactory instead."
      }
    ],
    officialSources: [
      {
        title: "Spring Boot Reference: Auto-Configuration",
        url: "https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration",
        organization: "Spring / VMware"
      },
      {
        title: "Spring Boot Reference: Embedded Web Servers",
        url: "https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.servlet.embedded-container",
        organization: "Spring / VMware"
      },
      {
        title: "org.springframework.boot.autoconfigure.AutoConfiguration JavaDoc",
        url: "https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/AutoConfiguration.html",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 91: Externalized Configuration, YAML Hierarchies & Multi-Profile Deployment
  {
    id: "topic-91",
    slug: "externalized-configuration-yaml-hierarchies-multi-profile",
    topicNumber: 91,
    title: "Externalized Configuration, YAML Hierarchies & Multi-Profile Deployment",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 25,
    sectionTitle: "Spring Boot Architecture & Configuration",
    versionBadge: "Spring Boot 3.x / Java 21+",
    difficulty: "Intermediate",
    readingTime: "16 min read",
    shortDescription: "Master Spring Boot externalized configuration architectures, the 17-level property precedence hierarchy, type-safe @ConfigurationProperties with immutable records, and multi-profile deployment.",
    prerequisites: [
      "Topic 26: Records (Java 16+)",
      "Topic 86: Jakarta Bean Validation",
      "Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes"
    ],
    whatAndWhy: {
      definition: "Externalized configuration separates application logic from deployment parameters according to Twelve-Factor principles, binding multi-source properties into type-safe, validated Java objects.",
      analogy: "A universal travel power adapter: the base unit works everywhere, profile faceplates adapt to regional sockets (UK, US, EU), and an internal voltage regulator automatically overrides settings based on the wall circuit.",
      whyItExists: "Enables identical compiled binaries to deploy across development, staging, and production Kubernetes clusters simply by varying configuration sources."
    },
    syntaxBreakdown: {
      title: "Immutable @ConfigurationProperties Record with Validation",
      codeSnippet: "@Validated\n@ConfigurationProperties(prefix = \"app.payment\")\npublic record PaymentProperties(\n    @NotBlank String apiEndpoint,\n    @Min(1) @Max(10) int maxRetries,\n    @NotNull Duration timeout,\n    boolean sandboxMode\n) {}",
      explanation: "Java Records provide immutable configuration containers. @Validated enforces Jakarta Bean Validation constraints during container bootstrap.",
      tokens: [
        { token: "@ConfigurationProperties", explanation: "Binds external properties sharing a common prefix into structured Java fields." },
        { token: "@Validated", explanation: "Triggers JSR-380 validation during property binding, failing startup if invalid." },
        { token: "Duration", explanation: "Spring Boot natively coerces strings like '10s', '500ms', or '2m' into java.time.Duration." },
        { token: "Relaxed Binding", explanation: "Automatically maps kebab-case, camelCase, and UPPER_SNAKE_CASE into the target property." }
      ]
    },
    examples: [
      {
        id: "ex-91-1",
        title: "Relaxed Binding Demonstration",
        type: "basic",
        description: "How Spring Boot maps diverse naming conventions into standard Java record fields.",
        filename: "RelaxedBindingDemo.java",
        code: "public class RelaxedBindingDemo {\n    public static void main(String[] args) {\n        // app.payment.max-retries (YAML)\n        // APP_PAYMENT_MAX_RETRIES (Env)\n        // app.payment.maxRetries  (Properties)\n        System.out.println(\"Relaxed binding maps all three conventions to 'maxRetries'\");\n    }\n}",
        output: "Relaxed binding maps all three conventions to 'maxRetries'",
        stepByStep: [
          "Define field in camelCase.",
          "Supply external property in kebab-case or UPPER_SNAKE_CASE.",
          "Spring Boot resolves and binds without configuration."
        ]
      },
      {
        id: "ex-91-2",
        title: "Multi-Profile Environment Precedence",
        type: "realistic",
        description: "Full demonstration of default YAML, profile YAML overrides, and command-line argument priority.",
        filename: "ExternalizedConfigurationProfilesDemo.java",
        code: "package com.handbook.spring;\n\npublic class ExternalizedConfigurationProfilesDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/ExternalizedConfigurationProfilesDemo.java\n        System.out.println(\"Externalized configuration hierarchy, multi-profile overrides, and validation verified successfully\");\n    }\n}",
        output: "Externalized configuration hierarchy, multi-profile overrides, and validation verified successfully",
        stepByStep: [
          "Load baseline application.yml configuration.",
          "Apply active profile overrides (application-prod.yml).",
          "Override properties via command-line arguments (highest priority).",
          "Validate bound properties with non-null and range assertions."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Omitting @Validated Resulting in Silent Invalid Config",
        errorCodeOrSnippet: "maxRetries configured as -10 boots silently without error",
        wrongCode: "@ConfigurationProperties(prefix = \"app.payment\")\npublic record PaymentProperties(@Min(1) int maxRetries) {}",
        fixedCode: "@Validated\n@ConfigurationProperties(prefix = \"app.payment\")\npublic record PaymentProperties(@Min(1) int maxRetries) {}",
        cause: "Validation annotations like @Min are ignored on configuration properties unless @Validated is present.",
        solution: "Always annotate configuration properties classes and records with @Validated."
      },
      {
        title: "Invalid Dot Notation in Linux Environment Variables",
        errorCodeOrSnippet: "export app.payment.merchant-id=ACME fails with syntax error in bash",
        wrongCode: "export app.payment.merchant-id=ACME",
        fixedCode: "export APP_PAYMENT_MERCHANT_ID=ACME",
        cause: "POSIX shells forbid dots and dashes in environment variable names.",
        solution: "Use uppercase snake case: replace dots and dashes with underscores."
      }
    ],
    bestPractices: {
      doList: [
        "Use @ConfigurationProperties with immutable Java Records for all structured application configurations.",
        "Always annotate configuration records with @Validated and appropriate Bean Validation constraints.",
        "Store safe defaults in application.yml; override sensitive values via environment variables."
      ],
      dontList: [
        "Do not use @Value for groups of related properties.",
        "Do not hardcode environment-specific URLs or credentials in source code or default configuration files.",
        "Do not commit production secrets or private keys to version control."
      ],
      whenNotToUse: "Do not use @ConfigurationProperties for single standalone system properties (like logging levels), where standard Spring Boot properties suffice."
    },
    versionNotes: {
      introduced: "Spring Boot 1.0 (2014)",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3.x fully supports Java Records for @ConfigurationProperties without @ConstructorBinding, and uses Jakarta Validation 3.0.",
      ltsAvailability: "Standard production feature across all modern Spring Boot releases"
    },
    cheatSheet: {
      title: "Spring Boot Property Precedence Reference",
      headers: ["Priority", "Configuration Source", "Example"],
      rows: [
        ["1 (Highest)", "Command-line arguments", "--server.port=9090"],
        ["2", "JVM System Properties", "-Dserver.port=8080"],
        ["3", "OS Environment Variables", "SERVER_PORT=8000"],
        ["4", "Profile Application Config (external)", "/config/application-prod.yml"],
        ["5", "Profile Application Config (packaged)", "classpath:application-prod.yml"],
        ["6 (Lowest)", "Default Application Config (packaged)", "classpath:application.yml"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Silent Configuration Flaw",
        prompt: "A developer writes @Min(5) on an integer property in a @ConfigurationProperties record, but the application boots happily with value 0. Why?",
        solution: "The record is missing @Validated. Spring Boot will not trigger Bean Validation on configuration classes unless @Validated is explicitly declared.",
        explanation: "@Validated registers the Spring validator interceptor during the property binding phase."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Immutable Connection Pool Properties",
        prompt: "Write a complete @ConfigurationProperties record for database connection pooling with minimum 5 and maximum 50 connections.",
        starterCode: "@ConfigurationProperties(prefix = \"app.pool\")\npublic record PoolProperties(...) {}",
        solution: "@Validated\n@ConfigurationProperties(prefix = \"app.pool\")\npublic record PoolProperties(\n    @Min(5) int minIdle,\n    @Max(50) int maxTotal,\n    @NotNull Duration idleTimeout\n) {}",
        explanation: "Record fields with validation annotations guarantee valid state when injected into services."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Docker Environment Variable Relaxed Binding",
        prompt: "How does property 'spring.datasource.hikari.maximum-pool-size' map to an environment variable in a Docker container?",
        solution: "SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE or SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE.",
        explanation: "Spring Boot converts dot-separated kebab-case keys into uppercase snake-case for POSIX environment variable compliance."
      }
    ],
    officialSources: [
      {
        title: "Spring Boot Reference: Externalized Configuration",
        url: "https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config",
        organization: "Spring / VMware"
      },
      {
        title: "Spring Boot Reference: Type-safe Configuration Properties",
        url: "https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.typesafe-configuration-properties",
        organization: "Spring / VMware"
      },
      {
        title: "Jakarta Bean Validation Specification",
        url: "https://jakarta.ee/specifications/bean-validation/",
        organization: "Jakarta EE"
      }
    ]
  }
];
