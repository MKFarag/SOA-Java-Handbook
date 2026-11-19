package com.handbook.spring;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.*;

/**
 * Section 28 - Topic 98: Modern SecurityFilterChain Architecture & Password Encryption
 * 
 * Demonstrates:
 * 1. Spring Security 6's component-based SecurityFilterChain bean configuration.
 * 2. URL request authorization rules (permitAll vs authenticated).
 * 3. Disabling CSRF for stateless REST architectures.
 * 4. High-security Password Encoding simulation with salting and constant-time verification.
 * 5. AuthenticationProvider and AuthenticationManager authentication pipeline.
 */
public class SecurityFilterChainDemo {

    // --- 1. Password Encoder Simulation ---
    public interface PasswordEncoder {
        String encode(CharSequence rawPassword);
        boolean matches(CharSequence rawPassword, String encodedPassword);
    }

    public static class BCryptPasswordEncoderSimulator implements PasswordEncoder {
        private final SecureRandom random = new SecureRandom();

        @Override
        public String encode(CharSequence rawPassword) {
            byte[] salt = new byte[16];
            random.nextBytes(salt);
            String saltHex = HexFormat.of().formatHex(salt);
            String hashHex = hashWithSalt(rawPassword.toString(), saltHex);
            return "$2a$12$" + saltHex + "$" + hashHex;
        }

        @Override
        public boolean matches(CharSequence rawPassword, String encodedPassword) {
            String[] parts = encodedPassword.split("\\$");
            if (parts.length < 5) return false;
            String saltHex = parts[3];
            String expectedHash = parts[4];
            String actualHash = hashWithSalt(rawPassword.toString(), saltHex);
            // Constant-time comparison to prevent timing attacks
            return MessageDigest.isEqual(
                    expectedHash.getBytes(StandardCharsets.UTF_8),
                    actualHash.getBytes(StandardCharsets.UTF_8)
            );
        }

