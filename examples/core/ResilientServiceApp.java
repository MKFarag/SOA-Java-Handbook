public class ResilientServiceApp {

    public static class TaskExecutionResult {
        private final boolean successful;
        private final String message;

        public TaskExecutionResult(boolean success, String msg) {
            this.successful = success;
            this.message = msg;
        }

        public boolean isSuccessful() { return successful; }
        public String getMessage() { return message; }
    }

    // Safely executes tasks: recovers from Exception, but NEVER catches fatal Error (e.g. OutOfMemoryError)
    public static TaskExecutionResult executeSafely(Runnable task, String taskName) {
        try {
            System.out.printf("[Worker] Executing %s...%n", taskName);
            task.run();
            return new TaskExecutionResult(true, "Completed successfully");
        } catch (Exception ex) {
            // Recoverable application faults: log and provide degraded fallback
            System.err.printf("[Worker Warning] Recoverable failure in %s: %s%n", taskName, ex.getMessage());
            return new TaskExecutionResult(false, "Recovered from: " + ex.getClass().getSimpleName());
        }
        // Note: Fatal VM Errors (OutOfMemoryError, StackOverflowError) are NOT caught here,
        // allowing the JVM to terminate or trigger crash dumps properly.
    }

    public static void main(String[] args) {
        System.out.println("=== Resilient Worker Exception Boundary ===");

        // Task 1: Successful operation
        TaskExecutionResult r1 = executeSafely(() -> {
            System.out.println("Processing telemetry batch #1");
        }, "Telemetry-Task");
        System.out.println("Result 1: " + r1.getMessage());

        // Task 2: Recoverable logic exception
        TaskExecutionResult r2 = executeSafely(() -> {
            throw new IllegalArgumentException("Corrupt sensor packet checksum");
        }, "Checksum-Task");
        System.out.println("Result 2: " + r2.getMessage());
    }
}
