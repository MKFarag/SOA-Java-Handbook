package com.handbook.enterprise;

import java.lang.annotation.*;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

// Bean Validation Meta-annotations emulation for standalone reference execution
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface NotNull { String message() default "must not be null"; }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface Size { int min() default 0; int max() default Integer.MAX_VALUE; String message() default "size out of bounds"; }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface Min { long value(); String message() default "must be greater than or equal to minimum"; }

public class BeanValidationDemo {

    // 1. Validated DTO
    public static class UserRegistrationForm {
        @NotNull(message = "Username cannot be null")
        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        private String username;

        @NotNull(message = "Age cannot be null")
        @Min(value = 18, message = "User must be at least 18 years old")
        private Integer age;

        public UserRegistrationForm(String username, Integer age) {
            this.username = username;
            this.age = age;
        }

        public String getUsername() { return username; }
        public Integer getAge() { return age; }
    }

    // 2. Simulated Validator Engine
    public record Violation(String field, String message) {}

    public static class MockValidator {
        public List<Violation> validate(Object target) {
            List<Violation> violations = new ArrayList<>();
            Class<?> clazz = target.getClass();

            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true);
                try {
                    Object value = field.get(target);

                    // Validate @NotNull
                    if (field.isAnnotationPresent(NotNull.class)) {
                        if (value == null) {
                            NotNull notNull = field.getAnnotation(NotNull.class);
                            violations.add(new Violation(field.getName(), notNull.message()));
                            continue; // skip other checks if null
                        }
                    }

                    // Validate @Size for Strings
                    if (field.isAnnotationPresent(Size.class) && value instanceof String s) {
                        Size size = field.getAnnotation(Size.class);
                        if (s.length() < size.min() || s.length() > size.max()) {
                            violations.add(new Violation(field.getName(), size.message()));
                        }
                    }

                    // Validate @Min for Integers
                    if (field.isAnnotationPresent(Min.class) && value instanceof Number n) {
                        Min min = field.getAnnotation(Min.class);
                        if (n.longValue() < min.value()) {
                            violations.add(new Violation(field.getName(), min.message()));
                        }
                    }

                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            }

            return violations;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Jakarta Bean Validation Architecture ===");

        MockValidator validator = new MockValidator();

        // 1. Valid instance
        UserRegistrationForm validUser = new UserRegistrationForm("johndoe", 25);
        List<Violation> validViolations = validator.validate(validUser);
        System.out.println("Valid user violations count: " + validViolations.size());
        assert validViolations.isEmpty();

        // 2. Invalid instance (too short username, under-age)
        UserRegistrationForm invalidUser = new UserRegistrationForm("al", 16);
        List<Violation> invalidViolations = validator.validate(invalidUser);
        System.out.println("Invalid user caught violations (" + invalidViolations.size() + "):");
        for (Violation v : invalidViolations) {
            System.out.println("  - Field '" + v.field() + "': " + v.message());
        }

        assert invalidViolations.size() == 2;
        assert invalidViolations.stream().anyMatch(v -> v.field().equals("username"));
        assert invalidViolations.stream().anyMatch(v -> v.field().equals("age"));

        System.out.println("Declarative constraint inspection verified successfully.");
    }
}
