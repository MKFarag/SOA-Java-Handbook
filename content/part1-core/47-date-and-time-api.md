---
id: topic-47
slug: date-and-time-api
topicNumber: 47
title: Date and Time API (java.time)
part: 'Part 1: Java Core'
sectionNumber: 12
sectionTitle: 'File I/O, NIO.2 & Date/Time'
versionBadge: Java 8+ (JSR 310)
difficulty: Intermediate
readingTime: 13 min read
shortDescription: >-
  Master immutable, thread-safe date/time handling: Instant, LocalDate,
  ZonedDateTime, Duration, Period, and DateTimeFormatter.
prerequisites:
  - 'Topic 04: Variables, Identifiers & Primitive Data Types'
  - 'Topic 16: Classes, Objects & Memory Layout'
relevanceLevel: ADVANCED / DEEP-DIVE
---
# Date and Time API (java.time)

> 🚀 **Roadmap Seal:** **`[ADVANCED / DEEP-DIVE]`** — *Advanced enterprise specialization & architecture. Study once core fundamentals are solid.*

### 1. What It Is and Why It Exists
Before Java 8, handling dates and times relied on `java.util.Date`, `java.util.Calendar`, and `java.text.SimpleDateFormat`. These legacy classes had notorious design flaws:
- **Mutability**: Calling `date.setTime(...)` mutated the object in place, leading to dangerous concurrency bugs when shared across threads.
- **Confusing Offsets**: Months were 0-indexed (January was `0`, December was `11`), while years started at `1900` (`new Date(114, 2, 1)` meant March 1, 2014!).
- **SimpleDateFormat Thread Safety**: `SimpleDateFormat` was not thread-safe; sharing an instance between threads silently corrupted date parsing.

Java 8 introduced the modern **Date and Time API** in `java.time` (JSR 310, based on ThreeTen/Joda-Time). All classes in `java.time` are **immutable**, **thread-safe**, clearly separate human time from machine time, handle complex time zones cleanly, and use intuitive 1-based indexing (January is `1`).

**Real-World Analogy:**
Think of global flight coordination. A flight departure has two perspectives:
1. **Machine Time (`Instant`)**: An absolute atomic clock instant on the space station (nanoseconds since the Unix epoch in UTC). Every satellite agrees on this exact number.
2. **Human / Wall-Clock Time (`ZonedDateTime`)**: The local clock on the wall at the departure gate in New York (`America/New_York`) showing 14:30 EST, while Tokyo arrival screens show 18:30 JST the next day. The `java.time` API keeps both perspectives in perfect synchronization without confusion.

---

