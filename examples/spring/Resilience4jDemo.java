package com.handbook.spring;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * Section 30 - Topic 107: Resilience & Fault Tolerance with Resilience4j (Circuit Breaker, RateLimiter)
 * 
 * Demonstrates:
 * 1. CircuitBreaker state transitions: CLOSED -> OPEN -> HALF_OPEN.
 * 2. Sliding window failure rate calculation and threshold tripping.
 * 3. Graceful degradation via fallback method invocation.
 * 4. RateLimiter token bucket throttling and request rejection.
 */
public class Resilience4jDemo {

    public enum State { CLOSED, OPEN, HALF_OPEN }

    public static class CircuitBreakerSimulator {
        private State state = State.CLOSED;
        private final int slidingWindowSize;
        private final double failureRateThreshold; // e.g. 50%
        private final int[] recentCalls;
        private int callIndex = 0;
        private int totalRecorded = 0;

        public CircuitBreakerSimulator(int windowSize, double threshold) {
            this.slidingWindowSize = windowSize;
            this.failureRateThreshold = threshold;
            this.recentCalls = new int[windowSize]; // 1 = success, 0 = failure
        }

        public <T> T executeSupplier(java.util.function.Supplier<T> supplier, java.util.function.Function<Throwable, T> fallback) {
            if (state == State.OPEN) {
                System.out.println("  [CircuitBreaker] Circuit is OPEN! Short-circuiting call immediately to fallback.");
                return fallback.apply(new IllegalStateException("CircuitBreaker is OPEN"));
            }

            try {
                T result = supplier.get();
                recordCall(1);
                return result;
            } catch (Throwable t) {
                recordCall(0);
                System.out.println("  [CircuitBreaker] Call failed: " + t.getMessage() + " -> Invoking fallback.");
                return fallback.apply(t);
            }
        }

        private void recordCall(int status) {
            recentCalls[callIndex % slidingWindowSize] = status;
            callIndex++;
            if (totalRecorded < slidingWindowSize) totalRecorded++;

            if (totalRecorded >= slidingWindowSize) {
                int failures = 0;
                for (int i = 0; i < slidingWindowSize; i++) {
                    if (recentCalls[i] == 0) failures++;
                }
                double rate = (double) failures / slidingWindowSize;
                if (rate >= failureRateThreshold && state == State.CLOSED) {
                    state = State.OPEN;
                    System.out.printf("  [CircuitBreaker State Change] Failure rate %.0f%% exceeded threshold! CLOSED -> OPEN%n", rate * 100);
                }
            }
        }

        public void transitionToHalfOpen() {
            state = State.HALF_OPEN;
            System.out.println("  [CircuitBreaker State Change] Trial period: OPEN -> HALF_OPEN");
        }

        public State getState() { return state; }
    }

    public static class RateLimiterSimulator {
        private final int maxTokens;
        private final AtomicInteger availableTokens;

        public RateLimiterSimulator(int maxTokens) {
            this.maxTokens = maxTokens;
            this.availableTokens = new AtomicInteger(maxTokens);
        }

        public boolean tryAcquire() {
            int current = availableTokens.get();
            while (current > 0) {
                if (availableTokens.compareAndSet(current, current - 1)) {
                    return true;
                }
                current = availableTokens.get();
            }
            return false;
        }

        public void replenish() {
            availableTokens.set(maxTokens);
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 107: Resilience & Fault Tolerance with Resilience4j");
        System.out.println("================================================================================");

        // 1. CircuitBreaker State Machine Verification
        System.out.println("1. Testing CircuitBreaker with 4-call sliding window and 50% failure threshold:");
        CircuitBreakerSimulator cb = new CircuitBreakerSimulator(4, 0.50);

        // 2 calls succeed
        cb.executeSupplier(() -> "Success 1", ex -> "Fallback");
        cb.executeSupplier(() -> "Success 2", ex -> "Fallback");
        assert cb.getState() == State.CLOSED;

        // 2 calls fail -> Trips circuit
        cb.executeSupplier(() -> { throw new RuntimeException("Downstream timeout"); }, ex -> "Fallback-1");
        cb.executeSupplier(() -> { throw new RuntimeException("Downstream timeout"); }, ex -> "Fallback-2");

        // Verify circuit is now OPEN
        assert cb.getState() == State.OPEN;
        System.out.println("   Verified CircuitBreaker state: " + cb.getState());

        // Subsequent call is short-circuited
        String shortCircuitRes = cb.executeSupplier(() -> "Will not run", ex -> "Short-Circuit-Fallback");
        assert shortCircuitRes.equals("Short-Circuit-Fallback");

        // 2. RateLimiter Throttling
        System.out.println("\n2. Testing RateLimiter (Permit limit: 2 requests):");
        RateLimiterSimulator limiter = new RateLimiterSimulator(2);
        assert limiter.tryAcquire() : "Permit 1 should be granted";
        assert limiter.tryAcquire() : "Permit 2 should be granted";
        boolean rejected = !limiter.tryAcquire();
        System.out.println("   Permit 3 acquired: " + !rejected + " (Throttled with HTTP 429 Too Many Requests: " + rejected + ")");
        assert rejected;

        System.out.println("\n[SUCCESS] Topic 107 Resilience4j Circuit Breaker & RateLimiter verified successfully!");
        System.out.println("================================================================================");
    }
}
