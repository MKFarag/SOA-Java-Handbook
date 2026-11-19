package com.handbook.enterprise;

import java.lang.annotation.*;
import java.lang.reflect.Field;
import java.util.*;

// JPA Meta-annotations emulation for standalone reference execution
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface Entity { String name() default ""; }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface Table { String name(); }

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface Id {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface Column { String name() default ""; boolean nullable() default true; }

public class JpaEntityDemo {

    // 1. Jakarta Persistence Entity Definition
    @Entity
    @Table(name = "customers")
    public static class Customer {
        @Id
        private Long id;

        @Column(name = "full_name", nullable = false)
        private String name;

        @Column(name = "email_address")
        private String email;

        @Column(name = "is_active")
        private boolean active;

        public Customer() {}

        public Customer(Long id, String name, String email, boolean active) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.active = active;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public boolean isActive() { return active; }

        @Override
        public String toString() {
            return "Customer[id=" + id + ", name='" + name + "', email='" + email + "', active=" + active + "]";
        }
    }

    // 2. Simulated EntityManager managing Persistence Context (First-Level Cache)
    public static class MockEntityManager {
        private final Map<Long, Customer> persistenceContext = new HashMap<>();

        public void persist(Customer customer) {
            if (customer.getId() == null) {
                throw new IllegalArgumentException("Entity ID cannot be null upon persist");
            }
            persistenceContext.put(customer.getId(), customer);
            System.out.println("[EntityManager] Persisted entity into First-Level Cache: " + customer);
        }

        public Customer find(Class<Customer> entityClass, Long primaryKey) {
            System.out.println("[EntityManager] Looking up " + entityClass.getSimpleName() + " with PK=" + primaryKey);
            return persistenceContext.get(primaryKey);
        }

        public List<Customer> createQuery(String jpql) {
            System.out.println("[EntityManager] Executing JPQL: " + jpql);
            List<Customer> results = new ArrayList<>();
            for (Customer c : persistenceContext.values()) {
                if (c.isActive()) results.add(c);
            }
            return results;
        }

        public void remove(Customer customer) {
            persistenceContext.remove(customer.getId());
            System.out.println("[EntityManager] Removed entity from Persistence Context: " + customer.getId());
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Jakarta Persistence (JPA) & ORM Mechanics ===");

        MockEntityManager em = new MockEntityManager();

        // 1. Verify Entity annotations via reflection
        Class<Customer> clazz = Customer.class;
        assert clazz.isAnnotationPresent(Entity.class) : "Must be marked with @Entity";
        assert clazz.isAnnotationPresent(Table.class) : "Must be marked with @Table";

        // 2. Persist entities into managed persistence context
        Customer c1 = new Customer(1L, "Alice Hamilton", "alice@example.com", true);
        Customer c2 = new Customer(2L, "Bob Vance", "bob@vance.com", false);
        Customer c3 = new Customer(3L, "Carol Danvers", "carol@marvel.com", true);

        em.persist(c1);
        em.persist(c2);
        em.persist(c3);

        // 3. Find by Primary Key (First-level cache hit)
        Customer fetched = em.find(Customer.class, 1L);
        assert fetched != null && fetched.getName().equals("Alice Hamilton");

        // 4. Query with JPQL simulation
        List<Customer> activeCustomers = em.createQuery("SELECT c FROM Customer c WHERE c.active = true");
        System.out.println("Active customers returned: " + activeCustomers.size());
        assert activeCustomers.size() == 2;

        // 5. Remove entity
        em.remove(c2);
        assert em.find(Customer.class, 2L) == null;

        System.out.println("JPA EntityManager lifecycle and entity mapping verified successfully.");
    }
}
