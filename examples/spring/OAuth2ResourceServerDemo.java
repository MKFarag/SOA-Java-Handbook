package com.handbook.spring;

import java.util.*;

public class OAuth2ResourceServerDemo {

    public record JwtClaims(String sub, String iss, List<String> roles) {}

    public static class ResourceServerSecurityGuard {
        private final String expectedIssuer;

        public ResourceServerSecurityGuard(String expectedIssuer) {
            this.expectedIssuer = expectedIssuer;
        }

        public boolean validateToken(JwtClaims token, String requiredRole) {
            if (!expectedIssuer.equals(token.iss())) {
                System.out.println("  -> [Security Error] Token Issuer Mismatch! Expected: " + expectedIssuer);
                return false;
            }
            return token.roles().contains(requiredRole);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 112: Spring Security OAuth2 Resource Server & JWT Validation ===");

        String keycloakIssuer = "https://auth.enterprise.com/realms/production-corp";
        ResourceServerSecurityGuard guard = new ResourceServerSecurityGuard(keycloakIssuer);

        JwtClaims validAdminToken = new JwtClaims("sarah_connor", keycloakIssuer, List.of("ROLE_USER", "ROLE_ADMIN"));
        JwtClaims rogueToken = new JwtClaims("mallory", "https://untrusted-auth.darknet.org", List.of("ROLE_ADMIN"));

        System.out.println("1. Validating genuine Keycloak Token for Admin resource: " + 
            guard.validateToken(validAdminToken, "ROLE_ADMIN"));
        System.out.println("2. Validating rogue Token from unauthorized issuer: " + 
            guard.validateToken(rogueToken, "ROLE_ADMIN"));

        if (!guard.validateToken(validAdminToken, "ROLE_ADMIN") || guard.validateToken(rogueToken, "ROLE_ADMIN")) {
            throw new AssertionError("OAuth2 token validation rules failed!");
        }

        System.out.println("Topic 112 OAuth2 Resource Server verified successfully.");
    }
}
