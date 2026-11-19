public class BankingTransactionValidatorApp {

    // Domain Exception 1: Insufficient Balance
    public static class InsufficientFundsException extends RuntimeException {
        private final double currentBalance;
        private final double attemptedAmount;

        public InsufficientFundsException(String accountId, double current, double attempted) {
            super(String.format("Account %s overdraft: current $%.2f, attempted $%.2f", accountId, current, attempted));
            this.currentBalance = current;
            this.attemptedAmount = attempted;
        }

        public double getShortfall() {
            return attemptedAmount - currentBalance;
        }
    }

    // Domain Exception 2: Compliance Lock
    public static class AccountComplianceLockException extends RuntimeException {
        public AccountComplianceLockException(String accountId, String sanctionReason) {
            super(String.format("Account %s locked by compliance: %s", accountId, sanctionReason));
        }
    }

    public static class Account {
        private final String id;
        private double balance;
        private boolean isFrozen;

        public Account(String id, double initialBalance, boolean frozen) {
            this.id = id;
            this.balance = initialBalance;
            this.isFrozen = frozen;
        }

        public void withdraw(double amount) {
            if (isFrozen) {
                throw new AccountComplianceLockException(id, "AML Sanctions Review Pending");
            }
            if (amount > balance) {
                throw new InsufficientFundsException(id, balance, amount);
            }
            this.balance -= amount;
            System.out.printf("Successfully withdrew $%.2f from %s. Remaining: $%.2f%n", amount, id, balance);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Strongly-Typed Banking Domain Exceptions ===");

        Account activeAccount = new Account("CHK-100", 250.0, false);
        Account frozenAccount = new Account("CHK-999", 5000.0, true);

        // Test 1: Overdraft
        try {
            activeAccount.withdraw(400.0);
        } catch (InsufficientFundsException ex) {
            System.out.println("[REJECTED] " + ex.getMessage());
            System.out.printf("Overdraft Shortfall: $%.2f%n", ex.getShortfall());
        }

        // Test 2: Compliance Lockout
        try {
            frozenAccount.withdraw(100.0);
        } catch (AccountComplianceLockException ex) {
            System.out.println("[REJECTED] " + ex.getMessage());
        }
    }
}
