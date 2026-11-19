/**
 * Topic 33: Generics Fundamentals - Basic Example
 * Demonstrates generic classes, bounded type parameters, and generic methods.
 */
public class GenericsFundamentalsDemo {

    // Generic class with type parameter T
    public static class KeyValuePair<K, V> {
        private final K key;
        private final V value;

        public KeyValuePair(K key, V value) {
            this.key = key;
            this.value = value;
        }

        public K getKey() {
            return key;
        }

        public V getValue() {
            return value;
        }

        @Override
        public String toString() {
            return "[" + key + " => " + value + "]";
        }
    }

    // Generic method with bounded type parameter <T extends Comparable<T>>
    public static <T extends Comparable<T>> T findMax(T first, T second) {
        return first.compareTo(second) >= 0 ? first : second;
    }

    public static void main(String[] args) {
        // Type inference in generic instantiation (diamond operator <>)
        KeyValuePair<String, Integer> portMapping = new KeyValuePair<>("http-port", 8080);
        KeyValuePair<Long, String> userSession = new KeyValuePair<>(1001L, "ACTIVE_TOKEN_99");

        System.out.println("Pair 1: " + portMapping);
        System.out.println("Pair 2: " + userSession);

        // Bounded generic method calls
        Integer maxInt = findMax(45, 92);
        String maxStr = findMax("Database", "Application");

        System.out.println("Max Integer: " + maxInt);
        System.out.println("Max String: " + maxStr);
    }
}
