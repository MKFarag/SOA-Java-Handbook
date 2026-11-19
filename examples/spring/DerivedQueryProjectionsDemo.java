package com.handbook.spring;

import java.lang.annotation.*;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Topic 96: Automated Derived Query Methods, Dynamic Projections & JPQL @Query
 * 
 * Demonstrates:
 * 1. Derived query method naming conventions: findBy..., countBy..., existsBy...
 * 2. Closed Interface-based projections (selective column extraction).
 * 3. Open Interface-based projections using expression evaluation.
 * 4. Record-based DTO projections (constructor expressions).
 * 5. Annotation-driven JPQL @Query simulation with named parameters.
 */
public class DerivedQueryProjectionsDemo {

    // --- Annotations ---
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    public @interface Query {
        String value();
        boolean nativeQuery() default false;
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.PARAMETER)
    public @interface Param {
        String value();
    }

    // --- Domain Entity ---
    public static class Employee {
        private final Long id;
        private final String firstName;
        private final String lastName;
        private final String email;
        private final String department;
        private final double salary;
        private final LocalDate hireDate;

        public Employee(Long id, String firstName, String lastName, String email, String department, double salary, LocalDate hireDate) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.department = department;
            this.salary = salary;
            this.hireDate = hireDate;
        }

        public Long getId() { return id; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
        public String getDepartment() { return department; }
        public double getSalary() { return salary; }
        public LocalDate getHireDate() { return hireDate; }
    }

    // --- 1. Closed Projection Interface ---
    public interface EmployeeNameAndDept {
        String getFirstName();
        String getLastName();
        String getDepartment();
    }

    // --- 2. Open Projection Interface ---
    public interface EmployeeSalarySummary {
        String getEmail();
        double getSalary();
        default String getCompensationTier() {
            return getSalary() > 100000 ? "TIER-1 (Executive)" : "TIER-2 (Standard)";
        }
    }

    // --- 3. DTO Record Projection ---
    public record EmployeeDto(String fullName, String department, double salary) {}

    // --- Repository Interface ---
    public interface EmployeeRepository {
        List<Employee> findByDepartment(String department);
        long countByDepartment(String department);
        boolean existsByEmail(String email);
        List<Employee> findBySalaryGreaterThanEqual(double minSalary);

        // Dynamic Interface-based Closed Projection
        List<EmployeeNameAndDept> findProjectionsByDepartment(String department);

        // Open Projection
        Optional<EmployeeSalarySummary> findSummaryByEmail(String email);

        // Custom JPQL Query Simulation
        @Query("SELECT new com.handbook.spring.DerivedQueryProjectionsDemo$EmployeeDto(e.firstName || ' ' || e.lastName, e.department, e.salary) FROM Employee e WHERE e.salary >= :minSalary ORDER BY e.salary DESC")
        List<EmployeeDto> findHighEarnersDto(@Param("minSalary") double minSalary);
    }

    // --- Dynamic Repository Factory ---
    public static class EmployeeRepositoryProxyFactory {
        public static EmployeeRepository create(List<Employee> dataset) {
            Map<Long, Employee> store = new ConcurrentHashMap<>();
            dataset.forEach(e -> store.put(e.getId(), e));

            return (EmployeeRepository) Proxy.newProxyInstance(
                    EmployeeRepository.class.getClassLoader(),
                    new Class<?>[]{EmployeeRepository.class},
                    (proxy, method, args) -> {
                        String name = method.getName();

                        // Check @Query annotation
                        if (method.isAnnotationPresent(Query.class)) {
                            Query q = method.getAnnotation(Query.class);
                            if (name.equals("findHighEarnersDto")) {
                                double minSalary = (Double) args[0];
                                return store.values().stream()
                                        .filter(e -> e.getSalary() >= minSalary)
                                        .sorted((e1, e2) -> Double.compare(e2.getSalary(), e1.getSalary()))
                                        .map(e -> new EmployeeDto(e.getFirstName() + " " + e.getLastName(), e.getDepartment(), e.getSalary()))
                                        .collect(Collectors.toList());
                            }
                        }

                        // Method derivation
                        if (name.equals("findByDepartment")) {
                            String dept = (String) args[0];
                            return store.values().stream()
                                    .filter(e -> e.getDepartment().equalsIgnoreCase(dept))
                                    .collect(Collectors.toList());
                        }

                        if (name.equals("countByDepartment")) {
                            String dept = (String) args[0];
                            return store.values().stream()
                                    .filter(e -> e.getDepartment().equalsIgnoreCase(dept))
                                    .count();
                        }

                        if (name.equals("existsByEmail")) {
                            String email = (String) args[0];
                            return store.values().stream()
                                    .anyMatch(e -> e.getEmail().equalsIgnoreCase(email));
                        }

                        if (name.equals("findBySalaryGreaterThanEqual")) {
                            double min = (Double) args[0];
                            return store.values().stream()
                                    .filter(e -> e.getSalary() >= min)
                                    .collect(Collectors.toList());
                        }

                        if (name.equals("findProjectionsByDepartment")) {
                            String dept = (String) args[0];
                            return store.values().stream()
                                    .filter(e -> e.getDepartment().equalsIgnoreCase(dept))
                                    .map(e -> createInterfaceProjection(EmployeeNameAndDept.class, e))
                                    .collect(Collectors.toList());
                        }

                        if (name.equals("findSummaryByEmail")) {
                            String email = (String) args[0];
                            return store.values().stream()
                                    .filter(e -> e.getEmail().equalsIgnoreCase(email))
                                    .findFirst()
                                    .map(e -> createInterfaceProjection(EmployeeSalarySummary.class, e));
                        }

                        throw new UnsupportedOperationException("Method not recognized: " + name);
                    }
            );
        }

