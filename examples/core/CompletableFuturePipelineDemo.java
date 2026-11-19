import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

/**
 * Topic 52: Asynchronous Pipelines with CompletableFuture - Basic Example
 * Demonstrates async supply, non-blocking chaining with thenApply,
 * combination with thenCombine, and exception handling with exceptionally.
 */
public class CompletableFuturePipelineDemo {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println("=== 1. Chaining Asynchronous Stages ===");

        // Fetch pricing, apply tax, and format string asynchronously
        CompletableFuture<String> pricePipeline = CompletableFuture.supplyAsync(() -> {
            System.out.println("  [Async Stage 1] Fetching raw price in " + Thread.currentThread().getName());
            return 100.0;
        }).thenApply(rawPrice -> {
            System.out.println("  [Async Stage 2] Applying 8% tax");
            return rawPrice * 1.08;
        }).thenApply(finalPrice -> String.format("$%.2f USD", finalPrice));

        System.out.println("Calculated Final Price: " + pricePipeline.get());

        System.out.println("\n=== 2. Combining Two Independent Futures ===");
        CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> "Alice Vance");
        CompletableFuture<Double> balanceFuture = CompletableFuture.supplyAsync(() -> 1450.75);

        // Combine two futures when both complete
        CompletableFuture<String> combinedReport = userFuture.thenCombine(
                balanceFuture,
                (user, balance) -> "Account Report: " + user + " has balance $" + balance
        );

        System.out.println(combinedReport.get());

        System.out.println("\n=== 3. Exception Handling with exceptionally() ===");
        CompletableFuture<String> resilientPipeline = CompletableFuture.supplyAsync(() -> {
            if (true) {
                throw new IllegalStateException("Payment gateway unreachable");
            }
            return "SUCCESS";
        }).exceptionally(ex -> {
            System.out.println("  [Recovered] Intercepted failure: " + ex.getMessage());
            return "FALLBACK_CACHE_OK";
        });

        System.out.println("Resilient Outcome: " + resilientPipeline.get());
    }
}
