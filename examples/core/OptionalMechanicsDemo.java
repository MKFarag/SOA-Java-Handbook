import java.util.Optional;

/**
 * Topic 44: Optional Type Handling - Basic Example
 * Demonstrates safe creation, conditional consumption, transformation, and unwrapping.
 */
public class OptionalMechanicsDemo {

    public static Optional<String> findConfigValue(String key) {
        if ("database.url".equals(key)) {
            return Optional.of("jdbc:postgresql://localhost:5432/main_db");
        }
        if ("database.pool.size".equals(key)) {
            return Optional.ofNullable("20");
        }
        return Optional.empty(); // Key not found
    }

    public static void main(String[] args) {
        // 1. Safe unwrapping with orElse() and orElseGet()
        String dbUrl = findConfigValue("database.url").orElse("jdbc:default");
        String missingKey = findConfigValue("unknown.key").orElse("FALLBACK_VALUE");

        System.out.println("Config URL:     " + dbUrl);
        System.out.println("Missing Fallback: " + missingKey);

        // 2. Transforming with map() and filter()
        Optional<Integer> poolSize = findConfigValue("database.pool.size")
                .map(Integer::parseInt)
                .filter(size -> size >= 10);

        System.out.println("Parsed Pool Size: " + poolSize.orElse(5));

        // 3. Conditional execution with ifPresentOrElse() (Java 9+)
        System.out.print("Audit Notification: ");
        findConfigValue("database.url").ifPresentOrElse(
                url -> System.out.println("Found valid DB endpoint: " + url),
                () -> System.out.println("Warning: DB endpoint unconfigured")
        );
    }
}
