import java.util.Date;

public class FinancialLedgerEntry {

    // Immutable design: final class prevents subclassing
    public static final class ImmutableLedger {
        private final String transactionId;
        private final double amount;
        private final Date timestamp; // Mutable object reference!

        public ImmutableLedger(String transactionId, double amount, Date timestamp) {
            if (transactionId == null || transactionId.isBlank()) {
                throw new IllegalArgumentException("Transaction ID required.");
            }
            if (timestamp == null) {
                throw new IllegalArgumentException("Timestamp required.");
            }
            this.transactionId = transactionId;
            this.amount = amount;
            // DEFENSIVE COPY on write: Clones incoming Date object so caller cannot mutate it
            this.timestamp = new Date(timestamp.getTime());
        }

        public String getTransactionId() { return transactionId; }
        public double getAmount() { return amount; }

        // DEFENSIVE COPY on read: Clones internal Date object so caller cannot mutate internal state
        public Date getTimestamp() {
            return new Date(timestamp.getTime());
        }

        public String describe() {
            return String.format("[%s] Amount: $%.2f at %tc", transactionId, amount, timestamp);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Immutable Ledger with Defensive Copying ===");
        Date transactionTime = new Date();
        ImmutableLedger entry = new ImmutableLedger("TXN-7701", 1250.75, transactionTime);

        System.out.println("Initial Ledger: " + entry.describe());

        // Attempt 1 to corrupt internal state via original reference:
        transactionTime.setTime(0L); // Set to Jan 1 1970
        System.out.println("After mutating original Date: " + entry.describe() + " (State preserved!)");

        // Attempt 2 to corrupt internal state via getter reference:
        entry.getTimestamp().setTime(0L);
        System.out.println("After mutating getter Date:   " + entry.describe() + " (State preserved!)");
    }
}
