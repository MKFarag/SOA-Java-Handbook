package com.handbook.spring;

import java.lang.annotation.*;
import java.util.*;
import java.util.regex.Pattern;

/**
 * Section 26 - Topic 93: Request Validation with Bean Validation & Custom Constraint Validators
 * Demonstrates standard constraint validation (@NotBlank, @Email, @Positive),
 * custom constraint annotations (@ValidTaxId), and validation error payload generation.
 */
public class RequestValidationEngineDemo {

    // --- Simulated Standard Validation Annotations ---
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface NotBlank {
        String message() default "must not be blank";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface Email {
        String message() default "must be a well-formed email address";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface Positive {
        String message() default "must be greater than 0";
    }

    // --- Custom Enterprise Constraint Annotation ---
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface ValidTaxId {
        String message() default "invalid enterprise Tax ID format (expected: TAX-XXXX-9999)";
    }

    // --- Custom Validator Implementation ---
    public static class TaxIdValidator {
        private static final Pattern TAX_ID_PATTERN = Pattern.compile("^TAX-[A-Z]{4}-\\d{4}$");

        public static boolean isValid(String value) {
            if (value == null || value.isBlank()) return false;
            return TAX_ID_PATTERN.matcher(value).matches();
        }
    }

    // --- Request DTO with Standard & Custom Constraints ---
    public record CorporateAccountRegistrationRequest(
            @NotBlank String companyName,
            @NotBlank @Email String contactEmail,
            @ValidTaxId String corporateTaxId,
            @Positive double initialDepositUsd
    ) {}

    // --- Field Validation Error Structure ---
    public record FieldValidationError(String field, Object rejectedValue, String message) {}

    // --- Validation Dispatcher Simulation ---
    public static class ValidationEngine {
        private static final Pattern SIMPLE_EMAIL = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

        public static List<FieldValidationError> validate(CorporateAccountRegistrationRequest req) {
            List<FieldValidationError> errors = new ArrayList<>();

            // 1. Validate companyName (@NotBlank)
            if (req.companyName() == null || req.companyName().trim().isEmpty()) {
                errors.add(new FieldValidationError("companyName", req.companyName(), "must not be blank"));
            }

            // 2. Validate contactEmail (@NotBlank, @Email)
            if (req.contactEmail() == null || req.contactEmail().trim().isEmpty()) {
                errors.add(new FieldValidationError("contactEmail", req.contactEmail(), "must not be blank"));
            } else if (!SIMPLE_EMAIL.matcher(req.contactEmail()).matches()) {
                errors.add(new FieldValidationError("contactEmail", req.contactEmail(), "must be a well-formed email address"));
            }

            // 3. Validate corporateTaxId (@ValidTaxId)
            if (!TaxIdValidator.isValid(req.corporateTaxId())) {
                errors.add(new FieldValidationError("corporateTaxId", req.corporateTaxId(), "invalid enterprise Tax ID format (expected: TAX-XXXX-9999)"));
            }

            // 4. Validate initialDepositUsd (@Positive)
            if (req.initialDepositUsd() <= 0.0) {
                errors.add(new FieldValidationError("initialDepositUsd", req.initialDepositUsd(), "must be greater than 0"));
            }

            return errors;
        }
    }

    // --- Main Verification Flow ---
    public static void main(String[] args) {
        System.out.println("==========================================================================");
        System.out.println(" Spring Web MVC: Request Validation Engine & Custom Constraints Demo      ");
        System.out.println("==========================================================================\n");

        // Test 1: Valid Corporate Registration Request
        System.out.println("--- 1. Testing Valid Corporate Registration Payload ---");
        CorporateAccountRegistrationRequest validReq = new CorporateAccountRegistrationRequest(
                "Apex Global Logistics Inc.",
                "billing@apexlogistics.com",
                "TAX-CORP-8842",
                50000.00
        );
        List<FieldValidationError> validErrors = ValidationEngine.validate(validReq);
        System.out.println("Validation Error Count: " + validErrors.size());
        assert validErrors.isEmpty() : "Valid payload should produce zero errors!";
        System.out.println("Result: VALID [Passed]\n");

        // Test 2: Invalid Corporate Registration Payload (Multiple Errors)
        System.out.println("--- 2. Testing Invalid Payload (Triggering Multiple Constraints) ---");
        CorporateAccountRegistrationRequest invalidReq = new CorporateAccountRegistrationRequest(
                "",                             // Blank companyName
                "not-an-email",                 // Bad email
                "BAD-TAX-99",                   // Violates @ValidTaxId pattern
                -150.00                         // Non-positive deposit
        );
        List<FieldValidationError> errors = ValidationEngine.validate(invalidReq);
        System.out.println("Validation Error Count: " + errors.size());
        assert errors.size() == 4 : "Expected 4 validation errors!";

        for (FieldValidationError err : errors) {
            System.out.printf("  [Field Error] field='%s' rejectedValue='%s' message='%s'%n",
                    err.field(), err.rejectedValue(), err.message());
        }

        // Verify custom Tax ID constraint validation
        assert errors.stream().anyMatch(e -> e.field().equals("corporateTaxId"));
        assert errors.stream().anyMatch(e -> e.field().equals("contactEmail"));

        System.out.println("\nSUCCESS: Bean Validation and custom constraint validator mechanics verified successfully!");
    }
}
