export const section20Topics = [
  {
    id: 'topic-70',
    slug: 'state-management-sessions-and-cookies',
    topicNumber: 70,
    title: 'State Management: Sessions & Cookies',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 20,
    sectionTitle: 'State Management, Filters & Security',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Bridge stateless HTTP with stateful web interactions: master server-side HttpSession memory, JSESSIONID tracking, secure Cookie flags, and session invalidation.',
    prerequisites: [
      'Topic 64: Web Architecture Fundamentals (HTTP Protocol)',
      'Topic 67: Request and Response Processing in Servlets'
    ],
    whatAndWhy: {
      definition: 'State management bridges stateless HTTP connections by maintaining conversational memory either client-side (Cookies) or server-side (HttpSession linked via JSESSIONID tokens).',
      analogy: 'A waterpark resort: the central hotel database (HttpSession) holds your luggage and room reservations; the waterproof barcode wristband (JSESSIONID Cookie) lets staff look up your account wherever you go.',
      whyItExists: 'Enables user authentication, persistent shopping carts, and personalized preferences across multiple separate HTTP page requests.'
    },
    syntaxBreakdown: {
      title: 'Session and Cookie Operations API',
      codeSnippet: `// 1. Server-side session management\nHttpSession session = req.getSession(true);\nsession.setAttribute("cart", shoppingCart);\nsession.setMaxInactiveInterval(1800); // 30 minutes\n\n// 2. Client-side cookie configuration\nCookie cookie = new Cookie("user_pref", "dark");\ncookie.setHttpOnly(true);  // Prevent XSS access\ncookie.setSecure(true);    // HTTPS only\ncookie.setAttribute("SameSite", "Lax");\nresp.addCookie(cookie);`,
      explanation: 'Marking cookies with HttpOnly and Secure flags protects against cookie theft and network sniffing.',
      tokens: [
        { token: 'req.getSession(true)', explanation: 'Retrieves existing session or instantiates a new one if absent' },
        { token: 'session.setAttribute(name, val)', explanation: 'Binds object into server-side session memory scope' },
        { token: 'session.invalidate()', explanation: 'Destroys session and frees all bound objects immediately' },
        { token: 'cookie.setHttpOnly(true)', explanation: 'Blocks client-side JavaScript document.cookie access (XSS defense)' },
        { token: 'cookie.setMaxAge(0)', explanation: 'Instructs browser to permanently delete the cookie' }
      ]
    },
    examples: [
      {
        id: 'ex-70-basic',
        title: 'Stateful Shopping Cart with Session Invalidation',
        type: 'basic',
        description: 'Demonstrating session creation, storing items, checking session IDs, and invalidating on checkout.',
        filename: 'SessionShoppingCartServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "SessionShoppingCartServlet", urlPatterns = {"/cart"})
public class SessionShoppingCartServlet extends HttpServlet {

    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(true);
        session.setMaxInactiveInterval(1800);

        List<String> cart = (List<String>) session.getAttribute("shoppingCart");
        if (cart == null) {
            cart = new ArrayList<>();
            session.setAttribute("shoppingCart", cart);
        }

        String action = req.getParameter("action");
        String item = req.getParameter("item");

        if ("add".equalsIgnoreCase(action) && item != null && !item.isBlank()) {
            cart.add(item.trim());
        } else if ("clear".equalsIgnoreCase(action)) {
            session.invalidate();
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("Session invalidated. Cart cleared.");
            return;
        }

        resp.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.println("{");
            out.printf("  \\"sessionId\\": \\"%s\\",%n", session.getId());
            out.printf("  \\"isNew\\": %b,%n", session.isNew());
            out.printf("  \\"creationTime\\": %d,%n", session.getCreationTime());
            out.printf("  \\"itemCount\\": %d,%n", cart.size());
            out.printf("  \\"items\\": %s%n", cart);
            out.println("}");
        }
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Set-Cookie: JSESSIONID=E5B942FA104BC8A0; Path=/handbook; HttpOnly

{
  "sessionId": "E5B942FA104BC8A0",
  "isNew": true,
  "creationTime": 1731885500000,
  "itemCount": 1,
  "items": [Keyboard]
}`,
        stepByStep: [
          'Client hits /cart; container allocates a new 128-bit random JSESSIONID.',
          'Servlet stores cart items inside session memory scope.',
          'Tomcat attaches Set-Cookie header with HttpOnly flag.',
          'Subsequent requests include JSESSIONID cookie, reconnecting user to cart state.'
        ]
      },
      {
        id: 'ex-70-realistic',
        title: 'Secure Cookie Consent Manager',
        type: 'realistic',
        description: 'Configuring cookies with HttpOnly, Secure, and SameSite flags, reading cookies, and deleting with setMaxAge(0).',
        filename: 'CookieConsentServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "CookieConsentServlet", urlPatterns = {"/cookies"})
public class CookieConsentServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String action = req.getParameter("action");
        resp.setContentType("text/plain;charset=UTF-8");

        if ("set".equalsIgnoreCase(action)) {
            Cookie cookie = new Cookie("user_consent", "accepted");
            cookie.setMaxAge(60 * 60 * 24 * 30);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setAttribute("SameSite", "Lax");
            
            resp.addCookie(cookie);
            resp.getWriter().println("Cookie 'user_consent=accepted' attached to response.");
            return;
        } else if ("delete".equalsIgnoreCase(action)) {
            Cookie cookie = new Cookie("user_consent", "");
            cookie.setMaxAge(0);
            cookie.setPath("/");
            resp.addCookie(cookie);
            resp.getWriter().println("Cookie 'user_consent' deleted.");
            return;
        }

        Cookie[] cookies = req.getCookies();
        try (PrintWriter out = resp.getWriter()) {
            out.println("=== Incoming Request Cookies ===");
            if (cookies != null && cookies.length > 0) {
                for (Cookie c : cookies) {
                    out.printf("  %s = %s (Path: %s, MaxAge: %d)%n", 
                        c.getName(), c.getValue(), c.getPath(), c.getMaxAge());
                }
            } else {
                out.println("  (No cookies found in request)");
            }
        }
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8
Set-Cookie: user_consent=accepted; Max-Age=2592000; Path=/; Secure; HttpOnly; SameSite=Lax

Cookie 'user_consent=accepted' attached to response.`,
        stepByStep: [
          'Servlet instantiates Cookie object with name and value.',
          'Sets MaxAge to 30 days, Path to /, HttpOnly to true, and Secure to true.',
          'Adds cookie to response; browser writes cookie to encrypted storage.',
          'Deletion request sets MaxAge to 0, removing the cookie immediately.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Storing large datasets or database cursors in HttpSession',
        errorCodeOrSnippet: 'session.setAttribute("allOrders", 50000_records_list); // High Heap Pressure!',
        cause: 'Every session resides in server RAM. Multiplying large objects across thousands of users triggers OutOfMemoryError.',
        solution: 'Store only primary keys or IDs in session; query data from database or cache as needed.'
      },
      {
        title: 'Omitting setHttpOnly(true) on sensitive authentication cookies',
        errorCodeOrSnippet: 'document.cookie accessible in JavaScript console',
        cause: 'Missing HttpOnly allows any Cross-Site Scripting (XSS) vulnerability to steal session tokens.',
        solution: 'Always mark session and authorization cookies with cookie.setHttpOnly(true).'
      }
    ],
    bestPractices: {
      doList: [
        'Configure session timeouts in web.xml (<session-timeout>30</session-timeout>).',
        'Call session.invalidate() immediately upon user logout to terminate session credentials.',
        'Rotate session IDs using req.changeSessionId() upon successful login.'
      ],
      dontList: [
        'Do not store plain-text passwords or secret keys in cookies or sessions.',
        'Do not pass JSESSIONID tokens in URL query strings (URL rewriting is insecure).',
        'Do not assume session attributes survive server restarts unless classes implement Serializable.'
      ],
      whenNotToUse: 'Do not use server-side sessions for high-scale microservices; use stateless signed JWT tokens or external distributed caches (Redis).'
    },
    versionNotes: {
      introduced: 'HttpSession and Cookie in Servlet 2.0; cookie-config in Servlet 3.0; SameSite in Servlet 6.0',
      status: 'Stable',
      compatibilityNotes: 'Servlet 6.0 removed deprecated URL rewriting methods for session IDs.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'Session vs Cookie Comparison Matrix',
      headers: ['Feature', 'HttpSession', 'Cookie'],
      rows: [
        ['Storage Location', 'Server-side RAM', 'Client-side Browser Storage'],
        ['Max Size', 'Limited only by server heap', '4 KB per cookie maximum'],
        ['Data Types', 'Any Java Object (Serializable)', 'Strings only'],
        ['Security Risk', 'Low client exposure; high server memory cost', 'High exposure to XSS/network sniffing'],
        ['Transmission', 'Only token (JSESSIONID) sent', 'Full cookie value sent with every request'],
        ['Typical Use', 'Cart, user role, auth state', 'Theme preference, consent tokens, tracking']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix Ineffective Cookie Deletion',
        prompt: 'Why does this cookie fail to delete on the client browser?',
        starterCode: `Cookie c = new Cookie("user_token", "");\nresp.addCookie(c);`,
        solution: `Cookie c = new Cookie("user_token", "");\nc.setMaxAge(0); // Mandatory to trigger browser deletion\nc.setPath("/"); // Must match original path\nresp.addCookie(c);`,
        explanation: 'Without setMaxAge(0) and matching the original path, the browser treats it as a value update rather than a deletion.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Session Request Throttling Counter',
        prompt: 'Implement a request counter inside HttpSession that limits a session to 10 requests, returning HTTP 429 on request 11.',
        starterCode: `protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    // Implement rate limiter\n}`,
        solution: `protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    HttpSession session = req.getSession(true);\n    Integer count = (Integer) session.getAttribute("reqCount");\n    count = (count == null) ? 1 : count + 1;\n    if (count > 10) {\n        resp.sendError(429, "Too many requests in this session.");\n        return;\n    }\n    session.setAttribute("reqCount", count);\n    resp.getWriter().println("Request number: " + count);\n}`,
        explanation: 'Storing request counters in session enables per-user rate limiting without external databases.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Clustered Session Replication Requirements',
        prompt: 'Why must classes stored in an HttpSession implement java.io.Serializable when deploying to Tomcat clusters?',
        solution: `// Tomcat clustered session managers (e.g. DeltaManager) serialize session attributes\n// across TCP sockets to mirror session state on backup server instances.\n// Non-serializable classes cause NotSerializableException during replication.`,
        explanation: 'Serializable is required for JVM network serialization during high-availability failover.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0: Chapter 7 Sessions',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1 Documentation: Session Management',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/config/manager.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-71',
    slug: 'servlet-filters-and-filter-chains',
    topicNumber: 71,
    title: 'Servlet Filters & Filter Chains',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 20,
    sectionTitle: 'State Management, Filters & Security',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master cross-cutting request interception: chain filters for logging, authentication guards, character encoding enforcement, and request/response wrapping.',
    prerequisites: [
      'Topic 66: Servlet Lifecycle & Architecture',
      'Topic 67: Request and Response Processing in Servlets'
    ],
    whatAndWhy: {
      definition: 'A Filter is an interceptor component positioned between client requests and target servlets that can inspect, modify, or block requests, and transform outgoing responses.',
      analogy: 'Airport security checkpoints: before reaching your gate (Servlet), you must pass through passport verification (Auth Filter), baggage scanning (Security Filter), and boarding pass stamping (Audit Filter).',
      whyItExists: 'Encapsulates common cross-cutting concerns (logging, authentication, compression, encoding) in reusable components without duplicating code across servlets.'
    },
    syntaxBreakdown: {
      title: 'Filter Interface and Chaining API',
      codeSnippet: `@WebFilter(filterName = "AuditFilter", urlPatterns = {"/*"})\npublic class AuditFilter implements Filter {\n    @Override\n    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain)\n            throws IOException, ServletException {\n        // Pre-processing\n        long start = System.currentTimeMillis();\n        try {\n            chain.doFilter(req, resp); // Pass down chain\n        } finally {\n            // Post-processing\n            long elapsed = System.currentTimeMillis() - start;\n        }\n    }\n}`,
      explanation: 'Always call chain.doFilter() unless deliberately blocking the request (e.g. unauthenticated access).',
      tokens: [
        { token: 'Filter', explanation: 'Core interceptor interface defining init, doFilter, and destroy' },
        { token: 'FilterChain.doFilter(req, resp)', explanation: 'Transfers control to next filter in pipeline or target servlet' },
        { token: '@WebFilter', explanation: 'Registers filter and binds it to URL patterns or servlet names' },
        { token: 'chain.doFilter short-circuit', explanation: 'Omitting chain.doFilter halts request; downstream servlets never run' }
      ]
    },
    examples: [
      {
        id: 'ex-71-basic',
        title: 'Global Request Performance & Audit Logging Filter',
        type: 'basic',
        description: 'Measuring execution latency across all incoming requests and logging method, URI, status, and duration.',
        filename: 'RequestLoggingFilter.java',
        code: `package com.handbook.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "RequestLoggingFilter", urlPatterns = {"/*"})
public class RequestLoggingFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("[RequestLoggingFilter] Initialized globally for: /*");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        long startTime = System.currentTimeMillis();
        String uri = req.getRequestURI();
        String method = req.getMethod();

        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = resp.getStatus();
            System.out.printf("[Audit Filter] %s %s -> HTTP %d (%d ms)%n", 
                method, uri, status, duration);
        }
    }

    @Override
    public void destroy() {
        System.out.println("[RequestLoggingFilter] Destroyed.");
    }
}`,
        output: `[RequestLoggingFilter] Initialized globally for: /*
[Audit Filter] GET /handbook/inspect -> HTTP 200 (4 ms)`,
        stepByStep: [
          'Filter intercepts incoming GET /handbook/inspect before servlet.',
          'Records initial start timestamp.',
          'Calls chain.doFilter() to execute target RequestInspectorServlet.',
          'Finally block captures completion time and prints audit metrics.'
        ]
      },
      {
        id: 'ex-71-realistic',
        title: 'Authentication & Authorization Guard Filter',
        type: 'realistic',
        description: 'Intercepting requests to /admin/*, inspecting session authentication, and returning 401 Unauthorized on unauthenticated access.',
        filename: 'AuthGuardFilter.java',
        code: `package com.handbook.web;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter(filterName = "AuthGuardFilter", urlPatterns = {"/admin/*", "/protected/*"})
public class AuthGuardFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        HttpSession session = req.getSession(false);
        boolean isAuthenticated = session != null && session.getAttribute("authenticatedUser") != null;

        if (!isAuthenticated) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("401 Unauthorized: Access to protected resource requires login.");
            return;
        }

        chain.doFilter(request, response);
    }
}`,
        output: `HTTP/1.1 401 Unauthorized
Content-Type: text/plain;charset=UTF-8

401 Unauthorized: Access to protected resource requires login.`,
        stepByStep: [
          'Client attempts GET /admin/dashboard without active credentials.',
          'Filter checks req.getSession(false) for authenticatedUser attribute.',
          'Verification fails; sets HTTP 401 Unauthorized and writes error message.',
          'Method returns immediately without invoking chain.doFilter().',
          'Downstream admin servlets are completely protected from execution.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Forgetting to call chain.doFilter() during normal request processing',
        errorCodeOrSnippet: 'public void doFilter(...) { doWork(); } // Missing chain.doFilter!',
        cause: 'If chain.doFilter() is omitted, the request pipeline halts permanently and client hangs or gets blank page.',
        solution: 'Always call chain.doFilter(request, response) unless deliberately blocking an unauthorized request.'
      },
      {
        title: 'Assuming deterministic filter execution order when using @WebFilter',
        errorCodeOrSnippet: '@WebFilter(urlPatterns="/*") on multiple filters',
        cause: 'Servlet specification does not guarantee order of filters configured via annotations.',
        solution: 'Use web.xml <filter-mapping> elements when strict execution sequence is mandatory.'
      }
    ],
    bestPractices: {
      doList: [
        'Use try / finally blocks around chain.doFilter() when measuring metrics or releasing resources.',
        'Use HttpServletRequestWrapper when modifying incoming parameters or headers.',
        'Configure critical security filter ordering in web.xml rather than relying on annotation discovery.'
      ],
      dontList: [
        'Do not execute expensive synchronous database operations on every single request in a /* filter.',
        'Do not call chain.doFilter() multiple times in the same filter invocation.',
        'Do not forget to cast ServletRequest to HttpServletRequest when accessing HTTP-specific APIs.'
      ],
      whenNotToUse: 'Do not use raw servlet filters for fine-grained method-level business authorization; use Spring Security method security or Jakarta Security annotations (@RolesAllowed).'
    },
    versionNotes: {
      introduced: 'Filter introduced in Servlet 2.3; @WebFilter and async support in Servlet 3.0',
      status: 'Stable',
      compatibilityNotes: 'Default methods added to Filter interface in modern Java releases.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'Filter Pipeline Lifecycle & Hooks',
      headers: ['Phase', 'Method Call', 'Timing', 'Responsibility'],
      rows: [
        ['Initialization', 'filter.init(FilterConfig)', 'Once at server startup', 'Resource allocation and parameter parsing'],
        ['Pre-Processing', 'Before chain.doFilter()', 'On every matched request', 'Authentication checks, logging start, wrapping'],
        ['Delegation', 'chain.doFilter(req, resp)', 'Center of pipeline', 'Passes execution down to next filter or servlet'],
        ['Post-Processing', 'After chain.doFilter()', 'As response unwinds', 'Response compression, latency logging, cleanup'],
        ['Destruction', 'filter.destroy()', 'Once at server shutdown', 'Releasing connection pools, memory cleanup']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix Double Chain Invocation',
        prompt: 'Why does this filter cause an IllegalStateException on downstream servlets?',
        starterCode: `if (isValid(req)) {\n    chain.doFilter(req, resp);\n}\nchain.doFilter(req, resp);`,
        solution: `// Fix: Add return or else branch:\nif (isValid(req)) {\n    chain.doFilter(req, resp);\n} else {\n    ((HttpServletResponse) resp).sendError(400, "Invalid Request");\n}`,
        explanation: 'Calling chain.doFilter() twice invokes the servlet twice, causing conflicting response buffer commits.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Global UTF-8 Character Encoding Filter',
        prompt: 'Write an annotated Filter that forces request and response character encodings to UTF-8.',
        starterCode: `// Implement filter class\npublic class EncodingFilter implements Filter {\n}`,
        solution: `@WebFilter("/*")\npublic class EncodingFilter implements Filter {\n    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) \n            throws IOException, ServletException {\n        req.setCharacterEncoding("UTF-8");\n        resp.setCharacterEncoding("UTF-8");\n        chain.doFilter(req, resp);\n    }\n}`,
        explanation: 'Setting UTF-8 encoding in a global filter guarantees uniform character decoding across all servlets.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Request Wrapper Use Cases',
        prompt: 'Why would a developer need to wrap an HttpServletRequest using HttpServletRequestWrapper inside a filter?',
        solution: `// HttpServletRequest parameters and body streams are read-only by default.\n// An HttpServletRequestWrapper allows overriding getParameter(), getHeader(), or getInputStream()\n// to sanitize inputs, inject headers, or cache the request body stream.`,
        explanation: 'Wrapping implements the Decorator pattern for request/response customization.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0: Chapter 6 Filtering',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1 Documentation: Filter Architecture',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/appdev/deployment.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-72',
    slug: 'web-listeners-and-application-lifecycle',
    topicNumber: 72,
    title: 'Web Listeners & Application Lifecycle',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 20,
    sectionTitle: 'State Management, Filters & Security',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '11 min read',
    shortDescription: 'Leverage the Observer pattern in web applications: intercept application startup/shutdown (ServletContextListener), session tracking, and request lifecycle events.',
    prerequisites: [
      'Topic 65: Apache Tomcat & The WAR Structure',
      'Topic 66: Servlet Lifecycle & Architecture',
      'Topic 70: State Management: Sessions and Cookies'
    ],
    whatAndWhy: {
      definition: 'Web Listeners are event observer components registered with the Servlet container that receive automatic callback notifications when application, session, or request lifecycle events occur.',
      analogy: 'A stadium operations team: the facility manager (ServletContextListener) turns on floodlights and checks gates before anyone arrives; the turnstile counter (HttpSessionListener) tracks spectator ingress and egress in real time.',
      whyItExists: 'Provides clean hooks for starting background tasks, initializing database connection pools, monitoring active sessions, and cleaning up thread-local variables.'
    },
    syntaxBreakdown: {
      title: 'Listener Categories and Annotations',
      codeSnippet: `// 1. Application-wide startup and shutdown\n@WebListener\npublic class AppInitListener implements ServletContextListener {\n    public void contextInitialized(ServletContextEvent sce) { /* Server Boot */ }\n    public void contextDestroyed(ServletContextEvent sce) { /* Server Stop */ }\n}\n\n// 2. Session creation and destruction\n@WebListener\npublic class SessionTracker implements HttpSessionListener {\n    public void sessionCreated(HttpSessionEvent se) { /* User Arrived */ }\n    public void sessionDestroyed(HttpSessionEvent se) { /* Session Expired */ }\n}`,
      explanation: 'Listeners are marked with @WebListener and automatically invoked by Tomcat without requiring web.xml.',
      tokens: [
        { token: '@WebListener', explanation: 'Class annotation registering the listener with the web container' },
        { token: 'ServletContextListener', explanation: 'Listens for web application startup and shutdown' },
        { token: 'HttpSessionListener', explanation: 'Listens for HTTP session creation and invalidation' },
        { token: 'ServletRequestListener', explanation: 'Listens for each individual HTTP request arrival and completion' }
      ]
    },
    examples: [
      {
        id: 'ex-72-basic',
        title: 'Application Bootstrap & Teardown Listener',
        type: 'basic',
        description: 'Initializing application-scope configuration and connection pool status at boot, and cleaning up on shutdown.',
        filename: 'AppBootstrapListener.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

@WebListener
public class AppBootstrapListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        System.out.println("[AppBootstrapListener] Web application starting: " + ctx.getContextPath());
        
        ctx.setAttribute("appName", "Definitive Java Handbook Web App");
        ctx.setAttribute("appStartTime", System.currentTimeMillis());
        ctx.setAttribute("dbPoolStatus", "READY");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        ServletContext ctx = sce.getServletContext();
        System.out.println("[AppBootstrapListener] Web application shutting down: " + ctx.getContextPath());
        ctx.removeAttribute("dbPoolStatus");
    }
}`,
        output: `[AppBootstrapListener] Web application starting: /handbook
[AppBootstrapListener] Web application shutting down: /handbook`,
        stepByStep: [
          'Tomcat starts up and deploys the web application.',
          'contextInitialized() executes before any filters or servlets are initialized.',
          'Global application attributes are bound to ServletContext.',
          'On server stop, contextDestroyed() releases pools and cached resources.'
        ]
      },
      {
        id: 'ex-72-realistic',
        title: 'Concurrent Active Session Tracker Listener',
        type: 'realistic',
        description: 'Tracking real-time active user sessions using thread-safe AtomicInteger counters.',
        filename: 'ActiveSessionTrackerListener.java',
        code: `package com.handbook.web;

import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import java.util.concurrent.atomic.AtomicInteger;

@WebListener
public class ActiveSessionTrackerListener implements HttpSessionListener {

    private static final AtomicInteger activeSessions = new AtomicInteger(0);

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        int total = activeSessions.incrementAndGet();
        System.out.println("[SessionTracker] Session created: " + se.getSession().getId() + " | Active: " + total);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        int total = activeSessions.decrementAndGet();
        System.out.println("[SessionTracker] Session destroyed: " + se.getSession().getId() + " | Active: " + total);
    }

    public static int getActiveSessionCount() {
        return activeSessions.get();
    }
}`,
        output: `[SessionTracker] Session created: 8F2A01C90B44 | Active: 1
[SessionTracker] Session created: 31DC99A2E101 | Active: 2
[SessionTracker] Session destroyed: 8F2A01C90B44 | Active: 1`,
        stepByStep: [
          'User hits application and creates session; sessionCreated() increments counter.',
          'Second user arrives; counter increments to 2.',
          'User session times out after 30 minutes; sessionDestroyed() decrements counter safely.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Holding ThreadLocal data in ServletRequestListener without cleanup',
        errorCodeOrSnippet: 'userContext.set(user); // Missing userContext.remove() in requestDestroyed()',
        cause: 'Tomcat reuses worker threads from a pool. Unremoved ThreadLocal data leaks into unrelated user requests.',
        solution: 'Always invoke ThreadLocal.remove() inside requestDestroyed() to prevent memory leaks and data cross-talk.'
      },
      {
        title: 'Executing long-blocking synchronous operations in contextInitialized()',
        errorCodeOrSnippet: 'Connecting to remote cluster without network timeout',
        cause: 'Blocks Tomcat server boot, leading to container startup abort or deployment timeouts.',
        solution: 'Use asynchronous worker threads or configure explicit connection timeouts for external services.'
      }
    ],
    bestPractices: {
      doList: [
        'Initialize relational connection pools (HikariCP / Tomcat DataSource) in ServletContextListener.',
        'Use thread-safe concurrency utilities (AtomicInteger, ConcurrentHashMap) for listener counters.',
        'Always clean up background threads and executor services in contextDestroyed().'
      ],
      dontList: [
        'Do not assume listeners are created per-thread; a single instance handles concurrent events.',
        'Do not place user-specific data in ServletContext (application scope is shared across all users).',
        'Do not throw unchecked runtime exceptions in contextInitialized() unless intending to abort deployment.'
      ],
      whenNotToUse: 'Do not use listeners for request routing or response modification; use Filters for request interception.'
    },
    versionNotes: {
      introduced: 'ServletContextListener and HttpSessionListener in Servlet 2.3; @WebListener in Servlet 3.0',
      status: 'Stable',
      compatibilityNotes: 'Programmatic registration available via ServletContext.addListener().',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'Web Listener Scopes & Event Methods',
      headers: ['Listener Interface', 'Scope', 'Event Hook', 'Primary Responsibility'],
      rows: [
        ['ServletContextListener', 'Application', 'contextInitialized()', 'Pool initialization, cache warm-up'],
        ['ServletContextListener', 'Application', 'contextDestroyed()', 'Graceful shutdown, pool cleanup'],
        ['HttpSessionListener', 'Session', 'sessionCreated()', 'Active session counting, audit logging'],
        ['HttpSessionListener', 'Session', 'sessionDestroyed()', 'Session timeout cleanup'],
        ['ServletRequestListener', 'Request', 'requestInitialized()', 'ThreadLocal setup, correlation ID tracking'],
        ['ServletRequestListener', 'Request', 'requestDestroyed()', 'ThreadLocal cleanup, latency tracking']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Fix ThreadLocal Memory Leak in Listener',
        prompt: 'Why does this listener cause memory cross-contamination across requests?',
        starterCode: `@WebListener\npublic class TraceListener implements ServletRequestListener {\n    private static final ThreadLocal<String> trace = new ThreadLocal<>();\n    public void requestInitialized(ServletRequestEvent sre) {\n        trace.set(UUID.randomUUID().toString());\n    }\n}`,
        solution: `// Fix: Override requestDestroyed to clean up ThreadLocal:\n@Override\npublic void requestDestroyed(ServletRequestEvent sre) {\n    trace.remove();\n}`,
        explanation: 'Worker threads are reused by Tomcat; omitting remove() leaks state into subsequent requests.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Active Session Metric Exposer',
        prompt: 'Write an HttpSessionListener that increments and decrements an AtomicInteger, exposing getCount().',
        starterCode: `public class CounterListener implements HttpSessionListener {\n    // Implement\n}`,
        solution: `@WebListener\npublic class CounterListener implements HttpSessionListener {\n    private static final AtomicInteger count = new AtomicInteger(0);\n    public void sessionCreated(HttpSessionEvent se) { count.incrementAndGet(); }\n    public void sessionDestroyed(HttpSessionEvent se) { count.decrementAndGet(); }\n    public static int getCount() { return count.get(); }\n}`,
        explanation: 'AtomicInteger guarantees thread-safe counting across concurrent user sessions.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Container Component Initialization Order',
        prompt: 'In what exact sequence does Apache Tomcat initialize listeners, filters, and servlets at boot?',
        solution: `// 1. ServletContextListeners (contextInitialized)\n// 2. Filters (init) in configured order\n// 3. Servlets with loadOnStartup >= 0 (init) ordered by priority`,
        explanation: 'The Servlet specification mandates this sequence so pools are ready before filters and servlets boot.'
      }
    ],
    officialSources: [
      {
        title: 'Jakarta Servlet Specification 6.0: Chapter 10 Lifecycle Events',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      },
      {
        title: 'Apache Tomcat 10.1 Documentation: Listeners Component',
        url: 'https://tomcat.apache.org/tomcat-10.1-doc/config/listeners.html',
        organization: 'Apache Tomcat'
      }
    ]
  },
  {
    id: 'topic-73',
    slug: 'web-security-essentials',
    topicNumber: 73,
    title: 'Web Security Essentials in Jakarta EE',
    part: 'Part 2: Java EE & Jakarta EE',
    sectionNumber: 20,
    sectionTitle: 'State Management, Filters & Security',
    versionBadge: 'Jakarta EE 10+ / Servlet 6.0',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Defend web applications against OWASP Top 10 vulnerabilities: implement synchronizer CSRF tokens, XSS HTML entity escaping, and session fixation prevention.',
    prerequisites: [
      'Topic 64: Web Architecture Fundamentals (HTTP Protocol)',
      'Topic 67: Request and Response Processing in Servlets',
      'Topic 70: State Management: Sessions and Cookies'
    ],
    whatAndWhy: {
      definition: 'Web security essentials encompass server-side defensive practices defending against unauthorized execution (CSRF), malicious script injection (XSS), credential hijacking (Session Fixation), and network eavesdropping.',
      analogy: 'Bank security: CSRF tokens are verified signature seals on withdrawal slips; XSS escaping is inspecting luggage for weapons at the entrance; session rotation is replacing locker padlocks the moment valuables are deposited.',
      whyItExists: 'Web applications are exposed to automated exploit scanners; lack of defenses leads to user account takeovers, data theft, and unauthorized transactions.'
    },
    syntaxBreakdown: {
      title: 'Security Defensive Patterns API',
      codeSnippet: `// 1. CSRF Token Defense\nString sessionToken = (String) session.getAttribute("CSRF_TOKEN");\nString reqToken = req.getParameter("csrfToken");\nif (sessionToken == null || !sessionToken.equals(reqToken)) {\n    resp.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF Token");\n    return;\n}\n\n// 2. Session Fixation Defense\nreq.changeSessionId(); // Rotates ID, preserves session attributes\n\n// 3. XSS HTML Entity Escaping\nString safe = escapeHtml(userInput);`,
      explanation: 'Synchronizer tokens prevent cross-origin forgery; changeSessionId() invalidates pre-authentication IDs.',
      tokens: [
        { token: 'CSRF Token', explanation: 'Cryptographic secret unique to user session embedded in mutating forms' },
        { token: 'req.changeSessionId()', explanation: 'Rotates session identifier upon login, preventing session fixation' },
        { token: 'XSS Escaping', explanation: 'Converts <, >, &, ", \' to harmless HTML entity codes' },
        { token: 'HttpOnly Flag', explanation: 'Forbids client JavaScript from accessing document.cookie' }
      ]
    },
    examples: [
      {
        id: 'ex-73-basic',
        title: 'Synchronizer CSRF Token Protected Form Handler',
        type: 'basic',
        description: 'Generating cryptographically strong random tokens on GET, embedding in forms, and validating on POST.',
        filename: 'CsrfProtectionServlet.java',
        code: `package com.handbook.web;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;

@WebServlet(name = "CsrfProtectionServlet", urlPatterns = {"/transfer"})
public class CsrfProtectionServlet extends HttpServlet {

    private final SecureRandom random = new SecureRandom();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(true);
        String csrfToken = (String) session.getAttribute("CSRF_TOKEN");
        if (csrfToken == null) {
            byte[] bytes = new byte[24];
            random.nextBytes(bytes);
            csrfToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
            session.setAttribute("CSRF_TOKEN", csrfToken);
        }

        resp.setContentType("text/html;charset=UTF-8");
        resp.getWriter().printf("""
            <form method="POST" action="%s/transfer">
                <input type="hidden" name="csrfToken" value="%s" />
                <label>Amount: <input type="number" name="amount" value="100"/></label>
                <button type="submit">Transfer Funds</button>
            </form>
            """, req.getContextPath(), csrfToken);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        HttpSession session = req.getSession(false);
        String sessionToken = session != null ? (String) session.getAttribute("CSRF_TOKEN") : null;
        String requestToken = req.getParameter("csrfToken");

        if (sessionToken == null || requestToken == null || !sessionToken.equals(requestToken)) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.setContentType("text/plain;charset=UTF-8");
            resp.getWriter().println("403 Forbidden: Invalid or missing CSRF token.");
            return;
        }

        String amount = req.getParameter("amount");
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.setContentType("text/plain;charset=UTF-8");
        resp.getWriter().printf("Funds transfer approved: $%s transferred securely.%n", amount);
    }
}`,
        output: `HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8

Funds transfer approved: $100 transferred securely.`,
        stepByStep: [
          'GET request generates cryptographically random token via SecureRandom.',
          'Token is stored in HttpSession and embedded in hidden HTML form field.',
          'POST submission transmits token back to the server.',
          'Servlet validates token equality; forged cross-origin requests are rejected with 403.'
        ]
      },
      {
        id: 'ex-73-realistic',
        title: 'XSS Entity Sanitizer & Session Fixation Suite',
        type: 'realistic',
        description: 'Demonstrating HTML entity neutralization against XSS and modeling req.changeSessionId() rotation.',
        filename: 'SecuritySanitizerApp.java',
        code: `package com.handbook.web;

public class SecuritySanitizerApp {

    public static String escapeHtml(String input) {
        if (input == null) return "";
        StringBuilder out = new StringBuilder(input.length() + 16);
        for (char c : input.toCharArray()) {
            switch (c) {
                case '<' -> out.append("&lt;");
                case '>' -> out.append("&gt;");
                case '&' -> out.append("&amp;");
                case '"' -> out.append("&quot;");
                case '\'' -> out.append("&#x27;");
                default -> out.append(c);
            }
        }
        return out.toString();
    }

    public static void main(String[] args) {
        System.out.println("=== Web Application Security Defense Suite ===");
        
        String maliciousComment = "<script>alert('Stealing cookie: ' + document.cookie);</script>";
        String safeHtml = escapeHtml(maliciousComment);

        System.out.println("Original Malicious Input:");
        System.out.println("  " + maliciousComment);
        System.out.println("Escaped Safe HTML Output:");
        System.out.println("  " + safeHtml);

        String initialSessionId = "JSESSIONID-ANONYMOUS-8041";
        System.out.printf("%n[Session Fixation Defense]%n");
        System.out.println("  Initial Anonymous Session: " + initialSessionId);
        
        String rotatedSessionId = "JSESSIONID-AUTHENTICATED-9923";
        System.out.println("  User Authenticated: Rotating Session via req.changeSessionId()");
        System.out.println("  New Secure Authenticated Session: " + rotatedSessionId);

        System.out.println("Web security defense verification completed successfully.");
    }
}`,
        output: `=== Web Application Security Defense Suite ===
Original Malicious Input:
  <script>alert('Stealing cookie: ' + document.cookie);</script>
Escaped Safe HTML Output:
  &lt;script&gt;alert(&#x27;Stealing cookie: &#x27; + document.cookie);&lt;/script&gt;

[Session Fixation Defense]
  Initial Anonymous Session: JSESSIONID-ANONYMOUS-8041
  User Authenticated: Rotating Session via req.changeSessionId()
  New Secure Authenticated Session: JSESSIONID-AUTHENTICATED-9923
Web security defense verification completed successfully.`,
        stepByStep: [
          'Malicious script tags are sanitized by replacing < and > with &lt; and &gt;.',
          'Browser renders text harmlessly rather than executing JavaScript.',
          'Models session identifier rotation upon authentication to defeat fixation.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Reflecting user-provided inputs directly into HTML responses',
        errorCodeOrSnippet: 'out.println("<h1>Hello, " + req.getParameter("name") + "</h1>");',
        cause: 'Enables Cross-Site Scripting (XSS) allowing attackers to inject malicious script tags.',
        solution: 'Always encode user inputs with escapeHtml() or JSTL <c:out> before output.'
      },
      {
        title: 'Allowing state-mutating operations on HTTP GET requests',
        errorCodeOrSnippet: '<a href="/transfer?amount=500">Click here</a>',
        cause: 'GET requests cannot be easily protected by CSRF tokens and can be triggered via <img> tags.',
        solution: 'Strictly enforce POST, PUT, or DELETE for state mutations and validate CSRF tokens.'
      }
    ],
    bestPractices: {
      doList: [
        'Enforce Synchronizer CSRF tokens on all form submissions and state-changing POST requests.',
        'Always call request.changeSessionId() immediately after successful user login.',
        'Configure HttpOnly and Secure flags on all session cookies in web.xml.'
      ],
      dontList: [
        'Do not use simple String.equals() for cryptographic token verification (prevents timing attacks; use MessageDigest.isEqual()).',
        'Do not disable Content-Security-Policy (CSP) headers in production.',
        'Do not store unhashed passwords in session attributes or databases.'
      ],
      whenNotToUse: 'Do not implement custom cryptography algorithms or random number generators; always use java.security.SecureRandom.'
    },
    versionNotes: {
      introduced: 'changeSessionId() in Servlet 3.1; SameSite cookie support formalized in Servlet 6.0',
      status: 'Stable',
      compatibilityNotes: 'Tomcat 10.1 fully implements Servlet 6.0 security contracts.',
      ltsAvailability: 'Jakarta EE 10 / Tomcat 10.1 enterprise baseline.'
    },
    cheatSheet: {
      title: 'Top Web Vulnerabilities & Defenses',
      headers: ['Vulnerability', 'Attack Vector', 'Primary Defense Mechanism'],
      rows: [
        ['XSS (Cross-Site Scripting)', 'Script injected into page HTML', 'HTML entity escaping, Content-Security-Policy (CSP)'],
        ['CSRF (Request Forgery)', 'Forged cross-site form submission', 'Synchronizer CSRF Tokens + SameSite=Lax/Strict'],
        ['Session Fixation', 'Attacker presets victim session ID', 'Call request.changeSessionId() on login'],
        ['Cookie Theft / Hijacking', 'Reading document.cookie via JS', 'Configure HttpOnly and Secure cookie flags'],
        ['Clickjacking', 'Embedding site inside transparent iframe', 'Add X-Frame-Options: DENY response header']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Identify Reflected XSS Vulnerability',
        prompt: 'Identify the security vulnerability in this error message renderer and fix it:',
        starterCode: `protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    String msg = req.getParameter("msg");\n    resp.getWriter().println("<div class='alert'>" + msg + "</div>");\n}`,
        solution: `protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {\n    String msg = req.getParameter("msg");\n    resp.setContentType("text/html;charset=UTF-8");\n    resp.getWriter().println("<div class='alert'>" + SecuritySanitizerApp.escapeHtml(msg) + "</div>");\n}`,
        explanation: 'Failing to escape user input allows attackers to execute arbitrary JavaScript in the victim browser.'
      },
      {
        id: 2,
        type: 'Hands-on Implementation',
        title: 'Secure Session Login Guard',
        prompt: 'Write an authentication handler that validates user password and rotates the session ID to prevent Session Fixation.',
        starterCode: `if (isValid(user, pass)) {\n    // Implement session rotation\n}`,
        solution: `if (isValid(user, pass)) {\n    req.changeSessionId(); // Prevents session fixation\n    HttpSession session = req.getSession();\n    session.setAttribute("user", user);\n    resp.sendRedirect(req.getContextPath() + "/dashboard");\n}`,
        explanation: 'req.changeSessionId() creates a new session ID while preserving existing attributes, defeating fixation.'
      },
      {
        id: 3,
        type: 'Real-world Edge Case',
        title: 'Constant-Time Token Comparison',
        prompt: 'Why should developers use MessageDigest.isEqual() instead of String.equals() when comparing CSRF tokens?',
        solution: `// String.equals() fails fast on the first mismatch, allowing attackers to measure\n// nanosecond timing differences to guess token bytes character-by-character.\n// MessageDigest.isEqual() executes in constant time, preventing side-channel timing attacks.`,
        explanation: 'Constant-time verification eliminates timing side-channel vulnerabilities.'
      }
    ],
    officialSources: [
      {
        title: 'OWASP Top 10 Web Application Security Risks',
        url: 'https://owasp.org/www-project-top-ten/',
        organization: 'Eclipse Foundation'
      },
      {
        title: 'Jakarta Servlet Specification 6.0: Chapter 13 Security',
        url: 'https://jakarta.ee/specifications/servlet/6.0/',
        organization: 'Jakarta EE'
      }
    ]
  }
];
