import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

/**
 * Topic 40: Lambdas & Functional Interfaces - Realistic Application
 * Demonstrates alert rule evaluation using composed Predicates (and, or, negate).
 */
public class EventNotificationFilterApp {

    public record SystemAlert(String sourceService, int severityLevel, boolean requiresPage) {}

    public static List<SystemAlert> filterAlerts(List<SystemAlert> alerts, Predicate<SystemAlert> rule) {
        List<SystemAlert> matched = new ArrayList<>();
        for (SystemAlert alert : alerts) {
            if (rule.test(alert)) {
                matched.add(alert);
            }
        }
        return matched;
    }

    public static void main(String[] args) {
        List<SystemAlert> activeAlerts = List.of(
                new SystemAlert("auth-service", 5, true),
                new SystemAlert("billing-service", 2, false),
                new SystemAlert("auth-service", 1, false),
                new SystemAlert("database-cluster", 4, true),
                new SystemAlert("reporting-job", 3, false)
        );

        // Core building block predicates
        Predicate<SystemAlert> isCritical = alert -> alert.severityLevel() >= 4;
        Predicate<SystemAlert> isAuthService = alert -> alert.sourceService().equals("auth-service");
        Predicate<SystemAlert> needsPage = SystemAlert::requiresPage;

        // Composed predicate rules: (isCritical OR needsPage) AND NOT (reporting-job)
        Predicate<SystemAlert> onCallRule = isCritical.or(needsPage);
        Predicate<SystemAlert> criticalAuthRule = isCritical.and(isAuthService);

        List<SystemAlert> onCallDispatched = filterAlerts(activeAlerts, onCallRule);
        List<SystemAlert> criticalAuth = filterAlerts(activeAlerts, criticalAuthRule);

        System.out.println("Total Alerts Triggering On-Call: " + onCallDispatched.size());
        for (SystemAlert a : onCallDispatched) {
            System.out.println("  Paging On-Call: " + a.sourceService() + " (Sev " + a.severityLevel() + ")");
        }

        System.out.println("\nCritical Auth Alerts: " + criticalAuth.size());
        for (SystemAlert a : criticalAuth) {
            System.out.println("  Security Alert: " + a.sourceService() + " (Sev " + a.severityLevel() + ")");
        }
    }
}
