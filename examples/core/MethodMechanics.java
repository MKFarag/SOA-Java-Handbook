public class MethodMechanics {

    // Primitive parameter: receives a copy of the primitive value (bits)
    public static void modifyPrimitive(int value) {
        value = value * 2;
        System.out.println("Inside modifyPrimitive: value = " + value);
    }

    // Reference parameter: receives a copy of the reference address
    public static void modifyArray(int[] numbers) {
        numbers[0] = 999; // Mutates the underlying array on the heap
        System.out.println("Inside modifyArray: numbers[0] = " + numbers[0]);
    }

    // Reference re-assignment: changing where the local reference points does NOT affect caller
    public static void reassignReference(int[] numbers) {
        numbers = new int[]{100, 200, 300}; // Points to a brand new heap object
        System.out.println("Inside reassignReference: numbers[0] = " + numbers[0]);
    }

    // Method with return value
    public static double calculateInterest(double principal, double annualRatePercent, int years) {
        double rate = annualRatePercent / 100.0;
        return principal * Math.pow(1.0 + rate, years);
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Pass-by-Value with Primitives ===");
        int originalNumber = 50;
        System.out.println("Before modifyPrimitive: " + originalNumber);
        modifyPrimitive(originalNumber);
        System.out.println("After modifyPrimitive: " + originalNumber + " (unchanged)");

        System.out.println("\n=== 2. Pass-by-Value with Object References (Mutation) ===");
        int[] scores = {10, 20, 30};
        System.out.println("Before modifyArray: scores[0] = " + scores[0]);
        modifyArray(scores);
        System.out.println("After modifyArray: scores[0] = " + scores[0] + " (mutated on heap)");

        System.out.println("\n=== 3. Pass-by-Value with Reference Reassignment ===");
        reassignReference(scores);
        System.out.println("After reassignReference: scores[0] = " + scores[0] + " (original caller reference untouched)");

        System.out.println("\n=== 4. Method Return Value Calculation ===");
        double futureValue = calculateInterest(1000.0, 5.0, 3);
        System.out.printf("Principal 1000.0 at 5%% for 3 years: %.2f%n", futureValue);
    }
}
