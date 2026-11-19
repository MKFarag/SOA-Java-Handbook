public class NestedClassMechanics {

    private String outerSecret = "TOP_SECRET_VAULT_KEY";
    private static String staticConfig = "CLUSTER_ID_880";

    // 1. Static Nested Class: Does NOT hold reference to outer object instance
    public static class StaticNestedHelper {
        public void inspect() {
            System.out.println("Static nested class accessing static outer: " + staticConfig);
            // Cannot access 'outerSecret' without an explicit Outer instance
        }
    }

    // 2. Non-Static Inner (Member) Class: Implicitly holds reference to Outer.this
    public class InnerEngine {
        public void revealSecret() {
            // Can access private instance fields of outer enclosing class directly!
            System.out.println("Inner class accessing outer private state: " + outerSecret);
        }
    }

    // 3. Local Inner Class & Anonymous Class
    public void executeTask(String taskName) {
        // Must be effectively final to be captured by local or anonymous classes
        final int taskId = 99;

        // Anonymous Inner Class implementing Runnable
        Runnable worker = new Runnable() {
            @Override
            public void run() {
                System.out.printf("Anonymous worker executing task '%s' (ID: %d)%n", taskName, taskId);
            }
        };
        worker.run();
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Static Nested Class ===");
        StaticNestedHelper helper = new StaticNestedHelper();
        helper.inspect();

        System.out.println("\n=== 2. Inner Member Class (Outer.this) ===");
        NestedClassMechanics outer = new NestedClassMechanics();
        InnerEngine engine = outer.new InnerEngine();
        engine.revealSecret();

        System.out.println("\n=== 3. Anonymous Class with Closure Capture ===");
        outer.executeTask("Database Migration");
    }
}
