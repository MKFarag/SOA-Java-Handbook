import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

function enrichFile(filePath, checkKeyword, updateFn) {
  const fullPath = path.resolve(ROOT_DIR, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes(checkKeyword)) {
    console.log(`[ALREADY ENRICHED] ${filePath}`);
    return;
  }
  const updated = updateFn(content);
  fs.writeFileSync(fullPath, updated, 'utf8');
  console.log(`[ENRICHED] ${filePath}`);
}

// =============================================================================
// 1. TOPIC 85: Jakarta Bean Validation (content/part2-jakarta/85-jakarta-bean-validation.md)
// =============================================================================
enrichFile(
  'content/part2-jakarta/85-jakarta-bean-validation.md',
  '## Master Jakarta Bean Validation & Hibernate Validator Constraints Directory',
  (content) => {
    const targetHeader = '## Standard Constraint Annotations Reference';
    const newSection = `## Master Jakarta Bean Validation & Hibernate Validator Constraints Directory

Jakarta Bean Validation (JSR-380 / Jakarta Validation 3.0) and its reference implementation **Hibernate Validator 8.0** provide an extensive ecosystem of declarative constraints. The following categorized matrices provide an exhaustive reference of standard constraints, their applicable targets, configurable attributes, and real-world usage patterns.

### 1. Nullability, String Content & Format Constraints

| Annotation | Applicable Types | Key Attributes | Validation Semantic | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@NotNull\`** | Any Object | \`message\`, \`groups\` | Value must not be \`null\`. Empty strings or empty collections **pass**. | \`@NotNull(message = "ID is mandatory") Long id;\` |
| **\`@Null\`** | Any Object | \`message\`, \`groups\` | Value must be strictly \`null\` (useful for read-only / server-assigned fields on creation). | \`@Null(groups = OnCreate.class) Long id;\` |
| **\`@NotEmpty\`** | \`CharSequence\`, \`Collection\`, \`Map\`, Arrays | \`message\`, \`groups\` | Value must not be \`null\` and \`size() > 0\` or \`length > 0\`. Whitespace-only strings **pass**. | \`@NotEmpty List<String> tags;\` |
| **\`@NotBlank\`** | \`CharSequence\` (\`String\`) | \`message\`, \`groups\` | Value must not be \`null\` and must contain at least one non-whitespace character after trimming. | \`@NotBlank(message = "Username required") String username;\` |
| **\`@Size\`** | \`CharSequence\`, \`Collection\`, \`Map\`, Arrays | \`min = 0\`, \`max = Integer.MAX_VALUE\` | Element count or string character length must be within inclusive bounds. | \`@Size(min = 8, max = 64) String password;\` |
| **\`@Length\`** *(Hibernate)* | \`CharSequence\` | \`min = 0\`, \`max = Integer.MAX_VALUE\` | Specific string length validation (Hibernate Validator extension). | \`@Length(min = 5, max = 50) String skuCode;\` |
| **\`@Email\`** | \`CharSequence\` | \`regexp\`, \`flags\` | String must conform to valid RFC 5322 email syntax specifications. | \`@Email(message = "Malformed email") String email;\` |
| **\`@Pattern\`** | \`CharSequence\` | \`regexp\` (required), \`flags\` | String must match the specified Java regular expression pattern. | \`@Pattern(regexp = "^[A-Z]{3}-\\\\d{4}$") String licensePlate;\` |
| **\`@URL\`** *(Hibernate)* | \`CharSequence\` | \`protocol\`, \`host\`, \`port\` | Validates that the string conforms to valid URL syntax. | \`@URL(protocol = "https") String webhookUrl;\` |
| **\`@UUID\`** *(Hibernate)* | \`CharSequence\` | \`version\`, \`letterCase\` | Verifies string is a formatted UUID (RFC 4122). | \`@UUID(version = 4) String correlationId;\` |

### 2. Numeric Boundaries, Ranges & Precision Constraints

| Annotation | Applicable Types | Key Attributes | Validation Semantic | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@Min\`** | \`BigDecimal\`, \`BigInteger\`, \`byte\`, \`short\`, \`int\`, \`long\` | \`value\` (long, required) | Numerical value must be greater than or equal to the specified minimum. | \`@Min(value = 18, message = "Must be 18+") int age;\` |
| **\`@Max\`** | Integral numeric types | \`value\` (long, required) | Numerical value must be less than or equal to the specified maximum. | \`@Max(value = 100) int percentage;\` |
| **\`@DecimalMin\`** | \`BigDecimal\`, \`BigInteger\`, \`CharSequence\`, numeric | \`value\` (String), \`inclusive = true\` | Numerical value must be >= (or > if inclusive=false) specified decimal string value. | \`@DecimalMin(value = "0.01", inclusive = true) BigDecimal price;\` |
| **\`@DecimalMax\`** | \`BigDecimal\`, \`BigInteger\`, \`CharSequence\`, numeric | \`value\` (String), \`inclusive = true\` | Numerical value must be <= (or < if inclusive=false) specified decimal string value. | \`@DecimalMax(value = "9999.99") BigDecimal discount;\` |
| **\`@Positive\`** | Numeric primitives & wrappers, \`BigDecimal\` | \`message\`, \`groups\` | Numerical value must be strictly greater than zero (\`> 0\`). | \`@Positive BigDecimal accountBalance;\` |
| **\`@PositiveOrZero\`** | Numeric primitives & wrappers, \`BigDecimal\` | \`message\`, \`groups\` | Numerical value must be greater than or equal to zero (\`>= 0\`). | \`@PositiveOrZero int failedAttempts;\` |
| **\`@Negative\`** | Numeric primitives & wrappers, \`BigDecimal\` | \`message\`, \`groups\` | Numerical value must be strictly less than zero (\`< 0\`). | \`@Negative double debtOffset;\` |
| **\`@NegativeOrZero\`** | Numeric primitives & wrappers, \`BigDecimal\` | \`message\`, \`groups\` | Numerical value must be less than or equal to zero (\`<= 0\`). | \`@NegativeOrZero double refundAdjustment;\` |
| **\`@Digits\`** | Numeric primitives & wrappers, \`BigDecimal\` | \`integer\` (int), \`fraction\` (int) | Enforces maximum number of integral and decimal fractional digits. | \`@Digits(integer = 8, fraction = 2) BigDecimal amount;\` |
| **\`@Range\`** *(Hibernate)* | Numeric primitives, wrappers, \`String\` | \`min = 0\`, \`max = Long.MAX_VALUE\` | Verifies value falls within inclusive min/max numerical range. | \`@Range(min = 1, max = 5) int ratingScore;\` |

### 3. Date, Time & Temporal Constraints

| Annotation | Applicable Types | Key Attributes | Validation Semantic | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@Past\`** | \`LocalDate\`, \`Instant\`, \`ZonedDateTime\`, \`Date\` | \`message\`, \`groups\` | Date/time must be strictly before the current virtual clock instant. | \`@Past(message = "Birth date must be past") LocalDate birthDate;\` |
| **\`@PastOrPresent\`** | Temporal types | \`message\`, \`groups\` | Date/time must be in the past or equal to the present instant. | \`@PastOrPresent Instant loginTimestamp;\` |
| **\`@Future\`** | Temporal types | \`message\`, \`groups\` | Date/time must be strictly after the current virtual clock instant. | \`@Future(message = "Card expired") YearMonth cardExpiry;\` |
| **\`@FutureOrPresent\`** | Temporal types | \`message\`, \`groups\` | Date/time must be in the future or equal to the present instant. | \`@FutureOrPresent LocalDate subscriptionEnd;\` |

### 4. Boolean & Financial Verification Constraints

| Annotation | Applicable Types | Key Attributes | Validation Semantic | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@AssertTrue\`** | \`Boolean\`, \`boolean\` | \`message\`, \`groups\` | Field or getter return must evaluate strictly to \`true\`. | \`@AssertTrue(message = "Must accept terms") boolean termsAccepted;\` |
| **\`@AssertFalse\`** | \`Boolean\`, \`boolean\` | \`message\`, \`groups\` | Field or getter return must evaluate strictly to \`false\`. | \`@AssertFalse boolean isBlacklisted;\` |
| **\`@CreditCardNumber\`** *(Hibernate)* | \`CharSequence\` | \`ignoreNonDigitCharacters = false\` | Validates card numbers against the Luhn algorithm checksum. | \`@CreditCardNumber String rawCardNumber;\` |
| **\`@LuhnCheck\`** *(Hibernate)* | \`CharSequence\` | \`startIndex\`, \`endIndex\` | Generic Luhn algorithm check on arbitrary numerical IDs. | \`@LuhnCheck String nationalInsuranceId;\` |

### 5. Cascading, Container Elements & Validation Groups

| Annotation | Applicable Target | Purpose & Behavioral Mechanics | Production Example |
| :--- | :--- | :--- | :--- |
| **\`@Valid\`** | Field, Parameter, Getter, Type Argument | **Recursive validation cascade**. Instructs the validation engine to traverse inside child objects, collections, and records. Without \`@Valid\`, constraints inside nested objects are completely ignored! | \`@Valid @NotNull Address billingAddress;\` |
| **\`@Validated\`** *(Spring)* | Class, Method | Spring MVC/Service boundary trigger enabling method-level validation and declaring active **validation groups**. | \`@Validated(OnCreate.class) public class CustomerService\` |
| **\`@GroupSequence\`** | Class (Interface) | Defines explicit execution ordering of validation groups, aborting immediately upon first failure. | \`@GroupSequence({BasicChecks.class, HeavyChecks.class}) public interface CompleteValidation\` |
| **\`@ConvertGroup\`** | Field, Parameter | Converts active group from one type to another when cascading into a nested object. | \`@ConvertGroup(from = Default.class, to = StrictGroup.class) @Valid Address address;\``;

    const regex = /## Standard Constraint Annotations Reference[\s\S]*?(?=## Production Implementation)/;
    if (!regex.test(content)) {
      throw new Error('Target section not found in topic-85');
    }
    return content.replace(regex, newSection + '\n\n---\n\n');
  }
);

