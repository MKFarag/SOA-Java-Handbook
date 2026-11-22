---
id: topic-49
slug: modern-nio2-file-operations
topicNumber: 49
title: Modern NIO.2 File Operations
part: 'Part 1: Java Core'
sectionNumber: 12
sectionTitle: 'File I/O, NIO.2 & Date/Time'
versionBadge: Java 7+ / Java 11+ (readString/writeString)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: java.nio.file.Path and Files utility architecture, high-level string operations (readString, writeString), streaming pipelines (lines, walk, find), and atomic operations.
prerequisites:
  - 'Topic 45: Stream API: Pipeline Fundamentals'
  - 'Topic 48: Classic I/O Streams'
---

## Overview
NIO.2 (`java.nio.file`, introduced in Java 7 via JSR 203) replaces legacy `java.io.File` with the immutable `Path` interface and the static `Files` utility class. It provides typed exception propagation on failures, atomic filesystem operations, POSIX permission attributes, and streaming directory traversal (`Files.lines()`, `Files.walk()`).

---

## `java.io.File` vs Modern `java.nio.file`

| Dimension | Legacy `java.io.File` | Modern `java.nio.file.Path` & `Files` |
| :--- | :--- | :--- |
| **Error Handling** | Returns `false` silently on failure | Throws typed `IOException` (`NoSuchFileException`, etc.) |
| **Memory Architecture**| Eager array allocation (`list()`) | Lazy `Stream<Path>` traversal (`Files.walk()`) |
| **Atomic Operations** | Not supported | `StandardCopyOption.ATOMIC_MOVE` |
| **Symlink Support** | Limited / broken | Fully supported (`LinkOption.NOFOLLOW_LINKS`) |
| **Convenience I/O** | 10+ lines of stream boilerplate | `Files.readString(path)`, `Files.writeString(path, s)` |

---

## `Path` Operations & Directory Navigation

```java
Path baseDir = Path.of("/var", "log");          // Factory method (Java 11+)
Path auditLog = baseDir.resolve("audit.log");    // Appends: /var/log/audit.log
Path relative = baseDir.relativize(auditLog);    // Extracts relative segment: audit.log
Path normalized = Path.of("/var/log/../log/audit.log").normalize(); // Resolves .. -> /var/log/audit.log
```

---

## The `Files` Utility Catalog

| Method | Return | Description | Resource Management |
| :--- | :--- | :--- | :--- |
| `readString(path)` | `String` | Reads entire file into a UTF-8 String (Java 11+) | Closes automatically |
| `writeString(path, text)` | `Path` | Writes UTF-8 String in a single atomic call | Closes automatically |
| `readAllBytes(path)` | `byte[]` | Reads entire binary file into byte array | Closes automatically |
| `lines(path)` | `Stream<String>`| Lazily streams lines as strings | **Must wrap in try-with-resources!** |
| `walk(path, maxDepth)` | `Stream<Path>` | Lazily traverses directory tree recursively | **Must wrap in try-with-resources!** |
| `copy(src, dest, options)`| `Path` | Copies files with `REPLACE_EXISTING` | Closes stream |
| `move(src, dest, options)`| `Path` | Moves or renames with `ATOMIC_MOVE` | Operating system atomic rename |

---

## Implementation Example

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.util.stream.Stream;

public class Nio2PipelineDemo {
    public static void main(String[] args) throws IOException {
        Path tempDir = Files.createTempDirectory("nio2_demo_");

        try {
            Path sourceFile = tempDir.resolve("app.conf");
            Path targetFile = tempDir.resolve("app.conf.bak");

            // 1. One-line UTF-8 write
            Files.writeString(sourceFile, "DATABASE_URL=jdbc:postgresql://localhost:5432/db\nMAX_CONNECTIONS=50\n");

            // 2. Atomic copy replacing existing destination
            Files.copy(sourceFile, targetFile, StandardCopyOption.REPLACE_EXISTING);

            // 3. Lazy line streaming with try-with-resources
            System.out.println("--- Reading Configuration Lines ---");
            try (Stream<String> lines = Files.lines(sourceFile)) {
                lines.filter(l -> l.startsWith("DATABASE_URL"))
                     .forEach(System.out::println);
            }

            // 4. Directory tree walk
            System.out.println("--- Traversing Temporary Directory ---");
            try (Stream<Path> paths = Files.walk(tempDir, 1)) {
                paths.forEach(p -> System.out.println("Found node: " + p.getFileName()));
            }
        } finally {
            // Cleanup: delete directory and files recursively
            try (Stream<Path> walk = Files.walk(tempDir)) {
                walk.sorted(java.util.Comparator.reverseOrder())
                    .forEach(p -> {
                        try { Files.delete(p); } catch (IOException ignored) {}
                    });
            }
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
--- Reading Configuration Lines ---
DATABASE_URL=jdbc:postgresql://localhost:5432/db
--- Traversing Temporary Directory ---
Found node: nio2_demo_123456789
Found node: app.conf
Found node: app.conf.bak
```
</details>

---

## Pitfalls

- **Leaking File Descriptors with `Files.lines()`:** Unlike `readString()`, `Files.lines()` returns a lazy `Stream<String>` backed by an open OS file descriptor. Failing to close the stream via `try (Stream<String> s = Files.lines(path))` leaves file handles locked, blocking file deletions on Windows.
- **`OutOfMemoryError` via `readAllBytes()`:** Loading a 10 GB file into memory using `Files.readAllBytes()` or `Files.readString()` causes immediate heap exhaustion. For large files, stream chunks or use `Files.newInputStream()`.
- **`DirectoryNotEmptyException` on Deletion:** Calling `Files.delete(path)` on a directory containing files throws `DirectoryNotEmptyException`. Directories must be drained from leaves to root before deletion.

---

## Practice

### Question
Why is the following stream operation dangerous in production backend code?
```java
List<String> logs = Files.lines(Path.of("app.log"))
    .filter(line -> line.contains("ERROR"))
    .toList();
```

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. `Files.lines(path)` opens an underlying operating system file stream.
2. The returned stream implements `AutoCloseable` because it holds an open OS file handle.
3. Chaining `.toList()` terminal operation consumes the stream, but does **not** close the underlying stream handle automatically.
4. If this line executes repeatedly, the JVM exhausts file descriptors, leading to `IOException: Too many open files`.
5. Fix: Always enclose `Files.lines()` in `try (Stream<String> stream = Files.lines(path))`.

</details>
