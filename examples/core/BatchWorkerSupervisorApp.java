import java.util.ArrayList;
import java.util.List;

/**
 * Topic 48: Threads & Thread Lifecycle - Realistic Application
 * Demonstrates a multi-worker task supervisor managing worker thread lifecycles,
 * joins with timeouts, and graceful shutdown.
 */
public class BatchWorkerSupervisorApp {

    public static class TaskWorker implements Runnable {
        private final String workerId;
        private final int taskDurationMs;
        private volatile boolean finished = false;

        public TaskWorker(String workerId, int taskDurationMs) {
            this.workerId = workerId;
            this.taskDurationMs = taskDurationMs;
        }

        @Override
        public void run() {
            try {
                System.out.println("  [" + workerId + "] Processing task payload...");
                Thread.sleep(taskDurationMs);
                finished = true;
                System.out.println("  [" + workerId + "] Task payload processed successfully.");
            } catch (InterruptedException e) {
                System.out.println("  [" + workerId + "] Worker canceled via interruption.");
                Thread.currentThread().interrupt();
            }
        }

        public boolean isFinished() {
            return finished;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        List<Thread> pool = new ArrayList<>();
        List<TaskWorker> workers = new ArrayList<>();

        // Create 3 worker tasks
        for (int i = 1; i <= 3; i++) {
            TaskWorker worker = new TaskWorker("Worker-" + i, i * 60);
            Thread t = new Thread(worker, "Thread-Worker-" + i);
            workers.add(worker);
            pool.add(t);
            t.start();
        }

        System.out.println("Supervisor waiting for batch completion (joining workers)...");
        for (Thread t : pool) {
            t.join(500); // Wait up to 500ms per thread
        }

        long completedCount = workers.stream().filter(TaskWorker::isFinished).count();
        System.out.println("Supervisor Audit: " + completedCount + " of " + pool.size() + " workers completed successfully.");
    }
}