// =============================================================================
// 2. TOPIC 94: Spring Data JPA Architecture (content/part3-spring/94-spring-data-jpa-architecture-repository-hierarchy-jparepository.md)
// =============================================================================
enrichFile(
  'content/part3-spring/94-spring-data-jpa-architecture-repository-hierarchy-jparepository.md',
  '## Master Spring Data JPA Annotations Reference Directory',
  (content) => {
    const insertTarget = '## Architecture & Core Mechanics';
    const newSection = `## Master Spring Data JPA Annotations Reference Directory

Spring Data JPA relies on a specialized set of annotations to configure repository scanning, orchestrate entity auditing, optimize query execution plans, and enforce transaction locks.

| Annotation | Target Element | Key Attributes | Architectural Purpose & Operational Mechanics | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@Repository\`** | \`TYPE\` (Interface/Class) | \`value\` (Bean name) | Optional on Spring Data interfaces. Automatically registers bean and activates **PersistenceExceptionTranslationPostProcessor** to translate low-level Hibernate exceptions into Spring's unified \`DataAccessException\` hierarchy. | \`@Repository public interface UserRepository extends JpaRepository<User, Long> {}\` |
| **\`@EnableJpaRepositories\`** | \`TYPE\` (Configuration) | \`basePackages\`, \`repositoryFactoryBeanClass\` | Activates Spring Data JPA repository scanning and runtime dynamic proxy generation across specified base packages. | \`@Configuration @EnableJpaRepositories(basePackages = "com.enterprise.repo") public class JpaConfig {}\` |
| **\`@NoRepositoryBean\`** | \`TYPE\` (Interface) | None | Excludes intermediate custom base repository interfaces from direct runtime proxy instantiation by Spring Data scanners. | \`@NoRepositoryBean public interface BaseRepository<T, ID> extends JpaRepository<T, ID> {}\` |
| **\`@EntityScan\`** | \`TYPE\` (Configuration) | \`basePackages\`, \`basePackageClasses\` | Configures scanning packages for JPA \`@Entity\` classes when they reside outside the root Spring Boot application package. | \`@EntityScan("com.enterprise.domain")\` |
| **\`@EnableJpaAuditing\`** | \`TYPE\` (Configuration) | \`auditorAwareRef\`, \`dateTimeProviderRef\` | Activates automated entity auditing lifecycle listeners (\`AuditingEntityListener\`) for timestamps and user tracking. | \`@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditor")\` |
| **\`@CreatedDate\`** | \`FIELD\`, \`METHOD\` | None | Automatically captures and persists creation timestamp using system clock or \`DateTimeProvider\`. | \`@CreatedDate @Column(nullable = false, updatable = false) private Instant createdAt;\` |
| **\`@LastModifiedDate\`** | \`FIELD\`, \`METHOD\` | None | Automatically updates timestamp whenever the entity changes and is flushed to the database. | \`@LastModifiedDate private Instant updatedAt;\` |
| **\`@CreatedBy\`** | \`FIELD\`, \`METHOD\` | None | Injects user identity returned by registered \`AuditorAware<T>\` bean upon entity insert. | \`@CreatedBy @Column(updatable = false) private String createdBy;\` |
| **\`@LastModifiedBy\`** | \`FIELD\`, \`METHOD\` | None | Injects user identity returned by registered \`AuditorAware<T>\` bean upon entity update. | \`@LastModifiedBy private String updatedBy;\` |
| **\`@Query\`** | \`METHOD\` | \`value\`, \`nativeQuery = false\`, \`countQuery\` | Binds custom JPQL or native SQL expressions directly to repository methods, bypassing automatic derivation rules. | \`@Query("SELECT u FROM User u WHERE u.active = true") List<User> findAllActive();\` |
| **\`@Modifying\`** | \`METHOD\` | \`clearAutomatically = false\`, \`flushAutomatically = false\` | Marks \`@Query\` as a DML statement (\`UPDATE\` / \`DELETE\`). When \`clearAutomatically = true\`, clears persistence context to avoid stale cache. | \`@Modifying(clearAutomatically = true) @Query("UPDATE User u SET u.active = false") int deactivateAll();\` |
| **\`@Param\`** | \`PARAMETER\` | \`value\` (String, required) | Binds method parameter explicitly to named JPQL/SQL query parameters (\`:paramName\`). | \`@Query("SELECT u FROM User u WHERE u.dept = :d") List<User> findByDept(@Param("d") String dept);\` |
| **\`@EntityGraph\`** | \`METHOD\` | \`value\`, \`attributePaths\`, \`type = EntityGraphType.FETCH\` | Solves the **N+1 Select Problem** by generating SQL \`LEFT JOIN\` to eagerly fetch declared relationships in a single query. | \`@EntityGraph(attributePaths = {"orders", "orders.items"}) Optional<Customer> findById(Long id);\` |
| **\`@Lock\`** | \`METHOD\` | \`value\` (\`LockModeType\`) | Enforces pessimistic or optimistic database lock on queried rows (\`PESSIMISTIC_WRITE\`, \`PESSIMISTIC_READ\`, \`OPTIMISTIC\`). | \`@Lock(LockModeType.PESSIMISTIC_WRITE) Optional<Account> findById(Long id);\` |
| **\`@QueryHints\`** | \`METHOD\` | \`value = @QueryHint[]\` | Passes vendor-specific JPA/Hibernate optimization hints (e.g. query cache, fetch size, comments). | \`@QueryHints(@QueryHint(name = "org.hibernate.readOnly", value = "true")) List<Report> findReports();\` |

---

${insertTarget}`;

    return content.replace(insertTarget, newSection);
  }
);

// =============================================================================
// 3. TOPIC 95: Derived Query Methods (content/part3-spring/95-automated-derived-query-methods-dynamic-projections-jpql-query.md)
// =============================================================================
enrichFile(
  'content/part3-spring/95-automated-derived-query-methods-dynamic-projections-jpql-query.md',
  '#### Complete Spring Data Derived Query Keywords Reference Matrix',
  (content) => {
    const targetHeader = '#### Query Criteria Keywords';
    const newSection = `#### Complete Spring Data Derived Query Keywords Reference Matrix

Spring Data parses method names against the target entity's property graph. Below is the comprehensive directory of all supported query creation keywords, their derived JPQL equivalents, and sample repository method declarations.

| Keyword | Derived JPQL / SQL Equivalent | Example Repository Method Signature |
| :--- | :--- | :--- |
| **\`Is\` / \`Equals\`** | \`WHERE e.status = ?1\` | \`findByStatus(Status s)\` or \`findByStatusEquals(Status s)\` |
| **\`Not\`** | \`WHERE e.status != ?1\` | \`findByStatusNot(Status s)\` |
| **\`IsNull\`** | \`WHERE e.endDate IS NULL\` | \`findByEndDateIsNull()\` |
| **\`IsNotNull\` / \`NotNull\`** | \`WHERE e.endDate IS NOT NULL\` | \`findByEndDateIsNotNull()\` |
| **\`True\`** | \`WHERE e.active = true\` | \`findByActiveTrue()\` |
| **\`False\`** | \`WHERE e.active = false\` | \`findByActiveFalse()\` |
| **\`StartingWith\`** | \`WHERE e.sku LIKE ?1 || '%'\` | \`findBySkuStartingWith(String prefix)\` |
| **\`EndingWith\`** | \`WHERE e.sku LIKE '%' || ?1\` | \`findBySkuEndingWith(String suffix)\` |
| **\`Containing\`** | \`WHERE e.title LIKE '%' || ?1 || '%'\` | \`findByTitleContaining(String keyword)\` |
| **\`Like\`** | \`WHERE e.name LIKE ?1\` | \`findByNameLike(String customLikePattern)\` |
| **\`NotLike\`** | \`WHERE e.name NOT LIKE ?1\` | \`findByNameNotLike(String pattern)\` |
| **\`IgnoreCase\`** | \`WHERE UPPER(e.email) = UPPER(?1)\` | \`findByEmailIgnoreCase(String email)\` |
| **\`AllIgnoreCase\`** | \`WHERE UPPER(e.fn) = UPPER(?1) AND UPPER(e.ln) = UPPER(?2)\` | \`findByFirstNameAndLastNameAllIgnoreCase(String fn, String ln)\` |
| **\`Between\`** | \`WHERE e.price BETWEEN ?1 AND ?2\` | \`findByPriceBetween(BigDecimal min, BigDecimal max)\` |
| **\`LessThan\`** | \`WHERE e.age < ?1\` | \`findByAgeLessThan(int maxAge)\` |
| **\`LessThanEqual\`** | \`WHERE e.age <= ?1\` | \`findByAgeLessThanEqual(int maxAge)\` |
| **\`GreaterThan\`** | \`WHERE e.salary > ?1\` | \`findBySalaryGreaterThan(double minSalary)\` |
| **\`GreaterThanEqual\`** | \`WHERE e.salary >= ?1\` | \`findBySalaryGreaterThanEqual(double minSalary)\` |
| **\`Before\`** | \`WHERE e.createdAt < ?1\` | \`findByCreatedAtBefore(Instant cutoff)\` |
| **\`After\`** | \`WHERE e.createdAt > ?1\` | \`findByCreatedAtAfter(Instant cutoff)\` |
| **\`In\`** | \`WHERE e.countryCode IN (?1)\` | \`findByCountryCodeIn(Collection<String> countries)\` |
| **\`NotIn\`** | \`WHERE e.countryCode NOT IN (?1)\` | \`findByCountryCodeNotIn(Collection<String> countries)\` |
| **\`And\`** | \`WHERE e.dept = ?1 AND e.salary >= ?2\` | \`findByDepartmentAndSalaryGreaterThanEqual(String d, double s)\` |
| **\`Or\`** | \`WHERE e.role = ?1 OR e.vip = true\` | \`findByRoleOrVipTrue(String role)\` |
| **\`OrderBy\`** | \`ORDER BY e.createdDate DESC\` | \`findByDepartmentOrderByCreatedDateDesc(String dept)\` |
| **\`Top\` / \`First\`** | \`LIMIT 5\` / \`LIMIT 1\` | \`findTop5ByOrderByScoreDesc()\` or \`findFirstByEmail(String email)\` |
| **\`Distinct\`** | \`SELECT DISTINCT e FROM ...\` | \`findDistinctByLastName(String lastName)\` |
| **\`ExistsBy\`** | \`SELECT 1 FROM ... WHERE ...\` | \`boolean existsByEmail(String email)\` |
| **\`CountBy\`** | \`SELECT COUNT(e) FROM ... WHERE ...\` | \`long countByDepartment(String dept)\` |
| **\`DeleteBy\` / \`RemoveBy\`** | \`DELETE FROM ... WHERE ...\` | \`long deleteByStatus(Status s)\` |`;

    const regex = /#### Query Criteria Keywords[\s\S]*?(?=---)/;
    if (!regex.test(content)) {
      throw new Error('Target section not found in topic-95');
    }
    return content.replace(regex, newSection + '\n\n');
  }
);

