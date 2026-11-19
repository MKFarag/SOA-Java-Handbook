import java.util.ArrayDeque;
import java.util.Comparator;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * Topic 38: The Queue & Deque Hierarchy - Realistic Application
 * Demonstrates an execution engine combining a priority queue for scheduled tasks
 * and an ArrayDeque for sliding-window execution history audit.
 */
public class JobSchedulerApp {

    public record ScheduledJob(String jobId, int priorityLevel, String taskName) {}

    public static class TaskEngine {
        // Higher priority numbers execute first (max-priority ordering)
        private final Queue<ScheduledJob> executionQueue = new PriorityQueue<>(
                Comparator.comparingInt(ScheduledJob::priorityLevel).reversed()
        );

        // Fixed-size recent execution history (sliding window using Deque)
        private final Deque<String> recentHistory = new ArrayDeque<>();
        private final int historyLimit;

        public TaskEngine(int historyLimit) {
            this.historyLimit = historyLimit;
        }

        public void submit(ScheduledJob job) {
            executionQueue.offer(job);
        }

        public void processNext() {
            ScheduledJob nextJob = executionQueue.poll();
            if (nextJob != null) {
                System.out.println("Processing: " + nextJob.taskName());
                if (recentHistory.size() >= historyLimit) {
                    recentHistory.removeLast(); // Evict oldest history entry
                }
                recentHistory.addFirst(nextJob.jobId() + ":" + nextJob.taskName());
            }
        }

        public Deque<String> getHistory() {
            return new ArrayDeque<>(recentHistory);
        }

        public int getPendingCount() {
            return executionQueue.size();
        }
    }

    public static void main(String[] args) {
        TaskEngine engine = new TaskEngine(3);

        engine.submit(new ScheduledJob("J-1", 1, "LowPriority-Cleanup"));
        engine.submit(new ScheduledJob("J-2", 10, "Critical-Database-Failover"));
        engine.submit(new ScheduledJob("J-3", 5, "Normal-Report-Gen"));
        engine.submit(new ScheduledJob("J-4", 8, "High-Security-Patch"));

        System.out.println("Pending jobs before processing: " + engine.getPendingCount());

        engine.processNext(); // Processes J-2 (Priority 10)
        engine.processNext(); // Processes J-4 (Priority 8)
        engine.processNext(); // Processes J-3 (Priority 5)
        engine.processNext(); // Processes J-1 (Priority 1)

        System.out.println("Pending jobs remaining: " + engine.getPendingCount());
        System.out.println("Execution History (Most recent first, limit 3): " + engine.getHistory());
    }
}
