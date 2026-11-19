import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Topic 53: Virtual Threads (Java 21 Project Loom) - Realistic Application
 * Demonstrates a high-throughput HTTP server request simulator serving 5,000 concurrent
 * blocking simulated requests with thread-per-request architecture.
 */
public class HighThroughputHttpSimulatorApp {

    public record HttpResponse(int statusCode, String body, long latencyMs) {}

    public static HttpResponse handleSimulatedRequest(int requestId) {
        long start = System.currentTimeMillis();
        try {
            // Simulate blocking socket read or remote DB query (50ms)
            // Carrier thread is released to process other virtual threads while this thread waits!
            Thread.sleep(50);
        } catch (InterruptedException ignored) {}
        long latency = System.currentTimeMillis() - start;
        return new HttpResponse(200, "{\"requestId\":" + requestId + ",\"status\":\"OK\"}", latency);
    }

    public static void main(String[] args) {
        int concurrentRequests = 2_000;
        AtomicInteger successfulRequests = new AtomicInteger(0);

        System.out.println("Dispatching " + concurrentRequests + " concurrent requests using Virtual Threads...");
        long start = System.currentTimeMillis();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 1; i <= concurrentRequests; i++) {
                final int reqId = i;
                executor.submit(() -> {
                    HttpResponse response = handleSimulatedRequest(reqId);
                    if (response.statusCode() == 200) {
                        successfulRequests.incrementAndGet();
                    }
                });
            }
        } // Implicit join on all 2,000 virtual threads

        long totalDurationMs = System.currentTimeMillis() - start;

        System.out.println("=== Simulation Results ===");
        System.out.println("Successful Responses: " + successfulRequests.get() + " / " + concurrentRequests);
        System.out.println("Total Wall-Clock Time: " + totalDurationMs + "ms");
        System.out.println("Throughput:            " + (concurrentRequests * 1000L / totalDurationMs) + " req/sec");
    }
}
