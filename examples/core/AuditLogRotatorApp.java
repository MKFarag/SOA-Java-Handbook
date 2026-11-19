import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Topic 45: Classic I/O Streams - Realistic Application
 * Demonstrates a structured audit log writer and scanner with explicit encoding
 * and buffer management.
 */
public class AuditLogRotatorApp {

    public record AuditEvent(long timestamp, String user, String action, String ip) {}

    public static class AuditFileWriter {
        private final File targetFile;

        public AuditFileWriter(File targetFile) {
            this.targetFile = targetFile;
        }

        public void appendEvent(AuditEvent event) throws IOException {
            // append = true enables append mode
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(targetFile, StandardCharsets.UTF_8, true))) {
                String line = String.format("%d|%s|%s|%s",
                        event.timestamp(), event.user(), event.action(), event.ip());
                writer.write(line);
                writer.newLine();
                writer.flush();
            }
        }

        public List<AuditEvent> readAllEvents() throws IOException {
            List<AuditEvent> events = new ArrayList<>();
            try (BufferedReader reader = new BufferedReader(new FileReader(targetFile, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.isBlank()) continue;
                    String[] parts = line.split("\\|");
                    if (parts.length == 4) {
                        events.add(new AuditEvent(
                                Long.parseLong(parts[0]),
                                parts[1],
                                parts[2],
                                parts[3]
                        ));
                    }
                }
            }
            return events;
        }
    }

    public static void main(String[] args) throws IOException {
        File logFile = File.createTempFile("audit_ledger", ".log");
        logFile.deleteOnExit();

        AuditFileWriter writer = new AuditFileWriter(logFile);
        writer.appendEvent(new AuditEvent(1700000001L, "admin", "LOGIN_SUCCESS", "192.168.1.10"));
        writer.appendEvent(new AuditEvent(1700000002L, "operator", "UPDATE_CONFIG", "10.0.0.5"));
        writer.appendEvent(new AuditEvent(1700000003L, "root", "PASSWORD_RESET", "192.168.1.25"));

        List<AuditEvent> recorded = writer.readAllEvents();
        System.out.println("Recorded Audit Events (" + recorded.size() + " total):");
        for (AuditEvent ev : recorded) {
            System.out.printf("  [%d] User: %-10s Action: %-15s IP: %s%n",
                    ev.timestamp(), ev.user(), ev.action(), ev.ip());
        }
    }
}
