---
id: topic-45
slug: classic-io-streams
topicNumber: 45
title: Classic I/O Streams
part: 'Part 1: Java Core'
sectionNumber: 12
sectionTitle: 'File I/O, NIO.2 & Date/Time'
versionBadge: 'Java 1.0+ (UTF-8 default: Java 18)'
difficulty: Intermediate
readingTime: 12 min read
shortDescription: >-
  Master byte vs character streams, BufferedReader / BufferedWriter, UTF-8
  character encoding, buffer flushing, and stream resource closing.
prerequisites:
  - 'Topic 31: Try-With-Resources & AutoCloseable'
  - 'Topic 07: Strings & Text Blocks'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Classic I/O Streams

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
Programs exist in volatile RAM memory: when a machine loses power or an application restarts, all in-memory variables and state vanish. To persist state or exchange data with hardware peripherals, network sockets, and disks, software must communicate using **Input/Output (I/O) Streams**.

In Java, an I/O stream is an ordered sequence of data flowing from a source to a destination. Java classic I/O (`java.io`) splits into two parallel worlds:
1. **Byte Streams (`InputStream` / `OutputStream`)**: Read and write raw 8-bit binary bytes (used for images, audio, ZIP files, and compiled bytecode).
2. **Character Streams (`Reader` / `Writer`)**: Read and write 16-bit Unicode characters, translating raw bytes into readable text using explicit character encodings like `UTF-8`.

Wrapping unbuffered streams inside **buffered streams** (`BufferedReader` / `BufferedWriter`) groups individual byte reads into in-memory chunks (typically 8 KB), reducing thousands of slow operating system kernel disk calls into single bulk operations.

**Real-World Analogy:**
Imagine drinking water. An unbuffered byte stream is like receiving water with an eye-dropper: you reach out your hand for a single droplet, put it in your mouth, and reach out again. It works, but it takes 10,000 slow physical motions to finish a glass. A buffered stream is drinking from a large cup: the system fills the 8 KB cup from the reservoir in one quick motion, and you drink quickly from the cup in memory.

---

