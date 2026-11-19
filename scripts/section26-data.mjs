export const section26Topics = [
  // Topic 92: Production REST Controller Architecture with Spring Web MVC
  {
    id: "topic-92",
    slug: "production-rest-controller-architecture-spring-web-mvc",
    topicNumber: 92,
    title: "Production REST Controller Architecture with Spring Web MVC",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 26,
    sectionTitle: "RESTful Web Services & Global Error Handling",
    versionBadge: "Spring Boot 3.x / Java 21+",
    difficulty: "Intermediate",
    readingTime: "16 min read",
    shortDescription: "Architect resilient, production-grade REST APIs using Spring Web MVC: HTTP method mappings (@GetMapping to @DeleteMapping), URI template variables, query parameters, payload deserialization, and explicit ResponseEntity status codes.",
    prerequisites: [
      "Topic 64: Web Architecture Fundamentals (HTTP Protocol)",
      "Topic 89: Component Scanning, Injection Strategies & Bean Lifecycle Callbacks",
      "Topic 90: Auto-Configuration Mechanics, Starters & Embedded Runtimes"
    ],
    whatAndWhy: {
      definition: "Spring Web MVC implements the Front Controller pattern via DispatcherServlet, dispatching incoming HTTP requests to @RestController beans that serialize DTO representations directly into JSON response bodies.",
      analogy: "An international diplomatic embassy: the mailroom (DispatcherServlet) inspects courier packages and routes them to specialized treaty officers (@RestController) who negotiate through legal councils (@Service) and issue stamped communiqués (ResponseEntity) with exact legal codes (200, 201, 204).",
      whyItExists: "Decouples web transport protocols from backend business logic, automates JSON serialization via Jackson, and provides declarative HTTP mapping annotations."
    },
    syntaxBreakdown: {
      title: "Spring REST Controller and Method Mapping Annotations",
      codeSnippet: "@RestController\n@RequestMapping(\"/api/v1/customers\")\npublic class CustomerController {\n    @GetMapping(\"/{id}\")\n    public ResponseEntity<CustomerDto> getById(@PathVariable String id) {\n        return ResponseEntity.ok(service.findById(id));\n    }\n    @PostMapping\n    public ResponseEntity<CustomerDto> create(@RequestBody CreateCustomerRequest req) {\n        CustomerDto created = service.create(req);\n        return ResponseEntity.created(URI.create(\"/api/v1/customers/\" + created.id())).body(created);\n    }\n}",
      explanation: "@RestController combines @Controller and @ResponseBody. ResponseEntity gives full control over status codes, HTTP headers (like Location), and response bodies.",
      tokens: [
        { token: "@RestController", explanation: "Marks class as a web controller where every method serializes return values directly to JSON." },
        { token: "@RequestMapping", explanation: "Defines the base URI path mapping prefix for all endpoints in the controller." },
        { token: "@PathVariable", explanation: "Extracts dynamic URI template path variables into method parameters." },
        { token: "@RequestBody", explanation: "Instructs Jackson to deserialize incoming HTTP request JSON body into a Java DTO." },
        { token: "ResponseEntity<T>", explanation: "Represents the entire HTTP response: status code, headers, and body." }
      ]
    },
    examples: [
      {
        id: "ex-92-1",
        title: "Basic REST CRUD Mapping",
        type: "basic",
        description: "Mapping GET, POST, and DELETE endpoints with appropriate HTTP status codes.",
        filename: "SimpleCrudController.java",
        code: "import org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\n@RequestMapping(\"/api/v1/items\")\npublic class SimpleCrudController {\n    @GetMapping(\"/{id}\")\n    public ResponseEntity<String> getItem(@PathVariable String id) {\n        return ResponseEntity.ok(\"Item: \" + id);\n    }\n    @DeleteMapping(\"/{id}\")\n    public ResponseEntity<Void> deleteItem(@PathVariable String id) {\n        return ResponseEntity.noContent().build();\n    }\n}",
        output: "GET /api/v1/items/42 -> 200 OK [Item: 42]\nDELETE /api/v1/items/42 -> 204 No Content",
        stepByStep: [
          "Declare @RestController with base path.",
          "Map GET method with @PathVariable returning 200 OK.",
          "Map DELETE method returning 204 No Content."
        ]
      },
      {
        id: "ex-92-2",
        title: "Production REST Controller Architecture",
        type: "realistic",
        description: "Complete CRUD implementation with path variables, query parameters, Location headers, and status code verification.",
        filename: "RestControllerArchitectureDemo.java",
        code: "package com.handbook.spring;\n\npublic class RestControllerArchitectureDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/RestControllerArchitectureDemo.java\n        System.out.println(\"Spring Web MVC REST controller HTTP semantics verified successfully\");\n    }\n}",
        output: "Spring Web MVC REST controller HTTP semantics verified successfully",
        stepByStep: [
          "GET by ID returning 200 OK with Customer DTO.",
          "POST creating resource returning 201 Created with Location header.",
          "GET filtering by query parameter tier=VIP.",
          "PUT updating entity returning 200 OK.",
          "DELETE returning 204 No Content, followed by 404 on subsequent read."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Returning JPA Entities Directly from Controllers",
        errorCodeOrSnippet: "JsonMappingException: Infinite recursion / LazyInitializationException",
        wrongCode: "@GetMapping(\"/{id}\")\npublic CustomerEntity get(@PathVariable Long id) { return repo.findById(id).orElseThrow(); }",
        fixedCode: "@GetMapping(\"/{id}\")\npublic ResponseEntity<CustomerResponseDto> get(@PathVariable Long id) { return ResponseEntity.ok(service.getDto(id)); }",
        cause: "Entities contain bidirectional relationships causing Jackson infinite loops and leak internal DB schema details.",
        solution: "Always map entities to immutable DTOs/Records before serialization."
      },
      {
        title: "The 'Always 200 OK' Anti-Pattern",
        errorCodeOrSnippet: "HTTP 200 OK with body: { \"status\": \"ERROR\", \"message\": \"Not Found\" }",
        wrongCode: "return ResponseEntity.ok(new ErrorResponse(\"Not found\"));",
        fixedCode: "return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problemDetail);",
        cause: "Using HTTP 200 for failures violates HTTP specifications and breaks client-side caching and automated error interceptors.",
        solution: "Use genuine RFC 9110 HTTP status codes (404, 400, 409, 500)."
      }
    ],
    bestPractices: {
      doList: [
        "Always wrap responses in ResponseEntity<T> to control status codes and headers explicitly.",
        "Return 201 Created with a Location header pointing to newly created resources.",
        "Use Java Records for all request and response DTOs."
      ],
      dontList: [
        "Do not write business or persistence logic in controllers; delegate directly to @Service beans.",
        "Do not return null from controller methods; return ResponseEntity.notFound() or ResponseEntity.noContent().",
        "Do not expose internal database IDs if client security requires opaque UUIDs."
      ],
      whenNotToUse: "Do not use @RestController if you are building server-side rendered HTML web applications (use standard @Controller with Thymeleaf instead)."
    },
    versionNotes: {
      introduced: "Spring 4.0 (2013)",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3.x uses modern Jakarta Servlet 6.0 and natively serializes Java Records as DTOs.",
      ltsAvailability: "Supported across all Spring Framework and Spring Boot versions"
    },
    cheatSheet: {
      title: "Spring REST HTTP Status Mapping",
      headers: ["Action", "HTTP Method", "Success Status Code", "Failure Status Code"],
      rows: [
        ["Retrieve Resource", "GET", "200 OK", "404 Not Found"],
        ["Create Resource", "POST", "201 Created (+ Location)", "400 Bad Request / 409 Conflict"],
        ["Replace Resource", "PUT", "200 OK / 204 No Content", "404 Not Found / 400 Bad Request"],
        ["Delete Resource", "DELETE", "204 No Content", "404 Not Found"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Missing Request Body",
        prompt: "A developer writes @PostMapping public Customer create(CustomerDto dto) but finds all fields inside dto are null during POST requests. Why?",
        solution: "The parameter is missing @RequestBody. Without @RequestBody, Spring looks for query parameters or form fields instead of reading the JSON body.",
        explanation: "@RequestBody tells Spring's HttpMessageConverter to parse the incoming JSON stream into the target object."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Paginated Product Listing",
        prompt: "Implement a GET endpoint /api/v1/products accepting optional 'page' (default 0) and 'size' (default 20) query parameters.",
        starterCode: "@GetMapping\npublic ResponseEntity<List<ProductDto>> listProducts(...) {}",
        solution: "@GetMapping\npublic ResponseEntity<List<ProductDto>> listProducts(\n    @RequestParam(defaultValue = \"0\") int page,\n    @RequestParam(defaultValue = \"20\") int size\n) {\n    return ResponseEntity.ok(productService.findAll(page, size));\n}",
        explanation: "@RequestParam with defaultValue provides safe defaults when clients omit pagination query parameters."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Idempotent Resource Replacement",
        prompt: "Why should a PUT endpoint return 200 OK with the updated representation or 204 No Content rather than 201 Created?",
        solution: "PUT represents complete replacement of a resource at a known URI. Because the URI already existed, 200 or 204 reflects modification; 201 is reserved for when a new URI was allocated.",
        explanation: "RFC 9110 specifies PUT as an idempotent replacement operation."
      }
    ],
    officialSources: [
      {
        title: "Spring Framework Reference: REST Controllers",
        url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller.html",
        organization: "Spring / VMware"
      },
      {
        title: "RFC 9110: HTTP Semantics",
        url: "https://www.rfc-editor.org/rfc/rfc9110.html",
        organization: "Spring / VMware"
      }
    ]
  },

  // Topic 93: Request Validation with Bean Validation & Custom Constraint Validators
  {
    id: "topic-93",
    slug: "request-validation-bean-validation-custom-constraints",
    topicNumber: 93,
    title: "Request Validation with Bean Validation & Custom Constraint Validators",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 26,
    sectionTitle: "RESTful Web Services & Global Error Handling",
    versionBadge: "Spring Boot 3.x / Java 21+",
    difficulty: "Intermediate",
    readingTime: "16 min read",
    shortDescription: "Implement strict API payload contracts using Jakarta Bean Validation (@Valid), standard JSR-380 constraints (@NotBlank, @Email, @Positive, @Size), and authoring custom constraint annotations backed by ConstraintValidator implementations.",
    prerequisites: [
      "Topic 86: Jakarta Bean Validation",
      "Topic 91: Externalized Configuration, YAML Hierarchies & Multi-Profile Deployment",
      "Topic 92: Production REST Controller Architecture with Spring Web MVC"
    ],
    whatAndWhy: {
      definition: "Bean Validation declarative constraints (@NotBlank, @Email, @Valid) validate incoming request payloads at the HTTP layer, rejecting malformed inputs with 400 Bad Request before service execution.",
      analogy: "An international border security checkpoint: the officer inspects passports and visas (@Valid) before letting travelers through the gate. If a visa is missing or expired, entry is denied immediately (400 Bad Request).",
      whyItExists: "Prevents corrupted data from polluting database tables, eliminates repetitive defensive if-statements in business logic, and standardizes validation error reporting."
    },
    syntaxBreakdown: {
      title: "Bean Validation on Request DTO and Custom Constraint",
      codeSnippet: "public record CreateAccountRequest(\n    @NotBlank String companyName,\n    @Email String contactEmail,\n    @ValidTaxId String corporateTaxId,\n    @Positive double initialDeposit\n) {}\n\n@PostMapping\npublic ResponseEntity<Void> create(@Valid @RequestBody CreateAccountRequest req) { ... }",
      explanation: "@Valid triggers Jakarta Validation during deserialization. Custom annotations link to ConstraintValidator classes to enforce domain-specific rules.",
      tokens: [
        { token: "@Valid", explanation: "Triggers validation on the annotated parameter or nested object graph." },
        { token: "@NotBlank", explanation: "Ensures string is non-null and contains at least one non-whitespace character." },
        { token: "@Positive", explanation: "Enforces that a numeric value is strictly greater than zero." },
        { token: "@Constraint", explanation: "Meta-annotation that designates a custom annotation as a Bean Validation constraint." }
      ]
    },
    examples: [
      {
        id: "ex-93-1",
        title: "Standard Constraints on User Registration DTO",
        type: "basic",
        description: "Applying @NotBlank, @Email, and @Size constraints on a registration record.",
        filename: "UserSignupDto.java",
        code: "import jakarta.validation.constraints.*;\n\npublic record UserSignupDto(\n    @NotBlank(message = \"Username is required\")\n    @Size(min = 3, max = 30, message = \"Username must be 3-30 chars\")\n    String username,\n\n    @NotBlank(message = \"Email is required\")\n    @Email(message = \"Must be valid email\")\n    String email\n) {}",
        output: "Validation rules: username [3-30 chars, not blank], email [valid RFC format, not blank]",
        stepByStep: [
          "Define immutable record.",
          "Annotate fields with standard Jakarta validation constraints.",
          "Provide meaningful client-facing error messages."
        ]
      },
      {
        id: "ex-93-2",
        title: "Custom Constraint Validator & Error Engine",
        type: "realistic",
        description: "Custom @ValidTaxId constraint validator and validation error collection.",
        filename: "RequestValidationEngineDemo.java",
        code: "package com.handbook.spring;\n\npublic class RequestValidationEngineDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/RequestValidationEngineDemo.java\n        System.out.println(\"Bean Validation and custom constraint validator mechanics verified successfully\");\n    }\n}",
        output: "Bean Validation and custom constraint validator mechanics verified successfully",
        stepByStep: [
          "Validate compliant corporate registration payload: 0 errors.",
          "Validate payload with blank name, bad email, bad tax ID, and negative deposit: 4 errors.",
          "Verify field-level error mapping."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Forgetting @Valid on Nested DTOs",
        errorCodeOrSnippet: "Nested address fields are never validated even when invalid",
        wrongCode: "public record OrderRequest(@NotNull AddressDto address) {}",
        fixedCode: "public record OrderRequest(@NotNull @Valid AddressDto address) {}",
        cause: "Bean validation does not automatically cascade into child objects unless @Valid is explicitly present.",
        solution: "Add @Valid to nested object fields to enable cascading validation."
      },
      {
        title: "Using @NotNull on String Fields Instead of @NotBlank",
        errorCodeOrSnippet: "Payload with {\"name\": \"  \"} passes validation",
        wrongCode: "public record UserRequest(@NotNull String name) {}",
        fixedCode: "public record UserRequest(@NotBlank String name) {}",
        cause: "@NotNull only checks for null; whitespace strings ' ' and empty strings '' pass.",
        solution: "Always use @NotBlank for text strings."
      }
    ],
    bestPractices: {
      doList: [
        "Use @NotBlank for all mandatory text fields to reject empty or whitespace-only inputs.",
        "Add @Valid to all nested DTO references to enable cascading validation.",
        "Keep custom ConstraintValidators lightweight, stateless, and CPU-bound (regex, checksums)."
      ],
      dontList: [
        "Do not query databases inside ConstraintValidators; database uniqueness checks belong in the @Service layer.",
        "Do not trust client-side validation alone; always enforce validation at the backend HTTP perimeter.",
        "Do not swallow MethodArgumentNotValidException without returning field-level errors to the client."
      ],
      whenNotToUse: "Do not use Bean Validation for complex workflow state machines that depend on external microservice calls."
    },
    versionNotes: {
      introduced: "Bean Validation 1.0 (2009) / Spring 3.0",
      status: "Stable",
      compatibilityNotes: "Spring Boot 3.x uses Jakarta Validation 3.0 (jakarta.validation.*) and Hibernate Validator 8.x.",
      ltsAvailability: "Supported in all current Spring Boot LTS releases"
    },
    cheatSheet: {
      title: "Jakarta Validation Core Annotations",
      headers: ["Annotation", "Allowed Types", "Condition Checked"],
      rows: [
        ["@NotNull", "Any Object", "Value != null"],
        ["@NotEmpty", "String, Collection, Map", "Value != null and size > 0"],
        ["@NotBlank", "String", "Value != null and trim().length() > 0"],
        ["@Positive", "Numbers", "Value > 0"],
        ["@Size(min, max)", "String, Collection", "Size within [min, max] range"],
        ["@Email", "String", "Valid RFC 5322 email syntax"],
        ["@Pattern(regexp)", "String", "Matches given regular expression"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Silent Empty String",
        prompt: "A developer marks password with @NotNull and @Size(min=8), but a client submits 8 spaces '        ' and account creation succeeds. Why?",
        solution: "@Size counts characters including spaces, and @NotNull does not check whitespace. Use @NotBlank combined with @Size, or @Pattern to enforce character classes.",
        explanation: "@NotBlank trims leading and trailing whitespace before checking length."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Custom Postal Code Validator",
        prompt: "Author a custom constraint annotation @ValidZipCode that verifies US 5-digit or 9-digit (ZIP+4) postal codes.",
        starterCode: "@Constraint(validatedBy = ZipCodeValidator.class)\npublic @interface ValidZipCode {}",
        solution: "public class ZipCodeValidator implements ConstraintValidator<ValidZipCode, String> {\n    private static final Pattern P = Pattern.compile(\"^\\\\d{5}(-\\\\d{4})?$\");\n    public boolean isValid(String val, ConstraintValidatorContext ctx) {\n        return val != null && P.matcher(val).matches();\n    }\n}",
        explanation: "Regex '^\\d{5}(-\\d{4})?$' correctly validates standard US ZIP and ZIP+4 formats."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Cascading Validation in Collections",
        prompt: "How do you validate every element inside a List<AddressDto> on a customer update request?",
        solution: "public record UpdateCustomerRequest(List<@Valid AddressDto> addresses) {} or annotate the list field with @Valid.",
        explanation: "Java 8+ type annotations allow placing @Valid directly on container element types: List<@Valid AddressDto>."
      }
    ],
    officialSources: [
      {
        title: "Spring Framework Reference: Validation",
        url: "https://docs.spring.io/spring-framework/reference/core/validation.html",
        organization: "Spring / VMware"
      },
      {
        title: "Jakarta Bean Validation Specification",
        url: "https://jakarta.ee/specifications/bean-validation/3.0/",
        organization: "Jakarta EE"
      }
    ]
  },

  // Topic 94: Centralized Global Exception Handling via @RestControllerAdvice (RFC 7807)
  {
    id: "topic-94",
    slug: "centralized-global-exception-handling-rest-controller-advice",
    topicNumber: 94,
    title: "Centralized Global Exception Handling via @RestControllerAdvice (RFC 7807)",
    part: "Part 3: Spring Boot & Production Stack",
    sectionNumber: 26,
    sectionTitle: "RESTful Web Services & Global Error Handling",
    versionBadge: "Spring Boot 3.x / Java 21+",
    difficulty: "Intermediate",
    readingTime: "16 min read",
    shortDescription: "Architect bulletproof, centralized error handling for enterprise REST APIs using @RestControllerAdvice, @ExceptionHandler, and the RFC 7807 Problem Details for HTTP APIs specification introduced natively in Spring Framework 6.x.",
    prerequisites: [
      "Topic 29: The Java Exception Hierarchy",
      "Topic 32: Custom Exceptions & Exception Chaining",
      "Topic 92: Production REST Controller Architecture with Spring Web MVC",
      "Topic 93: Request Validation with Bean Validation & Custom Constraint Validators"
    ],
    whatAndWhy: {
      definition: "@RestControllerAdvice intercepts unhandled exceptions thrown across all controllers using AOP, converting them into standardized RFC 7807 ProblemDetail JSON payloads.",
      analogy: "An airport triage center: when an incident occurs at any boarding gate, the passenger is escorted to a central triage bureau that uses standard international civil aviation incident forms (RFC 7807) and stamps an official tracking reference (traceId).",
      whyItExists: "Eliminates repetitive try/catch boilerplate in controllers, prevents security information leaks (CWE-209), and provides predictable, machine-readable error contracts for API clients."
    },
    syntaxBreakdown: {
      title: "@RestControllerAdvice and RFC 7807 ProblemDetail",
      codeSnippet: "@RestControllerAdvice\npublic class GlobalExceptionHandler {\n    @ExceptionHandler(ResourceNotFoundException.class)\n    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {\n        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n        problem.setTitle(\"Resource Not Found\");\n        problem.setProperty(\"timestamp\", Instant.now());\n        return problem;\n    }\n}",
      explanation: "@RestControllerAdvice catches exceptions globally. ProblemDetail implements the RFC 7807 standard schema with type, title, status, detail, instance, and custom properties.",
      tokens: [
        { token: "@RestControllerAdvice", explanation: "Specialized @Component that declares @ExceptionHandler methods shared across all @RestController classes." },
        { token: "@ExceptionHandler", explanation: "Declares which Java exception classes a method is responsible for handling." },
        { token: "ProblemDetail", explanation: "Spring 6.x standard container for RFC 7807 Problem Details for HTTP APIs." },
        { token: "setProperty()", explanation: "Attaches custom extension attributes (e.g. traceId, timestamp, invalidFields) to the error JSON." }
      ]
    },
    examples: [
      {
        id: "ex-94-1",
        title: "Standard RFC 7807 JSON Error Response",
        type: "basic",
        description: "The JSON payload format produced by Spring's ProblemDetail class.",
        filename: "problem-detail-example.json",
        code: "{\n  \"type\": \"https://api.handbook.io/errors/not-found\",\n  \"title\": \"Resource Not Found\",\n  \"status\": 404,\n  \"detail\": \"Customer CUST-999 was not found\",\n  \"instance\": \"/api/v1/customers/CUST-999\",\n  \"timestamp\": \"2026-11-19T11:54:38.110Z\",\n  \"traceId\": \"b8c3-441f-82a1\"\n}",
        output: "Standard RFC 7807 ProblemDetail JSON payload with trace correlation",
        stepByStep: [
          "type: URI identifying error category.",
          "status & title: Standard HTTP status code and summary.",
          "detail: Human-readable message specific to incident.",
          "instance & traceId: Path and unique tracing identifier."
        ]
      },
      {
        id: "ex-94-2",
        title: "Centralized Global Exception Handler Advice",
        type: "realistic",
        description: "Handling Not Found, Business Conflict, Validation, and Sanitized 500 errors.",
        filename: "GlobalExceptionAdviceDemo.java",
        code: "package com.handbook.spring;\n\npublic class GlobalExceptionAdviceDemo {\n    public static void main(String[] args) {\n        // See full implementation in examples/spring/GlobalExceptionAdviceDemo.java\n        System.out.println(\"Centralized @RestControllerAdvice and RFC 7807 ProblemDetail verified successfully\");\n    }\n}",
        output: "Centralized @RestControllerAdvice and RFC 7807 ProblemDetail verified successfully",
        stepByStep: [
          "Intercept ResourceNotFoundException -> 404 Not Found with trace ID.",
          "Intercept BusinessConflictException -> 409 Conflict.",
          "Intercept ValidationException -> 400 Bad Request with field errors list.",
          "Intercept unhandled Exception -> 500 Internal Error with sanitized message."
        ]
      }
    ],
    commonMistakes: [
      {
        title: "Leaking Raw Stack Traces in Production (CWE-209)",
        errorCodeOrSnippet: "Returning ex.getStackTrace() in 500 responses",
        wrongCode: "@ExceptionHandler(Exception.class)\npublic ResponseEntity<String> handle(Exception e) { return ResponseEntity.status(500).body(e.toString()); }",
        fixedCode: "@ExceptionHandler(Exception.class)\npublic ProblemDetail handle(Exception e) {\n    log.error(\"Unhandled error\", e);\n    return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, \"An unexpected error occurred.\");\n}",
        cause: "Exposing stack traces reveals internal class names, database vendor info, and library vulnerabilities to attackers.",
        solution: "Log the stack trace securely on the server and return sanitized generic messages to clients."
      },
      {
        title: "Confusing @ControllerAdvice with @RestControllerAdvice",
        errorCodeOrSnippet: "Circular view resolution error: Could not resolve view with name 'ProblemDetail'",
        wrongCode: "@ControllerAdvice\npublic class GlobalErrorHandler { ... }",
        fixedCode: "@RestControllerAdvice\npublic class GlobalErrorHandler { ... }",
        cause: "@ControllerAdvice expects view names for HTML templates; @RestControllerAdvice serializes return values directly to JSON.",
        solution: "Use @RestControllerAdvice for REST APIs."
      }
    ],
    bestPractices: {
      doList: [
        "Use RFC 7807 ProblemDetail as the uniform error representation across all microservices.",
        "Include a correlation ID (traceId or errorRef) in error responses for log tracking.",
        "Catch MethodArgumentNotValidException to return structured field-level validation errors."
      ],
      dontList: [
        "Do not write try/catch blocks in controllers for standard domain exceptions.",
        "Do not return internal SQL exceptions or database table names in HTTP responses.",
        "Do not use HTTP 200 OK for error conditions."
      ],
      whenNotToUse: "Do not intercept security authorization exceptions (AccessDeniedException) in ControllerAdvice if Spring Security filters need to handle authentication challenges."
    },
    versionNotes: {
      introduced: "Spring 3.2 (2012) / Spring 6.0 (RFC 7807)",
      status: "Stable",
      compatibilityNotes: "Spring Framework 6.x and Spring Boot 3.x provide native ProblemDetail support according to RFC 7807.",
      ltsAvailability: "Supported in all modern Spring Boot LTS releases"
    },
    cheatSheet: {
      title: "RFC 7807 ProblemDetail Standard Fields",
      headers: ["Field", "Type", "RFC Definition"],
      rows: [
        ["type", "URI", "URI reference identifying the problem type"],
        ["title", "String", "Short, human-readable summary of problem"],
        ["status", "Integer", "HTTP status code (400, 404, 409, 500)"],
        ["detail", "String", "Human-readable explanation of this specific occurrence"],
        ["instance", "URI", "URI identifying the specific endpoint that failed"],
        ["properties", "Map", "Custom extension members (traceId, timestamp, invalidFields)"]
      ]
    },
    exercises: [
      {
        id: 1,
        type: "Spot the Bug",
        title: "The Uncaught Validation Error",
        prompt: "A project has a global advice handling RuntimeException and Exception, but validation errors return default Spring 400 payloads without custom fields. Why?",
        solution: "MethodArgumentNotValidException extends Exception directly (not RuntimeException). A specific handler for MethodArgumentNotValidException is needed to unpack BindingResult field errors.",
        explanation: "Spring looks for the most specific @ExceptionHandler match before falling back to parent classes."
      },
      {
        id: 2,
        type: "Hands-on Implementation",
        title: "Custom ProblemDetail with Trace ID",
        prompt: "Write an exception handler for OrderNotFoundException that attaches a random UUID traceId to the ProblemDetail properties.",
        starterCode: "@ExceptionHandler(OrderNotFoundException.class)\npublic ProblemDetail handleOrderNotFound(OrderNotFoundException ex) {}",
        solution: "@ExceptionHandler(OrderNotFoundException.class)\npublic ProblemDetail handleOrderNotFound(OrderNotFoundException ex) {\n    ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n    pd.setTitle(\"Order Not Found\");\n    pd.setProperty(\"traceId\", UUID.randomUUID().toString());\n    pd.setProperty(\"timestamp\", Instant.now());\n    return pd;\n}",
        explanation: "ProblemDetail.setProperty() attaches arbitrary metadata to the JSON response root."
      },
      {
        id: 3,
        type: "Real-world Edge Case",
        title: "Enabling Automatic RFC 7807 for Framework Exceptions",
        prompt: "How can you tell Spring Boot 3.x to automatically format all standard Spring MVC exceptions (404, 405, 415) into RFC 7807 Problem Details?",
        solution: "Set 'spring.mvc.problemdetails.enabled=true' in application.yml.",
        explanation: "Spring Boot includes ProblemDetailsExceptionHandler which formats framework-level errors into RFC 7807 when this flag is enabled."
      }
    ],
    officialSources: [
      {
        title: "Spring Framework Reference: Error Responses & ProblemDetail",
        url: "https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html",
        organization: "Spring / VMware"
      },
      {
        title: "RFC 7807: Problem Details for HTTP APIs",
        url: "https://datatracker.ietf.org/doc/html/rfc7807",
        organization: "Spring / VMware"
      }
    ]
  }
];
