---
id: topic-98
slug: stateless-rest-security-jwt-method-level-role-authorization
topicNumber: 98
title: Stateless REST Security with JWT & Method-Level Role Authorization
part: 'Part 3: Spring Boot & Production Stack'
sectionNumber: 28
sectionTitle: Enterprise Security with Spring Security 6
versionBadge: Spring Security 6.x / Boot 3.x
difficulty: Advanced
readingTime: 18 min read
shortDescription: >-
  Master stateless REST security in Spring Boot: HMAC-SHA256 JWT token
  generation, custom OncePerRequestFilter extraction, SecurityContextHolder
  thread-local propagation, and declarative method security with @PreAuthorize
  and @Secured.
prerequisites:
  - 'Topic 98: Modern SecurityFilterChain Architecture & Password Encryption'
  - 'Topic 92: Production REST Controller Architecture with Spring Web MVC'
---
## Overview
Stateless REST security uses JSON Web Tokens (JWT) exchanged in HTTP Authorization headers, validated per request by a custom OncePerRequestFilter that populates the SecurityContextHolder for declarative method security (@PreAuthorize).

---

---

## Architecture & Core Mechanics

### Anatomy of a JSON Web Token (JWT)

A JWT is a compact URL-safe string containing three segments separated by periods (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGljZSIsInJvbGVzIjoiUk9MRV9BRE1JTiJ9.8Jk_29LmX...
[------------- Header -------------].[-------------- Payload --------------].[--- Signature ---]
```

1. **Header:** JSON string declaring cryptographic algorithm (`HS256`, `RS256`) and token type (`JWT`), Base64URL-encoded.
2. **Payload (Claims):** JSON object containing registered claims (`sub`, `iat`, `exp`) and custom domain claims (`roles`, `tenantId`), Base64URL-encoded.
3. **Signature:** Calculated using the algorithm over the encoded header and payload with a private secret key:
   $$\text{Signature} = \text{HMAC-SHA256}(\text{Base64}(H) + "." + \text{Base64}(P), \text{SecretKey})$$

*Important: Base64 is encoding, NOT encryption. Anyone with access to the token string can decode the payload. Never store sensitive credentials (passwords, PII) in the JWT claims.*

---

### Intercepting Requests via `OncePerRequestFilter`

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(jwt, userDetails)) {
                var authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

### Method-Level Role Authorization (`@EnableMethodSecurity`)

In Spring Security 6, method security is activated via `@EnableMethodSecurity`:

```java
@Configuration
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class MethodSecurityConfig {}
```

#### Declarative Annotations:
- **`@PreAuthorize("hasRole('ADMIN')")`:** Evaluates a SpEL expression before method invocation.
- **`@PreAuthorize("hasAuthority('SCOPE_write') and #userId == authentication.principal.id")`:** Fine-grained resource ownership evaluation.
- **`@PostAuthorize("returnObject.owner == authentication.name")`:** Evaluates return object after method execution.

---

## Production Implementation

### Basic Example: Simulating JWT Generation & Validation
```java
package com.handbook.spring;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

public class BasicJwtSimulationDemo {

    public static class SimpleJwtProvider {
        private final String secretKey = "super-secret-enterprise-signing-key";

        public String createToken(String username, String role) {
            String header = Base64.getUrlEncoder().encodeToString("{\"alg\":\"HS256\"}".getBytes(StandardCharsets.UTF_8));
            String payload = Base64.getUrlEncoder().encodeToString(
                String.format("{\"sub\":\"%s\",\"role\":\"%s\"}", username, role).getBytes(StandardCharsets.UTF_8)
            );
            String signature = sign(header + "." + payload);
            return header + "." + payload + "." + signature;
        }

        public boolean validateToken(String token) {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;
            String expectedSig = sign(parts[0] + "." + parts[1]);
            return expectedSig.equals(parts[2]);
        }

        private String sign(String data) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                md.update((data + secretKey).getBytes(StandardCharsets.UTF_8));
                return Base64.getUrlEncoder().encodeToString(md.digest());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Spring Security: Stateless JWT Simulation ---");
        SimpleJwtProvider provider = new SimpleJwtProvider();
        String token = provider.createToken("sarah_connor", "ROLE_ADMIN");
        System.out.println("Generated JWT: " + token);
        System.out.println("Token Valid: " + provider.validateToken(token));
    }
}
```

**Expected Terminal Output:**
```text
--- Spring Security: Stateless JWT Simulation ---
Generated JWT: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYXJhaF9jb25ub3IiLCJyb2xlIjoiUk9MRV9BRE1JTiJ9....
Token Valid: true
```

---

### Realistic Enterprise Example: Verified JWT and Method Security Execution
```java
package com.handbook.spring;

import java.util.*;

public class JwtRbacSecurityDemo {

    public record UserPrincipal(String username, Set<String> roles) {}

    public static class SecureDocumentService {
        public String readDocument(UserPrincipal user) {
            if (!user.roles().contains("ROLE_USER") && !user.roles().contains("ROLE_ADMIN")) {
                throw new SecurityException("Access Denied: Requires ROLE_USER or ROLE_ADMIN");
            }
            return "DOCUMENT [CONFIDENTIAL]: System core architectural parameters.";
        }

        public void deleteDocument(UserPrincipal user) {
            if (!user.roles().contains("ROLE_ADMIN")) {
                throw new SecurityException("Access Denied: Requires ROLE_ADMIN");
            }
            System.out.println("Document successfully purged by administrator: " + user.username());
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 99: Stateless REST Security with JWT & RBAC ===");

        UserPrincipal operator = new UserPrincipal("agent_smith", Set.of("ROLE_USER"));
        UserPrincipal director = new UserPrincipal("sarah_connor", Set.of("ROLE_ADMIN", "ROLE_USER"));

        SecureDocumentService service = new SecureDocumentService();
        System.out.println("Operator read: " + service.readDocument(operator));

        try {
            service.deleteDocument(operator);
        } catch (SecurityException ex) {
            System.out.println("Operator delete correctly rejected: " + ex.getMessage());
        }

        service.deleteDocument(director);
        System.out.println("Topic 99 JWT & RBAC Method Security verified successfully.");
    }
}
```

---

## Common Pitfalls & Traps

### Pitfall 1: Confusing `hasRole('ADMIN')` vs `hasAuthority('ROLE_ADMIN')`
- **Symptom:** Users with role `ROLE_ADMIN` receive `403 Forbidden` on methods annotated with `@PreAuthorize("hasRole('ROLE_ADMIN')")`.
- **Cause:** Spring Security automatically prepends the prefix `ROLE_` when evaluating `hasRole()`. Therefore, `hasRole('ROLE_ADMIN')` checks for `ROLE_ROLE_ADMIN`!
- **Diagnosis & Fix:**
  - When using `hasRole()`, supply the bare name: `@PreAuthorize("hasRole('ADMIN')")`.
  - When using `hasAuthority()`, supply the exact string: `@PreAuthorize("hasAuthority('ROLE_ADMIN')")`.

### Pitfall 2: Storing Sensitive Data in JWT Payload
- **Symptom:** Security audit flags critical data exposure vulnerability.
- **Cause:** Assuming that because JWTs are signed, their payload is encrypted.
- **Diagnosis & Fix:** The signature only guarantees integrity, NOT confidentiality. The payload is standard Base64 stringified JSON. Any proxy, browser extension, or malicious interceptor can decode it via `atob()` in 1 line of JavaScript. Store only opaque identifiers (`userId`, `roles`, `tenantId`) in JWT claims; never store passwords, credit card numbers, or personally identifiable information.

### Pitfall 3: Failing to Clear `SecurityContextHolder` in Async / ThreadPool Tasks
- **Symptom:** A background worker thread executes actions under the identity of a previously authenticated user from a completely different HTTP request.
- **Cause:** Thread pools reuse threads. `SecurityContextHolder` uses `ThreadLocal` storage. If a request finishes without explicitly clearing the security context or if threads are dispatched without context propagation, stale credentials leak across concurrent requests.
- **Diagnosis & Fix:** In Spring Security, `SecurityContextHolderFilter` wraps the filter chain and cleans up `SecurityContextHolder.clearContext()` in its `finally` block when an HTTP request finishes. For asynchronous tasks dispatched across custom thread pools, wrap your executor with `DelegatingSecurityContextAsyncTaskExecutor` to safely propagate and clean up context across worker threads.

---

## Best Practices Guide

| Practice | Recommendation | Architectural Justification |
| :--- | :--- | :--- |
| **Token Lifespan** | Short-lived Access Token (15 min) | Limits the window of vulnerability if a token is intercepted or leaked. |
| **Token Renewal** | Use Refresh Token Rotation | Long-lived refresh tokens stored in `HttpOnly` cookies exchange for new access tokens. |
| **Signing Algorithm** | Use Asymmetric RS256 or ES256 in SOA | Private key signs token on Auth Server; microservices verify using public keys only. |
| **Method Security** | Use `@EnableMethodSecurity` | Modern standard replacing deprecated `@EnableGlobalMethodSecurity`. |
| **Header Format** | Strict `Authorization: Bearer <token>` | Standardizes HTTP semantics across client applications. |

---

## Version Notes & Compatibility

- **Spring Security 5.x:** Used `@EnableGlobalMethodSecurity(prePostEnabled = true)`.
- **Spring Security 6.0+ (Spring Boot 3.0+):**
  - Deprecated and removed `@EnableGlobalMethodSecurity`.
  - Introduced `@EnableMethodSecurity` with pre-post annotations enabled by default.
  - Native integration with modern Java 17+ records for principal and claims extraction.

---

## Summary & Cheat Sheet

| Mechanism | Storage Location | Scalability | Invalidation | Best Used For |
| :--- | :--- | :--- | :--- | :--- |
| **Session Cookie (`JSESSIONID`)** | Server Heap RAM or Redis | Low to Medium (requires clustering) | Instant (delete from server session map) | Monolithic MVC applications, Server-Side Rendered (SSR) apps. |
| **JSON Web Token (JWT)** | Client memory / Storage | Unlimited horizontal scalability | Requires token blocklist or short expiration | Distributed microservices, decoupled SPAs (React/Vue/Angular), Mobile APIs. |

---

## Hands-on Practice Exercises

### Exercise 1: Spot the Bug — The Missing ROLE_ Prefix in Method Security
Review the following service method:
```java
@Service
public class PayrollService {

    // The user database assigns authority "ROLE_FINANCE" to accountants
    @PreAuthorize("hasRole('ROLE_FINANCE')")
    public void disburseSalaries() {
        log.info("Salaries disbursed.");
    }
}
```
Why does every accountant with the `ROLE_FINANCE` role receive a `403 Forbidden` error when invoking `disburseSalaries()`, and how is it fixed?

<details>
<summary>View Solution</summary>

**Cause:**
`hasRole(...)` automatically prepends `ROLE_` to the argument. The method evaluates against `ROLE_ROLE_FINANCE`, which no user possesses.

**The Fix:**
Remove the redundant `ROLE_` prefix or switch to `hasAuthority()`:
```java
// Option A (Standard):
@PreAuthorize("hasRole('FINANCE')")
public void disburseSalaries() { ... }

// Option B:
@PreAuthorize("hasAuthority('ROLE_FINANCE')")
public void disburseSalaries() { ... }
```
</details>

---

### Exercise 2: Hands-on Implementation — Custom OncePerRequestFilter for Bearer JWT Extraction
Implement the core logic of a `OncePerRequestFilter` that safely extracts and validates a Bearer token without crashing on unauthenticated public endpoints.

<details>
<summary>View Solution</summary>

```java
package com.handbook.spring.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenValidator validator;

    public JwtTokenFilter(JwtTokenValidator validator) {
        this.validator = validator;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        // 1. Check for Bearer token presence
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // 2. Validate token and populate context if not already established
            if (validator.isValid(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails principal = validator.extractUserDetails(token);
                var authentication = new UsernamePasswordAuthenticationToken(
                    principal, null, principal.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 3. Continue downstream filter chain
        filterChain.doFilter(request, response);
    }
}
```
</details>

---

### Exercise 3: Real-World Edge Case — Revoking Stateless JWT Tokens in Emergency Account Lockouts
<details>
<summary>View Solution</summary>
**Question:** If an employee's smartphone containing a valid JWT with 1-hour expiration is stolen, how can a stateless Spring Boot microservice revoke the token immediately without destroying the stateless benefits of JWT?

**Solution:**
1. **The Stateless Dilemma:** Pure JWTs are self-contained; the server does not check the database on each request. A stolen token remains valid until the `exp` timestamp passes.
2. **Hybrid Token Blocklist via Redis:**
   - When an account lockout or logout occurs, the application extracts the unique JWT ID claim (`jti`) and writes it to a high-speed in-memory **Redis Blocklist** with a Time-To-Live (TTL) exactly matching the remaining token lifespan:
     ```java
     long remainingSeconds = jwt.getExpiration().getTime() - System.currentTimeMillis();
     redisTemplate.opsForValue().set("blocklist:" + jti, "revoked", Duration.ofMillis(remainingSeconds));
     ```
   - In `OncePerRequestFilter`, the filter performs a single, sub-millisecond in-memory Redis `EXISTS blocklist:<jti>` check.
   - If the key exists, the filter immediately rejects the request with `401 Unauthorized`.
   - Once the token expires naturally, Redis auto-evicts the key from memory, preventing unbounded storage growth.
</details>

---

## Verified Official Sources
- [Spring Security Reference: Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [RFC 7519: JSON Web Token (JWT) Specification](https://datatracker.ietf.org/doc/html/rfc7519)
- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

---

## Practice

### Q: How does stateless JWT authentication eliminate the need for server-side session storage in clustered microservices?
<details data-type="solution">
<summary>Reveal Answer</summary>

> **Answer:** In session-based auth, servers store session IDs in memory, requiring cluster session replication. With JWT, all user claims and permissions are signed with a secret key or asymmetric RSA private key and held entirely by the client. Any server in the cluster can cryptographically verify the token signature using the public key without querying a database or shared cache.
</details>
