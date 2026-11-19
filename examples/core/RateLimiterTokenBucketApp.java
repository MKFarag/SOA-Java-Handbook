import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Topic 50: Explicit Locks & Concurrent Collections - Realistic Application
 * Demonstrates a high-concurrency Token Bucket Rate Limiter combining
 * lock-free CAS token consumption and ReentrantLock for capacity reconfiguration.
 */
public class RateLimiterTokenBucketApp {

    public static class TokenBucketRateLimiter {
        private final AtomicInteger availableTokens;
        private int maxCapacity;
        private final ReentrantLock configLock = new ReentrantLock();

        public TokenBucketRateLimiter(int capacity) {
            this.maxCapacity = capacity;
            this.availableTokens = new AtomicInteger(capacity);
        }

        // Lock-free token consumption using CAS loop
        public boolean tryConsume() {
            while (true) {
                int current = availableTokens.get();
                if (current <= 0) {
                    return false; // Rate limit exceeded
                }
                if (availableTokens.compareAndSet(current, current - 1)) {
                    return true; // Successfully consumed 1 token
                }
            }
        }

        // ReentrantLock guarded administrative capacity update
        public void updateCapacity(int newCapacity) {
            configLock.lock();
            try {
                this.maxCapacity = newCapacity;
                availableTokens.set(newCapacity); // Replenish to new ceiling
            } finally {
                configLock.unlock();
            }
        }

        public int getAvailableTokens() {
            return availableTokens.get();
        }
    }

    public static void main(String[] args) {
        TokenBucketRateLimiter limiter = new TokenBucketRateLimiter(3);

        System.out.println("Attempt 1 allowed: " + limiter.tryConsume()); // true (remaining 2)
        System.out.println("Attempt 2 allowed: " + limiter.tryConsume()); // true (remaining 1)
        System.out.println("Attempt 3 allowed: " + limiter.tryConsume()); // true (remaining 0)
        System.out.println("Attempt 4 allowed: " + limiter.tryConsume()); // false (throttled)

        System.out.println("Tokens remaining: " + limiter.getAvailableTokens());

        // Admin increases capacity
        limiter.updateCapacity(5);
        System.out.println("\nCapacity reconfigured to 5.");
        System.out.println("Attempt 5 allowed: " + limiter.tryConsume()); // true (remaining 4)
        System.out.println("Final tokens remaining: " + limiter.getAvailableTokens());
    }
}
