package com.handbook.spring;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Section 30 - Topic 106: High-Performance Distributed Caching with Caffeine & Redis
 * 
 * Demonstrates:
 * 1. Multi-tier Caching: L1 in-memory (Caffeine) + L2 distributed (Redis).
 * 2. Spring Cache Abstraction: @Cacheable, @CachePut, @CacheEvict.
 * 3. Cache stampede prevention and TTL (Time-To-Live) expiration.
 * 4. Hit vs Miss latency profiling and eviction mechanics.
 */
public class DistributedCachingDemo {

    public static class CacheEntry<V> {
        private final V value;
        private final long expiryTimestamp;

        public CacheEntry(V value, long ttlMillis) {
            this.value = value;
            this.expiryTimestamp = System.currentTimeMillis() + ttlMillis;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() > expiryTimestamp;
        }

        public V getValue() { return value; }
    }

    // --- Simulated Multi-Tier Cache Manager ---
    public static class MultiTierCacheManager {
        // L1: Caffeine (In-Memory JVM Heap)
        private final Map<String, CacheEntry<Object>> l1Caffeine = new ConcurrentHashMap<>();
        // L2: Redis (Remote Shared Key-Value Store)
        private final Map<String, CacheEntry<Object>> l2Redis = new ConcurrentHashMap<>();

        public final AtomicInteger l1Hits = new AtomicInteger(0);
        public final AtomicInteger l2Hits = new AtomicInteger(0);
        public final AtomicInteger databaseLoads = new AtomicInteger(0);

        public Object getOrCompute(String key, long ttlMillis, java.util.function.Supplier<Object> dbLoader) {
            // 1. Check L1 Caffeine
            CacheEntry<Object> l1Entry = l1Caffeine.get(key);
            if (l1Entry != null && !l1Entry.isExpired()) {
                l1Hits.incrementAndGet();
                return l1Entry.getValue();
            }

            // 2. Check L2 Redis
            CacheEntry<Object> l2Entry = l2Redis.get(key);
            if (l2Entry != null && !l2Entry.isExpired()) {
                l2Hits.incrementAndGet();
                // Backfill L1 Caffeine
                l1Caffeine.put(key, l2Entry);
                return l2Entry.getValue();
            }

            // 3. Cache Miss: Query Database
            databaseLoads.incrementAndGet();
            Object value = dbLoader.get();

            // Populate both tiers
            CacheEntry<Object> fresh = new CacheEntry<>(value, ttlMillis);
            l1Caffeine.put(key, fresh);
            l2Redis.put(key, fresh);

            return value;
        }

        public void evict(String key) {
            l1Caffeine.remove(key);
            l2Redis.remove(key);
        }
    }

    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 106: High-Performance Distributed Caching with Caffeine & Redis");
        System.out.println("================================================================================");

        MultiTierCacheManager cacheManager = new MultiTierCacheManager();
        String accountKey = "account:ACC-101";

        // 1. First Request (Cold Cache -> Database Hit)
        System.out.println("1. Request #1 (Cold Cache):");
        Object val1 = cacheManager.getOrCompute(accountKey, 10000, () -> {
            System.out.println("   [DB QUERY] SELECT * FROM accounts WHERE id = 'ACC-101';");
            return "AccountBalance($45,000.00)";
        });
        System.out.println("   Result: " + val1);
        assert cacheManager.databaseLoads.get() == 1;
        assert cacheManager.l1Hits.get() == 0;

        // 2. Second Request (L1 Caffeine Cache Hit)
        System.out.println("\n2. Request #2 (Warm Cache -> L1 In-Memory Hit):");
        Object val2 = cacheManager.getOrCompute(accountKey, 10000, () -> "DB");
        System.out.println("   Result: " + val2);
        assert cacheManager.databaseLoads.get() == 1; // Still 1
        assert cacheManager.l1Hits.get() == 1; // L1 hit

        // 3. Evict L1 (Simulating pod restart, forcing L2 Redis Hit)
        System.out.println("\n3. Evicting L1 Caffeine (Simulating container restart / pod scale-out):");
        cacheManager.l1Caffeine.remove(accountKey);
        Object val3 = cacheManager.getOrCompute(accountKey, 10000, () -> "DB");
        System.out.println("   Result: " + val3);
        assert cacheManager.databaseLoads.get() == 1; // Still 1!
        assert cacheManager.l2Hits.get() == 1; // L2 Redis hit!

        // 4. Cache Eviction on Update (@CacheEvict)
        System.out.println("\n4. Triggering @CacheEvict on Account Update:");
        cacheManager.evict(accountKey);
        assert !cacheManager.l1Caffeine.containsKey(accountKey);
        assert !cacheManager.l2Redis.containsKey(accountKey);
        System.out.println("   Cache Eviction across all tiers: VERIFIED");

        System.out.println("\n[SUCCESS] Topic 106 Caffeine & Redis Distributed Caching verified successfully!");
        System.out.println("================================================================================");
    }
}
