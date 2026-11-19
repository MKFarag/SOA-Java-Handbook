import java.util.ArrayList;
import java.util.List;

public class NotificationDispatcherApp {

    // Base Notification Channel
    public static abstract class NotificationChannel {
        protected final String recipient;

        public NotificationChannel(String recipient) {
            this.recipient = recipient;
        }

        public abstract boolean dispatch(String message);
    }

    public static class EmailChannel extends NotificationChannel {
        public EmailChannel(String emailAddress) {
            super(emailAddress);
        }

        @Override
        public boolean dispatch(String message) {
            System.out.printf("[EMAIL -> %s] Subject: Alert | Body: %s%n", recipient, message);
            return true;
        }
    }

    public static class SMSChannel extends NotificationChannel {
        public SMSChannel(String phoneNumber) {
            super(phoneNumber);
        }

        @Override
        public boolean dispatch(String message) {
            System.out.printf("[SMS -> %s] Text: %s%n", recipient, message);
            return true;
        }
    }

    public static class PushChannel extends NotificationChannel {
        private final String deviceToken;

        public PushChannel(String recipient, String deviceToken) {
            super(recipient);
            this.deviceToken = deviceToken;
        }

        @Override
        public boolean dispatch(String message) {
            System.out.printf("[PUSH -> Device %s (%s)] %s%n", deviceToken, recipient, message);
            return true;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Heterogeneous Polymorphic Alert Dispatcher ===");

        List<NotificationChannel> channels = new ArrayList<>();
        channels.add(new EmailChannel("ops-team@enterprise.com"));
        channels.add(new SMSChannel("+1-555-0199"));
        channels.add(new PushChannel("Lead-Architect", "fcm-tok-8841-a"));

        String alertPayload = "CRITICAL: Database primary failover completed.";

        // Single unified polymorphic dispatch call
        for (NotificationChannel channel : channels) {
            channel.dispatch(alertPayload);
        }
    }
}
