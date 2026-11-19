import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Topic 51: Executor Framework & Thread Pools - Basic Example
 * Demonstrates ThreadPoolExecutor core parameters, bounded queues, custom rejection policies,
 * and two-phase graceful shutdown.
 */
public class ThreadPoolExecutorDemo {

    public static void main(String[] args) throws InterruptedException {
        // Custom rejection policy logging rejected tasks
        RejectedExecutionHandler customHandler = (task, executor) ->
                System.out.println("  [REJECTED] Task rejected! Queue is full and max threads reached.");

        // corePoolSize=2, maxPoolSize=3, keepAlive=1s, bounded queue capacity=2
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                2,
                3,
                1L,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(2),
                customHandler
        );

        System.out.println("Submitting 6 tasks to ThreadPoolExecutor...");
        for (int i = 1; i <= 6; i++) {
            final int taskId = i;
            executor.submit(() -> {
                try {
                    System.out.println("  [Executing Task " + taskId + "] on thread: " + Thread.currentThread().getName());
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }

        // Two-phase graceful shutdown
        executor.shutdown(); // Reject incoming tasks, complete pending queue
        if (!executor.awaitTermination(2, TimeUnit.SECONDS)) {
            System.out.println("Forcing shutdown via shutdownNow()...");
            executor.shutdownNow();
        }

        System.out.println("Executor Terminated Cleanly: " + executor.isTerminated());
    }
}
