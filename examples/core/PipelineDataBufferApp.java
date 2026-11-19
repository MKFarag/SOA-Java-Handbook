import java.util.ArrayList;
import java.util.List;

/**
 * Topic 34: Generic Wildcards & PECS Principle - Realistic Application
 * Demonstrates a data transfer pipeline copying elements across bounded wildcard boundaries.
 */
public class PipelineDataBufferApp {

    public static class Event {
        private final String eventType;
        private final long timestamp;

        public Event(String eventType, long timestamp) {
            this.eventType = eventType;
            this.timestamp = timestamp;
        }

        public String getEventType() {
            return eventType;
        }

        public long getTimestamp() {
            return timestamp;
        }

        @Override
        public String toString() {
            return "Event[" + eventType + "@" + timestamp + "]";
        }
    }

    public static class SecurityAuditAlert extends Event {
        private final int severityLevel;

        public SecurityAuditAlert(String eventType, long timestamp, int severityLevel) {
            super(eventType, timestamp);
            this.severityLevel = severityLevel;
        }

        public int getSeverityLevel() {
            return severityLevel;
        }

        @Override
        public String toString() {
            return "SecurityAlert[" + getEventType() + ", severity=" + severityLevel + "]";
        }
    }

    // PECS rule applied: Source produces (? extends T), Destination consumes (? super T)
    public static <T> void transferBatch(List<? extends T> source, List<? super T> destination) {
        for (T item : source) {
            destination.add(item);
        }
    }

    public static void main(String[] args) {
        List<SecurityAuditAlert> incomingAlerts = new ArrayList<>();
        incomingAlerts.add(new SecurityAuditAlert("FAILED_LOGIN", 1700000001L, 3));
        incomingAlerts.add(new SecurityAuditAlert("PORT_SCAN", 1700000002L, 5));

        // Destination accepts generic Event or Object (Consumer Super)
        List<Event> auditEventJournal = new ArrayList<>();
        transferBatch(incomingAlerts, auditEventJournal);

        System.out.println("Transferred Journal Records: " + auditEventJournal.size());
        for (Event event : auditEventJournal) {
            System.out.println("Journaled: " + event);
        }
    }
}
