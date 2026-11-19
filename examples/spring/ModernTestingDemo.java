package com.handbook.spring;

import java.lang.reflect.Proxy;
import java.util.*;

/**
 * Section 30 - Topic 103: Modern Automated Testing: JUnit 5, Mockito & Testcontainers
 * 
 * Demonstrates:
 * 1. JUnit 5 test lifecycle: assertions, exception testing, parameterized test simulation.
 * 2. Mockito dynamic test doubles: when().thenReturn(), verify() call count inspection.
 * 3. Testcontainers architectural container lifecycle simulation (start, ready, stop).
 * 4. Integration testing with mocked external dependencies and containerized databases.
 */
public class ModernTestingDemo {

    // --- 1. Service & Collaborator Contracts ---
    public interface PaymentGateway {
        boolean processCharge(String accountId, double amount);
    }

    public static class OrderService {
        private final PaymentGateway paymentGateway;

        public OrderService(PaymentGateway paymentGateway) {
            this.paymentGateway = paymentGateway;
        }

        public boolean checkout(String accountId, double amount) {
            if (amount <= 0) {
                throw new IllegalArgumentException("Amount must be positive");
            }
            return paymentGateway.processCharge(accountId, amount);
        }
    }

    // --- 2. Mockito Test Double Engine Simulation ---
    public static class MockitoSimulator {
        public static final Map<String, Object> stubbedResponses = new HashMap<>();
        public static final Map<String, Integer> invocationCounters = new HashMap<>();

        @SuppressWarnings("unchecked")
        public static <T> T mock(Class<T> type) {
            return (T) Proxy.newProxyInstance(
                    type.getClassLoader(),
                    new Class<?>[]{type},
                    (proxy, method, args) -> {
                        String key = method.getName() + Arrays.toString(args);
                        invocationCounters.merge(method.getName(), 1, Integer::sum);
                        return stubbedResponses.getOrDefault(key, false);
                    }
            );
        }

        public static void when(String methodSignature, Object returnValue) {
            stubbedResponses.put(methodSignature, returnValue);
        }

        public static void verify(String methodName, int expectedInvocations) {
            int actual = invocationCounters.getOrDefault(methodName, 0);
            if (actual != expectedInvocations) {
                throw new AssertionError(String.format("Wanted %d invocations of %s but got %d",
                        expectedInvocations, methodName, actual));
            }
        }

        public static void reset() {
            stubbedResponses.clear();
            invocationCounters.clear();
        }
    }

    // --- 3. Testcontainers Lifecycle Simulator ---
    public static class PostgreSQLContainerSimulator {
        private boolean isRunning = false;

        public void start() {
            System.out.println("  [Testcontainers] Starting Docker container: postgres:16-alpine...");
            isRunning = true;
            System.out.println("  [Testcontainers] Container is ready! JDBC URL: jdbc:postgresql://localhost:32768/testdb");
        }

        public void stop() {
            System.out.println("  [Testcontainers] Stopping container and reclaiming Docker resources.");
            isRunning = false;
        }

        public boolean isRunning() { return isRunning; }
    }

    // --- 4. Main Verification (Simulated JUnit 5 Test Suite) ---
    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 103: Modern Automated Testing: JUnit 5, Mockito & Testcontainers");
        System.out.println("================================================================================");

        // 1. Mockito Unit Test
        System.out.println("1. Executing Unit Test with Mockito Test Doubles:");
        MockitoSimulator.reset();
        PaymentGateway mockGateway = MockitoSimulator.mock(PaymentGateway.class);
        MockitoSimulator.when("processCharge[ACC-9901, 250.0]", true);

        OrderService orderService = new OrderService(mockGateway);
        boolean success = orderService.checkout("ACC-9901", 250.0);
        System.out.println("   Checkout result with mocked gateway: " + success);
        assert success : "Order checkout should succeed";

        // Verify collaborator interaction
        MockitoSimulator.verify("processCharge", 1);
        System.out.println("   Mockito.verify(paymentGateway, times(1)): VERIFIED");

        // 2. Exception Testing with JUnit 5 Assertions
        System.out.println("\n2. Executing JUnit 5 Exception Assertion (assertThrows):");
        try {
            orderService.checkout("ACC-9901", -50.0);
            assert false : "Expected IllegalArgumentException";
        } catch (IllegalArgumentException ex) {
            System.out.println("   Caught expected exception: " + ex.getMessage());
            assert ex.getMessage().contains("Amount must be positive");
        }

        // 3. Testcontainers Integration Test Lifecycle
        System.out.println("\n3. Executing Testcontainers Container Lifecycle:");
        PostgreSQLContainerSimulator container = new PostgreSQLContainerSimulator();
        container.start();
        assert container.isRunning() : "Container should be active";

        System.out.println("   Executing database integration migration and assertions against container...");
        container.stop();
        assert !container.isRunning() : "Container should be stopped";

        System.out.println("\n[SUCCESS] Topic 103 Automated Testing Suite verified successfully!");
        System.out.println("================================================================================");
    }
}
