import java.util.Arrays;

public class JaggedArrayDemo {

    public static void main(String[] args) {
        System.out.println("=== 1. Jagged / Ragged Array Allocation ===");
        // In Java, multi-dimensional arrays are arrays of independent array references
        int[][] networkTopology = new int[3][];
        networkTopology[0] = new int[]{ 10, 11 };             // Rack 0: 2 switches
        networkTopology[1] = new int[]{ 20, 21, 22, 23 };     // Rack 1: 4 switches
        networkTopology[2] = new int[]{ 30 };                 // Rack 2: 1 switch

        System.out.println("Visualizing with Arrays.deepToString():");
        System.out.println(Arrays.deepToString(networkTopology));

        System.out.println("\n=== 2. Row-Major Matrix Traversal ===");
        for (int rackIndex = 0; rackIndex < networkTopology.length; rackIndex++) {
            System.out.printf("Rack %d (Ports: %d): ", rackIndex, networkTopology[rackIndex].length);
            for (int portIndex = 0; portIndex < networkTopology[rackIndex].length; portIndex++) {
                System.out.printf("[%d] ", networkTopology[rackIndex][portIndex]);
            }
            System.out.println();
        }

        System.out.println("\n=== 3. Deep Equality vs Shallow Equality ===");
        int[][] replica = {
            { 10, 11 },
            { 20, 21, 22, 23 },
            { 30 }
        };

        // Shallow equals checks if reference pointers to sub-arrays match (returns false)
        System.out.println("Arrays.equals() (shallow): " + Arrays.equals(networkTopology, replica));
        // Deep equals recursively checks contents of inner elements (returns true)
        System.out.println("Arrays.deepEquals() (deep) : " + Arrays.deepEquals(networkTopology, replica));
    }
}
