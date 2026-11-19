import java.util.Arrays;
import java.util.List;

/**
 * Topic 42: Stream API: Pipeline Fundamentals - Realistic Application
 * Demonstrates an HTTP access log analysis pipeline using filtering, flatMap path tokenization,
 * and distinct aggregation.
 */
public class ServerLogAnalyticsApp {

    public record AccessLog(String path, int statusCode, long responseTimeMs) {}

    public static void main(String[] args) {
        List<AccessLog> logs = List.of(
                new AccessLog("/api/v1/users/list", 200, 45),
                new AccessLog("/api/v1/auth/login", 401, 120),
                new AccessLog("/static/css/theme.css", 200, 5),
                new AccessLog("/api/v1/orders/submit", 500, 850),
                new AccessLog("/api/v1/users/profile", 200, 60),
                new AccessLog("/api/v1/orders/cancel", 400, 35)
        );

        // 1. Filter slow API requests: path starts with "/api" and response time >= 50ms
        List<AccessLog> slowApiRequests = logs.stream()
                .filter(log -> log.path().startsWith("/api"))
                .filter(log -> log.responseTimeMs() >= 50)
                .sorted((a, b) -> Long.compare(b.responseTimeMs(), a.responseTimeMs())) // Descending
                .toList();

        System.out.println("Slow API Requests (>= 50ms):");
        for (AccessLog log : slowApiRequests) {
            System.out.printf("  [%d] %s -> %dms%n", log.statusCode(), log.path(), log.responseTimeMs());
        }

        // 2. Extract distinct root resource categories using flatMap: /api/v1/users -> "users"
        List<String> distinctApiResources = logs.stream()
                .map(AccessLog::path)
                .filter(p -> p.startsWith("/api/v1/"))
                .map(p -> p.replace("/api/v1/", ""))
                .flatMap(subPath -> Arrays.stream(subPath.split("/")))
                .filter(segment -> !segment.equals("list") && !segment.equals("submit") &&
                                   !segment.equals("login") && !segment.equals("profile") &&
                                   !segment.equals("cancel"))
                .distinct()
                .sorted()
                .toList();

        System.out.println("\nDistinct Active API Resources: " + distinctApiResources);
    }
}
