package com.handbook.spring;

import java.lang.annotation.*;
import java.time.Duration;
import java.util.*;

/**
 * Section 25 - Topic 91: Externalized Configuration, YAML Hierarchies & Multi-Profile Deployment
 * Demonstrates configuration property source hierarchies, relaxed binding, immutable records,
 * profile-based property overrides, and validation.
 */
public class ExternalizedConfigurationProfilesDemo {

    // --- Simulated Spring Boot Configuration Annotations ---
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    public @interface ConfigurationProperties {
        String prefix();
    }

    // --- Immutable Configuration Record (Modern Spring Boot 3.x Style) ---
    @ConfigurationProperties(prefix = "app.payment")
    public record PaymentGatewayProperties(
            String apiEndpoint,
            String merchantId,
            int maxRetryAttempts,
            Duration timeout,
            boolean sandboxMode
    ) {
        public PaymentGatewayProperties {
            Objects.requireNonNull(apiEndpoint, "apiEndpoint is mandatory");
            Objects.requireNonNull(merchantId, "merchantId is mandatory");
            if (maxRetryAttempts < 0) {
                throw new IllegalArgumentException("maxRetryAttempts must be non-negative");
            }
            if (timeout == null || timeout.isNegative()) {
                throw new IllegalArgumentException("timeout must be positive");
            }
        }
    }

    // --- Relaxed Binding & Property Hierarchy Resolver ---
    public static class EnvironmentConfigurationResolver {
        private final Map<String, String> defaultProperties = new LinkedHashMap<>();
        private final Map<String, Map<String, String>> profileProperties = new LinkedHashMap<>();
        private final Map<String, String> systemProperties = new LinkedHashMap<>();
        private final Map<String, String> commandLineArguments = new LinkedHashMap<>();

        public void loadDefaultYaml(Map<String, String> props) {
            defaultProperties.putAll(props);
        }

        public void loadProfileYaml(String profile, Map<String, String> props) {
            profileProperties.computeIfAbsent(profile, k -> new LinkedHashMap<>()).putAll(props);
        }

        public void setSystemProperty(String key, String value) {
            systemProperties.put(key, value);
        }

        public void setCommandLineArgument(String key, String value) {
            commandLineArguments.put(key, value);
        }

        // Resolves key respecting Spring Boot's official precedence hierarchy:
        // 1. Command-line args > 2. Java System Props > 3. Profile YAML > 4. Default YAML
        public String resolveProperty(String key, String activeProfile) {
            // Check normalized key variations for relaxed binding (e.g., app.payment.api-endpoint vs apiEndpoint)
            List<String> candidateKeys = generateRelaxedKeys(key);

            for (String candidate : candidateKeys) {
                if (commandLineArguments.containsKey(candidate)) {
                    return commandLineArguments.get(candidate);
                }
            }
            for (String candidate : candidateKeys) {
                if (systemProperties.containsKey(candidate)) {
                    return systemProperties.get(candidate);
                }
            }
            if (activeProfile != null && profileProperties.containsKey(activeProfile)) {
                Map<String, String> prof = profileProperties.get(activeProfile);
                for (String candidate : candidateKeys) {
                    if (prof.containsKey(candidate)) {
                        return prof.get(candidate);
                    }
                }
            }
            for (String candidate : candidateKeys) {
                if (defaultProperties.containsKey(candidate)) {
                    return defaultProperties.get(candidate);
                }
            }
            return null;
        }

        private List<String> generateRelaxedKeys(String key) {
            List<String> list = new ArrayList<>();
            list.add(key);
            // Convert camelCase to kebab-case
            String kebab = key.replaceAll("([a-z])([A-Z]+)", "$1-$2").toLowerCase();
            list.add(kebab);
            // Convert dot.case to UPPER_SNAKE_CASE
            String snake = key.replace('.', '_').replace('-', '_').toUpperCase();
            list.add(snake);
            return list;
        }

