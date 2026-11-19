import java.util.Arrays;

public class FleetInventoryManager {

    public static void main(String[] args) {
        System.out.println("=== Fleet Vehicle Part Inventory Management ===");

        // Serial numbers of vehicle components in warehouse
        int[] partSerialNumbers = { 8840, 1024, 5510, 3090, 7720, 4400, 2190 };
        System.out.println("Original Unsorted Serials: " + Arrays.toString(partSerialNumbers));

        // 1. Dual-Pivot Quicksort via Arrays.sort()
        Arrays.sort(partSerialNumbers);
        System.out.println("Sorted Serials (O(N log N)): " + Arrays.toString(partSerialNumbers));

        // 2. Logarithmic Binary Search (requires pre-sorted array)
        int targetPart = 5510;
        int foundIndex = Arrays.binarySearch(partSerialNumbers, targetPart);
        System.out.printf("Binary search for serial %d -> Found at index %d%n", targetPart, foundIndex);

        int missingPart = 9999;
        int missingIndex = Arrays.binarySearch(partSerialNumbers, missingPart);
        System.out.printf("Binary search for missing serial %d -> Insertion point index: %d%n",
                missingPart, missingIndex);

        // 3. Array Copying & Resizing
        int[] expandedCatalog = Arrays.copyOf(partSerialNumbers, partSerialNumbers.length + 3);
        // Fill newly allocated buffer slots with default inventory code -1
        Arrays.fill(expandedCatalog, partSerialNumbers.length, expandedCatalog.length, -1);
        System.out.println("Expanded Inventory Buffer: " + Arrays.toString(expandedCatalog));
    }
}
