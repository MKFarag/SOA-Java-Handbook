import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class BankingTransactionRepositoryApp {
    private static final String DB_URL = "jdbc:sqlite::memory:";

    public static void main(String[] args) throws Exception {
        System.out.println("Starting Banking Transaction ACID Engine...");

        try (Connection conn = DriverManager.getConnection(DB_URL)) {
            setupSchema(conn);

            System.out.println("Initial Balances:");
            printBalances(conn);

            // Attempt 1: Valid Transfer
            boolean tx1 = transferFunds(conn, "ACC-01", "ACC-02", 200.00);
            System.out.println("\nTransfer 1 (Valid: $200.00) Success? " + tx1);
            printBalances(conn);

            // Attempt 2: Insufficient Funds Transfer (Triggers Rollback)
            boolean tx2 = transferFunds(conn, "ACC-01", "ACC-02", 5000.00);
            System.out.println("\nTransfer 2 (Overdraft: $5000.00) Success? " + tx2);
            printBalances(conn);
        }
        System.out.println("Banking Transaction test completed successfully.");
    }

    private static void setupSchema(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE TABLE accounts (acc_id TEXT PRIMARY KEY, balance REAL NOT NULL)");
            stmt.execute("INSERT INTO accounts VALUES ('ACC-01', 1000.00)");
            stmt.execute("INSERT INTO accounts VALUES ('ACC-02', 500.00)");
        }
    }

    public static boolean transferFunds(Connection conn, String fromId, String toId, double amount) {
        String debitSql = "UPDATE accounts SET balance = balance - ? WHERE acc_id = ? AND balance >= ?";
        String creditSql = "UPDATE accounts SET balance = balance + ? WHERE acc_id = ?";

        try {
            conn.setAutoCommit(false); // Begin ACID Transaction

            try (PreparedStatement debitStmt = conn.prepareStatement(debitSql);
                 PreparedStatement creditStmt = conn.prepareStatement(creditSql)) {

                // 1. Debit
                debitStmt.setDouble(1, amount);
                debitStmt.setString(2, fromId);
                debitStmt.setDouble(3, amount);
                int rowsDebited = debitStmt.executeUpdate();

                if (rowsDebited == 0) {
                    System.out.println("  [Transaction Aborted] Insufficient balance or invalid account: " + fromId);
                    conn.rollback();
                    return false;
                }

                // 2. Credit
                creditStmt.setDouble(1, amount);
                creditStmt.setString(2, toId);
                int rowsCredited = creditStmt.executeUpdate();

                if (rowsCredited == 0) {
                    System.out.println("  [Transaction Aborted] Target account not found: " + toId);
                    conn.rollback();
                    return false;
                }

                conn.commit(); // Commit Transaction Atomically
                return true;
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            } finally {
                conn.setAutoCommit(true); // Restore default
            }
        } catch (SQLException e) {
            System.err.println("SQL Transaction Failure: " + e.getMessage());
            return false;
        }
    }

    private static void printBalances(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT acc_id, balance FROM accounts ORDER BY acc_id")) {
            while (rs.next()) {
                System.out.printf("  Account: %-8s | Balance: $%.2f%n", rs.getString("acc_id"), rs.getDouble("balance"));
            }
        }
    }
}
