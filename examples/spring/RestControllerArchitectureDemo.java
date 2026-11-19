package com.handbook.spring;

import java.net.URI;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Section 26 - Topic 92: Production REST Controller Architecture with Spring Web MVC
 * Demonstrates HTTP method mappings (@GetMapping, @PostMapping, @PutMapping, @DeleteMapping),
 * PathVariable & RequestParam resolution, and ResponseEntity<T> status code semantics.
 */
public class RestControllerArchitectureDemo {

    // --- Simulated Spring Web MVC Core Types ---
    public record ResponseEntity<T>(int statusCode, Map<String, String> headers, T body) {
        public static <T> ResponseEntity<T> ok(T body) {
            return new ResponseEntity<>(200, Map.of("Content-Type", "application/json"), body);
        }
        public static <T> ResponseEntity<T> created(URI location, T body) {
            return new ResponseEntity<>(201, Map.of("Content-Type", "application/json", "Location", location.toString()), body);
        }
        public static <T> ResponseEntity<T> noContent() {
            return new ResponseEntity<>(204, Map.of(), null);
        }
        public static <T> ResponseEntity<T> notFound() {
            return new ResponseEntity<>(404, Map.of("Content-Type", "application/problem+json"), null);
        }
    }

    // --- Domain DTOs & Resources ---
    public record CustomerResponse(String id, String fullName, String email, String tier, Instant createdAt) {}
    public record CreateCustomerRequest(String fullName, String email, String tier) {}
    public record UpdateCustomerRequest(String fullName, String tier) {}

    // --- Spring REST Controller Implementation ---
    public static class CustomerRestController {
        private final Map<String, CustomerResponse> customerDb = new ConcurrentHashMap<>();

        public CustomerRestController() {
            // Seed initial data
            String id = "CUST-001";
            customerDb.put(id, new CustomerResponse(id, "Elena Rostova", "elena@corp.io", "ENTERPRISE", Instant.now()));
        }

        // GET /api/v1/customers?tier={tier}
        public ResponseEntity<List<CustomerResponse>> listCustomers(String tierFilter) {
            List<CustomerResponse> result = customerDb.values().stream()
                    .filter(c -> tierFilter == null || c.tier().equalsIgnoreCase(tierFilter))
                    .sorted(Comparator.comparing(CustomerResponse::fullName))
                    .toList();
            return ResponseEntity.ok(result);
        }

        // GET /api/v1/customers/{id}
        public ResponseEntity<CustomerResponse> getCustomerById(String id) {
            CustomerResponse customer = customerDb.get(id);
            if (customer == null) {
                return ResponseEntity.notFound();
            }
            return ResponseEntity.ok(customer);
        }

        // POST /api/v1/customers
        public ResponseEntity<CustomerResponse> createCustomer(CreateCustomerRequest request) {
            String generatedId = "CUST-" + (customerDb.size() + 1);
            CustomerResponse newCustomer = new CustomerResponse(
                    generatedId,
                    request.fullName(),
                    request.email(),
                    request.tier() != null ? request.tier() : "STANDARD",
                    Instant.now()
            );
            customerDb.put(generatedId, newCustomer);
            URI location = URI.create("/api/v1/customers/" + generatedId);
            return ResponseEntity.created(location, newCustomer);
        }

        // PUT /api/v1/customers/{id}
        public ResponseEntity<CustomerResponse> updateCustomer(String id, UpdateCustomerRequest request) {
            CustomerResponse existing = customerDb.get(id);
            if (existing == null) {
                return ResponseEntity.notFound();
            }
            CustomerResponse updated = new CustomerResponse(
                    existing.id(),
                    request.fullName() != null ? request.fullName() : existing.fullName(),
                    existing.email(),
                    request.tier() != null ? request.tier() : existing.tier(),
                    existing.createdAt()
            );
            customerDb.put(id, updated);
            return ResponseEntity.ok(updated);
        }

        // DELETE /api/v1/customers/{id}
        public ResponseEntity<Void> deleteCustomer(String id) {
            if (!customerDb.containsKey(id)) {
                return ResponseEntity.notFound();
            }
            customerDb.remove(id);
            return ResponseEntity.noContent();
        }
    }

    // --- Main Verification Flow ---
    public static void main(String[] args) {
        System.out.println("==========================================================================");
        System.out.println(" Spring Web MVC: REST Controller Architecture & HTTP Semantics Demo       ");
        System.out.println("==========================================================================\n");

        CustomerRestController controller = new CustomerRestController();

        // 1. GET By ID (200 OK)
        System.out.println("--- 1. GET /api/v1/customers/CUST-001 ---");
        ResponseEntity<CustomerResponse> getResp = controller.getCustomerById("CUST-001");
        System.out.printf("Status: %d, Body: %s%n", getResp.statusCode(), getResp.body());
        assert getResp.statusCode() == 200;
        assert "Elena Rostova".equals(getResp.body().fullName());

        // 2. POST Create (201 Created)
        System.out.println("\n--- 2. POST /api/v1/customers ---");
        CreateCustomerRequest createReq = new CreateCustomerRequest("Marcus Vance", "marcus@vance.net", "VIP");
        ResponseEntity<CustomerResponse> postResp = controller.createCustomer(createReq);
        System.out.printf("Status: %d, Location Header: %s%n", postResp.statusCode(), postResp.headers().get("Location"));
        assert postResp.statusCode() == 201;
        assert postResp.headers().containsKey("Location");
        String newId = postResp.body().id();

        // 3. GET Filter by QueryParam (200 OK)
        System.out.println("\n--- 3. GET /api/v1/customers?tier=VIP ---");
        ResponseEntity<List<CustomerResponse>> listResp = controller.listCustomers("VIP");
        System.out.printf("Status: %d, Count: %d%n", listResp.statusCode(), listResp.body().size());
        assert listResp.body().size() == 1;
        assert listResp.body().get(0).id().equals(newId);

        // 4. PUT Update (200 OK)
        System.out.println("\n--- 4. PUT /api/v1/customers/" + newId + " ---");
        ResponseEntity<CustomerResponse> putResp = controller.updateCustomer(newId, new UpdateCustomerRequest("Marcus Vance Jr.", "ENTERPRISE"));
        System.out.printf("Status: %d, Updated Tier: %s%n", putResp.statusCode(), putResp.body().tier());
        assert putResp.statusCode() == 200;
        assert "ENTERPRISE".equals(putResp.body().tier());

        // 5. DELETE (204 No Content)
        System.out.println("\n--- 5. DELETE /api/v1/customers/" + newId + " ---");
        ResponseEntity<Void> deleteResp = controller.deleteCustomer(newId);
        System.out.printf("Status: %d (No Content)%n", deleteResp.statusCode());
        assert deleteResp.statusCode() == 204;

        // 6. GET After Delete (404 Not Found)
        System.out.println("\n--- 6. GET /api/v1/customers/" + newId + " (After Deletion) ---");
        ResponseEntity<CustomerResponse> missingResp = controller.getCustomerById(newId);
        System.out.printf("Status: %d (Expected Not Found)%n", missingResp.statusCode());
        assert missingResp.statusCode() == 404;

        System.out.println("\nSUCCESS: Spring Web MVC REST controller HTTP semantics verified successfully!");
    }
}
