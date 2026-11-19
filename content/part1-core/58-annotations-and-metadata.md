---
id: topic-58
slug: annotations-and-metadata
topicNumber: 58
title: Annotations & Metadata
part: 'Part 1: Java Core'
sectionNumber: 15
sectionTitle: 'Reflection, Annotations & JPMS'
versionBadge: Java 5+ / Enhanced Java 8 & 9
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master declarative metadata with custom annotations, meta-annotations
  (@Retention, @Target), and runtime reflection processing.
prerequisites:
  - 'Topic 16: Classes, Objects & Memory Layout'
  - 'Topic 23: Interfaces & Modern Interface Evolution'
---
# Annotations and Metadata

### 1. What It Is and Why It Exists
Before Java 5, associating metadata with program elements required separate external XML configuration files, naming conventions (like prefixing test methods with `"test..."`), or marker interfaces (`Serializable`, `Cloneable`). These approaches had severe drawbacks:
- XML files diverged from refactored code, leading to silent runtime breakage.
- Naming conventions offered zero compiler validation or typo checking.
- Marker interfaces could only be applied to whole classes, not methods, parameters, or fields.

Java 5 introduced **Annotations** (`@interface`), a form of declarative syntactic metadata that can be attached to packages, classes, methods, fields, parameters, and local variables. Annotations do not directly alter program execution semantics on their own; instead, they are consumed by:
1. **The Java Compiler**: Detecting errors and suppressing warnings (`@Override`, `@SuppressWarnings`, `@Deprecated`).
2. **Build-Time & Compile-Time Tools**: Generating source code or boilerplate (Annotation Processors, Lombok).
3. **Runtime Frameworks**: Reading metadata via reflection to configure dependency injection, transaction management, REST routing, and object-relational mapping (`@Autowired`, `@Transactional`, `@Entity`).

**Real-World Analogy:**
Imagine shipping boxes in a distribution warehouse. The contents inside the box are the Java bytecode and business data. An **Annotation** is a bright adhesive sticker placed on the exterior of the box: `"FRAGILE"`, `"KEEP REFRIGERATED"`, or `"EXPRESS OVERNIGHT"`. The sticker itself does not alter the physical contents of the box, but the robotic conveyor belts and handlers (runtime frameworks) read the sticker to decide how the box should be routed, cooled, or protected.

---

### 2. Prerequisites
- **Classes and Objects (Topic 16)**: Understanding class declarations, fields, and methods.
- **Interfaces (Topic 23)**: Understanding that `@interface` is a specialized form of interface extending `java.lang.annotation.Annotation`.

---

### 3. Syntax Breakdown

#### 3.1 Declaring Custom Annotations
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface AuditLog {
    String action();             // Required attribute
    int severity() default 1;    // Optional attribute with default value
}
```
- `@interface`: Keyword declaring an annotation type.
- **Meta-Annotations** (Annotations applied to other annotations):
  - `@Retention`: Specifies how long annotations are retained:
    - `SOURCE`: Discarded during compilation (not stored in `.class` file; e.g., `@Override`).
    - `CLASS`: Recorded in `.class` file but not loaded into JVM runtime Metaspace (default).
    - `RUNTIME`: Retained in `.class` file and loaded into Metaspace, readable via Reflection at runtime.
  - `@Target`: Restricts which program elements can bear the annotation: `TYPE`, `METHOD`, `FIELD`, `PARAMETER`, `CONSTRUCTOR`, `LOCAL_VARIABLE`, `TYPE_USE` (Java 8+).
  - `@Documented`: Indicates that the annotation should appear in generated Javadoc documentation.
  - `@Inherited`: Causes subclasses to automatically inherit the annotation from parent classes.
  - `@Repeatable`: Allows applying the same annotation multiple times to a single declaration.

---

### 4. Code Examples

#### Example 1: Runtime Annotation Definition & Reflection Processing
The following example defines a custom `@AuditLog` runtime annotation and processes annotated methods dynamically via reflection:

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Method;

public class AnnotationProcessingDemo {
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    @interface AuditLog {
        String action();
        int severity() default 1;
    }

    static class BillingService {
        @AuditLog(action = "PROCESS_CREDIT_CARD", severity = 3)
        public void charge(String card, double amount) {
            System.out.printf("  Executing charge: card=****%s, amount=$%.2f%n",
                    card.substring(card.length() - 4), amount);
        }

        public void ping() {
            System.out.println("  Ping service active.");
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Runtime Annotation Reflection Processing ===");
        BillingService service = new BillingService();
        Class<?> clazz = service.getClass();

        for (Method method : clazz.getDeclaredMethods()) {
            if (method.isAnnotationPresent(AuditLog.class)) {
                AuditLog annotation = method.getAnnotation(AuditLog.class);
                System.out.printf("Intercepted Annotated Method [%s]: action='%s', severity=%d%n",
                        method.getName(), annotation.action(), annotation.severity());
                method.invoke(service, "4111222233334444", 249.99);
            }
        }
        System.out.println("Annotation processing completed successfully.");
    }
}
```