// =============================================================================
// 4. TOPIC 91: Spring Web MVC REST (content/part3-spring/91-production-rest-controller-architecture-spring-web-mvc.md)
// =============================================================================
enrichFile(
  'content/part3-spring/91-production-rest-controller-architecture-spring-web-mvc.md',
  '### Master Spring Web MVC & REST Annotations Reference Directory',
  (content) => {
    const targetHeader = '### Parameter Resolution Annotations';
    const newSection = `### Master Spring Web MVC & REST Annotations Reference Directory

Spring Web MVC provides declarative routing, parameter parsing, content negotiation, and exception interception annotations. Below is the full directory categorized across routing and parameter handling.

#### 1. Controller Stereotypes & HTTP Mapping Annotations

| Annotation | Target | Key Attributes | RFC 9110 Semantics & Purpose | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@RestController\`** | \`TYPE\` | \`value\` | Meta-annotation combining \`@Controller\` and \`@ResponseBody\`. Every handler method serializes return values directly to HTTP response payload. | \`@RestController @RequestMapping("/api/v1/orders")\` |
| **\`@Controller\`** | \`TYPE\` | \`value\` | Spring MVC stereotype for traditional MVC view-resolving controllers returning template names. | \`@Controller public class WebViewController\` |
| **\`@ResponseBody\`** | \`TYPE\`, \`METHOD\` | None | Signals Spring to serialize method return value via registered \`HttpMessageConverter\` (e.g. Jackson). | \`public @ResponseBody UserDto getUser()\` |
| **\`@RequestMapping\`** | \`TYPE\`, \`METHOD\` | \`path\`, \`method\`, \`consumes\`, \`produces\`, \`params\`, \`headers\` | General-purpose URL mapping declaring base URL paths, media types, and HTTP verb constraints. | \`@RequestMapping(path = "/orders", consumes = "application/json")\` |
| **\`@GetMapping\`** | \`METHOD\` | \`path\`, \`produces\` | Specialization for HTTP \`GET\` (Read). Idempotent & safe. | \`@GetMapping("/{id}") public OrderDto getOrder(@PathVariable Long id)\` |
| **\`@PostMapping\`** | \`METHOD\` | \`path\`, \`consumes\` | Specialization for HTTP \`POST\` (Create / action). Non-idempotent. Returns \`201 Created\` or \`200 OK\`. | \`@PostMapping public ResponseEntity<OrderDto> create(@RequestBody OrderDto dto)\` |
| **\`@PutMapping\`** | \`METHOD\` | \`path\`, \`consumes\` | Specialization for HTTP \`PUT\` (Full Replacement). Idempotent. Returns \`200 OK\` or \`204 No Content\`. | \`@PutMapping("/{id}") public OrderDto replace(@PathVariable Long id, @RequestBody OrderDto d)\` |
| **\`@PatchMapping\`** | \`METHOD\` | \`path\`, \`consumes\` | Specialization for HTTP \`PATCH\` (Partial Update). Non-idempotent. | \`@PatchMapping("/{id}") public OrderDto patch(@PathVariable Long id, @RequestBody JsonMergePatch p)\` |
| **\`@DeleteMapping\`** | \`METHOD\` | \`path\` | Specialization for HTTP \`DELETE\` (Remove). Idempotent. Returns \`204 No Content\`. | \`@DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id)\` |

#### 2. Request Parameter Resolution, Binding & Interception

| Annotation | Target | Key Attributes | Operational Mechanics | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@PathVariable\`** | \`PARAMETER\` | \`name\` / \`value\`, \`required = true\` | Extracts URI template variable tokens from matching URL patterns (e.g. \`/users/{userId}\`). | \`@GetMapping("/{id}") public UserDto get(@PathVariable("id") UUID id)\` |
| **\`@RequestParam\`** | \`PARAMETER\` | \`name\`, \`required = true\`, \`defaultValue\` | Extracts query string parameters (\`?page=0&size=20\`) or multipart form fields. | \`@GetMapping public Page<User> list(@RequestParam(defaultValue = "0") int page)\` |
| **\`@RequestBody\`** | \`PARAMETER\` | \`required = true\` | Deserializes incoming HTTP request body directly into Java POJO / record via \`HttpMessageConverter\`. | \`@PostMapping public User create(@Valid @RequestBody CreateUserDto dto)\` |
| **\`@RequestHeader\`** | \`PARAMETER\` | \`name\`, \`required = true\`, \`defaultValue\` | Extracts specific HTTP header values from the request context. | \`public User authenticate(@RequestHeader("Authorization") String token)\` |
| **\`@CookieValue\`** | \`PARAMETER\` | \`name\`, \`required = true\`, \`defaultValue\` | Extracts HTTP cookie values by cookie name. | \`public User profile(@CookieValue("SESSION_ID") String sessionId)\` |
| **\`@ModelAttribute\`** | \`PARAMETER\`, \`METHOD\` | \`name\`, \`binding = true\` | Binds query parameters or form fields directly to bean properties / record components. | \`@GetMapping("/search") public Result search(@ModelAttribute FilterDto filter)\` |
| **\`@ResponseStatus\`** | \`TYPE\`, \`METHOD\` | \`code\` (\`HttpStatus\`), \`reason\` | Sets explicit HTTP response status code without needing a \`ResponseEntity\` wrapper. | \`@ResponseStatus(HttpStatus.NO_CONTENT) @DeleteMapping("/{id}")\` |
| **\`@CrossOrigin\`** | \`TYPE\`, \`METHOD\` | \`origins\`, \`methods\`, \`maxAge\` | Configures Cross-Origin Resource Sharing (CORS) headers for browsers. | \`@CrossOrigin(origins = "https://app.enterprise.com")\` |
| **\`@RestControllerAdvice\`** | \`TYPE\` | \`basePackages\`, \`assignableTypes\` | Global interceptor combining \`@ControllerAdvice\` + \`@ResponseBody\` for centralized error handling. | \`@RestControllerAdvice public class GlobalExceptionHandler\` |
| **\`@ExceptionHandler\`** | \`METHOD\` | \`value = Class<? extends Throwable>[]\` | Intercepts declared exceptions thrown across controllers and builds structured error responses. | \`@ExceptionHandler(EntityNotFoundException.class) public ProblemDetail handle()\``;

    return content.replace(targetHeader, newSection);
  }
);

