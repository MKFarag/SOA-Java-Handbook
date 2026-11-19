import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

/**
 * Topic 40: Lambdas & Functional Interfaces - Basic Example
 * Demonstrates the four core functional interfaces and effectively final variable capture.
 */
public class LambdaFunctionalInterfacesDemo {

    public static void main(String[] args) {
        // Effectively final local variable captured by closure
        String environment = "PRODUCTION";

        // 1. Predicate<T>: takes T, returns boolean
        Predicate<Integer> isHealthyPort = port -> port >= 1024 && port <= 65535;
        System.out.println("Port 8080 valid: " + isHealthyPort.test(8080));
        System.out.println("Port 80 valid:   " + isHealthyPort.test(80));

        // 2. Function<T, R>: takes T, transforms to R
        Function<String, String> formatTopic = raw -> "[" + environment + "] " + raw.trim().toUpperCase();
        System.out.println("Formatted Message: " + formatTopic.apply(" database connected "));

        // 3. Consumer<T>: takes T, returns void (side-effect)
        Consumer<String> auditLogger = msg -> System.out.println("[AUDIT LOG] " + msg);
        auditLogger.accept("User root authenticated successfully");

        // 4. Supplier<T>: takes nothing, returns T (lazy factory)
        Supplier<Long> timestampGenerator = System::currentTimeMillis;
        System.out.println("Generated Timestamp: " + (timestampGenerator.get() > 0));
    }
}
