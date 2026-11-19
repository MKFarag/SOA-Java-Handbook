import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Topic 43: Stream API: Terminal Operations & Collectors - Basic Example
 * Demonstrates reduce(), and key Collectors: groupingBy, partitioningBy, joining, and counting.
 */
public class StreamCollectorsDemo {

    public record DeviceMetric(String deviceType, String status, int cpuUsage) {}

    public static void main(String[] args) {
        List<DeviceMetric> telemetry = List.of(
                new DeviceMetric("Server", "ONLINE", 45),
                new DeviceMetric("Sensor", "OFFLINE", 0),
                new DeviceMetric("Server", "ONLINE", 82),
                new DeviceMetric("Gateway", "ONLINE", 23),
                new DeviceMetric("Sensor", "ONLINE", 12),
                new DeviceMetric("Gateway", "DEGRADED", 95)
        );

        // 1. Terminal reduce(): calculates total CPU load
        int totalCpuLoad = telemetry.stream()
                .map(DeviceMetric::cpuUsage)
                .reduce(0, Integer::sum);
        System.out.println("Total CPU Load: " + totalCpuLoad);

        // 2. Collectors.joining(): format device names into a single string
        String onlineTypes = telemetry.stream()
                .filter(d -> d.status().equals("ONLINE"))
                .map(DeviceMetric::deviceType)
                .distinct()
                .collect(Collectors.joining(", ", "Active Types: [", "]"));
        System.out.println(onlineTypes);

        // 3. Collectors.partitioningBy(): split into healthy (< 80% CPU) vs overloaded (>= 80%)
        Map<Boolean, List<DeviceMetric>> partitionedByLoad = telemetry.stream()
                .collect(Collectors.partitioningBy(d -> d.cpuUsage() >= 80));
        System.out.println("Overloaded Devices Count (>= 80%): " + partitionedByLoad.get(true).size());
        System.out.println("Normal Devices Count (< 80%):       " + partitionedByLoad.get(false).size());

        // 4. Collectors.groupingBy() with downstream counting():
        Map<String, Long> deviceCountByType = telemetry.stream()
                .collect(Collectors.groupingBy(DeviceMetric::deviceType, Collectors.counting()));
        System.out.println("Device Count by Type: " + deviceCountByType);
    }
}
