public class AccountService {

    // Simple transaction record helper class
    public static class BankAccount {
        private final String accountNumber;
        private double balance;

        public BankAccount(String accountNumber, double initialBalance) {
            this.accountNumber = accountNumber;
            this.balance = initialBalance;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public double getBalance() {
            return balance;
        }

        public void deposit(double amount) {
            if (amount > 0) {
                balance += amount;
            }
        }

        public boolean withdraw(double amount) {
            if (amount > 0 && balance >= amount) {
                balance -= amount;
                return true;
            }
            return false;
        }
    }

    // Process a transfer between accounts, validating invariants
    public static boolean transferFunds(BankAccount source, BankAccount destination, double amount, double feePercent) {
        if (source == null || destination == null) {
            System.err.println("Error: Account references must not be null.");
            return false;
        }
        if (amount <= 0.0) {
            System.err.println("Error: Transfer amount must be strictly positive.");
            return false;
        }

        double fee = calculateFee(amount, feePercent);
        double totalDeduction = amount + fee;

        if (source.getBalance() < totalDeduction) {
            System.out.printf("Transfer failed: Insufficient funds in %s (Balance: $%.2f, Required: $%.2f)%n",
                    source.getAccountNumber(), source.getBalance(), totalDeduction);
            return false;
        }

        // Execute atomic state changes
        source.withdraw(totalDeduction);
        destination.deposit(amount);

        System.out.printf("Transferred $%.2f from %s to %s (Fee: $%.2f)%n",
                amount, source.getAccountNumber(), destination.getAccountNumber(), fee);
        return true;
    }

    // Pure helper calculation method
    private static double calculateFee(double amount, double feePercent) {
        if (feePercent <= 0.0) {
            return 0.0;
        }
        return amount * (feePercent / 100.0);
    }

    public static void main(String[] args) {
        BankAccount checking = new BankAccount("CHK-9041", 500.0);
        BankAccount savings = new BankAccount("SAV-3108", 100.0);

        System.out.println("=== Bank Transfer Simulation ===");
        System.out.printf("Initial Checking: $%.2f | Initial Savings: $%.2f%n",
                checking.getBalance(), savings.getBalance());

        // Attempt 1: Successful transfer with 1.5% fee
        boolean success1 = transferFunds(checking, savings, 200.0, 1.5);
        System.out.println("Transfer 1 status: " + (success1 ? "SUCCESS" : "FAILED"));
        System.out.printf("After 1: Checking = $%.2f | Savings = $%.2f%n",
                checking.getBalance(), savings.getBalance());

        // Attempt 2: Overdraft attempt
        boolean success2 = transferFunds(checking, savings, 1000.0, 1.5);
        System.out.println("Transfer 2 status: " + (success2 ? "SUCCESS" : "FAILED"));
        System.out.printf("After 2: Checking = $%.2f | Savings = $%.2f%n",
                checking.getBalance(), savings.getBalance());
    }
}
