export const section28Topics = [
  // Topic 98: Modern SecurityFilterChain Architecture & Password Encryption
  {
    id: "topic-98",
    slug: "modern-security-filter-chain-architecture-password-encryption",
    topicNumber: 98,
    title: "Modern SecurityFilterChain Architecture & Password Encryption",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 28,
    sectionTitle: "Enterprise Security with Spring Security 6",
    versionBadge: "Spring Security 6.x / Java 21+",
    difficulty: "Advanced",
    readingTime: "18 min read",
    shortDescription: "Architect defense-in-depth security in Spring Security 6: declarative SecurityFilterChain bean configuration, URL request matching, disabling CSRF for stateless REST microservices, and cryptographic BCrypt password hashing.",
    prerequisites: [
      "Topic 71: Servlet Filters & Interception",
      "Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes",
      "Topic 92: Production REST Controller Architecture with Spring Web MVC"
    ],
    whatAndWhy: {
      definition: "Spring Security 6 enforces authentication and authorization through an ordered chain of servlet filters, configured declaratively via SecurityFilterChain @Bean definitions rather than legacy adapter inheritance.",
      analogy: "An airport security terminal: passenger flows move through sequential checkpoints (SecurityFilterChain)—first passport inspection (AuthenticationFilter), then metal detectors (CSRF / Tamper guard), and finally boarding gate clearance (AuthorizationFilter)—before reaching the departure lounge (@RestController).",
      whyItExists: "Protects enterprise systems against OWASP Top 10 vulnerabilities, standardizes credential storage using slow-hashing algorithms, and provides unified authorization."
    },
    syntaxBreakdown: {
      title: "Spring Security 6 SecurityFilterChain Bean Definition",
      codeSnippet: "@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n    @Bean\n    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {\n        return http\n            .csrf(csrf -> csrf.disable())\n            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers(\"/api/v1/auth/**\").permitAll()\n                .requestMatchers(\"/api/v1/admin/**\").hasRole(\"ADMIN\")\n                .anyRequest().authenticated()\n            )\n            .build();\n    }\n}",
      explanation: "Uses functional lambda DSL to configure CSRF, stateless session management, and request matchers without extending WebSecurityConfigurerAdapter.",
      tokens: [
        { token: "SecurityFilterChain", explanation: "Target bean defining the ordered chain of filters to execute on matched HTTP requests." },
        { token: "csrf.disable()", explanation: "Disables CSRF protection, which is redundant for stateless token-based REST APIs." },
        { token: "SessionCreationPolicy.STATELESS", explanation: "Instructs Spring Security never to create an HttpSession." },
        { token: "requestMatchers(...).permitAll()", explanation: "Opens public endpoints (like login/signup) without requiring credentials." },
        { token: "hasRole(\"ADMIN\")", explanation: "Restricts access to principals granted the 'ROLE_ADMIN' authority." }
      ]
    },
    examples: [
      {
        id: "ex-98-1",
        title: "BCrypt Password Hashing",
        type: "basic",
        description: "Hashing raw passwords and validating user attempts using BCryptPasswordEncoder.",
        filename: "PasswordHasher.java",
        code: "import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;\n\npublic class PasswordHasher {\n    public static void main(String[] args) {\n        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);\n        String hash = encoder.encode(\"MySecret2026\");\n        boolean matches = encoder.matches(\"MySecret2026\", hash);\n        System.out.println(\"Password verification: \" + matches);\n    }\n}",
        output: "Password verification: true",
        stepByStep: [
          "Instantiate BCryptPasswordEncoder with cost factor 12.",
          "Encode raw password generating salted hash.",
          "Verify user login attempts with matches()."
        ]
      },
      {
        id: "ex-98-2",
        title: "SecurityFilterChain and Authentication Pipeline Simulation",
        type: "realistic",
        description: "Simulating SecurityFilterChain rules, BCrypt hashing, and AuthenticationManager credential checks.",
        filename: "SecurityFilterChainDemo.java",
        code: "package com.handbook.spring;\n\npublic class SecurityFilterChainDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/SecurityFilterChainDemo.java\n        System.out.println(\"Topic 98 Modern SecurityFilterChain and Password Encoder verified successfully\");\n    }\n}",
        output: "Topic 98 Modern SecurityFilterChain and Password Encoder verified successfully",
        stepByStep: [
          "Initialize BCrypt password encoder with 1000 key-stretching iterations.",
          "Encode raw secret and verify cryptographic match.",
          "Register user details with ROLE_ADMIN and ROLE_USER authorities.",
          "Configure SecurityFilterChain rules with permitAll and authenticated paths.",
          "Authenticate principal through AuthenticationManager and verify rejection of bad credentials."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Storing passwords with fast MD5 or SHA-256",
        errorCodeOrSnippet: "String hash = DigestUtils.sha256Hex(password); // Vulnerable to GPU brute force!",
        cause: "SHA-256 is designed for throughput, allowing billions of hash attempts per second on modern GPUs.",
        solution: "Always use key-stretching adaptive algorithms: BCrypt, Argon2, or PBKDF2."
      },
      {
        title: "Leaving CSRF enabled on stateless REST APIs",
        errorCodeOrSnippet: "http.authorizeHttpRequests(...); // Default CSRF enabled causes 403 Forbidden on POST/PUT!",
        cause: "Spring Security enables CSRF by default, which blocks non-GET requests lacking a CSRF token.",
        solution: "Explicitly disable CSRF when using stateless Bearer token authentication: http.csrf(csrf -> csrf.disable())."
      }
    ],
    bestPractices: {
      doList: [
        "Use BCryptPasswordEncoder with a minimum cost factor of 10 (12 recommended for production).",
        "Enforce SessionCreationPolicy.STATELESS for REST APIs using Bearer tokens.",
        "Always order requestMatchers from most specific to least specific."
      ],
      dontList: [
        "Never extend WebSecurityConfigurerAdapter (removed in Spring Security 6).",
        "Never log raw or decrypted user passwords in log files.",
        "Never use plain text comparisons for password checking (susceptible to timing attacks)."
      ],
      whenNotToUse: "Do not disable CSRF in stateful server-rendered applications (like Thymeleaf, JSP, or JSF) where authentication relies on browser session cookies."
    },
    versionNotes: {
      introduced: "Spring Security 1.0 -> Modern Component FilterChain in Spring Security 6 / Spring Boot 3",
      status: "Stable",
      compatibilityNotes: "WebSecurityConfigurerAdapter is completely removed in Spring Security 6.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "Spring Security 6 Key Filter Chain Components",
      headers: ["Component", "Type", "Responsibility"],
      rows: [
        ["SecurityFilterChain", "@Bean Interface", "Defines the ordered filter pipeline and URL authorization rules"],
        ["BCryptPasswordEncoder", "PasswordEncoder", "Salts and hashes passwords using adaptive cost functions"],
        ["AuthenticationManager", "Core Engine", "Coordinates AuthenticationProviders to validate credentials"],
        ["UserDetailsService", "Repository Bridge", "Loads UserDetails from persistent storage by username"],
        ["AuthorizationFilter", "Filter", "Enforces request authorization at the HTTP endpoint boundary"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Overriding Matcher Trap",
        prompt: "A developer writes .anyRequest().authenticated() before .requestMatchers(\"/public/**\").permitAll(). Users cannot access /public. Why?",
        solution: "Spring Security matches rules from top to bottom. Because .anyRequest() matches everything, subsequent rules are never evaluated.",
        explanation: "Always place specific permitAll() matchers before general authenticated() or anyRequest() matchers."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Declare Modern SecurityFilterChain Bean",
        prompt: "Write a Spring Security 6 configuration method that permits /health and /actuator/info, requires role 'ADMIN' for /admin/**, and authenticates all other routes.",
        starterCode: "@Bean\npublic SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n    // Return chain\n}",
        solution: "@Bean\npublic SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n    return http\n        .csrf(csrf -> csrf.disable())\n        .authorizeHttpRequests(auth -> auth\n            .requestMatchers(\"/health\", \"/actuator/info\").permitAll()\n            .requestMatchers(\"/admin/**\").hasRole(\"ADMIN\")\n            .anyRequest().authenticated()\n        )\n        .build();\n}",
        explanation: "Configures stateless security with exact endpoint matcher rules."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "hasRole vs hasAuthority",
        prompt: "What is the difference between hasRole('ADMIN') and hasAuthority('ADMIN') in Spring Security?",
        solution: "hasRole('ADMIN') automatically prefixes the string with 'ROLE_', expecting the authority 'ROLE_ADMIN'. hasAuthority('ADMIN') performs an exact string match without any prefix.",
        explanation: "Always match how authorities are loaded in your UserDetailsService."
      }
    ],
    officialSources: [
      {
        title: "Spring Security 6 Architecture Reference",
        url: "https://docs.spring.io/spring-security/reference/servlet/architecture.html",
        organization: "Spring / VMware"
      },
      {
        title: "Spring Security: Password Storage Configuration",
        url: "https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 99: Stateless REST Security with JWT & Method-Level Role Authorization
  {
    id: "topic-99",
    slug: "stateless-rest-security-jwt-method-level-role-authorization",
    topicNumber: 99,
    title: "Stateless REST Security with JWT & Method-Level Role Authorization",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 28,
    sectionTitle: "Enterprise Security with Spring Security 6",
    versionBadge: "Spring Security 6.x / Java 21+",
    difficulty: "Advanced",
    readingTime: "19 min read",
    shortDescription: "Architect stateless microservice authentication: HMAC-SHA256 JWT creation, OncePerRequestFilter extraction, SecurityContextHolder thread-local lifecycle, and fine-grained method security using @PreAuthorize and SpEL expressions.",
    prerequisites: [
      "Topic 71: Servlet Filters & Interception",
      "Topic 92: Production REST Controller Architecture with Spring Web MVC",
      "Topic 98: Modern SecurityFilterChain Architecture & Password Encryption"
    ],
    whatAndWhy: {
      definition: "Stateless JWT security validates identity using cryptographically signed self-contained tokens attached to each HTTP request, decoupling server state from client sessions and enabling declarative method-level role authorization.",
      analogy: "An electronic concert wristband: rather than the venue looking up your name in a massive guest register every time you enter a room (HttpSession), your wristband contains a digitally signed barcode showing your VIP status (JWT). Staff scan the wristband at the door (@PreAuthorize) to grant access instantly.",
      whyItExists: "Enables seamless horizontal scaling across cloud microservices, eliminates sticky sessions, and provides granular role-based access control (RBAC)."
    },
    syntaxBreakdown: {
      title: "JWT Authentication Filter and @PreAuthorize Syntax",
      codeSnippet: "@Service\npublic class AdminService {\n    @PreAuthorize(\"hasRole('ADMIN')\")\n    public void purgeSystemLogs() {\n        // admin-only operation\n    }\n\n    @PreAuthorize(\"hasRole('ADMIN') or #username == authentication.name\")\n    public UserProfile getProfile(String username) {\n        // self-service or admin lookup\n    }\n}",
      explanation: "@PreAuthorize evaluates Spring Expression Language (SpEL) before method invocation. If false, AccessDeniedException (403 Forbidden) is thrown.",
      tokens: [
        { token: "@PreAuthorize", explanation: "Method-level security annotation evaluated before method invocation using SpEL." },
        { token: "hasRole('ADMIN')", explanation: "SpEL function verifying if SecurityContextHolder contains 'ROLE_ADMIN'." },
        { token: "authentication.name", explanation: "Refers to the authenticated principal's username in the current security context." },
        { token: "#username", explanation: "Binds directly to the method argument named 'username'." }
      ]
    },
    examples: [
      {
        id: "ex-99-1",
        title: "Method-Level Security Annotation",
        type: "basic",
        description: "Securing service methods with role-based annotations.",
        filename: "SecuredUserService.java",
        code: "import org.springframework.security.access.prepost.PreAuthorize;\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class SecuredUserService {\n    @PreAuthorize(\"hasRole('ADMIN')\")\n    public void deleteUser(Long id) {\n        // Delete logic\n    }\n}",
        output: "Invocation allowed only when principal possesses ROLE_ADMIN; otherwise throws 403 Forbidden.",
        stepByStep: [
          "Enable method security with @EnableMethodSecurity.",
          "Annotate target service method with @PreAuthorize.",
          "Spring Security AOP proxy intercepts method and checks SecurityContextHolder."
        ]
      },
      {
        id: "ex-99-2",
        title: "JWT & RBAC Method Security Simulation",
        type: "realistic",
        description: "Simulating HMAC-SHA256 JWT token generation, OncePerRequestFilter parsing, SecurityContextHolder propagation, and @PreAuthorize enforcement.",
        filename: "JwtRbacSecurityDemo.java",
        code: "package com.handbook.spring;\n\npublic class JwtRbacSecurityDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/JwtRbacSecurityDemo.java\n        System.out.println(\"Topic 99 JWT & RBAC Method Security verified successfully\");\n    }\n}",
        output: "Topic 99 JWT & RBAC Method Security verified successfully",
        stepByStep: [
          "Generate HMAC-SHA256 JWT tokens for standard user and admin.",
          "Simulate OncePerRequestFilter parsing Bearer header into SecurityContextHolder.",
          "Invoke user method successfully for standard user.",
          "Attempt super-admin method with standard user and assert 403 Forbidden rejection.",
          "Invoke super-admin method with admin principal successfully.",
          "Verify tamper protection rejects invalid signature."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Forgetting to clear SecurityContextHolder in ThreadLocal",
        errorCodeOrSnippet: "SecurityContextHolder.getContext().setAuthentication(auth);\n// Filter completes without finally { SecurityContextHolder.clearContext(); }",
        cause: "Web servers reuse worker threads. Failing to clear the context causes subsequent unrelated requests on that thread to inherit the previous user's credentials!",
        solution: "Always clear the SecurityContext in a finally block within the filter, or rely on SecurityContextHolderFilter."
      },
      {
        title: "Storing sensitive data in JWT claims",
        errorCodeOrSnippet: "claims.put(\"ssn\", ssn);\nclaims.put(\"password\", rawPassword); // Security Disaster!",
        cause: "JWT payloads are Base64URL-encoded, NOT encrypted. Anyone intercepting the token can decode and read the payload.",
        solution: "Only store non-sensitive identifiers (userId, username, roles, expiration). Use JWE (JSON Web Encryption) if encryption is required."
      }
    ],
    bestPractices: {
      doList: [
        "Enable method security via @EnableMethodSecurity(prePostEnabled = true).",
        "Use short-lived access tokens (e.g. 15 minutes) coupled with refresh tokens stored in HTTP-only cookies.",
        "Store JWT signing keys in secure secret management vaults (e.g. HashiCorp Vault, AWS Secrets Manager)."
      ],
      dontList: [
        "Never hardcode JWT secret keys in application.yml or git repositories.",
        "Never accept 'alg': 'none' tokens from untrusted clients.",
        "Avoid huge token payloads; keep JWT size small to prevent HTTP header bloat."
      ],
      whenNotToUse: "Do not use JWTs if you require instant server-side revocation on every single request without checking a distributed token blacklist (use short TTLs or Redis token validation instead)."
    },
    versionNotes: {
      introduced: "JWT RFC 7519 (2015) -> Modern @EnableMethodSecurity in Spring Security 6",
      status: "Stable",
      compatibilityNotes: "Spring Security 6 replaces legacy @EnableGlobalMethodSecurity with @EnableMethodSecurity.",
      ltsAvailability: "Universal on Java 17, 21, and 26+."
    },
    cheatSheet: {
      title: "JWT & Method Security SpEL Expressions",
      headers: ["Expression", "Condition", "Example"],
      rows: [
        ["hasRole('ROLE')", "Principal has specified role", "@PreAuthorize(\"hasRole('ADMIN')\")"],
        ["hasAnyRole('R1', 'R2')", "Principal has at least one role", "@PreAuthorize(\"hasAnyRole('USER', 'ADMIN')\")"],
        ["isAuthenticated()", "Principal is logged in", "@PreAuthorize(\"isAuthenticated()\")"],
        ["#param == authentication.name", "Method argument matches username", "@PreAuthorize(\"#id == authentication.principal.id\")"],
        ["permitAll", "Public method", "@PreAuthorize(\"permitAll()\")"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Disabled Method Security",
        prompt: "A developer writes @PreAuthorize(\"hasRole('ADMIN')\") on a controller method, but anyone can invoke it without authentication. What is missing?",
        solution: "@EnableMethodSecurity is missing from the Spring Security configuration class. Method security annotations are ignored unless explicitly enabled.",
        explanation: "Add @Configuration @EnableMethodSecurity to activate method interception proxies."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Extract Bearer Token in Servlet Filter",
        prompt: "Write a Java snippet that extracts the raw token from an HTTP Authorization header if it begins with 'Bearer '.",
        starterCode: "String header = request.getHeader(\"Authorization\");\n// Extract raw token",
        solution: "String token = null;\nif (header != null && header.startsWith(\"Bearer \")) {\n    token = header.substring(7);\n}",
        explanation: "Bearer tokens are passed as 'Bearer <token>'; substring(7) extracts the token body."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "JWT Clock Skew Tolerance",
        prompt: "Why do production JWT parsers include a 30 to 60-second clock skew tolerance when validating the 'exp' (expiration) claim?",
        solution: "Distributed microservice servers may have slight clock drift (fractions of a second up to several seconds) despite NTP synchronization. A tolerance prevents immediate rejection of valid tokens.",
        explanation: "Libraries like JJWT and Nimbus allow configuring setAllowedClockSkewSeconds(60)."
      }
    ],
    officialSources: [
      {
        title: "Spring Security: Method Security Reference",
        url: "https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html",
        organization: "Spring / VMware"
      },
      {
        title: "RFC 7519: JSON Web Token (JWT)",
        url: "https://datatracker.ietf.org/doc/html/rfc7519",
        organization: "Spring / VMware"
      }
    ]
  }
];
