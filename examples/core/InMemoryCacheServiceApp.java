import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Topic 37: The Map Hierarchy - Realistic Application
 * Demonstrates a production-style Least Recently Used (LRU) Cache using LinkedHashMap.
 */
public class InMemoryCacheServiceApp {

    public static class LruCache<K, V> extends LinkedHashMap<K, V> {
        private final int maxCapacity;

        public LruCache(int maxCapacity) {
            // initialCapacity, loadFactor, accessOrder = true (LRU behavior)
            super(maxCapacity, 0.75f, true);
            this.maxCapacity = maxCapacity;
        }

        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > maxCapacity;
        }
    }

    public static void main(String[] args) {
        // Cache with max capacity of 3 items
        LruCache<String, String> sessionCache = new LruCache<>(3);

        sessionCache.put("session_1", "User_Alice");
        sessionCache.put("session_2", "User_Bob");
        sessionCache.put("session_3", "User_Charlie");

        System.out.println("Initial Cache Keys: " + sessionCache.keySet());

        // Access session_1 to mark it as recently used
        sessionCache.get("session_1");

        // Inserting session_4 causes eviction of the least recently used element (session_2)
        sessionCache.put("session_4", "User_Diana");

        System.out.println("Cache Keys after Eviction: " + sessionCache.keySet());
        System.out.println("Is session_2 retained? " + sessionCache.containsKey("session_2"));
        System.out.println("Is session_1 retained? " + sessionCache.containsKey("session_1"));
    }
}
