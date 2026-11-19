import fs from 'fs';
import path from 'path';

const jvmTopics = [
  {
    id: 'topic-55',
    slug: 'java-memory-model-and-runtime-data-areas',
    topicNumber: 55,
    title: 'Java Memory Model & Runtime Data Areas',
    part: 'Part 1: Java Core',
    sectionNumber: 14,
    sectionTitle: 'JVM Internals & Memory Architecture',
    versionBadge: 'Java 1.0+ / Formalized JSR-133',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Explore the internal memory layout of the JVM: Heap, Metaspace, Thread Stacks, PC Registers, and JMM happens-before rules.',
    prerequisites: [
      'Topic 02: JDK vs JRE vs JVM & Setup',
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 49: Synchronization & Memory Visibility'
    ],
    whatAndWhy: {
      definition: 'The JVM divides memory into thread-shared areas (Heap and Metaspace) and thread-private areas (Thread Stack, PC Register). The JMM defines formal happens-before ordering constraints governing shared memory visibility.',
      analogy: 'A corporate office where the central archive (Heap) and policy manuals (Metaspace) are shared by everyone, while each accountant works on a private desk notepad (Thread Stack).',
      whyItExists: 'Enables deterministic cross-thread memory visibility and prevents memory crashes through structured memory boundaries.'
    },
    syntaxBreakdown: {
      title: 'JVM Memory Inspection and Metrics',
      codeSnippet: `Runtime rt = Runtime.getRuntime();\nlong maxMemory = rt.maxMemory();\nlong used = rt.totalMemory() - rt.freeMemory();`,
      explanation: 'Queries the JVM runtime for max heap ceiling and current used heap memory.',
      tokens: [
        { token: 'maxMemory()', explanation: 'Maximum heap size the JVM will attempt to allocate' },
        { token: 'totalMemory()', explanation: 'Current heap memory allocated from the OS' },
        { token: 'freeMemory()', explanation: 'Unused heap memory within the current total allocation' }
      ]
    },
    examples: [
      {
        id: '55-1',
        title: 'JVM Runtime Memory & Stack Depth Inspection',
        type: 'basic',
        description: 'Inspecting CPU cores, heap metrics, Metaspace usage, and call stack depth.',
        filename: 'MemoryLayoutRuntimeDemo.java',
        code: `import java.lang.management.ManagementFactory;\nimport java.lang.management.MemoryMXBean;\n\npublic class MemoryLayoutRuntimeDemo {\n    public static void main(String[] args) {\n        System.out.println("=== JVM Memory Areas & Stack Inspection ===");\n        Runtime runtime = Runtime.getRuntime();\n        long maxMemory = runtime.maxMemory();\n        long totalMemory = runtime.totalMemory();\n        long freeMemory = runtime.freeMemory();\n        long usedMemory = totalMemory - freeMemory;\n\n        System.out.println("Available CPU Cores: " + runtime.availableProcessors());\n        System.out.printf("Max Heap Memory:     %,d bytes (%.1f MB)%n", maxMemory, maxMemory / (1024.0 * 1024.0));\n        System.out.printf("Total Allocated:     %,d bytes (%.1f MB)%n", totalMemory, totalMemory / (1024.0 * 1024.0));\n        System.out.printf("Used Heap Memory:    %,d bytes%n", usedMemory);\n\n        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();\n        System.out.println("Non-Heap (Metaspace): " + memoryBean.getNonHeapMemoryUsage().getUsed() / 1024 + " KB");\n\n        int measuredDepth = measureMaxStackDepth(0);\n        System.out.println("Safely Measured Stack Frame Depth: " + measuredDepth);\n    }\n\n    private static int measureMaxStackDepth(int depth) {\n        if (depth >= 500) return depth;\n        return measureMaxStackDepth(depth + 1);\n    }\n}`,
        output: `=== JVM Memory Areas & Stack Inspection ===\nAvailable CPU Cores: 12\nMax Heap Memory:     8,564,768,768 bytes (8168.0 MB)\nTotal Allocated:     12,582,912 bytes (12.0 MB)\nUsed Heap Memory:    1,467,584 bytes\nNon-Heap (Metaspace): 2125 KB\nSafely Measured Stack Frame Depth: 500`,
        stepByStep: [
          'Queries Runtime for CPU cores and heap metrics.',
          'Retrieves non-heap Metaspace usage from MemoryMXBean.',
          'Measures method stack frame call depth safely up to 500 frames.'
        ]
      },
      {
        id: '55-2',
        title: 'Transient vs Retained Heap Memory Profiler',
        type: 'realistic',
        description: 'Demonstrating transient allocations in Eden vs retained heap in Old Gen.',
        filename: 'ObjectAllocationProfilerApp.java',
        code: `import java.util.ArrayList;\nimport java.util.List;\n\npublic class ObjectAllocationProfilerApp {\n    record SensorPacket(long timestamp, int deviceId, double reading) {}\n\n    public static void main(String[] args) {\n        System.out.println("Starting Memory Allocation Profiler...");\n        Runtime runtime = Runtime.getRuntime();\n        long initialUsed = runtime.totalMemory() - runtime.freeMemory();\n\n        long sum = 0;\n        for (int i = 0; i < 50_000; i++) {\n            SensorPacket packet = new SensorPacket(System.currentTimeMillis(), i, i * 1.5);\n            sum += packet.deviceId();\n        }\n        System.out.println("Processed 50,000 transient objects. Checksum: " + sum);\n\n        List<SensorPacket> retainedLedger = new ArrayList<>(10_000);\n        for (int i = 0; i < 10_000; i++) {\n            retainedLedger.add(new SensorPacket(System.currentTimeMillis(), i, i * 2.0));\n        }\n\n        long finalUsed = runtime.totalMemory() - runtime.freeMemory();\n        long delta = finalUsed - initialUsed;\n        System.out.println("Retained Ledger Size: " + retainedLedger.size() + " items");\n        System.out.printf("Heap Memory Delta:    ~%,d bytes%n", Math.max(0, delta));\n        System.out.println("Allocation profiling completed successfully.");\n    }\n}`,
        output: `Starting Memory Allocation Profiler...\nProcessed 50,000 transient objects. Checksum: 1249975000\nRetained Ledger Size: 10000 items\nHeap Memory Delta:    ~2,053,920 bytes\nAllocation profiling completed successfully.`,
        stepByStep: [
          '50,000 transient sensor packets are allocated and immediately eligible for collection.',
          '10,000 retained sensor packets remain reachable in a list, driving retained heap delta.',
          'Demonstrates generational memory allocation dynamics.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Unbounded static collection memory leak',
        wrongCode: 'public static List<Data> cache = new ArrayList<>();',
        fixedCode: 'private Cache<String, Data> cache = Caffeine.newBuilder().maximumSize(1000).build();',
        cause: 'Static references are roots that live for the life of the JVM, preventing GC of accumulated elements.',
        solution: 'Use bounded caches with eviction policies or WeakReferences.'
      }
    ],
    bestPractices: {
      doList: [
        'Set initial (-Xms) and maximum (-Xmx) heap size equal in production to avoid dynamic resizing pauses.',
        'Profile heap allocations using JDK Flight Recorder (JFR) and JDK Mission Control (JMC).'
      ],
      dontList: [
        'Do not allocate giant arrays inside frequent tight loops.',
        'Do not create unbounded thread stack depths with recursion.'
      ],
      whenNotToUse: 'When off-heap native memory or foreign memory (Project Panama) is needed for zero-copy high performance.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 8 removed PermGen and replaced it with Metaspace. Java 21+ Project Lilliput object header optimizations.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'JVM Memory Areas Cheat Sheet',
      headers: ['Area', 'Scope', 'Contents', 'Exhaustion Error'],
      rows: [
        ['Heap', 'Shared', 'Objects, arrays', 'OutOfMemoryError: Java heap space'],
        ['Metaspace', 'Shared', 'Class definitions, bytecodes', 'OutOfMemoryError: Metaspace'],
        ['Thread Stack', 'Private', 'Frames, local primitives', 'StackOverflowError'],
        ['PC Register', 'Private', 'Instruction bytecode pointer', 'None']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Query Available Processors',
        prompt: 'Query and print the available CPU core count available to the JVM.',
        solution: 'int cores = Runtime.getRuntime().availableProcessors();',
        explanation: 'Informs thread pool sizing for CPU-bound tasks.'
      }
    ],
    officialSources: [
      {
        title: 'JVM Specification: Chapter 2 Structure of JVM',
        url: 'https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-56',
    slug: 'garbage-collection-algorithms-and-tuning',
    topicNumber: 56,
    title: 'Garbage Collection Algorithms & Tuning',
    part: 'Part 1: Java Core',
    sectionNumber: 14,
    sectionTitle: 'JVM Internals & Memory Architecture',
    versionBadge: 'Java 1.0+ / ZGC in Java 21 LTS',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master modern garbage collection algorithms: Generational hypothesis, G1 GC, ultra-low-latency ZGC, and GC logging.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 55: Java Memory Model & Runtime Data Areas'
    ],
    whatAndWhy: {
      definition: 'Garbage Collection is the automatic reclamation of heap memory occupied by unreachable objects, eliminating manual memory deallocation bugs such as memory leaks and dangling pointers.',
      analogy: 'Daily household trash pickup disposing of paper cups (Eden) while family furniture (Old Gen) stays for decades.',
      whyItExists: 'Guarantees memory safety and prevents dangling pointer bugs while modern collectors (ZGC) provide sub-millisecond pause times.'
    },
    syntaxBreakdown: {
      title: 'GC References and Modern Cleaners',
      codeSnippet: `Cleaner cleaner = Cleaner.create();\ncleaner.register(this, () -> releaseNative());\nWeakReference<Object> ref = new WeakReference<>(obj);`,
      explanation: 'Registers a modern resource cleaning callback and tracks object reachability via WeakReference.',
      tokens: [
        { token: 'Cleaner', explanation: 'Java 9+ modern replacement for deprecated finalize()' },
        { token: 'WeakReference', explanation: 'Allows object collection on next GC pass' },
        { token: 'System.gc()', explanation: 'Hints to the JVM to perform a collection pass' }
      ]
    },
    examples: [
      {
        id: '56-1',
        title: 'Weak References and Cleaner Mechanics',
        type: 'basic',
        description: 'Reclaiming weak references and executing Cleaner cleanup callbacks.',
        filename: 'GarbageCollectionDemo.java',
        code: `import java.lang.ref.Cleaner;\nimport java.lang.ref.WeakReference;\n\npublic class GarbageCollectionDemo {\n    private static final Cleaner CLEANER = Cleaner.create();\n    static class NativeResourceWrapper implements Runnable {\n        private final String resourceId;\n        NativeResourceWrapper(String resourceId) { this.resourceId = resourceId; }\n        @Override\n        public void run() {\n            System.out.println("  [Cleaner Callback] Reclaiming native handle for: " + resourceId);\n        }\n    }\n    static class ManagedResource {\n        private final Cleaner.Cleanable cleanable;\n        ManagedResource(String id) {\n            this.cleanable = CLEANER.register(this, new NativeResourceWrapper(id));\n        }\n    }\n    public static void main(String[] args) throws InterruptedException {\n        System.out.println("=== 1. WeakReference Mechanics ===");\n        Object strongObject = new String("Transient Cache Payload");\n        WeakReference<Object> weakRef = new WeakReference<>(strongObject);\n        System.out.println("WeakRef holds value: " + (weakRef.get() != null));\n        strongObject = null;\n        System.gc();\n        Thread.sleep(50);\n        System.out.println("WeakRef cleared after GC: " + (weakRef.get() == null));\n\n        System.out.println("\\n=== 2. java.lang.ref.Cleaner (Modern Finalization) ===");\n        allocateAndDiscard();\n        System.gc();\n        Thread.sleep(100);\n        System.out.println("Cleaner execution completed.");\n    }\n    private static void allocateAndDiscard() {\n        new ManagedResource("SOCKET-FD-4091");\n    }\n}`,
        output: `=== 1. WeakReference Mechanics ===\nWeakRef holds value: true\nWeakRef cleared after GC: true\n\n=== 2. java.lang.ref.Cleaner (Modern Finalization) ===\n  [Cleaner Callback] Reclaiming native handle for: SOCKET-FD-4091\nCleaner execution completed.`,
        stepByStep: [
          'Nulling strong reference leaves only WeakReference.',
          'System.gc() reclaims the unreachable String.',
          'Cleaner callback executes asynchronously to release native socket handle.'
        ]
      },
      {
        id: '56-2',
        title: 'Heap Pressure & GC Metric Analyzer',
        type: 'realistic',
        description: 'Tracking garbage collector activity and memory churning metrics.',
        filename: 'HeapPressureAnalyzerApp.java',
        code: `import java.lang.management.GarbageCollectorMXBean;\nimport java.lang.management.ManagementFactory;\nimport java.util.List;\n\npublic class HeapPressureAnalyzerApp {\n    public static void main(String[] args) {\n        System.out.println("Starting Heap Pressure & GC Metric Analyzer...");\n        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();\n        for (GarbageCollectorMXBean gc : gcBeans) {\n            System.out.printf("  Collector: %-25s | Collections: %d | Time: %dms%n",\n                    gc.getName(), gc.getCollectionCount(), gc.getCollectionTime());\n        }\n        long totalAllocated = 0;\n        for (int batch = 0; batch < 1000; batch++) {\n            byte[] transientBuffer = new byte[1024];\n            transientBuffer[0] = (byte) (batch % 127);\n            totalAllocated += transientBuffer.length;\n        }\n        System.out.println("Allocated & Discarded: " + (totalAllocated / 1024) + " KB transient chunks");\n        System.out.println("Garbage Collection Metrics Polled Successfully.");\n    }\n}`,
        output: `Starting Heap Pressure & GC Metric Analyzer...\n  Collector: G1 Young Generation       | Collections: 0 | Time: 0ms\n  Collector: G1 Concurrent GC          | Collections: 0 | Time: 0ms\n  Collector: G1 Old Generation         | Collections: 0 | Time: 0ms\nAllocated & Discarded: 1000 KB transient chunks\nGarbage Collection Metrics Polled Successfully.`,
        stepByStep: [
          'Queries active JVM garbage collector MXBeans.',
          'Churns transient 1 KB byte buffers in the Young Gen.',
          'Logs collection counts and pause duration statistics.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Calling System.gc() explicitly in production',
        wrongCode: 'System.gc();',
        fixedCode: '// Let JVM garbage collector heuristics manage passes automatically',
        cause: 'Forces Stop-The-World full GC across all threads, disrupting adaptive collector heuristics.',
        solution: 'Avoid explicit System.gc() calls; disable via -XX:+DisableExplicitGC if needed.'
      }
    ],
    bestPractices: {
      doList: [
        'Use ZGC (-XX:+UseZGC) for latency-critical applications requiring sub-millisecond pause times.',
        'Enable unified GC logging with -Xlog:gc* in production servers.'
      ],
      dontList: [
        'Do not override deprecated finalize().',
        'Do not rely on GC for closing OS resources; use try-with-resources.'
      ],
      whenNotToUse: 'For offline batch data processing where total execution time matters more than pauses, Parallel GC offers superior throughput.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 9 made G1 default. Java 21 introduced Generational ZGC. Java 18 deprecated finalize for removal.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'Garbage Collector Comparison Cheat Sheet',
      headers: ['Collector', 'Flag', 'Optimized For', 'Pause Characteristics'],
      rows: [
        ['G1 GC (Default)', '-XX:+UseG1GC', 'Balanced web services', '100-200ms predictable pauses'],
        ['ZGC (Generational)', '-XX:+UseZGC', 'Ultra-low latency', '< 1ms concurrent pauses'],
        ['Parallel GC', '-XX:+UseParallelGC', 'Maximum batch throughput', 'Seconds (Stop-The-World)'],
        ['Serial GC', '-XX:+UseSerialGC', 'Single-core / CLI tools', 'Tens of milliseconds']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Create Weak Reference Cache Entry',
        prompt: 'Wrap an expensive cached computation in a WeakReference.',
        solution: 'WeakReference<byte[]> cache = new WeakReference<>(new byte[1024]);',
        explanation: 'Allows GC to reclaim memory when strong references are gone.'
      }
    ],
    officialSources: [
      {
        title: 'HotSpot Garbage Collection Tuning Guide',
        url: 'https://docs.oracle.com/en/java/javase/21/gctuning/',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-57',
    slug: 'classloaders-and-jit-compilation',
    topicNumber: 57,
    title: 'ClassLoaders & JIT Compilation',
    part: 'Part 1: Java Core',
    sectionNumber: 14,
    sectionTitle: 'JVM Internals & Memory Architecture',
    versionBadge: 'Java 1.0+ / Enhanced Java 9 & 21',
    difficulty: 'Advanced',
    readingTime: '13 min read',
    shortDescription: 'Explore classloader delegation, bytecode verification, HotSpot C1 and C2 tiered JIT compilation, and dynamic code optimization.',
    prerequisites: [
      'Topic 02: JDK vs JRE vs JVM & Setup',
      'Topic 16: Classes, Objects & Memory Layout'
    ],
    whatAndWhy: {
      definition: 'ClassLoaders dynamically locate and load bytecode into JVM Metaspace following parent delegation. The JIT Compiler compiles frequently executed bytecode into optimized native CPU machine code on the fly.',
      analogy: 'An orchestra librarian placing sheet music on stands (ClassLoader) and a virtuoso soloist memorizing a repeated theme to play at top speed without reading notes (JIT).',
      whyItExists: 'Enables dynamic plugin loading, modular security sandboxing, and near-native execution performance.'
    },
    syntaxBreakdown: {
      title: 'ClassLoader Hierarchy Traversal',
      codeSnippet: `ClassLoader app = MyClass.class.getClassLoader();\nClassLoader platform = app.getParent();\nClassLoader bootstrap = platform.getParent(); // null`,
      explanation: 'Traverses the 3-tier classloader hierarchy up to native Bootstrap loader.',
      tokens: [
        { token: 'getClassLoader()', explanation: 'Returns the ClassLoader that loaded the class' },
        { token: 'getParent()', explanation: 'Returns parent ClassLoader in delegation hierarchy' },
        { token: 'findClass()', explanation: 'Method overridden in custom ClassLoaders to locate bytecodes' }
      ]
    },
    examples: [
      {
        id: '57-1',
        title: 'ClassLoader Hierarchy Inspection',
        type: 'basic',
        description: 'Inspecting AppClassLoader, PlatformClassLoader, and native Bootstrap loader.',
        filename: 'ClassLoaderHierarchyDemo.java',
        code: `public class ClassLoaderHierarchyDemo {\n    public static void main(String[] args) {\n        System.out.println("=== ClassLoader Delegation Hierarchy ===");\n        ClassLoader appLoader = ClassLoaderHierarchyDemo.class.getClassLoader();\n        System.out.println("1. Application ClassLoader: " + appLoader.getName() + " (" + appLoader.getClass().getSimpleName() + ")");\n\n        ClassLoader platformLoader = appLoader.getParent();\n        System.out.println("2. Platform ClassLoader:    " + platformLoader.getName() + " (" + platformLoader.getClass().getSimpleName() + ")");\n\n        ClassLoader bootstrapLoader = platformLoader.getParent();\n        System.out.println("3. Bootstrap ClassLoader:   " + bootstrapLoader + " (Native JVM Core)");\n\n        ClassLoader stringLoader = String.class.getClassLoader();\n        System.out.println("\\nString.class ClassLoader:   " + stringLoader + " (Bootstrap verified)");\n    }\n}`,
        output: `=== ClassLoader Delegation Hierarchy ===\n1. Application ClassLoader: app (AppClassLoader)\n2. Platform ClassLoader:    platform (PlatformClassLoader)\n3. Bootstrap ClassLoader:   null (Native JVM Core)\n\nString.class ClassLoader:   null (Bootstrap verified)`,
        stepByStep: [
          'AppClassLoader loads application classes.',
          'PlatformClassLoader is its parent, loading Java modules.',
          'Bootstrap loader is native C++ (represented as null).',
          'String.class shows null, verifying core bootstrap origin.'
        ]
      },
      {
        id: '57-2',
        title: 'Dynamic Isolated Plugin ClassLoader',
        type: 'realistic',
        description: 'Implementing custom classloader for plugin isolation and dynamic unloading.',
        filename: 'HotReloadPluginClassLoaderApp.java',
        code: `import java.io.ByteArrayOutputStream;\nimport java.io.InputStream;\n\npublic class HotReloadPluginClassLoaderApp {\n    static class IsolatedPluginClassLoader extends ClassLoader {\n        private final String pluginName;\n        public IsolatedPluginClassLoader(String pluginName, ClassLoader parent) {\n            super(parent);\n            this.pluginName = pluginName;\n        }\n        @Override\n        protected Class<?> findClass(String name) throws ClassNotFoundException {\n            String resourcePath = name.replace('.', '/') + ".class";\n            try (InputStream is = getResourceAsStream(resourcePath)) {\n                if (is == null) throw new ClassNotFoundException("Plugin resource not found: " + resourcePath);\n                ByteArrayOutputStream buffer = new ByteArrayOutputStream();\n                byte[] chunk = new byte[1024];\n                int bytesRead;\n                while ((bytesRead = is.read(chunk)) != -1) buffer.write(chunk, 0, bytesRead);\n                byte[] classBytes = buffer.toByteArray();\n                return defineClass(name, classBytes, 0, classBytes.length);\n            } catch (Exception e) {\n                throw new ClassNotFoundException("Failed to load plugin class: " + name, e);\n            }\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println("Starting Dynamic Plugin ClassLoader App...");\n        IsolatedPluginClassLoader pluginLoader1 = new IsolatedPluginClassLoader("Billing-v1", null);\n        IsolatedPluginClassLoader pluginLoader2 = new IsolatedPluginClassLoader("Billing-v2", null);\n        System.out.println("Plugin Loader 1 Parent: " + pluginLoader1.getParent());\n        System.out.println("Plugin Loader 2 Parent: " + pluginLoader2.getParent());\n        System.out.println("ClassLoader Isolation:  " + (pluginLoader1 != pluginLoader2));\n        System.out.println("Dynamic ClassLoader initialised successfully.");\n    }\n}`,
        output: `Starting Dynamic Plugin ClassLoader App...\nPlugin Loader 1 Parent: null\nPlugin Loader 2 Parent: null\nClassLoader Isolation:  true\nDynamic ClassLoader initialised successfully.`,
        stepByStep: [
          'Defines custom IsolatedPluginClassLoader overriding findClass().',
          'Instantiates two isolated loaders with null parent for sandboxing.',
          'Verifies independent isolation between plugin runtimes.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'ClassCastException across multiple ClassLoaders',
        wrongCode: 'Class<?> c1 = loader1.loadClass("User");\nClass<?> c2 = loader2.loadClass("User");\n// c1 == c2 evaluates to false',
        fixedCode: '// Ensure shared interface types are loaded by common parent ClassLoader',
        cause: 'The JVM identifies types by fully qualified name AND ClassLoader instance.',
        solution: 'Share interface definitions via common parent loader while isolating implementations.'
      }
    ],
    bestPractices: {
      doList: [
        'Adhere to parent-first delegation unless explicitly implementing plugin overrides.',
        'Use -XX:+PrintCompilation to inspect hot spot JIT optimization during tuning.'
      ],
      dontList: [
        'Do not write monstrous methods (>8KB) that exceed JIT inlining thresholds.',
        'Do not attempt to define classes inside java.* packages (SecurityException).'
      ],
      whenNotToUse: 'When standard classpath loading meets your needs, custom ClassLoaders introduce classloading complexity.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 8 enabled TieredCompilation by default. Java 9 replaced Extension loader with PlatformClassLoader.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'ClassLoaders and JIT Compilers Cheat Sheet',
      headers: ['Component', 'Role', 'Compilation Tier', 'Behavior'],
      rows: [
        ['Interpreter', 'Immediate execution', 'Tier 0', 'Interprets bytecode line-by-line'],
        ['C1 Compiler', 'Quick native translation', 'Tier 1-3', 'Client JIT with basic profiling'],
        ['C2 Compiler', 'High-performance JIT', 'Tier 4', 'Aggressive inlining, loop unrolling'],
        ['AppClassLoader', 'Classpath loading', 'N/A', 'Loads user classes from -cp']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Check Core Loader',
        prompt: 'Check the ClassLoader of java.lang.String.',
        solution: 'ClassLoader cl = String.class.getClassLoader(); // cl is null (Bootstrap)',
        explanation: 'The native Bootstrap ClassLoader is represented by null in Java.'
      }
    ],
    officialSources: [
      {
        title: 'JVM Specification: Chapter 5 Loading, Linking, and Initializing',
        url: 'https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-5.html',
        organization: 'Oracle'
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

const formattedTopics = jvmTopics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(',\n\n');

const replacement = formattedTopics + ',\n\n' + targetMarker;
content = content.replace(targetMarker, replacement);

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log('Successfully appended topics 55-57 into src/data/topics.ts!');
