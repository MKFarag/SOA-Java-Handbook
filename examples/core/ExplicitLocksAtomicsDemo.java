import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Topic 50: Explicit Locks & Concurrent Collections - Basic Example
 * Demonstrates ReentrantLock with tryLock(), and lock-free CAS operations
 * using AtomicInteger and AtomicReference.
 */
public class ExplicitLocksAtomicsDemo {

    public static void main(String[] args) throws InterruptedException {
        // 1. Explicit ReentrantLock with timed tryLock()
        Lock lock = new ReentrantLock();

        Thread holder = new Thread(() -> {
            lock.lock();
            try {
                System.out.println("Holder acquired lock, holding for 150ms...");
                Thread.sleep(150);
            } catch (InterruptedException ignored) {
            } finally {
                lock.unlock();
                System.out.println("Holder released lock.");
            }
        });

        Thread contender = new Thread(() -> {
            try {
                Thread.sleep(20);
                System.out.println("Contender attempting tryLock(50ms)...");
                boolean acquired = lock.tryLock(50, TimeUnit.MILLISECONDS);
                System.out.println("Contender acquired lock? " + acquired); // false (held by holder)

                System.out.println("Contender attempting tryLock(200ms)...");
                acquired = lock.tryLock(200, TimeUnit.MILLISECONDS);
                System.out.println("Contender acquired lock after wait? " + acquired); // true
                if (acquired) {
                    lock.unlock();
                }
            } catch (InterruptedException ignored) {}
        });

        holder.start();
        contender.start();
        holder.join();
        contender.join();

        // 2. Lock-free AtomicInteger Compare-And-Swap (CAS)
        AtomicInteger metricsCounter = new AtomicInteger(100);
        int current = metricsCounter.get();
        boolean swapped = metricsCounter.compareAndSet(100, 150);
        System.out.println("\nAtomic CAS from 100 to 150 successful? " + swapped);
        System.out.println("Atomic Counter after incrementAndGet: " + metricsCounter.incrementAndGet());

        // 3. Lock-free AtomicReference CAS
        AtomicReference<String> stateHolder = new AtomicReference<>("INITIAL");
        stateHolder.compareAndSet("INITIAL", "ACTIVE");
        System.out.println("Atomic Reference Current State: " + stateHolder.get());
    }
}
