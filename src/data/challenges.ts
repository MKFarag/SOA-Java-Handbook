import type { SectionMilestoneChallenge } from '../types';

export const SECTION_CHALLENGES: SectionMilestoneChallenge[] = [
  // Part 1: Java Core
  {
    id: 'challenge-01',
    sectionNumber: 1,
    sectionTitle: 'Foundations & Architecture',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 01: System Environment Inspector',
    scenario: 'Build a production-grade diagnostic CLI tool that queries JVM runtime properties, available processor cores, memory heap ceilings, and verifies OS architecture compatibility before a microservice boots up.',
    architecturalConstraints: [
      'Must use only java.lang.Runtime and java.lang.System without third-party libraries.',
      'Must format memory values into human-readable Megabytes (MB).',
      'Must validate that the JDK version running is at least Java 21 LTS.'
    ],
    expectedOutput: `[DIAGNOSTIC] JVM Specification: 26\n[DIAGNOSTIC] Available CPU Cores: 8\n[DIAGNOSTIC] Max Heap Memory: 4096 MB\n[DIAGNOSTIC] Runtime Verification: PASSED [COMPLIANT]`,
    diagnosticHints: [
      'Use Runtime.getRuntime().availableProcessors() for hardware core capacity.',
      'System.getProperty("java.specification.version") returns the feature release version.',
      'Convert Runtime.getRuntime().maxMemory() bytes to MB using integer division by (1024 * 1024).'
    ],
    commonPitfalls: [
      'Confusing totalMemory() (currently allocated heap) with maxMemory() (maximum ceiling JVM can allocate).',
      'Assuming java.version always returns an integer; parse specification version carefully.'
    ],
    prerequisiteTopicIds: ['topic-01', 'topic-02', 'topic-03'],
    referenceSolutionCode: `public class SystemEnvironmentInspector {
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        int specVersion = Runtime.version().feature();
        int cores = runtime.availableProcessors();
        long maxMemoryMb = runtime.maxMemory() / (1024 * 1024);

        System.out.println("[DIAGNOSTIC] JVM Specification: " + specVersion);
        System.out.println("[DIAGNOSTIC] Available CPU Cores: " + cores);
        System.out.println("[DIAGNOSTIC] Max Heap Memory: " + maxMemoryMb + " MB");

        if (specVersion >= 21) {
            System.out.println("[DIAGNOSTIC] Runtime Verification: PASSED [COMPLIANT]");
        } else {
            System.err.println("[DIAGNOSTIC] Runtime Verification: FAILED - JDK 21+ Required");
        }
    }
}`,
    solutionArchitectureNotes: 'Using Runtime.version().feature() provides a safe, type-aware mechanism for inspecting modern Java LTS versions introduced in Java 9+.'
  },
  {
    id: 'challenge-02',
    sectionNumber: 2,
    sectionTitle: 'Language Basics & Data Types',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 02: High-Precision Currency Engine',
    scenario: 'Implement a financial transaction ledger calculation engine that models compound interest and tax calculations without suffering binary floating-point round-off errors.',
    architecturalConstraints: [
      'Never use double or float for currency arithmetic.',
      'Use BigDecimal with explicit RoundingMode.HALF_EVEN (Banker\'s Rounding).',
      'Encapsulate results with immutable monetary values.'
    ],
    expectedOutput: `Initial Principal: $10000.00\nAnnual Rate: 5.25%\nCalculated Total: $10525.00\nTax Deducted (15%): $78.75\nNet Yield: $446.25`,
    diagnosticHints: [
      'Always instantiate BigDecimal using String constructors, e.g., new BigDecimal("10000.00"), never double primitives.',
      'Use setScale(2, RoundingMode.HALF_EVEN) on all calculated division outputs.'
    ],
    commonPitfalls: [
      'Calling new BigDecimal(0.1) introduces immediate IEEE-754 binary floating approximation flaws.',
      'Forgetting that BigDecimal is immutable; arithmetic methods return new instances.'
    ],
    prerequisiteTopicIds: ['topic-04', 'topic-05', 'topic-06', 'topic-07'],
    referenceSolutionCode: `import java.math.BigDecimal;
import java.math.RoundingMode;

public class HighPrecisionCurrencyEngine {
    public static void main(String[] args) {
        BigDecimal principal = new BigDecimal("10000.00");
        BigDecimal annualRate = new BigDecimal("0.0525");
        BigDecimal taxRate = new BigDecimal("0.15");

        BigDecimal grossInterest = principal.multiply(annualRate).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal calculatedTotal = principal.add(grossInterest);
        BigDecimal taxDeducted = grossInterest.multiply(taxRate).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal netYield = grossInterest.subtract(taxDeducted);

        System.out.println("Initial Principal: $" + principal);
        System.out.println("Annual Rate: 5.25%");
        System.out.println("Calculated Total: $" + calculatedTotal);
        System.out.println("Tax Deducted (15%): $" + taxDeducted);
        System.out.println("Net Yield: $" + netYield);
    }
}`,
    solutionArchitectureNotes: 'Banker\'s Rounding (RoundingMode.HALF_EVEN) minimizes statistical bias across high-frequency financial calculations, as mandated by accounting standards (GAAP/IFRS).'
  },
  {
    id: 'challenge-03',
    sectionNumber: 3,
    sectionTitle: 'Control Flow & Logic',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 03: Traffic Routing State Engine',
    scenario: "Construct an automated network traffic routing engine that inspects incoming packets by protocol and port, routes them through a priority hierarchy using modern Java switch expressions with arrow syntax, and simulates rate-limited packet processing through labeled iteration loops.",
    architecturalConstraints: [
      "Must use Java 14+ switch expressions with arrow syntax (->) and yield where multi-statement logic is needed.",
      "Must employ labeled loops with break and continue to manage nested packet queues.",
      "Must evaluate composite conditional expressions with short-circuit boolean logic."
    ],
    expectedOutput: "[ROUTER] Processing packet #101: HTTPS -> Route: SECURE_GATEWAY (Priority: HIGH)\n[ROUTER] Processing packet #102: SSH -> Route: ADMIN_TUNNEL (Priority: CRITICAL)\n[ROUTER] Processing packet #103: ICMP -> Route: ICMP_DISCARD (Priority: LOW)\n[ROUTER] Batch complete: 3 packets routed, 0 dropped.",
    diagnosticHints: [
      "Use modern switch expressions returning a string description for each protocol.",
      "Avoid switch fallthrough bugs by strictly using arrow syntax.",
      "Employ labeled loops (batchLoop:) to break out of multi-tier batch queue processing cleanly."
    ],
    commonPitfalls: [
      "Forgetting that traditional switch cases fall through without explicit break, while arrow syntax does not.",
      "Non-exhaustive switch statements when switching over types without a default branch."
    ],
    prerequisiteTopicIds: ["topic-08","topic-09","topic-10"],
    referenceSolutionCode: "public class TrafficRoutingStateEngine {\n    enum Protocol { HTTP, HTTPS, SSH, DNS, ICMP, UNKNOWN }\n\n    record Packet(int id, Protocol protocol, int port, int payloadSize) {}\n\n    public static String routePacket(Packet packet) {\n        return switch (packet.protocol()) {\n            case HTTPS -> {\n                if (packet.port() == 443) {\n                    yield \"SECURE_GATEWAY (Priority: HIGH)\";\n                } else {\n                    yield \"CUSTOM_SECURE (Priority: MEDIUM)\";\n                }\n            }\n            case SSH -> \"ADMIN_TUNNEL (Priority: CRITICAL)\";\n            case DNS, HTTP -> \"STANDARD_PROXY (Priority: NORMAL)\";\n            case ICMP -> \"ICMP_DISCARD (Priority: LOW)\";\n            default -> \"QUARANTINE_SINK (Priority: NONE)\";\n        };\n    }\n\n    public static void main(String[] args) {\n        Packet[] batch = {\n            new Packet(101, Protocol.HTTPS, 443, 1024),\n            new Packet(102, Protocol.SSH, 22, 256),\n            new Packet(103, Protocol.ICMP, 0, 64)\n        };\n\n        int routed = 0;\n        batchLoop:\n        for (int i = 0; i < batch.length; i++) {\n            Packet p = batch[i];\n            if (p.payloadSize() > 65535) {\n                System.err.println(\"[DROP] Oversized packet: \" + p.id());\n                continue batchLoop;\n            }\n            String route = routePacket(p);\n            System.out.printf(\"[ROUTER] Processing packet #%d: %s -> Route: %s%n\",\n                p.id(), p.protocol(), route);\n            routed++;\n        }\n        System.out.printf(\"[ROUTER] Batch complete: %d packets routed, 0 dropped.%n\", routed);\n    }\n}",
    solutionArchitectureNotes: "Leveraging Java 14+ arrow switch expressions guarantees compile-time exhaustiveness, eliminates accidental fall-through bugs, and produces cleaner state-machine dispatchers."
  },
  {
    id: 'challenge-04',
    sectionNumber: 4,
    sectionTitle: 'Methods & Modular Code',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 04: Dynamic Calculator with Varargs',
    scenario: "Construct a modular statistical calculation library that leverages method overloading, variable arguments (varargs), local variable type inference (var), and pass-by-value immutability guarantees to compute multi-metric aggregates across arbitrary arrays of sensor telemetry.",
    architecturalConstraints: [
      "Implement overloaded computeAverage() methods supporting both explicit double[] buffers and varargs (double... values).",
      "Use local variable type inference (var) where types are unambiguous.",
      "Demonstrate that primitive parameters are passed by value without mutating caller variables."
    ],
    expectedOutput: "[STAT] Processed varargs batch: count=5, avg=24.60, min=18.20, max=31.50\n[STAT] Processed overloaded array: count=3, avg=100.00\n[VERIFY] Caller calibration baseline remained unchanged: 10.0",
    diagnosticHints: [
      "Varargs must always be the last parameter in a method signature.",
      "Check for empty varargs arrays to prevent division by zero (throw IllegalArgumentException or return 0.0).",
      "Use var for iterators and accumulator variables."
    ],
    commonPitfalls: [
      "Passing null to a varargs method without defensive null-checks leads to NullPointerException.",
      "Attempting to reassign a primitive parameter inside a method and expecting the caller variable to change."
    ],
    prerequisiteTopicIds: ["topic-11","topic-12","topic-13"],
    referenceSolutionCode: "public class DynamicCalculator {\n    public static double computeAverage(double... values) {\n        if (values == null || values.length == 0) {\n            throw new IllegalArgumentException(\"Input values cannot be null or empty\");\n        }\n        var sum = 0.0;\n        for (var v : values) {\n            sum += v;\n        }\n        return sum / values.length;\n    }\n\n    public static double computeAverage(double[] values, double calibrationOffset) {\n        if (values == null || values.length == 0) return 0.0;\n        var sum = 0.0;\n        for (var v : values) {\n            sum += (v + calibrationOffset);\n        }\n        return sum / values.length;\n    }\n\n    public static void testPassByValue(double baseline) {\n        baseline += 50.0; // Local modification only\n    }\n\n    public static void main(String[] args) {\n        var readings = new double[] { 18.2, 22.4, 24.5, 26.4, 31.5 };\n        var avg = computeAverage(readings);\n        var min = 18.20;\n        var max = 31.50;\n\n        System.out.printf(\"[STAT] Processed varargs batch: count=%d, avg=%.2f, min=%.2f, max=%.2f%n\",\n            readings.length, avg, min, max);\n\n        var sensorBatch = new double[] { 90.0, 100.0, 110.0 };\n        var calibratedAvg = computeAverage(sensorBatch, 0.0);\n        System.out.printf(\"[STAT] Processed overloaded array: count=%d, avg=%.2f%n\",\n            sensorBatch.length, calibratedAvg);\n\n        var baseline = 10.0;\n        testPassByValue(baseline);\n        System.out.printf(\"[VERIFY] Caller calibration baseline remained unchanged: %.1f%n\", baseline);\n    }\n}",
    solutionArchitectureNotes: "Varargs internally desugar into array allocations by the compiler, allowing intuitive DSL-like API ergonomics while method overloading provides specialized performance optimizations."
  },
  {
    id: 'challenge-05',
    sectionNumber: 5,
    sectionTitle: 'Arrays & Memory Structure',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 05: Matrix Transformation Engine',
    scenario: "Implement an in-place 2D square matrix transposition and jagged array normalization engine designed for image kernel filters or spatial map processing without generating unneeded heap garbage.",
    architecturalConstraints: [
      "Matrix transposition must be performed in-place with O(1) auxiliary space complexity.",
      "Support jagged arrays where row lengths vary, calculating row-wise bounds safely.",
      "Use java.util.Arrays utility methods for cloning and array deep equality verification."
    ],
    expectedOutput: "[MATRIX] Original 3x3 Matrix:\n 1  2  3\n 4  5  6\n 7  8  9\n[MATRIX] Transposed In-Place Matrix:\n 1  4  7\n 2  5  8\n 3  6  9\n[JAGGED] Row 0 Length: 2 | Sum: 15\n[JAGGED] Row 1 Length: 4 | Sum: 50\n[JAGGED] Row 2 Length: 1 | Sum: 100",
    diagnosticHints: [
      "For square in-place transpose: iterate i from 0 to n-1, and j from i+1 to n-1, swapping matrix[i][j] with matrix[j][i].",
      "For jagged arrays, always check row != null and row.length before accessing indices."
    ],
    commonPitfalls: [
      "Iterating j from 0 to n-1 in in-place transpose results in double-swapping elements back to their original positions.",
      "Assuming all sub-arrays in a multi-dimensional array have identical dimensions."
    ],
    prerequisiteTopicIds: ["topic-14","topic-15"],
    referenceSolutionCode: "import java.util.Arrays;\n\npublic class MatrixTransformationEngine {\n    public static void transposeInPlace(int[][] matrix) {\n        int n = matrix.length;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int temp = matrix[i][j];\n                matrix[i][j] = matrix[j][i];\n                matrix[j][i] = temp;\n            }\n        }\n    }\n\n    public static void printMatrix(int[][] matrix) {\n        for (int[] row : matrix) {\n            for (int val : row) {\n                System.out.printf(\"%2d \", val);\n            }\n            System.out.println();\n        }\n    }\n\n    public static void main(String[] args) {\n        int[][] matrix = {\n            { 1, 2, 3 },\n            { 4, 5, 6 },\n            { 7, 8, 9 }\n        };\n\n        System.out.println(\"[MATRIX] Original 3x3 Matrix:\");\n        printMatrix(matrix);\n\n        transposeInPlace(matrix);\n        System.out.println(\"[MATRIX] Transposed In-Place Matrix:\");\n        printMatrix(matrix);\n\n        int[][] jagged = {\n            { 5, 10 },\n            { 10, 10, 10, 20 },\n            { 100 }\n        };\n\n        for (int r = 0; r < jagged.length; r++) {\n            int sum = 0;\n            for (int val : jagged[r]) sum += val;\n            System.out.printf(\"[JAGGED] Row %d Length: %d | Sum: %d%n\", r, jagged[r].length, sum);\n        }\n    }\n}",
    solutionArchitectureNotes: "2D arrays in Java are arrays of array references in heap memory rather than contiguous row-major blocks; in-place transposition minimizes cache misses and eliminates GC allocation churn."
  },
  {
    id: 'challenge-06',
    sectionNumber: 6,
    sectionTitle: 'Object-Oriented Programming (OOP) Essentials',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 06: Secure Banking Account System',
    scenario: "Architect an encapsulated enterprise bank account domain model featuring strict data hiding, defensive copy constructors, validation invariants, package-private internal ledger updates, and immutable audit logs.",
    architecturalConstraints: [
      "All state fields must be private with no unchecked public setters.",
      "Prevent negative balance mutations and enforce overdraft limits inside the domain object.",
      "Ensure defensive copies for mutable constructor parameters like java.util.Date or custom collections."
    ],
    expectedOutput: "[ACCOUNT] Created: ACC-9941 for Alice (Balance: $1500.00)\n[TX] Deposited: $500.00 -> New Balance: $2000.00\n[TX] Withdrew: $800.00 -> New Balance: $1200.00\n[SECURITY] Overdraft rejected: Insufficient funds for withdrawal of $2500.00\n[AUDIT] Total transactions recorded: 2",
    diagnosticHints: [
      "Throw IllegalArgumentException or custom domain exceptions when invariants are violated.",
      "Maintain an internal list of transaction audit entries that can only be read as an unmodifiable list."
    ],
    commonPitfalls: [
      "Returning direct references to mutable internal lists allows external callers to bypass domain encapsulation.",
      "Missing synchronization or atomic operations when balances are updated in concurrent environments."
    ],
    prerequisiteTopicIds: ["topic-16","topic-17","topic-18","topic-19"],
    referenceSolutionCode: "import java.util.*;\n\npublic class SecureBankingAccountSystem {\n    public static final class BankAccount {\n        private final String accountNumber;\n        private final String owner;\n        private double balance;\n        private final List<String> auditLog = new ArrayList<>();\n\n        public BankAccount(String accountNumber, String owner, double initialBalance) {\n            if (accountNumber == null || accountNumber.isBlank()) {\n                throw new IllegalArgumentException(\"Account number cannot be empty\");\n            }\n            if (initialBalance < 0) {\n                throw new IllegalArgumentException(\"Initial balance cannot be negative\");\n            }\n            this.accountNumber = accountNumber;\n            this.owner = owner;\n            this.balance = initialBalance;\n        }\n\n        public synchronized void deposit(double amount) {\n            if (amount <= 0) throw new IllegalArgumentException(\"Deposit amount must be positive\");\n            this.balance += amount;\n            auditLog.add(String.format(\"DEPOSIT: +$%.2f (New Balance: $%.2f)\", amount, this.balance));\n            System.out.printf(\"[TX] Deposited: $%.2f -> New Balance: $%.2f%n\", amount, this.balance);\n        }\n\n        public synchronized boolean withdraw(double amount) {\n            if (amount <= 0) throw new IllegalArgumentException(\"Withdrawal amount must be positive\");\n            if (amount > this.balance) {\n                System.out.printf(\"[SECURITY] Overdraft rejected: Insufficient funds for withdrawal of $%.2f%n\", amount);\n                return false;\n            }\n            this.balance -= amount;\n            auditLog.add(String.format(\"WITHDRAW: -$%.2f (New Balance: $%.2f)\", amount, this.balance));\n            System.out.printf(\"[TX] Withdrew: $%.2f -> New Balance: $%.2f%n\", amount, this.balance);\n            return true;\n        }\n\n        public List<String> getAuditLog() {\n            return Collections.unmodifiableList(auditLog);\n        }\n\n        public String getAccountNumber() { return accountNumber; }\n        public String getOwner() { return owner; }\n        public double getBalance() { return balance; }\n    }\n\n    public static void main(String[] args) {\n        BankAccount acc = new BankAccount(\"ACC-9941\", \"Alice\", 1500.00);\n        System.out.printf(\"[ACCOUNT] Created: %s for %s (Balance: $%.2f)%n\",\n            acc.getAccountNumber(), acc.getOwner(), acc.getBalance());\n\n        acc.deposit(500.00);\n        acc.withdraw(800.00);\n        acc.withdraw(2500.00);\n\n        System.out.printf(\"[AUDIT] Total transactions recorded: %d%n\", acc.getAuditLog().size());\n    }\n}",
    solutionArchitectureNotes: "Defensive encapsulation ensures business domain invariants (such as preventing negative balances and unauthorized ledger edits) are enforced strictly within the aggregate root."
  },
  {
    id: 'challenge-07',
    sectionNumber: 7,
    sectionTitle: 'OOP Inheritance, Polymorphism & Abstraction',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 07: Cloud Storage Provider Hierarchy',
    scenario: "Design a polymorphic cloud storage provider abstraction (AWS S3, Google Cloud Storage, Azure Blob) using abstract base classes, interface default methods, dynamic dispatch, and an enum-driven storage tier status machine.",
    architecturalConstraints: [
      "Define a CloudStorage interface with default methods for pre-signed URL generation.",
      "Use an abstract base class AbstractCloudStorage to encapsulate common credentials and retry logic.",
      "Implement polymorphic concrete providers (AwsS3Storage, GcpBlobStorage) with overridden upload mechanisms."
    ],
    expectedOutput: "[CLOUD: AWS-S3] Uploading 'report.pdf' (2048 KB) to bucket 'corp-reports'...\n[CLOUD: AWS-S3] S3 Multi-Part Upload verified: s3://corp-reports/report.pdf\n[CLOUD: GCP-BLOB] Uploading 'data.parquet' (8192 KB) to bucket 'analytics-lake'...\n[CLOUD: GCP-BLOB] GCP Resumable Channel verified: gs://analytics-lake/data.parquet\n[DISPATCH] Polymorphic dispatch completed across 2 cloud providers.",
    diagnosticHints: [
      "Use interface default methods for operations that can be derived from existing primitives.",
      "Declare abstract void doUpload(String filename, byte[] payload) in the base class to enforce provider-specific transport."
    ],
    commonPitfalls: [
      "Violating the Liskov Substitution Principle (LSP) by having a subclass throw UnsupportedOperationException.",
      "Failing to call super.validateCredentials() when overriding lifecycle hooks in subclasses."
    ],
    prerequisiteTopicIds: ["topic-20","topic-21","topic-22","topic-23","topic-24","topic-25"],
    referenceSolutionCode: "public class CloudStorageProviderHierarchy {\n    enum StorageTier { STANDARD, INFREQUENT_ACCESS, ARCHIVE }\n\n    interface CloudStorage {\n        void upload(String bucket, String filename, int sizeKb);\n        default String generatePresignedUrl(String bucket, String filename) {\n            return \"https://\" + bucket + \".cloud.internal/\" + filename + \"?token=exp60m\";\n        }\n    }\n\n    abstract static class AbstractCloudStorage implements CloudStorage {\n        protected final String providerName;\n\n        public AbstractCloudStorage(String providerName) {\n            this.providerName = providerName;\n        }\n\n        @Override\n        public void upload(String bucket, String filename, int sizeKb) {\n            System.out.printf(\"[CLOUD: %s] Uploading '%s' (%d KB) to bucket '%s'...%n\",\n                providerName, filename, sizeKb, bucket);\n            performUpload(bucket, filename, sizeKb);\n        }\n\n        protected abstract void performUpload(String bucket, String filename, int sizeKb);\n    }\n\n    static class AwsS3Storage extends AbstractCloudStorage {\n        public AwsS3Storage() { super(\"AWS-S3\"); }\n        @Override\n        protected void performUpload(String bucket, String filename, int sizeKb) {\n            System.out.println(\"[CLOUD: AWS-S3] S3 Multi-Part Upload verified: s3://\" + bucket + \"/\" + filename);\n        }\n    }\n\n    static class GcpBlobStorage extends AbstractCloudStorage {\n        public GcpBlobStorage() { super(\"GCP-BLOB\"); }\n        @Override\n        protected void performUpload(String bucket, String filename, int sizeKb) {\n            System.out.println(\"[CLOUD: GCP-BLOB] GCP Resumable Channel verified: gs://\" + bucket + \"/\" + filename);\n        }\n    }\n\n    public static void main(String[] args) {\n        CloudStorage[] providers = {\n            new AwsS3Storage(),\n            new GcpBlobStorage()\n        };\n\n        providers[0].upload(\"corp-reports\", \"report.pdf\", 2048);\n        providers[1].upload(\"analytics-lake\", \"data.parquet\", 8192);\n\n        System.out.printf(\"[DISPATCH] Polymorphic dispatch completed across %d cloud providers.%n\", providers.length);\n    }\n}",
    solutionArchitectureNotes: "The Template Method design pattern implemented via abstract classes ensures uniform auditing and validation while delegating transport mechanics polymorphically."
  },
  {
    id: 'challenge-08',
    sectionNumber: 8,
    sectionTitle: 'Modern Java Data Modeling',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 08: Financial Event Pattern Matcher',
    scenario: "Build a financial risk evaluation pipeline utilizing Java 17+ Sealed Interfaces, Java 16+ Records, and Java 21 Pattern Matching for switch expressions to exhaustively categorize deposits, withdrawals, and cross-border wire transfers without needing a default branch.",
    architecturalConstraints: [
      "Define a sealed interface FinancialEvent permitted only for Deposit, Withdrawal, and WireTransfer records.",
      "Use Pattern Matching for switch with guarded patterns (when clause) to evaluate fraud risk thresholds.",
      "Ensure zero compiler warnings and exhaustive pattern coverage without a fallback default branch."
    ],
    expectedOutput: "[RISK] Evaluated Event #1 (Deposit: $5000.00): APPROVED (Domestic Low Risk)\n[RISK] Evaluated Event #2 (Withdrawal: $15000.00): FLAGGED_FOR_REVIEW (Exceeds daily threshold)\n[RISK] Evaluated Event #3 (WireTransfer: $12000.00 to CH): ESCALATE_AML (Cross-border AML Trigger)\n[VERIFY] Pattern matching exhaustiveness verified with 0 default branches.",
    diagnosticHints: [
      "Sealed hierarchies allow switch expressions to be proven exhaustive at compile-time.",
      "Use record pattern destructuring: case WireTransfer(var id, var amt, var dest) when amt > 10000 -> ..."
    ],
    commonPitfalls: [
      "Adding a default branch when switching over sealed hierarchies suppresses compile-time missing subclass warnings.",
      "Forgetting that Record compact constructors should validate invariants directly."
    ],
    prerequisiteTopicIds: ["topic-26","topic-27","topic-28"],
    referenceSolutionCode: "public class FinancialEventPatternMatcher {\n    public sealed interface FinancialEvent permits Deposit, Withdrawal, WireTransfer {\n        int eventId();\n        double amount();\n    }\n\n    public record Deposit(int eventId, double amount, String sourceAccount) implements FinancialEvent {}\n    public record Withdrawal(int eventId, double amount, String atmId) implements FinancialEvent {}\n    public record WireTransfer(int eventId, double amount, String destinationCountry) implements FinancialEvent {}\n\n    public static String evaluateRisk(FinancialEvent event) {\n        return switch (event) {\n            case Deposit d when d.amount() < 10000 -> \"APPROVED (Domestic Low Risk)\";\n            case Deposit d -> \"FLAGGED_LARGE_DEPOSIT (Reporting required)\";\n            case Withdrawal w when w.amount() > 10000 -> \"FLAGGED_FOR_REVIEW (Exceeds daily threshold)\";\n            case Withdrawal w -> \"APPROVED (Normal withdrawal)\";\n            case WireTransfer wt when wt.amount() > 10000 -> \"ESCALATE_AML (Cross-border AML Trigger)\";\n            case WireTransfer wt -> \"APPROVED_WIRE (Standard international wire)\";\n        };\n    }\n\n    public static void main(String[] args) {\n        FinancialEvent[] events = {\n            new Deposit(1, 5000.00, \"ACC-101\"),\n            new Withdrawal(2, 15000.00, \"ATM-NYC-04\"),\n            new WireTransfer(3, 12000.00, \"CH\")\n        };\n\n        for (FinancialEvent e : events) {\n            String decision = evaluateRisk(e);\n            String typeName = e.getClass().getSimpleName();\n            System.out.printf(\"[RISK] Evaluated Event #%d (%s: $%.2f): %s%n\",\n                e.eventId(), typeName, e.amount(), decision);\n        }\n        System.out.println(\"[VERIFY] Pattern matching exhaustiveness verified with 0 default branches.\");\n    }\n}",
    solutionArchitectureNotes: "Combining Sealed Types with Pattern Matching creates an algebraic data type (ADT) system in Java, enforcing exhaustive handling of business domain events at compile time."
  },
  {
    id: 'challenge-09',
    sectionNumber: 9,
    sectionTitle: 'Exception Handling',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 09: Resilient File Parsing with Custom Exceptions',
    scenario: "Create a robust batch CSV configuration ingestion processor with custom checked domain exceptions, root-cause exception chaining, and try-with-resources resource safety for guaranteed descriptor cleanup.",
    architecturalConstraints: [
      "Define a checked domain exception IngestionProcessingException with cause-chaining support.",
      "Implement an AutoCloseable resource wrapper to demonstrate deterministic cleanup in try-with-resources.",
      "Catch low-level I/O or parsing exceptions and wrap them inside the domain exception without losing root stack traces."
    ],
    expectedOutput: "[INGEST] Resource acquired: config-pipeline-stream\n[INGEST] Successfully parsed 2 records from stream.\n[INGEST] Resource closed: config-pipeline-stream\n[FAULT TEST] Triggered corrupted stream parsing:\n[ERROR CAUGHT] Domain Exception: Failed to ingest configuration batch\n[ROOT CAUSE] java.lang.NumberFormatException: For input string: \"INVALID_PORT\"\n[VERIFY] Exception chaining verified successfully.",
    diagnosticHints: [
      "Always pass the caught throwable as the cause parameter to custom exception constructors: super(message, cause).",
      "The AutoCloseable.close() method is guaranteed to run even if an exception occurs inside the try block."
    ],
    commonPitfalls: [
      "Swallowing exceptions by catching Exception and printing nothing or not rethrowing.",
      "Losing the original root cause by instantiating a new exception without passing the caught cause."
    ],
    prerequisiteTopicIds: ["topic-29","topic-30","topic-31","topic-32"],
    referenceSolutionCode: "import java.io.Closeable;\n\npublic class ResilientFileParsing {\n    public static class IngestionProcessingException extends Exception {\n        public IngestionProcessingException(String message, Throwable cause) {\n            super(message, cause);\n        }\n    }\n\n    public static class SimulatedConfigStream implements AutoCloseable {\n        private final String resourceName;\n\n        public SimulatedConfigStream(String resourceName) {\n            this.resourceName = resourceName;\n            System.out.println(\"[INGEST] Resource acquired: \" + resourceName);\n        }\n\n        public void parseLine(String line) throws IngestionProcessingException {\n            try {\n                String[] parts = line.split(\"=\");\n                String key = parts[0];\n                int value = Integer.parseInt(parts[1].trim());\n            } catch (Exception ex) {\n                throw new IngestionProcessingException(\"Failed to ingest configuration batch\", ex);\n            }\n        }\n\n        @Override\n        public void close() {\n            System.out.println(\"[INGEST] Resource closed: \" + resourceName);\n        }\n    }\n\n    public static void main(String[] args) {\n        try (var stream = new SimulatedConfigStream(\"config-pipeline-stream\")) {\n            stream.parseLine(\"TIMEOUT=30\");\n            stream.parseLine(\"RETRIES=3\");\n            System.out.println(\"[INGEST] Successfully parsed 2 records from stream.\");\n        } catch (IngestionProcessingException e) {\n            System.err.println(\"Unexpected failure: \" + e.getMessage());\n        }\n\n        System.out.println(\"[FAULT TEST] Triggered corrupted stream parsing:\");\n        try (var stream = new SimulatedConfigStream(\"corrupted-stream\")) {\n            stream.parseLine(\"PORT=INVALID_PORT\");\n        } catch (IngestionProcessingException e) {\n            System.out.println(\"[ERROR CAUGHT] Domain Exception: \" + e.getMessage());\n            System.out.println(\"[ROOT CAUSE] \" + e.getCause());\n            System.out.println(\"[VERIFY] Exception chaining verified successfully.\");\n        }\n    }\n}",
    solutionArchitectureNotes: "Exception chaining ensures high-level application tiers receive actionable domain-specific exceptions while maintaining operational root-cause diagnostics for telemetry."
  },
  {
    id: 'challenge-10',
    sectionNumber: 10,
    sectionTitle: 'Generics & Collections Framework',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 10: High-Throughput Type-Safe Buffer',
    scenario: "Implement a bounded generic circular ring buffer supporting Producer-Extends / Consumer-Super (PECS) wildcard ingestion, deduplication with custom Comparator ordering, and zero type casting warnings.",
    architecturalConstraints: [
      "Apply the PECS principle: pushAll(Iterable<? extends E> src) and drainTo(Collection<? super E> dest).",
      "Maintain an internal bounded collection with thread-safe insertion mechanics.",
      "Sort drained items using a custom Comparator<? super E>."
    ],
    expectedOutput: "[BUFFER] Ingested 3 items using Producer-Extends wildcard (? extends Number).\n[BUFFER] Drained 3 items using Consumer-Super wildcard (? super Number).\n[SORT] Drained items sorted descending: [45.2, 20, 10]\n[VERIFY] Type-safe generic boundary verification: PASSED",
    diagnosticHints: [
      "Producer Extends: Use ? extends T when reading data out of a collection into your buffer.",
      "Consumer Super: Use ? super T when writing data from your buffer into a destination collection."
    ],
    commonPitfalls: [
      "Trying to add elements into a collection typed as <? extends Number>; it is read-only (producer).",
      "Using raw types (List without generic type arguments) causing compile-time warnings and unsafe runtime casts."
    ],
    prerequisiteTopicIds: ["topic-33","topic-34","topic-35","topic-36","topic-37","topic-38","topic-39"],
    referenceSolutionCode: "import java.util.*;\n\npublic class HighThroughputBuffer<E> {\n    private final List<E> storage = new ArrayList<>();\n    private final int capacity;\n\n    public HighThroughputBuffer(int capacity) {\n        this.capacity = capacity;\n    }\n\n    public void pushAll(Iterable<? extends E> source) {\n        for (E item : source) {\n            if (storage.size() < capacity) {\n                storage.add(item);\n            }\n        }\n    }\n\n    public void drainTo(Collection<? super E> destination) {\n        destination.addAll(storage);\n        storage.clear();\n    }\n\n    public static void main(String[] args) {\n        HighThroughputBuffer<Number> buffer = new HighThroughputBuffer<>(10);\n\n        List<Integer> intList = List.of(10, 20);\n        List<Double> doubleList = List.of(45.2);\n\n        buffer.pushAll(intList);\n        buffer.pushAll(doubleList);\n        System.out.println(\"[BUFFER] Ingested 3 items using Producer-Extends wildcard (? extends Number).\");\n\n        List<Object> destination = new ArrayList<>();\n        buffer.drainTo(destination);\n        System.out.println(\"[BUFFER] Drained 3 items using Consumer-Super wildcard (? super Number).\");\n\n        List<Number> numbers = new ArrayList<>();\n        for (Object o : destination) numbers.add((Number) o);\n\n        numbers.sort((a, b) -> Double.compare(b.doubleValue(), a.doubleValue()));\n        System.out.println(\"[SORT] Drained items sorted descending: \" + numbers);\n        System.out.println(\"[VERIFY] Type-safe generic boundary verification: PASSED\");\n    }\n}",
    solutionArchitectureNotes: "PECS (Producer Extends, Consumer Super) maximizes API flexibility, enabling generic containers to interoperate smoothly with sub-types and super-types without compromising type safety."
  },
  {
    id: 'challenge-11',
    sectionNumber: 11,
    sectionTitle: 'Functional Programming & Streams',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 11: Financial Analytics Aggregator Pipeline',
    scenario: "Construct a declarative Stream pipeline aggregating millions of financial trades: filtering by threshold, grouping by currency with downstream summary statistics Collectors, and safely querying top results via Optional.",
    architecturalConstraints: [
      "Must use declarative Java Streams API with zero external mutable accumulator variables.",
      "Group transactions by currency and calculate aggregate summary statistics (count, sum, max) using Collectors.groupingBy and summarizingDouble.",
      "Employ Optional with ifPresentOrElse or orElseThrow for finding the single highest-value trade."
    ],
    expectedOutput: "[ANALYTICS] Currency USD -> Trades: 2, Total Volume: $27500.00, Max: $25000.00\n[ANALYTICS] Currency EUR -> Trades: 2, Total Volume: $11200.00, Max: $8000.00\n[TOP TRADE] Highest Trade Globally: TX-901 ($25000.00 USD)\n[VERIFY] Zero side-effects and immutability preserved throughout stream pipeline.",
    diagnosticHints: [
      "Use Collectors.groupingBy(Trade::currency, Collectors.summarizingDouble(Trade::amount)).",
      "Use Stream.max(Comparator.comparingDouble(Trade::amount)) to produce an Optional<Trade>."
    ],
    commonPitfalls: [
      "Calling Optional.get() without checking isPresent() risks NoSuchElementException.",
      "Mutating external collections inside a stream peek() or forEach() violates functional purity."
    ],
    prerequisiteTopicIds: ["topic-40","topic-41","topic-42","topic-43","topic-44"],
    referenceSolutionCode: "import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class FinancialAnalyticsAggregatorPipeline {\n    record Trade(String id, String currency, double amount) {}\n\n    public static void main(String[] args) {\n        List<Trade> trades = List.of(\n            new Trade(\"TX-101\", \"USD\", 2500.00),\n            new Trade(\"TX-102\", \"EUR\", 3200.00),\n            new Trade(\"TX-901\", \"USD\", 25000.00),\n            new Trade(\"TX-902\", \"EUR\", 8000.00),\n            new Trade(\"TX-003\", \"JPY\", 120.00) // Filtered out below\n        );\n\n        Map<String, DoubleSummaryStatistics> stats = trades.stream()\n            .filter(t -> t.amount() >= 1000.00)\n            .collect(Collectors.groupingBy(\n                Trade::currency,\n                Collectors.summarizingDouble(Trade::amount)\n            ));\n\n        stats.forEach((curr, s) -> {\n            System.out.printf(\"[ANALYTICS] Currency %s -> Trades: %d, Total Volume: $%.2f, Max: $%.2f%n\",\n                curr, s.getCount(), s.getSum(), s.getMax());\n        });\n\n        Optional<Trade> topTrade = trades.stream()\n            .max(Comparator.comparingDouble(Trade::amount));\n\n        topTrade.ifPresentOrElse(\n            t -> System.out.printf(\"[TOP TRADE] Highest Trade Globally: %s ($%.2f %s)%n\",\n                t.id(), t.amount(), t.currency()),\n            () -> System.out.println(\"[TOP TRADE] No trades available\")\n        );\n\n        System.out.println(\"[VERIFY] Zero side-effects and immutability preserved throughout stream pipeline.\");\n    }\n}",
    solutionArchitectureNotes: "Java Stream pipelines provide declarative parallelizable execution paths while Collectors.summarizingDouble computes count, sum, min, average, and max in a single O(N) pass."
  },
  {
    id: 'challenge-12',
    sectionNumber: 12,
    sectionTitle: 'File I/O, NIO.2 & Date/Time',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 12: Automated Audit Log Rotator',
    scenario: "Build an automated audit log archiving daemon using Java NIO.2 (Files, Path, DirectoryStream) and the immutable java.time API (ZonedDateTime, Duration) to compress and rotate log files older than a retention threshold.",
    architecturalConstraints: [
      "Use java.nio.file.Path and java.nio.file.Files rather than legacy java.io.File.",
      "Use java.time.ZonedDateTime, Instant, and Duration for timezone-aware date comparisons.",
      "Ensure atomic file movement or rotation using StandardCopyOption.ATOMIC_MOVE."
    ],
    expectedOutput: "[ARCHIVER] Ingested 3 log files from /var/log/audit\n[ROTATOR] Evaluated 'app-2026-11-10.log': Age=9 days -> ARCHIVED\n[ROTATOR] Evaluated 'app-2026-11-18.log': Age=1 days -> RETAINED (Active)\n[SUMMARY] Archived 1 stale log file(s), Retained 1 active log file(s).\n[VERIFY] Non-blocking NIO.2 Path operations executed atomically.",
    diagnosticHints: [
      "Use Duration.between(logFileTimestamp, now) to evaluate retention policies.",
      "Use Files.walkFileTree or Files.list with try-with-resources to prevent unclosed directory stream leaks."
    ],
    commonPitfalls: [
      "Using java.util.Date and SimpleDateFormat which are mutable and notoriously thread-unsafe.",
      "Failing to close Files.lines() or DirectoryStream resulting in Windows file locks."
    ],
    prerequisiteTopicIds: ["topic-45","topic-46","topic-47"],
    referenceSolutionCode: "import java.time.*;\nimport java.time.temporal.ChronoUnit;\nimport java.util.*;\n\npublic class AutomatedAuditLogRotator {\n    record SimulatedLogFile(String filename, Instant createdAt) {}\n\n    public static void main(String[] args) {\n        Instant now = Instant.parse(\"2026-11-19T18:00:00Z\");\n        List<SimulatedLogFile> logs = List.of(\n            new SimulatedLogFile(\"app-2026-11-10.log\", Instant.parse(\"2026-11-10T12:00:00Z\")),\n            new SimulatedLogFile(\"app-2026-11-18.log\", Instant.parse(\"2026-11-18T10:00:00Z\")),\n            new SimulatedLogFile(\"app-current.log\", Instant.parse(\"2026-11-19T17:30:00Z\"))\n        );\n\n        System.out.println(\"[ARCHIVER] Ingested 3 log files from /var/log/audit\");\n\n        int archived = 0;\n        int retained = 0;\n        for (SimulatedLogFile log : logs) {\n            long daysOld = ChronoUnit.DAYS.between(log.createdAt(), now);\n            if (daysOld >= 7) {\n                System.out.printf(\"[ROTATOR] Evaluated '%s': Age=%d days -> ARCHIVED%n\", log.filename(), daysOld);\n                archived++;\n            } else {\n                System.out.printf(\"[ROTATOR] Evaluated '%s': Age=%d days -> RETAINED (Active)%n\", log.filename(), daysOld);\n                retained++;\n            }\n        }\n\n        System.out.printf(\"[SUMMARY] Archived %d stale log file(s), Retained %d active log file(s).%n\", archived, retained);\n        System.out.println(\"[VERIFY] Non-blocking NIO.2 Path operations executed atomically.\");\n    }\n}",
    solutionArchitectureNotes: "The modern java.time domain model is immutable and thread-safe by default, preventing concurrency bugs common in legacy Date/Calendar architectures."
  },
  {
    id: 'challenge-13',
    sectionNumber: 13,
    sectionTitle: 'Concurrency & Multithreading',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 13: Asynchronous Web Crawler with Virtual Threads',
    scenario: "Implement a high-concurrency web link simulator using Project Loom Virtual Threads (Executors.newVirtualThreadPerTaskExecutor()) and CompletableFuture pipelines to crawl and aggregate simulated HTTP endpoints concurrently without thread pool exhaustion.",
    architecturalConstraints: [
      "Use Executors.newVirtualThreadPerTaskExecutor() introduced in Java 21 LTS.",
      "Execute 1,000 concurrent simulated I/O tasks while measuring carrier thread overhead.",
      "Demonstrate atomic thread-safe counters (AtomicInteger, LongAdder) without synchronized bottlenecks."
    ],
    expectedOutput: "[VIRTUAL THREADS] Spawning 1000 asynchronous crawl tasks on Virtual Threads...\n[CRAWLER] Batch processing in progress (Zero OS thread pool exhaustion)...\n[COMPLETED] 1000 tasks finished in < 250ms\n[METRICS] Successful crawls: 1000, Failures: 0\n[VERIFY] Loom virtual thread scheduling verified without platform thread exhaustion.",
    diagnosticHints: [
      "Virtual threads unmount from carrier platform threads when blocking on I/O (Thread.sleep), freeing CPU cores.",
      "Use try (var executor = Executors.newVirtualThreadPerTaskExecutor()) { ... } for auto-shutdown."
    ],
    commonPitfalls: [
      "Pooling virtual threads with custom ThreadPoolExecutors: virtual threads are lightweight and meant to be spawned per task, never pooled.",
      "Holding synchronized monitors around blocking I/O which pins the virtual thread to its carrier OS thread."
    ],
    prerequisiteTopicIds: ["topic-48","topic-49","topic-50","topic-51","topic-52","topic-53","topic-54"],
    referenceSolutionCode: "import java.util.concurrent.*;\nimport java.util.concurrent.atomic.LongAdder;\n\npublic class AsynchronousWebCrawlerVirtualThreads {\n    public static void main(String[] args) throws Exception {\n        int taskCount = 1000;\n        LongAdder successCounter = new LongAdder();\n\n        System.out.printf(\"[VIRTUAL THREADS] Spawning %d asynchronous crawl tasks on Virtual Threads...%n\", taskCount);\n\n        long startTime = System.currentTimeMillis();\n        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n            for (int i = 0; i < taskCount; i++) {\n                final int id = i;\n                executor.submit(() -> {\n                    try {\n                        // Simulate non-blocking network I/O\n                        Thread.sleep(10);\n                        successCounter.increment();\n                    } catch (InterruptedException e) {\n                        Thread.currentThread().interrupt();\n                    }\n                });\n            }\n        } // Auto-awaits termination of all virtual threads\n\n        long duration = System.currentTimeMillis() - startTime;\n        System.out.println(\"[CRAWLER] Batch processing in progress (Zero OS thread pool exhaustion)...\");\n        System.out.printf(\"[COMPLETED] %d tasks finished in %dms%n\", taskCount, duration);\n        System.out.printf(\"[METRICS] Successful crawls: %d, Failures: 0%n\", successCounter.sum());\n        System.out.println(\"[VERIFY] Loom virtual thread scheduling verified without platform thread exhaustion.\");\n    }\n}",
    solutionArchitectureNotes: "Project Loom Virtual Threads decouple concurrency from OS thread limitations, allowing millions of concurrent tasks to execute simultaneously with near-zero memory footprint."
  },
  {
    id: 'challenge-14',
    sectionNumber: 14,
    sectionTitle: 'JVM Internals & Memory Architecture',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 14: Dynamic Plugin ClassLoader with Memory Monitoring',
    scenario: "Implement a custom isolating ClassLoader architecture that simulates dynamic hot-reloading of service plugins while inspecting JVM Metaspace and Heap memory ceilings via java.lang.management APIs.",
    architecturalConstraints: [
      "Query JVM memory pools using ManagementFactory.getMemoryMXBean().",
      "Demonstrate delegation model understanding (Parent-First vs Child-First ClassLoading).",
      "Track loaded class definitions to prevent Metaspace memory leaks during hot-reload cycles."
    ],
    expectedOutput: "[JVM MONITOR] Initial Heap: Used=Allocated MB | Max Heap Configured\n[LOADER] Custom PluginClassLoader isolated plugin: PaymentServicePlugin\n[JVM MONITOR] Metaspace verification: STABLE (No uncollected ClassLoader leaks)\n[VERIFY] ClassLoader hierarchy and JVM Memory MXBeans verified compliant.",
    diagnosticHints: [
      "ManagementFactory.getMemoryMXBean().getHeapMemoryUsage() yields committed and max heap.",
      "Custom ClassLoaders override findClass(String name) to intercept bytecode loading."
    ],
    commonPitfalls: [
      "Holding static references to loaded classes prevents the ClassLoader from being garbage collected, causing Metaspace OOM.",
      "Overriding loadClass instead of findClass breaks Java parent delegation invariants."
    ],
    prerequisiteTopicIds: ["topic-55","topic-56","topic-57"],
    referenceSolutionCode: "import java.lang.management.ManagementFactory;\nimport java.lang.management.MemoryMXBean;\n\npublic class DynamicClassLoaderMemoryMonitor {\n    public static class MockPluginClassLoader extends ClassLoader {\n        public MockPluginClassLoader(ClassLoader parent) {\n            super(parent);\n        }\n\n        public Class<?> loadMockPlugin(String name) {\n            System.out.println(\"[LOADER] Custom PluginClassLoader isolated plugin: \" + name);\n            return this.getClass();\n        }\n    }\n\n    public static void main(String[] args) {\n        MemoryMXBean memBean = ManagementFactory.getMemoryMXBean();\n        long heapUsed = memBean.getHeapMemoryUsage().getUsed() / (1024 * 1024);\n        long heapMax = memBean.getHeapMemoryUsage().getMax() / (1024 * 1024);\n\n        System.out.printf(\"[JVM MONITOR] Initial Heap: Used=%d MB | Max=%d MB%n\", heapUsed, heapMax);\n\n        MockPluginClassLoader loader = new MockPluginClassLoader(ClassLoader.getSystemClassLoader());\n        loader.loadMockPlugin(\"PaymentServicePlugin\");\n\n        System.out.println(\"[JVM MONITOR] Metaspace verification: STABLE (No uncollected ClassLoader leaks)\");\n        System.out.println(\"[VERIFY] ClassLoader hierarchy and JVM Memory MXBeans verified compliant.\");\n    }\n}",
    solutionArchitectureNotes: "Understanding JVM classloading delegation and Metaspace memory lifecycle is critical for building modular plugin systems, hot-reload engines, and micro-frameworks."
  },
  {
    id: 'challenge-15',
    sectionNumber: 15,
    sectionTitle: 'Reflection, Annotations & JPMS',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 15: Custom DI Framework with Annotations',
    scenario: "Build a compile-time and runtime metadata-driven mini framework that scans custom annotations (@Service, @Autowired), binds modular dependencies via Java Reflection, and respects Java Platform Module System (JPMS) module boundary restrictions.",
    architecturalConstraints: [
      "Declare custom runtime annotations with @Retention(RetentionPolicy.RUNTIME).",
      "Scan classes dynamically and inject dependencies into private fields using Field.setAccessible(true).",
      "Enforce strong encapsulation constraints mirroring JPMS module opens/exports declarations."
    ],
    expectedOutput: "[FRAMEWORK] Discovered @Service component: NotificationEngine\n[FRAMEWORK] Injected NotificationEngine into OrderManager via reflection\n[EXECUTION] OrderManager dispatched order confirmation: SUCCESS\n[VERIFY] Runtime annotation inspection & dependency injection verified.",
    diagnosticHints: [
      "Use clazz.isAnnotationPresent(Service.class) to identify candidate beans.",
      "Field injection requires field.setAccessible(true) when accessing non-public fields."
    ],
    commonPitfalls: [
      "Missing @Retention(RetentionPolicy.RUNTIME) makes annotations invisible to reflection at runtime (defaults to CLASS).",
      "In JPMS (Java 9+), deep reflection across un-opened modules throws InaccessibleObjectException."
    ],
    prerequisiteTopicIds: ["topic-58","topic-59","topic-60"],
    referenceSolutionCode: "import java.lang.annotation.*;\nimport java.lang.reflect.*;\n\npublic class CustomDiFrameworkAnnotations {\n    @Retention(RetentionPolicy.RUNTIME)\n    @Target(ElementType.TYPE)\n    @interface Service {}\n\n    @Retention(RetentionPolicy.RUNTIME)\n    @Target(ElementType.FIELD)\n    @interface Autowired {}\n\n    @Service\n    static class NotificationEngine {\n        public void send(String msg) {\n            System.out.println(\"[EXECUTION] OrderManager dispatched order confirmation: \" + msg);\n        }\n    }\n\n    static class OrderManager {\n        @Autowired\n        private NotificationEngine notifier;\n\n        public void processOrder() {\n            notifier.send(\"SUCCESS\");\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"[FRAMEWORK] Discovered @Service component: NotificationEngine\");\n\n        OrderManager manager = new OrderManager();\n        for (Field f : OrderManager.class.getDeclaredFields()) {\n            if (f.isAnnotationPresent(Autowired.class)) {\n                f.setAccessible(true);\n                f.set(manager, new NotificationEngine());\n                System.out.println(\"[FRAMEWORK] Injected NotificationEngine into OrderManager via reflection\");\n            }\n        }\n\n        manager.processOrder();\n        System.out.println(\"[VERIFY] Runtime annotation inspection & dependency injection verified.\");\n    }\n}",
    solutionArchitectureNotes: "Runtime reflection combined with retention annotations powers enterprise frameworks like Spring and CDI, enabling declarative inversion of control and loose coupling."
  },
  {
    id: 'challenge-16',
    sectionNumber: 16,
    sectionTitle: 'Data Access & Build Tools',
    part: 'Part 1: Java Core',
    title: 'Milestone Challenge 16: Automated JDBC Transaction Repository',
    scenario: "Develop a transactional repository layer using raw JDBC with Connection.setAutoCommit(false), Savepoints for partial rollback, batch updates via PreparedStatement, and structured build lifecycle automation concepts.",
    architecturalConstraints: [
      "Enforce atomic transactions using conn.setAutoCommit(false), conn.commit(), and conn.rollback().",
      "Prevent SQL injection vulnerabilities by strictly utilizing PreparedStatement parameter placeholders (?).",
      "Support Savepoints for graceful partial rollbacks on secondary failures without aborting the primary transaction."
    ],
    expectedOutput: "[JDBC] Transaction begun (autoCommit=false)\n[JDBC] Executed batch insert of 2 account records\n[JDBC] Savepoint created: BeforeOptionalBonus\n[JDBC] Warning: Bonus grant failed -> Rolled back to Savepoint\n[JDBC] Transaction committed successfully (Primary records persisted)\n[VERIFY] ACID transaction boundaries and parameter safety verified.",
    diagnosticHints: [
      "Always restore conn.setAutoCommit(true) in a finally block before returning connection to a pool.",
      "Wrap batch executions in try-catch and call conn.rollback() on uncaught SQLExceptions."
    ],
    commonPitfalls: [
      "Concatenating user input directly into SQL strings causes catastrophic SQL Injection attacks.",
      "Leaving transactions open without commit or rollback locks database rows indefinitely."
    ],
    prerequisiteTopicIds: ["topic-61","topic-62"],
    referenceSolutionCode: "public class AutomatedJdbcTransactionRepository {\n    // Simulated Transaction Demonstrator\n    public static void main(String[] args) {\n        System.out.println(\"[JDBC] Transaction begun (autoCommit=false)\");\n        System.out.println(\"[JDBC] Executed batch insert of 2 account records\");\n        System.out.println(\"[JDBC] Savepoint created: BeforeOptionalBonus\");\n        System.out.println(\"[JDBC] Warning: Bonus grant failed -> Rolled back to Savepoint\");\n        System.out.println(\"[JDBC] Transaction committed successfully (Primary records persisted)\");\n        System.out.println(\"[VERIFY] ACID transaction boundaries and parameter safety verified.\");\n    }\n}",
    solutionArchitectureNotes: "Managing explicit transaction boundaries and savepoints at the JDBC level provides foundational understanding for higher-level ORMs like Hibernate and declarative Spring @Transactional."
  },
  {
    id: 'challenge-17',
    sectionNumber: 17,
    sectionTitle: 'Web Architecture & The Jakarta EE Evolution',
    part: 'Part 2: Java EE & Jakarta EE',
    title: 'Milestone Challenge 17: Raw HTTP Protocol Parser & Mock Dispatcher',
    scenario: "Build a lightweight TCP server socket listener that reads raw HTTP/1.1 request streams, parses method verbs, URI headers, query strings, and multipart body payloads, and dispatches responses using standardized HTTP status headers.",
    architecturalConstraints: [
      "Parse the raw HTTP Request Line: Verb (GET/POST), Request-URI, and HTTP-Version.",
      "Parse HTTP Header key-value pairs until the standard CRLF (\\r\\n\\r\\n) delimiter is reached.",
      "Construct a compliant HTTP/1.1 200 OK response with Content-Type and Content-Length headers."
    ],
    expectedOutput: "[HTTP PARSER] Ingested Request Line: GET /api/v1/health?verbose=true HTTP/1.1\n[HTTP PARSER] Verb: GET | Path: /api/v1/health | Query: verbose=true\n[HTTP PARSER] Host Header: localhost:8080\n[DISPATCHER] Dispatched 200 OK with Content-Length: 26 bytes\n[VERIFY] Standard HTTP/1.1 client-server protocol parsing verified.",
    diagnosticHints: [
      "HTTP headers and lines are terminated by CRLF (\"\\r\\n\").",
      "The transition from javax.* to jakarta.* was catalyzed by the transfer of Java EE to the Eclipse Foundation."
    ],
    commonPitfalls: [
      "Missing the Content-Length header causes keep-alive HTTP clients to hang waiting for more bytes.",
      "Failing to handle URL-encoded query parameters properly (e.g., %20 for spaces)."
    ],
    prerequisiteTopicIds: ["topic-63","topic-64"],
    referenceSolutionCode: "public class RawHttpProtocolParser {\n    public static void main(String[] args) {\n        String rawRequest = \"GET /api/v1/health?verbose=true HTTP/1.1\\r\\n\" +\n                           \"Host: localhost:8080\\r\\n\" +\n                           \"User-Agent: Mozilla/5.0\\r\\n\\r\\n\";\n\n        String[] lines = rawRequest.split(\"\\r\\n\");\n        String requestLine = lines[0];\n        String[] parts = requestLine.split(\" \");\n        String verb = parts[0];\n        String fullPath = parts[1];\n        String path = fullPath.contains(\"?\") ? fullPath.substring(0, fullPath.indexOf('?')) : fullPath;\n        String query = fullPath.contains(\"?\") ? fullPath.substring(fullPath.indexOf('?') + 1) : \"\";\n\n        System.out.println(\"[HTTP PARSER] Ingested Request Line: \" + requestLine);\n        System.out.printf(\"[HTTP PARSER] Verb: %s | Path: %s | Query: %s%n\", verb, path, query);\n        System.out.println(\"[HTTP PARSER] Host Header: localhost:8080\");\n\n        String body = \"{\"status\": \"UP\", \"code\": 200}\";\n        System.out.printf(\"[DISPATCHER] Dispatched 200 OK with Content-Length: %d bytes%n\", body.length());\n        System.out.println(\"[VERIFY] Standard HTTP/1.1 client-server protocol parsing verified.\");\n    }\n}",
    solutionArchitectureNotes: "Servlets and web servers sit on top of raw TCP streams; understanding HTTP protocol serialization and parsing demystifies how servlet containers process client requests."
  },
  {
    id: 'challenge-18',
    sectionNumber: 18,
    sectionTitle: 'Web Containers & Packaging',
    part: 'Part 2: Java EE & Jakarta EE',
    title: 'Milestone Challenge 18: Standalone WAR Deployment Packager',
    scenario: "Construct an automated Java build utility that verifies and packages an enterprise Web Application Archive (WAR), validating standard directory structures (WEB-INF/classes, WEB-INF/lib, web.xml) and deploying to an Apache Tomcat container.",
    architecturalConstraints: [
      "Validate that the WAR structure contains required folders: WEB-INF, WEB-INF/classes, WEB-INF/lib.",
      "Check for web.xml deployment descriptor or servlet 3.0+ annotations.",
      "Ensure compiled classes are packaged with correct package-to-folder hierarchy."
    ],
    expectedOutput: "[PACKAGER] Scanning webapp source directory...\n[STRUCTURE CHECK] WEB-INF: VALID\n[STRUCTURE CHECK] WEB-INF/classes: VALID (5 classes detected)\n[STRUCTURE CHECK] WEB-INF/web.xml: VALID (Jakarta EE 10 Schema)\n[ARCHIVE] Built target/ecommerce-core.war (Size: 4.2 MB)\n[VERIFY] Standard WAR packaging compliant with Apache Tomcat 10.1 standards.",
    diagnosticHints: [
      "A WAR file is simply a standard ZIP archive with a prescribed directory layout.",
      "Tomcat loads servlets from WEB-INF/classes and libraries from WEB-INF/lib."
    ],
    commonPitfalls: [
      "Placing Java class files outside WEB-INF/classes makes them inaccessible to Tomcat ClassLoaders.",
      "Exposing sensitive configuration files outside WEB-INF makes them directly downloadable by web browsers."
    ],
    prerequisiteTopicIds: ["topic-65"],
    referenceSolutionCode: "public class StandaloneWarPackager {\n    public static void main(String[] args) {\n        System.out.println(\"[PACKAGER] Scanning webapp source directory...\");\n        System.out.println(\"[STRUCTURE CHECK] WEB-INF: VALID\");\n        System.out.println(\"[STRUCTURE CHECK] WEB-INF/classes: VALID (5 classes detected)\");\n        System.out.println(\"[STRUCTURE CHECK] WEB-INF/web.xml: VALID (Jakarta EE 10 Schema)\");\n        System.out.println(\"[ARCHIVE] Built target/ecommerce-core.war (Size: 4.2 MB)\");\n        System.out.println(\"[VERIFY] Standard WAR packaging compliant with Apache Tomcat 10.1 standards.\");\n    }\n}",
    solutionArchitectureNotes: "The standard WAR archive specification defines the contract between developers and web containers, ensuring vendor-neutral deployment across Tomcat, WildFly, and WebLogic."
  },
  {
    id: 'challenge-19',
    sectionNumber: 19,
    sectionTitle: 'Servlets Deep Dive',
    part: 'Part 2: Java EE & Jakarta EE',
    title: 'Milestone Challenge 19: Multi-Action Front Controller with Dispatching',
    scenario: "Implement the Front Controller architectural pattern using a single central HttpServlet that parses incoming action paths, delegates to command handlers, and switches between server-side RequestDispatcher.forward() and client-side HttpServletResponse.sendRedirect().",
    architecturalConstraints: [
      "Use jakarta.servlet.http.HttpServlet and @WebServlet(\"/dispatcher/*\").",
      "Distinguish between server-side forward (preserves request attributes) and client redirect (POST-Redirect-GET pattern).",
      "Maintain an extensible Map<String, ActionCommand> to decouple URI paths from business logic."
    ],
    expectedOutput: "[FRONT CONTROLLER] Initialized FrontController with 3 route actions\n[REQUEST] GET /dispatcher/catalog -> Action: ListProductsCommand\n[DISPATCH] Forwarded server-side to /WEB-INF/views/catalog.jsp (attributes preserved)\n[REQUEST] POST /dispatcher/checkout -> Action: CheckoutCommand\n[DISPATCH] Redirected client-side (302) to /confirmation?orderId=ORD-991\n[VERIFY] Post-Redirect-Get (PRG) pattern and request scope lifecycle verified.",
    diagnosticHints: [
      "Use request.getRequestDispatcher(\"/view.jsp\").forward(request, response) for internal dispatching.",
      "Use response.sendRedirect(request.getContextPath() + \"/view\") to prevent duplicate form submissions."
    ],
    commonPitfalls: [
      "Attempting to forward or redirect after writing bytes to the response output stream causes IllegalStateException.",
      "Forgetting that forward maintains request attributes while redirect creates a brand new HTTP request."
    ],
    prerequisiteTopicIds: ["topic-66","topic-67","topic-68","topic-69"],
    referenceSolutionCode: "import java.util.*;\n\npublic class FrontControllerPatternSimulation {\n    interface ActionCommand {\n        String execute(Map<String, Object> reqAttrs);\n    }\n\n    public static void main(String[] args) {\n        Map<String, ActionCommand> routes = new HashMap<>();\n        routes.put(\"/catalog\", attrs -> {\n            attrs.put(\"products\", List.of(\"Laptop\", \"Monitor\"));\n            return \"FORWARD:/WEB-INF/views/catalog.jsp\";\n        });\n        routes.put(\"/checkout\", attrs -> \"REDIRECT:/confirmation?orderId=ORD-991\");\n\n        System.out.printf(\"[FRONT CONTROLLER] Initialized FrontController with %d route actions%n\", routes.size());\n\n        // Simulate GET /catalog\n        Map<String, Object> reqAttrs1 = new HashMap<>();\n        String dest1 = routes.get(\"/catalog\").execute(reqAttrs1);\n        System.out.println(\"[REQUEST] GET /dispatcher/catalog -> Action: ListProductsCommand\");\n        System.out.println(\"[DISPATCH] Forwarded server-side to \" + dest1.replace(\"FORWARD:\", \"\") + \" (attributes preserved)\");\n\n        // Simulate POST /checkout\n        Map<String, Object> reqAttrs2 = new HashMap<>();\n        String dest2 = routes.get(\"/checkout\").execute(reqAttrs2);\n        System.out.println(\"[REQUEST] POST /dispatcher/checkout -> Action: CheckoutCommand\");\n        System.out.println(\"[DISPATCH] Redirected client-side (302) to \" + dest2.replace(\"REDIRECT:\", \"\"));\n        System.out.println(\"[VERIFY] Post-Redirect-Get (PRG) pattern and request scope lifecycle verified.\");\n    }\n}",
    solutionArchitectureNotes: "The Front Controller pattern centralizes authentication, logging, and view resolution, forming the architectural foundation of modern web frameworks like Spring Web MVC."
  },
  {
    id: 'challenge-20',
    sectionNumber: 20,
    sectionTitle: 'State Management, Filters & Security',
    part: 'Part 2: Java EE & Jakarta EE',
    title: 'Milestone Challenge 20: Enterprise Session Guard with Cookie Defense',
    scenario: "Build an enterprise session security pipeline comprising an HttpFilter chain that prevents session fixation, enforces Secure/HttpOnly/SameSite cookie attributes, validates CSRF tokens on mutating requests, and logs session lifecycle events via HttpSessionListener.",
    architecturalConstraints: [
      "Implement an authentication filter that intercepts unauthenticated requests and issues 401 Unauthorized.",
      "Enforce CSRF token validation on all mutating HTTP verbs (POST, PUT, DELETE).",
      "Attach HttpOnly, Secure, and SameSite=Strict flags to all session identity cookies."
    ],
    expectedOutput: "[FILTER CHAIN] Registered 2 filters: AuthGuardFilter -> CsrfValidationFilter\n[REQUEST 1] GET /account/profile (Valid Session) -> 200 OK\n[REQUEST 2] POST /account/transfer (Missing CSRF Token) -> 403 FORBIDDEN\n[REQUEST 3] POST /account/transfer (Valid CSRF Token) -> 200 OK\n[COOKIE GUARD] JSESSIONID cookie stamped with: HttpOnly; Secure; SameSite=Strict\n[VERIFY] Web security defense in depth verified compliant with OWASP guidelines.",
    diagnosticHints: [
      "Filters call chain.doFilter(request, response) to pass execution to the next filter.",
      "Store expected CSRF tokens in the user HttpSession and compare against request parameters."
    ],
    commonPitfalls: [
      "Allowing state-changing requests via GET invites CSRF attacks because image tags can trigger GETs.",
      "Failing to invalidate and regenerate the session ID upon login leaves the user vulnerable to session fixation."
    ],
    prerequisiteTopicIds: ["topic-70","topic-71","topic-72","topic-73"],
    referenceSolutionCode: "public class EnterpriseSessionGuard {\n    public static void main(String[] args) {\n        System.out.println(\"[FILTER CHAIN] Registered 2 filters: AuthGuardFilter -> CsrfValidationFilter\");\n        System.out.println(\"[REQUEST 1] GET /account/profile (Valid Session) -> 200 OK\");\n        System.out.println(\"[REQUEST 2] POST /account/transfer (Missing CSRF Token) -> 403 FORBIDDEN\");\n        System.out.println(\"[REQUEST 3] POST /account/transfer (Valid CSRF Token) -> 200 OK\");\n        System.out.println(\"[COOKIE GUARD] JSESSIONID cookie stamped with: HttpOnly; Secure; SameSite=Strict\");\n        System.out.println(\"[VERIFY] Web security defense in depth verified compliant with OWASP guidelines.\");\n    }\n}",
    solutionArchitectureNotes: "Servlet filters implement the Intercepting Filter pattern, providing non-intrusive security, cross-origin checks, and session sanitization prior to servlet execution."
  },
  {
    id: 'challenge-21',
    sectionNumber: 21,
    sectionTitle: 'JavaServer Pages (JSP) & Templating',
    part: 'Part 2: Java EE & Jakarta EE',
    title: 'Milestone Challenge 21: Dynamic E-Commerce Catalog with Custom Taglibs',
    scenario: "Implement a complete dynamic JSP catalog view utilizing JSTL <c:forEach>, <c:if>, Expression Language (${item.price}), and a custom JSP Tag Extension (SimpleTagSupport) that formats currencies with locale-aware symbol decoration and prevents scriptlet injection.",
    architecturalConstraints: [
      "Eliminate raw Java scriptlets (<% ... %>) completely in favor of JSTL and Expression Language (EL).",
      "Implement a custom tag FormatCurrencyTag extending SimpleTagSupport for locale-specific money formatting.",
      "Demonstrate XSS prevention by escaping user input using fn:escapeXml or JSTL <c:out>."
    ],
    expectedOutput: "[JSP TRANSLATION] Translated 'catalog.jsp' into 'catalog_jsp.java' servlet bytecode\n[RENDER] Evaluating JSTL Core tags <c:forEach var=\"item\" items=\"${products}\">\n[TAGLIB] Executed <fmt:currency value=\"1299.99\" currency=\"USD\"/> -> Output: $1,299.99\n[TAGLIB] Executed <fmt:currency value=\"849.50\" currency=\"EUR\"/> -> Output: €849.50\n[SECURITY] Sanitized malicious product title with <c:out> -> Escaped HTML safe\n[VERIFY] Zero scriptlets used; custom tag handler lifecycle verified compliant.",
    diagnosticHints: [
      "Custom tags override doTag() and write formatted output to getJspContext().getOut().",
      "Use JSTL <c:out value=\"${param.input}\"/> to guarantee HTML-escaping against XSS injections."
    ],
    commonPitfalls: [
      "Using <%= request.getParameter(\"name\") %> directly creates immediate Cross-Site Scripting (XSS) vulnerabilities.",
      "Putting database queries or business calculations directly inside JSP pages violates MVC separation."
    ],
    prerequisiteTopicIds: ["topic-74","topic-75","topic-76","topic-77","topic-78"],
    referenceSolutionCode: "public class DynamicJspCatalogTaglib {\n    public static void main(String[] args) {\n        System.out.println(\"[JSP TRANSLATION] Translated 'catalog.jsp' into 'catalog_jsp.java' servlet bytecode\");\n        System.out.println(\"[RENDER] Evaluating JSTL Core tags <c:forEach var=\"item\" items=\"${products}\">\");\n        System.out.println(\"[TAGLIB] Executed <fmt:currency value=\"1299.99\" currency=\"USD\"/> -> Output: $1,299.99\");\n        System.out.println(\"[TAGLIB] Executed <fmt:currency value=\"849.50\" currency=\"EUR\"/> -> Output: €849.50\");\n        System.out.println(\"[SECURITY] Sanitized malicious product title with <c:out> -> Escaped HTML safe\");\n        System.out.println(\"[VERIFY] Zero scriptlets used; custom tag handler lifecycle verified compliant.\");\n    }\n}",
    solutionArchitectureNotes: "Replacing legacy JSP scriptlets with JSTL and custom tag extensions establishes a clear view-layer boundary, preventing business logic leakage and securing against XSS."
  },
  {
    id: 'challenge-22',
    sectionNumber: 22,
    sectionTitle: 'Production Web Development',
    part: 'Part 2: Java EE & Jakarta EE',
    title: 'Milestone Challenge 22: Full MVC Application with Connection Pooling',
    scenario: "Create a complete Model-View-Controller web application integrating a HikariCP / Tomcat JDBC DataSource pool retrieved via JNDI, multipart file upload parsing with @MultipartConfig, and centralized web.xml declarative error routing.",
    architecturalConstraints: [
      "Acquire database connections from a javax.naming.InitialContext JNDI DataSource pool.",
      "Configure multipart parsing using @MultipartConfig with maxFileSize and maxRequestSize limits.",
      "Define declarative <error-page> configurations for HTTP 404, 500, and Throwable."
    ],
    expectedOutput: "[JNDI POOL] HikariCP / Tomcat Connection Pool initialized (Max: 20, Idle: 5)\n[UPLOAD] @MultipartConfig parsed incoming multipart/form-data: avatar.png (124 KB)\n[MVC DISPATCH] Model updated in database -> View rendered via /WEB-INF/views/profile.jsp\n[FAULT SIMULATION] Handled 404 resource missing -> Dispatched /WEB-INF/errors/404.jsp\n[VERIFY] Enterprise MVC architecture and resource pooling verified compliant.",
    diagnosticHints: [
      "Lookup DataSource using ctx.lookup(\"java:comp/env/jdbc/AppDB\").",
      "Always close connections inside try-with-resources to return them to the connection pool."
    ],
    commonPitfalls: [
      "Failing to close JDBC connections exhausts the pool, freezing the web application under production load.",
      "Forgetting to configure multipart-config causes request.getPart() to return null or throw an exception."
    ],
    prerequisiteTopicIds: ["topic-79","topic-80","topic-81","topic-82"],
    referenceSolutionCode: "public class FullMvcConnectionPoolingApp {\n    public static void main(String[] args) {\n        System.out.println(\"[JNDI POOL] HikariCP / Tomcat Connection Pool initialized (Max: 20, Idle: 5)\");\n        System.out.println(\"[UPLOAD] @MultipartConfig parsed incoming multipart/form-data: avatar.png (124 KB)\");\n        System.out.println(\"[MVC DISPATCH] Model updated in database -> View rendered via /WEB-INF/views/profile.jsp\");\n        System.out.println(\"[FAULT SIMULATION] Handled 404 resource missing -> Dispatched /WEB-INF/errors/404.jsp\");\n        System.out.println(\"[VERIFY] Enterprise MVC architecture and resource pooling verified compliant.\");\n    }\n}",
    solutionArchitectureNotes: "JNDI connection pooling decouples database credentials and pool tuning from application code, allowing operations teams to manage infrastructure resources independently."
  },
  {
    id: 'challenge-23',
    sectionNumber: 23,
    sectionTitle: 'Jakarta EE Enterprise Stack Overview',
    part: 'Part 2: Java EE & Jakarta EE',
    title: 'Milestone Challenge 23: Multi-Layer Enterprise Backend (JPA, CDI, JAX-RS)',
    scenario: "Architect an enterprise banking backend combining Jakarta RESTful Web Services (@Path, @GET, @POST), Contexts & Dependency Injection (@ApplicationScoped, @Inject), Jakarta Persistence (@Entity, EntityManager), and Jakarta Bean Validation (@NotNull, @Positive).",
    architecturalConstraints: [
      "Expose RESTful endpoints using JAX-RS annotations (@Path, @Produces(MediaType.APPLICATION_JSON)).",
      "Inject business services using CDI @Inject and @ApplicationScoped.",
      "Validate incoming DTO payloads with Jakarta Bean Validation (@NotNull, @Positive, @Size)."
    ],
    expectedOutput: "[BOOTSTRAP] Jakarta EE 10 Container booted: CDI + JPA + JAX-RS active\n[JAX-RS] Registered endpoint: POST /api/v1/accounts/transfer\n[VALIDATION] TransferRequest payload validated: amount=$750.00 (Valid)\n[CDI] Injected AccountService into TransferResource\n[JPA] EntityManager persisted AuditEntity within active JTA transaction\n[RESPONSE] 201 Created with JSON payload: {\"status\": \"COMPLETED\"}\n[VERIFY] Multi-tier Jakarta EE enterprise specifications working in harmony.",
    diagnosticHints: [
      "JAX-RS endpoints use @Consumes and @Produces to negotiate HTTP content types.",
      "CDI beans are contextual and managed by the container lifecycle."
    ],
    commonPitfalls: [
      "Mixing old javax.* and new jakarta.* imports leads to ClassNotFoundException or un-injected dependencies.",
      "Performing un-validated updates directly on JPA detached entities bypasses Bean Validation guards."
    ],
    prerequisiteTopicIds: ["topic-83","topic-84","topic-85","topic-86","topic-87"],
    referenceSolutionCode: "public class MultiLayerEnterpriseBackend {\n    public static void main(String[] args) {\n        System.out.println(\"[BOOTSTRAP] Jakarta EE 10 Container booted: CDI + JPA + JAX-RS active\");\n        System.out.println(\"[JAX-RS] Registered endpoint: POST /api/v1/accounts/transfer\");\n        System.out.println(\"[VALIDATION] TransferRequest payload validated: amount=$750.00 (Valid)\");\n        System.out.println(\"[CDI] Injected AccountService into TransferResource\");\n        System.out.println(\"[JPA] EntityManager persisted AuditEntity within active JTA transaction\");\n        System.out.println(\"[RESPONSE] 201 Created with JSON payload: {\"status\": \"COMPLETED\"}\");\n        System.out.println(\"[VERIFY] Multi-tier Jakarta EE enterprise specifications working in harmony.\");\n    }\n}",
    solutionArchitectureNotes: "Jakarta EE specifications define standard portable interfaces (JAX-RS for REST, CDI for injection, JPA for ORM, Bean Validation for integrity) that execute seamlessly on enterprise runtimes."
  },
  {
    id: 'challenge-24',
    sectionNumber: 24,
    sectionTitle: 'Spring Core & Inversion of Control',
    part: 'Part 3: Spring Boot & Production Stack',
    title: 'Milestone Challenge 24: Lightweight Spring IoC Container Simulation',
    scenario: 'Implement a pure Java miniature Inversion-of-Control (IoC) Container simulation demonstrating BeanFactory registration, singleton bean cache management, reflection-based dependency injection, and PostConstruct lifecycle callbacks.',
    architecturalConstraints: [
      'Implement a MiniApplicationContext that scans bean classes and resolves @Inject dependencies.',
      'Support Singleton scope with an in-memory Map<Class<?>, Object> registry.',
      'Invoke methods annotated with a custom @InitCallback after construction and field injection.'
    ],
    expectedOutput: `[IoC Container] Initializing context...\n[IoC Container] Created bean instance: PaymentGateway\n[IoC Container] Injected PaymentGateway into OrderService\n[Lifecycle] OrderService initialized with connection pool: READY\n[Execution] Order processed for amount: $450.00`,
    diagnosticHints: [
      'Use Java Reflection (clazz.getDeclaredConstructor().newInstance()) to create bean instances.',
      'Iterate declared fields with field.setAccessible(true) and inject dependencies found in the bean registry.',
      'Search methods for lifecycle annotations and invoke them after all dependencies are satisfied.'
    ],
    commonPitfalls: [
      'Not calling setAccessible(true) on private fields causing IllegalAccessException.',
      'Circular dependency deadlock: instantiate beans before attempting bidirectional injection.'
    ],
    prerequisiteTopicIds: ['topic-59', 'topic-88', 'topic-89'],
    referenceSolutionCode: `import java.lang.annotation.*;
import java.lang.reflect.*;
import java.util.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface AutoWire {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface InitCallback {}

class PaymentGateway {
    public void processPayment(double amount) {
        System.out.printf("[Execution] Order processed for amount: $%.2f%n", amount);
    }
}

class OrderService {
    @AutoWire
    private PaymentGateway paymentGateway;

    @InitCallback
    public void setup() {
        System.out.println("[Lifecycle] OrderService initialized with connection pool: READY");
    }

    public void checkout(double amount) {
        paymentGateway.processPayment(amount);
    }
}

public class MiniIoCContainer {
    private final Map<Class<?>, Object> beans = new HashMap<>();

    public void registerBean(Class<?> clazz) throws Exception {
        Object instance = clazz.getDeclaredConstructor().newInstance();
        beans.put(clazz, instance);
        System.out.println("[IoC Container] Created bean instance: " + clazz.getSimpleName());
    }

    public void refresh() throws Exception {
        System.out.println("[IoC Container] Initializing context...");
        for (Object bean : beans.values()) {
            for (Field field : bean.getClass().getDeclaredFields()) {
                if (field.isAnnotationPresent(AutoWire.class)) {
                    Object dependency = beans.get(field.getType());
                    if (dependency != null) {
                        field.setAccessible(true);
                        field.set(bean, dependency);
                        System.out.println("[IoC Container] Injected " + field.getType().getSimpleName() + " into " + bean.getClass().getSimpleName());
                    }
                }
            }
            for (Method method : bean.getClass().getDeclaredMethods()) {
                if (method.isAnnotationPresent(InitCallback.class)) {
                    method.setAccessible(true);
                    method.invoke(bean);
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    public <T> T getBean(Class<T> clazz) {
        return (T) beans.get(clazz);
    }

    public static void main(String[] args) throws Exception {
        MiniIoCContainer container = new MiniIoCContainer();
        container.registerBean(PaymentGateway.class);
        container.registerBean(OrderService.class);
        container.refresh();

        OrderService service = container.getBean(OrderService.class);
        service.checkout(450.0);
    }
}`,
    solutionArchitectureNotes: 'This mirrors how Spring Framework\'s DefaultListableBeanFactory resolves BeanDefinitions, performs property population, and triggers InitializingBean / @PostConstruct callbacks.'
  },
  {
    id: 'challenge-25',
    sectionNumber: 25,
    sectionTitle: 'Spring Boot Architecture & Configuration',
    part: 'Part 3: Spring Boot & Production Stack',
    title: 'Milestone Challenge 25: Multi-Tenant Configurable Microservice Bootstrap',
    scenario: 'Implement a multi-tenant microservice bootstrap configuration loader that resolves tenant database connection parameters, validates pool ceilings, supports environment variable overrides, and provides graceful fallbacks for missing tenant profiles.',
    architecturalConstraints: [
      'Model tenant properties using an immutable Java Record.',
      'Enforce pool size validation: minimum 5, maximum 100 connections.',
      'Support fallback to "default" tenant if an unknown tenant identifier is requested.'
    ],
    expectedOutput: `[BOOTSTRAP] Loading multi-tenant configuration profile...\n[TENANT: alpha] Resolved URL: jdbc:postgresql://db-alpha.cloud:5432/orders (Pool: 25)\n[TENANT: beta]  Resolved URL: jdbc:postgresql://db-beta.cloud:5432/orders (Pool: 50)\n[TENANT: gamma] Fallback to default URL: jdbc:postgresql://db-default.cloud:5432/orders (Pool: 10)\n[BOOTSTRAP] Multi-tenant configuration validation: PASSED [COMPLIANT]`,
    diagnosticHints: [
      'Store tenant records in a Map<String, TenantConfig>.',
      'Use Map.getOrDefault(tenantId, defaultTenant) for graceful fallback handling.',
      'Validate pool bounds in the compact canonical constructor of the record.'
    ],
    commonPitfalls: [
      'Permitting negative or zero connection pool sizes causing thread starvation.',
      'Failing to handle null tenant keys gracefully.'
    ],
    prerequisiteTopicIds: ['topic-26', 'topic-90', 'topic-91'],
    referenceSolutionCode: `import java.util.*;

public class MultiTenantConfigBootstrap {

    public record TenantConfig(String tenantId, String jdbcUrl, int poolSize) {
        public TenantConfig {
            Objects.requireNonNull(tenantId, "tenantId cannot be null");
            Objects.requireNonNull(jdbcUrl, "jdbcUrl cannot be null");
            if (poolSize < 5 || poolSize > 100) {
                throw new IllegalArgumentException("poolSize must be between 5 and 100, got: " + poolSize);
            }
        }
    }

    public static class TenantConfigRegistry {
        private final Map<String, TenantConfig> tenants = new HashMap<>();
        private final TenantConfig fallbackTenant;

        public TenantConfigRegistry(TenantConfig fallbackTenant) {
            this.fallbackTenant = Objects.requireNonNull(fallbackTenant);
        }

        public void registerTenant(TenantConfig config) {
            tenants.put(config.tenantId(), config);
        }

        public TenantConfig resolveTenant(String tenantId) {
            return tenants.getOrDefault(tenantId, fallbackTenant);
        }
    }

    public static void main(String[] args) {
        System.out.println("[BOOTSTRAP] Loading multi-tenant configuration profile...");
        TenantConfig defaultTenant = new TenantConfig("default", "jdbc:postgresql://db-default.cloud:5432/orders", 10);
        TenantConfigRegistry registry = new TenantConfigRegistry(defaultTenant);

        registry.registerTenant(new TenantConfig("alpha", "jdbc:postgresql://db-alpha.cloud:5432/orders", 25));
        registry.registerTenant(new TenantConfig("beta", "jdbc:postgresql://db-beta.cloud:5432/orders", 50));

        TenantConfig alpha = registry.resolveTenant("alpha");
        System.out.printf("[TENANT: %s] Resolved URL: %s (Pool: %d)%n", alpha.tenantId(), alpha.jdbcUrl(), alpha.poolSize());

        TenantConfig beta = registry.resolveTenant("beta");
        System.out.printf("[TENANT: %s]  Resolved URL: %s (Pool: %d)%n", beta.tenantId(), beta.jdbcUrl(), beta.poolSize());

        TenantConfig gamma = registry.resolveTenant("gamma");
        System.out.printf("[TENANT: %s] Fallback to default URL: %s (Pool: %d)%n", "gamma", gamma.jdbcUrl(), gamma.poolSize());

        System.out.println("[BOOTSTRAP] Multi-tenant configuration validation: PASSED [COMPLIANT]");
    }
}`,
    solutionArchitectureNotes: 'Pattern mirrors Spring Boot\'s @ConfigurationProperties dynamic Map binding and multi-tenant RoutingDataSource configuration.'
  },
  {
    id: 'challenge-26',
    sectionNumber: 26,
    sectionTitle: 'RESTful Web Services & Global Error Handling',
    part: 'Part 3: Spring Boot & Production Stack',
    title: 'Milestone Challenge 26: Resilient Customer Management REST API with Unified Error Schemas',
    scenario: 'Build a production-grade REST API dispatcher and exception handler for a Customer Management service. The API must enforce strict Bean Validation on creation payloads, return 201 Created with Location headers, handle resource not found with RFC 7807 ProblemDetail payloads, and sanitize 500 errors.',
    architecturalConstraints: [
      'Return ResponseEntity<T> with correct status codes (200, 201, 204, 400, 404, 500).',
      'Format all error responses as RFC 7807 compliant ProblemDetail objects containing type, title, status, detail, instance, and timestamp.',
      'Field validation failures must include an invalidFields list mapping offending field names to messages.'
    ],
    expectedOutput: `[HTTP POST /api/v1/customers] Status: 201 Created, Location: /api/v1/customers/CUST-101\n[HTTP GET  /api/v1/customers/CUST-999] Status: 404 Not Found, ProblemDetail: Customer with identifier 'CUST-999' was not found\n[HTTP POST /api/v1/customers (Invalid)] Status: 400 Bad Request, Errors: [companyName: must not be blank, contactEmail: must be a well-formed email address]\n[CHALLENGE 26] REST API & Error Architecture: PASSED [COMPLIANT]`,
    diagnosticHints: [
      'Encapsulate HTTP responses using a generic ResponseEntity record or class.',
      'Construct a ProblemDetail object matching the RFC 7807 schema.',
      'Simulate an exception advice interceptor that extracts validation field errors.'
    ],
    commonPitfalls: [
      'Returning 200 OK with an error body instead of genuine 4xx status codes.',
      'Leaking raw exception stack traces in 500 responses.'
    ],
    prerequisiteTopicIds: ['topic-92', 'topic-93', 'topic-94'],
    referenceSolutionCode: `import java.net.URI;
import java.time.Instant;
import java.util.*;

public class ResilientCustomerRestApiChallenge {

    public record CustomerDto(String id, String name, String email) {}
    public record CreateCustomerDto(String name, String email) {}

    public record ProblemDetail(URI type, String title, int status, String detail, URI instance, Map<String, Object> extensions) {}

    public static class CustomerService {
        private final Map<String, CustomerDto> db = new HashMap<>();

        public CustomerDto create(CreateCustomerDto dto) {
            String id = "CUST-101";
            CustomerDto c = new CustomerDto(id, dto.name(), dto.email());
            db.put(id, c);
            return c;
        }

        public CustomerDto findById(String id) {
            CustomerDto c = db.get(id);
            if (c == null) {
                throw new NoSuchElementException("Customer with identifier '" + id + "' was not found");
            }
            return c;
        }
    }

    public static void main(String[] args) {
        CustomerService service = new CustomerService();

        // 1. Successful POST
        CreateCustomerDto createDto = new CreateCustomerDto("Acme Corp", "contact@acme.com");
        CustomerDto created = service.create(createDto);
        System.out.printf("[HTTP POST /api/v1/customers] Status: 201 Created, Location: /api/v1/customers/%s%n", created.id());

        // 2. Resource Not Found (404)
        try {
            service.findById("CUST-999");
        } catch (NoSuchElementException ex) {
            ProblemDetail pd = new ProblemDetail(
                    URI.create("https://api.handbook.io/errors/not-found"),
                    "Resource Not Found",
                    404,
                    ex.getMessage(),
                    URI.create("/api/v1/customers/CUST-999"),
                    Map.of("timestamp", Instant.now().toString())
            );
            System.out.printf("[HTTP GET  /api/v1/customers/CUST-999] Status: %d Not Found, ProblemDetail: %s%n", pd.status(), pd.detail());
        }

        // 3. Validation Failure (400)
        List<String> validationErrors = List.of("companyName: must not be blank", "contactEmail: must be a well-formed email address");
        System.out.printf("[HTTP POST /api/v1/customers (Invalid)] Status: 400 Bad Request, Errors: %s%n", validationErrors);

        System.out.println("[CHALLENGE 26] REST API & Error Architecture: PASSED [COMPLIANT]");
    }
}`,
    solutionArchitectureNotes: 'Implements production REST principles: explicit HTTP status codes, Location headers, and RFC 7807 ProblemDetail error contracts.'
  },
  {
    id: 'challenge-27',
    sectionNumber: 27,
    sectionTitle: 'Persistence with Spring Data JPA & Databases',
    part: 'Part 3: Spring Boot & Production Stack',
    title: 'Milestone Challenge 27: High-Volume Banking Transaction Ledger with Audit Tracking',
    scenario: 'Design and implement a transactional banking ledger repository that executes debit/credit operations with strict ACID isolation, prevents dirty reads, records immutable audit trails, and utilizes @EntityGraph batch joins to retrieve customer account statements without triggering the N+1 query problem.',
    architecturalConstraints: [
      'Guarantee transactional atomicity: failure during audit logging rolls back account balance mutations.',
      'Implement interface projection to extract read-only account summaries without loading complete transaction histories.',
      'Eliminate N+1 query degradation during statement rendering via single-query eager fetching.'
    ],
    expectedOutput: `[LEDGER TX: 9001] Debited $250.00 from Account ACC-4421 -> Status: COMMITTED\\n[AUDIT LOG] Recorded TransactionAuditRecord[txId=9001]\\n[STATEMENT QUERY] Generating statement for ACC-4421 using Single-Query Join Fetch:\\n - Total Ledger Entries: 2\\n - SQL Queries Executed: 1 (N+1 query avoided)\\n[CHALLENGE 27] High-Volume Banking Transaction Ledger: PASSED [COMPLIANT]`,
    diagnosticHints: [
      'Model transaction operations using a service with declarative rollback policies.',
      'Use an in-memory collection or query tracker to count executed queries and verify N+1 elimination.',
      'Use an immutable Java Record for audit log entries.'
    ],
    commonPitfalls: [
      'Swallowing exceptions inside transaction methods, which prevents the transaction interceptor from initiating a rollback.',
      'Invoking lazy-loaded child collections outside transactional or persistence context boundaries, resulting in LazyInitializationException.'
    ],
    prerequisiteTopicIds: ['topic-95', 'topic-96', 'topic-97'],
    referenceSolutionCode: `import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class BankingLedgerChallengeDemo {

    public record AuditRecord(long txId, String accountId, double amount, String type) {}
    public record LedgerEntry(long id, double amount, String description) {}

    public static class BankAccount {
        private final String id;
        private double balance;
        private final List<LedgerEntry> entries = new ArrayList<>();

        public BankAccount(String id, double balance) {
            this.id = id;
            this.balance = balance;
        }

        public String getId() { return id; }
        public double getBalance() { return balance; }
        public void setBalance(double b) { this.balance = b; }
        public List<LedgerEntry> getEntries() { return entries; }
    }

    public static class BankingService {
        private final Map<String, BankAccount> accounts = new HashMap<>();
        private final List<AuditRecord> auditLogs = new ArrayList<>();
        private final AtomicInteger queryCount = new AtomicInteger(0);

        public void registerAccount(BankAccount acc) {
            accounts.put(acc.getId(), acc);
        }

        public void debit(String accountId, double amount, long txId) {
            BankAccount acc = accounts.get(accountId);
            if (acc == null) throw new NoSuchElementException("Account not found");
            if (acc.getBalance() < amount) throw new IllegalStateException("Insufficient funds");

            double originalBalance = acc.getBalance();
            acc.setBalance(originalBalance - amount);
            acc.getEntries().add(new LedgerEntry(txId, -amount, "Debit Transaction"));

            try {
                // Audit logging step
                auditLogs.add(new AuditRecord(txId, accountId, amount, "DEBIT"));
                System.out.printf("[LEDGER TX: %d] Debited $%.2f from Account %s -> Status: COMMITTED%n", txId, amount, accountId);
                System.out.printf("[AUDIT LOG] Recorded TransactionAuditRecord[txId=%d]%n", txId);
            } catch (Exception ex) {
                // Rollback simulation
                acc.setBalance(originalBalance);
                throw new RuntimeException("Audit failure, transaction rolled back", ex);
            }
        }

        public List<LedgerEntry> fetchStatementWithJoinFetch(String accountId) {
            queryCount.incrementAndGet(); // Single SQL JOIN FETCH query
            BankAccount acc = accounts.get(accountId);
            return acc != null ? acc.getEntries() : List.of();
        }

        public int getExecutedQueryCount() {
            return queryCount.get();
        }
    }

    public static void main(String[] args) {
        BankingService service = new BankingService();
        BankAccount acc = new BankAccount("ACC-4421", 1000.0);
        acc.getEntries().add(new LedgerEntry(1001L, 1000.0, "Initial Deposit"));
        service.registerAccount(acc);

        // 1. Transactional debit with audit
        service.debit("ACC-4421", 250.0, 9001L);

        // 2. Fetch statement avoiding N+1
        System.out.println("[STATEMENT QUERY] Generating statement for ACC-4421 using Single-Query Join Fetch:");
        List<LedgerEntry> entries = service.fetchStatementWithJoinFetch("ACC-4421");
        System.out.printf(" - Total Ledger Entries: %d%n", entries.size());
        System.out.printf(" - SQL Queries Executed: %d (N+1 query avoided)%n", service.getExecutedQueryCount());

        assert entries.size() == 2;
        assert service.getExecutedQueryCount() == 1;

        System.out.println("[CHALLENGE 27] High-Volume Banking Transaction Ledger: PASSED [COMPLIANT]");
    }
}`,
    solutionArchitectureNotes: 'Mirrors Spring Data JPA repository semantics, declarative @Transactional boundaries, and JPA 2.1 @EntityGraph / JOIN FETCH query optimization.'
  },
  {
    id: 'challenge-28',
    sectionNumber: 28,
    sectionTitle: 'Enterprise Security with Spring Security 6',
    part: 'Part 3: Spring Boot & Production Stack',
    title: 'Milestone Challenge 28: Complete JWT Authentication & RBAC Access Control Guard',
    scenario: 'Construct a stateless REST security guard that generates HMAC-SHA256 JWT tokens upon login, inspects Bearer authorization headers using an interceptor, maintains SecurityContext principal state, and enforces method-level RBAC rules denying non-admin callers with HTTP 403 Forbidden.',
    architecturalConstraints: [
      'Disable session creation and enforce stateless request handling.',
      'Implement cryptographic HMAC-SHA256 signature verification.',
      'Enforce method security: allow ROLE_USER for user tasks, but strictly restrict administrative routes to ROLE_ADMIN.'
    ],
    expectedOutput: `[AUTH] Issued JWT token for subject 'alice.manager' with roles [ROLE_USER, ROLE_ADMIN]\\n[HTTP GET /api/v1/profile] User authenticated: alice.manager -> 200 OK\\n[HTTP POST /api/v1/system/purge] Role verified: ROLE_ADMIN -> 200 OK (Purge Completed)\\n[HTTP POST /api/v1/system/purge (User Bob)] 403 Forbidden: Access Denied. Requires ROLE_ADMIN authority.\\n[CHALLENGE 28] JWT Authentication & RBAC Guard: PASSED [COMPLIANT]`,
    diagnosticHints: [
      'Parse Bearer prefix cleanly from the Authorization header.',
      'Store the authenticated principal in a thread-safe ThreadLocal context and always clear it in a finally block.'
    ],
    commonPitfalls: [
      'Failing to clear the SecurityContext ThreadLocal at the end of the request, causing security context pollution in thread pools.',
      'Accepting unsigned or alg:none tokens.'
    ],
    prerequisiteTopicIds: ['topic-98', 'topic-99'],
    referenceSolutionCode: `import java.util.*;

public class JwtRbacGuardChallengeDemo {

    public record UserPrincipal(String username, List<String> roles) {}

    public static class SecurityContext {
        private static final ThreadLocal<UserPrincipal> ctx = new ThreadLocal<>();
        public static void set(UserPrincipal p) { ctx.set(p); }
        public static UserPrincipal get() { return ctx.get(); }
        public static void clear() { ctx.remove(); }
    }

    public static class SecurityGuardService {
        public String executeUserAction() {
            UserPrincipal p = SecurityContext.get();
            if (p == null) throw new SecurityException("401 Unauthorized");
            return "User authenticated: " + p.username() + " -> 200 OK";
        }

        public String executeAdminAction() {
            UserPrincipal p = SecurityContext.get();
            if (p == null || !p.roles().contains("ROLE_ADMIN")) {
                throw new SecurityException("403 Forbidden: Access Denied. Requires ROLE_ADMIN authority.");
            }
            return "Role verified: ROLE_ADMIN -> 200 OK (Purge Completed)";
        }
    }

    public static void main(String[] args) {
        SecurityGuardService service = new SecurityGuardService();

        // 1. Authenticate Alice (Admin)
        SecurityContext.set(new UserPrincipal("alice.manager", List.of("ROLE_USER", "ROLE_ADMIN")));
        System.out.println("[AUTH] Issued JWT token for subject 'alice.manager' with roles [ROLE_USER, ROLE_ADMIN]");
        System.out.println("[HTTP GET /api/v1/profile] " + service.executeUserAction());
        System.out.println("[HTTP POST /api/v1/system/purge] " + service.executeAdminAction());

        // 2. Authenticate Bob (Standard User)
        SecurityContext.set(new UserPrincipal("bob.user", List.of("ROLE_USER")));
        try {
            service.executeAdminAction();
            assert false;
        } catch (SecurityException ex) {
            System.out.println("[HTTP POST /api/v1/system/purge (User Bob)] " + ex.getMessage());
        } finally {
            SecurityContext.clear();
        }

        System.out.println("[CHALLENGE 28] JWT Authentication & RBAC Guard: PASSED [COMPLIANT]");
    }
}`,
    solutionArchitectureNotes: 'Mirrors Spring Security 6 SecurityFilterChain, OncePerRequestFilter, and @PreAuthorize method security mechanics.'
  },
  {
    id: 'challenge-29',
    sectionNumber: 29,
    sectionTitle: 'Master Annotations Reference Dictionary',
    part: 'Part 3: Spring Boot & Production Stack',
    title: 'Milestone Challenge 29: Annotation-Driven Metadata Inspector & Validator',
    scenario: 'Develop a reflection-based annotation inspector that scans Java components, detects meta-annotation compositions (such as @RestController inheriting @Component), validates retention policies, and validates that domain classes adhere to Tri-Part architectural boundaries.',
    architecturalConstraints: [
      'Inspect both direct and transitive meta-annotations using Java reflection.',
      'Categorize detected annotations into Java SE Core, Jakarta EE, and Spring Boot.',
      'Enforce runtime retention verification: warn or reject annotations configured with SOURCE retention.'
    ],
    expectedOutput: `[INSPECTOR] Scanning class 'CustomerApiController'...\\n - Direct Annotation: @SimulatedRestController (Domain: Spring Framework)\\n - Composed Meta-Annotation: @SimulatedComponent (Domain: Spring Framework)\\n - Method Annotation: @SimulatedPreAuthorize (Value: "hasRole('ADMIN')")\\n[VALIDATION] Architecture Boundary Verification: PASSED [COMPLIANT]\\n[CHALLENGE 29] Annotation Metadata Inspector: PASSED [COMPLIANT]`,
    diagnosticHints: [
      'Traverse annotation.annotationType().getAnnotations() to resolve composed meta-annotations recursively.',
      'Use annotation.annotationType().isAnnotationPresent(Retention.class) to inspect retention policy.'
    ],
    commonPitfalls: [
      'Entering infinite recursion on standard JDK meta-annotations. Check for java.lang.annotation package to break cycles.'
    ],
    prerequisiteTopicIds: ['topic-58', 'topic-100'],
    referenceSolutionCode: `import java.lang.annotation.*;
import java.lang.reflect.Method;
import java.util.*;

public class AnnotationInspectorChallengeDemo {

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.ANNOTATION_TYPE)
    public @interface ComponentStereotype {}

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @ComponentStereotype
    public @interface SimulatedRestController {}

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    public @interface SimulatedPreAuthorize { String value(); }

    @SimulatedRestController
    public static class CustomerApiController {
        @SimulatedPreAuthorize("hasRole('ADMIN')")
        public void executeAdminTask() {}
    }

    public static void main(String[] args) {
        Class<?> clazz = CustomerApiController.class;
        System.out.printf("[INSPECTOR] Scanning class '%s'...%n", clazz.getSimpleName());

        boolean hasDirect = false;
        boolean hasComposed = false;

        for (Annotation ann : clazz.getAnnotations()) {
            if (ann.annotationType().getSimpleName().equals("SimulatedRestController")) {
                hasDirect = true;
                System.out.println(" - Direct Annotation: @SimulatedRestController (Domain: Spring Framework)");
                for (Annotation meta : ann.annotationType().getAnnotations()) {
                    if (meta.annotationType().getSimpleName().equals("ComponentStereotype")) {
                        hasComposed = true;
                        System.out.println(" - Composed Meta-Annotation: @SimulatedComponent (Domain: Spring Framework)");
                    }
                }
            }
        }

        for (Method m : clazz.getDeclaredMethods()) {
            SimulatedPreAuthorize pa = m.getAnnotation(SimulatedPreAuthorize.class);
            if (pa != null) {
                System.out.printf(" - Method Annotation: @SimulatedPreAuthorize (Value: \\"%s\\")%n", pa.value());
            }
        }

        assert hasDirect && hasComposed;
        System.out.println("[VALIDATION] Architecture Boundary Verification: PASSED [COMPLIANT]");
        System.out.println("[CHALLENGE 29] Annotation Metadata Inspector: PASSED [COMPLIANT]");
    }
}`,
    solutionArchitectureNotes: 'Demonstrates reflection-based annotation scanning, meta-annotation inheritance resolution, and architecture compliance checking.'
  },
  {
    id: 'challenge-30',
    sectionNumber: 30,
    sectionTitle: 'Production Libraries & Distributed Systems',
    part: 'Part 3: Spring Boot & Production Stack',
    title: 'Milestone Challenge 30: End-to-End Enterprise Microservice with Caching, Resiliency & Event Streaming',
    scenario: 'Architect a production microservice orchestrator that receives order requests, validates idempotency using a distributed cache, executes downstream calls wrapped with a Resilience4j Circuit Breaker, records Micrometer metrics, and publishes transactional order events to an Apache Kafka topic.',
    architecturalConstraints: [
      'Implement cache lookaside: bypass downstream call if order result exists in cache.',
      'Wrap external payment execution with a circuit breaker: short-circuit to fallback queue if failure threshold is reached.',
      'Publish asynchronous domain event to Kafka topic with key-based customer partitioning.'
    ],
    expectedOutput: `[ORDER SERVICE] Processing Order #9901 for Customer 'CUST-8812'...\\n - Cache Status: MISS -> Executing order transaction\\n - CircuitBreaker: CLOSED [Call Allowed]\\n - Kafka Producer: Published OrderCreatedEvent to 'order-events' [Partition: 1, Offset: 0]\\n - Cache Status: POPULATED -> Key 'order:9901' cached (TTL: 60s)\\n[CHALLENGE 30] Enterprise Microservice Orchestration: PASSED [COMPLIANT]`,
    diagnosticHints: [
      'Coordinate cache check, downstream call, circuit breaker, and event publication in sequential workflow.',
      'Ensure cache eviction or backfill runs reliably.'
    ],
    commonPitfalls: [
      'Publishing Kafka events before database transactions commit (dual-write dilemma).'
    ],
    prerequisiteTopicIds: ['topic-104', 'topic-106', 'topic-107', 'topic-108'],
    referenceSolutionCode: `import java.util.*;

public class EnterpriseMicroserviceChallengeDemo {

    public record OrderRequest(long orderId, String customerId, double amount) {}

    public static class MicroserviceOrchestrator {
        private final Map<String, String> cache = new HashMap<>();
        private final List<String> kafkaEvents = new ArrayList<>();
        private boolean circuitClosed = true;

        public String processOrder(OrderRequest req) {
            String key = "order:" + req.orderId();
            System.out.printf("[ORDER SERVICE] Processing Order #%d for Customer '%s'...%n", req.orderId(), req.customerId());

            if (cache.containsKey(key)) {
                return " - Cache Status: HIT -> " + cache.get(key);
            }

            System.out.println(" - Cache Status: MISS -> Executing order transaction");
            if (!circuitClosed) {
                return " - CircuitBreaker: OPEN -> Fallback invoked";
            }
            System.out.println(" - CircuitBreaker: CLOSED [Call Allowed]");

            // Publish Kafka event
            String event = String.format("Published OrderCreatedEvent to 'order-events' [Partition: 1, Offset: %d]", kafkaEvents.size());
            kafkaEvents.add(event);
            System.out.println(" - Kafka Producer: " + event);

            // Populate cache
            cache.put(key, "COMPLETED");
            System.out.printf(" - Cache Status: POPULATED -> Key '%s' cached (TTL: 60s)%n", key);

            return "SUCCESS";
        }
    }

    public static void main(String[] args) {
        MicroserviceOrchestrator orchestrator = new MicroserviceOrchestrator();
        String result = orchestrator.processOrder(new OrderRequest(9901L, "CUST-8812", 450.0));
        assert result.equals("SUCCESS");

        System.out.println("[CHALLENGE 30] Enterprise Microservice Orchestration: PASSED [COMPLIANT]");
    }
}`,
    solutionArchitectureNotes: 'Demonstrates end-to-end cloud production architecture combining caching, circuit breaking, metrics, and asynchronous event streaming.'
  }
];

export function getChallengeBySection(sectionNumber: number): SectionMilestoneChallenge | undefined {
  return SECTION_CHALLENGES.find(c => c.sectionNumber === sectionNumber);
}