// =============================================================================
// 5. TOPIC 88: Spring Core Stereotypes & Lifecycle (content/part3-spring/88-component-scanning-injection-strategies-bean-lifecycle.md)
// =============================================================================
enrichFile(
  'content/part3-spring/88-component-scanning-injection-strategies-bean-lifecycle.md',
  '## Master Spring Core Stereotypes & IoC Annotations Reference Directory',
  (content) => {
    const targetHeader = '## Architecture & Core Mechanics';
    const newSection = `## Master Spring Core Stereotypes & IoC Annotations Reference Directory

Spring Core Inversion of Control (IoC) container utilizes declarative stereotype annotations to discover, wire, configure, and orchestrate the lifecycles of managed singleton and prototype beans.

### 1. Component Stereotypes & Bean Definitions

| Annotation | Target Element | Key Attributes | Architectural Purpose & Container Mechanics | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@Component\`** | \`TYPE\` | \`value\` (Bean name) | Generic stereotype marker declaring any class as a Spring-managed bean candidate for classpath scanning. | \`@Component public class EmailSanitizer {}\` |
| **\`@Service\`** | \`TYPE\` | \`value\` | Semantic specialization of \`@Component\` indicating business service layer logic (transactions, validations, workflows). | \`@Service public class OrderServiceImpl implements OrderService {}\` |
| **\`@Repository\`** | \`TYPE\` | \`value\` | Semantic specialization of \`@Component\` for persistence DAOs. Activates automatic exception translation into \`DataAccessException\`. | \`@Repository public class UserDaoImpl implements UserDao {}\` |
| **\`@Controller\`** | \`TYPE\` | \`value\` | Presentation layer stereotype declaring MVC web controllers for handling HTTP requests and view resolution. | \`@Controller public class HomeController {}\` |
| **\`@Configuration\`** | \`TYPE\` | \`value\`, \`proxyBeanMethods = true\` | Declares a Java-based configuration class defining one or more \`@Bean\` factory methods with CGLIB proxying for singleton guarantees. | \`@Configuration public class SecurityConfig {}\` |
| **\`@Bean\`** | \`METHOD\` | \`name\`, \`initMethod\`, \`destroyMethod\` | Declares a factory method returning an instantiated object managed directly by the Spring container. | \`@Bean public ObjectMapper objectMapper() { return new ObjectMapper(); }\` |
| **\`@Scope\`** | \`TYPE\`, \`METHOD\` | \`value\` (\`singleton\`, \`prototype\`, etc.) | Defines bean lifecycle scope: default \`singleton\` (one per container), \`prototype\` (new instance per injection), or web scopes. | \`@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)\` |
| **\`@Primary\`** | \`TYPE\`, \`METHOD\` | None | Designates high-priority bean when multiple beans of the same type exist, resolving autowiring ambiguity without qualifiers. | \`@Primary @Service public class DefaultPaymentGateway implements PaymentGateway {}\` |
| **\`@Qualifier\`** | \`FIELD\`, \`PARAM\`, \`TYPE\` | \`value\` (String, required) | Resolves dependency injection ambiguity by matching bean names or custom qualifier labels explicitly. | \`@Autowired public OrderService(@Qualifier("stripePaymentGateway") PaymentGateway gw)\` |
| **\`@Lazy\`** | \`TYPE\`, \`METHOD\`, \`PARAM\` | \`value = true\` | Defers bean initialization until it is first requested rather than eager container bootstrap creation. Breaks circular dependencies. | \`@Lazy @Service public class HeavyReportingEngine {}\` |
| **\`@Profile\`** | \`TYPE\`, \`METHOD\` | \`value = String[]\` | Conditional registration based on active Spring profiles (\`dev\`, \`prod\`, \`test\`). | \`@Profile("prod") @Configuration public class ProductionConfig {}\` |
| **\`@DependsOn\`** | \`TYPE\`, \`METHOD\` | \`value = String[]\` | Enforces explicit bean initialization ordering when beans do not have direct injection relationships. | \`@DependsOn("databaseMigrator") @Bean public DataSource dataSource()\` |
| **\`@Order\`** | \`TYPE\`, \`METHOD\` | \`value\` (int) | Defines sorting priority when injecting a \`List<T>\` of beans or configuring filter/interceptor chains (lower values = higher priority). | \`@Order(Ordered.HIGHEST_PRECEDENCE) @Component public class AuthFilter\` |

### 2. Dependency Injection, Configuration Properties & Lifecycle Callbacks

| Annotation | Target Element | Key Attributes | Container Mechanics & Best Practices | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@Autowired\`** | \`CONSTRUCTOR\`, \`METHOD\`, \`FIELD\` | \`required = true\` | Instructs container to inject matching dependency by type. In Spring 4.3+, optional if the class has a single constructor! | \`@Autowired public OrderService(PaymentGateway gw) { this.gw = gw; }\` |
| **\`@Value\`** | \`FIELD\`, \`PARAM\` | \`value\` (SpEL / \`\${property}\`) | Injects externalized configuration properties or SpEL evaluation results directly into fields/constructors. | \`@Value("\${app.jwt.secret:defaultSecret}") private String jwtSecret;\` |
| **\`@PostConstruct\`** | \`METHOD\` | None | Standard Jakarta EE callback executed exactly once after dependency injection is complete and bean is ready. | \`@PostConstruct public void initCache() { cache.warmUp(); }\` |
| **\`@PreDestroy\`** | \`METHOD\` | None | Standard Jakarta EE callback executed during container graceful shutdown before bean instance is evicted from memory. | \`@PreDestroy public void closeConnections() { client.shutdown(); }\` |
| **\`@EventListener\`** | \`METHOD\` | \`classes\`, \`condition\` | Declares an application event listener subscribing to asynchronous or synchronous Spring application events. | \`@EventListener public void onOrderCreated(OrderCreatedEvent event) {}\` |

---

${targetHeader}`;

    return content.replace(targetHeader, newSection);
  }
);

// =============================================================================
// 6. TOPIC 96: Transactional Boundaries (content/part3-spring/96-declarative-transactional-boundaries-pagination-sorting-n-plus-one.md)
// =============================================================================
enrichFile(
  'content/part3-spring/96-declarative-transactional-boundaries-pagination-sorting-n-plus-one.md',
  '### Master Spring Transaction Management Reference Directory',
  (content) => {
    const targetHeader = '### Transaction Propagation & Attributes';
    const newSection = `### Master Spring Transaction Management Reference Directory

Declarative transaction boundaries in Spring are intercepted by AOP proxies using \`@Transactional\`. The following authoritative reference tables outline all configurable attributes, the 7 propagation behaviors, and transaction isolation levels.

#### 1. \`@Transactional\` Attributes Reference

| Attribute | Type | Default | Operational Purpose & Architectural Mechanics |
| :--- | :--- | :--- | :--- |
| **\`propagation\`** | \`Propagation\` | \`REQUIRED\` | Defines how the method participates in an existing or creates a new transactional context. |
| **\`isolation\`** | \`Isolation\` | \`DEFAULT\` | Defines database concurrency isolation level (governing dirty reads, non-repeatable reads, phantom reads). |
| **\`readOnly\`** | \`boolean\` | \`false\` | Skips Hibernate memory snapshots and dirty checking flush when \`true\`, dramatically cutting CPU and memory overhead. |
| **\`timeout\`** | \`int\` (seconds) | \`-1\` (unlimited) | Max transaction execution duration before auto-rollback and \`TransactionTimedOutException\`. |
| **\`rollbackFor\`** | \`Class<? extends Throwable>[]\` | \`RuntimeException.class\`, \`Error.class\` | Specifies exception types that trigger rollback. By default, **checked exceptions do NOT roll back** unless declared here! |
| **\`noRollbackFor\`** | \`Class<? extends Throwable>[]\` | \`{}\` | Specifies exceptions that must NOT trigger rollback, allowing transaction to commit despite throwing. |
| **\`transactionManager\`** | \`String\` | \`""\` | Selects specific \`PlatformTransactionManager\` qualifier in multi-datasource configurations. |

#### 2. The 7 Transaction Propagation Behaviors Matrix

| Propagation Level | Active Transaction Already Exists | No Active Transaction Exists | Typical Enterprise Use Case |
| :--- | :--- | :--- | :--- |
| **\`REQUIRED\`** (Default) | **Joins** existing transaction. | **Creates** a brand new transaction. | Default for standard service business methods. All operations share same commit/rollback fate. |
| **\`REQUIRES_NEW\`** | **Suspends** outer transaction; creates isolated new transaction. Outer resumes after inner finishes. | **Creates** a brand new transaction. | Audit logging, notification publishing, or billing ledger updates that must persist even if outer business flow fails. |
| **\`SUPPORTS\`** | **Joins** existing transaction. | Executes **non-transactionally** (no transaction context). | Read-only lookup methods that can benefit from active transaction if caller opened one. |
| **\`NOT_SUPPORTED\`** | **Suspends** outer transaction; executes non-transactionally. | Executes **non-transactionally**. | Long-running operations, external HTTP calls, or file uploads that should avoid locking database connections. |
| **\`MANDATORY\`** | **Joins** existing transaction. | **Throws** \`IllegalTransactionStateException\`. | Critical subordinate methods that cannot safely execute outside a caller-managed transaction boundary. |
| **\`NEVER\`** | **Throws** \`IllegalTransactionStateException\`. | Executes **non-transactionally**. | Batch processes or operations that strictly forbid database transaction locks. |
| **\`NESTED\`** | Creates a **JDBC Savepoint** within existing transaction. | **Creates** a brand new transaction (like \`REQUIRED\`). | Sub-workflows that can roll back to a savepoint on failure without causing entire outer transaction to roll back. |

#### 3. Database Isolation Levels & Anomaly Prevention

| Isolation Level | Dirty Read Prevention | Non-Repeatable Read Prevention | Phantom Read Prevention | Performance Overhead | Standard DB Default |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **\`READ_UNCOMMITTED\`** | ❌ No | ❌ No | ❌ No | Lowest | Rarely used in OLTP |
| **\`READ_COMMITTED\`** | ✅ **Prevented** | ❌ No | ❌ No | Low | **PostgreSQL, Oracle, SQL Server** |
| **\`REPEATABLE_READ\`** | ✅ **Prevented** | ✅ **Prevented** | ❌ No (Yes in MySQL InnoDB) | Medium | **MySQL / MariaDB Default** |
| **\`SERIALIZABLE\`** | ✅ **Prevented** | ✅ **Prevented** | ✅ **Prevented** | Highest (Table Locks) | High-concurrency financial balance locks |`;

    const regex = /### Transaction Propagation & Attributes[\s\S]*?(?=1\. \*\*Propagation Behaviors:\*\*)/;
    if (!regex.test(content)) {
      throw new Error('Target section not found in topic-96');
    }
    return content.replace(regex, newSection + '\n\n');
  }
);

