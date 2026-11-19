---
id: 100
title: "The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations"
sectionId: 29
part: "Part 3: Spring Boot & The Modern Production Ecosystem"
order: 100
summary: "The definitive, cross-referenced architectural dictionary categorizing and comparing core annotations across Java SE Core, Jakarta EE enterprise specifications, and the Spring Boot production ecosystem."
keyTakeaways:
  - "Annotations provide declarative metadata attached to classes, methods, fields, and parameters, processed either at compile-time (via annotation processors) or at runtime (via reflection and dynamic proxies)."
  - "Meta-annotations (`@Target`, `@Retention`, `@Documented`, `@Inherited`, `@Repeatable`) dictate how and where annotations can be declared and when they are retained."
  - "Spring Framework heavily leverages composed meta-annotations: for example, `@RestController` is a meta-annotation composed of `@Controller` and `@ResponseBody`."
  - "Understanding the semantic differences between equivalent annotations across standards (e.g. `@Inject` vs `@Autowired`, `@Entity` vs `@Table`, `@Transactional` in Jakarta vs Spring) is essential for senior systems architecture."
---

# The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations

Annotations represent the primary declarative programming paradigm in modern enterprise Java. They replace verbose XML deployment descriptors, automate boilerplate code generation, and drive dependency injection containers, persistence frameworks, and security layers.

---

## 1. Meta-Annotations Foundation

Meta-annotations are annotations that annotate other annotations, controlling their lifecycle, retention, and valid declaration targets:

| Meta-Annotation | Target Element | Purpose |
| :--- | :--- | :--- |
| `@Retention` | `ANNOTATION_TYPE` | Specifies retention policy: `SOURCE` (discarded by compiler), `CLASS` (stored in `.class`, ignored by JVM), or `RUNTIME` (retained in JVM heap for reflection). |
| `@Target` | `ANNOTATION_TYPE` | Specifies Java language elements: `TYPE`, `METHOD`, `FIELD`, `PARAMETER`, `CONSTRUCTOR`, `RECORD_COMPONENT`. |
| `@Inherited` | `ANNOTATION_TYPE` | Indicates that child subclasses automatically inherit the annotation from parent classes. |
| `@Repeatable` | `ANNOTATION_TYPE` | Allows declaring the same annotation multiple times on a single target element. |

---

## 2. Tri-Part Architectural Classification Matrix

```
                    +------------------------------------+
                    |        Java Annotations Map        |
                    +------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
+------------------+         +------------------+         +------------------+
|   Java SE Core   |         |    Jakarta EE    |         |   Spring Boot    |
| (Compiler/JVM)   |         | (Standards Spec) |         | (Production Ecosystem) |
+------------------+         +------------------+         +------------------+
| @Override        |         | @Entity, @Table  |         | @SpringBootApp   |
| @Deprecated      |         | @Id, @Column     |         | @Component       |
| @SuppressWarnings|         | @Inject, @Named  |         | @Service, @Repo  |
| @FunctionalIntf  |         | @Valid, @NotNull |         | @RestController  |
| @SafeVarargs     |         | @Path, @GET      |         | @Autowired       |
+------------------+         +------------------+         +------------------+
```

---

## 3. Comprehensive Domain Dictionary

### Domain 1: Java SE Core Annotations (JDK standard `java.lang`)
- **`@Override`**: Informs the compiler that the annotated method must override a declaration in a superclass or interface.
- **`@Deprecated`**: Marks program elements as obsolete, emitting compiler warnings.
- **`@SuppressWarnings`**: Silences specific compiler warnings (e.g. `unchecked`, `rawtypes`, `deprecation`).
- **`@FunctionalInterface`**: Enforces that an interface contains exactly one abstract method, guaranteeing compatibility with lambda expressions.
- **`@SafeVarargs`**: Asserts that a method body does not perform unsafe operations on its varargs parameter array.

### Domain 2: Jakarta EE Standards Annotations (`jakarta.*`)
- **JPA Persistence (`jakarta.persistence.*`)**:
  - `@Entity`: Marks a class as a mapped relational database entity.
  - `@Table`: Configures the database table name, schema, indexes, and unique constraints.
  - `@Id`: Designates the primary key attribute.
  - `@GeneratedValue`: Configures primary key generation strategies (`IDENTITY`, `SEQUENCE`, `UUID`).
  - `@Column`: Specifies column name, nullability, length, and precision.
  - `@OneToMany`, `@ManyToOne`, `@ManyToMany`: Defines relational entity associations.
  - `@JoinColumn`: Specifies the foreign key column mapping.
