public class SealedClassMechanics {

    // Sealed interface permitting strictly 3 implementations
    public sealed interface ServiceResult permits SuccessResult, FailureResult, PendingResult {
        String getMessage();
    }

    // 1. Final subclass: cannot be extended any further
    public static final class SuccessResult implements ServiceResult {
        private final String data;
        public SuccessResult(String data) { this.data = data; }
        public String getData() { return data; }
        @Override public String getMessage() { return "SUCCESS: " + data; }
    }

    // 2. Sealed subclass: extends sealed hierarchy but controls its own child permits
    public static sealed class FailureResult implements ServiceResult permits TimeoutFailure, AuthFailure {
        private final String error;
        public FailureResult(String error) { this.error = error; }
        @Override public String getMessage() { return "FAILED: " + error; }
    }

    public static final class TimeoutFailure extends FailureResult {
        public TimeoutFailure() { super("Network read timed out."); }
    }

    public static final class AuthFailure extends FailureResult {
        public AuthFailure() { super("JWT token expired."); }
    }

    // 3. Non-sealed subclass: explicitly opens hierarchy back up for unrestricted inheritance
    public static non-sealed class PendingResult implements ServiceResult {
        @Override public String getMessage() { return "PENDING: Awaiting worker node."; }
    }

    public static void main(String[] args) {
        System.out.println("=== Java 17+ Sealed Hierarchy Evaluation ===");

        ServiceResult s1 = new SuccessResult("Payload 0xFA31");
        ServiceResult s2 = new TimeoutFailure();
        ServiceResult s3 = new PendingResult();

        // Exhaustive switch expression without requiring 'default' branch!
        for (ServiceResult res : new ServiceResult[]{ s1, s2, s3 }) {
            String status = switch (res) {
                case SuccessResult s -> "Handled Success with data: " + s.getData();
                case TimeoutFailure t -> "Retrying after timeout: " + t.getMessage();
                case AuthFailure a -> "Redirecting to login: " + a.getMessage();
                case FailureResult f -> "Generic failure: " + f.getMessage();
                case PendingResult p -> "Enqueued in memory: " + p.getMessage();
            };
            System.out.println(status);
        }
    }
}