### 2. Prerequisites
Before studying the Date and Time API, you should understand:
- [Topic 04: Variables, Identifiers & Primitive Data Types](#topic-04) — Fundamental understanding of timestamps and integers.
- [Topic 16: Classes, Objects & Memory Layout](#topic-16) — Reference types and immutability.

---

### 3. Syntax Breakdown

#### 1. Core Classes in `java.time`
- `Instant`: Represents an instantaneous point on the timeline in UTC (seconds and nanoseconds since `1970-01-01T00:00:00Z`).
- `LocalDate`: A date without time or timezone (e.g. `2026-03-17`). Ideal for birthdays, holidays, or fiscal year markers.
- `LocalTime`: A time without date or timezone (e.g. `14:30:00`). Ideal for recurring business hours or alarms.
- `LocalDateTime`: Combines `LocalDate` and `LocalTime` without timezone (e.g. `2026-03-17T14:30:00`).
- `ZonedDateTime`: A date-time with a complete time-zone rule from the IANA Time Zone Database (e.g. `ZoneId.of("America/New_York")`), handling Daylight Saving Time (DST) automatically.
- `Duration`: Measures time in **seconds and nanoseconds** (time-based amount).
- `Period`: Measures time in **years, months, and days** (date-based amount).
- `DateTimeFormatter`: Thread-safe parsing and formatting engine (replaces `SimpleDateFormat`).

---

### 4. Runnable Examples

#### Example 1: Core java.time Classes, Durations, and Formatting
This example demonstrates machine timestamps, local human dates, time zone conversion, durations, and custom date formatting.

```java
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Topic 47: Date and Time API (java.time) - Basic Example
 * Demonstrates Instant, LocalDate, ZonedDateTime, Duration, Period, and DateTimeFormatter.
 */
public class DateTimeApiDemo {

    public static void main(String[] args) {
        // 1. Machine timestamp (Instant)
        Instant epochNow = Instant.ofEpochMilli(1700000000000L); // Fixed epoch for reproducible output
        System.out.println("UTC Machine Instant: " + epochNow);

        // 2. Human-readable local date and time
        LocalDate releaseDate = LocalDate.of(2026, 3, 17);
        LocalTime maintenanceWindow = LocalTime.of(3, 30, 0);
        LocalDateTime schedule = LocalDateTime.of(releaseDate, maintenanceWindow);
        System.out.println("Scheduled Maintenance: " + schedule);

        // 3. Time zone conversion (ZonedDateTime)
        ZoneId nyZone = ZoneId.of("America/New_York");
        ZoneId tokyoZone = ZoneId.of("Asia/Tokyo");

        ZonedDateTime nyTime = ZonedDateTime.of(schedule, nyZone);
        ZonedDateTime tokyoEquivalent = nyTime.withZoneSameInstant(tokyoZone);

        System.out.println("New York Time: " + nyTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        System.out.println("Tokyo Time:    " + tokyoEquivalent.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

        // 4. Durations (time-based) and Periods (date-based)
        Duration downtime = Duration.ofHours(4).plusMinutes(15);
        System.out.println("Downtime in Minutes: " + downtime.toMinutes() + " mins");

        Period sprintDuration = Period.ofWeeks(2);
        LocalDate nextSprint = releaseDate.plus(sprintDuration);
        System.out.println("Next Sprint Start: " + nextSprint);

        // 5. Custom Formatting
        DateTimeFormatter customFormat = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy");
        System.out.println("Formatted Release: " + releaseDate.format(customFormat));
    }
}
```

**Expected Output:**
```
UTC Machine Instant: 2023-11-14T22:13:20Z
Scheduled Maintenance: 2026-03-17T03:30
New York Time: 2026-03-17T03:30:00-04:00
Tokyo Time:    2026-03-17T16:30:00+09:00
Downtime in Minutes: 255 mins
Next Sprint Start: 2026-03-31
Formatted Release: Tuesday, March 17, 2026
```

---

#### Example 2: Realistic Application — Global SLA Deadline Calculator
In international support operations, service level agreement (SLA) deadlines must factor in business operating hours, weekend rollovers, and multi-timezone headquarters.

```java
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Topic 47: Date and Time API (java.time) - Realistic Application
 * Demonstrates an enterprise ticket SLA deadline calculator factoring in
 * international timezones and business day rollover.
 */
public class GlobalSlaDeadlineCalculatorApp {

    public record SupportTicket(String ticketId, int slaHours, ZonedDateTime createdTime) {}

    public static ZonedDateTime calculateBusinessDeadline(ZonedDateTime start, int businessHours) {
        ZonedDateTime cursor = start;
        int remainingHours = businessHours;

        while (remainingHours > 0) {
            cursor = cursor.plusHours(1);
            DayOfWeek day = cursor.getDayOfWeek();
            // Skip Saturdays and Sundays
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                continue;
            }
            // Only count standard business hours (09:00 - 17:00)
            int hour = cursor.getHour();
            if (hour >= 9 && hour < 17) {
                remainingHours--;
            }
        }
        return cursor;
    }

    public static void main(String[] args) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm (z)");

        // A critical ticket filed on Friday at 15:00 UTC
        ZoneId londonZone = ZoneId.of("Europe/London");
        ZonedDateTime ticketOpened = ZonedDateTime.of(2026, 11, 20, 15, 0, 0, 0, londonZone); // Friday 15:00

        SupportTicket ticket = new SupportTicket("INC-9901", 4, ticketOpened);
        ZonedDateTime resolvedDeadline = calculateBusinessDeadline(ticket.createdTime(), ticket.slaHours());

        ZoneId tokyoZone = ZoneId.of("Asia/Tokyo");
        ZoneId nyZone = ZoneId.of("America/New_York");

        System.out.println("=== SLA Deadline Calculation Report ===");
        System.out.println("Ticket ID:       " + ticket.ticketId());
        System.out.println("SLA Window:      " + ticket.slaHours() + " Business Hours");
        System.out.println("Created (London): " + ticket.createdTime().format(fmt));
        System.out.println("\nDeadline Across Operations Centers:");
        System.out.println("  London (HQ):   " + resolvedDeadline.format(fmt));
        System.out.println("  New York:      " + resolvedDeadline.withZoneSameInstant(nyZone).format(fmt));
        System.out.println("  Tokyo:         " + resolvedDeadline.withZoneSameInstant(tokyoZone).format(fmt));
    }
}
```

**Expected Output:**
```
=== SLA Deadline Calculation Report ===
Ticket ID:       INC-9901
SLA Window:      4 Business Hours
Created (London): 2026-11-20 15:00 (GMT)

Deadline Across Operations Centers:
  London (HQ):   2026-11-23 12:00 (GMT)
  New York:      2026-11-23 07:00 (EST)
  Tokyo:         2026-11-23 21:00 (JST)
```

---

### 5. Step-by-Step Execution Trace
1. **Ticket Inception**: `ticketOpened` is initialized to Friday 15:00 in London (`Europe/London`).
2. **Business Hour Stepping**:
   - Friday 16:00 is within 09:00–17:00 $\implies 3$ hours remaining.
   - Friday 17:00 is outside business hours $\implies$ no decrement.
   - Saturday & Sunday are skipped completely by the `DayOfWeek` filter.
   - Monday 10:00, 11:00, 12:00 consume the remaining 3 hours.
3. **Time Zone Projection**: `withZoneSameInstant(nyZone)` takes the exact instant calculated in London and projects it onto New York time (5 hours behind London $\implies$ 07:00 EST) and Tokyo time (9 hours ahead of UTC $\implies$ 21:00 JST).
4. **Immutability Guarantee**: Every `.plusHours()` or `.withZoneSameInstant()` returns a brand new `ZonedDateTime` instance; the original timestamp is never mutated.

---

### 6. Common Mistakes and Compiler Errors
- **Confusing `Duration` with `Period`**:
  ```java
  // RUNTIME ERROR: UnsupportedTemporalTypeException: Unsupported unit: Seconds
  LocalDate today = LocalDate.now();
  today.plus(Duration.ofHours(24)); // LocalDate has no time concept!
  ```
  *Solution*: Use `Period` for `LocalDate` (`Period.ofDays(1)`), and `Duration` for time-based types (`LocalTime`, `Instant`, `LocalDateTime`).
- **Assuming `LocalDateTime` Knows the Time Zone**:
  `LocalDateTime` stores only digits (`2026-03-17 14:00`). It does not represent an absolute point in time because 14:00 in London is completely different from 14:00 in Tokyo.
  *Solution*: If you need to record an absolute global event (e.g. database transactions or server logs), use `Instant` or `ZonedDateTime`.
- **Using Legacy `java.util.Date` in New Code**:
  Legacy classes should never be used in modern Java codebases. Convert legacy dates using `date.toInstant()` when integrating with third-party libraries.

---

### 7. Best Practices and When NOT to Use
- **Store `Instant` (UTC) in Databases**: Always store database event timestamps as `Instant` or `TIMESTAMP WITH TIME ZONE`. Convert to the user’s local `ZonedDateTime` only when rendering in the UI.
- **Use `DateTimeFormatter` Constants**: Prefer pre-built constants like `DateTimeFormatter.ISO_OFFSET_DATE_TIME` or `ISO_LOCAL_DATE` over custom formatting patterns when possible.
- **Do NOT Invent Date Arithmetic**: Never calculate intervals by adding milliseconds manually (`timestamp + 86400000L`). Millisecond arithmetic fails during Daylight Saving Time (DST) shifts and leap seconds. Use `ZonedDateTime.plusDays(1)`.

---

### 8. Version Notes
- **Java 8 (JSR 310)**: Modern `java.time` API introduced.
- **Java 9**: Added `LocalDate.datesUntil()` stream factory and `Duration.to...Part()` accessors.

---

### 9. Summary Cheat Sheet
| Class | Timezone Aware? | Time of Day? | Best Used For |
| :--- | :--- | :--- | :--- |
| `Instant` | UTC Absolute | Yes | Machine logging, database timestamps |
| `LocalDate` | No | No | Birthdays, invoices, bank holidays |
| `LocalTime` | No | Yes | Daily recurring store hours, alarms |
| `LocalDateTime` | No | Yes | Local calendar event bookings |
| `ZonedDateTime` | Yes (IANA rules) | Yes | Cross-timezone scheduling, flight departures |
| `Duration` | N/A (time) | N/A | Measuring seconds, minutes, hours |
| `Period` | N/A (date) | N/A | Measuring days, months, years |

---

### 10. Exercises and Solutions

<details>
<summary>Exercise 1: Calculate age in years from birthday</summary>

Write a method `int calculateAge(LocalDate birthday, LocalDate today)` that calculates a person's exact age in completed years using `Period`.

**Solution:**
```java
public static int calculateAge(LocalDate birthday, LocalDate today) {
    return Period.between(birthday, today).getYears();
}
```
</details>

<details>
<summary>Exercise 2: Generate a stream of all dates in a month</summary>

Using Java 9+ `LocalDate.datesUntil()`, write code that streams every date in February 2026.

**Solution:**
```java
LocalDate start = LocalDate.of(2026, 2, 1);
LocalDate end = LocalDate.of(2026, 3, 1);
List<LocalDate> febDates = start.datesUntil(end).toList();
```
</details>

<details>
<summary>Exercise 3: Explain how <code>ZonedDateTime</code> handles Daylight Saving Time (DST) "Fall Back"</summary>

**Solution:**
When clocks "fall back" by one hour in autumn, the hour from 01:00 to 02:00 repeats twice. If a user schedules an event during this ambiguous hour, `ZonedDateTime` applies standard IANA transition rules (defaulting to the earlier offset, or allowing disambiguation via `withEarlierOffsetAtOverlap()` or `withLaterOffsetAtOverlap()`), preventing silent timing discrepancies.
</details>

---

### 11. Official Sources and References
- [Oracle Java Documentation — Date Time Tutorial (JSR 310)](https://docs.oracle.com/javase/tutorial/datetime/)
- [Java SE 21 API Specification — java.time Package](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/package-summary.html)
- [JSR 310: Date and Time API](https://jcp.org/en/jsr/detail?id=310)
