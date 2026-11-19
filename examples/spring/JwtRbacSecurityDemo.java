package com.handbook.spring;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

/**
 * Section 28 - Topic 99: Stateless REST Security with JWT & Method-Level Role Authorization
 * 
 * Demonstrates:
 * 1. Cryptographic HMAC-SHA256 JWT Token generation and verification.
 * 2. OncePerRequestFilter simulation parsing Bearer tokens from the Authorization header.
 * 3. SecurityContextHolder thread-local persistence.
 * 4. Method-level security interceptor simulating @PreAuthorize("hasRole('ADMIN')").
 * 5. Role-Based Access Control (RBAC) enforcement and HTTP 403 Forbidden rejection.
 */
public class JwtRbacSecurityDemo {

    // --- 1. JWT Service Implementation (HMAC-SHA256) ---
    public static class JwtService {
        private final byte[] secretKey;

        public JwtService(String secret) {
            this.secretKey = secret.getBytes(StandardCharsets.UTF_8);
        }

        public String generateToken(String username, List<String> roles, long ttlSeconds) {
            String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
            long now = Instant.now().getEpochSecond();
            long exp = now + ttlSeconds;
            String payloadJson = String.format("{\"sub\":\"%s\",\"roles\":\"%s\",\"iat\":%d,\"exp\":%d}",
                    username, String.join(",", roles), now, exp);

            String encodedHeader = Base64.getUrlEncoder().withoutPadding().encodeToString(headerJson.getBytes(StandardCharsets.UTF_8));
            String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));
            String signature = sign(encodedHeader + "." + encodedPayload);

