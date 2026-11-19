import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class JdbcFundamentalsDemo {
    private static final String DB_URL = "jdbc:sqlite::memory:";

    public static void main(String[] args) throws Exception {
        System.out.println("=== JDBC In-Memory Database Execution ===");

        try (Connection conn = DriverManager.getConnection(DB_URL)) {
            System.out.println("Connected to: " + conn.getMetaData().getDatabaseProductName() +
                               " (v" + conn.getMetaData().getDatabaseProductVersion() + ")");

            // 1. Create Table (DDL)
            try (Statement stmt = conn.createStatement()) {
                stmt.execute("""
                    CREATE TABLE products (
                        id INTEGER PRIMARY KEY,
                        name TEXT NOT NULL,
                        price REAL NOT NULL,
                        stock INTEGER NOT NULL
                    )
                """);
                System.out.println("Table 'products' created successfully.");
            }

            // 2. Parameterized Insertion (PreparedStatement)
            String insertSql = "INSERT INTO products (id, name, price, stock) VALUES (?, ?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
                pstmt.setInt(1, 101);
                pstmt.setString(2, "Mechanical Keyboard");
                pstmt.setDouble(3, 89.99);
                pstmt.setInt(4, 25);
                pstmt.executeUpdate();

                pstmt.setInt(1, 102);
                pstmt.setString(2, "Wireless Mouse");
                pstmt.setDouble(3, 49.50);
                pstmt.setInt(4, 60);
                pstmt.executeUpdate();
                System.out.println("Inserted 2 products via PreparedStatement.");
            }

            // 3. Query Execution & ResultSet Iteration
            String querySql = "SELECT id, name, price, stock FROM products WHERE price > ? ORDER BY id";
            try (PreparedStatement pstmt = conn.prepareStatement(querySql)) {
                pstmt.setDouble(1, 50.0);
                try (ResultSet rs = pstmt.executeQuery()) {
                    System.out.println("\nQuery Results (Price > $50.00):");
                    while (rs.next()) {
                        int id = rs.getInt("id");
                        String name = rs.getString("name");
                        double price = rs.getDouble("price");
                        int stock = rs.getInt("stock");
                        System.out.printf("  [ID: %d] %-20s | $%.2f | Stock: %d%n", id, name, price, stock);
                    }
                }
            }
        }
        System.out.println("JDBC workflow completed successfully.");
    }
}
