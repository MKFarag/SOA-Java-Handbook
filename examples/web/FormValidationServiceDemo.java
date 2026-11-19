package com.handbook.web;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class FormValidationServiceDemo {

    public record FormSubmission(String email, String role, int experienceYears, String filename, byte[] content) {}

    public static class FormValidator {
        private static final Pattern EMAIL_REGEX = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
        private static final List<String> ALLOWED_ROLES = List.of("DEVELOPER", "ARCHITECT", "OPERATOR");
        private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

        public List<String> validate(FormSubmission submission) {
            List<String> errors = new ArrayList<>();

            if (submission.email() == null || !EMAIL_REGEX.matcher(submission.email()).matches()) {
                errors.add("Invalid email address format.");
            }
            if (submission.role() == null || !ALLOWED_ROLES.contains(submission.role().toUpperCase())) {
                errors.add("Invalid role specified. Allowed: " + ALLOWED_ROLES);
            }
            if (submission.experienceYears() < 0 || submission.experienceYears() > 50) {
                errors.add("Experience years must be between 0 and 50.");
            }
            if (submission.filename() != null && submission.filename().contains("..")) {
                errors.add("Directory traversal vulnerability detected in filename.");
            }
            if (submission.content() != null && submission.content().length > MAX_FILE_SIZE) {
                errors.add("Uploaded payload exceeds maximum size limit.");
            }

            return errors;
        }

        public byte[] streamUpload(InputStream in) throws Exception {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            int read;
            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            return out.toByteArray();
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Form Handling & Multipart Validation Demo ===");

        FormValidator validator = new FormValidator();

        // 1. Valid candidate submission
        byte[] fileBytes = "public class Solution { System.out.println(1); }".getBytes(StandardCharsets.UTF_8);
        FormSubmission validForm = new FormSubmission("dev@company.com", "DEVELOPER", 5, "Solution.java", fileBytes);
        List<String> validErrors = validator.validate(validForm);
        System.out.println("Valid submission errors: " + validErrors.size());
        assert validErrors.isEmpty();

        // 2. Invalid candidate with attack payload
        FormSubmission invalidForm = new FormSubmission("bad-email", "HACKER", -2, "../../../etc/passwd", new byte[100]);
        List<String> invalidErrors = validator.validate(invalidForm);
        System.out.println("Invalid submission caught errors (" + invalidErrors.size() + "):");
        for (String err : invalidErrors) {
            System.out.println("  - " + err);
        }
        assert invalidErrors.size() >= 4;

        // 3. Stream upload simulation
        byte[] streamed = validator.streamUpload(new ByteArrayInputStream(fileBytes));
        assert streamed.length == fileBytes.length;
        System.out.println("Multipart streaming verification successful: " + streamed.length + " bytes processed.");
    }
}
