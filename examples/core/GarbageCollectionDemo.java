import java.lang.ref.Cleaner;
import java.lang.ref.WeakReference;

public class GarbageCollectionDemo {
    private static final Cleaner CLEANER = Cleaner.create();

    static class NativeResourceWrapper implements Runnable {
        private final String resourceId;

        NativeResourceWrapper(String resourceId) {
            this.resourceId = resourceId;
        }

        @Override
        public void run() {
            System.out.println("  [Cleaner Callback] Reclaiming native handle for: " + resourceId);
        }
    }

    static class ManagedResource {
        private final Cleaner.Cleanable cleanable;

        ManagedResource(String id) {
            this.cleanable = CLEANER.register(this, new NativeResourceWrapper(id));
        }
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== 1. WeakReference Mechanics ===");
        Object strongObject = new String("Transient Cache Payload");
        WeakReference<Object> weakRef = new WeakReference<>(strongObject);

        System.out.println("WeakRef holds value: " + (weakRef.get() != null));
        strongObject = null; // Clear strong reference

        System.gc(); // Suggest GC pass
        Thread.sleep(50);
        System.out.println("WeakRef cleared after GC: " + (weakRef.get() == null));

        System.out.println("\n=== 2. java.lang.ref.Cleaner (Modern Finalization) ===");
        allocateAndDiscard();
        System.gc();
        Thread.sleep(100);
        System.out.println("Cleaner execution completed.");
    }

    private static void allocateAndDiscard() {
        new ManagedResource("SOCKET-FD-4091");
    }
}
