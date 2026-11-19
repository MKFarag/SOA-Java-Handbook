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
