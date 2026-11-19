export const section21Topics = [
  {
    id: 'topic-74',
    slug: 'jsp-architecture-and-translation',
    topicNumber: 74,
    title: 'JSP Architecture & Translation Lifecycle',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 21,
    sectionTitle: 'JavaServer Pages (JSP) & Templating',
    versionBadge: 'Jakarta Pages 3.1 / EE 10',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Demystify JavaServer Pages: discover how the Jasper compiler translates .jsp templates into compiled Java Servlets implementing _jspService(), translation caching, and precompilation.',
    prerequisites: [
      'Topic 65: Apache Tomcat & The WAR Structure',
      'Topic 66: Servlet Lifecycle & Architecture'
    ],
    whatAndWhy: {
      definition: 'Jakarta Pages (JSP) is a server-side templating technology that inverts the servlet model by allowing developers to write static HTML with embedded dynamic tags, which the container translates into standard compiled Java Servlets.',
      analogy: 'Architectural blueprints: a draftsperson writes visual shorthand plans (JSP); an automated CAD machine (Jasper compiler) converts them into standard manufacturing code (_jspService method in a Java Servlet).',
      whyItExists: 'Eliminates ugly string concatenation in servlets (out.println("<html>...")), allowing frontend developers and designers to work directly with HTML markup.'
    },
    syntaxBreakdown: {
      title: 'JSP Translation Phases and _jspService',
      codeSnippet: `// Raw JSP: <h1>Hello <%= request.getParameter("name") %></h1>\n\n// Translated Servlet Bytecode (_jspService):\npublic void _jspService(HttpServletRequest req, HttpServletResponse resp) {\n    JspWriter out = pageContext.getOut();\n    out.write("<h1>Hello ");\n    out.print(request.getParameter("name"));\n    out.write("</h1>\\n");\n}`,
      explanation: 'Static markup becomes out.write(); expressions become out.print(); scriptlets become raw Java statements.',
      tokens: [
        { token: 'Translation Phase', explanation: 'Converts .jsp into .java source file extending HttpJspBase' },
        { token: 'Compilation Phase', explanation: 'Compiles translated .java file into executable .class bytecode' },
        { token: '_jspService()', explanation: 'Container method called on every incoming HTTP request to render HTML' },
        { token: 'Precompilation', explanation: 'Compiling JSPs at build time to prevent first-request latency spikes' }
      ]
    },
    examples: [
      {
        id: 'ex-74-basic',
        title: 'Jasper JSP Translation Engine Simulator',
        type: 'basic',
        description: 'Demonstrating how comments, scriptlets, expressions, and template text are translated into a Java Servlet.',
        filename: 'JspTranslationInspectorDemo.java',
        code: `package com.handbook.web;

public class JspTranslationInspectorDemo {

    public static String translateJspSnippet(String jspText) {
        StringBuilder javaSource = new StringBuilder();
        javaSource.append("// Translated by Jasper JSP Engine\\n");
        javaSource.append("public final class HelloJsp extends org.apache.jasper.runtime.HttpJspBase {\\n");
        javaSource.append("  public void _jspService(HttpServletRequest request, HttpServletResponse response) throws Exception {\\n");
        javaSource.append("    JspWriter out = pageContext.getOut();\\n");

        for (String line : jspText.split("\\\\r?\\\\n")) {
            line = line.trim();
            if (line.startsWith("<%--") && line.endsWith("--%>")) {
                continue;
            } else if (line.startsWith("<%=") && line.endsWith("%>")) {
                String expr = line.substring(3, line.length() - 2).trim();
                javaSource.append("    out.print(").append(expr).append(");\\n");
            } else if (line.startsWith("<%") && line.endsWith("%>")) {
                String stmt = line.substring(2, line.length() - 2).trim();
                javaSource.append("    ").append(stmt).append("\\n");
            } else if (!line.isBlank()) {
                javaSource.append("    out.write(\\"").append(line.replace("\"", "\\\\\"")).append("\\\\n\\");\\n");
            }
        }
        javaSource.append("  }\\n}");
        return javaSource.toString();
    }

    public static void main(String[] args) {
        System.out.println("=== Jasper JSP Translation Simulator ===");
        String sampleJsp = """
            <%@ page contentType="text/html" %>
            <%-- User Greeting Banner --%>
            <h1>Welcome to Java Handbook</h1>
            <% String user = request.getParameter("name"); %>
            <p>Hello, <%= user != null ? user : "Guest" %></p>
            """;

        System.out.println("Input Raw JSP Template:");
        System.out.println(sampleJsp);

        System.out.println("Generated Servlet Source (_jspService):");
        String generated = translateJspSnippet(sampleJsp);
        System.out.println(generated);
        System.out.println("JSP translation simulation completed successfully.");
    }
}`,
        output: `=== Jasper JSP Translation Simulator ===
Input Raw JSP Template:
<%@ page contentType="text/html" %>
<%-- User Greeting Banner --%>
<h1>Welcome to Java Handbook</h1>
<% String user = request.getParameter("name"); %>
<p>Hello, <%= user != null ? user : "Guest" %></p>

Generated Servlet Source (_jspService):
// Translated by Jasper JSP Engine
public final class HelloJsp extends org.apache.jasper.runtime.HttpJspBase {
  public void _jspService(HttpServletRequest request, HttpServletResponse response) throws Exception {
    JspWriter out = pageContext.getOut();
    @ page contentType="text/html"
    out.write("<h1>Welcome to Java Handbook</h1>\\n");
    String user = request.getParameter("name");
    out.write("<p>Hello, <%= user != null ? user : \\"Guest\\" %></p>\\n");
  }
}
JSP translation simulation completed successfully.`,
        stepByStep: [
          'Jasper compiler scans the JSP file line-by-line.',
          'Strips JSP server-side comments (<%-- ... --%>).',
          'Wraps template markup into out.write() calls.',
          'Places scriptlet variables into _jspService() method scope.'
        ]
      },
      {
        id: 'ex-74-realistic',
        title: 'Packaged Live JSP Execution Output',
        type: 'realistic',
        description: 'Rendering server time and thread name in a live translated JSP template on Apache Tomcat.',
        filename: 'hello.jsp',
        code: `<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head><title>JSP Translation Demo</title></head>
<body>
    <h1>Jakarta Pages 3.1 Live Translation</h1>
    <p>Server Time: <strong><%= new java.util.Date() %></strong></p>
    <p>Thread Handling Request: <code><%= Thread.currentThread().getName() %></code></p>
</body>
</html>`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
<head><title>JSP Translation Demo</title></head>
<body>
    <h1>Jakarta Pages 3.1 Live Translation</h1>
    <p>Server Time: <strong>Wed Nov 17 21:00:00 UTC 2026</strong></p>
    <p>Thread Handling Request: <code>http-nio-8080-exec-3</code></p>
</body>
</html>`,
        stepByStep: [
          'Browser sends GET /hello.jsp to Apache Tomcat.',
          'Jasper verifies cached hello_jsp.class is up to date.',
          'Executes _jspService() on worker thread http-nio-8080-exec-3.',
          'Streams rendered HTML directly to the browser.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Placing heavy business calculations or database queries in JSPs',
        errorCodeOrSnippet: '<% Connection conn = DriverManager.getConnection(...); %>',
        cause: 'Violates MVC architecture; unmaintainable code that cannot be unit-tested.',
        solution: 'Execute database queries in Servlet Controllers and forward data to JSPs via request attributes.'
      },
      {
        title: 'Relying on runtime compilation in minimal Docker containers',
        errorCodeOrSnippet: 'JasperException: Unable to compile class for JSP (No javac on classpath)',
        cause: 'Lightweight JRE-only Docker containers do not bundle the JDK javac compiler.',
        solution: 'Precompile all JSPs at build time into .class files using the Maven jasper plugin.'
      }
    ],
    bestPractices: {
      doList: [
        'Precompile JSPs during the CI/CD build to eliminate first-request latency spikes.',
        'Place internal view JSPs inside WEB-INF/ to prevent direct public access.',
        'Always specify explicit character encoding in page directives (<%@ page contentType="text/html;charset=UTF-8" %>).'
      ],
      dontList: [
        'Do not write raw SQL queries or business loops in JSPs.',
        'Do not mix different character encodings between servlets and JSPs.',
        'Do not treat JSPs as static HTML files; they are compiled servlets.'
      ],
      whenNotToUse: 'Do not use JSPs for pure RESTful JSON/XML microservices; use Jakarta REST (JAX-RS) or Spring Web controllers.'
    },
    versionNotes: {
      introduced: 'JSP 1.0 (1999); modern namespace migration to Jakarta Pages 3.1 in Jakarta EE 10',
      status: 'Stable',
      compatibilityNotes: 'Package namespace updated from javax.servlet.jsp to jakarta.servlet.jsp.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'JSP Lifecycle Phase Matrix',
      headers: ['Phase', 'Trigger', 'Artifact Generated', 'Frequency'],
      rows: [
        ['Translation', 'File modified or first request', 'Java source file (name_jsp.java)', 'Once per file change'],
        ['Compilation', 'Jasper invokes javac', 'Bytecode class (name_jsp.class)', 'Once per file change'],
        ['Initialization', 'Class loaded by WebAppClassLoader', 'Calls jspInit()', 'Once per servlet instance'],
        ['Execution', 'Every incoming HTTP request', 'Calls _jspService(req, resp)', 'Every client request'],
        ['Destruction', 'Container shutdown / undeployment', 'Calls jspDestroy()', 'Once before unload']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'First-Request Latency Lag',
        prompt: 'Why do users experience a 2-second delay on the very first request to a newly deployed JSP?',
        starterCode: `// Client requests GET /catalog.jsp for the first time\n// Response takes 2100ms`,
        solution: `// Cause: Jasper compiles JSPs lazily on first access: translating to Java and running javac.\n// Fix: Precompile JSPs at build time with the Maven jasper-maven-plugin or enable eager compile in web.xml.`,
        explanation: 'Precompilation eliminates translation latency during production deployments.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'JSP vs HTML Comment Difference',
        prompt: 'Explain the difference between <!-- comment --> and <%-- comment --%> in terms of browser visibility.',
        starterCode: `<!-- Comment A -->\n<%-- Comment B --%>`,
        solution: `// Comment A (<!-- -->) is sent across the wire to the browser DOM.\n// Comment B (<%-- --%>) is stripped on the server by Jasper during translation and never sent.`,
        explanation: 'JSP comments keep server-side developer notes completely private.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'JRE vs JDK Deployment for JSPs',
        prompt: 'Can uncompiled JSPs run in a Docker container that has only a JRE (no JDK)?',
        solution: `// No, uncompiled JSPs require javac to compile translated Java files.\n// To run on a minimal JRE, you must precompile all JSPs into .class files during the Maven build.`,
        explanation: 'Minimal JRE containers lack the compiler binaries required for runtime JSP translation.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Pages Specification 3.1',
        url: 'https://jakarta.ee/specifications/pages/3.1/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1: Jasper 2 JSP Engine Guide',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/jasper-howto.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-75',
    slug: 'jsp-syntax-elements',
    topicNumber: 75,
    title: 'JSP Syntax Elements: Directives, Scriptlets & Expressions',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 21,
    sectionTitle: 'JavaServer Pages (JSP) & Templating',
    versionBadge: 'Jakarta Pages 3.1 / EE 10',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Master the core syntax tags: configure page directives (<%@ page %>), understand the thread-safety risks of declarations (<%! %>), and scriptlets vs expressions (<%= %>).',
    prerequisites: [
      'Topic 74: JSP Architecture & Translation Lifecycle'
    ],
    whatAndWhy: {
      definition: 'JSP syntax elements are specialized XML-style delimiters informing the Jasper compiler how to categorize text into directives, class-level fields, method statements, or printable expressions.',
      analogy: 'Filling a pre-printed tax document: directives are the language and currency guidelines; declarations are your permanent tax ID on the form; scriptlets are the math done on scratch paper; expressions are the final calculated answers.',
      whyItExists: 'Allows seamless mixing of static markup and dynamic Java logic while controlling where generated code lands in the translated servlet class.'
    },
    syntaxBreakdown: {
      title: 'Delimiters and Placement in Translated Servlet',
      codeSnippet: `<%@ page import="java.time.LocalTime" %>  <-- Directive (Imports)\n<%! private int hitCount = 0; %>         <-- Declaration (Class Field)\n<% String ip = request.getRemoteAddr(); %> <-- Scriptlet (Local Variable)\n<p>Hits: <%= ++hitCount %></p>           <-- Expression (out.print)`,
      explanation: 'Expressions must NEVER end with a semicolon because Jasper wraps them in out.print().',
      tokens: [
        { token: '<%@ page ... %>', explanation: 'Page-level directives configuring contentType, imports, and encoding' },
        { token: '<%! ... %>', explanation: 'Declarations: class-level fields and methods shared across ALL threads' },
        { token: '<% ... %>', explanation: 'Scriptlets: Java statements executed inside _jspService() per request' },
        { token: '<%= ... %>', explanation: 'Expressions: evaluated object converted to text via out.print(); no semicolon' }
      ]
    },
    examples: [
      {
        id: 'ex-75-basic',
        title: 'JSP Syntax Elements Live Demonstration',
        type: 'basic',
        description: 'Demonstrating declarations for global counters, local scriptlets for request metadata, and expressions.',
        filename: 'syntax-elements.jsp',
        code: `<%@ page contentType="text/html;charset=UTF-8" language="java" import="java.time.LocalTime" %>
<%! 
    private int globalPageViews = 0;
    private synchronized int incrementViews() {
        return ++globalPageViews;
    }
%>
<!DOCTYPE html>
<html>
<head><title>JSP Syntax Breakdown</title></head>
<body>
    <h1>Jakarta Pages Syntax Demonstration</h1>
    <%-- JSP Server-Side Comment --%>
    <%
        String clientIp = request.getRemoteAddr();
        LocalTime now = LocalTime.now();
        int views = incrementViews();
    %>
    <p>Client IP Address: <strong><%= clientIp %></strong></p>
    <p>Current Time: <em><%= now %></em></p>
    <p>Total Page Hits (All Users): <strong><%= views %></strong></p>
</body>
</html>`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
<head><title>JSP Syntax Breakdown</title></head>
<body>
    <h1>Jakarta Pages Syntax Demonstration</h1>
    <p>Client IP Address: <strong>127.0.0.1</strong></p>
    <p>Current Time: <em>21:05:30.142</em></p>
    <p>Total Page Hits (All Users): <strong>1</strong></p>
</body>
</html>`,
        stepByStep: [
          'Declaration creates globalPageViews as instance field in translated servlet.',
          'Page directive sets UTF-8 encoding and imports LocalTime.',
          'Scriptlet runs inside _jspService(), evaluating request.getRemoteAddr().',
          'Expressions output dynamic values into HTML stream.'
        ]
      },
      {
        id: 'ex-75-realistic',
        title: 'Static Include Directive vs Dynamic Inclusion',
        type: 'realistic',
        description: 'Demonstrating translation-time static include for headers vs request-time dynamic include.',
        filename: 'modular-view.jsp',
        code: `<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head><title>Modular Layout Demo</title></head>
<body>
    <%@ include file="/WEB-INF/fragments/header.html" %>

    <main>
        <h2>Main Product Catalog Content</h2>
        <% 
            String[] categories = {"Hardware", "Software", "Cloud"};
            for (String cat : categories) {
        %>
            <div class="category-card"><%= cat %></div>
        <% } %>
    </main>

    <jsp:include page="/WEB-INF/fragments/footer.jsp" />
</body>
</html>`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
<head><title>Modular Layout Demo</title></head>
<body>
    <header><h1>Store Navigation</h1></header>
    <main>
        <h2>Main Product Catalog Content</h2>
        <div class="category-card">Hardware</div>
        <div class="category-card">Software</div>
        <div class="category-card">Cloud</div>
    </main>
    <footer><p>&copy; 2026 Handbook Demo</p></footer>
</body>
</html>`,
        stepByStep: [
          'Include directive merges header.html into servlet BEFORE compilation.',
          'Scriptlet loop generates category cards dynamically.',
          'jsp:include dispatches runtime inclusion of footer.jsp.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Adding a trailing semicolon inside a JSP Expression (<%= ... %>)',
        errorCodeOrSnippet: '<p>Name: <%= user.getName(); %></p> // Syntax Error!',
        cause: 'Jasper translates this to out.print(user.getName();); which is illegal Java syntax.',
        solution: 'Never put a semicolon in an expression: <%= user.getName() %>.'
      },
      {
        title: 'Storing user-specific state in a JSP Declaration (<%! ... %>)',
        errorCodeOrSnippet: '<%! private String currentUser; %> // Thread Safety Bug!',
        cause: 'Declarations become class instance fields. All concurrent users share the same instance.',
        solution: 'Declare variables in scriptlets (<% ... %>) so they remain local stack variables.'
      }
    ],
    bestPractices: {
      doList: [
        'Always set line 1 encoding: <%@ page contentType="text/html;charset=UTF-8" %>.',
        'Use Expression Language (${...}) instead of scriptlets for clean modern templates.',
        'Use synchronized methods if declarations mutate shared counters.'
      ],
      dontList: [
        'Do not store user-specific mutable state in <%! %> declarations.',
        'Do not place semicolons inside <%= %> expressions.',
        'Do not write nested try/catch database code in JSPs; use Servlets.'
      ],
      whenNotToUse: 'Do not use raw scriptlets (<% ... %>) in modern enterprise applications; modern standards enforce scriptless JSPs with JSTL.'
    },
    versionNotes: {
      introduced: 'Core elements established in JSP 1.2; modern JSTL and EL adopted in JSP 2.0+',
      status: 'Stable',
      compatibilityNotes: 'Scriptless JSPs can be enforced via <scripting-invalid>true</scripting-invalid> in web.xml.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'JSP Syntax Elements Cheat Sheet',
      headers: ['Syntax', 'Type', 'Semicolon Allowed?', 'Scope in Servlet'],
      rows: [
        ['<%@ page ... %>', 'Directive', 'No', 'Page translation settings'],
        ['<%@ include file="..." %>', 'Include Directive', 'No', 'Inlines file before compilation'],
        ['<%! ... %>', 'Declaration', 'Yes', 'Class-level field or method (Shared across threads)'],
        ['<% ... %>', 'Scriptlet', 'Yes', 'Local statements inside _jspService()'],
        ['<%= ... %>', 'Expression', 'NO', 'Parameter passed to out.print()'],
        ['<%-- ... --%>', 'Comment', 'No', 'Completely stripped by compiler']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix Trailing Semicolon in Expression',
        prompt: 'Why does <%= request.getContextPath(); %> fail compilation?',
        starterCode: `<a href="<%= request.getContextPath(); %>/home">Home</a>`,
        solution: `// Fix: Remove the trailing semicolon:\n<a href="<%= request.getContextPath() %>/home">Home</a>`,
        explanation: 'Expressions are wrapped into out.print(expr); adding a semicolon breaks Java syntax.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Declaration Helper Method',
        prompt: 'Write a declaration element defining a helper method formatTax(double amount) returning 8% tax formatted.',
        starterCode: `// Write declaration\n<%! %>`,
        solution: `<%! \n    public String formatTax(double amount) {\n        return String.format("$%.2f", amount * 0.08);\n    }\n%>\n<p>Tax: <%= formatTax(100.0) %></p>`,
        explanation: 'Methods defined in declarations become class methods of the translated servlet.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Static vs Dynamic Include',
        prompt: 'What is the key performance difference between <%@ include %> and <jsp:include>?',
        solution: `// <%@ include %> (static): merges text at compile time into one servlet class (faster runtime execution).\n// <jsp:include> (dynamic): dispatches at runtime via RequestDispatcher (slower, but can pass runtime params).`,
        explanation: 'Static includes compile into a unified class; dynamic includes dispatch at runtime.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Pages Specification 3.1: Core Elements',
        url: 'https://jakarta.ee/specifications/pages/3.1/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat Documentation: JSP Syntax',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/index.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-76',
    slug: 'jsp-implicit-objects-and-standard-actions',
    topicNumber: 76,
    title: 'JSP Implicit Objects & Standard Actions',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 21,
    sectionTitle: 'JavaServer Pages (JSP) & Templating',
    versionBadge: 'Jakarta Pages 3.1 / EE 10',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master pre-declared implicit objects (request, response, session, application, pageContext) and built-in standard actions (<jsp:useBean>, <jsp:include>, <jsp:forward>).',
    prerequisites: [
      'Topic 74: JSP Architecture & Translation Lifecycle',
      'Topic 75: JSP Syntax Elements: Directives, Scriptlets & Expressions'
    ],
    whatAndWhy: {
      definition: 'Implicit objects are 9 pre-defined Java variables automatically declared in every translated JSP _jspService() method; standard actions are built-in XML tags for managing JavaBeans, forwarding, and including resources.',
      analogy: 'A professional chef kitchen: you do not need to install the refrigerator, sink, or stove (implicit objects); standard actions are automated preset buttons (like auto-timer or quick-reheat).',
      whyItExists: 'Eliminates repetitive boilerplate declarations and allows manipulating scoped JavaBeans and page forwarding using clean XML tags.'
    },
    syntaxBreakdown: {
      title: 'Implicit Objects and JavaBean Action Syntax',
      codeSnippet: `// Implicit Objects:\nsession.getId();\napplication.getContextPath();\n\n// Standard Actions:\n<jsp:useBean id="user" class="com.handbook.web.UserProfileBean" scope="request" />\n<jsp:setProperty name="user" property="username" value="Duke" />\n<jsp:getProperty name="user" property="username" />`,
      explanation: 'useBean instantiates or looks up beans across the 4 scopes (page, request, session, application).',
      tokens: [
        { token: 'request / response', explanation: 'HttpServletRequest and HttpServletResponse instances' },
        { token: 'session', explanation: 'HttpSession instance (available when session="true")' },
        { token: 'application', explanation: 'ServletContext global application scope instance' },
        { token: 'pageContext', explanation: 'Unified central access to all 4 attribute scopes and objects' },
        { token: '<jsp:useBean>', explanation: 'Declares and instantiates a JavaBean in specified scope' }
      ]
    },
    examples: [
      {
        id: 'ex-76-basic',
        title: 'JavaBean Standard Actions and Implicit Objects Demo',
        type: 'basic',
        description: 'Demonstrating <jsp:useBean>, property manipulation, and accessing session and application scopes.',
        filename: 'implicit-objects.jsp',
        code: `<%@ page contentType="text/html;charset=UTF-8" %>
<jsp:useBean id="userBean" class="com.handbook.web.UserProfileBean" scope="request" />
<jsp:setProperty name="userBean" property="username" value="Duke" />
<jsp:setProperty name="userBean" property="email" value="duke@oracle.com" />
<!DOCTYPE html>
<html>
<head><title>JSP Implicit Objects &amp; Standard Actions</title></head>
<body>
    <h1>JSP Implicit Objects Demo</h1>
    <p>Session ID: <code><%= session.getId() %></code></p>
    <p>Context Path: <code><%= application.getContextPath() %></code></p>
    <p>User Bean: <strong><jsp:getProperty name="userBean" property="username" /></strong> 
       (<jsp:getProperty name="userBean" property="email" />)</p>
</body>
</html>`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
<head><title>JSP Implicit Objects &amp; Standard Actions</title></head>
<body>
    <h1>JSP Implicit Objects Demo</h1>
    <p>Session ID: <code>B4920FA8103CD911</code></p>
    <p>Context Path: <code>/handbook</code></p>
    <p>User Bean: <strong>Duke</strong> (duke@oracle.com)</p>
</body>
</html>`,
        stepByStep: [
          'Jasper allocates UserProfileBean in request scope if not already present.',
          'setProperty calls userBean.setUsername("Duke") via reflection.',
          'Accesses session and application implicit variables.',
          'getProperty calls getUsername() and prints formatted text.'
        ]
      },
      {
        id: 'ex-76-realistic',
        title: 'Dynamic Request Forwarding with <jsp:forward>',
        type: 'realistic',
        description: 'Conditionally transferring control to an internal admin view using standard actions.',
        filename: 'role-router.jsp',
        code: `<%@ page contentType="text/html;charset=UTF-8" %>
<%
    String role = request.getParameter("role");
    if ("admin".equalsIgnoreCase(role)) {
%>
    <jsp:forward page="/admin/dashboard.jsp">
        <jsp:param name="authLevel" value="high" />
    </jsp:forward>
<%
    } else {
%>
    <h1>Standard User Portal</h1>
    <p>Welcome to public access.</p>
<% } %>`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<h1>Admin Dashboard</h1>
<p>Authentication Level: high</p>`,
        stepByStep: [
          'Evaluates incoming query parameter role.',
          'Dispatches server-side forward to /admin/dashboard.jsp.',
          'Passes custom request parameter authLevel=high.',
          'Browser URL remains unchanged during forward.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Omitting a zero-argument public constructor in JavaBeans used with <jsp:useBean>',
        errorCodeOrSnippet: 'java.lang.InstantiationException: Class has no nullary constructor',
        cause: '<jsp:useBean> uses reflection Class.newInstance() which mandates a public zero-arg constructor.',
        solution: 'Always declare public MyBean() {} in every JavaBean class.'
      },
      {
        title: 'Accessing the session implicit object when session="false" is set',
        errorCodeOrSnippet: 'cannot find symbol: variable session',
        cause: 'Setting <%@ page session="false" %> causes Jasper to omit the session declaration in _jspService().',
        solution: 'Remove session="false" or use request.getSession(false).'
      }
    ],
    bestPractices: {
      doList: [
        'Use pageContext.findAttribute("key") for scope-agnostic attribute lookups.',
        'Always ensure JavaBeans implement java.io.Serializable for session clustering compatibility.',
        'Use <jsp:forward> instead of raw RequestDispatcher in presentation templates.'
      ],
      dontList: [
        'Do not omit scope attribute on <jsp:useBean> (defaults to page scope which destroys bean after request).',
        'Do not write complex Java control loops when <jsp:include> or JSTL can be used.',
        'Do not use scriptlets to cast request attributes when <jsp:useBean> is available.'
      ],
      whenNotToUse: 'Do not use <jsp:useBean> for complex dependency injection; use Jakarta CDI (@Inject) in modern services.'
    },
    versionNotes: {
      introduced: '9 implicit objects standardized in JSP 1.1; standard actions refined in JSP 2.0',
      status: 'Stable',
      compatibilityNotes: 'Maintained 100% backward compatible in Jakarta Pages 3.1.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'The 9 JSP Implicit Objects',
      headers: ['Object Name', 'Java Interface', 'Scope', 'Description'],
      rows: [
        ['request', 'HttpServletRequest', 'Request', 'Parameters, headers, cookies, input streams'],
        ['response', 'HttpServletResponse', 'Page', 'Status codes, redirects, output headers'],
        ['out', 'JspWriter', 'Page', 'Buffered character output stream'],
        ['session', 'HttpSession', 'Session', 'Conversational user memory'],
        ['application', 'ServletContext', 'Application', 'Global shared application context'],
        ['config', 'ServletConfig', 'Page', 'Page-specific initialization parameters'],
        ['pageContext', 'PageContext', 'Page', 'Unified access to all scopes and objects'],
        ['page', 'Object (this)', 'Page', 'Current servlet instance'],
        ['exception', 'Throwable', 'Page', 'Caught error in error pages (isErrorPage="true")']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix Default Scope in useBean',
        prompt: 'Why does <jsp:useBean id="cart" class="com.app.Cart" /> lose shopping items on the next page click?',
        starterCode: `<jsp:useBean id="cart" class="com.app.Cart" />`,
        solution: `// Fix: Add scope="session":\n<jsp:useBean id="cart" class="com.app.Cart" scope="session" />`,
        explanation: 'Default scope is "page", which destroys the bean when the current page finishes rendering.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Global Hit Counter in application Scope',
        prompt: 'Write a JSP snippet that increments an integer in application scope and prints the total.',
        starterCode: `<% // Implement counter %>`,
        solution: `<% \n    synchronized(application) {\n        Integer hits = (Integer) application.getAttribute("hits");\n        hits = (hits == null) ? 1 : hits + 1;\n        application.setAttribute("hits", hits);\n        out.println("Global Hits: " + hits);\n    }\n%>`,
        explanation: 'application scope persists across all users for the entire application lifetime.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'findAttribute Search Sequence',
        prompt: 'In what exact order does pageContext.findAttribute("user") search attribute scopes?',
        solution: `// 1. Page scope (pageContext)\n// 2. Request scope (request)\n// 3. Session scope (session)\n// 4. Application scope (application / ServletContext)`,
        explanation: 'Searches from narrowest to widest scope, returning null if not found.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Pages Specification 3.1: Chapter 2 Implicit Objects',
        url: 'https://jakarta.ee/specifications/pages/3.1/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1 API: PageContext',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/jspapi/jakarta/servlet/jsp/PageContext.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-77',
    slug: 'expression-language-el-and-jstl',
    topicNumber: 77,
    title: 'Expression Language (EL) & JSTL Core Tags',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 21,
    sectionTitle: 'JavaServer Pages (JSP) & Templating',
    versionBadge: 'Jakarta EL 5.0 / JSTL 3.0',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Write scriptlet-free web views: master Expression Language (${...}) property resolution, null-safety, and JSTL core tags (<c:forEach>, <c:if>, <c:choose>, <c:out>).',
    prerequisites: [
      'Topic 75: JSP Syntax Elements: Directives, Scriptlets & Expressions',
      'Topic 76: JSP Implicit Objects & Standard Actions'
    ],
    whatAndWhy: {
      definition: 'Jakarta Expression Language (EL) is a compact, null-safe expression syntax (${...}) for evaluating variables; JSTL (Standard Tag Library) provides standard XML tags for loops, conditionals, and output formatting.',
      analogy: 'A template fill-in form: instead of complex formulas, placeholders like {{User.Name}} dynamically inject values, gracefully printing empty strings rather than crashing if a value is missing.',
      whyItExists: 'Eliminates brittle Java scriptlets (<% ... %>) from views, keeping HTML clean, maintainable, and readable for web designers.'
    },
    syntaxBreakdown: {
      title: 'EL Syntax and JSTL Core Tags',
      codeSnippet: `// 1. EL JavaBean & Collection Resolution\n\${user.username}               <-- Calls user.getUsername()\n\${empty cart ? 'Empty' : 'Full'} <-- Null-safe empty check\n\n// 2. JSTL Core Tags (<%@ taglib prefix="c" uri="jakarta.tags.core" %>)\n<c:out value="\${user.name}" default="Guest" />\n<c:forEach items="\${products}" var="p">\n    <div>\${p.title} - $\${p.price}</div>\n</c:forEach>`,
      explanation: 'EL is null-safe: missing properties evaluate to blank strings without throwing NullPointerException.',
      tokens: [
        { token: '${...}', explanation: 'Expression Language delimiter evaluating properties and operators' },
        { token: 'empty operator', explanation: 'Checks for null, empty strings, empty arrays, or empty collections' },
        { token: '<c:out>', explanation: 'Renders text with automatic HTML entity escaping (XSS defense)' },
        { token: '<c:forEach>', explanation: 'Iterates over collections, lists, arrays, and maps' },
        { token: '<c:choose / when>', explanation: 'JSTL switch / if-else conditional equivalent' }
      ]
    },
    examples: [
      {
        id: 'ex-77-basic',
        title: 'Jakarta Expression Language (EL) Evaluator Simulator',
        type: 'basic',
        description: 'Demonstrating JavaBean reflection, Map lookups, and empty checks in Jakarta Expression Language.',
        filename: 'ExpressionLanguageEvaluatorDemo.java',
        code: `package com.handbook.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExpressionLanguageEvaluatorDemo {

    public static Object resolveElProperty(Object target, String property) throws Exception {
        if (target instanceof Map<?, ?> map) {
            return map.get(property);
        }
        String getterName = "get" + Character.toUpperCase(property.charAt(0)) + property.substring(1);
        return target.getClass().getMethod(getterName).invoke(target);
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Jakarta Expression Language (EL) Evaluator ===");
        
        UserProfileBean user = new UserProfileBean("jduke", "duke@oracle.com", 1500, true);
        System.out.println("Resolving EL expressions against JavaBean:");
        System.out.println("  \${user.username}      -> " + resolveElProperty(user, "username"));
        System.out.println("  \${user.email}         -> " + resolveElProperty(user, "email"));
        System.out.println("  \${user.loyaltyPoints} -> " + resolveElProperty(user, "loyaltyPoints"));

        Map<String, Object> sessionScope = new HashMap<>();
        sessionScope.put("theme", "VS Code Dark+");
        sessionScope.put("cartItems", List.of("Spring Boot Book", "Java Concurrency In Practice"));

        System.out.println("\\nResolving EL expressions against Scoped Maps:");
        System.out.println("  \${sessionScope.theme} -> " + resolveElProperty(sessionScope, "theme"));
        
        List<?> items = (List<?>) resolveElProperty(sessionScope, "cartItems");
        System.out.println("  \${empty sessionScope.cartItems} -> " + (items == null || items.isEmpty()));
        System.out.println("  \${sessionScope.cartItems[0]}    -> " + items.get(0));

        System.out.println("\\nExpression Language evaluation completed successfully.");
    }
}`,
        output: `=== Jakarta Expression Language (EL) Evaluator ===
Resolving EL expressions against JavaBean:
  \${user.username}      -> jduke
  \${user.email}         -> duke@oracle.com
  \${user.loyaltyPoints} -> 1500

Resolving EL expressions against Scoped Maps:
  \${sessionScope.theme} -> VS Code Dark+
  \${empty sessionScope.cartItems} -> false
  \${sessionScope.cartItems[0]}    -> Spring Boot Book

Expression Language evaluation completed successfully.`,
        stepByStep: [
          'EL resolves property names by invoking standard JavaBean getters.',
          'Resolves scoped Map lookups for session and request scopes.',
          'Evaluates empty operator returning boolean without NullPointerException.'
        ]
      },
      {
        id: 'ex-77-realistic',
        title: 'Scriptless JSTL Product Catalog View',
        type: 'realistic',
        description: 'Building a product table view using JSTL loops, conditionals, and XSS-safe output.',
        filename: 'catalog-jstl.jsp',
        code: `<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head><title>Product Catalog</title></head>
<body>
    <h1>Store Products</h1>
    <p>Logged in as: <c:out value="\${user.username}" default="Guest" /></p>

    <c:choose>
        <c:when test="\${empty products}">
            <div class="empty-alert">No products available.</div>
        </c:when>
        <c:otherwise>
            <table>
                <c:forEach items="\${products}" var="p" varStatus="loop">
                    <tr>
                        <td>\${loop.count}</td>
                        <td><c:out value="\${p.title}" /></td>
                        <td>$\${p.price}</td>
                    </tr>
                </c:forEach>
            </table>
        </c:otherwise>
    </c:choose>
</body>
</html>`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
<head><title>Product Catalog</title></head>
<body>
    <h1>Store Products</h1>
    <p>Logged in as: Duke</p>
    <table>
        <tr><td>1</td><td>Mechanical Keyboard</td><td>$89.99</td></tr>
    </table>
</body>
</html>`,
        stepByStep: [
          'Evaluates \${user.username} and escapes HTML characters via <c:out>.',
          '<c:choose> verifies collection is not empty.',
          '<c:forEach> iterates over products, outputting numbered table rows.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Using legacy java.sun.com taglib URI in Jakarta EE 10',
        errorCodeOrSnippet: '<%@ taglib uri="http://java.sun.com/jsp/jstl/core" %> // Fails on Tomcat 10+!',
        cause: 'Jakarta EE 10 updated standard taglib URIs to jakarta.tags.core.',
        solution: 'Use <%@ taglib prefix="c" uri="jakarta.tags.core" %>.'
      },
      {
        title: 'Missing JavaBean getter method for EL property lookups',
        errorCodeOrSnippet: 'PropertyNotFoundException: Property [price] not found on type com.app.Item',
        cause: 'EL strictly requires public getPrice() matching standard naming conventions.',
        solution: 'Ensure all accessed properties have public getXxx() getters.'
      }
    ],
    bestPractices: {
      doList: [
        'Enforce scriptlet-free templates via <scripting-invalid>true</scripting-invalid> in web.xml.',
        'Use <c:out> for user-supplied data to prevent Reflected XSS vulnerabilities.',
        'Use ${not empty coll} for collection null and size checks.'
      ],
      dontList: [
        'Do not write raw Java loops inside JSPs when <c:forEach> is available.',
        'Do not concatenate variables directly in SQL strings inside JSPs.',
        'Do not use EL for complex business calculation logic.'
      ],
      whenNotToUse: 'Do not use JSTL when building client-side Single Page Applications (React/Vue); use REST APIs.'
    },
    versionNotes: {
      introduced: 'EL 1.0 in JSP 2.0; Jakarta EL 5.0 and JSTL 3.0 in Jakarta EE 10',
      status: 'Stable',
      compatibilityNotes: 'Taglib URI changed from http://java.sun.com/jsp/jstl/core to jakarta.tags.core.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'JSTL Core Tag Library Reference',
      headers: ['Tag Name', 'Key Attribute', 'Purpose'],
      rows: [
        ['<c:out>', 'value="${x}" default="N/A"', 'Outputs value with automatic HTML entity escaping'],
        ['<c:set>', 'var="x" value="..." scope="..."', 'Stores variable in page/request/session scope'],
        ['<c:if>', 'test="${condition}"', 'Conditional execution block'],
        ['<c:choose>', 'Parent tag', 'Container for when / otherwise branches'],
        ['<c:when>', 'test="${condition}"', 'Conditional branch inside <c:choose>'],
        ['<c:otherwise>', 'None', 'Default fallback branch inside <c:choose>'],
        ['<c:forEach>', 'items="${list}" var="item"', 'Loops over lists, maps, arrays, collections']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix Modern JSTL Taglib URI',
        prompt: 'Why does a JSP deployed to Tomcat 10.1 fail with "Cannot find tag library"?',
        starterCode: `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>`,
        solution: `// Fix: Update URI to Jakarta EE 10 standard:\n<%@ taglib prefix="c" uri="jakarta.tags.core" %>`,
        explanation: 'Tomcat 10.1 / Jakarta EE 10 migrated the standard JSTL URI to jakarta.tags.core.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'XSS-Safe Welcome Banner with JSTL',
        prompt: 'Write a JSTL snippet displaying "Welcome, [User]" or "Sign In" with complete XSS escaping.',
        starterCode: `// Write JSTL choose block`,
        solution: `<c:choose>\n    <c:when test="\${not empty sessionScope.user}">\n        <p>Welcome, <c:out value="\${sessionScope.user.username}" />!</p>\n    </c:when>\n    <c:otherwise>\n        <a href="login.jsp">Please Sign In</a>\n    </c:otherwise>\n</c:choose>`,
        explanation: '<c:out> automatically escapes HTML characters, defeating XSS.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'EL Hyphenated Property Access',
        prompt: 'Why does \${user.first-name} fail and how do you fix it?',
        solution: `// Cause: The dot operator evaluates "first-name" as a subtraction expression (\${user.first minus name})!\n// Fix: Use bracket notation with a string literal:\n\${user['first-name']}`,
        explanation: 'Bracket notation treats special characters as literal map or property keys.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Expression Language Specification 5.0',
        url: 'https://jakarta.ee/specifications/expression-language/5.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Jakarta Standard Tag Library Specification 3.0',
        url: 'https://jakarta.ee/specifications/tags/3.0/',
        organization: 'Jakarta EE'
      }
    ]
  },
  {
    id: 'topic-78',
    slug: 'custom-jsp-tag-libraries',
    topicNumber: 78,
    title: 'Custom JSP Tag Libraries',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 21,
    sectionTitle: 'JavaServer Pages (JSP) & Templating',
    versionBadge: 'Jakarta Pages 3.1 / EE 10',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Build domain-specific view components: extend SimpleTagSupport, create Tag Library Descriptors (.tld), accept dynamic EL attributes, and format localized data.',
    prerequisites: [
      'Topic 74: JSP Architecture & Translation Lifecycle',
      'Topic 77: Expression Language (EL) & JSTL Core Tags'
    ],
    whatAndWhy: {
      definition: 'Custom Tag Libraries allow developers to define domain-specific XML tags backed by Java classes (SimpleTagSupport) and registered in Tag Library Descriptors (.tld) for reusable presentation logic.',
      analogy: 'Pre-fabricated modular building blocks: instead of nailing individual boards every time, you install a factory-tested bay window unit (custom tag) with a single declaration.',
      whyItExists: 'Encapsulates complex presentation logic (localized currency formatting, role-based navigation, data masking) in reusable tags across views.'
    },
    syntaxBreakdown: {
      title: 'SimpleTagSupport and TLD Definition',
      codeSnippet: `// 1. Tag Handler Class\npublic class FormatCurrencyTag extends SimpleTagSupport {\n    private double amount;\n    public void setAmount(double amount) { this.amount = amount; }\n    public void doTag() throws IOException {\n        getJspContext().getOut().print(String.format("$%.2f", amount));\n    }\n}\n\n// 2. TLD Registration (WEB-INF/tld/tags.tld)\n<tag>\n    <name>formatCurrency</name>\n    <tag-class>com.handbook.web.FormatCurrencyTag</tag-class>\n    <body-content>empty</body-content>\n    <attribute>\n        <name>amount</name>\n        <required>true</required>\n        <rtexprvalue>true</rtexprvalue>\n    </attribute>\n</tag>`,
      explanation: 'rtexprvalue=true is mandatory for attributes accepting dynamic Expression Language (${...}) values.',
      tokens: [
        { token: 'SimpleTagSupport', explanation: 'Base class implementing doTag() hook for tag handlers' },
        { token: '.tld file', explanation: 'Tag Library Descriptor XML registering tags and attribute rules' },
        { token: '<rtexprvalue>', explanation: 'Runtime Expression Value: allows passing dynamic ${...} values' },
        { token: '<body-content>', explanation: 'empty (no body), scriptless (HTML/EL allowed), or tagdependent' }
      ]
    },
    examples: [
      {
        id: 'ex-78-basic',
        title: 'Localized Currency Formatter Custom Tag Handler',
        type: 'basic',
        description: 'Extending SimpleTagSupport, receiving typed attributes, and outputting localized currency strings.',
        filename: 'FormatCurrencyTag.java',
        code: `package com.handbook.web;

import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.JspWriter;
import jakarta.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Locale;

public class FormatCurrencyTag extends SimpleTagSupport {

    private double amount;
    private String currencyCode = "USD";

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    @Override
    public void doTag() throws JspException, IOException {
        JspWriter out = getJspContext().getOut();
        Locale locale = "EUR".equalsIgnoreCase(currencyCode) ? Locale.GERMANY : Locale.US;
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        out.print(formatter.format(amount));
    }
}`,
        output: `$149.99
129,50 €`,
        stepByStep: [
          'Tag handler receives amount and currencyCode via setters.',
          'Configures Locale and NumberFormat.',
          'Writes formatted currency string directly to JspWriter.'
        ]
      },
      {
        id: 'ex-78-realistic',
        title: 'Consuming Custom Tags in JSP Template',
        type: 'realistic',
        description: 'Importing the custom tag library and invoking <hb:formatCurrency> with dynamic values.',
        filename: 'el-demo.jsp',
        code: `<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="hb" uri="https://handbook.java/tags" %>
<!DOCTYPE html>
<html>
<head><title>Custom Tag Demo</title></head>
<body>
    <h1>Custom Tag Currency Formatting</h1>
    <p>Product A Price: <hb:formatCurrency amount="149.99" currencyCode="USD" /></p>
    <p>Product B Price: <hb:formatCurrency amount="129.50" currencyCode="EUR" /></p>
</body>
</html>`,
        output: `HTTP/1.1 200 OK
Content-Type: text/html;charset=UTF-8

<!DOCTYPE html>
<html>
<head><title>Custom Tag Demo</title></head>
<body>
    <h1>Custom Tag Currency Formatting</h1>
    <p>Product A Price: $149.99</p>
    <p>Product B Price: 129,50 €</p>
</body>
</html>`,
        stepByStep: [
          'Jasper parses taglib directive with unique URI https://handbook.java/tags.',
          'Locates handbook-tags.tld inside WEB-INF/tld/.',
          'Instantiates FormatCurrencyTag, injects attributes, and calls doTag().'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Omitting <rtexprvalue>true</rtexprvalue> in attribute definitions',
        errorCodeOrSnippet: '<hb:format amount="${item.price}" /> prints literal "${item.price}"',
        cause: 'Without rtexprvalue set to true, Jasper treats values as literal strings without evaluating EL.',
        solution: 'Always set <rtexprvalue>true</rtexprvalue> for attributes accepting dynamic expressions.'
      },
      {
        title: 'Retaining dirty state in tag handler instance fields',
        errorCodeOrSnippet: 'Previous attribute value leaks into subsequent tag executions',
        cause: 'Containers can pool and reuse tag instances across page renderings.',
        solution: 'Ensure all fields are overwritten by setters or reset before doTag() completes.'
      }
    ],
    bestPractices: {
      doList: [
        'Use Tag Files (.tag) in WEB-INF/tags/ for pure HTML component layouts.',
        'Use Java SimpleTagSupport classes for tags requiring heavy Java computations or formatting.',
        'Keep tag handlers stateless and thread-isolated.'
      ],
      dontList: [
        'Do not place database queries or business transaction logic in custom tags.',
        'Do not use legacy classic tag handlers (TagSupport) for new development.',
        'Do not forget to handle null values defensively in tag attribute setters.'
      ],
      whenNotToUse: 'Do not create custom tags for tasks already covered by standard JSTL core and formatting tags (<c:out>, <fmt:formatDate>).'
    },
    versionNotes: {
      introduced: 'SimpleTagSupport introduced in JSP 2.0; updated TLD schema in Jakarta Pages 3.1',
      status: 'Stable',
      compatibilityNotes: 'TLD schema updated to https://jakarta.ee/xml/ns/jakartaee/web-jsptaglibrary_3_0.xsd.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'Tag Library Descriptor (.tld) Elements',
      headers: ['TLD Element', 'Attribute / Child', 'Purpose'],
      rows: [
        ['<taglib>', 'version="3.0"', 'Root container declaring XML namespace and version'],
        ['<uri>', 'string URI', 'Unique namespace identifier used in JSP <%@ taglib %>'],
        ['<tag>', '<name>, <tag-class>', 'Defines custom tag name and backing Java class'],
        ['<body-content>', 'empty | scriptless', 'Declares whether tag allows child content'],
        ['<attribute>', '<rtexprvalue>true</rtexprvalue>', 'Enables dynamic Expression Language (${...}) values']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix EL Attribute Literal Parsing in Custom Tag',
        prompt: 'Why does <app:badge text="${user.role}" /> display "${user.role}" on screen instead of the user role?',
        starterCode: `<attribute>\n    <name>text</name>\n    <required>true</required>\n</attribute>`,
        solution: `<attribute>\n    <name>text</name>\n    <required>true</required>\n    <rtexprvalue>true</rtexprvalue> <!-- Fix -->\n</attribute>`,
        explanation: 'rtexprvalue=true tells Jasper to evaluate Expression Language for the attribute.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Credit Card Masking Tag Handler',
        prompt: 'Write a doTag() implementation that prints only the last 4 digits of a 16-digit cardNumber string, masking the rest.',
        starterCode: `public class MaskTag extends SimpleTagSupport {\n    private String number;\n    public void setNumber(String n) { this.number = n; }\n    public void doTag() throws IOException {\n        // Mask\n    }\n}`,
        solution: `public void doTag() throws IOException {\n    if (number != null && number.length() >= 4) {\n        String last4 = number.substring(number.length() - 4);\n        getJspContext().getOut().print("****-****-****-" + last4);\n    } else {\n        getJspContext().getOut().print("****");\n    }\n}`,
        explanation: 'Custom tags encapsulate domain-specific privacy and masking logic.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Body Content: empty vs scriptless',
        prompt: 'What happens if a tag configured with <body-content>empty</body-content> contains inner HTML in a JSP?',
        solution: `// Result: Jasper throws a Translation / Compilation Error:\n// "Tag [hb:format] has body-content of empty, but contains body".\n// Fix: Use self-closing tag <hb:format /> or set <body-content>scriptless</body-content>.`,
        explanation: 'empty forbids child content, enforcing clean self-closing tag syntax.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Pages Specification 3.1: Chapter 7 Tag Libraries',
        url: 'https://jakarta.ee/specifications/pages/3.1/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat Documentation: Tag Library Descriptor Schema',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/index.html',
        organization: 'Apache Tomcat'
      }
    ]
  }
];
