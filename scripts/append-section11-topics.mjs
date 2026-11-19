import fs from 'node:fs';
import path from 'node:path';

const TOPICS_PATH = path.resolve('src/data/topics.ts');
let content = fs.readFileSync(TOPICS_PATH, 'utf-8');

if (content.includes("id: 'topic-40'")) {
  console.log('Topic 40 already exists in topics.ts.');
  process.exit(0);
}

const section11Topics = `
  // Topic 40: Lambdas & Functional Interfaces
  {
    id: 'topic-40',
    slug: 'lambdas-and-functional-interfaces',
    topicNumber: 40,
    title: 'Lambdas & Functional Interfaces',
    part: 'Part 1: Java Core',
    sectionNumber: 11,
    sectionTitle: 'Functional Programming & Streams',
    versionBadge: 'Java 8+ (var in lambdas: Java 11)',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master lambda expressions, Single Abstract Method (SAM) interfaces, @FunctionalInterface, and standard functional types in java.util.function.',
    prerequisites: [
      'Topic 23: Interfaces & Modern Interface Evolution',
      'Topic 24: Nested, Inner, Local & Anonymous Classes'
    ],
    whatAndWhy: {
      definition: 'A lambda expression is an anonymous function that can be passed around as a first-class value. A functional interface is an interface containing exactly one abstract method (SAM).',
      analogy: 'Drone delivery: traditional anonymous classes required drafting a 5-page legal contract (new Runnable() { public void run() { ... } }). A lambda is typing the destination coordinates into the keypad (coords -> launch(coords)).',
      whyItExists: 'Before Java 8, passing behavior into methods required verbose anonymous inner classes. Lambdas eliminate boilerplate and execute via JVM invokedynamic.'
    },
    syntaxBreakdown: {
      title: 'Lambda Syntax & Standard Functional Interfaces',
      codeSnippet: \`Predicate<Integer> isPort = p -> p >= 1024 && p <= 65535;
Function<String, String> upper = s -> s.toUpperCase();
Consumer<String> logger = msg -> System.out.println(msg);
Supplier<Long> timestamp = () -> System.currentTimeMillis();\`,
      explanation: 'Arrow operator separates parameters from execution body. Compiler infers parameter types.',
      tokens: [
        { token: '->', explanation: 'Arrow token separating parameters from execution expression or block.' },
        { token: 'Predicate<T>', explanation: 'Evaluates condition returning boolean.' },
        { token: 'Function<T, R>', explanation: 'Transforms input T into result R.' },
        { token: 'Consumer<T>', explanation: 'Consumes input T with void side-effect.' },
        { token: 'Supplier<T>', explanation: 'Produces value T lazily without arguments.' }
      ]
    },
    examples: [
      {
        id: '40-1',
        title: 'Core Functional Interfaces & Closure Capture',
        type: 'basic',
        description: 'Demonstrates Predicate, Function, Consumer, Supplier, and effectively final closure capture.',
        filename: 'LambdaFunctionalInterfacesDemo.java',
        code: \`import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

public class LambdaFunctionalInterfacesDemo {
    public static void main(String[] args) {
        String environment = "PRODUCTION";

        Predicate<Integer> isHealthyPort = port -> port >= 1024 && port <= 65535;
        System.out.println("Port 8080 valid: " + isHealthyPort.test(8080));
        System.out.println("Port 80 valid:   " + isHealthyPort.test(80));

        Function<String, String> formatTopic = raw -> "[" + environment + "] " + raw.trim().toUpperCase();
        System.out.println("Formatted Message: " + formatTopic.apply(" database connected "));

        Consumer<String> auditLogger = msg -> System.out.println("[AUDIT LOG] " + msg);
        auditLogger.accept("User root authenticated successfully");

        Supplier<Long> timestampGenerator = System::currentTimeMillis;
        System.out.println("Generated Timestamp: " + (timestampGenerator.get() > 0));
    }
}\`,
        output: \`Port 8080 valid: true
Port 80 valid:   false
Formatted Message: [PRODUCTION] DATABASE CONNECTED
[AUDIT LOG] User root authenticated successfully
Generated Timestamp: true\`,
        stepByStep: [
          'Predicate tests numeric bounds and returns boolean.',
          'Function captures effectively final environment variable into closure.',
          'Consumer performs console logging side-effect.',
          'Supplier provides lazy evaluation factory.'
        ]
      },
      {
        id: '40-2',
        title: 'Alert Rule Engine with Composed Predicates',
        type: 'realistic',
        description: 'Evaluates production telemetry alerts using composed Predicate logic (and, or, negate).',
        filename: 'EventNotificationFilterApp.java',
        code: \`import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

public class EventNotificationFilterApp {
    public record SystemAlert(String sourceService, int severityLevel, boolean requiresPage) {}

    public static List<SystemAlert> filterAlerts(List<SystemAlert> alerts, Predicate<SystemAlert> rule) {
        List<SystemAlert> matched = new ArrayList<>();
        for (SystemAlert alert : alerts) {
            if (rule.test(alert)) matched.add(alert);
        }
        return matched;
    }

    public static void main(String[] args) {
        List<SystemAlert> activeAlerts = List.of(
                new SystemAlert("auth-service", 5, true),
                new SystemAlert("billing-service", 2, false),
                new SystemAlert("auth-service", 1, false),
                new SystemAlert("database-cluster", 4, true),
                new SystemAlert("reporting-job", 3, false)
        );

        Predicate<SystemAlert> isCritical = alert -> alert.severityLevel() >= 4;
        Predicate<SystemAlert> isAuthService = alert -> alert.sourceService().equals("auth-service");
        Predicate<SystemAlert> needsPage = SystemAlert::requiresPage;

        Predicate<SystemAlert> onCallRule = isCritical.or(needsPage);
        Predicate<SystemAlert> criticalAuthRule = isCritical.and(isAuthService);

        List<SystemAlert> onCallDispatched = filterAlerts(activeAlerts, onCallRule);
        List<SystemAlert> criticalAuth = filterAlerts(activeAlerts, criticalAuthRule);

        System.out.println("Total Alerts Triggering On-Call: " + onCallDispatched.size());
        for (SystemAlert a : onCallDispatched) System.out.println("  Paging On-Call: " + a.sourceService() + " (Sev " + a.severityLevel() + ")");

        System.out.println("\\nCritical Auth Alerts: " + criticalAuth.size());
        for (SystemAlert a : criticalAuth) System.out.println("  Security Alert: " + a.sourceService() + " (Sev " + a.severityLevel() + ")");
    }
}\`,
        output: \`Total Alerts Triggering On-Call: 2
  Paging On-Call: auth-service (Sev 5)
  Paging On-Call: database-cluster (Sev 4)

Critical Auth Alerts: 1
  Security Alert: auth-service (Sev 5)\`,
        stepByStep: [
          'Builds modular predicates for severity, service name, and paging flag.',
          'Composes rules using default and() and or() methods.',
          'Filters alert stream without modifying source data.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Mutating Non-Final Variable Inside Lambda',
        cause: 'Lambdas can only capture variables that are final or effectively final.',
        solution: 'Use AtomicInteger or collect results using Stream reduction.'
      }
    ],
    bestPractices: {
      doList: [
        'Keep lambdas concise (1-3 lines).',
        'Always annotate custom SAM interfaces with @FunctionalInterface.',
        'Use standard interfaces in java.util.function rather than creating duplicate interfaces.'
      ],
      dontList: [
        'Do not write complex multi-branching logic inside lambdas (extract to named methods).',
        'Never assume this refers to the lambda instance (it refers to enclosing class).'
      ],
      whenNotToUse: 'Do not use lambdas if you need multiple methods or need this to refer to the interface instance.'
    },
    versionNotes: {
      introduced: 'Java 8 (JSR 335)',
      status: 'Stable',
      compatibilityNotes: 'Java 11 added support for var syntax in lambda parameters.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Functional Interfaces Cheat Sheet',
      headers: ['Interface', 'Method Signature', 'Role'],
      rows: [
        ['Predicate<T>', 'boolean test(T t)', 'Boolean condition evaluation'],
        ['Function<T, R>', 'R apply(T t)', 'Input transformation to output R'],
        ['Consumer<T>', 'void accept(T t)', 'Action with side-effects, returns void'],
        ['Supplier<T>', 'T get()', 'Lazy value generation without arguments']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Retry Supplier Utility',
        prompt: 'Implement a retry utility accepting Supplier<T> and invoking it up to maxAttempts times.',
        solution: \`public static <T> T retry(Supplier<T> action, int maxAttempts) {
    RuntimeException last = null;
    for (int i = 0; i < maxAttempts; i++) {
        try { return action.get(); }
        catch (RuntimeException ex) { last = ex; }
    }
    throw last;
}\`,
        explanation: 'Supplier executes lazy operations safely.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Lambda Expressions',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 41: Method References
  {
    id: 'topic-41',
    slug: 'method-references',
    topicNumber: 41,
    title: 'Method References',
    part: 'Part 1: Java Core',
    sectionNumber: 11,
    sectionTitle: 'Functional Programming & Streams',
    versionBadge: 'Java 8+',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Master the four kinds of method references (static, bound, unbound, constructor) with the double-colon (::) operator.',
    prerequisites: [
      'Topic 40: Lambdas & Functional Interfaces',
      'Topic 11: Methods, Parameters & Return Values'
    ],
    whatAndWhy: {
      definition: 'A method reference is a compact shorthand for calling an existing method or constructor by name without executing it immediately, using the :: operator.',
      analogy: 'Pointing to a button: instead of typing out the full sentence "take the bread and toast it" (lambda), you point directly to the label Toaster::toast.',
      whyItExists: 'When a lambda does nothing except forward arguments to an existing method, method references eliminate redundant parameter boilerplate.'
    },
    syntaxBreakdown: {
      title: 'Four Method Reference Classifications',
      codeSnippet: \`Function<String, String> staticRef = StringFormatter::toTitle;
Consumer<String> boundRef = printer::printStandard;
Function<String, String> unboundRef = String::toUpperCase;
Function<String, User> ctorRef = User::new;\`,
      explanation: 'Double colon :: separates class/instance from target method name.',
      tokens: [
        { token: 'ClassName::staticMethod', explanation: 'Static method reference.' },
        { token: 'instance::method', explanation: 'Bound instance reference targeting a specific object.' },
        { token: 'ClassName::instanceMethod', explanation: 'Unbound reference where first parameter becomes target instance.' },
        { token: 'ClassName::new', explanation: 'Constructor reference creating new instances.' }
      ]
    },
    examples: [
      {
        id: '41-1',
        title: 'Demonstrating All 4 Method Reference Kinds',
        type: 'basic',
        description: 'Demonstrates static, bound instance, unbound instance, and constructor references.',
        filename: 'MethodReferencesDemo.java',
        code: \`import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;

public class MethodReferencesDemo {
    public static class StringFormatter {
        public static String toTitleFormat(String input) {
            if (input == null || input.isEmpty()) return "";
            return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
        }
    }

    public static class AuditPrinter {
        public void printStandard(String message) {
            System.out.println("[AUDIT SINK] " + message);
        }
    }

    public record MessageToken(String value) {}

    public static void main(String[] args) {
        Function<String, String> staticRef = StringFormatter::toTitleFormat;
        System.out.println("Static Ref Output: " + staticRef.apply("pROdUcTiOn"));

        AuditPrinter printer = new AuditPrinter();
        Consumer<String> boundRef = printer::printStandard;
        boundRef.accept("Cluster node healthy");

        Function<String, String> unboundRef = String::toUpperCase;
        System.out.println("Unbound Ref Output: " + unboundRef.apply("latency"));

        Function<String, MessageToken> tokenFactory = MessageToken::new;
        MessageToken token = tokenFactory.apply("AUTH_SESSION_99");
        System.out.println("Constructor Ref Output: " + token.value());

        Function<Integer, String[]> arrayFactory = String[]::new;
        String[] emptyArray = arrayFactory.apply(3);
        System.out.println("Array Length: " + emptyArray.length);
    }
}\`,
        output: \`Static Ref Output: Production
[AUDIT SINK] Cluster node healthy
Unbound Ref Output: LATENCY
Constructor Ref Output: AUTH_SESSION_99
Array Length: 3\`,
        stepByStep: [
          'StringFormatter::toTitleFormat forwards String argument to static method.',
          'printer::printStandard binds to printer instance.',
          'String::toUpperCase invokes method on first argument.',
          'MessageToken::new constructs record instance.'
        ]
      },
      {
        id: '41-2',
        title: 'ETL Customer Data Cleansing Pipeline',
        type: 'realistic',
        description: 'Cleanses raw CSV records into domain models using static and unbound instance method references.',
        filename: 'CustomerDataTransformerApp.java',
        code: \`import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public class CustomerDataTransformerApp {
    public record RawRecord(String rawName, String rawEmail) {}

    public record CleanCustomer(String name, String email) {
        public static CleanCustomer fromRaw(RawRecord raw) {
            return new CleanCustomer(raw.rawName().trim(), raw.rawEmail().trim().toLowerCase());
        }
        public String formattedDisplay() {
            return name + " <" + email + ">";
        }
    }

    public static <T, R> List<R> mapList(List<T> source, Function<T, R> mapper) {
        List<R> results = new ArrayList<>();
        for (T item : source) results.add(mapper.apply(item));
        return results;
    }

    public static void main(String[] args) {
        List<RawRecord> csvBatch = List.of(
                new RawRecord("  Alice Walker  ", " ALICE@Example.COM "),
                new RawRecord("Bob Vance ", "Bob.Vance@Refrigeration.COM "),
                new RawRecord(" Charlie Day", "CHARLIE@Paddys.ORG ")
        );

        List<CleanCustomer> cleansed = mapList(csvBatch, CleanCustomer::fromRaw);
        List<String> displayStrings = mapList(cleansed, CleanCustomer::formattedDisplay);

        System.out.println("Cleansed Customer Roster (" + displayStrings.size() + " records):");
        for (String record : displayStrings) System.out.println("  " + record);
    }
}\`,
        output: \`Cleansed Customer Roster (3 records):
  Alice Walker <alice@example.com>
  Bob Vance <bob.vance@refrigeration.com>
  Charlie Day <charlie@paddys.org>\`,
        stepByStep: [
          'CleanCustomer::fromRaw maps RawRecord to CleanCustomer.',
          'CleanCustomer::formattedDisplay converts domain objects to strings.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Passing Arguments in Method References',
        cause: 'Writing StringFormatter::toTitleFormat("hello") causes a compiler syntax error.',
        solution: 'Omit parentheses and arguments: StringFormatter::toTitleFormat.'
      }
    ],
    bestPractices: {
      doList: [
        'Use method references when a lambda merely forwards arguments to an existing method.',
        'Prefer ClassName::new for factory mappings.'
      ],
      dontList: [
        'Do not use method references if they make code less readable than a short lambda.'
      ],
      whenNotToUse: 'Do not use method references when complex argument transformations are required.'
    },
    versionNotes: {
      introduced: 'Java 8',
      status: 'Stable',
      compatibilityNotes: 'Fully supported across all modern JDK versions.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Method Reference Cheat Sheet',
      headers: ['Type', 'Syntax', 'Equivalent Lambda'],
      rows: [
        ['Static', 'Math::max', '(a, b) -> Math.max(a, b)'],
        ['Bound Instance', 'System.out::println', 's -> System.out.println(s)'],
        ['Unbound Instance', 'String::toLowerCase', 's -> s.toLowerCase()'],
        ['Constructor', 'ArrayList::new', '() -> new ArrayList<>()']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Direct Invocation Syntax Bug',
        prompt: 'Why does list.map(User::setName("Admin")) fail to compile?',
        solution: 'Method references must not have parentheses or arguments. Use a lambda: user -> user.setName("Admin").',
        explanation: 'Method references only supply the method pointer, not parameter values.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Method References',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 42: Stream API: Pipeline Fundamentals
  {
    id: 'topic-42',
    slug: 'stream-api-pipeline-fundamentals',
    topicNumber: 42,
    title: 'Stream API: Pipeline Fundamentals',
    part: 'Part 1: Java Core',
    sectionNumber: 11,
    sectionTitle: 'Functional Programming & Streams',
    versionBadge: 'Java 8+ (toList: Java 16)',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master declarative pipelines: lazy evaluation, intermediate operations (filter, map, flatMap, distinct, sorted), and short-circuiting.',
    prerequisites: [
      'Topic 40: Lambdas & Functional Interfaces',
      'Topic 35: The List Hierarchy'
    ],
    whatAndWhy: {
      definition: 'A Stream is a sequence of elements supporting sequential and parallel aggregate operations. Streams do not store data; they convey elements through a lazily-evaluated pipeline.',
      analogy: 'An automated bottling conveyor belt: bottles glide past cleaning, capping, and labeling stations. Nothing runs until the packaging crate switch (terminal operation) is turned on.',
      whyItExists: 'Imperative loops force developers to micromanage iteration mechanics. Streams provide declarative data transformation pipelines with loop fusion optimizations.'
    },
    syntaxBreakdown: {
      title: 'Stream Pipeline Structure',
      codeSnippet: \`List<String> result = source.stream()
    .filter(s -> s.length() > 3)     // Intermediate (lazy)
    .map(String::toUpperCase)        // Intermediate (lazy)
    .distinct()                      // Intermediate (lazy)
    .sorted()                        // Intermediate (lazy)
    .limit(5)                        // Intermediate (lazy)
    .toList();                       // Terminal (eager)\`,
      explanation: 'Streams chain intermediate operations lazily; execution occurs only upon terminal call.',
      tokens: [
        { token: 'filter(Predicate)', explanation: 'Retains elements matching condition.' },
        { token: 'map(Function)', explanation: 'Transforms element 1-to-1.' },
        { token: 'flatMap(Function)', explanation: 'Transforms element to a stream and flattens into single stream.' },
        { token: 'limit(n)', explanation: 'Short-circuits pipeline after n elements.' },
        { token: 'toList()', explanation: 'Terminal operation collecting into unmodifiable List (Java 16+).' }
      ]
    },
    examples: [
      {
        id: '42-1',
        title: 'Lazy Evaluation & Pipeline Operations',
        type: 'basic',
        description: 'Demonstrates lazy evaluation proof, intermediate operation chaining, and flatMap flattening.',
        filename: 'StreamPipelineFundamentalsDemo.java',
        code: \`import java.util.Arrays;
import java.util.List;

public class StreamPipelineFundamentalsDemo {
    public static void main(String[] args) {
        List<String> rawTokens = List.of("alpha", "beta", "gamma", "alpha", "delta", "epsilon");

        System.out.println("=== 1. Demonstrating Lazy Evaluation ===");
        var stream = rawTokens.stream()
                .filter(s -> {
                    System.out.println("  [filter called on: " + s + "]");
                    return s.length() > 4;
                })
                .map(String::toUpperCase);

        System.out.println("Stream defined, but no terminal operation invoked yet.");
        System.out.println("Triggering terminal count()...");
        System.out.println("Filtered count: " + stream.count());

        System.out.println("\\n=== 2. Intermediate Operations Chain ===");
        List<String> processed = rawTokens.stream()
                .filter(s -> s.length() >= 5)
                .distinct()
                .sorted()
                .map(String::toUpperCase)
                .limit(2)
                .toList();
        System.out.println("Final Processed List: " + processed);

        System.out.println("\\n=== 3. FlatMap Transformation ===");
        List<List<Integer>> nestedLists = List.of(List.of(1, 2, 3), List.of(4, 5), List.of(6, 7, 8));
        List<Integer> flattened = nestedLists.stream().flatMap(List::stream).toList();
        System.out.println("Flattened Elements: " + flattened);
    }
}\`,
        output: \`=== 1. Demonstrating Lazy Evaluation ===
Stream defined, but no terminal operation invoked yet.
Triggering terminal count()...
  [filter called on: alpha]
  [filter called on: beta]
  [filter called on: gamma]
  [filter called on: alpha]
  [filter called on: delta]
  [filter called on: epsilon]
Filtered count: 5

=== 2. Intermediate Operations Chain ===
Final Processed List: [ALPHA, DELTA]

=== 3. FlatMap Transformation ===
Flattened Elements: [1, 2, 3, 4, 5, 6, 7, 8]\`,
        stepByStep: [
          'Prints show filter does not run until terminal count() is invoked.',
          'Intermediate operations filter, deduplicate, sort, and slice elements.',
          'flatMap flattens nested lists into a single linear integer stream.'
        ]
      },
      {
        id: '42-2',
        title: 'HTTP Access Log Analysis Pipeline',
        type: 'realistic',
        description: 'Analyzes HTTP request records, filtering by response latency and flattening path segments.',
        filename: 'ServerLogAnalyticsApp.java',
        code: \`import java.util.Arrays;
import java.util.List;

public class ServerLogAnalyticsApp {
    public record AccessLog(String path, int statusCode, long responseTimeMs) {}

    public static void main(String[] args) {
        List<AccessLog> logs = List.of(
                new AccessLog("/api/v1/users/list", 200, 45),
                new AccessLog("/api/v1/auth/login", 401, 120),
                new AccessLog("/static/css/theme.css", 200, 5),
                new AccessLog("/api/v1/orders/submit", 500, 850),
                new AccessLog("/api/v1/users/profile", 200, 60),
                new AccessLog("/api/v1/orders/cancel", 400, 35)
        );

        List<AccessLog> slowApiRequests = logs.stream()
                .filter(log -> log.path().startsWith("/api"))
                .filter(log -> log.responseTimeMs() >= 50)
                .sorted((a, b) -> Long.compare(b.responseTimeMs(), a.responseTimeMs()))
                .toList();

        System.out.println("Slow API Requests (>= 50ms):");
        for (AccessLog log : slowApiRequests) {
            System.out.printf("  [%d] %s -> %dms%n", log.statusCode(), log.path(), log.responseTimeMs());
        }

        List<String> distinctApiResources = logs.stream()
                .map(AccessLog::path)
                .filter(p -> p.startsWith("/api/v1/"))
                .map(p -> p.replace("/api/v1/", ""))
                .flatMap(subPath -> Arrays.stream(subPath.split("/")))
                .filter(s -> !s.equals("list") && !s.equals("submit") && !s.equals("login") && !s.equals("profile") && !s.equals("cancel"))
                .distinct()
                .sorted()
                .toList();

        System.out.println("\\nDistinct Active API Resources: " + distinctApiResources);
    }
}\`,
        output: \`Slow API Requests (>= 50ms):
  [500] /api/v1/orders/submit -> 850ms
  [401] /api/v1/auth/login -> 120ms
  [200] /api/v1/users/profile -> 60ms

Distinct Active API Resources: [auth, orders, users]\`,
        stepByStep: [
          'Filters and sorts slow API requests by response time descending.',
          'Tokenizes paths and extracts distinct root resources via flatMap.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Reusing a Consumed Stream',
        cause: 'Calling a terminal operation on a stream that was already operated upon throws IllegalStateException.',
        solution: 'Streams are single-use consumables. Always generate a fresh stream via list.stream().'
      }
    ],
    bestPractices: {
      doList: [
        'Use streams for declarative filtering, mapping, and aggregations.',
        'Use toList() in Java 16+ for concise unmodifiable lists.'
      ],
      dontList: [
        'Never mutate external shared state inside stream lambdas.',
        'Do not replace simple for loops with streams if imperative early-exits are clearer.'
      ],
      whenNotToUse: 'Do not use streams when checked exceptions must be handled within the loop body.'
    },
    versionNotes: {
      introduced: 'Java 8',
      status: 'Stable',
      compatibilityNotes: 'Java 9 added takeWhile() and dropWhile(). Java 16 added Stream.toList().',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Stream Pipeline Operations Cheat Sheet',
      headers: ['Operation', 'Category', 'Behavior'],
      rows: [
        ['filter(Predicate)', 'Intermediate', 'Retains elements matching boolean test'],
        ['map(Function)', 'Intermediate', 'Transforms element 1-to-1'],
        ['flatMap(Function)', 'Intermediate', 'Transforms element 1-to-many and flattens'],
        ['toList()', 'Terminal', 'Accumulates elements into unmodifiable list']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Square of Even Numbers',
        prompt: 'Filter even integers, square them, and collect into a list.',
        solution: 'numbers.stream().filter(n -> n % 2 == 0).map(n -> n * n).toList();',
        explanation: 'Standard filter and map transformation pipeline.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.util.stream.Stream',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 43: Stream API: Terminal Operations & Collectors
  {
    id: 'topic-43',
    slug: 'stream-api-terminal-operations-and-collectors',
    topicNumber: 43,
    title: 'Stream API: Terminal Operations & Collectors',
    part: 'Part 1: Java Core',
    sectionNumber: 11,
    sectionTitle: 'Functional Programming & Streams',
    versionBadge: 'Java 8+ (Unmodifiable Collectors: Java 10)',
    difficulty: 'Advanced',
    readingTime: '13 min read',
    shortDescription: 'Master terminal operations (reduce, count, matchers) and Collectors (groupingBy, partitioningBy, joining, summarizing).',
    prerequisites: [
      'Topic 42: Stream API: Pipeline Fundamentals',
      'Topic 37: The Map Hierarchy'
    ],
    whatAndWhy: {
      definition: 'Terminal operations trigger stream execution and reduce elements into values or collections. Collectors provide pre-packaged mutable reduction algorithms like groupingBy and joining.',
      analogy: 'Grain silo packaging: the conveyor belt washes and separates wheat. The terminal silo counts bushels (count()), bags grain into sacks (toList()), or partitions into distribution bins (groupingBy).',
      whyItExists: 'Grouping, partitioning, and aggregating collections imperatively requires nested maps and boilerplate loops. Collectors perform multi-level reductions in a single statement.'
    },
    syntaxBreakdown: {
      title: 'Collectors Utility Syntax',
      codeSnippet: \`int sum = stream.reduce(0, Integer::sum);
String joined = stream.collect(Collectors.joining(", "));
Map<String, List<Item>> byCategory = stream.collect(Collectors.groupingBy(Item::category));
Map<Boolean, List<Item>> partitioned = stream.collect(Collectors.partitioningBy(Item::isUrgent));\`,
      explanation: 'collect() triggers pipeline evaluation and accumulates into target data structures.',
      tokens: [
        { token: 'reduce', explanation: 'Combines elements into a single value using an accumulator.' },
        { token: 'groupingBy', explanation: 'Groups elements into Map<K, List<T>> by classifier function.' },
        { token: 'partitioningBy', explanation: 'Splits elements into true/false Map<Boolean, List<T>>.' },
        { token: 'joining', explanation: 'Concatenates string elements with delimiter, prefix, and suffix.' }
      ]
    },
    examples: [
      {
        id: '43-1',
        title: 'Reductions, Joining, Partitioning & Grouping',
        type: 'basic',
        description: 'Demonstrates reduce, joining, partitioningBy, and groupingBy with downstream counting.',
        filename: 'StreamCollectorsDemo.java',
        code: \`import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamCollectorsDemo {
    public record DeviceMetric(String deviceType, String status, int cpuUsage) {}

    public static void main(String[] args) {
        List<DeviceMetric> telemetry = List.of(
                new DeviceMetric("Server", "ONLINE", 45),
                new DeviceMetric("Sensor", "OFFLINE", 0),
                new DeviceMetric("Server", "ONLINE", 82),
                new DeviceMetric("Gateway", "ONLINE", 23),
                new DeviceMetric("Sensor", "ONLINE", 12),
                new DeviceMetric("Gateway", "DEGRADED", 95)
        );

        int totalCpuLoad = telemetry.stream().map(DeviceMetric::cpuUsage).reduce(0, Integer::sum);
        System.out.println("Total CPU Load: " + totalCpuLoad);

        String onlineTypes = telemetry.stream()
                .filter(d -> d.status().equals("ONLINE"))
                .map(DeviceMetric::deviceType)
                .distinct()
                .collect(Collectors.joining(", ", "Active Types: [", "]"));
        System.out.println(onlineTypes);

        Map<Boolean, List<DeviceMetric>> partitionedByLoad = telemetry.stream()
                .collect(Collectors.partitioningBy(d -> d.cpuUsage() >= 80));
        System.out.println("Overloaded Devices Count (>= 80%): " + partitionedByLoad.get(true).size());
        System.out.println("Normal Devices Count (< 80%):       " + partitionedByLoad.get(false).size());

        Map<String, Long> deviceCountByType = telemetry.stream()
                .collect(Collectors.groupingBy(DeviceMetric::deviceType, Collectors.counting()));
        System.out.println("Device Count by Type: " + deviceCountByType);
    }
}\`,
        output: \`Total CPU Load: 257
Active Types: [Server, Gateway, Sensor]
Overloaded Devices Count (>= 80%): 2
Normal Devices Count (< 80%):       4
Device Count by Type: {Server=2, Gateway=2, Sensor=2}\`,
        stepByStep: [
          'Calculates aggregate CPU usage using terminal reduce().',
          'Formats active types into delimited string using Collectors.joining.',
          'Partitions telemetry based on 80% CPU threshold.',
          'Counts device instances per type using groupingBy with downstream counting().'
        ]
      },
      {
        id: '43-2',
        title: 'Enterprise Financial Transaction Analytics',
        type: 'realistic',
        description: 'Analyzes financial transactions: groups spend by category and partitions wire transfers by risk.',
        filename: 'FinancialTransactionAnalyticsApp.java',
        code: \`import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class FinancialTransactionAnalyticsApp {
    public record Transaction(String txId, String currency, String category, double amountUsd) {}

    public static void main(String[] args) {
        List<Transaction> transactions = List.of(
                new Transaction("TX-101", "USD", "CLOUD_INFRA", 1250.00),
                new Transaction("TX-102", "EUR", "MARKETING", 450.50),
                new Transaction("TX-103", "USD", "SALARY", 8500.00),
                new Transaction("TX-104", "USD", "CLOUD_INFRA", 2300.00),
                new Transaction("TX-105", "GBP", "TRAVEL", 320.00),
                new Transaction("TX-106", "EUR", "CLOUD_INFRA", 900.00),
                new Transaction("TX-107", "USD", "EQUIPMENT", 15000.00)
        );

        Map<String, Double> spendingByCategory = transactions.stream()
                .collect(Collectors.groupingBy(Transaction::category, Collectors.summingDouble(Transaction::amountUsd)));

        System.out.println("Total Spending by Category:");
        spendingByCategory.forEach((cat, total) -> System.out.printf("  %-15s -> $%,10.2f%n", cat, total));

        Map<Boolean, List<String>> highValueSplit = transactions.stream()
                .collect(Collectors.partitioningBy(
                        t -> t.amountUsd() >= 5000.0,
                        Collectors.mapping(Transaction::txId, Collectors.toList())
                ));

        System.out.println("\\nHigh-Value Transfers (>= $5,000): " + highValueSplit.get(true));
        System.out.println("Standard Volume Transfers:        " + highValueSplit.get(false));
    }
}\`,
        output: \`Total Spending by Category:
  EQUIPMENT       -> $ 15,000.00
  SALARY          -> $  8,500.00
  MARKETING       -> $    450.50
  TRAVEL          -> $    320.00
  CLOUD_INFRA     -> $  4,450.00

High-Value Transfers (>= $5,000): [TX-103, TX-107]
Standard Volume Transfers:        [TX-101, TX-102, TX-104, TX-105, TX-106]\`,
        stepByStep: [
          'Sums total expenditure per category using groupingBy and summingDouble.',
          'Partitions IDs of transfers >= $5,000 using partitioningBy and mapping collector.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Duplicate Key Exception in Collectors.toMap',
        cause: 'Collecting items with duplicate keys without specifying a merge function throws IllegalStateException.',
        solution: 'Provide a merge function: Collectors.toMap(User::getRole, User::getName, (existing, replace) -> existing).'
      }
    ],
    bestPractices: {
      doList: [
        'Combine groupingBy with downstream collectors (counting, summing, mapping) for single-pass aggregations.',
        'Use partitioningBy when dividing collections into binary true/false categories.'
      ],
      dontList: [
        'Do not assume parallel streams are always faster; thread pool overhead can hurt performance on small collections.'
      ],
      whenNotToUse: 'Do not use Collectors if a simple reduce() or built-in toList() achieves the goal.'
    },
    versionNotes: {
      introduced: 'Java 8',
      status: 'Stable',
      compatibilityNotes: 'Java 9 added filtering() and flatMapping() collectors. Java 10 added toUnmodifiableList().',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Collectors Cheat Sheet',
      headers: ['Collector', 'Return Type', 'Purpose'],
      rows: [
        ['groupingBy(fn)', 'Map<K, List<T>>', 'Categorizes elements by key'],
        ['partitioningBy(pred)', 'Map<Boolean, List<T>>', 'Splits elements into true/false lists'],
        ['joining(delim)', 'String', 'Concatenates string elements with separator'],
        ['summingDouble(fn)', 'Double', 'Sums numeric values across items']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Group by Word Length',
        prompt: 'Group a list of strings by their character lengths into Map<Integer, List<String>>.',
        solution: 'words.stream().collect(Collectors.groupingBy(String::length));',
        explanation: 'Standard groupingBy classifier using method reference.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.util.stream.Collectors',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 44: Optional Type Handling
  {
    id: 'topic-44',
    slug: 'optional-type-handling',
    topicNumber: 44,
    title: 'Optional Type Handling',
    part: 'Part 1: Java Core',
    sectionNumber: 11,
    sectionTitle: 'Functional Programming & Streams',
    versionBadge: 'Java 8+ (orElseThrow: Java 10)',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master Optional<T>: eliminating NullPointerExceptions, safe unwrapping (orElseGet), chaining with map & flatMap, and design anti-patterns.',
    prerequisites: [
      'Topic 40: Lambdas & Functional Interfaces',
      'Topic 16: Classes, Objects & Memory Layout'
    ],
    whatAndWhy: {
      definition: 'Optional<T> is a single-value container object that either holds a non-null reference of type T (present) or contains nothing (empty). It is designed as a method return type to explicitly signal missing values.',
      analogy: 'Parcel locker: opening a post locker is never an invisible vacuum that destroys your hands upon contact. It is a clean box that either contains your package or is safely empty.',
      whyItExists: 'Returning null gives zero compile-time indication of missing data, causing runtime NullPointerExceptions. Optional forces callers to acknowledge and handle empty states.'
    },
    syntaxBreakdown: {
      title: 'Optional Creation, Transformation & Unwrapping',
      codeSnippet: \`Optional<String> opt = Optional.ofNullable(rawValue);
String val = opt.orElse("default");
String lazyVal = opt.orElseGet(() -> computeFallback());
Optional<Integer> len = opt.map(String::length);
opt.ifPresent(v -> System.out.println(v));\`,
      explanation: 'Use ofNullable to wrap unsafe values. Prefer orElseGet over orElse for costly operations.',
      tokens: [
        { token: 'ofNullable(val)', explanation: 'Wraps val if non-null; returns Optional.empty() if null.' },
        { token: 'orElse(fallback)', explanation: 'Unwraps value eagerly, returning fallback if empty.' },
        { token: 'orElseGet(Supplier)', explanation: 'Unwraps value lazily, invoking supplier only if empty.' },
        { token: 'flatMap(Function)', explanation: 'Chains methods returning Optional without nesting Optional<Optional<T>>.' }
      ]
    },
    examples: [
      {
        id: '44-1',
        title: 'Creation, Transformation & Safe Fallbacks',
        type: 'basic',
        description: 'Demonstrates safe creation, mapping, filtering, and conditional execution with ifPresentOrElse.',
        filename: 'OptionalMechanicsDemo.java',
        code: \`import java.util.Optional;

public class OptionalMechanicsDemo {
    public static Optional<String> findConfigValue(String key) {
        if ("database.url".equals(key)) return Optional.of("jdbc:postgresql://localhost:5432/main_db");
        if ("database.pool.size".equals(key)) return Optional.ofNullable("20");
        return Optional.empty();
    }

    public static void main(String[] args) {
        String dbUrl = findConfigValue("database.url").orElse("jdbc:default");
        String missingKey = findConfigValue("unknown.key").orElse("FALLBACK_VALUE");
        System.out.println("Config URL:     " + dbUrl);
        System.out.println("Missing Fallback: " + missingKey);

        Optional<Integer> poolSize = findConfigValue("database.pool.size")
                .map(Integer::parseInt)
                .filter(size -> size >= 10);
        System.out.println("Parsed Pool Size: " + poolSize.orElse(5));

        System.out.print("Audit Notification: ");
        findConfigValue("database.url").ifPresentOrElse(
                url -> System.out.println("Found valid DB endpoint: " + url),
                () -> System.out.println("Warning: DB endpoint unconfigured")
        );
    }
}\`,
        output: \`Config URL:     jdbc:postgresql://localhost:5432/main_db
Missing Fallback: FALLBACK_VALUE
Parsed Pool Size: 20
Audit Notification: Found valid DB endpoint: jdbc:postgresql://localhost:5432/main_db\`,
        stepByStep: [
          'findConfigValue safely returns Optional.empty() for missing keys.',
          'orElse provides immediate fallback values.',
          'map and filter validate pool size conditionally.',
          'ifPresentOrElse branches cleanly based on presence.'
        ]
      },
      {
        id: '44-2',
        title: 'Safe Nested Domain Lookups with FlatMap',
        type: 'realistic',
        description: 'Chains multi-tier profile lookups safely with flatMap, eliminating nested null checks.',
        filename: 'UserProfileLookupServiceApp.java',
        code: \`import java.util.List;
import java.util.Optional;

public class UserProfileLookupServiceApp {
    public record NotificationSettings(String webhookUrl, boolean emailEnabled) {}

    public record UserProfile(String userId, String displayName, NotificationSettings settings) {
        public Optional<NotificationSettings> getNotificationSettings() {
            return Optional.ofNullable(settings);
        }
    }

    public static class UserService {
        private final List<UserProfile> users = List.of(
                new UserProfile("USR-1", "Alice Vance", new NotificationSettings("https://hooks.corp/alice", true)),
                new UserProfile("USR-2", "Bob Martin", null)
        );

        public Optional<UserProfile> findById(String id) {
            return users.stream().filter(u -> u.userId().equals(id)).findFirst();
        }
    }

    public static void main(String[] args) {
        UserService service = new UserService();

        String webhook1 = service.findById("USR-1")
                .flatMap(UserProfile::getNotificationSettings)
                .map(NotificationSettings::webhookUrl)
                .orElse("https://default.corp/sink");

        String webhook2 = service.findById("USR-2")
                .flatMap(UserProfile::getNotificationSettings)
                .map(NotificationSettings::webhookUrl)
                .orElse("https://default.corp/sink");

        String webhook3 = service.findById("USR-99")
                .flatMap(UserProfile::getNotificationSettings)
                .map(NotificationSettings::webhookUrl)
                .orElse("https://default.corp/sink");

        System.out.println("User 1 Webhook: " + webhook1);
        System.out.println("User 2 Webhook: " + webhook2);
        System.out.println("User 99 Webhook: " + webhook3);
    }
}\`,
        output: \`User 1 Webhook: https://hooks.corp/alice
User 2 Webhook: https://default.corp/sink
User 99 Webhook: https://default.corp/sink\`,
        stepByStep: [
          'USR-1 has full profile and settings, resolving webhook URL.',
          'USR-2 has profile but null settings; flatMap short-circuits to fallback.',
          'USR-99 does not exist; chain safely falls back without NullPointerException.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Calling opt.get() without isPresent()',
        cause: 'Calling get() on an empty Optional throws NoSuchElementException, recreating NPE crashes.',
        solution: 'Use orElse(), orElseGet(), or ifPresent() instead.'
      },
      {
        title: 'Using Optional for Class Fields or Method Parameters',
        cause: 'Optional does not implement Serializable and incurs object allocation overhead.',
        solution: 'Use Optional strictly as a method return type.'
      }
    ],
    bestPractices: {
      doList: [
        'Use Optional strictly as a method return type when values may legitimately be missing.',
        'Use flatMap() to navigate nested Optional properties without nested wrappers.',
        'Use orElseGet() when the fallback value is expensive to compute.'
      ],
      dontList: [
        'Never return null from a method whose return type is Optional.',
        'Never wrap collections in Optional (return empty collections instead).'
      ],
      whenNotToUse: 'Do not use Optional as class fields, method arguments, or inside collections.'
    },
    versionNotes: {
      introduced: 'Java 8',
      status: 'Stable',
      compatibilityNotes: 'Java 9 added ifPresentOrElse(), or(), and stream(). Java 10 added orElseThrow().',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Optional Cheat Sheet',
      headers: ['Method', 'When Present', 'When Empty'],
      rows: [
        ['orElse(fallback)', 'Returns value', 'Returns fallback immediately (eager)'],
        ['orElseGet(Supplier)', 'Returns value', 'Invokes supplier lazily and returns result'],
        ['orElseThrow()', 'Returns value', 'Throws NoSuchElementException'],
        ['flatMap(Function)', 'Returns mapped Optional', 'Returns Optional.empty()']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Eager Evaluation in orElse',
        prompt: 'Why is opt.orElse(generateCostlyToken()) an anti-pattern when opt contains a value?',
        solution: 'orElse evaluates its argument eagerly, so generateCostlyToken() runs even when opt is present. Use orElseGet(this::generateCostlyToken) for lazy evaluation.',
        explanation: 'Supplier arguments in orElseGet execute only when the container is empty.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.util.Optional',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html',
        organization: 'Oracle'
      }
    ]
  },
`;

const insertMarker = "  {\n    id: 'topic-66',";
if (!content.includes(insertMarker)) {
  console.error("Could not locate topic-66 marker in topics.ts");
  process.exit(1);
}

content = content.replace(insertMarker, section11Topics.trim() + ",\n\n" + insertMarker);
fs.writeFileSync(TOPICS_PATH, content, 'utf-8');
console.log('Successfully appended Section 11 topics (40-44) to src/data/topics.ts!');
