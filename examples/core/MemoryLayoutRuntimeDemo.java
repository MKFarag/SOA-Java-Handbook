import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;

public class MemoryLayoutRuntimeDemo {
    public static void main(String[] args) {
        System.out.println("=== JVM Memory Areas & Stack Inspection ===");

        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long usedMemory = totalMemory - freeMemory;

        System.out.println("Available CPU Cores: " + runtime.availableProcessors());
        System.out.printf("Max Heap Memory:     %,d bytes (%.1f MB)%n", maxMemory, maxMemory / (1024.0 * 1024.0));
        System.out.printf("Total Allocated:     %,d bytes (%.1f MB)%n", totalMemory, totalMemory / (1024.0 * 1024.0));
        System.out.printf("Used Heap Memory:    %,d bytes%n", usedMemory);

        MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
        System.out.println("Non-Heap (Metaspace): " + memoryBean.getNonHeapMemoryUsage().getUsed() / 1024 + " KB");

        // Inspect Call Stack Depth
        int measuredDepth = measureMaxStackDepth(0);
        System.out.println("Safely Measured Stack Frame Depth: " + measuredDepth);
    }

    private static int measureMaxStackDepth(int depth) {
        if (depth >= 500) {
            return depth; // Bounded to prevent StackOverflowError in verification
        }
        return measureMaxStackDepth(depth + 1);
    }
}