        public PaymentGatewayProperties bindPaymentProperties(String activeProfile) {
            String endpoint = resolveProperty("app.payment.api-endpoint", activeProfile);
            String merchant = resolveProperty("app.payment.merchant-id", activeProfile);
            String retriesStr = resolveProperty("app.payment.max-retry-attempts", activeProfile);
            String timeoutSecStr = resolveProperty("app.payment.timeout-seconds", activeProfile);
            String sandboxStr = resolveProperty("app.payment.sandbox-mode", activeProfile);

            int retries = retriesStr != null ? Integer.parseInt(retriesStr) : 3;
            Duration timeout = timeoutSecStr != null ? Duration.ofSeconds(Long.parseLong(timeoutSecStr)) : Duration.ofSeconds(5);
            boolean sandbox = sandboxStr != null && Boolean.parseBoolean(sandboxStr);

            return new PaymentGatewayProperties(endpoint, merchant, retries, timeout, sandbox);
        }
    }

    // --- Main Verification Flow ---
    public static void main(String[] args) {
        System.out.println("==========================================================================");
        System.out.println(" Spring Boot: Externalized Configuration, Relaxed Binding & Profiles Demo  ");
        System.out.println("==========================================================================\n");

        EnvironmentConfigurationResolver resolver = new EnvironmentConfigurationResolver();

        // 1. Base Default YAML (application.yml)
        resolver.loadDefaultYaml(Map.of(
            "app.payment.api-endpoint", "https://sandbox.gateway.io/api/v1",
            "app.payment.merchant-id", "DEV-MERCHANT-001",
            "app.payment.max-retry-attempts", "2",
            "app.payment.timeout-seconds", "10",
            "app.payment.sandbox-mode", "true"
        ));

        // 2. Production Profile YAML (application-prod.yml)
        resolver.loadProfileYaml("prod", Map.of(
            "app.payment.api-endpoint", "https://secure.gateway.io/api/v1",
            "app.payment.merchant-id", "PROD-CORP-9999",
            "app.payment.sandbox-mode", "false"
        ));

        // Test Profile "dev"
        System.out.println("--- 1. Evaluating Profile: 'dev' ---");
        PaymentGatewayProperties devProps = resolver.bindPaymentProperties("dev");
        System.out.println("Dev Endpoint: " + devProps.apiEndpoint());
        System.out.println("Dev Merchant: " + devProps.merchantId());
        System.out.println("Dev Sandbox:  " + devProps.sandboxMode());
        assert devProps.sandboxMode() : "Dev must default to sandbox mode";
        assert "DEV-MERCHANT-001".equals(devProps.merchantId());

        // Test Profile "prod"
        System.out.println("\n--- 2. Evaluating Profile: 'prod' (Profile Override) ---");
        PaymentGatewayProperties prodProps = resolver.bindPaymentProperties("prod");
        System.out.println("Prod Endpoint: " + prodProps.apiEndpoint());
        System.out.println("Prod Merchant: " + prodProps.merchantId());
        System.out.println("Prod Sandbox:  " + prodProps.sandboxMode());
        assert !prodProps.sandboxMode() : "Prod profile must disable sandbox";
        assert "PROD-CORP-9999".equals(prodProps.merchantId());

        // Test Command-Line Precedence Override (Highest Priority)
        System.out.println("\n--- 3. Evaluating Command-Line Override (--app.payment.timeout-seconds=25) ---");
        resolver.setCommandLineArgument("app.payment.timeout-seconds", "25");
        PaymentGatewayProperties overriddenProps = resolver.bindPaymentProperties("prod");
        System.out.println("Overridden Timeout: " + overriddenProps.timeout().toSeconds() + " seconds");
        assert overriddenProps.timeout().toSeconds() == 25 : "Command line argument must take precedence!";

        System.out.println("\nSUCCESS: Externalized configuration hierarchy, multi-profile overrides, and validation verified successfully!");
    }
}
