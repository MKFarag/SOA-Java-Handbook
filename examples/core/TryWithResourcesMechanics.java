public class TryWithResourcesMechanics {

    // Custom resource implementing AutoCloseable
    public static class ManagedConnection implements AutoCloseable {
        private final String resourceId;

        public ManagedConnection(String id) {
            this.resourceId = id;
            System.out.printf("[%s] Connection Opened.%n", resourceId);
        }

        public void doWork() {
            System.out.printf("[%s] Doing useful transactional work.%n", resourceId);
        }

        @Override
        public void close() {
            System.out.printf("[%s] Connection Closed Cleanly.%n", resourceId);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Automatic Resource Management (Reverse Close Order) ===");
        // Multiple resources: closed in REVERSE order of declaration
        try (ManagedConnection db = new ManagedConnection("Database");
             ManagedConnection audit = new ManagedConnection("AuditLog")) {

            db.doWork();
            audit.doWork();
        } // Resources auto-closed here before any catch/finally block!

        System.out.println("\n=== 2. Suppressed Exception Handling ===");
        try (FailingResource res = new FailingResource()) {
            throw new RuntimeException("Primary business logic failure!");
        } catch (Exception ex) {
            System.out.println("Primary Exception Caught: " + ex.getMessage());
            Throwable[] suppressed = ex.getSuppressed();
            if (suppressed.length > 0) {
                System.out.println("Suppressed Close Exception: " + suppressed[0].getMessage());
            }
        }
    }

    public static class FailingResource implements AutoCloseable {
        @Override
        public void close() throws Exception {
            throw new Exception("Secondary exception thrown during resource close()");
        }
    }
}
