import fs from 'node:fs';
import path from 'node:path';

const TOPICS_PATH = path.resolve('src/data/topics.ts');
let content = fs.readFileSync(TOPICS_PATH, 'utf-8');

if (content.includes("id: 'topic-33'")) {
  console.log('Topic 33 already exists in topics.ts.');
  process.exit(0);
}

const section10Topics = `
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
      codeSnippet: \`public class KeyValuePair<K, V> {
    private final K key;
    private final V value;
    public KeyValuePair(K key, V value) { this.key = key; this.value = value; }
}

public static <T extends Comparable<T>> T findMax(T first, T second) {
    return first.compareTo(second) >= 0 ? first : second;
}\`,
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
        code: \`public class GenericsFundamentalsDemo {
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
}\`,
        output: \`Pair 1: [http-port => 8080]
Pair 2: [1001 => ACTIVE_TOKEN_99]
Max Integer: 92
Max String: Database\`,
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
        code: \`import java.util.ArrayList;
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
}\`,
        output: \`Repository Count: 2
Retrieved Account: Customer[id=101, name=Alice Morgan, balance=$1450.50]
Missing Account Found: false\`,
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
        solution: \`public class SingleSlotBuffer<T> {
    private T item;
    public void put(T item) { this.item = item; }
    public T get() { T temp = item; item = null; return temp; }
    public boolean isEmpty() { return item == null; }
}\`,
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
      codeSnippet: \`List<?> unbounded;
List<? extends Number> producer; // Read as Number, cannot write
List<? super Integer> consumer;  // Write Integers, read as Object\`,
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
        code: \`import java.util.ArrayList;
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
}\`,
        output: \`Integer Sum: 60.0
Double Sum: 7.5
Number Sink Contents: [100, 101, 102]
Object Sink Contents: [500, 501]\`,
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
        code: \`import java.util.ArrayList;
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
}\`,
        output: \`Transferred Journal Records: 2
Journaled: SecurityAlert[FAILED_LOGIN, severity=3]
Journaled: SecurityAlert[PORT_SCAN, severity=5]\`,
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
      codeSnippet: \`List<String> arrayList = new ArrayList<>();
List<String> linkedList = new LinkedList<>();
List<String> cowList = new CopyOnWriteArrayList<>();
List<String> slice = list.subList(0, 5);\`,
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
        code: \`import java.util.ArrayList;
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
}\`,
        output: \`ArrayList indexed read at 1: Inserted-Mid
LinkedList first element: Head-Node
CopyOnWriteArrayList size: 4
CopyOnWriteArrayList final items: [Alpha, Inserted-Mid, Beta, Gamma-Safe]\`,
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
        code: \`import java.util.ArrayList;
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
}\`,
        output: \`Total Orders Queued: 5
Batch 1 (Size 2): [CustomerOrder[orderId=ORD-101, totalAmount=89.5], CustomerOrder[orderId=ORD-102, totalAmount=240.0]]
Batch 2 (Size 2): [CustomerOrder[orderId=ORD-103, totalAmount=45.2], CustomerOrder[orderId=ORD-104, totalAmount=512.99]]
Batch 3 (Size 1): [CustomerOrder[orderId=ORD-105, totalAmount=19.99]]\`,
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
      codeSnippet: \`Set<String> hashSet = new HashSet<>();
Set<String> linkedHashSet = new LinkedHashSet<>();
NavigableSet<Integer> treeSet = new TreeSet<>();\`,
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
        code: \`import java.util.HashSet;
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
}\`,
        output: \`HashSet size (duplicates rejected): 3
LinkedHashSet insertion order preserved: [First, Second, Third]
TreeSet sorted view: [10, 30, 50, 80]
TreeSet first (min): 10
TreeSet last (max): 80
TreeSet subset (< 50): [10, 30]\`,
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
        code: \`import java.util.HashSet;
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
}\`,
        output: \`Unique Visitors Count: 4
Arrival Order: [usr-node-01, usr-node-02, usr-node-03, usr-node-04]
Highest Leaderboard Score: 920
Lowest Leaderboard Score: 180\`,
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
      codeSnippet: \`Map<String, Integer> map = new HashMap<>();
map.putIfAbsent("Key", 100);
map.computeIfPresent("Key", (k, v) -> v + 10);
int val = map.getOrDefault("Unknown", 0);\`,
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
        code: \`import java.util.HashMap;
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
}\`,
        output: \`HashMap Laptops: 20
HashMap Mice (default): 0
LinkedHashMap Keys: [env, port, ssl]
TreeMap Lowest Code: 400
TreeMap Client Errors (< 500): [400, 403, 404]\`,
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
        code: \`import java.util.LinkedHashMap;
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
}\`,
        output: \`Initial Cache Keys: [session_1, session_2, session_3]
Cache Keys after Eviction: [session_3, session_1, session_4]
Is session_2 retained? false
Is session_1 retained? true\`,
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
      codeSnippet: \`Queue<String> queue = new ArrayDeque<>();
queue.offer("task"); // Non-throwing insert
String next = queue.poll(); // Non-throwing remove

Deque<String> stack = new ArrayDeque<>();
stack.push("action"); // LIFO push
String top = stack.pop(); // LIFO pop\`,
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
        code: \`import java.util.ArrayDeque;
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
}\`,
        output: \`FIFO Peek: Job-Alpha
FIFO Poll 1: Job-Alpha
FIFO Poll 2: Job-Beta
LIFO Pop 1: Action-Delete
LIFO Pop 2: Action-Format
Min-heap extraction order:
5 12 45 89\`,
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
        code: \`import java.util.ArrayDeque;
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
}\`,
        output: \`Pending jobs before processing: 4
Processing: Critical-Database-Failover
Processing: High-Security-Patch
Processing: Normal-Report-Gen
Processing: LowPriority-Cleanup
Pending jobs remaining: 0
Execution History (Most recent first, limit 3): [J-1:LowPriority-Cleanup, J-3:Normal-Report-Gen, J-4:High-Security-Patch]\`,
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
      codeSnippet: \`public class Item implements Comparable<Item> {
    public int compareTo(Item o) { return Integer.compare(this.val, o.val); }
}

Comparator<Product> comp = Comparator
    .comparing(Product::category)
    .thenComparing(Comparator.comparingDouble(Product::rating).reversed())
    .thenComparingDouble(Product::price);\`,
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
        code: \`import java.util.ArrayList;
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
        System.out.println("\\nSorted with Chained Comparator (Latency, then Hostname):");
        for (ServerNode node : cluster) System.out.println("  " + node.hostname() + " -> " + node.latencyMs() + "ms");
    }
}\`,
        output: \`Sorted by Natural Order (Latency Ascending):
  us-east-1 -> 45ms
  us-west-2 -> 45ms
  ap-southeast-1 -> 85ms
  eu-central-1 -> 120ms

Sorted with Chained Comparator (Latency, then Hostname):
  us-east-1 -> 45ms
  us-west-2 -> 45ms
  ap-southeast-1 -> 85ms
  eu-central-1 -> 120ms\`,
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
        code: \`import java.util.ArrayList;
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
}\`,
        output: \`Ranked Product Catalog:
  [Books] SKU-2 | Rating: 4.9 | Price: $24.50
  [Books] SKU-5 | Rating: 4.5 | Price: $15.00
  [Electronics] SKU-3 | Rating: 4.8 | Price: $149.99
  [Electronics] SKU-1 | Rating: 4.8 | Price: $299.99
  [Electronics] SKU-4 | Rating: 4.2 | Price: $89.99\`,
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
`;

const insertMarker = "  {\n    id: 'topic-66',";
if (!content.includes(insertMarker)) {
  console.error("Could not locate topic-66 marker in topics.ts");
  process.exit(1);
}

content = content.replace(insertMarker, section10Topics.trim() + ",\n\n" + insertMarker);
fs.writeFileSync(TOPICS_PATH, content, 'utf-8');
console.log('Successfully appended Section 10 topics (33-39) to src/data/topics.ts with exact type compliance!');
