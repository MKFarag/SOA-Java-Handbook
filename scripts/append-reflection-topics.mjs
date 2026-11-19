import fs from 'fs';
import path from 'path';

const reflectionTopics = [
  {
    id: 'topic-58',
    slug: 'annotations-and-metadata',
    topicNumber: 58,
    title: 'Annotations & Metadata',
    part: 'Part 1: Java Core',
    sectionNumber: 15,
    sectionTitle: 'Reflection, Annotations & JPMS',
    versionBadge: 'Java 5+ / Enhanced Java 8 & 9',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master declarative metadata with custom annotations, meta-annotations (@Retention, @Target), and runtime reflection processing.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 23: Interfaces & Modern Interface Evolution'
    ],
    whatAndWhy: {
      definition: 'Annotations are declarative syntactic metadata attached to code elements without directly altering execution semantics, consumed by compilers, code generators, and runtime frameworks.',
      analogy: 'Shipping stickers placed on cargo boxes (FRAGILE, KEEP COLD) instructing handlers and automated belts how to process them.',
      whyItExists: 'Replaces error-prone XML files and string naming conventions with type-safe declarative metadata.'
    },
    syntaxBreakdown: {
      title: 'Annotation Declaration and Application',
      codeSnippet: `@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\npublic @interface AuditLog {\n    String action();\n    int severity() default 1;\n}`,
      explanation: 'Declares a runtime annotation applicable to methods with attributes and default values.',
      tokens: [
        { token: '@interface', explanation: 'Declares a custom annotation type' },
        { token: '@Retention', explanation: 'Specifies lifetime: SOURCE, CLASS, or RUNTIME' },
        { token: '@Target', explanation: 'Restricts valid placement: METHOD, FIELD, TYPE, etc.' }
      ]
    },
    examples: [
      {
        id: '58-1',
        title: 'Runtime Annotation Reflection Processing',
        type: 'basic',
        description: 'Defining and processing method-level runtime annotations via reflection.',
        filename: 'AnnotationProcessingDemo.java',
        code: `import java.lang.annotation.ElementType;\nimport java.lang.annotation.Retention;\nimport java.lang.annotation.RetentionPolicy;\nimport java.lang.annotation.Target;\nimport java.lang.reflect.Method;\n\npublic class AnnotationProcessingDemo {\n    @Retention(RetentionPolicy.RUNTIME)\n    @Target(ElementType.METHOD)\n    @interface AuditLog {\n        String action();\n        int severity() default 1;\n    }\n    static class BillingService {\n        @AuditLog(action = "PROCESS_CREDIT_CARD", severity = 3)\n        public void charge(String card, double amount) {\n            System.out.printf("  Executing charge: card=****%s, amount=$%.2f%n", card.substring(card.length() - 4), amount);\n        }\n        public void ping() { System.out.println("  Ping service active."); }\n    }\n    public static void main(String[] args) throws Exception {\n        System.out.println("=== Runtime Annotation Reflection Processing ===");\n        BillingService service = new BillingService();\n        Class<?> clazz = service.getClass();\n        for (Method method : clazz.getDeclaredMethods()) {\n            if (method.isAnnotationPresent(AuditLog.class)) {\n                AuditLog annotation = method.getAnnotation(AuditLog.class);\n                System.out.printf("Intercepted Annotated Method [%s]: action='%s', severity=%d%n", method.getName(), annotation.action(), annotation.severity());\n                method.invoke(service, "4111222233334444", 249.99);\n            }\n        }\n        System.out.println("Annotation processing completed successfully.");\n    }\n}`,
        output: `=== Runtime Annotation Reflection Processing ===\nIntercepted Annotated Method [charge]: action='PROCESS_CREDIT_CARD', severity=3\n  Executing charge: card=****4444, amount=$249.99\nAnnotation processing completed successfully.`,
        stepByStep: [
          'Defines custom AuditLog annotation with RUNTIME retention.',
          'Reflectively inspects declared methods on BillingService.',
          'Extracts annotation attributes and invokes the method.'
        ]
      },
      {
        id: '58-2',
        title: 'Declarative ORM Entity Validation Engine',
        type: 'realistic',
        description: 'Validating domain entity constraints using field-level annotations.',
        filename: 'OrmEntityValidatorApp.java',
        code: `import java.lang.annotation.ElementType;\nimport java.lang.annotation.Retention;\nimport java.lang.annotation.RetentionPolicy;\nimport java.lang.annotation.Target;\nimport java.lang.reflect.Field;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class OrmEntityValidatorApp {\n    @Retention(RetentionPolicy.RUNTIME)\n    @Target(ElementType.FIELD)\n    @interface NotEmpty { String message() default "Field must not be empty"; }\n\n    @Retention(RetentionPolicy.RUNTIME)\n    @Target(ElementType.FIELD)\n    @interface Range {\n        double min();\n        double max();\n        String message() default "Value out of valid range";\n    }\n\n    static class ProductEntity {\n        @NotEmpty(message = "Product SKU cannot be blank")\n        private final String sku;\n        @Range(min = 0.01, max = 10000.0, message = "Price must be between $0.01 and $10,000.00")\n        private final double price;\n        ProductEntity(String sku, double price) { this.sku = sku; this.price = price; }\n    }\n\n    static class ValidationEngine {\n        public static List<String> validate(Object entity) throws Exception {\n            List<String> violations = new ArrayList<>();\n            Class<?> clazz = entity.getClass();\n            for (Field field : clazz.getDeclaredFields()) {\n                field.setAccessible(true);\n                Object val = field.get(entity);\n                if (field.isAnnotationPresent(NotEmpty.class) && (val == null || val.toString().trim().isEmpty())) {\n                    violations.add(field.getAnnotation(NotEmpty.class).message());\n                }\n                if (field.isAnnotationPresent(Range.class) && val instanceof Number num) {\n                    Range range = field.getAnnotation(Range.class);\n                    double d = num.doubleValue();\n                    if (d < range.min() || d > range.max()) violations.add(range.message() + " (Actual: " + d + ")");\n                }\n            }\n            return violations;\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        System.out.println("Starting ORM Entity Validation Engine...");\n        ProductEntity validProduct = new ProductEntity("PROD-882", 149.50);\n        ProductEntity invalidProduct = new ProductEntity("", -12.00);\n        List<String> errors1 = ValidationEngine.validate(validProduct);\n        System.out.println("Valid Product Violations:   " + errors1.size());\n        List<String> errors2 = ValidationEngine.validate(invalidProduct);\n        System.out.println("Invalid Product Violations: " + errors2.size());\n        for (String err : errors2) System.out.println("  - Violation: " + err);\n        System.out.println("Entity validation completed successfully.");\n    }\n}`,
        output: `Starting ORM Entity Validation Engine...\nValid Product Violations:   0\nInvalid Product Violations: 2\n  - Violation: Product SKU cannot be blank\n  - Violation: Price must be between $0.01 and $10,000.00 (Actual: -12.0)\nEntity validation completed successfully.`,
        stepByStep: [
          'Inspects field annotations on product entities.',
          'Evaluates NotEmpty and Range constraints reflectively.',
          'Identifies invalid fields without manual validation method calls.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Omitting RUNTIME retention policy',
        wrongCode: '@Target(ElementType.METHOD)\npublic @interface MyHook {}',
        fixedCode: '@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\npublic @interface MyHook {}',
        cause: 'Defaults to CLASS retention, which is stripped from JVM runtime Metaspace.',
        solution: 'Explicitly specify @Retention(RetentionPolicy.RUNTIME) for reflection.'
      }
    ],
    bestPractices: {
      doList: [
        'Provide default values for optional annotation attributes.',
        'Use standard compiler annotations (@Override, @Deprecated) consistently.'
      ],
      dontList: [
        'Do not use complex objects as annotation attributes (restricted to primitives, String, Class, enum, annotations, and arrays).',
        'Do not over-annotate code to the point of unreadability.'
      ],
      whenNotToUse: 'When dynamic runtime logic can be more cleanly expressed with polymorphic strategies or lambdas.'
    },
    versionNotes: {
      introduced: 'Java 5',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added type annotations (@Target(TYPE_USE)) and @Repeatable.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'Meta-Annotations Cheat Sheet',
      headers: ['Meta-Annotation', 'Valid Values', 'Purpose'],
      rows: [
        ['@Retention', 'SOURCE, CLASS, RUNTIME', 'Defines how long metadata is kept'],
        ['@Target', 'TYPE, METHOD, FIELD, etc.', 'Restricts where annotation can be applied'],
        ['@Documented', 'Marker', 'Includes in Javadoc documentation'],
        ['@Repeatable', 'Container annotation class', 'Allows multiple occurrences on same element']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Define Table Annotation',
        prompt: 'Define a @Table runtime annotation targeting classes with a required name attribute.',
        solution: '@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.TYPE)\npublic @interface Table { String name(); }',
        explanation: 'Restricts placement to classes and interfaces with a required table name.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 Specification: java.lang.annotation',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/annotation/package-summary.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-59',
    slug: 'reflection-api-and-methodhandles',
    topicNumber: 59,
    title: 'Reflection API & MethodHandles',
    part: 'Part 1: Java Core',
    sectionNumber: 15,
    sectionTitle: 'Reflection, Annotations & JPMS',
    versionBadge: 'Java 1.1+ / MethodHandles in Java 7+',
    difficulty: 'Advanced',
    readingTime: '13 min read',
    shortDescription: 'Explore runtime introspection with java.lang.reflect, dynamic proxies, and high-performance method invocation with MethodHandles.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 23: Interfaces & Modern Interface Evolution',
      'Topic 58: Annotations & Metadata'
    ],
    whatAndWhy: {
      definition: 'Reflection inspects and manipulates classes, fields, methods, and constructors dynamically at runtime. MethodHandles provide a high-performance, strongly typed alternative optimized by the JIT compiler.',
      analogy: 'Calling building security to manually check architectural blueprints and unlock doors (Reflection) vs using a pre-authorized fast electronic keycard (MethodHandles).',
      whyItExists: 'Powers dependency injection frameworks (Spring), object mappers (Jackson), and testing frameworks (JUnit).'
    },
    syntaxBreakdown: {
      title: 'Dynamic Proxy and MethodHandle Idioms',
      codeSnippet: `MethodHandle mh = MethodHandles.lookup().findVirtual(Clz.class, "m", methodType);\nProxy.newProxyInstance(loader, new Class<?>[]{Interface.class}, handler);`,
      explanation: 'Looks up direct executable method handle and instantiates dynamic interface proxy.',
      tokens: [
        { token: 'Proxy.newProxyInstance()', explanation: 'Creates runtime synthetic proxy implementing interfaces' },
        { token: 'MethodHandles.lookup()', explanation: 'Context factory with caller access rights' },
        { token: 'invokeExact()', explanation: 'Executes method handle with strict bytecode type matching' }
      ]
    },
    examples: [
      {
        id: '59-1',
        title: 'Reflection Field Modification and MethodHandles',
        type: 'basic',
        description: 'Modifying private fields and executing private methods via MethodHandles.',
        filename: 'ReflectionMethodHandlesDemo.java',
        code: `import java.lang.invoke.MethodHandle;\nimport java.lang.invoke.MethodHandles;\nimport java.lang.invoke.MethodType;\nimport java.lang.reflect.Field;\nimport java.lang.reflect.Method;\n\npublic class ReflectionMethodHandlesDemo {\n    static class AccountSecurityToken {\n        private String secretKey = "VAULT_9941";\n        private String generateDigest(String salt) {\n            return "DIGEST[" + secretKey + ":" + salt + "]";\n        }\n    }\n    public static void main(String[] args) throws Throwable {\n        System.out.println("=== 1. Classic Reflection API ===");\n        AccountSecurityToken token = new AccountSecurityToken();\n        Class<?> clazz = token.getClass();\n        Field secretField = clazz.getDeclaredField("secretKey");\n        secretField.setAccessible(true);\n        System.out.println("Original Private Field: " + secretField.get(token));\n        secretField.set(token, "VAULT_8800_UPDATED");\n        System.out.println("Modified Private Field: " + secretField.get(token));\n\n        Method privateMethod = clazz.getDeclaredMethod("generateDigest", String.class);\n        privateMethod.setAccessible(true);\n        String reflectionResult = (String) privateMethod.invoke(token, "SALT-44");\n        System.out.println("Reflection Method Invocation: " + reflectionResult);\n\n        System.out.println("\\n=== 2. java.lang.invoke.MethodHandles (Modern JIT Invocation) ===");\n        MethodHandles.Lookup lookup = MethodHandles.lookup();\n        MethodType methodType = MethodType.methodType(String.class, String.class);\n        MethodHandle handle = lookup.findVirtual(AccountSecurityToken.class, "generateDigest", methodType);\n        String handleResult = (String) handle.invokeExact(token, "SALT-99");\n        System.out.println("MethodHandle invokeExact:    " + handleResult);\n    }\n}`,
        output: `=== 1. Classic Reflection API ===\nOriginal Private Field: VAULT_9941\nModified Private Field: VAULT_8800_UPDATED\nReflection Method Invocation: DIGEST[VAULT_8800_UPDATED:SALT-44]\n\n=== 2. java.lang.invoke.MethodHandles (Modern JIT Invocation) ===\nMethodHandle invokeExact:    DIGEST[VAULT_8800_UPDATED:SALT-99]`,
        stepByStep: [
          'Inspects and modifies private secretKey field using setAccessible(true).',
          'Invokes private method via classic Method.invoke().',
          'Uses MethodHandles.lookup() and invokeExact for high-performance invocation.'
        ]
      },
      {
        id: '59-2',
        title: 'Dynamic Proxy Telemetry and Auditing',
        type: 'realistic',
        description: 'Intercepting interface methods dynamically with Proxy.newProxyInstance().',
        filename: 'DynamicProxyLoggingApp.java',
        code: `import java.lang.reflect.InvocationHandler;\nimport java.lang.reflect.Method;\nimport java.lang.reflect.Proxy;\n\npublic class DynamicProxyLoggingApp {\n    interface PaymentGateway {\n        boolean processPayment(String account, double amount);\n        String queryStatus(String transactionId);\n    }\n    static class StripePaymentGateway implements PaymentGateway {\n        @Override\n        public boolean processPayment(String account, double amount) {\n            System.out.printf("  [Gateway Logic] Charged $%.2f to %s%n", amount, account);\n            return true;\n        }\n        @Override\n        public String queryStatus(String transactionId) { return "SETTLED"; }\n    }\n    static class LoggingInvocationHandler implements InvocationHandler {\n        private final Object target;\n        LoggingInvocationHandler(Object target) { this.target = target; }\n        @Override\n        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {\n            System.out.println("[Audit Proxy] Intercepting: " + method.getName() + "()");\n            long start = System.nanoTime();\n            Object result = method.invoke(target, args);\n            long elapsedUs = (System.nanoTime() - start) / 1000;\n            System.out.println("[Audit Proxy] Finished " + method.getName() + " in " + elapsedUs + " us. Result: " + result);\n            return result;\n        }\n    }\n    @SuppressWarnings("unchecked")\n    public static void main(String[] args) {\n        System.out.println("Starting Dynamic Proxy Telemetry App...");\n        PaymentGateway realGateway = new StripePaymentGateway();\n        PaymentGateway proxiedGateway = (PaymentGateway) Proxy.newProxyInstance(\n                PaymentGateway.class.getClassLoader(),\n                new Class<?>[] { PaymentGateway.class },\n                new LoggingInvocationHandler(realGateway)\n        );\n        boolean paid = proxiedGateway.processPayment("ACC-1004", 450.00);\n        String status = proxiedGateway.queryStatus("TXN-9901");\n        System.out.println("Main Verification -> Paid: " + paid + ", Status: " + status);\n        System.out.println("Dynamic Proxy executed successfully.");\n    }\n}`,
        output: `Starting Dynamic Proxy Telemetry App...\n[Audit Proxy] Intercepting: processPayment()\n  [Gateway Logic] Charged $450.00 to ACC-1004\n[Audit Proxy] Finished processPayment in 26670 us. Result: true\n[Audit Proxy] Intercepting: queryStatus()\n[Audit Proxy] Finished queryStatus in 1542 us. Result: SETTLED\nMain Verification -> Paid: true, Status: SETTLED\nDynamic Proxy executed successfully.`,
        stepByStep: [
          'Creates dynamic proxy implementing PaymentGateway.',
          'InvocationHandler intercepts processPayment and queryStatus.',
          'Injects timing audit metrics around real business logic transparently.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Proxying concrete classes with JDK Proxy',
        wrongCode: 'Proxy.newProxyInstance(loader, new Class<?>[]{MyService.class}, handler); // MyService is class',
        fixedCode: 'Proxy.newProxyInstance(loader, new Class<?>[]{MyInterface.class}, handler);',
        cause: 'java.lang.reflect.Proxy strictly requires interfaces; passing a class throws IllegalArgumentException.',
        solution: 'Extract an interface or use bytecode libraries like ByteBuddy for class proxying.'
      }
    ],
    bestPractices: {
      doList: [
        'Cache Method and Field reflection objects to avoid repeated lookup overhead.',
        'Prefer MethodHandles or VarHandle for high-frequency invocations.'
      ],
      dontList: [
        'Do not use reflection to break into JDK internal packages (InaccessibleObjectException in Java 17+).',
        'Do not replace simple polymorphic interface designs with dynamic reflection.'
      ],
      whenNotToUse: 'When standard compiled method calls or lambda functional interfaces satisfy requirements.'
    },
    versionNotes: {
      introduced: 'Java 1.1',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added MethodHandles. Java 9+ JPMS strongly encapsulates internals; Java 17 permanently disabled illegal reflective access.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'Reflection vs MethodHandles Cheat Sheet',
      headers: ['Feature', 'Classic Reflection', 'MethodHandles'],
      rows: [
        ['Package', 'java.lang.reflect', 'java.lang.invoke'],
        ['Invocation Performance', 'Moderate (overhead)', 'Near-native (JIT optimized)'],
        ['Security Check', 'On every call', 'Once during lookup'],
        ['Type Safety', 'Boxed Object arguments', 'Strict bytecode type verification']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Reflectively Inspect Class Name',
        prompt: 'Print the simple and canonical names of java.util.HashMap via reflection.',
        solution: 'Class<?> c = HashMap.class;\nSystem.out.println(c.getSimpleName() + " / " + c.getCanonicalName());',
        explanation: 'Retrieves metadata about loaded class structure.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 Specification: java.lang.reflect',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/reflect/package-summary.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-60',
    slug: 'java-platform-module-system-jpms',
    topicNumber: 60,
    title: 'Java Platform Module System (JPMS)',
    part: 'Part 1: Java Core',
    sectionNumber: 15,
    sectionTitle: 'Reflection, Annotations & JPMS',
    versionBadge: 'Java 9+ Standard / Strong Encapsulation Java 17 LTS',
    difficulty: 'Advanced',
    readingTime: '13 min read',
    shortDescription: 'Master the Java Module System: module-info.java, exports, requires, opens, strong encapsulation, and custom runtime images with jlink.',
    prerequisites: [
      'Topic 18: Packages and Access Modifiers',
      'Topic 57: ClassLoaders & JIT Compilation',
      'Topic 59: Reflection API & MethodHandles'
    ],
    whatAndWhy: {
      definition: 'JPMS introduces modular boundaries above packages, enforcing reliable configuration through declared dependencies and strong encapsulation that conceals internal packages even from reflection.',
      analogy: 'Standard shipping cargo containers with strict manifests on the door stating exact power requirements and locked doors hiding internal mechanics.',
      whyItExists: 'Eliminates Classpath Hell, prevents access to JDK internals (sun.misc.Unsafe), and enables building slim custom JREs via jlink.'
    },
    syntaxBreakdown: {
      title: 'The module-info.java Descriptor',
      codeSnippet: `module com.example.app {\n    requires java.sql;\n    exports com.example.app.api;\n    opens com.example.app.entity to org.hibernate.orm.core;\n}`,
      explanation: 'Declares module dependencies, public API package exports, and deep reflection openings.',
      tokens: [
        { token: 'requires', explanation: 'Declares dependency on external module' },
        { token: 'exports', explanation: 'Makes public classes in package visible to other modules' },
        { token: 'opens', explanation: 'Permits runtime reflection on private members' },
        { token: 'uses / provides', explanation: 'Registers and discovers ServiceLoader SPI plugins' }
      ]
    },
    examples: [
      {
        id: '60-1',
        title: 'Programmatic Module Descriptor Inspection',
        type: 'basic',
        description: 'Inspecting module names, exports, and opens status programmatically.',
        filename: 'ModuleDescriptorDemo.java',
        code: `import java.lang.module.ModuleDescriptor;\nimport java.util.Set;\n\npublic class ModuleDescriptorDemo {\n    public static void main(String[] args) {\n        System.out.println("=== JPMS Module Descriptor Inspection ===");\n        Module baseModule = String.class.getModule();\n        System.out.println("Current Module Name: " + baseModule.getName());\n        System.out.println("Is Named Module:     " + baseModule.isNamed());\n\n        ModuleDescriptor descriptor = baseModule.getDescriptor();\n        if (descriptor != null) {\n            System.out.println("Descriptor Version:  " + descriptor.version().orElse(null));\n            System.out.println("Total Exports:       " + descriptor.exports().size() + " packages");\n            System.out.println("IsOpen (Deep Refl):  " + descriptor.isOpen());\n            boolean exportsJavaUtil = baseModule.isExported("java.util");\n            System.out.println("Exports 'java.util': " + exportsJavaUtil);\n        }\n\n        Module appModule = ModuleDescriptorDemo.class.getModule();\n        System.out.println("\\nApplication Class Module Name: '" + appModule.getName() + "' (null = Unnamed Module)");\n        System.out.println("Is Named Module: " + appModule.isNamed());\n    }\n}`,
        output: `=== JPMS Module Descriptor Inspection ===\nCurrent Module Name: java.base\nIs Named Module:     true\nDescriptor Version:  26.0.1\nTotal Exports:       116 packages\nIsOpen (Deep Refl):  false\nExports 'java.util': true\n\nApplication Class Module Name: 'null' (null = Unnamed Module)\nIs Named Module: false`,
        stepByStep: [
          'Inspects java.base module descriptor and verified exports.',
          'Checks package export status of java.util.',
          'Observes that standard classpath classes reside in the Unnamed Module.'
        ]
      },
      {
        id: '60-2',
        title: 'Modular Service Discovery (SPI)',
        type: 'realistic',
        description: 'Decoupled service provider interface plugin discovery with ServiceLoader.',
        filename: 'ModularServicePluginApp.java',
        code: `import java.util.ArrayList;\nimport java.util.List;\nimport java.util.ServiceLoader;\n\npublic class ModularServicePluginApp {\n    public interface PaymentCodec {\n        String format();\n        String encode(String payload);\n    }\n    public static class JsonPaymentCodec implements PaymentCodec {\n        @Override\n        public String format() { return "JSON"; }\n        @Override\n        public String encode(String payload) { return "{\\"data\\": \\"" + payload + "\\"}"; }\n    }\n    public static class XmlPaymentCodec implements PaymentCodec {\n        @Override\n        public String format() { return "XML"; }\n        @Override\n        public String encode(String payload) { return "<data>" + payload + "</data>"; }\n    }\n    public static void main(String[] args) {\n        System.out.println("Starting Modular Service Discovery App...");\n        List<PaymentCodec> registeredCodecs = List.of(new JsonPaymentCodec(), new XmlPaymentCodec());\n        System.out.println("Discovered Codec Plugins: " + registeredCodecs.size());\n        for (PaymentCodec codec : registeredCodecs) {\n            String encoded = codec.encode("TXN-3001");\n            System.out.printf("  Codec [%s] output: %s%n", codec.format(), encoded);\n        }\n        ServiceLoader<PaymentCodec> loader = ServiceLoader.load(PaymentCodec.class);\n        System.out.println("ServiceLoader instantiated: " + loader.getClass().getSimpleName());\n        System.out.println("Modular Service Plugin App completed successfully.");\n    }\n}`,
        output: `Starting Modular Service Discovery App...\nDiscovered Codec Plugins: 2\n  Codec [JSON] output: {"data": "TXN-3001"}\n  Codec [XML] output: <data>TXN-3001</data>\nServiceLoader instantiated: ServiceLoader\nModular Service Plugin App completed successfully.`,
        stepByStep: [
          'Defines decoupled service interface PaymentCodec.',
          'Registers JSON and XML provider codecs.',
          'Leverages ServiceLoader for extensible modular plugin dispatch.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Split packages between modules',
        wrongCode: '// module A and module B both defining com.company.util package',
        fixedCode: '// module A has com.company.util.a; module B has com.company.util.b',
        cause: 'JPMS strictly forbids two modules from exporting or containing the same package name.',
        solution: 'Enforce unique package namespaces for each module.'
      }
    ],
    bestPractices: {
      doList: [
        'Use jlink to generate lean, customized runtime distributions for Docker containers.',
        'Keep exported packages minimal, exposing only public contract interfaces.'
      ],
      dontList: [
        'Do not use open module unless required by legacy reflection frameworks.',
        'Do not export internal implementation packages.'
      ],
      whenNotToUse: 'For simple single-JAR command-line scripts where modular overhead adds unnecessary ceremony.'
    },
    versionNotes: {
      introduced: 'Java 9 (Project Jigsaw)',
      status: 'Stable',
      compatibilityNotes: 'Java 17 LTS permanently enforced strong encapsulation (JEP 403).',
      ltsAvailability: 'Java 11, 17, 21'
    },
    cheatSheet: {
      title: 'JPMS Module Directives Cheat Sheet',
      headers: ['Directive', 'Target', 'Effect', 'Reflection Access'],
      rows: [
        ['requires M', 'Module', 'Establishes dependency', 'Public members only'],
        ['requires transitive M', 'Module', 'Transfers dependency downstream', 'Public members only'],
        ['exports P', 'Package', 'Exports public types', 'Public members only'],
        ['opens P to M', 'Package to Module', 'Opens package to deep reflection', 'Full (including private)']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Check If Class Is in Named Module',
        prompt: 'Check whether String.class is in a named module.',
        solution: 'boolean named = String.class.getModule().isNamed(); // true (java.base)',
        explanation: 'Core Java classes reside in named module java.base.'
      }
    ],
    officialSources: [
      {
        title: 'The Java Platform Module System Specification (JSR 376)',
        url: 'https://openjdk.org/projects/jigsaw/spec/',
        organization: 'OpenJDK'
      }
    ]
  }
];

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

const targetMarker = '  {\n    id: \'topic-66\',';
if (!content.includes(targetMarker)) {
  console.error('Target marker not found in topics.ts!');
  process.exit(1);
}

const formattedTopics = reflectionTopics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(',\n\n');

const replacement = formattedTopics + ',\n\n' + targetMarker;
content = content.replace(targetMarker, replacement);

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log('Successfully appended topics 58-60 into src/data/topics.ts!');
