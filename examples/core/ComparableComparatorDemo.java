import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Topic 39: Comparable & Comparator - Basic Example
 * Demonstrates natural ordering via Comparable and customizable multi-field sorting via Comparator.
 */
public class ComparableComparatorDemo {

    // Natural ordering implemented via Comparable
    public record ServerNode(String hostname, int latencyMs) implements Comparable<ServerNode> {
        @Override
        public int compareTo(ServerNode other) {
            // Natural sort order: lowest latency first
            return Integer.compare(this.latencyMs, other.latencyMs);
        }
    }

    public static void main(String[] args) {
        List<ServerNode> cluster = new ArrayList<>();
        cluster.add(new ServerNode("us-east-1", 45));
        cluster.add(new ServerNode("eu-central-1", 120));
        cluster.add(new ServerNode("ap-southeast-1", 85));
        cluster.add(new ServerNode("us-west-2", 45));

        // 1. Natural sort (Comparable)
        Collections.sort(cluster);
        System.out.println("Sorted by Natural Order (Latency Ascending):");
        for (ServerNode node : cluster) {
            System.out.println("  " + node.hostname() + " -> " + node.latencyMs() + "ms");
        }

        // 2. Custom sort using Comparator chained methods: latency first, then hostname alphabetical
        cluster.sort(
                Comparator.comparingInt(ServerNode::latencyMs)
                          .thenComparing(ServerNode::hostname)
        );
        System.out.println("\nSorted with Chained Comparator (Latency, then Hostname):");
        for (ServerNode node : cluster) {
            System.out.println("  " + node.hostname() + " -> " + node.latencyMs() + "ms");
        }
    }
}