// =============================================================================
// 7. TOPIC 102: Automated Testing (content/part3-spring/102-modern-automated-testing-junit5-mockito-testcontainers.md)
// =============================================================================
enrichFile(
  'content/part3-spring/102-modern-automated-testing-junit5-mockito-testcontainers.md',
  '### Master Enterprise Automated Testing Annotations Directory',
  (content) => {
    const newSection = `### Master Enterprise Automated Testing Annotations Directory

Modern testing in Spring Boot spans JUnit 5 for unit execution, Mockito for test doubles, Spring Boot test slices for targeted integration, and Testcontainers for real disposable infrastructure.

#### 1. JUnit 5 Jupiter Lifecycle & Parameterized Annotations

| Annotation | Target | Purpose & Execution Phase | Production Example |
| :--- | :--- | :--- | :--- |
| **\`@Test\`** | \`METHOD\` | Declares standard test method executed by the Jupiter engine. | \`@Test void shouldCalculateOrderTotal()\` |
| **\`@BeforeEach\`** | \`METHOD\` | Executed before **every** individual \`@Test\` method in current class. | \`@BeforeEach void setUp() { service = new OrderService(); }\` |
| **\`@AfterEach\`** | \`METHOD\` | Executed after **every** individual \`@Test\` method (teardown/cleanup). | \`@AfterEach void tearDown() { repository.deleteAll(); }\` |
| **\`@BeforeAll\`** | \`METHOD\` (static) | Executed once before **all** tests in class (static or per-class lifecycle). | \`@BeforeAll static void initContainer() { pg.start(); }\` |
| **\`@AfterAll\`** | \`METHOD\` (static) | Executed once after **all** tests in class finish. | \`@AfterAll static void stopContainer() { pg.stop(); }\` |
| **\`@Nested\`** | \`TYPE\` (Inner Class) | Groups related test scenarios into hierarchical BDD structures. | \`@Nested class WhenUserIsAdmin { ... }\` |
| **\`@DisplayName\`** | \`TYPE\`, \`METHOD\` | Defines readable, expressive human title for test reports. | \`@DisplayName("Should return 404 when user does not exist")\` |
| **\`@Disabled\`** | \`TYPE\`, \`METHOD\` | Temporarily ignores/skips test execution with optional reason. | \`@Disabled("Bug #882 pending fix")\` |
| **\`@Timeout\`** | \`TYPE\`, \`METHOD\` | Fails test if execution duration exceeds specified threshold. | \`@Timeout(value = 5, unit = TimeUnit.SECONDS)\` |
| **\`@Tag\`** | \`TYPE\`, \`METHOD\` | Filters test execution in Maven/Gradle builds (e.g. \`fast\`, \`smoke\`, \`slow\`). | \`@Tag("integration")\` |
| **\`@ParameterizedTest\`** | \`METHOD\` | Executes same test logic repeatedly across parameterized arguments. | \`@ParameterizedTest @ValueSource(strings = {"a", "b"})\` |
| **\`@ValueSource\`** | \`METHOD\` | Supplies array of primitive/string literals to parameterized test. | \`@ValueSource(ints = {1, 2, 3})\` |
| **\`@CsvSource\`** | \`METHOD\` | Supplies comma-delimited tabular rows to parameterized test. | \`@CsvSource({"10, 2, 5", "20, 4, 5"})\` |
| **\`@MethodSource\`** | \`METHOD\` | Delegates input generation to a static factory method returning \`Stream<Arguments>\`. | \`@MethodSource("provideTestData")\` |
| **\`@TempDir\`** | \`FIELD\`, \`PARAM\` | Injects a temporary directory on disk, automatically deleted after test. | \`@TempDir Path tempDir;\` |

#### 2. Mockito Test Double Annotations

| Annotation | Target | Purpose & Behavioral Mechanics | Production Example |
| :--- | :--- | :--- | :--- |
| **\`@Mock\`** | \`FIELD\`, \`PARAM\` | Generates dynamic proxy mock instance with zero real implementation logic. | \`@Mock private PaymentGateway paymentGateway;\` |
| **\`@Spy\`** | \`FIELD\` | Wraps a real object instance, allowing selective method stubbing while delegating rest to real code. | \`@Spy private ObjectMapper mapper = new ObjectMapper();\` |
| **\`@Captor\`** | \`FIELD\` | Creates \`ArgumentCaptor<T>\` instance to capture and inspect arguments passed into mock invocations. | \`@Captor private ArgumentCaptor<Order> orderCaptor;\` |
| **\`@InjectMocks\`** | \`FIELD\` | Instantiates class under test and injects declared \`@Mock\` / \`@Spy\` fields into constructor. | \`@InjectMocks private OrderService orderService;\` |
| **\`@ExtendWith\`** | \`TYPE\` | Registers Jupiter extensions, such as \`MockitoExtension.class\` to process Mockito annotations. | \`@ExtendWith(MockitoExtension.class) class ServiceTest\` |

#### 3. Spring Boot Test Slices & Integration Annotations

| Annotation | Target | Scope & Architectural Focus | Production Example |
| :--- | :--- | :--- | :--- |
| **\`@SpringBootTest\`** | \`TYPE\` | Boots **complete** \`ApplicationContext\`. Used for end-to-end integration tests. | \`@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)\` |
| **\`@WebMvcTest\`** | \`TYPE\` | Slices **web layer only** (controllers, filters, converters). Disables services and JPA repositories. | \`@WebMvcTest(OrderController.class)\` |
| **\`@DataJpaTest\`** | \`TYPE\` | Slices **JPA persistence layer only** (repositories, entities, Flyway/H2). Uses transactional rollback by default. | \`@DataJpaTest class OrderRepositoryTest\` |
| **\`@JsonTest\`** | \`TYPE\` | Slices **JSON serialization / deserialization** testing Jackson \`Tester<T>\`. | \`@JsonTest class OrderJsonTest\` |
| **\`@AutoConfigureMockMvc\`** | \`TYPE\` | Configures non-server \`MockMvc\` client for mocking HTTP dispatching. | \`@SpringBootTest @AutoConfigureMockMvc\` |
| **\`@MockitoBean\`** / **\`@MockBean\`** | \`FIELD\` | Injects mock into the Spring ApplicationContext, replacing any real bean. | \`@MockitoBean private PaymentGateway paymentGateway;\` |
| **\`@DynamicPropertySource\`** | \`METHOD\` (static) | Dynamically registers properties into Spring Environment (e.g. Testcontainers JDBC URL). | \`@DynamicPropertySource static void props(DynamicPropertyRegistry r) { r.add("spring.datasource.url", pg::getJdbcUrl); }\` |
| **\`@Testcontainers\`** | \`TYPE\` | Enables JUnit 5 Testcontainers extension to manage Docker container lifecycles. | \`@Testcontainers @SpringBootTest class EndToEndTest\` |
| **\`@Container\`** | \`FIELD\` | Declares managed container instance (static = shared across test class; non-static = fresh per test). | \`@Container static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");\``;

    const regex = /### JUnit 5 \(Jupiter Engine\) Syntax[\s\S]*?(?=## Production Implementation)/;
    if (!regex.test(content)) {
      throw new Error('Target section not found in topic-102');
    }
    return content.replace(regex, newSection + '\n\n---\n\n');
  }
);

