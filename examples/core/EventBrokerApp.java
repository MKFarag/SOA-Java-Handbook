import java.util.ArrayList;
import java.util.List;

public class EventBrokerApp {

    // Event definition encapsulated as static nested class
    public static class Event {
        private final String topic;
        private final String payload;

        public Event(String topic, String payload) {
            this.topic = topic;
            this.payload = payload;
        }

        public String getTopic() { return topic; }
        public String getPayload() { return payload; }
    }

    public interface EventListener {
        void onEvent(Event event);
    }

    public static class EventBroker {
        private final List<EventListener> listeners = new ArrayList<>();

        public void subscribe(EventListener listener) {
            listeners.add(listener);
        }

        public void publish(Event event) {
            for (EventListener listener : listeners) {
                listener.onEvent(event);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== In-Memory Event Broker with Anonymous Subscriptions ===");
        EventBroker broker = new EventBroker();

        // 1. Anonymous Listener for Security Auditing
        broker.subscribe(new EventListener() {
            @Override
            public void onEvent(Event event) {
                if (event.getTopic().startsWith("SECURITY")) {
                    System.out.printf("[AUDIT LOG] Detected security event: %s%n", event.getPayload());
                }
            }
        });

        // 2. Anonymous Listener for Metrics Tracking
        broker.subscribe(new EventListener() {
            private int eventCount = 0;
            @Override
            public void onEvent(Event event) {
                eventCount++;
                System.out.printf("[METRICS] Total events received: %d%n", eventCount);
            }
        });

        // Publish events
        broker.publish(new Event("ORDER_PLACED", "Order #5521 for $120.00"));
        broker.publish(new Event("SECURITY_BREACH_ATTEMPT", "Failed root login from 192.168.1.50"));
    }
}