- **Dependency Injection & CDI (`jakarta.inject.*`, `jakarta.enterprise.context.*`)**:
  - `@Inject`: Identifies injectable constructors, methods, and fields.
  - `@Named`: Qualifies injection candidates by string name.
  - `@ApplicationScoped`, `@RequestScoped`, `@SessionScoped`: Defines CDI bean lifecycle scopes.
- **Bean Validation (`jakarta.validation.constraints.*`)**:
  - `@Valid`: Cascades recursive validation on child objects.
  - `@NotNull`, `@NotBlank`, `@NotEmpty`: Null and empty checks on fields.
  - `@Size`, `@Min`, `@Max`, `@Pattern`, `@Email`: Boundary and format validations.

### Domain 3: Spring Framework & Spring Boot Annotations (`org.springframework.*`)
- **Core Container & Stereotypes**:
  - `@SpringBootApplication`: Meta-annotation combining `@SpringBootConfiguration`, `@EnableAutoConfiguration`, and `@ComponentScan`.
  - `@Component`: Generic stereotype marker for Spring-managed beans.
  - `@Service`: Specializes `@Component` for business logic and transactional services.
  - `@Repository`: Specializes `@Component` with automated `DataAccessException` translation.
  - `@Controller`: Stereotype for Spring MVC presentation controllers.
  - `@RestController`: Composed meta-annotation (`@Controller` + `@ResponseBody`) serializing returns to JSON.
  - `@Configuration`: Marks classes declaring `@Bean` factory methods.
  - `@Bean`: Declares an explicit factory method producing a bean managed by the Spring IoC container.
- **Dependency Injection**:
  - `@Autowired`: Declares dependency injection on constructors, setters, or fields.
  - `@Qualifier`: Disambiguates between multiple candidate beans of the same type.
  - `@Value`: Injects externalized configuration properties or evaluates SpEL expressions.
  - `@Lazy`: Defers bean instantiation until first requested.
- **Web MVC & HTTP Semantics**:
  - `@RequestMapping`: Base URI path routing.
  - `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: Specialized HTTP verb handlers.
  - `@PathVariable`: Extracts URI path parameters (`/items/{id}`).
  - `@RequestParam`: Extracts HTTP query string parameters (`?page=0&size=10`).
  - `@RequestBody`: Deserializes JSON payload into a Java DTO.
  - `@RestControllerAdvice`: Centralized exception interceptor.
  - `@ExceptionHandler`: Binds specific exception types to HTTP error handler methods.
- **Spring Data & Security**:
  - `@Transactional`: Declarative ACID transaction boundary with propagation and rollback rules.
  - `@EntityGraph`: Eager fetch specification preventing N+1 query proliferation.
  - `@Query`: Custom JPQL or native SQL declaration on repository methods.
  - `@PreAuthorize`: Evaluates method-level SpEL security rules before invocation.

---

## 4. Architectural Equivalents: Jakarta EE vs Spring Boot

| Capability | Jakarta EE Standard | Spring Boot Equivalent | Architectural Guidance |
| :--- | :--- | :--- | :--- |
| **Dependency Injection** | `@Inject` | `@Autowired` | Prefer constructor injection; both work identically in modern Spring Boot. |
| **Component Stereotype** | `@Named` | `@Component` | Use `@Component` in Spring ecosystems for fine-grained scanning. |
| **Transaction Boundary** | `jakarta.transaction.@Transactional` | `org.springframework.transaction.annotation.@Transactional` | Always use Spring's `@Transactional` in Spring Boot for richer rollback rules and `readOnly` support. |
| **REST Controller** | `@Path` (JAX-RS) | `@RestController` (Spring MVC) | In Spring Boot apps, `@RestController` offers native Jackson and ProblemDetail support. |
| **Validation** | `jakarta.validation.@Valid` | `jakarta.validation.@Valid` | Spring Boot 3 uses standard Jakarta Bean Validation directly via `spring-boot-starter-validation`. |

---

## 5. Runnable Verification & Code Walkthrough

The executable architecture demo `examples/spring/AnnotationMetadataDictionaryDemo.java` implements:
- Custom `@TriPartCategory` meta-annotation tracking architectural domain and specification origin.
- Composed stereotype `@SimulatedRestController` verifying transitive `@SimulatedComponent` inheritance.
- Reflection-based `MetadataInspector` inspecting classes, methods, and field annotations at runtime.

Compile and run the verified test:
```bash
javac -d examples/web/classes examples/spring/AnnotationMetadataDictionaryDemo.java
java -ea -cp examples/web/classes com.handbook.spring.AnnotationMetadataDictionaryDemo
```
