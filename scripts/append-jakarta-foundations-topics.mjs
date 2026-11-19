import fs from 'fs';
import path from 'path';

const foundationsTopics = [
  {
    id: 'topic-63',
    slug: 'the-great-transition-java-ee-to-jakarta-ee',
    topicNumber: 63,
    title: 'The Great Transition: Java EE to Jakarta EE',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 17,
    sectionTitle: 'Web Architecture & The Jakarta EE Evolution',
    versionBadge: 'Jakarta EE 9/10/11',
    difficulty: 'Beginner',
    readingTime: '10 min read',
    shortDescription: 'Understand the historic evolution from Sun J2EE and Oracle Java EE to Eclipse Jakarta EE, package namespace migration from javax.* to jakarta.*, and server compatibility matrices.',
    prerequisites: [
      'Topic 18: Packages & Access Modifiers',
      'Topic 60: Java Platform Module System (JPMS)'
    ],
    whatAndWhy: {
      definition: 'The transition from Java EE to Jakarta EE represents the transfer of enterprise Java standards from Oracle to the Eclipse Foundation, resulting in the permanent relocation of enterprise APIs from the javax.* package namespace to jakarta.*.',
      analogy: 'An international telecom provider changing its country calling code from +99 (javax.*) to +77 (jakarta.*) because the old brand name was retained by the original founder. Old cell towers only accept +99; modern towers accept +77.',
      whyItExists: 'Oracle retained legal ownership of the "Java" trademark. To allow enterprise specifications to evolve freely as open standards under the Eclipse Foundation, the community agreed to the Big Bang package rename in Jakarta EE 9.'
    },
    syntaxBreakdown: {
      title: 'Namespace Migration Import Comparison',
      codeSnippet: `// Legacy Java EE 8 (Tomcat 9 and older)\nimport javax.servlet.http.HttpServlet;\nimport javax.servlet.http.HttpServletRequest;\n\n// Modern Jakarta EE 10/11 (Tomcat 10.1+ / 11)\nimport jakarta.servlet.http.HttpServlet;\nimport jakarta.servlet.http.HttpServletRequest;`,
      explanation: 'Every class previously prefixed with javax.servlet, javax.persistence, or javax.ws.rs is now located under jakarta.*.',
      tokens: [
        { token: 'javax.*', explanation: 'Legacy namespace frozen at Java EE 8 feature set' },
        { token: 'jakarta.*', explanation: 'Active evolving open-standard enterprise namespace' },
        { token: 'Tomcat 10.1+', explanation: 'Modern reference container implementing Servlet 6.0 (Jakarta EE 10)' },
        { token: 'Tomcat 9.x', explanation: 'Legacy LTS container frozen on Servlet 4.0 (Java EE 8)' }
      ]
    },
    examples: [
      {
        id: 'ex-63-basic',
        title: 'Inspecting Active Servlet Runtime Namespace',
        type: 'basic',
        description: 'Detecting whether running code is bound to jakarta.* or legacy javax.* via reflection and type checks.',
        filename: 'NamespaceTransitionInspectorDemo.java',
        code: `import jakarta.servlet.http.HttpServlet;

public class NamespaceTransitionInspectorDemo {
    public static void main(String[] args) {
        System.out.println("=== The Great Transition: Java EE to Jakarta EE ===");
        Class<?> servletClass = HttpServlet.class;
        System.out.println("Active Servlet API Detected: " + servletClass.getName());
        System.out.println("Package Namespace: " + servletClass.getPackageName());
        
        if (servletClass.getName().startsWith("jakarta.")) {
            System.out.println("Runtime Standard: Modern Jakarta EE (Tomcat 10.1+ / Jakarta EE 10/11 compatible)");
        } else if (servletClass.getName().startsWith("javax.")) {
            System.out.println("Runtime Standard: Legacy Java EE (Tomcat 9 or older)");
        }
        System.out.println("Namespace transition inspection completed successfully.");
    }
}`,
        output: `=== The Great Transition: Java EE to Jakarta EE ===
Active Servlet API Detected: jakarta.servlet.http.HttpServlet
Package Namespace: jakarta.servlet.http
Runtime Standard: Modern Jakarta EE (Tomcat 10.1+ / Jakarta EE 10/11 compatible)
Namespace transition inspection completed successfully.`,
        stepByStep: [
          'Imports HttpServlet from the jakarta.servlet.http package.',
          'Inspects class name and package namespace at runtime.',
          'Verifies compatibility with modern Servlet 6.0 containers.'
        ]
      },
      {
        id: 'ex-63-realistic',
        title: 'Server and Specification Compatibility Matrix',
        type: 'realistic',
        description: 'Programmatically querying container compatibility tiers across Tomcat, Jetty, and WildFly.',
        filename: 'ServerCompatibilityMatrixApp.java',
        code: `import java.util.List;

public class ServerCompatibilityMatrixApp {
    record ContainerSupport(String serverName, String serverVersion, String jakartaVersion, String servletSpec, String namespace) {}

    public static void main(String[] args) {
        System.out.println("=== Enterprise Container Compatibility Matrix ===");
        List<ContainerSupport> matrix = List.of(
            new ContainerSupport("Apache Tomcat", "9.0.x", "Java EE 8", "Servlet 4.0", "javax.*"),
            new ContainerSupport("Apache Tomcat", "10.0.x (EOL)", "Jakarta EE 9", "Servlet 5.0", "jakarta.*"),
            new ContainerSupport("Apache Tomcat", "10.1.x", "Jakarta EE 10", "Servlet 6.0", "jakarta.*"),
            new ContainerSupport("Apache Tomcat", "11.0.x", "Jakarta EE 11", "Servlet 6.1", "jakarta.*"),
            new ContainerSupport("Eclipse Jetty", "12.x (ee10)", "Jakarta EE 10", "Servlet 6.0", "jakarta.*"),
            new ContainerSupport("WildFly", "30.x+", "Jakarta EE 10", "Servlet 6.0", "jakarta.*")
        );

        System.out.printf("%-18s | %-10s | %-15s | %-12s | %-10s%n", "Server", "Version", "EE Standard", "Servlet Spec", "Namespace");
        System.out.println("-".repeat(78));
        for (var row : matrix) {
            System.out.printf("%-18s | %-10s | %-15s | %-12s | %-10s%n",
                row.serverName(), row.serverVersion(), row.jakartaVersion(), row.servletSpec(), row.namespace());
        }
        System.out.println("Server compatibility evaluation completed successfully.");
    }
}`,
        output: `=== Enterprise Container Compatibility Matrix ===
Server             | Version    | EE Standard     | Servlet Spec | Namespace 
------------------------------------------------------------------------------
Apache Tomcat      | 9.0.x      | Java EE 8       | Servlet 4.0  | javax.*   
Apache Tomcat      | 10.0.x (EOL) | Jakarta EE 9    | Servlet 5.0  | jakarta.* 
Apache Tomcat      | 10.1.x     | Jakarta EE 10   | Servlet 6.0  | jakarta.* 
Apache Tomcat      | 11.0.x     | Jakarta EE 11   | Servlet 6.1  | jakarta.* 
Eclipse Jetty      | 12.x (ee10) | Jakarta EE 10   | Servlet 6.0  | jakarta.* 
WildFly            | 30.x+      | Jakarta EE 10   | Servlet 6.0  | jakarta.* 
Server compatibility evaluation completed successfully.`,
        stepByStep: [
          'Defines a structured record modeling server compatibility entries.',
          'Maps Apache Tomcat, Eclipse Jetty, and Red Hat WildFly versions against EE specifications.',
          'Prints the authoritative compatibility guide for enterprise deployment planning.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Deploying a WAR compiled with javax.servlet.* to Tomcat 10.1+',
        errorCodeOrSnippet: 'java.lang.ClassNotFoundException: javax.servlet.http.HttpServlet',
        cause: 'Servlet containers from Tomcat 10.1+ exclusively expose the jakarta.* package namespace.',
        solution: 'Migrate source imports to jakarta.servlet.* or use the Apache Tomcat migration tool for legacy WAR files.'
      },
      {
        title: 'Mixing javax.* and jakarta.* dependencies in the same project build',
        errorCodeOrSnippet: 'error: reference to HttpServlet is ambiguous',
        cause: 'Having both legacy javax.servlet-api and jakarta.servlet-api on the compiler classpath.',
        solution: 'Ensure all dependencies (persistence, web, validation, JSON) are upgraded uniformly to Jakarta EE 10 coordinates.'
      }
    ],
    bestPractices: {
      doList: [
        'Target Jakarta EE 10 (jakarta.* namespace) for all new enterprise Java services and production web apps.',
        'Check third-party library dependencies for Jakarta namespace compatibility before upgrading containers.',
        'Use the latest Apache Tomcat 10.1.x LTS release for stable, production-grade Servlet 6.0 hosting.'
      ],
      dontList: [
        'Do not start new enterprise projects using legacy javax.* packages.',
        'Do not bundle javax.servlet-api in WEB-INF/lib when running on modern Tomcat.',
        'Do not mix different Jakarta EE milestone release coordinates in your build descriptor.'
      ],
      whenNotToUse: 'Do not use Jakarta EE full profile servers if your application only requires lightweight REST services or microservices; a lightweight servlet engine or Spring Boot web starter is sufficient.'
    },
    versionNotes: {
      introduced: 'Jakarta EE 9 (2020) namespace rename; Jakarta EE 10 (2022) stable LTS',
      status: 'Stable',
      compatibilityNotes: 'Global package rename from javax.* to jakarta.*. Tomcat 9 is the last release supporting javax.*.',
      ltsAvailability: 'Jakarta EE 10 is the core enterprise LTS baseline; Jakarta EE 11 expands Java 21+ features.'
    },
    cheatSheet: {
      title: 'Java EE to Jakarta EE Evolution Matrix',
      headers: ['Feature', 'Java EE 8', 'Jakarta EE 9', 'Jakarta EE 10', 'Jakarta EE 11'],
      rows: [
        ['Package Namespace', 'javax.*', 'jakarta.*', 'jakarta.*', 'jakarta.*'],
        ['Servlet Specification', 'Servlet 4.0', 'Servlet 5.0', 'Servlet 6.0', 'Servlet 6.1'],
        ['Minimum Java Version', 'Java 8', 'Java 8', 'Java 11 (Java 17/21 rec.)', 'Java 17 (Java 21/26 rec.)'],
        ['Reference Tomcat', 'Tomcat 9.0.x', 'Tomcat 10.0.x (EOL)', 'Tomcat 10.1.x', 'Tomcat 11.0.x']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix the Legacy Import Mismatch',
        prompt: 'A web app deployed to Tomcat 10.1 fails with ClassNotFoundException: javax.servlet.Servlet. Identify the root cause and provide the fix.',
        starterCode: `import javax.servlet.annotation.WebServlet;\nimport javax.servlet.http.HttpServlet;\n\n@WebServlet("/status")\npublic class StatusServlet extends HttpServlet {\n}`,
        solution: `import jakarta.servlet.annotation.WebServlet;\nimport jakarta.servlet.http.HttpServlet;\n\n@WebServlet("/status")\npublic class StatusServlet extends HttpServlet {\n}`,
        explanation: 'Tomcat 10.1 implements Servlet 6.0 (Jakarta EE 10) which exclusively supports the jakarta.* namespace.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Deployment Namespace Validator',
        prompt: 'Write a utility method that inspects an array of class names and flags any legacy javax.* classes.',
        starterCode: `public static boolean hasLegacyImports(java.util.List<String> classNames) {\n    // Return true if any class uses javax.*\n}`,
        solution: `public static boolean hasLegacyImports(java.util.List<String> classNames) {\n    return classNames.stream().anyMatch(name -> name.startsWith("javax.servlet.") || name.startsWith("javax.persistence."));\n}`,
        explanation: 'Scanning class names ensures legacy artifacts are identified prior to deployment.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Third-Party Library Compatibility',
        prompt: 'Can a modern Jakarta EE 10 WAR use a library that still references javax.servlet internally without modification?',
        solution: `// No. The JVM ClassLoader will fail to locate javax.servlet classes on Tomcat 10.1+.\n// Solutions:\n// 1. Upgrade the library to a version supporting Jakarta EE 10.\n// 2. Run the Apache Tomcat Migration Tool for Jakarta EE to bytecode-transform the JAR.`,
        explanation: 'Tomcat 10.1 does not provide javax.servlet classes on its common classloader path.'
      }
    ],
    officialSources: [
      {
        title: 'Eclipse Foundation: Jakarta EE Specifications Portal',
        url: 'https://jakarta.ee/specifications/',
        organization: 'Eclipse Foundation'
      },
      {
        title: 'Apache Tomcat Migration Guide: Java EE 8 to Jakarta EE 9/10',
        url: 'https://tomcat.apache.org/migration-10.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-64',
    slug: 'web-architecture-fundamentals-http',
    topicNumber: 64,
    title: 'Web Architecture Fundamentals: The HTTP Protocol',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 17,
    sectionTitle: 'Web Architecture & The Jakarta EE Evolution',
    versionBadge: 'HTTP/1.1 & HTTP/2',
    difficulty: 'Beginner',
    readingTime: '11 min read',
    shortDescription: 'Master client-server mechanics, request-response lifecycles, HTTP methods (GET, POST, PUT, DELETE), header contracts, status code tiers, and query parameters.',
    prerequisites: [
      'Topic 01: What is Programming & How Code Runs',
      'Topic 45: Classic I/O Streams'
    ],
    whatAndWhy: {
      definition: 'HTTP (Hypertext Transfer Protocol) is an application-layer client-server protocol where web clients transmit formatted text or binary requests to an addressable URI, and servers reply with status codes, headers, and payload bodies.',
      analogy: 'Sending a certified physical letter via postal mail: the envelope exterior contains recipient address and routing stamps (headers), the delivery slip contains receipt status (status code), and the inner letter is the payload body.',
      whyItExists: 'Provides a universally agreed upon stateless communication standard allowing web browsers, mobile apps, and microservices to exchange structured information across networks.'
    },
    syntaxBreakdown: {
      title: 'HTTP Request & Response Line Anatomy',
      codeSnippet: `// Raw HTTP/1.1 Request Wire Format\nPOST /api/v1/orders?priority=true HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\nContent-Length: 32\n\n{"item":"Laptop","quantity":1}\n\n// Raw HTTP/1.1 Response Wire Format\nHTTP/1.1 201 Created\nContent-Type: application/json\nLocation: /api/v1/orders/8042\n\n{"id":8042,"status":"CONFIRMED"}`,
      explanation: 'A request line begins with an HTTP method, target URI, and version, followed by key-value headers, an empty CRLF delimiter line, and the optional message body.',
      tokens: [
        { token: 'GET', explanation: 'Safe, idempotent method retrieving resources; no body allowed' },
        { token: 'POST', explanation: 'Unsafe, non-idempotent method creating new resources or invoking actions' },
        { token: '200 OK / 201 Created', explanation: '2xx Success status codes indicating completed operations' },
        { token: '4xx Client / 5xx Server', explanation: '4xx client errors (bad request/auth) vs 5xx server-side failures' }
      ]
    },
    examples: [
      {
        id: 'ex-64-basic',
        title: 'Parsing Raw HTTP Request Wire Protocol',
        type: 'basic',
        description: 'Deconstructing raw HTTP stream data into method, URI, query parameters, and headers.',
        filename: 'HttpProtocolParserDemo.java',
        code: `import java.util.HashMap;
import java.util.Map;

public class HttpProtocolParserDemo {
    public static void main(String[] args) {
        System.out.println("=== HTTP Request Protocol Parser ===");
        String rawHttpRequest = """
            POST /api/v1/orders?priority=true HTTP/1.1
            Host: api.store.com
            User-Agent: Mozilla/5.0
            Content-Type: application/json
            Content-Length: 26
            
            {"productId":101,"qty":2}
            """;

        String[] lines = rawHttpRequest.split("\\r?\\n");
        String requestLine = lines[0];
        String[] reqParts = requestLine.split(" ");
        String method = reqParts[0];
        String fullUri = reqParts[1];
        String version = reqParts[2];

        String path = fullUri.contains("?") ? fullUri.substring(0, fullUri.indexOf('?')) : fullUri;
        String queryString = fullUri.contains("?") ? fullUri.substring(fullUri.indexOf('?') + 1) : "";

        Map<String, String> headers = new HashMap<>();
        int bodyStartIdx = 0;
        for (int i = 1; i < lines.length; i++) {
            if (lines[i].isBlank()) {
                bodyStartIdx = i + 1;
                break;
            }
            int colonIdx = lines[i].indexOf(':');
            if (colonIdx != -1) {
                headers.put(lines[i].substring(0, colonIdx).trim(), lines[i].substring(colonIdx + 1).trim());
            }
        }

        StringBuilder body = new StringBuilder();
        for (int i = bodyStartIdx; i < lines.length; i++) {
            body.append(lines[i]);
        }

        System.out.println("Parsed Request Details:");
        System.out.println("  Method:   " + method);
        System.out.println("  Path URI: " + path);
        System.out.println("  Query:    " + queryString);
        System.out.println("  Version:  " + version);
        System.out.println("  Headers:  " + headers);
        System.out.println("  Body:     " + body.toString().trim());
        System.out.println("HTTP request parsing completed successfully.");
    }
}`,
        output: `=== HTTP Request Protocol Parser ===
Parsed Request Details:
  Method:   POST
  Path URI: /api/v1/orders
  Query:    priority=true
  Version:  HTTP/1.1
  Headers:  {Host=api.store.com, Content-Type=application/json, User-Agent=Mozilla/5.0, Content-Length=26}
  Body:     {"productId":101,"qty":2}
HTTP request parsing completed successfully.`,
        stepByStep: [
          'Splits raw stream text by newline characters.',
          'Extracts method (POST), path (/api/v1/orders), and protocol (HTTP/1.1).',
          'Parses key-value header lines until the empty blank line delimiter.',
          'Extracts remaining payload stream as request body.'
        ]
      },
      {
        id: 'ex-64-realistic',
        title: 'Mock HTTP Request Router and Dispatcher',
        type: 'realistic',
        description: 'Routing incoming requests by method and path to produce formatted HTTP/1.1 response status codes.',
        filename: 'MockHttpServerDispatcherApp.java',
        code: `import java.util.Map;

public class MockHttpServerDispatcherApp {
    record SimpleHttpRequest(String method, String path) {}
    record SimpleHttpResponse(int statusCode, String reasonPhrase, String body) {
        public String formatWireResponse() {
            return String.format("HTTP/1.1 %d %s%nContent-Length: %d%n%n%s", 
                statusCode, reasonPhrase, body.length(), body);
        }
    }

    public static SimpleHttpResponse route(SimpleHttpRequest req) {
        if ("GET".equals(req.method()) && "/health".equals(req.path())) {
            return new SimpleHttpResponse(200, "OK", "STATUS: SYSTEM HEALTHY");
        } else if ("POST".equals(req.method()) && "/api/data".equals(req.path())) {
            return new SimpleHttpResponse(201, "Created", "ID: 4920 CREATED");
        } else {
            return new SimpleHttpResponse(404, "Not Found", "RESOURCE NOT FOUND");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Mock HTTP Dispatcher Simulation ===");
        var requests = java.util.List.of(
            new SimpleHttpRequest("GET", "/health"),
            new SimpleHttpRequest("POST", "/api/data"),
            new SimpleHttpRequest("GET", "/nonexistent")
        );

        for (var req : requests) {
            var resp = route(req);
            System.out.printf("%-4s %-14s -> %d %s (Body: %s)%n", 
                req.method(), req.path(), resp.statusCode(), resp.reasonPhrase(), resp.body());
        }
        System.out.println("HTTP Dispatcher simulation completed successfully.");
    }
}`,
        output: `=== Mock HTTP Dispatcher Simulation ===
GET  /health        -> 200 OK (Body: STATUS: SYSTEM HEALTHY)
POST /api/data       -> 201 Created (Body: ID: 4920 CREATED)
GET  /nonexistent   -> 404 Not Found (Body: RESOURCE NOT FOUND)
HTTP Dispatcher simulation completed successfully.`,
        stepByStep: [
          'Encapsulates requests and responses into clean Java records.',
          'Matches incoming method and path pairs against registered routes.',
          'Generates standard status codes (200, 201, 404) with corresponding wire text.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Using GET requests to delete or mutate database records',
        errorCodeOrSnippet: '<a href="/deleteUser?id=10">Delete</a>',
        cause: 'Web crawlers, browser prefetching, and proxies can inadvertently trigger destructive database operations.',
        solution: 'Strictly use POST, PUT, or DELETE for state-changing operations; keep GET safe and idempotent.'
      },
      {
        title: 'Forgetting the empty CRLF line between HTTP headers and request body',
        errorCodeOrSnippet: 'HTTP/1.1 200 OK\\nContent-Type: text/plain{"data":1}',
        cause: 'Missing the mandatory empty line delimiter required by RFC 9110.',
        solution: 'Always ensure an empty newline separates the last header from the payload.'
      }
    ],
    bestPractices: {
      doList: [
        'Adhere to RESTful HTTP method semantics: GET for read, POST for create, PUT for update, DELETE for remove.',
        'Always set accurate Content-Type and Content-Length / Transfer-Encoding headers.',
        'Return descriptive HTTP status codes (e.g. 201 Created, 404 Not Found, 409 Conflict) rather than generic 200 OK with error bodies.'
      ],
      dontList: [
        'Do not transmit sensitive credentials or tokens in URL query strings (use Authorization headers).',
        'Do not design endpoints with side effects on GET requests.',
        'Do not ignore caching headers (Cache-Control, ETag) on high-traffic public assets.'
      ],
      whenNotToUse: 'Do not use raw HTTP polling for ultra-low-latency real-time bidirectional messaging; use WebSockets or Server-Sent Events (SSE).'
    },
    versionNotes: {
      introduced: 'HTTP/1.0 (RFC 1945), HTTP/1.1 (RFC 2616 / 9112), HTTP/2 (RFC 7540)',
      status: 'Stable',
      compatibilityNotes: 'HTTP/1.1 and HTTP/2 are the primary protocol versions supported across Jakarta EE and Tomcat runtimes.',
      ltsAvailability: 'Tomcat 10.1 supports HTTP/1.1, HTTP/2 (multiplexing over TLS), and WebSocket connections.'
    },
    cheatSheet: {
      title: 'HTTP Methods and Semantic Properties',
      headers: ['Method', 'Safe?', 'Idempotent?', 'Has Body?', 'Typical Purpose'],
      rows: [
        ['GET', 'Yes', 'Yes', 'No', 'Retrieve existing resource state'],
        ['POST', 'No', 'No', 'Yes', 'Create new resource or execute processing action'],
        ['PUT', 'No', 'Yes', 'Yes', 'Completely replace target resource'],
        ['DELETE', 'No', 'Yes', 'Optional', 'Remove target resource'],
        ['HEAD', 'Yes', 'Yes', 'No', 'Retrieve headers only without response body']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Identify Unsafe HTTP Method Usage',
        prompt: 'A web app exposes an endpoint `GET /users/delete?id=42` to delete users. Explain why this violates HTTP specifications and provide the fix.',
        starterCode: `// Client link:\n<a href="/users/delete?id=42">Delete User</a>`,
        solution: `// Fix: Use POST or DELETE with CSRF protection:\n<form method="POST" action="/users/42/delete">\n  <input type="hidden" name="_method" value="DELETE"/>\n  <button type="submit">Delete User</button>\n</form>`,
        explanation: 'GET requests must be safe and idempotent. Automated crawlers and link previewers could trigger unintentional deletions.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Status Code Classifier',
        prompt: 'Write a helper method that categorizes an integer status code into its standard category (Informational, Success, Redirection, Client Error, Server Error).',
        starterCode: `public static String categorizeStatus(int code) {\n    // Return category name\n}`,
        solution: `public static String categorizeStatus(int code) {\n    return switch (code / 100) {\n        case 1 -> "Informational (1xx)";\n        case 2 -> "Success (2xx)";\n        case 3 -> "Redirection (3xx)";\n        case 4 -> "Client Error (4xx)";\n        case 5 -> "Server Error (5xx)";\n        default -> "Invalid Status";\n    };\n}`,
        explanation: 'Integer division by 100 cleanly maps status codes into standard HTTP tiers.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Idempotency in Network Timeouts',
        prompt: 'If a client encounters a network timeout when calling PUT vs POST, which one can the client safely retry automatically without duplicate side effects?',
        solution: `// PUT is idempotent by specification: updating a resource to state X multiple times produces the identical end state.\n// POST is NOT idempotent: retrying a POST may create duplicate orders or bill a user twice.\n// Therefore, PUT requests can be safely retried automatically.`,
        explanation: 'Understanding method idempotency is essential for reliable distributed systems.'
      }
    ],
    officialSources: [
      {
        title: 'IETF RFC 9110: HTTP Semantics',
        url: 'https://www.rfc-editor.org/rfc/rfc9110.html',
        organization: 'Eclipse Foundation'
      },
      {
        title: 'Apache Tomcat Documentation: HTTP Connectors',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/config/http.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-65',
    slug: 'apache-tomcat-and-the-war-structure',
    topicNumber: 65,
    title: 'Apache Tomcat & The WAR Structure',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 18,
    sectionTitle: 'Web Containers & Packaging',
    versionBadge: 'Tomcat 10.1+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Explore the Web Archive (WAR) anatomy, the protected WEB-INF boundary, web.xml vs annotations, Catalina container hierarchy, and Tomcat deployment pipelines.',
    prerequisites: [
      'Topic 62: Build Automation: Maven & Gradle',
      'Topic 63: The Great Transition: Java EE to Jakarta EE'
    ],
    whatAndWhy: {
      definition: 'Apache Tomcat is an open-source reference Servlet container and web server implementing the Jakarta Servlet and Jakarta Pages specifications. A WAR (Web Application Archive) is a packaged ZIP file structured strictly according to the Jakarta EE specification.',
      analogy: 'A residential apartment building: the public lobby and garden are accessible to anyone (HTML, CSS, images), while the security-locked private maintenance wing (WEB-INF) is accessible only to building staff (Servlets, compiled .class files, and internal configs).',
      whyItExists: 'Enables developers to bundle static assets, compiled bytecode, libraries, and deployment descriptors into a single portable distribution archive deployable to any standard compliant Servlet container.'
    },
    syntaxBreakdown: {
      title: 'Standard WAR Directory Architecture',
      codeSnippet: `my-web-app.war\n├── index.html              <-- Public web asset\n├── assets/                 <-- Public CSS, JS, images\n│   └── app.css\n└── WEB-INF/                <-- PROTECTED: Never accessible directly via URL\n    ├── web.xml             <-- Deployment descriptor (optional in Servlet 3.0+)\n    ├── classes/            <-- Compiled application classes (.class)\n    │   └── com/app/MyServlet.class\n    └── lib/                <-- Third-party dependency JARs\n        └── sqlite-jdbc.jar`,
      explanation: 'Clients can directly request public root assets, but any attempt to directly fetch resources within WEB-INF results in an immediate 404 Not Found by specification.',
      tokens: [
        { token: 'WEB-INF/', explanation: 'Protected directory holding private server-side code and descriptors' },
        { token: 'WEB-INF/classes/', explanation: 'Application bytecode loaded by the WebAppClassLoader' },
        { token: 'WEB-INF/lib/', explanation: 'Application-bundled external JAR dependencies' },
        { token: 'web.xml', explanation: 'Authoritative deployment descriptor configuring servlets, filters, and mappings' }
      ]
    },
    examples: [
      {
        id: 'ex-65-basic',
        title: 'Validating WAR Packaging Layout and Protected Boundaries',
        type: 'basic',
        description: 'Simulating the Servlet container verification rules for standard WAR directory layout.',
        filename: 'WarStructureValidatorDemo.java',
        code: `import java.util.List;

public class WarStructureValidatorDemo {
    public static void main(String[] args) {
        System.out.println("=== WAR Directory Structure Validator ===");
        List<String> warFiles = List.of(
            "index.html",
            "css/style.css",
            "WEB-INF/web.xml",
            "WEB-INF/classes/com/handbook/web/LifecycleServlet.class",
            "WEB-INF/lib/sqlite-jdbc.jar"
        );

        boolean hasWebInf = warFiles.stream().anyMatch(f -> f.startsWith("WEB-INF/"));
        boolean hasClasses = warFiles.stream().anyMatch(f -> f.startsWith("WEB-INF/classes/"));
        boolean hasDescriptor = warFiles.contains("WEB-INF/web.xml");

        System.out.println("Validating WAR Layout:");
        System.out.println("  WEB-INF Root Present:    " + hasWebInf);
        System.out.println("  WEB-INF/classes Present: " + hasClasses);
        System.out.println("  web.xml Deployment Desk: " + hasDescriptor);

        for (String file : warFiles) {
            boolean isProtected = file.startsWith("WEB-INF/");
            System.out.printf("  %-45s -> %s%n", file, isProtected ? "BLOCKED FROM DIRECT HTTP ACCESS" : "PUBLIC DIRECT ACCESS OK");
        }
        System.out.println("WAR structure validation completed successfully.");
    }
}`,
        output: `=== WAR Directory Structure Validator ===
Validating WAR Layout:
  WEB-INF Root Present:    true
  WEB-INF/classes Present: true
  web.xml Deployment Desk: true
  index.html                                    -> PUBLIC DIRECT ACCESS OK
  css/style.css                                 -> PUBLIC DIRECT ACCESS OK
  WEB-INF/web.xml                               -> BLOCKED FROM DIRECT HTTP ACCESS
  WEB-INF/classes/com/handbook/web/LifecycleServlet.class -> BLOCKED FROM DIRECT HTTP ACCESS
  WEB-INF/lib/sqlite-jdbc.jar                   -> BLOCKED FROM DIRECT HTTP ACCESS
WAR structure validation completed successfully.`,
        stepByStep: [
          'Inspects virtual file paths within a packaged Web Application Archive.',
          'Verifies standard WEB-INF, classes, and descriptor boundaries.',
          'Demonstrates the security enforcement restricting direct HTTP requests to WEB-INF.'
        ]
      },
      {
        id: 'ex-65-realistic',
        title: 'Tomcat Deployment and Catalina Hierarchy Inspector',
        type: 'realistic',
        description: 'Modeling the Apache Tomcat Catalina container component tree and web.xml parsing.',
        filename: 'TomcatDeploymentPackagerApp.java',
        code: `public class TomcatDeploymentPackagerApp {
    record ContainerLevel(String name, String role, String description) {}

    public static void main(String[] args) {
        System.out.println("=== Apache Tomcat Catalina Hierarchy ===");
        var hierarchy = java.util.List.of(
            new ContainerLevel("Server", "StandardServer", "Top-level JVM process container"),
            new ContainerLevel("Service", "StandardService", "Binds Connectors (HTTP/AJP) to an Engine"),
            new ContainerLevel("Connector", "CoyoteConnector", "Listens on port (e.g. 8080) for incoming TCP/HTTP requests"),
            new ContainerLevel("Engine", "StandardEngine", "Top-level pipeline processing requests for a virtual service"),
            new ContainerLevel("Host", "StandardHost", "Virtual host definition (e.g. localhost)"),
            new ContainerLevel("Context", "StandardContext", "Represents an individual deployed web application (e.g. /handbook)")
        );

        for (var level : hierarchy) {
            System.out.printf("  %-12s | %-20s -> %s%n", level.name(), level.role(), level.description());
        }

        System.out.println("\\nSample Minimal Jakarta EE 10 web.xml Descriptor:");
        String webXml = """
            <?xml version="1.0" encoding="UTF-8"?>
            <web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                                         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
                     version="6.0">
                <display-name>Java Handbook Demo</display-name>
            </web-app>
            """;
        System.out.println(webXml);
        System.out.println("Tomcat deployment package verification completed successfully.");
    }
}`,
        output: `=== Apache Tomcat Catalina Hierarchy ===
  Server       | StandardServer       -> Top-level JVM process container
  Service      | StandardService      -> Binds Connectors (HTTP/AJP) to an Engine
  Connector    | CoyoteConnector      -> Listens on port (e.g. 8080) for incoming TCP/HTTP requests
  Engine       | StandardEngine       -> Top-level pipeline processing requests for a virtual service
  Host         | StandardHost         -> Virtual host definition (e.g. localhost)
  Context      | StandardContext      -> Represents an individual deployed web application (e.g. /handbook)

Sample Minimal Jakarta EE 10 web.xml Descriptor:
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                             https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">
    <display-name>Java Handbook Demo</display-name>
</web-app>

Tomcat deployment package verification completed successfully.`,
        stepByStep: [
          'Outlines the Catalina architecture (Server -> Service -> Connector -> Engine -> Host -> Context).',
          'Details how an individual deployed WAR maps to a Tomcat StandardContext.',
          'Demonstrates the canonical XML schema definition for Jakarta EE 10 (version 6.0).'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Placing public assets (images, CSS, JS) inside the WEB-INF folder',
        errorCodeOrSnippet: 'GET /WEB-INF/style.css -> 404 Not Found',
        cause: 'Servlet containers strictly deny direct client HTTP requests to WEB-INF by specification.',
        solution: 'Place public assets at the WAR root or subdirectories like /css or /js outside WEB-INF.'
      },
      {
        title: 'Putting JAR dependencies directly in WEB-INF/classes instead of WEB-INF/lib',
        errorCodeOrSnippet: 'java.lang.NoClassDefFoundError',
        cause: 'Tomcat WebAppClassLoader cannot load compiled bytecode packaged inside nested JARs under classes/.',
        solution: 'Place compiled .class files in WEB-INF/classes and zipped .jar dependencies in WEB-INF/lib.'
      }
    ],
    bestPractices: {
      doList: [
        'Place internal JSP views, XML configurations, and private templates inside WEB-INF.',
        'Use Maven maven-war-plugin or Gradle war plugin for automated, reproducible packaging.',
        'Scope servlet container APIs (like jakarta.servlet-api) as provided in your build tool.'
      ],
      dontList: [
        'Do not store database passwords or cryptographic private keys in plaintext inside WAR files.',
        'Do not deploy duplicate versions of the same JAR across WEB-INF/lib and container lib/.',
        'Do not place user-uploaded files directly into the extracted WAR deployment directory.'
      ],
      whenNotToUse: 'Do not build fat WAR files for standalone microservices using Spring Boot or Quarkus unless deploying to a shared corporate application server pool.'
    },
    versionNotes: {
      introduced: 'WAR introduced in Servlet 2.2; modern Servlet 6.0 deployment descriptor schema in Jakarta EE 10',
      status: 'Stable',
      compatibilityNotes: 'WAR packaging is supported by Apache Tomcat 10.1+, Jetty 12+, and all Jakarta EE 10 certified application servers.',
      ltsAvailability: 'Update XML namespace schema in web.xml from javaee 4.0 (xmlns.jcp.org) to jakartaee 6.0 (jakarta.ee).'
    },
    cheatSheet: {
      title: 'Standard WAR Directory Structure',
      headers: ['Directory / File', 'Access Level', 'Content Type', 'Purpose'],
      rows: [
        ['WAR Root (/)', 'Public HTTP', 'HTML, CSS, JS, Images', 'Directly browser-accessible static web assets'],
        ['WEB-INF/', 'Protected (Private)', 'Config & Server Code', 'Invisible to direct URL requests; accessible only by server dispatch'],
        ['WEB-INF/web.xml', 'Protected', 'XML Deployment Descriptor', 'Configures servlets, filters, session timeouts, and error pages'],
        ['WEB-INF/classes/', 'Protected', 'Bytecode (.class)', 'Application compiled classes loaded by WebAppClassLoader'],
        ['WEB-INF/lib/', 'Protected', 'Third-party JARs', 'Packaged dependencies available on the web app classpath']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix Public Resource Location',
        prompt: 'A web app has an image located at `WEB-INF/images/logo.png`. The HTML uses `<img src="/images/logo.png">`, but returns 404. What is the bug?',
        starterCode: `// Directory:\n// myapp.war/WEB-INF/images/logo.png\n// HTML:\n<img src="images/logo.png" alt="Company Logo" />`,
        solution: `// Fix: Move the images directory to the public WAR root:\n// myapp.war/images/logo.png\n// HTML:\n<img src="images/logo.png" alt="Company Logo" />`,
        explanation: 'The Servlet specification forbids direct HTTP access to any resource within the WEB-INF directory.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'WAR Path Security Checker',
        prompt: 'Write a helper method `isPubliclyAccessible(String requestPath)` that returns false if the path points to WEB-INF or META-INF.',
        starterCode: `public static boolean isPubliclyAccessible(String path) {\n    // Return true if safe\n}`,
        solution: `public static boolean isPubliclyAccessible(String path) {\n    String normalized = path.toUpperCase();\n    return !normalized.startsWith("/WEB-INF") && !normalized.startsWith("/META-INF");\n}`,
        explanation: 'Servlet containers automatically reject any incoming URI matching WEB-INF or META-INF with HTTP 404.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Provided vs Compile Scope Dependencies',
        prompt: 'Why should `jakarta.servlet-api.jar` NEVER be placed in `WEB-INF/lib` when deploying to Apache Tomcat?',
        solution: `// Apache Tomcat already provides the Servlet API JAR in its own lib/ directory ($CATALINA_HOME/lib/servlet-api.jar).\n// Packaging servlet-api.jar inside WEB-INF/lib causes ClassCastException or LinkageError due to conflicting ClassLoaders.\n// In Maven, always declare this dependency with <scope>provided</scope>.`,
        explanation: 'Container-provided APIs must be scoped as "provided" to prevent duplicate class definition conflicts.'
      }
    ],
    officialSources: [
      {
        title: 'Apache Tomcat Documentation: Architecture & Catalina',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/architecture/overview.html',
        organization: 'Apache Tomcat'
      },
      {
        title: 'Jakarta Servlet Specification 6.0: Web Application Archive',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      }
    ]
  }
];

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

// If topics 63, 64, or 65 already exist from a prior append attempt, clean them up first
const idx63 = content.indexOf("    id: 'topic-63',");
const idx66 = content.indexOf("    id: 'topic-66',");

if (idx63 !== -1 && idx66 !== -1 && idx63 < idx66) {
  // Find opening brace of topic-63
  const startBrace = content.lastIndexOf('  {\n', idx63);
  const targetBrace = content.lastIndexOf('  {\n', idx66);
  content = content.substring(0, startBrace) + content.substring(targetBrace);
}

const targetMarker = "  {\n    id: 'topic-66',";
if (!content.includes(targetMarker)) {
  console.error('Target marker not found in topics.ts!');
  process.exit(1);
}

const formattedTopics = foundationsTopics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(',\n\n');

const replacement = formattedTopics + ',\n\n' + targetMarker;
content = content.replace(targetMarker, replacement);

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log('Successfully appended topics 63, 64, 65 into src/data/topics.ts with correct TypeScript types!');
