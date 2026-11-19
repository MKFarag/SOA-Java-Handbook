/**
 * Topic 49: Synchronization & Memory Visibility - Basic Example
 * Contrasts race conditions on un-synchronized counters with synchronized blocks,
 * and demonstrates volatile visibility flags.
 */
public class SynchronizationVisibilityDemo {

    public static class UnsafeCounter {
        private int count = 0;
        public void increment() { count++; }
        public int getCount() { return count; }
    }

    public static class SafeCounter {
        private int count = 0;
        private final Object lock = new Object();

        public void increment() {
            synchronized (lock) {
                count++;
            }
        }

        public int getCount() {
            synchronized (lock) {
                return count;
            }
        }
    }

    // volatile ensures memory visibility across CPU core caches
    public static class StoppableWorker implements Runnable {
        private volatile boolean stopRequested = false;
        private int iterations = 0;

        public void requestStop() {
            stopRequested = true;
        }

        @Override
        public void run() {
            while (!stopRequested) {
                iterations++;
            }
            System.out.println("Worker recognized stop flag. Iterations: " + iterations);
        }
    }

    public static void main(String[] args) throws InterruptedException {
        // 1. Safe Synchronized Counter
        SafeCounter safeCounter = new SafeCounter();
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) safeCounter.increment();
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) safeCounter.increment();
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("Synchronized Counter Total: " + safeCounter.getCount());

        // 2. Volatile Visibility Flag
        StoppableWorker worker = new StoppableWorker();
        Thread workerThread = new Thread(worker);
        workerThread.start();

        Thread.sleep(50);
        worker.requestStop();
        workerThread.join();
        System.out.println("Volatile Worker Terminated Gracefully.");
    }
}
