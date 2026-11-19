import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

/**
 * Topic 37: The Map Hierarchy - Basic Example
 * Demonstrates HashMap, LinkedHashMap, and TreeMap features and modern Map methods.
 */
public class MapHierarchyDemo {

    public static void main(String[] args) {
        // 1. HashMap: O(1) average lookup, key hash-bucket storage
        Map<String, Integer> inventory = new HashMap<>();
        inventory.put("Laptops", 15);
        inventory.put("Monitors", 28);

        // Modern Map methods (Java 8+)
        inventory.putIfAbsent("Keyboards", 50);
        inventory.computeIfPresent("Laptops", (k, v) -> v + 5);
        int miceCount = inventory.getOrDefault("Mice", 0);

        System.out.println("HashMap Laptops: " + inventory.get("Laptops"));
        System.out.println("HashMap Mice (default): " + miceCount);

        // 2. LinkedHashMap: preserves insertion order
        Map<String, String> orderedConfig = new LinkedHashMap<>();
        orderedConfig.put("env", "production");
        orderedConfig.put("port", "8443");
        orderedConfig.put("ssl", "true");
        System.out.println("LinkedHashMap Keys: " + orderedConfig.keySet());

        // 3. TreeMap: NavigableMap sorted by key natural order
        NavigableMap<Integer, String> errorCodeMap = new TreeMap<>();
        errorCodeMap.put(500, "Internal Server Error");
        errorCodeMap.put(404, "Not Found");
        errorCodeMap.put(400, "Bad Request");
        errorCodeMap.put(403, "Forbidden");

        System.out.println("TreeMap Lowest Code: " + errorCodeMap.firstKey());
        System.out.println("TreeMap Client Errors (< 500): " + errorCodeMap.headMap(500).keySet());
    }
}