// =============================================================================
// 8. TOPIC 71: Jakarta Servlet (content/part2-jakarta/71-servlet-configuration-annotations-vs-web-xml.md)
// =============================================================================
enrichFile(
  'content/part2-jakarta/71-servlet-configuration-annotations-vs-web-xml.md',
  '## Master Jakarta Servlet Component Annotations Directory',
  (content) => {
    const targetHeader = '## Configuration Comparison Matrix';
    const newSection = `## Master Jakarta Servlet Component Annotations Directory

Modern Jakarta Servlet 6.0 allows declarative configuration of all web components via annotations in package \`jakarta.servlet.annotation\`. Below is the complete reference matrix of all servlet component annotations.

| Annotation | Applicable Target | Key Attributes | Specification Purpose & Lifecycle Role | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@WebServlet\`** | \`TYPE\` | \`name\`, \`urlPatterns\`, \`loadOnStartup\`, \`initParams\`, \`asyncSupported\` | Declares an \`HttpServlet\` component and binds it to URL patterns with optional initialization parameters. | \`@WebServlet(name = "UserServlet", urlPatterns = {"/users/*"}, loadOnStartup = 1)\` |
| **\`@WebFilter\`** | \`TYPE\` | \`filterName\`, \`urlPatterns\`, \`servletNames\`, \`dispatcherTypes\`, \`asyncSupported\` | Declares a \`Filter\` component intercepting incoming requests or responses before/after servlet execution. | \`@WebFilter(urlPatterns = {"/api/*"}, dispatcherTypes = {DispatcherType.REQUEST})\` |
| **\`@WebListener\`** | \`TYPE\` | \`value\` | Declares an application lifecycle event listener (e.g. \`ServletContextListener\`, \`HttpSessionListener\`). | \`@WebListener public class AppBootstrapListener implements ServletContextListener {}\` |
| **\`@WebInitParam\`** | *(Nested in annotations)* | \`name\`, \`value\`, \`description\` | Declares initialization name-value pairs inside \`@WebServlet\` or \`@WebFilter\`. | \`initParams = {@WebInitParam(name = "timeout", value = "30")}\` |
| **\`@MultipartConfig\`** | \`TYPE\` | \`location\`, \`maxFileSize\`, \`maxRequestSize\`, \`fileSizeThreshold\` | Enables multipart/form-data payload parsing on the annotated servlet via \`request.getPart(...)\`. | \`@MultipartConfig(maxFileSize = 10485760L, maxRequestSize = 20971520L)\` |
| **\`@ServletSecurity\`** | \`TYPE\` | \`value\` (\`@HttpConstraint\`), \`httpMethodConstraints\` | Enforces declarative security constraints, roles, and transport guarantees (SSL/TLS) on servlet paths. | \`@ServletSecurity(@HttpConstraint(rolesAllowed = {"ADMIN"}))\` |
| **\`@HttpConstraint\`** | *(Nested in security)* | \`value\`, \`rolesAllowed\`, \`transportGuarantee\` | Defines security constraint applied to all HTTP methods not explicitly overridden. | \`@HttpConstraint(transportGuarantee = TransportGuarantee.CONFIDENTIAL)\` |
| **\`@HttpMethodConstraint\`** | *(Nested in security)* | \`value\` (HTTP verb), \`rolesAllowed\`, \`emptyRoleSemantic\` | Enforces distinct role constraints per specific HTTP method (e.g. restrict \`POST\` to \`MANAGER\`). | \`@HttpMethodConstraint(value = "POST", rolesAllowed = {"MANAGER"})\` |

---

## Configuration Comparison Matrix`;

    return content.replace(targetHeader, newSection);
  }
);

// =============================================================================
// 9. TOPIC 83: Jakarta CDI (content/part2-jakarta/83-jakarta-contexts-and-dependency-injection-cdi.md)
// =============================================================================
enrichFile(
  'content/part2-jakarta/83-jakarta-contexts-and-dependency-injection-cdi.md',
  '## Master Jakarta CDI Annotations Reference Directory',
  (content) => {
    const targetHeader = '## CDI Contextual Scopes Hierarchy';
    const newSection = `## Master Jakarta CDI Annotations Reference Directory

Jakarta Contexts and Dependency Injection (CDI 4.0) provides a standard, type-safe dependency injection and component lifecycle architecture across the Jakarta EE stack.

| Annotation | Target Element | Category | Architectural Purpose & Container Behavior | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@Inject\`** | \`CONSTRUCTOR\`, \`METHOD\`, \`FIELD\` | Injection | Identifies injectable constructors, methods, and fields for type-safe contextual dependency resolution. | \`@Inject private PaymentGateway paymentGateway;\` |
| **\`@Named\`** | \`TYPE\`, \`METHOD\`, \`FIELD\`, \`PARAM\` | Resolution | Assigns EL-accessible string identifier to a CDI bean for Jakarta Expression Language / JSF / MVC binding. | \`@Named("userManager") @RequestScoped public class UserManager {}\` |
| **\`@Produces\`** | \`METHOD\`, \`FIELD\` | Producer | Declares a producer method or field turning non-CDI third-party objects or dynamic instances into injectable CDI beans. | \`@Produces @ApplicationScoped public DataSource createDataSource() { ... }\` |
| **\`@Disposes\`** | \`PARAMETER\` | Producer | Declares a cleanup destructor method automatically invoked when a produced bean is destroyed. | \`public void close(@Disposes Connection conn) { conn.close(); }\` |
| **\`@Observes\`** | \`PARAMETER\` | Events | Marks parameter as synchronous event observer method receiving dispatched events via \`Event<T>.fire()\`. | \`public void onOrderCreated(@Observes OrderEvent event) { ... }\` |
| **\`@ObservesAsync\`** | \`PARAMETER\` | Events | Marks parameter as asynchronous event observer receiving events fired via \`Event<T>.fireAsync()\`. | \`public void onOrderCreated(@ObservesAsync OrderEvent event) { ... }\` |
| **\`@Alternative\`** | \`TYPE\` | Selection | Declares a bean as a pluggable alternative disabled by default unless explicitly activated via \`beans.xml\` or \`@Priority\`. | \`@Alternative @Priority(1) @ApplicationScoped public class MockPaymentGateway {}\` |
| **\`@Priority\`** | \`TYPE\` | Selection | Assigns integer priority to alternatives or interceptors (higher integer = higher precedence). | \`@Priority(Interceptor.Priority.APPLICATION + 10)\` |
| **\`@Qualifier\`** | \`ANNOTATION_TYPE\` | Resolution | Meta-annotation defining custom typesafe qualifiers to distinguish multiple implementations of the same interface. | \`@Qualifier @Retention(RUNTIME) public @interface Stripe {}\` |
| **\`@Stereotype\`** | \`ANNOTATION_TYPE\` | Meta | Composes multiple CDI annotations (scope, interceptor bindings, qualifiers) into a single reusable meta-annotation. | \`@Stereotype @ApplicationScoped @Transactional public @interface ServiceBean {}\` |
| **\`@AroundInvoke\`** | \`METHOD\` | Interception | Declares an AOP interceptor method intercepting business invocations with \`InvocationContext.proceed()\`. | \`@AroundInvoke public Object log(InvocationContext ctx) throws Exception { ... }\` |

---

## CDI Contextual Scopes Hierarchy`;

    return content.replace(targetHeader, newSection);
  }
);

