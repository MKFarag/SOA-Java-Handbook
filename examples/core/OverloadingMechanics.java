public class OverloadingMechanics {

    // 1. Primitive exact match vs widening
    public static void display(int value) {
        System.out.println("display(int): " + value);
    }

    public static void display(long value) {
        System.out.println("display(long): " + value);
    }

    public static void display(double value) {
        System.out.println("display(double): " + value);
    }

    // 2. Overload with boxing (Integer) vs Varargs (int...)
    public static void process(Integer value) {
        System.out.println("process(Integer - Autoboxing): " + value);
    }

    public static void process(int... values) {
        System.out.println("process(int... - Varargs count=" + values.length + ")");
    }

    // 3. Realistic formatted logger with varargs
    public static void log(String level, String format, Object... args) {
        String message = (args == null || args.length == 0) ? format : String.format(format, args);
        System.out.printf("[%s] %s%n", level.toUpperCase(), message);
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Primitive Widening Precedence ===");
        short s = 25;
        display(s); // Widens short -> int (prefers smallest widening over double)

        int i = 100;
        display(i); // Exact match: display(int)

        long l = 5000L;
        display(l); // Exact match: display(long)

        float f = 3.14f;
        display(f); // Widens float -> double

        System.out.println("\n=== 2. Autoboxing vs Varargs Precedence ===");
        // When compiler chooses between Autoboxing and Varargs, Autoboxing wins!
        process(42); 

        // When multiple arguments are passed, Varargs is invoked:
        process(10, 20, 30);

        System.out.println("\n=== 3. Varargs Flexible Invocation ===");
        log("INFO", "Application system booting up");
        log("WARN", "Memory utilization reached %d%% across %d nodes", 84, 4);
        log("ERROR", "Connection to host '%s' timed out after %d ms", "db-primary.internal", 3000);
    }
}
