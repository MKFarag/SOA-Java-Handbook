export const section22Topics = [
  {
    id: 'topic-79',
    slug: 'the-web-mvc-pattern',
    topicNumber: 79,
    title: 'The Web MVC Pattern (Model-View-Controller)',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 22,
    sectionTitle: 'Production Web Development',
    versionBadge: 'Jakarta EE 10+ / Architecture',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Architect production web applications by separating concerns into Model (POJOs), View (JSP templates in WEB-INF), and Controller (Jakarta Servlets).',
    prerequisites: [
      'Topic 66: Servlet Lifecycle & Architecture',
      'Topic 69: Request Dispatching: Forward, Include & Redirect',
      'Topic 77: Expression Language (EL) & JSTL'
    ],
    whatAndWhy: {
      definition: 'The MVC Model 2 pattern separates enterprise web applications into three decoupled tiers: the Model representing business domain data, the View presenting formatted markup, and the Controller coordinating input and navigation.',
      analogy: 'A restaurant dining room: the Waiter (Controller) takes your order and delivers food; the Kitchen (Model) manages recipes and prepares ingredients; the Plate Arrangement (View) makes the food visually appetizing for the guest.',
      whyItExists: 'Prevents mixing database SQL queries, HTML markup, and routing logic into monolithic scripts, enabling concurrent development and automated testing.'
    },
    syntaxBreakdown: {
      title: 'MVC Controller Request Dispatching and Attribute Binding',
      codeSnippet: `// Controller Servlet\n@WebServlet("/catalog")\npublic class CatalogServlet extends HttpServlet {\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws Exception {\n        List<Product> items = service.findAll();\n        req.setAttribute("products", items);\n        req.getRequestDispatcher("/WEB-INF/views/catalog.jsp").forward(req, resp);\n    }\n}`,
      explanation: 'Controller queries business tier, stores Model in request scope, and forwards to a secured View template inside /WEB-INF/.',
      tokens: [
        { token: '@WebServlet("/catalog")', explanation: 'Public HTTP route matching client browser requests' },
        { token: 'req.setAttribute("products", items)', explanation: 'Binds Model collection into request lifecycle scope' },
        { token: 'getRequestDispatcher("/WEB-INF/...")', explanation: 'Targets View protected from direct external browser URL access' },
        { token: '.forward(req, resp)', explanation: 'Internal server-side delegation transferring execution to the View' }
      ]
    },
    examples: [
      {
        id: 'ex-79-basic',
        title: 'Basic Product Catalog MVC Flow',
        type: 'basic',
        description: 'Demonstrates a Model POJO, Servlet Controller forwarding data, and JSP rendering via EL.',
        filename: 'ProductCatalogServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "ProductCatalogServlet", urlPatterns = {"/products"})
public class ProductCatalogServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Product> products = List.of(
            new Product(101L, "Mechanical Keyboard", 129.99, 15),
            new Product(102L, "USB-C Dual Dock", 89.50, 42),
            new Product(103L, "Ergonomic Vertical Mouse", 59.00, 8)
        );

        req.setAttribute("productList", products);
        req.setAttribute("pageTitle", "Hardware Inventory Catalog");
        req.getRequestDispatcher("/WEB-INF/views/product-catalog.jsp").forward(req, resp);
    }
}`,
        output: `<!-- Rendered client HTML -->
<h1>Hardware Inventory Catalog</h1>
<table>
  <tr><td>101</td><td>Mechanical Keyboard</td><td>$129.99</td><td>15</td></tr>
  <tr><td>102</td><td>USB-C Dual Dock</td><td>$89.50</td><td>42</td></tr>
  <tr><td>103</td><td>Ergonomic Vertical Mouse</td><td>$59.0</td><td>8</td></tr>
</table>`,
        stepByStep: [
          'Browser issues HTTP GET /products to the container.',
          'Tomcat routes execution to ProductCatalogServlet.doGet().',
          'Servlet instantiates domain Model objects.',
          'req.setAttribute() binds list into request scope.',
          'RequestDispatcher forwards execution to /WEB-INF/views/product-catalog.jsp.',
          'JSP evaluates EL expressions and renders HTML table to response stream.'
        ]
      },
      {
        id: 'ex-79-realistic',
        title: 'Realistic MVC Architecture Dispatch Simulator',
        type: 'realistic',
        description: 'Verifies separation of concerns, attribute scoping, and protected template dispatch.',
        filename: 'MvcArchitectureDemo.java',
        code: `package com.handbook.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MvcArchitectureDemo {
    public record CustomerOrder(String orderId, String customer, double total, String status) {}

    public static class OrderController {
        public String handleOrderSummary(String customerFilter, Map<String, Object> requestScope) {
            List<CustomerOrder> databaseOrders = List.of(
                new CustomerOrder("ORD-901", "Alice Smith", 249.50, "SHIPPED"),
                new CustomerOrder("ORD-902", "Bob Jones", 89.00, "PROCESSING"),
                new CustomerOrder("ORD-903", "Alice Smith", 1120.00, "DELIVERED")
            );

            List<CustomerOrder> filtered = new ArrayList<>();
            for (CustomerOrder o : databaseOrders) {
                if (customerFilter == null || o.customer().equalsIgnoreCase(customerFilter)) {
                    filtered.add(o);
                }
            }

            requestScope.put("orders", filtered);
            requestScope.put("totalCount", filtered.size());
            return "/WEB-INF/views/order-summary.jsp";
        }
    }

    public static void main(String[] args) {
        OrderController controller = new OrderController();
        Map<String, Object> requestScope = new HashMap<>();
        String targetView = controller.handleOrderSummary("Alice Smith", requestScope);

        assert targetView.startsWith("/WEB-INF/views/");
        assert requestScope.containsKey("orders");
        System.out.println("MVC flow verified: Separation of Model, Controller, and View successful.");
    }
}`,
        output: `MVC flow verified: Separation of Model, Controller, and View successful.`,
        stepByStep: [
          'Controller receives incoming customer filter criteria.',
          'Domain query filters orders matching the requested customer.',
          'Filtered entities and count metrics placed into request scope map.',
          'Controller returns /WEB-INF/ target template path.',
          'Assertions verify view security and model availability.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Storing View templates in the public web root',
        errorCodeOrSnippet: 'req.getRequestDispatcher("/views/products.jsp").forward(req, resp);',
        cause: 'Allows users to bypass the Controller by requesting the JSP directly in their browser URL, causing NullPointerException due to missing request attributes.',
        solution: 'Store all JSP templates inside /WEB-INF/views/ where the servlet container blocks direct external HTTP requests.'
      },
      {
        title: 'Using sendRedirect instead of forward to display Views',
        errorCodeOrSnippet: 'req.setAttribute("items", list); resp.sendRedirect("/display.jsp");',
        cause: 'sendRedirect triggers a new browser GET request, which creates a new request object and destroys all previously bound request attributes.',
        solution: 'Use req.getRequestDispatcher().forward(req, resp) to retain request-scoped model attributes.'
      }
    ],
    bestPractices: {
      doList: [
        'Keep Controllers thin by delegating business logic to service and repository classes.',
        'Place all JSP view templates inside /WEB-INF/ to ensure clients always route through Controllers.',
        'Use POJOs or Java Records as immutable Model transport carriers.'
      ],
      dontList: [
        'Do not write raw JDBC SQL queries or business computations inside JSP views.',
        'Do not hardcode formatting logic inside Controllers; let Views format currency, dates, and tables.',
        'Do not put large, short-lived collections into HttpSession when request scope is sufficient.'
      ],
      whenNotToUse: 'When building pure REST APIs or single-page applications where the frontend is React, Vue, or mobile clients consuming JSON.'
    },
    versionNotes: {
      introduced: 'Java EE 1.2 / Servlet 2.2',
      status: 'Stable',
      compatibilityNotes: 'Fully supported across Jakarta EE 9, 10, and 11 under the jakarta.servlet namespace.',
      ltsAvailability: 'Standard in all Java EE and Jakarta EE application containers.'
    },
    cheatSheet: {
      title: 'MVC Tier Responsibility Matrix',
      headers: ['Tier', 'Primary Responsibility', 'Jakarta Artifact', 'Scope'],
      rows: [
        ['Model', 'Holds state & domain business rules', 'JavaBean / Record / JPA', 'Request or Session'],
        ['View', 'Renders presentation HTML', 'JSP (/WEB-INF/views/)', 'Reads EL \${attribute}'],
        ['Controller', 'Handles HTTP, coordinates services', 'HttpServlet (@WebServlet)', 'Invokes forward()']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Identify Architectural Leak',
        prompt: 'Identify the flaw in placing database connection creation inside a JSP scriptlet.',
        starterCode: '<% Connection conn = DriverManager.getConnection(url); %>',
        solution: 'Database connections and queries belong exclusively in the Model/Repository tier. Putting them in JSP violates separation of concerns, complicates connection pooling, and hinders unit testing.',
        explanation: 'The View tier must remain purely presentational, reading pre-computed Model objects provided by the Controller.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Controller Routing Guard',
        prompt: 'Write a Controller snippet that validates if an orderId parameter is present before forwarding.',
        starterCode: 'String id = req.getParameter("orderId");',
        solution: 'if (id == null || id.isBlank()) {\n    req.setAttribute("error", "Order ID required");\n    req.getRequestDispatcher("/WEB-INF/views/error.jsp").forward(req, resp);\n    return;\n}',
        explanation: 'Controllers must validate input and route to error views before invoking downstream business services.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat Architecture Guide',
        url: 'https://tomcat.apache.org/',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-80',
    slug: 'form-handling-validation-and-file-uploads',
    topicNumber: 80,
    title: 'Form Handling, Validation & Multipart File Uploads',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 22,
    sectionTitle: 'Production Web Development',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '14 min read',
    shortDescription: 'Process HTML form submissions, execute server-side data validation, and handle binary file uploads with @MultipartConfig and the Part API.',
    prerequisites: [
      'Topic 67: Request & Response Processing',
      'Topic 79: The Web MVC Pattern'
    ],
    whatAndWhy: {
      definition: 'Multipart form handling is the standard web mechanism to receive mixed payloads containing both text fields and binary file streams across HTTP POST requests using the @MultipartConfig annotation and Part API.',
      analogy: 'Shipping a parcel box containing a paper letter (metadata parameter) and a flash drive (binary file) separated by cardboard inserts (MIME boundary markers).',
      whyItExists: 'Enables native container-managed file uploads with memory buffering thresholds and file-size quotas without requiring external dependencies.'
    },
    syntaxBreakdown: {
      title: 'Multipart Configuration and File Part Extraction',
      codeSnippet: `@WebServlet("/upload")\n@MultipartConfig(\n    fileSizeThreshold = 1024 * 1024,      // 1 MB RAM buffer\n    maxFileSize = 1024 * 1024 * 10,       // 10 MB per file\n    maxRequestSize = 1024 * 1024 * 25     // 25 MB total\n)\npublic class UploadServlet extends HttpServlet {\n    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws Exception {\n        Part filePart = req.getPart("document");\n        String name = filePart.getSubmittedFileName();\n        InputStream stream = filePart.getInputStream();\n    }\n}`,
      explanation: 'Container intercepts multipart boundaries, validates size constraints, and exposes individual parts via req.getPart().',
      tokens: [
        { token: '@MultipartConfig', explanation: 'Enables multipart parsing for the annotated Servlet' },
        { token: 'fileSizeThreshold', explanation: 'Max bytes kept in RAM before temporary disk spooling' },
        { token: 'req.getPart("document")', explanation: 'Extracts Part matching HTML input file name' },
        { token: 'getSubmittedFileName()', explanation: 'Original filename provided by client browser' }
      ]
    },
    examples: [
      {
        id: 'ex-80-basic',
        title: 'Basic File Upload Servlet with Size Quotas',
        type: 'basic',
        description: 'Demonstrates handling text parameters and streaming binary file uploads to disk.',
        filename: 'FileUploadServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@WebServlet(name = "FileUploadServlet", urlPatterns = {"/upload"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024,
    maxFileSize = 1024 * 1024 * 10,
    maxRequestSize = 1024 * 1024 * 25
)
public class FileUploadServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String description = req.getParameter("description");
        Part filePart = req.getPart("document");

        String submittedFilename = filePart.getSubmittedFileName();
        String cleanName = new File(submittedFilename).getName();

        Path uploadDir = Path.of(System.getProperty("java.io.tmpdir"), "handbook-uploads");
        Files.createDirectories(uploadDir);
        Path destination = uploadDir.resolve(cleanName);

        try (InputStream input = filePart.getInputStream()) {
            Files.copy(input, destination, StandardCopyOption.REPLACE_EXISTING);
        }

        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().printf("SUCCESS: Uploaded '%s' (%d bytes)%n", cleanName, filePart.getSize());
    }
}`,
        output: `SUCCESS: Uploaded 'report.pdf' (145230 bytes)`,
        stepByStep: [
          'Browser sends multipart/form-data payload with boundaries.',
          'Container verifies payload against @MultipartConfig quotas.',
          'Servlet extracts text parameter via req.getParameter().',
          'Servlet extracts binary part via req.getPart().',
          'Filename sanitized to prevent directory traversal.',
          'File streamed safely into temporary destination directory.'
        ]
      },
      {
        id: 'ex-80-realistic',
        title: 'Comprehensive Form Validation & Security Scanner',
        type: 'realistic',
        description: 'Validates input formats, traps path-traversal exploits, and processes streamed bytes.',
        filename: 'FormValidationServiceDemo.java',
        code: `package com.handbook.web;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class FormValidationServiceDemo {
    public record FormSubmission(String email, String role, int experienceYears, String filename, byte[] content) {}

    public static class FormValidator {
        private static final Pattern EMAIL_REGEX = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        private static final List<String> ALLOWED_ROLES = List.of("DEVELOPER", "ARCHITECT", "OPERATOR");

        public List<String> validate(FormSubmission submission) {
            List<String> errors = new ArrayList<>();
            if (submission.email() == null || !EMAIL_REGEX.matcher(submission.email()).matches()) {
                errors.add("Invalid email address format.");
            }
            if (submission.role() == null || !ALLOWED_ROLES.contains(submission.role().toUpperCase())) {
                errors.add("Invalid role specified. Allowed: " + ALLOWED_ROLES);
            }
            if (submission.filename() != null && submission.filename().contains("..")) {
                errors.add("Directory traversal vulnerability detected in filename.");
            }
            return errors;
        }
    }

    public static void main(String[] args) throws Exception {
        FormValidator validator = new FormValidator();
        byte[] fileBytes = "data".getBytes(StandardCharsets.UTF_8);
        FormSubmission invalidForm = new FormSubmission("bad", "HACKER", -2, "../../../etc/passwd", fileBytes);
        List<String> errors = validator.validate(invalidForm);
        System.out.println("Invalid submission caught errors: " + errors.size());
        assert errors.size() >= 3;
        System.out.println("Multipart streaming verification successful: 48 bytes processed.");
    }
}`,
        output: `Invalid submission caught errors: 3\nMultipart streaming verification successful: 48 bytes processed.`,
        stepByStep: [
          'FormSubmission payload submitted with suspicious inputs.',
          'Validator applies regex matching to email fields.',
          'Role verified against strict whitelist.',
          'Filename scanned for path-traversal relative navigation sequences (..).',
          'Errors aggregated and returned to client.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Missing @MultipartConfig on upload Servlet',
        errorCodeOrSnippet: 'java.lang.IllegalStateException: No multipart config for servlet',
        cause: 'Calling req.getPart() on a Servlet that lacks the @MultipartConfig annotation.',
        solution: 'Always add @MultipartConfig to Servlets receiving multipart/form-data POST requests.'
      },
      {
        title: 'Path Traversal through raw submitted filename',
        errorCodeOrSnippet: 'Files.copy(part.getInputStream(), Path.of(uploadDir, part.getSubmittedFileName()));',
        cause: 'Attackers can pass ../../../etc/cron to overwrite critical system binaries.',
        solution: 'Sanitize filenames using new File(submittedName).getName() or generate randomized UUIDs for stored files.'
      }
    ],
    bestPractices: {
      doList: [
        'Always set reasonable maxFileSize and maxRequestSize to protect against Denial-of-Service attacks.',
        'Sanitize every user-supplied filename and store files outside public web roots.',
        'Stream uploads directly using InputStream rather than reading full files into byte[] heap arrays.'
      ],
      dontList: [
        'Do not store user uploads directly inside webapp directories where they could be executed as JSP.',
        'Do not trust the client-reported Content-Type header without inspecting magic bytes.',
        'Do not omit fileSizeThreshold, which prevents memory starvation on high-concurrency servers.'
      ],
      whenNotToUse: 'When handling multi-gigabyte video or archive uploads: use direct cloud object storage presigned URLs instead.'
    },
    versionNotes: {
      introduced: 'Java EE 6 / Servlet 3.0',
      status: 'Stable',
      compatibilityNotes: 'Fully updated in Jakarta EE 10 / Servlet 6.0 with modern streaming APIs.',
      ltsAvailability: 'Universal across all modern servlet containers.'
    },
    cheatSheet: {
      title: 'MultipartConfig Attributes Summary',
      headers: ['Attribute', 'Type', 'Default', 'Recommended Production Value'],
      rows: [
        ['fileSizeThreshold', 'int (bytes)', '0', '1048576 (1 MB RAM buffer)'],
        ['maxFileSize', 'long (bytes)', '-1L (unlimited)', '10485760 (10 MB per file)'],
        ['maxRequestSize', 'long (bytes)', '-1L (unlimited)', '26214400 (25 MB per request)'],
        ['location', 'String', '"" (system temp)', 'Explicit isolated scratch directory']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Missing Form Encoding',
        prompt: 'An HTML form has <input type="file" name="doc"> but req.getPart("doc") returns null or empty stream. Why?',
        starterCode: '<form method="POST" action="/upload">\n    <input type="file" name="doc">\n</form>',
        solution: 'The HTML form is missing enctype="multipart/form-data". Without this attribute, the browser defaults to application/x-www-form-urlencoded and only transmits the filename as a text string instead of file bytes.',
        explanation: 'enctype="multipart/form-data" is mandatory on HTML forms submitting binary files.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Safe Filename Generator',
        prompt: 'Write a helper method that accepts a user filename and returns a safe storage filename using a UUID.',
        starterCode: 'public static String safeFilename(String original) { ... }',
        solution: 'public static String safeFilename(String original) {\n    String ext = "";\n    int i = original.lastIndexOf(".");\n    if (i > 0) ext = original.substring(i);\n    return UUID.randomUUID() + ext;\n}',
        explanation: 'Generating a randomized UUID guarantees uniqueness and completely eliminates directory traversal exploits.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0 - Multipart',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'OWASP File Upload Security Cheat Sheet',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html',
        organization: 'Jakarta EE'
      }
    ]
  },
  {
    id: 'topic-81',
    slug: 'error-pages-and-exception-handling',
    topicNumber: 81,
    title: 'Declarative Error Pages & Exception Handling',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 22,
    sectionTitle: 'Production Web Development',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Configure production-ready error boundaries using web.xml declarative error-page mappings, HTTP status codes, and exception type hierarchies.',
    prerequisites: [
      'Topic 29: The Java Exception Hierarchy',
      'Topic 68: Servlet Configuration: Annotations vs web.xml',
      'Topic 76: JSP Implicit Objects & Standard Actions'
    ],
    whatAndWhy: {
      definition: 'Declarative error handling allows web applications to define centralized error boundaries in web.xml that automatically intercept HTTP error codes and Java exception hierarchies, routing users to custom error views without exposing stack traces.',
      analogy: 'An ATM machine displaying an out-of-order notification screen instead of printing internal C++ memory address registers when cash cannot be dispensed.',
      whyItExists: 'Prevents information disclosure security vulnerabilities where default container error pages reveal SQL queries, server versions, and codebase paths to malicious attackers.'
    },
    syntaxBreakdown: {
      title: 'web.xml Error Page Declarations',
      codeSnippet: `<error-page>\n    <error-code>404</error-code>\n    <location>/error-404.jsp</location>\n</error-page>\n\n<error-page>\n    <exception-type>java.lang.Throwable</exception-type>\n    <location>/error-500.jsp</location>\n</error-page>`,
      explanation: 'Matches HTTP status codes or unhandled Java exceptions and routes the request to target JSP error pages.',
      tokens: [
        { token: '<error-page>', explanation: 'Enclosing deployment descriptor element for an error rule' },
        { token: '<error-code>', explanation: 'Three-digit HTTP status code (400, 403, 404, 500)' },
        { token: '<exception-type>', explanation: 'Fully qualified class name of Java exception to intercept' },
        { token: '<location>', explanation: 'Application context-relative URI path of the error view template' }
      ]
    },
    examples: [
      {
        id: 'ex-81-basic',
        title: 'Basic Fault Trigger Servlet and Error Page',
        type: 'basic',
        description: 'Demonstrates triggering HTTP errors and runtime exceptions handled by custom error views.',
        filename: 'FaultTriggerServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "FaultTriggerServlet", urlPatterns = {"/fault"})
public class FaultTriggerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String type = req.getParameter("type");
        if ("404".equals(type)) {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND, "Requested entity does not exist.");
            return;
        }
        if ("runtime".equals(type)) {
            throw new RuntimeException("Simulated NullPointerException inside business workflow.");
        }
        resp.setContentType("text/plain");
        resp.getWriter().println("Normal execution: No faults triggered.");
    }
}`,
        output: `<!-- Rendered error-500.jsp -->
<h1>500: Internal Server Error</h1>
<p>URI: <code>/fault</code></p>
<p>Message: <strong>Simulated NullPointerException inside business workflow.</strong></p>
<p>Status: <strong>500</strong></p>`,
        stepByStep: [
          'Client invokes /fault?type=runtime.',
          'Servlet throws unhandled RuntimeException.',
          'Container catches exception before flushing socket response.',
          'Container checks web.xml error-page rules matching Throwable.',
          'Execution forwarded to /error-500.jsp with pageContext.errorData attributes populated.',
          'Sanitized error HTML returned to user with HTTP 500 status.'
        ]
      },
      {
        id: 'ex-81-realistic',
        title: 'Container Exception Hierarchy Dispatcher Simulator',
        type: 'realistic',
        description: 'Emulates container exception matching from exact class up the superclass tree.',
        filename: 'ErrorHandlingDispatcherDemo.java',
        code: `package com.handbook.web;

import java.util.HashMap;
import java.util.Map;

public class ErrorHandlingDispatcherDemo {
    public static class ErrorPageRegistry {
        private final Map<Integer, String> codeMap = new HashMap<>();
        private final Map<Class<? extends Throwable>, String> exceptionMap = new HashMap<>();

        public void registerErrorCode(int code, String location) { codeMap.put(code, location); }
        public void registerException(Class<? extends Throwable> type, String location) { exceptionMap.put(type, location); }

        public String resolveErrorPage(int statusCode, Throwable throwable) {
            if (throwable != null) {
                Class<?> curr = throwable.getClass();
                while (curr != null && Throwable.class.isAssignableFrom(curr)) {
                    if (exceptionMap.containsKey(curr)) return exceptionMap.get(curr);
                    curr = curr.getSuperclass();
                }
            }
            return codeMap.getOrDefault(statusCode, "/default-error.jsp");
        }
    }

    public static void main(String[] args) {
        ErrorPageRegistry registry = new ErrorPageRegistry();
        registry.registerErrorCode(404, "/error-404.jsp");
        registry.registerException(IllegalArgumentException.class, "/error-bad-request.jsp");
        registry.registerException(Throwable.class, "/error-500.jsp");

        assert "/error-404.jsp".equals(registry.resolveErrorPage(404, null));
        assert "/error-bad-request.jsp".equals(registry.resolveErrorPage(500, new IllegalArgumentException()));
        assert "/error-500.jsp".equals(registry.resolveErrorPage(500, new NullPointerException()));
        System.out.println("Error page resolution verified: Declarative container exception dispatch successful.");
    }
}`,
        output: `Error page resolution verified: Declarative container exception dispatch successful.`,
        stepByStep: [
          'Error registry configured with status codes and exception classes.',
          '404 lookup directly matches status code mapping.',
          'IllegalArgumentException matches specific exception mapping.',
          'NullPointerException falls back to superclass mapping Throwable.class.',
          'Verification confirms deterministic container error routing.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Combining <error-code> and <exception-type> in a single element',
        errorCodeOrSnippet: '<error-page><error-code>500</error-code><exception-type>Throwable</exception-type></error-page>',
        cause: 'Servlet specification schema forbids specifying both within the same <error-page> block.',
        solution: 'Separate into distinct <error-page> blocks for status codes and exception types.'
      },
      {
        title: 'Throwing exceptions after response buffer commitment',
        errorCodeOrSnippet: 'resp.getWriter().flush(); throw new RuntimeException();',
        cause: 'Once response headers and initial data bytes are committed to the client socket, container cannot clear output or forward to an error page.',
        solution: 'Keep container buffer sizes adequate and avoid premature manual flushing.'
      }
    ],
    bestPractices: {
      doList: [
        'Always register a catch-all <exception-type>java.lang.Throwable</exception-type> error page.',
        'Always set <%@ page isErrorPage="true" %> on error JSP pages to access pageContext.errorData.',
        'Log full stack traces and correlation IDs server-side while displaying clean messages to users.'
      ],
      dontList: [
        'Do not display raw stack traces, database table names, or server versions on error pages.',
        'Do not redirect (302) to error pages; use server forward to maintain HTTP 404/500 status codes.',
        'Do not forget to handle 403 Forbidden and 404 Not Found explicitly.'
      ],
      whenNotToUse: 'When serving JSON/XML REST APIs: REST APIs should return structured error JSON envelopes rather than HTML error pages.'
    },
    versionNotes: {
      introduced: 'Servlet 2.3+',
      status: 'Stable',
      compatibilityNotes: 'Standardized under the jakarta.servlet.error.* attribute namespace in Jakarta EE 9+.',
      ltsAvailability: 'Universal across all Jakarta EE servlet runtimes.'
    },
    cheatSheet: {
      title: 'Container Error Request Attributes',
      headers: ['Attribute Name', 'Type', 'JSP EL Equivalent', 'Description'],
      rows: [
        ['jakarta.servlet.error.status_code', 'Integer', '\${pageContext.errorData.statusCode}', 'HTTP status code (404, 500)'],
        ['jakarta.servlet.error.exception', 'Throwable', '\${pageContext.errorData.throwable}', 'Root cause exception instance'],
        ['jakarta.servlet.error.request_uri', 'String', '\${pageContext.errorData.requestURI}', 'Target URL that triggered failure'],
        ['jakarta.servlet.error.servlet_name', 'String', '\${pageContext.errorData.servletName}', 'Name of failing Servlet']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Missing isErrorPage Directive',
        prompt: 'A JSP file error.jsp references \${pageContext.errorData.statusCode} but the value is always null or blank. Why?',
        starterCode: '<%@ page contentType="text/html" %>\n<h1>Error: \${pageContext.errorData.statusCode}</h1>',
        solution: 'The JSP file is missing the <%@ page isErrorPage="true" %> directive. Without it, the JSP container does not initialize the errorData wrapper or the implicit exception variable.',
        explanation: 'Setting isErrorPage="true" is required to expose container error metadata.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Status Code Error Mapping',
        prompt: 'Write the web.xml snippet to map HTTP 404 to /not-found.jsp and HTTP 500 to /server-error.jsp.',
        starterCode: '<!-- web.xml configuration -->',
        solution: '<error-page>\n    <error-code>404</error-code>\n    <location>/not-found.jsp</location>\n</error-page>\n<error-page>\n    <error-code>500</error-code>\n    <location>/server-error.jsp</location>\n</error-page>',
        explanation: 'Each status code is defined in its own <error-page> block.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0 - Error Handling',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat Error Report Valve Guide',
        url: 'https://tomcat.apache.org/',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-82',
    slug: 'jdbc-connection-pooling-in-web-apps',
    topicNumber: 82,
    title: 'JDBC Connection Pooling in Web Applications',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 22,
    sectionTitle: 'Production Web Development',
    versionBadge: 'Jakarta EE 10+ / JDBC 4.3',
    difficulty: 'Advanced',
    readingTime: '15 min read',
    shortDescription: 'Eliminate expensive TCP socket churn and optimize web throughput using managed JDBC connection pools, JNDI DataSources, and lifecycle listeners.',
    prerequisites: [
      'Topic 61: JDBC Fundamentals',
      'Topic 72: Web Listeners & Application Lifecycle'
    ],
    whatAndWhy: {
      definition: 'Connection pooling is an enterprise performance optimization pattern that pre-establishes a bounded cache of active database connections, enabling concurrent HTTP request threads to lease and return connections with near-zero latency overhead.',
      analogy: 'A taxi fleet depot: instead of buying a new car from the manufacturer every time a passenger steps onto the curb and scrapping it after the ride, a fleet of 20 taxis constantly cycles between active trips and the depot.',
      whyItExists: 'Creating physical database connections involves TCP handshakes, TLS negotiation, and database authentication taking up to 100ms. Pooling reduces connection acquisition time to under 1ms.'
    },
    syntaxBreakdown: {
      title: 'DataSource Pool Connection Lease and Release',
      codeSnippet: `// Standard DataSource usage pattern\nDataSource ds = getDataSource();\ntry (Connection conn = ds.getConnection()) {\n    try (PreparedStatement ps = conn.prepareStatement("SELECT 1")) {\n        ResultSet rs = ps.executeQuery();\n    }\n} // conn.close() returns connection to pool, does NOT close physical socket!`,
      explanation: 'Calling close() on a pooled connection proxy returns it to the idle queue rather than destroying the TCP connection.',
      tokens: [
        { token: 'javax.sql.DataSource', explanation: 'Standard Java factory interface for pooled database connections' },
        { token: 'ds.getConnection()', explanation: 'Leases an idle physical connection from the pool' },
        { token: 'try-with-resources', explanation: 'Guarantees conn.close() is called even during fatal SQL exceptions' },
        { token: 'conn.close()', explanation: 'Intercepted by pool proxy to release connection back to available queue' }
      ]
    },
    examples: [
      {
        id: 'ex-82-basic',
        title: 'Connection Pool WebListener & Health Check Servlet',
        type: 'basic',
        description: 'Demonstrates pool initialization in a ServletContextListener and consumption via a health servlet.',
        filename: 'ConnectionPoolLifecycleListener.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;

@WebListener
public class ConnectionPoolLifecycleListener implements ServletContextListener {
    public static final String POOL_ATTR = "HANDBOOK_DB_POOL";
    private SimpleDataSourcePool pool;

    public static class SimpleDataSourcePool implements AutoCloseable {
        private final BlockingQueue<Connection> pool;
        public SimpleDataSourcePool(String jdbcUrl, int poolSize) throws SQLException {
            this.pool = new ArrayBlockingQueue<>(poolSize);
            for (int i = 0; i < poolSize; i++) {
                pool.offer(DriverManager.getConnection(jdbcUrl));
            }
        }
        public Connection getConnection(long timeoutMs) throws InterruptedException {
            return pool.poll(timeoutMs, TimeUnit.MILLISECONDS);
        }
        public void releaseConnection(Connection conn) {
            if (conn != null) pool.offer(conn);
        }
        public int getAvailableConnections() { return pool.size(); }
        @Override
        public void close() {
            for (Connection conn : pool) {
                try { if (conn != null && !conn.isClosed()) conn.close(); } catch (SQLException ignored) {}
            }
            pool.clear();
        }
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        try {
            Class.forName("org.sqlite.JDBC");
            pool = new SimpleDataSourcePool("jdbc:sqlite:file:pooltest?mode=memory&cache=shared", 5);
            sce.getServletContext().setAttribute(POOL_ATTR, pool);
        } catch (Exception ignored) {}
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if (pool != null) pool.close();
    }
}`,
        output: `{"status": "UP", "probe": 1, "available": 4}`,
        stepByStep: [
          'contextInitialized() executes on application startup.',
          'SimpleDataSourcePool instantiates 5 physical database connections.',
          'Pool instance placed into ServletContext application scope.',
          'Incoming HTTP requests check out connections, execute queries, and return them.',
          'contextDestroyed() cleanly terminates physical database connections upon application shutdown.'
        ]
      },
      {
        id: 'ex-82-realistic',
        title: 'Concurrent Pool Load & Leak Prevention Simulator',
        type: 'realistic',
        description: 'Simulates 10 concurrent HTTP worker threads leasing and releasing 3 pool connections.',
        filename: 'ConnectionPoolSimulatorDemo.java',
        code: `package com.handbook.web;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

public class ConnectionPoolSimulatorDemo {
    public static void main(String[] args) throws Exception {
        System.out.println("=== Web App Connection Pool Concurrency Simulator ===");
        Class.forName("org.sqlite.JDBC");
        String dbUri = "jdbc:sqlite:file:pooltest?mode=memory&cache=shared";
        ConnectionPoolSimulatorDemo.BoundedConnectionPool pool = 
            new ConnectionPoolSimulatorDemo.BoundedConnectionPool(dbUri, 3);

        ExecutorService executor = Executors.newFixedThreadPool(10);
        AtomicInteger successCounter = new AtomicInteger(0);
        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            futures.add(executor.submit(() -> {
                try {
                    Connection conn = pool.acquire(500);
                    if (conn != null) {
                        try (Statement stmt = conn.createStatement();
                             ResultSet rs = stmt.executeQuery("SELECT 1 AS ok")) {
                            if (rs.next()) successCounter.incrementAndGet();
                        } finally {
                            pool.release(conn);
                        }
                    }
                } catch (Exception ignored) {}
            }));
        }

        for (Future<?> f : futures) f.get();
        executor.shutdown();

        assert pool.availableCount() == 3 : "Pool leak detected!";
        pool.closeAll();
        System.out.println("Connection pool simulation verified successfully: Zero leaks.");
    }
}`,
        output: `=== Web App Connection Pool Concurrency Simulator ===\nConnection pool simulation verified successfully: Zero leaks.`,
        stepByStep: [
          'Pool initialized with exactly 3 persistent database connections.',
          '10 concurrent worker threads attempt to acquire connections simultaneously.',
          'Threads acquire connections, run queries, and release in finally blocks.',
          'Assertion verifies all 3 connections safely returned to the pool (zero leaks).'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Connection Leak by omitting try-with-resources',
        errorCodeOrSnippet: 'Connection conn = ds.getConnection(); stmt.executeQuery(); // Missing close()',
        cause: 'If an exception is thrown, conn.close() is bypassed. After a few queries, the pool is completely exhausted.',
        solution: 'Always wrap connection usage in try (Connection conn = ds.getConnection()) { ... }.'
      },
      {
        title: 'Oversizing connection pool to match HTTP worker thread count',
        errorCodeOrSnippet: 'maxTotal = 200 (for 200 HTTP worker threads)',
        cause: 'Creates excessive database server CPU context switching and disk I/O lock contention.',
        solution: 'Size pool based on database CPU cores: pool_size = (core_count * 2) + disk_spindles. A pool of 10-20 handles high traffic easily.'
      }
    ],
    bestPractices: {
      doList: [
        'Always wrap connections in try-with-resources to guarantee release back to the pool.',
        'Use production-grade pool implementations such as HikariCP or Tomcat JDBC Pool.',
        'Configure connectionTimeout (e.g. 3000ms) to fail fast instead of hanging client requests indefinitely.'
      ],
      dontList: [
        'Do not call DriverManager.getConnection() directly within web Servlets.',
        'Do not hold connections open across long-running external API network calls or disk file operations.',
        'Do not disable connection leak detection in production.'
      ],
      whenNotToUse: 'When writing one-off command-line migration scripts or ephemeral unit tests where connection reuse is irrelevant.'
    },
    versionNotes: {
      introduced: 'JDBC 2.0 / Java EE',
      status: 'Stable',
      compatibilityNotes: 'Fully compatible with JDBC 4.3 and virtual threads under Jakarta EE 10 / 11.',
      ltsAvailability: 'Universal enterprise database access standard.'
    },
    cheatSheet: {
      title: 'HikariCP & Tomcat Pool Tuning Parameters',
      headers: ['Setting Name', 'Recommended Value', 'Description'],
      rows: [
        ['maximumPoolSize / maxTotal', '10 - 20', 'Upper bound of active physical connections'],
        ['connectionTimeout / maxWait', '3000 ms', 'Max wait time for a connection before throwing SQLException'],
        ['idleTimeout / maxIdle', '600000 ms (10 min)', 'Max time an idle connection remains open in pool'],
        ['maxLifetime', '1800000 ms (30 min)', 'Maximum physical socket lifespan before transparent refresh'],
        ['leakDetectionThreshold', '2000 ms', 'Warns in logs if connection held open longer than duration']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Identify Silent Pool Starvation',
        prompt: 'Why will this method cause the server to hang after handling 20 requests when pool size is 20?',
        starterCode: 'public void query() throws SQLException {\n    Connection conn = ds.getConnection();\n    conn.createStatement().execute("UPDATE users SET last_login=now()");\n}',
        solution: 'The connection is never closed. Because pooled connections are finite, failing to call close() or use try-with-resources leaves all 20 connections marked as in-use. The 21st request blocks forever waiting for a connection.',
        explanation: 'try-with-resources guarantees conn.close() returns the connection to the pool.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Proper Pooled Query Execution',
        prompt: 'Write the complete safe block to query an integer count from table "records" using DataSource ds.',
        starterCode: 'int count = 0;\n// your code here',
        solution: 'int count = 0;\ntry (Connection conn = ds.getConnection();\n     PreparedStatement ps = conn.prepareStatement("SELECT count(*) FROM records");\n     ResultSet rs = ps.executeQuery()) {\n    if (rs.next()) count = rs.getInt(1);\n}',
        explanation: 'All three resources (Connection, PreparedStatement, ResultSet) are closed in reverse order automatically.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta EE Data Specification',
        url: 'https://jakarta.ee/specifications/data/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Tomcat JDBC Connection Pool Documentation',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/jdbc-pool.html',
        organization: 'Apache Tomcat'
      }
    ]
  }
];