// =============================================================================
// 10. TOPIC 84: Jakarta RESTful Web Services JAX-RS (content/part2-jakarta/84-jakarta-restful-web-services-jax-rs.md)
// =============================================================================
enrichFile(
  'content/part2-jakarta/84-jakarta-restful-web-services-jax-rs.md',
  '## Master Jakarta RESTful Web Services (JAX-RS) Annotations Directory',
  (content) => {
    const targetHeader = '## Core JAX-RS Annotations Reference';
    const newSection = `## Master Jakarta RESTful Web Services (JAX-RS) Annotations Directory

Jakarta RESTful Web Services (JAX-RS 3.1) standardizes HTTP service routing, parameter extraction, content negotiation, and filter interception. Below is the comprehensive directory categorized by architectural role.

### 1. HTTP Verbs, Routing & Content Negotiation

| Annotation | Target Element | Key Attributes | Specification Purpose & RFC Semantics | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@ApplicationPath\`** | \`TYPE\` | \`value\` (String, required) | Declares the base application URI context path for all REST resources in the application. | \`@ApplicationPath("/api/v1") public class RestApp extends Application {}\` |
| **\`@Path\`** | \`TYPE\`, \`METHOD\` | \`value\` (String, required) | Specifies URI template path matching with optional path variables (e.g. \`@Path("/users/{id:[0-9]+}")\`). | \`@Path("/orders") public class OrderResource {}\` |
| **\`@GET\`** | \`METHOD\` | None | Maps HTTP \`GET\` requests (safe, idempotent resource retrieval). | \`@GET @Path("/{id}") public Response get(@PathParam("id") Long id)\` |
| **\`@POST\`** | \`METHOD\` | None | Maps HTTP \`POST\` requests (create subordinate resource or trigger action). | \`@POST public Response create(OrderDto dto)\` |
| **\`@PUT\`** | \`METHOD\` | None | Maps HTTP \`PUT\` requests (full resource replacement, idempotent). | \`@PUT @Path("/{id}") public Response replace(@PathParam("id") Long id, OrderDto dto)\` |
| **\`@DELETE\`** | \`METHOD\` | None | Maps HTTP \`DELETE\` requests (resource removal, idempotent). | \`@DELETE @Path("/{id}") public Response delete(@PathParam("id") Long id)\` |
| **\`@PATCH\`** | \`METHOD\` | None | Maps HTTP \`PATCH\` requests (partial resource modification). | \`@PATCH @Path("/{id}") public Response patch(@PathParam("id") Long id, PatchDto p)\` |
| **\`@HEAD\`** | \`METHOD\` | None | Maps HTTP \`HEAD\` requests (returns HTTP headers identical to \`GET\` without message body). | \`@HEAD @Path("/{id}") public Response checkHeader(@PathParam("id") Long id)\` |
| **\`@OPTIONS\`** | \`METHOD\` | None | Maps HTTP \`OPTIONS\` requests (returns supported HTTP communication methods). | \`@OPTIONS public Response getOptions()\` |
| **\`@Produces\`** | \`TYPE\`, \`METHOD\` | \`value = String[]\` | Declares MIME media types serialized into response body (\`MediaType.APPLICATION_JSON\`). | \`@Produces(MediaType.APPLICATION_JSON)\` |
| **\`@Consumes\`** | \`TYPE\`, \`METHOD\` | \`value = String[]\` | Declares accepted MIME media types expected in request body. | \`@Consumes(MediaType.APPLICATION_JSON)\` |

### 2. Parameter Resolution, Context Injection & Providers

| Annotation | Target Element | Key Attributes | Parameter Source & Operational Mechanics | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@PathParam\`** | \`PARAMETER\`, \`FIELD\` | \`value\` (variable name) | Extracts URI path template variable declared in \`@Path\` matching. | \`public Response get(@PathParam("orderId") String orderId)\` |
| **\`@QueryParam\`** | \`PARAMETER\`, \`FIELD\` | \`value\` (query key) | Extracts URL query parameter from query string (\`?page=2&size=10\`). | \`public Response list(@QueryParam("page") @DefaultValue("0") int page)\` |
| **\`@HeaderParam\`** | \`PARAMETER\`, \`FIELD\` | \`value\` (header name) | Extracts HTTP request header value. | \`public Response auth(@HeaderParam("Authorization") String token)\` |
| **\`@CookieParam\`** | \`PARAMETER\`, \`FIELD\` | \`value\` (cookie name) | Extracts HTTP cookie value by cookie name. | \`public Response session(@CookieParam("JSESSIONID") String session)\` |
| **\`@MatrixParam\`** | \`PARAMETER\`, \`FIELD\` | \`value\` (matrix key) | Extracts matrix URI parameter separated by semicolons (\`/items;color=red\`). | \`public Response filter(@MatrixParam("color") String color)\` |
| **\`@FormParam\`** | \`PARAMETER\`, \`FIELD\` | \`value\` (form field) | Extracts form field value from \`application/x-www-form-urlencoded\` payload. | \`public Response submit(@FormParam("username") String username)\` |
| **\`@BeanParam\`** | \`PARAMETER\` | None | Aggregates multiple parameter annotations into properties of a single POJO. | \`public Response search(@BeanParam FilterParams params)\` |
| **\`@DefaultValue\`** | \`PARAMETER\`, \`FIELD\` | \`value\` (String) | Sets fallback default string value if parameter is absent from request. | \`@QueryParam("limit") @DefaultValue("25") int limit\` |
| **\`@Context\`** | \`FIELD\`, \`PARAMETER\` | None | Injects contextual runtime instances (\`UriInfo\`, \`HttpHeaders\`, \`Request\`, \`SecurityContext\`, \`HttpServletRequest\`). | \`public Response info(@Context UriInfo uriInfo, @Context SecurityContext sec)\` |
| **\`@Provider\`** | \`TYPE\` | None | Marks class as a JAX-RS extension provider (\`ContainerRequestFilter\`, \`ExceptionMapper\`, \`MessageBodyReader\`). | \`@Provider public class GlobalExceptionMapper implements ExceptionMapper<Throwable>\` |
| **\`@NameBinding\`** | \`ANNOTATION_TYPE\` | None | Meta-annotation defining custom binding annotation to bind filters to specific resource methods. | \`@NameBinding @Retention(RUNTIME) public @interface Logged {}\``;

    const regex = /## Core JAX-RS Annotations Reference[\s\S]*?(?=## Production Implementation)/;
    if (!regex.test(content)) {
      throw new Error('Target section not found in topic-84');
    }
    return content.replace(regex, newSection + '\n\n---\n\n');
  }
);

// =============================================================================
// 11. TOPIC 61: Java Core Annotations (content/part1-core/61-annotations-and-metadata.md)
// =============================================================================
enrichFile(
  'content/part1-core/61-annotations-and-metadata.md',
  '## Master Java SE Built-in & Meta-Annotations Directory',
  (content) => {
    const targetHeader = '## Meta-Annotations Taxonomy';
    const newSection = `## Master Java SE Built-in & Meta-Annotations Directory

The Java programming language includes a core set of standard annotations in \`java.lang\` and standard meta-annotations in \`java.lang.annotation\`.

### 1. Standard Built-in Annotations (\`java.lang\`)

| Annotation | Target Element | Retention | Compiler & Runtime Enforcement | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@Override\`** | \`METHOD\` | \`SOURCE\` | Instructs the compiler to verify that the method actually overrides a superclass method or implements an interface contract. Generates compilation error if method signature does not match! | \`@Override public String toString() { return "User"; }\` |
| **\`@Deprecated\`** | All Elements | \`RUNTIME\` | Flags a program element as obsolete or dangerous. Emits compiler warnings when referenced. Attributes: \`since\` (version string) and \`forRemoval\` (boolean). | \`@Deprecated(since = "2.0", forRemoval = true) public void oldMethod() {}\` |
| **\`@SuppressWarnings\`** | All Elements | \`SOURCE\` | Suppresses compiler warnings within the annotated scope. Values include \`"unchecked"\`, \`"deprecation"\`, \`"rawtypes"\`, \`"serial"\`, \`"all"\`. | \`@SuppressWarnings("unchecked") List<String> list = (List<String>) obj;\` |
| **\`@SafeVarargs\`** | \`CONSTRUCTOR\`, \`METHOD\` (static/final/private) | \`RUNTIME\` | Asserts that the method body performs safe operations on its generic varargs parameter array, suppressing compiler heap pollution warnings. | \`@SafeVarargs public static <T> List<T> asList(T... elements) {}\` |
| **\`@FunctionalInterface\`** | \`TYPE\` (Interface) | \`RUNTIME\` | Enforces that an interface contains exactly **one abstract method (SAM)**, guaranteeing compatibility with lambda expressions and method references. | \`@FunctionalInterface public interface Transformer<T, R> { R transform(T t); }\` |
| **\`@Native\`** | \`FIELD\` | \`SOURCE\` | Indicates that a constant field may be referenced from native code and serves as a hint to header-generation tools (e.g. \`javac -h\`). | \`@Native public static final int MAX_BUFFER_SIZE = 4096;\` |

### 2. Standard Meta-Annotations (\`java.lang.annotation\`)

| Meta-Annotation | Target Element | Key Attributes | Architectural Purpose & Compiler Effect |
| :--- | :--- | :--- | :--- |
| **\`@Retention\`** | \`ANNOTATION_TYPE\` | \`value\` (\`RetentionPolicy\`) | Dictates annotation lifecycle: \`SOURCE\` (discarded by compiler), \`CLASS\` (saved in \`.class\` bytecode, discarded by JVM loader), \`RUNTIME\` (retained in JVM heap Metaspace for reflection). |
| **\`@Target\`** | \`ANNOTATION_TYPE\` | \`value = ElementType[]\` | Restricts language locations where annotation can be applied: \`TYPE\`, \`FIELD\`, \`METHOD\`, \`PARAMETER\`, \`CONSTRUCTOR\`, \`LOCAL_VARIABLE\`, \`ANNOTATION_TYPE\`, \`PACKAGE\`, \`TYPE_PARAMETER\`, \`TYPE_USE\`, \`RECORD_COMPONENT\`. |
| **\`@Documented\`** | \`ANNOTATION_TYPE\` | None | Causes the annotation to be included in Javadoc API documentation for annotated elements. |
| **\`@Inherited\`** | \`ANNOTATION_TYPE\` | None | Automatically causes subclasses to inherit the annotation when applied to a class (does not apply to interfaces or methods). |
| **\`@Repeatable\`** | \`ANNOTATION_TYPE\` | \`value\` (Containing annotation class) | Allows declaring the same annotation multiple times on the same target element (introduced in Java 8). |

---

${targetHeader}`;

    return content.replace(targetHeader, newSection);
  }
);

