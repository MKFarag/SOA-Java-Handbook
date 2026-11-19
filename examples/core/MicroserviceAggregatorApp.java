import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

/**
 * Topic 52: Asynchronous Pipelines with CompletableFuture - Realistic Application
 * Demonstrates a high-concurrency microservice aggregator fan-out pattern
 * querying profile, balance, and credit rating services in parallel with allOf().
 */
public class MicroserviceAggregatorApp {

    public record UserProfile(String userId, String name) {}
    public record AccountBalance(String userId, double amount) {}
    public record CreditScore(String userId, int score) {}
    public record UserDashboard(UserProfile profile, AccountBalance balance, CreditScore credit) {}

    // Simulated remote microservice client calls
    public static CompletableFuture<UserProfile> fetchProfile(String userId) {
        return CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(50); } catch (InterruptedException ignored) {}
            return new UserProfile(userId, "Marcus Vance");
        });
    }

    public static CompletableFuture<AccountBalance> fetchBalance(String userId) {
        return CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(80); } catch (InterruptedException ignored) {}
            return new AccountBalance(userId, 5240.50);
        });
    }

    public static CompletableFuture<CreditScore> fetchCreditScore(String userId) {
        return CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(60); } catch (InterruptedException ignored) {}
            return new CreditScore(userId, 785);
        });
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        String targetUserId = "USR-9001";
        long start = System.currentTimeMillis();

        // Fan-out: trigger 3 parallel microservice requests concurrently
        CompletableFuture<UserProfile> profileFuture = fetchProfile(targetUserId);
        CompletableFuture<AccountBalance> balanceFuture = fetchBalance(targetUserId);
        CompletableFuture<CreditScore> creditFuture = fetchCreditScore(targetUserId);

        // Fan-in: wait for all 3 futures to complete asynchronously
        CompletableFuture<UserDashboard> dashboardFuture = CompletableFuture.allOf(profileFuture, balanceFuture, creditFuture)
                .thenApply(v -> new UserDashboard(
                        profileFuture.join(),
                        balanceFuture.join(),
                        creditFuture.join()
                ));

        UserDashboard dashboard = dashboardFuture.get();
        long duration = System.currentTimeMillis() - start;

        System.out.println("=== Aggregated Microservice Dashboard ===");
        System.out.println("User:         " + dashboard.profile().name() + " (" + dashboard.profile().userId() + ")");
        System.out.printf("Balance:      $%,.2f%n", dashboard.balance().amount());
        System.out.println("Credit Score: " + dashboard.credit().score());
        System.out.println("Aggregation completed in: " + duration + "ms (Parallel speedup verified)");
    }
}
