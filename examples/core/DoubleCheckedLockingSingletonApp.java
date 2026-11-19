/**
 * Topic 49: Synchronization & Memory Visibility - Realistic Application
 * Demonstrates thread-safe Double-Checked Locking Singleton using volatile
 * and atomic fund transfer with synchronized monitor ordering.
 */
public class DoubleCheckedLockingSingletonApp {

    public static class DatabaseConnectionPool {
        // volatile is MANDATORY to prevent instruction reordering during instantiation
        private static volatile DatabaseConnectionPool instance;
        private final long createdTimestamp;

        private DatabaseConnectionPool() {
            this.createdTimestamp = System.currentTimeMillis();
        }

        public static DatabaseConnectionPool getInstance() {
            // First check (without lock) for high-performance reading
            DatabaseConnectionPool result = instance;
            if (result == null) {
                synchronized (DatabaseConnectionPool.class) {
                    // Second check (with lock) prevents duplicate creation
                    result = instance;
                    if (result == null) {
                        instance = result = new DatabaseConnectionPool();
                    }
                }
            }
            return result;
        }

        public long getCreatedTimestamp() {
            return createdTimestamp;
        }
    }

    public static class BankAccount {
        private final String accountId;
        private double balance;

        public BankAccount(String accountId, double balance) {
            this.accountId = accountId;
            this.balance = balance;
        }

        public String getAccountId() { return accountId; }
        public synchronized double getBalance() { return balance; }

        public synchronized void deposit(double amount) {
            balance += amount;
        }

        public synchronized boolean withdraw(double amount) {
            if (balance >= amount) {
                balance -= amount;
                return true;
            }
            return false;
        }
    }

    // Deadlock-free account transfer ordering locks by account ID
    public static boolean transferFunds(BankAccount from, BankAccount to, double amount) {
        BankAccount firstLock = from.getAccountId().compareTo(to.getAccountId()) < 0 ? from : to;
        BankAccount secondLock = from.getAccountId().compareTo(to.getAccountId()) < 0 ? to : from;

        synchronized (firstLock) {
            synchronized (secondLock) {
                if (from.withdraw(amount)) {
                    to.deposit(amount);
                    return true;
                }
                return false;
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        // Verify singleton instance identity across threads
        DatabaseConnectionPool pool1 = DatabaseConnectionPool.getInstance();
        DatabaseConnectionPool pool2 = DatabaseConnectionPool.getInstance();
        System.out.println("Singleton Pool Same Instance: " + (pool1 == pool2));

        // Test multi-account synchronized transfer
        BankAccount accA = new BankAccount("ACC-01", 1000.0);
        BankAccount accB = new BankAccount("ACC-02", 500.0);

        boolean transferred = transferFunds(accA, accB, 250.0);
        System.out.println("Transfer Success: " + transferred);
        System.out.printf("Final Balances: %s=$%.2f, %s=$%.2f%n",
                accA.getAccountId(), accA.getBalance(), accB.getAccountId(), accB.getBalance());
    }
}