        private String hashWithSalt(String raw, String salt) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                // Key stretching iteration simulation
                byte[] current = (raw + ":" + salt).getBytes(StandardCharsets.UTF_8);
                for (int i = 0; i < 1000; i++) {
                    current = md.digest(current);
                }
                return HexFormat.of().formatHex(current);
            } catch (Exception e) {
                throw new RuntimeException("Hashing failure", e);
            }
        }
    }

    // --- 2. Security Primitives & User Details ---
    public record SimpleGrantedAuthority(String authority) {}

    public record UserDetails(String username, String password, Set<SimpleGrantedAuthority> authorities, boolean enabled) {}

    public record Authentication(String principal, Object credentials, Collection<SimpleGrantedAuthority> authorities, boolean authenticated) {}

    public static class UserDetailsService {
        private final Map<String, UserDetails> users = new HashMap<>();

        public void registerUser(UserDetails user) {
            users.put(user.username(), user);
        }

        public Optional<UserDetails> loadUserByUsername(String username) {
            return Optional.ofNullable(users.get(username));
        }
    }

    // --- 3. Modern SecurityFilterChain Configuration Bean ---
    public static class RequestMatcherRule {
        private final String pattern;
        private final boolean requiresAuth;

        public RequestMatcherRule(String pattern, boolean requiresAuth) {
            this.pattern = pattern;
            this.requiresAuth = requiresAuth;
        }

        public boolean matches(String uri) {
            if (pattern.endsWith("/**")) {
                String prefix = pattern.substring(0, pattern.length() - 3);
                return uri.startsWith(prefix);
            }
            return uri.equals(pattern);
        }

        public boolean requiresAuth() { return requiresAuth; }
    }

    public static class SecurityFilterChain {
        private final List<RequestMatcherRule> rules = new ArrayList<>();
        private boolean csrfEnabled = false; // Disabled by default for REST APIs

        public SecurityFilterChain permitAll(String pattern) {
            rules.add(new RequestMatcherRule(pattern, false));
            return this;
        }

        public SecurityFilterChain authenticated(String pattern) {
            rules.add(new RequestMatcherRule(pattern, true));
            return this;
        }

        public SecurityFilterChain disableCsrf() {
            this.csrfEnabled = false;
            return this;
        }

        public boolean isCsrfEnabled() { return csrfEnabled; }

        public boolean requiresAuthentication(String uri) {
            for (RequestMatcherRule rule : rules) {
                if (rule.matches(uri)) {
                    return rule.requiresAuth();
                }
            }
            return true; // Default to authenticated for any unlisted endpoint
        }
    }

    // --- 4. Authentication Manager Pipeline ---
    public static class AuthenticationManager {
        private final UserDetailsService userDetailsService;
        private final PasswordEncoder passwordEncoder;

        public AuthenticationManager(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
            this.userDetailsService = userDetailsService;
            this.passwordEncoder = passwordEncoder;
        }

        public Authentication authenticate(String username, String rawPassword) {
            UserDetails user = userDetailsService.loadUserByUsername(username)
                    .orElseThrow(() -> new SecurityException("Bad credentials: User not found"));

            if (!passwordEncoder.matches(rawPassword, user.password())) {
                throw new SecurityException("Bad credentials: Invalid password hash match");
            }

            return new Authentication(user.username(), null, user.authorities(), true);
        }
    }

    // --- 5. Main Execution & Verification ---
    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 98: Modern SecurityFilterChain Architecture & Password Encryption");
        System.out.println("================================================================================");

        // 1. Password Encoder Verification
        PasswordEncoder encoder = new BCryptPasswordEncoderSimulator();
        String rawSecret = "SuperSecurePassword#2026";
        String encodedHash = encoder.encode(rawSecret);

        System.out.println("1. BCryptPasswordEncoder simulation:");
        System.out.println("   Raw Password : " + rawSecret);
        System.out.println("   Encoded Hash : " + encodedHash);
        assert encoder.matches(rawSecret, encodedHash) : "Password match failed";
        assert !encoder.matches("WrongPassword", encodedHash) : "Incorrect password was accepted";
        System.out.println("   Cryptographic Verification: PASSED");

        // 2. User Registration
        UserDetailsService userDetailsService = new UserDetailsService();
        UserDetails adminUser = new UserDetails(
                "sarah.admin",
                encodedHash,
                Set.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER")),
                true
        );
        userDetailsService.registerUser(adminUser);

        // 3. Configure SecurityFilterChain (Spring Security 6 @Bean pattern)
        SecurityFilterChain filterChain = new SecurityFilterChain()
                .disableCsrf()
                .permitAll("/api/v1/auth/**")
                .permitAll("/public/**")
                .authenticated("/api/v1/admin/**")
                .authenticated("/api/v1/orders/**");

        System.out.println("\n2. Configured Modern SecurityFilterChain Bean:");
        System.out.println("   CSRF Protection Enabled: " + filterChain.isCsrfEnabled() + " (Stateless REST mode)");
        assert !filterChain.requiresAuthentication("/api/v1/auth/login") : "Auth login must be public";
        assert !filterChain.requiresAuthentication("/public/docs") : "Public docs must be permitAll";
        assert filterChain.requiresAuthentication("/api/v1/admin/users") : "Admin must require auth";
        assert filterChain.requiresAuthentication("/api/v1/orders/create") : "Orders must require auth";
        System.out.println("   Endpoint Authorization Rules: ALL VERIFIED");

        // 4. Authenticate via AuthenticationManager
        AuthenticationManager authManager = new AuthenticationManager(userDetailsService, encoder);
        System.out.println("\n3. Authenticating Principal:");
        Authentication auth = authManager.authenticate("sarah.admin", rawSecret);
        System.out.printf("   Principal: %s | Authenticated: %b | Authorities: %s\n",
                auth.principal(), auth.authenticated(), auth.authorities());
        assert auth.authenticated() && auth.authorities().size() == 2;

        // 5. Test Invalid Credentials Rejection
        try {
            authManager.authenticate("sarah.admin", "IncorrectPassword123");
            assert false : "Authentication should have failed with Bad Credentials";
        } catch (SecurityException ex) {
            System.out.println("4. Bad Credentials Rejection: " + ex.getMessage());
        }

        System.out.println("\n[SUCCESS] Topic 98 Modern SecurityFilterChain and Password Encoder verified successfully!");
        System.out.println("================================================================================");
    }
}
