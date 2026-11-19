import fs from 'fs';
import path from 'path';

const servletsDeepDiveTopics = [
  {
    id: 'topic-67',
    slug: 'request-and-response-processing',
    topicNumber: 67,
    title: 'Request and Response Processing in Servlets',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 19,
    sectionTitle: 'Servlets Deep Dive',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master parameter parsing, request and response headers, status codes, character encoding, and input/output payload streams in Jakarta Servlets.',
    prerequisites: [
      'Topic 64: Web Architecture Fundamentals (HTTP Protocol)',
      'Topic 66: Servlet Lifecycle & Architecture'
    ],
    whatAndWhy: {
      definition: 'HttpServletRequest and HttpServletResponse are the foundational object abstractions provided by the Servlet container to inspect client data (parameters, headers, streams) and format outgoing server responses (status codes, headers, response streams).',
      analogy: 'A border customs inspection: the incoming passenger declaration card (HttpServletRequest) records traveller identity and baggage items. The official stamped entry visa (HttpServletResponse) records the approval code and validity terms before the passenger passes through.',
      whyItExists: 'Eliminates low-level TCP socket parsing, percent-encoding decoding, and manual header formatting, giving developers a structured Java API for processing HTTP traffic.'
    },
    syntaxBreakdown: {
      title: 'Request Extraction and Response Configuration API',
      codeSnippet: `// 1. Reading incoming parameter and headers\nString user = req.getParameter("username");\nString auth = req.getHeader("Authorization");\n\n// 2. Setting response status and content type\nresp.setStatus(HttpServletResponse.SC_OK);\nresp.setContentType("application/json;charset=UTF-8");\nresp.setHeader("X-Server", "Tomcat-10.1");\n\n// 3. Writing response payload\ntry (PrintWriter out = resp.getWriter()) {\n    out.println("{\\"status\\":\\"success\\"}");\n}`,
      explanation: 'Always set response content type, encoding, and status BEFORE acquiring the writer or writing output bytes.',
      tokens: [
        { token: 'req.getParameter(name)', explanation: 'Retrieves first string value of query parameter or POST form field' },
        { token: 'req.getParameterValues(name)', explanation: 'Retrieves all string values for multi-select inputs or multiple query params' },
        { token: 'req.getReader()', explanation: 'Character stream for reading JSON, XML, or plain text request payloads' },
        { token: 'resp.setContentType(type)', explanation: 'Declares MIME type and character encoding in the Content-Type header' },
        { token: 'resp.setStatus(int)', explanation: 'Sets outgoing HTTP status code (200, 201, 400, 404, etc.)' }
      ]
    },
    examples: [
      {
        id: 'ex-67-basic',
        title: 'Comprehensive Request Inspector Servlet',
        type: 'basic',
        description: 'Reading query parameters, multiple tags, and client headers to output structured JSON metadata.',
        filename: 'RequestInspectorServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

@WebServlet(name = "RequestInspectorServlet", urlPatterns = {"/inspect"})
public class RequestInspectorServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("X-Handled-By", "Jakarta-Servlet-6.0");
        resp.setStatus(HttpServletResponse.SC_OK);

        String clientName = req.getParameter("client");
        if (clientName == null || clientName.isBlank()) {
            clientName = "Anonymous";
        }
        String[] tags = req.getParameterValues("tag");

        String method = req.getMethod();
        String requestUri = req.getRequestURI();
        String protocol = req.getProtocol();
        String userAgent = req.getHeader("User-Agent");

        try (PrintWriter out = resp.getWriter()) {
            out.println("{");
            out.printf("  \\"method\\": \\"%s\\",%n", method);
            out.printf("  \\"uri\\": \\"%s\\",%n", requestUri);
            out.printf("  \\"protocol\\": \\"%s\\",%n", protocol);
            out.printf("  \\"client\\": \\"%s\\",%n", clientName);
            out.printf("  \\"tags\\": %s,%n", tags != null ? Arrays.toString(tags) : "[]");
            out.printf("  \\"userAgent\\": \\"%s\\"%n", userAgent != null ? userAgent : "Unknown");
            out.println("}");
        }
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
X-Handled-By: Jakarta-Servlet-6.0

{
  "method": "GET",
  "uri": "/inspect",
  "protocol": "HTTP/1.1",
  "client": "Alice",
  "tags": [java, jakarta],
  "userAgent": "Mozilla/5.0"
}`,
        stepByStep: [
          'Tomcat parses HTTP request headers and query parameters.',
          'Servlet reads parameter client and multi-value tag parameters.',
          'Sets Content-Type to application/json with UTF-8 encoding.',
          'Writes JSON string to response writer and flushes buffer.'
        ]
      },
      {
        id: 'ex-67-realistic',
        title: 'RESTful Order Creation with JSON Stream Parsing',
        type: 'realistic',
        description: 'Handling POST requests with JSON payload stream, validating input, and writing 201 Created with Location header.',
        filename: 'OrderProcessingServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;

@WebServlet(name = "OrderProcessingServlet", urlPatterns = {"/api/orders"})
public class OrderProcessingServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String contentType = req.getContentType();
        if (contentType == null || !contentType.contains("application/json")) {
            resp.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, "Expected application/json");
            return;
        }

        StringBuilder jsonBody = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line.trim());
            }
        }

        if (jsonBody.isEmpty()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Payload cannot be empty");
            return;
        }

        String orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.setContentType("application/json;charset=UTF-8");
        resp.setHeader("Location", req.getContextPath() + "/api/orders/" + orderId);

        try (PrintWriter out = resp.getWriter()) {
            out.printf("{\\"orderId\\":\\"%s\\",\\"status\\":\\"CONFIRMED\\",\\"receivedLength\\":%d}%n", 
                orderId, jsonBody.length());
        }
    }
}`,
        output: `HTTP/1.1 201 Created
Content-Type: application/json;charset=UTF-8
Location: /handbook/api/orders/ORD-A3F1B842

{"orderId":"ORD-A3F1B842","status":"CONFIRMED","receivedLength":26}`,
        stepByStep: [
          'Validates that incoming Content-Type contains application/json.',
          'Consumes request body using req.getReader() line-by-line.',
          'Generates unique tracking order identifier.',
          'Sets 201 Created status and Location response header.',
          'Streams confirmation JSON back to the client.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Calling both getReader() and getInputStream() in the same request',
        errorCodeOrSnippet: 'java.lang.IllegalStateException: getInputStream() has already been called',
        cause: 'Servlet specification forbids mixing character and binary reader streams on the same request.',
        solution: 'Use getReader() exclusively for character text or getInputStream() for binary data.'
      },
      {
        title: 'Setting response headers after writing output to getWriter()',
        errorCodeOrSnippet: 'resp.setContentType() ignored / headers already committed',
        cause: 'Once the response buffer flushes bytes to the socket, HTTP headers are permanently committed.',
        solution: 'Always invoke setContentType(), setCharacterEncoding(), and setHeader() before acquiring the writer.'
      }
    ],
    bestPractices: {
      doList: [
        'Always specify explicit character encoding: resp.setContentType("text/html;charset=UTF-8").',
        'Use resp.sendError(sc, msg) to halt invalid requests and display standardized error pages.',
        'Null-check all parameters retrieved via req.getParameter().'
      ],
      dontList: [
        'Do not mix getWriter() and getOutputStream() in the same request handler.',
        'Do not concatenate untrusted request parameters directly into raw HTML responses without escaping (XSS vulnerability).',
        'Do not swallow IOException when reading or writing stream payloads.'
      ],
      whenNotToUse: 'Do not parse complex JSON payloads manually using string splits in production; use Jakarta JSON Processing (JSON-P) or Jackson.'
    },
    versionNotes: {
      introduced: 'Java Servlet 1.0 (1997); modern async support in Servlet 3.0; updated in Servlet 6.0',
      status: 'Stable',
      compatibilityNotes: 'Servlet 6.0 removed deprecated session URL-rewriting methods and refined character encoding defaults to UTF-8.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 is the standard production runtime baseline.'
    },
    cheatSheet: {
      title: 'HttpServletRequest and HttpServletResponse Key Methods',
      headers: ['Operation', 'Method Call', 'Return Type', 'Purpose'],
      rows: [
        ['Get Param', 'req.getParameter(name)', 'String', 'Single query or form value'],
        ['Get Multi-Param', 'req.getParameterValues(name)', 'String[]', 'Array of values for checkboxes/multi-params'],
        ['Get Header', 'req.getHeader(name)', 'String', 'HTTP request header value'],
        ['Read Text Body', 'req.getReader()', 'BufferedReader', 'Character stream of incoming request payload'],
        ['Read Binary Body', 'req.getInputStream()', 'ServletInputStream', 'Byte stream of incoming request payload'],
        ['Set Status', 'resp.setStatus(code)', 'void', 'Sets HTTP response status code'],
        ['Set Content Type', 'resp.setContentType(type)', 'void', 'Sets Content-Type header with encoding'],
        ['Send Error', 'resp.sendError(code, msg)', 'void', 'Halts request and sends container error page']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix Response Header Commit Conflict',
        prompt: 'Why does the Content-Type header fail to apply in this snippet, and how should it be fixed?',
        starterCode: `PrintWriter out = resp.getWriter();\nout.println("{\"result\":\"ok\"}");\nresp.setContentType("application/json");`,
        solution: `// Fix: Call setContentType() before acquiring the writer:\nresp.setContentType("application/json;charset=UTF-8");\nPrintWriter out = resp.getWriter();\nout.println("{\"result\":\"ok\"}");`,
        explanation: 'Headers must be configured prior to writing bytes, as writing can commit the response buffer.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Safe Integer Parameter Parser',
        prompt: 'Write a helper method that extracts an integer request parameter and falls back to a default value if missing or malformed.',
        starterCode: `public static int getIntParam(HttpServletRequest req, String name, int defaultVal) {\n    // Implement safe parse\n}`,
        solution: `public static int getIntParam(HttpServletRequest req, String name, int defaultVal) {\n    String val = req.getParameter(name);\n    if (val == null || val.isBlank()) return defaultVal;\n    try {\n        return Integer.parseInt(val.trim());\n    } catch (NumberFormatException e) {\n        return defaultVal;\n    }\n}`,
        explanation: 'Defensive parsing prevents NumberFormatException crashes on user input.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Response Buffer Commitment Check',
        prompt: 'What happens if you invoke resp.sendRedirect() after the response buffer has already committed?',
        solution: `// Result: Throws IllegalStateException: "Cannot call sendRedirect() after response has been committed".\n// Fix: Check resp.isCommitted() or ensure redirection logic executes before writing response bytes.`,
        explanation: 'Once HTTP headers are transmitted over the TCP socket, the status code cannot be converted to a 302 redirect.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0: Chapter 5 Request & Chapter 6 Response',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1 API: HttpServletRequest',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/servletapi/jakarta/servlet/http/HttpServletRequest.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-68',
    slug: 'servlet-configuration-annotations-vs-web-xml',
    topicNumber: 68,
    title: 'Servlet Configuration: @WebServlet vs web.xml',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 19,
    sectionTitle: 'Servlets Deep Dive',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Master servlet declaration and routing: compare modern @WebServlet annotations against the authoritative web.xml deployment descriptor, URL pattern algorithms, and eager startup.',
    prerequisites: [
      'Topic 58: Annotations & Metadata',
      'Topic 65: Apache Tomcat & The WAR Structure',
      'Topic 66: Servlet Lifecycle & Architecture'
    ],
    whatAndWhy: {
      definition: 'Servlet configuration defines how the web container maps incoming request URLs to servlet classes, configures initialization parameters, and controls eager instantiation at server boot.',
      analogy: 'Corporate directory vs office door nameplate: web.xml is the lobby directory board in the entrance of the building; @WebServlet is the nameplate on the department door. If the building directory specifies an override, the lobby directory takes precedence.',
      whyItExists: 'Enables clean separation between code and environment deployment rules, while annotations streamline rapid development without XML verbosity.'
    },
    syntaxBreakdown: {
      title: 'Annotation vs XML Configuration Syntax',
      codeSnippet: `// 1. Modern Annotation Syntax\n@WebServlet(name = "ConfigServlet", urlPatterns = {"/catalog/*"}, loadOnStartup = 1)\npublic class ConfigServlet extends HttpServlet {}\n\n// 2. Authoritative XML Syntax (web.xml)\n<servlet>\n    <servlet-name>ConfigServlet</servlet-name>\n    <servlet-class>com.handbook.web.ConfigServlet</servlet-class>\n    <load-on-startup>1</load-on-startup>\n</servlet>\n<servlet-mapping>\n    <servlet-name>ConfigServlet</servlet-name>\n    <url-pattern>/catalog/*</url-pattern>\n</servlet-mapping>`,
      explanation: 'Both declare identical container registrations. web.xml overrides @WebServlet if both exist for the same servlet name.',
      tokens: [
        { token: '@WebServlet', explanation: 'Class-level annotation registering servlet with container' },
        { token: 'urlPatterns', explanation: 'Array of URL pattern strings matching incoming request URIs' },
        { token: 'loadOnStartup', explanation: 'Eager startup order if >= 0; initialized at server boot' },
        { token: 'initParams', explanation: 'Initial key-value configuration parameters passed to init(ServletConfig)' }
      ]
    },
    examples: [
      {
        id: 'ex-68-basic',
        title: 'Init Parameters and Container Boot Configuration',
        type: 'basic',
        description: 'Demonstrating @WebInitParam, loadOnStartup = 1, and reading parameters via ServletConfig.',
        filename: 'ConfigDemoServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(
    name = "ConfigDemoServlet",
    urlPatterns = {"/config-demo"},
    loadOnStartup = 1,
    initParams = {
        @WebInitParam(name = "defaultPageSize", value = "25"),
        @WebInitParam(name = "environment", value = "Production")
    }
)
public class ConfigDemoServlet extends HttpServlet {

    private int defaultPageSize;
    private String environment;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        String sizeParam = config.getInitParameter("defaultPageSize");
        this.defaultPageSize = sizeParam != null ? Integer.parseInt(sizeParam) : 10;
        this.environment = config.getInitParameter("environment");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        resp.setContentType("text/plain;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.printf("Servlet Name: %s%n", getServletName());
            out.printf("Environment:  %s%n", environment);
            out.printf("Page Size:    %d%n", defaultPageSize);
            out.printf("Context Path: %s%n", getServletContext().getContextPath());
        }
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8

Servlet Name: ConfigDemoServlet
Environment:  Production
Page Size:    25
Context Path: /handbook`,
        stepByStep: [
          'Tomcat initializes ConfigDemoServlet eagerly on startup (loadOnStartup = 1).',
          'init(ServletConfig) extracts defaultPageSize and environment.',
          'Incoming GET /config-demo prints active configuration parameters.'
        ]
      },
      {
        id: 'ex-68-realistic',
        title: 'Multi-Mapping and Dynamic Path Decoding',
        type: 'realistic',
        description: 'Binding multiple distinct URL patterns and decoding dynamic path segments via req.getPathInfo().',
        filename: 'MultiMappingServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(
    name = "MultiMappingServlet",
    urlPatterns = {"/catalog/*", "/product-lookup"}
)
public class MultiMappingServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        resp.setContentType("text/plain;charset=UTF-8");
        String servletPath = req.getServletPath();
        String pathInfo = req.getPathInfo();
        String queryString = req.getQueryString();

        try (PrintWriter out = resp.getWriter()) {
            out.printf("Servlet Path: %s%n", servletPath);
            out.printf("Path Info:    %s%n", pathInfo != null ? pathInfo : "(none)");
            out.printf("Query String: %s%n", queryString != null ? queryString : "(none)");
            
            if (pathInfo != null && pathInfo.startsWith("/")) {
                String requestedItem = pathInfo.substring(1);
                out.printf("Extracted Item Slug: %s%n", requestedItem);
            }
        }
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8

Servlet Path: /catalog
Path Info:    /electronics/laptops
Query String: sort=price
Extracted Item Slug: electronics/laptops`,
        stepByStep: [
          'Servlet maps to both /catalog/* and /product-lookup.',
          'Incoming request to /catalog/electronics/laptops matches prefix pattern.',
          'Container sets servletPath to /catalog and pathInfo to /electronics/laptops.',
          'Servlet extracts dynamic item slug from pathInfo.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Missing leading slash in path-based urlPatterns',
        errorCodeOrSnippet: '@WebServlet(urlPatterns = {"catalog/*"}) // Throws IllegalArgumentException',
        cause: 'Servlet specification requires all path-based patterns to begin with /.',
        solution: 'Always prefix path patterns with a slash: @WebServlet(urlPatterns = {"/catalog/*"}).'
      },
      {
        title: 'Combining path prefix and extension matching in one pattern',
        errorCodeOrSnippet: '@WebServlet(urlPatterns = {"/catalog/*.html"}) // ILLEGAL!',
        cause: 'The specification forbids mixing prefix and extension rules into a single mapping pattern.',
        solution: 'Use either prefix matching (/catalog/*) or extension matching (*.html), never both.'
      }
    ],
    bestPractices: {
      doList: [
        'Use @WebServlet annotations for application code to keep routing concise and discoverable.',
        'Use web.xml when configuring third-party servlet libraries without altering source code.',
        'Use loadOnStartup = 1 for servlets that perform expensive cache preloading or database warm-up.'
      ],
      dontList: [
        'Do not hardcode sensitive database passwords in @WebInitParam source code.',
        'Do not map the default servlet (url-pattern "/") unless replacing the container static file server.',
        'Do not omit super.init(config) when overriding init(ServletConfig).'
      ],
      whenNotToUse: 'Do not use raw XML web.xml files for hundreds of custom servlets; annotations or modern Spring / JAX-RS controllers offer superior maintainability.'
    },
    versionNotes: {
      introduced: 'web.xml in Servlet 1.0; @WebServlet introduced in Servlet 3.0 (Java EE 6); updated in Servlet 6.0',
      status: 'Stable',
      compatibilityNotes: 'web.xml deployment descriptor schema updated to version 6.0 under the jakartaee namespace.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 fully supports both annotations and web.xml overrides.'
    },
    cheatSheet: {
      title: 'URL Pattern Matching Priority Rules',
      headers: ['Priority', 'Pattern Type', 'Example', 'Matches'],
      rows: [
        ['1 (Highest)', 'Exact Match', '/login, /checkout', 'Exact URI path match only'],
        ['2', 'Prefix Match', '/api/*, /catalog/*', 'Any URI beginning with prefix'],
        ['3', 'Extension Match', '*.do, *.pdf', 'Any URI ending with specified extension'],
        ['4 (Lowest)', 'Default Servlet', '/', 'Fallback for all unmatched requests (static files)']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Identify Invalid URL Pattern',
        prompt: 'Which of the following URL patterns will fail web container deployment: 1) /users/* 2) *.action 3) /docs/*.pdf 4) /status',
        starterCode: `@WebServlet(urlPatterns = {"/users/*", "*.action", "/docs/*.pdf", "/status"})`,
        solution: `// Pattern 3: "/docs/*.pdf" is ILLEGAL by Servlet specification.\n// Fix: Split into prefix or extension mapping:\n@WebServlet(urlPatterns = {"/users/*", "*.action", "/status"})`,
        explanation: 'Servlet specification forbids combining prefix paths and extension wildcards in a single rule.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Eager Startup Metric Initializer',
        prompt: 'Declare an annotated servlet named "HealthProbeServlet" that maps to "/health" and initializes at server startup.',
        starterCode: `// Write annotated class declaration\npublic class HealthProbeServlet extends HttpServlet {\n}`,
        solution: `@WebServlet(\n    name = "HealthProbeServlet",\n    urlPatterns = {"/health"},\n    loadOnStartup = 1\n)\npublic class HealthProbeServlet extends HttpServlet {\n}`,
        explanation: 'loadOnStartup = 1 forces Tomcat to instantiate and initialize the servlet during server boot.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'web.xml vs Annotation Conflict Precedence',
        prompt: 'If a servlet class declares urlPatterns = {"/v1"}, but web.xml maps the same servlet name to url-pattern "/v2", which URL works?',
        solution: `// Result: "/v2" (web.xml) takes precedence.\n// The Servlet specification guarantees that XML deployment descriptor settings override source-code annotations.`,
        explanation: 'Deployment descriptors are designed to allow operations teams to customize routing without recompiling bytecode.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0: Chapter 12 Mapping Requests to Servlets',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1 Documentation: Web Application Deployment',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/appdev/deployment.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-69',
    slug: 'request-dispatching-forward-include-redirect',
    topicNumber: 69,
    title: 'Request Dispatching: Forward vs Include vs Redirect',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 19,
    sectionTitle: 'Servlets Deep Dive',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master request routing: compare internal server forwards (RequestDispatcher.forward), modular includes, and client-side redirects (sendRedirect), with the Post/Redirect/Get pattern.',
    prerequisites: [
      'Topic 64: Web Architecture Fundamentals (HTTP Protocol)',
      'Topic 66: Servlet Lifecycle & Architecture',
      'Topic 67: Request and Response Processing in Servlets'
    ],
    whatAndWhy: {
      definition: 'Request dispatching is the mechanism of transferring control from one server-side resource to another (forward/include via RequestDispatcher) or instructing the client browser to make a brand-new request (redirect via sendRedirect).',
      analogy: 'Internal bank transfer vs asking a customer to walk across the street: a forward transfers your request to an internal loan specialist behind the counter. A redirect asks the customer to exit the bank and visit a different branch across town.',
      whyItExists: 'Enables MVC separation of concerns: Servlets handle incoming actions, database operations, and security validation, then forward to private JSP views or redirect to success pages.'
    },
    syntaxBreakdown: {
      title: 'Forward vs Include vs Redirect Syntax',
      codeSnippet: `// 1. Server-side Forward (Internal, single round-trip, keeps URL)\nreq.setAttribute("data", payload);\nreq.getRequestDispatcher("/WEB-INF/views/result.jsp").forward(req, resp);\n\n// 2. Server-side Include (Embeds sub-template, returns control)\nreq.getRequestDispatcher("/WEB-INF/views/header.jsp").include(req, resp);\n\n// 3. Client-side Redirect (Two round-trips, updates browser URL bar)\nresp.sendRedirect(req.getContextPath() + "/dashboard");`,
      explanation: 'Forwarding preserves request attributes inside the server; redirects instruct the browser to issue a new GET request.',
      tokens: [
        { token: 'dispatcher.forward(req, resp)', explanation: 'Internal handoff to target resource; original servlet stops rendering' },
        { token: 'dispatcher.include(req, resp)', explanation: 'Embeds output of target resource into current response buffer' },
        { token: 'resp.sendRedirect(location)', explanation: 'Sends HTTP 302/303 response directing client browser to new URL' },
        { token: 'req.setAttribute(key, val)', explanation: 'Stores data in request memory scope preserved across internal forwards' }
      ]
    },
    examples: [
      {
        id: 'ex-69-basic',
        title: 'Dispatcher Controller Servlet Demo',
        type: 'basic',
        description: 'Demonstrating forwarding to an internal view handler, including site headers/footers, and redirecting clients.',
        filename: 'DispatcherControllerServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "DispatcherControllerServlet", urlPatterns = {"/controller"})
public class DispatcherControllerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String action = req.getParameter("action");
        if (action == null) action = "forward";

        switch (action) {
            case "forward" -> {
                req.setAttribute("flashMessage", "Forwarded from DispatcherControllerServlet");
                req.setAttribute("processedTimestamp", System.currentTimeMillis());
                RequestDispatcher dispatcher = req.getRequestDispatcher("/view-handler");
                dispatcher.forward(req, resp);
            }
            case "include" -> {
                resp.setContentType("text/html;charset=UTF-8");
                resp.getWriter().println("<div class='header'>-- Global Site Header --</div>");
                RequestDispatcher dispatcher = req.getRequestDispatcher("/view-handler");
                dispatcher.include(req, resp);
                resp.getWriter().println("<div class='footer'>-- Global Site Footer --</div>");
            }
            case "redirect" -> {
                String redirectUrl = req.getContextPath() + "/inspect?client=RedirectedUser";
                resp.sendRedirect(redirectUrl);
            }
            default -> resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Unknown action: " + action);
        }
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<div class='view-content'>
<h2>View Handler Render Target</h2>
<p>Flash Message: <strong>Forwarded from DispatcherControllerServlet</strong></p>
<p>Timestamp: <em>1731885000000</em></p>
</div>`,
        stepByStep: [
          'DispatcherControllerServlet receives GET /controller?action=forward.',
          'Attaches flashMessage and timestamp to request attributes.',
          'Forwards request internally to ViewHandlerServlet.',
          'ViewHandlerServlet renders HTML response; browser URL remains /controller.'
        ]
      },
      {
        id: 'ex-69-realistic',
        title: 'View Handler Target Servlet Consuming Forwarded State',
        type: 'realistic',
        description: 'Receiving forwarded request attributes and generating HTML view markup.',
        filename: 'ViewHandlerServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "ViewHandlerServlet", urlPatterns = {"/view-handler"})
public class ViewHandlerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String flashMessage = (String) req.getAttribute("flashMessage");
        Long timestamp = (Long) req.getAttribute("processedTimestamp");

        resp.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.println("<div class='view-content'>");
            out.println("<h2>View Handler Render Target</h2>");
            out.printf("<p>Flash Message: <strong>%s</strong></p>%n", 
                flashMessage != null ? flashMessage : "(no attribute found)");
            out.printf("<p>Timestamp: <em>%s</em></p>%n", 
                timestamp != null ? timestamp.toString() : "(none)");
            out.println("</div>");
        }
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<div class='view-content'>
<h2>View Handler Render Target</h2>
<p>Flash Message: <strong>Forwarded from DispatcherControllerServlet</strong></p>
<p>Timestamp: <em>1731885000000</em></p>
</div>`,
        stepByStep: [
          'ViewHandlerServlet executes within the same container thread.',
          'Extracts attributes set by the calling controller servlet.',
          'Produces final HTML view representation.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Attempting to pass request attributes across sendRedirect()',
        errorCodeOrSnippet: 'req.setAttribute("msg", "Saved"); resp.sendRedirect("/home"); // Attribute lost!',
        cause: 'sendRedirect() issues an HTTP 302, causing the browser to make a brand-new request. The original request object is destroyed.',
        solution: 'Use HttpSession to store flash messages or forward internally using RequestDispatcher.'
      },
      {
        title: 'Forgetting to return immediately after forward() or sendRedirect()',
        errorCodeOrSnippet: 'resp.sendRedirect("/login"); doRemainingWork(); // Still executes!',
        cause: 'Calling forward() or sendRedirect() does NOT exit the method. Subsequent statements will execute.',
        solution: 'Always place a return statement immediately after forward() or sendRedirect().'
      }
    ],
    bestPractices: {
      doList: [
        'Adopt the Post/Redirect/Get (PRG) pattern after form submissions to prevent duplicate inserts on browser reload.',
        'Place internal JSP templates inside WEB-INF/ and navigate to them via RequestDispatcher.forward().',
        'Always prefix relative redirect URLs with req.getContextPath().'
      ],
      dontList: [
        'Do not call forward() after writing output to getWriter() (causes IllegalStateException).',
        'Do not redirect to unvalidated user-supplied URLs (prevents Open Redirect vulnerabilities).',
        'Do not omit return; after calling sendRedirect() or forward().'
      ],
      whenNotToUse: 'Do not use forward() to send clients to external websites or domains outside your web application; use sendRedirect().'
    },
    versionNotes: {
      introduced: 'RequestDispatcher in Servlet 2.1; modern redirect URL sanitization in Servlet 6.0',
      status: 'Stable',
      compatibilityNotes: 'Tomcat 10.1 strictly adheres to relative URI resolution rules per RFC 9110.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise LTS baseline.'
    },
    cheatSheet: {
      title: 'Forward vs Include vs Redirect Comparison',
      headers: ['Feature', 'RequestDispatcher.forward()', 'RequestDispatcher.include()', 'HttpServletResponse.sendRedirect()'],
      rows: [
        ['Execution Location', 'Server-side (Internal)', 'Server-side (Internal)', 'Client-side (Network round-trip)'],
        ['HTTP Round Trips', '1 request', '1 request', '2 requests'],
        ['Browser URL Bar', 'Does not change', 'Does not change', 'Updates to target URL'],
        ['Request Attributes', 'Preserved', 'Preserved', 'Lost (Destroyed with request)'],
        ['Access WEB-INF/?', 'Yes (Protected server access)', 'Yes', 'No (Blocked by container)'],
        ['Primary Use Case', 'MVC Controller -> View handoff', 'Shared header/footer layout', 'Post/Redirect/Get pattern']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix Post-Redirect State Loss',
        prompt: 'Why does the user attribute fail to appear on the destination page after a redirect?',
        starterCode: `protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    req.setAttribute("user", "Alice");\n    resp.sendRedirect(req.getContextPath() + "/welcome");\n}`,
        solution: `// Fix Option 1 (Session):\nreq.getSession().setAttribute("user", "Alice");\nresp.sendRedirect(req.getContextPath() + "/welcome");\n\n// Fix Option 2 (Forward):\nreq.getRequestDispatcher("/welcome").forward(req, resp);`,
        explanation: 'sendRedirect triggers a new HTTP request from the browser; request-scoped attributes are destroyed.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Post/Redirect/Get Controller Guard',
        prompt: 'Implement a doPost method that forwards back to the form on validation error, or redirects on success.',
        starterCode: `protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {\n    // Validate email param\n}`,
        solution: `protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {\n    String email = req.getParameter("email");\n    if (email == null || !email.contains("@")) {\n        req.setAttribute("error", "Valid email required");\n        req.getRequestDispatcher("/WEB-INF/form.jsp").forward(req, resp);\n        return;\n    }\n    // Save entity...\n    resp.sendRedirect(req.getContextPath() + "/success");\n}`,
        explanation: 'Returning immediately prevents subsequent code from executing after forwarding or redirecting.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Security Boundary of WEB-INF',
        prompt: 'Can a client browser trigger a forward to /WEB-INF/secret.jsp directly via URL?',
        solution: `// No. Direct browser requests to /WEB-INF/* always return 404 Not Found.\n// Only internal server-side calls via req.getRequestDispatcher("/WEB-INF/secret.jsp").forward() can access WEB-INF.`,
        explanation: 'WEB-INF is a private server boundary defined by the Servlet specification to protect views and classes.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0: Chapter 9 Dispatching Requests',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1 API: RequestDispatcher',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/servletapi/jakarta/servlet/RequestDispatcher.html',
        organization: 'Apache Tomcat'
      }
    ]
  }
];

const topicsFilePath = path.join(process.cwd(), 'src/data/topics.ts');
let content = fs.readFileSync(topicsFilePath, 'utf8');

// Find the position right after topic-66 block
const idx66 = content.lastIndexOf("id: 'topic-66'");
if (idx66 === -1) {
  console.error('topic-66 not found in topics.ts!');
  process.exit(1);
}

// Find the closing brace of topic-66
const closingBraceIdx = content.indexOf('\n  }', idx66);
if (closingBraceIdx === -1) {
  console.error('Closing brace for topic-66 not found!');
  process.exit(1);
}

const formattedTopics = servletsDeepDiveTopics.map(t => {
  return '  ' + JSON.stringify(t, null, 4).trim();
}).join(',\n\n');

const insertPos = closingBraceIdx + '\n  }'.length;
content = content.substring(0, insertPos) + ',\n\n' + formattedTopics + content.substring(insertPos);

fs.writeFileSync(topicsFilePath, content, 'utf8');
console.log('Successfully appended topics 67, 68, 69 into src/data/topics.ts with exact type compliance!');
