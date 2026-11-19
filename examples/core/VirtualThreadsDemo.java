import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Topic 53: Virtual Threads (Java 21 Project Loom) - Basic Example
 * Demonstrates launching thousands of lightweight virtual threads using Thread.ofVirtual()
 * and Executors.newVirtualThreadPerTaskExecutor().
 */
public class VirtualThreadsDemo {

    public static void main(String[] args) throws InterruptedException {
        // 1. Thread.ofVirtual() builder
        Thread vThread = Thread.ofVirtual().name("vt-worker").start(() -> {
            System.out.println("Running Virtual Thread: " + Thread.currentThread());
            System.out.println("Is Virtual Thread?      " + Thread.currentThread().isVirtual());
        });
        vThread.join();

        // 2. Launching 1,000 concurrent Virtual Threads effortlessly
        // With traditional OS platform threads, 1,000 threads consume ~1 GB of stack memory.
        // With virtual threads, 1,000 threads occupy just a few megabytes on the Java heap.
        int totalTasks = 1_000;
        AtomicInteger completedCount = new AtomicInteger(0);

        long start = System.currentTimeMillis();
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < totalTasks; i++) {
                executor.submit(() -> {
                    try {
                        Thread.sleep(20); // Virtual thread unmounts from carrier OS thread during blocking sleep!
                        completedCount.incrementAndGet();
                    } catch (InterruptedException ignored) {}
                });
            }
        } // AutoCloseable executor blocks here until all virtual threads finish!

        long duration = System.currentTimeMillis() - start;
        System.out.println("\nVirtual Threads Completed: " + completedCount.get() + " / " + totalTasks);
        System.out.println("Execution Duration:        " + duration + "ms");
    }
}
