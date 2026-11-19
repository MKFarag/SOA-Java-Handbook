package com.handbook.spring;

import java.time.Instant;
import java.util.Objects;

/**
 * Section 30 - Topic 101: Boilerplate Elimination: Project Lombok & MapStruct
 * 
 * Demonstrates:
 * 1. Lombok compile-time code synthesis simulation: @Getter, @Setter, @Builder, @ToString.
 * 2. MapStruct compile-time type-safe mapper generation vs runtime reflection.
 * 3. Bidirectional mapping between JPA Entity and REST API DTO with field transformations.
 * 4. Zero runtime reflection overhead and null safety checks.
 */
public class LombokMapStructDemo {

    // --- 1. Entity with Simulated Lombok @Builder & @Data ---
    public static class CustomerEntity {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private double accountBalance;
        private Instant registeredAt;

        // Private constructor for Builder pattern
        private CustomerEntity() {}

        public Long getId() { return id; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getEmail() { return email; }
        public double getAccountBalance() { return accountBalance; }
        public Instant getRegisteredAt() { return registeredAt; }

        @Override
        public String toString() {
            return String.format("CustomerEntity(id=%d, name='%s %s', email='%s', balance=$%.2f)",
                    id, firstName, lastName, email, accountBalance);
        }

        // Simulated Lombok Builder
        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private final CustomerEntity instance = new CustomerEntity();
            public Builder id(Long id) { instance.id = id; return this; }
            public Builder firstName(String f) { instance.firstName = f; return this; }
            public Builder lastName(String l) { instance.lastName = l; return this; }
            public Builder email(String e) { instance.email = e; return this; }
            public Builder accountBalance(double b) { instance.accountBalance = b; return this; }
            public Builder registeredAt(Instant r) { instance.registeredAt = r; return this; }
            public CustomerEntity build() { return instance; }
        }
    }

    // --- 2. Immutable REST DTO ---
    public record CustomerDto(Long id, String fullName, String contactEmail, double balance) {}

    // --- 3. Simulated MapStruct Generated Mapper ---
    public interface CustomerMapper {
        CustomerDto toDto(CustomerEntity entity);
        CustomerEntity toEntity(CustomerDto dto);
    }

    public static class CustomerMapperImpl implements CustomerMapper {
        @Override
        public CustomerDto toDto(CustomerEntity entity) {
            if (entity == null) return null;
            String fullName = (entity.getFirstName() != null ? entity.getFirstName() : "") +
                    (entity.getLastName() != null ? " " + entity.getLastName() : "");
            return new CustomerDto(
                    entity.getId(),
                    fullName.trim(),
                    entity.getEmail(),
                    entity.getAccountBalance()
            );
        }

        @Override
        public CustomerEntity toEntity(CustomerDto dto) {
            if (dto == null) return null;
            String[] names = dto.fullName() != null ? dto.fullName().split(" ", 2) : new String[]{"", ""};
            String fName = names.length > 0 ? names[0] : "";
            String lName = names.length > 1 ? names[1] : "";

            return CustomerEntity.builder()
                    .id(dto.id())
                    .firstName(fName)
                    .lastName(lName)
                    .email(dto.contactEmail())
                    .accountBalance(dto.balance())
                    .registeredAt(Instant.now())
                    .build();
        }
    }

    // --- 4. Main Verification ---
    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 101: Boilerplate Elimination: Project Lombok & MapStruct");
        System.out.println("================================================================================");

        // 1. Build Entity using Lombok-style Builder
        CustomerEntity entity = CustomerEntity.builder()
                .id(501L)
                .firstName("Ada")
                .lastName("Lovelace")
                .email("ada@analytical-engine.org")
                .accountBalance(145000.50)
                .registeredAt(Instant.now())
                .build();

        System.out.println("1. Instantiated Entity via Lombok Builder pattern:");
        System.out.println("   " + entity);
        assert entity.getId() == 501L;
        assert entity.getFirstName().equals("Ada");

        // 2. Map Entity to DTO using MapStruct Compile-Time Mapper
        CustomerMapper mapper = new CustomerMapperImpl();
        CustomerDto dto = mapper.toDto(entity);

        System.out.println("\n2. Transformed Entity to DTO via MapStruct:");
        System.out.printf("   CustomerDto[id=%d, fullName='%s', contactEmail='%s', balance=$%.2f]\n",
                dto.id(), dto.fullName(), dto.contactEmail(), dto.balance());
        assert dto.fullName().equals("Ada Lovelace");
        assert dto.contactEmail().equals("ada@analytical-engine.org");

        // 3. Reverse Mapping DTO to Entity
        CustomerEntity mappedBack = mapper.toEntity(dto);
        System.out.println("\n3. Reverse Mapped DTO back to Entity:");
        System.out.println("   " + mappedBack);
        assert mappedBack.getFirstName().equals("Ada");
        assert mappedBack.getLastName().equals("Lovelace");

        System.out.println("\n[SUCCESS] Topic 101 Lombok & MapStruct code generation verified successfully!");
        System.out.println("================================================================================");
    }
}
