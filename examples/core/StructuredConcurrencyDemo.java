import java.util.concurrent.StructuredTaskScope;

public class StructuredConcurrencyDemo {
    private static final ScopedValue<String> TRACE_ID = ScopedValue.newInstance();

    public static void main(String[] args) throws Exception {
        ScopedValue.where(TRACE_ID, "TXN-88219").run(() -> {
            try {
                executeWorkflow();
            } catch (Exception e) {
                System.err.println("Workflow failed: " + e.getMessage());
            }
        });
    }

    private static void executeWorkflow() throws Exception {
        System.out.println("Initiating structured concurrency workflow. Trace ID: " + TRACE_ID.get());

        try (var scope = StructuredTaskScope.open()) {
            StructuredTaskScope.Subtask<String> userTask = scope.fork(() -> {
                Thread.sleep(50);
                return "User Profile: Alice Vance (ID: 409)";
            });

            StructuredTaskScope.Subtask<String> ordersTask = scope.fork(() -> {
                Thread.sleep(70);
                return "Active Orders: 3 Pending Shipments";
            });

            scope.join();

            System.out.println("Subtask 1 State: " + userTask.state());
            System.out.println("Subtask 1 Result: " + userTask.get());
            System.out.println("Subtask 2 State: " + ordersTask.state());
            System.out.println("Subtask 2 Result: " + ordersTask.get());
            System.out.println("Structured workflow completed successfully.");
        }
    }
}
