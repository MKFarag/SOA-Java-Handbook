public class PatternMatchingMechanics {

    public record Point(int x, int y) {}
    public record Transaction(String id, double amount) {}

    public static String inspectValue(Object obj) {
        // Java 21+ Pattern matching for switch with guarded 'when' clauses and null handling
        return switch (obj) {
            case null -> "Received NULL reference";
            case Integer i when i < 0 -> "Negative integer: " + i;
            case Integer i -> "Positive integer or zero: " + i;
            case String s when s.isBlank() -> "Blank string";
            case String s -> "String of length " + s.length() + ": '" + s + "'";
            case Point(int x, int y) -> String.format("Point coordinates: (x=%d, y=%d)", x, y);
            case Transaction(String id, double amt) when amt > 10_000.0 ->
                String.format("HIGH VALUE Transaction %s for $%.2f", id, amt);
            case Transaction(String id, double amt) ->
                String.format("Standard Transaction %s for $%.2f", id, amt);
            default -> "Unhandled object type: " + obj.getClass().getSimpleName();
        };
    }

    public static void main(String[] args) {
        System.out.println("=== Java 21+ Pattern Matching for Switch & Records ===");

        System.out.println(inspectValue(null));
        System.out.println(inspectValue(-42));
        System.out.println(inspectValue(100));
        System.out.println(inspectValue("   "));
        System.out.println(inspectValue("Modern Java"));
        System.out.println(inspectValue(new Point(10, 25)));
        System.out.println(inspectValue(new Transaction("TXN-001", 500.0)));
        System.out.println(inspectValue(new Transaction("TXN-002", 50_000.0)));
    }
}
