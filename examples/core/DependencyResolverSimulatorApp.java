import java.util.HashMap;
import java.util.Map;

public class DependencyResolverSimulatorApp {
    record DependencyNode(String name, String version, int depth) {}

    public static void main(String[] args) {
        System.out.println("Starting Build Tool Dependency Conflict Simulator...");

        // Simulate conflict scenario:
        // Root depends on Lib-A (depth 1) which transitively brings Common-Utils:1.0.0 (depth 2)
        // Root depends directly on Common-Utils:2.1.0 (depth 1)
        // Another branch brings Common-Utils:3.0.0 (depth 3)
        DependencyNode directDep = new DependencyNode("common-utils", "2.1.0", 1);
        DependencyNode transDepA = new DependencyNode("common-utils", "1.0.0", 2);
        DependencyNode transDepB = new DependencyNode("common-utils", "3.0.0", 3);

        // 1. Maven Strategy: "Nearest Definition Wins"
        String mavenChosen = resolveMavenNearest(directDep, transDepA, transDepB);
        System.out.println("Maven Resolution (Nearest Definition Wins):   " + mavenChosen);

        // 2. Gradle Strategy: "Latest Version Wins by Default"
        String gradleChosen = resolveGradleLatest(directDep, transDepA, transDepB);
        System.out.println("Gradle Resolution (Highest Version Wins):     " + gradleChosen);

        System.out.println("Dependency conflict resolution comparison completed successfully.");
    }

    private static String resolveMavenNearest(DependencyNode... nodes) {
        DependencyNode nearest = nodes[0];
        for (DependencyNode node : nodes) {
            if (node.depth() < nearest.depth()) {
                nearest = node;
            }
        }
        return nearest.name() + ":" + nearest.version() + " (Selected at depth " + nearest.depth() + ")";
    }

    private static String resolveGradleLatest(DependencyNode... nodes) {
        DependencyNode highest = nodes[0];
        for (DependencyNode node : nodes) {
            if (compareSemver(node.version(), highest.version()) > 0) {
                highest = node;
            }
        }
        return highest.name() + ":" + highest.version() + " (Selected latest semver)";
    }

    private static int compareSemver(String v1, String v2) {
        String[] parts1 = v1.split("\\.");
        String[] parts2 = v2.split("\\.");
        for (int i = 0; i < Math.min(parts1.length, parts2.length); i++) {
            int n1 = Integer.parseInt(parts1[i]);
            int n2 = Integer.parseInt(parts2[i]);
            if (n1 != n2) return Integer.compare(n1, n2);
        }
        return Integer.compare(parts1.length, parts2.length);
    }
}