**Expected Output:**
```text
=== Runtime Annotation Reflection Processing ===
Intercepted Annotated Method [charge]: action='PROCESS_CREDIT_CARD', severity=3
  Executing charge: card=****4444, amount=$249.99
Annotation processing completed successfully.
```

#### Example 2: Realistic Application — Declarative ORM Validation Engine
In enterprise backends (like Jakarta Bean Validation / Hibernate), declarative validation annotations enforce data integrity across domain models:

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class OrmEntityValidatorApp {
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    @interface NotEmpty {
        String message() default "Field must not be empty";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    @interface Range {
        double min();
        double max();
        String message() default "Value out of valid range";
    }

    static class ProductEntity {
        @NotEmpty(message = "Product SKU cannot be blank")
        private final String sku;

        @Range(min = 0.01, max = 10000.0, message = "Price must be between $0.01 and $10,000.00")
        private final double price;

        ProductEntity(String sku, double price) {
            this.sku = sku;
            this.price = price;
        }
    }

    static class ValidationEngine {
        public static List<String> validate(Object entity) throws Exception {
            List<String> violations = new ArrayList<>();
            Class<?> clazz = entity.getClass();

            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true);
                Object val = field.get(entity);

                if (field.isAnnotationPresent(NotEmpty.class) && (val == null || val.toString().trim().isEmpty())) {
                    violations.add(field.getAnnotation(NotEmpty.class).message());
                }

                if (field.isAnnotationPresent(Range.class) && val instanceof Number num) {
                    Range range = field.getAnnotation(Range.class);
                    double d = num.doubleValue();
                    if (d < range.min() || d > range.max()) {
                        violations.add(range.message() + " (Actual: " + d + ")");
                    }
                }
            }
            return violations;
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Starting ORM Entity Validation Engine...");

        ProductEntity validProduct = new ProductEntity("PROD-882", 149.50);
        ProductEntity invalidProduct = new ProductEntity("", -12.00);

        List<String> errors1 = ValidationEngine.validate(validProduct);
        System.out.println("Valid Product Violations:   " + errors1.size());

        List<String> errors2 = ValidationEngine.validate(invalidProduct);
        System.out.println("Invalid Product Violations: " + errors2.size());
        for (String err : errors2) {
            System.out.println("  - Violation: " + err);
        }
        System.out.println("Entity validation completed successfully.");
    }
}
```

**Expected Output:**
```text
Starting ORM Entity Validation Engine...
Valid Product Violations:   0
Invalid Product Violations: 2
  - Violation: Product SKU cannot be blank
  - Violation: Price must be between $0.01 and $10,000.00 (Actual: -12.0)
