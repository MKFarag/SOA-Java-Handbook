import java.io.FileNotFoundException;
import java.io.IOException;

public class FileOrderImporterApp {

    // Domain Unchecked Exception
    public static class OrderImportException extends RuntimeException {
        public OrderImportException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class OrderBatchService {
        // High-level API does not pollute method signature with low-level IOException!
        public static int importOrders(String filePath) {
            try {
                return simulateDiskRead(filePath);
            } catch (IOException ex) {
                // Exception Translation: Checked IOException wrapped into Unchecked Domain Exception
                throw new OrderImportException("Failed to process order file: " + filePath, ex);
            }
        }

        private static int simulateDiskRead(String path) throws IOException {
            if (path.contains("missing")) {
                throw new FileNotFoundException("File not found on filesystem: " + path);
            }
            return 42; // Successfully imported 42 orders
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Checked-to-Unchecked Exception Translation ===");

        // Attempt 1: Successful import
        int count = OrderBatchService.importOrders("orders_2026_11_17.csv");
        System.out.println("Successfully imported order count: " + count);

        // Attempt 2: Error triggering translation
        try {
            OrderBatchService.importOrders("missing_archive.csv");
        } catch (OrderImportException ex) {
            System.out.println("Caught Domain Exception: " + ex.getMessage());
            System.out.println("Root Cause Class:        " + ex.getCause().getClass().getSimpleName());
            System.out.println("Root Cause Message:      " + ex.getCause().getMessage());
        }
    }
}