// =============================================================================
// 12. TOPIC 99: Master Tri-Domain Dictionary (content/part3-spring/99-definitive-dictionary-java-jakarta-spring-annotations.md)
// =============================================================================
enrichFile(
  'content/part3-spring/99-definitive-dictionary-java-jakarta-spring-annotations.md',
  '### The Master Tri-Domain Architectural Classification Directory',
  (content) => {
    const targetHeader = '### The Master Tri-Part Classification Matrix';
    const newSection = `### The Master Tri-Domain Architectural Classification Directory

The enterprise Java ecosystem relies on three foundational annotation domains: **Java SE Core**, **Jakarta EE Standards**, and the **Spring Framework Ecosystem**. The matrices below provide an authoritative, cross-referenced catalog detailing specification packages, retention policies, runtime targets, and production code usage.

#### 1. Domain 1: Java SE Core Annotations (\`java.lang.*\` & \`java.lang.annotation.*\`)

| Annotation | Package | Target Element | Retention | Core Purpose & Production Behavior | Production Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **\`@Override\`** | \`java.lang\` | \`METHOD\` | \`SOURCE\` | Enforces compiler check that method matches a superclass/interface signature. | \`@Override public String toString()\` |
| **\`@Deprecated\`** | \`java.lang\` | All Elements | \`RUNTIME\` | Warns callers against using obsolete or scheduled-for-removal APIs. | \`@Deprecated(since = "3.1", forRemoval = true)\` |
| **\`@SuppressWarnings\`** | \`java.lang\` | All Elements | \`SOURCE\` | Suppresses specified compiler warnings (\`"unchecked"\`, \`"rawtypes"\`). | \`@SuppressWarnings("unchecked")\` |
| **\`@FunctionalInterface\`** | \`java.lang\` | \`TYPE\` | \`RUNTIME\` | Validates interface has exactly one abstract method for lambda compatibility. | \`@FunctionalInterface public interface Processor<T>\` |
| **\`@SafeVarargs\`** | \`java.lang\` | \`CONSTRUCTOR\`, \`METHOD\` | \`RUNTIME\` | Suppresses compiler warnings when manipulating generic varargs array elements. | \`@SafeVarargs public static <T> List<T> of(T... items)\` |
| **\`@Retention\`** | \`java.lang.annotation\` | \`ANNOTATION_TYPE\` | \`RUNTIME\` | Defines bytecode retention: \`SOURCE\`, \`CLASS\`, or reflection-accessible \`RUNTIME\`. | \`@Retention(RetentionPolicy.RUNTIME)\` |
| **\`@Target\`** | \`java.lang.annotation\` | \`ANNOTATION_TYPE\` | \`RUNTIME\` | Restricts language target elements (\`TYPE\`, \`METHOD\`, \`FIELD\`, \`PARAMETER\`). | \`@Target({ElementType.METHOD, ElementType.TYPE})\` |
| **\`@Inherited\`** | \`java.lang.annotation\` | \`ANNOTATION_TYPE\` | \`RUNTIME\` | Subclasses automatically inherit the annotation from annotated superclasses. | \`@Inherited public @interface Auditable {}\` |
| **\`@Repeatable\`** | \`java.lang.annotation\` | \`ANNOTATION_TYPE\` | \`RUNTIME\` | Enables multiple declarations of the same annotation on a single element. | \`@Repeatable(Schedules.class)\` |

#### 2. Domain 2: Jakarta EE Standards Annotations (\`jakarta.*\`)

| Annotation | Specification Package | Applicable Target | Architectural Semantic & Container Role | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@Entity\`** | \`jakarta.persistence\` | \`TYPE\` | Declares a JPA managed entity class mapped to a relational database table. | \`@Entity @Table(name = "users") public class User\` |
| **\`@Id\`** | \`jakarta.persistence\` | \`FIELD\`, \`METHOD\` | Marks the primary key attribute of the relational entity. | \`@Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;\` |
| **\`@Column\`** | \`jakarta.persistence\` | \`FIELD\`, \`METHOD\` | Maps property to database column with constraints (\`name\`, \`nullable\`, \`unique\`, \`length\`). | \`@Column(name = "email_address", nullable = false, unique = true)\` |
| **\`@OneToMany\`** | \`jakarta.persistence\` | \`FIELD\`, \`METHOD\` | Configures 1-to-N relational association with \`mappedBy\`, cascade, and fetch rules. | \`@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)\` |
| **\`@ManyToOne\`** | \`jakarta.persistence\` | \`FIELD\`, \`METHOD\` | Configures N-to-1 association with foreign key column (always defaults to \`FetchType.LAZY\` in production!). | \`@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "customer_id")\` |
| **\`@Version\`** | \`jakarta.persistence\` | \`FIELD\`, \`METHOD\` | Enables optimistic concurrency control via integer/timestamp column. | \`@Version private Long version;\` |
| **\`@NotNull\`** | \`jakarta.validation.constraints\` | \`FIELD\`, \`PARAM\` | Enforces non-null data integrity validation across layers. | \`@NotNull(message = "ID required") Long id;\` |
| **\`@NotBlank\`** | \`jakarta.validation.constraints\` | \`FIELD\`, \`PARAM\` | Value must be non-null and contain at least one non-whitespace character. | \`@NotBlank(message = "Username cannot be empty") String username;\` |
| **\`@Size\`** | \`jakarta.validation.constraints\` | \`FIELD\`, \`PARAM\` | Validates string length or collection element bounds within inclusive min/max. | \`@Size(min = 8, max = 32) String password;\` |
| **\`@Valid\`** | \`jakarta.validation\` | \`FIELD\`, \`PARAM\` | Triggers recursive cascading validation on nested objects or collections. | \`@Valid @NotNull Address billingAddress;\` |
| **\`@Inject\`** | \`jakarta.inject\` | \`CONSTRUCTOR\`, \`METHOD\`, \`FIELD\` | Identifies injectable dependencies for type-safe CDI / Spring injection. | \`@Inject public OrderService(PaymentGateway gw)\` |
| **\`@WebServlet\`** | \`jakarta.servlet.annotation\` | \`TYPE\` | Declares an \`HttpServlet\` component with URL mapping and loadOnStartup ordering. | \`@WebServlet(urlPatterns = {"/api/*"}, loadOnStartup = 1)\` |
| **\`@Path\`** | \`jakarta.ws.rs\` | \`TYPE\`, \`METHOD\` | Declares URI template routing in JAX-RS REST endpoints. | \`@Path("/orders/{id}") public class OrderResource\` |

#### 3. Domain 3: Spring Framework & Spring Boot Ecosystem (\`org.springframework.*\`)

| Annotation | Module / Package | Applicable Target | Container Mechanics & Best Practices | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **\`@SpringBootApplication\`** | \`org.springframework.boot\` | \`TYPE\` | Composed meta-annotation combining \`@Configuration\`, \`@EnableAutoConfiguration\`, and \`@ComponentScan\`. | \`@SpringBootApplication public class Application { public static void main(String[] a) { SpringApplication.run(Application.class, a); } }\` |
| **\`@Component\`** | \`org.springframework.stereotype\` | \`TYPE\` | Base stereotype marking class as candidate for automatic component scanning. | \`@Component public class OrderValidator {}\` |
| **\`@Service\`** | \`org.springframework.stereotype\` | \`TYPE\` | Business service stereotype orchestrating transactions and workflows. | \`@Service public class OrderServiceImpl implements OrderService {}\` |
| **\`@Repository\`** | \`org.springframework.stereotype\` | \`TYPE\` | Persistence layer stereotype with automatic \`DataAccessException\` translation. | \`@Repository public class UserDaoImpl implements UserDao {}\` |
| **\`@RestController\`** | \`org.springframework.web.bind.annotation\` | \`TYPE\` | Meta-annotation combining \`@Controller\` + \`@ResponseBody\` for REST APIs. | \`@RestController @RequestMapping("/api/orders")\` |
| **\`@Configuration\`** | \`org.springframework.context.annotation\` | \`TYPE\` | Declares Java-based bean factory class with CGLIB proxying. | \`@Configuration public class AppConfig {}\` |
| **\`@Bean\`** | \`org.springframework.context.annotation\` | \`METHOD\` | Declares factory method returning a container-managed bean singleton. | \`@Bean public ObjectMapper mapper() { return new ObjectMapper(); }\` |
| **\`@Autowired\`** | \`org.springframework.beans.factory.annotation\` | \`CONSTRUCTOR\`, \`FIELD\` | Injects dependency by type. Optional in single-constructor classes. | \`@Autowired public OrderService(PaymentGateway gw)\` |
| **\`@Qualifier\`** | \`org.springframework.beans.factory.annotation\` | \`FIELD\`, \`PARAM\` | Resolves autowiring ambiguity by matching candidate bean name. | \`@Qualifier("stripeGateway") PaymentGateway gw\` |
| **\`@Value\`** | \`org.springframework.beans.factory.annotation\` | \`FIELD\`, \`PARAM\` | Injects property value from externalized YAML/properties or SpEL. | \`@Value("\${server.port:8080}") int port;\` |
| **\`@GetMapping\`** | \`org.springframework.web.bind.annotation\` | \`METHOD\` | Maps HTTP \`GET\` requests with optional path and produces rules. | \`@GetMapping("/{id}") public OrderDto getOrder(@PathVariable Long id)\` |
| **\`@PostMapping\`** | \`org.springframework.web.bind.annotation\` | \`METHOD\` | Maps HTTP \`POST\` requests for resource creation. | \`@PostMapping public ResponseEntity<OrderDto> create(@RequestBody OrderDto dto)\` |
| **\`@PathVariable\`** | \`org.springframework.web.bind.annotation\` | \`PARAMETER\` | Extracts URI template variable tokens from matching URL patterns. | \`public OrderDto get(@PathVariable("id") Long id)\` |
| **\`@RequestParam\`** | \`org.springframework.web.bind.annotation\` | \`PARAMETER\` | Extracts query parameters (\`?page=0&size=20\`) with optional defaults. | \`public Page<Order> list(@RequestParam(defaultValue = "0") int page)\` |
| **\`@RequestBody\`** | \`org.springframework.web.bind.annotation\` | \`PARAMETER\` | Deserializes HTTP request JSON payload into Java record / POJO. | \`public Order create(@Valid @RequestBody OrderRequest req)\` |
| **\`@RestControllerAdvice\`** | \`org.springframework.web.bind.annotation\` | \`TYPE\` | Centralized global exception handler combining advice and response body. | \`@RestControllerAdvice public class GlobalExceptionHandler\` |
| **\`@ExceptionHandler\`** | \`org.springframework.web.bind.annotation\` | \`METHOD\` | Handles declared exception types thrown across all REST controllers. | \`@ExceptionHandler(OrderNotFoundException.class) public ProblemDetail handle()\``;

    const regex = /### The Master Tri-Part Classification Matrix[\s\S]*?(?=---)/;
    if (!regex.test(content)) {
      throw new Error('Target section not found in topic-99');
    }
    return content.replace(regex, newSection + '\n\n');
  }
);

console.log('ALL ANNOTATION TOPICS SUCCESSFULLY ENRICHED!');
