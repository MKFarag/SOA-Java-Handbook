package com.handbook.spring;

import java.net.URI;
import java.time.Instant;
import java.util.*;

/**
 * Section 26 - Topic 94: Centralized Global Exception Handling via @RestControllerAdvice (RFC 7807)
 * Demonstrates centralized exception interception, custom domain exceptions, and RFC 7807 ProblemDetail formatting.
 */
public class GlobalExceptionAdviceDemo {

    // --- RFC 7807 ProblemDetail Specification Implementation (Spring 6.x+) ---
    public static class ProblemDetail {
        private URI type;
        private String title;
        private int status;
        private String detail;
        private URI instance;
        private final Map<String, Object> properties = new LinkedHashMap<>();

        public static ProblemDetail forStatusAndDetail(int status, String detail) {
            ProblemDetail pd = new ProblemDetail();
            pd.status = status;
            pd.detail = detail;
            pd.type = URI.create("about:blank");
            return pd;
        }

        public URI getType() { return type; }
        public void setType(URI type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }
        public URI getInstance() { return instance; }
        public void setInstance(URI instance) { this.instance = instance; }
        public Map<String, Object> getProperties() { return properties; }
        public void setProperty(String name, Object value) { properties.put(name, value); }
    }

    // --- Domain Exceptions ---
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String resource, String id) {
            super(String.format("%s with identifier '%s' was not found", resource, id));
        }
    }

    public static class BusinessConflictException extends RuntimeException {
        public BusinessConflictException(String message) {
            super(message);
        }
    }

    public static class ValidationException extends RuntimeException {
        private final List<Map<String, String>> fieldErrors;
        public ValidationException(List<Map<String, String>> fieldErrors) {
            super("Request validation failed");
            this.fieldErrors = fieldErrors;
        }
        public List<Map<String, String>> getFieldErrors() { return fieldErrors; }
    }

    // --- Global Exception Handler (Simulating @RestControllerAdvice) ---
    public static class GlobalExceptionHandlerAdvice {

        public ProblemDetail handleNotFound(ResourceNotFoundException ex, String path) {
            ProblemDetail problem = ProblemDetail.forStatusAndDetail(404, ex.getMessage());
            problem.setType(URI.create("https://api.handbook.io/errors/not-found"));
            problem.setTitle("Resource Not Found");
            problem.setInstance(URI.create(path));
            problem.setProperty("timestamp", Instant.now().toString());
            problem.setProperty("traceId", UUID.randomUUID().toString());
            return problem;
        }

        public ProblemDetail handleConflict(BusinessConflictException ex, String path) {
            ProblemDetail problem = ProblemDetail.forStatusAndDetail(409, ex.getMessage());
            problem.setType(URI.create("https://api.handbook.io/errors/conflict"));
            problem.setTitle("Business Rule Conflict");
            problem.setInstance(URI.create(path));
            problem.setProperty("timestamp", Instant.now().toString());
            return problem;
        }

        public ProblemDetail handleValidation(ValidationException ex, String path) {
            ProblemDetail problem = ProblemDetail.forStatusAndDetail(400, ex.getMessage());
            problem.setType(URI.create("https://api.handbook.io/errors/bad-request"));
            problem.setTitle("Bad Request Validation Error");
            problem.setInstance(URI.create(path));
            problem.setProperty("timestamp", Instant.now().toString());
            problem.setProperty("invalidFields", ex.getFieldErrors());
            return problem;
        }

        public ProblemDetail handleGeneralError(Exception ex, String path) {
            // Never leak raw exception stack traces in production
            ProblemDetail problem = ProblemDetail.forStatusAndDetail(500, "An unexpected internal server error occurred.");
            problem.setType(URI.create("https://api.handbook.io/errors/internal-error"));
            problem.setTitle("Internal Server Error");
            problem.setInstance(URI.create(path));
            problem.setProperty("timestamp", Instant.now().toString());
            problem.setProperty("errorRef", "ERR-" + System.currentTimeMillis());
            return problem;
        }
    }

    // --- Main Verification Flow ---
    public static void main(String[] args) {
        System.out.println("==========================================================================");
        System.out.println(" Spring 6.x: Global Exception Handling & RFC 7807 ProblemDetail Demo      ");
        System.out.println("==========================================================================\n");

        GlobalExceptionHandlerAdvice advice = new GlobalExceptionHandlerAdvice();

        // 1. Test 404 ResourceNotFoundException
        System.out.println("--- 1. Handling ResourceNotFoundException ---");
        ResourceNotFoundException notFoundEx = new ResourceNotFoundException("Customer", "CUST-999");
        ProblemDetail pd404 = advice.handleNotFound(notFoundEx, "/api/v1/customers/CUST-999");
        System.out.printf("Status: %d, Title: %s, Detail: %s%n", pd404.getStatus(), pd404.getTitle(), pd404.getDetail());
        assert pd404.getStatus() == 404;
        assert pd404.getDetail().contains("CUST-999");
        assert pd404.getProperties().containsKey("traceId");

        // 2. Test 409 BusinessConflictException
        System.out.println("\n--- 2. Handling BusinessConflictException ---");
        BusinessConflictException conflictEx = new BusinessConflictException("Account email 'elena@corp.io' is already registered");
        ProblemDetail pd409 = advice.handleConflict(conflictEx, "/api/v1/customers");
        System.out.printf("Status: %d, Title: %s, Detail: %s%n", pd409.getStatus(), pd409.getTitle(), pd409.getDetail());
        assert pd409.getStatus() == 409;
        assert pd409.getDetail().contains("already registered");

        // 3. Test 400 ValidationException with Field Errors
        System.out.println("\n--- 3. Handling ValidationException (RFC 7807 with Extensions) ---");
        List<Map<String, String>> fieldErrors = List.of(
                Map.of("field", "contactEmail", "error", "must be a valid email"),
                Map.of("field", "taxId", "error", "tax ID is mandatory")
        );
        ValidationException valEx = new ValidationException(fieldErrors);
        ProblemDetail pd400 = advice.handleValidation(valEx, "/api/v1/customers");
        System.out.printf("Status: %d, Title: %s, Invalid Fields: %s%n",
                pd400.getStatus(), pd400.getTitle(), pd400.getProperties().get("invalidFields"));
        assert pd400.getStatus() == 400;
        assert pd400.getProperties().containsKey("invalidFields");

        // 4. Test 500 General Exception (Security sanitization)
        System.out.println("\n--- 4. Handling Internal Server Exception (Sanitized) ---");
        Exception internalEx = new NullPointerException("Database connection timeout at line 42");
        ProblemDetail pd500 = advice.handleGeneralError(internalEx, "/api/v1/orders");
        System.out.printf("Status: %d, Sanitized Detail: %s, ErrorRef: %s%n",
                pd500.getStatus(), pd500.getDetail(), pd500.getProperties().get("errorRef"));
        assert pd500.getStatus() == 500;
        assert !pd500.getDetail().contains("NullPointerException"); // Never expose raw exception in payload

        System.out.println("\nSUCCESS: Centralized @RestControllerAdvice and RFC 7807 ProblemDetail verified successfully!");
    }
}
