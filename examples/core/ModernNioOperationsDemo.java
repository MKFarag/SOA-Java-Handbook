import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

/**
 * Topic 46: Modern NIO.2 File Operations - Basic Example
 * Demonstrates Path, Files.writeString, Files.readString, and stream lines().
 */
public class ModernNioOperationsDemo {

    public static void main(String[] args) throws IOException {
        Path tempFile = Files.createTempFile("nio2_demo", ".conf");
        tempFile.toFile().deleteOnExit();

        // 1. One-line string write (Java 11+)
        String initialConfig = "port=9090\nenv=staging\nmax_connections=250\n";
        Files.writeString(tempFile, initialConfig);
        System.out.println("Config written using Files.writeString to: " + tempFile.getFileName());

        // 2. Appending data atomically
        Files.writeString(tempFile, "ssl_enabled=true\n", StandardOpenOption.APPEND);

        // 3. One-line string read (Java 11+)
        String fullContent = Files.readString(tempFile);
        System.out.println("\nFull Read String Output:\n" + fullContent.trim());

        // 4. Lazy streaming of file lines (Files.lines)
        System.out.println("Streaming and filtering keys starting with 'ssl' or 'env':");
        try (var linesStream = Files.lines(tempFile)) {
            List<String> matched = linesStream
                    .filter(line -> line.startsWith("ssl") || line.startsWith("env"))
                    .toList();
            matched.forEach(line -> System.out.println("  " + line));
        }

        System.out.println("\nFile exists check: " + Files.exists(tempFile));
        System.out.println("File size in bytes: " + Files.size(tempFile));
    }
}
