import java.io.IOException;

public class CheckedVsUncheckedDemo {

    // 1. Checked Exception: Extends Exception (recoverable external condition)
    // Mandatory: Must be declared with 'throws' or caught immediately
    public static void connectToRemoteDevice(String ipAddress) throws IOException {
        if ("192.168.1.99".equals(ipAddress)) {
            throw new IOException("Host unreachable on port 8080: " + ipAddress);
        }
        System.out.println("Connected successfully to " + ipAddress);
    }

    // 2. Unchecked Exception: Extends RuntimeException (programming defect / invariant violation)
    // Optional: Does NOT require 'throws' clause
    public static int parsePositiveInt(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Input string cannot be null or blank.");
        }
        int val = Integer.parseInt(input);
        if (val < 0) {
            throw new IllegalArgumentException("Value must be non-negative: " + val);
        }
        return val;
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Mandatory Checked Exception Handling ===");
        try {
            connectToRemoteDevice("192.168.1.99");
        } catch (IOException ex) {
            System.out.println("Caught Expected Checked Exception: " + ex.getMessage());
        }

        System.out.println("\n=== 2. Unchecked RuntimeException Propagation ===");
        try {
            int parsed = parsePositiveInt("-45");
            System.out.println("Parsed: " + parsed);
        } catch (IllegalArgumentException ex) {
            System.out.println("Caught Expected Unchecked Exception: " + ex.getMessage());
        }
    }
}
