---
id: topic-48
slug: classic-io-streams
topicNumber: 48
title: Classic I/O Streams
part: 'Part 1: Java Core'
sectionNumber: 12
sectionTitle: 'File I/O, NIO.2 & Date/Time'
versionBadge: Java 1.0+ / Java 18+ (UTF-8 default)
difficulty: Intermediate
readingTime: 7 min read
shortDescription: >-
  Reference: Java classic I/O (java.io), Byte Streams vs Character Streams, 8KB buffer decorators (BufferedReader/BufferedWriter), explicit UTF-8 encodings, and flush/close lifecycle.
prerequisites:
  - 'Topic 10: Strings & Text Blocks'
  - 'Topic 34: Try-With-Resources & AutoCloseable'
---

## Overview
Java classic I/O (`java.io`) provides synchronous stream-based data transfer between memory and external destinations (disk files, memory buffers, network sockets). It divides strictly into **Byte Streams** (8-bit raw binary data) and **Character Streams** (16-bit Unicode characters decoded via explicit character encodings).

---

## Byte vs Character Stream Taxonomy

```
                     java.io Base Stream Hierarchy
 ┌──────────────────────────────────┐      ┌──────────────────────────────────┐
 │    Byte Streams (8-bit Binary)   │      │   Character Streams (16-bit Text)│
 ├──────────────────────────────────┤      ├──────────────────────────────────┤
 │ InputStream       OutputStream   │      │ Reader            Writer         │
 │  - FileInputStream               │      │  - FileReader      - FileWriter  │
 │  - BufferedInputStream (8KB)     │      │  - BufferedReader  - BufferedWriter
 │  - ByteArrayInputStream          │      │  - InputStreamReader (Bridge)    │
 └──────────────────────────────────┘      └──────────────────────────────────┘
```

| Stream Family | Root Base Class | Unit of Transfer | File Node Implementation | Buffered Decorator (8KB) |
| :--- | :--- | :---: | :--- | :--- |
| **Input Byte** | `InputStream` | 8-bit byte | `FileInputStream` | `BufferedInputStream` |
| **Output Byte** | `OutputStream` | 8-bit byte | `FileOutputStream` | `BufferedOutputStream` |
| **Input Character** | `Reader` | 16-bit char (UTF-16) | `FileReader` | `BufferedReader` |
| **Output Character**| `Writer` | 16-bit char (UTF-16) | `FileWriter` | `BufferedWriter` |

---

## Decorator Stream Chaining & Buffering

`java.io` uses the **Decorator Pattern** to layer capabilities onto raw hardware streams:

```
 [ Disk File: data.txt ]
           │ (Raw OS byte stream)
           ▼
 FileInputStream ────────► Reads raw bytes from OS file descriptor
           │
           ▼
 InputStreamReader ──────► Decodes bytes to characters via StandardCharsets.UTF_8
           │
           ▼
 BufferedReader ─────────► Buffers 8192 characters in heap RAM; provides readLine()
```

- **Buffer Size:** Default buffer is 8,192 characters/bytes (8 KB), minimizing costly system kernel context switches (`read()` / `write()` syscalls).
- **`flush()`:** Forces buffered bytes from user-space JVM memory into the OS kernel file cache without closing the stream.

---

## Implementation Example

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;

public class ClassicIoPipelineDemo {
    public static void main(String[] args) {
        File tempFile = new File(System.getProperty("java.io.tmpdir"), "telemetry.log");

        // 1. Buffered Character Writing with explicit UTF-8 encoding
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream(tempFile), StandardCharsets.UTF_8))) {

            writer.write("TIMESTAMP=2026-11-22T12:00:00Z | LEVEL=INFO | HOST=node-01");
            writer.newLine();
            writer.write("TIMESTAMP=2026-11-22T12:00:05Z | LEVEL=WARN | HOST=node-02");
            writer.newLine();
            writer.flush(); // Enforce flush before leaving block
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 2. Buffered Character Reading line-by-line
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new FileInputStream(tempFile), StandardCharsets.UTF_8))) {

            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) { // readLine returns null on EOF
                System.out.printf("[%02d] %s%n", lineNumber++, line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            tempFile.deleteOnExit();
        }
    }
}
```

<details data-type="output">
<summary>View Output</summary>

```text
[01] TIMESTAMP=2026-11-22T12:00:00Z | LEVEL=INFO | HOST=node-01
[02] TIMESTAMP=2026-11-22T12:00:05Z | LEVEL=WARN | HOST=node-02
```
</details>

---

## Pitfalls

- **Unclosed Streams & Resource Leaks:** Omitting `close()` or failing to wrap streams in `try-with-resources` leaks operating system file descriptors. If descriptors are exhausted, the JVM cannot open any new files or sockets.
- **Relying on Default Encoding:** Pre-Java 18, `FileReader` used the host OS default encoding (`Windows-1252` on Windows, `UTF-8` on Linux). Files saved on one machine failed decoding on another. Always pass `StandardCharsets.UTF_8` explicitly.
- **Reading Binary Data with Readers:** Using `FileReader` or `BufferedReader` to process binary formats (JPEG images, ZIP files) corrupts data because character decoders alter invalid byte sequences. Use `InputStream` for binary data.

---

## Practice

### Question
What does `BufferedReader.readLine()` return when it reaches the End of File (EOF)?

<details data-type="solution">
<summary>Reveal Answer</summary>

### Explanation
1. Unlike `read()`, which returns integer `-1` at EOF, `readLine()` processes sequences of characters into a `String`.
2. When the end of the stream is reached without reading any characters, `readLine()` returns `null`.
3. Standard idiom: `while ((line = reader.readLine()) != null) { ... }`.

</details>
