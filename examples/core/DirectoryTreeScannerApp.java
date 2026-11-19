import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

/**
 * Topic 46: Modern NIO.2 File Operations - Realistic Application
 * Demonstrates directory hierarchy traversal using Files.walk() and Files.find().
 */
public class DirectoryTreeScannerApp {

    public static void main(String[] args) throws IOException {
        Path tempDir = Files.createTempDirectory("workspace_scanner");
        tempDir.toFile().deleteOnExit();

        // Create sample nested directory tree
        Path configDir = tempDir.resolve("config");
        Path logsDir = tempDir.resolve("logs/archive");
        Files.createDirectories(configDir);
        Files.createDirectories(logsDir);

        Files.writeString(configDir.resolve("application.conf"), "server.port=8080\n");
        Files.writeString(configDir.resolve("database.json"), "{\"host\":\"localhost\"}\n");
        Files.writeString(logsDir.resolve("audit-2026.log"), "Audit ledger payload\n");

        System.out.println("Scanning directory: " + tempDir.getFileName());

        // 1. Files.walk(): Traverse entire tree up to depth 3
        System.out.println("\nDiscovered Files & Directories:");
        try (Stream<Path> paths = Files.walk(tempDir, 3)) {
            List<Path> allPaths = paths.sorted().toList();
            for (Path p : allPaths) {
                String type = Files.isDirectory(p) ? "[DIR] " : "[FILE]";
                System.out.println("  " + type + " " + tempDir.relativize(p));
            }
        }

        // 2. Files.find(): Query specific files matching a condition (.conf or .json)
        System.out.println("\nFound Config Files (.conf or .json):");
        try (Stream<Path> configs = Files.find(tempDir, 3, (p, attrs) -> {
            String name = p.getFileName().toString();
            return attrs.isRegularFile() && (name.endsWith(".conf") || name.endsWith(".json"));
        })) {
            configs.forEach(p -> System.out.println("  " + tempDir.relativize(p) + " (" + p.toFile().length() + " bytes)"));
        }

        // Clean up recursively
        try (Stream<Path> walk = Files.walk(tempDir)) {
            walk.sorted(Comparator.reverseOrder()).forEach(p -> {
                try { Files.delete(p); } catch (IOException ignored) {}
            });
        }
    }
}
