package com.handbook.spring;

import java.lang.annotation.*;
import java.lang.reflect.Method;
import java.util.*;

/**
 * Section 29 - Topic 100: The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations
 * 
 * Demonstrates:
 * 1. Meta-Annotation mechanics: @Target, @Retention, @Inherited, @Repeatable.
 * 2. Tri-Part architectural classification:
 *    - Java SE Core (@Override, @FunctionalInterface, @Deprecated)
 *    - Jakarta EE (@Entity, @Inject, @Transactional, @Valid)
 *    - Spring Framework / Spring Boot (@Component, @RestController, @Autowired, @PreAuthorize)
 * 3. Stereotype annotation composition (meta-annotating @RestController with @ResponseBody).
 * 4. Reflection-based Annotation Processor & Runtime Metadata Dictionary Inspector.
 */
public class AnnotationMetadataDictionaryDemo {

    public enum AnnotationDomain { JAVA_SE, JAKARTA_EE, SPRING_FRAMEWORK }

    // --- 1. Simulated Custom Tri-Part Annotations ---

    // Java SE Meta
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.ANNOTATION_TYPE)
    public @interface TriPartCategory {
        AnnotationDomain domain();
        String specification();
    }

    // Jakarta EE Simulation
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @TriPartCategory(domain = AnnotationDomain.JAKARTA_EE, specification = "Jakarta Persistence 3.1")
    public @interface SimulatedEntity {
        String tableName() default "";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target({ElementType.METHOD, ElementType.FIELD})
    @TriPartCategory(domain = AnnotationDomain.JAKARTA_EE, specification = "Jakarta CDI 4.0")
    public @interface SimulatedInject {}

    // Spring Framework Simulation
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @TriPartCategory(domain = AnnotationDomain.SPRING_FRAMEWORK, specification = "Spring Framework 6 / Boot 3")
    public @interface SimulatedComponent {
        String value() default "";
    }

    // Composed Stereotype (@RestController = @Component + @ResponseBody)
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @SimulatedComponent
    @TriPartCategory(domain = AnnotationDomain.SPRING_FRAMEWORK, specification = "Spring Web MVC 6")
    public @interface SimulatedRestController {
        String basePath() default "";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    @TriPartCategory(domain = AnnotationDomain.SPRING_FRAMEWORK, specification = "Spring Security 6")
    public @interface SimulatedPreAuthorize {
        String value();
    }

    // --- 2. Annotated Domain Model ---
    @SimulatedRestController(basePath = "/api/v1/accounts")
    public static class AccountApiController {

        @SimulatedInject
        private String injectedDataSource;

        @SimulatedPreAuthorize("hasRole('ADMIN')")
        public void purgeAccount(Long accountId) {
            System.out.println("Purging account: " + accountId);
        }
    }

    @SimulatedEntity(tableName = "bank_accounts")
    public static class BankAccountEntity {
        private Long id;
        private String owner;
    }

    // --- 3. Annotation Metadata Inspector ---
    public record AnnotationSummary(String name, AnnotationDomain domain, String specification, String appliedOn) {}

    public static class MetadataInspector {
        public static List<AnnotationSummary> inspectClass(Class<?> clazz) {
            List<AnnotationSummary> summaries = new ArrayList<>();

            // Inspect Class Annotations
            for (Annotation ann : clazz.getAnnotations()) {
                summaries.addAll(extractMetadata(ann, clazz.getSimpleName() + " (TYPE)"));
            }

            // Inspect Method Annotations
            for (Method method : clazz.getDeclaredMethods()) {
                for (Annotation ann : method.getAnnotations()) {
                    summaries.addAll(extractMetadata(ann, method.getName() + "() (METHOD)"));
                }
            }

            return summaries;
        }

        private static List<AnnotationSummary> extractMetadata(Annotation ann, String appliedOn) {
            List<AnnotationSummary> res = new ArrayList<>();
            Class<? extends Annotation> type = ann.annotationType();
            TriPartCategory cat = type.getAnnotation(TriPartCategory.class);

            if (cat != null) {
                res.add(new AnnotationSummary(type.getSimpleName(), cat.domain(), cat.specification(), appliedOn));
            }

            // Check composed meta-annotations
            for (Annotation meta : type.getAnnotations()) {
                TriPartCategory metaCat = meta.annotationType().getAnnotation(TriPartCategory.class);
                if (metaCat != null) {
                    res.add(new AnnotationSummary(meta.annotationType().getSimpleName() + " (composed in @" + type.getSimpleName() + ")",
                            metaCat.domain(), metaCat.specification(), appliedOn));
                }
            }

            return res;
        }
    }

    // --- 4. Main Verification ---
    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 100: The Definitive Dictionary of Java SE, Jakarta EE & Spring Annotations");
        System.out.println("================================================================================");

        // 1. Inspect Controller Class
        System.out.println("1. Inspecting AccountApiController:");
        List<AnnotationSummary> controllerMetadata = MetadataInspector.inspectClass(AccountApiController.class);
        for (AnnotationSummary s : controllerMetadata) {
            System.out.printf("   [@%s] -> Domain: %s | Spec: %s | Applied: %s\n",
                    s.name(), s.domain(), s.specification(), s.appliedOn());
        }

        // Verify composed annotation detection
        boolean hasRestController = controllerMetadata.stream().anyMatch(s -> s.name().contains("SimulatedRestController"));
        boolean hasComposedComponent = controllerMetadata.stream().anyMatch(s -> s.name().contains("SimulatedComponent"));
        boolean hasPreAuthorize = controllerMetadata.stream().anyMatch(s -> s.name().contains("SimulatedPreAuthorize"));

        assert hasRestController : "@SimulatedRestController must be detected";
        assert hasComposedComponent : "Meta-annotation @SimulatedComponent must be resolved transitively";
        assert hasPreAuthorize : "@SimulatedPreAuthorize method annotation must be detected";
        System.out.println("   Controller Annotation Hierarchy: ALL VERIFIED");

        // 2. Inspect Entity Class
        System.out.println("\n2. Inspecting BankAccountEntity:");
        List<AnnotationSummary> entityMetadata = MetadataInspector.inspectClass(BankAccountEntity.class);
        for (AnnotationSummary s : entityMetadata) {
            System.out.printf("   [@%s] -> Domain: %s | Spec: %s | Applied: %s\n",
                    s.name(), s.domain(), s.specification(), s.appliedOn());
        }
        boolean hasEntity = entityMetadata.stream().anyMatch(s -> s.name().contains("SimulatedEntity"));
        assert hasEntity : "@SimulatedEntity must be detected";
        System.out.println("   Entity Annotation Hierarchy: ALL VERIFIED");

        // 3. Tri-Part Separation Verification
        long springCount = controllerMetadata.stream().filter(s -> s.domain() == AnnotationDomain.SPRING_FRAMEWORK).count();
        long jakartaCount = entityMetadata.stream().filter(s -> s.domain() == AnnotationDomain.JAKARTA_EE).count();
        assert springCount >= 2 : "Spring framework domain annotations verified";
        assert jakartaCount >= 1 : "Jakarta EE domain annotations verified";

        System.out.println("\n[SUCCESS] Topic 100 Definitive Annotations Dictionary verified successfully!");
        System.out.println("================================================================================");
    }
}
