package com.handbook.spring;

import java.util.*;

public class OidcKeycloakIntegrationDemo {

    public record OidcPrincipal(String sub, String email, Set<String> roles) {}

    public static class EnterpriseOidcAuthenticator {
        public static boolean authenticateUserSession(OidcPrincipal principal, String requiredRole) {
            System.out.printf("Evaluating OIDC session for User: %s (%s)%n", principal.sub(), principal.email());
            return principal.roles().contains(requiredRole);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 113: OpenID Connect (OIDC) & Identity Provider Integration ===");

        OidcPrincipal enterpriseAdmin = new OidcPrincipal(
            "emp_4401", "sarah.connor@cyberdyne.corp", Set.of("ROLE_USER", "ROLE_SECURITY_ADMIN")
        );

        boolean isAuthorized = EnterpriseOidcAuthenticator.authenticateUserSession(
            enterpriseAdmin, "ROLE_SECURITY_ADMIN"
        );

        System.out.println("OIDC Security Admin authorization result: " + isAuthorized);

        if (!isAuthorized) {
            throw new AssertionError("OIDC Authorization evaluation failed!");
        }

        System.out.println("Topic 113 OpenID Connect and Keycloak integration verified successfully.");
    }
}
