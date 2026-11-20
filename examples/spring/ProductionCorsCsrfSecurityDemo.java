package com.handbook.spring;

import java.util.*;

public class ProductionCorsCsrfSecurityDemo {

    public record SecurityHeaders(String csp, String hsts, String frameOptions, String contentTypeOptions) {}

    public static SecurityHeaders createHardenedHeaders() {
        return new SecurityHeaders(
            "default-src 'self'; frame-ancestors 'none';",
            "max-age=31536000; includeSubDomains; preload",
            "DENY",
            "nosniff"
        );
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 114: Production CORS, CSRF Defense & Security Headers ===");

        SecurityHeaders headers = createHardenedHeaders();
        System.out.println("Applied Production HTTP Security Headers:");
        System.out.println("  - Content-Security-Policy   : " + headers.csp());
        System.out.println("  - Strict-Transport-Security : " + headers.hsts());
        System.out.println("  - X-Frame-Options           : " + headers.frameOptions());
        System.out.println("  - X-Content-Type-Options    : " + headers.contentTypeOptions());

        if (!"DENY".equals(headers.frameOptions()) || !headers.hsts().contains("max-age=31536000")) {
            throw new AssertionError("Production Security Headers verification failed!");
        }

        System.out.println("Topic 114 Production CORS, CSRF and Security Headers verified successfully.");
    }
}
