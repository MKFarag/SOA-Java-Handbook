import fs from 'node:fs';
import path from 'node:path';

const TOPICS_PATH = path.resolve('src/data/topics.ts');
let content = fs.readFileSync(TOPICS_PATH, 'utf-8');

if (content.includes("id: 'topic-45'")) {
  console.log('Topic 45 already exists in topics.ts.');
  process.exit(0);
}

const section12Topics = `
  // Topic 45: Classic I/O Streams
  {
    id: 'topic-45',
    slug: 'classic-io-streams',
    topicNumber: 45,
    title: 'Classic I/O Streams',
    part: 'Part 1: Java Core',
    sectionNumber: 12,
    sectionTitle: 'File I/O, NIO.2 & Date/Time',
    versionBadge: 'Java 1.0+ (UTF-8 default: Java 18)',
    difficulty: 'Intermediate',
    readingTime: '12 min read',
    shortDescription: 'Master byte vs character streams, BufferedReader / BufferedWriter, UTF-8 character encoding, buffer flushing, and stream resource closing.',
    prerequisites: [
      'Topic 31: Try-With-Resources & AutoCloseable',
      'Topic 07: Strings & Text Blocks'
    ],
    whatAndWhy: {
      definition: 'I/O Streams convey ordered sequences of data to and from files, sockets, and hardware. Byte streams handle raw 8-bit binary data; character streams translate bytes into characters using explicit encodings.',
      analogy: 'Drinking water: an unbuffered stream is an eye-dropper where every single droplet requires a physical reach. A buffered stream is drinking from an 8 KB glass filled in one quick OS action.',
      whyItExists: 'In-memory RAM variables are volatile. File I/O streams provide persistent storage across machine restarts.'
    },
    syntaxBreakdown: {
      title: 'Buffered Character Stream Syntax',
      codeSnippet: \`try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, StandardCharsets.UTF_8))) {
    writer.write("KEY=VALUE");
    writer.newLine();
    writer.flush();
}

try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) { ... }
}\`,
      explanation: 'Always wrap readers and writers in buffered decorators with explicit UTF-8 charset.',
      tokens: [
        { token: 'BufferedReader', explanation: 'Reads character streams with in-memory buffering.' },
        { token: 'BufferedWriter', explanation: 'Buffers character writes to minimize OS disk operations.' },
        { token: 'StandardCharsets.UTF_8', explanation: 'Universal Unicode character encoding format.' },
        { token: 'flush()', explanation: 'Forces buffered in-memory bytes out to disk.' }
      ]
    },
    examples: [
      {
        id: '45-1',
        title: 'Buffered File Read & Write with UTF-8',
        type: 'basic',
        description: 'Demonstrates writing structured text configuration entries and reading line by line.',
        filename: 'ClassicIoStreamsDemo.java',
        code: \`import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class ClassicIoStreamsDemo {
    public static void main(String[] args) throws IOException {
        File tempFile = File.createTempFile("classic_io_demo", ".txt");
        tempFile.deleteOnExit();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile, StandardCharsets.UTF_8))) {
            writer.write("SERVER_STATUS=HEALTHY");
            writer.newLine();
            writer.write("UPTIME_SECONDS=86400");
            writer.newLine();
            writer.write("ACTIVE_THREADS=16");
            writer.newLine();
            writer.flush();
        }

        System.out.println("File written successfully: " + tempFile.getName());

        System.out.println("\\nReading configuration entries:");
        try (BufferedReader reader = new BufferedReader(new FileReader(tempFile, StandardCharsets.UTF_8))) {
            String line;
            int lineNumber = 1;
            while ((line = reader.readLine()) != null) {
                System.out.println("  Line " + lineNumber + ": " + line);
                lineNumber++;
            }
        }
    }
}\`,
        output: \`File written successfully: classic_io_demo...txt

Reading configuration entries:
  Line 1: SERVER_STATUS=HEALTHY
  Line 2: UPTIME_SECONDS=86400
  Line 3: ACTIVE_THREADS=16\`,
        stepByStep: [
          'BufferedWriter buffers text into memory and commits via flush().',
          'BufferedReader reads lines sequentially until reaching end-of-file (null).'
        ]
      },
      {
        id: '45-2',
        title: 'Structured Audit Log Rotator & Scanner',
        type: 'realistic',
        description: 'Appends audit log events to file in UTF-8 format and scans them into typed records.',
        filename: 'AuditLogRotatorApp.java',
        code: \`import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class AuditLogRotatorApp {
    public record AuditEvent(long timestamp, String user, String action, String ip) {}

    public static class AuditFileWriter {
        private final File targetFile;
        public AuditFileWriter(File targetFile) { this.targetFile = targetFile; }

        public void appendEvent(AuditEvent event) throws IOException {
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(targetFile, StandardCharsets.UTF_8, true))) {
                writer.write(String.format("%d|%s|%s|%s", event.timestamp(), event.user(), event.action(), event.ip()));
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
                    String[] parts = line.split("\\\\|");
                    if (parts.length == 4) {
                        events.add(new AuditEvent(Long.parseLong(parts[0]), parts[1], parts[2], parts[3]));
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
            System.out.printf("  [%d] User: %-10s Action: %-15s IP: %s%n", ev.timestamp(), ev.user(), ev.action(), ev.ip());
        }
    }
}\`,
        output: \`Recorded Audit Events (3 total):
  [1700000001] User: admin      Action: LOGIN_SUCCESS   IP: 192.168.1.10
  [1700000002] User: operator   Action: UPDATE_CONFIG   IP: 10.0.0.5
  [1700000003] User: root       Action: PASSWORD_RESET  IP: 192.168.1.25\`,
        stepByStep: [
          'Appends pipe-delimited records using FileWriter append mode.',
          'BufferedReader parses events line-by-line without buffering full file on heap.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Omitting Explicit Charset',
        cause: 'Relying on platform-default charset causes file corruption across Windows and Linux.',
        solution: 'Always pass StandardCharsets.UTF_8 explicitly.'
      },
      {
        title: 'Forgetting to Flush Buffered Stream',
        cause: 'Terminating an application before flush() or close() discards bytes in the 8 KB memory buffer.',
        solution: 'Always use try-with-resources to guarantee automatic close and flush.'
      }
    ],
    bestPractices: {
      doList: [
        'Always wrap raw file streams in BufferedReader or BufferedWriter.',
        'Use StandardCharsets.UTF_8 universally.',
        'Use try-with-resources for deterministic file handle cleanup.'
      ],
      dontList: [
        'Never use character streams (FileReader) to copy raw binary images or audio.',
        'Never ignore IOException.'
      ],
      whenNotToUse: 'Do not use classic java.io streams for new code if modern NIO.2 Files utility methods fit.'
    },
    versionNotes: {
      introduced: 'Java 1.0 / 1.1',
      status: 'Stable',
      compatibilityNotes: 'Java 7 added AutoCloseable. Java 18 (JEP 400) made UTF-8 the universal default.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Classic I/O Streams Cheat Sheet',
      headers: ['Data Mode', 'Base Class', 'Buffered Wrapper', 'Use Case'],
      rows: [
        ['Character', 'Reader / Writer', 'BufferedReader / BufferedWriter', 'Text, logs, CSV, JSON'],
        ['Byte', 'InputStream / OutputStream', 'BufferedInputStream / BufferedOutputStream', 'Images, ZIP, compiled classes']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'File Line Counter',
        prompt: 'Count total lines in a file using BufferedReader.',
        solution: 'long count = 0; try (BufferedReader r = new BufferedReader(new FileReader(f, StandardCharsets.UTF_8))) { while (r.readLine() != null) count++; } return count;',
        explanation: 'readLine() returns null upon reaching EOF.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.io.BufferedReader',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/BufferedReader.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 46: Modern NIO.2 File Operations
  {
    id: 'topic-46',
    slug: 'modern-nio2-file-operations',
    topicNumber: 46,
    title: 'Modern NIO.2 File Operations',
    part: 'Part 1: Java Core',
    sectionNumber: 12,
    sectionTitle: 'File I/O, NIO.2 & Date/Time',
    versionBadge: 'Java 7+ (writeString/readString: Java 11)',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master Path, Files utility methods (readString, writeString, lines, walk, find), atomic operations, and recursive directory tree traversal.',
    prerequisites: [
      'Topic 45: Classic I/O Streams',
      'Topic 42: Stream API: Pipeline Fundamentals'
    ],
    whatAndWhy: {
      definition: 'NIO.2 (java.nio.file) is Java modern filesystem API centered on Path and Files. It replaces java.io.File with rich typed exceptions, atomic file moves, symbolic link support, and Stream integration.',
      analogy: 'Enterprise warehouse tracking: old File returned false with zero explanation when failing. NIO.2 provides full barcode tracking (Path), exact failure diagnostics, and automated conveyor belts (Files.walk()).',
      whyItExists: 'Legacy File API suffered from silent boolean failure returns, poor cross-platform path handling, and lack of atomic filesystem guarantees.'
    },
    syntaxBreakdown: {
      title: 'NIO.2 Path & Files Operations',
      codeSnippet: \`Path path = Path.of("config", "app.conf");
Files.writeString(path, "port=8080\\n");
String content = Files.readString(path);
try (Stream<Path> stream = Files.walk(path.getParent())) { ... }\`,
      explanation: 'Path.of provides cross-platform path construction. Files utility provides atomic and streaming methods.',
      tokens: [
        { token: 'Path.of(...)', explanation: 'Platform-independent path constructor (Java 11+).' },
        { token: 'Files.readString(p)', explanation: 'Reads entire file into String in one line.' },
        { token: 'Files.lines(p)', explanation: 'Streams lines lazily from disk without loading full file on heap.' },
        { token: 'Files.walk(p, depth)', explanation: 'Recursively streams all directory paths.' }
      ]
    },
    examples: [
      {
        id: '46-1',
        title: 'Modern File Operations with writeString, readString & lines',
        type: 'basic',
        description: 'Demonstrates one-line file reading, writing, atomic appending, and lazy line streaming.',
        filename: 'ModernNioOperationsDemo.java',
        code: \`import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class ModernNioOperationsDemo {
    public static void main(String[] args) throws IOException {
        Path tempFile = Files.createTempFile("nio2_demo", ".conf");
        tempFile.toFile().deleteOnExit();

        String initialConfig = "port=9090\\nenv=staging\\nmax_connections=250\\n";
        Files.writeString(tempFile, initialConfig);
        System.out.println("Config written using Files.writeString to: " + tempFile.getFileName());

        Files.writeString(tempFile, "ssl_enabled=true\\n", StandardOpenOption.APPEND);

        String fullContent = Files.readString(tempFile);
        System.out.println("\\nFull Read String Output:\\n" + fullContent.trim());

        System.out.println("Streaming and filtering keys starting with 'ssl' or 'env':");
        try (var linesStream = Files.lines(tempFile)) {
            List<String> matched = linesStream
                    .filter(line -> line.startsWith("ssl") || line.startsWith("env"))
                    .toList();
            matched.forEach(line -> System.out.println("  " + line));
        }

        System.out.println("\\nFile exists check: " + Files.exists(tempFile));
        System.out.println("File size in bytes: " + Files.size(tempFile));
    }
}\`,
        output: \`Config written using Files.writeString to: nio2_demo...conf

Full Read String Output:
port=9090
env=staging
max_connections=250
ssl_enabled=true

Streaming and filtering keys starting with 'ssl' or 'env':
  env=staging
  ssl_enabled=true

File exists check: true
File size in bytes: 59\`,
        stepByStep: [
          'Files.writeString writes and appends text with platform encoding.',
          'Files.readString extracts file content into a String.',
          'Files.lines streams file contents lazily, filtered via Stream API.'
        ]
      },
      {
        id: '46-2',
        title: 'Recursive Directory Tree Scanner & Cleaner',
        type: 'realistic',
        description: 'Scans directory trees using Files.walk() and Files.find() with depth limits.',
        filename: 'DirectoryTreeScannerApp.java',
        code: \`import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

public class DirectoryTreeScannerApp {
    public static void main(String[] args) throws IOException {
        Path tempDir = Files.createTempDirectory("workspace_scanner");
        tempDir.toFile().deleteOnExit();

        Path configDir = tempDir.resolve("config");
        Path logsDir = tempDir.resolve("logs/archive");
        Files.createDirectories(configDir);
        Files.createDirectories(logsDir);

        Files.writeString(configDir.resolve("application.conf"), "server.port=8080\\n");
        Files.writeString(configDir.resolve("database.json"), "{\\"host\\":\\"localhost\\"}\\n");
        Files.writeString(logsDir.resolve("audit-2026.log"), "Audit ledger payload\\n");

        System.out.println("Scanning directory: " + tempDir.getFileName());

        System.out.println("\\nDiscovered Files & Directories:");
        try (Stream<Path> paths = Files.walk(tempDir, 3)) {
            List<Path> allPaths = paths.sorted().toList();
            for (Path p : allPaths) {
                String type = Files.isDirectory(p) ? "[DIR] " : "[FILE]";
                System.out.println("  " + type + " " + tempDir.relativize(p));
            }
        }

        System.out.println("\\nFound Config Files (.conf or .json):");
        try (Stream<Path> configs = Files.find(tempDir, 3, (p, attrs) -> {
            String name = p.getFileName().toString();
            return attrs.isRegularFile() && (name.endsWith(".conf") || name.endsWith(".json"));
        })) {
            configs.forEach(p -> System.out.println("  " + tempDir.relativize(p) + " (" + p.toFile().length() + " bytes)"));
        }

        try (Stream<Path> walk = Files.walk(tempDir)) {
            walk.sorted(Comparator.reverseOrder()).forEach(p -> {
                try { Files.delete(p); } catch (IOException ignored) {}
            });
        }
    }
}\`,
        output: \`Scanning directory: workspace_scanner...

Discovered Files & Directories:
  [DIR]  
  [DIR]  config
  [FILE] config/application.conf
  [FILE] config/database.json
  [DIR]  logs
  [DIR]  logs/archive
  [FILE] logs/archive/audit-2026.log

Found Config Files (.conf or .json):
  config/application.conf (17 bytes)
  config/database.json (21 bytes)\`,
        stepByStep: [
          'Constructs directory hierarchy using Files.createDirectories.',
          'Files.walk traverses tree up to depth 3.',
          'Files.find filters configuration files by extension and attributes.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Unclosed Files.lines Stream Handle Leak',
        cause: 'Failing to close Files.lines() leaves OS file descriptors open, causing file lock errors on Windows.',
        solution: 'Always wrap Files.lines() and Files.walk() inside a try-with-resources block.'
      }
    ],
    bestPractices: {
      doList: [
        'Default to Path.of() and Files methods for all filesystem access.',
        'Use StandardCopyOption.ATOMIC_MOVE for safe file replacement.',
        'Use Files.lines() rather than readAllLines() for large files.'
      ],
      dontList: [
        'Never construct paths using manual string concatenation (use path.resolve()).'
      ],
      whenNotToUse: 'Do not use Files.readString() on multi-gigabyte files (loads entire file into RAM).'
    },
    versionNotes: {
      introduced: 'Java 7 (JSR 203)',
      status: 'Stable',
      compatibilityNotes: 'Java 8 added Stream support to Files. Java 11 added readString() and writeString().',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'Modern NIO.2 Operations Cheat Sheet',
      headers: ['Task', 'NIO.2 Method', 'Complexity / Behavior'],
      rows: [
        ['Read String', 'Files.readString(path)', 'One-line UTF-8 read'],
        ['Write String', 'Files.writeString(path, text)', 'One-line UTF-8 write'],
        ['Stream Lines', 'Files.lines(path)', 'Lazy disk stream'],
        ['Directory Walk', 'Files.walk(path, depth)', 'Recursive tree stream']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Spot the Bug',
        title: 'Deleting Non-Empty Directory',
        prompt: 'Why does Files.delete(dir) throw DirectoryNotEmptyException?',
        solution: 'Standard OS filesystems forbid deleting directories containing child files. Walk the tree in reverse order to delete child files first, then delete the directory.',
        explanation: 'Recursive deletion must proceed bottom-up.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.nio.file.Files',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html',
        organization: 'Oracle'
      }
    ]
  },

  // Topic 47: Date and Time API (java.time)
  {
    id: 'topic-47',
    slug: 'date-and-time-api',
    topicNumber: 47,
    title: 'Date and Time API (java.time)',
    part: 'Part 1: Java Core',
    sectionNumber: 12,
    sectionTitle: 'File I/O, NIO.2 & Date/Time',
    versionBadge: 'Java 8+ (JSR 310)',
    difficulty: 'Intermediate',
    readingTime: '13 min read',
    shortDescription: 'Master immutable, thread-safe date/time handling: Instant, LocalDate, ZonedDateTime, Duration, Period, and DateTimeFormatter.',
    prerequisites: [
      'Topic 04: Variables, Identifiers & Primitive Data Types',
      'Topic 16: Classes, Objects & Memory Layout'
    ],
    whatAndWhy: {
      definition: 'java.time (JSR 310) is Java modern, immutable, and thread-safe date/time framework. It separates machine time (Instant) from human calendar time (LocalDate, ZonedDateTime).',
      analogy: 'Flight tracking: machine time (Instant) is an atomic clock number agreed upon by satellites worldwide. Human time (ZonedDateTime) is the gate clock showing local departure time in New York or Tokyo.',
      whyItExists: 'Legacy java.util.Date and Calendar were mutable, 0-indexed months (January=0), and SimpleDateFormat was not thread-safe.'
    },
    syntaxBreakdown: {
      title: 'Core java.time Class Roles',
      codeSnippet: \`Instant nowUtc = Instant.now();
LocalDate date = LocalDate.of(2026, 3, 17);
ZonedDateTime zdt = ZonedDateTime.now(ZoneId.of("America/New_York"));
Duration timeAmount = Duration.ofHours(4);
Period dateAmount = Period.ofWeeks(2);\`,
      explanation: 'All java.time instances are immutable. Methods like plusDays() return new instances.',
      tokens: [
        { token: 'Instant', explanation: 'UTC machine timestamp (nanoseconds since epoch).' },
        { token: 'LocalDate', explanation: 'Date without time or timezone (2026-03-17).' },
        { token: 'ZonedDateTime', explanation: 'Full human timestamp with IANA timezone rules.' },
        { token: 'Duration / Period', explanation: 'Duration measures time (hours/mins); Period measures calendar (days/months).' }
      ]
    },
    examples: [
      {
        id: '47-1',
        title: 'Core java.time Classes, Durations, and Formatting',
        type: 'basic',
        description: 'Demonstrates Instant, LocalDate, ZonedDateTime, Duration, Period, and DateTimeFormatter.',
        filename: 'DateTimeApiDemo.java',
        code: \`import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeApiDemo {
    public static void main(String[] args) {
        Instant epochNow = Instant.ofEpochMilli(1700000000000L);
        System.out.println("UTC Machine Instant: " + epochNow);

        LocalDate releaseDate = LocalDate.of(2026, 3, 17);
        LocalTime maintenanceWindow = LocalTime.of(3, 30, 0);
        LocalDateTime schedule = LocalDateTime.of(releaseDate, maintenanceWindow);
        System.out.println("Scheduled Maintenance: " + schedule);

        ZoneId nyZone = ZoneId.of("America/New_York");
        ZoneId tokyoZone = ZoneId.of("Asia/Tokyo");

        ZonedDateTime nyTime = ZonedDateTime.of(schedule, nyZone);
        ZonedDateTime tokyoEquivalent = nyTime.withZoneSameInstant(tokyoZone);

        System.out.println("New York Time: " + nyTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        System.out.println("Tokyo Time:    " + tokyoEquivalent.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

        Duration downtime = Duration.ofHours(4).plusMinutes(15);
        System.out.println("Downtime in Minutes: " + downtime.toMinutes() + " mins");

        Period sprintDuration = Period.ofWeeks(2);
        LocalDate nextSprint = releaseDate.plus(sprintDuration);
        System.out.println("Next Sprint Start: " + nextSprint);

        DateTimeFormatter customFormat = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy");
        System.out.println("Formatted Release: " + releaseDate.format(customFormat));
    }
}\`,
        output: \`UTC Machine Instant: 2023-11-14T22:13:20Z
Scheduled Maintenance: 2026-03-17T03:30
New York Time: 2026-03-17T03:30:00-04:00
Tokyo Time:    2026-03-17T16:30:00+09:00
Downtime in Minutes: 255 mins
Next Sprint Start: 2026-03-31
Formatted Release: Tuesday, March 17, 2026\`,
        stepByStep: [
          'Creates machine epoch instant in UTC.',
          'Converts New York local time to Tokyo time across timezone boundaries.',
          'Applies Duration and Period calculations cleanly.'
        ]
      },
      {
        id: '47-2',
        title: 'Global SLA Deadline Calculator',
        type: 'realistic',
        description: 'Calculates business ticket resolution deadlines across international timezones with weekend skipping.',
        filename: 'GlobalSlaDeadlineCalculatorApp.java',
        code: \`import java.time.DayOfWeek;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class GlobalSlaDeadlineCalculatorApp {
    public record SupportTicket(String ticketId, int slaHours, ZonedDateTime createdTime) {}

    public static ZonedDateTime calculateBusinessDeadline(ZonedDateTime start, int businessHours) {
        ZonedDateTime cursor = start;
        int remainingHours = businessHours;
        while (remainingHours > 0) {
            cursor = cursor.plusHours(1);
            DayOfWeek day = cursor.getDayOfWeek();
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) continue;
            int hour = cursor.getHour();
            if (hour >= 9 && hour < 17) remainingHours--;
        }
        return cursor;
    }

    public static void main(String[] args) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm (z)");
        ZoneId londonZone = ZoneId.of("Europe/London");
        ZonedDateTime ticketOpened = ZonedDateTime.of(2026, 11, 20, 15, 0, 0, 0, londonZone);

        SupportTicket ticket = new SupportTicket("INC-9901", 4, ticketOpened);
        ZonedDateTime resolvedDeadline = calculateBusinessDeadline(ticket.createdTime(), ticket.slaHours());

        ZoneId tokyoZone = ZoneId.of("Asia/Tokyo");
        ZoneId nyZone = ZoneId.of("America/New_York");

        System.out.println("=== SLA Deadline Calculation Report ===");
        System.out.println("Ticket ID:       " + ticket.ticketId());
        System.out.println("SLA Window:      " + ticket.slaHours() + " Business Hours");
        System.out.println("Created (London): " + ticket.createdTime().format(fmt));
        System.out.println("\\nDeadline Across Operations Centers:");
        System.out.println("  London (HQ):   " + resolvedDeadline.format(fmt));
        System.out.println("  New York:      " + resolvedDeadline.withZoneSameInstant(nyZone).format(fmt));
        System.out.println("  Tokyo:         " + resolvedDeadline.withZoneSameInstant(tokyoZone).format(fmt));
    }
}\`,
        output: \`=== SLA Deadline Calculation Report ===
Ticket ID:       INC-9901
SLA Window:      4 Business Hours
Created (London): 2026-11-20 15:00 (GMT)

Deadline Across Operations Centers:
  London (HQ):   2026-11-23 12:00 (GMT)
  New York:      2026-11-23 07:00 (EST)
  Tokyo:         2026-11-23 21:00 (JST)\`,
        stepByStep: [
          'Calculates SLA hours skipping weekend days.',
          'withZoneSameInstant projects London deadline across New York and Tokyo desks.'
        ]
      }
    ],
    commonMistakes: [
      {
        title: 'Applying Duration to LocalDate',
        cause: 'Calling date.plus(Duration.ofHours(24)) throws UnsupportedTemporalTypeException because LocalDate has no time concept.',
        solution: 'Use Period for date-based amounts: date.plus(Period.ofDays(1)).'
      }
    ],
    bestPractices: {
      doList: [
        'Store machine events as Instant in UTC in databases.',
        'Use ZonedDateTime for cross-timezone scheduling and user presentation.',
        'Use pre-built DateTimeFormatter constants when possible.'
      ],
      dontList: [
        'Never use legacy java.util.Date or Calendar in new code.',
        'Never do date math by manually adding milliseconds.'
      ],
      whenNotToUse: 'Do not use ZonedDateTime when time zone information is irrelevant (use LocalDate).'
    },
    versionNotes: {
      introduced: 'Java 8 (JSR 310)',
      status: 'Stable',
      compatibilityNotes: 'Java 9 added LocalDate.datesUntil() stream factory.',
      ltsAvailability: 'Java 8, 11, 17, 21, 25'
    },
    cheatSheet: {
      title: 'java.time Type Selection Cheat Sheet',
      headers: ['Type', 'Timezone Aware', 'Best Used For'],
      rows: [
        ['Instant', 'UTC Absolute', 'Server logs, database event timestamps'],
        ['LocalDate', 'No', 'Birthdays, invoices, bank holidays'],
        ['ZonedDateTime', 'Yes (IANA rules)', 'Cross-timezone flight and calendar events']
      ]
    },
    exercises: [
      {
        id: 1,
        type: 'Hands-on Implementation',
        title: 'Calculate Age in Years',
        prompt: 'Calculate exact completed age in years using Period.',
        solution: 'Period.between(birthday, today).getYears();',
        explanation: 'Period calculates calendar date differences.'
      }
    ],
    officialSources: [
      {
        title: 'Java SE 21 API: java.time Package',
        url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html',
        organization: 'Oracle'
      }
    ]
  },
`;

const insertMarker = "  {\n    id: 'topic-66',";
if (!content.includes(insertMarker)) {
  console.error("Could not locate topic-66 marker in topics.ts");
  process.exit(1);
}

content = content.replace(insertMarker, section12Topics.trim() + ",\n\n" + insertMarker);
fs.writeFileSync(TOPICS_PATH, content, 'utf-8');
console.log('Successfully appended Section 12 topics (45-47) to src/data/topics.ts!');
