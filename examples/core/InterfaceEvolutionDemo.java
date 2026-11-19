public class InterfaceEvolutionDemo {

    public interface AuditableService {
        // Standard abstract method
        void processTransaction(String txnId, double amount);

        // Java 8: Default method providing backward-compatible implementation
        default void logAudit(String txnId, String status) {
            String timestamp = fetchTimestamp();
            System.out.printf("[%s] Audit Log: Txn %s marked as %s%n", timestamp, txnId, status);
        }

        // Java 8: Static utility method bound to interface namespace
        static boolean isValidTxnId(String txnId) {
            return txnId != null && txnId.startsWith("TXN-");
        }

        // Java 9: Private helper method inside interface for code reuse between default methods
        private String fetchTimestamp() {
            return "2026-11-17T15:30:00Z";
        }
    }

    public static class PaymentProcessor implements AuditableService {
        @Override
        public void processTransaction(String txnId, double amount) {
            if (!AuditableService.isValidTxnId(txnId)) {
                throw new IllegalArgumentException("Invalid transaction prefix.");
            }
            System.out.printf("Processing payment of $%.2f for %s%n", amount, txnId);
            logAudit(txnId, "SETTLED"); // Uses inherited default method
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Modern Java Interface Features (Default, Static, Private) ===");
        PaymentProcessor processor = new PaymentProcessor();
        processor.processTransaction("TXN-9021", 450.0);
    }
}