            return encodedHeader + "." + encodedPayload + "." + signature;
        }

        public boolean validateToken(String token) {
            try {
                String[] parts = token.split("\\.");
                if (parts.length != 3) return false;
                String expectedSig = sign(parts[0] + "." + parts[1]);
                if (!expectedSig.equals(parts[2])) return false;

                // Check expiration
                String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
                long exp = extractExp(payloadJson);
                return Instant.now().getEpochSecond() <= exp;
            } catch (Exception e) {
                return false;
            }
        }

        public String extractUsername(String token) {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            return extractField(payload, "sub");
        }

        public List<String> extractRoles(String token) {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            String rolesStr = extractField(payload, "roles");
            return Arrays.asList(rolesStr.split(","));
        }

        private String sign(String data) {
            try {
                Mac mac = Mac.getInstance("HmacSHA256");
                mac.init(new SecretKeySpec(secretKey, "HmacSHA256"));
                byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
                return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
            } catch (Exception e) {
                throw new RuntimeException("HMAC failure", e);
            }
        }

        private String extractField(String json, String field) {
            String marker = "\"" + field + "\":\"";
            int start = json.indexOf(marker);
            if (start == -1) return "";
            start += marker.length();
            int end = json.indexOf("\"", start);
            return json.substring(start, end);
        }

        private long extractExp(String json) {
            String marker = "\"exp\":";
            int start = json.indexOf(marker);
            if (start == -1) return 0;
            start += marker.length();
            int end = json.indexOf("}", start);
            return Long.parseLong(json.substring(start, end));
        }
    }

    // --- 2. Security Context & Authentication ---
    public record UserPrincipal(String username, List<String> roles) {}

    public static class SecurityContextHolder {
        private static final ThreadLocal<UserPrincipal> context = new ThreadLocal<>();

        public static void setPrincipal(UserPrincipal principal) {
            context.set(principal);
        }

        public static UserPrincipal getPrincipal() {
            return context.get();
        }

        public static void clear() {
            context.remove();
        }
    }

    // --- 3. Filter Simulation (OncePerRequestFilter) ---
    public static class JwtAuthenticationFilter {
        private final JwtService jwtService;

        public JwtAuthenticationFilter(JwtService jwtService) {
            this.jwtService = jwtService;
        }

        public boolean doFilter(Map<String, String> headers) {
            String authHeader = headers.get("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtService.validateToken(token)) {
                    String username = jwtService.extractUsername(token);
                    List<String> roles = jwtService.extractRoles(token);
                    SecurityContextHolder.setPrincipal(new UserPrincipal(username, roles));
                    return true;
                }
            }
            SecurityContextHolder.clear();
            return false;
        }
    }

    // --- 4. Method-Level Security Guard (@PreAuthorize Simulation) ---
    public static class AdminService {
        public String viewPublicFeed() {
            return "[PUBLIC FEED] Welcome to the system";
        }

        public String performUserAction() {
            UserPrincipal principal = SecurityContextHolder.getPrincipal();
            if (principal == null || (!principal.roles().contains("ROLE_USER") && !principal.roles().contains("ROLE_ADMIN"))) {
                throw new SecurityException("403 Forbidden: ROLE_USER or ROLE_ADMIN required");
            }
            return "[USER ACTION] Processed successfully for " + principal.username();
        }

        public String performSuperAdminAction() {
            UserPrincipal principal = SecurityContextHolder.getPrincipal();
            if (principal == null || !principal.roles().contains("ROLE_ADMIN")) {
                throw new SecurityException("403 Forbidden: Access Denied. Requires ROLE_ADMIN authority.");
            }
            return "[ADMIN ACTION] System settings updated by " + principal.username();
        }
    }

    // --- 5. Main Verification ---
    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 99: Stateless REST Security with JWT & Method-Level Role Authorization");
        System.out.println("================================================================================");

        String secretKey = "MasterSecretKeyForEnterpriseHandbook2026";
        JwtService jwtService = new JwtService(secretKey);
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService);
        AdminService adminService = new AdminService();

        // 1. Generate Tokens for Standard User vs Admin
        String userToken = jwtService.generateToken("john.doe", List.of("ROLE_USER"), 3600);
        String adminToken = jwtService.generateToken("sarah.admin", List.of("ROLE_USER", "ROLE_ADMIN"), 3600);

        System.out.println("1. Generated HMAC-SHA256 JWT Tokens:");
        System.out.println("   User Token  : " + userToken.substring(0, 40) + "...");
        System.out.println("   Admin Token : " + adminToken.substring(0, 40) + "...");
        assert jwtService.validateToken(userToken);
        assert jwtService.validateToken(adminToken);

        // 2. Client Request as Standard User
        System.out.println("\n2. Executing Request as Standard User (ROLE_USER):");
        Map<String, String> userHeaders = Map.of("Authorization", "Bearer " + userToken);
        boolean userAuthPassed = filter.doFilter(userHeaders);
        assert userAuthPassed : "User token authentication failed";

        // Authorized: performUserAction()
        String resUser = adminService.performUserAction();
        System.out.println("   Allowed Action : " + resUser);

        // Denied: performSuperAdminAction() (Should fail with 403 Forbidden)
        try {
            adminService.performSuperAdminAction();
            assert false : "Standard user should have been forbidden from super admin action";
        } catch (SecurityException ex) {
            System.out.println("   Denied Action  : " + ex.getMessage());
            assert ex.getMessage().contains("403 Forbidden");
        }

        // 3. Client Request as Admin
        System.out.println("\n3. Executing Request as Administrator (ROLE_ADMIN):");
        Map<String, String> adminHeaders = Map.of("Authorization", "Bearer " + adminToken);
        boolean adminAuthPassed = filter.doFilter(adminHeaders);
        assert adminAuthPassed : "Admin token authentication failed";

        String resAdminAction = adminService.performSuperAdminAction();
        System.out.println("   Allowed Action : " + resAdminAction);
        assert resAdminAction.contains("sarah.admin");

        // 4. Tampered Token Rejection
        System.out.println("\n4. Verifying Cryptographic Tamper Defense:");
        String tamperedToken = userToken.substring(0, userToken.length() - 5) + "ABCDE";
        assert !jwtService.validateToken(tamperedToken) : "Tampered signature was accepted!";
        System.out.println("   Tampered Token Verification: REJECTED [CRYPTO SECURE]");

        SecurityContextHolder.clear();
        System.out.println("\n[SUCCESS] Topic 99 JWT & RBAC Method Security verified successfully!");
        System.out.println("================================================================================");
    }
}
