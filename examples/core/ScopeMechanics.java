public class ScopeMechanics {

    // Class/Field level scope: accessible throughout all methods in the class
    private static int globalCounter = 100;

    public static void testShadowingAndLifetime() {
        int count = 10; // Method scope
        System.out.println("Method scope count: " + count);

        {
            // Inner block scope
            int innerValue = 999;
            // Shadowing globalCounter locally within this block
            int globalCounter = 55; 
            System.out.println("Inner block value: " + innerValue);
            System.out.println("Shadowed globalCounter inside block: " + globalCounter);
            System.out.println("Explicit ClassName.globalCounter: " + ScopeMechanics.globalCounter);
        }
        // innerValue is NOT accessible here; out of scope and memory reclaimable

        // Loop scope
        for (int i = 0; i < 3; i++) {
            int iterationSecret = i * 10;
            System.out.printf("Loop iteration %d: secret = %d%n", i, iterationSecret);
        }
        // 'i' and 'iterationSecret' are out of scope here
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Variable Scope & Shadowing Demonstration ===");
        System.out.println("Class-level globalCounter before: " + globalCounter);
        testShadowingAndLifetime();
        System.out.println("Class-level globalCounter after: " + globalCounter);
    }
}
