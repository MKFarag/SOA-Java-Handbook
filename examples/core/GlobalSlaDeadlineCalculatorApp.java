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
