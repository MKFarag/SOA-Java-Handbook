import java.lang.management.GarbageCollectorMXBean;
import java.lang.management.ManagementFactory;
import java.util.List;

public class HeapPressureAnalyzerApp {
    public static void main(String[] args) {
        System.out.println("Starting Heap Pressure & GC Metric Analyzer...");

        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        for (GarbageCollectorMXBean gc : gcBeans) {
            System.out.printf("  Collector: %-25s | Collections: %d | Time: %dms%n",
                    gc.getName(), gc.getCollectionCount(), gc.getCollectionTime());
        }

        // Simulate high transient memory churn (Young Gen allocations)
        long totalAllocated = 0;
        for (int batch = 0; batch < 1000; batch++) {
            byte[] transientBuffer = new byte[1024]; // 1 KB transient chunk
            transientBuffer[0] = (byte) (batch % 127);
            totalAllocated += transientBuffer.length;
        }

        System.out.println("Allocated & Discarded: " + (totalAllocated / 1024) + " KB transient chunks");
        System.out.println("Garbage Collection Metrics Polled Successfully.");
    }
}
