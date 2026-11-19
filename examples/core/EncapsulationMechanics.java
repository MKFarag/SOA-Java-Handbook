public class EncapsulationMechanics {

    // 1. Broken Design: Public fields allow arbitrary corruption
    public static class VulnerableAccount {
        public double balance;
    }

    // 2. Encapsulated Design: Private state with validated mutators
    public static class RobustAccount {
        private double balance;

        public RobustAccount(double initialBalance) {
            if (initialBalance < 0.0) {
                throw new IllegalArgumentException("Initial balance cannot be negative.");
            }
            this.balance = initialBalance;
        }

        public double getBalance() {
            return balance;
        }

        public void deposit(double amount) {
            if (amount <= 0.0) {
                throw new IllegalArgumentException("Deposit must be positive: " + amount);
            }
            this.balance += amount;
        }

        public boolean withdraw(double amount) {
            if (amount > 0.0 && balance >= amount) {
                this.balance -= amount;
                return true;
            }
            return false;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Vulnerability of Public Fields ===");
        VulnerableAccount bad = new VulnerableAccount();
        bad.balance = -999999.0; // Invariant violated! No validation possible!
        System.out.println("Corrupted balance in bad account: $" + bad.balance);

        System.out.println("\n=== 2. Enforced Invariants via Encapsulation ===");
        RobustAccount secure = new RobustAccount(100.0);
        secure.deposit(50.0);
        System.out.println("Balance after deposit: $" + secure.getBalance());

        boolean withdrew = secure.withdraw(200.0); // Safely rejected: insufficient balance
        System.out.println("Overdraft attempt succeeded: " + withdrew);
        System.out.println("Final verified balance: $" + secure.getBalance());
    }
}