        @SuppressWarnings("unchecked")
        private static <P> P createInterfaceProjection(Class<P> projectionInterface, Employee target) {
            return (P) Proxy.newProxyInstance(
                    projectionInterface.getClassLoader(),
                    new Class<?>[]{projectionInterface},
                    (p, m, a) -> {
                        if (m.isDefault()) {
                            return InvocationHandler.invokeDefault(p, m, a);
                        }
                        return switch (m.getName()) {
                            case "getFirstName" -> target.getFirstName();
                            case "getLastName" -> target.getLastName();
                            case "getDepartment" -> target.getDepartment();
                            case "getEmail" -> target.getEmail();
                            case "getSalary" -> target.getSalary();
                            default -> throw new UnsupportedOperationException("Unknown projection method: " + m.getName());
                        };
                    }
            );
        }
    }

    // --- Main Execution ---
    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 96: Automated Derived Query Methods, Dynamic Projections & JPQL @Query");
        System.out.println("================================================================================");

        List<Employee> data = List.of(
                new Employee(1L, "Ada", "Lovelace", "ada@arch.io", "Engineering", 145000, LocalDate.of(2021, 1, 15)),
                new Employee(2L, "Alan", "Turing", "alan@arch.io", "Engineering", 160000, LocalDate.of(2020, 6, 1)),
                new Employee(3L, "Grace", "Hopper", "grace@arch.io", "Engineering", 155000, LocalDate.of(2019, 3, 10)),
                new Employee(4L, "Margaret", "Hamilton", "margaret@arch.io", "Aerospace", 175000, LocalDate.of(2018, 11, 20)),
                new Employee(5L, "Claude", "Shannon", "claude@arch.io", "Research", 95000, LocalDate.of(2022, 5, 4))
        );

        EmployeeRepository repo = EmployeeRepositoryProxyFactory.create(data);

        // 1. Derived Queries
        long engCount = repo.countByDepartment("Engineering");
        System.out.println("1. Derived countByDepartment('Engineering'): " + engCount);
        assert engCount == 3 : "Engineering count should be 3";

        boolean exists = repo.existsByEmail("ada@arch.io");
        System.out.println("   Derived existsByEmail('ada@arch.io'): " + exists);
        assert exists : "ada@arch.io must exist";

        // 2. Closed Interface-Based Projections
        System.out.println("\n2. Closed Interface Projection findProjectionsByDepartment('Engineering'):");
        List<EmployeeNameAndDept> projList = repo.findProjectionsByDepartment("Engineering");
        assert projList.size() == 3 : "Projection count should be 3";
        for (EmployeeNameAndDept p : projList) {
            System.out.printf("   - %s %s [Dept: %s]\n", p.getFirstName(), p.getLastName(), p.getDepartment());
        }

        // 3. Open Interface Projection with default business logic
        System.out.println("\n3. Open Interface Projection findSummaryByEmail('claude@arch.io'):");
        EmployeeSalarySummary summary = repo.findSummaryByEmail("claude@arch.io").orElseThrow();
        System.out.printf("   Email: %s | Salary: $%.2f | Tier: %s\n",
                summary.getEmail(), summary.getSalary(), summary.getCompensationTier());
        assert summary.getCompensationTier().contains("TIER-2") : "Claude should be TIER-2";

        // 4. Custom JPQL @Query with Record DTO Projection
        System.out.println("\n4. JPQL @Query with DTO Record Projection findHighEarnersDto(150,000):");
        List<EmployeeDto> highEarners = repo.findHighEarnersDto(150000.0);
        assert highEarners.size() == 3 : "Must find exactly 3 employees >= 150000";
        for (EmployeeDto dto : highEarners) {
            System.out.printf("   - %s | %s | $%.2f\n", dto.fullName(), dto.department(), dto.salary());
        }

        System.out.println("\n[SUCCESS] Topic 96 Derived Queries and Projections demo executed successfully!");
        System.out.println("================================================================================");
    }
}
