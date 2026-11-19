public class ArrayMechanics {

    public static void main(String[] args) {
        System.out.println("=== 1. Array Allocation & Default Heap Values ===");
        // Allocated on Heap: primitives receive default values (0 for int)
        int[] numbers = new int[4];
        System.out.printf("Defaults: [%d, %d, %d, %d]%n",
                numbers[0], numbers[1], numbers[2], numbers[3]);

        // String array: elements default to null references
        String[] labels = new String[2];
        System.out.printf("String defaults: [%s, %s]%n", labels[0], labels[1]);

        System.out.println("\n=== 2. Array Population & Fixed Length ===");
        numbers[0] = 10;
        numbers[1] = 20;
        numbers[2] = 30;
        numbers[3] = 40;
        System.out.println("Array length: " + numbers.length);

        System.out.println("\n=== 3. Enhanced for-each vs Indexed Traversal ===");
        int sum = 0;
        for (int value : numbers) {
            sum += value;
        }
        System.out.println("Sum computed via enhanced for-loop: " + sum);

        System.out.println("\n=== 4. Boundary Protection ===");
        try {
            int outOfBounds = numbers[numbers.length]; // Index 4 is invalid (valid: 0..3)
            System.out.println("Value: " + outOfBounds);
        } catch (ArrayIndexOutOfBoundsException ex) {
            System.out.println("Caught Expected Exception: " + ex.getClass().getSimpleName() + " for index " + numbers.length);
        }
    }
}
