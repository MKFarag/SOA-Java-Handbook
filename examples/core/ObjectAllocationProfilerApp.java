import java.util.ArrayList;
import java.util.List;

public class ObjectAllocationProfilerApp {
    record SensorPacket(long timestamp, int deviceId, double reading) {}

    public static void main(String[] args) {
        System.out.println("Starting Memory Allocation Profiler...");

        Runtime runtime = Runtime.getRuntime();
        long initialUsed = runtime.totalMemory() - runtime.freeMemory();

        // 1. Transient Young Generation Allocation
        long sum = 0;
        for (int i = 0; i < 50_000; i++) {
            SensorPacket packet = new SensorPacket(System.currentTimeMillis(), i, i * 1.5);
            sum += packet.deviceId();
        }
        System.out.println("Processed 50,000 transient objects. Checksum: " + sum);

        // 2. Retained Old Generation Allocation
        List<SensorPacket> retainedLedger = new ArrayList<>(10_000);
        for (int i = 0; i < 10_000; i++) {
            retainedLedger.add(new SensorPacket(System.currentTimeMillis(), i, i * 2.0));
        }

        long finalUsed = runtime.totalMemory() - runtime.freeMemory();
        long delta = finalUsed - initialUsed;

        System.out.println("Retained Ledger Size: " + retainedLedger.size() + " items");
        System.out.printf("Heap Memory Delta:    ~%,d bytes%n", Math.max(0, delta));
        System.out.println("Allocation profiling completed successfully.");
    }
}
