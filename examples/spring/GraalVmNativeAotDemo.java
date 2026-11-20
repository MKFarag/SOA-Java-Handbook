package com.handbook.spring;

import java.util.*;

public class GraalVmNativeAotDemo {

    public record ReflectionHint(Class<?> targetClass, boolean constructors, boolean methods, boolean fields) {}

    public static class NativeRuntimeHintsRegistry {
        private final Map<Class<?>, ReflectionHint> reflectionHints = new HashMap<>();
        private final Set<String> resourcePatternHints = new HashSet<>();

        public void registerReflectionHint(Class<?> clazz, boolean constructors, boolean methods, boolean fields) {
            reflectionHints.put(clazz, new ReflectionHint(clazz, constructors, methods, fields));
        }

        public void registerResourcePattern(String pattern) {
            resourcePatternHints.add(pattern);
        }

        public boolean hasHintFor(Class<?> clazz) {
            return reflectionHints.containsKey(clazz);
        }

        public int totalHints() {
            return reflectionHints.size() + resourcePatternHints.size();
        }
    }

    public static class PaymentWebhookPayload {
        private String transactionId;
        private double amount;

        public PaymentWebhookPayload() {}
        public PaymentWebhookPayload(String transactionId, double amount) {
            this.transactionId = transactionId;
            this.amount = amount;
        }

        public String getTransactionId() { return transactionId; }
        public double getAmount() { return amount; }
    }

    public interface RuntimeHintsRegistrar {
        void registerHints(NativeRuntimeHintsRegistry hints, ClassLoader classLoader);
    }

    public static class PaymentAotRuntimeHints implements RuntimeHintsRegistrar {
        @Override
        public void registerHints(NativeRuntimeHintsRegistry hints, ClassLoader classLoader) {
            hints.registerReflectionHint(PaymentWebhookPayload.class, true, true, false);
            hints.registerResourcePattern("templates/payment-receipt.html");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Topic 129: GraalVM Native Image & Ahead-of-Time (AOT) Compilation ===");

        NativeRuntimeHintsRegistry hintsRegistry = new NativeRuntimeHintsRegistry();
        PaymentAotRuntimeHints registrar = new PaymentAotRuntimeHints();

        registrar.registerHints(hintsRegistry, GraalVmNativeAotDemo.class.getClassLoader());

        System.out.println("Registered native reflection hints: " + hintsRegistry.reflectionHints.size());
        System.out.println("Registered native resource pattern hints: " + hintsRegistry.resourcePatternHints.size());

        if (!hintsRegistry.hasHintFor(PaymentWebhookPayload.class)) {
            throw new AssertionError("AOT runtime hint registration failed for PaymentWebhookPayload!");
        }

        if (hintsRegistry.totalHints() != 2) {
            throw new AssertionError("Expected 2 total AOT hints, but found: " + hintsRegistry.totalHints());
        }

        System.out.println("Closed-world reflection hints successfully registered for GraalVM AOT compilation.");
        System.out.println("Topic 129 GraalVM Native Image & AOT demo verified successfully.");
    }
}
