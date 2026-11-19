import java.util.ArrayList;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * Topic 41: Method References - Basic Example
 * Demonstrates the 4 kinds of method references: static, instance-specific,
 * instance-arbitrary, and constructor references.
 */
public class MethodReferencesDemo {

    public static class StringFormatter {
        public static String toTitleFormat(String input) {
            if (input == null || input.isEmpty()) return "";
            return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
        }
    }

    public static class AuditPrinter {
        public void printStandard(String message) {
            System.out.println("[AUDIT SINK] " + message);
        }
    }

    public record MessageToken(String value) {}

    public static void main(String[] args) {
        // 1. Static Method Reference (ClassName::staticMethod)
        // Equivalent to: s -> StringFormatter.toTitleFormat(s)
        Function<String, String> staticRef = StringFormatter::toTitleFormat;
        System.out.println("Static Ref Output: " + staticRef.apply("pROdUcTiOn"));

        // 2. Bound Instance Method Reference (object::instanceMethod)
        // Equivalent to: msg -> printer.printStandard(msg)
        AuditPrinter printer = new AuditPrinter();
        Consumer<String> boundRef = printer::printStandard;
        boundRef.accept("Cluster node healthy");

        // 3. Unbound Instance Method Reference (ClassName::instanceMethod)
        // Equivalent to: (str) -> str.toUpperCase()
        Function<String, String> unboundRef = String::toUpperCase;
        System.out.println("Unbound Ref Output: " + unboundRef.apply("latency"));

        // 4. Constructor Reference (ClassName::new)
        // Equivalent to: (val) -> new MessageToken(val)
        Function<String, MessageToken> tokenFactory = MessageToken::new;
        MessageToken token = tokenFactory.apply("AUTH_SESSION_99");
        System.out.println("Constructor Ref Output: " + token.value());

        // 5. Array Constructor Reference (Type[]::new)
        Function<Integer, String[]> arrayFactory = String[]::new;
        String[] emptyArray = arrayFactory.apply(3);
        System.out.println("Array Length: " + emptyArray.length);
    }
}
