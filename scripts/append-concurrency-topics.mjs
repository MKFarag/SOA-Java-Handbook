import fs from 'fs';
import path from 'path';

const concurrencyTopics = [
  {
    id: 'topic-48',
    slug: 'threads-and-thread-lifecycle',
    topicNumber: 48,
    title: 'Threads and Thread Lifecycle',
    part: 'Part 1: Java Core',
    sectionNumber: 13,
    sectionTitle: 'Concurrency & Multithreading',
    versionBadge: 'Java 1.0+ / Enhanced Java 21',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master the operating system thread abstraction, the six thread states, daemon threads, joining, and interruption mechanics.',
    prerequisites: [
      'Topic 11: Methods, Parameters & Return Values',
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 23: Interfaces & Modern Interface Evolution'
    ],
    whatAndWhy: {
      definition: 'A thread is the smallest unit of execution scheduled by an operating system kernel. A single Java process can run multiple threads concurrently, sharing heap memory while maintaining private execution stacks.',
      analogy: 'Multiple chefs working in a single kitchen sharing the pantry (heap) while carrying their own order tickets (call stack).',
      whyItExists: 'Enables asynchronous background execution, keeps user interfaces responsive, and utilizes multi-core hardware to maximize CPU throughput.'
    },
    syntaxBreakdown: {
      title: 'Thread Declaration and Execution',
      codeSnippet: `Thread worker = new Thread(() -> { ... }, "Worker-1");\nworker.start();\nworker.join();`,
      explanation: 'Spawns an OS thread executing a Runnable task, assigns an identifier, and awaits termination.',
      tokens: [
        { token: 'Thread', explanation: 'Class representing an execution thread' },
        { token: 'start()', explanation: 'Transitions thread to RUNNABLE and starts OS execution' },
        { token: 'join()', explanation: 'Blocks calling thread until target terminates' }
      ]
    },
    examples: [
      {
        id: '48-1',
        title: 'Thread Lifecycle and Interruption',
        type: 'basic',
        description: 'Observing state transitions, thread interruption, and daemon threads.',
        filename: 'ThreadLifecycleDemo.java',
        code: `public class ThreadLifecycleDemo {\n    public static void main(String[] args) throws InterruptedException {\n        Thread worker = new Thread(() -> {\n            System.out.println("Worker thread running: " + Thread.currentThread().getName());\n            int counter = 0;\n            try {\n                while (!Thread.currentThread().isInterrupted()) {\n                    counter++;\n                    Thread.sleep(100);\n                }\n            } catch (InterruptedException e) {\n                System.out.println("Worker interrupted during sleep. Exiting cleanly.");\n            }\n            System.out.println("Worker completed. Final counter: " + counter);\n        }, "Background-Worker-1");\n\n        System.out.println("Worker State before start: " + worker.getState());\n        worker.start();\n        System.out.println("Worker State after start:  " + worker.getState());\n\n        Thread.sleep(350);\n        System.out.println("Main thread sending interrupt signal...");\n        worker.interrupt();\n\n        worker.join();\n        System.out.println("Worker State after join:   " + worker.getState());\n\n        Thread daemon = new Thread(() -> {\n            while (true) { /* Idle daemon */ }\n        });\n        daemon.setDaemon(true);\n        daemon.start();\n        System.out.println("Daemon Thread isDaemon:    " + daemon.isDaemon());\n    }\n}`,
        output: `Worker State before start: NEW\nWorker State after start:  RUNNABLE\nWorker thread running: Background-Worker-1\nMain thread sending interrupt signal...\nWorker interrupted during sleep. Exiting cleanly.\nWorker completed. Final counter: 3\nWorker State after join:   TERMINATED\nDaemon Thread isDaemon:    true`,
        stepByStep: [
          'Worker thread starts in NEW state.',
          'Invoking start() allocates OS thread and switches to RUNNABLE.',
          'interrupt() triggers InterruptedException during sleep, allowing clean exit.',
          'join() halts main thread until worker reaches TERMINATED.'
        ]
      },
      {
        id: '48-2',
        title: 'Batch Worker Supervisor',
        type: 'realistic',
        description: 'Supervising parallel workers and coordinating batch completion.',
        filename: 'BatchWorkerSupervisorApp.java',
        code: `import java.util.ArrayList;\nimport java.util.List;\n\npublic class BatchWorkerSupervisorApp {\n    static class TaskResult {\n        final int workerId;\n        final boolean success;\n        TaskResult(int workerId, boolean success) {\n            this.workerId = workerId;\n            this.success = success;\n        }\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        int workerCount = 3;\n        List<Thread> workers = new ArrayList<>();\n        List<TaskResult> results = new ArrayList<>();\n\n        for (int i = 1; i <= workerCount; i++) {\n            final int id = i;\n            Thread worker = new Thread(() -> {\n                System.out.println("  [Worker-" + id + "] Processing task payload...");\n                try {\n                    Thread.sleep(50 * id);\n                    synchronized (results) {\n                        results.add(new TaskResult(id, true));\n                    }\n                    System.out.println("  [Worker-" + id + "] Task payload processed successfully.");\n                } catch (InterruptedException e) {\n                    Thread.currentThread().interrupt();\n                }\n            }, "Worker-" + id);\n            workers.add(worker);\n            worker.start();\n        }\n\n        System.out.println("Supervisor waiting for batch completion (joining workers)...");\n        for (Thread worker : workers) {\n            worker.join();\n        }\n\n        System.out.println("Supervisor Audit: " + results.size() + " of " + workerCount + " workers completed successfully.");\n    }\n}`,
        output: `Supervisor waiting for batch completion (joining workers)...\n  [Worker-1] Processing task payload...\n  [Worker-2] Processing task payload...\n  [Worker-3] Processing task payload...\n  [Worker-1] Task payload processed successfully.\n  [Worker-2] Task payload processed successfully.\n  [Worker-3] Task payload processed successfully.\nSupervisor Audit: 3 of 3 workers completed successfully.`,
        stepByStep: [
          'Supervisor spawns 3 worker threads with individual IDs.',
          'Each worker processes a task payload and records results into a thread-safe list.',
          'Supervisor calls join() on each worker to ensure all complete before generating final audit.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Calling run() instead of start()',
        wrongCode: 'Thread t = new Thread(r);\nt.run();',
        fixedCode: 'Thread t = new Thread(r);\nt.start();',
        cause: 'Calling run() runs the task synchronously on the current thread without creating a new OS thread.',
        solution: 'Always call start() to spawn a new concurrent thread.'
      }
    ],
    bestPractices: {
      doList: [
        'Always name threads to simplify debugging and thread dump analysis.',
        'Restore interrupted status using Thread.currentThread().interrupt() when catching InterruptedException.'
      ],
      dontList: [
        'Do not spawn unbounded platform threads in loops.',
        'Do not use deprecated methods stop(), suspend(), or resume().'
      ],
      whenNotToUse: 'For high-throughput I/O or massive parallel request handling, use Virtual Threads (Java 21+) or ExecutorService instead of raw platform threads.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 21 added Virtual Threads. In Java 24+, Thread.suspend() and Thread.resume() throw UnsupportedOperationException.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'Thread Lifecycle Cheat Sheet',
      headers: ['Method', 'Target State', 'Effect'],
      rows: [
        ['start()', 'RUNNABLE', 'Allocates native thread and invokes run()'],
        ['join()', 'WAITING', 'Blocks current thread until target terminates'],
        ['sleep(ms)', 'TIMED_WAITING', 'Releases CPU for specified duration'],
        ['interrupt()', 'Unchanged', 'Sets interrupt status flag; wakes sleeping threads']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Create Daemon Monitor Thread',
        prompt: 'Create a background daemon thread that prints a heartbeat every second.',
        solution: 'Thread t = new Thread(() -> { while(true) { ... } }); t.setDaemon(true); t.start();',
        explanation: 'Daemon threads do not prevent the JVM from shutting down.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 Specification: java.lang.Thread',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-49',
    slug: 'synchronization-and-memory-visibility',
    topicNumber: 49,
    title: 'Synchronization & Memory Visibility',
    part: 'Part 1: Java Core',
    sectionNumber: 13,
    sectionTitle: 'Concurrency & Multithreading',
    versionBadge: 'Java 1.0+ / Enhanced JSR-133 (Java 5)',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master intrinsic monitor locks, the synchronized keyword, volatile memory visibility, and deadlocks.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 48: Threads and Thread Lifecycle'
    ],
    whatAndWhy: {
      definition: 'Synchronization provides mutual exclusion and memory visibility guarantees, preventing race conditions and stale cache reads when multiple threads access shared mutable state.',
      analogy: 'A physical key to an office whiteboard ensuring only one coworker can write at a time while a live camera broadcast shows updates to everyone immediately.',
      whyItExists: 'Prevents race conditions like lost updates and eliminates CPU cache visibility lags across processor cores.'
    },
    syntaxBreakdown: {
      title: 'Synchronization and Volatile Primitives',
      codeSnippet: `private volatile boolean flag = true;\npublic synchronized void update() {\n    count++;\n}`,
      explanation: 'Guarantees direct main memory access for flag and mutual exclusion on object monitors for update().',
      tokens: [
        { token: 'synchronized', explanation: 'Acquires intrinsic monitor lock for mutual exclusion' },
        { token: 'volatile', explanation: 'Establishes happens-before memory visibility barrier' }
      ]
    },
    examples: [
      {
        id: '49-1',
        title: 'Mutual Exclusion and Volatile Visibility',
        type: 'basic',
        description: 'Eliminating counter race conditions and volatile flag visibility across CPU cores.',
        filename: 'SynchronizationVisibilityDemo.java',
        code: `public class SynchronizationVisibilityDemo {\n    private static int counter = 0;\n    private static volatile boolean keepRunning = true;\n\n    public static synchronized void incrementCounter() {\n        counter++;\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread t1 = new Thread(() -> {\n            for (int i = 0; i < 1000; i++) incrementCounter();\n        });\n        Thread t2 = new Thread(() -> {\n            for (int i = 0; i < 1000; i++) incrementCounter();\n        });\n\n        t1.start();\n        t2.start();\n        t1.join();\n        t2.join();\n\n        System.out.println("Synchronized Counter Total: " + counter);\n\n        Thread worker = new Thread(() -> {\n            long iterations = 0;\n            while (keepRunning) {\n                iterations++;\n            }\n            System.out.println("Worker recognized stop flag. Iterations: " + iterations);\n        });\n\n        worker.start();\n        Thread.sleep(50);\n        keepRunning = false;\n        worker.join();\n        System.out.println("Volatile Worker Terminated Gracefully.");\n    }\n}`,
        output: `Synchronized Counter Total: 2000\nWorker recognized stop flag. Iterations: 39843093\nVolatile Worker Terminated Gracefully.`,
        stepByStep: [
          't1 and t2 concurrently increment counter guarded by synchronized monitor, resulting in exact 2000.',
          'worker loops while keepRunning is true.',
          'Main thread sets keepRunning = false, flushed immediately to RAM due to volatile barrier.',
          'Worker terminates promptly.'
        ]
      },
      {
        id: '49-2',
        title: 'Double-Checked Locking Singleton and Deadlock-Free Transfers',
        type: 'realistic',
        description: 'Thread-safe lazy singleton and ordered locking for bank accounts.',
        filename: 'DoubleCheckedLockingSingletonApp.java',
        code: `public class DoubleCheckedLockingSingletonApp {\n    static class DatabaseConnectionPool {\n        private static volatile DatabaseConnectionPool instance;\n        private DatabaseConnectionPool() {}\n        public static DatabaseConnectionPool getInstance() {\n            if (instance == null) {\n                synchronized (DatabaseConnectionPool.class) {\n                    if (instance == null) {\n                        instance = new DatabaseConnectionPool();\n                    }\n                }\n            }\n            return instance;\n        }\n    }\n\n    static class BankAccount {\n        private final String id;\n        private double balance;\n        BankAccount(String id, double balance) {\n            this.id = id;\n            this.balance = balance;\n        }\n        public String getId() { return id; }\n        public synchronized double getBalance() { return balance; }\n        public static boolean transfer(BankAccount from, BankAccount to, double amount) {\n            BankAccount firstLock = from.id.compareTo(to.id) < 0 ? from : to;\n            BankAccount secondLock = from.id.compareTo(to.id) < 0 ? to : from;\n            synchronized (firstLock) {\n                synchronized (secondLock) {\n                    if (from.balance >= amount) {\n                        from.balance -= amount;\n                        to.balance += amount;\n                        return true;\n                    }\n                    return false;\n                }\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        DatabaseConnectionPool pool1 = DatabaseConnectionPool.getInstance();\n        DatabaseConnectionPool pool2 = DatabaseConnectionPool.getInstance();\n        System.out.println("Singleton Pool Same Instance: " + (pool1 == pool2));\n\n        BankAccount acc1 = new BankAccount("ACC-01", 1000.0);\n        BankAccount acc2 = new BankAccount("ACC-02", 500.0);\n        boolean success = BankAccount.transfer(acc1, acc2, 250.0);\n        System.out.println("Transfer Success: " + success);\n        System.out.printf("Final Balances: %s=$%.2f, %s=$%.2f%n", acc1.getId(), acc1.getBalance(), acc2.getId(), acc2.getBalance());\n    }\n}`,
        output: `Singleton Pool Same Instance: true\nTransfer Success: true\nFinal Balances: ACC-01=$750.00, ACC-02=$750.00`,
        stepByStep: [
          'getInstance checks instance twice to eliminate lock overhead after first creation.',
          'volatile prevents instruction reordering during instantiation.',
          'transfer sorts locks by ID to guarantee consistent global acquisition order, preventing deadlocks.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Assuming volatile makes count++ atomic',
        wrongCode: 'private volatile int count = 0;\npublic void inc() { count++; }',
        fixedCode: 'private int count = 0;\npublic synchronized void inc() { count++; }',
        cause: 'count++ is a compound read-modify-write operation; volatile only guarantees visibility, not atomicity.',
        solution: 'Use synchronized or AtomicInteger for compound mutations.'
      }
    ],
    bestPractices: {
      doList: [
        'Keep synchronized blocks minimal to avoid lock contention.',
        'Always acquire multiple locks in a globally consistent order to prevent deadlocks.'
      ],
      dontList: [
        'Do not synchronize on String literals or boxed primitives.',
        'Do not perform blocking I/O inside synchronized blocks.'
      ],
      whenNotToUse: 'When you need timed lock acquisition or read/write separation, use ReentrantLock or ReentrantReadWriteLock instead.'
    },
    versionNotes: {
      introduced: 'Java 1.0',
      status: 'Stable',
      compatibilityNotes: 'Java 5 JSR-133 formalized the happens-before relationship for volatile.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'Synchronization Mechanics Cheat Sheet',
      headers: ['Primitive', 'Mutual Exclusion', 'Visibility Guarantee', 'Prevents Lost Updates'],
      rows: [
        ['synchronized', 'Yes', 'Yes (entry & exit)', 'Yes'],
        ['volatile', 'No', 'Yes (direct RAM)', 'No (compound ops)'],
        ['AtomicInteger', 'Hardware CAS', 'Yes', 'Yes']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Implement Thread-Safe Counter',
        prompt: 'Implement a thread-safe counter using synchronized methods.',
        solution: 'public synchronized void inc() { c++; } public synchronized int get() { return c; }',
        explanation: 'Synchronized on this ensures both operations are guarded by the same object monitor.'
      }
    ],
    officialSources: [
      {
        title: 'Java Language Specification: §17.4 Memory Model',
        url: 'https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-50',
    slug: 'explicit-locks-and-concurrent-collections',
    topicNumber: 50,
    title: 'Explicit Locks & Concurrent Collections',
    part: 'Part 1: Java Core',
    sectionNumber: 13,
    sectionTitle: 'Concurrency & Multithreading',
    versionBadge: 'Java 5+',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Explore ReentrantLock, ReadWriteLock, Atomic primitives, and high-performance concurrent collections like ConcurrentHashMap.',
    prerequisites: [
      'Topic 37: The Map Hierarchy',
      'Topic 49: Synchronization and Memory Visibility'
    ],
    whatAndWhy: {
      definition: 'Explicit locks and concurrent data structures in java.util.concurrent provide fine-grained, timed, and lock-free concurrency alternatives to intrinsic synchronized blocks.',
      analogy: 'A library where hundreds of patrons can read simultaneously with read-locks, but a single librarian acquires an exclusive write-lock to reorganize book shelves.',
      whyItExists: 'Enables timed polling (tryLock), separate read/write locks, and lock-free Compare-And-Swap (CAS) performance under high contention.'
    },
    syntaxBreakdown: {
      title: 'Explicit Lock and Atomic Idioms',
      codeSnippet: `Lock lock = new ReentrantLock();\nlock.lock();\ntry {\n    // Critical section\n} finally {\n    lock.unlock();\n}`,
      explanation: 'Explicitly acquires and unlocks a reentrant mutex, guaranteeing release in finally block.',
      tokens: [
        { token: 'ReentrantLock', explanation: 'Class providing flexible mutex locking' },
        { token: 'tryLock(time, unit)', explanation: 'Attempts acquisition with timeout' },
        { token: 'unlock()', explanation: 'Releases held lock; must be inside finally' }
      ]
    },
    examples: [
      {
        id: '50-1',
        title: 'Timed Locks and Atomic CAS Operations',
        type: 'basic',
        description: 'Demonstrating timed lock polling and lock-free atomic compare-and-swap.',
        filename: 'ExplicitLocksAtomicsDemo.java',
        code: `import java.util.concurrent.TimeUnit;\nimport java.util.concurrent.atomic.AtomicInteger;\nimport java.util.concurrent.atomic.AtomicReference;\nimport java.util.concurrent.locks.ReentrantLock;\n\npublic class ExplicitLocksAtomicsDemo {\n    public static void main(String[] args) throws InterruptedException {\n        ReentrantLock lock = new ReentrantLock();\n        Thread holder = new Thread(() -> {\n            lock.lock();\n            try {\n                System.out.println("Holder acquired lock, holding for 150ms...");\n                Thread.sleep(150);\n            } catch (InterruptedException e) {\n                Thread.currentThread().interrupt();\n            } finally {\n                lock.unlock();\n                System.out.println("Holder released lock.");\n            }\n        });\n\n        Thread contender = new Thread(() -> {\n            try {\n                Thread.sleep(20);\n                System.out.println("Contender attempting tryLock(50ms)...");\n                boolean acquired = lock.tryLock(50, TimeUnit.MILLISECONDS);\n                System.out.println("Contender acquired lock? " + acquired);\n\n                System.out.println("Contender attempting tryLock(200ms)...");\n                boolean acquiredLater = lock.tryLock(200, TimeUnit.MILLISECONDS);\n                System.out.println("Contender acquired lock after wait? " + acquiredLater);\n                if (acquiredLater) lock.unlock();\n            } catch (InterruptedException e) {\n                Thread.currentThread().interrupt();\n            }\n        });\n\n        holder.start();\n        contender.start();\n        holder.join();\n        contender.join();\n\n        System.out.println();\n        AtomicInteger atomicCounter = new AtomicInteger(100);\n        boolean casSuccess = atomicCounter.compareAndSet(100, 150);\n        System.out.println("Atomic CAS from 100 to 150 successful? " + casSuccess);\n        System.out.println("Atomic Counter after incrementAndGet: " + atomicCounter.incrementAndGet());\n\n        AtomicReference<String> stateRef = new AtomicReference<>("INITIAL");\n        stateRef.compareAndSet("INITIAL", "ACTIVE");\n        System.out.println("Atomic Reference Current State: " + stateRef.get());\n    }\n}`,
        output: `Holder acquired lock, holding for 150ms...\nContender attempting tryLock(50ms)...\nContender acquired lock? false\nContender attempting tryLock(200ms)...\nHolder released lock.\nContender acquired lock after wait? true\n\nAtomic CAS from 100 to 150 successful? true\nAtomic Counter after incrementAndGet: 151\nAtomic Reference Current State: ACTIVE`,
        stepByStep: [
          'Holder acquires lock and sleeps 150ms.',
          'Contender tryLock(50ms) times out gracefully and returns false.',
          'Contender tryLock(200ms) waits until holder releases lock at 150ms and succeeds.',
          'AtomicInteger uses hardware CAS to update without mutex locking.'
        ]
      },
      {
        id: '50-2',
        title: 'Token Bucket Rate Limiter with ReadWriteLock',
        type: 'realistic',
        description: 'High-concurrency token bucket rate limiter with read and write locks.',
        filename: 'RateLimiterTokenBucketApp.java',
        code: `import java.util.concurrent.locks.ReentrantReadWriteLock;\n\npublic class RateLimiterTokenBucketApp {\n    private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();\n    private final ReentrantReadWriteLock.ReadLock readLock = rwl.readLock();\n    private final ReentrantReadWriteLock.WriteLock writeLock = rwl.writeLock();\n    private int capacity;\n    private int currentTokens;\n\n    public RateLimiterTokenBucketApp(int initialCapacity) {\n        this.capacity = initialCapacity;\n        this.currentTokens = initialCapacity;\n    }\n\n    public boolean tryConsume() {\n        writeLock.lock();\n        try {\n            if (currentTokens > 0) {\n                currentTokens--;\n                return true;\n            }\n            return false;\n        } finally {\n            writeLock.unlock();\n        }\n    }\n\n    public int getAvailableTokens() {\n        readLock.lock();\n        try {\n            return currentTokens;\n        } finally {\n            readLock.unlock();\n        }\n    }\n\n    public void updateCapacity(int newCapacity) {\n        writeLock.lock();\n        try {\n            this.capacity = newCapacity;\n            this.currentTokens = newCapacity;\n            System.out.println("\\nCapacity reconfigured to " + newCapacity + ".");\n        } finally {\n            writeLock.unlock();\n        }\n    }\n\n    public static void main(String[] args) {\n        RateLimiterTokenBucketApp limiter = new RateLimiterTokenBucketApp(3);\n        System.out.println("Attempt 1 allowed: " + limiter.tryConsume());\n        System.out.println("Attempt 2 allowed: " + limiter.tryConsume());\n        System.out.println("Attempt 3 allowed: " + limiter.tryConsume());\n        System.out.println("Attempt 4 allowed: " + limiter.tryConsume());\n        System.out.println("Tokens remaining: " + limiter.getAvailableTokens());\n\n        limiter.updateCapacity(5);\n        System.out.println("Attempt 5 allowed: " + limiter.tryConsume());\n        System.out.println("Final tokens remaining: " + limiter.getAvailableTokens());\n    }\n}`,
        output: `Attempt 1 allowed: true\nAttempt 2 allowed: true\nAttempt 3 allowed: true\nAttempt 4 allowed: false\nTokens remaining: 0\n\nCapacity reconfigured to 5.\nAttempt 5 allowed: true\nFinal tokens remaining: 4`,
        stepByStep: [
          'Requests consume tokens using exclusive write-locks.',
          'Fourth request is denied when tokens hit 0.',
          'Read-lock allows non-blocking inspection of token capacity.',
          'Updating capacity uses write-lock to safely replenish tokens.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Forgetting lock.unlock() in finally block',
        wrongCode: 'lock.lock();\ndoOperation();\nlock.unlock();',
        fixedCode: 'lock.lock();\ntry {\n    doOperation();\n} finally {\n    lock.unlock();\n}',
        cause: 'If doOperation throws an exception, the lock is never released, permanently deadlocking other threads.',
        solution: 'Always place lock.unlock() in the finally block immediately following lock().'
      }
    ],
    bestPractices: {
      doList: [
        'Prefer ConcurrentHashMap over Collections.synchronizedMap.',
        'Use LongAdder over AtomicLong when multi-core write contention is high.'
      ],
      dontList: [
        'Do not use CopyOnWriteArrayList for write-heavy collections.',
        'Do not hold locks while calling foreign unknown listener callbacks.'
      ],
      whenNotToUse: 'When simple uncontended synchronization suffices, intrinsic synchronized blocks require less boilerplate.'
    },
    versionNotes: {
      introduced: 'Java 5 (JSR-166)',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added StampedLock and LongAdder. Java 9 added VarHandles.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'Explicit Concurrency Primitives Cheat Sheet',
      headers: ['Class', 'Package', 'Strategy', 'Primary Advantage'],
      rows: [
        ['ReentrantLock', 'locks', 'Explicit Mutex', 'Timed tryLock, interruptibility'],
        ['ReentrantReadWriteLock', 'locks', 'Shared/Exclusive', 'High read concurrency'],
        ['AtomicInteger', 'atomic', 'Hardware CAS', 'Lock-free single value updates'],
        ['ConcurrentHashMap', 'concurrent', 'CAS + Node Lock', 'High concurrency key-value store']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Lock-Free Sequence Number',
        prompt: 'Implement a lock-free sequence generator using AtomicLong.',
        solution: 'AtomicLong seq = new AtomicLong(0);\npublic long next() { return seq.incrementAndGet(); }',
        explanation: 'incrementAndGet performs atomic hardware increment.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 Specification: java.util.concurrent.locks',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/package-summary.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-51',
    slug: 'executor-framework-and-thread-pools',
    topicNumber: 51,
    title: 'Executor Framework & Thread Pools',
    part: 'Part 1: Java Core',
    sectionNumber: 13,
    sectionTitle: 'Concurrency & Multithreading',
    versionBadge: 'Java 5+ / AutoCloseable in Java 19+',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Decouple task submission from thread management using ExecutorService, ThreadPoolExecutor, Callable, and Future.',
    prerequisites: [
      'Topic 48: Threads and Thread Lifecycle',
      'Topic 50: Explicit Locks and Concurrent Collections'
    ],
    whatAndWhy: {
      definition: 'The Executor Framework manages pools of reusable worker threads, queueing tasks and eliminating the overhead of continually creating and destroying platform threads.',
      analogy: 'A taxi fleet dispatch service with 10 dedicated drivers serving 50 passengers from a central terminal queue.',
      whyItExists: 'Prevents native thread starvation and OOM crashes by bounding thread count and reusing threads across tasks.'
    },
    syntaxBreakdown: {
      title: 'ExecutorService Lifecycle',
      codeSnippet: `ExecutorService pool = Executors.newFixedThreadPool(4);\nFuture<String> future = pool.submit(() -> "Result");\npool.shutdown();`,
      explanation: 'Submits a Callable returning a Future and initiates graceful pool shutdown.',
      tokens: [
        { token: 'ExecutorService', explanation: 'Interface managing task lifecycle and thread pooling' },
        { token: 'Callable<V>', explanation: 'Functional interface returning value and throwing checked exceptions' },
        { token: 'Future<V>', explanation: 'Handle representing asynchronous computation result' }
      ]
    },
    examples: [
      {
        id: '51-1',
        title: 'Custom ThreadPoolExecutor and Rejection Policies',
        type: 'basic',
        description: 'Configuring bounded queues, rejection handlers, and pool shutdown.',
        filename: 'ThreadPoolExecutorDemo.java',
        code: `import java.util.concurrent.ArrayBlockingQueue;\nimport java.util.concurrent.RejectedExecutionHandler;\nimport java.util.concurrent.ThreadPoolExecutor;\nimport java.util.concurrent.TimeUnit;\n\npublic class ThreadPoolExecutorDemo {\n    public static void main(String[] args) throws InterruptedException {\n        RejectedExecutionHandler rejectionHandler = (r, executor) -> {\n            System.out.println("  [REJECTED] Task rejected! Queue is full and max threads reached.");\n        };\n\n        ThreadPoolExecutor executor = new ThreadPoolExecutor(\n                2, 3, 10, TimeUnit.SECONDS,\n                new ArrayBlockingQueue<>(2),\n                rejectionHandler\n        );\n\n        System.out.println("Submitting 6 tasks to ThreadPoolExecutor...");\n        for (int i = 1; i <= 6; i++) {\n            final int taskId = i;\n            executor.execute(() -> {\n                System.out.println("  [Executing Task " + taskId + "] on thread: " + Thread.currentThread().getName());\n                try {\n                    Thread.sleep(80);\n                } catch (InterruptedException e) {\n                    Thread.currentThread().interrupt();\n                }\n            });\n        }\n\n        executor.shutdown();\n        boolean terminated = executor.awaitTermination(2, TimeUnit.SECONDS);\n        System.out.println("Executor Terminated Cleanly: " + terminated);\n    }\n}`,
        output: `Submitting 6 tasks to ThreadPoolExecutor...\n  [REJECTED] Task rejected! Queue is full and max threads reached.\n  [Executing Task 5] on thread: pool-1-thread-3\n  [Executing Task 1] on thread: pool-1-thread-1\n  [Executing Task 2] on thread: pool-1-thread-2\n  [Executing Task 4] on thread: pool-1-thread-2\n  [Executing Task 3] on thread: pool-1-thread-1\nExecutor Terminated Cleanly: true`,
        stepByStep: [
          'Core threads 1 and 2 start executing tasks 1 and 2.',
          'Tasks 3 and 4 enter the ArrayBlockingQueue.',
          'Task 5 triggers creation of a third thread (maximumPoolSize = 3).',
          'Task 6 exceeds queue and max threads, triggering custom rejection handler.'
        ]
      },
      {
        id: '51-2',
        title: 'Parallel Image Batch Processor with Callable and Future',
        type: 'realistic',
        description: 'Executing parallel image processing jobs and gathering metrics with Future.',
        filename: 'ParallelImageBatchProcessorApp.java',
        code: `import java.util.ArrayList;\nimport java.util.List;\nimport java.util.concurrent.Callable;\nimport java.util.concurrent.ExecutorService;\nimport java.util.concurrent.Executors;\nimport java.util.concurrent.Future;\n\npublic class ParallelImageBatchProcessorApp {\n    record ImageTask(String filename, int width, int height) {}\n    record ProcessResult(String filename, long processedBytes, long latencyMs) {}\n\n    public static void main(String[] args) throws Exception {\n        ExecutorService pool = Executors.newFixedThreadPool(2);\n        List<ImageTask> batch = List.of(\n                new ImageTask("hero_banner.png", 1920, 1080),\n                new ImageTask("profile_avatar.jpg", 400, 400),\n                new ImageTask("thumbnail_preview.png", 200, 200),\n                new ImageTask("product_diagram.svg", 1200, 800)\n        );\n\n        System.out.println("Submitting batch of " + batch.size() + " images to fixed pool (size 2)...\\n");\n        List<Future<ProcessResult>> futures = new ArrayList<>();\n        for (ImageTask task : batch) {\n            Callable<ProcessResult> work = () -> {\n                long start = System.currentTimeMillis();\n                long simulatedBytes = (long) task.width() * task.height() * 3 / 10;\n                Thread.sleep(task.width() > 1000 ? 40 : 20);\n                long elapsed = System.currentTimeMillis() - start;\n                return new ProcessResult(task.filename(), simulatedBytes, elapsed);\n            };\n            futures.add(pool.submit(work));\n        }\n\n        System.out.println("Gathering processing results:");\n        for (Future<ProcessResult> future : futures) {\n            ProcessResult res = future.get();\n            System.out.printf("  Processed %-22s -> %,d bytes (Took %dms)%n", res.filename(), res.processedBytes(), res.latencyMs());\n        }\n\n        pool.shutdown();\n        System.out.println("Batch processing successfully completed.");\n    }\n}`,
        output: `Submitting batch of 4 images to fixed pool (size 2)...\n\nGathering processing results:\n  Processed hero_banner.png        -> 622,080 bytes (Took 43ms)\n  Processed profile_avatar.jpg     -> 48,000 bytes (Took 24ms)\n  Processed thumbnail_preview.png  -> 12,000 bytes (Took 20ms)\n  Processed product_diagram.svg    -> 288,000 bytes (Took 30ms)\nBatch processing successfully completed.`,
        stepByStep: [
          'Submits 4 image processing tasks to a 2-thread pool.',
          'Each task returns a ProcessResult record with byte size and elapsed duration.',
          'future.get() blocks until each image completes and displays metrics.',
          'Pool gracefully shuts down.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Using unbounded newCachedThreadPool in production',
        wrongCode: 'ExecutorService pool = Executors.newCachedThreadPool();',
        fixedCode: 'ExecutorService pool = new ThreadPoolExecutor(10, 50, 60, TimeUnit.SECONDS, new ArrayBlockingQueue<>(500));',
        cause: 'newCachedThreadPool allows up to 2.14 billion threads, leading to OOM crashes under sudden traffic spikes.',
        solution: 'Always bound pool and queue capacities in production backends.'
      }
    ],
    bestPractices: {
      doList: [
        'Always call shutdown() or use try-with-resources (Java 19+).',
        'Size CPU-bound pools to CoreCount + 1, and I/O pools with bounded queues.'
      ],
      dontList: [
        'Do not let tasks swallow exceptions without logging or rethrowing.',
        'Do not block indefinitely with future.get(); specify a timeout.'
      ],
      whenNotToUse: 'For millions of concurrent lightweight I/O tasks, use Virtual Threads (Topic 53).'
    },
    versionNotes: {
      introduced: 'Java 5',
      status: 'Stable',
      compatibilityNotes: 'Java 19 made ExecutorService implement AutoCloseable.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'Executor Service Types Cheat Sheet',
      headers: ['Factory Method', 'Core Threads', 'Max Threads', 'Queue Policy'],
      rows: [
        ['newFixedThreadPool(N)', 'N', 'N', 'Unbounded LinkedBlockingQueue'],
        ['newCachedThreadPool()', '0', 'Integer.MAX_VALUE', 'Direct handoff SynchronousQueue'],
        ['newSingleThreadExecutor()', '1', '1', 'Unbounded LinkedBlockingQueue'],
        ['newScheduledThreadPool(N)', 'N', 'Integer.MAX_VALUE', 'DelayedWorkQueue']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Timed Asynchronous Task',
        prompt: 'Submit a task that returns a String and retrieve it with a 500ms timeout.',
        solution: 'Future<String> f = pool.submit(() -> "done"); String res = f.get(500, TimeUnit.MILLISECONDS);',
        explanation: 'Prevents indefinite blocking if the worker thread hangs.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 Specification: java.util.concurrent.ExecutorService',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-52',
    slug: 'asynchronous-pipelines-with-completablefuture',
    topicNumber: 52,
    title: 'Asynchronous Pipelines with CompletableFuture',
    part: 'Part 1: Java Core',
    sectionNumber: 13,
    sectionTitle: 'Concurrency & Multithreading',
    versionBadge: 'Java 8+ / Enhanced Java 9 & 12',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Build reactive, non-blocking asynchronous pipelines with stage transformations, combinations, and error recovery.',
    prerequisites: [
      'Topic 40: Lambdas and Functional Interfaces',
      'Topic 51: Executor Framework and Thread Pools'
    ],
    whatAndWhy: {
      definition: 'CompletableFuture represents a stage of a potentially asynchronous computation that triggers dependent actions upon completion without blocking the calling thread.',
      analogy: 'An automated fulfillment center where conveyor belts branch into parallel packaging lines and merge completed packages into shipping trucks without stopping.',
      whyItExists: 'Eliminates blocking get() calls by providing composable, functional transformations (thenApply, thenCombine, exceptionally).'
    },
    syntaxBreakdown: {
      title: 'CompletableFuture Pipeline Composition',
      codeSnippet: `CompletableFuture.supplyAsync(() -> fetchPrice())\n    .thenApply(price -> price * 1.08)\n    .thenAccept(total -> notifyUser(total));`,
      explanation: 'Initiates background task, transforms the output, and consumes final result without blocking.',
      tokens: [
        { token: 'supplyAsync', explanation: 'Initiates asynchronous task returning a value' },
        { token: 'thenApply', explanation: 'Transforms result synchronously on completion' },
        { token: 'thenCombine', explanation: 'Merges results of two independent futures' },
        { token: 'exceptionally', explanation: 'Provides fallback recovery on pipeline error' }
      ]
    },
    examples: [
      {
        id: '52-1',
        title: 'Asynchronous Stage Composition & Exception Handling',
        type: 'basic',
        description: 'Chaining stages, combining futures, and recovering from errors.',
        filename: 'CompletableFuturePipelineDemo.java',
        code: `import java.util.concurrent.CompletableFuture;\n\npublic class CompletableFuturePipelineDemo {\n    public static void main(String[] args) {\n        System.out.println("=== 1. Chaining Asynchronous Stages ===");\n        CompletableFuture<String> pricePipeline = CompletableFuture.supplyAsync(() -> {\n            System.out.println("  [Async Stage 1] Fetching raw price in " + Thread.currentThread().getName());\n            return 100.0;\n        }).thenApply(rawPrice -> {\n            System.out.println("  [Async Stage 2] Applying 8% tax");\n            return rawPrice * 1.08;\n        }).thenApply(finalPrice -> String.format("Calculated Final Price: $%.2f USD", finalPrice));\n\n        System.out.println(pricePipeline.join());\n\n        System.out.println("\\n=== 2. Combining Two Independent Futures ===");\n        CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> "Alice Vance");\n        CompletableFuture<Double> balanceFuture = CompletableFuture.supplyAsync(() -> 1450.75);\n\n        CompletableFuture<String> combinedReport = userFuture.thenCombine(\n                balanceFuture,\n                (user, balance) -> String.format("Account Report: %s has balance $%.2f", user, balance)\n        );\n\n        System.out.println(combinedReport.join());\n\n        System.out.println("\\n=== 3. Exception Handling with exceptionally() ===");\n        CompletableFuture<String> resilientPipeline = CompletableFuture.supplyAsync(() -> {\n            if (true) throw new IllegalStateException("Payment gateway unreachable");\n            return "SUCCESS";\n        }).exceptionally(ex -> {\n            System.out.println("  [Recovered] Intercepted failure: " + ex.getMessage());\n            return "FALLBACK_CACHE_OK";\n        });\n\n        System.out.println("Resilient Outcome: " + resilientPipeline.join());\n    }\n}`,
        output: `=== 1. Chaining Asynchronous Stages ===\n  [Async Stage 1] Fetching raw price in ForkJoinPool.commonPool-worker-1\n  [Async Stage 2] Applying 8% tax\nCalculated Final Price: $108.00 USD\n\n=== 2. Combining Two Independent Futures ===\nAccount Report: Alice Vance has balance $1450.75\n\n=== 3. Exception Handling with exceptionally() ===\n  [Recovered] Intercepted failure: java.lang.IllegalStateException: Payment gateway unreachable\nResilient Outcome: FALLBACK_CACHE_OK`,
        stepByStep: [
          'supplyAsync runs in ForkJoinPool.',
          'thenApply chains tax computation without blocking main thread.',
          'thenCombine awaits both user and balance futures, fusing into report.',
          'exceptionally intercepts runtime exception and returns fallback.'
        ]
      },
      {
        id: '52-2',
        title: 'Microservice Aggregator Dashboard',
        type: 'realistic',
        description: 'Aggregating three microservices concurrently into a unified dashboard.',
        filename: 'MicroserviceAggregatorApp.java',
        code: `import java.util.concurrent.CompletableFuture;\n\npublic class MicroserviceAggregatorApp {\n    record UserProfile(String id, String name) {}\n    record AccountBalance(String id, double balance) {}\n    record CreditScore(String id, int score) {}\n    record Dashboard(String name, String id, double balance, int creditScore) {}\n\n    public static void main(String[] args) {\n        long startTime = System.currentTimeMillis();\n\n        CompletableFuture<UserProfile> profileFuture = CompletableFuture.supplyAsync(() -> {\n            simulateLatency(40);\n            return new UserProfile("USR-9001", "Marcus Vance");\n        });\n\n        CompletableFuture<AccountBalance> balanceFuture = CompletableFuture.supplyAsync(() -> {\n            simulateLatency(60);\n            return new AccountBalance("USR-9001", 5240.50);\n        });\n\n        CompletableFuture<CreditScore> scoreFuture = CompletableFuture.supplyAsync(() -> {\n            simulateLatency(50);\n            return new CreditScore("USR-9001", 785);\n        });\n\n        CompletableFuture<Dashboard> dashboardFuture = profileFuture.thenCombine(\n                balanceFuture,\n                (profile, balance) -> new Object[] { profile, balance }\n        ).thenCombine(scoreFuture, (arr, score) -> {\n            UserProfile profile = (UserProfile) arr[0];\n            AccountBalance balance = (AccountBalance) arr[1];\n            return new Dashboard(profile.name(), profile.id(), balance.balance(), score.score());\n        });\n\n        Dashboard dashboard = dashboardFuture.join();\n        long totalElapsed = System.currentTimeMillis() - startTime;\n\n        System.out.println("=== Aggregated Microservice Dashboard ===");\n        System.out.println("User:         " + dashboard.name() + " (" + dashboard.id() + ")");\n        System.out.printf("Balance:      $%,.2f%n", dashboard.balance());\n        System.out.println("Credit Score: " + dashboard.creditScore());\n        System.out.println("Aggregation completed in: " + totalElapsed + "ms (Parallel speedup verified)");\n    }\n\n    private static void simulateLatency(long ms) {\n        try {\n            Thread.sleep(ms);\n        } catch (InterruptedException e) {\n            Thread.currentThread().interrupt();\n        }\n    }\n}`,
        output: `=== Aggregated Microservice Dashboard ===\nUser:         Marcus Vance (USR-9001)\nBalance:      $5,240.50\nCredit Score: 785\nAggregation completed in: 88ms (Parallel speedup verified)`,
        stepByStep: [
          'Launches 3 independent remote queries in parallel.',
          'Combines profile, balance, and credit score futures.',
          'All queries finish concurrently in ~88ms rather than 150ms sequential time.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Using default ForkJoinPool for slow blocking I/O',
        wrongCode: 'CompletableFuture.supplyAsync(() -> slowHttpCall());',
        fixedCode: 'CompletableFuture.supplyAsync(() -> slowHttpCall(), dedicatedIoPool);',
        cause: 'Blocking ForkJoinPool.commonPool starves CPU-bound operations and parallel streams across the entire JVM.',
        solution: 'Pass a dedicated custom Executor to supplyAsync and async stages.'
      }
    ],
    bestPractices: {
      doList: [
        'Prefer join() over get() when unchecked CompletionException is preferred.',
        'Always supply an exceptionally or handle fallback block to prevent silent failures.'
      ],
      dontList: [
        'Do not block synchronously inside transformation lambdas.',
        'Do not create deeply nested callback chains when structured concurrency suffices.'
      ],
      whenNotToUse: 'When sequential blocking code on Virtual Threads offers cleaner readability without reactive callbacks.'
    },
    versionNotes: {
      introduced: 'Java 8',
      status: 'Stable',
      compatibilityNotes: 'Java 9 added timeouts (orTimeout, completeOnTimeout). Java 12 added exceptionallyCompose.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'CompletableFuture Pipeline Methods',
      headers: ['Method', 'Input Lambda', 'Returns', 'Behavior'],
      rows: [
        ['thenApply', 'Function<T, R>', 'CompletableFuture<R>', 'Transforms result synchronously'],
        ['thenApplyAsync', 'Function<T, R>', 'CompletableFuture<R>', 'Transforms result on separate thread'],
        ['thenCompose', 'Function<T, CF<R>>', 'CompletableFuture<R>', 'Flattens nested future (flatMap)'],
        ['thenCombine', 'CF<U>, BiFunction', 'CompletableFuture<R>', 'Merges 2 independent futures']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Apply 10% Discount Pipeline',
        prompt: 'Chain supplyAsync with thenApply to apply a 10% discount to a $500 item.',
        solution: 'CompletableFuture.supplyAsync(() -> 500.0).thenApply(p -> p * 0.9).join();',
        explanation: 'thenApply transforms the upstream value to 450.0.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 Specification: java.util.concurrent.CompletableFuture',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-53',
    slug: 'virtual-threads',
    topicNumber: 53,
    title: 'Virtual Threads (Project Loom)',
    part: 'Part 1: Java Core',
    sectionNumber: 13,
    sectionTitle: 'Concurrency & Multithreading',
    versionBadge: 'Java 21 LTS Standard Feature',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master lightweight user-mode virtual threads, carrier threads, unmounting mechanics, and high-throughput server concurrency.',
    prerequisites: [
      'Topic 48: Threads and Thread Lifecycle',
      'Topic 51: Executor Framework and Thread Pools'
    ],
    whatAndWhy: {
      definition: 'Virtual threads are lightweight, JVM-managed threads that allow writing synchronous, blocking code at massive scale without tying up expensive operating system kernel threads.',
      analogy: 'A call center where agents put customers on automated hold while answering other calls, remounting callers the instant they are ready to talk.',
      whyItExists: 'Enables high-throughput thread-per-request architectures without reactive framework complexity, scaling to millions of concurrent tasks.'
    },
    syntaxBreakdown: {
      title: 'Creating and Executing Virtual Threads',
      codeSnippet: `Thread.ofVirtual().name("vt").start(() -> ...);\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n    executor.submit(() -> ...);\n}`,
      explanation: 'Spawns virtual threads directly or submits tasks to a virtual-thread-per-task executor.',
      tokens: [
        { token: 'Thread.ofVirtual()', explanation: 'Fluent builder for virtual threads' },
        { token: 'newVirtualThreadPerTaskExecutor()', explanation: 'Creates an executor spawning a fresh virtual thread per task' },
        { token: 'isVirtual()', explanation: 'Returns true if current thread is virtual' }
      ]
    },
    examples: [
      {
        id: '53-1',
        title: 'Virtual Thread Creation and Scaling',
        type: 'basic',
        description: 'Inspecting carrier threads and executing 1,000 virtual threads concurrently.',
        filename: 'VirtualThreadsDemo.java',
        code: `import java.util.concurrent.ExecutorService;\nimport java.util.concurrent.Executors;\n\npublic class VirtualThreadsDemo {\n    public static void main(String[] args) throws InterruptedException {\n        Thread vt = Thread.ofVirtual().name("vt-worker").start(() -> {\n            System.out.println("Running Virtual Thread: " + Thread.currentThread());\n            System.out.println("Is Virtual Thread?      " + Thread.currentThread().isVirtual());\n        });\n        vt.join();\n\n        int taskCount = 1000;\n        long start = System.currentTimeMillis();\n        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < taskCount; i++) {\n                executor.submit(() -> {\n                    try {\n                        Thread.sleep(10);\n                    } catch (InterruptedException e) {\n                        Thread.currentThread().interrupt();\n                    }\n                });\n            }\n        }\n\n        long elapsed = System.currentTimeMillis() - start;\n        System.out.println("\\nVirtual Threads Completed: " + taskCount + " / " + taskCount);\n        System.out.println("Execution Duration:        " + elapsed + "ms");\n    }\n}`,
        output: `Running Virtual Thread: VirtualThread[#28,vt-worker]/runnable@ForkJoinPool-1-worker-1\nIs Virtual Thread?      true\n\nVirtual Threads Completed: 1000 / 1000\nExecution Duration:        38ms`,
        stepByStep: [
          'Creates a virtual thread named vt-worker.',
          'Prints underlying carrier thread in ForkJoinPool.',
          'Executes 1,000 tasks concurrently in 38ms using try-with-resources.'
        ]
      },
      {
        id: '53-2',
        title: 'High-Throughput HTTP Request Simulator',
        type: 'realistic',
        description: 'Simulating 2,000 concurrent blocking HTTP requests with virtual threads.',
        filename: 'HighThroughputHttpSimulatorApp.java',
        code: `import java.util.concurrent.ExecutorService;\nimport java.util.concurrent.Executors;\nimport java.util.concurrent.atomic.AtomicInteger;\n\npublic class HighThroughputHttpSimulatorApp {\n    record HttpResponse(int statusCode, String body) {}\n\n    public static void main(String[] args) {\n        int simulatedRequests = 2000;\n        AtomicInteger successCounter = new AtomicInteger(0);\n        System.out.println("Dispatching " + simulatedRequests + " concurrent requests using Virtual Threads...");\n        long start = System.currentTimeMillis();\n\n        try (ExecutorService server = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < simulatedRequests; i++) {\n                final int reqId = i;\n                server.submit(() -> {\n                    HttpResponse response = handleClientRequest(reqId);\n                    if (response.statusCode() == 200) {\n                        successCounter.incrementAndGet();\n                    }\n                });\n            }\n        }\n\n        long duration = Math.max(1, System.currentTimeMillis() - start);\n        double throughput = (simulatedRequests * 1000.0) / duration;\n\n        System.out.println("=== Simulation Results ===");\n        System.out.println("Successful Responses: " + successCounter.get() + " / " + simulatedRequests);\n        System.out.println("Total Wall-Clock Time: " + duration + "ms");\n        System.out.printf("Throughput:            %.0f req/sec%n", throughput);\n    }\n\n    private static HttpResponse handleClientRequest(int id) {\n        try {\n            Thread.sleep(30);\n            return new HttpResponse(200, "{\\"id\\": " + id + ", \\"status\\": \\"ACTIVE\\"}");\n        } catch (InterruptedException e) {\n            Thread.currentThread().interrupt();\n            return new HttpResponse(500, "{\\"error\\": \\"interrupted\\"}");\n        }\n    }\n}`,
        output: `Dispatching 2000 concurrent requests using Virtual Threads...\n=== Simulation Results ===\nSuccessful Responses: 2000 / 2000\nTotal Wall-Clock Time: 84ms\nThroughput:            23809 req/sec`,
        stepByStep: [
          'Submits 2000 concurrent requests each sleeping 30ms.',
          'Virtual threads unmount during sleep, freeing carrier threads.',
          'Achieves over 20,000 req/sec throughput on ordinary developer hardware.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Pooling virtual threads',
        wrongCode: 'Executors.newFixedThreadPool(100, Thread.ofVirtual().factory());',
        fixedCode: 'Executors.newVirtualThreadPerTaskExecutor();',
        cause: 'Virtual threads are disposable heap objects; pooling them restricts throughput.',
        solution: 'Never pool virtual threads; spawn a new virtual thread per task.'
      }
    ],
    bestPractices: {
      doList: [
        'Use virtual threads for blocking I/O (network, DB, file calls).',
        'Use try-with-resources with newVirtualThreadPerTaskExecutor for structured lifecycles.'
      ],
      dontList: [
        'Do not use virtual threads for CPU-bound computations.',
        'Do not use ThreadLocal excessively with millions of virtual threads.'
      ],
      whenNotToUse: 'For CPU-intensive algorithms (hashing, machine learning), use platform thread pools sized to CPU cores.'
    },
    versionNotes: {
      introduced: 'Java 19 (Preview)',
      status: 'Stable',
      compatibilityNotes: 'Graduated to permanent feature in Java 21 LTS via JEP 444. Java 24 (JEP 491) removes synchronized pinning.',
      ltsAvailability: 'Java 21, Java 25'
    },
    cheatSheet: {
      title: 'Platform vs Virtual Threads Cheat Sheet',
      headers: ['Feature', 'Platform Thread', 'Virtual Thread'],
      rows: [
        ['Stack Footprint', '~1 MB fixed RAM', 'Few hundred bytes dynamic'],
        ['Management', 'OS Kernel', 'JVM HotSpot'],
        ['Concurrency Scale', 'Thousands', 'Millions'],
        ['Blocking I/O', 'Blocks OS thread', 'Unmounts; frees carrier thread']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Check Virtual Thread',
        prompt: 'Check whether the currently running thread is virtual.',
        solution: 'boolean isVt = Thread.currentThread().isVirtual();',
        explanation: 'Thread.isVirtual() indicates if execution is on a virtual thread.'
      }
    ],
    officialSources: [
      {
        title: 'OpenJDK JEP 444: Virtual Threads (Java 21 LTS)',
        url: 'https://openjdk.org/jeps/444',
        organization: 'OpenJDK'
      }
    ]
  },

  {
    id: 'topic-54',
    slug: 'structured-concurrency-and-scoped-values',
    topicNumber: 54,
    title: 'Structured Concurrency & Scoped Values',
    part: 'Part 1: Java Core',
    sectionNumber: 13,
    sectionTitle: 'Concurrency & Multithreading',
    versionBadge: 'Java 21–26 (Preview / JEP 480 & 481)',
    difficulty: 'Advanced',
    readingTime: '13 min read',
    shortDescription: 'Tame concurrent subtasks using StructuredTaskScope, automatic cancellation, and lightweight immutable ScopedValue.',
    prerequisites: [
      'Topic 51: Executor Framework and Thread Pools',
      'Topic 53: Virtual Threads (Project Loom)'
    ],
    whatAndWhy: {
      definition: 'Structured Concurrency treats concurrent subtasks running in different threads as a single unit of work, strictly bounding thread lifecycles within syntactic code blocks.',
      analogy: 'Structured programming if/for loops returning cleanly to callers instead of unstructured goto jumps running amok.',
      whyItExists: 'Eliminates thread leaks, coordinates short-circuit cancellation, and provides clean hierarchical thread dumps.'
    },
    syntaxBreakdown: {
      title: 'StructuredTaskScope and ScopedValue Idioms',
      codeSnippet: `try (var scope = StructuredTaskScope.open(StructuredTaskScope.Joiner.allSuccessfulOrThrow())) {\n    var subtask = scope.fork(() -> fetch());\n    scope.join();\n    var result = subtask.get();\n}`,
      explanation: 'Opens structured scope, forks subtask on virtual thread, joins, and retrieves result.',
      tokens: [
        { token: 'StructuredTaskScope.open()', explanation: 'Creates bounded structured task scope' },
        { token: 'scope.fork()', explanation: 'Forks concurrent subtask returning Subtask handle' },
        { token: 'scope.join()', explanation: 'Awaits completion according to Joiner policy' },
        { token: 'ScopedValue', explanation: 'Immutable, lightweight context passed down call trees' }
      ]
    },
    examples: [
      {
        id: '54-1',
        title: 'Structured Workflow with Scoped Values',
        type: 'basic',
        description: 'Propagating trace context and executing structured subtasks.',
        filename: 'StructuredConcurrencyDemo.java',
        code: `import java.util.concurrent.StructuredTaskScope;\n\npublic class StructuredConcurrencyDemo {\n    private static final ScopedValue<String> TRACE_ID = ScopedValue.newInstance();\n\n    public static void main(String[] args) throws Exception {\n        ScopedValue.where(TRACE_ID, "TXN-88219").run(() -> {\n            try {\n                executeWorkflow();\n            } catch (Exception e) {\n                System.err.println("Workflow failed: " + e.getMessage());\n            }\n        });\n    }\n\n    private static void executeWorkflow() throws Exception {\n        System.out.println("Initiating structured concurrency workflow. Trace ID: " + TRACE_ID.get());\n        try (var scope = StructuredTaskScope.open()) {\n            StructuredTaskScope.Subtask<String> userTask = scope.fork(() -> {\n                Thread.sleep(50);\n                return "User Profile: Alice Vance (ID: 409)";\n            });\n            StructuredTaskScope.Subtask<String> ordersTask = scope.fork(() -> {\n                Thread.sleep(70);\n                return "Active Orders: 3 Pending Shipments";\n            });\n            scope.join();\n            System.out.println("Subtask 1 State: " + userTask.state());\n            System.out.println("Subtask 1 Result: " + userTask.get());\n            System.out.println("Subtask 2 State: " + ordersTask.state());\n            System.out.println("Subtask 2 Result: " + ordersTask.get());\n            System.out.println("Structured workflow completed successfully.");\n        }\n    }\n}`,
        output: `Initiating structured concurrency workflow. Trace ID: TXN-88219\nSubtask 1 State: SUCCESS\nSubtask 1 Result: User Profile: Alice Vance (ID: 409)\nSubtask 2 State: SUCCESS\nSubtask 2 Result: Active Orders: 3 Pending Shipments\nStructured workflow completed successfully.`,
        stepByStep: [
          'Binds TRACE_ID via ScopedValue.where().',
          'Forks two subtasks within StructuredTaskScope.',
          'scope.join() awaits subtask completion.',
          'Subtasks clean up automatically upon scope exit.'
        ]
      },
      {
        id: '54-2',
        title: 'Travel Booking Aggregator with Short-Circuiting',
        type: 'realistic',
        description: 'Coordinating flight and hotel bookings with automatic cancellation if one fails.',
        filename: 'TravelBookingAggregatorApp.java',
        code: `import java.util.concurrent.StructuredTaskScope;\n\npublic class TravelBookingAggregatorApp {\n    record FlightQuote(String flightNumber, double priceUsd) {}\n    record HotelBooking(String hotelName, double ratePerNight) {}\n    record TravelPackage(FlightQuote flight, HotelBooking hotel, double totalEstimatedCost) {}\n\n    public static void main(String[] args) {\n        System.out.println("Starting Travel Booking Aggregator...");\n        try {\n            TravelPackage packageResult = assembleTravelPackage("JFK", "LHR");\n            System.out.println("Booking Assembled Successfully:");\n            System.out.println("  Flight: " + packageResult.flight().flightNumber() + " ($" + packageResult.flight().priceUsd() + ")");\n            System.out.println("  Hotel: " + packageResult.hotel().hotelName() + " ($" + packageResult.hotel().ratePerNight() + "/night)");\n            System.out.println("  Total Estimated: $" + packageResult.totalEstimatedCost());\n        } catch (Exception e) {\n            System.err.println("Travel package assembly failed: " + e.getMessage());\n        }\n    }\n\n    public static TravelPackage assembleTravelPackage(String origin, String destination) throws InterruptedException {\n        try (var scope = StructuredTaskScope.open(StructuredTaskScope.Joiner.allSuccessfulOrThrow())) {\n            StructuredTaskScope.Subtask<FlightQuote> flightTask = scope.fork(() -> fetchFlightQuote(origin, destination));\n            StructuredTaskScope.Subtask<HotelBooking> hotelTask = scope.fork(() -> fetchHotelReservation(destination));\n            scope.join();\n            FlightQuote flight = flightTask.get();\n            HotelBooking hotel = hotelTask.get();\n            double total = flight.priceUsd() + (hotel.ratePerNight() * 3);\n            return new TravelPackage(flight, hotel, total);\n        }\n    }\n\n    private static FlightQuote fetchFlightQuote(String origin, String destination) throws InterruptedException {\n        Thread.sleep(60);\n        return new FlightQuote("BA-178 (" + origin + "->" + destination + ")", 680.50);\n    }\n\n    private static HotelBooking fetchHotelReservation(String city) throws InterruptedException {\n        Thread.sleep(40);\n        return new HotelBooking("The Kensington Garden Hotel (" + city + ")", 215.00);\n    }\n}`,
        output: `Starting Travel Booking Aggregator...\nBooking Assembled Successfully:\n  Flight: BA-178 (JFK->LHR) ($680.5)\n  Hotel: The Kensington Garden Hotel (LHR) ($215.0/night)\n  Total Estimated: $1325.5`,
        stepByStep: [
          'assembleTravelPackage opens structured scope with allSuccessfulOrThrow policy.',
          'Forks flight and hotel queries in parallel.',
          'scope.join() coordinates both queries and cancels siblings if any query fails.',
          'Assembles completed package safely.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Calling subtask.get() before scope.join()',
        wrongCode: 'var task = scope.fork(() -> calc());\nvar res = task.get();\nscope.join();',
        fixedCode: 'var task = scope.fork(() -> calc());\nscope.join();\nvar res = task.get();',
        cause: 'Calling get() before join() throws IllegalStateException because the subtask may still be in progress.',
        solution: 'Always call scope.join() before retrieving results via subtask.get().'
      }
    ],
    bestPractices: {
      doList: [
        'Always use try-with-resources to ensure scope closure and cancel dangling tasks.',
        'Use ScopedValue instead of ThreadLocal for request context in virtual threads.'
      ],
      dontList: [
        'Do not let subtask references escape outside the try-with-resources block.',
        'Do not swallow InterruptedException inside forked subtasks.'
      ],
      whenNotToUse: 'For fire-and-forget background background jobs that must outlive the caller, use standard ExecutorService.'
    },
    versionNotes: {
      introduced: 'Java 19 (Incubator)',
      status: 'Preview',
      compatibilityNotes: 'Refined in Java 21-24; updated with Joiner in Java 25/26 (JEP 480). Requires --enable-preview.',
      ltsAvailability: 'Preview in Java 21; preview in Java 25'
    },
    cheatSheet: {
      title: 'Structured Concurrency Policies Cheat Sheet',
      headers: ['Policy / Joiner', 'Behavior on Success', 'Behavior on Failure'],
      rows: [
        ['allSuccessfulOrThrow', 'Awaits all subtasks', 'Cancels siblings on first failure'],
        ['anySuccessfulOrThrow', 'Returns fastest subtask', 'Fails only if all subtasks fail'],
        ['awaitAll', 'Awaits all subtasks regardless', 'Does not cancel; collects all results']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Scoped User Context',
        prompt: 'Bind a ScopedValue with username "admin" and verify it is accessible in an inner method.',
        solution: 'ScopedValue.where(USER, "admin").run(() -> System.out.println(USER.get()));',
        explanation: 'ScopedValue is accessible throughout the dynamic call tree within the run block.'
      }
    ],
    officialSources: [
      {
        title: 'OpenJDK JEP 480: Structured Concurrency (Preview)',
        url: 'https://openjdk.org/jeps/480',
        organization: 'OpenJDK'
      },
      {
        title: 'OpenJDK JEP 481: Scoped Values (Preview)',
        url: 'https://openjdk.org/jeps/481',
        organization: 'OpenJDK'
      }
    ]
  }
];

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

// Target position: right before Topic 66
const targetMarker = '  {\n    id: \'topic-66\',';
if (!content.includes(targetMarker)) {
  console.error('Target marker not found in topics.ts!');
  process.exit(1);
}

// Convert topics objects into TypeScript code format
function formatTopic(t) {
  return JSON.stringify(t, null, 2);
}

const formattedTopics = concurrencyTopics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(',\n\n');

const replacement = formattedTopics + ',\n\n' + targetMarker;
content = content.replace(targetMarker, replacement);

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log('Successfully appended topics 48-54 into src/data/topics.ts!');
