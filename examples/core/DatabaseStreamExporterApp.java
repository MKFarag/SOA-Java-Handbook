import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class DatabaseStreamExporterApp {

    public static class MockDatabaseClient implements AutoCloseable {
        public void executeQuery(String sql) {
            System.out.println("Executing SQL: " + sql);
        }

        @Override
        public void close() {
            System.out.println("MockDatabaseClient: Physical socket connection closed.");
        }
    }

    public static class MockStatement implements AutoCloseable {
        @Override
        public void close() {
            System.out.println("MockStatement: Cursor statement closed.");
        }
    }

    public static byte[] exportAuditReport(String querySql) throws IOException {
        // Multi-resource try-with-resources statement
        try (MockDatabaseClient db = new MockDatabaseClient();
             MockStatement stmt = new MockStatement();
             ByteArrayOutputStream outStream = new ByteArrayOutputStream()) {

            db.executeQuery(querySql);
            outStream.write("EXPORTED REPORT PAYLOAD: 2026-11-17".getBytes());
            return outStream.toByteArray();
        }
        // DB, Statement, and Stream are guaranteed closed even if exceptions occur!
    }

    public static void main(String[] args) throws IOException {
        System.out.println("=== Database Stream Exporter Cleanup Lifecycle ===");
        byte[] report = exportAuditReport("SELECT * FROM audit_ledger WHERE year = 2026");
        System.out.println("Exported Length: " + report.length + " bytes");
    }
}
