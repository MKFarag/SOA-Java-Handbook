public class ConstructorChainingDemo {

    private static String initializationLog = "";

    // 1. Static Initializer Block: Runs once when class is first loaded by JVM
    static {
        initializationLog += "[1. Static Block] ";
    }

    // 2. Instance Initializer Block: Runs every time a new object is created, before constructor body
    {
        initializationLog += "[2. Instance Block] ";
    }

    private final String hostname;
    private final int port;
    private final boolean sslEnabled;

    // Master Constructor (3 arguments)
    public ConstructorChainingDemo(String hostname, int port, boolean sslEnabled) {
        this.hostname = hostname;
        this.port = port;
        this.sslEnabled = sslEnabled;
        initializationLog += String.format("[3. Master Constructor (%s:%d)] ", hostname, port);
    }

    // Overloaded Constructor: delegates to master with default SSL enabled
    public ConstructorChainingDemo(String hostname, int port) {
        this(hostname, port, true); // Constructor chaining via this(...)
    }

    // Overloaded Constructor: delegates to 2-arg constructor with default port 443
    public ConstructorChainingDemo(String hostname) {
        this(hostname, 443); // Constructor chaining via this(...)
    }

    public String getConfigDetails() {
        return String.format("Host: %s | Port: %d | SSL: %b", hostname, port, sslEnabled);
    }

    public static String getInitializationLog() {
        return initializationLog;
    }

    public static void main(String[] args) {
        System.out.println("=== Constructor Chaining & Initialization Sequence ===");
        ConstructorChainingDemo config = new ConstructorChainingDemo("api.gateway.internal");

        System.out.println("Resulting Configuration:");
        System.out.println(config.getConfigDetails());

        System.out.println("\nRecorded Lifecycle Execution Order:");
        System.out.println(ConstructorChainingDemo.getInitializationLog());
    }
}
