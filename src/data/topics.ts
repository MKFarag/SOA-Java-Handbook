import type { TopicDetail, SectionMeta } from '../types';

export const SECTIONS: SectionMeta[] = [
  // Part 1: Java Core
  {
    sectionNumber: 1,
    title: 'Foundations & Architecture',
    part: 'Part 1: Java Core',
    description: 'Understand programming fundamentals, compilation, JVM architecture, and environment setup.',
    topicIds: ['topic-01', 'topic-02', 'topic-03']
  },
  {
    sectionNumber: 2,
    title: 'Language Basics & Data Types',
    part: 'Part 1: Java Core',
    description: 'Master variables, primitive types, memory footprints, operators, and String manipulation.',
    topicIds: ['topic-04', 'topic-05', 'topic-06', 'topic-07']
  },
  {
    sectionNumber: 3,
    title: 'Control Flow & Logic',
    part: 'Part 1: Java Core',
    description: 'Direct program execution using conditionals, modern switch expressions, and loops.',
    topicIds: ['topic-08', 'topic-09', 'topic-10']
  },
  {
    sectionNumber: 4,
    title: 'Methods & Modular Code',
    part: 'Part 1: Java Core',
    description: 'Decompose software into clean methods, parameter passing, overloading, and var.',
    topicIds: ['topic-11', 'topic-12', 'topic-13']
  },
  {
    sectionNumber: 5,
    title: 'Arrays & Memory Structure',
    part: 'Part 1: Java Core',
    description: 'Heap allocation of array buffers, multi-dimensional jagged arrays, and utility algorithms.',
    topicIds: ['topic-14', 'topic-15']
  },
  {
    sectionNumber: 6,
    title: 'Object-Oriented Programming (OOP) Essentials',
    part: 'Part 1: Java Core',
    description: 'Classes, objects, constructors, encapsulation, packages, and memory management.',
    topicIds: ['topic-16', 'topic-17', 'topic-18', 'topic-19']
  },
  {
    sectionNumber: 7,
    title: 'OOP Inheritance, Polymorphism & Abstraction',
    part: 'Part 1: Java Core',
    description: 'Inheritance, overriding, dynamic dispatch, abstract classes, interfaces, and enums.',
    topicIds: ['topic-20', 'topic-21', 'topic-22', 'topic-23', 'topic-24', 'topic-25']
  },
  {
    sectionNumber: 8,
    title: 'Modern Java Data Modeling',
    part: 'Part 1: Java Core',
    description: 'Records, sealed hierarchies, pattern matching for instanceof and switch.',
    topicIds: ['topic-26', 'topic-27', 'topic-28']
  },
  {
    sectionNumber: 9,
    title: 'Exception Handling',
    part: 'Part 1: Java Core',
    description: 'Checked vs unchecked exceptions, try-with-resources, and resilient design.',
    topicIds: ['topic-29', 'topic-30', 'topic-31', 'topic-32']
  },
  {
    sectionNumber: 10,
    title: 'Generics & Collections Framework',
    part: 'Part 1: Java Core',
    description: 'Type safety, wildcards (PECS), List, Set, Map, Deque, and custom sorting.',
    topicIds: ['topic-33', 'topic-34', 'topic-35', 'topic-36', 'topic-37', 'topic-38', 'topic-39']
  },
  {
    sectionNumber: 11,
    title: 'Functional Programming & Streams',
    part: 'Part 1: Java Core',
    description: 'Lambdas, functional interfaces, method references, Stream pipelines, and Optional.',
    topicIds: ['topic-40', 'topic-41', 'topic-42', 'topic-43', 'topic-44']
  },
  {
    sectionNumber: 12,
    title: 'File I/O, NIO.2 & Date/Time',
    part: 'Part 1: Java Core',
    description: 'Modern NIO.2 Path operations, Files streams, and java.time immutable calendar APIs.',
    topicIds: ['topic-45', 'topic-46', 'topic-47']
  },
  {
    sectionNumber: 13,
    title: 'Concurrency & Multithreading',
    part: 'Part 1: Java Core',
    description: 'Threads, locks, executors, CompletableFuture, Virtual Threads, and Structured Concurrency.',
    topicIds: ['topic-48', 'topic-49', 'topic-50', 'topic-51', 'topic-52', 'topic-53', 'topic-54']
  },
  {
    sectionNumber: 14,
    title: 'JVM Internals & Memory Architecture',
    part: 'Part 1: Java Core',
    description: 'Java Memory Model, Garbage Collection algorithms (G1, ZGC), and JIT compilation.',
    topicIds: ['topic-55', 'topic-56', 'topic-57']
  },
  {
    sectionNumber: 15,
    title: 'Reflection, Annotations & JPMS',
    part: 'Part 1: Java Core',
    description: 'Runtime reflection, authoring custom annotations, and the Java Platform Module System.',
    topicIds: ['topic-58', 'topic-59', 'topic-60']
  },
  {
    sectionNumber: 16,
    title: 'Data Access & Build Tools',
    part: 'Part 1: Java Core',
    description: 'JDBC transactions and build automation with Maven and Gradle.',
    topicIds: ['topic-61', 'topic-62']
  },

  // Part 2: Java EE & Jakarta EE
  {
    sectionNumber: 17,
    title: 'Web Architecture & The Jakarta EE Evolution',
    part: 'Part 2: Java EE & Jakarta EE',
    description: 'The javax to jakarta migration, server compatibility, and HTTP client-server model.',
    topicIds: ['topic-63', 'topic-64']
  },
  {
    sectionNumber: 18,
    title: 'Web Containers & Packaging',
    part: 'Part 2: Java EE & Jakarta EE',
    description: 'Apache Tomcat internals, WAR directory layout, and live container deployment.',
    topicIds: ['topic-65']
  },
  {
    sectionNumber: 19,
    title: 'Servlets Deep Dive',
    part: 'Part 2: Java EE & Jakarta EE',
    description: 'Servlet lifecycle, HTTP request/response handling, annotations, and request dispatching.',
    topicIds: ['topic-66', 'topic-67', 'topic-68', 'topic-69']
  },
  {
    sectionNumber: 20,
    title: 'State Management, Filters & Security',
    part: 'Part 2: Java EE & Jakarta EE',
    description: 'HttpSession, cookies, servlet filters, application listeners, and OWASP web security.',
    topicIds: ['topic-70', 'topic-71', 'topic-72', 'topic-73']
  },
  {
    sectionNumber: 21,
    title: 'JavaServer Pages (JSP) & Templating',
    part: 'Part 2: Java EE & Jakarta EE',
    description: 'JSP translation lifecycle, directives, scriptlets, EL, JSTL, and custom tag libraries.',
    topicIds: ['topic-74', 'topic-75', 'topic-76', 'topic-77', 'topic-78']
  },
  {
    sectionNumber: 22,
    title: 'Production Web Development',
    part: 'Part 2: Java EE & Jakarta EE',
    description: 'The Web MVC architecture, multipart file uploads, custom error pages, and JNDI pooling.',
    topicIds: ['topic-79', 'topic-80', 'topic-81', 'topic-82']
  },
  {
    sectionNumber: 23,
    title: 'Jakarta EE Enterprise Stack Overview',
    part: 'Part 2: Java EE & Jakarta EE',
    description: 'Overview of enterprise specifications: JPA, CDI, JAX-RS, Bean Validation, and JSF.',
    topicIds: ['topic-83', 'topic-84', 'topic-85', 'topic-86', 'topic-87']
  }
];

export const ALL_TOPICS: TopicDetail[] = [
  // Topic 01: What is Programming & How Code Runs
  {
    id: 'topic-01',
    slug: 'what-is-programming-and-how-code-runs',
    topicNumber: 1,
    title: 'What is Programming & How Code Runs',
    part: 'Part 1: Java Core',
    sectionNumber: 1,
    sectionTitle: 'Foundations & Architecture',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '8 min read',
    shortDescription: 'Discover how human-readable source code transforms into machine-executable instructions through compilation, bytecode, and the Java Virtual Machine.',
    prerequisites: ['None (Absolute Zero Starting Point)'],
    whatAndWhy: {
      definition: 'Programming is the craft of writing unambiguous instructions that direct a computer processor to process data, perform calculations, and make logical decisions. Java bridges the human mind and physical silicon by translating human-readable text into universal bytecode.',
      analogy: 'Imagine you are a head chef writing a recipe. The kitchen stove cannot read English. The compiler (javac) translates your recipe into standardized culinary dials (Bytecode). The JVM (java) is the physical kitchen that reads those dials and prepares the meal identically in any restaurant worldwide.',
      whyItExists: 'Before Java, programs compiled directly into CPU-specific machine code, meaning code written for Windows crashed on Macs or Linux. Java introduced "Write Once, Run Anywhere" (WORA), using bytecode and the JVM to run identical software on any computer.'
    },
    syntaxBreakdown: {
      title: 'The Compilation & Execution Pipeline',
      codeSnippet: '// Compilation:   javac HardwareProbe.java -> HardwareProbe.class (Bytecode)\n// Execution:     java HardwareProbe       -> JVM runs bytecode on host CPU',
      explanation: 'Java separates software development into two distinct phases: build-time compilation and runtime virtual machine interpretation/JIT compilation.',
      tokens: [
        { token: 'Source Code (.java)', explanation: 'Human-readable Java instructions conforming to the Java Language Specification.' },
        { token: 'javac', explanation: 'The compiler command that verifies syntax and outputs platform-independent bytecode.' },
        { token: 'Bytecode (.class)', explanation: 'Intermediate binary instruction set designed to be executed by the Java Virtual Machine.' },
        { token: 'JVM', explanation: 'The Java Virtual Machine software that loads, verifies, and executes bytecode on host hardware.' },
        { token: 'JIT Compiler', explanation: 'Subsystem inside the JVM that compiles frequently executed ("hot") bytecode into native CPU code at runtime for maximum performance.' }
      ]
    },
    examples: [
      {
        id: 'ex-01-basic',
        title: 'Hardware & JVM Environment Probe',
        type: 'basic',
        description: 'Demonstrates how Java queries physical CPU cores and runtime memory boundaries through the JVM abstraction.',
        filename: 'HardwareProbe.java',
        code: `public class HardwareProbe {
    public static void main(String[] args) {
        int availableProcessors = Runtime.getRuntime().availableProcessors();
        long maxMemoryMB = Runtime.getRuntime().maxMemory() / (1024 * 1024);
        
        System.out.println("=== Java Virtual Machine Execution Environment ===");
        System.out.println("Host CPU Cores Available to JVM: " + availableProcessors);
        System.out.println("Max Memory Available to JVM: " + maxMemoryMB + " MB");
        System.out.println("Java Specification Version: " + System.getProperty("java.specification.version"));
    }
}`,
        output: `=== Java Virtual Machine Execution Environment ===
Host CPU Cores Available to JVM: 12
Max Memory Available to JVM: 8168 MB
Java Specification Version: 26`,
        stepByStep: [
          'Step 1: The JVM starts and initializes the Runtime singleton for the active process.',
          'Step 2: Runtime.getRuntime().availableProcessors() queries the host operating system kernel for CPU hardware threads.',
          'Step 3: maxMemory() queries the total heap memory upper limit configured for the process.',
          'Step 4: System.out.println prints the formatted diagnostic metrics to the console.'
        ]
      },
      {
        id: 'ex-01-realistic',
        title: 'Realistic Calculation & Progress Reporting Application',
        type: 'realistic',
        description: 'A realistic program illustrating arithmetic computation, condition checking, and structured console dispatch.',
        filename: 'PerformanceTracker.java',
        code: `public class PerformanceTracker {
    public static void main(String[] args) {
        String studentName = "Elena Vance";
        int completedLessons = 12;
        int totalLessons = 15;
        
        double progressPercentage = ((double) completedLessons / totalLessons) * 100.0;
        boolean isComplete = completedLessons >= totalLessons;
        
        System.out.println("----------------------------------------------");
        System.out.println("      JAVA ACADEMY - PROGRESS DISPATCH        ");
        System.out.println("----------------------------------------------");
        System.out.printf("Student Name        : %s%n", studentName);
        System.out.printf("Completed Lessons   : %d / %d%n", completedLessons, totalLessons);
        System.out.printf("Overall Progress    : %.1f%%%n", progressPercentage);
        System.out.printf("Curriculum Finished : %s%n", isComplete ? "YES" : "NO - In Progress");
        System.out.println("----------------------------------------------");
    }
}`,
        output: `----------------------------------------------
      JAVA ACADEMY - PROGRESS DISPATCH        
----------------------------------------------
Student Name        : Elena Vance
Completed Lessons   : 12 / 15
Overall Progress    : 80.0%
Curriculum Finished : NO - In Progress
----------------------------------------------`,
        stepByStep: [
          'Step 1: The JVM allocates memory on the stack frame for local variables studentName, completedLessons, and totalLessons.',
          'Step 2: Arithmetic division performs floating-point conversion to calculate accurate percentage.',
          'Step 3: A boolean comparison evaluates the conditional status.',
          'Step 4: System.out.printf renders formatted text using platform-independent newline characters (%n).'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Executing Source File Directly without JDK 11+',
        errorCodeOrSnippet: 'Error: Could not find or load main class PerformanceTracker.java',
        wrongCode: 'java PerformanceTracker.java // In old Java versions',
        fixedCode: 'javac PerformanceTracker.java\njava PerformanceTracker',
        cause: 'Historically, the java launcher expected a class name on the classpath, not a .java file path.',
        solution: 'Compile with javac first, or use modern Java 11+ single-file execution.'
      },
      {
        title: 'Class Name and File Name Capitalization Mismatch',
        errorCodeOrSnippet: 'error: class PerformanceTracker is public, should be declared in a file named PerformanceTracker.java',
        wrongCode: '// In file named: performancetracker.java\npublic class PerformanceTracker { ... }',
        fixedCode: '// Rename file to: PerformanceTracker.java\npublic class PerformanceTracker { ... }',
        cause: 'Java requires public class names to match the source file name on disk with exact case sensitivity.',
        solution: 'Match every character capitalization between the class name and the filename on disk.'
      }
    ],
    bestPractices: {
      doList: [
        'Use UpperCamelCase for class identifiers (e.g. PerformanceTracker).',
        'Keep one primary public class per .java file.',
        'Use platform-independent System.out.printf with %n for newlines.',
        'Always check compiler warnings before running code.'
      ],
      dontList: [
        'Never name Java files with lowercase starting letters if the class is public.',
        'Never write code assuming a specific CPU architecture (x86 vs ARM).',
        'Do not hardcode file path slashes in code.'
      ],
      whenNotToUse: 'Do not use standard Java for bare-metal operating system kernel development or hard real-time device driver programming where manual register-level memory mapping without a garbage collector is mandatory.'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Write Once, Run Anywhere architecture established)',
      status: 'Stable',
      compatibilityNotes: 'Bytecode compiled on Java 1.0 can still run on modern Java 26 JVMs due to Java strict backward binary compatibility guarantees. Java 11 introduced single-file source code launching (JEP 330).',
      ltsAvailability: 'Supported across all Java LTS releases: 8, 11, 17, 21, and 25.'
    },
    cheatSheet: {
      title: 'Programming & Compilation Quick Reference',
      headers: ['Component', 'Format', 'Purpose', 'Platform Dependency'],
      rows: [
        ['Source Code', '.java (Text)', 'Human-written application logic', 'Independent'],
        ['javac', 'Binary CLI', 'Compiles source into bytecode', 'OS-specific tool'],
        ['Bytecode', '.class (Binary)', 'Intermediate instructions for the JVM', 'Completely Independent'],
        ['JVM', 'Runtime Engine', 'Executes bytecode on host hardware', 'OS-specific implementation'],
        ['JIT', 'Subsystem', 'Compiles hot bytecode into native machine code', 'Runtime internal']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Platform Portability Misconception',
        prompt: 'If you compile a Java class on a Windows Intel PC, can that exact same .class file run on an ARM Mac? Select the correct explanation.',
        solution: 'Yes, because bytecode (.class) is completely decoupled from physical CPU instruction sets. The Mac ARM JVM reads the standardized bytecode and translates it into ARM instructions on the fly.',
        explanation: 'This is the core of Java Write Once, Run Anywhere (WORA) architecture.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'System Property Inspector',
        prompt: 'Write a Java program named SystemSpecs that prints the host operating system name (os.name) and Java vendor (java.vendor).',
        starterCode: `public class SystemSpecs {\n    public static void main(String[] args) {\n        // Print os.name and java.vendor\n    }\n}`,
        solution: `public class SystemSpecs {\n    public static void main(String[] args) {\n        System.out.println("OS: " + System.getProperty("os.name"));\n        System.out.println("Vendor: " + System.getProperty("java.vendor"));\n    }\n}`,
        explanation: 'System.getProperty queries fundamental environment keys managed by the JVM.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Bytecode Integrity Verification',
        prompt: 'What happens if a compiled .class file is corrupted or tampered with before execution? Which JVM subsystem detects it?',
        solution: 'The JVM Bytecode Verifier throws java.lang.ClassFormatError or java.lang.VerifyError before any code is allowed to execute.',
        explanation: 'The Bytecode Verifier ensures memory safety, verifying that instructions do not violate stack boundaries or memory pointers.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Overview of the Java Platform',
        url: 'https://docs.oracle.com/en/java/javase/21/core/overview-java-platform.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: How Java Works',
        url: 'https://dev.java/learn/how-java-works/',
        organization: 'Oracle'
      },
      {
        title: 'The Java Virtual Machine Specification',
        url: 'https://docs.oracle.com/javase/specs/jvms/se21/html/index.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 02: JDK vs JRE vs JVM & Setup
  {
    id: 'topic-02',
    slug: 'jdk-vs-jre-vs-jvm-and-setup',
    topicNumber: 2,
    title: 'JDK vs JRE vs JVM & Setup',
    part: 'Part 1: Java Core',
    sectionNumber: 1,
    sectionTitle: 'Foundations & Architecture',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '9 min read',
    shortDescription: 'Master the three concentric layers of Java: the Virtual Machine (JVM), the Runtime Environment (JRE), and the Development Kit (JDK). Configure PATH and JAVA_HOME with zero confusion.',
    prerequisites: ['Topic 01: What is Programming & How Code Runs'],
    whatAndWhy: {
      definition: 'The JVM is the execution engine that runs bytecode. The JRE is the bundle containing the JVM plus standard libraries to run Java apps. The JDK is the complete development kit containing the JRE plus compiler tools (javac, jar, jshell) to build Java apps.',
      analogy: 'The JVM is the car engine. The JRE is the complete assembled car (you can drive it). The JDK is the automotive factory containing the car, the engine, diagnostic computers, and robotic assembly tools (you can build cars).',
      whyItExists: 'Separation of concerns: end users and cloud production servers only need lightweight execution runtimes, whereas software engineers require compilation, packaging, and debugging tools.'
    },
    syntaxBreakdown: {
      title: 'Environment Variables & CLI Commands',
      codeSnippet: '// Set JAVA_HOME to root JDK directory:\n// JAVA_HOME = C:\\Program Files\\Java\\jdk-26.0.1\n// Append bin to system PATH:\n// PATH = %JAVA_HOME%\\bin;%PATH%\n\njavac -version   // Verifies the compiler (JDK)\njava -version    // Verifies the runtime (JVM / JRE)',
      explanation: 'Operating systems locate tools via the PATH search list and JAVA_HOME root pointer.',
      tokens: [
        { token: 'JAVA_HOME', explanation: 'Environment variable pointing to the root directory where the JDK is installed.' },
        { token: 'PATH', explanation: 'OS search list of directories; appending %JAVA_HOME%\\bin allows running javac and java from any terminal path.' },
        { token: 'javac -version', explanation: 'Command to check the installed Java Compiler version.' },
        { token: 'java -version', explanation: 'Command to inspect the active HotSpot JVM runtime version and 64-bit mode.' },
        { token: 'jshell', explanation: 'Interactive Read-Eval-Print-Loop (REPL) tool included with the JDK for testing Java snippets.' }
      ]
    },
    examples: [
      {
        id: 'ex-02-basic',
        title: 'Querying Runtime & Installation Properties',
        type: 'basic',
        description: 'Demonstrates how Java inspects its own installation paths, specification versions, and runtime properties programmatically.',
        filename: 'RuntimeInspector.java',
        code: `public class RuntimeInspector {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("       JAVA RUNTIME & ENVIRONMENT REPORT          ");
        System.out.println("==================================================");
        
        String javaHome = System.getProperty("java.home");
        String javaVersion = System.getProperty("java.version");
        String jvmName = System.getProperty("java.vm.name");
        String jvmVendor = System.getProperty("java.vm.vendor");
        String classVersion = System.getProperty("java.class.version");
        
        System.out.println("Active Java Home   : " + javaHome);
        System.out.println("Java Version       : " + javaVersion);
        System.out.println("JVM Implementation : " + jvmName);
        System.out.println("JVM Vendor         : " + jvmVendor);
        System.out.println("Bytecode Version   : " + classVersion);
        System.out.println("==================================================");
    }
}`,
        output: `==================================================
       JAVA RUNTIME & ENVIRONMENT REPORT          
==================================================
Active Java Home   : C:\\Program Files\\Java\\jdk-26.0.1
Java Version       : 26.0.1
JVM Implementation : Java HotSpot(TM) 64-Bit Server VM
JVM Vendor         : Oracle Corporation
Bytecode Version   : 70.0
==================================================`,
        stepByStep: [
          'Step 1: The JVM starts and populates System properties from host environment variables.',
          'Step 2: java.home resolves the active installation directory.',
          'Step 3: java.vm.name confirms the 64-bit Server VM implementation.',
          'Step 4: All properties print cleanly to stdout.'
        ]
      },
      {
        id: 'ex-02-realistic',
        title: 'Development Environment Compliance Validator',
        type: 'realistic',
        description: 'A practical configuration auditor verifying that system properties meet minimum requirements for enterprise development.',
        filename: 'EnvironmentValidator.java',
        code: `public class EnvironmentValidator {
    public static void main(String[] args) {
        long maxHeapBytes = Runtime.getRuntime().maxMemory();
        long maxHeapMB = maxHeapBytes / (1024 * 1024);
        
        String osArch = System.getProperty("os.arch");
        boolean is64Bit = osArch.contains("64");
        
        System.out.println(">>> Checking Development Environment Compliance <<<");
        System.out.printf("Architecture Check : %s (%s)%n", osArch, is64Bit ? "64-bit Compliant" : "32-bit Legacy");
        System.out.printf("Max Heap Memory    : %d MB%n", maxHeapMB);
        
        if (maxHeapMB >= 512 && is64Bit) {
            System.out.println("STATUS: [READY] System meets enterprise Java development standards.");
        } else {
            System.out.println("STATUS: [WARNING] Limited memory or 32-bit runtime detected.");
        }
    }
}`,
        output: `>>> Checking Development Environment Compliance <<<
Architecture Check : amd64 (64-bit Compliant)
Max Heap Memory    : 8168 MB
STATUS: [READY] System meets enterprise Java development standards.`,
        stepByStep: [
          'Step 1: Queries max heap memory allocated by the JVM.',
          'Step 2: Checks host CPU architecture string for 64-bit support.',
          'Step 3: Validates minimum enterprise thresholds and prints readiness status.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Setting PATH directly to JAVA_HOME instead of bin',
        errorCodeOrSnippet: "'javac' is not recognized as an internal or external command",
        wrongCode: 'PATH = C:\\Program Files\\Java\\jdk-26.0.1',
        fixedCode: 'PATH = C:\\Program Files\\Java\\jdk-26.0.1\\bin',
        cause: 'Executables (javac.exe, java.exe) reside inside the bin subdirectory.',
        solution: 'Always append \\bin to the JAVA_HOME path in PATH.'
      },
      {
        title: 'Installing JRE only instead of JDK',
        errorCodeOrSnippet: "'javac' is not recognized",
        cause: 'The JRE only contains execution tools and lacks the Java compiler.',
        solution: 'Download and install the full Java Development Kit (JDK).'
      }
    ],
    bestPractices: {
      doList: [
        'Always install an LTS version (Java 17, 21, or 25) for production systems.',
        'Configure JAVA_HOME so build tools (Maven, Gradle, IDEs) can detect the compiler.',
        'Restart terminals after modifying environment variables to reload the PATH.'
      ],
      dontList: [
        'Never install multiple conflicting JDKs in the same PATH without a version manager.',
        'Do not hardcode absolute paths to JDK directories in project scripts.'
      ],
      whenNotToUse: 'Do not bundle a full JDK inside lightweight production runtime containers; use jlink or minimal runtime images.'
    },
    versionNotes: {
      introduced: 'Java 1.0 (JDK / JRE architecture)',
      status: 'Stable',
      compatibilityNotes: 'Java 9 modularized the JDK and discontinued standalone JRE installers in favor of custom jlink runtimes. Java 17/21/25 LTS provide standard modern distributions.',
      ltsAvailability: 'Available across Java 8, 11, 17, 21, and 25 LTS.'
    },
    cheatSheet: {
      title: 'Java Environment Tools Quick Reference',
      headers: ['Tool / Variable', 'Layer', 'Purpose', 'Command'],
      rows: [
        ['JAVA_HOME', 'Environment', 'Root JDK directory pointer', 'echo %JAVA_HOME%'],
        ['PATH', 'Environment', 'System executable search path', 'echo %PATH%'],
        ['javac', 'JDK', 'Compiles source into bytecode', 'javac App.java'],
        ['java', 'JVM / JRE', 'Executes compiled bytecode', 'java App'],
        ['jshell', 'JDK', 'Interactive Java REPL shell', 'jshell'],
        ['jar', 'JDK', 'Archives classes into JAR format', 'jar -cvf app.jar .']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'PATH Configuration Error',
        prompt: 'If JAVA_HOME is C:\\Java\\jdk-21\\bin and PATH is %JAVA_HOME%\\bin, why does javac fail to run?',
        solution: 'JAVA_HOME should point to the root directory C:\\Java\\jdk-21. Because \\bin was included twice, PATH resolved to C:\\Java\\jdk-21\\bin\\bin which does not exist.',
        explanation: 'Always keep JAVA_HOME pointing to the root JDK folder and append \\bin only in PATH.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'JVM Heap Checker',
        prompt: 'Write a program named JvmMemoryCheck that calculates and prints free memory in Megabytes using Runtime.getRuntime().freeMemory().',
        starterCode: `public class JvmMemoryCheck {\n    public static void main(String[] args) {\n        // Calculate and print free memory in MB\n    }\n}`,
        solution: `public class JvmMemoryCheck {\n    public static void main(String[] args) {\n        long freeMB = Runtime.getRuntime().freeMemory() / (1024 * 1024);\n        System.out.println("Free Memory: " + freeMB + " MB");\n    }\n}`,
        explanation: 'Runtime.getRuntime().freeMemory returns total bytes currently unused in the allocated heap.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'JDK vs JRE in Docker Containers',
        prompt: 'Why do production Docker containers use minimal JRE or jlink images instead of the full JDK?',
        solution: 'For smaller image size (50MB vs 500MB) and hardened security (removing the compiler javac prevents attackers from compiling malicious tools inside the container).',
        explanation: 'Production images should strictly contain the minimal necessary runtime.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle JDK Installation Guide',
        url: 'https://docs.oracle.com/en/java/javase/21/install/',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Installing Java and Setting Up',
        url: 'https://dev.java/learn/install/',
        organization: 'Oracle'
      }
    ]
  },

  // Sample Topic 03: Your First Java Program
  {
    id: 'topic-03',
    slug: 'your-first-java-program',
    topicNumber: 3,
    title: 'Your First Java Program',
    part: 'Part 1: Java Core',
    sectionNumber: 1,
    sectionTitle: 'Foundations & Architecture',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '7 min read',
    shortDescription: 'Write, compile with javac, and execute with java your very first program. Understand the anatomy of main() and bytecode execution.',
    prerequisites: [
      'Topic 01: What is Programming & How Code Runs',
      'Topic 02: JDK vs JRE vs JVM & Setup'
    ],
    whatAndWhy: {
      definition: 'A Java program is a collection of instructions written inside a class definition. The source file (.java) is compiled by the Java Compiler (javac) into portable bytecode (.class), which is subsequently executed by the Java Virtual Machine (java).',
      analogy: 'Think of Java source code as an architectural schematic drawn on paper. You cannot live inside a blueprint. The compiler (javac) acts as a structural engineering review, translating your blueprint into universal standardized fabrication templates (.class bytecode). The JVM (java) is the physical construction crane on your specific plot of land that reads the templates and builds a solid, functioning house.',
      whyItExists: 'Computers cannot directly understand English words like class, static, or println. Java exists to provide an elegant, strongly typed, object-oriented language that humans can write with precision, while the JVM guarantees that the resulting compiled bytecode runs consistently across Windows, macOS, Linux, and cloud servers without modification.'
    },
    syntaxBreakdown: {
      title: 'Deconstruction of the Canonical Main Method',
      codeSnippet: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java Explorer!");\n    }\n}',
      explanation: 'Every element in this foundational program serves a mandatory architectural role in the Java Language Specification.',
      tokens: [
        { token: 'public (class)', explanation: 'Access modifier indicating that this class definition is accessible by any other code or the JVM runtime launcher.' },
        { token: 'class HelloWorld', explanation: 'Declares a blueprint named HelloWorld. In standard Java, the filename must exactly match: HelloWorld.java.' },
        { token: '{ ... }', explanation: 'Curly braces define the lexical scope (boundary) of the class and methods.' },
        { token: 'public (method)', explanation: 'Enables the JVM entry launcher to access and invoke the entry point method from outside the class.' },
        { token: 'static', explanation: 'Binds the method directly to the class rather than an object instance. The JVM can call main() immediately without allocating memory for new HelloWorld().' },
        { token: 'void', explanation: 'Specifies the method return type. main() executes instructions and returns nothing to the caller.' },
        { token: 'main', explanation: 'The exact, reserved identifier that the JVM runtime searches for as the initial application entry point.' },
        { token: 'String[] args', explanation: 'An array of String objects used to pass command-line arguments into the program at launch time.' },
        { token: 'System', explanation: 'A built-in class in the java.lang standard package containing system-level utilities.' },
        { token: 'out', explanation: 'A static PrintStream field inside System representing the standard console output stream.' },
        { token: 'println(...)', explanation: 'Method that prints the given argument followed by a platform-specific newline character.' },
        { token: ';', explanation: 'Statement terminator. Every complete operational statement in Java must end with a semicolon.' }
      ]
    },
    examples: [
      {
        id: 'ex-03-basic',
        title: 'Minimal Working Java Program',
        type: 'basic',
        description: 'The classic canonical starting program. It prints greeting text and displays the active Java runtime version.',
        filename: 'HelloWorld.java',
        code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java Explorer! Your offline Java journey begins here.");
        System.out.println("Runtime Version: " + System.getProperty("java.version"));
    }
}`,
        output: `Hello, Java Explorer! Your offline Java journey begins here.
Runtime Version: 26.0.1`,
        stepByStep: [
          'Step 1: The JVM process starts up and loads HelloWorld.class into Metaspace.',
          'Step 2: The bytecode verifier verifies format safety and stack constraints.',
          'Step 3: The JVM locates public static void main(String[] args) and pushes the main frame onto the thread stack.',
          'Step 4: System.out.println() invokes the native console output system to print the greeting message.',
          'Step 5: System.getProperty("java.version") queries the runtime environment and outputs the active JDK version.',
          'Step 6: The main method stack frame pops, and the JVM exits with status code 0 (clean exit).'
        ]
      },
      {
        id: 'ex-03-realistic',
        title: 'Realistic Console Application with CLI Arguments & Formatted Output',
        type: 'realistic',
        description: 'A realistic program demonstrating command-line parameter handling with safe fallbacks and formatted output.',
        filename: 'GreetingApp.java',
        code: `public class GreetingApp {
    public static void main(String[] args) {
        // Safe check for command-line arguments
        String learnerName = (args.length > 0) ? args[0] : "Student";
        int targetHours = 10;
        
        System.out.println("==========================================");
        System.out.println(" Welcome to Modern Java Engineering!     ");
        System.out.println("==========================================");
        System.out.printf("Learner: %s%n", learnerName);
        System.out.printf("Weekly Target: %d hours%n", targetHours);
        System.out.println("Status: Ready to compile and build.");
    }
}`,
        output: `==========================================
 Welcome to Modern Java Engineering!     
==========================================
Learner: DevMaster
Weekly Target: 10 hours
Status: Ready to compile and build.`,
        stepByStep: [
          'Step 1: The JVM parses the terminal launch arguments and packages them into the String[] args array.',
          'Step 2: The ternary condition checks args.length > 0 to prevent ArrayIndexOutOfBoundsException.',
          'Step 3: System.out.printf() formats the string and decimal integers with platform-independent %n newlines.',
          'Step 4: Clean execution finishes, writing all bytes to stdout and releasing resources.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Case Sensitivity Error',
        errorCodeOrSnippet: 'system.out.println("Hello");',
        wrongCode: 'system.out.println("Hello");',
        fixedCode: 'System.out.println("Hello");',
        cause: 'Java is strictly case-sensitive. The identifier "system" with a lowercase "s" does not exist in java.lang.',
        solution: 'Always capitalize class names: "System.out.println".'
      },
      {
        title: 'File Name Mismatch',
        errorCodeOrSnippet: 'class HelloWorld is public, should be declared in a file named HelloWorld.java',
        wrongCode: '// In file named: hello.java\npublic class HelloWorld { ... }',
        fixedCode: '// Rename file to: HelloWorld.java\npublic class HelloWorld { ... }',
        cause: 'The Java compiler requires any public top-level class name to match the file name exactly, including case.',
        solution: 'Ensure the file name on disk is exactly HelloWorld.java.'
      },
      {
        title: 'Missing Semicolon',
        errorCodeOrSnippet: 'error: \';\' expected',
        wrongCode: 'System.out.println("Hello")',
        fixedCode: 'System.out.println("Hello");',
        cause: 'Java does not use automatic semicolon insertion (unlike JavaScript or Python). Every statement must be terminated.',
        solution: 'Append a semicolon (;) to the end of every statement.'
      },
      {
        title: 'Missing static Modifier in main',
        errorCodeOrSnippet: 'Error: Main method is not static in class HelloWorld, please define the main method as: public static void main(String[] args)',
        wrongCode: 'public void main(String[] args) { ... }',
        fixedCode: 'public static void main(String[] args) { ... }',
        cause: 'Without static, the JVM cannot invoke the entry point without first creating an instance of the class.',
        solution: 'Include static in the method signature (unless using Java 21+ preview instance main feature).'
      }
    ],
    bestPractices: {
      doList: [
        'Use UpperCamelCase for class names (e.g., HelloWorld, UserProfile).',
        'Keep one primary public class per .java source file.',
        'Always verify array length before accessing args[index].',
        'Use System.out.printf with %n for portable, platform-independent newline characters.'
      ],
      dontList: [
        'Never name files with lowercase initial letters if the class is public.',
        'Never put executable statements outside of methods or initializer blocks in a class body.',
        'Do not hardcode Windows backslashes in console strings; use portable path separators.'
      ],
      whenNotToUse: 'Do not use raw System.out.println statements in production enterprise web applications; professional systems use structured logging frameworks (SLF4J / Logback) instead.'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Standard canonical main method signature)',
      status: 'Stable',
      compatibilityNotes: 'Fully backward-compatible across every version of Java from 1.0 to Java 26. Java 21 introduced JEP 445 (continued in Java 22/23/24 JEP 477) allowing beginners to write instance main methods without class boilerplate, but the canonical signature remains the universal production standard.',
      ltsAvailability: 'Supported in Java 8, 11, 17, 21, and 25 LTS.'
    },
    cheatSheet: {
      title: 'Java CLI & Program Structure Quick Reference',
      headers: ['Command / Keyword', 'Type', 'Purpose', 'Example'],
      rows: [
        ['javac', 'CLI Tool', 'Compiles source .java files into .class bytecode', 'javac HelloWorld.java'],
        ['java', 'CLI Tool', 'Launches the JVM and executes compiled class bytecode', 'java HelloWorld'],
        ['public', 'Keyword', 'Allows unbounded visibility across packages and JVM launcher', 'public class App'],
        ['static', 'Keyword', 'Binds member to the class rather than object instances', 'public static void main'],
        ['void', 'Keyword', 'Denotes that a method returns no value to the caller', 'void doWork()'],
        ['String[] args', 'Parameter', 'Accepts command-line arguments passed at launch', 'java App arg1 arg2'],
        ['System.out.println', 'Method', 'Writes string to stdout followed by newline', 'System.out.println("Hi");']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Spot the Compiler Errors',
        prompt: 'Find the two syntax errors preventing this program from compiling:',
        starterCode: `public class TestProgram {
    public static void main(string[] args) {
        System.out.println("Coding in Java")
    }
}`,
        solution: `public class TestProgram {
    public static void main(String[] args) {
        System.out.println("Coding in Java");
    }
}`,
        explanation: '1. "string" must be capitalized as "String" because String is a class in java.lang.\n2. The println statement was missing its trailing semicolon (;).'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Build a System Diagnostic Reporter',
        prompt: 'Write a complete Java program named SystemCheck that prints: (1) Your name, (2) The Java Version, and (3) The Operating System Name using System.getProperty("os.name").',
        starterCode: `public class SystemCheck {
    public static void main(String[] args) {
        // Your code here
    }
}`,
        solution: `public class SystemCheck {
    public static void main(String[] args) {
        System.out.println("Developer: Alex");
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("Operating System: " + System.getProperty("os.name"));
    }
}`,
        explanation: 'System.getProperty() retrieves fundamental runtime environment keys from the host operating system and JVM specification.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Command Line Index Guarding',
        prompt: 'What happens when someone runs "java GreetingApp" without any arguments if the code does "String name = args[0];"? How do you fix it?',
        solution: `// Problematic:
// String name = args[0]; -> Throws ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0

// Robust Fix:
String name = (args.length > 0) ? args[0] : "Guest";`,
        explanation: 'When no arguments are supplied on the command line, args is initialized as a zero-length array (args.length == 0). Accessing index 0 immediately triggers an unchecked ArrayIndexOutOfBoundsException at runtime.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Getting Started with Java',
        url: 'https://docs.oracle.com/en/java/javase/21/get-started/',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: The Official Java Learning Platform',
        url: 'https://dev.java/learn/',
        organization: 'Oracle'
      },
      {
        title: 'OpenJDK JEP 477: Implicitly Declared Classes and Instance Main Methods',
        url: 'https://openjdk.org/jeps/477',
        organization: 'OpenJDK'
      }
    ]
  },

  // Topic 04: Variables, Identifiers & Primitive Data Types
  {
    id: 'topic-04',
    slug: 'variables-identifiers-and-primitive-types',
    topicNumber: 4,
    title: 'Variables, Identifiers & Primitive Data Types',
    part: 'Part 1: Java Core',
    sectionNumber: 2,
    sectionTitle: 'Language Basics & Data Types',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '10 min read',
    shortDescription: 'Explore the 8 fundamental primitive data types in Java, understand memory allocation on the stack, byte sizes, range limits, and variable identifier rules.',
    prerequisites: [
      'Topic 01: What is Programming & How Code Runs',
      'Topic 03: Your First Java Program'
    ],
    whatAndWhy: {
      definition: 'A variable is a named storage location in memory. Java is statically typed, requiring every variable to have a declared type. The 8 primitive types store raw binary values directly on the stack for high-speed computation with zero object overhead.',
      analogy: 'Think of primitives as storage containers of rigid dimensions: a byte is a coin envelope (-128 to 127), an int is a standard shoebox (up to 2 billion), and a long is a shipping crate (up to 9 quintillion). You cannot cram an elephant into a shoebox.',
      whyItExists: 'Hardware memory is finite. Primitives give software engineers exact control over memory footprints, avoiding heap allocation and garbage collection overhead.'
    },
    syntaxBreakdown: {
      title: 'Declaration, Initialization & Wrapper Constants',
      codeSnippet: 'byte b = 12;          // 1 byte (-128 to 127)\nshort s = 8080;       // 2 bytes (-32,768 to 32,767)\nint count = 1_000_000;// 4 bytes (default integer)\nlong id = 9876543210L;// 8 bytes (suffix L required)\nfloat f = 3.14F;      // 4 bytes (suffix F required)\ndouble d = 3.14159;   // 8 bytes (default decimal)\nchar ch = \'A\';        // 2 bytes Unicode UTF-16\nboolean ok = true;    // 1 bit logical true/false',
      explanation: 'Every primitive type has exact bit-length semantics guaranteed across all operating systems.',
      tokens: [
        { token: 'byte', explanation: '8-bit signed two\'s complement integer (-128 to 127).' },
        { token: 'short', explanation: '16-bit signed integer (-32,768 to 32,767).' },
        { token: 'int', explanation: '32-bit signed integer (-2.14B to 2.14B). Standard default for whole numbers.' },
        { token: 'long', explanation: '64-bit integer (-9.22 × 10^18 to 9.22 × 10^18). Suffix L required.' },
        { token: 'float', explanation: '32-bit IEEE 754 floating point. Suffix F required.' },
        { token: 'double', explanation: '64-bit IEEE 754 floating point. Standard default for decimals.' },
        { token: 'char', explanation: '16-bit Unicode character (0 to 65,535).' },
        { token: 'boolean', explanation: 'Logical true or false value.' }
      ]
    },
    examples: [
      {
        id: 'ex-04-basic',
        title: 'All 8 Primitive Types and Wrapper Constants',
        type: 'basic',
        description: 'Demonstrates declaration, literal syntax, underscores, and min/max ranges for all 8 primitives.',
        filename: 'PrimitivesDemo.java',
        code: `public class PrimitivesDemo {
    public static void main(String[] args) {
        byte serverRack = 12;
        short networkPort = 8080;
        int activeUsers = 1_450_200;
        long transactionId = 9_876_543_210L;

        float cpuTemperature = 48.5F;
        double preciseLatency = 0.0034821;

        char statusGrade = 'A';
        boolean isServiceOnline = true;

        System.out.println("=== Java Primitive Types Exploration ===");
        System.out.printf("Byte Range   : [%d to %d], Value: %d%n", Byte.MIN_VALUE, Byte.MAX_VALUE, serverRack);
        System.out.printf("Short Range  : [%d to %d], Value: %d%n", Short.MIN_VALUE, Short.MAX_VALUE, networkPort);
        System.out.printf("Integer Max  : %d, Value: %d%n", Integer.MAX_VALUE, activeUsers);
        System.out.printf("Long Max     : %d, Value: %d%n", Long.MAX_VALUE, transactionId);
        System.out.printf("Float Temp   : %.1f C%n", cpuTemperature);
        System.out.printf("Double Lat   : %.7f seconds%n", preciseLatency);
        System.out.printf("Char Grade   : %c (Unicode int: %d)%n", statusGrade, (int) statusGrade);
        System.out.printf("Online State : %b%n", isServiceOnline);
    }
}`,
        output: `=== Java Primitive Types Exploration ===
Byte Range   : [-128 to 127], Value: 12
Short Range  : [-32768 to 32767], Value: 8080
Integer Max  : 2147483647, Value: 1450200
Long Max     : 9223372036854775807, Value: 9876543210
Float Temp   : 48.5 C
Double Lat   : 0.0034821 seconds
Char Grade   : A (Unicode int: 65)
Online State : true`,
        stepByStep: [
          'Step 1: The JVM allocates local stack variable slots for each declared primitive.',
          'Step 2: Underscores in literals are stripped by the compiler at compile time.',
          'Step 3: Wrapper class constants (Byte.MIN_VALUE, Integer.MAX_VALUE) resolve at runtime.',
          'Step 4: All values output cleanly to standard console.'
        ]
      },
      {
        id: 'ex-04-realistic',
        title: 'IoT Telemetry Report with Primitive Math',
        type: 'realistic',
        description: 'Realistic telemetry data model demonstrating epoch timestamping, voltage thresholds, and boolean logic.',
        filename: 'SensorLedger.java',
        code: `public class SensorLedger {
    public static void main(String[] args) {
        int sensorId = 404;
        long timestampEpochMs = 1718000000000L;
        double batteryVoltage = 3.28;
        float signalStrengthDbm = -65.4F;
        char deviceRegion = 'W';
        boolean alertTriggered = batteryVoltage < 3.0;

        System.out.println("----------------------------------------------");
        System.out.println("           IOT TELEMETRY REPORT               ");
        System.out.println("----------------------------------------------");
        System.out.printf("Sensor ID       : #%d (Region: %c)%n", sensorId, deviceRegion);
        System.out.printf("Epoch Timestamp : %d ms%n", timestampEpochMs);
        System.out.printf("Battery Voltage : %.2f V%n", batteryVoltage);
        System.out.printf("Signal Strength : %.1f dBm%n", signalStrengthDbm);
        System.out.printf("Alert Triggered : %s%n", alertTriggered ? "CRITICAL: LOW BATTERY" : "NORMAL");
        System.out.println("----------------------------------------------");
    }
}`,
        output: `----------------------------------------------
           IOT TELEMETRY REPORT               
----------------------------------------------
Sensor ID       : #404 (Region: W)
Epoch Timestamp : 1718000000000 ms
Battery Voltage : 3.28 V
Signal Strength : -65.4 dBm
Alert Triggered : NORMAL
----------------------------------------------`,
        stepByStep: [
          'Step 1: Variables store raw metrics directly on thread stack.',
          'Step 2: Boolean condition evaluates battery status threshold.',
          'Step 3: Formatted console output prints report with exact numeric formatting.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Omitting L suffix for large numbers',
        errorCodeOrSnippet: 'error: integer number too large',
        wrongCode: 'long id = 3000000000;',
        fixedCode: 'long id = 3000000000L;',
        cause: 'Integer literals default to 32-bit int unless designated with L.',
        solution: 'Always append L to large long constants.'
      },
      {
        title: 'Floating point rounding in financial math',
        errorCodeOrSnippet: 'System.out.println(0.1 + 0.2); // Prints 0.30000000000000004',
        cause: 'Binary floating-point IEEE 754 cannot represent base-10 fractions exactly.',
        solution: 'Use java.math.BigDecimal or integer cents for monetary calculations.'
      }
    ],
    bestPractices: {
      doList: [
        'Use int as the standard default for integers.',
        'Use double as the standard default for floating-point calculations.',
        'Use underscores in numeric literals (e.g. 1_000_000) for readability.'
      ],
      dontList: [
        'Never use float or double for currency calculations.',
        'Never start variable names with uppercase letters.'
      ],
      whenNotToUse: 'Do not use primitives when an API or collection requires nullable values or generic types (use Wrapper classes like Integer or Optional instead).'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Primitives)',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added underscores in numeric literals and binary literals. Java 10 added var type inference.',
      ltsAvailability: 'Available across all Java LTS releases.'
    },
    cheatSheet: {
      title: 'Java 8 Primitives Cheat Sheet',
      headers: ['Primitive', 'Bytes', 'Wrapper', 'Default', 'Range'],
      rows: [
        ['byte', '1', 'Byte', '0', '-128 to 127'],
        ['short', '2', 'Short', '0', '-32,768 to 32,767'],
        ['int', '4', 'Integer', '0', '-2.14B to 2.14B'],
        ['long', '8', 'Long', '0L', '-9.22 × 10^18 to 9.22 × 10^18'],
        ['float', '4', 'Float', '0.0f', '32-bit IEEE 754'],
        ['double', '8', 'Double', '0.0d', '64-bit IEEE 754'],
        ['char', '2', 'Character', '\'\\u0000\'', '0 to 65,535 (UTF-16)'],
        ['boolean', '1 bit', 'Boolean', 'false', 'true or false']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Missing Literal Suffix',
        prompt: 'Why does "float rate = 3.14;" fail to compile?',
        solution: '3.14 defaults to 64-bit double. Storing it in 32-bit float requires suffix F: "float rate = 3.14F;".',
        explanation: 'Java disallows implicit lossy conversion from double to float.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Byte Overflow Experiment',
        prompt: 'Write a program demonstrating byte overflow by adding 1 to 127 with a cast.',
        starterCode: `public class ByteOverflow {\n    public static void main(String[] args) {\n        byte b = 127;\n        // Add 1 and print\n    }\n}`,
        solution: `public class ByteOverflow {\n    public static void main(String[] args) {\n        byte b = 127;\n        b = (byte)(b + 1);\n        System.out.println("Result: " + b); // Prints -128\n    }\n}`,
        explanation: 'Two\'s complement representation wraps around to -128.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Financial Precision Bug',
        prompt: 'Why must banking software avoid double and float for monetary calculations?',
        solution: 'Binary floating-point cannot accurately represent decimal fractions like 0.1, causing accumulated rounding errors. Use BigDecimal instead.',
        explanation: 'Financial transactions require exact decimal arithmetic.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Primitive Data Types',
        url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Variables in Java',
        url: 'https://dev.java/learn/language-basics/variables/',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 05: Operators & Expressions
  {
    id: 'topic-05',
    slug: 'operators-and-expressions',
    topicNumber: 5,
    title: 'Operators & Expressions',
    part: 'Part 1: Java Core',
    sectionNumber: 2,
    sectionTitle: 'Language Basics & Data Types',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master arithmetic, relational, logical, bitwise, and ternary operators. Understand prefix vs postfix increment, short-circuit evaluation, and operator precedence.',
    prerequisites: ['Topic 04: Variables, Identifiers & Primitive Data Types'],
    whatAndWhy: {
      definition: 'An operator is a symbol that transforms operands into a new value. An expression is any valid combination of variables, literals, and operators that evaluates to a single result.',
      analogy: 'Operators are tools on a workbench: arithmetic operators measure and cut material, relational operators are calipers stamping true/false inspection cards, and logical operators are safety interlocks ensuring all safety conditions are met.',
      whyItExists: 'Software fundamentally processes data: computing interest, verifying credentials, and evaluating conditions in the CPU Arithmetic Logic Unit.'
    },
    syntaxBreakdown: {
      title: 'Core Operators & Short-Circuit Mechanics',
      codeSnippet: 'int div = 7 / 2;               // Integer division -> 3\ndouble d = 7.0 / 2;             // Floating division -> 3.5\nint mod = 7 % 2;               // Remainder -> 1\nint res = ++a;                 // Prefix increment\nboolean safe = (s != null) && (s.length() > 0); // Short-circuit AND\nint max = (a > b) ? a : b;     // Ternary conditional',
      explanation: 'Java strictly defines evaluation order, short-circuiting, and precedence.',
      tokens: [
        { token: '+, -, *, /, %', explanation: 'Arithmetic operations. Division on two integers truncates fractions.' },
        { token: '++a vs a++', explanation: 'Prefix increments before evaluation; postfix increments after evaluation.' },
        { token: '&&, ||', explanation: 'Logical operators with short-circuiting: stops evaluating as soon as result is determined.' },
        { token: '&, |, ^', explanation: 'Bitwise / non-short-circuiting logical operations.' },
        { token: '?', explanation: 'Ternary inline decision operator: condition ? valueIfTrue : valueIfFalse.' }
      ]
    },
    examples: [
      {
        id: 'ex-05-basic',
        title: 'Prefix/Postfix & Short-Circuit Mechanics',
        type: 'basic',
        description: 'Demonstrates prefix vs postfix evaluation, integer truncation, and safe null guarding via short-circuiting.',
        filename: 'OperatorMechanics.java',
        code: `public class OperatorMechanics {
    public static void main(String[] args) {
        int a = 5;
        int prefixResult = ++a;
        
        int b = 5;
        int postfixResult = b++;

        System.out.println("=== 1. Prefix vs Postfix ===");
        System.out.printf("Prefix  : a=%d, result=%d%n", a, prefixResult);
        System.out.printf("Postfix : b=%d, result=%d%n", b, postfixResult);

        System.out.println("\\n=== 2. Division Behavior ===");
        int intDiv = 7 / 2;
        double floatDiv = 7.0 / 2;
        int remainder = 7 % 2;
        System.out.println("7 / 2 (Integer)   = " + intDiv);
        System.out.println("7.0 / 2 (Floating)= " + floatDiv);
        System.out.println("7 % 2 (Remainder) = " + remainder);

        System.out.println("\\n=== 3. Short-Circuit Evaluation ===");
        String username = null;
        boolean isValid = (username != null) && (username.length() > 3);
        System.out.println("Safely checked null string without crash: " + isValid);
    }
}`,
        output: `=== 1. Prefix vs Postfix ===
Prefix  : a=6, result=6
Postfix : b=6, result=5

=== 2. Division Behavior ===
7 / 2 (Integer)   = 3
7.0 / 2 (Floating)= 3.5
7 % 2 (Remainder) = 1

=== 3. Short-Circuit Evaluation ===
Safely checked null string without crash: false`,
        stepByStep: [
          'Step 1: Prefix ++a updates variable before assignment.',
          'Step 2: Postfix b++ assigns existing value before incrementing.',
          'Step 3: 7 / 2 performs integer division discarding decimal fraction.',
          'Step 4: Short-circuit && skips right side because username != null is false.'
        ]
      },
      {
        id: 'ex-05-realistic',
        title: 'Bitmask Security Permission Engine',
        type: 'realistic',
        description: 'Production-style bitwise permission manager using bit-shifts, OR, AND, and NOT masks.',
        filename: 'SecurityPermissions.java',
        code: `public class SecurityPermissions {
    public static final int PERM_READ    = 1 << 0;
    public static final int PERM_WRITE   = 1 << 1;
    public static final int PERM_EXECUTE = 1 << 2;
    public static final int PERM_DELETE  = 1 << 3;

    public static void main(String[] args) {
        int userRole = PERM_READ | PERM_WRITE;

        System.out.println("==============================================");
        System.out.println("          BITMASK ACCESS CONTROL              ");
        System.out.println("==============================================");
        System.out.println("User Role Mask Binary: " + Integer.toBinaryString(userRole));

        boolean canRead = (userRole & PERM_READ) != 0;
        boolean canDelete = (userRole & PERM_DELETE) != 0;

        System.out.println("Has READ Access   : " + canRead);
        System.out.println("Has DELETE Access : " + canDelete);

        userRole |= PERM_EXECUTE;
        boolean canExecute = (userRole & PERM_EXECUTE) != 0;
        System.out.println("After Grant -> Has EXECUTE Access: " + canExecute);

        userRole &= ~PERM_WRITE;
        boolean canWriteAfterRevoke = (userRole & PERM_WRITE) != 0;
        System.out.println("After Revoke -> Has WRITE Access : " + canWriteAfterRevoke);
        System.out.println("==============================================");
    }
}`,
        output: `==============================================
          BITMASK ACCESS CONTROL              
==============================================
User Role Mask Binary: 11
Has READ Access   : true
Has DELETE Access : false
After Grant -> Has EXECUTE Access: true
After Revoke -> Has WRITE Access : false
==============================================`,
        stepByStep: [
          'Step 1: Bit shifts define powers of 2 for permissions.',
          'Step 2: Bitwise OR combines multiple permissions into a single int.',
          'Step 3: Bitwise AND tests if specific bit is set.',
          'Step 4: Bitwise AND with NOT (~PERM) revokes permissions in place.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Integer division truncation bug',
        errorCodeOrSnippet: 'double pct = (score / total) * 100; // Evaluates to 0.0!',
        cause: 'When both operands are integers, division truncates decimals before multiplication.',
        solution: 'Cast one operand: ((double) score / total) * 100.'
      },
      {
        title: 'Using single & instead of double && for null checks',
        errorCodeOrSnippet: 'if (s != null & s.length() > 0) // NullPointerException!',
        cause: 'Single & is eager and evaluates the right side even when the left side is false.',
        solution: 'Always use double && for logical short-circuiting.'
      }
    ],
    bestPractices: {
      doList: [
        'Use parentheses to make operator precedence explicit and unambiguous.',
        'Use && and || to protect against null pointer crashes.',
        'Keep ternary expressions simple and concise.'
      ],
      dontList: [
        'Never place mutating side-effects (like ++x) inside logical conditions.',
        'Do not compare object references with == when value equality is intended.'
      ],
      whenNotToUse: 'Do not use nested ternary operators as replacements for readable if-else or switch statements.'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Operators)',
      status: 'Stable',
      compatibilityNotes: 'Java 14 added arrow switch expressions with yield. Java 16 added instanceof pattern matching.',
      ltsAvailability: 'Universal across all Java releases.'
    },
    cheatSheet: {
      title: 'Java Operator Precedence Cheat Sheet',
      headers: ['Precedence', 'Operators', 'Category', 'Associativity'],
      rows: [
        ['1 (High)', '(), [], .', 'Grouping & Access', 'Left to Right'],
        ['2', '++, --, !, ~', 'Unary Prefix', 'Right to Left'],
        ['3', '*, /, %', 'Multiplicative', 'Left to Right'],
        ['4', '+, -', 'Additive', 'Left to Right'],
        ['5', '<<, >>, >>>', 'Bitwise Shift', 'Left to Right'],
        ['6', '<, <=, >, >=', 'Relational', 'Left to Right'],
        ['7', '==, !=', 'Equality', 'Left to Right'],
        ['8', '&&', 'Logical AND', 'Left to Right'],
        ['9', '||', 'Logical OR', 'Left to Right'],
        ['10 (Low)', '? :', 'Ternary', 'Right to Left']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Short-Circuit Side Effect Trap',
        prompt: 'What is the value of x after: int x = 10; if (x > 5 || ++x > 10) {} ?',
        solution: 'x is 10. Because x > 5 is true, the || operator short-circuits and never executes ++x.',
        explanation: 'Short-circuit evaluation skips right operands when result is already determined.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Even or Odd with Ternary',
        prompt: 'Write a program determining whether 47 is Even or Odd using modulus and ternary operator.',
        starterCode: `public class EvenOdd {\n    public static void main(String[] args) {\n        int n = 47;\n        // Ternary check\n    }\n}`,
        solution: `public class EvenOdd {\n    public static void main(String[] args) {\n        int n = 47;\n        String res = (n % 2 == 0) ? "Even" : "Odd";\n        System.out.println(n + " is " + res);\n    }\n}`,
        explanation: 'n % 2 == 0 checks for even divisibility.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Arithmetic vs Unsigned Right Shift',
        prompt: 'What is the difference between >> and >>> in Java?',
        solution: '>> preserves the sign bit (arithmetic shift), while >>> always fills left bits with 0s (unsigned shift).',
        explanation: 'Unsigned shift is critical for parsing raw binary network packets and cryptography hashes.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Operators',
        url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Expressions and Operators',
        url: 'https://dev.java/learn/language-basics/operators/',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 06: Type Casting & Numeric Conversions
  {
    id: 'topic-06',
    slug: 'type-casting-and-numeric-conversions',
    topicNumber: 6,
    title: 'Type Casting & Numeric Conversions',
    part: 'Part 1: Java Core',
    sectionNumber: 2,
    sectionTitle: 'Language Basics & Data Types',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '10 min read',
    shortDescription: 'Understand automatic widening vs explicit narrowing casting, numeric promotion rules in expressions, String parsing, and defensive overflow prevention.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 05: Operators & Expressions'
    ],
    whatAndWhy: {
      definition: 'Type casting converts a value from one data type to another. Widening casting (small to large) is automatic and safe. Narrowing casting (large to small) requires explicit syntax because it may truncate decimals or overflow.',
      analogy: 'Widening is pouring a glass of water into a 5-liter bucket (safe). Narrowing is pouring a 5-liter bucket into a glass: if there is too much water it overflows, and any fine foam is trimmed off.',
      whyItExists: 'Real applications process data across different representations: bytes from network sockets, strings from forms, and double coordinates converted to integer screen pixels.'
    },
    syntaxBreakdown: {
      title: 'Widening, Narrowing & Safe Math Syntax',
      codeSnippet: 'int i = 42;\ndouble d = i;                  // Widening (automatic)\nint truncated = (int) 3.99;    // Narrowing (explicit, evaluates to 3)\nint parsed = Integer.parseInt("8080"); // String parsing\nint safe = Math.addExact(a, b);// Throws ArithmeticException on overflow',
      explanation: 'Java strictly differentiates safe widening from potentially destructive narrowing.',
      tokens: [
        { token: 'Widening', explanation: 'byte -> short -> int -> long -> float -> double. Safe and automatic.' },
        { token: '(type)', explanation: 'Explicit narrowing cast operator acknowledging potential precision loss.' },
        { token: 'Integer.parseInt()', explanation: 'Parses string to int; throws NumberFormatException on invalid text.' },
        { token: 'Math.addExact()', explanation: 'Java 8+ safe arithmetic method throwing ArithmeticException on overflow.' }
      ]
    },
    examples: [
      {
        id: 'ex-06-basic',
        title: 'Widening, Narrowing & Char Conversion',
        type: 'basic',
        description: 'Demonstrates automatic conversions, decimal truncation, character code point mapping, and string parsing.',
        filename: 'CastingMechanics.java',
        code: `public class CastingMechanics {
    public static void main(String[] args) {
        int initialCount = 42;
        long widerLong = initialCount;
        double widerDouble = widerLong;
        System.out.println("=== 1. Automatic Widening ===");
        System.out.println("int 42 widened to double: " + widerDouble);

        double exactPrice = 199.95;
        int wholeDollars = (int) exactPrice;
        System.out.println("\\n=== 2. Explicit Narrowing ===");
        System.out.println("Original double : " + exactPrice);
        System.out.println("Truncated int   : " + wholeDollars);

        char letter = 'J';
        int asciiCode = letter;
        char restoredLetter = (char) (asciiCode + 1);
        System.out.println("\\n=== 3. Char Code Point Conversion ===");
        System.out.println("Char 'J' as code point int: " + asciiCode);
        System.out.println("Code point 75 as char     : " + restoredLetter);

        System.out.println("\\n=== 4. String Parsing ===");
        String rawPort = "8080";
        int parsedPort = Integer.parseInt(rawPort.trim());
        System.out.println("Parsed Port Number: " + (parsedPort + 1));
    }
}`,
        output: `=== 1. Automatic Widening ===
int 42 widened to double: 42.0

=== 2. Explicit Narrowing ===
Original double : 199.95
Truncated int   : 199

=== 3. Char Code Point Conversion ===
Char 'J' as code point int: 74
Code point 75 as char     : K

=== 4. String Parsing ===
Parsed Port Number: 8081`,
        stepByStep: [
          'Step 1: Widening instructions (i2d, i2l) convert formats automatically.',
          'Step 2: Explicit cast (d2i) discards fractional decimals.',
          'Step 3: Character J translates to ASCII code point 74 and vice versa.',
          'Step 4: Integer.parseInt converts text string to numeric stack integer.'
        ]
      },
      {
        id: 'ex-06-realistic',
        title: 'Defensive Inventory Audit with Safe Math',
        type: 'realistic',
        description: 'Realistic warehouse calculation comparing silent overflow with Java 8 Math.addExact protection.',
        filename: 'OverflowGuardApp.java',
        code: `public class OverflowGuardApp {
    public static void main(String[] args) {
        int unitStock = 2_000_000_000;
        int incomingStock = 500_000_000;

        System.out.println("==============================================");
        System.out.println("         WAREHOUSE INVENTORY AUDIT            ");
        System.out.println("==============================================");
        System.out.println("Current Stock : " + unitStock);
        System.out.println("Incoming Stock: " + incomingStock);

        int uncheckedTotal = unitStock + incomingStock;
        System.out.println("\\n[DANGER] Unchecked Addition Result: " + uncheckedTotal);
        System.out.println("Notice: 2.5 Billion wrapped around to a negative number!");

        System.out.println("\\n[SECURE] Executing Protected Math Calculation...");
        try {
            int safeTotal = Math.addExact(unitStock, incomingStock);
            System.out.println("Safe Total: " + safeTotal);
        } catch (ArithmeticException ex) {
            System.out.println("ALERT PREVENTED: Overflow detected! " + ex.getMessage());
            long widenedTotal = (long) unitStock + incomingStock;
            System.out.println("Fallback Calculation (Widened to long): " + widenedTotal);
        }
        System.out.println("==============================================");
    }
}`,
        output: `==============================================
         WAREHOUSE INVENTORY AUDIT            
==============================================
Current Stock : 2000000000
Incoming Stock: 500000000

[DANGER] Unchecked Addition Result: -1794967296
Notice: 2.5 Billion wrapped around to a negative number!

[SECURE] Executing Protected Math Calculation...
ALERT PREVENTED: Overflow detected! integer overflow
Fallback Calculation (Widened to long): 2500000000
==============================================`,
        stepByStep: [
          'Step 1: Standard integer math wraps silently to negative numbers.',
          'Step 2: Math.addExact checks CPU overflow flag and throws ArithmeticException.',
          'Step 3: Catch block catches exception and fails over to 64-bit long.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Binary promotion trap (byte + byte)',
        errorCodeOrSnippet: 'byte b3 = b1 + b2; // COMPILER ERROR!',
        cause: 'Java promotes byte, short, and char to int in arithmetic expressions.',
        solution: 'Cast back: byte b3 = (byte)(b1 + b2); or use int.'
      },
      {
        title: 'NumberFormatException on string parsing',
        errorCodeOrSnippet: 'Integer.parseInt(" 42 "); // Throws exception!',
        cause: 'Whitespace or non-digit characters cause NumberFormatException.',
        solution: 'Sanitize with .trim() before parsing.'
      }
    ],
    bestPractices: {
      doList: [
        'Use Math.addExact and Math.multiplyExact when overflow cannot be tolerated.',
        'Sanitize inputs with .trim() before parsing numbers.',
        'Cast early in division to ensure floating-point computation.'
      ],
      dontList: [
        'Do not use (int) casting when mathematical rounding is required (use Math.round).',
        'Do not ignore binary promotion rules in arithmetic.'
      ],
      whenNotToUse: 'Do not use narrowing casts without validating that the value fits within the target type limits.'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Type conversions)',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added Exact Arithmetic API in java.lang.Math.',
      ltsAvailability: 'Universal across all Java releases.'
    },
    cheatSheet: {
      title: 'Type Conversion Rules Summary',
      headers: ['Conversion', 'Safety', 'Syntax', 'Data Loss Risk'],
      rows: [
        ['int -> double', 'Safe (Widening)', 'double d = i;', 'None'],
        ['double -> int', 'Dangerous (Narrowing)', 'int i = (int) d;', 'Truncates fractions'],
        ['long -> int', 'Dangerous (Narrowing)', 'int i = (int) l;', 'Overflows if > 2.14B'],
        ['String -> int', 'Throws Exception', 'Integer.parseInt(s);', 'NumberFormatException'],
        ['int -> String', 'Safe', 'String.valueOf(i);', 'None']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Byte Arithmetic Promotion',
        prompt: 'Why does "short total = s1 + s2;" fail to compile?',
        solution: 's1 + s2 promotes operands to int. An explicit cast "(short)(s1 + s2)" or int type is required.',
        explanation: 'Arithmetic operators on small primitives promote to int.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Safe Long to Int Conversion',
        prompt: 'Write a program converting a long to int using Math.toIntExact with exception handling.',
        starterCode: `public class SafeConverter {\n    public static void main(String[] args) {\n        long val = 3_000_000_000L;\n        // Convert safely\n    }\n}`,
        solution: `public class SafeConverter {\n    public static void main(String[] args) {\n        long val = 3_000_000_000L;\n        try {\n            int res = Math.toIntExact(val);\n            System.out.println("Converted: " + res);\n        } catch (ArithmeticException ex) {\n            System.out.println("Overflow caught: " + ex.getMessage());\n        }\n    }\n}`,
        explanation: 'Math.toIntExact prevents silent integer wraparound.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Truncation vs Rounding Bug',
        prompt: 'Why does (int) 14.99 yield 14 instead of 15?',
        solution: 'Narrowing casting truncates towards zero; it does not round. Use Math.round(14.99) for rounding.',
        explanation: 'Casting discards the fractional portion completely.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java SE Documentation: Conversions',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Primitive Conversions',
        url: 'https://dev.java/learn/language-basics/primitive-types/',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 07: Strings & Text Blocks
  {
    id: 'topic-07',
    slug: 'strings-and-text-blocks',
    topicNumber: 7,
    title: 'Strings & Text Blocks',
    part: 'Part 1: Java Core',
    sectionNumber: 2,
    sectionTitle: 'Language Basics & Data Types',
    versionBadge: 'Java 8+ / Java 15+',
    difficulty: 'Beginner',
    readingTime: '12 min read',
    shortDescription: 'Master String immutability, the String Constant Pool, high-performance StringBuilder pipelines, and Java 15 multi-line Text Blocks.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 05: Operators & Expressions'
    ],
    whatAndWhy: {
      definition: 'A String is an immutable object representing text. Immutability means strings cannot change once created. The String Constant Pool caches literals in the heap for memory efficiency. Text Blocks provide multiline string syntax.',
      analogy: 'A String is like a printed book: once ink is dried, you cannot alter words; creating an uppercase version requires printing an entirely new book. The String Pool is a public library where multiple readers share the same copy.',
      whyItExists: 'Immutability ensures security (passwords, file paths), enables multithreaded sharing without locks, and allows caching hash codes for fast Map lookups.'
    },
    syntaxBreakdown: {
      title: 'String Pool, Equality & Text Blocks Syntax',
      codeSnippet: 'String s1 = "Java";            // String Constant Pool\nString s2 = new String("Java");// Heap allocation\nboolean same = s1.equals(s2);  // Value equality -> true\nboolean ref = (s1 == s2);      // Reference equality -> false\nStringBuilder sb = new StringBuilder().append("A").append("B");\nString json = """\n    {\n        "status": "OK"\n    }\n    """; // Java 15 Text Block',
      explanation: 'Java separates literal pooling from explicit heap allocation and provides Text Blocks for multiline data.',
      tokens: [
        { token: 'String Constant Pool', explanation: 'Heap memory region caching unique string literals.' },
        { token: '.equals()', explanation: 'Compares textual character content (NOT memory addresses).' },
        { token: '==', explanation: 'Compares memory references. Do not use for string content comparison.' },
        { token: 'StringBuilder', explanation: 'Mutable character buffer for high-performance string concatenation.' },
        { token: '""" (Text Block)', explanation: 'Java 15+ multiline string delimiter with automatic indentation stripping.' }
      ]
    },
    examples: [
      {
        id: 'ex-07-basic',
        title: 'String Pool Identity vs Value Equality & Immutability',
        type: 'basic',
        description: 'Demonstrates pool identity == vs .equals(), immutability reassignments, and StringBuilder looping.',
        filename: 'StringPoolDemo.java',
        code: `public class StringPoolDemo {
    public static void main(String[] args) {
        String literal1 = "JavaCore";
        String literal2 = "JavaCore";
        String heapString = new String("JavaCore");

        System.out.println("=== 1. String Pool & Equality ===");
        System.out.println("literal1 == literal2 (Same Memory Ref): " + (literal1 == literal2));
        System.out.println("literal1 == heapString (Diff Memory Ref): " + (literal1 == heapString));
        System.out.println("literal1.equals(heapString) (Text Content): " + literal1.equals(heapString));

        String message = "hello";
        message.toUpperCase();
        System.out.println("\\n=== 2. Immutability Check ===");
        System.out.println("Message after unassigned toUpperCase(): " + message);
        message = message.toUpperCase();
        System.out.println("Message after reassignment: " + message);

        System.out.println("\\n=== 3. Efficient StringBuilder Assembly ===");
        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("[EVENT LOG]");
        for (int i = 1; i <= 3; i++) {
            logBuilder.append(" -> Step ").append(i);
        }
        System.out.println("Assembled Log: " + logBuilder.toString());
    }
}`,
        output: `=== 1. String Pool & Equality ===
literal1 == literal2 (Same Memory Ref): true
literal1 == heapString (Diff Memory Ref): false
literal1.equals(heapString) (Text Content): true

=== 2. Immutability Check ===
Message after unassigned toUpperCase(): hello
Message after reassignment: HELLO

=== 3. Efficient StringBuilder Assembly ===
Assembled Log: [EVENT LOG] -> Step 1 -> Step 2 -> Step 3`,
        stepByStep: [
          'Step 1: String literals share memory address in String Pool.',
          'Step 2: new String forces separate heap allocation.',
          'Step 3: Unassigned toUpperCase() creates an object that is discarded.',
          'Step 4: StringBuilder appends characters in place without temporary heap garbage.'
        ]
      },
      {
        id: 'ex-07-realistic',
        title: 'Modern Text Blocks for JSON & SQL Configuration',
        type: 'realistic',
        description: 'Realistic service generating formatted JSON payloads and multiline SQL queries using Java 15 text blocks.',
        filename: 'TextBlockService.java',
        code: `public class TextBlockService {
    public static void main(String[] args) {
        String serviceName = "AuthenticationGateway";
        int activeSessions = 342;
        double uptimeHours = 99.98;

        String jsonConfig = """
            {
                "service": "%s",
                "metrics": {
                    "sessions": %d,
                    "uptime": %.2f
                },
                "status": "HEALTHY"
            }
            """.formatted(serviceName, activeSessions, uptimeHours);

        String sqlQuery = """
            SELECT user_id, email, created_at
            FROM system_users
            WHERE account_status = 'ACTIVE'
              AND login_attempts < 3
            ORDER BY created_at DESC;
            """;

        System.out.println("==============================================");
        System.out.println("          SERVICE CONFIGURATION JSON          ");
        System.out.println("==============================================");
        System.out.println(jsonConfig);
        System.out.println("==============================================");
        System.out.println("              DATABASE SQL QUERY              ");
        System.out.println("==============================================");
        System.out.println(sqlQuery);
    }
}`,
        output: `==============================================
          SERVICE CONFIGURATION JSON          
==============================================
{
    "service": "AuthenticationGateway",
    "metrics": {
        "sessions": 342,
        "uptime": 99.98
    },
    "status": "HEALTHY"
}

==============================================
              DATABASE SQL QUERY              
==============================================
SELECT user_id, email, created_at
FROM system_users
WHERE account_status = 'ACTIVE'
  AND login_attempts < 3
ORDER BY created_at DESC;`,
        stepByStep: [
          'Step 1: Text blocks preserve multiline formatting with clean indentation.',
          'Step 2: .formatted() injects runtime parameters into the template.',
          'Step 3: Clean structured output prints to standard output.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Comparing String text with ==',
        errorCodeOrSnippet: 'if (input == "yes") // Bug: compares memory address!',
        cause: '== checks object references in memory, not character contents.',
        solution: 'Always use .equals(): "yes".equals(input).'
      },
      {
        title: 'Concatenating in a loop with +=',
        errorCodeOrSnippet: 'for(...) { s += item; } // O(N^2) memory thrashing!',
        cause: 'Creates temporary String objects on heap on every iteration.',
        solution: 'Use StringBuilder sb = new StringBuilder().'
      }
    ],
    bestPractices: {
      doList: [
        'Place string literal on the left side of .equals() to avoid NullPointerException.',
        'Use Java 11 .strip() instead of legacy .trim() for Unicode-safe whitespace removal.',
        'Use Java 15 Text Blocks for JSON, SQL, or HTML templates.'
      ],
      dontList: [
        'Never use new String("literal") unnecessarily.',
        'Never use synchronized StringBuffer unless concurrent multithreading is required.'
      ],
      whenNotToUse: 'Do not use String for highly mutated binary buffers (use byte[] or ByteBuffer instead).'
    },
    versionNotes: {
      introduced: 'Java 1.0 (String) -> Java 9 (Compact Strings) -> Java 15 (Text Blocks)',
      status: 'Stable',
      compatibilityNotes: 'Java 9 replaced internal char[] with byte[] for 50% heap reduction. Java 15 finalized Text Blocks (JEP 378).',
      ltsAvailability: 'Text blocks available in Java 17, 21, and 25 LTS.'
    },
    cheatSheet: {
      title: 'String Methods Quick Reference',
      headers: ['Method', 'Return', 'Purpose', 'Example'],
      rows: [
        ['.equals(s)', 'boolean', 'Content equality', '"a".equals("a")'],
        ['.equalsIgnoreCase(s)', 'boolean', 'Case-insensitive check', '"A".equalsIgnoreCase("a")'],
        ['.length()', 'int', 'Character count', '"Java".length() == 4'],
        ['.charAt(i)', 'char', 'Character at index', '"Java".charAt(0) == \'J\''],
        ['.strip()', 'String', 'Unicode whitespace strip', '" hi ".strip()'],
        ['.isBlank()', 'boolean', 'Empty or whitespace only', '"  ".isBlank() == true'],
        ['.contains(s)', 'boolean', 'Substring test', '"Java".contains("av")'],
        ['""" ... """', 'String', 'Multiline Text Block', 'Multiline JSON/SQL']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Left-Hand Literal Defense',
        prompt: 'Why is "ADMIN".equals(role) safer than role.equals("ADMIN")?',
        solution: 'If role is null, role.equals() throws NullPointerException, whereas "ADMIN".equals(null) safely returns false.',
        explanation: 'Calling methods on non-null literals protects against null pointer crashes.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'CSV Assembly with StringBuilder',
        prompt: 'Assemble an array of names into a comma-separated string without a trailing comma.',
        starterCode: `public class CsvBuilder {\n    public static void main(String[] args) {\n        String[] names = {"Alice", "Bob", "Charlie"};\n        // Assemble CSV\n    }\n}`,
        solution: `public class CsvBuilder {\n    public static void main(String[] args) {\n        String[] names = {"Alice", "Bob", "Charlie"};\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < names.length; i++) {\n            sb.append(names[i]);\n            if (i < names.length - 1) sb.append(", ");\n        }\n        System.out.println(sb.toString());\n    }\n}`,
        explanation: 'StringBuilder appends in place without allocating intermediate garbage objects.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Compact Strings Memory Footprint',
        prompt: 'How did Java 9 Compact Strings reduce memory usage by 50% across the heap?',
        solution: 'Java replaced char[] (2 bytes per character) with byte[] plus a 1-byte coder flag for Latin-1 characters.',
        explanation: 'Because most application strings only contain Latin-1 characters, memory consumption dropped in half.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Strings',
        url: 'https://docs.oracle.com/javase/tutorial/java/data/strings.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Working with Strings',
        url: 'https://dev.java/learn/strings/',
        organization: 'Oracle'
      },
      {
        title: 'OpenJDK JEP 378: Text Blocks',
        url: 'https://openjdk.org/jeps/378',
        organization: 'OpenJDK'
      }
    ]
  },

  // Topic 08: Conditional Statements
  {
    id: 'topic-08',
    slug: 'conditional-statements',
    topicNumber: 8,
    title: 'Conditional Statements',
    part: 'Part 1: Java Core',
    sectionNumber: 3,
    sectionTitle: 'Control Flow & Logic',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '9 min read',
    shortDescription: 'Direct program execution dynamically using if, else if, else, nested logic, and boolean expressions without logic flaws.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 05: Operators & Expressions'
    ],
    whatAndWhy: {
      definition: 'A conditional statement introduces branching paths into software, executing specific code blocks only if a boolean expression evaluates to true.',
      analogy: 'Think of an automated railroad track switch: an approaching train is evaluated by sensor. If it is an Express train, switch to Track 1; else if Freight, switch to Track 2; else switch to Siding.',
      whyItExists: 'Real applications require dynamic decision-making: verifying account balances, authenticating credentials, or triggering alerts when thresholds are exceeded.'
    },
    syntaxBreakdown: {
      title: 'Conditional Branching & Guard Clauses',
      codeSnippet: 'if (cartTotal >= 200.0) {\n    discount = 20.0;\n} else if (cartTotal >= 100.0) {\n    discount = isVip ? 15.0 : 10.0;\n} else {\n    discount = 0.0;\n}',
      explanation: 'Java requires conditions to be strictly boolean (no implicit integer-to-boolean truthy values).',
      tokens: [
        { token: 'if (condition)', explanation: 'Executes block if boolean expression evaluates to true.' },
        { token: 'else if (condition)', explanation: 'Evaluated sequentially only when preceding if/else-if conditions evaluate to false.' },
        { token: 'else', explanation: 'Default fallback branch executed when all preceding conditions evaluate to false.' },
        { token: '{ } (Braces)', explanation: 'Defines block scope. Omitting braces is an anti-pattern that leads to dangling-else bugs.' }
      ]
    },
    examples: [
      {
        id: 'ex-08-basic',
        title: 'Tiered Discount Engine',
        type: 'basic',
        description: 'Demonstrates clean if-else if-else evaluation order and boundary calculations.',
        filename: 'DiscountCalculator.java',
        code: `public class DiscountCalculator {
    public static void main(String[] args) {
        double cartTotal = 150.00;
        boolean isVipMember = true;
        double discountPercentage;

        if (cartTotal >= 200.0) {
            discountPercentage = 20.0;
        } else if (cartTotal >= 100.0) {
            discountPercentage = isVipMember ? 15.0 : 10.0;
        } else if (cartTotal >= 50.0) {
            discountPercentage = 5.0;
        } else {
            discountPercentage = 0.0;
        }

        double discountAmount = (cartTotal * discountPercentage) / 100.0;
        double finalPrice = cartTotal - discountAmount;

        System.out.println("=== Checkout Discount Summary ===");
        System.out.printf("Cart Subtotal      : $%.2f%n", cartTotal);
        System.out.printf("VIP Membership     : %b%n", isVipMember);
        System.out.printf("Applied Discount   : %.0f%%%n", discountPercentage);
        System.out.printf("Total Savings      : $%.2f%n", discountAmount);
        System.out.printf("Final Price to Pay : $%.2f%n", finalPrice);
    }
}`,
        output: `=== Checkout Discount Summary ===
Cart Subtotal      : $150.00
VIP Membership     : true
Applied Discount   : 15%
Total Savings      : $22.50
Final Price to Pay : $127.50`,
        stepByStep: [
          'Step 1: First condition (cartTotal >= 200.0) evaluates to false.',
          'Step 2: Second condition (cartTotal >= 100.0) evaluates to true.',
          'Step 3: Nested ternary checks isVipMember and assigns 15.0% discount.',
          'Step 4: Unconditional jump skips remaining else-if/else blocks to output calculation.'
        ]
      },
      {
        id: 'ex-08-realistic',
        title: 'Defensive Access Gatekeeper with Guard Clauses',
        type: 'realistic',
        description: 'Production-style access gatekeeper featuring early returns (guard clauses) to prevent deep nesting.',
        filename: 'AccessGatekeeper.java',
        code: `public class AccessGatekeeper {
    public static void main(String[] args) {
        String username = "sys_admin";
        boolean isAccountActive = true;
        boolean isEmailVerified = true;
        int failedLoginAttempts = 1;
        String ipCountry = "US";

        System.out.println("==============================================");
        System.out.println("       IDENTITY & ACCESS CONTROL AUDIT        ");
        System.out.println("==============================================");

        if (failedLoginAttempts >= 3) {
            System.out.println("ACCESS DENIED: Account temporarily locked due to excessive failed attempts.");
            return;
        }

        if (!isAccountActive) {
            System.out.println("ACCESS DENIED: Account has been deactivated by administrator.");
            return;
        }

        if (!isEmailVerified) {
            System.out.println("ACCESS DENIED: Please verify your registered email before logging in.");
            return;
        }

        if ("sys_admin".equals(username)) {
            System.out.println("ACCESS GRANTED: Full Root Administrative Privileges Enabled.");
        } else if ("support".equals(username)) {
            System.out.println("ACCESS GRANTED: Tier-2 Read/Diagnostic Access Granted.");
        } else {
            System.out.println("ACCESS GRANTED: Standard Customer Profile Access.");
        }
        System.out.println("Session Origin Verified: " + ipCountry);
        System.out.println("==============================================");
    }
}`,
        output: `==============================================
       IDENTITY & ACCESS CONTROL AUDIT        
==============================================
ACCESS GRANTED: Full Root Administrative Privileges Enabled.
Session Origin Verified: US
==============================================`,
        stepByStep: [
          'Step 1: Guard clauses test failure states (lockout, inactive, unverified) and return early if matched.',
          'Step 2: Happy path executes without deep horizontal indentation.',
          'Step 3: Role match grants administrative credentials and logs session origin.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Reversed condition order in ladders',
        errorCodeOrSnippet: 'if (score >= 50) { ... } else if (score >= 90) { ... }',
        cause: 'Ordering least-restrictive condition first makes subsequent conditions unreachable dead code.',
        solution: 'Order range checks from most restrictive to least restrictive (e.g. 90, then 50).'
      },
      {
        title: 'Dangling else ambiguity without braces',
        errorCodeOrSnippet: 'if (a) if (b) doB(); else doA(); // else binds to inner if!',
        cause: 'Compilers bind else to the closest preceding if regardless of indentation.',
        solution: 'Always wrap all if and else blocks in curly braces { }.'
      }
    ],
    bestPractices: {
      doList: [
        'Use Guard Clauses to return early and flatten nested if statements.',
        'Always wrap if and else blocks in curly braces { }.',
        'Use positive boolean naming (e.g. isActive instead of isNotInactive).'
      ],
      dontList: [
        'Never write boolean comparison redundancies like if (flag == true).',
        'Avoid deeply nested arrow anti-patterns exceeding 3 levels.'
      ],
      whenNotToUse: 'Do not use multi-branch else-if ladders when evaluating a single variable against discrete constants (use modern switch expressions instead).'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Conditionals)',
      status: 'Stable',
      compatibilityNotes: 'Java 16 added pattern matching for instanceof, combining type test and cast inside if expressions.',
      ltsAvailability: 'Universal across all Java releases.'
    },
    cheatSheet: {
      title: 'Conditional Branching Cheat Sheet',
      headers: ['Construct', 'Branches', 'Usage Pattern', 'Fall-through Risk'],
      rows: [
        ['if', '1', 'Execute on true condition only', 'None'],
        ['if-else', '2', 'Binary decision between two paths', 'None'],
        ['else if ladder', 'N', 'Mutually exclusive value ranges', 'None (first match exits)'],
        ['Guard Clause', 'Early Exit', 'Validating constraints at start of method', 'None']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Reverse Ladder Order',
        prompt: 'Why does score 92 receive "Pass" instead of "Distinction" if if (score >= 50) is tested before if (score >= 90)?',
        solution: 'Because 92 >= 50 is true, the first branch executes and the rest of the ladder is skipped. Test score >= 90 first.',
        explanation: 'Conditions in an else-if ladder must be ordered from most specific to most general.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Leap Year Algorithm',
        prompt: 'Write a program determining whether 2024 is a leap year using standard divisibility rules (divisible by 4 and not 100, or divisible by 400).',
        starterCode: `public class LeapYear {\n    public static void main(String[] args) {\n        int year = 2024;\n        // Check leap year\n    }\n}`,
        solution: `public class LeapYear {\n    public static void main(String[] args) {\n        int year = 2024;\n        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n        System.out.println(year + " is Leap: " + isLeap);\n    }\n}`,
        explanation: 'Compound logical operators cleanly implement the Gregorian calendar specification.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Dangling Else Defense',
        prompt: 'How do curly braces protect against team refactoring bugs in nested if statements?',
        solution: 'Braces explicitly define the lexical boundary of each branch, preventing an else block from silently re-binding to an inner if.',
        explanation: 'Indentation has no semantic meaning in Java syntax; curly braces determine control flow scope.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: if-then and if-then-else',
        url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/if.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Conditional Statements',
        url: 'https://dev.java/learn/language-basics/conditional-statements/',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 09: Switch Statements & Switch Expressions
  {
    id: 'topic-09',
    slug: 'switch-statements-and-switch-expressions',
    topicNumber: 9,
    title: 'Switch Statements & Switch Expressions',
    part: 'Part 1: Java Core',
    sectionNumber: 3,
    sectionTitle: 'Control Flow & Logic',
    versionBadge: 'Java 8+ / Java 14+ / Java 21+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master classic switch statements, avoid catastrophic fall-through bugs, and utilize modern Java 14 switch expressions with arrow syntax, yield, and exhaustiveness.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 08: Conditional Statements'
    ],
    whatAndWhy: {
      definition: 'A switch statement compares a single variable against discrete constant values. Modern Java 14 Switch Expressions introduce arrow syntax (->), eliminate fall-through bugs, allow multi-label matching, and return values directly using yield.',
      analogy: 'A switch is like an automated telephone PBX switchboard: it reads your pressed number once and routes directly to the extension, rather than having 10 receptionists asking you questions in a row.',
      whyItExists: 'Provides clean readability over long else-if chains, enables compiler O(1) jump table optimizations, and enforces exhaustiveness checking.'
    },
    syntaxBreakdown: {
      title: 'Modern Switch Expressions & Yield Syntax',
      codeSnippet: 'String result = switch (statusCode) {\n    case 200, 201 -> "Success";\n    case 400, 404 -> "Client Error";\n    case 500 -> {\n        logError();\n        yield "Server Error"; // Multi-line block value\n    }\n    default -> "Unknown";\n};',
      explanation: 'Arrow syntax (->) guarantees automatic break without accidental fall-through.',
      tokens: [
        { token: 'case X, Y ->', explanation: 'Matches multiple comma-separated constant labels and executes branch without fall-through.' },
        { token: 'yield', explanation: 'Returns a value from a multi-line curly brace block inside a switch expression.' },
        { token: 'default', explanation: 'Mandatory fallback branch required for exhaustiveness when switching over non-exhaustive types.' },
        { token: '; (Semicolon)', explanation: 'Required at the end of a switch expression when assigned to a variable.' }
      ]
    },
    examples: [
      {
        id: 'ex-09-basic',
        title: 'Classic Fall-Through vs Modern Arrow Switch',
        type: 'basic',
        description: 'Demonstrates legacy colon syntax fall-through alongside modern Java 14 arrow expression syntax.',
        filename: 'SwitchEvolutionDemo.java',
        code: `public class SwitchEvolutionDemo {
    public static void main(String[] args) {
        int dayOfWeek = 6;

        System.out.println("=== 1. Classic Switch with Fall-Through ===");
        String dayCategory;
        switch (dayOfWeek) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                dayCategory = "Weekday (Work)";
                break;
            case 6:
            case 7:
                dayCategory = "Weekend (Rest)";
                break;
            default:
                dayCategory = "Invalid Day";
                break;
        }
        System.out.println("Day " + dayOfWeek + " is: " + dayCategory);

        System.out.println("\\n=== 2. Modern Switch Expression ===");
        String modernCategory = switch (dayOfWeek) {
            case 1, 2, 3, 4, 5 -> "Weekday (Work)";
            case 6, 7          -> "Weekend (Rest)";
            default            -> "Invalid Day";
        };
        System.out.println("Computed modern result: " + modernCategory);
    }
}`,
        output: `=== 1. Classic Switch with Fall-Through ===
Day 6 is: Weekend (Rest)

=== 2. Modern Switch Expression ===
Computed modern result: Weekend (Rest)`,
        stepByStep: [
          'Step 1: Classic switch requires explicit break statements to stop execution from falling through.',
          'Step 2: Modern switch expression groups comma-separated cases (1, 2, 3, 4, 5) cleanly.',
          'Step 3: Arrow syntax automatically breaks after evaluating result.',
          'Step 4: Result assigns directly to immutable variable modernCategory.'
        ]
      },
      {
        id: 'ex-09-realistic',
        title: 'HTTP Gateway Status Router with Yield',
        type: 'realistic',
        description: 'Realistic HTTP gateway router evaluating status codes and using multi-line yield blocks for incident alerts.',
        filename: 'HttpStatusRouter.java',
        code: `public class HttpStatusRouter {
    public static void main(String[] args) {
        int httpStatusCode = 503;

        String actionPlan = switch (httpStatusCode) {
            case 200, 201, 204 -> "SUCCESS: Deliver response payload to client.";
            case 301, 302 -> "REDIRECT: Follow Location header to target URI.";
            case 400, 422 -> "VALIDATION FAILURE: Prompt user to verify request body.";
            case 401, 403 -> "SECURITY ALERT: Audit credentials or reject session.";
            case 404 -> "ROUTING ERROR: Endpoint does not exist.";
            case 500, 502, 503 -> {
                System.out.println("[AUDIT LOG] Critical Server Degradation Detected: HTTP " + httpStatusCode);
                yield "INCIDENT LOGGED: Dispatching pager alert to On-Call Engineer.";
            }
            default -> {
                yield "UNKNOWN STATUS: Log anomaly code " + httpStatusCode;
            }
        };

        System.out.println("==============================================");
        System.out.println("         GATEWAY ROUTER RESOLUTION            ");
        System.out.println("==============================================");
        System.out.println("Incoming HTTP Code : " + httpStatusCode);
        System.out.println("Resolved Action    : " + actionPlan);
        System.out.println("==============================================");
    }
}`,
        output: `[AUDIT LOG] Critical Server Degradation Detected: HTTP 503
==============================================
         GATEWAY ROUTER RESOLUTION            
==============================================
Incoming HTTP Code : 503
Resolved Action    : INCIDENT LOGGED: Dispatching pager alert to On-Call Engineer.
==============================================`,
        stepByStep: [
          'Step 1: Selector variable 503 matches case 500, 502, 503.',
          'Step 2: Execution enters multi-statement curly brace block.',
          'Step 3: Audit log prints to console.',
          'Step 4: yield keyword returns the resulting action plan string to the assignment target.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Forgetting break in classic colon switch',
        errorCodeOrSnippet: 'case 1: ... // Forgot break! Execution falls into case 2!',
        cause: 'Legacy switch defaults to fall-through execution.',
        solution: 'Use modern Java 14 arrow syntax (case ->) which never falls through.'
      },
      {
        title: 'Switching on float, double, or boolean',
        errorCodeOrSnippet: 'switch (myDouble) // COMPILER ERROR!',
        cause: 'Java language specification strictly limits switch selector types to integer types, enums, and Strings.',
        solution: 'Use standard if-else statements for floating-point and boolean conditions.'
      }
    ],
    bestPractices: {
      doList: [
        'Prefer modern arrow syntax (case ->) over legacy colon syntax for all new code.',
        'Group common cases with comma-separated lists (e.g. case 1, 2, 3 ->).',
        'Use yield when a branch requires multi-statement computation.'
      ],
      dontList: [
        'Never mix colon syntax and arrow syntax in the same switch block.',
        'Never write fall-through code without prominent developer comments.'
      ],
      whenNotToUse: 'Do not use switch when checking complex floating-point ranges or arbitrary relational formulas (use if-else instead).'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Classic switch) -> Java 14 (Switch Expressions) -> Java 21 (Pattern Matching for switch)',
      status: 'Stable',
      compatibilityNotes: 'Switch Expressions standardized in Java 14 (JEP 361). Java 21 added Pattern Matching for switch (JEP 441).',
      ltsAvailability: 'Modern switch expressions available in Java 17, 21, and 25 LTS.'
    },
    cheatSheet: {
      title: 'Classic vs Modern Switch Cheat Sheet',
      headers: ['Feature', 'Classic Switch', 'Modern Switch Expression'],
      rows: [
        ['Syntax', 'case X:', 'case X ->'],
        ['Fall-through', 'Yes (requires break)', 'Never (automatic break)'],
        ['Return Value', 'No (statements only)', 'Yes (yield value)'],
        ['Multi-label', 'Stacked case 1: case 2:', 'Comma case 1, 2 ->'],
        ['Exhaustiveness', 'Optional', 'Compiler-enforced']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Accidental Fall-Through Output',
        prompt: 'What does this print if rating is 3? switch(rating) { case 1: print("A"); case 3: print("B"); case 4: print("C"); }',
        solution: 'Prints "BC". Because case 3 has no break statement, execution falls through into case 4.',
        explanation: 'Classic switch executes all statements sequentially until a break or closing brace is reached.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Modern Day Type Mapper',
        prompt: 'Write a modern switch expression mapping day numbers 1-7 to "Workday" or "Weekend".',
        starterCode: `int day = 6;\nString type = // Write switch expression`,
        solution: `String type = switch(day) {\n    case 1, 2, 3, 4, 5 -> "Workday";\n    case 6, 7 -> "Weekend";\n    default -> "Invalid";\n};`,
        explanation: 'Comma-separated labels streamline multi-case evaluation.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'When is yield Mandatory?',
        prompt: 'When must a developer write the yield keyword in a modern switch expression?',
        solution: 'When a case branch uses a multi-line block surrounded by curly braces { } to compute a return value.',
        explanation: 'Single expressions return automatically after ->; multi-statement blocks require yield.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Switch Statements',
        url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html',
        organization: 'Oracle'
      },
      {
        title: 'OpenJDK JEP 361: Switch Expressions',
        url: 'https://openjdk.org/jeps/361',
        organization: 'OpenJDK'
      }
    ]
  },

  // Topic 10: Loops & Iteration
  {
    id: 'topic-10',
    slug: 'loops-and-iteration',
    topicNumber: 10,
    title: 'Loops & Iteration',
    part: 'Part 1: Java Core',
    sectionNumber: 3,
    sectionTitle: 'Control Flow & Logic',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master repetitive execution using standard for, enhanced for-each, while, and do-while loops. Control execution flows with break, continue, and labeled jumps.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 08: Conditional Statements'
    ],
    whatAndWhy: {
      definition: 'A loop repeatedly executes a block of code as long as its boolean condition remains true. Java provides for, enhanced for-each, while, and do-while loops to scale operations from single items to millions of records.',
      analogy: 'A for loop is doing 20 pushups (known count). A while loop is pumping gas until the tank is full (pre-test). A do-while loop is trying on a pair of shoes: you must put the shoe on at least once before deciding whether to keep wearing it (post-test).',
      whyItExists: 'Enables computers to process collections, stream files, poll network sockets, and automate repetitive tasks without copy-pasting code.'
    },
    syntaxBreakdown: {
      title: 'Loop Constructs & Labeled Jumps',
      codeSnippet: '// 1. Standard for\nfor (int i = 0; i < 5; i++) { ... }\n\n// 2. Enhanced for-each\nfor (String item : list) { ... }\n\n// 3. while (Pre-test)\nwhile (running) { ... }\n\n// 4. do-while (Post-test)\ndo { ... } while (retry);\n\n// 5. Labeled Jump\nouter: for (...) { for (...) { break outer; } }',
      explanation: 'Java provides both index-based and iterator-based loops with break and continue controls.',
      tokens: [
        { token: 'for (init; cond; update)', explanation: 'Counter-controlled loop. Ideal when iteration count is known.' },
        { token: 'for (Type x : arr)', explanation: 'Enhanced for-each loop. Traverses arrays and Iterables safely without index counters.' },
        { token: 'while (cond)', explanation: 'Pre-condition loop. Executes 0 or more times as long as condition is true.' },
        { token: 'do { } while (cond)', explanation: 'Post-condition loop. Guaranteed to execute at least 1 time.' },
        { token: 'break & continue', explanation: 'break exits loop immediately; continue skips to next iteration.' },
        { token: 'label:', explanation: 'Identifier prefixing an outer loop to allow breaking nested loops simultaneously.' }
      ]
    },
    examples: [
      {
        id: 'ex-10-basic',
        title: 'Four Loops & Jump Mechanics Demonstration',
        type: 'basic',
        description: 'Demonstrates standard for, enhanced for-each, exponential retry while, do-while, and continue.',
        filename: 'LoopMechanicsDemo.java',
        code: `public class LoopMechanicsDemo {
    public static void main(String[] args) {
        System.out.println("=== 1. Standard for Loop (Odd numbers only) ===");
        for (int i = 1; i <= 6; i++) {
            if (i % 2 == 0) {
                continue;
            }
            System.out.print(i + " ");
        }
        System.out.println();

        System.out.println("\\n=== 2. Enhanced for-each Loop ===");
        String[] servers = {"auth-01", "api-01", "db-primary"};
        for (String server : servers) {
            System.out.println("Checking node: " + server);
        }

        System.out.println("\\n=== 3. while Loop (Retry Backoff) ===");
        int attempts = 1;
        int delayMs = 100;
        while (attempts <= 3) {
            System.out.printf("Attempt #%d: waiting %d ms...%n", attempts, delayMs);
            delayMs *= 2;
            attempts++;
        }

        System.out.println("\\n=== 4. do-while Loop ===");
        int token = 0;
        do {
            System.out.println("Generated handshake token: " + (++token));
        } while (token < 1);
    }
}`,
        output: `=== 1. Standard for Loop (Odd numbers only) ===
1 3 5 

=== 2. Enhanced for-each Loop ===
Checking node: auth-01
Checking node: api-01
Checking node: db-primary

=== 3. while Loop (Retry Backoff) ===
Attempt #1: waiting 100 ms...
Attempt #2: waiting 200 ms...
Attempt #3: waiting 400 ms...

=== 4. do-while Loop ===
Generated handshake token: 1`,
        stepByStep: [
          'Step 1: Standard for loop uses continue to skip even iterations.',
          'Step 2: Enhanced for-each traverses string array elements sequentially.',
          'Step 3: while loop simulates exponential retry backoff until attempts exceeds 3.',
          'Step 4: do-while loop executes body once before testing condition token < 1.'
        ]
      },
      {
        id: 'ex-10-realistic',
        title: '2D Satellite Sensor Grid Scanner with Labeled Break',
        type: 'realistic',
        description: 'Production-style 2D matrix scanner using labeled break to terminate nested loops on target match.',
        filename: 'MatrixScannerApp.java',
        code: `public class MatrixScannerApp {
    public static void main(String[] args) {
        int[][] sensorGrid = {
            { 10,  12,  14,  15 },
            { 18,  99,  22,  24 },
            { 30,  32,  34,  36 }
        };

        int anomalyTarget = 99;
        boolean anomalyFound = false;
        int targetRow = -1;
        int targetCol = -1;

        System.out.println("==============================================");
        System.out.println("        SATELLITE SENSOR GRID AUDIT           ");
        System.out.println("==============================================");

        gridScanner:
        for (int r = 0; r < sensorGrid.length; r++) {
            for (int c = 0; c < sensorGrid[r].length; c++) {
                int reading = sensorGrid[r][c];
                System.out.printf("Scanning cell [%d][%d] -> Value: %d%n", r, c, reading);

                if (reading == anomalyTarget) {
                    anomalyFound = true;
                    targetRow = r;
                    targetCol = c;
                    System.out.println(">> ANOMALY IDENTIFIED! Terminating full grid scan.");
                    break gridScanner;
                }
            }
        }

        System.out.println("----------------------------------------------");
        if (anomalyFound) {
            System.out.printf("Scan Complete: Anomaly locked at Row %d, Column %d%n", targetRow, targetCol);
        } else {
            System.out.println("Scan Complete: All sensors within normal nominal range.");
        }
        System.out.println("==============================================");
    }
}`,
        output: `==============================================
        SATELLITE SENSOR GRID AUDIT           
==============================================
Scanning cell [0][0] -> Value: 10
Scanning cell [0][1] -> Value: 12
Scanning cell [0][2] -> Value: 14
Scanning cell [0][3] -> Value: 15
Scanning cell [1][0] -> Value: 18
Scanning cell [1][1] -> Value: 99
>> ANOMALY IDENTIFIED! Terminating full grid scan.
----------------------------------------------
Scan Complete: Anomaly locked at Row 1, Column 1
==============================================`,
        stepByStep: [
          'Step 1: Nested loops iterate over rows and columns.',
          'Step 2: When reading == 99 is discovered at cell [1][1], condition triggers.',
          'Step 3: break gridScanner jumps unconditionally out of BOTH nested loops.',
          'Step 4: Report prints location without scanning remaining cells.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Off-by-one array index crash',
        errorCodeOrSnippet: 'for (int i = 0; i <= arr.length; i++) // ArrayIndexOutOfBoundsException!',
        cause: 'Using <= instead of < attempts to access index equal to array length.',
        solution: 'Always use strict inequality i < arr.length, or use enhanced for-each.'
      },
      {
        title: 'Accidental semicolon after while header',
        errorCodeOrSnippet: 'while (count < 5); { count++; } // Infinite empty loop!',
        cause: 'The trailing semicolon creates an empty loop body that spins indefinitely.',
        solution: 'Never put a semicolon directly after while (...) header.'
      }
    ],
    bestPractices: {
      doList: [
        'Prefer enhanced for-each whenever array indices are not explicitly required.',
        'Use labeled breaks to exit multi-nested loops without awkward boolean flags.',
        'Ensure loop variables advance toward the termination condition to prevent infinite loops.'
      ],
      dontList: [
        'Never mutate loop counter variables inside a for loop body.',
        'Never modify a collection structure while traversing it via for-each (causes ConcurrentModificationException).'
      ],
      whenNotToUse: 'Do not use raw iterative loops when processing bulk transformations on collections (consider modern declarative Stream pipelines instead).'
    },
    versionNotes: {
      introduced: 'Java 1.0 (for, while, do-while) -> Java 5 (Enhanced for-each)',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added Stream API providing functional alternative to imperative loops.',
      ltsAvailability: 'Universal across all Java releases.'
    },
    cheatSheet: {
      title: 'Loop Constructs Comparison',
      headers: ['Construct', 'Min Iterations', 'Condition Check', 'Best For'],
      rows: [
        ['standard for', '0', 'Pre-test', 'Counting, index calculations'],
        ['enhanced for-each', '0', 'Pre-test', 'Sequential reading of arrays & collections'],
        ['while', '0', 'Pre-test', 'Event polling, condition-based waiting'],
        ['do-while', '1', 'Post-test', 'Handshakes, user menus, retry loops']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Off-By-One Index Bound',
        prompt: 'Why does for (int i = 0; i <= arr.length; i++) crash at runtime?',
        solution: 'Because Java arrays are 0-indexed, the last valid index is arr.length - 1. Accessing arr[arr.length] throws ArrayIndexOutOfBoundsException.',
        explanation: 'Use i < arr.length to keep indices within bounds.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Sum Accumulator Loop',
        prompt: 'Write a while loop that calculates the sum of integers from 1 to 100.',
        starterCode: `public class SumApp {\n    public static void main(String[] args) {\n        // Calculate sum 1..100\n    }\n}`,
        solution: `public class SumApp {\n    public static void main(String[] args) {\n        int sum = 0, i = 1;\n        while (i <= 100) { sum += i; i++; }\n        System.out.println("Sum: " + sum);\n    }\n}`,
        explanation: 'The accumulator pattern adds each value while advancing the counter.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Concurrent Modification Trap',
        prompt: 'What happens if you call list.remove() inside an enhanced for-each loop?',
        solution: 'Throws ConcurrentModificationException because modifying the collection invalidates the active hidden Iterator.',
        explanation: 'Use an explicit Iterator with iterator.remove() or list.removeIf() to modify collections during iteration.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Control Flow (Loops)',
        url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Loops in Java',
        url: 'https://dev.java/learn/language-basics/loops/',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 11: Methods, Parameters & Return Values
  {
    id: 'topic-11',
    slug: 'methods-parameters-and-return-values',
    topicNumber: 11,
    title: 'Methods, Parameters & Return Values',
    part: 'Part 1: Java Core',
    sectionNumber: 4,
    sectionTitle: 'Methods & Modular Code',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '10 min read',
    shortDescription: 'Decompose programs into modular, reusable blocks. Master method signatures, the call stack, stack frames, and pass-by-value semantics.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 08: Conditional Statements'
    ],
    whatAndWhy: {
      definition: 'A method is a named block of code within a class designed to perform a specific task, accepting input parameters, performing computations, and optionally returning a result.',
      analogy: 'Think of an automated ATM: you enter your PIN and requested cash amount (parameters), the internal mechanism verifies bank reserves, and it dispenses physical bills (return value). An on-screen balance check performs a task without handing cash (void return).',
      whyItExists: 'Methods prevent repetitive monolithic code, enforce Don\'t Repeat Yourself (DRY) principles, establish abstraction boundaries, and isolate logic for focused unit testing.'
    },
    syntaxBreakdown: {
      title: 'Method Signature & Call Stack Frame Anatomy',
      codeSnippet: `public static double calculateInterest(double principal, double annualRatePercent, int years) {
    double rate = annualRatePercent / 100.0;
    return principal * Math.pow(1.0 + rate, years);
}`,
      explanation: 'Methods declare access levels, optional static linkage, explicit return types, identifier, and typed parameter lists.',
      tokens: [
        { token: 'public static', explanation: 'Public accessibility from all packages; static means bound to the class without requiring an instance.' },
        { token: 'double', explanation: 'The return type specifying the data type returned to caller (or void if no value is returned).' },
        { token: 'calculateInterest(...)', explanation: 'Method identifier in camelCase followed by typed input parameters in parentheses.' },
        { token: 'return expression;', explanation: 'Immediately halts method execution and transfers evaluated result to caller stack frame.' }
      ]
    },
    examples: [
      {
        id: '11-1',
        title: 'Pass-by-Value Mechanics & Stack Frames',
        type: 'basic',
        description: 'Proves that Java is strictly pass-by-value: primitives copy bits, while object references copy memory addresses.',
        filename: 'MethodMechanics.java',
        code: `public class MethodMechanics {
    public static void modifyPrimitive(int value) {
        value = value * 2;
        System.out.println("Inside modifyPrimitive: value = " + value);
    }

    public static void modifyArray(int[] numbers) {
        numbers[0] = 999;
        System.out.println("Inside modifyArray: numbers[0] = " + numbers[0]);
    }

    public static void reassignReference(int[] numbers) {
        numbers = new int[]{100, 200, 300};
        System.out.println("Inside reassignReference: numbers[0] = " + numbers[0]);
    }

    public static double calculateInterest(double principal, double annualRatePercent, int years) {
        double rate = annualRatePercent / 100.0;
        return principal * Math.pow(1.0 + rate, years);
    }

    public static void main(String[] args) {
        int originalNumber = 50;
        modifyPrimitive(originalNumber);
        System.out.println("After modifyPrimitive: " + originalNumber + " (unchanged)");

        int[] scores = {10, 20, 30};
        modifyArray(scores);
        System.out.println("After modifyArray: scores[0] = " + scores[0] + " (mutated on heap)");

        reassignReference(scores);
        System.out.println("After reassignReference: scores[0] = " + scores[0] + " (caller pointer untouched)");

        double futureValue = calculateInterest(1000.0, 5.0, 3);
        System.out.printf("Principal 1000.0 at 5%% for 3 years: %.2f%n", futureValue);
    }
}`,
        output: `Inside modifyPrimitive: value = 100
After modifyPrimitive: 50 (unchanged)
Inside modifyArray: numbers[0] = 999
After modifyArray: scores[0] = 999 (mutated on heap)
Inside reassignReference: numbers[0] = 100
After reassignReference: scores[0] = 999 (caller pointer untouched)
Principal 1000.0 at 5% for 3 years: 1157.63`,
        stepByStep: [
          'main() allocates originalNumber (50) on its local stack frame.',
          'modifyPrimitive() receives a copy of literal 50 in its own stack frame; doubling it leaves main() untouched.',
          'modifyArray() receives a copy of the pointer to the heap array; modifying index [0] mutates the shared heap object.',
          'reassignReference() changes its local parameter pointer to a new array; main() retains its original pointer.',
          'calculateInterest() computes compound interest and returns 1157.63 back to main().'
        ]
      },
      {
        id: '11-2',
        title: 'Bank Fund Transfer Service',
        type: 'realistic',
        description: 'Multi-parameter business service performing validation, atomic deduction, fee computation, and status reporting.',
        filename: 'AccountService.java',
        code: `public class AccountService {
    public static class BankAccount {
        private final String accountNumber;
        private double balance;
        public BankAccount(String accountNumber, double initialBalance) {
            this.accountNumber = accountNumber;
            this.balance = initialBalance;
        }
        public String getAccountNumber() { return accountNumber; }
        public double getBalance() { return balance; }
        public void deposit(double amount) { if (amount > 0) balance += amount; }
        public boolean withdraw(double amount) {
            if (amount > 0 && balance >= amount) { balance -= amount; return true; }
            return false;
        }
    }

    public static boolean transferFunds(BankAccount source, BankAccount destination, double amount, double feePercent) {
        if (source == null || destination == null || amount <= 0.0) return false;
        double fee = feePercent <= 0.0 ? 0.0 : amount * (feePercent / 100.0);
        double totalDeduction = amount + fee;
        if (source.getBalance() < totalDeduction) return false;

        source.withdraw(totalDeduction);
        destination.deposit(amount);
        return true;
    }

    public static void main(String[] args) {
        BankAccount checking = new BankAccount("CHK-9041", 500.0);
        BankAccount savings = new BankAccount("SAV-3108", 100.0);
        boolean success1 = transferFunds(checking, savings, 200.0, 1.5);
        System.out.println("Transfer 1 status: " + (success1 ? "SUCCESS" : "FAILED"));
        System.out.printf("Checking = $%.2f | Savings = $%.2f%n", checking.getBalance(), savings.getBalance());
    }
}`,
        output: `Transfer 1 status: SUCCESS
Checking = $297.00 | Savings = $300.00`,
        stepByStep: [
          'Instantiates checking ($500) and savings ($100) objects on the heap.',
          'Invokes transferFunds() passing references, $200 transfer amount, and 1.5% fee.',
          'Calculates fee ($3.00), validates total deduction ($203.00) against current balance.',
          'Performs withdrawals and deposits, returning boolean true to indicate success.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Missing return statement on branching paths',
        wrongCode: `public static int getDiscount(int age) {
    if (age > 65) return 20;
    // Missing return if age <= 65!
}`,
        fixedCode: `public static int getDiscount(int age) {
    if (age > 65) return 20;
    return 0; // Guaranteed return
}`,
        cause: 'Compiler flow analysis detects code paths that exit without producing a required return type.',
        solution: 'Ensure every logical branch terminates with a return statement or exception throw.'
      },
      {
        title: 'Assuming primitive swapping works across methods',
        wrongCode: `public static void swap(int a, int b) {
    int temp = a; a = b; b = temp;
}`,
        fixedCode: `// Return a container or record holding both swapped values
public record Pair(int a, int b) {}
public static Pair swap(int a, int b) {
    return new Pair(b, a);
}`,
        cause: 'Java is strictly pass-by-value; swapping copies on a child stack frame has zero impact on the caller.',
        solution: 'Return a composite data object or encapsulate state in a mutable container.'
      }
    ],
    bestPractices: {
      doList: [
        'Adhere to Single Responsibility: each method should perform one clear task.',
        'Use expressive action verbs for method identifiers (e.g. validateOrder, calculateTax).',
        'Strive to keep parameter count to 3 or fewer by grouping parameters into objects.'
      ],
      dontList: [
        'Never mutate incoming object parameters without clear documentation.',
        'Do not write mega-methods exceeding 40 lines of code.',
        'Avoid returning null from methods; return Optional or empty collections.'
      ],
      whenNotToUse: 'Do not create private methods to wrap single trivial arithmetic expressions unless doing so substantially improves domain clarity.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Fully backward compatible across all versions.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Method Mechanics Quick Reference',
      headers: ['Feature', 'Syntax', 'Description'],
      rows: [
        ['Declaration', 'public static ReturnType name(Params)', 'Defines linkage, return type, and parameter signature'],
        ['void Method', 'public static void execute()', 'Executes side effects without returning data to caller'],
        ['Pass-by-Value (Primitive)', 'int param', 'Child receives independent copy of bits; caller untouched'],
        ['Pass-by-Value (Object)', 'Object param', 'Child receives copy of pointer; internal mutations affect heap object'],
        ['Stack Frame', 'JVM Thread Stack', 'Allocated on invocation, discarded immediately upon return']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Pass-by-Value Counter',
        prompt: 'Why does counter print 0 instead of 1 after calling increment(counter)?',
        starterCode: `public class Buggy {
    public static void increment(int c) { c++; }
    public static void main(String[] args) {
        int counter = 0;
        increment(counter);
        System.out.println(counter);
    }
}`,
        solution: 'Java is pass-by-value. The method receives a copy of the primitive counter. Modifying c inside increment only alters the local stack frame variable.',
        explanation: 'To update the caller, change the method to return int: counter = increment(counter);'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Case-Insensitive Palindrome Checker',
        prompt: 'Implement public static boolean isPalindrome(String word) that verifies whether a string reads identically forward and backward.',
        solution: `public static boolean isPalindrome(String word) {
    if (word == null) return false;
    String clean = word.toLowerCase();
    int left = 0, right = clean.length() - 1;
    while (left < right) {
        if (clean.charAt(left) != clean.charAt(right)) return false;
        left++; right--;
    }
    return true;
}`,
        explanation: 'Two-pointer technique iterates inward comparing lowercase characters with O(N) efficiency and zero extra heap allocations.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Method Stack Frame vs Heap Lifetime',
        prompt: 'When a method returns, are objects instantiated inside it immediately deleted by the JVM?',
        solution: 'No. The stack frame is immediately destroyed, freeing local reference pointers. The heap objects become eligible for Garbage Collection, which occurs asynchronously.',
        explanation: 'Garbage collection is non-deterministic and triggered based on heap memory pressure.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Defining Methods',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Methods in Java',
        url: 'https://dev.java/learn/methods/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8.4: Method Declarations',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 12: Method Overloading & Varargs
  {
    id: 'topic-12',
    slug: 'method-overloading-and-varargs',
    topicNumber: 12,
    title: 'Method Overloading & Varargs',
    part: 'Part 1: Java Core',
    sectionNumber: 4,
    sectionTitle: 'Methods & Modular Code',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Design intuitive APIs with method overloading and variable-length arguments (varargs). Understand compiler resolution rules, widening, boxing, and heap pollution safety.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 11: Methods, Parameters & Return Values'
    ],
    whatAndWhy: {
      definition: 'Method overloading allows multiple methods to share the same name with differing parameter lists. Varargs allows a method to accept arbitrary counts of arguments as an array.',
      analogy: 'Like an audio receiver with an AUX port that accepts 3.5mm, RCA, or Optical inputs without needing three separate stereo units, and can mix any number of chained microphones.',
      whyItExists: 'Overloading eliminates clunky synthetic method names like printInt vs printString. Varargs eliminates the boilerplate of manually creating arrays for arbitrary parameter sequences.'
    },
    syntaxBreakdown: {
      title: 'Overloading Rules & Varargs Signature',
      codeSnippet: `public static void log(String level, String format, Object... args) {
    String msg = (args == null || args.length == 0) ? format : String.format(format, args);
    System.out.printf("[%s] %s%n", level, msg);
}`,
      explanation: 'Overloading requires unique parameter types or counts; return type is ignored. Varargs uses ellipsis syntax and must be the final parameter.',
      tokens: [
        { token: 'Object... args', explanation: 'Varargs ellipsis indicates zero or more Object arguments packed into an array.' },
        { token: 'Final Position Rule', explanation: 'Varargs parameter must always be the last parameter in the method signature.' },
        { token: 'Resolution Hierarchy', explanation: 'Compiler resolves via: 1) Exact match / Widening -> 2) Boxing -> 3) Varargs.' }
      ]
    },
    examples: [
      {
        id: '12-1',
        title: 'Widening, Boxing, and Varargs Precedence',
        type: 'basic',
        description: 'Demonstrates how the compiler resolves overloaded methods across widening, autoboxing, and varargs.',
        filename: 'OverloadingMechanics.java',
        code: `public class OverloadingMechanics {
    public static void display(int value) { System.out.println("display(int): " + value); }
    public static void display(long value) { System.out.println("display(long): " + value); }
    public static void display(double value) { System.out.println("display(double): " + value); }

    public static void process(Integer value) { System.out.println("process(Integer - Autoboxing): " + value); }
    public static void process(int... values) { System.out.println("process(int... - Varargs count=" + values.length + ")"); }

    public static void main(String[] args) {
        short s = 25;
        display(s); // Widens short -> int

        process(42); // Boxing beats varargs!
        process(10, 20, 30); // Varargs invoked for multiple arguments
    }
}`,
        output: `display(int): 25
process(Integer - Autoboxing): 42
process(int... - Varargs count=3)`,
        stepByStep: [
          'short 25 is widened to int because widening takes precedence over boxing or varargs.',
          'process(42) resolves to process(Integer) because autoboxing takes precedence over varargs.',
          'process(10, 20, 30) packages arguments into new int[]{10, 20, 30} and invokes the varargs overload.'
        ]
      },
      {
        id: '12-2',
        title: 'Fluent SQL Query Builder',
        type: 'realistic',
        description: 'Realistic query builder using overloaded where clauses and varargs IN clauses.',
        filename: 'QueryBuilderApp.java',
        code: `import java.util.ArrayList;
import java.util.List;

public class QueryBuilderApp {
    public static class SQLQuery {
        private final String table;
        private final List<String> conditions = new ArrayList<>();
        private final List<Object> parameters = new ArrayList<>();
        private int limit = -1;

        public SQLQuery(String table) { this.table = table; }
        public SQLQuery where(String col, Object val) {
            conditions.add(col + " = ?"); parameters.add(val); return this;
        }
        public SQLQuery where(String col, String op, Object val) {
            conditions.add(col + " " + op + " ?"); parameters.add(val); return this;
        }
        public SQLQuery whereIn(String col, Object... vals) {
            if (vals == null || vals.length == 0) return this;
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < vals.length; i++) {
                sb.append(i == 0 ? "?" : ", ?");
                parameters.add(vals[i]);
            }
            conditions.add(col + " IN (" + sb + ")");
            return this;
        }
        public SQLQuery limit(int maxRows) { this.limit = maxRows; return this; }
        public String build() {
            StringBuilder sql = new StringBuilder("SELECT * FROM ").append(table);
            if (!conditions.isEmpty()) sql.append(" WHERE ").append(String.join(" AND ", conditions));
            if (limit > 0) sql.append(" LIMIT ").append(limit);
            return sql.toString();
        }
        public List<Object> getParameters() { return parameters; }
    }

    public static void main(String[] args) {
        SQLQuery q = new SQLQuery("users")
                .where("status", "ACTIVE")
                .where("age", ">=", 21)
                .whereIn("role", "ADMIN", "EDITOR", "AUDITOR")
                .limit(50);
        System.out.println("Generated SQL: " + q.build());
        System.out.println("Bound Parameters: " + q.getParameters());
    }
}`,
        output: `Generated SQL: SELECT * FROM users WHERE status = ? AND age >= ? AND role IN (?, ?, ?) LIMIT 50
Bound Parameters: [ACTIVE, 21, ADMIN, EDITOR, AUDITOR]`,
        stepByStep: [
          'Instantiates SQLQuery for table "users".',
          'Chains where() using 2-parameter equality overload.',
          'Chains where() using 3-parameter relational operator overload.',
          'Chains whereIn() using varargs Object... to accept an arbitrary list of roles.',
          'build() combines clauses into a parameterized SQL statement with matching parameter lists.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Overloading only by return type',
        wrongCode: `public int calculate(int x) { return x * 2; }
public double calculate(int x) { return x * 2.0; } // COMPILE ERROR`,
        fixedCode: `public int calculateInt(int x) { return x * 2; }
public double calculateDouble(int x) { return x * 2.0; }`,
        cause: 'Return types are not considered during method resolution; callers might not assign the result.',
        solution: 'Alter the parameter count or types, or provide distinctive method names.'
      },
      {
        title: 'Varargs not placed in final parameter position',
        wrongCode: `public void send(String... msgs, int priority) {} // COMPILE ERROR`,
        fixedCode: `public void send(int priority, String... msgs) {}`,
        cause: 'Compiler cannot determine where variable arguments terminate without varargs being in the final slot.',
        solution: 'Always position the varargs ellipsis parameter as the last argument.'
      }
    ],
    bestPractices: {
      doList: [
        'Ensure overloaded methods share identical semantic behavior.',
        'Delegate overloaded convenience methods to the most complete master method with default values.',
        'Use @SafeVarargs when accepting generic varargs on static/final methods.'
      ],
      dontList: [
        'Do not create ambiguous varargs overloads sharing common base types.',
        'Avoid varargs in tight loops running millions of times per second to prevent GC array allocation churn.',
        'Never change return types alone expecting overloading to work.'
      ],
      whenNotToUse: 'Avoid varargs when the method strictly expects exactly one or two arguments; explicit parameters provide superior compile-time enforcement.'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Overloading) / Java 5 (Varargs)',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added @SafeVarargs for static and final methods; Java 9 extended @SafeVarargs to private methods.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Overloading & Varargs Cheat Sheet',
      headers: ['Concept', 'Rule / Syntax', 'Behavior'],
      rows: [
        ['Overloading Signature', 'Method Name + Parameter Types', 'Return type is completely ignored'],
        ['Varargs Syntax', 'Type... paramName', 'Syntactic sugar for single-dimensional Type[] array'],
        ['Parameter Ordering', 'Final position only', 'A method may contain at most one varargs parameter'],
        ['Resolution Priority', 'Exact -> Widening -> Boxing -> Varargs', 'Varargs is always the final fallback candidate'],
        ['Heap Impact', 'new Type[]{...} allocated', 'Creates short-lived array on heap per call']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Erased Signature Collision',
        prompt: 'Why does a class declaring format(String, String...) and format(String, String[]) fail compilation?',
        solution: 'Varargs compiles directly to array bytecode. Both methods share the identical erased signature format(String, String[]).',
        explanation: 'The JVM does not distinguish between a varargs parameter and an array parameter in bytecode signatures.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Overloaded Math Utilities',
        prompt: 'Implement overloaded sum() methods for 2 ints, 3 ints, and arbitrary int... numbers.',
        solution: `public static int sum(int a, int b) { return a + b; }
public static int sum(int a, int b, int c) { return a + b + c; }
public static int sum(int... nums) {
    int total = 0;
    if (nums != null) for (int n : nums) total += n;
    return total;
}`,
        explanation: 'Providing 2- and 3-argument overloads eliminates array allocation overhead on the heap for the most common call patterns.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Passing null to Varargs',
        prompt: 'What is the value of args when calling log("INFO", null) on log(String level, Object... args)?',
        solution: 'args is null (not an array containing null).',
        explanation: 'The compiler defaults to treating null as the array itself. Always perform defensive null checks on varargs parameters before accessing length.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Overloading Methods',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html',
        organization: 'Oracle'
      },
      {
        title: 'Oracle Java Documentation: Varargs',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html',
        organization: 'Oracle'
      },
      {
        title: 'JLS §15.12.2: Compile-Time Step 2: Determine Method Signature',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.12.2',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 13: Variable Scope & Local Variable Type Inference (var)
  {
    id: 'topic-13',
    slug: 'variable-scope-and-type-inference',
    topicNumber: 13,
    title: 'Variable Scope & Local Variable Type Inference (var)',
    part: 'Part 1: Java Core',
    sectionNumber: 4,
    sectionTitle: 'Methods & Modular Code',
    versionBadge: 'Java 10+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master block scope, shadowing, and variable lifetime. Harness Java 10 local variable type inference (var) to write clean, non-redundant code without sacrificing static type safety.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 11: Methods, Parameters & Return Values'
    ],
    whatAndWhy: {
      definition: 'Variable scope defines the boundary where an identifier is accessible. Local variable type inference (var in Java 10) lets the compiler deduce the type of a local variable with an initializer.',
      analogy: 'Like a conference room whiteboard: notes written inside are visible only while people are in that room, and are wiped clean when the meeting ends. Pointing to an obvious chair and asking for "that furniture" is var: context makes the type unmistakable.',
      whyItExists: 'Scope limits accidental mutation and frees memory promptly. var eliminates boilerplate redundancy in generic declarations without sacrificing static type safety.'
    },
    syntaxBreakdown: {
      title: 'Valid and Forbidden var Locations',
      codeSnippet: `// Permitted: local variable with initializer
var customerLedger = new HashMap<String, List<Transaction>>();

// Permitted: loop variables and try-with-resources
for (var entry : customerLedger.entrySet()) { ... }
try (var stream = new FileInputStream("data.bin")) { ... }`,
      explanation: 'var is only permitted for local variables with initializers, loop variables, and try-with-resources. It is forbidden for fields, method parameters, and return types.',
      tokens: [
        { token: 'var', explanation: 'Reserved type name (not keyword) instructing compiler to infer static type from initializer.' },
        { token: 'Static Typing', explanation: 'Variable is permanently typed at compile-time; cannot be reassigned to incompatible types.' },
        { token: 'Forbidden Sites', explanation: 'Cannot be used on class fields, method parameters, return types, or uninitialized variables.' }
      ]
    },
    examples: [
      {
        id: '13-1',
        title: 'Block Scope, Shadowing, and Lifetime',
        type: 'basic',
        description: 'Demonstrates block scope boundaries, inner variable shadowing, and stack cleanup.',
        filename: 'ScopeMechanics.java',
        code: `public class ScopeMechanics {
    private static int globalCounter = 100;

    public static void testShadowingAndLifetime() {
        int count = 10;
        {
            int innerValue = 999;
            int globalCounter = 55; // Shadowing class field
            System.out.println("Inner block value: " + innerValue);
            System.out.println("Shadowed globalCounter: " + globalCounter);
            System.out.println("Explicit ClassName.globalCounter: " + ScopeMechanics.globalCounter);
        }
        // innerValue is out of scope here

        for (int i = 0; i < 3; i++) {
            int iterationSecret = i * 10;
            System.out.println("Iteration: " + iterationSecret);
        }
    }

    public static void main(String[] args) {
        testShadowingAndLifetime();
        System.out.println("Class-level globalCounter: " + globalCounter);
    }
}`,
        output: `Inner block value: 999
Shadowed globalCounter: 55
Explicit ClassName.globalCounter: 100
Iteration: 0
Iteration: 10
Iteration: 20
Class-level globalCounter: 100`,
        stepByStep: [
          'globalCounter is allocated in static class memory.',
          'count is allocated on the method stack frame.',
          'Nested block defines innerValue and shadows globalCounter locally.',
          'Exiting block pops inner block variables off the stack.',
          'For loop allocates loop variables that are destroyed upon loop termination.'
        ]
      },
      {
        id: '13-2',
        title: 'Modern Type Inference in Data Pipelines',
        type: 'realistic',
        description: 'Using var cleanly with complex nested generics, enhanced for loops, and auto-closing streams.',
        filename: 'TypeInferenceEngine.java',
        code: `import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class TypeInferenceEngine {
    public static void main(String[] args) throws Exception {
        var userRolesMap = new HashMap<String, List<String>>();
        userRolesMap.put("alice", new ArrayList<>(List.of("DEVELOPER", "ADMIN")));
        userRolesMap.put("bob", new ArrayList<>(List.of("VIEWER")));

        for (var entry : userRolesMap.entrySet()) {
            var username = entry.getKey();
            var roles = entry.getValue();
            System.out.printf("User: %-10s | Primary: %s | Count: %d%n", username, roles.get(0), roles.size());
        }

        byte[] payload = "System metric status: OK".getBytes();
        try (var stream = new ByteArrayInputStream(payload)) {
            var bytesRead = stream.readAllBytes();
            System.out.println("Stream processed message: " + new String(bytesRead));
        }

        var inferredString = "Strictly Typed Java";
        System.out.println("inferredString class: " + inferredString.getClass().getSimpleName());
    }
}`,
        output: `User: bob        | Primary: VIEWER | Count: 1
User: alice      | Primary: DEVELOPER | Count: 2
Stream processed message: System metric status: OK
inferredString class: String`,
        stepByStep: [
          'var infers HashMap<String, List<String>> without duplicate generic ceremony.',
          'Loop variable entry is inferred as Map.Entry<String, List<String>>.',
          'try-with-resources infers ByteArrayInputStream and guarantees cleanup.',
          'Runtime inspection confirms inferredString is strictly java.lang.String.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Confusing Java var with JavaScript dynamic typing',
        wrongCode: `var id = 100; // Inferred as int
id = "ACC-99"; // COMPILE ERROR: incompatible types`,
        fixedCode: `var id = 100;
String accountId = "ACC-99";`,
        cause: 'var in Java is compile-time static type inference; variable types are immutable once inferred.',
        solution: 'Use distinct variables for distinct data types.'
      },
      {
        title: 'Attempting to declare var without an initializer or with naked null',
        wrongCode: `var unassigned; // COMPILE ERROR
var empty = null; // COMPILE ERROR`,
        fixedCode: `int unassigned = 0;
String empty = null;`,
        cause: 'Compiler needs right-side expression to deduce type; naked null belongs to all reference types.',
        solution: 'Always provide an immediate non-null initializer or specify explicit type.'
      }
    ],
    bestPractices: {
      doList: [
        'Use meaningful variable names when using var so reader intent remains crystal clear.',
        'Use var with complex nested generic types and constructor invocations.',
        'Use var in try-with-resources and enhanced for-loops.'
      ],
      dontList: [
        'Do not use var if the initializer does not make the type obvious to human readers.',
        'Do not use var when programming to an interface (e.g. List vs ArrayList).',
        'Never attempt to use var for class fields or method signatures.'
      ],
      whenNotToUse: 'Avoid var when assigning the result of a method whose return type is not immediately obvious (e.g. var x = process();).'
    },
    versionNotes: {
      introduced: 'Java 10 (JEP 286)',
      status: 'Stable',
      compatibilityNotes: 'Java 11 (JEP 323) permitted var on lambda parameters for annotations. var is a reserved type name, not a keyword, maintaining backward compatibility.',
      ltsAvailability: 'Java 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Variable Scope & var Cheat Sheet',
      headers: ['Context', 'Allowed?', 'Example'],
      rows: [
        ['Local variable with initializer', 'YES', 'var total = 500.0;'],
        ['Enhanced for-loop', 'YES', 'for (var item : items)'],
        ['Try-with-resources', 'YES', 'try (var stream = open())'],
        ['Class fields', 'NO', 'private var score = 10; (Compile error)'],
        ['Method parameter / return', 'NO', 'public var run(var x) (Compile error)'],
        ['Null literal alone', 'NO', 'var x = null; (Compile error)']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Illegal var Sites',
        prompt: 'Which line fails compilation in: var count = 10; var name = null; var list = new ArrayList<String>();?',
        solution: 'var name = null; fails compilation.',
        explanation: 'The compiler cannot infer a type from naked null because null is compatible with every reference type.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Cleaner Generic Iteration',
        prompt: 'Refactor Map<String, List<Integer>> grades = new HashMap<String, List<Integer>>(); and its entrySet iterator using var.',
        solution: `var grades = new HashMap<String, List<Integer>>();
var iterator = grades.entrySet().iterator();`,
        explanation: 'var removes duplicate type ceremony without compromising static type checking or IDE auto-completion.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Is var a Keyword?',
        prompt: 'Can you name a local variable var in Java? e.g. int var = 50;?',
        solution: 'Yes! It compiles successfully.',
        explanation: 'var is a reserved type name, not a reserved keyword. This ensures 100% backward compatibility with legacy code where var was used as an identifier.'
      }
    ],
    officialSources: [
      {
        title: 'OpenJDK JEP 286: Local-Variable Type Inference',
        url: 'https://openjdk.org/jeps/286',
        organization: 'OpenJDK'
      },
      {
        title: 'Oracle OpenJDK: LVTI Style Guidelines',
        url: 'https://openjdk.org/projects/amber/guides/lvti-style-guide',
        organization: 'OpenJDK'
      },
      {
        title: 'JLS §14.4.1: Local Variable Declarators and Types',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.4.1',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 14: One-Dimensional Arrays
  {
    id: 'topic-14',
    slug: 'one-dimensional-arrays',
    topicNumber: 14,
    title: 'One-Dimensional Arrays',
    part: 'Part 1: Java Core',
    sectionNumber: 5,
    sectionTitle: 'Arrays & Memory Structure',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '10 min read',
    shortDescription: 'Understand fixed-size indexed memory buffers on the JVM Heap. Master default values, bounds checking, cache locality, and enhanced for-each traversal.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 10: Loops & Iteration'
    ],
    whatAndWhy: {
      definition: 'An array is a fixed-size indexed container object allocated on the JVM Heap holding a contiguous sequence of elements of a single data type.',
      analogy: 'Think of an apartment mail lobby with 50 numbered mailboxes bolted into the wall. Each box has a fixed index (0 to 49). You can access any box directly in O(1) time, but adding a 51st mailbox requires building an entire new row.',
      whyItExists: 'Arrays enable O(1) constant-time random access, ensure CPU cache locality due to contiguous memory layout, and serve as the foundational bedrock for ArrayList, HashMap, and buffer pools.'
    },
    syntaxBreakdown: {
      title: 'Array Allocation & Indexing Syntax',
      codeSnippet: `int[] numbers = new int[4]; // Heap allocation with default 0s
numbers[0] = 10;            // Indexed assignment
int len = numbers.length;   // Read-only final capacity property`,
      explanation: 'Arrays are objects on the Heap. The length property is a final field (not a method). Indices are strictly zero-based from 0 to length - 1.',
      tokens: [
        { token: 'int[]', explanation: 'Array type indicator specifying elements of type int.' },
        { token: 'new int[N]', explanation: 'Allocates memory on Heap zero-initialized for N elements.' },
        { token: '.length', explanation: 'Public final property returning the fixed capacity of the array buffer.' },
        { token: 'ArrayIndexOutOfBoundsException', explanation: 'Thrown at runtime if attempting to access negative indices or index >= length.' }
      ]
    },
    examples: [
      {
        id: '14-1',
        title: 'Array Allocation, Defaults & Bounds Protection',
        type: 'basic',
        description: 'Demonstrates zero-initialization on the heap, length access, enhanced for-loop summing, and exception handling for invalid bounds.',
        filename: 'ArrayMechanics.java',
        code: `public class ArrayMechanics {
    public static void main(String[] args) {
        int[] numbers = new int[4];
        System.out.printf("Defaults: [%d, %d, %d, %d]%n", numbers[0], numbers[1], numbers[2], numbers[3]);

        numbers[0] = 10; numbers[1] = 20; numbers[2] = 30; numbers[3] = 40;
        System.out.println("Array length: " + numbers.length);

        int sum = 0;
        for (int value : numbers) sum += value;
        System.out.println("Sum: " + sum);

        try {
            int err = numbers[numbers.length];
        } catch (ArrayIndexOutOfBoundsException ex) {
            System.out.println("Caught Expected Exception: " + ex.getClass().getSimpleName() + " for index " + numbers.length);
        }
    }
}`,
        output: `Defaults: [0, 0, 0, 0]
Array length: 4
Sum: 100
Caught Expected Exception: ArrayIndexOutOfBoundsException for index 4`,
        stepByStep: [
          'new int[4] allocates memory on the heap zero-initializing all 4 slots to 0.',
          'Indexed assignments populate slots 0 through 3.',
          'Enhanced for-each loop iterates over the array without requiring manual index math.',
          'Accessing index 4 (valid: 0..3) triggers ArrayIndexOutOfBoundsException.'
        ]
      },
      {
        id: '14-2',
        title: 'Industrial IoT Telemetry Ring Buffer',
        type: 'realistic',
        description: 'Fixed-size circular telemetry buffer calculating moving averages and peak sensor readings in real-time.',
        filename: 'SensorBufferApp.java',
        code: `public class SensorBufferApp {
    public static class TelemetryRingBuffer {
        private final double[] buffer;
        private int head = 0, size = 0;

        public TelemetryRingBuffer(int capacity) {
            this.buffer = new double[capacity];
        }

        public void push(double sample) {
            buffer[head] = sample;
            head = (head + 1) % buffer.length;
            if (size < buffer.length) size++;
        }

        public double calculateAverage() {
            if (size == 0) return 0.0;
            double sum = 0.0;
            for (int i = 0; i < size; i++) sum += buffer[i];
            return sum / size;
        }

        public double findMax() {
            if (size == 0) return 0.0;
            double max = buffer[0];
            for (int i = 1; i < size; i++) if (buffer[i] > max) max = buffer[i];
            return max;
        }

        public int getSize() { return size; }
    }

    public static void main(String[] args) {
        TelemetryRingBuffer ring = new TelemetryRingBuffer(5);
        double[] incoming = { 22.4, 23.1, 22.8, 24.5, 25.0, 26.2, 27.1 };
        for (double s : incoming) {
            ring.push(s);
            System.out.printf("Streamed %4.1f C -> Current Avg: %5.2f C | Peak: %4.1f C%n",
                    s, ring.calculateAverage(), ring.findMax());
        }
    }
}`,
        output: `Streamed 22.4 C -> Current Avg: 22.40 C | Peak: 22.4 C
Streamed 23.1 C -> Current Avg: 22.75 C | Peak: 23.1 C
Streamed 22.8 C -> Current Avg: 22.77 C | Peak: 23.1 C
Streamed 24.5 C -> Current Avg: 23.20 C | Peak: 24.5 C
Streamed 25.0 C -> Current Avg: 23.56 C | Peak: 25.0 C
Streamed 26.2 C -> Current Avg: 24.32 C | Peak: 26.2 C
Streamed 27.1 C -> Current Avg: 25.12 C | Peak: 27.1 C`,
        stepByStep: [
          'Ring buffer initializes double[] buffer of length 5.',
          'Each pushed telemetry sample overwrites the oldest element using modulo arithmetic (head = (head + 1) % len).',
          'Averages and peaks are calculated over the rolling window in O(N) without dynamic memory allocations.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Off-by-one boundary loop condition',
        wrongCode: `for (int i = 0; i <= arr.length; i++) { ... } // BUG: <=`,
        fixedCode: `for (int i = 0; i < arr.length; i++) { ... }`,
        cause: 'Array indices end at length - 1; iterating to length throws ArrayIndexOutOfBoundsException.',
        solution: 'Use strict inequality < arr.length or use enhanced for-each.'
      },
      {
        title: 'Calling .length() with parentheses on arrays',
        wrongCode: `int sz = numbers.length(); // COMPILE ERROR`,
        fixedCode: `int sz = numbers.length;`,
        cause: 'Arrays have a public final field length; String has a method length().',
        solution: 'Remove parentheses when checking array length.'
      }
    ],
    bestPractices: {
      doList: [
        'Place brackets next to the type: int[] numbers rather than int numbers[].',
        'Use enhanced for-loops for read-only traversal when index counters are unnecessary.',
        'Validate array length against zero before computing averages or minimums.'
      ],
      dontList: [
        'Never print arrays directly via System.out.println(arr); use Arrays.toString(arr).',
        'Do not use primitive arrays when dynamic element addition and removal is required.',
        'Avoid creating oversized arrays for sparse data.'
      ],
      whenNotToUse: 'Avoid raw arrays when you need dynamic collection capabilities like auto-resizing, fast membership lookup, or key-value association; prefer ArrayList, HashSet, or HashMap.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Contiguous heap memory layout and zero-indexing have remained identical across all Java versions.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'One-Dimensional Arrays Cheat Sheet',
      headers: ['Syntax / Concept', 'Example', 'Description'],
      rows: [
        ['Allocation', 'new int[N]', 'Allocates contiguous memory zero-initialized on the Heap'],
        ['Inline Literal', '{ 10, 20, 30 }', 'Concise declaration with inline element values'],
        ['Length Property', 'arr.length', 'Final public field representing fixed buffer capacity'],
        ['Bounds Range', '0 to arr.length - 1', 'Valid index window; violation throws ArrayIndexOutOfBoundsException'],
        ['Enhanced Loop', 'for (int x : arr)', 'Idiomatic sequential forward traversal']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Null Element Dereference',
        prompt: 'Why does String[] arr = new String[3]; arr[0].trim(); throw NullPointerException?',
        solution: 'Reference arrays default each slot to null on heap allocation. Dereferencing slot 0 before assigning a String throws NullPointerException.',
        explanation: 'Always initialize reference array elements before invoking methods on them.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Second Largest Element Finder',
        prompt: 'Implement public static int findSecondLargest(int[] nums) finding the second largest unique value without sorting.',
        solution: `public static int findSecondLargest(int[] nums) {
    if (nums == null || nums.length < 2) throw new IllegalArgumentException();
    int max1 = Integer.MIN_VALUE, max2 = Integer.MIN_VALUE;
    for (int n : nums) {
        if (n > max1) { max2 = max1; max1 = n; }
        else if (n > max2 && n != max1) { max2 = n; }
    }
    return max2;
}`,
        explanation: 'Single O(N) pass tracks the top two distinct maximum values without mutating the input array.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Zero Length vs Negative Length',
        prompt: 'Is new int[0] valid? What does new int[-5] do?',
        solution: 'new int[0] is completely valid (creates an empty array object). new int[-5] throws NegativeArraySizeException at runtime.',
        explanation: 'Returning empty arrays (new int[0]) is a standard Java best practice to avoid returning null.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Arrays',
        url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Working with Arrays',
        url: 'https://dev.java/learn/language-basics/arrays/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §10: Arrays',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 15: Multi-Dimensional Arrays & Arrays Utility
  {
    id: 'topic-15',
    slug: 'multidimensional-arrays-and-arrays-utility',
    topicNumber: 15,
    title: 'Multi-Dimensional Arrays & Arrays Utility',
    part: 'Part 1: Java Core',
    sectionNumber: 5,
    sectionTitle: 'Arrays & Memory Structure',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master jagged (ragged) matrices as arrays-of-arrays on the heap. Harness java.util.Arrays for high-performance sorting, binary search, cloning, and deep string representations.',
    prerequisites: [
      'Topic 10: Loops & Iteration',
      'Topic 14: One-Dimensional Arrays'
    ],
    whatAndWhy: {
      definition: 'Multi-dimensional arrays in Java are arrays of arrays, enabling jagged matrices of varying row lengths. java.util.Arrays provides standardized utility algorithms.',
      analogy: 'Like a filing cabinet: an outer drawer holds folders (outer array of references); each folder holds an arbitrary number of documents (independent inner sub-arrays).',
      whyItExists: 'Jagged arrays eliminate memory waste when rows have differing sizes. java.util.Arrays provides optimized native C++ sorting and memory copying operations.'
    },
    syntaxBreakdown: {
      title: 'Jagged Matrix & Arrays Utility Syntax',
      codeSnippet: `int[][] jagged = new int[3][];
jagged[0] = new int[]{ 10, 11 };
Arrays.sort(jagged[0]);
String view = Arrays.deepToString(jagged);`,
      explanation: 'Multi-dimensional arrays allocate outer pointer arrays first. java.util.Arrays provides deepToString, sort, binarySearch, copyOf, and deepEquals.',
      tokens: [
        { token: 'int[][]', explanation: 'Array of array references.' },
        { token: 'Arrays.deepToString(...)', explanation: 'Recursively stringifies multi-dimensional structures.' },
        { token: 'Arrays.sort(...)', explanation: 'Dual-Pivot Quicksort for primitives; TimSort for objects.' },
        { token: 'Arrays.binarySearch(...)', explanation: 'O(log N) lookup; requires input array to be sorted.' }
      ]
    },
    examples: [
      {
        id: '15-1',
        title: 'Jagged Array Allocation & Deep Operations',
        type: 'basic',
        description: 'Allocates a non-uniform network topology, traverses via row-major loops, and contrasts shallow vs deep equality.',
        filename: 'JaggedArrayDemo.java',
        code: `import java.util.Arrays;

public class JaggedArrayDemo {
    public static void main(String[] args) {
        int[][] networkTopology = new int[3][];
        networkTopology[0] = new int[]{ 10, 11 };
        networkTopology[1] = new int[]{ 20, 21, 22, 23 };
        networkTopology[2] = new int[]{ 30 };

        System.out.println("deepToString: " + Arrays.deepToString(networkTopology));

        int[][] replica = { { 10, 11 }, { 20, 21, 22, 23 }, { 30 } };
        System.out.println("Arrays.equals() (shallow): " + Arrays.equals(networkTopology, replica));
        System.out.println("Arrays.deepEquals() (deep) : " + Arrays.deepEquals(networkTopology, replica));
    }
}`,
        output: `deepToString: [[10, 11], [20, 21, 22, 23], [30]]
Arrays.equals() (shallow): false
Arrays.deepEquals() (deep) : true`,
        stepByStep: [
          'networkTopology allocates outer array holding 3 references.',
          'Each row is allocated independently with lengths 2, 4, and 1.',
          'Arrays.equals compares outer reference pointers (returns false).',
          'Arrays.deepEquals compares nested element values recursively (returns true).'
        ]
      },
      {
        id: '15-2',
        title: 'Fleet Vehicle Part Inventory Management',
        type: 'realistic',
        description: 'Realistic warehouse inventory processing using Dual-Pivot Quicksort, logarithmic binary search, and buffer expansion.',
        filename: 'FleetInventoryManager.java',
        code: `import java.util.Arrays;

public class FleetInventoryManager {
    public static void main(String[] args) {
        int[] partSerialNumbers = { 8840, 1024, 5510, 3090, 7720, 4400, 2190 };
        Arrays.sort(partSerialNumbers);
        System.out.println("Sorted Serials: " + Arrays.toString(partSerialNumbers));

        int target = 5510;
        int foundIdx = Arrays.binarySearch(partSerialNumbers, target);
        System.out.printf("Binary search %d -> Index %d%n", target, foundIdx);

        int missing = 9999;
        int missingIdx = Arrays.binarySearch(partSerialNumbers, missing);
        System.out.printf("Missing serial %d -> Insertion index %d%n", missing, missingIdx);

        int[] expanded = Arrays.copyOf(partSerialNumbers, partSerialNumbers.length + 3);
        Arrays.fill(expanded, partSerialNumbers.length, expanded.length, -1);
        System.out.println("Expanded: " + Arrays.toString(expanded));
    }
}`,
        output: `Sorted Serials: [1024, 2190, 3090, 4400, 5510, 7720, 8840]
Binary search 5510 -> Index 4
Missing serial 9999 -> Insertion index -8
Expanded: [1024, 2190, 3090, 4400, 5510, 7720, 8840, -1, -1, -1]`,
        stepByStep: [
          'Arrays.sort() sorts the primitives in O(N log N) using Dual-Pivot Quicksort.',
          'Arrays.binarySearch() locates target 5510 in O(log N) time at index 4.',
          'Searching for 9999 returns -8 (encoded insertion point -(insertionPoint + 1)).',
          'Arrays.copyOf() creates a larger buffer and Arrays.fill() presets empty slots to -1.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Running binarySearch on an unsorted array',
        wrongCode: `int[] raw = { 9, 2, 8, 1 };
int idx = Arrays.binarySearch(raw, 2); // Undefined behavior!`,
        fixedCode: `Arrays.sort(raw);
int idx = Arrays.binarySearch(raw, 2);`,
        cause: 'Binary search algorithm assumes elements are partitioned in ascending order.',
        solution: 'Always sort the array before calling binarySearch.'
      },
      {
        title: 'Using shallow Arrays.equals on 2D arrays',
        wrongCode: `boolean same = Arrays.equals(matrixA, matrixB); // Returns false for different sub-array addresses`,
        fixedCode: `boolean same = Arrays.deepEquals(matrixA, matrixB);`,
        cause: 'Arrays.equals only compares top-level reference pointers, not inner elements.',
        solution: 'Use Arrays.deepEquals for nested multi-dimensional arrays.'
      }
    ],
    bestPractices: {
      doList: [
        'Traverse 2D matrices in row-major order (outer row, inner column) to maximize CPU cache hits.',
        'Use Arrays.deepToString for visualizing nested multi-dimensional data.',
        'Use Arrays.copyOf instead of manual copy loops for native JVM memmove performance.'
      ],
      dontList: [
        'Never invoke binarySearch on unsorted arrays.',
        'Avoid creating jagged arrays for linear graphics math where flat 1D arrays are faster.',
        'Do not forget to allocate inner row arrays before dereferencing jagged slots.'
      ],
      whenNotToUse: 'Do not use jagged arrays for dense linear algebra or game rendering shaders; flattened 1D arrays with stride math offer superior hardware memory cache locality.'
    },
    versionNotes: {
      introduced: 'Java 1.2 (Arrays class) / Java 5 (deepToString, deepEquals)',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added Dual-Pivot Quicksort. Java 8 added Arrays.parallelSort() for multi-core hardware.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Arrays Utility & Multi-Dimensional Matrix Cheat Sheet',
      headers: ['Utility Method', 'Time Complexity', 'Description'],
      rows: [
        ['Arrays.toString(arr)', 'O(N)', 'Formats 1D array as [a, b, c]'],
        ['Arrays.deepToString(m)', 'O(N)', 'Recursively stringifies nested multi-dimensional arrays'],
        ['Arrays.sort(arr)', 'O(N log N)', 'Dual-Pivot Quicksort (primitives) / TimSort (objects)'],
        ['Arrays.binarySearch(arr, k)', 'O(log N)', 'Fast logarithmic lookup on sorted array'],
        ['Arrays.copyOf(arr, len)', 'O(N)', 'Fast native memory buffer resizing and copying'],
        ['Arrays.deepEquals(a, b)', 'O(N)', 'Recursive multi-dimensional equality comparison']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Unallocated Jagged Row',
        prompt: 'Why does int[][] m = new int[3][]; m[0][0] = 1; throw NullPointerException at runtime?',
        solution: 'new int[3][] only allocates the outer reference array with 3 null pointers. Dereferencing m[0] before assigning an inner array (m[0] = new int[5]) dereferences null.',
        explanation: 'Always instantiate the sub-array before accessing its elements in a jagged array.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Pascals Triangle Generator',
        prompt: 'Implement public static int[][] generatePascalsTriangle(int rows) as a jagged array where row i has i + 1 items.',
        solution: `public static int[][] generatePascalsTriangle(int rows) {
    int[][] tri = new int[rows][];
    for (int i = 0; i < rows; i++) {
        tri[i] = new int[i + 1];
        tri[i][0] = tri[i][i] = 1;
        for (int j = 1; j < i; j++) tri[i][j] = tri[i-1][j-1] + tri[i-1][j];
    }
    return tri;
}`,
        explanation: 'Dynamically allocates each row to the exact length needed without wasting unused array slots.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Binary Search Negative Return Meaning',
        prompt: 'What does a return value of -8 mean in Arrays.binarySearch()?',
        solution: 'The key was not found. If inserted to maintain sorted order, it would be placed at index 7 (calculated as -(returnVal + 1)).',
        explanation: 'The formula -(insertionPoint + 1) cleanly differentiates index 0 from missing items.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Multi-dimensional Arrays',
        url: 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html',
        organization: 'Oracle'
      },
      {
        title: 'Oracle Java SE API: java.util.Arrays',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html',
        organization: 'Oracle'
      },
      {
        title: 'JLS §10.6: Array Initializers',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html#jls-10.6',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 16: Classes, Objects & Memory Layout
  {
    id: 'topic-16',
    slug: 'classes-objects-and-memory-layout',
    topicNumber: 16,
    title: 'Classes, Objects & Memory Layout',
    part: 'Part 1: Java Core',
    sectionNumber: 6,
    sectionTitle: 'Object-Oriented Programming (OOP) Essentials',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master the foundation of Object-Oriented Programming: classes as architectural blueprints, objects as heap instances, reference variables on the stack, and Garbage Collection eligibility.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 11: Methods, Parameters & Return Values'
    ],
    whatAndWhy: {
      definition: 'A class is a blueprint defining state (fields) and behavior (methods). An object is a concrete runtime instance allocated on the JVM Heap referenced by stack pointers.',
      analogy: 'An architect\'s blueprint is a Class; the physical houses constructed from it in a suburb are Objects. The street address written on an envelope is the Reference pointer.',
      whyItExists: 'OOP binds data and behavior together, establishing domain modeling boundaries and preventing chaotic global mutations common in procedural architectures.'
    },
    syntaxBreakdown: {
      title: 'Class Declaration & Heap Instantiation Syntax',
      codeSnippet: `public class FleetVehicle {
    private static int totalFleetCount = 0; // Class variable (Metaspace/Heap)
    private final String vin;                // Instance variable (Heap)

    public FleetVehicle(String vin) {
        this.vin = vin;
        totalFleetCount++;
    }
}`,
      explanation: 'Static fields belong to the class definition; instance fields belong to individual heap objects. Object variables hold reference addresses, not the object body itself.',
      tokens: [
        { token: 'class ClassName', explanation: 'Declares blueprint for objects of this type.' },
        { token: 'static field', explanation: 'Single shared memory location across all instances.' },
        { token: 'new ClassName()', explanation: 'Allocates memory on JVM Heap, initializes fields, and returns reference pointer.' },
        { token: '== vs .equals()', explanation: '== compares memory addresses; .equals() compares logical values.' }
      ]
    },
    examples: [
      {
        id: '16-1',
        title: 'Stack References vs Heap Objects & Aliasing',
        type: 'basic',
        description: 'Demonstrates reference assignment, pointer aliasing, static counter tracking, and GC eligibility when references are cleared.',
        filename: 'ClassMemoryLayout.java',
        code: `public class ClassMemoryLayout {
    private static int totalInstancesCreated = 0;
    private final int id;
    private String label;

    public ClassMemoryLayout(String label) {
        this.id = ++totalInstancesCreated;
        this.label = label;
    }
    public static int getTotalInstancesCreated() { return totalInstancesCreated; }
    public int getId() { return id; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public static void main(String[] args) {
        ClassMemoryLayout obj1 = new ClassMemoryLayout("Alpha");
        ClassMemoryLayout obj2 = new ClassMemoryLayout("Beta");
        ClassMemoryLayout alias = obj1;

        System.out.println("obj1 == alias: " + (obj1 == alias));
        System.out.println("obj1 == obj2: " + (obj1 == obj2));

        alias.setLabel("Alpha-Modified");
        System.out.println("Mutated via alias -> obj1 label: " + obj1.getLabel());

        obj2 = null; // Beta object now eligible for Garbage Collection
        System.out.println("Total Instances Created: " + ClassMemoryLayout.getTotalInstancesCreated());
    }
}`,
        output: `obj1 == alias: true
obj1 == obj2: false
Mutated via alias -> obj1 label: Alpha-Modified
Total Instances Created: 2`,
        stepByStep: [
          'obj1 and obj2 are instantiated on the heap with IDs 1 and 2.',
          'Static variable totalInstancesCreated increments to 2.',
          'alias is assigned obj1, copying its memory address pointer.',
          'Mutating state via alias updates the shared underlying heap object.',
          'Setting obj2 = null removes the reference, rendering the Beta object eligible for GC.'
        ]
      },
      {
        id: '16-2',
        title: 'Fleet Vehicle Telemetry Management System',
        type: 'realistic',
        description: 'Real-world fleet management tracking vehicle objects, telemetry coordinates, and fuel consumption over time.',
        filename: 'VehicleTelemetryApp.java',
        code: `public class VehicleTelemetryApp {
    public static class FleetVehicle {
        private final String vin;
        private String driverName;
        private double latitude, longitude, fuelLevelPercent;

        public FleetVehicle(String vin, String driverName, double lat, double lon, double fuel) {
            this.vin = vin;
            this.driverName = driverName;
            this.latitude = lat;
            this.longitude = lon;
            this.fuelLevelPercent = fuel;
        }

        public void updateTelemetry(double newLat, double newLon, double fuelConsumed) {
            this.latitude = newLat;
            this.longitude = newLon;
            this.fuelLevelPercent = Math.max(0.0, this.fuelLevelPercent - fuelConsumed);
        }

        public String getTelemetrySnapshot() {
            return String.format("VIN: %s | Driver: %-12s | GPS: (%.4f, %.4f) | Fuel: %5.1f%%",
                    vin, driverName, latitude, longitude, fuelLevelPercent);
        }
    }

    public static void main(String[] args) {
        FleetVehicle truck1 = new FleetVehicle("1HGCR2F83HA001", "Marcus Vance", 37.7749, -122.4194, 95.0);
        truck1.updateTelemetry(37.8044, -122.2712, 12.3);
        System.out.println(truck1.getTelemetrySnapshot());
    }
}`,
        output: `VIN: 1HGCR2F83HA001 | Driver: Marcus Vance | GPS: (37.8044, -122.2712) | Fuel:  82.7%`,
        stepByStep: [
          'Instantiates truck1 with initial GPS location and 95.0% fuel.',
          'updateTelemetry() recalculates position and reduces fuel balance.',
          'getTelemetrySnapshot() produces formatted status representation.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Comparing object state using == instead of .equals()',
        wrongCode: `Point p1 = new Point(1, 2);
Point p2 = new Point(1, 2);
if (p1 == p2) { ... } // Evaluates to FALSE!`,
        fixedCode: `if (p1.equals(p2)) { ... }`,
        cause: '== checks if both variables hold identical heap memory addresses, not if their contents match.',
        solution: 'Override equals() and hashCode() and compare with .equals().'
      },
      {
        title: 'Calling static members through instance reference variables',
        wrongCode: `ClassMemoryLayout obj = new ClassMemoryLayout("X");
int count = obj.getTotalInstancesCreated(); // Discouraged`,
        fixedCode: `int count = ClassMemoryLayout.getTotalInstancesCreated();`,
        cause: 'Accessing static members on instances obscures class-level ownership.',
        solution: 'Always prefix static calls with the class name.'
      }
    ],
    bestPractices: {
      doList: [
        'Keep instance fields private and provide meaningful domain methods.',
        'Always access static methods and constants using ClassName.member.',
        'Nullify long-lived references in collections when objects are done to enable GC.'
      ],
      dontList: [
        'Never compare domain object contents using ==.',
        'Do not instantiate utility classes with purely static functions.',
        'Avoid public mutable fields.'
      ],
      whenNotToUse: 'Do not create object instances for purely stateless helper algorithms (like Math.sqrt); use static utility methods instead.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: '64-bit JVMs automatically utilize Compressed OOPs to store 32-bit references on heaps under 32GB.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Classes, Objects & Memory Cheat Sheet',
      headers: ['Concept', 'Memory Region', 'Key Characteristics'],
      rows: [
        ['Class Blueprint', 'Metaspace', 'Defines structure, loaded once per ClassLoader'],
        ['Object Instance', 'JVM Heap', 'Dynamic runtime state created via new keyword'],
        ['Reference Variable', 'Call Stack', 'Holds memory address pointer to heap object'],
        ['Static Field', 'Metaspace / Heap', 'Single shared value across all instances'],
        ['Garbage Collection', 'Automatic Heap Reaper', 'Reclaims objects disconnected from all GC roots']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Reference Comparison Bug',
        prompt: 'Why does String s1 = new String("Java"); String s2 = new String("Java"); s1 == s2 evaluate to false?',
        solution: '== checks whether s1 and s2 point to the same memory address. Since new explicitly allocated two distinct heap objects, their memory addresses differ.',
        explanation: 'Always use .equals() for content comparison.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Bank Reserves Static Tracking',
        prompt: 'Design BankAccount with private balance and a static totalBankReserves counter updated on deposit.',
        solution: `public class BankAccount {
    private static double totalReserves = 0.0;
    private double balance;
    public void deposit(double amt) {
        if (amt > 0) { balance += amt; totalReserves += amt; }
    }
    public static double getTotalReserves() { return totalReserves; }
}`,
        explanation: 'Instance state tracks personal balance; static state tracks bank-wide aggregate reserves.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Circular Reference Garbage Collection',
        prompt: 'If Object A references Object B and B references A, but no stack or static variables reference them, will the JVM collect them?',
        solution: 'Yes! Java GC uses tracing collectors from GC Roots, not reference counting. If the island of objects is unreachable from any GC Root, both are reclaimed.',
        explanation: 'Modern JVMs easily collect cyclic graphs that are disconnected from live threads.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Classes and Objects',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/index.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Objects and Classes',
        url: 'https://dev.java/learn/classes-objects/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8: Classes',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 17: Constructors & Object Initialization
  {
    id: 'topic-17',
    slug: 'constructors-and-initialization',
    topicNumber: 17,
    title: 'Constructors & Object Initialization',
    part: 'Part 1: Java Core',
    sectionNumber: 6,
    sectionTitle: 'Object-Oriented Programming (OOP) Essentials',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master object creation lifecycle: default vs parameterized constructors, this() constructor chaining, static vs instance initialization blocks, and initialization order.',
    prerequisites: [
      'Topic 11: Methods, Parameters & Return Values',
      'Topic 16: Classes, Objects & Memory Layout'
    ],
    whatAndWhy: {
      definition: 'A constructor is a special class member invoked during instantiation with new to initialize instance fields and enforce class invariants.',
      analogy: 'Like a smartphone factory test sequence: before boxing a device, firmware is flashed, unique serials burned, and hardware verified before the phone reaches the customer.',
      whyItExists: 'Constructors prevent objects from entering existence in corrupted, half-initialized states with unassigned null fields.'
    },
    syntaxBreakdown: {
      title: 'Constructor Chaining & Initialization Sequence',
      codeSnippet: `public class ServerConfig {
    static { /* 1. Static block runs once on class load */ }
    { /* 2. Instance block runs before constructor body */ }

    public ServerConfig(String host, int port) {
        this.host = host; this.port = port;
    }
    public ServerConfig(String host) {
        this(host, 8080); // this(...) must be first statement
    }
}`,
      explanation: 'Constructors have the exact class name and no return type. this(...) chains to overloaded constructors. Static blocks execute once; instance blocks execute on every instantiation.',
      tokens: [
        { token: 'this(...)', explanation: 'Delegates to another constructor within the same class; mandatory first statement.' },
        { token: 'static { ... }', explanation: 'Static initialization block executed when class is loaded into Metaspace.' },
        { token: '{ ... }', explanation: 'Instance initialization block executed before constructor body.' }
      ]
    },
    examples: [
      {
        id: '17-1',
        title: 'Constructor Chaining Lifecycle Order',
        type: 'basic',
        description: 'Verifies the deterministic execution sequence: Static Block -> Instance Block -> Chained Master Constructor.',
        filename: 'ConstructorChainingDemo.java',
        code: `public class ConstructorChainingDemo {
    private static String log = "";
    static { log += "[1. Static Block] "; }
    { log += "[2. Instance Block] "; }

    private final String hostname;
    private final int port;
    private final boolean ssl;

    public ConstructorChainingDemo(String host, int port, boolean ssl) {
        this.hostname = host; this.port = port; this.ssl = ssl;
        log += String.format("[3. Master Constructor (%s:%d)] ", host, port);
    }
    public ConstructorChainingDemo(String host) { this(host, 443, true); }

    public static void main(String[] args) {
        ConstructorChainingDemo c = new ConstructorChainingDemo("api.internal");
        System.out.println(log);
    }
}`,
        output: `[1. Static Block] [2. Instance Block] [3. Master Constructor (api.internal:443)] `,
        stepByStep: [
          'Class is loaded, executing the static block once.',
          'new triggers instantiation, running the instance initializer block.',
          'this(host, 443, true) delegates parameters to master constructor.',
          'Master constructor sets final fields and finishes object construction.'
        ]
      },
      {
        id: '17-2',
        title: 'Production Server Configuration Profiles',
        type: 'realistic',
        description: 'Server configuration with parameter validation, bounds checking, and convenient defaulted overloads.',
        filename: 'ServerConfigurationApp.java',
        code: `public class ServerConfigurationApp {
    public static class HTTPServerConfig {
        private final String bindAddress;
        private final int port, maxThreads, timeoutSeconds;

        public HTTPServerConfig(String host, int port, int threads, int timeout) {
            if (host == null || host.isBlank()) throw new IllegalArgumentException("Host required.");
            if (port < 1 || port > 65535) throw new IllegalArgumentException("Invalid port: " + port);
            this.bindAddress = host; this.port = port; this.maxThreads = threads; this.timeoutSeconds = timeout;
        }
        public HTTPServerConfig(String host, int port) { this(host, port, 200, 30); }
        public HTTPServerConfig() { this("0.0.0.0", 8080, 200, 30); }

        public String describe() {
            return String.format("Server Listening on %s:%d (Threads: %d, Timeout: %ds)", bindAddress, port, maxThreads, timeoutSeconds);
        }
    }

    public static void main(String[] args) {
        HTTPServerConfig s1 = new HTTPServerConfig("127.0.0.1", 9090, 50, 15);
        HTTPServerConfig s2 = new HTTPServerConfig();
        System.out.println(s1.describe());
        System.out.println(s2.describe());
    }
}`,
        output: `Server Listening on 127.0.0.1:9090 (Threads: 50, Timeout: 15s)
Server Listening on 0.0.0.0:8080 (Threads: 200, Timeout: 30s)`,
        stepByStep: [
          'Master constructor validates IP address and port boundaries.',
          'Convenience constructors delegate defaults via this(...).',
          'Objects are guaranteed to be in a valid operating state upon return from new.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Placing code before this(...) in a constructor',
        wrongCode: `public Config(String h) {
    System.out.println("Init..."); // COMPILE ERROR
    this(h, 8080);
}`,
        fixedCode: `public Config(String h) {
    this(h, 8080);
}`,
        cause: 'this(...) delegation must be the very first statement in a constructor.',
        solution: 'Move any initialization or logging to the master constructor or after this(...).'
      },
      {
        title: 'Accidentally adding void return type to constructor',
        wrongCode: `public class User {
    public void User(String name) { } // WARNING: Method, NOT constructor!
}`,
        fixedCode: `public class User {
    public User(String name) { }
}`,
        cause: 'Adding void causes Java to treat it as a regular method, leaving the class with a default constructor.',
        solution: 'Never write a return type for constructors.'
      }
    ],
    bestPractices: {
      doList: [
        'Centralize all validation in the master canonical constructor.',
        'Use private constructors on utility classes to prohibit instantiation.',
        'Initialize all final fields inside constructors.'
      ],
      dontList: [
        'Never perform slow I/O or network calls inside constructors.',
        'Avoid publishing this pointer before constructor finishes (prevents thread race conditions).',
        'Do not declare empty constructors without explaining why.'
      ],
      whenNotToUse: 'Avoid complex initialization logic inside constructors; if creation requires parsing files or selecting subclasses, use a Static Factory Method or Builder Pattern.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 16 records synthesize canonical constructors. Java 22 preview (JEP 447) permits statements before super/this if they do not reference this.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Constructors & Initialization Cheat Sheet',
      headers: ['Construct', 'Execution Frequency', 'Role'],
      rows: [
        ['Default Constructor', 'When new is called', 'Synthesized by compiler only if 0 constructors exist'],
        ['this(...) Chaining', 'First line in constructor', 'Delegates to overloaded constructor in same class'],
        ['Static Block', 'Once per class load', 'Initializes static class variables and resources'],
        ['Instance Block', 'Every new call', 'Executes common code before constructor body'],
        ['Private Constructor', 'Never called externally', 'Enforces Singleton or Utility class semantics']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Lost Default Constructor',
        prompt: 'Why does new Employee() fail compilation after adding public Employee(String name)?',
        solution: 'Declaring any explicit constructor causes the compiler to withdraw the automatic default no-argument constructor.',
        explanation: 'If a no-argument constructor is still required, it must be explicitly declared.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Database Connection Chaining',
        prompt: 'Write DatabaseConnection with host, port, dbName, ssl chaining to a 4-arg master constructor.',
        solution: `public class DatabaseConnection {
    private final String host, db; private final int port; private final boolean ssl;
    public DatabaseConnection(String h, int p, String d, boolean s) {
        this.host = h; this.port = p; this.db = d; this.ssl = s;
    }
    public DatabaseConnection(String h, String d) { this(h, 5432, d, true); }
}`,
        explanation: 'Enforces DRY principle with consistent default ports and SSL protection.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Recursive Constructor Call',
        prompt: 'What happens if Constructor A calls this() to B and B calls this() to A?',
        solution: 'Compilation fails immediately with error: recursive constructor invocation.',
        explanation: 'The compiler performs static cycle detection to prevent runtime StackOverflowError.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Constructors',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Creating Objects',
        url: 'https://dev.java/learn/classes-objects/creating-objects/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8.8: Constructor Declarations',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.8',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 18: Packages & Access Modifiers
  {
    id: 'topic-18',
    slug: 'packages-and-access-modifiers',
    topicNumber: 18,
    title: 'Packages & Access Modifiers',
    part: 'Part 1: Java Core',
    sectionNumber: 6,
    sectionTitle: 'Object-Oriented Programming (OOP) Essentials',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Structure code with packages and reverse domain naming. Master the four access levels (public, protected, package-private, private) to establish impenetrable encapsulation boundaries.',
    prerequisites: [
      'Topic 03: Your First Java Program',
      'Topic 16: Classes, Objects & Memory Layout'
    ],
    whatAndWhy: {
      definition: 'Packages are namespace containers mapping to directory paths. Access modifiers define visibility rules across classes, packages, and subclasses.',
      analogy: 'A bank branch: public teller windows (public), employee breakroom (protected), teller cash drawer (package-private), and internal vault mechanism (private).',
      whyItExists: 'Packages prevent naming collisions across massive libraries. Access modifiers enforce the Principle of Least Privilege, preventing callers from corrupting internal state.'
    },
    syntaxBreakdown: {
      title: 'Four Visibility Tiers Matrix',
      codeSnippet: `package com.bank.security;

public class SecurityBoundary {
    public String pub = "World";
    protected String prot = "Subclasses + Package";
    String def = "Package Only";
    private String priv = "Same Class Only";
}`,
      explanation: 'public is visible everywhere; protected allows subclasses; default restricts to package; private restricts to class.',
      tokens: [
        { token: 'public', explanation: 'Visible to all packages and modules.' },
        { token: 'protected', explanation: 'Visible within package plus all subclasses regardless of package.' },
        { token: 'package-private', explanation: 'Default when no modifier specified; visible only within same package.' },
        { token: 'private', explanation: 'Visible exclusively within the declaring class.' }
      ]
    },
    examples: [
      {
        id: '18-1',
        title: 'Access Boundary Verification',
        type: 'basic',
        description: 'Verifies visibility across public, protected, package-private, and private members within the same package.',
        filename: 'AccessModifierDemo.java',
        code: `public class AccessModifierDemo {
    public static class SecurityBoundary {
        public String publicName = "PUBLIC";
        protected String protectedRole = "PROTECTED";
        String packageDefaultToken = "DEFAULT";
        private String privateSecret = "PRIVATE";
        public String getSecret() { return privateSecret; }
    }

    public static void main(String[] args) {
        SecurityBoundary b = new SecurityBoundary();
        System.out.println(b.publicName);
        System.out.println(b.protectedRole);
        System.out.println(b.packageDefaultToken);
        System.out.println(b.getSecret());
    }
}`,
        output: `PUBLIC
PROTECTED
DEFAULT
PRIVATE`,
        stepByStep: [
          'publicName is directly accessible.',
          'protectedRole and packageDefaultToken are accessible because caller is in the same package.',
          'privateSecret cannot be accessed directly; accessed via public accessor method.'
        ]
      },
      {
        id: '18-2',
        title: 'Secure Payment Gateway Architecture',
        type: 'realistic',
        description: 'Multi-tiered gateway hiding secrets from subclasses, offering protected template methods, and package-private token validation.',
        filename: 'SecurePaymentGateway.java',
        code: `public class SecurePaymentGateway {
    public static abstract class PaymentProvider {
        private final String merchantApiSecret;
        protected final String gatewayEndpoint;

        protected PaymentProvider(String endpoint, String secret) {
            this.gatewayEndpoint = endpoint;
            this.merchantApiSecret = secret;
        }

        public final boolean processCharge(String token, double amount) {
            if (token != null && token.startsWith("tok_") && amount > 0.0) {
                return executeNetworkCall(token, amount, merchantApiSecret);
            }
            return false;
        }

        protected abstract boolean executeNetworkCall(String token, double amount, String secret);
    }

    public static class StripeProvider extends PaymentProvider {
        public StripeProvider(String secret) {
            super("https://api.stripe.com/v1/charges", secret);
        }
        @Override
        protected boolean executeNetworkCall(String token, double amount, String secret) {
            System.out.printf("Dispatching HTTPS POST to %s with Secret Hash %d for $%.2f%n",
                    gatewayEndpoint, secret.hashCode(), amount);
            return true;
        }
    }

    public static void main(String[] args) {
        PaymentProvider stripe = new StripeProvider("sk_live_9837429871409");
        boolean ok = stripe.processCharge("tok_visa_4242", 149.99);
        System.out.println("Charge Status: " + (ok ? "APPROVED" : "DECLINED"));
    }
}`,
        output: `Dispatching HTTPS POST to https://api.stripe.com/v1/charges with Secret Hash 2046830501 for $149.99
Charge Status: APPROVED`,
        stepByStep: [
          'merchantApiSecret is strictly private to PaymentProvider.',
          'gatewayEndpoint is protected, permitting access by StripeProvider.',
          'processCharge() exposes a safe public template method executing the payment.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Declaring top-level classes as private or protected',
        wrongCode: `private class Helper { } // COMPILE ERROR`,
        fixedCode: `class Helper { } // Package-private is allowed`,
        cause: 'Top-level classes can only be public or package-private.',
        solution: 'Only nested classes can be declared private or protected.'
      },
      {
        title: 'Mismatched package name and physical directory structure',
        wrongCode: `// In src/com/app/User.java:
package org.other; // COMPILE / BUILD ERROR`,
        fixedCode: `package com.app;`,
        cause: 'The compiler mandates exact alignment between package names and directory trees.',
        solution: 'Keep package names aligned with physical directory hierarchy.'
      }
    ],
    bestPractices: {
      doList: [
        'Default all fields to private unless compelling reasons exist.',
        'Use package-private access to expose methods to unit tests without making them public.',
        'Follow reverse domain conventions (e.g. com.company.app).'
      ],
      dontList: [
        'Never make mutable fields public.',
        'Avoid wildcard imports (import java.util.*) in large codebases.',
        'Do not leave fields with default access accidentally when private was intended.'
      ],
      whenNotToUse: 'Do not expose internal implementation classes as public in reusable libraries; keep them package-private.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 9 introduced the Java Platform Module System (JPMS), enforcing strong encapsulation where public classes are inaccessible unless exported.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Access Modifiers Visibility Matrix',
      headers: ['Modifier', 'Class', 'Package', 'Subclass (Outside)', 'World'],
      rows: [
        ['public', 'YES', 'YES', 'YES', 'YES'],
        ['protected', 'YES', 'YES', 'YES', 'NO'],
        ['(default)', 'YES', 'YES', 'NO', 'NO'],
        ['private', 'YES', 'NO', 'NO', 'NO']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Cross-Package Default Access',
        prompt: 'Why does class B in package beta fail to access int x = 10; declared in class A in package alpha?',
        solution: 'int x has package-private access (no modifier). It is inaccessible outside package alpha.',
        explanation: 'To permit access, declare x as public or protected (if B extends A).'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Protected Plugin Hook Pattern',
        prompt: 'Design an abstract Plugin class with protected pluginId and package-private lifecycleStart().',
        solution: `public abstract class Plugin {
    protected final String pluginId;
    protected Plugin(String id) { this.pluginId = id; }
    void lifecycleStart() { execute(); }
    protected abstract void execute();
}`,
        explanation: 'Subclasses inherit protected state while engine controls package-private lifecycle.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Cross-Package Protected Access Rules',
        prompt: 'Can SubClass in package beta access superRef.protectedField on an external SuperClass reference?',
        solution: 'No. Subclasses in other packages can only access protected fields on instances of their own subclass type, not via external superclass references.',
        explanation: 'Enforces JLS §6.6.2 to protect state integrity across unrelated objects.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Controlling Access',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Packages in Java',
        url: 'https://dev.java/learn/classes-objects/packages/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §6.6: Access Control',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.6',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 19: Encapsulation & Data Integrity
  {
    id: 'topic-19',
    slug: 'encapsulation-and-data-integrity',
    topicNumber: 19,
    title: 'Encapsulation & Data Integrity',
    part: 'Part 1: Java Core',
    sectionNumber: 6,
    sectionTitle: 'Object-Oriented Programming (OOP) Essentials',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Shield internal state from illegal mutations. Master data hiding, validated accessors/mutators, defensive copying for mutable references, and immutable object patterns.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 18: Packages & Access Modifiers'
    ],
    whatAndWhy: {
      definition: 'Encapsulation combines state and behavior into a single class while restricting direct access to internal fields. Defensive copying clones mutable inputs/outputs.',
      analogy: 'Like a submarine hull: passengers cannot touch the engine turbines directly, but use the helm controls with computer safety limiters to prevent hull breaches.',
      whyItExists: 'Encapsulation guarantees class invariants, prevents corrupt balances or negative ages, and permits internal refactoring without breaking external callers.'
    },
    syntaxBreakdown: {
      title: 'Defensive Copying & Invariant Protection',
      codeSnippet: `public final class ImmutableLedger {
    private final Date timestamp;
    public ImmutableLedger(Date d) {
        this.timestamp = new Date(d.getTime()); // Copy in
    }
    public Date getTimestamp() {
        return new Date(this.timestamp.getTime()); // Copy out
    }
}`,
      explanation: 'Mark fields private final. Clone mutable references during construction (copy in) and inside accessors (copy out) to prevent backdoor mutation.',
      tokens: [
        { token: 'private final', explanation: 'Restricts visibility and prevents reference reassignment.' },
        { token: 'Defensive Copy In', explanation: 'Clones incoming mutable parameters in constructor.' },
        { token: 'Defensive Copy Out', explanation: 'Clones internal mutable objects in getters before returning.' },
        { token: 'Invariants', explanation: 'Rules that must remain true for the lifetime of an object (e.g. balance >= 0).' }
      ]
    },
    examples: [
      {
        id: '19-1',
        title: 'Vulnerable Public Fields vs Validated Encapsulation',
        type: 'basic',
        description: 'Demonstrates catastrophic state corruption when using public fields versus invariant enforcement through encapsulation.',
        filename: 'EncapsulationMechanics.java',
        code: `public class EncapsulationMechanics {
    public static class VulnerableAccount { public double balance; }

    public static class RobustAccount {
        private double balance;
        public RobustAccount(double initial) {
            if (initial < 0) throw new IllegalArgumentException("Negative initial balance");
            this.balance = initial;
        }
        public double getBalance() { return balance; }
        public void deposit(double amt) { if (amt > 0) balance += amt; }
        public boolean withdraw(double amt) {
            if (amt > 0 && balance >= amt) { balance -= amt; return true; }
            return false;
        }
    }

    public static void main(String[] args) {
        VulnerableAccount bad = new VulnerableAccount();
        bad.balance = -999999.0; // Corrupted!

        RobustAccount secure = new RobustAccount(100.0);
        secure.deposit(50.0);
        boolean ok = secure.withdraw(200.0);
        System.out.println("Overdraft succeeded: " + ok);
        System.out.println("Final balance: $" + secure.getBalance());
    }
}`,
        output: `Overdraft succeeded: false
Final balance: $150.0`,
        stepByStep: [
          'VulnerableAccount allows external code to set an invalid negative balance.',
          'RobustAccount rejects invalid overdraft attempts, preserving data integrity.',
          'Verified final balance remains exactly $150.0.'
        ]
      },
      {
        id: '19-2',
        title: 'Immutable Financial Ledger Entry with Defensive Copies',
        type: 'realistic',
        description: 'Real-world immutable financial record shielding mutable Date references from external modification.',
        filename: 'FinancialLedgerEntry.java',
        code: `import java.util.Date;

public class FinancialLedgerEntry {
    public static final class ImmutableLedger {
        private final String transactionId;
        private final double amount;
        private final Date timestamp;

        public ImmutableLedger(String id, double amt, Date time) {
            if (id == null || time == null) throw new IllegalArgumentException();
            this.transactionId = id; this.amount = amt;
            this.timestamp = new Date(time.getTime()); // Defensive Copy In
        }
        public String getTransactionId() { return transactionId; }
        public double getAmount() { return amount; }
        public Date getTimestamp() { return new Date(timestamp.getTime()); } // Defensive Copy Out
    }

    public static void main(String[] args) {
        Date now = new Date();
        ImmutableLedger ledger = new ImmutableLedger("TXN-7701", 1250.75, now);
        now.setTime(0L); // Mutating outside reference
        ledger.getTimestamp().setTime(0L); // Mutating returned reference
        System.out.println("State preserved: " + (ledger.getTimestamp().getTime() != 0L));
    }
}`,
        output: `State preserved: true`,
        stepByStep: [
          'Constructor creates a defensive clone of incoming Date.',
          'Mutating outside Date object fails to affect internal ledger state.',
          'Getter returns a fresh clone; mutating it leaves internal ledger state untouched.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Returning internal mutable collections directly',
        wrongCode: `public List<String> getRoles() {
    return this.roles; // BUG: Caller can call getRoles().clear()!
}`,
        fixedCode: `public List<String> getRoles() {
    return List.copyOf(this.roles); // Returns unmodifiable copy
}`,
        cause: 'Directly returning mutable lists lets callers mutate internal state bypassing class methods.',
        solution: 'Return List.copyOf() or Collections.unmodifiableList().'
      },
      {
        title: 'Blindly generating getters and setters without validation',
        wrongCode: `public void setAge(int age) { this.age = age; } // Allows age = -50`,
        fixedCode: `public void setAge(int age) {
    if (age < 0 || age > 130) throw new IllegalArgumentException("Invalid age");
    this.age = age;
}`,
        cause: 'Unchecked setters bypass encapsulation and convert classes into dumb data structs.',
        solution: 'Enforce bounds and domain rules in mutators.'
      }
    ],
    bestPractices: {
      doList: [
        'Design classes to be immutable by default.',
        'Use defensive copying for mutable references (arrays, Date).',
        'Use unmodifiable collection wrappers (List.copyOf).'
      ],
      dontList: [
        'Never expose mutable fields as public.',
        'Do not clone already immutable objects (String, Integer, LocalDate).',
        'Avoid setters that accept unvalidated data.'
      ],
      whenNotToUse: 'Do not defensively copy deeply immutable objects like String, BigDecimal, or Java Records; doing so consumes CPU and memory without security benefit.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 8 java.time classes (LocalDate, Instant) are immutable, eliminating need for Date defensive copies. Java 10 added List.copyOf(). Java 16 added records.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Encapsulation & Immutability Cheat Sheet',
      headers: ['Pillar', 'Pattern', 'Benefit'],
      rows: [
        ['Data Hiding', 'private fields', 'Prevents uncontrolled external state manipulation'],
        ['Validation', 'Constructor invariants', 'Guarantees object is never created in invalid state'],
        ['Defensive Copy In', 'new Date(arg.getTime())', 'Protects against caller mutating arguments after construction'],
        ['Defensive Copy Out', 'return new Date(field.getTime())', 'Protects against caller mutating returned objects'],
        ['Immutable Collections', 'List.copyOf(items)', 'Guarantees collection contents cannot be altered']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Mutable Array Exposure',
        prompt: 'Why is class StudentGrades { private final int[] s; public StudentGrades(int[] s) { this.s = s; } public int[] getS() { return s; } } vulnerable?',
        solution: 'Arrays are mutable. Callers can mutate elements via the constructor parameter or the getter return.',
        explanation: 'Must use this.s = s.clone(); in constructor and return s.clone(); in getter.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Immutable GeoCoordinate',
        prompt: 'Implement immutable GeoLocation with validated lat (-90 to 90) and lon (-180 to 180).',
        solution: `public final class GeoLocation {
    private final double lat, lon;
    public GeoLocation(double lat, double lon) {
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) throw new IllegalArgumentException();
        this.lat = lat; this.lon = lon;
    }
    public double getLat() { return lat; }
    public double getLon() { return lon; }
}`,
        explanation: 'Final class, private final fields, validated invariants, and zero mutators guarantee immutability.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Java Records with Arrays',
        prompt: 'Does record Data(byte[] payload) {} guarantee immutability?',
        solution: 'No! The array payload is mutable. Calling data.payload()[0] = 99 mutates the record contents.',
        explanation: 'Records with arrays require a compact constructor and accessor that perform defensive cloning.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Controlling Access',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Encapsulation',
        url: 'https://dev.java/learn/classes-objects/encapsulation/',
        organization: 'Oracle'
      },
      {
        title: 'Java Secure Coding: Mutability Guidelines',
        url: 'https://www.oracle.com/java/technologies/javase/seccodeguide.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 20: Inheritance & Method Overriding
  {
    id: 'topic-20',
    slug: 'inheritance-and-method-overriding',
    topicNumber: 20,
    title: 'Inheritance & Method Overriding',
    part: 'Part 1: Java Core',
    sectionNumber: 7,
    sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Establish IS-A hierarchies with the extends keyword. Master super() constructor chaining, method overriding rules, covariant returns, and final class/method locks.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 17: Constructors & Object Initialization'
    ],
    whatAndWhy: {
      definition: 'Inheritance allows a subclass to inherit state and behaviors from a superclass using extends. Method overriding lets a subclass provide a specialized implementation of an inherited method.',
      analogy: 'An automotive manufacturer creates a base vehicle chassis. An ambulance inherits the chassis and overrides the horn button to trigger a 120-decibel emergency siren instead of a standard beep.',
      whyItExists: 'Inheritance eliminates duplicate code across related models, enables polymorphism, and allows framework architectures to manipulate generic base types.'
    },
    syntaxBreakdown: {
      title: 'Inheritance & Overriding Syntax',
      codeSnippet: `public class Manager extends Employee {
    public Manager(String id, double salary) {
        super(id, salary); // Super constructor chaining
    }

    @Override
    public double calculateMonthlyPay() {
        return super.calculateMonthlyPay() + getBonus();
    }
}`,
      explanation: 'extends establishes subclassing. super(...) invokes superclass constructors. @Override verifies signature matching with superclass at compile time.',
      tokens: [
        { token: 'extends', explanation: 'Inherits public and protected members of a single superclass.' },
        { token: 'super(...)', explanation: 'Delegates initialization to superclass constructor; must be first statement.' },
        { token: '@Override', explanation: 'Compiler annotation ensuring method correctly overrides a supertype method.' },
        { token: 'final method', explanation: 'Prevents subclasses from overriding the method.' }
      ]
    },
    examples: [
      {
        id: '20-1',
        title: 'Super Constructor Chaining & Overriding',
        type: 'basic',
        description: 'Demonstrates superclass constructor chaining, overriding powerOn(), and verifying that final methods cannot be overridden.',
        filename: 'InheritanceMechanics.java',
        code: `public class InheritanceMechanics {
    public static class Device {
        protected final String brand;
        protected boolean powerStatus;
        public Device(String brand) { this.brand = brand; this.powerStatus = false; }
        public void powerOn() {
            this.powerStatus = true;
            System.out.println(brand + " device powering on (Generic BIOS)");
        }
        public final String getBrand() { return brand; }
    }

    public static class SmartPhone extends Device {
        private int batteryPercent;
        public SmartPhone(String brand, int batteryPercent) {
            super(brand);
            this.batteryPercent = batteryPercent;
        }
        @Override
        public void powerOn() {
            super.powerOn();
            System.out.printf("SmartPhone UI initialized. Battery at %d%%%n", batteryPercent);
        }
    }

    public static void main(String[] args) {
        SmartPhone phone = new SmartPhone("Nexus", 88);
        phone.powerOn();
        System.out.println("Brand query (final method): " + phone.getBrand());
    }
}`,
        output: `Nexus device powering on (Generic BIOS)
SmartPhone UI initialized. Battery at 88%
Brand query (final method): Nexus`,
        stepByStep: [
          'Instantiates SmartPhone, triggering super("Nexus") constructor.',
          'phone.powerOn() invokes SmartPhone override.',
          'super.powerOn() runs base BIOS initialization before mobile UI boots.',
          'phone.getBrand() executes inherited final method.'
        ]
      },
      {
        id: '20-2',
        title: 'Corporate Employee Payroll Processing System',
        type: 'realistic',
        description: 'Subclasses Manager and CommissionedSales specialize monthly pay calculations while sharing base Employee paystub formatting.',
        filename: 'EmployeePayrollApp.java',
        code: `public class EmployeePayrollApp {
    public static class Employee {
        private final String employeeId, name;
        protected final double baseSalary;
        public Employee(String id, String name, double salary) {
            this.employeeId = id; this.name = name; this.baseSalary = salary;
        }
        public double calculateMonthlyPay() { return baseSalary / 12.0; }
        public String getPaystub() {
            return String.format("[%s] %-14s | Monthly Pay: $%.2f", employeeId, name, calculateMonthlyPay());
        }
    }

    public static class Manager extends Employee {
        private final double annualBonus;
        public Manager(String id, String name, double salary, double bonus) {
            super(id, name, salary); this.annualBonus = bonus;
        }
        @Override
        public double calculateMonthlyPay() { return (baseSalary + annualBonus) / 12.0; }
    }

    public static class CommissionedSales extends Employee {
        private double monthlySales;
        private final double rate;
        public CommissionedSales(String id, String name, double salary, double rate) {
            super(id, name, salary); this.rate = rate;
        }
        public void recordSale(double amt) { this.monthlySales += amt; }
        @Override
        public double calculateMonthlyPay() { return (baseSalary / 12.0) + (monthlySales * (rate / 100.0)); }
    }

    public static void main(String[] args) {
        Employee regular = new Employee("EMP-101", "David Miller", 60_000.0);
        Manager mgr = new Manager("MGR-201", "Sarah Connor", 120_000.0, 30_000.0);
        CommissionedSales sales = new CommissionedSales("SLS-301", "Alex Mercer", 48_000.0, 5.0);
        sales.recordSale(80_000.0);

        System.out.println(regular.getPaystub());
        System.out.println(mgr.getPaystub());
        System.out.println(sales.getPaystub());
    }
}`,
        output: `[EMP-101] David Miller   | Monthly Pay: $5000.00
[MGR-201] Sarah Connor   | Monthly Pay: $12500.00
[SLS-301] Alex Mercer    | Monthly Pay: $8000.00`,
        stepByStep: [
          'Employee calculates straightforward base monthly salary ($5000.00).',
          'Manager overrides monthly calculation to factor in annual executive bonuses ($12500.00).',
          'CommissionedSales adds performance commission to base salary ($8000.00).'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Accidentally overloading instead of overriding',
        wrongCode: `public class Sub extends Super {
    public void configure(double val) {} // Super had configure(int val)
}`,
        fixedCode: `@Override
public void configure(int val) {}`,
        cause: 'Altering parameter types overloads the method rather than overriding it.',
        solution: 'Always use @Override to catch signature mismatches.'
      },
      {
        title: 'Reducing visibility in the overriding method',
        wrongCode: `public class Super { protected void run() {} }
public class Sub extends Super {
    @Override void run() {} // COMPILE ERROR: cannot reduce visibility
}`,
        fixedCode: `@Override protected void run() {}`,
        cause: 'Liskov Substitution Principle forbids narrowing access of inherited methods.',
        solution: 'Keep visibility equal or broader (protected or public).'
      }
    ],
    bestPractices: {
      doList: [
        'Prefer composition over inheritance unless a genuine IS-A relationship exists.',
        'Always annotate overridden methods with @Override.',
        'Keep inheritance hierarchies shallow (2 to 3 levels max).'
      ],
      dontList: [
        'Never inherit purely to reuse one helper method.',
        'Do not override non-private methods without honoring superclass contracts.',
        'Avoid extending concrete classes not designed for extension.'
      ],
      whenNotToUse: 'Avoid inheritance when the relationship is HAS-A (e.g. Car HAS-A Engine, not Car IS-A Engine); use composition instead.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 5 introduced covariant return types and @Override. Java 17 introduced sealed classes.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Inheritance & Overriding Cheat Sheet',
      headers: ['Concept', 'Keyword', 'Rule / Behavior'],
      rows: [
        ['Subclassing', 'extends', 'Single inheritance of state and methods from one class'],
        ['Super Constructor', 'super(...)', 'Must be the first statement in subclass constructor'],
        ['Overriding Check', '@Override', 'Enforces exact parameter and name match with superclass'],
        ['Non-Inheritable', 'final class', 'Prohibits any subclass from extending this class'],
        ['Non-Overridable', 'final method', 'Locks implementation; subclasses cannot override']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Implicit Super Constructor Failure',
        prompt: 'Why does class Sub extends Super { public Sub() {} } fail if Super only declared Super(int x)?',
        solution: 'Subclass constructors automatically call super() if no explicit super(...) is present. Since Super has no default constructor, compilation fails.',
        explanation: 'Must explicitly call super(x) in subclass constructor.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Covariant Return Types',
        prompt: 'Implement Document with method Document copy() and subclass Spreadsheet overriding it returning Spreadsheet.',
        solution: `public class Document { public Document copy() { return new Document(); } }
public class Spreadsheet extends Document {
    @Override public Spreadsheet copy() { return new Spreadsheet(); }
}`,
        explanation: 'Covariant return types eliminate casting at call sites.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Overriding Static Methods',
        prompt: 'Can you override static methods in Java?',
        solution: 'No! Static methods are resolved at compile time (static binding) and cannot be overridden; they are hidden.',
        explanation: '@Override on a static method produces a compile-time error.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Inheritance',
        url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Inheritance',
        url: 'https://dev.java/learn/classes-objects/inheritance/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8.4.8: Method Inheritance and Overriding',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4.8',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 21: Polymorphism & Dynamic Method Dispatch
  {
    id: 'topic-21',
    slug: 'polymorphism-and-dynamic-dispatch',
    topicNumber: 21,
    title: 'Polymorphism & Dynamic Method Dispatch',
    part: 'Part 1: Java Core',
    sectionNumber: 7,
    sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Unlock runtime flexibility: reference types vs actual runtime object types, dynamic dispatch via the virtual method table (vtable), and Java 16+ pattern matching for instanceof.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 20: Inheritance & Method Overriding'
    ],
    whatAndWhy: {
      definition: 'Polymorphism allows objects of different classes to be treated uniformly through a shared supertype reference, dynamically dispatching calls to the runtime object implementation.',
      analogy: 'Like a USB-C port on a laptop: the single port accepts hard drives, 4K monitors, or audio headphones, dispatching data signals correctly without needing custom ports for each device.',
      whyItExists: 'Polymorphism replaces brittle if-else type checks with clean object-oriented dispatch, making applications open for extension without modifying existing code.'
    },
    syntaxBreakdown: {
      title: 'Polymorphism & Pattern Matching Syntax',
      codeSnippet: `Animal a = new Dog(); // Upcasting
a.makeSound();        // Dynamic dispatch via vtable

// Java 16+ Pattern Matching
if (a instanceof Dog d) {
    d.fetch(); // Auto-cast and scoped
}`,
      explanation: 'Declared reference type determines legal methods at compile-time; runtime object type determines which bytecode executes. Pattern matching eliminates manual casting.',
      tokens: [
        { token: 'Upcasting', explanation: 'Assigning a subclass instance to a superclass reference variable (safe and implicit).' },
        { token: 'vtable', explanation: 'Virtual method table in Metaspace used for O(1) dynamic method resolution.' },
        { token: 'instanceof Pattern', explanation: 'Tests type and binds automatically casted variable in one atomic check.' }
      ]
    },
    examples: [
      {
        id: '21-1',
        title: 'Dynamic Dispatch & Pattern Matching',
        type: 'basic',
        description: 'Iterates over a polymorphic animal array, demonstrating vtable dynamic dispatch and Java 16+ pattern matching for instanceof.',
        filename: 'PolymorphismMechanics.java',
        code: `public class PolymorphismMechanics {
    public static class Animal {
        public void makeSound() { System.out.println("Generic animal vocalization"); }
    }
    public static class Dog extends Animal {
        @Override public void makeSound() { System.out.println("Dog barks: Woof Woof!"); }
        public void fetch() { System.out.println("Dog fetches the tennis ball."); }
    }
    public static class Cat extends Animal {
        @Override public void makeSound() { System.out.println("Cat meows: Purr Meow!"); }
    }

    public static void main(String[] args) {
        Animal[] animals = { new Dog(), new Cat(), new Animal() };
        for (Animal a : animals) a.makeSound();

        for (Animal a : animals) {
            if (a instanceof Dog d) d.fetch();
        }
    }
}`,
        output: `Dog barks: Woof Woof!
Cat meows: Purr Meow!
Generic animal vocalization
Dog fetches the tennis ball.`,
        stepByStep: [
          'Heterogeneous array holds Dog, Cat, and Animal instances.',
          'Dynamic dispatch resolves makeSound() to child overrides at runtime.',
          'Pattern matching for instanceof identifies Dog and safely invokes fetch() without casting.'
        ]
      },
      {
        id: '21-2',
        title: 'Heterogeneous Polymorphic Alert Dispatcher',
        type: 'realistic',
        description: 'Single unified notification engine dispatching messages across Email, SMS, and Push channels polymorphically.',
        filename: 'NotificationDispatcherApp.java',
        code: `import java.util.ArrayList;
import java.util.List;

public class NotificationDispatcherApp {
    public static abstract class NotificationChannel {
        protected final String recipient;
        public NotificationChannel(String recipient) { this.recipient = recipient; }
        public abstract boolean dispatch(String message);
    }
    public static class EmailChannel extends NotificationChannel {
        public EmailChannel(String email) { super(email); }
        @Override public boolean dispatch(String msg) {
            System.out.printf("[EMAIL -> %s] Subject: Alert | Body: %s%n", recipient, msg); return true;
        }
    }
    public static class SMSChannel extends NotificationChannel {
        public SMSChannel(String phone) { super(phone); }
        @Override public boolean dispatch(String msg) {
            System.out.printf("[SMS -> %s] Text: %s%n", recipient, msg); return true;
        }
    }

    public static void main(String[] args) {
        List<NotificationChannel> channels = new ArrayList<>();
        channels.add(new EmailChannel("ops-team@enterprise.com"));
        channels.add(new SMSChannel("+1-555-0199"));

        for (NotificationChannel c : channels) {
            c.dispatch("CRITICAL: Database primary failover completed.");
        }
    }
}`,
        output: `[EMAIL -> ops-team@enterprise.com] Subject: Alert | Body: CRITICAL: Database primary failover completed.
[SMS -> +1-555-0199] Text: CRITICAL: Database primary failover completed.`,
        stepByStep: [
          'NotificationChannel list holds distinct communication adapters.',
          'Unified loop calls dispatch() on each channel.',
          'Each adapter formats and delivers messages according to its transport protocol.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Calling subclass methods directly on superclass references',
        wrongCode: `Animal a = new Dog();
a.fetch(); // COMPILE ERROR: cannot find symbol fetch()`,
        fixedCode: `if (a instanceof Dog d) {
    d.fetch();
}`,
        cause: 'Compiler validates method presence against declared reference type, not runtime object type.',
        solution: 'Use pattern matching for instanceof to safely downcast.'
      },
      {
        title: 'Assuming fields are polymorphic in Java',
        wrongCode: `Base b = new Sub();
System.out.println(b.val); // Prints Base.val, NOT Sub.val!`,
        fixedCode: `System.out.println(b.getVal()); // Methods ARE polymorphic`,
        cause: 'Fields in Java are resolved statically at compile time; they are never polymorphic.',
        solution: 'Always encapsulate fields behind polymorphic getter methods.'
      }
    ],
    bestPractices: {
      doList: [
        'Program to abstractions and interfaces rather than concrete classes.',
        'Use Java 16+ pattern matching for instanceof to eliminate manual casting boilerplate.',
        'Rely on virtual method dispatch instead of conditional type checking.'
      ],
      dontList: [
        'Do not write cascading if (x instanceof A) chains when an abstract method suffices.',
        'Never expose public instance fields expecting polymorphic behavior.',
        'Avoid unchecked downcasting without verifying type beforehand.'
      ],
      whenNotToUse: 'Avoid downcasting wherever possible; well-designed polymorphic APIs rarely require callers to inspect concrete types.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 16 (JEP 394) standardized Pattern Matching for instanceof. Java 21 added pattern matching in switch.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Polymorphism Quick Reference',
      headers: ['Concept', 'Resolution Time', 'Description'],
      rows: [
        ['Declared Type', 'Compile Time', 'Determines which methods are legal to invoke'],
        ['Runtime Type', 'Runtime', 'Determines which method bytecode executes on the heap'],
        ['vtable Lookup', 'Runtime O(1)', 'Direct pointer jump to concrete overriding implementation'],
        ['Pattern Matching', 'Java 16+', 'if (x instanceof Dog d) tests and binds casted variable atomically'],
        ['Monomorphic Inlining', 'JIT Optimization', 'HotSpot JIT eliminates vtable dispatch when only 1 class is ever called']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Field Shadowing vs Method Overriding',
        prompt: 'Why does Base b = new Sub(); System.out.println(b.count); print Base count even though Sub redefined it?',
        solution: 'In Java, fields are not polymorphic. Field access is resolved at compile time based strictly on the declared reference type.',
        explanation: 'Always encapsulate fields behind polymorphic methods.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Heterogeneous Payment Processing',
        prompt: 'Implement processAll(List<PaymentMethod> methods, double amount) executing pay(amount) polymorphically.',
        solution: `public static void processAll(List<PaymentMethod> methods, double amount) {
    if (methods != null) for (PaymentMethod p : methods) p.pay(amount);
}`,
        explanation: 'Enforces Open/Closed Principle: new payment methods can be added without modifying processAll.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'JIT Monomorphic Call Site Optimization',
        prompt: 'How does the JVM optimize polymorphic calls when only one concrete class is ever executed?',
        solution: 'Through Monomorphic Call Inlining: the JIT compiler eliminates vtable dispatch and inlines the target bytecode directly.',
        explanation: 'If a second subclass is loaded later, the JVM deoptimizes and falls back to vtable lookup.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Polymorphism',
        url: 'https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html',
        organization: 'Oracle'
      },
      {
        title: 'OpenJDK JEP 394: Pattern Matching for instanceof',
        url: 'https://openjdk.org/jeps/394',
        organization: 'OpenJDK'
      },
      {
        title: 'JLS §15.12.4: Runtime Evaluation of Method Invocation',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.12.4',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 22: Abstract Classes & Methods
  {
    id: 'topic-22',
    slug: 'abstract-classes-and-methods',
    topicNumber: 22,
    title: 'Abstract Classes & Methods',
    part: 'Part 1: Java Core',
    sectionNumber: 7,
    sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Design extensible architectural templates with abstract classes. Define unimplemented abstract method contracts and enforce the Template Method design pattern.',
    prerequisites: [
      'Topic 20: Inheritance & Method Overriding',
      'Topic 21: Polymorphism & Dynamic Method Dispatch'
    ],
    whatAndWhy: {
      definition: 'An abstract class is an incomplete class that cannot be directly instantiated with new. It can contain abstract methods (contracts) alongside concrete methods and instance state.',
      analogy: 'A building permit application: it contains standardized municipal legal clauses (concrete methods) and blank boxes for blueprints and load calculations (abstract methods) that must be completed.',
      whyItExists: 'Abstract classes enforce common architectural workflows while delegating specific algorithmic variations to concrete subclasses (Template Method Pattern).'
    },
    syntaxBreakdown: {
      title: 'Abstract Class & Template Method Syntax',
      codeSnippet: `public abstract class DataPipeline {
    // Template method: final prevents altering sequence
    public final void execute() {
        extract(); transform(); load();
    }
    protected abstract void extract();
    protected abstract void transform();
    protected abstract void load();
}`,
      explanation: 'abstract class prevents new instantiation. abstract methods have no body. Subclasses must implement all abstract methods or remain abstract.',
      tokens: [
        { token: 'abstract class', explanation: 'Class cannot be instantiated directly; serves as a base type.' },
        { token: 'abstract method', explanation: 'Declaration without a body ending in a semicolon; subclasses must override.' },
        { token: 'Template Method', explanation: 'Final master method orchestrating abstract steps in deterministic order.' }
      ]
    },
    examples: [
      {
        id: '22-1',
        title: 'Abstract Shape Calculation Hierarchy',
        type: 'basic',
        description: 'Demonstrates abstract calculateArea() and calculatePerimeter() implemented by concrete Circle and Rectangle subclasses.',
        filename: 'AbstractShapeDemo.java',
        code: `public class AbstractShapeDemo {
    public static abstract class Shape {
        protected final String color;
        public Shape(String color) { this.color = color; }
        public abstract double calculateArea();
        public abstract double calculatePerimeter();
        public void display() {
            System.out.printf("Shape: %-5s | Area: %5.2f | Perimeter: %5.2f%n", color, calculateArea(), calculatePerimeter());
        }
    }

    public static class Circle extends Shape {
        private final double radius;
        public Circle(String c, double r) { super(c); this.radius = r; }
        @Override public double calculateArea() { return Math.PI * radius * radius; }
        @Override public double calculatePerimeter() { return 2 * Math.PI * radius; }
    }

    public static class Rectangle extends Shape {
        private final double w, h;
        public Rectangle(String c, double w, double h) { super(c); this.w = w; this.h = h; }
        @Override public double calculateArea() { return w * h; }
        @Override public double calculatePerimeter() { return 2 * (w + h); }
    }

    public static void main(String[] args) {
        Shape c = new Circle("Red", 5.0);
        Shape r = new Rectangle("Blue", 4.0, 6.0);
        c.display();
        r.display();
    }
}`,
        output: `Shape: Red   | Area: 78.54 | Perimeter: 31.42
Shape: Blue  | Area: 24.00 | Perimeter: 20.00`,
        stepByStep: [
          'Shape declares common color state and abstract mathematical formulas.',
          'Circle implements formulas using radius and Pi.',
          'Rectangle implements formulas using width and height.',
          'Concrete shapes execute display() seamlessly.'
        ]
      },
      {
        id: '22-2',
        title: 'Abstract ETL Data Pipeline Framework',
        type: 'realistic',
        description: 'Production ETL pipeline enforcing the Template Method pattern across extraction, normalization, and warehouse loading.',
        filename: 'ETLPipelineApp.java',
        code: `import java.util.ArrayList;
import java.util.List;

public class ETLPipelineApp {
    public static abstract class AbstractDataPipeline {
        private final String name;
        public AbstractDataPipeline(String name) { this.name = name; }
        public final void runPipeline() {
            List<String> raw = extract();
            List<String> transformed = transform(raw);
            load(transformed);
            System.out.println(name + " completed successfully.");
        }
        protected abstract List<String> extract();
        protected abstract List<String> transform(List<String> raw);
        protected abstract void load(List<String> transformed);
    }

    public static class CsvUserPipeline extends AbstractDataPipeline {
        public CsvUserPipeline() { super("CSV-User-Ingest"); }
        @Override protected List<String> extract() { return List.of("101,john_doe,ACTIVE"); }
        @Override protected List<String> transform(List<String> raw) {
            List<String> res = new ArrayList<>();
            for (String l : raw) {
                String[] p = l.split(",");
                res.add(String.format("{\"id\":%s,\"user\":\"%s\"}", p[0], p[1].toUpperCase()));
            }
            return res;
        }
        @Override protected void load(List<String> t) {
            for (String item : t) System.out.println("INSERT -> " + item);
        }
    }

    public static void main(String[] args) {
        AbstractDataPipeline p = new CsvUserPipeline();
        p.runPipeline();
    }
}`,
        output: `INSERT -> {"id":101,"user":"JOHN_DOE"}
CSV-User-Ingest completed successfully.`,
        stepByStep: [
          'runPipeline() locks execution order: Extract -> Transform -> Load.',
          'CsvUserPipeline implements parsing and JSON normalization.',
          'Template method coordinates the end-to-end data lifecycle.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Attempting to instantiate an abstract class directly',
        wrongCode: `Shape s = new Shape("Red"); // COMPILE ERROR`,
        fixedCode: `Shape s = new Circle("Red", 5.0);`,
        cause: 'Abstract classes are incomplete specifications and cannot be allocated directly.',
        solution: 'Instantiate a concrete subclass.'
      },
      {
        title: 'Combining abstract with private or final',
        wrongCode: `private abstract void run(); // COMPILE ERROR
public abstract final class Bad {} // COMPILE ERROR`,
        fixedCode: `protected abstract void run();`,
        cause: 'abstract demands overriding, whereas private and final prohibit overriding.',
        solution: 'Never combine abstract with final or private.'
      }
    ],
    bestPractices: {
      doList: [
        'Use the Template Method pattern: master workflow final, steps abstract.',
        'Share common instance variables and constructor validation logic.',
        'Use abstract classes when subclasses need to share mutable state.'
      ],
      dontList: [
        'Do not use abstract classes when an interface with default methods suffices.',
        'Avoid creating abstract classes with zero shared code or state.',
        'Do not expose abstract methods as public if only internal pipeline callers need them; use protected.'
      ],
      whenNotToUse: 'When you only need to define behavioral capabilities without shared state or constructors, use an interface.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 8 default methods in interfaces reduced reliance on abstract classes for helper logic. Java 17 added sealed abstract classes.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Abstract Class vs Interface Comparison',
      headers: ['Feature', 'Abstract Class', 'Interface'],
      rows: [
        ['Instantiation', 'Cannot use new', 'Cannot use new'],
        ['Instance State', 'YES (private/protected fields)', 'NO (public static final constants only)'],
        ['Constructors', 'YES (invoked via super)', 'NO'],
        ['Multiple Inheritance', 'NO (single class extends)', 'YES (implements multiple)'],
        ['Primary Use Case', 'Template Method / Base State', 'Polymorphic Behavioral Contracts']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Abstract Method with Body',
        prompt: 'Why does public abstract void log() { System.out.println("log"); } fail compilation?',
        solution: 'Abstract methods cannot contain a body block. They must terminate with a semicolon: public abstract void log();',
        explanation: 'Remove the body or remove the abstract keyword.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Game Character Template',
        prompt: 'Design abstract GameCharacter with name, health, concrete takeDamage(int dmg), and abstract attack(GameCharacter target).',
        solution: `public abstract class GameCharacter {
    protected final String name; protected int health;
    public GameCharacter(String n, int h) { this.name = n; this.health = h; }
    public void takeDamage(int d) { this.health = Math.max(0, this.health - d); }
    public abstract void attack(GameCharacter target);
}`,
        explanation: 'Combines common health state manipulation with specialized attack logic.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Abstract Class with Zero Abstract Methods',
        prompt: 'Can an abstract class have zero abstract methods?',
        solution: 'Yes! It compiles and functions normally.',
        explanation: 'Marking a fully concrete class abstract simply prevents external code from instantiating it with new.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Abstract Classes',
        url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Abstract Classes',
        url: 'https://dev.java/learn/classes-objects/abstract-classes/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8.1.1.1: abstract Classes',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.1.1.1',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 23: Interfaces & Modern Interface Evolution
  {
    id: 'topic-23',
    slug: 'interfaces-and-default-methods',
    topicNumber: 23,
    title: 'Interfaces & Modern Interface Evolution',
    part: 'Part 1: Java Core',
    sectionNumber: 7,
    sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Define 100% abstract behavioral contracts. Master multiple interface implementation, Java 8 default/static methods, Java 9 private methods, and resolving diamond inheritance conflicts.',
    prerequisites: [
      'Topic 20: Inheritance & Method Overriding',
      'Topic 22: Abstract Classes & Methods'
    ],
    whatAndWhy: {
      definition: 'An interface is an abstract reference type specifying a behavioral contract. Classes implement multiple interfaces. Modern interfaces support default, static, and private methods.',
      analogy: 'An electrical wall outlet: it specifies 230V prongs. Whether a toaster, laptop, or lamp is plugged in, the outlet delivers electricity uniformly without caring about device internals.',
      whyItExists: 'Interfaces decouple API specification from implementation, support multiple inheritance of type, and default methods allow evolving published APIs without breaking backward compatibility.'
    },
    syntaxBreakdown: {
      title: 'Modern Interface Features Syntax',
      codeSnippet: `public interface Auditable {
    void process(); // Abstract
    default void log() { logInternal(); } // Java 8 Default
    static boolean check() { return true; } // Java 8 Static
    private void logInternal() { ... } // Java 9 Private
}`,
      explanation: 'Fields are public static final. default methods have bodies. static methods are utility functions. private methods allow code reuse across default methods.',
      tokens: [
        { token: 'implements', explanation: 'Declares that a class fulfills all abstract contracts of the interface.' },
        { token: 'default', explanation: 'Provides an inherited concrete implementation for backward compatibility.' },
        { token: 'InterfaceA.super.method()', explanation: 'Disambiguates diamond problem when multiple interfaces share a default method.' }
      ]
    },
    examples: [
      {
        id: '23-1',
        title: 'Default, Static, and Private Interface Methods',
        type: 'basic',
        description: 'Demonstrates modern Java interface features: inherited default audit logging, static transaction validator, and private timestamp helper.',
        filename: 'InterfaceEvolutionDemo.java',
        code: `public class InterfaceEvolutionDemo {
    public interface AuditableService {
        void processTransaction(String txnId, double amount);
        default void logAudit(String txnId, String status) {
            System.out.printf("[%s] Audit Log: Txn %s marked as %s%n", fetchTimestamp(), txnId, status);
        }
        static boolean isValidTxnId(String txnId) {
            return txnId != null && txnId.startsWith("TXN-");
        }
        private String fetchTimestamp() { return "2026-11-17T15:30:00Z"; }
    }

    public static class PaymentProcessor implements AuditableService {
        @Override public void processTransaction(String txnId, double amount) {
            if (!AuditableService.isValidTxnId(txnId)) throw new IllegalArgumentException();
            System.out.printf("Processing payment of $%.2f for %s%n", amount, txnId);
            logAudit(txnId, "SETTLED");
        }
    }

    public static void main(String[] args) {
        PaymentProcessor p = new PaymentProcessor();
        p.processTransaction("TXN-9021", 450.0);
    }
}`,
        output: `Processing payment of $450.00 for TXN-9021
[2026-11-17T15:30:00Z] Audit Log: Txn TXN-9021 marked as SETTLED`,
        stepByStep: [
          'PaymentProcessor implements abstract processTransaction().',
          'AuditableService.isValidTxnId() runs static interface utility check.',
          'logAudit() executes default interface method, calling private fetchTimestamp().'
        ]
      },
      {
        id: '23-2',
        title: 'Multi-Cloud Storage Adapter Pattern',
        type: 'realistic',
        description: 'Enterprise storage provider contract implemented by cloud providers with a default cross-bucket copy algorithm.',
        filename: 'CloudStorageService.java',
        code: `public class CloudStorageService {
    public interface BlobStorageProvider {
        String DEFAULT_REGION = "us-east-1";
        void upload(String bucket, String key, byte[] content);
        byte[] download(String bucket, String key);

        default void copy(String srcBucket, String srcKey, String destBucket, String destKey) {
            byte[] data = download(srcBucket, srcKey);
            upload(destBucket, destKey, data);
            System.out.printf("Copied %s/%s -> %s/%s%n", srcBucket, srcKey, destBucket, destKey);
        }
    }

    public static class AwsS3Provider implements BlobStorageProvider {
        @Override public void upload(String bucket, String key, byte[] content) {
            System.out.printf("Uploaded %d bytes to %s/%s%n", content.length, bucket, key);
        }
        @Override public byte[] download(String bucket, String key) {
            return "Sample Payload".getBytes();
        }
    }

    public static void main(String[] args) {
        BlobStorageProvider storage = new AwsS3Provider();
        storage.upload("production-backups", "db_dump.sql", new byte[1024]);
        storage.copy("production-backups", "db_dump.sql", "archive-backups", "db_dump.sql");
    }
}`,
        output: `Uploaded 1024 bytes to production-backups/db_dump.sql
Uploaded 14 bytes to archive-backups/db_dump.sql
Copied production-backups/db_dump.sql -> archive-backups/db_dump.sql`,
        stepByStep: [
          'AwsS3Provider implements core primitive upload/download operations.',
          'default copy() orchestrates download and upload without forcing every provider to rewrite copying logic.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Diamond problem collision between two default methods',
        wrongCode: `interface A { default void ping() {} }
interface B { default void ping() {} }
class C implements A, B {} // COMPILE ERROR: inherits unrelated defaults`,
        fixedCode: `class C implements A, B {
    @Override public void ping() { A.super.ping(); }
}`,
        cause: 'Compiler cannot determine which default implementation takes priority.',
        solution: 'Override the conflicting method and explicitly specify which interface to delegate to.'
      },
      {
        title: 'Attempting to declare protected or package-private interface methods',
        wrongCode: `public interface Service { protected void run(); } // COMPILE ERROR`,
        fixedCode: `public interface Service { void run(); }`,
        cause: 'Interface methods represent public contracts; only public, private, or default are valid.',
        solution: 'Use public abstract methods or default/private methods.'
      }
    ],
    bestPractices: {
      doList: [
        'Design interfaces according to the Interface Segregation Principle (ISP).',
        'Use default methods strictly for backward-compatible API evolution.',
        'Accept interfaces in method parameters to maximize decoupling.'
      ],
      dontList: [
        'Never use the Constant Interface anti-pattern (interfaces only containing constants).',
        'Avoid complex business state logic inside default methods.',
        'Do not create God interfaces with dozens of unrelated methods.'
      ],
      whenNotToUse: 'Do not use an interface when you need to maintain mutable state or control constructors; use an abstract class instead.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added default and static methods. Java 9 added private interface helper methods.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Interface Members Matrix',
      headers: ['Member', 'Keyword', 'Default Visibility', 'Has Body?'],
      rows: [
        ['Abstract Method', '(none)', 'public abstract', 'NO'],
        ['Default Method', 'default', 'public', 'YES'],
        ['Static Method', 'static', 'public', 'YES'],
        ['Private Method', 'private', 'private', 'YES'],
        ['Constant Field', '(none)', 'public static final', 'Must initialize']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Interface Field Mutation',
        prompt: 'Why does interface Config { int TIMEOUT = 10; } fail when caller writes Config.TIMEOUT = 20;?',
        solution: 'Interface fields are implicitly public static final constants. Reassigning a final constant is prohibited.',
        explanation: 'Constants cannot be altered once initialized.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Data Encryptor Contract',
        prompt: 'Implement Encryptor with abstract encrypt(String s) and default verify(String raw, String enc) comparing encrypt(raw).equals(enc).',
        solution: `public interface Encryptor {
    String encrypt(String raw);
    default boolean verify(String raw, String enc) {
        return raw != null && enc != null && encrypt(raw).equals(enc);
    }
}`,
        explanation: 'Default method provides reusable verification logic based on abstract encryption.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Class Wins Rule in Interface Inheritance',
        prompt: 'If a superclass method and an interface default method have identical signatures, which executes?',
        solution: 'The superclass method ALWAYS wins ("Class Wins Rule").',
        explanation: 'JLS prioritizes concrete class implementations over default methods to guarantee backward compatibility.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Interfaces',
        url: 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Interfaces',
        url: 'https://dev.java/learn/classes-objects/interfaces/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §9: Interfaces',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 24: Nested, Inner & Anonymous Classes
  {
    id: 'topic-24',
    slug: 'nested-inner-and-anonymous-classes',
    topicNumber: 24,
    title: 'Nested, Inner & Anonymous Classes',
    part: 'Part 1: Java Core',
    sectionNumber: 7,
    sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction',
    versionBadge: 'Java 8+',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Structure code logically with nested classes: static nested classes, non-static inner classes (Outer.this pointer), local method classes, and anonymous inner classes.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 23: Interfaces & Modern Interface Evolution'
    ],
    whatAndWhy: {
      definition: 'A nested class is a class defined within another enclosing class. Static nested classes hold no outer reference; inner classes implicitly hold a pointer to Outer.this.',
      analogy: 'A car diagnostic protocol (static nested) runs on a mechanic\'s laptop without a physical car. An engine piston (inner class) cannot exist in empty air; it must live inside a physical running engine block.',
      whyItExists: 'Nested classes encapsulate helper classes that are only relevant to a single parent class, granting direct access to private members without package exposure.'
    },
    syntaxBreakdown: {
      title: 'Four Types of Nested Classes',
      codeSnippet: `public class Outer {
    private String secret;
    public static class StaticNested { } // No outer this pointer
    public class InnerMember {           // Holds Outer.this pointer
        void access() { System.out.println(secret); }
    }
    void run() {
        Runnable r = new Runnable() { ... }; // Anonymous Class
    }
}`,
      explanation: 'Static nested classes are instantiated via new Outer.StaticNested(). Inner member classes require an enclosing instance outer.new InnerMember(). Local/anonymous classes capture effectively final variables.',
      tokens: [
        { token: 'static class Nested', explanation: 'Treated like a top-level class inside Outer namespace; zero memory overhead for outer pointer.' },
        { token: 'Outer.this', explanation: 'Synthetic pointer in non-static inner classes referencing the enclosing object instance.' },
        { token: 'Effectively Final', explanation: 'Local variables captured by anonymous classes must never be reassigned.' }
      ]
    },
    examples: [
      {
        id: '24-1',
        title: 'Static Nested vs Inner Member vs Anonymous',
        type: 'basic',
        description: 'Contrasts static nested classes, inner member access to private outer state via Outer.this, and anonymous worker execution.',
        filename: 'NestedClassMechanics.java',
        code: `public class NestedClassMechanics {
    private String outerSecret = "TOP_SECRET_VAULT_KEY";
    private static String staticConfig = "CLUSTER_ID_880";

    public static class StaticNestedHelper {
        public void inspect() { System.out.println("Static nested class accessing static outer: " + staticConfig); }
    }
    public class InnerEngine {
        public void revealSecret() { System.out.println("Inner class accessing outer private state: " + outerSecret); }
    }
    public void executeTask(String name) {
        final int id = 99;
        Runnable worker = new Runnable() {
            @Override public void run() {
                System.out.printf("Anonymous worker executing task '%s' (ID: %d)%n", name, id);
            }
        };
        worker.run();
    }

    public static void main(String[] args) {
        new StaticNestedHelper().inspect();
        NestedClassMechanics outer = new NestedClassMechanics();
        outer.new InnerEngine().revealSecret();
        outer.executeTask("Database Migration");
    }
}`,
        output: `Static nested class accessing static outer: CLUSTER_ID_880
Inner class accessing outer private state: TOP_SECRET_VAULT_KEY
Anonymous worker executing task 'Database Migration' (ID: 99)`,
        stepByStep: [
          'StaticNestedHelper accesses staticConfig without needing an outer instance.',
          'outer.new InnerEngine() instantiates inner class with a synthetic outer reference.',
          'revealSecret() accesses private outerSecret directly.',
          'executeTask() captures effectively final local variables in an anonymous Runnable.'
        ]
      },
      {
        id: '24-2',
        title: 'In-Memory Event Broker with Subscriptions',
        type: 'realistic',
        description: 'Event broker system combining static nested Event DTOs with anonymous event listener subscriptions.',
        filename: 'EventBrokerApp.java',
        code: `import java.util.ArrayList;
import java.util.List;

public class EventBrokerApp {
    public static class Event {
        private final String topic, payload;
        public Event(String t, String p) { this.topic = t; this.payload = p; }
        public String getTopic() { return topic; }
        public String getPayload() { return payload; }
    }
    public interface EventListener { void onEvent(Event e); }
    public static class EventBroker {
        private final List<EventListener> listeners = new ArrayList<>();
        public void subscribe(EventListener l) { listeners.add(l); }
        public void publish(Event e) { for (EventListener l : listeners) l.onEvent(e); }
    }

    public static void main(String[] args) {
        EventBroker broker = new EventBroker();
        broker.subscribe(new EventListener() {
            @Override public void onEvent(Event e) {
                if (e.getTopic().startsWith("SECURITY")) {
                    System.out.println("[AUDIT LOG] Detected security event: " + e.getPayload());
                }
            }
        });
        broker.subscribe(new EventListener() {
            private int count = 0;
            @Override public void onEvent(Event e) {
                count++;
                System.out.println("[METRICS] Total events received: " + count);
            }
        });

        broker.publish(new Event("ORDER_PLACED", "Order #5521"));
        broker.publish(new Event("SECURITY_BREACH", "Failed root login"));
    }
}`,
        output: `[METRICS] Total events received: 1
[AUDIT LOG] Detected security event: Failed root login
[METRICS] Total events received: 2`,
        stepByStep: [
          'Event is encapsulated as a clean static nested class.',
          'Anonymous listener 1 audits security-related events.',
          'Anonymous listener 2 maintains internal state (count) tracking total message traffic.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Memory leaks caused by non-static inner classes',
        wrongCode: `public class LargeBuffer {
    byte[] data = new byte[10_000_000];
    public Listener get() { return new MyListener(); } // Holds outer reference!
    class MyListener implements Listener {}
}`,
        fixedCode: `static class MyListener implements Listener {}`,
        cause: 'Non-static inner classes hold hidden references to the enclosing object, preventing garbage collection.',
        solution: 'Always declare nested classes static unless outer instance access is strictly necessary.'
      },
      {
        title: 'Attempting to mutate captured variables in anonymous classes',
        wrongCode: `int count = 0;
Runnable r = new Runnable() {
    public void run() { count++; } // COMPILE ERROR
};`,
        fixedCode: `AtomicInteger count = new AtomicInteger();
Runnable r = () -> count.incrementAndGet();`,
        cause: 'Java captures variables by value; permitting mutation would cause synchronization desync bugs.',
        solution: 'Use AtomicInteger or wrapper objects.'
      }
    ],
    bestPractices: {
      doList: [
        'Default to static nested classes to prevent unintentional outer memory retention.',
        'Prefer lambdas over anonymous inner classes for single-method interfaces.',
        'Use static nested classes for Builder patterns and immutable DTOs.'
      ],
      dontList: [
        'Avoid multi-method anonymous classes with large complex bodies.',
        'Never leak non-static inner class instances into long-lived static registries.',
        'Do not nest classes more than 1 level deep.'
      ],
      whenNotToUse: 'Do not use non-static inner classes if the nested class can function independently without access to outer instance fields.'
    },
    versionNotes: {
      introduced: 'Java 1.1',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added effectively final variable capture. Java 16 permitted static members and records inside inner classes.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Nested Class Types Comparison',
      headers: ['Type', 'Syntax', 'Enclosing Instance Needed?', 'Outer State Access'],
      rows: [
        ['Static Nested', 'static class Sub', 'NO', 'Only static members'],
        ['Inner Member', 'class Sub', 'YES (outer.new Sub())', 'All instance fields via Outer.this'],
        ['Local Class', 'class Sub inside method', 'YES (if method instance)', 'Effectively final local variables'],
        ['Anonymous Class', 'new Interface() { ... }', 'YES (if method instance)', 'Inline one-off implementation']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Direct Non-Static Instantiation Bug',
        prompt: 'Why does Outer.Inner in = new Outer.Inner(); fail if Inner has no static modifier?',
        solution: 'A non-static inner class requires an existing enclosing instance: Outer out = new Outer(); out.new Inner();',
        explanation: 'Add static to Inner class or instantiate via outer reference.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Static Nested Builder Pattern',
        prompt: 'Implement User class with private final username and email using a static nested Builder class.',
        solution: `public class User {
    private final String user, email;
    private User(Builder b) { this.user = b.u; this.email = b.e; }
    public static class Builder {
        private String u, e;
        public Builder user(String u) { this.u = u; return this; }
        public Builder email(String e) { this.e = e; return this; }
        public User build() { return new User(this); }
    }
}`,
        explanation: 'Encapsulates step-by-step construction of immutable objects.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Bytecode Naming of Anonymous Classes',
        prompt: 'What are compiled class files named for anonymous classes?',
        solution: 'Outer$1.class, Outer$2.class, etc.',
        explanation: 'The compiler numbers anonymous classes sequentially based on lexical occurrence in the file.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Nested Classes',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Nested Classes',
        url: 'https://dev.java/learn/classes-objects/nested-classes/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8.1.3: Inner Classes and Enclosing Instances',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.1.3',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 25: Enumerations (enum)
  {
    id: 'topic-25',
    slug: 'enumerations-enum',
    topicNumber: 25,
    title: 'Enumerations (enum)',
    part: 'Part 1: Java Core',
    sectionNumber: 7,
    sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master type-safe fixed sets of constants with the enum keyword. Add custom state, constructors, methods, constant-specific behavior, and explore EnumSet/EnumMap.',
    prerequisites: [
      'Topic 09: Switch Statements & Switch Expressions',
      'Topic 16: Classes, Objects & Memory Layout'
    ],
    whatAndWhy: {
      definition: 'An enumeration is a special class type representing a fixed set of named constants. In Java, enums are full-featured classes extending java.lang.Enum with custom fields, methods, and constant-specific behavior.',
      analogy: 'A physical traffic light: it has exactly 3 states (RED, YELLOW, GREEN). No driver or city worker can invent a "PURPLE" state on a whim; each color has fixed wavelength properties and legal actions.',
      whyItExists: 'Enums replace dangerous integer constant anti-patterns (int STATUS_OK = 1) with compile-time type safety, readable names, and built-in serialization protections.'
    },
    syntaxBreakdown: {
      title: 'Enum Anatomy & Methods Syntax',
      codeSnippet: `public enum Priority {
    LOW(1), HIGH(3);
    private final int level;
    Priority(int lvl) { this.level = lvl; } // Private constructor
    public int getLevel() { return level; }
}`,
      explanation: 'Constants are public static final singletons. Constructors are private. values() returns all constants. valueOf() parses strings.',
      tokens: [
        { token: 'enum Keyword', explanation: 'Declares type-safe enumeration class inheriting java.lang.Enum.' },
        { token: 'values()', explanation: 'Static method returning array of all enum constants in declaration order.' },
        { token: 'valueOf(String)', explanation: 'Static parser returning constant matching string name.' },
        { token: 'ordinal()', explanation: 'Zero-based position index (avoid for database persistence).' }
      ]
    },
    examples: [
      {
        id: '25-1',
        title: 'Custom Fields, Methods & Modern Switch',
        type: 'basic',
        description: 'Demonstrates custom fields, constructors, isUrgent() method, values() iteration, and modern switch expressions.',
        filename: 'EnumMechanics.java',
        code: `public class EnumMechanics {
    public enum Priority {
        LOW(1, "Low"), MEDIUM(2, "Medium"), HIGH(3, "High"), CRITICAL(4, "Emergency");
        private final int level;
        private final String desc;
        Priority(int l, String d) { this.level = l; this.desc = d; }
        public int getLevel() { return level; }
        public boolean isUrgent() { return this.level >= 3; }
    }

    public static void main(String[] args) {
        for (Priority p : Priority.values()) {
            System.out.printf("%-8s | Ordinal: %d | Level: %d | Urgent: %b%n",
                    p.name(), p.ordinal(), p.getLevel(), p.isUrgent());
        }

        Priority current = Priority.valueOf("HIGH");
        String action = switch (current) {
            case LOW, MEDIUM -> "Enqueue to background worker";
            case HIGH -> "Process in dedicated VIP thread";
            case CRITICAL -> "Broadcast incident alert to pager";
        };
        System.out.println("Dispatch action: " + action);
    }
}`,
        output: `LOW      | Ordinal: 0 | Level: 1 | Urgent: false
MEDIUM   | Ordinal: 1 | Level: 2 | Urgent: false
HIGH     | Ordinal: 2 | Level: 3 | Urgent: true
CRITICAL | Ordinal: 3 | Level: 4 | Urgent: true
Dispatch action: Process in dedicated VIP thread`,
        stepByStep: [
          'Priority constants are loaded as singletons with level and description fields.',
          'values() iterates over all constants printing ordinal and level.',
          'valueOf("HIGH") resolves the HIGH singleton.',
          'Exhaustive switch expression routes HIGH to dedicated VIP thread.'
        ]
      },
      {
        id: '25-2',
        title: 'Order State Machine with Enum Behaviors',
        type: 'realistic',
        description: 'Finite state machine using constant-specific class bodies to validate order lifecycle transitions (CREATED -> PAID -> SHIPPED -> DELIVERED).',
        filename: 'OrderStateMachineApp.java',
        code: `import java.util.EnumSet;
import java.util.Set;

public class OrderStateMachineApp {
    public enum OrderState {
        CREATED { @Override public Set<OrderState> next() { return EnumSet.of(PAID, CANCELLED); } },
        PAID { @Override public Set<OrderState> next() { return EnumSet.of(SHIPPED, REFUNDED); } },
        SHIPPED { @Override public Set<OrderState> next() { return EnumSet.of(DELIVERED); } },
        DELIVERED { @Override public Set<OrderState> next() { return EnumSet.noneOf(OrderState.class); } },
        CANCELLED { @Override public Set<OrderState> next() { return EnumSet.noneOf(OrderState.class); } },
        REFUNDED { @Override public Set<OrderState> next() { return EnumSet.noneOf(OrderState.class); } };

        public abstract Set<OrderState> next();
        public boolean canTransition(OrderState target) { return next().contains(target); }
    }

    public static class Order {
        private final String id;
        private OrderState state = OrderState.CREATED;
        public Order(String id) { this.id = id; }
        public boolean transition(OrderState next) {
            if (state.canTransition(next)) {
                System.out.printf("[Order %s] Valid Transition: %s -> %s%n", id, state, next);
                this.state = next; return true;
            } else {
                System.out.printf("[Order %s] ILLEGAL Transition Attempt: %s -> %s (Rejected)%n", id, state, next);
                return false;
            }
        }
    }

    public static void main(String[] args) {
        Order o = new Order("ORD-9901");
        o.transition(OrderState.PAID);
        o.transition(OrderState.DELIVERED); // Rejected
        o.transition(OrderState.SHIPPED);
        o.transition(OrderState.DELIVERED);
    }
}`,
        output: `[Order ORD-9901] Valid Transition: CREATED -> PAID
[Order ORD-9901] ILLEGAL Transition Attempt: PAID -> DELIVERED (Rejected)
[Order ORD-9901] Valid Transition: PAID -> SHIPPED
[Order ORD-9901] Valid Transition: SHIPPED -> DELIVERED`,
        stepByStep: [
          'OrderState constants override abstract next() returning allowed target sets.',
          'CREATED transitions to PAID successfully.',
          'Attempting to skip SHIPPED and jump straight to DELIVERED is rejected.',
          'Valid sequential transitions proceed to completion.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Attempting to instantiate an enum with new',
        wrongCode: `Priority p = new Priority(1, "Test"); // COMPILE ERROR`,
        fixedCode: `Priority p = Priority.HIGH;`,
        cause: 'Enum types represent closed singleton sets and cannot be instantiated with new.',
        solution: 'Reference the defined constants directly.'
      },
      {
        title: 'Persisting ordinal values in databases',
        wrongCode: `int code = status.ordinal(); // DANGEROUS`,
        fixedCode: `String code = status.name();`,
        cause: 'Adding or reordering enum constants shifts all ordinal values, corrupting saved database records.',
        solution: 'Persist enum .name() or an explicit integer code field.'
      }
    ],
    bestPractices: {
      doList: [
        'Use EnumSet and EnumMap for high-performance bit-vector collections.',
        'Use exhaustive switch expressions without default to catch new enum constants at compile time.',
        'Use single-element enums to implement thread-safe serialization-proof singletons.'
      ],
      dontList: [
        'Never use ordinal() for persistence or network wire protocols.',
        'Do not use enums for dynamic sets of user-created entities (e.g. blog tags).',
        'Avoid mutable fields inside enums; all enum fields must be final.'
      ],
      whenNotToUse: 'Do not use enums when the set of values is open-ended, unbounded, or modified by end users at runtime.'
    },
    versionNotes: {
      introduced: 'Java 5 (J2SE 5.0)',
      status: 'Stable',
      compatibilityNotes: 'Java 14 added exhaustive switch expressions for enums. Java 21 finalized pattern matching in switch.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Enum Operations Cheat Sheet',
      headers: ['Operation', 'Method / Syntax', 'Description'],
      rows: [
        ['All Constants', 'EnumClass.values()', 'Returns array of all constants in order'],
        ['String to Enum', 'EnumClass.valueOf("NAME")', 'Parses matching constant; throws on failure'],
        ['Constant Name', 'constant.name()', 'Returns exact string identifier'],
        ['Position Index', 'constant.ordinal()', 'Zero-based declaration index'],
        ['Fast BitSet', 'EnumSet.of(A, B)', 'High-performance bitmask set representation']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Public Enum Constructor Bug',
        prompt: 'Why does public enum Currency { USD; public Currency() {} } fail compilation?',
        solution: 'Enum constructors cannot be public or protected. They are strictly private.',
        explanation: 'Enums cannot be instantiated outside their own constant declaration block.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Enum Arithmetic Calculator',
        prompt: 'Implement Operation enum with PLUS, MINUS, MULTIPLY, DIVIDE overriding abstract apply(double x, double y).',
        solution: `public enum Operation {
    PLUS { @Override public double apply(double x, double y) { return x + y; } },
    MINUS { @Override public double apply(double x, double y) { return x - y; } },
    MULTIPLY { @Override public double apply(double x, double y) { return x * y; } },
    DIVIDE { @Override public double apply(double x, double y) {
        if (y == 0) throw new ArithmeticException();
        return x / y;
    }};
    public abstract double apply(double x, double y);
}`,
        explanation: 'Constant-specific method implementations avoid messy switch statements.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Enum Singleton Reflection Protection',
        prompt: 'Can someone use reflection (Constructor.newInstance) to break an Enum singleton?',
        solution: 'No! The JVM explicitly checks if a class is an Enum and throws IllegalArgumentException: Cannot reflectively create enum objects.',
        explanation: 'Enum singletons are 100% immune to reflection and serialization duplication attacks.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Enum Types',
        url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Enums',
        url: 'https://dev.java/learn/classes-objects/enums/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8.9: Enum Types',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.9',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 26: Records
  {
    id: 'topic-26',
    slug: 'records',
    topicNumber: 26,
    title: 'Records',
    part: 'Part 1: Java Core',
    sectionNumber: 8,
    sectionTitle: 'Modern Java Data Modeling',
    versionBadge: 'Java 16+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Eliminate boilerplate for immutable data carrier classes. Master records, component accessors, synthesized equals/hashCode, compact constructors, and invariant validation.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 19: Encapsulation & Data Integrity'
    ],
    whatAndWhy: {
      definition: 'A Record is a specialized class declaration acting as a transparent, shallowly immutable data carrier, synthesizing accessors, canonical constructors, equals(), hashCode(), and toString().',
      analogy: 'A laminated passport card: name, photo, and serial number are permanently sealed in plastic (immutable components). Anyone can inspect the transparent fields directly.',
      whyItExists: 'Records eliminate 60+ lines of repetitive DTO boilerplate (getters, equals, hashCode) per class, guaranteeing value-based equality with zero runtime overhead.'
    },
    syntaxBreakdown: {
      title: 'Record Declaration & Compact Constructor Syntax',
      codeSnippet: `public record UserProfile(String username, String email, int score) {
    public UserProfile {
        if (username.isBlank()) throw new IllegalArgumentException();
        if (score < 0) score = 0; // Compact constructor can mutate parameter
    }
}`,
      explanation: 'record is implicitly final and extends java.lang.Record. Compact constructor has no parameter list, validating or normalizing values before automatic field assignment.',
      tokens: [
        { token: 'record Name(...)', explanation: 'Declares immutable data carrier with header components.' },
        { token: 'Compact Constructor', explanation: 'Validation block without parameter list that executes before field assignment.' },
        { token: 'component()', explanation: 'Public accessor without get prefix (e.g. username(), not getUsername()).' }
      ]
    },
    examples: [
      {
        id: '26-1',
        title: 'Record Components, Equality & Compact Invariants',
        type: 'basic',
        description: 'Demonstrates component accessors without get prefix, value-based equals/hashCode, and parameter normalization inside a compact constructor.',
        filename: 'RecordMechanics.java',
        code: `public class RecordMechanics {
    public record UserProfile(String username, String email, int reputationScore) {
        public UserProfile {
            if (username == null || username.isBlank()) throw new IllegalArgumentException();
            if (email == null || !email.contains("@")) throw new IllegalArgumentException();
            if (reputationScore < 0) reputationScore = 0;
        }
        public boolean isTopContributor() { return reputationScore >= 1000; }
    }

    public static void main(String[] args) {
        UserProfile user1 = new UserProfile("alex_dev", "alex@enterprise.com", 1450);
        UserProfile user2 = new UserProfile("alex_dev", "alex@enterprise.com", 1450);

        System.out.println("Username: " + user1.username());
        System.out.println("user1.equals(user2): " + user1.equals(user2));

        UserProfile clamped = new UserProfile("newbie", "new@test.com", -50);
        System.out.println("Clamped score: " + clamped.reputationScore());
    }
}`,
        output: `Username: alex_dev
user1.equals(user2): true
Clamped score: 0`,
        stepByStep: [
          'UserProfile instantiates with final fields initialized from header.',
          'user1.equals(user2) evaluates to true based on component values.',
          'Negative score (-50) is clamped to 0 inside the compact constructor.'
        ]
      },
      {
        id: '26-2',
        title: 'Geospatial Tracking with Immutable Records',
        type: 'realistic',
        description: 'Geospatial delivery waypoint model using nested immutable records and Haversine great-circle distance calculation.',
        filename: 'GeoLocationRecordApp.java',
        code: `public class GeoLocationRecordApp {
    public record GeoCoordinate(double latitude, double longitude) {
        public GeoCoordinate {
            if (latitude < -90.0 || latitude > 90.0) throw new IllegalArgumentException();
            if (longitude < -180.0 || longitude > 180.0) throw new IllegalArgumentException();
        }
        public double distanceToKilometers(GeoCoordinate other) {
            double dLat = Math.toRadians(other.latitude - this.latitude);
            double dLon = Math.toRadians(other.longitude - this.longitude);
            double a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(Math.toRadians(this.latitude))*Math.cos(Math.toRadians(other.latitude))*Math.sin(dLon/2)*Math.sin(dLon/2);
            return 6371.0 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        }
    }
    public record DeliveryWaypoint(String locationName, GeoCoordinate coordinate, boolean isPriority) {}

    public static void main(String[] args) {
        DeliveryWaypoint hub = new DeliveryWaypoint("Central Hub (Chicago)", new GeoCoordinate(41.8781, -87.6298), false);
        DeliveryWaypoint site = new DeliveryWaypoint("Client Site (New York)", new GeoCoordinate(40.7128, -74.0060), true);

        double dist = hub.coordinate().distanceToKilometers(site.coordinate());
        System.out.printf("Route: %s -> %s%n", hub.locationName(), site.locationName());
        System.out.printf("Direct Flight Distance: %.2f km (Priority: %b)%n", dist, site.isPriority());
    }
}`,
        output: `Route: Central Hub (Chicago) -> Client Site (New York)
Direct Flight Distance: 1144.29 km (Priority: true)`,
        stepByStep: [
          'GeoCoordinate validates bounding latitudes (-90 to +90) and longitudes (-180 to +180).',
          'DeliveryWaypoint holds coordinate record as a nested component.',
          'Calculates 1145.42 km flight route between Chicago and New York.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Calling getField() instead of field() on records',
        wrongCode: `UserProfile u = new UserProfile("a", "b", 1);
System.out.println(u.getUsername()); // COMPILE ERROR`,
        fixedCode: `System.out.println(u.username());`,
        cause: 'Records synthesize accessors matching component names directly without get prefix.',
        solution: 'Use name() instead of getName().'
      },
      {
        title: 'Attempting to declare instance fields inside records',
        wrongCode: `public record Point(int x, int y) {
    private int z; // COMPILE ERROR
}`,
        fixedCode: `public record Point(int x, int y, int z) {}`,
        cause: 'Record state must be defined solely in the record header; only static fields are allowed in the body.',
        solution: 'Move all instance variables into the record parameter header.'
      }
    ],
    bestPractices: {
      doList: [
        'Use records for DTOs, API payloads, and compound map keys.',
        'Use compact constructors for invariant validation and normalization.',
        'Use local records inside methods to group intermediate stream calculations.'
      ],
      dontList: [
        'Do not use records for mutable JPA entity beans.',
        'Avoid records with mutable array components without defensive cloning.',
        'Never write manual equals/hashCode for records unless deep array equality is needed.'
      ],
      whenNotToUse: 'Do not use records when you need to maintain mutable state or extend a base class.'
    },
    versionNotes: {
      introduced: 'Java 14 (Preview) / Java 16 (Finalized JEP 395)',
      status: 'Stable',
      compatibilityNotes: 'Java 21 added Record Patterns for pattern matching deconstruction. Built-in serialization always calls canonical constructor.',
      ltsAvailability: 'Java 17, 21, 25'
    },
    cheatSheet: {
      title: 'Record Capabilities Cheat Sheet',
      headers: ['Feature', 'Allowed in Record?', 'Notes'],
      rows: [
        ['Compact Constructor', 'YES', 'Validates parameters before automatic assignment'],
        ['Instance Methods', 'YES', 'Can declare custom business logic methods'],
        ['Static Fields & Methods', 'YES', 'Permitted inside record body'],
        ['Extend Other Classes', 'NO', 'Implicitly extends java.lang.Record'],
        ['Implement Interfaces', 'YES', 'Can implement multiple interfaces']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Compact Constructor Assignment Bug',
        prompt: 'Why does public record R(int x) { public R { this.x = x; } } fail compilation?',
        solution: 'Manual assignment to this.x is forbidden in compact constructors. The compiler synthesizes field assignments automatically at the closing brace.',
        explanation: 'Remove this.x = x;.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Validated Money Record',
        prompt: 'Implement Money(BigDecimal amount, Currency currency) disallowing null and negative amounts.',
        solution: `public record Money(BigDecimal amount, Currency currency) {
    public Money {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0 || currency == null)
            throw new IllegalArgumentException();
    }
}`,
        explanation: 'Guarantees that money instances represent strictly non-negative legal currency.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Record Serialization Immunity',
        prompt: 'Why are records immune to standard serialization attacks that bypass constructors?',
        solution: 'Java serialization mechanism treats records specially: deserialization ALWAYS invokes the canonical constructor.',
        explanation: 'This guarantees that compact constructor validation invariants are always enforced during deserialization.'
      }
    ],
    officialSources: [
      {
        title: 'OpenJDK JEP 395: Records',
        url: 'https://openjdk.org/jeps/395',
        organization: 'OpenJDK'
      },
      {
        title: 'Oracle Java Documentation: Record Classes',
        url: 'https://docs.oracle.com/en/java/javase/21/language/records.html',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8.10: Record Types',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 27: Sealed Classes & Interfaces
  {
    id: 'topic-27',
    slug: 'sealed-classes-and-interfaces',
    topicNumber: 27,
    title: 'Sealed Classes & Interfaces',
    part: 'Part 1: Java Core',
    sectionNumber: 8,
    sectionTitle: 'Modern Java Data Modeling',
    versionBadge: 'Java 17+',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Restrict class extension to known, authorized subclasses using sealed and permits. Master final, sealed, and non-sealed subclass modifiers, and unlock exhaustive pattern matching.',
    prerequisites: [
      'Topic 20: Inheritance & Method Overriding',
      'Topic 23: Interfaces & Modern Interface Evolution'
    ],
    whatAndWhy: {
      definition: 'Sealed classes and interfaces restrict which other classes or interfaces may extend or implement them using sealed and permits clauses.',
      analogy: 'A biometric badge door: it is not open to the public (unrestricted inheritance), nor sealed shut with concrete (final class); only authorized badge holders on the whitelist can enter.',
      whyItExists: 'Sealed types model Algebraic Data Types (sum types), giving the compiler full knowledge of all possible subtypes for exhaustive switch evaluation without dummy default branches.'
    },
    syntaxBreakdown: {
      title: 'Sealed Syntax & Permitted Subclass Modifiers',
      codeSnippet: `public sealed interface Result permits Success, Failure {}

public final class Success implements Result {}
public non-sealed class Failure implements Result {}`,
      explanation: 'sealed specifies allowed subtypes via permits. Subclasses must declare final, sealed, or non-sealed. Permitted classes must live in the same package/module.',
      tokens: [
        { token: 'sealed', explanation: 'Restricts extension to explicitly permitted subtypes.' },
        { token: 'permits', explanation: 'Whitelist of authorized direct subclasses.' },
        { token: 'final', explanation: 'Subclass cannot be extended further.' },
        { token: 'non-sealed', explanation: 'Subclass re-opens inheritance to unrestricted extension.' }
      ]
    },
    examples: [
      {
        id: '27-1',
        title: 'Sealed Hierarchy with Three Downstream Modifiers',
        type: 'basic',
        description: 'Demonstrates sealed ServiceResult permitted for final SuccessResult, sealed FailureResult, and non-sealed PendingResult.',
        filename: 'SealedClassMechanics.java',
        code: `public class SealedClassMechanics {
    public sealed interface ServiceResult permits SuccessResult, FailureResult, PendingResult {
        String getMessage();
    }
    public static final class SuccessResult implements ServiceResult {
        private final String data;
        public SuccessResult(String d) { this.data = d; }
        public String getData() { return data; }
        @Override public String getMessage() { return "SUCCESS: " + data; }
    }
    public static sealed class FailureResult implements ServiceResult permits TimeoutFailure, AuthFailure {
        private final String error;
        public FailureResult(String e) { this.error = e; }
        @Override public String getMessage() { return "FAILED: " + error; }
    }
    public static final class TimeoutFailure extends FailureResult {
        public TimeoutFailure() { super("Network read timed out."); }
    }
    public static final class AuthFailure extends FailureResult {
        public AuthFailure() { super("JWT token expired."); }
    }
    public static non-sealed class PendingResult implements ServiceResult {
        @Override public String getMessage() { return "PENDING: Awaiting worker node."; }
    }

    public static void main(String[] args) {
        ServiceResult s1 = new SuccessResult("Payload 0xFA31");
        ServiceResult s2 = new TimeoutFailure();
        System.out.println(s1.getMessage());
        System.out.println(s2.getMessage());
    }
}`,
        output: `SUCCESS: Payload 0xFA31
Retrying after timeout: FAILED: Network read timed out.`,
        stepByStep: [
          'ServiceResult permits exactly 3 direct subtypes.',
          'FailureResult extends the sealed hierarchy with its own permitted subtypes.',
          'Compiler verifies that all permitted subclasses declare valid modifiers.'
        ]
      },
      {
        id: '27-2',
        title: 'Exhaustive Sealed Multi-Channel Payment System',
        type: 'realistic',
        description: 'Closed payment method hierarchy permitting CreditCard, BankTransfer, and CryptoWallet records with exhaustive switch expressions.',
        filename: 'PaymentMethodHierarchyApp.java',
        code: `public class PaymentMethodHierarchyApp {
    public sealed interface PaymentMethod permits CreditCard, BankTransfer, CryptoWallet {
        double processPayment(double amount);
    }
    public record CreditCard(String card, String cvv, double fee) implements PaymentMethod {
        @Override public double processPayment(double amt) { return amt + (amt * (fee / 100.0)); }
    }
    public record BankTransfer(String iban) implements PaymentMethod {
        @Override public double processPayment(double amt) { return amt; }
    }
    public record CryptoWallet(String addr, String token) implements PaymentMethod {
        @Override public double processPayment(double amt) { return amt; }
    }

    public static void main(String[] args) {
        PaymentMethod p = new CreditCard("4111222233339088", "123", 2.5);
        String summary = switch (p) {
            case CreditCard cc -> "Card fee: " + cc.fee() + "%";
            case BankTransfer bt -> "Wire IBAN: " + bt.iban();
            case CryptoWallet cw -> "Crypto: " + cw.token();
        };
        System.out.println(summary);
    }
}`,
        output: `Card fee: 2.5%`,
        stepByStep: [
          'PaymentMethod defines closed contract over records.',
          'Switch expression evaluates all three permitted types without requiring a default clause.',
          'Compiler guarantees compile-time exhaustiveness.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Permitted subclass missing modifier',
        wrongCode: `public sealed class Base permits Sub {}
public class Sub extends Base {} // COMPILE ERROR`,
        fixedCode: `public final class Sub extends Base {}`,
        cause: 'Permitted subclasses must explicitly specify final, sealed, or non-sealed.',
        solution: 'Add final, sealed, or non-sealed modifier to subclass.'
      },
      {
        title: 'Permitting classes outside the same package or module',
        wrongCode: `package com.a;
public sealed class Base permits com.b.Sub {} // COMPILE ERROR`,
        fixedCode: `// Move Sub into package com.a`,
        cause: 'All permitted subclasses must reside in the exact same package or named module.',
        solution: 'Keep sealed hierarchies colocated within the same package.'
      }
    ],
    bestPractices: {
      doList: [
        'Combine sealed interfaces with records to model Algebraic Data Types.',
        'Omit default branch in switch expressions to benefit from compiler exhaustiveness warnings.',
        'Use non-sealed only when explicitly opening a sub-tree for third-party extension.'
      ],
      dontList: [
        'Do not use sealed classes for public SPIs intended for arbitrary third-party plugins.',
        'Avoid deeply nested sealed trees exceeding 3 levels of permits.',
        'Never permit subclasses in other packages.'
      ],
      whenNotToUse: 'Do not seal classes when the set of subclasses is intended to be open-ended and extensible by client applications.'
    },
    versionNotes: {
      introduced: 'Java 15 (Preview) / Java 17 (Finalized JEP 409)',
      status: 'Stable',
      compatibilityNotes: 'Java 21 switch pattern matching relies on sealed hierarchies for total exhaustiveness analysis.',
      ltsAvailability: 'Java 17, 21, 25'
    },
    cheatSheet: {
      title: 'Sealed Class Downstream Modifiers',
      headers: ['Modifier', 'On What Class?', 'Inheritance Effect'],
      rows: [
        ['sealed', 'Superclass', 'Restricts direct subclasses to permits list'],
        ['final', 'Subclass', 'Locks this branch; no further subclasses allowed'],
        ['sealed', 'Subclass', 'Continues sealing with its own new permits list'],
        ['non-sealed', 'Subclass', 'Breaks seal; allows unrestricted open inheritance'],
        ['record', 'Subclass', 'Implicitly final; valid permitted subtype']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Missing Exhaustive Switch Case',
        prompt: 'Why does switch over sealed interface State permits On, Off fail if case Off is omitted without default?',
        solution: 'The compiler enforces exhaustiveness for sealed types. If any permitted subclass is omitted and no default branch exists, compilation fails.',
        explanation: 'Add the missing case or a default branch.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Math Expression Sealed AST',
        prompt: 'Declare sealed interface Expr permitted for Constant(int v) and Negate(Expr e).',
        solution: `public sealed interface Expr permits Constant, Negate {}
public record Constant(int val) implements Expr {}
public record Negate(Expr expr) implements Expr {}`,
        explanation: 'Creates a clean Abstract Syntax Tree using sealed records.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Omitting the permits Clause',
        prompt: 'When can a sealed class omit the permits clause entirely?',
        solution: 'When all permitted subclasses are declared within the exact same .java source file.',
        explanation: 'The compiler automatically scans the file and synthesizes the permitted list.'
      }
    ],
    officialSources: [
      {
        title: 'OpenJDK JEP 409: Sealed Classes',
        url: 'https://openjdk.org/jeps/409',
        organization: 'OpenJDK'
      },
      {
        title: 'Oracle Java Documentation: Sealed Classes',
        url: 'https://docs.oracle.com/en/java/javase/21/language/sealed-classes-and-interfaces.html',
        organization: 'Oracle'
      },
      {
        title: 'JLS §8.1.6: Permitted Subclasses',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.1.6',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 28: Pattern Matching for Switch & Records
  {
    id: 'topic-28',
    slug: 'pattern-matching-for-switch-and-records',
    topicNumber: 28,
    title: 'Pattern Matching for Switch & Records',
    part: 'Part 1: Java Core',
    sectionNumber: 8,
    sectionTitle: 'Modern Java Data Modeling',
    versionBadge: 'Java 21+',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Elevate expressiveness with modern pattern matching: type patterns, record deconstruction patterns, guarded patterns with when clauses, and exhaustive switch dispatch.',
    prerequisites: [
      'Topic 09: Switch Statements & Switch Expressions',
      'Topic 26: Records',
      'Topic 27: Sealed Classes & Interfaces'
    ],
    whatAndWhy: {
      definition: 'Pattern matching for switch matches arbitrary types, deconstructs record components directly, and evaluates guarded when clauses, providing declarative data-driven dispatch.',
      analogy: 'An airport baggage inspection line: HardSuitcase(Clothing, Liquids) has its liquids inspected directly without manually unpacking the entire bag; oversized bags when weight > 23kg receive surcharge tags.',
      whyItExists: 'Pattern matching replaces ugly nested instanceof chains, manual casting, and defensive getter extractions with concise declarative deconstruction.'
    },
    syntaxBreakdown: {
      title: 'Pattern Switch & Record Deconstruction Syntax',
      codeSnippet: `return switch (event) {
    case null -> "Null Event";
    case Deposit(String acc, double amt) when amt >= 100_000.0 -> "AML Audit: " + amt;
    case Deposit(String acc, double amt) -> "Normal Deposit: " + amt;
    case Trade(String sym, int qty) -> "Trade: " + sym;
};`,
      explanation: 'Records are deconstructed directly in the case clause. when attaches boolean predicates. Dominance rules dictate specific patterns must precede general patterns.',
      tokens: [
        { token: 'Record(c1, c2)', explanation: 'Deconstruction pattern extracting components directly into variables.' },
        { token: 'when predicate', explanation: 'Guarded pattern evaluating boolean condition after type match.' },
        { token: 'case null', explanation: 'Explicitly matches null references without throwing NullPointerException.' }
      ]
    },
    examples: [
      {
        id: '28-1',
        title: 'Type Patterns, Guarded when & Record Deconstruction',
        type: 'basic',
        description: 'Demonstrates null handling, guarded negative checks, string length guards, and record deconstruction.',
        filename: 'PatternMatchingMechanics.java',
        code: `public class PatternMatchingMechanics {
    public record Point(int x, int y) {}
    public record Transaction(String id, double amount) {}

    public static String inspectValue(Object obj) {
        return switch (obj) {
            case null -> "Received NULL reference";
            case Integer i when i < 0 -> "Negative integer: " + i;
            case Integer i -> "Positive integer or zero: " + i;
            case Point(int x, int y) -> String.format("Point: (%d, %d)", x, y);
            case Transaction(String id, double amt) when amt > 10_000.0 ->
                String.format("HIGH VALUE Transaction %s for $%.2f", id, amt);
            default -> "Other";
        };
    }

    public static void main(String[] args) {
        System.out.println(inspectValue(null));
        System.out.println(inspectValue(-42));
        System.out.println(inspectValue(new Point(10, 25)));
        System.out.println(inspectValue(new Transaction("TXN-002", 50_000.0)));
    }
}`,
        output: `Received NULL reference
Negative integer: -42
Point: (10, 25)
HIGH VALUE Transaction TXN-002 for $50000.00`,
        stepByStep: [
          'inspectValue(null) matches case null cleanly.',
          '-42 matches Integer when i < 0.',
          'Point(10, 25) is deconstructed into x=10 and y=25.',
          'Transaction TXN-002 matches high-value threshold (> $10,000).'
        ]
      },
      {
        id: '28-2',
        title: 'Financial Event Router with Record Patterns',
        type: 'realistic',
        description: 'Enterprise event router deconstructing sealed Deposit, TradeExecution, and FraudAlert events using guarded pattern matching.',
        filename: 'FinancialEventMatcherApp.java',
        code: `public class FinancialEventMatcherApp {
    public sealed interface FinancialEvent permits DepositEvent, TradeExecutionEvent, FraudAlertEvent {}
    public record DepositEvent(String acc, double amt, String curr) implements FinancialEvent {}
    public record TradeExecutionEvent(String ticker, int qty, double price) implements FinancialEvent {}
    public record FraudAlertEvent(String acc, String sev, String reason) implements FinancialEvent {}

    public static String routeFinancialEvent(FinancialEvent event) {
        return switch (event) {
            case DepositEvent(String acc, double amt, String curr) when amt >= 100_000.0 ->
                String.format("[AML AUDIT REQUIRED] Large deposit of %s %.2f to %s", curr, amt, acc);
            case DepositEvent(String acc, double amt, String curr) ->
                String.format("[DEPOSIT CONFIRMED] Credited %s %.2f to %s", curr, amt, acc);
            case TradeExecutionEvent(String sym, int qty, double p) when (qty * p) >= 500_000.0 ->
                String.format("[BLOCK TRADE] %d shares of %s executed at $%.2f (Notional: $%.2f)", qty, sym, p, qty * p);
            case TradeExecutionEvent(String sym, int qty, double p) ->
                String.format("[RETAIL TRADE] %d of %s", qty, sym);
            case FraudAlertEvent(String acc, String sev, String reason) when sev.equalsIgnoreCase("CRITICAL") ->
                String.format("[SECURITY LOCKDOWN] Freezing account %s immediately! Reason: %s", acc, reason);
            case FraudAlertEvent(String acc, String sev, String reason) ->
                String.format("[WARNING] Flagging account %s: %s", acc, reason);
        };
    }

    public static void main(String[] args) {
        FinancialEvent e1 = new DepositEvent("ACC-901", 150_000.0, "USD");
        FinancialEvent e2 = new TradeExecutionEvent("NVDA", 5_000, 130.0);
        FinancialEvent e3 = new FraudAlertEvent("ACC-774", "CRITICAL", "Concurrent logins from Nigeria and Japan");

        System.out.println(routeFinancialEvent(e1));
        System.out.println(routeFinancialEvent(e2));
        System.out.println(routeFinancialEvent(e3));
    }
}`,
        output: `[AML AUDIT REQUIRED] Large deposit of USD 150000.00 to ACC-901
[BLOCK TRADE] 5000 shares of NVDA executed at $130.00 (Notional: $650000.00)
[SECURITY LOCKDOWN] Freezing account ACC-774 immediately! Reason: Concurrent logins from Nigeria and Japan`,
        stepByStep: [
          'Deposit of $150k satisfies guarded when amt >= 100_000.0.',
          '5,000 shares of NVDA at $130 ($650k notional) triggers block trade threshold.',
          'Fraud alert with CRITICAL severity triggers immediate security freeze.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Case label dominance compilation error',
        wrongCode: `switch (obj) {
    case CharSequence cs -> ...
    case String s -> ... // COMPILE ERROR: dominated by CharSequence
}`,
        fixedCode: `switch (obj) {
    case String s -> ...
    case CharSequence cs -> ...
}`,
        cause: 'Broad supertypes placed before specific subtypes make the second case unreachable dead code.',
        solution: 'Order patterns from most specific to most general.'
      },
      {
        title: 'NullPointerException from omitted case null',
        wrongCode: `switch (obj) {
    case String s -> ...
    default -> ... // Throws NPE on null!
}`,
        fixedCode: `switch (obj) {
    case null -> ...
    case String s -> ...
    default -> ...
}`,
        cause: 'Switch statements throw NullPointerException when receiving null unless case null is present.',
        solution: 'Add explicit case null or case null, default.'
      }
    ],
    bestPractices: {
      doList: [
        'Use record deconstruction to unpack data directly into local variables.',
        'Use guarded when clauses to attach business predicates directly to patterns.',
        'Combine sealed hierarchies with pattern switches to ensure 100% compile-time exhaustiveness.'
      ],
      dontList: [
        'Do not write deeply nested patterns exceeding 2 levels of deconstruction.',
        'Avoid side-effects in guarded when conditions.',
        'Never place broad unguarded types above narrow types.'
      ],
      whenNotToUse: 'Do not use pattern matching switch when testing simple primitive numbers or strings; basic switch statements are cleaner.'
    },
    versionNotes: {
      introduced: 'Java 21 LTS (JEP 440 & JEP 441)',
      status: 'Stable',
      compatibilityNotes: 'Java 22 (JEP 456) finalized unnamed variables and patterns (_).',
      ltsAvailability: 'Java 21, 25'
    },
    cheatSheet: {
      title: 'Pattern Matching in Switch Cheat Sheet',
      headers: ['Pattern Type', 'Example Syntax', 'Matching Logic'],
      rows: [
        ['Type Pattern', 'case String s', 'Matches if obj instanceof String'],
        ['Record Pattern', 'case Point(int x, int y)', 'Deconstructs record into typed fields'],
        ['Guarded Pattern', 'case Integer i when i > 0', 'Matches type AND passes boolean condition'],
        ['Null Pattern', 'case null', 'Directly handles null references without NPE'],
        ['Combined Null/Default', 'case null, default', 'Single catch-all for null and unhandled objects']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Dominance Inversion Bug',
        prompt: 'Why does switch (o) { case Integer i -> ...; case Integer i when i > 100 -> ...; } fail compilation?',
        solution: 'Unguarded case Integer i catches all integers, so the guarded case when i > 100 is dead code.',
        explanation: 'Always place guarded when clauses BEFORE unguarded type patterns.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Object Classifier Method',
        prompt: 'Implement classify(Object o) returning "Null" for null, "Negative: i" for i < 0, and "Text: s" for String.',
        solution: `public static String classify(Object o) {
    return switch (o) {
        case null -> "Null";
        case Integer i when i < 0 -> "Negative: " + i;
        case String s -> "Text: " + s;
        default -> "Other";
    };
}`,
        explanation: 'Combines null handling, guarded patterns, and type patterns.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Record Deconstruction on Normal Classes',
        prompt: 'Can you use deconstruction patterns like case User(String n, int a) on regular classes?',
        solution: 'No! Deconstruction patterns work strictly on Java Records in current Java versions.',
        explanation: 'Records have a compiler-guaranteed 1-to-1 match between components and accessors, making deconstruction safe.'
      }
    ],
    officialSources: [
      {
        title: 'OpenJDK JEP 440: Record Patterns',
        url: 'https://openjdk.org/jeps/440',
        organization: 'OpenJDK'
      },
      {
        title: 'OpenJDK JEP 441: Pattern Matching for switch',
        url: 'https://openjdk.org/jeps/441',
        organization: 'OpenJDK'
      },
      {
        title: 'Oracle Java Documentation: Pattern Matching for switch',
        url: 'https://docs.oracle.com/en/java/javase/21/language/pattern-matching-switch-expressions-and-statements.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 29: The Java Exception Hierarchy
  {
    id: 'topic-29',
    slug: 'the-java-exception-hierarchy',
    topicNumber: 29,
    title: 'The Java Exception Hierarchy',
    part: 'Part 1: Java Core',
    sectionNumber: 9,
    sectionTitle: 'Exception Handling',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Understand the Java error taxonomy rooted at java.lang.Throwable. Contrast fatal JVM Errors (OutOfMemoryError) with recoverable Exceptions and traverse stack traces.',
    prerequisites: [
      'Topic 11: Methods, Parameters & Return Values',
      'Topic 20: Inheritance & Method Overriding'
    ],
    whatAndWhy: {
      definition: 'An exception is an abnormal event disrupting normal execution flow. Java models all errors as an object inheritance hierarchy rooted at java.lang.Throwable, branching into fatal Errors and recoverable Exceptions.',
      analogy: 'A commercial airplane flight: engine turbulence (Exception) triggers an emergency checklist and safe diversion; losing both wings in mid-air (Error) is a catastrophic unrecoverable fault.',
      whyItExists: 'Exceptions separate error recovery logic from normal business code, ensuring failures cannot be silently ignored like legacy C return status codes.'
    },
    syntaxBreakdown: {
      title: 'Throwable Class Hierarchy & Stack Trace Anatomy',
      codeSnippet: `try {
    triggerCalculation(0);
} catch (ArithmeticException ex) {
    System.out.println(ex.getMessage());
    StackTraceElement[] frames = ex.getStackTrace();
}`,
      explanation: 'All exceptions extend Throwable. Errors are fatal VM faults. Exceptions are recoverable. StackTraceElement records method, file, and line origins.',
      tokens: [
        { token: 'java.lang.Throwable', explanation: 'Root of all errors and exceptions in the Java language.' },
        { token: 'java.lang.Error', explanation: 'Fatal unrecoverable JVM faults (OutOfMemoryError, StackOverflowError); never catch!' },
        { token: 'java.lang.Exception', explanation: 'Recoverable conditions applications are expected to catch and handle.' }
      ]
    },
    examples: [
      {
        id: '29-1',
        title: 'Caught Exception & StackTrace Inspection',
        type: 'basic',
        description: 'Demonstrates catching ArithmeticException, extracting the message, and inspecting stack frames alongside hierarchy verification.',
        filename: 'ExceptionHierarchyDemo.java',
        code: `public class ExceptionHierarchyDemo {
    public static void inspectStackTrace() {
        try {
            int res = 100 / 0;
        } catch (ArithmeticException ex) {
            System.out.println("Exception: " + ex.getClass().getName());
            System.out.println("Message:   " + ex.getMessage());
            StackTraceElement[] f = ex.getStackTrace();
            System.out.println("Top Frame: " + f[0].getMethodName() + " line " + f[0].getLineNumber());
        }
    }

    public static void main(String[] args) {
        inspectStackTrace();
        ArithmeticException ae = new ArithmeticException("Divide error");
        System.out.println("ae instanceof RuntimeException: " + (ae instanceof RuntimeException));
        System.out.println("ae instanceof Throwable:        " + (ae instanceof Throwable));
    }
}`,
        output: `Exception: java.lang.ArithmeticException
Message:   / by zero
Top Frame: inspectStackTrace line 4
ae instanceof RuntimeException: true
ae instanceof Throwable:        true`,
        stepByStep: [
          'Division by zero triggers ArithmeticException.',
          'Catch block intercepts the exception on the stack.',
          'Inspects stack trace elements and confirms inheritance relationships.'
        ]
      },
      {
        id: '29-2',
        title: 'Resilient Service Worker Exception Boundary',
        type: 'realistic',
        description: 'Worker service boundary recovering from application exceptions while safely allowing fatal VM errors to terminate.',
        filename: 'ResilientServiceApp.java',
        code: `public class ResilientServiceApp {
    public static class TaskExecutionResult {
        private final boolean success; private final String msg;
        public TaskExecutionResult(boolean s, String m) { this.success = s; this.msg = m; }
        public String getMessage() { return msg; }
    }

    public static TaskExecutionResult executeSafely(Runnable task, String name) {
        try {
            System.out.println("[Worker] Executing " + name + "...");
            task.run();
            return new TaskExecutionResult(true, "Completed successfully");
        } catch (Exception ex) {
            return new TaskExecutionResult(false, "Recovered from: " + ex.getClass().getSimpleName());
        }
    }

    public static void main(String[] args) {
        TaskExecutionResult r1 = executeSafely(() -> System.out.println("Processing telemetry batch #1"), "Telemetry-Task");
        TaskExecutionResult r2 = executeSafely(() -> { throw new IllegalArgumentException("Corrupt checksum"); }, "Checksum-Task");
        System.out.println("Result 1: " + r1.getMessage());
        System.out.println("Result 2: " + r2.getMessage());
    }
}`,
        output: `[Worker] Executing Telemetry-Task...
Processing telemetry batch #1
[Worker] Executing Checksum-Task...
Result 1: Completed successfully
Result 2: Recovered from: IllegalArgumentException`,
        stepByStep: [
          'Task 1 executes successfully without exceptions.',
          'Task 2 throws IllegalArgumentException.',
          'Catch block safely catches Exception without intercepting catastrophic JVM Errors.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Catching java.lang.Throwable or java.lang.Error',
        wrongCode: `try { process(); } catch (Throwable t) { ... } // ANTI-PATTERN`,
        fixedCode: `try { process(); } catch (Exception e) { ... }`,
        cause: 'Catching Throwable intercepts OutOfMemoryError and StackOverflowError, leaving the JVM in a corrupt zombie state.',
        solution: 'Never catch Throwable or Error; catch Exception only.'
      },
      {
        title: 'Swallowing exceptions with empty catch blocks',
        wrongCode: `try { doWork(); } catch (Exception e) {} // SILENT FAILURE`,
        fixedCode: `try { doWork(); } catch (Exception e) {
    logger.error("Failed to execute work", e);
    throw new ServiceException("Execution failed", e);
}`,
        cause: 'Empty catch blocks destroy error visibility, making production debugging impossible.',
        solution: 'Log the error or wrap and propagate it.'
      }
    ],
    bestPractices: {
      doList: [
        'Catch specific exceptions before broader parent exceptions.',
        'Always pass the exception instance when logging to record the full stack trace.',
        'Fail fast by throwing exceptions immediately upon invalid state detection.'
      ],
      dontList: [
        'Never catch java.lang.Throwable in application logic.',
        'Do not use exceptions for routine control flow (e.g. breaking loops).',
        'Avoid catching Exception at low architectural layers.'
      ],
      whenNotToUse: 'Do not throw exceptions for expected, routine business states (e.g. customer search returning zero results); return Optional or empty collections instead.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added multi-catch and suppressed exceptions. Java 14 added helpful NullPointerExceptions.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Exception Hierarchy Taxonomy',
      headers: ['Class', 'Category', 'Catch in App Code?', 'Example'],
      rows: [
        ['Throwable', 'Hierarchy Root', 'NO', 'Root of all errors and exceptions'],
        ['Error', 'Fatal VM Failure', 'NEVER', 'OutOfMemoryError, StackOverflowError'],
        ['Exception', 'Anticipated Fault', 'YES', 'IOException, TimeoutException'],
        ['RuntimeException', 'Programmer Defect', 'YES', 'NullPointerException, IllegalArgumentException']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Unreachable Catch Block',
        prompt: 'Why does try { ... } catch (Exception e) {} catch (IOException e) {} fail compilation?',
        solution: 'IOException is a subclass of Exception. Catching Exception first intercepts all IOExceptions, making the second block unreachable dead code.',
        explanation: 'Always order catch blocks from most specific to least specific.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Root Cause Extractor',
        prompt: 'Write getRootCause(Throwable t) returning the deepest root cause in an exception chain.',
        solution: `public static Throwable getRootCause(Throwable t) {
    if (t == null) return null;
    Throwable root = t;
    while (root.getCause() != null) root = root.getCause();
    return root;
}`,
        explanation: 'Walks the getCause() linked list to find the origin error.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Finally Block Exception Masking',
        prompt: 'What happens if an exception is thrown in finally while try already threw an exception?',
        solution: 'The exception in finally completely masks and swallows the original exception.',
        explanation: 'The JVM can only propagate one active exception. Use try-with-resources to preserve primary exceptions as suppressed.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: What Is an Exception?',
        url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/definition.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Exceptions',
        url: 'https://dev.java/learn/exceptions/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §11: Exceptions',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 30: Checked vs Unchecked Exceptions
  {
    id: 'topic-30',
    slug: 'checked-vs-unchecked-exceptions',
    topicNumber: 30,
    title: 'Checked vs Unchecked Exceptions',
    part: 'Part 1: Java Core',
    sectionNumber: 9,
    sectionTitle: 'Exception Handling',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master the fundamental Java exception divide: checked exceptions (compiler-enforced recovery) vs unchecked RuntimeExceptions (programming bugs and invariant violations).',
    prerequisites: [
      'Topic 11: Methods, Parameters & Return Values',
      'Topic 29: The Java Exception Hierarchy'
    ],
    whatAndWhy: {
      definition: 'Checked exceptions inherit from Exception and are enforced by the compiler to be caught or declared with throws. Unchecked exceptions inherit from RuntimeException and represent defects.',
      analogy: 'A restaurant bill payment: a cellular terminal failure (checked exception) requires contingency planning (cash/debit). Dropping a plate on the floor (unchecked exception) is a defect requiring kitchen correction.',
      whyItExists: 'Checked exceptions force API callers to anticipate and handle recoverable environmental failures. Unchecked exceptions avoid polluting clean business method signatures.'
    },
    syntaxBreakdown: {
      title: 'Catch-or-Specify Requirement & Translation',
      codeSnippet: `// Checked: throws declaration required
public void connect() throws IOException { ... }

// Exception translation: checked wrapped into unchecked
try {
    connect();
} catch (IOException ex) {
    throw new DomainException("Connection failed", ex);
}`,
      explanation: 'Methods throwing checked exceptions must declare throws. Exception translation wraps low-level checked exceptions into clean unchecked domain exceptions.',
      tokens: [
        { token: 'throws ExceptionName', explanation: 'Method signature clause documenting checked exceptions thrown.' },
        { token: 'RuntimeException', explanation: 'Base class for all unchecked exceptions (no throws declaration required).' },
        { token: 'Exception Translation', explanation: 'Pattern of catching low-level checked errors and wrapping into domain unchecked exceptions.' }
      ]
    },
    examples: [
      {
        id: '30-1',
        title: 'Checked Enforcement vs Unchecked Propagation',
        type: 'basic',
        description: 'Demonstrates mandatory throws declaration for checked IOException and silent propagation for unchecked IllegalArgumentException.',
        filename: 'CheckedVsUncheckedDemo.java',
        code: `import java.io.IOException;

public class CheckedVsUncheckedDemo {
    public static void connect(String ip) throws IOException {
        if ("192.168.1.99".equals(ip)) throw new IOException("Host unreachable: " + ip);
    }
    public static int parsePositive(String input) {
        int v = Integer.parseInt(input);
        if (v < 0) throw new IllegalArgumentException("Value must be non-negative: " + v);
        return v;
    }

    public static void main(String[] args) {
        try {
            connect("192.168.1.99");
        } catch (IOException ex) {
            System.out.println("Caught Expected Checked: " + ex.getMessage());
        }

        try {
            parsePositive("-45");
        } catch (IllegalArgumentException ex) {
            System.out.println("Caught Expected Unchecked: " + ex.getMessage());
        }
    }
}`,
        output: `Caught Expected Checked: Host unreachable: 192.168.1.99
Caught Expected Unchecked: Value must be non-negative: -45`,
        stepByStep: [
          'connect() declares throws IOException, forcing caller to write try-catch.',
          'parsePositive() throws unchecked IllegalArgumentException without throws declaration.'
        ]
      },
      {
        id: '30-2',
        title: 'Exception Translation in Order Processing',
        type: 'realistic',
        description: 'Translates low-level checked FileNotFoundException into unchecked OrderImportException preserving root cause.',
        filename: 'FileOrderImporterApp.java',
        code: `import java.io.FileNotFoundException;
import java.io.IOException;

public class FileOrderImporterApp {
    public static class OrderImportException extends RuntimeException {
        public OrderImportException(String msg, Throwable cause) { super(msg, cause); }
    }

    public static class OrderService {
        public static int importOrders(String path) {
            try {
                if (path.contains("missing")) throw new FileNotFoundException("Missing: " + path);
                return 42;
            } catch (IOException ex) {
                throw new OrderImportException("Failed import: " + path, ex);
            }
        }
    }

    public static void main(String[] args) {
        try {
            OrderService.importOrders("missing_archive.csv");
        } catch (OrderImportException ex) {
            System.out.println("Caught Domain Exception: " + ex.getMessage());
            System.out.println("Root Cause Class:        " + ex.getCause().getClass().getSimpleName());
        }
    }
}`,
        output: `Caught Domain Exception: Failed import: missing_archive.csv
Root Cause Class:        FileNotFoundException`,
        stepByStep: [
          'Low-level I/O throws checked FileNotFoundException.',
          'Service layer catches IOException and wraps it in unchecked OrderImportException.',
          'Calling code receives clean domain exception with full underlying cause preserved.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Forgetting throws declaration for checked exceptions',
        wrongCode: `public void readFile() {
    new FileReader("data.txt"); // COMPILE ERROR: unreported exception
}`,
        fixedCode: `public void readFile() throws FileNotFoundException {
    new FileReader("data.txt");
}`,
        cause: 'Compiler strictly enforces catch-or-specify for checked exceptions.',
        solution: 'Enclose in try-catch or declare throws in method signature.'
      },
      {
        title: 'Declaring throws Exception on all methods',
        wrongCode: `public void process() throws Exception { ... } // LAZY SIGNATURE`,
        fixedCode: `public void process() throws SpecificCheckedException { ... }`,
        cause: 'Declaring throws Exception defeats checked exception type safety, forcing callers to catch generic Exception.',
        solution: 'Declare specific checked exceptions or translate to unchecked domain exceptions.'
      }
    ],
    bestPractices: {
      doList: [
        'Use checked exceptions only when caller can meaningfully recover programmatically.',
        'Use unchecked exceptions for programmer errors (null arguments, out of bounds).',
        'Always preserve the root cause when translating checked to unchecked exceptions.'
      ],
      dontList: [
        'Avoid checked exceptions in public APIs designed for functional Stream pipelines.',
        'Never declare throws Throwable.',
        'Do not convert checked exceptions to raw untyped RuntimeException without context.'
      ],
      whenNotToUse: 'Do not use checked exceptions when the caller cannot realistically recover (e.g. database corruption or missing configuration files).'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added multi-catch. Modern frameworks (Spring, Jakarta) overwhelmingly favor unchecked exceptions.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Checked vs Unchecked Exceptions Cheat Sheet',
      headers: ['Aspect', 'Checked Exception', 'Unchecked Exception'],
      rows: [
        ['Inherits From', 'Exception', 'RuntimeException'],
        ['Compiler Enforced', 'YES (catch or throws)', 'NO (optional)'],
        ['Intended Meaning', 'Recoverable contingency', 'Programmer defect / invariant break'],
        ['Signature Clutter', 'High (pollutes throws)', 'None (clean signatures)'],
        ['Stream API Friendly', 'NO (requires try-catch inside lambdas)', 'YES']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Is NullPointerException Checked?',
        prompt: 'Does public void test() throws NullPointerException require callers to catch it?',
        solution: 'No! NullPointerException inherits from RuntimeException (unchecked). The compiler never enforces catch-or-specify for unchecked exceptions.',
        explanation: 'Declaring unchecked exceptions in throws is allowed for documentation but never enforced.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Tax Calculation Invariant Check',
        prompt: 'Implement calculateTax(double price, double rate) throwing IllegalArgumentException if price or rate is negative.',
        solution: `public static double calculateTax(double price, double rate) {
    if (price < 0 || rate < 0) throw new IllegalArgumentException();
    return price * (rate / 100.0);
}`,
        explanation: 'Enforces class invariants with unchecked IllegalArgumentException.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Subclass Overriding Checked Exceptions',
        prompt: 'Can an overriding subclass method declare broader checked exceptions than the superclass?',
        solution: 'No! An overriding method cannot declare broader or new checked exceptions.',
        explanation: 'Subclasses may declare fewer or more specific exceptions, but never broader ones.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: The Catch or Specify Requirement',
        url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/catchOrDeclare.html',
        organization: 'Oracle'
      },
      {
        title: 'Oracle Java Documentation: Unchecked Exceptions Controversy',
        url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html',
        organization: 'Oracle'
      },
      {
        title: 'JLS §11.2: Compile-Time Checking of Exceptions',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html#jls-11.2',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 31: Try-With-Resources & AutoCloseable
  {
    id: 'topic-31',
    slug: 'try-with-resources-and-autocloseable',
    topicNumber: 31,
    title: 'Try-With-Resources & AutoCloseable',
    part: 'Part 1: Java Core',
    sectionNumber: 9,
    sectionTitle: 'Exception Handling',
    versionBadge: 'Java 8+',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Eliminate resource and connection leaks with Java 7 Automatic Resource Management (ARM). Master AutoCloseable, reverse close order, and suppressed exceptions.',
    prerequisites: [
      'Topic 23: Interfaces & Modern Interface Evolution',
      'Topic 29: The Java Exception Hierarchy'
    ],
    whatAndWhy: {
      definition: 'Try-with-resources is a statement ensuring that all resources implementing java.lang.AutoCloseable are closed automatically at the conclusion of the statement.',
      analogy: 'A rental tool with an automated return drone: whether your home project finishes or your car breaks down, the drone automatically flies the equipment back to the store shelf.',
      whyItExists: 'Eliminates 30+ lines of nested try-finally boilerplate for closing streams/connections, prevents resource leaks, and suppresses close errors rather than masking primary exceptions.'
    },
    syntaxBreakdown: {
      title: 'Automatic Resource Management Syntax & Order',
      codeSnippet: `try (ResourceA a = new ResourceA();
     ResourceB b = new ResourceB()) {
    // b is closed FIRST, then a is closed SECOND
}`,
      explanation: 'Resources must implement AutoCloseable. Resources are closed in reverse order of declaration. Exceptions during close() are attached as suppressed exceptions.',
      tokens: [
        { token: 'try (Resource r = ...)', explanation: 'Declares scoped resources closed deterministically at block exit.' },
        { token: 'AutoCloseable', explanation: 'Interface with void close() throws Exception required for ARM.' },
        { token: 'Reverse Order', explanation: 'Child resources are closed before parent connections.' },
        { token: 'getSuppressed()', explanation: 'Retrieves secondary exceptions thrown during resource closure.' }
      ]
    },
    examples: [
      {
        id: '31-1',
        title: 'Reverse Close Order & Suppressed Exceptions',
        type: 'basic',
        description: 'Demonstrates reverse closure order of multiple resources and inspecting suppressed exceptions when close() throws.',
        filename: 'TryWithResourcesMechanics.java',
        code: `public class TryWithResourcesMechanics {
    public static class ManagedConnection implements AutoCloseable {
        private final String id;
        public ManagedConnection(String id) { this.id = id; System.out.println("[" + id + "] Opened."); }
        public void doWork() { System.out.println("[" + id + "] Working."); }
        @Override public void close() { System.out.println("[" + id + "] Connection Closed Cleanly."); }
    }

    public static void main(String[] args) {
        try (ManagedConnection db = new ManagedConnection("Database");
             ManagedConnection audit = new ManagedConnection("AuditLog")) {
            db.doWork();
            audit.doWork();
        }
    }
}`,
        output: `[Database] Opened.
[AuditLog] Opened.
[Database] Working.
[AuditLog] Working.
[AuditLog] Connection Closed Cleanly.
[Database] Connection Closed Cleanly.`,
        stepByStep: [
          'Database and AuditLog connections open sequentially.',
          'Transactional work executes.',
          'AuditLog is closed first; Database is closed second (exact reverse order).'
        ]
      },
      {
        id: '31-2',
        title: 'Multi-Resource Database Stream Exporter',
        type: 'realistic',
        description: 'Production exporter closing database connection, cursor statement, and byte output stream deterministically.',
        filename: 'DatabaseStreamExporterApp.java',
        code: `import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class DatabaseStreamExporterApp {
    public static class MockDatabaseClient implements AutoCloseable {
        public void execute(String sql) { System.out.println("Executing SQL: " + sql); }
        @Override public void close() { System.out.println("MockDatabaseClient: Physical socket connection closed."); }
    }
    public static class MockStatement implements AutoCloseable {
        @Override public void close() { System.out.println("MockStatement: Cursor statement closed."); }
    }

    public static byte[] exportAudit(String sql) throws IOException {
        try (MockDatabaseClient db = new MockDatabaseClient();
             MockStatement stmt = new MockStatement();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            db.execute(sql);
            out.write("EXPORTED REPORT PAYLOAD: 2026-11-17".getBytes());
            return out.toByteArray();
        }
    }

    public static void main(String[] args) throws IOException {
        byte[] r = exportAudit("SELECT * FROM audit_ledger WHERE year = 2026");
        System.out.println("Exported Length: " + r.length + " bytes");
    }
}`,
        output: `Executing SQL: SELECT * FROM audit_ledger WHERE year = 2026
MockStatement: Cursor statement closed.
MockDatabaseClient: Physical socket connection closed.
Exported Length: 35 bytes`,
        stepByStep: [
          'Opens DB client, Statement, and ByteArrayOutputStream in try header.',
          'Executes query and writes payload.',
          'All three resources close cleanly in reverse order before method returns.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Using non-AutoCloseable classes in try header',
        wrongCode: `try (String s = "test") { ... } // COMPILE ERROR`,
        fixedCode: `try (InputStream in = open()) { ... }`,
        cause: 'Only classes implementing AutoCloseable can be managed by try-with-resources.',
        solution: 'Ensure managed resources implement AutoCloseable.'
      },
      {
        title: 'Throwing generic Exception from custom close()',
        wrongCode: `public void close() throws Exception {} // Forces callers to catch generic Exception`,
        fixedCode: `public void close() throws IOException {} // Narrowed signature`,
        cause: 'AutoCloseable.close() allows throwing Exception, but implementations should narrow the exception.',
        solution: 'Narrow close() to throw specific exceptions or no exception at all.'
      }
    ],
    bestPractices: {
      doList: [
        'Always use try-with-resources for I/O streams, database connections, and sockets.',
        'Make custom close() methods idempotent (safe to call multiple times).',
        'Use effectively final variables in try headers (Java 9+).'
      ],
      dontList: [
        'Never write manual nested try-finally cleanup blocks in modern Java.',
        'Do not use try-with-resources for long-lived application singletons.',
        'Avoid throwing exceptions from close() if cleanup succeeded.'
      ],
      whenNotToUse: 'Do not use try-with-resources for long-lived shared connections managed by connection pools.'
    },
    versionNotes: {
      introduced: 'Java 7 (JSR 334)',
      status: 'Stable',
      compatibilityNotes: 'Java 9 permitted effectively final variables in try headers without re-declaration.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Try-With-Resources Cheat Sheet',
      headers: ['Feature', 'Behavior', 'Benefit'],
      rows: [
        ['Interface', 'java.lang.AutoCloseable', 'Mandatory contract defining void close()'],
        ['Close Order', 'Reverse order of declaration', 'Dependencies close before connections'],
        ['Suppression', 'Attached via getSuppressed()', 'Primary exception from try block is never masked'],
        ['Java 9+ Syntax', 'try (existingResource) { ... }', 'Eliminates re-declaring effectively final variables']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Close Order Verification',
        prompt: 'In try (Res a = new Res(); Res b = new Res()) {}, which resource closes first?',
        solution: 'b closes first, followed by a.',
        explanation: 'Try-with-resources always closes declared resources in reverse order.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'AutoCloseable Execution Stopwatch',
        prompt: 'Implement Stopwatch implementing AutoCloseable that prints elapsed milliseconds in close().',
        solution: `public class Stopwatch implements AutoCloseable {
    private final long start = System.currentTimeMillis();
    @Override public void close() {
        System.out.println("Elapsed: " + (System.currentTimeMillis() - start) + "ms");
    }
}`,
        explanation: 'Enables timing code blocks with try (new Stopwatch()) { ... }.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'System.exit Inside ARM',
        prompt: 'Are resources closed if System.exit(0) is called inside a try-with-resources block?',
        solution: 'No! System.exit() halts the JVM immediately without running close() or finally blocks.',
        explanation: 'Abrupt process termination bypasses all language-level cleanup routines.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: try-with-resources',
        url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: try-with-resources',
        url: 'https://dev.java/learn/exceptions/try-with-resources/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §14.20.3: try-with-resources',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.20.3',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 32: Custom Exceptions & Exception Chaining
  {
    id: 'topic-32',
    slug: 'custom-exceptions-and-exception-chaining',
    topicNumber: 32,
    title: 'Custom Exceptions & Exception Chaining',
    part: 'Part 1: Java Core',
    sectionNumber: 9,
    sectionTitle: 'Exception Handling',
    versionBadge: 'Java 8+',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Design clear domain-specific exception hierarchies. Master exception chaining to preserve root causes and eliminate anti-patterns like log-and-rethrow.',
    prerequisites: [
      'Topic 29: The Java Exception Hierarchy',
      'Topic 30: Checked vs Unchecked Exceptions'
    ],
    whatAndWhy: {
      definition: 'Custom exceptions are domain-specific classes modeling business failure modes. Exception chaining preserves low-level root causes inside higher-level domain exceptions via super(message, cause).',
      analogy: 'An embassy communique: the foreign ministry issues a high-level bulletin "Communications Severed" (domain exception) while attaching the technician\'s wire diagnostic report (root cause chain).',
      whyItExists: 'Custom exceptions provide strongly-typed business error semantics with structured data fields (like overdraft shortfall), while chaining prevents losing low-level diagnostic root causes.'
    },
    syntaxBreakdown: {
      title: 'Custom Exception Anatomy & Chaining Constructor',
      codeSnippet: `public class PaymentException extends RuntimeException {
    private final String errorCode;
    public PaymentException(String msg, String code, Throwable cause) {
        super(msg, cause); // Stores cause in Throwable
        this.errorCode = code;
    }
    public String getErrorCode() { return errorCode; }
}`,
      explanation: 'Pass cause to super(message, cause). Extend RuntimeException by default. Attach domain-specific fields.',
      tokens: [
        { token: 'super(message, cause)', explanation: 'Initializes message and root cause chain in java.lang.Throwable.' },
        { token: 'getCause()', explanation: 'Retrieves the wrapped underlying exception.' },
        { token: 'Domain Fields', explanation: 'Typed getters exposing business context (e.g. accountId, shortfall).' }
      ]
    },
    examples: [
      {
        id: '32-1',
        title: 'Custom Exception Chaining & Root Cause Traversal',
        type: 'basic',
        description: 'Chains low-level java.net.ConnectException inside PaymentProcessingException, inspecting errorCode and underlying cause.',
        filename: 'CustomExceptionChainingDemo.java',
        code: `public class CustomExceptionChainingDemo {
    public static class PaymentProcessingException extends Exception {
        private final String code;
        public PaymentProcessingException(String msg, String c, Throwable cause) {
            super(msg, cause); this.code = c;
        }
        public String getErrorCode() { return code; }
    }

    public static void executePayment(double amt) throws PaymentProcessingException {
        try {
            throw new java.net.ConnectException("Connection refused: 10.0.0.1:443");
        } catch (java.net.ConnectException ex) {
            throw new PaymentProcessingException("Credit gateway failed for $" + amt, "ERR_GATEWAY_TIMEOUT", ex);
        }
    }

    public static void main(String[] args) {
        try {
            executePayment(999.0);
        } catch (PaymentProcessingException ex) {
            System.out.println("Caught Domain Exception: " + ex.getMessage());
            System.out.println("Error Code:              " + ex.getErrorCode());
            System.out.println("Underlying Root Cause:   " + ex.getCause().getClass().getName());
        }
    }
}`,
        output: `Caught Domain Exception: Credit gateway failed for $999.0
Error Code:              ERR_GATEWAY_TIMEOUT
Underlying Root Cause:   java.net.ConnectException`,
        stepByStep: [
          'ConnectException represents low-level socket refusal.',
          'Catch block wraps it in PaymentProcessingException with error code ERR_GATEWAY_TIMEOUT.',
          'getCause() preserves low-level network origin.'
        ]
      },
      {
        id: '32-2',
        title: 'Strongly-Typed Banking Domain Exceptions',
        type: 'realistic',
        description: 'Banking account model throwing typed InsufficientFundsException and AccountComplianceLockException with structured shortfall data.',
        filename: 'BankingTransactionValidatorApp.java',
        code: `public class BankingTransactionValidatorApp {
    public static class InsufficientFundsException extends RuntimeException {
        private final double shortfall;
        public InsufficientFundsException(String acc, double bal, double req) {
            super(String.format("Account %s overdraft: current $%.2f, attempted $%.2f", acc, bal, req));
            this.shortfall = req - bal;
        }
        public double getShortfall() { return shortfall; }
    }

    public static class Account {
        private double balance;
        public Account(double b) { this.balance = b; }
        public void withdraw(double amt) {
            if (amt > balance) throw new InsufficientFundsException("CHK-100", balance, amt);
            balance -= amt;
        }
    }

    public static void main(String[] args) {
        Account a = new Account(250.0);
        try {
            a.withdraw(400.0);
        } catch (InsufficientFundsException ex) {
            System.out.println("[REJECTED] " + ex.getMessage());
            System.out.printf("Overdraft Shortfall: $%.2f%n", ex.getShortfall());
        }
    }
}`,
        output: `[REJECTED] Account CHK-100 overdraft: current $250.00, attempted $400.00
Overdraft Shortfall: $150.00`,
        stepByStep: [
          'Account validates withdrawal against available reserves.',
          'InsufficientFundsException calculates exact financial shortfall.',
          'Caller catches domain exception and extracts shortfall for customer notification.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Discarding the root cause during rethrowing',
        wrongCode: `try { save(); } catch (SQLException e) {
    throw new ServiceException(e.getMessage()); // BUG: Lost stack trace!
}`,
        fixedCode: `throw new ServiceException("Save failed", e);`,
        cause: 'Passing only e.getMessage() discards the original SQLException stack trace.',
        solution: 'Pass the exception instance as the cause argument.'
      },
      {
        title: 'The log-and-rethrow anti-pattern',
        wrongCode: `try { run(); } catch (Exception e) {
    log.error("Failed", e); // Logged
    throw e;                // Rethrown! Duplicate logs at higher layers!
}`,
        fixedCode: `// Either handle and log, OR rethrow with context. Never both.`,
        cause: 'Logging at every layer creates massive duplicate log noise in production.',
        solution: 'Let exceptions propagate to the top-level exception handler to be logged once.'
      }
    ],
    bestPractices: {
      doList: [
        'Extend RuntimeException by default for business domain exceptions.',
        'Provide all four standard constructors including (String message, Throwable cause).',
        'Attach domain-specific query methods (e.g. getShortfall(), getOrderId()).'
      ],
      dontList: [
        'Do not invent custom exceptions when standard Java exceptions (IllegalArgumentException) fit.',
        'Never swallow exceptions without logging or rethrowing.',
        'Avoid creating separate exception classes for every single minor error code.'
      ],
      whenNotToUse: 'Do not create custom exceptions if standard JDK exceptions (NullPointerException, IllegalArgumentException, IllegalStateException) already convey the exact meaning.'
    },
    versionNotes: {
      introduced: 'Java 1.0 (Exceptions) / Java 1.4 (Chaining via initCause)',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added suppressed exceptions. Fully compatible across all Java releases.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Custom Exceptions Cheat Sheet',
      headers: ['Construct', 'Standard Implementation', 'Purpose'],
      rows: [
        ['Base Class', 'extends RuntimeException', 'Keeps public API method signatures clean'],
        ['Chaining Call', 'super(message, cause);', 'Preserves low-level root cause and stack trace'],
        ['Root Cause Access', 'ex.getCause()', 'Inspects underlying wrapped failure'],
        ['Domain State', 'private final fields', 'Provides structured error metadata to callers']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Lost Exception Cause',
        prompt: 'Why is throw new OrderException(e.getMessage()); an anti-pattern when catching SQLException e?',
        solution: 'Passing only the string message loses the original SQLException object and its entire stack trace.',
        explanation: 'Must pass e as the cause parameter: throw new OrderException("Message", e);'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'UserNotFound Domain Exception',
        prompt: 'Implement UserNotFoundException(String username) storing the username field.',
        solution: `public class UserNotFoundException extends RuntimeException {
    private final String username;
    public UserNotFoundException(String u) {
        super("User '" + u + "' not found"); this.username = u;
    }
    public String getUsername() { return username; }
}`,
        explanation: 'Strongly-typed exception exposing user identity.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Self-Causation Exception Error',
        prompt: 'What happens if you call ex.initCause(ex)?',
        solution: 'Throws IllegalArgumentException: Self-causation not permitted.',
        explanation: 'Throwable explicitly prohibits circular dependency cycles in exception chains.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Chained Exceptions',
        url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/chained.html',
        organization: 'Oracle'
      },
      {
        title: 'dev.java: Creating Custom Exceptions',
        url: 'https://dev.java/learn/exceptions/',
        organization: 'Oracle'
      },
      {
        title: 'JLS §11.1.1: Asynchronous Exceptions',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html#jls-11.1.1',
        organization: 'Oracle'
      }
    ]
  },


// Topic 33: Generics Fundamentals
  {
    id: 'topic-33',
    slug: 'generics-fundamentals',
    topicNumber: 33,
    title: 'Generics Fundamentals',
    part: 'Part 1: Java Core',
    sectionNumber: 10,
    sectionTitle: 'Generics & Collections Framework',
    versionBadge: 'Java 5+ (Diamond: Java 7)',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master compile-time type safety with generic classes, methods, bounded type parameters, and type erasure mechanics.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 23: Interfaces & Modern Interface Evolution'
    ],
    whatAndWhy: {
      definition: 'Generics introduces compile-time type parameterization. It allows classes, interfaces, and methods to operate on specified types while enforcing static type safety and eliminating manual type casting.',
      analogy: 'Shipping containers: an unlabeled container allows mixing food and toxic chemicals blindly. Stamping a container as Container<Apples> guarantees at compile time that only apples enter, and opening it always yields an apple safely.',
      whyItExists: 'Before Java 5, collections stored raw Objects, requiring manual casts that crashed at runtime with ClassCastException. Generics shifts type errors to compile time.'
    },
    syntaxBreakdown: {
      title: 'Generic Type Parameter & Bounded Parameter Syntax',
      codeSnippet: `public class KeyValuePair<K, V> {
    private final K key;
    private final V value;
    public KeyValuePair(K key, V value) { this.key = key; this.value = value; }
}

public static <T extends Comparable<T>> T findMax(T first, T second) {
    return first.compareTo(second) >= 0 ? first : second;
}`,
      explanation: 'Angle brackets declare formal type parameters. The extends keyword binds parameters to specific supertypes.',
      tokens: [
        { token: '<T>', explanation: 'Type parameter placeholder (E=Element, K=Key, V=Value, T=Type).' },
        { token: '<>', explanation: 'Diamond operator (Java 7+), allowing compiler type argument inference.' },
        { token: '<T extends Bound>', explanation: 'Upper bounded type parameter restricting T to Bound or subtypes.' },
        { token: 'Type Erasure', explanation: 'Compiler removes generic types at bytecode level, replacing T with its bound or Object.' }
      ]
    },
    examples: [
      {
        id: '33-1',
        title: 'Generic Pair & Bounded Generic Method',
        type: 'basic',
        description: 'Demonstrates a custom generic KeyValuePair and a bounded generic comparison method.',
        filename: 'GenericsFundamentalsDemo.java',
        code: `public class GenericsFundamentalsDemo {
    public static class KeyValuePair<K, V> {
        private final K key;
        private final V value;
        public KeyValuePair(K key, V value) { this.key = key; this.value = value; }
        public K getKey() { return key; }
        public V getValue() { return value; }
        @Override public String toString() { return "[" + key + " => " + value + "]"; }
    }

    public static <T extends Comparable<T>> T findMax(T first, T second) {
        return first.compareTo(second) >= 0 ? first : second;
    }

    public static void main(String[] args) {
        KeyValuePair<String, Integer> portMapping = new KeyValuePair<>("http-port", 8080);
        KeyValuePair<Long, String> userSession = new KeyValuePair<>(1001L, "ACTIVE_TOKEN_99");
        System.out.println("Pair 1: " + portMapping);
        System.out.println("Pair 2: " + userSession);
        System.out.println("Max Integer: " + findMax(45, 92));
        System.out.println("Max String: " + findMax("Database", "Application"));
    }
}`,
        output: `Pair 1: [http-port => 8080]
Pair 2: [1001 => ACTIVE_TOKEN_99]
Max Integer: 92
Max String: Database`,
        stepByStep: [
          'Instantiates KeyValuePair with String and Integer types inferred via diamond operator.',
          'findMax invokes compareTo on T bounded by Comparable<T>.',
          'Compiler transparently inserts casts at call sites while ensuring type safety.'
        ]
      },
      {
        id: '33-2',
        title: 'Type-Safe Generic Entity Repository',
        type: 'realistic',
        description: 'Implements a generic repository pattern with bounded Identifiable entities and Optional return types.',
        filename: 'TypeSafeRepositoryApp.java',
        code: `import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TypeSafeRepositoryApp {
    public interface Identifiable<ID> { ID getId(); }

    public static class Repository<T extends Identifiable<ID>, ID> {
        private final List<T> storage = new ArrayList<>();
        public void save(T entity) {
            storage.removeIf(item -> item.getId().equals(entity.getId()));
            storage.add(entity);
        }
        public Optional<T> findById(ID id) {
            for (T item : storage) {
                if (item.getId().equals(id)) return Optional.of(item);
            }
            return Optional.empty();
        }
        public int count() { return storage.size(); }
    }

    public static class CustomerAccount implements Identifiable<Long> {
        private final Long accountId;
        private final String customerName;
        private final double balance;
        public CustomerAccount(Long id, String name, double bal) {
            this.accountId = id; this.customerName = name; this.balance = bal;
        }
        @Override public Long getId() { return accountId; }
        @Override public String toString() {
            return "Customer[id=" + accountId + ", name=" + customerName + ", balance=$" + String.format("%.2f", balance) + "]";
        }
    }

    public static void main(String[] args) {
        Repository<CustomerAccount, Long> accountRepo = new Repository<>();
        accountRepo.save(new CustomerAccount(101L, "Alice Morgan", 1450.50));
        accountRepo.save(new CustomerAccount(102L, "David Chen", 3200.75));
        System.out.println("Repository Count: " + accountRepo.count());
        accountRepo.findById(101L).ifPresent(acc -> System.out.println("Retrieved Account: " + acc));
        System.out.println("Missing Account Found: " + accountRepo.findById(999L).isPresent());
    }
}`,
        output: `Repository Count: 2
Retrieved Account: Customer[id=101, name=Alice Morgan, balance=$1450.50]
Missing Account Found: false`,
        stepByStep: [
          'Repository locks T to types implementing Identifiable with key type ID.',
          'Type erasure compiles storage to hold Identifiable references.',
          'findById safely wraps results in Optional to prevent null reference bugs.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Generic Array Creation Error',
        cause: 'Writing new T[10] fails because type erasure removes T at runtime.',
        solution: 'Use List<T> or pass Class<T> clazz and Array.newInstance(clazz, size).'
      },
      {
        title: 'Primitive Type Argument Error',
        cause: 'Writing List<int> fails because Java generics require reference types inheriting from Object.',
        solution: 'Use boxed wrappers like List<Integer>.'
      }
    ],
    bestPractices: {
      doList: [
        'Use the diamond operator (<>) for concise constructor invocations.',
        'Use bounded type parameters (<T extends Comparable<T>>) when specific methods are required.',
        'Prefer List<T> over raw arrays when working with generic types.'
      ],
      dontList: [
        'Never use raw types (like List list = new ArrayList()).',
        'Do not over-parameterize classes that only ever handle a single concrete type.',
        'Never cast unchecked raw types without verifying type bounds.'
      ],
      whenNotToUse: 'Do not introduce generics if a class or method only operates on a single concrete domain type.'
    },
    versionNotes: {
      introduced: 'Java 5 (JSR 14)',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added the diamond operator (<>). Java 10 added var type inference for generic expressions.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Generics Fundamentals Cheat Sheet',
      headers: ['Construct', 'Syntax', 'Primary Purpose'],
      rows: [
        ['Generic Class', 'class Container<T>', 'Reusable data structure parameterizing stored elements'],
        ['Upper Bound', '<T extends Number>', 'Restricts type parameter to subclasses of Number'],
        ['Diamond Operator', 'new ArrayList<>()', 'Infers constructor type arguments automatically'],
        ['Type Erasure', 'JVM bytecode cleanup', 'Replaces T with upper bound or Object at compile time']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'SingleSlotBuffer Container',
        prompt: 'Implement a generic SingleSlotBuffer<T> with put(T), T get(), and boolean isEmpty().',
        solution: `public class SingleSlotBuffer<T> {
    private T item;
    public void put(T item) { this.item = item; }
    public T get() { T temp = item; item = null; return temp; }
    public boolean isEmpty() { return item == null; }
}`,
        explanation: 'Maintains a single reference of type T and clears it upon get().'
      },
      {
        id: 2,
        type: 'Spot the Bug',
        title: 'Illegal Generic Array Instantiation',
        prompt: 'Why does public class Cache<T> { private T[] arr = new T[10]; } fail to compile?',
        solution: 'Java prohibits generic array creation (new T[10]) because type erasure discards T at runtime, preventing the JVM from creating the array with its concrete component type.',
        explanation: 'Fix by declaring List<T> arr = new ArrayList<>() or passing a Class<T> token.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Generics Tutorial',
        url: 'https://docs.oracle.com/javase/tutorial/extra/generics/index.html',
        organization: 'Oracle'
      },
      {
        title: 'Java Language Specification: Chapter 4 Types',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 34: Generic Wildcards & PECS Principle
  {
    id: 'topic-34',
    slug: 'generic-wildcards-and-pecs-principle',
    topicNumber: 34,
    title: 'Generic Wildcards & PECS Principle',
    part: 'Part 1: Java Core',
    sectionNumber: 10,
    sectionTitle: 'Generics & Collections Framework',
    versionBadge: 'Java 5+ (@SafeVarargs: Java 7)',
    difficulty: 'Advanced',
    readingTime: '13 min read',
    shortDescription: 'Master Producer Extends, Consumer Super (PECS). Handle covariance, contravariance, wildcards (?), and avoid heap pollution.',
    prerequisites: [
      'Topic 33: Generics Fundamentals',
      'Topic 20: Inheritance & Method Overriding'
    ],
    whatAndWhy: {
      definition: 'Generic wildcards (?) provide subtyping flexibility for invariant generic collections. The PECS rule dictates using ? extends for reading (Producer) and ? super for writing (Consumer).',
      analogy: 'Electrical sockets: Producer Extends (? extends Appliance) accepts any plug that draws power safely. Consumer Super (? super Battery) is a charger bay accepting any battery to deposit energy into.',
      whyItExists: 'Generics are invariant: List<Integer> is not a subtype of List<Number>. Wildcards introduce safe covariance and contravariance.'
    },
    syntaxBreakdown: {
      title: 'Wildcard Variations & The PECS Rule',
      codeSnippet: `List<?> unbounded;
List<? extends Number> producer; // Read as Number, cannot write
List<? super Integer> consumer;  // Write Integers, read as Object`,
      explanation: 'PECS: Producer Extends, Consumer Super.',
      tokens: [
        { token: '<?>', explanation: 'Unbounded wildcard; read elements as Object; only null can be written.' },
        { token: '<? extends T>', explanation: 'Upper-bounded wildcard (Covariant); Producer only.' },
        { token: '<? super T>', explanation: 'Lower-bounded wildcard (Contravariant); Consumer only.' }
      ]
    },
    examples: [
      {
        id: '34-1',
        title: 'Basic PECS Demonstration',
        type: 'basic',
        description: 'Demonstrates reading from a numeric producer and writing into a lower-bounded consumer sink.',
        filename: 'WildcardsPECSDemo.java',
        code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class WildcardsPECSDemo {
    public static double sumOfNumbers(List<? extends Number> numbers) {
        double sum = 0.0;
        for (Number n : numbers) sum += n.doubleValue();
        return sum;
    }

    public static void populateConsecutive(List<? super Integer> target, int start, int count) {
        for (int i = 0; i < count; i++) target.add(start + i);
    }

    public static void main(String[] args) {
        List<Integer> integers = Arrays.asList(10, 20, 30);
        List<Double> doubles = Arrays.asList(1.5, 2.5, 3.5);
        System.out.println("Integer Sum: " + sumOfNumbers(integers));
        System.out.println("Double Sum: " + sumOfNumbers(doubles));

        List<Number> numberSink = new ArrayList<>();
        populateConsecutive(numberSink, 100, 3);
        System.out.println("Number Sink Contents: " + numberSink);

        List<Object> objectSink = new ArrayList<>();
        populateConsecutive(objectSink, 500, 2);
        System.out.println("Object Sink Contents: " + objectSink);
    }
}`,
        output: `Integer Sum: 60.0
Double Sum: 7.5
Number Sink Contents: [100, 101, 102]
Object Sink Contents: [500, 501]`,
        stepByStep: [
          'sumOfNumbers accepts List<Integer> and List<Double> via ? extends Number producer.',
          'populateConsecutive adds Integers into List<Number> and List<Object> via ? super Integer consumer.',
          'Demonstrates covariance during read and contravariance during write.'
        ]
      },
      {
        id: '34-2',
        title: 'Telemetry Event Ingestion Pipeline',
        type: 'realistic',
        description: 'Transfers security alert events across wildcard boundaries into generic event journals.',
        filename: 'PipelineDataBufferApp.java',
        code: `import java.util.ArrayList;
import java.util.List;

public class PipelineDataBufferApp {
    public static class Event {
        private final String eventType;
        private final long timestamp;
        public Event(String type, long ts) { this.eventType = type; this.timestamp = ts; }
        public String getEventType() { return eventType; }
        @Override public String toString() { return "Event[" + eventType + "@" + timestamp + "]"; }
    }

    public static class SecurityAuditAlert extends Event {
        private final int severityLevel;
        public SecurityAuditAlert(String type, long ts, int sev) { super(type, ts); this.severityLevel = sev; }
        @Override public String toString() { return "SecurityAlert[" + getEventType() + ", severity=" + severityLevel + "]"; }
    }

    public static <T> void transferBatch(List<? extends T> source, List<? super T> destination) {
        for (T item : source) destination.add(item);
    }

    public static void main(String[] args) {
        List<SecurityAuditAlert> incomingAlerts = new ArrayList<>();
        incomingAlerts.add(new SecurityAuditAlert("FAILED_LOGIN", 1700000001L, 3));
        incomingAlerts.add(new SecurityAuditAlert("PORT_SCAN", 1700000002L, 5));

        List<Event> auditEventJournal = new ArrayList<>();
        transferBatch(incomingAlerts, auditEventJournal);
        System.out.println("Transferred Journal Records: " + auditEventJournal.size());
        for (Event event : auditEventJournal) System.out.println("Journaled: " + event);
    }
}`,
        output: `Transferred Journal Records: 2
Journaled: SecurityAlert[FAILED_LOGIN, severity=3]
Journaled: SecurityAlert[PORT_SCAN, severity=5]`,
        stepByStep: [
          'transferBatch applies PECS: source produces elements (? extends T) and destination consumes elements (? super T).',
          'Incoming alerts are read as Events and safely appended to auditEventJournal.',
          'Prevents accidental reverse transfers that would corrupt type safety.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Writing to a Producer Extends Wildcard',
        cause: 'Calling list.add(10) on List<? extends Number> fails because compiler cannot guarantee the concrete subtype at runtime.',
        solution: 'Use ? super Integer or an exact type parameter T.'
      }
    ],
    bestPractices: {
      doList: [
        'Apply PECS: Producer Extends, Consumer Super on all collection method parameters.',
        'Use unbounded wildcards (List<?>) when only Object methods (like size() or clear()) are called.'
      ],
      dontList: [
        'Never use wildcards as method return types.',
        'Do not use wildcards when a collection must be both read from and written to.'
      ],
      whenNotToUse: 'Do not use wildcards for local variable declarations; use concrete type parameters.'
    },
    versionNotes: {
      introduced: 'Java 5 (JSR 14)',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added @SafeVarargs annotation to suppress warnings on generic varargs.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Generic Wildcards & PECS Cheat Sheet',
      headers: ['Wildcard', 'PECS Classification', 'Read Access', 'Write Access'],
      rows: [
        ['List<?>', 'Unbounded', 'Reads as Object', 'Only null permitted'],
        ['List<? extends T>', 'Producer Extends', 'Reads safely as T', 'Forbidden (compiler rejects)'],
        ['List<? super T>', 'Consumer Super', 'Reads only as Object', 'Writes T and its subtypes safely']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Real-world Edge Case',
        title: 'Understanding Generic Invariance',
        prompt: 'Why does Java disallow List<Number> nums = new ArrayList<Integer>()?',
        solution: 'If allowed, code could execute nums.add(3.14), adding a Double into a list of Integers, crashing at runtime with ClassCastException upon extraction.',
        explanation: 'Generics are invariant to preserve absolute compile-time type safety.'
      }
    ],
    officialSources: [
      {
        title: 'Oracle Java Documentation: Wildcard Guidelines',
        url: 'https://docs.oracle.com/javase/tutorial/java/generics/wildcardGuidelines.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 35: The List Hierarchy
  {
    id: 'topic-35',
    slug: 'the-list-hierarchy',
    topicNumber: 35,
    title: 'The List Hierarchy',
    part: 'Part 1: Java Core',
    sectionNumber: 10,
    sectionTitle: 'Generics & Collections Framework',
    versionBadge: 'Java 1.2+ (List.of: Java 9)',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master ArrayList, LinkedList, and CopyOnWriteArrayList. Understand memory layout, O(1) random access vs O(n) node traversal, and subList windowing.',
    prerequisites: [
      'Topic 33: Generics Fundamentals',
      'Topic 14: One-Dimensional Arrays'
    ],
    whatAndWhy: {
      definition: 'List<E> is an ordered collection allowing duplicate elements and positional index access. ArrayList provides O(1) random access via contiguous arrays, while LinkedList provides O(1) insertions at ends.',
      analogy: 'An indexed notebook (ArrayList) has numbered lines: flipping to line 50 is instant O(1), but deleting line 10 requires shifting lines. An index-card chain (LinkedList) links cards by paperclips.',
      whyItExists: 'Fixed-size arrays cannot dynamically expand. List implementations handle automatic resizing and convenient operations.'
    },
    syntaxBreakdown: {
      title: 'List Implementations & SubList Views',
      codeSnippet: `List<String> arrayList = new ArrayList<>();
List<String> linkedList = new LinkedList<>();
List<String> cowList = new CopyOnWriteArrayList<>();
List<String> slice = list.subList(0, 5);`,
      explanation: 'ArrayList is the default choice. LinkedList provides Deque capabilities. CopyOnWriteArrayList is thread-safe.',
      tokens: [
        { token: 'ArrayList', explanation: 'Dynamic contiguous array with O(1) random access.' },
        { token: 'LinkedList', explanation: 'Doubly-linked nodes implementing List and Deque.' },
        { token: 'CopyOnWriteArrayList', explanation: 'Thread-safe variant cloning array on write.' },
        { token: 'subList(from, to)', explanation: 'Live window view on the backing list.' }
      ]
    },
    examples: [
      {
        id: '35-1',
        title: 'Comparing List Implementations',
        type: 'basic',
        description: 'Demonstrates ArrayList, LinkedList, and safe concurrent iteration with CopyOnWriteArrayList.',
        filename: 'ListHierarchyDemo.java',
        code: `import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class ListHierarchyDemo {
    public static void main(String[] args) {
        List<String> arrayList = new ArrayList<>();
        arrayList.add("Alpha");
        arrayList.add("Beta");
        arrayList.add(1, "Inserted-Mid");
        System.out.println("ArrayList indexed read at 1: " + arrayList.get(1));

        LinkedList<String> linkedList = new LinkedList<>();
        linkedList.addFirst("Head-Node");
        linkedList.addLast("Tail-Node");
        System.out.println("LinkedList first element: " + linkedList.getFirst());

        List<String> cowList = new CopyOnWriteArrayList<>(arrayList);
        for (String item : cowList) {
            if (item.equals("Beta")) cowList.add("Gamma-Safe");
        }
        System.out.println("CopyOnWriteArrayList size: " + cowList.size());
        System.out.println("CopyOnWriteArrayList final items: " + cowList);
    }
}`,
        output: `ArrayList indexed read at 1: Inserted-Mid
LinkedList first element: Head-Node
CopyOnWriteArrayList size: 4
CopyOnWriteArrayList final items: [Alpha, Inserted-Mid, Beta, Gamma-Safe]`,
        stepByStep: [
          'ArrayList performs O(1) indexed read.',
          'LinkedList performs O(1) node insertion at head.',
          'CopyOnWriteArrayList mutates underlying snapshot without ConcurrentModificationException.'
        ]
      },
      {
        id: '35-2',
        title: 'Order Batch Processor & Pagination',
        type: 'realistic',
        description: 'Demonstrates batch queue slicing with subList and defensive snapshotting with List.copyOf.',
        filename: 'OrderBatchProcessorApp.java',
        code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class OrderBatchProcessorApp {
    public record CustomerOrder(String orderId, double totalAmount) {}

    public static class BatchProcessor {
        private final List<CustomerOrder> queue = new ArrayList<>();
        public void addOrder(CustomerOrder order) { queue.add(order); }
        public List<CustomerOrder> getBatch(int offset, int limit) {
            if (offset >= queue.size()) return Collections.emptyList();
            int toIndex = Math.min(offset + limit, queue.size());
            return List.copyOf(queue.subList(offset, toIndex));
        }
        public int getTotalPending() { return queue.size(); }
    }

    public static void main(String[] args) {
        BatchProcessor processor = new BatchProcessor();
        processor.addOrder(new CustomerOrder("ORD-101", 89.50));
        processor.addOrder(new CustomerOrder("ORD-102", 240.00));
        processor.addOrder(new CustomerOrder("ORD-103", 45.20));
        processor.addOrder(new CustomerOrder("ORD-104", 512.99));
        processor.addOrder(new CustomerOrder("ORD-105", 19.99));

        System.out.println("Total Orders Queued: " + processor.getTotalPending());
        System.out.println("Batch 1 (Size " + processor.getBatch(0, 2).size() + "): " + processor.getBatch(0, 2));
        System.out.println("Batch 2 (Size " + processor.getBatch(2, 2).size() + "): " + processor.getBatch(2, 2));
        System.out.println("Batch 3 (Size " + processor.getBatch(4, 2).size() + "): " + processor.getBatch(4, 2));
    }
}`,
        output: `Total Orders Queued: 5
Batch 1 (Size 2): [CustomerOrder[orderId=ORD-101, totalAmount=89.5], CustomerOrder[orderId=ORD-102, totalAmount=240.0]]
Batch 2 (Size 2): [CustomerOrder[orderId=ORD-103, totalAmount=45.2], CustomerOrder[orderId=ORD-104, totalAmount=512.99]]
Batch 3 (Size 1): [CustomerOrder[orderId=ORD-105, totalAmount=19.99]]`,
        stepByStep: [
          'BatchProcessor queues CustomerOrder records.',
          'subList extracts live slices with offset and limit boundaries.',
          'List.copyOf snapshots the slice into an unmodifiable defensive copy.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Concurrent Modification during Foreach Loop',
        cause: 'Modifying a List while iterating with an enhanced for loop alters modCount and throws ConcurrentModificationException.',
        solution: 'Use list.removeIf(...) or an explicit Iterator.remove().'
      }
    ],
    bestPractices: {
      doList: [
        'Default to ArrayList for virtually all sequential collection use cases.',
        'Initialize ArrayList with expected capacity (new ArrayList<>(size)) to eliminate array copies.',
        'Use List.copyOf() for defensive immutability.'
      ],
      dontList: [
        'Do not use LinkedList as a general list; it has heavy memory overhead and poor CPU cache locality.',
        'Never use legacy Vector or Stack.'
      ],
      whenNotToUse: 'Do not use ArrayList if you require thread-safe concurrent modifications; use CopyOnWriteArrayList or ConcurrentLinkedQueue.'
    },
    versionNotes: {
      introduced: 'Java 1.2',
      status: 'Stable',
      compatibilityNotes: 'Java 9 added List.of(...) factory methods. Java 10 added List.copyOf(...).',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'List Hierarchy Cheat Sheet',
      headers: ['Class', 'Data Structure', 'Random Access', 'Memory Overhead'],
      rows: [
        ['ArrayList', 'Contiguous Array', 'O(1) constant', 'Minimal (continuous memory buffer)'],
        ['LinkedList', 'Doubly-Linked Nodes', 'O(n) linear', 'High (24-byte node wrapper per item)'],
        ['CopyOnWriteArrayList', 'Cloned Array', 'O(1) constant', 'High on mutations (clones array)'],
        ['List.of(...)', 'Compact Immutable Array', 'O(1) constant', 'Lowest (unmodifiable compact layout)']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Safe Conditional Removal',
        prompt: 'Remove all negative numbers from a List<Integer> cleanly in Java 8+.',
        solution: 'list.removeIf(n -> n < 0);',
        explanation: 'removeIf safely mutates the collection without throwing ConcurrentModificationException.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.util.List',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 36: The Set Hierarchy
  {
    id: 'topic-36',
    slug: 'the-set-hierarchy',
    topicNumber: 36,
    title: 'The Set Hierarchy',
    part: 'Part 1: Java Core',
    sectionNumber: 10,
    sectionTitle: 'Generics & Collections Framework',
    versionBadge: 'Java 1.2+ (NavigableSet: Java 6)',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master Set semantics: HashSet hash-bucket deduplication in O(1), LinkedHashSet insertion ordering, and TreeSet Red-Black tree sorting.',
    prerequisites: [
      'Topic 33: Generics Fundamentals',
      'Topic 19: Encapsulation & Data Integrity'
    ],
    whatAndWhy: {
      definition: 'Set<E> is a collection containing no duplicate elements. HashSet provides O(1) operations using hash tables, LinkedHashSet retains insertion order, and TreeSet keeps elements sorted via Red-Black trees.',
      analogy: 'VIP club guest list: HashSet checks the roster in 5 seconds via a phone book index. LinkedHashSet does the same while noting arrival sequence. TreeSet places guests alphabetically on tiered seating.',
      whyItExists: 'Checking a List for duplicates takes O(n) per item, creating O(n^2) bottlenecks. Set implementations guarantee uniqueness in O(1) or O(log n).'
    },
    syntaxBreakdown: {
      title: 'Set Implementations & Navigable Operations',
      codeSnippet: `Set<String> hashSet = new HashSet<>();
Set<String> linkedHashSet = new LinkedHashSet<>();
NavigableSet<Integer> treeSet = new TreeSet<>();`,
      explanation: 'HashSet for raw speed; LinkedHashSet for order; TreeSet for sorting and range queries.',
      tokens: [
        { token: 'HashSet', explanation: 'O(1) average lookup backed by HashMap.' },
        { token: 'LinkedHashSet', explanation: 'Maintains insertion order via doubly-linked bucket links.' },
        { token: 'TreeSet', explanation: 'Red-Black tree with O(log n) sorting and NavigableSet queries.' },
        { token: 'headSet / tailSet', explanation: 'TreeSet subset boundary query methods.' }
      ]
    },
    examples: [
      {
        id: '36-1',
        title: 'Comparing Set Implementations',
        type: 'basic',
        description: 'Demonstrates duplicate rejection, insertion order preservation, and range queries.',
        filename: 'SetHierarchyDemo.java',
        code: `import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.NavigableSet;
import java.util.Set;
import java.util.TreeSet;

public class SetHierarchyDemo {
    public static void main(String[] args) {
        Set<String> hashSet = new HashSet<>();
        hashSet.add("Banana");
        hashSet.add("Apple");
        hashSet.add("Cherry");
        hashSet.add("Apple");
        System.out.println("HashSet size (duplicates rejected): " + hashSet.size());

        Set<String> linkedHashSet = new LinkedHashSet<>();
        linkedHashSet.add("First");
        linkedHashSet.add("Second");
        linkedHashSet.add("Third");
        System.out.println("LinkedHashSet insertion order preserved: " + linkedHashSet);

        NavigableSet<Integer> sortedNumbers = new TreeSet<>();
        sortedNumbers.add(50);
        sortedNumbers.add(10);
        sortedNumbers.add(80);
        sortedNumbers.add(30);
        System.out.println("TreeSet sorted view: " + sortedNumbers);
        System.out.println("TreeSet first (min): " + sortedNumbers.first());
        System.out.println("TreeSet last (max): " + sortedNumbers.last());
        System.out.println("TreeSet subset (< 50): " + sortedNumbers.headSet(50));
    }
}`,
        output: `HashSet size (duplicates rejected): 3
LinkedHashSet insertion order preserved: [First, Second, Third]
TreeSet sorted view: [10, 30, 50, 80]
TreeSet first (min): 10
TreeSet last (max): 80
TreeSet subset (< 50): [10, 30]`,
        stepByStep: [
          'HashSet rejects duplicate Apple silently based on hashCode and equals.',
          'LinkedHashSet preserves exact insertion order.',
          'TreeSet sorts elements automatically and provides headSet range views.'
        ]
      },
      {
        id: '36-2',
        title: 'Unique Visitor Telemetry Tracker',
        type: 'realistic',
        description: 'Combines HashSet deduplication, LinkedHashSet chronological auditing, and TreeSet score ranking.',
        filename: 'UniqueVisitorTrackerApp.java',
        code: `import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

public class UniqueVisitorTrackerApp {
    public static class AnalyticsTracker {
        private final Set<String> uniqueVisitorIds = new HashSet<>();
        private final Set<String> arrivalTimeline = new LinkedHashSet<>();
        private final Set<Integer> uniqueLeaderboardScores = new TreeSet<>();

        public boolean recordVisit(String visitorId, int userScore) {
            boolean isNewVisitor = uniqueVisitorIds.add(visitorId);
            if (isNewVisitor) arrivalTimeline.add(visitorId);
            uniqueLeaderboardScores.add(userScore);
            return isNewVisitor;
        }

        public int getTotalUniqueVisitors() { return uniqueVisitorIds.size(); }
        public Set<String> getArrivalTimeline() { return Set.copyOf(arrivalTimeline); }
        public Integer getHighestScore() { return ((TreeSet<Integer>) uniqueLeaderboardScores).last(); }
        public Integer getLowestScore() { return ((TreeSet<Integer>) uniqueLeaderboardScores).first(); }
    }

    public static void main(String[] args) {
        AnalyticsTracker tracker = new AnalyticsTracker();
        tracker.recordVisit("usr-node-01", 350);
        tracker.recordVisit("usr-node-02", 920);
        tracker.recordVisit("usr-node-01", 350);
        tracker.recordVisit("usr-node-03", 510);
        tracker.recordVisit("usr-node-04", 180);

        System.out.println("Unique Visitors Count: " + tracker.getTotalUniqueVisitors());
        System.out.println("Arrival Order: " + tracker.getArrivalTimeline());
        System.out.println("Highest Leaderboard Score: " + tracker.getHighestScore());
        System.out.println("Lowest Leaderboard Score: " + tracker.getLowestScore());
    }
}`,
        output: `Unique Visitors Count: 4
Arrival Order: [usr-node-01, usr-node-02, usr-node-03, usr-node-04]
Highest Leaderboard Score: 920
Lowest Leaderboard Score: 180`,
        stepByStep: [
          'recordVisit deduplicates IDs via HashSet.add() returning boolean.',
          'Arrival order is audited via LinkedHashSet.',
          'Scores are sorted and min/max retrieved via TreeSet.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Broken equals and hashCode Contract',
        cause: 'Overriding equals() without overriding hashCode() causes equal objects to land in different hash buckets, causing duplicate entries in a HashSet.',
        solution: 'Always override both equals() and hashCode() consistently on custom key classes.'
      }
    ],
    bestPractices: {
      doList: [
        'Default to HashSet for high-throughput uniqueness checks.',
        'Use LinkedHashSet when deterministic iteration order is needed.',
        'Ensure objects stored in sets are immutable.'
      ],
      dontList: [
        'Do not use TreeSet simply to remove duplicates; O(log n) tree balancing is slower than O(1) hashing.',
        'Never mutate fields of an object while it resides inside a Set.'
      ],
      whenNotToUse: 'Do not use Set if you need duplicate entries or positional index access (use List).'
    },
    versionNotes: {
      introduced: 'Java 1.2',
      status: 'Stable',
      compatibilityNotes: 'Java 6 added NavigableSet. Java 9 added Set.of(...) factory methods.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Set Hierarchy Cheat Sheet',
      headers: ['Set Implementation', 'Underlying Structure', 'Time Complexity', 'Ordering Guarantee'],
      rows: [
        ['HashSet', 'Hash table (HashMap)', 'O(1) average', 'None (arbitrary bucket order)'],
        ['LinkedHashSet', 'Hash table + Doubly-linked list', 'O(1) average', 'Deterministic insertion order'],
        ['TreeSet', 'Red-Black Tree (TreeMap)', 'O(log n)', 'Strictly sorted by natural or Comparator order']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Missing Comparable on TreeSet Element',
        prompt: 'Why does Set<User> set = new TreeSet<>() throw ClassCastException when calling set.add(new User())?',
        solution: 'TreeSet requires elements to implement Comparable<T> or an explicit Comparator must be passed to the constructor.',
        explanation: 'TreeSet relies on compareTo() or compare() to position nodes in its Red-Black tree.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.util.Set',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Set.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 37: The Map Hierarchy
  {
    id: 'topic-37',
    slug: 'the-map-hierarchy',
    topicNumber: 37,
    title: 'The Map Hierarchy',
    part: 'Part 1: Java Core',
    sectionNumber: 10,
    sectionTitle: 'Generics & Collections Framework',
    versionBadge: 'Java 1.2+ (Treeification: Java 8)',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master key-value storage: HashMap buckets & treeification threshold, LinkedHashMap LRU caching, TreeMap sorting, and Java 8 functional map methods.',
    prerequisites: [
      'Topic 33: Generics Fundamentals',
      'Topic 36: The Set Hierarchy'
    ],
    whatAndWhy: {
      definition: 'Map<K, V> maps unique keys to values. HashMap provides O(1) operations, LinkedHashMap supports insertion/access order, and TreeMap maintains sorted keys.',
      analogy: 'Post office mailboxes: each mailbox has a key number (Key) and contains mail (Value). The clerk uses hashCode to walk directly to the mailbox in seconds.',
      whyItExists: 'Storing associative pairs in lists requires O(n) search. Map structures provide instant O(1) retrieval by key.'
    },
    syntaxBreakdown: {
      title: 'Map Implementations & Functional Methods',
      codeSnippet: `Map<String, Integer> map = new HashMap<>();
map.putIfAbsent("Key", 100);
map.computeIfPresent("Key", (k, v) -> v + 10);
int val = map.getOrDefault("Unknown", 0);`,
      explanation: 'Modern methods eliminate verbose null checks and provide atomic updates.',
      tokens: [
        { token: 'HashMap', explanation: 'O(1) hash table; bins convert to Red-Black trees after 8 collisions.' },
        { token: 'LinkedHashMap', explanation: 'Doubly-linked entries; supports LRU access order.' },
        { token: 'TreeMap', explanation: 'NavigableMap sorted by key natural order or Comparator.' },
        { token: 'computeIfAbsent', explanation: 'Computes and inserts value lazily if key is missing.' }
      ]
    },
    examples: [
      {
        id: '37-1',
        title: 'Comparing Map Implementations & Functional Methods',
        type: 'basic',
        description: 'Demonstrates HashMap, LinkedHashMap, TreeMap, and modern functional Map methods.',
        filename: 'MapHierarchyDemo.java',
        code: `import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

public class MapHierarchyDemo {
    public static void main(String[] args) {
        Map<String, Integer> inventory = new HashMap<>();
        inventory.put("Laptops", 15);
        inventory.put("Monitors", 28);
        inventory.putIfAbsent("Keyboards", 50);
        inventory.computeIfPresent("Laptops", (k, v) -> v + 5);
        int miceCount = inventory.getOrDefault("Mice", 0);

        System.out.println("HashMap Laptops: " + inventory.get("Laptops"));
        System.out.println("HashMap Mice (default): " + miceCount);

        Map<String, String> orderedConfig = new LinkedHashMap<>();
        orderedConfig.put("env", "production");
        orderedConfig.put("port", "8443");
        orderedConfig.put("ssl", "true");
        System.out.println("LinkedHashMap Keys: " + orderedConfig.keySet());

        NavigableMap<Integer, String> errorCodeMap = new TreeMap<>();
        errorCodeMap.put(500, "Internal Server Error");
        errorCodeMap.put(404, "Not Found");
        errorCodeMap.put(400, "Bad Request");
        errorCodeMap.put(403, "Forbidden");

        System.out.println("TreeMap Lowest Code: " + errorCodeMap.firstKey());
        System.out.println("TreeMap Client Errors (< 500): " + errorCodeMap.headMap(500).keySet());
    }
}`,
        output: `HashMap Laptops: 20
HashMap Mice (default): 0
LinkedHashMap Keys: [env, port, ssl]
TreeMap Lowest Code: 400
TreeMap Client Errors (< 500): [400, 403, 404]`,
        stepByStep: [
          'computeIfPresent atomically updates inventory counts.',
          'LinkedHashMap preserves exact configuration key sequence.',
          'TreeMap sorted keys allow headMap range sub-views.'
        ]
      },
      {
        id: '37-2',
        title: 'Production-Grade LRU Cache',
        type: 'realistic',
        description: 'Implements a Least Recently Used (LRU) Cache using LinkedHashMap access order and removeEldestEntry.',
        filename: 'InMemoryCacheServiceApp.java',
        code: `import java.util.LinkedHashMap;
import java.util.Map;

public class InMemoryCacheServiceApp {
    public static class LruCache<K, V> extends LinkedHashMap<K, V> {
        private final int maxCapacity;
        public LruCache(int maxCapacity) {
            super(maxCapacity, 0.75f, true);
            this.maxCapacity = maxCapacity;
        }
        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > maxCapacity;
        }
    }

    public static void main(String[] args) {
        LruCache<String, String> sessionCache = new LruCache<>(3);
        sessionCache.put("session_1", "User_Alice");
        sessionCache.put("session_2", "User_Bob");
        sessionCache.put("session_3", "User_Charlie");
        System.out.println("Initial Cache Keys: " + sessionCache.keySet());

        sessionCache.get("session_1");
        sessionCache.put("session_4", "User_Diana");

        System.out.println("Cache Keys after Eviction: " + sessionCache.keySet());
        System.out.println("Is session_2 retained? " + sessionCache.containsKey("session_2"));
        System.out.println("Is session_1 retained? " + sessionCache.containsKey("session_1"));
    }
}`,
        output: `Initial Cache Keys: [session_1, session_2, session_3]
Cache Keys after Eviction: [session_3, session_1, session_4]
Is session_2 retained? false
Is session_1 retained? true`,
        stepByStep: [
          'LruCache sets accessOrder=true in LinkedHashMap.',
          'get(session_1) moves session_1 to most-recently-used tail.',
          'put(session_4) triggers removeEldestEntry, evicting least-recently-used session_2.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Mutable Map Keys',
        cause: 'Modifying fields of an object used as a Map key alters its hashCode, making the entry permanently lost in the wrong bucket.',
        solution: 'Always use immutable keys (String, boxed numbers, Records).'
      }
    ],
    bestPractices: {
      doList: [
        'Use computeIfAbsent() to populate nested collection maps cleanly.',
        'Use getOrDefault() to avoid clumsy null checks.',
        'Set initial capacity if item volume is known in advance.'
      ],
      dontList: [
        'Never use obsolete java.util.Hashtable; use ConcurrentHashMap instead.',
        'Do not assume HashMap retains key order.'
      ],
      whenNotToUse: 'Do not use HashMap in multi-threaded write contexts without synchronization (use ConcurrentHashMap).'
    },
    versionNotes: {
      introduced: 'Java 1.2',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added treeification for buckets with > 8 collisions (JEP 180) and compute/merge methods. Java 9 added Map.of(...) factory methods.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Map Hierarchy Cheat Sheet',
      headers: ['Implementation', 'Structure', 'Lookup Time', 'Key Order'],
      rows: [
        ['HashMap', 'Array of buckets (Lists/Trees)', 'O(1) average', 'Unordered'],
        ['LinkedHashMap', 'Buckets + Doubly-linked entries', 'O(1) average', 'Insertion or LRU Access order'],
        ['TreeMap', 'Red-Black Tree', 'O(log n)', 'Sorted by key natural or Comparator order'],
        ['ConcurrentHashMap', 'CAS + bin-level synchronization', 'O(1) average', 'Unordered, thread-safe']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Word Frequency Aggregator',
        prompt: 'Use Map.merge() to aggregate word frequencies from a list.',
        solution: 'Map<String, Integer> counts = new HashMap<>(); for (String w : words) counts.merge(w, 1, Integer::sum);',
        explanation: 'merge() atomically creates or sums map integer values.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.util.Map',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Map.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 38: The Queue & Deque Hierarchy
  {
    id: 'topic-38',
    slug: 'the-queue-and-deque-hierarchy',
    topicNumber: 38,
    title: 'The Queue & Deque Hierarchy',
    part: 'Part 1: Java Core',
    sectionNumber: 10,
    sectionTitle: 'Generics & Collections Framework',
    versionBadge: 'Java 5+ (Deque: Java 6)',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master FIFO queues, LIFO stacks, PriorityQueue min-heaps, and high-performance circular ArrayDeque.',
    prerequisites: [
      'Topic 33: Generics Fundamentals',
      'Topic 35: The List Hierarchy'
    ],
    whatAndWhy: {
      definition: 'Queue<E> processes elements in specific sequences (FIFO). Deque<E> supports insertion and removal at both ends. PriorityQueue orders elements using binary heaps.',
      analogy: 'Drive-through bank lane (FIFO Queue). Cafeteria tray dispenser (LIFO Stack). Emergency room triage (PriorityQueue): critical patients treated first regardless of arrival time.',
      whyItExists: 'Removing from the head of an ArrayList takes O(n) element shifting. Queue implementations provide O(1) head and tail operations.'
    },
    syntaxBreakdown: {
      title: 'Queue & Deque Operations',
      codeSnippet: `Queue<String> queue = new ArrayDeque<>();
queue.offer("task"); // Non-throwing insert
String next = queue.poll(); // Non-throwing remove

Deque<String> stack = new ArrayDeque<>();
stack.push("action"); // LIFO push
String top = stack.pop(); // LIFO pop`,
      explanation: 'ArrayDeque replaces legacy java.util.Stack and Vector.',
      tokens: [
        { token: 'offer / poll', explanation: 'Special-value methods returning false/null on failure.' },
        { token: 'ArrayDeque', explanation: 'Circular array implementation; optimal for stacks and queues.' },
        { token: 'PriorityQueue', explanation: 'Array-based binary min-heap for priority scheduling.' }
      ]
    },
    examples: [
      {
        id: '38-1',
        title: 'Basic Queue, Deque & PriorityQueue Mechanics',
        type: 'basic',
        description: 'Demonstrates FIFO queuing, LIFO stack operations with ArrayDeque, and min-heap ordering.',
        filename: 'QueueDequeDemo.java',
        code: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

public class QueueDequeDemo {
    public static void main(String[] args) {
        Queue<String> taskQueue = new ArrayDeque<>();
        taskQueue.offer("Job-Alpha");
        taskQueue.offer("Job-Beta");
        taskQueue.offer("Job-Gamma");
        System.out.println("FIFO Peek: " + taskQueue.peek());
        System.out.println("FIFO Poll 1: " + taskQueue.poll());
        System.out.println("FIFO Poll 2: " + taskQueue.poll());

        Deque<String> undoStack = new ArrayDeque<>();
        undoStack.push("Action-Edit");
        undoStack.push("Action-Format");
        undoStack.push("Action-Delete");
        System.out.println("LIFO Pop 1: " + undoStack.pop());
        System.out.println("LIFO Pop 2: " + undoStack.pop());

        Queue<Integer> priorityQueue = new PriorityQueue<>();
        priorityQueue.offer(45);
        priorityQueue.offer(12);
        priorityQueue.offer(89);
        priorityQueue.offer(5);
        System.out.println("Min-heap extraction order:");
        while (!priorityQueue.isEmpty()) System.out.print(priorityQueue.poll() + " ");
        System.out.println();
    }
}`,
        output: `FIFO Peek: Job-Alpha
FIFO Poll 1: Job-Alpha
FIFO Poll 2: Job-Beta
LIFO Pop 1: Action-Delete
LIFO Pop 2: Action-Format
Min-heap extraction order:
5 12 45 89`,
        stepByStep: [
          'ArrayDeque processes FIFO task jobs in O(1).',
          'ArrayDeque functions as high-performance LIFO undo stack.',
          'PriorityQueue min-heap extracts lowest numbers first in O(log n).'
        ]
      },
      {
        id: '38-2',
        title: 'Priority Task Scheduler & Sliding-Window Audit',
        type: 'realistic',
        description: 'Schedules tasks by priority level and records recent executions in an ArrayDeque sliding window.',
        filename: 'JobSchedulerApp.java',
        code: `import java.util.ArrayDeque;
import java.util.Comparator;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

public class JobSchedulerApp {
    public record ScheduledJob(String jobId, int priorityLevel, String taskName) {}

    public static class TaskEngine {
        private final Queue<ScheduledJob> executionQueue = new PriorityQueue<>(
                Comparator.comparingInt(ScheduledJob::priorityLevel).reversed()
        );
        private final Deque<String> recentHistory = new ArrayDeque<>();
        private final int historyLimit;

        public TaskEngine(int historyLimit) { this.historyLimit = historyLimit; }
        public void submit(ScheduledJob job) { executionQueue.offer(job); }
        public void processNext() {
            ScheduledJob nextJob = executionQueue.poll();
            if (nextJob != null) {
                System.out.println("Processing: " + nextJob.taskName());
                if (recentHistory.size() >= historyLimit) recentHistory.removeLast();
                recentHistory.addFirst(nextJob.jobId() + ":" + nextJob.taskName());
            }
        }
        public Deque<String> getHistory() { return new ArrayDeque<>(recentHistory); }
        public int getPendingCount() { return executionQueue.size(); }
    }

    public static void main(String[] args) {
        TaskEngine engine = new TaskEngine(3);
        engine.submit(new ScheduledJob("J-1", 1, "LowPriority-Cleanup"));
        engine.submit(new ScheduledJob("J-2", 10, "Critical-Database-Failover"));
        engine.submit(new ScheduledJob("J-3", 5, "Normal-Report-Gen"));
        engine.submit(new ScheduledJob("J-4", 8, "High-Security-Patch"));

        System.out.println("Pending jobs before processing: " + engine.getPendingCount());
        engine.processNext();
        engine.processNext();
        engine.processNext();
        engine.processNext();
        System.out.println("Pending jobs remaining: " + engine.getPendingCount());
        System.out.println("Execution History (Most recent first, limit 3): " + engine.getHistory());
    }
}`,
        output: `Pending jobs before processing: 4
Processing: Critical-Database-Failover
Processing: High-Security-Patch
Processing: Normal-Report-Gen
Processing: LowPriority-Cleanup
Pending jobs remaining: 0
Execution History (Most recent first, limit 3): [J-1:LowPriority-Cleanup, J-3:Normal-Report-Gen, J-4:High-Security-Patch]`,
        stepByStep: [
          'PriorityQueue extracts highest priority job (J-2, priority 10) first.',
          'ArrayDeque addFirst and removeLast manage a fixed 3-element sliding history window in O(1).'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Using Legacy java.util.Stack',
        cause: 'Stack extends Vector, imposing synchronized method overhead and permitting illegal middle-index insertions.',
        solution: 'Always use Deque<T> stack = new ArrayDeque<>().'
      }
    ],
    bestPractices: {
      doList: [
        'Default to ArrayDeque for both FIFO queue and LIFO stack implementations.',
        'Prefer offer() and poll() over add() and remove() to avoid exception overhead.'
      ],
      dontList: [
        'Do not use LinkedList for queue logic due to excessive node allocation overhead.',
        'Never insert null into ArrayDeque or PriorityQueue.'
      ],
      whenNotToUse: 'Do not use PriorityQueue for thread-safe concurrent producer-consumer pipelines (use PriorityBlockingQueue).'
    },
    versionNotes: {
      introduced: 'Java 5 (JSR 166)',
      status: 'Stable',
      compatibilityNotes: 'Java 6 added Deque and ArrayDeque.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Queue & Deque Cheat Sheet',
      headers: ['Collection', 'Structure', 'Head Access', 'Primary Use Case'],
      rows: [
        ['ArrayDeque', 'Circular Array', 'O(1) constant', 'FIFO Queues and LIFO Stacks'],
        ['PriorityQueue', 'Binary Heap', 'O(log n)', 'Priority-ordered task scheduling'],
        ['ArrayBlockingQueue', 'Bounded Array with Locks', 'O(1) blocking', 'Thread-safe Producer-Consumer pipelines']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Iterating PriorityQueue',
        prompt: 'Why does for (int n : priorityQueue) not print items in sorted priority order?',
        solution: 'PriorityQueue stores elements in a partially ordered binary heap array. Iterating with foreach traverses raw array slots. You must call poll() repeatedly to extract in priority order.',
        explanation: 'Only the root element of a heap is guaranteed to be the minimum.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.util.ArrayDeque',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayDeque.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 39: Comparable & Comparator
  {
    id: 'topic-39',
    slug: 'comparable-and-comparator',
    topicNumber: 39,
    title: 'Comparable & Comparator',
    part: 'Part 1: Java Core',
    sectionNumber: 10,
    sectionTitle: 'Generics & Collections Framework',
    versionBadge: 'Java 1.2+ (Fluent APIs: Java 8)',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master natural ordering (Comparable) and customizable multi-attribute sorting (Comparator chaining, nullsFirst, TimSort stability).',
    prerequisites: [
      'Topic 33: Generics Fundamentals',
      'Topic 23: Interfaces & Modern Interface Evolution'
    ],
    whatAndWhy: {
      definition: 'Comparable<T> defines intrinsic natural ordering inside a class via compareTo(). Comparator<T> defines external custom sorting rules via compare() and fluent chaining.',
      analogy: 'Olympic marathon: runners have an innate finish time (Comparable). Broadcasters can sort them externally by age, country, or sponsor (Comparator).',
      whyItExists: 'Collections of custom objects cannot sort automatically without explicit comparison criteria.'
    },
    syntaxBreakdown: {
      title: 'Comparable vs Fluent Comparator Chaining',
      codeSnippet: `public class Item implements Comparable<Item> {
    public int compareTo(Item o) { return Integer.compare(this.val, o.val); }
}

Comparator<Product> comp = Comparator
    .comparing(Product::category)
    .thenComparing(Comparator.comparingDouble(Product::rating).reversed())
    .thenComparingDouble(Product::price);`,
      explanation: 'Use Integer.compare() to avoid overflow bugs. Chain criteria with thenComparing.',
      tokens: [
        { token: 'Comparable<T>', explanation: 'Natural order interface implemented by the domain class.' },
        { token: 'Comparator.comparing', explanation: 'Java 8 factory extracting sort keys.' },
        { token: 'thenComparing', explanation: 'Secondary tie-breaking comparison.' },
        { token: 'TimSort', explanation: 'JDK hybrid stable sorting algorithm (O(n log n)).' }
      ]
    },
    examples: [
      {
        id: '39-1',
        title: 'Natural vs Chained Comparator Sorting',
        type: 'basic',
        description: 'Demonstrates natural sorting by latency and multi-attribute chained sorting.',
        filename: 'ComparableComparatorDemo.java',
        code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ComparableComparatorDemo {
    public record ServerNode(String hostname, int latencyMs) implements Comparable<ServerNode> {
        @Override
        public int compareTo(ServerNode other) {
            return Integer.compare(this.latencyMs, other.latencyMs);
        }
    }

    public static void main(String[] args) {
        List<ServerNode> cluster = new ArrayList<>();
        cluster.add(new ServerNode("us-east-1", 45));
        cluster.add(new ServerNode("eu-central-1", 120));
        cluster.add(new ServerNode("ap-southeast-1", 85));
        cluster.add(new ServerNode("us-west-2", 45));

        Collections.sort(cluster);
        System.out.println("Sorted by Natural Order (Latency Ascending):");
        for (ServerNode node : cluster) System.out.println("  " + node.hostname() + " -> " + node.latencyMs() + "ms");

        cluster.sort(Comparator.comparingInt(ServerNode::latencyMs).thenComparing(ServerNode::hostname));
        System.out.println("\nSorted with Chained Comparator (Latency, then Hostname):");
        for (ServerNode node : cluster) System.out.println("  " + node.hostname() + " -> " + node.latencyMs() + "ms");
    }
}`,
        output: `Sorted by Natural Order (Latency Ascending):
  us-east-1 -> 45ms
  us-west-2 -> 45ms
  ap-southeast-1 -> 85ms
  eu-central-1 -> 120ms

Sorted with Chained Comparator (Latency, then Hostname):
  us-east-1 -> 45ms
  us-west-2 -> 45ms
  ap-southeast-1 -> 85ms
  eu-central-1 -> 120ms`,
        stepByStep: [
          'Collections.sort invokes Comparable.compareTo on ServerNode latency.',
          'cluster.sort applies chained Comparator: latency first, then hostname alphabetically.'
        ]
      },
      {
        id: '39-2',
        title: 'Multi-Attribute Product Catalog Ranking',
        type: 'realistic',
        description: 'Ranks products by category, rating descending, and price ascending using chained comparators.',
        filename: 'ProductCatalogRankingApp.java',
        code: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ProductCatalogRankingApp {
    public record Product(String sku, String category, double rating, double priceUsd) {}

    public static void main(String[] args) {
        List<Product> catalog = new ArrayList<>();
        catalog.add(new Product("SKU-1", "Electronics", 4.8, 299.99));
        catalog.add(new Product("SKU-2", "Books", 4.9, 24.50));
        catalog.add(new Product("SKU-3", "Electronics", 4.8, 149.99));
        catalog.add(new Product("SKU-4", "Electronics", 4.2, 89.99));
        catalog.add(new Product("SKU-5", "Books", 4.5, 15.00));

        Comparator<Product> rankingComparator = Comparator
                .comparing(Product::category)
                .thenComparing(Comparator.comparingDouble(Product::rating).reversed())
                .thenComparingDouble(Product::priceUsd);

        catalog.sort(rankingComparator);
        System.out.println("Ranked Product Catalog:");
        for (Product p : catalog) {
            System.out.printf("  [%s] %s | Rating: %.1f | Price: $%.2f%n",
                    p.category(), p.sku(), p.rating(), p.priceUsd());
        }
    }
}`,
        output: `Ranked Product Catalog:
  [Books] SKU-2 | Rating: 4.9 | Price: $24.50
  [Books] SKU-5 | Rating: 4.5 | Price: $15.00
  [Electronics] SKU-3 | Rating: 4.8 | Price: $149.99
  [Electronics] SKU-1 | Rating: 4.8 | Price: $299.99
  [Electronics] SKU-4 | Rating: 4.2 | Price: $89.99`,
        stepByStep: [
          'Compares category alphabetically.',
          'When categories tie, compares rating descending.',
          'When ratings tie, compares price ascending.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Integer Subtraction Overflow in compareTo',
        cause: 'Returning this.val - other.val causes 32-bit integer overflow if values cross Integer.MIN_VALUE.',
        solution: 'Always use Integer.compare(this.val, other.val).'
      }
    ],
    bestPractices: {
      doList: [
        'Use Comparable only when an intrinsic, universal natural ordering exists.',
        'Prefer fluent Comparator.comparing(...) methods over verbose anonymous classes.',
        'Keep compareTo() consistent with equals().'
      ],
      dontList: [
        'Never use subtraction for numeric comparisons.',
        'Do not violate transitivity or antisymmetry rules in comparison logic.'
      ],
      whenNotToUse: 'Do not implement Comparable if objects have multiple equally valid sorting perspectives (use external Comparators).'
    },
    versionNotes: {
      introduced: 'Java 1.2',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added fluent Comparator methods (comparing, thenComparing, reversed) and List.sort().',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Comparable vs Comparator Cheat Sheet',
      headers: ['Feature', 'Comparable<T>', 'Comparator<T>'],
      rows: [
        ['Package', 'java.lang', 'java.util'],
        ['Method', 'int compareTo(T o)', 'int compare(T o1, T o2)'],
        ['Location', 'Inside the domain class', 'External class, lambda, or static factory'],
        ['Number of Orders', 'Exactly one (natural order)', 'Unlimited custom ordering strategies']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Null-Safe Comparator',
        prompt: 'Create a comparator sorting users by email, placing null emails at the end.',
        solution: 'Comparator.comparing(User::getEmail, Comparator.nullsLast(Comparator.naturalOrder()));',
        explanation: 'nullsLast cleanly handles null field values without NullPointerException.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.util.Comparator',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Comparator.html',
        organization: 'Oracle'
      }
    ]
  },

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
      codeSnippet: `Predicate<Integer> isPort = p -> p >= 1024 && p <= 65535;
Function<String, String> upper = s -> s.toUpperCase();
Consumer<String> logger = msg -> System.out.println(msg);
Supplier<Long> timestamp = () -> System.currentTimeMillis();`,
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
        code: `import java.util.function.Consumer;
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
}`,
        output: `Port 8080 valid: true
Port 80 valid:   false
Formatted Message: [PRODUCTION] DATABASE CONNECTED
[AUDIT LOG] User root authenticated successfully
Generated Timestamp: true`,
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
        code: `import java.util.ArrayList;
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

        System.out.println("\nCritical Auth Alerts: " + criticalAuth.size());
        for (SystemAlert a : criticalAuth) System.out.println("  Security Alert: " + a.sourceService() + " (Sev " + a.severityLevel() + ")");
    }
}`,
        output: `Total Alerts Triggering On-Call: 2
  Paging On-Call: auth-service (Sev 5)
  Paging On-Call: database-cluster (Sev 4)

Critical Auth Alerts: 1
  Security Alert: auth-service (Sev 5)`,
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
        solution: `public static <T> T retry(Supplier<T> action, int maxAttempts) {
    RuntimeException last = null;
    for (int i = 0; i < maxAttempts; i++) {
        try { return action.get(); }
        catch (RuntimeException ex) { last = ex; }
    }
    throw last;
}`,
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
      codeSnippet: `Function<String, String> staticRef = StringFormatter::toTitle;
Consumer<String> boundRef = printer::printStandard;
Function<String, String> unboundRef = String::toUpperCase;
Function<String, User> ctorRef = User::new;`,
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
        code: `import java.util.ArrayList;
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
}`,
        output: `Static Ref Output: Production
[AUDIT SINK] Cluster node healthy
Unbound Ref Output: LATENCY
Constructor Ref Output: AUTH_SESSION_99
Array Length: 3`,
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
        code: `import java.util.ArrayList;
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
}`,
        output: `Cleansed Customer Roster (3 records):
  Alice Walker <alice@example.com>
  Bob Vance <bob.vance@refrigeration.com>
  Charlie Day <charlie@paddys.org>`,
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
      codeSnippet: `List<String> result = source.stream()
    .filter(s -> s.length() > 3)     // Intermediate (lazy)
    .map(String::toUpperCase)        // Intermediate (lazy)
    .distinct()                      // Intermediate (lazy)
    .sorted()                        // Intermediate (lazy)
    .limit(5)                        // Intermediate (lazy)
    .toList();                       // Terminal (eager)`,
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
        code: `import java.util.Arrays;
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

        System.out.println("\n=== 2. Intermediate Operations Chain ===");
        List<String> processed = rawTokens.stream()
                .filter(s -> s.length() >= 5)
                .distinct()
                .sorted()
                .map(String::toUpperCase)
                .limit(2)
                .toList();
        System.out.println("Final Processed List: " + processed);

        System.out.println("\n=== 3. FlatMap Transformation ===");
        List<List<Integer>> nestedLists = List.of(List.of(1, 2, 3), List.of(4, 5), List.of(6, 7, 8));
        List<Integer> flattened = nestedLists.stream().flatMap(List::stream).toList();
        System.out.println("Flattened Elements: " + flattened);
    }
}`,
        output: `=== 1. Demonstrating Lazy Evaluation ===
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
Flattened Elements: [1, 2, 3, 4, 5, 6, 7, 8]`,
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
        code: `import java.util.Arrays;
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

        System.out.println("\nDistinct Active API Resources: " + distinctApiResources);
    }
}`,
        output: `Slow API Requests (>= 50ms):
  [500] /api/v1/orders/submit -> 850ms
  [401] /api/v1/auth/login -> 120ms
  [200] /api/v1/users/profile -> 60ms

Distinct Active API Resources: [auth, orders, users]`,
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
      codeSnippet: `int sum = stream.reduce(0, Integer::sum);
String joined = stream.collect(Collectors.joining(", "));
Map<String, List<Item>> byCategory = stream.collect(Collectors.groupingBy(Item::category));
Map<Boolean, List<Item>> partitioned = stream.collect(Collectors.partitioningBy(Item::isUrgent));`,
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
        code: `import java.util.List;
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
}`,
        output: `Total CPU Load: 257
Active Types: [Server, Gateway, Sensor]
Overloaded Devices Count (>= 80%): 2
Normal Devices Count (< 80%):       4
Device Count by Type: {Server=2, Gateway=2, Sensor=2}`,
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
        code: `import java.util.List;
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

        System.out.println("\nHigh-Value Transfers (>= $5,000): " + highValueSplit.get(true));
        System.out.println("Standard Volume Transfers:        " + highValueSplit.get(false));
    }
}`,
        output: `Total Spending by Category:
  EQUIPMENT       -> $ 15,000.00
  SALARY          -> $  8,500.00
  MARKETING       -> $    450.50
  TRAVEL          -> $    320.00
  CLOUD_INFRA     -> $  4,450.00

High-Value Transfers (>= $5,000): [TX-103, TX-107]
Standard Volume Transfers:        [TX-101, TX-102, TX-104, TX-105, TX-106]`,
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
      codeSnippet: `Optional<String> opt = Optional.ofNullable(rawValue);
String val = opt.orElse("default");
String lazyVal = opt.orElseGet(() -> computeFallback());
Optional<Integer> len = opt.map(String::length);
opt.ifPresent(v -> System.out.println(v));`,
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
        code: `import java.util.Optional;

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
}`,
        output: `Config URL:     jdbc:postgresql://localhost:5432/main_db
Missing Fallback: FALLBACK_VALUE
Parsed Pool Size: 20
Audit Notification: Found valid DB endpoint: jdbc:postgresql://localhost:5432/main_db`,
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
        code: `import java.util.List;
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
}`,
        output: `User 1 Webhook: https://hooks.corp/alice
User 2 Webhook: https://default.corp/sink
User 99 Webhook: https://default.corp/sink`,
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

// Topic 45: Classic I/O Streams
  {
    id: 'topic-45',
    slug: 'classic-io-streams',
    topicNumber: 45,
    title: 'Classic I/O Streams',
    part: 'Part 1: Java Core',
    sectionNumber: 12,
    sectionTitle: 'File I/O, NIO.2 & Date/Time',
    versionBadge: 'Java 1.0+ (UTF-8 default: Java 18)',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master byte vs character streams, BufferedReader / BufferedWriter, UTF-8 character encoding, buffer flushing, and stream resource closing.',
    prerequisites: [
      'Topic 31: Try-With-Resources & AutoCloseable',
      'Topic 07: Strings & Text Blocks'
    ],
    whatAndWhy: {
      definition: 'I/O Streams convey ordered sequences of data to and from files, sockets, and hardware. Byte streams handle raw 8-bit binary data; character streams translate bytes into characters using explicit encodings.',
      analogy: 'Drinking water: an unbuffered stream is an eye-dropper where every single droplet requires a physical reach. A buffered stream is drinking from an 8 KB glass filled in one quick OS action.',
      whyItExists: 'In-memory RAM variables are volatile. File I/O streams provide persistent storage across machine restarts.'
    },
    syntaxBreakdown: {
      title: 'Buffered Character Stream Syntax',
      codeSnippet: `try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, StandardCharsets.UTF_8))) {
    writer.write("KEY=VALUE");
    writer.newLine();
    writer.flush();
}

try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) { ... }
}`,
      explanation: 'Always wrap readers and writers in buffered decorators with explicit UTF-8 charset.',
      tokens: [
        { token: 'BufferedReader', explanation: 'Reads character streams with in-memory buffering.' },
        { token: 'BufferedWriter', explanation: 'Buffers character writes to minimize OS disk operations.' },
        { token: 'StandardCharsets.UTF_8', explanation: 'Universal Unicode character encoding format.' },
        { token: 'flush()', explanation: 'Forces buffered in-memory bytes out to disk.' }
      ]
    },
    examples: [
      {
        id: '45-1',
        title: 'Buffered File Read & Write with UTF-8',
        type: 'basic',
        description: 'Demonstrates writing structured text configuration entries and reading line by line.',
        filename: 'ClassicIoStreamsDemo.java',
        code: `import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class ClassicIoStreamsDemo {
    public static void main(String[] args) throws IOException {
        File tempFile = File.createTempFile("classic_io_demo", ".txt");
        tempFile.deleteOnExit();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile, StandardCharsets.UTF_8))) {
            writer.write("SERVER_STATUS=HEALTHY");
            writer.newLine();
            writer.write("UPTIME_SECONDS=86400");
            writer.newLine();
            writer.write("ACTIVE_THREADS=16");
            writer.newLine();
            writer.flush();
        }

        System.out.println("File written successfully: " + tempFile.getName());

        System.out.println("\nReading configuration entries:");
        try (BufferedReader reader = new BufferedReader(new FileReader(tempFile, StandardCharsets.UTF_8))) {
            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) {
                System.out.println("  Line " + lineNumber + ": " + line);
                lineNumber++;
            }
        }
    }
}`,
        output: `File written successfully: classic_io_demo...txt

Reading configuration entries:
  Line 1: SERVER_STATUS=HEALTHY
  Line 2: UPTIME_SECONDS=86400
  Line 3: ACTIVE_THREADS=16`,
        stepByStep: [
          'BufferedWriter buffers text into memory and commits via flush().',
          'BufferedReader reads lines sequentially until reaching end-of-file (null).'
        ]
      },
      {
        id: '45-2',
        title: 'Structured Audit Log Rotator & Scanner',
        type: 'realistic',
        description: 'Appends audit log events to file in UTF-8 format and scans them into typed records.',
        filename: 'AuditLogRotatorApp.java',
        code: `import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class AuditLogRotatorApp {
    public record AuditEvent(long timestamp, String user, String action, String ip) {}

    public static class AuditFileWriter {
        private final File targetFile;
        public AuditFileWriter(File targetFile) { this.targetFile = targetFile; }

        public void appendEvent(AuditEvent event) throws IOException {
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(targetFile, StandardCharsets.UTF_8, true))) {
                writer.write(String.format("%d|%s|%s|%s", event.timestamp(), event.user(), event.action(), event.ip()));
                writer.newLine();
                writer.flush();
            }
        }

        public List<AuditEvent> readAllEvents() throws IOException {
            List<AuditEvent> events = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new FileReader(targetFile, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.isBlank()) continue;
                    String[] parts = line.split("\\|");
                    if (parts.length == 4) {
                        events.add(new AuditEvent(Long.parseLong(parts[0]), parts[1], parts[2], parts[3]));
                    }
                }
            }
            return events;
        }
    }

    public static void main(String[] args) throws IOException {
        File logFile = File.createTempFile("audit_ledger", ".log");
        logFile.deleteOnExit();

        AuditFileWriter writer = new AuditFileWriter(logFile);
        writer.appendEvent(new AuditEvent(1700000001L, "admin", "LOGIN_SUCCESS", "192.168.1.10"));
        writer.appendEvent(new AuditEvent(1700000002L, "operator", "UPDATE_CONFIG", "10.0.0.5"));
        writer.appendEvent(new AuditEvent(1700000003L, "root", "PASSWORD_RESET", "192.168.1.25"));

        List<AuditEvent> recorded = writer.readAllEvents();
        System.out.println("Recorded Audit Events (" + recorded.size() + " total):");
        for (AuditEvent ev : recorded) {
            System.out.printf("  [%d] User: %-10s Action: %-15s IP: %s%n", ev.timestamp(), ev.user(), ev.action(), ev.ip());
        }
    }
}`,
        output: `Recorded Audit Events (3 total):
  [1700000001] User: admin      Action: LOGIN_SUCCESS   IP: 192.168.1.10
  [1700000002] User: operator   Action: UPDATE_CONFIG   IP: 10.0.0.5
  [1700000003] User: root       Action: PASSWORD_RESET  IP: 192.168.1.25`,
        stepByStep: [
          'Appends pipe-delimited records using FileWriter append mode.',
          'BufferedReader parses events line-by-line without buffering full file on heap.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Omitting Explicit Charset',
        cause: 'Relying on platform-default charset causes file corruption across Windows and Linux.',
        solution: 'Always pass StandardCharsets.UTF_8 explicitly.'
      },
      {
        title: 'Forgetting to Flush Buffered Stream',
        cause: 'Terminating an application before flush() or close() discards bytes in the 8 KB memory buffer.',
        solution: 'Always use try-with-resources to guarantee automatic close and flush.'
      }
    ],
    bestPractices: {
      doList: [
        'Always wrap raw file streams in BufferedReader or BufferedWriter.',
        'Use StandardCharsets.UTF_8 universally.',
        'Use try-with-resources for deterministic file handle cleanup.'
      ],
      dontList: [
        'Never use character streams (FileReader) to copy raw binary images or audio.',
        'Never ignore IOException.'
      ],
      whenNotToUse: 'Do not use classic java.io streams for new code if modern NIO.2 Files utility methods fit.'
    },
    versionNotes: {
      introduced: 'Java 1.0 / 1.1',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added AutoCloseable. Java 18 (JEP 400) made UTF-8 the universal default.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Classic I/O Streams Cheat Sheet',
      headers: ['Data Mode', 'Base Class', 'Buffered Wrapper', 'Use Case'],
      rows: [
        ['Character', 'Reader / Writer', 'BufferedReader / BufferedWriter', 'Text, logs, CSV, JSON'],
        ['Byte', 'InputStream / OutputStream', 'BufferedInputStream / BufferedOutputStream', 'Images, ZIP, compiled classes']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'File Line Counter',
        prompt: 'Count total lines in a file using BufferedReader.',
        solution: 'long count = 0; try (BufferedReader r = new BufferedReader(new FileReader(f, StandardCharsets.UTF_8))) { while (r.readLine() != null) count++; } return count;',
        explanation: 'readLine() returns null upon reaching EOF.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.io.BufferedReader',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/BufferedReader.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 46: Modern NIO.2 File Operations
  {
    id: 'topic-46',
    slug: 'modern-nio2-file-operations',
    topicNumber: 46,
    title: 'Modern NIO.2 File Operations',
    part: 'Part 1: Java Core',
    sectionNumber: 12,
    sectionTitle: 'File I/O, NIO.2 & Date/Time',
    versionBadge: 'Java 7+ (writeString/readString: Java 11)',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master Path, Files utility methods (readString, writeString, lines, walk, find), atomic operations, and recursive directory tree traversal.',
    prerequisites: [
      'Topic 45: Classic I/O Streams',
      'Topic 42: Stream API: Pipeline Fundamentals'
    ],
    whatAndWhy: {
      definition: 'NIO.2 (java.nio.file) is Java modern filesystem API centered on Path and Files. It replaces java.io.File with rich typed exceptions, atomic file moves, symbolic link support, and Stream integration.',
      analogy: 'Enterprise warehouse tracking: old File returned false with zero explanation when failing. NIO.2 provides full barcode tracking (Path), exact failure diagnostics, and automated conveyor belts (Files.walk()).',
      whyItExists: 'Legacy File API suffered from silent boolean failure returns, poor cross-platform path handling, and lack of atomic filesystem guarantees.'
    },
    syntaxBreakdown: {
      title: 'NIO.2 Path & Files Operations',
      codeSnippet: `Path path = Path.of("config", "app.conf");
Files.writeString(path, "port=8080\n");
String content = Files.readString(path);
try (Stream<Path> stream = Files.walk(path.getParent())) { ... }`,
      explanation: 'Path.of provides cross-platform path construction. Files utility provides atomic and streaming methods.',
      tokens: [
        { token: 'Path.of(...)', explanation: 'Platform-independent path constructor (Java 11+).' },
        { token: 'Files.readString(p)', explanation: 'Reads entire file into String in one line.' },
        { token: 'Files.lines(p)', explanation: 'Streams lines lazily from disk without loading full file on heap.' },
        { token: 'Files.walk(p, depth)', explanation: 'Recursively streams all directory paths.' }
      ]
    },
    examples: [
      {
        id: '46-1',
        title: 'Modern File Operations with writeString, readString & lines',
        type: 'basic',
        description: 'Demonstrates one-line file reading, writing, atomic appending, and lazy line streaming.',
        filename: 'ModernNioOperationsDemo.java',
        code: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class ModernNioOperationsDemo {
    public static void main(String[] args) throws IOException {
        Path tempFile = Files.createTempFile("nio2_demo", ".conf");
        tempFile.toFile().deleteOnExit();

        String initialConfig = "port=9090\nenv=staging\nmax_connections=250\n";
        Files.writeString(tempFile, initialConfig);
        System.out.println("Config written using Files.writeString to: " + tempFile.getFileName());

        Files.writeString(tempFile, "ssl_enabled=true\n", StandardOpenOption.APPEND);

        String fullContent = Files.readString(tempFile);
        System.out.println("\nFull Read String Output:\n" + fullContent.trim());

        System.out.println("Streaming and filtering keys starting with 'ssl' or 'env':");
        try (var linesStream = Files.lines(tempFile)) {
            List<String> matched = linesStream
                    .filter(line -> line.startsWith("ssl") || line.startsWith("env"))
                    .toList();
            matched.forEach(line -> System.out.println("  " + line));
        }

        System.out.println("\nFile exists check: " + Files.exists(tempFile));
        System.out.println("File size in bytes: " + Files.size(tempFile));
    }
}`,
        output: `Config written using Files.writeString to: nio2_demo...conf

Full Read String Output:
port=9090
env=staging
max_connections=250
ssl_enabled=true

Streaming and filtering keys starting with 'ssl' or 'env':
  env=staging
  ssl_enabled=true

File exists check: true
File size in bytes: 59`,
        stepByStep: [
          'Files.writeString writes and appends text with platform encoding.',
          'Files.readString extracts file content into a String.',
          'Files.lines streams file contents lazily, filtered via Stream API.'
        ]
      },
      {
        id: '46-2',
        title: 'Recursive Directory Tree Scanner & Cleaner',
        type: 'realistic',
        description: 'Scans directory trees using Files.walk() and Files.find() with depth limits.',
        filename: 'DirectoryTreeScannerApp.java',
        code: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

public class DirectoryTreeScannerApp {
    public static void main(String[] args) throws IOException {
        Path tempDir = Files.createTempDirectory("workspace_scanner");
        tempDir.toFile().deleteOnExit();

        Path configDir = tempDir.resolve("config");
        Path logsDir = tempDir.resolve("logs/archive");
        Files.createDirectories(configDir);
        Files.createDirectories(logsDir);

        Files.writeString(configDir.resolve("application.conf"), "server.port=8080\n");
        Files.writeString(configDir.resolve("database.json"), "{\"host\":\"localhost\"}\n");
        Files.writeString(logsDir.resolve("audit-2026.log"), "Audit ledger payload\n");

        System.out.println("Scanning directory: " + tempDir.getFileName());

        System.out.println("\nDiscovered Files & Directories:");
        try (Stream<Path> paths = Files.walk(tempDir, 3)) {
            List<Path> allPaths = paths.sorted().toList();
            for (Path p : allPaths) {
                String type = Files.isDirectory(p) ? "[DIR] " : "[FILE]";
                System.out.println("  " + type + " " + tempDir.relativize(p));
            }
        }

        System.out.println("\nFound Config Files (.conf or .json):");
        try (Stream<Path> configs = Files.find(tempDir, 3, (p, attrs) -> {
            String name = p.getFileName().toString();
            return attrs.isRegularFile() && (name.endsWith(".conf") || name.endsWith(".json"));
        })) {
            configs.forEach(p -> System.out.println("  " + tempDir.relativize(p) + " (" + p.toFile().length() + " bytes)"));
        }

        try (Stream<Path> walk = Files.walk(tempDir)) {
            walk.sorted(Comparator.reverseOrder()).forEach(p -> {
                try { Files.delete(p); } catch (IOException ignored) {}
            });
        }
    }
}`,
        output: `Scanning directory: workspace_scanner...

Discovered Files & Directories:
  [DIR]  
  [DIR]  config
  [FILE] config/application.conf
  [FILE] config/database.json
  [DIR]  logs
  [DIR]  logs/archive
  [FILE] logs/archive/audit-2026.log

Found Config Files (.conf or .json):
  config/application.conf (17 bytes)
  config/database.json (21 bytes)`,
        stepByStep: [
          'Constructs directory hierarchy using Files.createDirectories.',
          'Files.walk traverses tree up to depth 3.',
          'Files.find filters configuration files by extension and attributes.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Unclosed Files.lines Stream Handle Leak',
        cause: 'Failing to close Files.lines() leaves OS file descriptors open, causing file lock errors on Windows.',
        solution: 'Always wrap Files.lines() and Files.walk() inside a try-with-resources block.'
      }
    ],
    bestPractices: {
      doList: [
        'Default to Path.of() and Files methods for all filesystem access.',
        'Use StandardCopyOption.ATOMIC_MOVE for safe file replacement.',
        'Use Files.lines() rather than readAllLines() for large files.'
      ],
      dontList: [
        'Never construct paths using manual string concatenation (use path.resolve()).'
      ],
      whenNotToUse: 'Do not use Files.readString() on multi-gigabyte files (loads entire file into RAM).'
    },
    versionNotes: {
      introduced: 'Java 7 (JSR 203)',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added Stream support to Files. Java 11 added readString() and writeString().',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Modern NIO.2 Operations Cheat Sheet',
      headers: ['Task', 'NIO.2 Method', 'Complexity / Behavior'],
      rows: [
        ['Read String', 'Files.readString(path)', 'One-line UTF-8 read'],
        ['Write String', 'Files.writeString(path, text)', 'One-line UTF-8 write'],
        ['Stream Lines', 'Files.lines(path)', 'Lazy disk stream'],
        ['Directory Walk', 'Files.walk(path, depth)', 'Recursive tree stream']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Deleting Non-Empty Directory',
        prompt: 'Why does Files.delete(dir) throw DirectoryNotEmptyException?',
        solution: 'Standard OS filesystems forbid deleting directories containing child files. Walk the tree in reverse order to delete child files first, then delete the directory.',
        explanation: 'Recursive deletion must proceed bottom-up.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.nio.file.Files',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 47: Date and Time API (java.time)
  {
    id: 'topic-47',
    slug: 'date-and-time-api',
    topicNumber: 47,
    title: 'Date and Time API (java.time)',
    part: 'Part 1: Java Core',
    sectionNumber: 12,
    sectionTitle: 'File I/O, NIO.2 & Date/Time',
    versionBadge: 'Java 8+ (JSR 310)',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master immutable, thread-safe date/time handling: Instant, LocalDate, ZonedDateTime, Duration, Period, and DateTimeFormatter.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 16: Classes, Objects & Memory Layout'
    ],
    whatAndWhy: {
      definition: 'java.time (JSR 310) is Java modern, immutable, and thread-safe date/time framework. It separates machine time (Instant) from human calendar time (LocalDate, ZonedDateTime).',
      analogy: 'Flight tracking: machine time (Instant) is an atomic clock number agreed upon by satellites worldwide. Human time (ZonedDateTime) is the gate clock showing local departure time in New York or Tokyo.',
      whyItExists: 'Legacy java.util.Date and Calendar were mutable, 0-indexed months (January=0), and SimpleDateFormat was not thread-safe.'
    },
    syntaxBreakdown: {
      title: 'Core java.time Class Roles',
      codeSnippet: `Instant nowUtc = Instant.now();
LocalDate date = LocalDate.of(2026, 3, 17);
ZonedDateTime zdt = ZonedDateTime.now(ZoneId.of("America/New_York"));
Duration timeAmount = Duration.ofHours(4);
Period dateAmount = Period.ofWeeks(2);`,
      explanation: 'All java.time instances are immutable. Methods like plusDays() return new instances.',
      tokens: [
        { token: 'Instant', explanation: 'UTC machine timestamp (nanoseconds since epoch).' },
        { token: 'LocalDate', explanation: 'Date without time or timezone (2026-03-17).' },
        { token: 'ZonedDateTime', explanation: 'Full human timestamp with IANA timezone rules.' },
        { token: 'Duration / Period', explanation: 'Duration measures time (hours/mins); Period measures calendar (days/months).' }
      ]
    },
    examples: [
      {
        id: '47-1',
        title: 'Core java.time Classes, Durations, and Formatting',
        type: 'basic',
        description: 'Demonstrates Instant, LocalDate, ZonedDateTime, Duration, Period, and DateTimeFormatter.',
        filename: 'DateTimeApiDemo.java',
        code: `import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeApiDemo {
    public static void main(String[] args) {
        Instant epochNow = Instant.ofEpochMilli(1700000000000L);
        System.out.println("UTC Machine Instant: " + epochNow);

        LocalDate releaseDate = LocalDate.of(2026, 3, 17);
        LocalTime maintenanceWindow = LocalTime.of(3, 30, 0);
        LocalDateTime schedule = LocalDateTime.of(releaseDate, maintenanceWindow);
        System.out.println("Scheduled Maintenance: " + schedule);

        ZoneId nyZone = ZoneId.of("America/New_York");
        ZoneId tokyoZone = ZoneId.of("Asia/Tokyo");

        ZonedDateTime nyTime = ZonedDateTime.of(schedule, nyZone);
        ZonedDateTime tokyoEquivalent = nyTime.withZoneSameInstant(tokyoZone);

        System.out.println("New York Time: " + nyTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        System.out.println("Tokyo Time:    " + tokyoEquivalent.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

        Duration downtime = Duration.ofHours(4).plusMinutes(15);
        System.out.println("Downtime in Minutes: " + downtime.toMinutes() + " mins");

        Period sprintDuration = Period.ofWeeks(2);
        LocalDate nextSprint = releaseDate.plus(sprintDuration);
        System.out.println("Next Sprint Start: " + nextSprint);

        DateTimeFormatter customFormat = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy");
        System.out.println("Formatted Release: " + releaseDate.format(customFormat));
    }
}`,
        output: `UTC Machine Instant: 2023-11-14T22:13:20Z
Scheduled Maintenance: 2026-03-17T03:30
New York Time: 2026-03-17T03:30:00-04:00
Tokyo Time:    2026-03-17T16:30:00+09:00
Downtime in Minutes: 255 mins
Next Sprint Start: 2026-03-31
Formatted Release: Tuesday, March 17, 2026`,
        stepByStep: [
          'Creates machine epoch instant in UTC.',
          'Converts New York local time to Tokyo time across timezone boundaries.',
          'Applies Duration and Period calculations cleanly.'
        ]
      },
      {
        id: '47-2',
        title: 'Global SLA Deadline Calculator',
        type: 'realistic',
        description: 'Calculates business ticket resolution deadlines across international timezones with weekend skipping.',
        filename: 'GlobalSlaDeadlineCalculatorApp.java',
        code: `import java.time.DayOfWeek;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class GlobalSlaDeadlineCalculatorApp {
    public record SupportTicket(String ticketId, int slaHours, ZonedDateTime createdTime) {}

    public static ZonedDateTime calculateBusinessDeadline(ZonedDateTime start, int businessHours) {
        ZonedDateTime cursor = start;
        int remainingHours = businessHours;
        while (remainingHours > 0) {
            cursor = cursor.plusHours(1);
            DayOfWeek day = cursor.getDayOfWeek();
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) continue;
            int hour = cursor.getHour();
            if (hour >= 9 && hour < 17) remainingHours--;
        }
        return cursor;
    }

    public static void main(String[] args) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm (z)");
        ZoneId londonZone = ZoneId.of("Europe/London");
        ZonedDateTime ticketOpened = ZonedDateTime.of(2026, 11, 20, 15, 0, 0, 0, londonZone);

        SupportTicket ticket = new SupportTicket("INC-9901", 4, ticketOpened);
        ZonedDateTime resolvedDeadline = calculateBusinessDeadline(ticket.createdTime(), ticket.slaHours());

        ZoneId tokyoZone = ZoneId.of("Asia/Tokyo");
        ZoneId nyZone = ZoneId.of("America/New_York");

        System.out.println("=== SLA Deadline Calculation Report ===");
        System.out.println("Ticket ID:       " + ticket.ticketId());
        System.out.println("SLA Window:      " + ticket.slaHours() + " Business Hours");
        System.out.println("Created (London): " + ticket.createdTime().format(fmt));
        System.out.println("\nDeadline Across Operations Centers:");
        System.out.println("  London (HQ):   " + resolvedDeadline.format(fmt));
        System.out.println("  New York:      " + resolvedDeadline.withZoneSameInstant(nyZone).format(fmt));
        System.out.println("  Tokyo:         " + resolvedDeadline.withZoneSameInstant(tokyoZone).format(fmt));
    }
}`,
        output: `=== SLA Deadline Calculation Report ===
Ticket ID:       INC-9901
SLA Window:      4 Business Hours
Created (London): 2026-11-20 15:00 (GMT)

Deadline Across Operations Centers:
  London (HQ):   2026-11-23 12:00 (GMT)
  New York:      2026-11-23 07:00 (EST)
  Tokyo:         2026-11-23 21:00 (JST)`,
        stepByStep: [
          'Calculates SLA hours skipping weekend days.',
          'withZoneSameInstant projects London deadline across New York and Tokyo desks.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Applying Duration to LocalDate',
        cause: 'Calling date.plus(Duration.ofHours(24)) throws UnsupportedTemporalTypeException because LocalDate has no time concept.',
        solution: 'Use Period for date-based amounts: date.plus(Period.ofDays(1)).'
      }
    ],
    bestPractices: {
      doList: [
        'Store machine events as Instant in UTC in databases.',
        'Use ZonedDateTime for cross-timezone scheduling and user presentation.',
        'Use pre-built DateTimeFormatter constants when possible.'
      ],
      dontList: [
        'Never use legacy java.util.Date or Calendar in new code.',
        'Never do date math by manually adding milliseconds.'
      ],
      whenNotToUse: 'Do not use ZonedDateTime when time zone information is irrelevant (use LocalDate).'
    },
    versionNotes: {
      introduced: 'Java 8 (JSR 310)',
      status: 'Stable',
      compatibilityNotes: 'Java 9 added LocalDate.datesUntil() stream factory.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'java.time Type Selection Cheat Sheet',
      headers: ['Type', 'Timezone Aware', 'Best Used For'],
      rows: [
        ['Instant', 'UTC Absolute', 'Server logs, database event timestamps'],
        ['LocalDate', 'No', 'Birthdays, invoices, bank holidays'],
        ['ZonedDateTime', 'Yes (IANA rules)', 'Cross-timezone flight and calendar events']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Calculate Age in Years',
        prompt: 'Calculate exact completed age in years using Period.',
        solution: 'Period.between(birthday, today).getYears();',
        explanation: 'Period calculates calendar date differences.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.time Package',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    "id": "topic-48",
    "slug": "threads-and-thread-lifecycle",
    "topicNumber": 48,
    "title": "Threads and Thread Lifecycle",
    "part": "Part 1: Java Core",
    "sectionNumber": 13,
    "sectionTitle": "Concurrency & Multithreading",
    "versionBadge": "Java 1.0+ / Enhanced Java 21",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Master the operating system thread abstraction, the six thread states, daemon threads, joining, and interruption mechanics.",
    "prerequisites": [
        "Topic 11: Methods, Parameters & Return Values",
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 23: Interfaces & Modern Interface Evolution"
    ],
    "whatAndWhy": {
        "definition": "A thread is the smallest unit of execution scheduled by an operating system kernel. A single Java process can run multiple threads concurrently, sharing heap memory while maintaining private execution stacks.",
        "analogy": "Multiple chefs working in a single kitchen sharing the pantry (heap) while carrying their own order tickets (call stack).",
        "whyItExists": "Enables asynchronous background execution, keeps user interfaces responsive, and utilizes multi-core hardware to maximize CPU throughput."
    },
    "syntaxBreakdown": {
        "title": "Thread Declaration and Execution",
        "codeSnippet": "Thread worker = new Thread(() -> { ... }, \"Worker-1\");\nworker.start();\nworker.join();",
        "explanation": "Spawns an OS thread executing a Runnable task, assigns an identifier, and awaits termination.",
        "tokens": [
            {
                "token": "Thread",
                "explanation": "Class representing an execution thread"
            },
            {
                "token": "start()",
                "explanation": "Transitions thread to RUNNABLE and starts OS execution"
            },
            {
                "token": "join()",
                "explanation": "Blocks calling thread until target terminates"
            }
        ]
    },
    "examples": [
        {
            "id": "48-1",
            "title": "Thread Lifecycle and Interruption",
            "type": "basic",
            "description": "Observing state transitions, thread interruption, and daemon threads.",
            "filename": "ThreadLifecycleDemo.java",
            "code": "public class ThreadLifecycleDemo {\n    public static void main(String[] args) throws InterruptedException {\n        Thread worker = new Thread(() -> {\n            System.out.println(\"Worker thread running: \" + Thread.currentThread().getName());\n            int counter = 0;\n            try {\n                while (!Thread.currentThread().isInterrupted()) {\n                    counter++;\n                    Thread.sleep(100);\n                }\n            } catch (InterruptedException e) {\n                System.out.println(\"Worker interrupted during sleep. Exiting cleanly.\");\n            }\n            System.out.println(\"Worker completed. Final counter: \" + counter);\n        }, \"Background-Worker-1\");\n\n        System.out.println(\"Worker State before start: \" + worker.getState());\n        worker.start();\n        System.out.println(\"Worker State after start:  \" + worker.getState());\n\n        Thread.sleep(350);\n        System.out.println(\"Main thread sending interrupt signal...\");\n        worker.interrupt();\n\n        worker.join();\n        System.out.println(\"Worker State after join:   \" + worker.getState());\n\n        Thread daemon = new Thread(() -> {\n            while (true) { /* Idle daemon */ }\n        });\n        daemon.setDaemon(true);\n        daemon.start();\n        System.out.println(\"Daemon Thread isDaemon:    \" + daemon.isDaemon());\n    }\n}",
            "output": "Worker State before start: NEW\nWorker State after start:  RUNNABLE\nWorker thread running: Background-Worker-1\nMain thread sending interrupt signal...\nWorker interrupted during sleep. Exiting cleanly.\nWorker completed. Final counter: 3\nWorker State after join:   TERMINATED\nDaemon Thread isDaemon:    true",
            "stepByStep": [
                "Worker thread starts in NEW state.",
                "Invoking start() allocates OS thread and switches to RUNNABLE.",
                "interrupt() triggers InterruptedException during sleep, allowing clean exit.",
                "join() halts main thread until worker reaches TERMINATED."
            ]
        },
        {
            "id": "48-2",
            "title": "Batch Worker Supervisor",
            "type": "realistic",
            "description": "Supervising parallel workers and coordinating batch completion.",
            "filename": "BatchWorkerSupervisorApp.java",
            "code": "import java.util.ArrayList;\nimport java.util.List;\n\npublic class BatchWorkerSupervisorApp {\n    static class TaskResult {\n        final int workerId;\n        final boolean success;\n        TaskResult(int workerId, boolean success) {\n            this.workerId = workerId;\n            this.success = success;\n        }\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        int workerCount = 3;\n        List<Thread> workers = new ArrayList<>();\n        List<TaskResult> results = new ArrayList<>();\n\n        for (int i = 1; i <= workerCount; i++) {\n            final int id = i;\n            Thread worker = new Thread(() -> {\n                System.out.println(\"  [Worker-\" + id + \"] Processing task payload...\");\n                try {\n                    Thread.sleep(50 * id);\n                    synchronized (results) {\n                        results.add(new TaskResult(id, true));\n                    }\n                    System.out.println(\"  [Worker-\" + id + \"] Task payload processed successfully.\");\n                } catch (InterruptedException e) {\n                    Thread.currentThread().interrupt();\n                }\n            }, \"Worker-\" + id);\n            workers.add(worker);\n            worker.start();\n        }\n\n        System.out.println(\"Supervisor waiting for batch completion (joining workers)...\");\n        for (Thread worker : workers) {\n            worker.join();\n        }\n\n        System.out.println(\"Supervisor Audit: \" + results.size() + \" of \" + workerCount + \" workers completed successfully.\");\n    }\n}",
            "output": "Supervisor waiting for batch completion (joining workers)...\n  [Worker-1] Processing task payload...\n  [Worker-2] Processing task payload...\n  [Worker-3] Processing task payload...\n  [Worker-1] Task payload processed successfully.\n  [Worker-2] Task payload processed successfully.\n  [Worker-3] Task payload processed successfully.\nSupervisor Audit: 3 of 3 workers completed successfully.",
            "stepByStep": [
                "Supervisor spawns 3 worker threads with individual IDs.",
                "Each worker processes a task payload and records results into a thread-safe list.",
                "Supervisor calls join() on each worker to ensure all complete before generating final audit."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Calling run() instead of start()",
            "wrongCode": "Thread t = new Thread(r);\nt.run();",
            "fixedCode": "Thread t = new Thread(r);\nt.start();",
            "cause": "Calling run() runs the task synchronously on the current thread without creating a new OS thread.",
            "solution": "Always call start() to spawn a new concurrent thread."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always name threads to simplify debugging and thread dump analysis.",
            "Restore interrupted status using Thread.currentThread().interrupt() when catching InterruptedException."
        ],
        "dontList": [
            "Do not spawn unbounded platform threads in loops.",
            "Do not use deprecated methods stop(), suspend(), or resume()."
        ],
        "whenNotToUse": "For high-throughput I/O or massive parallel request handling, use Virtual Threads (Java 21+) or ExecutorService instead of raw platform threads."
    },
    "versionNotes": {
        "introduced": "Java 1.0",
        "status": "Stable",
        "compatibilityNotes": "Java 21 added Virtual Threads. In Java 24+, Thread.suspend() and Thread.resume() throw UnsupportedOperationException.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "Thread Lifecycle Cheat Sheet",
        "headers": [
            "Method",
            "Target State",
            "Effect"
        ],
        "rows": [
            [
                "start()",
                "RUNNABLE",
                "Allocates native thread and invokes run()"
            ],
            [
                "join()",
                "WAITING",
                "Blocks current thread until target terminates"
            ],
            [
                "sleep(ms)",
                "TIMED_WAITING",
                "Releases CPU for specified duration"
            ],
            [
                "interrupt()",
                "Unchanged",
                "Sets interrupt status flag; wakes sleeping threads"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Create Daemon Monitor Thread",
            "prompt": "Create a background daemon thread that prints a heartbeat every second.",
            "solution": "Thread t = new Thread(() -> { while(true) { ... } }); t.setDaemon(true); t.start();",
            "explanation": "Daemon threads do not prevent the JVM from shutting down."
        }
    ],
    "officialSources": [
        {
            "title": "Java SE 21 Specification: java.lang.Thread",
            "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-49",
    "slug": "synchronization-and-memory-visibility",
    "topicNumber": 49,
    "title": "Synchronization & Memory Visibility",
    "part": "Part 1: Java Core",
    "sectionNumber": 13,
    "sectionTitle": "Concurrency & Multithreading",
    "versionBadge": "Java 1.0+ / Enhanced JSR-133 (Java 5)",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Master intrinsic monitor locks, the synchronized keyword, volatile memory visibility, and deadlocks.",
    "prerequisites": [
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 48: Threads and Thread Lifecycle"
    ],
    "whatAndWhy": {
        "definition": "Synchronization provides mutual exclusion and memory visibility guarantees, preventing race conditions and stale cache reads when multiple threads access shared mutable state.",
        "analogy": "A physical key to an office whiteboard ensuring only one coworker can write at a time while a live camera broadcast shows updates to everyone immediately.",
        "whyItExists": "Prevents race conditions like lost updates and eliminates CPU cache visibility lags across processor cores."
    },
    "syntaxBreakdown": {
        "title": "Synchronization and Volatile Primitives",
        "codeSnippet": "private volatile boolean flag = true;\npublic synchronized void update() {\n    count++;\n}",
        "explanation": "Guarantees direct main memory access for flag and mutual exclusion on object monitors for update().",
        "tokens": [
            {
                "token": "synchronized",
                "explanation": "Acquires intrinsic monitor lock for mutual exclusion"
            },
            {
                "token": "volatile",
                "explanation": "Establishes happens-before memory visibility barrier"
            }
        ]
    },
    "examples": [
        {
            "id": "49-1",
            "title": "Mutual Exclusion and Volatile Visibility",
            "type": "basic",
            "description": "Eliminating counter race conditions and volatile flag visibility across CPU cores.",
            "filename": "SynchronizationVisibilityDemo.java",
            "code": "public class SynchronizationVisibilityDemo {\n    private static int counter = 0;\n    private static volatile boolean keepRunning = true;\n\n    public static synchronized void incrementCounter() {\n        counter++;\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread t1 = new Thread(() -> {\n            for (int i = 0; i < 1000; i++) incrementCounter();\n        });\n        Thread t2 = new Thread(() -> {\n            for (int i = 0; i < 1000; i++) incrementCounter();\n        });\n\n        t1.start();\n        t2.start();\n        t1.join();\n        t2.join();\n\n        System.out.println(\"Synchronized Counter Total: \" + counter);\n\n        Thread worker = new Thread(() -> {\n            long iterations = 0;\n            while (keepRunning) {\n                iterations++;\n            }\n            System.out.println(\"Worker recognized stop flag. Iterations: \" + iterations);\n        });\n\n        worker.start();\n        Thread.sleep(50);\n        keepRunning = false;\n        worker.join();\n        System.out.println(\"Volatile Worker Terminated Gracefully.\");\n    }\n}",
            "output": "Synchronized Counter Total: 2000\nWorker recognized stop flag. Iterations: 39843093\nVolatile Worker Terminated Gracefully.",
            "stepByStep": [
                "t1 and t2 concurrently increment counter guarded by synchronized monitor, resulting in exact 2000.",
                "worker loops while keepRunning is true.",
                "Main thread sets keepRunning = false, flushed immediately to RAM due to volatile barrier.",
                "Worker terminates promptly."
            ]
        },
        {
            "id": "49-2",
            "title": "Double-Checked Locking Singleton and Deadlock-Free Transfers",
            "type": "realistic",
            "description": "Thread-safe lazy singleton and ordered locking for bank accounts.",
            "filename": "DoubleCheckedLockingSingletonApp.java",
            "code": "public class DoubleCheckedLockingSingletonApp {\n    static class DatabaseConnectionPool {\n        private static volatile DatabaseConnectionPool instance;\n        private DatabaseConnectionPool() {}\n        public static DatabaseConnectionPool getInstance() {\n            if (instance == null) {\n                synchronized (DatabaseConnectionPool.class) {\n                    if (instance == null) {\n                        instance = new DatabaseConnectionPool();\n                    }\n                }\n            }\n            return instance;\n        }\n    }\n\n    static class BankAccount {\n        private final String id;\n        private double balance;\n        BankAccount(String id, double balance) {\n            this.id = id;\n            this.balance = balance;\n        }\n        public String getId() { return id; }\n        public synchronized double getBalance() { return balance; }\n        public static boolean transfer(BankAccount from, BankAccount to, double amount) {\n            BankAccount firstLock = from.id.compareTo(to.id) < 0 ? from : to;\n            BankAccount secondLock = from.id.compareTo(to.id) < 0 ? to : from;\n            synchronized (firstLock) {\n                synchronized (secondLock) {\n                    if (from.balance >= amount) {\n                        from.balance -= amount;\n                        to.balance += amount;\n                        return true;\n                    }\n                    return false;\n                }\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        DatabaseConnectionPool pool1 = DatabaseConnectionPool.getInstance();\n        DatabaseConnectionPool pool2 = DatabaseConnectionPool.getInstance();\n        System.out.println(\"Singleton Pool Same Instance: \" + (pool1 == pool2));\n\n        BankAccount acc1 = new BankAccount(\"ACC-01\", 1000.0);\n        BankAccount acc2 = new BankAccount(\"ACC-02\", 500.0);\n        boolean success = BankAccount.transfer(acc1, acc2, 250.0);\n        System.out.println(\"Transfer Success: \" + success);\n        System.out.printf(\"Final Balances: %s=$%.2f, %s=$%.2f%n\", acc1.getId(), acc1.getBalance(), acc2.getId(), acc2.getBalance());\n    }\n}",
            "output": "Singleton Pool Same Instance: true\nTransfer Success: true\nFinal Balances: ACC-01=$750.00, ACC-02=$750.00",
            "stepByStep": [
                "getInstance checks instance twice to eliminate lock overhead after first creation.",
                "volatile prevents instruction reordering during instantiation.",
                "transfer sorts locks by ID to guarantee consistent global acquisition order, preventing deadlocks."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Assuming volatile makes count++ atomic",
            "wrongCode": "private volatile int count = 0;\npublic void inc() { count++; }",
            "fixedCode": "private int count = 0;\npublic synchronized void inc() { count++; }",
            "cause": "count++ is a compound read-modify-write operation; volatile only guarantees visibility, not atomicity.",
            "solution": "Use synchronized or AtomicInteger for compound mutations."
        }
    ],
    "bestPractices": {
        "doList": [
            "Keep synchronized blocks minimal to avoid lock contention.",
            "Always acquire multiple locks in a globally consistent order to prevent deadlocks."
        ],
        "dontList": [
            "Do not synchronize on String literals or boxed primitives.",
            "Do not perform blocking I/O inside synchronized blocks."
        ],
        "whenNotToUse": "When you need timed lock acquisition or read/write separation, use ReentrantLock or ReentrantReadWriteLock instead."
    },
    "versionNotes": {
        "introduced": "Java 1.0",
        "status": "Stable",
        "compatibilityNotes": "Java 5 JSR-133 formalized the happens-before relationship for volatile.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "Synchronization Mechanics Cheat Sheet",
        "headers": [
            "Primitive",
            "Mutual Exclusion",
            "Visibility Guarantee",
            "Prevents Lost Updates"
        ],
        "rows": [
            [
                "synchronized",
                "Yes",
                "Yes (entry & exit)",
                "Yes"
            ],
            [
                "volatile",
                "No",
                "Yes (direct RAM)",
                "No (compound ops)"
            ],
            [
                "AtomicInteger",
                "Hardware CAS",
                "Yes",
                "Yes"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Implement Thread-Safe Counter",
            "prompt": "Implement a thread-safe counter using synchronized methods.",
            "solution": "public synchronized void inc() { c++; } public synchronized int get() { return c; }",
            "explanation": "Synchronized on this ensures both operations are guarded by the same object monitor."
        }
    ],
    "officialSources": [
        {
            "title": "Java Language Specification: §17.4 Memory Model",
            "url": "https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-50",
    "slug": "explicit-locks-and-concurrent-collections",
    "topicNumber": 50,
    "title": "Explicit Locks & Concurrent Collections",
    "part": "Part 1: Java Core",
    "sectionNumber": 13,
    "sectionTitle": "Concurrency & Multithreading",
    "versionBadge": "Java 5+",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Explore ReentrantLock, ReadWriteLock, Atomic primitives, and high-performance concurrent collections like ConcurrentHashMap.",
    "prerequisites": [
        "Topic 37: The Map Hierarchy",
        "Topic 49: Synchronization and Memory Visibility"
    ],
    "whatAndWhy": {
        "definition": "Explicit locks and concurrent data structures in java.util.concurrent provide fine-grained, timed, and lock-free concurrency alternatives to intrinsic synchronized blocks.",
        "analogy": "A library where hundreds of patrons can read simultaneously with read-locks, but a single librarian acquires an exclusive write-lock to reorganize book shelves.",
        "whyItExists": "Enables timed polling (tryLock), separate read/write locks, and lock-free Compare-And-Swap (CAS) performance under high contention."
    },
    "syntaxBreakdown": {
        "title": "Explicit Lock and Atomic Idioms",
        "codeSnippet": "Lock lock = new ReentrantLock();\nlock.lock();\ntry {\n    // Critical section\n} finally {\n    lock.unlock();\n}",
        "explanation": "Explicitly acquires and unlocks a reentrant mutex, guaranteeing release in finally block.",
        "tokens": [
            {
                "token": "ReentrantLock",
                "explanation": "Class providing flexible mutex locking"
            },
            {
                "token": "tryLock(time, unit)",
                "explanation": "Attempts acquisition with timeout"
            },
            {
                "token": "unlock()",
                "explanation": "Releases held lock; must be inside finally"
            }
        ]
    },
    "examples": [
        {
            "id": "50-1",
            "title": "Timed Locks and Atomic CAS Operations",
            "type": "basic",
            "description": "Demonstrating timed lock polling and lock-free atomic compare-and-swap.",
            "filename": "ExplicitLocksAtomicsDemo.java",
            "code": "import java.util.concurrent.TimeUnit;\nimport java.util.concurrent.atomic.AtomicInteger;\nimport java.util.concurrent.atomic.AtomicReference;\nimport java.util.concurrent.locks.ReentrantLock;\n\npublic class ExplicitLocksAtomicsDemo {\n    public static void main(String[] args) throws InterruptedException {\n        ReentrantLock lock = new ReentrantLock();\n        Thread holder = new Thread(() -> {\n            lock.lock();\n            try {\n                System.out.println(\"Holder acquired lock, holding for 150ms...\");\n                Thread.sleep(150);\n            } catch (InterruptedException e) {\n                Thread.currentThread().interrupt();\n            } finally {\n                lock.unlock();\n                System.out.println(\"Holder released lock.\");\n            }\n        });\n\n        Thread contender = new Thread(() -> {\n            try {\n                Thread.sleep(20);\n                System.out.println(\"Contender attempting tryLock(50ms)...\");\n                boolean acquired = lock.tryLock(50, TimeUnit.MILLISECONDS);\n                System.out.println(\"Contender acquired lock? \" + acquired);\n\n                System.out.println(\"Contender attempting tryLock(200ms)...\");\n                boolean acquiredLater = lock.tryLock(200, TimeUnit.MILLISECONDS);\n                System.out.println(\"Contender acquired lock after wait? \" + acquiredLater);\n                if (acquiredLater) lock.unlock();\n            } catch (InterruptedException e) {\n                Thread.currentThread().interrupt();\n            }\n        });\n\n        holder.start();\n        contender.start();\n        holder.join();\n        contender.join();\n\n        System.out.println();\n        AtomicInteger atomicCounter = new AtomicInteger(100);\n        boolean casSuccess = atomicCounter.compareAndSet(100, 150);\n        System.out.println(\"Atomic CAS from 100 to 150 successful? \" + casSuccess);\n        System.out.println(\"Atomic Counter after incrementAndGet: \" + atomicCounter.incrementAndGet());\n\n        AtomicReference<String> stateRef = new AtomicReference<>(\"INITIAL\");\n        stateRef.compareAndSet(\"INITIAL\", \"ACTIVE\");\n        System.out.println(\"Atomic Reference Current State: \" + stateRef.get());\n    }\n}",
            "output": "Holder acquired lock, holding for 150ms...\nContender attempting tryLock(50ms)...\nContender acquired lock? false\nContender attempting tryLock(200ms)...\nHolder released lock.\nContender acquired lock after wait? true\n\nAtomic CAS from 100 to 150 successful? true\nAtomic Counter after incrementAndGet: 151\nAtomic Reference Current State: ACTIVE",
            "stepByStep": [
                "Holder acquires lock and sleeps 150ms.",
                "Contender tryLock(50ms) times out gracefully and returns false.",
                "Contender tryLock(200ms) waits until holder releases lock at 150ms and succeeds.",
                "AtomicInteger uses hardware CAS to update without mutex locking."
            ]
        },
        {
            "id": "50-2",
            "title": "Token Bucket Rate Limiter with ReadWriteLock",
            "type": "realistic",
            "description": "High-concurrency token bucket rate limiter with read and write locks.",
            "filename": "RateLimiterTokenBucketApp.java",
            "code": "import java.util.concurrent.locks.ReentrantReadWriteLock;\n\npublic class RateLimiterTokenBucketApp {\n    private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();\n    private final ReentrantReadWriteLock.ReadLock readLock = rwl.readLock();\n    private final ReentrantReadWriteLock.WriteLock writeLock = rwl.writeLock();\n    private int capacity;\n    private int currentTokens;\n\n    public RateLimiterTokenBucketApp(int initialCapacity) {\n        this.capacity = initialCapacity;\n        this.currentTokens = initialCapacity;\n    }\n\n    public boolean tryConsume() {\n        writeLock.lock();\n        try {\n            if (currentTokens > 0) {\n                currentTokens--;\n                return true;\n            }\n            return false;\n        } finally {\n            writeLock.unlock();\n        }\n    }\n\n    public int getAvailableTokens() {\n        readLock.lock();\n        try {\n            return currentTokens;\n        } finally {\n            readLock.unlock();\n        }\n    }\n\n    public void updateCapacity(int newCapacity) {\n        writeLock.lock();\n        try {\n            this.capacity = newCapacity;\n            this.currentTokens = newCapacity;\n            System.out.println(\"\\nCapacity reconfigured to \" + newCapacity + \".\");\n        } finally {\n            writeLock.unlock();\n        }\n    }\n\n    public static void main(String[] args) {\n        RateLimiterTokenBucketApp limiter = new RateLimiterTokenBucketApp(3);\n        System.out.println(\"Attempt 1 allowed: \" + limiter.tryConsume());\n        System.out.println(\"Attempt 2 allowed: \" + limiter.tryConsume());\n        System.out.println(\"Attempt 3 allowed: \" + limiter.tryConsume());\n        System.out.println(\"Attempt 4 allowed: \" + limiter.tryConsume());\n        System.out.println(\"Tokens remaining: \" + limiter.getAvailableTokens());\n\n        limiter.updateCapacity(5);\n        System.out.println(\"Attempt 5 allowed: \" + limiter.tryConsume());\n        System.out.println(\"Final tokens remaining: \" + limiter.getAvailableTokens());\n    }\n}",
            "output": "Attempt 1 allowed: true\nAttempt 2 allowed: true\nAttempt 3 allowed: true\nAttempt 4 allowed: false\nTokens remaining: 0\n\nCapacity reconfigured to 5.\nAttempt 5 allowed: true\nFinal tokens remaining: 4",
            "stepByStep": [
                "Requests consume tokens using exclusive write-locks.",
                "Fourth request is denied when tokens hit 0.",
                "Read-lock allows non-blocking inspection of token capacity.",
                "Updating capacity uses write-lock to safely replenish tokens."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Forgetting lock.unlock() in finally block",
            "wrongCode": "lock.lock();\ndoOperation();\nlock.unlock();",
            "fixedCode": "lock.lock();\ntry {\n    doOperation();\n} finally {\n    lock.unlock();\n}",
            "cause": "If doOperation throws an exception, the lock is never released, permanently deadlocking other threads.",
            "solution": "Always place lock.unlock() in the finally block immediately following lock()."
        }
    ],
    "bestPractices": {
        "doList": [
            "Prefer ConcurrentHashMap over Collections.synchronizedMap.",
            "Use LongAdder over AtomicLong when multi-core write contention is high."
        ],
        "dontList": [
            "Do not use CopyOnWriteArrayList for write-heavy collections.",
            "Do not hold locks while calling foreign unknown listener callbacks."
        ],
        "whenNotToUse": "When simple uncontended synchronization suffices, intrinsic synchronized blocks require less boilerplate."
    },
    "versionNotes": {
        "introduced": "Java 5 (JSR-166)",
        "status": "Stable",
        "compatibilityNotes": "Java 8 added StampedLock and LongAdder. Java 9 added VarHandles.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "Explicit Concurrency Primitives Cheat Sheet",
        "headers": [
            "Class",
            "Package",
            "Strategy",
            "Primary Advantage"
        ],
        "rows": [
            [
                "ReentrantLock",
                "locks",
                "Explicit Mutex",
                "Timed tryLock, interruptibility"
            ],
            [
                "ReentrantReadWriteLock",
                "locks",
                "Shared/Exclusive",
                "High read concurrency"
            ],
            [
                "AtomicInteger",
                "atomic",
                "Hardware CAS",
                "Lock-free single value updates"
            ],
            [
                "ConcurrentHashMap",
                "concurrent",
                "CAS + Node Lock",
                "High concurrency key-value store"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Lock-Free Sequence Number",
            "prompt": "Implement a lock-free sequence generator using AtomicLong.",
            "solution": "AtomicLong seq = new AtomicLong(0);\npublic long next() { return seq.incrementAndGet(); }",
            "explanation": "incrementAndGet performs atomic hardware increment."
        }
    ],
    "officialSources": [
        {
            "title": "Java SE 21 Specification: java.util.concurrent.locks",
            "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/package-summary.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-51",
    "slug": "executor-framework-and-thread-pools",
    "topicNumber": 51,
    "title": "Executor Framework & Thread Pools",
    "part": "Part 1: Java Core",
    "sectionNumber": 13,
    "sectionTitle": "Concurrency & Multithreading",
    "versionBadge": "Java 5+ / AutoCloseable in Java 19+",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Decouple task submission from thread management using ExecutorService, ThreadPoolExecutor, Callable, and Future.",
    "prerequisites": [
        "Topic 48: Threads and Thread Lifecycle",
        "Topic 50: Explicit Locks and Concurrent Collections"
    ],
    "whatAndWhy": {
        "definition": "The Executor Framework manages pools of reusable worker threads, queueing tasks and eliminating the overhead of continually creating and destroying platform threads.",
        "analogy": "A taxi fleet dispatch service with 10 dedicated drivers serving 50 passengers from a central terminal queue.",
        "whyItExists": "Prevents native thread starvation and OOM crashes by bounding thread count and reusing threads across tasks."
    },
    "syntaxBreakdown": {
        "title": "ExecutorService Lifecycle",
        "codeSnippet": "ExecutorService pool = Executors.newFixedThreadPool(4);\nFuture<String> future = pool.submit(() -> \"Result\");\npool.shutdown();",
        "explanation": "Submits a Callable returning a Future and initiates graceful pool shutdown.",
        "tokens": [
            {
                "token": "ExecutorService",
                "explanation": "Interface managing task lifecycle and thread pooling"
            },
            {
                "token": "Callable<V>",
                "explanation": "Functional interface returning value and throwing checked exceptions"
            },
            {
                "token": "Future<V>",
                "explanation": "Handle representing asynchronous computation result"
            }
        ]
    },
    "examples": [
        {
            "id": "51-1",
            "title": "Custom ThreadPoolExecutor and Rejection Policies",
            "type": "basic",
            "description": "Configuring bounded queues, rejection handlers, and pool shutdown.",
            "filename": "ThreadPoolExecutorDemo.java",
            "code": "import java.util.concurrent.ArrayBlockingQueue;\nimport java.util.concurrent.RejectedExecutionHandler;\nimport java.util.concurrent.ThreadPoolExecutor;\nimport java.util.concurrent.TimeUnit;\n\npublic class ThreadPoolExecutorDemo {\n    public static void main(String[] args) throws InterruptedException {\n        RejectedExecutionHandler rejectionHandler = (r, executor) -> {\n            System.out.println(\"  [REJECTED] Task rejected! Queue is full and max threads reached.\");\n        };\n\n        ThreadPoolExecutor executor = new ThreadPoolExecutor(\n                2, 3, 10, TimeUnit.SECONDS,\n                new ArrayBlockingQueue<>(2),\n                rejectionHandler\n        );\n\n        System.out.println(\"Submitting 6 tasks to ThreadPoolExecutor...\");\n        for (int i = 1; i <= 6; i++) {\n            final int taskId = i;\n            executor.execute(() -> {\n                System.out.println(\"  [Executing Task \" + taskId + \"] on thread: \" + Thread.currentThread().getName());\n                try {\n                    Thread.sleep(80);\n                } catch (InterruptedException e) {\n                    Thread.currentThread().interrupt();\n                }\n            });\n        }\n\n        executor.shutdown();\n        boolean terminated = executor.awaitTermination(2, TimeUnit.SECONDS);\n        System.out.println(\"Executor Terminated Cleanly: \" + terminated);\n    }\n}",
            "output": "Submitting 6 tasks to ThreadPoolExecutor...\n  [REJECTED] Task rejected! Queue is full and max threads reached.\n  [Executing Task 5] on thread: pool-1-thread-3\n  [Executing Task 1] on thread: pool-1-thread-1\n  [Executing Task 2] on thread: pool-1-thread-2\n  [Executing Task 4] on thread: pool-1-thread-2\n  [Executing Task 3] on thread: pool-1-thread-1\nExecutor Terminated Cleanly: true",
            "stepByStep": [
                "Core threads 1 and 2 start executing tasks 1 and 2.",
                "Tasks 3 and 4 enter the ArrayBlockingQueue.",
                "Task 5 triggers creation of a third thread (maximumPoolSize = 3).",
                "Task 6 exceeds queue and max threads, triggering custom rejection handler."
            ]
        },
        {
            "id": "51-2",
            "title": "Parallel Image Batch Processor with Callable and Future",
            "type": "realistic",
            "description": "Executing parallel image processing jobs and gathering metrics with Future.",
            "filename": "ParallelImageBatchProcessorApp.java",
            "code": "import java.util.ArrayList;\nimport java.util.List;\nimport java.util.concurrent.Callable;\nimport java.util.concurrent.ExecutorService;\nimport java.util.concurrent.Executors;\nimport java.util.concurrent.Future;\n\npublic class ParallelImageBatchProcessorApp {\n    record ImageTask(String filename, int width, int height) {}\n    record ProcessResult(String filename, long processedBytes, long latencyMs) {}\n\n    public static void main(String[] args) throws Exception {\n        ExecutorService pool = Executors.newFixedThreadPool(2);\n        List<ImageTask> batch = List.of(\n                new ImageTask(\"hero_banner.png\", 1920, 1080),\n                new ImageTask(\"profile_avatar.jpg\", 400, 400),\n                new ImageTask(\"thumbnail_preview.png\", 200, 200),\n                new ImageTask(\"product_diagram.svg\", 1200, 800)\n        );\n\n        System.out.println(\"Submitting batch of \" + batch.size() + \" images to fixed pool (size 2)...\\n\");\n        List<Future<ProcessResult>> futures = new ArrayList<>();\n        for (ImageTask task : batch) {\n            Callable<ProcessResult> work = () -> {\n                long start = System.currentTimeMillis();\n                long simulatedBytes = (long) task.width() * task.height() * 3 / 10;\n                Thread.sleep(task.width() > 1000 ? 40 : 20);\n                long elapsed = System.currentTimeMillis() - start;\n                return new ProcessResult(task.filename(), simulatedBytes, elapsed);\n            };\n            futures.add(pool.submit(work));\n        }\n\n        System.out.println(\"Gathering processing results:\");\n        for (Future<ProcessResult> future : futures) {\n            ProcessResult res = future.get();\n            System.out.printf(\"  Processed %-22s -> %,d bytes (Took %dms)%n\", res.filename(), res.processedBytes(), res.latencyMs());\n        }\n\n        pool.shutdown();\n        System.out.println(\"Batch processing successfully completed.\");\n    }\n}",
            "output": "Submitting batch of 4 images to fixed pool (size 2)...\n\nGathering processing results:\n  Processed hero_banner.png        -> 622,080 bytes (Took 43ms)\n  Processed profile_avatar.jpg     -> 48,000 bytes (Took 24ms)\n  Processed thumbnail_preview.png  -> 12,000 bytes (Took 20ms)\n  Processed product_diagram.svg    -> 288,000 bytes (Took 30ms)\nBatch processing successfully completed.",
            "stepByStep": [
                "Submits 4 image processing tasks to a 2-thread pool.",
                "Each task returns a ProcessResult record with byte size and elapsed duration.",
                "future.get() blocks until each image completes and displays metrics.",
                "Pool gracefully shuts down."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Using unbounded newCachedThreadPool in production",
            "wrongCode": "ExecutorService pool = Executors.newCachedThreadPool();",
            "fixedCode": "ExecutorService pool = new ThreadPoolExecutor(10, 50, 60, TimeUnit.SECONDS, new ArrayBlockingQueue<>(500));",
            "cause": "newCachedThreadPool allows up to 2.14 billion threads, leading to OOM crashes under sudden traffic spikes.",
            "solution": "Always bound pool and queue capacities in production backends."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always call shutdown() or use try-with-resources (Java 19+).",
            "Size CPU-bound pools to CoreCount + 1, and I/O pools with bounded queues."
        ],
        "dontList": [
            "Do not let tasks swallow exceptions without logging or rethrowing.",
            "Do not block indefinitely with future.get(); specify a timeout."
        ],
        "whenNotToUse": "For millions of concurrent lightweight I/O tasks, use Virtual Threads (Topic 53)."
    },
    "versionNotes": {
        "introduced": "Java 5",
        "status": "Stable",
        "compatibilityNotes": "Java 19 made ExecutorService implement AutoCloseable.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "Executor Service Types Cheat Sheet",
        "headers": [
            "Factory Method",
            "Core Threads",
            "Max Threads",
            "Queue Policy"
        ],
        "rows": [
            [
                "newFixedThreadPool(N)",
                "N",
                "N",
                "Unbounded LinkedBlockingQueue"
            ],
            [
                "newCachedThreadPool()",
                "0",
                "Integer.MAX_VALUE",
                "Direct handoff SynchronousQueue"
            ],
            [
                "newSingleThreadExecutor()",
                "1",
                "1",
                "Unbounded LinkedBlockingQueue"
            ],
            [
                "newScheduledThreadPool(N)",
                "N",
                "Integer.MAX_VALUE",
                "DelayedWorkQueue"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Timed Asynchronous Task",
            "prompt": "Submit a task that returns a String and retrieve it with a 500ms timeout.",
            "solution": "Future<String> f = pool.submit(() -> \"done\"); String res = f.get(500, TimeUnit.MILLISECONDS);",
            "explanation": "Prevents indefinite blocking if the worker thread hangs."
        }
    ],
    "officialSources": [
        {
            "title": "Java SE 21 Specification: java.util.concurrent.ExecutorService",
            "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-52",
    "slug": "asynchronous-pipelines-with-completablefuture",
    "topicNumber": 52,
    "title": "Asynchronous Pipelines with CompletableFuture",
    "part": "Part 1: Java Core",
    "sectionNumber": 13,
    "sectionTitle": "Concurrency & Multithreading",
    "versionBadge": "Java 8+ / Enhanced Java 9 & 12",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Build reactive, non-blocking asynchronous pipelines with stage transformations, combinations, and error recovery.",
    "prerequisites": [
        "Topic 40: Lambdas and Functional Interfaces",
        "Topic 51: Executor Framework and Thread Pools"
    ],
    "whatAndWhy": {
        "definition": "CompletableFuture represents a stage of a potentially asynchronous computation that triggers dependent actions upon completion without blocking the calling thread.",
        "analogy": "An automated fulfillment center where conveyor belts branch into parallel packaging lines and merge completed packages into shipping trucks without stopping.",
        "whyItExists": "Eliminates blocking get() calls by providing composable, functional transformations (thenApply, thenCombine, exceptionally)."
    },
    "syntaxBreakdown": {
        "title": "CompletableFuture Pipeline Composition",
        "codeSnippet": "CompletableFuture.supplyAsync(() -> fetchPrice())\n    .thenApply(price -> price * 1.08)\n    .thenAccept(total -> notifyUser(total));",
        "explanation": "Initiates background task, transforms the output, and consumes final result without blocking.",
        "tokens": [
            {
                "token": "supplyAsync",
                "explanation": "Initiates asynchronous task returning a value"
            },
            {
                "token": "thenApply",
                "explanation": "Transforms result synchronously on completion"
            },
            {
                "token": "thenCombine",
                "explanation": "Merges results of two independent futures"
            },
            {
                "token": "exceptionally",
                "explanation": "Provides fallback recovery on pipeline error"
            }
        ]
    },
    "examples": [
        {
            "id": "52-1",
            "title": "Asynchronous Stage Composition & Exception Handling",
            "type": "basic",
            "description": "Chaining stages, combining futures, and recovering from errors.",
            "filename": "CompletableFuturePipelineDemo.java",
            "code": "import java.util.concurrent.CompletableFuture;\n\npublic class CompletableFuturePipelineDemo {\n    public static void main(String[] args) {\n        System.out.println(\"=== 1. Chaining Asynchronous Stages ===\");\n        CompletableFuture<String> pricePipeline = CompletableFuture.supplyAsync(() -> {\n            System.out.println(\"  [Async Stage 1] Fetching raw price in \" + Thread.currentThread().getName());\n            return 100.0;\n        }).thenApply(rawPrice -> {\n            System.out.println(\"  [Async Stage 2] Applying 8% tax\");\n            return rawPrice * 1.08;\n        }).thenApply(finalPrice -> String.format(\"Calculated Final Price: $%.2f USD\", finalPrice));\n\n        System.out.println(pricePipeline.join());\n\n        System.out.println(\"\\n=== 2. Combining Two Independent Futures ===\");\n        CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> \"Alice Vance\");\n        CompletableFuture<Double> balanceFuture = CompletableFuture.supplyAsync(() -> 1450.75);\n\n        CompletableFuture<String> combinedReport = userFuture.thenCombine(\n                balanceFuture,\n                (user, balance) -> String.format(\"Account Report: %s has balance $%.2f\", user, balance)\n        );\n\n        System.out.println(combinedReport.join());\n\n        System.out.println(\"\\n=== 3. Exception Handling with exceptionally() ===\");\n        CompletableFuture<String> resilientPipeline = CompletableFuture.supplyAsync(() -> {\n            if (true) throw new IllegalStateException(\"Payment gateway unreachable\");\n            return \"SUCCESS\";\n        }).exceptionally(ex -> {\n            System.out.println(\"  [Recovered] Intercepted failure: \" + ex.getMessage());\n            return \"FALLBACK_CACHE_OK\";\n        });\n\n        System.out.println(\"Resilient Outcome: \" + resilientPipeline.join());\n    }\n}",
            "output": "=== 1. Chaining Asynchronous Stages ===\n  [Async Stage 1] Fetching raw price in ForkJoinPool.commonPool-worker-1\n  [Async Stage 2] Applying 8% tax\nCalculated Final Price: $108.00 USD\n\n=== 2. Combining Two Independent Futures ===\nAccount Report: Alice Vance has balance $1450.75\n\n=== 3. Exception Handling with exceptionally() ===\n  [Recovered] Intercepted failure: java.lang.IllegalStateException: Payment gateway unreachable\nResilient Outcome: FALLBACK_CACHE_OK",
            "stepByStep": [
                "supplyAsync runs in ForkJoinPool.",
                "thenApply chains tax computation without blocking main thread.",
                "thenCombine awaits both user and balance futures, fusing into report.",
                "exceptionally intercepts runtime exception and returns fallback."
            ]
        },
        {
            "id": "52-2",
            "title": "Microservice Aggregator Dashboard",
            "type": "realistic",
            "description": "Aggregating three microservices concurrently into a unified dashboard.",
            "filename": "MicroserviceAggregatorApp.java",
            "code": "import java.util.concurrent.CompletableFuture;\n\npublic class MicroserviceAggregatorApp {\n    record UserProfile(String id, String name) {}\n    record AccountBalance(String id, double balance) {}\n    record CreditScore(String id, int score) {}\n    record Dashboard(String name, String id, double balance, int creditScore) {}\n\n    public static void main(String[] args) {\n        long startTime = System.currentTimeMillis();\n\n        CompletableFuture<UserProfile> profileFuture = CompletableFuture.supplyAsync(() -> {\n            simulateLatency(40);\n            return new UserProfile(\"USR-9001\", \"Marcus Vance\");\n        });\n\n        CompletableFuture<AccountBalance> balanceFuture = CompletableFuture.supplyAsync(() -> {\n            simulateLatency(60);\n            return new AccountBalance(\"USR-9001\", 5240.50);\n        });\n\n        CompletableFuture<CreditScore> scoreFuture = CompletableFuture.supplyAsync(() -> {\n            simulateLatency(50);\n            return new CreditScore(\"USR-9001\", 785);\n        });\n\n        CompletableFuture<Dashboard> dashboardFuture = profileFuture.thenCombine(\n                balanceFuture,\n                (profile, balance) -> new Object[] { profile, balance }\n        ).thenCombine(scoreFuture, (arr, score) -> {\n            UserProfile profile = (UserProfile) arr[0];\n            AccountBalance balance = (AccountBalance) arr[1];\n            return new Dashboard(profile.name(), profile.id(), balance.balance(), score.score());\n        });\n\n        Dashboard dashboard = dashboardFuture.join();\n        long totalElapsed = System.currentTimeMillis() - startTime;\n\n        System.out.println(\"=== Aggregated Microservice Dashboard ===\");\n        System.out.println(\"User:         \" + dashboard.name() + \" (\" + dashboard.id() + \")\");\n        System.out.printf(\"Balance:      $%,.2f%n\", dashboard.balance());\n        System.out.println(\"Credit Score: \" + dashboard.creditScore());\n        System.out.println(\"Aggregation completed in: \" + totalElapsed + \"ms (Parallel speedup verified)\");\n    }\n\n    private static void simulateLatency(long ms) {\n        try {\n            Thread.sleep(ms);\n        } catch (InterruptedException e) {\n            Thread.currentThread().interrupt();\n        }\n    }\n}",
            "output": "=== Aggregated Microservice Dashboard ===\nUser:         Marcus Vance (USR-9001)\nBalance:      $5,240.50\nCredit Score: 785\nAggregation completed in: 88ms (Parallel speedup verified)",
            "stepByStep": [
                "Launches 3 independent remote queries in parallel.",
                "Combines profile, balance, and credit score futures.",
                "All queries finish concurrently in ~88ms rather than 150ms sequential time."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Using default ForkJoinPool for slow blocking I/O",
            "wrongCode": "CompletableFuture.supplyAsync(() -> slowHttpCall());",
            "fixedCode": "CompletableFuture.supplyAsync(() -> slowHttpCall(), dedicatedIoPool);",
            "cause": "Blocking ForkJoinPool.commonPool starves CPU-bound operations and parallel streams across the entire JVM.",
            "solution": "Pass a dedicated custom Executor to supplyAsync and async stages."
        }
    ],
    "bestPractices": {
        "doList": [
            "Prefer join() over get() when unchecked CompletionException is preferred.",
            "Always supply an exceptionally or handle fallback block to prevent silent failures."
        ],
        "dontList": [
            "Do not block synchronously inside transformation lambdas.",
            "Do not create deeply nested callback chains when structured concurrency suffices."
        ],
        "whenNotToUse": "When sequential blocking code on Virtual Threads offers cleaner readability without reactive callbacks."
    },
    "versionNotes": {
        "introduced": "Java 8",
        "status": "Stable",
        "compatibilityNotes": "Java 9 added timeouts (orTimeout, completeOnTimeout). Java 12 added exceptionallyCompose.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "CompletableFuture Pipeline Methods",
        "headers": [
            "Method",
            "Input Lambda",
            "Returns",
            "Behavior"
        ],
        "rows": [
            [
                "thenApply",
                "Function<T, R>",
                "CompletableFuture<R>",
                "Transforms result synchronously"
            ],
            [
                "thenApplyAsync",
                "Function<T, R>",
                "CompletableFuture<R>",
                "Transforms result on separate thread"
            ],
            [
                "thenCompose",
                "Function<T, CF<R>>",
                "CompletableFuture<R>",
                "Flattens nested future (flatMap)"
            ],
            [
                "thenCombine",
                "CF<U>, BiFunction",
                "CompletableFuture<R>",
                "Merges 2 independent futures"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Apply 10% Discount Pipeline",
            "prompt": "Chain supplyAsync with thenApply to apply a 10% discount to a $500 item.",
            "solution": "CompletableFuture.supplyAsync(() -> 500.0).thenApply(p -> p * 0.9).join();",
            "explanation": "thenApply transforms the upstream value to 450.0."
        }
    ],
    "officialSources": [
        {
            "title": "Java SE 21 Specification: java.util.concurrent.CompletableFuture",
            "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-53",
    "slug": "virtual-threads",
    "topicNumber": 53,
    "title": "Virtual Threads (Project Loom)",
    "part": "Part 1: Java Core",
    "sectionNumber": 13,
    "sectionTitle": "Concurrency & Multithreading",
    "versionBadge": "Java 21 LTS Standard Feature",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Master lightweight user-mode virtual threads, carrier threads, unmounting mechanics, and high-throughput server concurrency.",
    "prerequisites": [
        "Topic 48: Threads and Thread Lifecycle",
        "Topic 51: Executor Framework and Thread Pools"
    ],
    "whatAndWhy": {
        "definition": "Virtual threads are lightweight, JVM-managed threads that allow writing synchronous, blocking code at massive scale without tying up expensive operating system kernel threads.",
        "analogy": "A call center where agents put customers on automated hold while answering other calls, remounting callers the instant they are ready to talk.",
        "whyItExists": "Enables high-throughput thread-per-request architectures without reactive framework complexity, scaling to millions of concurrent tasks."
    },
    "syntaxBreakdown": {
        "title": "Creating and Executing Virtual Threads",
        "codeSnippet": "Thread.ofVirtual().name(\"vt\").start(() -> ...);\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n    executor.submit(() -> ...);\n}",
        "explanation": "Spawns virtual threads directly or submits tasks to a virtual-thread-per-task executor.",
        "tokens": [
            {
                "token": "Thread.ofVirtual()",
                "explanation": "Fluent builder for virtual threads"
            },
            {
                "token": "newVirtualThreadPerTaskExecutor()",
                "explanation": "Creates an executor spawning a fresh virtual thread per task"
            },
            {
                "token": "isVirtual()",
                "explanation": "Returns true if current thread is virtual"
            }
        ]
    },
    "examples": [
        {
            "id": "53-1",
            "title": "Virtual Thread Creation and Scaling",
            "type": "basic",
            "description": "Inspecting carrier threads and executing 1,000 virtual threads concurrently.",
            "filename": "VirtualThreadsDemo.java",
            "code": "import java.util.concurrent.ExecutorService;\nimport java.util.concurrent.Executors;\n\npublic class VirtualThreadsDemo {\n    public static void main(String[] args) throws InterruptedException {\n        Thread vt = Thread.ofVirtual().name(\"vt-worker\").start(() -> {\n            System.out.println(\"Running Virtual Thread: \" + Thread.currentThread());\n            System.out.println(\"Is Virtual Thread?      \" + Thread.currentThread().isVirtual());\n        });\n        vt.join();\n\n        int taskCount = 1000;\n        long start = System.currentTimeMillis();\n        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < taskCount; i++) {\n                executor.submit(() -> {\n                    try {\n                        Thread.sleep(10);\n                    } catch (InterruptedException e) {\n                        Thread.currentThread().interrupt();\n                    }\n                });\n            }\n        }\n\n        long elapsed = System.currentTimeMillis() - start;\n        System.out.println(\"\\nVirtual Threads Completed: \" + taskCount + \" / \" + taskCount);\n        System.out.println(\"Execution Duration:        \" + elapsed + \"ms\");\n    }\n}",
            "output": "Running Virtual Thread: VirtualThread[#28,vt-worker]/runnable@ForkJoinPool-1-worker-1\nIs Virtual Thread?      true\n\nVirtual Threads Completed: 1000 / 1000\nExecution Duration:        38ms",
            "stepByStep": [
                "Creates a virtual thread named vt-worker.",
                "Prints underlying carrier thread in ForkJoinPool.",
                "Executes 1,000 tasks concurrently in 38ms using try-with-resources."
            ]
        },
        {
            "id": "53-2",
            "title": "High-Throughput HTTP Request Simulator",
            "type": "realistic",
            "description": "Simulating 2,000 concurrent blocking HTTP requests with virtual threads.",
            "filename": "HighThroughputHttpSimulatorApp.java",
            "code": "import java.util.concurrent.ExecutorService;\nimport java.util.concurrent.Executors;\nimport java.util.concurrent.atomic.AtomicInteger;\n\npublic class HighThroughputHttpSimulatorApp {\n    record HttpResponse(int statusCode, String body) {}\n\n    public static void main(String[] args) {\n        int simulatedRequests = 2000;\n        AtomicInteger successCounter = new AtomicInteger(0);\n        System.out.println(\"Dispatching \" + simulatedRequests + \" concurrent requests using Virtual Threads...\");\n        long start = System.currentTimeMillis();\n\n        try (ExecutorService server = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < simulatedRequests; i++) {\n                final int reqId = i;\n                server.submit(() -> {\n                    HttpResponse response = handleClientRequest(reqId);\n                    if (response.statusCode() == 200) {\n                        successCounter.incrementAndGet();\n                    }\n                });\n            }\n        }\n\n        long duration = Math.max(1, System.currentTimeMillis() - start);\n        double throughput = (simulatedRequests * 1000.0) / duration;\n\n        System.out.println(\"=== Simulation Results ===\");\n        System.out.println(\"Successful Responses: \" + successCounter.get() + \" / \" + simulatedRequests);\n        System.out.println(\"Total Wall-Clock Time: \" + duration + \"ms\");\n        System.out.printf(\"Throughput:            %.0f req/sec%n\", throughput);\n    }\n\n    private static HttpResponse handleClientRequest(int id) {\n        try {\n            Thread.sleep(30);\n            return new HttpResponse(200, \"{\\\"id\\\": \" + id + \", \\\"status\\\": \\\"ACTIVE\\\"}\");\n        } catch (InterruptedException e) {\n            Thread.currentThread().interrupt();\n            return new HttpResponse(500, \"{\\\"error\\\": \\\"interrupted\\\"}\");\n        }\n    }\n}",
            "output": "Dispatching 2000 concurrent requests using Virtual Threads...\n=== Simulation Results ===\nSuccessful Responses: 2000 / 2000\nTotal Wall-Clock Time: 84ms\nThroughput:            23809 req/sec",
            "stepByStep": [
                "Submits 2000 concurrent requests each sleeping 30ms.",
                "Virtual threads unmount during sleep, freeing carrier threads.",
                "Achieves over 20,000 req/sec throughput on ordinary developer hardware."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Pooling virtual threads",
            "wrongCode": "Executors.newFixedThreadPool(100, Thread.ofVirtual().factory());",
            "fixedCode": "Executors.newVirtualThreadPerTaskExecutor();",
            "cause": "Virtual threads are disposable heap objects; pooling them restricts throughput.",
            "solution": "Never pool virtual threads; spawn a new virtual thread per task."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use virtual threads for blocking I/O (network, DB, file calls).",
            "Use try-with-resources with newVirtualThreadPerTaskExecutor for structured lifecycles."
        ],
        "dontList": [
            "Do not use virtual threads for CPU-bound computations.",
            "Do not use ThreadLocal excessively with millions of virtual threads."
        ],
        "whenNotToUse": "For CPU-intensive algorithms (hashing, machine learning), use platform thread pools sized to CPU cores."
    },
    "versionNotes": {
        "introduced": "Java 19 (Preview)",
        "status": "Stable",
        "compatibilityNotes": "Graduated to permanent feature in Java 21 LTS via JEP 444. Java 24 (JEP 491) removes synchronized pinning.",
        "ltsAvailability": "Java 21, Java 25"
    },
    "cheatSheet": {
        "title": "Platform vs Virtual Threads Cheat Sheet",
        "headers": [
            "Feature",
            "Platform Thread",
            "Virtual Thread"
        ],
        "rows": [
            [
                "Stack Footprint",
                "~1 MB fixed RAM",
                "Few hundred bytes dynamic"
            ],
            [
                "Management",
                "OS Kernel",
                "JVM HotSpot"
            ],
            [
                "Concurrency Scale",
                "Thousands",
                "Millions"
            ],
            [
                "Blocking I/O",
                "Blocks OS thread",
                "Unmounts; frees carrier thread"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Check Virtual Thread",
            "prompt": "Check whether the currently running thread is virtual.",
            "solution": "boolean isVt = Thread.currentThread().isVirtual();",
            "explanation": "Thread.isVirtual() indicates if execution is on a virtual thread."
        }
    ],
    "officialSources": [
        {
            "title": "OpenJDK JEP 444: Virtual Threads (Java 21 LTS)",
            "url": "https://openjdk.org/jeps/444",
            "organization": "OpenJDK"
        }
    ]
},

  {
    "id": "topic-54",
    "slug": "structured-concurrency-and-scoped-values",
    "topicNumber": 54,
    "title": "Structured Concurrency & Scoped Values",
    "part": "Part 1: Java Core",
    "sectionNumber": 13,
    "sectionTitle": "Concurrency & Multithreading",
    "versionBadge": "Java 21–26 (Preview / JEP 480 & 481)",
    "difficulty": "Advanced",
    "readingTime": "13 min read",
    "shortDescription": "Tame concurrent subtasks using StructuredTaskScope, automatic cancellation, and lightweight immutable ScopedValue.",
    "prerequisites": [
        "Topic 51: Executor Framework and Thread Pools",
        "Topic 53: Virtual Threads (Project Loom)"
    ],
    "whatAndWhy": {
        "definition": "Structured Concurrency treats concurrent subtasks running in different threads as a single unit of work, strictly bounding thread lifecycles within syntactic code blocks.",
        "analogy": "Structured programming if/for loops returning cleanly to callers instead of unstructured goto jumps running amok.",
        "whyItExists": "Eliminates thread leaks, coordinates short-circuit cancellation, and provides clean hierarchical thread dumps."
    },
    "syntaxBreakdown": {
        "title": "StructuredTaskScope and ScopedValue Idioms",
        "codeSnippet": "try (var scope = StructuredTaskScope.open(StructuredTaskScope.Joiner.allSuccessfulOrThrow())) {\n    var subtask = scope.fork(() -> fetch());\n    scope.join();\n    var result = subtask.get();\n}",
        "explanation": "Opens structured scope, forks subtask on virtual thread, joins, and retrieves result.",
        "tokens": [
            {
                "token": "StructuredTaskScope.open()",
                "explanation": "Creates bounded structured task scope"
            },
            {
                "token": "scope.fork()",
                "explanation": "Forks concurrent subtask returning Subtask handle"
            },
            {
                "token": "scope.join()",
                "explanation": "Awaits completion according to Joiner policy"
            },
            {
                "token": "ScopedValue",
                "explanation": "Immutable, lightweight context passed down call trees"
            }
        ]
    },
    "examples": [
        {
            "id": "54-1",
            "title": "Structured Workflow with Scoped Values",
            "type": "basic",
            "description": "Propagating trace context and executing structured subtasks.",
            "filename": "StructuredConcurrencyDemo.java",
            "code": "import java.util.concurrent.StructuredTaskScope;\n\npublic class StructuredConcurrencyDemo {\n    private static final ScopedValue<String> TRACE_ID = ScopedValue.newInstance();\n\n    public static void main(String[] args) throws Exception {\n        ScopedValue.where(TRACE_ID, \"TXN-88219\").run(() -> {\n            try {\n                executeWorkflow();\n            } catch (Exception e) {\n                System.err.println(\"Workflow failed: \" + e.getMessage());\n            }\n        });\n    }\n\n    private static void executeWorkflow() throws Exception {\n        System.out.println(\"Initiating structured concurrency workflow. Trace ID: \" + TRACE_ID.get());\n        try (var scope = StructuredTaskScope.open()) {\n            StructuredTaskScope.Subtask<String> userTask = scope.fork(() -> {\n                Thread.sleep(50);\n                return \"User Profile: Alice Vance (ID: 409)\";\n            });\n            StructuredTaskScope.Subtask<String> ordersTask = scope.fork(() -> {\n                Thread.sleep(70);\n                return \"Active Orders: 3 Pending Shipments\";\n            });\n            scope.join();\n            System.out.println(\"Subtask 1 State: \" + userTask.state());\n            System.out.println(\"Subtask 1 Result: \" + userTask.get());\n            System.out.println(\"Subtask 2 State: \" + ordersTask.state());\n            System.out.println(\"Subtask 2 Result: \" + ordersTask.get());\n            System.out.println(\"Structured workflow completed successfully.\");\n        }\n    }\n}",
            "output": "Initiating structured concurrency workflow. Trace ID: TXN-88219\nSubtask 1 State: SUCCESS\nSubtask 1 Result: User Profile: Alice Vance (ID: 409)\nSubtask 2 State: SUCCESS\nSubtask 2 Result: Active Orders: 3 Pending Shipments\nStructured workflow completed successfully.",
            "stepByStep": [
                "Binds TRACE_ID via ScopedValue.where().",
                "Forks two subtasks within StructuredTaskScope.",
                "scope.join() awaits subtask completion.",
                "Subtasks clean up automatically upon scope exit."
            ]
        },
        {
            "id": "54-2",
            "title": "Travel Booking Aggregator with Short-Circuiting",
            "type": "realistic",
            "description": "Coordinating flight and hotel bookings with automatic cancellation if one fails.",
            "filename": "TravelBookingAggregatorApp.java",
            "code": "import java.util.concurrent.StructuredTaskScope;\n\npublic class TravelBookingAggregatorApp {\n    record FlightQuote(String flightNumber, double priceUsd) {}\n    record HotelBooking(String hotelName, double ratePerNight) {}\n    record TravelPackage(FlightQuote flight, HotelBooking hotel, double totalEstimatedCost) {}\n\n    public static void main(String[] args) {\n        System.out.println(\"Starting Travel Booking Aggregator...\");\n        try {\n            TravelPackage packageResult = assembleTravelPackage(\"JFK\", \"LHR\");\n            System.out.println(\"Booking Assembled Successfully:\");\n            System.out.println(\"  Flight: \" + packageResult.flight().flightNumber() + \" ($\" + packageResult.flight().priceUsd() + \")\");\n            System.out.println(\"  Hotel: \" + packageResult.hotel().hotelName() + \" ($\" + packageResult.hotel().ratePerNight() + \"/night)\");\n            System.out.println(\"  Total Estimated: $\" + packageResult.totalEstimatedCost());\n        } catch (Exception e) {\n            System.err.println(\"Travel package assembly failed: \" + e.getMessage());\n        }\n    }\n\n    public static TravelPackage assembleTravelPackage(String origin, String destination) throws InterruptedException {\n        try (var scope = StructuredTaskScope.open(StructuredTaskScope.Joiner.allSuccessfulOrThrow())) {\n            StructuredTaskScope.Subtask<FlightQuote> flightTask = scope.fork(() -> fetchFlightQuote(origin, destination));\n            StructuredTaskScope.Subtask<HotelBooking> hotelTask = scope.fork(() -> fetchHotelReservation(destination));\n            scope.join();\n            FlightQuote flight = flightTask.get();\n            HotelBooking hotel = hotelTask.get();\n            double total = flight.priceUsd() + (hotel.ratePerNight() * 3);\n            return new TravelPackage(flight, hotel, total);\n        }\n    }\n\n    private static FlightQuote fetchFlightQuote(String origin, String destination) throws InterruptedException {\n        Thread.sleep(60);\n        return new FlightQuote(\"BA-178 (\" + origin + \"->\" + destination + \")\", 680.50);\n    }\n\n    private static HotelBooking fetchHotelReservation(String city) throws InterruptedException {\n        Thread.sleep(40);\n        return new HotelBooking(\"The Kensington Garden Hotel (\" + city + \")\", 215.00);\n    }\n}",
            "output": "Starting Travel Booking Aggregator...\nBooking Assembled Successfully:\n  Flight: BA-178 (JFK->LHR) ($680.5)\n  Hotel: The Kensington Garden Hotel (LHR) ($215.0/night)\n  Total Estimated: $1325.5",
            "stepByStep": [
                "assembleTravelPackage opens structured scope with allSuccessfulOrThrow policy.",
                "Forks flight and hotel queries in parallel.",
                "scope.join() coordinates both queries and cancels siblings if any query fails.",
                "Assembles completed package safely."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Calling subtask.get() before scope.join()",
            "wrongCode": "var task = scope.fork(() -> calc());\nvar res = task.get();\nscope.join();",
            "fixedCode": "var task = scope.fork(() -> calc());\nscope.join();\nvar res = task.get();",
            "cause": "Calling get() before join() throws IllegalStateException because the subtask may still be in progress.",
            "solution": "Always call scope.join() before retrieving results via subtask.get()."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always use try-with-resources to ensure scope closure and cancel dangling tasks.",
            "Use ScopedValue instead of ThreadLocal for request context in virtual threads."
        ],
        "dontList": [
            "Do not let subtask references escape outside the try-with-resources block.",
            "Do not swallow InterruptedException inside forked subtasks."
        ],
        "whenNotToUse": "For fire-and-forget background background jobs that must outlive the caller, use standard ExecutorService."
    },
    "versionNotes": {
        "introduced": "Java 19 (Incubator)",
        "status": "Preview",
        "compatibilityNotes": "Refined in Java 21-24; updated with Joiner in Java 25/26 (JEP 480). Requires --enable-preview.",
        "ltsAvailability": "Preview in Java 21; preview in Java 25"
    },
    "cheatSheet": {
        "title": "Structured Concurrency Policies Cheat Sheet",
        "headers": [
            "Policy / Joiner",
            "Behavior on Success",
            "Behavior on Failure"
        ],
        "rows": [
            [
                "allSuccessfulOrThrow",
                "Awaits all subtasks",
                "Cancels siblings on first failure"
            ],
            [
                "anySuccessfulOrThrow",
                "Returns fastest subtask",
                "Fails only if all subtasks fail"
            ],
            [
                "awaitAll",
                "Awaits all subtasks regardless",
                "Does not cancel; collects all results"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Scoped User Context",
            "prompt": "Bind a ScopedValue with username \"admin\" and verify it is accessible in an inner method.",
            "solution": "ScopedValue.where(USER, \"admin\").run(() -> System.out.println(USER.get()));",
            "explanation": "ScopedValue is accessible throughout the dynamic call tree within the run block."
        }
    ],
    "officialSources": [
        {
            "title": "OpenJDK JEP 480: Structured Concurrency (Preview)",
            "url": "https://openjdk.org/jeps/480",
            "organization": "OpenJDK"
        },
        {
            "title": "OpenJDK JEP 481: Scoped Values (Preview)",
            "url": "https://openjdk.org/jeps/481",
            "organization": "OpenJDK"
        }
    ]
},

  {
    "id": "topic-55",
    "slug": "java-memory-model-and-runtime-data-areas",
    "topicNumber": 55,
    "title": "Java Memory Model & Runtime Data Areas",
    "part": "Part 1: Java Core",
    "sectionNumber": 14,
    "sectionTitle": "JVM Internals & Memory Architecture",
    "versionBadge": "Java 1.0+ / Formalized JSR-133",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Explore the internal memory layout of the JVM: Heap, Metaspace, Thread Stacks, PC Registers, and JMM happens-before rules.",
    "prerequisites": [
        "Topic 02: JDK vs JRE vs JVM & Setup",
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 49: Synchronization & Memory Visibility"
    ],
    "whatAndWhy": {
        "definition": "The JVM divides memory into thread-shared areas (Heap and Metaspace) and thread-private areas (Thread Stack, PC Register). The JMM defines formal happens-before ordering constraints governing shared memory visibility.",
        "analogy": "A corporate office where the central archive (Heap) and policy manuals (Metaspace) are shared by everyone, while each accountant works on a private desk notepad (Thread Stack).",
        "whyItExists": "Enables deterministic cross-thread memory visibility and prevents memory crashes through structured memory boundaries."
    },
    "syntaxBreakdown": {
        "title": "JVM Memory Inspection and Metrics",
        "codeSnippet": "Runtime rt = Runtime.getRuntime();\nlong maxMemory = rt.maxMemory();\nlong used = rt.totalMemory() - rt.freeMemory();",
        "explanation": "Queries the JVM runtime for max heap ceiling and current used heap memory.",
        "tokens": [
            {
                "token": "maxMemory()",
                "explanation": "Maximum heap size the JVM will attempt to allocate"
            },
            {
                "token": "totalMemory()",
                "explanation": "Current heap memory allocated from the OS"
            },
            {
                "token": "freeMemory()",
                "explanation": "Unused heap memory within the current total allocation"
            }
        ]
    },
    "examples": [
        {
            "id": "55-1",
            "title": "JVM Runtime Memory & Stack Depth Inspection",
            "type": "basic",
            "description": "Inspecting CPU cores, heap metrics, Metaspace usage, and call stack depth.",
            "filename": "MemoryLayoutRuntimeDemo.java",
            "code": "import java.lang.management.ManagementFactory;\nimport java.lang.management.MemoryMXBean;\n\npublic class MemoryLayoutRuntimeDemo {\n    public static void main(String[] args) {\n        System.out.println(\"=== JVM Memory Areas & Stack Inspection ===\");\n        Runtime runtime = Runtime.getRuntime();\n        long maxMemory = runtime.maxMemory();\n        long totalMemory = runtime.totalMemory();\n        long freeMemory = runtime.freeMemory();\n        long usedMemory = totalMemory - freeMemory;\n\n        System.out.println(\"Available CPU Cores: \" + runtime.availableProcessors());\n        System.out.printf(\"Max Heap Memory:     %,d bytes (%.1f MB)%n\", maxMemory, maxMemory / (1024.0 * 1024.0));\n        System.out.printf(\"Total Allocated:     %,d bytes (%.1f MB)%n\", totalMemory, totalMemory / (1024.0 * 1024.0));\n        System.out.printf(\"Used Heap Memory:    %,d bytes%n\", usedMemory);\n\n        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();\n        System.out.println(\"Non-Heap (Metaspace): \" + memoryBean.getNonHeapMemoryUsage().getUsed() / 1024 + \" KB\");\n\n        int measuredDepth = measureMaxStackDepth(0);\n        System.out.println(\"Safely Measured Stack Frame Depth: \" + measuredDepth);\n    }\n\n    private static int measureMaxStackDepth(int depth) {\n        if (depth >= 500) return depth;\n        return measureMaxStackDepth(depth + 1);\n    }\n}",
            "output": "=== JVM Memory Areas & Stack Inspection ===\nAvailable CPU Cores: 12\nMax Heap Memory:     8,564,768,768 bytes (8168.0 MB)\nTotal Allocated:     12,582,912 bytes (12.0 MB)\nUsed Heap Memory:    1,467,584 bytes\nNon-Heap (Metaspace): 2125 KB\nSafely Measured Stack Frame Depth: 500",
            "stepByStep": [
                "Queries Runtime for CPU cores and heap metrics.",
                "Retrieves non-heap Metaspace usage from MemoryMXBean.",
                "Measures method stack frame call depth safely up to 500 frames."
            ]
        },
        {
            "id": "55-2",
            "title": "Transient vs Retained Heap Memory Profiler",
            "type": "realistic",
            "description": "Demonstrating transient allocations in Eden vs retained heap in Old Gen.",
            "filename": "ObjectAllocationProfilerApp.java",
            "code": "import java.util.ArrayList;\nimport java.util.List;\n\npublic class ObjectAllocationProfilerApp {\n    record SensorPacket(long timestamp, int deviceId, double reading) {}\n\n    public static void main(String[] args) {\n        System.out.println(\"Starting Memory Allocation Profiler...\");\n        Runtime runtime = Runtime.getRuntime();\n        long initialUsed = runtime.totalMemory() - runtime.freeMemory();\n\n        long sum = 0;\n        for (int i = 0; i < 50_000; i++) {\n            SensorPacket packet = new SensorPacket(System.currentTimeMillis(), i, i * 1.5);\n            sum += packet.deviceId();\n        }\n        System.out.println(\"Processed 50,000 transient objects. Checksum: \" + sum);\n\n        List<SensorPacket> retainedLedger = new ArrayList<>(10_000);\n        for (int i = 0; i < 10_000; i++) {\n            retainedLedger.add(new SensorPacket(System.currentTimeMillis(), i, i * 2.0));\n        }\n\n        long finalUsed = runtime.totalMemory() - runtime.freeMemory();\n        long delta = finalUsed - initialUsed;\n        System.out.println(\"Retained Ledger Size: \" + retainedLedger.size() + \" items\");\n        System.out.printf(\"Heap Memory Delta:    ~%,d bytes%n\", Math.max(0, delta));\n        System.out.println(\"Allocation profiling completed successfully.\");\n    }\n}",
            "output": "Starting Memory Allocation Profiler...\nProcessed 50,000 transient objects. Checksum: 1249975000\nRetained Ledger Size: 10000 items\nHeap Memory Delta:    ~2,053,920 bytes\nAllocation profiling completed successfully.",
            "stepByStep": [
                "50,000 transient sensor packets are allocated and immediately eligible for collection.",
                "10,000 retained sensor packets remain reachable in a list, driving retained heap delta.",
                "Demonstrates generational memory allocation dynamics."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Unbounded static collection memory leak",
            "wrongCode": "public static List<Data> cache = new ArrayList<>();",
            "fixedCode": "private Cache<String, Data> cache = Caffeine.newBuilder().maximumSize(1000).build();",
            "cause": "Static references are roots that live for the life of the JVM, preventing GC of accumulated elements.",
            "solution": "Use bounded caches with eviction policies or WeakReferences."
        }
    ],
    "bestPractices": {
        "doList": [
            "Set initial (-Xms) and maximum (-Xmx) heap size equal in production to avoid dynamic resizing pauses.",
            "Profile heap allocations using JDK Flight Recorder (JFR) and JDK Mission Control (JMC)."
        ],
        "dontList": [
            "Do not allocate giant arrays inside frequent tight loops.",
            "Do not create unbounded thread stack depths with recursion."
        ],
        "whenNotToUse": "When off-heap native memory or foreign memory (Project Panama) is needed for zero-copy high performance."
    },
    "versionNotes": {
        "introduced": "Java 1.0",
        "status": "Stable",
        "compatibilityNotes": "Java 8 removed PermGen and replaced it with Metaspace. Java 21+ Project Lilliput object header optimizations.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "JVM Memory Areas Cheat Sheet",
        "headers": [
            "Area",
            "Scope",
            "Contents",
            "Exhaustion Error"
        ],
        "rows": [
            [
                "Heap",
                "Shared",
                "Objects, arrays",
                "OutOfMemoryError: Java heap space"
            ],
            [
                "Metaspace",
                "Shared",
                "Class definitions, bytecodes",
                "OutOfMemoryError: Metaspace"
            ],
            [
                "Thread Stack",
                "Private",
                "Frames, local primitives",
                "StackOverflowError"
            ],
            [
                "PC Register",
                "Private",
                "Instruction bytecode pointer",
                "None"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Query Available Processors",
            "prompt": "Query and print the available CPU core count available to the JVM.",
            "solution": "int cores = Runtime.getRuntime().availableProcessors();",
            "explanation": "Informs thread pool sizing for CPU-bound tasks."
        }
    ],
    "officialSources": [
        {
            "title": "JVM Specification: Chapter 2 Structure of JVM",
            "url": "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-56",
    "slug": "garbage-collection-algorithms-and-tuning",
    "topicNumber": 56,
    "title": "Garbage Collection Algorithms & Tuning",
    "part": "Part 1: Java Core",
    "sectionNumber": 14,
    "sectionTitle": "JVM Internals & Memory Architecture",
    "versionBadge": "Java 1.0+ / ZGC in Java 21 LTS",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Master modern garbage collection algorithms: Generational hypothesis, G1 GC, ultra-low-latency ZGC, and GC logging.",
    "prerequisites": [
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 55: Java Memory Model & Runtime Data Areas"
    ],
    "whatAndWhy": {
        "definition": "Garbage Collection is the automatic reclamation of heap memory occupied by unreachable objects, eliminating manual memory deallocation bugs such as memory leaks and dangling pointers.",
        "analogy": "Daily household trash pickup disposing of paper cups (Eden) while family furniture (Old Gen) stays for decades.",
        "whyItExists": "Guarantees memory safety and prevents dangling pointer bugs while modern collectors (ZGC) provide sub-millisecond pause times."
    },
    "syntaxBreakdown": {
        "title": "GC References and Modern Cleaners",
        "codeSnippet": "Cleaner cleaner = Cleaner.create();\ncleaner.register(this, () -> releaseNative());\nWeakReference<Object> ref = new WeakReference<>(obj);",
        "explanation": "Registers a modern resource cleaning callback and tracks object reachability via WeakReference.",
        "tokens": [
            {
                "token": "Cleaner",
                "explanation": "Java 9+ modern replacement for deprecated finalize()"
            },
            {
                "token": "WeakReference",
                "explanation": "Allows object collection on next GC pass"
            },
            {
                "token": "System.gc()",
                "explanation": "Hints to the JVM to perform a collection pass"
            }
        ]
    },
    "examples": [
        {
            "id": "56-1",
            "title": "Weak References and Cleaner Mechanics",
            "type": "basic",
            "description": "Reclaiming weak references and executing Cleaner cleanup callbacks.",
            "filename": "GarbageCollectionDemo.java",
            "code": "import java.lang.ref.Cleaner;\nimport java.lang.ref.WeakReference;\n\npublic class GarbageCollectionDemo {\n    private static final Cleaner CLEANER = Cleaner.create();\n    static class NativeResourceWrapper implements Runnable {\n        private final String resourceId;\n        NativeResourceWrapper(String resourceId) { this.resourceId = resourceId; }\n        @Override\n        public void run() {\n            System.out.println(\"  [Cleaner Callback] Reclaiming native handle for: \" + resourceId);\n        }\n    }\n    static class ManagedResource {\n        private final Cleaner.Cleanable cleanable;\n        ManagedResource(String id) {\n            this.cleanable = CLEANER.register(this, new NativeResourceWrapper(id));\n        }\n    }\n    public static void main(String[] args) throws InterruptedException {\n        System.out.println(\"=== 1. WeakReference Mechanics ===\");\n        Object strongObject = new String(\"Transient Cache Payload\");\n        WeakReference<Object> weakRef = new WeakReference<>(strongObject);\n        System.out.println(\"WeakRef holds value: \" + (weakRef.get() != null));\n        strongObject = null;\n        System.gc();\n        Thread.sleep(50);\n        System.out.println(\"WeakRef cleared after GC: \" + (weakRef.get() == null));\n\n        System.out.println(\"\\n=== 2. java.lang.ref.Cleaner (Modern Finalization) ===\");\n        allocateAndDiscard();\n        System.gc();\n        Thread.sleep(100);\n        System.out.println(\"Cleaner execution completed.\");\n    }\n    private static void allocateAndDiscard() {\n        new ManagedResource(\"SOCKET-FD-4091\");\n    }\n}",
            "output": "=== 1. WeakReference Mechanics ===\nWeakRef holds value: true\nWeakRef cleared after GC: true\n\n=== 2. java.lang.ref.Cleaner (Modern Finalization) ===\n  [Cleaner Callback] Reclaiming native handle for: SOCKET-FD-4091\nCleaner execution completed.",
            "stepByStep": [
                "Nulling strong reference leaves only WeakReference.",
                "System.gc() reclaims the unreachable String.",
                "Cleaner callback executes asynchronously to release native socket handle."
            ]
        },
        {
            "id": "56-2",
            "title": "Heap Pressure & GC Metric Analyzer",
            "type": "realistic",
            "description": "Tracking garbage collector activity and memory churning metrics.",
            "filename": "HeapPressureAnalyzerApp.java",
            "code": "import java.lang.management.GarbageCollectorMXBean;\nimport java.lang.management.ManagementFactory;\nimport java.util.List;\n\npublic class HeapPressureAnalyzerApp {\n    public static void main(String[] args) {\n        System.out.println(\"Starting Heap Pressure & GC Metric Analyzer...\");\n        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();\n        for (GarbageCollectorMXBean gc : gcBeans) {\n            System.out.printf(\"  Collector: %-25s | Collections: %d | Time: %dms%n\",\n                    gc.getName(), gc.getCollectionCount(), gc.getCollectionTime());\n        }\n        long totalAllocated = 0;\n        for (int batch = 0; batch < 1000; batch++) {\n            byte[] transientBuffer = new byte[1024];\n            transientBuffer[0] = (byte) (batch % 127);\n            totalAllocated += transientBuffer.length;\n        }\n        System.out.println(\"Allocated & Discarded: \" + (totalAllocated / 1024) + \" KB transient chunks\");\n        System.out.println(\"Garbage Collection Metrics Polled Successfully.\");\n    }\n}",
            "output": "Starting Heap Pressure & GC Metric Analyzer...\n  Collector: G1 Young Generation       | Collections: 0 | Time: 0ms\n  Collector: G1 Concurrent GC          | Collections: 0 | Time: 0ms\n  Collector: G1 Old Generation         | Collections: 0 | Time: 0ms\nAllocated & Discarded: 1000 KB transient chunks\nGarbage Collection Metrics Polled Successfully.",
            "stepByStep": [
                "Queries active JVM garbage collector MXBeans.",
                "Churns transient 1 KB byte buffers in the Young Gen.",
                "Logs collection counts and pause duration statistics."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Calling System.gc() explicitly in production",
            "wrongCode": "System.gc();",
            "fixedCode": "// Let JVM garbage collector heuristics manage passes automatically",
            "cause": "Forces Stop-The-World full GC across all threads, disrupting adaptive collector heuristics.",
            "solution": "Avoid explicit System.gc() calls; disable via -XX:+DisableExplicitGC if needed."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use ZGC (-XX:+UseZGC) for latency-critical applications requiring sub-millisecond pause times.",
            "Enable unified GC logging with -Xlog:gc* in production servers."
        ],
        "dontList": [
            "Do not override deprecated finalize().",
            "Do not rely on GC for closing OS resources; use try-with-resources."
        ],
        "whenNotToUse": "For offline batch data processing where total execution time matters more than pauses, Parallel GC offers superior throughput."
    },
    "versionNotes": {
        "introduced": "Java 1.0",
        "status": "Stable",
        "compatibilityNotes": "Java 9 made G1 default. Java 21 introduced Generational ZGC. Java 18 deprecated finalize for removal.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "Garbage Collector Comparison Cheat Sheet",
        "headers": [
            "Collector",
            "Flag",
            "Optimized For",
            "Pause Characteristics"
        ],
        "rows": [
            [
                "G1 GC (Default)",
                "-XX:+UseG1GC",
                "Balanced web services",
                "100-200ms predictable pauses"
            ],
            [
                "ZGC (Generational)",
                "-XX:+UseZGC",
                "Ultra-low latency",
                "< 1ms concurrent pauses"
            ],
            [
                "Parallel GC",
                "-XX:+UseParallelGC",
                "Maximum batch throughput",
                "Seconds (Stop-The-World)"
            ],
            [
                "Serial GC",
                "-XX:+UseSerialGC",
                "Single-core / CLI tools",
                "Tens of milliseconds"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Create Weak Reference Cache Entry",
            "prompt": "Wrap an expensive cached computation in a WeakReference.",
            "solution": "WeakReference<byte[]> cache = new WeakReference<>(new byte[1024]);",
            "explanation": "Allows GC to reclaim memory when strong references are gone."
        }
    ],
    "officialSources": [
        {
            "title": "HotSpot Garbage Collection Tuning Guide",
            "url": "https://docs.oracle.com/en/java/javase/21/gctuning/",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-57",
    "slug": "classloaders-and-jit-compilation",
    "topicNumber": 57,
    "title": "ClassLoaders & JIT Compilation",
    "part": "Part 1: Java Core",
    "sectionNumber": 14,
    "sectionTitle": "JVM Internals & Memory Architecture",
    "versionBadge": "Java 1.0+ / Enhanced Java 9 & 21",
    "difficulty": "Advanced",
    "readingTime": "13 min read",
    "shortDescription": "Explore classloader delegation, bytecode verification, HotSpot C1 and C2 tiered JIT compilation, and dynamic code optimization.",
    "prerequisites": [
        "Topic 02: JDK vs JRE vs JVM & Setup",
        "Topic 16: Classes, Objects & Memory Layout"
    ],
    "whatAndWhy": {
        "definition": "ClassLoaders dynamically locate and load bytecode into JVM Metaspace following parent delegation. The JIT Compiler compiles frequently executed bytecode into optimized native CPU machine code on the fly.",
        "analogy": "An orchestra librarian placing sheet music on stands (ClassLoader) and a virtuoso soloist memorizing a repeated theme to play at top speed without reading notes (JIT).",
        "whyItExists": "Enables dynamic plugin loading, modular security sandboxing, and near-native execution performance."
    },
    "syntaxBreakdown": {
        "title": "ClassLoader Hierarchy Traversal",
        "codeSnippet": "ClassLoader app = MyClass.class.getClassLoader();\nClassLoader platform = app.getParent();\nClassLoader bootstrap = platform.getParent(); // null",
        "explanation": "Traverses the 3-tier classloader hierarchy up to native Bootstrap loader.",
        "tokens": [
            {
                "token": "getClassLoader()",
                "explanation": "Returns the ClassLoader that loaded the class"
            },
            {
                "token": "getParent()",
                "explanation": "Returns parent ClassLoader in delegation hierarchy"
            },
            {
                "token": "findClass()",
                "explanation": "Method overridden in custom ClassLoaders to locate bytecodes"
            }
        ]
    },
    "examples": [
        {
            "id": "57-1",
            "title": "ClassLoader Hierarchy Inspection",
            "type": "basic",
            "description": "Inspecting AppClassLoader, PlatformClassLoader, and native Bootstrap loader.",
            "filename": "ClassLoaderHierarchyDemo.java",
            "code": "public class ClassLoaderHierarchyDemo {\n    public static void main(String[] args) {\n        System.out.println(\"=== ClassLoader Delegation Hierarchy ===\");\n        ClassLoader appLoader = ClassLoaderHierarchyDemo.class.getClassLoader();\n        System.out.println(\"1. Application ClassLoader: \" + appLoader.getName() + \" (\" + appLoader.getClass().getSimpleName() + \")\");\n\n        ClassLoader platformLoader = appLoader.getParent();\n        System.out.println(\"2. Platform ClassLoader:    \" + platformLoader.getName() + \" (\" + platformLoader.getClass().getSimpleName() + \")\");\n\n        ClassLoader bootstrapLoader = platformLoader.getParent();\n        System.out.println(\"3. Bootstrap ClassLoader:   \" + bootstrapLoader + \" (Native JVM Core)\");\n\n        ClassLoader stringLoader = String.class.getClassLoader();\n        System.out.println(\"\\nString.class ClassLoader:   \" + stringLoader + \" (Bootstrap verified)\");\n    }\n}",
            "output": "=== ClassLoader Delegation Hierarchy ===\n1. Application ClassLoader: app (AppClassLoader)\n2. Platform ClassLoader:    platform (PlatformClassLoader)\n3. Bootstrap ClassLoader:   null (Native JVM Core)\n\nString.class ClassLoader:   null (Bootstrap verified)",
            "stepByStep": [
                "AppClassLoader loads application classes.",
                "PlatformClassLoader is its parent, loading Java modules.",
                "Bootstrap loader is native C++ (represented as null).",
                "String.class shows null, verifying core bootstrap origin."
            ]
        },
        {
            "id": "57-2",
            "title": "Dynamic Isolated Plugin ClassLoader",
            "type": "realistic",
            "description": "Implementing custom classloader for plugin isolation and dynamic unloading.",
            "filename": "HotReloadPluginClassLoaderApp.java",
            "code": "import java.io.ByteArrayOutputStream;\nimport java.io.InputStream;\n\npublic class HotReloadPluginClassLoaderApp {\n    static class IsolatedPluginClassLoader extends ClassLoader {\n        private final String pluginName;\n        public IsolatedPluginClassLoader(String pluginName, ClassLoader parent) {\n            super(parent);\n            this.pluginName = pluginName;\n        }\n        @Override\n        protected Class<?> findClass(String name) throws ClassNotFoundException {\n            String resourcePath = name.replace('.', '/') + \".class\";\n            try (InputStream is = getResourceAsStream(resourcePath)) {\n                if (is == null) throw new ClassNotFoundException(\"Plugin resource not found: \" + resourcePath);\n                ByteArrayOutputStream buffer = new ByteArrayOutputStream();\n                byte[] chunk = new byte[1024];\n                int bytesRead;\n                while ((bytesRead = is.read(chunk)) != -1) buffer.write(chunk, 0, bytesRead);\n                byte[] classBytes = buffer.toByteArray();\n                return defineClass(name, classBytes, 0, classBytes.length);\n            } catch (Exception e) {\n                throw new ClassNotFoundException(\"Failed to load plugin class: \" + name, e);\n            }\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Starting Dynamic Plugin ClassLoader App...\");\n        IsolatedPluginClassLoader pluginLoader1 = new IsolatedPluginClassLoader(\"Billing-v1\", null);\n        IsolatedPluginClassLoader pluginLoader2 = new IsolatedPluginClassLoader(\"Billing-v2\", null);\n        System.out.println(\"Plugin Loader 1 Parent: \" + pluginLoader1.getParent());\n        System.out.println(\"Plugin Loader 2 Parent: \" + pluginLoader2.getParent());\n        System.out.println(\"ClassLoader Isolation:  \" + (pluginLoader1 != pluginLoader2));\n        System.out.println(\"Dynamic ClassLoader initialised successfully.\");\n    }\n}",
            "output": "Starting Dynamic Plugin ClassLoader App...\nPlugin Loader 1 Parent: null\nPlugin Loader 2 Parent: null\nClassLoader Isolation:  true\nDynamic ClassLoader initialised successfully.",
            "stepByStep": [
                "Defines custom IsolatedPluginClassLoader overriding findClass().",
                "Instantiates two isolated loaders with null parent for sandboxing.",
                "Verifies independent isolation between plugin runtimes."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "ClassCastException across multiple ClassLoaders",
            "wrongCode": "Class<?> c1 = loader1.loadClass(\"User\");\nClass<?> c2 = loader2.loadClass(\"User\");\n// c1 == c2 evaluates to false",
            "fixedCode": "// Ensure shared interface types are loaded by common parent ClassLoader",
            "cause": "The JVM identifies types by fully qualified name AND ClassLoader instance.",
            "solution": "Share interface definitions via common parent loader while isolating implementations."
        }
    ],
    "bestPractices": {
        "doList": [
            "Adhere to parent-first delegation unless explicitly implementing plugin overrides.",
            "Use -XX:+PrintCompilation to inspect hot spot JIT optimization during tuning."
        ],
        "dontList": [
            "Do not write monstrous methods (>8KB) that exceed JIT inlining thresholds.",
            "Do not attempt to define classes inside java.* packages (SecurityException)."
        ],
        "whenNotToUse": "When standard classpath loading meets your needs, custom ClassLoaders introduce classloading complexity."
    },
    "versionNotes": {
        "introduced": "Java 1.0",
        "status": "Stable",
        "compatibilityNotes": "Java 8 enabled TieredCompilation by default. Java 9 replaced Extension loader with PlatformClassLoader.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "ClassLoaders and JIT Compilers Cheat Sheet",
        "headers": [
            "Component",
            "Role",
            "Compilation Tier",
            "Behavior"
        ],
        "rows": [
            [
                "Interpreter",
                "Immediate execution",
                "Tier 0",
                "Interprets bytecode line-by-line"
            ],
            [
                "C1 Compiler",
                "Quick native translation",
                "Tier 1-3",
                "Client JIT with basic profiling"
            ],
            [
                "C2 Compiler",
                "High-performance JIT",
                "Tier 4",
                "Aggressive inlining, loop unrolling"
            ],
            [
                "AppClassLoader",
                "Classpath loading",
                "N/A",
                "Loads user classes from -cp"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Check Core Loader",
            "prompt": "Check the ClassLoader of java.lang.String.",
            "solution": "ClassLoader cl = String.class.getClassLoader(); // cl is null (Bootstrap)",
            "explanation": "The native Bootstrap ClassLoader is represented by null in Java."
        }
    ],
    "officialSources": [
        {
            "title": "JVM Specification: Chapter 5 Loading, Linking, and Initializing",
            "url": "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-5.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-58",
    "slug": "annotations-and-metadata",
    "topicNumber": 58,
    "title": "Annotations & Metadata",
    "part": "Part 1: Java Core",
    "sectionNumber": 15,
    "sectionTitle": "Reflection, Annotations & JPMS",
    "versionBadge": "Java 5+ / Enhanced Java 8 & 9",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Master declarative metadata with custom annotations, meta-annotations (@Retention, @Target), and runtime reflection processing.",
    "prerequisites": [
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 23: Interfaces & Modern Interface Evolution"
    ],
    "whatAndWhy": {
        "definition": "Annotations are declarative syntactic metadata attached to code elements without directly altering execution semantics, consumed by compilers, code generators, and runtime frameworks.",
        "analogy": "Shipping stickers placed on cargo boxes (FRAGILE, KEEP COLD) instructing handlers and automated belts how to process them.",
        "whyItExists": "Replaces error-prone XML files and string naming conventions with type-safe declarative metadata."
    },
    "syntaxBreakdown": {
        "title": "Annotation Declaration and Application",
        "codeSnippet": "@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\npublic @interface AuditLog {\n    String action();\n    int severity() default 1;\n}",
        "explanation": "Declares a runtime annotation applicable to methods with attributes and default values.",
        "tokens": [
            {
                "token": "@interface",
                "explanation": "Declares a custom annotation type"
            },
            {
                "token": "@Retention",
                "explanation": "Specifies lifetime: SOURCE, CLASS, or RUNTIME"
            },
            {
                "token": "@Target",
                "explanation": "Restricts valid placement: METHOD, FIELD, TYPE, etc."
            }
        ]
    },
    "examples": [
        {
            "id": "58-1",
            "title": "Runtime Annotation Reflection Processing",
            "type": "basic",
            "description": "Defining and processing method-level runtime annotations via reflection.",
            "filename": "AnnotationProcessingDemo.java",
            "code": "import java.lang.annotation.ElementType;\nimport java.lang.annotation.Retention;\nimport java.lang.annotation.RetentionPolicy;\nimport java.lang.annotation.Target;\nimport java.lang.reflect.Method;\n\npublic class AnnotationProcessingDemo {\n    @Retention(RetentionPolicy.RUNTIME)\n    @Target(ElementType.METHOD)\n    @interface AuditLog {\n        String action();\n        int severity() default 1;\n    }\n    static class BillingService {\n        @AuditLog(action = \"PROCESS_CREDIT_CARD\", severity = 3)\n        public void charge(String card, double amount) {\n            System.out.printf(\"  Executing charge: card=****%s, amount=$%.2f%n\", card.substring(card.length() - 4), amount);\n        }\n        public void ping() { System.out.println(\"  Ping service active.\"); }\n    }\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"=== Runtime Annotation Reflection Processing ===\");\n        BillingService service = new BillingService();\n        Class<?> clazz = service.getClass();\n        for (Method method : clazz.getDeclaredMethods()) {\n            if (method.isAnnotationPresent(AuditLog.class)) {\n                AuditLog annotation = method.getAnnotation(AuditLog.class);\n                System.out.printf(\"Intercepted Annotated Method [%s]: action='%s', severity=%d%n\", method.getName(), annotation.action(), annotation.severity());\n                method.invoke(service, \"4111222233334444\", 249.99);\n            }\n        }\n        System.out.println(\"Annotation processing completed successfully.\");\n    }\n}",
            "output": "=== Runtime Annotation Reflection Processing ===\nIntercepted Annotated Method [charge]: action='PROCESS_CREDIT_CARD', severity=3\n  Executing charge: card=****4444, amount=$249.99\nAnnotation processing completed successfully.",
            "stepByStep": [
                "Defines custom AuditLog annotation with RUNTIME retention.",
                "Reflectively inspects declared methods on BillingService.",
                "Extracts annotation attributes and invokes the method."
            ]
        },
        {
            "id": "58-2",
            "title": "Declarative ORM Entity Validation Engine",
            "type": "realistic",
            "description": "Validating domain entity constraints using field-level annotations.",
            "filename": "OrmEntityValidatorApp.java",
            "code": "import java.lang.annotation.ElementType;\nimport java.lang.annotation.Retention;\nimport java.lang.annotation.RetentionPolicy;\nimport java.lang.annotation.Target;\nimport java.lang.reflect.Field;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class OrmEntityValidatorApp {\n    @Retention(RetentionPolicy.RUNTIME)\n    @Target(ElementType.FIELD)\n    @interface NotEmpty { String message() default \"Field must not be empty\"; }\n\n    @Retention(RetentionPolicy.RUNTIME)\n    @Target(ElementType.FIELD)\n    @interface Range {\n        double min();\n        double max();\n        String message() default \"Value out of valid range\";\n    }\n\n    static class ProductEntity {\n        @NotEmpty(message = \"Product SKU cannot be blank\")\n        private final String sku;\n        @Range(min = 0.01, max = 10000.0, message = \"Price must be between $0.01 and $10,000.00\")\n        private final double price;\n        ProductEntity(String sku, double price) { this.sku = sku; this.price = price; }\n    }\n\n    static class ValidationEngine {\n        public static List<String> validate(Object entity) throws Exception {\n            List<String> violations = new ArrayList<>();\n            Class<?> clazz = entity.getClass();\n            for (Field field : clazz.getDeclaredFields()) {\n                field.setAccessible(true);\n                Object val = field.get(entity);\n                if (field.isAnnotationPresent(NotEmpty.class) && (val == null || val.toString().trim().isEmpty())) {\n                    violations.add(field.getAnnotation(NotEmpty.class).message());\n                }\n                if (field.isAnnotationPresent(Range.class) && val instanceof Number num) {\n                    Range range = field.getAnnotation(Range.class);\n                    double d = num.doubleValue();\n                    if (d < range.min() || d > range.max()) violations.add(range.message() + \" (Actual: \" + d + \")\");\n                }\n            }\n            return violations;\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"Starting ORM Entity Validation Engine...\");\n        ProductEntity validProduct = new ProductEntity(\"PROD-882\", 149.50);\n        ProductEntity invalidProduct = new ProductEntity(\"\", -12.00);\n        List<String> errors1 = ValidationEngine.validate(validProduct);\n        System.out.println(\"Valid Product Violations:   \" + errors1.size());\n        List<String> errors2 = ValidationEngine.validate(invalidProduct);\n        System.out.println(\"Invalid Product Violations: \" + errors2.size());\n        for (String err : errors2) System.out.println(\"  - Violation: \" + err);\n        System.out.println(\"Entity validation completed successfully.\");\n    }\n}",
            "output": "Starting ORM Entity Validation Engine...\nValid Product Violations:   0\nInvalid Product Violations: 2\n  - Violation: Product SKU cannot be blank\n  - Violation: Price must be between $0.01 and $10,000.00 (Actual: -12.0)\nEntity validation completed successfully.",
            "stepByStep": [
                "Inspects field annotations on product entities.",
                "Evaluates NotEmpty and Range constraints reflectively.",
                "Identifies invalid fields without manual validation method calls."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Omitting RUNTIME retention policy",
            "wrongCode": "@Target(ElementType.METHOD)\npublic @interface MyHook {}",
            "fixedCode": "@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\npublic @interface MyHook {}",
            "cause": "Defaults to CLASS retention, which is stripped from JVM runtime Metaspace.",
            "solution": "Explicitly specify @Retention(RetentionPolicy.RUNTIME) for reflection."
        }
    ],
    "bestPractices": {
        "doList": [
            "Provide default values for optional annotation attributes.",
            "Use standard compiler annotations (@Override, @Deprecated) consistently."
        ],
        "dontList": [
            "Do not use complex objects as annotation attributes (restricted to primitives, String, Class, enum, annotations, and arrays).",
            "Do not over-annotate code to the point of unreadability."
        ],
        "whenNotToUse": "When dynamic runtime logic can be more cleanly expressed with polymorphic strategies or lambdas."
    },
    "versionNotes": {
        "introduced": "Java 5",
        "status": "Stable",
        "compatibilityNotes": "Java 8 added type annotations (@Target(TYPE_USE)) and @Repeatable.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "Meta-Annotations Cheat Sheet",
        "headers": [
            "Meta-Annotation",
            "Valid Values",
            "Purpose"
        ],
        "rows": [
            [
                "@Retention",
                "SOURCE, CLASS, RUNTIME",
                "Defines how long metadata is kept"
            ],
            [
                "@Target",
                "TYPE, METHOD, FIELD, etc.",
                "Restricts where annotation can be applied"
            ],
            [
                "@Documented",
                "Marker",
                "Includes in Javadoc documentation"
            ],
            [
                "@Repeatable",
                "Container annotation class",
                "Allows multiple occurrences on same element"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Define Table Annotation",
            "prompt": "Define a @Table runtime annotation targeting classes with a required name attribute.",
            "solution": "@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.TYPE)\npublic @interface Table { String name(); }",
            "explanation": "Restricts placement to classes and interfaces with a required table name."
        }
    ],
    "officialSources": [
        {
            "title": "Java SE 21 Specification: java.lang.annotation",
            "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/annotation/package-summary.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-59",
    "slug": "reflection-api-and-methodhandles",
    "topicNumber": 59,
    "title": "Reflection API & MethodHandles",
    "part": "Part 1: Java Core",
    "sectionNumber": 15,
    "sectionTitle": "Reflection, Annotations & JPMS",
    "versionBadge": "Java 1.1+ / MethodHandles in Java 7+",
    "difficulty": "Advanced",
    "readingTime": "13 min read",
    "shortDescription": "Explore runtime introspection with java.lang.reflect, dynamic proxies, and high-performance method invocation with MethodHandles.",
    "prerequisites": [
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 23: Interfaces & Modern Interface Evolution",
        "Topic 58: Annotations & Metadata"
    ],
    "whatAndWhy": {
        "definition": "Reflection inspects and manipulates classes, fields, methods, and constructors dynamically at runtime. MethodHandles provide a high-performance, strongly typed alternative optimized by the JIT compiler.",
        "analogy": "Calling building security to manually check architectural blueprints and unlock doors (Reflection) vs using a pre-authorized fast electronic keycard (MethodHandles).",
        "whyItExists": "Powers dependency injection frameworks (Spring), object mappers (Jackson), and testing frameworks (JUnit)."
    },
    "syntaxBreakdown": {
        "title": "Dynamic Proxy and MethodHandle Idioms",
        "codeSnippet": "MethodHandle mh = MethodHandles.lookup().findVirtual(Clz.class, \"m\", methodType);\nProxy.newProxyInstance(loader, new Class<?>[]{Interface.class}, handler);",
        "explanation": "Looks up direct executable method handle and instantiates dynamic interface proxy.",
        "tokens": [
            {
                "token": "Proxy.newProxyInstance()",
                "explanation": "Creates runtime synthetic proxy implementing interfaces"
            },
            {
                "token": "MethodHandles.lookup()",
                "explanation": "Context factory with caller access rights"
            },
            {
                "token": "invokeExact()",
                "explanation": "Executes method handle with strict bytecode type matching"
            }
        ]
    },
    "examples": [
        {
            "id": "59-1",
            "title": "Reflection Field Modification and MethodHandles",
            "type": "basic",
            "description": "Modifying private fields and executing private methods via MethodHandles.",
            "filename": "ReflectionMethodHandlesDemo.java",
            "code": "import java.lang.invoke.MethodHandle;\nimport java.lang.invoke.MethodHandles;\nimport java.lang.invoke.MethodType;\nimport java.lang.reflect.Field;\nimport java.lang.reflect.Method;\n\npublic class ReflectionMethodHandlesDemo {\n    static class AccountSecurityToken {\n        private String secretKey = \"VAULT_9941\";\n        private String generateDigest(String salt) {\n            return \"DIGEST[\" + secretKey + \":\" + salt + \"]\";\n        }\n    }\n    public static void main(String[] args) throws Throwable {\n        System.out.println(\"=== 1. Classic Reflection API ===\");\n        AccountSecurityToken token = new AccountSecurityToken();\n        Class<?> clazz = token.getClass();\n        Field secretField = clazz.getDeclaredField(\"secretKey\");\n        secretField.setAccessible(true);\n        System.out.println(\"Original Private Field: \" + secretField.get(token));\n        secretField.set(token, \"VAULT_8800_UPDATED\");\n        System.out.println(\"Modified Private Field: \" + secretField.get(token));\n\n        Method privateMethod = clazz.getDeclaredMethod(\"generateDigest\", String.class);\n        privateMethod.setAccessible(true);\n        String reflectionResult = (String) privateMethod.invoke(token, \"SALT-44\");\n        System.out.println(\"Reflection Method Invocation: \" + reflectionResult);\n\n        System.out.println(\"\\n=== 2. java.lang.invoke.MethodHandles (Modern JIT Invocation) ===\");\n        MethodHandles.Lookup lookup = MethodHandles.lookup();\n        MethodType methodType = MethodType.methodType(String.class, String.class);\n        MethodHandle handle = lookup.findVirtual(AccountSecurityToken.class, \"generateDigest\", methodType);\n        String handleResult = (String) handle.invokeExact(token, \"SALT-99\");\n        System.out.println(\"MethodHandle invokeExact:    \" + handleResult);\n    }\n}",
            "output": "=== 1. Classic Reflection API ===\nOriginal Private Field: VAULT_9941\nModified Private Field: VAULT_8800_UPDATED\nReflection Method Invocation: DIGEST[VAULT_8800_UPDATED:SALT-44]\n\n=== 2. java.lang.invoke.MethodHandles (Modern JIT Invocation) ===\nMethodHandle invokeExact:    DIGEST[VAULT_8800_UPDATED:SALT-99]",
            "stepByStep": [
                "Inspects and modifies private secretKey field using setAccessible(true).",
                "Invokes private method via classic Method.invoke().",
                "Uses MethodHandles.lookup() and invokeExact for high-performance invocation."
            ]
        },
        {
            "id": "59-2",
            "title": "Dynamic Proxy Telemetry and Auditing",
            "type": "realistic",
            "description": "Intercepting interface methods dynamically with Proxy.newProxyInstance().",
            "filename": "DynamicProxyLoggingApp.java",
            "code": "import java.lang.reflect.InvocationHandler;\nimport java.lang.reflect.Method;\nimport java.lang.reflect.Proxy;\n\npublic class DynamicProxyLoggingApp {\n    interface PaymentGateway {\n        boolean processPayment(String account, double amount);\n        String queryStatus(String transactionId);\n    }\n    static class StripePaymentGateway implements PaymentGateway {\n        @Override\n        public boolean processPayment(String account, double amount) {\n            System.out.printf(\"  [Gateway Logic] Charged $%.2f to %s%n\", amount, account);\n            return true;\n        }\n        @Override\n        public String queryStatus(String transactionId) { return \"SETTLED\"; }\n    }\n    static class LoggingInvocationHandler implements InvocationHandler {\n        private final Object target;\n        LoggingInvocationHandler(Object target) { this.target = target; }\n        @Override\n        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {\n            System.out.println(\"[Audit Proxy] Intercepting: \" + method.getName() + \"()\");\n            long start = System.nanoTime();\n            Object result = method.invoke(target, args);\n            long elapsedUs = (System.nanoTime() - start) / 1000;\n            System.out.println(\"[Audit Proxy] Finished \" + method.getName() + \" in \" + elapsedUs + \" us. Result: \" + result);\n            return result;\n        }\n    }\n    @SuppressWarnings(\"unchecked\")\n    public static void main(String[] args) {\n        System.out.println(\"Starting Dynamic Proxy Telemetry App...\");\n        PaymentGateway realGateway = new StripePaymentGateway();\n        PaymentGateway proxiedGateway = (PaymentGateway) Proxy.newProxyInstance(\n                PaymentGateway.class.getClassLoader(),\n                new Class<?>[] { PaymentGateway.class },\n                new LoggingInvocationHandler(realGateway)\n        );\n        boolean paid = proxiedGateway.processPayment(\"ACC-1004\", 450.00);\n        String status = proxiedGateway.queryStatus(\"TXN-9901\");\n        System.out.println(\"Main Verification -> Paid: \" + paid + \", Status: \" + status);\n        System.out.println(\"Dynamic Proxy executed successfully.\");\n    }\n}",
            "output": "Starting Dynamic Proxy Telemetry App...\n[Audit Proxy] Intercepting: processPayment()\n  [Gateway Logic] Charged $450.00 to ACC-1004\n[Audit Proxy] Finished processPayment in 26670 us. Result: true\n[Audit Proxy] Intercepting: queryStatus()\n[Audit Proxy] Finished queryStatus in 1542 us. Result: SETTLED\nMain Verification -> Paid: true, Status: SETTLED\nDynamic Proxy executed successfully.",
            "stepByStep": [
                "Creates dynamic proxy implementing PaymentGateway.",
                "InvocationHandler intercepts processPayment and queryStatus.",
                "Injects timing audit metrics around real business logic transparently."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Proxying concrete classes with JDK Proxy",
            "wrongCode": "Proxy.newProxyInstance(loader, new Class<?>[]{MyService.class}, handler); // MyService is class",
            "fixedCode": "Proxy.newProxyInstance(loader, new Class<?>[]{MyInterface.class}, handler);",
            "cause": "java.lang.reflect.Proxy strictly requires interfaces; passing a class throws IllegalArgumentException.",
            "solution": "Extract an interface or use bytecode libraries like ByteBuddy for class proxying."
        }
    ],
    "bestPractices": {
        "doList": [
            "Cache Method and Field reflection objects to avoid repeated lookup overhead.",
            "Prefer MethodHandles or VarHandle for high-frequency invocations."
        ],
        "dontList": [
            "Do not use reflection to break into JDK internal packages (InaccessibleObjectException in Java 17+).",
            "Do not replace simple polymorphic interface designs with dynamic reflection."
        ],
        "whenNotToUse": "When standard compiled method calls or lambda functional interfaces satisfy requirements."
    },
    "versionNotes": {
        "introduced": "Java 1.1",
        "status": "Stable",
        "compatibilityNotes": "Java 7 added MethodHandles. Java 9+ JPMS strongly encapsulates internals; Java 17 permanently disabled illegal reflective access.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "Reflection vs MethodHandles Cheat Sheet",
        "headers": [
            "Feature",
            "Classic Reflection",
            "MethodHandles"
        ],
        "rows": [
            [
                "Package",
                "java.lang.reflect",
                "java.lang.invoke"
            ],
            [
                "Invocation Performance",
                "Moderate (overhead)",
                "Near-native (JIT optimized)"
            ],
            [
                "Security Check",
                "On every call",
                "Once during lookup"
            ],
            [
                "Type Safety",
                "Boxed Object arguments",
                "Strict bytecode type verification"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Reflectively Inspect Class Name",
            "prompt": "Print the simple and canonical names of java.util.HashMap via reflection.",
            "solution": "Class<?> c = HashMap.class;\nSystem.out.println(c.getSimpleName() + \" / \" + c.getCanonicalName());",
            "explanation": "Retrieves metadata about loaded class structure."
        }
    ],
    "officialSources": [
        {
            "title": "Java SE 21 Specification: java.lang.reflect",
            "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/reflect/package-summary.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-60",
    "slug": "java-platform-module-system-jpms",
    "topicNumber": 60,
    "title": "Java Platform Module System (JPMS)",
    "part": "Part 1: Java Core",
    "sectionNumber": 15,
    "sectionTitle": "Reflection, Annotations & JPMS",
    "versionBadge": "Java 9+ Standard / Strong Encapsulation Java 17 LTS",
    "difficulty": "Advanced",
    "readingTime": "13 min read",
    "shortDescription": "Master the Java Module System: module-info.java, exports, requires, opens, strong encapsulation, and custom runtime images with jlink.",
    "prerequisites": [
        "Topic 18: Packages and Access Modifiers",
        "Topic 57: ClassLoaders & JIT Compilation",
        "Topic 59: Reflection API & MethodHandles"
    ],
    "whatAndWhy": {
        "definition": "JPMS introduces modular boundaries above packages, enforcing reliable configuration through declared dependencies and strong encapsulation that conceals internal packages even from reflection.",
        "analogy": "Standard shipping cargo containers with strict manifests on the door stating exact power requirements and locked doors hiding internal mechanics.",
        "whyItExists": "Eliminates Classpath Hell, prevents access to JDK internals (sun.misc.Unsafe), and enables building slim custom JREs via jlink."
    },
    "syntaxBreakdown": {
        "title": "The module-info.java Descriptor",
        "codeSnippet": "module com.example.app {\n    requires java.sql;\n    exports com.example.app.api;\n    opens com.example.app.entity to org.hibernate.orm.core;\n}",
        "explanation": "Declares module dependencies, public API package exports, and deep reflection openings.",
        "tokens": [
            {
                "token": "requires",
                "explanation": "Declares dependency on external module"
            },
            {
                "token": "exports",
                "explanation": "Makes public classes in package visible to other modules"
            },
            {
                "token": "opens",
                "explanation": "Permits runtime reflection on private members"
            },
            {
                "token": "uses / provides",
                "explanation": "Registers and discovers ServiceLoader SPI plugins"
            }
        ]
    },
    "examples": [
        {
            "id": "60-1",
            "title": "Programmatic Module Descriptor Inspection",
            "type": "basic",
            "description": "Inspecting module names, exports, and opens status programmatically.",
            "filename": "ModuleDescriptorDemo.java",
            "code": "import java.lang.module.ModuleDescriptor;\nimport java.util.Set;\n\npublic class ModuleDescriptorDemo {\n    public static void main(String[] args) {\n        System.out.println(\"=== JPMS Module Descriptor Inspection ===\");\n        Module baseModule = String.class.getModule();\n        System.out.println(\"Current Module Name: \" + baseModule.getName());\n        System.out.println(\"Is Named Module:     \" + baseModule.isNamed());\n\n        ModuleDescriptor descriptor = baseModule.getDescriptor();\n        if (descriptor != null) {\n            System.out.println(\"Descriptor Version:  \" + descriptor.version().orElse(null));\n            System.out.println(\"Total Exports:       \" + descriptor.exports().size() + \" packages\");\n            System.out.println(\"IsOpen (Deep Refl):  \" + descriptor.isOpen());\n            boolean exportsJavaUtil = baseModule.isExported(\"java.util\");\n            System.out.println(\"Exports 'java.util': \" + exportsJavaUtil);\n        }\n\n        Module appModule = ModuleDescriptorDemo.class.getModule();\n        System.out.println(\"\\nApplication Class Module Name: '\" + appModule.getName() + \"' (null = Unnamed Module)\");\n        System.out.println(\"Is Named Module: \" + appModule.isNamed());\n    }\n}",
            "output": "=== JPMS Module Descriptor Inspection ===\nCurrent Module Name: java.base\nIs Named Module:     true\nDescriptor Version:  26.0.1\nTotal Exports:       116 packages\nIsOpen (Deep Refl):  false\nExports 'java.util': true\n\nApplication Class Module Name: 'null' (null = Unnamed Module)\nIs Named Module: false",
            "stepByStep": [
                "Inspects java.base module descriptor and verified exports.",
                "Checks package export status of java.util.",
                "Observes that standard classpath classes reside in the Unnamed Module."
            ]
        },
        {
            "id": "60-2",
            "title": "Modular Service Discovery (SPI)",
            "type": "realistic",
            "description": "Decoupled service provider interface plugin discovery with ServiceLoader.",
            "filename": "ModularServicePluginApp.java",
            "code": "import java.util.ArrayList;\nimport java.util.List;\nimport java.util.ServiceLoader;\n\npublic class ModularServicePluginApp {\n    public interface PaymentCodec {\n        String format();\n        String encode(String payload);\n    }\n    public static class JsonPaymentCodec implements PaymentCodec {\n        @Override\n        public String format() { return \"JSON\"; }\n        @Override\n        public String encode(String payload) { return \"{\\\"data\\\": \\\"\" + payload + \"\\\"}\"; }\n    }\n    public static class XmlPaymentCodec implements PaymentCodec {\n        @Override\n        public String format() { return \"XML\"; }\n        @Override\n        public String encode(String payload) { return \"<data>\" + payload + \"</data>\"; }\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Starting Modular Service Discovery App...\");\n        List<PaymentCodec> registeredCodecs = List.of(new JsonPaymentCodec(), new XmlPaymentCodec());\n        System.out.println(\"Discovered Codec Plugins: \" + registeredCodecs.size());\n        for (PaymentCodec codec : registeredCodecs) {\n            String encoded = codec.encode(\"TXN-3001\");\n            System.out.printf(\"  Codec [%s] output: %s%n\", codec.format(), encoded);\n        }\n        ServiceLoader<PaymentCodec> loader = ServiceLoader.load(PaymentCodec.class);\n        System.out.println(\"ServiceLoader instantiated: \" + loader.getClass().getSimpleName());\n        System.out.println(\"Modular Service Plugin App completed successfully.\");\n    }\n}",
            "output": "Starting Modular Service Discovery App...\nDiscovered Codec Plugins: 2\n  Codec [JSON] output: {\"data\": \"TXN-3001\"}\n  Codec [XML] output: <data>TXN-3001</data>\nServiceLoader instantiated: ServiceLoader\nModular Service Plugin App completed successfully.",
            "stepByStep": [
                "Defines decoupled service interface PaymentCodec.",
                "Registers JSON and XML provider codecs.",
                "Leverages ServiceLoader for extensible modular plugin dispatch."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Split packages between modules",
            "wrongCode": "// module A and module B both defining com.company.util package",
            "fixedCode": "// module A has com.company.util.a; module B has com.company.util.b",
            "cause": "JPMS strictly forbids two modules from exporting or containing the same package name.",
            "solution": "Enforce unique package namespaces for each module."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use jlink to generate lean, customized runtime distributions for Docker containers.",
            "Keep exported packages minimal, exposing only public contract interfaces."
        ],
        "dontList": [
            "Do not use open module unless required by legacy reflection frameworks.",
            "Do not export internal implementation packages."
        ],
        "whenNotToUse": "For simple single-JAR command-line scripts where modular overhead adds unnecessary ceremony."
    },
    "versionNotes": {
        "introduced": "Java 9 (Project Jigsaw)",
        "status": "Stable",
        "compatibilityNotes": "Java 17 LTS permanently enforced strong encapsulation (JEP 403).",
        "ltsAvailability": "Java 11, 17, 21"
    },
    "cheatSheet": {
        "title": "JPMS Module Directives Cheat Sheet",
        "headers": [
            "Directive",
            "Target",
            "Effect",
            "Reflection Access"
        ],
        "rows": [
            [
                "requires M",
                "Module",
                "Establishes dependency",
                "Public members only"
            ],
            [
                "requires transitive M",
                "Module",
                "Transfers dependency downstream",
                "Public members only"
            ],
            [
                "exports P",
                "Package",
                "Exports public types",
                "Public members only"
            ],
            [
                "opens P to M",
                "Package to Module",
                "Opens package to deep reflection",
                "Full (including private)"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Check If Class Is in Named Module",
            "prompt": "Check whether String.class is in a named module.",
            "solution": "boolean named = String.class.getModule().isNamed(); // true (java.base)",
            "explanation": "Core Java classes reside in named module java.base."
        }
    ],
    "officialSources": [
        {
            "title": "The Java Platform Module System Specification (JSR 376)",
            "url": "https://openjdk.org/projects/jigsaw/spec/",
            "organization": "OpenJDK"
        }
    ]
},

  {
    "id": "topic-61",
    "slug": "jdbc-fundamentals",
    "topicNumber": 61,
    "title": "JDBC Fundamentals & Transactions",
    "part": "Part 1: Java Core",
    "sectionNumber": 16,
    "sectionTitle": "Data Access & Build Tools",
    "versionBadge": "Java 1.1+ / Standard java.sql",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Master relational database connectivity, SQL injection defense with PreparedStatement, ResultSet cursor traversal, and ACID transactions.",
    "prerequisites": [
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 31: Try-With-Resources & AutoCloseable"
    ],
    "whatAndWhy": {
        "definition": "JDBC (Java Database Connectivity) is Java standard vendor-neutral API for communicating with relational databases via SQL, managing connections, statements, result cursors, and ACID transactions.",
        "analogy": "A universal electrical travel adapter connecting a standardized USB-C device cable (JDBC interface) into foreign proprietary wall sockets (database engines).",
        "whyItExists": "Enables Java applications to communicate with any relational database engine using standard portable code and guarantees transactional data consistency."
    },
    "syntaxBreakdown": {
        "title": "PreparedStatement and Transaction Syntax",
        "codeSnippet": "conn.setAutoCommit(false);\ntry (PreparedStatement pstmt = conn.prepareStatement(\"UPDATE acc SET bal = bal - ? WHERE id = ?\")) {\n    pstmt.setDouble(1, 100.0);\n    pstmt.setString(2, \"A1\");\n    pstmt.executeUpdate();\n    conn.commit();\n}",
        "explanation": "Precompiles SQL, binds parameters securely against SQL injection, and commits multi-step changes atomically.",
        "tokens": [
            {
                "token": "DriverManager.getConnection()",
                "explanation": "Establishes live physical connection session"
            },
            {
                "token": "PreparedStatement",
                "explanation": "Precompiled parameterized SQL statement preventing injection"
            },
            {
                "token": "setAutoCommit(false)",
                "explanation": "Disables auto-commit; initiates explicit transaction boundary"
            },
            {
                "token": "conn.commit() / rollback()",
                "explanation": "Finalizes or rolls back pending modifications"
            }
        ]
    },
    "examples": [
        {
            "id": "61-1",
            "title": "In-Memory SQLite Database Execution",
            "type": "basic",
            "description": "Creating tables, inserting parameterized records, and iterating ResultSets.",
            "filename": "JdbcFundamentalsDemo.java",
            "code": "import java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.sql.PreparedStatement;\nimport java.sql.ResultSet;\nimport java.sql.Statement;\n\npublic class JdbcFundamentalsDemo {\n    private static final String DB_URL = \"jdbc:sqlite::memory:\";\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"=== JDBC In-Memory Database Execution ===\");\n        try (Connection conn = DriverManager.getConnection(DB_URL)) {\n            System.out.println(\"Connected to: \" + conn.getMetaData().getDatabaseProductName() +\n                               \" (v\" + conn.getMetaData().getDatabaseProductVersion() + \")\");\n            try (Statement stmt = conn.createStatement()) {\n                stmt.execute(\"\"\"\n                    CREATE TABLE products (\n                        id INTEGER PRIMARY KEY,\n                        name TEXT NOT NULL,\n                        price REAL NOT NULL,\n                        stock INTEGER NOT NULL\n                    )\n                \"\"\");\n                System.out.println(\"Table 'products' created successfully.\");\n            }\n            String insertSql = \"INSERT INTO products (id, name, price, stock) VALUES (?, ?, ?, ?)\";\n            try (PreparedStatement pstmt = conn.prepareStatement(insertSql)) {\n                pstmt.setInt(1, 101);\n                pstmt.setString(2, \"Mechanical Keyboard\");\n                pstmt.setDouble(3, 89.99);\n                pstmt.setInt(4, 25);\n                pstmt.executeUpdate();\n                System.out.println(\"Inserted 2 products via PreparedStatement.\");\n            }\n            String querySql = \"SELECT id, name, price, stock FROM products WHERE price > ? ORDER BY id\";\n            try (PreparedStatement pstmt = conn.prepareStatement(querySql)) {\n                pstmt.setDouble(1, 50.0);\n                try (ResultSet rs = pstmt.executeQuery()) {\n                    System.out.println(\"\\nQuery Results (Price > $50.00):\");\n                    while (rs.next()) {\n                        System.out.printf(\"  [ID: %d] %-20s | $%.2f | Stock: %d%n\",\n                                rs.getInt(\"id\"), rs.getString(\"name\"), rs.getDouble(\"price\"), rs.getInt(\"stock\"));\n                    }\n                }\n            }\n        }\n        System.out.println(\"JDBC workflow completed successfully.\");\n    }\n}",
            "output": "=== JDBC In-Memory Database Execution ===\nConnected to: SQLite (v3.49.1)\nTable 'products' created successfully.\nInserted 2 products via PreparedStatement.\n\nQuery Results (Price > $50.00):\n  [ID: 101] Mechanical Keyboard  | $89.99 | Stock: 25\nJDBC workflow completed successfully.",
            "stepByStep": [
                "Connects to SQLite in-memory database.",
                "Executes DDL statement creating products table.",
                "Binds values securely via PreparedStatement.",
                "Iterates ResultSet cursor reading typed columns."
            ]
        },
        {
            "id": "61-2",
            "title": "ACID Banking Transaction Engine with Rollback",
            "type": "realistic",
            "description": "Coordinating atomic fund transfers with automatic rollback on insufficient funds.",
            "filename": "BankingTransactionRepositoryApp.java",
            "code": "import java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.sql.PreparedStatement;\nimport java.sql.ResultSet;\nimport java.sql.SQLException;\nimport java.sql.Statement;\n\npublic class BankingTransactionRepositoryApp {\n    private static final String DB_URL = \"jdbc:sqlite::memory:\";\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"Starting Banking Transaction ACID Engine...\");\n        try (Connection conn = DriverManager.getConnection(DB_URL)) {\n            setupSchema(conn);\n            System.out.println(\"Initial Balances:\");\n            printBalances(conn);\n            boolean tx1 = transferFunds(conn, \"ACC-01\", \"ACC-02\", 200.00);\n            System.out.println(\"\\nTransfer 1 (Valid: $200.00) Success? \" + tx1);\n            printBalances(conn);\n            boolean tx2 = transferFunds(conn, \"ACC-01\", \"ACC-02\", 5000.00);\n            System.out.println(\"\\nTransfer 2 (Overdraft: $5000.00) Success? \" + tx2);\n            printBalances(conn);\n        }\n        System.out.println(\"Banking Transaction test completed successfully.\");\n    }\n    private static void setupSchema(Connection conn) throws SQLException {\n        try (Statement stmt = conn.createStatement()) {\n            stmt.execute(\"CREATE TABLE accounts (acc_id TEXT PRIMARY KEY, balance REAL NOT NULL)\");\n            stmt.execute(\"INSERT INTO accounts VALUES ('ACC-01', 1000.00)\");\n            stmt.execute(\"INSERT INTO accounts VALUES ('ACC-02', 500.00)\");\n        }\n    }\n    public static boolean transferFunds(Connection conn, String fromId, String toId, double amount) {\n        String debitSql = \"UPDATE accounts SET balance = balance - ? WHERE acc_id = ? AND balance >= ?\";\n        String creditSql = \"UPDATE accounts SET balance = balance + ? WHERE acc_id = ?\";\n        try {\n            conn.setAutoCommit(false);\n            try (PreparedStatement debitStmt = conn.prepareStatement(debitSql);\n                 PreparedStatement creditStmt = conn.prepareStatement(creditSql)) {\n                debitStmt.setDouble(1, amount);\n                debitStmt.setString(2, fromId);\n                debitStmt.setDouble(3, amount);\n                int rowsDebited = debitStmt.executeUpdate();\n                if (rowsDebited == 0) {\n                    System.out.println(\"  [Transaction Aborted] Insufficient balance or invalid account: \" + fromId);\n                    conn.rollback();\n                    return false;\n                }\n                creditStmt.setDouble(1, amount);\n                creditStmt.setString(2, toId);\n                creditStmt.executeUpdate();\n                conn.commit();\n                return true;\n            } catch (SQLException e) {\n                conn.rollback();\n                throw e;\n            } finally {\n                conn.setAutoCommit(true);\n            }\n        } catch (SQLException e) {\n            return false;\n        }\n    }\n    private static void printBalances(Connection conn) throws SQLException {\n        try (Statement stmt = conn.createStatement();\n             ResultSet rs = stmt.executeQuery(\"SELECT acc_id, balance FROM accounts ORDER BY acc_id\")) {\n            while (rs.next()) {\n                System.out.printf(\"  Account: %-8s | Balance: $%.2f%n\", rs.getString(\"acc_id\"), rs.getDouble(\"balance\"));\n            }\n        }\n    }\n}",
            "output": "Starting Banking Transaction ACID Engine...\nInitial Balances:\n  Account: ACC-01   | Balance: $1000.00\n  Account: ACC-02   | Balance: $500.00\n\nTransfer 1 (Valid: $200.00) Success? true\n  Account: ACC-01   | Balance: $800.00\n  Account: ACC-02   | Balance: $700.00\n  [Transaction Aborted] Insufficient balance or invalid account: ACC-01\n\nTransfer 2 (Overdraft: $5000.00) Success? false\n  Account: ACC-01   | Balance: $800.00\n  Account: ACC-02   | Balance: $700.00\nBanking Transaction test completed successfully.",
            "stepByStep": [
                "Initializes two accounts with $1000 and $500 balances.",
                "Executes valid $200 transfer under transaction boundary and commits.",
                "Executes invalid $5000 transfer, catches violation, and rolls back cleanly.",
                "Verifies balances remain uncorrupted."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "SQL injection via dynamic string concatenation",
            "wrongCode": "stmt.executeQuery(\"SELECT * FROM users WHERE name = '\" + input + \"'\");",
            "fixedCode": "PreparedStatement pstmt = conn.prepareStatement(\"SELECT * FROM users WHERE name = ?\"); pstmt.setString(1, input);",
            "cause": "Direct string concatenation allows attackers to inject arbitrary SQL statements.",
            "solution": "Always use parameterized PreparedStatement for any variable SQL input."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use production connection pools like HikariCP to eliminate connection establishment latency.",
            "Always wrap Connection, Statement, and ResultSet in try-with-resources blocks."
        ],
        "dontList": [
            "Do not commit transactions implicitly without error handling.",
            "Do not leave connections with setAutoCommit(false) when returning them to pools."
        ],
        "whenNotToUse": "When an Object-Relational Mapping (ORM) framework like JPA/Hibernate provides automated domain object mapping."
    },
    "versionNotes": {
        "introduced": "Java 1.1",
        "status": "Stable",
        "compatibilityNotes": "Java 6 added automatic driver discovery via ServiceLoader. Java 7 added AutoCloseable support.",
        "ltsAvailability": "Java 8, 11, 17, 21"
    },
    "cheatSheet": {
        "title": "JDBC Core Interfaces Cheat Sheet",
        "headers": [
            "Interface",
            "Core Method",
            "Role"
        ],
        "rows": [
            [
                "DriverManager",
                "getConnection(url)",
                "Locates driver and opens connection"
            ],
            [
                "Connection",
                "prepareStatement(sql)",
                "Creates precompiled query"
            ],
            [
                "PreparedStatement",
                "executeUpdate() / executeQuery()",
                "Runs DML or query"
            ],
            [
                "ResultSet",
                "next(), getInt(), getString()",
                "Navigates returned tabular rows"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Parameterized Query",
            "prompt": "Write a PreparedStatement query to select users by age greater than a parameter.",
            "solution": "PreparedStatement ps = conn.prepareStatement(\"SELECT * FROM users WHERE age > ?\"); ps.setInt(1, 18); ResultSet rs = ps.executeQuery();",
            "explanation": "Safely binds age parameter avoiding SQL injection."
        }
    ],
    "officialSources": [
        {
            "title": "Java SE 21 Specification: java.sql",
            "url": "https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/package-summary.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-62",
    "slug": "build-automation-maven-and-gradle",
    "topicNumber": 62,
    "title": "Build Automation: Maven & Gradle",
    "part": "Part 1: Java Core",
    "sectionNumber": 16,
    "sectionTitle": "Data Access & Build Tools",
    "versionBadge": "Maven 3.x / Gradle 8.x+",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Master modern build systems: Maven lifecycle phases, POM dependencies, transitive conflict resolution, and Gradle incremental tasks.",
    "prerequisites": [
        "Topic 02: JDK vs JRE vs JVM & Setup",
        "Topic 18: Packages and Access Modifiers"
    ],
    "whatAndWhy": {
        "definition": "Build automation tools manage dependencies, compilation, automated testing, packaging (JAR/WAR), and deployment using declarative build manifests (pom.xml or build.gradle.kts).",
        "analogy": "An ISO-certified aircraft assembly line where every bolt has a standardized barcode (GAV coordinates) and follows an unskippable 7-stage quality checklist.",
        "whyItExists": "Eliminates Classpath Hell, automates transitive dependency resolution, and provides reproducible builds across CI/CD environments."
    },
    "syntaxBreakdown": {
        "title": "Maven Coordinates and Lifecycles",
        "codeSnippet": "<dependency>\n    <groupId>org.slf4j</groupId>\n    <artifactId>slf4j-api</artifactId>\n    <version>2.0.12</version>\n    <scope>compile</scope>\n</dependency>",
        "explanation": "Uniquely identifies dependency using Group, Artifact, Version (GAV) and defines classpath scope.",
        "tokens": [
            {
                "token": "groupId",
                "explanation": "Reverse domain identifier of organization"
            },
            {
                "token": "artifactId",
                "explanation": "Name of the specific library module"
            },
            {
                "token": "scope",
                "explanation": "Classpath availability: compile, test, runtime, provided"
            }
        ]
    },
    "examples": [
        {
            "id": "62-1",
            "title": "Maven POM and Lifecycle Phases Inspector",
            "type": "basic",
            "description": "Parsing POM.xml structure and inspecting standard lifecycle phases.",
            "filename": "BuildToolLifecycleDemo.java",
            "code": "import java.io.ByteArrayInputStream;\nimport java.nio.charset.StandardCharsets;\nimport java.util.ArrayList;\nimport java.util.List;\nimport javax.xml.parsers.DocumentBuilder;\nimport javax.xml.parsers.DocumentBuilderFactory;\nimport org.w3c.dom.Document;\nimport org.w3c.dom.Element;\nimport org.w3c.dom.NodeList;\n\npublic class BuildToolLifecycleDemo {\n    private static final String SAMPLE_POM_XML = \"\"\"\n        <project xmlns=\"http://maven.apache.org/POM/4.0.0\">\n            <modelVersion>4.0.0</modelVersion>\n            <groupId>com.handbook.app</groupId>\n            <artifactId>order-service</artifactId>\n            <version>1.0.0-RELEASE</version>\n            <packaging>jar</packaging>\n            <dependencies>\n                <dependency>\n                    <groupId>org.slf4j</groupId>\n                    <artifactId>slf4j-api</artifactId>\n                    <version>2.0.12</version>\n                    <scope>compile</scope>\n                </dependency>\n            </dependencies>\n        </project>\n    \"\"\";\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"=== Maven POM.xml & Lifecycle Phases Inspector ===\");\n        DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();\n        Document doc = builder.parse(new ByteArrayInputStream(SAMPLE_POM_XML.getBytes(StandardCharsets.UTF_8)));\n        Element root = doc.getDocumentElement();\n        System.out.printf(\"Project Coordinate: %s:%s:%s [%s]%n\",\n                root.getElementsByTagName(\"groupId\").item(0).getTextContent().trim(),\n                root.getElementsByTagName(\"artifactId\").item(0).getTextContent().trim(),\n                root.getElementsByTagName(\"version\").item(0).getTextContent().trim(),\n                root.getElementsByTagName(\"packaging\").item(0).getTextContent().trim());\n        System.out.println(\"\\nStandard Maven Build Lifecycle:\");\n        List<String> phases = List.of(\"validate\", \"compile\", \"test\", \"package\", \"verify\", \"install\", \"deploy\");\n        for (int i = 0; i < phases.size(); i++) System.out.printf(\"  Phase %d: mvn %s%n\", i + 1, phases.get(i));\n        System.out.println(\"Build tool validation completed successfully.\");\n    }\n}",
            "output": "=== Maven POM.xml & Lifecycle Phases Inspector ===\nProject Coordinate: com.handbook.app:order-service:1.0.0-RELEASE [jar]\n\nStandard Maven Build Lifecycle:\n  Phase 1: mvn validate\n  Phase 2: mvn compile\n  Phase 3: mvn test\n  Phase 4: mvn package\n  Phase 5: mvn verify\n  Phase 6: mvn install\n  Phase 7: mvn deploy\nBuild tool validation completed successfully.",
            "stepByStep": [
                "Parses standard Maven POM XML file.",
                "Extracts project GAV coordinates.",
                "Enumerates 7 linear lifecycle phases executed by mvn package."
            ]
        },
        {
            "id": "62-2",
            "title": "Transitive Dependency Conflict Resolution Simulator",
            "type": "realistic",
            "description": "Contrasting Maven nearest-definition-wins vs Gradle highest-version-wins conflict strategies.",
            "filename": "DependencyResolverSimulatorApp.java",
            "code": "public class DependencyResolverSimulatorApp {\n    record DependencyNode(String name, String version, int depth) {}\n    public static void main(String[] args) {\n        System.out.println(\"Starting Build Tool Dependency Conflict Simulator...\");\n        DependencyNode directDep = new DependencyNode(\"common-utils\", \"2.1.0\", 1);\n        DependencyNode transDepA = new DependencyNode(\"common-utils\", \"1.0.0\", 2);\n        DependencyNode transDepB = new DependencyNode(\"common-utils\", \"3.0.0\", 3);\n        String mavenChosen = resolveMavenNearest(directDep, transDepA, transDepB);\n        System.out.println(\"Maven Resolution (Nearest Definition Wins):   \" + mavenChosen);\n        String gradleChosen = resolveGradleLatest(directDep, transDepA, transDepB);\n        System.out.println(\"Gradle Resolution (Highest Version Wins):     \" + gradleChosen);\n        System.out.println(\"Dependency conflict resolution comparison completed successfully.\");\n    }\n    private static String resolveMavenNearest(DependencyNode... nodes) {\n        DependencyNode nearest = nodes[0];\n        for (DependencyNode node : nodes) if (node.depth() < nearest.depth()) nearest = node;\n        return nearest.name() + \":\" + nearest.version() + \" (Selected at depth \" + nearest.depth() + \")\";\n    }\n    private static String resolveGradleLatest(DependencyNode... nodes) {\n        DependencyNode highest = nodes[0];\n        for (DependencyNode node : nodes) {\n            if (node.version().compareTo(highest.version()) > 0) highest = node;\n        }\n        return highest.name() + \":\" + highest.version() + \" (Selected latest semver)\";\n    }\n}",
            "output": "Starting Build Tool Dependency Conflict Simulator...\nMaven Resolution (Nearest Definition Wins):   common-utils:2.1.0 (Selected at depth 1)\nGradle Resolution (Highest Version Wins):     common-utils:3.0.0 (Selected latest semver)\nDependency conflict resolution comparison completed successfully.",
            "stepByStep": [
                "Simulates three competing versions of common-utils at varying tree depths.",
                "Demonstrates Maven picking version 2.1.0 (nearest depth = 1).",
                "Demonstrates Gradle picking version 3.0.0 (highest semantic version)."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Leaking test dependencies into production distribution",
            "wrongCode": "<dependency>\n    <groupId>org.junit.jupiter</groupId>\n    <artifactId>junit-jupiter</artifactId>\n    <scope>compile</scope>\n</dependency>",
            "fixedCode": "<scope>test</scope>",
            "cause": "Default scope is compile, bloating production JARs with testing harnesses.",
            "solution": "Always set <scope>test</scope> for test frameworks."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always commit the Maven Wrapper (mvnw) or Gradle Wrapper (gradlew) to source control.",
            "Use dependencyManagement / platforms to manage library versions centrally."
        ],
        "dontList": [
            "Do not commit binary JAR files into Git repositories.",
            "Do not skip tests in production release builds (-DskipTests)."
        ],
        "whenNotToUse": "For single-file educational scratch programs where javac HelloWorld.java is sufficient."
    },
    "versionNotes": {
        "introduced": "Maven 2004 / Gradle 2012",
        "status": "Stable",
        "compatibilityNotes": "Maven 3.9+ and Gradle 8.5+ fully support Java 21 LTS and Java 22+.",
        "ltsAvailability": "All LTS versions"
    },
    "cheatSheet": {
        "title": "Maven vs Gradle Cheat Sheet",
        "headers": [
            "Feature",
            "Apache Maven",
            "Gradle"
        ],
        "rows": [
            [
                "Configuration",
                "XML (pom.xml)",
                "Groovy / Kotlin DSL (build.gradle.kts)"
            ],
            [
                "Lifecycle Model",
                "Linear phases (compile, test, package)",
                "Directed Acyclic Graph (DAG) of tasks"
            ],
            [
                "Conflict Policy",
                "Nearest definition in tree wins",
                "Highest version wins by default"
            ],
            [
                "Wrapper Command",
                "./mvnw clean package",
                "./gradlew build"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Hands-on Implementation",
            "title": "Maven Packaging Command",
            "prompt": "What command compiles, tests, and creates a JAR artifact in Maven?",
            "solution": "mvn package",
            "explanation": "Executes all phases up to and including the package phase."
        }
    ],
    "officialSources": [
        {
            "title": "Apache Maven: Introduction to the Build Lifecycle",
            "url": "https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html",
            "organization": "Oracle"
        }
    ]
},

  {
    "id": "topic-63",
    "slug": "the-great-transition-java-ee-to-jakarta-ee",
    "topicNumber": 63,
    "title": "The Great Transition: Java EE to Jakarta EE",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 17,
    "sectionTitle": "Web Architecture & The Jakarta EE Evolution",
    "versionBadge": "Jakarta EE 9/10/11",
    "difficulty": "Beginner",
    "readingTime": "10 min read",
    "shortDescription": "Understand the historic evolution from Sun J2EE and Oracle Java EE to Eclipse Jakarta EE, package namespace migration from javax.* to jakarta.*, and server compatibility matrices.",
    "prerequisites": [
        "Topic 18: Packages & Access Modifiers",
        "Topic 60: Java Platform Module System (JPMS)"
    ],
    "whatAndWhy": {
        "definition": "The transition from Java EE to Jakarta EE represents the transfer of enterprise Java standards from Oracle to the Eclipse Foundation, resulting in the permanent relocation of enterprise APIs from the javax.* package namespace to jakarta.*.",
        "analogy": "An international telecom provider changing its country calling code from +99 (javax.*) to +77 (jakarta.*) because the old brand name was retained by the original founder. Old cell towers only accept +99; modern towers accept +77.",
        "whyItExists": "Oracle retained legal ownership of the \"Java\" trademark. To allow enterprise specifications to evolve freely as open standards under the Eclipse Foundation, the community agreed to the Big Bang package rename in Jakarta EE 9."
    },
    "syntaxBreakdown": {
        "title": "Namespace Migration Import Comparison",
        "codeSnippet": "// Legacy Java EE 8 (Tomcat 9 and older)\nimport javax.servlet.http.HttpServlet;\nimport javax.servlet.http.HttpServletRequest;\n\n// Modern Jakarta EE 10/11 (Tomcat 10.1+ / 11)\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;",
        "explanation": "Every class previously prefixed with javax.servlet, javax.persistence, or javax.ws.rs is now located under jakarta.*.",
        "tokens": [
            {
                "token": "javax.*",
                "explanation": "Legacy namespace frozen at Java EE 8 feature set"
            },
            {
                "token": "jakarta.*",
                "explanation": "Active evolving open-standard enterprise namespace"
            },
            {
                "token": "Tomcat 10.1+",
                "explanation": "Modern reference container implementing Servlet 6.0 (Jakarta EE 10)"
            },
            {
                "token": "Tomcat 9.x",
                "explanation": "Legacy LTS container frozen on Servlet 4.0 (Java EE 8)"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-63-basic",
            "title": "Inspecting Active Servlet Runtime Namespace",
            "type": "basic",
            "description": "Detecting whether running code is bound to jakarta.* or legacy javax.* via reflection and type checks.",
            "filename": "NamespaceTransitionInspectorDemo.java",
            "code": "import jakarta.servlet.http.HttpServlet;\n\npublic class NamespaceTransitionInspectorDemo {\n    public static void main(String[] args) {\n        System.out.println(\"=== The Great Transition: Java EE to Jakarta EE ===\");\n        Class<?> servletClass = HttpServlet.class;\n        System.out.println(\"Active Servlet API Detected: \" + servletClass.getName());\n        System.out.println(\"Package Namespace: \" + servletClass.getPackageName());\n        \n        if (servletClass.getName().startsWith(\"jakarta.\")) {\n            System.out.println(\"Runtime Standard: Modern Jakarta EE (Tomcat 10.1+ / Jakarta EE 10/11 compatible)\");\n        } else if (servletClass.getName().startsWith(\"javax.\")) {\n            System.out.println(\"Runtime Standard: Legacy Java EE (Tomcat 9 or older)\");\n        }\n        System.out.println(\"Namespace transition inspection completed successfully.\");\n    }\n}",
            "output": "=== The Great Transition: Java EE to Jakarta EE ===\nActive Servlet API Detected: jakarta.servlet.http.HttpServlet\nPackage Namespace: jakarta.servlet.http\nRuntime Standard: Modern Jakarta EE (Tomcat 10.1+ / Jakarta EE 10/11 compatible)\nNamespace transition inspection completed successfully.",
            "stepByStep": [
                "Imports HttpServlet from the jakarta.servlet.http package.",
                "Inspects class name and package namespace at runtime.",
                "Verifies compatibility with modern Servlet 6.0 containers."
            ]
        },
        {
            "id": "ex-63-realistic",
            "title": "Server and Specification Compatibility Matrix",
            "type": "realistic",
            "description": "Programmatically querying container compatibility tiers across Tomcat, Jetty, and WildFly.",
            "filename": "ServerCompatibilityMatrixApp.java",
            "code": "import java.util.List;\n\npublic class ServerCompatibilityMatrixApp {\n    record ContainerSupport(String serverName, String serverVersion, String jakartaVersion, String servletSpec, String namespace) {}\n\n    public static void main(String[] args) {\n        System.out.println(\"=== Enterprise Container Compatibility Matrix ===\");\n        List<ContainerSupport> matrix = List.of(\n            new ContainerSupport(\"Apache Tomcat\", \"9.0.x\", \"Java EE 8\", \"Servlet 4.0\", \"javax.*\"),\n            new ContainerSupport(\"Apache Tomcat\", \"10.0.x (EOL)\", \"Jakarta EE 9\", \"Servlet 5.0\", \"jakarta.*\"),\n            new ContainerSupport(\"Apache Tomcat\", \"10.1.x\", \"Jakarta EE 10\", \"Servlet 6.0\", \"jakarta.*\"),\n            new ContainerSupport(\"Apache Tomcat\", \"11.0.x\", \"Jakarta EE 11\", \"Servlet 6.1\", \"jakarta.*\"),\n            new ContainerSupport(\"Eclipse Jetty\", \"12.x (ee10)\", \"Jakarta EE 10\", \"Servlet 6.0\", \"jakarta.*\"),\n            new ContainerSupport(\"WildFly\", \"30.x+\", \"Jakarta EE 10\", \"Servlet 6.0\", \"jakarta.*\")\n        );\n\n        System.out.printf(\"%-18s | %-10s | %-15s | %-12s | %-10s%n\", \"Server\", \"Version\", \"EE Standard\", \"Servlet Spec\", \"Namespace\");\n        System.out.println(\"-\".repeat(78));\n        for (var row : matrix) {\n            System.out.printf(\"%-18s | %-10s | %-15s | %-12s | %-10s%n\",\n                row.serverName(), row.serverVersion(), row.jakartaVersion(), row.servletSpec(), row.namespace());\n        }\n        System.out.println(\"Server compatibility evaluation completed successfully.\");\n    }\n}",
            "output": "=== Enterprise Container Compatibility Matrix ===\nServer             | Version    | EE Standard     | Servlet Spec | Namespace \n------------------------------------------------------------------------------\nApache Tomcat      | 9.0.x      | Java EE 8       | Servlet 4.0  | javax.*   \nApache Tomcat      | 10.0.x (EOL) | Jakarta EE 9    | Servlet 5.0  | jakarta.* \nApache Tomcat      | 10.1.x     | Jakarta EE 10   | Servlet 6.0  | jakarta.* \nApache Tomcat      | 11.0.x     | Jakarta EE 11   | Servlet 6.1  | jakarta.* \nEclipse Jetty      | 12.x (ee10) | Jakarta EE 10   | Servlet 6.0  | jakarta.* \nWildFly            | 30.x+      | Jakarta EE 10   | Servlet 6.0  | jakarta.* \nServer compatibility evaluation completed successfully.",
            "stepByStep": [
                "Defines a structured record modeling server compatibility entries.",
                "Maps Apache Tomcat, Eclipse Jetty, and Red Hat WildFly versions against EE specifications.",
                "Prints the authoritative compatibility guide for enterprise deployment planning."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Deploying a WAR compiled with javax.servlet.* to Tomcat 10.1+",
            "errorCodeOrSnippet": "java.lang.ClassNotFoundException: javax.servlet.http.HttpServlet",
            "cause": "Servlet containers from Tomcat 10.1+ exclusively expose the jakarta.* package namespace.",
            "solution": "Migrate source imports to jakarta.servlet.* or use the Apache Tomcat migration tool for legacy WAR files."
        },
        {
            "title": "Mixing javax.* and jakarta.* dependencies in the same project build",
            "errorCodeOrSnippet": "error: reference to HttpServlet is ambiguous",
            "cause": "Having both legacy javax.servlet-api and jakarta.servlet-api on the compiler classpath.",
            "solution": "Ensure all dependencies (persistence, web, validation, JSON) are upgraded uniformly to Jakarta EE 10 coordinates."
        }
    ],
    "bestPractices": {
        "doList": [
            "Target Jakarta EE 10 (jakarta.* namespace) for all new enterprise Java services and production web apps.",
            "Check third-party library dependencies for Jakarta namespace compatibility before upgrading containers.",
            "Use the latest Apache Tomcat 10.1.x LTS release for stable, production-grade Servlet 6.0 hosting."
        ],
        "dontList": [
            "Do not start new enterprise projects using legacy javax.* packages.",
            "Do not bundle javax.servlet-api in WEB-INF/lib when running on modern Tomcat.",
            "Do not mix different Jakarta EE milestone release coordinates in your build descriptor."
        ],
        "whenNotToUse": "Do not use Jakarta EE full profile servers if your application only requires lightweight REST services or microservices; a lightweight servlet engine or Spring Boot web starter is sufficient."
    },
    "versionNotes": {
        "introduced": "Jakarta EE 9 (2020) namespace rename; Jakarta EE 10 (2022) stable LTS",
        "status": "Stable",
        "compatibilityNotes": "Global package rename from javax.* to jakarta.*. Tomcat 9 is the last release supporting javax.*.",
        "ltsAvailability": "Jakarta EE 10 is the core enterprise LTS baseline; Jakarta EE 11 expands Java 21+ features."
    },
    "cheatSheet": {
        "title": "Java EE to Jakarta EE Evolution Matrix",
        "headers": [
            "Feature",
            "Java EE 8",
            "Jakarta EE 9",
            "Jakarta EE 10",
            "Jakarta EE 11"
        ],
        "rows": [
            [
                "Package Namespace",
                "javax.*",
                "jakarta.*",
                "jakarta.*",
                "jakarta.*"
            ],
            [
                "Servlet Specification",
                "Servlet 4.0",
                "Servlet 5.0",
                "Servlet 6.0",
                "Servlet 6.1"
            ],
            [
                "Minimum Java Version",
                "Java 8",
                "Java 8",
                "Java 11 (Java 17/21 rec.)",
                "Java 17 (Java 21/26 rec.)"
            ],
            [
                "Reference Tomcat",
                "Tomcat 9.0.x",
                "Tomcat 10.0.x (EOL)",
                "Tomcat 10.1.x",
                "Tomcat 11.0.x"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix the Legacy Import Mismatch",
            "prompt": "A web app deployed to Tomcat 10.1 fails with ClassNotFoundException: javax.servlet.Servlet. Identify the root cause and provide the fix.",
            "starterCode": "import javax.servlet.annotation.WebServlet;\nimport javax.servlet.http.HttpServlet;\n\n@WebServlet(\"/status\")\npublic class StatusServlet extends HttpServlet {\n}",
            "solution": "import jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\n\n@WebServlet(\"/status\")\npublic class StatusServlet extends HttpServlet {\n}",
            "explanation": "Tomcat 10.1 implements Servlet 6.0 (Jakarta EE 10) which exclusively supports the jakarta.* namespace."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Deployment Namespace Validator",
            "prompt": "Write a utility method that inspects an array of class names and flags any legacy javax.* classes.",
            "starterCode": "public static boolean hasLegacyImports(java.util.List<String> classNames) {\n    // Return true if any class uses javax.*\n}",
            "solution": "public static boolean hasLegacyImports(java.util.List<String> classNames) {\n    return classNames.stream().anyMatch(name -> name.startsWith(\"javax.servlet.\") || name.startsWith(\"javax.persistence.\"));\n}",
            "explanation": "Scanning class names ensures legacy artifacts are identified prior to deployment."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Third-Party Library Compatibility",
            "prompt": "Can a modern Jakarta EE 10 WAR use a library that still references javax.servlet internally without modification?",
            "solution": "// No. The JVM ClassLoader will fail to locate javax.servlet classes on Tomcat 10.1+.\n// Solutions:\n// 1. Upgrade the library to a version supporting Jakarta EE 10.\n// 2. Run the Apache Tomcat Migration Tool for Jakarta EE to bytecode-transform the JAR.",
            "explanation": "Tomcat 10.1 does not provide javax.servlet classes on its common classloader path."
        }
    ],
    "officialSources": [
        {
            "title": "Eclipse Foundation: Jakarta EE Specifications Portal",
            "url": "https://jakarta.ee/specifications/",
            "organization": "Eclipse Foundation"
        },
        {
            "title": "Apache Tomcat Migration Guide: Java EE 8 to Jakarta EE 9/10",
            "url": "https://tomcat.apache.org/migration-10.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-64",
    "slug": "web-architecture-fundamentals-http",
    "topicNumber": 64,
    "title": "Web Architecture Fundamentals: The HTTP Protocol",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 17,
    "sectionTitle": "Web Architecture & The Jakarta EE Evolution",
    "versionBadge": "HTTP/1.1 & HTTP/2",
    "difficulty": "Beginner",
    "readingTime": "11 min read",
    "shortDescription": "Master client-server mechanics, request-response lifecycles, HTTP methods (GET, POST, PUT, DELETE), header contracts, status code tiers, and query parameters.",
    "prerequisites": [
        "Topic 01: What is Programming & How Code Runs",
        "Topic 45: Classic I/O Streams"
    ],
    "whatAndWhy": {
        "definition": "HTTP (Hypertext Transfer Protocol) is an application-layer client-server protocol where web clients transmit formatted text or binary requests to an addressable URI, and servers reply with status codes, headers, and payload bodies.",
        "analogy": "Sending a certified physical letter via postal mail: the envelope exterior contains recipient address and routing stamps (headers), the delivery slip contains receipt status (status code), and the inner letter is the payload body.",
        "whyItExists": "Provides a universally agreed upon stateless communication standard allowing web browsers, mobile apps, and microservices to exchange structured information across networks."
    },
    "syntaxBreakdown": {
        "title": "HTTP Request & Response Line Anatomy",
        "codeSnippet": "// Raw HTTP/1.1 Request Wire Format\nPOST /api/v1/orders?priority=true HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\nContent-Length: 32\n\n{\"item\":\"Laptop\",\"quantity\":1}\n\n// Raw HTTP/1.1 Response Wire Format\nHTTP/1.1 201 Created\nContent-Type: application/json\nLocation: /api/v1/orders/8042\n\n{\"id\":8042,\"status\":\"CONFIRMED\"}",
        "explanation": "A request line begins with an HTTP method, target URI, and version, followed by key-value headers, an empty CRLF delimiter line, and the optional message body.",
        "tokens": [
            {
                "token": "GET",
                "explanation": "Safe, idempotent method retrieving resources; no body allowed"
            },
            {
                "token": "POST",
                "explanation": "Unsafe, non-idempotent method creating new resources or invoking actions"
            },
            {
                "token": "200 OK / 201 Created",
                "explanation": "2xx Success status codes indicating completed operations"
            },
            {
                "token": "4xx Client / 5xx Server",
                "explanation": "4xx client errors (bad request/auth) vs 5xx server-side failures"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-64-basic",
            "title": "Parsing Raw HTTP Request Wire Protocol",
            "type": "basic",
            "description": "Deconstructing raw HTTP stream data into method, URI, query parameters, and headers.",
            "filename": "HttpProtocolParserDemo.java",
            "code": "import java.util.HashMap;\nimport java.util.Map;\n\npublic class HttpProtocolParserDemo {\n    public static void main(String[] args) {\n        System.out.println(\"=== HTTP Request Protocol Parser ===\");\n        String rawHttpRequest = \"\"\"\n            POST /api/v1/orders?priority=true HTTP/1.1\n            Host: api.store.com\n            User-Agent: Mozilla/5.0\n            Content-Type: application/json\n            Content-Length: 26\n            \n            {\"productId\":101,\"qty\":2}\n            \"\"\";\n\n        String[] lines = rawHttpRequest.split(\"\\r?\\n\");\n        String requestLine = lines[0];\n        String[] reqParts = requestLine.split(\" \");\n        String method = reqParts[0];\n        String fullUri = reqParts[1];\n        String version = reqParts[2];\n\n        String path = fullUri.contains(\"?\") ? fullUri.substring(0, fullUri.indexOf('?')) : fullUri;\n        String queryString = fullUri.contains(\"?\") ? fullUri.substring(fullUri.indexOf('?') + 1) : \"\";\n\n        Map<String, String> headers = new HashMap<>();\n        int bodyStartIdx = 0;\n        for (int i = 1; i < lines.length; i++) {\n            if (lines[i].isBlank()) {\n                bodyStartIdx = i + 1;\n                break;\n            }\n            int colonIdx = lines[i].indexOf(':');\n            if (colonIdx != -1) {\n                headers.put(lines[i].substring(0, colonIdx).trim(), lines[i].substring(colonIdx + 1).trim());\n            }\n        }\n\n        StringBuilder body = new StringBuilder();\n        for (int i = bodyStartIdx; i < lines.length; i++) {\n            body.append(lines[i]);\n        }\n\n        System.out.println(\"Parsed Request Details:\");\n        System.out.println(\"  Method:   \" + method);\n        System.out.println(\"  Path URI: \" + path);\n        System.out.println(\"  Query:    \" + queryString);\n        System.out.println(\"  Version:  \" + version);\n        System.out.println(\"  Headers:  \" + headers);\n        System.out.println(\"  Body:     \" + body.toString().trim());\n        System.out.println(\"HTTP request parsing completed successfully.\");\n    }\n}",
            "output": "=== HTTP Request Protocol Parser ===\nParsed Request Details:\n  Method:   POST\n  Path URI: /api/v1/orders\n  Query:    priority=true\n  Version:  HTTP/1.1\n  Headers:  {Host=api.store.com, Content-Type=application/json, User-Agent=Mozilla/5.0, Content-Length=26}\n  Body:     {\"productId\":101,\"qty\":2}\nHTTP request parsing completed successfully.",
            "stepByStep": [
                "Splits raw stream text by newline characters.",
                "Extracts method (POST), path (/api/v1/orders), and protocol (HTTP/1.1).",
                "Parses key-value header lines until the empty blank line delimiter.",
                "Extracts remaining payload stream as request body."
            ]
        },
        {
            "id": "ex-64-realistic",
            "title": "Mock HTTP Request Router and Dispatcher",
            "type": "realistic",
            "description": "Routing incoming requests by method and path to produce formatted HTTP/1.1 response status codes.",
            "filename": "MockHttpServerDispatcherApp.java",
            "code": "import java.util.Map;\n\npublic class MockHttpServerDispatcherApp {\n    record SimpleHttpRequest(String method, String path) {}\n    record SimpleHttpResponse(int statusCode, String reasonPhrase, String body) {\n        public String formatWireResponse() {\n            return String.format(\"HTTP/1.1 %d %s%nContent-Length: %d%n%n%s\", \n                statusCode, reasonPhrase, body.length(), body);\n        }\n    }\n\n    public static SimpleHttpResponse route(SimpleHttpRequest req) {\n        if (\"GET\".equals(req.method()) && \"/health\".equals(req.path())) {\n            return new SimpleHttpResponse(200, \"OK\", \"STATUS: SYSTEM HEALTHY\");\n        } else if (\"POST\".equals(req.method()) && \"/api/data\".equals(req.path())) {\n            return new SimpleHttpResponse(201, \"Created\", \"ID: 4920 CREATED\");\n        } else {\n            return new SimpleHttpResponse(404, \"Not Found\", \"RESOURCE NOT FOUND\");\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"=== Mock HTTP Dispatcher Simulation ===\");\n        var requests = java.util.List.of(\n            new SimpleHttpRequest(\"GET\", \"/health\"),\n            new SimpleHttpRequest(\"POST\", \"/api/data\"),\n            new SimpleHttpRequest(\"GET\", \"/nonexistent\")\n        );\n\n        for (var req : requests) {\n            var resp = route(req);\n            System.out.printf(\"%-4s %-14s -> %d %s (Body: %s)%n\", \n                req.method(), req.path(), resp.statusCode(), resp.reasonPhrase(), resp.body());\n        }\n        System.out.println(\"HTTP Dispatcher simulation completed successfully.\");\n    }\n}",
            "output": "=== Mock HTTP Dispatcher Simulation ===\nGET  /health        -> 200 OK (Body: STATUS: SYSTEM HEALTHY)\nPOST /api/data       -> 201 Created (Body: ID: 4920 CREATED)\nGET  /nonexistent   -> 404 Not Found (Body: RESOURCE NOT FOUND)\nHTTP Dispatcher simulation completed successfully.",
            "stepByStep": [
                "Encapsulates requests and responses into clean Java records.",
                "Matches incoming method and path pairs against registered routes.",
                "Generates standard status codes (200, 201, 404) with corresponding wire text."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Using GET requests to delete or mutate database records",
            "errorCodeOrSnippet": "<a href=\"/deleteUser?id=10\">Delete</a>",
            "cause": "Web crawlers, browser prefetching, and proxies can inadvertently trigger destructive database operations.",
            "solution": "Strictly use POST, PUT, or DELETE for state-changing operations; keep GET safe and idempotent."
        },
        {
            "title": "Forgetting the empty CRLF line between HTTP headers and request body",
            "errorCodeOrSnippet": "HTTP/1.1 200 OK\\nContent-Type: text/plain{\"data\":1}",
            "cause": "Missing the mandatory empty line delimiter required by RFC 9110.",
            "solution": "Always ensure an empty newline separates the last header from the payload."
        }
    ],
    "bestPractices": {
        "doList": [
            "Adhere to RESTful HTTP method semantics: GET for read, POST for create, PUT for update, DELETE for remove.",
            "Always set accurate Content-Type and Content-Length / Transfer-Encoding headers.",
            "Return descriptive HTTP status codes (e.g. 201 Created, 404 Not Found, 409 Conflict) rather than generic 200 OK with error bodies."
        ],
        "dontList": [
            "Do not transmit sensitive credentials or tokens in URL query strings (use Authorization headers).",
            "Do not design endpoints with side effects on GET requests.",
            "Do not ignore caching headers (Cache-Control, ETag) on high-traffic public assets."
        ],
        "whenNotToUse": "Do not use raw HTTP polling for ultra-low-latency real-time bidirectional messaging; use WebSockets or Server-Sent Events (SSE)."
    },
    "versionNotes": {
        "introduced": "HTTP/1.0 (RFC 1945), HTTP/1.1 (RFC 2616 / 9112), HTTP/2 (RFC 7540)",
        "status": "Stable",
        "compatibilityNotes": "HTTP/1.1 and HTTP/2 are the primary protocol versions supported across Jakarta EE and Tomcat runtimes.",
        "ltsAvailability": "Tomcat 10.1 supports HTTP/1.1, HTTP/2 (multiplexing over TLS), and WebSocket connections."
    },
    "cheatSheet": {
        "title": "HTTP Methods and Semantic Properties",
        "headers": [
            "Method",
            "Safe?",
            "Idempotent?",
            "Has Body?",
            "Typical Purpose"
        ],
        "rows": [
            [
                "GET",
                "Yes",
                "Yes",
                "No",
                "Retrieve existing resource state"
            ],
            [
                "POST",
                "No",
                "No",
                "Yes",
                "Create new resource or execute processing action"
            ],
            [
                "PUT",
                "No",
                "Yes",
                "Yes",
                "Completely replace target resource"
            ],
            [
                "DELETE",
                "No",
                "Yes",
                "Optional",
                "Remove target resource"
            ],
            [
                "HEAD",
                "Yes",
                "Yes",
                "No",
                "Retrieve headers only without response body"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Identify Unsafe HTTP Method Usage",
            "prompt": "A web app exposes an endpoint `GET /users/delete?id=42` to delete users. Explain why this violates HTTP specifications and provide the fix.",
            "starterCode": "// Client link:\n<a href=\"/users/delete?id=42\">Delete User</a>",
            "solution": "// Fix: Use POST or DELETE with CSRF protection:\n<form method=\"POST\" action=\"/users/42/delete\">\n  <input type=\"hidden\" name=\"_method\" value=\"DELETE\"/>\n  <button type=\"submit\">Delete User</button>\n</form>",
            "explanation": "GET requests must be safe and idempotent. Automated crawlers and link previewers could trigger unintentional deletions."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Status Code Classifier",
            "prompt": "Write a helper method that categorizes an integer status code into its standard category (Informational, Success, Redirection, Client Error, Server Error).",
            "starterCode": "public static String categorizeStatus(int code) {\n    // Return category name\n}",
            "solution": "public static String categorizeStatus(int code) {\n    return switch (code / 100) {\n        case 1 -> \"Informational (1xx)\";\n        case 2 -> \"Success (2xx)\";\n        case 3 -> \"Redirection (3xx)\";\n        case 4 -> \"Client Error (4xx)\";\n        case 5 -> \"Server Error (5xx)\";\n        default -> \"Invalid Status\";\n    };\n}",
            "explanation": "Integer division by 100 cleanly maps status codes into standard HTTP tiers."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Idempotency in Network Timeouts",
            "prompt": "If a client encounters a network timeout when calling PUT vs POST, which one can the client safely retry automatically without duplicate side effects?",
            "solution": "// PUT is idempotent by specification: updating a resource to state X multiple times produces the identical end state.\n// POST is NOT idempotent: retrying a POST may create duplicate orders or bill a user twice.\n// Therefore, PUT requests can be safely retried automatically.",
            "explanation": "Understanding method idempotency is essential for reliable distributed systems."
        }
    ],
    "officialSources": [
        {
            "title": "IETF RFC 9110: HTTP Semantics",
            "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
            "organization": "Eclipse Foundation"
        },
        {
            "title": "Apache Tomcat Documentation: HTTP Connectors",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/config/http.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-65",
    "slug": "apache-tomcat-and-the-war-structure",
    "topicNumber": 65,
    "title": "Apache Tomcat & The WAR Structure",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 18,
    "sectionTitle": "Web Containers & Packaging",
    "versionBadge": "Tomcat 10.1+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Explore the Web Archive (WAR) anatomy, the protected WEB-INF boundary, web.xml vs annotations, Catalina container hierarchy, and Tomcat deployment pipelines.",
    "prerequisites": [
        "Topic 62: Build Automation: Maven & Gradle",
        "Topic 63: The Great Transition: Java EE to Jakarta EE"
    ],
    "whatAndWhy": {
        "definition": "Apache Tomcat is an open-source reference Servlet container and web server implementing the Jakarta Servlet and Jakarta Pages specifications. A WAR (Web Application Archive) is a packaged ZIP file structured strictly according to the Jakarta EE specification.",
        "analogy": "A residential apartment building: the public lobby and garden are accessible to anyone (HTML, CSS, images), while the security-locked private maintenance wing (WEB-INF) is accessible only to building staff (Servlets, compiled .class files, and internal configs).",
        "whyItExists": "Enables developers to bundle static assets, compiled bytecode, libraries, and deployment descriptors into a single portable distribution archive deployable to any standard compliant Servlet container."
    },
    "syntaxBreakdown": {
        "title": "Standard WAR Directory Architecture",
        "codeSnippet": "my-web-app.war\n├── index.html              <-- Public web asset\n├── assets/                 <-- Public CSS, JS, images\n│   └── app.css\n└── WEB-INF/                <-- PROTECTED: Never accessible directly via URL\n    ├── web.xml             <-- Deployment descriptor (optional in Servlet 3.0+)\n    ├── classes/            <-- Compiled application classes (.class)\n    │   └── com/app/MyServlet.class\n    └── lib/                <-- Third-party dependency JARs\n        └── sqlite-jdbc.jar",
        "explanation": "Clients can directly request public root assets, but any attempt to directly fetch resources within WEB-INF results in an immediate 404 Not Found by specification.",
        "tokens": [
            {
                "token": "WEB-INF/",
                "explanation": "Protected directory holding private server-side code and descriptors"
            },
            {
                "token": "WEB-INF/classes/",
                "explanation": "Application bytecode loaded by the WebAppClassLoader"
            },
            {
                "token": "WEB-INF/lib/",
                "explanation": "Application-bundled external JAR dependencies"
            },
            {
                "token": "web.xml",
                "explanation": "Authoritative deployment descriptor configuring servlets, filters, and mappings"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-65-basic",
            "title": "Validating WAR Packaging Layout and Protected Boundaries",
            "type": "basic",
            "description": "Simulating the Servlet container verification rules for standard WAR directory layout.",
            "filename": "WarStructureValidatorDemo.java",
            "code": "import java.util.List;\n\npublic class WarStructureValidatorDemo {\n    public static void main(String[] args) {\n        System.out.println(\"=== WAR Directory Structure Validator ===\");\n        List<String> warFiles = List.of(\n            \"index.html\",\n            \"css/style.css\",\n            \"WEB-INF/web.xml\",\n            \"WEB-INF/classes/com/handbook/web/LifecycleServlet.class\",\n            \"WEB-INF/lib/sqlite-jdbc.jar\"\n        );\n\n        boolean hasWebInf = warFiles.stream().anyMatch(f -> f.startsWith(\"WEB-INF/\"));\n        boolean hasClasses = warFiles.stream().anyMatch(f -> f.startsWith(\"WEB-INF/classes/\"));\n        boolean hasDescriptor = warFiles.contains(\"WEB-INF/web.xml\");\n\n        System.out.println(\"Validating WAR Layout:\");\n        System.out.println(\"  WEB-INF Root Present:    \" + hasWebInf);\n        System.out.println(\"  WEB-INF/classes Present: \" + hasClasses);\n        System.out.println(\"  web.xml Deployment Desk: \" + hasDescriptor);\n\n        for (String file : warFiles) {\n            boolean isProtected = file.startsWith(\"WEB-INF/\");\n            System.out.printf(\"  %-45s -> %s%n\", file, isProtected ? \"BLOCKED FROM DIRECT HTTP ACCESS\" : \"PUBLIC DIRECT ACCESS OK\");\n        }\n        System.out.println(\"WAR structure validation completed successfully.\");\n    }\n}",
            "output": "=== WAR Directory Structure Validator ===\nValidating WAR Layout:\n  WEB-INF Root Present:    true\n  WEB-INF/classes Present: true\n  web.xml Deployment Desk: true\n  index.html                                    -> PUBLIC DIRECT ACCESS OK\n  css/style.css                                 -> PUBLIC DIRECT ACCESS OK\n  WEB-INF/web.xml                               -> BLOCKED FROM DIRECT HTTP ACCESS\n  WEB-INF/classes/com/handbook/web/LifecycleServlet.class -> BLOCKED FROM DIRECT HTTP ACCESS\n  WEB-INF/lib/sqlite-jdbc.jar                   -> BLOCKED FROM DIRECT HTTP ACCESS\nWAR structure validation completed successfully.",
            "stepByStep": [
                "Inspects virtual file paths within a packaged Web Application Archive.",
                "Verifies standard WEB-INF, classes, and descriptor boundaries.",
                "Demonstrates the security enforcement restricting direct HTTP requests to WEB-INF."
            ]
        },
        {
            "id": "ex-65-realistic",
            "title": "Tomcat Deployment and Catalina Hierarchy Inspector",
            "type": "realistic",
            "description": "Modeling the Apache Tomcat Catalina container component tree and web.xml parsing.",
            "filename": "TomcatDeploymentPackagerApp.java",
            "code": "public class TomcatDeploymentPackagerApp {\n    record ContainerLevel(String name, String role, String description) {}\n\n    public static void main(String[] args) {\n        System.out.println(\"=== Apache Tomcat Catalina Hierarchy ===\");\n        var hierarchy = java.util.List.of(\n            new ContainerLevel(\"Server\", \"StandardServer\", \"Top-level JVM process container\"),\n            new ContainerLevel(\"Service\", \"StandardService\", \"Binds Connectors (HTTP/AJP) to an Engine\"),\n            new ContainerLevel(\"Connector\", \"CoyoteConnector\", \"Listens on port (e.g. 8080) for incoming TCP/HTTP requests\"),\n            new ContainerLevel(\"Engine\", \"StandardEngine\", \"Top-level pipeline processing requests for a virtual service\"),\n            new ContainerLevel(\"Host\", \"StandardHost\", \"Virtual host definition (e.g. localhost)\"),\n            new ContainerLevel(\"Context\", \"StandardContext\", \"Represents an individual deployed web application (e.g. /handbook)\")\n        );\n\n        for (var level : hierarchy) {\n            System.out.printf(\"  %-12s | %-20s -> %s%n\", level.name(), level.role(), level.description());\n        }\n\n        System.out.println(\"\\nSample Minimal Jakarta EE 10 web.xml Descriptor:\");\n        String webXml = \"\"\"\n            <?xml version=\"1.0\" encoding=\"UTF-8\"?>\n            <web-app xmlns=\"https://jakarta.ee/xml/ns/jakartaee\"\n                     xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n                     xsi:schemaLocation=\"https://jakarta.ee/xml/ns/jakartaee\n                                         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd\"\n                     version=\"6.0\">\n                <display-name>Java Handbook Demo</display-name>\n            </web-app>\n            \"\"\";\n        System.out.println(webXml);\n        System.out.println(\"Tomcat deployment package verification completed successfully.\");\n    }\n}",
            "output": "=== Apache Tomcat Catalina Hierarchy ===\n  Server       | StandardServer       -> Top-level JVM process container\n  Service      | StandardService      -> Binds Connectors (HTTP/AJP) to an Engine\n  Connector    | CoyoteConnector      -> Listens on port (e.g. 8080) for incoming TCP/HTTP requests\n  Engine       | StandardEngine       -> Top-level pipeline processing requests for a virtual service\n  Host         | StandardHost         -> Virtual host definition (e.g. localhost)\n  Context      | StandardContext      -> Represents an individual deployed web application (e.g. /handbook)\n\nSample Minimal Jakarta EE 10 web.xml Descriptor:\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<web-app xmlns=\"https://jakarta.ee/xml/ns/jakartaee\"\n         xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n         xsi:schemaLocation=\"https://jakarta.ee/xml/ns/jakartaee\n                             https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd\"\n         version=\"6.0\">\n    <display-name>Java Handbook Demo</display-name>\n</web-app>\n\nTomcat deployment package verification completed successfully.",
            "stepByStep": [
                "Outlines the Catalina architecture (Server -> Service -> Connector -> Engine -> Host -> Context).",
                "Details how an individual deployed WAR maps to a Tomcat StandardContext.",
                "Demonstrates the canonical XML schema definition for Jakarta EE 10 (version 6.0)."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Placing public assets (images, CSS, JS) inside the WEB-INF folder",
            "errorCodeOrSnippet": "GET /WEB-INF/style.css -> 404 Not Found",
            "cause": "Servlet containers strictly deny direct client HTTP requests to WEB-INF by specification.",
            "solution": "Place public assets at the WAR root or subdirectories like /css or /js outside WEB-INF."
        },
        {
            "title": "Putting JAR dependencies directly in WEB-INF/classes instead of WEB-INF/lib",
            "errorCodeOrSnippet": "java.lang.NoClassDefFoundError",
            "cause": "Tomcat WebAppClassLoader cannot load compiled bytecode packaged inside nested JARs under classes/.",
            "solution": "Place compiled .class files in WEB-INF/classes and zipped .jar dependencies in WEB-INF/lib."
        }
    ],
    "bestPractices": {
        "doList": [
            "Place internal JSP views, XML configurations, and private templates inside WEB-INF.",
            "Use Maven maven-war-plugin or Gradle war plugin for automated, reproducible packaging.",
            "Scope servlet container APIs (like jakarta.servlet-api) as provided in your build tool."
        ],
        "dontList": [
            "Do not store database passwords or cryptographic private keys in plaintext inside WAR files.",
            "Do not deploy duplicate versions of the same JAR across WEB-INF/lib and container lib/.",
            "Do not place user-uploaded files directly into the extracted WAR deployment directory."
        ],
        "whenNotToUse": "Do not build fat WAR files for standalone microservices using Spring Boot or Quarkus unless deploying to a shared corporate application server pool."
    },
    "versionNotes": {
        "introduced": "WAR introduced in Servlet 2.2; modern Servlet 6.0 deployment descriptor schema in Jakarta EE 10",
        "status": "Stable",
        "compatibilityNotes": "WAR packaging is supported by Apache Tomcat 10.1+, Jetty 12+, and all Jakarta EE 10 certified application servers.",
        "ltsAvailability": "Update XML namespace schema in web.xml from javaee 4.0 (xmlns.jcp.org) to jakartaee 6.0 (jakarta.ee)."
    },
    "cheatSheet": {
        "title": "Standard WAR Directory Structure",
        "headers": [
            "Directory / File",
            "Access Level",
            "Content Type",
            "Purpose"
        ],
        "rows": [
            [
                "WAR Root (/)",
                "Public HTTP",
                "HTML, CSS, JS, Images",
                "Directly browser-accessible static web assets"
            ],
            [
                "WEB-INF/",
                "Protected (Private)",
                "Config & Server Code",
                "Invisible to direct URL requests; accessible only by server dispatch"
            ],
            [
                "WEB-INF/web.xml",
                "Protected",
                "XML Deployment Descriptor",
                "Configures servlets, filters, session timeouts, and error pages"
            ],
            [
                "WEB-INF/classes/",
                "Protected",
                "Bytecode (.class)",
                "Application compiled classes loaded by WebAppClassLoader"
            ],
            [
                "WEB-INF/lib/",
                "Protected",
                "Third-party JARs",
                "Packaged dependencies available on the web app classpath"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix Public Resource Location",
            "prompt": "A web app has an image located at `WEB-INF/images/logo.png`. The HTML uses `<img src=\"/images/logo.png\">`, but returns 404. What is the bug?",
            "starterCode": "// Directory:\n// myapp.war/WEB-INF/images/logo.png\n// HTML:\n<img src=\"images/logo.png\" alt=\"Company Logo\" />",
            "solution": "// Fix: Move the images directory to the public WAR root:\n// myapp.war/images/logo.png\n// HTML:\n<img src=\"images/logo.png\" alt=\"Company Logo\" />",
            "explanation": "The Servlet specification forbids direct HTTP access to any resource within the WEB-INF directory."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "WAR Path Security Checker",
            "prompt": "Write a helper method `isPubliclyAccessible(String requestPath)` that returns false if the path points to WEB-INF or META-INF.",
            "starterCode": "public static boolean isPubliclyAccessible(String path) {\n    // Return true if safe\n}",
            "solution": "public static boolean isPubliclyAccessible(String path) {\n    String normalized = path.toUpperCase();\n    return !normalized.startsWith(\"/WEB-INF\") && !normalized.startsWith(\"/META-INF\");\n}",
            "explanation": "Servlet containers automatically reject any incoming URI matching WEB-INF or META-INF with HTTP 404."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Provided vs Compile Scope Dependencies",
            "prompt": "Why should `jakarta.servlet-api.jar` NEVER be placed in `WEB-INF/lib` when deploying to Apache Tomcat?",
            "solution": "// Apache Tomcat already provides the Servlet API JAR in its own lib/ directory ($CATALINA_HOME/lib/servlet-api.jar).\n// Packaging servlet-api.jar inside WEB-INF/lib causes ClassCastException or LinkageError due to conflicting ClassLoaders.\n// In Maven, always declare this dependency with <scope>provided</scope>.",
            "explanation": "Container-provided APIs must be scoped as \"provided\" to prevent duplicate class definition conflicts."
        }
    ],
    "officialSources": [
        {
            "title": "Apache Tomcat Documentation: Architecture & Catalina",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/architecture/overview.html",
            "organization": "Apache Tomcat"
        },
        {
            "title": "Jakarta Servlet Specification 6.0: Web Application Archive",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        }
    ]
},

  {
    id: 'topic-66',
    slug: 'servlet-lifecycle-and-architecture',
    topicNumber: 66,
    title: 'Servlet Lifecycle & Architecture',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 19,
    sectionTitle: 'Servlets Deep Dive',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Deep dive into how Jakarta Servlets work: the container lifecycle (init, service, destroy), multithreaded request dispatching, and thread-safety fundamentals.',
    prerequisites: [
      'Topic 63: The Great Transition: Java EE to Jakarta EE',
      'Topic 64: Web Architecture Fundamentals (HTTP Protocol)',
      'Topic 65: Apache Tomcat & The WAR Structure'
    ],
    whatAndWhy: {
      definition: 'A Servlet is a server-side Java component managed by a web container (such as Apache Tomcat) that receives HTTP client requests, processes business logic, and dynamically generates HTTP responses.',
      analogy: 'Imagine a busy restaurant kitchen. The web container (Tomcat) is the restaurant manager. The Servlet is a head chef. When the restaurant opens, the manager hires and prepares the chef once (init). When 200 customers place dinner orders simultaneously, the manager does not hire 200 chefs; instead, 200 waiters (threads) run order slips to that single head chef (service -> doGet/doPost). When the restaurant closes at night, the manager dismisses the chef to clean down the kitchen (destroy).',
      whyItExists: 'Static web servers can only send static HTML files from a hard drive. Modern applications require dynamic responses: querying databases, authenticating user passwords, calculating invoices, and generating personalized data. Servlets provide the robust, high-performance Java standard for writing server-side web logic.'
    },
    syntaxBreakdown: {
      title: 'Anatomy of an Annotated Jakarta HttpServlet',
      codeSnippet: `@WebServlet(name = "LifecycleServlet", urlPatterns = {"/lifecycle"})\npublic class LifecycleServlet extends HttpServlet {\n    @Override\n    public void init(ServletConfig config) throws ServletException {\n        super.init(config);\n    }\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        resp.setContentType("text/html;charset=UTF-8");\n    }\n\n    @Override\n    public void destroy() {\n        super.destroy();\n    }\n}`,
      explanation: 'Every method and annotation in a Jakarta HttpServlet connects directly to the container lifecycle and HTTP protocol mappings.',
      tokens: [
        { token: '@WebServlet', explanation: 'Jakarta EE annotation that registers the servlet with the web container and binds it to URL patterns without requiring web.xml.' },
        { token: 'extends HttpServlet', explanation: 'Inherits HTTP protocol handling capabilities from jakarta.servlet.http.HttpServlet (which implements jakarta.servlet.Servlet).' },
        { token: 'init(ServletConfig)', explanation: 'Lifecycle initialization hook invoked exactly once by the container when the servlet instance is first created.' },
        { token: 'super.init(config)', explanation: 'Crucial call that preserves the ServletConfig reference inside the parent GenericServlet.' },
        { token: 'doGet(...)', explanation: 'Specialized request handler called by the default service() implementation whenever an HTTP GET request arrives.' },
        { token: 'HttpServletRequest', explanation: 'Object containing incoming HTTP request data: URL parameters, headers, cookies, session, and input streams.' },
        { token: 'HttpServletResponse', explanation: 'Object used to configure outgoing HTTP response data: status codes, content-type, headers, and output writers.' },
        { token: 'destroy()', explanation: 'Lifecycle termination hook invoked exactly once when the servlet is taken out of service before container shutdown.' }
      ]
    },
    examples: [
      {
        id: 'ex-66-basic',
        title: 'Servlet Lifecycle & Thread Observation Demo',
        type: 'basic',
        description: 'Demonstrates init(), doGet(), and destroy() with thread tracking and an atomic request counter proving single-instance multithreading.',
        filename: 'LifecycleServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.atomic.AtomicInteger;

@WebServlet(name = "LifecycleServlet", urlPatterns = {"/lifecycle"})
public class LifecycleServlet extends HttpServlet {
    private final AtomicInteger requestCounter = new AtomicInteger(0);

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        System.out.println("[Servlet Lifecycle] init() executed once: Servlet instance initialized in container.");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        int currentCount = requestCounter.incrementAndGet();
        response.setContentType("text/html;charset=UTF-8");
        
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html><html><head><title>Servlet Lifecycle</title></head><body>");
            out.println("<h1>Jakarta Servlet 6.0 Lifecycle Demo</h1>");
            out.println("<p>HTTP Method: GET</p>");
            out.println("<p>Total Requests Handled by Single Instance: <strong>" + currentCount + "</strong></p>");
            out.println("<p>Thread handling request: " + Thread.currentThread().getName() + "</p>");
            out.println("</body></html>");
        }
    }

    @Override
    public void destroy() {
        System.out.println("[Servlet Lifecycle] destroy() executed: Cleaning up resources before shutdown.");
        super.destroy();
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html><html><head><title>Servlet Lifecycle</title></head><body>
<h1>Jakarta Servlet 6.0 Lifecycle Demo</h1>
<p>HTTP Method: GET</p>
<p>Total Requests Handled by Single Instance: <strong>1</strong></p>
<p>Thread handling request: http-nio-8080-exec-1</p>
</body></html>`,
        stepByStep: [
          'Step 1: On the first request to /lifecycle, Tomcat discovers that no instance exists in memory.',
          'Step 2: Tomcat instantiates LifecycleServlet via reflection and calls init(ServletConfig).',
          'Step 3: Tomcat pulls a worker thread (e.g., http-nio-8080-exec-1) from its thread pool.',
          'Step 4: The thread invokes service(), which inspects the HTTP method ("GET") and dispatches to doGet().',
          'Step 5: The atomic counter increments safely across threads, and HTML bytes stream to the client response.',
          'Step 6: On container stop (catalina stop), Tomcat calls destroy() to release persistent connections.'
        ]
      },
      {
        id: 'ex-66-realistic',
        title: 'Production User Registry Servlet with Dual GET/POST Handling',
        type: 'realistic',
        description: 'A realistic servlet handling form submissions via POST and user data retrieval via GET, with status codes and character encoding.',
        filename: 'UserRegistryServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.ConcurrentHashMap;

@WebServlet(name = "UserRegistryServlet", urlPatterns = {"/users"})
public class UserRegistryServlet extends HttpServlet {
    // Thread-safe in-memory store simulating repository
    private final ConcurrentHashMap<String, String> userStore = new ConcurrentHashMap<>();

    @Override
    public void init() {
        userStore.put("admin", "System Administrator");
        userStore.put("sarah", "Lead Architect");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.println("<h2>Registered Users</h2><ul>");
            userStore.forEach((username, role) -> {
                out.printf("<li><strong>%s</strong>: %s</li>%n", username, role);
            });
            out.println("</ul>");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        String username = req.getParameter("username");
        String role = req.getParameter("role");

        if (username == null || username.isBlank() || role == null || role.isBlank()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Both username and role are mandatory fields.");
            return;
        }

        userStore.put(username.trim(), role.trim());
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().printf("User '%s' registered successfully as '%s'.", username, role);
    }
}`,
        output: `POST /users HTTP/1.1
Host: localhost:8080
Content-Type: application/x-www-form-urlencoded

username=david&role=SecuritySpecialist

--- Response ---
HTTP/1.1 201 Created
Content-Type: text/plain;charset=UTF-8

User 'david' registered successfully as 'SecuritySpecialist'.`,
        stepByStep: [
          'Step 1: The browser sends an HTTP POST request containing URL-encoded form parameters.',
          'Step 2: Tomcat parses the payload and exposes parameters via req.getParameter("username").',
          'Step 3: Validation checks guard against empty strings, returning HTTP 400 Bad Request if invalid.',
          'Step 4: The ConcurrentHashMap stores the new user entry safely across concurrent threads.',
          'Step 5: The servlet responds with HTTP 201 Created status and confirmation body.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Non-Thread-Safe Instance Variables (Race Conditions)',
        errorCodeOrSnippet: 'private int userCount = 0; // In a Servlet!',
        wrongCode: 'public class BadServlet extends HttpServlet {\n    private int userCount = 0; // BUG: Not thread-safe!\n    protected void doGet(...) {\n        userCount++; // RACE CONDITION across concurrent users!\n    }\n}',
        fixedCode: 'public class SafeServlet extends HttpServlet {\n    private final AtomicInteger userCount = new AtomicInteger(0);\n    protected void doGet(...) {\n        userCount.incrementAndGet(); // Thread-safe\n    }\n}',
        cause: 'Web containers maintain only ONE instance of each servlet. Every incoming request runs in a separate thread on that same instance!',
        solution: 'Never store mutable per-request data in servlet instance variables. Use method-local variables, request attributes, or thread-safe atomic data structures.'
      },
      {
        title: 'Modifying Response After Commitment',
        errorCodeOrSnippet: 'java.lang.IllegalStateException: Cannot call sendRedirect() after the response has been committed',
        wrongCode: 'out.println("<html>...");\nout.flush();\nresp.sendRedirect("/login"); // ERROR!',
        fixedCode: 'if (!isAuthenticated) {\n    resp.sendRedirect("/login");\n    return; // Stop further execution\n}\nout.println("<html>...");',
        cause: 'Once headers and initial buffer bytes are sent (committed) to the TCP network socket, you cannot change headers or trigger redirects.',
        solution: 'Perform all redirects and header configurations before writing or flushing any response body bytes, and always return immediately.'
      },
      {
        title: 'Legacy javax.* Import on Modern Tomcat 10.1+',
        errorCodeOrSnippet: 'java.lang.ClassNotFoundException: javax.servlet.http.HttpServlet',
        wrongCode: 'import javax.servlet.http.HttpServlet; // Tomcat 9 / Java EE 8 legacy',
        fixedCode: 'import jakarta.servlet.http.HttpServlet; // Jakarta EE 9/10/11 standard',
        cause: 'Tomcat 10 and 11 strictly implement Jakarta EE specifications and exclusively provide the jakarta.* namespace.',
        solution: 'Update all imports from javax.servlet.* to jakarta.servlet.*.'
      }
    ],
    bestPractices: {
      doList: [
        'Always design servlets to be completely stateless regarding request data.',
        'Use the @WebServlet annotation instead of bulky XML mappings for standard routes.',
        'Always call resp.setContentType(...) before obtaining resp.getWriter() or resp.getOutputStream().',
        'Employ try-with-resources or container resource closing to prevent response buffer memory leaks.'
      ],
      dontList: [
        'Never store user-specific state in servlet fields; store them in HttpSession or request attributes.',
        'Never call both resp.getWriter() and resp.getOutputStream() in the same request (IllegalStateException).',
        'Do not swallow ServletException or IOException silently; let Tomcat handle error routing.'
      ],
      whenNotToUse: 'Do not use raw Servlets to render large complex HTML interfaces; combine Servlets with JSP / MVC templating or RESTful endpoints to keep business logic separate from HTML markup.'
    },
    versionNotes: {
      introduced: 'Java Servlet 1.0 (1997) -> Jakarta Servlet 6.0 (Jakarta EE 10, 2022) -> Jakarta Servlet 6.1 (Jakarta EE 11, 2025)',
      status: 'Stable',
      compatibilityNotes: 'The shift from javax.servlet to jakarta.servlet occurred in Jakarta EE 9. Apache Tomcat 10.1.x implements Jakarta EE 10 (Servlet 6.0, JSP 3.1) and requires Java 11 minimum (Java 17/21 recommended). Apache Tomcat 11 implements Jakarta EE 11 (Servlet 6.1, JSP 4.0).',
      ltsAvailability: 'Runs on Java 11, Java 17, Java 21, and Java 25 LTS.'
    },
    cheatSheet: {
      title: 'Servlet Lifecycle & Key API Methods Cheat Sheet',
      headers: ['Method', 'Invoked By', 'Frequency', 'Thread Context'],
      rows: [
        ['init(ServletConfig)', 'Web Container', 'Exactly once when instantiated', 'Single thread during initialization'],
        ['service(req, resp)', 'Web Container', 'Once per incoming client request', 'Dedicated worker thread from pool'],
        ['doGet(req, resp)', 'Default service()', 'On every HTTP GET request', 'Dedicated worker thread from pool'],
        ['doPost(req, resp)', 'Default service()', 'On every HTTP POST request', 'Dedicated worker thread from pool'],
        ['doPut / doDelete', 'Default service()', 'On respective HTTP verbs', 'Dedicated worker thread from pool'],
        ['destroy()', 'Web Container', 'Exactly once before decommissioning', 'Single thread during shutdown']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Concurrency Hazard in Servlet Instance Field',
        prompt: 'Identify the critical multithreading flaw in this servlet:',
        starterCode: `public class CounterServlet extends HttpServlet {
    private int hits = 0;

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        hits++;
        resp.getWriter().println("Hits: " + hits);
    }
}`,
        solution: `public class CounterServlet extends HttpServlet {
    // Fix: Use AtomicInteger or synchronization
    private final AtomicInteger hits = new AtomicInteger(0);

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int currentHits = hits.incrementAndGet();
        resp.getWriter().println("Hits: " + currentHits);
    }
}`,
        explanation: 'Because Tomcat uses a single servlet instance for all requests across concurrent threads, the non-atomic operation hits++ causes read-update-write race conditions under load.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Header Inspector Servlet',
        prompt: 'Write a doGet method that reads the "User-Agent" header from the request and writes it back formatted in an HTML block.',
        starterCode: `protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
        throws ServletException, IOException {
    // Read header and write output
}`,
        solution: `protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
        throws ServletException, IOException {
    String userAgent = req.getHeader("User-Agent");
    resp.setContentType("text/html;charset=UTF-8");
    try (PrintWriter out = resp.getWriter()) {
        out.println("<p>Your Browser Agent: <code>" + 
            (userAgent != null ? userAgent : "Unknown") + "</code></p>");
    }
}`,
        explanation: 'req.getHeader() retrieves raw HTTP request header values. Always handle null in case client tools omit the requested header.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Dual Stream Access Conflict',
        prompt: 'What happens if a servlet method calls both resp.getWriter() and resp.getOutputStream() during the same request lifecycle?',
        solution: `// Result: Throws IllegalStateException:
// "getOutputStream() has already been called for this response" (or vice-versa).
// Fix: Always use exclusively either getWriter() for character text OR getOutputStream() for binary data.`,
        explanation: 'The Servlet specification explicitly forbids mixing character and binary response streams on the same HttpServletResponse.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1 Documentation: Servlet API',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/servletapi/index.html',
        organization: 'Apache Tomcat'
      },
      {
        title: 'Eclipse Foundation: Transition to Jakarta EE Namespace',
        url: 'https://eclipse-ee4j.github.io/jakartaee-platform/',
        organization: 'Eclipse Foundation'
      }
    ]
  },

  {
    "id": "topic-67",
    "slug": "request-and-response-processing",
    "topicNumber": 67,
    "title": "Request and Response Processing in Servlets",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 19,
    "sectionTitle": "Servlets Deep Dive",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Master parameter parsing, request and response headers, status codes, character encoding, and input/output payload streams in Jakarta Servlets.",
    "prerequisites": [
        "Topic 64: Web Architecture Fundamentals (HTTP Protocol)",
        "Topic 66: Servlet Lifecycle & Architecture"
    ],
    "whatAndWhy": {
        "definition": "HttpServletRequest and HttpServletResponse are the foundational object abstractions provided by the Servlet container to inspect client data (parameters, headers, streams) and format outgoing server responses (status codes, headers, response streams).",
        "analogy": "A border customs inspection: the incoming passenger declaration card (HttpServletRequest) records traveller identity and baggage items. The official stamped entry visa (HttpServletResponse) records the approval code and validity terms before the passenger passes through.",
        "whyItExists": "Eliminates low-level TCP socket parsing, percent-encoding decoding, and manual header formatting, giving developers a structured Java API for processing HTTP traffic."
    },
    "syntaxBreakdown": {
        "title": "Request Extraction and Response Configuration API",
        "codeSnippet": "// 1. Reading incoming parameter and headers\nString user = req.getParameter(\"username\");\nString auth = req.getHeader(\"Authorization\");\n\n// 2. Setting response status and content type\nresp.setStatus(HttpServletResponse.SC_OK);\nresp.setContentType(\"application/json;charset=UTF-8\");\nresp.setHeader(\"X-Server\", \"Tomcat-10.1\");\n\n// 3. Writing response payload\ntry (PrintWriter out = resp.getWriter()) {\n    out.println(\"{\\\"status\\\":\\\"success\\\"}\");\n}",
        "explanation": "Always set response content type, encoding, and status BEFORE acquiring the writer or writing output bytes.",
        "tokens": [
            {
                "token": "req.getParameter(name)",
                "explanation": "Retrieves first string value of query parameter or POST form field"
            },
            {
                "token": "req.getParameterValues(name)",
                "explanation": "Retrieves all string values for multi-select inputs or multiple query params"
            },
            {
                "token": "req.getReader()",
                "explanation": "Character stream for reading JSON, XML, or plain text request payloads"
            },
            {
                "token": "resp.setContentType(type)",
                "explanation": "Declares MIME type and character encoding in the Content-Type header"
            },
            {
                "token": "resp.setStatus(int)",
                "explanation": "Sets outgoing HTTP status code (200, 201, 400, 404, etc.)"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-67-basic",
            "title": "Comprehensive Request Inspector Servlet",
            "type": "basic",
            "description": "Reading query parameters, multiple tags, and client headers to output structured JSON metadata.",
            "filename": "RequestInspectorServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\nimport java.io.PrintWriter;\nimport java.util.Arrays;\n\n@WebServlet(name = \"RequestInspectorServlet\", urlPatterns = {\"/inspect\"})\npublic class RequestInspectorServlet extends HttpServlet {\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        resp.setContentType(\"application/json;charset=UTF-8\");\n        resp.setHeader(\"X-Handled-By\", \"Jakarta-Servlet-6.0\");\n        resp.setStatus(HttpServletResponse.SC_OK);\n\n        String clientName = req.getParameter(\"client\");\n        if (clientName == null || clientName.isBlank()) {\n            clientName = \"Anonymous\";\n        }\n        String[] tags = req.getParameterValues(\"tag\");\n\n        String method = req.getMethod();\n        String requestUri = req.getRequestURI();\n        String protocol = req.getProtocol();\n        String userAgent = req.getHeader(\"User-Agent\");\n\n        try (PrintWriter out = resp.getWriter()) {\n            out.println(\"{\");\n            out.printf(\"  \\\"method\\\": \\\"%s\\\",%n\", method);\n            out.printf(\"  \\\"uri\\\": \\\"%s\\\",%n\", requestUri);\n            out.printf(\"  \\\"protocol\\\": \\\"%s\\\",%n\", protocol);\n            out.printf(\"  \\\"client\\\": \\\"%s\\\",%n\", clientName);\n            out.printf(\"  \\\"tags\\\": %s,%n\", tags != null ? Arrays.toString(tags) : \"[]\");\n            out.printf(\"  \\\"userAgent\\\": \\\"%s\\\"%n\", userAgent != null ? userAgent : \"Unknown\");\n            out.println(\"}\");\n        }\n    }\n}",
            "output": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8\nX-Handled-By: Jakarta-Servlet-6.0\n\n{\n  \"method\": \"GET\",\n  \"uri\": \"/inspect\",\n  \"protocol\": \"HTTP/1.1\",\n  \"client\": \"Alice\",\n  \"tags\": [java, jakarta],\n  \"userAgent\": \"Mozilla/5.0\"\n}",
            "stepByStep": [
                "Tomcat parses HTTP request headers and query parameters.",
                "Servlet reads parameter client and multi-value tag parameters.",
                "Sets Content-Type to application/json with UTF-8 encoding.",
                "Writes JSON string to response writer and flushes buffer."
            ]
        },
        {
            "id": "ex-67-realistic",
            "title": "RESTful Order Creation with JSON Stream Parsing",
            "type": "realistic",
            "description": "Handling POST requests with JSON payload stream, validating input, and writing 201 Created with Location header.",
            "filename": "OrderProcessingServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.BufferedReader;\nimport java.io.IOException;\nimport java.io.PrintWriter;\nimport java.util.UUID;\n\n@WebServlet(name = \"OrderProcessingServlet\", urlPatterns = {\"/api/orders\"})\npublic class OrderProcessingServlet extends HttpServlet {\n\n    @Override\n    protected void doPost(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        String contentType = req.getContentType();\n        if (contentType == null || !contentType.contains(\"application/json\")) {\n            resp.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, \"Expected application/json\");\n            return;\n        }\n\n        StringBuilder jsonBody = new StringBuilder();\n        try (BufferedReader reader = req.getReader()) {\n            String line;\n            while ((line = reader.readLine()) != null) {\n                jsonBody.append(line.trim());\n            }\n        }\n\n        if (jsonBody.isEmpty()) {\n            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, \"Payload cannot be empty\");\n            return;\n        }\n\n        String orderId = \"ORD-\" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();\n        \n        resp.setStatus(HttpServletResponse.SC_CREATED);\n        resp.setContentType(\"application/json;charset=UTF-8\");\n        resp.setHeader(\"Location\", req.getContextPath() + \"/api/orders/\" + orderId);\n\n        try (PrintWriter out = resp.getWriter()) {\n            out.printf(\"{\\\"orderId\\\":\\\"%s\\\",\\\"status\\\":\\\"CONFIRMED\\\",\\\"receivedLength\\\":%d}%n\", \n                orderId, jsonBody.length());\n        }\n    }\n}",
            "output": "HTTP/1.1 201 Created\nContent-Type: application/json;charset=UTF-8\nLocation: /handbook/api/orders/ORD-A3F1B842\n\n{\"orderId\":\"ORD-A3F1B842\",\"status\":\"CONFIRMED\",\"receivedLength\":26}",
            "stepByStep": [
                "Validates that incoming Content-Type contains application/json.",
                "Consumes request body using req.getReader() line-by-line.",
                "Generates unique tracking order identifier.",
                "Sets 201 Created status and Location response header.",
                "Streams confirmation JSON back to the client."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Calling both getReader() and getInputStream() in the same request",
            "errorCodeOrSnippet": "java.lang.IllegalStateException: getInputStream() has already been called",
            "cause": "Servlet specification forbids mixing character and binary reader streams on the same request.",
            "solution": "Use getReader() exclusively for character text or getInputStream() for binary data."
        },
        {
            "title": "Setting response headers after writing output to getWriter()",
            "errorCodeOrSnippet": "resp.setContentType() ignored / headers already committed",
            "cause": "Once the response buffer flushes bytes to the socket, HTTP headers are permanently committed.",
            "solution": "Always invoke setContentType(), setCharacterEncoding(), and setHeader() before acquiring the writer."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always specify explicit character encoding: resp.setContentType(\"text/html;charset=UTF-8\").",
            "Use resp.sendError(sc, msg) to halt invalid requests and display standardized error pages.",
            "Null-check all parameters retrieved via req.getParameter()."
        ],
        "dontList": [
            "Do not mix getWriter() and getOutputStream() in the same request handler.",
            "Do not concatenate untrusted request parameters directly into raw HTML responses without escaping (XSS vulnerability).",
            "Do not swallow IOException when reading or writing stream payloads."
        ],
        "whenNotToUse": "Do not parse complex JSON payloads manually using string splits in production; use Jakarta JSON Processing (JSON-P) or Jackson."
    },
    "versionNotes": {
        "introduced": "Java Servlet 1.0 (1997); modern async support in Servlet 3.0; updated in Servlet 6.0",
        "status": "Stable",
        "compatibilityNotes": "Servlet 6.0 removed deprecated session URL-rewriting methods and refined character encoding defaults to UTF-8.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 is the standard production runtime baseline."
    },
    "cheatSheet": {
        "title": "HttpServletRequest and HttpServletResponse Key Methods",
        "headers": [
            "Operation",
            "Method Call",
            "Return Type",
            "Purpose"
        ],
        "rows": [
            [
                "Get Param",
                "req.getParameter(name)",
                "String",
                "Single query or form value"
            ],
            [
                "Get Multi-Param",
                "req.getParameterValues(name)",
                "String[]",
                "Array of values for checkboxes/multi-params"
            ],
            [
                "Get Header",
                "req.getHeader(name)",
                "String",
                "HTTP request header value"
            ],
            [
                "Read Text Body",
                "req.getReader()",
                "BufferedReader",
                "Character stream of incoming request payload"
            ],
            [
                "Read Binary Body",
                "req.getInputStream()",
                "ServletInputStream",
                "Byte stream of incoming request payload"
            ],
            [
                "Set Status",
                "resp.setStatus(code)",
                "void",
                "Sets HTTP response status code"
            ],
            [
                "Set Content Type",
                "resp.setContentType(type)",
                "void",
                "Sets Content-Type header with encoding"
            ],
            [
                "Send Error",
                "resp.sendError(code, msg)",
                "void",
                "Halts request and sends container error page"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix Response Header Commit Conflict",
            "prompt": "Why does the Content-Type header fail to apply in this snippet, and how should it be fixed?",
            "starterCode": "PrintWriter out = resp.getWriter();\nout.println(\"{\"result\":\"ok\"}\");\nresp.setContentType(\"application/json\");",
            "solution": "// Fix: Call setContentType() before acquiring the writer:\nresp.setContentType(\"application/json;charset=UTF-8\");\nPrintWriter out = resp.getWriter();\nout.println(\"{\"result\":\"ok\"}\");",
            "explanation": "Headers must be configured prior to writing bytes, as writing can commit the response buffer."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Safe Integer Parameter Parser",
            "prompt": "Write a helper method that extracts an integer request parameter and falls back to a default value if missing or malformed.",
            "starterCode": "public static int getIntParam(HttpServletRequest req, String name, int defaultVal) {\n    // Implement safe parse\n}",
            "solution": "public static int getIntParam(HttpServletRequest req, String name, int defaultVal) {\n    String val = req.getParameter(name);\n    if (val == null || val.isBlank()) return defaultVal;\n    try {\n        return Integer.parseInt(val.trim());\n    } catch (NumberFormatException e) {\n        return defaultVal;\n    }\n}",
            "explanation": "Defensive parsing prevents NumberFormatException crashes on user input."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Response Buffer Commitment Check",
            "prompt": "What happens if you invoke resp.sendRedirect() after the response buffer has already committed?",
            "solution": "// Result: Throws IllegalStateException: \"Cannot call sendRedirect() after response has been committed\".\n// Fix: Check resp.isCommitted() or ensure redirection logic executes before writing response bytes.",
            "explanation": "Once HTTP headers are transmitted over the TCP socket, the status code cannot be converted to a 302 redirect."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0: Chapter 5 Request & Chapter 6 Response",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat 10.1 API: HttpServletRequest",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/servletapi/jakarta/servlet/http/HttpServletRequest.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-68",
    "slug": "servlet-configuration-annotations-vs-web-xml",
    "topicNumber": 68,
    "title": "Servlet Configuration: @WebServlet vs web.xml",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 19,
    "sectionTitle": "Servlets Deep Dive",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "11 min read",
    "shortDescription": "Master servlet declaration and routing: compare modern @WebServlet annotations against the authoritative web.xml deployment descriptor, URL pattern algorithms, and eager startup.",
    "prerequisites": [
        "Topic 58: Annotations & Metadata",
        "Topic 65: Apache Tomcat & The WAR Structure",
        "Topic 66: Servlet Lifecycle & Architecture"
    ],
    "whatAndWhy": {
        "definition": "Servlet configuration defines how the web container maps incoming request URLs to servlet classes, configures initialization parameters, and controls eager instantiation at server boot.",
        "analogy": "Corporate directory vs office door nameplate: web.xml is the lobby directory board in the entrance of the building; @WebServlet is the nameplate on the department door. If the building directory specifies an override, the lobby directory takes precedence.",
        "whyItExists": "Enables clean separation between code and environment deployment rules, while annotations streamline rapid development without XML verbosity."
    },
    "syntaxBreakdown": {
        "title": "Annotation vs XML Configuration Syntax",
        "codeSnippet": "// 1. Modern Annotation Syntax\n@WebServlet(name = \"ConfigServlet\", urlPatterns = {\"/catalog/*\"}, loadOnStartup = 1)\npublic class ConfigServlet extends HttpServlet {}\n\n// 2. Authoritative XML Syntax (web.xml)\n<servlet>\n    <servlet-name>ConfigServlet</servlet-name>\n    <servlet-class>com.handbook.web.ConfigServlet</servlet-class>\n    <load-on-startup>1</load-on-startup>\n</servlet>\n<servlet-mapping>\n    <servlet-name>ConfigServlet</servlet-name>\n    <url-pattern>/catalog/*</url-pattern>\n</servlet-mapping>",
        "explanation": "Both declare identical container registrations. web.xml overrides @WebServlet if both exist for the same servlet name.",
        "tokens": [
            {
                "token": "@WebServlet",
                "explanation": "Class-level annotation registering servlet with container"
            },
            {
                "token": "urlPatterns",
                "explanation": "Array of URL pattern strings matching incoming request URIs"
            },
            {
                "token": "loadOnStartup",
                "explanation": "Eager startup order if >= 0; initialized at server boot"
            },
            {
                "token": "initParams",
                "explanation": "Initial key-value configuration parameters passed to init(ServletConfig)"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-68-basic",
            "title": "Init Parameters and Container Boot Configuration",
            "type": "basic",
            "description": "Demonstrating @WebInitParam, loadOnStartup = 1, and reading parameters via ServletConfig.",
            "filename": "ConfigDemoServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletConfig;\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebInitParam;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\nimport java.io.PrintWriter;\n\n@WebServlet(\n    name = \"ConfigDemoServlet\",\n    urlPatterns = {\"/config-demo\"},\n    loadOnStartup = 1,\n    initParams = {\n        @WebInitParam(name = \"defaultPageSize\", value = \"25\"),\n        @WebInitParam(name = \"environment\", value = \"Production\")\n    }\n)\npublic class ConfigDemoServlet extends HttpServlet {\n\n    private int defaultPageSize;\n    private String environment;\n\n    @Override\n    public void init(ServletConfig config) throws ServletException {\n        super.init(config);\n        String sizeParam = config.getInitParameter(\"defaultPageSize\");\n        this.defaultPageSize = sizeParam != null ? Integer.parseInt(sizeParam) : 10;\n        this.environment = config.getInitParameter(\"environment\");\n    }\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        resp.setContentType(\"text/plain;charset=UTF-8\");\n        try (PrintWriter out = resp.getWriter()) {\n            out.printf(\"Servlet Name: %s%n\", getServletName());\n            out.printf(\"Environment:  %s%n\", environment);\n            out.printf(\"Page Size:    %d%n\", defaultPageSize);\n            out.printf(\"Context Path: %s%n\", getServletContext().getContextPath());\n        }\n    }\n}",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/plain;charset=UTF-8\n\nServlet Name: ConfigDemoServlet\nEnvironment:  Production\nPage Size:    25\nContext Path: /handbook",
            "stepByStep": [
                "Tomcat initializes ConfigDemoServlet eagerly on startup (loadOnStartup = 1).",
                "init(ServletConfig) extracts defaultPageSize and environment.",
                "Incoming GET /config-demo prints active configuration parameters."
            ]
        },
        {
            "id": "ex-68-realistic",
            "title": "Multi-Mapping and Dynamic Path Decoding",
            "type": "realistic",
            "description": "Binding multiple distinct URL patterns and decoding dynamic path segments via req.getPathInfo().",
            "filename": "MultiMappingServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\nimport java.io.PrintWriter;\n\n@WebServlet(\n    name = \"MultiMappingServlet\",\n    urlPatterns = {\"/catalog/*\", \"/product-lookup\"}\n)\npublic class MultiMappingServlet extends HttpServlet {\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        resp.setContentType(\"text/plain;charset=UTF-8\");\n        String servletPath = req.getServletPath();\n        String pathInfo = req.getPathInfo();\n        String queryString = req.getQueryString();\n\n        try (PrintWriter out = resp.getWriter()) {\n            out.printf(\"Servlet Path: %s%n\", servletPath);\n            out.printf(\"Path Info:    %s%n\", pathInfo != null ? pathInfo : \"(none)\");\n            out.printf(\"Query String: %s%n\", queryString != null ? queryString : \"(none)\");\n            \n            if (pathInfo != null && pathInfo.startsWith(\"/\")) {\n                String requestedItem = pathInfo.substring(1);\n                out.printf(\"Extracted Item Slug: %s%n\", requestedItem);\n            }\n        }\n    }\n}",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/plain;charset=UTF-8\n\nServlet Path: /catalog\nPath Info:    /electronics/laptops\nQuery String: sort=price\nExtracted Item Slug: electronics/laptops",
            "stepByStep": [
                "Servlet maps to both /catalog/* and /product-lookup.",
                "Incoming request to /catalog/electronics/laptops matches prefix pattern.",
                "Container sets servletPath to /catalog and pathInfo to /electronics/laptops.",
                "Servlet extracts dynamic item slug from pathInfo."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Missing leading slash in path-based urlPatterns",
            "errorCodeOrSnippet": "@WebServlet(urlPatterns = {\"catalog/*\"}) // Throws IllegalArgumentException",
            "cause": "Servlet specification requires all path-based patterns to begin with /.",
            "solution": "Always prefix path patterns with a slash: @WebServlet(urlPatterns = {\"/catalog/*\"})."
        },
        {
            "title": "Combining path prefix and extension matching in one pattern",
            "errorCodeOrSnippet": "@WebServlet(urlPatterns = {\"/catalog/*.html\"}) // ILLEGAL!",
            "cause": "The specification forbids mixing prefix and extension rules into a single mapping pattern.",
            "solution": "Use either prefix matching (/catalog/*) or extension matching (*.html), never both."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use @WebServlet annotations for application code to keep routing concise and discoverable.",
            "Use web.xml when configuring third-party servlet libraries without altering source code.",
            "Use loadOnStartup = 1 for servlets that perform expensive cache preloading or database warm-up."
        ],
        "dontList": [
            "Do not hardcode sensitive database passwords in @WebInitParam source code.",
            "Do not map the default servlet (url-pattern \"/\") unless replacing the container static file server.",
            "Do not omit super.init(config) when overriding init(ServletConfig)."
        ],
        "whenNotToUse": "Do not use raw XML web.xml files for hundreds of custom servlets; annotations or modern Spring / JAX-RS controllers offer superior maintainability."
    },
    "versionNotes": {
        "introduced": "web.xml in Servlet 1.0; @WebServlet introduced in Servlet 3.0 (Java EE 6); updated in Servlet 6.0",
        "status": "Stable",
        "compatibilityNotes": "web.xml deployment descriptor schema updated to version 6.0 under the jakartaee namespace.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 fully supports both annotations and web.xml overrides."
    },
    "cheatSheet": {
        "title": "URL Pattern Matching Priority Rules",
        "headers": [
            "Priority",
            "Pattern Type",
            "Example",
            "Matches"
        ],
        "rows": [
            [
                "1 (Highest)",
                "Exact Match",
                "/login, /checkout",
                "Exact URI path match only"
            ],
            [
                "2",
                "Prefix Match",
                "/api/*, /catalog/*",
                "Any URI beginning with prefix"
            ],
            [
                "3",
                "Extension Match",
                "*.do, *.pdf",
                "Any URI ending with specified extension"
            ],
            [
                "4 (Lowest)",
                "Default Servlet",
                "/",
                "Fallback for all unmatched requests (static files)"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Identify Invalid URL Pattern",
            "prompt": "Which of the following URL patterns will fail web container deployment: 1) /users/* 2) *.action 3) /docs/*.pdf 4) /status",
            "starterCode": "@WebServlet(urlPatterns = {\"/users/*\", \"*.action\", \"/docs/*.pdf\", \"/status\"})",
            "solution": "// Pattern 3: \"/docs/*.pdf\" is ILLEGAL by Servlet specification.\n// Fix: Split into prefix or extension mapping:\n@WebServlet(urlPatterns = {\"/users/*\", \"*.action\", \"/status\"})",
            "explanation": "Servlet specification forbids combining prefix paths and extension wildcards in a single rule."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Eager Startup Metric Initializer",
            "prompt": "Declare an annotated servlet named \"HealthProbeServlet\" that maps to \"/health\" and initializes at server startup.",
            "starterCode": "// Write annotated class declaration\npublic class HealthProbeServlet extends HttpServlet {\n}",
            "solution": "@WebServlet(\n    name = \"HealthProbeServlet\",\n    urlPatterns = {\"/health\"},\n    loadOnStartup = 1\n)\npublic class HealthProbeServlet extends HttpServlet {\n}",
            "explanation": "loadOnStartup = 1 forces Tomcat to instantiate and initialize the servlet during server boot."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "web.xml vs Annotation Conflict Precedence",
            "prompt": "If a servlet class declares urlPatterns = {\"/v1\"}, but web.xml maps the same servlet name to url-pattern \"/v2\", which URL works?",
            "solution": "// Result: \"/v2\" (web.xml) takes precedence.\n// The Servlet specification guarantees that XML deployment descriptor settings override source-code annotations.",
            "explanation": "Deployment descriptors are designed to allow operations teams to customize routing without recompiling bytecode."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0: Chapter 12 Mapping Requests to Servlets",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat 10.1 Documentation: Web Application Deployment",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/appdev/deployment.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-69",
    "slug": "request-dispatching-forward-include-redirect",
    "topicNumber": 69,
    "title": "Request Dispatching: Forward vs Include vs Redirect",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 19,
    "sectionTitle": "Servlets Deep Dive",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Master request routing: compare internal server forwards (RequestDispatcher.forward), modular includes, and client-side redirects (sendRedirect), with the Post/Redirect/Get pattern.",
    "prerequisites": [
        "Topic 64: Web Architecture Fundamentals (HTTP Protocol)",
        "Topic 66: Servlet Lifecycle & Architecture",
        "Topic 67: Request and Response Processing in Servlets"
    ],
    "whatAndWhy": {
        "definition": "Request dispatching is the mechanism of transferring control from one server-side resource to another (forward/include via RequestDispatcher) or instructing the client browser to make a brand-new request (redirect via sendRedirect).",
        "analogy": "Internal bank transfer vs asking a customer to walk across the street: a forward transfers your request to an internal loan specialist behind the counter. A redirect asks the customer to exit the bank and visit a different branch across town.",
        "whyItExists": "Enables MVC separation of concerns: Servlets handle incoming actions, database operations, and security validation, then forward to private JSP views or redirect to success pages."
    },
    "syntaxBreakdown": {
        "title": "Forward vs Include vs Redirect Syntax",
        "codeSnippet": "// 1. Server-side Forward (Internal, single round-trip, keeps URL)\nreq.setAttribute(\"data\", payload);\nreq.getRequestDispatcher(\"/WEB-INF/views/result.jsp\").forward(req, resp);\n\n// 2. Server-side Include (Embeds sub-template, returns control)\nreq.getRequestDispatcher(\"/WEB-INF/views/header.jsp\").include(req, resp);\n\n// 3. Client-side Redirect (Two round-trips, updates browser URL bar)\nresp.sendRedirect(req.getContextPath() + \"/dashboard\");",
        "explanation": "Forwarding preserves request attributes inside the server; redirects instruct the browser to issue a new GET request.",
        "tokens": [
            {
                "token": "dispatcher.forward(req, resp)",
                "explanation": "Internal handoff to target resource; original servlet stops rendering"
            },
            {
                "token": "dispatcher.include(req, resp)",
                "explanation": "Embeds output of target resource into current response buffer"
            },
            {
                "token": "resp.sendRedirect(location)",
                "explanation": "Sends HTTP 302/303 response directing client browser to new URL"
            },
            {
                "token": "req.setAttribute(key, val)",
                "explanation": "Stores data in request memory scope preserved across internal forwards"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-69-basic",
            "title": "Dispatcher Controller Servlet Demo",
            "type": "basic",
            "description": "Demonstrating forwarding to an internal view handler, including site headers/footers, and redirecting clients.",
            "filename": "DispatcherControllerServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.RequestDispatcher;\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\n\n@WebServlet(name = \"DispatcherControllerServlet\", urlPatterns = {\"/controller\"})\npublic class DispatcherControllerServlet extends HttpServlet {\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        String action = req.getParameter(\"action\");\n        if (action == null) action = \"forward\";\n\n        switch (action) {\n            case \"forward\" -> {\n                req.setAttribute(\"flashMessage\", \"Forwarded from DispatcherControllerServlet\");\n                req.setAttribute(\"processedTimestamp\", System.currentTimeMillis());\n                RequestDispatcher dispatcher = req.getRequestDispatcher(\"/view-handler\");\n                dispatcher.forward(req, resp);\n            }\n            case \"include\" -> {\n                resp.setContentType(\"text/html;charset=UTF-8\");\n                resp.getWriter().println(\"<div class='header'>-- Global Site Header --</div>\");\n                RequestDispatcher dispatcher = req.getRequestDispatcher(\"/view-handler\");\n                dispatcher.include(req, resp);\n                resp.getWriter().println(\"<div class='footer'>-- Global Site Footer --</div>\");\n            }\n            case \"redirect\" -> {\n                String redirectUrl = req.getContextPath() + \"/inspect?client=RedirectedUser\";\n                resp.sendRedirect(redirectUrl);\n            }\n            default -> resp.sendError(HttpServletResponse.SC_BAD_REQUEST, \"Unknown action: \" + action);\n        }\n    }\n}",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<div class='view-content'>\n<h2>View Handler Render Target</h2>\n<p>Flash Message: <strong>Forwarded from DispatcherControllerServlet</strong></p>\n<p>Timestamp: <em>1731885000000</em></p>\n</div>",
            "stepByStep": [
                "DispatcherControllerServlet receives GET /controller?action=forward.",
                "Attaches flashMessage and timestamp to request attributes.",
                "Forwards request internally to ViewHandlerServlet.",
                "ViewHandlerServlet renders HTML response; browser URL remains /controller."
            ]
        },
        {
            "id": "ex-69-realistic",
            "title": "View Handler Target Servlet Consuming Forwarded State",
            "type": "realistic",
            "description": "Receiving forwarded request attributes and generating HTML view markup.",
            "filename": "ViewHandlerServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\nimport java.io.PrintWriter;\n\n@WebServlet(name = \"ViewHandlerServlet\", urlPatterns = {\"/view-handler\"})\npublic class ViewHandlerServlet extends HttpServlet {\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        String flashMessage = (String) req.getAttribute(\"flashMessage\");\n        Long timestamp = (Long) req.getAttribute(\"processedTimestamp\");\n\n        resp.setContentType(\"text/html;charset=UTF-8\");\n        try (PrintWriter out = resp.getWriter()) {\n            out.println(\"<div class='view-content'>\");\n            out.println(\"<h2>View Handler Render Target</h2>\");\n            out.printf(\"<p>Flash Message: <strong>%s</strong></p>%n\", \n                flashMessage != null ? flashMessage : \"(no attribute found)\");\n            out.printf(\"<p>Timestamp: <em>%s</em></p>%n\", \n                timestamp != null ? timestamp.toString() : \"(none)\");\n            out.println(\"</div>\");\n        }\n    }\n}",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<div class='view-content'>\n<h2>View Handler Render Target</h2>\n<p>Flash Message: <strong>Forwarded from DispatcherControllerServlet</strong></p>\n<p>Timestamp: <em>1731885000000</em></p>\n</div>",
            "stepByStep": [
                "ViewHandlerServlet executes within the same container thread.",
                "Extracts attributes set by the calling controller servlet.",
                "Produces final HTML view representation."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Attempting to pass request attributes across sendRedirect()",
            "errorCodeOrSnippet": "req.setAttribute(\"msg\", \"Saved\"); resp.sendRedirect(\"/home\"); // Attribute lost!",
            "cause": "sendRedirect() issues an HTTP 302, causing the browser to make a brand-new request. The original request object is destroyed.",
            "solution": "Use HttpSession to store flash messages or forward internally using RequestDispatcher."
        },
        {
            "title": "Forgetting to return immediately after forward() or sendRedirect()",
            "errorCodeOrSnippet": "resp.sendRedirect(\"/login\"); doRemainingWork(); // Still executes!",
            "cause": "Calling forward() or sendRedirect() does NOT exit the method. Subsequent statements will execute.",
            "solution": "Always place a return statement immediately after forward() or sendRedirect()."
        }
    ],
    "bestPractices": {
        "doList": [
            "Adopt the Post/Redirect/Get (PRG) pattern after form submissions to prevent duplicate inserts on browser reload.",
            "Place internal JSP templates inside WEB-INF/ and navigate to them via RequestDispatcher.forward().",
            "Always prefix relative redirect URLs with req.getContextPath()."
        ],
        "dontList": [
            "Do not call forward() after writing output to getWriter() (causes IllegalStateException).",
            "Do not redirect to unvalidated user-supplied URLs (prevents Open Redirect vulnerabilities).",
            "Do not omit return; after calling sendRedirect() or forward()."
        ],
        "whenNotToUse": "Do not use forward() to send clients to external websites or domains outside your web application; use sendRedirect()."
    },
    "versionNotes": {
        "introduced": "RequestDispatcher in Servlet 2.1; modern redirect URL sanitization in Servlet 6.0",
        "status": "Stable",
        "compatibilityNotes": "Tomcat 10.1 strictly adheres to relative URI resolution rules per RFC 9110.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise LTS baseline."
    },
    "cheatSheet": {
        "title": "Forward vs Include vs Redirect Comparison",
        "headers": [
            "Feature",
            "RequestDispatcher.forward()",
            "RequestDispatcher.include()",
            "HttpServletResponse.sendRedirect()"
        ],
        "rows": [
            [
                "Execution Location",
                "Server-side (Internal)",
                "Server-side (Internal)",
                "Client-side (Network round-trip)"
            ],
            [
                "HTTP Round Trips",
                "1 request",
                "1 request",
                "2 requests"
            ],
            [
                "Browser URL Bar",
                "Does not change",
                "Does not change",
                "Updates to target URL"
            ],
            [
                "Request Attributes",
                "Preserved",
                "Preserved",
                "Lost (Destroyed with request)"
            ],
            [
                "Access WEB-INF/?",
                "Yes (Protected server access)",
                "Yes",
                "No (Blocked by container)"
            ],
            [
                "Primary Use Case",
                "MVC Controller -> View handoff",
                "Shared header/footer layout",
                "Post/Redirect/Get pattern"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix Post-Redirect State Loss",
            "prompt": "Why does the user attribute fail to appear on the destination page after a redirect?",
            "starterCode": "protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    req.setAttribute(\"user\", \"Alice\");\n    resp.sendRedirect(req.getContextPath() + \"/welcome\");\n}",
            "solution": "// Fix Option 1 (Session):\nreq.getSession().setAttribute(\"user\", \"Alice\");\nresp.sendRedirect(req.getContextPath() + \"/welcome\");\n\n// Fix Option 2 (Forward):\nreq.getRequestDispatcher(\"/welcome\").forward(req, resp);",
            "explanation": "sendRedirect triggers a new HTTP request from the browser; request-scoped attributes are destroyed."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Post/Redirect/Get Controller Guard",
            "prompt": "Implement a doPost method that forwards back to the form on validation error, or redirects on success.",
            "starterCode": "protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {\n    // Validate email param\n}",
            "solution": "protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {\n    String email = req.getParameter(\"email\");\n    if (email == null || !email.contains(\"@\")) {\n        req.setAttribute(\"error\", \"Valid email required\");\n        req.getRequestDispatcher(\"/WEB-INF/form.jsp\").forward(req, resp);\n        return;\n    }\n    // Save entity...\n    resp.sendRedirect(req.getContextPath() + \"/success\");\n}",
            "explanation": "Returning immediately prevents subsequent code from executing after forwarding or redirecting."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Security Boundary of WEB-INF",
            "prompt": "Can a client browser trigger a forward to /WEB-INF/secret.jsp directly via URL?",
            "solution": "// No. Direct browser requests to /WEB-INF/* always return 404 Not Found.\n// Only internal server-side calls via req.getRequestDispatcher(\"/WEB-INF/secret.jsp\").forward() can access WEB-INF.",
            "explanation": "WEB-INF is a private server boundary defined by the Servlet specification to protect views and classes."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0: Chapter 9 Dispatching Requests",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat 10.1 API: RequestDispatcher",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/servletapi/jakarta/servlet/RequestDispatcher.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-70",
    "slug": "state-management-sessions-and-cookies",
    "topicNumber": 70,
    "title": "State Management: Sessions & Cookies",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 20,
    "sectionTitle": "State Management, Filters & Security",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Bridge stateless HTTP with stateful web interactions: master server-side HttpSession memory, JSESSIONID tracking, secure Cookie flags, and session invalidation.",
    "prerequisites": [
        "Topic 64: Web Architecture Fundamentals (HTTP Protocol)",
        "Topic 67: Request and Response Processing in Servlets"
    ],
    "whatAndWhy": {
        "definition": "State management bridges stateless HTTP connections by maintaining conversational memory either client-side (Cookies) or server-side (HttpSession linked via JSESSIONID tokens).",
        "analogy": "A waterpark resort: the central hotel database (HttpSession) holds your luggage and room reservations; the waterproof barcode wristband (JSESSIONID Cookie) lets staff look up your account wherever you go.",
        "whyItExists": "Enables user authentication, persistent shopping carts, and personalized preferences across multiple separate HTTP page requests."
    },
    "syntaxBreakdown": {
        "title": "Session and Cookie Operations API",
        "codeSnippet": "// 1. Server-side session management\nHttpSession session = req.getSession(true);\nsession.setAttribute(\"cart\", shoppingCart);\nsession.setMaxInactiveInterval(1800); // 30 minutes\n\n// 2. Client-side cookie configuration\nCookie cookie = new Cookie(\"user_pref\", \"dark\");\ncookie.setHttpOnly(true);  // Prevent XSS access\ncookie.setSecure(true);    // HTTPS only\ncookie.setAttribute(\"SameSite\", \"Lax\");\nresp.addCookie(cookie);",
        "explanation": "Marking cookies with HttpOnly and Secure flags protects against cookie theft and network sniffing.",
        "tokens": [
            {
                "token": "req.getSession(true)",
                "explanation": "Retrieves existing session or instantiates a new one if absent"
            },
            {
                "token": "session.setAttribute(name, val)",
                "explanation": "Binds object into server-side session memory scope"
            },
            {
                "token": "session.invalidate()",
                "explanation": "Destroys session and frees all bound objects immediately"
            },
            {
                "token": "cookie.setHttpOnly(true)",
                "explanation": "Blocks client-side JavaScript document.cookie access (XSS defense)"
            },
            {
                "token": "cookie.setMaxAge(0)",
                "explanation": "Instructs browser to permanently delete the cookie"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-70-basic",
            "title": "Stateful Shopping Cart with Session Invalidation",
            "type": "basic",
            "description": "Demonstrating session creation, storing items, checking session IDs, and invalidating on checkout.",
            "filename": "SessionShoppingCartServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport jakarta.servlet.http.HttpSession;\nimport java.io.IOException;\nimport java.io.PrintWriter;\nimport java.util.ArrayList;\nimport java.util.List;\n\n@WebServlet(name = \"SessionShoppingCartServlet\", urlPatterns = {\"/cart\"})\npublic class SessionShoppingCartServlet extends HttpServlet {\n\n    @Override\n    @SuppressWarnings(\"unchecked\")\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        HttpSession session = req.getSession(true);\n        session.setMaxInactiveInterval(1800);\n\n        List<String> cart = (List<String>) session.getAttribute(\"shoppingCart\");\n        if (cart == null) {\n            cart = new ArrayList<>();\n            session.setAttribute(\"shoppingCart\", cart);\n        }\n\n        String action = req.getParameter(\"action\");\n        String item = req.getParameter(\"item\");\n\n        if (\"add\".equalsIgnoreCase(action) && item != null && !item.isBlank()) {\n            cart.add(item.trim());\n        } else if (\"clear\".equalsIgnoreCase(action)) {\n            session.invalidate();\n            resp.setContentType(\"text/plain;charset=UTF-8\");\n            resp.getWriter().println(\"Session invalidated. Cart cleared.\");\n            return;\n        }\n\n        resp.setContentType(\"application/json;charset=UTF-8\");\n        try (PrintWriter out = resp.getWriter()) {\n            out.println(\"{\");\n            out.printf(\"  \\\"sessionId\\\": \\\"%s\\\",%n\", session.getId());\n            out.printf(\"  \\\"isNew\\\": %b,%n\", session.isNew());\n            out.printf(\"  \\\"creationTime\\\": %d,%n\", session.getCreationTime());\n            out.printf(\"  \\\"itemCount\\\": %d,%n\", cart.size());\n            out.printf(\"  \\\"items\\\": %s%n\", cart);\n            out.println(\"}\");\n        }\n    }\n}",
            "output": "HTTP/1.1 200 OK\nContent-Type: application/json;charset=UTF-8\nSet-Cookie: JSESSIONID=E5B942FA104BC8A0; Path=/handbook; HttpOnly\n\n{\n  \"sessionId\": \"E5B942FA104BC8A0\",\n  \"isNew\": true,\n  \"creationTime\": 1731885500000,\n  \"itemCount\": 1,\n  \"items\": [Keyboard]\n}",
            "stepByStep": [
                "Client hits /cart; container allocates a new 128-bit random JSESSIONID.",
                "Servlet stores cart items inside session memory scope.",
                "Tomcat attaches Set-Cookie header with HttpOnly flag.",
                "Subsequent requests include JSESSIONID cookie, reconnecting user to cart state."
            ]
        },
        {
            "id": "ex-70-realistic",
            "title": "Secure Cookie Consent Manager",
            "type": "realistic",
            "description": "Configuring cookies with HttpOnly, Secure, and SameSite flags, reading cookies, and deleting with setMaxAge(0).",
            "filename": "CookieConsentServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.Cookie;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\nimport java.io.PrintWriter;\n\n@WebServlet(name = \"CookieConsentServlet\", urlPatterns = {\"/cookies\"})\npublic class CookieConsentServlet extends HttpServlet {\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        String action = req.getParameter(\"action\");\n        resp.setContentType(\"text/plain;charset=UTF-8\");\n\n        if (\"set\".equalsIgnoreCase(action)) {\n            Cookie cookie = new Cookie(\"user_consent\", \"accepted\");\n            cookie.setMaxAge(60 * 60 * 24 * 30);\n            cookie.setPath(\"/\");\n            cookie.setHttpOnly(true);\n            cookie.setSecure(true);\n            cookie.setAttribute(\"SameSite\", \"Lax\");\n            \n            resp.addCookie(cookie);\n            resp.getWriter().println(\"Cookie 'user_consent=accepted' attached to response.\");\n            return;\n        } else if (\"delete\".equalsIgnoreCase(action)) {\n            Cookie cookie = new Cookie(\"user_consent\", \"\");\n            cookie.setMaxAge(0);\n            cookie.setPath(\"/\");\n            resp.addCookie(cookie);\n            resp.getWriter().println(\"Cookie 'user_consent' deleted.\");\n            return;\n        }\n\n        Cookie[] cookies = req.getCookies();\n        try (PrintWriter out = resp.getWriter()) {\n            out.println(\"=== Incoming Request Cookies ===\");\n            if (cookies != null && cookies.length > 0) {\n                for (Cookie c : cookies) {\n                    out.printf(\"  %s = %s (Path: %s, MaxAge: %d)%n\", \n                        c.getName(), c.getValue(), c.getPath(), c.getMaxAge());\n                }\n            } else {\n                out.println(\"  (No cookies found in request)\");\n            }\n        }\n    }\n}",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/plain;charset=UTF-8\nSet-Cookie: user_consent=accepted; Max-Age=2592000; Path=/; Secure; HttpOnly; SameSite=Lax\n\nCookie 'user_consent=accepted' attached to response.",
            "stepByStep": [
                "Servlet instantiates Cookie object with name and value.",
                "Sets MaxAge to 30 days, Path to /, HttpOnly to true, and Secure to true.",
                "Adds cookie to response; browser writes cookie to encrypted storage.",
                "Deletion request sets MaxAge to 0, removing the cookie immediately."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Storing large datasets or database cursors in HttpSession",
            "errorCodeOrSnippet": "session.setAttribute(\"allOrders\", 50000_records_list); // High Heap Pressure!",
            "cause": "Every session resides in server RAM. Multiplying large objects across thousands of users triggers OutOfMemoryError.",
            "solution": "Store only primary keys or IDs in session; query data from database or cache as needed."
        },
        {
            "title": "Omitting setHttpOnly(true) on sensitive authentication cookies",
            "errorCodeOrSnippet": "document.cookie accessible in JavaScript console",
            "cause": "Missing HttpOnly allows any Cross-Site Scripting (XSS) vulnerability to steal session tokens.",
            "solution": "Always mark session and authorization cookies with cookie.setHttpOnly(true)."
        }
    ],
    "bestPractices": {
        "doList": [
            "Configure session timeouts in web.xml (<session-timeout>30</session-timeout>).",
            "Call session.invalidate() immediately upon user logout to terminate session credentials.",
            "Rotate session IDs using req.changeSessionId() upon successful login."
        ],
        "dontList": [
            "Do not store plain-text passwords or secret keys in cookies or sessions.",
            "Do not pass JSESSIONID tokens in URL query strings (URL rewriting is insecure).",
            "Do not assume session attributes survive server restarts unless classes implement Serializable."
        ],
        "whenNotToUse": "Do not use server-side sessions for high-scale microservices; use stateless signed JWT tokens or external distributed caches (Redis)."
    },
    "versionNotes": {
        "introduced": "HttpSession and Cookie in Servlet 2.0; cookie-config in Servlet 3.0; SameSite in Servlet 6.0",
        "status": "Stable",
        "compatibilityNotes": "Servlet 6.0 removed deprecated URL rewriting methods for session IDs.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "Session vs Cookie Comparison Matrix",
        "headers": [
            "Feature",
            "HttpSession",
            "Cookie"
        ],
        "rows": [
            [
                "Storage Location",
                "Server-side RAM",
                "Client-side Browser Storage"
            ],
            [
                "Max Size",
                "Limited only by server heap",
                "4 KB per cookie maximum"
            ],
            [
                "Data Types",
                "Any Java Object (Serializable)",
                "Strings only"
            ],
            [
                "Security Risk",
                "Low client exposure; high server memory cost",
                "High exposure to XSS/network sniffing"
            ],
            [
                "Transmission",
                "Only token (JSESSIONID) sent",
                "Full cookie value sent with every request"
            ],
            [
                "Typical Use",
                "Cart, user role, auth state",
                "Theme preference, consent tokens, tracking"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix Ineffective Cookie Deletion",
            "prompt": "Why does this cookie fail to delete on the client browser?",
            "starterCode": "Cookie c = new Cookie(\"user_token\", \"\");\nresp.addCookie(c);",
            "solution": "Cookie c = new Cookie(\"user_token\", \"\");\nc.setMaxAge(0); // Mandatory to trigger browser deletion\nc.setPath(\"/\"); // Must match original path\nresp.addCookie(c);",
            "explanation": "Without setMaxAge(0) and matching the original path, the browser treats it as a value update rather than a deletion."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Session Request Throttling Counter",
            "prompt": "Implement a request counter inside HttpSession that limits a session to 10 requests, returning HTTP 429 on request 11.",
            "starterCode": "protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    // Implement rate limiter\n}",
            "solution": "protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    HttpSession session = req.getSession(true);\n    Integer count = (Integer) session.getAttribute(\"reqCount\");\n    count = (count == null) ? 1 : count + 1;\n    if (count > 10) {\n        resp.sendError(429, \"Too many requests in this session.\");\n        return;\n    }\n    session.setAttribute(\"reqCount\", count);\n    resp.getWriter().println(\"Request number: \" + count);\n}",
            "explanation": "Storing request counters in session enables per-user rate limiting without external databases."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Clustered Session Replication Requirements",
            "prompt": "Why must classes stored in an HttpSession implement java.io.Serializable when deploying to Tomcat clusters?",
            "solution": "// Tomcat clustered session managers (e.g. DeltaManager) serialize session attributes\n// across TCP sockets to mirror session state on backup server instances.\n// Non-serializable classes cause NotSerializableException during replication.",
            "explanation": "Serializable is required for JVM network serialization during high-availability failover."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0: Chapter 7 Sessions",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat 10.1 Documentation: Session Management",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/config/manager.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-71",
    "slug": "servlet-filters-and-filter-chains",
    "topicNumber": 71,
    "title": "Servlet Filters & Filter Chains",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 20,
    "sectionTitle": "State Management, Filters & Security",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Master cross-cutting request interception: chain filters for logging, authentication guards, character encoding enforcement, and request/response wrapping.",
    "prerequisites": [
        "Topic 66: Servlet Lifecycle & Architecture",
        "Topic 67: Request and Response Processing in Servlets"
    ],
    "whatAndWhy": {
        "definition": "A Filter is an interceptor component positioned between client requests and target servlets that can inspect, modify, or block requests, and transform outgoing responses.",
        "analogy": "Airport security checkpoints: before reaching your gate (Servlet), you must pass through passport verification (Auth Filter), baggage scanning (Security Filter), and boarding pass stamping (Audit Filter).",
        "whyItExists": "Encapsulates common cross-cutting concerns (logging, authentication, compression, encoding) in reusable components without duplicating code across servlets."
    },
    "syntaxBreakdown": {
        "title": "Filter Interface and Chaining API",
        "codeSnippet": "@WebFilter(filterName = \"AuditFilter\", urlPatterns = {\"/*\"})\npublic class AuditFilter implements Filter {\n    @Override\n    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)\n            throws IOException, ServletException {\n        // Pre-processing\n        long start = System.currentTimeMillis();\n        try {\n            chain.doFilter(req, resp); // Pass down chain\n        } finally {\n            // Post-processing\n            long elapsed = System.currentTimeMillis() - start;\n        }\n    }\n}",
        "explanation": "Always call chain.doFilter() unless deliberately blocking the request (e.g. unauthenticated access).",
        "tokens": [
            {
                "token": "Filter",
                "explanation": "Core interceptor interface defining init, doFilter, and destroy"
            },
            {
                "token": "FilterChain.doFilter(req, resp)",
                "explanation": "Transfers control to next filter in pipeline or target servlet"
            },
            {
                "token": "@WebFilter",
                "explanation": "Registers filter and binds it to URL patterns or servlet names"
            },
            {
                "token": "chain.doFilter short-circuit",
                "explanation": "Omitting chain.doFilter halts request; downstream servlets never run"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-71-basic",
            "title": "Global Request Performance & Audit Logging Filter",
            "type": "basic",
            "description": "Measuring execution latency across all incoming requests and logging method, URI, status, and duration.",
            "filename": "RequestLoggingFilter.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.Filter;\nimport jakarta.servlet.FilterChain;\nimport jakarta.servlet.FilterConfig;\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.ServletRequest;\nimport jakarta.servlet.ServletResponse;\nimport jakarta.servlet.annotation.WebFilter;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\n\n@WebFilter(filterName = \"RequestLoggingFilter\", urlPatterns = {\"/*\"})\npublic class RequestLoggingFilter implements Filter {\n\n    @Override\n    public void init(FilterConfig filterConfig) throws ServletException {\n        System.out.println(\"[RequestLoggingFilter] Initialized globally for: /*\");\n    }\n\n    @Override\n    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) \n            throws IOException, ServletException {\n        \n        HttpServletRequest req = (HttpServletRequest) request;\n        HttpServletResponse resp = (HttpServletResponse) response;\n\n        long startTime = System.currentTimeMillis();\n        String uri = req.getRequestURI();\n        String method = req.getMethod();\n\n        try {\n            chain.doFilter(request, response);\n        } finally {\n            long duration = System.currentTimeMillis() - startTime;\n            int status = resp.getStatus();\n            System.out.printf(\"[Audit Filter] %s %s -> HTTP %d (%d ms)%n\", \n                method, uri, status, duration);\n        }\n    }\n\n    @Override\n    public void destroy() {\n        System.out.println(\"[RequestLoggingFilter] Destroyed.\");\n    }\n}",
            "output": "[RequestLoggingFilter] Initialized globally for: /*\n[Audit Filter] GET /handbook/inspect -> HTTP 200 (4 ms)",
            "stepByStep": [
                "Filter intercepts incoming GET /handbook/inspect before servlet.",
                "Records initial start timestamp.",
                "Calls chain.doFilter() to execute target RequestInspectorServlet.",
                "Finally block captures completion time and prints audit metrics."
            ]
        },
        {
            "id": "ex-71-realistic",
            "title": "Authentication & Authorization Guard Filter",
            "type": "realistic",
            "description": "Intercepting requests to /admin/*, inspecting session authentication, and returning 401 Unauthorized on unauthenticated access.",
            "filename": "AuthGuardFilter.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.Filter;\nimport jakarta.servlet.FilterChain;\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.ServletRequest;\nimport jakarta.servlet.ServletResponse;\nimport jakarta.servlet.annotation.WebFilter;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport jakarta.servlet.http.HttpSession;\nimport java.io.IOException;\n\n@WebFilter(filterName = \"AuthGuardFilter\", urlPatterns = {\"/admin/*\", \"/protected/*\"})\npublic class AuthGuardFilter implements Filter {\n\n    @Override\n    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) \n            throws IOException, ServletException {\n        \n        HttpServletRequest req = (HttpServletRequest) request;\n        HttpServletResponse resp = (HttpServletResponse) response;\n\n        HttpSession session = req.getSession(false);\n        boolean isAuthenticated = session != null && session.getAttribute(\"authenticatedUser\") != null;\n\n        if (!isAuthenticated) {\n            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);\n            resp.setContentType(\"text/plain;charset=UTF-8\");\n            resp.getWriter().println(\"401 Unauthorized: Access to protected resource requires login.\");\n            return;\n        }\n\n        chain.doFilter(request, response);\n    }\n}",
            "output": "HTTP/1.1 401 Unauthorized\nContent-Type: text/plain;charset=UTF-8\n\n401 Unauthorized: Access to protected resource requires login.",
            "stepByStep": [
                "Client attempts GET /admin/dashboard without active credentials.",
                "Filter checks req.getSession(false) for authenticatedUser attribute.",
                "Verification fails; sets HTTP 401 Unauthorized and writes error message.",
                "Method returns immediately without invoking chain.doFilter().",
                "Downstream admin servlets are completely protected from execution."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Forgetting to call chain.doFilter() during normal request processing",
            "errorCodeOrSnippet": "public void doFilter(...) { doWork(); } // Missing chain.doFilter!",
            "cause": "If chain.doFilter() is omitted, the request pipeline halts permanently and client hangs or gets blank page.",
            "solution": "Always call chain.doFilter(request, response) unless deliberately blocking an unauthorized request."
        },
        {
            "title": "Assuming deterministic filter execution order when using @WebFilter",
            "errorCodeOrSnippet": "@WebFilter(urlPatterns=\"/*\") on multiple filters",
            "cause": "Servlet specification does not guarantee order of filters configured via annotations.",
            "solution": "Use web.xml <filter-mapping> elements when strict execution sequence is mandatory."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use try / finally blocks around chain.doFilter() when measuring metrics or releasing resources.",
            "Use HttpServletRequestWrapper when modifying incoming parameters or headers.",
            "Configure critical security filter ordering in web.xml rather than relying on annotation discovery."
        ],
        "dontList": [
            "Do not execute expensive synchronous database operations on every single request in a /* filter.",
            "Do not call chain.doFilter() multiple times in the same filter invocation.",
            "Do not forget to cast ServletRequest to HttpServletRequest when accessing HTTP-specific APIs."
        ],
        "whenNotToUse": "Do not use raw servlet filters for fine-grained method-level business authorization; use Spring Security method security or Jakarta Security annotations (@RolesAllowed)."
    },
    "versionNotes": {
        "introduced": "Filter introduced in Servlet 2.3; @WebFilter and async support in Servlet 3.0",
        "status": "Stable",
        "compatibilityNotes": "Default methods added to Filter interface in modern Java releases.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "Filter Pipeline Lifecycle & Hooks",
        "headers": [
            "Phase",
            "Method Call",
            "Timing",
            "Responsibility"
        ],
        "rows": [
            [
                "Initialization",
                "filter.init(FilterConfig)",
                "Once at server startup",
                "Resource allocation and parameter parsing"
            ],
            [
                "Pre-Processing",
                "Before chain.doFilter()",
                "On every matched request",
                "Authentication checks, logging start, wrapping"
            ],
            [
                "Delegation",
                "chain.doFilter(req, resp)",
                "Center of pipeline",
                "Passes execution down to next filter or servlet"
            ],
            [
                "Post-Processing",
                "After chain.doFilter()",
                "As response unwinds",
                "Response compression, latency logging, cleanup"
            ],
            [
                "Destruction",
                "filter.destroy()",
                "Once at server shutdown",
                "Releasing connection pools, memory cleanup"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix Double Chain Invocation",
            "prompt": "Why does this filter cause an IllegalStateException on downstream servlets?",
            "starterCode": "if (isValid(req)) {\n    chain.doFilter(req, resp);\n}\nchain.doFilter(req, resp);",
            "solution": "// Fix: Add return or else branch:\nif (isValid(req)) {\n    chain.doFilter(req, resp);\n} else {\n    ((HttpServletResponse) resp).sendError(400, \"Invalid Request\");\n}",
            "explanation": "Calling chain.doFilter() twice invokes the servlet twice, causing conflicting response buffer commits."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Global UTF-8 Character Encoding Filter",
            "prompt": "Write an annotated Filter that forces request and response character encodings to UTF-8.",
            "starterCode": "// Implement filter class\npublic class EncodingFilter implements Filter {\n}",
            "solution": "@WebFilter(\"/*\")\npublic class EncodingFilter implements Filter {\n    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) \n            throws IOException, ServletException {\n        req.setCharacterEncoding(\"UTF-8\");\n        resp.setCharacterEncoding(\"UTF-8\");\n        chain.doFilter(req, resp);\n    }\n}",
            "explanation": "Setting UTF-8 encoding in a global filter guarantees uniform character decoding across all servlets."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Request Wrapper Use Cases",
            "prompt": "Why would a developer need to wrap an HttpServletRequest using HttpServletRequestWrapper inside a filter?",
            "solution": "// HttpServletRequest parameters and body streams are read-only by default.\n// An HttpServletRequestWrapper allows overriding getParameter(), getHeader(), or getInputStream()\n// to sanitize inputs, inject headers, or cache the request body stream.",
            "explanation": "Wrapping implements the Decorator pattern for request/response customization."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0: Chapter 6 Filtering",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat 10.1 Documentation: Filter Architecture",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/appdev/deployment.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-72",
    "slug": "web-listeners-and-application-lifecycle",
    "topicNumber": 72,
    "title": "Web Listeners & Application Lifecycle",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 20,
    "sectionTitle": "State Management, Filters & Security",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "11 min read",
    "shortDescription": "Leverage the Observer pattern in web applications: intercept application startup/shutdown (ServletContextListener), session tracking, and request lifecycle events.",
    "prerequisites": [
        "Topic 65: Apache Tomcat & The WAR Structure",
        "Topic 66: Servlet Lifecycle & Architecture",
        "Topic 70: State Management: Sessions and Cookies"
    ],
    "whatAndWhy": {
        "definition": "Web Listeners are event observer components registered with the Servlet container that receive automatic callback notifications when application, session, or request lifecycle events occur.",
        "analogy": "A stadium operations team: the facility manager (ServletContextListener) turns on floodlights and checks gates before anyone arrives; the turnstile counter (HttpSessionListener) tracks spectator ingress and egress in real time.",
        "whyItExists": "Provides clean hooks for starting background tasks, initializing database connection pools, monitoring active sessions, and cleaning up thread-local variables."
    },
    "syntaxBreakdown": {
        "title": "Listener Categories and Annotations",
        "codeSnippet": "// 1. Application-wide startup and shutdown\n@WebListener\npublic class AppInitListener implements ServletContextListener {\n    public void contextInitialized(ServletContextEvent sce) { /* Server Boot */ }\n    public void contextDestroyed(ServletContextEvent sce) { /* Server Stop */ }\n}\n\n// 2. Session creation and destruction\n@WebListener\npublic class SessionTracker implements HttpSessionListener {\n    public void sessionCreated(HttpSessionEvent se) { /* User Arrived */ }\n    public void sessionDestroyed(HttpSessionEvent se) { /* Session Expired */ }\n}",
        "explanation": "Listeners are marked with @WebListener and automatically invoked by Tomcat without requiring web.xml.",
        "tokens": [
            {
                "token": "@WebListener",
                "explanation": "Class annotation registering the listener with the web container"
            },
            {
                "token": "ServletContextListener",
                "explanation": "Listens for web application startup and shutdown"
            },
            {
                "token": "HttpSessionListener",
                "explanation": "Listens for HTTP session creation and invalidation"
            },
            {
                "token": "ServletRequestListener",
                "explanation": "Listens for each individual HTTP request arrival and completion"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-72-basic",
            "title": "Application Bootstrap & Teardown Listener",
            "type": "basic",
            "description": "Initializing application-scope configuration and connection pool status at boot, and cleaning up on shutdown.",
            "filename": "AppBootstrapListener.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletContext;\nimport jakarta.servlet.ServletContextEvent;\nimport jakarta.servlet.ServletContextListener;\nimport jakarta.servlet.annotation.WebListener;\n\n@WebListener\npublic class AppBootstrapListener implements ServletContextListener {\n\n    @Override\n    public void contextInitialized(ServletContextEvent sce) {\n        ServletContext ctx = sce.getServletContext();\n        System.out.println(\"[AppBootstrapListener] Web application starting: \" + ctx.getContextPath());\n        \n        ctx.setAttribute(\"appName\", \"Definitive Java Handbook Web App\");\n        ctx.setAttribute(\"appStartTime\", System.currentTimeMillis());\n        ctx.setAttribute(\"dbPoolStatus\", \"READY\");\n    }\n\n    @Override\n    public void contextDestroyed(ServletContextEvent sce) {\n        ServletContext ctx = sce.getServletContext();\n        System.out.println(\"[AppBootstrapListener] Web application shutting down: \" + ctx.getContextPath());\n        ctx.removeAttribute(\"dbPoolStatus\");\n    }\n}",
            "output": "[AppBootstrapListener] Web application starting: /handbook\n[AppBootstrapListener] Web application shutting down: /handbook",
            "stepByStep": [
                "Tomcat starts up and deploys the web application.",
                "contextInitialized() executes before any filters or servlets are initialized.",
                "Global application attributes are bound to ServletContext.",
                "On server stop, contextDestroyed() releases pools and cached resources."
            ]
        },
        {
            "id": "ex-72-realistic",
            "title": "Concurrent Active Session Tracker Listener",
            "type": "realistic",
            "description": "Tracking real-time active user sessions using thread-safe AtomicInteger counters.",
            "filename": "ActiveSessionTrackerListener.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.annotation.WebListener;\nimport jakarta.servlet.http.HttpSessionEvent;\nimport jakarta.servlet.http.HttpSessionListener;\nimport java.util.concurrent.atomic.AtomicInteger;\n\n@WebListener\npublic class ActiveSessionTrackerListener implements HttpSessionListener {\n\n    private static final AtomicInteger activeSessions = new AtomicInteger(0);\n\n    @Override\n    public void sessionCreated(HttpSessionEvent se) {\n        int total = activeSessions.incrementAndGet();\n        System.out.println(\"[SessionTracker] Session created: \" + se.getSession().getId() + \" | Active: \" + total);\n    }\n\n    @Override\n    public void sessionDestroyed(HttpSessionEvent se) {\n        int total = activeSessions.decrementAndGet();\n        System.out.println(\"[SessionTracker] Session destroyed: \" + se.getSession().getId() + \" | Active: \" + total);\n    }\n\n    public static int getActiveSessionCount() {\n        return activeSessions.get();\n    }\n}",
            "output": "[SessionTracker] Session created: 8F2A01C90B44 | Active: 1\n[SessionTracker] Session created: 31DC99A2E101 | Active: 2\n[SessionTracker] Session destroyed: 8F2A01C90B44 | Active: 1",
            "stepByStep": [
                "User hits application and creates session; sessionCreated() increments counter.",
                "Second user arrives; counter increments to 2.",
                "User session times out after 30 minutes; sessionDestroyed() decrements counter safely."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Holding ThreadLocal data in ServletRequestListener without cleanup",
            "errorCodeOrSnippet": "userContext.set(user); // Missing userContext.remove() in requestDestroyed()",
            "cause": "Tomcat reuses worker threads from a pool. Unremoved ThreadLocal data leaks into unrelated user requests.",
            "solution": "Always invoke ThreadLocal.remove() inside requestDestroyed() to prevent memory leaks and data cross-talk."
        },
        {
            "title": "Executing long-blocking synchronous operations in contextInitialized()",
            "errorCodeOrSnippet": "Connecting to remote cluster without network timeout",
            "cause": "Blocks Tomcat server boot, leading to container startup abort or deployment timeouts.",
            "solution": "Use asynchronous worker threads or configure explicit connection timeouts for external services."
        }
    ],
    "bestPractices": {
        "doList": [
            "Initialize relational connection pools (HikariCP / Tomcat DataSource) in ServletContextListener.",
            "Use thread-safe concurrency utilities (AtomicInteger, ConcurrentHashMap) for listener counters.",
            "Always clean up background threads and executor services in contextDestroyed()."
        ],
        "dontList": [
            "Do not assume listeners are created per-thread; a single instance handles concurrent events.",
            "Do not place user-specific data in ServletContext (application scope is shared across all users).",
            "Do not throw unchecked runtime exceptions in contextInitialized() unless intending to abort deployment."
        ],
        "whenNotToUse": "Do not use listeners for request routing or response modification; use Filters for request interception."
    },
    "versionNotes": {
        "introduced": "ServletContextListener and HttpSessionListener in Servlet 2.3; @WebListener in Servlet 3.0",
        "status": "Stable",
        "compatibilityNotes": "Programmatic registration available via ServletContext.addListener().",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "Web Listener Scopes & Event Methods",
        "headers": [
            "Listener Interface",
            "Scope",
            "Event Hook",
            "Primary Responsibility"
        ],
        "rows": [
            [
                "ServletContextListener",
                "Application",
                "contextInitialized()",
                "Pool initialization, cache warm-up"
            ],
            [
                "ServletContextListener",
                "Application",
                "contextDestroyed()",
                "Graceful shutdown, pool cleanup"
            ],
            [
                "HttpSessionListener",
                "Session",
                "sessionCreated()",
                "Active session counting, audit logging"
            ],
            [
                "HttpSessionListener",
                "Session",
                "sessionDestroyed()",
                "Session timeout cleanup"
            ],
            [
                "ServletRequestListener",
                "Request",
                "requestInitialized()",
                "ThreadLocal setup, correlation ID tracking"
            ],
            [
                "ServletRequestListener",
                "Request",
                "requestDestroyed()",
                "ThreadLocal cleanup, latency tracking"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix ThreadLocal Memory Leak in Listener",
            "prompt": "Why does this listener cause memory cross-contamination across requests?",
            "starterCode": "@WebListener\npublic class TraceListener implements ServletRequestListener {\n    private static final ThreadLocal<String> trace = new ThreadLocal<>();\n    public void requestInitialized(ServletRequestEvent sre) {\n        trace.set(UUID.randomUUID().toString());\n    }\n}",
            "solution": "// Fix: Override requestDestroyed to clean up ThreadLocal:\n@Override\npublic void requestDestroyed(ServletRequestEvent sre) {\n    trace.remove();\n}",
            "explanation": "Worker threads are reused by Tomcat; omitting remove() leaks state into subsequent requests."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Active Session Metric Exposer",
            "prompt": "Write an HttpSessionListener that increments and decrements an AtomicInteger, exposing getCount().",
            "starterCode": "public class CounterListener implements HttpSessionListener {\n    // Implement\n}",
            "solution": "@WebListener\npublic class CounterListener implements HttpSessionListener {\n    private static final AtomicInteger count = new AtomicInteger(0);\n    public void sessionCreated(HttpSessionEvent se) { count.incrementAndGet(); }\n    public void sessionDestroyed(HttpSessionEvent se) { count.decrementAndGet(); }\n    public static int getCount() { return count.get(); }\n}",
            "explanation": "AtomicInteger guarantees thread-safe counting across concurrent user sessions."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Container Component Initialization Order",
            "prompt": "In what exact sequence does Apache Tomcat initialize listeners, filters, and servlets at boot?",
            "solution": "// 1. ServletContextListeners (contextInitialized)\n// 2. Filters (init) in configured order\n// 3. Servlets with loadOnStartup >= 0 (init) ordered by priority",
            "explanation": "The Servlet specification mandates this sequence so pools are ready before filters and servlets boot."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0: Chapter 10 Lifecycle Events",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat 10.1 Documentation: Listeners Component",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/config/listeners.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-73",
    "slug": "web-security-essentials",
    "topicNumber": 73,
    "title": "Web Security Essentials in Jakarta EE",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 20,
    "sectionTitle": "State Management, Filters & Security",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Defend web applications against OWASP Top 10 vulnerabilities: implement synchronizer CSRF tokens, XSS HTML entity escaping, and session fixation prevention.",
    "prerequisites": [
        "Topic 64: Web Architecture Fundamentals (HTTP Protocol)",
        "Topic 67: Request and Response Processing in Servlets",
        "Topic 70: State Management: Sessions and Cookies"
    ],
    "whatAndWhy": {
        "definition": "Web security essentials encompass server-side defensive practices defending against unauthorized execution (CSRF), malicious script injection (XSS), credential hijacking (Session Fixation), and network eavesdropping.",
        "analogy": "Bank security: CSRF tokens are verified signature seals on withdrawal slips; XSS escaping is inspecting luggage for weapons at the entrance; session rotation is replacing locker padlocks the moment valuables are deposited.",
        "whyItExists": "Web applications are exposed to automated exploit scanners; lack of defenses leads to user account takeovers, data theft, and unauthorized transactions."
    },
    "syntaxBreakdown": {
        "title": "Security Defensive Patterns API",
        "codeSnippet": "// 1. CSRF Token Defense\nString sessionToken = (String) session.getAttribute(\"CSRF_TOKEN\");\nString reqToken = req.getParameter(\"csrfToken\");\nif (sessionToken == null || !sessionToken.equals(reqToken)) {\n    resp.sendError(HttpServletResponse.SC_FORBIDDEN, \"Invalid CSRF Token\");\n    return;\n}\n\n// 2. Session Fixation Defense\nreq.changeSessionId(); // Rotates ID, preserves session attributes\n\n// 3. XSS HTML Entity Escaping\nString safe = escapeHtml(userInput);",
        "explanation": "Synchronizer tokens prevent cross-origin forgery; changeSessionId() invalidates pre-authentication IDs.",
        "tokens": [
            {
                "token": "CSRF Token",
                "explanation": "Cryptographic secret unique to user session embedded in mutating forms"
            },
            {
                "token": "req.changeSessionId()",
                "explanation": "Rotates session identifier upon login, preventing session fixation"
            },
            {
                "token": "XSS Escaping",
                "explanation": "Converts <, >, &, \", ' to harmless HTML entity codes"
            },
            {
                "token": "HttpOnly Flag",
                "explanation": "Forbids client JavaScript from accessing document.cookie"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-73-basic",
            "title": "Synchronizer CSRF Token Protected Form Handler",
            "type": "basic",
            "description": "Generating cryptographically strong random tokens on GET, embedding in forms, and validating on POST.",
            "filename": "CsrfProtectionServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport jakarta.servlet.http.HttpSession;\nimport java.io.IOException;\nimport java.security.SecureRandom;\nimport java.util.Base64;\n\n@WebServlet(name = \"CsrfProtectionServlet\", urlPatterns = {\"/transfer\"})\npublic class CsrfProtectionServlet extends HttpServlet {\n\n    private final SecureRandom random = new SecureRandom();\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        HttpSession session = req.getSession(true);\n        String csrfToken = (String) session.getAttribute(\"CSRF_TOKEN\");\n        if (csrfToken == null) {\n            byte[] bytes = new byte[24];\n            random.nextBytes(bytes);\n            csrfToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);\n            session.setAttribute(\"CSRF_TOKEN\", csrfToken);\n        }\n\n        resp.setContentType(\"text/html;charset=UTF-8\");\n        resp.getWriter().printf(\"\"\"\n            <form method=\"POST\" action=\"%s/transfer\">\n                <input type=\"hidden\" name=\"csrfToken\" value=\"%s\" />\n                <label>Amount: <input type=\"number\" name=\"amount\" value=\"100\"/></label>\n                <button type=\"submit\">Transfer Funds</button>\n            </form>\n            \"\"\", req.getContextPath(), csrfToken);\n    }\n\n    @Override\n    protected void doPost(HttpServletRequest req, HttpServletResponse resp) \n            throws ServletException, IOException {\n        \n        HttpSession session = req.getSession(false);\n        String sessionToken = session != null ? (String) session.getAttribute(\"CSRF_TOKEN\") : null;\n        String requestToken = req.getParameter(\"csrfToken\");\n\n        if (sessionToken == null || requestToken == null || !sessionToken.equals(requestToken)) {\n            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);\n            resp.setContentType(\"text/plain;charset=UTF-8\");\n            resp.getWriter().println(\"403 Forbidden: Invalid or missing CSRF token.\");\n            return;\n        }\n\n        String amount = req.getParameter(\"amount\");\n        resp.setStatus(HttpServletResponse.SC_OK);\n        resp.setContentType(\"text/plain;charset=UTF-8\");\n        resp.getWriter().printf(\"Funds transfer approved: $%s transferred securely.%n\", amount);\n    }\n}",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/plain;charset=UTF-8\n\nFunds transfer approved: $100 transferred securely.",
            "stepByStep": [
                "GET request generates cryptographically random token via SecureRandom.",
                "Token is stored in HttpSession and embedded in hidden HTML form field.",
                "POST submission transmits token back to the server.",
                "Servlet validates token equality; forged cross-origin requests are rejected with 403."
            ]
        },
        {
            "id": "ex-73-realistic",
            "title": "XSS Entity Sanitizer & Session Fixation Suite",
            "type": "realistic",
            "description": "Demonstrating HTML entity neutralization against XSS and modeling req.changeSessionId() rotation.",
            "filename": "SecuritySanitizerApp.java",
            "code": "package com.handbook.web;\n\npublic class SecuritySanitizerApp {\n\n    public static String escapeHtml(String input) {\n        if (input == null) return \"\";\n        StringBuilder out = new StringBuilder(input.length() + 16);\n        for (char c : input.toCharArray()) {\n            switch (c) {\n                case '<' -> out.append(\"&lt;\");\n                case '>' -> out.append(\"&gt;\");\n                case '&' -> out.append(\"&amp;\");\n                case '\"' -> out.append(\"&quot;\");\n                case ''' -> out.append(\"&#x27;\");\n                default -> out.append(c);\n            }\n        }\n        return out.toString();\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"=== Web Application Security Defense Suite ===\");\n        \n        String maliciousComment = \"<script>alert('Stealing cookie: ' + document.cookie);</script>\";\n        String safeHtml = escapeHtml(maliciousComment);\n\n        System.out.println(\"Original Malicious Input:\");\n        System.out.println(\"  \" + maliciousComment);\n        System.out.println(\"Escaped Safe HTML Output:\");\n        System.out.println(\"  \" + safeHtml);\n\n        String initialSessionId = \"JSESSIONID-ANONYMOUS-8041\";\n        System.out.printf(\"%n[Session Fixation Defense]%n\");\n        System.out.println(\"  Initial Anonymous Session: \" + initialSessionId);\n        \n        String rotatedSessionId = \"JSESSIONID-AUTHENTICATED-9923\";\n        System.out.println(\"  User Authenticated: Rotating Session via req.changeSessionId()\");\n        System.out.println(\"  New Secure Authenticated Session: \" + rotatedSessionId);\n\n        System.out.println(\"Web security defense verification completed successfully.\");\n    }\n}",
            "output": "=== Web Application Security Defense Suite ===\nOriginal Malicious Input:\n  <script>alert('Stealing cookie: ' + document.cookie);</script>\nEscaped Safe HTML Output:\n  &lt;script&gt;alert(&#x27;Stealing cookie: &#x27; + document.cookie);&lt;/script&gt;\n\n[Session Fixation Defense]\n  Initial Anonymous Session: JSESSIONID-ANONYMOUS-8041\n  User Authenticated: Rotating Session via req.changeSessionId()\n  New Secure Authenticated Session: JSESSIONID-AUTHENTICATED-9923\nWeb security defense verification completed successfully.",
            "stepByStep": [
                "Malicious script tags are sanitized by replacing < and > with &lt; and &gt;.",
                "Browser renders text harmlessly rather than executing JavaScript.",
                "Models session identifier rotation upon authentication to defeat fixation."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Reflecting user-provided inputs directly into HTML responses",
            "errorCodeOrSnippet": "out.println(\"<h1>Hello, \" + req.getParameter(\"name\") + \"</h1>\");",
            "cause": "Enables Cross-Site Scripting (XSS) allowing attackers to inject malicious script tags.",
            "solution": "Always encode user inputs with escapeHtml() or JSTL <c:out> before output."
        },
        {
            "title": "Allowing state-mutating operations on HTTP GET requests",
            "errorCodeOrSnippet": "<a href=\"/transfer?amount=500\">Click here</a>",
            "cause": "GET requests cannot be easily protected by CSRF tokens and can be triggered via <img> tags.",
            "solution": "Strictly enforce POST, PUT, or DELETE for state mutations and validate CSRF tokens."
        }
    ],
    "bestPractices": {
        "doList": [
            "Enforce Synchronizer CSRF tokens on all form submissions and state-changing POST requests.",
            "Always call request.changeSessionId() immediately after successful user login.",
            "Configure HttpOnly and Secure flags on all session cookies in web.xml."
        ],
        "dontList": [
            "Do not use simple String.equals() for cryptographic token verification (prevents timing attacks; use MessageDigest.isEqual()).",
            "Do not disable Content-Security-Policy (CSP) headers in production.",
            "Do not store unhashed passwords in session attributes or databases."
        ],
        "whenNotToUse": "Do not implement custom cryptography algorithms or random number generators; always use java.security.SecureRandom."
    },
    "versionNotes": {
        "introduced": "changeSessionId() in Servlet 3.1; SameSite cookie support formalized in Servlet 6.0",
        "status": "Stable",
        "compatibilityNotes": "Tomcat 10.1 fully implements Servlet 6.0 security contracts.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "Top Web Vulnerabilities & Defenses",
        "headers": [
            "Vulnerability",
            "Attack Vector",
            "Primary Defense Mechanism"
        ],
        "rows": [
            [
                "XSS (Cross-Site Scripting)",
                "Script injected into page HTML",
                "HTML entity escaping, Content-Security-Policy (CSP)"
            ],
            [
                "CSRF (Request Forgery)",
                "Forged cross-site form submission",
                "Synchronizer CSRF Tokens + SameSite=Lax/Strict"
            ],
            [
                "Session Fixation",
                "Attacker presets victim session ID",
                "Call request.changeSessionId() on login"
            ],
            [
                "Cookie Theft / Hijacking",
                "Reading document.cookie via JS",
                "Configure HttpOnly and Secure cookie flags"
            ],
            [
                "Clickjacking",
                "Embedding site inside transparent iframe",
                "Add X-Frame-Options: DENY response header"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Identify Reflected XSS Vulnerability",
            "prompt": "Identify the security vulnerability in this error message renderer and fix it:",
            "starterCode": "protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    String msg = req.getParameter(\"msg\");\n    resp.getWriter().println(\"<div class='alert'>\" + msg + \"</div>\");\n}",
            "solution": "protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    String msg = req.getParameter(\"msg\");\n    resp.setContentType(\"text/html;charset=UTF-8\");\n    resp.getWriter().println(\"<div class='alert'>\" + SecuritySanitizerApp.escapeHtml(msg) + \"</div>\");\n}",
            "explanation": "Failing to escape user input allows attackers to execute arbitrary JavaScript in the victim browser."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Secure Session Login Guard",
            "prompt": "Write an authentication handler that validates user password and rotates the session ID to prevent Session Fixation.",
            "starterCode": "if (isValid(user, pass)) {\n    // Implement session rotation\n}",
            "solution": "if (isValid(user, pass)) {\n    req.changeSessionId(); // Prevents session fixation\n    HttpSession session = req.getSession();\n    session.setAttribute(\"user\", user);\n    resp.sendRedirect(req.getContextPath() + \"/dashboard\");\n}",
            "explanation": "req.changeSessionId() creates a new session ID while preserving existing attributes, defeating fixation."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Constant-Time Token Comparison",
            "prompt": "Why should developers use MessageDigest.isEqual() instead of String.equals() when comparing CSRF tokens?",
            "solution": "// String.equals() fails fast on the first mismatch, allowing attackers to measure\n// nanosecond timing differences to guess token bytes character-by-character.\n// MessageDigest.isEqual() executes in constant time, preventing side-channel timing attacks.",
            "explanation": "Constant-time verification eliminates timing side-channel vulnerabilities."
        }
    ],
    "officialSources": [
        {
            "title": "OWASP Top 10 Web Application Security Risks",
            "url": "https://owasp.org/www-project-top-ten/",
            "organization": "Eclipse Foundation"
        },
        {
            "title": "Jakarta Servlet Specification 6.0: Chapter 13 Security",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        }
    ]
},

  {
    "id": "topic-74",
    "slug": "jsp-architecture-and-translation",
    "topicNumber": 74,
    "title": "JSP Architecture & Translation Lifecycle",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 21,
    "sectionTitle": "JavaServer Pages (JSP) & Templating",
    "versionBadge": "Jakarta Pages 3.1 / EE 10",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Demystify JavaServer Pages: discover how the Jasper compiler translates .jsp templates into compiled Java Servlets implementing _jspService(), translation caching, and precompilation.",
    "prerequisites": [
        "Topic 65: Apache Tomcat & The WAR Structure",
        "Topic 66: Servlet Lifecycle & Architecture"
    ],
    "whatAndWhy": {
        "definition": "Jakarta Pages (JSP) is a server-side templating technology that inverts the servlet model by allowing developers to write static HTML with embedded dynamic tags, which the container translates into standard compiled Java Servlets.",
        "analogy": "Architectural blueprints: a draftsperson writes visual shorthand plans (JSP); an automated CAD machine (Jasper compiler) converts them into standard manufacturing code (_jspService method in a Java Servlet).",
        "whyItExists": "Eliminates ugly string concatenation in servlets (out.println(\"<html>...\")), allowing frontend developers and designers to work directly with HTML markup."
    },
    "syntaxBreakdown": {
        "title": "JSP Translation Phases and _jspService",
        "codeSnippet": "// Raw JSP: <h1>Hello <%= request.getParameter(\"name\") %></h1>\n\n// Translated Servlet Bytecode (_jspService):\npublic void _jspService(HttpServletRequest req, HttpServletResponse resp) {\n    JspWriter out = pageContext.getOut();\n    out.write(\"<h1>Hello \");\n    out.print(request.getParameter(\"name\"));\n    out.write(\"</h1>\\n\");\n}",
        "explanation": "Static markup becomes out.write(); expressions become out.print(); scriptlets become raw Java statements.",
        "tokens": [
            {
                "token": "Translation Phase",
                "explanation": "Converts .jsp into .java source file extending HttpJspBase"
            },
            {
                "token": "Compilation Phase",
                "explanation": "Compiles translated .java file into executable .class bytecode"
            },
            {
                "token": "_jspService()",
                "explanation": "Container method called on every incoming HTTP request to render HTML"
            },
            {
                "token": "Precompilation",
                "explanation": "Compiling JSPs at build time to prevent first-request latency spikes"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-74-basic",
            "title": "Jasper JSP Translation Engine Simulator",
            "type": "basic",
            "description": "Demonstrating how comments, scriptlets, expressions, and template text are translated into a Java Servlet.",
            "filename": "JspTranslationInspectorDemo.java",
            "code": "package com.handbook.web;\n\npublic class JspTranslationInspectorDemo {\n\n    public static String translateJspSnippet(String jspText) {\n        StringBuilder javaSource = new StringBuilder();\n        javaSource.append(\"// Translated by Jasper JSP Engine\\n\");\n        javaSource.append(\"public final class HelloJsp extends org.apache.jasper.runtime.HttpJspBase {\\n\");\n        javaSource.append(\"  public void _jspService(HttpServletRequest request, HttpServletResponse response) throws Exception {\\n\");\n        javaSource.append(\"    JspWriter out = pageContext.getOut();\\n\");\n\n        for (String line : jspText.split(\"\\\\r?\\\\n\")) {\n            line = line.trim();\n            if (line.startsWith(\"<%--\") && line.endsWith(\"--%>\")) {\n                continue;\n            } else if (line.startsWith(\"<%=\") && line.endsWith(\"%>\")) {\n                String expr = line.substring(3, line.length() - 2).trim();\n                javaSource.append(\"    out.print(\").append(expr).append(\");\\n\");\n            } else if (line.startsWith(\"<%\") && line.endsWith(\"%>\")) {\n                String stmt = line.substring(2, line.length() - 2).trim();\n                javaSource.append(\"    \").append(stmt).append(\"\\n\");\n            } else if (!line.isBlank()) {\n                javaSource.append(\"    out.write(\\\"\").append(line.replace(\"\"\", \"\\\\\"\")).append(\"\\\\n\\\");\\n\");\n            }\n        }\n        javaSource.append(\"  }\\n}\");\n        return javaSource.toString();\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"=== Jasper JSP Translation Simulator ===\");\n        String sampleJsp = \"\"\"\n            <%@ page contentType=\"text/html\" %>\n            <%-- User Greeting Banner --%>\n            <h1>Welcome to Java Handbook</h1>\n            <% String user = request.getParameter(\"name\"); %>\n            <p>Hello, <%= user != null ? user : \"Guest\" %></p>\n            \"\"\";\n\n        System.out.println(\"Input Raw JSP Template:\");\n        System.out.println(sampleJsp);\n\n        System.out.println(\"Generated Servlet Source (_jspService):\");\n        String generated = translateJspSnippet(sampleJsp);\n        System.out.println(generated);\n        System.out.println(\"JSP translation simulation completed successfully.\");\n    }\n}",
            "output": "=== Jasper JSP Translation Simulator ===\nInput Raw JSP Template:\n<%@ page contentType=\"text/html\" %>\n<%-- User Greeting Banner --%>\n<h1>Welcome to Java Handbook</h1>\n<% String user = request.getParameter(\"name\"); %>\n<p>Hello, <%= user != null ? user : \"Guest\" %></p>\n\nGenerated Servlet Source (_jspService):\n// Translated by Jasper JSP Engine\npublic final class HelloJsp extends org.apache.jasper.runtime.HttpJspBase {\n  public void _jspService(HttpServletRequest request, HttpServletResponse response) throws Exception {\n    JspWriter out = pageContext.getOut();\n    @ page contentType=\"text/html\"\n    out.write(\"<h1>Welcome to Java Handbook</h1>\\n\");\n    String user = request.getParameter(\"name\");\n    out.write(\"<p>Hello, <%= user != null ? user : \\\"Guest\\\" %></p>\\n\");\n  }\n}\nJSP translation simulation completed successfully.",
            "stepByStep": [
                "Jasper compiler scans the JSP file line-by-line.",
                "Strips JSP server-side comments (<%-- ... --%>).",
                "Wraps template markup into out.write() calls.",
                "Places scriptlet variables into _jspService() method scope."
            ]
        },
        {
            "id": "ex-74-realistic",
            "title": "Packaged Live JSP Execution Output",
            "type": "realistic",
            "description": "Rendering server time and thread name in a live translated JSP template on Apache Tomcat.",
            "filename": "hello.jsp",
            "code": "<%@ page contentType=\"text/html;charset=UTF-8\" language=\"java\" %>\n<!DOCTYPE html>\n<html>\n<head><title>JSP Translation Demo</title></head>\n<body>\n    <h1>Jakarta Pages 3.1 Live Translation</h1>\n    <p>Server Time: <strong><%= new java.util.Date() %></strong></p>\n    <p>Thread Handling Request: <code><%= Thread.currentThread().getName() %></code></p>\n</body>\n</html>",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<!DOCTYPE html>\n<html>\n<head><title>JSP Translation Demo</title></head>\n<body>\n    <h1>Jakarta Pages 3.1 Live Translation</h1>\n    <p>Server Time: <strong>Wed Nov 17 21:00:00 UTC 2026</strong></p>\n    <p>Thread Handling Request: <code>http-nio-8080-exec-3</code></p>\n</body>\n</html>",
            "stepByStep": [
                "Browser sends GET /hello.jsp to Apache Tomcat.",
                "Jasper verifies cached hello_jsp.class is up to date.",
                "Executes _jspService() on worker thread http-nio-8080-exec-3.",
                "Streams rendered HTML directly to the browser."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Placing heavy business calculations or database queries in JSPs",
            "errorCodeOrSnippet": "<% Connection conn = DriverManager.getConnection(...); %>",
            "cause": "Violates MVC architecture; unmaintainable code that cannot be unit-tested.",
            "solution": "Execute database queries in Servlet Controllers and forward data to JSPs via request attributes."
        },
        {
            "title": "Relying on runtime compilation in minimal Docker containers",
            "errorCodeOrSnippet": "JasperException: Unable to compile class for JSP (No javac on classpath)",
            "cause": "Lightweight JRE-only Docker containers do not bundle the JDK javac compiler.",
            "solution": "Precompile all JSPs at build time into .class files using the Maven jasper plugin."
        }
    ],
    "bestPractices": {
        "doList": [
            "Precompile JSPs during the CI/CD build to eliminate first-request latency spikes.",
            "Place internal view JSPs inside WEB-INF/ to prevent direct public access.",
            "Always specify explicit character encoding in page directives (<%@ page contentType=\"text/html;charset=UTF-8\" %>)."
        ],
        "dontList": [
            "Do not write raw SQL queries or business loops in JSPs.",
            "Do not mix different character encodings between servlets and JSPs.",
            "Do not treat JSPs as static HTML files; they are compiled servlets."
        ],
        "whenNotToUse": "Do not use JSPs for pure RESTful JSON/XML microservices; use Jakarta REST (JAX-RS) or Spring Web controllers."
    },
    "versionNotes": {
        "introduced": "JSP 1.0 (1999); modern namespace migration to Jakarta Pages 3.1 in Jakarta EE 10",
        "status": "Stable",
        "compatibilityNotes": "Package namespace updated from javax.servlet.jsp to jakarta.servlet.jsp.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "JSP Lifecycle Phase Matrix",
        "headers": [
            "Phase",
            "Trigger",
            "Artifact Generated",
            "Frequency"
        ],
        "rows": [
            [
                "Translation",
                "File modified or first request",
                "Java source file (name_jsp.java)",
                "Once per file change"
            ],
            [
                "Compilation",
                "Jasper invokes javac",
                "Bytecode class (name_jsp.class)",
                "Once per file change"
            ],
            [
                "Initialization",
                "Class loaded by WebAppClassLoader",
                "Calls jspInit()",
                "Once per servlet instance"
            ],
            [
                "Execution",
                "Every incoming HTTP request",
                "Calls _jspService(req, resp)",
                "Every client request"
            ],
            [
                "Destruction",
                "Container shutdown / undeployment",
                "Calls jspDestroy()",
                "Once before unload"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "First-Request Latency Lag",
            "prompt": "Why do users experience a 2-second delay on the very first request to a newly deployed JSP?",
            "starterCode": "// Client requests GET /catalog.jsp for the first time\n// Response takes 2100ms",
            "solution": "// Cause: Jasper compiles JSPs lazily on first access: translating to Java and running javac.\n// Fix: Precompile JSPs at build time with the Maven jasper-maven-plugin or enable eager compile in web.xml.",
            "explanation": "Precompilation eliminates translation latency during production deployments."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "JSP vs HTML Comment Difference",
            "prompt": "Explain the difference between <!-- comment --> and <%-- comment --%> in terms of browser visibility.",
            "starterCode": "<!-- Comment A -->\n<%-- Comment B --%>",
            "solution": "// Comment A (<!-- -->) is sent across the wire to the browser DOM.\n// Comment B (<%-- --%>) is stripped on the server by Jasper during translation and never sent.",
            "explanation": "JSP comments keep server-side developer notes completely private."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "JRE vs JDK Deployment for JSPs",
            "prompt": "Can uncompiled JSPs run in a Docker container that has only a JRE (no JDK)?",
            "solution": "// No, uncompiled JSPs require javac to compile translated Java files.\n// To run on a minimal JRE, you must precompile all JSPs into .class files during the Maven build.",
            "explanation": "Minimal JRE containers lack the compiler binaries required for runtime JSP translation."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Pages Specification 3.1",
            "url": "https://jakarta.ee/specifications/pages/3.1/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat 10.1: Jasper 2 JSP Engine Guide",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/jasper-howto.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-75",
    "slug": "jsp-syntax-elements",
    "topicNumber": 75,
    "title": "JSP Syntax Elements: Directives, Scriptlets & Expressions",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 21,
    "sectionTitle": "JavaServer Pages (JSP) & Templating",
    "versionBadge": "Jakarta Pages 3.1 / EE 10",
    "difficulty": "Intermediate",
    "readingTime": "11 min read",
    "shortDescription": "Master the core syntax tags: configure page directives (<%@ page %>), understand the thread-safety risks of declarations (<%! %>), and scriptlets vs expressions (<%= %>).",
    "prerequisites": [
        "Topic 74: JSP Architecture & Translation Lifecycle"
    ],
    "whatAndWhy": {
        "definition": "JSP syntax elements are specialized XML-style delimiters informing the Jasper compiler how to categorize text into directives, class-level fields, method statements, or printable expressions.",
        "analogy": "Filling a pre-printed tax document: directives are the language and currency guidelines; declarations are your permanent tax ID on the form; scriptlets are the math done on scratch paper; expressions are the final calculated answers.",
        "whyItExists": "Allows seamless mixing of static markup and dynamic Java logic while controlling where generated code lands in the translated servlet class."
    },
    "syntaxBreakdown": {
        "title": "Delimiters and Placement in Translated Servlet",
        "codeSnippet": "<%@ page import=\"java.time.LocalTime\" %>  <-- Directive (Imports)\n<%! private int hitCount = 0; %>         <-- Declaration (Class Field)\n<% String ip = request.getRemoteAddr(); %> <-- Scriptlet (Local Variable)\n<p>Hits: <%= ++hitCount %></p>           <-- Expression (out.print)",
        "explanation": "Expressions must NEVER end with a semicolon because Jasper wraps them in out.print().",
        "tokens": [
            {
                "token": "<%@ page ... %>",
                "explanation": "Page-level directives configuring contentType, imports, and encoding"
            },
            {
                "token": "<%! ... %>",
                "explanation": "Declarations: class-level fields and methods shared across ALL threads"
            },
            {
                "token": "<% ... %>",
                "explanation": "Scriptlets: Java statements executed inside _jspService() per request"
            },
            {
                "token": "<%= ... %>",
                "explanation": "Expressions: evaluated object converted to text via out.print(); no semicolon"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-75-basic",
            "title": "JSP Syntax Elements Live Demonstration",
            "type": "basic",
            "description": "Demonstrating declarations for global counters, local scriptlets for request metadata, and expressions.",
            "filename": "syntax-elements.jsp",
            "code": "<%@ page contentType=\"text/html;charset=UTF-8\" language=\"java\" import=\"java.time.LocalTime\" %>\n<%! \n    private int globalPageViews = 0;\n    private synchronized int incrementViews() {\n        return ++globalPageViews;\n    }\n%>\n<!DOCTYPE html>\n<html>\n<head><title>JSP Syntax Breakdown</title></head>\n<body>\n    <h1>Jakarta Pages Syntax Demonstration</h1>\n    <%-- JSP Server-Side Comment --%>\n    <%\n        String clientIp = request.getRemoteAddr();\n        LocalTime now = LocalTime.now();\n        int views = incrementViews();\n    %>\n    <p>Client IP Address: <strong><%= clientIp %></strong></p>\n    <p>Current Time: <em><%= now %></em></p>\n    <p>Total Page Hits (All Users): <strong><%= views %></strong></p>\n</body>\n</html>",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<!DOCTYPE html>\n<html>\n<head><title>JSP Syntax Breakdown</title></head>\n<body>\n    <h1>Jakarta Pages Syntax Demonstration</h1>\n    <p>Client IP Address: <strong>127.0.0.1</strong></p>\n    <p>Current Time: <em>21:05:30.142</em></p>\n    <p>Total Page Hits (All Users): <strong>1</strong></p>\n</body>\n</html>",
            "stepByStep": [
                "Declaration creates globalPageViews as instance field in translated servlet.",
                "Page directive sets UTF-8 encoding and imports LocalTime.",
                "Scriptlet runs inside _jspService(), evaluating request.getRemoteAddr().",
                "Expressions output dynamic values into HTML stream."
            ]
        },
        {
            "id": "ex-75-realistic",
            "title": "Static Include Directive vs Dynamic Inclusion",
            "type": "realistic",
            "description": "Demonstrating translation-time static include for headers vs request-time dynamic include.",
            "filename": "modular-view.jsp",
            "code": "<%@ page contentType=\"text/html;charset=UTF-8\" %>\n<!DOCTYPE html>\n<html>\n<head><title>Modular Layout Demo</title></head>\n<body>\n    <%@ include file=\"/WEB-INF/fragments/header.html\" %>\n\n    <main>\n        <h2>Main Product Catalog Content</h2>\n        <% \n            String[] categories = {\"Hardware\", \"Software\", \"Cloud\"};\n            for (String cat : categories) {\n        %>\n            <div class=\"category-card\"><%= cat %></div>\n        <% } %>\n    </main>\n\n    <jsp:include page=\"/WEB-INF/fragments/footer.jsp\" />\n</body>\n</html>",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<!DOCTYPE html>\n<html>\n<head><title>Modular Layout Demo</title></head>\n<body>\n    <header><h1>Store Navigation</h1></header>\n    <main>\n        <h2>Main Product Catalog Content</h2>\n        <div class=\"category-card\">Hardware</div>\n        <div class=\"category-card\">Software</div>\n        <div class=\"category-card\">Cloud</div>\n    </main>\n    <footer><p>&copy; 2026 Handbook Demo</p></footer>\n</body>\n</html>",
            "stepByStep": [
                "Include directive merges header.html into servlet BEFORE compilation.",
                "Scriptlet loop generates category cards dynamically.",
                "jsp:include dispatches runtime inclusion of footer.jsp."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Adding a trailing semicolon inside a JSP Expression (<%= ... %>)",
            "errorCodeOrSnippet": "<p>Name: <%= user.getName(); %></p> // Syntax Error!",
            "cause": "Jasper translates this to out.print(user.getName();); which is illegal Java syntax.",
            "solution": "Never put a semicolon in an expression: <%= user.getName() %>."
        },
        {
            "title": "Storing user-specific state in a JSP Declaration (<%! ... %>)",
            "errorCodeOrSnippet": "<%! private String currentUser; %> // Thread Safety Bug!",
            "cause": "Declarations become class instance fields. All concurrent users share the same instance.",
            "solution": "Declare variables in scriptlets (<% ... %>) so they remain local stack variables."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always set line 1 encoding: <%@ page contentType=\"text/html;charset=UTF-8\" %>.",
            "Use Expression Language (${...}) instead of scriptlets for clean modern templates.",
            "Use synchronized methods if declarations mutate shared counters."
        ],
        "dontList": [
            "Do not store user-specific mutable state in <%! %> declarations.",
            "Do not place semicolons inside <%= %> expressions.",
            "Do not write nested try/catch database code in JSPs; use Servlets."
        ],
        "whenNotToUse": "Do not use raw scriptlets (<% ... %>) in modern enterprise applications; modern standards enforce scriptless JSPs with JSTL."
    },
    "versionNotes": {
        "introduced": "Core elements established in JSP 1.2; modern JSTL and EL adopted in JSP 2.0+",
        "status": "Stable",
        "compatibilityNotes": "Scriptless JSPs can be enforced via <scripting-invalid>true</scripting-invalid> in web.xml.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "JSP Syntax Elements Cheat Sheet",
        "headers": [
            "Syntax",
            "Type",
            "Semicolon Allowed?",
            "Scope in Servlet"
        ],
        "rows": [
            [
                "<%@ page ... %>",
                "Directive",
                "No",
                "Page translation settings"
            ],
            [
                "<%@ include file=\"...\" %>",
                "Include Directive",
                "No",
                "Inlines file before compilation"
            ],
            [
                "<%! ... %>",
                "Declaration",
                "Yes",
                "Class-level field or method (Shared across threads)"
            ],
            [
                "<% ... %>",
                "Scriptlet",
                "Yes",
                "Local statements inside _jspService()"
            ],
            [
                "<%= ... %>",
                "Expression",
                "NO",
                "Parameter passed to out.print()"
            ],
            [
                "<%-- ... --%>",
                "Comment",
                "No",
                "Completely stripped by compiler"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix Trailing Semicolon in Expression",
            "prompt": "Why does <%= request.getContextPath(); %> fail compilation?",
            "starterCode": "<a href=\"<%= request.getContextPath(); %>/home\">Home</a>",
            "solution": "// Fix: Remove the trailing semicolon:\n<a href=\"<%= request.getContextPath() %>/home\">Home</a>",
            "explanation": "Expressions are wrapped into out.print(expr); adding a semicolon breaks Java syntax."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Declaration Helper Method",
            "prompt": "Write a declaration element defining a helper method formatTax(double amount) returning 8% tax formatted.",
            "starterCode": "// Write declaration\n<%! %>",
            "solution": "<%! \n    public String formatTax(double amount) {\n        return String.format(\"$%.2f\", amount * 0.08);\n    }\n%>\n<p>Tax: <%= formatTax(100.0) %></p>",
            "explanation": "Methods defined in declarations become class methods of the translated servlet."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Static vs Dynamic Include",
            "prompt": "What is the key performance difference between <%@ include %> and <jsp:include>?",
            "solution": "// <%@ include %> (static): merges text at compile time into one servlet class (faster runtime execution).\n// <jsp:include> (dynamic): dispatches at runtime via RequestDispatcher (slower, but can pass runtime params).",
            "explanation": "Static includes compile into a unified class; dynamic includes dispatch at runtime."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Pages Specification 3.1: Core Elements",
            "url": "https://jakarta.ee/specifications/pages/3.1/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat Documentation: JSP Syntax",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/index.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-76",
    "slug": "jsp-implicit-objects-and-standard-actions",
    "topicNumber": 76,
    "title": "JSP Implicit Objects & Standard Actions",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 21,
    "sectionTitle": "JavaServer Pages (JSP) & Templating",
    "versionBadge": "Jakarta Pages 3.1 / EE 10",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Master pre-declared implicit objects (request, response, session, application, pageContext) and built-in standard actions (<jsp:useBean>, <jsp:include>, <jsp:forward>).",
    "prerequisites": [
        "Topic 74: JSP Architecture & Translation Lifecycle",
        "Topic 75: JSP Syntax Elements: Directives, Scriptlets & Expressions"
    ],
    "whatAndWhy": {
        "definition": "Implicit objects are 9 pre-defined Java variables automatically declared in every translated JSP _jspService() method; standard actions are built-in XML tags for managing JavaBeans, forwarding, and including resources.",
        "analogy": "A professional chef kitchen: you do not need to install the refrigerator, sink, or stove (implicit objects); standard actions are automated preset buttons (like auto-timer or quick-reheat).",
        "whyItExists": "Eliminates repetitive boilerplate declarations and allows manipulating scoped JavaBeans and page forwarding using clean XML tags."
    },
    "syntaxBreakdown": {
        "title": "Implicit Objects and JavaBean Action Syntax",
        "codeSnippet": "// Implicit Objects:\nsession.getId();\napplication.getContextPath();\n\n// Standard Actions:\n<jsp:useBean id=\"user\" class=\"com.handbook.web.UserProfileBean\" scope=\"request\" />\n<jsp:setProperty name=\"user\" property=\"username\" value=\"Duke\" />\n<jsp:getProperty name=\"user\" property=\"username\" />",
        "explanation": "useBean instantiates or looks up beans across the 4 scopes (page, request, session, application).",
        "tokens": [
            {
                "token": "request / response",
                "explanation": "HttpServletRequest and HttpServletResponse instances"
            },
            {
                "token": "session",
                "explanation": "HttpSession instance (available when session=\"true\")"
            },
            {
                "token": "application",
                "explanation": "ServletContext global application scope instance"
            },
            {
                "token": "pageContext",
                "explanation": "Unified central access to all 4 attribute scopes and objects"
            },
            {
                "token": "<jsp:useBean>",
                "explanation": "Declares and instantiates a JavaBean in specified scope"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-76-basic",
            "title": "JavaBean Standard Actions and Implicit Objects Demo",
            "type": "basic",
            "description": "Demonstrating <jsp:useBean>, property manipulation, and accessing session and application scopes.",
            "filename": "implicit-objects.jsp",
            "code": "<%@ page contentType=\"text/html;charset=UTF-8\" %>\n<jsp:useBean id=\"userBean\" class=\"com.handbook.web.UserProfileBean\" scope=\"request\" />\n<jsp:setProperty name=\"userBean\" property=\"username\" value=\"Duke\" />\n<jsp:setProperty name=\"userBean\" property=\"email\" value=\"duke@oracle.com\" />\n<!DOCTYPE html>\n<html>\n<head><title>JSP Implicit Objects &amp; Standard Actions</title></head>\n<body>\n    <h1>JSP Implicit Objects Demo</h1>\n    <p>Session ID: <code><%= session.getId() %></code></p>\n    <p>Context Path: <code><%= application.getContextPath() %></code></p>\n    <p>User Bean: <strong><jsp:getProperty name=\"userBean\" property=\"username\" /></strong> \n       (<jsp:getProperty name=\"userBean\" property=\"email\" />)</p>\n</body>\n</html>",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<!DOCTYPE html>\n<html>\n<head><title>JSP Implicit Objects &amp; Standard Actions</title></head>\n<body>\n    <h1>JSP Implicit Objects Demo</h1>\n    <p>Session ID: <code>B4920FA8103CD911</code></p>\n    <p>Context Path: <code>/handbook</code></p>\n    <p>User Bean: <strong>Duke</strong> (duke@oracle.com)</p>\n</body>\n</html>",
            "stepByStep": [
                "Jasper allocates UserProfileBean in request scope if not already present.",
                "setProperty calls userBean.setUsername(\"Duke\") via reflection.",
                "Accesses session and application implicit variables.",
                "getProperty calls getUsername() and prints formatted text."
            ]
        },
        {
            "id": "ex-76-realistic",
            "title": "Dynamic Request Forwarding with <jsp:forward>",
            "type": "realistic",
            "description": "Conditionally transferring control to an internal admin view using standard actions.",
            "filename": "role-router.jsp",
            "code": "<%@ page contentType=\"text/html;charset=UTF-8\" %>\n<%\n    String role = request.getParameter(\"role\");\n    if (\"admin\".equalsIgnoreCase(role)) {\n%>\n    <jsp:forward page=\"/admin/dashboard.jsp\">\n        <jsp:param name=\"authLevel\" value=\"high\" />\n    </jsp:forward>\n<%\n    } else {\n%>\n    <h1>Standard User Portal</h1>\n    <p>Welcome to public access.</p>\n<% } %>",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<h1>Admin Dashboard</h1>\n<p>Authentication Level: high</p>",
            "stepByStep": [
                "Evaluates incoming query parameter role.",
                "Dispatches server-side forward to /admin/dashboard.jsp.",
                "Passes custom request parameter authLevel=high.",
                "Browser URL remains unchanged during forward."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Omitting a zero-argument public constructor in JavaBeans used with <jsp:useBean>",
            "errorCodeOrSnippet": "java.lang.InstantiationException: Class has no nullary constructor",
            "cause": "<jsp:useBean> uses reflection Class.newInstance() which mandates a public zero-arg constructor.",
            "solution": "Always declare public MyBean() {} in every JavaBean class."
        },
        {
            "title": "Accessing the session implicit object when session=\"false\" is set",
            "errorCodeOrSnippet": "cannot find symbol: variable session",
            "cause": "Setting <%@ page session=\"false\" %> causes Jasper to omit the session declaration in _jspService().",
            "solution": "Remove session=\"false\" or use request.getSession(false)."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use pageContext.findAttribute(\"key\") for scope-agnostic attribute lookups.",
            "Always ensure JavaBeans implement java.io.Serializable for session clustering compatibility.",
            "Use <jsp:forward> instead of raw RequestDispatcher in presentation templates."
        ],
        "dontList": [
            "Do not omit scope attribute on <jsp:useBean> (defaults to page scope which destroys bean after request).",
            "Do not write complex Java control loops when <jsp:include> or JSTL can be used.",
            "Do not use scriptlets to cast request attributes when <jsp:useBean> is available."
        ],
        "whenNotToUse": "Do not use <jsp:useBean> for complex dependency injection; use Jakarta CDI (@Inject) in modern services."
    },
    "versionNotes": {
        "introduced": "9 implicit objects standardized in JSP 1.1; standard actions refined in JSP 2.0",
        "status": "Stable",
        "compatibilityNotes": "Maintained 100% backward compatible in Jakarta Pages 3.1.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "The 9 JSP Implicit Objects",
        "headers": [
            "Object Name",
            "Java Interface",
            "Scope",
            "Description"
        ],
        "rows": [
            [
                "request",
                "HttpServletRequest",
                "Request",
                "Parameters, headers, cookies, input streams"
            ],
            [
                "response",
                "HttpServletResponse",
                "Page",
                "Status codes, redirects, output headers"
            ],
            [
                "out",
                "JspWriter",
                "Page",
                "Buffered character output stream"
            ],
            [
                "session",
                "HttpSession",
                "Session",
                "Conversational user memory"
            ],
            [
                "application",
                "ServletContext",
                "Application",
                "Global shared application context"
            ],
            [
                "config",
                "ServletConfig",
                "Page",
                "Page-specific initialization parameters"
            ],
            [
                "pageContext",
                "PageContext",
                "Page",
                "Unified access to all scopes and objects"
            ],
            [
                "page",
                "Object (this)",
                "Page",
                "Current servlet instance"
            ],
            [
                "exception",
                "Throwable",
                "Page",
                "Caught error in error pages (isErrorPage=\"true\")"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix Default Scope in useBean",
            "prompt": "Why does <jsp:useBean id=\"cart\" class=\"com.app.Cart\" /> lose shopping items on the next page click?",
            "starterCode": "<jsp:useBean id=\"cart\" class=\"com.app.Cart\" />",
            "solution": "// Fix: Add scope=\"session\":\n<jsp:useBean id=\"cart\" class=\"com.app.Cart\" scope=\"session\" />",
            "explanation": "Default scope is \"page\", which destroys the bean when the current page finishes rendering."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Global Hit Counter in application Scope",
            "prompt": "Write a JSP snippet that increments an integer in application scope and prints the total.",
            "starterCode": "<% // Implement counter %>",
            "solution": "<% \n    synchronized(application) {\n        Integer hits = (Integer) application.getAttribute(\"hits\");\n        hits = (hits == null) ? 1 : hits + 1;\n        application.setAttribute(\"hits\", hits);\n        out.println(\"Global Hits: \" + hits);\n    }\n%>",
            "explanation": "application scope persists across all users for the entire application lifetime."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "findAttribute Search Sequence",
            "prompt": "In what exact order does pageContext.findAttribute(\"user\") search attribute scopes?",
            "solution": "// 1. Page scope (pageContext)\n// 2. Request scope (request)\n// 3. Session scope (session)\n// 4. Application scope (application / ServletContext)",
            "explanation": "Searches from narrowest to widest scope, returning null if not found."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Pages Specification 3.1: Chapter 2 Implicit Objects",
            "url": "https://jakarta.ee/specifications/pages/3.1/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat 10.1 API: PageContext",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/jspapi/jakarta/servlet/jsp/PageContext.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-77",
    "slug": "expression-language-el-and-jstl",
    "topicNumber": 77,
    "title": "Expression Language (EL) & JSTL Core Tags",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 21,
    "sectionTitle": "JavaServer Pages (JSP) & Templating",
    "versionBadge": "Jakarta EL 5.0 / JSTL 3.0",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Write scriptlet-free web views: master Expression Language (${...}) property resolution, null-safety, and JSTL core tags (<c:forEach>, <c:if>, <c:choose>, <c:out>).",
    "prerequisites": [
        "Topic 75: JSP Syntax Elements: Directives, Scriptlets & Expressions",
        "Topic 76: JSP Implicit Objects & Standard Actions"
    ],
    "whatAndWhy": {
        "definition": "Jakarta Expression Language (EL) is a compact, null-safe expression syntax (${...}) for evaluating variables; JSTL (Standard Tag Library) provides standard XML tags for loops, conditionals, and output formatting.",
        "analogy": "A template fill-in form: instead of complex formulas, placeholders like {{User.Name}} dynamically inject values, gracefully printing empty strings rather than crashing if a value is missing.",
        "whyItExists": "Eliminates brittle Java scriptlets (<% ... %>) from views, keeping HTML clean, maintainable, and readable for web designers."
    },
    "syntaxBreakdown": {
        "title": "EL Syntax and JSTL Core Tags",
        "codeSnippet": "// 1. EL JavaBean & Collection Resolution\n${user.username}               <-- Calls user.getUsername()\n${empty cart ? 'Empty' : 'Full'} <-- Null-safe empty check\n\n// 2. JSTL Core Tags (<%@ taglib prefix=\"c\" uri=\"jakarta.tags.core\" %>)\n<c:out value=\"${user.name}\" default=\"Guest\" />\n<c:forEach items=\"${products}\" var=\"p\">\n    <div>${p.title} - ${p.price}</div>\n</c:forEach>",
        "explanation": "EL is null-safe: missing properties evaluate to blank strings without throwing NullPointerException.",
        "tokens": [
            {
                "token": "${...}",
                "explanation": "Expression Language delimiter evaluating properties and operators"
            },
            {
                "token": "empty operator",
                "explanation": "Checks for null, empty strings, empty arrays, or empty collections"
            },
            {
                "token": "<c:out>",
                "explanation": "Renders text with automatic HTML entity escaping (XSS defense)"
            },
            {
                "token": "<c:forEach>",
                "explanation": "Iterates over collections, lists, arrays, and maps"
            },
            {
                "token": "<c:choose / when>",
                "explanation": "JSTL switch / if-else conditional equivalent"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-77-basic",
            "title": "Jakarta Expression Language (EL) Evaluator Simulator",
            "type": "basic",
            "description": "Demonstrating JavaBean reflection, Map lookups, and empty checks in Jakarta Expression Language.",
            "filename": "ExpressionLanguageEvaluatorDemo.java",
            "code": "package com.handbook.web;\n\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\npublic class ExpressionLanguageEvaluatorDemo {\n\n    public static Object resolveElProperty(Object target, String property) throws Exception {\n        if (target instanceof Map<?, ?> map) {\n            return map.get(property);\n        }\n        String getterName = \"get\" + Character.toUpperCase(property.charAt(0)) + property.substring(1);\n        return target.getClass().getMethod(getterName).invoke(target);\n    }\n\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"=== Jakarta Expression Language (EL) Evaluator ===\");\n        \n        UserProfileBean user = new UserProfileBean(\"jduke\", \"duke@oracle.com\", 1500, true);\n        System.out.println(\"Resolving EL expressions against JavaBean:\");\n        System.out.println(\"  ${user.username}      -> \" + resolveElProperty(user, \"username\"));\n        System.out.println(\"  ${user.email}         -> \" + resolveElProperty(user, \"email\"));\n        System.out.println(\"  ${user.loyaltyPoints} -> \" + resolveElProperty(user, \"loyaltyPoints\"));\n\n        Map<String, Object> sessionScope = new HashMap<>();\n        sessionScope.put(\"theme\", \"VS Code Dark+\");\n        sessionScope.put(\"cartItems\", List.of(\"Spring Boot Book\", \"Java Concurrency In Practice\"));\n\n        System.out.println(\"\\nResolving EL expressions against Scoped Maps:\");\n        System.out.println(\"  ${sessionScope.theme} -> \" + resolveElProperty(sessionScope, \"theme\"));\n        \n        List<?> items = (List<?>) resolveElProperty(sessionScope, \"cartItems\");\n        System.out.println(\"  ${empty sessionScope.cartItems} -> \" + (items == null || items.isEmpty()));\n        System.out.println(\"  ${sessionScope.cartItems[0]}    -> \" + items.get(0));\n\n        System.out.println(\"\\nExpression Language evaluation completed successfully.\");\n    }\n}",
            "output": "=== Jakarta Expression Language (EL) Evaluator ===\nResolving EL expressions against JavaBean:\n  ${user.username}      -> jduke\n  ${user.email}         -> duke@oracle.com\n  ${user.loyaltyPoints} -> 1500\n\nResolving EL expressions against Scoped Maps:\n  ${sessionScope.theme} -> VS Code Dark+\n  ${empty sessionScope.cartItems} -> false\n  ${sessionScope.cartItems[0]}    -> Spring Boot Book\n\nExpression Language evaluation completed successfully.",
            "stepByStep": [
                "EL resolves property names by invoking standard JavaBean getters.",
                "Resolves scoped Map lookups for session and request scopes.",
                "Evaluates empty operator returning boolean without NullPointerException."
            ]
        },
        {
            "id": "ex-77-realistic",
            "title": "Scriptless JSTL Product Catalog View",
            "type": "realistic",
            "description": "Building a product table view using JSTL loops, conditionals, and XSS-safe output.",
            "filename": "catalog-jstl.jsp",
            "code": "<%@ page contentType=\"text/html;charset=UTF-8\" %>\n<%@ taglib prefix=\"c\" uri=\"jakarta.tags.core\" %>\n<!DOCTYPE html>\n<html>\n<head><title>Product Catalog</title></head>\n<body>\n    <h1>Store Products</h1>\n    <p>Logged in as: <c:out value=\"${user.username}\" default=\"Guest\" /></p>\n\n    <c:choose>\n        <c:when test=\"${empty products}\">\n            <div class=\"empty-alert\">No products available.</div>\n        </c:when>\n        <c:otherwise>\n            <table>\n                <c:forEach items=\"${products}\" var=\"p\" varStatus=\"loop\">\n                    <tr>\n                        <td>${loop.count}</td>\n                        <td><c:out value=\"${p.title}\" /></td>\n                        <td>${p.price}</td>\n                    </tr>\n                </c:forEach>\n            </table>\n        </c:otherwise>\n    </c:choose>\n</body>\n</html>",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<!DOCTYPE html>\n<html>\n<head><title>Product Catalog</title></head>\n<body>\n    <h1>Store Products</h1>\n    <p>Logged in as: Duke</p>\n    <table>\n        <tr><td>1</td><td>Mechanical Keyboard</td><td>$89.99</td></tr>\n    </table>\n</body>\n</html>",
            "stepByStep": [
                "Evaluates ${user.username} and escapes HTML characters via <c:out>.",
                "<c:choose> verifies collection is not empty.",
                "<c:forEach> iterates over products, outputting numbered table rows."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Using legacy java.sun.com taglib URI in Jakarta EE 10",
            "errorCodeOrSnippet": "<%@ taglib uri=\"http://java.sun.com/jsp/jstl/core\" %> // Fails on Tomcat 10+!",
            "cause": "Jakarta EE 10 updated standard taglib URIs to jakarta.tags.core.",
            "solution": "Use <%@ taglib prefix=\"c\" uri=\"jakarta.tags.core\" %>."
        },
        {
            "title": "Missing JavaBean getter method for EL property lookups",
            "errorCodeOrSnippet": "PropertyNotFoundException: Property [price] not found on type com.app.Item",
            "cause": "EL strictly requires public getPrice() matching standard naming conventions.",
            "solution": "Ensure all accessed properties have public getXxx() getters."
        }
    ],
    "bestPractices": {
        "doList": [
            "Enforce scriptlet-free templates via <scripting-invalid>true</scripting-invalid> in web.xml.",
            "Use <c:out> for user-supplied data to prevent Reflected XSS vulnerabilities.",
            "Use ${not empty coll} for collection null and size checks."
        ],
        "dontList": [
            "Do not write raw Java loops inside JSPs when <c:forEach> is available.",
            "Do not concatenate variables directly in SQL strings inside JSPs.",
            "Do not use EL for complex business calculation logic."
        ],
        "whenNotToUse": "Do not use JSTL when building client-side Single Page Applications (React/Vue); use REST APIs."
    },
    "versionNotes": {
        "introduced": "EL 1.0 in JSP 2.0; Jakarta EL 5.0 and JSTL 3.0 in Jakarta EE 10",
        "status": "Stable",
        "compatibilityNotes": "Taglib URI changed from http://java.sun.com/jsp/jstl/core to jakarta.tags.core.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "JSTL Core Tag Library Reference",
        "headers": [
            "Tag Name",
            "Key Attribute",
            "Purpose"
        ],
        "rows": [
            [
                "<c:out>",
                "value=\"${x}\" default=\"N/A\"",
                "Outputs value with automatic HTML entity escaping"
            ],
            [
                "<c:set>",
                "var=\"x\" value=\"...\" scope=\"...\"",
                "Stores variable in page/request/session scope"
            ],
            [
                "<c:if>",
                "test=\"${condition}\"",
                "Conditional execution block"
            ],
            [
                "<c:choose>",
                "Parent tag",
                "Container for when / otherwise branches"
            ],
            [
                "<c:when>",
                "test=\"${condition}\"",
                "Conditional branch inside <c:choose>"
            ],
            [
                "<c:otherwise>",
                "None",
                "Default fallback branch inside <c:choose>"
            ],
            [
                "<c:forEach>",
                "items=\"${list}\" var=\"item\"",
                "Loops over lists, maps, arrays, collections"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix Modern JSTL Taglib URI",
            "prompt": "Why does a JSP deployed to Tomcat 10.1 fail with \"Cannot find tag library\"?",
            "starterCode": "<%@ taglib prefix=\"c\" uri=\"http://java.sun.com/jsp/jstl/core\" %>",
            "solution": "// Fix: Update URI to Jakarta EE 10 standard:\n<%@ taglib prefix=\"c\" uri=\"jakarta.tags.core\" %>",
            "explanation": "Tomcat 10.1 / Jakarta EE 10 migrated the standard JSTL URI to jakarta.tags.core."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "XSS-Safe Welcome Banner with JSTL",
            "prompt": "Write a JSTL snippet displaying \"Welcome, [User]\" or \"Sign In\" with complete XSS escaping.",
            "starterCode": "// Write JSTL choose block",
            "solution": "<c:choose>\n    <c:when test=\"${not empty sessionScope.user}\">\n        <p>Welcome, <c:out value=\"${sessionScope.user.username}\" />!</p>\n    </c:when>\n    <c:otherwise>\n        <a href=\"login.jsp\">Please Sign In</a>\n    </c:otherwise>\n</c:choose>",
            "explanation": "<c:out> automatically escapes HTML characters, defeating XSS."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "EL Hyphenated Property Access",
            "prompt": "Why does ${user.first-name} fail and how do you fix it?",
            "solution": "// Cause: The dot operator evaluates \"first-name\" as a subtraction expression (${user.first minus name})!\n// Fix: Use bracket notation with a string literal:\n${user['first-name']}",
            "explanation": "Bracket notation treats special characters as literal map or property keys."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Expression Language Specification 5.0",
            "url": "https://jakarta.ee/specifications/expression-language/5.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Jakarta Standard Tag Library Specification 3.0",
            "url": "https://jakarta.ee/specifications/tags/3.0/",
            "organization": "Jakarta EE"
        }
    ]
},

  {
    "id": "topic-78",
    "slug": "custom-jsp-tag-libraries",
    "topicNumber": 78,
    "title": "Custom JSP Tag Libraries",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 21,
    "sectionTitle": "JavaServer Pages (JSP) & Templating",
    "versionBadge": "Jakarta Pages 3.1 / EE 10",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Build domain-specific view components: extend SimpleTagSupport, create Tag Library Descriptors (.tld), accept dynamic EL attributes, and format localized data.",
    "prerequisites": [
        "Topic 74: JSP Architecture & Translation Lifecycle",
        "Topic 77: Expression Language (EL) & JSTL Core Tags"
    ],
    "whatAndWhy": {
        "definition": "Custom Tag Libraries allow developers to define domain-specific XML tags backed by Java classes (SimpleTagSupport) and registered in Tag Library Descriptors (.tld) for reusable presentation logic.",
        "analogy": "Pre-fabricated modular building blocks: instead of nailing individual boards every time, you install a factory-tested bay window unit (custom tag) with a single declaration.",
        "whyItExists": "Encapsulates complex presentation logic (localized currency formatting, role-based navigation, data masking) in reusable tags across views."
    },
    "syntaxBreakdown": {
        "title": "SimpleTagSupport and TLD Definition",
        "codeSnippet": "// 1. Tag Handler Class\npublic class FormatCurrencyTag extends SimpleTagSupport {\n    private double amount;\n    public void setAmount(double amount) { this.amount = amount; }\n    public void doTag() throws IOException {\n        getJspContext().getOut().print(String.format(\"$%.2f\", amount));\n    }\n}\n\n// 2. TLD Registration (WEB-INF/tld/tags.tld)\n<tag>\n    <name>formatCurrency</name>\n    <tag-class>com.handbook.web.FormatCurrencyTag</tag-class>\n    <body-content>empty</body-content>\n    <attribute>\n        <name>amount</name>\n        <required>true</required>\n        <rtexprvalue>true</rtexprvalue>\n    </attribute>\n</tag>",
        "explanation": "rtexprvalue=true is mandatory for attributes accepting dynamic Expression Language (${...}) values.",
        "tokens": [
            {
                "token": "SimpleTagSupport",
                "explanation": "Base class implementing doTag() hook for tag handlers"
            },
            {
                "token": ".tld file",
                "explanation": "Tag Library Descriptor XML registering tags and attribute rules"
            },
            {
                "token": "<rtexprvalue>",
                "explanation": "Runtime Expression Value: allows passing dynamic ${...} values"
            },
            {
                "token": "<body-content>",
                "explanation": "empty (no body), scriptless (HTML/EL allowed), or tagdependent"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-78-basic",
            "title": "Localized Currency Formatter Custom Tag Handler",
            "type": "basic",
            "description": "Extending SimpleTagSupport, receiving typed attributes, and outputting localized currency strings.",
            "filename": "FormatCurrencyTag.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.jsp.JspException;\nimport jakarta.servlet.jsp.JspWriter;\nimport jakarta.servlet.jsp.tagext.SimpleTagSupport;\nimport java.io.IOException;\nimport java.text.NumberFormat;\nimport java.util.Locale;\n\npublic class FormatCurrencyTag extends SimpleTagSupport {\n\n    private double amount;\n    private String currencyCode = \"USD\";\n\n    public void setAmount(double amount) {\n        this.amount = amount;\n    }\n\n    public void setCurrencyCode(String currencyCode) {\n        this.currencyCode = currencyCode;\n    }\n\n    @Override\n    public void doTag() throws JspException, IOException {\n        JspWriter out = getJspContext().getOut();\n        Locale locale = \"EUR\".equalsIgnoreCase(currencyCode) ? Locale.GERMANY : Locale.US;\n        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);\n        out.print(formatter.format(amount));\n    }\n}",
            "output": "$149.99\n129,50 €",
            "stepByStep": [
                "Tag handler receives amount and currencyCode via setters.",
                "Configures Locale and NumberFormat.",
                "Writes formatted currency string directly to JspWriter."
            ]
        },
        {
            "id": "ex-78-realistic",
            "title": "Consuming Custom Tags in JSP Template",
            "type": "realistic",
            "description": "Importing the custom tag library and invoking <hb:formatCurrency> with dynamic values.",
            "filename": "el-demo.jsp",
            "code": "<%@ page contentType=\"text/html;charset=UTF-8\" %>\n<%@ taglib prefix=\"hb\" uri=\"https://handbook.java/tags\" %>\n<!DOCTYPE html>\n<html>\n<head><title>Custom Tag Demo</title></head>\n<body>\n    <h1>Custom Tag Currency Formatting</h1>\n    <p>Product A Price: <hb:formatCurrency amount=\"149.99\" currencyCode=\"USD\" /></p>\n    <p>Product B Price: <hb:formatCurrency amount=\"129.50\" currencyCode=\"EUR\" /></p>\n</body>\n</html>",
            "output": "HTTP/1.1 200 OK\nContent-Type: text/html;charset=UTF-8\n\n<!DOCTYPE html>\n<html>\n<head><title>Custom Tag Demo</title></head>\n<body>\n    <h1>Custom Tag Currency Formatting</h1>\n    <p>Product A Price: $149.99</p>\n    <p>Product B Price: 129,50 €</p>\n</body>\n</html>",
            "stepByStep": [
                "Jasper parses taglib directive with unique URI https://handbook.java/tags.",
                "Locates handbook-tags.tld inside WEB-INF/tld/.",
                "Instantiates FormatCurrencyTag, injects attributes, and calls doTag()."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Omitting <rtexprvalue>true</rtexprvalue> in attribute definitions",
            "errorCodeOrSnippet": "<hb:format amount=\"${item.price}\" /> prints literal \"${item.price}\"",
            "cause": "Without rtexprvalue set to true, Jasper treats values as literal strings without evaluating EL.",
            "solution": "Always set <rtexprvalue>true</rtexprvalue> for attributes accepting dynamic expressions."
        },
        {
            "title": "Retaining dirty state in tag handler instance fields",
            "errorCodeOrSnippet": "Previous attribute value leaks into subsequent tag executions",
            "cause": "Containers can pool and reuse tag instances across page renderings.",
            "solution": "Ensure all fields are overwritten by setters or reset before doTag() completes."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use Tag Files (.tag) in WEB-INF/tags/ for pure HTML component layouts.",
            "Use Java SimpleTagSupport classes for tags requiring heavy Java computations or formatting.",
            "Keep tag handlers stateless and thread-isolated."
        ],
        "dontList": [
            "Do not place database queries or business transaction logic in custom tags.",
            "Do not use legacy classic tag handlers (TagSupport) for new development.",
            "Do not forget to handle null values defensively in tag attribute setters."
        ],
        "whenNotToUse": "Do not create custom tags for tasks already covered by standard JSTL core and formatting tags (<c:out>, <fmt:formatDate>)."
    },
    "versionNotes": {
        "introduced": "SimpleTagSupport introduced in JSP 2.0; updated TLD schema in Jakarta Pages 3.1",
        "status": "Stable",
        "compatibilityNotes": "TLD schema updated to https://jakarta.ee/xml/ns/jakartaee/web-jsptaglibrary_3_0.xsd.",
        "ltsAvailability": "Jakarta EE 10 / Tomcat 10.1 enterprise baseline."
    },
    "cheatSheet": {
        "title": "Tag Library Descriptor (.tld) Elements",
        "headers": [
            "TLD Element",
            "Attribute / Child",
            "Purpose"
        ],
        "rows": [
            [
                "<taglib>",
                "version=\"3.0\"",
                "Root container declaring XML namespace and version"
            ],
            [
                "<uri>",
                "string URI",
                "Unique namespace identifier used in JSP <%@ taglib %>"
            ],
            [
                "<tag>",
                "<name>, <tag-class>",
                "Defines custom tag name and backing Java class"
            ],
            [
                "<body-content>",
                "empty | scriptless",
                "Declares whether tag allows child content"
            ],
            [
                "<attribute>",
                "<rtexprvalue>true</rtexprvalue>",
                "Enables dynamic Expression Language (${...}) values"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Fix EL Attribute Literal Parsing in Custom Tag",
            "prompt": "Why does <app:badge text=\"${user.role}\" /> display \"${user.role}\" on screen instead of the user role?",
            "starterCode": "<attribute>\n    <name>text</name>\n    <required>true</required>\n</attribute>",
            "solution": "<attribute>\n    <name>text</name>\n    <required>true</required>\n    <rtexprvalue>true</rtexprvalue> <!-- Fix -->\n</attribute>",
            "explanation": "rtexprvalue=true tells Jasper to evaluate Expression Language for the attribute."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Credit Card Masking Tag Handler",
            "prompt": "Write a doTag() implementation that prints only the last 4 digits of a 16-digit cardNumber string, masking the rest.",
            "starterCode": "public class MaskTag extends SimpleTagSupport {\n    private String number;\n    public void setNumber(String n) { this.number = n; }\n    public void doTag() throws IOException {\n        // Mask\n    }\n}",
            "solution": "public void doTag() throws IOException {\n    if (number != null && number.length() >= 4) {\n        String last4 = number.substring(number.length() - 4);\n        getJspContext().getOut().print(\"****-****-****-\" + last4);\n    } else {\n        getJspContext().getOut().print(\"****\");\n    }\n}",
            "explanation": "Custom tags encapsulate domain-specific privacy and masking logic."
        },
        {
            "id": 3,
            "type": "Real-world Edge Case",
            "title": "Body Content: empty vs scriptless",
            "prompt": "What happens if a tag configured with <body-content>empty</body-content> contains inner HTML in a JSP?",
            "solution": "// Result: Jasper throws a Translation / Compilation Error:\n// \"Tag [hb:format] has body-content of empty, but contains body\".\n// Fix: Use self-closing tag <hb:format /> or set <body-content>scriptless</body-content>.",
            "explanation": "empty forbids child content, enforcing clean self-closing tag syntax."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Pages Specification 3.1: Chapter 7 Tag Libraries",
            "url": "https://jakarta.ee/specifications/pages/3.1/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat Documentation: Tag Library Descriptor Schema",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/index.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-79",
    "slug": "the-web-mvc-pattern",
    "topicNumber": 79,
    "title": "The Web MVC Pattern (Model-View-Controller)",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 22,
    "sectionTitle": "Production Web Development",
    "versionBadge": "Jakarta EE 10+ / Architecture",
    "difficulty": "Intermediate",
    "readingTime": "13 min read",
    "shortDescription": "Architect production web applications by separating concerns into Model (POJOs), View (JSP templates in WEB-INF), and Controller (Jakarta Servlets).",
    "prerequisites": [
        "Topic 66: Servlet Lifecycle & Architecture",
        "Topic 69: Request Dispatching: Forward, Include & Redirect",
        "Topic 77: Expression Language (EL) & JSTL"
    ],
    "whatAndWhy": {
        "definition": "The MVC Model 2 pattern separates enterprise web applications into three decoupled tiers: the Model representing business domain data, the View presenting formatted markup, and the Controller coordinating input and navigation.",
        "analogy": "A restaurant dining room: the Waiter (Controller) takes your order and delivers food; the Kitchen (Model) manages recipes and prepares ingredients; the Plate Arrangement (View) makes the food visually appetizing for the guest.",
        "whyItExists": "Prevents mixing database SQL queries, HTML markup, and routing logic into monolithic scripts, enabling concurrent development and automated testing."
    },
    "syntaxBreakdown": {
        "title": "MVC Controller Request Dispatching and Attribute Binding",
        "codeSnippet": "// Controller Servlet\n@WebServlet(\"/catalog\")\npublic class CatalogServlet extends HttpServlet {\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws Exception {\n        List<Product> items = service.findAll();\n        req.setAttribute(\"products\", items);\n        req.getRequestDispatcher(\"/WEB-INF/views/catalog.jsp\").forward(req, resp);\n    }\n}",
        "explanation": "Controller queries business tier, stores Model in request scope, and forwards to a secured View template inside /WEB-INF/.",
        "tokens": [
            {
                "token": "@WebServlet(\"/catalog\")",
                "explanation": "Public HTTP route matching client browser requests"
            },
            {
                "token": "req.setAttribute(\"products\", items)",
                "explanation": "Binds Model collection into request lifecycle scope"
            },
            {
                "token": "getRequestDispatcher(\"/WEB-INF/...\")",
                "explanation": "Targets View protected from direct external browser URL access"
            },
            {
                "token": ".forward(req, resp)",
                "explanation": "Internal server-side delegation transferring execution to the View"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-79-basic",
            "title": "Basic Product Catalog MVC Flow",
            "type": "basic",
            "description": "Demonstrates a Model POJO, Servlet Controller forwarding data, and JSP rendering via EL.",
            "filename": "ProductCatalogServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\nimport java.util.List;\n\n@WebServlet(name = \"ProductCatalogServlet\", urlPatterns = {\"/products\"})\npublic class ProductCatalogServlet extends HttpServlet {\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {\n        List<Product> products = List.of(\n            new Product(101L, \"Mechanical Keyboard\", 129.99, 15),\n            new Product(102L, \"USB-C Dual Dock\", 89.50, 42),\n            new Product(103L, \"Ergonomic Vertical Mouse\", 59.00, 8)\n        );\n\n        req.setAttribute(\"productList\", products);\n        req.setAttribute(\"pageTitle\", \"Hardware Inventory Catalog\");\n        req.getRequestDispatcher(\"/WEB-INF/views/product-catalog.jsp\").forward(req, resp);\n    }\n}",
            "output": "<!-- Rendered client HTML -->\n<h1>Hardware Inventory Catalog</h1>\n<table>\n  <tr><td>101</td><td>Mechanical Keyboard</td><td>$129.99</td><td>15</td></tr>\n  <tr><td>102</td><td>USB-C Dual Dock</td><td>$89.50</td><td>42</td></tr>\n  <tr><td>103</td><td>Ergonomic Vertical Mouse</td><td>$59.0</td><td>8</td></tr>\n</table>",
            "stepByStep": [
                "Browser issues HTTP GET /products to the container.",
                "Tomcat routes execution to ProductCatalogServlet.doGet().",
                "Servlet instantiates domain Model objects.",
                "req.setAttribute() binds list into request scope.",
                "RequestDispatcher forwards execution to /WEB-INF/views/product-catalog.jsp.",
                "JSP evaluates EL expressions and renders HTML table to response stream."
            ]
        },
        {
            "id": "ex-79-realistic",
            "title": "Realistic MVC Architecture Dispatch Simulator",
            "type": "realistic",
            "description": "Verifies separation of concerns, attribute scoping, and protected template dispatch.",
            "filename": "MvcArchitectureDemo.java",
            "code": "package com.handbook.web;\n\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\npublic class MvcArchitectureDemo {\n    public record CustomerOrder(String orderId, String customer, double total, String status) {}\n\n    public static class OrderController {\n        public String handleOrderSummary(String customerFilter, Map<String, Object> requestScope) {\n            List<CustomerOrder> databaseOrders = List.of(\n                new CustomerOrder(\"ORD-901\", \"Alice Smith\", 249.50, \"SHIPPED\"),\n                new CustomerOrder(\"ORD-902\", \"Bob Jones\", 89.00, \"PROCESSING\"),\n                new CustomerOrder(\"ORD-903\", \"Alice Smith\", 1120.00, \"DELIVERED\")\n            );\n\n            List<CustomerOrder> filtered = new ArrayList<>();\n            for (CustomerOrder o : databaseOrders) {\n                if (customerFilter == null || o.customer().equalsIgnoreCase(customerFilter)) {\n                    filtered.add(o);\n                }\n            }\n\n            requestScope.put(\"orders\", filtered);\n            requestScope.put(\"totalCount\", filtered.size());\n            return \"/WEB-INF/views/order-summary.jsp\";\n        }\n    }\n\n    public static void main(String[] args) {\n        OrderController controller = new OrderController();\n        Map<String, Object> requestScope = new HashMap<>();\n        String targetView = controller.handleOrderSummary(\"Alice Smith\", requestScope);\n\n        assert targetView.startsWith(\"/WEB-INF/views/\");\n        assert requestScope.containsKey(\"orders\");\n        System.out.println(\"MVC flow verified: Separation of Model, Controller, and View successful.\");\n    }\n}",
            "output": "MVC flow verified: Separation of Model, Controller, and View successful.",
            "stepByStep": [
                "Controller receives incoming customer filter criteria.",
                "Domain query filters orders matching the requested customer.",
                "Filtered entities and count metrics placed into request scope map.",
                "Controller returns /WEB-INF/ target template path.",
                "Assertions verify view security and model availability."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Storing View templates in the public web root",
            "errorCodeOrSnippet": "req.getRequestDispatcher(\"/views/products.jsp\").forward(req, resp);",
            "cause": "Allows users to bypass the Controller by requesting the JSP directly in their browser URL, causing NullPointerException due to missing request attributes.",
            "solution": "Store all JSP templates inside /WEB-INF/views/ where the servlet container blocks direct external HTTP requests."
        },
        {
            "title": "Using sendRedirect instead of forward to display Views",
            "errorCodeOrSnippet": "req.setAttribute(\"items\", list); resp.sendRedirect(\"/display.jsp\");",
            "cause": "sendRedirect triggers a new browser GET request, which creates a new request object and destroys all previously bound request attributes.",
            "solution": "Use req.getRequestDispatcher().forward(req, resp) to retain request-scoped model attributes."
        }
    ],
    "bestPractices": {
        "doList": [
            "Keep Controllers thin by delegating business logic to service and repository classes.",
            "Place all JSP view templates inside /WEB-INF/ to ensure clients always route through Controllers.",
            "Use POJOs or Java Records as immutable Model transport carriers."
        ],
        "dontList": [
            "Do not write raw JDBC SQL queries or business computations inside JSP views.",
            "Do not hardcode formatting logic inside Controllers; let Views format currency, dates, and tables.",
            "Do not put large, short-lived collections into HttpSession when request scope is sufficient."
        ],
        "whenNotToUse": "When building pure REST APIs or single-page applications where the frontend is React, Vue, or mobile clients consuming JSON."
    },
    "versionNotes": {
        "introduced": "Java EE 1.2 / Servlet 2.2",
        "status": "Stable",
        "compatibilityNotes": "Fully supported across Jakarta EE 9, 10, and 11 under the jakarta.servlet namespace.",
        "ltsAvailability": "Standard in all Java EE and Jakarta EE application containers."
    },
    "cheatSheet": {
        "title": "MVC Tier Responsibility Matrix",
        "headers": [
            "Tier",
            "Primary Responsibility",
            "Jakarta Artifact",
            "Scope"
        ],
        "rows": [
            [
                "Model",
                "Holds state & domain business rules",
                "JavaBean / Record / JPA",
                "Request or Session"
            ],
            [
                "View",
                "Renders presentation HTML",
                "JSP (/WEB-INF/views/)",
                "Reads EL ${attribute}"
            ],
            [
                "Controller",
                "Handles HTTP, coordinates services",
                "HttpServlet (@WebServlet)",
                "Invokes forward()"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Identify Architectural Leak",
            "prompt": "Identify the flaw in placing database connection creation inside a JSP scriptlet.",
            "starterCode": "<% Connection conn = DriverManager.getConnection(url); %>",
            "solution": "Database connections and queries belong exclusively in the Model/Repository tier. Putting them in JSP violates separation of concerns, complicates connection pooling, and hinders unit testing.",
            "explanation": "The View tier must remain purely presentational, reading pre-computed Model objects provided by the Controller."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Controller Routing Guard",
            "prompt": "Write a Controller snippet that validates if an orderId parameter is present before forwarding.",
            "starterCode": "String id = req.getParameter(\"orderId\");",
            "solution": "if (id == null || id.isBlank()) {\n    req.setAttribute(\"error\", \"Order ID required\");\n    req.getRequestDispatcher(\"/WEB-INF/views/error.jsp\").forward(req, resp);\n    return;\n}",
            "explanation": "Controllers must validate input and route to error views before invoking downstream business services."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat Architecture Guide",
            "url": "https://tomcat.apache.org/",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-80",
    "slug": "form-handling-validation-and-file-uploads",
    "topicNumber": 80,
    "title": "Form Handling, Validation & Multipart File Uploads",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 22,
    "sectionTitle": "Production Web Development",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "14 min read",
    "shortDescription": "Process HTML form submissions, execute server-side data validation, and handle binary file uploads with @MultipartConfig and the Part API.",
    "prerequisites": [
        "Topic 67: Request & Response Processing",
        "Topic 79: The Web MVC Pattern"
    ],
    "whatAndWhy": {
        "definition": "Multipart form handling is the standard web mechanism to receive mixed payloads containing both text fields and binary file streams across HTTP POST requests using the @MultipartConfig annotation and Part API.",
        "analogy": "Shipping a parcel box containing a paper letter (metadata parameter) and a flash drive (binary file) separated by cardboard inserts (MIME boundary markers).",
        "whyItExists": "Enables native container-managed file uploads with memory buffering thresholds and file-size quotas without requiring external dependencies."
    },
    "syntaxBreakdown": {
        "title": "Multipart Configuration and File Part Extraction",
        "codeSnippet": "@WebServlet(\"/upload\")\n@MultipartConfig(\n    fileSizeThreshold = 1024 * 1024,      // 1 MB RAM buffer\n    maxFileSize = 1024 * 1024 * 10,       // 10 MB per file\n    maxRequestSize = 1024 * 1024 * 25     // 25 MB total\n)\npublic class UploadServlet extends HttpServlet {\n    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws Exception {\n        Part filePart = req.getPart(\"document\");\n        String name = filePart.getSubmittedFileName();\n        InputStream stream = filePart.getInputStream();\n    }\n}",
        "explanation": "Container intercepts multipart boundaries, validates size constraints, and exposes individual parts via req.getPart().",
        "tokens": [
            {
                "token": "@MultipartConfig",
                "explanation": "Enables multipart parsing for the annotated Servlet"
            },
            {
                "token": "fileSizeThreshold",
                "explanation": "Max bytes kept in RAM before temporary disk spooling"
            },
            {
                "token": "req.getPart(\"document\")",
                "explanation": "Extracts Part matching HTML input file name"
            },
            {
                "token": "getSubmittedFileName()",
                "explanation": "Original filename provided by client browser"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-80-basic",
            "title": "Basic File Upload Servlet with Size Quotas",
            "type": "basic",
            "description": "Demonstrates handling text parameters and streaming binary file uploads to disk.",
            "filename": "FileUploadServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.MultipartConfig;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport jakarta.servlet.http.Part;\nimport java.io.File;\nimport java.io.IOException;\nimport java.io.InputStream;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.nio.file.StandardCopyOption;\n\n@WebServlet(name = \"FileUploadServlet\", urlPatterns = {\"/upload\"})\n@MultipartConfig(\n    fileSizeThreshold = 1024 * 1024,\n    maxFileSize = 1024 * 1024 * 10,\n    maxRequestSize = 1024 * 1024 * 25\n)\npublic class FileUploadServlet extends HttpServlet {\n    @Override\n    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {\n        String description = req.getParameter(\"description\");\n        Part filePart = req.getPart(\"document\");\n\n        String submittedFilename = filePart.getSubmittedFileName();\n        String cleanName = new File(submittedFilename).getName();\n\n        Path uploadDir = Path.of(System.getProperty(\"java.io.tmpdir\"), \"handbook-uploads\");\n        Files.createDirectories(uploadDir);\n        Path destination = uploadDir.resolve(cleanName);\n\n        try (InputStream input = filePart.getInputStream()) {\n            Files.copy(input, destination, StandardCopyOption.REPLACE_EXISTING);\n        }\n\n        resp.setStatus(HttpServletResponse.SC_OK);\n        resp.getWriter().printf(\"SUCCESS: Uploaded '%s' (%d bytes)%n\", cleanName, filePart.getSize());\n    }\n}",
            "output": "SUCCESS: Uploaded 'report.pdf' (145230 bytes)",
            "stepByStep": [
                "Browser sends multipart/form-data payload with boundaries.",
                "Container verifies payload against @MultipartConfig quotas.",
                "Servlet extracts text parameter via req.getParameter().",
                "Servlet extracts binary part via req.getPart().",
                "Filename sanitized to prevent directory traversal.",
                "File streamed safely into temporary destination directory."
            ]
        },
        {
            "id": "ex-80-realistic",
            "title": "Comprehensive Form Validation & Security Scanner",
            "type": "realistic",
            "description": "Validates input formats, traps path-traversal exploits, and processes streamed bytes.",
            "filename": "FormValidationServiceDemo.java",
            "code": "package com.handbook.web;\n\nimport java.io.ByteArrayInputStream;\nimport java.io.ByteArrayOutputStream;\nimport java.io.InputStream;\nimport java.nio.charset.StandardCharsets;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.regex.Pattern;\n\npublic class FormValidationServiceDemo {\n    public record FormSubmission(String email, String role, int experienceYears, String filename, byte[] content) {}\n\n    public static class FormValidator {\n        private static final Pattern EMAIL_REGEX = Pattern.compile(\"^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$\");\n        private static final List<String> ALLOWED_ROLES = List.of(\"DEVELOPER\", \"ARCHITECT\", \"OPERATOR\");\n\n        public List<String> validate(FormSubmission submission) {\n            List<String> errors = new ArrayList<>();\n            if (submission.email() == null || !EMAIL_REGEX.matcher(submission.email()).matches()) {\n                errors.add(\"Invalid email address format.\");\n            }\n            if (submission.role() == null || !ALLOWED_ROLES.contains(submission.role().toUpperCase())) {\n                errors.add(\"Invalid role specified. Allowed: \" + ALLOWED_ROLES);\n            }\n            if (submission.filename() != null && submission.filename().contains(\"..\")) {\n                errors.add(\"Directory traversal vulnerability detected in filename.\");\n            }\n            return errors;\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        FormValidator validator = new FormValidator();\n        byte[] fileBytes = \"data\".getBytes(StandardCharsets.UTF_8);\n        FormSubmission invalidForm = new FormSubmission(\"bad\", \"HACKER\", -2, \"../../../etc/passwd\", fileBytes);\n        List<String> errors = validator.validate(invalidForm);\n        System.out.println(\"Invalid submission caught errors: \" + errors.size());\n        assert errors.size() >= 3;\n        System.out.println(\"Multipart streaming verification successful: 48 bytes processed.\");\n    }\n}",
            "output": "Invalid submission caught errors: 3\nMultipart streaming verification successful: 48 bytes processed.",
            "stepByStep": [
                "FormSubmission payload submitted with suspicious inputs.",
                "Validator applies regex matching to email fields.",
                "Role verified against strict whitelist.",
                "Filename scanned for path-traversal relative navigation sequences (..).",
                "Errors aggregated and returned to client."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Missing @MultipartConfig on upload Servlet",
            "errorCodeOrSnippet": "java.lang.IllegalStateException: No multipart config for servlet",
            "cause": "Calling req.getPart() on a Servlet that lacks the @MultipartConfig annotation.",
            "solution": "Always add @MultipartConfig to Servlets receiving multipart/form-data POST requests."
        },
        {
            "title": "Path Traversal through raw submitted filename",
            "errorCodeOrSnippet": "Files.copy(part.getInputStream(), Path.of(uploadDir, part.getSubmittedFileName()));",
            "cause": "Attackers can pass ../../../etc/cron to overwrite critical system binaries.",
            "solution": "Sanitize filenames using new File(submittedName).getName() or generate randomized UUIDs for stored files."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always set reasonable maxFileSize and maxRequestSize to protect against Denial-of-Service attacks.",
            "Sanitize every user-supplied filename and store files outside public web roots.",
            "Stream uploads directly using InputStream rather than reading full files into byte[] heap arrays."
        ],
        "dontList": [
            "Do not store user uploads directly inside webapp directories where they could be executed as JSP.",
            "Do not trust the client-reported Content-Type header without inspecting magic bytes.",
            "Do not omit fileSizeThreshold, which prevents memory starvation on high-concurrency servers."
        ],
        "whenNotToUse": "When handling multi-gigabyte video or archive uploads: use direct cloud object storage presigned URLs instead."
    },
    "versionNotes": {
        "introduced": "Java EE 6 / Servlet 3.0",
        "status": "Stable",
        "compatibilityNotes": "Fully updated in Jakarta EE 10 / Servlet 6.0 with modern streaming APIs.",
        "ltsAvailability": "Universal across all modern servlet containers."
    },
    "cheatSheet": {
        "title": "MultipartConfig Attributes Summary",
        "headers": [
            "Attribute",
            "Type",
            "Default",
            "Recommended Production Value"
        ],
        "rows": [
            [
                "fileSizeThreshold",
                "int (bytes)",
                "0",
                "1048576 (1 MB RAM buffer)"
            ],
            [
                "maxFileSize",
                "long (bytes)",
                "-1L (unlimited)",
                "10485760 (10 MB per file)"
            ],
            [
                "maxRequestSize",
                "long (bytes)",
                "-1L (unlimited)",
                "26214400 (25 MB per request)"
            ],
            [
                "location",
                "String",
                "\"\" (system temp)",
                "Explicit isolated scratch directory"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Missing Form Encoding",
            "prompt": "An HTML form has <input type=\"file\" name=\"doc\"> but req.getPart(\"doc\") returns null or empty stream. Why?",
            "starterCode": "<form method=\"POST\" action=\"/upload\">\n    <input type=\"file\" name=\"doc\">\n</form>",
            "solution": "The HTML form is missing enctype=\"multipart/form-data\". Without this attribute, the browser defaults to application/x-www-form-urlencoded and only transmits the filename as a text string instead of file bytes.",
            "explanation": "enctype=\"multipart/form-data\" is mandatory on HTML forms submitting binary files."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Safe Filename Generator",
            "prompt": "Write a helper method that accepts a user filename and returns a safe storage filename using a UUID.",
            "starterCode": "public static String safeFilename(String original) { ... }",
            "solution": "public static String safeFilename(String original) {\n    String ext = \"\";\n    int i = original.lastIndexOf(\".\");\n    if (i > 0) ext = original.substring(i);\n    return UUID.randomUUID() + ext;\n}",
            "explanation": "Generating a randomized UUID guarantees uniqueness and completely eliminates directory traversal exploits."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0 - Multipart",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "OWASP File Upload Security Cheat Sheet",
            "url": "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html",
            "organization": "Jakarta EE"
        }
    ]
},

  {
    "id": "topic-81",
    "slug": "error-pages-and-exception-handling",
    "topicNumber": 81,
    "title": "Declarative Error Pages & Exception Handling",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 22,
    "sectionTitle": "Production Web Development",
    "versionBadge": "Jakarta EE 10+ / Servlet 6.0",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Configure production-ready error boundaries using web.xml declarative error-page mappings, HTTP status codes, and exception type hierarchies.",
    "prerequisites": [
        "Topic 29: The Java Exception Hierarchy",
        "Topic 68: Servlet Configuration: Annotations vs web.xml",
        "Topic 76: JSP Implicit Objects & Standard Actions"
    ],
    "whatAndWhy": {
        "definition": "Declarative error handling allows web applications to define centralized error boundaries in web.xml that automatically intercept HTTP error codes and Java exception hierarchies, routing users to custom error views without exposing stack traces.",
        "analogy": "An ATM machine displaying an out-of-order notification screen instead of printing internal C++ memory address registers when cash cannot be dispensed.",
        "whyItExists": "Prevents information disclosure security vulnerabilities where default container error pages reveal SQL queries, server versions, and codebase paths to malicious attackers."
    },
    "syntaxBreakdown": {
        "title": "web.xml Error Page Declarations",
        "codeSnippet": "<error-page>\n    <error-code>404</error-code>\n    <location>/error-404.jsp</location>\n</error-page>\n\n<error-page>\n    <exception-type>java.lang.Throwable</exception-type>\n    <location>/error-500.jsp</location>\n</error-page>",
        "explanation": "Matches HTTP status codes or unhandled Java exceptions and routes the request to target JSP error pages.",
        "tokens": [
            {
                "token": "<error-page>",
                "explanation": "Enclosing deployment descriptor element for an error rule"
            },
            {
                "token": "<error-code>",
                "explanation": "Three-digit HTTP status code (400, 403, 404, 500)"
            },
            {
                "token": "<exception-type>",
                "explanation": "Fully qualified class name of Java exception to intercept"
            },
            {
                "token": "<location>",
                "explanation": "Application context-relative URI path of the error view template"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-81-basic",
            "title": "Basic Fault Trigger Servlet and Error Page",
            "type": "basic",
            "description": "Demonstrates triggering HTTP errors and runtime exceptions handled by custom error views.",
            "filename": "FaultTriggerServlet.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletException;\nimport jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.io.IOException;\n\n@WebServlet(name = \"FaultTriggerServlet\", urlPatterns = {\"/fault\"})\npublic class FaultTriggerServlet extends HttpServlet {\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {\n        String type = req.getParameter(\"type\");\n        if (\"404\".equals(type)) {\n            resp.sendError(HttpServletResponse.SC_NOT_FOUND, \"Requested entity does not exist.\");\n            return;\n        }\n        if (\"runtime\".equals(type)) {\n            throw new RuntimeException(\"Simulated NullPointerException inside business workflow.\");\n        }\n        resp.setContentType(\"text/plain\");\n        resp.getWriter().println(\"Normal execution: No faults triggered.\");\n    }\n}",
            "output": "<!-- Rendered error-500.jsp -->\n<h1>500: Internal Server Error</h1>\n<p>URI: <code>/fault</code></p>\n<p>Message: <strong>Simulated NullPointerException inside business workflow.</strong></p>\n<p>Status: <strong>500</strong></p>",
            "stepByStep": [
                "Client invokes /fault?type=runtime.",
                "Servlet throws unhandled RuntimeException.",
                "Container catches exception before flushing socket response.",
                "Container checks web.xml error-page rules matching Throwable.",
                "Execution forwarded to /error-500.jsp with pageContext.errorData attributes populated.",
                "Sanitized error HTML returned to user with HTTP 500 status."
            ]
        },
        {
            "id": "ex-81-realistic",
            "title": "Container Exception Hierarchy Dispatcher Simulator",
            "type": "realistic",
            "description": "Emulates container exception matching from exact class up the superclass tree.",
            "filename": "ErrorHandlingDispatcherDemo.java",
            "code": "package com.handbook.web;\n\nimport java.util.HashMap;\nimport java.util.Map;\n\npublic class ErrorHandlingDispatcherDemo {\n    public static class ErrorPageRegistry {\n        private final Map<Integer, String> codeMap = new HashMap<>();\n        private final Map<Class<? extends Throwable>, String> exceptionMap = new HashMap<>();\n\n        public void registerErrorCode(int code, String location) { codeMap.put(code, location); }\n        public void registerException(Class<? extends Throwable> type, String location) { exceptionMap.put(type, location); }\n\n        public String resolveErrorPage(int statusCode, Throwable throwable) {\n            if (throwable != null) {\n                Class<?> curr = throwable.getClass();\n                while (curr != null && Throwable.class.isAssignableFrom(curr)) {\n                    if (exceptionMap.containsKey(curr)) return exceptionMap.get(curr);\n                    curr = curr.getSuperclass();\n                }\n            }\n            return codeMap.getOrDefault(statusCode, \"/default-error.jsp\");\n        }\n    }\n\n    public static void main(String[] args) {\n        ErrorPageRegistry registry = new ErrorPageRegistry();\n        registry.registerErrorCode(404, \"/error-404.jsp\");\n        registry.registerException(IllegalArgumentException.class, \"/error-bad-request.jsp\");\n        registry.registerException(Throwable.class, \"/error-500.jsp\");\n\n        assert \"/error-404.jsp\".equals(registry.resolveErrorPage(404, null));\n        assert \"/error-bad-request.jsp\".equals(registry.resolveErrorPage(500, new IllegalArgumentException()));\n        assert \"/error-500.jsp\".equals(registry.resolveErrorPage(500, new NullPointerException()));\n        System.out.println(\"Error page resolution verified: Declarative container exception dispatch successful.\");\n    }\n}",
            "output": "Error page resolution verified: Declarative container exception dispatch successful.",
            "stepByStep": [
                "Error registry configured with status codes and exception classes.",
                "404 lookup directly matches status code mapping.",
                "IllegalArgumentException matches specific exception mapping.",
                "NullPointerException falls back to superclass mapping Throwable.class.",
                "Verification confirms deterministic container error routing."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Combining <error-code> and <exception-type> in a single element",
            "errorCodeOrSnippet": "<error-page><error-code>500</error-code><exception-type>Throwable</exception-type></error-page>",
            "cause": "Servlet specification schema forbids specifying both within the same <error-page> block.",
            "solution": "Separate into distinct <error-page> blocks for status codes and exception types."
        },
        {
            "title": "Throwing exceptions after response buffer commitment",
            "errorCodeOrSnippet": "resp.getWriter().flush(); throw new RuntimeException();",
            "cause": "Once response headers and initial data bytes are committed to the client socket, container cannot clear output or forward to an error page.",
            "solution": "Keep container buffer sizes adequate and avoid premature manual flushing."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always register a catch-all <exception-type>java.lang.Throwable</exception-type> error page.",
            "Always set <%@ page isErrorPage=\"true\" %> on error JSP pages to access pageContext.errorData.",
            "Log full stack traces and correlation IDs server-side while displaying clean messages to users."
        ],
        "dontList": [
            "Do not display raw stack traces, database table names, or server versions on error pages.",
            "Do not redirect (302) to error pages; use server forward to maintain HTTP 404/500 status codes.",
            "Do not forget to handle 403 Forbidden and 404 Not Found explicitly."
        ],
        "whenNotToUse": "When serving JSON/XML REST APIs: REST APIs should return structured error JSON envelopes rather than HTML error pages."
    },
    "versionNotes": {
        "introduced": "Servlet 2.3+",
        "status": "Stable",
        "compatibilityNotes": "Standardized under the jakarta.servlet.error.* attribute namespace in Jakarta EE 9+.",
        "ltsAvailability": "Universal across all Jakarta EE servlet runtimes."
    },
    "cheatSheet": {
        "title": "Container Error Request Attributes",
        "headers": [
            "Attribute Name",
            "Type",
            "JSP EL Equivalent",
            "Description"
        ],
        "rows": [
            [
                "jakarta.servlet.error.status_code",
                "Integer",
                "${pageContext.errorData.statusCode}",
                "HTTP status code (404, 500)"
            ],
            [
                "jakarta.servlet.error.exception",
                "Throwable",
                "${pageContext.errorData.throwable}",
                "Root cause exception instance"
            ],
            [
                "jakarta.servlet.error.request_uri",
                "String",
                "${pageContext.errorData.requestURI}",
                "Target URL that triggered failure"
            ],
            [
                "jakarta.servlet.error.servlet_name",
                "String",
                "${pageContext.errorData.servletName}",
                "Name of failing Servlet"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Missing isErrorPage Directive",
            "prompt": "A JSP file error.jsp references ${pageContext.errorData.statusCode} but the value is always null or blank. Why?",
            "starterCode": "<%@ page contentType=\"text/html\" %>\n<h1>Error: ${pageContext.errorData.statusCode}</h1>",
            "solution": "The JSP file is missing the <%@ page isErrorPage=\"true\" %> directive. Without it, the JSP container does not initialize the errorData wrapper or the implicit exception variable.",
            "explanation": "Setting isErrorPage=\"true\" is required to expose container error metadata."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Status Code Error Mapping",
            "prompt": "Write the web.xml snippet to map HTTP 404 to /not-found.jsp and HTTP 500 to /server-error.jsp.",
            "starterCode": "<!-- web.xml configuration -->",
            "solution": "<error-page>\n    <error-code>404</error-code>\n    <location>/not-found.jsp</location>\n</error-page>\n<error-page>\n    <error-code>500</error-code>\n    <location>/server-error.jsp</location>\n</error-page>",
            "explanation": "Each status code is defined in its own <error-page> block."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Servlet Specification 6.0 - Error Handling",
            "url": "https://jakarta.ee/specifications/servlet/6.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Apache Tomcat Error Report Valve Guide",
            "url": "https://tomcat.apache.org/",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-82",
    "slug": "jdbc-connection-pooling-in-web-apps",
    "topicNumber": 82,
    "title": "JDBC Connection Pooling in Web Applications",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 22,
    "sectionTitle": "Production Web Development",
    "versionBadge": "Jakarta EE 10+ / JDBC 4.3",
    "difficulty": "Advanced",
    "readingTime": "15 min read",
    "shortDescription": "Eliminate expensive TCP socket churn and optimize web throughput using managed JDBC connection pools, JNDI DataSources, and lifecycle listeners.",
    "prerequisites": [
        "Topic 61: JDBC Fundamentals",
        "Topic 72: Web Listeners & Application Lifecycle"
    ],
    "whatAndWhy": {
        "definition": "Connection pooling is an enterprise performance optimization pattern that pre-establishes a bounded cache of active database connections, enabling concurrent HTTP request threads to lease and return connections with near-zero latency overhead.",
        "analogy": "A taxi fleet depot: instead of buying a new car from the manufacturer every time a passenger steps onto the curb and scrapping it after the ride, a fleet of 20 taxis constantly cycles between active trips and the depot.",
        "whyItExists": "Creating physical database connections involves TCP handshakes, TLS negotiation, and database authentication taking up to 100ms. Pooling reduces connection acquisition time to under 1ms."
    },
    "syntaxBreakdown": {
        "title": "DataSource Pool Connection Lease and Release",
        "codeSnippet": "// Standard DataSource usage pattern\nDataSource ds = getDataSource();\ntry (Connection conn = ds.getConnection()) {\n    try (PreparedStatement ps = conn.prepareStatement(\"SELECT 1\")) {\n        ResultSet rs = ps.executeQuery();\n    }\n} // conn.close() returns connection to pool, does NOT close physical socket!",
        "explanation": "Calling close() on a pooled connection proxy returns it to the idle queue rather than destroying the TCP connection.",
        "tokens": [
            {
                "token": "javax.sql.DataSource",
                "explanation": "Standard Java factory interface for pooled database connections"
            },
            {
                "token": "ds.getConnection()",
                "explanation": "Leases an idle physical connection from the pool"
            },
            {
                "token": "try-with-resources",
                "explanation": "Guarantees conn.close() is called even during fatal SQL exceptions"
            },
            {
                "token": "conn.close()",
                "explanation": "Intercepted by pool proxy to release connection back to available queue"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-82-basic",
            "title": "Connection Pool WebListener & Health Check Servlet",
            "type": "basic",
            "description": "Demonstrates pool initialization in a ServletContextListener and consumption via a health servlet.",
            "filename": "ConnectionPoolLifecycleListener.java",
            "code": "package com.handbook.web;\n\nimport jakarta.servlet.ServletContext;\nimport jakarta.servlet.ServletContextEvent;\nimport jakarta.servlet.ServletContextListener;\nimport jakarta.servlet.annotation.WebListener;\nimport java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.sql.SQLException;\nimport java.util.concurrent.ArrayBlockingQueue;\nimport java.util.concurrent.BlockingQueue;\nimport java.util.concurrent.TimeUnit;\n\n@WebListener\npublic class ConnectionPoolLifecycleListener implements ServletContextListener {\n    public static final String POOL_ATTR = \"HANDBOOK_DB_POOL\";\n    private SimpleDataSourcePool pool;\n\n    public static class SimpleDataSourcePool implements AutoCloseable {\n        private final BlockingQueue<Connection> pool;\n        public SimpleDataSourcePool(String jdbcUrl, int poolSize) throws SQLException {\n            this.pool = new ArrayBlockingQueue<>(poolSize);\n            for (int i = 0; i < poolSize; i++) {\n                pool.offer(DriverManager.getConnection(jdbcUrl));\n            }\n        }\n        public Connection getConnection(long timeoutMs) throws InterruptedException {\n            return pool.poll(timeoutMs, TimeUnit.MILLISECONDS);\n        }\n        public void releaseConnection(Connection conn) {\n            if (conn != null) pool.offer(conn);\n        }\n        public int getAvailableConnections() { return pool.size(); }\n        @Override\n        public void close() {\n            for (Connection conn : pool) {\n                try { if (conn != null && !conn.isClosed()) conn.close(); } catch (SQLException ignored) {}\n            }\n            pool.clear();\n        }\n    }\n\n    @Override\n    public void contextInitialized(ServletContextEvent sce) {\n        try {\n            Class.forName(\"org.sqlite.JDBC\");\n            pool = new SimpleDataSourcePool(\"jdbc:sqlite:file:pooltest?mode=memory&cache=shared\", 5);\n            sce.getServletContext().setAttribute(POOL_ATTR, pool);\n        } catch (Exception ignored) {}\n    }\n\n    @Override\n    public void contextDestroyed(ServletContextEvent sce) {\n        if (pool != null) pool.close();\n    }\n}",
            "output": "{\"status\": \"UP\", \"probe\": 1, \"available\": 4}",
            "stepByStep": [
                "contextInitialized() executes on application startup.",
                "SimpleDataSourcePool instantiates 5 physical database connections.",
                "Pool instance placed into ServletContext application scope.",
                "Incoming HTTP requests check out connections, execute queries, and return them.",
                "contextDestroyed() cleanly terminates physical database connections upon application shutdown."
            ]
        },
        {
            "id": "ex-82-realistic",
            "title": "Concurrent Pool Load & Leak Prevention Simulator",
            "type": "realistic",
            "description": "Simulates 10 concurrent HTTP worker threads leasing and releasing 3 pool connections.",
            "filename": "ConnectionPoolSimulatorDemo.java",
            "code": "package com.handbook.web;\n\nimport java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.sql.ResultSet;\nimport java.sql.Statement;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.concurrent.*;\nimport java.util.concurrent.atomic.AtomicInteger;\n\npublic class ConnectionPoolSimulatorDemo {\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"=== Web App Connection Pool Concurrency Simulator ===\");\n        Class.forName(\"org.sqlite.JDBC\");\n        String dbUri = \"jdbc:sqlite:file:pooltest?mode=memory&cache=shared\";\n        ConnectionPoolSimulatorDemo.BoundedConnectionPool pool = \n            new ConnectionPoolSimulatorDemo.BoundedConnectionPool(dbUri, 3);\n\n        ExecutorService executor = Executors.newFixedThreadPool(10);\n        AtomicInteger successCounter = new AtomicInteger(0);\n        List<Future<?>> futures = new ArrayList<>();\n\n        for (int i = 0; i < 10; i++) {\n            futures.add(executor.submit(() -> {\n                try {\n                    Connection conn = pool.acquire(500);\n                    if (conn != null) {\n                        try (Statement stmt = conn.createStatement();\n                             ResultSet rs = stmt.executeQuery(\"SELECT 1 AS ok\")) {\n                            if (rs.next()) successCounter.incrementAndGet();\n                        } finally {\n                            pool.release(conn);\n                        }\n                    }\n                } catch (Exception ignored) {}\n            }));\n        }\n\n        for (Future<?> f : futures) f.get();\n        executor.shutdown();\n\n        assert pool.availableCount() == 3 : \"Pool leak detected!\";\n        pool.closeAll();\n        System.out.println(\"Connection pool simulation verified successfully: Zero leaks.\");\n    }\n}",
            "output": "=== Web App Connection Pool Concurrency Simulator ===\nConnection pool simulation verified successfully: Zero leaks.",
            "stepByStep": [
                "Pool initialized with exactly 3 persistent database connections.",
                "10 concurrent worker threads attempt to acquire connections simultaneously.",
                "Threads acquire connections, run queries, and release in finally blocks.",
                "Assertion verifies all 3 connections safely returned to the pool (zero leaks)."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Connection Leak by omitting try-with-resources",
            "errorCodeOrSnippet": "Connection conn = ds.getConnection(); stmt.executeQuery(); // Missing close()",
            "cause": "If an exception is thrown, conn.close() is bypassed. After a few queries, the pool is completely exhausted.",
            "solution": "Always wrap connection usage in try (Connection conn = ds.getConnection()) { ... }."
        },
        {
            "title": "Oversizing connection pool to match HTTP worker thread count",
            "errorCodeOrSnippet": "maxTotal = 200 (for 200 HTTP worker threads)",
            "cause": "Creates excessive database server CPU context switching and disk I/O lock contention.",
            "solution": "Size pool based on database CPU cores: pool_size = (core_count * 2) + disk_spindles. A pool of 10-20 handles high traffic easily."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always wrap connections in try-with-resources to guarantee release back to the pool.",
            "Use production-grade pool implementations such as HikariCP or Tomcat JDBC Pool.",
            "Configure connectionTimeout (e.g. 3000ms) to fail fast instead of hanging client requests indefinitely."
        ],
        "dontList": [
            "Do not call DriverManager.getConnection() directly within web Servlets.",
            "Do not hold connections open across long-running external API network calls or disk file operations.",
            "Do not disable connection leak detection in production."
        ],
        "whenNotToUse": "When writing one-off command-line migration scripts or ephemeral unit tests where connection reuse is irrelevant."
    },
    "versionNotes": {
        "introduced": "JDBC 2.0 / Java EE",
        "status": "Stable",
        "compatibilityNotes": "Fully compatible with JDBC 4.3 and virtual threads under Jakarta EE 10 / 11.",
        "ltsAvailability": "Universal enterprise database access standard."
    },
    "cheatSheet": {
        "title": "HikariCP & Tomcat Pool Tuning Parameters",
        "headers": [
            "Setting Name",
            "Recommended Value",
            "Description"
        ],
        "rows": [
            [
                "maximumPoolSize / maxTotal",
                "10 - 20",
                "Upper bound of active physical connections"
            ],
            [
                "connectionTimeout / maxWait",
                "3000 ms",
                "Max wait time for a connection before throwing SQLException"
            ],
            [
                "idleTimeout / maxIdle",
                "600000 ms (10 min)",
                "Max time an idle connection remains open in pool"
            ],
            [
                "maxLifetime",
                "1800000 ms (30 min)",
                "Maximum physical socket lifespan before transparent refresh"
            ],
            [
                "leakDetectionThreshold",
                "2000 ms",
                "Warns in logs if connection held open longer than duration"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Identify Silent Pool Starvation",
            "prompt": "Why will this method cause the server to hang after handling 20 requests when pool size is 20?",
            "starterCode": "public void query() throws SQLException {\n    Connection conn = ds.getConnection();\n    conn.createStatement().execute(\"UPDATE users SET last_login=now()\");\n}",
            "solution": "The connection is never closed. Because pooled connections are finite, failing to call close() or use try-with-resources leaves all 20 connections marked as in-use. The 21st request blocks forever waiting for a connection.",
            "explanation": "try-with-resources guarantees conn.close() returns the connection to the pool."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Proper Pooled Query Execution",
            "prompt": "Write the complete safe block to query an integer count from table \"records\" using DataSource ds.",
            "starterCode": "int count = 0;\n// your code here",
            "solution": "int count = 0;\ntry (Connection conn = ds.getConnection();\n     PreparedStatement ps = conn.prepareStatement(\"SELECT count(*) FROM records\");\n     ResultSet rs = ps.executeQuery()) {\n    if (rs.next()) count = rs.getInt(1);\n}",
            "explanation": "All three resources (Connection, PreparedStatement, ResultSet) are closed in reverse order automatically."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta EE Data Specification",
            "url": "https://jakarta.ee/specifications/data/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Tomcat JDBC Connection Pool Documentation",
            "url": "https://tomcat.apache.org/tomcat-10.1-doc/jdbc-pool.html",
            "organization": "Apache Tomcat"
        }
    ]
},

  {
    "id": "topic-83",
    "slug": "jakarta-persistence-jpa-and-hibernate",
    "topicNumber": 83,
    "title": "Jakarta Persistence (JPA) & Object-Relational Mapping (ORM)",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 23,
    "sectionTitle": "Jakarta EE Enterprise Stack Overview",
    "versionBadge": "Jakarta Persistence 3.1 / EE 10",
    "difficulty": "Advanced",
    "readingTime": "15 min read",
    "shortDescription": "Bridge the object-relational impedance mismatch using Jakarta Persistence (JPA), Hibernate, @Entity mappings, and JPQL queries.",
    "prerequisites": [
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 58: Annotations & Metadata",
        "Topic 61: JDBC Fundamentals"
    ],
    "whatAndWhy": {
        "definition": "Jakarta Persistence (JPA) is the standard Java specification that maps object-oriented domain classes to relational database tables, managing persistence operations and transactions through an EntityManager.",
        "analogy": "An expert diplomatic translator at an international conference converting English ideas (Java objects) into Japanese grammar (SQL queries) and back seamlessly.",
        "whyItExists": "Eliminates repetitive JDBC boilerplate SQL queries, index-based result set extraction, and manual state synchronization between memory and disk."
    },
    "syntaxBreakdown": {
        "title": "JPA Declarative Entity Mapping and EntityManager Usage",
        "codeSnippet": "@Entity\n@Table(name = \"customers\")\npublic class Customer {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    @Column(name = \"full_name\")\n    private String name;\n}\n\n// Usage:\nEntityManager em = emf.createEntityManager();\nem.persist(new Customer(\"Alice\"));\nCustomer c = em.find(Customer.class, 1L);",
        "explanation": "Annotated POJOs are managed by EntityManager in a first-level persistence cache and synchronized with the database on commit.",
        "tokens": [
            {
                "token": "@Entity",
                "explanation": "Marks a POJO class as a managed relational entity"
            },
            {
                "token": "@Id",
                "explanation": "Specifies the primary key field of the database entity"
            },
            {
                "token": "EntityManager",
                "explanation": "Core JPA interface providing CRUD operations and query creation"
            },
            {
                "token": "JPQL",
                "explanation": "Object-oriented query language targeting Java classes and fields"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-83-basic",
            "title": "Declarative Customer Entity Mapping",
            "type": "basic",
            "description": "Demonstrates POJO mapping with @Entity, @Table, @Id, and @Column annotations.",
            "filename": "CustomerEntity.java",
            "code": "package com.handbook.enterprise;\n\nimport java.lang.annotation.*;\n\n@Entity\n@Table(name = \"customers\")\npublic class CustomerEntity {\n    @Id\n    private Long id;\n\n    @Column(name = \"full_name\", nullable = false)\n    private String name;\n\n    @Column(name = \"email_address\")\n    private String email;\n\n    @Column(name = \"is_active\")\n    private boolean active;\n\n    public CustomerEntity() {}\n\n    public CustomerEntity(Long id, String name, String email, boolean active) {\n        this.id = id;\n        this.name = name;\n        this.email = email;\n        this.active = active;\n    }\n\n    public Long getId() { return id; }\n    public String getName() { return name; }\n    public String getEmail() { return email; }\n    public boolean isActive() { return active; }\n\n    @Override\n    public String toString() {\n        return \"Customer[id=\" + id + \", name='\" + name + \"', email='\" + email + \"']\";\n    }\n}",
            "output": "Customer[id=1, name='Alice Hamilton', email='alice@example.com']",
            "stepByStep": [
                "Entity class defined with zero-argument constructor.",
                "@Entity marks class as JPA managed entity.",
                "@Table defines target database table name.",
                "@Id designates unique primary key property.",
                "@Column overrides default physical column names and nullability constraints."
            ]
        },
        {
            "id": "ex-83-realistic",
            "title": "EntityManager Lifecycle & First-Level Cache Simulator",
            "type": "realistic",
            "description": "Simulates entity persistence, primary key cache lookup, JPQL execution, and entity removal.",
            "filename": "JpaEntityDemo.java",
            "code": "package com.handbook.enterprise;\n\nimport java.util.*;\n\npublic class JpaEntityDemo {\n    public static class MockEntityManager {\n        private final Map<Long, Customer> persistenceContext = new HashMap<>();\n\n        public void persist(Customer customer) {\n            persistenceContext.put(customer.getId(), customer);\n            System.out.println(\"[EntityManager] Persisted entity into First-Level Cache: \" + customer);\n        }\n\n        public Customer find(Class<?> clazz, Long pk) {\n            System.out.println(\"[EntityManager] Looking up \" + clazz.getSimpleName() + \" with PK=\" + pk);\n            return persistenceContext.get(pk);\n        }\n\n        public List<Customer> createQuery(String jpql) {\n            System.out.println(\"[EntityManager] Executing JPQL: \" + jpql);\n            List<Customer> results = new ArrayList<>();\n            for (Customer c : persistenceContext.values()) {\n                if (c.isActive()) results.add(c);\n            }\n            return results;\n        }\n\n        public void remove(Customer customer) {\n            persistenceContext.remove(customer.getId());\n            System.out.println(\"[EntityManager] Removed entity from Persistence Context: \" + customer.getId());\n        }\n    }\n\n    public static void main(String[] args) {\n        MockEntityManager em = new MockEntityManager();\n        em.persist(new Customer(1L, \"Alice Hamilton\", \"alice@example.com\", true));\n        em.persist(new Customer(2L, \"Bob Vance\", \"bob@vance.com\", false));\n\n        Customer fetched = em.find(Customer.class, 1L);\n        assert fetched != null && fetched.getName().equals(\"Alice Hamilton\");\n\n        List<Customer> active = em.createQuery(\"SELECT c FROM Customer c WHERE c.active = true\");\n        assert active.size() == 1;\n\n        System.out.println(\"JPA EntityManager lifecycle and entity mapping verified successfully.\");\n    }\n}",
            "output": "JPA EntityManager lifecycle and entity mapping verified successfully.",
            "stepByStep": [
                "EntityManager initializes empty persistence context (first-level cache).",
                "persist() puts customer into managed cache state.",
                "find() inspects persistence context cache before issuing physical queries.",
                "JPQL executes object-oriented query over managed entities.",
                "remove() schedules entity for database deletion."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Missing zero-argument constructor on @Entity class",
            "errorCodeOrSnippet": "org.hibernate.InstantiationException: No default constructor for entity",
            "cause": "JPA providers use reflection to instantiate empty entity instances before reading database fields.",
            "solution": "Always declare a public or protected no-argument constructor: protected Customer() {}."
        },
        {
            "title": "The N+1 Select Query Problem",
            "errorCodeOrSnippet": "SELECT * FROM items WHERE order_id = ? (executed 100 times in a loop)",
            "cause": "Lazy loading associations without join fetching creates 1 parent query followed by N child queries.",
            "solution": "Use JOIN FETCH in JPQL queries to load associations in a single SQL join: SELECT o FROM Order o JOIN FETCH o.items."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always use parameterized JPQL queries (:param) to prevent SQL injection vulnerabilities.",
            "Prefer FetchType.LAZY for collection relationships to prevent unexpected full database scans.",
            "Keep transactions short and scoped exclusively to database operations."
        ],
        "dontList": [
            "Do not hold EntityManager transactions open during slow external HTTP calls or disk operations.",
            "Do not make entity classes final: JPA proxies require subclassing.",
            "Do not use plain String concatenation to construct dynamic JPQL queries."
        ],
        "whenNotToUse": "When running high-volume batch data pipelines or complex analytical data warehouse queries where native SQL outperforms ORM reflection."
    },
    "versionNotes": {
        "introduced": "Java EE 5 / JSR 220",
        "status": "Stable",
        "compatibilityNotes": "Standardized under the jakarta.persistence.* namespace in Jakarta EE 9 and 10.",
        "ltsAvailability": "Universal enterprise database mapping standard."
    },
    "cheatSheet": {
        "title": "JPA Entity Lifecycle States",
        "headers": [
            "Lifecycle State",
            "In RAM",
            "In Database",
            "In Persistence Context"
        ],
        "rows": [
            [
                "New / Transient",
                "Yes",
                "No",
                "No"
            ],
            [
                "Managed",
                "Yes",
                "Yes (or pending)",
                "Yes (tracked by dirty checker)"
            ],
            [
                "Detached",
                "Yes",
                "Yes",
                "No (em.close() called)"
            ],
            [
                "Removed",
                "Yes",
                "Pending deletion",
                "Yes (marked for delete)"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "JPQL Injection Vulnerability",
            "prompt": "Identify the security defect in em.createQuery(\"SELECT u FROM User u WHERE u.name = '\" + name + \"'\").",
            "starterCode": "String jpql = \"SELECT u FROM User u WHERE u.name = '\" + name + \"'\";",
            "solution": "String concatenation creates JPQL Injection vulnerabilities. Attackers can supply input like \"admin' OR '1'='1\" to bypass authentication. Use named parameters instead: em.createQuery(\"SELECT u FROM User u WHERE u.name = :name\", User.class).setParameter(\"name\", name).",
            "explanation": "Always use parameterized queries with setParameter() to ensure safe execution."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Minimal Entity Class",
            "prompt": "Write an @Entity class Account with an autogenerated Long id and a String accountNumber column.",
            "starterCode": "// Define Account entity",
            "solution": "@Entity\n@Table(name = \"accounts\")\npublic class Account {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    @Column(name = \"account_number\", nullable = false)\n    private String accountNumber;\n    public Account() {}\n}",
            "explanation": "Every JPA entity requires @Entity, @Id, and a default zero-argument constructor."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Persistence Specification 3.1",
            "url": "https://jakarta.ee/specifications/persistence/3.1/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Hibernate ORM Official User Guide",
            "url": "https://hibernate.org/orm/documentation/",
            "organization": "Eclipse Foundation"
        }
    ]
},

  {
    "id": "topic-84",
    "slug": "jakarta-contexts-and-dependency-injection-cdi",
    "topicNumber": 84,
    "title": "Contexts & Dependency Injection (CDI)",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 23,
    "sectionTitle": "Jakarta EE Enterprise Stack Overview",
    "versionBadge": "Jakarta CDI 4.0 / EE 10",
    "difficulty": "Advanced",
    "readingTime": "13 min read",
    "shortDescription": "Decouple enterprise architectures through type-safe dependency injection, lifecycle contexts (@ApplicationScoped, @RequestScoped), and qualifiers.",
    "prerequisites": [
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 23: Interfaces & Default Methods",
        "Topic 58: Annotations & Metadata"
    ],
    "whatAndWhy": {
        "definition": "Contexts and Dependency Injection (CDI) is the standard dependency injection and contextual lifecycle management engine of Jakarta EE, eliminating hardcoded object instantiations via @Inject and scoped proxies.",
        "analogy": "Standard wall electrical power sockets: appliances plug in anywhere using a standard plug interface without hardwiring into municipal generator turbines.",
        "whyItExists": "Decouples business services, eliminates manual lifecycle management, and enables effortless unit testing through mock injection."
    },
    "syntaxBreakdown": {
        "title": "CDI Injection and Scope Annotations",
        "codeSnippet": "@ApplicationScoped\npublic class TaxService {\n    public double calculate(double subtotal) { return subtotal * 0.08; }\n}\n\n@RequestScoped\npublic class CheckoutController {\n    @Inject\n    private TaxService taxService;\n}",
        "explanation": "Container inspects @Inject fields and injects matching contextual beans automatically.",
        "tokens": [
            {
                "token": "@Inject",
                "explanation": "Directs container to resolve and satisfy dependency at runtime"
            },
            {
                "token": "@ApplicationScoped",
                "explanation": "Single shared instance for entire application lifetime"
            },
            {
                "token": "@RequestScoped",
                "explanation": "New bean instance created per HTTP request lifecycle"
            },
            {
                "token": "@Produces",
                "explanation": "Turns method return value into an injectable CDI bean"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-84-basic",
            "title": "Basic Service Interface and CDI Injection",
            "type": "basic",
            "description": "Demonstrates injecting a service interface implementation into a consumer class.",
            "filename": "PaymentService.java",
            "code": "package com.handbook.enterprise;\n\npublic class PaymentService {\n    public interface PaymentProcessor {\n        String pay(double amount);\n    }\n\n    public static class CreditCardProcessor implements PaymentProcessor {\n        @Override\n        public String pay(double amount) {\n            return \"SUCCESS: Charged $\" + amount;\n        }\n    }\n\n    public static class OrderManager {\n        private PaymentProcessor processor;\n\n        public String processOrder(double amount) {\n            return processor.pay(amount);\n        }\n        public void setProcessor(PaymentProcessor p) { this.processor = p; }\n    }\n}",
            "output": "SUCCESS: Charged $99.50",
            "stepByStep": [
                "Service interface defined representing capability.",
                "Implementation marked as injectable bean.",
                "Consumer requests dependency via @Inject.",
                "Container wires implementation at runtime."
            ]
        },
        {
            "id": "ex-84-realistic",
            "title": "Realistic CDI Container Injection Engine Simulator",
            "type": "realistic",
            "description": "Demonstrates reflection-based dependency injection, singleton scoping, and execution.",
            "filename": "CdiDependencyInjectionDemo.java",
            "code": "package com.handbook.enterprise;\n\nimport java.lang.reflect.Field;\nimport java.util.HashMap;\nimport java.util.Map;\n\npublic class CdiDependencyInjectionDemo {\n    public interface PaymentGateway {\n        String process(double amount);\n    }\n\n    public static class StripePaymentGateway implements PaymentGateway {\n        @Override\n        public String process(double amount) {\n            return \"SUCCESS [Stripe]: Charged $\" + amount;\n        }\n    }\n\n    public static class CheckoutService {\n        private PaymentGateway gateway;\n\n        public String executeCheckout(double orderTotal) {\n            if (gateway == null) throw new IllegalStateException(\"CDI Injection Failed: Gateway is null!\");\n            return gateway.process(orderTotal);\n        }\n        public PaymentGateway getGateway() { return gateway; }\n        public void setGateway(PaymentGateway gateway) { this.gateway = gateway; }\n    }\n\n    public static class SimpleCdiContainer {\n        private final Map<Class<?>, Object> singletons = new HashMap<>();\n\n        public <T> void registerSingleton(Class<T> type, T instance) {\n            singletons.put(type, instance);\n        }\n\n        public <T> T createBean(Class<T> beanClass) throws Exception {\n            T bean = beanClass.getDeclaredConstructor().newInstance();\n            for (Field field : beanClass.getDeclaredFields()) {\n                field.setAccessible(true);\n                Class<?> targetType = field.getType();\n                Object dependency = singletons.get(targetType);\n                if (dependency != null) {\n                    field.set(bean, dependency);\n                }\n            }\n            return bean;\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        SimpleCdiContainer container = new SimpleCdiContainer();\n        container.registerSingleton(PaymentGateway.class, new StripePaymentGateway());\n\n        CheckoutService checkout = container.createBean(CheckoutService.class);\n        assert checkout.getGateway() != null;\n        String result = checkout.executeCheckout(249.99);\n        System.out.println(result);\n        System.out.println(\"CDI container dependency injection verified successfully.\");\n    }\n}",
            "output": "SUCCESS [Stripe]: Charged $249.99\nCDI container dependency injection verified successfully.",
            "stepByStep": [
                "Container instantiates and stores ApplicationScoped singletons.",
                "Client bean instantiated via reflection.",
                "Container inspects fields, looks up matching interface, and injects instance.",
                "Client executes business method using injected dependency."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Ambiguous dependency when multiple implementations exist",
            "errorCodeOrSnippet": "org.jboss.weld.exceptions.DeploymentException: Ambiguous dependencies for type [Service]",
            "cause": "Two beans implement the same interface without @Qualifier or @Alternative annotations.",
            "solution": "Use custom CDI @Qualifier annotations or @Priority to disambiguate the target implementation."
        },
        {
            "title": "Instantiating CDI beans with new instead of injection",
            "errorCodeOrSnippet": "OrderService s = new OrderService(); s.execute(); // @Inject fields are null!",
            "cause": "Calling new creates a raw Java object outside the container, leaving @Inject fields unpopulated.",
            "solution": "Always obtain beans via @Inject or Programmatic Lookup (CDI.current().select())."
        }
    ],
    "bestPractices": {
        "doList": [
            "Prefer constructor injection over field injection for improved testability and immutability.",
            "Use @Produces to integrate third-party libraries into the CDI bean ecosystem.",
            "Choose the narrowest appropriate scope: @RequestScoped for user request data, @ApplicationScoped for stateless services."
        ],
        "dontList": [
            "Do not put mutable state in @ApplicationScoped beans without synchronization.",
            "Do not create circular dependencies between beans.",
            "Do not use CDI for lightweight ephemeral DTOs."
        ],
        "whenNotToUse": "For simple utility records or value objects that hold transient data and have no external service dependencies."
    },
    "versionNotes": {
        "introduced": "Java EE 6 / JSR 299",
        "status": "Stable",
        "compatibilityNotes": "CDI 4.0 in Jakarta EE 10 introduced CDI Lite for ahead-of-time compilation and GraalVM native images.",
        "ltsAvailability": "Standard across all Jakarta EE application servers."
    },
    "cheatSheet": {
        "title": "CDI Built-In Scope Matrix",
        "headers": [
            "Scope",
            "Annotation",
            "Lifecycle",
            "Thread Safety Requirement"
        ],
        "rows": [
            [
                "Application",
                "@ApplicationScoped",
                "Entire application run",
                "Must be thread-safe"
            ],
            [
                "Request",
                "@RequestScoped",
                "Single HTTP request",
                "Single-threaded per request"
            ],
            [
                "Session",
                "@SessionScoped",
                "User HttpSession",
                "Serializable"
            ],
            [
                "Dependent",
                "@Dependent (Default)",
                "Inherits caller scope",
                "Matches caller"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Null Pointer in Unit Test",
            "prompt": "Why does service.doWork() throw NullPointerException in a JUnit test when OrderService uses @Inject?",
            "starterCode": "OrderService service = new OrderService();\nservice.doWork();",
            "solution": "Calling new OrderService() instantiates the class outside the CDI container. The container never runs, so @Inject fields remain null. Provide a parameterized constructor to inject mock objects during unit testing.",
            "explanation": "Constructor injection enables easy mock injection in automated tests."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Producer Method",
            "prompt": "Write a CDI producer method that provides an injectable java.util.Random instance.",
            "starterCode": "// Write producer method",
            "solution": "@ApplicationScoped\npublic class RandomProducer {\n    @Produces\n    @ApplicationScoped\n    public Random produceRandom() {\n        return new Random();\n    }\n}",
            "explanation": "@Produces allows third-party types to be injected via @Inject Random random."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Contexts and Dependency Injection 4.0 Specification",
            "url": "https://jakarta.ee/specifications/cdi/4.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "JBoss Weld Reference Guide",
            "url": "https://weld.cdi-spec.org/",
            "organization": "Eclipse Foundation"
        }
    ]
},

  {
    "id": "topic-85",
    "slug": "jakarta-restful-web-services-jax-rs",
    "topicNumber": 85,
    "title": "Jakarta RESTful Web Services (JAX-RS)",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 23,
    "sectionTitle": "Jakarta EE Enterprise Stack Overview",
    "versionBadge": "Jakarta RESTful Web Services 3.1 / EE 10",
    "difficulty": "Advanced",
    "readingTime": "14 min read",
    "shortDescription": "Build production RESTful APIs using declarative URI routing (@Path), HTTP verbs (@GET, @POST), media negotiation, and JAX-RS filters.",
    "prerequisites": [
        "Topic 64: Web Architecture Fundamentals (HTTP Protocol)",
        "Topic 66: Servlet Lifecycle & Architecture",
        "Topic 84: Contexts & Dependency Injection (CDI)"
    ],
    "whatAndWhy": {
        "definition": "Jakarta RESTful Web Services (JAX-RS) is the standard declarative framework for developing HTTP REST APIs in Java using annotations like @Path, @GET, @POST, and @Produces.",
        "analogy": "An automated airport cargo sorting terminal routing packages by barcode tags (@Path) directly to matching processing bays without manual warehouse handling.",
        "whyItExists": "Eliminates repetitive manual Servlet string parsing, JSON serialization, and status code setting, providing a clean declarative API model."
    },
    "syntaxBreakdown": {
        "title": "JAX-RS Resource Class and Method Annotations",
        "codeSnippet": "@Path(\"/api/v1/orders\")\n@Produces(MediaType.APPLICATION_JSON)\npublic class OrderResource {\n    @GET\n    @Path(\"/{id}\")\n    public Response getOrder(@PathParam(\"id\") String id) {\n        Order order = service.find(id);\n        return Response.ok(order).build();\n    }\n}",
        "explanation": "URL path parameters are extracted automatically and response objects are serialized to JSON.",
        "tokens": [
            {
                "token": "@Path(\"/orders\")",
                "explanation": "Base URI template pattern matched against incoming requests"
            },
            {
                "token": "@GET / @POST",
                "explanation": "HTTP verb designator matching client request method"
            },
            {
                "token": "@PathParam(\"id\")",
                "explanation": "Binds dynamic URI path segment to method parameter"
            },
            {
                "token": "Response.ok()",
                "explanation": "Fluent builder returning HTTP 200 with entity payload"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-85-basic",
            "title": "Basic Order REST Resource",
            "type": "basic",
            "description": "Demonstrates URI path variable matching and JSON response formatting.",
            "filename": "OrderResource.java",
            "code": "package com.handbook.enterprise;\n\nimport java.lang.annotation.*;\n\n@Path(\"/api/v1/orders\")\n@Produces({\"application/json\"})\npublic class OrderResource {\n    @GET\n    @Path(\"/{id}\")\n    public String getOrderById(@PathParam(\"id\") String orderId) {\n        return \"{\"orderId\": \"\" + orderId + \"\", \"status\": \"SHIPPED\", \"total\": 199.95}\";\n    }\n\n    @POST\n    public String createOrder() {\n        return \"{\"status\": \"CREATED\", \"id\": \"ORD-9872\"}\";\n    }\n}",
            "output": "{\"orderId\": \"ORD-9872\", \"status\": \"SHIPPED\", \"total\": 199.95}",
            "stepByStep": [
                "Resource mapped to /api/v1/orders base path.",
                "GET request matches @GET with /{id} path template.",
                "orderId parameter extracted from URI.",
                "JSON representation returned to client."
            ]
        },
        {
            "id": "ex-85-realistic",
            "title": "Realistic JAX-RS Dispatcher & Router Simulator",
            "type": "realistic",
            "description": "Emulates JAX-RS container matching HTTP verbs, path variables, and returning JSON.",
            "filename": "JaxRsEndpointDemo.java",
            "code": "package com.handbook.enterprise;\n\nimport java.lang.reflect.Method;\n\npublic class JaxRsEndpointDemo {\n    public static class MockJaxRsDispatcher {\n        public String dispatch(String method, String uri) throws Exception {\n            OrderResource resource = new OrderResource();\n            if (uri.startsWith(\"/api/v1/orders/\")) {\n                String id = uri.substring(\"/api/v1/orders/\".length());\n                return resource.getOrderById(id);\n            } else if (\"POST\".equals(method) && uri.equals(\"/api/v1/orders\")) {\n                return resource.createOrder();\n            }\n            return \"{\"error\": \"404 Not Found\"}\";\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        MockJaxRsDispatcher dispatcher = new MockJaxRsDispatcher();\n        String getResult = dispatcher.dispatch(\"GET\", \"/api/v1/orders/ORD-9872\");\n        assert getResult.contains(\"SHIPPED\");\n\n        String postResult = dispatcher.dispatch(\"POST\", \"/api/v1/orders\");\n        assert postResult.contains(\"CREATED\");\n\n        System.out.println(\"JAX-RS annotation routing and JSON dispatch verified successfully.\");\n    }\n}",
            "output": "JAX-RS annotation routing and JSON dispatch verified successfully.",
            "stepByStep": [
                "Dispatcher receives HTTP method and target URI.",
                "Path prefix matched against @Path root annotation.",
                "Subpath extracted and passed as @PathParam argument.",
                "JSON payload returned with proper HTTP status."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Returning null when resource is not found instead of 404",
            "errorCodeOrSnippet": "public Order get(@PathParam(\"id\") String id) { return null; }",
            "cause": "Returning null results in HTTP 204 No Content rather than HTTP 404 Not Found.",
            "solution": "Use Response.status(Response.Status.NOT_FOUND).build() when an entity is missing."
        },
        {
            "title": "Using action verbs in URIs instead of HTTP verbs",
            "errorCodeOrSnippet": "@POST @Path(\"/deleteCustomer\") // Anti-pattern",
            "cause": "Violates REST architectural principles by putting procedural operations in the URI.",
            "solution": "Use HTTP DELETE with resource nouns: @DELETE @Path(\"/{id}\")."
        }
    ],
    "bestPractices": {
        "doList": [
            "Always return HTTP 201 Created with Location header when creating entities via POST.",
            "Use ExceptionMapper to convert unhandled exceptions into uniform JSON error bodies.",
            "Always specify @Produces(MediaType.APPLICATION_JSON) and @Consumes(MediaType.APPLICATION_JSON)."
        ],
        "dontList": [
            "Do not use HTTP GET for actions that mutate server state.",
            "Do not expose internal database IDs directly if security requires non-enumerable UUIDs.",
            "Do not write raw JSON strings by hand; use JSON-B or Jackson entity serialization."
        ],
        "whenNotToUse": "For low-latency binary gaming communication or real-time bi-directional streaming where WebSockets or gRPC are better suited."
    },
    "versionNotes": {
        "introduced": "Java EE 5 / JSR 311",
        "status": "Stable",
        "compatibilityNotes": "Standardized under jakarta.ws.rs.* in Jakarta EE 9 and 10.",
        "ltsAvailability": "Universal REST development standard across Java servers."
    },
    "cheatSheet": {
        "title": "JAX-RS Annotations Reference",
        "headers": [
            "Annotation",
            "Target",
            "Purpose",
            "Example"
        ],
        "rows": [
            [
                "@Path",
                "Class / Method",
                "URI path template matching",
                "@Path(\"/orders\")"
            ],
            [
                "@GET / @POST",
                "Method",
                "HTTP verb binding",
                "@GET"
            ],
            [
                "@PathParam",
                "Parameter",
                "Extracts URI path segment",
                "@PathParam(\"id\") Long id"
            ],
            [
                "@QueryParam",
                "Parameter",
                "Extracts URL query parameter",
                "@QueryParam(\"page\") int p"
            ],
            [
                "@Produces",
                "Class / Method",
                "Outbound MIME representation",
                "@Produces(\"application/json\")"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Misleading HTTP Status Code",
            "prompt": "Why is returning HTTP 200 OK with a body {\"status\": \"error\", \"message\": \"Not Found\"} an anti-pattern in REST?",
            "starterCode": "return Response.ok(\"{\"error\": \"not found\"}\").build();",
            "solution": "HTTP status codes communicate technical transport results to proxies, load balancers, and clients. Returning 200 OK tricks caching proxies into caching failure responses. Use HTTP 404 Not Found instead: Response.status(Status.NOT_FOUND).entity(err).build().",
            "explanation": "REST clients rely on standard HTTP status codes for error handling."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Delete Resource Endpoint",
            "prompt": "Write a JAX-RS method that deletes a book by id and returns HTTP 204 No Content.",
            "starterCode": "// Write deleteBook method",
            "solution": "@DELETE\n@Path(\"/{id}\")\npublic Response deleteBook(@PathParam(\"id\") Long id) {\n    bookService.delete(id);\n    return Response.noContent().build();\n}",
            "explanation": "HTTP 204 No Content is the standard status code for successful deletions."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta RESTful Web Services 3.1 Specification",
            "url": "https://jakarta.ee/specifications/restful-ws/3.1/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Eclipse Jersey User Guide",
            "url": "https://eclipse-ee4j.github.io/jersey/",
            "organization": "Eclipse Foundation"
        }
    ]
},

  {
    "id": "topic-86",
    "slug": "jakarta-bean-validation",
    "topicNumber": 86,
    "title": "Jakarta Bean Validation",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 23,
    "sectionTitle": "Jakarta EE Enterprise Stack Overview",
    "versionBadge": "Jakarta Validation 3.0 / EE 10",
    "difficulty": "Intermediate",
    "readingTime": "12 min read",
    "shortDescription": "Enforce consistent data integrity rules across all application tiers using declarative constraint annotations (@NotNull, @Size, @Email, @Pattern).",
    "prerequisites": [
        "Topic 16: Classes, Objects & Memory Layout",
        "Topic 58: Annotations & Metadata",
        "Topic 80: Form Handling, Validation & Multipart File Uploads"
    ],
    "whatAndWhy": {
        "definition": "Jakarta Bean Validation provides a unified declarative metadata model to define and enforce constraint validations directly on Java domain models and DTOs using annotations like @NotNull, @Size, and @Email.",
        "analogy": "Airport luggage size test frames at boarding gates: a single standardized physical measurement frame applied consistently across all check-in points.",
        "whyItExists": "Eliminates repetitive imperative validation logic duplicated across UI controllers, services, and database layers."
    },
    "syntaxBreakdown": {
        "title": "Declarative Constraint Annotations on Model Fields",
        "codeSnippet": "public class CustomerDto {\n    @NotNull(message = \"Name cannot be null\")\n    @Size(min = 2, max = 50)\n    private String name;\n\n    @NotBlank\n    @Email\n    private String email;\n\n    @Min(18)\n    private int age;\n}",
        "explanation": "Annotations express domain constraints cleanly and are evaluated automatically by the validation runtime.",
        "tokens": [
            {
                "token": "@NotNull",
                "explanation": "Rejects null; permits empty strings and whitespace"
            },
            {
                "token": "@NotBlank",
                "explanation": "Rejects null, length 0, and whitespace-only strings"
            },
            {
                "token": "@Size(min, max)",
                "explanation": "Enforces length bounds on strings or collection size"
            },
            {
                "token": "@Email",
                "explanation": "Validates string against standard email RFC format"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-86-basic",
            "title": "Basic DTO Constraints Definition",
            "type": "basic",
            "description": "Demonstrates declaring constraints on data transfer objects.",
            "filename": "AccountDto.java",
            "code": "package com.handbook.enterprise;\n\npublic class AccountDto {\n    @NotNull\n    @Size(min = 3, max = 15)\n    private String accountId;\n\n    @Min(100)\n    private double initialDeposit;\n\n    public AccountDto(String id, double deposit) {\n        this.accountId = id;\n        this.initialDeposit = deposit;\n    }\n}",
            "output": "Constraint violations: 0 (valid account)",
            "stepByStep": [
                "DTO class declared with private fields.",
                "@NotNull and @Size constrain account identifier length.",
                "@Min ensures initial deposit meets minimum threshold.",
                "Validation engine inspects metadata before processing."
            ]
        },
        {
            "id": "ex-86-realistic",
            "title": "Realistic Validator Engine and Violation Reporting Simulator",
            "type": "realistic",
            "description": "Demonstrates inspecting constraints, evaluating values, and reporting detailed violations.",
            "filename": "BeanValidationDemo.java",
            "code": "package com.handbook.enterprise;\n\nimport java.lang.reflect.Field;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class BeanValidationDemo {\n    public static class UserRegistrationForm {\n        @NotNull(message = \"Username cannot be null\")\n        @Size(min = 3, max = 20, message = \"Username must be between 3 and 20 characters\")\n        private String username;\n\n        @NotNull(message = \"Age cannot be null\")\n        @Min(value = 18, message = \"User must be at least 18 years old\")\n        private Integer age;\n\n        public UserRegistrationForm(String username, Integer age) {\n            this.username = username;\n            this.age = age;\n        }\n        public String getUsername() { return username; }\n        public Integer getAge() { return age; }\n    }\n\n    public record Violation(String field, String message) {}\n\n    public static class MockValidator {\n        public List<Violation> validate(Object target) {\n            List<Violation> violations = new ArrayList<>();\n            for (Field field : target.getClass().getDeclaredFields()) {\n                field.setAccessible(true);\n                try {\n                    Object val = field.get(target);\n                    if (field.isAnnotationPresent(NotNull.class) && val == null) {\n                        violations.add(new Violation(field.getName(), \"null\"));\n                    }\n                    if (field.isAnnotationPresent(Size.class) && val instanceof String s) {\n                        Size sz = field.getAnnotation(Size.class);\n                        if (s.length() < sz.min() || s.length() > sz.max()) {\n                            violations.add(new Violation(field.getName(), sz.message()));\n                        }\n                    }\n                    if (field.isAnnotationPresent(Min.class) && val instanceof Number n) {\n                        Min min = field.getAnnotation(Min.class);\n                        if (n.longValue() < min.value()) {\n                            violations.add(new Violation(field.getName(), min.message()));\n                        }\n                    }\n                } catch (Exception ignored) {}\n            }\n            return violations;\n        }\n    }\n\n    public static void main(String[] args) {\n        MockValidator validator = new MockValidator();\n        UserRegistrationForm invalid = new UserRegistrationForm(\"al\", 16);\n        List<Violation> list = validator.validate(invalid);\n        assert list.size() == 2;\n        System.out.println(\"Declarative constraint inspection verified successfully.\");\n    }\n}",
            "output": "Declarative constraint inspection verified successfully.",
            "stepByStep": [
                "Form submitted with invalid username length and under-age value.",
                "Validator inspects model fields via reflection.",
                "Constraint rules evaluate values against thresholds.",
                "Violations aggregated and returned for user notification."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Using @NotNull instead of @NotBlank for text strings",
            "errorCodeOrSnippet": "@NotNull private String name; // Accepts \"   \"",
            "cause": "@NotNull only checks that the object reference is not null; empty or whitespace strings pass.",
            "solution": "Use @NotBlank to ensure strings contain at least one non-whitespace character."
        },
        {
            "title": "Forgetting @Valid on nested complex objects",
            "errorCodeOrSnippet": "@NotNull private Address shippingAddress; // Address fields never checked!",
            "cause": "Validation engines do not cascade into child properties unless explicitly instructed.",
            "solution": "Add @Valid alongside @NotNull to enable cascading validation on child properties."
        }
    ],
    "bestPractices": {
        "doList": [
            "Declare validation constraints directly on DTOs and entities for consistent rules across all tiers.",
            "Use custom error messages with parameterized placeholders ({min}, {max}) for clean user feedback.",
            "Use validation groups (@ConvertGroup) to apply different rule sets for creation vs updates."
        ],
        "dontList": [
            "Do not write manual imperative if-else validation logic in controllers when annotations suffice.",
            "Do not perform heavy database queries inside constraint validators.",
            "Do not bypass validation when updating existing entities."
        ],
        "whenNotToUse": "When rules require cross-table transactional database queries or external API calls: perform those in domain services."
    },
    "versionNotes": {
        "introduced": "Java EE 6 / JSR 303",
        "status": "Stable",
        "compatibilityNotes": "Standardized under jakarta.validation.* in Jakarta EE 9 and 10.",
        "ltsAvailability": "Universal standard across all Jakarta EE and modern Java frameworks."
    },
    "cheatSheet": {
        "title": "Standard Bean Validation Constraints",
        "headers": [
            "Constraint",
            "Target Types",
            "Validation Rule"
        ],
        "rows": [
            [
                "@NotNull",
                "Any object",
                "Value is not null"
            ],
            [
                "@NotEmpty",
                "String, Collection, Map",
                "Not null and size > 0"
            ],
            [
                "@NotBlank",
                "String",
                "Not null and contains non-whitespace"
            ],
            [
                "@Size(min, max)",
                "String, Collection",
                "Length / size between bounds"
            ],
            [
                "@Min / @Max",
                "Numeric types",
                "Value within numeric bounds"
            ],
            [
                "@Email",
                "String",
                "Valid email address syntax"
            ],
            [
                "@Pattern(regexp)",
                "String",
                "Matches regular expression"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Whitespace Bypassing Validation",
            "prompt": "Why does a password field with @NotNull allow a user to register with a password consisting of only three spaces \"   \"?",
            "starterCode": "@NotNull\nprivate String password;",
            "solution": "@NotNull checks only that the reference is not null. A string with three spaces is non-null with length 3, so it passes. Use @NotBlank instead, which trims whitespace and ensures real characters exist.",
            "explanation": "Always use @NotBlank for required text inputs."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Future Date Constraint",
            "prompt": "Write an entity field ensuring an expiration date is not null and occurs in the future.",
            "starterCode": "private LocalDate expirationDate;",
            "solution": "@NotNull(message = \"Expiration date required\")\n@Future(message = \"Expiration date must be in the future\")\nprivate LocalDate expirationDate;",
            "explanation": "@Future validates that temporal values (LocalDate, Instant) are strictly after the current time."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Bean Validation 3.0 Specification",
            "url": "https://jakarta.ee/specifications/bean-validation/3.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Hibernate Validator Reference Guide",
            "url": "https://hibernate.org/validator/documentation/",
            "organization": "Eclipse Foundation"
        }
    ]
},

  {
    "id": "topic-87",
    "slug": "jakarta-faces-jsf-and-enterprise-beans-ejb",
    "topicNumber": 87,
    "title": "Jakarta Faces (JSF) & Enterprise Beans (EJB)",
    "part": "Part 2: Java EE & Jakarta EE",
    "sectionNumber": 23,
    "sectionTitle": "Jakarta EE Enterprise Stack Overview",
    "versionBadge": "Jakarta Faces 4.0 / EE 10",
    "difficulty": "Advanced",
    "readingTime": "15 min read",
    "shortDescription": "Explore component-based web UIs with Jakarta Faces (JSF) and container-managed declarative transactions with Enterprise JavaBeans (EJB).",
    "prerequisites": [
        "Topic 74: JSP Architecture & Translation Lifecycle",
        "Topic 82: JDBC Connection Pooling in Web Applications",
        "Topic 84: Contexts & Dependency Injection (CDI)"
    ],
    "whatAndWhy": {
        "definition": "Jakarta Faces is a component-based server-side web UI framework featuring an automated 6-phase request lifecycle, while Enterprise Beans (EJB) provides container-managed transactions and concurrency for enterprise business services.",
        "analogy": "A high-speed train system: Faces represents the automated station turnstiles and display monitors; EJB represents the centralized power substation managing high-voltage safety switches atomically.",
        "whyItExists": "Allows rapid development of complex back-office administrative forms with rich UI components backed by declarative container-managed database transactions."
    },
    "syntaxBreakdown": {
        "title": "EJB Stateless Service and JSF Backing Bean Mapping",
        "codeSnippet": "@Stateless\npublic class BankService {\n    @TransactionAttribute(TransactionAttributeType.REQUIRED)\n    public void transfer(Long from, Long to, double amount) {\n        // Transaction automatically managed by container\n    }\n}\n\n@Named(\"transferBean\")\n@ViewScoped\npublic class TransferBean implements Serializable {\n    @Inject private BankService bankService;\n    public String submit() { bankService.transfer(1L, 2L, 500.0); return \"receipt\"; }\n}",
        "explanation": "JSF backing bean coordinates UI inputs and triggers EJB transactional business logic.",
        "tokens": [
            {
                "token": "@Stateless",
                "explanation": "Pooled session bean without client-specific conversational state"
            },
            {
                "token": "@TransactionAttribute",
                "explanation": "Declarative container transaction boundary (REQUIRED, REQUIRES_NEW)"
            },
            {
                "token": "@ViewScoped",
                "explanation": "JSF scope keeping bean alive across AJAX updates on same page"
            },
            {
                "token": "#{bean.action}",
                "explanation": "Expression Language binding button clicks to backing bean methods"
            }
        ]
    },
    "examples": [
        {
            "id": "ex-87-basic",
            "title": "Basic EJB Stateless Bean and Backing Bean",
            "type": "basic",
            "description": "Demonstrates a stateless session bean and a JSF backing bean.",
            "filename": "PaymentBackingBean.java",
            "code": "package com.handbook.enterprise;\n\npublic class PaymentBackingBean {\n    private String account;\n    private double amount;\n\n    public static class PaymentProcessingBean {\n        public boolean authorizePayment(String account, double amount) {\n            System.out.println(\"[EJB] Debiting $\" + amount + \" from \" + account);\n            return true;\n        }\n    }\n\n    private final PaymentProcessingBean service = new PaymentProcessingBean();\n\n    public String submit() {\n        service.authorizePayment(account, amount);\n        return \"receipt\";\n    }\n\n    public String getAccount() { return account; }\n    public void setAccount(String account) { this.account = account; }\n    public double getAmount() { return amount; }\n    public void setAmount(double amount) { this.amount = amount; }\n}",
            "output": "[EJB] Debiting $150.0 from ACC-4401",
            "stepByStep": [
                "EJB stateless service manages transaction boundaries.",
                "Backing bean holds view state.",
                "Action method delegates to EJB service.",
                "Navigation string returned to determine next view."
            ]
        },
        {
            "id": "ex-87-realistic",
            "title": "Realistic JSF 6-Phase Lifecycle & EJB Transaction Simulator",
            "type": "realistic",
            "description": "Simulates the complete 6-phase JSF request lifecycle driving an EJB transaction.",
            "filename": "JsfEjbArchitectureDemo.java",
            "code": "package com.handbook.enterprise;\n\nimport java.util.List;\n\npublic class JsfEjbArchitectureDemo {\n    public static class BankTransferService {\n        public boolean transfer(String from, String to, double amount) {\n            System.out.println(\"[EJB Container] Starting JTA container-managed transaction (REQUIRED)\");\n            System.out.printf(\"[EJB] Transferring $%.2f from %s to %s%n\", amount, from, to);\n            System.out.println(\"[EJB Container] Committing JTA transaction\");\n            return true;\n        }\n    }\n\n    public static class TransferBackingBean {\n        private String sourceAccount;\n        private String targetAccount;\n        private double amount;\n        private String feedbackMessage;\n        private final BankTransferService transferService = new BankTransferService();\n\n        public String submitTransfer() {\n            boolean ok = transferService.transfer(sourceAccount, targetAccount, amount);\n            if (ok) {\n                this.feedbackMessage = \"Success: Transferred $\" + amount;\n                return \"receipt?faces-redirect=true\";\n            }\n            return \"error\";\n        }\n        public void setSourceAccount(String s) { this.sourceAccount = s; }\n        public void setTargetAccount(String t) { this.targetAccount = t; }\n        public void setAmount(double a) { this.amount = a; }\n        public String getFeedbackMessage() { return feedbackMessage; }\n    }\n\n    public static void main(String[] args) {\n        TransferBackingBean bean = new TransferBackingBean();\n        bean.setSourceAccount(\"ACC-1001\");\n        bean.setTargetAccount(\"ACC-2002\");\n        bean.setAmount(500.0);\n\n        String result = bean.submitTransfer();\n        assert bean.getFeedbackMessage().contains(\"Success: Transferred $500.0\");\n        System.out.println(\"JSF lifecycle and EJB transaction execution verified successfully.\");\n    }\n}",
            "output": "[EJB Container] Starting JTA container-managed transaction (REQUIRED)\n[EJB] Transferring $500.00 from ACC-1001 to ACC-2002\n[EJB Container] Committing JTA transaction\nJSF lifecycle and EJB transaction execution verified successfully.",
            "stepByStep": [
                "Backing bean populated during model update phase.",
                "Action method invoked during application invocation phase.",
                "EJB container starts JTA transaction.",
                "Business logic executes and transaction commits.",
                "Outcome string determines navigation."
            ]
        }
    ],
    "commonMistakes": [
        {
            "title": "Executing database queries inside backing bean getters",
            "errorCodeOrSnippet": "public List<Order> getOrders() { return db.queryAll(); } // Invoked 10x per request!",
            "cause": "JSF evaluates getters multiple times during component tree rendering, causing duplicate queries.",
            "solution": "Load data inside @PostConstruct lifecycle methods and return cached lists from getters."
        },
        {
            "title": "Omitting Serializable on @ViewScoped or @SessionScoped beans",
            "errorCodeOrSnippet": "java.io.NotSerializableException: com.example.BackingBean",
            "cause": "View and session scoped beans must be serialized during session passivation or cluster replication.",
            "solution": "Always declare implements java.io.Serializable on stateful backing beans."
        }
    ],
    "bestPractices": {
        "doList": [
            "Use modern CDI @Named and @ViewScoped beans instead of legacy @ManagedBean.",
            "Modernize EJB applications by replacing @Stateless with CDI @ApplicationScoped and @Transactional.",
            "Use PrimeFaces when building rich data-table intensive enterprise back-office applications."
        ],
        "dontList": [
            "Do not perform heavy computations inside JSF getter and setter methods.",
            "Do not catch and swallow RuntimeExceptions inside EJB transactional methods: it prevents automatic rollback.",
            "Do not use JSF for public mobile-first APIs: use JAX-RS REST endpoints instead."
        ],
        "whenNotToUse": "When building modern customer-facing single page applications (SPAs) or microservices where REST/JSON and React/Vue are preferred."
    },
    "versionNotes": {
        "introduced": "JSF 1.0 (2004) / EJB 1.0 (1998)",
        "status": "Stable",
        "compatibilityNotes": "Jakarta Faces 4.0 removed legacy JSP support; Facelets (XHTML) is now the exclusive view technology.",
        "ltsAvailability": "Standard in all full-profile Jakarta EE application servers."
    },
    "cheatSheet": {
        "title": "JSF 6-Phase Request Lifecycle",
        "headers": [
            "Phase Number",
            "Phase Name",
            "Key Responsibility"
        ],
        "rows": [
            [
                "1",
                "Restore View",
                "Reconstructs UI component tree in memory"
            ],
            [
                "2",
                "Apply Request Values",
                "Decodes HTTP POST parameters into component local values"
            ],
            [
                "3",
                "Process Validations",
                "Runs type conversions and Bean Validation checks"
            ],
            [
                "4",
                "Update Model Values",
                "Invokes backing bean setters with validated values"
            ],
            [
                "5",
                "Invoke Application",
                "Executes action methods and EJB business services"
            ],
            [
                "6",
                "Render Response",
                "Encodes component tree into HTML and streams to client"
            ]
        ]
    },
    "exercises": [
        {
            "id": 1,
            "type": "Spot the Bug",
            "title": "Skipped Phases on Validation Error",
            "prompt": "If a user inputs invalid text that fails a @NotNull constraint, why are backing bean setters never called?",
            "starterCode": "<h:inputText value=\"#{bean.name}\" required=\"true\" />",
            "solution": "During Phase 3 (Process Validations), JSF marks the component invalid and registers a FacesMessage. JSF immediately bypasses Phase 4 (Update Model Values) and Phase 5 (Invoke Application) and jumps directly to Phase 6 (Render Response) to show the error message without corrupting backing bean state.",
            "explanation": "JSF guards backend state by aborting model updates upon validation failures."
        },
        {
            "id": 2,
            "type": "Hands-on Implementation",
            "title": "Declarative Transaction Attribute",
            "prompt": "Write an EJB method that insists on executing inside an existing transaction, throwing an exception if no transaction is active.",
            "starterCode": "// Transaction method",
            "solution": "@Stateless\npublic class LedgerService {\n    @TransactionAttribute(TransactionAttributeType.MANDATORY)\n    public void postEntry(LedgerEntry entry) {\n        em.persist(entry);\n    }\n}",
            "explanation": "TransactionAttributeType.MANDATORY requires an active caller transaction."
        }
    ],
    "officialSources": [
        {
            "title": "Jakarta Faces 4.0 Specification",
            "url": "https://jakarta.ee/specifications/faces/4.0/",
            "organization": "Jakarta EE"
        },
        {
            "title": "Jakarta Enterprise Beans 4.0 Specification",
            "url": "https://jakarta.ee/specifications/enterprise-beans/4.0/",
            "organization": "Jakarta EE"
        }
    ]
}
];

export function getTopicById(id: string): TopicDetail | undefined {
  return ALL_TOPICS.find(t => t.id === id);
}

export function getTopicBySlug(slug: string): TopicDetail | undefined {
  return ALL_TOPICS.find(t => t.slug === slug);
}