### 2. Prerequisites
Before studying Classic I/O Streams, you should understand:
- [Topic 31: Try-With-Resources & AutoCloseable](file:///c:/Users/modym/OneDrive/Desktop/Java-Doc/content/part1-core/31-try-with-resources-and-autocloseable.md) — How deterministic resource closing prevents OS file handle leaks.
- [Topic 07: Strings & Text Blocks](file:///c:/Users/modym/OneDrive/Desktop/Java-Doc/content/part1-core/07-strings-and-text-blocks.md) — Character strings and immutability.

---

### 3. Syntax Breakdown

#### 1. Byte Streams vs Character Streams
| Type | Base Abstract Classes | File Implementations | Buffered Wrappers |
| :--- | :--- | :--- | :--- |
| **Byte** | `InputStream` / `OutputStream` | `FileInputStream` / `FileOutputStream` | `BufferedInputStream` / `BufferedOutputStream` |
| **Character** | `Reader` / `Writer` | `FileReader` / `FileWriter` | `BufferedReader` / `BufferedWriter` |

#### 2. Key Methods & Concepts
- `reader.readLine()`: Reads a line of text terminated by `\n` or `\r\n`. Returns `null` when end-of-stream (EOF) is reached.
- `writer.write(String)`: Writes string characters to the in-memory buffer.
- `writer.newLine()`: Writes the platform-dependent line separator (`\r\n` on Windows, `\n` on Linux/macOS).
- `writer.flush()`: Forces any buffered bytes residing in memory out to the OS filesystem immediately without closing the stream.
- `StandardCharsets.UTF_8`: The universal character encoding. **Always** specify encoding explicitly to avoid bugs caused by differing operating system defaults.

---

### 4. Runnable Examples

#### Example 1: Buffered File Read & Write with Explicit UTF-8
This example writes server status entries to a temporary file and reads them back line by line.

```java
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
```

**Expected Output:**
```
File written successfully: classic_io_demo...txt

Reading configuration entries:
  Line 1: SERVER_STATUS=HEALTHY
  Line 2: UPTIME_SECONDS=86400
  Line 3: ACTIVE_THREADS=16
```

---

#### Example 2: Realistic Application — Production Audit Log Rotator & Scanner
In real-world services, structured events are appended to audit journals and verified with strict encoding guarantees.

```java
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
```

**Expected Output:**
```
Recorded Audit Events (3 total):
  [1700000001] User: admin      Action: LOGIN_SUCCESS   IP: 192.168.1.10
  [1700000002] User: operator   Action: UPDATE_CONFIG   IP: 10.0.0.5
  [1700000003] User: root       Action: PASSWORD_RESET  IP: 192.168.1.25
```

---

### 5. Step-by-Step Execution Trace
1. **Stream Wrapping**: `new BufferedWriter(new FileWriter(file, StandardCharsets.UTF_8))` layers the stream decorators: `FileWriter` bridges characters to raw OS byte file descriptors, while `BufferedWriter` manages an 8 KB character buffer.
2. **Buffer Accumulation**: `writer.write(line)` appends characters directly to the internal character buffer in memory. No physical disk write occurs yet.
3. **Flushing & OS Commit**: `writer.flush()` (or closing the stream at the end of the `try-with-resources` block) dumps the 8 KB buffer to the operating system filesystem cache.
4. **Line Tokenization**: `reader.readLine()` accumulates characters until it encounters a newline (`\n` or `\r\n`), stripping the delimiter and returning the line string, or returning `null` upon reaching end-of-file.

---

### 6. Common Mistakes and Compiler Errors
- **Omitting Character Encoding**:
  ```java
  // DANGEROUS: Uses platform-default encoding (which varies across Windows and Linux)
  new FileReader("file.txt");
  ```
  *Solution*: Always specify `StandardCharsets.UTF_8`: `new FileReader("file.txt", StandardCharsets.UTF_8)`.
- **Forgetting to Flush or Close the Writer**:
  If an application terminates or crashes before calling `flush()` or `close()`, data lingering in the `BufferedWriter` buffer is permanently lost, leaving an empty or truncated file on disk.
  *Solution*: Always use `try-with-resources`, which guarantees automatic closing and flushing.
- **Reading Binary Files with Character Streams**:
  Using `FileReader` to copy an image (`.png`) or executable corrupts the binary payload because `Reader` converts arbitrary byte values into Unicode character points.
  *Solution*: Use `FileInputStream` / `FileOutputStream` or `Files.readAllBytes()` for binary files.

---

### 7. Best Practices and When NOT to Use
- **Always Wrap in Buffers**: Never use raw `FileReader` or `FileInputStream` directly in performance-critical loops without buffering.
- **Always Use Try-With-Resources**: Guarantees deterministic file handle cleanup even if exceptions are thrown.
- **Prefer Modern NIO.2 (`Files.readString` / `Files.lines`) for New Code**: Modern `java.nio.file.Files` methods are more concise and less prone to manual buffering mistakes.

---

### 8. Version Notes
- **Java 1.0 / 1.1**: Classic I/O streams introduced.
- **Java 7 (JSR 334)**: Streams implement `AutoCloseable`, enabling `try-with-resources`.
- **Java 11**: `FileReader` and `FileWriter` added constructors accepting explicit `Charset`.
- **Java 18 (JEP 400)**: UTF-8 became the default charset for all standard Java APIs across all platforms.

---

### 9. Summary Cheat Sheet
| Task | Recommended Class | Mode |
| :--- | :--- | :--- |
| Read Text Line-by-Line | `BufferedReader` | Character (`UTF-8`) |
| Write Formatted Text | `BufferedWriter` / `PrintWriter` | Character (`UTF-8`) |
| Read Raw Binary Data | `BufferedInputStream` | Byte |
| Write Raw Binary Data | `BufferedOutputStream` | Byte |

---

### 10. Exercises and Solutions

<details>
<summary>Exercise 1: Copy a binary file using classic byte streams</summary>

Write a method `void copyFile(File src, File dest)` using buffered byte streams.

**Solution:**
```java
public static void copyFile(File src, File dest) throws IOException {
    try (BufferedInputStream in = new BufferedInputStream(new FileInputStream(src));
         BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(dest))) {
        byte[] buffer = new byte[8192];
        int bytesRead;
        while ((bytesRead = in.read(buffer)) != -1) {
            out.write(buffer, 0, bytesRead);
        }
    }
}
```
</details>

<details>
<summary>Exercise 2: Count total lines in a file</summary>

Write a method using `BufferedReader` to count the total lines in a text file without loading the whole file into memory.

**Solution:**
```java
public static long countLines(File file) throws IOException {
    long lines = 0;
    try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
        while (reader.readLine() != null) {
            lines++;
        }
    }
    return lines;
}
```
</details>

<details>
<summary>Exercise 3: Explain the role of JEP 400 (UTF-8 by Default in Java 18)</summary>

**Solution:**
Prior to Java 18, when developers omitted the charset argument (e.g. `new FileReader(file)`), Java defaulted to the host operating system's native code page (such as `windows-1252` on Windows or `UTF-8` on Linux). This caused text files created on one machine to become corrupted ("mojibake") when opened on another. JEP 400 in Java 18 standardized the default encoding to `UTF-8` universally across all platforms.
</details>

---

### 11. Official Sources and References
- [Oracle Java Documentation — Basic I/O Tutorial](https://docs.oracle.com/javase/tutorial/essential/io/)
- [Java SE 21 API Specification — java.io.BufferedReader](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/BufferedReader.html)
- [JEP 400: UTF-8 by Default](https://openjdk.org/jeps/400)
