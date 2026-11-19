import java.util.List;
import java.util.Optional;

/**
 * Topic 44: Optional Type Handling - Realistic Application
 * Demonstrates a multi-tier profile service safely chaining Optionals with flatMap()
 * to eliminate null pointer bugs in nested domain models.
 */
public class UserProfileLookupServiceApp {

    public record NotificationSettings(String webhookUrl, boolean emailEnabled) {}

    public record UserProfile(String userId, String displayName, NotificationSettings settings) {
        public Optional<NotificationSettings> getNotificationSettings() {
            return Optional.ofNullable(settings);
        }
    }

    public static class UserService {
        private final List<UserProfile> users = List.of(
                new UserProfile("USR-1", "Alice Vance", new NotificationSettings("https://hooks.corp/alice", true)),
                new UserProfile("USR-2", "Bob Martin", null) // Profile without notification settings
        );

        public Optional<UserProfile> findById(String id) {
            return users.stream()
                    .filter(u -> u.userId().equals(id))
                    .findFirst();
        }
    }

    public static void main(String[] args) {
        UserService service = new UserService();

        // Chain Optional lookups cleanly using flatMap
        // USR-1: has both profile and notification settings
        String webhook1 = service.findById("USR-1")
                .flatMap(UserProfile::getNotificationSettings)
                .map(NotificationSettings::webhookUrl)
                .orElse("https://default.corp/sink");

        // USR-2: has profile, but settings are null
        String webhook2 = service.findById("USR-2")
                .flatMap(UserProfile::getNotificationSettings)
                .map(NotificationSettings::webhookUrl)
                .orElse("https://default.corp/sink");

        // USR-99: user does not exist
        String webhook3 = service.findById("USR-99")
                .flatMap(UserProfile::getNotificationSettings)
                .map(NotificationSettings::webhookUrl)
                .orElse("https://default.corp/sink");

        System.out.println("User 1 Webhook: " + webhook1);
        System.out.println("User 2 Webhook: " + webhook2);
        System.out.println("User 99 Webhook: " + webhook3);
    }
}
