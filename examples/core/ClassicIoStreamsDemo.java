import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Topic 45: Classic I/O Streams - Basic Example
 * Demonstrates character streams (BufferedReader / BufferedWriter) using UTF-8 encoding.
 */
public class ClassicIoStreamsDemo {

    public static void main(String[] args) throws IOException {
        File tempFile = File.createTempFile("classic_io_demo", ".txt");
        tempFile.deleteOnExit();

        // 1. Writing character data with BufferedWriter
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile, StandardCharsets.UTF_8))) {
            writer.write("SERVER_STATUS=HEALTHY");
            writer.newLine();
            writer.write("UPTIME_SECONDS=86400");
            writer.newLine();
            writer.write("ACTIVE_THREADS=16");
            writer.newLine();
            writer.flush(); // Forces any buffered bytes out to disk
        }

        System.out.println("File written successfully: " + tempFile.getName());

        // 2. Reading character data line by line with BufferedReader
        System.out.println("\nReading configuration entries:");
        try (BufferedReader reader = new BufferedReader(new FileReader(tempFile, StandardCharsets.UTF_8))) {
            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) {
                System.out.println("  Line " + lineNumber + ": " + line);
                lineNumber++;
            }
        }
    }
}