Entity validation completed successfully.
```

---

### 5. Step-by-Step Execution Trace
1. When `ProductEntity` is compiled, `javac` stores the `@NotEmpty` and `@Range` attribute values inside the `RuntimeVisibleAnnotations` table of the `.class` bytecode.
2. In `ValidationEngine.validate()`, `clazz.getDeclaredFields()` inspects the fields of `ProductEntity`.
3. `field.isAnnotationPresent(NotEmpty.class)` queries the JVM Metaspace annotation cache.
4. If present, `field.getAnnotation(NotEmpty.class)` returns a dynamic synthetic proxy implementing the `@NotEmpty` annotation interface.
5. The validator evaluates the field value against the annotation parameters, aggregating violations into the result list.

---

### 6. Common Mistakes & Error Diagnosis

#### Pitfall 1: Forgetting `@Retention(RetentionPolicy.RUNTIME)`
```java
// BUG: Omitting @Retention defaults to RetentionPolicy.CLASS
@Target(ElementType.METHOD)
public @interface MyHook {}
```
- **Consequence**: `method.isAnnotationPresent(MyHook.class)` returns `false` at runtime! The annotation was stripped from runtime memory.
- **Fix**: Always specify `@Retention(RetentionPolicy.RUNTIME)` if you plan to inspect it via reflection.

#### Pitfall 2: Attempting to Use Complex Objects as Annotation Attributes
```java
// COMPILATION ERROR:
public @interface Config {
    Date created(); // Invalid attribute type!
}
```
- **Consequence**: Compilation error. Annotation attribute types are strictly restricted to: primitives, `String`, `Class<?>`, `enum`, other annotations, and 1D arrays of these types.

---

### 7. Best Practices & When NOT to Use
- **Do**: Always provide sensible `default` values for optional annotation attributes to minimize boilerplate at use sites.
- **Do**: Use standard built-in annotations (`@Override`, `@Deprecated(since = "...", forRemoval = true)`) to catch refactoring mistakes at compile time.
- **Don't**: Do not over-annotate classes until code becomes unreadable "annotation soup". If behavior changes drastically based on dynamic runtime conditions, consider explicit code or functional strategy patterns.

---

### 8. Version Notes
- **Java 5**: Annotations and Meta-Annotations (`@Retention`, `@Target`, `@Documented`, `@Inherited`) introduced.
- **Java 7**: `@SafeVarargs` introduced.
- **Java 8**: Type annotations (`ElementType.TYPE_USE`, `TYPE_PARAMETER`) and `@Repeatable` introduced.
- **Java 9**: Added `since` and `forRemoval` attributes to `@Deprecated`.

---

### 9. Summary Cheat Sheet

| Meta-Annotation | Value Options | Purpose |
| :--- | :--- | :--- |
| `@Retention` | `SOURCE`, `CLASS`, `RUNTIME` | Lifetime of the annotation |
| `@Target` | `TYPE`, `METHOD`, `FIELD`, `PARAMETER`, `TYPE_USE` | Program elements where annotation is legal |
| `@Documented` | Marker (no arguments) | Include in Javadoc |
| `@Inherited` | Marker (no arguments) | Inherited by subclasses |
| `@Repeatable` | Container class | Permits multiple uses on same target |

---

### 10. Exercises with Hidden Solutions

#### Exercise 1: Custom Role-Based Security Annotation
Define a `@RolesAllowed` runtime annotation that accepts an array of strings representing authorized roles (e.g., `@RolesAllowed({"ADMIN", "MANAGER"})`).

<details>
<summary>View Solution</summary>

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface RolesAllowed {
    String[] value();
}
```
</details>

#### Exercise 2: Check Annotation Presence
Write a method `boolean isSecured(Method m)` that returns `true` if a method has `@RolesAllowed` present and `false` otherwise.

<details>
<summary>View Solution</summary>

```java
import java.lang.reflect.Method;

public class SecurityInspector {
    public static boolean isSecured(Method m) {
        return m.isAnnotationPresent(RolesAllowed.class);
    }
}
```
</details>

---

### 11. Sources & Official References
- [Oracle Java Documentation — Annotations Guide](https://docs.oracle.com/javase/tutorial/java/annotations/)
- [Java Language Specification — §9.6 Annotation Types](https://docs.oracle.com/javase/specs/jls/se21/html/jls-9.html#jls-9.6)
- [Java SE 21 Specification — java.lang.annotation Package](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/annotation/package-summary.html)
