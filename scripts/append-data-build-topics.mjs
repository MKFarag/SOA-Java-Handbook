import fs from 'fs';
import path from 'path';

const dataBuildTopics = [
  {
    id: 'topic-61',
    slug: 'jdbc-fundamentals',
    topicNumber: 61,
    title: 'JDBC Fundamentals & Transactions',
    part: 'Part 1: Java Core',
    sectionNumber: 16,
    sectionTitle: 'Data Access & Build Tools',
    versionBadge: 'Java 1.1+ / Standard java.sql',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master relational database connectivity, SQL injection defense with PreparedStatement, ResultSet cursor traversal, and ACID transactions.',
    prerequisites: [
      'Topic 16: Classes, Objects & Memory Layout',
      'Topic 31: Try-With-Resources & AutoCloseable'
    ],
    whatAndWhy: {
      definition: 'JDBC (Java Database Connectivity) is Java standard vendor-neutral API for communicating with relational databases via SQL, managing connections, statements, result cursors, and ACID transactions.',
      analogy: 'A universal electrical travel adapter connecting a standardized USB-C device cable (JDBC interface) into foreign proprietary wall sockets (database engines).',
      whyItExists: 'Enables Java applications to communicate with any relational database engine using standard portable code and guarantees transactional data consistency.'
    },
    syntaxBreakdown: {
      title: 'PreparedStatement and Transaction Syntax',
      codeSnippet: `conn.setAutoCommit(false);\ntry (PreparedStatement pstmt = conn.prepareStatement("UPDATE acc SET bal = bal - ? WHERE id = ?")) {\n    pstmt.setDouble(1, 100.0);\n    pstmt.setString(2, "A1");\n    pstmt.executeUpdate();\n    conn.commit();\n}`,
      explanation: 'Precompiles SQL, binds parameters securely against SQL injection, and commits multi-step changes atomically.',
      tokens: [
        { token: 'DriverManager.getConnection()', explanation: 'Establishes live physical connection session' },
        { token: 'PreparedStatement', explanation: 'Precompiled parameterized SQL statement preventing injection' },
        { token: 'setAutoCommit(false)', explanation: 'Disables auto-commit; initiates explicit transaction boundary' },
        { token: 'conn.commit() / rollback()', explanation: 'Finalizes or rolls back pending modifications' }
      ]
    },
    examples: [
      {
        id: '61-1',
        title: 'In-Memory SQLite Database Execution',
        type: 'basic',
        description: 'Creating tables, inserting parameterized records, and iterating ResultSets.',
        filename: 'JdbcFundamentalsDemo.java',
        code: `import java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.sql.PreparedStatement;\nimport java.sql.ResultSet;\nimport java.sql.Statement;\n\npublic class JdbcFundamentalsDemo {\n    private static final String DB_URL = "jdbc:sqlite::memory:";\n    public static void main(String[] args) throws Exception {\n        System.out.println("=== JDBC In-Memory Database Execution ===");\n        try (Connection conn = DriverManager.getConnection(DB_URL)) {\n            System.out.println("Connected to: " + conn.getMetaData().getDatabaseProductName() +\n                               " (v" + conn.getMetaData().getDatabaseProductVersion() + ")");\n            try (Statement stmt = conn.createStatement()) {\n                stmt.execute("""\n                    CREATE TABLE products (\n                        id INTEGER PRIMARY KEY,\n                        name TEXT NOT NULL,\n                        price REAL NOT NULL,\n                        stock INTEGER NOT NULL\n                    )\n                """);\n                System.out.println("Table 'products' created successfully.");\n            }\n            String insertSql = "INSERT INTO products (id, name, price, stock) VALUES (?, ?, ?, ?)";\n            try (PreparedStatement pstmt = conn.prepareStatement(insertSql)) {\n                pstmt.setInt(1, 101);\n                pstmt.setString(2, "Mechanical Keyboard");\n                pstmt.setDouble(3, 89.99);\n                pstmt.setInt(4, 25);\n                pstmt.executeUpdate();\n                System.out.println("Inserted 2 products via PreparedStatement.");\n            }\n            String querySql = "SELECT id, name, price, stock FROM products WHERE price > ? ORDER BY id";\n            try (PreparedStatement pstmt = conn.prepareStatement(querySql)) {\n                pstmt.setDouble(1, 50.0);\n                try (ResultSet rs = pstmt.executeQuery()) {\n                    System.out.println("\\nQuery Results (Price > $50.00):");\n                    while (rs.next()) {\n                        System.out.printf("  [ID: %d] %-20s | $%.2f | Stock: %d%n",\n                                rs.getInt("id"), rs.getString("name"), rs.getDouble("price"), rs.getInt("stock"));\n                    }\n                }\n            }\n        }\n        System.out.println("JDBC workflow completed successfully.");\n    }\n}`,
        output: `=== JDBC In-Memory Database Execution ===\nConnected to: SQLite (v3.49.1)\nTable 'products' created successfully.\nInserted 2 products via PreparedStatement.\n\nQuery Results (Price > $50.00):\n  [ID: 101] Mechanical Keyboard  | $89.99 | Stock: 25\nJDBC workflow completed successfully.`,
        stepByStep: [
          'Connects to SQLite in-memory database.',
          'Executes DDL statement creating products table.',
          'Binds values securely via PreparedStatement.',
          'Iterates ResultSet cursor reading typed columns.'
        ]
      },
      {
        id: '61-2',
        title: 'ACID Banking Transaction Engine with Rollback',
        type: 'realistic',
        description: 'Coordinating atomic fund transfers with automatic rollback on insufficient funds.',
        filename: 'BankingTransactionRepositoryApp.java',
        code: `import java.sql.Connection;\nimport java.sql.DriverManager;\nimport java.sql.PreparedStatement;\nimport java.sql.ResultSet;\nimport java.sql.SQLException;\nimport java.sql.Statement;\n\npublic class BankingTransactionRepositoryApp {\n    private static final String DB_URL = "jdbc:sqlite::memory:";\n    public static void main(String[] args) throws Exception {\n        System.out.println("Starting Banking Transaction ACID Engine...");\n        try (Connection conn = DriverManager.getConnection(DB_URL)) {\n            setupSchema(conn);\n            System.out.println("Initial Balances:");\n            printBalances(conn);\n            boolean tx1 = transferFunds(conn, "ACC-01", "ACC-02", 200.00);\n            System.out.println("\\nTransfer 1 (Valid: $200.00) Success? " + tx1);\n            printBalances(conn);\n            boolean tx2 = transferFunds(conn, "ACC-01", "ACC-02", 5000.00);\n            System.out.println("\\nTransfer 2 (Overdraft: $5000.00) Success? " + tx2);\n            printBalances(conn);\n        }\n        System.out.println("Banking Transaction test completed successfully.");\n    }\n    private static void setupSchema(Connection conn) throws SQLException {\n        try (Statement stmt = conn.createStatement()) {\n            stmt.execute("CREATE TABLE accounts (acc_id TEXT PRIMARY KEY, balance REAL NOT NULL)");\n            stmt.execute("INSERT INTO accounts VALUES ('ACC-01', 1000.00)");\n            stmt.execute("INSERT INTO accounts VALUES ('ACC-02', 500.00)");\n        }\n    }\n    public static boolean transferFunds(Connection conn, String fromId, String toId, double amount) {\n        String debitSql = "UPDATE accounts SET balance = balance - ? WHERE acc_id = ? AND balance >= ?";\n        String creditSql = "UPDATE accounts SET balance = balance + ? WHERE acc_id = ?";\n        try {\n            conn.setAutoCommit(false);\n            try (PreparedStatement debitStmt = conn.prepareStatement(debitSql);\n                 PreparedStatement creditStmt = conn.prepareStatement(creditSql)) {\n                debitStmt.setDouble(1, amount);\n                debitStmt.setString(2, fromId);\n                debitStmt.setDouble(3, amount);\n                int rowsDebited = debitStmt.executeUpdate();\n                if (rowsDebited == 0) {\n                    System.out.println("  [Transaction Aborted] Insufficient balance or invalid account: " + fromId);\n                    conn.rollback();\n                    return false;\n                }\n                creditStmt.setDouble(1, amount);\n                creditStmt.setString(2, toId);\n                creditStmt.executeUpdate();\n                conn.commit();\n                return true;\n            } catch (SQLException e) {\n                conn.rollback();\n                throw e;\n            } finally {\n                conn.setAutoCommit(true);\n            }\n        } catch (SQLException e) {\n            return false;\n        }\n    }\n    private static void printBalances(Connection conn) throws SQLException {\n        try (Statement stmt = conn.createStatement();\n             ResultSet rs = stmt.executeQuery("SELECT acc_id, balance FROM accounts ORDER BY acc_id")) {\n            while (rs.next()) {\n                System.out.printf("  Account: %-8s | Balance: $%.2f%n", rs.getString("acc_id"), rs.getDouble("balance"));\n            }\n        }\n    }\n}`,
        output: `Starting Banking Transaction ACID Engine...\nInitial Balances:\n  Account: ACC-01   | Balance: $1000.00\n  Account: ACC-02   | Balance: $500.00\n\nTransfer 1 (Valid: $200.00) Success? true\n  Account: ACC-01   | Balance: $800.00\n  Account: ACC-02   | Balance: $700.00\n  [Transaction Aborted] Insufficient balance or invalid account: ACC-01\n\nTransfer 2 (Overdraft: $5000.00) Success? false\n  Account: ACC-01   | Balance: $800.00\n  Account: ACC-02   | Balance: $700.00\nBanking Transaction test completed successfully.`,
        stepByStep: [
          'Initializes two accounts with $1000 and $500 balances.',
          'Executes valid $200 transfer under transaction boundary and commits.',
          'Executes invalid $5000 transfer, catches violation, and rolls back cleanly.',
          'Verifies balances remain uncorrupted.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'SQL injection via dynamic string concatenation',
        wrongCode: 'stmt.executeQuery("SELECT * FROM users WHERE name = \'" + input + "\'");',
        fixedCode: 'PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM users WHERE name = ?"); pstmt.setString(1, input);',
        cause: 'Direct string concatenation allows attackers to inject arbitrary SQL statements.',
        solution: 'Always use parameterized PreparedStatement for any variable SQL input.'
      }
    ],
    bestPractices: {
      doList: [
        'Use production connection pools like HikariCP to eliminate connection establishment latency.',
        'Always wrap Connection, Statement, and ResultSet in try-with-resources blocks.'
      ],
      dontList: [
        'Do not commit transactions implicitly without error handling.',
        'Do not leave connections with setAutoCommit(false) when returning them to pools.'
      ],
      whenNotToUse: 'When an Object-Relational Mapping (ORM) framework like JPA/Hibernate provides automated domain object mapping.'
    },
    versionNotes: {
      introduced: 'Java 1.1',
      status: 'Stable',
      compatibilityNotes: 'Java 6 added automatic driver discovery via ServiceLoader. Java 7 added AutoCloseable support.',
      ltsAvailability: 'Java 8, 11, 17, 21'
    },
    cheatSheet: {
      title: 'JDBC Core Interfaces Cheat Sheet',
      headers: ['Interface', 'Core Method', 'Role'],
      rows: [
        ['DriverManager', 'getConnection(url)', 'Locates driver and opens connection'],
        ['Connection', 'prepareStatement(sql)', 'Creates precompiled query'],
        ['PreparedStatement', 'executeUpdate() / executeQuery()', 'Runs DML or query'],
        ['ResultSet', 'next(), getInt(), getString()', 'Navigates returned tabular rows']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Parameterized Query',
        prompt: 'Write a PreparedStatement query to select users by age greater than a parameter.',
        solution: 'PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE age > ?"); ps.setInt(1, 18); ResultSet rs = ps.executeQuery();',
        explanation: 'Safely binds age parameter avoiding SQL injection.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 Specification: java.sql',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/package-summary.html',
        organization: 'Oracle'
      }
    ]
  },

  {
    id: 'topic-62',
    slug: 'build-automation-maven-and-gradle',
    topicNumber: 62,
    title: 'Build Automation: Maven & Gradle',
    part: 'Part 1: Java Core',
    sectionNumber: 16,
    sectionTitle: 'Data Access & Build Tools',
    versionBadge: 'Maven 3.x / Gradle 8.x+',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master modern build systems: Maven lifecycle phases, POM dependencies, transitive conflict resolution, and Gradle incremental tasks.',
    prerequisites: [
      'Topic 02: JDK vs JRE vs JVM & Setup',
      'Topic 18: Packages and Access Modifiers'
    ],
    whatAndWhy: {
      definition: 'Build automation tools manage dependencies, compilation, automated testing, packaging (JAR/WAR), and deployment using declarative build manifests (pom.xml or build.gradle.kts).',
      analogy: 'An ISO-certified aircraft assembly line where every bolt has a standardized barcode (GAV coordinates) and follows an unskippable 7-stage quality checklist.',
      whyItExists: 'Eliminates Classpath Hell, automates transitive dependency resolution, and provides reproducible builds across CI/CD environments.'
    },
    syntaxBreakdown: {
      title: 'Maven Coordinates and Lifecycles',
      codeSnippet: `<dependency>\n    <groupId>org.slf4j</groupId>\n    <artifactId>slf4j-api</artifactId>\n    <version>2.0.12</version>\n    <scope>compile</scope>\n</dependency>`,
      explanation: 'Uniquely identifies dependency using Group, Artifact, Version (GAV) and defines classpath scope.',
      tokens: [
        { token: 'groupId', explanation: 'Reverse domain identifier of organization' },
        { token: 'artifactId', explanation: 'Name of the specific library module' },
        { token: 'scope', explanation: 'Classpath availability: compile, test, runtime, provided' }
      ]
    },
    examples: [
      {
        id: '62-1',
        title: 'Maven POM and Lifecycle Phases Inspector',
        type: 'basic',
        description: 'Parsing POM.xml structure and inspecting standard lifecycle phases.',
        filename: 'BuildToolLifecycleDemo.java',
        code: `import java.io.ByteArrayInputStream;\nimport java.nio.charset.StandardCharsets;\nimport java.util.ArrayList;\nimport java.util.List;\nimport javax.xml.parsers.DocumentBuilder;\nimport javax.xml.parsers.DocumentBuilderFactory;\nimport org.w3c.dom.Document;\nimport org.w3c.dom.Element;\nimport org.w3c.dom.NodeList;\n\npublic class BuildToolLifecycleDemo {\n    private static final String SAMPLE_POM_XML = """\n        <project xmlns="http://maven.apache.org/POM/4.0.0">\n            <modelVersion>4.0.0</modelVersion>\n            <groupId>com.handbook.app</groupId>\n            <artifactId>order-service</artifactId>\n            <version>1.0.0-RELEASE</version>\n            <packaging>jar</packaging>\n            <dependencies>\n                <dependency>\n                    <groupId>org.slf4j</groupId>\n                    <artifactId>slf4j-api</artifactId>\n                    <version>2.0.12</version>\n                    <scope>compile</scope>\n                </dependency>\n            </dependencies>\n        </project>\n    """;\n    public static void main(String[] args) throws Exception {\n        System.out.println("=== Maven POM.xml & Lifecycle Phases Inspector ===");\n        DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();\n        Document doc = builder.parse(new ByteArrayInputStream(SAMPLE_POM_XML.getBytes(StandardCharsets.UTF_8)));\n        Element root = doc.getDocumentElement();\n        System.out.printf("Project Coordinate: %s:%s:%s [%s]%n",\n                root.getElementsByTagName("groupId").item(0).getTextContent().trim(),\n                root.getElementsByTagName("artifactId").item(0).getTextContent().trim(),\n                root.getElementsByTagName("version").item(0).getTextContent().trim(),\n                root.getElementsByTagName("packaging").item(0).getTextContent().trim());\n        System.out.println("\\nStandard Maven Build Lifecycle:");\n        List<String> phases = List.of("validate", "compile", "test", "package", "verify", "install", "deploy");\n        for (int i = 0; i < phases.size(); i++) System.out.printf("  Phase %d: mvn %s%n", i + 1, phases.get(i));\n        System.out.println("Build tool validation completed successfully.");\n    }\n}`,
        output: `=== Maven POM.xml & Lifecycle Phases Inspector ===\nProject Coordinate: com.handbook.app:order-service:1.0.0-RELEASE [jar]\n\nStandard Maven Build Lifecycle:\n  Phase 1: mvn validate\n  Phase 2: mvn compile\n  Phase 3: mvn test\n  Phase 4: mvn package\n  Phase 5: mvn verify\n  Phase 6: mvn install\n  Phase 7: mvn deploy\nBuild tool validation completed successfully.`,
        stepByStep: [
          'Parses standard Maven POM XML file.',
          'Extracts project GAV coordinates.',
          'Enumerates 7 linear lifecycle phases executed by mvn package.'
        ]
      },
      {
        id: '62-2',
        title: 'Transitive Dependency Conflict Resolution Simulator',
        type: 'realistic',
        description: 'Contrasting Maven nearest-definition-wins vs Gradle highest-version-wins conflict strategies.',
        filename: 'DependencyResolverSimulatorApp.java',
        code: `public class DependencyResolverSimulatorApp {\n    record DependencyNode(String name, String version, int depth) {}\n    public static void main(String[] args) {\n        System.out.println("Starting Build Tool Dependency Conflict Simulator...");\n        DependencyNode directDep = new DependencyNode("common-utils", "2.1.0", 1);\n        DependencyNode transDepA = new DependencyNode("common-utils", "1.0.0", 2);\n        DependencyNode transDepB = new DependencyNode("common-utils", "3.0.0", 3);\n        String mavenChosen = resolveMavenNearest(directDep, transDepA, transDepB);\n        System.out.println("Maven Resolution (Nearest Definition Wins):   " + mavenChosen);\n        String gradleChosen = resolveGradleLatest(directDep, transDepA, transDepB);\n        System.out.println("Gradle Resolution (Highest Version Wins):     " + gradleChosen);\n        System.out.println("Dependency conflict resolution comparison completed successfully.");\n    }\n    private static String resolveMavenNearest(DependencyNode... nodes) {\n        DependencyNode nearest = nodes[0];\n        for (DependencyNode node : nodes) if (node.depth() < nearest.depth()) nearest = node;\n        return nearest.name() + ":" + nearest.version() + " (Selected at depth " + nearest.depth() + ")";\n    }\n    private static String resolveGradleLatest(DependencyNode... nodes) {\n        DependencyNode highest = nodes[0];\n        for (DependencyNode node : nodes) {\n            if (node.version().compareTo(highest.version()) > 0) highest = node;\n        }\n        return highest.name() + ":" + highest.version() + " (Selected latest semver)";\n    }\n}`,
        output: `Starting Build Tool Dependency Conflict Simulator...\nMaven Resolution (Nearest Definition Wins):   common-utils:2.1.0 (Selected at depth 1)\nGradle Resolution (Highest Version Wins):     common-utils:3.0.0 (Selected latest semver)\nDependency conflict resolution comparison completed successfully.`,
        stepByStep: [
          'Simulates three competing versions of common-utils at varying tree depths.',
          'Demonstrates Maven picking version 2.1.0 (nearest depth = 1).',
          'Demonstrates Gradle picking version 3.0.0 (highest semantic version).'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Leaking test dependencies into production distribution',
        wrongCode: '<dependency>\n    <groupId>org.junit.jupiter</groupId>\n    <artifactId>junit-jupiter</artifactId>\n    <scope>compile</scope>\n</dependency>',
        fixedCode: '<scope>test</scope>',
        cause: 'Default scope is compile, bloating production JARs with testing harnesses.',
        solution: 'Always set <scope>test</scope> for test frameworks.'
      }
    ],
    bestPractices: {
      doList: [
        'Always commit the Maven Wrapper (mvnw) or Gradle Wrapper (gradlew) to source control.',
        'Use dependencyManagement / platforms to manage library versions centrally.'
      ],
      dontList: [
        'Do not commit binary JAR files into Git repositories.',
        'Do not skip tests in production release builds (-DskipTests).'
      ],
      whenNotToUse: 'For single-file educational scratch programs where javac HelloWorld.java is sufficient.'
    },
    versionNotes: {
      introduced: 'Maven 2004 / Gradle 2012',
      status: 'Stable',
      compatibilityNotes: 'Maven 3.9+ and Gradle 8.5+ fully support Java 21 LTS and Java 22+.',
      ltsAvailability: 'All LTS versions'
    },
    cheatSheet: {
      title: 'Maven vs Gradle Cheat Sheet',
      headers: ['Feature', 'Apache Maven', 'Gradle'],
      rows: [
        ['Configuration', 'XML (pom.xml)', 'Groovy / Kotlin DSL (build.gradle.kts)'],
        ['Lifecycle Model', 'Linear phases (compile, test, package)', 'Directed Acyclic Graph (DAG) of tasks'],
        ['Conflict Policy', 'Nearest definition in tree wins', 'Highest version wins by default'],
        ['Wrapper Command', './mvnw clean package', './gradlew build']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Maven Packaging Command',
        prompt: 'What command compiles, tests, and creates a JAR artifact in Maven?',
        solution: 'mvn package',
        explanation: 'Executes all phases up to and including the package phase.'
      }
    ],
    officialSources: [
      {
        title: 'Apache Maven: Introduction to the Build Lifecycle',
        url: 'https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html',
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

const formattedTopics = dataBuildTopics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(',\n\n');

const replacement = formattedTopics + ',\n\n' + targetMarker;
content = content.replace(targetMarker, replacement);

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log('Successfully appended topics 61-62 into src/data/topics.ts!');
