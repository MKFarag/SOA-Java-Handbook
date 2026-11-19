/**
 * Topic 48: Threads & Thread Lifecycle - Basic Example
 * Demonstrates thread states, join(), daemon threads, and cooperative interruption.
 */
public class ThreadLifecycleDemo {

    public static void main(String[] args) throws InterruptedException {
        // 1. Cooperative worker thread checking Thread.currentThread().isInterrupted()
        Thread worker = new Thread(() -> {
            System.out.println("Worker thread running: " + Thread.currentThread().getName());
            int counter = 0;
            while (!Thread.currentThread().isInterrupted() && counter < 100) {
                counter++;
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    System.out.println("Worker interrupted during sleep. Exiting cleanly.");
                    Thread.currentThread().interrupt(); // Restore interrupted status
                    break;
                }
            }
            System.out.println("Worker completed. Final counter: " + counter);
        }, "Background-Worker-1");

        System.out.println("Worker State before start: " + worker.getState()); // NEW
        worker.start();
        System.out.println("Worker State after start:  " + worker.getState()); // RUNNABLE or TIMED_WAITING

        // Let the worker run briefly
        Thread.sleep(120);

        // Interrupt worker gracefully
        System.out.println("Main thread sending interrupt signal...");
        worker.interrupt();

        // Wait for worker to finish termination
        worker.join();
        System.out.println("Worker State after join:   " + worker.getState()); // TERMINATED

        // 2. Daemon Thread demonstration
        Thread daemon = new Thread(() -> {
            while (true) {
                // Daemon runs in background and terminates automatically when all user threads finish
            }
        });
        daemon.setDaemon(true);
        daemon.start();
        System.out.println("Daemon Thread isDaemon:    " + daemon.isDaemon());
    }
}
